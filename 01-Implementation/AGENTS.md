
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Implementation
**Path:** `01-Implementation/`
**Document:** Implementation Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Project Owner

---

# 1. Purpose

This document defines the operational rules for every human or AI agent working inside:

```text
01-Implementation/
```

The Implementation area transforms the approved KnowledgeOS architecture into:

* technical designs;
* executable modules;
* persistence models;
* contracts;
* clients;
* servers;
* tests;
* deployment definitions;
* operational procedures;
* completion evidence.

Implementation shall realize the architecture.

It shall not silently redesign it.

---

# 2. Scope

This guide applies to the complete implementation tree, including:

```text
01-Implementation/
├── 00-Governance/
├── 01-MasterLibrary/
├── 02-DesktopApplication/
└── README.md
```

It governs:

* implementation planning;
* technical design;
* module development;
* architecture mapping;
* contract design;
* persistence;
* application construction;
* testing;
* deployment;
* operations;
* completion;
* implementation traceability.

---

# 3. Implementation Authority

Implementation owns:

* technical realization;
* source-level design;
* implementation contracts;
* database schemas;
* persistence layouts;
* deployment configuration;
* runtime configuration;
* implementation tests;
* operational procedures;
* release readiness;
* implementation completion evidence.

Implementation does not own:

* Product Vision;
* Domain semantics;
* Kernel architecture;
* Platform Engine responsibilities;
* Integration boundaries;
* Execution guarantees;
* architectural governance;
* frozen architectural decisions.

---

# 4. Authority Order

Implementation shall follow this authority order:

```text
Product Vision

↓

Architecture V3

↓

Architecture Decision Records

↓

Architecture Amendments

↓

Implementation Governance

↓

Module Technical Design

↓

Source Code

↓

Tests and Operations
```

A lower level shall not contradict a higher level.

When a conflict exists, the higher-level approved artifact prevails until Governance approves a change.

---

# 5. Architecture Baseline

The authoritative architecture is located under:

```text
00-Architecture/
```

Implementation work shall remain aligned with:

```text
01-Foundation
02-Domain
03-Kernel
04-Platform
05-Integration
06-Execution
07-ArchitectureViews
08-Governance
```

Agents shall not rely on isolated documents when the change affects several architectural areas.

---

# 6. Mandatory Reading Order

Before modifying implementation documentation or source code, an agent shall read:

1. repository root `AGENTS.md`;
2. this `AGENTS.md`;
3. `01-Implementation/README.md`;
4. `01-Implementation/00-Governance/README.md`;
5. the affected module `AGENTS.md`, when present;
6. the affected module `README.md`;
7. applicable requirements;
8. applicable technical design;
9. applicable architecture documents;
10. applicable ADRs and amendments;
11. affected contracts;
12. affected testing and operational documentation.

Agents shall not begin implementation from a file name or isolated requirement alone.

---

# 7. Core Principles

All implementation work shall preserve:

* architecture compliance;
* explicit ownership;
* stable identities;
* Offline First;
* Master Library authority;
* separation of concerns;
* deterministic behavior where required;
* idempotency;
* recoverability;
* testability;
* observability;
* security;
* privacy;
* maintainability;
* portability;
* complete traceability.

---

# 8. No Silent Architecture Changes

Implementation shall not introduce architectural changes implicitly.

Examples of prohibited silent changes include:

* adding a new architectural layer;
* changing Source of Truth;
* changing Master Library authority;
* changing Domain identity;
* changing Engine ownership;
* bypassing Kernel mechanisms;
* bypassing Integration contracts;
* redefining synchronization;
* making remote access mandatory;
* making caches authoritative;
* exposing implementation details as public contracts;
* changing platform scope.

When implementation reveals a missing or invalid architectural decision, the issue shall be escalated to Governance.

---

# 9. Implementation Governance

The directory:

```text
01-Implementation/00-Governance/
```

defines how implementation work is planned, reviewed and completed.

Its documents include:

```text
DefinitionOfDone.md
ImplementationStrategy.md
ModuleDevelopmentLifecycle.md
README.md
```

Implementation Governance shall remain subordinate to Architecture Governance.

It may refine execution procedures.

It shall not redefine architecture.

---

# 10. Implementation Strategy

`ImplementationStrategy.md` defines:

* development order;
* incremental delivery;
* module dependencies;
* validation sequence;
* integration strategy;
* implementation milestones;
* risk control;
* architecture-compliance checkpoints.

Agents shall follow the approved implementation strategy unless explicitly instructed otherwise.

---

# 11. Module Development Lifecycle

Every module shall follow the lifecycle defined by:

```text
00-Governance/ModuleDevelopmentLifecycle.md
```

A typical lifecycle includes:

```text
Requirements

↓

Technical Design

↓

Domain and Contracts

↓

Persistence and Runtime Design

↓

Implementation

↓

Testing

↓

Operations

↓

Completion Review
```

Stages shall not be skipped merely to begin coding sooner.

---

# 12. Definition of Done

`DefinitionOfDone.md` defines the minimum completion standard for implementation work.

A module is not complete merely because:

* it compiles;
* a happy-path test passes;
* a UI is visible;
* an endpoint responds;
* data can be stored.

Completion requires evidence across all affected dimensions.

---

# 13. Implementation Units

An implementation unit may be:

* module;
* service;
* application;
* Engine realization;
* adapter;
* provider;
* workflow;
* persistence subsystem;
* client;
* operational component.

