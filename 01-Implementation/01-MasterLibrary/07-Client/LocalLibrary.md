
# Master Library Local Library

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Client

**Document:** Local Library

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation model of the KnowledgeOS Local Library.

The Local Library is the persistent client-side working copy used by KnowledgeOS clients to support:

* Offline First operation;
* local browsing;
* local reading;
* local search;
* local annotation;
* local acquisition;
* local AI processing;
* deferred synchronization;
* recoverable user workflows.

The Local Library stores both synchronized authoritative replicas and local client-owned state.

It is not the authoritative Master Library.

---

# 2. Scope

This document defines:

* Local Library identity;
* local storage responsibilities;
* local metadata persistence;
* replicated authoritative state;
* pending local changes;
* local content availability;
* cache management;
* indexing;
* local transactions;
* synchronization state;
* conflict persistence;
* local recovery;
* local migration;
* integrity rules;
* local security;
* operational invariants.

It does not redefine:

* Master Library authority;
* server-side persistence;
* NAS storage layout;
* synchronization protocol contracts;
* authoritative Domain rules;
* client presentation behavior.

---

# 3. Architectural Role

The Local Library is the primary data boundary of the client.

The client normally reads and writes through the Local Library rather than contacting the Master Library Server synchronously.

Its position is:

```text
Client Capabilities

↓

Local Library Ports

↓

Local Catalog and Local Storage

↓

Synchronization State

↓

Master Library Server
```

This separation allows the client to remain useful without continuous connectivity.

---

# 4. Fundamental Principles

The Local Library follows these principles:

* Offline First;
* explicit authority separation;
* durable local changes;
* recoverable workflows;
* deterministic persistence;
* reconstructable derived data;
* bounded storage;
* stable identity;
* integrity verification;
* no hidden data loss;
* explicit synchronization state;
* explicit conflict state.

---

# 5. Authority Model

The Local Library contains multiple classes of data with different authority.

## Replicated Authoritative Data

Confirmed data received from the Master Library Server.

## Pending Local Data

Local changes intended for synchronization but not yet accepted.

## Local-Only User Data

User-created state intentionally scoped to the device or client.

## Derived Data

Reconstructable indexes, previews, thumbnails and render artifacts.

## Operational Data

Jobs, checkpoints, transfer state, diagnostics and recovery records.

These categories shall remain distinguishable in persistence and behavior.

---

# 6. Local Library Identity

Each Local Library has a stable identity.

A Local Library identity includes:

* `LocalLibraryId`;
* associated `MasterLibraryId`;
* owning or registered `DeviceId`;
* creation timestamp;
* format version;
* synchronization protocol version;
* last successful synchronization checkpoint;
* operational status;
* optional display name.

The identity shall be persisted in a dedicated manifest.

---

# 7. Identity Rules

The following rules apply:

* `LocalLibraryId` is globally unique;
* the identifier is not derived from a path;
* moving the Local Library does not change its identity;
* copying a Local Library requires clone detection;
* a copied Local Library shall not silently reuse the same active device state;
* association with a different Master Library requires an explicit migration or reset;
* identity changes are audited locally.

---

# 8. Local Library Manifest

The Local Library manifest describes the local instance.

Example logical structure:

```yaml
localLibrary:
  id: "local-library-id"
  masterLibraryId: "master-library-id"
  deviceId: "device-id"
  createdAt: "2026-07-18T00:00:00Z"
  formatVersion: 1
  syncProtocolVersion: 1
  lastCheckpoint: null
  state: Ready
```

The exact physical format is implementation-specific.

---

# 9. Local Library States

A Local Library may be in one of these states:

* Initializing;
* Ready;
* Offline;
* Synchronizing;
* ReadOnly;
* MigrationRequired;
* RecoveryRequired;
* Degraded;
* Incompatible;
* Closed.

State transitions shall be explicit.

---

# 10. Physical Composition

A Local Library logically contains:

```text
Local Library

├── Manifest
├── Local Catalog
├── Sources
├── Covers
├── Assets
├── Annotations
├── Pending Changes
├── Conflicts
├── Synchronization State
├── Jobs
├── Staging
├── Cache
├── Indexes
├── Recovery
└── Diagnostics
```

The physical layout may vary by platform.

Logical responsibilities shall remain consistent.

---

# 11. Local Catalog

The Local Catalog stores queryable local metadata.

It may contain:

* Publications;
* source descriptors;
* cover descriptors;
* asset descriptors;
* collections;
* relationships;
* annotations;
* local availability;
* synchronization revisions;
* pending overlays;
* conflict references;
* processing state;
* derived presentation fields.

The Local Catalog is optimized for client-side access.

---

# 12. Local Catalog Technology

The physical Local Catalog implementation may use:

* SQLite;
* another embedded relational database;
* a platform-native persistent store;
* an equivalent transactional embedded database.

The selected technology shall support:

* atomic transactions;
* indexed queries;
* schema migration;
* integrity validation;
* crash recovery;
* bounded concurrency.

---

# 13. Catalog Separation

The Local Catalog shall distinguish at least:

* confirmed replicated records;
* pending local mutations;
* local-only state;
* derived projections;
* operational records.

A single effective view may combine them for presentation, but their source and status remain explicit.

---

# 14. Replicated Publication State

Replicated Publication state includes the latest confirmed server state known by the client.

It may contain:

* Publication identity;
* authoritative revision;
* metadata;
* relationships;
* collections;
* source descriptors;
* cover descriptors;
* asset descriptors;
* server processing state;
* synchronization timestamps.

Replicated state can become stale while offline.

---

# 15. Replicated Revision

Every replicated authoritative resource shall preserve its server revision or equivalent version marker.

The revision is used for:

* synchronization;
* stale update detection;
* conflict detection;
* local change base selection;
* result application.

A local change shall reference the authoritative revision from which it was created.

---

# 16. Pending Local Changes

Pending local changes are durable user or application mutations awaiting server acceptance.

Examples include:

* metadata edits;
* new annotations;
* annotation edits;
* relationship changes;
* collection changes;
* local source acquisitions;
* cover updates;
* Asset attachments.

Pending changes shall survive application restart and connectivity loss.

---

# 17. Pending Change Record

A pending change record contains:

* `ChangeId`;
* `LocalLibraryId`;
* operation type;
* target resource type;
* target resource identifier;
* base authoritative revision;
* local logical revision;
* payload reference;
* dependency identifiers;
* actor;
* creation time;
* current state;
* retry count;
* last error;
* idempotency key;
* associated local transaction.

---

# 18. Pending Change States

A pending change may use these states:

```text
Draft
Ready
Queued
Transferring
Submitted
Accepted
Rejected
Conflict
RetryPending
Cancelled
RecoveryRequired
```

State transitions shall be persisted atomically.

---

# 19. Draft Changes

Draft changes represent incomplete user work.

Drafts may include:

* partially edited metadata;
* unfinished notes;
* incomplete annotations;
* unresolved acquisition metadata;
* conflict resolution drafts.

Drafts are local user data.

They are not synchronization-ready until explicitly finalized.

---

# 20. Effective Local Projection

The client may calculate an effective local view using:

```text
Replicated Authoritative State
+
Applicable Pending Changes
+
Local-Only Presentation State
=
Effective Local Projection
```

The projection shall expose whether values are:

* confirmed;
* pending;
* conflicted;
* local-only;
* derived.

---

# 21. Local Content Storage

The Local Library may persist local copies of:

* source documents;
* covers;
* assets;
* extracted text;
* annotation payloads;
* local acquisition sources;
* exported drafts;
* model artifacts;
* render artifacts.

Each content class has explicit authority and eviction rules.

---

# 22. Content Addressing

Local content may be referenced by:

* stable local object identifier;
* checksum;
* source revision identifier;
* logical resource identifier.

Filesystem paths are implementation details.

Paths shall not become Domain identity.

---

# 23. Local Source Storage

Local Source Storage contains:

* downloaded authoritative source revisions;
* locally acquired source candidates;
* source files required by pending changes.

