# Storage Integration

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Storage

**Document:** README

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model governing integration between KnowledgeOS and physical or external storage systems.

Storage Integration provides controlled access to storage capabilities through stable Integration contracts and replaceable Storage Providers.

The Storage Integration layer isolates KnowledgeOS from the implementation details of:

* local filesystems;
* Network Attached Storage;
* removable storage;
* cloud object storage;
* remote filesystem services;
* platform-specific storage APIs;
* future storage technologies.

Storage Integration does not define:

* canonical knowledge semantics;
* Knowledge Object identity;
* Library organization;
* synchronization semantics;
* Domain invariants;
* document structure;
* Universal Document Model semantics;
* Document Presentation Model semantics.

The Library owns the logical organization and Source of Truth policy of KnowledgeOS knowledge.

Storage Integration provides the physical capabilities required to persist and retrieve that knowledge.

---

# 2. Scope

This document governs:

* Storage Integration boundaries;
* Storage Provider contracts;
* storage locations;
* storage capabilities;
* physical object addressing;
* logical storage references;
* read operations;
* write operations;
* atomic replacement;
* move operations;
* copy operations;
* deletion;
* metadata inspection;
* directory enumeration;
* storage availability;
* storage health;
* capacity;
* connectivity;
* filesystem integration;
* NAS integration;
* removable storage;
* remote storage;
* cloud storage;
* credential isolation;
* path safety;
* concurrency;
* consistency;
* failure handling;
* retries;
* observability;
* security;
* privacy;
* offline behavior;
* Plugin interaction;
* Provider interaction.

This document does not govern:

* Library semantics;
* canonical Knowledge Object structure;
* Domain identity;
* synchronization algorithms;
* conflict resolution;
* cache policy;
* backup policy as a complete subsystem;
* Provider-specific protocol implementation.

---

# 3. Architectural Position

Storage Integration belongs to the Integration layer.

```text
02-Domain
    │
    ▼
04-Platform
    │
    ▼
05-Integration
    │
    ▼
Storage Provider
    │
    ▼
Physical Storage System
```

The dependency direction shall remain inward toward stable KnowledgeOS contracts.

Physical storage systems shall never define Domain semantics.

---

# 4. Core Principle

Storage Integration provides physical storage capabilities.

It does not define canonical knowledge semantics.

The correct architecture is:

```text
Knowledge Semantics
        │
        ▼
Library Engine
        │
        ▼
Storage Integration Contract
        │
        ▼
Storage Provider
        │
        ▼
Physical Storage
```

The following model is prohibited:

```text
Physical Storage Layout
        │
        ▼
Defines Domain Model
```

---

# 5. Mission

The mission of Storage Integration is to allow KnowledgeOS to use heterogeneous storage systems while preserving:

* user ownership;
* portability;
* Provider independence;
* stable logical identity;
* Source of Truth semantics;
* failure isolation;
* offline operation;
* recoverability;
* observability.

---

# 6. Design Philosophy

Storage Integration shall be:

* Provider-independent;
* capability-driven;
* contract-based;
* path-safe;
* failure-aware;
* observable;
* replaceable;
* portable;
* compatible with Offline First operation;
* independent from Domain semantics.

---

# 7. Storage Roles

KnowledgeOS distinguishes several architectural storage roles.

These roles include:

* Source of Truth Storage;
* Local Working Storage;
* Cache Storage;
* Temporary Storage;
* Export Destination Storage;
* Backup Storage.

A physical storage system may fulfill one or more roles.

The roles themselves remain logically distinct.

---

# 8. Source of Truth Storage

Source of Truth Storage contains the authoritative persistent representation of the Library.

For the primary KnowledgeOS architecture, the NAS is the intended Library Source of Truth.

```text
Library
    │
    ▼
NAS Storage Provider
    │
    ▼
NAS
Source of Truth
```

---

# 9. Source of Truth Ownership

The Library Engine determines which configured storage location acts as the Source of Truth.

The Storage Provider does not decide this policy.

---

# 10. NAS as Source of Truth

The NAS is the primary intended Source of Truth for the KnowledgeOS Library.

This means that canonical Library persistence is ultimately represented in storage controlled by the user.

The NAS shall remain accessible through the Storage Integration boundary.

---

# 11. NAS Is Not the Domain

The NAS stores physical representations.

It is not:

* the Domain model;
* the Knowledge Graph;
* the Kernel;
* the Library Engine;
* the synchronization system.

---

# 12. Local Working Storage

Local Working Storage supports active local operation.

It may contain:

* locally available working copies;
* staged changes;
* local indexes;
* execution artifacts;
* synchronization state.

Local Working Storage shall not silently replace the configured Source of Truth.

---

# 13. Cache Storage

Cache Storage contains reproducible or disposable data used to improve performance.

Examples may include:

* rendered previews;
* thumbnails;
* derived indexes;
* temporary parsed representations;
* remote content cache.

Cache loss shall not imply canonical knowledge loss.

---

# 14. Temporary Storage

Temporary Storage supports bounded intermediate operations.

Examples include:

* Import staging;
* Export staging;
* OCR intermediate files;
* conversion output;
* remote execution packages.

Temporary Storage is not canonical persistence.

---

# 15. Export Destination Storage

Export Destination Storage receives generated artifacts.

Exported artifacts are external representations.

They do not automatically become canonical Library state.

---

# 16. Backup Storage

Backup Storage contains recovery copies.

Backup and Source of Truth are distinct roles.

A backup shall not automatically become the active Source of Truth.

---

# 17. Storage Location

A Storage Location represents a configured logical storage destination or source.

A Storage Location may represent:

* local directory;
* NAS share;
* mounted volume;
* removable volume;
* remote object store;
* cloud storage namespace.

---

# 18. Storage Location Identity

Every persistent Storage Location shall have stable Storage Location Identity.

Storage Location Identity shall remain distinct from:

* physical path;
* mount point;
* network address;
* Provider Identity.

---

# 19. Location Mobility

A Storage Location may move physically while preserving logical identity.

Examples include:

* NAS mount path changes;
* network address changes;
* removable volume mount changes.

Physical location shall not define canonical knowledge identity.

---

# 20. Storage Provider

A Storage Provider implements storage capabilities for a particular storage technology or protocol.

Examples may include:

* Local Filesystem Provider;
* NAS Filesystem Provider;
* Object Storage Provider;
* Cloud Storage Provider;
* Removable Storage Provider.

---

# 21. Provider Boundary

The architecture is:

```text
Platform
    │
    ▼
Storage Contract
    │
    ▼
Storage Provider
    │
    ▼
Storage Technology
```

Platform components shall not depend directly upon storage-specific APIs.

---

# 22. Provider Model

Storage Providers shall follow the common Provider architecture defined in:

`../Providers/ProviderModel.md`

Storage-specific requirements extend that common model.

---

# 23. Storage Provider Identity

Every configured Storage Provider shall have stable Provider Identity.

Provider Identity shall remain distinct from Storage Location Identity.

One Provider may manage multiple Storage Locations.

---

# 24. Storage Capability

Storage Providers expose explicit capabilities.

Possible capabilities include:

* Read;
* Write;
* Create;
* Delete;
* Move;
* Copy;
* List;
* Metadata;
* AtomicReplace;
* Watch;
* Lock;
* Versioning;
* Streaming;
* RangeRead.

---

# 25. Capability Discovery

KnowledgeOS shall not assume every Storage Provider supports every capability.

Capabilities shall be:

* declared;
* discovered;
* configured;
* validated.

---

# 26. Capability Degradation

If a Provider lacks an optional capability, KnowledgeOS may use an alternative strategy where architectural guarantees remain preserved.

The system shall not emulate a capability unsafely.

---

# 27. Required Capabilities

A Storage Location used as a Library Source of Truth shall satisfy the minimum capabilities required by the Library architecture.

The exact minimum capability set shall be explicit.

---

# 28. Read Capability

Read capability allows retrieval of stored content.

Read operations shall define:

* logical reference;
* expected content behavior;
* error semantics.

---

# 29. Write Capability

Write capability allows creation or replacement of physical content.

Writes shall not bypass Library ownership of canonical persistence decisions.

---

# 30. Atomic Replace

Where canonical persistence requires safe replacement, the Storage Provider should support atomic replacement or an architecture providing equivalent recovery guarantees.

---

# 31. Atomicity Limitations

Not all storage systems provide identical atomicity guarantees.

Provider contracts shall declare actual guarantees.

KnowledgeOS shall not assume stronger atomicity than the storage system provides.

---

# 32. Move Capability

Move semantics may differ between:

* same filesystem;
* different volumes;
* remote storage;
* object storage.

Provider contracts shall define whether move is:

* atomic;
* copy-and-delete;
* unsupported.

---

# 33. Copy Capability

Copy operations shall preserve content according to the defined storage contract.

Copy does not imply preservation of all physical filesystem metadata unless explicitly supported.

---

# 34. Delete Capability

Deletion semantics shall be explicit.

Possible behaviors include:

* immediate deletion;
* soft deletion;
* trash;
* versioned deletion;
* deferred deletion.

The Library shall not assume one deletion model across all Providers.

---

# 35. List Capability

Enumeration shall be bounded.

Large storage locations shall support:

* pagination;
* streaming;
* continuation;
* another bounded mechanism.

Unbounded directory loading is prohibited.

---

# 36. Metadata Capability

Storage metadata may include:

* size;
* modification time;
* creation time where available;
* content type;
* checksum;
* physical Version;
* Provider-specific metadata.

Storage metadata is not automatically Domain metadata.

