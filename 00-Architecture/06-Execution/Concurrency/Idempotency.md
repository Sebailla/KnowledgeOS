# Idempotency

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Concurrency

**Document:** Idempotency

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the idempotency model of KnowledgeOS.

Idempotency governs how repeated execution of the same logical operation is detected, coordinated and resolved without producing unintended additional effects.

Operations may repeat because of:

* retry;
* message redelivery;
* network uncertainty;
* process restart;
* Workflow recovery;
* synchronization replay;
* duplicate user interaction;
* Provider timeout;
* lost acknowledgement;
* background Job recovery;
* external Webhook duplication;
* Plugin retry;
* remote execution ambiguity.

The purpose of idempotency is to preserve the original operation intent across these repetitions.

---

# 2. Scope

This document governs idempotency across:

* Commands;
* Events;
* Queries where applicable;
* Jobs;
* Workflow Steps;
* Import operations;
* Export operations;
* Library mutations;
* synchronization Change Sets;
* Storage operations;
* Provider operations;
* Webhooks;
* MCP Tool invocations;
* remote execution;
* Plugin operations;
* OAuth token refresh;
* background processing;
* recovery;
* replay;
* external API requests.

This document also governs:

* Idempotency Keys;
* Operation Identity;
* duplicate detection;
* idempotency scope;
* result reuse;
* atomic effect registration;
* retention;
* conflict handling;
* retry interaction;
* concurrency interaction;
* external idempotency;
* ambiguous completion.

This document does not define:

* Domain equivalence;
* merge semantics;
* synchronization conflict resolution;
* concrete storage implementation;
* Provider-specific deduplication mechanisms;
* transaction implementation details.

---

# 3. Architectural Position

Idempotency belongs to the Execution layer.

```text
Logical Operation
      │
      ▼
Idempotency Boundary
      │
      ├── First Execution
      │
      └── Repeated Execution
              │
              ▼
      Same Logical Outcome
```

The Domain defines valid state transitions.

Execution ensures repeated delivery does not create unintended duplicate transitions.

---

# 4. Core Principle

The fundamental principle is:

> Repeating the same logical operation shall not create unintended additional effects.

Equivalent repeated invocation shall produce one of the following:

* reuse the original successful result;
* report that the operation is already in progress;
* continue the original recoverable execution;
* report the original terminal failure where policy requires it;
* reject inconsistent reuse of the same identity.

It shall not silently create a second logical operation.

---

# 5. Mission

The mission of idempotency is to make repeated execution safe across:

* unreliable networks;
* asynchronous messaging;
* Offline First operation;
* process interruption;
* external systems;
* concurrent delivery;
* retries;
* recovery.

---

# 6. Design Philosophy

Idempotency shall be:

* explicit;
* scoped;
* identity-based;
* atomic where effects require it;
* observable;
* bounded in retention;
* stable across safe retry;
* independent from transport delivery identity where necessary;
* subordinate to Domain semantics.

---

# 7. Idempotent Operation

An operation is idempotent when repeated execution with the same logical identity and equivalent request semantics does not create unintended additional effects.

Conceptually:

```text
Execute Operation X once
        =
Execute Operation X multiple times
```

The equality applies to intended logical effects.

It does not always require identical operational telemetry or timing.

---

# 8. Logical Operation

A Logical Operation represents one intended action.

Examples include:

* create one Annotation;
* import one selected source as one operation;
* publish one Export Artifact;
* apply one synchronization Change Set;
* submit one remote execution;
* process one Webhook event;
* refresh one credential set;
* install one Plugin Version.

Multiple execution attempts may belong to the same Logical Operation.

---

# 9. Logical Operation Identity

Every operation requiring idempotency shall have stable Logical Operation Identity.

The identity may be represented through:

* Command Identity;
* Idempotency Key;
* Change Set Identity;
* Job Identity;
* Workflow Step Identity;
* external event identity;
* remote operation identity;
* explicit Operation Identity.

---

# 10. Attempt Identity

Each physical attempt may have its own Attempt Identity.

```text
Logical Operation X
    ├── Attempt 1
    ├── Attempt 2
    └── Attempt 3
```

Attempt Identity supports diagnostics.

It shall not replace Logical Operation Identity.

---

