# Graph Architecture

**Project:** KnowledgeOS  
**Section:** Implementation / Knowledge Graph / 02-Architecture  
**Document:** GraphArchitecture  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the graph architecture for the Knowledge Graph implementation, covering graph layers, projection, queries, indexes, storage and versioning.

## 2. Module Boundary

This module implements the graph projection and query capability over approved KnowledgeOS sources.

Included:

- canonical graph projection from UDM and Knowledge Objects;
- Personal Knowledge graph projection;
- derived semantic relationships;
- external references;
- ontology mappings;
- graph persistence and indexes;
- incremental updates;
- invalidation and rebuild;
- graph queries;
- hybrid search integration;
- embedding integration;
- AI-assisted derived reasoning;
- contracts, workflows, tests and operations.

Excluded:

- canonical UDM or DPM generation;
- source import and acquisition;
- annotation editing;
- Personal Knowledge synchronization transport;
- search-index ownership outside graph-specific indexes;
- AI provider business policy;
- plugin lifecycle.

## 3. Architectural Context

```text
Knowledge Objects + UDM + Personal Knowledge + External References
                              │
                              ▼
                    Versioned Projection Rules
                              │
                              ▼
                     Layered Knowledge Graph
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
       Graph Queries     Hybrid Search    AI / Reasoning
```

The graph is a projection. It is not the canonical source of documentary or Personal Knowledge.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Graph persistence SHALL remain derived and rebuildable from authoritative sources.
- Canonical, Personal, Derived and External graph layers SHALL remain distinguishable.
- UDM and Knowledge Objects SHALL remain authoritative for source-backed publication semantics.
- Personal relationships SHALL remain user-owned and SHALL NOT be written to the Master Library.
- AI, similarity and heuristic relationships SHALL remain derived until explicitly accepted.
- Projection SHALL reuse stable Domain identities whenever available.
- Every graph edge SHALL preserve type, endpoints, authority, provenance and version.
- Equivalent inputs and projection rules SHALL produce an equivalent graph.
- Incremental updates SHALL be idempotent.
- Graph storage technology SHALL NOT define Domain identity or authority.
- Projection failures SHALL NOT modify canonical UDM, DPM or Knowledge Objects.
- Query results SHALL expose authority and provenance when relevant.
- Privacy filtering SHALL occur before graph results are returned.
- Graph deletion or corruption SHALL be recoverable by rebuilding projections.

## 6. Layer Model

| Layer | Source | Authority |
|---|---|---|
| Canonical | UDM, Knowledge Objects, source-backed metadata | publication/domain authority |
| Personal | annotations, notes, collections, personal relationships | user |
| Derived | embeddings, rules, ML and AI inference | processor |
| External | DOI, ORCID, Wikidata and other namespaces | external authority |
| Operational | cursors, checkpoints and indexes | no Domain authority |

Layers MAY be queried together but SHALL remain distinguishable in storage, contracts and results.

## 7. Projection Model

Every projection run SHOULD record:

- projection identity;
- projection-rule version;
- input identities and versions;
- source authority layer;
- output vertex and edge identities;
- processor version;
- configuration fingerprint;
- stage outcomes;
- checkpoints;
- validation findings;
- timestamps;
- invalidation dependencies.

Projection SHALL be deterministic and idempotent for fixed inputs and versions.

## 8. Persistence and Indexes

The implementation MAY use:

- adjacency indexes;
- property-graph storage;
- relational graph tables;
- vector indexes;
- materialized traversal views;
- temporal indexes;
- ontology indexes.

These are implementation choices.

All graph persistence SHALL remain replaceable and rebuildable. Public contracts SHALL use Domain identities and DTOs rather than provider-specific graph types.

## 9. Query Model

Queries MAY support:

- direct relationship lookup;
- neighborhood traversal;
- bounded path search;
- temporal filtering;
- authority filtering;
- ontology expansion;
- external-identity resolution;
- hybrid lexical, graph and vector search.

Every query SHALL declare or default explicitly:

- authority layers;
- maximum depth;
- maximum result count;
- pagination;
- temporal context;
- consistency level;
- inclusion of derived relationships.

## 10. Failure and Recovery

The module SHALL handle:

- invalid projection inputs;
- missing identities;
- incompatible rule versions;
- storage failure;
- partial incremental update;
- stale vector index;
- checkpoint incompatibility;
- provider outage;
- failed rebuild;
- graph corruption;
- query timeout;
- unauthorized Personal Knowledge access.

Recovery SHOULD rebuild affected projections and indexes from authoritative inputs.

Prior valid projections MAY remain available with explicit staleness status.

## 11. Security and Privacy

- Personal graph data SHALL remain user-owned.
- Personal relationships SHALL not be written to Master Library persistence.
- Queries SHALL enforce authorization before traversal.
- Remote AI or embedding providers SHALL receive only authorized minimum data.
- Logs SHALL not contain publication text, Personal Knowledge or secrets.
- External identifiers SHALL be validated as untrusted input.
- Graph exports SHALL preserve authority and privacy scope.
- High-cardinality identities SHALL not be emitted as metric labels by default.

## 12. Performance and Resource Management

The implementation SHOULD:

- apply incremental updates where safe;
- batch projection writes;
- bound traversal depth and result size;
- separate interactive queries from large rebuild jobs;
- control vector-index memory;
- support partitioned rebuild;
- expose queue depth and projection lag;
- avoid blocking local reading and annotation;
- provide backpressure;
- use deterministic merge rules for parallel projection.

## 13. Verification and Acceptance

- The same inputs and projection version produce an equivalent graph.
- Incremental replay does not duplicate vertices or edges.
- Canonical, Personal, Derived and External layers remain distinct.
- Personal relationships never enter the Master Library.
- AI and similarity edges remain derived.
- Graph storage can be deleted and rebuilt.
- Query results preserve identity, authority and provenance.
- Traversals are bounded and deterministic.
- Invalid inputs do not modify canonical sources.
- Provider failure does not change graph authority.
- Privacy and authorization tests pass.
- Recovery and rebuild tests pass.
- Architecture traceability is complete.

## 14. Traceability

- `00-Architecture/02-Domain/KnowledgeGraph/README.md`
- `00-Architecture/02-Domain/UDM/Graph/GraphModel.md`
- `00-Architecture/02-Domain/UDM/Graph/RelationshipModel.md`
- `00-Architecture/02-Domain/UDM/Graph/Ontology.md`
- `00-Architecture/02-Domain/KnowledgeObject/Relationships.md`
- `00-Architecture/04-Platform/Knowledge/README.md`
- `00-Architecture/04-Platform/Search/README.md`
- `00-Architecture/04-Platform/AI/README.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/03-Kernel/JobSystem.md`
- `01-Implementation/09-KnowledgeProcessingPipeline/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 15. Compatibility and Migration

Projection rules, graph schemas, indexes, manifests, checkpoints and public contracts SHALL be versioned.

Breaking changes require migration or complete rebuild policy. Derived graph persistence MAY be discarded; Domain identity, authority and provenance SHALL remain unchanged.

## 16. Status

This document is part of the KnowledgeOS Knowledge Graph V4 implementation baseline.
