
# Implementation Strategy

**Project:** KnowledgeOS

**Section:** Implementation

**Layer:** Governance

**Document:** Implementation Strategy

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation strategy for KnowledgeOS.

The strategy translates the Frozen Architecture V3 baseline into a controlled sequence of working software increments.

Its purpose is to ensure that KnowledgeOS progresses through:

* completed capabilities;
* validated technical decisions;
* real full-stack integration;
* explicit testing;
* operational readiness;
* limited work in progress.

The strategy exists to prevent fragmented development across many incomplete modules.

---

# 2. Scope

This document governs:

* module sequencing;
* vertical implementation;
* increment planning;
* technical-risk reduction;
* dependency introduction;
* shared infrastructure;
* client-server integration;
* test execution;
* operational validation;
* completion sequencing.

This strategy applies to:

* KnowledgeOS Server on NAS;
* macOS client;
* iPhone client;
* iPad client;
* shared contracts;
* local persistence;
* Master Library persistence;
* APIs;
* deployment;
* testing infrastructure.

---

# 3. Core Strategy

KnowledgeOS shall be implemented using:

> One active module, developed through complete vertical increments, until full-stack completion.

The strategy rejects:

* layer-first development;
* parallel functional-module development;
* speculative platform construction;
* premature abstraction;
* infrastructure without immediate module need.

---

# 4. Active Module

The current active module is:

```text
01-MasterLibrary
```

Its implementation state is:

```text
DESIGNING
```

No other functional module is authorized.

---

# 5. Vertical Development Model

Each vertical increment shall deliver a coherent capability across as many implementation layers as necessary.

```text
User Need
    ↓
Client Interaction
    ↓
API Contract
    ↓
Application Use Case
    ↓
Domain Rules
    ↓
Persistence or External Integration
    ↓
Response
    ↓
Tests
    ↓
Observability
```

An increment is not considered complete when only one layer exists.

---

# 6. Layer-First Development Prohibition

KnowledgeOS shall not implement:

* all Domain models first;
* all server endpoints first;
* all persistence first;
* all UI screens first;
* all shared infrastructure first.

A layer may advance slightly ahead when technically necessary.

It shall reconnect to a working vertical as soon as possible.

---

# 7. First User Value

The first meaningful user value is:

> A user can browse the Master Catalog from macOS, select one publication, download it from KnowledgeOS Server on the NAS and keep it available in the Selective Local Library while offline.

Every early implementation decision shall support this objective.

---

# 8. First End-to-End Path

The first end-to-end path is:

```text
Start KnowledgeOS Server
        ↓
Open Master Library
        ↓
Read Master Catalog
        ↓
Connect macOS Client
        ↓
List Catalog Entries
        ↓
Select Publication
        ↓
Acquire Publication
        ↓
Validate Publication
        ↓
Install into Selective Local Library
        ↓
Disconnect NAS
        ↓
Confirm Local Availability
```

---

# 9. Implementation Horizons

Work shall be planned using three horizons.

## 9.1 Current Increment

The smallest active vertical capability.

Only current-increment work is actively implemented.

## 9.2 Current Module

The complete Master Library capability.

Design may consider the complete module to avoid local contradictions.

## 9.3 Future Modules

Future modules may influence stable boundaries only where Architecture V3 already requires them.

They shall not receive detailed implementation design.

---

# 10. Work-in-Progress Limit

The implementation work-in-progress limit is:

```text
1 functional module
1 primary vertical increment
```

Small supporting tasks may execute in parallel only when they directly unblock the primary increment.

---

# 11. Increment Strategy

Master Library shall be implemented through the following increments:

1. Development Baseline;
2. Server Health;
3. Master Library Initialization;
4. Publication Registration;
5. Catalog Reading;
6. macOS Catalog Browser;
7. Publication Acquisition;
8. Selective Local Library;
9. Offline Availability;
10. Hardening and Completion.

---

# 12. Increment 0 — Development Baseline

This increment establishes only the infrastructure required to begin implementation.

It includes:

* repository initialization;
* workspace configuration;
* build system;
* linting;
* formatting;
* unit-test runner;
* integration-test foundation;
* environment configuration;
* initial CI workflow;
* minimal logging foundation.

