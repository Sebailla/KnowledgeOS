
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Platform
**Path:** `00-Architecture/04-Platform/`
**Document:** Platform Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the mandatory operational rules for every human or AI agent working inside:

```text
00-Architecture/04-Platform/
```

Its purpose is to preserve the architectural integrity of the KnowledgeOS Platform and its Engine-based model.

The Platform implements product capabilities over:

* Domain concepts;
* Kernel mechanisms;
* approved public contracts;
* controlled integration boundaries;
* explicit runtime guarantees.

The Platform does not redefine Domain semantics.

The Platform does not own infrastructure implementations.

The Platform does not bypass Kernel, Integration or Execution rules.

This document refines:

* the root `AGENTS.md`;
* `00-Architecture/AGENTS.md`;
* local Engine documentation.

It shall not replace the normative Platform or Engine documents.

---

# 2. Scope

These instructions apply to:

```text
04-Platform/
├── AI/
│   └── README.md
├── Annotation/
│   └── README.md
├── Export/
│   └── README.md
├── Import/
│   └── README.md
├── Knowledge/
│   └── README.md
├── Library/
│   └── README.md
├── Plugin/
│   └── README.md
├── README.md
├── Render/
│   └── README.md
├── Search/
│   └── README.md
└── Sync/
    └── README.md
```

They govern work involving:

* Platform architecture;
* Engine responsibilities;
* Engine boundaries;
* Engine interactions;
* Engine contracts;
* Engine lifecycle;
* Engine execution;
* Engine failure behavior;
* Engine observability;
* Engine configuration;
* Engine security;
* Engine privacy;
* Engine extension;
* Engine-to-implementation traceability.

---

# 3. Platform Authority

The Platform is the architectural authority for product capabilities implemented through Engines.

It defines:

* what each Engine is responsible for;
* which operations each Engine performs;
* which Domain models each Engine uses;
* which Kernel mechanisms each Engine depends on;
* which contracts each Engine exposes;
* how Engines interact;
* how failures are represented;
* how Engine lifecycle is managed;
* how implementation modules shall conform.

The Platform shall not redefine:

* Product Vision;
* Domain semantics;
* Kernel semantics;
* provider-specific implementation;
* persistence technology;
* deployment topology;
* UI framework behavior.

---

# 4. Mandatory Reading Order

Before modifying Platform documentation, read:

1. root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. `00-Architecture/02-Domain/AGENTS.md`;
4. `00-Architecture/03-Kernel/AGENTS.md`;
5. `00-Architecture/01-Foundation/ProductVision.md`;
6. `00-Architecture/01-Foundation/ArchitecturePrinciples.md`;
7. `00-Architecture/01-Foundation/ArchitectureConstraints.md`;
8. `00-Architecture/01-Foundation/ArchitectureModel.md`;
9. `00-Architecture/04-Platform/README.md`;
10. the target Engine `README.md`;
11. relevant Domain documents;
12. relevant Kernel documents;
13. relevant Integration documents;
14. relevant Execution documents;
15. related ADRs;
16. affected implementation documents.

For cross-Engine changes, read every affected Engine document before editing.

---

# 5. Platform Invariants

Every Platform change shall preserve the following invariants.

## 5.1 Engine-based architecture

Product capabilities shall be organized through explicit Engines.

## 5.2 Bounded responsibility

Every Engine shall have a clear and non-overlapping primary responsibility.

## 5.3 Domain authority

Engines shall use Domain models.

They shall not redefine them.

## 5.4 Kernel neutrality

Engines may use Kernel mechanisms.

They shall not place Engine-specific business behavior inside the Kernel.

## 5.5 Contract-based interaction

Cross-Engine interaction shall occur through explicit contracts.

## 5.6 Internal state isolation

An Engine shall not access another Engine's internal mutable state.

## 5.7 Replaceable integrations

External providers and infrastructure implementations shall remain replaceable.

## 5.8 Offline-first behavior

Core Platform capabilities shall respect offline-first operation.

## 5.9 Authoritative ownership

Every Platform operation, state transition and public contract shall have one authoritative owner.

## 5.10 Explicit failure

Engine failure behavior shall be documented and observable.

## 5.11 No silent data loss

No Engine shall silently discard user knowledge, provenance, identity or presentation information.

## 5.12 Traceability

Engine behavior shall remain traceable to:

* Product Vision;
* Domain;
* architecture;
* ADRs;
* contracts;
* implementation;
* tests.

---

# 6. Engine Definition

An Engine is an architectural capability boundary within the Platform.

An Engine:

* owns a coherent product capability;
* exposes explicit operations;
* uses Domain concepts;
* uses Kernel mechanisms;
* communicates through contracts;
* defines lifecycle and failure behavior;
* remains independently testable;
* hides internal implementation details.

An Engine is not:

* a folder grouping;
* a utility library;
* a single class;
* a persistence adapter;
* a UI component;
* a provider wrapper;
* a temporary implementation module.

---

# 7. Engine Responsibilities

Every Engine shall document:

* purpose;
* scope;
* primary responsibility;
* non-responsibilities;
* Domain concepts used;
* operations;
* commands;
* queries;
* events;
* public contracts;
* dependencies;
* lifecycle;
* configuration;
* failure behavior;
* concurrency;
* idempotency;
* security;
* privacy;
* observability;
* extension points;
* testing;
* related ADRs;
* related implementation modules.

An Engine shall not rely on undocumented responsibilities.

---

# 8. Engine Ownership

Every Platform responsibility shall have one authoritative Engine owner.

An operation may involve multiple Engines.

However:

* one Engine owns the operation;
* supporting Engines provide explicit capabilities;
* ownership does not shift implicitly during execution;
* failure ownership shall remain identifiable.

Shared ownership without clear authority is prohibited.

---

# 9. Engine Boundaries

An Engine boundary protects:

* responsibility;
* state;
* contracts;
* lifecycle;
* implementation freedom;
* security;
* testability.

An Engine shall not:

* access another Engine's database tables directly;
* access another Engine's files directly;
* depend on another Engine's private implementation types;
* invoke another Engine's private services;
* mutate another Engine's internal state;
* depend on undocumented execution order;
* bypass contracts for performance convenience.

---

# 10. Cross-Engine Communication

Cross-Engine communication shall use approved mechanisms such as:

* commands;
* queries;
* events;
* workflows;
* public services;
* canonical contracts.

The chosen mechanism shall match the semantic intent.

## 10.1 Commands

Use a command when one Engine requests another Engine to perform an operation.

## 10.2 Queries

Use a query when one Engine requires information without changing state.

## 10.3 Events

Use an event when an Engine announces that a relevant fact has occurred.

## 10.4 Workflows

Use a workflow when a capability spans multiple stages, Engines or durable operations.

## 10.5 Public services

Use a public service only when synchronous capability access is architecturally justified and explicitly contracted.

---

# 11. Prohibited Cross-Engine Patterns

Agents shall not introduce:

* direct internal imports between Engines;
* shared mutable singletons;
* cross-Engine database joins as architectural dependencies;
* undocumented callbacks;
* hidden provider access;
* internal type leakage;
* event-driven behavior without event contracts;
* commands used as notifications;
* events used as commands;
* synchronous dependency chains without failure design;
* circular Engine dependencies.

---

# 12. Engine Dependency Graph

The Platform dependency model shall remain acyclic.

An Engine may depend on:

* Domain models;
* Kernel contracts;
* approved Integration contracts;
* approved public contracts;
* Execution guarantees.

An Engine shall not depend on:

* another Engine's private implementation;
* UI-specific implementation;
* infrastructure-specific implementation;
* provider-specific behavior;
* unapproved global services.

Cross-Engine relationships shall be modeled as interactions, not internal dependencies.

---

# 13. Engine State

Every Engine shall define the state it owns.

State ownership shall distinguish:

* authoritative state;
* derived state;
* cached state;
* ephemeral state;
* synchronized state;
* execution state;
* configuration state.

An Engine shall not claim authority over state owned by another Engine or by the Master Library.

Derived state shall be reproducible where required.

Cached state shall be invalidatable.

Ephemeral state shall not silently become authoritative.

---

# 14. Engine Lifecycle

Every Engine shall define lifecycle behavior.

Relevant stages may include:

```text
Uninitialized
    ↓
Initializing
    ↓
Ready
    ↓
Active
    ↓
Degraded
    ↓
Stopping
    ↓
Stopped
    ↓
Failed
```

The exact lifecycle shall be defined by the Engine documentation.

Lifecycle shall specify:

* initialization;
* dependency validation;
* readiness;
* activation;
* suspension where supported;
* degradation;
* shutdown;
* restart;
* recovery;
* failure.

---

# 15. Engine Initialization

Initialization shall define:

* required dependencies;
* required configuration;
* optional dependencies;
* resource acquisition;
* schema or contract validation;
* startup ordering where required;
* recovery of prior state;
* readiness criteria;
* failure behavior.

An Engine shall not report readiness before mandatory dependencies are usable.

---

# 16. Engine Shutdown

Shutdown shall define:

* rejection of new work;
* completion or cancellation of active work;
* state persistence;
* checkpointing;
* resource release;
* event emission;
* timeout;
* forced termination behavior;
* recovery implications.

Shutdown shall not silently abandon durable work.

---

# 17. Engine Degraded Mode

An Engine may operate in degraded mode when some capabilities remain available.

Degraded mode shall define:

* unavailable features;
* preserved features;
* consistency limitations;
* user impact;
* recovery behavior;
* observability;
* exit criteria.

