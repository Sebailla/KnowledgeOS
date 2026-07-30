
# Master Library Module — Implementation Charter

**Project:** KnowledgeOS

**Implementation Phase:** Module 01

**Module:** Master Library

**Version:** 1.0

**Status:** Approved for Technical Design

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

The Master Library Module provides the authoritative catalog and source-publication service of KnowledgeOS.

It runs through KnowledgeOS Server on the NAS and allows authorized KnowledgeOS clients to:

* discover the server;
* connect securely;
* browse the Master Catalog;
* inspect publication metadata;
* search and filter publications;
* acquire selected publications;
* verify downloaded content;
* materialize publications inside a Selective Local Library.

The module establishes the first complete vertical slice of KnowledgeOS.

---

# 2. Architectural Position

```text
NAS
└── KnowledgeOS Server
    └── Master Library Module
        ├── Master Catalog
        ├── Source Publications
        ├── Publication Metadata
        ├── Catalog Search
        ├── Acquisition Service
        └── Integrity Validation

                    │
                    │ Local network API
                    ▼

KnowledgeOS Client
└── Selective Local Library
    ├── Catalog Browser
    ├── Publication Details
    ├── Download Manager
    └── Acquired Publications
```

---

# 3. Core Principle

> The Master Library owns the authoritative catalog and source publications, while each device independently decides which publications to acquire locally.

---

# 4. Authority Model

The Master Library is authoritative for:

* Master Catalog entries;
* publication identity;
* source publication files;
* source-file versions;
* source-file checksums;
* source metadata;
* catalog availability;
* acquisition eligibility.

The Master Library is not authoritative for:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal metadata;
* local reading preferences;
* iCloud synchronization state.

Personal state shall never be uploaded through this module.

---

# 5. Module Boundaries

## 5.1 In Scope

The first module includes:

* KnowledgeOS Server process on the NAS;
* Master Library initialization;
* Master Library manifest;
* catalog persistence;
* publication registration;
* publication source-file storage;
* publication metadata;
* publication listing;
* catalog search;
* publication detail retrieval;
* publication acquisition;
* resumable download where supported;
* checksum validation;
* client-side local materialization;
* client-side acquisition state;
* server health endpoint;
* local-network authentication baseline;
* logs, metrics and errors;
* unit, integration and end-to-end tests;
* technical documentation.

## 5.2 Out of Scope

The first module does not include:

* PDF, EPUB or document conversion;
* UDM generation;
* DPM generation;
* document rendering;
* annotations;
* reading progress;
* personal metadata synchronization;
* CloudKit;
* full-text search inside publication content;
* AI processing;
* OCR processing;
* Plugins;
* multi-user collaboration;
* public internet exposure;
* remote cloud access;
* automatic publication distribution to every device.

---

# 6. Principal Components

## 6.1 KnowledgeOS Server

A persistent server application running on the NAS.

Responsibilities:

* own Master Library access;
* expose the local API;
* validate Master Library structure;
* query the Master Catalog;
* deliver source publications;
* enforce authentication and authorization;
* prevent path traversal;
* validate source-file integrity;
* report health and availability.

## 6.2 Master Catalog

The authoritative publication catalog.

It contains one entry per publication and exposes metadata without requiring clients to download publication files.

## 6.3 Source Publication Store

The storage area containing original publication files.

Examples:

* PDF;
* EPUB;
* Markdown package;
* future supported source formats.

## 6.4 Acquisition Service

The server-side capability that delivers an authorized publication payload to a client.

## 6.5 Catalog Client

The client-side component used by macOS, iPhone and iPad to browse the Master Catalog.

## 6.6 Acquisition Client

The client-side component that:

* requests a publication;
* downloads it;
* validates it;
* installs it into the Selective Local Library;
* reports progress and failures.

## 6.7 Selective Local Library

The device-local storage containing only publications acquired by that device.

It is not a NAS replica.

---

# 7. Domain Model

## 7.1 MasterLibrary

Represents the complete NAS-hosted Master Library.

```text
MasterLibrary
├── libraryId
├── name
├── formatVersion
├── createdAt
├── updatedAt
├── catalogRevision
├── publicationCount
└── status
```

