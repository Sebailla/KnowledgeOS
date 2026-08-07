#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/reproducibility/validate-lockfile-policy.sh
bash scripts/reproducibility/verify-lockfile-integrity.sh
python3 scripts/reproducibility/verify-lockfile-attestation.py
bash scripts/reproducibility/verify-source-archive-reproducibility.sh
bash scripts/release-1.0/verify-release-provenance.sh
python3 scripts/release-1.0/generate-release-attestation.py
bash scripts/release-1.0/validate-promotion-policy.sh
bash scripts/release-1.0/validate-version-consistency.sh
bash scripts/release-1.0/validate-feature-freeze.sh
bash scripts/release-1.0/validate-licenses.sh
bash scripts/release-1.0/validate-security.sh
bash scripts/release-1.0/validate-migrations.sh
bash scripts/release-1.0/run-final-regression.sh
bash scripts/release-1.0/validate-performance.sh
bash scripts/release-1.0/validate-distribution.sh
bash scripts/release-1.0/generate-sbom.sh
bash scripts/release-1.0/generate-release-manifest.sh
bash scripts/release-1.0/collect-release-evidence.sh
bash scripts/release-1.0/generate-artifact-checksums.sh
bash scripts/release-1.0/validate-release-artifacts.sh
