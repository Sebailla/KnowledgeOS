
# Master Library System Design

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Technical Design

**Document:** System Design

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Requirements Baseline:** Master Library Requirements v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the complete system design of the Master Library Module.

It describes:

* runtime topology;
* application boundaries;
* logical components;
* process boundaries;
* data ownership;
* trust boundaries;
* dependency direction;
* communication paths;
* persistent-state boundaries;
* primary execution flows;
* failure boundaries;
* recovery boundaries;
* deployment assumptions.

This document is the principal technical design authority for the Master Library Module.

---

# 2. Scope

The system design covers:

```text
KnowledgeOS Server on NAS
        ↓
Master Library
        ↓
Master Catalog
        ↓
Publication Source Storage
        ↓
Versioned Local-Network API
        ↓
KnowledgeOS macOS Client
        ↓
Publication Acquisition
        ↓
Selective Local Library
        ↓
Offline Availability
```

The design does not include:

* full document reader;
* annotations;
* reading progress;
* iCloud or CloudKit;
* personal-state synchronization;
* UDM processing;
* DPM processing;
* AI;
* Plugins;
* public internet access.

---

# 3. Governing Principles

The system design shall preserve the following principles:

1. KnowledgeOS Server is the only component that accesses the NAS Master Library directly.
2. The Master Library is authoritative for the Master Catalog and source publications.
3. Device Libraries are selective local Libraries.
4. Device Libraries are not NAS replicas.
5. Publication acquisition is one-way governed content delivery.
6. Personal state is excluded from the NAS server boundary.
7. Stable identities are independent from physical paths.
8. Partial files are never exposed as completed publications.
9. Large payloads are streamed using bounded memory.
10. Local acquired content remains available without NAS connectivity.

---

# 4. Runtime Systems

The module consists of two primary runtime systems:

```text
1. KnowledgeOS Server
2. KnowledgeOS Client
```

The initial reference client is macOS.

---

# 5. KnowledgeOS Server

KnowledgeOS Server runs on the NAS or within an approved NAS-hosted runtime.

It owns:

* Master Library lifecycle;
* Master Catalog;
* source publication custody;
* source versioning;
* master-source metadata;
* publication availability;
* catalog search;
* publication delivery;
* server-side authentication;
* server-side authorization;
* administrative operations;
* Master Library health;
* operational diagnostics.

---

# 6. KnowledgeOS Client

The KnowledgeOS Client runs on macOS.

It owns:

* server registration;
* trusted server identity;
* client authentication state;
* catalog browsing;
* cached catalog projection;
* acquisition operations;
* local publication staging;
* local integrity validation;
* Selective Local Library membership;
* local publication payload storage;
* offline local availability;
* user-facing connection and failure states.

---

# 7. External Dependencies

The module depends on:

```text
NAS filesystem
Local macOS filesystem
Local network
Secure credential storage
Server persistence database
Client persistence database
Operating-system process lifecycle
```

The module does not require:

```text
Public cloud
iCloud
CloudKit
External authentication provider
External AI provider
External OCR provider
```

---

# 8. High-Level Topology

```text
┌──────────────────────────────────────────────┐
│ macOS Device                                 │
│                                              │
│ KnowledgeOS Client                           │
│                                              │
│ ├── Presentation                             │
│ ├── Catalog Feature                          │
│ ├── Acquisition Feature                      │
│ ├── Local Library Feature                    │
│ ├── Client Persistence                       │
│ ├── Local Publication Storage                │
│ └── Secure Credential Storage                │
│                                              │
└──────────────────────────────────────────────┘
                     │
                     │ Versioned HTTP/HTTPS API
                     │
┌──────────────────────────────────────────────┐
│ NAS                                          │
│                                              │
│ KnowledgeOS Server                           │
│                                              │
│ ├── Transport                                │
│ ├── Application                              │
│ ├── Domain                                   │
│ ├── Persistence                              │
│ ├── Publication Storage                      │
│ ├── Authentication                           │
│ ├── Authorization                            │
│ └── Observability                            │
│                                              │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ Master Library Persistent Volume             │
│                                              │
│ ├── Manifest                                 │
│ ├── Catalog Database                         │
│ ├── Publication Sources                      │
│ ├── Covers                                   │
│ ├── Staging                                  │
│ ├── Quarantine                               │
│ └── Diagnostics                              │
└──────────────────────────────────────────────┘
```

