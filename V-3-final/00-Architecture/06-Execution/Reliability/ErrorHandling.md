
# Error Handling

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Reliability

**Document:** Error Handling

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Error Handling model of KnowledgeOS.

Error Handling governs how failures are:

* detected;
* classified;
* represented;
* propagated;
* translated;
* isolated;
* observed;
* retried;
* compensated;
* recovered;
* presented to users.

KnowledgeOS executes across:

* Domain;
* Kernel;
* Platform Engines;
* Integration adapters;
* Providers;
* Plugins;
* local storage;
* NAS-backed storage;
* background Jobs;
* Workflows;
* synchronization;
* local and remote AI;
* Public APIs;
* Local APIs.

Failures may therefore occur at multiple layers and may have different meanings depending on:

* where they originate;
* whether canonical state changed;
* whether external side effects occurred;
* whether the outcome is known;
* whether retry is safe;
* whether recovery is required.

The Error Handling model ensures that failures remain explicit and semantically stable rather than becoming raw exceptions, generic messages or silent data corruption.

---

# 2. Scope

This document governs errors across:

* Commands;
* Queries;
* Events;
* Event Consumers;
* Jobs;
* Workflows;
* Scheduler;
* background execution;
* Transactions;
* Locks;
* retries;
* checkpointing;
* recovery;
* caching;
* memory;
* parallel execution;
* Import;
* Export;
* OCR;
* AI;
* Annotation;
* Knowledge;
* Library;
* Plugin;
* Render;
* Search;
* Sync;
* Providers;
* Storage;
* NAS;
* Public API;
* Local API;
* external services;
* remote execution.

This document also governs:

* failure categories;
* error identity;
* error codes;
* error propagation;
* boundary translation;
* partial success;
* partial effect;
* retryability;
* cancellation;
* timeout;
* unknown outcome;
* compensation;
* rollback;
* fault isolation;
* user-facing errors;
* diagnostic evidence;
* error testing.

This document does not define:

* programming-language exception syntax;
* exact API response schemas;
* concrete retry delays;
* concrete recovery algorithms;
* specific logging implementations;
* specific persistence error classes.

---

# 3. Architectural Position

Error Handling is a cross-cutting Reliability capability.

```text
Execution
   │
   ▼
Failure Detection
   │
   ▼
Failure Classification
   │
   ▼
Boundary Translation
   │
   ├── Retry
   ├── Rollback
   ├── Compensation
   ├── Recovery
   ├── Degradation
   └── Terminal Failure
```

Error Handling defines what a failure means and what the system should do next.

Observability records evidence about that process.

---

# 4. Core Principle

The fundamental principle is:

> An error is a classified execution outcome, not merely an exception.

The complementary principle is:

> Every failure must preserve meaning across layers, distinguish recoverable from terminal conditions, expose partial effects and never hide an unknown outcome behind a generic failure.

---

# 5. Mission

The mission of Error Handling is to ensure that failures remain:

* explicit;
* classified;
* bounded;
* attributable;
* recoverable where possible;
* isolated;
* observable;
* safe for users;
* stable across architectural boundaries.

---

# 6. Design Philosophy

Error Handling shall be:

* semantic;
* structured;
* layer-aware;
* retry-aware;
* transaction-aware;
* recovery-aware;
* privacy-preserving;
* user-actionable where relevant;
* independent from raw implementation exceptions.

---

# 7. Error Definition

An Error is a structured representation of an unsuccessful, rejected, degraded or uncertain execution outcome.

An Error shall convey:

* what category of failure occurred;
* where it occurred;
* whether the operation may be retried;
* whether any effect occurred;
* whether the result is partial;
* whether recovery is required;
* whether user action is required.

---

# 8. Error Versus Exception

An Exception is an implementation mechanism.

An Error is an architectural outcome.

A raw Exception may be translated into one or more stable Error categories.

---

# 9. Error Versus Rejection

A Rejection is an expected refusal to perform an operation.

Examples include:

* invalid Domain transition;
* insufficient authorization;
* stale Version;
* unsupported Capability;
* invalid input.

A Rejection is not necessarily a system defect.

---

# 10. Error Versus Failure

Failure is the actual unsuccessful execution condition.

Error is the structured representation of that condition.

---

# 11. Error Versus Cancellation

Cancellation means execution stopped according to a cancellation request or policy.

Cancellation is not automatically a failure.

