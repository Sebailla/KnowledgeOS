
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Architecture
**Path:** `00-Architecture/`
**Document:** Architecture Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the mandatory operational rules for every human or AI agent working inside `00-Architecture/`.

It explains:

* how architectural documentation is organized;
* which documents are authoritative;
* how architectural changes shall be analyzed;
* which dependencies and boundaries shall be preserved;
* how ADRs, diagrams and governance documents shall be maintained;
* how implementation work shall remain aligned with the architecture.

This document refines the repository-wide rules defined in the root `AGENTS.md`.

It does not replace any architecture document.

---

# 2. Scope

These instructions apply to:

```text
00-Architecture/
├── 01-Foundation/
├── 02-Domain/
├── 03-Kernel/
├── 04-Platform/
├── 05-Integration/
├── 06-Execution/
├── 07-ArchitectureViews/
└── 08-Governance/
```

They apply to:

* architecture creation;
* architecture review;
* architecture correction;
* architecture evolution;
* documentation changes;
* ADR creation;
* model changes;
* diagram changes;
* architecture validation;
* architecture-to-implementation traceability.

---

# 3. Instruction Precedence

Agents working inside `00-Architecture/` shall follow instructions in this order:

1. root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. the nearest local `AGENTS.md`;
4. approved governance documents;
5. approved ADRs;
6. authoritative module documentation;
7. task-specific instructions.

A local instruction may refine or strengthen this document.

A local instruction shall not weaken:

* Product Vision;
* architectural principles;
* architectural constraints;
* frozen architectural decisions;
* approved ADRs;
* architectural invariants.

---

# 4. Architectural Authority

The architecture is the normative definition of KnowledgeOS.

It defines:

* system purpose;
* architectural boundaries;
* domain semantics;
* execution responsibilities;
* platform capabilities;
* integration contracts;
* runtime guarantees;
* persistence authority;
* synchronization behavior;
* architectural governance.

Implementation shall conform to architecture.

Architecture shall not be retroactively rewritten solely to justify implementation drift.

When implementation and architecture conflict, the conflict shall be documented and resolved explicitly.

---

# 5. Architecture Reading Order

Before performing architecture work, read the following documents in order.

## 5.1 Mandatory foundation reading

```text
01-Foundation/ProductVision.md
01-Foundation/ArchitecturePrinciples.md
01-Foundation/ArchitectureConstraints.md
01-Foundation/ArchitectureModel.md
01-Foundation/QualityAttributes.md
```

## 5.2 Mandatory governance reading

```text
08-Governance/ArchitectureFreeze-v3.0.md
08-Governance/ArchitectureReview-v3.0.md
08-Governance/ArchitectureVocabulary.md
08-Governance/DocumentationStandards.md
08-Governance/ArchitectureDecisionMatrix.md
```

## 5.3 Decision reading

Read all ADRs directly related to the task under:

```text
07-ArchitectureViews/ADR/
```

## 5.4 Module reading

Read the `README.md` of the affected architecture area and all directly related documents.

## 5.5 Diagram reading

Review the relevant:

* C4 diagrams;
* UML diagrams;
* rendered architectural views;
* diagram validation reports.

The complete architecture shall not be loaded without necessity.

Read the minimum context required to understand the full impact of the task.

---

# 6. Architectural Freeze

KnowledgeOS Architecture V3 is frozen.

The freeze means that agents shall not casually modify:

* architectural layers;
* primary responsibilities;
* system boundaries;
* architectural principles;
* foundational concepts;
* domain model foundations;
* Engine-based architecture;
* persistence authority;
* synchronization strategy;
* identity semantics;
* public contract strategy.

A frozen architecture may evolve only through the approved governance process.

Architectural freeze does not prevent:

* clarification;
* consistency correction;
* missing-document completion;
* non-semantic editorial correction;
* traceability improvement;
* diagram synchronization;
* approved amendments;
* approved new ADRs.

A clarification shall not be used to introduce a hidden architectural change.

---

# 7. Architecture Change Classification

Before modifying any architecture document, classify the change.

## 7.1 Editorial change

An editorial change:

* corrects spelling;
* corrects grammar;
* improves readability;
* fixes formatting;
* repairs references;
* does not change meaning.

Editorial changes do not normally require an ADR.

## 7.2 Clarification

A clarification:

* makes an existing rule explicit;
* resolves ambiguity;
* adds an example;
* improves traceability;
* does not change architectural behavior.

Clarifications require consistency review.

## 7.3 Completion

A completion:

* documents an already approved concept;
* fills a known documentation gap;
* creates a missing document required by the existing structure;
* does not introduce a new architectural decision.

Completion work shall cite its architectural basis.

## 7.4 Extension

An extension:

* adds a new capability;
* adds a new contract;
* adds a new provider type;
* adds a new execution mechanism;
* expands an existing architectural concept.

Extensions require impact analysis and may require an ADR.

## 7.5 Architectural change

An architectural change modifies:

* responsibility;
* authority;
* dependency direction;
* identity;
* persistence;
* synchronization;
* lifecycle;
* public behavior;
* compatibility;
* system topology;
* architectural invariant.

Architectural changes require formal governance.

---

# 8. Mandatory Impact Analysis

Every non-editorial architectural change shall identify impact on:

* Product Vision;
* architecture principles;
* architecture constraints;
* quality attributes;
* existing ADRs;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* architecture diagrams;
* implementation documentation;
* public contracts;
* persistence;
* synchronization;
* security;
* privacy;
* testing;
* operations;
* compatibility;
* migrations.

The absence of impact shall not be assumed.

It shall be verified.

---

# 9. Architecture Layer Responsibilities

The architecture is organized into explicit responsibility areas.

## 9.1 Foundation

Foundation defines:

* product purpose;
* architectural principles;
* architectural constraints;
* architecture model;
* quality attributes.

Foundation documents are highly stable.

They shall not contain implementation detail.

## 9.2 Domain

Domain defines:

* KnowledgeOS semantics;
* UDM;
* DPM;
* Knowledge Objects;
* Identity;
* Knowledge Graph;
* lifecycle;
* provenance;
* relationships;
* validation rules.

Domain shall remain technology-independent.

## 9.3 Kernel

Kernel defines reusable execution mechanisms.

It includes:

* commands;
* queries;
* events;
* workflows;
* jobs;
* scheduling;
* configuration;
* dependency injection;
* logging;
* observability.

Kernel shall not contain product-specific business logic.

## 9.4 Platform

Platform defines product capabilities through Engines.

It includes:

* AI;
* Annotation;
* Export;
* Import;
* Knowledge;
* Library;
* Plugin;
* Render;
* Search;
* Sync.

Platform operates over Domain concepts and Kernel mechanisms.

## 9.5 Integration

Integration defines boundaries with:

* external services;
* providers;
* plugins;
* public APIs;
* data exchange;
* storage systems;
* synchronization mechanisms.

Integration shall prevent external semantics from contaminating the Domain.

## 9.6 Execution

Execution defines runtime guarantees and operational behavior.

It includes:

* concurrency;
* messaging;
* performance;
* reliability;
* runtime lifecycle.

Execution documentation makes runtime assumptions explicit.

## 9.7 Architecture Views

Architecture Views contain:

* ADRs;
* C4 diagrams;
* UML diagrams;
* rendered diagrams;
* validation tooling.

Views represent architecture.

They shall not independently invent architecture.

## 9.8 Governance

Governance defines:

* architectural control;
* architectural freeze;
* amendment process;
* review process;
* decision rules;
* vocabulary;
* documentation standards;
* architecture backlog.

Governance controls architecture evolution.

---

# 10. Dependency Direction

Architectural dependencies shall preserve the intended direction.

Conceptually:

```text
Foundation
    ↓
Domain
    ↓
Kernel mechanisms
    ↓
Platform capabilities
    ↓
Integration boundaries
    ↓
Implementation
    ↓
Infrastructure and external systems
```

Execution provides runtime rules applicable across Kernel, Platform and Integration.

Architecture Views describe and validate the architecture.

Governance controls changes to all architectural areas.

This conceptual representation does not authorize unrestricted dependencies.