Every unit shall have:

* purpose;
* owner;
* scope;
* dependencies;
* contracts;
* lifecycle;
* failure model;
* tests;
* operational behavior;
* completion criteria.

---

# 14. Module Ownership

Each module shall have one primary owner.

Ownership defines responsibility for:

* behavior;
* state;
* contracts;
* errors;
* lifecycle;
* observability;
* tests;
* documentation.

Shared ownership without explicit boundaries is prohibited.

---

# 15. Dependency Direction

Implementation dependencies shall preserve architectural direction.

The expected conceptual direction is:

```text
Applications

↓

Platform

↓

Kernel and Domain

↓

Integration Adapters
```

The exact package structure may vary.

However:

* Domain shall not depend on UI;
* Domain shall not depend on persistence technology;
* Kernel shall not depend on Platform business semantics;
* Platform Engines shall not depend directly on concrete external providers;
* applications shall not bypass approved contracts;
* Integration shall not become Domain authority.

---

# 16. Dependency Inversion

Concrete infrastructure shall depend on internal abstractions where required by architecture.

Examples include:

* storage providers implementing storage contracts;
* AI providers implementing provider contracts;
* synchronization transports implementing synchronization contracts;
* UI depending on application contracts;
* persistence mapping depending on Domain identity rules.

Dependency inversion shall serve architectural boundaries.

It shall not be added mechanically where no boundary exists.

---

# 17. Requirements

Requirements shall be defined before implementation when the behavior is not already explicit.

Requirements shall identify:

* objective;
* actors;
* preconditions;
* behavior;
* constraints;
* failure cases;
* acceptance criteria;
* nonfunctional obligations;
* architecture references.

Requirements shall not prescribe implementation details unless technically necessary.

---

# 18. Functional Requirements

Functional requirements describe what the system shall do.

They shall be:

* testable;
* unambiguous;
* traceable;
* scoped;
* consistent with Product Vision.

A requirement shall not silently expand product scope.

---

# 19. Nonfunctional Requirements

Nonfunctional requirements shall cover relevant quality attributes such as:

* performance;
* reliability;
* security;
* privacy;
* recoverability;
* maintainability;
* portability;
* observability;
* scalability;
* Offline First behavior;
* accessibility;
* resource limits.

Nonfunctional requirements shall be measurable where practical.

---

# 20. Use Cases

Use cases shall define:

* actor;
* trigger;
* preconditions;
* main flow;
* alternate flows;
* failure flows;
* completion state;
* affected data;
* related requirements.

Use cases shall remain independent from UI layout unless the UI behavior is essential.

---

# 21. Acceptance Criteria

Acceptance criteria shall be observable and testable.

They shall define what proves that the required behavior is complete.

Vague criteria such as:

* works correctly;
* performs well;
* handles errors;
* is user-friendly;

are insufficient without measurable or observable conditions.

---

# 22. Technical Design

Technical design translates architecture and requirements into an implementable model.

It may define:

* modules;
* services;
* processes;
* data flows;
* interfaces;
* technology choices;
* runtime behavior;
* persistence mappings;
* deployment topology;
* error handling.

Technical design shall remain traceable to architecture.

---

# 23. Technology Decisions

Technology decisions shall distinguish between:

* architecture-approved technologies;
* implementation-specific choices;
* experimental choices;
* replaceable tools.

Implementation technology shall not become architecture accidentally.

Material, difficult-to-reverse technology choices may require an ADR or architecture amendment.

---

# 24. Technical Design Completeness

A technical design is complete only when it addresses:

* scope;
* components;
* dependencies;
* data flow;
* contracts;
* state;
* concurrency;
* errors;
* security;
* privacy;
* observability;
* tests;
* deployment;
* migration;
* known limitations.

Not every section requires equal detail.

Every relevant concern requires an explicit decision.

---

# 25. Domain Implementation

Domain implementation shall preserve the models defined under:

```text
00-Architecture/02-Domain/
```

This includes:

* Knowledge Object;
* UDM;
* DPM;
* identity;
* metadata;
* provenance;
* relationships;
* lifecycle;
* validation;
* Knowledge Graph.

Implementation shall not simplify Domain semantics in a way that loses architectural meaning.

---

# 26. Domain Purity

Domain logic should remain independent from:

* databases;
* filesystems;
* HTTP;
* UI frameworks;
* providers;
* operating-system APIs;
* serialization formats;
* background-job frameworks.

Infrastructure dependencies shall be introduced through explicit boundaries.

---

# 27. Stable Identity

Implementation shall preserve stable identity for:

* libraries;
* Knowledge Objects;
* documents;
* assets;
* annotations;
* versions;
* jobs;
* workflows;
* synchronization participants;
* plugins.

Identifiers shall not be derived solely from:

* file paths;
* database row order;
* UI position;
* temporary runtime state;
* network location.

---

# 28. Master Library

The Master Library is the authoritative Source of Truth.

Implementation shall preserve the coordinated authority of:

* PostgreSQL catalog data;
* authoritative library files;
* stable identities;
* metadata;
* integrity data;
* version information;
* synchronization state.

The Master Library shall not be reduced to a single database or filesystem abstraction.

---

# 29. Local Libraries

Local Libraries are synchronized working libraries.

They may support:

* offline work;
* local reads;
* local edits;
* pending synchronization;
* local indexes;
* local caches.

They shall not silently replace Master Library authority.

---

# 30. Personal Workspace

