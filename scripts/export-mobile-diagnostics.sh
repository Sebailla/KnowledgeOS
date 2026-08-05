#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/build/mobile-diagnostics}"
rm -rf "$OUT"; mkdir -p "$OUT"
cp "$ROOT/apple/Apps/iOS/Resources/Info.plist" "$OUT/iOS-Info.plist"
cp "$ROOT/apple/Apps/iPadOS/Resources/Info.plist" "$OUT/iPadOS-Info.plist"
find "$ROOT/apple" -name '*.entitlements' -exec cp {} "$OUT/" \;
grep -RIlE 'token|secret|password|api[_-]?key' "$OUT" | xargs -r sed -i.bak -E 's/(token|secret|password|api[_-]?key)[^<"]*/=REDACTED/Ig'
find "$OUT" -name '*.bak' -delete
