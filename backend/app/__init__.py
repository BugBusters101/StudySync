from flask import Flask

from .controller.matching_controller import matching_bp


def create_app():
    """
    Create and configure the Flask app.
    """
    app = Flask(__name__)

    # Load configuration (optional)
    app.config.from_pyfile('config.py', silent=True)
    # Register blueprints (routes)
    app.register_blueprint(matching_bp)


    return app