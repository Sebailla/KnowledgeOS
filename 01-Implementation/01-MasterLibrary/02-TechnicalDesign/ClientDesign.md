
# Master Library Client Design

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Technical Design

**Document:** Client Design

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Requirements Baseline:** Master Library Requirements v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the internal technical design of the KnowledgeOS macOS client for the Master Library Module.

It specifies:

* client responsibilities;
* feature boundaries;
* application state;
* dependency direction;
* server registration;
* server trust;
* authentication;
* catalog browsing;
* publication details;
* acquisition management;
* local persistence;
* local publication storage;
* offline behavior;
* recovery;
* error presentation;
* observability;
* testing boundaries.

The macOS client is the reference client for the first complete Master Library vertical.

---

# 2. Scope

The client design covers:

* application startup;
* local database initialization;
* server registration;
* trusted server identity;
* client authentication;
* connectivity monitoring;
* Master Catalog browsing;
* catalog search;
* publication details;
* publication acquisition;
* transfer progress;
* cancellation;
* retry;
* optional resume;
* payload validation;
* local installation;
* Selective Local Library;
* local publication removal;
* offline availability;
* reconnect behavior;
* local integrity validation;
* diagnostics.

It does not cover:

* full Reader implementation;
* annotations;
* reading progress;
* personal tags;
* personal relationships;
* iCloud synchronization;
* CloudKit;
* UDM;
* DPM;
* AI;
* Plugins.

---

# 3. Core Client Principle

> The client owns device-specific publication acquisition and local availability, while the server remains authoritative for the Master Catalog and source publications.

The client shall never interpret its Selective Local Library as a replica of the NAS Master Library.

---

# 4. Client Responsibilities

The client owns:

* server endpoint registration;
* trusted server identity;
* secure client credentials;
* connection state;
* catalog snapshot cache;
* catalog browsing;
* local/remote availability mapping;
* acquisition lifecycle;
* local staging;
* local checksum validation;
* local installation;
* LocalLibraryItem persistence;
* local publication removal;
* offline local access;
* user-facing error state;
* client diagnostics.

---

# 5. Client Non-Responsibilities

The client shall not own:

* Master Catalog authority;
* PublicationId creation;
* SourceVersion creation;
* NAS source-file mutation;
* server-side availability;
* Master Library validation;
* administrative catalog mutation;
* personal-state synchronization in this module;
* server authentication policy;
* server authorization policy.

---

# 6. Architectural Style

The macOS client shall use a feature-oriented modular architecture.

Logical layers:

```text
Application
Presentation
Features
Client Domain
Services
Persistence
Storage
Platform Adapters
Diagnostics
```

Dependency direction shall point inward toward feature and Domain abstractions.

---

# 7. Dependency Direction

```text
SwiftUI Views
    ↓
Feature State and Use Cases
    ↓
Client Domain Models
    ↓
Service Protocols
    ↓
Network / Persistence / Storage Adapters
```

Views shall not:

* build raw HTTP requests;
* access the database directly;
* calculate checksums directly;
* manipulate unmanaged filesystem paths;
* decide acquisition state transitions independently.

---

# 8. Client Module Structure

The client shall be divided into:

```text
Client
├── App
├── ServerConnection
├── MasterCatalog
├── PublicationDetails
├── Acquisition
├── LocalLibrary
├── Persistence
├── Storage
├── Security
├── Diagnostics
└── Shared
```

---

# 9. App Module

The App Module owns:

* process entry;
* application lifecycle;
* root dependency construction;
* local migration execution;
* startup recovery;
* initial navigation;
* top-level application state;
* global error boundary.

The App Module shall remain thin.

---

# 10. App Startup Sequence

```text
Application starts
    ↓
Open local database
    ↓
Run client migrations
    ↓
Load registered servers
    ↓
Load trusted server identity metadata
    ↓
Recover incomplete acquisitions
    ↓
Validate Selective Local Library references
    ↓
Initialize connectivity state
    ↓
Render root navigation
```

The application shall not block local Library access merely because the NAS is unavailable.

---

# 11. Root Application State

The root state shall expose at least:

```text
applicationLifecycleState
activeServer
connectionState
authenticationState
localLibraryAvailability
globalOperationState
```

Feature-specific state shall remain inside its owning feature.

---

# 12. ServerConnection Module

