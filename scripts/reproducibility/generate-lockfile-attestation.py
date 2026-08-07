#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
LOCK = ROOT / "pnpm-lock.yaml"
OUT = ROOT / "release/1.0.0-rc.1/LockfileAttestation.json"
EXCLUDED = {"node_modules", "dist", "dist-test", ".build", ".git"}

def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()

def manifests() -> list[pathlib.Path]:
    result=[]
    for path in ROOT.rglob("package.json"):
        if any(part in EXCLUDED for part in path.relative_to(ROOT).parts):
            continue
        result.append(path)
    return sorted(result, key=lambda p: p.relative_to(ROOT).as_posix())

if not LOCK.is_file():
    print("BLOCKED: pnpm-lock.yaml is missing.", file=sys.stderr)
    raise SystemExit(2)
items=[{
    "path": p.relative_to(ROOT).as_posix(),
    "sha256": sha256(p),
    "size": p.stat().st_size,
} for p in manifests()]
payload={
    "schemaVersion": 1,
    "packageManager": "pnpm@10.15.0",
    "lockfile": {"path": "pnpm-lock.yaml", "sha256": sha256(LOCK), "size": LOCK.stat().st_size},
    "workspaceManifests": items,
    "workspaceManifestCount": len(items),
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
print(OUT.relative_to(ROOT))
