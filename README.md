# CareSync

CareSync is a full-stack healthcare application with a backend-first architecture, JWT authentication, MySQL + MongoDB persistence, and a clean Next.js dashboard for patients and doctors.

## Stack

- Frontend: Next.js, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js, REST APIs
- MySQL: users, doctors, appointments, reminders, health metrics, family access
- MongoDB: reports, prescriptions
- Auth: JWT + bcrypt password hashing

## Project Structure

```text
/frontend
  /components
  /pages
  /styles

/backend
  /routes
  /controllers
  /models
  /middleware
```

## Features

- Signup/login for patient, doctor, and family
- JWT-protected APIs with role-based middleware
- Patient dashboard with recent metrics, reminders, appointments, and chatbot
- Doctor panel with appointment management and prescription creation
- Appointment booking with accept/reject workflow
- Report upload, retrieval, and patient-to-doctor sharing
- Family account linking for limited data access
- Basic chatbot with appointment/report intents and optional OpenAI fallback
- Settings page with profile update and theme toggle
- Fixed emergency button and lightweight notifications

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set the environment values for MySQL, MongoDB, JWT, frontend URL, and optional OpenAI key. The backend auto-creates tables on startup, but the MySQL database itself should already exist.

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Hosting Choice

Recommended deployment:

- Frontend: Vercel
- Backend: Render
- Databases: managed MySQL and MongoDB Atlas or any equivalent external providers

This is based on current docs for Next.js on Vercel and Node/Express on Render, plus Vercel's current monorepo root-directory flow and Render's current build/start command model.

Sources:

- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Using Monorepos on Vercel](https://vercel.com/docs/monorepos)
- [Deploy a Node Express App on Render](https://render.com/docs/deploy-node-express-app)
- [Render Blueprint YAML Reference](https://render.com/docs/blueprint-spec)

## Deploy Backend On Render

A starter Blueprint file is included at [render.yaml](/F:/debugfold/render.yaml).

1. Push this repository to GitHub.
2. In Render, create a Blueprint or Web Service from the repo.
3. Use the `backend` root directory.
4. Confirm the build command is `npm install` and the start command is `npm start`.
5. Set these environment variables: `FRONTEND_URLS`, `MONGODB_URI`, and either `MYSQL_URL` or the separate MySQL fields `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`. If your provider requires TLS, also set `MYSQL_SSL=true`. Optionally add `OPENAI_API_KEY`.
6. After Vercel gives you the frontend URL, place it in `FRONTEND_URLS`.

Notes:

- `FRONTEND_URLS` supports comma-separated origins, so you can include both your production Vercel URL and `http://localhost:3000`.
- The backend health endpoint is `/api/health`.
- Report files are stored on the service filesystem in `backend/uploads`, which is suitable for basic demos but not ideal for long-term durable storage.

## Deploy Frontend On Vercel

1. Import the same repository into Vercel.
2. Set the project Root Directory to `frontend`.
3. Set `NEXT_PUBLIC_API_URL` to your Render backend URL plus `/api`.
   Example: `https://caresync-backend.onrender.com/api`
4. Deploy.

Because this repo is split into `frontend` and `backend`, Vercel should be configured as a monorepo project using the `frontend` root directory, per Vercel's current monorepo flow.

## Core API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- GET /api/dashboard/patient
- GET /api/dashboard/doctor
- GET /api/appointments
- POST /api/appointments
- PATCH /api/appointments/:id/status
- GET /api/reports
- POST /api/reports/upload
- POST /api/reports/share/:id
- GET /api/reports/prescriptions
- POST /api/reports/prescriptions
- GET /api/reminders
- POST /api/reminders
- POST /api/chatbot
- PUT /api/settings

## Demo Flow

1. Create a patient account and optionally a family account.
2. Create a doctor account.
3. Book an appointment from the patient account.
4. Accept or reject it from the doctor panel.
5. Upload a report from the patient report page.
6. Share the report with the doctor.
7. Ask the chatbot to show appointments or reports.

## Notes

- Report files are stored in `backend/uploads`.
- The voice feature is implemented as a basic microphone shortcut that prefills a command.
- The chatbot does not provide diagnosis and should stay limited to admin-style health record queries.
- I have prepared the repo for deployment, but I have not actually deployed it because this environment does not have access to your Vercel/Render accounts or live database credentials.