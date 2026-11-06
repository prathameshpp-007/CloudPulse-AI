#!/bin/bash

set -e

IMAGE_TAG=$(git rev-parse HEAD)
IMAGE="ghcr.io/prathameshpp-007/cloudpulse-ai:${IMAGE_TAG}"

echo "Deploying CloudPulse AI..."
echo "Image: $IMAGE"

kubectl set image deployment/cloudpulse-api \
cloudpulse-api="$IMAGE"

kubectl rollout status deployment/cloudpulse-api

echo ""
echo "Deployment successful!"
kubectl get pods