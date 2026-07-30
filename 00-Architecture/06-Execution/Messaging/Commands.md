
# Commands

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Messaging

**Document:** Commands

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the execution semantics of Commands within KnowledgeOS.

A Command expresses explicit intent to perform an operation that may change authoritative state or initiate a state-changing Workflow.

Commands provide the primary message model for requesting controlled mutation across:

* Domain state;
* Platform capabilities;
* Kernel-managed workflows;
* Integration operational state;
* long-running execution;
* Provider-mediated external effects.

A Command is not:

* a statement of completed fact;
* a Query;
* an Event;
* direct method access to mutable Domain internals;
* permission to perform the requested operation;
* proof that the requested operation completed.

A Command shall be validated, authorized and executed through one governed execution path.

---

# 2. Scope

This document governs:

* Command identity;
* Command contracts;
* Command naming;
* Command payloads;
* Command metadata;
* Command validation;
* authorization;
* Command dispatch;
* Command handling;
* Command ownership;
* Command results;
* rejection;
* failure;
* asynchronous acceptance;
* deferred execution;
* idempotency;
* retries;
* concurrency;
* transactions;
* Events produced by Commands;
* long-running Commands;
* cancellation;
* Commands initiated through Public APIs;
* Commands initiated by Plugins;
* Commands initiated through MCP;
* Commands initiated by Workflows;
* Commands interacting with Providers;
* Command observability;
* Command security;
* Command testing.

This document does not define:

* Query semantics;
* Event semantics;
* Event ordering;
* transport-specific Public API formats;
* internal Domain method implementation;
* Workflow Engine implementation;
* transaction implementation details;
* concrete Command Bus implementation.

---

# 3. Architectural Position

Commands belong to the Execution Messaging architecture.

```text
Caller
  │
  ▼
Command Contract
  │
  ▼
Command Bus
  │
  ▼
Validation and Authorization
  │
  ▼
Command Handler
  │
  ▼
Domain / Platform Operation
  │
  ▼
Transaction / Workflow
  │
  ▼
Command Result
```

The Command Bus provides dispatch infrastructure.

This document defines Command semantics.

---

# 4. Core Principle

The fundamental principle is:

> A Command expresses intent to change state.

A Command shall never bypass:

* authentication where required;
* authorization;
* Capability checks;
* Domain invariants;
* concurrency controls;
* transaction boundaries;
* idempotency requirements;
* Platform ownership.

---

# 5. Mission

The mission of Commands is to provide a clear, explicit and observable path for state-changing intent.

Commands shall make mutation:

* intentional;
* attributable;
* validated;
* authorized;
* deterministic where required;
* idempotent where required;
* transactionally bounded;
* observable;
* recoverable where required.

---

# 6. Design Philosophy

Commands shall be:

* explicit;
* imperative;
* intention-revealing;
* immutable after creation;
* contract-based;
* narrowly scoped;
* attributable;
* version-aware where required;
* independent from transport;
* independent from UI implementation.

---

# 7. Command Definition

A Command is an immutable message requesting one specific state-changing operation.

Examples include:

* CreateKnowledgeObject;
* UpdateKnowledgeObjectMetadata;
* AddAnnotation;
* RemoveAnnotation;
* ImportDocument;
* ExportKnowledgeObject;
* InstallPlugin;
* EnableProvider;
* StartSynchronization;
* CancelRemoteExecution.

A Command describes what is requested.

It does not prescribe every internal implementation step.

---

# 8. Command Intent

Every Command shall represent one coherent intent.

A Command should answer:

> What change is the caller asking KnowledgeOS to perform?

The Command shall not merely expose low-level storage or infrastructure operations.

---

# 9. Intention-Revealing Naming

Command names shall use imperative, intention-revealing language.

Preferred examples:

* CreateAnnotation;
* UpdateKnowledgeMetadata;
* StartImport;
* RevokePluginCapability;
* MigrateLibraryStorage.

Discouraged examples:

* SaveData;
* Process;
* HandleItem;
* ExecuteAction;
* UpdateEverything.

---

# 10. Command Granularity

A Command shall be large enough to express meaningful intent and small enough to preserve one clear operation boundary.

A Command shall not combine unrelated intentions merely to reduce message count.

---

# 11. Composite Intent

When one user operation requires multiple coordinated steps, the initiating Command may start a Workflow.

The Command shall not contain arbitrary internal procedural instructions.

