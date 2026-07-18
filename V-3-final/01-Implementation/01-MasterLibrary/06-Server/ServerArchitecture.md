

# Master Library Server Architecture

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Server

**Document:** Server Architecture

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the internal architecture of the KnowledgeOS Master Library Server.

It specifies:

* architectural layers;
* internal components;
* responsibilities;
* dependency direction;
* execution flows;
* transactional boundaries;
* Engine integration;
* persistence coordination;
* runtime behavior;
* deployment boundaries;
* failure isolation;
* architectural invariants.

The Master Library Server is the authoritative runtime responsible for exposing and coordinating operations over the Master Library.

---

# 2. Scope

This document applies to the implementation of the Master Library Server.

It covers:

* inbound server interfaces;
* request processing;
* command execution;
* query execution;
* application orchestration;
* Platform Engine integration;
* persistence integration;
* background execution;
* event processing;
* synchronization coordination;
* administration;
* observability;
* lifecycle management.

This document does not redefine:

* the KnowledgeOS Domain;
* Platform Engine responsibilities;
* public contract semantics;
* persistence schemas;
* client architecture;
* deployment procedures.

Those concerns are defined in their respective documents.

---

# 3. Architectural Goals

The server architecture shall provide:

* clear separation of concerns;
* deterministic execution;
* explicit authority boundaries;
* recoverable workflows;
* implementation independence;
* testability;
* replaceable infrastructure;
* controlled concurrency;
* failure isolation;
* secure operation;
* observable behavior;
* long-term evolvability.

---

# 4. Architectural Style

The Master Library Server uses a modular, layered and Engine-oriented architecture.

The implementation combines:

* Hexagonal Architecture;
* Ports and Adapters;
* Command Query Responsibility Segregation;
* event-driven coordination;
* explicit application workflows;
* dependency inversion;
* modular monolith deployment for the initial version.

The initial implementation is a modular monolith.

This does not mean the architecture is monolithic.

Internal boundaries remain explicit and enforceable.

---

# 5. Initial Deployment Unit

The initial Master Library Server is deployed as one application process or container.

```text
Master Library Server

├── Interface Modules
├── Application Modules
├── Engine Adapters
├── Persistence Adapters
├── Runtime Services
├── Security Services
└── Operations Services
```

The following remain separate deployment dependencies:

* PostgreSQL;
* authoritative storage volumes;
* backup storage;
* optional provider services;
* optional external AI services.

Future extraction into separate processes is permitted only when justified by operational requirements.

---

# 6. Architectural Layers

The server is divided into seven logical layers:

1. Interface Layer;
2. Application Layer;
3. Domain Integration Layer;
4. Engine Integration Layer;
5. Persistence Layer;
6. Runtime Layer;
7. Operations Layer.

The dependency direction is inward toward stable abstractions.

```text
Interface

↓

Application

↓

Domain and Engine Ports

↓

Persistence and Infrastructure Ports

↓

Adapters
```

Outer layers may depend on inner contracts.

Inner layers shall not depend on outer implementations.

---

# 7. Dependency Rules

The following dependency rules are mandatory:

* Interface depends on Application;
* Application depends on Domain contracts and ports;
* Domain does not depend on Interface;
* Domain does not depend on infrastructure;
* Engines are accessed through explicit ports;
* Persistence is accessed through repositories and storage services;
* infrastructure adapters implement ports;
* adapters do not redefine business rules;
* modules do not access another module’s private implementation;
* circular dependencies are prohibited.

Cross-module interaction occurs through:

* commands;
* queries;
* application ports;
* domain services;
* events;
* shared contract types.

---

# 8. Server Module Model

The server is organized into implementation modules.

```text
Server

├── Catalog Module
├── Publication Module
├── Acquisition Module
├── Synchronization Module
├── Administration Module
├── Security Module
├── Jobs Module
├── Events Module
├── Health Module
├── Configuration Module
└── Observability Module
```

Each module owns:

* its application use cases;
* its inbound handlers;
* its internal ports;
* its error mapping;
* its tests;
* its configuration section.

Modules shall not own authoritative data independently from the Domain and Persistence models.

---

# 9. Interface Layer

The Interface Layer exposes server capabilities to authorized clients and services.

It may include:

* REST endpoints;
* local API endpoints;
* GraphQL endpoints if adopted;
* WebSocket or event-stream endpoints;
* administrative endpoints;
* health endpoints.

The Interface Layer performs:

* protocol parsing;
* contract validation;
* authentication extraction;
* request context creation;
* command or query dispatch;
* response serialization;
* protocol-specific error mapping.

