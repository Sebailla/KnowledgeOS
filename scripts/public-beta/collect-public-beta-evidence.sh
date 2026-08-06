#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/0.49.0-beta.2/evidence"
mkdir -p "$OUT"
find "$ROOT" -maxdepth 1 -name 'VALIDATION-*.md' -exec cp {} "$OUT"/ \;
cp "$ROOT/docs/public-beta/PublicBetaDashboard.md" "$OUT"/ 2>/dev/null || true
cp "$ROOT/.public-beta/governance.json" "$OUT"/
find "$OUT" -type f -print0 | sort -z | xargs -0 shasum -a 256 > "$OUT/Checksums.txt"
echo "$OUT"
