
# Architecture Principles

**Project:** KnowledgeOS

**Section:** Foundation

**Document:** Architecture Principles

**Version:** 3.2

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the fundamental architectural principles governing the design, implementation and evolution of KnowledgeOS.

These principles establish the criteria used to:

* evaluate architectural decisions;
* define subsystem boundaries;
* resolve design conflicts;
* review implementation proposals;
* preserve architectural consistency over time.

Every architectural artifact and software component shall comply with these principles.

A principle may be amended or superseded only through an approved Architecture Decision Record.

---

# 2. Scope

These principles apply to every KnowledgeOS architectural layer:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* Architecture Views;
* Implementation.

They also apply to:

* Architecture Decision Records;
* technical specifications;
* domain models;
* public contracts;
* providers;
* plugins;
* application clients;
* server components;
* future architectural extensions.

No architectural component is exempt from these principles.

---

# 3. Principle 1 — User Ownership

Knowledge belongs to the user.

KnowledgeOS manages user knowledge but never assumes ownership of it.

The platform shall not introduce technical, contractual or architectural dependencies that prevent users from accessing, exporting, preserving or migrating their information.

## Implications

* User-owned information shall remain accessible.
* Export capabilities are mandatory.
* Vendor lock-in is prohibited.
* Personal knowledge shall remain under user control.
* User data shall not depend permanently on a specific provider.
* Personal state shall not be transferred outside its approved storage and synchronization boundaries.

---

# 4. Principle 2 — Offline First

Offline operation is the default execution model for KnowledgeOS clients.

Network connectivity extends platform capabilities but shall not be required for core reading, organization, annotation, search or knowledge-management workflows involving locally available content.

## Implications

* Local persistence is mandatory.
* Local Libraries remain operational without the NAS.
* Local search and indexing remain available offline.
* Local rendering remains available offline.
* Personal changes are recorded locally before synchronization.
* Network-dependent operations shall degrade predictably.
* Interrupted operations shall be resumable or safely repeatable.
* Local AI shall be supported where technically viable.

Offline First does not require every publication to exist on every device.

It requires each device to remain fully functional with the publications and personal state currently available in its Local Library.

---

# 5. Principle 3 — Scoped Authority

Authority in KnowledgeOS is scoped rather than global.

Each category of information shall have exactly one clearly identified authority.

Examples include:

* the NAS Master Library is authoritative for the Master Catalog;
* the NAS Master Library is authoritative for source publications and master-source metadata;
* the originating device is authoritative for personal changes not yet synchronized;
* the personal synchronization process governs convergence among Local Libraries;
* rebuildable caches and derived artifacts have no canonical authority.

A Local Library shall never be treated as a replica or competing authority of the NAS Master Library.

## Implications

* Authority shall be defined per information scope.
* Two components shall not claim authority over the same scope.
* Derived artifacts shall never become authoritative.
* Local possession of a publication does not transfer master-source authority.
* Personal state does not become part of master publication authority.
* Synchronization convergence does not make the synchronization provider the owner of personal knowledge.

---

# 6. Principle 4 — Master and Personal State Separation

Canonical publication custody and personal knowledge shall remain architecturally separate.

The NAS Master Library manages publications and master-source information.

Local Libraries manage selected local publications and user-specific working state.

Personal knowledge belongs exclusively to the user and shall never be written back to the NAS Master Library.

Personal knowledge includes, among other elements:

* annotations;
* highlights;
* bookmarks;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal collections;
* sticky notes;
* Apple Pencil drawings;
* AI-generated personal artifacts;
* personal preferences.

## Implications

* The Master Library shall remain unaware of user reading behavior.
* Personal state synchronization shall not involve the NAS Master Library.
* Master publication files shall not be distributed through personal synchronization.
* Publication acquisition and personal synchronization shall use separate contracts and workflows.
* Privacy boundaries shall be enforced architecturally rather than by convention.

---

# 7. Principle 5 — Explicit Acquisition

A publication enters a Local Library only through an explicit local discovery, import or acquisition operation.

Acquisition is the controlled installation of a publication into one Local Library.

Acquisition is not synchronization.

## Implications

* Browsing the Master Catalog does not alter Local Library membership.
* A publication may exist on one device and not on another.
* Publication payloads shall not be silently propagated through personal synchronization.
* Acquisition shall preserve source identity, version and provenance.
* Acquisition shall be independently resumable and verifiable.
* A Local Library may also be created from user-authorized files already present on the device.

---

# 8. Principle 6 — Canonical Representation

KnowledgeOS shall maintain explicit canonical representations for normalized knowledge and presentation intent.

The Universal Document Model defines the canonical representation of structured document knowledge.

The Document Presentation Model defines the canonical representation of presentation intent when such representation exists.

Source publications remain authoritative source artifacts within the Master Library.

Canonical models are produced from source artifacts through governed processing.

## Implications

