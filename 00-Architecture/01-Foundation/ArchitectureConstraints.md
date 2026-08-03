
# Architecture Constraints

**Project:** KnowledgeOS

**Section:** Foundation

**Document:** Architecture Constraints

**Version:** 3.1

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the mandatory architectural constraints that every KnowledgeOS component, contract, specification and implementation shall satisfy.

Architectural principles guide design decisions.

Architectural constraints establish non-negotiable boundaries.

A solution that violates any constraint defined in this document is not architecturally valid unless an approved Architecture Decision Record explicitly authorizes and documents the exception.

---

# 2. Scope

These constraints apply to every KnowledgeOS architectural layer:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* Architecture Views;
* Implementation.

They also apply to:

* Engines;
* repositories;
* providers;
* plugins;
* public contracts;
* applications;
* servers;
* synchronization profiles;
* storage profiles;
* deployment profiles;
* future architectural extensions.

No component is exempt from these constraints.

---

# 3. User Ownership

All personal knowledge belongs exclusively to the user.

KnowledgeOS shall never require the transfer of ownership of user information to the platform, an external provider or a synchronization service.

## Requirements

* User-controlled storage.
* User-controlled export.
* User-controlled backups.
* User-controlled synchronization.
* Portable data formats whenever technically possible.
* No mandatory vendor lock-in.
* No external provider may become the sole holder of user-owned knowledge.
* Personal knowledge shall remain recoverable independently of optional remote services.

---

# 4. Offline Operation

Core client capabilities shall operate without Internet connectivity or NAS availability whenever the required publication and personal state are already present in the Local Library.

Core offline capabilities include:

* opening a Local Library;
* reading locally available publications;
* rendering;
* annotation;
* highlighting;
* bookmarking;
* local organization;
* local search;
* local indexing;
* personal-state creation;
* export;
* local import;
* local processing;
* local AI when a compatible local provider is available.

Remote connectivity may extend capabilities but shall not be required for core local workflows.

Network interruption shall not invalidate locally committed personal changes.

---

# 5. Scoped Authority

KnowledgeOS shall not define one global Source of Truth for every category of information.

Authority shall be explicitly assigned by information scope.

For Architecture V3:

| Information scope                       | Authority                                              |
| --------------------------------------- | ------------------------------------------------------ |
| Master Catalog                          | KnowledgeOS Server on the NAS                          |
| Source publications                     | KnowledgeOS Server on the NAS                          |
| Master-source metadata                  | KnowledgeOS Server on the NAS                          |
| Publication versions and availability   | KnowledgeOS Server on the NAS                          |
| Acquired local publication payload      | Local device after successful acquisition              |
| Unsynchronized personal changes         | Originating device                                     |
| Synchronized personal-state convergence | Sync Engine using the approved synchronization profile |
| Cache and derived artifacts             | No canonical authority; rebuildable                    |

Multiple authoritative owners for the same information scope are forbidden.

A Local Library is not a replica of the NAS Master Library.

The NAS Master Library is not the authority for personal knowledge.

---

# 6. Master Library Boundary

The Master Library shall run through KnowledgeOS Server on the NAS.

It shall manage:

* the complete Master Catalog;
* source publications;
* source files;
* master-source metadata;
* publication versions;
* publication availability;
* catalog browsing;
* publication delivery.

The Master Library shall not store or synchronize:

* annotations;
* highlights;
* bookmarks;
* reading progress;
* favorites;
* personal tags;
* personal collections;
* personal relationships;
* sticky notes;
* Apple Pencil drawings;
* AI conversations;
* AI-generated personal artifacts;
* personal preferences;
* equivalent private user state.

The Master Library shall remain outside the personal synchronization topology.

---

# 7. Selective Local Libraries

Each macOS, iPhone and iPad client shall maintain its own selective Local Library.

A Local Library:

* contains only publications available on that device;
* may contain publications discovered locally;
* may contain publications explicitly acquired from the Master Library;
* stores the information required for local offline operation;
* stores or materializes personal state required by the device;
* may contain a different publication set from every other device;
* shall not be described or implemented as a replica of the Master Library.

Local Library membership is device-specific unless an approved personal preference explicitly coordinates acquisition intent.

Such a preference shall not itself transfer publication payloads.

---

# 8. Local Library Creation

A Local Library shall be creatable without access to the NAS Master Library.

