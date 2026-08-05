#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
pnpm test
if command -v swift >/dev/null 2>&1; then
  swift test --package-path apple/Packages/KnowledgeOSCoreBridge
  swift test --package-path apple/Packages/KnowledgeOSMobile
  swift test --package-path apple/Apps/macOS
  swift test --package-path apple/Apps/iOS
  swift test --package-path apple/Apps/iPadOS
fi
scripts/e2e/run-cross-platform-tests.sh
