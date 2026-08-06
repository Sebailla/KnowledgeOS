#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/docs/beta/BetaDashboard.md"
ALPHA2="$ROOT/release/0.47.0-alpha.2/Alpha2ValidationReport.md"
cat > "$OUT" <<MD
# Beta Dashboard

- Version: 0.48.0-beta.1
- Protocol: USP 1.0
- Channel: beta
- Release blockers: validated by detect-release-blockers.sh
- Alpha 2 baseline evidence: $( [[ -f "$ALPHA2" ]] && echo available || echo unavailable )
- Live service and device metrics: pending real beta deployment
MD
echo "$OUT"