The ServerConnection Module owns:

* server endpoint registration;
* server identity retrieval;
* trust confirmation;
* secure credential access;
* authentication;
* session lifecycle;
* connectivity state;
* reconnect behavior;
* compatibility evaluation.

---

# 13. RegisteredServer Model

Conceptually:

```text
RegisteredServer
├── registrationId
├── endpoint
├── serverIdentity
├── masterLibraryId?
├── displayName
├── trustState
├── authenticationState
├── lastSuccessfulConnectionAt
├── lastFailure
└── createdAt
```

The endpoint is not the server identity.

---

# 14. Server Endpoint

A server endpoint contains:

```text
scheme
host
port
basePath
```

The endpoint shall be validated before persistence.

Raw credentials shall not be embedded in the endpoint URL.

---

# 15. Server Identity

Server identity shall be a stable logical or cryptographic identity returned by KnowledgeOS Server.

It shall remain independent from:

* IP address;
* hostname;
* local DNS name;
* port.

A changed identity at a previously trusted endpoint shall block automatic authentication.

---

# 16. Server Trust States

```text
UNREGISTERED
PENDING_TRUST
TRUSTED
IDENTITY_MISMATCH
REVOKED
```

## UNREGISTERED

No server configuration exists.

## PENDING_TRUST

The endpoint is known, but server identity has not been approved.

## TRUSTED

The presented server identity matches the stored trusted identity.

## IDENTITY_MISMATCH

The endpoint presents a different identity.

## REVOKED

The local registration is intentionally disabled.

---

# 17. Server Registration Flow

```text
User enters endpoint
    ↓
Validate endpoint
    ↓
Connect to server identity endpoint
    ↓
Retrieve server identity and capabilities
    ↓
Present trust information
    ↓
User confirms
    ↓
Persist registration
    ↓
Begin device authentication
```

---

# 18. Identity Mismatch Flow

```text
Connect to registered endpoint
    ↓
Retrieve server identity
    ↓
Compare with trusted identity
    ↓
Mismatch detected
    ↓
Block credential transmission
    ↓
Display explicit security warning
    ↓
Require governed trust action
```

The client shall never silently replace the stored identity.

---

# 19. Security Module

The Security Module owns:

* Keychain access;
* client credential storage;
* credential retrieval;
* credential deletion;
* trust evidence;
* authentication tokens;
* secure-memory handling where applicable.

Secrets shall not be stored in ordinary client persistence.

---

# 20. Authentication State

```text
UNAUTHENTICATED
AUTHENTICATING
AUTHENTICATED
EXPIRED
REVOKED
FAILED
```

Authentication state is distinct from connectivity state.

---

# 21. Connectivity State

```text
UNKNOWN
CONNECTING
ONLINE
OFFLINE
DEGRADED
IDENTITY_MISMATCH
```

## ONLINE

The server identity is trusted, authentication is valid and required endpoints respond.

## OFFLINE

The server cannot currently be reached.

## DEGRADED

The server responds, but required Library capabilities are unavailable.

---

# 22. Connectivity Monitor

The Connectivity Monitor shall:

* observe request outcomes;
* distinguish network unavailability from authentication failure;
* avoid aggressive retry loops;
* expose last successful connection;
* expose last failure category;
* support manual reconnect;
* support bounded automatic reconnect.

Connectivity shall not be inferred only from operating-system network status.

---

# 23. MasterCatalog Module

The MasterCatalog Module owns:

* catalog page requests;
* search;
* filters;
* sorting;
* cached catalog snapshot;
* CatalogRevision;
* freshness;
* local-state projection;
* catalog presentation state.

---

# 24. CatalogEntryProjection

The UI shall consume a client projection combining:

```text
MasterCatalogEntry
+
LocalLibraryItem?
+
AcquisitionOperation?
+
ConnectivityState
```

Conceptually:

```text
CatalogEntryProjection
├── publicationId
├── masterMetadata
├── remoteAvailability
├── remoteSourceVersion
├── localAvailability
├── localSourceVersion?
├── acquisitionState?
├── updateAvailable
└── availableActions
```

---

# 25. Catalog Snapshot

The client may persist a catalog snapshot containing:

* server identity;
* MasterLibraryId;
* CatalogRevision;
* entries;
* retrieval timestamp;
* pagination metadata where useful.