---

# 12. Error Versus Timeout

Timeout means the operation exceeded a deadline or Attempt limit.

Timeout does not necessarily prove:

* no effect occurred;
* rollback occurred;
* remote execution stopped.

---

# 13. Error Versus Unknown Outcome

UnknownOutcome means KnowledgeOS cannot currently prove whether the intended effect occurred.

It is distinct from ordinary failure.

---

# 14. Error Taxonomy

KnowledgeOS defines the following high-level categories:

1. Validation;
2. Authorization;
3. Authentication;
4. NotFound;
5. Conflict;
6. Unsupported;
7. Incompatible;
8. Timeout;
9. Cancellation;
10. ResourceExhaustion;
11. DependencyUnavailable;
12. RateLimited;
13. ProviderFailure;
14. StorageFailure;
15. Corruption;
16. InvariantViolation;
17. PartialFailure;
18. UnknownOutcome;
19. RecoveryRequired;
20. InternalFailure.

---

# 15. Validation Error

A Validation Error indicates the request or data does not satisfy required structural or semantic rules.

Examples include:

* malformed Command;
* invalid Query parameter;
* unsupported field value;
* invalid Plugin manifest;
* invalid Provider configuration.

---

# 16. Authorization Error

An Authorization Error indicates the Principal lacks permission for the requested action.

---

# 17. Authentication Error

An Authentication Error indicates identity could not be established or credentials are invalid.

Authentication and authorization remain distinct.

---

# 18. NotFound Error

NotFound indicates the requested Resource is unavailable or inaccessible according to the current scope.

It shall not leak unauthorized Resource existence.

---

# 19. Conflict Error

A Conflict indicates that the requested operation cannot proceed because current state differs from required assumptions.

Examples include:

* stale Version;
* concurrent modification;
* synchronization conflict;
* duplicate identity;
* incompatible lifecycle state.

---

# 20. Unsupported Error

Unsupported indicates the requested capability or operation is not implemented or permitted in the current context.

---

# 21. Incompatible Error

Incompatible indicates Version, schema, protocol or capability mismatch.

---

# 22. Timeout Error

Timeout indicates an operation or Attempt exceeded its allowed duration.

The Error shall identify whether the outcome is:

* known failed;
* cancelled;
* still running;
* unknown.

---

# 23. Cancellation Outcome

Cancellation shall classify the cause where relevant:

* user;
* parent;
* deadline;
* superseded;
* shutdown;
* Resource pressure.

---

# 24. Resource Exhaustion

ResourceExhaustion indicates insufficient:

* memory;
* storage;
* CPU capacity;
* GPU capacity;
* queue capacity;
* connection capacity;
* Provider quota;
* file handles.

---

# 25. Dependency Unavailable

DependencyUnavailable indicates a required dependency cannot currently serve the operation.

Examples include:

* NAS unavailable;
* database unavailable;
* local model unavailable;
* Event Bus unavailable;
* Plugin Runtime unavailable.

---

# 26. Rate Limited

RateLimited indicates execution was refused or delayed because a configured or external rate limit was exceeded.

---

# 27. Provider Failure

ProviderFailure represents a failure originating from an external or pluggable Provider.

Raw Provider errors shall be translated into stable categories.

---

# 28. Storage Failure

StorageFailure represents unsuccessful persistence or retrieval.

Possible causes include:

* unavailable storage;
* permission failure;
* capacity exhaustion;
* integrity failure;
* network failure;
* unsupported operation.

---

# 29. Corruption

Corruption indicates stored, cached, transferred or serialized data failed integrity or consistency validation.

---

# 30. Invariant Violation

InvariantViolation indicates that internal architectural or Domain assumptions were violated.

This is generally a high-severity defect.

---

# 31. Partial Failure

PartialFailure means some independent portions completed while others did not.

The completed and failed scopes shall be explicit.

---

# 32. Unknown Outcome

UnknownOutcome indicates the system cannot prove whether an effect committed or completed.

This commonly occurs after:

* connection loss;
* process crash;
* external timeout;
* lost acknowledgement;
* interrupted transaction boundary.

---

# 33. Recovery Required

RecoveryRequired indicates normal retry is insufficient and governed recovery must execute.

---

# 34. Internal Failure

InternalFailure represents an unexpected system defect not safely classified into a more specific category.

InternalFailure shall not become the default for all errors.

---

