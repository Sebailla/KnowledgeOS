
# Event Processing

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Messaging

**Document:** Event Processing

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Event processing model of KnowledgeOS.

Event processing governs how immutable Events are:

* received;
* validated;
* dispatched;
* consumed;
* retried;
* checkpointed;
* replayed;
* dead-lettered;
* observed;
* recovered.

An Event represents a fact that has already occurred.

Event processing reacts to that fact.

It shall not reinterpret the Event as a request to perform the original action again.

The purpose of this document is to ensure that Event-driven execution remains:

* idempotent;
* ordering-aware;
* failure-isolated;
* recoverable;
* observable;
* bounded;
* compatible with Offline First operation.

---

# 2. Scope

This document governs processing of:

* Domain Events;
* Integration Events;
* operational Events;
* Job lifecycle Events;
* Workflow Events;
* Plugin Events;
* Provider Events;
* synchronization Events;
* Webhook-derived Events;
* Remote Execution Events;
* Import Events;
* Export Events;
* Annotation Events;
* Library Events;
* Search indexing Events;
* rendering-related Events.

This document also governs:

* Event Consumer identity;
* Event Handler identity;
* dispatch;
* subscription;
* delivery guarantees;
* duplicate delivery;
* idempotent consumption;
* retries;
* Event ordering;
* checkpointing;
* consumer state;
* poison Events;
* dead-letter handling;
* replay;
* consumer concurrency;
* processing transactions;
* failure isolation;
* observability;
* security;
* privacy;
* testing.

This document does not define:

* Event payload semantics;
* Event ordering rules in full;
* Event creation semantics;
* Command semantics;
* Query semantics;
* Event Bus implementation;
* Provider-specific event protocols;
* external Webhook transport.

---

# 3. Architectural Position

Event Processing belongs to the Execution Messaging architecture.

```text
Event Producer
      │
      ▼
Event Bus / Outbox
      │
      ▼
Subscription
      │
      ▼
Event Consumer
      │
      ▼
Event Handler
      │
      ▼
Derived Effect / Projection / Workflow
```

The Event Bus transports Events.

This document defines how consumers process them safely.

---

# 4. Core Principle

The fundamental principle is:

> Event processing reacts to completed facts.

A consumer shall never treat Event delivery as permission to bypass:

* authorization boundaries;
* Platform ownership;
* Domain invariants;
* transaction boundaries;
* idempotency;
* ordering requirements;
* Capability restrictions.

---

# 5. Mission

The mission of Event Processing is to support asynchronous reactions without allowing delivery characteristics to corrupt canonical state.

Event processing shall remain:

* idempotent;
* bounded;
* failure-isolated;
* observable;
* replay-safe where declared;
* ordering-aware;
* recoverable;
* independent from accidental timing.

---

# 6. Design Philosophy

Event processing shall be:

* consumer-owned;
* explicit;
* contract-driven;
* idempotent;
* retry-aware;
* checkpoint-aware;
* immutable-input oriented;
* bounded in concurrency;
* resilient to duplicates;
* tolerant of delayed delivery;
* compatible with partial failure.

---

# 7. Event Consumer

An Event Consumer is a component that subscribes to one or more Event contracts.

A Consumer may:

* update a projection;
* trigger a Workflow;
* schedule a Job;
* update derived state;
* notify another subsystem;
* produce an Integration effect;
* maintain operational state.

---

# 8. Consumer Identity

Every durable Consumer shall have stable Consumer Identity.

Consumer Identity may represent:

* a projection;
* a Platform Engine;
* an Integration adapter;
* a Plugin;
* a background service;
* a Workflow participant.

Consumer Identity is required for:

* checkpoints;
* idempotency;
* replay;
* diagnostics;
* ownership.

---

# 9. Handler Identity

An Event Handler is the executable implementation associated with one Consumer and Event contract.

Handler Identity may include:

* Consumer Identity;
* Handler name;
* Handler Version;
* Event contract Version.

---

# 10. Consumer and Handler Distinction

A Consumer is the architectural owner of processing.

A Handler is one implementation entry point.

One Consumer may have multiple Handlers for different Event types.

---

# 11. Subscription

A Subscription defines which Events a Consumer receives.

A Subscription shall define:

* Consumer Identity;
* Event types;
* source or scope;
* ordering requirement;
* delivery guarantee;
* replay eligibility;
* checkpoint policy;
* retry policy;
* concurrency policy.

---

# 12. Subscription Scope

Subscriptions may be scoped by:

* Event type;
* Library;
* Workspace;
* Knowledge Object category;
* Plugin;
* Provider;
* synchronization Peer;
* Event stream;
* partition.

The scope shall be explicit.

---

# 13. Event Dispatch

Event dispatch routes an Event to eligible Consumers.

Dispatch shall preserve:

* Event Identity;
* Event contract Version;
* correlation;
* causation;
* ordering metadata;
* source metadata.

---

# 14. Event Immutability

An Event shall be immutable after publication.

Consumers shall not modify the Event payload or identity.

---

# 15. Delivery Guarantee

Every Subscription shall declare its delivery guarantee.

Possible guarantees include:

* AtMostOnce;
* AtLeastOnce;
* EffectivelyOnce through idempotent processing.

Exactly-once execution shall not be claimed without a concrete proven mechanism.

---

# 16. At-Most-Once

AtMostOnce delivery may lose Events but does not intentionally redeliver them.

It is appropriate only for non-critical operational notifications.

---

# 17. At-Least-Once

AtLeastOnce delivery may redeliver Events.

Consumers shall be idempotent.

This is the preferred model for durable state-dependent processing.

---

# 18. Effectively-Once Processing

Effectively-once behavior may be achieved through:

* stable Event Identity;
* Consumer-scoped idempotency;
* transactional checkpoints;
* durable state;
* duplicate detection.

It remains an implementation result, not a transport assumption.

---

# 19. Duplicate Delivery

Duplicate delivery is expected.

A duplicate shall preserve:

* Event Identity;
* Stream Identity;
* sequence;
* original payload;
* original causation.

---

# 20. Consumer Idempotency

Every AtLeastOnce Consumer shall define idempotency behavior.

A Consumer shall not produce unintended duplicate effects when processing the same Event again.

---

# 21. Idempotency Scope

Consumer idempotency may use:

```text
Event Identity
    +
Consumer Identity
    +
Handler Version where required
```

One Event may be legitimately processed once by multiple Consumers.

---

# 22. Idempotency Record

A Consumer may persist processing evidence containing:

* Event Identity;
* Consumer Identity;
* processing state;
* result reference;
* checkpoint;
* failure state;
* completion time.

---

# 23. Processing State

Possible processing states include:

* Pending;
* Running;
* Completed;
* RetryScheduled;
* Failed;
* DeadLettered;
* Skipped;
* Cancelled;
* OutcomeUnknown.

---

# 24. Processing Ownership

A processing Attempt may have temporary ownership.

Ownership may belong to:

* worker;
* Job Attempt;
* process;
* consumer instance;
* partition lease.

Ownership shall not replace durable idempotency.

---

# 25. Processing Attempt

Each physical Event processing Attempt may have Attempt Identity.

Multiple Attempts may belong to one Consumer processing record.

---

# 26. Event Handler Contract

Every Handler shall define:

* accepted Event types;
* supported Event Versions;
* idempotency semantics;
* ordering requirements;
* transaction boundary;
* retry policy;
* failure policy;
* side effects;
* replay behavior.

---

# 27. Handler Input

A Handler receives:

* immutable Event;
* Execution Context;
* Consumer context;
* cancellation state;
* required dependencies through approved contracts.

It shall not receive raw transport internals unnecessarily.

---

# 28. Handler Output

A Handler may produce:

* derived state;
* new Commands;
* new Events;
* Jobs;
* Workflow progression;
* Integration operations;
* completion evidence.

Handler output shall follow the owning subsystem's contracts.

---

# 29. Handler Non-Responsibilities

A Handler shall not:

* mutate unrelated state;
* publish success before commit;
* bypass Platform ownership;
* depend on global Event order without contract;
* swallow permanent failures;
* retry indefinitely;
* log sensitive payloads indiscriminately.

---

# 30. Event Validation

Before processing, the Event shall be validated for:

* contract type;
* contract Version;
* identity;
* source;
* required metadata;
* payload structure;
* ordering metadata where required.

---

# 31. Event Authorization

Internal Events normally reflect already-authorized completed operations.

However, Consumers shall still enforce their own Resource and Capability boundaries.

External or Integration-derived Events require source and scope validation.

---

# 32. Event Source Trust

Authenticated origin does not make payload semantics automatically valid.

Events crossing external boundaries remain validated.

---

# 33. Processing Transaction

Where processing mutates durable state, the Handler shall use an explicit transaction boundary.

---

# 34. Transactional Processing

A typical transactional Consumer flow is:

```text
Begin Transaction
      │
      ├── Check Event not already processed
      ├── Apply Consumer effect
      ├── Record processing completion
      └── Advance checkpoint
      │
      ▼
Commit
```

---

# 35. Atomic Effect and Checkpoint

Where required, the Consumer effect and checkpoint advancement shall commit atomically.

This prevents:

* effect without checkpoint;
* checkpoint without effect;
* duplicate effect after crash.

---

# 36. External Side Effects

External side effects cannot generally join the same local transaction.

Examples include:

* Webhook delivery;
* remote Provider call;
* email notification;
* external publication;
* remote execution request.

