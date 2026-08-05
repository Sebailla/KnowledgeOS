#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT/deployment/production"
mkdir -p secrets
[[ -s secrets/postgres_password.txt && -s secrets/sync_token.txt ]] || { echo "Create production secrets first" >&2; exit 1; }
docker compose config >/dev/null
docker compose up -d --build --wait
