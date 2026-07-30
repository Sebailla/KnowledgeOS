
# Locking

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Concurrency

**Document:** Locking

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the locking model of KnowledgeOS.

Locking provides bounded coordination for operations that cannot safely execute concurrently.

The purpose of locking is to protect:

* shared mutable state;
* critical sections;
* canonical commit boundaries;
* exclusive lifecycle transitions;
* Resource ownership;
* non-reentrant operations;
* operations requiring serialized access.

Locks are execution mechanisms.

They do not define:

* canonical identity;
* Domain authority;
* Source of Truth;
* Version semantics;
* conflict resolution;
* distributed consensus.

Locking shall be used only where the required correctness guarantee cannot be achieved more safely through:

* immutability;
* single ownership;
* optimistic concurrency;
* Version validation;
* message serialization;
* transactional constraints.

---

# 2. Scope

This document governs locking across:

* Commands;
* Jobs;
* Workflows;
* Platform Engines;
* Library operations;
* canonical writes;
* Plugin lifecycle;
* Provider lifecycle;
* credential refresh;
* synchronization Sessions;
* Storage operations;
* migrations;
* cache maintenance;
* background processing;
* Resource allocation;
* process-local execution;
* cross-process coordination where explicitly supported.

This document also governs:

* lock identity;
* lock scope;
* lock ownership;
* acquisition;
* release;
* timeout;
* cancellation;
* reentrancy;
* fairness;
* deadlock prevention;
* lease-based coordination;
* stale locks;
* failure recovery;
* lock observability.

This document does not define:

* concrete language mutex APIs;
* database-specific lock syntax;
* filesystem-specific locking implementation;
* distributed consensus protocols;
* synchronization conflict policy;
* transaction isolation implementation.

---

# 3. Architectural Position

Locking belongs to the Execution layer.

```text
Operation
    │
    ▼
Concurrency Policy
    │
    ▼
Locking Strategy
    │
    ▼
Protected Critical Scope
```

The Domain defines the invariant.

Execution determines whether a lock is required to preserve it.

---

# 4. Core Principle

The fundamental principle is:

> Locks protect bounded execution scopes.

A lock shall never be treated as proof of:

* canonical authority;
* global exclusivity;
* remote exclusivity;
* persistent identity;
* external system state;
* successful completion.

---

# 5. Mission

The mission of locking is to prevent unsafe overlapping execution while minimizing:

* contention;
* deadlock;
* starvation;
* latency;
* Resource waste;
* availability loss;
* accidental global serialization.

---

# 6. Design Philosophy

Locking shall be:

* explicit;
* scoped;
* bounded;
* minimal;
* observable;
* cancellation-aware;
* failure-aware;
* replaceable where better coordination strategies exist.

---

# 7. Lock Definition

A Lock grants temporary exclusive or restricted access to a declared execution scope.

A Lock may protect:

* one mutable object;
* one Resource;
* one lifecycle transition;
* one Provider Connection;
* one synchronization scope;
* one physical target;
* one critical operation.

---

# 8. Lock Scope

Every Lock shall define the exact scope it protects.

Possible scopes include:

* Application;
* Process;
* Device;
* Library;
* Workspace;
* Knowledge Object;
* Document;
* Annotation;
* Asset;
* Plugin;
* Provider;
* Provider Connection;
* Storage Location;
* Synchronization Peer;
* Synchronization Endpoint;
* Workflow;
* Job;
* Resource.

---

# 9. Scope Identity

A Lock Scope shall have stable identity for the duration of the coordination need.

Examples include:

* Library Identity;
* Knowledge Object Identity;
* Plugin Identity;
* Provider Connection Identity;
* Peer Identity;
* Storage Location Identity.

Transient memory addresses shall not define durable lock scope.

---

# 10. Smallest Correct Scope

The smallest scope preserving correctness shall be used.

Preferred:

```text
Lock Knowledge Object A
```

Discouraged:

```text
Lock entire Library
```

A broad Lock shall require explicit architectural justification.

---

# 11. Lock Types

KnowledgeOS may use:

* Exclusive Locks;
* Shared Locks;
* Read-Write Locks;
* Semaphore-like Limits;
* Leases;
* Actor Serialization;
* Advisory Locks;
* Transactional Locks.

These mechanisms provide different guarantees.

They shall not be treated as equivalent.

---

# 12. Exclusive Lock

An Exclusive Lock permits one owner to access a protected scope at a time.

Exclusive locking may be appropriate for:

* Source of Truth migration;
* Plugin installation or removal;
* Provider credential rotation;
* non-reentrant migration;
* canonical write sequence requiring strict serialization.

---

# 13. Shared Lock

A Shared Lock permits multiple compatible readers while excluding incompatible writers.

Shared locking shall only be used when:

* read operations are genuinely compatible;
* the implementation guarantees correct exclusion;
* complexity is justified.

---

# 14. Read-Write Lock

A Read-Write Lock distinguishes:

* shared readers;
* exclusive writers.

It shall not be assumed superior to immutable snapshots or optimistic Versioning.

---

# 15. Semaphore

A Semaphore limits concurrent use of a bounded Resource.

Examples include:

* OCR worker count;
* AI Provider request concurrency;
* remote execution slots;
* export worker count.

A Semaphore limits capacity.

It does not protect semantic identity by itself.

---

# 16. Lease

A Lease grants temporary ownership for a bounded time.

Leases may be used for:

* durable Job claims;
* cross-process work ownership;
* distributed worker coordination;
* temporary Session ownership.

A Lease may expire.

Expiration does not prove the previous owner stopped execution.

---

# 17. Actor Serialization

Actor-like ownership may serialize access without exposing explicit Locks to callers.

This is preferred where one component owns mutable state and processes one message at a time.

---

# 18. Advisory Lock

An Advisory Lock is effective only when all participants cooperate.

It shall not be treated as enforcement against external tools or uncooperative processes.

---

# 19. Transactional Lock

A Transactional Lock exists within a transaction or persistence mechanism.

Its lifetime and guarantees are limited to the transaction and underlying storage.

---

# 20. Lock Ownership

Every acquired Lock shall have one owner.

Ownership may belong to:

* Execution Context;
* Command;
* Job Attempt;
* Workflow Step;
* Session;
* process;
* worker.

Ownership shall be observable where operationally significant.

---

# 21. Owner Identity

The owner identity shall be distinct from the protected Resource identity.

Example:

```text
Owner: JobAttempt-27
Scope: KnowledgeObject-42
```

---

# 22. Acquisition

Lock acquisition shall be explicit.

An operation shall know whether acquisition:

* succeeded;
* timed out;
* was cancelled;
* failed;
* obtained a stale or invalid lease.

---

# 23. Blocking Acquisition

Blocking acquisition may be used for short bounded waits.

Unbounded blocking is prohibited.

---

# 24. Try-Acquire

Try-acquire may be used when an operation can:

* defer;
* reschedule;
* return busy state;
* choose another Resource.

---

# 25. Lock Timeout

Every potentially blocking Lock acquisition shall have bounded timeout or cancellation semantics.

---

# 26. Timeout Meaning

A Lock timeout means the Lock was not obtained within the permitted wait.

It does not imply:

* the current owner failed;
* the protected operation is invalid;
* the Resource is permanently unavailable.

---

# 27. Cancellation

Waiting for a Lock shall respect cancellation where practical.

Cancellation shall release any partially acquired coordination state.

---

# 28. Lock Release

Locks shall be released:

* explicitly;
* automatically through structured lifetime;
* transactionally;
* through lease expiration where applicable.

Release shall occur even when execution fails.

---

# 29. Structured Lifetime

Lock lifetime should be bound to a structured execution scope.

The preferred pattern is:

```text
Acquire
    │
    ▼
Execute Critical Section
    │
    ▼
Release
```

Release shall not depend upon manually reaching one success path only.

---

# 30. Critical Section

A Critical Section is the minimal code region requiring protected access.

Critical Sections shall be:

* short;
* bounded;
* free from unnecessary I/O;
* free from unrelated work;
* observable where contention matters.