Workspace runtime state shall remain distinct from Library state.

Examples of workspace state include:

* open tabs;
* active document;
* window layout;
* temporary selections;
* navigation history;
* undo state;
* unsaved presentation state.

Workspace state shall not be confused with authoritative knowledge.

---

# 31. Persistence

Persistence implementation shall follow:

```text
00-Architecture/05-Integration/Storage/
00-Architecture/06-Execution/Concurrency/
01-Implementation/<module>/05-Persistence/
```

Persistence shall define:

* ownership;
* schema;
* transactions;
* locking;
* integrity;
* checksums;
* recovery;
* backup;
* migration;
* consistency.

---

# 32. Persistence Authority

Persistence stores architectural state.

It does not define architectural semantics.

Database schemas and directory layouts shall not become the primary definition of Domain concepts.

---

# 33. PostgreSQL

PostgreSQL is the approved catalog database for the Master Library implementation.

It shall run in a separate container from the application server.

Its persistent data shall use an independent volume.

PostgreSQL shall store only the data assigned to it by the approved storage design.

---

# 34. Authoritative Files

Authoritative library files shall use a persistent volume independent from PostgreSQL.

The implementation shall preserve:

* integrity;
* stable references;
* backup compatibility;
* restore compatibility;
* migration capability;
* consistency with catalog state.

---

# 35. Directory Layout

Filesystem layout is an implementation concern.

It shall be:

* deterministic;
* documented;
* portable where required;
* independent from user-facing identity;
* recoverable;
* migration-aware.

A path shall not be the sole identity of a Knowledge Object.

---

# 36. Database Schemas

Schemas shall reflect technical persistence requirements.

They shall define:

* tables;
* keys;
* indexes;
* constraints;
* relationships;
* versions;
* migrations;
* integrity rules.

Schema convenience shall not override Domain or identity rules.

---

# 37. Transactions

Transactions shall preserve the logical consistency defined by architecture.

Implementation shall distinguish:

* database transactions;
* filesystem operations;
* distributed operations;
* synchronization operations;
* workflow compensation.

A database transaction alone may not provide full architectural atomicity.

---

# 38. Locking

Locking shall follow approved Execution rules.

Every lock shall define:

* owner;
* scope;
* acquisition;
* release;
* timeout;
* failure behavior;
* deadlock strategy.

Unbounded waiting is prohibited.

---

# 39. Consistency

Implementation shall explicitly define consistency between:

* catalog and files;
* Master Library and Local Libraries;
* authoritative state and indexes;
* application state and persistence;
* transactions and emitted events;
* backups and restored data.

Consistency assumptions shall not remain implicit.

---

# 40. Checksums and Integrity

Integrity mechanisms shall be used where required for:

* authoritative files;
* assets;
* transfers;
* backups;
* synchronization;
* restored data.

Checksum algorithms and validation points shall be documented.

Integrity failures shall be explicit and observable.

---

# 41. Backup and Restore

Backup and restore shall preserve the complete authoritative system.

Backing up only PostgreSQL or only library files is insufficient when both are required for consistency.

Backup documentation shall define:

* scope;
* ordering;
* consistency point;
* validation;
* retention;
* restoration;
* failure handling.

---

# 42. Recovery

Recovery shall preserve:

* identity;
* authoritative state;
* version history;
* catalog-file consistency;
* synchronization checkpoints;
* unfinished operations where recoverable.

Recovery shall validate state before normal operation resumes.

---

# 43. Contracts

Implementation contracts shall be defined under the appropriate module.

Contracts may include:

* commands;
* queries;
* events;
* APIs;
* provider interfaces;
* storage interfaces;
* synchronization messages;
* error contracts;
* pagination;
* health contracts.

Contracts shall have one clear owner.

---

# 44. Public and Internal Contracts

Implementation shall distinguish:

* internal module contracts;
* application contracts;
* integration contracts;
* public contracts;
* provider contracts.

Internal implementation details shall not leak into public contracts.

---

# 45. Contract Stability

Contract stability depends on its exposure.

Public and persisted contracts require stronger compatibility guarantees than internal interfaces.

Agents shall evaluate:

* versioning;
* backward compatibility;
* forward compatibility;
* deprecation;
* migration;
* serialization.

---

# 46. API Conventions

APIs shall follow the approved conventions for:

* naming;
* authentication;
* authorization;
* versioning;
* pagination;
* errors;
* idempotency;
* request validation;
* response validation.

Multiple API technologies shall not define incompatible semantics.

---

# 47. Authentication

Authentication establishes identity.

Implementation shall define:

* supported mechanisms;
* credential storage;
* token lifetime;
* renewal;
* revocation;
* failure behavior;
* local/offline implications.

Authentication shall not be confused with authorization.

---

# 48. Authorization

Authorization defines permitted actions.

Authorization shall be:

* explicit;
* least-privilege;
* testable;
* auditable where required;
* consistent across APIs and clients.

UI visibility alone is not authorization.

---

# 49. Errors

Every implementation area shall define an error model.

Errors shall identify:

* category;
* owner;
* recoverability;
* retryability;
* user visibility;
* logging behavior;
* contract representation.

Raw infrastructure errors shall not leak through stable public boundaries.

---

# 50. Error Categories

Relevant categories may include:

* validation;
* authorization;
* authentication;
* conflict;
* not found;
* integrity;
* storage;
* network;
* provider;
* timeout;
* cancellation;
* synchronization;
* internal failure.