* Import normalizes.
* Processing analyzes.
* Validation establishes conformance.
* Rendering interprets canonical models.
* Export transforms canonical models.
* Storage persists source artifacts and canonical models according to their authority.
* Search indexes, view models and runtime structures remain derived.

Canonical representation does not replace or erase the authoritative source publication.

---

# 9. Principle 7 — Separation of Concerns

Every architectural component shall own one primary responsibility.

Responsibility boundaries shall be explicit and non-overlapping.

Examples include:

* Import imports.
* Library governs Library semantics.
* Search searches.
* Render renders.
* Sync synchronizes personal state.
* AI assists.
* Validation validates.
* Integration connects external systems.
* Storage Providers persist data without choosing authority.

No Engine, provider or client shall silently assume another component’s primary responsibility.

---

# 10. Principle 8 — Stable Domain

The Domain layer expresses business concepts, rules and invariants.

It shall remain independent from implementation technologies.

The Domain shall not depend on:

* databases;
* operating systems;
* user-interface frameworks;
* network protocols;
* rendering frameworks;
* AI providers;
* synchronization providers;
* storage engines;
* deployment topology.

Domain terminology shall describe KnowledgeOS concepts rather than concrete technologies.

The Domain is the most stable architectural layer.

---

# 11. Principle 9 — Explicit Contracts

Communication across architectural boundaries shall occur through explicit contracts.

Contracts include:

* commands;
* queries;
* events;
* service contracts;
* provider contracts;
* public APIs;
* serialization contracts;
* plugin contracts.

Implementation details shall remain private.

Components shall not communicate through hidden dependencies, shared mutable internals or undocumented side effects.

---

# 12. Principle 10 — Replaceable Infrastructure

Infrastructure shall remain replaceable behind stable contracts.

Replaceable infrastructure includes:

* storage engines;
* databases;
* search implementations;
* AI providers;
* OCR providers;
* synchronization providers;
* rendering technologies;
* networking frameworks;
* serialization technologies.

Concrete infrastructure may optimize behavior but shall not redefine Domain concepts or architectural authority.

Infrastructure evolves.

Architecture remains stable.

---

# 13. Principle 11 — Traceability

Every authoritative or canonical artifact shall be traceable to its origin and lifecycle.

KnowledgeOS shall preserve, where applicable:

* source identity;
* ownership;
* provenance;
* acquisition history;
* transformation history;
* processing versions;
* timestamps;
* parent versions;
* validation results.

Knowledge lacking required provenance shall be considered incomplete.

Traceability shall survive migration, export and reconstruction.

---

# 14. Principle 12 — Extensibility

KnowledgeOS shall support extension without requiring modification of its architectural core.

Extensions shall be introduced through governed mechanisms such as:

* plugins;
* providers;
* public APIs;
* capabilities;
* extension points;
* event subscriptions.

Extensions shall not:

* bypass architectural contracts;
* redefine canonical models;
* change authority boundaries;
* access private component state;
* compromise user ownership;
* weaken security or privacy.

---

# 15. Principle 13 — Long-Term Evolution

Architectural decisions shall prioritize long-term clarity, maintainability and preservation over short-term convenience.

When evaluating alternatives, preference shall be given to solutions that best preserve:

* conceptual clarity;
* modularity;
* compatibility;
* portability;
* recoverability;
* extensibility;
* testability;
* long-term data accessibility.

Architectural debt shall be documented and minimized.

---

# 16. Principle 14 — Technology Independence

Architectural concepts shall not be defined in terms of specific products or frameworks.

Correct architectural concepts include:

* Object Repository;
* Workflow Engine;
* Search Provider;
* Synchronization Provider;
* Knowledge Provider;
* Storage Provider.

Technology-specific implementations include:

* PostgreSQL repository;
* SQLite store;
* CloudKit synchronization provider;
* Core Data persistence adapter;
* OpenAI provider;
* Elasticsearch adapter.

Technologies implement architecture.

They do not define it.

Approved deployment profiles may select concrete technologies without changing the architectural concepts they implement.

---

# 17. Principle 15 — Simplicity

Architectural complexity shall exist only when justified by explicit requirements or quality attributes.

The preferred solution is the simplest design that:

* satisfies current architectural requirements;
* preserves declared invariants;
* supports expected evolution;
* remains understandable by maintainers;
* avoids irreversible coupling.

Premature abstraction and premature optimization are discouraged.

Complexity shall always have a documented reason.

---

# 18. Principle 16 — Immutability

Published canonical artifacts and authoritative source versions are immutable.

A modification shall produce a new version rather than overwrite the historical artifact.

This principle applies, where appropriate, to:

* source publication versions;
* Knowledge Object versions;
* UDM versions;
* DPM versions;
* mappings;
* assets;
* anchors;
* provenance records;
* published contracts.

Mutable working state may exist during processing, editing or personal interaction, but it shall not silently mutate published canonical history.

## Implications

* Stable identities.
* Complete version history.
* Safe acquisition.
* Reliable auditing.
* Predictable evolution.
* Reproducible historical states.

---

# 19. Principle 17 — Reproducibility