It shall not include speculative framework development.

---

# 13. Increment 1 — Server Health

User-visible value:

* the KnowledgeOS Server process can run on the target environment;
* a client or operator can determine whether the server is healthy.

Required vertical elements:

* server executable;
* configuration;
* HTTP listener;
* health endpoint;
* structured response;
* startup logging;
* server test;
* deployment proof on the NAS target or representative environment.

Example contract:

```text
GET /v1/health
```

Expected result:

```json
{
  "status": "healthy",
  "serverVersion": "0.1.0",
  "time": "2026-07-14T00:00:00Z"
}
```

---

# 14. Increment 2 — Master Library Initialization

User-visible value:

* an authorized operator can initialize a valid Master Library.

Required vertical elements:

* MasterLibraryId;
* MasterLibraryManifest;
* initialization use case;
* filesystem structure;
* persistence;
* administrative command or endpoint;
* validation;
* tests;
* failure handling.

The increment is complete when the initialized Library can be reopened after server restart.

---

# 15. Increment 3 — Publication Registration

User-visible value:

* an authorized operator can add one source publication to the Master Library.

Required vertical elements:

* PublicationId;
* SourceVersion;
* checksum;
* staging;
* source commit;
* catalog persistence;
* metadata entry;
* administrative API or CLI;
* tests.

The publication shall not become available before source and catalog state are durably consistent.

---

# 16. Increment 4 — Catalog Reading

User-visible value:

* a client can list and inspect catalog entries.

Required vertical elements:

* catalog repository;
* list query;
* detail query;
* pagination;
* API contracts;
* structured errors;
* integration tests;
* API documentation.

---

# 17. Increment 5 — macOS Catalog Browser

User-visible value:

* the macOS client can connect and browse the Master Catalog.

Required vertical elements:

* server registration;
* connectivity state;
* API client;
* catalog list UI;
* publication detail UI;
* loading states;
* empty states;
* unavailable-server state;
* client tests.

No publication payload download is required yet.

---

# 18. Increment 6 — Publication Acquisition

User-visible value:

* the user can download one selected publication.

Required vertical elements:

* AcquisitionOperation;
* acquisition endpoint;
* streaming;
* progress;
* temporary destination;
* checksum validation;
* structured failure;
* client progress UI;
* integration tests.

---

# 19. Increment 7 — Selective Local Library

User-visible value:

* an acquired publication appears in the local device Library.

Required vertical elements:

* LocalLibraryItem;
* local persistence;
* atomic installation;
* local file identity;
* local Library listing;
* local removal;
* client state restoration after restart.

The local Library shall contain only acquired publications.

---

# 20. Increment 8 — Offline Availability

User-visible value:

* acquired publications remain discoverable while the NAS is unavailable.

Required vertical elements:

* offline-state detection;
* local Library browsing;
* cached catalog snapshot where useful;
* explicit remote-unavailable UI;
* no false deletion;
* tests with NAS disconnection.

---

# 21. Increment 9 — Hardening and Completion

This increment closes the module.

It includes:

* authentication hardening;
* authorization;
* transport security;
* path validation;
* failure recovery;
* performance measurement;
* observability;
* NAS deployment;
* backup documentation;
* complete end-to-end tests;
* security review;
* Definition of Done;
* Validation Report.

---

# 22. Thin Vertical Slice Principle

The first implementation of a vertical shall be as small as possible while remaining real.

Example:

```text
One real publication
One real NAS Library
One real server
One real macOS client
One real download
One real local installation
```

The first vertical shall not attempt to support every format, device or optimization.

---

# 23. Evolution Within the Module

After the thin vertical works, the same flow shall be expanded with:

* more metadata;
* more formats;
* pagination;
* search;
* resumable download;
* update detection;
* security;
* failure recovery.

Expansion shall not break the proven vertical.

---

# 24. Primary Platform Order

The client implementation order is:

```text
1. macOS
2. iPad
3. iPhone
```

The macOS client is the first reference client because it offers:

* easier local debugging;
* stable background execution;
* direct development access;
* easier filesystem inspection;
* representative native Apple APIs.

iPad and iPhone support shall be added within the module only after the shared client foundation and macOS flow are validated.

---

# 25. Server-First Versus Client-First

