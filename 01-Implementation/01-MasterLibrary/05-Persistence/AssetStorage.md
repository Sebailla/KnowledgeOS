# Master Library Asset Storage

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Asset Storage

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative storage model for Assets managed by the KnowledgeOS Master Library.

An Asset is an immutable binary resource associated with one or more Knowledge Objects that is **not** the primary source document and **not** the canonical publication cover.

Typical Assets include:

* embedded images;
* standalone images;
* audio files;
* videos;
* attachments;
* datasets;
* archives;
* supplementary material;
* diagrams;
* vector graphics;
* presentation files;
* spreadsheets;
* executable examples;
* research material.

The Asset Storage service preserves these binaries using deterministic identity, immutable versioning and recoverable storage semantics.

---

# 2. Scope

Asset Storage manages every authoritative binary object classified as an Asset.

It defines:

* asset identity;
* asset versioning;
* lifecycle;
* commit protocol;
* binary integrity;
* relationships;
* replacement;
* archival;
* backup;
* recovery;
* retention.

Derived files generated from Assets are outside the scope of this service.

---

# 3. Responsibilities

Asset Storage is responsible for:

* storing authoritative Asset binaries;
* preserving version history;
* exposing immutable AssetVersions;
* validating binary integrity;
* coordinating with Catalog Storage;
* supporting backup and restore;
* maintaining provenance;
* exposing canonical binary metadata.

It is not responsible for:

* rendering;
* preview generation;
* thumbnail generation;
* OCR;
* AI processing;
* indexing;
* search projection.

---

# 4. Architectural Position

The binary storage layer consists of three independent authoritative services:

```text
Source Storage
        │
Original publication content

Cover Storage
        │
Canonical visual representation

Asset Storage
        │
Auxiliary authoritative binaries
```

None of these services owns the others.

Each has independent lifecycle and version history.

---

# 5. Asset Storage Service

Logical model:

```text
Knowledge Object
        │
        ▼
Asset Storage Service
        │
        ▼
Asset
        │
        ▼
AssetVersion
        │
        ▼
Immutable Binary Object
```

The service manages Asset binaries independently from the domain objects that reference them.

---

# 6. Asset Identity

Every Asset possesses a stable identity:

```text
AssetId
```

Each immutable binary version is identified by:

```text
AssetId
+
AssetVersion
```

Additional immutable attributes include:

* LogicalStorageKey
* StorageSpace
* MediaType
* CanonicalExtension
* ByteLength
* ChecksumAlgorithm
* ChecksumValue

---

# 7. Asset Categories

Examples include:

```text
Image

Audio

Video

Dataset

Archive

Spreadsheet

Presentation

Diagram

VectorGraphic

BinaryAttachment

SourceCode

Model

Other
```

Categories classify the Asset.

They do not determine storage behavior.

---

# 8. Asset Ownership

Assets are independent aggregates.

An Asset may be referenced by:

* one Publication;
* multiple Publications;
* Collections;
* Notes;
* future Knowledge Objects.

Deleting a reference never implies deleting the Asset.

---

# 9. Asset Relationships

Relationships are maintained through Catalog Storage.

Examples:

```text
Publication

↓

PublicationAsset

↓

Asset
```

Storage never embeds relationship knowledge.

---

# 10. Asset Lifecycle

Lifecycle:

```text
Acquired

↓

Validated

↓

Prepared

↓

Committed

↓

Current

↓

Superseded

↓

Archived

↓

Deleted
```

Each transition is explicit.

---

# 11. Acquisition

Assets may originate from:

* user import;
* provider import;
* extraction;
* synchronization;
* manual creation;
* plugin;
* automation.

Acquisition creates an operational candidate.

The Asset is not authoritative until committed.

---

# 12. Validation

Validation verifies:

* readable binary;
* supported media type;
* byte length;
* checksum generation;
* storage policy compliance;
* corruption detection.

Failure prevents commit.

---

# 13. Commit Protocol

Commit sequence:

```text
Acquire

↓

Validate

↓

Normalize

↓

Persist Binary

↓

fsync

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

Partial commits are prohibited.

---

# 14. Immutable Versioning

Committed AssetVersions are immutable.

Replacing an Asset always creates:

```text
AssetVersion + 1
```

Existing binaries are never modified.

---

# 15. Current Version

Exactly one AssetVersion may be designated as Current.

Changing Current updates Catalog references only.

Binary contents remain unchanged.

---

# 16. Binary Metadata

Every committed AssetVersion records:

* media type;
* extension;
* checksum;
* checksum algorithm;
* byte length;
* logical storage key;
* creation time;
* commit time.

Optional metadata may include:

* dimensions;
* duration;
* codec;
* color space;
* page count.

---

# 17. Logical Storage Keys

Storage keys are implementation-independent.

Applications never construct filesystem paths.

Storage keys remain stable throughout the Asset lifetime.

---

# 18. Storage Spaces

Committed Assets reside in:

```text
Assets/
```

Operational workflows may additionally use:

```text
Staging/

Recovery/

Temporary/

Quarantine/
```

Only the Assets storage space contains authoritative Asset binaries.

---

# 19. Deduplication

KnowledgeOS may detect duplicate binary content using checksums.

Deduplication is an implementation optimization.

It shall never modify Asset identity.

Two Assets with identical binaries remain different Assets if their identities differ.

---

# 20. Shared Assets

The same Asset may be referenced by multiple objects.

Examples:

* shared illustration;
* institutional logo;
* common dataset;
* shared attachment.

Reference count does not determine ownership.

---

# 21. Replacement

Replacement workflow:

```text
Acquire New Binary

↓

Validate

↓

Commit New Version

↓

Update Current

↓

Supersede Previous Version
```

Historical versions remain available.

---

# 22. Deletion

Deletion requires:

* authorization;
* audit;
* dependency analysis;
* retention evaluation;
* backup evaluation.

Physical deletion is never immediate.

---

# 23. Recovery

Recovery addresses:

* interrupted commits;
* orphan binaries;
* missing binaries;
* checksum mismatch;
* inconsistent catalog references.

Recovery never invents missing Assets.

---

# 24. Backup

Every committed AssetVersion participates in coordinated Master Library backup.

Consistency is shared with:

* Catalog Storage;
* Source Storage;
* Cover Storage.

---

# 25. Restore

Restore validates:

* binary existence;
* checksum;
* logical storage key;
* catalog references.

Only validated AssetVersions become authoritative.

---

# 26. Performance

Asset Storage is optimized for:

* immutable reads;
* efficient streaming;
* deterministic recovery;
* scalable backup;
* concurrent access.

In-place modification is prohibited.

---

# 27. Retention

Historical AssetVersions follow retention policy.

Archival never changes identity.

Deletion never bypasses audit.

---

# 28. Security

Asset Storage does not enforce business authorization.

Authorization is delegated to:

* Kernel;
* Security services;
* Catalog relationships.

Storage validates only binary integrity and storage invariants.

---

# 29. Failure Modes

Possible failures include:

* interrupted write;
* missing binary;
* checksum mismatch;
* filesystem corruption;
* storage exhaustion;
* unavailable storage device;
* catalog inconsistency.

Every failure transitions through operational recovery.

---

# 30. Operational Limits

The service shall support:

* millions of Assets;
* concurrent readers;
* concurrent imports;
* streaming access;
* background verification;
* incremental backup.

Capacity planning is defined independently from filesystem implementation.

---

# 31. Invariants

The following invariants are mandatory:

* committed AssetVersions are immutable;
* Asset identity never depends on filename;
* logical storage keys never change;
* checksums never change;
* every committed AssetVersion has one Catalog record;
* every Catalog AssetVersion references one binary;
* overwrite operations are prohibited;
* replacement creates a new version;
* Assets remain independent aggregates;
* shared Assets are never duplicated solely because of multiple references;
* binary content is never stored inside PostgreSQL;
* recovery never modifies committed binaries silently.

---

# 32. Related Documents

* `StorageArchitecture.md`
* `DirectoryLayout.md`
* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `Checksums.md`
* `Integrity.md`
* `Recovery.md`
* `BackupRestore.md`

---

# 33. Status

**Approved**

Asset Storage is frozen as the authoritative service for auxiliary binary resources, providing immutable versioning, deterministic identity, recoverable consistency, independent aggregate ownership and long-term preservation while sharing the architectural persistence model established for Source Storage and Cover Storage.
