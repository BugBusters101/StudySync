from ..utils.database import get_db_connection, exec_sql

class Profile:
    @staticmethod
    def find_by_user_id(user_id):
        """
        Fetch a profile by user ID.
        """
        conn = get_db_connection()
        try:
            cur = conn.cursor()
            exec_sql(cur, conn, "SELECT * FROM Profile WHERE user_id = %s", (user_id,))
            profile = cur.fetchone()
            return dict(profile) if profile else None
        finally:
            conn.close()
