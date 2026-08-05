#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
grep -R --include='*.ts' --include='*.swift' -n '1\.0' packages/sync apps/sync-server apple/Packages/KnowledgeOSCoreBridge apple/Packages/KnowledgeOSMobile >/dev/null
[[ -f release/0.42.0-rc.1/USP-1.0-FROZEN.md ]]
echo 'USP 1.0 compatibility evidence found.'
