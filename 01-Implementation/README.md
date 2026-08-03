# KnowledgeOS Implementation

**Project:** KnowledgeOS

**Section:** Implementation

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation model of KnowledgeOS.

The implementation layer translates the Frozen Architecture V3 baseline into:

* executable software;
* concrete technical designs;
* source code;
* APIs;
* persistence models;
* user interfaces;
* tests;
* deployment artifacts;
* operational documentation.

The implementation layer does not redefine the architecture.

It realizes the approved architecture through controlled, module-oriented development.

---

# 2. Scope

This document governs:

* implementation organization;
* module sequencing;
* vertical development;
* technical-design authority;
* implementation documentation;
* code ownership;
* testing expectations;
* module completion;
* transition between modules;
* implementation conformance.

This document applies to:

* KnowledgeOS Server;
* macOS client;
* iPhone client;
* iPad client;
* shared libraries;
* persistence;
* APIs;
* integration code;
* tests;
* deployment;
* observability.

---

# 3. Architectural Authority

The active architectural baseline is:

```text
00-Architecture/
```

The implementation baseline is:

```text
01-Implementation/
```

The authority relationship is:

```text
Architecture
    │
    ├── defines principles;
    ├── defines boundaries;
    ├── defines responsibilities;
    ├── defines invariants;
    └── constrains implementation.
            │
            ▼
Implementation
    │
    ├── selects concrete technologies;
    ├── defines concrete schemas;
    ├── defines concrete APIs;
    ├── defines source-code structure;
    ├── creates tests;
    └── delivers working software.
```

Implementation shall conform to Architecture V3.

When implementation reveals a genuine architectural defect, the issue shall return to Architecture Governance.

Implementation shall not silently modify architectural meaning.

---

# 4. Core Principle

The fundamental implementation principle is:

> KnowledgeOS shall be developed as complete vertical modules, one module at a time.

The complementary principle is:

> No new functional module shall begin until the active module satisfies its complete Definition of Done.

---

# 5. Development Strategy

KnowledgeOS uses a vertical module development strategy.

Each module progresses through:

```text
Requirements
    ↓
Technical Design
    ↓
Domain
    ↓
Contracts
    ↓
Persistence
    ↓
Server
    ↓
Client
    ↓
Full-Stack Integration
    ↓
Testing
    ↓
Operations
    ↓
Completion
```

The module is not complete until the complete vertical flow works.

---

# 6. Why Vertical Development

Vertical development reduces the risk of:

* building unused infrastructure;
* producing disconnected backend and frontend systems;
* creating contracts without implementation feedback;
* accumulating incomplete modules;
* discovering integration problems too late;
* spreading unfinished work across the repository;
* losing architectural focus.

Each module shall produce a usable capability.

---

# 7. Module Independence

A module shall define:

* its purpose;
* its boundaries;
* its Domain model;
* its use cases;
* its external contracts;
* its persistence;
* its server behavior;
* its client behavior;
* its tests;
* its operational requirements;
* its completion criteria.

A module may depend on shared infrastructure.

It shall not depend on an unfinished future module.

---

# 8. Active Module

Only one functional module may be active at a time.

The current active module is:

```text
01-MasterLibrary
```

No directory for the next functional module shall be created until Master Library is formally completed.

---

# 9. Module Sequence

The expected implementation sequence is currently:

```text
01. Master Library
02. Local Reading Foundation
03. Import
04. UDM Processing
05. DPM Processing
06. Render
07. Annotation
08. Search
09. Personal Sync
10. Export
11. AI
12. Plugin
```

This sequence is planning guidance.

Only the active module is formally authorized for implementation.

Future module order may be revised through implementation planning without modifying Architecture V3, provided architectural boundaries remain unchanged.

---

# 10. Current Module

The current module is:

```text
01-MasterLibrary/
```

Its first vertical capability is:

```text
KnowledgeOS Server on NAS
        ↓
Master Library initialization
        ↓
Master Catalog
        ↓
Publication registration
        ↓
macOS catalog browsing
        ↓
Publication acquisition
        ↓
Selective Local Library
        ↓
Offline local availability
```

---

# 11. Implementation Directory Structure

The implementation structure is:

```text
01-Implementation/
├── README.md
├── 00-Governance/
└── 01-MasterLibrary/
```

