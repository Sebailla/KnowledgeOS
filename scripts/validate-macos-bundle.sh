#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP="${1:-${KNOWLEDGEOS_BUILD_DIR:-$ROOT/build/macos-release}/KnowledgeOS.app}"
FAIL=0
required=(
  "Contents/Info.plist"
  "Contents/MacOS/KnowledgeOS"
  "Contents/Resources/Runtime/node"
  "Contents/Resources/release.json"
  "Contents/Resources/CoreHost/apps/macos-core-host/dist/main.js"
)
for relative in "${required[@]}"; do
  if [[ ! -e "$APP/$relative" ]]; then
    echo "Missing: $relative" >&2
    FAIL=1
  fi
done
[[ -x "$APP/Contents/MacOS/KnowledgeOS" ]] || { echo "App executable is not executable" >&2; FAIL=1; }
[[ -x "$APP/Contents/Resources/Runtime/node" ]] || { echo "Embedded Node is not executable" >&2; FAIL=1; }
if command -v plutil >/dev/null; then plutil -lint "$APP/Contents/Info.plist" >/dev/null; fi
if command -v codesign >/dev/null; then codesign --verify --deep --strict "$APP" 2>/dev/null || echo "Bundle is unsigned or requires signing (expected before release signing)."; fi
[[ "$FAIL" -eq 0 ]] || exit 1
echo "Bundle validation passed: $APP"
