
# Master Library Storage Architecture

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Storage Architecture

**Version:** 2.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Deployment Baseline:** Containerized NAS Deployment

**Scale Baseline:** More Than 2,000,000 Publications at Initial Deployment

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the storage architecture of the KnowledgeOS Master Library.

It establishes the responsibilities, boundaries, authority rules, lifecycle policies, deployment model and invariants that govern all persistent information managed by the KnowledgeOS Server.

The architecture is designed for a Master Library containing more than two million publications from its initial deployment and capable of growing continuously without requiring a structural redesign.

This document governs:

* catalog storage;
* binary storage;
* search storage;
* operational storage;
* derived storage;
* backup storage;
* client-local storage boundaries;
* container persistence;
* volume ownership;
* consistency;
* durability;
* recovery;
* migration;
* integrity;
* scalability.

---

# 2. Scope

This document applies to the persistence architecture of the KnowledgeOS Master Library hosted on the NAS.

It covers:

* authoritative catalog data;
* publication source files;
* cover files;
* associated binary assets;
* identities;
* credentials;
* audit data;
* operational jobs;
* staging;
* recovery;
* migrations;
* backups;
* search indexes;
* derived artifacts;
* persistent container volumes;
* storage service contracts;
* failure and recovery boundaries.

It also defines the separation between Master Library storage and Reader client storage.

---

# 3. Explicit Exclusions

This document does not define:

* exact PostgreSQL tables;
* exact database indexes;
* exact directory names;
* exact deployment manifests;
* exact container images;
* exact NAS vendor configuration;
* exact backup schedules;
* search ranking algorithms;
* OCR pipelines;
* embedding models;
* Reader user-interface behavior;
* CloudKit schemas;
* personal annotation models.

Those concerns are defined in specialized documents.

---

# 4. Architectural Context

The Master Library is the authoritative institutional component of KnowledgeOS.

It runs on the NAS and provides:

* publication catalog access;
* publication acquisition;
* source retrieval;
* cover retrieval;
* administrative management;
* metadata maintenance;
* identity and device management;
* auditability;
* recovery;
* backup;
* search.

The Master Library shall initially manage more than:

```text
2,000,000 publications
```

It may also manage:

```text
millions of contributors
millions of external identifiers
millions of publication relationships
multiple source versions per publication
multiple cover revisions
tens of millions of metadata records
potentially tens of terabytes of binary content
```

The storage architecture shall assume large-scale operation from the beginning.

---

# 5. Core Storage Principle

> Persistence is organized by responsibility and authority, not merely by storage technology.

PostgreSQL, filesystems, search engines and object stores are implementation technologies.

The architecture defines logical storage services whose contracts remain stable even when the physical implementation changes.

---

# 6. Storage Abstraction Model

The persistence architecture is divided into the following logical storage services:

```text
Persistence
├── Catalog Storage
├── Binary Storage
├── Search Storage
├── Operational Storage
├── Derived Storage
├── Backup Storage
└── Client Local Storage
```

Each storage service has:

* a defined responsibility;
* explicit authority;
* explicit ownership;
* an implementation boundary;
* lifecycle rules;
* backup rules;
* recovery rules;
* integrity rules.

---

# 7. Technology Independence

The Domain and Application layers depend on storage contracts.

They shall not depend directly on:

* PostgreSQL;
* SQL;
* filesystem paths;
* NAS mount points;
* container volume names;
* search-engine APIs;
* Docker;
* Podman;
* NAS-specific container runtimes.

Concrete technologies belong exclusively to Infrastructure.

---

# 8. Version 1 Implementations

The approved initial implementations are:

| Logical Storage Service | Version 1 Implementation                                           |
| ----------------------- | ------------------------------------------------------------------ |
| Catalog Storage         | PostgreSQL                                                         |
| Binary Storage          | NAS filesystem through a storage adapter                           |
| Search Storage          | PostgreSQL full-text capabilities plus replaceable derived indexes |
| Operational Storage     | PostgreSQL plus persistent filesystem spaces                       |
| Derived Storage         | Dedicated persistent or disposable volumes                         |
| Backup Storage          | NAS backup volume and external backup destinations                 |
| Client Local Storage    | SQLite, local filesystem and CloudKit according to responsibility  |

These implementations may evolve without changing the logical storage contracts.

---

# 9. Deployment Model

The KnowledgeOS Server is deployed on the NAS using containers.

The architecture assumes an OCI-compatible container runtime.

The exact runtime may be:

* Docker;
* Podman;
* containerd-based tooling;
* NAS-vendor container tooling;
* another compatible runtime.

The architecture does not depend on one specific product.

---

# 10. Container Topology

The approved logical topology is:

```text
NAS Host
│
├── Container Runtime
│   ├── knowledgeos-server
│   ├── knowledgeos-worker
│   ├── knowledgeos-postgresql
│   ├── knowledgeos-search
│   └── knowledgeos-maintenance
│
└── Persistent Storage
    ├── PostgreSQL Data Volume
    ├── Master Library Binary Volume
    ├── Search Index Volume
    ├── Backup Volume
    └── Operational Volume
```

A deployment may combine some roles initially, but their logical responsibilities remain separate.

---

# 11. Container Ephemerality

Containers are replaceable execution units.

Container writable layers shall be considered ephemeral.

No authoritative information may exist only inside:

* a container writable layer;
* an image layer;
* an unmounted internal container path;
* temporary container storage.

All authoritative data shall reside on persistent volumes or external persistent services.

---

# 12. Persistent Volume Principle

> Containers are ephemeral; persistent volumes are durable.

Destroying, recreating or upgrading a container shall not destroy:

* the catalog;
* source files;
* covers;
* identities;
* credentials;
* audit records;
* pending recovery evidence;
* migration state;
* backups.

---

# 13. Volume Separation

The following persistence categories shall use separate logical volumes:

```text
knowledgeos-postgres-data
knowledgeos-master-library
knowledgeos-search-data
knowledgeos-backups
knowledgeos-operational
```

A deployment may map these logical volumes to NAS datasets or directories.

The separation shall remain explicit.

---

# 14. PostgreSQL Volume

The PostgreSQL volume contains only PostgreSQL-managed data.

It shall not contain:

* publication binaries;
* covers;
* application logs unrelated to PostgreSQL;
* arbitrary exports;
* Master Library directories;
* backup archives unless created by PostgreSQL tooling for that purpose.

The application shall never manipulate PostgreSQL internal files directly.

---

# 15. Master Library Binary Volume

The Master Library binary volume contains:

* publication source files;
* source versions;
* authoritative covers;
* authoritative binary assets;
* persistent staging;
* recovery artifacts;
* manifests;
* binary integrity sidecars;
* selected audit archives;
* migration artifacts where applicable.

It shall not contain PostgreSQL internal data files.

---

# 16. Search Index Volume

The search volume contains only derived search data.

Examples:

* inverted indexes;
* token dictionaries;
* search-engine segments;
* semantic indexes;
* vector indexes;
* search checkpoints.

The search volume is not authoritative.

It shall be rebuildable from authoritative catalog and binary sources.

---

# 17. Backup Volume

The backup volume contains:

* database backups;
* binary-storage backups;
* backup manifests;
* verification reports;
* restore staging;
* retention metadata.

It shall be isolated from ordinary application writes.

---

# 18. Operational Volume

The operational volume may contain:

* runtime locks;
* leases;
* durable job state;
* maintenance reports;
* temporary administrative exports;
* container operational metadata.

No sole authoritative publication or catalog data shall reside only in this volume.

---

# 19. Private Container Network

Infrastructure services communicate through a private container network.

The following shall not be exposed directly to Reader clients:

* PostgreSQL;
* internal search service;
* worker control interfaces;
* maintenance service;
* filesystem mounts.

Reader clients communicate only with the public KnowledgeOS Server API.

---

# 20. Service Isolation

Each container shall receive only the volumes and network access required for its responsibility.

Examples:

```text
knowledgeos-server
├── read/write access to Master Library volume
├── database network access
├── search service access
└── limited operational-volume access

knowledgeos-postgresql
└── exclusive PostgreSQL data volume

knowledgeos-search
├── search index volume
└── controlled catalog or event access

knowledgeos-maintenance
├── backup volume
├── controlled Master Library access
└── controlled PostgreSQL backup access
```

---

# 21. Storage Responsibility Model

The architecture separates storage into seven responsibilities.

## 21.1 Catalog Storage

Stores structured authoritative records.

## 21.2 Binary Storage

Stores authoritative large binary objects.

## 21.3 Search Storage

Stores indexes used to locate and rank information.

## 21.4 Operational Storage

Stores durable execution and recovery state.

## 21.5 Derived Storage

Stores rebuildable computed artifacts.

## 21.6 Backup Storage

Stores recoverable copies and recovery evidence.

## 21.7 Client Local Storage

Stores disposable remote caches and personal local state according to client policy.

---

# 22. Catalog Storage

Catalog Storage is responsible for structured authoritative state.

Version 1 implementation:

```text
PostgreSQL
```

Catalog Storage owns:

* publication records;
* source-version records;
* cover records;
* contributors;
* contributor relationships;
* subjects;
* classifications;
* collections;
* external identifiers;
* metadata provenance;
* catalog revisions;
* server identity;
* Master Library identity;
* devices;
* credentials;
* permissions;
* audit records;
* durable operations;
* migration state;
* backup metadata;
* consistency metadata.

---

# 23. Catalog Storage Authority

For structured information, PostgreSQL is authoritative unless another document explicitly assigns authority elsewhere.

The filesystem shall not become an alternate structured catalog.

Sidecar files may support:

* integrity;
* recovery;
* inspection;
* backup verification.

They shall not silently replace PostgreSQL as catalog authority.

---

# 24. Catalog Technology Boundary

Application code accesses Catalog Storage through repository and transaction contracts.

Direct SQL usage shall remain inside persistence adapters.

The following are prohibited outside Infrastructure:

* table names;
* PostgreSQL schema names;
* SQL fragments;
* database-specific data types;
* connection strings;
* transaction handles;
* query-planner assumptions.

---

# 25. PostgreSQL Logical Organization

The Version 1 PostgreSQL database should use logical schemas.

Approved initial organization:

```text
knowledgeos
├── catalog
├── identity
├── security
├── audit
├── operations
├── configuration
└── maintenance
```

This is one logical database, not multiple independent databases.

---

# 26. One Database Principle

Version 1 uses one authoritative PostgreSQL database for the Master Library.

This enables:

* atomic cross-module transactions;
* consistent backups;
* simpler administration;
* unified observability;
* fewer connection pools;
* lower NAS resource consumption;
* coherent migrations.

Multiple databases are not required for initial deployment.

---

# 27. Database Scale Baseline

The catalog shall support:

```text
more than 2,000,000 publication records
millions of source and cover records
millions of contributor relationships
millions of subject relationships
millions of external identifiers
continuous bulk imports
concurrent client reads
background indexing
administrative writes
```

The schema shall avoid assumptions suitable only for small personal databases.

---

# 28. PostgreSQL Concurrency Model

PostgreSQL provides multi-version concurrency control.

The architecture permits:

* concurrent Reader queries;
* concurrent background processing;
* controlled administrative writes;
* parallel imports;
* search-index extraction;
* maintenance operations.

Application-level locking remains required for domain conflicts.

Database concurrency does not replace business invariants.

---

# 29. Database Connection Model

The server and workers shall use bounded connection pools.

Connection count shall be controlled because the NAS has finite memory and CPU resources.

The architecture shall support a connection-pooling proxy if operational measurements justify it.

It shall not require one initially.

---

# 30. Database Durability

PostgreSQL shall be configured for durable authoritative storage.

Unsafe configurations that acknowledge commits before durable persistence are prohibited unless explicitly used for non-authoritative derived data.

The catalog shall prioritize correctness over marginal write throughput.

---

# 31. Database Backups

Catalog backups shall use PostgreSQL-supported logical or physical backup mechanisms.

Direct copying of active PostgreSQL data files by the application is prohibited.

Backups shall coordinate with binary-storage backup checkpoints.

---

# 32. Binary Storage

Binary Storage manages large persistent objects.

Version 1 implementation:

```text
NAS filesystem through a Binary Storage adapter
```

Binary Storage owns:

* PDF files;
* EPUB files;
* supported publication formats;
* scanned image collections;
* cover files;
* authoritative binary assets;
* source-version payloads.

---

# 33. Binary Storage Abstraction

The Domain shall not depend on filesystem semantics.

Binary Storage contracts shall expose concepts such as:

* store;
* open;
* stream;
* validate;
* checksum;
* commit;
* quarantine;
* delete;
* enumerate;
* resolve by storage reference.

They shall not expose arbitrary host paths.

---

# 34. Future Binary Storage Implementations

The abstraction shall permit future implementations such as:

* S3-compatible object storage;
* Ceph;
* MinIO;
* remote object storage;
* distributed storage;
* encrypted archive storage.

Version 1 remains the NAS filesystem.

---

# 35. Binary Storage Spaces

Binary Storage is divided into policy-controlled spaces:

```text
Binary Storage
├── Sources
├── Covers
├── Assets
├── Staging
├── Recovery
├── Exports
├── Temporary
└── Derived
```

Each space has explicit authority and lifecycle rules.

---

# 36. Sources Storage Space

The Sources space stores authoritative publication content.

Properties:

```text
Authoritative: yes
Versioned: yes
Immutable after commit: yes
Rebuildable: no
Backup required: yes
Integrity checks required: yes
```

---

# 37. Covers Storage Space

The Covers space stores authoritative committed covers.

Properties:

```text
Authoritative: yes
Versioned by cover revision: yes
Immutable after commit: yes
Rebuildable: not necessarily
Backup required: yes
Integrity checks required: yes
```

A derived cover generated from a source is still not authoritative until explicitly committed.

---

# 38. Assets Storage Space

The Assets space stores authoritative binary resources associated with a Publication or Knowledge Object.

Examples:

* supplementary images;
* attachments;
* embedded media extracted and promoted to authority;
* externally supplied resources.

Its exact model is defined in specialized documents.

---

# 39. Staging Storage Space

The Staging space stores uncommitted operation data.

Properties:

```text
Authoritative: no
Durable during operation: yes
Externally visible: no
Backup required: generally no
Recoverable: when associated with durable operation state
Automatically removable: after validated completion
```

---

# 40. Recovery Storage Space

The Recovery space stores evidence required to resolve interrupted or ambiguous operations.

Properties:

```text
Authoritative for recovery state: yes
Publication authority: no
Durable until resolution: yes
Backup required: yes
Externally visible: no
Automatic deletion: prohibited before validation
```

---

# 41. Exports Storage Space

The Exports space stores generated output.

Examples:

* catalog exports;
* administrative reports;
* publication export packages;
* interoperability bundles.

Exports are derived unless an explicit archival process promotes them.

---

# 42. Temporary Storage Space

The Temporary space stores process-local disposable data.

Properties:

```text
Authoritative: no
Recoverable: no
Backup required: no
Safe to remove after process failure: yes
```

Temporary storage shall never contain the only copy of accepted input.

---

# 43. Derived Binary Storage Space

The Derived space stores computed binary artifacts.

Examples:

* thumbnails;
* previews;
* rendered pages;
* OCR intermediates;
* generated cover variants;
* export caches.

All derived artifacts shall be reproducible from authoritative sources or explicitly disposable.

---

# 44. Binary Identity

Every authoritative binary object shall be owned by stable KnowledgeOS identity.

Examples:

```text
PublicationId
SourceVersion
CoverRevision
AssetId
```

User-visible names shall never determine canonical storage identity.

---

# 45. Binary Immutability

Committed source versions are immutable.

A source replacement creates a new SourceVersion.

It shall not overwrite the previous committed payload.

Committed cover revisions are also immutable.

---

# 46. Binary Write Model

Binary commits follow:

```text
receive
→ stage
→ validate
→ checksum
→ persist recovery evidence
→ move or copy to canonical location
→ commit catalog transaction
→ validate cross-store consistency
→ complete audit
→ clear recovery evidence
```

Direct writes into committed locations are prohibited.

---

# 47. Binary Checksums

Every authoritative binary shall have a cryptographic checksum.

Version 1 baseline:

```text
SHA-256
```

Checksums are used for:

* ingestion validation;
* corruption detection;
* transfer verification;
* backup verification;
* restore verification;
* duplicate analysis.

---

# 48. Search Storage

Search Storage provides retrieval indexes.

It is not the authoritative catalog.

Version 1 may combine:

* PostgreSQL full-text search;
* PostgreSQL indexed normalized fields;
* replaceable derived lexical indexes;
* future semantic indexes.

---

