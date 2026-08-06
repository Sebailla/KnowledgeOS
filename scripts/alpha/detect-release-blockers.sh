#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKLOG="${1:-$ROOT/.alpha-field/defects/normalized-backlog.json}"
[[ -f "$BACKLOG" ]] || { echo "Normalized backlog missing. Run import-defect-backlog.sh." >&2; exit 2; }
python3 - "$BACKLOG" <<'PY'
import json,sys
items=json.load(open(sys.argv[1])).get("defects",[])
blockers=[x for x in items if x.get("severity") in {"P0","P1"} and x.get("status") not in {"fixed","verified","deferred"}]
for x in blockers: print(f"{x['severity']} {x['id']}: {x['title']}")
if blockers: raise SystemExit(1)
print("No open P0/P1 release blockers.")
PY
