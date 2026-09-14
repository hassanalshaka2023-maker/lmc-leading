# LMC backend

NestJS 11 + MongoDB (Mongoose). REST API for the public site and the admin dashboard.

## Setup

```bash
npm install
cp ../.env.example .env    # set MONGO_URI and JWT secrets
npm run seed               # admin user + starter content
npm run start:dev          # http://localhost:3000/api
```

API docs (Swagger): http://localhost:3000/api/docs

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` / `npm run start:prod` | Build and run the compiled app |
| `npm run seed` | Create the admin user and starter content (safe to re-run) |
| `npm run db` | Local MongoDB without Docker (mongodb-memory-server) |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests against an in-memory MongoDB |
| `npm run lint` | ESLint |

Copy data between databases:

```bash
node scripts/migrate-to-atlas.mjs --from <SOURCE_URI> --to <TARGET_URI> [--dry-run] [--drop]
```

## Modules

`auth`, `pages`, `stats`, `language-programs`, `corporate-programs`, `educational-services`, `trainers`, `testimonials`, `partners`, `membership`, `contact`, `submissions`, `media`, `storage`, `mail`, `health`.

Public routes are marked with `@Public()`. Everything else requires an admin JWT.

## Environment

See `../.env.example` and `../.env.production.example`. Important values:

- `MONGO_URI`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (different, at least 32 chars in production)
- `CORS_ORIGIN`
- `STORAGE_DRIVER` (`local` or `cloudinary`)
- `THROTTLE_LIMIT` (per visitor IP per minute) and `TRUST_PROXY` (number of proxies in front of the API)
