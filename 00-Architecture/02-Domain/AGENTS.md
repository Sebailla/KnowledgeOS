
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Domain
**Path:** `00-Architecture/02-Domain/`
**Document:** Domain Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the mandatory operational rules for every human or AI agent working inside:

```text
00-Architecture/02-Domain/
```

Its purpose is to preserve the semantic integrity of KnowledgeOS.

The Domain defines what KnowledgeOS concepts mean independently from:

* implementation language;
* application platform;
* persistence technology;
* user-interface framework;
* deployment model;
* provider;
* external service;
* network protocol.

This document refines:

* the root `AGENTS.md`;
* `00-Architecture/AGENTS.md`.

It shall not replace the normative Domain documentation.

---

# 2. Scope

These instructions apply to:

```text
02-Domain/
├── DPM/
├── DomainModel.md
├── EngineResponsibilities.md
├── Identity/
├── KnowledgeGraph/
├── KnowledgeLifecycle.md
├── KnowledgeObject/
├── README.md
└── UDM/
```

They govern work involving:

* canonical domain concepts;
* document semantics;
* presentation semantics;
* identity;
* lifecycle;
* provenance;
* sources;
* assets;
* metadata;
* relationships;
* graph semantics;
* serialization;
* validation;
* model consistency;
* mapping between Domain models.

---

# 3. Domain Authority

The Domain is the semantic authority of KnowledgeOS.

It defines the meaning of:

* documents;
* knowledge;
* nodes;
* assets;
* annotations;
* relationships;
* identity;
* provenance;
* lifecycle;
* presentation;
* serialization;
* validation.

Implementation may realize these concepts.

Implementation shall not redefine them.

Persistence may store these concepts.

Persistence shall not own their meaning.

Platform Engines may operate over these concepts.

Platform Engines shall not create conflicting local versions of them.

---

# 4. Mandatory Reading Order

Before modifying any Domain document, read:

1. root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. `00-Architecture/01-Foundation/ProductVision.md`;
4. `00-Architecture/01-Foundation/ArchitecturePrinciples.md`;
5. `00-Architecture/01-Foundation/ArchitectureConstraints.md`;
6. `00-Architecture/01-Foundation/ArchitectureModel.md`;
7. `00-Architecture/02-Domain/README.md`;
8. `00-Architecture/02-Domain/DomainModel.md`;
9. the target model documentation;
10. related ADRs;
11. related Platform and Integration documents;
12. related implementation documents when impact exists.

For model-wide changes, also read:

```text
KnowledgeLifecycle.md
EngineResponsibilities.md
Identity/README.md
KnowledgeGraph/README.md
KnowledgeObject/README.md
UDM/README.md
DPM/README.md
```

---

# 5. Domain Invariants

Every Domain change shall preserve the following invariants.

## 5.1 Technology independence

Domain concepts shall remain independent from implementation technology.

## 5.2 Stable identity

Identity shall remain stable across:

* import;
* processing;
* storage;
* synchronization;
* presentation;
* annotation;
* export;
* migration;
* versioning.

## 5.3 Semantic preservation

Knowledge shall not lose meaning when transformed between representations.

## 5.4 Provenance preservation

The origin and transformation history of knowledge shall remain traceable.

## 5.5 Open representation

Canonical representations shall remain documentable, serializable and portable.

## 5.6 Model coherence

UDM, DPM, Knowledge Object, Identity and Knowledge Graph shall remain mutually consistent.

## 5.7 Explicit lifecycle

Domain objects shall have explicit lifecycle states and transitions where lifecycle behavior exists.

## 5.8 Validation authority

Domain validity shall be defined by Domain rules, not inferred from storage success or UI behavior.

## 5.9 Canonical ownership

Every Domain concept shall have one authoritative owner.

## 5.10 No silent information loss

Transformations shall not silently discard semantic, structural, presentation or provenance information.

---

# 6. Prohibited Domain Content

Domain documentation shall not contain:

* Swift types;
* Rust types;
* TypeScript types;
* SQL schemas;
* PostgreSQL details;
* ORM models;
* SwiftUI views;
* REST endpoints;
* GraphQL schemas;
* HTTP status codes;
* Docker configuration;
* NAS mount commands;
* file-system paths specific to one implementation;
* vendor APIs;
* cloud service behavior;
* provider-specific model names;
* implementation classes;
* framework dependencies.

