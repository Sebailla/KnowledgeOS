#!/usr/bin/env bash
set -euo pipefail
: "${KNOWLEDGEOS_NOTARY_PROFILE:?Set KNOWLEDGEOS_NOTARY_PROFILE}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="${1:-$ROOT/build/macos-release/KnowledgeOS.app}"
ZIP="$ROOT/build/macos-release/KnowledgeOS-notarization.zip"
ditto -c -k --keepParent "$APP" "$ZIP"
xcrun notarytool submit "$ZIP" --keychain-profile "$KNOWLEDGEOS_NOTARY_PROFILE" --wait
xcrun stapler staple "$APP"
spctl --assess --type execute --verbose=2 "$APP"
