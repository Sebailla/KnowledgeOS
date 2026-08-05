#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ "$(uname -s)" == Darwin ]] || { echo "macOS/Xcode required" >&2; exit 2; }
: "${IPADOS_SCHEME:=KnowledgeOSiPadOS}"
: "${IPADOS_ARCHIVE:=$ROOT/artifacts/KnowledgeOS-iPadOS.xcarchive}"
xcodebuild archive -scheme "$IPADOS_SCHEME" -configuration Release -destination 'generic/platform=iOS' -archivePath "$IPADOS_ARCHIVE"