# 49. Search Service Boundary

Search shall be exposed through a logical Search Service contract.

Application and Domain layers shall not depend on:

* OpenSearch;
* Elasticsearch;
* Tantivy;
* PostgreSQL text-search syntax;
* vector-database APIs.

---

# 50. Search Authority

Search results are projections of authoritative data.

Search Storage shall never become the only owner of:

* publication metadata;
* source identity;
* contributor identity;
* classification;
* provenance;
* permissions.

---

# 51. Search Rebuildability

Search indexes shall be rebuildable from:

* Catalog Storage;
* authoritative Binary Storage;
* approved processing outputs.

Loss of search storage shall degrade search but shall not destroy the Master Library.

---

# 52. Search Consistency

Search is allowed to be eventually consistent.

Catalog and acquisition operations shall not fail solely because a derived search index is temporarily unavailable.

The system shall track indexing state and retry asynchronously.

---

# 53. Search Scaling Strategy

For more than two million Publications:

* indexing shall be asynchronous;
* bulk indexing shall be supported;
* index rebuild shall be resumable;
* deep pagination shall avoid large offsets;
* changes shall be processed incrementally;
* index versioning shall be supported;
* blue-green or parallel index rebuild shall remain possible.

---

# 54. PostgreSQL Full-Text Role

PostgreSQL full-text capabilities may provide initial lexical search.

They shall not prevent adoption of a specialized search engine.

Search contracts shall remain implementation-independent.

---

# 55. Semantic Search

Embeddings and semantic indexes are derived data.

They shall never alter source authority.

They shall be versioned by:

* model identifier;
* model version;
* preprocessing version;
* embedding dimension;
* source revision.

---

# 56. Operational Storage

Operational Storage maintains durable system execution state.

It includes:

* jobs;
* workflows;
* import batches;
* acquisition operations;
* backup operations;
* restore operations;
* migration operations;
* recovery markers;
* leases;
* locks;
* retry state;
* checkpoints.

---

# 57. Operational Authority

Operational data may be authoritative for the state of an active operation.

It is not authoritative for publication content or catalog metadata.

---

# 58. Durable Jobs

Long-running jobs shall persist enough state to resume or fail deterministically after restart.

A job shall not depend exclusively on in-memory state.

---

# 59. Operation Identity

Every durable multi-step operation shall have a stable:

```text
OperationId
```

The OperationId shall connect:

* database state;
* staging data;
* recovery markers;
* logs;
* audit records;
* maintenance reports.

---

# 60. Recovery Markers

Cross-store operations shall create durable recovery evidence before entering an ambiguous state.

Recovery evidence shall indicate:

* operation type;
* target identity;
* current phase;
* committed resources;
* pending resources;
* expected resolution;
* timestamps;
* validation state.

---

# 61. Derived Storage

Derived Storage contains computed data that may be discarded and rebuilt.

Examples:

* OCR text;
* embeddings;
* thumbnails;
* previews;
* search indexes;
* classification suggestions;
* generated summaries;
* export caches;
* layout analysis;
* render caches.

---

# 62. Derived Storage Rule

> Derived data shall never be required to prove the existence or ownership of authoritative knowledge.

The authoritative source and catalog shall remain sufficient for recovery.

---

# 63. Derived Versioning

Derived artifacts shall identify the processing context that created them.

Depending on artifact type:

```text
SourceVersion
processor version
model version
configuration version
createdAt
checksum
```

---

# 64. Derived Invalidation

Derived data shall be invalidated when its authoritative dependency changes.

Examples:

```text
new SourceVersion
→ invalidate OCR, preview, text extraction and embeddings

new cover revision
→ invalidate thumbnails

metadata update
→ reindex affected search documents
```

---

# 65. Backup Storage

Backup Storage holds recoverable copies of authoritative state.

A complete Master Library backup shall coordinate:

* PostgreSQL catalog state;
* source files;
* cover files;
* authoritative assets;
* manifest;
* recovery state;
* migration state;
* required audit evidence.

---

# 66. Backup Consistency

A backup shall represent a known consistency point.

It shall not combine:

* a database snapshot from one logical state;
* binary files from an incompatible later or earlier state;
* unresolved recovery state without recording it.

---

# 67. Backup Authority

A backup is not active authority while the primary Master Library is operational.

It becomes recovery input only during an explicit restore process.

---

# 68. Search Backup Policy

Derived search indexes need not be included in ordinary backups if rebuild cost is acceptable.

A deployment may back them up for faster disaster recovery.

Their absence shall not invalidate a Master Library backup.

---

# 69. Backup Isolation

Backup destinations should be isolated from the primary data volumes.

A storage failure affecting primary data shall not automatically destroy all backups.

---

# 70. External Backup

At least one backup copy should exist outside the primary NAS storage failure domain.

The exact destination is an operational deployment decision.

---

# 71. Storage Policy Matrix

The following policies are frozen:

| Storage Space         |           Authoritative |                     Versioned | Immutable After Commit |    Rebuildable | Backup Required |
| --------------------- | ----------------------: | ----------------------------: | ---------------------: | -------------: | --------------: |
| Catalog               |                     Yes | Through records and revisions |                     No |             No |             Yes |
| Sources               |                     Yes |                           Yes |                    Yes |             No |             Yes |
| Covers                |                     Yes |                           Yes |                    Yes | Not guaranteed |             Yes |
| Assets                |                     Yes |                           Yes |                    Yes | Not guaranteed |             Yes |
| Search                |                      No |              By index version |                     No |            Yes |        Optional |
| Derived               |                      No |          By processor version |                     No |            Yes |              No |
| Staging               |                      No |              Operation-scoped |                     No |             No |     Normally no |
| Recovery              |  Yes for recovery state |              Operation-scoped |                     No |             No |             Yes |
| Operations            | Yes for operation state |             State transitions |                     No |      Partially |             Yes |
| Temporary             |                      No |                            No |                     No |            Yes |              No |
| Backups               |      Recovery authority |                           Yes |                    Yes | Not applicable |       Protected |
| Client Cache          |                      No |        Remote revision-scoped |                     No |            Yes |              No |
| Personal Client State |      Yes for user state |                           Yes |        Depends on type |             No | CloudKit policy |

