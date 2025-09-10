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

    # Explicit CORS configuration for local dev (frontend on :3000)
    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000"
                ],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Content-Type", "Authorization"],
            }
        },
        supports_credentials=True,
    )

    app.config.from_pyfile('config.py', silent=True)

    app.register_blueprint(matching_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(preferences_bp)

    return app