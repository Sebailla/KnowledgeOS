
# Master Library Server

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Server

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation responsibilities, boundaries and operating model of the KnowledgeOS Master Library Server.

The Master Library Server is the authoritative runtime responsible for managing the Master Library stored on the NAS.

It exposes controlled access to the library, coordinates application workflows, executes authoritative operations and protects the consistency and integrity of persistent knowledge.

The server does not replace the architectural Engines defined by KnowledgeOS.

It hosts, coordinates and exposes them through stable implementation boundaries.

---

# 2. Scope

The Master Library Server is responsible for:

* exposing the Master Library API;
* authenticating and authorizing clients;
* executing commands;
* serving queries;
* coordinating application services;
* invoking platform Engines;
* managing persistence;
* scheduling background jobs;
* publishing operational events;
* enforcing consistency;
* enforcing locking;
* exposing health information;
* producing logs, metrics and traces;
* coordinating backup and recovery operations;
* supporting synchronization with Local Libraries.

The server is not responsible for:

* client user interfaces;
* local offline editing;
* local rendering;
* client-side caching;
* direct device storage management;
* plugin user interfaces;
* replacing the Domain model;
* redefining architectural contracts.

---

# 3. Architectural Role

The Master Library Server is the authoritative application host for one Master Library.

Its architectural position is:

```text
Clients

↓

Server Interface

↓

Application Layer

↓

Platform Engines

↓

Persistence Services

↓

Master Library Storage
```

The server coordinates these layers but does not collapse them into a single implementation unit.

---

# 4. Authority Model

For authoritative library state, the Master Library Server is the only supported write gateway.

Clients shall not directly modify:

* PostgreSQL data;
* authoritative source files;
* cover files;
* asset files;
* storage manifests;
* backup metadata;
* recovery metadata.

All authoritative mutations pass through server contracts and application workflows.

Read-only administrative access to underlying infrastructure may exist for diagnostics, but it shall not become an application integration mechanism.

---

# 5. Deployment Context

The Master Library Server is deployed on or near the NAS that hosts the Master Library.

The initial deployment model uses containers.

```text
NAS Host

├── Master Library Server Container
├── PostgreSQL Container
├── Authoritative Library Volume
├── PostgreSQL Volume
└── Operational Backup Location
```

The server container and PostgreSQL container use independent persistent volumes.

The server application is replaceable.

Authoritative data is not stored inside the disposable container filesystem.

---

# 6. Server Responsibilities

The server has six principal responsibilities:

1. Interface management;
2. Workflow coordination;
3. Authority enforcement;
4. Engine orchestration;
5. Persistence coordination;
6. Operational supervision.

These responsibilities shall remain separated internally.

---

# 7. Server Architecture

The logical server architecture is:

```text
Master Library Server

├── Interface Layer
│   ├── API Endpoints
│   ├── Authentication
│   ├── Request Validation
│   └── Response Mapping
│
├── Application Layer
│   ├── Command Handlers
│   ├── Query Handlers
│   ├── Application Services
│   └── Workflow Coordinators
│
├── Engine Integration Layer
│   ├── Library Engine
│   ├── Import Engine
│   ├── Search Engine
│   ├── Sync Engine
│   ├── Export Engine
│   ├── AI Engine
│   └── Annotation Engine
│
├── Persistence Layer
│   ├── Catalog Storage
│   ├── Source Storage
│   ├── Cover Storage
│   ├── Asset Storage
│   ├── Lock Manager
│   └── Integrity Services
│
├── Runtime Layer
│   ├── Job Execution
│   ├── Scheduling
│   ├── Event Processing
│   └── Resource Management
│
└── Operations Layer
    ├── Health
    ├── Logging
    ├── Metrics
    ├── Tracing
    └── Administration
```

This model is logical.

It does not require each component to be deployed as a separate process.

---

# 8. Interface Layer

The Interface Layer is the external boundary of the server.

It is responsible for:

* accepting requests;
* validating request structure;
* authenticating identities;
* authorizing operations;
* mapping contracts to commands and queries;
* mapping results to contract responses;
* assigning correlation identifiers;
* enforcing protocol limits.

