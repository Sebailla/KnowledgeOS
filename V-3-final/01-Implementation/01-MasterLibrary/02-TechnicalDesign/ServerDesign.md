
# Master Library Server Design

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Technical Design

**Document:** Server Design

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Requirements Baseline:** Master Library Requirements v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the internal technical design of KnowledgeOS Server for the Master Library Module.

It specifies:

* server responsibilities;
* internal modules;
* dependency direction;
* application services;
* persistence ports;
* storage ports;
* transport boundaries;
* authentication and authorization;
* publication registration;
* publication delivery;
* server lifecycle;
* recovery;
* observability;
* operational constraints.

KnowledgeOS Server is the only runtime permitted to access the NAS Master Library directly.

---

# 2. Scope

The server design covers:

* process startup;
* configuration;
* Master Library initialization;
* Master Library open;
* Master Library validation;
* Master Catalog persistence;
* publication registration;
* master metadata updates;
* source replacement;
* publication availability;
* catalog listing;
* catalog search;
* publication details;
* publication cover delivery;
* publication content streaming;
* authentication;
* authorization;
* health;
* logging;
* metrics;
* recovery;
* shutdown.

It does not cover:

* document rendering;
* annotation storage;
* reading progress;
* personal-state synchronization;
* CloudKit;
* UDM processing;
* DPM processing;
* AI;
* Plugins.

---

# 3. Core Server Principle

> KnowledgeOS Server governs all access to the NAS Master Library through explicit application services and versioned contracts.

No client may bypass the server and access Master Library storage directly.

---

# 4. Server Responsibilities

KnowledgeOS Server owns:

* Master Library identity;
* Master Library format validation;
* Master Catalog authority;
* source-publication authority;
* SourceVersion authority;
* master-source metadata;
* source integrity metadata;
* publication availability;
* catalog revision;
* Reader and Administrator authorization;
* publication delivery;
* administrative mutation;
* server health;
* operational diagnostics.

---

# 5. Server Non-Responsibilities

KnowledgeOS Server shall not own:

* Selective Local Library membership;
* device-local publication installation;
* device-local acquisition workflow state;
* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* iCloud state;
* client UI state.

---

# 6. Internal Architecture

The server shall use the following logical layers:

```text
Bootstrap
Transport
Application
Domain
Infrastructure
Operations
```

Dependency direction shall point inward toward Domain and Application abstractions.

---

# 7. Dependency Direction

```text
Bootstrap
   ↓
Transport
   ↓
Application
   ↓
Domain

Infrastructure
   ↑
Application Ports
```

The Domain shall not depend on Infrastructure.

Application services shall depend on interfaces or ports.

Infrastructure shall implement those ports.

---

# 8. Server Module Structure

The server shall be divided into bounded implementation modules:

```text
Server
├── Bootstrap
├── Configuration
├── Health
├── Authentication
├── Authorization
├── MasterLibrary
├── Catalog
├── PublicationAdministration
├── PublicationDelivery
├── Persistence
├── Storage
├── Recovery
├── Observability
└── Operations
```

---

# 9. Bootstrap Module

Bootstrap is responsible for:

* process entry;
* configuration loading;
* dependency construction;
* database migration;
* Master Library opening;
* startup recovery;
* HTTP server initialization;
* graceful shutdown registration.

Bootstrap shall remain thin.

It shall not contain use-case logic.

---

# 10. Configuration Module

Configuration shall define and validate:

```text
Server host
Server port
Master Library root
Database location
Logging level
Authentication settings
Transfer buffer size
Maximum page size
Maximum concurrent transfers
Shutdown timeout
Staging retention
Quarantine retention
```

Invalid mandatory configuration shall prevent healthy startup.

---

# 11. Configuration Sources

Configuration may be loaded from:

* environment variables;
* configuration file;
* container secrets;
* command-line arguments for administrative tooling.

Priority rules shall be explicit.

Secrets shall not be committed to source control.

---

# 12. Health Module

The Health Module shall expose:

* process health;
* Master Library health;
* catalog availability;
* source storage availability;
* migration status;
* degraded state.

The minimum endpoint is:

```text
GET /v1/health
```

---

# 13. Health States

The server may report:

```text
HEALTHY
DEGRADED
UNHEALTHY
STARTING
MAINTENANCE
```

