#!/usr/bin/env bash
set -euo pipefail
: "${GITHUB_TOKEN:?GITHUB_TOKEN is required}"
: "${RELEASE_TAG:?RELEASE_TAG is required}"
command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 1; }
gh release create "$RELEASE_TAG" artifacts/* --verify-tag --generate-notes
