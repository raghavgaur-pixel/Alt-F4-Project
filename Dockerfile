FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma

RUN cd frontend && npm install
RUN cd backend && npm install && npm run prisma:generate
RUN cd backend && npx playwright install --with-deps chromium

COPY frontend ./frontend
COPY backend ./backend

RUN cd frontend && npm run build
RUN cd backend && npm run build:server

FROM node:20-alpine AS runtime

WORKDIR /app/backend
ENV NODE_ENV=production

COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/frontend/dist ../frontend/dist

EXPOSE 4000

CMD ["node", "dist/server.js"]
