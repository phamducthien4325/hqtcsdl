# ClassicModels Analytics Suite

Production-oriented full-stack web application for the `classicmodels` schema.

## Stack

- Backend: Node.js, Express, Prisma, MySQL
- Frontend: React, Vite, Material UI, Recharts, react-pivottable
- Auth: JWT with role-based access (`admin`, `staff`)
- Reporting: CSV and Excel export
- Chatbot: SQL assistant with OpenAI support and rule-based fallback

## Structure

- `backend/` Express API, Prisma schema, SQL setup, Docker assets
- `frontend/` React application
- `.env.example` environment template shared by both apps

## Run locally

1. Copy `.env.example` to `.env`.
2. Start MySQL and create the database:
   - `docker compose up -d mysql`
3. Install packages:
   - `npm install`
4. Generate Prisma client:
   - `npm run prisma:generate --workspace backend`
5. Apply schema:
   - `npm run prisma:push --workspace backend`
6. Seed auth users:
   - `npm run prisma:seed --workspace backend`
7. Start both apps:
   - `npm run dev`

Backend: `http://localhost:4000`

Frontend: `http://localhost:5173`

## SQL setup

- Core tables: `backend/sql/classicmodels-schema.sql`
- Auth bootstrap table: `backend/sql/app-users.sql`

## Sample API requests

See `docs/sample-requests.md`.
