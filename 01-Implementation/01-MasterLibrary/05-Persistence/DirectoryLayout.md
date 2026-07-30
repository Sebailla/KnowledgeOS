

# Master Library Directory Layout

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Directory Layout

**Version:** 2.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Storage Baseline:** PostgreSQL Authoritative Catalog + NAS Binary Storage

**Deployment Baseline:** Containerized NAS Deployment

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the physical directory, volume and mount layout used by the KnowledgeOS Master Library.

It translates the logical storage architecture into a deterministic filesystem organization suitable for:

* more than two million publications;
* large binary collections;
* PostgreSQL-backed catalog persistence;
* containerized deployment;
* backup;
* recovery;
* staging;
* migrations;
* derived artifacts;
* administrative inspection.

The layout separates PostgreSQL physical storage from the Master Library binary root.

No PostgreSQL internal database file belongs inside the Master Library directory tree.

---

# 2. Scope

This document defines:

* persistent NAS datasets;
* container volume boundaries;
* container mount points;
* Master Library root structure;
* source file paths;
* cover file paths;
* asset file paths;
* staging paths;
* recovery paths;
* manifest paths;
* audit archive paths;
* migration paths;
* backup paths;
* derived storage paths;
* runtime storage paths;
* logical storage keys;
* directory sharding;
* naming rules;
* permissions;
* path invariants;
* validation rules.

---

# 3. Explicit Exclusions

This document does not define:

* PostgreSQL table schemas;
* PostgreSQL internal directory structure;
* database indexes;
* database connection configuration;
* exact container-compose syntax;
* exact NAS vendor dataset configuration;
* backup schedules;
* catalog repository interfaces;
* search index internal formats;
* Reader client storage paths.

These concerns are defined in specialized documents.

---

# 4. Fundamental Separation

The physical deployment contains independent storage roots.

```text
NAS Persistent Storage
│
├── postgres-data/
├── master-library/
├── search-index/
├── backups/
└── runtime/
```

Each root represents a distinct responsibility and failure boundary.

---

# 5. PostgreSQL Data Separation

The PostgreSQL data directory is owned exclusively by PostgreSQL.

Example:

```text
postgres-data/
└── pgdata/
```

The application shall not:

* create files inside `pgdata`;
* inspect PostgreSQL relation files;
* modify PostgreSQL WAL files;
* copy active database files directly;
* treat PostgreSQL internal paths as application paths.

The internal contents of `pgdata` are implementation details of PostgreSQL.

---

# 6. Master Library Root

The authoritative binary and filesystem-managed state resides under:

```text
master-library/
```

The approved root layout is:

```text
master-library/
├── manifest/
├── sources/
├── covers/
├── assets/
├── staging/
├── recovery/
├── audit/
├── migrations/
├── derived/
├── exports/
├── quarantine/
├── lost-and-found/
└── runtime/
```

No database file is stored in this root.

---

# 7. Complete NAS Storage Layout

The recommended physical layout is:

```text
knowledgeos/
├── postgres-data/
│   └── pgdata/
│
├── master-library/
│   ├── manifest/
│   ├── sources/
│   ├── covers/
│   ├── assets/
│   ├── staging/
│   ├── recovery/
│   ├── audit/
│   ├── migrations/
│   ├── derived/
│   ├── exports/
│   ├── quarantine/
│   ├── lost-and-found/
│   └── runtime/
│
├── search-index/
│   ├── active/
│   ├── building/
│   ├── previous/
│   └── runtime/
│
├── backups/
│   ├── catalog/
│   ├── binary/
│   ├── coordinated/
│   ├── manifests/
│   ├── restore-staging/
│   └── verification/
│
└── runtime/
    ├── server/
    ├── workers/
    ├── maintenance/
    └── diagnostics/
```

---

# 8. Logical Volume Mapping

The deployment shall expose separate logical volumes.

| Logical Volume  | Physical Root       | Responsibility                                      |
| --------------- | ------------------- | --------------------------------------------------- |
| PostgreSQL Data | `postgres-data/`  | PostgreSQL-managed catalog files                    |
| Master Library  | `master-library/` | Authoritative binaries and filesystem-managed state |
| Search Index    | `search-index/`   | Derived search data                                 |
| Backup          | `backups/`        | Coordinated backups and restore material            |
| Runtime         | `runtime/`        | Non-authoritative operational state                 |

---

# 9. Recommended Container Mounts

Container mount paths are deployment details.

A recommended mapping is:

| Container          | NAS Root                 | Container Mount              | Access                |
| ------------------ | ------------------------ | ---------------------------- | --------------------- |
| PostgreSQL         | `postgres-data/pgdata` | `/var/lib/postgresql/data` | Read/write            |
| KnowledgeOS Server | `master-library/`      | `/data/master-library`     | Read/write            |
| Search Service     | `search-index/`        | `/data/search`             | Read/write            |
| Maintenance        | `backups/`             | `/data/backups`            | Read/write            |
| Maintenance        | `master-library/`      | `/data/master-library`     | Controlled read/write |
| Workers            | `master-library/`      | `/data/master-library`     | Restricted read/write |
| Server             | `runtime/server/`      | `/data/runtime`            | Read/write            |

Persistent catalog records shall never contain these container mount paths.

---

# 10. Mount-Path Independence

The following paths are operationally equivalent:

```text
/data/master-library
/library
/var/lib/knowledgeos/master-library
```

A deployment may select any mount point.

The catalog stores logical storage keys, not absolute filesystem paths.

---

# 11. Logical Storage Keys

A logical storage key identifies an object inside a storage space.

Examples:

```text
sources/01/9f/4a/<publication-id>/<source-version>/content.pdf

covers/01/9f/4a/<publication-id>/<cover-revision>/cover.webp
```

Logical storage keys:

* are relative;
* use `/` as canonical separator;
* never start with `/`;
* never contain host paths;
* never contain container mount paths;
* never contain traversal segments;
* never contain user-controlled filenames as identity.

---

# 12. Path Resolution

The storage adapter resolves:

```text
StorageSpace + LogicalStorageKey
```

into:

```text
PhysicalStorageRoot + RelativePath
```

Example:

```text
StorageSpace: Sources

LogicalStorageKey:
01/9f/4a/019f4a7c-.../00000001/content.pdf

Resolved container path:
/data/master-library/sources/01/9f/4a/019f4a7c-.../00000001/content.pdf
```

Only Infrastructure performs this resolution.

---

# 13. Identifier-Based Organization

Canonical paths are derived from immutable identifiers.

The layout shall not be based primarily on:

* author name;
* title;
* publication year;
* genre;
* collection name;
* original filename;
* language;
* publisher.

These values may change and are unsuitable as storage identity.

---

# 14. UUID Representation

Identifiers shall use their canonical lowercase textual form without braces.

Example:

```text
019f4a7c-92a7-7e15-bd31-a115629b426a
```

Uppercase identifier path segments are prohibited.

---

# 15. Directory Sharding

A single directory shall not contain millions of entries.

Authoritative object paths shall be sharded.

Recommended publication sharding:

```text
<shard-1>/<shard-2>/<shard-3>/<publication-id>/
```

Where each shard is derived deterministically from the normalized publication identifier.

Example:

```text
PublicationId:
019f4a7c-92a7-7e15-bd31-a115629b426a

Shard path:
01/9f/4a/
```

---

# 16. Shard Algorithm

Version 1 uses the first six hexadecimal characters of the identifier after removing hyphens.

```text
normalized:
019f4a7c92a77e15bd31a115629b426a

shards:
01
9f
4a
```

The complete publication root becomes:

```text
01/9f/4a/019f4a7c-92a7-7e15-bd31-a115629b426a/
```

---

# 17. Shard Stability

The shard algorithm is part of the storage-layout version.

It shall not change silently.

Any future shard transformation requires:

* a new layout version;
* an explicit migration;
* recovery support;
* validation;
* backup;
* audit.

---

# 18. Source Storage Layout

The Sources space stores committed publication source versions.

Canonical structure:

```text
sources/
└── <shard-1>/
    └── <shard-2>/
        └── <shard-3>/
            └── <publication-id>/
                └── <source-version>/
                    ├── content.<extension>
                    ├── source.manifest.json
                    └── checksum.sha256
```

Example:

```text
sources/
└── 01/
    └── 9f/
        └── 4a/
            └── 019f4a7c-92a7-7e15-bd31-a115629b426a/
                └── 00000001/
                    ├── content.pdf
                    ├── source.manifest.json
                    └── checksum.sha256
```

---

# 19. Source-Version Format

SourceVersion directory names use zero-padded decimal format.

Version 1 baseline:

```text
00000001
00000002
00000003
```

This supports deterministic lexical ordering.

The numeric value remains authoritative in Catalog Storage.

---

# 20. Source Filename

The canonical committed source filename is:

```text
content.<canonical-extension>
```

Examples:

```text
content.pdf
content.epub
content.cbz
content.djvu
```

The original filename is stored as metadata in Catalog Storage and, where required, in the source manifest.

---

# 21. Source Manifest

Each committed source version contains:

```text
source.manifest.json
```

The manifest may include:

* PublicationId;
* SourceVersion;
* media type;
* canonical extension;
* original filename;
* byte length;
* SHA-256 checksum;
* creation timestamp;
* commit timestamp;
* ingestion OperationId;
* source provenance reference;
* storage-layout version;
* manifest-format version.

The catalog remains authoritative for structured source state.

---

# 22. Source Checksum Sidecar

Each committed source contains:

```text
checksum.sha256
```

Recommended format:

```text
<lowercase-sha256-hex>  content.pdf
```

The sidecar supports inspection and recovery.

It does not replace the checksum stored in Catalog Storage.

---

# 23. Source Immutability

After a source version reaches committed state:

* `content.*` shall not be modified;
* `source.manifest.json` shall not be rewritten except through an explicit metadata-sidecar migration;
* `checksum.sha256` shall not be modified;
* the source-version directory shall not be reused.

Replacing content creates a new SourceVersion directory.

---

# 24. Cover Storage Layout

The Covers space stores committed cover revisions.

Canonical structure:

```text
covers/
└── <shard-1>/
    └── <shard-2>/
        └── <shard-3>/
            └── <publication-id>/
                └── <cover-revision>/
                    ├── original.<extension>
                    ├── cover.manifest.json
                    └── checksum.sha256
```

Example:

```text
covers/
└── 01/
    └── 9f/
        └── 4a/
            └── 019f4a7c-92a7-7e15-bd31-a115629b426a/
                └── 00000003/
                    ├── original.jpg
                    ├── cover.manifest.json
                    └── checksum.sha256
```

---

# 25. Cover Revision Format

Cover revisions use zero-padded decimal directory names.

```text
00000001
00000002
00000003
```

A new committed cover creates a new immutable revision.

---

# 26. Authoritative and Derived Covers

The authoritative cover revision stores:

```text
original.<extension>
```

Generated variants are stored under `derived/`, not inside the authoritative revision directory.

Examples of derived variants:

* thumbnails;
* resized covers;
* optimized web images;
* grayscale variants;
* blurred placeholders.

