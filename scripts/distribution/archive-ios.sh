#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ "$(uname -s)" == Darwin ]] || { echo "macOS/Xcode required" >&2; exit 2; }
: "${IOS_SCHEME:=KnowledgeOSiOS}"
: "${IOS_ARCHIVE:=$ROOT/artifacts/KnowledgeOS-iOS.xcarchive}"
xcodebuild archive -scheme "$IOS_SCHEME" -configuration Release -destination 'generic/platform=iOS' -archivePath "$IOS_ARCHIVE"
