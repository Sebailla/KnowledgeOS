#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/0.42.0-rc.1/ReleaseManifest.json"
COMMIT="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unavailable)"
cat > "$OUT" <<JSON
{
  "name": "KnowledgeOS",
  "version": "0.42.0-rc.1",
  "build": 42,
  "protocolVersion": "1.0",
  "sourceCommit": "$COMMIT",
  "status": "release-candidate"
}
JSON
echo "$OUT"
