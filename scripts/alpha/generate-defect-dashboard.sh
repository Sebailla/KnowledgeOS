#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKLOG="${1:-$ROOT/.alpha-field/defects/normalized-backlog.json}"
OUT="$ROOT/docs/alpha2/DefectDashboard.md"
python3 - "$BACKLOG" "$OUT" <<'PY'
import json,sys,collections
items=json.load(open(sys.argv[1])).get("defects",[])
sev=collections.Counter(x["severity"] for x in items); status=collections.Counter(x["status"] for x in items)
lines=["# Alpha 2 Defect Dashboard","",f"Total defects: **{len(items)}**","","## Severity"]
for k in ("P0","P1","P2","P3"): lines.append(f"- {k}: {sev[k]}")
lines += ["","## Status"]
for k in sorted(status): lines.append(f"- {k}: {status[k]}")
lines += ["","## Records","","| ID | Severity | Component | Status | Title |","|---|---|---|---|---|"]
for x in items: lines.append(f"| {x['id']} | {x['severity']} | {x['component']} | {x['status']} | {x['title']} |")
open(sys.argv[2],"w").write("\n".join(lines)+"\n")
print(sys.argv[2])
PY
