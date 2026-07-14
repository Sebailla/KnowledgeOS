
# Transactions

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Concurrency

**Document:** Transactions

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the transaction model of KnowledgeOS.

Transactions establish explicit consistency boundaries for state-changing operations.

A Transaction groups one or more related mutations so that they are committed according to one defined consistency contract.

Transactions protect:

* Domain invariants;
* canonical state transitions;
* Version consistency;
* identity allocation;
* relationship consistency;
* idempotency registration;
* Event publication preparation;
* operation state transitions;
* durable execution state.

Transactions do not automatically provide atomicity across:

* external Providers;
* remote services;
* Webhooks;
* cloud APIs;
* separate devices;
* unrelated storage systems;
* user-controlled external tools;
* asynchronous external side effects.

---

# 2. Scope

This document governs transactions across:

* Domain mutations;
* Knowledge Object creation;
* Knowledge Object Version creation;
* metadata updates;
* relationship changes;
* Annotation mutation;
* Library commits;
* Import finalization;
* Export state;
* synchronization application;
* Plugin lifecycle state;
* Provider configuration;
* Job state;
* Workflow state;
* idempotency records;
* Event Outbox records;
* Inbox records;
* execution checkpoints;
* Storage metadata where transactional guarantees exist.

This document also governs:

* Transaction Identity;
* Transaction Scope;
* Transaction Ownership;
* transaction lifecycle;
* commit;
* rollback;
* isolation;
* atomicity;
* consistency;
* durability;
* nested transactions;
* savepoints;
* external side effects;
* Outbox and Inbox patterns;
* distributed transaction limitations;
* compensation;
* transaction observability.

This document does not define:

* database-specific syntax;
* concrete ORM implementation;
* concrete persistence engine selection;
* synchronization conflict policy;
* Provider-specific transaction APIs;
* complete Workflow compensation logic;
* filesystem atomicity implementation.

---

# 3. Architectural Position

Transactions belong to the Execution layer.

```text
Command / Workflow Step
        │
        ▼
Domain Validation
        │
        ▼
Transaction Boundary
        │
        ├── Canonical Mutations
        ├── Version Updates
        ├── Idempotency State
        └── Outbox Records
        │
        ▼
Commit
```

The Domain defines what must remain consistent.

Execution defines how the consistency boundary is committed.

---

# 4. Core Principle

The fundamental principle is:

> A Transaction protects one explicit consistency boundary.

A Transaction shall never be assumed to provide atomicity outside the systems and Resources that actually participate in it.

---

# 5. Mission

The mission of the transaction architecture is to ensure that state-changing execution is:

* atomic within its declared scope;
* consistent with Domain invariants;
* isolated according to required semantics;
* durable according to the persistence contract;
* recoverable after failure;
* observable;
* compatible with Offline First operation.

---

# 6. Design Philosophy

Transactions shall be:

* explicit;
* narrowly scoped;
* short-lived;
* Domain-aligned;
* failure-aware;
* concurrency-aware;
* independent from external network latency;
* observable;
* compatible with idempotency and retry.

---

# 7. Transaction Definition

A Transaction is a bounded execution context in which related state changes are treated as one consistency unit.

A Transaction defines:

* participating state;
* ownership;
* commit point;
* rollback behavior;
* isolation expectations;
* failure semantics;
* durability expectations.

---

# 8. Transaction Identity

Significant Transactions may have Transaction Identity.

Transaction Identity supports:

* tracing;
* diagnostics;
* audit;
* correlation;
* recovery analysis.

Transaction Identity shall not become Domain identity.

---

# 9. Transaction Scope

Every Transaction shall define its scope.

Possible scopes include:

* one Knowledge Object;
* one Knowledge Object Version;
* one Annotation;
* one Library metadata operation;
* one Import commit;
* one Workflow state transition;
* one Job state transition;
* one Provider configuration update;
* one synchronization application batch.

---

# 10. Smallest Correct Transaction

KnowledgeOS shall use the smallest Transaction that preserves the required invariant.

Broad Transactions increase:

* contention;
* rollback cost;
* lock duration;
* deadlock risk;
* memory usage;
* latency.

---

# 11. Transaction Ownership

Every Transaction shall have one architectural owner.

Examples:

* Library Engine owns canonical Library commit Transactions.
* Annotation Engine owns Annotation mutation Transactions.
* Sync Engine owns local application of synchronization decisions.
* Plugin Engine owns Plugin lifecycle Transactions.
* Kernel Job System owns durable Job state transitions.

