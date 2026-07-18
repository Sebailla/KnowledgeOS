

# Master Library Client Architecture

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Client

**Document:** Client Architecture

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the internal architecture of the KnowledgeOS Master Library Client.

It specifies:

* architectural layers;
* internal modules;
* dependency direction;
* execution boundaries;
* Local Library integration;
* synchronization integration;
* platform composition;
* background execution;
* state management;
* error handling;
* recovery behavior;
* security boundaries;
* architectural invariants.

The client architecture is designed to support responsive, Offline First operation across macOS, iPadOS, iOS and, where viable, Web.

---

# 2. Scope

This document applies to:

* client application structure;
* presentation composition;
* user workflows;
* local persistence access;
* local change tracking;
* synchronization coordination;
* local processing;
* background jobs;
* client security;
* platform-specific adapters;
* client observability;
* compatibility and migration.

It does not redefine:

* authoritative Master Library semantics;
* server architecture;
* Domain rules;
* persistence formats;
* synchronization protocol contracts;
* Platform Engine responsibilities.

Those concerns are defined in their corresponding documents.

---

# 3. Architectural Goals

The client architecture shall provide:

* Offline First behavior;
* local responsiveness;
* deterministic state transitions;
* explicit authority boundaries;
* recoverable local workflows;
* platform independence where practical;
* native platform integration;
* modular capability composition;
* testability;
* security;
* observability;
* support for future evolution.

---

# 4. Architectural Style

The client uses a modular, layered and capability-oriented architecture.

It combines:

* Hexagonal Architecture;
* Ports and Adapters;
* unidirectional data flow;
* command and query separation;
* explicit local workflows;
* event-driven coordination;
* background job execution;
* platform adapter isolation.

The architecture may be deployed as one native application process while preserving internal module boundaries.

---

# 5. Client Runtime Model

The client runs primarily as a local application.

Its runtime includes:

```text
Master Library Client

├── Presentation Runtime
├── Application Runtime
├── Local Library Runtime
├── Synchronization Runtime
├── Capability Runtime
├── Background Job Runtime
├── Platform Integration Runtime
└── Operations Runtime
```

Some capabilities may execute in separate processes or extensions when required by the platform.

Examples include:

* Share extensions;
* Finder extensions;
* import helpers;
* document scanners;
* local AI model processes;
* plugin sandboxes.

---

# 6. Architectural Layers

The client is divided into eight logical layers:

1. Presentation Layer;
2. Application Layer;
3. Local Domain Layer;
4. Capability Layer;
5. Local Persistence Layer;
6. Synchronization Layer;
7. Platform Adapter Layer;
8. Operations Layer.

The dependency direction is inward toward stable contracts.

```text
Presentation

↓

Application

↓

Local Domain and Capability Ports

↓

Persistence, Synchronization and Platform Ports

↓

Adapters
```

Inner layers shall not depend on concrete platform or network implementations.

---

# 7. Dependency Rules

The following rules are mandatory:

* Presentation depends on Application;
* Application depends on Local Domain contracts and ports;
* Local Domain does not depend on UI frameworks;
* Local Domain does not depend on network protocols;
* persistence is accessed through Local Library ports;
* synchronization is accessed through synchronization ports;
* platform services are accessed through platform ports;
* capabilities interact through explicit contracts;
* concrete adapters implement stable ports;
* circular module dependencies are prohibited.

Cross-module communication occurs through:

* commands;
* queries;
* events;
* workflow results;
* capability interfaces;
* shared identifiers;
* stable data contracts.

---

# 8. Client Module Model

The client is organized into functional modules.

```text
Client

├── Shell
├── Catalog
├── Reader
├── Annotation
├── Acquisition
├── Search
├── Synchronization
├── Local Library
├── AI
├── Export
├── Configuration
├── Security
├── Jobs
├── Diagnostics
└── Platform Integration
```

Each module owns:

* its presentation components;
* its application use cases;
* its state model;
* its internal ports;
* its tests;
* its local configuration.

Modules shall not access another module’s internal persistence directly.

---

# 9. Client Shell

