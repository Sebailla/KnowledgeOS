#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ -f "$ROOT/docs/public-beta/SupportedPlatforms.md" ]]
echo "$ROOT/docs/public-beta/SupportedPlatforms.md"
