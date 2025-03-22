import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Basic Flask Configuration
    SECRET_KEY = b'alsfjostgosrih34387sd'

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app', 'data', 'data.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False