---

# 9. Process Boundaries

The baseline process model is:

```text
One KnowledgeOS Server process
One KnowledgeOS Client process per running device application
```

The server may use internal worker execution for:

* checksum calculation;
* integrity validation;
* staging cleanup;
* orphan reconciliation;
* backup coordination.

The first implementation shall not require multiple distributed server processes.

---

# 10. Data Ownership Matrix

| Data                       | Owning Runtime | Persistence Authority   |
| -------------------------- | -------------- | ----------------------- |
| MasterLibraryId            | Server         | Master Library          |
| Master Library Manifest    | Server         | Master Library          |
| Master Catalog             | Server         | Server Catalog Database |
| PublicationId              | Server         | Master Catalog          |
| SourceVersion              | Server         | Master Catalog          |
| Source publication bytes   | Server         | NAS Master Library      |
| Master-source metadata     | Server         | Master Catalog          |
| Publication availability   | Server         | Master Catalog          |
| CatalogRevision            | Server         | Master Catalog          |
| Registered server endpoint | Client         | Client Database         |
| Trusted server identity    | Client         | Secure local storage    |
| Cached catalog snapshot    | Client         | Client Database         |
| AcquisitionOperation       | Client         | Client Database         |
| AcquisitionAttempt         | Client         | Client Database         |
| LocalLibraryItem           | Client         | Client Database         |
| Local publication bytes    | Client         | Device-local filesystem |
| Local integrity state      | Client         | Client Database         |
| Personal state             | Outside module | Future subsystem        |

---

# 11. Authority Boundaries

The system has two different authority scopes.

## 11.1 Server Authority

The server is authoritative for:

* publication existence in the Master Catalog;
* source publication existence;
* source publication version;
* master-source checksum;
* source size;
* source availability;
* master metadata.

## 11.2 Client Authority

The client is authoritative for:

* whether a publication is installed on that device;
* acquisition operation state;
* local payload location;
* local integrity state;
* local removal;
* local availability.

---

# 12. Non-Authority Rules

The client shall not:

* modify Master Catalog authority;
* construct PublicationId independently;
* construct SourceVersion independently;
* infer source availability from cached catalog data;
* directly inspect NAS storage;
* upload local Library membership to the NAS.

The server shall not:

* control which publications must exist on every device;
* delete local publication payloads remotely;
* store annotations or reading progress;
* interpret client local membership as Master Catalog state.

---

# 13. Server Logical Architecture

The server is divided into:

```text
Bootstrap
Transport
Application
Domain
Infrastructure
Operations
```

---

# 14. Server Bootstrap

Bootstrap owns:

* configuration loading;
* configuration validation;
* dependency construction;
* persistence initialization;
* migration execution;
* Master Library opening;
* recovery checks;
* HTTP server startup;
* graceful shutdown.

Bootstrap shall not contain business rules.

---

# 15. Server Transport

Transport owns:

* HTTP routing;
* request parsing;
* request validation;
* authentication extraction;
* authorization enforcement;
* response serialization;
* content streaming;
* range semantics;
* transport-level errors;
* correlation identifiers.

Transport shall delegate application behavior.

---

# 16. Server Application

Application owns use-case orchestration.

Primary application services include:

```text
InitializeMasterLibrary
OpenMasterLibrary
ValidateMasterLibrary
RegisterPublication
UpdatePublicationMetadata
ReplacePublicationSource
MarkPublicationUnavailable
WithdrawPublication
ListCatalog
SearchCatalog
GetPublicationDetails
GetPublicationCover
PreparePublicationDelivery
GetServerHealth
```

Application services coordinate Domain behavior and infrastructure ports.

