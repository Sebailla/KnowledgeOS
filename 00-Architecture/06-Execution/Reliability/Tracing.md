# Execution Tracing

**Project:** KnowledgeOS  
**Section:** Execution / Reliability  
**Document:** Tracing  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define spans, causality and cross-boundary propagation.

## 2. Scope

Applies to commands, queries, events, workflows, jobs and providers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Traces represent one logical operation across components. Spans represent bounded activities.

## 5. Conceptual Model

Trace context contains trace ID, span ID, parent, operation, module, timing, status and privacy class.

## 6. Normative Requirements

**TRACING-R001** — Trace context SHOULD propagate across supported boundaries.

**TRACING-R002** — Span names MUST be stable and low-cardinality.

**TRACING-R003** — Sensitive payloads MUST not be recorded.

**TRACING-R004** — Causation SHOULD be represented.

**TRACING-R005** — Sampling MUST be explicit.

**TRACING-R006** — Provider calls SHOULD produce child spans.

**TRACING-R007** — Long workflows MAY use linked traces rather than one indefinitely open span.

## 7. Invariants

**TRACING-I001** — Trace does not become workflow state.

**TRACING-I002** — Privacy is enforced.

**TRACING-I003** — Causality is inspectable.

**TRACING-I004** — Span naming is stable.

**TRACING-I005** — Sampling does not affect execution.

## 8. Failure and Recovery

Trace export failure is isolated and bounded.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

An acquisition workflow links download, checksum, registration and processing traces through correlation and causation.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `Observability.md`
- `Metrics.md`
- `../../03-Kernel/Logging.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
