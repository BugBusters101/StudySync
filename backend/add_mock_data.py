from app.utils.database import get_db_connection

def add_mock_users():
    conn = get_db_connection()
    # Add mock users
    conn.execute(
        "INSERT INTO User (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
        ("John", "Doe", "john.doe@example.com", "hashed_password1")
    )
    conn.execute(
        "INSERT INTO User (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
        ("Jane", "Smith", "jane.smith@example.com", "hashed_password2")
    )
    conn.execute(
        "INSERT INTO User (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
        ("Alice", "Johnson", "alice.johnson@example.com", "hashed_password3")
    )
    conn.commit()

def add_mock_profiles():
    conn = get_db_connection()
    # Add mock profiles
    conn.execute(
        "INSERT INTO Profile (user_id, subjects, availability, learning_style, location_type, location_details) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (1, '["Math", "Machine Learning"]', '["mornings"]', 'visual', 'in-person', 'Library')
    )
    conn.execute(
        "INSERT INTO Profile (user_id, subjects, availability, learning_style, location_type, location_details) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (2, '["Machine Learning", "Physics"]', '["evenings"]', 'auditory', 'virtual', 'Zoom')
    )
    conn.execute(
        "INSERT INTO Profile (user_id, subjects, availability, learning_style, location_type, location_details) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (3, '["Math", "Data Science"]', '["mornings"]', 'visual', 'in-person', 'Cafeteria')
    )
    conn.commit()

if __name__ == "__main__":
    add_mock_users()
    add_mock_profiles()
    print("Mock data added successfully!")