---

# 27. Cover Manifest

The cover manifest may include:

* PublicationId;
* CoverRevision;
* media type;
* width;
* height;
* byte length;
* SHA-256 checksum;
* origin;
* creation timestamp;
* commit timestamp;
* OperationId;
* storage-layout version;
* manifest-format version.

---

# 28. Asset Storage Layout

The Assets space stores authoritative auxiliary binary resources.

Canonical structure:

```text
assets/
└── <asset-shard-1>/
    └── <asset-shard-2>/
        └── <asset-shard-3>/
            └── <asset-id>/
                └── <asset-version>/
                    ├── content.<extension>
                    ├── asset.manifest.json
                    └── checksum.sha256
```

Asset paths are based on AssetId, not PublicationId.

---

# 29. Publication-to-Asset Relationships

Publication-to-Asset ownership and relationships are stored in Catalog Storage.

The filesystem layout shall not encode all relationship semantics.

A single asset may be related to one or more domain objects according to the catalog model.

---

# 30. Manifest Root

The Master Library manifest root is:

```text
manifest/
```

Recommended contents:

```text
manifest/
├── master-library.json
├── storage-layout.json
├── server-binding.json
├── compatibility.json
└── history/
```

---

# 31. Master Library Manifest

`master-library.json` identifies the persistent library.

It contains at least:

* MasterLibraryId;
* format version;
* creation timestamp;
* current storage-layout version;
* expected catalog identity;
* deployment compatibility information;
* last validated timestamp.

It shall not contain secrets.

---

# 32. Storage Layout Manifest

`storage-layout.json` defines:

* layout version;
* active sharding algorithm;
* enabled storage spaces;
* canonical relative roots;
* migration state;
* minimum compatible server version;
* optional feature flags.

---

# 33. Server Binding Manifest

`server-binding.json` may record the expected logical ServerId.

It exists to detect accidental mounting of one Master Library into an incompatible server deployment.

The server shall validate the binding against Catalog Storage.

---

# 34. Compatibility Manifest

`compatibility.json` records supported storage and manifest format ranges.

It may be updated by approved migrations.

---

# 35. Manifest History

Historical manifests may be stored under:

```text
manifest/history/
```

Example:

```text
manifest/history/
├── 2026-07-17T201500Z-storage-layout-v1.json
└── 2027-03-04T114200Z-storage-layout-v2.json
```

Historical entries are append-only.

---

# 36. Staging Root

The Staging space is:

```text
staging/
```

Recommended structure:

```text
staging/
├── acquisitions/
├── imports/
├── source-replacements/
├── cover-replacements/
├── assets/
├── migrations/
├── restores/
└── temporary/
```

---

# 37. Operation-Scoped Staging

Each staging operation uses its OperationId.

Example:

```text
staging/
└── acquisitions/
    └── <operation-id>/
        ├── input/
        ├── normalized/
        ├── validation/
        ├── commit/
        └── operation.json
```

---

# 38. Acquisition Staging Layout

Recommended structure:

```text
staging/acquisitions/<operation-id>/
├── input/
│   └── original-upload.bin
├── normalized/
│   └── content.pdf
├── validation/
│   ├── format-report.json
│   ├── checksum.sha256
│   └── metadata.json
├── commit/
│   └── prepared-source.manifest.json
└── operation.json
```

Staging names are operational and not canonical authority.

---

# 39. Import Staging Layout

Bulk imports use batch-scoped directories.

```text
staging/imports/<batch-id>/
├── input/
├── extracted/
├── normalized/
├── reports/
├── checkpoints/
├── failed/
└── batch.json
```

A batch may contain many publication operations.

---

# 40. Staging Durability

Staging may survive process or container restart.

It shall reside on a persistent volume when the operation is recoverable.

Pure process-temporary files may use container-local temporary storage only when they are safely disposable.

---

# 41. Staging Cleanup

Staging cleanup occurs only when:

* the associated operation is completed;
* catalog consistency is verified;
* canonical binaries are verified;
* required audit records exist;
* no recovery marker references the staging path.

Age alone is insufficient to delete active staging.

---

# 42. Recovery Root

The Recovery space is:

```text
recovery/
```

Recommended structure:

```text
recovery/
├── pending/
├── resolved/
├── failed/
├── reconciliation/
└── reports/
```

---

# 43. Pending Recovery Layout

Each unresolved operation has:

```text
recovery/pending/<operation-id>/
├── recovery.json
├── evidence/
├── catalog/
├── binary/
└── checksums/
```

---

# 44. Recovery Record

`recovery.json` may include:

* OperationId;
* operation type;
* affected identities;
* last completed phase;
* expected canonical keys;
* staging keys;
* catalog transaction state;
* recovery strategy;
* retry count;
* creation timestamp;
* last attempt timestamp;
* resolution state.

---

# 45. Recovery Evidence

Recovery evidence may include:

* prepared manifests;
* checksums;
* catalog snapshots relevant to the operation;
* binary existence reports;
* validation output;
* failure diagnostics.

Evidence shall be sufficient to make recovery deterministic.

---

# 46. Resolved Recovery Records

Resolved records move to:

```text
recovery/resolved/<year>/<month>/<operation-id>/
```

Retention is governed by recovery and audit policy.

---

# 47. Failed Recovery Records

Operations requiring manual intervention move to:

```text
recovery/failed/<operation-id>/
```

They shall not be silently deleted.

---

# 48. Reconciliation Root

Reconciliation processes write under:

```text
recovery/reconciliation/
```

Example:

```text
recovery/reconciliation/<run-id>/
├── inventory.json
├── missing-binaries.json
├── orphan-binaries.json
├── checksum-mismatches.json
├── catalog-conflicts.json
└── summary.json
```

---

# 49. Quarantine Root

Invalid or suspicious binaries are moved to:

```text
quarantine/
```

Recommended structure:

```text
quarantine/
├── format-invalid/
├── checksum-failed/
├── malware-suspected/
├── unsupported/
├── identity-conflict/
└── manual-review/
```

---

# 50. Quarantine Identity

Every quarantined object shall retain:

* original OperationId;
* original staging key;
* detected media type;
* checksum;
* reason;
* timestamp;
* related PublicationId when known.

---

# 51. Quarantine Authority

Quarantined objects are not committed publication sources.

They shall not be exposed to Reader clients.

They may be required for manual review or audit.

---

# 52. Lost-and-Found Root

The `lost-and-found/` root stores filesystem objects that cannot be safely mapped to catalog authority.

Recommended structure:

```text
lost-and-found/
├── orphan-sources/
├── orphan-covers/
├── orphan-assets/
├── unknown-layout/
└── manual-review/
```

Objects shall enter this area only through an audited reconciliation or recovery workflow.

---

# 53. Audit Root

Primary audit authority resides in Catalog Storage unless explicitly archived.

The filesystem audit root is:

```text
audit/
```

Recommended structure:

```text
audit/
├── archives/
├── reports/
├── integrity/
├── migrations/
└── administration/
```

---

# 54. Audit Archives

Append-only audit exports may be stored as:

```text
audit/archives/<year>/<month>/
```

Example:

```text
audit/archives/2026/07/audit-2026-07-17.jsonl.zst
```

These archives supplement PostgreSQL audit records.

They do not silently replace active catalog authority.

---

# 55. Integrity Reports

Integrity runs write to:

```text
audit/integrity/<run-id>/
```

Contents may include:

* inventory;
* checksum results;
* missing entries;
* orphan entries;
* permission errors;
* summary;
* signed verification metadata.

---

# 56. Migration Root

The filesystem migration root is:

```text
migrations/
```

Recommended structure:

```text
migrations/
├── pending/
├── active/
├── completed/
├── failed/
└── history/
```

---

# 57. Storage Migration Layout

Each migration uses:

```text
migrations/<state>/<migration-id>/
├── migration.json
├── checkpoints/
├── reports/
├── rollback/
└── artifacts/
```

Database migrations remain managed through the approved PostgreSQL migration system.

---

# 58. Migration Artifacts

Filesystem migration artifacts may include:

* path mappings;
* source inventories;
* copy verification;
* rollback manifests;
* layout conversion reports;
* compatibility snapshots.

---

# 59. Derived Root

Derived artifacts under the Master Library volume reside in:

```text
derived/
```

Recommended organization:

```text
derived/
├── thumbnails/
├── previews/
├── ocr/
├── extracted-text/
├── embeddings/
├── layouts/
├── classifications/
└── caches/
```

The specialized search index remains in the separate `search-index/` volume.

---

# 60. Derived Path Versioning

Derived paths shall encode processor or artifact version.

Example:

```text
derived/thumbnails/v2/
derived/ocr/tesseract-5.4-profile-3/
derived/embeddings/model-abc-v1/
```

The exact naming is defined by each processor contract.

---

# 61. Derived Publication Sharding

Publication-scoped derived artifacts reuse publication sharding.

Example:

```text
derived/previews/v1/
└── 01/
    └── 9f/
        └── 4a/
            └── <publication-id>/
                └── <source-version>/
```

---

# 62. Derived Immutability

A derived artifact may be immutable for a specific processing version.

Reprocessing creates a new versioned output or replaces a disposable cache according to its policy.

Derived immutability does not make the artifact authoritative.

---

# 63. Export Root

Generated exports are stored in:

```text
exports/
```

Recommended structure:

```text
exports/
├── catalog/
├── publications/
├── interoperability/
├── reports/
└── temporary/
```

---

# 64. Export Operation Layout

Exports use OperationId or ExportId.

```text
exports/catalog/<export-id>/
├── output/
├── manifest.json
├── checksum.sha256
└── report.json
```

---

# 65. Export Retention

Exports are derived unless explicitly promoted to archive authority.

They may be deleted according to retention policy.

The catalog shall not rely on an export as its only copy.

---

# 66. Master Library Runtime Root

The Master Library-local runtime root is:

```text
master-library/runtime/
```

It may contain state tightly coupled to the mounted library.

Recommended contents:

```text
master-library/runtime/
├── locks/
├── leases/
├── checkpoints/
└── diagnostics/
```

---

# 67. Global Runtime Root

Deployment-level runtime state resides in:

```text
runtime/
```

Recommended structure:

```text
runtime/
├── server/
├── workers/
├── maintenance/
└── diagnostics/
```

This root is not authoritative publication storage.

---

# 68. Runtime Locks

Filesystem locks may be used only where necessary.

Recommended path:

```text
master-library/runtime/locks/<lock-name>.lock
```

Database advisory locks or durable operation state remain preferred for distributed coordination.

---

# 69. Runtime Cleanup

Runtime files may be removed after:

* confirming no active owner;
* checking lease expiry;
* checking process identity;
* validating associated durable operation state.

Blind cleanup on startup is prohibited.

---

# 70. Search Index Root

The search volume layout is:

```text
search-index/
├── active/
├── building/
├── previous/
└── runtime/
```

---

# 71. Active Search Index

The active index resides under:

```text
search-index/active/<index-family>/<index-version>/
```