The strategy is contract-first and vertical, not purely server-first.

A minimal server capability may precede the client by one increment.

Client needs shall influence contracts before those contracts are stabilized.

---

# 26. Contract-First Rule

Before implementing a server endpoint and client integration, define:

* request;
* response;
* identifiers;
* error model;
* authentication requirement;
* compatibility version.

Contracts shall remain small until proven by real use.

---

# 27. Contract Stabilization

A contract progresses through:

```text
Draft
    ↓
Implemented
    ↓
Integrated
    ↓
Validated
    ↓
Stable for Module 1
```

Public long-term stability is not claimed merely because an endpoint exists.

---

# 28. Technology Selection Strategy

Technologies shall be selected according to the active module's requirements.

Evaluation shall prioritize:

* NAS deployability;
* Apple-client compatibility;
* TypeScript support where useful;
* operational simplicity;
* offline behavior;
* testability;
* portability;
* security;
* low maintenance burden;
* single-developer feasibility.

---

# 29. Technology Neutrality During Requirements

Requirements shall not be written in terms of a chosen framework unless the framework is already an approved implementation constraint.

Example to avoid:

> Store the publication in Prisma.

Preferred:

> Persist the publication transactionally with stable identity and integrity constraints.

---

# 30. Technology Commitment Timing

Commit to a technology when:

* requirements are known;
* alternatives are understood;
* a real increment needs the decision;
* reversal cost is acceptable;
* an IDR is recorded where required.

---

# 31. Prototype Strategy

A prototype may be used to reduce uncertainty involving:

* NAS runtime support;
* streaming performance;
* ranged downloads;
* filesystem semantics;
* Apple networking;
* local persistence;
* certificate handling.

A prototype shall have:

* explicit question;
* bounded scope;
* result;
* decision consequence.

Prototype code shall not automatically become production code.

---

# 32. Risk-First Sequencing

High-risk assumptions should be validated early.

For Master Library, early risks include:

* server deployability on the actual NAS;
* stable NAS filesystem semantics;
* streaming large files;
* authentication on the local network;
* macOS connection discovery;
* atomic local installation;
* checksum performance.

---

# 33. Risk Spike

A Risk Spike is a time-bounded technical investigation.

Each Risk Spike shall define:

```text
Question
Assumption
Experiment
Evidence
Decision
Discard or Integrate
```

Risk Spikes shall not expand into permanent parallel development.

---

# 34. Shared Contract Strategy

Shared contracts may include:

* PublicationId;
* MasterLibraryId;
* API DTOs;
* error codes;
* pagination;
* source metadata;
* AcquisitionOperation state.

Shared contracts shall avoid:

* server framework decorators;
* client UI state;
* database entities;
* filesystem paths;
* vendor-specific storage types.

---

# 35. Domain-First Semantics

The Domain defines meaning before persistence or transport.

Example:

```text
PublicationId
```

is a Domain identity.

Its JSON representation or database column is an implementation detail.

---

# 36. Persistence Strategy

Persistence shall be introduced incrementally.

Initial persistence should support only the active vertical while preserving:

* stable identity;
* transactions;
* integrity;
* migration;
* testability.

A complex distributed persistence system is not required.

---

# 37. Local Persistence Strategy

The client requires local persistence for:

* registered servers;
* catalog snapshot;
* local Library membership;
* acquisition operations;
* local publication references;
* source versions;
* integrity state.

Personal synchronization persistence belongs to a later module.

---

# 38. Source File Strategy

Source publication files shall be handled separately from catalog metadata.

The implementation shall distinguish:

* source metadata transaction;
* staged file;
* committed source file;
* checksum;
* availability state;
* historical SourceVersion.

---

# 39. API Strategy

The first API is intended for trusted KnowledgeOS clients on a controlled local network.

This does not remove the need for:

* authentication;
* authorization;
* validation;
* versioning;
* encrypted transport where practical;
* denial-of-service protection;
* path safety.

---

# 40. API Minimalism

Only endpoints required by the active increment shall be added.

Future endpoints shall not be created as placeholders.

---

# 41. Client UI Strategy

The first UI shall optimize clarity over visual completeness.

It shall clearly represent:

* connected;
* connecting;
* disconnected;
* loading;
* empty catalog;
* publication available remotely;
* downloading;
* available locally;
* failed acquisition.

---

# 42. UI State Integrity

The UI shall not report:

* publication available before atomic installation;
* download completed before checksum validation;
* server connected when requests are failing;
* catalog current when showing a stale snapshot without indication.

---

# 43. Offline-First Strategy

Offline behavior shall be implemented from the first local Library increment.

It shall not be postponed until module completion.

Offline tests shall verify:

* local publication listing;
* local publication opening placeholder;
* server-unavailable state;
* preservation of local content;
* safe recovery after reconnect.

---

# 44. Error Strategy

Errors shall be represented using stable module error codes.

Raw exceptions from:

* filesystem;
* HTTP framework;
* database;
* network stack;
* Apple APIs;

shall be translated before crossing module boundaries.

---

# 45. Security Strategy

Security work shall follow the vertical.

Examples:

* health endpoint may initially expose minimal non-sensitive information;
* Library initialization requires administrative authorization;
* catalog browsing requires authenticated client access;
* acquisition requires publication authorization;
* raw paths remain server-internal.

---

# 46. Authentication Rollout

Authentication may evolve through controlled increments:

```text
Development-only local identity
        ↓
Registered device identity
        ↓
Mutual trust or token-based local authorization
        ↓
Production hardening
```

No development authentication shortcut may remain in the completed module.

---

# 47. Observability Strategy

Each increment shall add only the evidence needed to operate that increment.

Minimum examples:

```text
Server Health
→ startup and health logs

Library Initialization
→ initialization and validation logs

Publication Registration
→ registration and integrity logs

Acquisition
→ operation, bytes, duration and failure logs
```

---

# 48. Testing Strategy

Tests shall be written at the lowest useful layer and reinforced at integration boundaries.

The strategy is:

```text
Many focused Domain tests
Adequate application tests
Real persistence integration tests
Real API integration tests
Focused client tests
Few complete end-to-end tests
```

---

# 49. Test-First Behavior

Critical invariants should receive tests before or with implementation.

Examples:

* stable PublicationId;
* unavailable source cannot be acquired;
* checksum mismatch prevents installation;
* local removal does not delete NAS content;
* personal state is absent from server contracts.

---

# 50. Continuous Integration

CI shall be introduced during Increment 0.

At minimum, CI shall execute:

* formatting verification;
* linting;
* type checking;
* unit tests;
* integration tests that do not require unavailable infrastructure;
* build verification.

NAS-specific end-to-end tests may run in a separate environment.

---

# 51. Main Branch Quality

The main implementation branch shall remain:

* buildable;
* testable;
* free from known critical defects;
* aligned with the active module.

---

# 52. Feature Flag Strategy

Feature flags may isolate incomplete vertical increments.

Flags shall:

* have owners;
* have removal conditions;
* not become permanent architecture;
* not hide untested primary behavior at module completion.

---

# 53. Migration Strategy

Persistence migrations shall begin with the first persistent schema.

Every migration shall be:

* versioned;
* deterministic;
* testable;
* reversible where practical;
* compatible with backup and recovery.

---

# 54. Data Compatibility

During the active module, breaking schema changes are acceptable before stabilization when:

* migrations are provided;
* test fixtures are updated;
* no supported production compatibility promise is violated.

Before module completion, the persisted format shall be explicitly versioned.

---

# 55. Deployment Strategy

KnowledgeOS Server shall be deployable repeatedly and predictably.

Deployment design shall include:

* runtime requirements;
* configuration;
* persistent volumes;
* network port;
* secrets;
* startup behavior;
* health check;
* update procedure;
* rollback procedure.

---

# 56. NAS Target Validation

The server shall be tested on the actual target NAS class before module completion.

A desktop-only server test is insufficient.

---

# 57. Development Environment

The development environment should approximate production where useful without becoming burdensome.

Possible development layers:

```text
Local server on Mac
        ↓
Containerized or packaged server
        ↓
NAS-like mounted storage
        ↓
Actual NAS deployment
```

---

# 58. Operational Simplicity

The initial deployment shall minimize:

* number of processes;
* required external services;
* manual configuration;
* operational credentials;
* recovery complexity.

