
# AGENTS.md

**Project:** KnowledgeOS
**Document:** Repository Agent Guide
**Version:** 1.0
**Status:** Approved
**Scope:** Entire repository
**Owner:** KnowledgeOS Team

---

# 1. Purpose

This document is the mandatory entry point for every human or AI agent working in the KnowledgeOS repository.

Its purpose is to explain:

* how the repository is organized;
* where authoritative information lives;
* which documents must be read before making changes;
* how architectural and implementation decisions are governed;
* how local `AGENTS.md` files refine repository-wide rules;
* how work must be analyzed, executed and validated.

This document does not replace the architecture documentation.

It provides the operational rules required to navigate and modify the repository safely.

---

# 2. Scope

These instructions apply to:

* AI coding agents;
* AI documentation agents;
* AI review agents;
* human contributors;
* maintainers;
* external collaborators;
* automated repository tooling.

They apply to every repository area, including:

* architecture;
* governance;
* domain;
* kernel;
* platform;
* integration;
* execution;
* architecture views;
* implementation;
* testing;
* operations;
* generated artifacts.

---

# 3. Repository Authority

The repository is the authoritative memory of KnowledgeOS.

Architecture, implementation decisions, contracts, diagrams and operational procedures shall be preserved in version-controlled repository artifacts.

Conversation history, AI memory, external notes and temporary workspaces are not authoritative.

When information conflicts, the following precedence applies:

1. approved architectural decisions;
2. approved governance documents;
3. frozen foundation documents;
4. normative architecture documentation;
5. public contracts;
6. implementation documentation;
7. implementation code;
8. tests;
9. comments;
10. conversational context.

Code shall not silently override approved architecture.

When code and architecture disagree, the inconsistency shall be reported and resolved explicitly.

---

# 4. Repository Structure

KnowledgeOS is organized into two primary areas:

```text
00-Architecture/
01-Implementation/
```

`00-Architecture/` defines the product architecture, domain, kernel, platform, integrations, execution model, architectural views and governance.

`01-Implementation/` defines how approved architecture is converted into executable systems, applications, modules, services, clients, persistence models, tests and operational procedures.

The architecture defines what the system is and the rules it must preserve.

The implementation defines how those rules are realized.

Implementation shall conform to architecture.

---

# 5. Mandatory Reading Order

Before modifying the repository, every agent shall read the minimum required context.

## 5.1 Repository-level reading

The mandatory initial order is:

1. `AGENTS.md`
2. root `README.md`, when present
3. the nearest local `AGENTS.md`
4. the nearest module `README.md`

## 5.2 Architecture reading

Before making architectural or cross-module changes, read:

1. `00-Architecture/01-Foundation/ProductVision.md`
2. `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
3. `00-Architecture/01-Foundation/ArchitectureConstraints.md`
4. `00-Architecture/01-Foundation/ArchitectureModel.md`
5. `00-Architecture/01-Foundation/QualityAttributes.md`
6. `00-Architecture/08-Governance/ArchitectureFreeze-v4.0.md`
7. relevant ADRs under `00-Architecture/07-ArchitectureViews/ADR/`
8. relevant architecture module documentation
9. relevant diagrams

## 5.3 Implementation reading

Before modifying implementation documentation or code, read:

1. `01-Implementation/00-Governance/README.md`
2. `01-Implementation/00-Governance/ImplementationStrategy.md`
3. `01-Implementation/00-Governance/DefinitionOfDone.md`
4. `01-Implementation/00-Governance/ModuleDevelopmentLifecycle.md`
5. the implementation module `README.md`
6. the module `AGENTS.md`
7. the module charter, when present
8. requirements
9. technical design
10. domain model
11. contracts
12. persistence documentation
13. testing strategy
14. operational requirements

The complete repository shall not be loaded unnecessarily.

Agents shall retrieve only the context required for the current task.

---

# 6. Local AGENTS.md Hierarchy

KnowledgeOS uses distributed agent instructions.

A local `AGENTS.md` applies to the directory in which it is located and all descendant directories, unless a deeper `AGENTS.md` overrides or refines it.

Instruction precedence is:

1. root `AGENTS.md`;
2. parent directory `AGENTS.md`;
3. nearest local `AGENTS.md`;
4. task-specific approved documentation.

Local files may strengthen repository rules.

Local files shall not weaken architectural invariants, approved ADRs, governance rules or repository-wide prohibitions.

When two instructions conflict, the stricter rule applies unless an approved architectural decision explicitly resolves the conflict.

---

# 7. Core Architectural Invariants

Every change shall preserve the following invariants.

## 7.1 User ownership

Knowledge belongs to the user.

The platform shall not create avoidable dependencies that prevent access, migration, export or long-term preservation.

## 7.2 NAS as authoritative source

The Master Library hosted on the NAS is the authoritative source of truth for shared knowledge.

Local libraries, caches and application state shall not silently replace the Master Library as the authoritative repository.

## 7.3 Offline-first operation

Core user workflows shall remain available without continuous network connectivity.

Network access enhances the system but shall not be a mandatory prerequisite for ordinary local work.

## 7.4 Open and portable knowledge

Knowledge shall remain exportable and representable through documented, portable formats whenever practical.

## 7.5 Stable identity

Knowledge objects, documents, assets, nodes, annotations and relationships shall preserve stable identities across storage, synchronization, processing and presentation.

## 7.6 Domain independence

The Domain shall remain independent from:

* UI frameworks;
* persistence frameworks;
* operating systems;
* network protocols;
* external providers;
* vendor-specific services;
* implementation technologies.

## 7.7 Kernel neutrality

The Kernel provides execution mechanisms.

It shall not contain product-specific business logic.

## 7.8 Engine isolation

Platform Engines shall preserve explicit responsibilities and controlled boundaries.

An Engine shall not access another Engine's internal state.

Cross-Engine interaction shall use approved contracts, commands, queries or events.

## 7.9 Public contracts

Interactions across architectural boundaries shall use explicit and versioned contracts.

Internal implementation details shall not become accidental public APIs.

## 7.10 AI independence

KnowledgeOS shall not depend on one AI provider, model or execution environment.

AI integrations shall remain replaceable through provider abstractions and public contracts.

## 7.11 Deterministic behavior

Operations that are expected to be deterministic shall produce reproducible results when given equivalent inputs, configuration and execution conditions.

## 7.12 Idempotency

Operations that may be repeated because of retries, synchronization, recovery or distributed execution shall define idempotent behavior where required.

## 7.13 Traceability

Important decisions and changes shall remain traceable to:

* requirements;
* architectural documents;
* ADRs;
* contracts;
* tests;
* implementation artifacts.

## 7.14 Documentation authority

Approved documentation is part of the system.

Outdated, contradictory or missing documentation is an engineering defect.

---

# 8. Prohibited Actions

Agents shall not:

* modify the frozen architecture without an approved amendment process;
* silently reinterpret Product Vision;
* overwrite approved ADRs;
* introduce undocumented architectural concepts;
* duplicate an existing concept under a different name;
* place business logic in the Kernel;
* introduce implementation technology into the Domain;
* bypass UDM or DPM where they are architecturally required;
* bypass public contracts between modules;
* create direct Engine-to-Engine internal dependencies;
* make local storage authoritative when the Master Library must remain authoritative;
* create vendor lock-in without an approved decision;
* introduce hidden network requirements into offline-first workflows;
* remove traceability between architecture, implementation and testing;
* generate code before required design and contracts exist;
* mark work complete when documentation, validation or tests remain inconsistent;
* edit generated diagram output as if it were the source;
* invent files, modules, decisions or requirements to fill perceived gaps.

When required information is missing, the agent shall identify the gap explicitly.

---

# 9. Mandatory Work Process

Every task shall follow this process.

## 9.1 Understand

Determine:

* the requested outcome;
* the affected repository area;
* the authoritative documents;
* the relevant local instructions;
* the expected deliverables.

## 9.2 Recover context

Read the minimum documents required to understand the task.

Do not rely solely on previous conversations or model memory.

## 9.3 Analyze impact

Identify potential impact on:

* Product Vision;
* architecture principles;
* architecture constraints;
* quality attributes;
* ADRs;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* public contracts;
* persistence;
* synchronization;
* security;
* testing;
* operations;
* diagrams;
* documentation.

## 9.4 Plan

Define:

* files to create;
* files to modify;
* files to review;
* dependencies;
* validation steps;
* acceptance criteria.

The plan shall remain proportional to the task.

## 9.5 Validate before modification

Before changing a concept, verify that:

* it does not already exist;
* its authoritative owner is known;
* its name follows repository vocabulary;
* its architectural layer is correct;
* its dependencies follow allowed directions;
* no ADR prohibits the change.

## 9.6 Execute

Make the smallest coherent change that fully satisfies the task.

Do not mix unrelated refactoring with the requested work.

## 9.7 Review

Review the result for:

* correctness;
* architectural compliance;
* terminology consistency;
* completeness;
* internal contradictions;
* accidental duplication;
* broken references;
* missing tests;
* missing documentation;
* obsolete diagrams.

## 9.8 Verify

Run all applicable validation mechanisms.

Examples include:

* test suites;
* linters;
* formatters;
* static analysis;
* schema validation;
* contract tests;
* diagram compilation;
* documentation checks;
* architecture compliance checks.

## 9.9 Report

The final report shall state:

* what changed;
* which files changed;
* why the change was made;
* what was validated;
* unresolved limitations or risks.

---

# 10. Architecture Change Rules

A change is architectural when it modifies or introduces:

* system boundaries;
* architectural layers;
* Domain semantics;
* Kernel responsibilities;
* Engine responsibilities;
* public contracts;
* persistence authority;
* synchronization strategy;
* identity semantics;
* event semantics;
* execution guarantees;
* deployment topology;
* security boundaries;
* provider abstractions;
* plugin capabilities;
* compatibility guarantees.

Architectural changes require:

1. impact analysis;
2. review of existing ADRs;
3. identification of affected documents;
4. an amendment or new ADR when required;
5. updates to affected diagrams;
6. architecture validation;
7. explicit approval.

Implementation shall not precede approval when the change affects frozen architecture.

---

# 11. ADR Rules

Approved ADRs are immutable historical records.

They shall not be rewritten to conceal architectural evolution.

When a decision changes:

* create a new ADR;
* mark the previous ADR as superseded when applicable;
* preserve the original decision;
* document the rationale for the new decision;
* update references and diagrams.

Minor corrections that do not alter meaning may be handled according to governance rules.

Every proposed architectural decision shall include:

* context;
* decision;
* alternatives considered;
* consequences;
* trade-offs;
* affected components;
* migration implications;
* compatibility implications;
* validation criteria.

---

# 12. Documentation Rules

Documentation shall be:

* precise;
* explicit;
* internally consistent;
* version controlled;
* traceable;
* readable without conversational context.

Each document shall have one primary responsibility.

Documents shall not duplicate normative definitions owned elsewhere.

When referring to an existing concept, use a reference rather than redefining it.

Normative terms shall be used consistently:

* `SHALL` indicates a mandatory requirement;
* `SHALL NOT` indicates a prohibition;
* `SHOULD` indicates a strong recommendation;
* `SHOULD NOT` indicates a discouraged practice;
* `MAY` indicates an allowed option.

Documentation changes shall preserve established terminology.

Repository vocabulary is authoritative.

---

# 13. Diagram Rules

Diagram source files are authoritative.

Rendered files are derived artifacts.

C4 diagrams shall be used for architecture structure and system decomposition.

UML diagrams shall be used for behavior, interaction, state, lifecycle and detailed structural modeling.

Every diagram shall:

* represent one clear purpose;
* preserve one appropriate abstraction level;
* use repository terminology;
* remain synchronized with documentation;
* compile successfully;
* avoid undocumented architecture.

When architecture changes, affected diagrams shall be reviewed.

Diagram validation shall use the repository validation tooling.

---

# 14. Dependency Direction

The expected conceptual dependency direction is:

```text
Foundation
    ↓
