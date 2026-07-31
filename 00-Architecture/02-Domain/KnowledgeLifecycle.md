# Knowledge Lifecycle

**Project:** KnowledgeOS  
**Section:** Domain  
**Document:** KnowledgeLifecycle  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document defines the independent but coordinated lifecycles of publications, local availability, Personal Knowledge, canonical representations and derived artifacts.

## 2. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 3. Lifecycle Separation

KnowledgeOS SHALL maintain separate lifecycles for:

1. Master publication;
2. Local availability and acquisition;
3. Personal Knowledge;
4. Canonical processing;
5. Derived artifacts.

A transition in one lifecycle SHALL NOT implicitly mutate another.

## 4. Master Publication Lifecycle

```text
Discovered
    ↓
Validating
    ↓
Registered
    ↓
Active
    ├── NewVersion
    ├── Unavailable
    ├── Archived
    └── Removed
```

### Rules

- `Registered` requires stable identity and minimum provenance.
- `Active` requires valid source availability or an explicit external-reference policy.
- A new publication version creates a new `VersionId`.
- `Archived` preserves catalog and history.
- `Removed` does not automatically purge source evidence.
- Personal state is unaffected by Master state changes.

## 5. Local Availability Lifecycle

```text
Absent
    ↓
Acquiring
    ├── Paused
    ├── Failed
    └── Available
            ├── Evicted
            ├── Corrupt
            └── Removed
```

### Rules

- `Acquiring` begins only through explicit user or approved workflow intent.
- Acquisition SHALL be resumable and idempotent.
- `Available` requires integrity validation and local registration.
- `Evicted` preserves metadata and Personal Knowledge when policy permits.
- `Corrupt` isolates the payload and preserves recovery evidence.
- Local removal SHALL NOT remove the Master publication.

## 6. Personal Knowledge Lifecycle

```text
Created
    ↓
Modified
    ↓
PendingSynchronization
    ↓
Synchronized
    ├── Conflict
    │      ↓
    │    Merged
    └── Deleted
```

### Rules

- Personal Knowledge is committed locally first.
- Synchronization is independent of NAS availability.
- Conflicts preserve all competing versions.
- Merge produces a new version with explicit parents.
- Deletion uses tombstone semantics when convergence requires it.
- Master Library publication state is never changed.

## 7. Canonical Processing Lifecycle

```text
Queued
    ↓
Running
    ↓
Validating
    ├── Failed
    ├── Paused
    └── Published
```

Processing may create:

- UDM;
- DPM;
- canonical metadata;
- validation reports;
- provenance manifests.

Published canonical artifacts are immutable.

A failed workflow SHALL NOT publish partial canonical state.

## 8. Derived Artifact Lifecycle

```text
Missing
    ↓
Generating
    ├── Failed
    └── Available
            ├── Stale
            ├── Evicted
            └── Regenerating
```

Derived artifacts include:

- indexes;
- embeddings;
- thumbnails;
- previews;
- graph projections;
- materialized views;
- caches.

Derived artifacts MAY be deleted and regenerated.

## 9. Transition Ownership

| Transition | Owner |
|---|---|
| Master registration | Library Engine |
| Source intake | Import Engine |
| Acquisition | Library Engine + Import Engine |
| Canonical processing | Workflow Engine coordinating processing capabilities |
| Personal synchronization | Sync Engine |
| Index generation | Search Engine |
| Embedding generation | AI Engine |
| Export generation | Export Engine |

The Domain owns valid states and transitions.

Engines execute them.

## 10. Idempotency

Every retryable transition SHALL use stable operation identity.

Repeating the same successful operation SHALL NOT create duplicate:

- Knowledge Objects;
- source items;
- acquisitions;
- canonical versions;
- annotations;
- graph edges;
- events.

## 11. Recovery

Recovery SHALL resume from the latest consistent state.

The system SHALL preserve:

- original source;
- stable identity;
- committed Personal Knowledge;
- workflow checkpoints;
- provenance;
- validation findings.

Automatic recovery SHALL NOT discard authoritative user knowledge merely to restore availability.

## 12. Events

Persistent transitions produce domain events after commit.

An event SHALL identify:

- event identity;
- aggregate identity;
- previous state;
- new state;
- operation identity;
- version;
- actor;
- timestamp;
- provenance.

## 13. Invariants

**KL-I001** — Lifecycles remain separate.

**KL-I002** — Acquisition does not synchronize Personal Knowledge.

**KL-I003** — Personal synchronization does not acquire publications.

**KL-I004** — Master state does not own Personal Knowledge.

**KL-I005** — Published canonical versions are immutable.

**KL-I006** — Derived artifacts are rebuildable.

**KL-I007** — Illegal transitions fail explicitly.

**KL-I008** — Retries do not duplicate effects.

**KL-I009** — Recovery preserves identity and provenance.

**KL-I010** — Events follow committed state.

## 14. Related Documents

- `DomainModel.md`
- `EngineResponsibilities.md`
- `KnowledgeObject/LifecycleMapping.md`
- `KnowledgeObject/Versioning.md`
- `../03-Kernel/WorkflowEngine.md`
- `../04-Platform/Library/README.md`
- `../04-Platform/Import/README.md`
- `../04-Platform/Sync/README.md`

## 15. Status

This document is the normative lifecycle specification for KnowledgeOS Domain V4.
