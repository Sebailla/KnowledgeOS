# Module Specification — 32-LocalLibraryPart5

**Project:** KnowledgeOS  
**Documentation version:** 5.6.3  
**Status:** Consolidated  
**Subsystem:** Local Library

## Mission

This module exists to complete the durable offline execution path that moves authoritative library changes between local SQLite state, staged files, workers, and the Master Library without violating verified-commit ordering. It converts the focused documents in this directory into one coherent engineering contract and establishes the minimum guarantees that all implementations must preserve.

## Boundaries

The module owns the contracts, state transitions, persistence semantics, recovery behavior, and verification obligations described by its documents. It does not own presentation UI, authenticated identity issuance, or another engine's authoritative state. Cross-module communication uses typed contracts, events, batches, queries, or projections.

## Governing invariants

1. Local reads remain available while the network and Master Library are unavailable.
2. A checkpoint advances only after every preceding durable side effect is verified.
3. Staged files are never exposed as committed authoritative content before metadata commit.
4. Retries are idempotent and do not duplicate objects, journal entries, or uploaded bytes.
5. Cancellation and process termination leave a recoverable checkpoint rather than an ambiguous partial state.

## Runtime model

The runtime separates discovery, staging, verification, commit acknowledgement, checkpoint advancement, maintenance, and restart recovery into explicit phases. Every public operation validates identity and compatibility, performs bounded work, persists durable state, verifies the result, and only then publishes acknowledgement.

## Persistence model

SQLite stores checkpoints, scheduling state, retry metadata, and local projections; the filesystem stores staged or cached bytes; the NAS-backed Master Library remains authoritative. Storage schemas are implementation details; composite owner keys, unique sequences, and version checks are architectural requirements.

## Package traceability

| Package | Role |
|---|---|
| `packages/local-library` | Implementation or adapter participating in Local Library. |
| `packages/local-library-sqlite` | Implementation or adapter participating in Local Library. |
| `packages/local-storage` | Implementation or adapter participating in Local Library. |
| `packages/local-cache` | Implementation or adapter participating in Local Library. |
| `packages/local-maintenance` | Implementation or adapter participating in Local Library. |
| `packages/local-repair` | Implementation or adapter participating in Local Library. |
| `packages/sync-local-runtime` | Implementation or adapter participating in Local Library. |
| `packages/sync-local-sqlite` | Implementation or adapter participating in Local Library. |

## Document map

- `Concurrency.md` — simultaneous work, ownership, optimistic checks, serialization points, and race prevention.
- `CrashRecovery.md` — process crash scenarios, durable ordering, startup inspection, and deterministic recovery.
- `DurabilityOrdering.md` — write ordering, fsync boundaries, database commit ordering, and acknowledgement rules.
- `FilesystemStaging.md` — temporary paths, staging layout, atomic rename, cleanup, and orphan detection.
- `NextStep.md` — implemented boundary, intentionally deferred capabilities, prerequisites, and compatibility constraints.
- `PauseAndCancel.md` — cooperative pause and cancellation semantics at safe interruption boundaries.
- `README.md` — the r e a d m e concern within the Local Library subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `RetryPolicy.md` — retry classification, backoff, jitter, attempt budgets, and idempotency keys.
- `SQLiteCheckpoints.md` — checkpoint representation, ordering, monotonic advancement, persistence, and restart semantics.
- `Scheduler.md` — job eligibility, priorities, fairness, leases, backpressure, and maintenance windows.
- `Testing.md` — unit, integration, property, failure-injection, persistence, concurrency, and end-to-end verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass persistence integration tests where applicable, prove owner isolation, demonstrate retry idempotency, and exercise restart recovery at durable boundaries. Documentation and code changes that alter a listed invariant must be reviewed together.
