#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
pnpm validate
pnpm --filter @knowledgeos/macos-core-host test
pnpm --filter @knowledgeos/sync-server test
swift test --package-path apple/Packages/KnowledgeOSCoreBridge
swift test --package-path apple/Packages/KnowledgeOSMobile
swift test --package-path apple/Apps/macOS
swift test --package-path apple/Apps/iOS
swift test --package-path apple/Apps/iPadOS
scripts/e2e/run-cross-platform-tests.sh