---

# 37. Physical Metadata Versus Domain Metadata

The following distinction is mandatory:

```text
Storage Metadata
        ≠
Knowledge Metadata
```

Filesystem timestamps shall not automatically become canonical knowledge timestamps.

---

# 38. Storage Reference

A Storage Reference identifies physical or logical content within a Storage Location.

A Storage Reference shall not become canonical Knowledge Object Identity.

---

# 39. Logical Reference

KnowledgeOS should prefer logical storage references over raw absolute physical paths in internal contracts.

---

# 40. Physical Path

A physical path is Provider-specific addressing information.

It shall remain behind the Storage Integration boundary where practical.

---

# 41. Path Independence

Canonical identity shall not depend upon absolute filesystem path.

Moving a Knowledge Object physically shall not necessarily change its canonical identity.

---

# 42. Path Normalization

Filesystem Providers shall normalize paths according to the applicable platform and filesystem semantics.

---

# 43. Path Traversal Protection

Any path derived from external or Plugin input shall be protected against:

* `..` traversal;
* absolute path escape;
* symbolic-link escape;
* mount escape;
* namespace escape.

---

# 44. Root Boundary

Every filesystem Storage Location shall define an authorized root boundary.

Operations shall remain inside that boundary unless explicitly authorized otherwise.

---

# 45. Symbolic Links

Symbolic-link behavior shall be explicit.

Providers shall prevent symbolic links from bypassing configured storage boundaries where required.

---

# 46. Case Sensitivity

Storage Providers shall account for filesystem case sensitivity or case preservation.

KnowledgeOS shall not assume identical path semantics across platforms.

---

# 47. Unicode Paths

Storage Providers shall handle Unicode path normalization carefully.

Logical identity shall not depend upon accidental differences in filesystem Unicode normalization.

---

# 48. Reserved Names

Providers shall account for platform-specific reserved names and path restrictions.

These restrictions shall not leak into Domain identity.

---

# 49. Storage Namespace

A Storage Location defines a bounded namespace.

The namespace may contain:

* Library content;
* managed Assets;
* metadata representations;
* Provider-specific physical structures.

The namespace shall remain controlled by the owning Platform subsystem.

---

# 50. Storage Layout

Physical storage layout is an implementation and portability concern.

It shall not become the Domain model.

---

# 51. Human Accessibility

Where compatible with architectural guarantees, KnowledgeOS should preserve human-accessible storage representations.

This supports:

* user ownership;
* portability;
* recovery;
* reduced vendor lock-in.

---

# 52. Open Formats

Storage Integration shall support the broader architectural preference for open and portable formats where practical.

---

# 53. Storage Serialization

Physical persistence serialization shall use explicitly defined formats.

Storage Providers shall not invent Domain serialization semantics.

---

# 54. Data Exchange Separation

Storage serialization and Canonical Data Exchange are distinct concerns.

A storage representation may differ from an exchange package.

---

# 55. Library Ownership

The Library Engine owns:

* Library organization;
* Source of Truth policy;
* logical object placement;
* canonical persistence decisions.

Storage Integration owns:

* physical access;
* Provider adaptation;
* storage capability execution.

---

# 56. Responsibility Boundary

```text
Library Engine
    │
    ├── What is stored
    ├── Why it is stored
    ├── Which representation is canonical
    └── Which location is Source of Truth

Storage Integration
    │
    ├── How bytes are read
    ├── How bytes are written
    ├── How locations are addressed
    └── What physical guarantees exist
```

---

# 57. Storage Does Not Own Knowledge Lifecycle

Storage Providers shall not decide:

* Knowledge Object creation;
* Knowledge Object deletion semantics;
* knowledge versioning;
* provenance;
* relationships;
* semantic identity.

---

# 58. Storage Does Not Own Synchronization

Storage Integration shall not implement hidden synchronization semantics.

Synchronization belongs to the dedicated Synchronization architecture.

---

# 59. Storage Does Not Own Cache Policy

Cache policy belongs to the appropriate Platform and Execution architecture.

A Storage Provider may provide storage capabilities used by a cache.

It does not define cache semantics.

---

# 60. Storage Does Not Own Backup Policy

Storage Providers may be used as backup destinations.

They do not define complete backup and recovery policy.

---

# 61. NAS Integration

NAS integration is a first-class architectural requirement.

The NAS may be accessed through technologies such as:

* mounted filesystem protocols;
* network storage protocols;
* Provider-specific APIs.

The exact implementation shall remain replaceable.

---

# 62. NAS Availability

The NAS may become temporarily unavailable because of:

* network loss;
* device shutdown;
* mount failure;
* authentication failure;
* storage failure.

KnowledgeOS shall treat NAS unavailability as an expected operational condition.

---

# 63. NAS Unavailability

NAS unavailability shall not automatically prevent:

* reading locally available content;
* editing locally available working copies;
* creating locally staged work;

where the Offline First architecture permits it.

---

# 64. Source of Truth Unavailability

When the Source of Truth is unavailable, KnowledgeOS shall distinguish:

* canonical persisted state;
* local working state;
* pending synchronization state.

---

# 65. No Silent Source of Truth Replacement

A local cache or working copy shall not silently become the new Source of Truth because the NAS is unavailable.

---

# 66. Reconnection

When the NAS becomes available again, reconciliation shall occur through the Synchronization architecture.

Storage Integration only reports and provides storage availability.

---

# 67. Storage Watch

Some Providers may support change watching.

Watch capability may report:

* created objects;
* modified objects;
* deleted objects;
* moved objects.

---

# 68. Watch Is Not Synchronization

Storage change notifications are signals.

They do not define synchronization semantics.

---

# 69. Watch Reliability

Filesystem and remote storage watchers may:

* miss events;
* duplicate events;
* coalesce events;
* reorder events.

Critical state shall not rely exclusively upon watcher delivery.

---

# 70. Reconciliation After Watch Failure

KnowledgeOS may perform storage reconciliation when watcher reliability is uncertain.

---

# 71. External Modification

Users or external tools may modify user-owned Library files outside KnowledgeOS.

The architecture shall treat external modification as a supported condition where the storage model permits it.

---

# 72. External Modification Detection

Detection may use:

* watcher events;
* metadata comparison;
* checksums;
* periodic reconciliation.

---

# 73. External Modification Is Untrusted Input

Externally modified storage content shall be validated before being accepted into canonical processing.

---

# 74. External Deletion

External deletion of canonical physical content is a significant condition.

KnowledgeOS shall not recreate or delete related state blindly without reconciliation.

---

# 75. External Rename

Physical rename shall not necessarily change canonical Knowledge Object Identity.

Identity resolution belongs to the Library and Domain architecture.

---

# 76. Checksums

Storage Providers may support checksum calculation or retrieval.

Checksums may assist:

* integrity verification;
* change detection;
* deduplication;
* synchronization.

---

# 77. Checksum Semantics

Checksum algorithm and scope shall be explicit.

A checksum identifies content according to an algorithm.

It is not canonical Knowledge Object Identity.

---

# 78. Integrity

Storage Integration should detect physical corruption where practical.

Integrity mechanisms may include:

* checksums;
* validation;
* Provider guarantees.

---

# 79. Corruption

Detected corruption shall be surfaced explicitly.

Corrupted content shall not be silently treated as valid canonical state.

---

# 80. Write Strategy

Canonical writes should follow a safe persistence strategy appropriate to the Provider.

A common filesystem strategy may be:

```text
Create Temporary Representation
        │
        ▼
Write
        │
        ▼
Flush / Validate
        │
        ▼
Atomic Replace
```

The exact strategy depends upon Provider guarantees.

---

# 81. Partial Write Protection

KnowledgeOS shall minimize the risk that interrupted writes leave canonical content in an invalid partial state.

---

# 82. Temporary Write Files

Temporary write artifacts shall:

* have bounded lifecycle;
* be distinguishable from canonical content;
* support cleanup and recovery.

---

# 83. Write Verification

Critical writes may be verified through:

* successful close;
* metadata inspection;
* checksum;
* read-back verification;

according to policy.

---

# 84. Durability

Provider contracts shall describe actual durability guarantees where relevant.

A successful API response does not necessarily imply durable physical persistence unless the Provider guarantees it.

---

# 85. Flush Semantics

Filesystem flush semantics vary.

KnowledgeOS shall not claim stronger crash durability than the underlying storage stack provides.

---

# 86. Network Filesystem Semantics

Network filesystems may differ from local filesystems in:

* latency;
* locking;
* caching;
* atomicity;
* availability;
* failure behavior.

NAS Providers shall expose relevant limitations.

---

# 87. Object Storage Semantics

Object storage may differ from filesystem semantics.

Differences may include:

* immutable object writes;
* key-based addressing;
* eventual consistency;
* no native rename;
* Provider-specific versioning.

The Integration contract shall normalize only what can be normalized safely.

---

# 88. Semantic Leakage Prohibition

KnowledgeOS shall not pretend that all storage systems have identical semantics.

Provider-specific guarantees shall remain explicit.

---

# 89. Consistency

Storage consistency characteristics may include:

* strong consistency;
* eventual consistency;
* session consistency;
* Provider-specific behavior.

The Provider shall declare relevant characteristics.

---

# 90. Read-After-Write

KnowledgeOS shall not assume immediate read-after-write visibility unless the Provider guarantees it.

---

# 91. Concurrency

Multiple operations may access the same storage content concurrently.

Concurrency behavior shall be explicit.

---

# 92. Concurrent Writers

Concurrent canonical writers require coordination through the Library and Synchronization architecture.

