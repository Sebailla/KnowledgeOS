

# Master Library Scope

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Requirements

**Document:** Scope

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the exact implementation scope of the Master Library Module.

Its purpose is to establish:

* what the module shall deliver;
* what the module shall not deliver;
* which systems and actors participate;
* which responsibilities belong to the NAS;
* which responsibilities belong to client devices;
* which capabilities are deferred;
* which boundaries cannot be crossed.

This document is the primary scope authority for the module.

---

# 2. Module Objective

The Master Library Module shall allow a KnowledgeOS user to:

1. run KnowledgeOS Server on the NAS;
2. maintain a complete Master Catalog and source-publication collection;
3. browse the Master Catalog from a KnowledgeOS client;
4. select a publication;
5. acquire that publication onto a specific device;
6. validate and install the publication into that device's Selective Local Library;
7. continue accessing the acquired publication while the NAS is unavailable.

---

# 3. Core Scope Statement

The module covers the complete vertical flow:

```text
NAS KnowledgeOS Server
        ↓
Master Library
        ↓
Master Catalog
        ↓
Source Publication
        ↓
Client Catalog Browser
        ↓
Publication Acquisition
        ↓
Selective Local Library
        ↓
Offline Local Availability
```

The module does not cover personal-state synchronization or reading functionality beyond confirming local publication availability.

---

# 4. Product Boundary

The module is responsible for publication custody, discovery and device-specific acquisition.

It is not responsible for:

* reading comprehension;
* document presentation;
* annotations;
* user knowledge modeling;
* personal synchronization;
* AI processing;
* content transformation.

---

# 5. System Boundary

The module contains two runtime systems.

## 5.1 KnowledgeOS Server

Runs on the NAS and manages:

* Master Library identity;
* Master Library manifest;
* Master Catalog;
* source publications;
* source versions;
* master-source metadata;
* catalog search;
* publication delivery;
* server security;
* operational health.

## 5.2 KnowledgeOS Client

Runs initially on macOS and manages:

* server registration;
* server connectivity;
* catalog browsing;
* publication detail display;
* acquisition operations;
* transfer progress;
* payload validation;
* Selective Local Library;
* local publication availability;
* offline behavior.

---

# 6. External Systems

The module may interact with:

* NAS filesystem;
* local device filesystem;
* local network;
* operating-system secure credential storage;
* local databases;
* container or process runtime on the NAS;
* CI infrastructure;
* backup destination.

The module shall not require:

* public cloud infrastructure;
* iCloud;
* CloudKit;
* internet connectivity;
* third-party AI services;
* external metadata providers;
* external OCR services.

---

# 7. Actors

The module defines the following actors:

```text
Library Administrator
KnowledgeOS User
KnowledgeOS Client Device
KnowledgeOS Server Operator
Backup Operator
```

One person may perform several roles.

---

# 8. Library Administrator

The Library Administrator manages Master Library content.

The administrator may:

* initialize the Master Library;
* register publications;
* update master-source metadata;
* replace source publications;
* validate integrity;
* mark content unavailable;
* withdraw content.

The administrator shall have elevated authorization.

---

# 9. KnowledgeOS User

The KnowledgeOS User consumes the Master Catalog through a client.

The user may:

* connect to the server;
* browse the catalog;
* search;
* inspect publication details;
* acquire publications;
* remove local publications;
* access acquired publications offline.

---

# 10. KnowledgeOS Client Device

A client device:

* stores server configuration;
* stores catalog snapshot data;
* stores local acquisition state;
* stores locally acquired publication payloads;
* detects connectivity;
* validates downloads;
* exposes local availability.

A device does not receive the complete Master Library automatically.

---

# 11. KnowledgeOS Server Operator

The server operator manages:

* installation;
* configuration;
* process startup;
* process shutdown;
* upgrades;
* logs;
* health checks;
* recovery;
* secrets;
* network configuration.

---

# 12. Backup Operator

The Backup Operator manages backup and restore of:

* Master Library manifest;
* catalog persistence;
* source publications;
* source metadata;
* configuration where applicable.

