#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[2]
ATTEST=ROOT/'release/1.0.0-rc.1/LockfileAttestation.json'

def digest(path:pathlib.Path)->str:
 h=hashlib.sha256()
 with path.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
 return h.hexdigest()
if not ATTEST.is_file():
 print('BLOCKED: LockfileAttestation.json is missing.',file=sys.stderr);raise SystemExit(2)
data=json.loads(ATTEST.read_text())
errors=[]
if data.get('packageManager')!='pnpm@10.15.0': errors.append('packageManager mismatch')
lock=data.get('lockfile',{}); lock_path=ROOT/str(lock.get('path',''))
if not lock_path.is_file(): errors.append('pnpm-lock.yaml missing')
elif digest(lock_path)!=lock.get('sha256'): errors.append('pnpm-lock.yaml digest mismatch')
elif lock_path.stat().st_size!=lock.get('size'): errors.append('pnpm-lock.yaml size mismatch')
items=data.get('workspaceManifests',[])
if data.get('workspaceManifestCount')!=len(items): errors.append('manifest count mismatch')
for item in items:
 p=ROOT/item['path']
 if not p.is_file(): errors.append(f"missing manifest: {item['path']}"); continue
 if digest(p)!=item.get('sha256'): errors.append(f"manifest digest mismatch: {item['path']}")
 if p.stat().st_size!=item.get('size'): errors.append(f"manifest size mismatch: {item['path']}")
if errors:
 print('\n'.join(errors),file=sys.stderr);raise SystemExit(1)
print(f"Lockfile attestation verified: {len(items)} workspace manifests.")
