
# Master Library Persistence

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** README

**Version:** 2.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This module defines every persistence component used by the KnowledgeOS Master Library.

It specifies how information is physically stored, protected, recovered, migrated and maintained inside the authoritative library hosted on the NAS.

The persistence architecture guarantees that every publication, metadata record and binary asset can be stored, validated, recovered and evolved without affecting the domain model.

This module defines the authoritative storage architecture of the platform.

---

# 2. Scope

This module applies exclusively to the Master Library hosted by the KnowledgeOS Server.

It defines:

- catalog persistence
- source document storage
- cover storage
- metadata persistence
- identity persistence
- audit persistence
- transaction management
- consistency
- integrity
- recovery
- migrations
- backup
- storage validation

It does not define client persistence.

Client-side storage is documented independently.

---

# 3. Architectural Principles

The persistence architecture follows these principles.

## Hybrid Storage

Metadata and binary content are stored independently.

Each storage technology is responsible only for the data it manages best.

## Separation of Responsibilities

Relational information belongs to the database.

Large immutable files belong to the filesystem.

Derived artifacts belong to dedicated derived storage.

## Storage Independence

The domain model never depends on the physical storage implementation.

Persistence remains an infrastructure concern.

## Stable Identity

Every persisted resource is addressed through immutable KnowledgeOS identifiers.

User-visible metadata never determines storage location.

## Deterministic Layout

Every stored object has one canonical location.

The same identifiers always generate the same storage path.

## Recoverability

Every authoritative object can be reconstructed after failure using the persistence model.

---

# 4. Storage Model

The Master Library uses a hybrid persistence architecture.

```
                Master Library

        +---------------------------+
        |      PostgreSQL           |
        |---------------------------|
        | Publications              |
        | Metadata                  |
        | Relationships             |
        | Catalog                   |
        | Devices                   |
        | Users                     |
        | Credentials               |
        | Audit                     |
        | Operations                |
        +---------------------------+

                    │

                    │ references

                    ▼

        +---------------------------+
        |      Filesystem           |
        |---------------------------|
        | PDF                       |
        | EPUB                      |
        | Images                    |
        | Covers                    |
        | Source Versions           |
        | Recovery                  |
        | Staging                   |
        +---------------------------+

                    │

                    ▼

        +---------------------------+
        | Derived Storage           |
        |---------------------------|
        | Search indexes            |
        | Thumbnails                |
        | Generated metadata        |
        | Export cache              |
        +---------------------------+
```

No binary publication is stored inside PostgreSQL.

No relational metadata is stored as filesystem authority.

---

# 5. Deployment Model

The Master Library is deployed on the NAS using isolated containers.

Each service owns a single responsibility.

```
NAS

Container Runtime

├── knowledgeos-server
├── postgresql
├── search
├── workers
└── maintenance
```

Services communicate only through internal network contracts.

Clients never access infrastructure services directly.

---

# 6. Persistent Volumes

Container images are stateless.

Every authoritative resource resides on persistent volumes.

Recommended layout:

```
Persistent Volumes

knowledgeos-postgres-data
knowledgeos-master-library
knowledgeos-search
knowledgeos-backups
knowledgeos-runtime
```

Destroying or recreating containers shall never destroy authoritative information.

---

# 7. PostgreSQL

The authoritative catalog is stored in PostgreSQL.

PostgreSQL stores:

- publications
- source records
- cover records
- metadata
- identifiers
- catalog revisions
- users
- devices
- permissions
- audit records
- synchronization state
- operational metadata

The database never stores publication binaries.

---

# 8. Filesystem

The filesystem stores immutable binary resources.

Examples:

- PDF
- EPUB
- MOBI
- CBZ
- DJVU
- scanned images
- cover images

Files are organized by immutable KnowledgeOS identifiers.

---

# 9. Derived Storage

Derived artifacts are rebuildable.

Examples:

- search indexes
- OCR caches
- thumbnails
- generated previews
- export caches

Loss of derived storage shall never imply loss of knowledge.

---

# 10. Container Independence

No persistence mechanism depends on a specific container runtime.

The architecture supports any OCI-compatible runtime.

Examples include Docker, Podman or container solutions provided by NAS vendors.

The runtime is an operational concern, not an architectural dependency.

---

# 11. Storage Scalability

The persistence architecture is designed for very large personal libraries.

Initial target:

- more than 2 million publications

The architecture shall support continuous growth without requiring redesign.

---

# 12. Persistence Responsibilities

This module defines:

- physical storage
- consistency
- durability
- recoverability
- migration
- validation
- backup
- integrity
- storage security

Business rules remain outside this module.

---

# 13. Module Organization

This module is composed of:

```
05-Persistence/

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

---

# 14. Design Goals

The persistence layer shall be:

- deterministic
- scalable
- portable
- recoverable
- inspectable
- testable
- versioned
- technology-independent
- resilient
- maintainable

---

# 15. Related Modules

This module depends on:

- Domain
- Contracts
- Technical Design

It provides services to:

- Reader
- Library
- Synchronization
- Search
- Administration

---

# 16. Implementation Roadmap

Documents should be implemented in the following order:

1. StorageArchitecture
2. DirectoryLayout
3. CatalogDatabase
4. CatalogSchema
5. SourceStorage
6. CoverStorage
7. Transactions
8. Locking
9. Consistency
10. Integrity
11. Checksums
12. Recovery
13. BackupRestore
14. Migrations
15. Remaining supporting documents

---

# 17. Status

**Approved**

This document defines the persistence architecture baseline for the KnowledgeOS Master Library.

All subsequent persistence documents shall conform to the architectural decisions established here.
