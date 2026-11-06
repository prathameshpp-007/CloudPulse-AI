#!/bin/bash

set -e

IMAGE_TAG=$(git rev-parse HEAD)
IMAGE="ghcr.io/prathameshpp-007/cloudpulse-ai:${IMAGE_TAG}"

echo "🚀 Deploying CloudPulse AI..."
echo "📦 Image: ${IMAGE}"

echo "⏳ Updating Kubernetes deployment..."

kubectl set image deployment/cloudpulse-api \
cloudpulse-api=${IMAGE}

echo "⏳ Waiting for rollout..."

kubectl rollout status deployment/cloudpulse-api

echo "✅ Deployment completed successfully!"

kubectl get pods