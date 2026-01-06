<h2 align="center">Reminder Voice Calls</h2>

# Requirements (without Docker)
- Docker
- Python 3.11
- Poetry
- node >=20
- npm 10.9.2

# How to run
1) Create `.env` file from `.env.example` in the root directory. `cp .env.example .env`
2) Get your `VAPI_API_KEY`, `PHONE_NUMBER_ID` and put them in `.env` (root directory).
3) Run `docker compose up` from the root directory.
4) The app will be available at `http://localhost:3000`
5) The API docs will be available at `http://localhost:8000/docs`

# How to run without docker
1) Create `.env` file from `backend/.env.example` in the `backend` directory. `cp backend/.env.example backend/.env`
2) Get your `VAPI_API_KEY`, `PHONE_NUMBER_ID` and put them in `backend/.env`.
3) Run `poetry install` from the `backend` directory.
4) Run `uvicorn app.main:app --reload` from the `backend` directory.
5) Run `npm install` from the `frontend` directory.
6) Run `npm run dev` from the `frontend` directory.
7) The app will be available at `http://localhost:3000`
8) The API docs will be available at `http://localhost:8000/docs`

# How to run tests
1) Run `npm install` from the `frontend` directory.
2) Run `npm run e2e` from the `frontend` directory for the **end to end tests**.
3) Run `npm run test` from the `frontend` directory for the **unit tests**.

# Project Details
1) The frontend is built with Next.js 16 and TypeScript.
2) For styling we use TailwindCSS and RadixUI for component primitives.
3) For requests we use axios and tanstack/react-query for data fetching.
4) Custom hooks for state management and side effects.
5) Custom styled components for consistency.
6) The backend is built with FastAPI and Python 3.11.
7) The database is SQLite for now.
8) The scheduler is built with APScheduler and runs in a separate thread.
9) Vapi.ai is used to make the voice calls.
10) Twilio is used to make the phone calls. (Added a Twillio phone number in vapi.ai)


# Frontend Goals
- [x] Visual quality, spacing, typography, component consistency
- [x] Form experience, empty/loading/error states, responsiveness
- [x] Component design system quality
- [x] Code clarity, structure, reusability
- [x] Data fetching/state management approach with TanStack React Query
- [x] Dashboard filtering, sorting, pagination
- [x] End to end tests
- [x] unit tests

# Backend goals
- [x] Reminder scheduling reliability
- [x] Status updates correct
- [x] Vapi call trigger works
- [x] Clear configuration + README
- [x] Good error handling when call fails

