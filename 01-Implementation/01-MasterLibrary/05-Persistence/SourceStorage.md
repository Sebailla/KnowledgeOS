# Master Library Source Storage

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Source Storage

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative storage model for Publication source binaries.

A Source represents the original binary document from which every other representation is derived.

Examples include:

* PDF
* EPUB
* CBZ
* CBR
* MOBI
* DOCX
* HTML Archive
* Markdown Package
* ZIP Package
* TIFF Collection

The Source Storage service is responsible for preserving those binaries with deterministic identity, immutable versioning and recoverable storage semantics.

---

# 2. Responsibilities

Source Storage is responsible for:

* storing authoritative publication binaries;
* preserving binary integrity;
* versioning source files;
* exposing immutable SourceVersions;
* validating every commit;
* coordinating with Catalog Storage;
* participating in backup and restore;
* supporting reconciliation;
* exposing binary metadata;
* guaranteeing long-term recoverability.

Source Storage is **not** responsible for:

* metadata extraction;
* OCR;
* search indexing;
* rendering;
* AI processing;
* previews;
* thumbnails;
* annotations.

Those are consumers of Source Storage.

---

# 3. Authority

For every Publication, Source Storage is the authoritative owner of the original binary content.

Catalog Storage owns only the structured reference.

Search Storage owns only searchable projections.

Render engines own only derived representations.

There is exactly one authoritative binary for every committed SourceVersion.

---

# 4. Fundamental Principles

Source Storage follows these principles:

* immutable binaries;
* append-only version history;
* explicit commit;
* deterministic identity;
* checksum validation;
* recoverable operations;
* filesystem independence;
* storage abstraction;
* no hidden mutations;
* reproducible recovery.

---

# 5. Source Storage Service

The architectural model is:

```text
Publication
        │
        ▼
Source Storage Service
        │
        ▼
SourceVersion
        │
        ▼
Immutable Binary Object
```

The service exposes binary lifecycle operations.

It does not expose filesystem implementation details.

---

# 6. Source Identity

A SourceVersion is uniquely identified by:

```text
PublicationId
+
SourceVersion
```

The binary itself additionally possesses:

* LogicalStorageKey
* StorageSpace
* ChecksumAlgorithm
* ChecksumValue
* ByteLength
* MediaType
* CanonicalExtension

These values are immutable after commit.

---

# 7. Binary Identity

The following shall **never** be considered identifiers:

* original filename;
* directory name;
* NAS path;
* user-visible title;
* imported provider identifier.

Those are descriptive metadata only.

---

# 8. Source Lifecycle

Every SourceVersion progresses through the following lifecycle:

```text
Acquired
        │
        ▼
Validated
        │
        ▼
Normalized
        │
        ▼
Prepared
        │
        ▼
Committed
        │
        ▼
Current
        │
        ▼
Superseded
        │
        ▼
Archived
        │
        ▼
Deleted
```

Not every SourceVersion reaches every state.

---

# 9. Acquisition

Acquisition creates an operational binary candidate.

At this stage:

* the binary is not authoritative;
* the Catalog does not reference it;
* the file may still be rejected;
* no current SourceVersion changes.

---

# 10. Validation

Validation verifies:

* readable binary;
* supported media type;
* byte length;
* checksum generation;
* corruption detection;
* storage policy compliance.

Validation failure prevents commit.

---

# 11. Normalization

Normalization prepares the binary for long-term storage.

Examples:

* canonical extension;
* normalized media type;
* filename preservation metadata;
* storage key allocation;
* manifest generation.

Normalization never modifies document content.

---

# 12. Prepared State

Prepared indicates:

* binary persisted to staging;
* checksum verified;
* metadata available;
* commit still pending.

Prepared binaries are not authoritative.

---

# 13. Commit

Commit transforms a Prepared binary into an authoritative SourceVersion.

Commit is irreversible.

After successful commit:

* Catalog references the version;
* binary becomes immutable;
* audit is written;
* outbox event is emitted.

---

# 14. Current Version

Exactly one committed SourceVersion may be Current.

Changing the Current version never modifies an existing binary.

It only changes the Catalog reference.

---

# 15. Superseded Version

