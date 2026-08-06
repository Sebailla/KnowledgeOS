#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/rc/run-regression-suite.sh
bash scripts/public-beta/validate-feature-freeze.sh
bash scripts/alpha/detect-release-blockers.sh
