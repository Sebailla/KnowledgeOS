#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, pathlib, subprocess, sys
root=pathlib.Path(__file__).resolve().parents[2]
release=root/'release/1.0.0-rc.1'
out=release/'attestations/ReleaseAttestation.json'
inputs=['ReleaseManifest.json','SBOM.spdx.json','SBOM.cyclonedx.json','SourceManifest.json','Checksums.txt','ValidationReport.md','SecurityReport.md','MigrationReport.md','DistributionReport.md']
subjects=[]
for rel in inputs:
 p=release/rel
 if not p.is_file(): raise SystemExit(f'Missing attestation subject: {p}')
 subjects.append({'name':f'release/1.0.0-rc.1/{rel}','size':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
try: commit=subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD'],text=True,stderr=subprocess.DEVNULL).strip()
except Exception: commit='unavailable'
data={'_type':'https://in-toto.io/Statement/v1','subject':subjects,'predicateType':'https://knowledgeos.dev/attestation/release/v1','predicate':{'release':'1.0.0-rc.1','build':50,'protocolVersion':'1.0','sourceCommit':commit,'featureFreeze':True,'generatedBy':'scripts/release-1.0/generate-release-attestation.py'}}
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(data,indent=2,sort_keys=True)+'\n')
print(out)
