#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
python3 - "$ROOT" <<'PY'
import json,pathlib,sys
root=pathlib.Path(sys.argv[1])
allowed={'MIT','Apache-2.0','BSD-2-Clause','BSD-3-Clause','ISC','UNLICENSED','UNDECLARED'}
errors=[]; checked=0
for pattern in ('package.json','packages/*/package.json','apps/*/package.json','services/*/package.json','tools/*/package.json'):
  for p in root.glob(pattern):
    d=json.loads(p.read_text()); checked+=1
    license_value=d.get('license','UNDECLARED')
    if license_value not in allowed:
      errors.append(f'{p.relative_to(root)}: unsupported declared license {license_value!r}')
if errors:
  print('\n'.join(errors),file=sys.stderr); raise SystemExit(1)
print(f'License declaration validation passed for {checked} manifests.')
PY