## HEALTHY

All required services are available.

## DEGRADED

The process is running, but one or more non-terminal capabilities are unavailable.

## UNHEALTHY

The server cannot safely provide its required service.

## STARTING

Initialization or recovery is in progress.

## MAINTENANCE

Mutable or public operations are intentionally restricted.

---

# 14. Authentication Module

The Authentication Module shall own:

* client-device identity;
* credential verification;
* session or token issuance;
* credential revocation;
* authentication failure reporting;
* secure credential handling.

The initial design shall not require public user-account infrastructure.

---

# 15. Device Identity

Each registered client device shall have a stable logical identity.

Conceptually:

```text
DeviceId
DeviceName
DeviceType
RegisteredAt
CredentialState
RoleAssignments
```

Device identity shall not be inferred solely from IP address.

---

# 16. Authentication Flow

```text
Client
  ↓
Presents device credential
  ↓
Authentication Module
  ↓
Credential verification
  ↓
Authenticated Device Principal
  ↓
Authorization Module
```

---

# 17. Authentication Failure Rules

Authentication failures shall:

* return structured errors;
* avoid credential disclosure;
* avoid stack traces;
* generate security logs;
* avoid repeated automatic credential replay after identity mismatch.

---

# 18. Authorization Module

The initial role model is:

```text
Reader
Administrator
```

Authorization shall be enforced server-side.

---

# 19. Reader Permissions

A Reader may:

* inspect server identity;
* inspect Library information;
* browse catalog;
* search catalog;
* retrieve publication details;
* retrieve covers;
* acquire publication content.

---

# 20. Administrator Permissions

An Administrator may additionally:

* initialize Master Library;
* validate Master Library;
* register publication;
* update master metadata;
* replace publication source;
* mark unavailable;
* withdraw publication;
* execute maintenance operations.

---

# 21. MasterLibrary Module

The MasterLibrary Module owns:

* MasterLibraryId;
* manifest;
* format version;
* open state;
* health state;
* initialization;
* validation;
* compatibility;
* storage-root resolution.

---

# 22. MasterLibraryService

The server shall expose an application service conceptually equivalent to:

```text
MasterLibraryService
├── initialize()
├── open()
├── validate()
├── getInfo()
├── getHealth()
└── close()
```

---

# 23. Master Library Initialization

Initialization shall:

1. validate the target;
2. detect existing content;
3. create MasterLibraryId;
4. create required directories;
5. write manifest;
6. initialize database;
7. record schema versions;
8. validate created state;
9. return Library information.

Initialization shall be idempotency-protected.

---

# 24. Initialization Lock

Only one initialization operation may execute for a target at a time.

Concurrent initialization attempts shall fail with conflict or join the existing operation according to explicit policy.

---

# 25. Master Library Open

Open shall validate:

* manifest existence;
* manifest syntax;
* format compatibility;
* database compatibility;
* required directories;
* source-store accessibility;
* permissions.

The Library shall not become available until required checks pass.

---

# 26. Master Library Validation Modes

The server shall support:

```text
STRUCTURAL
REFERENTIAL
FULL_INTEGRITY
```

## STRUCTURAL

Checks required files, directories and schema compatibility.

## REFERENTIAL

Checks catalog-to-storage references.

## FULL_INTEGRITY

Recomputes source checksums and validates full storage consistency.

---

# 27. Catalog Module

The Catalog Module owns:

* MasterCatalogEntry;
* catalog listing;
* catalog search;
* publication details;
* source availability;
* CatalogRevision;
* deterministic ordering;
* pagination.

---

# 28. Catalog Application Services

Conceptual services:

```text
ListCatalog
SearchCatalog
GetPublicationDetails
GetCatalogRevision
GetLibraryInfo
```

---

# 29. Catalog Repository Port

The Application layer shall depend on a CatalogRepository abstraction.

Conceptually:

```text
CatalogRepository
├── findById(publicationId)
├── list(pageRequest)
├── search(searchRequest)
├── insert(entry)
├── update(entry)
├── updateAvailability(...)
├── getRevision()
├── advanceRevision()
└── transaction(...)
```

---

# 30. Catalog Ordering

Default catalog ordering shall be deterministic.

The initial order may use:

```text
title normalized ascending
PublicationId ascending as tie breaker
```

Alternative sorting may be introduced explicitly.