The Client Shell is the top-level application container.

It is responsible for:

* application startup;
* dependency composition;
* primary navigation;
* session coordination;
* Local Library selection;
* global notifications;
* top-level error boundaries;
* client mode presentation;
* platform lifecycle events.

The Shell does not own Domain behavior.

---

# 10. Presentation Layer

The Presentation Layer contains:

* screens;
* windows;
* navigation;
* views;
* components;
* interaction handlers;
* accessibility behavior;
* visual state mapping.

It receives state from Application-facing view models or equivalent presentation contracts.

It dispatches user intent as commands.

It shall not perform direct persistence or synchronization access.

---

# 11. Presentation State

Presentation state may include:

* selected Publication;
* active view;
* navigation history;
* open panels;
* progress indicators;
* transient form input;
* interaction mode;
* window state;
* display preferences.

Presentation state is not automatically Domain or Local Library state.

Only user intent explicitly submitted to Application workflows becomes persistent.

---

# 12. Unidirectional Data Flow

Client state follows unidirectional flow:

```text
User Action

↓

Presentation Intent

↓

Application Command

↓

Local Operation

↓

State Change Event

↓

Projection or View Model Update

↓

Presentation Update
```

This reduces hidden mutation and supports deterministic UI behavior.

---

# 13. Application Layer

The Application Layer coordinates client use cases.

It contains:

* command handlers;
* query handlers;
* workflow coordinators;
* synchronization coordinators;
* local transaction coordinators;
* job coordinators;
* authorization checks;
* result mapping.

Application services orchestrate behavior but do not implement low-level platform details.

---

# 14. Client Commands

Client commands represent user or runtime intent.

Examples include:

* `OpenPublication`;
* `DownloadPublication`;
* `PinPublication`;
* `UpdateLocalMetadata`;
* `CreateAnnotation`;
* `StartAcquisition`;
* `StartSynchronization`;
* `ResolveConflict`;
* `EvictCachedContent`;
* `RunLocalAIAction`.

Commands are immutable after dispatch.

---

# 15. Client Queries

Client queries retrieve local or derived state.

Examples include:

* `GetPublication`;
* `ListCatalog`;
* `SearchLocalLibrary`;
* `GetSynchronizationStatus`;
* `ListPendingChanges`;
* `GetAcquisitionStatus`;
* `GetLocalStorageUsage`;
* `GetConflictDetails`.

Queries shall not create hidden authoritative mutations.

---

# 16. Command Execution Flow

A standard local command follows:

```text
User Intent

↓

Presentation Validation

↓

Command Construction

↓

Application Validation

↓

Local Authorization or Capability Check

↓

Local Transaction

↓

Local Domain Operation

↓

Local Persistence

↓

Pending Change Registration

↓

Event Publication

↓

Presentation Update
```

Commands requiring server authority register deferred work when offline.

---

# 17. Query Execution Flow

A standard client query follows:

```text
Presentation Request

↓

Query Construction

↓

Query Handler

↓

Local Catalog or Projection

↓

Result Mapping

↓

Presentation
```

Ordinary catalog browsing shall use local data.

It shall not require synchronous server access.

---

# 18. Local Domain Layer

The Local Domain Layer represents client-side business state.

It includes:

* Local Publication State;
* local availability;
* pending changes;
* synchronization status;
* local acquisition state;
* annotation drafts;
* conflict state;
* local job state.

It shares identifiers and semantics with authoritative Domain contracts where possible.

---

# 19. Local Domain Boundaries

Local Domain objects shall distinguish:

* authoritative replicated data;
* local proposed changes;
* local-only operational state;
* derived state;
* user preferences.

These categories shall not be stored or interpreted interchangeably.

---

# 20. Replicated State

Replicated state is confirmed authoritative data received from the Master Library Server.

It includes:

* Publication identity;
* authoritative revision;
* metadata;
* relationships;
* collection membership;
* source descriptors;
* cover descriptors;
* asset descriptors.

Replicated state may become stale while offline.

Its last synchronization point shall remain known.

---

# 21. Proposed State

