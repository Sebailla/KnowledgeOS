# Module Specification — 58-LibraryEngine

**Project:** KnowledgeOS  
**Documentation version:** 5.6.4  
**Status:** Consolidated  
**Subsystem:** Library Engine

## Mission

This module exists to provide the logical, transactional, versioned, recoverable, and storage-independent library that acts as the authoritative coordination boundary for all KnowledgeOS engines. It consolidates all focused documents in this directory into one governing engineering contract and records the minimum behavior that implementations, migrations, and future providers must preserve.

## Scope and boundaries

The module owns the contracts, domain decisions, durable state, processing stages, failure semantics, diagnostics, and tests described here. It does not own authenticated identity issuance, presentation UI, or another subsystem's authoritative records. Cross-engine interaction occurs through typed contracts, events, commands, queries, batches, projections, and content-addressed references.

## Governing invariants

1. Every mutable library operation executes through a transaction with optimistic version checks.
2. Object identity is stable while content hashes and revisions describe change.
3. Committed operations emit monotonic owner-scoped journal events.
4. Snapshots plus a contiguous journal are sufficient to recover logical state.
5. Consumers never bypass Library contracts to mutate SQLite, NAS files, or indexes directly.

## Canonical processing flow

`authenticate owner → load logical state → validate transaction and expected versions → apply operations → verify integrity → persist objects/relationships → append journal → publish events → optionally snapshot`

Every phase validates its inputs, performs bounded work, records diagnostics, persists durable results before acknowledgement, and remains safe to retry when the operation contract declares idempotency.

## Persistence model

The NAS holds authoritative content-addressed files and PostgreSQL holds the Master Library; local SQLite stores offline projections, events, cursors, and parsed/indexed derivatives. Runtime caches are non-authoritative. Physical schemas may evolve behind repository contracts, but owner isolation, stable identity, deterministic migrations, version checks, and recovery remain architectural requirements.

## Security model

Owner isolation, immutable audit events, least-privilege storage providers, checksum verification, and explicit recovery operations are mandatory.

## Failure and recovery model

Transactions fail before acknowledgement when integrity or persistence fails. Recovery uses the latest valid snapshot and contiguous journal. Indexes and caches are rebuildable from authoritative state.

## Package traceability

| Package | Architectural role |
|---|---|
| `packages/library-contracts` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-integrity` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-journal` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-model` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-recovery` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-runtime` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/library-transactions` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |

## Document map

- `Architecture.md` — Architecture concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Compatibility.md` — Compatibility concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Events.md` — Events concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Glossary.md` — Glossary concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Integration.md` — Integration concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Integrity.md` — Integrity concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Journal.md` — Journal concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `KnownLimitations.md` — Known Limitations concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `LogicalLibrary.md` — Logical Library concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `ObjectIdentity.md` — Object Identity concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `README.md` — Readme concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Recovery.md` — Recovery concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Roadmap.md` — Roadmap concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Runtime.md` — Runtime concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `SQLite.md` — Sqlite concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Security.md` — Security concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Snapshots.md` — Snapshots concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Testing.md` — Testing concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Transactions.md` — Transactions concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Versioning.md` — Versioning concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass domain and persistence tests, prove owner isolation, preserve deterministic ordering, demonstrate retry idempotency, and exercise recovery at every durable boundary. Any change that alters a governing invariant requires code, tests, migration guidance, and documentation in the same review.