---

# 12. Domain Ownership

The Domain determines which state changes must be consistent together.

The persistence mechanism shall not invent or redefine Domain transaction boundaries.

---

# 13. Atomicity

Atomicity means the Transaction's committed state changes become visible as one accepted unit within the declared scope.

If the Transaction fails before commit, its uncommitted mutations shall not become authoritative.

---

# 14. Atomicity Scope

Atomicity is limited to participating Resources.

The statement:

> This operation is atomic.

is incomplete without defining:

* atomic across which state;
* using which persistence mechanism;
* against which failures;
* within which process or storage system.

---

# 15. Consistency

Consistency means a committed Transaction preserves all applicable invariants.

A technically successful write is not a valid commit if it violates Domain consistency.

---

# 16. Isolation

Isolation determines how concurrent Transactions observe and affect each other.

Isolation shall be chosen based on invariant requirements.

KnowledgeOS shall not assume one universal isolation level for every operation.

---

# 17. Durability

Durability means committed state survives according to the underlying persistence contract.

Durability guarantees vary by:

* local filesystem;
* database;
* NAS;
* object storage;
* secure credential store;
* external Provider.

KnowledgeOS shall not claim stronger durability than the underlying mechanism provides.

---

# 18. ACID Interpretation

ACID properties apply only within the concrete transaction mechanism that provides them.

They shall not be extrapolated automatically to:

* external APIs;
* network filesystems;
* remote execution;
* multiple devices;
* cloud services;
* Webhook delivery.

---

# 19. Transaction Lifecycle

A general Transaction lifecycle is:

```text
Created
   │
   ▼
Active
   │
   ├── Validate
   ├── Read
   ├── Mutate
   └── Prepare
   │
   ├───────────────┐
   ▼               ▼
Commit          Rollback
   │               │
   ▼               ▼
Committed       RolledBack
```

---

# 20. Transaction Start

A Transaction shall begin only when the operation reaches the state-changing consistency boundary.

Long preparation should occur outside the Transaction where possible.

---

# 21. Preparation Outside Transaction

Work such as:

* remote API calls;
* OCR;
* AI inference;
* large parsing;
* file conversion;
* user confirmation;
* network transfer;

shall normally occur before entering the final commit Transaction.

---

# 22. Revalidation Before Commit

After external or long-running preparation, KnowledgeOS shall revalidate:

* expected Version;
* authorization;
* target identity;
* current state;
* invariant preconditions.

---

# 23. Commit Point

Every Transaction shall have a defined commit point.

Before the commit point:

* state is provisional;
* success Events shall not be published as completed facts;
* dependent canonical work shall not treat the mutation as authoritative.

After the commit point:

* state is authoritative within the declared scope;
* completion Events may be produced;
* derived processing may begin.

---

# 24. Rollback

Rollback discards or reverses uncommitted changes within the Transaction mechanism.

Rollback does not automatically reverse:

* already-sent network requests;
* already-created remote Resources;
* user-visible external notifications;
* physical writes outside the Transaction;
* external Provider side effects.

---

# 25. Rollback Is Not Compensation

Rollback returns one local Transaction to its previous uncommitted state.

Compensation performs a new explicit operation intended to counteract an already committed effect.

---

# 26. Transaction Failure

A Transaction may fail because of:

* Domain validation;
* Version conflict;
* uniqueness violation;
* persistence failure;
* capacity exhaustion;
* cancellation;
* lock timeout;
* invariant violation;
* process interruption.

---

# 27. Validation Before Mutation

Where practical, structural and Domain validation shall occur before mutation.

This reduces unnecessary rollback work.

---

# 28. Validation Inside Transaction

Validation depending upon current mutable state shall occur inside the Transaction or against a protected Version snapshot.

---

# 29. Optimistic Transaction

An Optimistic Transaction prepares work against an expected Version and commits only if the Version remains current.

```text
Read V1
  │
  ▼
Prepare
  │
  ▼
Commit if Current = V1
  │
  ├── Yes → V2
  └── No  → Conflict
```

---

# 30. Pessimistic Transaction

A Pessimistic Transaction obtains exclusive or restrictive coordination before mutation.

It may be appropriate where:

* conflicts are frequent;
* rollback is expensive;
* invariant violation risk is high.

---

