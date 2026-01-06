<h2 align="center">Reminder Voice Calls</h2>

# How to run
1) Get your `VAPI_API_KEY`, `PHONE_NUMBER_ID` and put them in `.env` (root directory).
2) Run `docker compose up` from the root directory.
3) The app will be available at `http://localhost:3000`
4) The API docs will be available at `http://localhost:8000/docs`

# How to run without docker
1) Get your `VAPI_API_KEY`, `PHONE_NUMBER_ID` and put them in `backend/.env`.
2) Run `poetry install` from the `backend` directory.
3) Run `uvicorn app.main:app --reload` from the `backend` directory.
4) Run `npm install` from the `frontend` directory.
5) Run `npm run dev` from the `frontend` directory.
6) The app will be available at `http://localhost:3000`
7) The API docs will be available at `http://localhost:8000/docs`

# How to run tests
1) Run `npm install` from the `frontend` directory.
2) Run `npm run e2e` from the `frontend` directory for the **end to end tests**.
3) Run `npm run test` from the `frontend` directory for the **unit tests**.

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