Storage Integration alone shall not define knowledge conflict resolution.

---

# 93. Locking

A Storage Provider may support physical locking.

Physical locks are not Domain locks.

---

# 94. Lock Reliability

Network or distributed storage locks may fail or expire.

KnowledgeOS shall not depend upon unreliable locks as the sole protection of canonical invariants.

---

# 95. Optimistic Concurrency

Where supported, Storage Providers may expose:

* entity tags;
* object versions;
* modification tokens;
* generation numbers.

These may support optimistic concurrency.

---

# 96. Conditional Write

A conditional write may require that the physical Version still matches an expected Version.

This can reduce accidental overwrite.

---

# 97. Conflict Detection

Storage-level conflict detection identifies physical concurrency.

Knowledge-level conflict resolution belongs to Synchronization and Domain semantics.

---

# 98. Transactions

Most heterogeneous storage systems do not support distributed transactions.

KnowledgeOS shall not assume atomic transactions across:

* NAS;
* local storage;
* cloud storage;
* databases;
* external services.

---

# 99. Multi-Object Atomicity

Multi-object atomicity shall not be assumed unless explicitly guaranteed.

Workflows requiring multi-object consistency shall define recovery mechanisms.

---

# 100. Failure Model

Storage operations may fail because of:

* location unavailable;
* network failure;
* authentication failure;
* authorization failure;
* capacity exhaustion;
* quota exhaustion;
* read-only storage;
* path invalidity;
* concurrent modification;
* corruption;
* Provider failure;
* device removal.

---

# 101. Failure Categories

Stable failure categories may include:

* StorageUnavailable;
* StorageUnauthorized;
* StorageReadOnly;
* StorageNotFound;
* StorageAlreadyExists;
* StorageConflict;
* StorageCapacityExceeded;
* StorageQuotaExceeded;
* StorageCorrupted;
* StorageOperationUnsupported;
* StorageTimeout;
* StorageProviderFailure.

---

# 102. Error Translation

Provider-specific errors shall be translated into stable Storage Integration error categories.

Raw Provider exceptions shall not cross the Integration boundary.

---

# 103. Failure Isolation

Failure of one Storage Location shall not:

* crash the Kernel;
* corrupt unrelated Storage Locations;
* invalidate unrelated Providers;
* disable locally available knowledge unnecessarily.

---

# 104. Retry

Storage operations may be retried only when semantics permit.

---

# 105. Read Retry

Transient read operations are often retryable.

Retry shall remain bounded.

---

# 106. Write Retry

Write retry requires idempotency analysis.

An ambiguous write outcome shall not be repeated blindly.

---

# 107. Ambiguous Write

A network failure may occur after a remote storage system commits a write but before KnowledgeOS receives confirmation.

The outcome may be unknown.

---

# 108. Write Reconciliation

Ambiguous writes shall be reconciled through:

* metadata;
* Version;
* checksum;
* content verification;

where possible.

---

# 109. Idempotency

Storage operations requiring retry safety shall define idempotency semantics.

---

# 110. Copy and Move Retry

Copy and move operations may create partial or duplicate physical state.

Retry behavior shall be Provider-aware.

---

# 111. Delete Retry

Delete operations should be idempotent where Provider semantics permit.

Deleting an already absent object may be treated according to explicit contract.

---

# 112. Timeout

Storage operations shall have bounded timeout behavior where remote or network access is involved.

---

# 113. Timeout Does Not Prove Failure

A timeout does not necessarily mean a remote storage operation did not complete.

---

# 114. Cancellation

Long-running storage operations should support cancellation where practical.

Cancellation may be best effort.

---

# 115. Capacity

Storage Providers may expose:

* total capacity;
* available capacity;
* quota;
* usage.

Capacity information may be approximate.

---

# 116. Capacity Policy

KnowledgeOS may use capacity information to:

* warn users;
* prevent unsafe operations;
* select temporary storage;
* manage caches.

---

# 117. Capacity Exhaustion

Capacity exhaustion shall fail explicitly.

KnowledgeOS shall not silently discard canonical data to free space.

---

# 118. Cache Eviction

Disposable cache data may be evicted according to cache policy.

Canonical data shall never be treated as disposable cache.

---

# 119. Removable Storage

Removable storage may disappear at any time.

KnowledgeOS shall handle device removal as an expected operational event.

---

# 120. Device Identity

A removable Storage Location shall not rely solely upon its current mount path for identity.

---

# 121. Unexpected Removal

Unexpected removal during write may produce ambiguous or partial physical state.

Recovery and validation shall occur when the device returns.

---

# 122. Cloud Storage

Cloud storage is an optional Storage Integration target.

Cloud storage shall not become mandatory for core KnowledgeOS operation.

---

# 123. Cloud Provider Independence

Cloud-specific APIs shall remain behind Storage Providers.