Only one version per index family is active unless the Search Service supports multi-version routing.

---

# 72. Building Search Index

Rebuilds occur under:

```text
search-index/building/<build-id>/
```

After validation, activation occurs through an atomic or recoverable switch.

---

# 73. Previous Search Index

The previous validated index may remain under:

```text
search-index/previous/<index-version>/
```

It supports rollback after activation failure.

Retention is operationally bounded.

---

# 74. Search Runtime

Search service runtime data resides under:

```text
search-index/runtime/
```

It is non-authoritative.

---

# 75. Backup Root

The backup volume is:

```text
backups/
```

Approved structure:

```text
backups/
├── catalog/
├── binary/
├── coordinated/
├── manifests/
├── restore-staging/
└── verification/
```

---

# 76. Catalog Backup Layout

PostgreSQL backups reside under:

```text
backups/catalog/<backup-id>/
```

Example:

```text
backups/catalog/2026-07-17T220000Z/
├── catalog.dump
├── postgres-metadata.json
├── checksum.sha256
└── backup-report.json
```

The exact backup payload depends on the approved PostgreSQL backup strategy.

---

# 77. Binary Backup Layout

Binary backups reside under:

```text
backups/binary/<backup-id>/
```

They may contain:

* snapshots;
* incremental archives;
* file inventories;
* checksum manifests;
* filesystem snapshot references.

---

# 78. Coordinated Backup Layout

A complete backup consistency point resides under:

```text
backups/coordinated/<backup-id>/
```

Recommended contents:

```text
backups/coordinated/<backup-id>/
├── backup.manifest.json
├── catalog.reference.json
├── binary.reference.json
├── recovery-state.json
├── compatibility.json
└── checksum.sha256
```

---

# 79. Backup Manifest

The coordinated backup manifest contains:

* BackupId;
* MasterLibraryId;
* ServerId;
* catalog backup reference;
* binary backup reference;
* catalog consistency point;
* binary consistency point;
* unresolved recovery operations;
* storage-layout version;
* database schema version;
* creation time;
* verification state.

---

# 80. Restore Staging

Restore operations use:

```text
backups/restore-staging/<restore-id>/
```

Recommended structure:

```text
backups/restore-staging/<restore-id>/
├── catalog/
├── binary/
├── validation/
├── reports/
└── restore.json
```

Restore staging shall not overwrite active authority before validation and approval.

---

# 81. Backup Verification

Verification reports reside under:

```text
backups/verification/<verification-id>/
```

They may include:

* catalog backup validation;
* binary inventory validation;
* checksum results;
* restore simulation results;
* compatibility checks.

---

# 82. Filename Rules

Canonical filenames shall:

* use lowercase ASCII where predefined;
* avoid whitespace;
* avoid control characters;
* avoid shell-sensitive names where practical;
* avoid user-provided names as canonical identity;
* use explicit extensions;
* remain stable within a layout version.

---

# 83. Directory Name Rules

Directory names shall:

* be deterministic;
* use lowercase for fixed names;
* use canonical identifier formatting;
* use zero-padded decimal revision numbers;
* avoid localized text;
* avoid spaces;
* avoid mutable metadata.

---

# 84. Prohibited Path Segments

Logical storage keys shall reject:

```text
.
..
~
empty segments
backslashes
absolute paths
URI schemes
NUL characters
control characters
```

They shall also reject platform-specific reserved names where relevant.

---

# 85. Symlink Policy

Authoritative storage shall not rely on symbolic links.

Symlinks inside authoritative roots are prohibited by default because they may:

* escape mounted roots;
* break backup assumptions;
* introduce cycles;
* bypass permissions;
* create ambiguous authority.

Any future symlink use requires an explicit architectural decision.

---

# 86. Hard-Link Policy

Hard links are prohibited for authoritative source identity unless explicitly supported by Binary Storage.

Deduplication shall not be implemented implicitly through unmanaged hard links.

---

# 87. Case Sensitivity

Canonical storage keys are case-sensitive and lowercase where defined.

The system shall not create paths that differ only by letter case.

This prevents incompatibility across filesystems.

---

# 88. Unicode Policy

User-provided filenames may be preserved as metadata.

Canonical path components shall not depend on arbitrary Unicode normalization.

Fixed path names and identifiers remain ASCII-compatible.

---

# 89. File Extension Policy

Extensions are derived from validated canonical media types.

They shall not be trusted directly from uploaded filenames.

Examples:

| Media Type                        | Canonical Extension |
| --------------------------------- | ------------------- |
| `application/pdf`               | `.pdf`            |
| `application/epub+zip`          | `.epub`           |
| `application/vnd.comicbook+zip` | `.cbz`            |
| `image/jpeg`                    | `.jpg`            |
| `image/png`                     | `.png`            |
| `image/webp`                    | `.webp`           |

---

# 90. Media-Type Validation

The canonical extension shall agree with validated file content.

A mismatch shall result in:

* normalization;
* quarantine;
* rejection;
* manual review;

depending on policy.

---

# 91. Atomic Commit Layout

Where atomic rename is used, staging and final destination shall reside on the same filesystem.

Recommended flow:

```text
master-library/staging/...
→ validate
→ create canonical parent directory
→ rename into master-library/sources/...
```

Cross-filesystem rename assumptions are prohibited.

---

# 92. Cross-Volume Commit

When staging and destination are on different filesystems, commit requires:

```text
copy
→ flush
→ checksum
→ compare
→ recovery record update
→ catalog commit
→ source cleanup
```

A plain move command is insufficient.

---

# 93. Directory Creation

Canonical parent directories shall be created idempotently.

