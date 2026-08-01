# AGENTS.md

**Project:** KnowledgeOS
**Area:** Architecture Views
**Path:** `00-Architecture/07-ArchitectureViews/`
**Document:** Architecture Views Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the operational rules for every human or AI agent working inside:

```text
00-Architecture/07-ArchitectureViews/
```

The purpose of this area is to represent the approved KnowledgeOS architecture through:

* Architecture Decision Records;
* C4 diagrams;
* UML diagrams;
* rendered architectural artifacts;
* validation tools;
* architecture traceability.

Architecture Views explain the system from multiple perspectives.

They do not create new architecture.

They represent, validate and communicate architecture already defined in:

```text
01-Foundation
02-Domain
03-Kernel
04-Platform
05-Integration
06-Execution
```

---

# 2. Scope

This guide applies to:

```text
07-ArchitectureViews/
├── ADR/
├── C4/
├── UML/
├── rendered/
├── DIAGRAM-VALIDATION-REPORT.txt
├── README.md
└── validate-diagrams.sh
```

It governs:

* ADR maintenance;
* C4 model maintenance;
* UML diagram maintenance;
* diagram rendering;
* diagram validation;
* architecture traceability;
* consistency between views;
* consistency between diagrams and documentation;
* generated artifact management.

---

# 3. Architectural Authority

Architecture Views are not the primary source of architectural semantics.

Primary authority remains in the architectural documentation.

The authority order is:

```text
Foundation

↓

Domain

↓

Kernel

↓

Platform

↓

Integration

↓

Execution

↓

Architecture Views
```

Architecture Views shall reflect the approved architecture.

They shall never silently redefine it.

If a diagram conflicts with an approved architectural document, the diagram is incorrect unless an approved ADR explicitly changes the architecture.

---

# 4. Responsibilities

Architecture Views owns:

* visual representation of architecture;
* architectural decision records;
* structural views;
* runtime views;
* interaction views;
* deployment views;
* diagram sources;
* rendered diagrams;
* validation mechanisms;
* diagram traceability.

Architecture Views does not own:

* Product Vision;
* Domain semantics;
* Engine responsibilities;
* Kernel contracts;
* Integration contracts;
* Execution semantics;
* implementation design;
* deployment implementation;
* source code structure.

---

# 5. Mandatory Reading Order

Before modifying any file in this directory, an agent shall read:

1. repository root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. this `AGENTS.md`;
4. `README.md`;
5. the architectural documents represented by the affected view;
6. the related ADRs;
7. the existing diagram source;
8. the validation report, when relevant.

An agent shall not modify a diagram based only on its visual appearance.

The source architecture shall be reviewed first.

---

# 6. Core Principles

Every Architecture View shall preserve:

* semantic accuracy;
* architectural consistency;
* traceability;
* stable terminology;
* stable identifiers;
* reproducibility;
* readability;
* technology independence where appropriate;
* separation of concerns;
* explicit relationships.

A visually attractive diagram that misrepresents the architecture is invalid.

Correctness always has priority over presentation.

---

# 7. No Architecture Redefinition

Agents working in this directory shall not introduce:

* new Engines;
* new architectural layers;
* new Domain concepts;
* new integration mechanisms;
* new execution semantics;
* new storage authority;
* new synchronization authority;
* new public contracts;
* new deployment decisions.

Such changes require updates in the authoritative architectural area and, when necessary, an ADR.

Architecture Views may expose an inconsistency.

They shall not resolve it by inventing architecture.

---

# 8. Terminology

All views shall use the official terminology defined by:

```text
00-Architecture/01-Foundation/
00-Architecture/02-Domain/
00-Architecture/08-Governance/ArchitectureVocabulary.md
```

Agents shall not introduce synonyms for established concepts.

Examples of stable terms include:

* KnowledgeOS;
* Master Library;
* Local Library;
* Personal Workspace;
* Knowledge Object;
* Universal Document Model;
* Document Presentation Model;
* Kernel;
* Platform Engine;
* Provider;
* Public Contract;
* Synchronization;
* Source of Truth;
* Offline First.

Terminology shall remain consistent across all views.

---

# 9. Naming Rules

Diagram names shall be:

* descriptive;
* stable;
* consistent;
* aligned with the architectural concept represented.

File names shall use the existing naming convention.

Agents shall not rename existing diagram files without a documented reason.

Renaming requires reviewing:

