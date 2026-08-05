#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ "$(uname -s)" == Darwin ]] || { echo "macOS required" >&2; exit 2; }
"$ROOT/scripts/build-macos-release.sh"
"$ROOT/scripts/package-macos-app.sh"
"$ROOT/scripts/distribution/sign-macos.sh"
"$ROOT/scripts/distribution/notarize-macos.sh"
"$ROOT/scripts/release/create-dmg.sh"