The Interface Layer shall not contain domain logic.

---

# 9. Application Layer

The Application Layer coordinates use cases.

It is responsible for:

* receiving validated commands;
* executing queries;
* coordinating domain operations;
* invoking Engines;
* opening transactional boundaries;
* acquiring locks;
* scheduling asynchronous work;
* translating operational failures into application errors.

Application services orchestrate.

They do not become storage abstractions or domain entities.

---

# 10. Command Processing

Commands represent intentions to modify state.

Examples include:

* create Publication;
* update metadata;
* acquire Publication;
* replace cover;
* attach Asset;
* start synchronization;
* restore backup;
* execute recovery.

Command processing follows this sequence:

```text
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Lock Acquisition

↓

Command Execution

↓

Persistence Commit

↓

Event Publication

↓

Response
```

A successful response shall never be returned before the authoritative commit is complete.

---

# 11. Query Processing

Queries retrieve state without modifying authoritative data.

Queries may access:

* the Catalog;
* projections;
* search indexes;
* health information;
* operational status;
* synchronization status;
* job status.

Queries shall not trigger hidden authoritative mutations.

Any required mutation shall be expressed as an explicit command.

---

# 12. Engine Integration

The server integrates Platform Engines through explicit contracts.

The server shall not depend on private implementation details of an Engine.

Each Engine exposes:

* capabilities;
* commands;
* queries;
* events;
* configuration requirements;
* failure contracts.

The server determines when an Engine is invoked.

The Engine determines how its responsibility is executed.

---

# 13. Library Engine

The Library Engine governs authoritative library operations.

It is responsible for:

* Publication lifecycle;
* metadata management;
* collection management;
* relationship management;
* source registration;
* cover registration;
* asset registration;
* library invariants.

The server exposes these capabilities through implementation contracts.

---

# 14. Import Engine

The Import Engine acquires external resources and prepares them for authoritative registration.

The server coordinates:

* import session creation;
* source validation;
* provider selection;
* duplicate analysis;
* import progress;
* commit handoff.

Import processing may continue asynchronously after the initial request.

---

# 15. Search Engine

The Search Engine provides retrieval capabilities.

The server coordinates:

* query validation;
* authorization filtering;
* search execution;
* result pagination;
* result mapping;
* index status.

Search projections are derived.

They never override Catalog authority.

---

# 16. Synchronization Engine

The Synchronization Engine coordinates state exchange between:

* Master Library;
* Local Libraries;
* authorized clients.

The server is responsible for:

* synchronization session authority;
* change negotiation;
* conflict detection;
* revision validation;
* authoritative commit;
* synchronization audit.

Clients never unilaterally declare authoritative results.

---

# 17. AI Engine

The AI Engine may perform:

* metadata suggestions;
* classification;
* summarization;
* embedding generation;
* semantic enrichment;
* assisted discovery.

AI results are proposals or derived data unless explicitly accepted through an authoritative command.

The server shall never permit AI execution to bypass authorization, privacy rules or domain validation.

---

# 18. Background Jobs

Long-running operations execute as background jobs.

Examples include:

* large imports;
* checksum verification;
* integrity scans;
* index rebuilds;
* synchronization;
* backup creation;
* restore preparation;
* recovery;
* AI processing.

Background jobs shall be:

* identifiable;
* observable;
* cancellable where safe;
* retryable where valid;
* resumable where required;
* idempotent where possible.

---

# 19. Job Authority

The server owns job lifecycle state.

A job has:

* JobId;
* JobType;
* RequestedBy;
* CreationTime;
* StartTime;
* CompletionTime;
* State;
* Progress;
* Result;
* Failure information.

Job state is operational metadata.

It does not replace authoritative domain state.

---

# 20. Event Processing

The server publishes events after successful state transitions.

Events may be consumed by:

* search indexing;
* synchronization;
* notifications;
* observability;
* cache invalidation;
* automation;
* plugins.

Event delivery may be asynchronous.

Consumers shall be idempotent and tolerate repeated delivery.