Personal state is outside this module's NAS backup scope.

---

# 13. In-Scope Server Capabilities

The server scope includes:

```text
[ ] Server startup
[ ] Server shutdown
[ ] Configuration validation
[ ] Health reporting
[ ] Master Library initialization
[ ] Master Library open
[ ] Manifest validation
[ ] Catalog persistence
[ ] Publication registration
[ ] Publication metadata update
[ ] Source version replacement
[ ] Source integrity validation
[ ] Catalog listing
[ ] Catalog pagination
[ ] Catalog search
[ ] Publication detail retrieval
[ ] Cover retrieval
[ ] Publication content delivery
[ ] Acquisition authorization
[ ] Administrative authorization
[ ] Structured error responses
[ ] Structured logging
[ ] Operational metrics
```

---

# 14. In-Scope Client Capabilities

The client scope includes:

```text
[ ] Register server
[ ] Store server identity
[ ] Connect to server
[ ] Authenticate
[ ] Display connectivity state
[ ] Browse Master Catalog
[ ] Search catalog metadata
[ ] Load additional catalog pages
[ ] Display publication details
[ ] Distinguish remote-only and locally available publications
[ ] Start acquisition
[ ] Display acquisition progress
[ ] Cancel acquisition
[ ] Retry failed acquisition
[ ] Validate byte length
[ ] Validate checksum
[ ] Install publication locally
[ ] List local publications
[ ] Remove local publication
[ ] Detect source update
[ ] Remain usable offline for acquired content
```

---

# 15. In-Scope Domain Concepts

The module includes the implementation of:

* MasterLibraryId;
* MasterLibraryManifest;
* PublicationId;
* SourceVersion;
* CatalogRevision;
* MasterCatalogEntry;
* SourcePublication;
* AcquisitionOperation;
* AcquisitionAttempt;
* LocalLibraryItem;
* PublicationAvailability;
* AcquisitionState;
* LocalIntegrityState;
* Module-specific errors.

---

# 16. In-Scope Persistence

Server-side persistence includes:

* Master Library manifest;
* Master Catalog database;
* publication metadata;
* source versions;
* source checksums;
* availability state;
* catalog revision;
* administrative audit records where required.

Client-side persistence includes:

* registered server;
* trusted server identity;
* cached catalog snapshot;
* local Library items;
* acquisition operations;
* acquisition progress;
* local source version;
* local checksum;
* local storage reference;
* local integrity state.

---

# 17. In-Scope Network Operations

The module supports:

* server health request;
* server identity request;
* Master Library information request;
* catalog list request;
* catalog search request;
* catalog revision request;
* publication detail request;
* cover request;
* publication content request;
* acquisition operation management;
* administrative publication registration and update operations.

---

# 18. In-Scope Publication Formats

The first production scope shall support at least one real source-publication format.

The preferred first format is:

```text
PDF
```

Additional formats may be added within the module only when they do not delay the completion of the first real vertical.

Potential future formats include:

* EPUB;
* Markdown packages;
* HTML archives;
* image-based publications.

---

# 19. PDF Scope

For the Master Library Module, PDF support means:

* register a PDF source file;
* store its master metadata;
* expose it in the catalog;
* transfer it to the client;
* validate it;
* install it locally;
* confirm local file availability.

PDF parsing and rendering are out of scope.

---

# 20. Cover Scope

The module may support:

* administrator-supplied cover;
* embedded cover extracted during registration;
* generated placeholder cover.

Advanced visual reconstruction is outside scope.

---

# 21. Metadata Scope

Master-source metadata may include:

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
* source size;
* source checksum;
* cover reference.

Personal metadata is outside scope.

---

# 22. Catalog Search Scope

Initial search shall cover catalog metadata.

The initial searchable fields are:

* title;
* subtitle;
* authors;
* subjects;
* publisher;
* language;
* publication type;
* source format.

Full-text search within publication content is outside scope.

---

# 23. Acquisition Scope

Acquisition includes:

* selecting one publication;
* requesting the exact source version;
* streaming the source payload;
* tracking progress;
* validating size;
* validating checksum;
* committing locally;
* restoring state after client restart where required;
* reporting failure.

