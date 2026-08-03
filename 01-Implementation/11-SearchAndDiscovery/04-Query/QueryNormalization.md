# Query Normalization

**Project:** KnowledgeOS  
**Section:** Implementation / Search and Discovery / 04-Query  
**Document:** QueryNormalization  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the query normalization for Search and Discovery, covering query parsing, lexical, semantic, graph and hybrid execution.

## 2. Module Boundary

This module implements search and discovery across approved KnowledgeOS scopes.

Included:

- Local Library search;
- Master Catalog search;
- Personal Knowledge search;
- Knowledge Graph traversal integration;
- lexical search;
- semantic and vector search;
- hybrid search;
- filters and facets;
- ranking;
- highlighting;
- result navigation;
- indexing, invalidation and rebuild;
- desktop, mobile and web integration;
- contracts, tests and operations.

Excluded:

- source acquisition;
- canonical UDM or DPM generation;
- graph authority;
- annotation editing;
- Personal Knowledge synchronization;
- AI provider policy;
- export;
- plugin lifecycle.

## 3. Architectural Context

```text
Authoritative and Personal Sources
├── Local Library
├── Master Catalog
├── Personal Knowledge
└── Knowledge Graph
          │
          ▼
      Derived Indexes
├── Lexical
├── Structural
├── Graph
└── Vector
          │
          ▼
      Query Pipeline
          │
          ▼
 Ranked, Scoped, Traceable Results
```

Indexes and rankings are derived. They are not sources of truth.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Search indexes SHALL remain derived and rebuildable.
- Search SHALL preserve Knowledge Object, UDM node, annotation and relationship identities.
- Local Library, Master Catalog and Personal Knowledge scopes SHALL remain distinct.
- A query SHALL declare or resolve its search scopes explicitly.
- Ranking SHALL NOT change canonical meaning, identity or authority.
- Search results SHALL expose scope, authority and provenance when relevant.
- Local Library search SHALL remain available offline for locally indexed content.
- Master Catalog search SHALL remain separate from local availability.
- Personal Knowledge search SHALL enforce user ownership and privacy.
- Remote providers SHALL NOT receive unauthorized Personal Knowledge or publication content.
- Index updates and rebuilds SHALL be idempotent.
- Stale or incomplete indexes SHALL be identified explicitly.
- Query, ranking and index versions SHALL be observable.
- Search failure SHALL NOT modify Domain state.
- Queries SHALL be side-effect-free.
- Pagination SHALL use stable deterministic ordering.
- Unbounded queries SHALL be rejected or constrained.
- Scope and privacy filtering SHALL occur before result delivery.
- Query normalization SHALL preserve user intent and SHALL not fabricate terms.

## 6. Search Scope Model

Supported scopes include:

| Scope | Source | Offline |
|---|---|---|
| Local Library | local publications and canonical models | yes |
| Personal Knowledge | local annotations, notes, collections and history | yes when locally available |
| Master Catalog | NAS-hosted authoritative catalog | no |
| Knowledge Graph | local or server graph projection | profile-dependent |
| External Providers | approved external search integrations | no |

A combined search MAY aggregate scopes, but each result SHALL retain its origin and availability.

## 7. Query Pipeline

```text
Receive Query
→ Validate and Authorize
→ Resolve Scopes
→ Parse and Normalize
→ Execute Scope-Specific Search
→ Apply Filters
→ Normalize Scores
→ Aggregate
→ Rank
→ Highlight
→ Paginate
→ Return Results
```

Each stage SHALL be versioned or governed by a compatibility policy.

## 8. Result Model

A search result SHOULD include:

- result identity;
- target Domain identity;
- result type;
- scope;
- authority layer;
- availability;
- title and approved display metadata;
- snippet or highlight;
- anchor or navigation target;
- component scores;
- final ranking score;
- provenance;
- index version;
- staleness status.

Snippets SHALL respect privacy and content-access policy.

## 9. Failure and Degradation

The module SHALL handle:

- missing or corrupt local index;
- stale index;
- unavailable NAS;
- unavailable graph projection;
- unavailable vector index;
- provider timeout;
- incompatible index version;
- query timeout;
- authorization failure;
- malformed query;
- missing navigation target.

A combined query MAY return available scopes while identifying unavailable scopes explicitly.

Local reading and annotation SHALL not depend on search availability.

## 10. Security and Privacy

- Personal Knowledge search SHALL be user-scoped.
- Search history and preferences SHALL not enter the Master Library.
- Remote search providers SHALL receive minimum necessary authorized data.
- Publication text and Personal Knowledge SHALL not appear in logs or metrics.
- Snippets SHALL enforce access policy.
- Query telemetry SHALL use redacted or classified representations.
- High-cardinality Domain identities SHALL not be metric labels by default.
- Web and remote APIs SHALL enforce authentication and authorization.

## 11. Performance and Resource Management

The implementation SHOULD:

- use incremental indexing;
- batch updates;
- bound memory and disk usage;
- separate interactive queries from rebuild jobs;
- support cancellation;
- apply query timeouts;
- limit traversal depth and vector result counts;
- cache only rebuildable results;
- use stable pagination;
- expose query and indexing latency;
- prevent ranking or provider failures from blocking available scopes.

## 12. Verification and Acceptance

- Local Library search works offline.
- Master Catalog search does not imply acquisition.
- Personal Knowledge search is private and user-scoped.
- Combined results retain scope and authority.
- Fixed query and versions produce deterministic ordering.
- Index rebuild does not create duplicate entries.
- Index deletion does not delete knowledge.
- Stale indexes are explicit.
- Semantic and graph similarity remain derived.
- Unavailable NAS degrades only remote scopes.
- Result navigation resolves stable identities and anchors.
- Accessibility and keyboard navigation tests pass.
- Privacy, performance and recovery tests pass.
- Architecture traceability is complete.

## 13. Traceability

- `00-Architecture/04-Platform/Search/README.md`
- `00-Architecture/02-Domain/KnowledgeGraph/README.md`
- `00-Architecture/03-Kernel/QueryBus.md`
- `00-Architecture/03-Kernel/JobSystem.md`
- `00-Architecture/05-Integration/Providers/SearchProviders.md`
- `01-Implementation/09-KnowledgeProcessingPipeline/README.md`
- `01-Implementation/10-KnowledgeGraph/README.md`
- `01-Implementation/02-DesktopApplication/README.md`
- `01-Implementation/03-MobileApplication/README.md`
- `01-Implementation/04-WebApplication/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 14. Compatibility and Migration

Index schemas, ranking profiles, query contracts, result DTOs, preferences and manifests SHALL be versioned.

Derived indexes and caches MAY be invalidated and rebuilt. Personal search history or preferences SHALL be migrated or preserved according to policy.

## 15. Status

This document is part of the KnowledgeOS Search and Discovery V4 implementation baseline.
