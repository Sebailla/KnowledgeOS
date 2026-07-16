
# Master Library Entities

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Domain

**Document:** Entities

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the entities and aggregate roots of the Master Library Module.

It specifies:

* entity identity;
* aggregate ownership;
* attributes;
* lifecycle;
* creation rules;
* mutation rules;
* invariants;
* state transitions;
* Domain behavior;
* persistence boundaries;
* relationships between server and device authority.

The entities defined here are implementation-level Domain concepts.

They shall remain independent from:

* database records;
* ORM models;
* HTTP DTOs;
* filesystem paths;
* SwiftUI state;
* NestJS modules;
* GRDB records.

---

# 2. Scope

The following aggregate roots are defined:

```text
MasterLibrary
Publication
AcquisitionOperation
LocalLibraryItem
```

The following owned entities are defined:

```text
SourcePublication
AcquisitionAttempt
PublicationContributor
PublicationSubject
```

Additional internal entities may be introduced only when they protect a real Domain invariant.

---

# 3. Entity Principles

Every entity shall:

* have stable identity;
* preserve valid lifecycle state;
* reject invalid mutation;
* expose behavior through intention-revealing methods;
* hide internal mutable state;
* remain valid after every completed operation;
* support controlled persistence rehydration;
* remain independent from infrastructure concerns.

---

# 4. Entity Versus Value Object

An entity is defined by identity across time.

A value object is defined by its complete value.

Examples:

```text
Publication
→ Entity identified by PublicationId

SourcePublication
→ Entity identified by SourceVersion within Publication

Checksum
→ Value object identified by algorithm and value

ByteLength
→ Value object identified by numeric value
```

---

# 5. Aggregate Roots

Only aggregate roots may be loaded and persisted independently by ordinary repositories.

The approved aggregate roots are:

```text
MasterLibrary
Publication
AcquisitionOperation
LocalLibraryItem
```

Owned entities shall normally be accessed through their aggregate root.

---

# 6. MasterLibrary Aggregate Root

## 6.1 Definition

`MasterLibrary` represents one logical NAS-hosted Master Library.

It is the server-authoritative root for:

* Library identity;
* Library format compatibility;
* CatalogRevision;
* Library lifecycle state.

---

# 7. MasterLibrary Identity

The entity is identified by:

```text
MasterLibraryId
```

The identity is:

* generated once;
* immutable;
* independent from hostname;
* independent from IP address;
* independent from physical path;
* preserved during backup and restore.

---

# 8. MasterLibrary Attributes

Conceptually:

```text
MasterLibrary
├── id: MasterLibraryId
├── name: MasterLibraryName
├── formatVersion: MasterLibraryFormatVersion
├── catalogRevision: CatalogRevision
├── state: MasterLibraryState
├── createdAt: Instant
├── updatedAt: Instant
└── stateReason?: LibraryStateReason
```

---

# 9. MasterLibrary Creation

The aggregate shall be created through a controlled operation equivalent to:

```text
MasterLibrary.initialize(...)
```

Required input:

* MasterLibraryId;
* name;
* supported format version;
* creation timestamp.

Initial state:

```text
INITIALIZING
```

Initial CatalogRevision:

```text
0
```

or the approved first revision value.

The convention shall remain consistent across persistence and contracts.

---

# 10. MasterLibrary Activation

After physical initialization, schema creation and validation succeed:

```text
INITIALIZING → AVAILABLE
```

Activation shall require explicit evidence that:

* manifest is committed;
* database is initialized;
* required storage areas exist;
* format is compatible;
* required permissions are present.

---

# 11. MasterLibrary Behaviors

Conceptual methods include:

```text
initialize(...)
markAvailable(...)
markDegraded(...)
markUnavailable(...)
markInvalid(...)
markUnsupported(...)
enterMaintenance(...)
exitMaintenance(...)
advanceCatalogRevision(...)
rename(...)
```

The exact method names may differ.

The behavior and invariants shall remain equivalent.

---

# 12. Advance Catalog Revision

Conceptual operation:

```text
masterLibrary.advanceCatalogRevision(reason, occurredAt)
```

It shall:

* create the next CatalogRevision;
* never reuse a previous revision;
* never decrease the revision;
* update `updatedAt`;
* produce `CatalogRevisionAdvanced`.

Only catalog-visible authoritative changes may call this behavior.

