from functools import wraps

import jwt
from flask import Blueprint, request, jsonify, current_app
from ..utils.database import get_db_connection

chat_bp = Blueprint('chat', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]

            # Decode the token
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            print("Decoded Token Data:", data)  # Debug: Log decoded data
            kwargs['user_id'] = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            print("Token Validation Error:", str(e))  # Debug: Log the error
            return jsonify({"error": "Invalid token"}), 401

        return f( *args, **kwargs)
    return decorated

@chat_bp.route('/chat/messages', methods=['POST'])
@token_required
def send_message(**kwargs):
    sender_id = kwargs.get('user_id')
    data = request.get_json()

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