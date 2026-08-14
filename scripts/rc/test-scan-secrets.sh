#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir -p "$tmp/apps/master-library-local-browser/test" "$tmp/src"
cp "$ROOT/scripts/rc/scan-secrets.sh" "$tmp/scan-secrets.sh"
chmod +x "$tmp/scan-secrets.sh"

git -C "$tmp" init -q
git -C "$tmp" config user.email test@knowledgeos.local
git -C "$tmp" config user.name 'Secret scanner test'

cat > "$tmp/src/secret-reader.mjs" <<'EOF'
const password = await readFile(process.env.PASSWORD_FILE, 'utf8');
EOF
cat > "$tmp/apps/master-library-local-browser/test/local-browser.test.mjs" <<'EOF'
const password = "deterministic-test-password";
EOF
git -C "$tmp" add .
git -C "$tmp" commit -qm fixtures

(cd "$tmp" && SECRET_SCAN_ROOT="$tmp" ./scan-secrets.sh)

printf 'token = "%s%s"\n' 'AKIA' '1234567890ABCDEF' > "$tmp/src/leaked.mjs"
git -C "$tmp" add src/leaked.mjs
git -C "$tmp" commit -qm leaked

if (cd "$tmp" && SECRET_SCAN_ROOT="$tmp" ./scan-secrets.sh); then
  echo 'Secret scanner accepted a high-confidence credential.' >&2
  exit 1
fi

echo 'Secret scanner regression checks passed.'
