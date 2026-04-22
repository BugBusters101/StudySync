# StudySync

## Project Overview

StudySync is a web application designed to help students find study partners and groups based on their preferences and availability. The application includes features such as user authentication, profile management, matching algorithm, and chat functionality.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Python 3.x installed on your machine
- Node.js and npm installed on your machine
- For **local development**, SQLite is used by default (bundled with Python; no separate install required). **PostgreSQL** is optional if you set `DATABASE_URL` (see [Database](#database) below).

## Installation

### 1) Clone the repository
```
git clone https://github.com/BugBusters101/StudySync
cd StudySync
```

### 2) Backend setup (Python)
Create and activate a virtual environment, then install dependencies.
```
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Optional: initialize the local SQLite database (only if `backend/study-buddy.db` is missing or empty). Run from the `backend` folder:
```
cd backend
python -c "from app.utils.database import init_db; init_db()"
```
On Windows, if `python` is not on your PATH, use `py` instead.

### 3) Frontend setup (Node)
Install frontend dependencies.
```
npm run install:all
```

### 4) Run both servers together
This runs Flask at http://localhost:5000 and React at http://localhost:3000.
```
npm run dev
```

Individual services (optional):
```
npm run dev:backend
npm run dev:frontend
```

## Usage

1. **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

2. **Register and log in:**
    Create a new account or log in with your existing credentials.

3. **Set up your profile:**
    Fill in your study preferences and availability.

4. **Find study partners:**
    Use the matching feature to find compatible study partners.

5. **Chat with your matches:**
    Use the chat functionality to communicate with your study partners.

## Database

- **Default (local):** If `DATABASE_URL` is **not** set, the API uses **SQLite** at `backend/study-buddy.db`. The same SQL runs against Postgres in production and SQLite locally.
- **PostgreSQL (e.g. Supabase):** Set the environment variable `DATABASE_URL` to a `postgresql://…` connection string. The app then uses **psycopg2** instead of SQLite. This matches typical **Vercel / production** setups.
- **Deploy / gunicorn:** `backend/wsgi.py` calls `load_dotenv()`, so a `.env` file in the **process working directory** can supply `DATABASE_URL` and `SECRET_KEY` when you run the server that way.
- **`python backend/run.py`:** Does not load a `.env` file; set `DATABASE_URL` in your shell or your process manager if you need Postgres while using `run.py`.

Avoid pointing a casual local dev environment at your **production** database: you can corrupt or leak real user data. Prefer SQLite locally, or a **staging** Postgres instance.

## Notes

- The frontend uses `REACT_APP_API_URL` when set; otherwise it calls `http://127.0.0.1:5000`. The `package.json` **proxy** (`http://localhost:5000`) applies to the React dev server only when requests use relative URLs; this project mostly uses the explicit API URL above.
- The SQLite file path is resolved relative to the backend package, so it stays correct regardless of the shell working directory.
- If you prefer, you can delete the root `node_modules/`. The project uses `npx concurrently` from the root, and all React dependencies live in `study-sync-frontend/node_modules/`.
