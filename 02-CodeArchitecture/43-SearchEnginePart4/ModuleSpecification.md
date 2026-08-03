# Module Specification — 43-SearchEnginePart4

**Project:** KnowledgeOS  
**Documentation version:** 5.6.3  
**Status:** Consolidated  
**Subsystem:** Search Engine

## Mission

This module exists to build the offline-first lexical, structured, fuzzy, semantic, hybrid, embedding, and graph-aware retrieval pipeline used by Library, AI, Reader, Workspace, plugins, and MCP. It converts the focused documents in this directory into one coherent engineering contract and establishes the minimum guarantees that all implementations must preserve.

## Boundaries

The module owns the contracts, state transitions, persistence semantics, recovery behavior, and verification obligations described by its documents. It does not own presentation UI, authenticated identity issuance, or another engine's authoritative state. Cross-module communication uses typed contracts, events, batches, queries, or projections.

## Governing invariants

1. Search results are owner-scoped and never accept identity from untrusted query payloads.
2. Indexing is incremental, repeatable, and safe to retry after interruption.
3. Ranking is deterministic for identical index state, query, profile, and configuration.
4. Every nontrivial score contribution can be explained to callers when explanation is requested.
5. Semantic and graph stages may degrade independently without blocking lexical availability.

## Runtime model

The runtime normalizes and compiles the query, selects retrieval stages, executes them under budgets, fuses ranked lists, applies personalization and reranking, creates snippets, and returns an explainable response. Every public operation validates identity and compatibility, performs bounded work, persists durable state, verifies the result, and only then publishes acknowledgement.

## Persistence model

SQLite FTS5 stores lexical indexes; ordinary SQLite tables store parsed queries, vectors, graph projections, embedding jobs, leases, model versions, and stale-state metadata. Storage schemas are implementation details; composite owner keys, unique sequences, and version checks are architectural requirements.

## Package traceability

| Package | Role |
|---|---|
| `packages/search-domain` | Implementation or adapter participating in Search Engine. |
| `packages/search-index` | Implementation or adapter participating in Search Engine. |
| `packages/search-sqlite` | Implementation or adapter participating in Search Engine. |
| `packages/search-query` | Implementation or adapter participating in Search Engine. |
| `packages/search-query-sqlite` | Implementation or adapter participating in Search Engine. |
| `packages/search-ranking` | Implementation or adapter participating in Search Engine. |
| `packages/search-fuzzy` | Implementation or adapter participating in Search Engine. |
| `packages/search-embedding` | Implementation or adapter participating in Search Engine. |
| `packages/search-vector-sqlite` | Implementation or adapter participating in Search Engine. |
| `packages/search-hybrid` | Implementation or adapter participating in Search Engine. |
| `packages/search-embedding-jobs` | Implementation or adapter participating in Search Engine. |
| `packages/search-embedding-jobs-sqlite` | Implementation or adapter participating in Search Engine. |
| `packages/search-embedding-worker` | Implementation or adapter participating in Search Engine. |
| `packages/search-graph` | Implementation or adapter participating in Search Engine. |
| `packages/search-graph-sqlite` | Implementation or adapter participating in Search Engine. |
| `packages/search-graph-runtime` | Implementation or adapter participating in Search Engine. |
| `packages/search-runtime` | Implementation or adapter participating in Search Engine. |
| `packages/search-production` | Implementation or adapter participating in Search Engine. |
| `packages/search-api` | Implementation or adapter participating in Search Engine. |

## Document map

- `CosineSimilarity.md` — vector normalization, cosine similarity, invalid vectors, thresholds, and deterministic ties.
- `DeterministicProvider.md` — the deterministic provider concern within the Search Engine subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `EmbeddingModel.md` — embedding contracts, dimensions, normalization, model identity, batching, caching, and failures.
- `EmbeddingProvider.md` — embedding contracts, dimensions, normalization, model identity, batching, caching, and failures.
- `HybridSearch.md` — lexical and semantic result fusion, missing stages, weighting, and fallback.
- `ModelVersioning.md` — model identity, dimension compatibility, migration, stale detection, and rollback.
- `NextStep.md` — implemented boundary, intentionally deferred capabilities, prerequisites, and compatibility constraints.
- `OfflineFirst.md` — offline behavior, local availability, deferred work, and reconnection guarantees.
- `README.md` — the r e a d m e concern within the Search Engine subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `ReciprocalRankFusion.md` — RRF constants, rank handling, duplicate identities, and explainability.
- `Testing.md` — unit, integration, property, failure-injection, persistence, concurrency, and end-to-end verification.
- `VectorStorage.md` — vector storage schema, serialization, dimensions, lookup, filtering, and migration.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass persistence integration tests where applicable, prove owner isolation, demonstrate retry idempotency, and exercise restart recovery at durable boundaries. Documentation and code changes that alter a listed invariant must be reviewed together.
