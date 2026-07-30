
# Retry Policies

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Concurrency

**Document:** Retry Policies

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the retry model of KnowledgeOS.

Retry Policies govern whether, when and how a failed execution attempt may be repeated.

Retries may be required because of:

* temporary network failure;
* transient storage failure;
* Provider unavailability;
* rate limiting;
* Resource contention;
* optimistic concurrency conflict;
* temporary authorization infrastructure failure;
* interrupted background execution;
* lost acknowledgement;
* recoverable external service failure.

Retry is an execution mechanism.

It shall never be used as a substitute for:

* correct validation;
* conflict resolution;
* idempotency;
* transactions;
* compensation;
* recovery;
* architectural understanding of failure.

---

# 2. Scope

This document governs retry behavior across:

* Commands;
* Events;
* Queries;
* Jobs;
* Workflows;
* Import operations;
* Export operations;
* AI execution;
* OCR processing;
* Storage operations;
* synchronization;
* Webhooks;
* MCP Tool calls;
* OAuth operations;
* Provider requests;
* remote execution;
* Plugin operations;
* background processing;
* recovery workflows.

This document also governs:

* retry eligibility;
* failure classification;
* retry limits;
* backoff;
* jitter;
* deadlines;
* Retry Budgets;
* circuit breaking;
* rate-limit handling;
* idempotency interaction;
* ambiguous completion;
* cancellation;
* retry observability;
* retry exhaustion.

This document does not define:

* Domain conflict policy;
* Provider-specific error formats;
* concrete scheduler implementation;
* transaction implementation;
* compensation semantics;
* recovery checkpoints.

---

# 3. Architectural Position

Retry Policies belong to the Execution layer.

```text
Execution Attempt
      │
      ▼
Failure Classification
      │
      ▼
Retry Policy
      │
      ├── Retry
      ├── Defer
      ├── Reconcile
      └── Fail
```

The retry decision shall occur only after the failure has been classified.

---

# 4. Core Principle

The fundamental principle is:

> Retry repeats an execution attempt, not the logical intent.

A retry shall preserve:

* Logical Operation Identity;
* semantic inputs;
* authorization requirements;
* idempotency identity;
* target scope;
* operation contract.

A retry may change only operational execution details permitted by policy.

---

# 5. Mission

The mission of Retry Policies is to improve reliability without causing:

* duplicate effects;
* Retry Storms;
* hidden infinite loops;
* excessive cost;
* Resource exhaustion;
* stale intent execution;
* conflict amplification;
* external service overload;
* ambiguous state corruption.

---

# 6. Design Philosophy

Retry shall be:

* explicit;
* bounded;
* failure-aware;
* idempotency-aware;
* deadline-aware;
* observable;
* cancellable;
* cost-aware where relevant;
* compatible with Offline First operation.

---

# 7. Retry Definition

A retry is a new Execution Attempt associated with the same Logical Operation.

```text
Logical Operation
    ├── Attempt 1
    ├── Attempt 2
    └── Attempt 3
```

Each Attempt has separate operational identity.

All Attempts preserve one logical intent.

---

# 8. Retry Is Not Re-Submission

A user intentionally repeating an operation may represent new intent.

A system retry represents the same intent.

These shall not be conflated.

---

# 9. Retry Identity

Every retryable operation shall preserve:

* Logical Operation Identity;
* Idempotency Key where applicable;
* original request semantics;
* original scope;
* correlation identity.

Each retry may receive a new Attempt Identity.

---

# 10. Retry Preconditions

A retry may occur only when:

* the failure is classified as retryable;
* retry remains within policy limits;
* the operation is retry-safe;
* the operation has not expired;
* cancellation has not been requested;
* authorization remains valid where required;
* dependencies remain compatible;
* Retry Budget remains available.

---

# 11. Failure Classification

Failures shall be classified before retry.

Possible high-level categories include:

* Transient;
* Persistent;
* Permanent;
* Ambiguous;
* Conflict;
* RateLimited;
* ResourceExhausted;
* Cancelled;
* InvalidInput;
* Unauthorized;
* Incompatible;
* Unknown.

---

# 12. Transient Failure

A Transient Failure is expected to resolve without changing operation intent.

Examples include:

* temporary network interruption;
* short Provider outage;
* temporary lock contention;
* momentary storage unavailability;
* temporary DNS failure.

Transient failures may be retryable.

---

# 13. Persistent Failure

