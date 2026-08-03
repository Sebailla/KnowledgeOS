# Knowledge Object Lifecycle Mapping

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** LifecycleMapping  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Map Knowledge Object lifecycle concepts to Library, Import, Workflow, Sync, Search, AI and Export responsibilities.

## 2. Scope

Covers domain states and ownership of transitions. It does not define runtime orchestration internals.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

The Domain defines states and valid transitions. Platform engines execute transitions through Kernel commands, events and workflows.

Three lifecycles remain separate:

1. publication and Master Knowledge Object lifecycle;
2. local availability and acquisition lifecycle;
3. Personal Knowledge lifecycle.

Canonical processing is an additional derived lifecycle and SHALL NOT collapse these three.

## 5. Conceptual Model

```text
Master Publication:
Discovered → Registered → Active → Archived → Removed

Local Availability:
Absent → Acquiring → Available → Evicted
                     ├→ Corrupt
                     └→ Removed

Personal Knowledge:
Created → Modified → PendingSync → Synchronized
                         ├→ Conflict → Merged
                         └→ Deleted
```

Processing:

```text
Queued → Running → Validating → Published
              ├→ Paused
              ├→ Failed
              └→ Cancelled
```

## 6. Normative Requirements

**LIFECYCLEMAPPI-R001** — Import Engine MUST own source discovery and initial validation workflows.

**LIFECYCLEMAPPI-R002** — Library Engine MUST own Master registration, Local membership and availability transitions.

**LIFECYCLEMAPPI-R003** — Sync Engine MUST own Personal Knowledge convergence only.

**LIFECYCLEMAPPI-R004** — Workflow Engine MUST coordinate durable multi-step transitions.

**LIFECYCLEMAPPI-R005** — Search and AI Engines MUST treat their outputs as derived.

**LIFECYCLEMAPPI-R006** — Acquisition MUST NOT be represented as synchronization.

**LIFECYCLEMAPPI-R007** — Personal synchronization MUST NOT modify Master publication state.

**LIFECYCLEMAPPI-R008** — Every persistent transition MUST emit or record an auditable domain event.

**LIFECYCLEMAPPI-R009** — Retryable transitions MUST be idempotent.

**LIFECYCLEMAPPI-R010** — Failure recovery MUST resume from the latest consistent state.

**LIFECYCLEMAPPI-R011** — Illegal transitions MUST fail explicitly.

## 7. Invariants

**LIFECYCLEMAPPI-I001** — Domain state ownership is unambiguous.

**LIFECYCLEMAPPI-I002** — Master, Local and Personal lifecycles remain separate.

**LIFECYCLEMAPPI-I003** — Derived processing cannot establish publication authority.

**LIFECYCLEMAPPI-I004** — Events follow committed state.

**LIFECYCLEMAPPI-I005** — Retries do not duplicate identity or side effects.

**LIFECYCLEMAPPI-I006** — Deletion semantics preserve convergence and lineage requirements.

## 8. Lifecycle and State Transitions

Lifecycle mappings are versioned with the architecture.

A transition begins from a known state, validates preconditions, performs the domain operation, commits the new state and records events. Long-running transitions use durable workflow checkpoints. Compensation SHALL preserve evidence and user knowledge.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

When a user chooses a Master Catalog book, Library starts local acquisition. Import validates the payload. Processing creates UDM/DPM. Library marks local availability `Available`. No personal synchronization event is involved.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `../KnowledgeLifecycle.md`
- `Versioning.md`
- `../../03-Kernel/WorkflowEngine.md`
- `../../04-Platform/Import/README.md`
- `../../04-Platform/Library/README.md`
- `../../04-Platform/Sync/README.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
