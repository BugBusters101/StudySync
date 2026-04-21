                    -- User table: Stores user authentication details
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,            -- User first name
    last_name TEXT NOT NULL,             -- User last name
    email TEXT UNIQUE NOT NULL,          -- User email (unique)
    password_hash TEXT NOT NULL,         -- Hashed password
    is_new_user INTEGER DEFAULT 1,       -- Tracks onboarding status (1=new)
    last_seen TIMESTAMP,                 -- Tracks socket-active online checks
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile table: Stores user preferences and details
CREATE TABLE Profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,     -- Links to User table
    subjects TEXT,                       -- JSON array of subjects (e.g., ["Math", "ML"])
    days_of_week TEXT,                   -- JSON array of days (e.g., ["Monday", "Wednesday"])
    availability TEXT,                   -- JSON array of time slots (e.g., ["mornings", "evenings"])
    learning_style TEXT,                 -- e.g., "visual", "auditory", "hands-on"
    location_type TEXT,                  -- e.g., "in-person", "virtual"
    location_details TEXT,               -- e.g., "University Library", "Zoom"
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Match table: Stores matches between users
CREATE TABLE Match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,            -- User who received the match
    match_user_id INTEGER NOT NULL,      -- User who was matched
    score REAL NOT NULL,                 -- Compatibility score (e.g., 0.85)
    feedback INTEGER,                    -- User rating (1-5 stars)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (match_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table: Stores chat messages between users
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,          -- User who sent the message
    receiver_id INTEGER NOT NULL,        -- User who received the message
    message TEXT NOT NULL,               -- Message content
    is_read INTEGER DEFAULT 0,           -- Boolean read status indicator
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_msg_sender ON messages(sender_id);
CREATE INDEX idx_msg_receiver ON messages(receiver_id);

-- Notifications table: Stores unread message alerts
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,         -- Reference to the message trigger
    user_id INTEGER NOT NULL,            -- User possessing the notification
    read_status INTEGER DEFAULT 0,       -- 0 if unread, 1 if read
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE
);