A Persistent Failure may continue for an extended period.

Examples include:

* prolonged NAS unavailability;
* Provider outage;
* external service maintenance;
* sustained quota exhaustion.

Persistent failures should usually defer rather than retry aggressively.

---

# 14. Permanent Failure

A Permanent Failure cannot be resolved by repeating the same operation unchanged.

Examples include:

* invalid input;
* unsupported operation;
* incompatible Version;
* permanently removed Resource;
* denied Capability;
* malformed contract.

Permanent failures shall not be retried.

---

# 15. Ambiguous Failure

An Ambiguous Failure occurs when KnowledgeOS cannot determine whether the effect completed.

Examples include:

* network loss after remote submission;
* timeout after external write;
* lost acknowledgement;
* process crash after possible commit.

Ambiguous failures require reconciliation or proven external idempotency.

Blind retry is prohibited.

---

# 16. Conflict Failure

A Conflict indicates that assumptions used by the operation are stale or incompatible.

Examples include:

* Version mismatch;
* conditional write failure;
* stale synchronization Baseline;
* concurrent canonical change.

Conflict is not automatically a transient failure.

---

# 17. Rate-Limited Failure

A Rate-Limited Failure indicates the target is refusing work because a usage threshold was exceeded.

Retry shall follow the target's rate-limit guidance where trustworthy.

---

# 18. Resource Exhaustion

Resource Exhaustion may include:

* memory pressure;
* disk capacity exhaustion;
* thread pool saturation;
* Provider quota exhaustion;
* concurrency slot exhaustion.

Retry is valid only if Resource availability is likely to improve.

---

# 19. Cancelled Operation

Cancellation is not a retryable failure by default.

A new execution after cancellation requires explicit policy or renewed intent.

---

# 20. Invalid Input

Invalid input shall not be retried unchanged.

The input or contract must change.

---

# 21. Unauthorized Operation

Authorization failure shall not be retried blindly.

Possible next actions include:

* credential refresh;
* reauthorization;
* user intervention;
* terminal failure.

---

# 22. Incompatible Operation

An incompatible protocol, schema or Version shall not be retried without compatibility change.

---

# 23. Unknown Failure

An Unknown Failure shall be treated conservatively.

The system shall not assume retry safety without sufficient classification.

---

# 24. Retryability Matrix

Every operation class should define retryability by failure category.

Example:

| Failure Category          | Typical Policy             |
| ------------------------- | -------------------------- |
| Transient network failure | Retry                      |
| Rate limiting             | Retry after delay          |
| Invalid input             | Do not retry               |
| Authorization denied      | Do not retry automatically |
| Version conflict          | Re-evaluate                |
| Outcome unknown           | Reconcile                  |
| Cancellation              | Stop                       |
| Incompatible Version      | Fail                       |
| Resource exhaustion       | Defer or retry selectively |

---

# 25. Retry Policy

A Retry Policy defines:

* eligible failure categories;
* maximum Attempts;
* maximum elapsed time;
* backoff strategy;
* jitter strategy;
* deadline;
* Retry Budget;
* idempotency requirements;
* terminal behavior;
* observability requirements.

---

# 26. Maximum Attempts

Every Retry Policy shall define a maximum Attempt count.

Unbounded retry is prohibited.

---

# 27. Maximum Elapsed Time

A Retry Policy may define a maximum total elapsed duration.

This prevents long retry sequences from continuing beyond useful time.

---

# 28. Deadline

A deadline defines when the result is no longer useful.

Retry shall stop when the deadline expires.

---

# 29. Timeout Versus Retry

A timeout limits one Attempt.

Retry determines whether another Attempt may occur.

These are distinct concepts.

---

# 30. Backoff

Backoff delays subsequent retry Attempts.

Backoff reduces:

* repeated contention;
* Provider overload;
* synchronized client retry;
* Resource pressure.

---

# 31. Fixed Backoff

Fixed Backoff uses the same delay between Attempts.

It is appropriate only for simple bounded scenarios.

---

# 32. Linear Backoff

Linear Backoff increases delay by a fixed amount.

It may be appropriate for moderate contention.

---

# 33. Exponential Backoff

Exponential Backoff increases delay multiplicatively.

Conceptually:

```text
Attempt 1 → short delay
Attempt 2 → longer delay
Attempt 3 → substantially longer delay
```

It is preferred for many remote transient failures.

---

