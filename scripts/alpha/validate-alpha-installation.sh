#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
required=(docs/alpha/AlphaInstallationGuide.md docs/alpha/EvaluatorGuide.md docs/alpha/PrivacyAndDiagnostics.md deployment/production/compose.yaml release/0.45.0-alpha.1/AlphaManifest.json)
for item in "${required[@]}"; do [[ -s "$item" ]] || { echo "Missing Alpha requirement: $item" >&2; exit 1; }; done
for script in scripts/alpha/*.sh; do bash -n "$script"; done
scripts/rc/scan-secrets.sh
scripts/rc/validate-protocol-compatibility.sh
if command -v docker >/dev/null 2>&1; then scripts/deployment/validate-production.sh; else echo 'Docker unavailable: NAS runtime validation deferred.'; fi
echo 'Alpha installation structure validated.'
