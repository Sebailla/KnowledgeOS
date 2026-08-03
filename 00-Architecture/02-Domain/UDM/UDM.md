# Universal Document Model Specification

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** UDM  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

The Universal Document Model (UDM) defines the canonical, semantic and source-traceable representation of documentary knowledge inside KnowledgeOS. It is the stable domain contract between acquisition, processing, search, rendering, graph, annotation, synchronization, export and AI capabilities.

The UDM is not a file format, database schema, object-relational model or UI component hierarchy. It specifies meaning, identity, structure, relationships, provenance, time and authority independently of implementation technology.

## 2. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 3. Architectural Position

```text
Source Item
    │
    ▼
Acquisition and Preservation
    │
    ▼
Extraction / OCR / Parsing
    │
    ▼
Canonical UDM
    ├── DPM mapping
    ├── Knowledge Graph projection
    ├── Search and indexing
    ├── Accessibility
    ├── Export
    └── AI context construction
```

The source item remains immutable and authoritative as evidence of the acquired manifestation. The UDM becomes authoritative for the platform's semantic interpretation of that source version. Personal annotations, inferred relationships, embeddings and indexes remain separate authority layers.

## 4. Documentary Knowledge Model

KnowledgeOS distinguishes the following concepts:

- **Work:** an abstract intellectual creation.
- **Expression:** a language, revision, translation, adaptation or other intellectual realization of a Work.
- **Manifestation:** a publication or technical embodiment of an Expression.
- **Item:** one owned, acquired or observed instance of a Manifestation.
- **Source Item:** the immutable bytes, stream or physical reference acquired by KnowledgeOS.
- **UDM Document:** the canonical semantic interpretation derived from a specific source context.
- **Knowledge Object:** the persistent library-level aggregate that owns lifecycle, metadata, source and version relationships.
- **Personal Knowledge:** user-owned notes, annotations, highlights, links, decisions and interpretations.
- **Derived Artifact:** a rebuildable output such as an embedding, index, preview, inferred edge or transformed rendition.

UDM does not collapse these concepts. Identity and provenance preserve their distinctions.

## 5. Design Principles

### 5.1 Semantic First

Meaning SHALL take precedence over visual appearance. Visual layout belongs to the Document Presentation Model (DPM).

### 5.2 Source Preservation

The source SHALL remain immutable. UDM SHALL reference and interpret it, never overwrite it.

### 5.3 Stable Identity

Every canonical document, node, relationship and anchor SHALL have a stable opaque identity.

### 5.4 Determinism

Equivalent inputs processed under the same rules and processor versions SHALL yield semantically equivalent canonical output.

### 5.5 Explicit Authority

Source assertions, user assertions and machine-derived assertions SHALL remain distinguishable.

### 5.6 Rebuildable Derivations

Indexes, embeddings, graph projections and previews SHALL be removable and reproducible without loss of canonical knowledge.

### 5.7 Extensibility Without Redefinition

Extensions MAY add namespaced semantics but SHALL NOT weaken or redefine core invariants.

### 5.8 Long-Term Portability

The logical model SHALL remain independent of operating system, programming language, database and rendering framework.

## 6. Canonical Document Envelope

A canonical UDM document contains:

```text
UDMDocument
├── specificationVersion
├── documentId
├── documentVersion
├── knowledgeObjectRef
├── sourceRefs[]
├── provenance
├── metadata
├── rootNodeIds[]
├── nodes{}
├── relationships{}
├── anchors{}
├── assetRefs{}
├── typeRegistryRefs[]
├── validationManifest
└── extensionData{}
```

Maps are conceptual. Serialization MAY encode them differently, but semantic equivalence and deterministic order SHALL be preserved.

## 7. Node System

A node is the smallest independently identifiable semantic unit. Each node has one primary type, optional traits, attributes, provenance, temporal information, anchors and relationships.

UDM separates:

- structural nodes;
- block content nodes;
- inline nodes;
- semantic entity nodes;
- asset-reference nodes;
- annotation attachment references.

