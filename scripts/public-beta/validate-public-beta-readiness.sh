#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
scripts/public-beta/validate-feature-freeze.sh
scripts/alpha/detect-release-blockers.sh
scripts/rc/scan-secrets.sh
for file in docs/public-beta/{PublicBetaGuide,SupportedPlatforms,FeatureFreeze,ReleaseGovernance,PrivacyNotice,TermsOfUse,SupportGuide,KnownIssues,ReleaseChecklist}.md; do [[ -s "$file" ]]; done
[[ -f release/0.43.0-rc.1/SBOM.spdx.json || -f release/0.45.0-alpha.1/SBOM.spdx.json ]]
echo 'Public beta readiness gates passed.'