The snapshot is derived state.

It may be replaced safely.

---

# 26. Snapshot Isolation

Catalog snapshots shall be isolated by:

```text
ServerIdentity
+
MasterLibraryId
```

A snapshot from one Master Library shall never appear under another server registration.

---

# 27. Catalog Freshness

The client shall expose:

* current server revision;
* local snapshot revision;
* last refresh timestamp;
* stale or unknown freshness state.

The UI shall not imply that cached data is current while offline.

---

# 28. Catalog Loading States

```text
IDLE
LOADING_INITIAL
LOADING_MORE
REFRESHING
LOADED
EMPTY
OFFLINE_CACHED
FAILED
```

These states shall remain distinct from Local Library states.

---

# 29. Catalog Pagination

The client shall:

* request bounded pages;
* avoid duplicate entries;
* preserve deterministic ordering;
* prevent multiple uncontrolled page requests;
* cancel obsolete search requests where appropriate;
* reset pagination when filters change.

---

# 30. Catalog Search

Search state shall include:

```text
query
filters
sort
loadingState
results
pagination
lastError
```

Search requests shall use debouncing or explicit submission according to final UI design.

---

# 31. Offline Catalog Behavior

When offline:

* the latest valid snapshot may be displayed;
* its last refresh time shall be available;
* remote-only acquisition actions shall be disabled;
* local availability shall remain accurate;
* local Library access shall remain independent.

---

# 32. PublicationDetails Module

The PublicationDetails Module owns:

* publication-detail request;
* cached detail projection;
* cover loading;
* remote availability;
* local availability;
* SourceVersion comparison;
* action derivation.

---

# 33. Publication Detail State

```text
IDLE
LOADING
LOADED
OFFLINE_CACHED
NOT_FOUND
UNAVAILABLE
FAILED
```

---

# 34. Available Actions

The client shall derive actions from real state.

Possible actions:

```text
Acquire
Cancel
Retry
Update
Remove from Device
Open Local Publication
Reacquire
```

The UI shall not offer an action that cannot succeed under the current known state without clearly showing the expected failure.

---

# 35. Acquisition Module

The Acquisition Module owns the complete device-side acquisition workflow.

It shall be the only client authority for:

* acquisition state;
* transfer progress;
* staging;
* cancellation;
* retry;
* resume;
* integrity validation;
* installation;
* acquisition recovery.

---

# 36. AcquisitionOperation Model

Conceptually:

```text
AcquisitionOperation
├── operationId
├── publicationId
├── requestedSourceVersion
├── serverIdentity
├── masterLibraryId
├── state
├── bytesReceived
├── totalBytes
├── checksumAlgorithm
├── expectedChecksum
├── currentAttemptId?
├── createdAt
├── updatedAt
├── completedAt?
└── failure?
```

---

# 37. AcquisitionAttempt Model

Conceptually:

```text
AcquisitionAttempt
├── attemptId
├── operationId
├── startedAt
├── completedAt?
├── initialOffset
├── finalOffset
├── transferMode
├── outcome
└── failure?
```

Every retry creates a new Attempt.

---

# 38. Acquisition States

```text
CREATED
QUEUED
DOWNLOADING
PAUSED
VALIDATING
INSTALLING
COMPLETED
FAILED
CANCELLED
RECOVERY_REQUIRED
```

`PAUSED` exists only if resumable acquisition is implemented.

---

# 39. Allowed Acquisition Transitions

Baseline transitions:

```text
CREATED → QUEUED
QUEUED → DOWNLOADING
DOWNLOADING → VALIDATING
VALIDATING → INSTALLING
INSTALLING → COMPLETED
```

Failure transitions:

```text
QUEUED → FAILED
DOWNLOADING → FAILED
VALIDATING → FAILED
INSTALLING → FAILED
```

Cancellation transitions:

```text
QUEUED → CANCELLED
DOWNLOADING → CANCELLED
PAUSED → CANCELLED
```

Recovery transitions depend on the persisted state and Technical Decisions.

---

# 40. Acquisition Invariants

* One operation targets one PublicationId.
* One operation fixes one requested SourceVersion.
* One Attempt has one identity.
* Retry does not reuse Attempt identity.
* `COMPLETED` requires valid local installation.
* `FAILED` does not imply local availability.
* `CANCELLED` does not imply local availability.
* Partial payloads remain in staging.
* The current valid local version remains available during update acquisition.

