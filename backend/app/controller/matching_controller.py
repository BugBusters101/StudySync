from functools import wraps
import numpy as mp
import jwt
import numpy as np
from flask import Blueprint, jsonify, request, current_app
from ..models.profile_model import Profile
from ..utils.database import get_db_connection
from Algorithm.main import find_top_matches, initialize_algorithm, compute_similarity

matching_bp = Blueprint('matching', __name__)

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


@matching_bp.route('/matching', methods=['GET'])
@token_required
def generate_matches(**kwargs):
    """
    Generate matches for a user using the algorithm.
    """
    user_id = kwargs.get('user_id')
    # Fetch the user's profile
    user_profile = Profile.find_by_user_id(user_id)
    if not user_profile:
        return jsonify({"error": "User profile not found"}), 404

    # Fetch all profiles from the database
    conn = get_db_connection()
    all_profiles = conn.execute("SELECT * FROM Profile").fetchall()
    conn.close()

    # Convert profiles to a list of dictionaries
    all_profiles = [dict(profile) for profile in all_profiles]

    # Initialize the algorithm
    users_df, processed_users, q_agent = initialize_algorithm()

    # Compute similarity matrix
    similarity_matrix = compute_similarity(processed_users, q_agent.q_table)

    # Find top matches for the user
    user_index = next((i for i, profile in enumerate(all_profiles) if profile["id"] == user_id), None)
    if user_index is None:
        return jsonify({"error": "User not found in profiles"}), 404

    top_matches = find_top_matches(user_index, similarity_matrix, users_df, top_k=3)

    serializable_matches = []
    for match in top_matches:
        serializable_match = {}
        for key, value in match.items():
            if isinstance(value, (np.int64, np.int32, np.float64, np.float32)):
                serializable_match[key] = int(value) if isinstance(value, (np.int64, np.int32)) else float(value)
            else:
                serializable_match[key] = value
        serializable_matches.append(serializable_match)

    # Return matches as JSON
    return jsonify(serializable_matches), 200