# 34. Maximum Backoff

Exponential Backoff shall have a maximum delay.

Unlimited backoff growth is unnecessary and may obscure terminal failure.

---

# 35. Jitter

Jitter introduces controlled randomness into retry delays.

It reduces synchronized Retry Storms across many clients or workers.

---

# 36. Jitter Strategies

Possible strategies include:

* Full Jitter;
* Equal Jitter;
* Decorrelated Jitter;
* bounded randomized delay.

The chosen strategy shall be consistent for the operation class.

---

# 37. Deterministic Testing of Jitter

Retry jitter shall be testable through injectable random sources or controlled seeds.

---

# 38. Server Retry Guidance

External services may provide retry guidance such as:

* retry-after duration;
* next allowed time;
* rate-limit reset.

Such guidance may be used when:

* the source is trusted;
* the value is valid;
* it remains within local policy limits.

---

# 39. Malicious Retry Guidance

External retry values shall be bounded.

KnowledgeOS shall not accept arbitrary extreme delay or negative timing values without validation.

---

# 40. Retry Budget

A Retry Budget limits retry activity across a broader scope.

A budget may apply per:

* operation;
* Provider;
* Endpoint;
* Plugin;
* Workflow;
* Library;
* time window.

---

# 41. Purpose of Retry Budget

Retry Budgets prevent repeated failures from consuming unlimited:

* CPU;
* memory;
* network;
* battery;
* external quota;
* money;
* queue capacity.

---

# 42. Budget Exhaustion

When a Retry Budget is exhausted, the operation shall:

* fail;
* defer;
* enter degraded state;
* require intervention;

according to policy.

---

# 43. Retry Storm

A Retry Storm occurs when many failing operations retry simultaneously.

Retry Storms may amplify outages.

---

# 44. Retry Storm Prevention

KnowledgeOS shall use:

* backoff;
* jitter;
* Retry Budgets;
* circuit breakers;
* bounded queues;
* concurrency limits;
* failure aggregation.

---

# 45. Circuit Breaker Relationship

A Circuit Breaker prevents repeated calls to a dependency known to be failing.

Retry and circuit breaking are complementary.

```text
Retry
    └── handles isolated transient failure

Circuit Breaker
    └── protects against sustained dependency failure
```

---

# 46. Circuit States

A Circuit Breaker may use:

* Closed;
* Open;
* HalfOpen.

---

# 47. Closed Circuit

Requests are permitted.

Failures are monitored.

---

# 48. Open Circuit

New requests fail or defer without invoking the dependency.

This protects both KnowledgeOS and the external system.

---

# 49. Half-Open Circuit

A limited number of test operations are permitted to determine whether recovery occurred.

---

# 50. Circuit Scope

Circuit Breakers shall have explicit scope.

Possible scopes include:

* Provider;
* Provider Connection;
* Endpoint;
* operation type;
* remote service;
* Storage Location.

---

# 51. Circuit Breaker Does Not Delete Work

Opening a circuit shall not silently discard pending important work.

Pending operations remain governed by retention and deferral policies.

---

# 52. Idempotency Requirement

Retryable state-changing operations shall define idempotency semantics.

Retry without idempotency is prohibited when duplicate effects are possible.

---

# 53. Safe Read Retry

Read operations are often retryable when:

* no authoritative side effect occurs;
* the data may be re-read safely;
* the operation remains within deadline.

---

# 54. Safe Write Retry

Write retry is safe only when:

* the write is idempotent;
* the write uses stable identity;
* the destination supports conditional semantics;
* the previous outcome is known not to have committed;
* reconciliation confirms the correct state.

---

# 55. Ambiguous Write Retry

An ambiguous write shall not be retried unless:

* the destination supports the same Idempotency Key;
* current target state is reconciled;
* duplicate effect is harmless by contract.

---

# 56. Retry and Transactions

If an internal transaction rolls back completely before external effect, the operation may be retried according to policy.

If an external effect occurred, transaction rollback alone does not establish retry safety.

---

# 57. Retry and Locking

Lock acquisition failure may be retryable.

Retry shall use:

* bounded wait;
* backoff;
* fairness;
* contention limits.

Busy retry loops are prohibited.

---

# 58. Retry and Optimistic Concurrency

An optimistic conflict may be retried when:

* the operation can re-read current state;
* intent remains valid;
* transformation is deterministic;
* retry count is bounded.

---

