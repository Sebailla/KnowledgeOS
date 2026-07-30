
# Master Library Module

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Document:** README

**Version:** 1.0

**Status:** Designing

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation boundary and organization of the Master Library Module.

The Master Library Module is the first complete vertical module of KnowledgeOS.

It delivers the full path from:

* KnowledgeOS Server running on the NAS;
* Master Library initialization;
* Master Catalog management;
* source publication registration;
* catalog browsing from a KnowledgeOS client;
* publication acquisition;
* Selective Local Library installation;
* offline local availability.

The module shall be completed end to end before another functional module begins.

---

# 2. Module Status

The current module state is:

```text
DESIGNING
```

The next permitted state is:

```text
IMPLEMENTING
```

The transition remains blocked until the required Technical Design, Domain, Contracts, Persistence, Testing and Completion documents are approved.

---

# 3. Architectural Context

The module implements the authority model defined by:

* Architecture Amendment V3.0-001;
* ADR-004;
* ADR-008;
* ADR-009;
* ADR-013.

The governing topology is:

```text
NAS
└── KnowledgeOS Server
    └── Master Library
        ├── Master Catalog
        ├── Source Publications
        ├── Master Metadata
        └── Publication Versions

                    │
                    │ Browse + Acquire
                    ▼

KnowledgeOS Client
└── Selective Local Library
    ├── Locally acquired publications
    ├── Local acquisition state
    ├── Local integrity state
    └── Offline local availability
```

---

# 4. Core Principle

> The NAS Master Library is authoritative for the Master Catalog and source publications, while every device independently maintains a Selective Local Library containing only the publications acquired for that device.

---

# 5. Module Authority

The module is authoritative for implementation decisions concerning:

* Master Library initialization;
* Master Catalog persistence;
* source publication storage;
* source publication versioning;
* server-side catalog access;
* publication acquisition;
* client-side local installation;
* local acquisition state;
* server availability;
* catalog availability;
* source integrity;
* local publication integrity.

The module is not authoritative for:

* annotations;
* reading progress;
* personal tags;
* personal relationships;
* personal metadata;
* CloudKit synchronization;
* full document rendering;
* UDM processing;
* DPM processing;
* AI processing;
* Plugin execution.

---

# 6. Privacy Boundary

The Master Library Module shall not send personal state to the NAS.

Prohibited server-bound information includes:

* annotation content;
* reading progress;
* personal favorites;
* personal tags;
* personal notes;
* personal relationships;
* personal search history;
* personal synchronization metadata.

The module may send only data required for:

* authentication;
* authorization;
* catalog queries;
* publication acquisition;
* transfer integrity;
* operational diagnostics.

---

# 7. Server Boundary

KnowledgeOS Server is the only application component permitted to access Master Library storage directly.

Clients shall never:

* mount the Master Library as application storage;
* access catalog database files directly;
* receive raw NAS paths;
* receive NAS credentials;
* modify source publication files directly;
* write personal state into the Master Library.

---

# 8. Local Library Boundary

Each device has its own Selective Local Library.

A Selective Local Library:

* contains only publications acquired for that device;
* may differ from the Libraries of other devices;
* remains usable while the NAS is offline;
* stores local acquisition and integrity state;
* is not a replica of the NAS Master Library;
* does not automatically contain the complete Master Catalog payload.

A client may retain a derived catalog snapshot for offline browsing.

That snapshot is not authoritative.

---

# 9. Module Objectives

The module shall deliver the following capabilities:

1. run KnowledgeOS Server on the NAS;
2. initialize a Master Library;
3. reopen an existing Master Library;
4. validate its structure and format;
5. register source publications;
6. maintain stable publication identity;
7. maintain source publication versions;
8. expose the Master Catalog;
9. search and paginate catalog metadata;
10. display the catalog on macOS;
11. display publication details;
12. acquire a publication;
13. validate its integrity;
14. install it atomically into the Selective Local Library;
15. preserve local availability while the NAS is offline;
16. remove local publication payloads without modifying the NAS.

---

# 10. Module Non-Objectives

The module shall not attempt to deliver:

* complete reader functionality;
* page rendering;
* annotations;
* progress tracking;
* iCloud synchronization;
* semantic search;
* full-text indexing;
* OCR;
* AI enrichment;
* automated metadata extraction beyond the minimal registration requirements;
* Plugin SDK behavior;
* public internet access;
* collaborative access;
* automatic mirroring of all publications to every device.

---

# 11. Primary User Journey

The primary user journey is:

```text
Start KnowledgeOS Client
        ↓
Connect to KnowledgeOS Server
        ↓
Browse Master Catalog
        ↓
Search or filter publications
        ↓
Open publication details
        ↓
Select Acquire
        ↓
Download source publication
        ↓
Validate checksum and size
        ↓
Install into Selective Local Library
        ↓
Disconnect from NAS
        ↓
Confirm local publication remains available
```