Containment forms an ordered acyclic hierarchy. Semantic relationships form a typed directed multigraph. These dimensions SHALL NOT be conflated.

## 8. Identity Model

Identities are opaque and immutable. A node identity is scoped by a document identity, while externally addressable references use a canonical URI form.

Identity SHALL survive serialization, synchronization, storage migration, compatible reprocessing, rendering and index reconstruction. Database row IDs, array indexes, filesystem paths and memory addresses SHALL NOT be domain identities.

When reprocessing splits, merges or replaces semantic entities, lineage SHALL preserve predecessor identities and evidence.

## 9. Type and Attribute System

Every node SHALL declare exactly one primary type. Types define allowed attributes, children, traits, relationships and validation rules.

Attributes are typed, namespaced values. Missing, unknown and explicit null are distinct states. Machine-generated values SHALL identify method, confidence and provenance.

Core type semantics are frozen within a major version. Extension types use globally unique namespaces and versioned schemas.

## 10. Relationship System

Relationships connect nodes, semantic entities, Knowledge Objects or external resources. Every relationship has identity, type, source, target, provenance, authority layer and optional evidence anchors.

Source-backed, personal and derived relationships MAY coexist, but SHALL remain distinguishable. Similarity, model inference and user confirmation are not equivalent assertions.

## 11. Provenance and Authority

Every source-derived semantic assertion SHALL trace to a source item, selector and processing activity. Every generated assertion SHALL identify its processor, model or rule version.

Authority layers include:

1. source-backed publication semantics;
2. curated canonical corrections;
3. personal user knowledge;
4. machine-derived suggestions;
5. external unresolved assertions.

Higher confidence SHALL NOT silently change authority.

## 12. Temporal Model

UDM distinguishes publication time, source event time, semantic event time, validity interval, acquisition time, processing time and version time.

Original temporal expressions SHALL be preserved when normalized. Precision and uncertainty SHALL be explicit. Processing timestamps SHALL NOT overwrite represented historical time.

## 13. Anchoring

Anchors connect semantic entities to stable positions in source items, UDM nodes, text ranges, media time ranges or DPM regions.

Selectors MAY use structural paths, quotations, offsets, checksums, page regions or composite strategies. Re-anchoring SHALL preserve original selectors and append resolution history.

## 14. Processing Model

Canonical processing follows controlled stages:

1. intake;
2. source validation;
3. format detection;
4. extraction;
5. structural analysis;
6. semantic classification;
7. asset resolution;
8. anchor construction;
9. canonical assembly;
10. normalization;
11. validation;
12. publication;
13. derived projection.

Stages SHALL be idempotent for identical inputs and versions. Failed stages SHALL NOT publish partial canonical state.

## 15. Validation Model

Validation covers envelope, schema, identity, typing, containment, ordering, references, relationships, provenance, authority, temporal consistency and extension compatibility.

Canonical publication requires no fatal, invalid or incomplete findings. Warnings MAY remain only when explicitly accepted and recorded.

Validators SHALL be deterministic and non-mutating.

## 16. Serialization

The logical model is encoding-neutral. JSON is the baseline interoperable encoding. Alternative encodings MAY be used when they preserve the same logical information.

Serialization SHALL preserve identities, ordering, provenance, authority, uncertainty and unknown optional extension data. References SHALL use identities, never positional indexes.

## 17. Versioning and Evolution

UDM distinguishes:

- specification version;
- schema version;
- canonical document version;
- source item version;
- processor version;
- extension version.

Compatible reprocessing SHOULD preserve semantic identities. Incompatible interpretation changes create a new canonical version and record lineage.

## 18. Relationship with DPM

UDM represents what content means. DPM represents how a manifestation or generated view is spatially and visually organized.

UDM SHALL NOT contain font size, coordinates, margins, CSS, themes, viewport state or pagination geometry. DPM MAY reference UDM identities and anchors. UDM SHALL NOT depend on DPM.

