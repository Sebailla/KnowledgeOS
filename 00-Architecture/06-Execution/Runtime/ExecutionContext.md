# Execution Context

**Project:** KnowledgeOS  
**Section:** Execution / Runtime  
**Document:** ExecutionContext  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define correlation, actor, causation, deadline, locale, privacy and operation metadata.

## 2. Scope

Applies to all runtime operations.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Execution context carries bounded operational metadata across synchronous and asynchronous boundaries. It is not a general mutable bag.

## 5. Conceptual Model

```text
ExecutionContext
├── operationId
├── correlationId
├── causationId?
├── actor
├── authorityScope
├── deadline?
├── cancellationRef?
├── locale?
├── privacyClass
├── configurationFingerprint?
└── traceContext
```

## 6. Normative Requirements

**EXECUTIONCONTE-R001** — Every significant operation MUST have an operation identity.

**EXECUTIONCONTE-R002** — Correlation MUST propagate across child operations.

**EXECUTIONCONTE-R003** — Actor and authority scope MUST be explicit where relevant.

**EXECUTIONCONTE-R004** — Deadlines SHOULD propagate.

**EXECUTIONCONTE-R005** — Sensitive payloads MUST NOT be stored in context.

**EXECUTIONCONTE-R006** — Context mutation MUST be controlled.

**EXECUTIONCONTE-R007** — Serialization MUST omit non-transferable runtime handles.

**EXECUTIONCONTE-R008** — Context size MUST be bounded.

## 7. Invariants

**EXECUTIONCONTE-I001** — Operation identity is stable.

**EXECUTIONCONTE-I002** — Correlation is preserved.

**EXECUTIONCONTE-I003** — Secrets are excluded.

**EXECUTIONCONTE-I004** — Context does not define business authority.

**EXECUTIONCONTE-I005** — Async propagation is explicit.

## 8. Failure and Recovery

Missing required context SHALL fail before business execution. Context propagation failure SHALL be observable.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

A workflow step inherits correlation and privacy class but receives its own operation ID.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `ExecutionModel.md`
- `../../03-Kernel/Observability.md`
- `../../03-Kernel/CommandBus.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
