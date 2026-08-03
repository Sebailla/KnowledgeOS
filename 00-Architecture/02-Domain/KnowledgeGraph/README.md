# Knowledge Graph

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Graph  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document defines the domain contract for the KnowledgeOS Knowledge Graph.

The Knowledge Graph provides a unified, queryable projection of relationships among canonical documentary knowledge, personal knowledge, external references and derived semantic interpretations.

It does not replace the Universal Document Model, Personal Knowledge, Knowledge Objects or source publications. It connects them while preserving identity, provenance and scoped authority.

## 2. Scope

This document defines:

- graph concepts;
- vertex and edge identity;
- graph layers;
- authority boundaries;
- projection;
- synchronization implications;
- temporal behavior;
- external references;
- reasoning;
- validation;
- rebuildability.

It does not define:

- a graph database;
- a query language implementation;
- a search index;
- an embedding engine;
- an AI provider;
- persistence topology;
- user-interface graph visualization.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Architectural Position

```text
Source Publications
        │
        ▼
      UDM
        │
        ├──────────────┐
        ▼              ▼
Canonical Graph   Derived Semantic Graph
        ▲              ▲
        │              │
Personal Knowledge ────┘
        │
        ▼
Personal Graph
```

The Knowledge Graph is a projection and integration domain.

The canonical sources remain:

- Master Library publications;
- UDM canonical semantic representations;
- Personal Knowledge;
- approved external references.

Graph persistence is derived and rebuildable.

## 5. Core Concepts

### 5.1 Vertex

A vertex represents a stable domain identity.

Vertices MAY represent:

- Knowledge Objects;
- UDM documents;
- UDM nodes;
- works;
- expressions;
- manifestations;
- source items;
- authors;
- organizations;
- places;
- events;
- concepts;
- claims;
- evidence;
- annotations;
- notes;
- collections;
- external resources.

A vertex SHALL reuse the authoritative domain identity whenever one exists.

### 5.2 Edge

An edge represents a typed relationship between two vertices.

Every edge contains:

- immutable identity;
- relationship type;
- source identity;
- target identity;
- direction;
- authority layer;
- provenance;
- evidence;
- confidence when inferred;
- validity interval when applicable;
- lifecycle state.

### 5.3 Graph Layer

KnowledgeOS separates graph information by authority.

| Layer | Meaning | Authority |
|---|---|---|
| Canonical | Source-backed publication semantics | Master Library / UDM |
| Personal | User-created relationships and interpretations | User |
| Derived | Machine-generated or rule-derived relationships | Processing component |
| External | Unresolved or referenced external knowledge | External namespace |
| Operational | Temporary execution and indexing information | No domain authority |

These layers MAY be queried together but SHALL NOT be collapsed.

## 6. Graph Model

The Knowledge Graph is a directed, typed, temporal multigraph.

```text
KnowledgeGraph
├── graphVersion
├── projectionProfile
├── vertices{}
├── edges{}
├── ontologyRefs[]
├── provenance
├── validationManifest
└── extensionData{}
```

Multiple edges MAY connect the same vertices when they differ by type, provenance, authority, evidence or temporal validity.

Containment in UDM is not replaced by graph edges. It MAY be projected for query convenience, but UDM remains canonical for document structure.

## 7. Identity

**KG-R001** — Every vertex MUST have a stable identity.

**KG-R002** — A graph projection MUST reuse authoritative identities rather than mint duplicates.

**KG-R003** — Every edge MUST have an immutable identity.

**KG-R004** — External identities MUST include a namespace.

**KG-R005** — Aliases MUST NOT be treated as identity equivalence without an explicit accepted mapping.

**KG-R006** — Split, merge and replacement operations MUST preserve lineage.

## 8. Relationship Categories

The baseline relationship categories are:

- structural;
- bibliographic;
- citation;
- semantic;
- evidential;
- causal;
- temporal;
- spatial;
- equivalence;
- provenance;
- personal;
- inferred;
- external mapping.

Each type SHALL declare:

- allowed source types;
- allowed target types;
- direction;
- symmetry;
- inverse semantics;
- multiplicity;
- authority constraints;
- validation rules.

## 9. Canonical Projection

Canonical projection converts UDM and Knowledge Object information into graph vertices and edges.

Projection SHALL be:

- deterministic;
- idempotent;
- versioned;
- provenance-preserving;
- authority-preserving;
- reversible to source references.

The same canonical inputs and projection profile SHALL produce an equivalent graph.

A canonical projection failure SHALL NOT modify UDM or Knowledge Objects.

## 10. Personal Graph

The Personal Graph contains user-created relationships such as:

- manually related items;
- collections;
- reading lists;
- conceptual maps;
- notes linked to publications;
- annotations linked to claims;
- personal classifications;
- learning paths.

Personal relationships belong to the user.

They MAY synchronize among Local Libraries through the approved personal-state synchronization profile.

They SHALL NOT be written to the NAS Master Library.

## 11. Derived Graph

The Derived Graph contains relationships generated by:

- deterministic rules;
- ontology reasoning;
- entity resolution;
- similarity analysis;
- embeddings;
- machine learning;
- AI models;
- recommendation systems.

Derived relationships MUST record:

- producing component;
- component version;
- input identities;
- configuration;
- model identity when applicable;
- confidence;
- execution timestamp;
- privacy profile.

