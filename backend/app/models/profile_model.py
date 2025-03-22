from ..utils.database import get_db_connection

class Profile:
    @staticmethod
    def find_by_user_id(user_id):
        """
        Fetch a profile by user ID.
        """
        conn = get_db_connection()
        profile = conn.execute(
            "SELECT * FROM Profile WHERE user_id = ?", (user_id,)
        ).fetchone()
        conn.close()
        return dict(profile) if profile else None