---

# 72. Authority Categories

All persisted information belongs to one of four categories.

## 72.1 Authoritative

Loss causes permanent information loss or identity loss.

## 72.2 Operationally Authoritative

Required to resolve or resume an active operation.

## 72.3 Derived

Rebuildable from authoritative inputs.

## 72.4 Temporary

Disposable without recovery.

Every persistent data type shall declare one category.

---

# 73. Cross-Store Consistency

The architecture uses multiple physical storage systems.

PostgreSQL transactions cannot atomically commit filesystem writes.

KnowledgeOS therefore uses application-managed consistency protocols.

---

# 74. Cross-Store Commit Protocol

A cross-store operation shall follow a recoverable state machine.

Typical phases:

```text
Prepared
Staged
Validated
RecoveryRecorded
BinaryCommitted
CatalogCommitted
ConsistencyVerified
Completed
```

Failure at any phase shall have a deterministic recovery action.

---

# 75. No Distributed Transaction Requirement

Version 1 shall not require distributed two-phase commit between PostgreSQL and the filesystem.

Consistency is achieved through:

* immutable writes;
* staging;
* operation state;
* recovery markers;
* idempotent actions;
* post-commit validation;
* reconciliation.

---

# 76. Idempotency

All recovery-sensitive operations shall be idempotent or detect prior completion.

Examples:

* committing the same staged source;
* completing the same catalog record;
* rebuilding the same search projection;
* applying the same recovery action;
* verifying the same backup.

---

# 77. Reconciliation

The system shall provide reconciliation processes that compare:

* catalog records;
* source files;
* cover files;
* checksums;
* recovery markers;
* search-index status;
* backup inventories.

Reconciliation shall identify:

* missing files;
* orphan files;
* mismatched checksums;
* incomplete operations;
* stale indexes;
* contradictory identities.

---

# 78. Transaction Boundaries

PostgreSQL transactions shall protect structured changes.

A transaction shall remain:

* short;
* bounded;
* deterministic;
* free from long file transfers;
* free from remote AI calls;
* free from uncontrolled search-engine operations.

Large file operations occur before or after short catalog transactions.

---

# 79. Locking Strategy

Locking occurs at multiple levels:

```text
database row and advisory locks
application operation locks
publication-scoped locks
maintenance leases
filesystem process locks where required
```

Locks shall be scoped narrowly.

A global Library lock is reserved for:

* migrations;
* full restore;
* certain backup modes;
* critical maintenance;
* layout transformation.

---

# 80. Publication Concurrency

Operations affecting one Publication shall coordinate through Publication identity.

Examples:

* source replacement;
* cover replacement;
* metadata modification;
* deletion;
* integrity repair.

Independent Publications should be processed concurrently.

---

# 81. Bulk Import Architecture

The system shall support bulk ingestion suitable for millions of initial records.

Bulk import shall use:

* import batches;
* staging tables;
* controlled validation;
* PostgreSQL bulk-loading mechanisms;
* deterministic identity assignment;
* batch checkpoints;
* resumable processing;
* asynchronous binary validation;
* incremental indexing.

Per-record HTTP-style insertion loops are insufficient for initial population.

---

# 82. Initial Library Population

Loading more than two million Publications shall be treated as a first-class implementation scenario.

The initial population process shall support:

* restart after failure;
* progress checkpoints;
* duplicate detection;
* partial batch rollback;
* validation reports;
* bounded memory;
* bounded transaction size;
* parallelizable file ingestion;
* deferred derived processing.

---

# 83. Deep Pagination

Catalog traversal shall use cursor or keyset pagination.

Large `OFFSET` pagination is prohibited for deep traversal over millions of records.

Stable ordering keys shall be defined by contracts.

---

# 84. Index Strategy

Database indexes shall support actual access patterns.

The architecture expects:

* primary-key indexes;
* unique identity indexes;
* foreign-key support indexes;
* normalized-title indexes;
* contributor lookup indexes;
* external-identifier indexes;
* partial indexes;
* composite cursor indexes;
* full-text indexes where applicable.

Index creation shall be justified by queries and measured workload.

---

# 85. Partitioning Strategy

PostgreSQL partitioning is not mandatory by default.

It may be used for:

* very large audit tables;
* time-based operational history;
* large append-only event tables;
* measured catalog hotspots.

Partitioning shall not be introduced without operational justification.

---

# 86. Storage Capacity Planning

The deployment shall monitor:

* PostgreSQL volume capacity;
* binary volume capacity;
* search volume capacity;
* backup volume capacity;
* staging high-water mark;
* inode or directory-entry pressure;
* database growth;
* WAL growth;
* temporary-space growth.

Capacity exhaustion shall be detected before writes fail.

---

# 87. NAS Storage Requirements

The NAS storage used by KnowledgeOS shall provide:

* durable persistent volumes;
* reliable filesystem semantics;
* adequate capacity;
* predictable permissions;
* support for large files;
* stable container mounts;
* snapshot or backup integration where available;
* storage health monitoring.

---

# 88. Atomic Rename Assumption

Binary commit may rely on atomic rename only within the same filesystem boundary.

