## Exploration: complete-ipados-release

### Current State
The iPad app is a SwiftPM SwiftUI shell over `KnowledgeOSMobile`. It bootstraps with `configuration: nil`, so it always enters `needsConfiguration`, while no onboarding or configuration UI exists. The SwiftUI branch of `MobileAppModel` omits `importFile` and `processSharedImports`, although the iPad view calls both; the app therefore cannot compile for its intended UI platform. Its iPad test target contains only a placeholder test.

Local persistence, reader state, bookmarks, annotations, import staging, search, graph, export, and a REST-style offline queue exist in the shared package. However, sync is not CloudKit: `MobileSyncCoordinator` posts and pulls generic JSON envelopes through `MobileHTTPClient`, only applies reading-position operations, and has no direct covering tests. iPad entitlements contain app group, keychain and associated domains but no iCloud/CloudKit container capability. The SwiftPM package is not an App Store archive/signing configuration.

### Affected Areas
- `apple/Apps/iPadOS/Sources/KnowledgeOSiPadOS/KnowledgeOSiPadOSApp.swift` — iPad shell, bootstrap, import and reader flows.
- `apple/Apps/iPadOS/Resources/{KnowledgeOS.entitlements,Info.plist,PrivacyInfo.xcprivacy}` — CloudKit, background execution, privacy declarations and release metadata.
- `apple/Apps/iPadOS/Tests/KnowledgeOSiPadOSTests/KnowledgeOSiPadOSTests.swift` — placeholder-only test target.
- `apple/Packages/KnowledgeOSMobile/Sources/KnowledgeOSMobile/MobileAppModel.swift` — platform-conditional API mismatch, configuration lifecycle and UI-facing state.
- `apple/Packages/KnowledgeOSMobile/Sources/KnowledgeOSMobile/{MobileHTTPClient,MobileSyncCoordinator,MobileLocalStore}.swift` — server credentials, acquisition/sync boundaries, persistence and recovery.
- `apps/sync-server/` and `deployment/` — operational NAS/API contract, deployment, health, backup/restore and compatibility evidence.
- `01-Implementation/03-MobileApplication/` and `01-Implementation/17-SystemIntegrationAndRelease/` — traceability, release, accessibility, privacy and device-test evidence.

### Approaches
1. **Vertical release increments (recommended)** — Deliver an iPad-specific vertical slice at a time: compile/configuration, NAS acquisition, CloudKit Personal Knowledge sync, reader/annotation parity, then release engineering and physical-device validation.
   - Pros: Preserves the approved separation of NAS acquisition and CloudKit Personal Knowledge sync; produces testable checkpoints and reversible releases.
   - Cons: Requires contract, operational and test work across Apple and server modules.
   - Effort: High.

2. **Complete the SwiftUI shell first, defer services** — Fix compilation and polish local reading/import UI before backend, CloudKit and release work.
   - Pros: Quick visible progress and lower initial implementation risk.
   - Cons: Cannot satisfy the requested App Store-release scope; risks UI rework once real configuration, acquisition and sync failure states arrive.
   - Effort: Medium.

3. **Replace the shared mobile layer** — Rebuild iPad-specific storage, sync and reader flows independently.
   - Pros: Could simplify the iPad implementation in isolation.
   - Cons: Duplicates cross-device behavior, threatens stable identity and offline/sync consistency, and contradicts the existing shared-mobile direction.
   - Effort: Very High.

### Recommendation
Use vertical release increments, each as a separately reviewable SDD delivery slice. Start by repairing the SwiftUI API mismatch and introducing secure, persisted server configuration/onboarding. Then define and implement the operational NAS acquisition contract separately from a provider-neutral Sync Engine with a CloudKit adapter for Personal Knowledge. Do not let CloudKit record types or server transport leak into Domain/UI contracts. Treat signing, privacy manifests, accessibility, physical devices, TestFlight and App Store evidence as release gates rather than final polish.

### Risks
- A real CloudKit implementation, container ownership, schema deployment and conflict/tombstone semantics need an approved technical design and device/iCloud-account evidence; the current generic REST sync cannot be relabeled as CloudKit.
- The NAS/server endpoint compatibility, authentication lifecycle, TLS, resumable acquisition, backup/restore and production monitoring are not proven by the iPad package.
- The current app-group/keychain entitlements and PrivacyInfo manifest are insufficient evidence for least-privilege CloudKit access, background execution, App Store privacy compliance or signing.
- iPad release verification cannot be completed in SwiftPM alone: it needs an Xcode archive/signing pipeline, registered App ID/profiles, real iPad hardware, TestFlight, accessibility audit and App Store review metadata.
- Annotation UI, conflict-resolution UI, full sync application, background-task registration and recovery tests are incomplete; shipping before them risks silent loss or divergence of Personal Knowledge.

### Ready for Proposal
Yes — propose `complete-ipados-release` as a cross-cutting release initiative with chained implementation work units. The proposal must explicitly scope the iPad App Store release, list the external Apple/NAS credentials and hardware as prerequisites, and require an architecture/design decision for CloudKit adapter boundaries, production server compatibility, release ownership and acceptance evidence.
