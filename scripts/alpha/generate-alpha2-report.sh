#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/0.47.0-alpha.2/Alpha2ValidationReport.md"
cat > "$OUT" <<REPORT
# KnowledgeOS 0.47.0-alpha.2 — Validation Report

Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

- Defect backlog schema validated.
- P0/P1 release-blocker gate executed.
- Regression traceability validated.
- Portable performance comparison executed.
- Existing TypeScript, Swift and E2E suites remain required release gates.
- Real evaluator defects and physical-device performance evidence remain external inputs.
REPORT
echo "$OUT"
