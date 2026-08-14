#!/usr/bin/env bash
set -euo pipefail
ROOT="${SECRET_SCAN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$ROOT"
HIGH_CONFIDENCE_PATTERN='(BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,})'
LITERAL_CREDENTIAL_PATTERN="(^|[^[:alnum:]_])(password|secret|token|api[_-]?key)[[:alnum:]_-]*[[:space:]]*[:=][[:space:]]*[\"'][^\"']{8,}[\"']"

# These files deliberately contain deterministic, non-production credentials
# required to exercise local authentication and PostgreSQL integration paths.
# Keep the exception list narrow: high-confidence secret signatures remain
# prohibited everywhere else in the repository.
is_sanitized_fixture() {
  case "$1" in
    apps/master-library-local-browser/test/local-browser.test.mjs|\
    apps/sync-server/test/e2e/cross-platform-e2e.test.ts|\
    apple/Packages/KnowledgeOSMobile/Tests/KnowledgeOSMobileTests/MobileFoundationTests.swift|\
    packages/master-library-local-development-auth/test/local-development-auth.test.mjs|\
    packages/master-storage/scripts/run-postgres-test.mjs|\
    packages/master-storage/scripts/run-processing-recovery-test.mjs|\
    scripts/rc/test-scan-secrets.sh|\
    scripts/deployment/test-local-master-library-browser.mjs)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

found=0
while IFS= read -r -d '' file; do
  if is_sanitized_fixture "$file"; then
    continue
  fi

  if grep -IE -H "$HIGH_CONFIDENCE_PATTERN" -- "$file" || \
    grep -IE -H "$LITERAL_CREDENTIAL_PATTERN" -- "$file"; then
    found=1
  fi
done < <(git ls-files -z)

if [ "$found" -ne 0 ]; then
  echo 'Potential secret detected.' >&2
  exit 1
fi
echo 'No high-confidence secrets detected.'