## 19. Relationship with Knowledge Objects

The Knowledge Object owns library lifecycle, source relationships, acquisitions, versions and authority scope. UDM is one canonical semantic representation associated with a Knowledge Object version.

A Knowledge Object MAY have multiple source items and UDM versions. UDM SHALL NOT own storage location, synchronization policy or user permissions.

## 20. Relationship with Personal Knowledge

Personal annotations and interpretations are separate user-owned entities. They attach to UDM through stable anchors and relationships but SHALL NOT mutate publication semantics.

An export package MAY combine both layers while preserving ownership and authority metadata.

## 21. Relationship with Knowledge Graph

The Knowledge Graph is a projection and integration view over UDM, Personal Knowledge and approved external entities. Graph persistence is derived and rebuildable.

Graph projection SHALL preserve identity, provenance and authority layers. A graph edge SHALL NOT become a canonical publication assertion merely because it is stored or frequently observed.

## 22. Conformance Classes

A conforming implementation MAY claim one or more classes:

- **UDM Reader:** reads and preserves supported UDM.
- **UDM Writer:** creates schema-valid UDM.
- **UDM Canonicalizer:** produces deterministic canonical form.
- **UDM Validator:** evaluates normative rules.
- **UDM Processor:** transforms source items into UDM.
- **UDM Extension Host:** preserves and validates namespaced extensions.

Claims SHALL state supported specification versions and extensions.

## 23. Core Invariants

**UDM-I001** — Every canonical document has exactly one immutable identity.

**UDM-I002** — Every node has exactly one primary type.

**UDM-I003** — Every non-root contained node has exactly one structural parent.

**UDM-I004** — Containment is acyclic and explicitly ordered.

**UDM-I005** — Every source-derived assertion has provenance.

**UDM-I006** — Personal Knowledge does not mutate canonical publication content.

**UDM-I007** — Derived artifacts remain distinguishable and rebuildable.

**UDM-I008** — UDM remains presentation-independent.

**UDM-I009** — Serialization round trips preserve semantic equivalence.

**UDM-I010** — Invalid models cannot become canonical published UDM.

**UDM-I011** — Identity is independent of storage and runtime representation.

**UDM-I012** — Extensions cannot override core semantics.

## 24. Non-Goals

UDM does not define:

- file acquisition protocols;
- NAS deployment;
- database schemas;
- synchronization transport;
- UI architecture;
- rendering implementation;
- search engine internals;
- AI provider selection;
- authoring application behavior;
- digital-rights enforcement.

## 25. Example

```json
{
  "specificationVersion": "4.0",
  "documentId": "udm-doc:01J...",
  "documentVersion": "1",
  "rootNodeIds": ["node:root"],
  "nodes": {
    "node:root": {
      "type": "document",
      "children": ["node:title", "node:p1"]
    },
    "node:title": {
      "type": "heading",
      "attributes": {"level": 1},
      "children": ["node:title-text"]
    },
    "node:title-text": {
      "type": "text",
      "attributes": {"text": "Example"}
    },
    "node:p1": {
      "type": "paragraph",
      "children": ["node:p1-text"]
    },
    "node:p1-text": {
      "type": "text",
      "attributes": {"text": "Canonical semantic content."}
    }
  }
}
```

This example is illustrative. The serialization contract defines exact field requirements.

## 26. Related Documents

- `README.md`
- `Core/Identity.md`
- `Core/NodeModel.md`
- `Core/TypeSystem.md`
- `Nodes/Anchors.md`
- `Graph/RelationshipModel.md`
- `Processing/ProcessingPipeline.md`
- `Serialization/Serialization.md`
- `Validation/ValidationRules.md`
- `../DPM/DPM.md`
- `../KnowledgeObject/KnowledgeObject.md`

## 27. Status

This specification is the rector document for the UDM V4 release candidate. Subordinate documents refine individual contracts and SHALL NOT contradict this document.