Every dependency shall have an explicit architectural reason.

---

# 11. Foundation Rules

Changes inside `01-Foundation/` require exceptional care.

Agents shall preserve:

* stable product intent;
* technology neutrality;
* architectural consistency;
* long-term applicability;
* independence from temporary implementation choices.

Foundation documents shall not include:

* framework choices;
* library versions;
* database schemas;
* API endpoints;
* UI component details;
* deployment commands;
* implementation-specific class names.

## 11.1 Product Vision

`ProductVision.md` defines what KnowledgeOS is intended to become.

It shall not be modified to justify short-term implementation convenience.

Changes require governance approval.

## 11.2 Architecture Principles

Architecture principles are normative.

A new principle requires:

* clear motivation;
* cross-architecture applicability;
* explicit implications;
* consistency with existing principles;
* governance approval.

Principles shall not duplicate constraints or implementation rules.

## 11.3 Architecture Constraints

Constraints define non-negotiable boundaries.

A constraint shall be:

* explicit;
* testable when possible;
* justified;
* stable;
* traceable.

## 11.4 Architecture Model

The architecture model defines system organization and responsibility.

It shall remain synchronized with:

* C4 views;
* module READMEs;
* ADRs;
* implementation architecture.

## 11.5 Quality Attributes

Quality attributes shall define measurable or evaluable architectural expectations.

Examples include:

* reliability;
* availability;
* performance;
* portability;
* privacy;
* security;
* maintainability;
* recoverability;
* interoperability;
* usability.

Quality attributes shall not remain as generic aspirations.

---

# 12. Domain Rules

Domain is the semantic core of KnowledgeOS.

Agents modifying `02-Domain/` shall preserve semantic integrity across all related models.

## 12.1 Technology independence

Domain documents shall not depend on:

* Swift;
* Rust;
* TypeScript;
* SQL;
* PostgreSQL;
* SwiftUI;
* web frameworks;
* network protocols;
* cloud providers;
* file-system APIs.

Implementation mappings belong outside the Domain.

## 12.2 Universal Document Model

UDM defines the canonical semantic representation of document content.

Changes to UDM shall review:

* identity;
* node model;
* type system;
* temporal model;
* processing;
* serialization;
* validation;
* graph semantics;
* DPM mapping;
* persistence mapping;
* synchronization impact.

UDM changes shall not be isolated to one file when they affect multiple model dimensions.

## 12.3 Document Presentation Model

DPM defines presentation structure and visual reconstruction.

Changes to DPM shall review:

* presentation identity;
* layout;
* regions;
* pages;
* reading flow;
* style;
* typography;
* assets;
* anchors;
* UDM mapping;
* serialization;
* validation.

DPM shall not replace UDM semantics.

## 12.4 Knowledge Object

Knowledge Object defines the managed unit of knowledge.

Changes shall review:

* metadata;
* provenance;
* sources;
* assets;
* relationships;
* versioning;
* lifecycle;
* identity.

## 12.5 Identity

Identity semantics shall remain stable across:

* ingestion;
* import;
* storage;
* synchronization;
* versioning;
* processing;
* rendering;
* export.

Identity changes require explicit architectural review and normally require an ADR.

## 12.6 Knowledge Graph

Knowledge Graph documentation shall distinguish:

* explicit relationships;
* inferred relationships;
* semantic associations;
* provenance;
* confidence;
* ontology;
* embeddings;
* reasoning outputs.

Generated semantic relationships shall not silently become authoritative user knowledge.

## 12.7 Domain duplication

Agents shall not create:

* alternate document models;
* parallel identity systems;
* duplicate metadata models;
* independent relationship models;
* Engine-specific domain entities that redefine canonical Domain concepts.

Before adding a concept, search the entire Domain.

---

# 13. Kernel Rules

Kernel provides generic mechanisms.

Agents modifying `03-Kernel/` shall preserve neutrality.

Kernel may define:

* execution abstractions;
* dispatch mechanisms;
* scheduling mechanisms;
* dependency resolution;
* configuration;
* generic logging;
* generic observability;
* generic workflow coordination.

Kernel shall not define:

* document semantics;
* library policies;
* synchronization business rules;
* search ranking policy;
* AI provider behavior;
* annotation meaning;
* rendering rules;
* user-interface behavior.

## 13.1 Command Bus

Commands represent intent to perform an operation.

Command handling shall define:

* validation;
* authorization where relevant;
* execution semantics;
* failure semantics;
* idempotency where required;
* observability.

## 13.2 Query Bus

Queries retrieve information without introducing hidden side effects.

A query shall not silently mutate system state.

## 13.3 Event Bus

Events describe facts that occurred.

Events shall be:

* immutable after publication;
* versionable;
* traceable;
* ordered where required;
* replay-safe where required.

## 13.4 Workflow Engine

Workflows coordinate multiple operations.

Workflow definitions shall make explicit:

* states;
* transitions;
* compensation;
* retry behavior;
* failure behavior;
* persistence;
* recovery.

## 13.5 Job System and Scheduler

Jobs and scheduled operations shall define:

* ownership;
* lifecycle;
* retry policy;
* cancellation;
* resource limits;
* observability;
* idempotency.

---

# 14. Platform Rules

Platform is organized around Engines.

Every Engine shall have:

* a bounded responsibility;
* defined inputs;
* defined outputs;
* public contracts;
* lifecycle behavior;
* failure behavior;
* observability;
* testability;
* dependency rules.

## 14.1 Engine boundaries

An Engine shall not:

* access another Engine's internal storage directly;
* depend on another Engine's private types;
* modify another Engine's internal state;
* bypass public contracts;
* assume execution ordering without an explicit contract.

## 14.2 Cross-Engine communication

Cross-Engine communication shall use approved mechanisms such as:

* commands;
* queries;
* events;
* public services;
* canonical contracts;
* workflow coordination.

## 14.3 Engine creation

A new Engine requires:

* a responsibility not already owned;
* architectural justification;
* boundary analysis;
* dependency analysis;
* public contract design;
* lifecycle definition;
* failure model;
* ADR review;
* governance approval when required.

An Engine shall not be created merely to organize files.

## 14.4 Engine-specific changes

Changes to one Engine shall review:

* related Domain models;
* Kernel mechanisms;
* Integration contracts;
* Execution guarantees;
* public APIs;
* implementation modules;
* tests;
* diagrams.

---

# 15. Integration Rules

Integration protects internal architecture from external variability.

Agents modifying `05-Integration/` shall preserve canonical internal contracts.

## 15.1 Data Exchange

Data exchange shall define:

* canonical formats;
* serialization;
* validation;
* compatibility;
* import behavior;
* export behavior;
* loss handling;
* identity preservation;
* provenance preservation.

## 15.2 External Services

External service integrations shall define:

* trust boundaries;
* authentication;
* authorization;
* failure behavior;
* timeout behavior;
* retry behavior;
* privacy implications;
* data disclosure;
* provider replacement.

## 15.3 Plugin SDK

Plugin SDK changes shall preserve:

* capability isolation;
* explicit permissions;
* compatibility;
* versioned contracts;
* extension boundaries;
* manifest validation;
* security.

Plugins shall not receive unrestricted access to internal state.

## 15.4 Providers

Providers adapt interchangeable implementations.

Provider-specific concepts shall not become Domain concepts.

A provider shall conform to an approved provider contract.

## 15.5 Public API

Public APIs shall define:

* authentication;
* authorization;
* versioning;
* compatibility;
* pagination;
* error contracts;
* rate limits where relevant;
* security boundaries;
* local and remote behavior.

## 15.6 Storage and Synchronization

Integration-level storage and synchronization documents shall remain consistent with:

* NAS source-of-truth rules;
* Master Library authority;
* local library behavior;
* offline-first operation;
* ADR-004;
* ADR-008;
* ADR-009;
* ADR-013.

---

# 16. Execution Rules

Execution documentation defines how architecture behaves at runtime.

Agents modifying `06-Execution/` shall make all relevant runtime assumptions explicit.

## 16.1 Concurrency

Concurrency documentation shall define:

* ownership;
* isolation;
* shared state;
* locking;
* transactions;
* race prevention;
* deadlock considerations;
* cancellation;
* retry interaction.