---

# 13. MasterLibrary State Rules

Allowed examples:

```text
INITIALIZING → AVAILABLE
AVAILABLE → DEGRADED
AVAILABLE → UNAVAILABLE
AVAILABLE → MAINTENANCE
DEGRADED → AVAILABLE
DEGRADED → UNAVAILABLE
UNAVAILABLE → AVAILABLE
MAINTENANCE → AVAILABLE
```

Terminal or restricted conditions:

```text
INVALID
UNSUPPORTED
```

Restoration from these states requires explicit validated recovery.

---

# 14. MasterLibrary Invariants

The aggregate shall enforce:

```text
id is always valid
formatVersion is always valid
catalogRevision never decreases
createdAt never changes
updatedAt is not earlier than createdAt
AVAILABLE requires compatible format
AVAILABLE requires valid Library structure
identity never changes
personal state is absent
```

---

# 15. MasterLibrary Rehydration

Persistence shall reconstruct the aggregate through a controlled method equivalent to:

```text
MasterLibrary.rehydrate(...)
```

Rehydration shall reject:

* invalid identity;
* invalid format version;
* negative revision;
* impossible state;
* inconsistent timestamps.

A malformed persisted record is a persistence-integrity failure.

---

# 16. Publication Aggregate Root

## 16.1 Definition

`Publication` represents one logical publication in the Master Catalog.

It is independent from:

* source filename;
* NAS path;
* checksum;
* current source version;
* title changes;
* cover changes.

---

# 17. Publication Identity

The aggregate is identified by:

```text
PublicationId
```

PublicationId shall remain stable throughout:

* metadata updates;
* source replacement;
* availability changes;
* withdrawal;
* restoration;
* storage relocation.

---

# 18. Publication Attributes

Conceptually:

```text
Publication
├── id: PublicationId
├── metadata: PublicationMetadata
├── sources: SourcePublication[]
├── currentSourceVersion?: SourceVersion
├── availability: PublicationAvailability
├── availabilityReason?: AvailabilityReason
├── createdAt: Instant
└── updatedAt: Instant
```

---

# 19. Publication Creation

A Publication shall be created through:

```text
Publication.create(...)
```

Required input:

* PublicationId;
* valid PublicationMetadata;
* creation timestamp.

Initial state before source activation may be internal preparation state or:

```text
UNAVAILABLE
```

The publication shall not become `AVAILABLE` until a valid committed SourcePublication is activated.

---

# 20. Publication Metadata

`PublicationMetadata` is a composed value object containing:

```text
title
subtitle?
contributors
language?
description?
subjects
publisher?
publicationDate?
publicationType
sourceFormat
coverReference?
```

The aggregate owns metadata mutation rules.

---

# 21. Publication Metadata Update

Conceptual operation:

```text
publication.updateMetadata(newMetadata, occurredAt)
```

It shall:

* preserve PublicationId;
* preserve all SourceVersion values;
* preserve current source;
* validate metadata;
* update `updatedAt`;
* emit `PublicationMetadataUpdated`.

It shall not accept personal-state fields.

---

# 22. Publication Source Collection

The Publication aggregate owns its SourcePublication entities.

It shall enforce:

* unique SourceVersion values;
* at most one current SourceVersion;
* every source belongs to the same Publication;
* committed SourcePublication immutability;
* monotonically increasing SourceVersion values.

---

# 23. Add Source Version

Conceptual operation:

```text
publication.addSource(sourcePublication)
```

It shall reject:

* duplicated SourceVersion;
* lower or reused version;
* invalid checksum;
* invalid byte length;
* invalid storage reference;
* unsupported source format;
* already mutated committed source.

Adding a source does not necessarily make it current immediately.

---

# 24. Activate Source Version

Conceptual operation:

```text
publication.activateSource(sourceVersion, occurredAt)
```

It shall verify:

* source exists;
* source belongs to this Publication;
* source is committed;
* source integrity is `VALID`;
* source is readable according to verified application evidence.

After activation:

* `currentSourceVersion` changes;
* previous versions remain historically identifiable;
* `updatedAt` changes;
* `SourceVersionActivated` is emitted.

---

# 25. Replace Authoritative Source

Application workflow:

```text
create new SourcePublication
    ↓
commit physical payload
    ↓
publication.addSource(...)
    ↓
publication.activateSource(...)
```

