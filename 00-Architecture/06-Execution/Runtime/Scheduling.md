# Runtime Scheduling

**Project:** KnowledgeOS  
**Section:** Execution / Runtime  
**Document:** Scheduling  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define activation, fairness, deadlines and timing behavior for work.

## 2. Scope

Applies to jobs, workflows, timers and recurring tasks.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Scheduling chooses when eligible work runs. It does not own business semantics.

## 5. Conceptual Model

Policies include FIFO, priority, weighted fairness, deadlines, resource-aware scheduling and recurring calendar activation.

## 6. Normative Requirements

**SCHEDULING-R001** — Scheduling policy MUST be explicit.

**SCHEDULING-R002** — Persistent schedules MUST survive restart.

**SCHEDULING-R003** — Timezone MUST be explicit for calendar schedules.

**SCHEDULING-R004** — Misfire behavior MUST be declared.

**SCHEDULING-R005** — Overlap behavior MUST be declared.

**SCHEDULING-R006** — Activation MUST be idempotent.

**SCHEDULING-R007** — Fairness SHOULD prevent starvation.

**SCHEDULING-R008** — Resource constraints MUST be respected.

## 7. Invariants

**SCHEDULING-I001** — Activation identity prevents duplicates.

**SCHEDULING-I002** — Time interpretation is explicit.

**SCHEDULING-I003** — Business ownership remains external.

**SCHEDULING-I004** — Schedule history is observable.

**SCHEDULING-I005** — Restart does not lose persistent schedules.

## 8. Failure and Recovery

Missed schedules follow skip, run-once or bounded catch-up policy.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

A nightly integrity workflow activates once after a device wakes, rather than replaying every missed minute.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `../../03-Kernel/Scheduler.md`
- `BackgroundJobs.md`
- `ResourceManagement.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
