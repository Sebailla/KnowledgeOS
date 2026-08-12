# Design: Complete iPadOS App Store Release

## Technical Approach

Deliver five gated vertical slices in a Feature Branch Chain (`auto-chain`): foundation, NAS acquisition, personal sync, reader workflow, and release assurance. `KnowledgeOSMobile` remains the UI-facing application layer; NAS and CloudKit are replaceable Integration adapters. This preserves NAS authority, offline operation, and the prohibition on storing Personal Knowledge in the Master Library.

## Architecture Decisions

| Decision | Alternatives considered | Choice and rationale |
|---|---|---|
| Mobile boundary | iPad-only implementation; duplicate iPhone APIs | Move common `MobileAppModel` operations outside platform conditionals and expose public use-case protocols. The current SwiftUI branch omits `importFile`/`processSharedImports`; one shared boundary avoids platform divergence. |
| Configuration | `UserDefaults` token; hard-coded endpoint | Persist non-secret endpoint/profile locally and credentials in Keychain; validate HTTPS before creating clients. This provides recoverable onboarding without shipping secrets. |
| NAS acquisition | Treat NAS as sync; CloudKit publication records | A catalog/acquisition adapter fetches immutable publication metadata/payloads from NAS with stable IDs, range resume, checksum, idempotency key, cancellation, and explicit user action. NAS remains authoritative for shared publications. |
| Personal sync | Existing generic REST loop; CloudKit types in UI | A provider-neutral `PersonalKnowledgeSyncing` contract owns versioned envelopes; a CloudKit adapter owns records, cursors, subscriptions, retries, conflicts and tombstones. Only Personal Knowledge crosses this boundary. |
| Release packaging | SwiftPM executable as release artifact | Add an Xcode archive/signing workspace/project and CI evidence. SwiftPM remains fast test tooling, not App Store distribution. |

## Data Flow

```text
iPad SwiftUI -> Mobile use cases -> Local Store (offline authority)
       |             |                    |
       |             +-> NAS acquisition adapter -> NAS Master Library (read-only)
       |             +-> Personal sync contract -> CloudKit adapter -> user private DB
       +-> Keychain (token only) / configuration store (endpoint only)
```

```text
User selects publication -> catalog -> resumable download -> checksum -> Local Library
User annotates -> durable local envelope -> CloudKit push/pull -> merge/conflict inbox
```

On network, auth, checksum, quota, or CloudKit failures, retain durable local state and surface retry/cancel/recovery. Reconcile unknown outcomes by operation/entity ID; never silently discard competing versions. NAS outage never blocks reading or personal sync. Background work is registered explicitly, bounded by OS scheduling, and resumes from persisted checkpoints.

## Interfaces / Contracts

```swift
protocol PublicationAcquiring: Sendable {
  func catalog() async throws -> [PublicationDescriptor]
  func acquire(_ id: StableID, resume: AcquisitionCheckpoint?) async throws -> AcquisitionResult
}
protocol PersonalKnowledgeSyncing: Sendable {
  func synchronize(cursor: SyncCursor?) async throws -> SyncResult
}
// Versioned envelope: entity ID, operation ID, vector/version, tombstone, payload checksum.
```

CloudKit record names, zones, tokens, and server endpoints remain adapter-private. Version Local Store, acquisition checkpoint, envelope, and CloudKit schema; migrate additively with backup, compatibility fixtures, recovery from prior snapshot, and feature flags. Rollback disables the slice and preserves local envelopes/checkpoints; never delete unresolved conflict versions.

## File Changes

| File / area | Action | Description |
|---|---|---|
| `apple/Packages/KnowledgeOSMobile/Sources/.../MobileAppModel.swift` | Modify | Common lifecycle, configuration, import/share, acquisition and sync state. |
| `apple/Packages/KnowledgeOSMobile/Sources/.../{MobileLocalStore,MobileHTTPClient,MobileSyncCoordinator}.swift` | Modify | Versioned persistence, secure transport, replace REST-only sync behind contracts. |
| `apple/Packages/KnowledgeOSMobile/Sources/.../{CloudKitPersonalSync,MobileAcquisition,SecureConfiguration}.swift` | Create | Provider-neutral adapters/use cases and Keychain configuration. |
| `apple/Apps/iPadOS/{Sources,Resources,Tests}/` | Modify/Create | Onboarding, catalog, reader/annotation/conflict UX, entitlements/privacy/background tasks, UI tests. |
| `apple/Apps/iPadOS/{Package.swift,*.xcodeproj/**,CI}` | Modify/Create | Test target plus archive/signing pipeline; generated build products excluded. |
| `apps/sync-server/`, `deployment/production/` | Modify | Versioned catalog/acquisition contract, TLS/auth, health, backup/restore runbooks. |
| `01-Implementation/{03-MobileApplication,17-SystemIntegrationAndRelease}/` | Modify | Architecture traceability, security/privacy, device and release evidence. |

## Testing Strategy

| Layer | Coverage |
|---|---|
| Unit | Configuration/Keychain seams, import access, hashes, migrations, conflict/tombstone merge, retry/idempotency. |
| Contract/integration | NAS catalog/range/checksum/auth failures; CloudKit private DB schema/cursor/recovery; no Personal Knowledge NAS writes. |
| UI/E2E/device | Onboarding, offline reading/annotations/restoration/export, split view/keyboard/pointer/Pencil, VoiceOver/Dynamic Type, suspension, upgrade/rollback, two-device conflict, TestFlight archive. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary is introduced.

## Delivery and External Gates

Create draft tracker `feature/complete-ipados-release`; child branches target the immediate predecessor: (1) foundation/configuration, (2) NAS acquisition, (3) CloudKit sync, (4) reader/iPad UX, (5) release assurance. Each slice stays within 400 authored changed lines where feasible, includes docs/tests, independent rollback, and a clean diff.

Before slice 2/3/5: Apple Developer and App Store Connect roles; registered App ID, private CloudKit container/schema, profiles/certificates, test iCloud accounts; production NAS API/TLS/auth/backup/monitoring ownership; physical iPads; named release/security/privacy approvers. Missing prerequisites block the affected release gate, not offline foundation work.

## Open Questions

- [ ] Approve concrete NAS catalog/acquisition API and auth lifecycle.
- [ ] Approve CloudKit zone, conflict-merge policy, retention, and schema deployment ownership.
- [ ] Provide Apple signing identities, hardware matrix, and App Store metadata owner.