# 11. Idempotency Key

An Idempotency Key identifies one Logical Operation within a defined scope.

A key shall be:

* stable;
* unique within its scope;
* reusable across safe retries;
* non-reusable for unrelated intent;
* opaque where practical.

---

# 12. Key Scope

Every Idempotency Key shall have an explicit scope.

Possible scopes include:

* Principal;
* Device;
* Library;
* Knowledge Object;
* Provider Connection;
* API Client;
* Plugin;
* synchronization Peer;
* external Endpoint;
* operation type.

A key is not globally meaningful unless its contract explicitly defines global scope.

---

# 13. Key Composition

A logical idempotency identity may be composed from:

```text
Scope Identity
    +
Operation Type
    +
Idempotency Key
```

Additional Version or contract information may be included where required.

---

# 14. Key Generation

Keys may be:

* generated by KnowledgeOS;
* supplied by an approved client;
* inherited from an external stable event identity;
* derived from a stable operation identity.

Client-supplied keys remain untrusted until validated.

---

# 15. Key Stability

A retry of the same Logical Operation shall preserve the original key.

Generating a new key transforms the invocation into a distinct Logical Operation.

---

# 16. Key Reuse

Reusing the same key for different operation semantics is invalid.

KnowledgeOS shall detect inconsistent key reuse where possible.

---

# 17. Request Fingerprint

An Idempotency Record may preserve a Request Fingerprint.

The fingerprint may include:

* operation type;
* target identity;
* normalized request data;
* contract Version;
* relevant scope.

The fingerprint helps detect a key reused with different intent.

---

# 18. Sensitive Request Data

A Request Fingerprint should use:

* canonical hash;
* bounded normalized metadata;
* references;

instead of storing unnecessary sensitive payloads.

---

# 19. Idempotency Record

An Idempotency Record represents the known execution state of a Logical Operation.

It may contain:

* Idempotency Key;
* scope;
* operation type;
* Request Fingerprint;
* Logical Operation Identity;
* state;
* result reference;
* failure classification;
* creation time;
* completion time;
* expiration;
* owner.

---

# 20. Idempotency State

Possible states include:

* Registered;
* InProgress;
* Completed;
* FailedRetryable;
* FailedTerminal;
* Cancelled;
* OutcomeUnknown;
* Expired.

---

# 21. Registered

Registered means the operation identity has been reserved but execution has not yet begun or committed.

---

# 22. In Progress

InProgress means an execution attempt currently owns or advances the Logical Operation.

Repeated invocation may:

* wait;
* return an accepted status;
* attach to the existing operation;
* report operation status.

---

# 23. Completed

Completed means the intended logical effect has been successfully established.

Repeated invocation shall normally return or reference the original result.

---

# 24. Failed Retryable

FailedRetryable means the operation has not completed and policy permits another attempt.

The same Logical Operation Identity shall be preserved.

---

# 25. Failed Terminal

FailedTerminal means the Logical Operation cannot proceed without a new or changed intent.

Repeated equivalent invocation may return the original terminal failure.

---

# 26. Cancelled

Cancelled means execution was terminated according to the operation's cancellation contract.

Whether the same key may be retried shall be explicitly defined.

---

# 27. Outcome Unknown

OutcomeUnknown means KnowledgeOS cannot determine whether the external or distributed effect completed.

This state requires reconciliation before unsafe retry.

---

# 28. Expired

Expired means the Idempotency Record is no longer retained as active duplicate evidence.

Expiration does not automatically mean the original external effect ceased to exist.

---

# 29. Atomic Registration

For operations that mutate canonical state, idempotency registration and effect establishment shall be coordinated atomically where required.

The unsafe model is:

```text
Check Key Missing
      │
      ▼
Concurrent Operation Checks Key Missing
      │
      ▼
Both Apply Effect
```

The correct model requires atomic claim or transactional enforcement.

---

# 30. Atomic Claim

An Atomic Claim establishes that one execution owns the first attempt for a Logical Operation.

Other concurrent attempts shall observe the existing claim.

---

# 31. Effect and Record Atomicity

Where possible, the canonical effect and successful idempotency completion shall share one transaction boundary.

