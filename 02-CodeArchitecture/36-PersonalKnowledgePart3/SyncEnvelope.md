# Sync Envelope

**Project:** KnowledgeOS  
**Section:** `02-CodeArchitecture/36-PersonalKnowledgePart3`  
**Document:** Sync Envelope  
**Documentation version:** 5.6.3  
**Status:** Consolidated  
**Subsystem:** Personal Knowledge  
**Implemented by:** `packages/personal-knowledge`, `packages/personal-knowledge-sqlite`, `packages/personal-knowledge-anchor`, `packages/personal-knowledge-anchor-sqlite`, `packages/personal-knowledge-sync-model`, `packages/personal-knowledge-sync`, `packages/personal-knowledge-sync-sqlite`, `packages/personal-knowledge-sync-runtime`, `packages/personal-knowledge-sync-http`, `packages/personal-knowledge-sync-postgres`, `packages/personal-knowledge-auth`, `packages/personal-knowledge-conflict-resolution`, `packages/personal-knowledge-events`  
**Last reviewed:** 2026-08-02

## 1. Purpose

This document specifies **incremental exchange, envelopes, cursors, acknowledgements, conflicts, and replay safety**. It is normative for the implementation represented by `36-PersonalKnowledgePart3` and must be read together with the module specification and the repository-wide architectural constraints. The objective is not merely to describe current classes; it is to define the behavior that compatible implementations must preserve.

The module exists to define and synchronize owner-scoped personal knowledge, anchors, revisions, tombstones, conflicts, device replicas, authorization boundaries, and production endpoints while preserving canonical Library isolation. This document narrows that broader purpose to **Sync Envelope**, establishes its observable guarantees, and records where responsibility begins and ends.

## 2. Scope

Included in scope are domain contracts, validation rules, state transitions, persistence effects, concurrency assumptions, failure classification, recovery behavior, observability, security boundaries, and test obligations directly related to incremental exchange, envelopes, cursors, acknowledgements, conflicts, and replay safety. The specification applies to local macOS execution, NAS-backed operation, restart recovery, and any server component named in the implementation traceability section.

Out of scope are user-interface composition, presentation styling, provider-specific deployment details that do not affect contracts, and future capabilities explicitly marked as deferred. A caller may depend on the guarantees in this document but must not depend on incidental storage layout or private implementation ordering unless that ordering is declared as an invariant.

## 3. Architectural context

The runtime performs authentication, device validation, cursor negotiation, envelope validation, conflict detection, resolution, atomic persistence, event emission, and response construction. The concern documented here participates in that pipeline as a distinct boundary. Inputs are validated before state changes; authoritative identity comes from the trusted runtime context; durable acknowledgements are emitted only after the required persistence boundary has succeeded.

SQLite supports offline local state; PostgreSQL supports server coordination, device registry, cursors, events, and persisted conflicts; both use the same owner-scoped contracts. The design therefore separates logical state, durable local coordination, authoritative remote state, and disposable caches. This separation is essential for offline-first behavior and deterministic recovery.

## 4. Responsibilities

The implementation is responsible for:

- defining a typed and owner-scoped representation of incremental exchange, envelopes, cursors, acknowledgements, conflicts, and replay safety;
- rejecting malformed, incompatible, stale, or unauthorized inputs before mutation;
- preserving idempotency for retried operations and deterministic ordering for identical input state;
- making durable state transitions observable through results, events, metrics, or persisted diagnostics;
- maintaining compatibility with the package contracts listed in Section 13;
- providing failure behavior that distinguishes retryable, terminal, conflicting, cancelled, and corrupt states;
- supporting restart without relying on in-memory state as the sole source of progress.

The implementation is not responsible for inventing authenticated identity, silently repairing authoritative data, hiding unresolved conflicts, or bypassing the Library and synchronization contracts to write storage directly.

## 5. Invariants

1. **Every personal knowledge item is owner-scoped and cannot be resolved across owner boundaries.**
2. **Anchors identify stable semantic targets and survive document relocation when the target can still be resolved.**
3. **Revision vectors and cursors advance monotonically for each device replica.**
4. **Tombstones are synchronized as first-class facts and are not silently converted into missing data.**
5. **Conflict resolution is auditable, deterministic where automatic, and atomic where it changes canonical state.**

