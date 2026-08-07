#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
POLICY="$ROOT/release/1.0.0-rc.1/PromotionPolicy.json"
APPROVAL="$ROOT/release/1.0.0-rc.1/attestations/ReleaseApproval.json"
python3 - "$POLICY" <<'PY'
import json,sys
p=json.load(open(sys.argv[1]))
assert p['release']=='1.0.0-rc.1'
assert p['targetChannel']=='stable'
assert p['allowUnsignedStable'] is False
assert 'signed-attestation' in p['requiredGates']
assert 'release-approval' in p['requiredGates']
print('Promotion policy structure passed.')
PY
if [[ "${KNOWLEDGEOS_TARGET_CHANNEL:-rc}" == stable ]]; then
  KNOWLEDGEOS_REQUIRE_RELEASE_SIGNATURE=1 "$ROOT/scripts/release-1.0/verify-release-attestation.sh"
  [[ -s "$APPROVAL" ]] || { echo 'Stable promotion requires ReleaseApproval.json.' >&2; exit 7; }
  python3 - "$APPROVAL" <<'PY'
import json,sys
v=json.load(open(sys.argv[1]))
required=('release','approvedBy','approvedAt','decision')
missing=[k for k in required if not v.get(k)]
if missing: raise SystemExit(f'Missing approval fields: {missing}')
if v['release']!='1.0.0-rc.1' or v['decision']!='approve': raise SystemExit('Approval does not authorize this release.')
print('Stable promotion approval passed.')
PY
else
  "$ROOT/scripts/release-1.0/verify-release-attestation.sh"
fi
