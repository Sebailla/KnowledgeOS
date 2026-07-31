# Transaction Model

**Project:** KnowledgeOS  
**Section:** Execution / Concurrency  
**Document:** Transactions  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define atomicity scopes and interaction with external effects.

## 2. Scope

Applies to repository and cross-service mutations.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Transactions protect one declared consistency boundary. Distributed business processes use workflows, not hidden distributed transactions.

## 5. Conceptual Model

Scopes include single aggregate, repository unit of work, outbox commit and staged import.

## 6. Normative Requirements

**TRANSACTIONS-R001** — Transaction scope MUST be explicit.

**TRANSACTIONS-R002** — Domain events requiring atomic publication MUST use outbox or equivalent.

**TRANSACTIONS-R003** — External calls MUST not remain inside long database transactions.

**TRANSACTIONS-R004** — Cross-Engine atomicity MUST not be assumed.

**TRANSACTIONS-R005** — Compensation MUST preserve evidence.

**TRANSACTIONS-R006** — Retries MUST use idempotency.

**TRANSACTIONS-R007** — Commit uncertainty MUST trigger reconciliation.

## 7. Invariants

**TRANSACTIONS-I001** — Committed state is atomic within declared scope.

**TRANSACTIONS-I002** — Events align with commit.

**TRANSACTIONS-I003** — External side effects are reconciled.

**TRANSACTIONS-I004** — Transactions do not cross hidden boundaries.

**TRANSACTIONS-I005** — Rollback does not erase external evidence.

## 8. Failure and Recovery

Database commit timeout with unknown status requires lookup by operation identity.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

Registering a local publication commits object, acquisition and outbox event in one repository transaction.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `ConcurrencyModel.md`
- `Idempotency.md`
- `../../03-Kernel/WorkflowEngine.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
