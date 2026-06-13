# QRGuard AI

QRGuard AI is a full-stack cybersecurity web application for analyzing QR codes and warning users about phishing attempts, malicious downloads, unsafe payment requests, and suspicious redirects.

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
├── .env.example
└── README.md
```

## Features

- JWT registration and login
- Protected dashboard and scan history
- QR image upload and decoding
- QR type classification for URL, UPI, Wi-Fi, SMS, phone, email, vCard, crypto wallet, and text
- URL and UPI risk analysis
- Threat scoring engine with severity levels
- Mock Gemini AI explanation layer behind a provider abstraction
- Community threat reporting and statistics

## Backend Setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL. The fastest path is the included Docker Compose service:

```bash
docker compose up -d
```

This creates a local PostgreSQL instance with:

- database: `qrguard_ai`
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

5. Start the API:

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

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/scan/upload`
- `GET /api/scan/:id`
- `GET /api/scan/history`
- `POST /api/report`
- `GET /api/reports`

## Notes

- `GEMINI_API_KEY` is consumed by a mock Gemini provider for now, so the integration boundary is already in place for a real model client.
- `backend/prisma/migrations/20260613000000_init/migration.sql` is included so the database shape is reproducible.
- The scan endpoint expects a multipart upload field named `file`.
- If PostgreSQL is already installed locally, create a database named `qrguard_ai` or update `DATABASE_URL` to match your existing instance before running Prisma migrations.