Categories shall remain consistent across module contracts.

---

# 51. Retry

Retries shall follow:

```text
00-Architecture/06-Execution/Concurrency/RetryPolicies.md
```

Every retryable operation shall define:

* retry condition;
* maximum attempts;
* delay;
* backoff;
* jitter where appropriate;
* idempotency;
* cancellation;
* final failure.

Infinite retries are prohibited.

---

# 52. Idempotency

Retryable and duplicate-prone operations shall be idempotent where required.

Implementation shall define:

* idempotency key;
* storage duration;
* duplicate response;
* conflict behavior;
* cleanup.

Idempotency shall not depend on unstable runtime values.

---

# 53. Concurrency

Implementation shall follow the approved concurrency model.

Every concurrent component shall define:

* shared state;
* isolation;
* synchronization;
* ordering;
* cancellation;
* conflict handling;
* resource limits.

Hidden mutable global state is prohibited.

---

# 54. Determinism

Deterministic operations shall control or record sources of nondeterminism such as:

* time;
* random values;
* provider responses;
* ordering;
* concurrency;
* AI output;
* external state.

Tests shall not depend on uncontrolled nondeterminism.

---

# 55. Messaging

Commands, queries and events shall preserve Kernel and Execution semantics.

Implementation shall not use messaging concepts interchangeably.

## Command

Requests an action.

## Query

Requests information without changing authoritative state.

## Event

Records that something has occurred.

---

# 56. Event Publication

Event publication shall define:

* transaction relationship;
* ordering;
* durability;
* duplicate handling;
* replay;
* failure behavior.

An event shall not claim that a state change occurred before that change is authoritative.

---

# 57. Workflows

Long-running or multi-step processes shall use the approved workflow model where appropriate.

Workflows shall define:

* state;
* transitions;
* checkpoints;
* retries;
* compensation;
* cancellation;
* recovery;
* observability.

Workflow state shall not exist only in process memory when durable recovery is required.

---

# 58. Background Jobs

Background jobs shall follow the approved lifecycle.

They shall define:

* owner;
* queue;
* priority;
* payload;
* execution;
* retry;
* timeout;
* cancellation;
* recovery;
* result;
* observability.

Invisible background execution is prohibited.

---

# 59. Scheduling

Scheduled work shall define:

* schedule source;
* timezone;
* missed-run behavior;
* concurrency behavior;
* idempotency;
* cancellation;
* persistence;
* recovery.

Time-based behavior shall be tested using controllable time.

---

# 60. Caching

Caches are derived implementation state.

Every cache shall define:

* owner;
* key;
* size;
* expiration;
* invalidation;
* consistency;
* persistence;
* recovery.

Caches shall never become the only copy of authoritative knowledge.

---

# 61. Search Indexes

Search indexes are derived state.

They shall be:

* rebuildable;
* version-aware;
* consistency-aware;
* observable;
* recoverable.

Search index loss shall not imply authoritative Library loss.

---

# 62. Providers

Provider implementations shall comply with Integration provider contracts.

Providers may include:

* AI;
* OCR;
* export;
* storage;
* synchronization.

Provider-specific behavior shall remain behind approved abstractions.

---

# 63. AI Implementation

AI implementation shall preserve:

* local and remote provider support;
* user privacy;
* explicit provider selection;
* capability discovery;
* consent where required;
* bounded context;
* cancellation;
* timeout;
* observability without prompt leakage.

AI output shall not become authoritative knowledge without an explicit user or workflow action.

---

# 64. Plugin Implementation

Plugins shall access KnowledgeOS only through approved capabilities and contracts.

Plugins shall not receive:

* unrestricted storage access;
* unrestricted process access;
* unrestricted network access;
* hidden internal interfaces;
* implicit privileges.

Plugin permissions shall remain explicit.

---

# 65. Synchronization

Synchronization implementation shall preserve:

* Master Library authority;
* Local Library functionality;
* Offline First;
* stable identity;
* checkpoints;
* conflict detection;
* idempotency;
* ordering;
* retry;
* recovery.

Synchronization shall not silently overwrite conflicting user knowledge.

---

# 66. Import

Import implementation shall preserve the approved pipeline.

It may include:

* source acquisition;
* format detection;
* parsing;
* OCR;
* normalization;
* UDM construction;
* DPM construction;
* validation;
* Library registration.

Imported content shall not become authoritative before validation and registration complete.

---

# 67. Export

Export implementation shall read approved KnowledgeOS representations.

It shall define:

* source selection;
* rendering;
* format generation;
* asset handling;
* metadata handling;
* cancellation;
* partial failure;
* integrity validation.

Export output is not automatically authoritative Library state.

---

# 68. Rendering

Rendering shall preserve the separation between:

* UDM semantics;
* DPM presentation;
* runtime view state;
* export representation.

Rendering code shall not redefine Domain content.

---

# 69. Desktop Application

The desktop application is the primary KnowledgeOS client.

Its implementation shall preserve:

* macOS-first experience;
* Offline First;
* Local Library access;
* workspace restoration;
* multiwindow behavior where approved;
* local performance;
* synchronization integration;
* local and remote AI access.

The desktop UI shall not become the owner of Domain or Library semantics.

---

# 70. Mobile Applications

iPhone and iPad implementations shall preserve shared architecture while respecting platform-specific interaction.

They shall not create incompatible knowledge models.

Platform-specific UI differences are allowed.

