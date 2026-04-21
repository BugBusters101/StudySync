from flask import Blueprint, request, jsonify, current_app
from flask_socketio import emit, join_room, leave_room
from ..utils.database import get_db_connection
from ..models.message_model import Message
import jwt
from functools import wraps
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

chat_bp = Blueprint('chat', __name__)

active_users = {}  # {session_id: user_id}
user_rooms = {}    # {user_id: [room_ids]}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            kwargs['user_id'] = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated

def token_required_socket(f):
    """Decorator to require JWT token for socket events"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            emit('error', {'message': 'Token is missing'})
            return False
        
        try:
            from flask import current_app
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            kwargs['user_id'] = data['user_id']
        except jwt.ExpiredSignatureError:
            emit('error', {'message': 'Token has expired'})
            return False
        except jwt.InvalidTokenError:
            emit('error', {'message': 'Invalid token'})
            return False
        
        return f(*args, **kwargs)
    return decorated

def register_socket_events(socketio):
    """Register socket events with the socketio instance"""
    
    @socketio.on('connect')
    @token_required_socket
    def handle_connect(user_id):
        """Handle user connection"""
        active_users[request.sid] = user_id
        user_rooms[user_id] = []
        
        # Join personal room for notifications immediately on connection
        personal_room = f"user_ns_{user_id}"
        join_room(personal_room)
        
        logging.debug(f"[ChatEvent - CONNECT] User {user_id} joined personal room {personal_room}")
        emit('connected', {'message': 'Connected to chat', 'user_id': user_id})

    @socketio.on('join_room')
    @token_required_socket
    def handle_join_room(data, user_id):
        """Join a chat room (between two users)"""
        other_user_id = data.get('other_user_id')
        if not other_user_id:
            emit('error', {'message': 'other_user_id is required'})
            return
        
        # Create room name (sorted to ensure consistency)
        room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
        
        join_room(room_name)
        
        # Also join a personal room for direct notification pushing
        personal_room = f"user_ns_{user_id}"
        join_room(personal_room)
        
        if user_id not in user_rooms:
            user_rooms[user_id] = []
        
        emit('joined_room', {'room': room_name, 'other_user_id': other_user_id})
        
        # Load recent messages for this room
        recent_messages = Message.get_recent_messages(user_id, other_user_id, limit=50)
        if room_name not in user_rooms[user_id]:
            user_rooms[user_id].append(room_name)
        logging.debug(f"[ChatEvent - JOIN] User {user_id} joined room {room_name}")
        emit('message_history', {'messages': recent_messages})

    @socketio.on('send_message')
    @token_required_socket
    def handle_message(data, user_id):
        """Handle incoming chat messages"""
        other_user_id = data.get('other_user_id')
        message_text = data.get('message')
        logging.debug(f"[ChatEvent - SEND_MSG] Received data from User {user_id} to User {other_user_id}: {message_text}")
        
        if not other_user_id or not message_text:
            emit('error', {'message': 'other_user_id and message are required'})
            return
        
        # Create room name
        room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
        
        # Save message to database
        message = Message.create(user_id, other_user_id, message_text)
        
        # Also write to notification table for unread tracking
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO notifications (message_id, user_id, read_status) VALUES (%s, %s, 0)', (message['id'], other_user_id))
        conn.commit()
        conn.close()
        
        # Emit message to room
        emit('new_message', {
            'id': message['id'],
            'sender_id': user_id,
            'receiver_id': other_user_id,
            'message': message_text,
            'timestamp': str(message['created_at']),
            'is_read': 0
        }, room=room_name)
        logging.debug(f"[ChatEvent - SEND_MSG] Saved to DB and Emitted Payload out to Room {room_name}")
        
        # Emit notification directly to recipient's personal room
        emit('new_notification', {
           'message_id': message['id'],
           'sender_id': user_id
        }, room=f"user_ns_{other_user_id}")
        logging.debug(f"[ChatEvent - NOTIFICATIONS] Explicit Unread Indicator fired against unique namespace user_ns_{other_user_id}")

    @socketio.on('typing')
    @token_required_socket
    def handle_typing(data, user_id):
        other_user_id = data.get('other_user_id')
        if other_user_id:
            room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
            logging.debug(f"[ChatEvent - TYPING] User {user_id} is typing to {other_user_id}. Emitting to {room_name} without echo.")
            emit('user_typing', {'user_id': user_id}, room=room_name, include_self=False)

    @socketio.on('mark_read')
    @token_required_socket
    def handle_mark_read(data, user_id):
        other_user_id = data.get('other_user_id')
        if other_user_id:
            logging.debug(f"[ChatEvent - MARK_READ] User {user_id} intercepting message payload. Marking messages from {other_user_id} as READ.")
            conn = get_db_connection()
            cur = conn.cursor()
            # Mark messages received from `other_user_id` as read
            cur.execute('UPDATE messages SET is_read = 1 WHERE sender_id = %s AND receiver_id = %s AND is_read = 0', (other_user_id, user_id))
            
            # Clear associated notifications 
            cur.execute('''
                UPDATE notifications 
                SET read_status = 1 
                WHERE user_id = %s AND message_id IN (
                    SELECT id FROM messages WHERE sender_id = %s AND receiver_id = %s
                )
            ''', (user_id, other_user_id, user_id))
            conn.commit()
            
            room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
            emit('messages_read', {'reader_id': user_id, 'sender_id': other_user_id}, room=room_name)
            
            # Recalculate and emit NEW total unread count to current user
            cur.execute('SELECT COUNT(*) FROM notifications WHERE user_id = %s AND read_status = 0', (user_id,))
            row = cur.fetchone()
            total_unread = row['count'] if hasattr(row, 'keys') else row[0]
            emit('total_unread_update', {'total_unread': total_unread}, room=f"user_ns_{user_id}")
            
            conn.close()

    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle user disconnection"""
        user_id = active_users.pop(request.sid, None)
        if user_id and user_id in user_rooms:
            # Leave all rooms
            for room in user_rooms[user_id]:
                leave_room(room)
            del user_rooms[user_id]