Degraded mode shall not conceal corruption or unsafe behavior.

---

# 18. Engine Contracts

Every Engine contract shall be:

* explicit;
* versioned where externally consumed;
* technology-neutral at the architecture level;
* validated;
* testable;
* documented;
* stable within its compatibility guarantees.

Contracts shall define:

* operation;
* input;
* output;
* errors;
* preconditions;
* postconditions;
* idempotency;
* authorization where applicable;
* compatibility;
* versioning.

---

# 19. Internal and Public Contracts

Contracts shall be classified.

## 19.1 Internal Engine contract

Used inside the Engine implementation.

It is not available to other Engines.

## 19.2 Platform contract

Used for controlled interaction between Platform capabilities.

## 19.3 Integration contract

Used across Platform and Integration boundaries.

## 19.4 Public contract

Exposed to applications, plugins or external consumers.

Internal contracts shall not accidentally become public contracts.

Public contracts shall not expose internal implementation structures.

---

# 20. Contract Evolution

Contract changes shall be classified as:

* additive;
* compatible;
* deprecating;
* breaking.

Breaking changes require:

* versioning decision;
* compatibility analysis;
* migration strategy;
* affected consumer identification;
* contract tests;
* documentation update;
* ADR review where architectural.

---

# 21. Engine Commands

Every Engine command shall:

* express one intent;
* belong to one Engine;
* use canonical terminology;
* define validation;
* define result;
* define failure;
* define idempotency where required;
* define authorization where required;
* define emitted events where relevant.

Commands shall not expose internal implementation operations.

---

# 22. Engine Queries

Every Engine query shall:

* express one information need;
* belong to one Engine;
* avoid hidden mutation;
* define consistency expectations;
* define pagination where relevant;
* define authorization where required;
* return public or canonical types.

Queries shall not return private persistence models.

---

# 23. Engine Events

Every Engine event shall:

* represent an occurred fact;
* belong to the Engine that owns the fact;
* preserve stable identity;
* include correlation and causation where relevant;
* define ordering scope where required;
* define version;
* define replay behavior where supported;
* avoid leaking private internal state.

An Engine shall not publish events for facts it does not own.

---

# 24. Engine Workflows

A cross-Engine workflow shall have one authoritative coordinator.

The coordinator shall define:

* workflow identity;
* participants;
* stages;
* transitions;
* commands;
* events;
* retries;
* timeouts;
* compensation;
* cancellation;
* persistence;
* recovery;
* completion criteria.

Participating Engines shall not infer workflow state from local assumptions.

---

# 25. Domain Interaction

Engines operate on Domain concepts.

They shall preserve Domain authority.

An Engine may:

* create valid Domain objects;
* transform Domain objects according to documented rules;
* validate Domain objects;
* query Domain representations;
* emit events about Domain operations.

An Engine shall not:

* add undocumented fields to Domain objects;
* create Engine-specific identity rules;
* bypass Domain validation;
* reinterpret lifecycle states;
* collapse UDM and DPM;
* discard provenance;
* overwrite user-authored semantics with derived data.

---

# 26. Kernel Interaction

Engines use Kernel mechanisms for:

* commands;
* queries;
* events;
* workflows;
* jobs;
* scheduling;
* configuration;
* logging;
* observability;
* dependency management.

An Engine shall not:

* define a second Event Bus;
* define a second Command Bus;
* define a private workflow mechanism without justification;
* implement hidden scheduling;
* bypass Kernel execution context;
* introduce incompatible retry semantics.

---

# 27. Integration Interaction

Engines shall access external systems through Integration contracts.

Engines shall not depend directly on:

* provider SDKs;
* vendor APIs;
* cloud-specific clients;
* database drivers;
* transport protocols;
* filesystem implementations;
* authentication libraries.

Those dependencies belong to Integration or Implementation adapters.

---

# 28. Execution Interaction

Engine runtime behavior shall remain consistent with `06-Execution/`.

Every Engine shall review relevant rules for:

* concurrency;
* determinism;
* idempotency;
* locking;
* transactions;
* retries;
* commands;
* queries;
* events;
* ordering;
* cache;
* performance;
* memory;
* parallel execution;
* error handling;
* recovery;
* metrics;
* tracing;
* scheduling.

Runtime guarantees shall not remain implicit.

---

# 29. Engine Failure Model

Every Engine shall define its failure model.

Failures shall distinguish where relevant:

* validation failure;
* authorization failure;
* conflict;
* missing dependency;
* unavailable provider;
* unsupported format;
* invalid state;
* timeout;
* cancellation;
* retryable failure;
* terminal failure;
* corruption;
* partial success.

An Engine shall not convert every failure into one generic error.

---

# 30. Partial Success

Operations capable of partial success shall define:

* completed portions;
* failed portions;
* preserved state;
* retry behavior;
* compensation;
* user-visible status;
* provenance;
* continuation behavior.

