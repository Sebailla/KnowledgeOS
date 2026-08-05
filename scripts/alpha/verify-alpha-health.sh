#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FAIL=0
required=(
  package.json
  release/0.45.0-alpha.1/AlphaManifest.json
  deployment/production/compose.yaml
  scripts/e2e/run-cross-platform-tests.sh
  scripts/alpha/sanitize-alpha-diagnostics.sh
)
for item in "${required[@]}"; do
  [[ -e "$ROOT/$item" ]] || { echo "Missing: $item" >&2; FAIL=1; }
done
for endpoint in "${KNOWLEDGEOS_SYNC_HEALTH_URL:-}" "${KNOWLEDGEOS_MASTER_HEALTH_URL:-}"; do
  [[ -z "$endpoint" ]] || curl --fail --silent --show-error --max-time 10 "$endpoint" >/dev/null || FAIL=1
done
[[ "$FAIL" -eq 0 ]] || exit 1
echo 'Alpha health verification passed.'
