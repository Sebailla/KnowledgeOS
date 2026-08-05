#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${KNOWLEDGEOS_BUILD_DIR:-$ROOT/build/macos-release}"
SWIFT_BUILD_PATH="$BUILD_ROOT/swift"

command -v pnpm >/dev/null || { echo "pnpm is required" >&2; exit 1; }
command -v swift >/dev/null || { echo "Swift is required" >&2; exit 1; }

mkdir -p "$BUILD_ROOT"
cd "$ROOT"

pnpm --filter @knowledgeos/macos-core-host... build
swift build --package-path apple/Apps/macOS -c release --build-path "$SWIFT_BUILD_PATH"

printf '%s\n' "$SWIFT_BUILD_PATH/release/KnowledgeOSMac"
