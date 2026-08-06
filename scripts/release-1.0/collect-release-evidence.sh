#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/1.0.0-rc.1/evidence"
mkdir -p "$OUT"
find "$ROOT" -maxdepth 1 -name 'VALIDATION-*.md' -exec cp {} "$OUT"/ \;
find "$ROOT/release/1.0.0-rc.1" -maxdepth 1 -type f -print0 | sort -z | xargs -0 shasum -a 256 > "$OUT/Checksums.txt"
echo "$OUT"