---

# 41. Acquisition Manager

Conceptually:

```text
AcquisitionManager
├── createOperation()
├── enqueue()
├── start()
├── cancel()
├── retry()
├── resume()
├── recover()
├── observeProgress()
└── removeOperationHistory()
```

The final public API may differ, but ownership remains centralized.

---

# 42. Acquisition Queue

The client shall maintain a bounded acquisition queue.

The initial implementation may allow:

```text
1 active acquisition
+
bounded pending queue
```

The exact limit belongs in Technology Decisions.

---

# 43. Duplicate Acquisition Prevention

Before creating an acquisition, the client shall check:

* valid current local SourceVersion;
* existing active operation;
* existing pending operation;
* existing update operation.

Two uncontrolled operations for the same PublicationId and SourceVersion are prohibited.

---

# 44. Download Transport

The Download Transport owns:

* authenticated HTTP request;
* request headers;
* SourceVersion request;
* response validation;
* streaming to staging;
* progress callbacks;
* cancellation;
* optional range requests;
* network-error translation.

It does not own final installation.

---

# 45. Download Destination

Network bytes shall be written directly to a governed staging file.

The client shall not accumulate the complete payload in memory.

---

# 46. Transfer Progress

Progress shall be persisted at bounded intervals.

Persisting every byte or every network callback is prohibited.

The UI may receive more frequent in-memory updates than persistence.

---

# 47. Transfer Completion

Transfer completion means only:

* the expected HTTP body completed.

It does not mean acquisition success.

The workflow shall continue through:

```text
Byte-length validation
Checksum validation
Installation
LocalLibraryItem commit
```

---

# 48. Byte-Length Validation

The client shall compare:

```text
receivedByteLength
expectedByteLength
```

A mismatch shall prevent installation.

---

# 49. Checksum Validation

The client shall calculate checksum using streaming file reads.

The checksum algorithm shall match the server-provided authoritative metadata.

A mismatch shall:

* fail the Attempt;
* preserve diagnostic evidence;
* prevent installation;
* clean or quarantine the payload according to policy.

---

# 50. LocalPublicationInstaller

The LocalPublicationInstaller owns:

* final destination resolution;
* destination preparation;
* atomic or recoverable move;
* replacement safety;
* LocalLibraryItem commit coordination;
* previous-version cleanup;
* rollback or recovery markers.

---

# 51. Installation Workflow

```text
Validated staging payload
    ↓
Resolve final logical destination
    ↓
Prepare replacement or new install
    ↓
Move or copy using governed commit protocol
    ↓
Persist LocalLibraryItem
    ↓
Verify final reference
    ↓
Mark operation COMPLETED
    ↓
Clean staging
```

---

# 52. New Installation

For a new local publication:

* no LocalLibraryItem becomes available before final commit;
* the final payload and LocalLibraryItem must become mutually consistent;
* recovery shall handle interruption between filesystem and database commit.

---

# 53. Update Installation

For a source update:

* the previous valid payload remains available;
* the new payload is installed separately;
* LocalLibraryItem changes only after validation and commit;
* the previous payload is deleted only after successful replacement or retained according to policy.

---

# 54. Installation Recovery

Recovery shall inspect:

* validated staging payload;
* final payload presence;
* LocalLibraryItem state;
* operation state;
* replacement markers.

Recovery may:

* complete the commit;
* roll back;
* restore the previous version;
* mark recovery required;
* request reacquisition.

---

# 55. LocalLibrary Module

The LocalLibrary Module owns:

* LocalLibraryItem persistence;
* local listing;
* local payload resolution;
* local integrity;
* local removal;
* local opening placeholder;
* device-specific membership.

---

# 56. LocalLibraryItem Model

Conceptually:

```text
LocalLibraryItem
├── publicationId
├── serverIdentity
├── masterLibraryId
├── sourceVersion
├── titleSnapshot
├── authorsSnapshot
├── localStorageReference
├── byteLength
├── checksumAlgorithm
├── checksum
├── availabilityState
├── integrityState
├── acquiredAt
├── validatedAt
└── updatedAt
```

---

# 57. Local Availability States