```text
Begin Transaction
      │
      ├── Validate / Claim Idempotency Key
      ├── Apply Canonical Effect
      └── Store Completion Result
      │
      ▼
Commit
```

---

# 32. External Side Effects

External effects generally cannot participate in the same local transaction.

Examples include:

* remote API call;
* outbound Webhook;
* remote execution submission;
* cloud write;
* external publication.

These operations require additional strategies.

---

# 33. External Idempotency

External idempotency may rely upon:

* Provider-supported Idempotency Key;
* stable remote Resource Identity;
* conditional create;
* request deduplication;
* reconciliation;
* Outbox pattern;
* Inbox pattern.

---

# 34. External Provider Support

Where an external Provider supports Idempotency Keys, KnowledgeOS shall preserve the same key across safe retries.

Provider support shall be verified rather than assumed.

---

# 35. Provider Key Mapping

KnowledgeOS may map its Logical Operation Identity to a Provider-specific key.

The mapping shall remain stable for the operation.

---

# 36. Ambiguous External Completion

A timeout or connection loss may occur after an external system applied the effect.

```text
KnowledgeOS sends request
        │
        ▼
External system applies effect
        │
        X
Acknowledgement lost
```

The outcome is unknown.

Blind retry is prohibited unless the operation is externally idempotent.

---

# 37. Reconciliation

Reconciliation may determine whether an ambiguous operation completed.

It may use:

* remote operation lookup;
* stable external identifier;
* Provider status Query;
* content comparison;
* remote idempotency record;
* destination inspection.

---

# 38. Reconciliation Before Retry

An OutcomeUnknown operation shall be reconciled before retry when duplicate external effects would be unsafe.

---

# 39. Idempotency and Retry

Retry repeats an execution attempt.

Idempotency preserves the Logical Operation across those attempts.

```text
Retry Policy
    │
    └── decides whether another attempt may occur

Idempotency
    │
    └── ensures attempts represent one logical intent
```

---

# 40. Retry Does Not Create New Intent

Automatic retry shall not create:

* new logical identity;
* new canonical object;
* new external publication;
* new Annotation;
* new import operation;

unless the original contract explicitly defines repeated effects.

---

# 41. Retry Parameters

Safe retry shall preserve semantic inputs.

Retry may change operational parameters such as:

* connection;
* worker;
* delay;
* target replica where equivalent;
* tracing Attempt Identity.

It shall not change original intent silently.

---

# 42. Idempotency and Concurrency

Duplicate invocations may occur concurrently.

Idempotency enforcement shall be concurrency-safe.

A read-then-write check without atomic coordination is insufficient.

---

# 43. Concurrent Duplicate Handling

Concurrent duplicates may:

* join the original in-flight operation;
* wait for completion;
* receive InProgress status;
* return the completed result;
* receive a duplicate conflict where the contract requires it.

They shall not execute independent canonical effects.

---

# 44. Single-Flight Execution

Single-flight execution allows concurrent equivalent requests to share one active operation.

It is useful for:

* token refresh;
* derived artifact generation;
* expensive Queries;
* Provider metadata refresh;
* identical remote fetches.

---

# 45. Single-Flight Is Not Persistent Idempotency

Single-flight coordinates active in-memory work.

It does not replace durable idempotency across:

* process restart;
* device restart;
* delayed redelivery;
* external retry.

---

# 46. Idempotency and Transactions

Detailed transaction rules are defined in `Transactions.md`.

Idempotency enforcement shall align with the operation's transaction boundary.

---

# 47. Idempotency and Determinism

A retried deterministic operation shall preserve its declared inputs.

A nondeterministic operation may still be idempotent when the first accepted result is preserved and reused.

---

# 48. Nondeterministic Idempotent Result

For a nondeterministic operation such as AI inference, idempotency may mean:

* preserve and return the original accepted result;
* do not perform another inference for the same Logical Operation;
* create a new Logical Operation only when re-execution is explicitly requested.

---

# 49. Idempotency and Identity

Logical identity and canonical object identity shall not be regenerated unnecessarily during retry.

Example:

```text
CreateAnnotation Operation
    │
    ├── Annotation Identity generated once
    ├── Attempt 1 fails transiently
    └── Attempt 2 reuses same Annotation Identity
```

---

# 50. Commands

Commands that may be redelivered or retried shall define idempotency behavior.

