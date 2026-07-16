

# Master Library Domain

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Domain

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Domain implementation boundary of the Master Library Module.

The Domain layer expresses the business meaning, identity, state and invariants of:

* the NAS-hosted Master Library;
* the Master Catalog;
* source publications;
* publication versions;
* publication availability;
* publication acquisition;
* the Selective Local Library;
* local publication integrity.

The Domain shall remain independent from:

* NestJS;
* Fastify;
* HTTP;
* OpenAPI;
* SQLite;
* Drizzle;
* GRDB;
* SwiftUI;
* URLSession;
* filesystem APIs;
* container runtime;
* NAS vendor APIs.

---

# 2. Scope

The Domain area defines:

* entities;
* aggregate boundaries;
* value objects;
* stable identifiers;
* state machines;
* invariants;
* Domain services;
* Domain errors;
* creation rules;
* transition rules;
* equality rules;
* serialization boundaries;
* persistence-independent behavior.

The Domain area does not define:

* database tables;
* HTTP endpoints;
* JSON DTOs;
* SwiftUI screens;
* file paths;
* ORM models;
* application configuration;
* infrastructure retries;
* deployment behavior.

---

# 3. Core Domain Principle

> Domain identity and state shall be expressed independently from where or how data is stored, transported or displayed.

Examples:

```text
PublicationId
```

is a Domain identity.

It is not:

* a database primary-key implementation;
* a file name;
* a NAS path;
* an HTTP route parameter;
* a SwiftUI model identifier.

---

# 4. Domain Authority

The Master Library Domain is authoritative for the meaning of:

* MasterLibraryId;
* PublicationId;
* SourceVersion;
* CatalogRevision;
* MasterLibraryManifest;
* MasterCatalogEntry;
* SourcePublication;
* PublicationAvailability;
* AcquisitionOperation;
* AcquisitionAttempt;
* AcquisitionState;
* LocalLibraryItem;
* LocalAvailability;
* LocalIntegrityState;
* valid state transitions;
* Domain-level errors.

---

# 5. Domain Documents

The Domain area contains:

```text
03-Domain/
├── README.md
├── DomainModel.md
├── Entities.md
├── ValueObjects.md
├── States.md
└── Errors.md
```

---

# 6. DomainModel.md

`DomainModel.md` shall define:

* bounded context;
* aggregates;
* aggregate roots;
* entity relationships;
* Domain services;
* command and event meaning;
* authority boundaries;
* aggregate consistency boundaries.

---

# 7. Entities.md

`Entities.md` shall define:

* MasterLibrary;
* Publication;
* SourcePublication;
* AcquisitionOperation;
* AcquisitionAttempt;
* LocalLibraryItem;
* identity;
* lifecycle;
* ownership;
* mutation rules.

---

# 8. ValueObjects.md

`ValueObjects.md` shall define:

* MasterLibraryId;
* PublicationId;
* SourceVersion;
* CatalogRevision;
* Checksum;
* ByteLength;
* MediaType;
* LanguageCode;
* PublicationTitle;
* ServerIdentity;
* StorageReference;
* Cursor;
* timestamps where Domain-significant.

---

# 9. States.md

`States.md` shall define:

* Master Library state;
* publication availability;
* acquisition state;
* local availability;
* local integrity;
* valid transitions;
* prohibited transitions;
* terminal states;
* recovery states.

---

# 10. Errors.md

`Errors.md` shall define the Domain-owned error set.

Infrastructure and transport errors shall be mapped into Domain or Application errors only where Domain meaning exists.

---

# 11. Bounded Context

The bounded context is:

```text
Master Library
```

It contains two authority areas.

## 11.1 Master Authority

Owned by KnowledgeOS Server:

* Master Library;
* Master Catalog;
* publication identity;
* source versions;
* source availability;
* master-source metadata.

## 11.2 Device-Local Authority

Owned by the client device:

* acquisition operations;
* local publication membership;
* local payload validity;
* local removal;
* device-specific availability.

These areas share identifiers but not persistence.

---

# 12. Aggregate Overview

The initial aggregate model is:

```text
MasterLibrary
└── Master Catalog authority

Publication
├── master metadata
├── current SourceVersion
├── source-version history
└── availability

AcquisitionOperation
├── requested PublicationId
├── requested SourceVersion
├── Attempts
└── acquisition state

LocalLibraryItem
├── PublicationId
├── installed SourceVersion
├── local integrity
└── local availability
```

