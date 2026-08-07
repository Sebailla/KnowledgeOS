#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

forbidden=(
  '.git/'
  'node_modules/'
  '.build/'
  'DerivedData/'
  'dist/'
  'dist-test/'
  'coverage/'
  '.turbo/'
  '.e2e-runtime/'
  '.knowledgeos-data/'
  'alpha-artifacts/'
)

archive="${1:-}"
if [[ -n "$archive" ]]; then
  [[ -f "$archive" ]] || { echo "Archive not found: $archive" >&2; exit 2; }
  listing="$(mktemp)"
  trap 'rm -f "$listing"' EXIT
  unzip -Z1 "$archive" > "$listing"
  failed=0
  for pattern in "${forbidden[@]}"; do
    if grep -Fq "/$pattern" "$listing" || grep -Fq "$pattern" "$listing"; then
      echo "Forbidden release path found: $pattern" >&2
      failed=1
    fi
  done
  [[ "$failed" -eq 0 ]] || exit 1
  echo "Source archive hygiene passed: $archive"
  exit 0
fi

# Repository check is informational for the complete cumulative workspace.
# Release archives are validated strictly by passing the archive path.
found=0
for path in .git node_modules .build DerivedData dist dist-test coverage .turbo .e2e-runtime .knowledgeos-data alpha-artifacts; do
  if [[ -e "$path" ]]; then
    echo "NOTICE: workspace contains runtime/generated path: $path"
    found=$((found+1))
  fi
done
echo "Workspace hygiene inspection completed with $found runtime/generated top-level paths."