```text
AVAILABLE_LOCAL
MISSING
CORRUPTED
REMOVING
RECOVERY_REQUIRED
```

Catalog-only state belongs to the catalog projection, not necessarily to LocalLibraryItem persistence.

---

# 58. Local Integrity States

```text
UNKNOWN
VALID
MISSING
CHECKSUM_MISMATCH
UNREADABLE
RECOVERY_REQUIRED
```

A local item shall not be presented as safely openable when integrity is known invalid.

---

# 59. Local Storage Reference

The client database shall store a logical local storage reference.

The storage adapter resolves it to a platform-supported physical URL.

Absolute paths shall not be treated as stable logical identity.

---

# 60. Local Physical Layout

Conceptually:

```text
Application Support/
└── KnowledgeOS/
    ├── database/
    ├── library/
    │   └── <server-id>/
    │       └── <master-library-id>/
    │           └── <publication-id>/
    │               └── <source-version>/
    │                   └── source.pdf
    ├── staging/
    ├── quarantine/
    └── diagnostics/
```

The exact macOS path shall use Apple-supported APIs.

---

# 61. Local Library Isolation

Local publication storage shall be isolated by:

```text
ServerIdentity
+
MasterLibraryId
+
PublicationId
+
SourceVersion
```

This prevents identity collision across different Master Libraries.

---

# 62. Local Library Listing

Local listing shall read LocalLibraryItem persistence first.

Filesystem validation may occur:

* at startup;
* lazily on open;
* during scheduled validation;
* after detected error.

The client shall not scan arbitrary directories as the primary local catalog.

---

# 63. Open Local Publication

The first module may use:

* Quick Look;
* system PDF viewer;
* minimal embedded PDF preview;
* metadata placeholder with explicit local-file validation.

The chosen implementation shall not redefine the later Render Module.

---

# 64. Local Removal

Local removal shall:

1. confirm user intent;
2. mark the item `REMOVING`;
3. remove the local payload;
4. update or remove LocalLibraryItem;
5. clean related acquisition staging;
6. preserve catalog snapshot;
7. preserve NAS content;
8. preserve personal state.

---

# 65. Missing Local Payload

If the database claims availability but the payload is missing:

* availability becomes invalid;
* the item shall not open;
* diagnostics shall be emitted;
* reacquisition may be offered;
* no NAS deletion is inferred.

---

# 66. Corrupted Local Payload

If checksum validation fails:

* integrity becomes `CHECKSUM_MISMATCH`;
* the file shall not be trusted;
* removal or reacquisition shall be offered;
* the server remains unaffected.

---

# 67. Persistence Module

Client persistence owns:

* schema;
* migrations;
* transactions;
* repositories;
* restart durability;
* query indexes;
* recovery metadata.

---

# 68. Client Persistence Tables

Logical tables may include:

```text
registered_servers
server_trust
catalog_entries
catalog_snapshots
catalog_state
acquisition_operations
acquisition_attempts
local_library_items
local_integrity_records
client_operations
```

The exact schema belongs in Persistence documentation.

---

# 69. Secure Storage Separation

Credentials and secret tokens shall not be stored in the ordinary client database.

The database may store a secure-storage reference.

---

# 70. Repository Boundaries

The client shall define repositories conceptually equivalent to:

```text
ServerRegistryRepository
CatalogCacheRepository
AcquisitionRepository
LocalLibraryRepository
ClientOperationRepository
```

---

# 71. Database Transactions

Client database transactions shall protect:

* acquisition state transitions;
* LocalLibraryItem creation;
* LocalLibraryItem version replacement;
* local removal state;
* catalog snapshot replacement.

Filesystem and database consistency still require workflow coordination.

---

# 72. Migration Strategy

Client migrations shall exist from schema version 1.

Application startup shall not continue into ordinary operation after a failed mandatory migration.

Local files shall not be deleted automatically to avoid implementing migrations.

---

# 73. Offline Architecture

Offline behavior is a first-class client state.

When offline:

* registered servers remain visible;
* cached catalog may remain visible;
* local Library remains available;
* local publication opening remains available;
* remote acquisition is unavailable;
* remote source updates cannot be confirmed;
* local content is not invalidated.

---

# 74. Offline Source of Truth

While offline:

* local publication presence is determined locally;
* cached remote metadata remains a snapshot;
* remote availability is unknown or stale;
* the client shall not fabricate current server state.

