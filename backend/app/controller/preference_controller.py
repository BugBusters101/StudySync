# backend/app/controller/preferences_controller.py

from flask import Blueprint, request, jsonify
from ..utils.database import get_db_connection
from flask_login import login_required, current_user

preferences_bp = Blueprint('preferences', __name__)

@preferences_bp.route('/preferences', methods=['POST'])
@login_required
def save_preferences():
    data = request.get_json()
    user_id = current_user.id
    subjects = data.get('subjects', [])
    availability = data.get('availability', {})
    learning_style = data.get('learning_style', '')
    location_type = data.get('location_type', [])
    location_details = data.get('location_details', [])
    subjects = data.get('subjects')
    availability = data.get('availability')
    learning_style = data.get('learning_style')
    location_type = data.get('location_type')
    location_details = data.get('location_details')

    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO Profile (user_id, subjects, availability, learning_style, location_type, location_details) VALUES (?, ?, ?, ?, ?, ?)',
            (user_id, subjects, availability, learning_style, location_type, location_details)
        )
        conn.commit()
        return jsonify({"message": "Preferences saved successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500
    finally:
        conn.close()