Partial success shall not be reported as complete success.

---

# 31. Retry Rules

Every retryable Engine operation shall define:

* retryable conditions;
* non-retryable conditions;
* idempotency requirements;
* maximum attempts;
* delay or backoff;
* timeout interaction;
* duplicate side-effect prevention;
* observability;
* terminal behavior.

Retries shall not hide persistent failure.

---

# 32. Idempotency

Operations exposed to:

* retries;
* synchronization;
* event redelivery;
* background jobs;
* workflow recovery;
* external callbacks;

shall define idempotency where required.

Idempotency shall specify:

* key;
* scope;
* owner;
* persistence;
* expiration;
* result reuse;
* conflict behavior.

---

# 33. Concurrency

Every Engine with concurrent operations shall define:

* state ownership;
* isolation;
* serialization points;
* locks where required;
* transaction boundaries;
* conflict handling;
* cancellation;
* resource limits;
* thread-safety or actor-isolation assumptions;
* duplicate execution behavior.

Concurrency shall not be delegated implicitly to implementation.

---

# 34. Determinism

Engines shall identify operations that must be deterministic.

Deterministic operations shall control or record:

* ordering;
* timestamps;
* random input;
* provider versions;
* model versions;
* configuration;
* external data;
* locale;
* timezone.

Derived results shall be reproducible where architecture requires it.

---

# 35. Engine Configuration

Every configuration value shall define:

* owner;
* purpose;
* type;
* default;
* valid range;
* mutability;
* sensitivity;
* source;
* validation;
* restart behavior;
* runtime effect.

Configuration shall not alter architectural ownership.

A configuration switch shall not be used to bypass mandatory invariants.

---

# 36. Engine Observability

Every Engine shall define:

* logs;
* metrics;
* traces;
* health;
* readiness;
* degraded-state signals;
* failure classification;
* correlation identifiers;
* relevant audit events.

Observability shall reveal behavior without exposing user knowledge unnecessarily.

---

# 37. Engine Metrics

Engine metrics may include:

* operation count;
* success count;
* failure count;
* latency;
* queue depth;
* active workflows;
* retry count;
* cache effectiveness;
* resource consumption;
* degraded-state duration.

Metrics shall not use sensitive user data as dimensions.

---

# 38. Engine Logging

Engine logs shall prefer:

* operation type;
* object identifier;
* correlation identifier;
* outcome;
* duration;
* error classification;
* provider identifier where relevant.

Logs shall not contain:

* document content;
* annotation content;
* prompts;
* model responses;
* secrets;
* access tokens;
* private metadata;
* personal knowledge.

Payload logging shall require explicit approval.

---

# 39. Engine Tracing

Tracing shall preserve execution across:

* Engine boundaries;
* commands;
* queries;
* events;
* workflows;
* jobs;
* providers;
* persistence adapters.

Trace propagation shall not expose sensitive payloads.

---

# 40. Engine Security

Every Engine shall define relevant security responsibilities.

These may include:

* authentication requirements;
* authorization;
* capability checks;
* input validation;
* output filtering;
* plugin permissions;
* provider trust;
* data isolation;
* audit events;
* secret handling.

Security policy ownership shall remain explicit.

---

# 41. Engine Privacy

Privacy shall be enforced by design.

Engines shall define:

* data processed;
* data retained;
* data transmitted;
* external disclosure;
* local processing options;
* consent requirements;
* derived data;
* deletion behavior;
* logging restrictions.

No Engine shall send user knowledge to an external provider without an approved contract and user-controlled policy.

---

# 42. Engine Testing

Every Engine shall define:

* unit tests;
* contract tests;
* integration tests;
* workflow tests;
* failure tests;
* recovery tests;
* concurrency tests;
* performance tests;
* security tests;
* privacy tests where relevant.

Tests shall verify architectural behavior, not only implementation success.

---

# 43. Engine Implementation Mapping

Every Engine shall identify corresponding implementation modules.

The mapping shall define:

* architecture owner;
* implementation package or module;
* public interfaces;
* adapters;
* persistence;
* tests;
* operations;
* deployment context.

Implementation shall not add responsibilities absent from Engine architecture.

---

# 44. New Engine Rules

A new Engine requires proof that:

* the capability is distinct;
* the capability is durable;
* no existing Engine owns it;
* the boundary reduces coupling;
* the Engine can expose explicit contracts;
* state ownership is clear;
* lifecycle is clear;
* failure behavior is clear;
* implementation can remain isolated;
* cross-Engine interactions remain coherent.

A new Engine normally requires:

* architectural impact analysis;
* Platform README update;
* Engine README;
* Domain impact review;
* Kernel impact review;
* Integration impact review;
* Execution impact review;
* public contract review;
* C4 update;
* ADR evaluation;
* implementation mapping;
* test strategy.