---

# 31. Catalog Pagination

Catalog responses shall be bounded.

The preferred model is cursor-based pagination.

The initial implementation may use offset pagination if formally accepted in Technology Decisions.

---

# 32. Catalog Search

Initial search shall operate on approved metadata fields only.

Search shall not inspect source publication content.

Search input shall have explicit length and complexity limits.

---

# 33. Catalog Revision

CatalogRevision shall advance within the same authoritative transaction as catalog-visible mutations where practical.

Mutations include:

* publication creation;
* metadata update;
* source update;
* availability update;
* withdrawal.

---

# 34. PublicationAdministration Module

This module owns:

* publication registration;
* metadata mutation;
* source replacement;
* unavailability;
* withdrawal;
* source validation;
* staging orchestration;
* catalog-source consistency.

---

# 35. RegisterPublication Use Case

Conceptual input:

```text
RegisterPublicationCommand
├── metadata
├── sourceInput
├── coverInput?
├── requestedBy
└── idempotencyKey?
```

Conceptual output:

```text
RegisterPublicationResult
├── publicationId
├── sourceVersion
├── catalogRevision
├── availability
└── createdAt
```

---

# 36. Publication Registration Workflow

```text
Validate authorization
    ↓
Validate metadata
    ↓
Create staging file
    ↓
Stream source into staging
    ↓
Detect media type
    ↓
Validate PDF baseline
    ↓
Calculate byte length
    ↓
Calculate checksum
    ↓
Create PublicationId
    ↓
Create SourceVersion
    ↓
Commit source payload
    ↓
Commit catalog entry
    ↓
Advance CatalogRevision
    ↓
Return result
```

---

# 37. Registration Consistency Protocol

The registration protocol shall preserve:

> No available catalog entry may reference an uncommitted source payload.

The workflow shall use:

* staging;
* deterministic final storage reference;
* explicit commit markers or state;
* catalog transaction;
* reconciliation.

---

# 38. Registration States

Internal registration state may use:

```text
CREATED
STAGING
VALIDATING
SOURCE_COMMITTED
CATALOG_COMMITTED
COMPLETED
FAILED
RECOVERY_REQUIRED
```

These states need not all be exposed publicly.

---

# 39. Source Commit Failure

If source commit fails:

* catalog entry shall not be created as available;
* staging shall be cleaned or quarantined;
* failure shall be logged;
* operation shall end as failed.

---

# 40. Catalog Commit Failure After Source Commit

If source commit succeeds but catalog commit fails:

* source remains hidden;
* source becomes an orphan candidate;
* recovery shall reconcile or remove it;
* no Reader API shall expose it.

---

# 41. Metadata Update

Metadata update shall:

* preserve PublicationId;
* preserve SourceVersion;
* validate allowed fields;
* reject personal-state fields;
* advance CatalogRevision;
* persist transactionally.

---

# 42. Source Replacement

Source replacement shall:

* preserve PublicationId;
* stage the new source;
* calculate new integrity metadata;
* create a new SourceVersion;
* preserve the previous current source until commit;
* advance CatalogRevision after success.

---

# 43. Source Version Rule

A new SourceVersion is required when authoritative source bytes change.

Metadata-only changes do not require a new SourceVersion.

---

# 44. Publication Availability

Supported states:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

The server shall enforce allowed transitions.

---

# 45. PublicationDelivery Module

This module owns:

* publication source resolution;
* SourceVersion resolution;
* delivery authorization;
* content metadata;
* streaming;
* range validation;
* transfer diagnostics.

It does not own client acquisition state.

---

# 46. PreparePublicationDelivery Use Case

Conceptual output:

```text
PublicationDeliveryDescriptor
├── publicationId
├── sourceVersion
├── mediaType
├── byteLength
├── checksum
├── storageHandle
├── rangeCapabilities
└── availability
```

The storage handle remains server-internal.

---

# 47. Content Endpoint

Baseline endpoint:

```text
GET /v1/publications/{publicationId}/content
```

The request shall identify the desired SourceVersion explicitly or use a documented current-version rule.

---

# 48. Source Version Delivery Rule

An active transfer shall not silently switch to a newer SourceVersion.

If the requested version is unavailable, the server shall return an explicit error.

---

# 49. Streaming Design

Publication content shall be streamed using bounded buffers.