Possible classifications include:

* Naturally Idempotent;
* Idempotent by Key;
* Non-Idempotent;
* Idempotent Through Version Check.

---

# 51. Naturally Idempotent Command

A naturally idempotent Command produces the same intended state when repeated.

Example:

```text
SetPluginEnabled(pluginId, true)
```

Repeating it leaves the Plugin enabled.

---

# 52. Non-Naturally Idempotent Command

A Command such as:

```text
CreateAnnotation(...)
```

is not naturally idempotent.

It requires stable Operation or Annotation Identity to prevent duplicate creation.

---

# 53. Version-Checked Command

A Command may be idempotent through an expected Version.

If the intended Version transition already occurred, the operation may return the existing result.

If state changed differently, it shall report conflict rather than duplicate effect.

---

# 54. Command Result Reuse

Repeated completed Commands may return:

* the original result;
* a stable reference to it;
* equivalent public output.

Result reconstruction shall not alter semantics.

---

# 55. Queries

Queries are semantically read-only, but repeated Queries are not always operationally free.

They may trigger:

* cache population;
* external fetch;
* expensive computation.

Query deduplication or single-flight may improve efficiency.

---

# 56. Query Idempotency

A Query shall not create authoritative state changes.

Repeated Query execution may return different results when declared state changes.

This is not an idempotency violation.

---

# 57. Events

Event delivery may be duplicated.

Event Handlers shall define duplicate behavior.

---

# 58. Event Identity

Replayable or durable Events shall have stable Event Identity.

Redelivery shall preserve the same Event Identity.

---

# 59. Event Handler Idempotency

A Handler may enforce idempotency using:

* Event Identity;
* Handler Identity;
* Handler Version;
* Consumer Scope.

---

# 60. Handler Idempotency Scope

The same Event may be legitimately processed once by multiple independent Handlers.

Therefore, duplicate identity may be scoped as:

```text
Event Identity
    +
Handler Identity
```

---

# 61. Handler Version

If Handler semantics change materially, replay behavior may require Handler Version in the idempotency scope.

This shall be governed deliberately.

---

# 62. Event Side Effects

A Handler performing an external side effect shall use external idempotency or an Outbox where appropriate.

---

# 63. Jobs

Durable Jobs shall have stable Job Identity.

Worker retries shall preserve Job Identity.

---

# 64. Job Attempt

Each worker execution may use distinct Attempt Identity while representing the same Job.

---

# 65. Job Completion

A Job shall not be marked completed until its defined completion guarantee is satisfied.

Premature completion may prevent necessary retry.

---

# 66. Job Lease Expiration

A lease may expire while the previous worker continues execution.

Therefore, lease expiration alone does not prove no side effect occurred.

Idempotency remains required.

---

# 67. Workflows

Workflow Steps may be retried.

Step identity shall be stable within the Workflow instance.

---

# 68. Workflow Step Key

A Step Idempotency Key may derive from:

```text
Workflow Identity
    +
Step Identity
    +
Logical Iteration Identity
```

---

# 69. Workflow Branches

Parallel Workflow branches shall not reuse the same idempotency scope unless they represent the same Logical Operation.

---

# 70. Workflow Compensation

Compensation is not idempotency.

An idempotent operation prevents duplicate effect.

Compensation performs a new effect intended to counteract a previous one.

---

# 71. Import Idempotency

Import shall distinguish:

* repeated execution of one Import Operation;
* a new intentional import of the same source;
* reprocessing an existing imported object;
* importing a new source Version.

These are not automatically equivalent.

---

# 72. Import Operation Identity

An Import Operation shall have stable identity across retry and recovery.

---

# 73. Source Identity Is Not Sufficient

The same source may be intentionally imported more than once.

Therefore, Source Identity alone shall not universally serve as Idempotency Key.

---

# 74. Duplicate Import Policy

Duplicate source detection may:

* warn;
* link to existing import;
* create a new Version;
* create a separate Knowledge Object;
* reject duplicate intent.

This is a Product and Platform policy, not generic idempotency.

---

# 75. Import Commit

Canonical import creation and idempotency completion should share an atomic boundary where possible.

---

# 76. Import Recovery

Recovery shall resume the same Import Operation rather than create a second canonical import silently.