For **Sync Envelope**, an additional invariant applies: the state or score produced by this concern must be reproducible from its declared inputs, configuration, persisted state, and clock values. Any nondeterministic provider result must be recorded with enough provenance to explain why repeated execution may differ.

## 6. Model and state

The model distinguishes identity, version or sequence, content or payload, provenance, lifecycle status, and operational metadata. Identity fields are immutable after creation. Versions and cursors are monotonic. Tombstones, cancellations, stale markers, and failures are represented explicitly rather than inferred from missing rows.

A typical lifecycle is:

1. **Discovered or received.** Input is identified but has not changed durable state.
2. **Validated.** Schema, ownership, compatibility, and preconditions have succeeded.
3. **Planned.** Required work and persistence effects are determined.
4. **Executing.** Work is owned by one runtime or lease holder.
5. **Persisted.** Durable state is written, but external acknowledgement may still be pending.
6. **Verified.** Required hashes, versions, effects, or result constraints have been checked.
7. **Acknowledged.** Cursor, checkpoint, event, or API result exposes completion.
8. **Failed, cancelled, stale, conflicted, or quarantined.** A durable diagnostic state requires retry, resolution, repair, or operator action.

Transitions that skip validation, persistence, or verification are forbidden unless the operation is explicitly read-only.

## 7. Processing flow

The normative flow for incremental exchange, envelopes, cursors, acknowledgements, conflicts, and replay safety is:

1. Resolve the trusted owner, device, replica, query, job, or worker context.
2. Load the minimum persisted state required to evaluate preconditions.
3. Normalize input and calculate canonical identifiers, hashes, vectors, terms, versions, or cursor values as applicable.
4. Validate invariants and reject incompatible state before side effects.
5. Acquire transactional ownership or a lease when concurrent execution is possible.
6. Execute the bounded operation. Long-running work reports progress and observes cancellation.
7. Persist state in the documented durability order.
8. Verify the result and record provenance, explanation, audit data, or diagnostics.
9. Publish events or acknowledgements only after durable success.
10. Advance cursors, checkpoints, job status, or lifecycle state monotonically.

A retry re-enters at the earliest safe phase derived from persisted state. It must not assume that the previous process failed before every side effect.

## 8. Persistence and concurrency

SQLite supports offline local state; PostgreSQL supports server coordination, device registry, cursors, events, and persisted conflicts; both use the same owner-scoped contracts. Database records use owner-scoped composite keys where data is private. Unique constraints enforce identities and monotonic sequences where practical. Transactions group state that must become visible atomically; file operations use staging and atomic rename where the filesystem participates.

Optimistic version checks protect user-facing objects. Leases protect background jobs. Cursor and checkpoint updates use compare-and-set or unique sequence constraints. A lease expiry permits recovery but does not prove that the previous worker produced no side effect, so idempotency keys and result verification remain mandatory.

## 9. Failure handling and recovery

Failures are classified as validation, authorization, compatibility, conflict, transient dependency, resource exhaustion, cancellation, corruption, or unexpected internal error. Validation and authorization failures are terminal for the current request. Transient dependency and resource failures may be retried under bounded policy. Conflicts require deterministic resolution or explicit user/operator action. Corruption moves affected state to quarantine or repair workflows.

Recovery begins from persisted state. The runtime inspects lifecycle status, version, cursor, lease, staged data, and previous diagnostics; verifies external side effects where possible; and resumes from a safe phase. It never advances a durable completion marker solely because a process previously attempted the operation.

## 10. Security and privacy

Owner identity is supplied by an authenticated host boundary and is never trusted from model, query, sync, or HTTP payload fields. Every repository lookup includes owner or tenant scope. Logs and metrics use opaque identifiers and exclude document text, personal knowledge payloads, embeddings, credentials, and access tokens by default.

External providers receive only data allowed by an explicit policy. Local-first execution remains available where the module supports it. Administrative repair and conflict endpoints require stronger scopes than ordinary read or write operations and produce audit records.

## 11. Performance and scalability

The implementation favors bounded work: batch limits, maximum graph depth, query limits, maximum expansions, token or vector dimensions, lease durations, retry budgets, and pagination. Indexes support common owner-scoped access paths. Background maintenance is throttled and yields to interactive work.

