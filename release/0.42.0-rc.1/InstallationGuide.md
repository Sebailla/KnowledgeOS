# Installation Guide

1. Install Node.js 22+, pnpm 10+, Swift and Xcode on macOS.
2. Run `pnpm install`.
3. Run `scripts/rc/run-regression-suite.sh`.
4. Build macOS with `scripts/build-macos-release.sh` and `scripts/package-macos-app.sh`.
5. Build mobile targets using `scripts/build-ios.sh` and `scripts/build-ipados.sh` on macOS/Xcode.