No future functional module directory shall be created prematurely.

---

# 12. Implementation Governance

Implementation Governance is located in:

```text
00-Governance/
```

It defines:

* implementation strategy;
* module lifecycle;
* Definition of Done;
* implementation review;
* completion authority;
* exception handling.

---

# 13. Module Documentation

Each module shall contain documentation for:

* charter;
* requirements;
* technical design;
* Domain;
* contracts;
* persistence;
* server;
* client;
* testing;
* operations;
* completion.

---

# 14. Documentation Before Code

Implementation documentation shall be produced before or alongside code.

The required level of documentation shall be sufficient to:

* avoid contradictory implementation;
* establish stable contracts;
* define testable behavior;
* preserve architectural alignment;
* enable future maintenance.

Documentation shall not become a substitute for implementation.

---

# 15. Implementation Charter

Every module begins with an `ImplementationCharter.md`.

The Charter defines:

* purpose;
* scope;
* out-of-scope concerns;
* Domain concepts;
* use cases;
* states;
* errors;
* security;
* testing;
* milestones;
* Definition of Done.

The Charter is the primary implementation-scope authority for the module.

---

# 16. Requirements

The requirements section defines:

* functional requirements;
* non-functional requirements;
* use cases;
* acceptance criteria;
* constraints;
* edge cases.

Requirements shall be testable.

---

# 17. Technical Design

Technical Design defines:

* concrete technology stack;
* repository layout;
* package boundaries;
* dependencies;
* deployment model;
* runtime architecture;
* communication patterns;
* technology decisions.

Technical Design shall remain compatible with Architecture V3.

---

# 18. Domain Implementation

The Domain section defines concrete implementation models for:

* entities;
* value objects;
* identifiers;
* states;
* invariants;
* Domain errors;
* Domain services.

Domain implementation shall not depend on UI or infrastructure frameworks.

---

# 19. Contracts

The Contracts section defines:

* API requests;
* API responses;
* commands;
* queries;
* events;
* error contracts;
* authentication contracts;
* compatibility rules.

Contracts shall be explicit and testable.

---

# 20. Persistence

The Persistence section defines:

* schemas;
* migrations;
* repositories;
* storage layout;
* transaction boundaries;
* indexes;
* integrity constraints;
* backup and recovery behavior.

Persistence shall implement Domain requirements rather than redefine them.

---

# 21. Server

The Server section defines:

* server process;
* modules;
* controllers;
* application services;
* repositories;
* configuration;
* authentication;
* authorization;
* background processing;
* health checks;
* operational behavior.

---

# 22. Client

The Client section defines:

* application architecture;
* state management;
* navigation;
* screens;
* acquisition flows;
* local persistence;
* offline behavior;
* error presentation;
* accessibility.

---

# 23. Full-Stack Integration

A module is not complete until the real server and real client operate together.

Mocks may be used during development.

Mocks shall not remain in the primary completed flow.

---

# 24. Shared Infrastructure

Shared infrastructure may be implemented only when required by the active module.

Examples include:

* logging;
* configuration;
* dependency injection;
* HTTP client;
* authentication;
* test utilities;
* shared contracts.

Shared infrastructure shall not become a hidden second module.

---

# 25. Technology Decisions

Concrete technology choices belong in module Technical Design.

Examples include:

* programming language;
* server framework;
* database;
* transport;
* serialization;
* client framework;
* testing framework;
* deployment container.

A major implementation choice may require an Implementation Decision Record.

---

# 26. Implementation Decision Records

Significant implementation decisions may be documented as:

```text
IDR-XXX
```

An Implementation Decision Record is appropriate when a choice:

* has several viable alternatives;
* creates long-term maintenance consequences;
* is costly to reverse;
* affects multiple layers;
* introduces a major dependency.

IDRs do not replace ADRs.

An IDR cannot override Architecture V3.

---

# 27. Code Organization

Source code shall be organized by bounded capability and responsibility.

Code organization shall avoid:

* global utility dumping grounds;
* framework-driven Domain coupling;
* circular dependencies;
* direct client access to NAS storage;
* direct Engine coupling to Provider implementations;
* duplication of contracts.

---

# 28. Server and Client Separation