Proposed state represents local changes not yet accepted by the server.

It may include:

* edited metadata;
* new annotations;
* collection changes;
* source additions;
* cover updates;
* relationship proposals.

Proposed state remains separate from the confirmed authoritative baseline.

---

# 22. Effective Local State

The UI may present an effective local view composed from:

```text
Confirmed Authoritative Baseline

+

Pending Local Changes

=

Effective Local State
```

The composition process shall preserve the distinction between confirmed and pending values.

The UI should expose pending status where relevant.

---

# 23. Capability Layer

The Capability Layer contains functional client modules.

Each capability defines:

* supported operations;
* required data;
* local behavior;
* synchronization behavior;
* platform requirements;
* failure behavior;
* recovery behavior.

Capabilities may depend on shared Engine ports but shall not bypass Application workflows.

---

# 24. Catalog Capability

The Catalog capability provides:

* local catalog browsing;
* sorting;
* filtering;
* grouping;
* collection navigation;
* state presentation;
* search entry points;
* availability state;
* synchronization status.

Catalog queries use Local Catalog projections.

---

# 25. Reader Capability

The Reader capability provides:

* content opening;
* navigation;
* reading modes;
* rendering;
* pagination;
* continuous scrolling;
* bookmarks;
* annotation anchors;
* presentation preferences.

The Reader uses locally available source or derived content.

---

# 26. Annotation Capability

The Annotation capability provides:

* highlights;
* notes;
* comments;
* drawings;
* bookmarks;
* post-it notes;
* Apple Pencil input;
* anchor management.

Annotation changes are persisted locally before synchronization.

---

# 27. Acquisition Capability

The Acquisition capability provides:

* file selection;
* drag and drop;
* folder import;
* URL capture;
* mobile capture;
* scanning;
* metadata extraction;
* duplicate analysis;
* staging;
* synchronization handoff.

Acquisition can operate offline until server authority is required.

---

# 28. Search Capability

The Search capability provides:

* metadata search;
* full-text search;
* annotation search;
* semantic search;
* relationship search;
* local result ranking.

Search uses derived local indexes.

---

# 29. AI Capability

The AI capability coordinates:

* local models;
* remote models;
* prompts;
* privacy policy;
* data minimization;
* model selection;
* resource limits;
* output classification.

AI output enters authoritative workflows only after explicit user acceptance.

---

# 30. Export Capability

The Export capability coordinates local export of available content.

Supported formats may include:

* Markdown;
* HTML;
* PDF;
* EPUB;
* images;
* structured exchange packages.

Exported files are user-controlled artifacts.

They are not automatically part of the Master Library.

---

# 31. Local Persistence Layer

The Local Persistence Layer stores:

* Local Catalog;
* downloaded sources;
* covers;
* assets;
* annotations;
* pending changes;
* conflicts;
* local jobs;
* synchronization state;
* derived indexes;
* caches.

Persistence is accessed through explicit repositories and storage services.

---

# 32. Local Repositories

Local repositories may include:

* `LocalPublicationRepository`;
* `LocalAnnotationRepository`;
* `PendingChangeRepository`;
* `ConflictRepository`;
* `AcquisitionRepository`;
* `LocalJobRepository`;
* `SynchronizationStateRepository`.

Repositories expose logical data operations, not database implementation details.

---

# 33. Local Storage Services

Local storage services may include:

* `LocalSourceStorage`;
* `LocalCoverStorage`;
* `LocalAssetStorage`;
* `LocalCacheStorage`;
* `LocalStagingStorage`;
* `LocalRecoveryStorage`.

Storage services enforce containment, checksums and lifecycle rules.

---

# 34. Local Transactions

Local transactions preserve consistency across related local records.

They shall be:

* bounded;
* recoverable;
* independent from active network calls;
* aligned with local consistency boundaries.

A network request shall not remain inside an open local database transaction.

---

# 35. Pending Change Store

The Pending Change Store records all synchronization-intended mutations.

It provides:

* durable queueing;
* ordering metadata;
* dependencies;
* idempotency keys;
* base revisions;
* retry state;
* conflict state;
* result references.

