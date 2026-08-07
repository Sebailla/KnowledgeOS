# Design: Durable Import Boundary

## Technical Approach

Gate 1 hardens `CoreProcessController` with newline framing, deadlines, typed failure fan-out, and reset. Gate 2 replaces import `content` with a v2 staged capability. Core Host validates, accepts a processing lease, and owns cleanup until explicit release. Registration, parsing, and `Ready` remain excluded.

## Architecture Decisions

| Decision | Alternatives | Rationale |
|---|---|---|
| Transport actor owns one reader and pending map | Blocking reads; process per request | Orders frames and settles failures exactly once. |
| v2 opaque token; reject missing/v1 with `IMPORT_CONTRACT_VERSION_UNSUPPORTED` | Adapter; bytes/Base64; path | Enforces the approved breaking, path-free boundary. |
| `KNOWLEDGEOS_IMPORT_DIR/Staging/<token>/source` with safe metadata | Arbitrary temporary URL; durable journal | Enables bounded transient cleanup. |
| Validate and lease one no-follow descriptor | Trust metadata; reopen by path | Containment, file type, size, and hash checks prevent traversal and TOCTOU. |
| Acceptance transfers cleanup ownership; deletion requires explicit lease release | Delete at `ProcessingQueued`; retain macOS ownership | Queueing is not consumption; retention prevents premature deletion. |
| End manager lifecycle at `ProcessingQueued` | Synthetic `completed`; persistence | Preserves the authorized boundary. |

## Data Flow

```text
fileImporter -> ImportStagingService: copy in chunks, hash, atomic rename
ImportStagingService -> CoreBridge: v2 DTO (token + safe metadata)
CoreBridge -> CoreProcessController -> Core Host: framed JSON request
Core Host -> StagedSourceResolver: no-follow open under root, revalidate
StagedSourceResolver -> ImportJobManager: validated source lease
ImportJobManager --> Core Host: ProcessingQueued (lease remains held)
Core Host --> macOS: accepted + cleanup ownership transferred
processor -> Core Host: explicit release(leaseId)
Core Host -> staging root: close descriptor, then delete accepted entry
macOS -> staging root: clean only unaccepted, malformed, or expired entries
```

## File Changes

| File | Action | Description |
|---|---|---|
| `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/{ProcessTransport,Bridge,ImportModels}.swift` and tests | Modify/Create | Transport and v2 bridge behavior. |
| `apple/Apps/macOS/Sources/KnowledgeOSMac/{ImportStagingService,ImportView,ImportViewModel,ReleaseEnvironment}.swift` and tests | Create/Modify | Staging and macOS-owned cleanup. |
| `packages/contracts/src/{import,index}.ts` | Create/Modify | v2 DTOs, lease release, errors, lifecycle. |
| `apps/macos-core-host/src/{stagedSourceResolver,router}.ts` | Create/Modify | Validation, lease registry/release, v1 rejection. |
| `packages/import/src/jobs/ImportJobManager.ts` | Modify | Consume and release leases; stop at `ProcessingQueued`. |
| `01-Implementation/08-ImportAndAcquisition/{02-TechnicalDesign,04-Contracts,05-Persistence}/` | Modify | Align documentation. |

## Interfaces / Contracts

```ts
type StagedImportRequestV2 = Readonly<{
  contractVersion: 2; operationId: string; idempotencyKey: string;
  source: { kind: "staged-file"; capability: string };
  name: string; byteLength: number; sha256: string;
  mediaType?: string; extension?: string; runOCR?: boolean;
}>;
type ImportState = "Staged" | "Validating" | "Rejected" | "Failed" |
  "RecoveryRequired" | "ProcessingQueued";
type ProcessingLease = Readonly<{
  leaseId: string; capability: string; descriptor: number; owner: "core-host";
}>;
interface ProcessingLeaseOwner { release(leaseId: string): Promise<void>; }
```

Acceptance atomically records the Core Host lease before returning `ProcessingQueued`; it does not call `release`. Only explicit release after consumption or terminal abort closes the descriptor and deletes the accepted entry. Release is idempotent. macOS cleanup excludes Core-owned leases. The capability is a high-entropy token, never a path. Logs omit bytes, capabilities, and paths.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Framer/reset; validation; lease ownership, idempotent release, retention | RED-first XCTest/Node tests with temporary roots and clocks. |
| Contract | Swift/TypeScript v2 fixtures; v1 rejection; acceptance and release shapes | Shared JSON fixtures decoded on both sides. |
| Integration | Transport failures; accepted entry survives queueing and macOS cleanup; explicit release deletes it; rejected/malformed/expired entries remain macOS-owned | Fixture subprocess plus filesystem/CoreRouter tests. |
| E2E | Security-scoped file reaches `ProcessingQueued`, remains readable until release, then disappears | macOS harness with staging root. |

## Threat Matrix

| Boundary | Applicability | Design response | Planned RED tests |
|---|---|---|---|
| Documentation-like paths | N/A: no executable-file classification is changed | Import format evidence never controls process execution | None |
| Git repository selection | N/A: no VCS commands | No repository/cwd routing exists | None |
| Commit state | N/A: no VCS automation | No index/worktree behavior exists | None |
| Push state | N/A: no push automation | No destination/ref resolution exists | None |
| PR commands | N/A: no PR automation | No command composition exists | None |

Process RED tests remain mandatory; traversal, symlink swap, non-regular file, checksum mismatch, malformed sidecar, and expiry fail closed without queueing or ownership transfer.

## Migration / Rollout

Ship transport hardening first, then coordinate Swift and Core Host v2. There is no persisted-job migration. `ProcessingQueued` means accepted and Core-owned, not consumed or deletable; explicit lease release ends ownership and authorizes cleanup. macOS owns cleanup only before acceptance and for malformed or expired entries. Rollback after v2 release requires approval because v1 remains rejected.

## Open Questions

None.
