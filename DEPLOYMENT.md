# AEGIS QR - Deployment Instructions

This guide provides instructions for deploying AEGIS QR to various hosting platforms.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Environment variables (see `.env.example`)

## 1. Standalone Deployment (Docker)

The easiest way to deploy the entire stack is using Docker.

### Using Docker Compose
```bash
docker compose up -d
```
This will start both the AEGIS QR application and a PostgreSQL database.

### Using the Dockerfile
1. Build the image:
   ```bash
   docker build -t aegis-qr .
   ```
2. Run the container:
   ```bash
   docker run -p 4000:4000 \
     -e DATABASE_URL=your_db_url \
     -e JWT_SECRET=your_secret \
     -e CLIENT_URL=http://localhost:4000 \
     -e GEMINI_API_KEY=your_key \
     aegis-qr
   ```

## 2. Split Deployment (Vercel + Render/Railway)

### Backend (Render / Railway)
1. Connect your repository to the platform.
2. Set the build command: `cd backend && npm install && npm run build`.
3. Set the start command: `cd backend && npm start`.
4. Add environment variables:
   - `DATABASE_URL`: Your managed PostgreSQL URL.
   - `JWT_SECRET`: A long random string.
   - `CLIENT_URL`: The URL where your frontend will be hosted (e.g., `https://aegis-qr.vercel.app`).
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `NODE_ENV`: `production`.

### Frontend (Vercel)
1. Connect your repository to Vercel.
2. Select the `frontend` directory as the root.
3. Set the build command: `npm run build`.
4. Set the output directory: `dist`.
5. Add environment variables:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://aegis-qr-api.onrender.com`).

## 3. Database Setup

Ensure you run Prisma migrations on your production database:
```bash
cd backend
npx prisma migrate deploy
```

## 4. API Routing

The application is configured to serve the frontend from the backend in production mode if `NODE_ENV=production` is set and the frontend is built in `frontend/dist`. This allows for a single-server deployment.
