

# Master Library Technical Design

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Technical Design

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Requirements Baseline:** Master Library Requirements v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the technical design framework for the Master Library Module.

The Technical Design translates the approved requirements into an implementable system design.

It defines:

* runtime topology;
* application boundaries;
* component responsibilities;
* dependency direction;
* data ownership;
* server-client interaction;
* publication acquisition mechanics;
* persistence strategy;
* storage strategy;
* security boundaries;
* operational behavior;
* technology-selection criteria.

The Technical Design shall be sufficiently precise that implementation can proceed without redefining the module architecture during coding.

---

# 2. Scope

The Technical Design covers the complete Master Library vertical:

```text
KnowledgeOS Server on NAS
        ↓
Master Library Storage
        ↓
Master Catalog
        ↓
Master Library API
        ↓
KnowledgeOS macOS Client
        ↓
Acquisition Manager
        ↓
Selective Local Library
        ↓
Offline Local Availability
```

It does not define:

* full Reader implementation;
* annotations;
* reading progress;
* CloudKit synchronization;
* UDM processing;
* DPM processing;
* AI processing;
* Plugin execution.

---

# 3. Design Authority

The Technical Design is constrained by:

1. Architecture V3.0;
2. Architecture Amendment V3.0-001;
3. ADR-013;
4. Implementation Governance;
5. Master Library Requirements;
6. Master Library Scope;
7. Master Library Use Cases;
8. Master Library Acceptance Criteria.

The Technical Design may choose implementation mechanisms.

It shall not redefine architectural authority.

---

# 4. Design Objectives

The design shall optimize for:

* correctness;
* data integrity;
* implementation clarity;
* operational simplicity;
* bounded complexity;
* offline availability;
* privacy;
* portability;
* testability;
* future evolution.

For the first complete vertical, correctness and simplicity take precedence over premature distribution or abstraction.

---

# 5. Primary Design Principle

The module shall be implemented as two cooperating applications:

```text
┌─────────────────────────────────────────────┐
│ NAS                                         │
│                                             │
│  KnowledgeOS Server                         │
│       │                                     │
│       ├── Master Catalog                    │
│       ├── Publication Administration        │
│       ├── Publication Delivery              │
│       └── Master Library Storage            │
│                                             │
└─────────────────────────────────────────────┘
                    │
                    │ Versioned API
                    │
┌─────────────────────────────────────────────┐
│ macOS Device                                │
│                                             │
│  KnowledgeOS Client                         │
│       │                                     │
│       ├── Catalog Browser                   │
│       ├── Acquisition Manager               │
│       ├── Local Library                     │
│       └── Local Publication Storage         │
│                                             │
└─────────────────────────────────────────────┘
```

The NAS is not mounted as the client's application database.

The client communicates with KnowledgeOS Server through governed contracts.

---

# 6. Technical Design Areas

The Technical Design area contains:

```text
02-TechnicalDesign/
├── README.md
├── SystemDesign.md
├── ServerDesign.md
├── ClientDesign.md
├── DataFlow.md
├── ErrorModel.md
└── TechnologyDecisions.md
```

---

# 7. SystemDesign.md

`SystemDesign.md` shall define:

* complete runtime topology;
* logical components;
* component boundaries;
* dependency direction;
* trust boundaries;
* network boundaries;
* data ownership;
* process boundaries;
* primary execution flows.

It is the principal technical design document.

---

# 8. ServerDesign.md

`ServerDesign.md` shall define:

* KnowledgeOS Server structure;
* server modules;
* application services;
* Domain integration;
* persistence adapters;
* storage adapters;
* API adapters;
* administrative interfaces;
* server lifecycle;
* concurrency boundaries;
* streaming behavior;
* deployment considerations.

---

# 9. ClientDesign.md

`ClientDesign.md` shall define:

* macOS application structure;
* client feature boundaries;
* state ownership;
* server connection management;
* catalog caching;
* acquisition management;
* local persistence;
* local publication storage;
* offline behavior;
* UI state model.

---

# 10. DataFlow.md

`DataFlow.md` shall define:

* publication registration flow;
* catalog query flow;
* publication acquisition flow;
* local installation flow;
* source update flow;
* offline flow;
* reconnect flow;
* failure and recovery flows.

---

# 11. ErrorModel.md

`ErrorModel.md` shall define:

* Domain errors;
* application errors;
* infrastructure errors;
* transport errors;
* client errors;
* error codes;
* retryability;
* user-facing translation;
* logging policy.

---

# 12. TechnologyDecisions.md

`TechnologyDecisions.md` shall record concrete technology choices for:

* server language and runtime;
* server framework;
* database;
* persistence library;
* migration system;
* HTTP implementation;
* validation;
* logging;
* client platform technology;
* client persistence;
* client networking;
* secure credential storage;
* testing;
* packaging;
* NAS deployment.

Technology choices shall be justified against requirements rather than personal preference alone.

---

# 13. Runtime Topology

The baseline runtime topology is:

```text
User
 │
 ▼
KnowledgeOS macOS Application
 │
 ├── Local UI
 ├── Local Catalog Snapshot
 ├── Local Library Database
 ├── Local Publication Storage
 └── Acquisition Staging
 │
 │ HTTP/HTTPS over LAN
 ▼
KnowledgeOS Server
 │
 ├── API Layer
 ├── Application Layer
 ├── Domain Layer
 ├── Persistence Layer
 └── Storage Layer
 │
 ▼
NAS Persistent Storage
 │
 ├── Master Library Manifest
 ├── Master Catalog Database
 ├── Publication Sources
 ├── Publication Assets
 ├── Staging
 └── Quarantine
```

---

# 14. Process Model

The first implementation shall use:

```text
One KnowledgeOS Server process
+
One client process per active device
```

The server may internally execute:

* request handlers;
* background jobs;
* validation jobs;
* cleanup jobs.

A distributed server cluster is outside the initial module scope.

---

# 15. Server Architectural Style

KnowledgeOS Server shall use a modular layered architecture with explicit dependency direction.

Conceptually:

```text
Transport
    ↓
Application
    ↓
Domain
    ↓
Ports
    ↓
Infrastructure Adapters
```

The Domain shall not depend directly on:

* HTTP framework;
* database driver;
* NAS filesystem implementation;
* container runtime.

---

# 16. Server Layers

The server shall contain at least:

```text
Domain
Application
Infrastructure
Transport
Bootstrap
```

---

# 17. Domain Layer

The Domain layer owns:

* MasterLibraryId;
* PublicationId;
* SourceVersion;
* CatalogRevision;
* publication availability;
* acquisition semantics;
* integrity invariants;
* state-transition rules;
* Domain errors.

The Domain layer shall remain independent from transport and persistence technologies.

---

# 18. Application Layer

The Application layer coordinates use cases.

Examples:

```text
InitializeMasterLibrary
OpenMasterLibrary
RegisterPublication
UpdatePublicationMetadata
ReplacePublicationSource
WithdrawPublication
ListCatalog
SearchCatalog
GetPublicationDetails
PreparePublicationDelivery
ValidateMasterLibrary
```

Application services shall orchestrate Domain behavior and infrastructure ports.

---

# 19. Infrastructure Layer

The Infrastructure layer implements:

* catalog repository;
* manifest repository;
* publication storage;
* checksum calculation;
* filesystem access;
* database access;
* configuration;
* logging adapters;
* authentication persistence.

---

# 20. Transport Layer

The Transport layer implements:

* HTTP request handling;
* authentication extraction;
* authorization enforcement;
* request validation;
* response serialization;
* streaming;
* range handling;
* transport error translation.

Transport handlers shall not contain Domain rules.

---

# 21. Bootstrap Layer

The Bootstrap layer is responsible for:

* configuration loading;
* dependency construction;
* database initialization;
* migration execution;
* Master Library opening;
* server startup;
* graceful shutdown.

---

# 22. Client Architectural Style

The macOS client shall use feature-oriented modular architecture with explicit service boundaries.

Conceptually:

```text
Presentation
    ↓
Feature/Application Logic
    ↓
Domain Models
    ↓
Client Services
    ↓
Persistence / Network / Filesystem
```

UI components shall not directly:

* construct raw API requests;
* execute database queries;
* manipulate arbitrary storage paths;
* calculate acquisition integrity independently.

---

# 23. Client Feature Areas

The first client shall contain:

```text
ServerConnection
MasterCatalog
PublicationDetails
Acquisition
LocalLibrary
Diagnostics
```

Each feature shall have explicit ownership.

---

# 24. Server Connection Component

The Server Connection component owns:

* registered server configuration;
* server identity;
* trust state;
* authentication state;
* connectivity state;
* API client configuration.

It shall not own publication acquisition state.

---

# 25. Master Catalog Component

The Master Catalog component owns:

* catalog queries;
* search queries;
* pagination;
* catalog snapshot cache;
* CatalogRevision;
* mapping remote entries to local availability.

It shall not treat the cached snapshot as authoritative.

---

# 26. Publication Details Component

The Publication Details component owns:

* publication metadata presentation;
* remote availability;
* local availability;
* SourceVersion comparison;
* permitted actions.

---

# 27. Acquisition Component

The Acquisition component owns:

* AcquisitionOperation lifecycle;
* transfer execution;
* progress;
* cancellation;
* retry;
* optional resume;
* staging;
* size validation;
* checksum validation;
* local commit.

This component is the only authority for acquisition state.

---

# 28. Local Library Component

The Local Library component owns:

* local publication membership;
* LocalLibraryItem persistence;
* local payload resolution;
* local availability;
* local integrity;
* local removal.

It does not own the Master Catalog.

---

# 29. Data Ownership

The technical design shall preserve:

| Data                         | Authority                       |
| ---------------------------- | ------------------------------- |
| MasterLibraryId              | NAS Master Library              |
| Master Catalog               | KnowledgeOS Server              |
| PublicationId                | Master Library                  |
| SourceVersion                | Master Library                  |
| Source publication bytes     | NAS Master Library              |
| Master-source metadata       | Master Library                  |
| Catalog snapshot             | Device cache                    |
| Local publication membership | Device                          |
| Local publication bytes      | Device                          |
| Acquisition state            | Device                          |
| Personal state               | Future personal-state subsystem |

---

# 30. Master Library Storage Boundary

KnowledgeOS Server shall be the only application component that interprets the internal Master Library storage layout.

Clients shall never depend on:

* NAS directory names;
* NAS mount paths;
* source file names;
* database file locations.

---

# 31. Proposed Logical Server Components

The server shall be designed around:

```text
ServerBootstrap
ConfigurationService
HealthService
AuthenticationService
AuthorizationService

MasterLibraryService
MasterLibraryValidator

CatalogService
CatalogRepository

PublicationAdministrationService
PublicationRepository

PublicationStorage
StagingStorage
QuarantineStorage

PublicationDeliveryService

ChecksumService
AuditService
```

The exact source-code names may differ, but responsibilities shall remain explicit.

---

# 32. Proposed Logical Client Components

The macOS client shall be designed around:

```text
AppBootstrap

ServerRegistry
ServerTrustService
AuthenticationClient
ConnectivityMonitor

CatalogRepository
CatalogCache

PublicationDetailsRepository

AcquisitionManager
AcquisitionRepository
DownloadTransport
IntegrityValidator
LocalPublicationInstaller

LocalLibraryRepository
LocalPublicationStorage

DiagnosticsService
```

---

# 33. Persistence Separation

Server persistence and client persistence are independent.

```text
Server Database
    └── Master Library state

Client Database
    └── Device-local application state
```

There is no shared database between NAS and clients.

---

# 34. Server Persistence Responsibilities

Server persistence shall store structured state including:

* Library identity;
* catalog entries;
* publication metadata;
* source versions;
* source integrity metadata;
* availability;
* CatalogRevision;
* administrative state;
* authorization state where required.

Publication binary payloads shall not be stored as ordinary database blobs unless a later measured decision explicitly justifies it.

---

# 35. Client Persistence Responsibilities