## 7.2 MasterLibraryId

A stable logical identifier for the Master Library.

It shall not depend on:

* NAS hostname;
* mount path;
* IP address;
* folder path.

## 7.3 MasterLibraryManifest

Describes the Master Library structure and compatibility.

```text
MasterLibraryManifest
├── libraryId
├── formatVersion
├── minimumServerVersion
├── createdAt
├── catalogRevision
├── sourceStoreVersion
└── integrityInformation
```

## 7.4 PublicationId

Stable logical identity of a publication.

Publication identity shall remain independent from:

* file name;
* storage path;
* current source version;
* device-local location.

## 7.5 MasterCatalogEntry

Represents one publication visible in the Master Catalog.

```text
MasterCatalogEntry
├── publicationId
├── title
├── subtitle
├── authors
├── contributors
├── publicationType
├── sourceFormat
├── language
├── description
├── coverReference
├── subjects
├── publisher
├── publicationDate
├── sourceVersion
├── sourceSize
├── sourceChecksum
├── availability
├── createdAt
└── updatedAt
```

## 7.6 SourcePublication

Represents one authoritative publication payload.

```text
SourcePublication
├── publicationId
├── sourceVersion
├── format
├── storageReference
├── byteLength
├── checksum
├── mediaType
└── availability
```

## 7.7 SourceVersion

Identifies a meaningful version of the source publication payload.

A new source file shall create a new SourceVersion.

## 7.8 CatalogRevision

A monotonically increasing or otherwise orderable catalog revision used to detect catalog changes.

## 7.9 LocalLibraryItem

Represents a publication acquired by one device.

```text
LocalLibraryItem
├── publicationId
├── sourceVersion
├── localStorageReference
├── acquisitionState
├── acquiredAt
├── validatedAt
├── byteLength
└── checksum
```

## 7.10 AcquisitionOperation

Represents one logical acquisition of a publication.

```text
AcquisitionOperation
├── operationId
├── publicationId
├── requestedVersion
├── state
├── bytesReceived
├── totalBytes
├── startedAt
├── updatedAt
└── failure
```

---

# 8. Publication States

## 8.1 Master Catalog Availability

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

### AVAILABLE

The publication can be acquired.

### UNAVAILABLE

The catalog entry exists but the source payload is temporarily unavailable.

### WITHDRAWN

The publication remains historically identifiable but shall not be acquired.

### CORRUPTED

The source payload failed integrity validation.

---

# 9. Local Acquisition States

```text
CATALOG_ONLY
QUEUED
DOWNLOADING
PAUSED
VALIDATING
INSTALLING
AVAILABLE_LOCAL
UPDATE_AVAILABLE
FAILED
REMOVING
```

## 9.1 CATALOG_ONLY

The publication is visible in the Master Catalog but not present locally.

## 9.2 QUEUED

The acquisition has been accepted and awaits execution.

## 9.3 DOWNLOADING

The publication payload is being transferred.

## 9.4 PAUSED

The transfer is suspended with resumable state where supported.

## 9.5 VALIDATING

The client is validating size, checksum and identity.

## 9.6 INSTALLING

The validated payload is being committed into the Selective Local Library.

## 9.7 AVAILABLE_LOCAL

The publication is available for offline local use.

## 9.8 UPDATE_AVAILABLE

The Master Catalog exposes a newer SourceVersion.

## 9.9 FAILED

The acquisition could not complete.

## 9.10 REMOVING

The local publication is being removed from the device.

Removal does not affect the NAS Master Library.

---

# 10. Server Use Cases

## UC-S01 — Initialize Master Library

Creates a new Master Library structure on the NAS.

Preconditions:

* target directory exists or can be created;
* no existing valid Master Library occupies the target;
* sufficient permissions exist.

Result:

* manifest created;
* catalog initialized;
* source store initialized;
* stable Library identity generated.

## UC-S02 — Open Master Library

Loads and validates an existing Master Library.

## UC-S03 — Validate Master Library

Validates:

* manifest;
* format version;
* catalog database;
* source store;
* permissions;
* required directories.

## UC-S04 — Register Publication

