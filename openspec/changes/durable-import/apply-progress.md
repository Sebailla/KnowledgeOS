# Apply Progress: Durable Import Boundary

## Completed Work Units

### PR 1 / Phase 1: Reliable framed bridge transport

- [x] 1.1 RED: Added transport subprocess tests for fragmented/coalesced frames, malformed reset, timeout, termination, cancellation, unavailable write path, and restart fan-out.
- [x] 1.2 GREEN: Made `CoreProcessController` the sole stdout reader and pending-request owner. It frames JSON Lines, settles requests once in order, applies deadlines, and clears all state on terminal failure or replacement. Added `CoreBridgeError.cancelled`.
- [x] 1.3 REFACTOR: Centralized failure cleanup in `finishTransport`; no contract-v2 or staging work was introduced.

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 1.1 | `TransportBridgeTests.swift` | Integration | 16/16 passing | Failing compile: missing `.cancelled` | 8/8 transport tests passing | Fragmented/coalesced plus six failure paths | Clean fixture helpers |
| 1.2 | `TransportBridgeTests.swift` | Integration | 16/16 passing | Tests written before controller rewrite | 8/8 transport tests passing | Ordered two-request framing and reset/restart paths | Shared settlement/cleanup path |
| 1.3 | `TransportBridgeTests.swift` | Integration | 8/8 transport tests passing | Approval suite preserved | 8/8 transport tests passing | Full package: 23/23 passing | `finishTransport` owns all teardown |

## Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `swift test --package-path apple/Packages/KnowledgeOSCoreBridge` — exit 0; 23 tests passed |
| Runtime harness | Fixture `/bin/sh` Core subprocesses within `TransportBridgeTests`: fragmented/coalesced, silent, terminated, malformed, cancellation, unavailable write, and restart scenarios — 8/8 passed |
| Rollback boundary | Revert `ProcessTransport.swift`, the `.cancelled` enum case in `Bridge.swift`, and `TransportBridgeTests.swift`; no contract, host, staging, or persistence files changed |

## Scope and Deviations

`ImportModels.swift` is intentionally unchanged: its v2 staged-source DTO work is Phase 2 and changing it in PR 1 would violate the chain boundary. Transport failure typing belongs to `CoreBridgeError`.

### PR 2 / Phase 2: Contract and Core Host Slice

- [x] 2.1 RED: Replaced text-content router tests with v2-boundary tests for legacy/missing versions, path/bytes omission, traversal, a deterministic source-to-symlink swap after validation and before open, non-regular sources, checksum mismatch, malformed metadata, and expiry; each rejection retains zero leases.
- [x] 2.2 GREEN: Added public v2 contract DTOs, a root-confined no-follow resolver, atomically held leases, explicit idempotent release, and a Core Host route that returns only `ProcessingQueued` after validation.
- [x] 2.3 REFACTOR: Added a canonical v2 JSON fixture and a Swift test that reads that exact TypeScript declaration and decodes it into the Swift DTO; validation errors contain no source bytes, capabilities, or filesystem paths.

## TDD Cycle Evidence — PR 2

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 2.1 | `apps/macos-core-host/test/import-router.test.ts` | Integration | Baseline host build passed; package script discovered 0 compiled tests | Resolver test compilation failed because the validation-to-open test seam did not exist | 4/4 focused tests passed | Eight rejection vectors plus valid queue/release, including a deterministic post-validation symlink swap | Kept the no-follow open as the production guard; the seam is test-only control flow |
| 2.2 | `apps/macos-core-host/test/import-router.test.ts` | Integration | Same baseline | Tests referenced missing resolver | 3/3 focused tests passed | Valid lease/release and invalid non-transfer paths | Resolver owns no-follow and lease lifecycle |
| 2.3 | `ImportBridgeTests.swift` | Contract | Existing Core Bridge package tests run in focused verification | New cross-language fixture decoder initially failed before the literal was decoded as a JSON fragment | Swift `ImportBridgeTests` 2/2 and package 24/24 passed | Swift reads the exact `STAGED_IMPORT_V2_FIXTURE_JSON` declaration from TypeScript and decodes every required v2 field | Shared DTO vocabulary; no sensitive logs |