Operational simplicity is a primary requirement for a single-developer project.

---

# 59. Performance Strategy

Performance shall be measured using representative files and realistic local-network conditions.

Initial critical measurements include:

* catalog query latency;
* catalog pagination latency;
* time to first download byte;
* sustained download throughput;
* checksum duration;
* atomic-install duration;
* client memory use during acquisition.

---

# 60. Large File Strategy

Publication acquisition shall avoid loading the complete source file into memory.

Streaming and bounded buffers shall be used.

---

# 61. Resource Strategy

Server and client shall operate under explicit resource constraints.

The module shall avoid:

* unbounded queues;
* unbounded concurrent downloads;
* unbounded catalog responses;
* unbounded memory buffering;
* uncontrolled temporary files.

---

# 62. Documentation Strategy

Documentation shall be updated at each stable increment.

The implemented state shall be reflected in:

* API contracts;
* schemas;
* deployment;
* tests;
* limitations;
* completion evidence.

---

# 63. Definition of Done Strategy

The module-specific Definition of Done shall be reviewed throughout development.

It is not a final surprise checklist.

At each milestone, completed items shall receive evidence.

---

# 64. Known-Limitation Strategy

Known limitations may remain when they are:

* explicit;
* non-critical;
* bounded;
* accepted;
* compatible with module purpose.

They shall appear in the Validation Report.

---

# 65. Technical Debt Strategy

Debt shall be accepted only when it:

* does not threaten integrity;
* does not create critical security risk;
* does not break the primary vertical;
* has a remediation trigger.

---

# 66. Completion Strategy

Master Library reaches completion only when:

```text
Real NAS server
+
real Master Library
+
real catalog
+
real publication source
+
real macOS client
+
real acquisition
+
real selective local installation
+
offline availability
+
tests
+
operations
```

are all validated.

---

# 67. Module Closure

When the module reaches `VALIDATING`:

1. freeze module scope;
2. execute all tests;
3. perform security review;
4. validate deployment;
5. validate offline behavior;
6. complete documentation;
7. complete Definition of Done;
8. produce Validation Report;
9. issue completion decision.

---

# 68. Next Module Rule

After Master Library completion:

* close its implementation documents;
* mark its state `COMPLETED`;
* record accepted limitations;
* authorize exactly one next module;
* create the next module directory.

No future module work shall be backdated into Master Library.

---

# 69. Strategy Invariants

The following invariants apply.

* One functional module is active.
* One primary vertical increment is active.
* Every increment produces working integrated behavior.
* High-risk assumptions are tested early.
* Shared infrastructure is demand-driven.
* Contracts precede integration.
* Domain meaning precedes transport and persistence.
* The client never accesses Master Library files directly.
* Local Libraries are selective and device-specific.
* Personal state never enters Master Library contracts.
* Offline behavior is implemented before module closure.
* Tests evolve continuously.
* Deployment is part of completion.
* The next module waits for formal closure.

---

# 70. Prohibited Behaviors

KnowledgeOS implementation shall never:

* implement all layers separately before integration;
* start multiple functional modules;
* create speculative shared frameworks;
* commit to major technologies without evaluation;
* stabilize contracts before real client use;
* treat mocks as final integration;
* load large publication payloads entirely into memory;
* expose raw NAS paths;
* send personal state to Master Library APIs;
* postpone offline behavior until a later module;
* postpone deployment until after feature completion;
* close the module without actual NAS validation.

---

# 71. Related Documents

## Implementation Governance

* `README.md`
* `ModuleDevelopmentLifecycle.md`
* `DefinitionOfDone.md`

## Implementation Root

* `../README.md`

## Active Module

* `../01-MasterLibrary/ImplementationCharter.md`
* `../01-MasterLibrary/README.md`

## Architecture

* `../../00-Architecture/08-Governance/ArchitectureFreeze-v3.0.md`
* `../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

---

# 72. Status

**Approved**

KnowledgeOS shall be implemented using one active module and one primary vertical increment at a time.

The Master Library Module begins with the smallest real client-server path and expands incrementally until it satisfies its complete full-stack Definition of Done.

The strategy prioritizes working software, early risk reduction, real NAS validation, continuous testing and limited work in progress.
