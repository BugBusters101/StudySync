import os
from dotenv import load_dotenv

# Load environment variables from .env if it exists
load_dotenv()

from app import create_app, socketio

app = create_app()

if __name__ == "__main__":
    # This is still here for fallback, but gunicorn will use 'app' or 'socketio'
    socketio.run(app, debug=False)
