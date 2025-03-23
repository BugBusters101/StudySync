# backend/app/controller/preferences_controller.py
from functools import wraps
from idlelib.debugger_r import debugging

import jwt
from flask import Blueprint, request, jsonify, json, current_app
from ..utils.database import get_db_connection

preferences_bp = Blueprint('preferences', __name__)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Decode the token
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

@preferences_bp.route('/preferences', methods=['POST'])
@token_required
def save_preferences(**kwargs):

    try:
        user_id = kwargs.get('user_id')
        print(user_id)
        # Get the preferences data from the request body
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        data = request.get_json()

        subjects = data.get('courses', [])
        days_of_week = data.get('days_of_week', [])
        time_slots = data.get('timeSlots', [])
        learning_style = data.get('learning_style', [])
        location_type = data.get('location_type', [])
        location_details = data.get('location_details', [])
        print(user_id, subjects, days_of_week, time_slots, location_type, location_details)

        conn = get_db_connection()
        conn.execute(
                'INSERT OR REPLACE INTO Profile (user_id, subjects, days_of_week, availability, learning_style, location_type, location_details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (user_id, json.dumps(subjects), json.dumps(days_of_week), json.dumps(time_slots), json.dumps(learning_style), json.dumps(location_type), json.dumps(location_details))
            )
        conn.commit()
        return jsonify({"message": "Preferences saved successfully"}), 201

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500
    finally:
        conn.close()