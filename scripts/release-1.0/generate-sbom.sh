#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT_DIR="${1:-$ROOT/release/1.0.0-rc.1}"
mkdir -p "$OUT_DIR"
python3 - "$ROOT" "$OUT_DIR" <<'PY'
import json,pathlib,sys,hashlib,datetime
root=pathlib.Path(sys.argv[1]); out=pathlib.Path(sys.argv[2])
manifest_files=[]
for pattern in ('package.json','packages/*/package.json','apps/*/package.json','services/*/package.json','tools/*/package.json'):
    manifest_files.extend(root.glob(pattern))
seen=set(); components=[]
for p in sorted(manifest_files):
    if p in seen: continue
    seen.add(p)
    d=json.loads(p.read_text())
    name=d.get('name',p.parent.name); version=d.get('version','0.0.0')
    deps=[]
    for section in ('dependencies','devDependencies','peerDependencies','optionalDependencies'):
        for dep,v in sorted(d.get(section,{}).items()): deps.append({'name':dep,'version':v,'scope':section})
    components.append({'name':name,'version':version,'path':str(p.relative_to(root)),'license':d.get('license','UNDECLARED'),'dependencies':deps})
created=datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
spdx={'spdxVersion':'SPDX-2.3','dataLicense':'CC0-1.0','SPDXID':'SPDXRef-DOCUMENT','name':'KnowledgeOS-1.0.0-rc.1','documentNamespace':'https://knowledgeos.local/spdx/1.0.0-rc.1','creationInfo':{'created':created,'creators':['Tool: KnowledgeOS generate-sbom.sh']},'packages':[]}
for i,c in enumerate(components,1):
    spdx['packages'].append({'name':c['name'],'SPDXID':f'SPDXRef-Package-{i}','versionInfo':c['version'],'downloadLocation':'NOASSERTION','filesAnalyzed':False,'licenseConcluded':c['license'],'licenseDeclared':c['license'],'copyrightText':'NOASSERTION','externalRefs':[{'referenceCategory':'OTHER','referenceType':'knowledgeos:manifest-path','referenceLocator':c['path']}]})
cyclone={'bomFormat':'CycloneDX','specVersion':'1.5','serialNumber':'urn:uuid:'+hashlib.sha256('|'.join(c['name'] for c in components).encode()).hexdigest()[:32],'version':1,'metadata':{'timestamp':created,'component':{'type':'application','name':'KnowledgeOS','version':'1.0.0-rc.1'}},'components':[]}
for c in components:
    cyclone['components'].append({'type':'application' if c['path'].startswith(('apps/','services/')) else 'library','name':c['name'],'version':c['version'],'properties':[{'name':'knowledgeos:manifestPath','value':c['path']},{'name':'knowledgeos:declaredLicense','value':c['license']}]})
(out/'SBOM.spdx.json').write_text(json.dumps(spdx,indent=2,sort_keys=True)+'\n')
(out/'SBOM.cyclonedx.json').write_text(json.dumps(cyclone,indent=2,sort_keys=True)+'\n')
print(f'Generated {len(components)} components.')
PY
