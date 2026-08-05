#!/usr/bin/env bash
set -euo pipefail
: "${APP_STORE_API_KEY_ID:?Set APP_STORE_API_KEY_ID}"
: "${APP_STORE_API_ISSUER_ID:?Set APP_STORE_API_ISSUER_ID}"
IPA="${1:?Usage: upload-testflight.sh app.ipa}"
xcrun altool --upload-app --type ios --file "$IPA" --apiKey "$APP_STORE_API_KEY_ID" --apiIssuer "$APP_STORE_API_ISSUER_ID"