The Pending Change Store is protected user data.

---

# 36. Local Event Bus

The client may use a local Event Bus for module coordination.

Events may include:

* `LocalPublicationUpdated`;
* `AnnotationCreated`;
* `PendingChangeQueued`;
* `DownloadCompleted`;
* `SynchronizationStarted`;
* `ConflictDetected`;
* `AuthoritativeStateApplied`;
* `CacheEvicted`.

Events shall represent completed local facts.

---

# 37. Synchronization Layer

The Synchronization Layer communicates with the Master Library Server.

It contains:

* connectivity monitor;
* session manager;
* protocol adapter;
* change enumerator;
* transfer manager;
* content verifier;
* conflict detector;
* result applier;
* synchronization history.

The layer does not redefine server authority.

---

# 38. Synchronization Port

The Synchronization Port defines operations such as:

* open session;
* negotiate capabilities;
* submit changes;
* request remote changes;
* upload content;
* download content;
* confirm checksums;
* finalize session;
* cancel session.

The concrete network protocol remains behind an adapter.

---

# 39. Synchronization Session

A synchronization session contains:

* SessionId;
* DeviceId;
* LocalLibraryId;
* MasterLibraryId;
* negotiated protocol;
* server checkpoint;
* local checkpoint;
* current phase;
* transferred items;
* failures;
* expiration.

Session state is persisted sufficiently to support recovery.

---

# 40. Synchronization Coordinator

The Synchronization Coordinator owns execution order.

It is responsible for:

* validating preconditions;
* authenticating;
* opening the session;
* enumerating local changes;
* requesting authoritative changes;
* coordinating transfers;
* validating results;
* applying accepted state;
* recording conflicts;
* updating checkpoints;
* finalizing the session.

---

# 41. Change Upload

Uploading local changes follows:

```text
Select Ready Changes

↓

Resolve Dependencies

↓

Validate Base Revisions

↓

Assign Idempotency Data

↓

Submit Metadata

↓

Upload Required Content

↓

Receive Server Decision

↓

Apply Accepted Result or Record Conflict
```

Accepted changes are removed from the pending queue only after local authoritative state is updated.

---

# 42. Change Download

Downloading remote changes follows:

```text
Request Changes Since Checkpoint

↓

Receive Change Set

↓

Validate Contract and Identity

↓

Download Required Content

↓

Verify Checksums

↓

Apply Local Transaction

↓

Update Indexes and Projections

↓

Advance Checkpoint
```

The checkpoint advances only after successful local application.

---

# 43. Conflict Handling

Conflicts are persisted as first-class client records.

A conflict contains:

* ConflictId;
* target resource;
* base revision;
* local proposal;
* authoritative state;
* conflict type;
* detection time;
* resolution status;
* recommended actions.

Conflict resolution produces a new explicit local command or cancellation.

---

# 44. Result Application

Server results are applied transactionally where possible.

Application may update:

* replicated authoritative state;
* pending change state;
* content descriptors;
* local availability;
* synchronization checkpoint;
* conflict records;
* search projections.

Partial result application shall be detectable and recoverable.

---

# 45. Platform Adapter Layer

The Platform Adapter Layer isolates native platform capabilities.

Ports may include:

* secure credential storage;
* filesystem access;
* file picker;
* camera;
* scanner;
* Share Sheet;
* drag and drop;
* Apple Pencil;
* notifications;
* background tasks;
* network monitoring;
* system search;
* Quick Look.

Application modules depend on ports, not platform APIs directly.

---

# 46. macOS Composition

The macOS client may include:

```text
macOS Application

├── Main Application
├── Menu Commands
├── Finder Integration
├── Quick Look Integration
├── Share Extension
├── Import Services
├── Background Helpers
└── Local AI Runtime
```

The main application remains the owner of Local Library coordination.

Extensions use restricted contracts.

---

# 47. iPadOS Composition

The iPadOS client may include:

```text
iPadOS Application

├── Main Application
├── Reader
├── Apple Pencil Input
├── Share Extension
├── Document Picker
├── Scanner Integration
└── Background Transfer
```

