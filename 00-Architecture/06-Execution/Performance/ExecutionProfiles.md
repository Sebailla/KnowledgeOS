# Execution Profiles

**Project:** KnowledgeOS  
**Section:** Execution / Performance  
**Document:** ExecutionProfiles  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define workload and environment profiles used for operational policy.

## 2. Scope

Applies to macOS, iPhone, iPad, NAS and optional web.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Profiles describe capabilities and constraints without changing Domain semantics.

## 5. Conceptual Model

Profiles include desktop-interactive, mobile-interactive, background-energy-aware, NAS-server, offline, low-memory and maintenance.

## 6. Normative Requirements

**EXECUTIONPROFI-R001** — Every runtime MUST select an explicit profile.

**EXECUTIONPROFI-R002** — Profiles MUST declare resource and network assumptions.

**EXECUTIONPROFI-R003** — Profile changes MUST not alter identity or authority.

**EXECUTIONPROFI-R004** — Mobile profiles MUST consider energy and thermal limits.

**EXECUTIONPROFI-R005** — Offline profile MUST disable unavailable remote dependencies explicitly.

**EXECUTIONPROFI-R006** — Maintenance profile MAY prioritize throughput.

## 7. Invariants

**EXECUTIONPROFI-I001** — Domain meaning is profile-independent.

**EXECUTIONPROFI-I002** — Resource policy is explicit.

**EXECUTIONPROFI-I003** — Offline behavior is predictable.

**EXECUTIONPROFI-I004** — Profile selection is observable.

**EXECUTIONPROFI-I005** — Fallback is safe.

## 8. Failure and Recovery

Unsupported profile capability yields explicit degradation.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

iPhone low-power profile pauses embeddings but permits reading and annotations.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `PerformanceModel.md`
- `../Runtime/ResourceManagement.md`
- `ParallelExecution.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