## 16.2 Determinism

Deterministic operations shall define:

* controlled inputs;
* configuration;
* ordering;
* randomness;
* timestamps;
* external dependencies;
* reproducibility expectations.

## 16.3 Idempotency

Idempotent operations shall identify:

* idempotency key;
* operation scope;
* persistence;
* expiration;
* duplicate detection;
* side-effect handling.

## 16.4 Messaging

Messaging shall define:

* commands;
* events;
* queries;
* delivery guarantees;
* ordering;
* duplication;
* retries;
* dead-letter behavior;
* compatibility.

## 16.5 Performance

Performance documentation shall define:

* expected workload;
* constraints;
* budgets;
* cache behavior;
* memory limits;
* execution profiles;
* parallelism;
* measurement methodology.

## 16.6 Reliability

Reliability documentation shall define:

* error classification;
* recovery;
* checkpointing;
* metrics;
* tracing;
* health;
* partial failure;
* degraded operation.

## 16.7 Runtime

Runtime documentation shall define:

* startup;
* shutdown;
* lifecycle;
* background work;
* execution context;
* scheduling;
* resource allocation;
* recovery.

---

# 17. ADR Rules

ADRs are immutable records of architectural decisions.

Agents shall not rewrite approved ADRs to change their meaning.

## 17.1 ADR creation

A new ADR is required when a decision:

* affects multiple modules;
* establishes a durable architectural rule;
* changes dependency direction;
* changes persistence authority;
* changes identity semantics;
* changes synchronization strategy;
* introduces a new architectural mechanism;
* selects among significant alternatives;
* creates long-term trade-offs.

## 17.2 ADR structure

Every ADR shall contain:

* identifier;
* title;
* status;
* context;
* decision;
* rationale;
* alternatives considered;
* consequences;
* trade-offs;
* affected areas;
* compatibility impact;
* migration impact;
* validation criteria;
* related ADRs;
* related documents;
* related diagrams.

## 17.3 ADR lifecycle

Supported states include:

* Proposed;
* Accepted;
* Approved;
* Rejected;
* Deprecated;
* Superseded.

Status terminology shall follow governance documentation.

## 17.4 Supersession

When a decision changes:

1. create a new ADR;
2. preserve the old ADR;
3. mark the old ADR as superseded;
4. link both records;
5. update affected architecture;
6. update diagrams;
7. define migration implications.

## 17.5 ADR numbering

ADR identifiers shall remain sequential and stable.

Existing identifiers shall never be reused.

---

# 18. C4 Rules

C4 is the primary system-structure notation.

C4 diagrams shall preserve one abstraction level per diagram.

## 18.1 Level 1 — System Context

The System Context diagram defines:

* users;
* KnowledgeOS;
* external systems;
* major relationships.

It shall not include internal components.

## 18.2 Level 2 — Containers

Container diagrams define major deployable or executable units.

They shall not include class-level implementation.

## 18.3 Level 3 — Components

Component diagrams define major internal responsibilities within one container or bounded architectural area.

## 18.4 Level 4 — Code

Code-level diagrams shall be used selectively.

They shall not become a substitute for readable code or domain documentation.

## 18.5 C4 source

PlantUML source is authoritative.

Rendered SVG or PNG output is derived.

Agents shall edit `.puml` sources, not rendered files.

## 18.6 C4 validation

Every changed C4 diagram shall:

* compile successfully;
* use repository-local includes;
* preserve stable identifiers;
* use approved terminology;
* avoid unresolved references;
* remain readable;
* match the architecture documents.

---

# 19. UML Rules

UML shall be used when behavioral or structural precision is needed.

## 19.1 Sequence diagrams

Sequence diagrams shall define:

* participants;
* messages;
* order;
* alternate flows;
* failure flows;
* asynchronous behavior;
* relevant contracts.

## 19.2 State diagrams

State diagrams shall define:

* states;
* valid transitions;
* invalid transitions;
* entry conditions;
* exit conditions;
* terminal states;
* recovery paths.

## 19.3 Activity diagrams

