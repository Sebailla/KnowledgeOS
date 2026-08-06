#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/release-1.0/validate-feature-freeze.sh
bash scripts/release-1.0/validate-security.sh
bash scripts/release-1.0/validate-migrations.sh
bash scripts/release-1.0/run-final-regression.sh
bash scripts/release-1.0/validate-performance.sh
bash scripts/release-1.0/validate-distribution.sh
bash scripts/release/create-sbom.sh release/1.0.0-rc.1/SBOM.spdx.json
bash scripts/release-1.0/generate-release-manifest.sh
bash scripts/release-1.0/collect-release-evidence.sh
