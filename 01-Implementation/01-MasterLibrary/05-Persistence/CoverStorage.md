
# Master Library Cover Storage

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Cover Storage

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative storage model for Publication covers.

A Cover represents the canonical visual representation of a Publication.

The Cover Storage service preserves cover binaries using immutable versioning, deterministic identity and recoverable storage semantics.

It defines:

* cover lifecycle;
* cover identity;
* cover versioning;
* cover commit protocol;
* binary integrity;
* validation;
* replacement;
* recovery;
* backup;
* restore;
* retention;
* operational invariants.

---

# 2. Scope

Cover Storage manages every authoritative cover associated with a Publication.

Typical cover formats include:

* JPEG
* PNG
* WebP
* TIFF
* AVIF (future)
* HEIF (future)

The service manages only authoritative cover binaries.

Derived thumbnails, previews and UI caches are outside its scope.

---

# 3. Responsibilities

Cover Storage is responsible for:

* storing authoritative cover binaries;
* preserving immutable cover history;
* exposing CoverVersions;
* validating image integrity;
* coordinating with Catalog Storage;
* participating in backup and restore;
* exposing canonical cover metadata;
* maintaining deterministic identity.

It is not responsible for:

* thumbnail generation;
* UI rendering;
* image enhancement;
* OCR;
* AI image generation;
* cache management.

---

# 4. Architectural Principles

Cover Storage follows these principles:

* immutable cover binaries;
* append-only history;
* explicit commit;
* deterministic identity;
* reproducible recovery;
* filesystem abstraction;
* recoverable consistency;
* authoritative visual representation.

---

# 5. Cover Storage Service

The logical model is:

```text
Publication
        │
        ▼
Cover Storage Service
        │
        ▼
CoverRevision
        │
        ▼
Immutable Cover Binary
```

The service exposes cover lifecycle operations without exposing filesystem implementation details.

---

# 6. Cover Identity

Every CoverRevision is uniquely identified by:

```text
PublicationId
+
CoverRevision
```

Additionally every committed cover has:

* LogicalStorageKey
* StorageSpace
* MediaType
* CanonicalExtension
* Width
* Height
* ByteLength
* ChecksumAlgorithm
* ChecksumValue

These values are immutable after commit.

---

# 7. Cover Origin

Every CoverRevision records its origin.

Approved origins include:

```text
Provided
Extracted
Generated
Imported
Scanned
Recovered
Administrative
```

Origin records provenance.

It does not affect identity.

---

# 8. Canonical Cover

Exactly one committed CoverRevision may be the canonical cover of a Publication.

Changing the canonical cover only changes the Catalog reference.

Existing binaries are never modified.

---

# 9. Cover Lifecycle

The lifecycle is:

```text
Acquired
        │
Validated
        │
Prepared
        │
Committed
        │
Current
        │
Superseded
        │
Archived
        │
Deleted
```

Every transition is explicit.

---

# 10. Acquisition

Acquisition introduces a candidate cover.

Sources include:

* user upload;
* source extraction;
* provider import;
* scanner;
* administrative replacement;
* accepted AI generation.

Acquired covers are not authoritative.

---

# 11. Validation

Validation verifies:

* readable image;
* supported format;
* valid dimensions;
* byte length;
* checksum generation;
* corruption detection.

Invalid images cannot be committed.

---

# 12. Canonical Requirements

A committed cover shall have:

* valid image encoding;
* positive width;
* positive height;
* known media type;
* checksum;
* logical storage key.

Optional metadata includes:

* color profile;
* DPI;
* transparency;
* orientation.

---

# 13. Commit Protocol

Cover commit follows:

```text
Acquire

↓

Validate

↓

Persist Binary

↓

Checksum

↓

Verify

↓

Catalog Commit

↓

Audit

↓

Outbox

↓

Completed
```

Recovery is triggered if any step fails.

---

# 14. Immutable Revisions

Committed CoverRevisions are immutable.

The following values never change:

* binary;
* checksum;
* dimensions;
* media type;
* storage key;
* byte length;
* commit timestamp.

Replacing a cover creates a new CoverRevision.

---

# 15. Generated Covers

KnowledgeOS may generate covers automatically.

Examples:

* first page rendering;
* PDF preview;
* AI composition;
* provider reconstruction.

Generated covers are **not authoritative** until explicitly committed.

---

# 16. Extracted Covers

A cover extracted from a Source follows the same lifecycle.

Extraction does not imply acceptance.

Validation and commit remain mandatory.

---

# 17. Replacement

Replacing a cover performs:

```text
Acquire New Cover

↓

Validate

↓

Commit CoverRevision

↓

Update Current Reference

↓

Supersede Previous Revision
```

Previous revisions remain preserved.

---

# 18. Relationship with Source Storage

Source Storage and Cover Storage are independent.

A Publication may have:

* a Source without a Cover;
* a Cover without a Source (administrative cases);
* multiple historical SourceVersions;
* multiple historical CoverRevisions.

Neither service owns the other.

---

# 19. Integrity Verification

Integrity verifies:

```text
Catalog

↓

Cover Manifest

↓

Filesystem Object

↓

Checksum
```

All four authorities shall agree.

---

# 20. Storage Space

Committed covers reside in:

```text
Covers/
```

Operational processing may additionally use:

```text
Staging/
Recovery/
Temporary/
```

Only `Covers/` contains authoritative binaries.

---

# 21. Recovery

Recovery addresses:

* missing covers;
* checksum mismatch;
* orphan binaries;
* orphan catalog entries;
* interrupted commits.

Recovery never regenerates a committed cover automatically.

If regeneration is desired, it creates a new CoverRevision.

---

# 22. Backup

Every committed CoverRevision participates in coordinated Master Library backup.

Catalog, Sources and Covers share the same consistency point.

---

# 23. Restore

Restore validates:

* binary existence;
* checksum;
* dimensions;
* logical storage key;
* Catalog references.

Only validated revisions become authoritative.

---

# 24. Performance

Cover Storage is optimized for:

* low-latency retrieval;
* immutable reads;
* efficient backup;
* deterministic recovery.

No in-place image transformations occur inside the storage service.

---

# 25. Retention

Historical CoverRevisions are retained according to retention policy.

Administrative cleanup may archive or remove obsolete revisions only after:

* authorization;
* audit;
* backup evaluation;
* retention evaluation.

---

# 26. Invariants

The following invariants are mandatory:

* committed covers are immutable;
* exactly one current CoverRevision exists;
* cover identity never depends on filename;
* logical storage keys never change;
* checksum never changes;
* dimensions never change;
* committed covers are never regenerated;
* replacement always creates a new CoverRevision;
* Cover Storage never stores thumbnails as authoritative assets;
* every committed CoverRevision has a Catalog record;
* every Catalog cover references one committed binary.

---

# 27. Related Documents

* `StorageArchitecture.md`
* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `AssetStorage.md`
* `Checksums.md`
* `Recovery.md`
* `BackupRestore.md`
* `Integrity.md`

---

# 28. Status

**Approved**

Cover Storage is frozen as an immutable, append-only storage service for authoritative publication covers, providing deterministic identity, explicit versioning, recoverable consistency and long-term preservation independent of Source Storage while sharing the same architectural persistence model.
