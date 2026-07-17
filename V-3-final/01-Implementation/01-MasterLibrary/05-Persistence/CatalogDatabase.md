# Master Library Catalog Database

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Catalog Database

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Storage Baseline:** PostgreSQL Authoritative Catalog + NAS Binary Storage

**Deployment Baseline:** Containerized NAS Deployment

**Scale Baseline:** More Than 2,000,000 Publications at Initial Deployment

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative Catalog Storage service of the KnowledgeOS Master Library and its Version 1 implementation using PostgreSQL.

It establishes:

* catalog responsibilities;
* authority boundaries;
* logical data ownership;
* aggregate persistence;
* transaction boundaries;
* repository rules;
* query rules;
* concurrency control;
* PostgreSQL deployment;
* schema organization;
* key strategy;
* constraints;
* indexing;
* bulk ingestion;
* durability;
* backup;
* recovery;
* maintenance;
* observability;
* scalability;
* testing;
* operational invariants.

The catalog is designed to support more than two million Publications from initial deployment and continued growth without requiring a fundamental architectural redesign.

---

# 2. Scope

This document applies to structured authoritative information stored by the KnowledgeOS Master Library.

It covers:

* Publication records;
* SourceVersion records;
* CoverRevision records;
* Asset records;
* contributors;
* subjects;
* classifications;
* collections;
* relationships;
* external identifiers;
* provenance;
* Master Library identity;
* server identity;
* devices;
* credentials;
* authorization state;
* audit records;
* operations;
* migrations;
* configuration;
* maintenance state;
* backup metadata;
* synchronization metadata where owned by the server.

---

# 3. Explicit Exclusions

This document does not define:

* exact final table definitions;
* complete SQL migration scripts;
* physical source-file layout;
* physical cover-file layout;
* search-engine implementation details;
* Reader SQLite schemas;
* CloudKit schemas;
* personal annotation storage;
* exact backup schedules;
* NAS vendor configuration;
* container orchestration manifests.

The exact relational schema is defined in `CatalogSchema.md`.

---

# 4. Catalog Storage Service

Catalog Storage is the logical persistence service responsible for maintaining the structured authoritative state of the Master Library.

Its Version 1 implementation is:

```text
PostgreSQL 17 or a later explicitly validated compatible version
```

PostgreSQL is an infrastructure implementation.

The Domain and Application layers depend on Catalog Storage contracts, not on PostgreSQL directly.

---

# 5. Core Responsibility

Catalog Storage answers the following questions authoritatively:

* Which Publications exist?
* What is the identity of each Publication?
* Which SourceVersions belong to each Publication?
* Which SourceVersion is current?
* Which CoverRevisions exist?
* Which cover is current?
* Which Assets exist?
* Which contributors are related to each Publication?
* Which metadata values are accepted?
* Where did metadata originate?
* Which collections contain each Publication?
* Which external identifiers are associated with an entity?
* Which operations are active?
* Which changes occurred?
* Which storage objects are expected to exist?
* Which schema and storage versions are active?
* Which devices and credentials are valid?
* Which maintenance or recovery actions are pending?

---

# 6. Catalog Authority

For structured Master Library information, Catalog Storage is authoritative unless a specialized document explicitly assigns authority elsewhere.

Examples of authoritative catalog state:

* Publication lifecycle state;
* current SourceVersion;
* current CoverRevision;
* contributor relationships;
* subject assignments;
* collection membership;
* source checksums;
* binary logical storage keys;
* operation state;
* audit history;
* schema version;
* MasterLibraryId;
* ServerId.

Filesystem manifests supplement the catalog.

They do not replace it.

Search indexes project catalog information.

They do not own it.

---

# 7. Binary Boundary

Catalog Storage does not store authoritative publication binaries.

The following remain in Binary Storage:

* PDF files;
* EPUB files;
* comic archives;
* scanned documents;
* cover images;
* authoritative auxiliary assets.

Catalog Storage stores references to those objects.

A binary reference includes, as applicable:

```text
StorageSpace
LogicalStorageKey
MediaType
ByteLength
ChecksumAlgorithm
ChecksumValue
ObjectState
CreatedAt
CommittedAt
```

---

# 8. Large Object Prohibition

PostgreSQL large objects, binary columns or equivalent mechanisms shall not be used for publication source payloads.

Small technical payloads may be stored in PostgreSQL only when all of the following are true:

* they are naturally structured catalog data;
* they remain operationally small;
* transactional consistency is materially valuable;
* they do not create uncontrolled table growth;
* their storage is explicitly documented.

---

# 9. Architectural Principles

Catalog Storage follows these principles:

* domain-first design;
* aggregate ownership;
* stable identity;
* explicit authority;
* relational integrity;
* bounded transactions;
* deterministic state transitions;
* optimistic concurrency by default;
* database-enforced invariants where possible;
* recoverable cross-store operations;
* append-only audit history;
* scalable query patterns;
* measured optimization;
* technology isolation;
* no hidden persistence behavior.

---

# 10. Domain Independence

The Domain shall not depend on:

* SQL;
* PostgreSQL schemas;
* PostgreSQL types;
* database connection objects;
* transactions from a database driver;
* table names;
* query builders;
* ORM entities;
* database-generated business identities;
* PostgreSQL-specific exceptions.

Persistence adapters translate between domain models and relational representations.

---

# 11. Logical Architecture

The Catalog Storage architecture is:

```text
Domain
    │
    ▼
Application Services
    │
    ▼
Catalog Storage Contracts
    │
    ▼
Repositories and Unit of Work
    │
    ▼
PostgreSQL Adapters
    │
    ▼
PostgreSQL
```

Dependencies point inward toward contracts and domain concepts.

---

# 12. Aggregate-Oriented Persistence

The database is designed around aggregate ownership rather than isolated tables.

Primary aggregate roots include:

```text
Publication
Contributor
Collection
Subject
Asset
Device
Credential
Operation
Backup
Migration
```

Not every relational table represents an aggregate root.

Many tables exist only to persist aggregate internals or relationships.

---

# 13. Publication Aggregate

Publication is the principal Master Library aggregate.

It owns or coordinates:

* Publication identity;
* lifecycle state;
* canonical metadata;
* current SourceVersion;
* SourceVersion history;
* current CoverRevision;
* CoverRevision history;
* metadata revisions;
* selected relationships;
* visibility state;
* deletion state.

The exact boundary between Publication-owned data and independent aggregates is defined in `CatalogSchema.md`.

---

# 14. Contributor Aggregate

Contributor represents a stable identified entity participating in Publication relationships.

Examples:

* author;
* editor;
* translator;
* illustrator;
* narrator;
* compiler;
* photographer.

Contributor identity is independent from the textual contributor credit attached to one Publication.

---

# 15. Collection Aggregate

Collection represents an authoritative server-managed grouping.

Collection membership shall not be inferred solely from filesystem layout.

Collections may be:

* curated;
* imported;
* system-defined;
* rule-backed;
* hierarchical where explicitly supported.

Personal Reader collections do not belong to this aggregate.

---

# 16. Subject Aggregate

Subject represents an authoritative catalog concept used for classification and discovery.

A Subject may have:

* preferred label;
* alternate labels;
* external identifiers;
* hierarchy;
* provenance;
* status;
* version.

---

# 17. Asset Aggregate

Asset represents an authoritative binary resource with stable identity.

Asset storage remains in Binary Storage.

Catalog Storage owns:

* AssetId;
* version;
* media type;
* checksum;
* length;
* logical storage key;
* provenance;
* relationships;
* lifecycle state.

---

# 18. Operation Aggregate

Operation represents durable multi-step work.

Examples:

* acquisition;
* source replacement;
* cover replacement;
* bulk import;
* deletion;
* migration;
* backup;
* restore;
* reconciliation;
* integrity repair.

Operation state is authoritative for execution progress.

---

# 19. Identity Strategy

KnowledgeOS domain identities shall be generated outside PostgreSQL.

PostgreSQL shall not generate business identities through serial or identity columns for primary domain entities.

Approved identity characteristics:

* globally unique;
* stable;
* opaque;
* independent of database location;
* safe for distributed generation;
* suitable for cross-device contracts;
* sortable where the selected identifier format provides ordering.

---

# 20. UUID Strategy

Version 1 uses UUID-compatible KnowledgeOS identifiers.

UUIDv7 is the recommended generation strategy for newly created persistent identities because it provides:

* global uniqueness;
* approximate creation ordering;
* improved index locality compared with fully random UUIDs;
* independence from database sequences.

The exact canonical identity specification remains governed by the Identity architecture documents.

---

# 21. PostgreSQL UUID Type

UUID-compatible identifiers shall use PostgreSQL `uuid` columns.

They shall not be stored as:

* arbitrary text;
* uppercase strings;
* binary application-specific blobs;
* integer surrogates replacing public identity.

---

# 22. Internal Surrogate Keys

Internal numeric surrogate keys are prohibited by default for aggregate identities.

They may be introduced for specialized internal structures only when:

* they are not exposed outside the persistence implementation;
* they materially improve measured performance or storage;
* they do not replace stable domain identities;
* the trade-off is documented.

---

# 23. Revision Numbers

Aggregate-local revisions may use monotonically increasing integers.

Examples:

```text
SourceVersion = 1, 2, 3...
CoverRevision = 1, 2, 3...
MetadataRevision = 1, 2, 3...
```

Revisions are scoped to their owning aggregate.

They are not global identities.

---

# 24. Timestamps

Authoritative timestamps shall use timezone-aware PostgreSQL timestamps.

Recommended type:

```text
timestamp with time zone
```

Application contracts shall treat timestamps as absolute instants.

UTC is the canonical exchange representation.

---

# 25. Created and Updated Timestamps

Mutable authoritative records generally include:

```text
created_at
updated_at
```

Append-only records may include only:

```text
created_at
```

`updated_at` shall reflect persisted authoritative change, not ordinary reads.

---

# 26. Database-Generated Timestamps

PostgreSQL may assign transaction timestamps for persistence events.

Domain event times supplied by the application shall remain distinct when their semantics differ.

Examples:

```text
occurred_at
recorded_at
committed_at
```

These values shall not be conflated.

---

# 27. Optimistic Concurrency

Mutable aggregate roots shall use an explicit concurrency version.

Recommended representation:

```text
version bigint not null
```

Each successful aggregate mutation increments the version.

Updates shall verify the expected previous version.

---

# 28. Concurrency Conflict

When the expected version does not match the persisted version, the repository shall return a domain-neutral concurrency conflict.

The adapter shall not expose raw PostgreSQL row-count behavior or driver exceptions to the Application layer.

---

# 29. Pessimistic Locking

Pessimistic row locks may be used for short, bounded critical sections.

Examples:

* allocating the next SourceVersion;
* allocating the next CoverRevision;
* serializing destructive state transitions;
* coordinating restore state;
* finalizing a critical operation.

Long-running processing shall not hold row locks.

---

# 30. Advisory Locks

PostgreSQL advisory locks may coordinate infrastructure-level critical sections.

Suitable uses include:

* one migration runner;
* one full reconciliation;
* one restore;
* one global backup transition;
* one maintenance operation per MasterLibraryId.

Advisory locks shall not replace durable operation state.

---

# 31. Transaction Model

A PostgreSQL transaction protects one coherent structured state transition.

Transactions shall be:

* short;
* bounded;
* deterministic;
* retryable where appropriate;
* isolated from large binary transfer;
* isolated from remote services;
* isolated from AI processing;
* isolated from search indexing.

---

# 32. Unit of Work

The Unit of Work coordinates repositories inside one PostgreSQL transaction.

It may include:

* aggregate loading;
* aggregate persistence;
* operation-state updates;
* audit insertion;
* outbox insertion;
* invariant validation.

It shall not claim atomicity over Binary Storage or Search Storage.

---

# 33. Transactional Outbox

Catalog changes requiring asynchronous processing shall create an outbox record in the same PostgreSQL transaction.

Examples:

* search indexing;
* OCR;
* preview generation;
* metadata enrichment;
* integrity processing;
* cache invalidation.

The outbox ensures that a committed catalog change is not lost before derived consumers receive it.

---

# 34. Outbox Authority

The outbox is authoritative for pending event delivery.

It is operationally authoritative, not domain authority.

An outbox entry remains pending until an approved consumer-delivery state is recorded.

---

# 35. Event Ordering

Events related to one aggregate shall preserve aggregate revision order.

Global event ordering is not required unless explicitly defined for a specialized workflow.

Consumers shall not infer global transactional semantics from timestamps alone.

---

# 36. Isolation Level

The default transaction isolation level is:

```text
READ COMMITTED
```

This is sufficient for most operations when combined with:

* explicit constraints;
* optimistic versions;
* row locks where required;
* deterministic update predicates.

---

# 37. Higher Isolation

`REPEATABLE READ` or `SERIALIZABLE` may be used for specialized operations when required by correctness.

Examples may include:

* complex invariant validation across multiple mutable sets;
* backup coordination state;
* selected reconciliation commits;
* schema transition control.

Higher isolation shall not be enabled globally without evidence.

---

# 38. Serializable Retry

Transactions using `SERIALIZABLE` shall implement bounded retry for serialization failures.

Retry shall re-execute the complete transaction from fresh state.

It shall not reuse stale aggregates or transaction-bound objects.

---

# 39. Foreign Keys

Authoritative relationships shall use foreign keys where relational ownership and lifecycle allow it.

Foreign keys provide:

* identity validation;
* orphan prevention;
* deletion safety;
* migration correctness;
* restore validation.

Avoiding foreign keys for speculative performance is prohibited.

---

# 40. Referential Actions

Cascade behavior shall be explicit.

`ON DELETE CASCADE` is appropriate only for true aggregate-owned dependent data.

It is prohibited when deletion would cross an independent aggregate boundary without explicit workflow.

---

# 41. Unique Constraints

Business uniqueness that is stable and enforceable shall use database unique constraints.

Examples may include:

* one MasterLibraryId per catalog;
* one SourceVersion number per Publication;
* one CoverRevision number per Publication;
* one active credential fingerprint per defined scope;
* one external identifier per namespace and entity where policy requires uniqueness.

Application checks alone are insufficient.

---

# 42. Check Constraints