Derived edges SHALL NOT become canonical automatically.

User confirmation normally creates Personal Knowledge rather than changing publication authority.

## 12. External Graph

External references MAY identify resources that are not managed by KnowledgeOS.

Examples include:

- DOI;
- ISBN;
- ORCID;
- Wikidata;
- PubMed;
- Crossref;
- GitHub;
- web URLs;
- external ontology identifiers.

External vertices SHALL preserve namespace and resolution status.

An unresolved external reference remains valid.

External availability SHALL NOT determine local graph validity.

## 13. Ontology

The Knowledge Graph uses the UDM ontology and approved extension ontologies.

Ontology concepts and predicates SHALL have stable identifiers.

Extensions SHALL:

- use unique namespaces;
- declare versions;
- define compatibility;
- preserve core semantics;
- avoid overriding core predicates.

Ontology mappings SHALL distinguish:

- exact match;
- close match;
- broader;
- narrower;
- related;
- unresolved candidate.

## 14. Temporal Behavior

Edges MAY include validity intervals.

The graph distinguishes:

- when a represented relationship was valid;
- when it was asserted;
- when it was acquired;
- when it was processed;
- when it was synchronized.

Processing time SHALL NOT overwrite semantic event time.

Historical edges MAY remain queryable after becoming inactive.

## 15. Synchronization

Only graph information belonging to Personal Knowledge participates in personal synchronization.

Canonical graph information is rebuilt from local acquired publications and UDM.

Derived graph information is regenerated according to local policy.

Publication acquisition and graph synchronization are separate operations.

The NAS Master Library SHALL NOT receive the Personal Graph.

## 16. Search and Query

Search and query engines MAY consume the Knowledge Graph.

The Domain does not prescribe a query language.

A query result SHALL preserve:

- vertex and edge identities;
- authority layer;
- provenance;
- confidence;
- temporal context.

Ranking SHALL NOT change graph authority.

## 17. Reasoning

Reasoning MAY derive additional edges or vertices.

Deterministic reasoning SHALL be reproducible for fixed inputs and rule versions.

Probabilistic or AI-assisted reasoning SHALL preserve uncertainty.

Conflicting derived conclusions MAY coexist.

A reasoning result without evidence or processing provenance is invalid.

## 18. Rebuildability

Graph databases, adjacency indexes, materialized views and caches are derived infrastructure.

They MUST be reconstructible from:

- UDM;
- Knowledge Objects;
- Personal Knowledge;
- approved external references;
- versioned projection rules.

Loss of graph infrastructure SHALL NOT imply loss of authoritative knowledge.

## 19. Validation

Validation SHALL verify:

- unique identities;
- endpoint resolution;
- relationship type compatibility;
- multiplicity;
- symmetry;
- inverse semantics;
- authority layer;
- provenance;
- evidence;
- temporal coherence;
- ontology compatibility;
- extension namespaces.

Invalid derived graph data MAY be discarded and regenerated.

Invalid Personal Knowledge SHALL be preserved for recovery when possible.

## 20. Core Invariants

**KG-I001** — Every edge has valid source and target identities.

**KG-I002** — Authority layers remain distinguishable.

**KG-I003** — Graph storage is not canonical knowledge.

**KG-I004** — Projection preserves domain identity.

**KG-I005** — Derived inference never becomes source fact automatically.

**KG-I006** — Personal relationships never enter the NAS Master Library.

**KG-I007** — Projection is deterministic and idempotent.

**KG-I008** — Provenance is mandatory.

**KG-I009** — External mappings preserve namespace.

**KG-I010** — Deleting a derived graph projection does not delete its sources.

## 21. Failure Handling

Graph projection failures SHALL be isolated from canonical persistence.

Unresolved vertices or edges MAY be represented when their unresolved status is explicit.

Relationship conflicts SHALL preserve alternatives and evidence.

Graph repair SHALL NOT invent missing authority or provenance.

## 22. Extension Model

Plugins MAY contribute:

- namespaced vertex types;
- namespaced relationship types;
- ontology mappings;
- projection rules;
- validators;
- query capabilities.

Extensions SHALL NOT:

- override core identity;
- bypass authority;
- modify UDM privately;
- write Personal Knowledge to the Master Library;
- introduce executable graph payloads.

## 23. Example

```text
Vertex: work:the-origin-of-species
Vertex: person:charles-darwin
Vertex: annotation:user-123-note-4

Edge:
  type: authoredBy
  source: work:the-origin-of-species
  target: person:charles-darwin
  layer: canonical
  provenance: source-metadata

Edge:
  type: personallyRelatedTo
  source: annotation:user-123-note-4
  target: work:the-origin-of-species
  layer: personal
  provenance: user-action
```

## 24. Related Documents

- `../UDM/Graph/GraphModel.md`
- `../UDM/Graph/RelationshipModel.md`
- `../UDM/Graph/Ontology.md`
- `../UDM/Graph/SemanticReasoning.md`
- `../KnowledgeObject/Relationships.md`
- `../KnowledgeObject/Provenance.md`
- `../Identity/README.md`
- `../../04-Platform/Search/README.md`
- `../../04-Platform/AI/README.md`
- `../../04-Platform/Sync/README.md`

## 25. Status

This document is the rector domain specification for the KnowledgeOS Knowledge Graph V4.
