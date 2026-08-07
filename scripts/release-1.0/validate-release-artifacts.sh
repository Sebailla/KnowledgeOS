#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="$ROOT/release/1.0.0-rc.1"
required=(ReleaseManifest.json SourceManifest.json SBOM.spdx.json SBOM.cyclonedx.json SHA256SUMS ValidationReport.md SecurityReport.md MigrationReport.md PerformanceReport.md DistributionReport.md)
for item in "${required[@]}"; do [[ -s "$TARGET/$item" ]] || { echo "Missing release artifact: $item" >&2; exit 1; }; done
(cd "$ROOT" && shasum -a 256 -c "release/1.0.0-rc.1/SHA256SUMS")
python3 -m json.tool "$TARGET/ReleaseManifest.json" >/dev/null
python3 -m json.tool "$TARGET/SourceManifest.json" >/dev/null
python3 -m json.tool "$TARGET/SBOM.spdx.json" >/dev/null
python3 -m json.tool "$TARGET/SBOM.cyclonedx.json" >/dev/null
echo 'Release artifact validation passed.'