Automatic acquisition of the entire catalog is outside scope.

---

# 24. Acquisition Concurrency Scope

The initial implementation shall support:

* one active acquisition;
* or a small explicitly bounded number of concurrent acquisitions.

Unbounded parallel acquisition is prohibited.

The exact limit belongs in Technical Design.

---

# 25. Resume Scope

Resumable downloads are conditionally in scope.

The Technical Design shall decide between:

1. ranged resumable transfer;
2. safe restart from byte zero.

The chosen behavior shall be explicit and tested.

Unsafe partial continuation is prohibited.

---

# 26. Local Library Scope

The Selective Local Library shall expose:

* publication identity;
* title and basic metadata;
* local availability;
* source version;
* file size;
* checksum;
* acquisition date;
* local integrity status;
* local file reference managed internally.

The UI shall not expose raw local storage paths as ordinary product information.

---

# 27. Local Opening Scope

The module shall provide a minimal local-opening capability sufficient to validate acquisition.

The initial behavior may:

* open the local PDF using a placeholder or system preview;
* display source metadata;
* confirm that the local payload exists.

A complete KnowledgeOS reading experience is outside scope.

---

# 28. Offline Scope

The module's offline scope includes:

* local Library listing;
* local publication presence;
* local publication opening placeholder;
* cached catalog display where available;
* visible server-disconnected state;
* preservation of local content;
* recovery after reconnection.

Offline catalog mutation is outside scope.

---

# 29. Administration Scope

Initial publication administration may be delivered through:

* protected HTTP administration API;
* server CLI;
* dedicated administrative tool;
* combination of these.

The concrete interface belongs in Technical Design.

A polished general-user administration UI is not required for initial completion.

---

# 30. Authentication Scope

The module shall support authenticated device access.

The initial authentication scope includes:

* device registration;
* server trust establishment;
* client credential;
* acquisition authorization;
* administrative authorization separation.

Public-account registration is outside scope.

---

# 31. Authorization Scope

Authorization shall distinguish at least:

```text
Reader
Administrator
```

A Reader may:

* browse;
* inspect;
* acquire.

An Administrator may additionally:

* initialize;
* register;
* update;
* replace;
* withdraw;
* validate.

---

# 32. Transport Scope

The first supported transport is:

```text
HTTP or HTTPS over the local network
```

The final decision belongs in Technical Design.

Public internet exposure is outside scope.

---

# 33. Server Discovery Scope

Automatic local-network discovery may be included if it does not delay the primary vertical.

Manual server registration is sufficient for the first complete implementation.

The client shall not depend exclusively on automatic discovery.

---

# 34. Deployment Scope

The server shall support one approved NAS deployment model.

Possible models include:

* Docker-compatible container;
* OCI container;
* native executable;
* vendor application package.

The target model shall be selected based on the actual NAS environment.

Supporting every NAS vendor is outside scope.

---

# 35. Reference NAS Scope

The module shall define one reference NAS deployment target.

Completion requires:

* successful installation;
* persistent storage;
* network availability;
* process restart;
* health validation;
* publication acquisition;
* backup documentation.

---

# 36. Backup Scope

The module shall define backup of:

* manifest;
* catalog database;
* source files;
* source metadata;
* catalog revision;
* publication version metadata.

The module does not back up:

* annotations;
* reading progress;
* personal relationships;
* CloudKit records;
* device-local personal state.

---

# 37. Restore Scope

Restore shall cover:

* complete Master Library restore;
* manifest validation;
* catalog reopen;
* source-file availability;
* catalog-source integrity validation.

Granular publication-level restore may be deferred.

---

# 38. Observability Scope

The module shall provide:

* server startup logs;
* server health;
* Master Library open logs;
* catalog-query diagnostics;
* publication-registration diagnostics;
* acquisition diagnostics;
* integrity-failure diagnostics;
* authorization-failure diagnostics.

Distributed tracing infrastructure is optional for this module.

---

# 39. Performance Scope

The module shall measure:

* startup time;
* catalog query latency;
* publication detail latency;
* time to first content byte;
* download throughput;
* checksum duration;
* installation duration;
* memory during transfer.

Large-scale multi-user load testing is outside scope.

---

# 40. Reliability Scope

The module shall handle:

* server restart;
* client restart;
* NAS temporary unavailability;
* local-network interruption;
* interrupted acquisition;
* missing source file;
* corrupted source file;
* checksum mismatch;
* insufficient device storage;
* duplicate acquisition request.

---

# 41. Data Integrity Scope

The module shall preserve consistency among:

```text
Master Catalog Entry
PublicationId
SourceVersion
Source File
Byte Length
Checksum
Availability
```

It shall also preserve consistency among:

```text
LocalLibraryItem
PublicationId
Installed SourceVersion
Local File
Byte Length
Checksum
Local Availability
```

---

# 42. Privacy Scope

The module shall prevent personal state from entering:

* server requests;
* server persistence;
* server logs;
* server metrics;
* NAS backups;
* acquisition metadata beyond operational need.

---

# 43. Security Scope

The module shall protect against:

* unauthorized catalog access;
* unauthorized acquisition;
* unauthorized administration;
* path traversal;
* arbitrary filesystem reads;
* malicious file names;
* invalid ranges;
* oversized requests;
* credential leakage;
* server impersonation where practical;
* corrupted publication payloads.

---

# 44. Accessibility Scope

The reference macOS client shall support:

* keyboard navigation;
* accessible control labels;
* progress announcements where practical;
* state distinction beyond color;
* readable error messages;
* system text scaling behavior where supported.

Full formal accessibility certification is outside scope.

---

# 45. Localization Scope

The first implementation may use one interface language.

Text shall be structured to allow later localization.

Full multilingual UI support is outside scope.

Publication metadata may contain multiple languages.

---

# 46. Out-of-Scope Functional Capabilities

The following are explicitly outside scope:

```text
[ ] Annotation creation
[ ] Reading progress tracking
[ ] Personal tags
[ ] Personal favorites
[ ] Personal relationships
[ ] iCloud synchronization
[ ] CloudKit integration
[ ] Reader engine
[ ] Page rendering
[ ] UDM generation
[ ] DPM generation
[ ] OCR
[ ] AI metadata generation
[ ] Semantic search
[ ] Full-text publication search
[ ] Export
[ ] Plugins
[ ] Collaboration
[ ] Multi-user accounts
[ ] Public internet server
[ ] Cloud-hosted Master Library
```

---

# 47. Out-of-Scope Architectural Changes

The module shall not redefine:

* Master Library authority;
* personal-state privacy boundary;
* Selective Local Library semantics;
* iCloud synchronization architecture;
* UDM;
* DPM;
* Engine responsibilities;
* Plugin architecture.

---

# 48. Out-of-Scope Client Behavior

The module shall not automatically:

* download all catalog publications;
* keep every device Library identical;
* synchronize local publication files through iCloud;
* delete local content when the NAS entry changes;
* upload personal data to the NAS;
* expose source files as editable NAS content.

---

# 49. Out-of-Scope Server Behavior

The server shall not:

* accept annotations;
* accept progress;
* accept personal tags;
* act as a personal-state Sync Server;
* expose a generic NAS file-browser API;
* expose arbitrary directories;
* execute document AI processing;
* render publications.

---

# 50. Scope Assumptions

The module assumes:

* one primary user or trusted household environment initially;
* a controlled local network;
* a NAS capable of running the selected server deployment;
* sufficient NAS storage;
* Apple client development capability;
* source publications are legally controlled by the user;
* the client can allocate local storage for acquisitions.

---

# 51. Scope Constraints

The module is constrained by:

* single-developer implementation;
* low initial budget;
* offline-first client behavior;
* privacy requirements;
* NAS operational limitations;
* Apple platform lifecycle;
* bounded local storage;
* Architecture V3.

---

# 52. Completion Platform Scope

The minimum completion platform is:

```text
KnowledgeOS Server on reference NAS
+
KnowledgeOS macOS client
```

