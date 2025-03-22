from flask import Blueprint, jsonify, request
from ..models.profile_model import Profile
from ..utils.database import get_db_connection
from Algorithm.main import find_top_matches, initialize_algorithm, compute_similarity
import numpy as np  # Add this import

matching_bp = Blueprint('matching', __name__)


@matching_bp.route('/matching/<int:user_id>', methods=['GET'])
def generate_matches(user_id):
    """
    Generate matches for a user using the algorithm.
    """
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

    # Convert NumPy types to native Python types
    for match in top_matches:
        match["score"] = float(match["score"])  # Convert numpy.float64 to float
        match["match_user_id"] = int(match["match_user_id"])  # Convert numpy.int64 to int

    # Return matches as JSON
    return jsonify(top_matches), 200