KnowledgeOS Server and KnowledgeOS Clients are separate runtime applications.

They may share:

* schemas;
* identifiers;
* API contracts;
* validation models;
* test fixtures.

They shall not share runtime-specific implementation code without a justified shared package.

---

# 29. NAS Access Rule

Only KnowledgeOS Server shall access Master Library storage directly.

Clients shall access the Master Library through governed server contracts.

Clients shall never:

* mount the Master Library as their application data source;
* receive raw NAS paths;
* receive NAS credentials;
* write personal state to the NAS;
* bypass server authorization.

---

# 30. Local Library Rule

Each device owns a Selective Local Library.

The Selective Local Library:

* contains only locally acquired publications;
* supports offline access;
* is device-specific;
* is not a NAS replica;
* may differ between devices.

---

# 31. Personal State Rule

Personal state includes:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal metadata;
* personal preferences.

The Master Library Module shall not upload personal state to the NAS.

Personal synchronization belongs to a later dedicated module.

---

# 32. Interface-First Development

Public module boundaries should be defined before deep implementation.

The sequence is:

```text
Domain contract
    ↓
Application contract
    ↓
API contract
    ↓
Persistence implementation
    ↓
Server implementation
    ↓
Client integration
```

Contracts may evolve before module completion.

They shall be stabilized before the module is declared complete.

---

# 33. Incremental Delivery

Each module shall be implemented through small end-to-end increments.

For Master Library:

```text
Increment 1
Server health

Increment 2
Master Library initialization

Increment 3
Publication registration

Increment 4
Catalog listing

Increment 5
macOS catalog browser

Increment 6
Publication acquisition

Increment 7
Offline local availability

Increment 8
Hardening and completion
```

Every increment shall leave the system buildable.

---

# 34. Testing Principle

Testing is part of implementation.

It is not a final cleanup phase.

Tests shall be added with each increment.

---

# 35. Testing Layers

Each module shall include:

* Domain unit tests;
* application-service tests;
* repository integration tests;
* API integration tests;
* client tests;
* end-to-end tests;
* failure tests;
* security tests where applicable.

---

# 36. Real Infrastructure Tests

Critical persistence and filesystem behavior shall be tested against realistic infrastructure.

For Master Library, this includes:

* real filesystem behavior;
* NAS-like mount behavior where practical;
* file permission failures;
* interrupted transfers;
* corrupted content;
* storage unavailability.

---

# 37. End-to-End Requirement

Every module shall have at least one complete end-to-end test covering its principal user value.

For Master Library:

```text
Initialize Library
    ↓
Register Publication
    ↓
Browse Catalog
    ↓
Acquire Publication
    ↓
Open Local Publication Placeholder
    ↓
Disconnect NAS
    ↓
Confirm Local Availability
```

---

# 38. Error Handling

Every module shall define stable errors.

Errors shall be:

* typed;
* classifiable;
* testable;
* observable;
* translatable to user-facing messages.

Implementation shall not expose raw framework, database or filesystem errors through public contracts.

---

# 39. Observability

Every module shall define:

* structured logs;
* relevant metrics;
* trace boundaries;
* health indicators;
* failure evidence.

Observability shall not expose sensitive user content.

---

# 40. Security

Security shall be implemented within each module.

Security is not deferred to a later global phase.

Each module shall evaluate:

* authentication;
* authorization;
* input validation;
* filesystem safety;
* secret handling;
* transport security;
* audit needs;
* privacy.

---

# 41. Performance

Performance requirements shall be defined for real module workflows.

Premature optimization is prohibited.

Critical paths shall be measured before optimization.

---

# 42. Offline Behavior

Every client-facing module shall define its offline behavior explicitly.

The module shall state:

* what remains available;
* what becomes unavailable;
* what state is durable;
* what operations may be queued;
* how the UI represents degraded mode.

---

# 43. Completion Review

A module completion review shall verify:

* Charter scope;
* requirements;
* implementation;
* contracts;
* persistence;
* server;
* client;
* integration;
* tests;
* security;
* operations;
* documentation;
* Definition of Done.

---

# 44. Definition of Done Authority

The module-specific Definition of Done is stored in:

```text
10-Completion/DefinitionOfDone.md
```

The global minimum requirements are defined in:

```text
00-Governance/DefinitionOfDone.md
```

The stricter requirement applies.

---

# 45. Module Completion States

A module may have one of these states:

```text
PLANNED
DESIGNING
IMPLEMENTING
INTEGRATING
VALIDATING
COMPLETED
BLOCKED
```

Only `COMPLETED` authorizes creation of the next module.

---

# 46. Current State

The Master Library Module state is:

```text
DESIGNING
```

The current activity is:

```text
Technical Design
```

---

# 47. Blocking Issues

A blocking issue shall be recorded when it prevents:

* correct implementation;
* contract stabilization;
* testing;
* deployment;
* completion.

Blocking issues shall not be hidden as TODO comments.

---

# 48. TODO Policy

TODO comments may be used for bounded development work.

A module cannot be completed with:

* critical TODO items;
* unimplemented primary flows;
* unresolved data-integrity risks;
* unresolved security blockers;
* permanent mocks in the primary path.

---

# 49. Change Control

Implementation changes are classified as:

* Local Implementation Change;
* Module Contract Change;
* Cross-Module Change;
* Architectural Change.

Architectural changes shall return to Architecture Governance.

---

# 50. Refactoring

Refactoring is permitted when it preserves:

* behavior;
* contracts;
* tests;
* architecture boundaries.

Refactoring shall not expand module scope silently.

---

# 51. Dependency Introduction

Every significant dependency shall be justified by:

* capability;
* maturity;
* maintenance;
* licensing;
* portability;
* security;
* replacement cost.

Dependencies shall not be added merely for convenience.

---

# 52. Generated Code

Generated code may be used for:

* API clients;
* schemas;
* serialization;
* database models;
* test fixtures.

Generated artifacts shall remain traceable to source definitions.

---

# 53. Documentation Maintenance

Implementation documentation shall be updated when implementation decisions change.

Documentation shall reflect the completed system, not only the initial plan.

---

# 54. Implementation Evidence

Completion evidence may include:

* test reports;
* API specifications;
* migration results;
* screenshots;
* performance measurements;
* security-review results;
* deployment logs;
* validation reports.

---

# 55. Prohibited Behaviors

KnowledgeOS implementation shall never:

* begin several functional modules simultaneously;
* create future module directories prematurely;
* declare a module complete without a working client-server flow;
* treat backend completion as full-stack completion;
* treat UI mockups as completed implementation;
* bypass KnowledgeOS Server to access NAS Master Library data;
* upload personal state to the NAS Master Library;
* describe device Libraries as NAS replicas;
* expose raw NAS paths through APIs;
* let framework concerns define Domain semantics;
* use untyped public errors;
* leave critical behavior dependent on mocks;
* postpone all testing until the end;
* bypass Architecture Governance when implementation requires an architectural change.

---

# 56. Implementation Invariants

The following invariants apply.

* Architecture V3 remains authoritative.
* One functional module is active at a time.
* The active module is developed vertically.
* No next module begins before completion.
* Shared infrastructure is created only when required.
* Domain remains independent from UI and infrastructure.
* Server and client communicate through governed contracts.
* Clients do not access Master Library storage directly.
* Selective Local Libraries are not NAS replicas.
* Personal state is not uploaded to the NAS.
* Testing is continuous.
* Module completion requires full-stack integration.
* Completion requires documented evidence.
* Architectural issues return to Architecture Governance.

---

# 57. Related Documents

## Architecture

* `../00-Architecture/08-Governance/ArchitectureFreeze-v4.0.md`
* `../00-Architecture/08-Governance/ArchitectureAmendment-v4.0-001.md`
* `../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

## Implementation Governance

* `README.md`
* `00-Governance/ImplementationStrategy.md`
* `00-Governance/ModuleDevelopmentLifecycle.md`
* `00-Governance/DefinitionOfDone.md`

## Active Module

* `01-MasterLibrary/README.md`
* `01-MasterLibrary/ImplementationCharter.md`

---

# 58. Status

**Approved**

KnowledgeOS implementation follows a vertical module strategy.

Master Library is the only active functional module.

The module shall progress from requirements and technical design through Domain, Contracts, Persistence, Server, Client, Testing, Operations and Completion.

The next module shall not begin until Master Library is fully implemented, integrated, validated and formally completed.