## Work Unit Evidence — PR 2

| Evidence | Result |
|---|---|
| Focused test command | `pnpm --filter @knowledgeos/macos-core-host build && pnpm exec tsc -p apps/macos-core-host/tsconfig.test.json && node --test apps/macos-core-host/dist-test/test/import-router.test.js` — exit 0; 4/4 host tests passed. `swift test --package-path apple/Packages/KnowledgeOSCoreBridge` — exit 0; 24/24 tests passed. |
| Runtime harness | Temporary-root `CoreRouter` scenario queues a valid source, holds one lease, and performs two successful release calls; the deterministic resolver seam replaces `source` with `/etc/passwd` symlink after validation and before `O_NOFOLLOW` open, then rejects with zero leases. |
| Rollback boundary | Revert the correction in `apps/macos-core-host/src/stagedSourceResolver.ts`, its `import-router.test.ts` proof, and `ImportBridgeTests.swift`; this removes only the PR-2 proof seam and cross-language fixture proof. Do not revert PR 1 transport files. |

### PR 3 / Phase 3: macOS Staging Slice

- [x] 3.1 RED: Added staging-service and view-model tests before the implementation for chunked hashing, atomic staging, restart cleanup, successful cleanup, bounded recoverable retention, and acceptance ownership through explicit release.
- [x] 3.2 GREEN: Added `ImportStagingService` and connected the macOS UI, view model, and release environment to root-confined capabilities and Core-owned-only cleanup. Ownership survives restart via content-free `.core-owned` markers.
- [x] 3.3 REFACTOR: Kept staging metadata content-free and validated the `ProcessingQueued` lifecycle from readable staged lease to deletion on release.

## TDD Cycle Evidence — PR 3

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 3.1 | `ImportStagingServiceTests.swift`, `ImportViewModelTests.swift` | Integration | Existing macOS package tests | Tests written before the staging service and lifecycle integration | Staging and lifecycle tests pass | Atomic staging, retention, restart cleanup, explicit release, and queued lease scenarios | Helpers retain content-free marker semantics |
| 3.2 | `ImportStagingServiceTests.swift`, `ImportViewModelTests.swift` | Integration | Full macOS package: 14/14 passing | Tests required missing staging service and lifecycle behavior | Full macOS package: 14/14 passing | Restart retains Core-owned entries; unowned entries clean up; host uses `Imports/Staging` | Ownership persistence isolated in `.core-owned` marker handling |
| 3.3 | `ImportViewModelTests.swift` | Runtime integration | Focused lifecycle test plus full package | Test preceded the refactoring to content-free metadata | Focused harness: 1/1 passing | `ProcessingQueued` → readable staged source → explicit release deletes staged source | Runtime harness retained as a focused regression test |

## Work Unit Evidence — PR 3

| Evidence | Result |
|---|---|
| Focused test command | `swift test --package-path apple/Apps/macOS --filter ImportViewModelTests/testQueuedImportKeepsItsLeaseReadableUntilRelease` — exit 0; 1/1 test passed. |
| Full macOS regression command | `swift test --package-path apple/Apps/macOS` — exit 0; 14/14 tests passed. |
| Runtime harness | `ImportViewModelTests.testQueuedImportKeepsItsLeaseReadableUntilRelease` verifies `ProcessingQueued` → readable staged source while leased → explicit release deletes the staged source; 1/1 passed. |
| Rollback boundary | Revert `ImportStagingService.swift`, `ImportStagingServiceTests.swift`, the staging changes in `ImportView.swift`, `ImportViewModel.swift`, and `ReleaseEnvironment.swift`, plus the corresponding `ImportViewModelTests.swift` harness; this does not revert PR 1 transport or PR 2 contract/host work. |

## Remaining Tasks

- [x] 2.1 through 3.3 complete.
- [ ] 4.1 through 4.2 remain pending.
