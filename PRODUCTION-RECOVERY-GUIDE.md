# Melody Wings — Production Recovery & Safe Merge Guide

**Date:** June 26, 2026  
**Platform:** Google Cloud Run + MongoDB Atlas + Vercel + Play Store (pending)  
**Organization:** greyfeathers-dev (GitHub)

---

## Table of Contents

1. [Complete System Map](#1-complete-system-map)
2. [All Pending PRs Across Repos](#2-all-pending-prs-across-repos)
3. [Pre-Merge Safety Checklist](#3-pre-merge-safety-checklist)
4. [Safe Merge Strategy (Per Repo)](#4-safe-merge-strategy)
5. [Rollback Procedures (Per Service)](#5-rollback-procedures)
6. [Common Failure Scenarios & Fixes](#6-common-failure-scenarios--fixes)
7. [Database Recovery](#7-database-recovery)
8. [Mobile App Recovery](#8-mobile-app-recovery)
9. [Monitoring & Verification](#9-monitoring--verification)
10. [Emergency Runbook](#10-emergency-runbook)

---

## 1. Complete System Map

### Repositories & Deployment Targets

| Repo | GitHub URL | Stack | Production URL | Platform |
|------|-----------|-------|----------------|----------|
| melody-wings-backend | `greyfeathers-dev/melody-wings-backend` | Python 3.9, FastAPI 0.104.1, PyMongo 4.6.0 | api.melodywings.org | Google Cloud Run |
| melody-wings-frontend | `greyfeathers-dev/melody-wings-frontend` | Next.js 14, React 18, Node 22, Capacitor 8.4 | melodywings.org + Play Store | Vercel + Android |
| melody-wings-admin-frontend | `greyfeathers-dev/melody-wings-admin-frontend` | Next.js 15.5, React 18, Node ≥20.16 | admin.melodywings.org | Vercel |
| New-Rmsi-Latest (Safety) | (internal/no separate remote) | Python 3.11, FastAPI 0.136.1, Celery 5.4, PyTorch 2.6 | audio-safety-backend-781782361175.us-central1.run.app | Cloud Run |
| New-Rmsi-Latest/admin-next | (internal) | Next.js 15, React 19, Zustand | transcript-analysis-yo1h.vercel.app | Vercel |

### Architecture Diagram

```
                    ┌─────────────────────────────────────┐
                    │         PRODUCTION SERVICES          │
                    └─────────────────────────────────────┘

  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │ melodywings.org  │    │admin.melodywings │    │transcript-analysis│
  │ (Vercel)         │    │    .org (Vercel) │    │ -yo1h.vercel.app │
  │ Next.js 14       │    │ Next.js 15       │    │ Next.js 15       │
  │ + Android App    │    │ iframes Safety → │────│ (Safety Dashboard)│
  └───────┬──────────┘    └───────┬──────────┘    └───────┬──────────┘
          │                       │                        │
          ▼                       ▼                        ▼
  ┌──────────────────────────────────────┐    ┌──────────────────────┐
  │ api.melodywings.org (Cloud Run)      │◄──►│ Safety Backend       │
  │ FastAPI, Python 3.9, Port 8080       │    │ (Cloud Run)          │
  │ GCP: client-projects-410916          │    │ FastAPI, Python 3.11 │
  │ Region: us-central1                  │    │ Port 8000            │
  │ JWT Auth + Fernet Encryption         │    │ + Celery Worker      │
  └───────┬──────────────────────────────┘    │ + Upstash Redis      │
          │                                    └───────┬──────────────┘
          ▼                                            ▼
  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │ MongoDB Atlas    │    │ MongoDB Atlas    │    │ AWS S3            │
  │ DB: melody_wings │    │ DB: audio_safety │    │ audio + PDF       │
  │ 40+ collections  │    │    _db           │    │ reports           │
  └──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Inter-Service Dependencies

| Service A | Depends On | Connection |
|-----------|-----------|-----------|
| User Frontend | MW Backend | HTTPS → api.melodywings.org |
| Admin Frontend | MW Backend | NEXT_PUBLIC_API_URL env var |
| Admin Frontend | Safety Frontend | iframe embed (NEXT_PUBLIC_SAFETY_DASHBOARD_URL) |
| MW Backend | MongoDB Atlas | MONGO_URI + MONGO_USERNAME + MONGO_PASSWORD |
| MW Backend | Safety Backend | SAFETY_SERVICE_URL (proxy pattern) |
| Safety Backend | MW Backend | MW_BACKEND_URL (webhook callbacks) |
| Safety Backend | Upstash Redis | REDIS_URL (Celery broker) |
| Safety Backend | MongoDB Atlas | MONGO_URI (audio_safety_db) |
| Safety Backend | AWS S3 | Audio + PDF storage |
| Safety Backend | GCS Bucket | ML model weights (gs://melodywings-ml-models/) |
| Mobile App | MW Backend | https://api.melodywings.org/api/v1 |

### Shared Secrets (MUST match between services)

| Secret | Used By | Purpose |
|--------|---------|---------|
| SAFETY_API_KEY / API_KEY | MW Backend + Safety Backend | Inter-service auth |
| SAFETY_WEBHOOK_SECRET / MW_CALLBACK_SECRET | MW Backend + Safety Backend | Webhook signature verification |

---

## 2. All Pending PRs Across Repos

### melody-wings-backend (5 security PRs + 2 feature branches)

| PR/Branch | Changes | Risk | Target |
|-----------|---------|------|--------|
| #191 `fix/security-hardening` | bcrypt migration, admin auth protection | **HIGH** | master |
| #192 `fix/rate-limit-cors-ssl` | Rate limiting (slowapi), webhook signatures | **MEDIUM** | master |
| #193 `fix/docker-deps-pinning` | Python 3.11, pinned deps, Docker security | **HIGH** | master |
| #194 `fix/email-hash-index-lookup` | HMAC-SHA256 user lookup, O(n)→O(1) | **HIGH** | master |
| #195 `ci/github-actions-pipeline` | GitHub Actions: lint, test, Docker build | **LOW** | master |
| `feature/mobile-cors-support` | Capacitor CORS origins added | **LOW** | master |
| `release/playstore-v1.0.0` | Account deletion endpoint | **MEDIUM** | master |
| `fix/unprotected-endpoints-auth` | Endpoint auth fixes | **MEDIUM** | master |

### melody-wings-frontend (4 PRs + mobile branches)

| PR/Branch | Changes | Risk | Target |
|-----------|---------|------|--------|
| #295 `perf/fe-quick-wins-caching` | Remove force-dynamic, add staleTime, remove devtools | **LOW** | master |
| #296 `perf/fe-replace-moment` | moment.js → dayjs (24 files migrated) | **MEDIUM** | master |
| `fix/lottie-ssr-crash` | Lottie SSR fix | **LOW** | master |
| `feature/capacitor-android-app` | Full Capacitor mobile app | **N/A** (separate output) | master |
| `fix/mobile-auth-redirect` | Native Google Sign-In fix | **N/A** (mobile only) | feature/capacitor-android-app |
| `release/playstore-v1.0.0` | Production-ready mobile build | **N/A** (mobile only) | feature/capacitor-android-app |

### melody-wings-admin-frontend (3 PRs)

| PR/Branch | Changes | Risk | Target |
|-----------|---------|------|--------|
| #67 `perf/admin-quick-wins-caching` | Add staleTime, remove devtools | **LOW** | master |
| #68 `perf/admin-replace-moment` | moment.js → dayjs (11 files) | **LOW** | master |
| `feature/safety-dashboard` | Safety iframe integration + /safety page | **MEDIUM** | master |
| `fix/auth-cookie-redirect` | Auth redirect fix | **LOW** | feature/safety-dashboard |

---

## 3. Pre-Merge Safety Checklist

### For EVERY merge, do these first:

#### A. Tag current production state

```bash
# In melody-wings-backend:
cd melody-wings-backend
git checkout master
git pull origin master
git tag production-stable-2026-06-26
git push origin production-stable-2026-06-26

# In melody-wings-frontend:
cd ../melody-wings-frontend
git checkout master
git pull origin master
git tag production-stable-2026-06-26
git push origin production-stable-2026-06-26

# In melody-wings-admin-frontend:
cd ../melody-wings-admin-frontend
git checkout master
git pull origin master
git tag production-stable-2026-06-26
git push origin production-stable-2026-06-26
```

#### B. Note current Cloud Run revisions

```bash
# MW Backend (GCP project: client-projects-410916)
gcloud run revisions list ^
  --service melody-wings-backend ^
  --region us-central1 ^
  --project client-projects-410916

# Safety Backend
gcloud run revisions list ^
  --service audio-safety-backend ^
  --region us-central1
```

#### C. Database backup

```bash
# MongoDB Atlas: Atlas Console → Cluster → Backup → Take Snapshot Now
# OR use mongodump:
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/melody_wings" ^
  --out ./backups/pre-deploy-%date:~-4%%date:~3,2%%date:~0,2%
```

#### D. Note current Vercel deployments

```
# Go to each project's Vercel dashboard:
# - https://vercel.com/greyfeathers/melody-wings-frontend/deployments
# - https://vercel.com/greyfeathers/melody-wings-admin-frontend/deployments  
# - https://vercel.com/greyfeathers/transcript-analysis/deployments
# Screenshot or note the current production deployment URL
```

---

## 4. Safe Merge Strategy

### Golden Rules:
1. **One PR at a time, one repo at a time**
2. **Verify after each merge before moving to the next**
3. **Backend changes BEFORE frontend changes** (frontends depend on backend)
4. **Low-risk PRs first**

### Recommended Complete Merge Order:

```
═══════════════════════════════════════════════════════════════
WEEK 1 — LOW RISK (No runtime behavior changes)
═══════════════════════════════════════════════════════════════

Day 1: Backend #195 (CI/CD pipeline)
       → Zero runtime risk. Just adds GitHub Actions.
       → Verify: CI runs on next PR push

Day 1: Admin #67 (staleTime + remove devtools)
       → Vercel auto-deploys on merge to master
       → Verify: Admin panel loads, no devtools panel visible

Day 1: Frontend #295 (staleTime + remove force-dynamic + devtools)
       → Vercel auto-deploys on merge to master
       → Verify: melodywings.org loads, pages cache on navigation

Day 2: Admin #68 (moment → dayjs)
       → Verify: All dates display correctly in admin panel
       → Check: donations page, reports, volunteer/learner dates

Day 2: Frontend #296 (moment → dayjs)
       → Verify: Schedule calendar dates correct
       → Check: Messages timestamps, session booking times
       → Check: Timezone-dependent features (IST display)

═══════════════════════════════════════════════════════════════
WEEK 1 — MEDIUM RISK (Behavior changes, easy rollback)
═══════════════════════════════════════════════════════════════

Day 3: Backend #192 (Rate limiting + webhook signatures)
       → Deploy to Cloud Run
       → Verify: API still responds normally
       → Verify: Rate limits don't block normal usage
       → Test: Hit /api/v1/auth/login 5 times rapidly (should work)
       → Monitor: 4-6 hours for 429 errors in Sentry

Day 3: Admin `feature/safety-dashboard` (Safety iframe)
       → Verify: Admin panel loads, /safety page shows iframe
       → This doesn't affect existing admin functionality

═══════════════════════════════════════════════════════════════
WEEK 2 — HIGH RISK (Runtime/data changes)
═══════════════════════════════════════════════════════════════

Day 4: Backend #191 (bcrypt + admin auth)
       ⚠️ BACKUP DATABASE FIRST
       → Deploy to Cloud Run
       → Verify: Admin login at admin.melodywings.org still works
       → Verify: User Google login still works
       → Verify: /create_credentials now requires JWT
       → Monitor: 24 hours

Day 5: Backend #193 (Python 3.11 + Docker + pinned deps)
       → This changes the ENTIRE runtime
       → Deploy to Cloud Run
       → Verify: Service starts (check Cloud Run logs)
       → Verify: No ImportError in logs
       → Verify: All API endpoints respond
       → Monitor: 4-6 hours

Day 6: Backend #194 (HMAC-SHA256 user lookup)
       ⚠️ BACKUP DATABASE FIRST (mandatory)
       → Run data migration script first
       → Deploy to Cloud Run
       → Verify: User login works (this changes how users are found!)
       → Verify: Profile pages load
       → Verify: Volunteer/learner lookup still works
       → Monitor: 24+ hours

═══════════════════════════════════════════════════════════════
WEEK 2 — FEATURE BRANCHES (After all fixes merged)
═══════════════════════════════════════════════════════════════

Day 7: Backend `feature/mobile-cors-support`
       → Adds capacitor://localhost to CORS origins
       → Required before mobile app release
       → Low risk (only adds new allowed origins)

Day 7: Backend `release/playstore-v1.0.0`
       → Adds DELETE /api/v1/auth/delete-account endpoint
       → Required for Play Store compliance
       → Test: Account deletion works

═══════════════════════════════════════════════════════════════
MOBILE APP (Independent of web — separate pipeline)
═══════════════════════════════════════════════════════════════

After all backend merges:
  Frontend `feature/capacitor-android-app`
  Frontend `release/playstore-v1.0.0`
  → Build signed AAB
  → Submit to Play Store
  → This does NOT affect web deployment (separate build output)
```

### How to deploy each service after merge:

#### MW Backend (Cloud Run):
```bash
cd melody-wings-backend
git checkout master
git pull origin master

# Build and push Docker image
docker build -t gcr.io/client-projects-410916/melody-wings-backend:latest . --platform linux/amd64
docker push gcr.io/client-projects-410916/melody-wings-backend:latest

# Deploy
gcloud run deploy melody-wings-backend ^
  --image gcr.io/client-projects-410916/melody-wings-backend:latest ^
  --platform managed ^
  --region us-central1 ^
  --project client-projects-410916 ^
  --port 8080
```

#### Frontends (Vercel — automatic):
```
Vercel auto-deploys when you merge to master.
No manual deployment needed.
Just merge the PR on GitHub → Vercel picks up the change.
Wait 2-3 minutes for build to complete.
```

#### Safety Backend (Cloud Run):
```bash
cd New-Rmsi-Latest/backend

gcloud run deploy audio-safety-backend ^
  --source . ^
  --region us-central1 ^
  --memory 2Gi ^
  --cpu 2 ^
  --timeout 900 ^
  --port 8000 ^
  --min-instances=1
```

---

## 5. Rollback Procedures

### 5A. MW Backend (Cloud Run) — Instant Rollback (~10 seconds)

```bash
# 1. List all revisions (find the last working one)
gcloud run revisions list ^
  --service melody-wings-backend ^
  --region us-central1 ^
  --project client-projects-410916

# 2. Route ALL traffic to previous revision
gcloud run services update-traffic melody-wings-backend ^
  --to-revisions=REVISION_NAME_HERE=100 ^
  --region us-central1 ^
  --project client-projects-410916

# Example (replace with actual revision name):
# gcloud run services update-traffic melody-wings-backend ^
#   --to-revisions=melody-wings-backend-00042-abc=100 ^
#   --region us-central1 ^
#   --project client-projects-410916
```

**What this does:** Routes 100% traffic to old revision. New broken revision gets 0 traffic. Zero downtime.

### 5B. Safety Backend (Cloud Run) — Instant Rollback

```bash
gcloud run revisions list ^
  --service audio-safety-backend ^
  --region us-central1

gcloud run services update-traffic audio-safety-backend ^
  --to-revisions=REVISION_NAME_HERE=100 ^
  --region us-central1
```

### 5C. User Frontend (Vercel) — 30 seconds

```
Option 1: Vercel Dashboard
  → Go to: vercel.com → melody-wings-frontend → Deployments
  → Find the last working deployment
  → Click "..." → "Promote to Production"

Option 2: Vercel CLI
  npx vercel rollback

Option 3: Git revert + auto-deploy
  git revert -m 1 <merge-commit-hash>
  git push origin master
  # Vercel auto-deploys the revert
```

### 5D. Admin Frontend (Vercel) — 30 seconds

Same as above but for the admin project:
```
Vercel Dashboard → melody-wings-admin-frontend → Deployments → Promote previous
```

### 5E. Safety Frontend (Vercel) — 30 seconds

```
Vercel Dashboard → transcript-analysis → Deployments → Promote previous
```

### 5F. Git Revert (any repo)

```bash
# Find the merge commit
git log --oneline -10

# Revert the merge (creates a NEW safe commit)
git revert -m 1 <merge-commit-hash>
git push origin master

# For Vercel-deployed repos, this auto-triggers redeployment
# For Cloud Run, you need to rebuild and deploy manually
```

### 5G. Return to Tagged Stable State (Nuclear Option)

```bash
# Go back to the exact commit that was working
git checkout production-stable-2026-06-26
git checkout -b hotfix/emergency-rollback
git push origin hotfix/emergency-rollback

# Then deploy that branch (Cloud Run):
docker build -t gcr.io/client-projects-410916/melody-wings-backend:rollback . --platform linux/amd64
docker push gcr.io/client-projects-410916/melody-wings-backend:rollback
gcloud run deploy melody-wings-backend ^
  --image gcr.io/client-projects-410916/melody-wings-backend:rollback ^
  --region us-central1 ^
  --project client-projects-410916
```

---

## 6. Common Failure Scenarios & Fixes

### 6.1 — "Admin can't log in" (after PR #191 bcrypt migration)

**Root Cause:** Current admin auth in `routes/v1/admin/auth.py` uses:
```python
input_hash = auth_handler.get_password_hash(password)
if input_hash == stored_hash:  # Direct comparison (deterministic hash)
```
PR #191 changes to bcrypt which is NON-deterministic (salt-based).

**Immediate Fix:** Rollback Cloud Run to previous revision.

**Proper Fix:** Ensure PR #191 includes transparent migration:
```python
import bcrypt

def verify_admin_password(plain_password, stored_hash):
    # Try bcrypt first (new format starts with $2b$)
    if stored_hash.startswith("$2b$"):
        return bcrypt.checkpw(plain_password.encode(), stored_hash.encode())
    # Fallback: old deterministic hash
    old_hash = auth_handler.get_password_hash(plain_password)
    if old_hash == stored_hash:
        # Migrate to bcrypt on successful login
        new_hash = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()
        admin_collection.update_one(
            {"hashed_credentials": stored_hash},
            {"$set": {"hashed_credentials": new_hash}}
        )
        return True
    return False
```

### 6.2 — "Users getting 429 Too Many Requests" (after PR #192)

**Immediate Fix:**
```bash
# Disable rate limiting via env var
gcloud run services update melody-wings-backend ^
  --update-env-vars "RATE_LIMIT_ENABLED=false" ^
  --region us-central1 ^
  --project client-projects-410916
```

**Proper Fix:** Increase rate limits in code and redeploy.

### 6.3 — "ImportError / Container won't start" (after PR #193 Python upgrade)

**Symptoms:** Cloud Run shows "Container failed to start" in logs.

**Immediate Fix:** Rollback to previous revision (takes 10 seconds).

**Debug:**
```bash
# Read Cloud Run logs to find which import fails
gcloud logging read ^
  "resource.type=cloud_run_revision AND severity>=ERROR AND resource.labels.service_name=melody-wings-backend" ^
  --limit 30 ^
  --project client-projects-410916
```

**Common causes:**
- Package incompatible with Python 3.11 → update that package version
- Missing system dependency in new Dockerfile → add to apt-get install
- `icecream` or other dev packages may have version conflicts

### 6.4 — "User login broken / profiles not loading" (after PR #194)

**Root Cause:** PR #194 changes how users are looked up (O(n) scan → HMAC indexed lookup). If existing user data doesn't have the HMAC index field, lookups fail.

**Immediate Fix:** Rollback Cloud Run revision.

**Proper Fix:** Run migration script BEFORE deploying:
```python
# migration_script.py
import hmac, hashlib, os
from db import volunteers_collection, learners_collection
from controllers.v1.encryption import decrypt_user_data

SECRET = os.environ["HMAC_LOOKUP_KEY"]

def migrate_collection(collection, id_field):
    users = collection.find({})
    for user in users:
        if "email_hash" not in user:
            encrypted_data = user.get("encrypted_data")
            decrypted = decrypt_user_data(encrypted_data)
            email = decrypted.get("email", "")
            email_hash = hmac.new(SECRET.encode(), email.lower().encode(), hashlib.sha256).hexdigest()
            collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"email_hash": email_hash}}
            )
    # Create index
    collection.create_index("email_hash")

migrate_collection(volunteers_collection, "volunteer_id")
migrate_collection(learners_collection, "learner_id")
```

### 6.5 — "CORS errors on frontend"

**Current allowed origins in main.py:**
```python
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://melody-wings-staging.vercel.app",
    "https://melody-wings-admin-frontend.vercel.app",
    "https://melody-wings-admin-prod.vercel.app",
    "https://www.melodywings.org",
    "https://melodywings.org",
    "https://admin.melodywings.org",
]
```

**If mobile app gets CORS errors:** Need to merge `feature/mobile-cors-support` which adds:
```python
"capacitor://localhost",
"http://localhost",
"https://localhost",
```

**Quick fix without redeploying:**
```bash
gcloud run services update melody-wings-backend ^
  --update-env-vars "EXTRA_CORS_ORIGINS=https://your-missing-domain.com" ^
  --region us-central1 ^
  --project client-projects-410916
```
(Only works if your code reads this env var — may need code change)

### 6.6 — "Dates showing wrong after moment→dayjs migration"

**Symptoms:** Timestamps wrong, calendar events on wrong days, timezone issues.

**Root Cause:** dayjs doesn't include timezone support by default (unlike moment). Need plugins.

**Verify these dayjs plugins are imported:**
```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
```

**Immediate Fix:** Rollback the Vercel deployment (promote previous).

### 6.7 — "Safety analysis stuck in PROCESSING"

**Root Cause:** Celery worker's MongoDB connection goes stale (known issue, fixed June 18).

**Fix:** Restart the Cloud Run service:
```bash
gcloud run services update audio-safety-backend ^
  --update-env-vars "RESTART_TRIGGER=%date%" ^
  --region us-central1
```

### 6.8 — "Admin frontend /safety page shows blank iframe"

**Root Cause:** Third-party cookie blocking prevents iframe auth.

**Fix:** Safety dashboard uses Bearer token auth (fixed June 18). Ensure the Vercel deployment of transcript-analysis has the latest code.

### 6.9 — "Docker build fails locally"

```bash
# Clear Docker build cache
docker builder prune -a

# Check if base image exists
docker pull python:3.9

# For safety backend (needs more disk — model downloads are ~2GB)
docker system prune -a  
# Then rebuild
```

---

## 7. Database Recovery

### Your Databases

| Database | Service | Host | Collections |
|----------|---------|------|-------------|
| melody_wings | MW Backend | MongoDB Atlas | 40+ (users, volunteers, learners, sessions, posts, donations, etc.) |
| audio_safety_db | Safety Backend | MongoDB Atlas | analysis_results, processing_status, meeting_metadata, etc. |

### MongoDB Atlas Backup Options

| Method | Recovery Time | Data Loss | Cost |
|--------|--------------|-----------|------|
| Point-in-Time Restore (M10+) | 5-30 min | None (to the second) | Included |
| Snapshot Restore | 5-15 min | Up to 6 hours | Included |
| mongodump/mongorestore | 10-60 min | From backup time | Free |

### Point-in-Time Restore (Recommended):

1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com)
2. Select your cluster → **Backup** tab
3. Click **"Restore"**
4. Choose **"Point in Time"**
5. Select timestamp BEFORE your broken deployment
6. **CRITICAL:** Restore to a NEW cluster first (not the production one!)
7. Verify data on new cluster
8. Update `MONGO_URI` env var to point to new cluster
9. Redeploy backend with new URI

### Manual Backup (Before risky deployments):

```bash
# Backup MW database
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/melody_wings" ^
  --out "./backups/melody_wings_%date:~-4%%date:~3,2%%date:~0,2%"

# Backup Safety database  
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/audio_safety_db" ^
  --out "./backups/audio_safety_%date:~-4%%date:~3,2%%date:~0,2%"

# Restore if needed
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/melody_wings" ^
  --drop ^
  "./backups/melody_wings_20260626/melody_wings"
```

### Critical Collections (DO NOT lose these):

| Collection | Contains | Impact if Lost |
|-----------|---------|---------------|
| user_details | All user accounts (encrypted) | ALL users lose access |
| volunteers | Volunteer profiles + encrypted PII | Platform unusable |
| learners | Learner profiles + encrypted PII | Platform unusable |
| sessions | All session bookings | Scheduling breaks |
| admin | Admin credentials | Admin panel inaccessible |
| donation_transactions | Payment records | Financial compliance issue |

---

## 8. Mobile App Recovery

### Android App (Capacitor) — Special Considerations

The mobile app is **independent** from the web deployment:
- It uses a static export (`/out` directory) bundled into the APK
- It hits `https://api.melodywings.org` directly
- Changes to the web frontend do NOT affect the mobile app
- Backend changes DO affect the mobile app

### If backend breaks and mobile app stops working:

1. **Rollback backend** (Cloud Run revision) — fixes both web AND mobile
2. Mobile app itself doesn't need updating (it just calls the API)

### If you pushed a broken mobile app to Play Store:

```
1. Play Console → Your App → Release Management → Releases
2. Click "Halt rollout" on the broken release
3. Create a new release with the fixed AAB
4. Submit for expedited review (mention "critical bug fix")
```

**Timeline for Play Store fixes:** 1-3 days for review (faster for fixes)

### If you lose the release keystore:

**THIS IS UNRECOVERABLE.** You cannot update the app. You'd need to publish as a new app.

**Prevention:**
- Store keystore in secure cloud storage (Google Drive, AWS S3)
- Store passwords in a password manager
- Give at least 2 team members access

### Mobile-specific rollback notes:

| Problem | Fix | Time |
|---------|-----|------|
| App crashes on launch | Fix code → new AAB → submit to Play Store | 1-3 days |
| API errors in app | Rollback backend (Cloud Run) | 10 seconds |
| Google Sign-In broken | Fix Firebase OAuth config (no app update needed if server-side) | 1 hour |
| Push notifications broken | Fix Firebase/backend (no app update needed) | 1 hour |
| App rejected by Play Store | Fix issues → resubmit | 3-7 days |

---

## 9. Monitoring & Verification

### Immediate Checks After Any Deploy (First 5 minutes):

```bash
# 1. Backend alive?
curl -s -o /dev/null -w "%%{http_code}" https://api.melodywings.org/
# Expected: 200 (returns {"message": "Hello World"})

# 2. Check Cloud Run logs for errors
gcloud logging read ^
  "resource.type=cloud_run_revision AND severity>=ERROR AND resource.labels.service_name=melody-wings-backend" ^
  --limit 20 ^
  --project client-projects-410916

# 3. Safety backend alive?
curl -s -o /dev/null -w "%%{http_code}" https://audio-safety-backend-781782361175.us-central1.run.app/health
# Expected: 200
```

### Check Sentry (within 10 minutes):

1. Go to your Sentry dashboard
2. Filter by last 10 minutes
3. Look for NEW issues (not pre-existing)
4. Critical things to watch:
   - 500 errors spike
   - `ImportError` or `ModuleNotFoundError`
   - `ConnectionRefused` (DB or Redis)
   - `TypeError` or `AttributeError` (code bugs)

### Smoke Test Checklist:

| Test | How | Expected | Verifies |
|------|-----|----------|----------|
| Landing page | Open melodywings.org | Page loads | Frontend OK |
| User login | Google OAuth flow | JWT issued, redirect to dashboard | Backend auth OK |
| Admin login | admin.melodywings.org → username/password | Dashboard loads | Admin auth OK |
| Community feed | Navigate to /learner/community | Posts load with correct dates | API + date logic OK |
| Schedule | Navigate to /learner/schedule | Calendar renders | Date library OK |
| Safety dashboard | admin.melodywings.org/safety | iframe loads | Safety integration OK |
| Mobile app | Open on phone | Login works, pages load | Backend CORS + API OK |
| Profile page | Navigate to /volunteer/profile | Data displays | Encryption/decryption OK |

### Vercel Build Status:

After merging to master, check Vercel:
```
Frontend:  https://vercel.com/greyfeathers/melody-wings-frontend/deployments
Admin:     https://vercel.com/greyfeathers/melody-wings-admin-frontend/deployments
Safety FE: https://vercel.com/greyfeathers/transcript-analysis/deployments
```

Look for: ✅ Ready (green) vs ❌ Error (red)

If Vercel build fails:
- Click the failed deployment
- Read the build logs
- Common issues: TypeScript errors, missing dependencies, env var not set

---

## 10. Emergency Runbook

### Decision Tree: "The site is down, what do I do?"

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: What's broken?                                     │
│                                                             │
│  melodywings.org blank?          → Frontend issue (Vercel)  │
│  admin.melodywings.org blank?    → Admin frontend (Vercel)  │
│  API returns 5xx?                → Backend issue (Cloud Run)│
│  Login doesn't work?             → Auth/DB issue            │
│  Everything slow?                → DB or Cold Start issue   │
│  Mobile app crashes?             → Backend or app code      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Rollback the affected service                      │
│                                                             │
│  Cloud Run: Route traffic to previous revision              │
│  Vercel: Promote previous deployment to production          │
│  Database: Atlas point-in-time restore                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Verify recovery                                    │
│                                                             │
│  curl api.melodywings.org → Should return 200               │
│  Open melodywings.org → Should load                         │
│  Try login → Should work                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Investigate root cause (with prod stable)          │
│                                                             │
│  Read logs, reproduce locally, fix on new branch            │
│  Do NOT try to fix on production directly                   │
└─────────────────────────────────────────────────────────────┘
```

### Critical Commands Cheat Sheet (Windows CMD):

```bash
# ═══════════════════════════════════════════════════════════════
# ROLLBACK MW BACKEND (instant)
# ═══════════════════════════════════════════════════════════════
gcloud run services update-traffic melody-wings-backend ^
  --to-revisions=REVISION_NAME=100 ^
  --region us-central1 ^
  --project client-projects-410916

# ═══════════════════════════════════════════════════════════════
# ROLLBACK SAFETY BACKEND (instant)
# ═══════════════════════════════════════════════════════════════
gcloud run services update-traffic audio-safety-backend ^
  --to-revisions=REVISION_NAME=100 ^
  --region us-central1

# ═══════════════════════════════════════════════════════════════
# VIEW BACKEND ERRORS
# ═══════════════════════════════════════════════════════════════
gcloud logging read ^
  "resource.type=cloud_run_revision AND severity>=ERROR AND resource.labels.service_name=melody-wings-backend" ^
  --limit 30 ^
  --project client-projects-410916

# ═══════════════════════════════════════════════════════════════
# VIEW SAFETY ERRORS
# ═══════════════════════════════════════════════════════════════
gcloud logging read ^
  "resource.type=cloud_run_revision AND severity>=ERROR AND resource.labels.service_name=audio-safety-backend" ^
  --limit 30

# ═══════════════════════════════════════════════════════════════
# FORCE RESTART (new container instances)
# ═══════════════════════════════════════════════════════════════
gcloud run services update melody-wings-backend ^
  --region us-central1 ^
  --project client-projects-410916 ^
  --update-env-vars "RESTART_TRIGGER=%date%_%time%"

# ═══════════════════════════════════════════════════════════════
# CHECK SERVICE STATUS
# ═══════════════════════════════════════════════════════════════
gcloud run services describe melody-wings-backend ^
  --region us-central1 ^
  --project client-projects-410916

# ═══════════════════════════════════════════════════════════════
# EMERGENCY: TAKE BACKEND OFFLINE
# ═══════════════════════════════════════════════════════════════
gcloud run services update melody-wings-backend ^
  --max-instances=0 ^
  --region us-central1 ^
  --project client-projects-410916

# ═══════════════════════════════════════════════════════════════
# BRING BACKEND BACK ONLINE
# ═══════════════════════════════════════════════════════════════
gcloud run services update melody-wings-backend ^
  --max-instances=10 ^
  --region us-central1 ^
  --project client-projects-410916

# ═══════════════════════════════════════════════════════════════
# GIT: REVERT A BAD MERGE
# ═══════════════════════════════════════════════════════════════
git log --oneline -5
git revert -m 1 MERGE_COMMIT_HASH
git push origin master
```

---

## Quick Reference Card

### Recovery Times

| Problem | Action | Time to Fix |
|---------|--------|-------------|
| Bad backend deploy | Rollback Cloud Run revision | **~10 seconds** |
| Bad frontend deploy | Rollback Vercel deployment | **~30 seconds** |
| Rate limiting too aggressive | Update env var | **~1 minute** |
| CORS blocking requests | Add origin + redeploy | **~3 minutes** |
| Database corrupted | Atlas point-in-time restore | **5-30 minutes** |
| Mobile app broken (API issue) | Rollback backend | **~10 seconds** |
| Mobile app broken (app code) | Fix + submit to Play Store | **1-7 days** |
| Lost keystore | UNRECOVERABLE (new app needed) | **Weeks** |

### Key Contacts & Links

| Resource | URL |
|----------|-----|
| GitHub Org | github.com/greyfeathers-dev |
| GCP Console | console.cloud.google.com (project: client-projects-410916) |
| MongoDB Atlas | cloud.mongodb.com |
| Vercel Dashboard | vercel.com |
| Sentry | sentry.io (your project) |
| Play Store Console | play.google.com/console |

### Environment Variable Quick Reference

| Env Var | Where | Purpose |
|---------|-------|---------|
| ENVIRONMENT | MW Backend | dev/staging/production (controls CORS strictness) |
| MONGO_URI | Both backends | MongoDB connection string |
| JWT_SECRET | Both backends | Token signing (DIFFERENT keys for each!) |
| SAFETY_API_KEY / API_KEY | Both backends | Inter-service auth (MUST MATCH) |
| SAFETY_SERVICE_URL | MW Backend | URL to Safety Backend |
| MW_BACKEND_URL | Safety Backend | URL to MW Backend (for callbacks) |
| ENCRYPTION_KEY | MW Backend | Fernet key for PII encryption |
| NEXT_PUBLIC_API_URL | Admin Frontend | Backend API URL (baked at build time) |
| NEXT_PUBLIC_SAFETY_DASHBOARD_URL | Admin Frontend | Safety iframe URL |
| REDIS_URL | Safety Backend | Celery broker (Upstash Redis) |

---

## Key Takeaways

1. **Cloud Run revision rollback is your #1 safety net** — Every deploy creates a revision you can instantly switch back to.

2. **Vercel rollback for frontends** — Just promote the previous deployment. Takes 30 seconds.

3. **Merge one PR at a time** across all repos. Low risk first, high risk last.

4. **Backend before frontend** — Frontends depend on the backend. If backend breaks, everything breaks.

5. **Tag before you deploy** — `git tag production-stable-YYYY-MM-DD` gives you a permanent "last known good" marker.

6. **Database backup before PRs #191 and #194** — These change auth and data access patterns.

7. **Mobile app is independent** — Web and mobile have separate deploy pipelines. Merging web PRs doesn't affect the app.

8. **The mobile keystore is irreplaceable** — Back it up immediately after generating. Multiple locations.

9. **Sentry is your early warning** — Check within 10 minutes of every deploy.

10. **Test login first** — If auth works, 90% of things work. If auth is broken, everything is broken.

---

*Last updated: June 26, 2026 — Based on actual codebase analysis of all 4 repos*