---

# 13. Aggregate Roots

The initial aggregate roots are:

```text
MasterLibrary
Publication
AcquisitionOperation
LocalLibraryItem
```

`SourcePublication` and `AcquisitionAttempt` are owned entities inside their respective aggregates unless later implementation evidence requires separate aggregate boundaries.

---

# 14. MasterLibrary Aggregate

The MasterLibrary aggregate represents one logical Master Library.

It owns:

* MasterLibraryId;
* name;
* format version;
* creation time;
* current CatalogRevision;
* Library state.

It does not contain every publication entity in memory.

Catalog persistence manages publication retrieval independently.

---

# 15. MasterLibrary Invariants

A MasterLibrary shall:

* have exactly one stable MasterLibraryId;
* have one supported format version;
* have one current CatalogRevision;
* never derive identity from filesystem path;
* never contain personal-state authority;
* never change identity after initialization;
* reject unsupported state transitions.

---

# 16. Publication Aggregate

The Publication aggregate represents one logical publication in the Master Catalog.

It owns:

* PublicationId;
* master metadata;
* current SourceVersion;
* known source versions;
* PublicationAvailability;
* creation time;
* update time.

---

# 17. Publication Invariants

A Publication shall:

* have one stable PublicationId;
* have at most one current SourceVersion;
* preserve historical SourceVersion identity;
* create a new SourceVersion when authoritative bytes change;
* preserve SourceVersion for metadata-only changes;
* reject acquisition when unavailable, withdrawn or corrupted;
* never contain personal annotations or reading progress;
* never derive identity from file name or path.

---

# 18. SourcePublication Entity

A SourcePublication represents one authoritative source payload version.

It contains:

* SourceVersion;
* format;
* media type;
* byte length;
* checksum;
* logical storage reference;
* creation time;
* integrity state.

---

# 19. SourcePublication Invariants

A SourcePublication shall:

* belong to exactly one PublicationId;
* have one immutable SourceVersion;
* have positive ByteLength;
* have one supported checksum algorithm;
* have one logical storage reference;
* remain immutable after becoming committed;
* never expose physical storage path as Domain identity.

---

# 20. AcquisitionOperation Aggregate

An AcquisitionOperation represents one logical device-side effort to acquire one exact publication version.

It owns:

* AcquisitionOperationId;
* PublicationId;
* requested SourceVersion;
* server identity;
* MasterLibraryId;
* current AcquisitionState;
* progress;
* Attempts;
* creation time;
* completion or failure state.

---

# 21. AcquisitionOperation Invariants

An AcquisitionOperation shall:

* target exactly one PublicationId;
* target exactly one SourceVersion;
* belong to exactly one server and Master Library context;
* preserve identity across retries;
* create a new Attempt for each execution;
* become completed only after local installation;
* never mark partial payload as complete;
* reject invalid state transitions;
* distinguish cancellation from failure;
* distinguish recovery-required from failure.

---

# 22. AcquisitionAttempt Entity

An AcquisitionAttempt represents one execution of an AcquisitionOperation.

It contains:

* AcquisitionAttemptId;
* start time;
* end time;
* initial offset;
* final offset;
* transfer mode;
* outcome;
* failure code.

---

# 23. AcquisitionAttempt Invariants

An Attempt shall:

* belong to one AcquisitionOperation;
* have one unique identity;
* never be reused;
* have a valid start time;
* have at most one terminal outcome;
* never mutate the operation target PublicationId or SourceVersion;
* record resume offset when applicable.

---

# 24. LocalLibraryItem Aggregate

A LocalLibraryItem represents one publication installed on one device.

It owns:

* PublicationId;
* ServerIdentity;
* MasterLibraryId;
* installed SourceVersion;
* logical local storage reference;
* byte length;
* checksum;
* local availability;
* local integrity;
* acquisition and validation timestamps.

---

# 25. LocalLibraryItem Invariants

A LocalLibraryItem shall:

* represent one device-local publication;
* refer to one PublicationId;
* refer to one installed SourceVersion;
* remain isolated by server and Master Library identity;
* become available only after payload validation and commit;
* never imply that another device has the same publication;
* never imply that the NAS contains personal state;
* never use physical path as stable identity;
* preserve current valid version during failed update.

---

# 26. Domain Services

The initial Domain services may include:

```text
PublicationVersionPolicy
PublicationAvailabilityPolicy
CatalogRevisionPolicy
AcquisitionTransitionPolicy
LocalInstallationPolicy
ChecksumPolicy
DuplicatePublicationPolicy
```

A Domain service is appropriate only when behavior does not naturally belong to one aggregate.

---

# 27. PublicationVersionPolicy

This policy determines whether a change requires a new SourceVersion.

A new SourceVersion is required when:

* source bytes change;
* source checksum changes;
* source byte length changes;
* source format changes;
* authoritative payload is replaced.

A new SourceVersion is not required when only:

* title changes;
* author metadata changes;
* subjects change;
* description changes;
* cover metadata changes independently;
* publisher metadata changes.

---

# 28. PublicationAvailabilityPolicy

This policy validates transitions among:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

Examples:

```text
AVAILABLE → UNAVAILABLE
AVAILABLE → WITHDRAWN
AVAILABLE → CORRUPTED
UNAVAILABLE → AVAILABLE
CORRUPTED → AVAILABLE
```

Restoration to `AVAILABLE` requires evidence that the current authoritative source is valid and deliverable.

---

# 29. CatalogRevisionPolicy

CatalogRevision shall advance when catalog-visible authoritative state changes.

It shall advance for:

* publication creation;
* metadata update;
* current SourceVersion update;
* availability change;
* withdrawal;
* restoration.

It shall not advance for:

* client catalog caching;
* local acquisition;
* local removal;
* local integrity change;
* personal state.

---

# 30. AcquisitionTransitionPolicy

This policy validates AcquisitionState transitions.

Baseline main flow:

```text
CREATED
→ QUEUED
→ DOWNLOADING
→ VALIDATING
→ INSTALLING
→ COMPLETED
```

Alternative transitions include:

```text
QUEUED → CANCELLED
DOWNLOADING → CANCELLED
DOWNLOADING → PAUSED
PAUSED → DOWNLOADING
DOWNLOADING → FAILED
VALIDATING → FAILED
INSTALLING → FAILED
INSTALLING → RECOVERY_REQUIRED
```

---

# 31. LocalInstallationPolicy

A LocalLibraryItem may become `AVAILABLE_LOCAL` only when:

```text
payload committed
AND byte length verified
AND checksum verified
AND SourceVersion verified
AND LocalLibraryItem persisted
```

---

# 32. DuplicatePublicationPolicy

Duplicate handling shall distinguish:

* identical submitted bytes;
* same metadata with different bytes;
* same title with unrelated publication;
* explicit new edition;
* explicit replacement version.

The Domain shall not equate identical title with identical publication identity automatically.

---

# 33. Domain Identifiers

All Domain identifiers shall be:

* immutable;
* non-empty;
* value-comparable;
* serializable;
* opaque outside defined representations;
* generated through approved factories.

---

# 34. Identifier Types

The initial Domain identifier types are:

```text
MasterLibraryId
PublicationId
AcquisitionOperationId
AcquisitionAttemptId
DeviceId
ServerId
```

SourceVersion and CatalogRevision are version values rather than general entity identifiers.

---

# 35. Identifier Representation

The baseline representation should use UUID-compatible values unless a later Domain requirement justifies another scheme.

The Domain shall depend on the semantic identifier type, not on raw strings.

---

# 36. SourceVersion

SourceVersion is an immutable, orderable version value within one Publication.

The baseline may use a positive monotonically increasing integer:

```text
1
2
3
...
```

SourceVersion values are not globally comparable across publications.

---

# 37. CatalogRevision

CatalogRevision is an immutable, orderable revision value within one Master Library.

The baseline may use a positive monotonically increasing integer.

A CatalogRevision belongs to exactly one MasterLibraryId.

---

# 38. Checksum

Checksum is a value object containing:

```text
algorithm
value
```

The approved initial algorithm is:

```text
SHA-256
```

The checksum value shall use canonical normalized representation.

---

# 39. ByteLength

ByteLength represents the exact source-payload size.

It shall:

* be non-negative;
* use integer semantics;
* support comparison;
* reject invalid numeric values;
* not use floating-point representation.

Committed publication sources shall have a positive ByteLength.

---

# 40. StorageReference

StorageReference represents a logical storage reference.

It shall not contain public physical-path meaning.

Examples:

```text
publication-source://...
local-publication://...
cover-asset://...
```

The exact serialized representation belongs to Persistence and Infrastructure.

---

# 41. Publication Metadata

Master publication metadata includes:

* title;
* subtitle;
* authors;
* contributors;
* language;
* description;
* subjects;
* publisher;
* publication date;
* publication type;
* source format;
* cover reference.

It excludes personal metadata.

---

# 42. PublicationTitle

PublicationTitle shall:

* be non-empty after normalization;
* preserve user-visible text;
* define a normalized search/sort representation separately;
* reject invalid control-only content;
* have bounded length.

---

# 43. Author and Contributor Values

Authors and contributors shall use value objects rather than raw unchecked strings where practical.

The first implementation may use:

```text
ContributorName
ContributorRole
```

Persistent identity for external people is outside this module.

---

# 44. Language

Language shall use a normalized language code representation.

The baseline should accept valid BCP 47-compatible values.

Validation belongs to the value-object factory.

---

# 45. MediaType

MediaType shall represent supported source media types.

The initial required source type is:

```text
application/pdf
```

MediaType shall not be inferred only from file extension.

---

# 46. PublicationFormat

The initial approved format is:

```text
PDF
```

Additional formats require explicit Domain support and acceptance criteria.

---

# 47. Time Values

Domain-significant times include:

* Library creation;
* publication creation;
* publication update;
* source-version creation;
* acquisition creation;
* Attempt start and end;
* local acquisition;
* local validation.

Time shall be provided through an injected clock at application boundaries.

Domain tests shall not depend on wall-clock time directly.

---

# 48. Domain Commands

Conceptual Domain or application commands include:

```text
InitializeMasterLibrary
RegisterPublication
UpdatePublicationMetadata
ReplacePublicationSource
ChangePublicationAvailability
WithdrawPublication
CreateAcquisitionOperation
QueueAcquisition
StartAcquisitionAttempt
RecordAcquisitionProgress
CompleteAcquisitionTransfer
ValidateAcquiredPayload
BeginLocalInstallation
CompleteLocalInstallation
FailAcquisition
CancelAcquisition
MarkLocalPublicationMissing
MarkLocalPublicationCorrupted
RemoveLocalPublication
```

---

# 49. Domain Events

The initial implementation may emit Domain events such as:

```text
MasterLibraryInitialized
PublicationRegistered
PublicationMetadataUpdated
PublicationSourceReplaced
PublicationAvailabilityChanged
PublicationWithdrawn
CatalogRevisionAdvanced
AcquisitionCreated
AcquisitionStarted
AcquisitionProgressed
AcquisitionValidationStarted
AcquisitionInstallationStarted
AcquisitionCompleted
AcquisitionFailed
AcquisitionCancelled
LocalPublicationInstalled
LocalPublicationRemoved
LocalPublicationIntegrityChanged
```

The existence of Domain events does not require a message broker.

---

# 50. Domain Event Purpose

Domain events may support:

* internal decoupling;
* audit creation;
* metrics;
* cache invalidation;
* projection updates;
* tests.

They shall not become ungoverned cross-module integration events automatically.

---

# 51. Aggregate Consistency Boundaries

Strong aggregate consistency applies within:

* one Publication mutation;
* one AcquisitionOperation transition;
* one LocalLibraryItem transition;
* one MasterLibrary revision mutation.

Cross-resource consistency is handled by application workflows and recovery.

---

# 52. Cross-Aggregate Coordination

Examples requiring application orchestration:

```text
SourcePublication commit
+
Publication aggregate activation
+
CatalogRevision advancement
```

and:

```text
AcquisitionOperation completion
+
local payload commit
+
LocalLibraryItem creation
```

No aggregate shall pretend to provide a distributed transaction across filesystem and database.

---

# 53. Domain Validation

Domain factories shall validate:

* identifiers;
* versions;
* checksums;
* byte lengths;
* titles;
* language values;
* availability transitions;
* acquisition transitions;
* required relationships.

Invalid Domain objects shall not be constructed.

---

# 54. Construction Pattern

Entities and value objects should use:

* explicit factory methods;
* validated constructors;
* named creation methods;
* controlled rehydration methods.

Unvalidated public mutable construction is prohibited.

---

# 55. Rehydration

Persistence rehydration shall:

* validate stored identity;
* validate stored state;
* reject impossible combinations;
* distinguish corrupted persistence from ordinary validation failure.

Persistence records shall not be trusted blindly.

---

# 56. Equality

Value objects compare by value.

Entities compare by stable identity.

Examples:

```text
Publication equality
→ PublicationId

AcquisitionOperation equality
→ AcquisitionOperationId

Checksum equality
→ algorithm + value
```

---

# 57. Mutability

Entities may evolve only through explicit methods.

Examples:

```text
publication.updateMetadata(...)
publication.replaceSource(...)
publication.markUnavailable(...)
acquisition.queue(...)
acquisition.startAttempt(...)
acquisition.complete(...)
```

Public property mutation is prohibited for Domain state.

---

# 58. Immutability

The following are immutable after creation:

* MasterLibraryId;
* PublicationId;
* SourceVersion identity;
* AcquisitionOperationId;
* AcquisitionAttemptId;
* ServerId;
* DeviceId;
* committed checksum;
* committed byte length.

---

# 59. Domain Error Boundary

Domain errors shall indicate violated meaning.

Examples:

```text
INVALID_PUBLICATION_STATE
INVALID_SOURCE_VERSION
INVALID_ACQUISITION_TRANSITION
INVALID_LOCAL_AVAILABILITY_TRANSITION
PUBLICATION_NOT_ACQUIRABLE
CHECKSUM_INVALID
BYTE_LENGTH_INVALID
```

Filesystem and network failures are not Domain errors until translated into meaningful application failure.

---

# 60. Serialization Boundary

Domain objects shall not define their public HTTP JSON representation directly.

Mappings shall exist between:

```text
Domain
↔ Persistence Records

Domain
↔ API DTOs

Domain
↔ Swift Client Models
```

This prevents transport and persistence concerns from defining Domain shape.

---

# 61. Server and Client Domain Sharing

The server and Swift client cannot share executable Domain code directly because they use different languages.

They shall share semantics through:

* documentation;
* API contracts;
* stable error registry;
* invariant tests;
* generated transport models;
* cross-language fixtures.

---

# 62. Cross-Language Contract Fixtures

The module should maintain fixtures for:

* valid identifiers;
* invalid identifiers;
* SourceVersion;
* CatalogRevision;
* checksums;
* publication metadata;
* availability states;
* acquisition states;
* error codes.

Server and client tests shall validate compatible interpretation.

---

# 63. Personal-State Exclusion

The Domain shall not define within Master Library:

* Annotation;
* ReadingProgress;
* PersonalTag;
* Favorite;
* PersonalRelationship;
* PersonalNote;
* CloudSyncState.

These belong to future modules.

---

# 64. Master Library versus Local Library

The Domain shall preserve the distinction:

```text
Master Catalog membership
≠
device-local publication presence
```

A publication may:

* exist in the Master Catalog;
* not exist locally;
* exist locally on one device;
* not exist locally on another device.

---

# 65. Remote Availability versus Local Availability

Remote and local states are independent.

Example:

```text
Remote: WITHDRAWN
Local: AVAILABLE_LOCAL
```

is valid.

The user may retain an already acquired local publication even when the NAS no longer offers new acquisition.

---

# 66. Remote Corruption versus Local Validity

Example:

```text
Remote source: CORRUPTED
Local payload: VALID
```

may be valid when the local payload was previously acquired and verified.

The client shall not invalidate a valid local file merely because the server source later becomes unavailable.

---

# 67. Update Availability

Update availability is derived from:

```text
remote current SourceVersion
>
local installed SourceVersion
```

within the same PublicationId and MasterLibraryId context.

It is not a persisted source-authority state by itself.

---

# 68. Acquisition Completion

An AcquisitionOperation becomes `COMPLETED` only after:

```text
network transfer complete
AND byte length verified
AND checksum verified
AND final file committed
AND LocalLibraryItem committed
```

---

# 69. Acquisition Failure

An AcquisitionOperation becomes `FAILED` when:

* the current Attempt ends unsuccessfully;
* the operation has a known safe failure state;
* no ambiguous installation outcome remains.

Ambiguous state becomes `RECOVERY_REQUIRED`.

---

# 70. Cancellation

Cancellation is a terminal operation state unless the user explicitly creates or retries an acquisition.

Cancellation does not imply:

* corruption;
* authorization failure;
* permanent inability to acquire.

---

# 71. Retry

Retry shall:

* preserve AcquisitionOperationId;
* create a new AcquisitionAttemptId;
* preserve PublicationId;
* preserve or explicitly revalidate requested SourceVersion;
* reset attempt-specific progress;
* retain prior Attempt history.

---

# 72. Resume

Resume is permitted only when:

* SourceVersion remains unchanged;
* expected checksum remains unchanged;
* expected ByteLength remains unchanged;
* partial payload belongs to the same operation;
* offset is valid;
* server supports the requested range.

Otherwise, the Domain policy requires a new Attempt from byte zero.

---

# 73. Local Removal

Local removal affects only:

* LocalLibraryItem;
* local payload;
* device-local acquisition artifacts.

It does not affect:

* Publication aggregate;
* Master Catalog;
* source publication on NAS;
* another device;
* personal state.

---

# 74. Domain Persistence Independence

The Domain shall not know:

* SQLite table names;
* SQL column names;
* Drizzle schema types;
* GRDB record types;
* NAS paths;
* Application Support paths;
* OpenAPI schemas.

---

# 75. Domain Test Strategy

Domain tests shall cover:

* entity creation;
* value-object validation;
* identifier equality;
* source-version rules;
* availability transitions;
* acquisition transitions;
* retry semantics;
* resume eligibility;
* local installation invariants;
* local removal isolation;
* remote/local independence;
* error generation.

---

# 76. Property-Based Testing Candidates

Property-based tests may be useful for:

* identifier parsing;
* checksum normalization;
* SourceVersion ordering;
* CatalogRevision ordering;
* state-transition rejection;
* byte-length validation;
* cursor opacity where Domain-relevant.

---

# 77. Domain Fixtures

The module shall define deterministic fixtures for:

* MasterLibraryId;
* PublicationId;
* SourceVersion 1 and 2;
* CatalogRevision;
* valid PDF metadata;
* SHA-256 checksum;
* small and large ByteLength;
* AcquisitionOperation;
* LocalLibraryItem.

Fixtures shall not depend on production identifiers.

---

# 78. Domain Documentation Status

The current Domain documentation state is:

```text
README.md         Approved
DomainModel.md    Pending
Entities.md       Pending
ValueObjects.md   Pending
States.md         Pending
Errors.md         Pending
```

---

# 79. Domain Completion Gate

The Domain area is complete when:

```text
[ ] README.md is Approved
[ ] DomainModel.md is Approved
[ ] Entities.md is Approved
[ ] ValueObjects.md is Approved
[ ] States.md is Approved
[ ] Errors.md is Approved
[ ] Aggregate roots are explicit
[ ] Identity rules are explicit
[ ] Version rules are explicit
[ ] State transitions are explicit
[ ] Invariants are explicit
[ ] Domain services are explicit
[ ] Domain events are explicit
[ ] Persistence independence is explicit
[ ] Server/client semantic compatibility is explicit
[ ] Personal-state exclusion is explicit
[ ] No architectural contradiction remains
```

---

# 80. Domain Invariants

The following invariants apply:

* MasterLibraryId is stable.
* PublicationId is stable.
* SourceVersion changes only when authoritative bytes change.
* CatalogRevision changes only for authoritative catalog-visible changes.
* Publication identity is independent from path and file name.
* An available remote publication has a committed valid source.
* A locally available publication has a committed validated local payload.
* Acquisition fixes one PublicationId and SourceVersion.
* Retry creates a new Attempt.
* Cancellation is distinct from failure.
* Recovery-required is distinct from failure.
* Current valid local versions survive failed updates.
* Local removal affects only the current device.
* Device Libraries are not NAS replicas.
* Personal state remains outside the Master Library Domain.
* Domain does not depend on frameworks or infrastructure.

---

# 81. Prohibited Domain Designs

The Domain shall not:

* use raw strings for every identity without validation;
* derive identity from file path;
* expose public mutable entity properties;
* allow impossible state construction;
* treat HTTP status as Domain meaning;
* import NestJS or persistence decorators;
* define database rows as entities directly;
* combine Master Catalog and Local Library authority;
* treat local absence as remote absence;
* treat remote withdrawal as local deletion;
* treat download completion as acquisition completion;
* permit retry to reuse Attempt identity;
* store personal state;
* model iCloud synchronization inside acquisition.

---

# 82. Related Documents

## Domain

* `DomainModel.md`
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
* `../02-TechnicalDesign/TechnologyDecisions.md`

## Requirements

* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

---

# 83. Status

**Approved**

The Domain implementation boundary of the Master Library Module is established.

The next document is:

```text
01-MasterLibrary/03-Domain/DomainModel.md
```

It shall define the aggregate model, aggregate roots, entity relationships, Domain services and consistency boundaries in detail.
