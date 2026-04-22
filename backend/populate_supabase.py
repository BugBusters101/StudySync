import psycopg2
import json
import os
from werkzeug.security import generate_password_hash

def populate():
    db_url = "postgresql://postgres:Birminghack%401623E@db.asncwwbzlwuclisclril.supabase.co:6543/postgres"
    print(f"Connecting to {db_url}...")
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    seed_profiles = [
        ("Alice", "Smith", "alice@example.com", "Physics,Mathematics", "Morning (8-11 AM)"),
        ("Bob", "Johnson", "bob@example.com", "Chemistry,Biology", "Afternoon (12-4 PM)"),
        ("Charlie", "Williams", "charlie@example.com", "English,History", "Evening (5-8 PM)"),
        ("Diana", "Brown", "diana@example.com", "Mathematics,Computer Science", "Night (9 PM-12 AM)"),
        ("Evan", "Jones", "evan@example.com", "Physics,Chemistry", "Morning (8-11 AM)"),
        ("Fiona", "Garcia", "fiona@example.com", "Biology,English", "Afternoon (12-4 PM)"),
        ("George", "Martinez", "george@example.com", "History,Mathematics", "Evening (5-8 PM)"),
        ("Hannah", "Rodriguez", "hannah@example.com", "Physics,Biology", "Night (9 PM-12 AM)"),
        ("Ian", "Lee", "ian@example.com", "Computer Science,English", "Morning (8-11 AM)"),
        ("Julia", "Walker", "julia@example.com", "Mathematics", "Afternoon (12-4 PM)")
    ]

    password_hash = generate_password_hash("password123")

    for p in seed_profiles:
        try:
            print(f"Adding {p[2]}...")
            cur.execute("""
                INSERT INTO users (first_name, last_name, email, password_hash, is_new_user)
                VALUES (%s, %s, %s, %s, 0) ON CONFLICT (email) DO NOTHING RETURNING id
            """, (p[0], p[1], p[2], password_hash))
            row = cur.fetchone()
            if not row:
                continue
            user_id = row[0]
            
            subjects = json.dumps(p[3].split(','))
            availability = json.dumps([p[4]])
            cur.execute("""
                INSERT INTO Profile (user_id, subjects, days_of_week, availability, learning_style, location_type, location_details)
                VALUES (%s, %s, '[]', %s, '[]', '[]', '[]') ON CONFLICT (user_id) DO NOTHING
            """, (user_id, subjects, availability))
            
            conn.commit()
        except Exception as e:
            print(f"Error seeding {p[0]}: {e}")
            conn.rollback()

    conn.close()
    print("Done!")

if __name__ == "__main__":
    populate()