These require:

* Outbox;
* stable operation identity;
* external idempotency;
* reconciliation.

---

# 37. Publish New Event

A Handler may publish a new Event only after its own state-changing transaction commits.

---

# 38. Dispatch New Command

A Handler may dispatch a Command when reaction requires new state-changing intent.

The Command shall be explicit.

The Handler shall not mutate another subsystem's state directly.

---

# 39. Event-to-Command Translation

An Event may trigger a Command through explicit translation.

Example:

```text
DocumentImported
      │
      ▼
ScheduleIndexing
```

The new Command has its own identity and authorization context.

---

# 40. Event Chaining

Long chains of Events and Commands shall preserve:

* correlation;
* causation;
* ownership;
* bounded depth;
* observability.

---

# 41. Event Loop

A cycle may occur when Consumers emit Events that eventually reproduce the original trigger.

Event loops shall be detected or prevented.

---

# 42. Loop Prevention

Possible mechanisms include:

* causation tracking;
* operation identity;
* state transition guards;
* idempotency;
* maximum propagation depth;
* explicit cycle design.

---

# 43. Synchronous Processing

Synchronous Event processing occurs within the producer's execution path.

It is appropriate only when:

* the Handler is bounded;
* failure semantics are understood;
* transaction boundaries are compatible;
* coupling is acceptable.

---

# 44. Asynchronous Processing

Asynchronous processing decouples producer completion from Consumer execution.

It is preferred for:

* derived indexing;
* notifications;
* remote operations;
* long-running reactions;
* independent projections;
* Plugin reactions.

---

# 45. Synchronous Handler Failure

A synchronous Handler failure may affect the producer operation only if the architecture explicitly defines it as part of the same consistency boundary.

---

# 46. Asynchronous Handler Failure

An asynchronous Handler failure shall not reverse the already committed producer fact.

It shall enter retry, dead-letter or recovery handling.

---

# 47. Consumer Concurrency

Consumers may process multiple Events concurrently when:

* ordering requirements permit it;
* effects are independent;
* transaction scopes do not conflict;
* Resource limits permit it.

---

# 48. Per-Scope Serialization

A Consumer may serialize processing per:

* Knowledge Object;
* Workflow;
* Peer;
* Provider Connection;
* Plugin;
* partition.

Independent scopes may process concurrently.

---

# 49. Bounded Parallelism

Consumer concurrency shall be bounded.

Unbounded worker creation is prohibited.

---

# 50. Partitioned Processing

Events may be partitioned by stable key.

Ordering may then be preserved per partition while allowing parallel processing across partitions.

---

# 51. Partition Ownership

A partition may be owned by one active Consumer instance or worker.

Ownership transfer shall preserve checkpoint and idempotency.

---

# 52. Consumer Lease

Consumer ownership may use a Lease.

Lease expiration does not prove the old worker stopped.

Fencing or idempotency may still be required.

---

# 53. Ordering Awareness

Consumers shall follow `EventOrdering.md`.

A Consumer shall declare whether it is:

* Unordered;
* BestEffortOrdered;
* OrderedPerScope;
* StrictlyOrderedPerStream;
* CausallyOrdered;
* VersionConvergent;
* Commutative.

---

# 54. Strict Ordering Consumer

A Strict Ordering Consumer shall:

* track expected sequence;
* detect gaps;
* pause later processing when required;
* support replay or rebuild;
* avoid checkpoint advancement past missing Events.

---

# 55. Version-Convergent Consumer

A Version-Convergent Consumer may skip stale intermediate Events when only the latest valid state matters.

Examples may include:

* search index;
* thumbnail cache;
* Provider health projection.

---

# 56. Commutative Consumer

A Commutative Consumer may process Events in any order only when effect equivalence is proven.

---

# 57. Late Event

A late Event shall be:

* processed;
* ignored;
* reconciled;
* quarantined;

according to Consumer policy.

---

# 58. Stale Event

A stale Event shall not overwrite newer derived state blindly.

---

# 59. Retry

Retry behavior shall follow `../Concurrency/RetryPolicies.md`.

A Handler shall not implement hidden infinite retry loops.

---

# 60. Retry Eligibility

Retry may be appropriate for:

* transient storage failure;
* temporary Provider failure;
* temporary Resource contention;
* rate limiting;
* temporary network failure.

---

# 61. Non-Retryable Failure

Non-retryable failures include:

* unsupported Event Version;
* invalid payload;
* incompatible state;
* permanent authorization failure;
* impossible invariant.

---

# 62. Retry Identity

Retry preserves:

* Event Identity;
* Consumer Identity;
* Logical Processing Identity.

Each Attempt receives a new Attempt Identity.

---

# 63. Retry Ordering

For strict-order Consumers, a failed Event may block later Events in the same scope.

