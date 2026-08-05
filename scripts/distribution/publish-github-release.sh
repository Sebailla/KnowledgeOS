#!/usr/bin/env bash
set -euo pipefail
: "${RELEASE_TAG:?Set RELEASE_TAG}"
command -v gh >/dev/null || { echo "gh required" >&2; exit 1; }
gh release create "$RELEASE_TAG" artifacts/* --verify-tag --generate-notes