It shall not perform:

* domain validation;
* storage access;
* transaction coordination;
* Engine orchestration;
* business decisions.

---

# 10. Interface Components

Typical Interface components include:

```text
Interface

├── Controllers
├── Request Mappers
├── Response Mappers
├── Protocol Validators
├── Authentication Middleware
├── Authorization Guards
├── Rate Limiters
├── Exception Mappers
└── Correlation Middleware
```

Controllers remain thin.

A controller shall normally:

1. receive the request;
2. map it to a command or query;
3. dispatch it;
4. map the result;
5. return the response.

---

# 11. Request Context

Every request creates an immutable Request Context.

The context includes:

* RequestId;
* CorrelationId;
* authenticated identity;
* client identity;
* device identity when applicable;
* library identity;
* protocol information;
* request start time;
* locale;
* tracing context;
* authorization context.

The Request Context is propagated through the operation.

It shall not contain mutable domain state.

---

# 12. Application Layer

The Application Layer implements server use cases.

It coordinates:

* commands;
* queries;
* Domain services;
* Platform Engines;
* repositories;
* storage services;
* locks;
* transactions;
* jobs;
* events.

The Application Layer owns workflow order.

It does not own Domain rules.

---

# 13. Application Components

The Application Layer contains:

```text
Application

├── Command Handlers
├── Query Handlers
├── Application Services
├── Workflow Coordinators
├── Transaction Coordinators
├── Authorization Policies
├── Idempotency Services
└── Result Mappers
```

Each command or query has one primary handler.

Handlers shall remain focused on one use case.

---

# 14. Command Model

Commands represent requests to change authoritative or operational state.

A command contains:

* command type;
* input data;
* actor identity;
* target resource;
* expected revision where applicable;
* idempotency key where applicable;
* correlation information.

Commands are immutable after creation.

Examples:

* `CreatePublication`;
* `UpdatePublicationMetadata`;
* `RegisterSourceVersion`;
* `ReplaceCover`;
* `AttachAsset`;
* `StartAcquisition`;
* `StartSynchronization`;
* `CreateBackup`;
* `ExecuteRecovery`.

---

# 15. Command Execution Flow

The standard command flow is:

```text
Inbound Request

↓

Protocol Validation

↓

Authentication

↓

Authorization

↓

Command Construction

↓

Idempotency Check

↓

Application Validation

↓

Lock Acquisition

↓

Transaction or Coordinated Commit

↓

Domain Operation

↓

Persistence

↓

Outbox Registration

↓

Commit

↓

Lock Release

↓

Response
```

Not every command requires every step.

Any omitted step must be justified by the command contract.

---

# 16. Command Handler Responsibilities

A Command Handler is responsible for:

* validating command-level preconditions;
* loading required aggregates;
* verifying expected revisions;
* acquiring required locks;
* invoking Domain behavior;
* coordinating persistence;
* registering resulting events;
* returning a stable application result.

A Command Handler shall not:

* parse network protocols;
* build raw SQL;
* manipulate storage paths;
* expose infrastructure exceptions;
* silently retry non-idempotent actions;
* mutate unrelated aggregates without explicit coordination.

---

# 17. Query Model

Queries retrieve information without changing authoritative state.

A query contains:

* query type;
* filters;
* sorting;
* pagination;
* projection selection;
* authorization context;
* correlation information.

Examples:

* `GetPublication`;
* `ListPublications`;
* `SearchCatalog`;
* `GetAcquisitionStatus`;
* `GetSynchronizationStatus`;
* `GetJobStatus`;
* `GetLibraryHealth`.

---

# 18. Query Execution Flow

The standard query flow is:

```text
Inbound Request

↓

Protocol Validation

↓

Authentication

↓

Authorization

↓

Query Construction

↓

Query Handler

↓

Repository or Projection

↓

Result Filtering

↓

Response Mapping

↓

Response
```

Queries shall not trigger hidden writes.

Telemetry and access audit do not count as authoritative mutation.

---

# 19. Query Sources

Queries may read from:

* authoritative Catalog tables;
* read projections;
* search indexes;
* job storage;
* health state;
* audit projections;
* synchronization projections.

The source selected depends on the query contract.

Derived projections shall indicate their freshness where relevant.

---

# 20. Domain Integration Layer

The Domain Integration Layer connects Application workflows to the Master Library Domain model.

It includes:

* aggregates;
* entities;
* value objects;
* Domain services;
* Domain events;
* repository ports;
* policies;
* specifications.

