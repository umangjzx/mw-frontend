#!/bin/bash
# ══════════════════════════════════════════════════════════════════════════════
# Deploy Safety Detection Service to Google Cloud Run
# 
# This deploys the detection pipeline as a new Cloud Run service alongside
# your existing MW backend.
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - Docker installed
#   - Fill in the variables below
#
# Usage:
#   chmod +x deploy-safety.sh
#   ./deploy-safety.sh
# ══════════════════════════════════════════════════════════════════════════════

set -e

# ── Configuration (EDIT THESE) ────────────────────────────────────────────────

PROJECT_ID="client-projects-410916"
REGION="us-central1"
SERVICE_NAME="melody-wings-safety"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Resource allocation for ML workload
MEMORY="4Gi"
CPU="2"
MIN_INSTANCES="0"
MAX_INSTANCES="3"
TIMEOUT="300"

# ── Step 1: Set project ───────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════════════════"
echo "  Deploying Safety Detection Service"
echo "  Project: $PROJECT_ID"
echo "  Region:  $REGION"
echo "  Service: $SERVICE_NAME"
echo "═══════════════════════════════════════════════════════════"
echo ""

gcloud config set project $PROJECT_ID

# ── Step 2: Build Docker image ────────────────────────────────────────────────

echo "📦 Building Docker image..."
cd "$(dirname "$0")/New-Rmsi-Latest/backend"

docker build -t $IMAGE_NAME:latest . --platform linux/amd64

echo "✅ Image built: $IMAGE_NAME:latest"

# ── Step 3: Push to Google Container Registry ─────────────────────────────────

echo "⬆️  Pushing to GCR..."
docker push $IMAGE_NAME:latest

echo "✅ Image pushed to GCR"

# ── Step 4: Deploy to Cloud Run ───────────────────────────────────────────────

echo "🚀 Deploying to Cloud Run..."

gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --platform managed \
    --region $REGION \
    --memory $MEMORY \
    --cpu $CPU \
    --min-instances $MIN_INSTANCES \
    --max-instances $MAX_INSTANCES \
    --timeout $TIMEOUT \
    --port 8000 \
    --allow-unauthenticated \
    --set-env-vars "ENV=production,USE_CELERY=false,ENABLE_VIRUS_SCAN=false"

echo ""
echo "✅ Deployment complete!"
echo ""

# ── Step 5: Get the URL ───────────────────────────────────────────────────────

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --format "value(status.url)")

echo "═══════════════════════════════════════════════════════════"
echo "  🎉 Safety service is live!"
echo ""
echo "  URL: $SERVICE_URL"
echo ""
echo "  Next steps:"
echo "  1. Set env vars on this service:"
echo "     gcloud run services update $SERVICE_NAME \\"
echo "       --region $REGION \\"
echo "       --update-env-vars 'MONGO_URI=...,JWT_SECRET=...,API_KEY=...'"
echo ""
echo "  2. Update MW backend with:"
echo "     SAFETY_SERVICE_URL=$SERVICE_URL"
echo "     SAFETY_API_KEY=<same key you set above>"
echo "═══════════════════════════════════════════════════════════"
