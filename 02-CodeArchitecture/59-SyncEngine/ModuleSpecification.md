# Module Specification — 59-SyncEngine

**Project:** KnowledgeOS  
**Documentation version:** 5.6.4  
**Status:** Consolidated  
**Subsystem:** Sync Engine

## Mission

This module exists to synchronize owner-scoped library changes between offline clients and the NAS Master Library using durable sequences, cursors, conflict detection, retryable batches, and explicit reconciliation. It consolidates all focused documents in this directory into one governing engineering contract and records the minimum behavior that implementations, migrations, and future providers must preserve.

## Scope and boundaries

The module owns the contracts, domain decisions, durable state, processing stages, failure semantics, diagnostics, and tests described here. It does not own authenticated identity issuance, presentation UI, or another subsystem's authoritative records. Cross-engine interaction occurs through typed contracts, events, commands, queries, batches, projections, and content-addressed references.

## Governing invariants

1. Every replica emits strictly increasing, durable change sequences.
2. Acknowledged cursors advance only after durable application or durable conflict recording.
3. Batch delivery is idempotent and duplicate change IDs do not reapply side effects.
4. Conflicts preserve both local and remote evidence until an explicit policy resolves them.
5. Synchronization never changes object ownership or bypasses Library validation.

## Canonical processing flow

`project Library events to changes → persist outbox → plan ordered batch → transport → receive from cursor → validate and detect conflicts → apply through Library → persist cursor and acknowledgement`

Every phase validates its inputs, performs bounded work, records diagnostics, persists durable results before acknowledgement, and remains safe to retry when the operation contract declares idempotency.

## Persistence model

SQLite persists local changes, outbox/inbox state, cursors, retries, leases, and conflicts. Server-side PostgreSQL persists authoritative replication state and durable acknowledgements. Physical schemas may evolve behind repository contracts, but owner isolation, stable identity, deterministic migrations, version checks, and recovery remain architectural requirements.

## Security model

Transport authentication binds device, owner, and replica. Payloads are validated, size-bounded, checksum-protected, and never trusted to assign ownership.

## Failure and recovery model

Network interruption leaves durable pending batches. Retries use backoff and idempotency keys. Sequence gaps stop cursor advancement. Conflicts are quarantined rather than silently overwritten.

## Package traceability

| Package | Architectural role |
|---|---|
| `packages/sync-conflicts` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-contracts` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-library-integration` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-local-runtime` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-local-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-master-http` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-planner` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-postgres` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-runtime` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-scheduler` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-staging-node` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-transport` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/sync-worker` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |

## Document map

- `Architecture.md` — Architecture concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Batches.md` — Batches concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Changes.md` — Changes concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Compatibility.md` — Compatibility concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Conflicts.md` — Conflicts concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Cursors.md` — Cursors concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Glossary.md` — Glossary concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `KnownLimitations.md` — Known Limitations concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `LibraryIntegration.md` — Library Integration concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `OfflineFirst.md` — Offline First concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `README.md` — Readme concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Resolution.md` — Resolution concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Roadmap.md` — Roadmap concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Runtime.md` — Runtime concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `SQLite.md` — Sqlite concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Security.md` — Security concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Testing.md` — Testing concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Transport.md` — Transport concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass domain and persistence tests, prove owner isolation, preserve deterministic ordering, demonstrate retry idempotency, and exercise recovery at every durable boundary. Any change that alters a governing invariant requires code, tests, migration guidance, and documentation in the same review.
