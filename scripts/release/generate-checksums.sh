#!/usr/bin/env bash
set -euo pipefail
DIR="${1:-artifacts}"
OUT="${2:-$DIR/Checksums.txt}"
mkdir -p "$DIR"
find "$DIR" -type f ! -name "$(basename "$OUT")" -print0 | sort -z | xargs -0 shasum -a 256 > "$OUT"
