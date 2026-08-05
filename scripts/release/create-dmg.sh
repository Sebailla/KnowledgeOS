#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ "$(uname -s)" == "Darwin" ]] || { echo "DMG creation requires macOS" >&2; exit 2; }
APP="${1:-$ROOT/build/macos-release/KnowledgeOS.app}"
OUT="${2:-$ROOT/artifacts/KnowledgeOS.dmg}"
mkdir -p "$(dirname "$OUT")"
hdiutil create -volname KnowledgeOS -srcfolder "$APP" -ov -format UDZO "$OUT"
