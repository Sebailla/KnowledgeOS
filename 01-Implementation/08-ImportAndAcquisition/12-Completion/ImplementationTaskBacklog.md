# Import and Acquisition — Implementation Task Backlog

**Project:** KnowledgeOS  
**Status:** Proposed execution backlog  
**Scope:** macOS personal/offline import first  
**Companion:** [Implementation status and roadmap](ImplementationStatusAndRoadmap.md)  
**Last updated:** 2026-08-06

## Working rules

- Execute tasks in dependency order unless a task explicitly says it can run in parallel.
- A task is not complete without its tests and an updated status in this document.
- Import owns source intake, integrity and provenance. The Library Engine owns Local Library membership.
- Do not send binary source bytes through the line-delimited JSON Core protocol.
- Do not expose a document in Library until source registration and membership commit successfully.

## Milestone M0 — Reliable Core Host

### IMP-001 — Test and harden line-framed Core responses

**Priority:** P0  
**Depends on:** none  
**Scope:** `ProcessTransport` only

Implement a buffered newline-delimited response reader that supports fragmented and coalesced pipe reads. Restore a bounded timeout that does not decode partial JSON.

**Likely files**

- `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/ProcessTransport.swift`
- `apple/Packages/KnowledgeOSCoreBridge/Tests/.../ProcessTransportTests.swift` (new)

**Acceptance criteria**

- A response split across multiple reads decodes once and correctly.
- Two responses in one read are returned in order on consecutive requests.
- Invalid line-delimited JSON maps to a stable bridge error.
- A silent host reaches the configured timeout without leaking a task.

### IMP-002 — Make failed Core startup recoverable

**Priority:** P0  
**Depends on:** IMP-001  
**Scope:** macOS lifecycle and diagnostics

Ensure partially initialized services always stop, the instance lock is removed, the Core process exits and the UI shows the actionable error category plus log path.

**Likely files**

- `apple/Apps/macOS/Sources/KnowledgeOSMac/ApplicationBootstrapper.swift`
- `apple/Apps/macOS/Sources/KnowledgeOSMac/AppModel.swift`
- `apple/Apps/macOS/Sources/KnowledgeOSMac/RootView.swift`
- macOS lifecycle tests

**Acceptance criteria**

- Force a Core Host startup failure; restart succeeds without manually removing `knowledgeos.lock`.
- The app never reports “already running” after its own failed startup.
- The error message does not expose source content or credentials.

### IMP-003 — Repair the monorepo clean-validation graph

**Priority:** P0  
**Depends on:** none  
**Scope:** Turbo/TypeScript build order

Make `pnpm validate` work from a clean checkout. The current `typecheck` dependency graph uses `--noEmit`, while consumers resolve dependent declaration files from `dist`.

**Likely files**

- `turbo.json`
- package TypeScript configurations only if project references are selected
- CI workflow and validation tests

**Acceptance criteria**

- A new checkout can run `pnpm install --frozen-lockfile --ignore-scripts` then `pnpm validate` successfully.
- The selected solution does not hide dependency-order failures through stale `dist` output.

## Milestone M1 — Durable import contract and staging

### IMP-010 — Specify versioned binary import contracts

**Priority:** P0  
**Depends on:** IMP-001  
**Scope:** contract and design; no production persistence yet

Replace the text-only import input with a versioned descriptor for a staged source. Define operation ID, idempotency key, source ID, content evidence, byte size, SHA-256, detected format, provenance, lifecycle state and structured failure categories.

**Likely files**

- `packages/contracts/...` (new or extended import contracts)
- `packages/import/src/model/...`
- `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/ImportModels.swift`
- `01-Implementation/08-ImportAndAcquisition/04-Contracts/...`
- `01-Implementation/08-ImportAndAcquisition/02-TechnicalDesign/...`

**Acceptance criteria**

- Contracts distinguish a staged binary source from derived text.
- Contracts preserve Import/Library ownership boundaries.
- Contract tests cover backward-compatible decoding and unknown optional fields.
- No raw source bytes or filesystem paths are logged by default.

### IMP-011 — Implement macOS security-scoped staging

**Priority:** P0  
**Depends on:** IMP-010  
**Scope:** macOS picker and local filesystem adapter

Copy a selected file into a per-operation staging directory while security-scoped access is active. Stream bytes, calculate SHA-256 during the copy and retain only safe provenance metadata.

**Likely files**

- `apple/Apps/macOS/Sources/KnowledgeOSMac/ImportView.swift`
- `apple/Apps/macOS/Sources/KnowledgeOSMac/ImportViewModel.swift`
- new `StagedImportSource` / staging service
- macOS import tests with temporary files

**Acceptance criteria**

- TXT, HTML, PDF and EPUB stage without Base64 transport.
- Original file bytes in staging match the source SHA-256.
- Revoked access, unreadable input and insufficient disk space produce explicit failures.
- Large inputs are copied in bounded memory.

### IMP-012 — Implement durable import journal

**Priority:** P0  
**Depends on:** IMP-010, IMP-011  
**Scope:** local persistence and migration

Persist import operation state, checkpoints, provenance, checksums and error category. The journal must survive app/Core restart and support idempotent retry.

**Likely files**

- `packages/local-library-sqlite/...` or selected persistence adapter
- `apps/macos-core-host/src/persistence.ts`
- import repositories and migrations
- recovery tests

