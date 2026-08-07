#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
A="$TMP/a.zip"
B="$TMP/b.zip"
"$ROOT/scripts/reproducibility/create-source-archive.sh" "$A" >/dev/null
"$ROOT/scripts/reproducibility/create-source-archive.sh" "$B" >/dev/null
HA="$(shasum -a 256 "$A" | awk '{print $1}')"
HB="$(shasum -a 256 "$B" | awk '{print $1}')"
[[ "$HA" == "$HB" ]] || { echo "Source archives are not reproducible: $HA != $HB" >&2; exit 1; }
echo "Source archive reproducibility passed: $HA"
