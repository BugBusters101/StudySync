from ..utils.database import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    @staticmethod
    def create(first_name, last_name, email, password):
        """
        Create a new user in the database.
        """
        conn = get_db_connection()
        password_hash = generate_password_hash(password)
        conn.execute(
            "INSERT INTO User (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
            (first_name, last_name, email, password_hash)
        )
        conn.commit()
        conn.close()

    @staticmethod
    def find_by_email(email):
        """
        Fetch a user by email.
        """
        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM User WHERE email = ?", (email,)
        ).fetchone()
        conn.close()
        return user

    @staticmethod
    def validate_login(email, password):
        """
        Validate user login credentials.
        """
        user = User.find_by_email(email)
        if user and check_password_hash(user['password_hash'], password):
            return user
        return None