#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
required=(package.json pnpm-workspace.yaml deployment/production/compose.yaml docs/beta/BetaReleaseChecklist.md release/0.48.0-beta.1/BetaManifest.json)
for path in "${required[@]}"; do [[ -e "$ROOT/$path" ]] || { echo "Missing $path" >&2; exit 1; }; done
scripts/beta/verify-beta-health.sh
echo "Beta installation validation passed."