Concurrent creation of the same shard directories shall not fail the operation.

---

# 94. File Creation Mode

Committed files shall use exclusive creation semantics when possible.

Unexpected preexisting paths shall trigger consistency verification.

They shall not be silently overwritten.

---

# 95. Existing Canonical Path

When a canonical path already exists, the system shall compare:

* expected identity;
* expected length;
* expected checksum;
* manifest identity;
* catalog state.

Possible outcomes:

* idempotent completion;
* duplicate detection;
* conflict;
* corruption;
* manual recovery.

---

# 96. Permissions Model

The NAS and container runtime shall enforce least privilege.

Recommended ownership model:

```text
PostgreSQL service account
    owns postgres-data/

KnowledgeOS service account
    owns master-library/

Search service account
    owns search-index/

Maintenance account
    owns or controls backups/
```

---

# 97. Read and Write Permissions

Recommended policy:

| Root                |           Server |               Workers |       PostgreSQL |             Search |       Maintenance |
| ------------------- | ---------------: | --------------------: | ---------------: | -----------------: | ----------------: |
| `postgres-data/`  | No direct access |                    No |       Read/write |                 No | Backup-controlled |
| `master-library/` |       Read/write | Restricted read/write |               No | Read or event-only |        Controlled |
| `search-index/`   | No direct access |                    No |               No |         Read/write |        Controlled |
| `backups/`        |          Limited |                    No | No direct access |                 No |        Read/write |
| `runtime/`        |           Scoped |                Scoped |           Scoped |             Scoped |            Scoped |

---

# 98. Read-Only Mounts

Containers that only inspect authoritative data should receive read-only mounts.

Examples:

* audit exporter;
* integrity scanner;
* external backup agent;
* indexing worker when no derived sidecars are written.

---

# 99. Startup Mount Validation

At startup, the server shall validate:

* expected roots exist;
* roots are mounted;
* roots are not accidentally container-local;
* required roots are writable;
* read-only roots remain read-only where required;
* manifest identity matches Catalog Storage;
* layout version is supported;
* permissions are safe;
* free capacity is sufficient.

---

# 100. Accidental Empty Mount Detection

An incorrectly mounted empty directory shall not be treated as a new Master Library automatically.

If PostgreSQL contains an existing MasterLibraryId but the binary root lacks the matching manifest, startup shall fail or enter recovery mode.

Automatic initialization is prohibited in this state.

---

# 101. Root Initialization

A new Master Library root may be initialized only when:

* no existing catalog identity exists;
* the target root is empty or explicitly approved;
* the operation is administrative;
* a new MasterLibraryId is generated;
* initial manifests are written;
* the catalog and filesystem identities are committed coherently;
* the operation is audited.

---

# 102. Manifest and Catalog Agreement

The following shall agree:

```text
Catalog MasterLibraryId
manifest/master-library.json MasterLibraryId
server-binding logical identity
storage-layout version compatibility
```

Disagreement results in:

* incompatible state;
* recovery mode;
* startup failure;

depending on severity.

---

# 103. Capacity Reservations

The deployment should reserve capacity for:

* staging;
* PostgreSQL WAL;
* backups;
* restore staging;
* search rebuilds;
* migration copies;
* derived processing.

The system shall not assume all free NAS space is available for publication binaries.

---

# 104. Staging Capacity

Staging shall have configurable limits.

Operations shall be rejected before ingestion when available space is insufficient for:

* input;
* normalized copy;
* checksum processing;
* canonical commit;
* recovery overhead.

---

# 105. Search Rebuild Capacity

Search rebuild may temporarily require:

```text
active index
+
building index
+
previous index
```

Capacity planning shall account for all three.

---

# 106. Migration Capacity

Filesystem-layout migrations may require temporary duplicate storage.

Migration planning shall calculate required space before starting.

---

# 107. Backup Capacity

Backup volume sizing shall account for:

* retention policy;
* full backups;
* incremental backups;
* catalog growth;
* binary growth;
* verification copies;
* restore staging.

---

# 108. Directory Enumeration

Code shall avoid recursively enumerating the entire Master Library during ordinary requests.

Full scans are reserved for:

* reconciliation;
* migration;
* backup;
* integrity verification;
* administrative inventory.

Catalog queries remain the normal discovery mechanism.

---

# 109. Large-Tree Traversal

Full filesystem traversal shall be:

* streaming;
* bounded-memory;
* checkpointed;
* interruptible;
* resumable where practical;
* metrics-enabled.

A list of millions of paths shall not be loaded fully into memory.

---

# 110. Inventory Files

Large inventories may be stored as:

* JSON Lines;
* CSV;
* compact binary formats;
* compressed streams.

A single huge JSON array is discouraged.

---

# 111. Catalog-to-Path Resolution

The catalog stores:

* StorageSpace;
* logical key;
* checksum;
* length;
* media type;
* revision;
* state.

The application resolves the physical path only at access time.

---

# 112. Path-to-Catalog Resolution

Filesystem paths are not sufficient to prove catalog authority.

Inspection tools may parse canonical paths, but they shall verify:

* manifest identity;
* catalog record;
* checksum;
* storage state.

---

# 113. Orphan Definition

An orphan binary is a canonical-looking filesystem object with no valid authoritative catalog relationship.

Orphans shall not be automatically exposed or deleted.

They enter reconciliation and possible `lost-and-found`.

---

# 114. Missing Binary Definition

A missing binary is a committed Catalog Storage record whose expected canonical object is absent.

Missing binaries trigger:

* integrity error;
* Reader unavailability for the object;
* recovery workflow;
* backup lookup;
* audit event.

---