---

# 31. External Calls Inside Locks

Long external operations should not execute while holding internal Locks.

Examples include:

* network requests;
* remote AI calls;
* cloud writes;
* Webhook delivery;
* remote OCR;
* user confirmation.

---

# 32. Prepare-Commit Pattern

When external work is required, prefer:

```text
Read Stable State
      │
      ▼
Release Coordination
      │
      ▼
Perform External Work
      │
      ▼
Reacquire / Validate Version
      │
      ▼
Commit
```

This avoids holding Locks during remote latency.

---

# 33. Version Validation After External Work

After external work completes, the operation shall revalidate assumptions before commit.

A Lock held before the external call shall not be assumed to protect state after release.

---

# 34. Lock Duration

Lock duration shall be minimized.

Long-held Locks increase:

* contention;
* latency;
* deadlock risk;
* priority inversion;
* failure impact.

---

# 35. Long-Running Operations

Long-running operations shall use:

* state machines;
* checkpoints;
* leases;
* Version validation;
* short commit Locks.

They shall not hold broad Locks for their entire lifetime.

---

# 36. Reentrancy

Reentrant locking permits the same owner to acquire the same Lock repeatedly.

Reentrancy shall not be assumed by default.

---

# 37. Reentrant Risk

Reentrant Locks may hide:

* recursive control flow;
* oversized critical sections;
* unclear ownership;
* unexpected lock depth.

Use shall be justified.

---

# 38. Non-Reentrant Default

Non-reentrant semantics are preferred unless a clear architectural requirement exists.

---

# 39. Nested Locks

Acquiring multiple Locks simultaneously increases deadlock risk.

Nested locking shall be minimized.

---

# 40. Lock Ordering

Where multiple Locks are required, a consistent global acquisition order shall be defined.

Example:

```text
Library
    │
    ▼
Knowledge Object
    │
    ▼
Asset
```

All participants shall follow the same order.

---

# 41. Deadlock

Deadlock occurs when operations wait cyclically for each other's Locks.

```text
Operation A owns Lock 1 and waits for Lock 2
Operation B owns Lock 2 and waits for Lock 1
```

Deadlock prevention is mandatory.

---

# 42. Deadlock Prevention Strategies

KnowledgeOS may use:

* consistent Lock ordering;
* single owner isolation;
* avoiding nested Locks;
* bounded try-acquire;
* transaction restructuring;
* optimistic concurrency;
* actor serialization.

---

# 43. Deadlock Detection

Where deadlock cannot be structurally prevented, the implementation may use detection and victim selection.

Detection is secondary to prevention.

---

# 44. Deadlock Recovery

Recovery may involve:

* cancelling one operation;
* rolling back one transaction;
* expiring one Lease;
* retrying with bounded policy.

---

# 45. Livelock

Livelock occurs when operations repeatedly yield or retry without making progress.

Randomized backoff and contention control may reduce livelock.

---

# 46. Starvation

Starvation occurs when one operation waits indefinitely while others repeatedly acquire the Lock.

Lock scheduling should provide reasonable fairness.

---

# 47. Fairness

Fairness may use:

* FIFO ordering;
* priority aging;
* bounded priority preference;
* scope-aware scheduling.

Strict fairness may reduce throughput.

The chosen policy shall reflect workload needs.

---

# 48. Priority Inversion

Priority inversion occurs when high-priority work waits for a Lock held by low-priority work.

Mitigation may include:

* short critical sections;
* priority inheritance where supported;
* avoiding broad Locks;
* preventing background work from holding interactive Resources.

---

# 49. Lock Contention

Contention shall be treated as observable runtime behavior.

Persistent contention may indicate:

* scope too broad;
* critical section too long;
* excessive concurrency;
* incorrect ownership model;
* missing partitioning.

---

# 50. Lock Granularity

Fine-grained Locks increase concurrency but increase complexity.

Coarse-grained Locks simplify coordination but reduce throughput.

Granularity shall be chosen based on actual invariants.

---

# 51. Lock Striping

Lock striping may partition many independent Resources across a bounded set of Locks.