Canonical processing shall be reproducible.

Given:

* equivalent inputs;
* identical processing-component versions;
* identical configuration;
* identical deterministic rules;

KnowledgeOS shall reconstruct an equivalent canonical result.

## Implications

* Reliable recovery.
* Verifiable migrations.
* Safe reprocessing.
* Long-term preservation.
* Comparable processing outcomes.
* Auditable transformations.

External nondeterministic dependencies shall be recorded when exact reproduction cannot be guaranteed.

---

# 20. Principle 18 — Idempotency

Operations that may be retried shall be idempotent or explicitly protected against duplicate effects.

This applies especially to:

* imports;
* acquisitions;
* command handling;
* event handling;
* synchronization;
* indexing;
* validation;
* workflow steps;
* recovery procedures.

Repeating an operation with the same identity and inputs shall not create unintended duplicate state.

Idempotency does not require all operations to be stateless.

It requires retries to produce predictable and safe outcomes.

---

# 21. Principle 19 — Canonical First

Authoritative and canonical artifacts shall take precedence over derived runtime representations.

Derived artifacts include:

* search indexes;
* embedding indexes;
* thumbnails;
* previews;
* caches;
* render trees;
* presentation trees;
* view models;
* temporary OCR output;
* AI context windows;
* materialized projections.

Derived artifacts shall be rebuildable whenever technically possible.

They shall not become the only surviving representation of authoritative knowledge.

---

# 22. Principle 20 — Deterministic Core

The architectural core shall behave deterministically.

Given identical canonical inputs and deterministic configuration, core processing shall produce equivalent canonical outputs.

Probabilistic systems, including Artificial Intelligence, shall not establish authority by themselves.

AI may:

* suggest;
* classify;
* summarize;
* extract;
* rank;
* assist transformation.

AI output becomes canonical only after passing the explicit validation and acceptance process defined for that workflow.

## Implications

* AI providers remain replaceable.
* AI results preserve provenance.
* Unvalidated AI output remains provisional.
* Canonical identities do not depend on nondeterministic output.
* Core recovery does not depend on reproducing an exact probabilistic response.

---

# 23. Principle 21 — Privacy by Architecture

Privacy boundaries shall be enforced through system structure, ownership and contracts.

They shall not depend solely on user-interface conventions or implementation discipline.

## Implications

* Personal state shall use explicitly approved persistence and synchronization channels.
* The Master Library shall not collect personal reading activity.
* Providers shall receive only the minimum required information.
* Remote AI use shall require explicit policy and user control.
* Sensitive data shall not cross architectural boundaries implicitly.
* Logs and telemetry shall avoid unauthorized personal content.
* Plugins shall operate within declared capabilities and permissions.

---

# 24. Principle 22 — Evolution Through ADR

Significant architectural changes shall occur only through approved Architecture Decision Records.

An ADR shall document:

* context;
* problem;
* considered alternatives when relevant;
* decision;
* consequences;
* superseded interpretations;
* compatibility impact.

ADRs shall amend existing architectural documents rather than create undocumented parallel rules.

Implementation shall not redefine accepted architecture.

---

# 25. Relationship Between Principles

These principles are complementary and shall be interpreted together.

When a design creates tension between principles, the following priority order shall guide resolution:

1. User Ownership
2. Privacy by Architecture
3. Scoped Authority
4. Master and Personal State Separation
5. Offline First
6. Explicit Acquisition
7. Canonical Representation
8. Stable Domain
9. Immutability
10. Deterministic Core
11. Reproducibility
12. Idempotency
13. Canonical First
14. Explicit Contracts
15. Separation of Concerns
16. Traceability
17. Technology Independence
18. Replaceable Infrastructure
19. Extensibility
20. Long-Term Evolution
21. Simplicity
22. Evolution Through ADR

A lower-priority principle shall not be ignored automatically.

Conflicts shall be analyzed explicitly and resolved through an ADR when they materially affect the architecture.

---

# 26. Compliance

Every architectural artifact shall comply with these principles.

Compliance applies to:

* Architecture Decision Records;
* Foundation documents;
* Domain models;
* Kernel components;
* Platform Engines;
* Integration contracts;
* Execution models;
* Implementation specifications;
* public APIs;
* providers;
* plugins;
* client and server applications.

Architecture reviews shall verify compliance.

Any exception requires an approved ADR identifying:

* the affected principle;
* the justification;
* the scope;
* the consequences;
* the planned duration when temporary.

---

# 27. Related Documents

* ProductVision.md
* ArchitectureModel.md
* ArchitectureConstraints.md
* QualityAttributes.md
* ../08-Governance/ArchitectureVocabulary.md
* ../07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md
* ../07-ArchitectureViews/ADR/

---

# 28. Status

**Approved**

This document defines the permanent architectural philosophy of KnowledgeOS Architecture V3.

Every architectural decision, specification, implementation and future evolution of the platform shall comply with these principles unless an approved Architecture Decision Record explicitly documents an exception.