During initial setup, a client may scan user-authorized local locations and register supported publications already available on the device.

For every discovered publication, the client shall perform the applicable operations:

* validation;
* identity resolution;
* metadata extraction;
* checksum calculation;
* provenance registration;
* indexing;
* thumbnail generation;
* preview generation;
* OCR;
* canonical processing.

The resulting Local Library shall become operational independently of the Master Library.

---

# 9. Explicit Publication Acquisition

A publication shall enter a Local Library only through an explicit acquisition or local-import operation.

Acquisition from the Master Library shall require:

* an identifiable publication;
* an explicit user or approved workflow request;
* successful payload transfer;
* integrity validation;
* provenance preservation;
* local registration;
* idempotent completion.

Publication acquisition is not synchronization.

Browsing the Master Catalog shall not automatically alter Local Library membership.

Synchronization shall not silently download publication payloads.

---

# 10. Personal-State Synchronization

Personal state may synchronize exclusively among approved client devices through an approved synchronization profile.

The synchronized scope may include:

* annotations;
* highlights;
* bookmarks;
* reading progress;
* favorites;
* personal tags;
* collections;
* personal relationships;
* personal metadata;
* personal preferences;
* AI-generated personal artifacts;
* equivalent user-created state.

Personal synchronization shall not:

* write personal state to the NAS Master Library;
* make the synchronization provider authoritative for source publications;
* distribute Master Library publication payloads;
* convert Local Libraries into replicas;
* require NAS availability.

Publication acquisition and personal-state synchronization shall use separate contracts, identities, workflows and failure handling.

---

# 11. Canonical Representation

Supported publication content that enters canonical processing shall be normalized into the Universal Document Model where the source type and processing profile permit it.

The UDM is the canonical representation of normalized structured document knowledge.

The Document Presentation Model is the canonical representation of normalized presentation intent where presentation reconstruction is applicable.

The original source publication remains an authoritative source artifact.

No Engine may establish an alternative canonical document model outside the approved Domain contracts.

Engine-specific structures are permitted only when they are:

* private;
* derived;
* temporary or rebuildable;
* traceable to canonical or authoritative input;
* incapable of redefining Domain semantics.

---

# 12. Knowledge Object Identity

Every Knowledge Object shall have a permanent identity.

The identity:

* shall be globally unique within the defined identity namespace;
* shall not change during the object lifecycle;
* shall survive synchronization;
* shall survive migration;
* shall survive storage-provider replacement;
* shall survive export and re-import whenever the target format can preserve it;
* shall not depend on a temporary path, cache key or device-specific location.

Identity resolution shall be deterministic where deterministic evidence exists.

Identity conflicts shall be handled explicitly.

---

# 13. Engine Responsibilities

Each Engine shall own exactly one primary business capability.

Engine responsibilities shall be explicit and non-overlapping.

Direct dependencies on another Engine’s private implementation are forbidden.

Inter-Engine communication shall occur exclusively through approved:

* commands;
* queries;
* events;
* service contracts;
* workflow contracts;
* public contracts.

An Engine shall not:

* access another Engine’s private repository;
* mutate another Engine’s internal state;
* redefine another Engine’s Domain concepts;
* bypass Kernel coordination where coordination is required;
* assume infrastructure authority not assigned to it.

---

# 14. Domain Independence

The Domain layer shall not depend on:

* databases;
* persistence frameworks;
* user-interface frameworks;
* operating-system APIs;
* storage engines;
* network protocols;
* synchronization providers;
* AI providers;
* OCR providers;
* rendering technologies;
* deployment topology.

Domain concepts shall remain technology-independent.

Concrete technologies shall implement Domain contracts without redefining Domain meaning.

---

# 15. Repository Model

Persistent information shall be organized through explicit logical repository responsibilities.

Required repository capabilities include, where applicable:

* Object Repository;
* Asset Repository;
* Journal Repository;
* Index Repository;
* Configuration Repository;
* Backup Repository.

Repository names define logical responsibilities, not mandatory physical databases or directory layouts.

A deployment may implement multiple logical repositories within one physical technology only when:

* ownership boundaries remain explicit;
* contracts remain independent;
* migrations remain separable;
* authority is not obscured;
* replacement remains technically possible.

Repositories shall not determine business authority merely because they physically store data.

---

# 16. Asset Management

Binary assets shall remain logically independent from Knowledge Objects.