Registers an original source publication in the Master Catalog.

## UC-S05 — Update Publication Metadata

Updates master-source metadata without changing personal state.

## UC-S06 — Replace Publication Source

Creates a new SourceVersion while preserving PublicationId.

## UC-S07 — List Catalog Entries

Returns a paginated catalog view.

## UC-S08 — Search Master Catalog

Searches catalog metadata.

Initial supported fields:

* title;
* author;
* subject;
* publication type;
* source format;
* language.

## UC-S09 — Get Publication Details

Returns complete catalog metadata for one PublicationId.

## UC-S10 — Acquire Publication

Streams the requested publication payload.

## UC-S11 — Validate Source Integrity

Verifies checksum and source-file availability.

## UC-S12 — Get Catalog Revision

Returns the current Master Catalog revision.

## UC-S13 — Get Server Health

Returns server and Master Library availability.

---

# 11. Client Use Cases

## UC-C01 — Register NAS Server

Registers a KnowledgeOS Server endpoint on the device.

## UC-C02 — Connect to Server

Authenticates and retrieves server capabilities.

## UC-C03 — Browse Master Catalog

Displays catalog entries without downloading source publications.

## UC-C04 — Search Master Catalog

Searches and filters the remote catalog.

## UC-C05 — View Publication Details

Displays publication metadata, availability and local state.

## UC-C06 — Acquire Publication

Downloads and installs a selected publication.

## UC-C07 — Resume Acquisition

Continues a previously interrupted acquisition where supported.

## UC-C08 — Cancel Acquisition

Cancels a queued or active acquisition.

## UC-C09 — Retry Failed Acquisition

Starts a new Attempt for the same logical AcquisitionOperation.

## UC-C10 — Remove Local Publication

Removes the publication payload from the local device.

It shall not remove:

* the Master Catalog entry;
* the NAS source publication;
* personal state unless explicitly requested separately.

## UC-C11 — Detect Publication Update

Compares local SourceVersion with the Master Catalog SourceVersion.

## UC-C12 — Update Local Publication

Acquires and installs a newer source version.

---

# 12. API Surface

The initial local-network API should expose:

```text
GET    /v1/health
GET    /v1/server
GET    /v1/library
GET    /v1/catalog
GET    /v1/catalog/revision
GET    /v1/publications/{publicationId}
GET    /v1/publications/{publicationId}/cover
GET    /v1/publications/{publicationId}/content
POST   /v1/acquisitions
GET    /v1/acquisitions/{operationId}
DELETE /v1/acquisitions/{operationId}
```

Administrative operations shall use a separately authorized surface.

Possible initial administration endpoints:

```text
POST   /v1/admin/publications
PATCH  /v1/admin/publications/{publicationId}
POST   /v1/admin/publications/{publicationId}/source
POST   /v1/admin/library/validate
```

---

# 13. API Rules

The API shall:

* use stable identifiers;
* use explicit versioning;
* return structured errors;
* support pagination;
* support conditional requests where useful;
* support ranged content transfer where available;
* never expose raw NAS file paths;
* never accept arbitrary client-controlled filesystem paths;
* never return NAS credentials;
* never expose personal state endpoints.

---

# 14. Storage Layout

The conceptual Master Library structure is:

```text
MasterLibrary/
├── manifest.json
├── catalog/
│   └── catalog.db
├── publications/
│   └── <publication-id>/
│       └── <source-version>/
│           ├── source
│           └── metadata.json
├── covers/
├── staging/
├── quarantine/
├── logs/
└── backups/
```

The physical implementation may evolve, but the following distinctions shall remain:

* catalog state;
* publication source storage;
* temporary staging;
* quarantined invalid content;
* logs;
* backups.

---

# 15. Catalog Persistence

The catalog database shall support:

* stable PublicationId;
* metadata queries;
* pagination;
* catalog revision;
* source version history;
* availability state;
* transactional registration;
* integrity information.

The catalog database shall not store personal reading state.

---

# 16. Publication Registration Flow