---

# 124. Cloud Credentials

Cloud credentials shall use approved secure credential infrastructure.

They shall not enter:

* Domain state;
* Library content;
* Plugin manifests;
* logs.

---

# 125. Data Egress

Writing user knowledge to remote or cloud storage is data egress.

It shall follow:

* user configuration;
* privacy policy;
* authorization;
* Provider trust.

---

# 126. Encryption

Storage encryption may exist at:

* device level;
* filesystem level;
* Provider level;
* application level.

The exact encryption architecture shall be explicit.

---

# 127. Encryption Does Not Replace Authorization

Encrypted storage still requires access control and credential protection.

---

# 128. Credential Isolation

Storage credentials shall remain behind the Integration and Provider boundaries.

---

# 129. Credential Scope

A Storage Provider shall receive only credentials required for its configured Storage Locations.

---

# 130. Plugin Isolation

Plugins shall not receive raw storage credentials.

---

# 131. Plugin Storage Access

Plugins requiring storage access shall use explicit Plugin capabilities and bounded storage abstractions.

---

# 132. Plugin Sandbox

A Plugin may receive access to:

* Plugin-owned storage;
* explicitly granted Library Resources;
* temporary storage.

It shall not receive unrestricted filesystem or NAS access by default.

---

# 133. MCP Isolation

MCP clients shall not receive direct Storage Provider access.

MCP Resources shall use approved public projections.

---

# 134. AI Isolation

AI models shall not receive:

* storage credentials;
* unrestricted paths;
* direct NAS access.

AI processing receives only explicitly selected content.

---

# 135. Public API Isolation

Public API clients shall not access raw Storage Providers.

Public APIs operate through approved Platform capabilities.

---

# 136. Storage Provider Registration

Storage Providers shall be registered through the common Provider architecture.

---

# 137. Storage Location Registration

Registering a Storage Location shall validate:

* Provider;
* configuration;
* accessibility;
* required capabilities;
* security policy.

---

# 138. Source of Truth Registration

Assigning a Storage Location as Source of Truth is a privileged Library operation.

It is not merely a Storage Provider configuration change.

---

# 139. Source of Truth Migration

Changing the Source of Truth requires an explicit migration process.

It shall not occur through simple configuration reassignment.

---

# 140. Migration

Storage migration may require:

* source validation;
* destination validation;
* data transfer;
* integrity verification;
* identity preservation;
* cutover;
* recovery plan.

---

# 141. Migration Does Not Change Canonical Identity

Moving canonical physical storage shall preserve Knowledge Object Identity unless an explicit Domain operation changes it.

---

# 142. Storage Availability

A Storage Location may have states such as:

* Available;
* Degraded;
* Unavailable;
* ReadOnly;
* Unauthorized;
* Missing;
* Unknown.

---

# 143. Storage Health

Storage health is operational state.

It is not canonical knowledge.

---

# 144. Health Checks

Health checks shall be bounded and shall not create excessive storage load.

---

# 145. Connectivity

Connectivity state may differ from actual storage usability.

A network connection does not guarantee:

* authorization;
* write access;
* capacity;
* integrity.

---

# 146. Observability

Storage Integration shall be observable.

Observable metadata may include:

* Provider Identity;
* Storage Location Identity;
* operation type;
* duration;
* result;
* failure category;
* data-size category;
* availability state.

---

# 147. Logging

Logs shall not expose by default:

* credentials;
* sensitive content;
* unrestricted absolute user paths;
* NAS authentication information.

---

# 148. Path Redaction

Where paths may reveal sensitive user information, logs should use:

* logical references;
* bounded relative paths;
* redacted physical paths.

---

# 149. Metrics

Storage metrics may include:

* read operations;
* write operations;
* failures;
* latency;
* bytes read;
* bytes written;
* availability;
* capacity;
* retry count;
* reconciliation count.

---

# 150. Tracing

A storage trace may represent:

```text
Library Operation
      │
      ▼
Storage Contract
      │
      ▼
Provider Adapter
      │
      ▼
Physical Storage
```

---

# 151. Audit

Security-sensitive storage operations may produce audit records.

Examples include:

* Source of Truth change;
* Storage Location registration;
* credential change;
* destructive bulk deletion;
* remote storage activation;
* data migration.

---

# 152. Storage Commands

Possible Integration commands include:

* RegisterStorageLocation;
* UpdateStorageLocation;
* EnableStorageLocation;
* DisableStorageLocation;
* RemoveStorageLocation;
* ValidateStorageLocation;
* MigrateStorageLocation.

Canonical Library writes shall remain owned by the appropriate Platform workflows.

---

# 153. Storage Queries

Possible queries include:

* GetStorageLocation;
* ListStorageLocations;
* GetStorageCapabilities;
* GetStorageAvailability;
* GetStorageHealth;
* GetStorageCapacity;
* ValidateStorageReference.