The server shall use Domain behavior rather than duplicating Domain rules in handlers.

---

# 21. Aggregate Boundaries

Transactions and concurrency controls should align with aggregate boundaries.

Primary aggregates may include:

* Publication;
* Asset;
* Collection;
* Acquisition;
* Synchronization Session;
* Backup Operation;
* Recovery Operation.

One aggregate protects one internal consistency boundary.

Cross-aggregate workflows require explicit coordination.

---

# 22. Domain Event Handling

Domain events describe facts that occurred inside the Domain.

Examples:

* `PublicationCreated`;
* `PublicationMetadataUpdated`;
* `SourceVersionRegistered`;
* `CoverRevisionChanged`;
* `AssetAttached`;
* `PublicationArchived`.

Domain events are produced during Domain execution.

They are persisted or converted into integration events only after successful commit.

---

# 23. Engine Integration Layer

Platform Engines are integrated through explicit application ports.

```text
Application Workflow

↓

Engine Port

↓

Engine Adapter

↓

Platform Engine
```

The server does not instantiate Engine-specific behavior directly inside controllers or repositories.

---

# 24. Engine Ports

An Engine port defines:

* supported operations;
* input contracts;
* output contracts;
* failure contracts;
* execution semantics;
* cancellation semantics;
* progress semantics;
* idempotency expectations.

Ports belong to the consuming architectural boundary.

Adapters belong to infrastructure or integration modules.

---

# 25. Library Engine Integration

The Library Engine provides authoritative library behavior.

The server uses it for:

* Publication lifecycle;
* metadata transitions;
* source registration;
* cover management;
* asset management;
* relationship management;
* collection management;
* library validation.

The Library Engine shall not depend on HTTP, database drivers or container configuration.

---

# 26. Import and Acquisition Integration

The Acquisition module coordinates the Import Engine.

Its flow is:

```text
Create Acquisition

↓

Validate Provider

↓

Discover Source

↓

Stage Content

↓

Verify Content

↓

Analyze Duplicate Candidates

↓

Prepare Commit

↓

Register Authoritative Objects

↓

Schedule Further Processing
```

Acquisition may be synchronous for small inputs and asynchronous for long-running inputs.

The authoritative commit remains explicit in both cases.

---

# 27. Search Integration

Search is treated as a derived capability.

The Search Engine consumes:

* committed events;
* authoritative identifiers;
* metadata projections;
* processed content;
* semantic data.

The Search Engine shall not mutate Publication authority.

Search index failure does not invalidate the Catalog.

---

# 28. Synchronization Integration

Synchronization is coordinated as a long-running workflow.

```text
Open Session

↓

Authenticate Client and Device

↓

Exchange Capabilities

↓

Compare Revisions

↓

Transfer Changes

↓

Validate Changes

↓

Detect Conflicts

↓

Acquire Locks

↓

Commit Accepted Changes

↓

Publish Result

↓

Close Session
```

Synchronization state is operational.

Committed resulting revisions are authoritative.

---

# 29. AI Integration

AI execution is isolated behind the AI Engine port.

The server controls:

* provider selection;
* privacy classification;
* input minimization;
* authorization;
* timeout;
* retry;
* cost controls;
* output validation;
* user acceptance requirements.

AI results shall be classified as:

* suggestion;
* derived result;
* accepted authoritative change.

Only the last category modifies authoritative state.

---

# 30. Persistence Layer

The Persistence Layer implements access to authoritative and operational storage.

It contains:

* repositories;
* Catalog adapters;
* Source Storage adapters;
* Cover Storage adapters;
* Asset Storage adapters;
* manifest services;
* checksum services;
* lock persistence;
* job persistence;
* event persistence;
* idempotency persistence.

Persistence components implement ports defined by stable inner layers.

---

# 31. Repository Model

Repositories expose aggregate-oriented persistence operations.

Examples:

* `PublicationRepository`;
* `AssetRepository`;
* `CollectionRepository`;
* `AcquisitionRepository`;
* `SynchronizationSessionRepository`.

Repositories shall not expose:

* database table structure;
* SQL concepts;
* filesystem paths;
* storage driver objects.

Repositories return Domain or application-level types.

---

# 32. Storage Service Model

Binary storage is accessed through specialized services.

Examples:

* `SourceStorageService`;
* `CoverStorageService`;
* `AssetStorageService`;
* `BackupStorageService`;
* `TemporaryStorageService`.

Storage services handle:

* staging;
* checksums;
* atomic publication;
* versioned paths;
* binary verification;
* cleanup.

Storage services do not assign Domain identity based on paths or checksums.

---

# 33. Transaction Management

Database transactions are controlled by the Application or Persistence coordination boundary.

Transaction boundaries shall be explicit.

A transaction shall:

* be short;
* avoid external network calls;
* avoid long-running processing;
* preserve aggregate consistency;
* include outbox registration where required.

Long-running workflows shall not hold open database transactions.

---

# 34. Coordinated Commit

Operations involving database and binary storage use a coordinated commit protocol.

Typical sequence:

```text
Validate Input

↓

Create Staging Record

↓

Write Binary to Staging

↓

Calculate Checksum

↓

Verify Binary

↓

Open Database Transaction

↓

Persist Metadata and Manifest

↓

Register Events

↓

Commit Database

↓

Publish Binary to Authoritative Location

↓

Finalize Operation

↓

Run Integrity Verification
```

The exact sequence may vary by operation, but every failure point must remain recoverable.

---

# 35. Outbox Pattern

Integration events are persisted using an Outbox mechanism.

The Outbox ensures that:

* Domain state and event intent commit together;
* events are not lost after database commit;
* event publication may be retried;
* duplicate delivery is tolerated;
* ordering metadata is preserved.

Outbox records are operational metadata.

They are not Domain entities.

---

# 36. Inbox Pattern

Consumers that process integration events may use an Inbox mechanism.

The Inbox records processed message identities.

It prevents duplicated event delivery from producing duplicated authoritative effects.

Inbox retention shall be configurable.

---

# 37. Runtime Layer

The Runtime Layer manages process execution beyond individual requests.

It includes:

* background job execution;
* scheduling;
* event dispatch;
* retry coordination;
* cancellation;
* resource limits;
* graceful shutdown;
* workflow resumption.

Runtime services shall not contain Domain rules.

---

# 38. Background Job Architecture

Long-running work is represented as jobs.

```text
Job Request

↓

Job Record

↓

Queue

↓

Worker

↓

Progress Updates

↓

Checkpoint

↓

Completion or Failure
```

Jobs may execute in the same server process initially.

The architecture shall permit future worker separation.

---

# 39. Job States

A job may have the following states:

```text
Pending

↓

Scheduled

↓

Running

↓

Succeeded
```

Alternative terminal or transitional states include:

* Paused;
* Cancelling;
* Cancelled;
* Retrying;
* Failed;
* RecoveryRequired.

State transitions shall be explicit and validated.

---

# 40. Job Idempotency

Job handlers shall be idempotent where technically possible.

A retried job shall not:

* create duplicated Publications;
* register duplicated SourceVersions;
* publish duplicated authoritative revisions;
* attach duplicated Assets;
* corrupt progress state.

Where strict idempotency is not possible, the job shall define compensation and recovery rules.

---

# 41. Job Checkpointing

Long-running jobs persist checkpoints.

A checkpoint may contain:

* last completed stage;
* last processed item;
* progress counters;
* continuation token;
* partial result references;
* lease information.

Checkpoints allow restart without repeating completed authoritative work.

---

# 42. Scheduling

Scheduled operations may include:

* integrity verification;
* backup;
* cleanup;
* index maintenance;
* lock cleanup;
* expired session cleanup;
* provider health checks;
* metrics aggregation.

Scheduling creates jobs.

The scheduler shall not execute Domain mutations directly.

---

# 43. Event Processing

Event processing is asynchronous by default.

The event runtime provides:

* subscription registration;
* delivery;
* retry;
* ordering metadata;
* dead-letter handling;
* observability;
* consumer isolation.

A failing optional consumer shall not roll back the original authoritative commit.

---

# 44. Event Ordering

Events preserve ordering within the smallest required scope.

Possible ordering scopes include:

* aggregate;
* Publication;
* synchronization session;
* job;
* library.

Global ordering is avoided unless strictly necessary.

Consumers shall not assume ordering across unrelated aggregates.

---

# 45. Retry Architecture

Retries are controlled by explicit policies.

Retry decisions depend on error classification.

Retryable errors may include:

* temporary database unavailability;
* provider timeout;
* transient network failure;
* temporary storage unavailability.

Non-retryable errors include:

* validation failure;
* authorization failure;
* unsupported version;
* checksum mismatch requiring investigation;
* invariant violation.

Retries use bounded attempts and backoff.

---

# 46. Dead-Letter Handling

Messages or jobs that exceed retry policy enter a dead-letter state.

