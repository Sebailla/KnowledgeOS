
# Master Library Locking

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Locking

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the concurrency and locking architecture of the KnowledgeOS Master Library.

Its purpose is to coordinate concurrent operations without compromising consistency, integrity or recoverability.

Locking prevents conflicting modifications while allowing maximum parallelism for independent operations.

---

# 2. Scope

This document applies to every operation that modifies authoritative data.

Including:

* imports;
* replacements;
* synchronization;
* recovery;
* backup preparation;
* metadata updates;
* administrative operations.

Read-only operations are normally lock-free.

---

# 3. Architectural Goals

The locking architecture shall guarantee:

* deterministic concurrency;
* conflict prevention;
* deadlock avoidance;
* recoverable execution;
* scalable parallelism;
* implementation independence.

---

# 4. Principles

The locking model follows these principles:

* logical locks instead of filesystem locks;
* short-lived exclusive locks;
* optimistic concurrency whenever possible;
* explicit ownership;
* lease-based expiration;
* recoverable lock state;
* no permanent locks;
* no hidden synchronization.

---

# 5. Architectural Model

Locking is coordinated by the Master Library rather than individual storage services.

```text
Operation
      │
      ▼
Lock Manager
      │
      ▼
Lease
      │
      ▼
Protected Resource
```

Storage services never coordinate locks independently.

---

# 6. Lock Manager

The Lock Manager is responsible for:

* creating locks;
* renewing leases;
* releasing locks;
* detecting stale locks;
* preventing conflicts;
* publishing lock events.

The Lock Manager does not modify business data.

---

# 7. Lock Types

KnowledgeOS defines four lock types.

### Shared Lock

Allows multiple concurrent readers.

No modifications are permitted.

---

### Exclusive Lock

Allows exactly one modifying operation.

No concurrent modifications are permitted.

---

### Intent Lock

Indicates that a workflow will request stronger locks.

Intent locks reduce contention during complex operations.

---

### Administrative Lock

Used during maintenance operations such as migration, recovery or restore.

Administrative locks override normal operational scheduling.

---

# 8. Lock Scope

Locks may protect:

* Publication;
* Asset;
* Collection;
* Import Session;
* Synchronization Session;
* Recovery Session;
* Backup Session.

Lock scope shall be as small as possible.

---

# 9. Lease Model

Every lock is implemented as a lease.

A lease contains:

* LeaseId;
* Owner;
* ResourceId;
* LockType;
* CreationTime;
* ExpirationTime;
* RenewalCount.

Leases are immutable except for renewal metadata.

---

# 10. Lease Expiration

Expired leases are no longer authoritative.

Expiration never modifies protected resources.

Expired leases become eligible for cleanup.

---

# 11. Lease Renewal

Long-running operations renew their leases periodically.

Renewal extends expiration without changing ownership.

Failure to renew eventually releases the resource.

---

# 12. Lock Acquisition

General acquisition sequence:

```text
Request

↓

Conflict Detection

↓

Lease Allocation

↓

Operation Start
```

Only conflict-free requests receive a lease.

---

# 13. Lock Release

Locks are released:

* after successful completion;
* after cancellation;
* after rollback;
* after expiration.

Release is always explicit or lease-driven.

---

# 14. Conflict Detection

Conflicts occur when:

* two exclusive locks target the same resource;
* an exclusive lock conflicts with existing shared locks;
* administrative locks suspend operational work.

Conflicts are resolved before execution begins.

---

# 15. Deadlock Prevention

The architecture avoids deadlocks by:

* deterministic acquisition order;
* bounded lock lifetime;
* lease expiration;
* lock hierarchy;
* retry policies.

Deadlock detection becomes an exceptional safety mechanism rather than the primary strategy.

---

# 16. Optimistic Concurrency

Whenever possible, metadata updates use optimistic concurrency.

Typical workflow:

```text
Read Revision

↓

Modify

↓

Compare Revision

↓

Commit
```

Revision mismatch rejects the operation.

---

# 17. Long-Running Operations

Operations such as:

* import;
* synchronization;
* recovery;
* migration;
* backup preparation;

maintain renewable leases throughout execution.

---

# 18. Read Operations

Read operations normally execute without exclusive locks.

Readers rely on:

* committed revisions;
* MVCC (where applicable);
* immutable binaries.

Reading never blocks committed history.

---

# 19. Recovery Integration

Recovery may reclaim abandoned leases.

Recovery never interrupts healthy operations.

Recovered leases generate audit records.

---

# 20. Backup Integration

Backup acquires consistency leases before establishing its consistency point.

Normal reads continue whenever possible.

Long exclusive pauses are prohibited.

---

# 21. Synchronization Integration

Synchronization acquires locks only for resources being updated.

Independent Publications may synchronize concurrently.

Global synchronization locks are prohibited.

---

# 22. Administrative Operations

Administrative workflows may acquire broader lock scopes.

Examples include:

* restore;
* migration;
* integrity rebuild;
* storage relocation.

Administrative locks remain fully auditable.

---

# 23. Lock Events

The Lock Manager publishes events such as:

* LockGranted;
* LockRenewed;
* LockReleased;
* LeaseExpired;
* LockRejected.

Events are informational.

They never define authoritative state.

---

# 24. Audit

Every lease operation records:

* LeaseId;
* owner;
* resource;
* timestamps;
* renewals;
* release reason;
* final status.

Audit history is append-only.

---

# 25. Failure Handling

Possible failures include:

* owner crash;
* network interruption;
* process termination;
* timeout;
* renewal failure.

Lease expiration guarantees eventual recovery.

---

# 26. Forbidden Operations

The following are prohibited:

* permanent locks;
* manual filesystem locking;
* hidden lock ownership;
* lock acquisition without timeout;
* global exclusive library locks during normal operation;
* modifying committed history while bypassing Lock Manager.

---

# 27. Invariants

The following invariants are mandatory:

* every exclusive lock has one owner;
* every lease has an expiration time;
* abandoned leases become recoverable;
* committed history remains readable;
* lock ownership is explicit;
* lock state is auditable;
* deadlock prevention is deterministic;
* lock acquisition never bypasses conflict detection;
* lease expiration never modifies authoritative data;
* concurrency never compromises integrity.

---

# 28. Related Documents

* `CatalogDatabase.md`
* `CatalogSchema.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `AssetStorage.md`
* `Checksums.md`
* `Integrity.md`
* `Consistency.md`
* `Recovery.md`
* `BackupRestore.md`

---

# 29. Status

**Approved**

The Locking architecture is frozen as the authoritative concurrency model for the KnowledgeOS Master Library. It defines lease-based coordination, deterministic conflict prevention, optimistic concurrency, recoverable execution and implementation-independent synchronization while preserving immutable history and the integrity of authoritative data.