Such details belong in:

* Integration;
* Implementation;
* Infrastructure;
* Public Contracts;
* Technical Design.

Examples may illustrate concepts, but shall remain implementation-neutral.

---

# 7. Canonical Domain Models

KnowledgeOS uses several coordinated Domain models.

They are complementary.

They shall not compete for ownership.

## 7.1 Universal Document Model

UDM owns semantic and structural document representation.

## 7.2 Document Presentation Model

DPM owns presentation structure and visual reconstruction.

## 7.3 Knowledge Object

Knowledge Object owns the aggregate representation of managed knowledge.

## 7.4 Identity

Identity owns stable identification semantics.

## 7.5 Knowledge Graph

Knowledge Graph owns graph relationships and semantic connections.

## 7.6 Knowledge Lifecycle

Knowledge Lifecycle owns domain-level lifecycle semantics.

No new parallel model shall be introduced without architectural review.

---

# 8. DomainModel.md

`DomainModel.md` is the high-level map of the Domain.

It shall define:

* canonical Domain areas;
* responsibility boundaries;
* relationships between models;
* shared invariants;
* dependency direction;
* terminology;
* ownership.

It shall not duplicate every detailed model definition.

When a new Domain concept is introduced, `DomainModel.md` shall be reviewed.

When a responsibility moves, `DomainModel.md` shall be updated.

---

# 9. EngineResponsibilities.md

`EngineResponsibilities.md` maps Domain responsibilities to Platform Engines.

It shall not redefine Platform architecture.

Its purpose is to explain:

* which Engine acts on which Domain concepts;
* which Engine owns which operations;
* which Engine may read or transform which model;
* where responsibility boundaries exist.

Changes to this document shall be reviewed against:

```text
00-Architecture/04-Platform/README.md
```

and all affected Engine documents.

Domain concepts shall not be shaped merely to simplify one Engine.

---

# 10. Universal Document Model

UDM is the canonical semantic and structural model for document content.

It shall represent document meaning independently from:

* original source format;
* renderer;
* editor;
* storage system;
* operating system;
* acquisition method.

UDM shall not become a visual layout model.

Presentation-specific information belongs primarily to DPM.

---

# 11. UDM Ownership

UDM owns:

* document node identity;
* semantic node types;
* structural node types;
* inline node types;
* annotation node representation where defined;
* asset references;
* node attributes;
* temporal semantics;
* type system;
* graph relationships internal to the document model;
* semantic reasoning structures;
* canonical serialization;
* consistency rules;
* validation rules;
* processing pipeline semantics.

UDM shall not own:

* page layout;
* visual positioning;
* typography;
* decorative style;
* display-specific rendering behavior;
* storage implementation;
* application UI state.

---

# 12. UDM Core

The UDM Core defines foundational concepts.

Changes under `UDM/Core/` require review of all UDM areas.

## 12.1 Identity

Node identity shall be:

* stable;
* unique within its defined scope;
* serializable;
* comparable;
* synchronization-safe;
* versioning-safe.

Identity shall not depend solely on mutable content.

## 12.2 Node model

Every node shall have:

* a defined type;
* a defined identity;
* allowed attributes;
* allowed relationships;
* lifecycle behavior where relevant;
* serialization behavior;
* validation rules.

## 12.3 Type system

The type system shall be:

* explicit;
* extensible through approved mechanisms;
* deterministic;
* serializable;
* backward-compatible where required.

Types shall not be inferred solely from renderer behavior.

## 12.4 Temporal model

Temporal concepts shall distinguish where relevant:

* creation time;
* modification time;
* source time;
* observation time;
* publication time;
* ingestion time;
* processing time;
* version time.

Temporal semantics shall not be reduced to one generic timestamp.

---

# 13. UDM Nodes

UDM node categories shall remain clearly separated.

## 13.1 Structural nodes

Structural nodes define document organization.

Examples may include:

* document;
* section;
* chapter;
* paragraph;
* list;
* table;
* block.

Structural nodes shall not encode visual layout as their primary meaning.

## 13.2 Content nodes

Content nodes represent meaningful content.

Examples may include:

* text;
* image;
* audio;
* video;
* equation;
* code;
* citation.

## 13.3 Inline nodes

Inline nodes represent semantics within content flow.