---

# 77. Export Idempotency

Export operation identity and exported artifact identity are distinct.

Repeated execution may:

* reuse an existing valid Artifact;
* regenerate an equivalent Artifact;
* resume publication;
* detect completed publication.

---

# 78. Export Destination Effect

Publishing to an external destination may be non-idempotent.

Examples include:

* creating duplicate remote files;
* creating multiple remote posts;
* sending repeated messages.

Stable destination identity or Provider idempotency shall be used where possible.

---

# 79. Export Artifact Reuse

A deterministic valid staged Artifact may be reused across publication retry when:

* source snapshot is unchanged;
* Export Profile is unchanged;
* artifact integrity remains valid.

---

# 80. Storage Read Idempotency

Reads are normally idempotent with respect to storage state.

Repeated reads may return different data if the underlying state changes.

---

# 81. Storage Write Idempotency

A write may be idempotent when it writes the same content to the same logical target using compatible conditional semantics.

---

# 82. Create Operation

Create-if-absent operations require stable target identity or Idempotency Key.

Randomly generating a new path on every retry is not idempotent.

---

# 83. Replace Operation

Replacing a target with the same expected content may be idempotent.

Version preconditions shall prevent overwriting unrelated newer changes.

---

# 84. Delete Operation

Delete may be treated as idempotent when deleting an already absent target is an accepted equivalent outcome.

The contract shall define this behavior.

---

# 85. Move Operation

Move may not be naturally idempotent.

Retry must account for states such as:

* source exists, destination absent;
* source absent, destination exists;
* both exist;
* neither exists.

Reconciliation is required.

---

# 86. Synchronization Idempotency

Synchronization exchanges shall tolerate duplicate:

* Change Sets;
* Tombstones;
* Asset chunks;
* acknowledgements;
* session messages.

---

# 87. Change Set Identity

A Change Set shall have stable identity across retry, replay and redelivery.

---

# 88. Duplicate Change Set

A duplicate Change Set shall not create duplicate Domain Versions or repeated side effects.

---

# 89. Tombstone Idempotency

Applying the same Tombstone repeatedly shall not produce repeated deletion side effects.

The Tombstone Version and object identity shall remain stable.

---

# 90. Asset Chunk Idempotency

Repeated Asset chunk delivery shall not duplicate bytes or corrupt assembly.

Chunk identity, offset and integrity shall be validated.

---

# 91. Webhook Idempotency

Inbound Webhooks commonly use at-least-once delivery.

KnowledgeOS shall expect duplicates.

---

# 92. Webhook Delivery Identity

Where available, Provider Delivery Identity shall be preserved.

If absent, a bounded Provider-specific deduplication strategy may be used.

---

# 93. Webhook Receipt and Processing

Receipt deduplication and processing idempotency are distinct.

A duplicate may be detected:

* before Inbox persistence;
* after Inbox persistence;
* during downstream processing.

---

# 94. Outbound Webhook Idempotency

Outbound Webhook retries shall preserve stable Event or Delivery Identity.

KnowledgeOS cannot guarantee external consumer idempotency, but shall provide identity evidence where the contract supports it.

---

# 95. Remote Execution Idempotency

Remote execution submission shall use stable Operation Identity.

When supported, the same Provider Idempotency Key shall be reused across retry.

---

# 96. Remote Result Idempotency

Repeated result delivery shall not cause repeated canonical application.

Result Identity and Execution Identity shall support deduplication.

---

# 97. MCP Tool Idempotency

MCP Tools shall declare side-effect and idempotency characteristics.

Possible classifications include:

* ReadOnly;
* Idempotent;
* IdempotentWithKey;
* NonIdempotent;
* Unknown.

---

# 98. AI-Generated Tool Invocation

AI-generated duplicate Tool calls remain duplicate external requests.

AI origin does not remove the need for idempotency enforcement.

---

# 99. OAuth Refresh Idempotency

Token refresh is not necessarily idempotent at the Provider level, especially with rotating Refresh Tokens.

KnowledgeOS shall coordinate refresh through single-flight execution.

---

# 100. Refresh Token Rotation

Concurrent or repeated refresh attempts may invalidate credentials.

Refresh coordination shall preserve the newest valid credential set and prevent stale overwrite.