Relationally expressible state invariants shall use check constraints.

Examples:

* non-negative byte length;
* positive revision numbers;
* valid state-dependent timestamps;
* non-empty normalized keys;
* supported checksum lengths;
* valid operation progress bounds.

---

# 43. Nullability

Columns shall be nullable only when absence has explicit domain meaning.

Null shall not be used as an undocumented substitute for:

* unknown;
* not applicable;
* not processed;
* deleted;
* pending;
* empty value.

Where these states differ, they require explicit modeling.

---

# 44. Enumerations

Stable small state sets may use:

* PostgreSQL enum types;
* constrained text;
* reference tables.

The choice shall consider migration cost and compatibility.

Rapidly evolving domain classifications should not be frozen prematurely into PostgreSQL enums.

---

# 45. Text Normalization

Human-readable authoritative values preserve their accepted original form.

Search and matching may use separately normalized representations.

Examples:

```text
display_title
normalized_title
sort_title
```

Normalized forms shall not overwrite display values.

---

# 46. Case-Insensitive Matching

Case-insensitive matching shall be explicit.

The implementation may use:

* normalized columns;
* deterministic collations;
* functional indexes;
* `citext` where validated.

Locale-sensitive behavior shall be tested.

---

# 47. Collation

Catalog ordering shall not depend accidentally on host defaults.

Relevant database or column collations shall be selected explicitly.

User-facing linguistic ordering and stable technical ordering may require separate fields or query strategies.

---

# 48. JSONB Usage

JSONB is permitted for structured extensibility where the shape is not yet relationally stable or is provider-specific.

Suitable examples:

* provider payload snapshots;
* external metadata fragments;
* processor configuration;
* compatibility metadata;
* diagnostic context.

---

# 49. JSONB Restrictions

JSONB shall not replace core relational modeling for:

* Publication identity;
* current SourceVersion;
* contributor relationships;
* collection membership;
* permissions;
* operation state;
* audit identity;
* external identifier uniqueness.

Frequently queried JSONB fields shall be promoted to relational columns when their semantics stabilize.

---

# 50. JSON Schema Versioning

Persisted JSONB payloads shall include or inherit a known format version.

Readers shall not assume all rows contain the newest structure.

Migrations or adapters shall handle supported historical versions.

---

# 51. Array Usage

PostgreSQL arrays may be used for small bounded infrastructure values.

They shall not replace relational many-to-many relationships that require:

* indexing;
* provenance;
* ordering;
* additional attributes;
* independent lifecycle;
* referential integrity.

---

# 52. Range Types

PostgreSQL range types may be used where the domain naturally models ranges.

They shall not be introduced only for novelty.

Any use shall define:

* inclusivity;
* emptiness;
* overlap semantics;
* indexing strategy.

---

# 53. Generated Columns

Generated columns may support stable derived relational values.

They shall not encode complex domain logic that belongs in the Domain layer.

Generated expressions must remain deterministic and migration-safe.

---

# 54. Database Functions

Database functions may implement:

* technical normalization;
* maintenance;
* constrained bulk operations;
* integrity helpers;
* migration support.

They shall not become the primary home of business workflows.

---

# 55. Triggers

Triggers are permitted only for narrowly defined persistence concerns.

Acceptable uses may include:

* technical timestamp maintenance;
* immutable audit protection;
* specialized integrity checks;
* notification support;
* partition routing where necessary.

Hidden business behavior in triggers is prohibited.

---

# 56. ORM Independence

The relational model shall not be designed around one ORM.

ORM-generated schemas are not authoritative architecture.

The implementation may use an ORM, query builder or direct SQL adapter, provided:

* SQL behavior remains inspectable;
* migrations are explicit;
* query plans can be analyzed;
* batching is supported;
* PostgreSQL features remain available;
* domain boundaries are preserved.

---

# 57. PostgreSQL Deployment

PostgreSQL runs in a dedicated container.

It owns a dedicated persistent volume.

Recommended topology:

```text
knowledgeos-postgresql
    │
    ├── private container network
    └── postgres-data persistent volume
```

PostgreSQL shall not be exposed directly to Reader clients.

---

# 58. PostgreSQL Version

The baseline implementation targets PostgreSQL 17 or later.

Upgrades require:

* compatibility validation;
* extension validation;
* backup;
* restore testing;
* migration planning;
* rollback planning;
* performance comparison.

---

# 59. Database Identity

The authoritative database has a persistent identity associated with:

```text
MasterLibraryId
ServerId
DatabaseInstanceId
```

The database identity shall agree with the filesystem Master Library manifest.

An accidental connection to another catalog shall be detected.

---

# 60. Database Name

A recommended database name is:

```text
knowledgeos
```

The physical name is deployment configuration.

Application contracts shall not depend on it.

---

# 61. PostgreSQL Schemas

The approved logical schemas are:

```text
catalog
identity
security
audit
operations
configuration
maintenance
```

The default `public` schema shall not contain application tables.

---

# 62. Catalog Schema Responsibility

The `catalog` schema owns:

* Publications;
* SourceVersions;
* CoverRevisions;
* Assets;
* contributors;
* subjects;
* classifications;
* collections;
* catalog relationships;
* external identifiers;
* metadata provenance;
* catalog revisions.

---

# 63. Identity Schema Responsibility

The `identity` schema owns:

* ServerId;
* MasterLibraryId;
* DeviceId;
* UserId where server-owned;
* identity aliases;
* identity bindings;
* identity compatibility state.

---

# 64. Security Schema Responsibility

The `security` schema owns:

* credential metadata;
* access grants;
* roles;
* permissions;
* token references;
* credential revocation;
* security policy state.

Secrets may be stored only in approved encrypted or hashed form.

---

# 65. Audit Schema Responsibility

The `audit` schema owns append-oriented records describing authoritative changes and administrative actions.

It includes:

* audit entries;
* actor references;
* target references;
* before/after summaries where permitted;
* correlation identifiers;
* operation links;
* outcome.

---

# 66. Operations Schema Responsibility

The `operations` schema owns:

* durable operations;
* job state;
* workflow state;
* retries;
* leases;
* checkpoints;
* transactional outbox;
* inbox or consumer checkpoints where required;
* recovery coordination metadata.

---

# 67. Configuration Schema Responsibility

The `configuration` schema owns server-side persistent configuration that is appropriate for relational authority.

It shall not store deployment secrets or container-specific configuration.

---

# 68. Maintenance Schema Responsibility

The `maintenance` schema owns:

* migration state;
* backup metadata;
* restore state;
* reconciliation runs;
* integrity runs;
* maintenance leases;
* capacity reports;
* compatibility checks.

---

# 69. Schema Ownership

Each PostgreSQL schema shall have an explicit owner role.

Application roles shall not automatically own database objects.

Migrations run with a controlled migration role.

Runtime services use restricted roles.

---

# 70. Database Roles

Recommended logical roles:

```text
knowledgeos_owner
knowledgeos_migrator
knowledgeos_server
knowledgeos_worker
knowledgeos_search_reader
knowledgeos_maintenance
knowledgeos_backup
knowledgeos_readonly
```

Exact role names are deployment details.

---

# 71. Owner Role

