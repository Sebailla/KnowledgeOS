#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
scripts/alpha/validate-alpha-installation.sh
scripts/alpha/run-performance-baseline.sh
scripts/alpha/generate-alpha-report.sh
scripts/release/create-sbom.sh release/0.45.0-alpha.1/SBOM.spdx.json
find release/0.45.0-alpha.1 -type f ! -name Checksums.txt -print0 | sort -z | xargs -0 shasum -a 256 > release/0.45.0-alpha.1/Checksums.txt
echo 'KnowledgeOS 0.45.0-alpha.1 prepared.'
