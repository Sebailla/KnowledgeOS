#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET="${1:-$ROOT/release/1.0.0-rc.1}"
OUT="$TARGET/SHA256SUMS"
(
  cd "$ROOT"
  find "${TARGET#$ROOT/}" -type f ! -name SHA256SUMS ! -name SHA256SUMS.sig -print0 | sort -z | xargs -0 shasum -a 256
) > "$OUT"
if command -v gpg >/dev/null 2>&1 && [[ -n "${KNOWLEDGEOS_GPG_KEY_ID:-}" ]]; then
  gpg --batch --yes --local-user "$KNOWLEDGEOS_GPG_KEY_ID" --detach-sign --armor --output "$TARGET/SHA256SUMS.sig" "$OUT"
else
  printf 'Unsigned: set KNOWLEDGEOS_GPG_KEY_ID to generate SHA256SUMS.sig.\n' > "$TARGET/SHA256SUMS.sig.pending"
fi
echo "$OUT"