Downloaded authoritative sources may be redownloadable.

Locally acquired unsynchronized sources are unique user data and shall not be evicted.

---

# 24. Local Cover Storage

Local Cover Storage may contain:

* downloaded authoritative covers;
* generated local previews;
* locally selected pending covers;
* thumbnails.

Pending local covers require durable protection.

Generated thumbnails are reconstructable cache.

---

# 25. Local Asset Storage

Local Asset Storage may contain:

* downloaded authoritative Assets;
* locally created Assets;
* annotation drawings;
* local attachments;
* acquisition artifacts;
* processing outputs.

Each Asset shall preserve:

* ownership;
* authority classification;
* checksum;
* lifecycle;
* synchronization state.

---

# 26. Annotation Storage

Annotations shall be persisted separately from ordinary cache.

Annotation storage includes:

* annotation identity;
* target Publication;
* anchor;
* annotation type;
* content;
* geometry;
* style;
* creation metadata;
* local revision;
* synchronization state.

Unsynchronized annotations are protected user data.

---

# 27. Content Availability Model

Each Publication may have local availability state.

Supported logical states include:

* MetadataOnly;
* CoverAvailable;
* PartiallyAvailable;
* SourceAvailable;
* AssetsAvailable;
* FullyAvailable;
* DownloadPending;
* Downloading;
* DownloadFailed;
* Evicted;
* Corrupted.

Availability is local operational state.

---

# 28. Availability Dependencies

A capability may require specific local resources.

Examples:

* browsing requires metadata;
* cover grid requires cover or placeholder;
* reading may require source or rendered content;
* annotation may require stable anchors;
* full-text search requires extracted text;
* semantic search requires embeddings.

The Content Availability Manager resolves these dependencies.

---

# 29. Content Pinning

Pinned content is retained for offline use.

Pinning may apply to:

* one Publication;
* one Collection;
* recent content policy;
* user-selected groups.

Pinned content shall not be evicted under ordinary cache policy.

---

# 30. Download Policy

Downloads may be triggered by:

* explicit user request;
* content pinning;
* opening a Publication;
* synchronization requirement;
* prefetch policy;
* background availability policy.

Download policies shall respect:

* available storage;
* network type;
* battery state;
* user preferences;
* platform limits.

---

# 31. Partial Availability

A Publication may be partially available.

Examples:

* metadata and cover only;
* source without derived indexes;
* selected Assets only;
* rendered pages without original source;
* text extracted but images unavailable.

Capabilities shall declare minimum availability requirements.

---

# 32. Cache Classification

Local cache includes only reconstructable or redownloadable data.

Examples:

* thumbnails;
* rendered pages;
* previews;
* extracted temporary structures;
* derived search projections;
* semantic embeddings;
* layout analysis;
* temporary provider results.

Unique user data shall never be classified as cache.

---

# 33. Cache Ownership

Every cache entry has an owning component.

The owner defines:

* cache key;
* version;
* dependencies;
* size;
* last access;
* rebuild cost;
* eviction eligibility;
* invalidation conditions.

Unowned cache entries are invalid.

---

# 34. Cache Invalidation

Cache invalidation may occur when:

* source revision changes;
* metadata affecting presentation changes;
* rendering configuration changes;
* DPM version changes;
* index version changes;
* model version changes;
* user requests cleanup;
* integrity verification fails.

Invalidation shall not affect authoritative replicas or pending work.

---

# 35. Cache Eviction

Eviction may consider:

* age;
* last access;
* size;
* rebuild cost;
* local storage pressure;
* pinning;
* pending dependencies;
* offline requirements.

Eviction shall be transactional or recoverable.

---

# 36. Storage Pressure Levels

The Local Library may classify storage pressure as:

* Normal;
* Elevated;
* High;
* Critical.

Under increasing pressure, the client may:

1. stop optional prefetching;
2. evict low-value cache;
3. remove reconstructable derived data;
4. pause large downloads;
5. request user action;
6. enter restricted mode.

Unique unsynchronized work remains protected.

