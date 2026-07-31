# Sync Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** SyncEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define Personal Knowledge synchronization among approved Local Libraries using replaceable synchronization providers.

## 2. Scope

Covers change tracking, envelopes, convergence, conflict detection, merge, tombstones and provider abstraction. Excludes publication acquisition.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Sync Engine owns:

- Personal Knowledge change tracking;
- synchronization envelopes;
- provider-neutral synchronization;
- conflict detection;
- merge orchestration;
- tombstones;
- convergence state;
- synchronization diagnostics.

It SHALL NOT:

- synchronize Master Library publications;
- acquire publication payloads;
- write Personal Knowledge to NAS;
- redefine Local Library membership.

The approved Apple profile uses iCloud/CloudKit, but the Platform contract remains provider-independent.

## 5. Conceptual Model

```text
SyncEngine
├── ChangeTracker
├── SyncEnvelopeBuilder
├── ProviderAdapter contract
├── ConflictDetector
├── MergeCoordinator
├── TombstoneService
├── SyncStateRepository
└── Sync events
```

## 6. Normative Requirements

**SYNCENGINE-R001** — Only approved Personal Knowledge scopes MAY synchronize.

**SYNCENGINE-R002** — Every synchronized entity MUST preserve stable identity.

**SYNCENGINE-R003** — Changes MUST commit locally before publication to the provider.

**SYNCENGINE-R004** — Provider transport MUST not become Domain authority.

**SYNCENGINE-R005** — Conflict detection MUST preserve all competing versions.

**SYNCENGINE-R006** — Merge results MUST identify parent versions.

**SYNCENGINE-R007** — Deletion MUST converge through tombstones or equivalent semantics.

**SYNCENGINE-R008** — Synchronization MUST operate independently of NAS availability.

**SYNCENGINE-R009** — Publication payloads MUST NOT be transferred through personal synchronization.

**SYNCENGINE-R010** — Sync retries MUST be idempotent.

**SYNCENGINE-R011** — Encryption and provider privacy policy MUST be enforced.

**SYNCENGINE-R012** — Unsupported schema versions MUST fail explicitly.

## 7. Invariants

**SYNCENGINE-I001** — Personal Knowledge remains user-owned.

**SYNCENGINE-I002** — Master Library is not a sync peer.

**SYNCENGINE-I003** — Acquisition and synchronization remain separate.

**SYNCENGINE-I004** — Identity survives devices.

**SYNCENGINE-I005** — Conflicts are not silently discarded.

**SYNCENGINE-I006** — Convergence is eventually deterministic under the same merge rules.

## 8. Commands, Queries, Events and Workflows

Commands include `SynchronizePersonalState`, `ResolveSyncConflict`, `RetrySyncBatch` and `PurgeExpiredTombstones`.

Queries include `GetSyncStatus`, `ListSyncConflicts`, `GetEntitySyncHistory` and `GetProviderCapabilities`.

Events include `PersonalStateQueued`, `PersonalStateSynchronized`, `SyncConflictDetected`, `SyncConflictMerged` and `SyncProviderUnavailable`.

Large sync cycles use durable workflows and jobs.

## 9. Failure, Recovery and Degradation

Provider unavailability SHALL queue local changes and preserve offline operation. Corrupt remote records SHALL be isolated. Unknown commit status SHALL reconcile by stable identity before retry.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

A note modified independently on Mac and iPad produces two versions. Sync detects the branch and creates a merge task. The publication file remains outside this flow.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../Annotation/README.md`
- `../Library/README.md`
- `../../02-Domain/KnowledgeLifecycle.md`
- `../../03-Kernel/WorkflowEngine.md`
- `../../05-Integration/Providers/SyncProviders.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
