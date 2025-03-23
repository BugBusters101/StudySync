from flask import Flask
from flask_cors import CORS
from .controller.matching_controller import matching_bp
from .controller.auth_controller import auth_bp
from .controller.preference_controller import preferences_bp

def create_app():
    """
    Create and configure the Flask app.
    """
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '6a762414be7364ad1a3b68cea122294f'
    CORS(app)

    # Load configuration (optional)
    app.config.from_pyfile('config.py', silent=True)

    # Register blueprints (routes)
    app.register_blueprint(matching_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(preferences_bp)

    return app