Architectural semantics shall remain consistent.

---

# 71. Optional Web Application

The web application is optional.

Core architectural functionality shall not assume that a web client exists.

Web-specific constraints shall not weaken desktop or offline behavior.

---

# 72. Application State

Application state shall be classified as:

* Domain state;
* Library state;
* synchronized state;
* workspace state;
* UI state;
* cache state;
* ephemeral runtime state.

These categories shall not be merged.

---

# 73. State Management

State management shall define:

* owner;
* lifetime;
* persistence;
* synchronization;
* invalidation;
* recovery;
* observation.

Global state shall be minimized.

Shared state shall have explicit ownership.

---

# 74. User Interface

UI implementation shall consume application contracts.

It shall not:

* access persistence directly;
* bypass authorization;
* own synchronization logic;
* implement Domain rules independently;
* call providers without approved mediation.

UI behavior shall remain testable separately from infrastructure.

---

# 75. Navigation

Navigation shall preserve:

* stable destinations;
* restoration;
* deep-link semantics where applicable;
* workspace context;
* error handling;
* unavailable-content handling.

Navigation identity shall not rely solely on visual position.

---

# 76. Windows and Workspaces

Desktop windows and workspaces shall define:

* lifecycle;
* ownership;
* restoration;
* persistence;
* recovery;
* document association;
* command routing;
* selection context.

Closing a window shall not silently destroy authoritative work.

---

# 77. Platform Integration

Operating-system integrations shall remain adapters.

Examples include:

* file pickers;
* notifications;
* background execution;
* secure credential storage;
* drag and drop;
* share extensions;
* document providers.

Platform APIs shall not redefine architecture.

---

# 78. Configuration

Configuration shall be:

* typed;
* validated;
* scoped;
* documented;
* secure;
* versioned where necessary;
* observable without exposing secrets.

Configuration errors shall fail explicitly.

---

# 79. Secrets

Secrets shall never be:

* committed to the repository;
* stored in plain-text configuration;
* emitted in logs;
* included in test fixtures;
* exposed through public APIs;
* embedded in rendered documentation.

Secret access shall follow least privilege.

---

# 80. Logging

Logs shall record operational facts without exposing user knowledge.

Logs may include:

* operation identifiers;
* durations;
* statuses;
* error categories;
* resource metrics;
* correlation identifiers.

Logs shall not include:

* document content;
* annotations;
* AI prompts;
* AI responses;
* authentication tokens;
* passwords;
* private files.

---

# 81. Metrics

Metrics shall describe system behavior rather than user knowledge.

Relevant metrics may include:

* request latency;
* queue depth;
* synchronization lag;
* job failures;
* retry counts;
* storage use;
* index status;
* provider availability;
* recovery duration.

Metric labels shall avoid unbounded cardinality.

---

# 82. Tracing

Tracing shall preserve context across:

* commands;
* queries;
* events;
* workflows;
* jobs;
* providers;
* storage;
* synchronization.

Trace propagation shall not leak secrets or personal content.

---

# 83. Health Checks

Health checks shall distinguish:

* liveness;
* readiness;
* degradation;
* dependency status.

A degraded optional provider shall not necessarily make the complete system unavailable.

---

# 84. Security

Every implementation area shall evaluate:

* authentication;
* authorization;
* input validation;
* output handling;
* secrets;
* trust boundaries;
* storage protection;
* transport protection;
* plugin isolation;
* provider access;
* logging safety.

Security shall not be postponed to final completion.

---

# 85. Privacy

KnowledgeOS stores personal knowledge.

Implementation shall minimize:

* unnecessary collection;
* remote transmission;
* telemetry;
* retention;
* provider exposure;
* debug-data exposure.

Remote processing shall be explicit and controlled.

---

# 86. Offline First

Offline First shall be preserved in implementation.

Core local capabilities shall continue operating without a network whenever their required local data is available.

Network loss shall not automatically invalidate:

* local reading;
* local editing;
* annotations;
* workspace operations;
* local search;
* local AI;
* queued synchronization.

---

# 87. Resource Management

Implementation shall define bounded use of:

* memory;
* CPU;
* GPU;
* disk;
* file handles;
* database connections;
* network connections;
* queues;
* background tasks;
* AI contexts.

Unbounded resource growth is prohibited.

---

# 88. Cancellation

Long-running operations shall support cancellation where technically possible.

Cancellation shall:

* propagate;
* release resources;
* preserve consistency;
* record final state;
* avoid false completion events.

Cancellation is not failure unless the contract defines it as such.

---

# 89. Timeouts

External, storage and long-running operations shall define timeouts where required.

Timeouts shall be:

* explicit;
* configurable where appropriate;
* observable;
* compatible with retry;
* compatible with cancellation.

An absent timeout shall be justified.

---

# 90. Performance

Performance work shall protect correctness.

Implementation shall measure relevant targets for:

* startup;
* document opening;
* search;
* navigation;
* synchronization;
* import;
* export;
* rendering;
* memory;
* storage;
* AI processing.

Optimization without measurement is discouraged.

---

# 91. Scalability

Implementation shall account for growth in:

* Knowledge Objects;
* assets;
* annotations;
* versions;
* relationships;
* search indexes;
* plugins;
* synchronization history;
* concurrent tasks.

Scalability shall remain bounded by the intended product context.

KnowledgeOS shall not be redesigned as an unnecessary hyperscale platform.

---

