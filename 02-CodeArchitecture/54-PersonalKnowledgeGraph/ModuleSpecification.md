# Module Specification — 54-PersonalKnowledgeGraph

**Project:** KnowledgeOS  
**Documentation version:** 5.6.4  
**Status:** Consolidated  
**Subsystem:** PersonalKnowledge

## Mission

This module exists to represent user-controlled interests, skills, goals, preferences, memories, and contextual signals without allowing personalization to become an opaque or irreversible profile. It consolidates all focused documents in this directory into one governing engineering contract and records the minimum behavior that implementations, migrations, and future providers must preserve.

## Scope and boundaries

The module owns the contracts, domain decisions, durable state, processing stages, failure semantics, diagnostics, and tests described here. It does not own authenticated identity issuance, presentation UI, or another subsystem's authoritative records. Cross-engine interaction occurs through typed contracts, events, commands, queries, batches, projections, and content-addressed references.

## Governing invariants

1. Personal knowledge is owned by the user and can be inspected, corrected, exported, or deleted.
2. Every item records confidence, importance, provenance, and timestamps appropriate to its type.
3. Inferred personal knowledge remains distinguishable from explicit user statements.
4. Ranking boosts are bounded and cannot bypass access control or factual relevance.
5. Synchronization is incremental, idempotent, and conflict-aware.

## Canonical processing flow

`capture explicit or inferred signal → validate provenance and confidence → persist personal item → emit event → project to Knowledge Graph and Search → synchronize by cursor`

Every phase validates its inputs, performs bounded work, records diagnostics, persists durable results before acknowledgement, and remains safe to retry when the operation contract declares idempotency.

## Persistence model

SQLite stores owner-scoped profiles, items, relationships, snapshots, event sequences, and sync cursors. Sensitive raw evidence is referenced rather than copied when possible. Physical schemas may evolve behind repository contracts, but owner isolation, stable identity, deterministic migrations, version checks, and recovery remain architectural requirements.

## Security model

Privacy is the primary quality attribute. Remote providers receive personal context only under explicit policy. The model never chooses owner identity or unrestricted scopes.

## Failure and recovery model

Failed projections or sync operations are retryable from durable events. Conflicting edits are preserved for reconciliation. Low-confidence inference never overwrites explicit knowledge.

## Package traceability

| Package | Architectural role |
|---|---|
| `packages/personal-knowledge` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-anchor` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-anchor-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-auth` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-conflict-resolution` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-events` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-graph` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-graph-runtime` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-graph-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-integration` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sync` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sync-http` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sync-model` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sync-postgres` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sync-runtime` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/personal-knowledge-sync-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |

## Document map

- `Architecture.md` — Architecture concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Compatibility.md` — Compatibility concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `DomainModel.md` — Domain Model concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Events.md` — Events concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Glossary.md` — Glossary concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `KnowledgeGraphIntegration.md` — Knowledge Graph Integration concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `KnownLimitations.md` — Known Limitations concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `MemoryModel.md` — Memory Model concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Persistence.md` — Persistence concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Privacy.md` — Privacy concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `README.md` — Readme concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Release.md` — Release concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Roadmap.md` — Roadmap concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Runtime.md` — Runtime concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `SearchIntegration.md` — Search Integration concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Security.md` — Security concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Synchronization.md` — Synchronization concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Testing.md` — Testing concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass domain and persistence tests, prove owner isolation, preserve deterministic ordering, demonstrate retry idempotency, and exercise recovery at every durable boundary. Any change that alters a governing invariant requires code, tests, migration guidance, and documentation in the same review.