Example:

```text
ImportDocument
      │
      ▼
Import Workflow
      ├── Acquire Source
      ├── Extract
      ├── OCR
      ├── Build UDM
      ├── Build DPM
      └── Commit
```

---

# 12. Command Contract

Every Command contract shall define:

* Command Identity;
* Command type;
* contract Version where required;
* payload;
* target scope;
* actor or Principal context reference;
* expected Version where applicable;
* idempotency semantics;
* execution mode;
* validation rules.

---

# 13. Command Identity

Every Command requiring correlation, retry, deduplication or audit shall have stable Command Identity.

Command Identity shall remain stable across redelivery or retry of the same logical Command.

---

# 14. Command Identity Versus Operation Identity

Command Identity and Logical Operation Identity may be identical or related.

For long-running operations, one Command may create a separate Operation Identity.

Example:

```text
Command Identity
      │
      ▼
StartImport
      │
      ▼
Import Operation Identity
```

---

# 15. Attempt Identity

Each physical handling Attempt may have separate Attempt Identity.

Attempt Identity shall not replace Command Identity.

---

# 16. Command Immutability

A Command shall be immutable after creation.

Retries and reprocessing shall use the same semantic Command data.

A changed request requires a new Command.

---

# 17. Command Payload

The payload shall contain only information required to express the requested intent.

It shall not contain:

* injected service instances;
* repository references;
* database entities;
* raw Provider SDK objects;
* unrestricted filesystem handles;
* raw credentials;
* mutable Domain objects.

---

# 18. Command Metadata

Command metadata may include:

* correlation identity;
* causation identity;
* Principal Identity;
* Device Identity;
* Workspace Identity;
* Library Identity;
* deadline;
* priority;
* idempotency key;
* tracing context.

Metadata shall remain distinct from Domain payload semantics.

---

# 19. Command Context

Execution Context may supply runtime metadata not owned by the Command contract.

Command semantics shall not rely upon hidden mutable global context.

---

# 20. Principal

A state-changing Command shall be attributable to a Principal where authorization or audit requires it.

A Principal may represent:

* user;
* Plugin;
* local client;
* Public API client;
* trusted system component;
* Workflow;
* external integration.

---

# 21. Command Source

Command Source may identify the architectural origin.

Examples include:

* User Interface;
* Local API;
* Public API;
* Plugin;
* MCP;
* Workflow;
* Scheduler;
* Webhook Integration;
* synchronization process.

Source does not replace Principal Identity or authorization.

---

# 22. Target

A Command shall identify its target scope explicitly where applicable.

Possible targets include:

* Library;
* Workspace;
* Knowledge Object;
* Knowledge Object Version;
* Annotation;
* Plugin;
* Provider;
* Synchronization Peer;
* Storage Location;
* Workflow;
* Job.

---

# 23. Expected Version

Commands modifying versioned state should carry an Expected Version or equivalent precondition when concurrent change is possible.

The Expected Version protects against stale mutation.

---

# 24. Missing Expected Version

A Command without Expected Version shall have explicit semantics.

Possible semantics include:

* create-only;
* unconditional idempotent set;
* server-resolved current state;
* serialized scope;
* conflict-insensitive operation.

Unconditional overwrite shall not be assumed casually.

---

# 25. Command Version

Externally exposed Command contracts may require Versioning.

Command contract Version is distinct from:

* target object Version;
* application Version;
* API Version;
* Domain Version.

---

# 26. Command Creation

Commands may be created by:

* UI application services;
* API adapters;
* Plugin adapters;
* MCP adapters;
* Workflow Steps;
* scheduler-triggered services;
* synchronization orchestration.

Creation shall validate transport-level structure before dispatch.

---

# 27. Command Dispatch

Commands shall be dispatched through the Command Bus or equivalent governed execution mechanism.

Callers shall not invoke private Command Handlers directly.

---

# 28. Command Bus Responsibility

The Command Bus may own:

* Handler resolution;
* Execution Context propagation;
* middleware or pipeline execution;
* logging;
* tracing;
* cancellation propagation;
* result delivery.

The Command Bus does not own Domain semantics.

---

# 29. One Authoritative Handler

Each Command contract shall have one authoritative Handler.

The Handler may delegate work to:

* Domain Services;
* Platform Services;
* Workflows;
* Kernel infrastructure;
* Integration contracts.

