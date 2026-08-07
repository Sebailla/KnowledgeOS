#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ARCHIVE="${1:-$ROOT/artifacts/KnowledgeOS-1.0.0-rc.1-source.zip}"
[[ -f "$ARCHIVE" ]] || "$ROOT/scripts/reproducibility/create-source-archive.sh" "$ARCHIVE" >/dev/null
python3 "$ROOT/scripts/reproducibility/verify-source-manifest.py" "$ARCHIVE"
[[ -f "$ARCHIVE.sha256" ]] || { echo "Missing archive checksum: $ARCHIVE.sha256" >&2; exit 1; }
(cd "$(dirname "$ARCHIVE")" && shasum -a 256 -c "$(basename "$ARCHIVE").sha256")
echo 'Release provenance validation passed.'
