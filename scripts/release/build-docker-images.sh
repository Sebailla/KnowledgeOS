#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
: "${IMAGE_PREFIX:=knowledgeos}"
: "${IMAGE_TAG:=dev}"
docker build -f deployment/docker/sync-server/Dockerfile -t "$IMAGE_PREFIX/sync-server:$IMAGE_TAG" .
docker build -f deployment/docker/local-library/Dockerfile -t "$IMAGE_PREFIX/local-library:$IMAGE_TAG" .
docker build -f deployment/docker/master-library/Dockerfile -t "$IMAGE_PREFIX/master-library:$IMAGE_TAG" .
