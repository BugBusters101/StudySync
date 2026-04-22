# backend/app/controller/preferences_controller.py
from functools import wraps
import json
import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from ..utils.database import get_db_connection, exec_sql

preferences_bp = Blueprint('preferences', __name__)


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


@preferences_bp.route('/preferences', methods=['GET'])
@token_required
def get_preferences(**kwargs):
    """Fetch the saved preferences for the current user."""
    user_id = kwargs.get('user_id')
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        exec_sql(cur, conn, 'SELECT * FROM Profile WHERE user_id = %s', (user_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({}), 200
        prefs = dict(row)
        for field in ['subjects', 'days_of_week', 'availability', 'learning_style', 'location_type', 'location_details']:
            if isinstance(prefs.get(field), str):
                try:
                    prefs[field] = json.loads(prefs[field])
                except Exception:
                    prefs[field] = []
        return jsonify(prefs), 200
    finally:
        conn.close()


@preferences_bp.route('/preferences', methods=['POST'])
@token_required
def save_preferences(**kwargs):
    """Save/update preferences and auto-generate matches."""
    try:
        user_id = kwargs.get('user_id')
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        subjects         = data.get('courses', [])
        days_of_week     = data.get('days_of_week', [])
        time_slots       = data.get('timeSlots', [])
        learning_style   = data.get('learning_style', [])
        location_type    = data.get('location_type', [])
        location_details = data.get('location_details', [])

        conn = get_db_connection()
        cur = conn.cursor()
        
        # PostgreSQL ON CONFLICT syntax
        exec_sql(
            cur,
            conn,
            """INSERT INTO Profile (user_id, subjects, days_of_week, availability, learning_style, location_type, location_details)
               VALUES (%s, %s, %s, %s, %s, %s, %s)
               ON CONFLICT (user_id) DO UPDATE SET
               subjects = EXCLUDED.subjects,
               days_of_week = EXCLUDED.days_of_week,
               availability = EXCLUDED.availability,
               learning_style = EXCLUDED.learning_style,
               location_type = EXCLUDED.location_type,
               location_details = EXCLUDED.location_details""",
            (
                user_id,
                json.dumps(subjects), json.dumps(days_of_week), json.dumps(time_slots),
                json.dumps(learning_style), json.dumps(location_type), json.dumps(location_details)
            ),
        )
        exec_sql(cur, conn, 'UPDATE users SET is_new_user = 0 WHERE id = %s', (user_id,))
        conn.commit()

        # ── Auto-generate matches ──
        matches_data = []
        try:
            exec_sql(
                cur,
                conn,
                'SELECT p.*, u.first_name, u.last_name, u.email FROM Profile p JOIN users u ON p.user_id = u.id',
            )
            all_profiles_raw = cur.fetchall()
            all_profiles = []
            for profile in all_profiles_raw:
                p = dict(profile)
                for field in ['subjects', 'days_of_week', 'availability', 'learning_style', 'location_type', 'location_details']:
                    if isinstance(p.get(field), str):
                        try:
                            p[field] = json.loads(p[field])
                        except Exception:
                            p[field] = []
                all_profiles.append(p)

            if len(all_profiles) >= 2:
                from Algorithm.main import find_top_matches, initialize_algorithm, compute_similarity
                users_df, processed_users, q_agent = initialize_algorithm(all_profiles)
                similarity_matrix = compute_similarity(processed_users, q_agent.q_table)
                top_matches = find_top_matches(user_id, similarity_matrix, users_df, top_k=3)

                exec_sql(cur, conn, 'DELETE FROM Match WHERE user_id = %s', (user_id,))
                for m in top_matches:
                    exec_sql(
                        cur,
                        conn,
                        'INSERT INTO Match (user_id, match_user_id, score) VALUES (%s, %s, %s) '
                        'ON CONFLICT DO NOTHING',
                        (user_id, m['match_user_id'], m['score']),
                    )
                conn.commit()
                for m in top_matches:
                    matches_data.append({k: (v.item() if hasattr(v, 'item') else v) for k, v in m.items()})
        except Exception as algo_err:
            print(f"Match generation warning: {algo_err}")

        token = jwt.encode({
            'user_id': user_id,
            'is_new_user': False,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "message": "Preferences saved successfully",
            "token": token,
            "matches": matches_data
        }), 201

    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500
    finally:
        try:
            conn.close()
        except Exception:
            pass