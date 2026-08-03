# Module Specification — 38-PersonalKnowledgePart5

**Project:** KnowledgeOS  
**Documentation version:** 5.6.3  
**Status:** Consolidated  
**Subsystem:** Personal Knowledge

## Mission

This module exists to define and synchronize owner-scoped personal knowledge, anchors, revisions, tombstones, conflicts, device replicas, authorization boundaries, and production endpoints while preserving canonical Library isolation. It converts the focused documents in this directory into one coherent engineering contract and establishes the minimum guarantees that all implementations must preserve.

## Boundaries

The module owns the contracts, state transitions, persistence semantics, recovery behavior, and verification obligations described by its documents. It does not own presentation UI, authenticated identity issuance, or another engine's authoritative state. Cross-module communication uses typed contracts, events, batches, queries, or projections.

## Governing invariants

1. Every personal knowledge item is owner-scoped and cannot be resolved across owner boundaries.
2. Anchors identify stable semantic targets and survive document relocation when the target can still be resolved.
3. Revision vectors and cursors advance monotonically for each device replica.
4. Tombstones are synchronized as first-class facts and are not silently converted into missing data.
5. Conflict resolution is auditable, deterministic where automatic, and atomic where it changes canonical state.

## Runtime model

The runtime performs authentication, device validation, cursor negotiation, envelope validation, conflict detection, resolution, atomic persistence, event emission, and response construction. Every public operation validates identity and compatibility, performs bounded work, persists durable state, verifies the result, and only then publishes acknowledgement.

## Persistence model

SQLite supports offline local state; PostgreSQL supports server coordination, device registry, cursors, events, and persisted conflicts; both use the same owner-scoped contracts. Storage schemas are implementation details; composite owner keys, unique sequences, and version checks are architectural requirements.

## Package traceability

| Package | Role |
|---|---|
| `packages/personal-knowledge` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sqlite` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-anchor` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-anchor-sqlite` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sync-model` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sync` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sync-sqlite` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sync-runtime` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sync-http` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-sync-postgres` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-auth` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-conflict-resolution` | Implementation or adapter participating in Personal Knowledge. |
| `packages/personal-knowledge-events` | Implementation or adapter participating in Personal Knowledge. |

## Document map

- `Authentication.md` — trusted identity establishment before owner-scoped operations.
- `Authorization.md` — scope and ownership enforcement at public and internal boundaries.
- `CursorEngine.md` — monotonic cursors, source/target scope, acknowledgement, rewind prohibition, and recovery.
- `DeviceRegistry.md` — device identity, registration, revocation, replica state, and cursor isolation.
- `IncrementalSync.md` — incremental exchange, envelopes, cursors, acknowledgements, conflicts, and replay safety.
- `NextStep.md` — implemented boundary, intentionally deferred capabilities, prerequisites, and compatibility constraints.
- `PostgreSQLSchema.md` — the postgre s q l schema concern within the Personal Knowledge subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `ProductionDeployment.md` — production composition, dependency wiring, health, startup, shutdown, and failure isolation.
- `README.md` — the r e a d m e concern within the Personal Knowledge subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `Recovery.md` — the recovery concern within the Personal Knowledge subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `SyncEvents.md` — incremental exchange, envelopes, cursors, acknowledgements, conflicts, and replay safety.
- `Testing.md` — unit, integration, property, failure-injection, persistence, concurrency, and end-to-end verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass persistence integration tests where applicable, prove owner isolation, demonstrate retry idempotency, and exercise restart recovery at durable boundaries. Documentation and code changes that alter a listed invariant must be reviewed together.