The owner role owns schemas and database objects.

It shall not be used by ordinary application runtime.

---

# 72. Migration Role

The migration role may:

* create and alter approved objects;
* execute migrations;
* update schema-version state.

It shall not be exposed to Reader-facing services.

---

# 73. Server Role

The server role may execute approved Catalog Storage operations.

It shall not:

* alter schemas;
* manage PostgreSQL roles;
* access PostgreSQL internal files;
* bypass audit policies without explicit procedure.

---

# 74. Worker Role

The worker role shall receive only the permissions required for background jobs.

Where practical, worker access is narrower than server access.

---

# 75. Search Reader Role

A search projection service may receive read-only access to approved catalog projections or consume the outbox.

It shall not receive broad catalog mutation privileges.

---

# 76. Maintenance Role

The maintenance role supports:

* reconciliation;
* integrity verification;
* backup coordination;
* restore coordination;
* controlled repair.

Destructive privileges shall be narrowly granted.

---

# 77. Backup Role

The backup role shall have the minimum permissions required by the chosen PostgreSQL backup method.

---

# 78. Read-Only Role

A read-only administrative role may support inspection and reporting.

It shall not expose sensitive credential material.

---

# 79. Connection Security

PostgreSQL connections shall use:

* private container networking;
* authenticated roles;
* protected credentials;
* encrypted transport when the deployment boundary requires it;
* explicit database and role selection;
* connection timeouts;
* bounded pools.

---

# 80. Connection String Handling

Connection strings shall not be stored in:

* source code;
* committed configuration files;
* container images;
* Master Library manifests;
* logs;
* diagnostics without redaction.

---

# 81. Connection Pooling

KnowledgeOS services shall use bounded pools.

Pool sizing shall account for:

* NAS memory;
* PostgreSQL memory;
* number of server replicas;
* worker concurrency;
* maintenance jobs;
* reserved administrative access.

---

# 82. Pool Invariant

The sum of maximum connections across all services shall remain below PostgreSQL capacity with operational reserve.

A service shall not create one connection per incoming Reader request.

---

# 83. Pool Timeout

Connection acquisition shall have a bounded timeout.

Pool exhaustion shall produce:

* observable metrics;
* structured errors;
* load shedding where appropriate;
* no unbounded request accumulation.

---

# 84. PgBouncer

PgBouncer or another pooling proxy is optional in Version 1.

It may be introduced when measurements show:

* excessive connection churn;
* many service replicas;
* inefficient idle connections;
* PostgreSQL connection pressure.

The architecture shall not require it initially.

---

# 85. Prepared Statements

Prepared statements may improve repeated query execution.

Their use shall be compatible with:

* the selected driver;
* pool mode;
* PgBouncer if later introduced;
* schema migrations;
* query observability.

---

# 86. Statement Timeout

Runtime roles shall use bounded statement timeouts appropriate to their workloads.

Interactive Reader queries and maintenance operations may use different limits.

Unlimited runtime queries are prohibited by default.

---

# 87. Lock Timeout

Mutating operations shall use bounded lock waits.

A blocked operation shall fail or retry deterministically instead of waiting indefinitely.

---

# 88. Idle Transaction Timeout

Idle transactions shall be terminated through PostgreSQL configuration or connection discipline.

An application shall not hold open transactions while waiting for:

* user input;
* file uploads;
* remote APIs;
* AI services;
* worker completion.

---

# 89. Query Model

Catalog queries shall be explicit Application-facing operations.

Examples:

* get Publication by identity;
* list Publications by stable cursor;
* resolve external identifier;
* list SourceVersions;
* list contributor relationships;
* retrieve catalog revision;
* inspect operation status.

Generic unrestricted query exposure is prohibited.

---

# 90. Read Projections

Complex reads may use dedicated projections.

Read projections may be implemented using:

* views;
* materialized views;
* denormalized projection tables;
* search indexes;
* cached API models.

The authoritative write model remains normalized according to integrity needs.

---

# 91. Database Views

Views may provide:

* security boundaries;
* stable read contracts;
* simplified joins;
* compatibility projections;
* administrative reporting.

Views shall not obscure critical performance costs.

---

# 92. Materialized Views

Materialized views may support expensive derived catalog reads.

They are derived data.

They shall define:

* refresh trigger;
* refresh strategy;
* staleness semantics;
* failure behavior;
* index strategy;
* rebuild procedure.

---

# 93. Pagination

Large result sets use cursor or keyset pagination.

A cursor shall encode stable ordering fields and identity.

Examples:

```text
created_at + publication_id
normalized_title + publication_id
updated_at + publication_id
```

---

# 94. Offset Limitation

Small bounded administrative lists may use `OFFSET`.

Deep pagination over millions of rows shall not use large offsets.

---

# 95. Stable Ordering

Every paginated query shall have deterministic total ordering.

Non-unique sort fields shall include a stable tie-breaker such as the entity identity.

---

# 96. Filtering

Filterable fields shall be explicitly supported.

Unrestricted dynamic SQL built from arbitrary client fields is prohibited.

Filter combinations shall be assessed for:

* index support;
* query complexity;
* selectivity;
* security;
* denial-of-service risk.

---

# 97. Sorting

Supported sort modes shall be enumerated by the contract.

Clients shall not supply arbitrary SQL expressions or column names.

---

# 98. Query Result Limits

Every list query shall have a maximum page size.

Administrative export and full traversal use specialized streaming workflows.

---

# 99. Streaming Reads

Large exports or maintenance scans shall use streaming or batched reads.

They shall not load millions of rows into application memory.

---

# 100. Indexing Principles

Indexes exist to support measured access patterns and constraints.

Every non-constraint index shall have:

* owner query or workload;
* expected selectivity;
* maintenance-cost justification;
* monitoring plan.

---

# 101. Primary Indexes

Every authoritative table shall have a primary key or an equivalent documented identity constraint.

---

# 102. Foreign-Key Indexes

Foreign-key columns used in joins, deletes or relationship traversal should be indexed.

PostgreSQL does not automatically create all foreign-key indexes.

---

# 103. Unique Indexes

Unique indexes enforce canonical identity and stable uniqueness rules.

---

# 104. Composite Indexes

Composite indexes shall match actual filter and ordering patterns.

Column order shall reflect:

* equality predicates;
* range predicates;
* ordering;
* selectivity.

---

# 105. Partial Indexes

Partial indexes may support state-focused workloads.

Examples:

```text
active Publications
pending operations
unprocessed outbox entries
non-deleted records
failed jobs eligible for retry
```

The predicate shall remain stable and query-compatible.

---

# 106. Covering Indexes

Included columns may reduce heap access for high-volume read queries.

They shall be used only where measured benefit exceeds write and storage cost.

---

# 107. Expression Indexes

Expression indexes may support:

* normalized titles;
* case-insensitive keys;
* canonical identifiers;
* derived sort values.

The indexed expression shall be deterministic.

---

# 108. GIN Indexes

GIN may be used for:

* PostgreSQL full-text vectors;
* selected JSONB containment;
* arrays where relational design remains appropriate;
* trigram operations with validated extensions.

GIN write cost shall be considered.

---

# 109. GiST Indexes

GiST may be used for specialized range, similarity or geometric behavior where justified.