---

# 12. Administrative Journey

The primary administrative journey is:

```text
Start KnowledgeOS Server
        ↓
Open or initialize Master Library
        ↓
Select source publication
        ↓
Stage source file
        ↓
Validate basic source integrity
        ↓
Create or resolve PublicationId
        ↓
Create SourceVersion
        ↓
Commit source payload
        ↓
Commit Master Catalog entry
        ↓
Advance CatalogRevision
```

---

# 13. Module Documentation Structure

The module documentation is organized as:

```text
01-MasterLibrary/
├── README.md
├── ImplementationCharter.md
├── 01-Requirements/
├── 02-TechnicalDesign/
├── 03-Domain/
├── 04-Contracts/
├── 05-Persistence/
├── 06-Server/
├── 07-Client/
├── 08-Testing/
├── 09-Operations/
└── 10-Completion/
```

---

# 14. Requirements Area

`01-Requirements/` defines:

* functional requirements;
* non-functional requirements;
* use cases;
* acceptance criteria;
* edge cases;
* exclusions.

Requirements shall describe observable behavior.

---

# 15. Technical Design Area

`02-TechnicalDesign/` defines:

* selected technology stack;
* repository structure;
* runtime topology;
* package boundaries;
* deployment model;
* implementation decision records;
* dependency strategy;
* communication strategy.

---

# 16. Domain Area

`03-Domain/` defines:

* entities;
* value objects;
* identifiers;
* states;
* invariants;
* Domain errors;
* state transitions.

The Domain shall remain independent from:

* HTTP;
* database libraries;
* filesystem APIs;
* SwiftUI;
* server framework code.

---

# 17. Contracts Area

`04-Contracts/` defines:

* API conventions;
* request DTOs;
* response DTOs;
* authentication;
* authorization;
* error contracts;
* pagination;
* acquisition streaming;
* compatibility.

---

# 18. Persistence Area

`05-Persistence/` defines:

* Master Library physical layout;
* Master Catalog schema;
* source publication storage;
* source version storage;
* local Library persistence;
* migrations;
* transactions;
* integrity;
* recovery.

---

# 19. Server Area

`06-Server/` defines:

* KnowledgeOS Server architecture;
* modules;
* server configuration;
* application services;
* controllers;
* administration;
* security;
* health checks;
* startup and shutdown.

---

# 20. Client Area

`07-Client/` defines:

* client architecture;
* server registration;
* catalog browser;
* publication details;
* acquisition manager;
* Selective Local Library;
* offline state;
* user-facing errors.

The first reference client is macOS.

---

# 21. Testing Area

`08-Testing/` defines:

* test strategy;
* Domain tests;
* application tests;
* persistence integration tests;
* API integration tests;
* client tests;
* end-to-end tests;
* failure tests;
* security tests.

---

# 22. Operations Area

`09-Operations/` defines:

* NAS deployment;
* server installation;
* configuration;
* secrets;
* health checks;
* logging;
* metrics;
* backup;
* recovery;
* upgrades;
* rollback.

---

# 23. Completion Area

`10-Completion/` defines:

* module-specific Definition of Done;
* validation evidence;
* accepted limitations;
* accepted debt;
* final completion decision.

---

# 24. Module Components

The implementation is expected to contain the following conceptual components.

## 24.1 Server Components

```text
KnowledgeOS Server
├── Server Bootstrap
├── Configuration
├── Authentication
├── Authorization
├── Master Library Service
├── Master Catalog Service
├── Publication Registration Service
├── Publication Acquisition Service
├── Source Storage Repository
├── Catalog Repository
├── Health Service
└── Observability
```

## 24.2 Client Components

```text
KnowledgeOS Client
├── Server Registry
├── Server Connection
├── Catalog API Client
├── Catalog Browser
├── Publication Detail
├── Acquisition Manager
├── Local Library Repository
├── Local File Store
├── Connectivity State
└── Error Presentation
```

## 24.3 Shared Components

```text
Shared
├── Stable identifiers
├── API contracts
├── Error codes
├── Pagination contracts
├── Publication metadata contracts
├── Acquisition state contracts
└── Validation schemas
```

Shared components shall remain runtime-neutral.

---

# 25. Domain Ownership

The module owns the concrete implementation of:

* MasterLibraryId;
* PublicationId;
* SourceVersion;
* CatalogRevision;
* MasterLibraryManifest;
* MasterCatalogEntry;
* SourcePublication;
* AcquisitionOperation;
* LocalLibraryItem;
* acquisition states;
* catalog availability states;
* integrity errors.

---

# 26. Stable Identity Rules

The implementation shall preserve these identity rules:

* MasterLibraryId is independent from NAS path and hostname.
* PublicationId is independent from source file name and path.
* SourceVersion changes when the authoritative source payload changes.
* AcquisitionOperationId identifies one logical acquisition.
* Execution Attempts shall not reuse logical operation identity.
* LocalLibraryItem refers to the same PublicationId as its Master Catalog entry.

---

# 27. Catalog Rules

The Master Catalog shall:

* contain one active logical entry per PublicationId;
* preserve source version history where required;
* support pagination;
* support metadata search;
* expose availability;
* expose source size;
* expose checksum or integrity metadata required by acquisition;
* expose CatalogRevision;
* exclude personal state.

---

# 28. Source Storage Rules

Source publication storage shall:

* distinguish staging from committed storage;
* validate file existence;
* calculate source size;
* calculate checksum;
* preserve SourceVersion;
* prevent arbitrary path access;
* prevent partially committed files from becoming available;
* support integrity revalidation;
* support backup.

---

# 29. Acquisition Rules

Publication acquisition shall:

* require authenticated access;
* verify publication availability;
* identify the exact SourceVersion;
* stream content using bounded memory;
* support progress reporting;
* support cancellation;
* support safe retry;
* validate byte length;
* validate checksum;
* install atomically;
* never expose partial content as available.

---

# 30. Local Installation Rules

Local installation shall use:

```text
Temporary Download
        ↓
Transfer Complete
        ↓
Byte-Length Validation
        ↓
Checksum Validation
        ↓
Local Destination Preparation
        ↓
Atomic or Recoverable Commit
        ↓
LocalLibraryItem Update
        ↓
AVAILABLE_LOCAL
```

A failed installation shall preserve enough evidence for diagnosis and cleanup.

---

# 31. Local Removal Rules

Removing a publication from a device shall:

* remove the local publication payload;
* remove or update local acquisition state;
* preserve the Master Catalog entry;
* preserve the NAS source publication;
* preserve personal state unless a separate explicit user action requests deletion;
* remain device-specific.

---

# 32. Offline Rules

When KnowledgeOS Server is unavailable:

* acquired local publications remain available;
* local Library browsing remains available;
* new acquisition cannot complete;
* remote catalog freshness cannot be guaranteed;
* a cached catalog snapshot may be shown;
* connection state shall be visible;
* server unavailability shall not be treated as source deletion.

---

# 33. Update Rules

When a newer SourceVersion exists:

* the local item may become `UPDATE_AVAILABLE`;
* the existing local source remains usable unless invalid;
* the update shall use a new acquisition or replacement operation;
* partial replacement shall not overwrite the current valid local copy;
* successful validation precedes commit.

---

# 34. Security Boundary

The server shall enforce:

* authenticated client identity;
* authorization;
* protected administrative operations;
* path traversal prevention;
* input validation;
* content-range validation;
* bounded transfer behavior;
* secret isolation;
* audit logging for Master Library mutations.

---

# 35. Initial Network Scope

The first supported network scope is:

```text
Trusted local network
```

This scope does not eliminate security requirements.

The module shall not assume that every local-network process is trusted automatically.

---

# 36. API Boundary

The initial API shall expose only the operations required by the module.

The public client surface includes:

```text
GET /v1/health
GET /v1/server
GET /v1/library
GET /v1/catalog
GET /v1/catalog/revision
GET /v1/publications/{publicationId}
GET /v1/publications/{publicationId}/cover
GET /v1/publications/{publicationId}/content
POST /v1/acquisitions
GET /v1/acquisitions/{operationId}
DELETE /v1/acquisitions/{operationId}
```

Administrative operations shall remain separately protected.

---

# 37. Implementation Increments

The approved implementation increments are:

```text
0. Development Baseline
1. Server Health
2. Master Library Initialization
3. Publication Registration
4. Catalog Reading
5. macOS Catalog Browser
6. Publication Acquisition
7. Selective Local Library
8. Offline Availability
9. Hardening and Completion
```

Only one primary increment may be active.

---

# 38. Current Increment

The current increment is:

```text
Increment 0 — Development Baseline
```

No source-code implementation shall begin until Technical Design selects and approves the concrete stack and repository structure.

---

# 39. Technical Decisions Required

Before implementation begins, the module shall decide:

* monorepo or multi-repository structure;
* server programming language;
* server framework;
* server packaging;
* NAS deployment mechanism;
* catalog database;
* schema and migration tooling;
* API transport;
* shared contract strategy;
* macOS client technology;
* client local database;
* local file storage strategy;
* test frameworks;
* CI environment.

These decisions belong in Technical Design and IDRs.

---

# 40. High-Risk Questions

The module shall reduce the following risks early:

* Can the server run reliably on the target NAS?
* Which deployment model is supported by the NAS?
* Can large publication files be streamed efficiently?
* Can interrupted downloads resume safely?
* How will server identity be verified?
* How will devices authenticate?
* How will the client install files atomically?
* How will catalog migrations be performed?
* How will Master Library backups be created?
* How will a corrupted source publication be quarantined?

---

# 41. Completion Boundary

The Master Library Module is complete when:

* a real KnowledgeOS Server runs on the target NAS;
* a real Master Library exists;
* an authorized publication can be registered;
* a macOS client can browse the Master Catalog;
* a publication can be acquired;
* the source is validated;
* the publication is installed locally;
* the publication remains available with the NAS disconnected;
* security, tests, operations and documentation satisfy the Definitions of Done.

---

# 42. Deferred Client Platforms

The first reference implementation focuses on macOS.

iPhone and iPad may be added within this module after the shared client foundation and macOS path are validated.

The completion decision shall state explicitly whether:

* macOS-only completion is accepted;
* or all Apple device clients are required before closure.

This decision shall be resolved in Requirements and Technical Design.

---

# 43. Module Dependencies

The module may implement only the shared infrastructure required for itself.

Permitted examples:

* configuration;
* logging;
* dependency injection;
* shared identifiers;
* HTTP client;
* authentication primitives;
* test infrastructure.

The module shall not implement future reading, annotation, Sync or AI capabilities.

---

# 44. Architecture Conformance Checklist

Throughout development, verify:

```text
[ ] NAS runs KnowledgeOS Server
[ ] Server directly owns Master Library access
[ ] Master Catalog authority remains on NAS
[ ] Source publications remain authoritative on NAS
[ ] Clients browse through server contracts
[ ] Clients acquire publications through server contracts
[ ] Local Libraries remain selective
[ ] Local Libraries are not NAS replicas
[ ] Personal state is absent from server contracts
[ ] Acquisition remains separate from personal synchronization
```

---

# 45. Documentation Status

The current documentation state is:

```text
README.md                  Approved
ImplementationCharter.md   Approved for Technical Design
Requirements               Pending
Technical Design           Pending
Domain                     Pending
Contracts                  Pending
Persistence                Pending
Server                     Pending
Client                     Pending
Testing                    Pending
Operations                 Pending
Completion                 Pending
```

---

# 46. Transition to IMPLEMENTING

The module may transition from `DESIGNING` to `IMPLEMENTING` when:

```text
[ ] Requirements are approved
[ ] Acceptance criteria are approved
[ ] Technology stack is selected
[ ] Repository structure is selected
[ ] Runtime topology is selected
[ ] Domain model is approved
[ ] API contracts are approved
[ ] Persistence design is approved
[ ] Server architecture is approved
[ ] Client architecture is approved
[ ] Testing strategy is approved
[ ] Deployment model is approved
[ ] Module-specific Definition of Done is approved
[ ] Required IDRs are accepted
[ ] No architecture blocker remains
```

---

# 47. Completion Prohibitions

The module shall not be declared complete when:

* only the server exists;
* only the macOS UI exists;
* catalog browsing uses mock data;
* acquisition uses an in-memory source;
* local persistence is temporary;
* NAS deployment is untested;
* offline behavior is untested;
* security uses a development bypass;
* checksums are not validated;
* partial files may appear as available;
* personal state is sent to the NAS;
* primary tests are missing.

---

# 48. Module Invariants

The following invariants apply:

* Master Library is the only active functional module.
* It is implemented vertically.
* KnowledgeOS Server owns NAS access.
* The Master Library owns the Master Catalog and source publications.
* Local Libraries contain only locally acquired publications.
* Local Libraries are not NAS replicas.
* Personal state is excluded from the module's server boundary.
* Publication acquisition is one-way content delivery.
* Partial source files are never exposed as completed publications.
* Stable identity is independent from physical location.
* Offline local access survives NAS unavailability.
* Real integration is required for completion.
* The next module waits for formal closure.

---

# 49. Related Documents

## Implementation Governance

* `../00-Governance/README.md`
* `../00-Governance/ImplementationStrategy.md`
* `../00-Governance/ModuleDevelopmentLifecycle.md`
* `../00-Governance/DefinitionOfDone.md`

## Module

* `ImplementationCharter.md`
* `01-Requirements/README.md`
* `02-TechnicalDesign/README.md`
* `03-Domain/README.md`
* `04-Contracts/README.md`
* `05-Persistence/README.md`
* `06-Server/README.md`
* `07-Client/README.md`
* `08-Testing/README.md`
* `09-Operations/README.md`
* `10-Completion/README.md`

## Architecture

* `../../00-Architecture/08-Governance/ArchitectureFreeze-v3.0.md`
* `../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

---

# 50. Status

**Designing**

Master Library is the only active KnowledgeOS implementation module.

The module is currently defining its requirements and Technical Design.

Implementation shall begin only after all required design gates are satisfied.
