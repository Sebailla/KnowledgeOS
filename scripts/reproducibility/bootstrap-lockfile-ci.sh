#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
bash scripts/reproducibility/validate-lockfile-policy.sh
bash scripts/reproducibility/generate-lockfile.sh
python3 scripts/reproducibility/generate-lockfile-attestation.py
python3 scripts/reproducibility/verify-lockfile-attestation.py
bash scripts/reproducibility/verify-clean-install.sh
printf 'Lockfile bootstrap, attestation and clean-install verification passed.\n'
