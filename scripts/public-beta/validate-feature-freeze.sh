#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
[[ -f docs/public-beta/FeatureFreeze.md ]]
[[ -f .public-beta/governance.json ]]
grep -q '"featureFreeze": true' .public-beta/governance.json
for frozen in packages/{sync,search,knowledge-graph,import,export,storage,ocr,plugin}/*_FROZEN.md; do [[ -f "$frozen" ]]; done
scripts/rc/validate-protocol-compatibility.sh
echo 'Feature freeze and USP 1.0 validation passed.'