It is not a default catalog index.

---

# 110. BRIN Indexes

BRIN may support very large naturally ordered append-heavy tables.

Potential candidates:

* audit entries;
* operation history;
* outbox history;
* time-ordered maintenance records.

BRIN suitability shall be validated against physical correlation.

---

# 111. B-Tree Baseline

B-tree is the default index type for:

* identities;
* revisions;
* timestamps;
* normalized keys;
* cursor ordering;
* common equality and range lookups.

---

# 112. Full-Text Search

PostgreSQL full-text search may provide the initial lexical search implementation.

Full-text documents shall be derived from authoritative catalog fields.

---

# 113. Full-Text Vector

Searchable entities may maintain a generated or asynchronously updated `tsvector`.

The implementation shall define:

* included fields;
* field weights;
* language configuration;
* normalization;
* update strategy;
* index;
* rebuild method.

---

# 114. Language Handling

A single language configuration shall not be assumed for all Publications.

The implementation shall support:

* known Publication language;
* language-specific configurations where available;
* a fallback configuration;
* multilingual metadata;
* exact identifier search separately from linguistic search.

---

# 115. Search Separation

PostgreSQL full-text capability is an implementation of Search Storage, not Catalog authority.

Catalog transactions shall not require complete semantic indexing.

---

# 116. Trigram Search

Trigram indexes may support:

* fuzzy title lookup;
* contributor-name lookup;
* administrative duplicate review.

They shall be bounded and measured because large trigram indexes may consume significant storage.

---

# 117. Query Plan Analysis

Important queries shall be validated with:

```text
EXPLAIN
EXPLAIN ANALYZE
BUFFERS
```

Production data privacy and performance impact shall be respected.

---

# 118. Statistics

PostgreSQL planner statistics shall be maintained through autovacuum and analyze.

Extended statistics may be introduced for correlated columns where the planner produces poor estimates.

---

# 119. Query Regression

Critical queries shall have performance regression tests using representative datasets.

A migration shall not be approved when it causes unacceptable plan degradation.

---

# 120. More Than Two Million Publications

The initial catalog baseline includes more than two million Publication rows.

The system shall also expect substantially larger dependent tables.

Possible scale:

```text
Publications: 2,000,000+
SourceVersions: 2,000,000+
Contributor relationships: 10,000,000+
Subjects and classifications: millions
External identifiers: millions
Audit records: continuous unbounded growth
Outbox and operation history: continuous growth
```

---

# 121. Capacity Model

Capacity planning shall consider:

* heap size;
* index size;
* WAL volume;
* temporary query space;
* vacuum overhead;
* migration overhead;
* backup size;
* restore time;
* connection memory;
* sort and hash memory;
* table bloat;
* audit retention.

---

# 122. Row Width

Frequently accessed core rows should remain narrow.

Large optional or provider-specific payloads should be isolated from hot tables.

This improves:

* cache locality;
* index efficiency;
* vacuum efficiency;
* scan cost;
* update behavior.

---

# 123. Vertical Separation

Large or infrequently read attributes may be placed in related tables.

Examples:

* raw provider metadata;
* large descriptions;
* processing diagnostics;
* historical payloads;
* external snapshots.

This is a persistence optimization and shall preserve domain semantics.

---

# 124. TOAST Awareness

PostgreSQL may use TOAST for large values.

The implementation shall not assume large text or JSONB values remain inline.

Repeated updates to large TOASTed values shall be avoided in hot records.

---

# 125. HOT Updates

Table and index design should permit HOT updates where practical for frequently changed non-indexed fields.

This is an optimization, not a domain requirement.

---

# 126. Fillfactor

Custom fillfactor may be used for measured update-heavy tables.

It shall not be applied globally without evidence.

---

# 127. Table Partitioning

Partitioning is not mandatory for core Publication tables at initial scale.

Two million rows alone do not justify partitioning.

---

# 128. Partition Candidates

Partitioning may be considered for:

* audit history;
* outbox history;
* operation events;
* large time-series maintenance data;
* historical processing logs.

Partitioning requires a clear retention, pruning or query benefit.

---

# 129. Partition Risks

Partitioning introduces:

* migration complexity;
* constraint limitations in some designs;
* operational overhead;
* index multiplication;
* query-planning considerations;
* maintenance burden.

It shall not be used as a default performance solution.

---

# 130. Bulk Import

Bulk import is a first-class Catalog Storage capability.

The initial ingestion of more than two million Publications shall not use one transaction per HTTP request.

---

# 131. Import Batch

Every bulk import has a stable BatchId.

The batch tracks:

* source;
* start time;
* state;
* checkpoints;
* accepted records;
* rejected records;
* duplicate candidates;
* validation failures;
* completion;
* audit.

---

# 132. Staging Tables

Large imports should use staging tables separate from authoritative tables.

Staging tables support:

* raw loading;
* normalization;
* validation;
* duplicate analysis;
* constraint prechecking;
* batch reporting;
* controlled merge.

---

# 133. PostgreSQL COPY

The implementation shall support PostgreSQL `COPY` or an equivalent bulk-loading path.

Bulk loaders shall:

* use bounded files or streams;
* validate encoding;
* validate column count;
* record BatchId;
* isolate invalid rows;
* avoid uncontrolled memory growth.

---

# 134. Batch Transaction Size

A multi-million-row import shall use bounded transaction batches.

One transaction for the entire initial library import is prohibited.

Batch size shall be measured based on:

* WAL growth;
* lock duration;
* memory;
* index maintenance;
* rollback cost;
* recovery time.

---

# 135. Deferred Derived Processing

Bulk import shall not synchronously generate all:

* OCR;
* embeddings;
* thumbnails;
* previews;
* external enrichments;
* search projections.

Authoritative ingestion completes first.

Derived processing proceeds asynchronously.

---

# 136. Constraint Validation During Import

Authoritative constraints remain mandatory.

For large migrations, PostgreSQL-supported staged constraint validation may be used where safe and explicitly controlled.

Constraints shall not remain permanently unvalidated.

---

# 137. Duplicate Detection

Duplicate analysis may use:

* external identifiers;
* normalized metadata;
* checksums;
* provider identities;
* source fingerprints.

Duplicate detection does not automatically imply identity merging.

Potential duplicates require explicit policy.

---

# 138. Idempotent Import

Reprocessing the same import batch shall not create uncontrolled duplicate Publications.

Idempotency may use:

* BatchId;
* source-system key;
* deterministic import identity;
* external identifier;
* content checksum;
* operation key.

---

# 139. Import Checkpoints

Large imports shall persist checkpoints.

A checkpoint may record:

* last processed input offset;
* last committed batch;
* accepted count;
* rejected count;
* current phase;
* current schema version;
* source checksum.

---

# 140. Import Recovery

After interruption, the import process shall:

* inspect BatchId;
* validate staging state;
* validate committed batches;
* resume from a known checkpoint;
* avoid replaying committed work incorrectly;
* emit a recovery audit record.

---

# 141. Write Model

Authoritative writes occur through explicit commands.

Examples:

* create Publication;
* update accepted metadata;
* commit SourceVersion;
* commit CoverRevision;
* add contributor relationship;
* add collection membership;
* soft-delete Publication;
* restore Publication;
* complete acquisition.