---

# 75. Reconnect Architecture

Reconnect shall perform:

```text
Resolve registered endpoint
    ↓
Retrieve server identity
    ↓
Validate trust
    ↓
Authenticate
    ↓
Request health
    ↓
Verify MasterLibraryId
    ↓
Request CatalogRevision
    ↓
Refresh catalog as required
    ↓
Compare local SourceVersions
```

---

# 76. Master Library Change Detection

If a trusted endpoint returns a different MasterLibraryId:

* the client shall not merge catalog data automatically;
* the previous snapshot remains associated with the previous Library;
* the user shall receive an explicit Library-change warning;
* new trust or registration handling may be required.

---

# 77. Error Model Ownership

Every feature shall expose typed client errors.

Infrastructure errors flow through:

```text
URLSession / Database / Filesystem / Keychain Error
    ↓
Adapter Error
    ↓
Stable Client Module Error
    ↓
Feature Error State
    ↓
User-Facing Message
```

---

# 78. Client Error Categories

```text
Configuration
Connectivity
ServerTrust
Authentication
Authorization
Compatibility
Catalog
Acquisition
Integrity
LocalStorage
Persistence
Recovery
Internal
```

---

# 79. Error Presentation

User-facing errors shall communicate:

* what failed;
* whether local content remains safe;
* whether retry is possible;
* whether user action is required;
* whether server access is affected.

Raw framework errors shall not be shown directly.

---

# 80. Retry Policy

Automatic retry may be used for:

* temporary connection loss;
* transient server unavailability;
* bounded catalog reads;
* explicitly idempotent requests.

Automatic retry shall not be used blindly for:

* authentication failure;
* identity mismatch;
* invalid request;
* checksum mismatch without cleanup;
* insufficient storage;
* incompatible server version.

---

# 81. Cancellation

Cancellation shall propagate through:

```text
UI
    ↓
Feature Use Case
    ↓
Acquisition Manager
    ↓
Download Transport
    ↓
Persisted Operation State
```

Cancellation shall not rely solely on view disappearance.

---

# 82. Concurrency

The client shall use structured concurrency.

Concurrency ownership shall be explicit.

The design shall prevent:

* duplicate catalog page loads;
* concurrent mutation of one AcquisitionOperation;
* simultaneous conflicting installs for one publication;
* local removal during final installation without coordination.

---

# 83. Actor Isolation

When Swift concurrency is used, mutable shared state should be isolated through:

* actors;
* MainActor;
* serial execution contexts;
* repository transaction boundaries.

The exact approach belongs in Technology Decisions.

---

# 84. MainActor Rule

SwiftUI-visible state mutations shall occur on the MainActor.

Network, checksum and filesystem work shall not block the MainActor.

---

# 85. Large File Handling

The client shall:

* stream network data to disk;
* calculate checksum from file stream;
* avoid Data-loading the complete publication;
* avoid UI-thread file processing;
* use bounded buffers.

---

# 86. Background Execution

On macOS, acquisition may continue while the application is not foregrounded, subject to process lifecycle and selected networking implementation.

The client shall persist sufficient operation state to recover after termination.

---

# 87. App Termination

Unexpected process termination during acquisition shall leave:

* persisted operation state;
* staging evidence;
* no false `AVAILABLE_LOCAL`;
* recoverable or restartable workflow.

---

# 88. Client Startup Recovery

Startup recovery shall evaluate:

```text
AcquisitionOperation state
Staging file presence
Final file presence
LocalLibraryItem state
Expected checksum
Expected SourceVersion
```

The result may:

* resume;
* restart;
* complete installation;
* roll back;
* fail safely;
* request user action.

---

# 89. Diagnostics Module

The Diagnostics Module owns:

* structured local logs;
* operation correlation;
* safe error history;
* client health information;
* optional export of diagnostic bundle.

---

# 90. Client Log Fields

Recommended fields:

```text
timestamp
severity
feature
operationId?
attemptId?
publicationId?
serverIdentity?
result
duration?
errorCode?
```

---

# 91. Sensitive Logging Rules

Client logs shall not contain:

* credentials;
* tokens;
* personal reading content;
* raw annotation content;
* publication binary content;
* unrestricted local paths;
* unrestricted server URLs with secrets.

---

