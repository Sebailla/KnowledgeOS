#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME="${KNOWLEDGEOS_ALPHA_RUNTIME:-$ROOT/.alpha-runtime}"
OUT_DIR="$ROOT/release/0.46.0-alpha.1/evidence"
mkdir -p "$OUT_DIR"
cp "$ROOT/docs/alpha/AlphaDashboard.md" "$OUT_DIR/" 2>/dev/null || true
cp "$ROOT/docs/alpha/BenchmarkHistory.md" "$OUT_DIR/" 2>/dev/null || true
cp "$ROOT/docs/alpha/DefectBacklog.md" "$OUT_DIR/" 2>/dev/null || true
cp -R "$RUNTIME/reports" "$OUT_DIR/runtime-reports" 2>/dev/null || true
find "$OUT_DIR" -type f -print0 | sort -z | xargs -0 shasum -a 256 > "$OUT_DIR/Checksums.txt"
echo "$OUT_DIR"
