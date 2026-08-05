#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
rm -rf artifacts && mkdir -p artifacts
scripts/release/build-all.sh
scripts/release/run-all-tests.sh
scripts/release/create-sbom.sh
scripts/rc/build-release-candidate.sh
cp -R release/0.42.0-rc.1 artifacts/release-candidate
scripts/release/generate-checksums.sh
scripts/release/validate-release.sh