# 35. Error Identity

Significant durable or externally correlated errors may have Error Identity.

Error Identity supports:

* diagnosis;
* user support reference;
* recovery correlation;
* trace linkage.

---

# 36. Error Code

Stable Error Codes may be used where consumers require machine-readable classification.

---

# 37. Error Code Stability

An Error Code shall not change meaning silently.

---

# 38. Error Message

An Error Message provides human-readable context.

It shall not be the sole machine-readable representation.

---

# 39. Error Details

Structured Error Details may include:

* category;
* code;
* operation identity;
* component;
* stage;
* retryability;
* partial-effect status;
* recovery requirement;
* user-action requirement.

---

# 40. Error Cause

Errors may preserve one or more causal errors internally.

Cause chains shall remain bounded.

---

# 41. Cause Chain

Cause chains shall not expose raw implementation details across architectural boundaries.

---

# 42. Error Propagation

Errors shall propagate according to architectural ownership.

A lower-level error shall not escape upward unchanged when its meaning is implementation-specific.

---

# 43. Boundary Translation

Each architectural boundary shall translate errors into its own stable contract.

Examples include:

* storage exception to StorageFailure;
* Provider HTTP error to ProviderFailure;
* Domain rejection to Conflict or Validation;
* Plugin crash to PluginExecutionFailure.

---

# 44. Translation Principle

Error translation shall preserve:

* semantic cause;
* retryability;
* partial effect;
* unknown outcome;
* diagnostic linkage.

---

# 45. Translation Loss

A boundary shall not collapse materially different errors into one generic failure when downstream behavior depends on the distinction.

---

# 46. Raw Exception Leakage

Raw implementation exceptions shall not cross:

* Public API;
* Plugin API;
* Domain boundary;
* Platform boundary;
* user-facing UI.

---

# 47. Layer Ownership

Each layer owns the interpretation of errors originating within its responsibility.

---

# 48. Domain Errors

Domain Errors represent expected violations of Domain rules.

Examples include:

* invalid lifecycle transition;
* conflicting identity;
* invalid relationship;
* invalid annotation state.

---

# 49. Kernel Errors

Kernel Errors may represent:

* dispatch failure;
* missing Handler;
* scheduler failure;
* Job ownership failure;
* dependency injection failure.

---

# 50. Platform Errors

Platform Errors represent capability-specific failures.

Examples include:

* Import validation failure;
* Render failure;
* Search index unavailable;
* Library commit failure;
* Plugin lifecycle failure.

---

# 51. Integration Errors

Integration Errors represent boundary failures involving:

* Providers;
* external services;
* Public APIs;
* Storage;
* synchronization transport;
* Webhooks;
* OAuth;
* MCP.

---

# 52. Execution Errors

Execution Errors represent runtime behavior such as:

* timeout;
* cancellation;
* retry exhaustion;
* Resource exhaustion;
* concurrency conflict;
* checkpoint failure.

---

# 53. Error Result

Operations should return or expose structured outcomes appropriate to their contract.

Possible outcomes include:

* Success;
* Rejected;
* Failed;
* Partial;
* Cancelled;
* Deferred;
* UnknownOutcome;
* RecoveryRequired.

---

# 54. Error and Command Result

Command failures shall preserve whether:

* validation failed;
* authorization failed;
* conflict occurred;
* transaction failed;
* external effect is unknown;
* recovery is required.

---

# 55. Error and Query Result

Query failures shall distinguish:

* invalid Query;
* unauthorized access;
* source unavailable;
* stale-only data;
* partial Result;
* timeout;
* cancellation.

---

# 56. Error and Event Processing

Event Consumer failure shall not invalidate the already committed Event fact.

The Consumer shall enter:

* retry;
* dead-letter;
* quarantine;
* recovery;

according to policy.

---

# 57. Error and Job Result

Job failure shall preserve:

* Attempt;
* retry eligibility;
* checkpoint;
* partial progress;
* terminal state.

---

# 58. Error and Workflow Result

Workflow failure shall identify:

* failed Step;
* completed Steps;
* compensations;
* recoverable state;
* blocked dependencies.

---

# 59. Recoverable Error

A Recoverable Error may be resolved through:

* retry;
* fallback;
* reauthentication;
* Resource release;
* reconciliation;
* checkpoint restoration;
* user correction.

---

# 60. Terminal Error