**Acceptance criteria**

- Restart during staging/validation resumes or fails safely with an explicit recovery state.
- Retrying the same operation does not create a second journal entry or source.
- Schema migration is versioned and tested from an empty and prior database.

### IMP-013 — Detect formats and validate integrity from bytes

**Priority:** P0  
**Depends on:** IMP-011, IMP-012  
**Scope:** Import Engine validation

Implement magic-byte/content-evidence detection, size policy and checksum validation. Filename extension remains a hint only.

**Likely files**

- `packages/import/src/...`
- parser/format registry
- import fixture corpus and tests

**Acceptance criteria**

- Renamed PDFs and EPUBs are detected correctly.
- Invalid or corrupt payloads are rejected without a Library entry.
- Unsupported formats remain explicitly unsupported.

## Milestone M2 — Source registration and Library visibility

### IMP-020 — Persist immutable source records

**Priority:** P0  
**Depends on:** IMP-012, IMP-013  
**Scope:** source store and provenance

Move a validated staged source atomically to checksum-addressed immutable storage and create the source/provenance record.

**Likely files**

- local source storage adapter
- import repository
- Core Host persistence composition
- backup/recovery documentation

**Acceptance criteria**

- A committed source can be verified against its recorded SHA-256 after restart.
- Duplicate checksum evidence is retained; it does not silently merge sources.
- A failed move does not expose partial storage as committed content.

### IMP-021 — Register Local Library membership through the Library contract

**Priority:** P0  
**Depends on:** IMP-020  
**Scope:** Import-to-Library integration

After source registration, call the Library Engine’s public registration contract to create device-local membership and a visible library item. Do not let Import write Library internals directly.

**Likely files**

- `packages/library/...`
- `packages/import/...`
- `apps/macos-core-host/src/router.ts`
- library/import contract and integration tests

**Acceptance criteria**

- A successful import is visible in Library and Recent after restart.
- A failure before membership commit leaves no visible library item.
- Repeating an import follows duplicate policy without duplicate membership.

### IMP-022 — Make import job states truthful in the macOS UI

**Priority:** P1  
**Depends on:** IMP-021  
**Scope:** macOS import experience

Replace the current prototype states with durable lifecycle states, progress, retry and an “Open” action available only after registration.

**Likely files**

- `apple/Apps/macOS/Sources/KnowledgeOSMac/ImportView.swift`
- `apple/Apps/macOS/Sources/KnowledgeOSMac/ImportViewModel.swift`
- bridge DTOs and UI tests

**Acceptance criteria**

- “Completed” means the item is visible and openable.
- Failures include a safe, actionable reason.
- Retry and cancel do not duplicate sources or Library items.

## Milestone M3 — First usable vertical slice: text formats

### IMP-030 — Create reader documents for TXT, Markdown and HTML

**Priority:** P0  
**Depends on:** IMP-021  
**Scope:** processing-to-reader handoff

Generate a versioned derived text representation and register it with the document reader. Preserve the immutable original source separately.

**Likely files**

- `packages/document/...`
- `packages/import/...`
- `apps/macos-core-host/src/documentReaderCatalog.ts`
- reader integration tests

**Acceptance criteria**

- A text import opens from Library while offline.
- Markdown and HTML titles/body are normalized deterministically.
- Reader failures preserve the imported source and report processing state.

### IMP-031 — Index imported text for local search

**Priority:** P1  
**Depends on:** IMP-030  
**Scope:** processing-to-search handoff

Create/update a local search index after processing and rebuild it safely when the derived representation changes.

**Likely files**

- `packages/search/...`
- `apps/macos-core-host/src/localSearchIndex.ts`
- search/import integration tests

**Acceptance criteria**

- An imported text phrase is found after processing completes.
- Search does not index data from failed or unregistered imports.
- Index rebuild does not duplicate results.

### IMP-032 — Validate the complete macOS text workflow

**Priority:** P0  
**Depends on:** IMP-022, IMP-030, IMP-031  
**Scope:** end-to-end evidence

Automate and manually verify: choose TXT/Markdown/HTML, import, restart, find in Library, open, search, annotate, export and delete according to policy.

**Likely files**

- macOS UI/integration tests
- Core Host end-to-end tests
- acceptance checklist and evidence document

**Acceptance criteria**

- The full workflow passes with NAS/network unavailable.
- Original bytes, source identity and annotations remain valid after restart.
- No manual database editing or Core retry is required.

## Later milestones

| Milestone | Scope | Start after |
|---|---|---|
| M4 | PDF/EPUB storage, parsing, page/anchor mappings and OCR-pending workflow | M3 |
| M5 | Cancellation, resume, large-file performance, cleanup and recovery runbooks | M4 core path |
| M6 | Explicit NAS acquisition, separate from Personal Knowledge sync | M5 |
| M7 | iOS/iPadOS Xcode targets, device import/share extension and parity tests | M3, then M4 |

## Suggested first sprint

Implement `IMP-001`, `IMP-002` and `IMP-003` first. They make the build and Core reliable. Then execute `IMP-010` through `IMP-013` before changing Library or reader behavior.

The first user-visible release target is **M3**, not M4: reliable offline import of TXT, Markdown and HTML from macOS into Library, Reader and Search.