Generic public CRUD over arbitrary tables is prohibited.

---

# 142. Publication Creation

Publication creation shall atomically establish:

* PublicationId;
* initial lifecycle state;
* initial concurrency version;
* creation audit;
* required identity records;
* outbox events where applicable.

It need not commit a source binary in the same PostgreSQL transaction.

---

# 143. SourceVersion Commit

A SourceVersion catalog commit shall verify:

* Publication exists;
* expected operation exists;
* expected binary logical key is present or prepared;
* checksum and length are known;
* next revision is valid;
* no conflicting revision exists;
* previous current version remains immutable;
* new current version is selected explicitly.

---

# 144. CoverRevision Commit

A CoverRevision catalog commit follows equivalent rules:

* Publication identity validation;
* operation validation;
* binary reference validation;
* checksum;
* unique revision;
* explicit current revision transition;
* audit;
* outbox event.

---

# 145. Metadata Update

A metadata update shall define:

* fields being changed;
* provenance;
* actor;
* expected aggregate version;
* revision behavior;
* validation;
* audit;
* search invalidation.

---

# 146. Relationship Update

Relationship mutations shall validate both sides.

Examples:

* Publication to Contributor;
* Publication to Subject;
* Publication to Collection;
* Publication to Asset.

Cross-aggregate relationship creation shall not silently create missing entities unless the command explicitly supports it.

---

# 147. Soft Deletion

Soft deletion may mark a Publication unavailable without immediately removing relational or binary history.

A soft-deleted Publication retains:

* identity;
* audit;
* versions;
* relationships as policy requires;
* restore possibility;
* deletion metadata.

---

# 148. Hard Deletion

Hard deletion requires a dedicated workflow.

It shall coordinate:

* relational dependencies;
* binary removal;
* search removal;
* outbox events;
* audit retention;
* backup retention;
* recovery evidence.

Direct repository hard deletion from ordinary application paths is prohibited.

---

# 149. Audit Model

Every authoritative mutation shall create an audit entry in the same PostgreSQL transaction when possible.

Audit records include:

```text
AuditId
OperationId
CorrelationId
ActorId
Action
TargetType
TargetId
OccurredAt
RecordedAt
Outcome
Metadata
```

---

# 150. Audit Immutability

Committed audit records are append-only.

Correction of an audit mistake creates another audit record.

Ordinary application roles shall not update or delete audit history.

---

# 151. Audit Payload

Audit payloads shall avoid uncontrolled duplication of large records.

They may contain:

* changed field names;
* selected old/new values;
* references to revisions;
* structured summaries;
* security-safe context.

Sensitive credentials and secrets are prohibited.

---

# 152. Operation State

Operations use explicit state machines.

Generic example:

```text
Created
Prepared
Running
Waiting
Committing
Verifying
Completed
Failed
Cancelled
RecoveryRequired
```

Each operation type defines its valid transitions.

---

# 153. Operation Transition Constraint

An operation transition shall verify the expected previous state.

Invalid transitions shall be rejected.

---

# 154. Operation Lease

Workers may acquire time-bounded leases for operations.

A lease includes:

```text
owner
acquired_at
expires_at
renewed_at
attempt
```

A lease does not replace operation state.

---

# 155. Job Retry

Retry state shall persist:

* attempt count;
* next eligible time;
* last failure;
* error category;
* retry policy reference.

Retries shall be bounded or require manual intervention.

---

# 156. Inbox Pattern

Consumers may use an inbox table or equivalent deduplication record to process external or internal messages idempotently.

The deduplication key shall be stable.

---

# 157. MVCC

PostgreSQL MVCC permits readers and writers to operate concurrently.

The application shall understand that:

* old row versions remain until vacuum;
* long transactions delay cleanup;
* repeated updates create dead tuples;
* snapshots affect visibility;
* transaction age requires monitoring.

---

# 158. Long Transaction Prohibition

Long-running open transactions are prohibited because they may:

* retain dead rows;
* increase table bloat;
* delay vacuum;
* retain locks;
* increase replication or backup pressure;
* consume connection capacity.

---

# 159. WAL

PostgreSQL Write-Ahead Logging provides transactional durability and crash recovery.

WAL is PostgreSQL internal state.

The application shall not manipulate WAL files directly.

---

# 160. WAL Capacity

Capacity planning shall account for WAL generated by:

* bulk imports;
* index creation;
* metadata updates;
* migrations;
* maintenance;
* backups.

Unexpected WAL growth shall trigger operational alerts.

---

# 161. WAL Archiving

WAL archiving may be used when point-in-time recovery is required.

Its adoption shall define:

* archive destination;
* retention;
* encryption;
* verification;
* restore procedure;
* capacity monitoring.

---

# 162. Point-in-Time Recovery

Point-in-time recovery is recommended for authoritative production deployments.

It supplements, but does not replace, coordinated binary backups.

Restoring only PostgreSQL to a historical instant may create binary inconsistency unless the binary snapshot corresponds to the same consistency point.

---

# 163. Checkpoints

PostgreSQL checkpoints shall be configured to balance:

* crash recovery time;
* write spikes;
* WAL volume;
* NAS storage performance;
* memory;
* durability.

Aggressive checkpoint tuning without measurement is prohibited.

---

# 164. Synchronous Commit

Authoritative catalog commits shall use durable synchronous commit behavior.

Disabling durable commit is prohibited for authoritative state.

Specialized derived tables may use weaker guarantees only through an explicit design.

---

# 165. fsync

PostgreSQL `fsync` shall remain enabled for authoritative production operation.

Disabling it invalidates durability guarantees.

---

# 166. Full-Page Writes

PostgreSQL durability settings required for crash safety shall remain enabled unless an approved PostgreSQL operational review proves an alternative safe.

---

# 167. Autovacuum

Autovacuum is mandatory.

It shall be monitored and tuned per workload where necessary.

Disabling autovacuum globally is prohibited.

---

# 168. Vacuum Strategy

High-churn tables may require table-specific autovacuum settings.

Candidates:

* operations;
* outbox;
* job leases;
* active configuration;
* mutable Publication metadata;
* security sessions where applicable.

---

# 169. Vacuum Freeze

Transaction ID age and freeze progress shall be monitored.

The system shall alert before wraparound risk becomes critical.

---

# 170. Analyze

Planner statistics shall remain current.

Bulk imports and major migrations may require explicit `ANALYZE`.

---

# 171. Bloat Monitoring

The maintenance subsystem shall monitor table and index bloat.

Remediation may include:

* vacuum;
* reindex;
* table rewrite;
* online maintenance;
* schema redesign.

Destructive maintenance requires backup and operational control.

---

# 172. REINDEX

Reindexing shall be performed through approved maintenance workflows.

Concurrent techniques should be preferred where service availability matters and PostgreSQL supports them.

---

# 173. Index Creation

Large production indexes should use online or concurrent creation where appropriate.

The migration shall define:

* expected build time;
* lock behavior;
* extra disk requirement;
* failure cleanup;
* rollback.

---

# 174. Statistics Monitoring

Important indicators include:

* sequential scans;
* index scans;
* rows returned;
* rows filtered;
* dead tuples;
* cache hit ratio;
* temporary file usage;
* lock waits;
* query duration;
* autovacuum activity.

Metrics shall be interpreted in workload context.

---

# 175. Backup Architecture

Catalog backups shall use PostgreSQL-supported methods.

Approved categories:

* logical backup;
* physical backup;
* snapshot-coordinated physical backup;
* continuous archiving for point-in-time recovery.

---

# 176. Logical Backup

Logical backup is useful for:

* portability;
* selective inspection;
* smaller environments;
* schema-level recovery;
* upgrade workflows.

At large scale it may be slower to create and restore.

---

# 177. Physical Backup

Physical backup is useful for:

* faster full recovery;
* large databases;
* point-in-time recovery;
* operational continuity.

It requires version and configuration compatibility.

---

# 178. Backup Consistency Identifier

Each catalog backup shall have a BackupId.

It shall record:

* MasterLibraryId;
* ServerId;
* database schema version;
* storage-layout version;
* backup method;
* start time;
* completion time;
* consistency position;
* binary backup relationship;
* verification state.

---

# 179. Coordinated Backup

A complete KnowledgeOS backup coordinates:

```text
PostgreSQL catalog backup
+
Master Library binary backup
+
recovery-state snapshot
+
compatibility manifest
```

The coordination method is defined in `BackupRestore.md`.

---

# 180. Backup Verification

A backup is not considered valid solely because a command completed successfully.

Verification shall include:

* PostgreSQL backup validation;
* checksum verification;
* manifest validation;
* identity validation;
* restore test according to policy;
* binary-reference consistency.

---

# 181. Restore

Restore is an explicit controlled operation.

It shall not overwrite an active catalog casually.

Restore phases include:

```text
Prepare
Validate backup
Restore staging
Restore PostgreSQL
Restore binaries
Validate identities
Reconcile references
Rebuild derived data
Activate
Audit
```

---

# 182. Restore Identity

A restored database shall match the expected:

* MasterLibraryId;
* ServerId policy;
* storage layout;
* binary backup;
* schema version;
* compatibility range.

---

# 183. Disaster Recovery

Disaster recovery shall address:

* complete NAS loss;
* PostgreSQL volume loss;
* binary volume loss;
* catalog corruption;
* accidental deletion;
* failed migration;
* ransomware or malicious modification;
* backup-volume loss.

---

# 184. Corruption Detection

Potential catalog corruption may be detected through:

* PostgreSQL errors;
* failed checksums where applicable;
* invalid constraints;
* impossible domain state;
* missing pages or relations;
* backup verification failure;
* catalog-to-binary reconciliation mismatch.

---

# 185. Corruption Response

On suspected corruption, the system shall:

* stop unsafe writes;
* preserve evidence;
* enter degraded or recovery mode;
* identify the failure boundary;
* validate backups;
* avoid ad hoc destructive repair;
* audit the incident.

---

# 186. Migrations

Database migrations are explicit, versioned and ordered.

Every deployed database has a recorded schema version.

---

# 187. Migration Ownership

Only the approved migration component may change the relational schema.

Ordinary runtime code shall not create or alter tables automatically.

---

# 188. Migration Record

Each migration records:

```text
MigrationId
Version
Checksum
Description
AppliedAt
AppliedBy
ExecutionDuration
Outcome
CompatibilityRange
```

---

# 189. Migration Checksum

Applied migration content shall be checksummed.

Changing an already applied migration is prohibited.

Corrections require a new migration.

---

# 190. Transactional Migrations

Migrations should execute transactionally where PostgreSQL permits.

Non-transactional steps shall be explicitly declared and recoverable.

---

# 191. Expand and Contract

Compatibility-sensitive migrations should use expand-and-contract:

```text
add new structure
→ deploy compatible readers/writers
→ migrate data
→ switch usage
→ remove old structure later
```

This reduces deployment risk.

---

# 192. Large Data Migrations

Large data transformations shall be:

* batched;
* resumable;
* checkpointed;
* observable;
* rate-limited;
* compatible with continued operation where possible.

A single unbounded table rewrite is prohibited without explicit downtime planning.

---

# 193. Migration Backup

Critical migrations require a validated pre-migration backup.

The backup must include both catalog and affected binary state where cross-store semantics may change.

---

# 194. Downgrade

Automatic downgrade is not assumed.

Rollback may require:

* application rollback;
* compatibility mode;
* reverse migration;
* restore from backup.

Each migration shall declare its downgrade characteristics.

---

# 195. Observability

Catalog Storage shall expose metrics for:

```text
database availability
active connections
pool usage
connection waits
transaction duration
transaction failures
deadlocks
lock waits
query latency
slow queries
rows affected
table growth
index growth
dead tuples
vacuum activity
WAL volume
checkpoint activity
temporary file usage
backup age
migration state
outbox backlog
operation backlog
```

---

# 196. Slow Query Logging

Slow query thresholds shall be configured per environment.

Logs shall avoid exposing sensitive values unnecessarily.

Parameterized query identity should remain observable.

---

# 197. Query Correlation

Database activity should be traceable to:

* request correlation;
* OperationId;
* JobId;
* service role;
* repository operation.

Correlation shall use safe application metadata and logging.

---

# 198. Health Check

Database health checks shall validate:

* network connection;
* authentication;
* expected database;
* expected MasterLibraryId;
* supported schema version;
* read capability;
* write capability where required;
* migration state;
* recovery state.

A simple TCP connection is insufficient for readiness.

---

# 199. Readiness

The server is not ready for normal writes when:

* schema migration is required;
* MasterLibraryId mismatches;
* restore is active;
* critical recovery is pending;
* PostgreSQL is read-only unexpectedly;
* required constraints are invalid;
* capacity is critically low.

---

# 200. Maintenance Windows

Some operations may require controlled maintenance windows.

Examples:

* major PostgreSQL upgrade;
* large blocking migration;
* full restore;
* storage identity repair;
* significant reindex;
* corruption recovery.

---

# 201. Performance Targets

Exact performance targets shall be established through representative benchmarks.

Initial design objectives include:

* identity lookup with indexed constant-time behavior;
* paginated catalog reads without deep offset;
* bounded metadata-update transactions;
* scalable bulk loading;
* concurrent Reader access;
* asynchronous derived processing;
* predictable recovery state.

No arbitrary latency number is frozen without hardware measurements.

---

# 202. Representative Dataset

Performance validation shall use a dataset representing at least:

```text
2,000,000 Publications
multiple SourceVersions
multiple contributor relationships
external identifiers
subjects and collections
large metadata text
continuous audit records
pending operations
outbox events
```

---

# 203. Query Benchmark Categories

Benchmarks shall include:

* Publication lookup by ID;
* external identifier resolution;
* normalized title search;
* contributor-to-Publication traversal;
* collection pagination;
* recently updated pagination;
* SourceVersion history;
* active operation listing;
* outbox draining;
* bulk insert;
* metadata update;
* soft deletion;
* reconciliation scan.

---

# 204. Concurrent Workload Tests

Tests shall combine:

* Reader queries;
* bulk import;
* metadata updates;
* background indexing;
* audit insertion;
* backup;
* autovacuum;
* maintenance.