Examples may include:

* emphasis;
* links;
* references;
* terms;
* inline annotations.

## 13.4 Asset nodes

Asset nodes refer to externally stored or independently managed resources.

Asset identity shall remain distinct from incidental file paths.

## 13.5 Annotation nodes

Annotation nodes shall preserve:

* author;
* target;
* anchor;
* content;
* creation time;
* modification time;
* provenance;
* status where relevant.

## 13.6 Semantic nodes

Semantic nodes represent meaning beyond raw document structure.

They shall distinguish user-authored semantics from machine-inferred semantics.

---

# 14. UDM Graph

UDM Graph documentation defines relationships associated with UDM content.

It shall remain coordinated with the broader Knowledge Graph.

## 14.1 Relationship model

Relationships shall define:

* source;
* target;
* type;
* direction;
* cardinality;
* provenance;
* confidence where relevant;
* lifecycle;
* validation.

## 14.2 Ontology

Ontology definitions shall:

* use explicit vocabulary;
* define namespaces where required;
* avoid accidental synonym duplication;
* support evolution;
* preserve backward compatibility where required.

## 14.3 Embeddings

Embeddings are derived representations.

They shall not be treated as canonical semantic truth.

Embedding documentation shall define:

* source content;
* model provenance;
* version;
* dimensionality;
* creation time;
* invalidation conditions;
* privacy implications.

## 14.4 Semantic reasoning

Reasoning outputs shall distinguish:

* inferred facts;
* suggested relationships;
* confidence;
* evidence;
* model provenance;
* user confirmation.

AI-generated inference shall not silently become authoritative knowledge.

---

# 15. UDM Processing

The UDM processing pipeline shall define transformation stages explicitly.

Typical stages may include:

```text
Acquisition
    ↓
Extraction
    ↓
Normalization
    ↓
Classification
    ↓
Semantic construction
    ↓
Validation
    ↓
Persistence
```

The precise pipeline shall be defined by authoritative documents.

Each stage shall specify:

* inputs;
* outputs;
* preconditions;
* postconditions;
* failure behavior;
* idempotency;
* provenance effects;
* validation.

A pipeline stage shall not silently mutate unrelated Domain state.

---

# 16. UDM Serialization

Serialization is a canonical Domain concern.

Serialization documentation shall define:

* canonical representation;
* required fields;
* optional fields;
* identity preservation;
* type preservation;
* relationship preservation;
* ordering where relevant;
* versioning;
* compatibility;
* unknown-field behavior;
* extension behavior;
* validation.

Serialization shall not be coupled to one database or transport protocol.

Lossless round-trip behavior shall be defined where required.

---

# 17. UDM Validation

UDM validation shall distinguish:

* syntactic validity;
* structural validity;
* semantic validity;
* identity validity;
* relationship validity;
* serialization validity;
* consistency validity.

Validation results shall be explicit.

Invalid content shall not be silently normalized into valid content unless the transformation is documented and traceable.

---

# 18. Document Presentation Model

DPM represents document presentation and visual reconstruction.

It complements UDM.

It shall not replace UDM semantic structure.

DPM shall remain independent from one rendering framework.

---

# 19. DPM Ownership

DPM owns:

* presentation identity;
* presentation node types;
* pages;
* columns;
* regions;
* layout graph;
* reading flow;
* spatial relationships;
* typography;
* visual hierarchy;
* color;
* decoration;
* themes;
* asset mapping;
* anchor mapping;
* UDM mapping;
* presentation analysis;
* presentation reconstruction;
* serialization;
* validation.

DPM shall not own:

* canonical document meaning;
* business lifecycle;
* persistent file-system layout;
* UI widget hierarchy;
* operating-system window state.

---

# 20. DPM Core

DPM Core defines presentation-level concepts.

## 20.1 Presentation identity

Presentation identity shall remain distinct from semantic node identity where the concepts differ.

A semantic node may have:

* no presentation node;
* one presentation node;
* multiple presentation nodes.

The mapping shall be explicit.

## 20.2 Presentation node model

Every presentation node shall define:

* identity;
* type;
* bounds or layout role where relevant;
* relation to semantic content;
* style;
* hierarchy;
* serialization;
* validation.

## 20.3 Presentation attributes

Presentation attributes shall represent presentation semantics, not renderer-specific implementation properties.