---

# 17. Server Domain

The server Domain owns:

* MasterLibraryId;
* PublicationId;
* SourceVersion;
* CatalogRevision;
* MasterLibraryManifest semantics;
* MasterCatalogEntry;
* SourcePublication;
* PublicationAvailability;
* source replacement rules;
* publication registration invariants;
* catalog revision rules;
* Domain errors.

The Domain shall not import:

* HTTP framework types;
* database entities;
* filesystem path types;
* logging framework types;
* container APIs.

---

# 18. Server Infrastructure

Infrastructure implements:

* manifest storage;
* catalog repository;
* publication repository;
* source publication storage;
* staging storage;
* quarantine storage;
* checksum service;
* database access;
* filesystem access;
* authentication persistence;
* audit persistence;
* configuration adapters;
* logging adapters.

---

# 19. Server Operations

Operations owns:

* health checks;
* metrics;
* structured logs;
* diagnostics;
* backup coordination;
* recovery tooling;
* maintenance mode;
* validation reports.

---

# 20. Server Component Diagram

```text
HTTP Request
    ↓
Transport Controller
    ↓
Authentication / Authorization
    ↓
Application Use Case
    ↓
Domain Rules
    ↓
Repository / Storage Ports
    ↓
Infrastructure Adapters
    ↓
Database / Filesystem
```

---

# 21. Client Logical Architecture

The macOS client is divided into:

```text
Application Bootstrap
Presentation
Features
Client Domain
Services
Persistence
Storage
Diagnostics
```

---

# 22. Client Bootstrap

Client Bootstrap owns:

* application initialization;
* local database opening;
* migration execution;
* service construction;
* local Library validation;
* incomplete acquisition recovery;
* initial server connectivity state;
* root navigation setup.

---

# 23. Client Presentation

Presentation owns:

* SwiftUI views;
* navigation;
* user input;
* loading state;
* error state;
* offline state;
* progress presentation;
* accessibility labels;
* local and remote state distinction.

Presentation shall not own acquisition workflow semantics.

---

# 24. Client Features

The initial features are:

```text
Server Connection
Master Catalog
Publication Details
Acquisition
Selective Local Library
Diagnostics
```

---

# 25. Server Connection Feature

This feature owns:

* server endpoint registration;
* server identity retrieval;
* trust confirmation;
* authentication;
* connectivity monitoring;
* server state;
* reconnect behavior.

---

# 26. Master Catalog Feature

This feature owns:

* catalog page requests;
* catalog search;
* catalog pagination;
* cached catalog projection;
* CatalogRevision comparison;
* catalog freshness;
* merging remote catalog state with local availability.

---

# 27. Publication Details Feature

This feature owns:

* publication detail loading;
* remote availability display;
* local availability display;
* source version comparison;
* available actions;
* cover loading.

---

# 28. Acquisition Feature

This feature owns:

* AcquisitionOperation;
* AcquisitionAttempt;
* transfer execution;
* progress;
* cancellation;
* retry;
* optional resume;
* staging file;
* size validation;
* checksum validation;
* local commit;
* failure classification.

---

# 29. Selective Local Library Feature

This feature owns:

* LocalLibraryItem;
* local listing;
* local payload presence;
* local integrity;
* local open placeholder;
* local removal;
* missing payload detection;
* corrupted payload detection.

---

# 30. Client Services

Client services include:

```text
ServerRegistry
ServerTrustService
AuthenticationClient
ConnectivityMonitor
CatalogAPIClient
PublicationAPIClient
AcquisitionTransport
ChecksumValidator
LocalPublicationInstaller
LocalPublicationStorage
DiagnosticsService
```

---

# 31. Client Persistence

Client persistence stores:

* registered servers;
* trusted identity reference;
* catalog snapshot;
* CatalogRevision;
* acquisition operations;
* acquisition attempts;
* local Library items;
* local source versions;
* local checksums;
* local integrity state.

---

# 32. Client Storage

Client filesystem storage contains:

```text
Application Support/
├── library/
├── staging/
├── quarantine/
└── diagnostics/
```

The exact platform paths shall be resolved using supported macOS APIs.

---

# 33. Client Dependency Direction

```text
SwiftUI Views
    ↓
Feature Models / Use Cases
    ↓
Client Domain
    ↓
Service Protocols
    ↓
Network / Persistence / Filesystem Implementations
```

Views shall not directly instantiate network or database implementations.

---

# 34. Shared Contract Boundary

The server and client share logical contracts for:

* stable identifiers;
* API requests;
* API responses;
* error codes;
* pagination;
* source metadata;
* acquisition metadata;
* version compatibility.

Shared contracts do not imply shared runtime code in the same language.

The server may use TypeScript contracts while the client uses generated or independently validated Swift models.

---

# 35. Contract Source of Truth

The API contract source shall be one machine-readable definition.

The preferred direction is:

```text
OpenAPI specification
```

The OpenAPI document shall define:

* paths;
* methods;
* schemas;
* errors;
* authentication requirements;
* response media types;
* versioning.

---

# 36. Contract Generation

The design may generate:

* Swift API client models;
* TypeScript DTO types;
* test fixtures;
* contract validators.

Generated code shall remain traceable to the contract source.

---

# 37. Trust Boundaries

The system contains the following trust boundaries:

```text
User ↔ macOS Client
macOS Client ↔ Local Secure Storage
macOS Client ↔ KnowledgeOS Server
KnowledgeOS Server ↔ NAS Filesystem
KnowledgeOS Server ↔ Administrative Actor
```

Each boundary requires explicit validation.

---

# 38. Client-to-Server Trust

The client shall not trust a server solely because:

* the hostname matches;
* the IP address matches;
* the port matches.

The client shall persist a server identity and detect identity changes.

---

# 39. Server-to-Client Trust

The server shall require authenticated client identity.

The initial authorization model distinguishes:

```text
Reader
Administrator
```

The server shall enforce authorization independent from the client UI.

---

# 40. Network Boundary

The baseline network is a trusted local network.

This does not imply unauthenticated access.

The network design shall support:

* bounded requests;
* authenticated sessions;
* versioned API;
* server identity verification;
* encrypted transport where selected;
* explicit timeout behavior.

---

# 41. Administrative Boundary

Administrative operations shall use a separately protected authorization scope.

Administrative requests include:

* Library initialization;
* publication registration;
* source replacement;
* publication withdrawal;
* full integrity validation;
* maintenance operations.

---

# 42. Storage Boundary

The server shall expose publication content only through PublicationId and SourceVersion.

The client shall never submit an arbitrary server path.

The server shall never return an arbitrary NAS path.

---

# 43. Master Library Physical Structure

The baseline physical structure is:

```text
MasterLibrary/
├── manifest.json
├── database/
│   └── catalog.db
├── publications/
│   └── <publication-id>/
│       └── <source-version>/
│           └── source.pdf
├── covers/
├── staging/
├── quarantine/
├── diagnostics/
└── backups/
```

This structure remains private to server infrastructure.

---

# 44. Master Library Manifest

The manifest shall contain at least:

```text
MasterLibraryId
Master Library format version
Catalog schema version
Created timestamp
Current catalog revision
Minimum compatible server version
```

The manifest shall not contain:

* personal state;
* raw credentials;
* client-specific state.

---

# 45. Server Database Boundary

The server database stores structured Master Library state.

It shall not store full publication payloads in the baseline design.

It may store:

* publication records;
* metadata;
* source versions;
* source checksum;
* source byte length;
* availability;
* catalog revision;
* administrative audit records;
* authorization state.

---

# 46. Client Database Boundary

The client database stores device-local application state.

It may store:

* server registrations;
* trusted server identity metadata;
* catalog snapshot;
* acquisition state;
* local Library membership;
* integrity metadata.

It shall not become a copy of the complete NAS source publication store.

---

# 47. Publication Registration Flow

