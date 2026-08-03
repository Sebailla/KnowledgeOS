# Module Specification — 57-DocumentEngine

**Project:** KnowledgeOS  
**Documentation version:** 5.6.4  
**Status:** Consolidated  
**Subsystem:** Document Engine

## Mission

This module exists to transform source bytes into a canonical, normalized, provenance-preserving document representation suitable for Reader, Search, Knowledge Graph, AI, annotations, and export. It consolidates all focused documents in this directory into one governing engineering contract and records the minimum behavior that implementations, migrations, and future providers must preserve.

## Scope and boundaries

The module owns the contracts, domain decisions, durable state, processing stages, failure semantics, diagnostics, and tests described here. It does not own authenticated identity issuance, presentation UI, or another subsystem's authoritative records. Cross-engine interaction occurs through typed contracts, events, commands, queries, batches, projections, and content-addressed references.

## Governing invariants

1. Original source bytes and fingerprints are never silently replaced by normalized output.
2. Parsing and normalization are deterministic for the same bytes, parser version, and configuration.
3. Blocks and assets have stable identities and preserve source location or page provenance where available.
4. OCR output records engine, language hints, confidence, and page association.
5. Unsupported or partially parsed content is represented explicitly rather than discarded.

## Canonical processing flow

`detect format → select parser → extract blocks and assets → invoke OCR where required → normalize Unicode and structure → validate provenance → persist parsed document → project to Library/Search/Graph`

Every phase validates its inputs, performs bounded work, records diagnostics, persists durable results before acknowledgement, and remains safe to retry when the operation contract declares idempotency.

## Persistence model

Parsed documents and processing metadata are stored in SQLite; authoritative source files and binary assets remain in content-addressed Library storage. Physical schemas may evolve behind repository contracts, but owner isolation, stable identity, deterministic migrations, version checks, and recovery remain architectural requirements.

## Security model

Parsers operate with bounded resources and no implicit network access. Untrusted HTML, archives, fonts, scripts, and embedded files are treated as hostile inputs.

## Failure and recovery model

Parser and OCR failures produce structured diagnostics and resumable processing states. The original source remains available for reprocessing with a newer parser.

## Package traceability

| Package | Architectural role |
|---|---|
| `packages/document-assets` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/document-contracts` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/document-normalizer` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/document-ocr` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/document-parser` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/document-runtime` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |
| `packages/document-sqlite` | Concrete implementation, adapter, storage, runtime, or integration package participating in this subsystem. |

## Document map

- `Architecture.md` — Architecture concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Assets.md` — Assets concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Compatibility.md` — Compatibility concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Formats.md` — Formats concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Glossary.md` — Glossary concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Integration.md` — Integration concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `KnownLimitations.md` — Known Limitations concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Normalization.md` — Normalization concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `OCR.md` — Ocr concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Parsing.md` — Parsing concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Persistence.md` — Persistence concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `README.md` — Readme concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Roadmap.md` — Roadmap concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Runtime.md` — Runtime concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Security.md` — Security concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.
- `Testing.md` — Testing concern and its subsystem-specific contracts, invariants, operations, failure behavior, and verification.

## Quality gates

A compatible implementation must compile under strict TypeScript settings, pass domain and persistence tests, prove owner isolation, preserve deterministic ordering, demonstrate retry idempotency, and exercise recovery at every durable boundary. Any change that alters a governing invariant requires code, tests, migration guidance, and documentation in the same review.
