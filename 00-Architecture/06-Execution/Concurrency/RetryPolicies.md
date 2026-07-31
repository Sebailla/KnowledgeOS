# Retry Policies

**Project:** KnowledgeOS  
**Section:** Execution / Concurrency  
**Document:** RetryPolicies  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define bounded retry classification, backoff, jitter and stop conditions.

## 2. Scope

Applies to commands, providers, jobs, events and workflows.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Retries respond to transient failures. They do not repair validation, authorization or semantic conflicts.

## 5. Conceptual Model

Policy includes max attempts, elapsed time, backoff, jitter, retryable categories and reconciliation.

## 6. Normative Requirements

**RETRYPOLICIES-R001** — Failures MUST be classified before retry.

**RETRYPOLICIES-R002** — Validation and authorization failures MUST not retry automatically.

**RETRYPOLICIES-R003** — Backoff MUST be bounded.

**RETRYPOLICIES-R004** — Jitter SHOULD prevent synchronized retry storms.

**RETRYPOLICIES-R005** — Deadlines MUST cap retry duration.

**RETRYPOLICIES-R006** — Unknown commit status MUST reconcile first.

**RETRYPOLICIES-R007** — Retry attempts MUST be observable.

**RETRYPOLICIES-R008** — Provider rate limits MUST be respected.

## 7. Invariants

**RETRYPOLICIES-I001** — Retries are bounded.

**RETRYPOLICIES-I002** — Non-retryable failures stop.

**RETRYPOLICIES-I003** — Idempotency protects effects.

**RETRYPOLICIES-I004** — Deadlines are honored.

**RETRYPOLICIES-I005** — Retry storms are controlled.

## 8. Failure and Recovery

After policy exhaustion, durable work enters explicit failed or paused state.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

A remote AI task retries network timeouts but not an unsupported-model error.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `Idempotency.md`
- `../../03-Kernel/WorkflowEngine.md`
- `../../05-Integration/Providers/ProviderModel.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