# 59. User Edit Conflict

User-authored edit conflicts shall not be retried blindly.

The system may require:

* re-anchoring;
* merge;
* conflict presentation;
* renewed user decision.

---

# 60. Retry and Determinism

A retry shall preserve semantic inputs.

It may not silently change:

* identity;
* source Version;
* algorithm Version;
* random seed;
* effective timestamp;
* destination;
* user intent.

---

# 61. Retry and Recovery

Retry repeats an Attempt.

Recovery resumes or reconstructs interrupted execution.

These mechanisms shall remain distinct.

---

# 62. Retry and Checkpointing

A retryable stage may resume from the latest durable Checkpoint instead of restarting the entire operation.

The stage contract shall define whether it is:

* restartable;
* resumable;
* replayable;
* non-repeatable.

---

# 63. Retry and Cancellation

Cancellation shall stop future retry Attempts.

Already-running external work may remain unresolved.

---

# 64. Cancellation During Backoff

An operation waiting in backoff shall be cancellable.

---

# 65. Retry and Priority

Retry Attempts shall not automatically inherit unlimited priority.

Repeated failures should generally reduce urgency unless user-facing semantics require otherwise.

---

# 66. Priority Degradation

Background retries may be deprioritized after repeated failure.

Interactive user action may still trigger explicit renewed execution.

---

# 67. Retry and Cost

Retries may incur:

* Provider charges;
* AI token usage;
* remote compute cost;
* network transfer;
* energy consumption.

Cost-sensitive retries shall respect configured limits.

---

# 68. Retry and Privacy

Retry shall not repeatedly transmit sensitive data beyond what the original operation authorized.

Authorization and consent may require revalidation for delayed retries.

---

# 69. Retry and Offline First

When offline, remote retry should usually defer until connectivity returns rather than fail repeatedly.

---

# 70. Connectivity-Aware Retry

Connectivity state may suspend retry scheduling.

Connectivity restoration shall not trigger uncontrolled simultaneous retry.

---

# 71. Reconnection Retry

After reconnection, pending work shall be:

* revalidated;
* scheduled with jitter;
* bounded by concurrency;
* checked for expiration;
* checked for current authorization.

---

# 72. No Blind Offline Replay

An operation queued while offline shall not execute later without revalidating:

* user intent;
* target identity;
* Version assumptions;
* authorization;
* deadline;
* privacy policy.

---

# 73. Command Retry

A Command may be retried only when:

* Command Identity remains stable;
* Handler semantics are retry-safe;
* idempotency is enforced;
* current Domain preconditions remain valid.

---

# 74. Command Rejection

Domain rejection is not a transient execution failure.

It shall not be retried unchanged.

---

# 75. Query Retry

Queries may retry transient read failures.

The Query contract shall define whether a changed external or canonical state is acceptable between Attempts.

---

# 76. Event Handler Retry

Event Handler retry shall preserve:

* Event Identity;
* Handler Identity;
* correlation;
* ordering constraints.

---

# 77. Event Poisoning

Repeatedly failing Event processing shall transition to terminal handling rather than retry indefinitely.

Possible terminal handling includes:

* dead-letter state;
* quarantine;
* intervention;
* skip according to policy.

---

# 78. Job Retry

Jobs shall define:

* maximum Attempts;
* Retry Policy;
* idempotency;
* terminal state;
* retry delay;
* recovery behavior.

---

# 79. Job Attempt History

Each Job Attempt shall preserve:

* Attempt Identity;
* start time;
* end time;
* failure category;
* delay before next Attempt.

---

# 80. Workflow Step Retry

Each retryable Workflow Step shall define:

* retry eligibility;
* maximum Attempts;
* compensation interaction;
* checkpoint interaction;
* sibling cancellation policy.

---

# 81. Workflow Retry Scope

Retry may apply to:

* one Step;
* one branch;
* one subworkflow;
* entire Workflow.

The scope shall be explicit.

---

# 82. Import Retry

Import stages may retry transient failures.

Examples include:

* temporary source read failure;
* OCR Provider unavailability;
* temporary storage failure.

---

# 83. Import Source Stability

Retry shall verify that the Import source remains the same logical source Version.

A changed source may require a new operation or pipeline decision.

---

# 84. Import Commit Retry

Canonical commit retry shall use stable Import Operation Identity and Version checks.

It shall not create duplicate Knowledge Objects.

---

# 85. OCR Retry