---

# 21. DPM Layout

Layout documentation shall distinguish:

* logical hierarchy;
* spatial hierarchy;
* reading order;
* visual grouping;
* page structure;
* region structure.

## 21.1 Pages

Pages represent presentation units.

A page shall not automatically become a semantic document boundary.

## 21.2 Regions

Regions shall define bounded presentation areas and their relationships.

## 21.3 Columns

Columns shall represent layout structure without assuming one output technology.

## 21.4 Reading flow

Reading flow shall be explicit when visual order differs from semantic order.

## 21.5 Spatial relationships

Spatial relationships shall define semantics such as:

* above;
* below;
* beside;
* overlapping;
* contained;
* aligned;
* grouped.

They shall not rely on raw coordinates alone when semantic relationships are required.

---

# 22. DPM Mapping

Mappings connect DPM with other Domain concepts.

## 22.1 UDM mapping

The UDM-to-DPM mapping shall define:

* semantic source;
* presentation target;
* multiplicity;
* anchor behavior;
* unmapped content;
* generated presentation;
* presentation-only artifacts.

## 22.2 Asset mapping

Asset mapping shall preserve stable asset identity.

It shall not depend solely on local file paths.

## 22.3 Anchor mapping

Anchor mapping shall preserve references across:

* UDM;
* DPM;
* annotations;
* selections;
* navigation;
* synchronization;
* export.

Mapping ambiguity shall be detectable.

---

# 23. DPM Processing

DPM processing may include:

* layout analysis;
* classification;
* presentation reconstruction;
* reading-order detection;
* style extraction;
* region detection.

Processing results shall include:

* provenance;
* confidence where relevant;
* source;
* version;
* validation status.

Machine-generated presentation structure shall not be treated as perfect or authoritative without validation.

---

# 24. DPM Style

Style documentation shall separate:

* semantic style;
* visual style;
* theme;
* renderer behavior.

## 24.1 Typography

Typography shall represent:

* font role;
* family classification where relevant;
* size;
* weight;
* spacing;
* hierarchy;
* emphasis.

It shall not require one installed font unless explicitly defined as an implementation concern.

## 24.2 Color

Color shall define canonical representation and color-space assumptions where required.

## 24.3 Decorations

Decorations shall remain distinct from semantic meaning unless a mapping is explicitly defined.

## 24.4 Themes

Themes shall define reusable presentation policies.

A theme shall not modify underlying UDM semantics.

## 24.5 Visual hierarchy

Visual hierarchy shall describe presentation relationships such as prominence and grouping.

It shall not become a replacement for structural semantics.

---

# 25. DPM Serialization and Validation

DPM serialization shall preserve:

* presentation identity;
* node hierarchy;
* layout relationships;
* mapping to UDM;
* style;
* anchors;
* assets;
* versioning.

Validation shall verify:

* graph consistency;
* hierarchy consistency;
* mapping consistency;
* layout consistency;
* identity consistency;
* serialization compatibility.

---

# 26. UDM and DPM Separation

UDM and DPM shall remain separate but coordinated.

UDM answers:

> What does the document mean?

DPM answers:

> How is the document presented?

Agents shall not:

* place typography in UDM without semantic justification;
* place semantic relationships only in DPM;
* use DPM as the persistence model for canonical meaning;
* use UDM to encode renderer-specific coordinates;
* create duplicate identities without mapping rules.

Changes affecting the boundary between UDM and DPM require explicit review.

---

# 27. Knowledge Object

Knowledge Object is the managed aggregate through which KnowledgeOS treats a unit of knowledge.

A Knowledge Object may coordinate:

* source;
* canonical content;
* presentation;
* assets;
* metadata;
* provenance;
* versions;
* relationships;
* lifecycle.

Knowledge Object shall not duplicate the detailed internal semantics owned by UDM or DPM.

---

# 28. Knowledge Object Identity

A Knowledge Object shall have a stable identity independent from:

* title;
* filename;
* storage path;
* presentation;
* current version;
* synchronization location.

Identity rules shall remain consistent with:

```text
Identity/README.md
ADR-010-Document-Identity.md
```

---

# 29. Knowledge Object Metadata

Metadata shall distinguish:

* intrinsic metadata;
* source metadata;
* user metadata;
* derived metadata;
* operational metadata.

