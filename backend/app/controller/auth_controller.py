from flask import Blueprint, request, jsonify
from ..models.user_model import User
from ..utils.database import get_db_connection
from werkzeug.security import check_password_hash

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
        "SELECT * FROM User WHERE email = ?", (email,)
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
    """
    Handle user login.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate user credentials
    user = User.find_by_email(email)
    if user and check_password_hash(user['password_hash'], password):
        return jsonify({"message": "Login successful"}), 200

    return jsonify({"error": "Invalid credentials"}), 401