---

# 101. Plugin Operations

Plugins shall declare or inherit idempotency requirements for retryable operations.

A Plugin shall not rely upon being invoked exactly once.

---

# 102. Plugin Identity Scope

Plugin idempotency may be scoped by:

* Plugin Identity;
* Plugin Version;
* operation type;
* Resource Scope;
* Idempotency Key.

---

# 103. Public API

Public state-changing APIs should support Idempotency Keys where clients may safely retry after uncertain network outcomes.

---

# 104. API Key Validation

A Public API shall reject use of the same Idempotency Key with incompatible request semantics.

---

# 105. API Response

A repeated completed API request may return:

* the original response;
* equivalent current result;
* operation status reference.

The contract shall define which.

---

# 106. Local API

Local clients may also produce duplicate requests because of:

* UI retry;
* process reconnection;
* IPC uncertainty;
* application restart.

Local transport does not eliminate idempotency requirements.

---

# 107. Result Retention

Returning the original result may require storing:

* complete result;
* result reference;
* canonical identity;
* terminal status;
* response fingerprint.

Retention shall be bounded and privacy-aware.

---

# 108. Large Results

Large results should not be duplicated in Idempotency Records unnecessarily.

Stable references may be preserved instead.

---

# 109. Result Expiration

An Idempotency Record may outlive the result payload.

The contract shall define behavior when the original result is no longer retained.

---

# 110. Idempotency Retention

Idempotency records shall have retention appropriate to:

* maximum retry duration;
* message redelivery window;
* Workflow recovery period;
* external Provider uncertainty;
* security and privacy policy.

---

# 111. Premature Expiration

Premature expiration may allow an old duplicate operation to execute again.

Retention shall consider realistic delayed delivery.

---

# 112. Unbounded Retention

Unbounded idempotency retention is prohibited unless explicit long-term semantics require it.

---

# 113. Retention Scope

Different operation classes may have different retention periods.

Examples include:

* Webhook receipt;
* API mutation;
* synchronization Change Set;
* Import Operation;
* remote execution.

---

# 114. Garbage Collection

Expired Idempotency Records may be removed through controlled cleanup.

Cleanup shall not delete canonical results.

---

# 115. Archival Evidence

Long-term audit or provenance may preserve operation identity after active duplicate protection expires.

Audit evidence and active idempotency storage are distinct.

---

# 116. Failure Semantics

An idempotent system shall distinguish:

* operation not started;
* operation in progress;
* operation completed;
* operation failed before effect;
* operation failed after partial effect;
* operation outcome unknown.

---

# 117. Failure Before Effect

If failure occurs before any effect, retry may proceed using the same identity.

---

# 118. Failure After Internal Commit

If canonical effect committed but response failed, retry shall detect completion and return the original result.

---

# 119. Failure During External Effect

If external completion is ambiguous, state shall become OutcomeUnknown until reconciliation or safe idempotent retry.

---

# 120. Partial Effect

A partially completed multi-step operation may require:

* recovery;
* continuation;
* compensation;
* terminal failure.

Idempotency alone does not guarantee multi-step atomicity.

---

# 121. Idempotency and Checkpointing

A recoverable operation may combine:

* stable Logical Operation Identity;
* Step Identities;
* Checkpoints;
* idempotent stage execution.

---

# 122. Stage Idempotency

Each retryable stage shall define whether it is:

* repeatable;
* resumable;
* externally idempotent;
* non-repeatable.

---

# 123. Checkpoint Advancement

A Checkpoint shall advance only after the stage's effect and idempotency evidence are durably established.

---

# 124. Security

Idempotency Keys shall not grant authority.

Possession of a valid key does not replace:

* authentication;
* authorization;
* Capability validation;
* scope validation.

---

# 125. Key Guessing

Keys exposed across trust boundaries should be sufficiently unpredictable when key disclosure could reveal operation existence.

---

# 126. Key Enumeration

Responses shall avoid leaking sensitive operation information through guessable Idempotency Keys.

---

# 127. Cross-Principal Isolation

One Principal shall not retrieve another Principal's result merely by presenting the same key.

Scope validation is mandatory.

---

# 128. Sensitive Result Storage