Metadata definitions shall specify:

* ownership;
* mutability;
* provenance;
* validation;
* serialization;
* conflict behavior.

Derived metadata shall not silently overwrite user-authored metadata.

---

# 30. Knowledge Object Provenance

Provenance shall record enough information to understand:

* origin;
* acquisition;
* transformations;
* responsible actor;
* tool or model;
* time;
* source version;
* confidence where relevant.

Provenance shall remain appendable and auditable.

Historical provenance shall not be rewritten to simplify current state.

---

# 31. Knowledge Object Sources

Source documentation shall distinguish:

* original source;
* imported copy;
* external reference;
* synchronized source;
* derived source;
* generated source.

Source identity shall remain independent from temporary accessibility.

A missing external source shall not invalidate already preserved knowledge.

---

# 32. Knowledge Object Assets

Assets shall have:

* stable identity;
* media type;
* checksum where required;
* provenance;
* storage reference;
* lifecycle;
* integrity status.

Assets shall not be identified only by filename.

Asset storage belongs to implementation.

Asset semantics belong to Domain.

---

# 33. Knowledge Object Relationships

Relationships shall define:

* relationship type;
* source;
* target;
* direction;
* provenance;
* author;
* confidence where relevant;
* lifecycle;
* validation.

User-authored, imported and inferred relationships shall remain distinguishable.

---

# 34. Knowledge Object Versioning

Versioning shall distinguish:

* content version;
* metadata version;
* presentation version;
* asset version;
* relationship version;
* synchronization revision;
* storage revision.

One generic version number shall not be assumed sufficient for every purpose.

Version history shall preserve traceability.

---

# 35. Knowledge Object Lifecycle

Lifecycle shall define valid states and transitions.

Potential lifecycle dimensions may include:

* acquired;
* processing;
* available;
* modified;
* archived;
* deleted;
* recovering;
* conflicted.

The authoritative lifecycle shall remain in `KnowledgeLifecycle.md` and related documents.

Agents shall not introduce lifecycle states in implementation without updating Domain documentation.

---

# 36. LifecycleMapping.md

`KnowledgeObject/LifecycleMapping.md` shall define how Knowledge Object lifecycle maps to:

* UDM state;
* DPM state;
* asset state;
* processing state;
* persistence state;
* synchronization state.

Mappings shall not collapse distinct concerns without explicit rationale.

---

# 37. Identity

Identity is a cross-cutting Domain responsibility.

Identity documentation shall define:

* identity scopes;
* identity types;
* generation;
* persistence;
* comparison;
* aliasing;
* migration;
* collision behavior;
* synchronization;
* version interaction.

Identity shall not be implementation-generated differently by each module.

---

# 38. Identity Rules

Agents shall preserve the following identity rules.

## 38.1 Stability

Identity shall survive changes to mutable properties.

## 38.2 Uniqueness

Uniqueness scope shall be explicit.

## 38.3 Portability

Identity shall survive export and import where required.

## 38.4 Synchronization safety

Identity shall support conflict detection and merging.

## 38.5 Version distinction

Object identity and version identity shall not be conflated.

## 38.6 Alias support

When multiple identifiers refer to the same conceptual object, alias behavior shall be explicit.

## 38.7 No path identity

A storage path shall not be the sole canonical identity of a Domain object.

---

# 39. Knowledge Graph

Knowledge Graph defines relationships among Knowledge Objects and related semantic entities.

It shall support:

* explicit relationships;
* semantic relationships;
* inferred relationships;
* provenance;
* ontology;
* traversal;
* reasoning;
* confidence;
* lifecycle.

The graph shall not become an ungoverned store of arbitrary links.

---

# 40. Knowledge Graph Authority

The Knowledge Graph owns cross-object graph semantics.

UDM Graph owns document-model graph semantics.

The boundary shall remain explicit.

Agents shall not duplicate the same relationship model independently in both areas.

When one relationship exists at multiple scopes, the mapping shall be documented.

---

# 41. Explicit and Inferred Knowledge

Knowledge Graph shall distinguish:

* user-authored facts;
* imported facts;
* system-derived facts;
* AI-inferred facts;
* recommendations;
* hypotheses.

Inferred knowledge shall record:

* evidence;
* inference method;
* model or algorithm;
* confidence;
* creation time;
* invalidation conditions.

