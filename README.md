# Rolequill

Rolequill is a full-stack career workspace for job discovery, ATS resume analysis, LaTeX resume generation, freelance portfolio workflows, professional network outreach, and application tracking.

## Features

- Login with email/password, phone OTP demo, and Google demo flow
- User profile onboarding with skills, preferred roles, salary, location, and job types
- RemoteOK job aggregation with normalized schema and SHA-256 dedup metadata
- Resume upload/parsing for TXT, PDF, and DOCX
- Backend ATS analysis endpoint with deterministic scoring and SHA-256 result cache
- Saved jobs, profile-based matching, notifications, and application tracker
- LaTeX resume builder demo with template ranking and `.tex` download
- Freelance hub and network outreach workspace

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Frontend: http://127.0.0.1:5173/

Backend: http://127.0.0.1:5000/

## Production Notes

This is currently a local-first portfolio implementation. Before storing real candidate data, move authentication and persistence to Supabase Auth and Supabase Postgres, and store LLM API keys only on the server.
