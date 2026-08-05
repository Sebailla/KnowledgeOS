#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${KNOWLEDGEOS_MOBILE_ARCHIVE_DIR:-$ROOT/build/mobile}"
mkdir -p "$OUT"
"$ROOT/scripts/test-mobile.sh"
zip -qr "$OUT/KnowledgeOS-Mobile-0.40.0-source.zip" "$ROOT/apple/Apps/iOS" "$ROOT/apple/Apps/iPadOS" "$ROOT/apple/Packages/KnowledgeOSMobile" -x '*/.build/*'
shasum -a 256 "$OUT/KnowledgeOS-Mobile-0.40.0-source.zip" > "$OUT/KnowledgeOS-Mobile-0.40.0-source.zip.sha256"