# 92. Testing Strategy

Every module shall define a test strategy.

Testing may include:

* unit tests;
* contract tests;
* integration tests;
* end-to-end tests;
* migration tests;
* synchronization tests;
* recovery tests;
* performance tests;
* security tests;
* architecture-compliance tests.

Tests shall correspond to actual risks and requirements.

---

# 93. Unit Tests

Unit tests shall verify isolated behavior.

They should cover:

* Domain rules;
* value objects;
* state transitions;
* validation;
* error classification;
* deterministic transformations;
* edge cases.

Unit tests shall not require unnecessary infrastructure.

---

# 94. Contract Tests

Contract tests shall verify compatibility between:

* clients and servers;
* Engines and providers;
* modules;
* APIs;
* persistence adapters;
* synchronization participants;
* plugins and the Plugin SDK.

Contract tests shall use stable contract definitions.

---

# 95. Integration Tests

Integration tests shall verify real boundaries such as:

* PostgreSQL;
* filesystem;
* NAS-like storage;
* providers;
* APIs;
* message processing;
* synchronization;
* background jobs.

Mocks shall not replace every critical integration test.

---

# 96. End-to-End Tests

End-to-end tests shall validate complete user or system flows.

They shall focus on high-value scenarios such as:

* acquisition;
* Library browsing;
* document opening;
* offline editing;
* synchronization;
* recovery;
* import;
* export;
* workspace restoration.

End-to-end tests shall not become the only test layer.

---

# 97. Migration Tests

Migration tests shall verify:

* source-version detection;
* transformation;
* identity preservation;
* integrity;
* rollback or recovery;
* compatibility;
* final-state validation.

Migration shall not be considered safe without representative test data.

---

# 98. Recovery Tests

Recovery tests shall simulate:

* interrupted writes;
* process termination;
* network loss;
* provider failure;
* database restart;
* storage unavailability;
* partial synchronization;
* corrupted temporary state.

Recovery behavior shall be tested, not merely documented.

---

# 99. Performance Tests

Performance tests shall define:

* workload;
* dataset;
* environment;
* metrics;
* thresholds;
* result interpretation.

Performance results without reproducible conditions are insufficient.

---

# 100. Security Tests

Security tests shall cover relevant risks including:

* authorization bypass;
* input validation;
* secret exposure;
* path traversal;
* plugin privilege escalation;
* unsafe provider access;
* token handling;
* insecure logging.

---

# 101. Test Data

Test data shall be:

* synthetic or safely anonymized;
* deterministic where possible;
* versioned;
* representative;
* free from secrets;
* compatible with repeatable tests.

Real personal knowledge shall not be used casually as test data.

---

# 102. Test Isolation

Tests shall not depend on:

* execution order;
* hidden local files;
* personal environment variables;
* external mutable services;
* previous test state;
* machine-specific paths.

Tests shall clean up owned resources.

---

# 103. Deployment

Deployment design shall follow approved architecture.

It shall define:

* deployable units;
* containers;
* volumes;
* networks;
* configuration;
* secrets;
* health checks;
* startup order;
* shutdown;
* upgrades;
* rollback.

---

# 104. NAS Deployment

NAS-side Master Library services shall be containerized.

The deployment shall preserve separate responsibilities for:

* application server;
* PostgreSQL;
* authoritative files;
* persistent volumes;
* backup operations;
* health monitoring.

---

# 105. Persistent Volumes

At minimum, separate persistent volumes shall exist for:

* PostgreSQL data;
* authoritative Library files.

Volume lifecycle shall be independent from container lifecycle.

Removing or recreating a container shall not destroy authoritative data.

---

# 106. Upgrade Procedures

Upgrades shall define:

* supported source versions;
* preconditions;
* backups;
* migrations;
* compatibility;
* service interruption;
* validation;
* rollback;
* recovery.

Automatic upgrade shall not mean unvalidated upgrade.

---

# 107. Operations

Operational documentation shall define how to:

* deploy;
* configure;
* monitor;
* maintain;
* back up;
* restore;
* upgrade;
* diagnose;
* recover;
* respond to incidents.

Operations shall be designed during implementation, not after completion.

---

# 108. Monitoring

Monitoring shall cover:

* availability;
* degradation;
* failures;
* capacity;
* storage;
* synchronization;
* queues;
* background jobs;
* providers;
* backups;
* integrity.

Monitoring shall avoid collecting personal knowledge.

---

# 109. Alerting

Alerts shall be actionable.

Every alert should define:

* condition;
* severity;
* likely impact;
* diagnostic path;
* owner;
* response;
* recovery or escalation.

Alerting on every transient failure is prohibited.

---

# 110. Incident Management

Operational incidents shall preserve:

* user data;
* evidence;
* recovery options;
* clear communication;
* root-cause analysis;
* remediation traceability.

Incident fixes that change architecture require Governance review.

---

# 111. Runbooks

Runbooks shall provide complete operational procedures.

They shall include:

* purpose;
* prerequisites;
* steps;
* validation;
* failure handling;
* rollback;
* escalation;
* expected result.

Runbooks shall not depend on undocumented personal knowledge.

---

# 112. Documentation

Implementation documentation shall remain synchronized with implementation.

Agents shall update affected:

* requirements;
* technical designs;
* contracts;
* persistence documents;
* operations documents;
* tests;
* completion documents;
* traceability.

Code-only changes are insufficient when behavior or contracts change.

---

# 113. Complete Files