```text
Administrator
    ↓
Administrative Transport
    ↓
RegisterPublication Use Case
    ↓
Validate metadata
    ↓
Copy source to server staging
    ↓
Validate PDF
    ↓
Calculate size
    ↓
Calculate checksum
    ↓
Create PublicationId
    ↓
Create SourceVersion
    ↓
Commit source payload
    ↓
Commit catalog transaction
    ↓
Advance CatalogRevision
    ↓
Return publication details
```

---

# 48. Registration Failure Boundary

If source commit fails:

* no available catalog entry is created.

If catalog commit fails after source commit:

* the source becomes an orphan candidate;
* the source remains invisible to clients;
* reconciliation or cleanup shall process it.

---

# 49. Catalog Query Flow

```text
macOS View
    ↓
Catalog Feature
    ↓
Catalog API Client
    ↓
GET /v1/catalog
    ↓
Server Transport
    ↓
ListCatalog Use Case
    ↓
Catalog Repository
    ↓
Catalog Response
    ↓
Client Cache
    ↓
Merge with Local Availability
    ↓
Render UI
```

---

# 50. Publication Details Flow

```text
User selects entry
    ↓
Publication Details Feature
    ↓
GET /v1/publications/{id}
    ↓
Server loads catalog entry
    ↓
Server returns master metadata
    ↓
Client loads LocalLibraryItem
    ↓
Client compares versions
    ↓
Client displays action state
```

---

# 51. Publication Acquisition Flow

```text
User selects Acquire
    ↓
Client creates AcquisitionOperation
    ↓
Client persists operation
    ↓
Client requests source metadata
    ↓
Client creates staging destination
    ↓
Client starts streamed transfer
    ↓
Client persists progress
    ↓
Transfer completes
    ↓
Byte length validation
    ↓
Checksum validation
    ↓
Final storage commit
    ↓
LocalLibraryItem commit
    ↓
State becomes AVAILABLE_LOCAL
```

---

# 52. Acquisition Operation Ownership

The client owns AcquisitionOperation because:

* acquisition is device-specific;
* local storage is device-specific;
* transfer recovery is device-specific;
* local installation is device-specific.

The server does not need to persist client acquisition workflow state unless required for bounded transport or audit behavior.

---

# 53. Server Delivery Responsibility

The server delivery path owns:

* authentication;
* authorization;
* publication resolution;
* exact SourceVersion resolution;
* source availability;
* range validation;
* content streaming;
* source integrity metadata;
* transfer diagnostics.

It does not own local installation.

---

# 54. Client Installation Responsibility

The client owns:

* staging;
* local free-space checks;
* byte-length validation;
* checksum validation;
* atomic final commit;
* LocalLibraryItem persistence;
* local integrity state.

---

# 55. Update Flow

```text
Catalog refresh
    ↓
Compare remote SourceVersion with local SourceVersion
    ↓
Mark UPDATE_AVAILABLE
    ↓
User starts update
    ↓
Acquire new version into staging
    ↓
Validate new version
    ↓
Commit new version
    ↓
Update LocalLibraryItem
    ↓
Remove previous payload according to policy
```

The current valid local version remains available until the replacement succeeds.

---

# 56. Local Removal Flow

```text
User selects Remove from Device
    ↓
Confirm action
    ↓
Mark LocalLibraryItem REMOVING
    ↓
Remove local payload
    ↓
Update local persistence
    ↓
Return item to remote-only/catalog-only state
```

No NAS mutation occurs.

---

# 57. Offline Flow

```text
Server becomes unavailable
    ↓
Connectivity state becomes offline
    ↓
Remote operations disabled
    ↓
Catalog cache remains viewable if present
    ↓
Local Library remains viewable
    ↓
Local publication remains openable
```

---

# 58. Reconnect Flow

```text
Connectivity returns
    ↓
Verify server identity
    ↓
Authenticate
    ↓
Check server health
    ↓
Read MasterLibraryId
    ↓
Check CatalogRevision
    ↓
Refresh catalog if required
    ↓
Compare SourceVersions
    ↓
Update client state
```

---