---

# 154. Storage Events

Operational events may include:

* StorageLocationRegistered;
* StorageLocationAvailable;
* StorageLocationUnavailable;
* StorageLocationDegraded;
* StorageLocationReadOnly;
* StorageCapacityLow;
* StorageOperationFailed;
* ExternalStorageChangeDetected.

These are operational events.

---

# 155. Event Boundary

Storage events shall not automatically become Domain Events.

---

# 156. External Change Event

An external storage change event indicates that physical state may have changed.

It may trigger:

* validation;
* reconciliation;
* synchronization.

It shall not directly mutate canonical knowledge.

---

# 157. Offline First

Storage Integration shall support the Offline First architecture.

Core locally available knowledge shall remain usable when remote Storage Locations are unavailable.

---

# 158. NAS Offline Operation

When the NAS is unavailable, KnowledgeOS may continue using authorized local working state.

The system shall clearly track divergence from the Source of Truth.

---

# 159. Pending Storage Work

Operations requiring unavailable remote storage may become pending only when their semantics permit safe deferral.

---

# 160. Deferred Write

Deferred canonical persistence shall be coordinated with the Synchronization architecture.

Storage Integration shall not independently invent synchronization behavior.

---

# 161. Reconnection

When a Storage Location reconnects, KnowledgeOS shall:

* revalidate availability;
* inspect relevant physical state;
* delegate reconciliation to the appropriate architecture.

---

# 162. Synchronization Boundary

The relationship is:

```text
Storage Integration
        │
        ├── Reads physical state
        ├── Writes physical state
        └── Reports capabilities and changes

Synchronization
        │
        ├── Detects divergence
        ├── Compares versions
        ├── Resolves transfer direction
        └── Coordinates reconciliation
```

---

# 163. Backup Boundary

Backup uses Storage Integration capabilities.

Storage Integration itself does not define:

* backup schedule;
* retention generations;
* restore policy;
* disaster recovery objectives.

---

# 164. Import Boundary

Import may read source files through Storage Integration.

Imported content enters canonical knowledge only through the Import architecture.

---

# 165. Export Boundary

Export may write generated artifacts through Storage Integration.

Export destinations do not become Library Source of Truth automatically.

---

# 166. Search Boundary

Search indexes may use storage capabilities.

Indexes remain derived state.

---

# 167. Annotation Boundary

Annotation persistence is owned by the appropriate Platform and Domain architecture.

Storage Integration only provides physical persistence capabilities.

---

# 168. Testing Requirements

Storage Integration shall be tested through:

* Provider contract tests;
* path-safety tests;
* read tests;
* write tests;
* atomic-replacement tests;
* concurrency tests;
* failure tests;
* capacity tests;
* NAS disconnection tests;
* removable-storage tests;
* ambiguous-write tests;
* external-modification tests;
* credential-isolation tests;
* offline tests.

---

# 169. Provider Contract Testing

Every Storage Provider shall be tested against its declared capabilities.

A Provider shall not claim capabilities it cannot reliably provide.

---

# 170. Path Safety Testing

Tests shall include:

* path traversal;
* absolute path escape;
* symbolic-link escape;
* Unicode normalization;
* case differences;
* reserved names.

---

# 171. Write Safety Testing

Tests shall include:

* successful write;
* interrupted write;
* capacity exhaustion;
* read-only storage;
* connection loss;
* concurrent modification.

---

# 172. Atomic Replacement Testing

Where atomic replacement is declared, tests shall verify actual behavior on supported storage systems.

---

# 173. NAS Testing

NAS tests shall include:

* available NAS;
* NAS unavailable at startup;
* NAS disconnected during read;
* NAS disconnected during write;
* NAS reconnected;
* changed mount path;
* authentication failure.

---

# 174. External Modification Testing

Tests shall include:

* external file edit;
* external rename;
* external deletion;
* duplicate watcher events;
* missed watcher events.

---

# 175. Ambiguous Write Testing

Tests shall verify recovery when connection is lost around remote write completion.

---

# 176. Credential Isolation Testing

Tests shall verify that storage credentials do not appear in:

* logs;
* Domain objects;
* Event payloads;
* Plugin contracts;
* MCP Resources;
* AI context;
* Library exports.

---

# 177. Offline Testing

Offline tests shall verify:

* locally available content remains usable;
* NAS unavailability is represented clearly;
* local cache does not silently become Source of Truth;
* reconnection delegates divergence handling to Synchronization.

---

# 178. Governance

Storage Integration is a foundational architectural boundary.

Changes affecting:

* Source of Truth access;
* storage identity;
* physical addressing;
* atomicity assumptions;
* NAS integration;
* credential handling;
* path safety;

require architectural review.

---

# 179. Storage Integration Invariants

The following invariants apply.

