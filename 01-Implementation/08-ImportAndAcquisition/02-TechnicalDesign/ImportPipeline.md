# Durable Import Pipeline

**Project:** KnowledgeOS  
**Section:** Implementation / Import and Acquisition / 02-TechnicalDesign  
**Document:** ImportPipeline  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** macOS Core Host  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the durable-import boundary implemented by the macOS client and Core Host. The boundary accepts a transient, staged source and ends when downstream processing is queued; it does not implement durable import processing.

## 2. Quick Path

1. macOS copies a user-selected source into an app-controlled staging root, computes SHA-256 while copying, and atomically publishes the staged entry.
2. macOS sends an Import Source Command v2 containing only metadata and an opaque capability.
3. The Core Host revalidates the staged entry, holds a processing lease, and returns `ProcessingQueued`; macOS then marks the accepted entry as Core-owned for cleanup.
4. The lease owner explicitly releases the lease; release closes the descriptor and deletes the staged entry.

## 3. Boundary and State

```text
User-authorized source
        ↓
macOS staging (temporary entry)
        ↓
v2 capability handoff
        ↓
Core Host validation and processing lease
        ↓
ProcessingQueued  ← boundary
```

The implemented lifecycle is `Staged → Validating → ProcessingQueued`, with `Rejected`, `Failed`, and `RecoveryRequired` available for failures. `ProcessingQueued` means only that the staged source was validated and queued for a later processor. It MUST NOT imply durable source persistence, Local Library registration or membership, parsing, Reader/Search creation, `Ready`, PDF/EPUB processing, or streaming IPC.

## 4. Versioned Handoff and Rejection

The Core Host SHALL accept only contract version 2. The request SHALL contain a stable operation ID, idempotency key, opaque staged-file capability, source name, byte length, and SHA-256 checksum; media type, extension, and OCR intent are optional metadata.

The JSON request MUST NOT contain source bytes, textual content, or a filesystem path. The Core Host SHALL reject without queueing or ownership transfer when it receives:

- an absent or unsupported contract version, including v1 (`IMPORT_CONTRACT_VERSION_UNSUPPORTED`);
- source bytes, content, or path fields, or malformed required metadata (`INVALID_IMPORT_REQUEST`);
- an invalid capability, root escape, symlink, non-regular file, malformed or expired metadata, failed no-follow open, byte-length mismatch, or checksum mismatch (`STAGED_SOURCE_REJECTED`).

Validation is performed again immediately before opening the source. The Core Host opens a regular file with no-follow semantics and verifies the descriptor-backed bytes, so validation cannot be bypassed by replacing the file between path inspection and read.

## 5. Lease Ownership and Retention

After a successful v2 handoff, the Core Host holds the open descriptor in an atomic processing lease. macOS then transfers cleanup ownership for that accepted capability by marking the entry Core-owned; the staging entry remains readable while the lease exists. Release is idempotent: an unknown or already released lease has no additional effect. A successful release closes the descriptor and deletes the entire staged entry.

macOS cleanup MUST NOT delete a Core-owned entry. On restart, it removes only macOS-owned staging entries. A recoverable failure MAY retain an entry until its configured expiry; cleanup removes expired retained entries and successful non-retained entries are eligible for cleanup immediately. Metadata is content-free and contains only byte length, checksum, and expiry.

## 6. Security and Privacy

- Source access begins only from a user-authorized location.
- The staging root is app-controlled; JSON exposes an opaque capability rather than an absolute path.
- Source bytes, capabilities, and private paths MUST NOT be emitted in logs or telemetry.
- The Core Host treats the staged filesystem entry as untrusted until validation completes.
- The boundary preserves original source bytes transiently only; it does not establish a durable source record.

## 7. Verification

The durable-import tests cover atomic chunked staging and hashing, restart cleanup, bounded recoverable retention, valid v2 acceptance, legacy-version rejection, path/content rejection, root containment, symlink-swap resistance, non-regular files, malformed or expired metadata, checksum mismatch, lease readability, and deletion on explicit release.

## 8. Traceability

- [Import Source Command](../04-Contracts/ImportSourceCommand.md)
- [Staging Area](../05-Persistence/StagingArea.md)
- `packages/contracts/src/import.ts`
- `apps/macos-core-host/src/stagedSourceResolver.ts`
- `apple/Apps/macOS/Sources/KnowledgeOSMac/ImportStagingService.swift`
- `openspec/changes/durable-import/specs/staged-source-import-contract/spec.md`