---

# 45. Engine Merge or Split

Merging or splitting Engines is an architectural change.

It requires analysis of:

* ownership;
* contracts;
* state;
* lifecycle;
* dependencies;
* public APIs;
* implementation modules;
* migrations;
* compatibility;
* diagrams;
* ADRs.

Directory reorganization shall not be mistaken for Engine restructuring.

---

# 46. Platform README

`README.md` is the authoritative rector document for all Engines.

It shall define:

* Platform purpose;
* Engine model;
* common Engine rules;
* Engine registry;
* Engine interactions;
* dependency principles;
* lifecycle principles;
* contract principles;
* common failure rules;
* security;
* privacy;
* observability;
* testing;
* implementation mapping.

Changes to any global Engine rule require review of this document.

---

# 47. AI Engine

The AI Engine owns AI-assisted capabilities inside KnowledgeOS.

It may coordinate:

* local models;
* remote models;
* prompt execution;
* model selection;
* embeddings;
* semantic processing;
* classification;
* summarization;
* extraction;
* reasoning assistance.

The AI Engine shall not make AI output authoritative by default.

---

# 48. AI Engine Invariants

The AI Engine shall preserve:

* provider independence;
* model replaceability;
* local and remote execution;
* privacy controls;
* provenance;
* reproducibility where possible;
* user control;
* explicit confidence;
* derived-data distinction.

AI output shall remain distinguishable from:

* user-authored knowledge;
* imported authoritative data;
* confirmed semantic relationships;
* canonical metadata.

---

# 49. AI Engine Provider Boundary

The AI Engine shall depend on AI provider contracts.

It shall not depend directly on:

* OpenAI SDKs;
* Anthropic SDKs;
* Google SDKs;
* local model runtimes;
* vendor-specific request formats.

Provider adaptation belongs to:

```text
00-Architecture/05-Integration/Providers/AIProviders.md
```

and corresponding implementation adapters.

---

# 50. AI Engine Data Governance

Every AI operation shall define:

* input data;
* output data;
* model;
* provider;
* model version where available;
* operation purpose;
* provenance;
* confidence where relevant;
* retention;
* privacy;
* validation;
* user confirmation where required.

Prompts and responses containing user knowledge shall not be logged by default.

---

# 51. Annotation Engine

The Annotation Engine owns annotation capability.

It may manage:

* notes;
* highlights;
* comments;
* drawings;
* Apple Pencil input;
* post-it annotations;
* anchors;
* annotation lifecycle;
* annotation synchronization.

It shall use canonical Domain annotation and anchor models.

---

# 52. Annotation Engine Invariants

Annotations shall preserve:

* stable identity;
* author;
* target;
* anchor;
* content;
* timestamps;
* provenance;
* version;
* lifecycle;
* synchronization state.

Annotations shall remain associated with content even when layout or source representation changes, where the Domain mapping allows it.

---

# 53. Annotation Anchoring

The Annotation Engine shall not identify targets solely through:

* screen coordinates;
* page coordinates;
* temporary renderer state;
* mutable text offsets.

Anchors shall use canonical UDM and DPM mapping mechanisms.

Ambiguous or unresolved anchors shall be represented explicitly.

---

# 54. Export Engine

The Export Engine owns transformation from KnowledgeOS canonical models into external representations.

It may support formats such as:

* Markdown;
* HTML;
* PDF;
* EPUB;
* canonical exchange formats;
* future approved formats.

Export shall preserve as much meaning as the target format supports.

---

# 55. Export Engine Rules

Every export format shall define:

* supported Domain content;
* unsupported content;
* loss behavior;
* identity preservation;
* metadata preservation;
* provenance preservation;
* asset handling;
* annotation handling;
* presentation handling;
* validation;
* determinism;
* reproducibility.

Information loss shall be reported.

---

# 56. Export Provider Boundary

Format-specific or external export implementations shall use provider contracts.

The Export Engine shall not depend directly on one rendering or conversion library.

Export provider architecture belongs to Integration.

---

# 57. Import Engine

The Import Engine owns conversion from external sources into canonical KnowledgeOS models.

It may coordinate:

* acquisition;
* format detection;
* parsing;
* extraction;
* normalization;
* UDM creation;
* DPM creation;
* asset extraction;
* metadata extraction;
* provenance;
* validation.

---

# 58. Import Engine Invariants

Import shall preserve:

* source identity;
* provenance;
* original assets;
* original files where required;
* extracted content;
* validation results;
* processing status;
* recoverability.

Import shall not silently treat uncertain extraction as confirmed meaning.

---

# 59. Import Pipeline

The Import Engine shall define an explicit pipeline.

Typical stages may include:

```text
Acquire
    ↓
Identify
    ↓
Extract
    ↓
Normalize
    ↓
Construct UDM
    ↓
Construct DPM
    ↓
Validate
    ↓
Persist
    ↓
Publish availability
```

