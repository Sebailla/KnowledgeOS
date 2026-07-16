

# Master Library Domain Model

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Domain

**Document:** Domain Model

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the detailed Domain model of the Master Library Module.

It establishes:

* bounded-context boundaries;
* aggregate roots;
* entity ownership;
* value-object ownership;
* Domain services;
* Domain events;
* consistency boundaries;
* lifecycle relationships;
* authority relationships;
* cross-aggregate coordination;
* server-side and client-side Domain separation.

The model defines business meaning independently from transport, persistence and user-interface technologies.

---

# 2. Bounded Context

The bounded context is:

```text
Master Library
```

It governs the custody, discovery, versioning, acquisition and device-local presence of source publications.

The bounded context spans two execution authorities:

```text
Server Authority
    └── NAS-hosted Master Library

Device Authority
    └── Selective Local Library
```

These authorities share stable identifiers but do not share persistence or ownership.

---

# 3. Context Objective

The Master Library context answers five principal questions:

1. Which publications exist in the authoritative Master Catalog?
2. Which source version is currently authoritative?
3. Is a source publication available for acquisition?
4. Is a selected source version installed on this device?
5. Is the installed local payload valid and usable offline?

---

# 4. Context Exclusions

The context does not answer:

* where the user stopped reading;
* which annotations the user created;
* which personal relationships exist;
* which personal tags apply;
* how a document is rendered;
* how source content becomes UDM;
* how personal state synchronizes through CloudKit.

Those responsibilities belong to future bounded contexts.

---

# 5. Ubiquitous Language

The following terms have normative meaning.

## Master Library

The complete NAS-hosted publication collection governed by KnowledgeOS Server.

## Master Catalog

The authoritative catalog of logical publications in the Master Library.

## Publication

A stable logical publication independent from file name, path and source version.

## Source Publication

One immutable authoritative payload version belonging to a Publication.

## Source Version

The ordered identity of one authoritative source payload within a Publication.

## Acquisition

The device-side workflow that obtains one exact source version from the server.

## Selective Local Library

The device-specific collection of publications installed locally.

## Local Library Item

The Domain representation of one publication installed on one device.

## Catalog Revision

The ordered revision of authoritative catalog-visible state.

## Availability

The server-authoritative ability to offer a publication for acquisition.

## Local Integrity

The device-authoritative confidence in the installed local payload.

---

# 6. Context Map

```text
┌───────────────────────────────────────────┐
│ Master Library Server Authority           │
│                                           │
│ MasterLibrary                             │
│ Publication                               │
│ SourcePublication                         │
│ CatalogRevision                           │
│ PublicationAvailability                   │
│                                           │
└───────────────────────────────────────────┘
                    │
                    │ PublicationId
                    │ SourceVersion
                    │ Checksum
                    │ ByteLength
                    ▼
┌───────────────────────────────────────────┐
│ Device Acquisition Authority              │
│                                           │
│ AcquisitionOperation                      │
│ AcquisitionAttempt                        │
│                                           │
└───────────────────────────────────────────┘
                    │
                    │ validated install
                    ▼
┌───────────────────────────────────────────┐
│ Selective Local Library Authority         │
│                                           │
│ LocalLibraryItem                          │
│ LocalAvailability                         │
│ LocalIntegrityState                       │
│                                           │
└───────────────────────────────────────────┘
```

---

# 7. Aggregate Roots

The Domain defines four aggregate roots:

```text
MasterLibrary
Publication
AcquisitionOperation
LocalLibraryItem
```

Each root protects a distinct consistency boundary.

---

# 8. Aggregate Boundary Summary

| Aggregate Root       | Authority | Primary Consistency                                   |
| -------------------- | --------- | ----------------------------------------------------- |
| MasterLibrary        | Server    | Library identity, format and CatalogRevision          |
| Publication          | Server    | Logical publication, source versions and availability |
| AcquisitionOperation | Device    | Acquisition workflow and Attempts                     |
| LocalLibraryItem     | Device    | Installed local version and local integrity           |

---

# 9. MasterLibrary Aggregate

The `MasterLibrary` aggregate represents one logical NAS-hosted Master Library.

Conceptual structure:

```text
MasterLibrary
├── MasterLibraryId
├── MasterLibraryName
├── MasterLibraryFormatVersion
├── CatalogRevision
├── MasterLibraryState
├── createdAt
└── updatedAt
```

---

# 10. MasterLibrary Responsibilities

The aggregate owns:

* stable Library identity;
* format compatibility state;
* current CatalogRevision;
* high-level Library lifecycle state;
* Library initialization semantics;
* revision advancement rules.

It does not own every Publication as an in-memory child collection.

Publications are queried and mutated separately.

---

# 11. MasterLibrary Identity

`MasterLibraryId` is created exactly once during initialization.

It remains unchanged when:

* the NAS hostname changes;
* the IP address changes;
* the physical root changes;
* the container changes;
* the server process restarts;
* a backup is restored.

A restored Master Library preserves the same identity.

---

# 12. MasterLibrary Commands

Conceptual commands include:

```text
InitializeMasterLibrary
OpenMasterLibrary
ValidateMasterLibrary
AdvanceCatalogRevision
MarkLibraryAvailable
MarkLibraryDegraded
MarkLibraryUnavailable
EnterMaintenanceMode
ExitMaintenanceMode
```

---

# 13. MasterLibrary Invariants

The aggregate shall enforce:

```text
MasterLibraryId is present
FormatVersion is valid
CatalogRevision is non-negative
CatalogRevision never decreases
Identity never changes
Unsupported format cannot become AVAILABLE
Invalid Library cannot report AVAILABLE
Personal state is absent
```

---

# 14. MasterLibrary State

The Domain-level Library state is:

```text
INITIALIZING
AVAILABLE
DEGRADED
UNAVAILABLE
INVALID
UNSUPPORTED
MAINTENANCE
```

Server process health is related but not identical to Master Library state.

---

# 15. CatalogRevision Ownership

`CatalogRevision` belongs to one `MasterLibrary`.

It advances when authoritative catalog-visible state changes.

The revision is not a count of publications.

It is not a client cache version.

---

# 16. Publication Aggregate

The `Publication` aggregate represents one stable logical publication.

Conceptual structure:

```text
Publication
├── PublicationId
├── PublicationMetadata
├── SourcePublication[]
├── currentSourceVersion?
├── PublicationAvailability
├── AvailabilityReason?
├── createdAt
└── updatedAt
```

---

# 17. Publication Responsibilities

The aggregate owns:

* stable publication identity;
* master-source metadata;
* source-version history;
* current source selection;
* publication availability;
* source replacement rules;
* metadata update rules;
* acquisition eligibility.

---

# 18. Publication Identity

`PublicationId` is created once and never changes.

It is independent from:

* title;
* ISBN;
* file name;
* checksum;
* storage path;
* current source version;
* cover;
* publisher.

Metadata may change without changing logical publication identity.

---

# 19. Publication Metadata

The aggregate owns authoritative metadata such as:

```text
title
subtitle
authors
contributors
language
description
subjects
publisher
publicationDate
publicationType
sourceFormat
coverReference
```

These values describe the source publication.

They do not include personal state.

---

# 20. Publication Source Collection

A Publication may contain zero or more `SourcePublication` entities.

Normal valid acquisition requires at least one committed current source.

Historical source versions may remain retained according to policy.

---

# 21. Current Source

At most one SourceVersion is current.

The current source:

* is authoritative for new acquisition;
* defines current byte length;
* defines current checksum;
* defines current source format;
* may differ from locally installed versions.

---

# 22. SourcePublication Entity

Conceptual structure:

```text
SourcePublication
├── SourceVersion
├── PublicationFormat
├── MediaType
├── ByteLength
├── Checksum
├── StorageReference
├── SourceIntegrityState
├── createdAt
└── committedAt
```

---

# 23. SourcePublication Immutability

After commit, the following values are immutable:

```text
SourceVersion
PublicationFormat
MediaType
ByteLength
Checksum
StorageReference
createdAt
```

If authoritative bytes change, a new SourcePublication shall be created.

---

# 24. Source Integrity State

A SourcePublication may have:

```text
PENDING
VALID
MISSING
CORRUPTED
UNREADABLE
QUARANTINED
```

Only a valid committed source may support `AVAILABLE` publication state.

---

# 25. Publication Commands

