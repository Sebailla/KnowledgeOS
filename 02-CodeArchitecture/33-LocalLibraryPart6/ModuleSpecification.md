# Module Specification — 33-LocalLibraryPart6

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

- `AuthenticationBoundary.md` — trusted identity establishment before owner-scoped operations.
- `Integrity.md` — checksums, consistency checks, corrupt-state quarantine, and repair workflows.
- `MasterHTTP.md` — contract with the authoritative Master Library and the conditions required before local acknowledgement.
- `NextStep.md` — implemented boundary, intentionally deferred capabilities, prerequisites, and compatibility constraints.
- `OfflineAvailability.md` — offline behavior, local availability, deferred work, and reconnection guarantees.
- `ProductionComposition.md` — production composition, dependency wiring, health, startup, shutdown, and failure isolation.
- `ProductionFlow.md` — production composition, dependency wiring, health, startup, shutdown, and failure isolation.
- `README.md` — the r e a d m e concern within the Local Library subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `RestartRecovery.md` — restart-safe state discovery, cursor restoration, lease expiry, and continuation.
- `Scheduling.md` — the scheduling concern within the Local Library subsystem, including contracts, invariants, runtime behavior, persistence, failure handling, and verification.
- `Testing.md` — unit, integration, property, failure-injection, persistence, concurrency, and end-to-end verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass persistence integration tests where applicable, prove owner isolation, demonstrate retry idempotency, and exercise restart recovery at durable boundaries. Documentation and code changes that alter a listed invariant must be reviewed together.