A Terminal Error cannot be resolved by repeating the same operation unchanged.

Examples include:

* invalid input;
* permanent authorization denial;
* unsupported Version;
* violated invariant;
* irrecoverable corruption.

---

# 61. Retryable Error

Retryable means a new execution Attempt may succeed without changing logical intent.

Retryability shall be explicit.

---

# 62. Non-Retryable Error

NonRetryable means retrying unchanged is unsafe or pointless.

---

# 63. Retryability Is Contextual

The same low-level failure may be retryable in one operation and terminal in another.

---

# 64. Retry Policy Integration

Retry decisions shall follow `../Concurrency/RetryPolicies.md`.

---

# 65. Retry Exhaustion

When retry is exhausted, the Error shall transition to a terminal or deferred state.

---

# 66. Retry Does Not Hide Failure

Retries shall not erase the evidence of prior failed Attempts.

---

# 67. Fallback

Fallback selects an alternate execution path.

Examples include:

* local Provider after remote failure;
* cached data after Source unavailability;
* secondary Storage adapter;
* simpler Render path.

---

# 68. Fallback Semantics

Fallback shall be allowed only when:

* semantics remain compatible;
* privacy permits it;
* cost permits it;
* quality degradation is explicit where relevant.

---

# 69. Silent Fallback

A fallback that materially changes output, privacy, cost or durability shall not occur silently.

---

# 70. Degradation

Graceful degradation preserves partial capability while reducing:

* freshness;
* quality;
* completeness;
* performance;
* optional features.

---

# 71. Non-Degradable Properties

Error handling shall not degrade:

* canonical integrity;
* authorization;
* identity;
* provenance;
* required durability;
* transaction correctness.

---

# 72. Rollback

Rollback reverts uncommitted local transaction state.

Rollback does not automatically reverse:

* remote calls;
* external publication;
* delivered notifications;
* committed external effects.

---

# 73. Compensation

Compensation performs an explicit new operation intended to counteract a prior committed effect.

---

# 74. Rollback Versus Compensation

Rollback applies before commit within a supported transaction boundary.

Compensation applies after commit or across non-transactional boundaries.

---

# 75. Compensation Failure

Compensation may fail.

Its failure shall be represented explicitly and may require recovery.

---

# 76. Recovery

Recovery restores valid operation or state after failure.

Recovery may use:

* checkpoint;
* replay;
* reconciliation;
* staged cleanup;
* projection rebuild;
* repair workflow.

---

# 77. Recovery Integration

Recovery semantics are defined in `Recovery.md`.

Error Handling determines when recovery is required.

---

# 78. Checkpoint Integration

Checkpointing may reduce lost work.

A checkpoint does not make every failure recoverable.

---

# 79. Partial Effect

PartialEffect means some intended effects occurred before failure.

---

# 80. Partial Effect Classification

Possible partial-effect states include:

* None;
* LocalUncommitted;
* LocalCommitted;
* ExternalPossiblyCompleted;
* Mixed;
* Unknown.

---

# 81. No Effect

NoEffect means the system can prove no intended effect became authoritative.

---

# 82. Local Uncommitted Effect

LocalUncommitted means temporary in-memory or transactional state existed but did not commit.

---

# 83. Local Committed Effect

LocalCommitted means canonical or durable local state committed before later failure.

---

# 84. External Possibly Completed

ExternalPossiblyCompleted means an external effect may have occurred but cannot yet be confirmed.

---

# 85. Mixed Effect

Mixed means multiple independent effects have different completion states.

---

# 86. Unknown Effect

Unknown means the system lacks sufficient evidence to classify effect state.

---

# 87. Unknown Outcome Handling

UnknownOutcome shall trigger:

* reconciliation;
* status Query;
* idempotent replay only when safe;
* recovery workflow.

Blind retry is prohibited.

---

# 88. Error Isolation

Failure in one component shall be contained according to architectural boundaries.

---

# 89. Bulkhead Isolation

Components may use independent:

* queues;
* worker pools;
* Retry Budgets;
* circuit breakers;
* Resource budgets.

---

# 90. Plugin Isolation

Plugin failure shall not crash or corrupt unrelated core capabilities.

---

# 91. Provider Isolation

Provider failure shall not make local capabilities unavailable unless they truly depend on that Provider.

---

# 92. Event Consumer Isolation

One failing Event Consumer shall not block unrelated Consumers indefinitely.