# 31. Transaction and Locks

Transactions and Locks are related but distinct.

A Transaction may use Locks.

A Lock does not provide:

* atomic commit;
* rollback;
* durability.

Detailed Locking rules are defined in `Locking.md`.

---

# 32. Transaction and Version Checks

Transactions shall use Version validation where concurrent or external changes may occur.

A local Lock alone may not detect:

* remote device changes;
* external filesystem changes;
* Provider-side changes;
* offline divergence.

---

# 33. Transaction Isolation Levels

Concrete persistence implementations may provide isolation levels such as:

* Read Committed;
* Repeatable Read;
* Snapshot Isolation;
* Serializable.

The selected level shall match the invariant.

---

# 34. No Universal Serializable Requirement

Serializable isolation may provide strong guarantees but may be unnecessarily expensive for many operations.

KnowledgeOS shall not require it universally.

---

# 35. Read Committed Use

Read Committed may be sufficient for operations that:

* read one current committed value;
* use explicit Version checks;
* do not depend on stable repeated reads.

---

# 36. Repeatable Read Use

Repeatable Read or equivalent snapshot semantics may be required where a Transaction must observe a stable view across multiple reads.

---

# 37. Serializable Use

Serializable or equivalent behavior may be required when concurrent execution could otherwise violate a cross-record invariant.

---

# 38. Write Skew

Snapshot-style isolation may still permit write skew.

Operations protecting cross-record invariants shall account for this explicitly.

---

# 39. Phantom Reads

Queries relying on the absence or count of matching records may require protection against phantoms.

---

# 40. Lost Update

A lost update occurs when one valid write silently overwrites another.

Lost updates shall be prevented through:

* Version checks;
* conditional writes;
* serialization;
* appropriate isolation.

---

# 41. Dirty Read Prohibition

Canonical Queries shall not expose uncommitted mutation as authoritative state.

---

# 42. Transactional Read Model

A Transaction may read and modify one canonical consistency boundary.

Queries outside the Transaction may continue to observe the previous committed Version until commit.

---

# 43. Nested Transactions

Nested Transactions are discouraged as an architectural model.

They often hide unclear ownership and commit semantics.

---

# 44. Nested Transaction Meaning

Many persistence systems emulate nested Transactions using Savepoints.

An inner commit may not be durable until the outer Transaction commits.

This shall be understood explicitly.

---

# 45. Savepoints

A Savepoint allows partial rollback within one outer Transaction.

Savepoints may be used for bounded internal recovery.

They do not create independent durable Transactions.

---

# 46. Independent Transaction

An independently committed inner operation is not a true nested Transaction.

It is a separate Transaction with separate failure and compensation semantics.

---

# 47. Transaction Propagation

A service invoked within a Transaction shall declare whether it:

* joins the current Transaction;
* requires a new Transaction;
* executes outside the Transaction;
* prohibits transactional execution.

Implicit propagation is discouraged.

---

# 48. Cross-Layer Transaction

A Transaction may coordinate state changes across internal components only when they share one valid persistence boundary and one consistency owner.

It shall not become a mechanism for arbitrary cross-layer coupling.

---

# 49. Domain Service Participation

Domain Services may produce mutation decisions.

Persistence and commit remain owned by the appropriate application or Platform transaction boundary.

---

# 50. Command Transaction

A state-changing Command normally executes within one primary Transaction boundary.

The Command Handler shall define:

* validation;
* mutation;
* commit;
* result;
* Event production.

---

# 51. Command Completion

A Command shall not report completed canonical success before its Transaction commits.

---

# 52. Command Rejection

Domain rejection should occur before commit and shall not be represented as a technical Transaction failure when it is an expected outcome.

---

# 53. Query Transaction

Queries may use read Transactions or snapshots where consistent multi-read state is required.

Simple Queries need not create unnecessary Transactions.

---

# 54. Event Publication

Events describing committed canonical facts shall be published only after successful commit.

---

# 55. Publish-Before-Commit Prohibition

Publishing a success Event before commit is prohibited because consumers may observe a fact that later rolls back.

---

# 56. Outbox Pattern

Where durable Event publication must correspond to a committed state change, KnowledgeOS may use an Outbox.

```text
Begin Transaction
      │
      ├── Apply Canonical Mutation
      ├── Store Domain / Integration Event Record
      └── Store Outbox Record
      │
      ▼
Commit
      │
      ▼
Asynchronous Publisher
```

