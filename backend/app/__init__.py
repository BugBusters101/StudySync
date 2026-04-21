import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from .controller.matching_controller import matching_bp
from .controller.auth_controller import auth_bp
from .controller.preference_controller import preferences_bp

# Global socketio instance
socketio = SocketIO()

def create_app():
    """
    Create and configure the Flask app.
    """
    app = Flask(__name__)
    # Use a stable secret key in development to maintain sessions across reloads
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'studysync_dev_key_12345')

    # Initialize SocketIO with wide CORS support for production
    socketio.init_app(app, cors_allowed_origins="*")

    # Wide CORS configuration for production hosting
    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
        supports_credentials=False,
    )

    app.config.from_pyfile('config.py', silent=True)

    app.register_blueprint(matching_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(preferences_bp)
    
    # Import and register chat blueprint after socketio is initialized
    from .controller.chat_controller import chat_bp, register_socket_events
    app.register_blueprint(chat_bp)
    
    # Register socket events
    register_socket_events(socketio)

    return app