* Storage Integration belongs to the Integration layer.
* Storage Integration provides physical storage capabilities.
* Storage Integration does not define canonical knowledge semantics.
* The Library owns Source of Truth policy.
* The NAS is the primary intended Library Source of Truth.
* The NAS is not the Domain model.
* Storage Location Identity is distinct from physical path.
* Provider Identity is distinct from Storage Location Identity.
* Canonical Knowledge Object Identity does not depend upon absolute path.
* Physical storage layout does not define the Domain model.
* Storage metadata is not automatically Knowledge metadata.
* Storage References are not canonical Knowledge Object identities.
* Storage capabilities are explicit.
* Provider guarantees are explicit.
* KnowledgeOS does not assume all storage systems have identical semantics.
* Atomicity is not assumed where the Provider does not guarantee it.
* Multi-object transactions are not assumed across heterogeneous storage.
* Storage watchers are signals, not synchronization.
* External storage modifications are validated.
* Local cache does not silently become Source of Truth.
* NAS unavailability is an expected operational condition.
* Reconnection delegates divergence handling to Synchronization.
* Storage credentials remain behind Integration boundaries.
* Plugins do not receive unrestricted filesystem access by default.
* MCP clients do not receive raw Storage Provider access.
* AI models do not receive storage credentials or unrestricted NAS access.
* Storage Integration does not define backup policy.
* Storage Integration does not define synchronization policy.
* Storage Integration does not define knowledge conflict resolution.
* Storage operational state is not canonical knowledge.

---

# 180. Prohibited Behaviors

Storage Integration shall never:

* allow physical storage layout to define the Domain model;
* use absolute path as canonical Knowledge Object Identity;
* allow a Storage Provider to decide Source of Truth policy;
* silently replace the NAS Source of Truth with a local cache;
* treat filesystem timestamps automatically as canonical knowledge timestamps;
* assume all Providers support atomic rename;
* assume all Providers provide strong consistency;
* assume timeout means a write failed;
* retry ambiguous writes blindly;
* assume filesystem watchers deliver every change exactly once;
* use storage watchers as the synchronization architecture;
* allow external physical changes to mutate canonical state without validation;
* expose NAS credentials to Plugins;
* expose NAS credentials to MCP peers;
* expose storage credentials to AI models;
* expose unrestricted filesystem access by default;
* allow path traversal outside configured storage roots;
* store credentials in Library content;
* treat cache data as canonical data;
* treat temporary storage as canonical persistence;
* treat export destinations as Source of Truth automatically;
* hide Provider limitations behind false guarantees;
* assume distributed transactions across heterogeneous storage systems;
* make remote cloud storage mandatory for core KnowledgeOS operation.

---

# 181. Related Documents

* `../README.md`
* `../Providers/ProviderModel.md`
* `../Providers/StorageProviders.md`
* `../DataExchange/CanonicalExchange.md`
* `../DataExchange/Serialization.md`
* `../ExternalServices/OAuth.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/ExtensionPoints.md`
* `../PublicAPI/APIConventions.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Search/README.md`
* `../../04-Platform/Sync/README.md`
* `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../02-Domain/Identity/README.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`
* `../../06-Execution/Concurrency/Idempotency.md`
* `../../06-Execution/Concurrency/Transactions.md`
* `../../06-Execution/Concurrency/RetryPolicies.md`
* `../../06-Execution/Reliability/Recovery.md`
* `../../06-Execution/Runtime/ResourceManagement.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 182. Status

**Approved**

This document defines the architectural model governing Storage Integration within KnowledgeOS.

Storage Integration belongs to the Integration layer.

It provides controlled physical storage capabilities through stable contracts and replaceable Providers.

It does not define canonical knowledge semantics.

The Library owns logical knowledge organization and Source of Truth policy.

The NAS is the primary intended Source of Truth for the KnowledgeOS Library.

The NAS remains user-controlled physical infrastructure accessed through the Storage Integration boundary.

Storage Location Identity remains independent from physical paths and mount points.

Canonical Knowledge Object Identity remains independent from physical storage location.

Storage Providers expose explicit capabilities and actual guarantees.

KnowledgeOS does not pretend that local filesystems, NAS systems, removable volumes, object stores and cloud storage have identical semantics.

Atomicity, consistency, locking and durability guarantees remain explicit.

Storage failures are expected operational conditions.

NAS unavailability does not silently replace the Source of Truth.

Locally available knowledge may remain usable according to the Offline First architecture.

Reconnection and divergence handling belong to Synchronization.

Storage watchers may signal change but do not define synchronization.

External physical modifications are validated before entering trusted canonical processing.

Credentials remain isolated.

Plugins, MCP clients, AI models and Public API clients never receive unrestricted raw storage access by default.

Storage Integration allows KnowledgeOS to remain portable across storage technologies while preserving user ownership, architectural boundaries and the NAS-centered Source of Truth model.
