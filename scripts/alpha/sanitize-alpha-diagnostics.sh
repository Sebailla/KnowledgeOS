#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:?Usage: sanitize-alpha-diagnostics.sh DIRECTORY}"
[[ -d "$TARGET" ]] || { echo "Diagnostics directory not found" >&2; exit 1; }
find "$TARGET" -type f -size -10M -print0 | while IFS= read -r -d '' file; do
  case "$file" in
    *.json|*.log|*.txt|*.md)
      python3 - "$file" <<'PY'
import pathlib,re,sys
p=pathlib.Path(sys.argv[1])
try: text=p.read_text(errors='ignore')
except Exception: raise SystemExit(0)
patterns=[
 (r'(?im)^(authorization|token|secret|password|api[_-]?key)\s*[:=].*$',r'\1=REDACTED'),
 (r'Bearer\s+[A-Za-z0-9._~+/-]+=*','Bearer REDACTED'),
 (r'(?i)(/Users/|/home/)[^\s\"]+',r'\1REDACTED'),
]
for pattern,replacement in patterns: text=re.sub(pattern,replacement,text)
p.write_text(text)
PY
      ;;
  esac
done
if grep -RIE '(Bearer [A-Za-z0-9]|password[=:][^R]|token[=:][^R]|BEGIN .*PRIVATE KEY)' "$TARGET"; then
  echo 'Potential sensitive diagnostic data remains.' >&2
  exit 1
fi
echo 'Alpha diagnostics sanitized.'
