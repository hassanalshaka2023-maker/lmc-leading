# LMC — QA notes

Last reviewed: September 2026.

## Security

| Area | Control |
|---|---|
| Input validation | Global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`). Bodies and queries are typed DTOs with `class-validator`. |
| NoSQL injection | DTOs reject object payloads such as `{"$ne": ...}`; unknown keys are stripped; `category` is enum-validated. |
| Bad ids | Mongoose `CastError` returns 400, no stack trace. |
| Auth | JWT access (15m) + refresh (7d) with separate secrets. Refresh token stored as a bcrypt hash, rotated on refresh, cleared on logout. |
| Passwords | bcrypt cost 12, hash fields are `select: false`. |
| Brute force | Login limited to 5/min, account locked 15 min after 5 failed attempts. |
| Rate limiting | Global limit per visitor IP (`THROTTLE_LIMIT`, default 120/min). Login and submissions have their own 5/min limits. `TRUST_PROXY` must match the number of proxies in front of the API, otherwise every visitor counts as one IP. |
| Contact form | Message capped at 4000 chars, `sourceIp` stored, response returns only `{ success, id }`. |
| CSV export | Cells starting with `=`, `+`, `-`, `@`, tab or CR are prefixed with `'`. |
| Uploads | PNG/JPEG/WebP/GIF only (no SVG), 5 MB max. `/uploads` served with `default-src 'none'` and `nosniff`. |
| Headers / CORS | `helmet()`; CORS restricted to `CORS_ORIGIN`. |
| Errors | Uniform `{ statusCode, error, message, path, timestamp }`; 5xx messages are generic. |
| Secrets | In production the app refuses to start with weak or identical JWT secrets. |

### Open items

- Add a Content-Security-Policy for the frontend at the Nginx/Vercel level.
- Give the MongoDB user `readWrite` on `lmc_db` only.
- Change the seeded admin password after first login.
- Refresh token lives in `localStorage`. Move it to an `HttpOnly` cookie if the dashboard is ever used outside a trusted setup.
- Block `/api/docs` in production (see DEPLOY.md).

## Brand

- Teal `#0F5270` for navigation, headings and main surfaces; orange `#F05223` for buttons and highlights.
- White and light grey backgrounds.
- Red is used only for delete actions and validation errors.
- Logo: `public/lmc-logo-full.png` (used in navbar, footer, dashboard and home page). Favicon: `public/favicon.svg`.

## Responsive and accessibility

- Mobile-first Tailwind breakpoints; navigation collapses below `lg`.
- Grids go 1 → 2 → 3/4 columns. Admin tables scroll inside their own container.
- RTL/LTR: `dir` and `lang` are set on `<html>` when the language changes; logical spacing utilities (`ps-`, `me-`, `start-`, `end-`) throughout.
- Visible `:focus-visible` outline, `aria-label` on icon-only buttons, `alt` on images.
- Animations respect `prefers-reduced-motion`.
- Top-level `ErrorBoundary`.

To do: associate form labels with their inputs (`htmlFor`/`id`) and add `role="dialog"` + focus handling to the admin modal.

Check manually at 360 / 768 / 1024 / 1440 px and run Lighthouse before launch.

## Performance

- Admin dashboard is code-split; public visitors don't download it.
- Public GET requests are de-duplicated and cached for 60s in the browser (`useResource`).
- API reads use `.lean()`; indexes on `slug`, `order`, `isPublished`, `submissions.createdAt/status/type`, `adminUsers.email`.
- Hashed assets are served with long-lived `Cache-Control`.

To do:
- Main JS bundle is ~224 kB gzip. Lazy-load public pages and consider dropping one of the two animation libraries (GSAP / Framer Motion).
- Compress the images in `src/assets/images` (some are over 200 kB).
- Resize/convert uploads to WebP.

## Tests

- `npm test` (backend): 12 unit tests — roles guard, auth service (login, wrong password, lockout), submissions service (CSV escaping, create response), `definedOnly`.
- `npm run test:e2e`: boots the app against an in-memory MongoDB — health, public content, stats, contact info, submission validation, admin 401, login flow, partial contact-info update.
- No frontend tests yet.

## Acceptance checklist

- [x] Every section of the requirements is present and editable from the dashboard (home page marketing sections are still static text)
- [x] Stats come from a single `siteStats` document
- [x] Brand colours applied
- [x] Contact form saves to the database and shows in the dashboard
- [x] Works on mobile, tablet and desktop
- [ ] Real trainer / testimonial / partner photos and real contact details (waiting on client)
