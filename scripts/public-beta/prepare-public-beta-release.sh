#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
scripts/public-beta/validate-public-beta-readiness.sh
scripts/public-beta/generate-supported-platforms.sh >/dev/null
scripts/public-beta/generate-public-beta-dashboard.sh >/dev/null
scripts/public-beta/generate-public-beta-report.sh >/dev/null
scripts/public-beta/collect-public-beta-evidence.sh >/dev/null