---

# 93. Parallel Branch Isolation

Failure in one parallel branch shall follow the parent operation's explicit failure policy.

---

# 94. Fault Containment Boundary

A Fault Containment Boundary limits how far a failure may propagate.

Possible boundaries include:

* Plugin;
* Provider;
* Job;
* Workflow Step;
* Event Consumer;
* Engine;
* Storage adapter.

---

# 95. Process Failure

The architecture shall assume the process may terminate unexpectedly.

Important execution state shall not depend solely on in-memory exceptions or logs.

---

# 96. Shutdown Errors

Shutdown may interrupt:

* Jobs;
* Workflows;
* Provider calls;
* writes;
* synchronization.

Shutdown handling shall preserve durable state and explicit recovery needs.

---

# 97. Startup Errors

Startup failures shall distinguish:

* fatal Kernel failure;
* optional Provider failure;
* Plugin failure;
* cache corruption;
* migration failure;
* unavailable NAS.

---

# 98. Fatal Error

A Fatal Error threatens safe continuation of the current process or critical capability.

---

# 99. Fatality Scope

Fatality shall be scoped.

A fatal Plugin failure is not necessarily fatal to the application.

---

# 100. Panic Boundary

Unexpected unrecoverable implementation faults should be contained at defined top-level execution boundaries where possible.

---

# 101. Invariant Failure

InvariantViolation may require:

* stopping the affected operation;
* isolating the component;
* preserving diagnostics;
* entering recovery;
* preventing further mutation.

---

# 102. Corruption Handling

Corruption shall not be repaired by silently accepting invalid data.

---

# 103. Corruption Response

Possible responses include:

* reject data;
* quarantine;
* restore from valid source;
* rebuild derived state;
* invoke repair workflow;
* request user action.

---

# 104. Cache Corruption

Cache corruption shall normally trigger eviction and rebuild.

It shall not alter canonical state.

---

# 105. Canonical Corruption

Canonical corruption requires stronger handling and may trigger:

* read-only mode;
* recovery;
* Source of Truth validation;
* backup restoration;
* user intervention.

---

# 106. Storage Error Handling

Storage errors shall distinguish:

* transient unavailable;
* permission denied;
* not found;
* capacity exhausted;
* integrity failure;
* unsupported operation;
* outcome unknown.

---

# 107. NAS Error Handling

NAS failures may include:

* disconnected;
* sleeping;
* permission changed;
* path unavailable;
* network timeout;
* inconsistent metadata.

---

# 108. NAS Offline Behavior

NAS unavailability shall not automatically invalidate valid local state.

The system shall represent:

* Source unavailable;
* local state available;
* freshness unknown or bounded;
* synchronization pending.

---

# 109. Provider Error Translation

Provider-specific codes and messages shall be translated into stable Integration errors.

---

# 110. Provider Error Categories

Provider errors may map to:

* Authentication;
* Authorization;
* RateLimited;
* Timeout;
* InvalidRequest;
* UnsupportedCapability;
* TemporaryUnavailable;
* PermanentFailure;
* UnknownOutcome.

---

# 111. Provider Error Content

Raw Provider bodies shall not be exposed to users or logs without sanitization.

---

# 112. AI Error Handling

AI errors may include:

* model unavailable;
* context too large;
* Resource exhaustion;
* Provider rate limit;
* unsafe fallback;
* output validation failure;
* cancellation;
* unknown remote outcome.

---

# 113. AI Output Validation Failure

Invalid AI output shall not be accepted as canonical state.

---

# 114. AI Fallback Error

If fallback changes model or Provider, the change shall remain explicit and observable.

---

# 115. OCR Error Handling

OCR errors may occur per:

* document;
* page;
* Region;
* Provider;
* preprocessing stage.

---

# 116. OCR Partial Success

Some pages may succeed while others fail.

The result shall expose page-level completeness and recovery options.

---

# 117. Import Error Handling

Import shall identify the failing stage.

Possible stages include:

* discovery;
* inspection;
* extraction;
* OCR;
* UDM;
* DPM;
* validation;
* commit;
* post-commit indexing.

---

# 118. Import Commit Failure

Failure before final commit shall not create partial canonical Library state.

---

# 119. Post-Commit Import Failure

Failure after canonical commit shall not report the entire Import as absent.

Derived work shall be represented separately.

---

# 120. Export Error Handling