Client persistence shall store:

* registered server configuration;
* trusted server identity;
* catalog snapshot;
* CatalogRevision;
* LocalLibraryItem records;
* AcquisitionOperation records;
* AcquisitionAttempt records;
* local integrity metadata.

---

# 36. Binary Storage Strategy

Large publication payloads shall be stored in governed filesystem storage.

The database stores:

```text
identity
metadata
version
integrity
logical storage reference
state
```

The filesystem stores:

```text
publication bytes
cover assets where applicable
staging payloads
quarantined payloads
```

---

# 37. Storage Reference Rule

Persistent records shall use logical storage references.

They shall not expose or depend on absolute physical paths as stable Domain identity.

Example:

```text
publication-source://<PublicationId>/<SourceVersion>
```

The actual implementation may use another internal representation.

---

# 38. Proposed Master Library Physical Layout

The initial design may use:

```text
MasterLibrary/
├── manifest.json
├── database/
├── publications/
├── assets/
├── staging/
├── quarantine/
└── diagnostics/
```

This is an infrastructure layout.

It is not a public API contract.

---

# 39. Publication Source Layout

A deterministic internal layout should be used.

Conceptually:

```text
publications/
└── <PublicationId>/
    └── <SourceVersion>/
        └── source.pdf
```

The exact path is resolved by the storage adapter.

Clients never receive this path.

---

# 40. Staging Strategy

All new publication payloads shall enter staging before becoming committed.

Server registration:

```text
External Source
      ↓
Server Staging
      ↓
Validation
      ↓
Checksum
      ↓
Permanent Source Storage
      ↓
Catalog Commit
```

Client acquisition:

```text
Network Stream
      ↓
Client Staging
      ↓
Size Validation
      ↓
Checksum Validation
      ↓
Local Commit
      ↓
LocalLibraryItem
```

---

# 41. Commit Strategy

The implementation shall prefer atomic filesystem rename when:

* source and destination are on the same filesystem;
* the platform guarantees the required semantics.

When atomic rename is unavailable, the implementation shall use a recoverable commit protocol.

---

# 42. Publication Registration Transaction Boundary

Publication registration spans:

* filesystem staging;
* source validation;
* source commit;
* database commit.

Because filesystem and database operations do not share one native transaction, the implementation shall use an explicit consistency protocol.

The design shall guarantee:

> An available catalog entry never references an uncommitted source payload.

---

# 43. Recommended Registration Commit Order

The baseline order is:

```text
1. Validate request
2. Create staging payload
3. Validate source
4. Calculate integrity metadata
5. Prepare database mutation
6. Commit source payload
7. Commit catalog transaction
8. Publish availability
9. Clean staging
```

If step 7 fails after step 6, the source becomes an orphan candidate and shall be recoverable by cleanup or reconciliation.

It shall not become client-visible automatically.

---

# 44. Acquisition Transaction Boundary

Client acquisition spans:

* persisted operation state;
* network transfer;
* staging file;
* integrity validation;
* final filesystem commit;
* LocalLibraryItem persistence.

The implementation shall treat this as a recoverable workflow rather than a single database transaction.

---

# 45. Acquisition State Machine

The baseline acquisition state model is:

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

Failure transitions may lead to:

```text
FAILED
CANCELLED
PAUSED
```

`PAUSED` exists only if resume is implemented.

---

# 46. Local Availability Rule

A publication becomes locally available only after:

```text
Transfer complete
AND
Byte length valid
AND
Checksum valid
AND
Final payload committed
AND
LocalLibraryItem committed
```

---

# 47. API Design Direction

The initial API shall be:

* versioned;
* resource-oriented;
* explicit;
* bounded;
* stream-capable;
* independent from NAS paths.

The baseline namespace is:

```text
/v1
```

---

# 48. API Capability Groups

The API shall contain:

```text
Health
Server Identity
Authentication
Master Library Information
Catalog
Publication Details
Publication Content
Administration
```

---

# 49. Baseline API Shape

Conceptually:

```text
GET    /v1/health
GET    /v1/server
POST   /v1/auth/...

GET    /v1/library
GET    /v1/catalog
GET    /v1/catalog/revision
GET    /v1/publications/{publicationId}
GET    /v1/publications/{publicationId}/cover
GET    /v1/publications/{publicationId}/content

POST   /v1/admin/library/initialize
POST   /v1/admin/publications
PATCH  /v1/admin/publications/{publicationId}
POST   /v1/admin/publications/{publicationId}/versions
POST   /v1/admin/publications/{publicationId}/withdraw
```

The final contract belongs in `03-API`.

---

# 50. Content Transfer Design

Publication content shall use streaming HTTP response semantics.

The server shall support:

* content length;
* media type;
* source version metadata;
* checksum metadata;
* bounded stream buffering.

Range support shall be decided explicitly in `TechnologyDecisions.md`.

---

# 51. Catalog Pagination Design

Catalog listing shall use bounded pagination.

The preferred long-term model is cursor-based pagination.

Offset pagination may be accepted for the initial implementation if:

* ordering is deterministic;
* dataset size remains within measured limits;
* migration to cursor-based pagination remains possible.

The final decision shall be recorded.

---

# 52. Catalog Revision Design

The Master Catalog shall expose a monotonically advancing logical revision.

CatalogRevision changes when authoritative catalog-visible state changes.

Examples:

* publication added;
* master metadata changed;
* source version changed;
* availability changed;
* publication withdrawn.

---

# 53. Catalog Cache Design

The client may cache catalog responses.

The cache shall store:

* entries;
* revision;
* retrieval time;
* server identity;
* MasterLibraryId.

A cache from one server or Master Library shall never be interpreted as belonging to another.

---

# 54. Authentication Design Direction

The first implementation shall prioritize a secure local-network device-registration model.

The design shall avoid unnecessary public-account infrastructure.

The authentication system shall distinguish:

```text
Device Identity
Credential
Role
Server Trust
```

---

# 55. Server Trust

The client shall persist a trusted server identity separately from the network address.

This prevents endpoint identity from being defined solely by:

* hostname;
* IP address;
* port.

A changed endpoint identity requires explicit trust handling.

---

# 56. Credential Storage

Client secrets shall use operating-system secure storage.

On Apple platforms, the preferred mechanism is:

```text
Keychain
```

Credentials shall not be stored in:

* plain-text preferences;
* source code;
* logs;
* catalog database fields.

---

# 57. Authorization Model

The initial authorization model contains:

```text
Reader
Administrator
```

Authorization shall be enforced server-side.

The client UI may hide unauthorized actions, but UI hiding is not authorization.

---

# 58. Error Design Direction

Errors shall be stable across transport boundaries.

The server shall return:

```text
error code
human-readable message
correlation identifier
optional safe details
```

The server shall not return:

* stack traces;
* raw filesystem paths;
* secrets;
* internal SQL errors.

---

# 59. Error Categories

The design shall distinguish:

```text
Validation
Authentication
Authorization
Not Found
Conflict
Availability
Integrity
Storage
Network
Compatibility
Internal
```

---

# 60. Retry Design

Retry shall be based on error classification.

Examples:

```text
Network interruption        → Retryable
Temporary server unavailable → Retryable
Authentication rejected      → Not automatically retryable
Checksum mismatch            → Retryable after cleanup
Invalid PublicationId        → Not retryable
Insufficient local storage   → Retryable after user action
```

---

# 61. Idempotency

The design shall identify operations requiring idempotency.

At minimum:

* acquisition cancellation;
* retry coordination;
* publication registration requests where duplicate submission is possible;
* source replacement;
* cleanup jobs;
* reconciliation jobs.

---

# 62. Concurrency Model

The server shall assume concurrent requests.

The design shall prevent unsafe concurrent mutation of:

* the same publication;
* the same SourceVersion;
* Master Library initialization;
* catalog revision state.

The client shall prevent conflicting simultaneous acquisition operations for the same PublicationId and SourceVersion.

---

# 63. Background Jobs

The server may use background jobs for:

* full integrity validation;
* orphan cleanup;
* staging cleanup;
* checksum verification;
* backup support.

The client may use background execution for:

* acquisition;
* integrity verification;
* local cleanup.

Platform background-execution limitations shall be respected.

---

# 64. Recovery Design

On startup, server recovery shall inspect:

* stale staging files;
* incomplete administrative operations;
* orphan committed sources;
* catalog-source inconsistencies.

Client recovery shall inspect:

* incomplete acquisitions;
* staging payloads;
* interrupted installations;
* missing local files.

---

# 65. Reconciliation

The module shall define explicit reconciliation processes.

Server reconciliation compares:

```text
Catalog
↔
Source Storage
```

Client reconciliation compares:

```text
LocalLibraryItem
↔
Local Publication Storage
```

Reconciliation shall not silently invent authoritative state.

---

# 66. Observability Design

Every significant operation should carry a correlation identity.

Examples:

```text
RequestId
AcquisitionOperationId
PublicationId
MasterLibraryId
```

Logs shall be structured.

---

# 67. Metrics Direction

Initial metrics should include:

* request count;
* request duration;
* active acquisitions;
* bytes transferred;
* acquisition failures;
* integrity failures;
* storage failures;
* catalog query duration.

Metrics shall not contain personal content.

---

# 68. Testing Design

The technical design shall support:

```text
Unit Tests
Integration Tests
Contract Tests
Filesystem Tests
Persistence Tests
Network Tests
Failure Injection
End-to-End Tests
NAS Deployment Tests
```

Core Domain logic shall be testable without a running HTTP server.

---

# 69. Dependency Injection

Infrastructure dependencies shall be injected through explicit construction or framework-supported dependency injection.

Domain objects shall not resolve dependencies from a global service locator.

---

# 70. Configuration Design

Configuration shall be externalized.

Server configuration may include:

```text
server host
server port
Master Library location
database configuration
logging level
authentication configuration
transfer limits
concurrency limits
```

Secrets shall be separated from ordinary configuration where practical.

---

# 71. Versioning

The module shall independently version:

```text
Server Application
API
Master Library Format
Database Schema
Client Application
Client Database Schema
```

These versions shall not be assumed to advance together.

---

# 72. Migration Design

Persistent schemas shall use explicit migrations from the first implementation.

Migration execution shall be:

* deterministic;
* versioned;
* observable;
* tested.

Destructive migrations require backup and explicit approval.

---

# 73. NAS Deployment Design

KnowledgeOS Server shall be packaged for repeatable deployment.

The preferred baseline is a containerized deployment if the reference NAS supports it adequately.

The deployment shall define:

* application image;
* persistent volume;
* configuration;
* secrets;
* network port;
* health check;
* restart policy.

---

# 74. Container Boundary

If containerization is selected:

```text
Container
    ├── KnowledgeOS Server executable
    └── Runtime dependencies

Persistent NAS Volume
    └── Master Library
```

Destroying and recreating the container shall not destroy the Master Library.

---

# 75. Backup Design

Backup shall operate on persistent Master Library data, not on the server container image.

The backup design shall preserve:

* manifest;
* catalog persistence;
* publication sources;
* source metadata;
* source versions.

---

# 76. Development Environment

The development environment shall support:

* local server execution;
* temporary Master Library creation;
* seeded catalog;
* simulated network failures;
* simulated storage failures;
* automated tests.

Development behavior shall remain representative of production contracts.

---

# 77. Technology Selection Principles

Technology choices shall be evaluated against:

```text
Correctness
Maturity
Long-term maintainability
NAS compatibility
Apple-platform compatibility
Streaming support
Migration support
Testing support
Operational simplicity
Single-developer productivity
Resource consumption
```

---

# 78. Technology Decision Discipline

A technology shall not be selected merely because:

* it is popular;
* it is new;
* it is already familiar;
* it provides features not required by the module.

The selected stack shall minimize unnecessary infrastructure.

---

# 79. Initial Technology Direction

Without freezing the final decisions yet, the expected design direction is:

```text
Server
    TypeScript
    Node.js
    Modular server framework
    Relational embedded or lightweight database
    Filesystem-backed publication storage
    HTTP streaming

macOS Client
    Native Apple application
    Swift
    SwiftUI
    URLSession
    Apple-native local persistence
    Keychain
```

The final choices and rationale belong in `TechnologyDecisions.md`.

---

# 80. Why Native macOS Is the Baseline Direction

The first client is expected to be native because KnowledgeOS ultimately requires deep integration with:

* macOS;
* iPhone;
* iPad;
* local files;
* background transfers;
* secure credential storage;
* offline persistence;
* future Apple Pencil interaction;
* future CloudKit synchronization.

The Master Library Module shall not prematurely force a web-client architecture onto the native application.

---

# 81. Server Technology Independence

The server technology does not constrain the client language.

The contract boundary is:

```text
Versioned Network API
```

Therefore:

```text
TypeScript Server
        ↕
HTTP API
        ↕
Swift Client
```

is an acceptable and intentional design.

---

# 82. Technical Design Decisions Still Required

The following decisions remain to be finalized:

```text
[ ] Server framework
[ ] Server database
[ ] Server ORM/query layer
[ ] Migration system
[ ] Validation library
[ ] Logging library
[ ] Authentication mechanism
[ ] Server trust mechanism
[ ] HTTP vs HTTPS local deployment
[ ] Range request support
[ ] Acquisition resume policy
[ ] Catalog pagination model
[ ] Client persistence technology
[ ] Client local storage layout
[ ] NAS packaging model
[ ] Reference NAS environment
```

These decisions shall be resolved before implementation begins.

---

# 83. Technical Design Completion Gate

The Technical Design area is complete when:

```text
[ ] README.md is Approved
[ ] SystemDesign.md is Approved
[ ] ServerDesign.md is Approved
[ ] ClientDesign.md is Approved
[ ] DataFlow.md is Approved
[ ] ErrorModel.md is Approved
[ ] TechnologyDecisions.md is Approved
[ ] All P0 requirements have technical owners
[ ] Persistence strategy is explicit
[ ] Storage strategy is explicit
[ ] Acquisition workflow is explicit
[ ] Security boundaries are explicit
[ ] Failure recovery is explicit
[ ] Concrete technologies are selected
[ ] No architectural contradiction remains
```

---

# 84. Technical Design Invariants

The following invariants apply:

* The NAS runs KnowledgeOS Server.
* Clients communicate through governed contracts.
* Clients do not directly access Master Library storage.
* The Master Catalog is authoritative on the NAS.
* Client catalog data is cached projection data.
* Device Libraries are selective.
* Device Libraries are not NAS replicas.
* Publication acquisition is explicit.
* Personal state is outside the Master Library server.
* Binary payloads use governed filesystem storage.
* Large transfers use bounded memory.
* Staging is isolated from committed availability.
* Persistence schemas are versioned from the beginning.
* Failures are explicit and recoverable where required.
* Implementation technologies remain subordinate to Architecture.

---

# 85. Prohibited Design Patterns

The module shall not use:

* direct client access to NAS folders;
* file paths as publication identity;
* whole-file buffering for large transfers;
* unversioned database schemas;
* unbounded catalog queries;
* unbounded acquisition concurrency;
* personal-state fields in NAS persistence;
* UI components as Domain authorities;
* transport handlers containing core Domain rules;
* silent fallback after integrity failure;
* automatic full Master Library mirroring;
* hidden cross-device synchronization inside acquisition.

---

# 86. Related Documents

## Requirements

* `../01-Requirements/README.md`
* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

## Technical Design

* `SystemDesign.md`
* `ServerDesign.md`
* `ClientDesign.md`
* `DataFlow.md`
* `ErrorModel.md`
* `TechnologyDecisions.md`

## Architecture

* `../../../00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `../../../00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `../../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

---

# 87. Status

**Approved**

The Master Library Technical Design framework is established.

The next document is `SystemDesign.md`, which shall define the complete runtime topology, system decomposition, trust boundaries, dependency direction and end-to-end component interaction before the server and client are designed independently.
