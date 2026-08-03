# Provider Fallback

**Project:** KnowledgeOS  
**Section:** Implementation / Personal Knowledge Sync / 05-Provider  
**Document:** ProviderFallback  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the provider fallback for Personal Knowledge synchronization, covering CloudKit mapping and provider-neutral synchronization integration.

## 2. Module Boundary

This module synchronizes user-owned Personal Knowledge among approved client devices.

Included:

- annotations;
- highlights;
- notes;
- bookmarks;
- reading progress;
- collections;
- personal relationships;
- selected Personal AI artifacts;
- change tracking;
- sync envelopes;
- provider adapters;
- conflicts and merge;
- tombstones;
- retries and recovery;
- desktop, mobile and optional web integration;
- contracts, tests and operations.

Excluded:

- publication payloads;
- Master Catalog records;
- source files;
- canonical UDM or DPM;
- Local Library membership;
- acquisition;
- canonical processing;
- search indexes;
- graph persistence;
- AI provider execution.

## 3. Architectural Context

```text
Local Personal Knowledge
          │
          ▼
    Durable Change Journal
          │
          ▼
     Sync Envelope Builder
          │
          ▼
  Provider-Neutral Sync Contract
          │
          ▼
   CloudKit / Approved Provider
          │
          ▼
 Other User-Owned Local Libraries
```

The NAS Master Library is outside this topology.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Only approved Personal Knowledge entities SHALL participate in synchronization.
- Publication payloads SHALL NOT be transferred through Personal Knowledge synchronization.
- Master Catalog records SHALL NOT be synchronized by this module.
- Local Library membership SHALL NOT be synchronized by this module.
- The NAS Master Library SHALL NOT be a synchronization peer.
- Stable Personal Knowledge identity SHALL be preserved across devices.
- Changes SHALL commit locally before synchronization.
- Provider transport SHALL NOT become Domain authority.
- Conflict detection SHALL preserve all competing versions.
- Merge results SHALL identify all parent versions.
- Deletion SHALL converge through tombstones or equivalent semantics.
- Retryable operations SHALL be idempotent.
- Offline operation SHALL preserve local commits and pending changes.
- Unsupported schema versions SHALL fail explicitly.
- Synchronization SHALL remain independent from acquisition.
- Personal Knowledge SHALL remain user-owned.
- CloudKit records SHALL remain adapter representations rather than Domain models.
- Provider zones and subscriptions SHALL preserve account and user scope.
- Push notifications SHALL trigger synchronization checks, not imply committed changes.
- Provider errors SHALL map to stable common categories.
- Provider migrations SHALL preserve entity identity, version and tombstone semantics.

## 6. Synchronization State Model

```text
LocalCommitted
→ PendingUpload
→ Uploading
→ ProviderAcknowledged
→ Synchronized
```

Additional states include:

- PendingDownload;
- ApplyingRemote;
- Conflict;
- MergePending;
- RetryScheduled;
- ProviderUnavailable;
- Incompatible;
- Tombstoned;
- PurgeEligible.

A provider acknowledgement does not replace local Domain commit.

## 7. Change and Version Model

Every synchronized entity SHOULD include:

- entity identity;
- entity type;
- current version identity;
- parent version identities;
- operation identity;
- change kind;
- local commit time;
- semantic event time where relevant;
- source device identity class;
- privacy scope;
- payload fingerprint;
- schema version;
- tombstone state;
- provenance.

Device serial numbers or personally identifying hardware values SHALL not be embedded in public sync identities.

## 8. Conflict and Merge

Conflicts may arise from:

- concurrent edits;
- edit versus delete;
- incompatible schema;
- reanchoring divergence;
- collection membership divergence;
- personal relationship divergence;
- provider replay or out-of-order delivery.

Merge SHALL:

- preserve parent versions;
- preserve user content;
- remain auditable;
- avoid fabricating canonical publication changes;
- create a new Personal Knowledge version;
- synchronize the merged result idempotently.

Entity-specific merge policies SHALL be explicit.

## 9. Failure and Recovery

The module SHALL handle:

- no network;
- unavailable provider;
- expired authentication;
- quota exhaustion;
- partial batch upload;
- unknown provider commit state;
- out-of-order changes;
- duplicate delivery;
- corrupt provider record;
- incompatible schema;
- missing publication reference;
- interrupted local application;
- tombstone retention mismatch;
- account change.

Recovery SHALL preserve local commits, pending operations, conflicts, tombstones and provider cursors.

## 10. Security and Privacy

- Personal Knowledge SHALL remain user-owned.
- Provider account scope SHALL be explicit.
- Credentials SHALL use approved secure storage.
- Sync payloads SHALL contain only necessary data.
- Publication content SHALL not be copied into sync envelopes except for explicitly approved Personal Knowledge content.
- Logs SHALL not include notes, annotations, reading history or secrets.
- Provider records SHALL use appropriate encryption and access control.
- Account sign-out SHALL follow explicit local-retention and remote-access policy.
- Web synchronization, if enabled, SHALL use a clearly documented trust and session model.

## 11. Performance and Resource Management

The implementation SHOULD:

- batch compatible changes;
- use incremental synchronization;
- apply bounded payload sizes;
- support backpressure;
- avoid retry storms;
- prioritize user-visible conflicts appropriately;
- respect mobile background and energy limits;
- avoid blocking local editing;
- compress approved large Personal assets;
- expose synchronization lag and queue depth;
- keep provider polling within platform limits.

## 12. Verification and Acceptance

- Offline Personal Knowledge edits commit locally.
- Pending edits synchronize when connectivity returns.
- Stable identities survive macOS, iPhone and iPad.
- Concurrent edits produce explicit conflicts or approved deterministic merges.
- Merge preserves parent versions.
- Tombstones converge and identities are not reused.
- Duplicate delivery does not duplicate entities.
- Provider outage does not block local reading or annotation.
- NAS availability does not affect Personal Knowledge synchronization.
- Publication payloads, Master Catalog records and Local Library membership are excluded.
- CloudKit adapter does not leak provider types into Domain contracts.
- Privacy, performance, retry and recovery tests pass.
- Architecture traceability is complete.

## 13. Traceability

- `00-Architecture/04-Platform/Sync/README.md`
- `00-Architecture/02-Domain/KnowledgeLifecycle.md`
- `00-Architecture/02-Domain/Identity/README.md`
- `00-Architecture/05-Integration/Providers/SyncProviders.md`
- `00-Architecture/05-Integration/Synchronization/README.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/03-Kernel/EventBus.md`
- `01-Implementation/13-AnnotateAndAuthoring/README.md`
- `01-Implementation/03-MobileApplication/README.md`
- `01-Implementation/02-DesktopApplication/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 14. Compatibility and Migration

Sync envelopes, entity schemas, provider mappings, cursors, tombstones, conflicts and public contracts SHALL be versioned.

Breaking changes require migration that preserves entity identity, pending changes, conflicts, tombstones and convergence semantics.

## 15. Status

This document is part of the KnowledgeOS Personal Knowledge Sync V4 implementation baseline.
