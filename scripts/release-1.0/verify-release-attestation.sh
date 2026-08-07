#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BASE="$ROOT/release/1.0.0-rc.1/attestations/ReleaseAttestation.json"
SIG="$BASE.sig"
ALG_FILE="$BASE.algorithm"
python3 "$ROOT/scripts/release-1.0/generate-release-attestation.py" >/dev/null
python3 - "$ROOT" <<'PY'
import hashlib,json,pathlib,sys
root=pathlib.Path(sys.argv[1]); a=json.load(open(root/'release/1.0.0-rc.1/attestations/ReleaseAttestation.json'))
for s in a['subject']:
 p=root/s['name']
 if not p.is_file(): raise SystemExit(f'Missing subject: {s["name"]}')
 if p.stat().st_size!=s['size']: raise SystemExit(f'Size mismatch: {s["name"]}')
 if hashlib.sha256(p.read_bytes()).hexdigest()!=s['sha256']: raise SystemExit(f'Hash mismatch: {s["name"]}')
print(f'Attestation subjects verified: {len(a["subject"])}')
PY
if [[ ! -s "$SIG" ]]; then
  if [[ "${KNOWLEDGEOS_REQUIRE_RELEASE_SIGNATURE:-0}" == 1 ]]; then echo 'Signed attestation required but missing.' >&2; exit 3; fi
  echo 'Attestation content verified; signature not present (allowed for RC only).'; exit 0
fi
[[ -s "$ALG_FILE" ]] || { echo 'Signature algorithm metadata missing.' >&2; exit 4; }
ALG="$(cat "$ALG_FILE")"
case "$ALG" in
  cosign)
    [[ -n "${COSIGN_PUBLIC_KEY:-}" ]] || { echo 'COSIGN_PUBLIC_KEY required.' >&2; exit 5; }
    cosign verify-blob --key "$COSIGN_PUBLIC_KEY" --signature "$SIG" "$BASE" >/dev/null
    ;;
  ed25519)
    [[ -n "${KNOWLEDGEOS_RELEASE_PUBLIC_KEY:-}" ]] || { echo 'KNOWLEDGEOS_RELEASE_PUBLIC_KEY required.' >&2; exit 5; }
    openssl pkeyutl -verify -rawin -pubin -inkey "$KNOWLEDGEOS_RELEASE_PUBLIC_KEY" -in "$BASE" -sigfile "$SIG" >/dev/null
    ;;
  *) echo "Unsupported signature algorithm: $ALG" >&2; exit 6;;
esac
echo "Release attestation signature verified: $ALG"
