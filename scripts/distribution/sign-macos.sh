#!/usr/bin/env bash
set -euo pipefail
: "${KNOWLEDGEOS_SIGN_IDENTITY:?Set KNOWLEDGEOS_SIGN_IDENTITY}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP="${1:-$ROOT/build/macos-release/KnowledgeOS.app}"
codesign --force --deep --options runtime --timestamp --entitlements "$ROOT/apple/Apps/macOS/Resources/KnowledgeOS.entitlements" --sign "$KNOWLEDGEOS_SIGN_IDENTITY" "$APP"
codesign --verify --deep --strict --verbose=2 "$APP"
