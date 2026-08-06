#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
python3 - "$ROOT" <<'PY'
import glob,json,os,sys
root=sys.argv[1]
files=[]
for f in glob.glob(os.path.join(root,'**','package.json'),recursive=True):
    parts=f.split(os.sep)
    if any(x in parts for x in ('node_modules','dist','dist-test','.build')): continue
    files.append(f)
packages={}
for f in files:
    data=json.load(open(f))
    if data.get('name'): packages[data['name']]=f
errors=[]
for f in files:
    data=json.load(open(f))
    for section in ('dependencies','devDependencies','peerDependencies','optionalDependencies'):
        for dep,version in data.get(section,{}).items():
            if version.startswith('workspace:') and dep not in packages:
                errors.append(f'{os.path.relpath(f,root)}: {section}.{dep}={version} has no matching workspace package')
            if dep.startswith('@knowledgeos/') and dep not in packages:
                errors.append(f'{os.path.relpath(f,root)}: missing internal package {dep}')
if errors:
    print('\n'.join(errors),file=sys.stderr);raise SystemExit(1)
print(f'Workspace manifest validation passed: {len(files)} manifests, {len(packages)} named packages.')
PY