Independent scopes may continue.

---

# 64. Retry Exhaustion

After retry policy exhaustion, processing shall enter an explicit terminal state.

Possible states include:

* Failed;
* DeadLettered;
* Quarantined;
* RecoveryRequired;
* Skipped according to policy.

---

# 65. Poison Event

A Poison Event repeatedly fails because of:

* malformed data;
* unsupported Version;
* incompatible state;
* deterministic Handler defect;
* irrecoverable external dependency.

A Poison Event shall not retry indefinitely.

---

# 66. Dead-Letter State

Dead-letter handling isolates Events that cannot be processed safely.

A dead-letter record may contain:

* Event Identity;
* Consumer Identity;
* Event type;
* failure category;
* Attempt history;
* ordering scope;
* checkpoint relation;
* diagnostic metadata.

---

# 67. Dead Letter Is Not Deletion

Dead-lettering preserves evidence that processing failed.

It shall not silently discard the Event.

---

# 68. Dead-Letter Recovery

A dead-letter Event may support:

* manual retry;
* replay after Handler correction;
* projection rebuild;
* skip with explicit governance;
* migration to supported Event Version.

---

# 69. Skip Policy

Skipping a failed Event shall be explicit.

For strict-order or canonical projections, skipping may be prohibited.

---

# 70. Quarantine

Quarantine may be used for Events that are:

* suspicious;
* unauthenticated;
* incompatible;
* security-sensitive;
* semantically unknown.

Quarantined Events shall not enter normal processing.

---

# 71. Checkpoint

A Consumer Checkpoint records durably completed processing progress.

A Checkpoint may contain:

* Consumer Identity;
* Stream Identity;
* partition;
* sequence;
* generation;
* Handler Version;
* processing time.

---

# 72. Checkpoint Scope

Every Checkpoint shall be bound to:

* Consumer;
* stream or partition;
* Event contract Version or Handler Version where required.

---

# 73. Checkpoint Advancement

A Checkpoint shall advance only after the Consumer effect represented by that position is durably committed.

---

# 74. Checkpoint Regression

Checkpoint regression is prohibited unless an explicit replay or rebuild operation creates a new processing generation.

---

# 75. Checkpoint Reset

Resetting a Checkpoint is a privileged operational action.

It may trigger replay and duplicate processing.

Idempotency remains required.

---

# 76. Checkpoint Generation

A new Consumer or projection generation may begin with a new Checkpoint namespace.

Historical and current processing generations shall not be conflated.

---

# 77. Replay

Replay reprocesses historical Events.

Replay may be used for:

* projection rebuild;
* recovery;
* Handler migration;
* diagnostics;
* new Consumer initialization.

---

# 78. Replay Contract

A replayable Consumer shall define:

* starting point;
* ordering guarantee;
* Handler Version;
* state reset policy;
* idempotency behavior;
* external side-effect restrictions.

---

# 79. Replay and External Side Effects

Replay shall not repeat external side effects unless the Consumer contract explicitly permits safe replay.

Examples of unsafe replay include:

* sending notifications again;
* publishing external Webhooks again;
* recreating remote resources.

---

# 80. Projection Replay

Projection Consumers are preferred replay candidates because their state is derived.

---

# 81. Replay Isolation

Replay may execute in:

* isolated projection namespace;
* maintenance mode;
* bounded background process;
* new generation.

It shall not corrupt active projection state.

---

# 82. Replay Completion

Replay completion shall be explicit.

A projection shall not switch to rebuilt state before:

* all required Events are applied;
* integrity checks pass;
* checkpoint reaches target;
* cutover commits.

---

# 83. Consumer Version

A Handler or Consumer may evolve.

Consumer Version shall be tracked when changes affect:

* processing semantics;
* checkpoint compatibility;
* replay outcome;
* idempotency scope;
* projection schema.

---

# 84. Version Compatibility

A Consumer shall reject unsupported Event contract Versions.

Unknown fields may be tolerated only according to the Event compatibility policy.

---

# 85. Handler Migration

A Handler migration may require:

* replay;
* projection migration;
* new Consumer generation;
* compatibility adapter;
* checkpoint reset.

---

# 86. Consumer State

Consumer-owned durable state shall be clearly separated from canonical Domain state unless the Consumer itself owns a canonical capability.

Examples of derived Consumer state include:

* search index;
* projection;
* metrics aggregation;
* thumbnail registry;
* synchronization status view.

---

# 87. Derived State

Derived state should be rebuildable where practical.

Consumer failure shall not corrupt canonical source knowledge.

---

# 88. Canonical Consumer

Some Consumers may invoke Commands that create canonical changes.

Such changes shall occur through the owning Platform capability and normal Command semantics.

The Event Handler shall not directly mutate another subsystem's canonical state.

---

