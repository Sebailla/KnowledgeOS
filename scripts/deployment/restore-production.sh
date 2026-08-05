#!/usr/bin/env bash
set -euo pipefail
BACKUP="${1:?Usage: restore-production.sh backup-directory}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT/deployment/production"
(cd "$BACKUP" && shasum -a 256 -c Checksums.txt)
docker compose exec -T postgres pg_restore --clean --if-exists -U "${POSTGRES_USER:-knowledgeos}" -d "${POSTGRES_DB:-knowledgeos}" < "$BACKUP/postgres.dump"
docker run --rm -v knowledgeos_knowledgeos_master_files:/target -v "$BACKUP:/backup:ro" alpine sh -c 'rm -rf /target/* && tar -xzf /backup/master-library-files.tar.gz -C /target'