Dead-letter entries contain:

* original operation identity;
* failure history;
* last error;
* retry count;
* timestamps;
* correlation data;
* remediation status.

Dead-letter processing requires explicit operational handling.

---

# 47. Concurrency Model

The server combines:

* optimistic concurrency;
* lease-based locking;
* database transaction isolation;
* idempotency controls;
* immutable revision history.

Optimistic concurrency is preferred for short metadata operations.

Leases are used for long-running or cross-storage workflows.

---

# 48. Optimistic Concurrency Control

Mutable aggregates contain a revision value.

A modifying command supplies or resolves the expected revision.

Commit succeeds only if the stored revision matches.

On mismatch, the server returns a conflict result.

It shall not silently overwrite concurrent changes.

---

# 49. Lease Integration

Leases protect resources during operations such as:

* acquisition commit;
* source replacement;
* synchronization;
* restore;
* recovery;
* migration;
* backup consistency-point creation.

Lease ownership is associated with an operation identity, not only a process identity.

---

# 50. Idempotency Architecture

Idempotency is implemented through an Idempotency Service.

An idempotency record contains:

* key;
* operation type;
* actor;
* request fingerprint;
* status;
* result reference;
* creation time;
* expiration policy.

The same key and same request return the previous result.

The same key with different input is rejected.

---

# 51. Security Layer

Security is a cross-cutting architectural concern.

It includes:

* authentication;
* authorization;
* credential management;
* secret access;
* encryption;
* input protection;
* network controls;
* audit;
* plugin isolation;
* provider isolation.

Security enforcement occurs at multiple layers.

Interface security alone is insufficient.

---

# 52. Authentication Boundary

Authentication occurs before protected application dispatch.

The authenticated principal becomes part of the Request Context.

The server shall distinguish:

* human users;
* devices;
* services;
* plugins;
* administrators.

Identity types may have different authentication mechanisms.

---

# 53. Authorization Boundary

Authorization is enforced:

* before command execution;
* before protected query execution;
* before returning sensitive fields;
* before administrative actions;
* before provider access;
* before plugin capability use.

Domain-level ownership and state restrictions may require additional authorization checks inside Application workflows.

---

# 54. Operations Layer

The Operations Layer exposes and coordinates:

* health;
* readiness;
* diagnostics;
* metrics;
* tracing;
* audit inspection;
* job management;
* lock inspection;
* backup;
* restore;
* recovery;
* migration.

Administrative actions are separated from normal library operations.

---

# 55. Health Architecture

Health is modeled as a set of independent checks.

```text
Server Health

├── Process Health
├── Database Health
├── Storage Health
├── Catalog Health
├── Job Runtime Health
├── Event Runtime Health
├── Provider Health
└── Library Integrity Health
```

Health reports distinguish:

* healthy;
* degraded;
* unavailable;
* unknown.

Optional dependency degradation does not necessarily make the server unavailable.

---

# 56. Readiness Rules

The server reports ready only when:

* configuration is valid;
* required secrets are available;
* PostgreSQL is reachable;
* schema compatibility is valid;
* authoritative storage is accessible;
* storage layout is compatible;
* mandatory Engines are initialized;
* critical recovery checks are complete;
* no blocking migration is required.

---

# 57. Observability Architecture

Observability is integrated into all execution paths.

Every operation emits appropriate:

* logs;
* metrics;
* traces;
* audit records;
* state transitions.

Correlation identifiers connect:

* inbound requests;
* commands;
* jobs;
* events;
* storage operations;
* provider calls.

---

# 58. Logging

Logs are structured.

Each log record may contain:

* timestamp;
* severity;
* component;
* operation;
* RequestId;
* CorrelationId;
* JobId;
* actor classification;
* resource identity;
* result;
* error classification.

Logs shall not contain:

* passwords;
* access tokens;
* private keys;
* full sensitive documents;
* unrestricted personal metadata.

---

# 59. Metrics

Server metrics include:

* request rate;
* request latency;
* error rate;
* active jobs;
* queue depth;
* retry count;
* dead-letter count;
* database pool usage;
* storage latency;
* synchronization duration;
* acquisition duration;
* integrity failures;
* backup status.

Metrics shall not expose sensitive content.

---

# 60. Tracing

Tracing captures cross-component execution.

Trace spans may include:

* controller execution;
* command dispatch;
* transaction execution;
* repository access;
* storage operations;
* Engine calls;
* provider calls;
* event publication;
* job stages.

Sampling policy shall be configurable.

---

# 61. Error Architecture

