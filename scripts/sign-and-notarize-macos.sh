#!/usr/bin/env bash
set -euo pipefail
: "${KNOWLEDGEOS_SIGN_IDENTITY:?Set KNOWLEDGEOS_SIGN_IDENTITY}"
: "${KNOWLEDGEOS_NOTARY_PROFILE:?Set KNOWLEDGEOS_NOTARY_PROFILE}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${KNOWLEDGEOS_BUILD_DIR:-$ROOT/build/macos-release}"
APP="$BUILD_ROOT/KnowledgeOS.app"
ENTITLEMENTS="$ROOT/apple/Apps/macOS/Resources/KnowledgeOS.entitlements"

codesign --force --deep --options runtime --timestamp --entitlements "$ENTITLEMENTS" --sign "$KNOWLEDGEOS_SIGN_IDENTITY" "$APP"
"$ROOT/scripts/create-macos-archive.sh"
xcrun notarytool submit "$BUILD_ROOT/KnowledgeOS-0.32.0-macOS.zip" --keychain-profile "$KNOWLEDGEOS_NOTARY_PROFILE" --wait
xcrun stapler staple "$APP"