Conceptual commands include:

```text
CreatePublication
UpdatePublicationMetadata
AddSourceVersion
ActivateSourceVersion
MarkUnavailable
MarkCorrupted
RestoreAvailability
WithdrawPublication
```

---

# 26. Publication Creation

A Publication may be created before final catalog availability during the registration workflow.

The Domain object may temporarily exist in preparation state, but no Reader-visible `AVAILABLE` state is permitted before a valid committed current source exists.

---

# 27. Metadata Update Rule

Metadata update:

* preserves PublicationId;
* preserves source versions;
* preserves current SourceVersion;
* changes `updatedAt`;
* requires CatalogRevision advancement at application level.

---

# 28. Source Replacement Rule

Replacing authoritative source bytes:

1. creates a new SourceVersion;
2. creates a new immutable SourcePublication;
3. validates and commits it;
4. activates it as current;
5. leaves prior versions historically identifiable;
6. requires CatalogRevision advancement.

---

# 29. Publication Availability

The publication availability state is:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

Availability is server authoritative.

---

# 30. Publication Acquisition Eligibility

A publication is acquirable only when:

```text
availability = AVAILABLE
AND currentSource exists
AND currentSource.integrityState = VALID
```

All three conditions are required.

---

# 31. Unavailable Publication

`UNAVAILABLE` means:

* the Publication remains part of the Master Catalog;
* acquisition is temporarily rejected;
* restoration is possible;
* existing device-local copies remain unaffected.

---

# 32. Withdrawn Publication

`WITHDRAWN` means:

* the Publication remains historically identifiable;
* new acquisition is rejected;
* automatic restoration is not implied;
* existing local copies are not remotely deleted.

---

# 33. Corrupted Publication

`CORRUPTED` means:

* authoritative source integrity failed;
* new acquisition is prohibited;
* administrative remediation is required;
* valid prior local copies remain independent.

---

# 34. Publication Aggregate Invariants

The aggregate shall enforce:

```text
PublicationId never changes
At most one current SourceVersion exists
SourceVersion values never repeat within one Publication
Current source belongs to the Publication
AVAILABLE requires one valid current source
WITHDRAWN is not acquirable
CORRUPTED is not acquirable
Metadata does not contain personal state
Source bytes changing requires new SourceVersion
Metadata-only changes preserve SourceVersion
```

---

# 35. AcquisitionOperation Aggregate

The `AcquisitionOperation` aggregate represents one logical acquisition on one device.

Conceptual structure:

```text
AcquisitionOperation
├── AcquisitionOperationId
├── ServerId
├── MasterLibraryId
├── PublicationId
├── requestedSourceVersion
├── AcquisitionState
├── AcquisitionProgress
├── AcquisitionAttempt[]
├── currentAttemptId?
├── expectedByteLength
├── expectedChecksum
├── createdAt
├── updatedAt
├── completedAt?
└── failure?
```

---

# 36. Acquisition Authority

AcquisitionOperation belongs to the device.

The server may observe transfer requests, but the device owns:

* whether the publication was requested locally;
* acquisition state;
* staging;
* validation;
* local installation;
* retry;
* cancellation;
* recovery.

---

# 37. Acquisition Target

The operation fixes:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
```

These values cannot change after creation.

A newer SourceVersion requires another operation.

---

# 38. AcquisitionProgress

Conceptual structure:

```text
AcquisitionProgress
├── bytesReceived
├── totalBytes
├── lastPersistedAt
└── calculatedPercentage?
```

`bytesReceived` shall never exceed `totalBytes` when total is known.

---

# 39. AcquisitionAttempt Ownership

`AcquisitionAttempt` is an entity owned by AcquisitionOperation.

The aggregate may contain multiple Attempts over time.

Only one Attempt may be active at a time.

---

# 40. Acquisition Attempt Structure

```text
AcquisitionAttempt
├── AcquisitionAttemptId
├── startedAt
├── endedAt?
├── initialOffset
├── finalOffset
├── AcquisitionTransferMode
├── AcquisitionAttemptOutcome?
└── FailureCode?
```

---

# 41. Acquisition Transfer Mode

Supported modes:

```text
FULL
RESUMED_RANGE
```

Additional modes require explicit Domain support.

---

# 42. Acquisition Attempt Outcome

Terminal outcomes:

```text
SUCCEEDED
FAILED
CANCELLED
INTERRUPTED
```

The aggregate operation may still continue through another Attempt after a retryable outcome.

---

# 43. Acquisition Commands

Conceptual commands include:

```text
CreateAcquisition
QueueAcquisition
StartAttempt
RecordProgress
PauseAcquisition
CompleteTransfer
BeginValidation
BeginInstallation
CompleteAcquisition
FailAttempt
FailAcquisition
CancelAcquisition
RequireRecovery
RetryAcquisition
ResumeAcquisition
```

---

# 44. Acquisition Main State Flow

```text
CREATED
    ↓
