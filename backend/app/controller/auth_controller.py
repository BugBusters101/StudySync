import jwt
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta

from ..models.user_model import User
from ..utils.database import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cur.fetchone()
        
        if existing_user:
            return jsonify({"error": "Account with this email already exists"}), 409
            
        User.create(first_name, last_name, email, password)
        user = User.validate_login(email, password)
        
        # Fire automatic overlap matching algorithm dynamically
        try:
            from seed_data import generate_matches
            generate_matches(user.id)
        except ImportError as e:
            print(f"Warning: Could not trigger seed matching - {e}")
            pass
        
        token = jwt.encode({
            'user_id': user.id,
            'first_name': first_name,
            'is_new_user': True,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
    finally:
        conn.close()

    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "isNewUser": True,
        "user_id": user.id,
        "first_name": first_name
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.validate_login(email, password)

    if user:
        conn = get_db_connection()
        # Generate JWT token with full tracking payload
        token = jwt.encode({
            'user_id': user.id,
            'first_name': user.first_name,
            'is_new_user': user.is_new_user,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user_id": user.id,
            "isNewUser": user.is_new_user,
            "first_name": user.first_name
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
def get_me():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Token is missing"}), 401
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, first_name, last_name, email FROM users WHERE id = %s", (user_id,))
        user_row = cur.fetchone()
        conn.close()
        if user_row:
            return jsonify(dict(user_row)), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 401