The server shall not load the complete source into memory.

The stream shall support backpressure.

---

# 50. Content Metadata

Delivery responses shall expose safe metadata through headers or response fields, including:

* SourceVersion;
* content length;
* media type;
* checksum algorithm;
* checksum value where appropriate;
* range support.

---

# 51. Range Requests

If range support is selected, the server shall validate:

* unit;
* start;
* end;
* file bounds;
* requested SourceVersion.

Invalid ranges shall not read arbitrary storage.

---

# 52. Cover Delivery

Cover storage and delivery shall follow governed asset references.

The server shall not allow arbitrary cover-path input.

---

# 53. Persistence Module

The Persistence Module owns:

* database connection;
* migrations;
* transaction management;
* repository implementations;
* schema version;
* persistence health.

---

# 54. Database Scope

The server database shall store structured state.

It shall not store source publication binaries in the baseline design.

---

# 55. Core Server Tables

The logical schema is expected to include:

```text
master_library
publications
publication_authors
publication_subjects
source_versions
publication_availability
catalog_revision
device_identities
device_credentials
role_assignments
administrative_audit
operations
```

The exact schema belongs in Persistence documentation.

---

# 56. Migration Requirement

Migrations shall exist from the first schema.

Server startup shall:

1. inspect schema version;
2. determine migration need;
3. run approved migrations;
4. fail safely on migration error;
5. avoid healthy status until complete.

---

# 57. Transaction Boundaries

Database transactions shall cover:

* catalog entry creation;
* metadata updates;
* source-version metadata;
* availability transitions;
* CatalogRevision update;
* credential and role mutation.

Filesystem and database consistency requires workflow coordination beyond one database transaction.

---

# 58. Storage Module

The Storage Module owns:

* Master Library root;
* publication source paths;
* cover paths;
* staging;
* quarantine;
* diagnostics storage;
* atomic move;
* safe deletion;
* storage validation.

---

# 59. Storage Ports

Application code shall depend on abstractions conceptually equivalent to:

```text
PublicationStorage
StagingStorage
QuarantineStorage
CoverStorage
ManifestStorage
```

---

# 60. PublicationStorage Port

Conceptually:

```text
PublicationStorage
├── createStagingTarget()
├── writeStream()
├── commitSource()
├── openSource()
├── sourceExists()
├── deleteSource()
├── listOrphans()
└── validateReference()
```

---

# 61. Storage Reference

The database shall store logical storage references rather than absolute paths.

Infrastructure resolves them to physical locations.

---

# 62. Path Safety

All physical paths shall be derived internally from validated identifiers.

No public request may supply an arbitrary filesystem path.

---

# 63. File Naming

Source file names in committed storage shall be server-controlled.

Original file names may be stored as metadata where useful, but shall not determine storage identity.

---

# 64. Staging

Staging shall be isolated from publication delivery.

A staging file shall never be returned through Reader endpoints.

---

# 65. Quarantine

Quarantine may contain:

* invalid sources;
* corrupted sources;
* failed imports requiring inspection;
* recovery artifacts.

Quarantined content shall never be available for acquisition.

---

# 66. Checksum Service

The Checksum Service shall support streaming calculation.

The algorithm shall be fixed in Technology Decisions.

The baseline recommendation is SHA-256.

---

# 67. PDF Baseline Validation

Initial PDF validation may include:

* file signature;
* media-type consistency;
* readable structure using approved library or parser;
* non-zero length;
* rejection of obvious invalid input.

Deep rendering validation belongs to later modules.

---

# 68. Recovery Module

The Recovery Module owns startup and maintenance reconciliation.

It shall detect:

* stale staging files;
* orphan committed sources;
* catalog entries with missing source;
* invalid storage references;
* interrupted operations;
* failed migrations.

---

# 69. Recovery Actions

Recovery may:

* clean;
* quarantine;
* mark unavailable;
* mark corrupted;
* restore from operation metadata;
* require administrator action.

Recovery shall never invent a valid catalog entry from an unknown source automatically.

---

# 70. Reconciliation Jobs

Recommended jobs:

```text
ReconcileCatalogToStorage
ReconcileStorageToCatalog
CleanExpiredStaging
ValidateCurrentSources
CleanOrphanSources
```

---

# 71. Background Job Execution

