#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/alpha/run-performance-regression.sh
[[ -f .alpha-field/performance/current.json ]]
echo 'Portable performance baseline generated. Device certification remains external.'
