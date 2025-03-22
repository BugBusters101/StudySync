import sqlalchemy.orm as so
import sqlalchemy as sqla
from app import db, login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model, UserMixin):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sqla.String(64), index=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sqla.String(128), index=True, unique=True)
    password_hash: so.Mapped[str] = so.mapped_column(sqla.String(256))

    def __repr__(self):
        return f'User(id={self.id}, username={self.username})'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, entered_password):
        return check_password_hash(self.password_hash, entered_password)


@login.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))