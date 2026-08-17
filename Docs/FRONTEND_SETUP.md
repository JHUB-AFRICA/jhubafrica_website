# Frontend Setup Guide (Team Members)

Run the frontend locally in Docker, pointed at the live backend on Render. You do **not** need to run the backend for this.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- This repo cloned locally

## 1. Set up environment variables

Create a `.env` file at the **repo root** (same folder as `docker-compose.yml` — not inside `frontend/`):

```bash
cd jhubafrica_website

VITE_APP_API_URL=https://your-backend.onrender.com
PORT=4173

```

This is the one Docker Compose actually reads for the build. `frontend/.env` is a separate file only used if you run the app with `npm run dev` outside Docker — it's not needed for the Docker workflow below.

> ⚠️ `VITE_APP_API_URL` gets baked into the app at **build time**, not read at runtime. If you change it later, you must rebuild the image (steps below cover this).

## 2. Build and run

Two equivalent ways to do this — pick whichever you're already using.

### Option A — target the service by name (what's been used so far)

```bash
docker-compose build web
docker-compose up web -d
```

This works even though `web` has `profiles: [frontend, all]` set in `docker-compose.yml` — naming a service directly bypasses profile filtering. (`docker-compose` here is the v1 CLI; if you have Compose v2, the equivalent is `docker compose` as two words — both work the same way.)

### Option B — use the profile flag

```bash
docker compose --profile frontend up --build -d
```

Functionally identical to Option A; this is the form used elsewhere in the project docs, so it's included here for consistency.

## 3. Verify it's running

```bash
docker compose ps
docker compose logs -f web
```

Visit **http://localhost:4173**

## 4. Stopping it

```bash
docker-compose down
# or: docker compose down
```

## 5. Rebuilding after a change

**Code change (no `.env` change):**
```bash
docker-compose build web
docker-compose up web -d
```

**Changed `VITE_APP_API_URL` or other build args in `.env`:**
Because the value is baked in at build time, a plain restart won't pick it up — force a full rebuild:
```bash
docker-compose build --no-cache web
docker-compose up web -d --force-recreate
```

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| App loads but API calls fail / hit the wrong URL | `.env` was changed but image wasn't rebuilt | See "Rebuilding after a change" above |
| `docker-compose up` does nothing | Compose v1/v2 syntax mismatch, or missing profile/service name | Use one of the two options in step 2 exactly as written |
| Port `4173` already in use | Something else is bound to it | Change `PORT` in the root `.env`, e.g. `PORT=4174`, then rebuild |

Want to run the backend locally too instead of using Render? See [`BACKEND_LOCAL_SETUP.md`](./BACKEND_LOCAL_SETUP.md).
