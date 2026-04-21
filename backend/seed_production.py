import json
from werkzeug.security import generate_password_hash
import random
import os
from app.utils.database import get_db_connection

def generate_matches(new_user_id):
    """
    Simulates algorithm by finding 3-5 users to match with a newly registered user.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    # Random selection differs slightly in Postgres (RANDOM()) vs SQLite (RANDOM())
    # Both actually use RANDOM() usually, but ordering might vary.
    cur.execute("SELECT id FROM users WHERE id != %s ORDER BY RANDOM() LIMIT %s", (new_user_id, random.randint(3, 5)))
    potential_matches = [r['id'] if hasattr(r, 'keys') else r[0] for r in cur.fetchall()]
    
    for match_id in potential_matches:
        score = round(random.uniform(0.65, 0.98), 2)
        
        # INSERT ... ON CONFLICT DO NOTHING (Postgres compatible)
        cur.execute("""
            INSERT INTO Match (user_id, match_user_id, score)
            VALUES (%s, %s, %s) ON CONFLICT DO NOTHING
        """, (new_user_id, match_id, score))
        
        cur.execute("""
            INSERT INTO Match (user_id, match_user_id, score)
            VALUES (%s, %s, %s) ON CONFLICT DO NOTHING
        """, (match_id, new_user_id, score))

    conn.commit()
    conn.close()
    print(f"[+] Generated seed matches for user {new_user_id}.")

def run_seed():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM users")
    row = cur.fetchone()
    count = row['count'] if hasattr(row, 'keys') else row[0]

    if count >= 10:
        print("[!] Database already populated. Skipping seed.")
        conn.close()
        return

    print("[-] Seeding database with production-ready dummy users...")

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
            cur.execute("""
                INSERT INTO users (first_name, last_name, email, password_hash, is_new_user)
                VALUES (%s, %s, %s, %s, 0) RETURNING id
            """, (p[0], p[1], p[2], password_hash))
            row = cur.fetchone()
            user_id = row['id'] if hasattr(row, 'keys') else row[0]
            
            subjects = json.dumps(p[3].split(','))
            availability = json.dumps([p[4]])
            cur.execute("""
                INSERT INTO Profile (user_id, subjects, days_of_week, availability, learning_style, location_type, location_details)
                VALUES (%s, %s, '[]', %s, '[]', '[]', '[]')
            """, (user_id, subjects, availability))
            
            conn.commit()
            generate_matches(user_id)
            
        except Exception:
            conn.rollback()

    conn.close()
    print("[+] Seeding Complete.")

if __name__ == "__main__":
    run_seed()
