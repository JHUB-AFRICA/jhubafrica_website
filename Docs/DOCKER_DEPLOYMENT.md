# Deployment Guide (DevOps)

How this project ships to production: a **frontend Docker image** (built and pushed automatically by CI) plus a **backend already hosted on Render**. This guide is for whoever deploys the frontend — the exact hosting target isn't finalized yet, so both a "Docker on a server" path and a "static host" path are covered.

## Architecture

```
GitHub (push to main)
   │
   ▼
GitHub Actions ──► builds + pushes ──► Docker Hub
   │                                    ├── <dockerhub-username>/jhubafrica-website:latest  (frontend)
   │                                    └── <dockerhub-username>/jhub-backend:latest         (backend — built but NOT used for deploy)
   │
   ▼
Frontend deploy target (TBD)  ◄── pulls jhubafrica-website:latest
        │
        │  API calls
        ▼
Render (backend, deployed independently from Render's own build of backend/Dockerfile)
```

**Key point:** the backend image pushed to Docker Hub is currently unused for deployment — Render builds and runs the backend itself from the repo. If Render is ever swapped for something that runs arbitrary Docker images, that pushed backend image is what you'd deploy instead.

## Required secrets (CI)

Set in GitHub → repo → Settings → Secrets and variables → Actions:

| Secret | Used for |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub login |
| `DOCKERHUB_TOKEN` | Docker Hub login |
| `VITE_APP_API_URL` | Baked into the frontend build — should be the **production** Render backend URL |

> ⚠️ `VITE_APP_API_URL` is a Vite **build-time** variable. Whatever value is set in this GitHub secret is permanently baked into the JS bundle the moment CI builds the image. You cannot override it later with `docker run -e` or any runtime environment variable — changing the API URL means updating the secret and letting CI rebuild the image (or building manually with a different value, see below).

## Backend (Render)

No action needed here for a normal deploy — Render is already configured to build `backend/Dockerfile` and deploy on push (or however the Render service is currently connected to the repo).

Checklist if you're setting this up fresh or auditing it:
- Confirm Render's environment variables match `backend/.env` (see [`BACKEND_LOCAL_SETUP.md`](./BACKEND_LOCAL_SETUP.md) for the full variable list) — set these in the Render dashboard, not in git.
- Render assigns its own `PORT` at runtime in some plans — confirm the app reads `process.env.PORT` correctly, since the Dockerfile currently hardcodes `EXPOSE 4000`.
- Note the deployed backend's public URL — this is the value that must go into the `VITE_APP_API_URL` GitHub secret for the frontend.

## Frontend deployment

### Path 1 — Docker on a server/VPS

Pull whatever CI last pushed and run it:

```bash
docker pull <dockerhub-username>/jhubafrica-website:latest
docker run -d \
  --name jhub-website \
  -p 4173:4173 \
  -e PORT=4173 \
  --restart unless-stopped \
  <dockerhub-username>/jhubafrica-website:latest
```

To redeploy after a new image is pushed:
```bash
docker pull <dockerhub-username>/jhubafrica-website:latest
docker stop jhub-website && docker rm jhub-website
# re-run the docker run command above
```

Or, using `docker-compose.yml` directly on the server (pulls instead of building, if you swap `build:` for `image:` — see note below):
```bash
docker compose --profile frontend up -d
```

Put a reverse proxy (nginx, Caddy, or similar) in front of port `4173` for TLS and the real domain — that's not handled by this repo's Dockerfile.

**Need to point at a different backend URL than what's baked into `:latest`?** Build manually instead of using the CI image:
```bash
docker build \
  --build-arg VITE_APP_API_URL=https://your-actual-backend-url \
  -t jhub-website-custom \
  ./frontend
docker run -d -p 4173:4173 -e PORT=4173 jhub-website-custom
```

### Path 2 — Static hosting (Vercel / Netlify / similar)

The Dockerfile serves the app via `vite preview` (a Node process), but the build output in `frontend/dist` is a standard static Vite bundle and works on any static host too:

- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_APP_API_URL` as a **build-time** environment variable in the platform's dashboard (same baked-in-at-build constraint as above)
- The Docker setup in this repo would then only be used for local development, not this deployment path
