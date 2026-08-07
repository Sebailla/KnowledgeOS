#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="${1:-$ROOT/artifacts/KnowledgeOS-1.0.0-rc.1-source.zip}"
mkdir -p "$(dirname "$OUT")"
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
STAGE="$TMP/KnowledgeOS"
mkdir -p "$STAGE"

cd "$ROOT"
# Copy only source/release inputs. Preserve dotfiles except excluded runtime data.
rsync -a ./ "$STAGE/" \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='**/node_modules/' \
  --exclude='.build/' \
  --exclude='**/.build/' \
  --exclude='DerivedData/' \
  --exclude='**/DerivedData/' \
  --exclude='dist/' \
  --exclude='**/dist/' \
  --exclude='dist-test/' \
  --exclude='**/dist-test/' \
  --exclude='coverage/' \
  --exclude='**/coverage/' \
  --exclude='.turbo/' \
  --exclude='**/.turbo/' \
  --exclude='.e2e-runtime/' \
  --exclude='.knowledgeos-data/' \
  --exclude='alpha-artifacts/' \
  --exclude='artifacts/' \
  --exclude='*.zip' \
  --exclude='.DS_Store'

# Generate a content manifest before archiving. The manifest excludes itself
# to avoid a self-referential hash.
MANIFEST="$STAGE/release/1.0.0-rc.1/SourceManifest.json"
python3 "$ROOT/scripts/reproducibility/generate-source-manifest.py" "$STAGE" "$MANIFEST" >/dev/null

# Normalize mtimes and archive ordering for reproducibility.
find "$STAGE" -exec touch -h -t 202601010000 {} +
rm -f "$OUT"
(
  cd "$TMP"
  LC_ALL=C find KnowledgeOS -type f -o -type l -o -type d | LC_ALL=C sort | zip -X -q "$OUT" -@
)
"$ROOT/scripts/reproducibility/validate-source-hygiene.sh" "$OUT"
python3 "$ROOT/scripts/reproducibility/verify-source-manifest.py" "$OUT"
shasum -a 256 "$OUT" > "$OUT.sha256"
echo "$OUT"