Multiple independent authoritative Handlers for the same Command are prohibited.

---

# 30. Handler Ownership

A Command Handler belongs to the architectural subsystem that owns the requested capability.

Examples:

* Library Engine handles Library mutation Commands.
* Annotation Engine handles Annotation Commands.
* Plugin Engine handles Plugin lifecycle Commands.
* Sync Engine handles synchronization Commands.

---

# 31. Handler Responsibility

A Command Handler shall:

1. establish execution context;
2. validate structural and semantic preconditions;
3. authorize the request;
4. enforce concurrency and idempotency;
5. execute or initiate the owned operation;
6. commit state where applicable;
7. return a stable result;
8. emit or persist resulting Events where appropriate.

---

# 32. Handler Non-Responsibilities

A Command Handler shall not:

* bypass Domain rules;
* expose infrastructure details;
* mutate unrelated state;
* swallow failures silently;
* publish success Events before commit;
* hold broad Locks across remote operations;
* embed vendor-specific behavior into Domain logic.

---

# 33. Validation Layers

Command validation may occur in multiple layers:

```text
Transport Validation
      │
      ▼
Contract Validation
      │
      ▼
Authorization Validation
      │
      ▼
Domain Validation
      │
      ▼
Execution Preconditions
```

These layers solve distinct concerns.

---

# 34. Transport Validation

Transport adapters validate:

* message shape;
* required fields;
* encoding;
* size;
* API format.

Transport validation does not establish Domain validity.

---

# 35. Contract Validation

Contract validation verifies:

* Command type;
* field constraints;
* supported Version;
* identity formats;
* required metadata.

---

# 36. Authorization Validation

Authorization determines whether the Principal may request the operation against the target scope.

Authentication alone does not authorize a Command.

---

# 37. Domain Validation

Domain validation determines whether the requested state transition is valid under current Domain rules.

---

# 38. Execution Preconditions

Execution preconditions may include:

* expected Version still current;
* Storage available;
* Provider enabled;
* Plugin compatible;
* required Capability available;
* adequate Resource availability;
* no incompatible operation active.

---

# 39. Validation Timing

Validation that depends upon mutable state shall occur close to the commit or execution boundary.

Long-running preparation may require revalidation before final commit.

---

# 40. Command Authorization

Every privileged Command shall be authorized before its effect begins.

Authorization may consider:

* Principal;
* role;
* Capability;
* Library scope;
* Workspace scope;
* Plugin permissions;
* Provider permissions;
* target identity;
* data classification.

---

# 41. Delegated Commands

A Workflow, Plugin or external Integration may dispatch Commands only within its granted authority.

Delegation does not expand permissions.

---

# 42. Authorization Revalidation

Long-running Commands may require authorization revalidation before irreversible or externally visible effects.

---

# 43. Command Acceptance

Command acceptance means KnowledgeOS has accepted responsibility for processing the Command.

Acceptance does not necessarily mean completion.

---

# 44. Synchronous Command

A synchronous Command completes within the current request-response interaction.

It is appropriate for bounded operations such as:

* update metadata;
* add small Annotation;
* enable a local setting;
* rename a collection.

---

# 45. Asynchronous Command

An asynchronous Command initiates a long-running operation and returns an Operation reference.

Examples include:

* ImportDocument;
* ExportLibrary;
* StartSynchronization;
* RunOCR;
* GenerateEmbeddings;
* MigrateStorage.

---

# 46. Asynchronous Acceptance Result

An asynchronous acceptance result may contain:

* Command Identity;
* Operation Identity;
* initial operation state;
* status Query reference;
* cancellation capability;
* estimated execution classification where appropriate.

It shall not claim completion.

---

# 47. Deferred Command

A Command may be accepted but deferred.

Reasons may include:

* offline state;
* unavailable Provider;
* insufficient background execution time;
* waiting for Resource;
* scheduled execution policy;
* user confirmation required.

---

# 48. Deferred Semantics

A deferred Command shall preserve:

* identity;
* intent;
* authorization reference;
* expiration;
* deadline;
* revalidation requirements;
* idempotency state.

---

# 49. Command Expiration

Some Commands have bounded validity.

A Command shall not execute after its semantic expiration.

---

# 50. Deadline

A Command deadline defines when its result ceases to be useful or permitted.

Deadline is distinct from per-Attempt timeout.

---

# 51. Command Priority

Commands may have priority classes such as:

* Critical;
* Interactive;
* UserInitiated;
* Background;
* Maintenance.

Priority affects scheduling.

It does not override authorization, invariants or transaction rules.

---

# 52. Command Result

A Command Result represents the outcome of handling the Command.

Possible result categories include:

* Completed;
* Accepted;
* Deferred;
* Rejected;
* Conflict;
* Failed;
* Cancelled;
* OutcomeUnknown.

---

# 53. Completed Result

Completed means the Command's defined completion guarantee has been satisfied.

For canonical state mutation, this normally requires commit.

---

# 54. Accepted Result

Accepted means processing responsibility has been established but execution is not complete.

---

# 55. Deferred Result

Deferred means execution is intentionally postponed.

The result should expose how the operation can be observed.

---

# 56. Rejected Result

Rejected means the Command was understood but not allowed or not valid under current rules.

Examples include:

* authorization denial;
* Domain rule violation;
* unsupported state transition;
* invalid Capability.

---

# 57. Conflict Result

Conflict indicates stale or incompatible state assumptions.

A Conflict may contain:

* current Version;
* expected Version;
* conflict category;
* recovery guidance;
* safe retry eligibility.

It shall not leak unauthorized current state.

---

# 58. Failed Result

Failed represents an execution or infrastructure failure.

It shall use stable failure categories rather than raw implementation exceptions.

---

# 59. Cancelled Result

Cancelled means execution stopped according to the cancellation contract.

Already committed effects remain committed.

---

# 60. Outcome Unknown

OutcomeUnknown indicates that KnowledgeOS cannot currently prove whether the intended effect completed.

This state requires reconciliation before unsafe retry.

---

# 61. Result Payload

The Result payload shall expose only stable contract data.

It shall not expose:

* raw Domain entities;
* database models;
* stack traces;
* Provider SDK response objects;
* raw credentials;
* internal file paths.

---

# 62. Command Rejection Versus Failure

Rejection and failure are distinct.

Rejection means the system correctly determined that the operation should not proceed.

Failure means the system could not complete valid execution.

---

# 63. Expected Rejection

Expected Domain rejection shall not be logged as an infrastructure defect by default.

Examples include:

* invalid lifecycle transition;
* stale Version;
* insufficient permission;
* missing required Capability.

---

# 64. Command Errors

Stable Command error categories may include:

* InvalidCommand;
* UnauthorizedCommand;
* ForbiddenCommand;
* CommandConflict;
* CommandUnsupported;
* CommandExpired;
* CommandCancelled;
* CommandTimeout;
* CommandFailed;
* CommandOutcomeUnknown;
* ResourceUnavailable;
* CapabilityUnavailable.

---

# 65. Error Translation

Infrastructure, Provider and persistence failures shall be translated into stable Command results or errors.

Raw exceptions shall remain internal.

---

# 66. Command and Transactions

State-changing Commands shall use explicit transaction boundaries where required.

Completion shall not be reported before commit.

---

# 67. Command and Events

A successful Command may produce Events representing completed facts.

The required ordering is:

```text
Command
   │
   ▼
Validate
   │
   ▼
Mutate
   │
   ▼
Commit
   │
   ▼
Publish / Deliver Events
```

---

# 68. Event Creation Before Commit

Event data may be prepared before commit and stored in an Outbox.

The Event shall not be externally treated as published until commit succeeds.

---

# 69. Command Does Not Equal Event

A Command represents requested intent.

An Event represents a fact that occurred.

Example:

```text
Command:
CreateAnnotation

Event:
AnnotationCreated
```

---

# 70. Event on Rejection

Rejected Commands may produce operational diagnostics or audit evidence.

They shall not emit Domain Events claiming the requested state change occurred.

---

# 71. Command and Queries

A Command may use Queries internally for read models or validation.

However, mutable state validation should use authoritative state within the correct consistency boundary.

---

# 72. Query After Command

Callers requiring updated state may:

* use the Command Result;
* issue a subsequent Query;
* subscribe to operation or Event updates.

The Command shall not return an uncontrolled full internal state graph.

---

# 73. Command Idempotency

Commands subject to retry or duplicate delivery shall define idempotency semantics.

Possible classifications include:

* NaturallyIdempotent;
* IdempotentWithKey;
* VersionIdempotent;
* NonIdempotent;
* ReconciliationRequired.

---

# 74. Naturally Idempotent Commands

Example:

```text
SetPluginEnabled(pluginId, true)
```

Repeating the Command results in the same intended state.

---

# 75. Create Commands

Create Commands require stable identity or Idempotency Key to prevent duplicate creation.

---

# 76. Command Deduplication

Deduplication shall be atomic with effect registration where necessary.

Unsafe read-then-write duplicate checks are prohibited.

---

# 77. Duplicate Completed Command

A duplicate completed Command may return:

* original Result;
* stable result reference;
* equivalent current Result.

The contract shall define the behavior.

---

# 78. Duplicate In-Progress Command

A duplicate in-progress Command may:

* attach to the existing operation;
* return Accepted with the existing Operation Identity;
* wait according to bounded policy.

It shall not start an independent duplicate effect.

---

# 79. Inconsistent Duplicate

The same Command Identity or Idempotency Key with different semantic payload shall fail explicitly.

---

# 80. Command Retry

Retry shall preserve:

* Command Identity;
* Logical Operation Identity;
* idempotency identity;
* semantic payload;
* target;
* expected Version unless re-evaluation semantics explicitly apply.

---

# 81. Retry Eligibility

A Command may retry only according to `../Concurrency/RetryPolicies.md`.

Domain rejection and invalid input are not retryable unchanged.

---

# 82. Command Concurrency

Commands affecting the same invariant scope shall coordinate through:

* Version checks;
* serialized execution;
* Transactions;
* Locks;
* Domain conflict handling.

---

# 83. Arrival Order

Command arrival order does not automatically define semantic order.

Explicit Versions, Workflow dependencies or serialized scopes determine ordering.

---

# 84. Concurrent Create

Concurrent creation targeting the same stable identity shall result in one valid creation or an explicit conflict.

---

# 85. Stale Command

A Command prepared against stale state shall not overwrite current canonical state silently.

---

# 86. Command Cancellation

Long-running Commands should support cancellation where meaningful.

Cancellation may apply to:

* queued work;
* active Workflow;
* remote operation request;
* background Job;
* staged Import.

---

# 87. Cancellation Before Commit

Cancellation before commit should prevent authoritative state change.

---

# 88. Cancellation After Commit

Cancellation after commit cannot reverse committed canonical state automatically.

A separate compensating Command may be required.

---

# 89. Command Compensation

Compensation is expressed through a new explicit Command.

Examples include:

* RevokeShare;
* RemoveGeneratedArtifact;
* RestorePreviousVersion;
* DisconnectProvider.

Compensation is not hidden rollback.

---

# 90. Long-Running Commands

Long-running Commands shall normally initiate:

* Job;
* Workflow;
* remote execution operation;
* scheduled operation.

The initial Handler shall not remain blocked for the full operation lifetime unnecessarily.

---

# 91. Operation Status

Long-running Commands shall expose status through approved Queries or Events.

Possible states include:

* Pending;
* Queued;
* Running;
* Waiting;
* Completed;
* Failed;
* Cancelled;
* RecoveryRequired.

---

# 92. Progress

Progress belongs to the operation started by the Command.

Progress does not change the original Command contract.

---

# 93. Command Recovery

Recoverable Commands shall preserve durable operation state.

Process restart shall not silently create a new operation.

---

# 94. Command Checkpointing

Workflow or Job state may checkpoint progress.

The Command itself remains the initiating intent.

---

# 95. User Commands

Commands initiated directly by users shall preserve clear attribution and user-visible outcomes.

The user should be able to distinguish:

* accepted;
* running;
* completed;
* failed;
* conflict;
* cancelled.

---

# 96. UI Commands

UI interaction shall create Commands through application services.

UI components shall not mutate Domain state directly.

---

# 97. Duplicate UI Interaction

Rapid repeated user actions may create duplicate Commands.

The application may use:

* UI suppression;
* stable Command Identity;
* idempotency;
* operation reuse.

UI suppression alone is not sufficient for durable duplicate protection.

---

# 98. Public API Commands

Public API mutations shall map to explicit Commands.

HTTP methods, GraphQL mutations or Local API calls are transport forms.

They do not define internal mutation semantics.

---

# 99. Public API Idempotency

Public clients should be able to supply Idempotency Keys for retryable state-changing operations where appropriate.

---

# 100. Local API Commands

Local callers use the same authorization, validation and Command semantics as remote callers.

Local transport does not imply unrestricted trust.

---

