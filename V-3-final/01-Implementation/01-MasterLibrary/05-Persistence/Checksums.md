
# Master Library Checksums

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Checksums

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the checksum architecture used throughout the KnowledgeOS Master Library.

Checksums provide deterministic verification of binary integrity across every authoritative storage service.

They are fundamental for:

* integrity verification;
* commit validation;
* backup verification;
* restore validation;
* synchronization;
* migration;
* recovery;
* reconciliation;
* corruption detection.

Checksums are never used as object identities.

---

# 2. Scope

This document applies to every authoritative binary object managed by the Master Library.

Including:

* Sources;
* Covers;
* Assets;
* Backup components;
* Recovery packages;
* Export packages (when preserved);
* Manifest files.

Catalog tables themselves rely on PostgreSQL durability rather than per-row checksums unless explicitly required.

---

# 3. Architectural Role

Checksums answer one question only:

> **"Are these bytes exactly the same?"**

They do **not** answer:

* Is this the same Publication?
* Is this the same Asset?
* Is this a duplicate object?
* Should this object be merged?

Identity and integrity are intentionally independent concerns.

---

# 4. Principles

The checksum architecture follows these principles:

* deterministic computation;
* algorithm independence;
* immutable values;
* explicit algorithm versioning;
* reproducibility;
* storage independence;
* append-only history;
* verification before trust.

---

# 5. Checksum Model

Every committed binary stores:

```text
ChecksumAlgorithm

ChecksumValue
```

Example:

```text
Algorithm : SHA-256

Value :

6b51d431df5d7f141cbececcf79edf3d...
```

The algorithm is always stored together with the checksum.

---

# 6. Supported Algorithms

The architecture supports multiple algorithms.

Initial approved algorithms:

```text
SHA-256
```

Future compatible algorithms may include:

```text
SHA-512

BLAKE3

SHA3-256
```

Adding algorithms shall not invalidate previously committed objects.

---

# 7. Algorithm Independence

Applications shall never assume a fixed checksum algorithm.

Every verification uses:

```text
algorithm
+
checksum
```

Hardcoding SHA-256 into business logic is prohibited.

---

# 8. Immutable Checksums

Once a binary reaches the **Committed** state:

* checksum algorithm;
* checksum value;

become immutable.

Changing either requires a new binary version.

---

# 9. Checksum Generation

Checksums are calculated over the complete committed binary.

The calculation occurs before Catalog commit.

No truncated or partial checksum is permitted.

---

# 10. Commit Validation

A binary cannot become authoritative until:

1. binary persistence succeeds;
2. checksum is calculated;
3. checksum is verified from persisted storage;
4. Catalog record is created.

Verification is mandatory.

---

# 11. Verification Sources

Integrity verification compares:

```text
Catalog Metadata
        │
        ▼
Stored Checksum
        │
        ▼
Filesystem Binary
        │
        ▼
Calculated Checksum
```

All values shall match.

---

# 12. Verification Events

Checksum verification occurs during:

* commit;
* restore;
* reconciliation;
* scheduled integrity scans;
* migration;
* manual validation;
* administrative verification.

Additional verification may occur during synchronization.

---

# 13. Failure Handling

Checksum mismatch immediately marks the binary as inconsistent.

Automatic overwrite is prohibited.

The object enters the Recovery workflow.

---

# 14. Duplicate Detection

Checksums may be used to detect identical binary content.

Duplicate content does not imply identical domain identity.

Example:

```text
Asset A
↓

SHA-256 X

Asset B
↓

SHA-256 X
```

Both Assets remain distinct if their identities differ.

---

# 15. Collision Policy

The architecture assumes cryptographically secure algorithms.

Potential collisions are treated as security events.

The system shall never silently merge objects based solely on checksum equality.

---

# 16. Manifests

Every backup or migration manifest records:

* algorithm;
* checksum;
* byte length;
* logical storage key.

The manifest itself may also be checksummed.

---

# 17. Backup Verification

Backup validation verifies:

* binary existence;
* byte length;
* checksum;
* manifest consistency.

Incomplete verification never marks a backup as valid.

---

# 18. Restore Verification

Every restored binary is revalidated.

Restoration is incomplete until checksum verification succeeds.

---

# 19. Recovery

Recovery never recalculates authoritative checksums as replacements.

It only compares:

stored checksum

versus

calculated checksum.

---

# 20. Migration

Storage migrations preserve checksum values.

Migration shall not alter binary contents.

A migrated binary producing a different checksum is considered corrupted.

---

# 21. Performance

Checksum calculation is optimized for:

* sequential streaming;
* low memory usage;
* deterministic execution.

Entire binaries shall not be loaded into memory solely for checksum computation.

---

# 22. Security

Checksums provide integrity verification.

They do not provide:

* confidentiality;
* authenticity;
* authorization;
* encryption.

Cryptographic signatures are outside the scope of this document.

---

# 23. Invariants

The following invariants are mandatory:

* every committed binary has exactly one checksum algorithm;
* every committed binary has exactly one checksum value;
* checksum values never change;
* checksum algorithms never change after commit;
* checksum calculation always uses the full binary;
* verification precedes Catalog commit;
* checksum mismatch initiates recovery;
* checksums never define object identity;
* duplicate checksums never force object merging;
* backup and restore always verify checksums.

---

# 24. Related Documents

* `StorageArchitecture.md`
* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `AssetStorage.md`
* `Integrity.md`
* `Recovery.md`
* `BackupRestore.md`

---

# 25. Status

**Approved**

The checksum architecture is frozen as the authoritative integrity verification mechanism for every committed binary managed by the KnowledgeOS Master Library. It guarantees deterministic validation while remaining independent from domain identity, storage implementation and future hashing algorithms.