@chat_bp.route('/chat/contacts', methods=['GET'])
@token_required
def get_contacts(**kwargs):
    """Get all contacts with message history and unread counts for a user"""
    user_id = kwargs.get('user_id')
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        # Fetch people user has messaged, joined with unread notification counts
        query = """
            SELECT DISTINCT 
                u.id as match_user_id, u.first_name, u.last_name, u.email,
                (SELECT COUNT(*) FROM notifications n 
                 WHERE n.user_id = %s AND n.read_status = 0 
                 AND n.message_id IN (SELECT id FROM messages WHERE sender_id = u.id AND receiver_id = %s)
                ) as unread_count
            FROM messages msg
            JOIN users u ON (CASE WHEN msg.sender_id = %s THEN msg.receiver_id ELSE msg.sender_id END) = u.id
            WHERE msg.sender_id = %s OR msg.receiver_id = %s
        """
        cur.execute(query, (user_id, user_id, user_id, user_id, user_id))
        history = cur.fetchall()
        
        return jsonify([dict(h) for h in history]), 200
    finally:
        conn.close()

@chat_bp.route('/chat/unread/total', methods=['GET'])
@token_required
def get_total_unread(**kwargs):
    """Get total unread notification count for current user"""
    user_id = kwargs.get('user_id')
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM notifications WHERE user_id = %s AND read_status = 0', (user_id,))
        row = cur.fetchone()
        unread = row['count'] if hasattr(row, 'keys') else row[0]
        return jsonify({"total_unread": unread}), 200
    finally:
        conn.close()

@chat_bp.route('/chat/messages/<int:other_user_id>', methods=['GET'])
@token_required
def get_messages(other_user_id, **kwargs):
    """Get messages between current user and another user"""
    user_id = kwargs.get('user_id')
    messages = Message.get_recent_messages(user_id, other_user_id)
    return jsonify(messages), 200