# 101. MCP Commands

State-changing MCP Tools shall translate into approved Commands or Workflows.

MCP shall not invoke private Domain methods directly.

---

# 102. Plugin Commands

Plugins may dispatch only Commands permitted by:

* granted Capabilities;
* Extension Points;
* target scope;
* current authorization.

---

# 103. Plugin-Specific Commands

Plugins may define Plugin-owned Commands within their Extension boundaries.

They shall not redefine core Command contracts or Domain invariants.

---

# 104. Workflow Commands

A Workflow may dispatch Commands as part of governed orchestration.

The Workflow's authority is bounded by its initiating context and explicit system capabilities.

---

# 105. Scheduler Commands

Scheduled execution may dispatch Commands when:

* the schedule is valid;
* authorization remains valid;
* Command intent remains current;
* preconditions are revalidated.

---

# 106. Webhook-Initiated Commands

A validated Webhook may translate into an approved Command.

The external sender does not gain direct Command Bus access.

---

# 107. Synchronization Commands

Synchronization Commands may initiate:

* Session opening;
* Change Set application;
* reconciliation;
* conflict resolution workflow.

External transport messages shall not become internal Commands without validation and translation.

---

# 108. Storage Commands

Storage Integration Commands configure or control Storage operational state.

Canonical Library mutation shall remain owned by Library Commands and Workflows.

---

# 109. Provider Commands

Provider Commands may manage:

* registration;
* configuration;
* enablement;
* disablement;
* Connection lifecycle.

Provider Commands shall not expose raw credential material.

---

# 110. AI Commands

AI-related Commands may initiate:

* inference;
* summarization;
* embedding generation;
* classification;
* assisted transformation.

Generated output remains derived until an explicit acceptance Command or Workflow commits canonical change.

---

# 111. OCR Commands

OCR Commands initiate processing.

They shall not directly overwrite canonical source content without the governed Import or processing commit path.

---

# 112. Import Commands

`StartImport` or equivalent initiates an Import Workflow.

The Command Result should expose Import Operation Identity rather than pretend the Import completed immediately.

---

# 113. Export Commands

Export Commands shall distinguish:

* generate Artifact;
* publish Artifact;
* save Artifact to destination.

These may have different side effects and idempotency semantics.

---

# 114. Annotation Commands

Annotation Commands may include:

* CreateAnnotation;
* UpdateAnnotation;
* DeleteAnnotation;
* AddInkStroke;
* MoveStickyNote;
* ReanchorAnnotation.

They shall preserve anchor and Version invariants.

---

# 115. Library Commands

Library Commands may include:

* CreateKnowledgeObject;
* CommitKnowledgeObjectVersion;
* UpdateKnowledgeMetadata;
* MoveLibraryObject;
* DeleteKnowledgeObject;
* MigrateSourceOfTruth.

Broad Library Commands require stronger review and transaction boundaries.

---

# 116. Render Commands

Most rendering requests are not canonical state-changing Commands.

They may instead be execution requests or Queries.

Only persistent presentation-state mutations should use Commands.

---

# 117. Search Commands

Search itself is a Query.

Index rebuild, index invalidation or search configuration mutation may use Commands.

---

# 118. Command Security

Commands are a primary mutation boundary.

Security shall include:

* authentication;
* authorization;
* Capability checks;
* target validation;
* payload size limits;
* replay protection where required;
* sensitive data minimization.

---

# 119. Raw Credential Prohibition

Commands shall not carry raw credentials unless a narrowly designed secure credential operation explicitly requires protected secret handling.

Ordinary Commands shall reference secure Connection or Credential Identity.

---

# 120. Command Injection

External data shall not be interpreted as a Command merely because it contains instruction-like text.

AI output, documents, Webhooks and Plugin data remain data until explicit translation and authorization occur.

---

# 121. Confused Deputy Protection

A trusted subsystem shall not execute a Command with its own broader authority merely because an untrusted caller requested it.

The initiating authority context shall be preserved and checked.

---

# 122. Replay Protection

Security-sensitive Commands may require:

* nonce;
* timestamp window;
* signature;
* stable Command Identity;
* Idempotency Key;
* Principal binding.

Idempotency prevents duplicate effects but does not authenticate the caller.

---

# 123. Command Retention

Command payloads and execution records shall have bounded retention.

Retention depends upon:

* retry window;
* recovery requirements;
* audit requirements;
* privacy;
* operation significance.