---

# 57. Outbox Guarantee

The Outbox ensures the event-to-publish record is committed with the canonical state.

It does not guarantee immediate external delivery.

---

# 58. Outbox Identity

Outbox records shall preserve stable Event or Delivery Identity.

Retrying publication shall not create a new logical Event.

---

# 59. Inbox Pattern

Inbound external or durable messages may be recorded in an Inbox before processing.

```text
Receive Message
      │
      ▼
Validate
      │
      ▼
Persist Inbox Record
      │
      ▼
Acknowledge
      │
      ▼
Process Transactionally
```

---

# 60. Inbox and Effect

Where required, Inbox processing state and canonical effect should be coordinated atomically.

This prevents successful effect with forgotten message status or vice versa.

---

# 61. Idempotency Transaction

Idempotency registration and canonical effect shall share one Transaction where possible.

---

# 62. Duplicate Command Transaction

A duplicate Command shall detect the existing Idempotency Record inside the protected Transaction boundary.

---

# 63. Job Transaction

Durable Job state transitions shall be transactional.

Examples include:

* Queued to Running;
* Running to Completed;
* Running to RetryScheduled;
* Running to Failed.

---

# 64. Job Claim Transaction

Claiming a Job shall atomically establish one current owner or Lease where the Job System requires it.

---

# 65. Job Completion Transaction

Job completion shall record the terminal state only after the defined effect guarantee is satisfied.

---

# 66. Workflow Transaction

A Workflow may span many Transactions.

A long-running Workflow shall not remain inside one database or storage Transaction.

---

# 67. Workflow Step Transaction

Each significant Workflow Step should have its own bounded Transaction.

Workflow state then coordinates the sequence.

---

# 68. Saga-Like Workflow

A long-running distributed Workflow may use a Saga-like model:

```text
Step A Commit
    │
    ▼
Step B Commit
    │
    ▼
Step C Fails
    │
    ▼
Compensation Policy
```

This is not one distributed ACID Transaction.

---

# 69. Compensation

Compensation may:

* reverse a logical effect;
* create a compensating Version;
* remove a temporary external Resource;
* mark an operation cancelled;
* create corrective state.

Compensation shall be explicit and idempotent where retryable.

---

# 70. Compensation Limitations

Some effects cannot be fully reversed.

Examples include:

* external messages already delivered;
* AI Provider charges;
* irreversible remote actions;
* knowledge already exported and copied externally.

The architecture shall not promise impossible rollback.

---

# 71. Import Transaction

Import is a long-running pipeline followed by a bounded canonical commit Transaction.

---

# 72. Import Staging

Parsing, OCR, conversion and validation occur in staging or derived execution state.

They shall not partially mutate canonical Library state.

---

# 73. Import Commit Transaction

The final Import commit may include:

* Knowledge Object creation;
* initial Version creation;
* Asset registration;
* provenance;
* relationships;
* Import Operation completion;
* Outbox Event records.

---

# 74. Import Commit Failure

If final commit fails, staged output remains non-canonical and may be retried or cleaned according to recovery policy.

---

# 75. Export Transaction

Export generation does not normally require mutation of canonical source state.

Operational Export state updates may use Transactions.

---

# 76. Export Publication

Publishing an Artifact externally cannot generally join the local Export state Transaction.

The operation requires idempotency, Outbox-style coordination or reconciliation.

---

# 77. Annotation Transaction

Creating or editing an Annotation should atomically update:

* Annotation state;
* Version;
* anchor references;
* relevant metadata;
* idempotency state;
* Event records.

---

# 78. Ink Transaction

Raw captured ink evidence should be committed separately from optional derived recognition results where this improves reliability and preserves source evidence.

---

# 79. Library Transaction

The Library Engine owns Transactions affecting:

* Knowledge Object creation;
* Version commit;
* relationships;
* canonical metadata;
* Source of Truth state;
* Library-level lifecycle.

---

# 80. Source of Truth Migration

A Source of Truth migration is not one simple Transaction across two storage systems.

It requires a governed Workflow with:

* preparation;
* copy;
* verification;
* cutover;
* local authoritative state update;
* recovery plan.

---

# 81. Storage Transaction

Storage technologies expose different transaction guarantees.

A local filesystem operation, database Transaction and object-store write shall not be treated as equivalent.

---

# 82. Filesystem Atomic Replace