OCR retry shall preserve:

* source page identity;
* processing parameters;
* Provider selection policy;
* operation identity.

Changing Provider may produce different output and shall be explicit.

---

# 86. AI Retry

AI retry may produce a different result.

Therefore, automatic AI retry requires an explicit policy.

---

# 87. AI Retry Classification

AI retry may be classified as:

* Transport Retry — same logical inference request after transport failure;
* Provider Retry — same Provider after transient failure;
* Provider Fallback — different Provider or model;
* Intentional Regeneration — new Logical Operation.

These are distinct.

---

# 88. AI Fallback

Changing model or Provider is not an ordinary retry.

It is an execution-plan change and shall preserve provenance.

---

# 89. Export Retry

Export retry shall distinguish:

* artifact generation retry;
* external publication retry;
* finalization retry.

Each stage may have different safety properties.

---

# 90. Export Generation Retry

Deterministic artifact generation may retry using the same source snapshot and Export Profile.

---

# 91. Export Publication Retry

Publication may create duplicate external artifacts.

Stable destination identity, Provider idempotency or reconciliation is required.

---

# 92. Storage Retry

Storage retry shall account for:

* operation type;
* Provider guarantees;
* ambiguous write completion;
* consistency;
* conditional Version.

---

# 93. Storage Read Retry

Temporary read failures may retry with bounded backoff.

---

# 94. Storage Write Retry

Write retry shall not occur blindly after timeout.

KnowledgeOS shall reconcile:

* target existence;
* content hash;
* Version;
* generation;
* operation identity.

---

# 95. Storage Move Retry

Move operations require state inspection because retry may encounter:

* source present;
* destination present;
* both present;
* neither present.

---

# 96. Synchronization Retry

Synchronization retries shall preserve:

* Session or operation identity where applicable;
* Change Set Identity;
* Peer Identity;
* Baseline;
* Checkpoint.

---

# 97. Change Set Retry

The same Change Set shall be resent with the same identity.

It shall not be regenerated as a new logical change merely because acknowledgement was lost.

---

# 98. Synchronization Baseline Revalidation

Retry after significant delay shall verify the Baseline remains valid.

---

# 99. Webhook Retry

Inbound Webhook processing may retry after durable receipt.

Outbound Webhook delivery may retry according to destination policy.

---

# 100. Outbound Webhook Retry

Outbound retries shall preserve stable Event or Delivery Identity.

---

# 101. Webhook Terminal Failure

After Retry Policy exhaustion, delivery may enter:

* Failed;
* DeadLettered;
* Disabled destination;
* manual intervention.

---

# 102. OAuth Retry

OAuth operations require operation-specific policies.

Authorization denial shall not retry.

Temporary token endpoint failure may retry.

---

# 103. Token Refresh Retry

Refresh retry shall use coordinated single-flight execution.

Providers using rotating Refresh Tokens require strict stale-result protection.

---

# 104. OAuth Reauthorization

Reauthorization is not a retry of token refresh.

It is a new user authorization operation.

---

# 105. MCP Retry

Read-only MCP Tool invocations may often retry safely.

State-changing Tools require declared idempotency.

---

# 106. MCP Timeout

A state-changing MCP Tool timeout may produce OutcomeUnknown.

Blind retry is prohibited.

---

# 107. Remote Execution Retry

Remote execution submission retry requires:

* stable Operation Identity;
* Provider idempotency;
* or reconciliation.

---

# 108. Remote Execution Fallback

Changing Execution Target is not necessarily an equivalent retry.

It may alter:

* output;
* cost;
* privacy;
* performance;
* provenance.

Fallback shall be explicit.

---

# 109. Provider Retry

Provider contracts shall define:

* retryable errors;
* retry-after support;
* idempotency capabilities;
* rate-limit behavior;
* timeout semantics.

---

# 110. Provider Error Translation

Vendor errors shall be translated before Retry Policy evaluation.

---

# 111. Plugin Retry

Plugin operations shall not assume exact-once execution.

Retryable Plugin operations shall declare:

* idempotency;
* side effects;
* Retry Policy;
* failure isolation.

---

# 112. Plugin Crash Retry

A Plugin crash does not prove its external side effects did not occur.

Reconciliation may be required.

---

# 113. Retry Scheduling

Retry scheduling shall use the Kernel Scheduler or appropriate Job infrastructure.

Components shall not implement hidden independent retry loops.