It is an implementation optimization.

Collisions reduce concurrency but shall not compromise correctness.

---

# 52. Lock Identity Collision

If hashed or striped Lock identities collide, operations may serialize unnecessarily.

They shall never access unrelated mutable state unsafely.

---

# 53. Canonical State Locks

Locks protecting canonical state shall align with:

* transaction boundaries;
* Version validation;
* Domain invariants;
* Event publication boundaries.

---

# 54. Locks Do Not Replace Transactions

A Lock may prevent overlapping access.

It does not automatically provide:

* atomic persistence;
* rollback;
* durability;
* crash consistency.

---

# 55. Locks Do Not Replace Version Checks

A Lock may protect local execution.

It does not detect remote or offline changes unless the locking system spans those actors with valid guarantees.

Version validation remains required where external concurrency exists.

---

# 56. Locks Do Not Define Authority

Possession of a Lock does not determine:

* Source of Truth;
* canonical ownership;
* user authorization;
* Domain permission.

---

# 57. Lock and Command Execution

Commands affecting the same invariant scope may require serialized execution or Version validation.

The Command Handler shall not expose Lock primitives as Domain concepts.

---

# 58. Lock and Query Execution

Queries should avoid exclusive Locks where possible.

Snapshot reads or immutable projections are preferred.

---

# 59. Lock and Event Processing

Event Handlers shall not assume they are the only Handler modifying a shared Resource.

Coordination shall be explicit.

---

# 60. Lock and Job Execution

Durable Jobs may use Leases to prevent uncontrolled duplicate worker execution.

A Job Lease shall have:

* owner;
* expiration;
* renewal policy;
* recovery semantics.

---

# 61. Lease Renewal

Long-running Job ownership may renew its Lease.

Renewal shall stop when:

* execution ends;
* ownership is lost;
* process terminates;
* cancellation occurs.

---

# 62. Lease Loss

If a worker loses its Lease, it shall stop committing new protected effects unless it can safely reestablish ownership.

---

# 63. Fencing Token

Lease-based coordination may use a monotonically increasing Fencing Token.

The protected Resource may reject writes using stale tokens.

---

# 64. Fencing Importance

Lease expiration alone cannot prevent a delayed previous owner from acting.

A Fencing Token provides stronger stale-owner protection where supported.

---

# 65. Workflow Locks

Workflows shall not hold Locks across long pauses or user interaction.

They should persist state and reacquire bounded coordination for each critical transition.

---

# 66. Import Locks

Import may require short coordination for:

* duplicate operation registration;
* canonical commit;
* Asset placement;
* object Version creation.

OCR and conversion stages shall not hold Library-wide Locks.

---

# 67. Export Locks

Export generally reads a stable snapshot.

It should not lock canonical source state for the complete export duration.

---

# 68. Annotation Locks

Concurrent edits to one Annotation may use:

* Version checks;
* per-Annotation serialization;
* transactional update.

Library-wide locking is prohibited for ordinary annotation editing.

---

# 69. Render Locks

Rendering should avoid canonical Locks.

Render state should use:

* immutable snapshots;
* viewport identity;
* cancellation;
* supersession.

---

# 70. Search Locks

Search Queries should not hold Locks on canonical content.

Index update coordination shall remain separate from read execution where possible.

---

# 71. Library Locks

Library-wide Locks may be justified for:

* Source of Truth migration;
* global schema migration;
* destructive Library reset;
* exclusive integrity repair.

They are not appropriate for ordinary object edits.

---

# 72. Source of Truth Migration Lock

A Source of Truth migration requires explicit exclusive coordination over the migration scope.

The Lock shall prevent incompatible canonical writes during cutover.

---

# 73. Storage Locks

Filesystem or Provider Locks may protect physical operations.

Their guarantees shall be declared.

A Storage Lock shall not be assumed reliable across all platforms.

---

# 74. File Locks

File Locks may be:

* advisory;
* mandatory;
* process-local;
* system-wide;
* unsupported.

Provider behavior shall be explicit.

---

# 75. Network Filesystem Locks

