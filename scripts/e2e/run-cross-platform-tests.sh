#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"
"$ROOT_DIR/scripts/e2e/start-environment.sh" >/dev/null
"$ROOT_DIR/scripts/e2e/seed-environment.sh"
node "$ROOT_DIR/scripts/e2e/e2e-runner.mjs"
"$ROOT_DIR/scripts/e2e/validate-convergence.sh"
