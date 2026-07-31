# Idempotency

**Project:** KnowledgeOS  
**Section:** Execution / Concurrency  
**Document:** Idempotency  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define operation identity, deduplication and safe retry behavior.

## 2. Scope

Applies to commands, jobs, events, workflows, imports, acquisitions and synchronization.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Idempotency ensures repeating the same logical operation does not create unintended duplicate effects.

## 5. Conceptual Model

An idempotency record stores operation key, scope, request fingerprint, state, result reference and retention.

## 6. Normative Requirements

**IDEMPOTENCY-R001** — Retryable mutations MUST define idempotency scope.

**IDEMPOTENCY-R002** — Keys MUST be stable for the logical operation.

**IDEMPOTENCY-R003** — Request mismatch under the same key MUST fail.

**IDEMPOTENCY-R004** — Completed results SHOULD be replayable.

**IDEMPOTENCY-R005** — In-progress duplicate requests MUST coordinate.

**IDEMPOTENCY-R006** — Retention MUST cover retry windows.

**IDEMPOTENCY-R007** — Unknown commit status MUST reconcile by key.

**IDEMPOTENCY-R008** — Idempotency records MUST not expose sensitive payloads.

## 7. Invariants

**IDEMPOTENCY-I001** — Same key and request produce same logical effect.

**IDEMPOTENCY-I002** — Mismatched reuse fails.

**IDEMPOTENCY-I003** — Duplicate execution is bounded.

**IDEMPOTENCY-I004** — Identity is preserved.

**IDEMPOTENCY-I005** — Retention is explicit.

## 8. Failure and Recovery

After a client timeout, the same acquisition key returns the existing workflow rather than creating another acquisition.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

`AcquirePublication` uses user, device and publication request identity as idempotency scope.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `RetryPolicies.md`
- `Transactions.md`
- `../../03-Kernel/CommandBus.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
