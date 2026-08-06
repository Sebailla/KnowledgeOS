#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
scripts/alpha/detect-release-blockers.sh
scripts/rc/scan-secrets.sh
scripts/rc/validate-protocol-compatibility.sh
scripts/beta/run-beta-regression.sh
scripts/beta/generate-beta-report.sh
