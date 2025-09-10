from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
from ..utils.database import get_db_connection
from ..models.message_model import Message
import jwt
from functools import wraps

chat_bp = Blueprint('chat', __name__)

active_users = {}  # {session_id: user_id}
user_rooms = {}    # {user_id: [room_ids]}

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
        if user_id not in user_rooms:
            user_rooms[user_id] = []
        if room_name not in user_rooms[user_id]:
            user_rooms[user_id].append(room_name)
        
        emit('joined_room', {'room': room_name, 'other_user_id': other_user_id})
        
        # Load recent messages for this room
        recent_messages = Message.get_recent_messages(user_id, other_user_id, limit=50)
        emit('message_history', {'messages': recent_messages})

    @socketio.on('send_message')
    @token_required_socket
    def handle_message(data, user_id):
        """Handle incoming chat messages"""
        other_user_id = data.get('other_user_id')
        message_text = data.get('message')
        
        if not other_user_id or not message_text:
            emit('error', {'message': 'other_user_id and message are required'})
            return
        
        # Create room name
        room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
        
        # Save message to database
        message = Message.create(user_id, other_user_id, message_text)
        
        # Emit message to room
        emit('new_message', {
            'id': message['id'],
            'sender_id': user_id,
            'receiver_id': other_user_id,
            'message': message_text,
            'timestamp': message['created_at']
        }, room=room_name)

    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle user disconnection"""
        user_id = active_users.pop(request.sid, None)
        if user_id and user_id in user_rooms:
            # Leave all rooms
            for room in user_rooms[user_id]:
                leave_room(room)
            del user_rooms[user_id]

@chat_bp.route('/chat/rooms', methods=['GET'])
def get_chat_rooms():
    """Get all chat rooms for a user"""
    # This would typically require authentication
    # For now, return a simple response
    return jsonify({"message": "Chat rooms endpoint"}), 200

@chat_bp.route('/chat/messages/<int:other_user_id>', methods=['GET'])
def get_messages(other_user_id):
    """Get messages between current user and another user"""
    # This would typically require authentication and user_id from token
    # For now, return a simple response
    return jsonify({"message": f"Messages with user {other_user_id}"}), 200