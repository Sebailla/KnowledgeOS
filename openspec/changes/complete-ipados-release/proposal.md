# Proposal: Complete iPadOS App Store Release

## Intent
Deliver a production iPadOS KnowledgeOS App Store release: offline reading, NAS acquisition, CloudKit sync, and release proof. The SwiftUI shell fails to compile and lacks release readiness.

## Scope

### In Scope
- Repair the SwiftUI `MobileAppModel` boundary; add secure configuration, import/share recovery, and tests.
- Deliver HTTPS NAS catalog/acquisition with resumable, idempotent transfers and operations evidence.
- Implement provider-neutral Personal Knowledge sync with a CloudKit adapter, versioned conflict/tombstone recovery, and no NAS writes.
- Complete reader, annotations, restoration, export, and iPad accessibility/input behavior.
- Establish archive/signing, entitlements, privacy metadata, diagnostics, TestFlight/App Store material, and physical-device evidence.

### Out of Scope
- iPhone parity or a separate iPhone release.
- Replacing UDM/DPM, NAS authority, or the shared mobile architecture.
- New AI/OCR capabilities beyond compliant existing integrations.

## Capabilities

### New Capabilities
- `ipados-release-foundation`: Compilable, configurable, secure iPad lifecycle and release packaging.
- `nas-mobile-acquisition`: Resilient NAS catalog and publication acquisition.
- `cloudkit-personal-knowledge-sync`: CloudKit synchronization through provider-neutral contracts.
- `ipados-reading-knowledge-workflow`: Accessible reader, annotations, restoration, export, and iPad interaction.
- `ipados-release-assurance`: Device, accessibility, privacy, security, operations, TestFlight, and submission evidence.

### Modified Capabilities
- None; `openspec/specs/` has no established capabilities.

## Approach
Use vertical feature-branch-chain increments (`auto-chain`): foundation/configuration; NAS acquisition; CloudKit sync; reader; release assurance. Each slice is gated before its successor. CloudKit and NAS transport remain Integration adapters behind public contracts.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `apple/Apps/iPadOS/` | Modified | UI, entitlements, privacy, archive, tests |
| `apple/Packages/KnowledgeOSMobile/` | Modified | Lifecycle, acquisition, sync, reader |
| `apps/sync-server/`, `deployment/` | Modified | NAS contract, production operations |
| `01-Implementation/{03-MobileApplication,17-SystemIntegrationAndRelease}/` | Modified | Traceability, runbooks, acceptance |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| CloudKit conflict loss | High | Design gate, versioned envelopes, device tests |
| Apple access/hardware unavailable | High | External release gate with recorded evidence |
| NAS incompatibility | Medium | Contract, TLS/auth/recovery probes |

## Compatibility and Rollback
Version local, CloudKit, and server contracts; migrate with backups and compatibility tests. Feature-flag new paths, retain local data, stop rollout/TestFlight, and revert the affected chain slice if telemetry or recovery checks fail. Never delete competing Personal Knowledge versions on rollback.

## Dependencies
- Apple Developer/App Store Connect access, App ID, CloudKit container/schema, profiles, TestFlight.
- Production NAS/API, TLS, credentials, backup/restore ownership, monitoring, physical iPads, test iCloud accounts.
- Approved CloudKit adapter-boundary and production-contract design before implementation.

## Success Criteria
- [ ] Archived, signed iPad app passes automated and physical-device acceptance.
- [ ] Offline reading/annotation, NAS acquisition, and CloudKit recovery preserve authority boundaries.
- [ ] Accessibility, privacy, security, TestFlight, and submission evidence is complete.
