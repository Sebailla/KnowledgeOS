#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

[[ -f pnpm-lock.yaml ]] || {
  echo 'BLOCKED: pnpm-lock.yaml is missing.' >&2
  echo 'Run scripts/reproducibility/generate-lockfile.sh on a machine with registry access.' >&2
  exit 2
}

EXPECTED="pnpm@10.15.0"
ACTUAL="$(node -p "require('./package.json').packageManager || ''")"
[[ "$ACTUAL" == "$EXPECTED" ]] || {
  echo "packageManager mismatch: expected $EXPECTED, found $ACTUAL" >&2
  exit 1
}

"$ROOT/scripts/reproducibility/validate-workspace-manifests.sh"

if grep -R --include='package.json' -n '"typescript"[[:space:]]*:[[:space:]]*"workspace:' apps packages services tools 2>/dev/null; then
  echo 'Invalid workspace reference to external TypeScript dependency detected.' >&2
  exit 1
fi

if command -v corepack >/dev/null 2>&1 && corepack pnpm --version >/dev/null 2>&1; then
  VERSION="$(corepack pnpm --version)"
  [[ "$VERSION" == "10.15.0" ]] || {
    echo "pnpm version mismatch: expected 10.15.0, found $VERSION" >&2
    exit 1
  }
  corepack pnpm install --frozen-lockfile --ignore-scripts
else
  echo 'Lockfile structure checks passed; frozen install was not executed because pnpm is unavailable.'
  exit 3
fi

echo 'Lockfile integrity and frozen installation passed.'