The architecture shall account for suspension and memory pressure.

---

# 48. iOS Composition

The iOS client may include:

```text
iOS Application

├── Main Application
├── Capture Interface
├── Reader
├── Share Extension
├── Scanner
└── Background Transfer
```

The iOS client may expose a reduced capability set without changing shared semantics.

---

# 49. Web Composition

A Web client may include:

```text
Web Client

├── Application Shell
├── Local Browser Storage
├── Service Worker
├── Server API Adapter
├── Reader
└── Limited Offline Cache
```

Web limitations shall be explicit.

Browser-local data shall not be assumed to provide the same guarantees as native Local Library storage.

---

# 50. Shared Client Core

Shared Client Core may contain:

* commands;
* queries;
* workflow contracts;
* identifiers;
* synchronization models;
* validation rules;
* state machines;
* error types;
* capability ports.

Shared Core shall not import native UI or filesystem frameworks.

---

# 51. Platform-Specific Code

Platform-specific code shall be limited to:

* UI composition;
* native lifecycle;
* native storage adapters;
* native security adapters;
* device-specific input;
* background execution;
* platform integrations.

Platform code shall not redefine authoritative or synchronization semantics.

---

# 52. State Management

State management is divided into:

* persistent local state;
* replicated authoritative state;
* pending local state;
* derived state;
* presentation state;
* transient workflow state.

Each state category shall have an explicit owner and lifecycle.

---

# 53. Persistent State

Persistent state survives application restart.

It includes:

* Local Catalog;
* pending changes;
* annotations;
* conflicts;
* acquisition state;
* jobs;
* synchronization checkpoints;
* local availability;
* user settings.

Persistent state is written through controlled repositories.

---

# 54. Derived State

Derived state includes:

* search indexes;
* thumbnails;
* render caches;
* layout projections;
* semantic embeddings;
* view projections.

Derived state is reconstructable and may be invalidated.

---

# 55. Transient State

Transient state includes:

* open dialogs;
* temporary selections;
* drag state;
* active progress animations;
* unsaved form input;
* short-lived preview state.

Important user input shall be promoted to durable draft state when loss would be unacceptable.

---

# 56. Background Job Runtime

The client uses jobs for long-running operations.

Examples include:

* download;
* upload;
* synchronization;
* import;
* text extraction;
* thumbnail generation;
* index rebuild;
* local AI inference;
* export;
* integrity verification.

Jobs are persistent when interruption would matter.

---

# 57. Client Job States

A job may transition through:

```text
Pending

↓

Running

↓

Succeeded
```

Alternative states include:

* Paused;
* WaitingForNetwork;
* WaitingForUser;
* Retrying;
* Cancelled;
* Failed;
* RecoveryRequired.

The UI shall expose relevant job states.

---

# 58. Job Scheduling

The client scheduler considers:

* application foreground state;
* operating-system permissions;
* battery;
* thermal state;
* network type;
* storage availability;
* user policy;
* task priority.

Heavy optional jobs shall yield to interactive work.

---

# 59. Job Checkpointing

Long-running jobs persist checkpoints containing:

* current stage;
* processed items;
* continuation token;
* local artifact references;
* retry count;
* progress;
* lease or ownership state.

Checkpointing shall support application restart and platform suspension.

---

# 60. Cancellation

Jobs shall define cancellation semantics.

Cancellation may be:

* immediate;
* cooperative;
* stage-boundary;
* not permitted during critical commit.

Cancellation shall preserve local consistency.

---

# 61. Resource Management

The client manages resource budgets for:

* memory;
* CPU;
* GPU;
* battery;
* storage;
* network;
* background time;
* local AI models.

Resource policies vary by platform.

The architecture exposes resource decisions to capabilities through a Resource Manager.

---

# 62. Backpressure

Backpressure prevents unbounded work.

It may limit:

* queued jobs;
* concurrent downloads;
* concurrent uploads;
* thumbnail generation;
* index updates;
* AI requests;
* acquisition processing.