---

# 124. Sensitive Command Data

Sensitive payload fields shall be:

* minimized;
* encrypted where required;
* excluded from logs;
* redacted from diagnostics;
* removed according to retention policy.

---

# 125. Command Observability

Command execution shall be observable.

Observable metadata may include:

* Command Identity;
* Command type;
* Principal Identity;
* target scope;
* Handler Identity;
* Attempt count;
* execution state;
* duration;
* result category;
* failure category;
* correlation identity.

---

# 126. Logging

Command logs should record:

* received;
* validated;
* authorized;
* accepted;
* completed;
* rejected;
* failed;
* cancelled;
* OutcomeUnknown.

Logs shall not include full sensitive payloads by default.

---

# 127. Metrics

Command metrics may include:

* Commands received;
* Commands completed;
* Commands rejected;
* Commands conflicted;
* Commands failed;
* average duration;
* queue delay;
* retry count;
* cancellation count;
* asynchronous acceptance count;
* duplicate detection count.

---

# 128. Tracing

A Command trace may include:

```text
Command Dispatch
      │
      ▼
Validation
      │
      ▼
Authorization
      │
      ▼
Handler
      │
      ▼
Transaction / Workflow
      │
      ▼
Result
```

External calls and child Jobs should preserve causation.

---

# 129. Audit

Commands with security, privacy or irreversible impact may require audit.

Examples include:

* delete knowledge;
* migrate Source of Truth;
* grant Plugin Capability;
* revoke external account;
* publish external Artifact;
* send sensitive data remotely.

---

# 130. Audit Content

Audit should preserve:

* Command Identity;
* Command type;
* Principal;
* target;
* result;
* time;
* relevant policy decision.

Audit shall not store secrets.

---

# 131. Testing Requirements

Commands shall be tested through:

* valid execution;
* invalid payload;
* authorization denial;
* Domain rejection;
* stale Version;
* duplicate delivery;
* concurrent execution;
* transaction rollback;
* retry;
* cancellation;
* asynchronous acceptance;
* process interruption;
* Event emission;
* security boundaries.

---

# 132. Contract Testing

Every stable Command contract shall be tested for:

* required fields;
* optional fields;
* Version compatibility;
* validation;
* serialization where exposed externally.

---

# 133. Handler Testing

Each Handler shall be tested for:

* correct owner;
* Domain rule enforcement;
* transaction boundary;
* idempotency;
* Result contract;
* Event production.

---

# 134. Authorization Testing

Tests shall verify that unauthorized Principals cannot perform the Command even if they know valid target identities.

---

# 135. Idempotency Testing

The same Command shall be delivered:

* sequentially;
* concurrently;
* after process restart;
* after lost response.

Duplicate effects shall not occur.

---

# 136. Concurrency Testing

Conflicting Commands shall be executed concurrently to verify:

* Version checks;
* serialization;
* conflict results;
* absence of lost updates.

---

# 137. Transaction Testing

Tests shall verify that:

* no success is returned before commit;
* failed commit emits no success Event;
* partial mutation remains non-authoritative;
* Outbox records align with commit.

---

# 138. Asynchronous Testing

Long-running Commands shall be tested for:

* accepted Result;
* stable Operation Identity;
* status Queries;
* cancellation;
* recovery;
* terminal completion.

---

# 139. Failure Injection

Tests should inject failure:

* before validation;
* after authorization;
* before transaction;
* during transaction;
* after commit before response;
* during Event publication;
* during Workflow initiation.

---

# 140. Security Testing

Security tests shall include:

* Command replay;
* Principal substitution;
* Capability escalation;
* payload injection;
* oversized payload;
* secret leakage;
* confused-deputy scenarios.

---

# 141. Governance

Changes affecting Command contracts require architectural review when they alter:

* canonical mutation semantics;
* authorization;
* idempotency;
* transaction boundaries;
* external API compatibility;
* Plugin capabilities;
* Event production;
* long-running operation semantics.

---

# 142. Command Invariants

The following invariants apply.