# 89. Projection Consumer

A Projection Consumer builds a read model or derived representation from Events.

It shall define:

* source streams;
* ordering;
* checkpoint;
* rebuild strategy;
* consistency expectations.

---

# 90. Notification Consumer

A Notification Consumer may produce user or external notifications.

It shall define:

* duplicate suppression;
* replay restrictions;
* user preference checks;
* delivery policy;
* privacy rules.

---

# 91. Workflow Consumer

A Workflow Consumer may start or advance a Workflow.

It shall preserve:

* Event causation;
* Workflow Identity;
* idempotency;
* current Workflow state.

---

# 92. Job Consumer

A Consumer may schedule background Jobs.

Duplicate Event delivery shall not schedule uncontrolled duplicate Jobs.

---

# 93. Integration Consumer

An Integration Consumer may translate internal Events into external actions.

It shall use:

* Outbox;
* stable delivery identity;
* external idempotency;
* retry policy;
* data-egress authorization.

---

# 94. Plugin Consumer

Plugins may subscribe to approved Event contracts through the Plugin SDK.

They shall not receive unrestricted Event Bus access.

---

# 95. Plugin Event Isolation

Plugin Event processing shall be:

* capability-controlled;
* Resource-bounded;
* failure-isolated;
* timeout-aware;
* observable.

---

# 96. Plugin Failure

A failing Plugin Consumer shall not block unrelated core Consumers indefinitely.

---

# 97. Plugin Replay

Plugin replay requires explicit permission and compatibility.

Plugins shall not replay arbitrary historical core Events by default.

---

# 98. MCP Consumer

MCP does not subscribe directly to the internal Event Bus by default.

Approved public projections or operations may expose Event-derived state.

---

# 99. Webhook-Derived Event Processing

A validated Webhook may be translated into an Integration Event.

Processing shall preserve:

* external delivery identity;
* source;
* Version;
* timestamp;
* signature verification result;
* deduplication context.

---

# 100. Synchronization Event Processing

Synchronization Events may trigger:

* state discovery;
* Session progression;
* Change Set processing;
* reconciliation.

Transport Events shall not bypass Sync Engine semantics.

---

# 101. Import Event Processing

Import Events may trigger:

* OCR;
* DPM reconstruction;
* indexing;
* thumbnail generation;
* user notification.

Stage dependencies and ordering shall remain explicit.

---

# 102. Export Event Processing

Export Events may trigger:

* publication;
* cleanup;
* indexing of generated Artifacts;
* user notification.

Artifact generation completion and publication completion remain distinct facts.

---

# 103. Annotation Event Processing

Annotation Events may update:

* search indexes;
* render invalidation;
* collaboration projections;
* history views.

They shall preserve Annotation Version ordering.

---

# 104. Library Event Processing

Library Events may trigger:

* index updates;
* synchronization planning;
* cache invalidation;
* provenance updates;
* operational notifications.

Broad Library Events require carefully scoped Consumers.

---

# 105. Search Index Consumer

Search indexing should usually be Version-convergent.

A newer Knowledge Object Version may supersede older unprocessed indexing Events when intermediate indexing is not required.

---

# 106. Render Invalidation Consumer

Render invalidation may coalesce multiple Events affecting the same presentation scope.

Coalescing shall preserve the newest required state.

---

# 107. Provider Event Consumer

Provider lifecycle Events may update operational health projections.

Late stale health Events shall not regress newer verified state.

---

# 108. Remote Execution Event Consumer

Remote execution lifecycle processing shall enforce valid state transitions.

Terminal states shall not regress.

---

# 109. Consumer Failure Isolation

Failure of one Consumer shall not:

* roll back the producer's committed fact;
* stop unrelated Consumers;
* corrupt unrelated projections;
* block core local operation unnecessarily;
* crash the Event Bus.

---

# 110. Consumer Bulkhead

Consumers may use independent:

* worker pools;
* queues;
* concurrency limits;
* circuit breakers;
* retry budgets.

This prevents one failing Consumer from exhausting shared Resources.

---

# 111. Backpressure

Event processing shall apply bounded backpressure.

Unbounded Event queues are prohibited.

---

# 112. Backpressure Strategies

Possible strategies include:

* bounded queue;
* producer throttling;
* consumer scaling;
* partition pausing;
* coalescing;
* prioritization;
* dead-lettering.

The strategy shall match Event criticality.

---

# 113. Consumer Lag

Consumer lag is the distance between:

* latest available Event;
* latest durably processed Event.

Lag shall be observable.

---

# 114. Lag Policy

Persistent lag may cause:

* scaling;
* degraded health;
* user warning;
* maintenance;
* projection rebuild;
* low-priority work suspension.

---

# 115. Memory Boundaries

Consumers shall not load unbounded Event histories into memory.

