# AEGIS QR

AEGIS QR is a full-stack cybersecurity web application for analyzing QR codes and warning users about phishing attempts, malicious downloads, unsafe payment requests, and suspicious redirects.

## Stack

- Frontend: React 19, TypeScript, Vite, TailwindCSS, shadcn-style UI components, TanStack Query, React Router
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT auth

## Project Structure

```text
.
├── backend
│   ├── prisma
│   └── src
├── frontend
│   ├── public
│   └── src
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Features

- JWT registration and login
- Protected dashboard and scan history
- QR image upload and decoding
- QR type classification for URL, UPI, Wi-Fi, SMS, phone, email, vCard, crypto wallet, and text
- URL and UPI risk analysis
- Automated browser-based URL inspection with screenshot capture and redirect analysis
- Threat scoring engine with severity levels
- Mock Gemini AI explanation layer behind a provider abstraction
- Community threat reporting and statistics
- Production build flow that serves the compiled frontend from the backend
- Docker and Docker Compose support for local or hosted deployments

## Backend Setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL. The fastest path is the included Docker Compose service:

```bash
docker compose up -d postgres
```

This creates a local PostgreSQL instance with:

- database: `aegis_qr`
- user: `postgres`
- password: `postgres`

3. Install dependencies:

```bash
cd backend
npm install
```

4. Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the API in development:

```bash
npm run dev
```

The backend runs on `http://localhost:4000`.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Production Build

The backend can serve the compiled frontend directly, so one production process can host the full application.

1. Build the frontend and backend:

```bash
cd backend
npm run build
```

2. Start the production server:

```bash
npm start
```

By default the app serves the frontend bundle from `../frontend/dist` when that directory exists.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/scan/upload`
- `GET /api/scan/:id`
- `GET /api/scan/history`
- `POST /api/report`
- `GET /api/reports`

## Deployment

### Docker Compose

The included `docker-compose.yml` starts PostgreSQL and the production app container together:

```bash
docker compose up --build
```

The site will be available at `http://localhost:4000`.

### Vercel + Render or Railway

Use Vercel for a separate static frontend deployment, or deploy the backend as a single production server on Render or Railway.

- Frontend build command: `npm run build` in `frontend`
- Frontend output directory: `dist`
- Backend build command: `npm run build` in `backend`
- Backend start command: `npm start` in `backend`
- Backend environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `GEMINI_API_KEY`
- Optional backend tuning variables: `ANALYSIS_ARTIFACT_DIR`, `URL_INSPECTION_TIMEOUT_MS`, `URL_INSPECTION_NAVIGATION_TIMEOUT_MS`, `URL_INSPECTION_VIEWPORT_WIDTH`, `URL_INSPECTION_VIEWPORT_HEIGHT`
- Frontend environment variable: `VITE_API_URL` when the frontend is hosted separately from the API

## Notes

- `GEMINI_API_KEY` is consumed by a mock Gemini provider for now, so the integration boundary is already in place for a real model client.
- `backend/prisma/migrations/20260613000000_init/migration.sql` is included so the database shape is reproducible.
- `backend/prisma/migrations/20260614000000_url_browser_inspection/migration.sql` adds the browser inspection fields and screenshot table.
- The scan endpoint expects a multipart upload field named `file`.
- If PostgreSQL is already installed locally, create a database named `aegis_qr` or update `DATABASE_URL` to match your existing instance before running Prisma migrations.