---

# 21. Transaction Boundaries

Transactions are defined at the smallest valid authoritative boundary.

Database transactions protect Catalog state.

Cross-storage operations use coordinated commit protocols rather than distributed transactions.

A server workflow shall explicitly define:

* transaction start;
* binary preparation;
* Catalog commit;
* event publication;
* compensation or recovery behavior.

---

# 22. Locking

The server is the operational entry point to the Lock Manager.

Commands that may conflict shall acquire an appropriate lease before modifying state.

The server is responsible for:

* determining lock scope;
* identifying lock ownership;
* renewing long-running leases;
* releasing completed leases;
* rejecting conflicting operations;
* exposing lock failures through stable errors.

---

# 23. Consistency

The server enforces the consistency model defined by Persistence.

It shall prevent:

* duplicated current revisions;
* broken references;
* unsupported state transitions;
* incomplete coordinated commits;
* unauthorized restoration;
* silent conflict resolution.

Temporary operational inconsistency shall remain detectable and recoverable.

---

# 24. Error Model

Errors exposed by the server belong to explicit categories:

* validation error;
* authentication error;
* authorization error;
* conflict error;
* not-found error;
* integrity error;
* storage error;
* provider error;
* timeout error;
* unavailable service error;
* internal error.

Internal implementation details shall not be exposed through public responses.

Every error response shall include a correlation identifier.

---

# 25. Idempotency

Mutation endpoints that may be retried shall support idempotent execution.

Typical cases include:

* Publication creation;
* acquisition requests;
* synchronization commits;
* import commits;
* backup requests;
* recovery requests.

Idempotency keys are scoped to an authenticated client and operation type.

Reusing a key with incompatible input shall be rejected.

---

# 26. Authentication

Every non-public server operation requires an authenticated identity.

Supported identities may include:

* user identity;
* device identity;
* service identity;
* administrative identity;
* plugin identity.

Authentication proves identity.

It does not grant authority by itself.

---

# 27. Authorization

Authorization is evaluated for every protected operation.

Authorization decisions may depend on:

* identity;
* role;
* device;
* operation;
* resource;
* library state;
* deployment policy.

Authorization shall be enforced before command execution and before returning protected query results.

---

# 28. Network Exposure

The Master Library Server is private by default.

Preferred access models include:

* trusted local network;
* VPN;
* private overlay network;
* authenticated reverse proxy.

Direct unrestricted public exposure is prohibited by default.

Any public exposure requires explicit security configuration and operational review.

---

# 29. Configuration

Server configuration is external to the application binary.

Configuration includes:

* server identity;
* network binding;
* database connection;
* storage roots;
* backup roots;
* authentication;
* authorization;
* provider configuration;
* job limits;
* timeout policies;
* logging;
* observability;
* feature controls.

Secrets shall not be stored in normal configuration files committed to the repository.

---

# 30. Health Model

The server exposes health at multiple levels.

### Liveness

Indicates whether the process is running.

### Readiness

Indicates whether the server can accept normal requests.

### Dependency Health

Reports the availability of required dependencies.

### Library Health

Reports the operational state of the Master Library.

A running process is not necessarily ready.

A ready process is not necessarily library-healthy.

---

# 31. Startup Lifecycle

The startup sequence is:

```text
Load Configuration

↓

Validate Configuration

↓

Initialize Logging

↓

Connect Dependencies

↓

Validate Storage Layout

↓

Run Compatibility Checks

↓

Initialize Engines

↓

Start Background Runtime

↓

Expose Readiness
```

The server shall not report readiness before mandatory checks succeed.

---

# 32. Shutdown Lifecycle

The shutdown sequence is:

```text
Stop Accepting New Work

↓

Drain Active Requests

↓

Stop Scheduling New Jobs

↓

Checkpoint Running Work

↓

Release Leases

↓

Flush Events and Logs

↓

Close Dependencies

↓

Terminate
```

Shutdown shall preserve recoverability.

Abrupt termination shall not corrupt authoritative state.

---

# 33. Compatibility Checks

At startup, the server validates compatibility between:

* application version;
* database schema;
* storage layout version;
* contract version;
* Engine versions;
* plugin versions;
* Master Library metadata.

Unsupported incompatibility shall prevent readiness.

Automatic destructive migration is prohibited.

---

# 34. Schema Migration

Schema migration is an explicit administrative operation.

Migration shall provide:

* preflight validation;
* backup requirement;
* migration plan;
* compatibility checks;
* progress tracking;
* failure reporting;
* post-migration integrity verification.

The server shall not silently perform irreversible migrations during normal startup.

---

# 35. Storage Access

Only Persistence services access authoritative storage directly.

The API Layer, Application Layer and Engines shall not construct storage paths or execute arbitrary SQL.

All storage access passes through defined interfaces.

This rule preserves implementation independence and prevents persistence leakage.

---

# 36. Observability

The server emits:

* structured logs;
* metrics;
* distributed traces;
* health reports;
* audit records;
* job progress;
* integrity alerts.

Every request and background job receives a correlation identifier.

Sensitive data shall not be written to logs.

---

# 37. Audit

Security-sensitive and authority-changing operations are audited.

Examples include:

* authentication failures;
* authorization failures;
* administrative actions;
* Publication mutation;
* source replacement;
* restore;
* recovery;
* migration;
* configuration changes;
* plugin activation.

Audit records are append-only.

---

# 38. Resource Management

The server limits resource consumption for:

* concurrent requests;
* background jobs;
* memory;
* CPU;
* file handles;
* database connections;
* temporary storage;
* provider calls.

Resource limits shall be configurable.

Failure to obtain resources shall produce controlled backpressure rather than uncontrolled degradation.

---

# 39. Backpressure

When capacity is exceeded, the server may:

* queue work;
* reject new asynchronous requests;
* reduce parallelism;
* delay low-priority jobs;
* disable optional processing;
* return temporary unavailability.

Authoritative consistency has priority over throughput.

---

# 40. Caching

Server caches may improve read performance.

Caches shall never become authoritative.

Cached information must be:

* invalidatable;
* bounded;
* reconstructable;
* version-aware;
* safe under concurrent access.

Mutation decisions shall not rely exclusively on stale cached state.

---

# 41. Temporary Storage

Temporary files may be used for:

* uploads;
* imports;
* archive extraction;
* provider downloads;
* processing;
* backup staging.

Temporary storage shall be:

* isolated from authoritative storage;
* bounded;
* periodically cleaned;
* recoverable after interruption;
* excluded from authoritative backups unless explicitly required.

---

# 42. File Uploads

Uploads are treated as untrusted input.

The server shall enforce:

* size limits;
* type validation;
* content validation;
* checksum generation;
* quarantine or staging;
* safe filenames;
* path isolation;
* timeout limits.

An uploaded file does not become authoritative until the commit protocol succeeds.

---

# 43. Plugin Execution

Server-side plugins execute through controlled extension points.

Plugins shall not receive unrestricted access to:

* database credentials;
* storage roots;
* process environment;
* host filesystem;
* internal services.

Capabilities are granted explicitly.

Plugin failure shall not compromise the core server lifecycle.

---

# 44. Provider Integration

External providers are accessed through provider contracts.

The server shall control:

* credentials;
* timeout policies;
* retry policies;
* concurrency;
* data boundaries;
* audit;
* privacy;
* failure mapping.

Provider-specific concepts shall not leak into Domain entities.

---

# 45. Administrative Interface

Administrative operations include:

* health inspection;
* configuration inspection;
* job management;
* integrity verification;
* backup;
* restore;
* recovery;
* migration;
* lock inspection;
* audit inspection.

Administrative capabilities require stronger authorization than normal library operations.

---

# 46. Multi-Client Coordination

The server supports concurrent access from:

* macOS clients;
* iPhone clients;
* iPad clients;
* Web clients;
* authorized services.

Each client is identified independently.

Concurrent mutations use:

* revision checks;
* idempotency;
* leases;
* conflict detection;
* synchronization protocols.

The last request received does not automatically win.

