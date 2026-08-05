#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
grep -R -n 'schemaVersion\|mobile-state-v' apple/Packages/KnowledgeOSMobile/Sources >/dev/null
swift test --package-path apple/Packages/KnowledgeOSMobile
echo 'Mobile migrations and recovery tests passed.'
