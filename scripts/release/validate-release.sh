#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
scripts/rc/validate-protocol-compatibility.sh
scripts/rc/validate-migrations.sh
scripts/rc/scan-secrets.sh
[[ -f artifacts/SBOM.json ]] || { echo "Missing SBOM" >&2; exit 1; }
[[ -f artifacts/Checksums.txt ]] || { echo "Missing checksums" >&2; exit 1; }
python3 -m json.tool artifacts/SBOM.json >/dev/null
