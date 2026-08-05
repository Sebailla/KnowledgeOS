#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="${KNOWLEDGEOS_ALPHA_RUNTIME:-$ROOT/.alpha-runtime}"
OUT="$ROOT/docs/alpha/AlphaDashboard.md"
mkdir -p "$RUNTIME/metrics" "$RUNTIME/runs"
LAST_METRIC="$(find "$RUNTIME/metrics" -type f -name 'metrics-*.json' 2>/dev/null | sort | tail -1 || true)"
RUNS="$(find "$RUNTIME/runs" -type f -name result.json 2>/dev/null | wc -l | tr -d ' ')"
PASSED="$( (grep -Rsl '"status": "passed"' "$RUNTIME/runs" 2>/dev/null || true) | wc -l | tr -d ' ' )"
FAILED="$((RUNS-PASSED))"
{
  echo '# KnowledgeOS Alpha Dashboard'
  echo
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo '## Cycle status'
  echo
  echo "- Total cycles: $RUNS"
  echo "- Passed: $PASSED"
  echo "- Failed: $FAILED"
  echo '- Active channel: `alpha`'
  echo
  echo '## Latest sanitized metrics'
  echo
  if [[ -n "$LAST_METRIC" ]]; then
    python3 - "$LAST_METRIC" <<'PY'
import json,sys
v=json.load(open(sys.argv[1]))
print(f"- Version: `{v['version']}`")
print(f"- Platform: `{v['platform']} / {v['architecture']}`")
print(f"- Collection duration: {v['collectionDurationMs']} ms")
print(f"- Repository file count: {v['repositoryFileCount']}")
print(f"- Pending diagnostic queues: {v['pendingDiagnosticQueues']}")
print('- Private content collected: no')
PY
  else
    echo '- No field metrics collected yet.'
  fi
  echo
  echo '## Release gate'
  echo
  echo '- P0 open defects: must be 0.'
  echo '- P1 open defects: must be 0 before promotion.'
  echo '- Physical-device evidence: required before channel promotion.'
  echo '- NAS recovery evidence: required before channel promotion.'
} > "$OUT"
printf '%s\n' "$OUT"