Asset management shall support:

* dedicated repository responsibility;
* immutable asset identity;
* integrity verification;
* deduplication where appropriate;
* provenance;
* lifecycle tracking;
* content-addressable storage where compatible with privacy and encryption requirements.

Embedding uncontrolled binary payloads directly into canonical document structures is prohibited.

Packaging formats may contain assets only when the serialization contract explicitly defines their identities, integrity and relationships.

---

# 17. Public Contracts

Communication across architectural boundaries shall occur through explicit public contracts.

Supported mechanisms include:

* Commands;
* Queries;
* Events;
* Public APIs;
* Provider Contracts;
* Plugin Contracts;
* Serialization Contracts;
* Workflow Contracts.

Access to private implementations is prohibited.

Public contracts shall be:

* versioned;
* documented;
* testable;
* backward-compatibility aware;
* independent from internal implementation types;
* governed by explicit ownership.

---

# 18. Artificial Intelligence

Artificial Intelligence is optional.

KnowledgeOS shall remain operational without AI.

AI shall never become:

* an authority;
* the Source of Truth;
* the canonical representation;
* the owner of a business decision;
* the sole holder of user knowledge;
* the source of permanent identity.

AI-generated results shall preserve:

* provider identity;
* model identity when available;
* generation context;
* timestamp;
* provenance;
* validation status.

AI output shall remain provisional until accepted by the applicable workflow or explicitly accepted by the user.

Remote AI use shall respect privacy, permissions and data-minimization policies.

---

# 19. Plugin Isolation

Plugins shall execute within the boundaries established by the Plugin Engine and Plugin SDK.

Plugins shall not:

* modify the Kernel;
* redefine the Domain;
* access private Engine internals;
* access repositories without an approved capability;
* bypass authorization;
* bypass privacy controls;
* bypass validation;
* bypass audit requirements;
* acquire undeclared network, storage or AI capabilities.

Every plugin shall declare its required capabilities.

Capability grants shall be explicit, revocable and observable.

---

# 20. Provenance

Every imported or acquired publication and every canonical transformation shall preserve provenance.

Minimum provenance shall include, where applicable:

* original source identity;
* source location or source reference;
* acquisition or import date;
* acquisition or import method;
* originating Library;
* publication version;
* processing profile;
* transformation history;
* responsible component versions;
* validation status.

Loss of required provenance is prohibited.

Derived artifacts shall remain traceable to their authoritative or canonical inputs.

---

# 21. Versioning

All persistent contracts and formats shall be versioned.

This includes:

* UDM serialization;
* DPM serialization;
* Knowledge Object serialization;
* metadata;
* manifests;
* repository schemas;
* provider contracts;
* plugin descriptors;
* synchronization envelopes;
* public API contracts;
* acquisition contracts;
* event schemas.

Backward compatibility and migration behavior shall be explicitly defined.

Silent reinterpretation of persistent data is prohibited.

---

# 22. Immutability

Published authoritative source versions and canonical artifact versions shall be immutable.

Changes shall create new versions rather than overwrite historical versions.

Mutable working state is permitted only within an explicitly defined editing, processing or personal-state lifecycle.

Mutable state shall not silently replace an existing immutable version.

---

# 23. Determinism and Reproducibility

Core canonical processing shall be deterministic where all inputs and processing dependencies are deterministic.

Processing shall record sufficient information to reproduce or explain results, including:

* input identities;
* configuration;
* processing-component versions;
* workflow version;
* transformation steps;
* nondeterministic dependencies.

Probabilistic output shall not silently become canonical.

When exact reproduction is impossible, the limitation shall be explicit and preserved in provenance.

---

# 24. Idempotency

Operations that may be retried shall be idempotent or protected by explicit duplicate-detection mechanisms.

This applies especially to:

* imports;
* publication acquisitions;
* command handling;
* event handling;
* synchronization;
* workflow steps;
* indexing;
* migrations;
* recovery procedures;
* provider requests with persistent effects.

A retry shall not create unintended duplicate publications, objects, assets, annotations or events.

---

# 25. Replaceable Infrastructure

Infrastructure implementations shall remain replaceable behind stable contracts.

Replaceable implementations include:

* database engines;
* object storage;
* file-system adapters;
* search engines;
* AI providers;
* OCR providers;
* synchronization providers;
* rendering technologies;
* serialization technologies;
* network transports.

