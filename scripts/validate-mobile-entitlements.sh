#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for platform in iOS iPadOS; do
 plutil -lint "$ROOT/apple/Apps/$platform/Resources/Info.plist"
 plutil -lint "$ROOT/apple/Apps/$platform/Resources/KnowledgeOS.entitlements"
 plutil -lint "$ROOT/apple/Apps/$platform/Resources/PrivacyInfo.xcprivacy"
 grep -q 'group.com.knowledgeos.shared' "$ROOT/apple/Apps/$platform/Resources/KnowledgeOS.entitlements"
done