Background jobs shall use bounded concurrency.

Jobs shall be observable.

Jobs shall not block server startup unnecessarily unless integrity requires it.

---

# 72. Operations Module

Operations owns:

* health;
* maintenance mode;
* diagnostics;
* metrics;
* administrative CLI where selected;
* backup coordination;
* readiness and liveness checks.

---

# 73. Maintenance Mode

Maintenance mode may restrict:

* registration;
* source replacement;
* withdrawal;
* schema migration;
* full integrity validation.

Reader access may remain available when safe.

---

# 74. Administrative Interface

The first implementation may use:

* protected HTTP API;
* CLI;
* both.

A polished administrative GUI is not required.

The chosen interface shall be documented.

---

# 75. Audit Logging

Administrative mutations shall emit audit records.

Audit records shall include:

```text
timestamp
administrator identity
operation
target identifier
result
correlation identifier
```

Audit records shall exclude secrets.

---

# 76. Observability

Server logs shall be structured.

Recommended fields:

```text
timestamp
severity
requestId
operation
publicationId?
sourceVersion?
deviceId?
result
duration
errorCode?
```

---

# 77. Metrics

Initial metrics should include:

* process uptime;
* health state;
* request count;
* request latency;
* catalog query latency;
* active transfers;
* transferred bytes;
* transfer failures;
* integrity failures;
* storage failures;
* authentication failures.

---

# 78. Trace Boundaries

Distributed tracing is optional.

At minimum, correlation identifiers shall connect:

* incoming request;
* application service;
* persistence;
* storage;
* response.

---

# 79. Request Lifecycle

```text
Receive request
    ↓
Assign requestId
    ↓
Validate request
    ↓
Authenticate
    ↓
Authorize
    ↓
Execute use case
    ↓
Translate result
    ↓
Emit metrics and logs
    ↓
Return response
```

---

# 80. Error Translation

Infrastructure errors shall be translated into stable module errors before transport serialization.

Raw database and filesystem messages shall not be returned to clients.

---

# 81. Error Response Shape

Conceptually:

```json
{
  "error": {
    "code": "PUBLICATION_NOT_FOUND",
    "message": "The requested publication does not exist.",
    "requestId": "..."
  }
}
```

Safe details may be included when explicitly defined.

---

# 82. Concurrency

The server shall support concurrent Reader requests.

Mutable operations shall coordinate by scope.

Recommended scopes:

```text
Master Library initialization
Publication mutation
Source replacement
CatalogRevision update
Credential mutation
```

---

# 83. Publication Mutation Lock

Only one source replacement or conflicting mutation for the same PublicationId may commit at a time.

Read operations may continue against the current committed state.

---

# 84. Catalog Revision Coordination

CatalogRevision increments shall be serialized or transactionally protected.

Duplicate revision assignment is prohibited.

---

# 85. Transfer Concurrency

The server shall define:

* maximum concurrent transfers;
* maximum transfers per device;
* transfer buffer size;
* idle timeout;
* request timeout.

Exact values belong in Technology Decisions and Performance validation.

---

# 86. Resource Limits

The server shall enforce bounds for:

* request body size;
* metadata size;
* search-query length;
* page size;
* concurrent registrations;
* concurrent transfers;
* staging retention;
* logs.

---

# 87. Shutdown

Graceful shutdown shall:

1. stop accepting new mutations;
2. stop accepting new transfers;
3. allow or cancel active operations according to timeout;
4. persist operation evidence;
5. close database connections;
6. flush logs;
7. exit.

---

# 88. Server Restart

After restart:

* MasterLibraryId remains;
* catalog remains;
* current SourceVersion remains;
* incomplete operations are reconciled;
* stale staging is handled;
* health remains false until required recovery completes.

---

# 89. Deployment Assumption

The preferred server deployment is a single container or native process on the NAS.

Persistent state shall reside outside the disposable application artifact.

---

# 90. Container Design

If containerized:

```text
Container
├── Server application
├── Runtime
└── Read-only application files

Mounted volume
└── Master Library
```

The container shall run with the minimum required filesystem permissions.

---

# 91. User and Filesystem Permissions

The server process shall use a dedicated operating-system identity where practical.

It shall have access only to:

* configured Master Library storage;
* required configuration;
* required diagnostic destination.

---

# 92. Network Exposure

