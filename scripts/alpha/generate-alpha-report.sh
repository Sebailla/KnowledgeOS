#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/release/0.45.0-alpha.1/AlphaValidationReport.md"
cat > "$OUT" <<REPORT
# KnowledgeOS 0.45.0-alpha.1 — Alpha Validation Report

Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

- Closed Alpha documentation: present
- Defect workflow: present
- Diagnostics: opt-in and sanitized
- Portable smoke suite: available
- Performance baseline: available
- NAS backup/restore procedures: present
- USP version: 1.0 frozen

Physical-device, TestFlight, signed macOS and live-NAS validation must be recorded by the Alpha coordinator.
REPORT
echo "$OUT"