The client shall degrade gracefully rather than exhaust platform resources.

---

# 63. Cache Architecture

Caches are owned by specific capabilities.

Each cache defines:

* key;
* version;
* source dependency;
* size limit;
* eviction policy;
* invalidation rule;
* rebuild method.

A generic cache shall not store unique user work.

---

# 64. Content Availability Manager

The Content Availability Manager coordinates:

* metadata-only state;
* cover downloads;
* source downloads;
* asset downloads;
* pinning;
* eviction;
* redownload;
* local capacity policy.

It preserves user pinning and pending-change dependencies.

---

# 65. Local Security Architecture

Client security includes:

* secure credential storage;
* encrypted transport;
* server certificate validation;
* Local Library permissions;
* input validation;
* file containment;
* provider policy;
* plugin isolation;
* secret redaction.

Security is enforced beneath the UI.

---

# 66. Authentication Adapter

The Authentication Adapter manages:

* login;
* token acquisition;
* token refresh;
* logout;
* device registration;
* secure token storage;
* revocation response.

Application modules receive authentication state through an explicit port.

---

# 67. Credential Storage

Credentials shall use platform-secure facilities.

Examples include:

* Keychain on Apple platforms;
* secure browser mechanisms where viable;
* protected operating-system secret storage.

Credentials shall not be stored in the Local Catalog or ordinary configuration files.

---

# 68. Device Identity Management

Device identity is managed independently from user session state.

The client preserves:

* DeviceId;
* device key material;
* registration state;
* trust state;
* revocation state.

Device secrets remain protected by the platform security adapter.

---

# 69. Input Security

Input sources include:

* user files;
* URLs;
* scanner results;
* Share Sheet content;
* provider results;
* synchronization payloads;
* plugin output.

All input is validated before persistence or execution.

---

# 70. File Containment

Imported files are copied or referenced through controlled storage services.

The client shall not:

* trust filenames as paths;
* allow path traversal;
* expose unrestricted filesystem access;
* let plugins choose authoritative local storage paths;
* process unsafe symbolic links without validation.

---

# 71. Provider Boundary

Remote providers are accessed through provider adapters.

Adapters enforce:

* approved endpoints;
* credential isolation;
* timeout;
* retry;
* data minimization;
* response validation;
* logging restrictions;
* cancellation.

Provider output remains untrusted.

---

# 72. Plugin Boundary

Plugins interact through capability contracts.

Plugin access may be limited to:

* selected metadata;
* selected content;
* export streams;
* import streams;
* approved network providers;
* declared events.

Plugins do not receive unrestricted Local Library access.

---

# 73. Error Architecture

Client failures are represented as typed errors.

Categories include:

* ValidationFailure;
* AuthenticationFailure;
* AuthorizationFailure;
* ConnectivityFailure;
* SynchronizationFailure;
* ConflictFailure;
* StorageFailure;
* IntegrityFailure;
* ProviderFailure;
* ProcessingFailure;
* CompatibilityFailure;
* ResourceFailure;
* InternalFailure.

Infrastructure exceptions are translated before reaching the Presentation Layer.

---

# 74. Error Recovery

Every recoverable failure should define:

* retryability;
* required connectivity;
* preserved work;
* user action;
* recovery operation;
* diagnostic information.

The UI shall communicate whether user-created work remains safe.

---

# 75. Offline Behavior

When offline, the client shall:

* continue local queries;
* continue supported local commands;
* preserve changes;
* queue synchronization work;
* pause server-dependent jobs;
* expose offline state;
* resume safely after connectivity returns.

Offline mode is a normal operating state.

---

# 76. Connectivity Monitor

The Connectivity Monitor distinguishes:

* no network;
* network available;
* server unreachable;
* server reachable;
* authentication required;
* server degraded;
* protocol incompatible.

Connectivity events inform workflows but do not directly mutate Domain state.

---

# 77. Startup Architecture

Client startup occurs in phases:

```text
Bootstrap

↓

Load Configuration

↓

Initialize Security

↓

Open Local Library

↓

Validate Compatibility

↓

Inspect Recovery State

↓

Initialize Modules

↓

Resume Jobs

↓

Start Connectivity Monitoring

↓

Present Ready State
```

The client may become locally ready before the server is reachable.

---

# 78. Local Readiness

The client reports local readiness when:

* configuration is valid;
* Local Library opens successfully;
* Local Library format is compatible;
* critical recovery checks complete;
* core modules initialize.

Server availability is not required for local readiness.

---

# 79. Restricted Client Modes

The client may operate in:

* Normal Mode;
* Offline Mode;
* Read-Only Local Mode;
* Migration Required Mode;
* Recovery Mode;
* Degraded Mode;
* Authentication Required Mode.

Mode transitions shall be explicit and visible.

---

# 80. Shutdown Architecture

Graceful shutdown performs:

* stop new workflows;
* persist drafts;
* checkpoint jobs;
* persist pending changes;
* finalize local transactions;
* suspend synchronization;
* flush logs;
* close Local Library;
* release resources.

Application termination shall not discard pending user work.

---

# 81. Abrupt Termination

The architecture assumes the operating system may terminate or suspend the client unexpectedly.

Therefore:

* local transactions are atomic;
* pending changes are durable;
* jobs checkpoint;
* staged acquisitions are tracked;
* temporary artifacts are recoverable;
* synchronization checkpoints persist;
* startup performs recovery inspection.

---

# 82. Recovery Inspection

On startup, the client inspects:

* incomplete transactions;
* pending migrations;
* interrupted jobs;
* incomplete downloads;
* incomplete uploads;
* staged acquisitions;
* unresolved synchronization sessions;
* cache corruption;
* pending conflicts.

The client distinguishes disposable derived data from unique user work.

---

# 83. Local Migration

Migration is executed through a dedicated workflow.

It includes:

* compatibility detection;
* preflight validation;
* storage capacity check;
* backup or recovery snapshot;
* migration execution;
* verification;
* cleanup;
* status update.

Migration shall not silently remove unsupported data.

---

# 84. Observability Architecture

Client observability includes:

* structured logs;
* job state;
* synchronization history;
* local health;
* storage usage;
* index status;
* recovery status;
* diagnostic export.

Observability data is local by default unless the user explicitly shares it.

---

# 85. Correlation

Correlation identifiers connect:

* user command;
* local job;
* synchronization session;
* server request;
* provider request;
* local error;
* diagnostic record.

Correlation supports end-to-end troubleshooting without exposing content.

---

# 86. Logging

Logs shall include:

* timestamp;
* component;
* operation;
* severity;
* CorrelationId;
* JobId;
* LocalLibraryId where safe;
* result;
* error classification.

Logs shall exclude secrets and unnecessary document content.

---

# 87. Diagnostics Export

A diagnostic package may contain:

* client version;
* platform information;
* configuration summary;
* Local Library version;
* recent logs;
* job state;
* synchronization state;
* health checks;
* storage usage.

Sensitive values and content are redacted.

---

# 88. Testing Architecture

Client architecture supports:

* unit tests;
* application workflow tests;
* Local Library integration tests;
* synchronization contract tests;
* platform adapter tests;
* offline tests;
* UI tests;
* migration tests;
* recovery tests;
* security tests;
* performance tests.

Shared Client Core shall be testable without native UI frameworks.

---

# 89. Architecture Enforcement

Architectural boundaries shall be enforced using:

* package or module visibility;
* dependency rules;
* static analysis;
* architecture tests;
* protocol adapters;
* repository ownership;
* code review;
* module-specific test suites.

Presentation components shall not import persistence adapters directly.

---

# 90. Recommended Code Organization

A recommended logical organization is:

```text
client/
├── shell/
├── presentation/
├── application/
├── domain/
├── capabilities/
│   ├── catalog/
│   ├── reader/
│   ├── annotation/
│   ├── acquisition/
│   ├── search/
│   ├── ai/
│   └── export/
├── local-library/
├── synchronization/
├── jobs/
├── security/
├── platform/
├── operations/
└── shared/
```

