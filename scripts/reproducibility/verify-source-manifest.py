#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, os, pathlib, sys, tempfile, zipfile

if len(sys.argv) != 2:
    raise SystemExit('usage: verify-source-manifest.py SOURCE_ARCHIVE.zip')
archive=pathlib.Path(sys.argv[1]).resolve()
if not archive.is_file(): raise SystemExit(f'archive not found: {archive}')
manifest_rel='KnowledgeOS/release/1.0.0-rc.1/SourceManifest.json'
with zipfile.ZipFile(archive) as z:
    names=[n for n in z.namelist() if not n.endswith('/')]
    if manifest_rel not in names: raise SystemExit('source manifest missing from archive')
    manifest=json.loads(z.read(manifest_rel))
    expected={f"KnowledgeOS/{e['path']}":e for e in manifest.get('entries',[])}
    actual=set(names)
    declared=set(expected)|{manifest_rel}
    missing=sorted(declared-actual)
    extra=sorted(actual-declared)
    errors=[]
    if missing: errors.append(f'missing entries: {missing[:10]}')
    if extra: errors.append(f'undeclared entries: {extra[:10]}')
    for name,e in expected.items():
        if name not in actual: continue
        data=z.read(name)
        digest=hashlib.sha256(data).hexdigest()
        if digest!=e['sha256']: errors.append(f'hash mismatch: {name}')
        if len(data)!=e['size']: errors.append(f'size mismatch: {name}')
    if manifest.get('entryCount')!=len(expected): errors.append('entryCount mismatch')
    if errors: raise SystemExit('\n'.join(errors))
print(f"Source manifest verification passed: {len(expected)} declared entries.")
