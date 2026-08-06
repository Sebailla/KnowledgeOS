#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/.alpha-field/performance/current.json"
mkdir -p "$(dirname "$OUT")"
START=$(python3 - <<'PY'
import time; print(time.time_ns())
PY
)
bash "$ROOT/scripts/alpha/run-performance-baseline.sh" >/dev/null
END=$(python3 - <<'PY'
import time; print(time.time_ns())
PY
)
python3 - "$OUT" "$START" "$END" <<'PY'
import json,sys,datetime
out,start,end=sys.argv[1],int(sys.argv[2]),int(sys.argv[3])
json.dump({"version":1,"capturedAt":datetime.datetime.now(datetime.timezone.utc).isoformat(),"portableBaselineDurationMs":round((end-start)/1_000_000,3),"environment":"portable-ci"},open(out,"w"),indent=2,sort_keys=True)
print(out)
PY