# 59. Recovery Model

The system shall recover through persisted state and reconciliation.

It shall not depend on process memory surviving restart.

---

# 60. Server Startup Recovery

On startup, the server shall inspect:

* stale staging files;
* incomplete registration markers;
* orphan committed source directories;
* catalog entries with missing source payloads;
* invalid current-source references;
* pending schema migrations.

---

# 61. Client Startup Recovery

On startup, the client shall inspect:

* incomplete AcquisitionOperations;
* staging files;
* incomplete final commits;
* LocalLibraryItems with missing files;
* local payloads without LocalLibraryItem;
* invalid checksums where validation is required.

---

# 62. Recovery Outcomes

A recovery check may:

* resume;
* restart;
* fail safely;
* quarantine;
* clean up;
* mark recovery required;
* request user action.

Recovery shall never mark an unvalidated payload available.

---

# 63. Consistency Model

The system does not use a distributed transaction between:

* server database;
* NAS filesystem;
* client database;
* client filesystem.

Consistency is achieved through:

* explicit state machines;
* staging;
* commit ordering;
* idempotency;
* reconciliation;
* integrity validation.

---

# 64. Server Consistency Invariant

An `AVAILABLE` Master Catalog entry shall reference a committed, readable and integrity-described source publication.

---

# 65. Client Consistency Invariant

An `AVAILABLE_LOCAL` LocalLibraryItem shall reference a committed, readable and integrity-validated local publication payload.

---

# 66. Eventual Recovery

Temporary inconsistency may exist internally during recoverable workflows.

It shall not be exposed as valid final state.

Examples:

* committed source without catalog entry;
* staging file without active operation;
* completed file move before local database commit.

Recovery shall reconcile these states.

---

# 67. Idempotency Model

The following operations shall be idempotent or protected against duplicate effects:

* server initialization request;
* acquisition cancellation;
* cleanup;
* recovery reconciliation;
* publication withdrawal;
* health queries;
* retry of safe reads.

Publication registration shall use explicit duplicate handling.

---

# 68. Concurrency Model

The server shall support concurrent readers.

Mutable operations affecting the same publication require coordination.

Examples:

* source replacement;
* metadata update;
* withdrawal;
* integrity-state update.

The client shall not run two uncontrolled acquisitions for the same PublicationId and SourceVersion.

---

# 69. Locking Scope

Locking shall be narrow and scoped.

Possible lock scopes:

```text
Master Library initialization
Publication mutation
SourceVersion creation
CatalogRevision update
Local publication installation
```

Global locks shall be avoided where finer coordination is safe.

---

# 70. Catalog Revision Model

CatalogRevision shall advance when catalog-visible authoritative state changes.

It shall not advance for:

* client catalog caching;
* local acquisition;
* local removal;
* personal state.

---

# 71. Catalog Snapshot Model

A client snapshot shall be keyed by:

```text
ServerIdentity
MasterLibraryId
CatalogRevision
```

A snapshot from one Library shall never be reused for another.

---

# 72. Compatibility Model

Compatibility shall be evaluated across:

```text
Client version
Server version
API version
Master Library format version
Server database schema version
Client database schema version
```

Compatibility failure shall be explicit.

---

# 73. API Versioning

The initial API version is:

```text
v1
```

Breaking transport changes require a new version or governed compatibility mechanism.

---

# 74. Master Library Format Versioning

The Master Library format version governs:

* manifest semantics;
* physical storage expectations;
* catalog compatibility;
* source storage interpretation.

The server shall reject unsupported newer formats safely.

---

# 75. Database Schema Versioning

Both server and client databases shall use explicit migrations.

Migrations shall run before normal operation.

Failed migrations shall prevent false healthy state.

---

# 76. Error Propagation

Errors flow through:

```text
Infrastructure Error
    ↓
Application Error
    ↓
Stable Module Error
    ↓
Transport Error Contract
    ↓
Client Error Model
    ↓
User-Facing Message
```

Raw infrastructure errors shall not cross public boundaries.

---