Errors are represented internally as typed failures.

Primary categories include:

* ValidationFailure;
* AuthenticationFailure;
* AuthorizationFailure;
* NotFoundFailure;
* ConflictFailure;
* IntegrityFailure;
* DependencyFailure;
* StorageFailure;
* ProviderFailure;
* TimeoutFailure;
* CompatibilityFailure;
* InternalFailure.

Infrastructure exceptions are translated before crossing application boundaries.

---

# 62. Failure Propagation

Failure propagation follows these rules:

* preserve the original cause internally;
* expose stable error codes externally;
* include correlation identifiers;
* avoid leaking implementation details;
* classify retryability;
* record operational severity;
* preserve partial workflow state for recovery.

---

# 63. Failure Isolation

Subsystems are isolated according to criticality.

### Critical dependencies

* PostgreSQL;
* Catalog Storage;
* authoritative Source Storage;
* configuration;
* security services.

Failure may prevent readiness.

### Degradable dependencies

* Search Engine;
* AI providers;
* export providers;
* optional plugins;
* optional analytics.

Failure reduces capability but should not corrupt or disable core library authority.

---

# 64. Configuration Architecture

Configuration is loaded through a Configuration Service.

Sources may include:

* static configuration files;
* environment variables;
* secret stores;
* deployment-specific overrides;
* administrative configuration records.

Configuration precedence shall be explicit and deterministic.

---

# 65. Configuration Validation

Configuration is validated before server readiness.

Validation covers:

* required values;
* data types;
* ranges;
* paths;
* network bindings;
* dependency addresses;
* security settings;
* incompatible combinations;
* deprecated options.

Invalid mandatory configuration prevents startup.

---

# 66. Dynamic Configuration

Only explicitly marked settings may change at runtime.

Examples may include:

* log levels;
* job concurrency;
* rate limits;
* optional feature flags;
* provider enablement.

Changes affecting authority, storage layout or security boundaries require controlled restart or administrative workflow.

---

# 67. Deployment Architecture

The initial deployment topology is:

```text
Client Devices
      │
      ▼
Private Network or Secure Tunnel
      │
      ▼
Reverse Proxy or Direct Private Endpoint
      │
      ▼
Master Library Server Container
      │
      ├── PostgreSQL Container
      ├── Authoritative Library Volume
      ├── Temporary Volume
      └── Backup Destination
```

The reverse proxy is optional in trusted local deployments but recommended when TLS termination or centralized access control is required.

---

# 68. Container Boundary

The server container includes:

* application runtime;
* server binaries;
* migrations;
* configuration templates;
* health probes.

The server container shall not include the only copy of:

* Catalog data;
* source files;
* covers;
* assets;
* backups;
* secrets.

Containers are disposable deployment units.

---

# 69. PostgreSQL Boundary

PostgreSQL runs in a separate container or managed service.

The server accesses it through a dedicated application role.

Administrative database credentials are not used during normal application operation.

Database connection pooling is bounded and observable.

---

# 70. Storage Boundary

Authoritative storage is mounted into the server using controlled paths.

The server validates:

* mount presence;
* permissions;
* storage identity;
* layout version;
* write capability;
* available capacity where possible.

Mount paths are deployment details and never become Domain identifiers.

---

# 71. Network Boundary

The server binds only to configured network interfaces.

Default exposure is private.

Network architecture shall support:

* TLS;
* trusted proxy validation;
* request size limits;
* connection limits;
* timeout limits;
* IP filtering where required;
* secure remote access through VPN or equivalent.

---

# 72. Startup Architecture

Startup is executed as ordered phases.

```text
Phase 1 — Bootstrap

↓

Phase 2 — Configuration

↓

Phase 3 — Security Initialization

↓

Phase 4 — Dependency Connection

↓

Phase 5 — Compatibility Validation

↓

Phase 6 — Recovery Inspection

↓

Phase 7 — Module Initialization

↓

Phase 8 — Runtime Initialization

↓

Phase 9 — Endpoint Activation

↓

Phase 10 — Readiness Publication
```

Failure in a mandatory phase prevents readiness.

---

# 73. Bootstrap Phase

The Bootstrap phase initializes only the minimum required runtime.

It includes:

* process identity;
* basic logging;
* startup correlation;
* fatal error handling;
* configuration source discovery.

No Domain or storage operation occurs before configuration validation.

---

# 74. Compatibility Phase

Compatibility validation checks:

* application version;
* Catalog schema version;
* storage layout version;
* Master Library version;
* contract compatibility;
* mandatory Engine compatibility;
* plugin compatibility;
* migration requirements.

