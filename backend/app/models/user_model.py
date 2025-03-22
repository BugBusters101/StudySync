import sqlite3
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from StudySync.backend.app import login
from StudySync.backend.app.utils.database import get_db_connection

class User(UserMixin):
    def __init__(self, id, firstname, lastname, email, password_hash):
        self.id = id
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.password_hash = password_hash

    def __repr__(self):
        return f'User(id={self.id}, firstname={self.firstname}, lastname={self.lastname})'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, entered_password):
        return check_password_hash(self.password_hash, entered_password)

    @staticmethod
    def get_user_by_id(user_id):
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM user WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        if user:
            return User(**user)
        return None

    @staticmethod
    def get_user_by_name(firstname, lastname):
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM user WHERE firstname = ? AND lastname = ?', (firstname, lastname)).fetchone()
        conn.close()
        if user:
            return User(**user)
        return None

@login.user_loader
def load_user(user_id):
    return User.get_user_by_id(int(user_id))