# 92. Client Health State

The client may expose diagnostic state for:

* local database;
* secure credential access;
* local Library storage;
* active server connection;
* acquisition subsystem;
* incomplete recovery.

---

# 93. Presentation Architecture

The initial navigation may use:

```text
Sidebar
├── Local Library
├── Master Catalog
├── Downloads
└── Settings
```

The final UI design may evolve, but feature ownership remains.

---

# 94. Master Catalog Screen

The screen shall represent:

* loading;
* empty;
* connected;
* disconnected;
* cached;
* search results;
* pagination;
* local state badges;
* remote availability.

---

# 95. Publication Detail Screen

The screen shall represent:

* master metadata;
* cover;
* source format;
* source size;
* remote SourceVersion;
* local SourceVersion;
* remote availability;
* local availability;
* acquisition action;
* update action;
* removal action.

---

# 96. Downloads Screen

The Downloads screen may display:

* queued;
* active;
* validating;
* installing;
* completed;
* failed;
* cancelled operations.

Completed history retention shall be bounded.

---

# 97. Local Library Screen

The Local Library screen shall function without a server connection.

It shall show only device-local membership.

Remote catalog membership shall not cause an item to appear as local.

---

# 98. Settings Screen

Settings may include:

* registered servers;
* trust state;
* authentication state;
* local storage usage;
* diagnostics;
* acquisition concurrency;
* remove registration;
* reconnect.

---

# 99. Accessibility

Primary client interactions shall support:

* keyboard navigation;
* VoiceOver labels;
* accessible progress;
* non-color-only state;
* clear focus behavior;
* readable error messages;
* standard system controls where practical.

---

# 100. UI Truthfulness

The UI shall never display:

* available locally before final commit;
* downloaded successfully before checksum validation;
* online when authentication is invalid;
* current catalog when only stale cache exists without indication;
* update installed before LocalLibraryItem commit;
* local deletion as NAS deletion.

---

# 101. Client Performance Model

Critical client paths include:

* application startup;
* local Library listing;
* catalog initial load;
* catalog scrolling;
* search;
* acquisition progress;
* checksum validation;
* final installation.

---

# 102. Memory Model

Client memory shall remain bounded during:

* catalog pagination;
* cover loading;
* publication acquisition;
* checksum validation.

Images and catalog pages may use bounded cache policies.

---

# 103. Storage Capacity

Before acquisition, the client should estimate required local space.

The workflow shall account for:

* staging payload;
* final payload;
* update replacement overhead;
* safety margin.

Insufficient storage shall fail before unsafe commit where possible.

---

# 104. Local Storage Cleanup

Cleanup policies shall exist for:

* cancelled downloads;
* failed downloads;
* stale staging;
* quarantine;
* old completed acquisition history;
* superseded source versions.

Cleanup shall not remove active or current valid local publications.

---

# 105. Testing Boundaries

The client design shall support:

* Client Domain unit tests;
* feature-state tests;
* repository tests;
* API client tests;
* download-transport tests;
* filesystem tests;
* Keychain adapter tests;
* migration tests;
* UI tests;
* end-to-end tests;
* failure-recovery tests.

---

# 106. Testable Protocols

The client should define protocols conceptually equivalent to:

```text
ServerIdentityClient
AuthenticationClient
CatalogClient
PublicationClient
AcquisitionTransport
CatalogCacheRepository
AcquisitionRepository
LocalLibraryRepository
LocalPublicationStorage
SecureCredentialStore
ConnectivityProvider
ChecksumValidator
Clock
IdGenerator
```

---

# 107. Real Integration Tests

Integration tests shall use:

* real local database;
* real temporary filesystem;
* real checksum implementation;
* real HTTP test server where applicable;
* representative PDFs;
* simulated network interruption.

---

# 108. UI Tests

UI tests should cover:

* server registration;
* catalog loading;
* offline catalog state;
* acquisition progress;
* acquisition failure;
* local Library listing;
* local removal;
* offline local opening.

---

# 109. End-to-End Requirement

The principal macOS E2E test shall execute:

```text
Register server
    ↓
Authenticate
    ↓
Browse catalog
    ↓
Open details
    ↓
Acquire PDF
    ↓
Validate and install
    ↓
Open local placeholder
    ↓
Disconnect server
    ↓
Reopen application
    ↓
Confirm local availability
```

