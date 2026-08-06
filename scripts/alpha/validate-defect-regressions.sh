#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKLOG="${1:-$ROOT/.alpha-field/defects/normalized-backlog.json}"
python3 - "$BACKLOG" <<'PY'
import json,sys
items=json.load(open(sys.argv[1])).get("defects",[])
invalid=[]
for x in items:
    if x.get("status") in {"fixed","verified"} and not x.get("regressionTest"):
        invalid.append(x["id"])
if invalid:
    print("Fixed defects without regression tests:",", ".join(invalid))
    raise SystemExit(1)
print("Defect regression traceability passed.")
PY