Network filesystem locking may be affected by:

* connection loss;
* stale clients;
* server restart;
* cache behavior;
* protocol differences.

KnowledgeOS shall not depend upon such Locks as the sole protection of canonical invariants.

---

# 76. Storage Conditional Writes

Where possible, conditional writes using Version or generation values are preferred over broad physical Locks.

---

# 77. Synchronization Locks

Synchronization may require serialization per:

* Peer;
* Endpoint;
* Library scope;
* Baseline;
* Session scope.

---

# 78. Peer Session Lock

Only one active Session should normally mutate one Peer synchronization scope at a time unless the protocol supports safe partitioned concurrency.

---

# 79. Sync Locks Do Not Resolve Conflict

A local synchronization Lock cannot prevent a remote Peer from evolving independently.

Domain and Sync conflict handling remain necessary.

---

# 80. Provider Locks

Provider coordination may protect:

* connection lifecycle;
* token refresh;
* rate-limit state;
* session initialization;
* Provider shutdown.

---

# 81. Credential Refresh Lock

Refresh for one credential set shall use single-flight or equivalent serialization.

The Lock scope shall be one credential set or Provider Connection.

---

# 82. Plugin Locks

Plugin lifecycle operations may require serialization per Plugin Identity.

Examples include:

* install;
* update;
* enable;
* disable;
* uninstall.

---

# 83. Plugin Execution Lock

Plugins may require serialized execution per instance when they are not reentrant.

This shall be declared or conservatively assumed.

---

# 84. Remote Execution Locks

Remote operation submission shall not depend solely upon a local Lock for duplicate prevention.

Stable remote Idempotency Keys and reconciliation remain necessary.

---

# 85. Public API Locks

Public API clients shall not control internal Lock primitives directly.

APIs expose:

* operation status;
* conflict responses;
* retry guidance;
* Version preconditions.

---

# 86. Lock Scope Across Processes

A process-local Lock protects only one process.

It shall not be described as device-wide or distributed.

---

# 87. Cross-Process Lock

Cross-process coordination may use:

* database constraints;
* durable Lease;
* file Lock;
* OS synchronization primitive;
* storage Versioning.

The guarantee shall be explicit.

---

# 88. Cross-Device Locking

Continuous distributed locking across Offline First devices shall not be assumed as a general architecture strategy.

Cross-device concurrency is handled through:

* Versioning;
* synchronization metadata;
* conflict detection;
* reconciliation.

---

# 89. Offline Operation

A device operating offline cannot rely on a remote Lock service.

Local execution shall preserve valid local semantics without pretending global exclusivity.

---

# 90. Stale Lock

A Stale Lock is coordination state whose owner no longer legitimately controls the scope.

Stale Locks may result from:

* process crash;
* network partition;
* device sleep;
* worker failure;
* missed release.

---

# 91. Stale Lock Recovery

Recovery may use:

* owner liveness;
* timeout;
* Lease expiration;
* Fencing Token;
* manual intervention;
* transaction rollback.

---

# 92. Force Unlock

Force unlock is a privileged recovery operation.

It shall be used only when the system can establish that removing the Lock will not violate correctness.

---

# 93. Force Unlock Audit

Force unlock should produce audit or diagnostic evidence where the Lock protects significant state.

---

# 94. Lock Persistence

Persistent Locks or Leases shall store only required operational metadata.

They shall not embed:

* sensitive document content;
* credentials;
* arbitrary execution payloads.

---

# 95. Lock Retention

Released or expired Lock records may be retained briefly for diagnostics.

Unbounded lock history is prohibited.

---

# 96. Cancellation While Holding Lock

Cancellation shall cause the critical section to:

* stop at a safe point;
* roll back uncommitted state;
* release the Lock;
* preserve no false completion state.

---

# 97. Failure While Holding Lock

Implementation shall release or expire coordination state even when:

* exceptions occur;
* process terminates;
* operation times out;
* worker disconnects.

---

# 98. Partial Commit

A Lock does not protect against partial persistence after process failure.

Transactions, atomic replacement and recovery mechanisms remain required.

