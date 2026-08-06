#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
[[ -f pnpm-lock.yaml ]] || { echo 'pnpm-lock.yaml is missing. Run generate-lockfile.sh with registry access.' >&2; exit 2; }
corepack enable
corepack prepare pnpm@10.15.0 --activate
rm -rf node_modules
find apps packages services tools -type d \( -name node_modules -o -name dist -o -name dist-test -o -name .turbo \) -prune -exec rm -rf {} + 2>/dev/null || true
pnpm install --frozen-lockfile
pnpm validate
printf 'Clean frozen-lockfile installation and validation passed.\n'
