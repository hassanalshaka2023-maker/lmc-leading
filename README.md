# Leading Mastery Center (LMC)

Bilingual (Arabic / English) website and admin dashboard for LMC.

- `backend/` — NestJS + MongoDB (Mongoose)
- `frontend/` — React + Vite + TypeScript + Tailwind
- Scope and decisions: [SCOPE.md](./SCOPE.md)
- Deployment: [DEPLOY.md](./DEPLOY.md)
- QA notes: [QA.md](./QA.md)

## Requirements

- Node.js 20+
- A MongoDB connection string (MongoDB Atlas, or local: `npm run db` in `backend/`, or `docker compose up -d mongo`)

## Running locally

```bash
cd backend
npm install
cp ../.env.example .env      # set MONGO_URI
npm run seed                 # admin user + starter content (safe to re-run)
npm run start:dev            # API on :3000
```

```bash
cd frontend
npm install
npm run dev                  # site on :5173
```

- Site: http://localhost:5173
- Dashboard: http://localhost:5173/leaderrami (login from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`)
- API docs: http://localhost:3000/api/docs
- Health check: http://localhost:3000/api/health

## Docker

```bash
cp .env.example .env
docker compose up -d
docker compose --profile tools up -d   # adds mongo-express on :8081
```

## Tests

```bash
cd backend
npm test
npm run test:e2e
```
