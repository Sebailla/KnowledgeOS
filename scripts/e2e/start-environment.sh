#!/usr/bin/env bash
set -euo pipefail
ROOT="${KNOWLEDGEOS_E2E_ROOT:-$(pwd)/.e2e-runtime}"
rm -rf "$ROOT"
mkdir -p "$ROOT"/{data,logs,reports,tmp}
printf '%s\n' '{"status":"ready","protocolVersion":"1.0"}' > "$ROOT/environment.json"
echo "$ROOT"
