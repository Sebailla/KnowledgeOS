#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPPORT="${KNOWLEDGEOS_SUPPORT_DIR:-$HOME/Library/Application Support/KnowledgeOS}"
OUTPUT="${1:-$SUPPORT/Diagnostics/KnowledgeOS-Diagnostics-$(date +%Y%m%d-%H%M%S).zip}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$(dirname "$OUTPUT")" "$TMP/KnowledgeOS-Diagnostics"

cp -R "$SUPPORT/Logs" "$TMP/KnowledgeOS-Diagnostics/" 2>/dev/null || true
cp "$ROOT/apple/Apps/macOS/Packaging/release.json" "$TMP/KnowledgeOS-Diagnostics/" 2>/dev/null || true
find "$TMP" -type f -exec sed -i '' -E 's/(token|secret|authorization)[^,\" ]*/\1=REDACTED/Ig' {} \; 2>/dev/null || true
(cd "$TMP" && ditto -c -k --keepParent KnowledgeOS-Diagnostics "$OUTPUT")
echo "$OUTPUT"