The Publication entity shall not overwrite the prior SourcePublication.

---

# 26. Publication Availability Changes

Conceptual operations:

```text
publication.markAvailable(...)
publication.markUnavailable(...)
publication.markCorrupted(...)
publication.withdraw(...)
publication.restoreAvailability(...)
```

Each operation shall validate the transition.

---

# 27. Mark Available

A Publication may enter `AVAILABLE` only when:

```text
currentSourceVersion exists
AND current source exists
AND current source is committed
AND current source integrity = VALID
```

The entity shall reject availability without a valid source.

---

# 28. Mark Unavailable

`markUnavailable(reason, occurredAt)` shall:

* preserve PublicationId;
* preserve source history;
* preserve current source reference;
* reject acquisition eligibility;
* update reason and time;
* emit `PublicationAvailabilityChanged`.

---

# 29. Mark Corrupted

`markCorrupted(reason, occurredAt)` shall:

* set availability to `CORRUPTED`;
* prohibit new acquisition;
* preserve source history;
* identify the integrity reason;
* emit a Domain event.

---

# 30. Withdraw Publication

`withdraw(reason, occurredAt)` shall:

* set availability to `WITHDRAWN`;
* preserve historical identity;
* preserve source metadata;
* prohibit new acquisition;
* not imply deletion from client devices;
* emit `PublicationWithdrawn`.

---

# 31. Restore Publication Availability

Restoration shall require verified evidence that:

* the current source exists;
* the current source is readable;
* byte length matches;
* checksum matches;
* source integrity is `VALID`.

The aggregate shall not restore availability from assertion alone.

---

# 32. Publication Acquisition Eligibility

Conceptual query:

```text
publication.canBeAcquired()
```

It returns true only when:

```text
availability = AVAILABLE
AND current source exists
AND current source integrity = VALID
```

---

# 33. Publication Queries

The entity may expose immutable queries such as:

```text
currentSource()
sourceByVersion(...)
hasSourceVersion(...)
canBeAcquired()
isWithdrawn()
isAvailable()
latestSourceVersion()
```

Queries shall not expose mutable collections.

---

# 34. Publication Invariants

The aggregate shall enforce:

```text
PublicationId never changes
metadata is always valid
SourceVersion values are unique
SourceVersion values are monotonically increasing
at most one current source exists
current source belongs to this Publication
AVAILABLE requires valid current source
WITHDRAWN is not acquirable
CORRUPTED is not acquirable
metadata contains no personal state
committed sources are immutable
```

---

# 35. SourcePublication Entity

## 35.1 Definition

`SourcePublication` represents one immutable authoritative source payload version.

It is owned by one Publication aggregate.

---

# 36. SourcePublication Identity

Its identity is:

```text
SourceVersion
```

within one Publication.

Global identity may be represented as:

```text
PublicationId + SourceVersion
```

SourceVersion alone is not globally unique.

---

# 37. SourcePublication Attributes

Conceptually:

```text
SourcePublication
├── version: SourceVersion
├── format: PublicationFormat
├── mediaType: MediaType
├── byteLength: ByteLength
├── checksum: Checksum
├── storageReference: StorageReference
├── integrityState: SourceIntegrityState
├── originalFileName?: OriginalFileName
├── createdAt: Instant
└── committedAt: Instant
```

---

# 38. SourcePublication Creation

A source shall be created through a controlled factory equivalent to:

```text
SourcePublication.commit(...)
```

Required verified input:

* SourceVersion;
* format;
* media type;
* byte length;
* checksum;
* logical storage reference;
* creation time;
* commit time.

Initial committed integrity state:

```text
VALID
```

when verification succeeded.

---

# 39. SourcePublication Mutability

After commit, the following are immutable:

* version;
* format;
* media type;
* byte length;
* checksum;
* storage reference;
* creation and commit timestamps.

Only integrity classification may change through explicit Domain behavior.

---

# 40. Source Integrity Changes

Conceptual methods:

```text
source.markMissing(...)
source.markCorrupted(...)
source.markUnreadable(...)
source.markValid(...)
source.quarantine(...)
```

A return to `VALID` requires verified evidence.

---

# 41. SourcePublication Invariants

The entity shall enforce:

```text
SourceVersion is positive
ByteLength is positive
Checksum is valid
StorageReference is valid
committedAt is not earlier than createdAt
committed data is immutable
VALID requires committed payload evidence
QUARANTINED is not deliverable
MISSING is not deliverable
CORRUPTED is not deliverable
```

---

# 42. PublicationContributor Entity

## 42.1 Definition

`PublicationContributor` represents one contributor entry inside publication metadata.

It may be modeled as an owned entity when ordering or role-specific identity matters.

Otherwise, an immutable value object may be sufficient.

---

# 43. PublicationContributor Identity

Within one Publication, identity may use:

```text
ContributorEntryId
```

or stable ordered position when mutation semantics remain simple.

The implementation shall not invent a global person identity in this module.

---

# 44. PublicationContributor Attributes

Conceptually:

```text
PublicationContributor
├── entryId
├── name
├── role
└── order
```

Supported roles may include:

```text
AUTHOR
EDITOR
TRANSLATOR
ILLUSTRATOR
CONTRIBUTOR
```

---

# 45. Contributor Rules

The entity shall enforce:

* non-empty normalized name;
* valid role;
* non-negative order;
* deterministic ordering;
* no automatic global identity resolution.

---

# 46. PublicationSubject Entity

`PublicationSubject` represents one authoritative catalog subject assignment.

It may be modeled as:

* an owned entity with SubjectEntryId;
* or a normalized value object.

The implementation shall choose the simpler valid representation.

---

# 47. AcquisitionOperation Aggregate Root

## 47.1 Definition

`AcquisitionOperation` represents one logical attempt by one device to obtain one exact source version.

It persists across:

* retries;
* process restart;
* network interruption;
* optional resume.

---

# 48. AcquisitionOperation Identity

The aggregate is identified by:

```text
AcquisitionOperationId
```

The identifier remains stable across retries.

A new user-requested acquisition after terminal abandonment may create a new operation.

---

# 49. AcquisitionOperation Attributes

Conceptually:

```text
AcquisitionOperation
├── id: AcquisitionOperationId
├── serverId: ServerId
├── masterLibraryId: MasterLibraryId
├── publicationId: PublicationId
├── requestedSourceVersion: SourceVersion
├── state: AcquisitionState
├── progress: AcquisitionProgress
├── attempts: AcquisitionAttempt[]
├── currentAttemptId?: AcquisitionAttemptId
├── expectedByteLength: ByteLength
├── expectedChecksum: Checksum
├── createdAt: Instant
├── updatedAt: Instant
├── completedAt?: Instant
└── failure?: AcquisitionFailure
```

---

# 50. AcquisitionOperation Creation

Conceptual operation:

```text
AcquisitionOperation.create(...)
```

Required input:

* new AcquisitionOperationId;
* ServerId;
* MasterLibraryId;
* PublicationId;
* requested SourceVersion;
* expected ByteLength;
* expected Checksum;
* creation time.

Initial state:

```text
CREATED
```

Initial progress:

```text
bytesReceived = 0
```

No Attempt exists initially.

---

# 51. Queue Acquisition

```text
operation.queue(occurredAt)
```

Allowed transition:

```text
CREATED → QUEUED
```

The method shall update timestamp and emit `AcquisitionQueued`.

---

# 52. Start Acquisition Attempt

Conceptual operation:

```text
operation.startAttempt(attemptId, mode, initialOffset, occurredAt)
```

It shall:

* require an executable operation state;
* reject a second active Attempt;
* require unique Attempt identity;
* validate offset;
* create an AcquisitionAttempt;
* set currentAttemptId;
* move to `DOWNLOADING`;
* emit `AcquisitionAttemptStarted`.

---

# 53. Record Progress

```text
operation.recordProgress(bytesReceived, occurredAt)
```

It shall enforce:

* non-negative bytes;
* monotonic progress within an Attempt;
* bytes not greater than expected total;
* operation currently downloading;
* current Attempt exists.

It may emit throttled Domain events or application notifications.

---

# 54. Pause Acquisition

When resume is enabled:

```text
operation.pause(reason, occurredAt)
```

Allowed transition:

```text
DOWNLOADING → PAUSED
```

The current Attempt ends as interrupted or paused according to the chosen outcome model.

---

# 55. Complete Transfer

```text
operation.completeTransfer(actualByteLength, occurredAt)
```

It shall:

* require `DOWNLOADING`;
* require current Attempt;
* record Attempt transfer completion;
* require actual length equals expected ByteLength;
* move to `VALIDATING`.

Checksum validation remains pending.

---

# 56. Begin Validation

The implementation may combine transfer completion and validation transition.

The aggregate shall represent clearly that:

```text
transfer completed
≠
acquisition completed
```

---

# 57. Confirm Checksum

Conceptual operation:

```text
operation.confirmChecksum(checksum, occurredAt)
```

It shall:

* require `VALIDATING`;
* compare with expected Checksum;
* reject mismatch;
* move to `INSTALLING`;
* emit `AcquisitionInstallationStarted`.

---

# 58. Complete Installation

```text
operation.completeInstallation(installationEvidence, occurredAt)
```

Required evidence:

* final payload committed;
* LocalLibraryItem committed;
* installed SourceVersion matches;
* installed ByteLength matches;
* installed Checksum matches.

Allowed transition:

```text
INSTALLING → COMPLETED
```

It shall set `completedAt`.

---

# 59. Fail Attempt

```text
operation.failAttempt(failure, occurredAt)
```

It shall:

* require current active Attempt;
* close the Attempt;
* record failure;
* clear currentAttemptId;
* move the aggregate to `FAILED`, `PAUSED` or `RECOVERY_REQUIRED` according to failure meaning.

---

# 60. Retry Acquisition

```text
operation.retry(newAttemptId, mode, initialOffset, occurredAt)
```

It shall:

* preserve operation identity;
* preserve target identities;
* require retryable state;
* require unique new Attempt identity;
* revalidate resume eligibility externally where needed;
* start a new Attempt.

---

# 61. Cancel Acquisition

```text
operation.cancel(reason, occurredAt)
```

It shall:

* require cancellable state;
* close active Attempt as cancelled where present;
* clear currentAttemptId;
* transition to `CANCELLED`;
* emit `AcquisitionCancelled`.

---

# 62. Require Recovery

```text
operation.requireRecovery(reason, occurredAt)
```

It shall be used when:

* final file commit outcome is ambiguous;
* local database commit outcome is ambiguous;
* persisted state and filesystem disagree;
* safe retry cannot be assumed.

State becomes:

```text
RECOVERY_REQUIRED
```

---

# 63. AcquisitionOperation Terminal States

Terminal states are:

```text
COMPLETED
CANCELLED
```

`FAILED` may allow retry.

`RECOVERY_REQUIRED` requires reconciliation before normal retry or completion.

---

# 64. AcquisitionOperation Invariants

The aggregate shall enforce:

```text
target ServerId never changes
target MasterLibraryId never changes
target PublicationId never changes
requested SourceVersion never changes
expected ByteLength never changes
expected Checksum never changes
only one active Attempt exists
Attempt IDs never repeat
progress never decreases during one Attempt
COMPLETED requires installation evidence
CANCELLED is never COMPLETED
ambiguous commit outcome uses RECOVERY_REQUIRED
```

---

# 65. AcquisitionAttempt Entity

## 65.1 Definition

`AcquisitionAttempt` represents one physical execution of an AcquisitionOperation.

---

# 66. AcquisitionAttempt Identity

The entity is identified by:

```text
AcquisitionAttemptId
```

Every retry creates a new identifier.

---

# 67. AcquisitionAttempt Attributes

Conceptually:

```text
AcquisitionAttempt
├── id: AcquisitionAttemptId
├── mode: AcquisitionTransferMode
├── initialOffset: ByteOffset
├── finalOffset?: ByteOffset
├── outcome?: AcquisitionAttemptOutcome
├── failureCode?: ErrorCode
├── startedAt: Instant
└── endedAt?: Instant
```

---

# 68. Start Attempt

Creation establishes:

* unique identity;
* transfer mode;
* initial offset;
* start time;
* no terminal outcome.

---

# 69. Finish Attempt

An Attempt may finish as:

```text
SUCCEEDED
FAILED
CANCELLED
INTERRUPTED
```

After finishing:

* outcome is immutable;
* end time is immutable;
* final offset is immutable;
* failure code is immutable.

---

# 70. Attempt Invariants

The entity shall enforce:

```text
initialOffset is non-negative
finalOffset is not lower than initialOffset
endedAt is not earlier than startedAt
only one terminal outcome exists
failure code exists only when meaningful
finished Attempt cannot restart
Attempt identity is never reused
```

