# KnowledgeOS macOS

## Development

```bash
pnpm --filter @knowledgeos/macos-core-host... build
swift run --package-path apple/Apps/macOS KnowledgeOSMac
```

## Release bundle

```bash
scripts/build-macos-release.sh
scripts/package-macos-app.sh
scripts/validate-macos-bundle.sh
scripts/create-macos-archive.sh
```

The application first looks for the embedded runtime at:

```text
KnowledgeOS.app/Contents/Resources/Runtime/node
KnowledgeOS.app/Contents/Resources/CoreHost/apps/macos-core-host/dist/main.js
```

When running from the repository, it falls back to the locally compiled Core Host.

Persistent data and logs are stored under the user's `Application Support/KnowledgeOS` directory.

## Signing and notarization

```bash
export KNOWLEDGEOS_SIGN_IDENTITY="Developer ID Application: ..."
export KNOWLEDGEOS_NOTARY_PROFILE="knowledgeos-notary"
scripts/sign-and-notarize-macos.sh
```
