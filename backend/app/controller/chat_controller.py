from flask import Blueprint, request, jsonify
from ..utils.database import get_db_connection

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat/messages', methods=['POST'])
def send_message():
    data = request.get_json()
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    message = data['message']

    conn = get_db_connection()
    conn.execute(
        'INSERT INTO ChatMessage (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        (sender_id, receiver_id, message)
    )
    conn.commit()
    conn.close()

    return jsonify({'status': 'Message sent'}), 201

@chat_bp.route('/chat/<int:user_id>/<int:match_id>', methods=['GET'])
def get_messages(user_id, match_id):
    conn = get_db_connection()
    messages = conn.execute(
        'SELECT * FROM ChatMessage WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
        (user_id, match_id, match_id, user_id)
    ).fetchall()
    conn.close()

    return jsonify([dict(msg) for msg in messages]), 200

@chat_bp.route('/chat/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT id, first_name, last_name FROM users').fetchall()
    conn.close()

    return jsonify([{'id': user['id'], 'name': f"{user['first_name']} {user['last_name']}"} for user in users]), 200