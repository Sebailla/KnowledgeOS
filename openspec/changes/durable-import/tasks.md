# Tasks: Durable Import Boundary

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 900–1,250 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 transport → PR 2 contract/host → PR 3 macOS staging |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Reliable framed bridge transport | PR 1, base=tracker | `swift test --package-path apple/Packages/KnowledgeOSCoreBridge` | fixture Core subprocess: fragmented/silent/restart | `ProcessTransport.swift` + transport tests |
| 2 | v2 contract, host validation, and lease | PR 2, base=PR 1 branch | `pnpm --filter @knowledgeos/macos-core-host build && pnpm --filter @knowledgeos/macos-core-host test` | temporary-root CoreRouter request/release | contracts, resolver, router, manager tests |
| 3 | macOS staging and cleanup boundary | PR 3, base=PR 2 branch | `swift test --package-path apple/Apps/macOS` | security-scoped import to queue, then lease release | staging service, import UI/VM, macOS tests/docs |

## Phase 1: Transport Slice (PR 1)

- [x] 1.1 **RED:** Add failing `TransportBridgeTests.swift` cases for fragmented/coalesced frames, malformed-buffer reset, timeout, termination, cancellation/write failure, and restart failure fan-out.
- [x] 1.2 **GREEN:** Update `ProcessTransport.swift`, `Bridge.swift`, and `ImportModels.swift` with one-reader framing, typed deadlines/failures, empty replacement state, and ordered exactly-once settlement.
- [x] 1.3 **REFACTOR:** Simplify transport ownership without changing tests; run the Unit 1 command and record the fixture-subprocess result.

## Phase 2: Contract and Core Host Slice (PR 2)

- [x] 2.1 **RED:** Add `packages/contracts/src/import.ts` fixtures and `apps/macos-core-host/test/import-router.test.ts` cases for v1/missing-version rejection, path/bytes omission, traversal, an explicit validation-to-open symlink swap, non-regular file, checksum mismatch, malformed sidecar, and expiry: all fail closed without queueing/ownership transfer.
- [x] 2.2 **GREEN:** Export v2 request/error/state/lease DTOs from `packages/contracts/src/{import,index}.ts`; add `stagedSourceResolver.ts`, update `router.ts` and `ImportJobManager.ts` for no-follow root revalidation, atomic lease recording, idempotent release, and `ProcessingQueued` only.
- [x] 2.3 **REFACTOR:** Share the canonical v2 JSON fixture declared in `packages/contracts/src/import.ts` with `ImportModels.swift` through a Swift decoding compatibility test; preserve safe logs (no bytes, capabilities, or paths), then run Unit 2 verification.

## Phase 3: macOS Staging Slice (PR 3)

- [x] 3.1 **RED:** Add `ImportStagingServiceTests.swift` and `ImportViewModelTests.swift` cases for chunked hash/atomic staging, restart cleanup, successful cleanup, bounded recoverable retention, and accepted files surviving cleanup until explicit release.
- [x] 3.2 **GREEN:** Create `ImportStagingService.swift`; update `ImportView.swift`, `ImportViewModel.swift`, and `ReleaseEnvironment.swift` to issue opaque root-confined capabilities and clean only macOS-owned entries.
- [x] 3.3 **REFACTOR:** Keep staging metadata content-free; run Unit 3 security-scoped harness proving `ProcessingQueued` → readable lease → deletion on release.

## Phase 4: Traceability and Final Verification

- [x] 4.1 Update `01-Implementation/08-ImportAndAcquisition/{02-TechnicalDesign/ImportPipeline.md,04-Contracts/ImportSourceCommand.md,05-Persistence/StagingArea.md}` with v2 rejection, lease ownership, retention, and the `ProcessingQueued` boundary.
- [x] 4.2 Run `pnpm typecheck`, `pnpm test`, both Swift package commands, and verify no durable persistence, registration, parsing, streaming IPC, or state after `ProcessingQueued` was introduced.