Filesystem atomic replacement may provide one-object visibility guarantees.

It does not provide a general multi-file Transaction.

---

# 83. Multi-File Commit

Where multiple physical files represent one canonical unit, KnowledgeOS shall use a recovery-aware commit protocol.

Possible strategies include:

* staging directory;
* manifest;
* completion marker;
* generation directory;
* atomic root pointer update.

---

# 84. NAS Transaction Limits

NAS protocols may alter:

* Locking;
* flush;
* atomic rename;
* durability;
* failure behavior.

Actual NAS guarantees shall be tested and documented.

---

# 85. Object Storage Transaction Limits

Object storage may provide atomicity per object but not across multiple objects.

Generation or manifest strategies may be required.

---

# 86. Transaction Journal

A journal may record intended and completed state transitions for recovery.

Journal use shall remain explicit and bounded.

---

# 87. Write-Ahead Intent

Some persistence workflows may record intent before applying multi-step physical changes.

Recovery can then complete or revert according to the journal state.

---

# 88. Synchronization Transaction

Synchronization Integration transports changes.

The Sync Engine determines how accepted changes are applied transactionally to local canonical state.

---

# 89. Change Set Application

A Change Set may be applied:

* in one Transaction;
* in partitioned Transactions;
* object by object;
* through staged validation and commit.

The strategy shall match size, dependencies and invariants.

---

# 90. Change Set Is Not Automatically One Transaction

A large Change Set is an Integration unit.

It does not automatically define one local ACID Transaction.

---

# 91. Synchronization Partial Commit

If a Change Set is applied in multiple Transactions, the Sync Engine shall track:

* committed items;
* pending items;
* failed items;
* Checkpoints;
* convergence state.

---

# 92. Synchronization Checkpoint

A Checkpoint shall advance only after the represented local Transaction commits.

---

# 93. Provider Configuration Transaction

Provider registration or configuration changes may require one Transaction for:

* configuration metadata;
* capability state;
* Connection Identity;
* lifecycle state.

Secrets remain in the secure credential subsystem.

---

# 94. Credential Transaction Boundary

Secure credential stores may not participate in the same Transaction as ordinary application persistence.

This creates a multi-resource consistency problem.

---

# 95. Credential Update Workflow

Credential changes may require:

1. obtain new credential;
2. persist securely;
3. update non-secret connection metadata;
4. validate usability;
5. remove obsolete credential where safe.

Recovery shall account for interruption between steps.

---

# 96. OAuth Rotation

Refresh Token rotation cannot generally be atomically coordinated with the remote Authorization Server.

Local stale-write protection and recovery are required.

---

# 97. Plugin Lifecycle Transaction

Plugin lifecycle state may be updated transactionally for:

* installation registration;
* Version activation;
* capability grants;
* enabled state;
* migration state.

---

# 98. Plugin Files and Metadata

Plugin physical files and lifecycle metadata may use different persistence systems.

Installation therefore requires a staged commit protocol, not an assumed cross-system Transaction.

---

# 99. Public API Transaction

A Public API mutation shall expose one clear operation boundary.

The API shall not expose internal partial commit steps unless the contract explicitly models a long-running operation.

---

# 100. Local API Transaction

Local transport does not alter transaction semantics.

A local client shall not observe partial canonical mutation merely because it shares the device.

---

# 101. Remote Execution Transaction

Submitting remote execution and updating local state cannot generally be one atomic Transaction.

Use:

* stable Operation Identity;
* local pending state;
* Provider idempotency;
* reconciliation.

---

# 102. Webhook Transaction

Inbound Webhook receipt, processing state and canonical effect may use Inbox plus bounded local Transactions.

---

# 103. Outbound Webhook Transaction

Canonical mutation and Outbox record may commit together.

Actual HTTP delivery occurs later outside that Transaction.

---

# 104. MCP Transaction

An MCP Tool invoking a state-changing capability shall enter through the same Platform transaction boundary as any other caller.

MCP does not create an alternate Domain commit path.

---

# 105. AI Transaction

AI inference itself is external or derived execution.

AI output shall not mutate canonical state inside the inference operation.

Canonical acceptance occurs in a separate explicit Transaction.

---

# 106. AI Acceptance Transaction

An AI-assisted accepted change may transactionally record:

* accepted output;
* provenance;
* resulting canonical mutation;
* user or policy decision;
* Event records.

---

# 107. OCR Transaction

