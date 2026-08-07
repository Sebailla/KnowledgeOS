#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ATTESTATION="$ROOT/release/1.0.0-rc.1/attestations/ReleaseAttestation.json"
[[ -s "$ATTESTATION" ]] || python3 "$ROOT/scripts/release-1.0/generate-release-attestation.py" >/dev/null
if [[ -n "${COSIGN_KEY:-}" ]] && command -v cosign >/dev/null 2>&1; then
  cosign sign-blob --yes --key "$COSIGN_KEY" --output-signature "$ATTESTATION.sig" "$ATTESTATION"
  printf 'cosign\n' > "$ATTESTATION.algorithm"
elif [[ -n "${KNOWLEDGEOS_RELEASE_PRIVATE_KEY:-}" ]] && command -v openssl >/dev/null 2>&1; then
  openssl pkeyutl -sign -rawin -inkey "$KNOWLEDGEOS_RELEASE_PRIVATE_KEY" -in "$ATTESTATION" -out "$ATTESTATION.sig"
  printf 'ed25519\n' > "$ATTESTATION.algorithm"
else
  echo 'No signing key configured. Set COSIGN_KEY or KNOWLEDGEOS_RELEASE_PRIVATE_KEY.' >&2
  exit 2
fi
shasum -a 256 "$ATTESTATION" "$ATTESTATION.sig" > "$ATTESTATION.sha256"
echo "$ATTESTATION.sig"
