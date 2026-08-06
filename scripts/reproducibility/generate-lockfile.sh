#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
"$ROOT/scripts/reproducibility/validate-workspace-manifests.sh"
command -v corepack >/dev/null || { echo 'corepack is required (Node.js 22+).' >&2; exit 1; }
corepack enable
corepack prepare pnpm@10.15.0 --activate
pnpm install --lockfile-only --ignore-scripts
pnpm install --frozen-lockfile --ignore-scripts
printf 'pnpm-lock.yaml generated and verified with pnpm 10.15.0.\n'
