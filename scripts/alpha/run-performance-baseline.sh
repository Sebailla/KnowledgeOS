#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="${1:-$ROOT/alpha-artifacts/performance-baseline.json}"
mkdir -p "$(dirname "$OUT")"
measure() { local label="$1"; shift; local start end status; start=$(date +%s%N); if "$@" >/dev/null 2>&1; then status=passed; else status=failed; fi; end=$(date +%s%N); printf '%s|%s|%s\n' "$label" "$status" "$(( (end-start)/1000000 ))"; }
RESULTS=$(mktemp)
measure protocol scripts/rc/validate-protocol-compatibility.sh >> "$RESULTS"
measure convergence scripts/e2e/run-cross-platform-tests.sh >> "$RESULTS"
python3 - "$RESULTS" "$OUT" <<'PY'
import json,sys,datetime
rows=[]
for line in open(sys.argv[1]):
 label,status,duration=line.strip().split('|'); rows.append({'name':label,'status':status,'durationMilliseconds':int(duration)})
json.dump({'version':'0.45.0-alpha.1','capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'measurements':rows},open(sys.argv[2],'w'),indent=2)
if any(x['status']!='passed' for x in rows): raise SystemExit(1)
PY
rm -f "$RESULTS"
echo "$OUT"