Activity diagrams shall define procedural flow without embedding unnecessary implementation detail.

## 19.4 Class and component diagrams

These diagrams shall expose architectural responsibilities and public relationships.

They shall not document every implementation class.

## 19.5 UML validation

Changed UML source shall compile successfully and remain synchronized with the corresponding normative documents.

---

# 20. Diagram Source and Rendered Output

The following principle applies:

```text
Diagram source
    ↓
Validation
    ↓
Rendered output
```

Source files are authoritative.

Rendered files are reproducible outputs.

Agents shall not:

* manually patch rendered images;
* commit stale rendered output;
* leave a source and rendered diagram inconsistent;
* change one diagram without reviewing related diagrams;
* introduce architecture that exists only in a diagram.

---

# 21. Governance Rules

Governance controls architectural evolution.

Agents modifying `08-Governance/` shall preserve institutional memory.

## 21.1 Architecture backlog

The backlog records unresolved or deferred architectural work.

It shall not be treated as an approved decision.

## 21.2 Decision matrix

The decision matrix defines when:

* an ADR is required;
* an amendment is required;
* a review is required;
* implementation may proceed;
* approval is needed.

## 21.3 Architecture freeze

The freeze record defines the approved baseline.

It shall not be silently relaxed.

## 21.4 Architecture review

Architecture reviews shall evaluate:

* consistency;
* completeness;
* contradictions;
* duplication;
* boundary violations;
* traceability;
* documentation state;
* diagram state;
* implementation alignment.

## 21.5 Architecture amendments

An amendment shall:

* identify the frozen baseline;
* explain the required change;
* define affected documents;
* identify affected ADRs;
* describe compatibility;
* describe migration;
* define approval;
* preserve historical traceability.

## 21.6 Vocabulary

Architecture vocabulary is authoritative.

Agents shall use established terms exactly.

Synonyms shall not be introduced without necessity.

---

# 22. Documentation Rules

Architecture documents shall be:

* normative where appropriate;
* explicit;
* internally consistent;
* technology-neutral at the correct layer;
* traceable;
* readable independently;
* version controlled.

Each document shall define one primary architectural concern.

Documents shall reference authoritative definitions rather than duplicate them.

## 22.1 Standard structure

Where applicable, architecture documents should include:

```text
Metadata
Purpose
Scope
Audience
Definitions
Context
Responsibilities
Rules
Invariants
Dependencies
Interactions
Failure Behavior
Security
Observability
Validation
Related Documents
Related ADRs
```

Not every document requires every section.

Structure shall remain proportional to its responsibility.

## 22.2 Normative terminology

Use:

* `SHALL`;
* `SHALL NOT`;
* `SHOULD`;
* `SHOULD NOT`;
* `MAY`.

Avoid vague terms such as:

* usually;
* probably;
* somehow;
* as needed;
* when appropriate;

unless criteria are explicitly defined.

---

# 23. Architecture Vocabulary

Before creating or renaming a concept, agents shall check:

```text
08-Governance/ArchitectureVocabulary.md
```

Names shall:

* express responsibility;
* remain stable;
* avoid vendor terminology;
* avoid implementation leakage;
* avoid ambiguous abbreviations;
* avoid duplication.

Canonical terms include concepts such as:

* Master Library;
* Local Library;
* Knowledge Object;
* UDM;
* DPM;
* Engine;
* Provider;
* Plugin;
* Source of Truth;
* Public Contract;
* Execution Context;
* Knowledge Graph.

Canonical capitalization shall be preserved.

---

# 24. Cross-Document Consistency

A change in one architecture document may require updates elsewhere.

Examples:

## UDM change

Review:

* DPM mappings;
* Knowledge Object;
* Identity;
* Knowledge Graph;
* serialization;
* validation;
* import;
* export;
* rendering;
* persistence;
* synchronization;
* ADRs;
* diagrams.

## Engine responsibility change

Review:

* Platform README;
* target Engine README;
* Kernel interaction;
* Integration contracts;
* Execution behavior;
* implementation modules;
* diagrams;
* ADRs.

## Synchronization change

Review:

* ADR-003;
* ADR-004;
* ADR-008;
* ADR-009;
* ADR-013;
* Sync Engine;
* Synchronization integration;
* execution semantics;
* persistence;
* Master Library implementation;
* client local libraries;
* conflict handling;
* recovery tests.

## Public contract change

Review:

* ADR-012;
* Public API;
* Plugin SDK;
* providers;
* implementation contracts;
* compatibility;
* versioning;
* tests;
* migration.

---

# 25. Architecture-to-Implementation Traceability

Architecture shall be traceable into `01-Implementation/`.

Architecture documents define:

* required behavior;
* boundaries;
* invariants;
* responsibilities;
* quality expectations.

Implementation documents define:

* concrete requirements;
* technical design;
* contracts;
* schemas;
* APIs;
* code organization;
* tests;
* operations.

An implementation document shall not contradict architecture.

When a new implementation requirement reveals missing architecture, the architectural gap shall be resolved before implementation proceeds.

---

# 26. Review Before Modification

Before editing any architecture file, verify:

* the document owner;
* the document status;
* whether the architecture is frozen;
* related ADRs;
* related diagrams;
* related implementation modules;
* terminology;
* cross-document dependencies;
* whether the requested concept already exists.

Agents shall not infer ownership solely from filename location.

The document content and governance rules shall be reviewed.

---

# 27. Minimum Change Principle

Architecture changes shall be minimal but complete.

Agents shall not:

* rewrite unrelated sections;
* renumber concepts unnecessarily;
* change terminology for style;
* restructure directories casually;
* merge distinct concepts;
* split stable concepts without reason;
* introduce speculative future architecture;
* create placeholders presented as completed architecture.

A change shall modify every affected artifact, but no unrelated artifact.

---

# 28. Validation Requirements

Architecture work shall be validated through applicable mechanisms.

Validation may include:

* document review;
* cross-reference review;
* terminology review;
* architecture invariant review;
* ADR compliance review;
* diagram compilation;
* diagram validation script;
* traceability review;
* implementation alignment review;
* link validation;
* duplicate-concept review.

A document being syntactically valid does not mean it is architecturally valid.

---

# 29. Architecture Completion Criteria

Architecture work is complete only when:

* the requested architectural outcome is defined;
* the correct architectural owner contains the definition;
* no duplicate definition exists;
* Product Vision remains consistent;
* principles remain satisfied;
* constraints remain satisfied;
* quality attributes are addressed;
* relevant ADRs are updated or created;
* affected documents are synchronized;
* affected diagrams compile;
* implementation impact is identified;
* migration impact is identified;
* compatibility impact is identified;
* terminology is consistent;
* governance requirements are satisfied;
* no unresolved contradiction remains.

---

# 30. Agent Reporting

After completing architecture work, the agent shall report:

* the architectural objective;
* change classification;
* documents reviewed;
* files created;
* files modified;
* ADR impact;
* diagram impact;
* implementation impact;
* validations performed;
* unresolved risks;
* governance requirements still pending.

The agent shall not claim architectural approval unless approval has actually been granted.

---

# 31. Local AGENTS.md Files

More specific operational rules should be introduced at:

```text
00-Architecture/02-Domain/AGENTS.md
00-Architecture/03-Kernel/AGENTS.md
00-Architecture/04-Platform/AGENTS.md
00-Architecture/05-Integration/AGENTS.md
00-Architecture/06-Execution/AGENTS.md
00-Architecture/07-ArchitectureViews/AGENTS.md
00-Architecture/08-Governance/AGENTS.md
```

A separate `01-Foundation/AGENTS.md` may be added when Foundation modification work becomes frequent.

Local files shall contain only rules unique to their architectural responsibility.

They shall not duplicate this entire document.

---

# 32. Final Rule

Architecture is not a collection of independent Markdown files.

It is one coherent system expressed through multiple authoritative views.

Every architectural change shall preserve that coherence.

Before changing a document, understand the architecture it represents.

Before introducing a decision, verify that the decision does not already exist.

Before approving implementation, verify that architecture, contracts, runtime behavior and validation are aligned.

---

# End of `00-Architecture/AGENTS.md`
