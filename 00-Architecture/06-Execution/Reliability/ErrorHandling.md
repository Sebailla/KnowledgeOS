# Error Handling

**Project:** KnowledgeOS  
**Section:** Execution / Reliability  
**Document:** ErrorHandling  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define error taxonomy, propagation and user-safe reporting.

## 2. Scope

Applies to all runtime layers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Errors are categorized as validation, authorization, conflict, transient infrastructure, permanent infrastructure, compatibility, policy, cancellation and unknown.

## 5. Conceptual Model

Error envelopes include stable code, category, operation, correlation, retryability and safe message.

## 6. Normative Requirements

**ERRORHANDLING-R001** — Errors MUST use stable categories.

**ERRORHANDLING-R002** — Sensitive details MUST be redacted.

**ERRORHANDLING-R003** — Retryability MUST be explicit.

**ERRORHANDLING-R004** — Domain conflicts MUST not be mapped to generic failures.

**ERRORHANDLING-R005** — Cancellation MUST remain distinct from failure.

**ERRORHANDLING-R006** — Errors MUST preserve causal chains internally.

**ERRORHANDLING-R007** — User messages SHOULD be actionable.

**ERRORHANDLING-R008** — Unknown errors MUST be observable.

## 7. Invariants

**ERRORHANDLING-I001** — Errors do not expose secrets.

**ERRORHANDLING-I002** — Categories are stable.

**ERRORHANDLING-I003** — Retry decisions are deterministic.

**ERRORHANDLING-I004** — Conflicts preserve data.

**ERRORHANDLING-I005** — Failure does not imply rollback unless guaranteed.

## 8. Failure and Recovery

Unknown failures produce safe external errors and detailed protected diagnostics.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

A version conflict returns current and expected version references, not HTTP 500 semantics internally.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `Recovery.md`
- `Observability.md`
- `../../03-Kernel/Logging.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