iPhone and iPad are not required for the first Master Library completion unless later approved requirements explicitly add them.

The server and shared contracts shall not prevent future iPhone and iPad clients.

---

# 53. Completion Format Scope

The minimum publication format required for completion is:

```text
PDF
```

The module may close with PDF-only source support if all other required capabilities are complete.

---

# 54. Completion Catalog Scope

The module shall support a real catalog containing more than one publication.

The minimum acceptance dataset shall include:

* at least 20 catalog entries;
* multiple authors;
* multiple subjects;
* multiple file sizes;
* at least one unavailable publication;
* at least one source-version update.

Larger benchmark datasets shall be defined in Testing.

---

# 55. Completion Acquisition Scope

Module completion requires successful acquisition of:

* a small publication;
* a representative medium publication;
* a large publication defined by the test strategy;
* an updated SourceVersion.

The exact file-size thresholds belong in Technical Design and Testing.

---

# 56. Completion Failure Scope

Module completion requires tested behavior for:

* server unavailable;
* authentication rejected;
* source unavailable;
* network interrupted;
* checksum mismatch;
* insufficient local storage;
* client restart;
* server restart;
* local file missing.

---

# 57. Scope Change Control

A proposed change is evaluated as:

```text
Clarification
Compatible Extension
Scope Expansion
Cross-Module Change
Architectural Change
```

Scope Expansion requires updates to:

* this document;
* UseCases;
* AcceptanceCriteria;
* Testing;
* Definition of Done.

---

# 58. Scope Freeze

The module scope becomes provisionally frozen when the Requirements area is approved.

After transition to `VALIDATING`, no capability expansion is allowed.

Only:

* defects;
* hardening;
* completion requirements;
* approved critical corrections;

may proceed.

---

# 59. Scope Completion Gate

Scope is ready for implementation when:

```text
[ ] Server boundary is explicit
[ ] Client boundary is explicit
[ ] Actors are explicit
[ ] In-scope capabilities are explicit
[ ] Out-of-scope capabilities are explicit
[ ] Minimum client platform is explicit
[ ] Minimum publication format is explicit
[ ] Security scope is explicit
[ ] Privacy scope is explicit
[ ] Offline scope is explicit
[ ] Deployment scope is explicit
[ ] Backup scope is explicit
[ ] Completion boundary is explicit
[ ] No architecture conflict remains
```

---

# 60. Scope Invariants

The following invariants apply:

* The NAS runs KnowledgeOS Server.
* The Master Library contains the complete catalog and source publications.
* Clients use server contracts.
* Clients do not access NAS files directly.
* Device Libraries are selective.
* Device Libraries are not NAS replicas.
* Publication acquisition is explicit and device-specific.
* Personal state is outside this module.
* PDF is the minimum supported source format.
* macOS is the minimum reference client.
* Acquired publications remain available offline.
* Primary completion requires real NAS deployment.

---

# 61. Prohibited Scope Interpretations

This scope shall never be interpreted to mean:

* every device mirrors the NAS;
* the NAS stores annotations or progress;
* the catalog snapshot is authoritative;
* the client may browse the NAS filesystem;
* publication identity equals file path;
* download completion alone means successful acquisition;
* offline mode requires the NAS;
* iCloud is part of the Master Library Module;
* full reading functionality is part of this module.

---

# 62. Related Documents

## Requirements

* `README.md`
* `UseCases.md`
* `AcceptanceCriteria.md`

## Module

* `../README.md`
* `../ImplementationCharter.md`

## Governance

* `../../00-Governance/README.md`
* `../../00-Governance/ImplementationStrategy.md`
* `../../00-Governance/ModuleDevelopmentLifecycle.md`
* `../../00-Governance/DefinitionOfDone.md`

## Architecture

* `../../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

---

# 63. Status

**Approved**

The Master Library Module scope is limited to NAS-hosted master publication management, Master Catalog access, device-specific publication acquisition, Selective Local Library installation and offline local availability.

Personal-state synchronization, reading functionality, annotations, UDM, DPM, AI and Plugins remain outside the module.
