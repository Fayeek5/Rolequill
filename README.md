# Rolequill

Rolequill is a full-stack career workspace for job discovery, ATS resume analysis, LaTeX resume generation, freelance portfolio workflows, professional network outreach, and application tracking.

It is built as a local-first portfolio implementation of a larger SRS: the product surface works end to end today, while the integration boundaries are ready for Supabase, OpenAI/Claude/Gemini, Apollo, and production LaTeX compilation.

## Highlights

- Secure local-first auth with email/password, phone OTP demo, and Google demo flow
- Candidate onboarding profile with skills, preferred roles, salary, location, and job types
- RemoteOK job aggregation with normalized schema, salary metadata, inferred experience level, and SHA-256 dedup hashes
- Resume upload/parsing for TXT, PDF, and DOCX
- Backend ATS analysis endpoint with deterministic scoring, provider metadata, and SHA-256 result cache
- Saved jobs, profile-based matching, alerts, and application tracking
- LaTeX resume builder demo with template ranking and `.tex` download
- Freelance hub, portfolio preview, and professional network outreach workspace
- GitHub Actions CI for frontend lint/build and backend syntax checks

## Screens

- `/login` - candidate authentication
- `/profile` - onboarding and job preferences
- `/` - resume upload, job search, profile matching, save/track actions
- `/ats` - deterministic ATS analysis and resume versions
- `/latex` - LaTeX template ranking and source editor
- `/freelance` - portfolio and freelance gig workspace
- `/network` - contact discovery and outreach workflow
- `/tracker` - application pipeline board
- `/notifications` - local alerts
- `/settings` - AI provider and cost-control settings

## Architecture

```text
Rolequill
├── frontend/  React 19 + TypeScript + Vite + TailwindCSS
└── backend/   Express API for jobs, health, and ATS analysis
```

The frontend stores demo candidate data in user-scoped localStorage. The backend provides RemoteOK job ingestion and a deterministic ATS provider layer. Production persistence should move to Supabase Auth and Supabase Postgres before storing real candidate data.

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

## Environment

Copy the examples before wiring real services:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Current demo mode does not require secrets.

For deployment:

- `VITE_API_BASE_URL` should be the deployed backend URL.
- `CORS_ORIGIN` should be the deployed frontend URL.

## Validation

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
node --check src/server.js
```

## API

Health:

```http
GET /api/health
```

Jobs:

```http
GET /api/jobs/fetch
```

ATS analysis:

```http
POST /api/ats/analyze
Content-Type: application/json

{
  "resumeText": "...",
  "jobDescription": "...",
  "provider": "GPT-4o",
  "bypassCache": false
}
```

## Roadmap

- Supabase Auth and database persistence
- Server-side LLM provider adapters for OpenAI, Claude, and Gemini
- Production ATS result cache table
- LLM-assisted PDF cleanup for complex resumes
- LaTeX compilation service with PDF output
- Apollo contact integration
- Upwork/Guru/Toptal integrations
- Email notifications and scheduled job ingestion
- Deployment to Vercel plus Render/Railway

## Deployment

Recommended portfolio deployment:

1. Import the GitHub repository into Render and deploy `rolequill-backend` from `render.yaml`.
2. Copy the backend public URL.
3. Import the GitHub repository into Vercel with root directory `frontend`.
4. Set `VITE_API_BASE_URL` in Vercel to the backend URL.
5. Set `CORS_ORIGIN` in Render to the Vercel frontend URL.

## License

MIT
