#!/usr/bin/env bash
set -euo pipefail
ROOT="${KNOWLEDGEOS_E2E_ROOT:-$(pwd)/.e2e-runtime}"
REPORT="$ROOT/reports/cross-platform-e2e.json"
node -e 'const r=require(process.argv[1]); const a=r.assertions; if(!a.converged||!a.noDuplicates||!a.anchorsPreserved) process.exit(1); console.log("Convergence validation passed")' "$REPORT"