QUEUED
    ↓
DOWNLOADING
    ↓
VALIDATING
    ↓
INSTALLING
    ↓
COMPLETED
```

---

# 45. Acquisition Alternate States

```text
PAUSED
FAILED
CANCELLED
RECOVERY_REQUIRED
```

---

# 46. Acquisition Completion Rule

The aggregate may enter `COMPLETED` only after receiving confirmation that:

```text
payload exists in final local storage
byte length matches
checksum matches
SourceVersion matches
LocalLibraryItem has been committed
```

The Domain does not perform those infrastructure actions itself.

It receives verified facts from the Application layer.

---

# 47. Acquisition Failure Rule

The aggregate enters `FAILED` only when:

* a known failure occurred;
* the current Attempt is terminal;
* no ambiguous installation state remains;
* the operation may be safely retried or abandoned.

If commit outcome is ambiguous, use `RECOVERY_REQUIRED`.

---

# 48. Acquisition Cancellation Rule

Cancellation:

* is user- or policy-driven;
* stops further execution;
* does not mean corruption;
* does not create a LocalLibraryItem;
* may occur only in cancellable states.

---

# 49. Acquisition Retry Rule

Retry:

* preserves AcquisitionOperationId;
* creates a new AcquisitionAttemptId;
* preserves target identifiers;
* revalidates server and source context;
* moves the operation to an allowed executable state.

---

# 50. Acquisition Resume Rule

Resume is valid only when:

```text
partial payload exists
checkpoint belongs to this operation
server identity matches
MasterLibraryId matches
PublicationId matches
SourceVersion matches
ByteLength matches
Checksum matches
range is valid
```

Otherwise, the next Attempt must restart from zero.

---

# 51. Acquisition Aggregate Invariants

The aggregate shall enforce:

```text
Target identifiers are immutable
Only one current Attempt exists
Attempt identities never repeat
Progress never becomes negative
COMPLETED is terminal
CANCELLED is terminal for the current logical operation
FAILED is distinct from RECOVERY_REQUIRED
COMPLETED requires verified installation
Retry creates a new Attempt
Resume preserves exact SourceVersion
```

---

# 52. LocalLibraryItem Aggregate

The `LocalLibraryItem` aggregate represents one publication installed on one device.

Conceptual structure:

```text
LocalLibraryItem
├── LocalLibraryItemId
├── ServerId
├── MasterLibraryId
├── PublicationId
├── installedSourceVersion
├── LocalStorageReference
├── ByteLength
├── Checksum
├── LocalAvailability
├── LocalIntegrityState
├── MetadataSnapshot
├── acquiredAt
├── validatedAt
└── updatedAt
```

---

# 53. LocalLibraryItem Identity

Logical uniqueness is defined by:

```text
ServerId
+
MasterLibraryId
+
PublicationId
```

Only one currently installed LocalLibraryItem is active for that logical publication on one device.

Historical versions may remain physically retained according to cleanup policy, but they do not create several active local memberships.

---

# 54. LocalLibraryItemId

The implementation may use an explicit LocalLibraryItemId internally.

The Domain uniqueness still derives from the Library and Publication context.

LocalLibraryItemId shall not replace PublicationId in cross-system meaning.

---

# 55. Local Metadata Snapshot

The local item may retain a metadata snapshot for offline display.

The snapshot:

* is derived from Master Catalog data;
* may become stale;
* is not server authority;
* does not include personal state;
* may be refreshed independently from the local payload.

---

# 56. Local Availability

The local availability state is:

```text
AVAILABLE_LOCAL
MISSING
CORRUPTED
REMOVING
RECOVERY_REQUIRED
```

The absence of LocalLibraryItem corresponds to catalog-only or not-installed state.

---

# 57. Local Integrity

The local integrity state is:

```text
UNKNOWN
VALID
MISSING
CHECKSUM_MISMATCH
UNREADABLE
RECOVERY_REQUIRED
```

`AVAILABLE_LOCAL` requires `VALID` integrity.

---

# 58. LocalLibraryItem Commands

Conceptual commands include:

```text
InstallLocalPublication
ReplaceLocalPublication
MarkLocalPayloadMissing
MarkLocalPayloadCorrupted
MarkLocalPayloadUnreadable
BeginLocalRemoval
CompleteLocalRemoval
RequireLocalRecovery
RevalidateLocalPublication
RefreshMetadataSnapshot
```

---

# 59. New Local Installation

Creating a LocalLibraryItem requires verified facts:

```text
final payload committed
expected SourceVersion confirmed
expected ByteLength confirmed
expected Checksum confirmed
```

The resulting state is:

```text
LocalAvailability = AVAILABLE_LOCAL
LocalIntegrityState = VALID
```

---

# 60. Local Version Replacement

A newer installed SourceVersion may replace the current local version only after:

* new payload commit;
* size validation;
* checksum validation;
* new local record commit.

The previous valid source remains active until replacement succeeds.

---

# 61. Missing Local Payload

When the expected local payload is absent:

```text
LocalAvailability = MISSING
LocalIntegrityState = MISSING
```

The aggregate remains associated with the publication for diagnostics and potential reacquisition until removal policy decides otherwise.

---

# 62. Corrupted Local Payload

When checksum differs:

```text
LocalAvailability = CORRUPTED
LocalIntegrityState = CHECKSUM_MISMATCH
```

The item is not safely openable.

The server authority remains unchanged.

---

# 63. Local Removal

Local removal:

1. transitions to `REMOVING`;
2. coordinates physical file removal;
3. completes removal of local membership;
4. preserves server and Master Catalog state;
5. preserves future personal state unless explicitly handled elsewhere.

---

# 64. LocalLibraryItem Invariants

The aggregate shall enforce:

```text
Context identifiers never change
Installed SourceVersion is positive
AVAILABLE_LOCAL requires VALID integrity
AVAILABLE_LOCAL requires committed payload evidence
MISSING cannot report VALID integrity
CORRUPTED cannot report VALID integrity
Failed update preserves prior valid state
Local removal does not mutate server authority
Metadata snapshot is not authoritative
Personal state is absent
```

---

# 65. Relationship Between Publication and LocalLibraryItem

The relationship is referential, not aggregate ownership.

```text
Publication
    │
    │ PublicationId + SourceVersion
    ▼