A Superseded version remains:

* immutable;
* addressable;
* recoverable;
* available for audit.

It is no longer Current.

---

# 16. Archived Version

Archived versions may be moved to slower storage according to policy.

Their identity never changes.

LogicalStorageKey remains stable.

---

# 17. Deleted Version

Deletion is a controlled administrative workflow.

Deletion requires:

* authorization;
* audit;
* retention evaluation;
* backup policy evaluation;
* Catalog coordination.

Immediate physical deletion is prohibited.

---

# 18. Immutable Storage

Committed binaries shall never be modified.

The following operations are prohibited:

* overwrite;
* in-place editing;
* metadata injection;
* recompression;
* filename-based replacement.

Every modification creates a new SourceVersion.

---

# 19. Versioning Model

Source history is append-only.

Example:

```text
Publication

Version 1
Version 2
Version 3
Version 4
```

Historical versions remain available according to retention policy.

---

# 20. Commit Protocol

Every commit executes the following sequence:

```text
Acquire
        │
Validate
        │
Normalize
        │
Checksum
        │
Persist Binary
        │
fsync
        │
Verify
        │
Catalog Commit
        │
Audit
        │
Outbox
        │
Completed
```

Failure at any stage triggers recovery.

---

# 21. Atomicity

Binary persistence and Catalog persistence cannot be made physically atomic.

KnowledgeOS guarantees recoverable consistency through coordinated commit protocols and reconciliation.

No partially committed SourceVersion shall become Current.

---

# 22. Checksum Policy

Every committed SourceVersion records:

* checksum algorithm;
* checksum value;
* byte length.

Recommended algorithm:

```text
SHA-256
```

Checksum values are immutable.

---

# 23. Integrity Verification

Integrity compares:

```text
Catalog

↓

Manifest

↓

Filesystem Object

↓

Checksum
```

All four authorities shall agree.

Mismatch initiates recovery.

---

# 24. Logical Storage Keys

Storage keys are stable logical identifiers.

They are independent from:

* mount points;
* NAS layout;
* operating system;
* filesystem implementation.

Applications never construct filesystem paths manually.

---

# 25. Storage Spaces

Committed sources reside in the Source Storage Space.

Examples:

```text
Sources/
```

Operational workflows additionally use:

```text
Staging/
Recovery/
Quarantine/
Temporary/
```

Only Sources contains authoritative binaries.

---

# 26. Replacement Workflow

Replacing a source executes:

```text
Acquire New Binary

↓

Validate

↓

Commit New SourceVersion

↓

Update Current Reference

↓

Mark Previous Version Superseded
```

Previous binaries remain intact.

---

# 27. Recovery

Recovery addresses:

* interrupted commits;
* missing binaries;
* checksum mismatch;
* orphan binaries;
* orphan catalog entries;
* incomplete imports.

Recovery never guesses missing data.

---

# 28. Backup

Every SourceVersion participates in coordinated Master Library backup.

Catalog and Source Storage backups share a common consistency point.

---

# 29. Restore

Restore validates:

* binary existence;
* checksum;
* logical storage key;
* Catalog references;
* SourceVersion integrity.

Only after successful validation may the restored SourceVersion become authoritative.

---

# 30. Invariants

The following invariants are mandatory:

* committed binaries are immutable;
* exactly one Current SourceVersion exists per Publication;
* Source identity is independent of filename;
* checksums never change;
* logical storage keys never change;
* binary content is never stored in PostgreSQL;
* every committed SourceVersion has a Catalog record;
* every Catalog SourceVersion references exactly one binary;
* reconciliation never modifies binaries silently;
* overwrite operations are prohibited.

---

# 31. Related Documents

* `CatalogDatabase.md`
* `CatalogSchema.md`
* `StorageArchitecture.md`
* `DirectoryLayout.md`
* `CoverStorage.md`
* `AssetStorage.md`
* `Checksums.md`
* `Recovery.md`
* `BackupRestore.md`
* `Integrity.md`

---

# 32. Status

**Approved**

Source Storage is frozen as an immutable, append-only binary storage service with deterministic identity, coordinated commit semantics, recoverable consistency and long-term preservation suitable for the authoritative Master Library.