---

# 110. Client Technology Direction

The concrete technology decisions remain in `TechnologyDecisions.md`.

The current direction is:

```text
Swift
SwiftUI
Swift Concurrency
URLSession
Keychain
Apple-native local persistence
Application Support storage
XCTest / Swift Testing
```

---

# 111. Shared Apple Code Direction

The macOS implementation should avoid unnecessary decisions that prevent later iPhone and iPad reuse.

Reusable candidates include:

* client Domain models;
* API contracts;
* repositories;
* acquisition manager;
* checksum validation;
* local Library semantics;
* authentication client;
* persistence abstractions.

macOS-specific UI and lifecycle behavior shall remain isolated.

---

# 112. Client Design Risks

Principal risks include:

* secure local server trust;
* certificate handling;
* large download behavior;
* restart recovery;
* database-filesystem consistency;
* safe local replacement;
* storage-space estimation;
* background transfer behavior;
* future cross-platform reuse.

---

# 113. Early Client Spikes

Recommended spikes:

1. Register and trust a local server.
2. Stream a large PDF to Application Support.
3. Measure memory during transfer.
4. Validate SHA-256 from disk.
5. Perform atomic file replacement.
6. Recover an interrupted installation.
7. Persist and restore an AcquisitionOperation.
8. Open a local PDF using the selected placeholder mechanism.

---

# 114. Client Design Completion Gate

The client design is complete when:

```text
[ ] Feature modules are explicit
[ ] State ownership is explicit
[ ] Dependency direction is explicit
[ ] Server registration is explicit
[ ] Server trust is explicit
[ ] Authentication state is explicit
[ ] Connectivity state is explicit
[ ] Catalog cache is explicit
[ ] Acquisition state machine is explicit
[ ] Local installation is explicit
[ ] Local Library ownership is explicit
[ ] Offline behavior is explicit
[ ] Recovery behavior is explicit
[ ] Error presentation is explicit
[ ] Persistence boundaries are explicit
[ ] Storage boundaries are explicit
[ ] Concurrency boundaries are explicit
[ ] Testing boundaries are explicit
[ ] No architectural contradiction remains
```

---

# 115. Client Invariants

The following invariants apply:

* The client never accesses NAS Master Library storage directly.
* The endpoint is not the server identity.
* Credentials remain in secure storage.
* Catalog cache is not authoritative.
* Local Library membership is device-specific.
* Local Libraries are not NAS replicas.
* Acquisition state belongs to the client.
* Partial payloads remain unavailable.
* Checksum validation precedes installation.
* Current valid local versions survive failed updates.
* Offline local access does not depend on NAS availability.
* Personal state remains outside the server boundary.
* UI state must remain truthful.
* Large files use bounded memory.

---

# 116. Prohibited Client Designs

The client shall not:

* mount the NAS Master Library as its local Library;
* infer trust from IP address alone;
* store credentials in plain-text preferences;
* create PublicationId independently;
* automatically mirror the complete catalog payload;
* expose staging files as available publications;
* treat download completion as installation completion;
* load large publications entirely into memory;
* delete NAS content through local removal;
* upload personal state to the NAS;
* couple SwiftUI views directly to database or filesystem implementations;
* silently replace trusted server identity;
* merge snapshots from different Master Libraries.

---

# 117. Related Documents

## Technical Design

* `README.md`
* `SystemDesign.md`
* `ServerDesign.md`
* `DataFlow.md`
* `ErrorModel.md`
* `TechnologyDecisions.md`

## Requirements

* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

## Future Detailed Areas

* `../05-Persistence/LocalLibraryStorage.md`
* `../07-Client/README.md`
* `../07-Client/ClientArchitecture.md`
* `../07-Client/CatalogBrowser.md`
* `../07-Client/AcquisitionManager.md`
* `../07-Client/LocalLibrary.md`

---

# 118. Status

**Approved**

The KnowledgeOS macOS client now has an explicit internal architecture for server registration, trust, authentication, catalog browsing, publication acquisition, local installation, Selective Local Library behavior, offline access and recovery.

The next document is:

```text
01-MasterLibrary/02-TechnicalDesign/DataFlow.md
```

It shall define the exact sequence, state transitions, transaction boundaries and recovery behavior of every principal full-stack flow.
