#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="${KNOWLEDGEOS_ALPHA_RUNTIME:-$ROOT/.alpha-runtime}"
OUT="$RUNTIME/metrics"
mkdir -p "$OUT"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$OUT/metrics-$STAMP.json"
START_NS="$(date +%s%N 2>/dev/null || python3 - <<'PY'
import time
print(time.time_ns())
PY
)"
# Deterministic, content-free repository/runtime indicators.
FILE_COUNT="$(find "$ROOT/packages" "$ROOT/apps" "$ROOT/apple" -type f 2>/dev/null | wc -l | tr -d ' ')"
QUEUE_COUNT="$(find "$RUNTIME" -type f -name '*.queue.json' 2>/dev/null | wc -l | tr -d ' ')"
END_NS="$(date +%s%N 2>/dev/null || python3 - <<'PY'
import time
print(time.time_ns())
PY
)"
DURATION_MS="$(( (END_NS - START_NS) / 1000000 ))"
cat > "$FILE" <<JSON
{
  "schemaVersion": 1,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "0.46.0-alpha.1",
  "channel": "${KNOWLEDGEOS_ALPHA_CHANNEL:-alpha}",
  "platform": "$(uname -s)",
  "architecture": "$(uname -m)",
  "repositoryFileCount": $FILE_COUNT,
  "pendingDiagnosticQueues": $QUEUE_COUNT,
  "collectionDurationMs": $DURATION_MS,
  "privacy": {
    "documentContentIncluded": false,
    "annotationsIncluded": false,
    "promptsIncluded": false,
    "tokensIncluded": false
  }
}
JSON
printf '%s\n' "$FILE"