* includes;
* references;
* README links;
* rendered files;
* validation scripts;
* traceability references.

---

# 10. Diagram Identifiers

Every diagram shall have a stable identifier.

Identifiers shall not change merely because:

* layout changes;
* colors change;
* descriptions improve;
* rendering settings change.

Identifiers may change only when the architectural scope of the diagram changes substantially.

Stable identifiers are required for:

* documentation references;
* validation;
* reviews;
* traceability;
* rendered artifacts.

---

# 11. Source and Rendered Artifacts

Diagram source files are authoritative.

Rendered files are generated artifacts.

The relationship is:

```text
Diagram Source

↓

Validation

↓

Rendering

↓

Rendered Artifact
```

Agents shall never manually edit a rendered diagram to change architectural content.

All architectural changes shall be made in the source file.

The rendered artifact shall then be regenerated.

---

# 12. Rendered Directory

The `rendered/` directory contains generated visual artifacts.

It shall mirror the source organization where practical.

Current categories include:

```text
rendered/
├── C4/
└── UML/
```

Rendered files shall:

* correspond to an existing source;
* be reproducible;
* use the approved renderer;
* preserve readable resolution;
* avoid stale content.

Orphaned rendered artifacts are prohibited.

---

# 13. Validation

Every modified diagram shall be validated before completion.

Validation includes:

* syntax validation;
* include resolution;
* identifier validation;
* relation validation;
* rendering validation;
* architectural review;
* terminology review;
* source/rendered consistency.

A diagram that renders successfully may still be architecturally incorrect.

Rendering is necessary but not sufficient.

---

# 14. Validation Script

The approved validation entry point is:

```text
07-ArchitectureViews/validate-diagrams.sh
```

Agents shall use the existing validation script rather than introducing alternate validation processes without architectural approval.

Changes to the script shall preserve:

* deterministic execution;
* clear failure reporting;
* non-zero exit codes on failure;
* compatibility with repository-relative paths;
* validation of all supported diagram types.

---

# 15. Validation Report

The validation process produces or updates:

```text
DIAGRAM-VALIDATION-REPORT.txt
```

The report shall indicate:

* validation date;
* validated sources;
* successful diagrams;
* failed diagrams;
* error descriptions;
* missing dependencies;
* unresolved includes;
* rendering failures.

The report shall not be modified manually to conceal validation failures.

---

# 16. Reproducibility

A valid Architecture View shall be reproducible from repository contents.

Validation and rendering shall not depend on:

* undocumented local paths;
* user-specific directories;
* hidden environment variables;
* unavailable remote includes;
* manually installed private resources;
* implicit working directories.

Repository-relative paths are mandatory whenever possible.

---

# 17. Local Dependencies

Local diagram dependencies shall be stored and referenced consistently.

Agents shall preserve the existing local C4-PlantUML strategy.

Remote includes shall not be introduced when an approved local dependency already exists.

This protects:

* reproducibility;
* offline operation;
* version stability;
* deterministic rendering.

---

# 18. ADR Directory

The `ADR/` directory contains the approved Architecture Decision Records.

Current records include:

```text
ADR-001-Architecture-Style.md
ADR-002-Universal-Document-Model.md
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
README.md
```

Agents shall preserve numbering and historical identity.

---

# 19. ADR Authority

An ADR records an approved architectural decision.

An ADR shall define:

* context;
* problem;
* considered alternatives;
* decision;
* rationale;
* consequences;
* status;
* relationships with other decisions.

An ADR shall not duplicate entire architectural documents.

It records why a decision exists.

The architectural documents define the complete resulting model.

---

# 20. ADR Immutability

Approved ADRs are historical records.

Agents shall not rewrite an approved ADR as though the original decision had never existed.

Permitted changes include:

* typo corrections;
* clarification that does not alter meaning;
* reference updates;
* status updates;
* supersession metadata.

A material change requires:

* a new ADR; or
* an approved architecture amendment, according to Governance rules.

---

# 21. ADR Status

ADR status shall be explicit.

Typical statuses include:

* Proposed;
* Accepted;
* Approved;
* Superseded;
* Deprecated;
* Rejected.

A superseded ADR shall remain in the repository.

Its replacement shall be referenced explicitly.

---

# 22. ADR Numbering

ADR numbering shall remain sequential and stable.

Agents shall not:

* reuse numbers;
* renumber accepted ADRs;
* remove historical numbers;
* insert unnumbered decisions.