LocalLibraryItem
```

The server Publication aggregate does not contain LocalLibraryItems.

The local aggregate does not mutate Publication.

---

# 66. Relationship Between Publication and AcquisitionOperation

AcquisitionOperation references:

```text
PublicationId
requestedSourceVersion
```

It does not contain or mutate the server Publication aggregate.

The application validates remote publication facts before execution.

---

# 67. Relationship Between AcquisitionOperation and LocalLibraryItem

A completed AcquisitionOperation produces or updates a LocalLibraryItem through an application workflow.

The operation does not directly own the LocalLibraryItem aggregate.

```text
AcquisitionOperation COMPLETED
        ↓
LocalLibraryItem installed or updated
```

Both commits are coordinated by the Application layer.

---

# 68. Cross-Aggregate Workflow: Publication Registration

Participating aggregate and services:

```text
MasterLibrary
Publication
SourcePublication
CatalogRevisionPolicy
PublicationStorage
CatalogRepository
```

Sequence:

1. create Publication identity;
2. create SourcePublication;
3. commit source externally;
4. activate Publication;
5. advance MasterLibrary CatalogRevision;
6. persist authoritative state.

---

# 69. Cross-Aggregate Workflow: Acquisition

Participating aggregates and services:

```text
AcquisitionOperation
LocalLibraryItem
ChecksumPolicy
LocalInstallationPolicy
DownloadTransport
LocalPublicationStorage
```

Sequence:

1. create AcquisitionOperation;
2. execute Attempt;
3. validate payload;
4. commit local payload;
5. create or replace LocalLibraryItem;
6. complete AcquisitionOperation.

---

# 70. Cross-Aggregate Workflow: Source Update

Server side:

```text
Publication
+
new SourcePublication
+
MasterLibrary CatalogRevision
```

Client side:

```text
AcquisitionOperation
+
existing LocalLibraryItem
+
replacement payload
```

The two sides are coordinated only through versioned contracts.

---

# 71. Domain Services

The approved initial Domain services are:

```text
PublicationVersionPolicy
PublicationAvailabilityPolicy
CatalogRevisionPolicy
AcquisitionTransitionPolicy
AcquisitionResumePolicy
LocalInstallationPolicy
DuplicatePublicationPolicy
```

---

# 72. PublicationVersionPolicy

Responsibilities:

* determine whether bytes changed;
* determine whether new SourceVersion is required;
* ensure versions increase;
* reject version reuse;
* distinguish metadata-only changes.

---

# 73. PublicationAvailabilityPolicy

Responsibilities:

* validate availability transitions;
* determine acquisition eligibility;
* require valid current source for restoration;
* distinguish temporary unavailability from withdrawal.

---

# 74. CatalogRevisionPolicy

Responsibilities:

* identify revision-worthy mutations;
* produce the next CatalogRevision;
* prevent decrement or reuse;
* exclude device-local changes.

---

# 75. AcquisitionTransitionPolicy

Responsibilities:

* validate state transitions;
* identify cancellable states;
* identify retryable terminal states;
* distinguish failed and recovery-required;
* enforce terminal-state behavior.

---

# 76. AcquisitionResumePolicy

Responsibilities:

* validate partial-payload identity;
* validate exact source context;
* validate offset;
* validate range capability;
* require clean restart when conditions fail.

---

# 77. LocalInstallationPolicy

Responsibilities:

* validate installation evidence;
* validate replacement safety;
* preserve previous version on failure;
* determine whether final state may become available.

---

# 78. DuplicatePublicationPolicy

Responsibilities:

* compare candidate metadata and source checksum;
* identify probable duplicate submission;
* avoid title-only identity assumptions;
* require explicit user or administrator decision for ambiguous cases.

---

# 79. Domain Events

The Domain may emit events after successful state transitions.

Server-authority events:

```text
MasterLibraryInitialized
MasterLibraryStateChanged
CatalogRevisionAdvanced
PublicationCreated
PublicationMetadataUpdated
SourceVersionAdded
SourceVersionActivated
PublicationAvailabilityChanged
PublicationWithdrawn
```

Device-authority events:

```text
AcquisitionCreated
AcquisitionQueued
AcquisitionAttemptStarted
AcquisitionProgressRecorded
AcquisitionValidationStarted
AcquisitionInstallationStarted
AcquisitionCompleted
AcquisitionFailed
AcquisitionCancelled
AcquisitionRecoveryRequired
LocalPublicationInstalled
LocalPublicationUpdated
LocalPublicationIntegrityChanged
LocalPublicationRemovalStarted
LocalPublicationRemoved
```

---

# 80. Domain Event Rules

Domain events shall:

* describe completed Domain facts;
* be immutable;
* carry stable identifiers;
* avoid infrastructure-specific values;
* avoid raw physical paths;
* avoid credentials;
* avoid personal state.

---

# 81. Event Publication Timing

Events shall not be treated as durable external facts before the related aggregate persistence succeeds.

The Application layer shall coordinate persistence and event dispatch.

For cross-resource workflows, durable operation records may be required before emitting final completion events.

---

# 82. Domain Events and CatalogRevision

Publication events that alter catalog-visible authority require a CatalogRevision advancement.

Examples:

```text
PublicationCreated
PublicationMetadataUpdated
SourceVersionActivated
PublicationAvailabilityChanged
PublicationWithdrawn
```

Acquisition and LocalLibraryItem events do not advance CatalogRevision.

---

# 83. Consistency Boundaries

Strong consistency is required inside:

* one MasterLibrary mutation;
* one Publication mutation;
* one AcquisitionOperation transition;
* one LocalLibraryItem transition.

Cross-aggregate and filesystem/database consistency uses application workflows.

---

# 84. No Distributed Transaction

The Domain model does not assume a distributed transaction across:

* server database;
* NAS filesystem;
* client database;
* client filesystem;
* network.

It assumes:

```text
staging
workflow state
commit ordering
idempotency
recovery
reconciliation
```

---

# 85. Server Authority Consistency

The server must preserve:

```text
AVAILABLE Publication
    ↔
