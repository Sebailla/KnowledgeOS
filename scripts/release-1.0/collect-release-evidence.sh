#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/1.0.0-rc.1/evidence"
mkdir -p "$OUT"
while IFS= read -r -d '' file; do
  cp "$file" "$OUT/"
done < <(find "$ROOT" -maxdepth 1 -name 'VALIDATION-*.md' -print0)
(
  cd "$ROOT"
  find release/1.0.0-rc.1 -maxdepth 1 -type f ! -name Checksums.txt -print0 \
    | sort -z \
    | xargs -0 shasum -a 256
) > "$OUT/Checksums.txt"
echo "$OUT"