---

# 47. Offline Clients

Offline clients operate against Local Libraries.

When connectivity returns, clients synchronize through the server.

The server:

* validates client changes;
* verifies base revisions;
* detects conflicts;
* applies authorized changes;
* publishes resulting revisions;
* returns authoritative synchronization results.

Offline clients never modify Master Library storage directly.

---

# 48. Failure Isolation

The server isolates failures between subsystems whenever possible.

Examples:

* Search failure does not invalidate Catalog reads;
* AI failure does not block manual metadata editing;
* export failure does not corrupt Publications;
* provider failure does not damage committed data;
* optional plugin failure does not stop the server.

Failures in mandatory persistence dependencies may prevent readiness.

---

# 49. Recovery Behavior

After an unexpected shutdown, the server shall:

1. inspect incomplete workflows;
2. inspect active leases;
3. inspect staged binaries;
4. inspect pending events;
5. inspect incomplete jobs;
6. classify recoverable states;
7. resume, compensate or escalate;
8. verify integrity before restoring full operation.

Recovery shall be deterministic and auditable.

---

# 50. Server Invariants

The following invariants are mandatory:

* authoritative writes pass through the server;
* the Interface Layer contains no domain logic;
* application services coordinate rather than redefine Engines;
* Engines access persistence through defined contracts;
* storage paths never leak into public contracts;
* committed history remains immutable;
* every modifying request is authenticated and authorized;
* every authoritative mutation is validated;
* conflicting mutations are detected;
* asynchronous processing never becomes silently authoritative;
* successful responses represent committed state;
* failures remain observable and recoverable;
* the server never reports readiness before mandatory dependencies are valid;
* disposable containers never contain the only authoritative copy of data;
* client state never overrides Master Library authority without validation.

---

# 51. Prohibited Designs

The following designs are prohibited:

* clients writing directly to PostgreSQL;
* clients writing directly to authoritative NAS directories;
* domain logic inside API controllers;
* Engines bypassing Persistence services;
* public exposure without authentication;
* permanent administrative credentials embedded in the application;
* automatic destructive migrations at startup;
* filesystem paths as public identities;
* synchronous execution of every long-running operation;
* hidden retries of non-idempotent operations;
* silent conflict resolution;
* unbounded background job execution;
* unrestricted plugin access;
* storing authoritative data inside ephemeral container layers.

---

# 52. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/KernelArchitecture.md`
* `00-Architecture/04-Platform/README.md`
* `00-Architecture/04-Platform/Library/README.md`
* `00-Architecture/04-Platform/Sync/README.md`
* `00-Architecture/05-Integration/PublicAPI/APIConventions.md`
* `00-Architecture/06-Execution/Runtime/ExecutionModel.md`
* `00-Architecture/06-Execution/Reliability/ErrorHandling.md`

## Master Library

* `01-Requirements/Scope.md`
* `02-TechnicalDesign/SystemDesign.md`
* `02-TechnicalDesign/ServerDesign.md`
* `02-TechnicalDesign/ErrorModel.md`
* `03-Domain/DomainModel.md`
* `04-Contracts/ServerContracts.md`
* `04-Contracts/Authentication.md`
* `04-Contracts/ErrorContracts.md`
* `04-Contracts/HealthContracts.md`
* `05-Persistence/README.md`
* `05-Persistence/Consistency.md`
* `05-Persistence/Locking.md`
* `05-Persistence/Recovery.md`
* `06-Server/ServerArchitecture.md`
* `06-Server/Configuration.md`
* `06-Server/Security.md`
* `07-Client/ClientArchitecture.md`
* `09-Operations/Deployment.md`
* `09-Operations/Observability.md`

---

# 53. Status

**Approved**

The Master Library Server is frozen as the authoritative runtime and write gateway for the KnowledgeOS Master Library.

It coordinates application workflows, Platform Engines, persistence services, background execution, synchronization and operational controls without redefining the Domain or collapsing architectural boundaries.

The server is private by default, container-deployable, observable, recoverable and designed to preserve the authority, consistency and integrity of the Master Library.
