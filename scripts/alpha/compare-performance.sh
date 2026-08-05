#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="${KNOWLEDGEOS_ALPHA_RUNTIME:-$ROOT/.alpha-runtime}"
METRICS="$RUNTIME/metrics"
OUT="$RUNTIME/reports/performance-comparison.md"
mkdir -p "$(dirname "$OUT")"
mapfile -t FILES < <(find "$METRICS" -type f -name 'metrics-*.json' 2>/dev/null | sort)
{
  echo '# Alpha Performance Comparison'
  echo
  echo '| Timestamp | Version | Platform | Collection ms | Repository files | Queues |'
  echo '|---|---|---|---:|---:|---:|'
  for file in "${FILES[@]}"; do
    python3 - "$file" <<'PY'
import json,sys
v=json.load(open(sys.argv[1]))
print(f"| {v['timestamp']} | {v['version']} | {v['platform']} | {v['collectionDurationMs']} | {v['repositoryFileCount']} | {v['pendingDiagnosticQueues']} |")
PY
  done
} > "$OUT"
printf '%s\n' "$OUT"
