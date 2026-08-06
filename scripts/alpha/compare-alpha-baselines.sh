#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CURRENT="${1:-$ROOT/.alpha-field/performance/current.json}"
REFERENCE="${2:-$ROOT/.alpha-field/performance/reference.json}"
[[ -f "$CURRENT" ]] || { echo "Current baseline missing" >&2; exit 2; }
if [[ ! -f "$REFERENCE" ]]; then cp "$CURRENT" "$REFERENCE"; echo "Reference baseline initialized."; exit 0; fi
python3 - "$CURRENT" "$REFERENCE" <<'PY'
import json,sys
cur=json.load(open(sys.argv[1])); ref=json.load(open(sys.argv[2]))
c=cur["portableBaselineDurationMs"]; r=ref["portableBaselineDurationMs"]
change=((c-r)/r*100) if r else 0
print(f"Reference: {r} ms\nCurrent: {c} ms\nChange: {change:.2f}%")
if change>25: raise SystemExit("Performance regression exceeds 25% portable threshold")
PY