# 77. Error Correlation

Every server request shall receive a correlation identifier.

Every acquisition shall have:

```text
AcquisitionOperationId
AcquisitionAttemptId
```

Logs should include these identifiers where relevant.

---

# 78. Security Model

The baseline security model includes:

* server identity;
* client device identity;
* trusted registration;
* authenticated requests;
* Reader and Administrator roles;
* server-side authorization;
* secure credential storage;
* request validation;
* path safety;
* bounded transfer behavior;
* security logging.

---

# 79. Privacy Model

The server receives only data needed for:

* connection;
* authentication;
* catalog access;
* publication acquisition;
* administrative operations;
* diagnostics.

The server shall not receive:

* reading progress;
* annotations;
* favorites;
* personal tags;
* personal relationships;
* personal notes.

---

# 80. Performance Model

The performance-critical paths are:

* server startup;
* catalog query;
* publication details;
* time to first content byte;
* sustained transfer;
* checksum calculation;
* local installation.

The design shall avoid:

* whole-file memory buffering;
* unbounded query results;
* unbounded concurrent transfer;
* repeated checksum calculation without reason.

---

# 81. Transfer Buffering

Server and client shall use bounded streaming buffers.

The buffer size shall be configurable or centrally defined.

The exact value shall be selected through measurement.

---

# 82. Acquisition Concurrency

The client shall use an explicit acquisition concurrency limit.

The server shall use an explicit transfer concurrency or resource policy.

The initial implementation may support one active acquisition per client.

---

# 83. Backpressure

The transfer path shall allow the consumer to control read pace.

The server shall not accumulate the complete payload when a client reads slowly.

---

# 84. Timeout Model

Timeouts shall be defined for:

* connection;
* request;
* authentication;
* catalog query;
* idle transfer;
* shutdown.

Timeouts shall not be hidden defaults without documentation.

---

# 85. Observability Model

Structured server logs shall include:

```text
timestamp
severity
requestId
operation
result
duration
safe identifiers
```

Acquisition logs may include:

```text
PublicationId
SourceVersion
AcquisitionOperationId
bytes transferred
duration
failure category
```

---

# 86. Sensitive Logging Prohibition

Logs shall not include:

* credentials;
* tokens;
* raw NAS paths;
* personal content;
* publication binary content;
* full request secrets.

---

# 87. Metrics Model

Initial server metrics should include:

* health state;
* active requests;
* catalog latency;
* active transfers;
* bytes transferred;
* transfer failures;
* integrity failures;
* storage failures.

Client diagnostics should include:

* connection state;
* acquisition state;
* last failure category;
* local integrity state.

---

# 88. Deployment Model

The preferred deployment topology is:

```text
OCI-compatible container
        ↓
KnowledgeOS Server process
        ↓
Mounted persistent NAS volume
```

This remains subject to the target NAS decision.

---

# 89. Persistent Volume Boundary

The Master Library shall exist outside the disposable server deployment artifact.

Recreating or updating the application container shall not delete:

* manifest;
* catalog;
* source publications;
* covers;
* backups.

---

# 90. Development Topology

Development shall support:

```text
Local KnowledgeOS Server on Mac
Temporary Master Library
Local test database
Seeded PDF catalog
macOS client
```

A later validation stage shall deploy the same contracts and persistence behavior on the reference NAS.

---

# 91. Testability Model

Every major boundary shall expose a testable port or contract.

Examples:

```text
CatalogRepository
PublicationStorage
ChecksumService
Clock
IdGenerator
AuthenticationService
DownloadTransport
LocalPublicationStorage
```

Tests shall replace these only at appropriate boundaries.

---

# 92. Integration Testing Model

Integration tests shall use:

* real database;
* real filesystem;
* real HTTP server where relevant;
* temporary directories;
* real checksum implementation;
* representative PDF files.

---

# 93. End-to-End Testing Model

The principal E2E environment shall include:

```text
real server
real Master Library
real catalog database
real source PDF
real HTTP transport
real macOS client
real local persistence
real local file storage
```

