# Melody Wings — Integrated Deployment Guide

## Architecture

```
                    ┌─────────────────────┐
                    │   NGINX / Cloud LB  │
                    │  (SSL termination)  │
                    └──────┬──────┬───────┘
                           │      │
              ┌────────────┘      └────────────┐
              ▼                                ▼
┌──────────────────────┐         ┌──────────────────────┐
│ MW Admin Frontend    │         │ Safety Frontend      │
│ (Next.js, port 3001) │         │ (Next.js, port 3000) │
│ admin.melodywings.org│         │ embedded via iframe   │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           ▼                                ▼
┌──────────────────────┐         ┌──────────────────────┐
│ MW Backend           │◄────────│ Safety Backend       │
│ (FastAPI, port 8080) │ webhook │ (FastAPI, port 8000) │
│ api.melodywings.org  │────────►│ + Celery Workers     │
└──────────┬───────────┘ proxy   │ + Redis              │
           │                     └──────────┬───────────┘
           ▼                                ▼
┌──────────────────────┐         ┌──────────────────────┐
│ MongoDB Atlas        │         │ MongoDB Atlas        │
│ (melody_wings DB)    │         │ (audio_safety_db)    │
└──────────────────────┘         └──────────┬───────────┘
                                            ▼
                                 ┌──────────────────────┐
                                 │ AWS S3               │
                                 │ (audio + PDF reports)│
                                 └──────────────────────┘
```

## Quick Start (Docker)

```bash
# 1. Clone and enter the workspace
cd mw-integrate

# 2. Copy and fill environment files
cp deploy.env.example melody-wings-backend/.env     # Edit with real values
cp deploy.env.example New-Rmsi-Latest/backend/.env  # Edit with real values

# 3. Start everything
docker compose up -d

# 4. Check status
docker compose ps
docker compose logs -f safety-backend

# 5. Access
# MW Admin:    http://localhost:3001
# Safety:     http://localhost:3000 (or embedded at /safety in MW admin)
# MW API:     http://localhost:8080
# Safety API: http://localhost:8000
```

## Services & Ports

| Service | Port | Description |
|---------|------|-------------|
| mw-backend | 8080 | Main Melody Wings API |
| safety-backend | 8000 | Detection pipeline API (ML analysis) |
| safety-worker | — | Celery worker (background analysis tasks) |
| safety-beat | — | Celery beat (scheduled cleanup, Drive watcher) |
| safety-frontend | 3000 | Detection dashboard (Next.js) |
| mw-admin-frontend | 3001 | MW admin panel (Next.js) |
| redis | 6379 | Task broker + cache |

## Resource Requirements

| Service | RAM (min) | RAM (recommended) | CPU |
|---------|-----------|-------------------|-----|
| mw-backend | 256 MB | 512 MB | 0.5 |
| safety-backend | 1 GB | 4 GB | 2 |
| safety-worker | 2 GB | 6 GB | 2 |
| redis | 64 MB | 256 MB | 0.25 |
| safety-frontend | 128 MB | 256 MB | 0.25 |
| mw-admin-frontend | 128 MB | 256 MB | 0.25 |

**Total minimum: ~4 GB RAM, 4 CPU cores**
**Recommended: ~12 GB RAM, 5 CPU cores**

## Environment Variables (Critical)

### Shared between MW Backend & Safety Backend:
- `SAFETY_API_KEY` — Must match on both sides
- `SAFETY_WEBHOOK_SECRET` / `MW_CALLBACK_SECRET` — Must match

### MW Backend needs:
- `SAFETY_SERVICE_URL=http://safety-backend:8000` (Docker internal)
- All existing MW env vars (MongoDB, JWT, etc.)

### Safety Backend needs:
- `MW_BACKEND_URL=http://mw-backend:8080` (Docker internal)
- `API_KEY` — Same as MW backend's `SAFETY_API_KEY`
- MongoDB URI, S3 credentials, SMTP settings

## Deployment Options

### Option A: Docker Compose (single server)
Use the `docker-compose.yml` at the root. Best for staging or small deployments.

### Option B: Google Cloud Run (current MW setup)
1. Deploy `safety-backend` as a new Cloud Run service
2. Deploy `safety-frontend` as another Cloud Run service
3. Update existing `mw-backend` Cloud Run service with new env vars
4. Use Cloud Memorystore for Redis (or set `USE_CELERY=false`)

### Option C: Kubernetes
Convert docker-compose to k8s manifests. The detection pipeline benefits from
horizontal scaling (multiple Celery workers).

## Useful Commands

```bash
# Rebuild after code changes
docker compose build safety-backend
docker compose up -d safety-backend

# View real-time logs
docker compose logs -f safety-worker

# Scale Celery workers
docker compose up -d --scale safety-worker=3

# Stop everything
docker compose down

# Full cleanup (removes volumes)
docker compose down -v
```
