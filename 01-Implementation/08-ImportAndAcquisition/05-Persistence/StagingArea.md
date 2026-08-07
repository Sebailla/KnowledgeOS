# Staging Area

**Project:** KnowledgeOS  
**Section:** Implementation / Import and Acquisition / 05-Persistence  
**Document:** StagingArea  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** macOS Core Host  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the transient, app-controlled staging area used to hand a user-selected source from macOS to the Core Host. The staging area is not durable Local Library storage and does not register a source.

## 2. Entry Layout

Each staged source has an opaque capability and an isolated entry below the staging root:

```text
Staging/
  <capability>/
    source
    metadata.json
    .core-owned           # present only after ownership transfer
```

The entry is published atomically after macOS has copied the source and written metadata. `metadata.json` contains only byte length, SHA-256 checksum, and expiry. It MUST NOT contain source content, an external path, or a user-authorizing bookmark.

## 3. Staging and Validation

macOS reads the user-authorized source in bounded chunks, writes `source` into a temporary entry, computes SHA-256 during the same copy, writes metadata atomically, and renames the completed entry into the staging root. The opaque capability is the only source locator sent in the v2 Import Source Command.

The Core Host revalidates the entry rather than trusting macOS staging: capability format and root containment, metadata parse and expiry, regular-file and non-symlink status, no-follow open, byte length, and checksum. Any failure rejects the command without queueing or taking ownership.

## 4. Ownership, Release, and Cleanup

After the Core Host returns `ProcessingQueued`, macOS transfers cleanup ownership by marking the accepted entry Core-owned. macOS cleanup skips Core-owned entries, including after an application restart. The Core Host holds an open descriptor through a processing lease; `import.release` is the explicit terminal action. Release closes that descriptor and deletes the staging entry. Releasing an unknown or already released lease is safe and has no further effect.

| Entry state | Owner | Cleanup behavior |
|---|---|---|
| Temporary copy | macOS | Removed if staging cannot complete |
| Staged, non-retained | macOS | Eligible for cleanup at expiry (immediately) |
| Recoverable failure | macOS | Retained only until configured bounded expiry |
| Accepted / `ProcessingQueued` | Core Host | Preserved while the lease is held |
| Released | None | Entry deleted by Core Host |

Restart cleanup removes only expired macOS-owned entries. A Core-owned entry is preserved until explicit release; this prevents cleanup from deleting the validated source while downstream processing holds its lease.

## 5. Retention and Privacy

Recoverable failures MAY be retained for the configured retention interval, currently 24 hours by default. Retention expiry deletes the entry and ends retry eligibility. Successful entries that are not Core-owned use immediate expiry. The staging root SHALL use appropriate platform filesystem protection.

Source bytes, absolute paths, and capability tokens MUST NOT appear in logs, telemetry, or durable import journals. The staging area stores source bytes transiently only; no durable source persistence, Local Library registration, parsing, or processing output occurs before or at `ProcessingQueued`.

## 6. Traceability

- [Durable Import Pipeline](../02-TechnicalDesign/ImportPipeline.md)
- [Import Source Command v2](../04-Contracts/ImportSourceCommand.md)
- `apple/Apps/macOS/Sources/KnowledgeOSMac/ImportStagingService.swift`
- `apps/macos-core-host/src/stagedSourceResolver.ts`
- `apple/Apps/macOS/Tests/KnowledgeOSMacTests/ImportStagingServiceTests.swift`
- `openspec/changes/durable-import/specs/staged-source-import-contract/spec.md`
