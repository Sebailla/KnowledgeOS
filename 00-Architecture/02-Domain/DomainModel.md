# Domain Model

**Project:** KnowledgeOS  
**Section:** Domain  
**Document:** DomainModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document defines the complete conceptual domain model of KnowledgeOS.

It identifies the stable business concepts, aggregate boundaries, authority scopes, invariants and relationships that every other architectural layer SHALL preserve.

## 2. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 3. Domain Mission

KnowledgeOS manages documentary knowledge, personal knowledge and their relationships while preserving user ownership, source fidelity, offline operation and long-term portability.

The Domain expresses meaning and rules.

It SHALL NOT depend on:

- databases;
- operating systems;
- UI frameworks;
- storage engines;
- synchronization providers;
- AI providers;
- OCR providers;
- rendering technologies;
- deployment topology.

## 4. Top-Level Model

```text
Knowledge Space
├── Master Library
│   ├── Master Catalog
│   ├── Source Publications
│   ├── Master Metadata
│   └── Publication Versions
├── Local Libraries
│   ├── Local Sources
│   ├── Local Availability
│   ├── Acquired Publications
│   └── Derived Artifacts
├── Personal Knowledge
│   ├── Annotations
│   ├── Highlights
│   ├── Notes
│   ├── Collections
│   ├── Relationships
│   └── Reading State
├── Knowledge Objects
├── UDM
├── DPM
├── Knowledge Graph
└── Workspaces
```

`Knowledge Space` is a conceptual boundary, not a single storage aggregate.

## 5. Master Library

The Master Library is hosted by KnowledgeOS Server on the NAS.

It is authoritative for:

- Master Catalog;
- source publications;
- source items;
- master-source metadata;
- publication versions;
- publication availability;
- publication delivery.

It SHALL NOT store:

- personal annotations;
- highlights;
- bookmarks;
- reading progress;
- favorites;
- personal tags;
- personal relationships;
- personal AI artifacts;
- equivalent private user state.

The Master Library is not a personal synchronization peer.

## 6. Local Libraries

Each client device owns one selective Local Library.

A Local Library MAY be populated through:

- user-authorized device scanning;
- manual import;
- explicit acquisition from the Master Library;
- approved external integrations.

A Local Library:

- contains only locally available publications;
- operates offline;
- stores local source items;
- stores local derived artifacts;
- stores or materializes Personal Knowledge required by that device;
- is not a replica of the Master Library.

Different devices MAY contain different publications.

## 7. Personal Knowledge

Personal Knowledge is user-created or user-owned information associated with publications and concepts.

It includes:

- annotations;
- highlights;
- notes;
- bookmarks;
- reading progress;
- personal tags;
- collections;
- favorites;
- drawings;
- personal relationships;
- personal AI conversations and summaries.

Personal Knowledge synchronizes only among approved Local Libraries through the personal synchronization profile.

It SHALL NOT be written to the NAS Master Library.

## 8. Knowledge Object

A Knowledge Object is the persistent aggregate through which KnowledgeOS manages one unit of knowledge.

It coordinates:

- stable identity;
- metadata;
- sources;
- assets;
- provenance;
- relationships;
- versions;
- UDM;
- DPM;
- lifecycle.

A Knowledge Object is not a file.

A file is a source item.

## 9. Universal Document Model

UDM is the canonical semantic representation of documentary knowledge.

It owns:

- semantic structure;
- semantic nodes;
- typed attributes;
- source anchors;
- semantic relationships;
- semantic provenance;
- temporal meaning.

UDM SHALL remain independent from presentation and rendering.

## 10. Document Presentation Model

DPM is the canonical presentation representation.

It owns:

- pages;
- regions;
- coordinate spaces;
- visual composition;
- reading flows;
- typography;
- styles;
- spatial relationships;
- mappings to UDM.

DPM SHALL NOT redefine UDM semantics.

## 11. Knowledge Graph

The Knowledge Graph is a layered, queryable projection connecting:

- canonical documentary semantics;
- Knowledge Objects;
- Personal Knowledge;
- derived semantic relationships;
- external references.

Graph storage is derived and rebuildable.

Authority layers SHALL remain distinguishable.

## 12. Identity

Every persistent domain entity SHALL have a stable, opaque identity.

Identity SHALL be independent of:

- file paths;
- filenames;
- database rows;
- local device storage;
- runtime objects;
- synchronization sessions;
- provider identifiers.

Entity identity and version identity are distinct.

## 13. Authority Model

Authority is scoped.

| Scope | Authority |
|---|---|
| Master Catalog | NAS KnowledgeOS Server |
| Source Publications | NAS KnowledgeOS Server |
| Master Metadata | NAS KnowledgeOS Server |
| Local Availability | Local Library |
| Unsynchronized Personal Changes | Originating Device |
| Personal Convergence | Sync Engine |
| Derived Artifacts | No canonical authority |
| External References | External namespace |

No two components SHALL claim authority over the same scope.

## 14. Acquisition

Publication acquisition is explicit.

```text
Browse Master Catalog
    ↓
Select Publication
    ↓
Acquire Payload
    ↓
Validate
    ↓
Register Locally
    ↓
Process
    ↓
Available Offline
```

Acquisition is not synchronization.

Synchronization SHALL NOT silently acquire publication payloads.

## 15. Synchronization

Personal synchronization converges user-owned state among Local Libraries.

```text
Personal Change
    ↓
Local Commit
    ↓
Pending Sync
    ↓
iCloud / CloudKit Profile
    ↓
Other Local Libraries
```

The Master Library SHALL NOT participate.

Publication payloads SHALL NOT move through personal synchronization.

## 16. Aggregate Boundaries

The principal aggregates are:

- Knowledge Object;
- Master Catalog Entry;
- Local Acquisition;
- Personal Annotation;
- Personal Collection;
- Personal Relationship;
- Workspace;
- Durable Workflow.

Aggregate boundaries SHALL preserve independent authority and transaction scope.

## 17. Domain Events

Core domain events include:

- `PublicationDiscovered`;
- `PublicationRegistered`;
- `PublicationVersionPublished`;
- `PublicationAcquisitionRequested`;
- `PublicationAcquired`;
- `PublicationRemovedLocally`;
- `PersonalKnowledgeCreated`;
- `PersonalKnowledgeModified`;
- `PersonalStateSynchronized`;
- `PersonalStateConflictDetected`;
- `PersonalStateMerged`;
- `CanonicalUDMPublished`;
- `CanonicalDPMPublished`;
- `DerivedArtifactInvalidated`.

Events SHALL follow committed domain state.

## 18. Domain Invariants

**DM-I001** — User ownership is preserved.

**DM-I002** — Master and Local Libraries are not replicas.

**DM-I003** — Acquisition and synchronization are separate.

**DM-I004** — Personal Knowledge never enters the Master Library.

**DM-I005** — Knowledge Object identity is immutable.

**DM-I006** — Source items remain traceable.

**DM-I007** — UDM and DPM remain separate.

**DM-I008** — Derived artifacts remain rebuildable.

**DM-I009** — Authority is explicit.

**DM-I010** — Domain concepts remain technology-independent.

**DM-I011** — Published versions are immutable.

**DM-I012** — Retries are idempotent where operations may repeat.

## 19. Non-Goals

The Domain does not define:

- database schemas;
- network protocols;
- Swift types;
- CloudKit record layouts;
- PostgreSQL tables;
- file-system directories;
- rendering frameworks;
- AI-provider APIs;
- UI navigation.

## 20. Related Documents

- `KnowledgeLifecycle.md`
- `EngineResponsibilities.md`
- `KnowledgeObject/README.md`
- `UDM/README.md`
- `DPM/README.md`
- `KnowledgeGraph/README.md`
- `Identity/README.md`
- `../01-Foundation/ArchitectureModel.md`
- `../07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

## 21. Status

This document is the rector specification for the KnowledgeOS Domain V4.