Export shall distinguish:

* generation failure;
* packaging failure;
* destination failure;
* publication failure;
* unknown external outcome.

---

# 121. Search Error Handling

Search may return:

* complete Result;
* partial Result;
* degraded local-only Result;
* index unavailable;
* Provider augmentation failure.

---

# 122. Render Error Handling

Render failure shall preserve access to underlying knowledge where possible.

A failed presentation projection shall not imply canonical document corruption.

---

# 123. Annotation Error Handling

Annotation errors shall protect unsaved user input.

---

# 124. Annotation Persistence Failure

If annotation persistence fails:

* the user shall be informed;
* unsaved state shall remain distinguishable;
* retry or recovery shall be available where possible.

---

# 125. Synchronization Error Handling

Sync errors shall distinguish:

* transport failure;
* authentication failure;
* conflict;
* partial application;
* incompatible Peer;
* unknown outcome;
* convergence failure.

---

# 126. Sync Conflict

A synchronization Conflict is not automatically an infrastructure failure.

It is a state requiring governed resolution.

---

# 127. Plugin Error Handling

Plugin errors may include:

* incompatible Version;
* invalid manifest;
* Capability denial;
* execution timeout;
* Resource limit;
* crash;
* invalid output.

---

# 128. Plugin Disablement

Repeated severe Plugin failure may result in:

* suspension;
* disablement;
* quarantine.

This shall not affect unrelated Plugins or core capabilities unnecessarily.

---

# 129. Public API Error Handling

Public API errors shall expose stable public contracts.

They shall not expose internal stack traces or implementation details.

---

# 130. Local API Error Handling

Local APIs shall use the same semantic classification principles.

Local transport does not justify raw internal errors.

---

# 131. Error Presentation

User-facing Error presentation shall answer:

* what failed;
* what remains safe;
* whether the operation can be retried;
* whether user action is required;
* whether data was saved;
* whether recovery is running.

---

# 132. Technical Detail Separation

User-facing messages shall remain separate from developer diagnostics.

---

# 133. Actionable Error

An actionable Error should provide a clear next step where one exists.

---

# 134. Non-Actionable Internal Error

If the user cannot meaningfully fix the issue, the message shall not imply otherwise.

---

# 135. No False Data Loss

The UI shall not claim data loss unless the system can establish it.

---

# 136. No False Save

The UI shall not claim successful persistence before commit.

---

# 137. Error Localization

Localized user messages may vary.

Stable Error Codes and categories remain language-independent.

---

# 138. Error Privacy

Error information may reveal:

* paths;
* Provider accounts;
* document identity;
* Plugin identity;
* internal architecture.

Exposure shall be minimized.

---

# 139. Secret Redaction

Errors shall redact:

* credentials;
* tokens;
* private keys;
* secure headers;
* sensitive payloads.

---

# 140. Diagnostic Reference

A user-facing Error may include a safe Diagnostic Reference linked to internal observability evidence.

---

# 141. Error Logging

Errors shall be logged according to severity and expectedness.

---

# 142. Expected Rejection Logging

Expected validation or authorization rejection shall not automatically produce high-severity logs.

---

# 143. Unexpected Failure Logging

Unexpected InternalFailure or InvariantViolation should produce high-severity structured evidence.

---

# 144. Duplicate Error Logging

The same propagated Error shall not be logged redundantly at every layer without purpose.

---

# 145. Log at Ownership Boundary

An Error should normally be logged where:

* it is handled;
* it becomes terminal;
* it crosses a significant boundary;
* additional context is added.

---

# 146. Error Metrics

Errors shall map to bounded metric categories.

Raw messages shall not become metric labels.

---

# 147. Error Tracing

A failed Span should record:

* stable category;
* stable code;
* status;
* retryability;
* partial effect where appropriate.

---

# 148. Error Correlation

Error identity and operation identity should permit correlation across:

* logs;
* traces;
* Jobs;
* recovery;
* user diagnostics.

---

# 149. Error Retention

Error evidence retention shall depend upon:

* severity;
* recovery need;
* privacy;
* operational value;
* storage capacity.

---

# 150. Error Handling Under Pressure

During Resource pressure, Error Handling shall remain functional enough to:

* classify failure;
* protect canonical state;
* preserve critical evidence;
* avoid recursive allocation failure.

---

# 151. Minimal Failure Path

Critical failure paths should avoid unnecessary additional work.