New ADR numbers shall be assigned according to Governance procedures.

---

# 23. ADR Relationships

ADRs may depend on or refine other ADRs.

Relationships shall be explicit.

Examples:

* ADR-009 depends on ADR-003 and ADR-004;
* ADR-013 refines the distinction between Master Library and Local Libraries;
* ADR-011 supports Event Bus and Execution messaging behavior.

Contradictory decisions shall not remain undocumented.

---

# 24. ADR Traceability

Every material ADR shall be traceable to:

* affected architecture documents;
* affected views;
* affected implementation areas;
* affected quality attributes;
* affected validation criteria.

Traceability shall be updated when a decision changes.

---

# 25. C4 Directory

The `C4/` directory represents KnowledgeOS using the C4 model.

Its purpose is to provide progressive architectural views from system context to lower-level structures.

C4 diagrams shall use the approved local C4-PlantUML library.

---

# 26. C4 Levels

C4 views may include:

```text
Level 1 — System Context

Level 2 — Containers

Level 3 — Components

Level 4 — Code or Implementation Detail
```

Level 4 shall be used selectively.

Architecture Views shall not force implementation detail into higher-level diagrams.

---

# 27. C4 Level 1

System Context diagrams shall show:

* KnowledgeOS;
* users or actors;
* external systems;
* high-level relationships.

They shall not show:

* internal Engines;
* database tables;
* classes;
* implementation modules;
* low-level protocols unless architecturally essential.

---

# 28. C4 Level 2

Container diagrams shall show major deployable or executable units.

They may represent:

* desktop application;
* mobile application;
* optional web application;
* server-side services;
* Master Library services;
* PostgreSQL;
* NAS storage;
* external providers.

Containers shall correspond to actual architectural responsibilities.

---

# 29. C4 Level 3

Component diagrams shall show major components inside a container.

They may include:

* Kernel;
* Platform Engines;
* Integration adapters;
* execution subsystems;
* public interfaces.

Component diagrams shall preserve layer boundaries.

---

# 30. C4 Level 4

Level 4 diagrams may represent implementation-level structures when needed.

They shall not become the primary architectural authority.

Implementation detail belongs primarily in:

```text
01-Implementation/
```

Architecture-level C4 views shall remain stable even when implementation details evolve.

---

# 31. C4 Boundaries

C4 diagrams shall represent architectural boundaries explicitly.

Relevant boundaries include:

* user boundary;
* device boundary;
* application boundary;
* Kernel boundary;
* Platform boundary;
* Integration boundary;
* provider boundary;
* Master Library boundary;
* Local Library boundary;
* external service boundary.

Boundary nesting shall reflect actual ownership.

---

# 32. C4 Relationships

Every relationship shall define:

* source;
* destination;
* purpose;
* direction;
* protocol or mechanism when relevant.

Relationship labels shall describe behavior.

Weak labels such as:

* uses;
* connects;
* communicates;

should be avoided when a more precise description is available.

---

# 33. C4 External Systems

External systems shall be modeled as external.

Examples may include:

* NAS infrastructure;
* remote AI providers;
* OCR providers;
* authentication providers;
* external export services;
* external synchronization services.

External systems shall not be visually represented as internal KnowledgeOS components.

---

# 34. C4 Technology Labels

Technology labels may be included when they represent approved decisions.

They shall not be added based on implementation assumptions.

Examples of approved technology facts may include:

* PostgreSQL for the Master Library catalog;
* containerized NAS-side deployment;
* macOS as the primary platform.

Unapproved implementation choices shall not appear as architecture facts.

---

# 35. C4 Consistency

All C4 levels shall be consistent.

A component shown at one level shall not contradict:

* its parent container;
* its architectural layer;
* its ownership;
* its external relationships;
* its deployment location.

Cross-level traceability shall be maintained.

---

# 36. C4 README

`C4/README.md` shall explain:

* C4 organization;
* directory structure;
* naming conventions;
* rendering procedure;
* validation procedure;
* level relationships;
* local includes;
* supported output formats.

Agents shall update it when the C4 operating model changes.

---

# 37. UML Directory

The `UML/` directory contains behavioral and lifecycle diagrams.

Current UML diagrams include:

```text
Background-Job-State-Machine.puml
Import-Pipeline.puml
Publication-Acquisition-Flow.puml
Runtime-Lifecycle.puml
Synchronization-Flow.puml
```

These diagrams represent dynamic behavior.

