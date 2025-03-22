import sqlite3
from pathlib import Path

def get_db_connection():
    """
    Create and return a connection to the SQLite database.
    """
    conn = sqlite3.connect('study-buddy.db')
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn


def init_db():
    """
    Initialize the database by running the schema.sql script.
    """
    conn = get_db_connection()
    try:
        # Construct the path to schema.sql
        schema_path = Path(__file__).parent.parent.parent / "schema.sql"

        # Check if the schema file exists
        if not schema_path.exists():
            raise FileNotFoundError(f"Schema file not found at: {schema_path}")

        # Read and execute the schema script
        with open(schema_path, 'r') as f:
            conn.executescript(f.read())
        conn.commit()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()