Staging and authoritative binary destinations should share a filesystem where rename-based commits are used.

Cross-volume moves require copy, checksum validation and explicit commit state.

---

# 89. Filesystem Independence

Persistent references shall be relative logical keys.

They shall not store:

* NAS host absolute paths;
* container mount paths;
* Windows drive letters;
* vendor share names;
* container volume identifiers.

A storage adapter resolves logical keys to physical paths.

---

# 90. Container Path Independence

The same Master Library volume may be mounted at different internal paths across deployments.

For example:

```text
/data/master-library
/var/lib/knowledgeos/library
/library
```

Persistent records shall remain valid regardless of mount point.

---

# 91. Security Boundaries

Storage access follows least privilege.

The KnowledgeOS Server shall receive only required credentials and mounts.

PostgreSQL credentials shall not be embedded in:

* container images;
* source code;
* version-controlled files;
* public manifests.

---

# 92. Secrets Management

Secrets shall be supplied through approved deployment mechanisms.

Examples:

* container secrets;
* protected environment injection;
* NAS secret stores;
* mounted secret files with restrictive permissions.

Secrets shall not be stored inside the Master Library binary tree.

---

# 93. Database Access

Only approved KnowledgeOS services may access PostgreSQL.

Reader clients shall never receive:

* database credentials;
* direct database network access;
* SQL interfaces;
* database schema details.

---

# 94. Filesystem Access

Reader clients shall never mount the authoritative Master Library filesystem directly as part of normal operation.

All content access occurs through KnowledgeOS contracts.

---

# 95. Auditability

Authoritative modifications shall emit audit records.

Audit records shall identify:

* operation;
* actor;
* target;
* previous state where applicable;
* resulting state;
* time;
* outcome;
* correlation identifier.

Audit storage shall be protected from ordinary mutation.

---

# 96. Observability

The persistence layer shall expose metrics and diagnostics for:

* database availability;
* connection-pool saturation;
* query latency;
* transaction failures;
* deadlocks;
* storage capacity;
* staging volume;
* recovery backlog;
* checksum failures;
* orphan detection;
* search lag;
* backup age;
* restore verification;
* job backlog.

---

# 97. Failure Domains

The architecture recognizes separate failure domains:

```text
application container failure
worker container failure
PostgreSQL container failure
PostgreSQL volume failure
binary volume failure
search volume failure
backup volume failure
NAS host failure
network interruption
power loss
```

Recovery procedures shall distinguish them.

---

# 98. Application Container Failure

Application-container failure shall not corrupt authoritative data.

On restart, the server shall:

* reconnect to PostgreSQL;
* inspect active operations;
* inspect recovery markers;
* validate leases;
* resume or reconcile incomplete work.

---

# 99. PostgreSQL Container Failure

A PostgreSQL container may be recreated using the same persistent volume.

The container image is replaceable.

The data volume is authoritative.

---

# 100. Search Container Failure

Search-container failure shall not block authoritative catalog writes permanently.

Search operations may degrade temporarily.

Indexing shall resume after recovery.

---

# 101. Worker Failure

Worker failure shall leave durable job state.

Jobs shall be:

* retried;
* resumed;
* failed explicitly;
* reconciled.

No job shall disappear solely because a worker container stopped.

---

# 102. Binary Volume Failure

Loss or corruption of the authoritative binary volume is a critical failure.

Recovery requires:

* validated backup;
* catalog-to-backup reconciliation;
* checksum verification;
* restore workflow.

---

# 103. Database Volume Failure

Loss or corruption of PostgreSQL data is a critical failure.

Recovery requires an approved PostgreSQL restore and coordinated binary consistency validation.

---

# 104. Search Volume Failure

Loss of the search volume is non-catastrophic.

The system shall rebuild indexes from authoritative storage.

---

# 105. Backup Volume Failure

Loss of local backups does not directly alter active authority but creates a critical resilience condition.

The system shall report degraded protection immediately.

---

# 106. Startup Validation

Startup shall validate:

* required volume mounts;
* write capabilities;
* PostgreSQL connectivity;
* database compatibility;
* MasterLibraryId agreement;
* ServerId agreement;
* storage-layout version;
* pending recovery operations;
* migration requirements;
* available capacity;
* search-service status;
* backup status where required.

---

# 107. Readiness States

The server may expose:

```text
Ready
Degraded
ReadOnly
Recovering
Migrating
Incompatible
Unavailable
```

Readiness shall reflect persistence state.

---

# 108. Read-Only Mode

The Master Library may enter read-only mode when:

* PostgreSQL is readable but writes are unsafe;
* binary storage is readable but not writable;
* backup or recovery requires protection;
* capacity is critically low;
* integrity uncertainty exists.

Read-only mode shall reject mutating operations explicitly.

---

# 109. Recovery Mode

Recovery mode is entered when unresolved cross-store operations or consistency failures require repair.

During recovery:

* affected resources may be hidden;
* conflicting writes are blocked;
* recovery actions are audited;
* derived services may remain available for unaffected resources.

---

# 110. Migration Mode

Migration mode applies when database or storage layout transformation is required.

Migrations shall be:

* versioned;
* resumable where practical;
* backed up;
* validated;
* auditable;
* reversible where feasible.

---

# 111. Storage Versioning

The architecture distinguishes:

```text
database schema version
binary storage layout version
manifest format version
search index version
derived processor version
backup format version
```

These versions shall not be conflated.

---

# 112. Backward Compatibility

The server shall refuse unsafe writes when encountering unsupported newer storage formats.

Supported older formats may be migrated explicitly.

Silent interpretation of unknown formats is prohibited.

---

# 113. Data Deletion

Deletion of authoritative data shall be explicit and coordinated.

