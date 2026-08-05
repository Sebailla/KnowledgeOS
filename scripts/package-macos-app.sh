#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${KNOWLEDGEOS_BUILD_DIR:-$ROOT/build/macos-release}"
APP="$BUILD_ROOT/KnowledgeOS.app"
CONTENTS="$APP/Contents"
RESOURCES="$CONTENTS/Resources"
HOST_ROOT="$RESOURCES/CoreHost"
SWIFT_BINARY="$BUILD_ROOT/swift/release/KnowledgeOSMac"
NODE_BINARY="${KNOWLEDGEOS_NODE_BINARY:-$(command -v node || true)}"

[[ -x "$SWIFT_BINARY" ]] || { echo "Missing Swift release binary. Run scripts/build-macos-release.sh" >&2; exit 1; }
[[ -x "$NODE_BINARY" ]] || { echo "A Node runtime is required. Set KNOWLEDGEOS_NODE_BINARY." >&2; exit 1; }

rm -rf "$APP"
mkdir -p "$CONTENTS/MacOS" "$RESOURCES/Runtime" "$HOST_ROOT/apps/macos-core-host" "$HOST_ROOT/packages"
cp "$SWIFT_BINARY" "$CONTENTS/MacOS/KnowledgeOS"
cp apple/Apps/macOS/Resources/Info.plist "$CONTENTS/Info.plist"
cp apple/Apps/macOS/Packaging/release.json "$RESOURCES/release.json"
cp "$NODE_BINARY" "$RESOURCES/Runtime/node"
chmod 755 "$CONTENTS/MacOS/KnowledgeOS" "$RESOURCES/Runtime/node"

cp -R apps/macos-core-host/dist "$HOST_ROOT/apps/macos-core-host/dist"
cp apps/macos-core-host/package.json "$HOST_ROOT/apps/macos-core-host/package.json"

for package_dir in packages/*; do
  [[ -d "$package_dir/dist" ]] || continue
  name="$(basename "$package_dir")"
  mkdir -p "$HOST_ROOT/packages/$name"
  cp -R "$package_dir/dist" "$HOST_ROOT/packages/$name/dist"
  cp "$package_dir/package.json" "$HOST_ROOT/packages/$name/package.json"
done

mkdir -p "$HOST_ROOT/node_modules/@knowledgeos"
for package_dir in "$HOST_ROOT"/packages/*; do
  [[ -d "$package_dir" ]] || continue
  name="$(basename "$package_dir")"
  ln -s "../../packages/$name" "$HOST_ROOT/node_modules/@knowledgeos/$name"
done

printf '%s\n' "$APP"