When replacing implementation documentation, agents shall provide complete files.

They shall not leave documents that require reconstructing several disconnected patches.

---

# 114. No Placeholders

Approved implementation documentation shall not contain unresolved placeholders such as:

* TODO;
* TBD;
* FIXME;
* implement later;
* pending design;
* example only.

Known unresolved work belongs in explicit limitations, risks or backlog documents.

---

# 115. Implementation Traceability

Every material implementation element shall be traceable to:

* requirement;
* architectural decision;
* technical design;
* contract;
* test;
* completion evidence.

Traceability shall support both forward and reverse navigation.

---

# 116. Architecture Compliance

Implementation shall be reviewed against:

* Product Vision;
* Architecture Principles;
* Quality Attributes;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* ADRs;
* amendments.

Architecture compliance shall be evidence-based.

---

# 117. Known Limitations

Known limitations shall be explicit.

Each limitation should define:

* description;
* impact;
* scope;
* workaround;
* risk;
* target resolution;
* architecture implications.

Limitations shall not be hidden in code comments alone.

---

# 118. Technical Debt

Technical debt shall be documented when implementation intentionally accepts a suboptimal solution.

Each item shall define:

* reason;
* affected area;
* risk;
* consequences;
* remediation;
* priority;
* owner.

Technical debt shall not silently change architecture.

---

# 119. Completion

A module reaches completion only after:

* requirements are satisfied;
* technical design is implemented;
* contracts are stable;
* persistence is validated;
* tests pass;
* operations are documented;
* architecture compliance is verified;
* known limitations are recorded;
* release readiness is reviewed;
* traceability is complete.

---

# 120. Release Readiness

Release readiness shall evaluate:

* functionality;
* reliability;
* recovery;
* security;
* privacy;
* performance;
* deployment;
* monitoring;
* backup;
* upgrade;
* documentation;
* supportability.

A release shall not be declared ready solely because development has stopped.

---

# 121. Implementation Completion Report

A completion report shall identify:

* implemented scope;
* excluded scope;
* requirements satisfied;
* architecture mapping;
* contracts delivered;
* tests executed;
* performance results;
* security results;
* operational readiness;
* known limitations;
* risks;
* release recommendation.

---

# 122. Minimum Change Rule

Agents shall make the smallest complete implementation change.

They shall not:

* redesign unrelated modules;
* introduce speculative abstractions;
* add unused extension points;
* change public contracts unnecessarily;
* add dependencies without justification;
* rewrite working areas during a focused fix;
* weaken tests to obtain passing results;
* bypass architecture for convenience.

---

# 123. Dependency Rules

New dependencies shall be evaluated for:

* necessity;
* maintenance;
* license;
* security;
* size;
* platform compatibility;
* offline behavior;
* update policy;
* replacement difficulty.

Dependencies shall not be added solely because they are popular or convenient.

---

# 124. Generated Artifacts

Generated implementation artifacts shall identify their source.

Generated files shall not be edited manually unless explicitly designed for partial manual ownership.

Generation shall be reproducible.

---

# 125. Code Quality

Implementation code shall be:

* readable;
* typed where supported;
* testable;
* explicit;
* modular;
* appropriately documented;
* consistent with repository conventions.

Cleverness shall not take priority over maintainability.

---

# 126. Comments

Comments shall explain:

* architectural constraints;
* non-obvious rationale;
* invariants;
* workarounds;
* risk-sensitive behavior.

Comments shall not duplicate self-evident code.

Outdated comments are defects.

---

# 127. Naming

Implementation names shall align with the controlled architectural vocabulary.

Agents shall not create alternate names for established concepts.

Names shall reveal:

* responsibility;
* scope;
* lifecycle;
* ownership.

---

# 128. Source Structure

Source structure shall reflect implementation responsibilities.

It does not need to mirror documentation directories mechanically.

However, mapping between architecture, implementation and documentation shall remain clear.

---

# 129. Experimental Work

Experimental code shall be isolated.

It shall not become production architecture by accident.

Experiments shall define:

* hypothesis;
* scope;
* duration;
* evaluation criteria;
* cleanup;
* promotion path.

---

# 130. Feature Flags

Feature flags shall define:

* owner;
* purpose;
* default;
* scope;
* persistence;
* removal condition;
* compatibility;
* observability.

Permanent undocumented feature flags are prohibited.

---

# 131. Backward Compatibility

Compatibility obligations shall be explicit for:

* persisted data;
* public APIs;
* synchronization protocols;
* plugin contracts;
* exchange formats;
* configuration;
* backups.

Internal code compatibility may have different guarantees.

---

# 132. Deprecation

Deprecation shall define:

* deprecated element;
* replacement;
* notice period where applicable;
* compatibility period;
* migration path;
* removal condition.

Deprecated persisted or public contracts shall not be removed silently.

---

# 133. Data Migration

Data migration shall preserve:

* identity;
* integrity;
* provenance;
* version history;
* relationships;
* rollback or recovery;
* traceability.

Migration scripts shall be versioned and tested.

---

# 134. Security Review

Material implementation changes shall receive security review when they affect:

* authentication;
* authorization;
* plugins;
* providers;
* public APIs;
* remote execution;
* storage;
* synchronization;
* secrets;
* personal data.

---

# 135. Privacy Review

Material changes shall receive privacy review when they affect:

* AI;
* telemetry;
* logging;
* synchronization;
* external providers;
* cloud services;
* exports;
* plugins;
* shared data.

