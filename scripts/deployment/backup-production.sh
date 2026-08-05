#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT/deployment/production"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="${1:-$ROOT/artifacts/backups/$STAMP}"
mkdir -p "$OUT"
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-knowledgeos}" -d "${POSTGRES_DB:-knowledgeos}" -Fc > "$OUT/postgres.dump"
docker run --rm -v knowledgeos_knowledgeos_master_files:/source:ro -v "$OUT:/backup" alpine tar -czf /backup/master-library-files.tar.gz -C /source .
shasum -a 256 "$OUT"/* > "$OUT/Checksums.txt"
echo "$OUT"
