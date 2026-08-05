#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="${1:-$ROOT/alpha-artifacts/diagnostics}"
rm -rf "$OUT" && mkdir -p "$OUT"
cp "$ROOT/release/0.45.0-alpha.1/AlphaManifest.json" "$OUT/" 2>/dev/null || true
cp "$ROOT"/VALIDATION-*.md "$OUT/" 2>/dev/null || true
if [[ -d "$HOME/Library/Application Support/KnowledgeOS/Logs" ]]; then cp -R "$HOME/Library/Application Support/KnowledgeOS/Logs" "$OUT/macos-logs"; fi
cat > "$OUT/environment.json" <<JSON
{"platform":"$(uname -s)","architecture":"$(uname -m)","collectedAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","contentIncluded":false}
JSON
"$ROOT/scripts/alpha/sanitize-alpha-diagnostics.sh" "$OUT"
echo "$OUT"
