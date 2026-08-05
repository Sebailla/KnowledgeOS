#!/usr/bin/env bash
set -euo pipefail
APP="${1:?Usage: verify-macos-integrity.sh /path/to/KnowledgeOS.app}"
ROOT="$APP/Contents/Resources"
for relative in Runtime/node CoreHost/apps/macos-core-host/dist/main.js release.json; do
  [[ -e "$ROOT/$relative" ]] || { echo "Missing $relative" >&2; exit 1; }
done
find "$ROOT/CoreHost" -type f -print0 | sort -z | xargs -0 shasum -a 256 > "$ROOT/CoreHost.integrity.sha256"
shasum -a 256 -c "$ROOT/CoreHost.integrity.sha256" >/dev/null
echo "Integrity verification passed"
