#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/0.42.0-rc.1/evidence"
mkdir -p "$OUT"
cp "$ROOT"/VALIDATION-041-cross-platform-e2e.md "$OUT"/ 2>/dev/null || true
find "$ROOT" -maxdepth 1 -name 'VALIDATION-*.md' -exec cp {} "$OUT"/ \;
find "$ROOT/release/0.42.0-rc.1" -maxdepth 1 -type f -print0 | sort -z | xargs -0 shasum -a 256 > "$OUT/Checksums.txt"
echo "$OUT"
