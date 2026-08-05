#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="${KNOWLEDGEOS_ALPHA_RUNTIME:-$ROOT/.alpha-runtime}"
RUN_ID="${KNOWLEDGEOS_ALPHA_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
RUN="$RUNTIME/runs/$RUN_ID"
mkdir -p "$RUN"
exec > >(tee "$RUN/cycle.log") 2>&1
status=0
step() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }
step 'Verify health'; "$ROOT/scripts/alpha/verify-alpha-health.sh" || status=1
step 'Run smoke tests'; "$ROOT/scripts/alpha/run-device-smoke-tests.sh" || status=1
step 'Collect metrics'; "$ROOT/scripts/alpha/collect-alpha-metrics.sh" > "$RUN/metrics-path.txt" || status=1
step 'Compare performance'; "$ROOT/scripts/alpha/compare-performance.sh" > "$RUN/comparison-path.txt" || status=1
step 'Generate dashboard'; "$ROOT/scripts/alpha/generate-alpha-dashboard.sh" > "$RUN/dashboard-path.txt" || status=1
cat > "$RUN/result.json" <<JSON
{
  "runId": "$RUN_ID",
  "completedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "$([[ "$status" -eq 0 ]] && echo passed || echo failed)",
  "channel": "${KNOWLEDGEOS_ALPHA_CHANNEL:-alpha}"
}
JSON
exit "$status"