Single-query benchmarks alone are insufficient.

---

# 205. Failure Tests

Catalog tests shall simulate:

* container termination;
* connection loss;
* transaction rollback;
* serialization failure;
* deadlock;
* lock timeout;
* disk-full condition;
* read-only database;
* failed migration;
* corrupted backup;
* mismatched MasterLibraryId;
* duplicate outbox delivery.

---

# 206. Container Recreation Test

Recreating the PostgreSQL container with the same persistent volume shall preserve the complete catalog.

Recreating the container without the correct volume shall fail identity validation rather than initialize silently.

---

# 207. Backup Restore Test

A clean environment shall be able to restore:

* PostgreSQL catalog;
* matching binary backup;
* identities;
* operations;
* audit;
* compatibility state.

Derived indexes may then be rebuilt.

---

# 208. Repository Tests

Each repository shall test:

* identity lookup;
* missing entity;
* insert;
* update;
* optimistic conflict;
* relational constraints;
* transaction rollback;
* pagination;
* mapping correctness;
* domain error translation.

---

# 209. Migration Tests

Every migration shall be tested against:

* empty database;
* representative existing database;
* previous supported schema version;
* large dataset where relevant;
* interrupted execution where possible;
* rollback or recovery path.

---

# 210. Security Tests

Tests shall verify:

* runtime roles cannot alter schemas;
* Reader clients cannot access PostgreSQL;
* search roles cannot mutate catalog authority;
* audit rows cannot be modified by ordinary roles;
* secrets are not logged;
* backup role permissions are bounded.

---

# 211. Catalog Database Invariants

The following invariants are mandatory:

* Catalog Storage is the authoritative owner of structured Master Library state.
* PostgreSQL is the Version 1 Catalog Storage implementation.
* The initial scale exceeds two million Publications.
* Publication binaries are not stored in PostgreSQL.
* Domain identities are generated independently of PostgreSQL.
* UUID-compatible identifiers use PostgreSQL `uuid`.
* Domain and Application layers do not depend on SQL or PostgreSQL.
* Persistence is aggregate-oriented.
* Structured invariants use constraints where possible.
* Mutable aggregate roots use optimistic concurrency versions.
* PostgreSQL transactions remain short and bounded.
* Binary transfers do not occur inside PostgreSQL transactions.
* Cross-store atomicity is implemented through recoverable workflows.
* Derived processing uses a transactional outbox or equivalent durable mechanism.
* Reader clients never connect directly to PostgreSQL.
* PostgreSQL runs with durable production settings.
* `fsync` remains enabled.
* Autovacuum remains enabled.
* Deep catalog pagination uses cursors or keysets.
* Bulk import uses staging and bulk-loading mechanisms.
* The catalog uses one logical PostgreSQL database in Version 1.
* Application tables are organized into explicit schemas.
* Runtime roles do not own database objects.
* Search indexes are not catalog authority.
* Audit history is append-only.
* Applied migrations are immutable.
* Critical backups are coordinated with Binary Storage.
* Restore validates MasterLibraryId and binary compatibility.
* Container recreation does not alter catalog identity.
* No PostgreSQL internal path is exposed through application contracts.

---

# 212. Prohibited Designs

The system shall not:

* use SQLite as authoritative Master Library Catalog Storage;
* store publication binaries in PostgreSQL;
* generate public domain identities from database sequences;
* expose PostgreSQL directly to Reader clients;
* place application tables in an unmanaged `public` schema;
* let runtime application roles own schemas;
* let runtime code auto-create production schemas;
* use unrestricted generic CRUD as the public persistence model;
* expose ORM entities as domain models;
* hold database transactions during file transfer;
* hold database transactions during remote AI or network calls;
* use unbounded connection pools;
* use large `OFFSET` pagination over the catalog;
* disable foreign keys for speculative performance;
* store core relationships only in JSONB;
* use triggers for hidden business workflows;
* treat materialized views as authority;
* treat search indexes as authority;
* disable autovacuum;
* disable `fsync`;
* acknowledge unsafe authoritative commits;
* modify applied migrations;
* run unbounded multi-million-row imports in one transaction;
* rely on in-memory operation state;
* delete audit records through ordinary application paths;
* restore PostgreSQL without validating matching binary state;
* copy active PostgreSQL data files through application code;
* initialize a new catalog silently when the expected persistent volume is missing.

---

# 213. Catalog Database Completion Gate

This document is complete when:

```text
[ ] Catalog Storage responsibility is defined
[ ] Structured authority is defined
[ ] Binary boundary is defined
[ ] Aggregate ownership is defined
[ ] Domain independence is defined
[ ] Identity strategy is defined
[ ] UUID strategy is defined
[ ] Revision strategy is defined
[ ] Timestamp semantics are defined
[ ] Optimistic concurrency is defined
[ ] Transaction boundaries are defined
[ ] Isolation policy is defined
[ ] Foreign-key policy is defined
[ ] Constraint policy is defined
[ ] JSONB policy is defined
[ ] Repository boundary is defined
[ ] Unit of Work is defined
[ ] Transactional outbox is defined
[ ] PostgreSQL deployment is defined
[ ] PostgreSQL version baseline is defined
[ ] Logical schemas are defined
[ ] Database roles are defined
[ ] Connection pooling is defined
[ ] Query and pagination rules are defined
[ ] Index strategy is defined
[ ] Full-text role is defined
[ ] Partitioning policy is defined
[ ] Bulk import is first-class
[ ] COPY usage is defined
[ ] Audit behavior is defined
[ ] Operation persistence is defined
[ ] MVCC implications are defined
[ ] WAL and checkpoint responsibilities are defined
[ ] Autovacuum is mandatory
[ ] Backup categories are defined
[ ] Coordinated backup is defined
[ ] Restore requirements are defined
[ ] Migration rules are defined
[ ] Observability is defined
[ ] Scale tests are defined
[ ] Failure tests are defined
[ ] Security tests are defined
[ ] No SQLite Master Library assumption remains
[ ] No authoritative binary-in-database design remains
[ ] No architectural contradiction remains
```

---

# 214. Related Documents

## Persistence

* `README.md`
* `StorageArchitecture.md`
* `DirectoryLayout.md`
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

## Contracts

* `../04-Contracts/CommonTypes.md`
* `../04-Contracts/PublicationContracts.md`
* `../04-Contracts/AdministrationContracts.md`
* `../04-Contracts/Versioning.md`
* `../04-Contracts/Compatibility.md`

---

# 215. Status

**Approved**

The Master Library Catalog Storage implementation is frozen as:

```text
aggregate-oriented authoritative catalog
+
PostgreSQL 17+
+
one logical database
+
bounded technical schemas
+
UUID-compatible stable identities
+
relational integrity
+
optimistic concurrency
+
short transactions
+
transactional outbox
+
bulk import support
+
cursor pagination
+
durable WAL-backed persistence
+
coordinated backup and recovery
+
scale beyond two million Publications
```

The next document is:

```text
01-MasterLibrary/05-Persistence/CatalogSchema.md
```

It shall define the concrete relational model, tables, columns, keys, constraints, relationships and indexes that implement the Catalog Storage architecture established in this document.