Architectural concepts shall not depend on a specific infrastructure product.

Deployment profiles may select concrete implementations without changing Domain or Platform contracts.

---

# 26. Cross-Platform Strategy

KnowledgeOS targets the following client platforms:

1. macOS;
2. iPadOS;
3. iOS.

A web client may be introduced when it can comply with the approved architecture and security constraints.

Platform-specific code shall remain isolated behind explicit adapters or platform contracts.

Platform-specific implementations shall not redefine:

* Domain semantics;
* authority boundaries;
* identity;
* synchronization semantics;
* acquisition semantics;
* canonical models.

---

# 27. Security

Security is mandatory across every architectural layer.

The architecture shall support:

* local encryption where required;
* encryption in transit;
* secure credential storage;
* authenticated server access;
* authenticated synchronization;
* integrity validation;
* permission-based plugin execution;
* provider capability control;
* secure key lifecycle;
* least-privilege access;
* auditability of security-sensitive operations.

Security mechanisms shall preserve Offline First operation for locally authorized content.

No security-sensitive fallback may silently reduce the declared protection level.

---

# 28. Privacy

Personal information shall cross an architectural boundary only when required by an explicit approved workflow.

The platform shall enforce:

* data minimization;
* explicit provider boundaries;
* user-visible remote processing policies;
* separation between Master Library data and personal state;
* privacy-aware observability;
* privacy-aware logging;
* deletion and export capabilities;
* explicit synchronization scope.

The NAS Master Library shall not collect personal reading behavior.

Telemetry shall not include publication content or personal knowledge unless explicitly authorized and technically protected.

---

# 29. Observability

Every significant architectural operation shall be observable.

Observable operations include:

* imports;
* acquisitions;
* synchronization;
* indexing;
* canonical processing;
* workflow execution;
* plugin lifecycle;
* provider execution;
* publication delivery;
* recovery;
* migrations;
* validation failures.

Observability shall support:

* diagnostics;
* correlation;
* auditing;
* performance analysis;
* failure recovery.

Observability shall not expose unauthorized publication content, credentials or personal knowledge.

---

# 30. Derived Artifacts

Derived artifacts shall not become authoritative.

Derived artifacts include:

* caches;
* thumbnails;
* previews;
* search indexes;
* embeddings;
* render trees;
* temporary OCR output;
* view models;
* AI context materializations;
* materialized projections.

Derived artifacts shall be rebuildable whenever technically possible.

The loss of a derived artifact shall not imply the loss of its authoritative or canonical source.

---

# 31. Architectural Stability

The following concepts are frozen for KnowledgeOS Architecture V3:

* User Ownership;
* Offline First;
* Scoped Authority;
* Master Library;
* Selective Local Libraries;
* Personal-State Synchronization;
* Explicit Publication Acquisition;
* Knowledge Object;
* Universal Document Model;
* Document Presentation Model;
* Engine-Based Architecture;
* Workflow Engine;
* Repository Model;
* Provider Abstraction;
* Public Contracts;
* Plugin Capability Model.

The following interpretation is explicitly prohibited:

* Local Libraries as replicas of the NAS Master Library;
* NAS participation in personal-state synchronization;
* acquisition as synchronization;
* synchronization as automatic publication distribution;
* one global Source of Truth for every information category.

Changes to frozen concepts require an approved ADR.

Changes that alter their fundamental meaning require a future major architecture version.

---

# 32. Compliance

Every ADR shall identify the constraints it affects or satisfies.

Every Engine specification shall demonstrate compliance with the applicable constraints.

Every implementation specification shall preserve the architectural authority, ownership and dependency boundaries defined here.

Violations shall be:

* explicitly identified;
* justified;
* scoped;
* risk-assessed;
* approved through the ADR process.

Undocumented exceptions are prohibited.

---

# 33. Related Documents

* ProductVision.md
* ArchitectureModel.md
* ArchitecturePrinciples.md
* QualityAttributes.md
* ../00-Governance/ArchitectureVocabulary.md
* ../07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md
* ../07-ArchitectureViews/ADR/

---

# 34. Status

**Approved**

This document defines the mandatory architectural constraints for KnowledgeOS Architecture V3.

All architectural decisions, specifications, contracts and implementations shall comply with these constraints unless an approved Architecture Decision Record explicitly documents an exception.
