# Changelog

## 5.7.0

- Added local Master Library PDF/EPUB intake with reviewable metadata provenance.
- Added local OCR fallback, a first-page PDF preview, and large-file streaming limits.
- Added protected persistent local-browser authentication and operational guidance.

## 5.6.5

- Completed the global audit of `02-CodeArchitecture`.
- Added the master index and technical glossary.
- Added architecture-to-code traceability.
- Added terminology and naming rules.
- Added documentation coverage metrics.
- Added engine interaction and documentation traceability diagrams.
- Validated Markdown links, placeholders, and PlantUML structure.

## 5.6.4

- Consolidated all Code Architecture modules 46–59.
- Added module specifications, implementation-status reports, and PlantUML context/sequence diagrams.
- Added the cross-engine interaction model.
- Preserved both distinct module 54 directories.
- Changed documentation only; runtime source and public contracts are unchanged.

## 5.6.3

- Consolidated `02-CodeArchitecture` modules 31–45.
- Expanded Local Library, Personal Knowledge, and Search Engine documentation.
- Added module specifications, implementation status reports, and PlantUML diagrams.
- Added code-to-document traceability without modifying runtime behavior.

## 5.6.2

- Consolidated Code Architecture modules 16–30.
- Rewrote existing technical documents as structured engineering specifications.
- Added module specifications and PlantUML component/sequence diagrams.
- Preserved historical content and runtime behavior.

## 5.6.1

- Audited the complete `02-CodeArchitecture` tree.
- Consolidated every Markdown document in modules `00–15`.
- Added module specifications, package traceability and PlantUML diagrams.
- Added a repository-wide documentation standard and detailed audit report.
- No runtime behavior or public code contracts were changed.

## 5.6.0

- Added the Sync Engine.
- Added replica-scoped changes, cursors and deterministic batches.
- Added conflict detection and initial resolution policy.
- Added transport, SQLite persistence and offline-first runtime.
- Added Library event integration.

## 5.5.0

- Added the Library Engine.
- Added logical objects, relationships and stable identities.
- Added transactions, optimistic versioning and monotonic events.
- Added journal, snapshots, integrity checks and recovery.
- Added SQLite persistence and a unified Library Runtime.

## 5.4.0

- Added the Document Engine.
- Added canonical source, block and asset contracts.
- Added parser registry, format detection and text/Markdown/HTML parsing.
- Added deterministic normalization and OCR contracts.
- Added SQLite persistence and processing runtime.

## 5.3.0

- Consolidated the complete Search Engine.
- Added BM25 scoring, deterministic reranking and contextual snippets.
- Added maintenance scheduling and a stable composition layer.
- Reused existing lexical, semantic, graph, live, API, transport and production packages.

## 5.2.0

- Added the complete AI Engine foundation.
- Added canonical provider, generation and streaming contracts.
- Added context ranking and token budgeting.
- Added owner-scoped conversation memory and SQLite persistence.
- Added scope-protected tools and Knowledge Search integration.
- Added the unified AI Runtime.

## 5.1.0

- Added complete Personal Knowledge Graph subsystem.
- Added domain, SQLite, runtime, events, sync and integration packages.
- Added owner-scoped context ranking and adapters to Knowledge Graph and Search.

## 5.0.0-dev.28

- Added Knowledge Graph Engine Part 4.
- Added inference rules and derived facts.
- Added transitive, inverse, symmetric and chain inference.
- Added provenance and consistency validation.
- Added SQLite persistence and recomputation runtime.

## 5.0.0-dev.27

- Added Knowledge Graph Engine Part 3.
- Added ontology node and relationship types.
- Added type hierarchy and multiple inheritance.
- Added taxonomy terms and synonym resolution.
- Added validation-aware SQLite and runtime layers.

## 5.0.0-dev.26

- Added Knowledge Graph Engine Part 2.
- Added BFS and DFS traversal.
- Added radius search and relationship filtering.
- Added shortest path traversal.
- Added weighted traversal and SQLite neighbor reader.

## 5.0.0-dev.25

- Added Knowledge Graph Engine Part 1.
- Added canonical directed multigraph model.
- Added validation, deterministic serialization, runtime invariants and SQLite persistence.

## 5.0.0-dev.24

- Added Search Engine Part 10.
- Added bounded TTL cache and tag invalidation.
- Added in-flight request deduplication.
- Added circuit breakers and performance budgets.
- Added production Search composition and diagnostics.

## 5.0.0-dev.23

- Added Search Engine Part 9.
- Added progressive execution runtime, cancellation and timeout budgets.
- Added backpressure queue and telemetry contracts.
- Added local IPC and NDJSON streaming.
- Added authenticated HTTP runtime server.

## 5.0.0-dev.22

- Added Search Engine Part 8.
- Added unified Search API and authorization contracts.
- Added CLI parsing and output formatting.
- Added plugin Search capability.
- Added MCP-facing search tool and handler.

## 5.0.0-dev.21

- Added Search Engine Part 7.
- Added owner-scoped saved searches and query history.
- Added live subscriptions and monotonic change events.
- Added result snapshots and deterministic deltas.
- Added SQLite persistence and restart recovery.

## 5.0.0-dev.20

- Added Search Engine Part 6.
- Added graph nodes, weighted relationships and SQLite persistence.
- Added neighbor expansion and multi-hop traversal.
- Added shortest paths, centrality and connected components.
- Added graph-aware hybrid ranking and explanations.

