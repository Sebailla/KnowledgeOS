#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${KNOWLEDGEOS_BUILD_DIR:-$ROOT/build/macos-release}"
APP="$BUILD_ROOT/KnowledgeOS.app"
HOST_ROOT="$APP/Contents/Resources/CoreHost"
NODE="$APP/Contents/Resources/Runtime/node"
HOST="$HOST_ROOT/apps/macos-core-host/dist/main.js"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

"$ROOT/scripts/build-macos-release.sh" >/dev/null
"$ROOT/scripts/package-macos-app.sh" >/dev/null
"$ROOT/scripts/validate-macos-bundle.sh" "$APP"

run_rpc() {
  local method="$1"
  local params="${2:-{}}"
  printf '%s\n' "{\"version\":\"1.0\",\"id\":\"smoke\",\"method\":\"$method\",\"params\":$params}" \
    | env KNOWLEDGEOS_DATA_DIR="$TMP/Data" KNOWLEDGEOS_HOST_ROOT="$HOST_ROOT" NODE_ENV=production \
      "$NODE" "$HOST" \
    | head -n 1
}

run_rpc core.health | grep '"status":"ok"'
run_rpc application.status | grep '"phase":"ready"'
run_rpc import.preview '{"name":"smoke.md","content":"# Smoke Test"}' | grep '"format":"markdown"'
run_rpc search.query '{"query":"KnowledgeOS"}' | grep '"items"'
run_rpc export.start '{"format":"markdown","sources":[{"id":"smoke","title":"Smoke","body":"Test"}]}' | grep '"state":"completed"'

if pgrep -f "$HOST" >/dev/null 2>&1; then
  echo "Core Host process remained alive after smoke RPC" >&2
  exit 1
fi

"$ROOT/scripts/create-macos-archive.sh" >/dev/null
echo "macOS release smoke test passed"