They shall remain aligned with the authoritative architecture.

---

# 38. UML Purpose

UML views may represent:

* state machines;
* activity flows;
* sequences;
* lifecycle transitions;
* execution behavior;
* synchronization behavior;
* import behavior;
* acquisition behavior.

UML shall not be used merely for decoration.

Every diagram shall answer a specific architectural question.

---

# 39. State Machine Diagrams

State machine diagrams shall define:

* valid states;
* valid transitions;
* transition triggers;
* terminal states;
* failure states;
* cancellation states;
* recovery states.

Transitions not represented in the approved lifecycle shall not be invented.

---

# 40. Activity and Flow Diagrams

Activity diagrams shall represent:

* ordered processing;
* decision points;
* parallel branches;
* synchronization points;
* failures;
* rollback or compensation where applicable;
* completion.

Flows shall preserve Execution rules.

---

# 41. Sequence Diagrams

When sequence diagrams are used, they shall show:

* participants;
* message direction;
* synchronous or asynchronous behavior;
* commands;
* queries;
* events;
* provider calls;
* failure paths;
* retries when architecturally relevant.

Sequence diagrams shall not bypass approved communication mechanisms.

---

# 42. Runtime Lifecycle View

`Runtime-Lifecycle.puml` shall remain aligned with:

```text
06-Execution/Runtime/Lifecycle.md
06-Execution/Runtime/ExecutionContext.md
06-Execution/Runtime/ExecutionModel.md
```

Any lifecycle change requires coordinated updates.

---

# 43. Background Job View

`Background-Job-State-Machine.puml` shall remain aligned with:

```text
03-Kernel/JobSystem.md
03-Kernel/Scheduler.md
06-Execution/Runtime/BackgroundJobs.md
06-Execution/Reliability/Recovery.md
```

It shall represent:

* creation;
* queueing;
* execution;
* waiting;
* completion;
* failure;
* cancellation;
* retry;
* recovery.

---

# 44. Import Pipeline View

`Import-Pipeline.puml` shall remain aligned with:

```text
04-Platform/Import/README.md
05-Integration/DataExchange/ImportProtocols.md
05-Integration/Providers/OCRProviders.md
02-Domain/UDM/Processing/
02-Domain/DPM/Processing/
```

The diagram shall preserve the distinction between:

* source acquisition;
* parsing;
* OCR;
* normalization;
* UDM construction;
* DPM construction;
* validation;
* Library registration.

---

# 45. Publication Acquisition View

`Publication-Acquisition-Flow.puml` shall represent the approved acquisition flow.

It shall remain aligned with:

```text
01-Implementation/01-MasterLibrary/
```

Architecture Views may summarize implementation flows.

They shall not become implementation authority.

---

# 46. Synchronization View

`Synchronization-Flow.puml` shall remain aligned with:

```text
ADR-003
ADR-004
ADR-009
ADR-013
04-Platform/Sync/README.md
05-Integration/Synchronization/README.md
06-Execution/
```

It shall preserve:

* Master Library authority;
* Local Library semantics;
* offline work;
* checkpoints;
* conflict handling;
* retry safety;
* idempotency;
* recovery.

---

# 47. Cross-View Consistency

All architectural views shall agree on:

* system boundaries;
* component names;
* ownership;
* data authority;
* communication mechanisms;
* lifecycle states;
* deployment responsibilities;
* integration points;
* execution guarantees.

Two diagrams shall not present incompatible versions of the same architecture.

---

# 48. Viewpoints

Architecture Views may represent different viewpoints.

Typical viewpoints include:

* structural;
* behavioral;
* execution;
* integration;
* deployment;
* information;
* security;
* operational.

Different viewpoints may omit details.

They shall not contradict each other.

---

# 49. Structural Views

Structural views represent:

* layers;
* containers;
* components;
* Engines;
* providers;
* repositories;
* boundaries;
* relationships.

They shall emphasize ownership and dependency direction.

---

# 50. Behavioral Views

Behavioral views represent:

* workflows;
* lifecycles;
* state transitions;
* commands;
* events;
* synchronization;
* recovery.

They shall emphasize ordering and runtime semantics.

---

# 51. Deployment Views

Deployment views shall reflect approved deployment decisions.

KnowledgeOS currently includes architectural deployment concerns such as:

* macOS primary application;
* iPhone and iPad clients;
* optional web application;
* NAS-hosted Master Library;
* containerized NAS-side services;
* PostgreSQL in a separate container;
* independent persistent volumes;
* local device caches;
* local and remote AI providers.

