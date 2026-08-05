#!/usr/bin/env bash
set -euo pipefail
ROOT="${KNOWLEDGEOS_E2E_ROOT:-$(pwd)/.e2e-runtime}"
if [[ "${KEEP_E2E_ARTIFACTS:-0}" != "1" ]]; then rm -rf "$ROOT"; fi