Domain
    ↓
Kernel abstractions and execution mechanisms
    ↓
Platform Engines
    ↓
Integration contracts and adapters
    ↓
Implementation
    ↓
Infrastructure and external systems
```

This representation does not authorize arbitrary downward or upward dependencies.

Each module's documentation defines its specific permitted dependencies.

General rules:

* Domain shall not depend on implementation;
* Domain shall not depend on infrastructure;
* Kernel shall not depend on Platform;
* Platform shall not expose internal state across Engine boundaries;
* Integration shall adapt external systems to approved internal contracts;
* implementation shall conform to architecture;
* infrastructure shall remain replaceable where required by architecture.

Dependency cycles across architectural boundaries are prohibited unless explicitly approved.

---

# 15. Domain Rules

The Domain defines the meaning of KnowledgeOS.

Domain work shall preserve:

* UDM;
* DPM;
* Knowledge Objects;
* Identity;
* Knowledge Graph;
* lifecycle semantics;
* provenance;
* relationships;
* validation rules.

Domain documentation shall not include:

* database-specific schemas;
* UI framework concepts;
* network implementation;
* provider APIs;
* platform-specific code;
* deployment details.

Changes to identity, serialization, graph semantics, node types or lifecycle rules require cross-model review.

---

# 16. Kernel Rules

The Kernel provides shared execution mechanisms.

Its responsibilities include mechanisms such as:

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

The Kernel shall not:

* define user-facing product features;
* contain Engine-specific business logic;
* depend on Platform implementations;
* depend on external service providers;
* encode UI behavior.

Kernel APIs shall remain generic, stable and testable.

---

# 17. Platform Rules

Platform Engines implement product capabilities over the Domain and Kernel.

Each Engine shall have:

* explicit responsibilities;
* explicit boundaries;
* documented inputs and outputs;
* public contracts;
* lifecycle rules;
* failure behavior;
* observability requirements;
* test requirements.

Engines shall not share internal mutable state.

Communication shall occur through approved mechanisms.

A new Engine requires architectural justification and review.

---

# 18. Integration Rules

Integration connects KnowledgeOS to:

* external services;
* providers;
* public APIs;
* plugins;
* storage systems;
* synchronization systems;
* import and export protocols.

Integration code and documentation shall:

* preserve internal architectural boundaries;
* validate external input;
* translate external formats into canonical internal contracts;
* prevent provider-specific semantics from leaking into the Domain;
* define versioning and compatibility;
* define failure and retry behavior;
* preserve security and privacy requirements.

---

# 19. Execution Rules

Execution documentation defines runtime guarantees.

Changes affecting execution shall review:

* concurrency;
* ordering;
* transactions;
* locking;
* retries;
* idempotency;
* determinism;
* caching;
* resource management;
* background jobs;
* lifecycle;
* scheduling;
* recovery;
* observability.

Concurrency assumptions shall never remain implicit.

Failure behavior shall be documented.

Retry behavior shall not create duplicate side effects.

---

# 20. Implementation Rules

Implementation shall begin only when the required context exists.

Depending on the module, this may include:

* scope;
* requirements;
* use cases;
* acceptance criteria;
* technical design;
* domain model;
* contracts;
* persistence design;
* security requirements;
* testing strategy;
* operational design.

Implementation code shall not become the place where missing architecture is invented.

When implementation exposes an architectural gap, work shall return to the appropriate architecture or design document.

---

# 21. Contract Rules

Contracts define boundaries.

Contracts shall be:

* explicit;
* versioned;
* validated;
* testable;
* backward-compatible where required;
* independent from internal implementation details.

Breaking changes require:

* impact analysis;
* versioning decision;
* migration strategy;
* compatibility documentation;
* contract tests;
* consumer review.

Shared contract types shall have one authoritative definition.

---

# 22. Persistence Rules

Persistence shall preserve:

* identity;
* integrity;
* provenance;
* checksums;
* consistency;
* recoverability;
* authoritative ownership;
* migration safety.

Persistence models shall not redefine Domain semantics.

Database schemas, file layouts and storage implementations are implementation artifacts.

They shall map to approved Domain and architecture concepts.

Destructive migrations require explicit review, backups and recovery planning.

---

# 23. Synchronization Rules

Synchronization shall preserve:

* authoritative ownership;
* stable identity;
* conflict semantics;
* ordering guarantees;
* idempotency;
* retry safety;
* partial failure recovery;
* offline operation;
* data integrity.

Synchronization shall not silently discard user knowledge.

Conflicts shall be detectable and governed by documented resolution rules.

---

# 24. Testing Rules

Tests are required engineering artifacts.

The applicable test strategy may include:

* unit tests;
* integration tests;
* contract tests;
* end-to-end tests;
* synchronization tests;
* recovery tests;
* migration tests;
* performance tests;
* security tests;
* architecture compliance tests.

Tests shall verify requirements and contracts, not accidental implementation details.

A change is incomplete when required tests are missing or failing.

Generated test data shall not expose sensitive information.

---

# 25. Security Rules

Security shall be considered in every relevant change.

Review areas include:

* authentication;
* authorization;
* secret management;
* input validation;
* data exposure;
* local storage;
* network transport;
* external integrations;
* plugin permissions;
* auditability;
* backup protection;
* recovery access.

Secrets shall never be committed to the repository.

External input shall be treated as untrusted.

Security boundaries shall remain explicit.

---

# 26. Privacy Rules

KnowledgeOS manages personal knowledge.

Agents shall preserve privacy by design.

AI, OCR, indexing, telemetry, synchronization and external services shall not receive user data unless permitted by architecture, configuration and user consent.

Local processing shall be preferred when privacy requirements demand it.

Sensitive data shall not be included in logs, fixtures or examples.

---

# 27. Observability Rules

Observable systems shall provide enough information to understand behavior without exposing sensitive content.

Relevant modules shall define:

* logs;
* metrics;
* traces;
* health checks;
* correlation identifiers;
* error classification;
* alerting signals.

Observability shall support diagnosis, recovery and capacity planning.

Logging shall not replace error handling.

---

# 28. Generated Artifacts

Generated artifacts include:

* rendered diagrams;
* generated documentation;
* generated schemas;
* generated code;
* compiled assets;
* reports;
* temporary validation output.

Source artifacts remain authoritative.

Generated artifacts shall be reproducible.

Agents shall not manually edit generated output unless the repository explicitly identifies it as an editable source.

Temporary files shall not be committed.

---

# 29. Repository Hygiene

Agents shall preserve repository cleanliness.

Do not commit:

* editor state;
* operating-system metadata;
* temporary files;
* untracked generated output;
* credentials;
* local caches;
* build artifacts unless explicitly required;
* duplicate documentation;
* obsolete experimental files.

Renames and moves shall preserve references and history where practical.

Deprecated content shall be clearly marked or removed according to governance rules.

---

# 30. Change Scope

Every change shall have a coherent scope.

Agents shall avoid:

* unrelated formatting changes;
* opportunistic rewrites;
* broad renaming without necessity;
* hidden architectural changes;
* speculative abstractions;
* premature optimization;
* new dependencies without justification.

The preferred change is the smallest complete change that preserves long-term consistency.

---

# 31. Completion Criteria

A task is complete only when:

* the requested outcome is satisfied;
* architecture remains consistent;
* local instructions were followed;
* terminology is correct;
* documentation is updated;
* diagrams are updated when required;
* contracts are updated when required;
* tests are added or updated;
* validations pass;
* no known contradiction remains;
* limitations are documented;
* affected files are identified;
* traceability is preserved.

Partial implementation shall not be presented as complete.

---

# 32. Agent Communication

Agents shall communicate clearly and factually.

They shall:

* distinguish verified facts from assumptions;
* report missing context;
* identify architectural impact;
* explain unresolved risks;
* avoid claiming validation that was not performed;
* avoid inventing repository state;
* avoid presenting speculative decisions as approved.

When unable to complete a task, the agent shall state exactly what was completed and what remains unresolved.

---

# 33. Local Instruction Files

The repository shall progressively introduce local `AGENTS.md` files in high-responsibility areas.

Recommended locations include:

```text
00-Architecture/AGENTS.md