---

# 37. Staging Storage

Staging stores incomplete or uncommitted local workflow artifacts.

Examples include:

* acquisition files;
* partial downloads;
* partial uploads;
* import extraction;
* generated covers;
* migration intermediates.

Every staging item shall be associated with a tracked workflow or job.

---

# 38. Staging Record

A staging record includes:

* `StagingItemId`;
* owning workflow;
* owning job;
* source;
* target;
* checksum;
* state;
* creation time;
* last update;
* cleanup eligibility;
* recovery policy.

Untracked staging files are treated as anomalies.

---

# 39. Temporary Storage

Temporary storage is used for short-lived processing.

It may contain:

* decompression outputs;
* transient render inputs;
* temporary thumbnails;
* provider payload fragments;
* conversion intermediates.

Temporary storage shall not contain the only copy of user-created content.

---

# 40. Local Transactions

Local state changes use explicit transactions.

A transaction may coordinate:

* Local Catalog updates;
* pending change registration;
* staging references;
* local revision updates;
* event registration;
* synchronization metadata.

Transactions shall not include active network calls.

---

# 41. Local Commit Model

A local command commit follows:

```text
Validate Intent

↓

Open Local Transaction

↓

Load Local State

↓

Apply Local Operation

↓

Persist Local State

↓

Register Pending Change

↓

Register Local Event

↓

Commit

↓

Publish Event
```

If commit fails, no partial logical change shall be presented as successful.

---

# 42. Local Revision Model

The Local Library may maintain local revisions for pending state.

A local revision:

* identifies a durable local state;
* differs from server authoritative revision;
* supports local history and retry;
* may be replaced by a server-confirmed revision after synchronization.

Local revisions shall never be mistaken for server authority.

---

# 43. Idempotency

Local workflows shall use idempotency where repeated execution may occur.

Examples include:

* acquisition finalization;
* change queueing;
* download completion;
* authoritative result application;
* index update;
* recovery replay.

Repeated execution shall not duplicate logical effects.

---

# 44. Synchronization State

The Local Library persists synchronization state.

It includes:

* server checkpoint;
* local checkpoint;
* active session;
* last successful synchronization;
* last failed synchronization;
* pending transfer records;
* device registration state;
* protocol version;
* capability negotiation result.

---

# 45. Synchronization Checkpoint

A synchronization checkpoint identifies the latest fully applied authoritative change boundary.

The checkpoint advances only after:

* all required metadata is applied;
* required content is validated;
* local transaction commits;
* pending state is reconciled;
* derived update scheduling is recorded.

---

# 46. Transfer Records

Transfer records track uploads and downloads.

A transfer record includes:

* `TransferId`;
* direction;
* resource;
* source revision;
* target revision;
* expected checksum;
* transferred bytes;
* total bytes;
* state;
* retry count;
* temporary path reference;
* associated synchronization session.

---

# 47. Transfer States

Transfer states may include:

* Pending;
* Preparing;
* Transferring;
* Paused;
* WaitingForNetwork;
* Verifying;
* Completed;
* Failed;
* Cancelled;
* RecoveryRequired.

Transfers shall resume only when protocol and checksum rules permit.

---

# 48. Authoritative Result Application

When the server accepts a change, the Local Library shall:

1. receive the authoritative result;
2. validate identity and revision;
3. validate referenced content;
4. open a local transaction;
5. update replicated authoritative state;
6. reconcile or remove the pending change;
7. update availability descriptors;
8. update synchronization checkpoint where applicable;
9. register derived-data invalidation;
10. commit.

The pending change shall not be removed before authoritative state is durable locally.

---

# 49. Rejected Changes

A rejected change remains available for diagnosis or correction.

The Local Library records:

* rejection reason;
* server error code;
* affected resource;
* original proposal;
* retry eligibility;
* required user action.

Rejected user work shall not be silently deleted.

---

# 50. Conflict Storage

Conflicts are first-class persistent records.

A conflict record contains:

* `ConflictId`;
* target resource;
* conflict type;
* base state;
* local proposal;
* authoritative state;
* detected timestamp;
* resolution state;
* resolution draft;
* related pending changes;
* server context;
* local context.

---

# 51. Conflict States

A conflict may be:

* Detected;
* AwaitingUser;
* ResolutionDraft;
* ResolutionReady;
* ResolutionSubmitted;
* Resolved;
* Cancelled;
* RecoveryRequired.

Conflict resolution produces a new explicit change or cancellation.

---

# 52. Conflict Preservation

The Local Library shall preserve enough information to avoid losing either side of the conflict.

Preserved information may include:

* original base;
* local proposed value;
* authoritative value;
* local timestamps;
* authoritative timestamps;
* actors where available;
* dependent changes.

---

# 53. Local Search Indexes

The Local Library may maintain indexes for:

* metadata;
* full text;
* annotations;
* relationships;
* semantic vectors;
* reading positions;
* recent activity.

Indexes are derived state.

---

# 54. Index Freshness

Each index shall track:

* index version;
* source revision;
* last update;
* pending updates;
* corruption state;
* rebuild state.

Search results may expose degraded freshness when appropriate.

---

# 55. Index Update Model

Indexes are updated through durable events or jobs.

Example:

```text
Authoritative or Local Change Committed

↓

Index Update Requested

↓

Background Job Executes

↓

Index Updated

↓

Freshness Marker Advanced
```

A failed index update shall not roll back the underlying user or authoritative change.

---

# 56. Index Rebuild

Index rebuild shall be:

* cancellable where practical;
* checkpointed;
* bounded;
* resumable where practical;
* safe during ordinary reads;
* independent from authoritative state.

The client may provide reduced search capability during rebuild.

---

# 57. Local AI Data

Local AI-related data may include:

* model metadata;
* model cache;
* embeddings;
* prompt templates;
* temporary context;
* local generated suggestions.

AI-derived state shall preserve:

* model identity;
* model version;
* source references;
* creation time;
* authority classification.

---

# 58. Embedding Storage

Embeddings are derived data.

They shall be associated with:

* source resource;
* source revision;
* chunk identity;
* embedding model;
* model version;
* vector dimensions;
* creation time.

Changing the embedding model invalidates incompatible embeddings.

---

# 59. Local-Only Data

The Local Library may contain data intentionally not synchronized.

Examples include:

* device-specific reading layout;
* window state;
* local cache preferences;
* local AI model selection;
* temporary working sets;
* platform integration state.

Local-only data shall be explicitly classified.

---

# 60. User Preferences

User preferences may be stored in:

* platform preference storage;
* Local Library preference records;
* synchronized user profile where supported.

Preferences shall not be mixed with authoritative Publication metadata.

---

# 61. Local Jobs

The Local Library persists jobs when interruption matters.

Job types may include:

* synchronization;
* acquisition;
* download;
* upload;
* indexing;
* text extraction;
* rendering;
* export;
* local AI;
* integrity check;
* migration.

---

# 62. Job Persistence

A persistent job contains:

* `JobId`;
* type;
* state;
* priority;
* owner;
* target;
* progress;
* checkpoint;
* retry policy;
* error;
* created time;
* updated time;
* cancellation state.

Job records shall survive restart.

---

# 63. Job and Data Consistency

A job shall not claim success before its resulting data is durably committed.

If data commit succeeds but job state update fails, recovery shall detect and reconcile the discrepancy.

---

# 64. Local Event Log

The Local Library may maintain a local event log for:

* pending local changes;
* synchronization application;
* job coordination;
* recovery;
* diagnostics.

The event log is not necessarily the authoritative Domain event history.

Its purpose is local durability and coordination.

---

# 65. Recovery Records

Recovery records preserve information about interrupted or inconsistent local workflows.

A recovery record may contain:

* affected operation;
* detected inconsistency;
* evidence;
* safe automatic actions;
* required manual actions;
* resulting state;
* resolution time.

---

# 66. Startup Recovery

When opening a Local Library, the client shall inspect:

* incomplete local transactions;
* open migrations;
* active synchronization sessions;
* incomplete transfers;
* abandoned staging;
* incomplete jobs;
* pending authoritative-result application;
* index inconsistencies;
* manifest inconsistencies.

The Local Library shall not report Ready before critical recovery inspection completes.

---

# 67. Automatic Recovery

Automatic recovery is allowed only for deterministic and non-destructive actions.

Examples include:

* resuming a partial download;
* deleting verified disposable temporary data;
* rebuilding a corrupt index;
* reconciling a completed data commit with incomplete job status;
* rolling back an incomplete local transaction through database recovery.

---

# 68. Manual Recovery

Manual recovery is required when:

* unique unsynchronized data may be affected;
* identity conflicts exist;
* clone detection is triggered;
* migration cannot continue safely;
* pending changes cannot be interpreted;
* local and authoritative state cannot be reconciled automatically.

Manual recovery shall preserve evidence and offer export where possible.

---

# 69. Clone Detection

A Local Library copy may produce duplicated identity.

Clone detection may use:

* `LocalLibraryId`;
* `DeviceId`;
* server registration;
* instance fingerprint;
* synchronization session history.

A detected clone shall not silently synchronize as the original active instance.

---

# 70. Clone Resolution

Clone resolution may include:

* register as a new Local Library;
* preserve local pending work;
* assign new identity;
* reset synchronization checkpoint;
* revalidate pending changes;
* require user confirmation.

Identity reassignment shall not delete local user work.

---

# 71. Local Integrity

Integrity checks may validate:

* manifest;
* database schema;
* database consistency;
* content checksums;
* pending change references;
* transfer references;
* staging ownership;
* index metadata;
* job checkpoints;
* synchronization checkpoint.

---

# 72. Integrity Classification

Integrity failures are classified as:

* DerivedDataFailure;
* RedownloadableReplicaFailure;
* PendingUserDataFailure;
* ManifestFailure;
* CatalogFailure;
* SynchronizationStateFailure;
* SecurityStateFailure.

Recovery priority depends on classification.

---

# 73. Derived Data Failure

Derived data failure may be repaired by:

* deleting the invalid artifact;
* rebuilding the cache;
* rebuilding the index;
* regenerating the preview;
* recomputing embeddings.

No user confirmation is normally required unless the operation is expensive.

---

# 74. Replica Failure

A corrupted downloaded authoritative copy may be:

* removed;
* marked unavailable;
* redownloaded;
* verified against server metadata.

The Local Catalog remains intact if its own integrity is preserved.

---

# 75. Pending User Data Failure

Failure affecting unique unsynchronized data is critical.

The client shall:

* stop destructive cleanup;
* preserve all available evidence;
* enter Recovery Required state where needed;
* offer export or duplication;
* avoid automatic replacement from the server.

---

# 76. Local Backup

A Local Library backup may protect:

* pending changes;
* drafts;
* annotations;
* conflicts;
* staged acquisitions;
* local-only user data;
* manifest and synchronization state.

Downloaded authoritative content may be omitted when safely redownloadable.

---

# 77. Backup Classification

Backup content may be divided into:

* Essential Local Data;
* Recommended Local Data;
* Reconstructable Data;
* Redownloadable Data.

Essential Local Data always includes unique unsynchronized work.

---

# 78. Backup Consistency

Local backup shall use:

* database snapshot;
* application quiescence;
* coordinated file snapshot;
* platform backup mechanism;
* another consistency-preserving approach.

Copying files during uncontrolled mutation may produce an invalid backup.

---

# 79. Restore

Restoring a Local Library requires:

* identity inspection;
* format compatibility;
* integrity validation;
* clone detection;
* credential revalidation;
* server association validation;
* pending change preservation.

A restored copy may require registration as a new local instance.

---

# 80. Migration

Local Library format migration is explicit.

Migration includes:

1. compatibility check;
2. preflight validation;
3. storage capacity check;
4. recovery point creation;
5. migration execution;
6. integrity verification;
7. manifest update;
8. cleanup;
9. readiness transition.

---

# 81. Migration Rules

