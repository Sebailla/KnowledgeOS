#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ -f "$ROOT/docs/public-beta/FeatureFreeze.md" ]]
[[ -f "$ROOT/release/0.42.0-rc.1/USP-1.0-FROZEN.md" ]]
[[ -f "$ROOT/docs/release/ReleaseChecklist.md" ]]
echo 'Feature and USP 1.0 freeze evidence validated.'
