import sqlite3
import json
from werkzeug.security import generate_password_hash
import random
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'study-buddy.db')

def get_connection():
    return sqlite3.connect(DB_PATH)

def generate_matches(new_user_id):
    """
    Simulates algorithm by finding 3-5 users to match with a newly registered user or running it broadly.
    """
    conn = get_connection()
    c = conn.cursor()
    # Ensure they aren't matching themselves
    c.execute("SELECT id FROM users WHERE id != ? ORDER BY RANDOM() LIMIT ?", (new_user_id, random.randint(3, 5)))
    potential_matches = [r[0] for r in c.fetchall()]
    
    for match_id in potential_matches:
        # Generate some synthetic attributes for the match record
        # Use random overlaps based loosely on available mock constraints
        score = round(random.uniform(0.65, 0.98), 2)
        shared_subs = json.dumps(random.sample(["Physics", "Chemistry", "Mathematics", "Biology", "English"], random.randint(1, 3)))
        
        # Insert bidirectional match
        c.execute("""
            INSERT OR IGNORE INTO Match (user_id, match_user_id, score)
            VALUES (?, ?, ?)
        """, (new_user_id, match_id, score))
        
        c.execute("""
            INSERT OR IGNORE INTO Match (user_id, match_user_id, score)
            VALUES (?, ?, ?)
        """, (match_id, new_user_id, score))

    conn.commit()
    conn.close()
    print(f"[+] Generates {len(potential_matches)} seed matches for user {new_user_id}.")

def run_seed():
    conn = get_connection()
    c = conn.cursor()

    # Check how many users exist
    c.execute("SELECT COUNT(*) FROM users")
    count = c.fetchone()[0]

    if count >= 10:
        print("[!] Database already populated with sufficient users. Skipping seed.")
        conn.close()
        return

    print("[-] Seeding database with dummy users...")

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
            # Insert User
            c.execute("""
                INSERT INTO users (first_name, last_name, email, password_hash, is_new_user)
                VALUES (?, ?, ?, ?, 0)
            """, (p[0], p[1], p[2], password_hash))
            user_id = c.lastrowid
            
            # Insert associated Profile
            subjects = json.dumps(p[3].split(','))
            availability = json.dumps([p[4]])
            c.execute("""
                INSERT INTO Profile (user_id, subjects, days_of_week, availability, learning_style, location_type, location_details)
                VALUES (?, ?, '[]', ?, '[]', '[]', '[]')
            """, (user_id, subjects, availability))
            
            # Optionally generate immediate matches among seeds
            generate_matches(user_id)
            
        except sqlite3.IntegrityError:
            pass # Email already exists

    conn.commit()
    conn.close()
    print("[+] Seeding Complete.")

if __name__ == "__main__":
    run_seed()
