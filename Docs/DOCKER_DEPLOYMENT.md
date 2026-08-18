# Deployment Guide (DevOps)

How this project ships to production: a **frontend Docker image** (built and pushed automatically by CI) plus a **backend already hosted on Render**. This guide is for whoever deploys the frontend — the exact hosting target isn't finalized yet, so both a "Docker on a server" path and a "static host" path are covered.

## Architecture

```
GitHub (push to main)
   │
   ▼
GitHub Actions ──► builds + pushes ──► Docker Hub
   │                                    ├── wesleywaweru/jhubafrica-website:latest  (frontend)
   │                                    └── wesleywaweru/jhub-backend:latest         (backend — built but NOT used for deploy)
   │
   ▼
Frontend deploy target (TBD)  ◄── pulls jhubafrica-website:latest
        │
        │  API calls
        ▼
Render (backend, deployed independently from Render's own build of backend/Dockerfile)
```

**Key point:** the backend image pushed to Docker Hub is currently unused for deployment — Render builds and runs the backend itself from the repo. If Render is ever swapped for something that runs arbitrary Docker images, that pushed backend image is what you'd deploy instead.

## ⚠️ Image source of truth — read this before deploying

**Only ever deploy images built by the GitHub Actions workflow, pushed to `wesleywaweru/jhubafrica-website`.** Do not build and push the frontend image manually from a local machine, and do not deploy from any other Docker Hub account or repo name.

This isn't a theoretical warning — it already happened once. A manually-built image was deployed instead of the CI-built one, which caused two separate incidents:
- It was out of sync with `main`, so bug fixes merged to the repo silently never reached production.
- It was built/run with the wrong environment — **backend secrets (DB credentials, JWT secrets, API keys) ended up baked into the frontend container's environment**, and `PORT` was overridden incorrectly, breaking routing.

**Before deploying, always verify you're pulling the right image:**
```bash
docker inspect --format='{{index .RepoDigests 0}}' wesleywaweru/jhubafrica-website:latest
```
Compare the digest against the "Last pushed" build on Docker Hub (`hub.docker.com/r/wesleywaweru/jhubafrica-website/tags`) and against the most recent successful GitHub Actions run, to confirm what's about to be deployed actually came from CI.

**If a different image build is genuinely needed** (e.g. testing a different `VITE_APP_API_URL` before merging), build it locally, but never push it to `wesleywaweru/jhubafrica-website:latest` or deploy it to production — tag it distinctly (e.g. `jhub-website-test`) and treat it as throwaway.

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
- Confirm Render's environment variables match `backend/.env` (see `BACKEND_LOCAL_SETUP.md` for the full variable list) — set these in the Render dashboard, not in git.
- Render assigns its own `PORT` at runtime in some plans — confirm the app reads `process.env.PORT` correctly, since the Dockerfile currently hardcodes `EXPOSE 4000`.
- Note the deployed backend's public URL — this is the value that must go into the `VITE_APP_API_URL` GitHub secret for the frontend.

## Frontend deployment

### Path 1 — Docker on a server/VPS

Pull whatever CI last pushed and run it:

```bash
docker pull wesleywaweru/jhubafrica-website:latest
docker run -d \
  --name jhub-website \
  -p 4173:4173 \
  -e PORT=4173 \
  --restart unless-stopped \
  wesleywaweru/jhubafrica-website:latest
```

To redeploy after a new image is pushed:
```bash
docker pull wesleywaweru/jhubafrica-website:latest
docker stop jhub-website && docker rm jhub-website
# re-run the docker run command above
```

Or, using `docker-compose.yml` directly on the server (pulls instead of building, if you swap `build:` for `image:` — see note below):
```bash
docker compose --profile frontend up -d
```

Put a reverse proxy (nginx, Caddy, or similar) in front of port `4173` for TLS and the real domain — that's not handled by this repo's Dockerfile.

**Need to test a different backend URL before merging to `main`?** Build locally for testing only — do not push this to `wesleywaweru/jhubafrica-website` or run it in production (see the source-of-truth warning above):
```bash
docker build \
  --build-arg VITE_APP_API_URL=https://your-actual-backend-url \
  -t jhub-website-test \
  ./frontend
docker run -d -p 4173:4173 -e PORT=4173 jhub-website-test
```

### Path 2 — Static hosting (Vercel / Netlify / similar)

The Dockerfile serves the app via `vite preview` (a Node process), but the build output in `frontend/dist` is a standard static Vite bundle and works on any static host too:

- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_APP_API_URL` as a **build-time** environment variable in the platform's dashboard (same baked-in-at-build constraint as above)
- The Docker setup in this repo would then only be used for local development, not this deployment path

## Known issues we've already hit (read before debugging a 502 or 403)

If `jhubafrica.com` is returning a **502 Bad Gateway** or a **403 "Blocked request"** error, check these first — every incident so far has traced back to one of the two causes below, not a new bug.

### "Blocked request. This host is not allowed" (403)

This is Vite's own `preview.allowedHosts` check rejecting the request — it means the running container is on an **older image build** that predates the `allowedHosts` fix in `frontend/vite.config.ts`. Fix: confirm the deployed image digest matches the latest successful CI build (see "Image source of truth" above), then pull + restart.

### 502 Bad Gateway

This means the reverse proxy successfully received the request but couldn't get a response from the app container — almost always a **port mismatch** between what the container is actually listening on and what the proxy is configured to forward to.

**Root cause, confirmed twice so far:** something set the `PORT` environment variable to `4000` at container runtime (via `-e PORT=4000`, a leftover `--env-file`, or a merged `.env`), overriding the Dockerfile's `${PORT:-4173}` default. The proxy/hosting config expects `4173` (matching the Dockerfile, `docker-compose.yml`, and every guide in this repo), so the two stop agreeing and every request 502s.

**Fix:** don't set `PORT` at all when running the container — let it fall back to `4173`:
```bash
docker stop jhub-website && docker rm jhub-website
docker run -d \
  --name jhub-website \
  --network jhub-network \
  -p 4173:4173 \
  --restart unless-stopped \
  wesleywaweru/jhubafrica-website:latest
```

**How to confirm this is the cause before changing anything:**
```bash
docker logs jhub-website --tail 20
```
Look at the `vite preview --host 0.0.0.0 --port ____` line — if it says anything other than `4173`, this is the issue.

**Important:** `EXPOSE` in the Dockerfile is documentation only — it does not control what port the app actually binds to. Don't try to "fix" a port mismatch by rebuilding the image with a different `EXPOSE` value; the actual fix is always about what `PORT` env var (if any) is passed at `docker run`/deploy time, and making sure the proxy's target port matches.

### Container name matters if the proxy targets it by name

If the reverse proxy's config refers to the upstream by container name (e.g. `proxy_pass http://jhub-website:4173`) rather than a static IP, the container **must** keep that exact name and be on the same Docker network the proxy uses (`jhub-network` in this repo's `docker-compose.yml`) — a rename or a `docker run` without `--network jhub-network` will silently break routing even if the container itself is perfectly healthy. Confirm with:
```bash
docker inspect --format='{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' jhub-website
```

### Stray/leftover containers

Manual builds and one-off testing can leave old containers running in the background, consuming resources without serving any real traffic (check for ports not published to the host, e.g. `4173/tcp` instead of `0.0.0.0:4173->4173/tcp` in `docker ps -a`). Clean these up once confirmed unused:
```bash
docker stop <container-name> && docker rm <container-name>
docker rmi <unused-image>
```