#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/docs/public-beta/PublicBetaDashboard.md"
BLOCKERS="unknown"
if "$ROOT/scripts/alpha/detect-release-blockers.sh" >/tmp/kos-public-beta-blockers.log 2>&1; then BLOCKERS="none"; else BLOCKERS="present or unavailable"; fi
cat > "$OUT" <<DOC
# Public Beta Dashboard

- Version: 0.49.0-beta.2
- Feature freeze: active
- Protocol: USP 1.0
- P0/P1 blockers: $BLOCKERS
- Release channels: beta, beta-hotfix, rc, stable
- Last generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

This dashboard is generated from repository evidence. It does not claim device-field results that were not supplied.
DOC
echo "$OUT"
