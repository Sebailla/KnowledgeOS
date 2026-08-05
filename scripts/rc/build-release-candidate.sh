#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
scripts/rc/scan-secrets.sh
scripts/rc/validate-protocol-compatibility.sh
scripts/rc/validate-migrations.sh
scripts/rc/run-regression-suite.sh
scripts/rc/generate-release-manifest.sh
scripts/rc/collect-release-evidence.sh
