
# Master Library Integrity

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Integrity

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the integrity architecture of the KnowledgeOS Master Library.

Integrity is the property that guarantees the Master Library remains internally consistent across all persistence services, regardless of failures, interruptions, migrations or recovery operations.

Integrity extends beyond binary validation.

It includes the consistency of:

* Catalog Storage;
* Source Storage;
* Cover Storage;
* Asset Storage;
* manifests;
* indexes;
* relationships;
* references;
* operational metadata.

---

# 2. Scope

This document applies to every persistent component that participates in the authoritative Master Library.

Including:

* PostgreSQL Catalog;
* Source Storage;
* Cover Storage;
* Asset Storage;
* Backup packages;
* Recovery packages;
* Import staging;
* Export validation;
* Synchronization.

---

# 3. Integrity Model

Integrity is evaluated across four architectural layers:

```text
Domain Integrity
        │
Reference Integrity
        │
Storage Integrity
        │
Binary Integrity
```

Every layer must be valid.

A valid checksum alone does not imply a valid Master Library.

---

# 4. Architectural Principles

The integrity architecture follows these principles:

* deterministic verification;
* explicit validation;
* reproducible evaluation;
* append-only history;
* recoverable consistency;
* no silent repair;
* independent verification;
* implementation independence.

---

# 5. Integrity Domains

Integrity is evaluated independently for:

* identities;
* relationships;
* metadata;
* binary objects;
* revisions;
* storage references;
* manifests;
* backups.

Each domain produces its own verification result.

---

# 6. Domain Integrity

Domain Integrity verifies that every aggregate satisfies its architectural rules.

Examples include:

* every Publication has one identity;
* every Asset has one identity;
* every CoverRevision belongs to one Publication;
* every SourceVersion belongs to one Publication.

Business validation is outside the scope of this document.

---

# 7. Reference Integrity

Reference Integrity verifies all logical relationships.

Examples:

```text
Publication

↓

SourceVersion

↓

Binary
```

```text
Publication

↓

CoverRevision

↓

Binary
```

```text
Publication

↓

PublicationAsset

↓

Asset
```

Broken references invalidate the library.

---

# 8. Storage Integrity

Storage Integrity verifies that every Catalog reference corresponds to exactly one authoritative binary.

Verification includes:

* storage key;
* storage space;
* binary existence;
* byte length;
* checksum.

---

# 9. Binary Integrity

Binary Integrity verifies:

* checksum;
* binary readability;
* byte length;
* corruption detection.

Binary Integrity uses the checksum architecture defined in `Checksums.md`.

---

# 10. Metadata Integrity

Metadata verification includes:

* valid identifiers;
* revision consistency;
* timestamps;
* provenance;
* version ordering;
* required attributes.

Metadata corruption invalidates the corresponding aggregate.

---

# 11. Version Integrity

Version verification ensures:

* monotonically increasing revisions;
* immutable historical revisions;
* exactly one Current revision;
* no revision gaps created by storage failures.

Historical revisions remain verifiable.

---

# 12. Manifest Integrity

Every storage manifest shall be internally consistent.

Verification includes:

* logical storage keys;
* checksum values;
* algorithms;
* byte length;
* object count.

Manifest inconsistency triggers Recovery.

---

# 13. Backup Integrity

Backup verification confirms:

* complete Catalog snapshot;
* complete binary set;
* manifest consistency;
* checksum validation;
* version compatibility.

Incomplete backups are never considered valid.

---

# 14. Restore Integrity

Restore verification confirms:

* restored binaries exist;
* Catalog references resolve correctly;
* manifests match restored content;
* checksum validation succeeds.

Only after successful verification is the restored library considered authoritative.

---

# 15. Synchronization Integrity

Synchronization verifies that both sides converge to the same authoritative state.

Verification includes:

* identities;
* revisions;
* binary availability;
* manifests;
* checksums.

Synchronization never assumes correctness.

It always verifies.

---

# 16. Migration Integrity

Migration must preserve:

* identities;
* revisions;
* logical storage keys;
* checksums;
* relationships.

Migration may change implementation details but never architectural state.

---

# 17. Integrity Verification Levels

KnowledgeOS defines four verification levels:

### Level 1 — Structural

Verifies:

* schema;
* manifests;
* references.

---

### Level 2 — Metadata

Verifies:

* revisions;
* timestamps;
* identities;
* provenance.

---

### Level 3 — Binary

Verifies:

* file existence;
* byte length;
* checksums.

---

### Level 4 — Complete

Executes every verification defined by this document.

---

# 18. Scheduled Verification

Integrity verification may execute:

* at startup;
* periodically;
* before backup;
* after restore;
* after migration;
* after synchronization;
* on administrative request.

Verification frequency is configurable.

Verification rules are not.

---

# 19. Integrity Reports

Every verification produces an immutable report containing:

* execution identifier;
* timestamp;
* verification scope;
* detected inconsistencies;
* verification duration;
* result.

Reports are append-only.

---

# 20. Failure Classification

Integrity failures are classified as:

```text
Information

↓

Warning

↓

Error

↓

Critical
```

Severity determines operational response.

---

# 21. Recovery Trigger

Integrity verification never performs repairs directly.

Instead it requests Recovery.

Examples:

* orphan binary;
* missing binary;
* broken reference;
* checksum mismatch;
* manifest inconsistency;
* revision inconsistency.

Repair belongs exclusively to the Recovery architecture.

---

# 22. Forbidden Behavior

The following actions are prohibited:

* silently recreating binaries;
* silently modifying metadata;
* silently fixing checksums;
* silently deleting objects;
* silently replacing revisions;
* silently rebuilding manifests.

Every repair must be explicit and auditable.

---

# 23. Integrity Metrics

Recommended operational metrics include:

* verified objects;
* verification duration;
* failures by severity;
* orphan count;
* checksum mismatches;
* reference inconsistencies;
* recovery requests.

Metrics never replace verification reports.

---

# 24. Invariants

The following invariants are mandatory:

* every aggregate has a valid identity;
* every Catalog reference resolves;
* every committed binary exists;
* every committed binary passes checksum verification;
* every manifest is internally consistent;
* every backup is verifiable;
* every restore is verified before activation;
* historical revisions remain immutable;
* verification never modifies authoritative state;
* integrity failures always produce explicit reports;
* recovery is always initiated explicitly;
* silent repair is prohibited.

---

# 25. Related Documents

* `StorageArchitecture.md`
* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `AssetStorage.md`
* `Checksums.md`
* `Recovery.md`
* `BackupRestore.md`
* `Consistency.md`

---

# 26. Status

**Approved**

The Integrity architecture is frozen as the authoritative verification framework for the KnowledgeOS Master Library. It defines deterministic, reproducible and implementation-independent validation across domain objects, references, metadata, storage services and binary content, ensuring that every authoritative library state can be verified without modifying persistent data.