A deletion workflow shall address:

* catalog visibility;
* dependencies;
* source versions;
* covers;
* assets;
* search projections;
* audit;
* recovery evidence;
* backup retention.

Direct recursive filesystem deletion is prohibited.

---

# 114. Soft and Hard Deletion

Catalog records may support soft deletion for operational safety.

Hard deletion shall occur only through approved maintenance workflows.

Audit history shall remain according to retention policy.

---

# 115. Personal Knowledge Boundary

Personal Reader knowledge shall never be persisted in the Master Library.

This includes:

* reading progress;
* bookmarks;
* personal annotations;
* private notes;
* highlights;
* personal tags;
* personal collections;
* device-specific UI state.

---

# 116. Client Local Storage

Reader clients use local persistence for:

* catalog cache;
* downloaded Publications;
* acquisition staging;
* personal state;
* local derived data;
* recovery state.

Client storage is not Master Library authority.

---

# 117. Client Catalog Cache

The client catalog cache is disposable.

It shall be scoped by:

```text
ServerId
MasterLibraryId
```

Deleting the cache shall not delete personal knowledge.

---

# 118. Client Local Library

Downloaded source files form a disposable Local Library.

They remain tied to:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
```

The NAS Master Library remains source authority.

---

# 119. Client Personal State

Personal state is authoritative for the user.

It synchronizes only through the approved personal-state mechanism, including CloudKit for Apple devices.

It shall never synchronize back into the NAS Master Library.

---

# 120. Storage Service Contracts

Each logical storage service shall expose a stable contract.

## Catalog Storage Contracts

Examples:

* repository operations;
* transaction execution;
* optimistic concurrency;
* batch import;
* query pagination;
* migration state.

## Binary Storage Contracts

Examples:

* stage;
* commit;
* open stream;
* verify checksum;
* quarantine;
* delete;
* enumerate.

## Search Storage Contracts

Examples:

* index;
* remove;
* query;
* rebuild;
* inspect lag.

## Operational Storage Contracts

Examples:

* create operation;
* advance state;
* checkpoint;
* acquire lease;
* complete;
* fail;
* recover.

---

# 121. Repository Boundary

Repositories shall model domain persistence.

They shall not become generic database wrappers.

A repository shall own one coherent aggregate or persistence responsibility.

---

# 122. Unit of Work Boundary

A Unit of Work may coordinate multiple repositories within one PostgreSQL transaction.

It shall not claim atomicity over filesystem or search operations.

Cross-store coordination belongs to operation workflows.

---

# 123. Event Integration

Authoritative changes shall produce events for derived consumers.

Examples:

```text
PublicationCreated
PublicationMetadataChanged
SourceVersionCommitted
CoverRevisionCommitted
PublicationDeleted
```

Event publication shall be reliable relative to the catalog transaction.

---

# 124. Transactional Outbox

A transactional outbox or equivalent durable mechanism shall be used when derived services depend on catalog events.

This prevents catalog commits from being lost to search or worker processing.

---

# 125. Derived Consumer Idempotency

Search, OCR, previews and embeddings shall process events idempotently.

Repeated delivery shall not produce inconsistent state.

---

# 126. Storage Testing Strategy

Testing shall include:

* unit tests;
* integration tests;
* containerized database tests;
* filesystem failure tests;
* recovery tests;
* backup and restore tests;
* scale tests;
* concurrency tests;
* migration tests;
* corruption simulations;
* capacity tests.

---

# 127. Scale Tests

Scale tests shall represent:

```text
more than 2,000,000 Publications
millions of relationships
large catalog scans
bulk imports
concurrent Readers
continuous indexing
backup under load
recovery with large inventories
```

Small synthetic datasets alone are insufficient.

---

# 128. Container Tests

Container tests shall verify:

* container recreation preserves data;
* image upgrades preserve volumes;
* missing mounts fail startup;
* incorrect mounts are detected;
* network isolation works;
* PostgreSQL is not publicly exposed;
* search loss is recoverable;
* secrets are not embedded in images.

---

# 129. Database Tests

Tests shall verify:

* connection-pool limits;
* transaction rollback;
* deadlock handling;
* optimistic concurrency;
* bulk loading;
* cursor pagination;
* repository boundaries;
* migration compatibility;
* backup restore;
* schema integrity.

---

# 130. Binary Storage Tests

Tests shall verify:

* deterministic logical keys;
* staging isolation;
* immutable commits;
* checksum validation;
* orphan detection;
* missing-file detection;
* cross-volume copy behavior;
* quarantine;
* restore;
* permission failures.

---

# 131. Cross-Store Recovery Tests

Tests shall simulate failures:

```text
after staging
after checksum validation
after binary commit
before catalog commit
after catalog commit
before audit completion
before recovery marker removal
```

Every state shall have a deterministic recovery result.

---

# 132. Search Tests

Tests shall verify:

* asynchronous indexing;
* event replay;
* stale index detection;
* full rebuild;
* index-version migration;
* search-service outage;
* catalog operation independence;
* deep pagination.

---

# 133. Backup Tests

Tests shall verify:

* consistent catalog backup;
* binary inventory capture;
* backup manifest integrity;
* checksum validation;
* partial backup detection;
* restore to a clean deployment;
* restore identity agreement;
* search rebuild after restore.

---

# 134. Operational Metrics

Recommended metrics include:

```text
knowledgeos_catalog_records_total
knowledgeos_publications_total
knowledgeos_source_versions_total
knowledgeos_binary_bytes_total
knowledgeos_postgres_connections_active
knowledgeos_postgres_pool_wait_seconds
knowledgeos_storage_capacity_bytes
knowledgeos_staging_bytes
knowledgeos_recovery_operations_pending
knowledgeos_search_index_lag
knowledgeos_backup_age_seconds
knowledgeos_checksum_failures_total
knowledgeos_orphan_entries_total
knowledgeos_bulk_import_records_total
knowledgeos_bulk_import_failures_total
```

Metric labels shall remain bounded.

---

# 135. Storage Architecture Completion Gate

This document is complete when:

```text
[ ] Logical storage services are defined
[ ] Version 1 implementations are defined
[ ] NAS container deployment is defined
[ ] Container ephemerality is defined
[ ] Persistent volume separation is defined
[ ] PostgreSQL authority is defined
[ ] PostgreSQL logical organization is defined
[ ] More-than-two-million-publication scale is defined
[ ] Binary Storage abstraction is defined
[ ] Binary Storage spaces are defined
[ ] Storage policy matrix is defined
[ ] Search Storage is replaceable
[ ] Search is explicitly derived
[ ] Operational Storage is defined
[ ] Recovery markers are defined
[ ] Derived Storage is defined
[ ] Backup Storage is defined
[ ] Cross-store consistency is defined
[ ] Distributed transactions are not required
[ ] Idempotency is defined
[ ] Reconciliation is defined
[ ] Transaction boundaries are defined
[ ] Locking principles are defined
[ ] Bulk import is first-class
[ ] Deep pagination policy is defined
[ ] Partitioning is measurement-driven
[ ] Capacity planning is defined
[ ] Security boundaries are defined
[ ] Failure domains are defined
[ ] Readiness states are defined
[ ] Storage versioning is defined
[ ] Personal state boundary is preserved
[ ] Client storage authority is defined
[ ] Transactional event delivery is defined
[ ] Testing requirements are defined
[ ] No SQLite assumption remains in Master Library authority
[ ] No container-local authoritative storage remains
[ ] No architectural contradiction remains
```

---

# 136. Storage Architecture Invariants

The following invariants are mandatory:

* The Master Library supports more than two million Publications from initial deployment.
* PostgreSQL is the Version 1 authoritative Catalog Storage implementation.
* PostgreSQL internal data resides in a dedicated persistent volume.
* PostgreSQL internal files are managed only by PostgreSQL.
* Authoritative publication binaries are not stored in PostgreSQL.
* Binary Storage is exposed through logical storage contracts.
* The NAS filesystem is the Version 1 Binary Storage implementation.
* Containers are replaceable.
* Container writable layers are never authoritative.
* Persistent volumes survive container recreation.
* Catalog, binary, search, backup and operational data have separate logical volumes.
* Reader clients never access PostgreSQL directly.
* Reader clients never access the authoritative filesystem directly.
* Search data is derived and rebuildable.
* Derived data loss does not imply knowledge loss.
* SourceVersions are immutable after commit.
* Cover revisions are immutable after commit.
* Cross-store operations are recoverable and idempotent.
* PostgreSQL transactions do not include long binary transfers.
* Bulk ingestion is a first-class scenario.
* Deep pagination uses cursors or keysets.
* Persistent storage references are independent of mount paths.
* Secrets are not stored in images or the Master Library tree.
* Personal knowledge never returns to the NAS.
* Local Reader Libraries remain disposable caches.
* Logical identities survive infrastructure changes.
* Physical storage implementations may evolve without changing Domain contracts.

---

# 137. Prohibited Designs

The system shall not:

* use SQLite as the authoritative Master Library database;
* store authoritative catalog state only in files;
* store millions of publication binaries inside PostgreSQL;
* expose PostgreSQL to Reader clients;
* expose NAS filesystem paths through public APIs;
* place PostgreSQL data inside the Master Library binary tree;
* place authoritative data only in container writable layers;
* depend on Docker-specific concepts in Domain contracts;
* couple Search contracts to one search engine;
* make search indexes authoritative;
* execute long file transfers inside database transactions;
* assume filesystem and PostgreSQL commits are atomically distributed;
* use untracked ad hoc recovery;
* use mutable source files;
* overwrite committed SourceVersions;
* use original filenames as binary identities;
* persist absolute container mount paths;
* store secrets in container images;
* allow worker memory to be the only job state;
* use unbounded database connection pools;
* use deep `OFFSET` pagination for large catalog traversal;
* require synchronous OCR or indexing during authoritative commits;
* mix personal Reader state with Master Library storage;
* back up only PostgreSQL while ignoring authoritative binaries;
* back up only binaries while ignoring catalog consistency;
* treat container recreation as a data migration.

---

# 138. Related Documents

## Persistence

* `README.md`
* `DirectoryLayout.md`
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
* `LocalReaderCache.md`
* `LocalLibraryStorage.md`
* `AcquisitionStorage.md`
* `StagingStorage.md`

## Contracts

* `../04-Contracts/CommonTypes.md`
* `../04-Contracts/PublicationContracts.md`
* `../04-Contracts/AcquisitionContracts.md`
* `../04-Contracts/AdministrationContracts.md`
* `../04-Contracts/Versioning.md`
* `../04-Contracts/Compatibility.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 139. Status

**Approved**

The Master Library storage architecture is frozen as:

```text
responsibility-based storage services
+
PostgreSQL authoritative catalog
+
NAS-backed binary storage
+
containerized deployment
+
persistent volume isolation
+
replaceable search storage
+
recoverable cross-store operations
+
immutable source versions
+
rebuildable derived data
+
scale beyond two million Publications
```

The next document is:

```text
01-MasterLibrary/05-Persistence/DirectoryLayout.md
```

It shall define the corrected physical directory and volume layout without embedding PostgreSQL internal files inside the Master Library root.