The initial server shall bind only to the configured trusted-network interface.

Public internet binding is prohibited by default.

---

# 93. TLS Direction

HTTPS is preferred.

The final local certificate and trust strategy shall be defined in Technology Decisions.

Development HTTP may be permitted only in explicitly non-production profiles.

---

# 94. Backup Coordination

Backup shall preserve a consistent point across:

* manifest;
* database;
* publication files;
* source metadata.

The server may expose maintenance or checkpoint operations to support backup consistency.

---

# 95. Restore Validation

After restore, the server shall:

* validate manifest;
* validate schema;
* open catalog;
* reconcile storage;
* verify sample or full checksums;
* report health truthfully.

---

# 96. Testing Boundaries

The server design shall support:

* Domain unit tests;
* application-service tests;
* repository integration tests;
* storage integration tests;
* API tests;
* authentication tests;
* authorization tests;
* streaming tests;
* recovery tests;
* deployment smoke tests.

---

# 97. Test Doubles

Test doubles may replace:

* Clock;
* IdGenerator;
* CatalogRepository;
* PublicationStorage;
* AuthenticationService;
* AuditService.

Real database and filesystem implementations shall be used in integration tests.

---

# 98. Reference Test Dataset

The server test dataset shall include:

* valid PDF;
* invalid PDF;
* small PDF;
* medium PDF;
* large PDF;
* source update;
* publication without cover;
* unavailable publication;
* withdrawn publication;
* corrupted source.

---

# 99. Security Tests

Required tests include:

* invalid credentials;
* revoked credentials;
* Reader attempting administration;
* path traversal;
* malformed PublicationId;
* invalid range;
* oversized metadata;
* source file spoofing;
* server identity and credential handling.

---

# 100. Server Design Completion Gate

The server design is complete when:

```text
[ ] Modules are explicit
[ ] Dependency direction is explicit
[ ] Application services are explicit
[ ] Domain ownership is explicit
[ ] Repository ports are explicit
[ ] Storage ports are explicit
[ ] Registration workflow is explicit
[ ] Source replacement workflow is explicit
[ ] Delivery workflow is explicit
[ ] Authentication is explicit
[ ] Authorization is explicit
[ ] Recovery is explicit
[ ] Observability is explicit
[ ] Concurrency is explicit
[ ] Shutdown is explicit
[ ] Deployment assumptions are explicit
[ ] Testing boundaries are explicit
[ ] No architectural contradiction remains
```

---

# 101. Server Invariants

The following invariants apply:

* Only KnowledgeOS Server accesses NAS Master Library storage directly.
* Reader APIs never expose raw NAS paths.
* Available catalog entries reference committed sources.
* Source changes create new SourceVersion.
* Metadata-only changes preserve SourceVersion.
* CatalogRevision changes only for authoritative catalog-visible changes.
* Personal state is never accepted or persisted.
* Large files are streamed.
* Staging is never Reader-visible.
* Authorization is enforced server-side.
* Recovery never marks unvalidated data available.
* Persistent state survives server deployment replacement.

---

# 102. Prohibited Server Designs

The server shall not:

* act as a generic NAS browser;
* accept arbitrary filesystem paths from clients;
* identify publications by path;
* store personal reading data;
* buffer entire large files;
* expose database entities directly as public contracts;
* hide authentication failures;
* let Reader credentials perform administration;
* make staging content acquirable;
* mark catalog entries available before source commit;
* silently overwrite existing Master Library data;
* treat the container filesystem as persistent Library storage.

---

# 103. Related Documents

## Technical Design

* `README.md`
* `SystemDesign.md`
* `ClientDesign.md`
* `DataFlow.md`
* `ErrorModel.md`
* `TechnologyDecisions.md`

## Requirements

* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

## Future Detailed Areas

* `../05-Persistence/README.md`
* `../06-Server/README.md`
* `../06-Server/ServerArchitecture.md`
* `../06-Server/Configuration.md`
* `../06-Server/Security.md`

---

# 104. Status

**Approved**

KnowledgeOS Server has a complete internal responsibility model for the Master Library Module.

The next document is:

```text
01-MasterLibrary/02-TechnicalDesign/ClientDesign.md
```

It shall define the macOS reference client's internal architecture, state ownership, local persistence, acquisition workflow and offline behavior.