---

# 94. Failure Injection

The design shall support testing:

* server unavailable;
* source missing;
* source corrupted;
* database unavailable;
* permission denied;
* transfer interruption;
* checksum mismatch;
* insufficient local storage;
* client restart;
* server restart.

---

# 95. Initial Technology Direction

The concrete technology decision is not finalized in this document.

The current direction is:

```text
Server
    TypeScript
    Node.js
    NestJS or equivalent modular framework
    lightweight relational database
    filesystem publication storage
    OpenAPI
    HTTP streaming

Client
    Swift
    SwiftUI
    URLSession
    native local persistence
    Keychain
```

The final choices belong in `TechnologyDecisions.md`.

---

# 96. Design Risks

The principal system-design risks are:

* actual NAS runtime limitations;
* server packaging;
* filesystem semantics;
* database behavior on NAS storage;
* authentication complexity;
* server identity management;
* reliable large-file streaming;
* client restart recovery;
* atomic local installation;
* schema migration safety.

---

# 97. Early Validation Spikes

Before production implementation, the following spikes may be required:

1. Deploy minimal server on reference NAS.
2. Stream a large PDF from NAS to macOS.
3. Validate checksum without whole-file buffering.
4. Test local atomic file replacement.
5. Validate database behavior on the intended persistent volume.
6. Test server identity and secure credential storage.

---

# 98. System Design Completion Gate

This design is complete when:

```text
[ ] Runtime systems are explicit
[ ] Process boundaries are explicit
[ ] Data ownership is explicit
[ ] Authority boundaries are explicit
[ ] Server layers are explicit
[ ] Client layers are explicit
[ ] Trust boundaries are explicit
[ ] Persistence boundaries are explicit
[ ] Storage boundaries are explicit
[ ] Registration flow is explicit
[ ] Catalog flow is explicit
[ ] Acquisition flow is explicit
[ ] Offline flow is explicit
[ ] Recovery model is explicit
[ ] Consistency model is explicit
[ ] Security model is explicit
[ ] Deployment direction is explicit
[ ] Testing boundaries are explicit
[ ] No architectural contradiction remains
```

---

# 99. System Design Invariants

The following invariants apply:

* KnowledgeOS Server owns direct NAS Master Library access.
* Clients communicate through versioned contracts.
* The Master Catalog remains authoritative on the server.
* Device catalog data is a projection or cache.
* Device Libraries remain selective.
* Device Libraries are not NAS replicas.
* Acquisition state belongs to the client.
* Personal state remains outside the module.
* Source payloads and structured metadata remain separated.
* Staging remains isolated from committed availability.
* Publication identity remains independent from path.
* Large payloads use bounded streaming.
* Recovery uses persisted state and reconciliation.
* Local publications remain available offline.
* Local removal does not mutate NAS content.

---

# 100. Prohibited System Designs

The implementation shall not introduce:

* direct client mounting of Master Library data;
* shared server-client database;
* NAS paths in public contracts;
* automatic full Library mirroring;
* publication identity derived from filename;
* whole-file buffering;
* unversioned persistence;
* hidden personal-state upload;
* UI-owned acquisition state;
* catalog availability based only on file presence without governed state;
* distributed complexity without measured need.

---

# 101. Related Documents

## Technical Design

* `README.md`
* `ServerDesign.md`
* `ClientDesign.md`
* `DataFlow.md`
* `ErrorModel.md`
* `TechnologyDecisions.md`

## Requirements

* `../01-Requirements/README.md`
* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

## Architecture

* `../../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`
* `../../../00-Architecture/07-ArchitectureViews/C4/diagrams/deployment/C4-Deployment-Native-NAS-Providers.puml`

---

# 102. Status

**Approved**

The Master Library system topology, runtime boundaries, authority model, data ownership, trust boundaries and principal execution flows are defined.

The next document is:

```text
01-MasterLibrary/02-TechnicalDesign/ServerDesign.md
```

It shall define the concrete internal design of KnowledgeOS Server before technology selection is finalized.