---

# 99. Lock Upgrade

Upgrading a shared Lock to exclusive ownership can deadlock.

Lock upgrade is discouraged.

Where required, the operation should release and reacquire under explicit Version validation.

---

# 100. Lock Downgrade

Downgrading exclusive ownership to shared ownership may be supported where semantics are clear.

It shall not expose uncommitted state.

---

# 101. Lock Ordering Registry

Architecturally significant nested Lock ordering should be documented centrally.

---

# 102. Resource Hierarchy

A potential acquisition hierarchy may be:

```text
Application
    │
    ▼
Library
    │
    ▼
Knowledge Object
    │
    ▼
Asset / Annotation
```

This hierarchy shall be used only where nested coordination is unavoidable.

---

# 103. No Reverse Acquisition

An operation holding a lower-level Lock shall not acquire a higher-level Lock in reverse order.

---

# 104. Lock-Free Strategies

Lock-free or wait-free implementations may be used where they preserve required semantics.

The architecture does not require Lock usage when safer mechanisms exist.

---

# 105. Optimistic Preference

Optimistic concurrency is preferred for user-edited canonical objects when:

* Version conflict can be detected;
* edits can be reconciled;
* long Locks would harm interaction.

---

# 106. Immutable Snapshot Preference

Read operations should prefer immutable snapshots over shared Locks.

---

# 107. Queue Serialization Preference

Per-scope message queues may be preferable to explicit Lock management for components with clear state ownership.

---

# 108. Transaction Constraint Preference

Uniqueness and consistency constraints should be enforced by the persistence boundary where appropriate rather than only by application Locks.

---

# 109. Observability

Locking behavior shall be observable.

Observable metadata may include:

* Lock Scope;
* owner;
* acquisition time;
* wait duration;
* hold duration;
* timeout;
* contention count;
* Lease expiration;
* stale-owner detection.

---

# 110. Logging

Significant Lock logs may include:

* prolonged wait;
* timeout;
* stale Lease;
* force unlock;
* deadlock prevention;
* fencing rejection.

Raw sensitive Resource data shall not be logged.

---

# 111. Metrics

Locking metrics may include:

* acquisition count;
* contention count;
* average wait time;
* maximum wait time;
* average hold time;
* timeout count;
* Lease renewal count;
* Lease loss count;
* stale Lock count;
* forced unlock count.

---

# 112. Tracing

Tracing may represent:

```text
Operation
    │
    ▼
Wait for Lock
    │
    ▼
Critical Section
    │
    ▼
Release
```

Lock wait and Lock hold time shall be distinguishable.

---

# 113. Health

Persistent excessive contention may degrade subsystem health.

A subsystem may report degraded state when Lock wait exceeds defined operational thresholds.

---

# 114. Testing Requirements

Locking-sensitive behavior shall be tested through:

* concurrent acquisition;
* timeout;
* cancellation;
* owner crash;
* Lease expiration;
* stale owner;
* deadlock scenario;
* starvation scenario;
* priority inversion;
* process restart;
* fencing rejection;
* force unlock.

---

# 115. Mutual Exclusion Testing

Tests shall verify that incompatible operations never enter the same protected critical scope concurrently.

---

# 116. Release Testing

Tests shall verify release after:

* success;
* expected failure;
* exception;
* cancellation;
* timeout;
* process shutdown.

---

# 117. Lease Testing

Lease tests shall include:

* successful acquisition;
* renewal;
* expiration;
* late owner action;
* Fencing Token rejection;
* ownership transfer.

---

# 118. Deadlock Testing

Tests shall intentionally create conflicting acquisition patterns to verify prevention or detection.

---

# 119. Starvation Testing

Long contention tests shall verify bounded fairness.

---

# 120. Cross-Process Testing

Cross-process coordination shall be tested using independent processes.

Thread-only tests are insufficient.

---

# 121. Network Storage Testing

Where filesystem Locks are used on NAS-backed storage, actual supported protocol behavior shall be tested.

---

# 122. Failure Injection

Testing should inject:

* process crash during critical section;
* network loss during Lease ownership;
* delayed worker after Lease expiration;
* storage failure during release;
* cancellation during acquisition.

---

# 123. Governance

Changes to Lock scope or ownership require architectural review when they may affect:

* canonical correctness;
* transaction boundaries;
* throughput;
* availability;
* synchronization;
* Plugin isolation;
* Source of Truth operations.

---

# 124. Locking Invariants

The following invariants apply.

* Every Lock has explicit scope.
* Every Lock has explicit ownership.
* Locks use the smallest scope preserving correctness.
* Global Locks are exceptional.
* Lock acquisition is bounded.
* Lock waiting supports timeout or cancellation.
* Locks are released on every execution path.
* Critical Sections remain minimal.
* Broad Locks are not held during remote calls.
* Locks do not define canonical authority.
* Locks do not replace authorization.
* Locks do not replace transactions.
* Locks do not replace Version validation.
* Locks do not replace synchronization conflict handling.
* Nested Locks follow consistent acquisition order.
* Lease expiration does not prove the old owner stopped.
* Fencing Tokens are used where stale-owner protection is required.
* Process-local Locks are never treated as cross-process or cross-device guarantees.
* Offline devices do not rely upon global distributed Locks.
* Plugin lifecycle Locks are scoped per Plugin Identity.
* Credential refresh is serialized per credential set.
* Synchronization Sessions are coordinated per compatible scope.
* Lock contention is observable.
* Stale Locks are recoverable through governed mechanisms.
* Force unlock is privileged and auditable where significant.

---

# 125. Prohibited Behaviors

KnowledgeOS shall never:

* use a global Lock for ordinary object operations;
* hold broad Locks during remote network calls;
* hold Locks across user interaction;
* rely upon unbounded Lock waits;
* omit Lock release on failure paths;
* use Locks as authorization;
* use Locks as proof of Source of Truth;
* use Locks instead of transactions for atomic persistence;
* use Locks instead of Version checks for remote concurrency;
* assume file Locks work identically across all storage systems;
* treat Lease expiration as proof that no side effect occurred;
* allow stale Lease owners to commit without fencing where required;
* acquire nested Locks in inconsistent order;
* expose Lock primitives through Public APIs;
* allow Plugins to control core Locks directly;
* rely upon process-local mutexes for cross-device correctness;
* use distributed locking as the universal solution for Offline First divergence;
* force unlock significant state without validation;
* hide persistent contention from observability.

---

# 126. Related Documents

## Execution

* `../README.md`
* `ConcurrencyModel.md`
* `Determinism.md`
* `Idempotency.md`
* `RetryPolicies.md`
* `Transactions.md`
* `../Messaging/Commands.md`
* `../Messaging/EventProcessing.md`
* `../Performance/ParallelExecution.md`
* `../Reliability/Recovery.md`
* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ResourceManagement.md`
* `../Runtime/Scheduling.md`

## Kernel

* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/Annotation/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/OAuth.md`
* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 127. Status

**Approved**

This document defines the locking model of KnowledgeOS.

Locks protect bounded execution scopes.

They do not define canonical meaning, authority, identity or Source of Truth.

Every Lock has explicit scope and ownership.

The smallest correct scope is used.

Global Locks remain exceptional.

Acquisition is bounded.

Waiting supports timeout or cancellation.

Critical Sections remain short.

Broad Locks are not held across remote calls, user interaction or long-running work.

Locks complement transactions, Version validation and Domain invariants.

They do not replace them.

Leases support bounded ownership but may expire while prior work continues.

Fencing Tokens protect against stale owners where required.

Process-local Locks are never treated as distributed guarantees.

Offline devices coordinate through Versioning and synchronization rather than universal remote Locks.

Plugin lifecycle, Provider Connections, credential refresh, Storage operations and synchronization Sessions use narrowly scoped coordination.

Contention, stale Locks, Lease loss and force-unlock operations remain observable.

KnowledgeOS therefore uses Locking only as a precise execution mechanism, avoiding broad serialization and preventing Lock ownership from becoming confused with architectural authority.