Inference shall never be indistinguishable from confirmed knowledge.

---

# 42. Knowledge Lifecycle

`KnowledgeLifecycle.md` defines the canonical lifecycle of knowledge within KnowledgeOS.

It shall describe relevant transitions from:

```text
Acquisition
    ↓
Ingestion
    ↓
Processing
    ↓
Validation
    ↓
Availability
    ↓
Use and enrichment
    ↓
Versioning
    ↓
Synchronization
    ↓
Preservation or archival
```

The exact approved lifecycle shall remain authoritative.

Lifecycle documentation shall define:

* state ownership;
* transition triggers;
* validation;
* failure;
* retry;
* recovery;
* provenance;
* cancellation;
* terminal states.

---

# 43. Domain Mapping Rules

Mappings between Domain models shall be explicit.

Relevant mappings include:

* Knowledge Object to UDM;
* Knowledge Object to DPM;
* UDM to DPM;
* UDM to Knowledge Graph;
* assets to nodes;
* annotations to anchors;
* versions to identity;
* sources to provenance;
* lifecycle to processing.

A mapping shall define:

* source;
* target;
* cardinality;
* ownership;
* loss behavior;
* synchronization behavior;
* validation.

Implicit mapping is prohibited when ambiguity may arise.

---

# 44. Domain Serialization Rules

Domain serialization shall preserve canonical semantics.

Each serialization specification shall define:

* schema identity;
* schema version;
* required properties;
* optional properties;
* extension fields;
* unknown fields;
* ordering;
* identifiers;
* references;
* cycles;
* compatibility;
* validation;
* migration.

Serialization formats shall not become the Domain model themselves.

---

# 45. Domain Validation Rules

Validation belongs to the model that owns the invariant.

Examples:

* UDM validation belongs to UDM;
* DPM validation belongs to DPM;
* Knowledge Object validation belongs to Knowledge Object;
* relationship validation belongs to the owning graph model;
* identity validation belongs to Identity.

Agents shall not centralize unrelated validation merely for implementation convenience.

Validation rules shall define:

* rule identifier;
* scope;
* severity;
* failure meaning;
* recoverability;
* diagnostic information.

---

# 46. Consistency Rules

Consistency rules verify relationships across multiple parts of one model or across Domain models.

Examples include:

* every referenced node exists;
* every anchor resolves;
* every asset reference resolves;
* every presentation mapping refers to valid UDM content;
* every relationship uses valid endpoints;
* every version references the correct object identity;
* every lifecycle transition is valid.

Consistency checking shall be deterministic where practical.

---

# 47. Domain Evolution

Domain evolution shall preserve long-term compatibility.

Changes shall be classified as:

* additive;
* clarifying;
* deprecating;
* breaking;
* migratory.

## 47.1 Additive changes

Additive changes shall not alter existing meaning.

## 47.2 Deprecation

Deprecated concepts shall define:

* replacement;
* transition period;
* migration;
* compatibility;
* removal criteria.

## 47.3 Breaking changes

Breaking Domain changes require:

* ADR review;
* schema versioning;
* migration design;
* compatibility analysis;
* implementation impact analysis;
* synchronization impact analysis;
* export and import impact analysis.

---

# 48. Extension Mechanisms

Extensibility shall use explicit extension points.

Agents shall not add arbitrary fields or types without defining:

* namespace;
* ownership;
* validation;
* serialization;
* compatibility;
* collision behavior;
* security implications.

Plugin extensions shall remain distinguishable from canonical Domain concepts.

An extension shall not silently become part of the core model.

---

# 49. Domain Error Semantics

Domain errors shall represent semantic failures.

Examples include:

* invalid identity;
* invalid transition;
* invalid relationship;
* unresolved reference;
* inconsistent model;
* unsupported type;
* incompatible version;
* provenance violation.

Domain errors shall not contain transport-specific or UI-specific semantics.

Error ownership shall remain with the model whose rule was violated.

---

# 50. Domain Security and Privacy

Domain models shall support privacy and security without depending on one implementation.

Relevant concepts may include:

* access classification;
* sensitivity;
* ownership;
* sharing policy;
* consent;
* redaction state;
* provenance visibility.

Sensitive semantic data shall not be implicitly exposed through metadata, graph relationships, embeddings or derived representations.

---

# 51. AI-Derived Domain Data