Replay and catch-up shall use:

* batching;
* streaming;
* pagination;
* checkpoints.

---

# 116. Batch Processing

Consumers may process Events in batches.

Batch semantics shall define:

* maximum size;
* ordering;
* transaction scope;
* partial failure;
* checkpoint advancement.

---

# 117. Batch Atomicity

A batch shall not be treated as atomic unless the Consumer effect and checkpoint commit in one supported transaction.

---

# 118. Partial Batch Failure

A partially failing batch may:

* roll back entirely;
* retry failed subset;
* split into individual Events;
* dead-letter failing Events;
* stop at first failure.

The policy shall be explicit.

---

# 119. Event Coalescing

Derived or operational Events may be coalesced where intermediate facts are not required.

Examples include:

* repeated render invalidations;
* repeated index refresh requests;
* Provider health changes;
* progress updates.

---

# 120. Coalescing Restrictions

Domain history Events shall not be coalesced when intermediate facts are semantically significant.

---

# 121. Event Filtering

Consumers may filter Events by:

* type;
* target;
* Version;
* scope;
* metadata.

Filtering shall not accidentally omit required predecessor Events.

---

# 122. Event Enrichment

Consumers should not rely on mutable external lookups to reconstruct essential historical Event meaning.

Where enrichment is needed, the Handler shall define consistency and failure behavior.

---

# 123. Event-Carried State

An Event may carry enough state for processing.

This reduces dependency on later mutable Queries.

The payload shall remain bounded.

---

# 124. Event Notification

A thin Event may only notify that state changed.

The Consumer then Queries current authoritative state.

This model is appropriate for Version-convergent projections.

---

# 125. Race After Thin Event

When a Consumer Queries current state after a thin Event, the state may have advanced further.

The Consumer shall process the current valid Version rather than assume it corresponds exactly to the triggering Event.

---

# 126. Security

Event Consumers shall enforce:

* source validation;
* Event contract validation;
* scope isolation;
* Capability restrictions;
* secret exclusion;
* Resource limits.

---

# 127. Event Payload Trust

Event payloads originating from external systems remain untrusted until translated and validated.

---

# 128. Sensitive Payloads

Events shall avoid carrying unnecessary sensitive content.

Identifiers and references should be preferred where sufficient.

---

# 129. Secret Prohibition

Events shall never contain:

* passwords;
* access tokens;
* Refresh Tokens;
* private keys;
* NAS credentials;
* Provider secrets.

---

# 130. Consumer Authorization Context

A Consumer-triggered Command shall not automatically use unrestricted system authority.

The correct Principal or delegated system authority shall be explicit.

---

# 131. Confused Deputy Prevention

A Consumer shall not perform a broader action merely because an Event originated from a trusted subsystem.

The Consumer's own authority and policy remain bounded.

---

# 132. Event Replay Security

Replay shall not bypass:

* current security policy;
* Consumer compatibility;
* external side-effect restrictions;
* Plugin capability checks.

---

# 133. Privacy

Event retention and processing may reveal:

* activity history;
* document identity;
* timing;
* user behavior;
* Provider usage.

Retention and observability shall follow privacy policy.

---

# 134. Retention

Event retention shall be sufficient for:

* retry;
* replay;
* checkpoint recovery;
* audit where required.

Retention shall remain bounded.

---

# 135. Consumer Record Retention

Processing records may be retained according to:

* duplicate window;
* replay window;
* diagnostics;
* audit;
* privacy.

---

# 136. Event Deletion

Deleting retained Events may invalidate replay or lagging Consumers.

Compaction or snapshot policy shall be coordinated first.

---

# 137. Observability

Event processing shall be observable.

Observable metadata may include:

* Event Identity;
* Consumer Identity;
* Handler Identity;
* Attempt Identity;
* stream;
* sequence;
* partition;
* processing state;
* duration;
* retry count;
* failure category;
* checkpoint;
* lag.

---

# 138. Logging

Logs should record:

* Event received;
* duplicate detected;
* processing started;
* processing completed;
* retry scheduled;
* dead-lettered;
* checkpoint advanced;
* replay started;
* replay completed.

Full sensitive payloads shall not be logged by default.

---

# 139. Metrics

Metrics may include:

* Events received;
* Events completed;
* duplicate Events;
* retry count;
* processing latency;
* queue depth;
* consumer lag;
* dead-letter count;
* stale Event count;
* replay throughput;
* failure rate;
* batch size.

---

# 140. Tracing

Tracing may represent:

```text
Event Published
      │
      ▼
Delivered
      │
      ▼
Consumer Dispatch
      │
      ▼
Handler Attempt
      │
      ▼
Consumer Transaction
      │
      ▼
Checkpoint
```

Retries shall appear as separate Attempts under one logical processing trace.

---

