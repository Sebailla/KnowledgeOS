# Event Processing

**Project:** KnowledgeOS  
**Section:** Execution / Messaging  
**Document:** EventProcessing  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define consumer execution, retries, offsets, poison events and replay.

## 2. Scope

Applies to durable and in-process event consumers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Consumers process events under declared ordering and delivery policies.

## 5. Conceptual Model

Consumer state includes subscription identity, checkpoint, attempts, last success and failure diagnostics.

## 6. Normative Requirements

**EVENTPROCESSIN-R001** — Consumers MUST be idempotent under redelivery.

**EVENTPROCESSIN-R002** — Checkpoints MUST advance only after successful processing.

**EVENTPROCESSIN-R003** — Poison events MUST be isolated.

**EVENTPROCESSIN-R004** — Retry policies MUST be bounded.

**EVENTPROCESSIN-R005** — Replay MUST not create duplicate effects.

**EVENTPROCESSIN-R006** — Consumer ownership MUST be explicit.

**EVENTPROCESSIN-R007** — Schema incompatibility MUST fail visibly.

**EVENTPROCESSIN-R008** — Dead-letter handling MUST preserve evidence.

## 7. Invariants

**EVENTPROCESSIN-I001** — Checkpoints reflect completed effects.

**EVENTPROCESSIN-I002** — Redelivery is safe.

**EVENTPROCESSIN-I003** — One poison event does not block unrelated streams indefinitely.

**EVENTPROCESSIN-I004** — Replay is auditable.

**EVENTPROCESSIN-I005** — Consumer failures are observable.

## 8. Failure and Recovery

Permanent failure moves to an isolation mechanism while preserving manual replay.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

Search consumer rebuilds a projection and advances checkpoint only after index commit.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `Events.md`
- `EventOrdering.md`
- `../Reliability/Checkpointing.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