Deployment views shall not imply that all capabilities require network connectivity.

---

# 52. Information Views

Information views shall represent:

* Knowledge Objects;
* UDM;
* DPM;
* assets;
* metadata;
* provenance;
* relationships;
* versions;
* Master Library authority;
* Local Library copies;
* derived indexes;
* caches.

They shall preserve the distinction between authoritative and derived state.

---

# 53. Security Views

Security views shall represent:

* trust boundaries;
* authentication;
* authorization;
* provider access;
* plugin isolation;
* secret handling;
* user knowledge boundaries;
* network boundaries.

Security views shall not expose real credentials or secrets.

---

# 54. Offline-First Representation

All relevant views shall preserve Offline First.

They shall not represent remote availability as a prerequisite for:

* reading synchronized knowledge;
* editing local knowledge;
* annotations;
* search over available local indexes;
* local AI;
* workspace use.

Synchronization is a reconciliation mechanism.

It is not the owner of local interaction.

---

# 55. Master Library Representation

The Master Library shall always be represented as the authoritative Source of Truth.

Local Libraries shall be represented as synchronized working libraries.

The diagrams shall not imply that:

* the local cache is authoritative;
* the desktop application owns the Master Library;
* PostgreSQL alone is the complete Master Library;
* NAS files alone represent all Library semantics.

The Master Library includes coordinated authoritative metadata and authoritative files.

---

# 56. PostgreSQL Representation

PostgreSQL shall be represented according to the approved storage architecture.

It is:

* part of the Master Library persistence architecture;
* deployed in a separate container;
* backed by an independent persistent volume.

PostgreSQL shall not be represented as the owner of Domain semantics.

---

# 57. NAS Representation

The NAS is the authoritative infrastructure location for the Master Library.

Views shall distinguish:

* NAS infrastructure;
* application services;
* PostgreSQL;
* authoritative files;
* persistent volumes.

The NAS shall not be reduced to a generic external filesystem when the view concerns Master Library deployment.

---

# 58. Engine Representation

Platform Engines shall be represented as capability owners.

Current Engines include:

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

An Engine shall not be represented as:

* a database table;
* a UI screen;
* a provider;
* a transport;
* a storage mechanism.

---

# 59. Kernel Representation

The Kernel shall be represented as the execution and coordination foundation.

Relevant Kernel capabilities include:

* Command Bus;
* Query Bus;
* Event Bus;
* Workflow Engine;
* Job System;
* Scheduler;
* Dependency Injection;
* Configuration;
* Logging;
* Observability.

The Kernel shall not own business semantics.

---

# 60. Integration Representation

Integration shall be represented as the boundary between internal architecture and external mechanisms.

Relevant areas include:

* Data Exchange;
* External Services;
* Plugin SDK;
* Providers;
* Public API;
* Storage;
* Synchronization.

Integration components shall not be presented as Domain authorities.

---

# 61. Execution Representation

Execution views shall preserve:

* concurrency rules;
* deterministic behavior;
* idempotency;
* transactions;
* event ordering;
* retry policies;
* recovery;
* checkpointing;
* scheduling;
* resource management;
* performance constraints.

Execution guarantees shall not be omitted from diagrams where they materially affect behavior.

---

# 62. Traceability

Every Architecture View shall be traceable to one or more authoritative sources.

Traceability may include references to:

* Foundation documents;
* Domain documents;
* Kernel documents;
* Platform documents;
* Integration documents;
* Execution documents;
* ADRs;
* implementation documents.

Traceability shall be explicit enough to support review.

---

# 63. Diagram Documentation

Each diagram source should include, where supported:

* project name;
* diagram identifier;
* title;
* version;
* status;
* owner;
* purpose;
* related documents;
* related ADRs.

Metadata shall remain consistent with repository standards.

---

# 64. Diagram Versioning

Diagram versions shall change when architectural meaning changes.

Pure rendering changes do not necessarily require architectural version changes.

Version changes shall follow Governance rules.

---

# 65. Diagram Status

Diagram status shall be explicit when relevant.

Possible statuses include:

* Draft;
* Proposed;
* Approved;
* Deprecated;
* Superseded.

An approved diagram shall not represent unapproved architecture.

---

# 66. Diagram Readability

A diagram shall remain readable at its intended viewing size.

Agents shall avoid:

* excessive elements;
* overlapping labels;
* ambiguous arrows;
* unreadable font sizes;
* unnecessary decorative elements;
* excessive colors;
* inconsistent spacing.

Large architecture shall be divided into multiple coherent views rather than compressed into one unreadable diagram.

---

# 67. Layout Stability

Layout may change to improve readability.

However, agents should preserve stable visual organization where practical.

Frequent arbitrary layout changes make review difficult.

Structural meaning shall remain more stable than rendering aesthetics.

---

# 68. Color Usage

Colors shall communicate meaning consistently.

Color shall not be the only way to convey meaning.

Views shall remain understandable:

* in grayscale;
* when printed;
* for users with color-vision differences.

The same architectural category should use the same visual convention across related diagrams.

---

# 69. Relationship Direction

Arrow direction shall represent actual dependency or communication direction.

Bidirectional relationships shall be used only when both directions are architecturally meaningful.

Agents shall not use bidirectional arrows merely to simplify layout.

---

# 70. Abstraction Level

Each diagram shall maintain one primary abstraction level.

A diagram shall not mix:

* system context;
* containers;
* implementation classes;
* database columns;
* runtime thread details;

unless the purpose explicitly requires such combination.

Mixed abstraction without justification is prohibited.

---

# 71. Implementation References

Architecture Views may reference implementation areas.

They shall not duplicate implementation documentation.

Detailed technical design belongs under:

```text
01-Implementation/
```

Architecture Views shall remain sufficiently stable across implementation evolution.

---

# 72. Generated Files

Generated files shall not be treated as manually authored sources.

Agents shall:

* regenerate them after source changes;
* validate them;
* avoid independent manual changes;
* remove stale generated files;
* preserve expected output formats.

---

# 73. Failure Handling

When a diagram fails validation, the agent shall identify whether the cause is:

* syntax;
* include path;
* missing dependency;
* invalid identifier;
* unsupported PlantUML feature;
* Graphviz error;
* rendering limit;
* architectural inconsistency.

The agent shall correct the source cause.

Workarounds that hide failures are prohibited.

---

# 74. Include Paths

PlantUML includes shall use approved repository-relative paths.

Agents shall not add machine-specific absolute paths.

The working directory assumptions shall be documented and consistent with validation scripts.

---

# 75. PlantUML Rules

PlantUML source shall:

* compile with the approved PlantUML version;
* resolve local includes;
* preserve stable aliases;
* avoid duplicate identifiers;
* use supported syntax;
* define clear titles;
* produce deterministic output where possible.

Warnings shall be reviewed rather than ignored automatically.

---

# 76. C4-PlantUML Rules

C4-PlantUML diagrams shall:

* use approved local includes;
* use correct element types;
* preserve alias uniqueness;
* define meaningful descriptions;
* use `Rel` direction consistently;
* preserve system and container boundaries;
* avoid unsupported nesting.

Agents shall not mix incompatible C4 library versions.

---

# 77. Graphviz Rules

Graphviz is a rendering dependency.

Diagram design shall not depend on a machine-specific Graphviz path.

Validation shall detect Graphviz availability.

Graphviz failures shall be reported explicitly.

---

# 78. Review Process

Every material Architecture View change shall be reviewed for:

* semantic correctness;
* consistency with architecture;
* consistency with ADRs;
* cross-view consistency;
* naming;
* traceability;
* readability;
* validation;
* generated output.

A visual-only review is insufficient.

---

# 79. Change Classification

Changes shall be classified as:

## Editorial

Examples:

* spelling;
* label clarity;
* metadata formatting;
* non-semantic layout.

## Representational

Examples:

* adding an existing component to a diagram;
* improving traceability;
* splitting a complex diagram.

## Architectural

Examples:

* adding a new component;
* changing ownership;
* changing deployment;
* changing communication;
* changing authority.

Architectural changes require updates outside this directory.

---

# 80. Minimum Change Rule

Agents shall make the smallest complete change required.

They shall not:

* redesign unrelated diagrams;
* rename stable elements without need;
* reformat every diagram during a focused fix;
* regenerate unrelated artifacts unnecessarily;
* introduce new notation without documentation.

---

# 81. Prohibited Actions

Agents working in this directory shall not:

* invent missing architecture;
* bypass approved ADRs;
* edit rendered files as sources;
* use absolute local paths;
* add remote dependencies without approval;
* hide validation errors;
* delete historical ADRs;
* renumber ADRs;
* mix architectural and implementation authority;
* publish unvalidated diagrams;
* create diagrams without a defined purpose.

