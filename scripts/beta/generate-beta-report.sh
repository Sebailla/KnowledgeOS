#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REPORT="$ROOT/release/0.48.0-beta.1/BetaValidationReport.md"
scripts/beta/generate-beta-dashboard.sh >/dev/null
cat > "$REPORT" <<'MD'
# Beta Validation Report

KnowledgeOS 0.48.0-beta.1 preserves USP 1.0 and introduces operational beta gates without adding product functionality.

Portable validation covers builds, automated tests, E2E convergence, secret scanning, release blockers, documentation and artifact checksums. TestFlight, signing, physical-device endurance and real NAS restore require target infrastructure.
MD
scripts/beta/collect-beta-evidence.sh >/dev/null
echo "$REPORT"
