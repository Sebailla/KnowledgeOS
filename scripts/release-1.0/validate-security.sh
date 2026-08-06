#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/rc/scan-secrets.sh
bash scripts/public-beta/validate-public-beta-readiness.sh
