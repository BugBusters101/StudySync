from ..utils.database import get_db_connection
from datetime import datetime

class Message:
    @staticmethod
    def create(sender_id, receiver_id, message_text):
        """
        Create a new message in the database.
        
        Args:
            sender_id (int): ID of the user sending the message
            receiver_id (int): ID of the user receiving the message
            message_text (str): The message content
            
        Returns:
            dict: The created message data
        """
        conn = get_db_connection()
        try:
            cursor = conn.execute(
                "INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES (?, ?, ?, ?)",
                (sender_id, receiver_id, message_text, datetime.utcnow())
            )
            message_id = cursor.lastrowid
            conn.commit()
            
            # Return the created message
            message = conn.execute(
                "SELECT * FROM messages WHERE id = ?", (message_id,)
            ).fetchone()
            
            return dict(message) if message else None
        finally:
            conn.close()
    
    @staticmethod
    def get_recent_messages(user1_id, user2_id, limit=50):
        """
        Get recent messages between two users.
        
        Args:
            user1_id (int): First user ID
            user2_id (int): Second user ID
            limit (int): Maximum number of messages to return
            
        Returns:
            list: List of message dictionaries
        """
        conn = get_db_connection()
        try:
            messages = conn.execute(
                """SELECT * FROM messages 
                   WHERE (sender_id = ? AND receiver_id = ?) 
                   OR (sender_id = ? AND receiver_id = ?)
                   ORDER BY created_at DESC 
                   LIMIT ?""",
                (user1_id, user2_id, user2_id, user1_id, limit)
            ).fetchall()
            
            # Convert to list of dictionaries and reverse to get chronological order
            return [dict(msg) for msg in reversed(messages)]
        finally:
            conn.close()
    
    @staticmethod
    def get_conversations(user_id):
        """
        Get all conversations for a user (list of other users they've chatted with).
        
        Args:
            user_id (int): User ID
            
        Returns:
            list: List of conversation data with other users
        """
        conn = get_db_connection()
        try:
            # Get distinct users this user has chatted with
            conversations = conn.execute(
                """SELECT DISTINCT 
                      CASE 
                        WHEN sender_id = ? THEN receiver_id 
                        ELSE sender_id 
                      END as other_user_id,
                      MAX(created_at) as last_message_time
                   FROM messages 
                   WHERE sender_id = ? OR receiver_id = ?
                   GROUP BY other_user_id
                   ORDER BY last_message_time DESC""",
                (user_id, user_id, user_id)
            ).fetchall()
            
            return [dict(conv) for conv in conversations]
        finally:
            conn.close()