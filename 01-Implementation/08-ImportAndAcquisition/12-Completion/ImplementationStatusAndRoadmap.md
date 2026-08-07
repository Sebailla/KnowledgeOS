# Import and Acquisition — Implementation Status and Roadmap

**Project:** KnowledgeOS  
**Module:** Import and Acquisition  
**Status:** Active implementation plan; not release-ready  
**Scope:** Personal macOS-first local import, followed by iPhone and iPad  
**Last updated:** 2026-08-06

## Purpose

This document preserves the verified implementation state, known gaps and agreed delivery plan for making import a usable end-to-end capability. It is an implementation-status record; it does not amend the frozen architecture.

The authoritative architectural boundary remains [Import Engine](../../../00-Architecture/04-Platform/Import/README.md): Import owns intake, validation, provenance and processing preparation. The Library Engine owns Local Library membership. Import and Personal Knowledge synchronization remain separate.

## Current verified state

### What currently works

- The macOS SwiftUI application can be built and run from the source checkout with a SwiftPM scratch directory outside the checkout.
- The TypeScript workspace dependencies can be installed with pnpm 10.15.0; a `pnpm-lock.yaml` and lockfile attestation were generated in the local checkout.
- The macOS file picker accepts PDF, EPUB, HTML, plain text and Markdown selections.
- The macOS Core Host can receive an import request after the line-framed Core transport correction.
- The current Import Job Manager reports format, checksum, preview and completed job state.

### What does not work yet

- A completed import job does **not** persist original bytes.
- It does **not** create a source record, Local Library membership, library item, reader document or search entry.
- Therefore imported files do not appear in Library, Recent, Reader or Search after import.
- PDF and EPUB are accepted by the picker but are not genuinely parsed, stored or rendered. Encoding binary data as Base64 in a JSON request is not a valid final transport or storage strategy.
- The iOS and iPadOS packages contain SwiftUI code and tests, but no app targets/projects suitable for installation on physical devices.

## Corrections applied during local bring-up

These changes are present in the local checkout and should be retained, reviewed and covered by tests before release.

| Area | File | Correction | Status |
|---|---|---|---|
| macOS lifecycle | `apple/Apps/macOS/Sources/KnowledgeOSMac/KnowledgeOSMacApp.swift` | Initializes `StateObject` through a local model so the app delegate termination closure does not capture mutating `self`. | Applied |
| Deep links | `apple/Apps/macOS/Sources/KnowledgeOSMac/DeepLinkCoordinator.swift` | Corrected the malformed path-component filter. | Applied |
| Annotation bridge | `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/AnnotationModels.swift` | Added the public initializer required by the macOS client for `AnnotationAnchorDTO`. | Applied |
| Failed startup cleanup | `apple/Apps/macOS/Sources/KnowledgeOSMac/ApplicationBootstrapper.swift` | Stops partially initialized services on startup failure, releasing the instance lock. | Applied |
| Core transport | `apple/Packages/KnowledgeOSCoreBridge/Sources/KnowledgeOSCoreBridge/ProcessTransport.swift` | Buffers stdout until a newline-delimited JSON response is complete rather than decoding arbitrary pipe fragments. | Applied; requires automated coverage |

## Local development runbook

From the repository root, use a scratch directory to avoid SwiftPM module-cache write failures observed in the source checkout:

```bash
swift run \
  --package-path apple/Apps/macOS \
  --scratch-path /private/tmp/knowledgeos-macos-build \
  KnowledgeOSMac
```

If an interrupted launch left an instance lock, first close the app and its terminal process, then remove only this generated lock:

```bash
rm "$HOME/Library/Application Support/KnowledgeOS/knowledgeos.lock"
```

This does not delete library content.

## Target end-to-end import flow

```text
User-selected source
  -> create stable import operation
  -> stage immutable bytes
  -> validate signature, size and checksum
  -> detect format from content evidence
  -> persist source record and provenance
  -> Library Engine registers Local Library membership
  -> canonical processing / extraction is queued
  -> document becomes visible in Library and Recent
  -> reader and search consume derived representations
```

An import is only `Completed` when the source is durably registered and its resulting library item is queryable. Extraction may remain pending, but that status must be visible and must not hide the original source.

## Storage model for the personal macOS profile

Use the existing Application Support root. The concrete schema remains an implementation decision, but the responsibilities are fixed:

```text
~/Library/Application Support/KnowledgeOS/
  Imports/Staging/    temporary, recoverable intake payloads
  Library/Sources/    immutable original source bytes, addressed by checksum
  Database/           import journal, source records and local memberships
  Derived/            extracted text, page maps, indexes and render caches
  Logs/               redacted diagnostics
```

- Original bytes are immutable after checksum validation.
- Filesystem paths are provenance, never KnowledgeOS identity.
- Staging can be cleaned only after commit or documented recovery expiry.
- Derived artifacts can be rebuilt; sources, memberships and user annotations cannot be discarded by cache cleanup.

## Delivery plan

### Phase 0 — Stabilize execution

Complete the Core Host lifecycle and transport fixes before adding storage behavior.

- Add unit/integration tests for split JSON responses, multiple responses in one pipe read, host termination and startup cleanup.
- Preserve a bounded response timeout without decoding partial data.
- Make startup failures show the Core error category and log location.