---

# 114. Central Policy

Retry policy definitions should be centrally governed even when execution is distributed across components.

---

# 115. Policy Profiles

KnowledgeOS may define reusable Retry Policy Profiles.

Examples include:

* InteractiveRead;
* BackgroundRead;
* ProviderTransient;
* StorageTransient;
* RateLimitedExternal;
* DurableJob;
* NoRetry;
* ReconciliationRequired.

---

# 116. Policy Override

An operation may override a default profile only when its contract requires different semantics.

---

# 117. Interactive Retry

Interactive operations should avoid long invisible retry sequences.

The user should receive timely state such as:

* retrying;
* waiting;
* offline;
* unavailable;
* intervention required.

---

# 118. Background Retry

Background operations may tolerate longer retry windows.

They shall remain bounded and observable.

---

# 119. Maintenance Retry

Maintenance work may use low-priority long-delay retry.

It shall not compete aggressively with interactive work.

---

# 120. Retry Exhaustion

Retry Exhaustion occurs when policy limits are reached.

The final state shall be explicit.

Possible outcomes include:

* Failed;
* Deferred;
* DeadLettered;
* RecoveryRequired;
* ReauthorizationRequired;
* UserActionRequired.

---

# 121. Terminal Failure

Terminal failure shall preserve:

* Logical Operation Identity;
* Attempt history;
* final failure category;
* recovery options;
* user-visible status where appropriate.

---

# 122. Manual Retry

Manual retry may represent:

* continuation of the same Logical Operation;
* or new user intent.

The operation contract shall define which.

---

# 123. Retry Reset

Resetting Retry Policy state is a privileged operational action when it bypasses exhausted safeguards.

---

# 124. Retry Retention

Attempt history shall have bounded retention.

Retention shall support:

* diagnostics;
* recovery;
* audit where required;
* policy evaluation.

---

# 125. Attempt Data

Attempt records may contain:

* Attempt Identity;
* operation identity;
* start and end time;
* failure category;
* delay;
* target;
* result state.

Sensitive payloads shall not be retained unnecessarily.

---

# 126. Observability

Retry behavior shall be observable.

Observable metadata may include:

* Logical Operation Identity;
* Attempt number;
* Retry Policy;
* failure category;
* next scheduled time;
* backoff duration;
* Retry Budget state;
* terminal outcome.

---

# 127. Logging

Retry logs should record:

* why retry was selected;
* why retry was denied;
* next Attempt timing;
* policy exhaustion;
* OutcomeUnknown;
* reconciliation requirement.

---

# 128. Metrics

Retry metrics may include:

* operations retried;
* Attempts per operation;
* retries by failure category;
* successful recovery after retry;
* Retry Exhaustion;
* backoff duration;
* Retry Budget exhaustion;
* circuit-open events;
* repeated conflict count.

---

# 129. Tracing

Each retry Attempt shall appear as a distinct span linked to one Logical Operation.

```text
Logical Operation
    ├── Attempt 1 — failed
    ├── Backoff
    ├── Attempt 2 — failed
    ├── Backoff
    └── Attempt 3 — completed
```

---

# 130. Audit

Security-sensitive retry may require audit when repeated execution affects:

* external publication;
* destructive actions;
* high-cost operations;
* sensitive data egress;
* authorization recovery.

---

# 131. Testing Requirements

Retry-sensitive operations shall be tested through:

* transient failure;
* permanent failure;
* ambiguous completion;
* rate limiting;
* cancellation;
* deadline expiration;
* Retry Budget exhaustion;
* circuit breaking;
* process restart;
* changed authorization;
* changed Version;
* network reconnection.

---

# 132. Backoff Testing

Tests shall verify:

* delay progression;
* maximum delay;
* jitter bounds;
* cancellation during backoff;
* deadline interaction.

---

# 133. Attempt Limit Testing

Tests shall verify exact maximum Attempt behavior.

Off-by-one retry errors are prohibited.

---

# 134. Ambiguous Completion Testing

Tests shall simulate lost acknowledgement after successful external effect.

The system shall reconcile or use idempotency.

---

# 135. Retry Storm Testing

Tests shall simulate many simultaneous failures to verify:

* jitter;
* budgets;
* circuit breaking;
* bounded concurrency;
* queue stability.

---

# 136. Authorization Testing

Tests shall verify retry stops or transitions when authorization expires or is revoked.

---

