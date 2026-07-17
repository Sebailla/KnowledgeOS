
# Master Library Consistency

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Consistency

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the consistency model of the KnowledgeOS Master Library.

Consistency guarantees that every authoritative component of the Master Library evolves toward a coherent state while preserving data integrity, deterministic behavior and recoverability.

The consistency model coordinates:

* Catalog Storage;
* Source Storage;
* Cover Storage;
* Asset Storage;
* operational workflows;
* synchronization;
* backup;
* recovery.

---

# 2. Scope

This document applies to every operation that modifies or validates authoritative persistent data.

Including:

* imports;
* updates;
* replacements;
* synchronization;
* recovery;
* backup;
* restore;
* administrative operations.

Read-only operations are outside the scope unless they participate in consistency verification.

---

# 3. Architectural Goals

The consistency architecture shall guarantee:

* deterministic state evolution;
* recoverable failures;
* explicit transitions;
* immutable history;
* reproducible synchronization;
* implementation independence;
* eventual convergence.

---

# 4. Fundamental Principles

The consistency model follows these principles:

* no distributed transactions across storage services;
* authoritative state is explicit;
* consistency is verified, never assumed;
* every mutation is recoverable;
* failures leave detectable states;
* recovery is deterministic;
* historical revisions remain immutable.

---

# 5. Consistency Domains

Consistency is evaluated independently for:

* Catalog;
* Sources;
* Covers;
* Assets;
* Relationships;
* Metadata;
* Manifests;
* Backups.

A failure in one domain does not invalidate the verification process of the others, but it does prevent the Master Library from reaching a globally consistent state.

---

# 6. Consistency Levels

KnowledgeOS recognizes four consistency levels.

### Strong Consistency

Applied within a single transactional boundary.

Examples:

* PostgreSQL transactions;
* aggregate persistence;
* Catalog updates.

---

### Coordinated Consistency

Applied across multiple persistence services.

Examples:

* Catalog + Source Storage;
* Catalog + Cover Storage;
* Catalog + Asset Storage.

Coordination uses explicit commit protocols.

Distributed two-phase commit is prohibited.

---

### Eventual Consistency

Applied where asynchronous processing is acceptable.

Examples:

* search indexes;
* preview generation;
* thumbnail generation;
* AI embeddings;
* analytics.

These projections never become authoritative.

---

### Verified Consistency

Achieved only after successful Integrity verification.

This is the only state considered fully operational.

---

# 7. Consistency Boundaries

Each aggregate defines its own consistency boundary.

Examples include:

* Publication;
* Asset;
* Collection;
* Contributor;
* Subject.

Cross-aggregate consistency is achieved through coordination rather than shared transactions.

---

# 8. State Transitions

Every persistent object evolves through explicit state transitions.

Typical lifecycle:

```text
Pending

↓

Validated

↓

Committed

↓

Current

↓

Superseded

↓

Archived
```

Intermediate states are visible only to operational workflows.

---

# 9. Coordinated Commit

Operations spanning multiple services follow this logical sequence:

```text
Validate

↓

Persist Binary

↓

Verify Binary

↓

Persist Catalog

↓

Publish Events

↓

Verify Integrity
```

A service becoming available before the sequence completes does not imply a consistent state.

---

# 10. Interrupted Operations

Interrupted operations produce recoverable states.

Examples:

* binary committed, catalog pending;
* catalog committed, event pending;
* manifest pending.

Such states are never considered operationally consistent until Recovery completes.

---

# 11. Synchronization Consistency

Synchronization guarantees convergence toward the same authoritative state.

Synchronization never assumes:

* clocks;
* timestamps;
* filenames;
* storage paths.

Consistency is determined by identities, revisions and integrity verification.

---

# 12. Backup Consistency

A backup represents one consistency point.

Objects originating from different consistency points shall never be combined into a single authoritative backup.

---

# 13. Restore Consistency

Restore preserves:

* identities;
* revisions;
* references;
* manifests;
* checksums.

Activation occurs only after successful Integrity verification.

---

# 14. Operational Consistency

Operational metadata may temporarily diverge from authoritative data during execution.

Examples:

* import queues;
* synchronization queues;
* recovery plans;
* background jobs.

These structures never define authoritative state.

---

# 15. Failure Model

Consistency failures include:

* broken references;
* missing binaries;
* duplicate Current revisions;
* orphan objects;
* checksum mismatches;
* manifest inconsistencies.

Every failure is explicit.

---

# 16. Recovery Integration

Recovery restores consistency.

Recovery never introduces new authoritative information.

Every recovery concludes with Integrity verification.

---

# 17. Event Ordering

Events generated from committed operations preserve causal ordering.

Consumers shall tolerate delayed delivery.

Consumers shall never assume immediate delivery.

---

# 18. Idempotency

Every consistency operation shall be idempotent whenever possible.

Executing the same operation multiple times shall not create duplicated authoritative state.

---

# 19. Convergence

Regardless of temporary failures, the architecture shall converge toward a unique authoritative state once:

* synchronization completes;
* recovery succeeds;
* integrity verification passes.

---

# 20. Forbidden Operations

The following are prohibited:

* distributed two-phase commit across storage services;
* implicit state transitions;
* silent conflict resolution;
* hidden metadata mutation;
* publishing inconsistent state as authoritative;
* bypassing integrity verification.

---

# 21. Invariants

The following invariants are mandatory:

* every authoritative object belongs to exactly one consistent revision history;
* only one Current revision exists per aggregate;
* consistency is verified before activation;
* interrupted operations remain recoverable;
* historical revisions are immutable;
* asynchronous projections never become authoritative;
* consistency failures always remain detectable;
* recovery preserves identities;
* verification never mutates authoritative data.

---

# 22. Related Documents

* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `AssetStorage.md`
* `Checksums.md`
* `Integrity.md`
* `Recovery.md`
* `BackupRestore.md`
* `Locking.md`

---

# 23. Status

**Approved**

The Consistency architecture is frozen as the authoritative model governing state evolution within the KnowledgeOS Master Library. It defines deterministic coordination across persistence services while preserving immutable history, recoverable execution and implementation-independent consistency semantics.
