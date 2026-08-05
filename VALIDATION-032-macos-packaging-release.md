# Validation — Sprint 032 macOS Packaging and Release Foundation

- Errors: 0
- Warnings: 0
- 17 TypeScript packages build passed
- macOS Core Host build passed
- 21 macOS Core Host tests passed
- 16 KnowledgeOSCoreBridge tests passed
- 4 macOS application tests passed
- 5 release scripts passed Bash syntax validation
- Swift Release build passed
- KnowledgeOS.app assembly passed
- Info.plist and required bundle resources validation passed
- Embedded Core Host entry validation passed
- Embedded Node runtime validation passed

## Not executed

- Apple Developer signing was not executed because no signing identity was supplied.
- Apple notarization was not executed because no notary profile was supplied.
- The included `sign-and-notarize-macos.sh` script requires both credentials on macOS.
