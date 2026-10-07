#!/usr/bin/env bash
# First-time setup for the LMC stack on a VPS that already serves other sites
# with its own Nginx. Run from the project root, as root.
#
#   bash deploy/setup-vps.sh lmc.hopexcompany.com you@example.com
#
# The domain's DNS A record must already point at this server.
# Idempotent: re-running keeps the existing .env.production, data and certificate.
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "usage: bash deploy/setup-vps.sh <domain> <email>" >&2
  exit 1
fi
case "$DOMAIN" in
  *_*) echo "error: '_' is not allowed in a hostname and no CA will issue a certificate for it." >&2; exit 1 ;;
esac

COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.production"

# --- 1. env file -------------------------------------------------------------
if [ -f .env.production ]; then
  echo "==> .env.production already exists, keeping it"
else
  echo "==> generating .env.production with random secrets"
  sed \
    -e "s|CHANGE_ME_random_password|$(openssl rand -hex 24)|" \
    -e "s|CHANGE_ME_64_plus_random_chars|$(openssl rand -hex 48)|" \
    -e "s|CHANGE_ME_DIFFERENT_64_plus_random_chars|$(openssl rand -hex 48)|" \
    -e "s|lmc\.example\.com|$DOMAIN|g" \
    .env.production.example > .env.production
  chmod 600 .env.production
  echo "    !! edit SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.production, then re-run"
fi

BACKEND_PORT_HOST="$(grep -E '^BACKEND_HOST_PORT=' .env.production | cut -d= -f2)"
FRONTEND_PORT_HOST="$(grep -E '^FRONTEND_HOST_PORT=' .env.production | cut -d= -f2)"
BACKEND_PORT_HOST="${BACKEND_PORT_HOST:-3001}"
FRONTEND_PORT_HOST="${FRONTEND_PORT_HOST:-8090}"

# --- 2. ports ----------------------------------------------------------------
# A busy port is the quiet failure mode here: Nginx happily proxies to whatever
# else is listening (a mail dashboard, another app) and the site never appears.
for pair in "backend:$BACKEND_PORT_HOST" "frontend:$FRONTEND_PORT_HOST"; do
  name="${pair%%:*}"; port="${pair##*:}"
  if ss -ltn "sport = :$port" 2>/dev/null | grep -q LISTEN; then
    owner="$(docker ps --filter "publish=$port" --format '{{.Names}}' | head -1)"
    case "$owner" in
      lmc-*) : ;;  # our own container from an earlier run
      *)
        echo "error: port $port ($name) is already in use${owner:+ by $owner}." >&2
        echo "       Pick a free one, set ${name^^}_HOST_PORT in .env.production, and re-run." >&2
        exit 1 ;;
    esac
  fi
done

# --- 3. containers -----------------------------------------------------------
echo "==> building and starting the containers (this takes a few minutes)"
$COMPOSE up -d --build

echo "==> waiting for the API to report healthy"
for i in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:$BACKEND_PORT_HOST/api/health" >/dev/null 2>&1; then
    echo "    API is up"
    break
  fi
  if [ "$i" = 60 ]; then
    echo "    API did not come up. Logs:" >&2
    $COMPOSE logs --tail 50 backend >&2
    exit 1
  fi
  sleep 5
done

echo "==> checking the site container"
if ! curl -fsS "http://127.0.0.1:$FRONTEND_PORT_HOST/" >/dev/null 2>&1; then
  echo "    the site is not answering on 127.0.0.1:$FRONTEND_PORT_HOST. Logs:" >&2
  $COMPOSE logs --tail 30 frontend >&2
  exit 1
fi
echo "    site is up"

# --- 4. seed the database ----------------------------------------------------
echo "==> seeding the database (safe to repeat)"
$COMPOSE exec -T backend node dist/database/seed.js

# --- 5. Nginx server block ---------------------------------------------------
# Added alongside the server's existing sites; none of them are touched.
SITE_AVAILABLE="/etc/nginx/sites-available/lmc"
if [ -f "$SITE_AVAILABLE" ]; then
  echo "==> $SITE_AVAILABLE already exists, keeping it (delete it by hand to regenerate)"
else
  echo "==> installing the Nginx server block for $DOMAIN"
  sed -e "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" \
      -e "s|http://127.0.0.1:3001|http://127.0.0.1:$BACKEND_PORT_HOST|g" \
      -e "s|http://127.0.0.1:8090|http://127.0.0.1:$FRONTEND_PORT_HOST|g" \
      deploy/nginx/lmc.conf > "$SITE_AVAILABLE"
  ln -sf "$SITE_AVAILABLE" /etc/nginx/sites-enabled/lmc
fi
nginx -t
systemctl reload nginx
echo "    http://$DOMAIN should now serve the site"

# --- 6. certificate ----------------------------------------------------------
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "==> certificate for $DOMAIN already exists, skipping"
elif command -v certbot >/dev/null 2>&1; then
  echo "==> requesting the Let's Encrypt certificate"
  certbot --nginx -d "$DOMAIN" --email "$EMAIL" --agree-tos --no-eff-email --redirect
else
  echo "==> certbot is not installed. Install it and re-run, or run by hand:"
  echo "    apt install -y certbot python3-certbot-nginx"
  echo "    certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email --redirect"
fi

echo
echo "Done. https://$DOMAIN  (admin at https://$DOMAIN/leaderrami)"