# 137. Offline Testing

Tests shall verify remote retries defer while offline and resume in a controlled manner after reconnection.

---

# 138. Provider Testing

Provider Retry Policies shall be tested against:

* documented transient errors;
* rate-limit responses;
* timeout behavior;
* idempotency support;
* permanent errors.

---

# 139. Governance

Changes affecting Retry Policies require architectural review when they may alter:

* duplicate-effect risk;
* external cost;
* user experience;
* Provider load;
* conflict behavior;
* synchronization safety;
* authorization behavior;
* Retry Budgets;
* terminal failure semantics.

---

# 140. Retry Policy Invariants

The following invariants apply.

* Retry repeats an Attempt, not logical intent.
* Logical Operation Identity remains stable across retry.
* Each retry receives distinct Attempt Identity.
* Failure is classified before retry.
* Permanent failures are not retried unchanged.
* Invalid input is not retried unchanged.
* Authorization denial is not retried blindly.
* Ambiguous completion is reconciled or protected by idempotency.
* Retry is bounded by Attempts, time, deadline or budget.
* Backoff is used where immediate retry would amplify failure.
* Jitter is used where synchronized retry is possible.
* Retry Budgets protect shared Resources.
* Circuit Breakers protect against sustained dependency failure.
* State-changing retry requires idempotency.
* Retry preserves semantic inputs.
* Changing Provider, model or target is not always an equivalent retry.
* Cancellation stops future retry.
* Offline remote work defers instead of retrying continuously.
* Reconnection revalidates assumptions before retry.
* Retry scheduling uses governed execution infrastructure.
* Retry Exhaustion produces explicit terminal state.
* Retry behavior is observable and testable.

---

# 141. Prohibited Behaviors

KnowledgeOS shall never:

* retry indefinitely;
* retry without failure classification;
* retry invalid input unchanged;
* retry authorization denial indefinitely;
* retry incompatible Versions;
* retry ambiguous external writes blindly;
* generate new Logical Operation Identity for each retry;
* change semantic inputs silently between Attempts;
* treat Provider fallback as an invisible retry;
* retry AI generation while pretending the result is the same deterministic operation;
* retry while cancellation is active;
* retry after deadline expiration;
* ignore Retry Budgets;
* use zero-delay busy retry loops;
* create Retry Storms through synchronized immediate retry;
* let each component implement hidden ungoverned retry loops;
* assume transaction rollback proves external side effects did not occur;
* assume timeout proves failure;
* replay offline work without revalidating authorization and Version assumptions;
* hide Retry Exhaustion from users or operators where action is required.

---

# 142. Related Documents

## Execution

* `../README.md`
* `ConcurrencyModel.md`
* `Determinism.md`
* `Idempotency.md`
* `Locking.md`
* `Transactions.md`
* `../Messaging/Commands.md`
* `../Messaging/EventProcessing.md`
* `../Reliability/Checkpointing.md`
* `../Reliability/ErrorHandling.md`
* `../Reliability/Recovery.md`
* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/Scheduling.md`

## Kernel

* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/AI/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/MCP.md`
* `../../05-Integration/ExternalServices/OAuth.md`
* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/ExternalServices/Webhooks.md`
* `../../05-Integration/Providers/ProviderModel.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 143. Status

**Approved**

This document defines the retry model of KnowledgeOS.

Retry repeats execution Attempts while preserving one Logical Operation.

Failure is classified before another Attempt is scheduled.

Transient failures may retry.

Permanent failures do not retry unchanged.

Ambiguous completion requires reconciliation or proven idempotency.

Retry is bounded by Attempt count, elapsed time, deadlines and Retry Budgets.

Backoff and jitter prevent contention amplification and Retry Storms.

Circuit Breakers protect KnowledgeOS and external dependencies during sustained failure.

State-changing retries require explicit idempotency.

Semantic inputs, identity, scope and authorization requirements remain stable across retry.

Provider, model or target fallback is treated as an explicit execution-plan change when it may alter output, cost, privacy or provenance.

Offline remote work defers rather than retrying continuously.

Reconnection revalidates state before execution resumes.

Retry scheduling uses governed Kernel execution infrastructure.

Retry Exhaustion produces an explicit terminal or deferred state.

KnowledgeOS therefore uses retry as a bounded reliability mechanism, never as an uncontrolled substitute for idempotency, conflict resolution, recovery, compensation or correct failure handling.
