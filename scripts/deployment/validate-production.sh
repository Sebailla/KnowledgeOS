#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT/deployment/production"
docker compose config >/dev/null
docker compose ps --format json >/dev/null
curl --fail --silent "http://127.0.0.1:${SYNC_PORT:-8080}/v1/sync/health" >/dev/null
curl --fail --silent "http://127.0.0.1:${MASTER_LIBRARY_PORT:-8081}/health/live" >/dev/null
echo "Production deployment validation passed"
