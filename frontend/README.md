# LMC frontend

React 19 + Vite + TypeScript + Tailwind CSS. Public site and admin dashboard.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173 (proxies /api to http://localhost:3000)
npm run build     # type-check and build to dist/
npm run lint
npm run preview
```

## Environment

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | API base URL. Defaults to `/api` (dev proxy). Required on Vercel. |
| `VITE_API_PROXY_TARGET` | Dev proxy target, defaults to `http://localhost:3000`. |

## Structure

```
src/
  pages/            public pages
  components/
    home/           home page sections
    layout/         navbar, footer, root layout
    ui/             shared UI components
    motion/         page transitions and scroll effects
  admin/            dashboard (lazy loaded under /leaderrami)
  i18n/             Arabic / English translations
  lib/              API client, hooks, types
```

Content shown on the site comes from the API and is edited from the dashboard.
