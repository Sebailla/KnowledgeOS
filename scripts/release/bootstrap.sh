#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
need(){ command -v "$1" >/dev/null 2>&1 || { echo "Missing required tool: $1" >&2; exit 1; }; }
need node
need corepack
need git
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[[ "$NODE_MAJOR" -ge 22 ]] || { echo "Node >=22 is required" >&2; exit 1; }
corepack enable
corepack prepare pnpm@10.15.0 --activate
pnpm install --frozen-lockfile=false
mkdir -p build artifacts diagnostics
pnpm typecheck
echo "KnowledgeOS bootstrap completed."