Unsupported incompatibility stops startup.

---

# 75. Recovery Inspection Phase

Before accepting writes, the server checks for:

* incomplete coordinated commits;
* abandoned leases;
* interrupted jobs;
* staged binaries;
* incomplete migrations;
* pending restore;
* required integrity verification.

The server may enter a restricted recovery mode.

---

# 76. Restricted Modes

The server may operate in restricted modes.

Examples:

* read-only mode;
* recovery mode;
* migration-required mode;
* degraded mode;
* maintenance mode.

The current mode shall be visible through health and administration interfaces.

Restricted mode transitions are explicit and auditable.

---

# 77. Shutdown Architecture

Graceful shutdown performs:

* readiness removal;
* new request rejection;
* request draining;
* job scheduling suspension;
* job checkpointing;
* event flush;
* lease release;
* database pool closure;
* storage cleanup;
* final telemetry flush.

The shutdown deadline is configurable.

---

# 78. Abrupt Failure Behavior

The architecture assumes the process may terminate without graceful shutdown.

Therefore:

* database transactions are atomic;
* authoritative binaries use staged publication;
* leases expire;
* jobs checkpoint;
* events use Outbox;
* idempotency records survive restart;
* recovery inspects incomplete operations.

Abrupt failure shall not produce undetectable corruption.

---

# 79. Scalability Model

The initial server may run as a single instance.

Scalability is achieved first through:

* efficient queries;
* bounded caching;
* job concurrency control;
* asynchronous execution;
* optimized storage access;
* resource backpressure.

Multiple server instances are not required for the initial version.

---

# 80. Future Multi-Instance Support

The architecture may later support multiple instances if:

* locking is shared;
* idempotency storage is shared;
* job ownership is coordinated;
* event processing is coordinated;
* caches are non-authoritative;
* session state is externalized;
* storage access remains consistent.

No implementation may assume permanent single-process ownership of authoritative resources.

---

# 81. Performance Boundaries

Performance optimization shall preserve correctness.

The server may optimize:

* read projections;
* cache usage;
* batch operations;
* database indexing;
* streaming;
* parallel processing;
* prefetching.

It shall not optimize by:

* bypassing validation;
* weakening authorization;
* skipping integrity checks;
* creating hidden mutable copies;
* making derived indexes authoritative.

---

# 82. Caching Architecture

Caches may exist at:

* query result level;
* metadata level;
* configuration level;
* capability level;
* provider discovery level.

Each cache defines:

* key;
* scope;
* time-to-live;
* invalidation rule;
* maximum size;
* fallback behavior.

Caches remain optional and reconstructable.

---

# 83. Temporary and Staging Architecture

Temporary and staging areas are distinct.

### Temporary area

Used for disposable processing artifacts.

### Staging area

Used for operations preparing authoritative commit.

Staged content is tracked.

Temporary content may be deleted without affecting authoritative state.

Staged content requires recovery-aware cleanup.

---

# 84. API Version Integration

The Interface Layer supports versioned contracts.

Contract versions map to stable Application commands and queries.

Protocol evolution shall not force Domain duplication.

Deprecated contract versions follow explicit support and removal policies.

---

# 85. Plugin Boundary

Plugins interact through declared extension points.

They may contribute:

* providers;
* processors;
* exporters;
* metadata enrichers;
* UI-facing capabilities;
* event consumers.

Plugins do not receive unrestricted access to internal modules.

All plugin calls pass through capability-controlled adapters.

---

# 86. Provider Boundary

Providers are external capability implementations.

Examples include:

* OCR provider;
* AI provider;
* storage provider;
* import provider;
* export provider;
* synchronization provider.

Provider adapters translate between provider-specific behavior and KnowledgeOS contracts.

Provider failures remain isolated and typed.

---

# 87. Testing Architecture

The architecture supports testing at multiple levels.

### Unit tests

Test isolated handlers, policies, Domain behavior and adapters.

### Integration tests

Test database, storage, events and module composition.

### Contract tests

Verify public and internal contracts.

### End-to-end tests

Verify complete server workflows.

### Recovery tests

Verify interrupted and failed operations.

---

# 88. Architectural Enforcement

Architectural boundaries shall be enforced using:

* module visibility;
* dependency rules;
* static analysis;
* package boundaries;
* code review;
* architecture tests;
* naming conventions;
* test ownership.

Documentation alone is not sufficient enforcement.

---

# 89. Internal Package Organization

