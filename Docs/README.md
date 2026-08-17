# JHub Africa Website

Monorepo containing the **frontend** (React + Vite) and **backend** (Node/Express + Prisma), both containerized with Docker. The backend is hosted on **Render**; frontend hosting is still being finalized.

```
jhubafrica_website/
├── docker-compose.yml     # orchestrates frontend + backend containers
├── .env                   # used by docker-compose (build args, ports)
├── frontend/
├── backend/
└── Docs/
    ├── FRONTEND_SETUP.md      # team members: run the frontend locally in Docker
    ├── BACKEND_LOCAL_SETUP.md # optional: run the backend locally instead of Render
    └── DOCKER_DEPLOYMENT.md   # devops: shipping the frontend image + Render backend to production
```

## Where to start

- **Setting up the frontend on your machine?** → [`FRONTEND_SETUP.md`](./FRONTEND_SETUP.md)
- **Need the backend running locally too?** → [`BACKEND_LOCAL_SETUP.md`](./BACKEND_LOCAL_SETUP.md)
- **Deploying to production?** → [`DOCKER_DEPLOYMENT.md`](./DOCKER_DEPLOYMENT.md)

## CI/CD

On every push to `main`, GitHub Actions builds and pushes both images to Docker Hub:
- `<dockerhub-username>/jhubafrica-website:latest` (frontend)
- `<dockerhub-username>/jhub-backend:latest` (backend — currently unused for deploy; see [`DOCKER_DEPLOYMENT.md`](./DOCKER_DEPLOYMENT.md))

Required repo secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `VITE_APP_API_URL`.