Each stage shall define:

* input;
* output;
* owner;
* failure;
* retry;
* idempotency;
* provenance;
* recovery.

---

# 60. Import Provider Boundary

Source-format parsers, OCR providers and external acquisition mechanisms belong behind Integration contracts.

The Import Engine shall not expose provider-specific structures as canonical Domain structures.

---

# 61. Knowledge Engine

The Knowledge Engine owns high-level operations over managed knowledge.

It may coordinate:

* Knowledge Object creation;
* enrichment;
* metadata operations;
* relationships;
* knowledge lifecycle;
* graph integration;
* semantic organization;
* knowledge retrieval at the Domain level.

It shall not duplicate Search, Library or AI responsibilities.

---

# 62. Knowledge Engine Boundaries

The Knowledge Engine may own semantic operations.

It shall not own:

* physical storage;
* synchronization transport;
* rendering;
* format parsing;
* export encoding;
* model-provider execution;
* UI navigation.

The boundary between Knowledge and Search shall remain explicit.

The boundary between Knowledge and Library shall remain explicit.

---

# 63. Library Engine

The Library Engine owns library-level organization and access.

It may coordinate:

* Master Library;
* Local Libraries;
* catalog access;
* library membership;
* availability;
* acquisition registration;
* library lifecycle;
* authoritative ownership;
* local cache relationships.

It shall preserve the Master Library authority defined by architecture.

---

# 64. Library Engine Invariants

The Library Engine shall preserve:

* NAS as authoritative source for the Master Library;
* local-first usability;
* offline access;
* stable Knowledge Object identity;
* catalog integrity;
* recoverability;
* explicit local and authoritative state;
* synchronization compatibility.

A Local Library shall not silently become the Master Library.

---

# 65. Library and Storage Separation

The Library Engine owns library semantics.

Storage Integration owns storage abstraction.

Implementation owns concrete storage technology.

The Library Engine shall not define:

* PostgreSQL-specific behavior;
* filesystem mount commands;
* NAS vendor behavior;
* storage-driver details.

It shall define the behavior those implementations must preserve.

---

# 66. Plugin Engine

The Plugin Engine owns plugin discovery, lifecycle, capability access and isolation.

It may coordinate:

* plugin installation;
* plugin activation;
* plugin deactivation;
* manifest validation;
* capability grants;
* compatibility;
* extension registration;
* plugin execution;
* plugin removal.

The Plugin Engine shall use Plugin SDK contracts defined in Integration.

---

# 67. Plugin Engine Invariants

Plugins shall:

* declare capabilities;
* receive only approved permissions;
* use versioned contracts;
* remain isolated from internal state;
* be unloadable where architecture permits;
* have explicit lifecycle;
* have explicit failure containment;
* preserve user control.

A plugin shall not gain unrestricted repository, storage, network or AI access.

---

# 68. Plugin Trust

Plugin trust levels shall be explicit.

Trust may influence:

* capabilities;
* sandboxing;
* network access;
* storage access;
* user-data access;
* execution limits;
* review requirements.

Trust shall not be inferred solely from installation source.

---

# 69. Render Engine

The Render Engine owns transformation of canonical Domain models into visual or interactive presentation.

It may render:

* UDM;
* DPM;
* annotations;
* assets;
* themes;
* reading views;
* editing views;
* publication views.

It shall remain independent from one UI framework.

---

# 70. Render Engine Invariants

Rendering shall not modify canonical meaning.

The Render Engine shall preserve:

* semantic structure;
* presentation mapping;
* reading flow;
* annotation anchors;
* accessibility;
* deterministic output where required;
* graceful degradation.

Renderer-specific state shall not become Domain state.

---

# 71. Render and DPM

DPM is the canonical presentation model.

The Render Engine consumes DPM.

It shall not redefine DPM through UI component structure.

When rendering requires information absent from DPM, the architectural gap shall be reviewed rather than hidden in renderer-specific metadata.

---

# 72. Search Engine

The Search Engine owns indexing, retrieval and ranking capability.

It may coordinate:

* lexical indexing;
* semantic indexing;
* metadata indexing;
* graph-aware retrieval;
* filtering;
* ranking;
* result explanation;
* index maintenance.

Search indexes are derived state.

They are not authoritative knowledge storage.

---

# 73. Search Engine Invariants

The Search Engine shall preserve:

* source traceability;
* result identity;
* index rebuildability;
* privacy;
* provider independence;
* deterministic ranking where required;
* explicit ranking signals;
* stale-index detection;
* offline search capability where required.

Search results shall refer back to authoritative Knowledge Objects and Domain identities.

---

# 74. Search and AI Boundary

Search may use AI-generated embeddings or ranking signals.

However:

* the AI Engine owns model execution;
* the Search Engine owns retrieval and ranking;
* embeddings remain derived artifacts;
* AI inference shall not silently change authoritative knowledge;
* model provenance shall be preserved.

---

# 75. Sync Engine

The Sync Engine owns synchronization semantics and orchestration.

It may coordinate:

* synchronization sessions;
* change detection;
* transfer planning;
* conflict detection;
* conflict resolution;
* retries;
* checkpoints;
* recovery;
* local and Master Library reconciliation.

It shall preserve the authoritative ownership model.

---

# 76. Sync Engine Invariants

Synchronization shall preserve:

* stable identity;
* authoritative source;
* offline operation;
* idempotency;
* retry safety;
* conflict visibility;
* partial failure recovery;
* ordering where required;
* provenance;
* data integrity;
* user knowledge.

Synchronization shall not silently discard conflicting data.

---

# 77. Synchronization Authority

The Sync Engine owns synchronization semantics.

Synchronization Integration owns transport and external adaptation.

Storage Integration owns storage interfaces.

The Library Engine owns library semantics.

Implementation owns concrete synchronization mechanisms.

These responsibilities shall remain distinct.

---

# 78. Conflict Handling

Conflict handling shall define:

* conflict identity;
* affected object;
* competing versions;
* authority;
* detection rule;
* automatic resolution rule where allowed;
* user resolution where required;
* preserved provenance;
* result;
* audit trail.

Last-write-wins shall not be assumed without an approved architectural decision.

---

# 79. Offline Operation

Every Engine shall identify which capabilities remain available offline.

Offline behavior shall define:

* available operations;
* queued operations;
* local state;
* unavailable dependencies;
* conflict implications;
* synchronization on reconnection;
* failure messages;
* degraded behavior.

Network loss shall be treated as a normal operating condition, not an exceptional architecture violation.

---

# 80. Cache Rules

Engine caches shall be:

* derived;
* bounded;
* invalidatable;
* observable;
* non-authoritative;
* privacy-aware.

Every cache shall define:

* key;
* value;
* owner;
* lifetime;
* invalidation;
* consistency;
* persistence;
* recovery;
* memory or storage limits.

Cache state shall not become the only copy of user knowledge.

---

# 81. Platform Extension

Platform extensibility shall use:

* Plugin Engine;
* Plugin SDK;
* Providers;
* public contracts;
* explicit extension points.

Agents shall not create ad hoc extension hooks inside Engines.

Every extension point shall define:

* purpose;
* contract;
* capability;
* permissions;
* lifecycle;
* compatibility;
* validation;
* failure isolation;
* security.

---

# 82. Platform Documentation Rules

Each Engine `README.md` shall define, where applicable:

```text
Purpose
Scope
Responsibilities
Non-Responsibilities
Domain Model
Operations
Commands
Queries
Events
Workflows
Contracts
Dependencies
Lifecycle
State
Concurrency
Idempotency
Failure Behavior
Configuration
Security
Privacy
Observability
Testing
Extension Points
Implementation Mapping
Related ADRs
Related Diagrams
```

Engine documents shall not duplicate Platform-wide rules unnecessarily.

They shall reference this file and the Platform rector document.

---

# 83. Platform Vocabulary

Canonical Engine names are:

* AI Engine;
* Annotation Engine;
* Export Engine;
* Import Engine;
* Knowledge Engine;
* Library Engine;
* Plugin Engine;
* Render Engine;
* Search Engine;
* Sync Engine.

Agents shall preserve canonical capitalization.

Do not alternate casually between:

* Engine and Service;
* Sync and Synchronization Engine;
* Library and Repository;
* Knowledge and Knowledge Graph;
* Import and Ingestion;
* Render and Viewer.

Different terms may exist only when their responsibilities are explicitly distinct.

---

# 84. Platform Diagrams

Platform changes shall review relevant C4 and UML views.

Diagrams may need to represent:

* Engine boundaries;
* Engine interactions;
* commands;
* events;
* workflows;
* provider boundaries;
* runtime execution;
* synchronization;
* import;
* rendering;
* plugin lifecycle.

Architecture shall not exist only in prose when a behavioral or structural diagram is required for clarity.

---

# 85. Platform ADR Impact

A Platform change may require ADR review when it:

* creates a new Engine;
* removes an Engine;
* changes Engine ownership;
* changes Engine boundaries;
* changes cross-Engine communication;
* changes public contracts;
* changes AI architecture;
* changes plugin architecture;
* changes synchronization;
* changes library authority;
* changes event architecture;
* changes execution guarantees.

Relevant ADRs include:

```text
ADR-003-Offline-First.md
ADR-004-Library-Source-of-Truth.md
ADR-005-Engine-Based-Architecture.md
ADR-006-AI-Architecture.md
ADR-007-Plugin-Architecture.md
ADR-008-Storage-Architecture.md
ADR-009-Synchronization-Strategy.md
ADR-010-Document-Identity.md
ADR-011-Event-Architecture.md
ADR-012-Public-Contracts.md
ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md
```

