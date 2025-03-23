import jwt
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta

from ..models.user_model import User
from ..utils.database import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Handle user signup.
    """
    data = request.get_json()
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    email = data.get('email')
    password = data.get('password')

    # Check if the email is already registered
    conn = get_db_connection()
    existing_user = conn.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    if existing_user:
        conn.close()
        return jsonify({"error": "Email already registered"}), 400

    # Create a new user
    User.create(first_name, last_name, email, password)
    conn.close()

    return jsonify({"message": "Signup successful"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.validate_login(data['email'], data['password'])

    if user:
        conn = get_db_connection()
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user_id": user.id
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401