# 141. Audit

Security-sensitive Event processing may audit:

* Event source;
* Consumer;
* processing result;
* external side effect;
* dead-letter override;
* checkpoint reset;
* replay operation.

---

# 142. Health

A Consumer may report:

* Healthy;
* Degraded;
* Blocked;
* Failed;
* Rebuilding;
* Disabled.

Health shall consider:

* lag;
* repeated failure;
* dead-letter accumulation;
* unavailable dependency;
* checkpoint corruption.

---

# 143. Failure Categories

Stable processing failure categories may include:

* InvalidEvent;
* UnsupportedEventVersion;
* UnauthorizedEventSource;
* DuplicateEventConflict;
* SequenceGap;
* ConsumerUnavailable;
* HandlerFailed;
* RetryExhausted;
* CheckpointConflict;
* ProjectionConflict;
* ExternalEffectUnknown;
* DeadLettered;
* ReplayIncompatible.

---

# 144. Invalid Event

An invalid Event shall not enter normal Handler execution.

It may be rejected or quarantined.

---

# 145. Unsupported Version

An unsupported Event Version shall fail explicitly.

The Consumer shall not guess semantics.

---

# 146. Duplicate Conflict

A repeated Event Identity with different payload or sequence is an integrity failure.

---

# 147. Projection Conflict

A Projection Conflict occurs when Consumer state no longer matches the expected Event sequence or Version.

Recovery may require replay or rebuild.

---

# 148. Checkpoint Corruption

A corrupt or incompatible Checkpoint shall not be advanced or ignored silently.

---

# 149. Recovery

Consumer recovery may include:

* retry;
* replay;
* projection rebuild;
* checkpoint restoration;
* partition reassignment;
* dead-letter repair;
* dependency recovery.

---

# 150. Process Restart

After restart, durable Consumers shall recover from:

* Checkpoint;
* processing records;
* Event store;
* Inbox;
* partition ownership state.

---

# 151. In-Flight Event After Crash

A crash may occur after effect commit but before acknowledgement.

Idempotency and transactional checkpointing shall prevent duplicate effect.

---

# 152. Projection Rebuild

A projection rebuild shall:

1. create isolated state;
2. replay required Events;
3. validate result;
4. establish Checkpoint;
5. cut over atomically where possible.

---

# 153. Consumer Disablement

A Consumer may be disabled.

Disablement shall define:

* whether new Events queue;
* whether lag accumulates;
* whether Events expire;
* whether replay is required on re-enable.

---

# 154. Consumer Removal

Removing a Consumer shall consider:

* checkpoints;
* derived state;
* retained Event dependencies;
* Plugin lifecycle;
* audit requirements.

---

# 155. Testing Requirements

Event processing shall be tested through:

* successful processing;
* duplicate delivery;
* concurrent duplicate delivery;
* out-of-order delivery;
* sequence gap;
* retry;
* Retry Exhaustion;
* poison Event;
* dead-letter recovery;
* process crash;
* checkpoint recovery;
* replay;
* projection rebuild;
* external side-effect ambiguity;
* consumer lag;
* security boundaries.

---

# 156. Idempotency Testing

The same Event shall be processed:

* sequentially;
* concurrently;
* after restart;
* during replay.

Duplicate effects shall not occur.

---

# 157. Transaction Testing

Tests shall verify that:

* Consumer effect and checkpoint align;
* crash after effect does not duplicate effect;
* checkpoint does not advance before commit;
* rollback leaves no false completion.

---

# 158. Ordering Testing

Tests shall verify each Consumer's declared ordering model.

---

# 159. Retry Testing

Tests shall include:

* transient failure;
* permanent failure;
* rate limiting;
* cancellation;
* Retry Budget exhaustion;
* retry after process restart.

---

# 160. Dead-Letter Testing

Tests shall verify:

* retry exhaustion;
* dead-letter record creation;
* no infinite retry;
* manual recovery;
* ordering impact.

---

# 161. Replay Testing

Replay tests shall verify:

* correct start point;
* correct Event order;
* Handler Version compatibility;
* external side-effect suppression;
* projection equivalence;
* final Checkpoint.

---

# 162. Concurrency Testing

Tests shall execute independent and conflicting Events concurrently.

---

# 163. Backpressure Testing

Tests shall verify bounded queues and stable behavior under producer overload.

---

# 164. Consumer Lag Testing

Tests shall simulate slow Consumers and verify:

* lag measurement;
* health degradation;
* catch-up behavior;
* no memory explosion.

---

# 165. Crash Testing

Tests shall inject crashes:

* before Handler start;
* during Handler work;
* before effect commit;
* after effect commit;
* before checkpoint;
* after checkpoint;
* before acknowledgement.

---

# 166. Security Testing

Tests shall include:

* forged Event;
* unsupported source;
* payload tampering;
* cross-scope injection;
* secret leakage;
* unauthorized Plugin subscription;
* replay abuse.

---

# 167. Governance

Changes affecting Event processing require architectural review when they alter:

* delivery guarantee;
* Consumer identity;
* idempotency scope;
* checkpoint semantics;
* ordering;
* replay;
* dead-letter policy;
* external side effects;
* Plugin Event access;
* projection ownership.

---

# 168. Event Processing Invariants

The following invariants apply.

* Event processing reacts to completed facts.
* Events are immutable after publication.
* Every durable Consumer has stable Consumer Identity.
* Every Subscription declares delivery and ordering semantics.
* AtLeastOnce Consumers are idempotent.
* Duplicate delivery is expected.
* Event Identity remains stable across redelivery.
* Consumer idempotency is scoped by Consumer.
* Consumer effect and Checkpoint commit atomically where required.
* External side effects use Outbox, stable identity or reconciliation.
* Handler failure does not reverse the producer's committed fact.
* One Consumer failure does not stop unrelated Consumers.
* Consumer concurrency is bounded.
* Ordering requirements are explicit.
* Retry is bounded and governed.
* Poison Events do not retry indefinitely.
* Dead-letter state preserves failure evidence.
* Checkpoints represent durably processed progress.
* Checkpoints do not advance past unapplied required Events.
* Replay reprocesses historical facts; it does not recreate their occurrence.
* Replay does not repeat external side effects by default.
* Projection rebuild occurs in isolation before cutover.
* Plugins do not receive unrestricted Event Bus access.
* External Events remain untrusted until translated and validated.
* Events never contain credentials or secrets.
* Consumer lag, failures and retries remain observable.
* Event processing is recoverable and testable.

---

# 169. Prohibited Behaviors

KnowledgeOS shall never:

* treat Event delivery as a new request to perform the original action;
* mutate Event payloads after publication;
* assume Event delivery occurs exactly once;
* process AtLeastOnce Events without idempotency;
* advance Checkpoints before durable effect commit;
* publish success from a Consumer before its transaction commits;
* allow one Consumer failure to roll back the producer's committed fact;
* retry Poison Events indefinitely;
* hide dead-lettered Events;
* use unbounded Consumer concurrency;
* use unbounded Event queues;
* bypass ordering requirements for throughput;
* replay external side effects automatically;
* let Plugins subscribe to arbitrary internal Events without Capability control;
* trust external Event payloads merely because transport authentication succeeded;
* include credentials in Events;
* reconstruct essential historical meaning only from mutable current state;
* skip required Events silently;
* reset Checkpoints without governance;
* hide persistent consumer lag or failure from observability.

---

# 170. Related Documents

## Execution

* `../README.md`
* `Commands.md`
* `EventOrdering.md`
* `Events.md`
* `Queries.md`
* `../Concurrency/ConcurrencyModel.md`
* `../Concurrency/Determinism.md`
* `../Concurrency/Idempotency.md`
* `../Concurrency/Locking.md`
* `../Concurrency/RetryPolicies.md`
* `../Concurrency/Transactions.md`
* `../Reliability/Checkpointing.md`
* `../Reliability/ErrorHandling.md`
* `../Reliability/Recovery.md`
* `../Reliability/Tracing.md`
* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`

## Kernel

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

* `../../05-Integration/ExternalServices/EventIntegration.md`
* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/ExternalServices/Webhooks.md`
* `../../05-Integration/PluginSDK/Capabilities.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 171. Status

**Approved**

This document defines the Event processing model of KnowledgeOS.

Event processing reacts to completed facts.

Events remain immutable.

Durable Consumers have stable identity, explicit subscriptions, declared delivery guarantees, ordering requirements, Retry Policies and Checkpoints.

AtLeastOnce delivery is expected for reliable asynchronous processing.

Consumers are idempotent.

Duplicate delivery does not create duplicate effects.

Consumer effects and Checkpoint advancement are coordinated transactionally where required.

External side effects use stable identity, Outbox or reconciliation rather than relying on local atomicity.

Handler failure does not reverse the producer's committed fact.

One failing Consumer does not block unrelated Consumers.

Concurrency and queues remain bounded.

Strict-order Consumers detect gaps and do not advance beyond missing required Events.

Poison Events do not retry indefinitely.

Dead-letter state preserves evidence and supports governed recovery.

Replay reprocesses historical facts without claiming those facts occurred again.

External side effects are not repeated during replay by default.

Projection rebuilds occur in isolation and cut over only after validation.

Plugins receive only approved Event access.

External Events remain untrusted until translated and validated.

KnowledgeOS therefore processes Events as durable, ordered where necessary, idempotent and recoverable reactions without allowing asynchronous delivery behavior to redefine canonical truth.