```text
Select Source File
        ↓
Create Staging Copy
        ↓
Detect Format and Media Type
        ↓
Calculate Size and Checksum
        ↓
Validate Basic Source Integrity
        ↓
Create or Resolve PublicationId
        ↓
Create SourceVersion
        ↓
Commit Source Payload
        ↓
Commit Catalog Entry
        ↓
Advance CatalogRevision
```

No catalog entry shall become `AVAILABLE` before its source payload is durably committed.

---

# 17. Acquisition Flow

```text
Browse Master Catalog
        ↓
Select Publication
        ↓
Create AcquisitionOperation
        ↓
Request Source Metadata
        ↓
Reserve Local Staging Space
        ↓
Download Payload
        ↓
Validate Length
        ↓
Validate Checksum
        ↓
Commit to Local Library
        ↓
Mark AVAILABLE_LOCAL
```

---

# 18. Atomic Local Installation

The client shall never expose a partially downloaded publication as available.

Installation shall use:

1. staging destination;
2. transfer completion;
3. integrity validation;
4. atomic or recoverable commit;
5. acquisition-state update.

---

# 19. Failure Model

Required server errors include:

```text
MASTER_LIBRARY_NOT_FOUND
MASTER_LIBRARY_INVALID
MASTER_LIBRARY_VERSION_UNSUPPORTED
CATALOG_UNAVAILABLE
PUBLICATION_NOT_FOUND
PUBLICATION_UNAVAILABLE
PUBLICATION_WITHDRAWN
SOURCE_FILE_MISSING
SOURCE_INTEGRITY_FAILURE
INSUFFICIENT_PERMISSION
AUTHENTICATION_REQUIRED
AUTHORIZATION_DENIED
RANGE_NOT_SATISFIABLE
SERVER_STORAGE_UNAVAILABLE
```

Required client errors include:

```text
SERVER_UNREACHABLE
SERVER_IDENTITY_CHANGED
DOWNLOAD_INTERRUPTED
INSUFFICIENT_LOCAL_STORAGE
LOCAL_STORAGE_UNAVAILABLE
CHECKSUM_MISMATCH
INSTALLATION_FAILED
ACQUISITION_CANCELLED
SOURCE_VERSION_CHANGED
LOCAL_PUBLICATION_CORRUPTED
```

---

# 20. Security Baseline

The first implementation shall include:

* authenticated client registration;
* encrypted transport where supported;
* server identity verification;
* authorization for acquisition;
* separate administrative authority;
* path traversal protection;
* content-length validation;
* checksum validation;
* bounded request sizes;
* rate limiting where appropriate;
* secret isolation;
* audit logging for administrative mutations.

The server shall not expose the NAS filesystem as a generic file browser.

---

# 21. Privacy Rules

The Master Library Module shall not receive:

* annotation content;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes;
* personal search history;
* CloudKit state.

Client requests may include only the information required for:

* authentication;
* catalog access;
* acquisition;
* integrity;
* operational diagnostics.

---

# 22. Offline Behavior

When the NAS server is unavailable:

* the Selective Local Library remains usable;
* locally acquired publications remain accessible;
* the Master Catalog view may display its last locally cached snapshot;
* new acquisitions are unavailable;
* existing local content shall not be marked invalid;
* personal state remains local and may synchronize through iCloud independently.

---

# 23. Catalog Snapshot

A client may keep a local catalog snapshot to support offline browsing.

The catalog snapshot:

* is derived state;
* may be stale;
* is not the Master Catalog authority;
* shall expose its last refresh time;
* may be replaced safely.

---

# 24. Observability

The server shall emit structured logs for:

* startup;
* Master Library validation;
* catalog queries;
* publication registration;
* source integrity failures;
* acquisition start and completion;
* authorization failures;
* server storage failures.

Metrics should include:

* catalog query latency;
* acquisition count;
* acquisition bytes;
* acquisition failures;
* active transfers;
* unavailable publications;
* integrity failures;
* server storage availability.

Personal reading information shall not enter telemetry.

---

# 25. Testing Strategy

## 25.1 Domain Tests

Test:

* PublicationId stability;
* SourceVersion rules;
* catalog entry invariants;
* availability transitions;
* acquisition-state transitions.

## 25.2 Server Unit Tests

Test:

* commands;
* queries;
* validation;
* authorization;
* error translation;
* checksum verification.

## 25.3 Storage Integration Tests

Test:

* Master Library initialization;
* catalog transactions;
* source-file commit;
* source-file replacement;
* staging cleanup;
* permission failures;
* missing source files;
* corrupted source files.

## 25.4 API Integration Tests

Test:

* health;
* catalog pagination;
* search;
* publication details;
* content download;
* range requests;
* authorization;
* structured errors.

## 25.5 Client Integration Tests

Test:

* server registration;
* catalog refresh;
* download;
* interruption;
* retry;
* checksum mismatch;
* atomic installation;
* removal;
* update detection.

## 25.6 End-to-End Tests

Required E2E flows:

1. initialize Master Library;
2. register a publication;
3. connect from client;
4. browse catalog;
5. acquire publication;
6. validate local availability;
7. disconnect NAS;
8. open local publication;
9. reconnect;
10. detect catalog/source update.

---

# 26. First Vertical Slice

The first executable vertical is:

```text
Initialize Master Library
        ↓
Register One Publication
        ↓
Start KnowledgeOS Server
        ↓
Connect macOS Client
        ↓
Display Master Catalog
        ↓
Acquire Publication
        ↓
Store in Selective Local Library
        ↓
Open Local Publication Placeholder
```

The initial publication viewer may display only:

* title;
* cover;
* source metadata;
* local file presence.

Full Render functionality belongs to a later module.

---

# 27. Implementation Milestones

## Milestone 1 — Server Foundation

* server process;
* configuration;
* health endpoint;
* Master Library manifest;
* Library validation.

## Milestone 2 — Catalog Foundation

* catalog schema;
* publication registration;
* list and detail queries;
* catalog revision.

## Milestone 3 — Source Storage

* source-file staging;
* checksums;
* versioning;
* source commit;
* integrity validation.

## Milestone 4 — Client Catalog

* server registration;
* connectivity state;
* catalog list;
* search;
* publication detail.

## Milestone 5 — Acquisition

* operation creation;
* download;
* progress;
* validation;
* local installation;
* retry and cancellation.

## Milestone 6 — Offline Local Library

* local publication listing;
* local availability;
* NAS-disconnected behavior;
* local removal;
* update detection.

## Milestone 7 — Hardening

* security;
* observability;
* performance;
* failure tests;
* E2E tests;
* documentation.

---

# 28. Module Definition of Done

The Master Library Module is complete only when:

```text
[ ] KnowledgeOS Server runs reliably on the target NAS environment
[ ] Master Library can be initialized and reopened
[ ] Master Library manifest is versioned and validated
[ ] Publication registration is transactional
[ ] Master Catalog supports pagination and search
[ ] Publication identity is stable
[ ] Source files have versions and checksums
[ ] Source files are never exposed through raw NAS paths
[ ] macOS client can register and authenticate with the server
[ ] macOS client can browse the Master Catalog
[ ] macOS client can search catalog metadata
[ ] macOS client can view publication details
[ ] macOS client can acquire a publication
[ ] Download progress is visible
[ ] Interrupted downloads fail or resume safely
[ ] Checksums are validated
[ ] Partially downloaded publications are never exposed as available
[ ] Acquired publication is installed into the Selective Local Library
[ ] Local publication remains available while NAS is offline
[ ] Removing local content does not delete NAS content
[ ] No personal state is uploaded to the NAS
[ ] Domain tests pass
[ ] Server tests pass
[ ] API tests pass
[ ] Storage integration tests pass
[ ] Client integration tests pass
[ ] End-to-end vertical test passes
[ ] Logs and metrics are implemented
[ ] Security review is complete
[ ] No critical TODO remains
[ ] Technical documentation is complete
```

---

# 29. Completion Rule

No subsequent KnowledgeOS module shall begin until the Master Library Module satisfies its Definition of Done.

Permitted exceptions are limited to shared infrastructure strictly required to finish this vertical.

---

# 30. Status

**Approved for Technical Design**

The next activity is to define the concrete technical architecture, repository layout, runtime technologies, database, NAS deployment model and client implementation strategy for this module.