---

# 71. LocalLibraryItem Aggregate Root

## 71.1 Definition

`LocalLibraryItem` represents one locally installed publication on one device.

It is the device authority for:

* local membership;
* installed SourceVersion;
* local integrity;
* local removal state.

---

# 72. LocalLibraryItem Identity

Logical uniqueness is defined by:

```text
ServerId
+
MasterLibraryId
+
PublicationId
```

The implementation may also assign:

```text
LocalLibraryItemId
```

as a persistence-friendly entity identifier.

---

# 73. LocalLibraryItem Attributes

Conceptually:

```text
LocalLibraryItem
├── id: LocalLibraryItemId
├── serverId: ServerId
├── masterLibraryId: MasterLibraryId
├── publicationId: PublicationId
├── installedSourceVersion: SourceVersion
├── storageReference: LocalStorageReference
├── byteLength: ByteLength
├── checksum: Checksum
├── availability: LocalAvailability
├── integrity: LocalIntegrityState
├── metadataSnapshot: PublicationMetadataSnapshot
├── acquiredAt: Instant
├── validatedAt: Instant
└── updatedAt: Instant
```

---

# 74. Install Local Publication

Conceptual factory:

```text
LocalLibraryItem.install(...)
```

Required verified input:

* identity context;
* installed SourceVersion;
* committed logical storage reference;
* exact ByteLength;
* exact Checksum;
* metadata snapshot;
* acquisition time;
* validation time.

Initial resulting state:

```text
availability = AVAILABLE_LOCAL
integrity = VALID
```

---

# 75. Replace Local Source Version

Conceptual operation:

```text
localItem.replaceInstalledVersion(...)
```

It shall:

* require a newer or explicitly allowed SourceVersion;
* require valid new payload evidence;
* preserve old values until replacement commit is confirmed;
* atomically update Domain-visible version data;
* emit `LocalPublicationUpdated`.

---

# 76. Refresh Metadata Snapshot

```text
localItem.refreshMetadataSnapshot(snapshot, occurredAt)
```

It shall:

* preserve local payload identity;
* preserve installed SourceVersion;
* update offline display metadata;
* not claim server authority.

---

# 77. Mark Local Payload Missing

```text
localItem.markMissing(reason, occurredAt)
```

Result:

```text
availability = MISSING
integrity = MISSING
```

It shall emit `LocalPublicationIntegrityChanged`.

---

# 78. Mark Local Payload Corrupted

```text
localItem.markCorrupted(actualChecksum, reason, occurredAt)
```

Result:

```text
availability = CORRUPTED
integrity = CHECKSUM_MISMATCH
```

The expected checksum remains preserved for diagnostics.

---

# 79. Mark Local Payload Unreadable

```text
localItem.markUnreadable(reason, occurredAt)
```

Result:

```text
availability = CORRUPTED
integrity = UNREADABLE
```

or another explicitly approved local state mapping.

---

# 80. Begin Local Removal

```text
localItem.beginRemoval(occurredAt)
```

Allowed transition:

```text
AVAILABLE_LOCAL | MISSING | CORRUPTED
    → REMOVING
```

The item remains persisted until physical removal outcome is known.

---

# 81. Complete Local Removal

Local membership may be deleted from persistence after:

* physical payload removed or confirmed absent;
* operation artifacts handled;
* state commit succeeds.

The Domain event is:

```text
LocalPublicationRemoved
```

The aggregate may no longer exist after successful removal.

---

# 82. Require Local Recovery

```text
localItem.requireRecovery(reason, occurredAt)
```

Used when:

* final payload exists but record state is ambiguous;
* record exists but replacement outcome is unknown;
* removal outcome is unclear;
* recovery marker is inconsistent.

---

# 83. LocalLibraryItem Invariants

The aggregate shall enforce:

```text
identity context never changes
installed SourceVersion is valid
storage reference is logical and valid
ByteLength is positive
Checksum is valid
AVAILABLE_LOCAL requires VALID integrity
MISSING requires MISSING integrity
CORRUPTED cannot have VALID integrity
failed update preserves previous valid version
metadata snapshot is non-authoritative
personal state is absent
local removal never changes server authority
```

---

# 84. Metadata Snapshot

`PublicationMetadataSnapshot` is an immutable value captured for offline presentation.

It may contain:

* title;
* subtitle;
* contributors;
* language;
* publisher;
* publication date;
* publication type;
* cover cache reference.

It shall not contain:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships.

---

# 85. Entity Relationship Summary

```text
MasterLibrary
    │
    └── catalog revision authority

Publication
    └── owns SourcePublication[]

AcquisitionOperation
    └── owns AcquisitionAttempt[]

LocalLibraryItem
    └── references PublicationId and installed SourceVersion
```

---

# 86. Cross-Entity Referential Rules

A LocalLibraryItem shall refer to:

* one known ServerId;
* one known MasterLibraryId;
* one PublicationId;
* one installed SourceVersion.

An AcquisitionOperation shall refer to the same identity context as the resulting LocalLibraryItem.

The server does not validate local membership.

The client does not mutate Publication authority.

---

# 87. Entity Repository Boundaries

Approved repositories operate at aggregate-root level.

Conceptually:

```text
MasterLibraryRepository
PublicationRepository
AcquisitionRepository
LocalLibraryRepository
```

There shall not normally be an independent public repository for:

```text
SourcePublication
AcquisitionAttempt
```

because they are owned entities.

---

# 88. MasterLibraryRepository

Conceptual operations:

```text
get()
save(masterLibrary)
exists()
```

There is normally one active MasterLibrary per configured server instance.

---

# 89. PublicationRepository

Conceptual operations:

```text
findById(publicationId)
save(publication)
insert(publication)
exists(publicationId)
findBySourceChecksum(checksum)
```

Catalog query projections may use a separate read repository.

---

# 90. Catalog Read Model

Catalog listing and search do not require loading complete Publication aggregates.

A dedicated read model may project:

```text
CatalogEntryProjection
```

This read model is not an aggregate root.

It shall not mutate authority.

---

# 91. AcquisitionRepository

Conceptual operations:

```text
findById(operationId)
findActive(publicationContext)
save(operation)
listRecoverable()
```

The repository persists the full operation and Attempt history.

---

# 92. LocalLibraryRepository

Conceptual operations:

```text
find(serverId, masterLibraryId, publicationId)
save(localLibraryItem)
remove(localLibraryItemId)
list()
listRecoverable()
```

The repository shall enforce logical uniqueness.

---

# 93. Entity Domain Events

Each aggregate may expose pending Domain events after successful mutation.

Events shall be cleared only after application-level persistence and dispatch coordination.

Entity methods shall not publish directly to infrastructure event buses.

---

# 94. Entity Persistence Mapping

Persistence records may differ from Domain entities.

Examples:

```text
Publication
→ publications row
→ source_versions rows
→ contributor rows
→ subject rows

AcquisitionOperation
→ acquisition_operations row
→ acquisition_attempts rows
```

Mappings shall preserve all invariants.

---

# 95. Entity Serialization

Entities shall not be serialized directly into API responses.

Instead:

```text
Entity
    ↓
Application result
    ↓
Transport mapper
    ↓
API DTO
```

This protects Domain behavior and internal structure.

---

# 96. Entity Concurrency

Aggregate mutation shall use optimistic or transactionally protected concurrency.

Potential version fields:

```text
recordVersion
updatedAt
CatalogRevision
```

Infrastructure shall detect concurrent conflicting writes.

The Domain shall receive conflicts as explicit application errors.

---

# 97. Publication Mutation Concurrency

Conflicting operations on the same Publication include:

* metadata update;
* source replacement;
* availability change;
* withdrawal.

Only one incompatible mutation may commit against one expected aggregate version.

---

# 98. Acquisition Concurrency

Only one execution context may mutate an AcquisitionOperation at one time.

The client implementation shall isolate this through:

* actor ownership;
* repository transaction;
* operation coordinator;
* or equivalent serialized access.

---

# 99. Local Installation Concurrency

Conflicting actions for the same local publication include:

* acquisition completion;
* source update;
* local removal;
* integrity reconciliation.

These operations require one local mutation coordinator.

---

# 100. Entity Time Semantics

Time values shall be supplied explicitly.

Entities shall not call system time directly.

The application shall provide:

```text
Clock.now()
```

This supports deterministic tests and replayable behavior.

---

# 101. Entity Identifier Generation

Entity factories shall receive identifiers from an application-level:

```text
IdGenerator
```

Entities shall not depend directly on platform UUID APIs.