# 115. Duplicate Canonical Object

Two different canonical keys shall not represent the same SourceVersion identity.

Content-level duplicates may exist if distinct catalog identities intentionally reference separate immutable objects.

Future deduplication shall remain an implementation concern.

---

# 116. Content-Addressable Storage

Version 1 does not require content-addressable physical layout.

Checksums support duplicate analysis and validation.

Introducing shared content-addressed blobs would require an explicit architecture change because it affects:

* ownership;
* deletion;
* reference counting;
* recovery;
* backup;
* audit.

---

# 117. Filesystem Snapshots

NAS filesystem snapshots may supplement backups.

Snapshots do not replace coordinated backup manifests unless consistency with PostgreSQL is guaranteed and recorded.

---

# 118. Direct User Access

Users shall not manually reorganize authoritative directories during normal operation.

Administrative inspection may be allowed read-only.

Manual modifications are outside normal guarantees and shall be detected by integrity validation.

---

# 119. Original Filename Preservation

Original filenames are preserved as metadata.

They may also appear in manifests.

They shall not determine canonical paths.

---

# 120. Human Inspectability

Although paths are identifier-based, the layout remains inspectable.

Every committed object directory contains a manifest identifying:

* object identity;
* revision;
* media type;
* checksum;
* creation and commit context.

---

# 121. Logging Paths

Application logs should normally use the platform logging system.

When file logs are required, they belong under deployment runtime or diagnostics roots.

They shall not be mixed with sources or catalog backups.

---

# 122. Diagnostic Bundles

Diagnostic exports may use:

```text
runtime/diagnostics/<bundle-id>/
```

They shall avoid including:

* secrets;
* full publication binaries unless explicitly authorized;
* raw credentials;
* unnecessary personal data.

---

# 123. Temporary Container Storage

Containers may use internal temporary paths such as:

```text
/tmp
```

only for disposable data.

Container-local temporary storage shall not hold:

* the only accepted upload copy;
* committed binaries;
* recovery evidence;
* durable job checkpoints;
* backup manifests.

---

# 124. Publication Deletion Layout

Hard deletion shall not immediately remove paths without coordinated workflow.

A deletion may use a temporary tombstone or quarantine stage.

Example:

```text
recovery/pending/<operation-id>/
```

or a specialized deletion staging area before final removal.

---

# 125. Tombstones

Filesystem tombstone files are optional operational evidence.

Catalog deletion state remains authoritative.

A tombstone shall not become an alternate catalog.

---

# 126. Retention of Old Source Versions

Committed source versions are retained according to source-retention policy.

Removing old versions requires an explicit maintenance operation.

The default directory layout supports multiple versions indefinitely.

---

# 127. Retention of Old Covers

Committed cover revisions may be retained according to policy.

Derived variants may be deleted independently.

---

# 128. Layout Compatibility

The server shall support only declared layout versions.

Possible states:

```text
Compatible
MigrationRequired
NewerThanServer
Corrupt
Incomplete
```

---

# 129. Layout Version 1

The layout defined in this document is:

```text
Master Library Storage Layout Version 1
```

Its core features are:

* PostgreSQL physically separate;
* identifier-based paths;
* three-level hexadecimal sharding;
* immutable source-version directories;
* immutable cover-revision directories;
* operation-scoped staging;
* durable recovery evidence;
* separate derived and backup roots.

---

# 130. Directory Layout Tree

The complete baseline tree is:

```text
knowledgeos/
├── postgres-data/
│   └── pgdata/
│
├── master-library/
│   ├── manifest/
│   │   ├── master-library.json
│   │   ├── storage-layout.json
│   │   ├── server-binding.json
│   │   ├── compatibility.json
│   │   └── history/
│   │
│   ├── sources/
│   │   └── <s1>/<s2>/<s3>/<publication-id>/<source-version>/
│   │       ├── content.<extension>
│   │       ├── source.manifest.json
│   │       └── checksum.sha256
│   │
│   ├── covers/
│   │   └── <s1>/<s2>/<s3>/<publication-id>/<cover-revision>/
│   │       ├── original.<extension>
│   │       ├── cover.manifest.json
│   │       └── checksum.sha256
│   │
│   ├── assets/
│   │   └── <s1>/<s2>/<s3>/<asset-id>/<asset-version>/
│   │       ├── content.<extension>
│   │       ├── asset.manifest.json
│   │       └── checksum.sha256
│   │
│   ├── staging/
│   │   ├── acquisitions/
│   │   ├── imports/
│   │   ├── source-replacements/
│   │   ├── cover-replacements/
│   │   ├── assets/
│   │   ├── migrations/
│   │   ├── restores/
│   │   └── temporary/
│   │
│   ├── recovery/
│   │   ├── pending/
│   │   ├── resolved/
│   │   ├── failed/
│   │   ├── reconciliation/
│   │   └── reports/
│   │
│   ├── audit/
│   │   ├── archives/
│   │   ├── reports/
│   │   ├── integrity/
│   │   ├── migrations/
│   │   └── administration/
│   │
│   ├── migrations/
│   │   ├── pending/
│   │   ├── active/
│   │   ├── completed/
│   │   ├── failed/
│   │   └── history/
│   │
│   ├── derived/
│   │   ├── thumbnails/
│   │   ├── previews/
│   │   ├── ocr/
│   │   ├── extracted-text/
│   │   ├── embeddings/
│   │   ├── layouts/
│   │   ├── classifications/
│   │   └── caches/
│   │
│   ├── exports/
│   │   ├── catalog/
│   │   ├── publications/
│   │   ├── interoperability/
│   │   ├── reports/
│   │   └── temporary/
│   │
│   ├── quarantine/
│   │   ├── format-invalid/
│   │   ├── checksum-failed/
│   │   ├── malware-suspected/
│   │   ├── unsupported/
│   │   ├── identity-conflict/
│   │   └── manual-review/
│   │
│   ├── lost-and-found/
│   │   ├── orphan-sources/
│   │   ├── orphan-covers/
│   │   ├── orphan-assets/
│   │   ├── unknown-layout/
│   │   └── manual-review/
│   │
│   └── runtime/
│       ├── locks/
│       ├── leases/
│       ├── checkpoints/
│       └── diagnostics/
│
├── search-index/
│   ├── active/
│   ├── building/
│   ├── previous/
│   └── runtime/
│
├── backups/
│   ├── catalog/
│   ├── binary/
│   ├── coordinated/
│   ├── manifests/
│   ├── restore-staging/
│   └── verification/
│
└── runtime/
    ├── server/
    ├── workers/
    ├── maintenance/
    └── diagnostics/
```

