#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, os, pathlib, sys

if len(sys.argv) != 3:
    raise SystemExit('usage: generate-source-manifest.py STAGE_ROOT OUTPUT_JSON')
root = pathlib.Path(sys.argv[1]).resolve()
out = pathlib.Path(sys.argv[2]).resolve()
entries=[]
for path in sorted(root.rglob('*'), key=lambda p: p.as_posix()):
    if path == out or path.is_dir():
        continue
    rel = path.relative_to(root).as_posix()
    if path.is_symlink():
        target=os.readlink(path)
        digest=hashlib.sha256(target.encode()).hexdigest()
        entries.append({'path':rel,'type':'symlink','target':target,'size':len(target.encode()),'sha256':digest})
    elif path.is_file():
        h=hashlib.sha256()
        with path.open('rb') as f:
            for chunk in iter(lambda:f.read(1024*1024),b''):
                h.update(chunk)
        entries.append({'path':rel,'type':'file','size':path.stat().st_size,'sha256':h.hexdigest()})
payload={
  'schemaVersion':1,
  'name':'KnowledgeOS source manifest',
  'release':'1.0.0-rc.1',
  'hashAlgorithm':'SHA-256',
  'rootDirectory':'KnowledgeOS',
  'entryCount':len(entries),
  'entries':entries,
}
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(payload,indent=2,sort_keys=True)+'\n',encoding='utf-8')
print(out)
