#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[[ -f "$ROOT/deployment/production/compose.yaml" ]]
[[ -f "$ROOT/release/0.48.0-beta.1/BetaManifest.json" ]]
[[ -f "$ROOT/docs/beta/BetaMonitoringGuide.md" ]]
echo "Portable beta health checks passed."