---

# 102. Entity Validation

Creation and rehydration shall validate all invariants.

Mutation methods shall validate transition-specific rules.

Invalid state shall produce Domain errors.

Entities shall never remain partially mutated after a rejected operation.

---

# 103. Entity Immutability Boundaries

Always immutable:

```text
MasterLibraryId
PublicationId
SourceVersion
AcquisitionOperationId
AcquisitionAttemptId
ServerId
DeviceId
committed checksum
committed byte length
```

Conditionally mutable through behavior:

```text
publication metadata
current source version
publication availability
acquisition state
local availability
local integrity
metadata snapshot
```

---

# 104. Entity Testing Requirements

Every aggregate root shall have tests for:

* valid creation;
* invalid creation;
* rehydration;
* identity equality;
* valid transitions;
* invalid transitions;
* event emission;
* immutable attributes;
* timestamp updates;
* invariant preservation.

---

# 105. MasterLibrary Tests

Required cases:

```text
initialize
activate
degrade
recover availability
enter maintenance
advance revision
reject revision decrement
reject unsupported available state
preserve identity
```

---

# 106. Publication Tests

Required cases:

```text
create publication
add first source
activate source
update metadata
replace source
reject duplicate SourceVersion
mark unavailable
withdraw
mark corrupted
restore availability
reject acquisition without valid current source
preserve PublicationId
```

---

# 107. AcquisitionOperation Tests

Required cases:

```text
create
queue
start Attempt
record progress
complete transfer
confirm checksum
begin installation
complete
cancel
fail
retry with new Attempt
resume eligibility
require recovery
reject duplicate active Attempt
reject target mutation
```

---

# 108. LocalLibraryItem Tests

Required cases:

```text
install
replace version
refresh metadata snapshot
mark missing
mark corrupted
begin removal
complete removal
require recovery
reject AVAILABLE_LOCAL with invalid integrity
preserve prior version on failed update
preserve server authority
```

---

# 109. Entity Completion Gate

The entity design is complete when:

```text
[ ] Aggregate roots are defined
[ ] Owned entities are defined
[ ] Stable identity is defined
[ ] Attributes are defined
[ ] Creation rules are defined
[ ] Mutation behavior is defined
[ ] State rules are defined
[ ] Invariants are defined
[ ] Repository boundaries are defined
[ ] Concurrency boundaries are defined
[ ] Event behavior is defined
[ ] Persistence mapping boundaries are defined
[ ] Testing obligations are defined
[ ] Personal-state exclusion is explicit
[ ] No architectural contradiction remains
```

---

# 110. Entity Invariants

The following invariants apply:

* MasterLibraryId never changes.
* PublicationId never changes.
* SourcePublication is immutable after commit.
* SourceVersion is unique inside one Publication.
* Publication availability is independent from local availability.
* AcquisitionOperation fixes one exact source context.
* Retry creates a new AcquisitionAttempt.
* Completed acquisition requires local installation evidence.
* LocalLibraryItem is device-specific.
* AVAILABLE_LOCAL requires valid payload evidence.
* Failed update preserves the prior valid local version.
* Local removal affects only the current device.
* Aggregate entities are not persistence records.
* Entities contain no framework dependencies.
* Personal state is absent.

---

# 111. Prohibited Entity Designs

Entities shall not:

* use physical paths as identity;
* expose mutable collections;
* expose public property setters for Domain state;
* import NestJS, Drizzle, GRDB or SwiftUI;
* store HTTP status codes;
* create IDs internally through platform APIs;
* access system time directly;
* perform filesystem operations;
* perform database operations;
* perform network requests;
* share one aggregate between server and client persistence;
* make SourcePublication independently mutable;
* reuse AcquisitionAttempt identity;
* merge remote and local availability;
* contain annotation or progress data.

---

# 112. Related Documents

## Domain

* `README.md`
* `DomainModel.md`
* `ValueObjects.md`
* `States.md`
* `Errors.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/DataFlow.md`

## Future Persistence

* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/LocalLibraryStorage.md`

---

# 113. Status

**Approved**

The aggregate roots and owned entities of the Master Library Module are defined at implementation level.

The next document is:

```text
01-MasterLibrary/03-Domain/ValueObjects.md
```

It shall define every immutable Domain value, identifier, validation rule, normalization rule and serialization boundary.