00-Architecture/02-Domain/AGENTS.md

00-Architecture/03-Kernel/AGENTS.md

00-Architecture/04-Platform/AGENTS.md

00-Architecture/05-Integration/AGENTS.md

00-Architecture/06-Execution/AGENTS.md

00-Architecture/07-ArchitectureViews/AGENTS.md

00-Architecture/08-Governance/AGENTS.md

01-Implementation/AGENTS.md

01-Implementation/01-MasterLibrary/AGENTS.md

01-Implementation/02-DesktopApplication/AGENTS.md
```

Additional local files shall be added only when they provide meaningful module-specific guidance.

They shall not be created mechanically in every directory.

---

# 34. Initial Navigation by Task Type

## Architecture task

Read:

```text
AGENTS.md
00-Architecture/AGENTS.md
01-Foundation/
08-Governance/
relevant ADRs
relevant architecture module
relevant diagrams
```

## Domain task

Read:

```text
AGENTS.md
00-Architecture/02-Domain/AGENTS.md
00-Architecture/02-Domain/README.md
relevant Domain model
related ADRs
related serialization and validation rules
```

## Kernel task

Read:

```text
AGENTS.md
00-Architecture/03-Kernel/AGENTS.md
KernelArchitecture.md
relevant Kernel mechanism
related execution documentation
related ADRs
```

## Platform Engine task

Read:

```text
AGENTS.md
00-Architecture/04-Platform/AGENTS.md
00-Architecture/04-Platform/README.md
target Engine README.md
related Domain models
related Kernel mechanisms
related contracts
related ADRs
```

## Integration task

Read:

```text
AGENTS.md
00-Architecture/05-Integration/AGENTS.md
00-Architecture/05-Integration/README.md
target integration documents
related public contracts
related providers
related security requirements
```

## Master Library implementation task

Read:

```text
AGENTS.md
01-Implementation/AGENTS.md
01-Implementation/01-MasterLibrary/AGENTS.md
ImplementationCharter.md
README.md
relevant requirements
technical design
domain model
contracts
persistence
tests
operations
```

## Desktop application task

Read:

```text
AGENTS.md
01-Implementation/AGENTS.md
01-Implementation/02-DesktopApplication/AGENTS.md
README.md
requirements
application architecture
workspace architecture
desktop UI architecture
related Platform Engines
related contracts
```

---

# 35. Final Rule

Before changing KnowledgeOS, understand the system.

Before introducing a concept, verify that it does not already exist.

Before implementing behavior, confirm that its architecture and contracts are defined.

Before declaring completion, validate the entire affected path.

KnowledgeOS shall evolve through explicit, traceable and coherent engineering decisions.

---

# End of AGENTS.md
