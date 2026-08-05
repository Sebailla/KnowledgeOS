#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="${1:-$ROOT/artifacts/SBOM.json}"
mkdir -p "$(dirname "$OUT")"
python3 - "$ROOT" "$OUT" <<'PY'
import json, pathlib, sys
root=pathlib.Path(sys.argv[1]); out=pathlib.Path(sys.argv[2]); components=[]
for p in sorted(root.glob('packages/*/package.json'))+sorted(root.glob('apps/*/package.json')):
 d=json.loads(p.read_text()); components.append({'type':'library' if 'packages/' in str(p) else 'application','name':d.get('name',p.parent.name),'version':d.get('version','0.0.0'),'path':str(p.relative_to(root))})
out.write_text(json.dumps({'bomFormat':'CycloneDX','specVersion':'1.5','version':1,'components':components},indent=2)+'\n')
PY
