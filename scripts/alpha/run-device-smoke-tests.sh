#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
swift test --package-path apple/Packages/KnowledgeOSCoreBridge
swift test --package-path apple/Packages/KnowledgeOSMobile
swift test --package-path apple/Apps/macOS
swift test --package-path apple/Apps/iOS
swift test --package-path apple/Apps/iPadOS
scripts/e2e/run-cross-platform-tests.sh
echo 'Portable Alpha smoke suite passed. Physical-device checks remain required.'