OCR output remains derived staging state until Import or document-processing commit.

---

# 108. Search Transaction

Search indexing may use Transactions to update consistent index segments.

The index remains derived state.

---

# 109. Index and Canonical State

Canonical state commit and external or separate index update are not automatically atomic.

Use:

* Event-driven update;
* Outbox;
* index rebuild;
* reconciliation.

---

# 110. Cache Transaction

Cache mutation does not define canonical transaction semantics.

Cache failure shall not invalidate committed canonical state.

---

# 111. Transaction and Retry

A failed fully rolled-back local Transaction may be retried when:

* failure is retryable;
* idempotency is preserved;
* intent remains valid;
* retry is bounded.

---

# 112. Commit Outcome Unknown

A process or connection failure may occur near commit.

The outcome may be unknown.

KnowledgeOS shall reconcile before repeating a non-idempotent effect.

---

# 113. Transaction Identifier for Reconciliation

Where supported, Transaction or Operation Identity may assist determination of whether commit completed.

---

# 114. Deadlock Retry

A deadlock victim Transaction may be retried if:

* the operation is retry-safe;
* semantic inputs remain valid;
* retry policy permits it.

---

# 115. Serialization Failure Retry

A serialization conflict may be retried by re-reading current state and re-evaluating the operation.

Blind replay of stale mutation is prohibited.

---

# 116. Transaction and Cancellation

Cancellation before commit should roll back uncommitted state.

Cancellation after commit cannot uncommit the Transaction.

---

# 117. Commit During Cancellation Race

The runtime shall define the outcome when cancellation and commit race.

Possible outcomes include:

* cancellation wins before commit;
* commit wins and operation completes;
* outcome requires status Query.

The result shall be explicit.

---

# 118. Transaction Timeout

Transactions shall have bounded duration.

A timeout should roll back local uncommitted state where the persistence mechanism supports it.

---

# 119. Timeout Does Not Prove External Rollback

External operations triggered before timeout may still have completed.

---

# 120. Long Transaction Prohibition

Transactions shall not remain open during:

* user interaction;
* network wait;
* remote Provider execution;
* large file conversion;
* extended background computation;
* device suspension.

---

# 121. Process Termination

KnowledgeOS shall assume the process may terminate during transaction-adjacent workflows.

Committed Transactions remain authoritative.

Uncommitted work shall be rolled back or recovered according to the persistence mechanism.

---

# 122. Recovery

Recovery shall inspect durable state rather than assume the last in-memory step completed.

---

# 123. Transaction Recovery

Recovery may need to determine:

* whether commit occurred;
* whether Outbox record exists;
* whether external effect occurred;
* whether compensation is required;
* whether a Workflow Step may resume.

---

# 124. Checkpoint Relationship

Checkpoint state shall not advance beyond committed durable progress.

---

# 125. Event Ordering After Commit

Events derived from one Transaction shall preserve any required intra-transaction ordering through explicit sequence metadata or Outbox ordering.

---

# 126. Multiple Events

One Transaction may produce multiple Events.

The contract shall define whether their relative order matters.

---

# 127. Transactional Event Identity

Event Identity shall be assigned before Outbox commit where stable identity is required across publication retries.

---

# 128. Transaction and Determinism

A deterministic Transaction shall produce equivalent committed state from equivalent:

* initial state;
* Command;
* policy;
* configuration;
* declared context.

---

# 129. Transaction and Idempotency

A repeated Command shall either:

* observe the original committed result;
* reuse the original operation state;
* conflict on incompatible key reuse.

It shall not create a second committed effect.

---

# 130. Transaction and Locking

Locks held by a Transaction shall follow the rules in `Locking.md`.

Broad Locks and long Transactions amplify each other's risks.

---

# 131. Transaction and Performance

Transaction boundaries affect:

* throughput;
* contention;
* memory;
* latency;
* lock duration;
* recovery cost.

Correctness remains the first priority.

---

# 132. Batch Transactions

Batching may improve throughput.

Batch size shall be bounded.

A large batch shall not create unacceptable:

* rollback cost;
* lock duration;
* memory usage;
* user-visible latency.

---

# 133. Partial Batch Failure

A batch Transaction either commits according to its declared atomic scope or fails.

If partial success is desired, the batch shall be partitioned into separate explicit Transactions.

---

# 134. Transactional Chunking

Large operations may commit in chunks.

Chunking requires:

* stable operation identity;
* Checkpoints;
* idempotent chunk processing;
* defined partial state;
* recovery semantics.

---

# 135. Transaction Observability

Transaction behavior shall be observable.

Observable metadata may include:

* Transaction Identity;
* owner;
* scope;
* start time;
* duration;
* commit result;
* rollback reason;
* isolation category;
* conflict category;
* retry relationship.

---

# 136. Logging

Transaction logs should include:

* operation identity;
* transaction scope;
* commit or rollback;
* failure category;
* duration;
* retry relation.

Logs shall not contain unnecessary sensitive payloads.

---

# 137. Metrics

Transaction metrics may include:

* Transaction count;
* commit rate;
* rollback rate;
* conflict rate;
* deadlock count;
* average duration;
* maximum duration;
* retry-after-conflict rate;
* commit OutcomeUnknown count;
* Outbox backlog.

---

# 138. Tracing

A Transaction span may include:

```text
Transaction
    ├── Validate
    ├── Read
    ├── Mutate
    ├── Persist
    └── Commit
```

External calls should appear outside the Transaction span unless explicitly unavoidable.

---

# 139. Audit

Security-sensitive Transactions may produce audit records.

Examples include:

* Source of Truth change;
* destructive deletion;
* Plugin capability change;
* external account disconnection;
* Library migration;
* bulk knowledge mutation.

---

# 140. Transaction Errors

Stable transaction-related errors may include:

* TransactionConflict;
* TransactionTimeout;
* TransactionAborted;
* TransactionUnavailable;
* TransactionCommitFailed;
* TransactionOutcomeUnknown;
* IsolationViolation;
* ConstraintViolation;
* DeadlockVictim;
* DurabilityUncertain.

---

# 141. Error Translation

Persistence-specific errors shall be translated into stable Execution errors.

Raw database or storage exceptions shall not cross architectural boundaries.

---

# 142. Durability Uncertain

If the persistence mechanism cannot prove durable completion, the state shall be represented explicitly.

KnowledgeOS shall not report stronger durability than available.

---

# 143. Security

Transaction boundaries shall enforce current:

* authentication;
* authorization;
* Capability scope;
* Resource scope.

A Transaction does not elevate authority.

---

# 144. Authorization Before Commit

Authorization-sensitive operations shall revalidate where long preparation may have outlived the original authorization context.

---

# 145. Privacy

Transaction logs and recovery state shall minimize duplication of sensitive knowledge.

---

# 146. Testing Requirements

Transactional behavior shall be tested through:

* successful commit;
* validation rejection;
* rollback;
* Version conflict;
* deadlock;
* timeout;
* cancellation;
* process interruption;
* commit OutcomeUnknown;
* Outbox recovery;
* Inbox duplicate;
* multi-step Workflow failure;
* Storage failure;
* NAS failure.

---

# 147. Atomicity Testing

Tests shall verify that partial internal mutation is not visible after rollback.

---

# 148. Isolation Testing

Tests shall execute overlapping Transactions to verify required isolation behavior.

---

# 149. Lost Update Testing

Concurrent updates shall not silently overwrite each other.

---

# 150. Write Skew Testing

Cross-record invariants shall be tested under concurrent Transactions.

---

# 151. Commit Failure Testing

Tests shall inject failure:

* before persistence;
* during persistence;
* before commit acknowledgement;
* after commit but before response.

---

# 152. Outbox Testing

Tests shall verify:

* state and Outbox commit together;
* publication may retry safely;
* Event Identity remains stable;
* no Event is published for rolled-back state.

---

# 153. Inbox Testing

Tests shall verify:

* duplicate messages do not duplicate effects;
* Inbox state and effect remain aligned;
* crash recovery resumes safely.

---

# 154. Long Workflow Testing

Tests shall verify long-running Workflows use multiple bounded Transactions rather than one open Transaction.

---

# 155. Storage Testing

Actual filesystem, NAS and object-store guarantees shall be tested where transaction-like behavior is claimed.

---

# 156. Recovery Testing

Recovery tests shall determine correct behavior after crashes at every critical transition.

---

# 157. Governance

Changes affecting Transaction Scope, commit boundaries, isolation, Outbox, Inbox or compensation require architectural review when they may alter:

* Domain invariants;
* canonical correctness;
* Event publication;
* idempotency;
* synchronization;
* Source of Truth;
* recovery;
* external side effects.

