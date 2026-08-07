# Proposal: Durable Import Boundary

## Intent

Replace whole-file `content: String` import with reliable Core transport, a versioned contract, and actual macOS staging/cleanup—without durable source persistence or lifecycle completion.

## Scope

### In Scope
- Phase 0: framing, timeouts, typed failures, buffer reset, and restart cleanup.
- Phase 1: shared TypeScript/Swift staged-source DTOs.
- Actual macOS staging and cleanup in an app-controlled root.
- Opaque, root-confined macOS staged-file capabilities with consumer revalidation.
- Explicit v1 rejection with a stable version error and no compatibility window.
- Bounded, configurable retention for recoverable failed payloads.
- Lifecycle conformance through `ProcessingQueued` with failure/recovery states.

### Out of Scope
- Durable source persistence, job journals, or `ImportJobManager` storage.
- Library registration, Reader/Search creation, or lifecycle state `Ready`.
- PDF/EPUB parsing and streaming IPC.

## Capabilities

### New Capabilities
- `core-transport-lifecycle`: Framing, failure, timeout, and restart guarantees.
- `staged-source-import-contract`: Staged-source handoff, validation, retention, rejection, and lifecycle.

### Modified Capabilities
- None.

## Approach

Deliver two gated slices: prove transport lifecycle behavior; then implement macOS staging/cleanup, define `@knowledgeos/contracts` DTOs, mirror them in Swift, and validate at the Core Host. Staging remains transient, bounded, opaque, and root-confined. Use `auto-chain` with `feature-branch-chain`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `apple/Packages/KnowledgeOSCoreBridge/` | Modified | Transport, DTOs, mapping, tests |
| `apple/Apps/macOS/` | Modified | Staging, retention, cleanup |
| `packages/contracts/src/` | New | Versioned contracts |
| `apps/macos-core-host/src/router.ts` | Modified | Boundary validation |
| `packages/import/src/jobs/ImportJobManager.ts` | Modified | Retire/adapt prototype boundary |
| `01-Implementation/08-ImportAndAcquisition/` | Modified | Documentation alignment |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Read cancellation corrupts ordering | Medium | Single transport owner; deterministic framing tests |
| Capability escapes staging root | Medium | Opaque locators, containment/symlink checks, consumer revalidation |
| Retained failures expose data | Medium | Configurable bounds, safe metadata, explicit cleanup |
| Breaking v1 rejection surprises clients | High | Stable version error and coordinated release |

## Rollback Plan

Revert each chain slice independently. Restore prior transport only before contract release; reversing released v1 rejection needs approval. Remove staged payloads through cleanup.

## Dependencies

- Approved Import lifecycle documentation.
- Staging-root and retention bounds resolved in design/specs.

## Success Criteria

- [ ] Transport tests prove fragmented/coalesced frames, silence, malformed data, termination, and restart cleanup.
- [ ] v1 clients receive the stable rejection; v2 payloads never send source bytes or absolute paths in JSON.
- [ ] macOS tests prove staging and cleanup across restart and retention expiry.
- [ ] Validation and bounded recoverable-failure retention align across Swift and TypeScript.
- [ ] No state beyond `ProcessingQueued` and no persistence or registration claim is introduced.
