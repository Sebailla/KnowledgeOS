# Tasks: iPadOS Release

## Forecast

| Field | Value |
|---|---|
| Lines | 1,800–3,000 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Split | foundation → NAS → sync → reader → assurance |
| Strategy | auto-chain |
| Chain | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Work Units

| Unit | PR base | Test | Runtime | Rollback |
|---|---|---|---|---|
| 1 foundation | tracker | `swift test --package-path apple/Apps/iPadOS` | simulator launch | model/config/UI |
| 2 NAS | PR1 | `swift test --package-path apple/Packages/KnowledgeOSMobile` | TLS resume fixture | acquisition/server |
| 3 sync | PR2 | `swift test --package-path apple/Packages/KnowledgeOSMobile` | two iCloud | sync/schema |
| 4 reader | PR3 | `swift test --package-path apple/Apps/iPadOS` | offline annotation | reader/UI/export |
| 5 assurance | PR4 | `pnpm validate` | signed archive | CI/metadata |

## Phase 0: Gates
- [ ] 0.1 Record NAS API/auth, TLS, backup/restore and monitoring probes in `deployment/production/`; otherwise block PR2.
- [ ] 0.2 Record Apple roles, App ID, profiles, CloudKit schema and iPad matrix in `01-Implementation/17-SystemIntegrationAndRelease/`; otherwise block PR3/PR5.
- [ ] 0.3 Record security/privacy/release approvers and metadata owner in `01-Implementation/17-SystemIntegrationAndRelease/`.

## Phase 1: Foundation
- [x] 1.1 RED: tests prove SwiftUI recovery/relaunch without duplicate ingestion.
- [x] 1.2 GREEN: move shared APIs into `Sources/KnowledgeOSMobile/MobileAppModel.swift`; add `SecureConfiguration.swift` (Keychain secret, HTTPS endpoint).
- [x] 1.3 REFACTOR: add onboarding/recovery to `apple/Apps/iPadOS/Sources/KnowledgeOSiPadOS/KnowledgeOSiPadOSApp.swift`; update `03-MobileApplication/08-Operations/Configuration.md`.
- [x] 1.4 Verify Mobile and iPad Swift package tests.

## Phase 2: NAS (PR2; 0.1)
- [ ] 2.1 RED: `MobileAcquisitionTests` cover selection, resume, ID, checksum/auth/cancel and offline reading.
- [ ] 2.2 GREEN: create `Sources/KnowledgeOSMobile/MobileAcquisition.swift`; checkpoint `MobileLocalStore.swift`; surface catalog/retry in iPad.
- [ ] 2.3 REFACTOR: version catalog/range contract in `apps/sync-server/`; document TLS/health/recovery in `deployment/production/`.
- [ ] 2.4 Verify fixture: no Personal Knowledge NAS write and one local payload after resume.

## Phase 3: Sync (PR3; 0.2)
- [ ] 3.1 RED: sync tests cover conflict, stale tombstone, cursor and adapter isolation.
- [ ] 3.2 GREEN: add `PersonalKnowledgeSyncing`/`CloudKitPersonalSync.swift`; version envelopes/migrations in `MobileLocalStore.swift`.
- [ ] 3.3 REFACTOR: add conflict inbox/retry in iPad sources; update `03-MobileApplication/06-Synchronization/`.
- [ ] 3.4 Verify two test accounts retain competing identities and prevent resurrection.

## Phase 4: Reader UX
- [ ] 4.1 RED: reader tests cover offline restoration, invalid-artifact rebuild, accessible annotation and provenance export.
- [ ] 4.2 GREEN: extend `ReaderSessionManager.swift` for notes, bookmarks, restoration and export.
- [ ] 4.3 REFACTOR: cover VoiceOver, Dynamic Type, keyboard, pointer, multitasking, Pencil; update `04-Reading/` and `05-Annotations/`.
- [ ] 4.4 Verify simulator offline/relaunch/accessibility scenarios.

## Phase 5: Assurance (PR5; 0.2–0.3)
- [ ] 5.1 RED: admission tests fail for missing entitlement, privacy, diagnostics or critical-risk evidence.
- [ ] 5.2 GREEN: add Xcode archive/signing CI, background registration, entitlements, diagnostics and `PrivacyInfo.xcprivacy` updates.
- [ ] 5.3 REFACTOR: write device/accessibility/recovery/TestFlight/rollback evidence in `17-SystemIntegrationAndRelease/`.
- [ ] 5.4 Verify typecheck, pnpm, Swift, signed archive and device matrix; critical failures block TestFlight.
