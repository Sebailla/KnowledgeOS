# Readme

**Project:** KnowledgeOS  
**Code Architecture module:** `47-SearchEnginePart8`  
**Subsystem:** Search Engine  
**Documentation version:** 5.6.4  
**Status:** Consolidated  
**Implemented by:** `packages/search-api`, `packages/search-bm25`, `packages/search-cache`, `packages/search-cli`, `packages/search-domain`, `packages/search-embedding`, `packages/search-embedding-jobs`, `packages/search-embedding-jobs-sqlite`, `packages/search-embedding-worker`, `packages/search-engine-composition`, `packages/search-execution-runtime`, `packages/search-fuzzy`

## Executive specification

This document governs the **Readme** concern within the Search Engine subsystem. It narrows the module-wide guarantees to the contracts, state, algorithms, and operational boundaries implied by this concern. It participates in the canonical processing flow: normalize query → plan stages → execute lexical/semantic/graph retrieval → fuse ranks → rerank → build snippets → stream or return response.

## Purpose and scope

The purpose of this specification is to make the implementation behavior reviewable without requiring readers to infer architecture from source code. It defines what the concern owns, what it explicitly excludes, how it participates in the subsystem lifecycle, and which compatibility guarantees must survive refactoring.

## Architectural context

KnowledgeOS is offline-first, user-owned, event-driven, and storage-independent at the domain boundary. The NAS Master Library is authoritative; local SQLite databases are durable offline projections and queues. Engines communicate through typed contracts, events, commands, queries, batches, and rebuildable projections rather than direct cross-package table access.

## Responsibilities and exclusions

The concern owns its typed inputs, deterministic domain decisions, durable boundaries, diagnostics, and verification obligations. It does not issue authenticated identity, own another engine’s source of truth, render presentation UI, or bypass Library and Kernel contracts. Provider-specific optimizations remain replaceable behind interfaces.

## Contracts and invariants

Inputs are validated before state mutation. Identifiers are stable, strings are normalized where required, sequences are monotonic within their declared scope, repeated delivery is safe, and acknowledgement follows durability. Errors are data with stable categories rather than unstructured log text.

## Processing model

Operations are divided into validation, planning, execution, persistence, publication, and acknowledgement. Each phase has an explicit failure boundary. Long-running work supports cancellation or leases, bounded concurrency, and durable restart points. Read paths never perform hidden writes except explicitly documented cache population.

## Persistence and concurrency

Repositories hide physical schemas. Optimistic versions or unique sequences prevent lost updates; transactions group logically atomic changes; outboxes or journals separate durable commit from asynchronous projection. Cache entries are non-authoritative and include sufficient tags or versions for precise invalidation.

## Security and privacy

Owner identity is supplied by a trusted host boundary. Payload identity is treated as untrusted. Secrets are never persisted in ordinary domain records or logs. Telemetry minimizes content, and exports or remote-provider calls follow explicit policy. Authorization is tested at every public entry point.

## Failure handling and recovery

Validation failures make no durable changes. Retryable infrastructure failures retain durable intent. Permanent incompatibilities are quarantined with diagnostics. Recovery reconstructs derived state from authoritative records, snapshots, journals, or source documents rather than attempting undocumented repair.

## Performance and operability

Work is bounded by item counts, byte limits, depth, time budgets, queue capacity, or token limits as appropriate. Metrics expose latency, throughput, queue depth, cache effectiveness, retries, conflicts, and degraded dependencies. Optimization cannot weaken determinism, owner isolation, or recovery.

## Testing and acceptance

Acceptance requires strict TypeScript compilation, unit tests for domain rules, persistence tests with real migrations where applicable, owner-isolation tests, deterministic-order tests, idempotency tests, cancellation or retry tests, and restart-recovery tests at durable boundaries.

## Evolution and compatibility

Compatible changes are additive or accompanied by explicit migration, reindex, replay, or reprocessing procedures. Stored representations include version or model identifiers where interpretation may evolve. Deprecated contracts remain readable for a documented window and never silently reinterpret historical data.

## Related implementation

The implementation is distributed across packages listed in the module specification and their tests. Package names provide traceability, not permission to couple directly to internal files. Architectural behavior is governed by contracts and invariants in this directory.

## Module-specific invariants

1. Every query and indexed record is scoped to an authenticated owner or library boundary.
2. Identical index state, query, ranking profile, and configuration produce deterministic ordering.
3. Lexical search remains available when semantic or graph stages are unavailable or exceed their budgets.
4. Incremental indexing, cancellation, retries, and cache invalidation are idempotent.
5. Every score contribution and degraded stage can be explained without exposing private content.

## Traceability

- Governing module contract: [`ModuleSpecification.md`](./ModuleSpecification.md)
- Repository evidence: [`ImplementationStatus.md`](./ImplementationStatus.md)
- Context diagram: [`diagrams/Context.puml`](./diagrams/Context.puml)
- Primary sequence: [`diagrams/Sequence.puml`](./diagrams/Sequence.puml)
- Related packages: `packages/search-api`, `packages/search-bm25`, `packages/search-cache`, `packages/search-cli`, `packages/search-domain`, `packages/search-embedding`, `packages/search-embedding-jobs`, `packages/search-embedding-jobs-sqlite`, `packages/search-embedding-worker`, `packages/search-engine-composition`, `packages/search-execution-runtime`, `packages/search-fuzzy`


## Historical source content

The following material is preserved from the pre-consolidation document for traceability. It is subordinate to the normative sections above when wording conflicts.

# Search Engine — Part 8

**Project:** KnowledgeOS  
**Version:** 5.0  
**Status:** Release Candidate  

This block exposes the complete Search Engine through stable public integration contracts.
