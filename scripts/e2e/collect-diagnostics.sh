#!/usr/bin/env bash
set -euo pipefail
ROOT="${KNOWLEDGEOS_E2E_ROOT:-$(pwd)/.e2e-runtime}"
OUT="${1:-$ROOT/reports/diagnostics.json}"
mkdir -p "$(dirname "$OUT")"
node - "$ROOT" "$OUT" <<'JS'
const fs=require('fs'); const [root,out]=process.argv.slice(2); const redact=(v)=>JSON.parse(JSON.stringify(v).replace(/(token|secret|authorization)"\s*:\s*"[^"]*"/gi,'$1":"[REDACTED]"')); const report={createdAt:new Date().toISOString(),root,files:fs.existsSync(root)?fs.readdirSync(root):[]}; fs.writeFileSync(out,JSON.stringify(redact(report),null,2));
JS