A recommended module layout is:

```text
server/
├── bootstrap/
├── interface/
├── application/
├── domain/
├── engines/
├── persistence/
├── runtime/
├── security/
├── operations/
├── configuration/
└── shared/
```

Each functional module may reproduce these internal layers where appropriate.

The final code structure may adapt to the selected implementation language while preserving the architectural boundaries.

---

# 90. Shared Components

The shared area may contain only truly transversal abstractions.

Allowed examples:

* identifiers;
* clock interface;
* result types;
* pagination primitives;
* correlation types;
* common errors;
* transaction interfaces.

The shared area shall not become a miscellaneous dependency container.

Domain-specific concepts remain inside their owning module.

---

# 91. Architectural Decisions Deferred

The following implementation details may remain deferred until technology selection or coding:

* exact programming language;
* exact web framework;
* exact ORM or query library;
* exact queue implementation;
* exact tracing backend;
* exact reverse proxy;
* exact secret manager.

Any selected technology must comply with this architecture.

---

# 92. Prohibited Dependencies

The following dependencies are prohibited:

* Domain depending on controllers;
* Domain depending on ORM entities;
* Application depending on HTTP request objects;
* controllers executing SQL;
* repositories returning database rows directly;
* Engines accessing deployment configuration globally;
* plugins importing internal server modules;
* query handlers mutating aggregates;
* background workers bypassing authorization or application policies.

---

# 93. Architectural Invariants

The following invariants are mandatory:

* the server is the only normal authoritative write gateway;
* every request executes within a Request Context;
* controllers remain protocol adapters;
* commands represent explicit mutation intentions;
* queries do not perform hidden authoritative mutations;
* Application workflows own orchestration order;
* Domain components own business invariants;
* Engines are accessed through explicit ports;
* persistence is accessed through repositories and storage services;
* storage locations never become Domain identity;
* database transactions remain bounded;
* long-running operations use jobs rather than open transactions;
* cross-storage commits remain recoverable;
* events are published only from committed state;
* duplicate event delivery is tolerated;
* conflicting writes are rejected or explicitly resolved;
* infrastructure failures are translated into stable failures;
* optional subsystem failure does not corrupt core authority;
* readiness reflects dependency and compatibility state;
* every critical workflow is observable;
* abrupt process termination remains recoverable;
* derived state never overrides authoritative state;
* security is enforced beyond the Interface Layer;
* architectural boundaries are testable and enforceable.

---

# 94. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitectureModel.md`
* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/CommandBus.md`
* `00-Architecture/03-Kernel/QueryBus.md`
* `00-Architecture/03-Kernel/EventBus.md`
* `00-Architecture/03-Kernel/JobSystem.md`
* `00-Architecture/03-Kernel/WorkflowEngine.md`
* `00-Architecture/04-Platform/README.md`
* `00-Architecture/05-Integration/README.md`
* `00-Architecture/06-Execution/README.md`

## Master Library

* `01-Requirements/Scope.md`
* `01-Requirements/UseCases.md`
* `02-TechnicalDesign/SystemDesign.md`
* `02-TechnicalDesign/ServerDesign.md`
* `02-TechnicalDesign/DataFlow.md`
* `02-TechnicalDesign/ErrorModel.md`
* `03-Domain/DomainModel.md`
* `03-Domain/States.md`
* `04-Contracts/ServerContracts.md`
* `04-Contracts/APIConventions.md`
* `04-Contracts/ErrorContracts.md`
* `04-Contracts/HealthContracts.md`
* `05-Persistence/README.md`
* `05-Persistence/StorageArchitecture.md`
* `05-Persistence/Consistency.md`
* `05-Persistence/Locking.md`
* `05-Persistence/Recovery.md`
* `06-Server/README.md`
* `06-Server/Configuration.md`
* `06-Server/Security.md`
* `07-Client/ClientArchitecture.md`
* `08-Testing/TestStrategy.md`
* `09-Operations/Deployment.md`
* `09-Operations/Observability.md`

---

# 95. Status

**Approved**

The Master Library Server Architecture is frozen as the authoritative internal architecture for the KnowledgeOS Master Library Server.

The initial implementation is a modular monolith deployed as a disposable server container, with PostgreSQL and authoritative storage maintained as independent persistent infrastructure.

The architecture preserves explicit boundaries between interfaces, application workflows, Domain behavior, Platform Engines, persistence, runtime execution, security and operations.

It provides a deterministic, secure, observable and recoverable foundation for implementing the authoritative Master Library runtime.
