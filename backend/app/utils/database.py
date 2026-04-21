import sqlite3
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from pathlib import Path

def get_db_connection():
    """
    Create and return a connection to either PostgreSQL (production) or SQLite (development).
    """
    db_url = os.environ.get('DATABASE_URL')
    
    if db_url:
        # PostgreSQL / Supabase
        conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor)
        return conn
    else:
        # Local SQLite
        backend_dir = Path(__file__).resolve().parents[2]
        db_path = backend_dir / "study-buddy.db"
        conn = sqlite3.connect(str(db_path))
        conn.row_factory = sqlite3.Row
        return conn

def init_db():
    """
    Initialize the database by running the schema.sql script.
    """
    conn = get_db_connection()
    try:
        schema_path = Path(__file__).parent.parent.parent / "schema.sql"
        if not schema_path.exists():
            raise FileNotFoundError(f"Schema file not found at: {schema_path}")

        with open(schema_path, 'r') as f:
            query = f.read()
            
        cur = conn.cursor()
        if hasattr(conn, 'executescript'):
            # SQLite
            conn.executescript(query)
        else:
            # PostgreSQL
            cur.execute(query)
        conn.commit()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()