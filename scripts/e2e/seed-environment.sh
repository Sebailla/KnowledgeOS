#!/usr/bin/env bash
set -euo pipefail
ROOT="${KNOWLEDGEOS_E2E_ROOT:-$(pwd)/.e2e-runtime}"
mkdir -p "$ROOT/data"
cat > "$ROOT/data/seed.json" <<'JSON'
{"userId":"user:e2e","devices":["mac","iphone","ipad"],"document":{"id":"document:e2e","title":"KnowledgeOS E2E"}}
JSON