---

# 82. Security

Architecture Views shall not include:

* credentials;
* API keys;
* access tokens;
* private URLs;
* real personal data;
* secret infrastructure identifiers;
* confidential provider configuration.

Security-sensitive diagrams may describe trust boundaries without exposing secrets.

---

# 83. Privacy

Views shall preserve the privacy principles of KnowledgeOS.

They shall not expose sample user knowledge unless it is synthetic and explicitly safe.

Diagrams involving AI, synchronization or providers shall represent privacy boundaries where relevant.

---

# 84. Testing

Architecture View validation shall include:

* syntax tests;
* rendering tests;
* include-resolution tests;
* expected-file tests;
* orphan-render detection;
* broken-reference detection;
* architectural consistency review.

Automated validation does not replace architectural review.

---

# 85. Completion Criteria

A change in `07-ArchitectureViews` is complete only when:

* the source is updated;
* architecture documents were reviewed;
* related ADRs were reviewed;
* terminology is correct;
* identifiers are stable;
* validation succeeds;
* rendered output is regenerated;
* no stale artifact remains;
* references are updated;
* cross-view consistency is preserved;
* no architecture was silently redefined.

---

# 86. Review Checklist

Before approving work, verify:

* [ ] The view has a clear purpose.
* [ ] The abstraction level is consistent.
* [ ] The architecture source was reviewed.
* [ ] Related ADRs were reviewed.
* [ ] Names match the official vocabulary.
* [ ] Ownership is represented correctly.
* [ ] Master Library authority is preserved.
* [ ] Offline First is preserved.
* [ ] Layer boundaries are preserved.
* [ ] External systems are represented correctly.
* [ ] Relationships are directional and meaningful.
* [ ] Diagram identifiers are unique.
* [ ] Include paths are repository-relative.
* [ ] Source validation succeeds.
* [ ] Rendering succeeds.
* [ ] Rendered output matches the source.
* [ ] No orphaned artifact remains.
* [ ] Traceability is complete.
* [ ] Security and privacy are preserved.
* [ ] No unapproved architecture was introduced.

---

# 87. Agent Reporting

After modifying Architecture Views, the agent shall report:

* objective;
* files modified;
* diagrams modified;
* architectural areas reviewed;
* ADRs reviewed;
* identifiers affected;
* relationships affected;
* validation command executed;
* validation result;
* rendered artifacts generated;
* traceability updates;
* detected inconsistencies;
* unresolved risks.

The report shall distinguish:

* architectural changes;
* representational changes;
* editorial changes.

---

# 88. Escalation Rules

An agent shall stop and escalate when:

* two authoritative documents contradict each other;
* an ADR conflicts with the frozen architecture;
* a required diagram implies an unapproved decision;
* ownership cannot be determined;
* deployment authority is ambiguous;
* synchronization behavior is inconsistent;
* Master Library authority is unclear;
* validation requires modifying architecture rather than representation.

The agent shall not resolve these conflicts by assumption.

---

# 89. Relationship with Governance

Architecture Views are governed by:

```text
00-Architecture/08-Governance/
```

Governance defines:

* amendment procedures;
* freeze rules;
* review requirements;
* decision management;
* vocabulary;
* documentation standards;
* migration procedures.

Architecture Views shall comply with those rules.

---

# 90. Relationship with Implementation

Architecture Views guide implementation.

Implementation may refine technical detail but shall not contradict approved views.

When implementation discovers an architectural inconsistency:

1. implementation shall not silently diverge;
2. the issue shall be documented;
3. Governance shall evaluate the change;
4. architecture documents shall be updated if approved;
5. Architecture Views shall then be updated.

---

# 91. Final Rule

Architecture Views are the visual and decision-based representation of KnowledgeOS architecture.

They shall make the architecture easier to:

* understand;
* review;
* validate;
* communicate;
* implement;
* evolve.

They shall never become an alternate architecture.

Every diagram shall represent approved semantics.

Every ADR shall preserve architectural history.

Every rendered artifact shall originate from a validated source.

Every view shall remain traceable to authoritative documentation.

When a view and the architecture disagree, the disagreement shall be resolved explicitly through Governance.

Architecture Views exist to reveal architecture, not to invent it.

---

# End of `00-Architecture/07-ArchitectureViews/AGENTS.md`
