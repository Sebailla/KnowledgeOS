#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
pnpm build
if command -v swift >/dev/null 2>&1; then
  swift build --package-path apple/Packages/KnowledgeOSCoreBridge
  swift build --package-path apple/Packages/KnowledgeOSMobile
  swift build --package-path apple/Apps/macOS
  swift build --package-path apple/Apps/iOS
  swift build --package-path apple/Apps/iPadOS
fi