* A Command expresses explicit intent to change state.
* Commands are immutable after creation.
* Every Command has one authoritative Handler.
* Command ownership follows capability ownership.
* Commands are transport-independent.
* Commands do not expose infrastructure objects.
* Commands do not carry raw mutable Domain entities.
* Privileged Commands are authenticated and authorized.
* Authorization does not follow automatically from authentication.
* Mutable-state validation occurs near the execution boundary.
* State-changing Commands use explicit transaction boundaries where required.
* Completion is not reported before commit.
* Success Events are not published before commit.
* Command and Event semantics remain distinct.
* Asynchronous acceptance is not completion.
* Long-running Commands expose stable Operation Identity.
* Retried Commands preserve Command and Logical Operation Identity.
* Duplicate Commands do not create duplicate effects.
* Stale Commands do not overwrite current state silently.
* Arrival order does not automatically define semantic order.
* Cancellation before commit prevents authoritative mutation where possible.
* Cancellation after commit does not reverse state automatically.
* Plugins and MCP invoke Commands only through approved capabilities.
* Webhook payloads do not become Commands without translation and authorization.
* Commands do not contain raw Provider credentials.
* Command execution is observable and testable.

---

# 143. Prohibited Behaviors

KnowledgeOS shall never:

* treat a Command as proof that an operation occurred;
* use Commands as Queries;
* use Events as mutation requests;
* permit multiple authoritative Handlers for one Command;
* invoke private Command Handlers directly from external adapters;
* expose database entities in Command contracts;
* expose vendor SDK objects in Command contracts;
* carry raw credentials in ordinary Commands;
* bypass authorization because a caller is local;
* bypass Domain invariants through Integration Commands;
* report completion before transaction commit;
* publish success Events before commit;
* retry stale mutation blindly;
* create new logical identity for each retry;
* process inconsistent duplicate Command payloads under the same identity;
* allow UI components to mutate Domain state directly;
* allow Plugins unrestricted Command Bus access;
* allow MCP Tools to invoke private Domain methods;
* treat Webhook source authentication as internal Command authorization;
* keep long-running work blocked inside the initial request unnecessarily;
* hide Command rejection, conflict or failure from observability.

---

# 144. Related Documents

## Execution

* `../README.md`
* `../Concurrency/ConcurrencyModel.md`
* `../Concurrency/Determinism.md`
* `../Concurrency/Idempotency.md`
* `../Concurrency/Locking.md`
* `../Concurrency/RetryPolicies.md`
* `../Concurrency/Transactions.md`
* `EventOrdering.md`
* `EventProcessing.md`
* `Events.md`
* `Queries.md`
* `../Reliability/ErrorHandling.md`
* `../Reliability/Recovery.md`
* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`
* `../Runtime/Lifecycle.md`

## Domain

* `../../02-Domain/DomainModel.md`
* `../../02-Domain/EngineResponsibilities.md`
* `../../02-Domain/KnowledgeLifecycle.md`
* `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`

## Kernel

* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/README.md`
* `../../04-Platform/Annotation/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Search/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/MCP.md`
* `../../05-Integration/ExternalServices/Webhooks.md`
* `../../05-Integration/PluginSDK/Capabilities.md`
* `../../05-Integration/PublicAPI/APIConventions.md`
* `../../05-Integration/PublicAPI/Authentication.md`
* `../../05-Integration/PublicAPI/GraphQL.md`
* `../../05-Integration/PublicAPI/LocalAPI.md`
* `../../05-Integration/PublicAPI/REST.md`

## Foundation

* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 145. Status

**Approved**

This document defines the Command execution semantics of KnowledgeOS.

Commands express explicit intent to change state.

They do not represent completed facts.

Each Command is immutable, transport-independent and handled by one authoritative Handler owned by the responsible capability.

Commands are structurally validated, authorized, checked against Domain invariants and executed through explicit concurrency and transaction boundaries.

Completion is not reported before canonical commit.

Events describing successful facts are not published before commit.

Synchronous, asynchronous and deferred Commands remain distinct.

Long-running Commands expose stable Operation Identity and observable lifecycle.

Retry preserves the same Command and logical intent.

Duplicate delivery does not create duplicate effects.

Stale Commands never overwrite current state silently.

Cancellation before commit prevents authoritative mutation where possible.

Cancellation after commit does not reverse committed state automatically.

Plugins, MCP, Webhooks, Public APIs, Local APIs, Workflows and schedulers all enter mutation through the same governed Command semantics.

Commands never expose raw Domain entities, infrastructure objects or Provider credentials.

KnowledgeOS therefore uses Commands as the single explicit execution language for requesting controlled state change without allowing transports, external callers or runtime timing to bypass architectural ownership and canonical invariants.
