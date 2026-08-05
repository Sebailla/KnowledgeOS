#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
swift test --package-path "$ROOT/apple/Packages/KnowledgeOSCoreBridge"
swift test --package-path "$ROOT/apple/Packages/KnowledgeOSMobile"
swift test --package-path "$ROOT/apple/Apps/iOS"
swift test --package-path "$ROOT/apple/Apps/iPadOS"