---

# 158. Transaction Invariants

The following invariants apply.

* Every Transaction has explicit scope.
* Every Transaction has one architectural owner.
* The smallest correct Transaction is used.
* Transactions begin near the state-changing boundary.
* Long preparation occurs outside the Transaction where possible.
* State is revalidated before commit after external or long-running work.
* Uncommitted state is never exposed as authoritative.
* Completion is not reported before commit.
* Success Events are not published before commit.
* Rollback does not imply reversal of external side effects.
* Rollback and compensation remain distinct.
* Locks do not replace Transactions.
* Transactions do not replace Version checks.
* Nested Transaction semantics are explicit.
* Savepoints are not independent durable commits.
* Long-running Workflows use multiple bounded Transactions.
* Canonical mutation and Outbox records commit together where required.
* Inbox processing and canonical effect are coordinated where required.
* Idempotency state and canonical effect share one Transaction where possible.
* Import staging remains non-canonical until final commit.
* Export publication remains outside the local canonical Transaction.
* Change Sets are not automatically one local Transaction.
* Checkpoints advance only after commit.
* External Providers do not participate in local Transactions unless a concrete supported protocol proves it.
* Distributed atomicity is never assumed.
* Commit OutcomeUnknown is represented explicitly.
* Transactions are bounded in duration.
* Transactions are observable and testable.

---

# 159. Prohibited Behaviors

KnowledgeOS shall never:

* assume one local Transaction covers remote services;
* keep Transactions open during user interaction;
* keep Transactions open during long network calls;
* publish success Events before commit;
* expose uncommitted state as canonical;
* use rollback terminology for already committed external effects;
* treat compensation as automatic rollback;
* rely on Locks alone for atomic persistence;
* rely on Transactions alone for remote concurrency;
* use nested Transactions without explicit semantics;
* interpret Savepoint release as independent durable commit;
* keep one Transaction open for an entire long-running Workflow;
* partially mutate the canonical Library during Import staging;
* assume export publication is atomic with local Export state;
* assume NAS multi-file writes are transactional without a proven protocol;
* assume object storage supports multi-object atomicity;
* advance Checkpoints before durable commit;
* retry commit OutcomeUnknown blindly;
* claim distributed ACID behavior without a concrete supported mechanism;
* hide transaction failures or rollback reasons from observability.

---

# 160. Related Documents

## Execution

* `../README.md`
* `ConcurrencyModel.md`
* `Determinism.md`
* `Idempotency.md`
* `Locking.md`
* `RetryPolicies.md`
* `../Messaging/Commands.md`
* `../Messaging/EventProcessing.md`
* `../Messaging/Events.md`
* `../Reliability/Checkpointing.md`
* `../Reliability/ErrorHandling.md`
* `../Reliability/Recovery.md`
* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`
* `../Runtime/Lifecycle.md`

## Domain

* `../../02-Domain/DomainModel.md`
* `../../02-Domain/KnowledgeLifecycle.md`
* `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`
* `../../02-Domain/KnowledgeObject/Relationships.md`

## Kernel

* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/Annotation/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Search/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/OAuth.md`
* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/ExternalServices/Webhooks.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 161. Status

**Approved**

This document defines the transaction model of KnowledgeOS.

Transactions protect explicit consistency boundaries.

They are narrowly scoped, short-lived and owned by the subsystem responsible for the invariant.

Canonical mutation becomes authoritative only at commit.

Uncommitted state remains invisible as canonical truth.

Success Events are emitted only after commit.

Rollback affects local uncommitted state.

It does not automatically reverse remote or already committed side effects.

Compensation remains a separate explicit operation.

Locks, Version checks, idempotency and Transactions remain complementary mechanisms.

Long-running Workflows use multiple bounded Transactions and durable execution state.

Import processing stages remain non-canonical until the final Library commit.

Export publication, remote execution, Webhook delivery, Provider calls and synchronization transport remain outside local Transaction atomicity.

Outbox and Inbox patterns bridge asynchronous boundaries without pretending distributed atomicity.

The NAS, object stores, secure credential stores and external services expose different guarantees.

KnowledgeOS does not claim a cross-system Transaction unless a concrete mechanism proves it.

Commit ambiguity is represented explicitly.

Checkpoints advance only after durable commit.

Transactions therefore preserve canonical consistency without creating false assumptions about atomicity across devices, Providers, storage technologies or external systems.