Migration shall:

* be deterministic;
* be versioned;
* preserve pending user work;
* preserve identities;
* preserve synchronization history where compatible;
* support restart;
* expose progress;
* avoid silent destructive fallback.

---

# 82. Read-Only Migration Mode

When migration is required, the client may open the Local Library in read-only mode.

Read-only mode may permit:

* diagnostics;
* backup;
* export;
* inspection;
* migration preparation.

It shall block unsafe mutations.

---

# 83. Concurrency

The Local Library may be accessed by multiple internal tasks.

Concurrency control shall prevent:

* conflicting local writes;
* duplicated pending changes;
* simultaneous incompatible migrations;
* double job ownership;
* inconsistent synchronization application.

---

# 84. Single-Writer Model

The preferred model is one logical writer for Local Catalog mutations.

Multiple readers may operate concurrently where supported.

Background workers submit writes through controlled application or repository boundaries.

---

# 85. Process Ownership

The main client process normally owns the Local Library.

Extensions or helper processes shall not write directly unless a coordinated multiprocess model is explicitly implemented.

Preferred extension behavior:

* send requests to the main application;
* stage data in an isolated handoff area;
* use a controlled import queue.

---

# 86. Local Locking

Local locking may protect:

* library opening;
* migration;
* synchronization application;
* backup snapshot;
* recovery;
* exclusive maintenance.

Locks shall be recoverable after abnormal termination.

---

# 87. Security

The Local Library shall be protected by:

* platform sandboxing where available;
* restricted filesystem permissions;
* encrypted device storage;
* secure credential storage;
* input validation;
* controlled plugin access;
* diagnostic redaction.

---

# 88. Credential Separation

Authentication credentials and device private keys shall not be stored in the Local Catalog.

They shall use platform-secure secret storage.

The Local Library may store only non-secret references or status.

---

# 89. Sensitive Local Content

The Local Library may contain sensitive knowledge.

The client shall:

* avoid broad filesystem exposure;
* avoid unsafe temporary paths;
* protect diagnostic exports;
* avoid indexing through unrelated system services unless explicitly enabled;
* respect user-controlled privacy settings.

---

# 90. Plugin Access

Plugins shall not receive unrestricted Local Library paths or database access.

Plugin operations shall use capability-scoped services.

Examples include:

* read selected metadata;
* process selected content;
* return proposed results;
* write to isolated staging.

---

# 91. Diagnostics

Local diagnostics may report:

* format version;
* Local Library identity;
* storage usage;
* Catalog health;
* pending change count;
* conflict count;
* job count;
* index state;
* synchronization checkpoint;
* integrity findings.

Sensitive content shall be excluded.

---

# 92. Storage Usage Accounting

The Local Library shall report storage by category:

* authoritative replicas;
* pending local content;
* annotations;
* staging;
* cache;
* indexes;
* models;
* diagnostics;
* recovery data.

This enables safe cleanup decisions.

---

# 93. Cleanup

Cleanup may remove:

* expired temporary files;
* abandoned verified staging;
* stale cache;
* superseded render artifacts;
* rebuildable indexes;
* completed transfer fragments.

Cleanup shall consult ownership and workflow state before deletion.

---

# 94. Cleanup Prohibitions

Cleanup shall never automatically delete:

* pending changes;
* drafts;
* unsynchronized annotations;
* unresolved conflicts;
* active acquisition sources;
* active migration data;
* active recovery evidence;
* pinned content under normal policy.

---

# 95. Testing Requirements

Local Library testing shall include:

* creation;
* opening;
* closing;
* moving;
* clone detection;
* local transaction rollback;
* pending change durability;
* abrupt termination;
* synchronization application;
* conflict persistence;
* cache eviction;
* storage pressure;
* index corruption;
* migration;
* recovery;
* backup and restore;
* security boundary tests.

---

# 96. Mandatory Failure Scenarios

Tests shall cover:

* disk full during local commit;
* application termination during change creation;
* application termination during synchronization result application;
* partial download;
* checksum mismatch;
* Catalog corruption;
* index corruption;
* staging without owner;
* duplicate Local Library copy;
* migration interruption;
* revoked device;
* incompatible server checkpoint;
* unsynchronized annotation under cleanup pressure.

---

# 97. Performance Requirements

The Local Library shall support responsive:

* Catalog browsing;
* Publication lookup;
* pending state lookup;
* local search;
* annotation access;
* synchronization enumeration.

Large derived operations shall execute asynchronously.

---

# 98. Scalability

The Local Library shall support growth in:

* Publication count;
* metadata volume;
* annotations;
* pending changes;
* local content size;
* indexes;
* synchronization history.

Pagination, indexing and bounded queries are mandatory for large collections.

---

# 99. Prohibited Designs

The following are prohibited:

* using filesystem paths as resource identity;
* mixing confirmed and pending state without distinction;
* storing unique user work only in memory;
* treating unsynchronized content as cache;
* deleting pending work during cleanup;
* direct plugin access to the Local Catalog;
* network calls inside local database transactions;
* advancing synchronization checkpoints before local commit;
* removing pending changes before authoritative result application;
* automatic replacement of corrupted unsynchronized data from the server;
* silent Local Library identity reuse after copying;
* untracked staging content;
* hidden destructive migration;
* direct extension writes without coordination;
* storing credentials in Local Library files.

---

# 100. Local Library Invariants

The following invariants are mandatory:

* the Local Library has stable identity;
* the Master Library remains authoritative;
* replicated and pending state remain distinguishable;
* every pending change is durable;
* every pending change references a base authoritative revision where applicable;
* unsynchronized user work is never disposable cache;
* local authoritative replicas preserve server revision markers;
* synchronization checkpoints advance only after successful local application;
* pending changes are removed only after accepted state is durable;
* conflicts are persistent and visible;
* Local Library paths never define Domain identity;
* derived data is reconstructable;
* cache eviction never removes protected local work;
* staging content always has an owning workflow;
* local transactions exclude active network calls;
* interrupted jobs remain recoverable;
* unique local data receives highest recovery priority;
* Local Library copies trigger clone handling;
* migrations are explicit and recoverable;
* credentials remain outside Local Library persistence;
* plugins receive no unrestricted persistence access;
* integrity failures are classified by data authority;
* cleanup is ownership-aware;
* local readiness depends on Local Library integrity, not server availability;
* abrupt termination does not silently lose committed local work.

---

# 101. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/JobSystem.md`
* `00-Architecture/04-Platform/Library/README.md`
* `00-Architecture/04-Platform/Search/README.md`
* `00-Architecture/04-Platform/Sync/README.md`
* `00-Architecture/06-Execution/Runtime/StateManagement.md`
* `00-Architecture/06-Execution/Reliability/Recovery.md`

## Master Library

* `02-TechnicalDesign/ClientDesign.md`
* `02-TechnicalDesign/OfflineModel.md`
* `02-TechnicalDesign/SynchronizationDesign.md`
* `03-Domain/DomainModel.md`
* `03-Domain/States.md`
* `04-Contracts/ClientContracts.md`
* `04-Contracts/SynchronizationContracts.md`
* `05-Persistence/Checksums.md`
* `05-Persistence/Integrity.md`
* `05-Persistence/Recovery.md`
* `06-Server/ServerArchitecture.md`
* `07-Client/README.md`
* `07-Client/ClientArchitecture.md`
* `07-Client/CatalogBrowser.md`
* `07-Client/AcquisitionManager.md`
* `08-Testing/IntegrationTests.md`
* `08-Testing/EndToEndTests.md`
* `09-Operations/BackupRecovery.md`

---

# 102. Status

**Approved**

The Local Library is frozen as the persistent Offline First working copy of the KnowledgeOS Master Library Client.

It stores synchronized authoritative replicas, durable pending local changes, local-only state, reconstructable derived data and recoverable operational state while preserving strict separation between each category.

The Local Library protects unsynchronized user work, supports responsive offline operation and participates in synchronization without becoming independently authoritative over the Master Library.