The final physical structure may adapt to the selected implementation language and platform framework.

---

# 91. Shared Module Rules

The shared module may contain only stable transversal abstractions.

Allowed examples include:

* identifiers;
* result types;
* clock;
* pagination;
* correlation;
* cancellation;
* common errors;
* immutable collections;
* resource descriptors.

Capability-specific behavior remains in its owning module.

---

# 92. Technology Independence

This architecture does not require a specific:

* UI framework;
* database library;
* programming language;
* synchronization transport;
* local search engine;
* AI runtime;
* dependency-injection framework.

Technology choices shall preserve the defined boundaries and invariants.

---

# 93. Prohibited Dependencies

The following dependencies are prohibited:

* Presentation depending directly on Local Catalog implementation;
* Presentation depending directly on network clients;
* Local Domain depending on UI frameworks;
* Local Domain depending on native filesystem APIs;
* synchronization adapters mutating presentation state directly;
* plugins importing Local Library internals;
* background jobs bypassing Application workflows;
* query handlers producing hidden authoritative mutations;
* platform adapters redefining shared Domain semantics;
* caches owning unique user-created data.

---

# 94. Architectural Invariants

The following invariants are mandatory:

* normal client operation uses the Local Library;
* locally available capabilities remain usable offline;
* the Master Library remains authoritative;
* confirmed and pending state remain distinguishable;
* pending local changes are durable;
* synchronization is explicit and recoverable;
* stale revisions are detected;
* conflicts are persisted and visible;
* server results are applied transactionally where practical;
* checkpoints advance only after successful local application;
* Presentation never accesses persistence or network implementations directly;
* Local Domain remains independent from platform frameworks;
* platform integrations use explicit adapters;
* caches remain reconstructable;
* unique user work is never evicted as cache;
* background jobs are bounded and checkpointed;
* credentials use platform-secure storage;
* external input is always validated;
* AI output requires explicit acceptance before mutation;
* plugins receive only declared capabilities;
* abrupt termination does not silently lose user work;
* migrations are explicit and recoverable;
* local readiness does not depend on server availability;
* platform-specific implementations preserve shared semantics;
* architectural boundaries remain testable and enforceable.

---

# 95. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/CommandBus.md`
* `00-Architecture/03-Kernel/EventBus.md`
* `00-Architecture/03-Kernel/JobSystem.md`
* `00-Architecture/03-Kernel/QueryBus.md`
* `00-Architecture/03-Kernel/WorkflowEngine.md`
* `00-Architecture/04-Platform/README.md`
* `00-Architecture/04-Platform/Sync/README.md`
* `00-Architecture/06-Execution/Runtime/ExecutionModel.md`

## Master Library

* `02-TechnicalDesign/ClientDesign.md`
* `02-TechnicalDesign/OfflineModel.md`
* `02-TechnicalDesign/SynchronizationDesign.md`
* `02-TechnicalDesign/TechnologyDecisions.md`
* `03-Domain/DomainModel.md`
* `03-Domain/States.md`
* `04-Contracts/ClientContracts.md`
* `04-Contracts/SynchronizationContracts.md`
* `05-Persistence/README.md`
* `06-Server/ServerArchitecture.md`
* `07-Client/README.md`
* `07-Client/LocalLibrary.md`
* `07-Client/CatalogBrowser.md`
* `07-Client/AcquisitionManager.md`
* `08-Testing/TestStrategy.md`
* `08-Testing/IntegrationTests.md`
* `08-Testing/EndToEndTests.md`
* `09-Operations/Deployment.md`

---

# 96. Status

**Approved**

The Master Library Client Architecture is frozen as the authoritative internal architecture for KnowledgeOS clients.

The client is implemented as a modular Offline First runtime centered on the Local Library, with explicit separation between presentation, application workflows, local Domain state, capabilities, persistence, synchronization, platform adapters and operations.

The architecture preserves local responsiveness, protects unsynchronized user work, maintains the authority of the Master Library and supports native implementations across macOS, iPadOS, iOS and Web without redefining shared knowledge semantics.