## 5.0.0-dev.19

- Added Search Engine Part 5.
- Added embedding job planning and stale-vector detection.
- Added SQLite queue persistence, leases and retries.
- Added background embedding worker.
- Added model migration and background reindexing support.

## 5.0.0-dev.18

- Added Search Engine Part 4.
- Added embedding contracts and deterministic local provider.
- Added SQLite vector persistence and cosine retrieval.
- Added hybrid lexical-semantic search.
- Added Reciprocal Rank Fusion.

## 5.0.0-dev.17

- Added Search Engine Part 3.
- Added deterministic fuzzy matching and typo correction.
- Added synonym and domain query expansion.
- Added ranking profiles and explainable scores.
- Added Search Runtime orchestration.

## 5.0.0-dev.16

- Added Search Engine Part 2.
- Added query tokenizer, parser and AST.
- Added boolean operators, phrases, prefixes and field filters.
- Added created/updated date ranges.
- Added advanced SQLite execution, totals and facets.

## 5.0.0-dev.15

- Added Search Engine Part 1.
- Added canonical Search Document and indexing contracts.
- Added publication and Personal Knowledge extractors.
- Added incremental index pipeline with checkpoints.
- Added SQLite FTS5 storage, BM25 ranking and highlighted snippets.

## 5.0.0-dev.14

- Added Personal Knowledge Part 6.
- Added production application service for devices, events, cursors and conflicts.
- Added owner/device/scope enforcement.
- Added production HTTP server endpoints.
- Added audit logging and conflict-resolution event emission.

## 5.0.0-dev.13

- Added PostgreSQL event log, device registry and cursors.
- Added HMAC access tokens and owner/device/scope authorization.
- Added incremental Personal Knowledge Sync API.

## 5.0.0-dev.12

- Added Personal Knowledge Part 4.
- Added explicit conflict resolution commands.
- Added authenticated HTTP push and pull transport.
- Added synchronization server application.
- Added multi-device end-to-end synchronization test.

## 5.0.0-dev.11

- Added Personal Knowledge Part 3.
- Added revision vectors and bidirectional sync envelopes.
- Added deterministic automatic merge and tombstone propagation.
- Added explicit conflict creation and persistence.
- Added SQLite device replica storage.

## 5.0.0-dev.10

- Added anchor reattachment, confidence, orphan detection, version maps, manifests and conflicts.

## 5.0.0-dev.9

- Added Personal Knowledge Part 1.
- Added annotations, highlights, notes and bookmarks.
- Added text and page anchors.
- Added optimistic revisioning and immutable history.
- Added SQLite persistence and transactional updates.

## 5.0.0-dev.8

- Added Local Library Part 6.
- Added Master HTTP HEAD and byte-range client.
- Added complete production Master to Local synchronization composition.
- Added real HTTP, SQLite, staging, scheduler and Local Library end-to-end test.
- Completed the foundational Local Library synchronization path.

## 5.0.0-dev.7

- Added Local Library Part 5.
- Added SQLite persistence for transfer descriptors and checkpoints.
- Added filesystem resumable staging with fsync and recovery scan.
- Added priority scheduler with bounded concurrency.
- Added exponential backoff retry policy.

## 5.0.0-dev.6

- Added Local Library Part 4.
- Added end-to-end Master to Local range transfer.
- Added persisted resumable staging semantics.
- Added verified Local Library commit after SHA-256 validation.
- Added Synchronization Worker transfer adapter.

## 5.0.0-dev.5

- Added Local Library Part 3.
- Added real Node SQLite runtime with WAL, transactions and savepoints.
- Added deterministic cache and eviction planning.
- Added automated Local Library maintenance.
- Added production composition for SQLite and local filesystem storage.

## 5.0.0-dev.4

- Added Local Library Part 2.
- Added real content-addressed local filesystem storage.
- Added SQLite repository and migration contracts.
- Added persistent manifest and local statistics repositories.
- Added local scanner and repair service.

## 5.0.0-dev.3

- Added Local Library Part 1.
- Added verified local acquisition and offline access.
- Added deterministic Local Manifest.
- Added integrity inspection and explicit eviction.
- Added pin protection and Local Publication state model.

## 5.0.0-dev.2

- Added persistent Synchronization Worker.
- Added lease-based plan execution.
- Added resumable checkpoints and monotonic progress validation.
- Added cancellation, failure and checksum-completion rules.
- Preserved strict separation from Personal Knowledge.

All notable changes to KnowledgeOS are recorded here.

The project follows semantic versioning while V5 remains under active development.

## [5.0.0-dev.1] - 2026-08-01

### Added

- Established the cumulative Master Repository baseline.
- Preserved the complete V4 foundation and all V5 implementation blocks delivered through Synchronization PostgreSQL Runtime.
- Added repository versioning and snapshot policy.
- Added Git workflow and contribution rules.

### Included V5 capabilities

- contracts, domain types and Kernel primitives;
- Library Engine and first executable vertical slice;
- Node HTTP and PostgreSQL runtimes;
- Master Library domain and PostgreSQL persistence;
- authoritative NAS content-addressed storage;
- transactional registration workflow and outbox;
- buffered and direct filesystem streaming;
- durable resumable uploads and distributed completion leases;
- production resumable-upload composition;
- Synchronization Engine, manifests, plans, checkpoints and PostgreSQL runtime.
