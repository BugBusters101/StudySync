import jwt
from functools import wraps
import numpy as np
import json
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
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            kwargs['user_id'] = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            print("Token Validation Error:", str(e))
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated


@matching_bp.route('/matching/cached', methods=['GET'])
@token_required
def get_cached_matches(**kwargs):
    """Return pre-computed matches from the Match table (no algorithm rerun)."""
    user_id = kwargs.get('user_id')
    conn = get_db_connection()
    try:
        rows = conn.execute("""
            SELECT m.match_user_id, m.score,
                   u.first_name, u.last_name, u.email,
                   p.subjects, p.days_of_week, p.availability, p.learning_style, p.location_type
            FROM Match m
            JOIN users u ON m.match_user_id = u.id
            LEFT JOIN Profile p ON m.match_user_id = p.user_id
            WHERE m.user_id = ?
            ORDER BY m.score DESC
        """, (user_id,)).fetchall()

        me_row = conn.execute('SELECT * FROM Profile WHERE user_id = ?', (user_id,)).fetchone()
        me = dict(me_row) if me_row else {}
        for field in ['subjects', 'days_of_week', 'availability', 'learning_style', 'location_type']:
            if isinstance(me.get(field), str):
                try:
                    me[field] = json.loads(me[field])
                except Exception:
                    me[field] = []

        matches = []
        for row in rows:
            r = dict(row)
            them = {}
            for field in ['subjects', 'days_of_week', 'availability', 'learning_style', 'location_type']:
                val = r.pop(field, '[]')
                if isinstance(val, str):
                    try:
                        val = json.loads(val)
                    except Exception:
                        val = []
                them[field] = val

            r['shared_subjects'] = list(set(me.get('subjects', [])) & set(them.get('subjects', [])))
            r['shared_days']     = list(set(me.get('days_of_week', [])) & set(them.get('days_of_week', [])))
            r['shared_slots']    = list(set(me.get('availability', [])) & set(them.get('availability', [])))
            r['shared_style']    = list(set(me.get('learning_style', [])) & set(them.get('learning_style', [])))
            r['shared_location'] = list(set(me.get('location_type', [])) & set(them.get('location_type', [])))
            matches.append(r)

        return jsonify(matches), 200
    finally:
        conn.close()


@matching_bp.route('/matching', methods=['GET'])
@token_required
def generate_matches(**kwargs):
    """
    Generate matches for a user using the algorithm, enriched with user details.
    """
    user_id = kwargs.get('user_id')
    user_profile = Profile.find_by_user_id(user_id)
    if not user_profile:
        return jsonify({"error": "User profile not found in table"}), 404

    conn = get_db_connection()
    # Join with users table to get names
    query = """
        SELECT p.*, u.first_name, u.last_name, u.email 
        FROM Profile p
        JOIN users u ON p.user_id = u.id
    """
    all_profiles_raw = conn.execute(query).fetchall()
    conn.close()

    all_profiles = []
    for profile in all_profiles_raw:
        p = dict(profile)
        # Parse JSON strings from DB into Python lists
        for field in ['subjects', 'days_of_week', 'availability', 'learning_style', 'location_type', 'location_details']:
            if isinstance(p.get(field), str):
                try:
                    p[field] = json.loads(p[field])
                except Exception:
                    p[field] = []
        all_profiles.append(p)

    users_df, processed_users, q_agent = initialize_algorithm(all_profiles)

    similarity_matrix = compute_similarity(processed_users, q_agent.q_table)

    user_index = next((i for i, profile in enumerate(all_profiles) if profile["user_id"] == user_id), None)
    if user_index is None:
        return jsonify({"error": "User not found in profiles"}), 404

    top_matches = find_top_matches(user_id, similarity_matrix, users_df, top_k=3)

    serializable_matches = []
    for match in top_matches:
        serializable_match = {}
        for key, value in match.items():
            if isinstance(value, (np.int64, np.int32, np.float64, np.float32)):
                serializable_match[key] = int(value) if isinstance(value, (np.int64, np.int32)) else float(value)
            else:
                serializable_match[key] = value
        serializable_matches.append(serializable_match)

    return jsonify(serializable_matches), 200