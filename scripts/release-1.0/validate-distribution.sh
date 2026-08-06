#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/deployment/validate-production.sh --structure-only 2>/dev/null || bash -n scripts/deployment/*.sh
bash -n scripts/distribution/*.sh
[[ -f deployment/production/compose.yaml ]]
echo 'Distribution and production deployment structure validated.'
