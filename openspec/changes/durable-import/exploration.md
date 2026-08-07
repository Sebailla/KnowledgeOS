## Exploration: durable-import

### Current State

The current macOS import path sends whole-file text as `content: String` through the newline-delimited JSON Core protocol. Swift `ImportJobDTO.Input`, `CoreBridge`, the Core Host router, and `ImportJobManager` all encode that prototype contract. `ImportJobManager` stores jobs and checksums only in memory, derives format primarily from filename/media type, and marks work `completed` without durable source registration or Library membership.

`CoreProcessController` now buffers stdout until a newline, so fragmented frames are conceptually supported and coalesced frames remain in `responseBuffer`. However, the configured timeout is unused, reads are synchronous, the buffer is not reset on stop, and existing tests exercise only a mock `CoreTransport`; they do not test real framing, malformed frames, silence, termination, or restart cleanup.

The normative import lifecycle ends at `ProcessingQueued` (`Requested` → `Staged` → `Validating` → `ReadyToRegister` → `Registered` → `ProcessingQueued`, with explicit failure/recovery states). The roadmap's additional `Ready` state is not currently authorized for Import. Likewise, the roadmap's “migration” of in-memory job records has no durable records to migrate; compatibility is instead a versioned wire-decoding concern.

### Affected Areas

- `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/ProcessTransport.swift` — line framing, bounded timeout, termination, buffer reset, and test seams.
- `apple/Packages/KnowledgeOSCoreBridge/Tests/KnowledgeOSCoreBridgeTests/` — concrete transport/framer coverage rather than mock-only bridge coverage.
- `apple/Apps/macOS/Sources/KnowledgeOSMac/ApplicationBootstrapper.swift` and lifecycle tests — failed-start and repeated start/stop cleanup evidence.
- `packages/contracts/src/` — authoritative versioned staged-source and import-operation DTOs; no import contract exists there today.
- `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/ImportModels.swift` and `Bridge.swift` — Swift mirror and transport mapping for the versioned descriptor.
- `apps/macos-core-host/src/router.ts` and contract tests — validate protocol version and descriptor fields at the host boundary.
- `packages/import/src/jobs/ImportJobManager.ts` — prototype boundary to retire or adapt behind the new contract, not extend as persistence.
- `01-Implementation/08-ImportAndAcquisition/04-Contracts/` and `02-TechnicalDesign/` — align the executable contract with approved ownership and lifecycle language.

### Approaches

1. **Staged-file capability contract (recommended)** — macOS streams the selected file into an app-owned per-operation staging area, then sends a versioned descriptor containing stable identities, idempotency key, byte length, SHA-256, media evidence, safe provenance, and an opaque staging locator resolved only inside the trusted staging root.
   - Pros: bounded memory; preserves original bytes; fits the offline macOS-first scope; supports restart/recovery; keeps arbitrary absolute paths and bytes out of JSON; simpler than streaming IPC.
   - Cons: requires staging ownership, path-containment/symlink defenses, retention rules, and checksum revalidation by the consumer.
   - Effort: Medium

2. **Streaming IPC contract** — add a binary-capable side channel with framing, backpressure, cancellation, and resumable transfer semantics.
   - Pros: avoids shared-path capabilities and can generalize to remote or sandbox-separated clients.
   - Cons: substantially expands Phase 0 transport scope; needs a second protocol, flow control, recovery checkpoints, and more cross-language testing before durable persistence exists.
   - Effort: High

3. **Extend the current text/in-memory job model** — add fields and Base64 or temporary-path values to `ImportJobManager`.
   - Pros: smallest superficial diff.
   - Cons: violates the binary, bounded-memory, privacy, persistence, recovery, and ownership requirements; preserves a false `completed` state and creates migration debt.
   - Effort: Low initially, High corrective cost

### Recommendation

Use one change with two gated slices. First, complete Phase 0 by extracting a directly testable line-frame reader, enforcing a bounded per-response timeout, classifying malformed/terminated/timed-out responses, resetting transport state on stop, and proving failed-start/restart cleanup. Do not change request semantics until this gate passes.

Then implement Phase 1 as a staged-file capability contract. Define the durable semantic DTOs in `@knowledgeos/contracts` and mirror them in Swift; keep the transport-only opaque staging locator separate from Domain identity and safe provenance. The host must resolve the locator beneath the configured staging root and revalidate size/checksum/content evidence before returning `ReadyToRegister`. Preserve the normative lifecycle through `ProcessingQueued`; represent reader/search readiness through downstream contracts rather than adding Import state `Ready` without architectural approval.

Keep `ImportJobManager` explicitly temporary: do not add journal/database behavior to it and do not claim its `completed` jobs are migratable. During transition, either retain legacy v1 decoding behind an explicit compatibility adapter or reject it with a stable version error; new v2 operations must not report completion before durable registration exists.

### Risks

- Timeout implementation can leak blocked reads or corrupt request/response ordering unless cancellation and buffered bytes are owned by one transport actor.
- A staged locator can become a path-traversal, symlink, TOCTOU, or privacy vulnerability unless it is opaque, root-confined, and revalidated.
- Naming `sourceId` before durable source creation can blur requested identity versus committed identity; contracts should distinguish proposed/staged source identity from registered source identity.
- Backward compatibility can accidentally preserve false `completed` semantics; legacy decoding must not imply durable migration.
- Phase 1 crosses Swift, Core Host, shared contracts, import models, documentation, and tests, so atomic work-unit boundaries are essential.

### Ready for Proposal

Yes. The proposal should scope Phase 0 transport/lifecycle hardening and Phase 1 versioned staged-source contracts, explicitly exclude production persistence, Library registration, reader/search creation, PDF/EPUB parsing, and any persistence extension of `ImportJobManager`. It should also record staged-file capability as the macOS-first choice and flag any new `Ready` lifecycle state as requiring separate architectural approval.