AI may generate:

* classifications;
* summaries;
* embeddings;
* relationships;
* annotations;
* extracted entities;
* semantic suggestions.

AI-derived data shall record:

* model or provider;
* model version where available;
* prompt or operation identity where required;
* input provenance;
* creation time;
* confidence;
* validation state;
* user confirmation where applicable.

AI output shall not silently overwrite authoritative user knowledge.

---

# 52. Cross-Layer Impact

Domain changes frequently affect multiple architecture areas.

## 52.1 UDM changes

Review:

```text
04-Platform/Import/
04-Platform/Export/
04-Platform/Render/
04-Platform/Search/
04-Platform/Annotation/
04-Platform/Knowledge/
05-Integration/DataExchange/
05-Integration/Storage/
05-Integration/Synchronization/
06-Execution/
01-Implementation/
```

## 52.2 DPM changes

Review:

```text
04-Platform/Render/
04-Platform/Import/
04-Platform/Export/
04-Platform/Annotation/
01-Implementation/02-DesktopApplication/
```

## 52.3 Identity changes

Review:

```text
ADR-010
ADR-013
Storage
Synchronization
Persistence
Contracts
Migration
Testing
```

## 52.4 Knowledge Graph changes

Review:

```text
Knowledge Engine
Search Engine
AI Engine
Plugin SDK
Public API
Persistence
Privacy
```

## 52.5 Lifecycle changes

Review:

```text
Kernel Workflow Engine
Job System
Execution Runtime
Reliability
Synchronization
Implementation state models
Recovery tests
```

---

# 53. Domain Review Checklist

Before approving a Domain change, verify:

* the concept belongs in Domain;
* the concept does not already exist;
* terminology is canonical;
* ownership is explicit;
* identity is defined;
* lifecycle is defined where required;
* serialization is defined where required;
* validation is defined;
* provenance is preserved;
* UDM and DPM remain separated;
* Knowledge Object remains coherent;
* Knowledge Graph impact was reviewed;
* technology independence is preserved;
* mappings are explicit;
* compatibility is understood;
* migration is understood;
* related ADRs were reviewed;
* Platform impact was reviewed;
* Integration impact was reviewed;
* implementation impact was reviewed;
* diagrams were reviewed.

---

# 54. Minimum Change Rule

Agents shall make the smallest complete Domain change.

They shall not:

* restructure UDM casually;
* merge UDM and DPM;
* create parallel node models;
* create module-specific identities;
* replace canonical terminology for readability;
* introduce speculative types;
* add fields without ownership;
* change serialization without version analysis;
* change lifecycle without transition analysis;
* change graph semantics without provenance analysis.

---

# 55. Domain Completion Criteria

Domain work is complete only when:

* the semantic objective is explicit;
* the correct model owns the concept;
* identity implications are resolved;
* lifecycle implications are resolved;
* serialization is updated where required;
* validation is updated;
* mappings are updated;
* provenance is preserved;
* no duplicate concept exists;
* UDM remains coherent;
* DPM remains coherent;
* Knowledge Object remains coherent;
* Knowledge Graph remains coherent;
* related ADRs are addressed;
* affected Platform Engines are identified;
* affected integrations are identified;
* affected implementations are identified;
* compatibility is documented;
* migration is documented when required;
* no unresolved contradiction remains.

---

# 56. Agent Reporting

After Domain work, the agent shall report:

* the Domain objective;
* the authoritative model changed;
* files reviewed;
* files created;
* files modified;
* identity impact;
* lifecycle impact;
* serialization impact;
* validation impact;
* UDM impact;
* DPM impact;
* Knowledge Object impact;
* Knowledge Graph impact;
* Platform impact;
* Integration impact;
* implementation impact;
* ADR impact;
* compatibility impact;
* unresolved risks.

---

# 57. Final Rule

The Domain is the meaning of KnowledgeOS.

It shall remain stable, explicit and independent from technology.

Before adding a concept, determine who owns it.

Before changing a model, review every mapping that depends on it.

Before changing identity, understand synchronization and versioning.

Before changing serialization, understand compatibility and migration.

Before accepting AI-derived semantics, preserve provenance and uncertainty.

A Domain change is complete only when the entire semantic system remains coherent.

---

# End of `00-Architecture/02-Domain/AGENTS.md`
