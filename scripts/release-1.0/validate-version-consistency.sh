#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
python3 - <<'PY'
import json, pathlib, plistlib, sys
root=pathlib.Path('.')
errors=[]
root_pkg=json.load(open(root/'package.json'))
if root_pkg.get('version')!='1.0.0-rc.1': errors.append('package.json version must be 1.0.0-rc.1')
if root_pkg.get('packageManager')!='pnpm@10.15.0': errors.append('packageManager must be pnpm@10.15.0')
manifest=json.load(open(root/'release/1.0.0-rc.1/ReleaseManifest.json'))
expected={'version':'1.0.0-rc.1','build':50,'protocolVersion':'1.0','channel':'rc'}
for k,v in expected.items():
    if manifest.get(k)!=v: errors.append(f'ReleaseManifest {k}={manifest.get(k)!r}, expected {v!r}')
mac_release=json.load(open(root/'apple/Apps/macOS/Packaging/release.json'))
if mac_release.get('version')!='1.0.0-rc.1' or str(mac_release.get('build'))!='50': errors.append('macOS release.json mismatch')
for plist_path in ['apple/Apps/macOS/Resources/Info.plist','apple/Apps/iOS/Resources/Info.plist','apple/Apps/iPadOS/Resources/Info.plist']:
    with open(root/plist_path,'rb') as f: p=plistlib.load(f)
    if p.get('CFBundleShortVersionString')!='1.0.0': errors.append(f'{plist_path}: CFBundleShortVersionString mismatch')
    if str(p.get('CFBundleVersion'))!='50': errors.append(f'{plist_path}: CFBundleVersion mismatch')
if errors:
    print('\n'.join(f'- {x}' for x in errors),file=sys.stderr); raise SystemExit(1)
print('Release version consistency passed: 1.0.0-rc.1 / build 50 / USP 1.0.')
PY
