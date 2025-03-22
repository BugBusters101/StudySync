# algorithm/data.py
import pandas as pd

def load_mock_users():
    """Mock data with location (in-person or virtual + details)"""
    mock_users = [
        {
            "id": 1,
            "subjects": ["Math", "Machine Learning"],
            "availability": ["mornings", "afternoons"],
            "learning_style": "visual",
            "location": {"type": "in-person", "details": "University Library"}  # Added location
        },
        {
            "id": 2,
            "subjects": ["Machine Learning", "Physics"],
            "availability": ["evenings"],
            "learning_style": "auditory",
            "location": {"type": "virtual", "details": "Zoom"}  # Added location
        },
        {
            "id": 3,
            "subjects": ["Math", "Data Science"],
            "availability": ["mornings"],
            "learning_style": "hands-on",
            "location": {"type": "in-person", "details": "Cafeteria"}  # Added location
        }
    ]
    return pd.DataFrame(mock_users)