valid current SourcePublication
    ↔
committed server payload
```

A violation requires the publication to leave `AVAILABLE`.

---

# 86. Device Authority Consistency

The client must preserve:

```text
AVAILABLE_LOCAL LocalLibraryItem
    ↔
valid committed local payload
    ↔
matching SourceVersion
    ↔
matching ByteLength
    ↔
matching Checksum
```

A violation requires local availability or integrity degradation.

---

# 87. Derived State

The following are derived rather than primary authority:

```text
updateAvailable
catalogEntryProjection
offlineCatalogFreshness
availableActions
progressPercentage
```

Derived state may be recomputed.

---

# 88. UpdateAvailable Derivation

`updateAvailable` is true when:

```text
same ServerId
AND same MasterLibraryId
AND same PublicationId
AND remote current SourceVersion > local installed SourceVersion
```

If remote state is unknown, update availability is unknown rather than false.

---

# 89. Available Actions Derivation

Client actions are derived from:

* connectivity;
* authentication;
* remote availability;
* local availability;
* acquisition state;
* version comparison;
* integrity state.

The Domain should provide policy logic, while Presentation renders the result.

---

# 90. Server and Client Semantic Contract

The shared semantic contract includes:

```text
MasterLibraryId
ServerId
PublicationId
SourceVersion
CatalogRevision
Checksum
ByteLength
PublicationAvailability
AcquisitionState names where transported
stable error codes
```

Both languages shall interpret these values consistently.

---

# 91. Cross-Language Enumeration Policy

Transport enumerations shall use stable string representations.

Examples:

```text
AVAILABLE
WITHDRAWN
CORRUPTED
```

Unknown future enum values shall not crash clients.

The client shall map unknown values to a safe unsupported state.

---

# 92. Domain Mapping Boundaries

Required mapping boundaries are:

```text
Database Record
    ↔