Stored results or fingerprints shall minimize sensitive content.

---

# 129. Replay Attack Distinction

Legitimate retry and malicious replay may use similar repeated messages.

Security-sensitive operations may require:

* authenticated source;
* freshness window;
* nonce;
* signature;
* authorization revalidation.

Idempotency prevents duplicate effect but does not prove message legitimacy.

---

# 130. Authorization Revalidation

A repeated or delayed operation may require current authorization validation.

Previous authorization does not necessarily remain valid indefinitely.

---

# 131. Expired Intent

Some user intents expire.

Examples include:

* temporary share;
* time-bounded remote execution;
* short-lived external authorization.

A delayed duplicate shall not execute after semantic expiration.

---

# 132. Observability

Idempotency behavior shall be observable.

Observable metadata may include:

* Logical Operation Identity;
* Attempt Identity;
* Idempotency Key hash or redacted representation;
* scope;
* current state;
* duplicate count;
* original completion time;
* reconciliation state.

---

# 133. Logging

Raw external Idempotency Keys should be redacted or hashed where exposure is unnecessary.

Logs shall identify:

* duplicate detected;
* key conflict;
* operation reused;
* OutcomeUnknown;
* reconciliation result.

---

# 134. Metrics

Idempotency metrics may include:

* first executions;
* duplicates detected;
* in-flight joins;
* completed-result reuses;
* inconsistent key reuse;
* OutcomeUnknown operations;
* reconciliation successes;
* reconciliation failures;
* expired-record duplicates;
* single-flight consolidations.

---

# 135. Tracing

Repeated Attempts shall link to the same Logical Operation trace context where practical.

Each Attempt may have a child span.

```text
Logical Operation
    ├── Attempt 1
    ├── Attempt 2
    └── Reconciliation
```

---

# 136. Audit

Security-sensitive or externally consequential operations may audit:

* Logical Operation Identity;
* Principal;
* operation type;
* first execution;
* duplicate attempts;
* terminal result;
* reconciliation.

Raw secrets shall not be included.

---

# 137. Testing Requirements

Idempotency-sensitive operations shall be tested through:

* immediate duplicate invocation;
* concurrent duplicate invocation;
* retry after timeout;
* retry after commit but before response;
* retry after process restart;
* inconsistent key reuse;
* retention expiration;
* external ambiguous completion;
* replay;
* cancellation;
* authorization change.

---

# 138. Concurrent Duplicate Testing

Tests shall verify that two simultaneous requests with the same key do not both establish the effect.

---

# 139. Crash Testing

Tests shall inject crashes:

* before key registration;
* after registration;
* before effect;
* after effect;
* before completion record;
* after completion record but before response.

---

# 140. External Timeout Testing

Tests shall simulate acknowledgement loss after remote success.

The system shall reconcile or reuse external idempotency rather than create duplicate effects.

---

# 141. Key Conflict Testing

The same key with a different Request Fingerprint shall fail explicitly.

---

# 142. Retention Testing

Tests shall verify duplicate behavior:

* within retention;
* near expiration;
* after expiration;
* after archival cleanup.

---

# 143. Authorization Testing

Tests shall verify that another Principal cannot reuse a key to access or affect the original operation improperly.

---

# 144. Provider Testing

External Providers claiming idempotency support shall be contract-tested where possible.

---

# 145. Nondeterministic Operation Testing

Tests shall verify that repeated invocation reuses the original result when the contract requires idempotent preservation.

---

# 146. Governance

Changes affecting idempotency identity, scope, retention or result semantics require architectural review when they may alter:

* duplicate effects;
* canonical identity;
* Public API behavior;
* synchronization replay;
* remote execution;
* Workflow recovery;
* external publication;
* security boundaries.

---

# 147. Idempotency Invariants

The following invariants apply.

