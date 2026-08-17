# Backend Local Setup Guide (Optional)

By default, the frontend talks to the backend hosted on Render — most teammates never need this guide. Follow it only if you need to run the backend locally (e.g. testing backend changes before they're deployed).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- Access to the real backend secret values (ask a teammate directly — password manager, Render dashboard, etc. — **never** via chat, email, or committed files)

## 1. Create `backend/.env`

This file is git-ignored and must be created locally. Copy the template below and fill in real values:

```bash
# backend/.env

# API server
NODE_ENV=development
PORT=4000
API_VERSION=v1

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:4173,https://jhubafrica.com,https://www.jhubafrica.com

# Database (Supabase) — direct connection (IPv6-only)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
# If using Supabase's IPv4 connection pooler instead, use the pooler-style
# DATABASE_URL / DIRECT_URL from the Supabase dashboard

# JWT auth
JWT_SECRET=
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=30d

# Caching — optional (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=

# File storage — optional (Cloudflare R2)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=2000
```

## 2. Point the frontend at your local backend

Update the **root** `.env` (next to `docker-compose.yml`) so the frontend build talks to `localhost` instead of Render:

```bash
cat > .env << 'EOF'
VITE_APP_API_URL=http://localhost:4001
PORT=4173
EOF
```

(Backend container listens on `4000` internally, mapped to host port `4001` — see `docker-compose.yml`.)

## 3. Build and run both services

```bash
docker-compose build
docker-compose up -d --profile all
```

or, targeting services individually (same "name bypasses profile" behavior as the frontend guide):
```bash
docker-compose build web backend
docker-compose up web backend -d
```

## 4. Verify

```bash
docker compose ps
docker compose logs -f backend
```

- Frontend: **http://localhost:4173**
- Backend: **http://localhost:4001**

## 5. Stop everything

```bash
docker-compose --profile all down
```

## Switching back to Render

Just revert the root `.env`:
```bash
VITE_APP_API_URL=https://your-backend.onrender.com
```
...and rebuild the frontend (see [`FRONTEND_SETUP.md`](./FRONTEND_SETUP.md) for the rebuild steps). No need to touch `backend/.env` — it's simply unused when you're not running the `backend` service.