---

# 152. Error Handling Failure

Error Handling itself may fail.

The system shall provide a minimal fallback representation without recursive failure storms.

---

# 153. Error Aggregation

When multiple errors occur, aggregation shall preserve each meaningful failure.

---

# 154. Parallel Error Aggregation

Parallel branch failures shall not be reduced to whichever completed first.

---

# 155. Primary Error

A Primary Error may be selected according to explicit policy.

Supporting errors shall remain available diagnostically.

---

# 156. Suppressed Error

Errors occurring during cleanup or compensation may be attached as secondary or suppressed errors.

---

# 157. Cleanup Failure

Cleanup failure shall not erase the original Error.

---

# 158. Compensation Error

Compensation failure shall be separately represented.

---

# 159. Recovery Error

Recovery failure shall preserve:

* original failure;
* recovery Attempt;
* new failure;
* remaining state.

---

# 160. Error Determinism

Equivalent deterministic failures should map to equivalent categories and codes.

---

# 161. Error Versioning

Externally exposed Error contracts may require Versioning.

---

# 162. Compatibility

New Error Details may be added compatibly where consumers tolerate unknown fields.

Semantic category changes require governed evolution.

---

# 163. Testing Requirements

Error Handling shall be tested through:

* validation failure;
* authorization denial;
* stale Version;
* timeout;
* cancellation;
* retry;
* retry exhaustion;
* partial effect;
* unknown outcome;
* rollback;
* compensation;
* recovery;
* corruption;
* Provider failure;
* Plugin failure;
* process termination.

---

# 164. Classification Testing

Tests shall verify each failure maps to the correct stable category.

---

# 165. Boundary Translation Testing

Tests shall verify lower-level errors translate correctly across:

* Storage;
* Integration;
* Platform;
* Public API;
* Plugin SDK.

---

# 166. Retryability Testing

Tests shall verify retryable and non-retryable conditions remain distinct.

---

# 167. Unknown Outcome Testing

Tests shall simulate:

* lost acknowledgement;
* timeout after possible commit;
* process crash near commit;
* remote request uncertainty.

Blind retry shall not occur.

---

# 168. Partial Effect Testing

Tests shall verify partial effects are represented accurately.

---

# 169. Rollback Testing

Tests shall verify uncommitted local state rolls back where supported.

---

# 170. Compensation Testing

Tests shall verify compensation:

* is explicit;
* may retry safely where defined;
* preserves failure evidence;
* reports its own failure.

---

# 171. Isolation Testing

Tests shall verify one Plugin, Provider or Consumer failure does not disable unrelated capabilities.

---

# 172. Corruption Testing

Tests shall inject:

* invalid cache;
* invalid serialization;
* damaged staged state;
* canonical integrity failure.

---

# 173. User Presentation Testing

Tests shall verify user-facing Errors accurately state:

* save status;
* retryability;
* remaining safe state;
* required user action.

---

# 174. Privacy Testing

Tests shall verify errors do not expose:

* credentials;
* tokens;
* document content;
* AI prompts;
* private paths;
* raw Provider bodies.

---

# 175. Observability Testing

Tests shall verify terminal failures preserve sufficient logs, metrics and traces without duplicate noise.

---

# 176. Pressure Testing

Error Handling shall be tested under:

* memory pressure;
* storage pressure;
* telemetry failure;
* queue saturation.

---

# 177. Governance

Architectural review is required for changes affecting:

* global Error taxonomy;
* stable Error Codes;
* unknown outcome semantics;
* retryability;
* compensation;
* user-facing persistence guarantees;
* Provider translation;
* Plugin isolation;
* Public API Error contracts;
* corruption handling.

---

# 178. Error Handling Invariants

The following invariants apply.

* Errors are structured execution outcomes.
* Raw Exceptions are not architectural contracts.
* Rejection, failure, cancellation, timeout and unknown outcome remain distinct.
* Error categories are stable.
* Error Codes do not change meaning silently.
* Errors preserve retryability.
* Errors preserve partial-effect information.
* Unknown outcome is represented explicitly.
* Blind retry after unknown external outcome is prohibited.
* Boundary translation preserves semantic meaning.
* Raw implementation errors do not cross architectural boundaries.
* Domain rejection is not treated automatically as infrastructure failure.
* Rollback and compensation remain distinct.
* Recovery is triggered explicitly when normal retry is insufficient.
* Failure in one Plugin, Provider or Consumer is isolated where possible.
* Canonical corruption is distinguished from derived-state corruption.
* User-facing messages distinguish saved from unsaved state.
* Error handling does not expose credentials or sensitive content.
* Error metrics use bounded categories.
* Error traces preserve causal context.
* Cleanup failure does not erase the original failure.
* Recovery failure preserves both original and recovery errors.
* Error handling remains functional under Resource pressure.
* Error behavior is observable and testable.

