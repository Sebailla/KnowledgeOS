
# Master Library Persistence

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

---

# 1. Purpose

This section defines the complete persistence architecture of the KnowledgeOS Master Library.

Persistence is responsible for storing, protecting, validating and recovering every authoritative resource managed by the NAS-hosted Master Library.

Unlike client devices, the Master Library is the only authoritative repository for publications.

It is therefore designed to maximize:

* integrity
* recoverability
* deterministic behavior
* auditability
* long-term maintainability

---

# 2. Scope

This section specifies:

* physical directory layout
* catalog database
* publication storage
* cover storage
* metadata persistence
* identities
* credentials
* manifests
* audit records
* migrations
* backups
* recovery
* consistency validation
* locking
* transactions
* checksums
* staging
* integrity validation

It also defines the persistence model used by Reader clients where necessary.

---

# 3. Architectural Principles

The persistence layer follows the principles defined by Architecture V3:

* Master Library is authoritative.
* Reader libraries are disposable.
* Publications are immutable.
* SourceVersion is immutable.
* Personal state never belongs to the Master Library.
* Storage is deterministic.
* Storage must be inspectable.
* Storage shall survive application upgrades.
* Storage shall survive operating-system upgrades.
* Storage shall remain independent of any database engine.

---

# 4. Persistence Layers

The persistence architecture is divided into independent layers.

```text
Persistence

├── Identity

├── Metadata

├── Catalog

├── Publications

├── Covers

├── Audit

├── Credentials

├── Recovery

├── Staging

└── Client Storage
```

Each layer has one clearly defined responsibility.

---

# 5. Storage Categories

The Master Library stores only authoritative information.

Categories include:

* Library identity
* Server identity
* Publication metadata
* Catalog
* Source files
* Covers
* Administrative configuration
* Registered devices
* Credentials
* Audit logs
* Migration state
* Recovery markers

It never stores:

* annotations
* highlights
* bookmarks
* reading progress
* favorites
* personal collections
* personal tags

Those belong exclusively to client devices.

---

# 6. Storage Objectives

The persistence layer is optimized for:

* correctness
* recoverability
* transparency
* deterministic recovery
* human inspection
* reproducible backups
* long-term compatibility

It is not optimized for maximum write throughput.

---

# 7. Separation of Concerns

Persistence never contains business rules.

It only guarantees:

* durability
* consistency
* atomicity where required
* identity preservation
* recoverability

Business validation belongs to the Domain layer.

---

# 8. Immutable vs Mutable Data

Immutable:

* publications
* SourceVersion payloads
* historical audit records

Mutable:

* metadata
* catalog
* covers
* configuration
* credentials
* registered devices

Each category follows different persistence rules.

---

# 9. Physical Independence

The persistence model does not depend on:

* SQLite
* PostgreSQL
* MySQL
* any NAS vendor
* filesystem implementation

Concrete technologies are implementation details.

---

# 10. Persistence Documents

This section is composed of the following specifications:

```text
README.md

StorageArchitecture.md

DirectoryLayout.md

CatalogDatabase.md

CatalogSchema.md

SourceStorage.md

CoverStorage.md

Manifest.md

IdentityStorage.md

CredentialStorage.md

AuditStorage.md

Migrations.md

BackupRestore.md

Recovery.md

Transactions.md

Locking.md

Consistency.md

Integrity.md

Checksums.md

LocalReaderCache.md

LocalLibraryStorage.md

AcquisitionStorage.md

StagingStorage.md
```

Each document specifies one persistence subsystem.

---

# 11. Relationship with Other Modules

This section depends on:

* Domain
* Technical Design
* Contracts

It provides services to:

* Application
* HTTP API
* Background Jobs
* Import Pipeline
* Acquisition Engine
* Catalog Engine
* Administration Engine

---

# 12. Persistence Philosophy

The storage model follows one guiding rule:

> If a knowledgeable administrator inspects the Master Library on disk, its structure should be understandable without reverse engineering proprietary formats.

The Master Library is intended to remain portable, inspectable and durable for decades.

---

# 13. Status

**Approved**

This document serves as the entry point for every persistence specification of the KnowledgeOS Master Library.
