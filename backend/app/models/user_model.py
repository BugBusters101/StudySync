from ..utils.database import get_db_connection, exec_sql
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin  # Required for Flask-Login

class User(UserMixin):  # Inherit from UserMixin
    def __init__(self, id, email, password_hash, first_name, last_name, is_new_user=1):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.is_new_user = bool(is_new_user)

    @staticmethod
    def create(first_name, last_name, email, password):
        """
        Create a new user in the database.
        Returns the created User object
        """
        conn = get_db_connection()
        try:
            password_hash = generate_password_hash(password)
            cur = conn.cursor()
            exec_sql(
                cur,
                conn,
                "INSERT INTO users (first_name, last_name, email, password_hash) "
                "VALUES (%s, %s, %s, %s) RETURNING id",
                (first_name, last_name, email, password_hash),
            )
            row = cur.fetchone()
            user_id = row['id'] if hasattr(row, 'keys') else row[0]
            conn.commit()
            return User(
                id=user_id,
                email=email,
                password_hash=password_hash,
                first_name=first_name,
                last_name=last_name,
                is_new_user=1
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
            cur = conn.cursor()
            exec_sql(cur, conn, "SELECT * FROM users WHERE email = %s", (email,))
            user_data = cur.fetchone()
            if user_data:
                return User(
                    id=user_data['id'],
                    email=user_data['email'],
                    password_hash=user_data['password_hash'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_new_user=user_data['is_new_user']
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
            cur = conn.cursor()
            exec_sql(cur, conn, "SELECT * FROM users WHERE id = %s", (user_id,))
            user_data = cur.fetchone()
            if user_data:
                return User(
                    id=user_data['id'],
                    email=user_data['email'],
                    password_hash=user_data['password_hash'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_new_user=user_data['is_new_user']
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