---

# 136. Performance Review

Performance-sensitive changes shall review:

* latency;
* throughput;
* memory;
* disk;
* CPU;
* GPU;
* queue behavior;
* network use;
* startup;
* scalability.

Performance improvements shall include evidence.

---

# 137. Review Process

Every material implementation change shall be reviewed for:

* architecture compliance;
* requirement satisfaction;
* technical correctness;
* contract impact;
* persistence impact;
* test coverage;
* security;
* privacy;
* performance;
* operations;
* documentation;
* completion criteria.

---

# 138. Change Classification

Implementation changes may be classified as:

## Editorial

Documentation-only, no semantic change.

## Corrective

Fixes incorrect implementation.

## Functional

Introduces or changes behavior within approved architecture.

## Structural

Changes implementation organization without changing architecture.

## Contractual

Changes an interface or persisted representation.

## Architectural

Changes an approved architectural decision.

Architectural changes require Governance.

---

# 139. Escalation Rules

An agent shall stop and escalate when:

* implementation requires contradicting frozen architecture;
* two approved contracts conflict;
* Domain ownership is unclear;
* data authority is ambiguous;
* a required change affects Source of Truth;
* compatibility cannot be preserved;
* migration safety cannot be established;
* security impact is unresolved;
* recovery behavior is unknown;
* a public contract change lacks versioning strategy.

The agent shall not resolve such issues by assumption.

---

# 140. Prohibited Actions

Agents working in Implementation shall not:

* silently redesign architecture;
* bypass contracts;
* bypass authorization;
* access authoritative storage from unauthorized layers;
* make caches authoritative;
* introduce unbounded queues;
* introduce infinite retries;
* hide errors;
* swallow integrity failures;
* expose secrets;
* log personal knowledge;
* use production user data as casual test data;
* skip migrations for persisted changes;
* weaken tests to hide defects;
* mark incomplete work as complete;
* create undocumented technical debt;
* modify unrelated modules unnecessarily.

---

# 141. Review Checklist

Before approving implementation work, verify:

* [ ] The objective is explicit.
* [ ] The affected requirements were reviewed.
* [ ] The affected architecture was reviewed.
* [ ] Relevant ADRs and amendments were reviewed.
* [ ] Ownership is explicit.
* [ ] Dependency direction is valid.
* [ ] Domain semantics are preserved.
* [ ] Master Library authority is preserved.
* [ ] Offline First is preserved.
* [ ] Contracts are explicit.
* [ ] Compatibility was evaluated.
* [ ] Persistence impact was evaluated.
* [ ] Migration impact was evaluated.
* [ ] Concurrency is defined.
* [ ] Transactions are defined.
* [ ] Idempotency is defined where required.
* [ ] Retry and timeout behavior are defined.
* [ ] Cancellation is supported where required.
* [ ] Recovery is defined.
* [ ] Resource use is bounded.
* [ ] Security was evaluated.
* [ ] Privacy was evaluated.
* [ ] Observability is sufficient.
* [ ] Tests cover relevant risks.
* [ ] Operations are documented.
* [ ] Traceability is complete.
* [ ] Known limitations are explicit.
* [ ] Completion criteria are satisfied.
* [ ] No silent architecture change was introduced.

---

# 142. Agent Reporting

After implementation work, the agent shall report:

* objective;
* files modified;
* module affected;
* requirements affected;
* architecture documents reviewed;
* ADRs and amendments reviewed;
* contracts affected;
* persistence impact;
* migration impact;
* synchronization impact;
* concurrency impact;
* security impact;
* privacy impact;
* performance impact;
* tests executed;
* validation results;
* operational impact;
* documentation updated;
* known limitations;
* unresolved risks;
* completion status.

---

# 143. Relationship with Module AGENTS

Module-level `AGENTS.md` files may add rules specific to their module.

They shall not weaken this document.

The effective rule set is:

```text
Repository AGENTS

+

Architecture AGENTS

+

Implementation AGENTS

+

Module AGENTS
```

When rules conflict, the higher-level authoritative rule prevails unless the lower-level rule is an explicit approved specialization.

---

# 144. Relationship with Master Library Implementation

The Master Library implementation is governed by:

```text
01-Implementation/01-MasterLibrary/AGENTS.md
```

That guide may define additional rules for:

* catalog;
* authoritative files;
* server;
* client;
* persistence;
* synchronization;
* operations;
* completion.

---

# 145. Relationship with Desktop Application

The Desktop Application implementation shall use its own module-level `AGENTS.md`.

That guide shall specialize rules for:

* macOS application architecture;
* workspace;
* windows;
* navigation;
* UI composition;
* session state;
* Local Library use;
* synchronization;
* restoration;
* platform integration.

---

# 146. Final Rule

Implementation exists to realize the approved KnowledgeOS architecture faithfully.

Architecture defines what must remain true.

Implementation defines how those truths become executable.

Every module shall have an owner.

Every contract shall have a purpose.

Every persisted state shall have authority.

Every failure shall have defined behavior.

Every migration shall preserve integrity.

Every long-running operation shall remain observable and recoverable.

Every implementation decision shall remain traceable.

When implementation convenience conflicts with approved architecture, convenience does not win.

The architecture shall be amended explicitly or the implementation shall conform.

Implementation is complete only when it is correct, testable, operable, documented and architecturally compliant.

---

# End of `01-Implementation/AGENTS.md`
