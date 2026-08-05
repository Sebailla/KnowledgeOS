#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
PATTERN='(BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|password[[:space:]]*=[[:space:]]*[^[:space:]$])'
if grep -RIE --exclude-dir=.git --exclude-dir=node_modules --exclude='*.zip' "$PATTERN" .; then
  echo 'Potential secret detected.' >&2
  exit 1
fi
echo 'No high-confidence secrets detected.'
