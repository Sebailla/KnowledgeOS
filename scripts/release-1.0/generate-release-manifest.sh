#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/1.0.0-rc.1/ReleaseManifest.json"
COMMIT="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unavailable)"
cat > "$OUT" <<JSON
{"name":"KnowledgeOS","version":"1.0.0-rc.1","build":50,"protocolVersion":"1.0","channel":"rc","sourceCommit":"$COMMIT","featureFreeze":true}
JSON
echo "$OUT"