**Exit criteria:** repeated start/stop/retry cycles do not leave a lock, orphan Core process or malformed-response error.

### Phase 1 — Define durable import contracts

Replace the current text-only `content: String` request model with a binary-capable source descriptor.

- Define an operation ID, source ID, idempotency key, byte size, checksum, detected media type and provenance fields.
- Transfer content through a staged file reference or streaming protocol; do not send Base64 payloads through the line-delimited Core protocol.
- Define explicit states: `Requested`, `Staged`, `Validating`, `ReadyToRegister`, `Registered`, `ProcessingQueued`, `Ready`, and failure/recovery states.
- Version bridge and Core Host contracts; add migration behavior for existing in-memory job records.

**Exit criteria:** a selected file can be staged and validated without loading the entire file into memory or relying only on its extension.

### Phase 2 — Persist sources and Local Library registration

Implement the durable journal and repositories, then connect Import to Library through an explicit contract.

- Copy or atomically move staged bytes into checksum-addressed source storage.
- Persist import operation, provenance, checksum and source record transactionally.
- Have the Library Engine create device-local membership only after validation commits.
- Show duplicate evidence to the user; never merge distinct sources automatically.
- Ensure retries reuse the operation/idempotency key and do not create a second source or membership.

**Exit criteria:** a completed import survives restart and appears once in Library and Recent.

### Phase 3 — First usable vertical slice: TXT, Markdown and HTML

Deliver complete personal offline import for text formats before binary publishing formats.

- Extract normalized text and title metadata.
- Create the reader document and local search record.
- Open the imported item from Library, retain reading position and support annotations.
- Support delete, reimport and error presentation without deleting source bytes unexpectedly.

**Exit criteria:** import a text file, close/reopen the app, find it in Library and Search, read it offline, annotate it and export it.

### Phase 4 — PDF and EPUB

Add source-faithful binary import without weakening the prior slice.

- PDF: validate PDF structure, copy bytes unchanged, extract metadata/text with PDFKit where possible, create page/anchor mappings and use an explicit OCR-pending state for scanned documents.
- EPUB: validate archive structure safely, extract manifest and resources, preserve the original archive and build derived reflow content.
- Keep partial extraction non-canonical and visible as processing status.

**Exit criteria:** PDF and EPUB appear in Library, open offline, preserve original bytes and provide search when extraction is available.

### Phase 5 — Recovery, performance and operations

- Implement cancellation, resume checkpoints, storage-limit handling, corrupt-source quarantine and cleanup retention.
- Stream large files, use bounded memory and publish progress by bytes and stage.
- Add redacted logs, operation IDs and import diagnostics.
- Document backup and restore for source bytes, journal and membership data.

**Exit criteria:** interrupted imports resume or fail safely without duplicates; large-file tests meet the agreed memory and responsiveness limits.

### Phase 6 — NAS acquisition and mobile clients

- Treat NAS-to-device transfer as explicit acquisition, never as Personal Knowledge synchronization.
- Add iOS/iPadOS app targets, signing setup and device file-picker/share-extension integration.
- Reuse the versioned import contracts and persistence semantics from macOS.

**Exit criteria:** the same import matrix passes on macOS, iPhone and iPad; already available local sources remain readable offline.

## Acceptance matrix

| Capability | Phase | Required evidence |
|---|---:|---|
| Core retry is reliable | 0 | lifecycle and transport tests |
| Text import appears in Library | 3 | macOS end-to-end test and restart test |
| Source bytes/provenance are preserved | 2 | checksum and repository integration tests |
| Duplicate import is explicit and idempotent | 2 | repeat-import test |
| PDF/EPUB are usable | 4 | reader, extraction and original-byte integrity tests |
| Interrupted imports recover | 5 | recovery and cleanup tests |
| NAS acquisition remains separate from sync | 6 | contract and end-to-end tests |
| iPhone/iPad physical-device import works | 6 | device acceptance evidence |

## Validation requirements

- TypeScript package, Core Host router, persistence and import-contract tests.
- Swift Core Bridge and macOS UI tests, including binary source handoff and transport framing.
- End-to-end tests for import-to-library-to-reader-to-search.
- Recovery tests for process termination, revoked security scope, checksum mismatch and storage failure.
- PDF/EPUB corpus tests, including malformed and password-protected inputs.
- Privacy review: content and source paths must not appear in logs.

## Non-goals for the first usable release

- Automatic folder scanning.
- Remote OCR or cloud AI processing.
- Automatic NAS publication or synchronization after local import.
- Mobile delivery before macOS local import is reliable.

## Open decisions

1. Choose the durable local database and migration strategy for import journal, sources and Local Library membership.
2. Define the versioned binary handoff between macOS and the Node Core Host: staged-path capability versus streaming IPC.
3. Confirm PDF text extraction and rendering ownership between the Core Host and native macOS layer.
4. Define retention/cleanup policy for failed staging payloads.
5. Decide when a personal local source may be intentionally published to the NAS Master Library; this must remain an explicit separate workflow.

## Next executable work item

Implement Phase 0 tests and complete Phase 1 contract design. Do not extend the current in-memory `ImportJobManager` as if it were persistence: it is a prototype and cannot satisfy the required source, membership, recovery or reader guarantees.
