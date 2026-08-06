#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SOURCE="${1:-$ROOT/.alpha-field/defects/backlog.json}"
TARGET="$ROOT/.alpha-field/defects/normalized-backlog.json"
[[ -f "$SOURCE" ]] || { echo "Defect backlog not found: $SOURCE" >&2; exit 2; }
python3 - "$SOURCE" "$TARGET" <<'PY'
import json,sys
src,dst=sys.argv[1:]
data=json.load(open(src))
allowed_severity={"P0","P1","P2","P3"}
allowed_status={"reported","confirmed","in-progress","fixed","verified","deferred"}
seen=set(); normalized=[]
for item in data.get("defects",[]):
    required=("id","title","severity","component","status","affectedVersion")
    missing=[k for k in required if not item.get(k)]
    if missing: raise SystemExit(f"Missing {missing} in defect: {item}")
    if item["severity"] not in allowed_severity: raise SystemExit(f"Invalid severity: {item['severity']}")
    if item["status"] not in allowed_status: raise SystemExit(f"Invalid status: {item['status']}")
    if item["id"] in seen: raise SystemExit(f"Duplicate defect id: {item['id']}")
    seen.add(item["id"]); normalized.append(item)
normalized.sort(key=lambda x: ({"P0":0,"P1":1,"P2":2,"P3":3}[x["severity"]],x["id"]))
json.dump({"version":1,"defects":normalized},open(dst,"w"),indent=2,sort_keys=True)
print(dst)
PY
