from ..utils.database import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin  # Required for Flask-Login

class User(UserMixin):  # Inherit from UserMixin
    def __init__(self, id, email, password_hash, first_name, last_name):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name

    @staticmethod
    def create(first_name, last_name, email, password):
        """
        Create a new user in the database.
        Returns the created User object
        """
        conn = get_db_connection()
        try:
            password_hash = generate_password_hash(password)
            cursor = conn.execute(
                # Changed table name to 'users' (SQLite reserved word fix)
                "INSERT INTO users (first_name, last_name, email, password_hash) "
                "VALUES (?, ?, ?, ?) RETURNING id",
                (first_name, last_name, email, password_hash)
            )
            user_id = cursor.fetchone()['id']
            conn.commit()
            return User(
                id=user_id,
                email=email,
                password_hash=password_hash,
                first_name=first_name,
                last_name=last_name
            )
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def find_by_email(email):
        """
        Fetch a user by email and return User instance
        """
        conn = get_db_connection()
        try:
            user_data = conn.execute(
                "SELECT * FROM users WHERE email = ?", (email,)
            ).fetchone()
            if user_data:
                return User(
                    id=user_data['id'],
                    email=user_data['email'],
                    password_hash=user_data['password_hash'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name']
                )
            return None
        finally:
            conn.close()

    @staticmethod
    def get_by_id(user_id):
        """
        Required for Flask-Login user loader
        """
        conn = get_db_connection()
        try:
            user_data = conn.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
            if user_data:
                return User(
                    id=user_data['id'],
                    email=user_data['email'],
                    password_hash=user_data['password_hash'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name']
                )
            return None
        finally:
            conn.close()

    @staticmethod
    def validate_login(email, password):
        """
        Validate user login credentials.
        Returns User object if valid, None otherwise
        """
        user = User.find_by_email(email)
        if user and check_password_hash(user.password_hash, password):
            return user
        return None