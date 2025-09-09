# StudySync

## Project Overview

StudySync is a web application designed to help students find study partners and groups based on their preferences and availability. The application includes features such as user authentication, profile management, matching algorithm, and chat functionality.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Python 3.x installed on your machine
- Node.js and npm installed on your machine
- SQLite installed (or any other database you plan to use)

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

Optional: initialize the local SQLite database (only if your DB is empty)
```
python -c "from backend.app.utils.database import init_db; init_db()"
```

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

## Notes

- The frontend has a proxy set to the backend (`http://localhost:5000`), so API calls from the React app are automatically forwarded.
- The backend uses the SQLite database file at `backend/study-buddy.db`. The server now opens it via an absolute path, so it will always use this file regardless of the working directory.
- If you prefer, you can delete the root `node_modules/`. The project uses `npx concurrently` from the root, and all React dependencies live in `study-sync-frontend/node_modules/`.
