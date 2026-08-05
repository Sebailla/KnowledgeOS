#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${KNOWLEDGEOS_BUILD_DIR:-$ROOT/build/macos-release}"
APP="$BUILD_ROOT/KnowledgeOS.app"
ARCHIVE="$BUILD_ROOT/KnowledgeOS-0.32.0-macOS.zip"
MANIFEST="$BUILD_ROOT/KnowledgeOS-0.32.0-manifest.json"

"$ROOT/scripts/validate-macos-bundle.sh" "$APP"
rm -f "$ARCHIVE"
(cd "$BUILD_ROOT" && ditto -c -k --sequesterRsrc --keepParent KnowledgeOS.app "$(basename "$ARCHIVE")")
CHECKSUM="$(shasum -a 256 "$ARCHIVE" | awk '{print $1}')"
SIZE="$(stat -f%z "$ARCHIVE")"
cat > "$MANIFEST" <<JSON
{
  "name": "KnowledgeOS",
  "version": "0.32.0",
  "build": "32",
  "protocolVersion": "1.0",
  "archive": "$(basename "$ARCHIVE")",
  "sha256": "$CHECKSUM",
  "size": $SIZE
}
JSON
printf '%s\n' "$ARCHIVE"
