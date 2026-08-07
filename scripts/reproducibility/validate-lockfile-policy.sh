#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
python3 - <<'PY'
import json
p=json.load(open('release/1.0.0-rc.1/LockfilePolicy.json'))
assert p['schemaVersion']==1
assert p['packageManager']=='pnpm@10.15.0'
assert p['lockfile']=='pnpm-lock.yaml'
assert p['attestation']=='release/1.0.0-rc.1/LockfileAttestation.json'
assert all(p['requirements'].values())
root=json.load(open('package.json'))
assert root['packageManager']==p['packageManager']
print('Lockfile policy validation passed.')
PY