---

# 131. Directory Layout Invariants

The following invariants are mandatory:

* PostgreSQL internal data is physically separate from the Master Library root.
* The Master Library root contains no SQLite database.
* The Master Library root contains no PostgreSQL relation files.
* Container mount paths are never persisted as logical identity.
* All authoritative binaries use identifier-based canonical paths.
* Publication paths use deterministic three-level hexadecimal sharding.
* Committed SourceVersions are immutable.
* Committed CoverRevisions are immutable.
* Original filenames do not determine canonical storage paths.
* Every authoritative binary has a checksum.
* Every authoritative binary directory has a manifest.
* Staging is operation-scoped.
* Recovery evidence is durable until resolution.
* Search indexes are stored outside authoritative binary roots.
* Backups are stored outside active authoritative roots.
* Derived artifacts are clearly separated from authoritative binaries.
* Personal Reader state is never stored under the Master Library root.
* Symlinks are prohibited in authoritative storage.
* Canonical paths do not contain mutable metadata.
* Canonical paths do not contain absolute host paths.
* Canonical paths do not contain container volume names.
* Canonical paths remain stable across container recreation.
* Directory layout changes require explicit versioned migration.
* An empty or incorrect mount is never initialized automatically over an existing catalog.
* Canonical files are never silently overwritten.
* Full-library traversal is never part of ordinary request processing.

---

# 132. Prohibited Layouts

The following designs are prohibited:

```text
master-library/
└── database/
    └── master-library.sqlite3
```

```text
master-library/
└── postgres/
    └── pgdata/
```

```text
master-library/
└── books/
    └── Author Name/
        └── Book Title/
            └── file.pdf
```

```text
master-library/
└── sources/
    └── millions-of-files-in-one-directory/
```

```text
master-library/
└── sources/
    └── original-user-filename.pdf
```

Also prohibited:

* storing PostgreSQL WAL under the Master Library root;
* storing authoritative binaries inside container layers;
* storing absolute NAS paths in Catalog Storage;
* using titles or authors as canonical directory names;
* overwriting committed source files;
* treating search indexes as backup authority;
* storing active backup files inside source directories;
* using one shared unstructured temporary directory for all operations;
* deleting unknown files automatically;
* following symlinks during reconciliation;
* exposing physical paths through public APIs.

---

# 133. Validation Checklist

A deployment is valid when:

```text
[ ] PostgreSQL has a dedicated persistent volume
[ ] PostgreSQL PGDATA is not under master-library/
[ ] Master Library has a dedicated persistent volume
[ ] Search has a separate logical volume
[ ] Backups have a separate logical volume
[ ] Runtime state is separated
[ ] Required manifest files exist
[ ] MasterLibraryId agrees with PostgreSQL
[ ] ServerId binding is valid
[ ] Storage-layout version is supported
[ ] Source paths follow the shard algorithm
[ ] Cover paths follow the shard algorithm
[ ] Asset paths follow the shard algorithm
[ ] Source versions are zero-padded
[ ] Cover revisions are zero-padded
[ ] Canonical files have manifests
[ ] Canonical files have checksums
[ ] No authoritative path uses original filenames
[ ] No canonical path stores absolute mount paths
[ ] No symlinks exist in authoritative roots
[ ] Staging operations are OperationId-scoped
[ ] Recovery records reference valid operations
[ ] Search indexes are recognized as derived
[ ] Backup roots are not mixed with active sources
[ ] Required permissions are enforced
[ ] Empty-mount detection is enabled
[ ] Capacity checks pass
[ ] No SQLite Master Library files remain
```

---

# 134. Related Documents

## Persistence

* `README.md`
* `StorageArchitecture.md`
* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `Manifest.md`
* `IdentityStorage.md`
* `CredentialStorage.md`
* `AuditStorage.md`
* `Migrations.md`
* `BackupRestore.md`
* `Recovery.md`
* `Transactions.md`
* `Locking.md`
* `Consistency.md`
* `Integrity.md`
* `Checksums.md`
* `StagingStorage.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 135. Status

**Approved**

The Master Library physical storage layout is frozen as:

```text
separate PostgreSQL data
+
identifier-based authoritative binary storage
+
deterministic sharding
+
immutable source versions
+
immutable cover revisions
+
operation-scoped staging
+
durable recovery evidence
+
separate search storage
+
separate coordinated backups
+
container mount independence
```

The next document is:

```text
01-MasterLibrary/05-Persistence/CatalogDatabase.md
```

It shall define PostgreSQL as the Version 1 authoritative Catalog Storage implementation for a Master Library containing more than two million publications.