Performance optimizations must preserve deterministic results and durability guarantees. Caches are disposable, versioned by their inputs, and invalidated by authoritative events. Degradation of semantic, graph, remote, or maintenance stages must not make the offline lexical or local read path unavailable unless the requested capability specifically requires that stage.

## 12. Verification strategy

Required verification includes:

- unit tests for normalization, validation, state transitions, scoring, and error classification;
- integration tests against real SQLite or PostgreSQL schemas where persistence is involved;
- idempotency tests that repeat successful and partially failed operations;
- restart tests that terminate execution at each durable boundary and resume from persisted state;
- concurrency tests for leases, optimistic versions, duplicate events, and cursor races;
- security tests proving owner isolation and rejecting payload-supplied identity;
- property or fixture tests for deterministic ordering, ranking, merge, or traversal behavior;
- end-to-end tests across the integrations listed below.

A document is not considered implemented solely because a happy-path unit test passes. Failure and recovery behavior are part of the contract.

## 13. Implementation traceability

Primary implementation packages:

- `packages/personal-knowledge`
- `packages/personal-knowledge-sqlite`
- `packages/personal-knowledge-anchor`
- `packages/personal-knowledge-anchor-sqlite`
- `packages/personal-knowledge-sync-model`
- `packages/personal-knowledge-sync`
- `packages/personal-knowledge-sync-sqlite`
- `packages/personal-knowledge-sync-runtime`
- `packages/personal-knowledge-sync-http`
- `packages/personal-knowledge-sync-postgres`
- `packages/personal-knowledge-auth`
- `packages/personal-knowledge-conflict-resolution`
- `packages/personal-knowledge-events`

The exact exported symbols must be confirmed against each package's `src` and `test` directories. This specification governs behavior even when private class names change. Any package that materially changes the contracts described here must update this document in the same change.

## 14. Integration boundaries

- **Personal Knowledge Graph:** consumes or publishes stable contracts without bypassing owner, transaction, or persistence boundaries.
- **Library Engine:** consumes or publishes stable contracts without bypassing owner, transaction, or persistence boundaries.
- **Synchronization Engine:** consumes or publishes stable contracts without bypassing owner, transaction, or persistence boundaries.
- **AI context:** consumes or publishes stable contracts without bypassing owner, transaction, or persistence boundaries.
- **Search personalization:** consumes or publishes stable contracts without bypassing owner, transaction, or persistence boundaries.
- **HTTP server runtime:** consumes or publishes stable contracts without bypassing owner, transaction, or persistence boundaries.

Integrations exchange typed identities, events, snapshots, batches, queries, results, or projections. They do not share private database tables as an API. Cross-engine writes flow through the owning runtime or repository contract.

## 15. Configuration and observability

Configuration values are typed, validated at startup, and include conservative defaults. Relevant examples are batch sizes, retry limits, lease duration, checkpoint cadence, query budgets, ranking weights, model identifiers, graph depth, retention, and maintenance intervals. Invalid combinations fail startup rather than producing undefined behavior.

Observability includes correlation ID, owner-safe opaque identifiers, operation kind, lifecycle transition, duration, retry count, stage timings, cache or lease outcome, conflict or error class, and final status. Metrics are bounded-cardinality. Health distinguishes unavailable dependencies from degraded optional stages.

## 16. Evolution and compatibility

Schema, envelope, query, vector, event, and model formats carry explicit versions where compatibility can change. Readers tolerate known older versions or reject them with actionable diagnostics. Migration is restartable and records progress. Rollback is defined before destructive changes.

Future implementations may optimize storage or algorithms, but they must preserve identity, owner isolation, monotonic state, idempotency, explanation or provenance, and recovery semantics.

## 17. Related documents

- `README.md` in this module for the subsystem reading order.
- `ModuleSpecification.md` for consolidated boundaries and package mapping.
- `ImplementationStatus.md` for implemented, partial, and deferred capabilities.
- `diagrams/Context.puml` and `diagrams/Sequence.puml` for structural and runtime views.
- `00-Architecture` for product-level constraints and architectural principles.

## 18. Historical source preserved

The following content was present before the 5.6.3 consolidation. It is retained as historical context; where it conflicts with the normative sections above, the normative sections govern.

---

# Sync Envelope

An envelope contains:

- owner identity;
- source device;
- generation time;
- item replicas;
- revision vectors;
- tombstones.
