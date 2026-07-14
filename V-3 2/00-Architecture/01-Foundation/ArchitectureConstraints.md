
# Architecture Constraints

**Project:** KnowledgeOS

**Section:** Foundation

**Document:** Architecture Constraints

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural constraints that every component of KnowledgeOS must satisfy.

Unlike architectural principles, constraints are mandatory.

A solution that violates a constraint is not considered architecturally valid unless an approved Architecture Decision Record explicitly authorizes an exception.

---

# 2. Scope

These constraints apply to:

* Foundation
* Domain
* Kernel
* Platform
* Integration
* Quality
* Architecture Views

They also apply to:

* Engines
* Repositories
* Plugins
* Providers
* Specifications
* Future architectural extensions

---

# 3. Data Ownership

All user knowledge belongs exclusively to the user.

The platform shall never require transferring ownership of data to external services.

### Requirements

* User-controlled storage.
* User-controlled backups.
* User-controlled synchronization.
* Export without vendor lock-in.

---

# 4. Offline Operation

Core platform capabilities shall operate without Internet connectivity.

Core capabilities include:

* opening a Library;
* importing sources;
* reading Knowledge Objects;
* rendering;
* annotations;
* search;
* organization;
* export.

Remote connectivity is optional.

---

# 5. Source of Truth

Each Knowledge Library shall have exactly one Source of Truth.

For version 3:

* the Source of Truth is the user's NAS.

Every device operates on a synchronized Working Copy.

Multiple authoritative copies are forbidden.

---

# 6. Canonical Representation

Every imported source shall be transformed into the Universal Document Model (UDM).

The UDM is the only canonical representation of structured content.

No Engine may define an alternative internal representation.

---

# 7. Knowledge Object Identity

Every Knowledge Object shall have a permanent identifier.

The identifier:

* is globally unique;
* never changes;
* survives synchronization;
* survives migration;
* survives export and re-import whenever technically possible.

---

# 8. Engine Responsibilities

Each Engine owns exactly one primary responsibility.

Responsibilities shall not overlap.

Direct implementation dependencies between Engines are forbidden.

Communication occurs exclusively through public contracts.

---

# 9. Domain Independence

The Domain layer shall not depend on:

* databases;
* frameworks;
* UI toolkits;
* storage engines;
* AI providers;
* operating systems.

Business concepts remain technology-independent.

---

# 10. Repository Model

Persistent information shall be organized using logical repositories.

Mandatory repositories are:

* Object Repository;
* Asset Repository;
* Journal Repository;
* Index Repository;
* Configuration Repository;
* Backup Repository.

Repositories define logical responsibilities, not physical layouts.

---

# 11. Asset Management

Binary Assets shall remain independent from Knowledge Objects.

Requirements:

* dedicated Asset Repository;
* content-addressable storage;
* deduplication;
* immutable identity.

Embedding binary assets directly into `.kdoc` files is prohibited.

---

# 12. Public Contracts

Inter-component communication shall occur only through public contracts.

Supported mechanisms:

* Commands;
* Queries;
* Events;
* Public APIs.

Access to private implementations is prohibited.

---

# 13. Artificial Intelligence

Artificial intelligence is optional.

The platform shall remain operational without AI.

AI shall never become:

* the Source of Truth;
* the canonical representation;
* the owner of business decisions.

Every AI-generated result must be reviewable by the user.

---

# 14. Plugin Isolation

Plugins shall execute within the boundaries defined by the Plugin Engine.

Plugins shall not:

* modify the Kernel;
* modify the Domain;
* access private Engine internals;
* bypass permission validation.

---

# 15. Provenance

Every imported Knowledge Object shall preserve provenance.

Minimum provenance includes:

* original source;
* import date;
* import method;
* transformation history.

Loss of provenance is not permitted.

---

# 16. Versioning

All persistent formats shall be versioned.

This includes:

* `.kdoc`;
* metadata;
* manifests;
* plugin descriptors;
* synchronization metadata.

Backward compatibility shall be explicitly defined.

---

# 17. Replaceable Infrastructure

Infrastructure implementations shall be replaceable.

Examples include:

* SQLite;
* AI providers;
* OCR providers;
* synchronization providers;
* rendering technologies.

Architectural concepts shall never depend on a specific implementation.

---

# 18. Cross-Platform Strategy

KnowledgeOS is designed primarily for:

1. macOS
2. iPadOS
3. iOS

Future platforms may be supported without changing the architecture.

Platform-specific code shall remain isolated.

---

# 19. Security

Security is mandatory.

The architecture shall support:

* local encryption;
* secure credential storage;
* permission-based plugin execution;
* authenticated synchronization;
* integrity validation.

Security mechanisms shall not compromise Offline First operation.

---

# 20. Observability

Every significant architectural operation shall be observable.

Examples:

* imports;
* synchronization;
* indexing;
* workflow execution;
* plugin lifecycle;
* provider execution.

Observability shall support diagnostics without exposing user data.

---

# 21. Architectural Stability

The following architectural concepts are frozen for version 3:

* Knowledge Object;
* Knowledge Library;
* Universal Document Model;
* Engine-Based Architecture;
* Workflow Engine;
* Repository Model;
* Source of Truth;
* Working Copy;
* Provider abstraction.

Changes require a new ADR and are expected only in a future major version.

---

# 22. Compliance

Every ADR shall identify the constraints it satisfies.

Every Engine specification shall demonstrate compliance with these constraints.

Violations shall be documented and approved through the ADR process.

---

# 23. Related Documents

* ProductVision.md
* ArchitectureModel.md
* ArchitecturePrinciples.md
* QualityAttributes.md
* ../00-Governance/ArchitectureVocabulary.md
* ../07-ArchitectureViews/ADR/

---

# 24. Status

**Approved**

This document defines the mandatory architectural constraints for KnowledgeOS.

All architectural decisions, specifications and implementations shall comply with these constraints unless an approved ADR explicitly documents an exception.