---

# 179. Prohibited Behaviors

KnowledgeOS shall never:

* treat raw exceptions as stable public contracts;
* collapse all failures into a generic error;
* treat timeout as proof that no effect occurred;
* retry unknown external outcomes blindly;
* hide partial effects;
* report failure as cancellation or cancellation as failure without classification;
* publish raw Provider or Storage errors directly to users;
* expose stack traces through Public APIs;
* expose credentials, tokens or private keys in Errors;
* claim rollback reversed external committed effects;
* treat compensation as automatic rollback;
* allow one Plugin failure to crash unrelated core capabilities;
* allow one Event Consumer failure to invalidate the original Event fact;
* repair corruption by silently accepting invalid data;
* report successful persistence before commit;
* claim data loss without evidence;
* log the same propagated Error redundantly at every layer;
* replace the original Error with cleanup or compensation failure;
* classify every unexpected issue as retryable;
* hide recovery requirements behind repeated retries;
* let Error Handling create recursive failure storms.

---

# 180. Related Documents

## Reliability

* `Observability.md`
* `Metrics.md`
* `Tracing.md`
* `Checkpointing.md`
* `Recovery.md`

## Performance

* `../Performance/CacheStrategy.md`
* `../Performance/ExecutionProfiles.md`
* `../Performance/MemoryModel.md`
* `../Performance/ParallelExecution.md`
* `../Performance/PerformanceModel.md`

## Concurrency

* `../Concurrency/ConcurrencyModel.md`
* `../Concurrency/Determinism.md`
* `../Concurrency/Idempotency.md`
* `../Concurrency/Locking.md`
* `../Concurrency/RetryPolicies.md`
* `../Concurrency/Transactions.md`

## Messaging

* `../Messaging/Commands.md`
* `../Messaging/EventOrdering.md`
* `../Messaging/EventProcessing.md`
* `../Messaging/Events.md`
* `../Messaging/Queries.md`

## Runtime

* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`
* `../Runtime/Lifecycle.md`
* `../Runtime/ResourceManagement.md`
* `../Runtime/Scheduling.md`

## Kernel

* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Logging.md`
* `../../03-Kernel/Observability.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/AI/README.md`
* `../../04-Platform/Annotation/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Render/README.md`
* `../../04-Platform/Search/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/ExternalServices/Webhooks.md`
* `../../05-Integration/Providers/ProviderModel.md`
* `../../05-Integration/PublicAPI/APIConventions.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 181. Status

**Approved**

This document defines the Error Handling model of KnowledgeOS.

Errors are structured execution outcomes rather than raw implementation exceptions.

Validation, authorization, conflict, timeout, cancellation, Resource exhaustion, dependency failure, corruption, partial failure, unknown outcome and recovery requirement remain distinct categories.

Each Error preserves semantic meaning, retryability, partial-effect state, recovery need and user-action requirements where relevant.

Errors are translated at architectural boundaries.

Raw Provider, Storage, Plugin and implementation exceptions do not cross into Domain, Public API or user-facing contracts unchanged.

Timeout does not prove that no effect occurred.

Unknown outcome is represented explicitly and triggers reconciliation or governed recovery rather than blind retry.

Rollback applies only to supported uncommitted transactional state.

Compensation is a separate explicit operation for already committed or external effects.

Recovery is invoked when retry, fallback or compensation is insufficient.

Plugin, Provider, Event Consumer and parallel-branch failures are isolated according to their fault-containment boundaries.

Canonical corruption is distinguished from cache, projection and derived-state corruption.

User-facing Errors state what failed, what remains safe, whether data was saved, whether retry is possible and whether user action is required.

Credentials, tokens, private keys, unrestricted content and raw external payloads are excluded from Error contracts and diagnostics.

KnowledgeOS therefore treats Error Handling as a semantic reliability system that preserves truth about failure, effect and recoverability across all execution layers.