---

# 86. Cross-Engine Impact Examples

## Import Engine change

Review:

* UDM;
* DPM;
* Knowledge Object;
* Library Engine;
* Knowledge Engine;
* AI Engine;
* Render Engine;
* Search Engine;
* Sync Engine;
* Data Exchange;
* Providers;
* persistence;
* tests.

## Library Engine change

Review:

* Master Library authority;
* Local Library behavior;
* Storage;
* Synchronization;
* Sync Engine;
* Knowledge Engine;
* implementation persistence;
* client behavior;
* operations;
* ADR-004;
* ADR-008;
* ADR-013.

## AI Engine change

Review:

* AI Providers;
* Search Engine;
* Knowledge Engine;
* Import Engine;
* privacy;
* provenance;
* derived data;
* local and remote execution;
* Plugin SDK;
* ADR-006.

## Plugin Engine change

Review:

* Plugin SDK;
* capabilities;
* compatibility;
* manifests;
* permissions;
* security;
* public contracts;
* every exposed Engine extension point;
* ADR-007.

## Sync Engine change

Review:

* Library Engine;
* Storage;
* Synchronization;
* Identity;
* Knowledge Object versioning;
* Execution;
* Reliability;
* Master Library;
* Local Library;
* recovery;
* ADR-003;
* ADR-004;
* ADR-008;
* ADR-009;
* ADR-013.

---

# 87. Platform Review Checklist

Before approving a Platform change, verify:

* the capability belongs in Platform;
* the correct Engine owns it;
* no responsibility duplication exists;
* Domain semantics remain authoritative;
* Kernel remains generic;
* Engine boundaries remain isolated;
* interactions use approved contracts;
* no private state is exposed;
* lifecycle is explicit;
* failure behavior is explicit;
* concurrency is explicit;
* idempotency is addressed;
* offline behavior is addressed;
* state ownership is explicit;
* authoritative state is preserved;
* security is addressed;
* privacy is addressed;
* observability is addressed;
* Integration impact was reviewed;
* Execution impact was reviewed;
* implementation impact was reviewed;
* tests are defined;
* ADR impact was reviewed;
* diagrams were reviewed.

---

# 88. Minimum Change Rule

Agents shall make the smallest complete Platform change.

They shall not:

* create Engines casually;
* merge Engine responsibilities for convenience;
* access another Engine's internal state;
* expose private implementation through contracts;
* add provider-specific behavior to Engine architecture;
* introduce direct infrastructure dependencies;
* duplicate Domain models;
* duplicate Kernel mechanisms;
* introduce hidden online requirements;
* make caches authoritative;
* treat derived AI data as confirmed knowledge;
* use plugins to bypass security boundaries;
* introduce speculative extension points;
* restructure Platform directories without architectural need.

---

# 89. Platform Completion Criteria

Platform work is complete only when:

* the capability has one authoritative Engine owner;
* responsibilities and non-responsibilities are explicit;
* Domain usage is correct;
* Kernel usage is correct;
* Engine interactions are contracted;
* state ownership is explicit;
* lifecycle is explicit;
* failure behavior is explicit;
* retry and idempotency are defined;
* concurrency is defined;
* offline behavior is defined;
* security is reviewed;
* privacy is reviewed;
* observability is defined;
* Integration impact is addressed;
* Execution impact is addressed;
* implementation mapping is identified;
* tests are defined;
* ADR impact is resolved;
* diagrams are updated where required;
* no unresolved boundary violation remains.

---

# 90. Agent Reporting

After Platform work, the agent shall report:

* the Platform objective;
* the affected Engine;
* responsibility impact;
* files reviewed;
* files created;
* files modified;
* Domain impact;
* Kernel impact;
* cross-Engine impact;
* contract impact;
* state impact;
* lifecycle impact;
* failure impact;
* concurrency impact;
* offline impact;
* security impact;
* privacy impact;
* Integration impact;
* Execution impact;
* implementation impact;
* ADR impact;
* diagram impact;
* validation performed;
* unresolved risks.

---

# 91. Final Rule

The Platform transforms KnowledgeOS architecture into coherent product capabilities.

Every capability shall have one owner.

Every Engine shall have a boundary.

Every interaction shall have a contract.

Every state shall have an authority.

Every failure shall have explicit behavior.

Every external dependency shall remain replaceable.

Before adding behavior, identify the responsible Engine.

Before calling another Engine, define the contract.

Before sharing state, reconsider the boundary.

Before using a provider, preserve abstraction.

Before declaring completion, verify the complete Domain-to-Engine-to-Integration-to-Implementation path.

---

# End of `00-Architecture/04-Platform/AGENTS.md`