* Idempotency preserves one Logical Operation across repeated Attempts.
* Logical Operation Identity is distinct from Attempt Identity.
* Every Idempotency Key has explicit scope.
* The same key is never reused for unrelated intent.
* Equivalent retries preserve the original key.
* Inconsistent key reuse fails explicitly.
* Idempotency enforcement is concurrency-safe.
* Read-then-write duplicate checks without atomic coordination are insufficient.
* Canonical effect and idempotency completion share an atomic boundary where possible.
* External side effects use Provider idempotency, stable identity, Outbox, Inbox or reconciliation where appropriate.
* OutcomeUnknown is represented explicitly.
* Ambiguous external completion is not retried blindly.
* Retry does not create new logical intent.
* Retry preserves semantic inputs.
* Duplicate Commands do not create duplicate canonical effects.
* Event redelivery preserves Event Identity.
* Event Handler idempotency is scoped by consumer where required.
* Job retries preserve Job Identity.
* Workflow Step retries preserve Step identity.
* Import recovery resumes the same Import Operation.
* Source Identity alone is not universally an Import Idempotency Key.
* Export publication retry does not create duplicate external artifacts where controllable.
* Change Set replay does not create duplicate synchronization effects.
* Webhook duplicates are expected.
* MCP and Plugin operations do not assume exactly-once invocation.
* OAuth refresh is coordinated as single-flight where token rotation may occur.
* Public API idempotency does not replace authorization.
* Idempotency records have bounded retention.
* Checkpoints advance only after effect and idempotency evidence are durable.
* Idempotency prevents duplicate effects but does not prove message authenticity.
* Idempotency behavior is observable and testable.

---

# 148. Prohibited Behaviors

KnowledgeOS shall never:

* generate a new Logical Operation Identity for every retry;
* use Attempt Identity as the sole duplicate identity;
* reuse one Idempotency Key for different operation semantics;
* enforce idempotency through unsafe read-then-write checks;
* assume transport delivery occurs exactly once;
* assume local IPC eliminates duplicate requests;
* retry an OutcomeUnknown external operation blindly;
* generate a new canonical identity during retry when the original identity was established;
* execute duplicate Event side effects without Handler-level idempotency;
* treat Job lease expiration as proof that no side effect occurred;
* create a second import silently during recovery;
* use source hash alone as universal import intent identity;
* create duplicate remote exports after acknowledgement loss when reconciliation is possible;
* apply the same synchronization Change Set repeatedly as new state;
* process duplicate Webhooks as independent facts;
* expose another Principal's result through shared key reuse;
* use Idempotency Keys as authorization tokens;
* retain idempotency records without bounded policy;
* delete canonical results when idempotency records expire;
* claim idempotency where repeated execution still creates unintended additional effects.

---

# 149. Related Documents

## Execution

* `../README.md`
* `ConcurrencyModel.md`
* `Determinism.md`
* `Locking.md`
* `RetryPolicies.md`
* `Transactions.md`
* `../Messaging/Commands.md`
* `../Messaging/EventProcessing.md`
* `../Messaging/Events.md`
* `../Reliability/Checkpointing.md`
* `../Reliability/Recovery.md`
* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`
* `../Runtime/Lifecycle.md`

## Kernel

* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/EventIntegration.md`
* `../../05-Integration/ExternalServices/MCP.md`
* `../../05-Integration/ExternalServices/OAuth.md`
* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/ExternalServices/Webhooks.md`
* `../../05-Integration/PublicAPI/APIConventions.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 150. Status

**Approved**

This document defines the idempotency model of KnowledgeOS.

Idempotency preserves one logical intent across repeated execution.

Logical Operation Identity remains distinct from individual Attempt Identity.

Idempotency Keys are explicit, scoped and stable across safe retries.

The same key is never reused for different intent.

Duplicate detection is concurrency-safe.

Canonical effects and idempotency completion share an atomic boundary where possible.

External side effects use stable external identity, Provider-supported idempotency, Inbox, Outbox or reconciliation.

Ambiguous completion is represented as OutcomeUnknown.

It is not retried blindly.

Commands do not create duplicate canonical effects.

Event redelivery preserves Event Identity.

Job and Workflow retries preserve their original logical identities.

Import recovery resumes the same Import Operation.

Export retry does not silently create duplicate publications.

Synchronization Change Sets remain stable across replay.

Webhooks are expected to arrive more than once.

Plugins, MCP Tools and external APIs do not assume exactly-once invocation.

OAuth refresh is coordinated to protect rotating credentials.

Idempotency does not replace authentication, authorization, transaction design or compensation.

It ensures that retries, replays, recovery and duplicate delivery preserve the original intended operation rather than multiplying its effects.
