# Run and deploy

1. Create a PostgreSQL database and copy `backend/.env.example` to `backend/.env`.
2. In `backend`, run `npm install` and `npm start`.
3. In `frontend`, set `VITE_API_URL=http://localhost:5000/api`, run `npm install`, then `npm run dev`.
4. Deploy `frontend` to Vercel with root directory `frontend` and build command `npm run build`. The frontend also works independently using browser localStorage, so the backend/database are optional for a frontend-only demonstration.
5. Deploy `backend` to Render with root directory `backend`, start command `npm start`, and set `DATABASE_URL`, `FRONTEND_URL`, and `PORT`.