Server Domain

Server Domain
    ↔
OpenAPI DTO

OpenAPI DTO
    ↔
Swift Transport Model

Swift Transport Model
    ↔
Client Domain

Client Domain
    ↔
GRDB Record
```

No record or DTO shall become the Domain entity automatically.

---

# 93. Domain Package Boundaries

The TypeScript server Domain should reside in:

```text
packages/server-domain/
```

It may contain:

* entities;
* value objects;
* policies;
* Domain errors;
* Domain events;
* factories;
* tests.

It shall not import NestJS or Drizzle.

---

# 94. Client Domain Boundaries

The Swift client Domain should reside in a dedicated target or module.

It may contain:

* identifiers;
* publication projections;
* acquisition entities;
* LocalLibraryItem;
* state enums;
* policies;
* errors;
* tests.

It shall not import SwiftUI where avoidable.

---

# 95. Shared Fixture Package

Cross-language fixtures should reside under:

```text
packages/api-contract/fixtures/
```

or equivalent neutral location.

Fixtures may be consumed by:

* server contract tests;
* Swift tests;
* OpenAPI validation;
* E2E tests.

---

# 96. Domain Validation Rules

The Domain shall validate:

* non-empty identifiers;
* UUID representation where selected;
* positive SourceVersion;
* non-negative CatalogRevision;
* valid checksum algorithm and length;
* positive committed ByteLength;
* required publication title;
* supported source format;
* valid state transitions;
* consistent aggregate relationships.

---

# 97. Domain Construction

Preferred creation methods:

```text
MasterLibrary.initialize(...)
Publication.create(...)
SourcePublication.commit(...)
AcquisitionOperation.create(...)
LocalLibraryItem.install(...)
```

Preferred rehydration methods:

```text
MasterLibrary.rehydrate(...)
Publication.rehydrate(...)
AcquisitionOperation.rehydrate(...)
LocalLibraryItem.rehydrate(...)
```

Rehydration validates persisted state.

---

# 98. Domain Mutation

Mutation methods shall express intent.

Preferred:

```text
publication.updateMetadata(...)
publication.activateSource(...)
acquisition.startAttempt(...)
acquisition.beginValidation(...)
localItem.markMissing(...)
```

Prohibited:

```text
publication.state = ...
acquisition.progress = ...
localItem.checksum = ...
```

from outside the aggregate.

---

# 99. Domain Error Generation

Invalid operations shall fail with explicit Domain errors.

Examples:

```text
PUBLICATION_NOT_ACQUIRABLE
SOURCE_VERSION_ALREADY_EXISTS
INVALID_PUBLICATION_AVAILABILITY_TRANSITION
INVALID_ACQUISITION_TRANSITION
ACQUISITION_ATTEMPT_ALREADY_ACTIVE
LOCAL_PUBLICATION_NOT_VALID
INVALID_LOCAL_INTEGRITY_TRANSITION
```

---

# 100. Domain Testing Matrix

## MasterLibrary

Test:

* initialization;
* stable identity;
* revision advancement;
* unsupported state;
* invalid revision decrement.

## Publication

Test:

* creation;
* metadata update;
* source activation;
* version replacement;
* availability transitions;
* acquisition eligibility.

## AcquisitionOperation

Test:

* creation;
* state flow;
* retry;
* resume eligibility;
* cancellation;
* failure;
* recovery-required;
* completion evidence.

## LocalLibraryItem

Test:

* installation;
* update;
* missing payload;
* corruption;
* failed replacement preservation;
* removal isolation.

---

# 101. Domain Model Completion Gate

The Domain model is complete when:

```text
[ ] Bounded context is explicit
[ ] Aggregate roots are explicit
[ ] Entity ownership is explicit
[ ] Server authority is explicit
[ ] Device authority is explicit
[ ] Aggregate invariants are explicit
[ ] Cross-aggregate workflows are explicit
[ ] Domain services are explicit
[ ] Domain events are explicit
[ ] Consistency boundaries are explicit
[ ] Mapping boundaries are explicit
[ ] Cross-language semantics are explicit
[ ] Personal-state exclusion is explicit
[ ] Testing responsibilities are explicit
[ ] No architectural contradiction remains
```

---

# 102. Domain Model Invariants

The following invariants apply:

* MasterLibrary identity is stable.
* Publication identity is stable.
* SourcePublication is immutable after commit.
* Authoritative byte changes create new SourceVersion.
* Only one current source exists per Publication.
* `AVAILABLE` requires a valid committed current source.
* Acquisition targets one exact source version.
* Retry creates a new Attempt.
* `COMPLETED` requires successful local installation.
* `AVAILABLE_LOCAL` requires valid local integrity.
* Failed updates preserve the previous valid local version.
* Remote and local availability remain independent.
* Local removal affects only the current device.
* CatalogRevision excludes device-local changes.
* Personal state is absent.
* Domain meaning remains independent from framework and storage.

---

# 103. Prohibited Domain Models

The Domain shall not:

* model all publications as children loaded inside one MasterLibrary aggregate;
* use file paths as identity;
* make SourcePublication mutable after commit;
* permit two current SourceVersions;
* combine remote and local availability into one authoritative state;
* let the server own device acquisition state;
* let the client mutate publication authority;
* treat a cached catalog snapshot as Master Catalog authority;
* treat remote withdrawal as mandatory local deletion;
* treat `FAILED` and `RECOVERY_REQUIRED` as identical;
* reuse AcquisitionAttempt identity;
* include personal-state entities;
* depend on NestJS, Drizzle, GRDB, SwiftUI or HTTP.

---

# 104. Related Documents

## Domain

* `README.md`
* `Entities.md`
* `ValueObjects.md`
* `States.md`
* `Errors.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ErrorModel.md`

## Requirements

* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

---

# 105. Status

**Approved**

The aggregate model, authority boundaries, entity relationships, Domain services, Domain events and consistency boundaries of the Master Library Module are defined.

The next document is:

```text
01-MasterLibrary/03-Domain/Entities.md
```

It shall define each Domain entity and aggregate root in implementation-level detail.
