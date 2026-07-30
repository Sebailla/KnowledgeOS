
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Kernel
**Path:** `00-Architecture/03-Kernel/`
**Document:** Kernel Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the mandatory operational rules for every human or AI agent working inside:

```text
00-Architecture/03-Kernel/
```

Its purpose is to preserve the neutrality, stability and architectural boundaries of the KnowledgeOS Kernel.

The Kernel provides generic execution mechanisms used by higher architectural layers.

It does not define product meaning.

It does not own Domain semantics.

It does not implement Platform Engine business behavior.

This document refines:

* the root `AGENTS.md`;
* `00-Architecture/AGENTS.md`.

It shall not replace the normative Kernel documentation.

---

# 2. Scope

These instructions apply to:

```text
03-Kernel/
├── CommandBus.md
├── Configuration.md
├── DependencyInjection.md
├── EventBus.md
├── JobSystem.md
├── KernelArchitecture.md
├── Logging.md
├── Observability.md
├── QueryBus.md
├── Scheduler.md
└── WorkflowEngine.md
```

They govern work involving:

* command dispatch;
* query dispatch;
* event publication;
* event subscription;
* workflow coordination;
* background jobs;
* scheduling;
* dependency resolution;
* configuration;
* logging;
* observability;
* Kernel lifecycle;
* Kernel contracts;
* Kernel execution guarantees.

---

# 3. Kernel Authority

The Kernel is the architectural authority for generic execution mechanisms shared across KnowledgeOS.

It defines how operations are coordinated.

It does not define what product concepts mean.

The Kernel may know about:

* commands;
* queries;
* events;
* handlers;
* workflows;
* jobs;
* schedules;
* execution contexts;
* dependencies;
* configuration values;
* logs;
* metrics;
* traces.

The Kernel shall not know about:

* documents;
* annotations;
* libraries;
* search ranking;
* AI models;
* rendering;
* import formats;
* export formats;
* synchronization policies;
* UI navigation;
* application windows;
* user workspaces.

Those concepts belong to Domain, Platform, Integration or Implementation.

---

# 4. Mandatory Reading Order

Before modifying Kernel documentation, read:

1. root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. `00-Architecture/01-Foundation/ArchitecturePrinciples.md`;
4. `00-Architecture/01-Foundation/ArchitectureConstraints.md`;
5. `00-Architecture/01-Foundation/ArchitectureModel.md`;
6. `00-Architecture/01-Foundation/QualityAttributes.md`;
7. `00-Architecture/03-Kernel/KernelArchitecture.md`;
8. the target Kernel document;
9. related Execution documentation;
10. related ADRs;
11. affected Platform documentation;
12. affected implementation documentation.

For broad Kernel changes, also review:

```text
00-Architecture/06-Execution/
00-Architecture/07-ArchitectureViews/ADR/
01-Implementation/
```

---

# 5. Kernel Invariants

Every Kernel change shall preserve the following invariants.

## 5.1 Generic responsibility

Kernel mechanisms shall remain generic and reusable.

## 5.2 Domain neutrality

The Kernel shall not contain Domain semantics.

## 5.3 Platform independence

The Kernel shall not depend on Platform Engines.

## 5.4 Infrastructure independence

Kernel abstractions shall not depend directly on one database, queue, cloud provider, framework or operating system.

## 5.5 Explicit execution

Execution behavior shall be explicit and observable.

## 5.6 Deterministic coordination

Where deterministic behavior is required, ordering and execution rules shall be defined.

## 5.7 Failure transparency

Failures shall be represented explicitly.

They shall not be silently swallowed.

## 5.8 Idempotency support

Kernel mechanisms shall support idempotent execution where retries or duplicate delivery may occur.

## 5.9 Lifecycle control

Kernel-managed operations shall have explicit lifecycle behavior.

## 5.10 Replaceable implementations

Kernel interfaces shall allow implementation replacement without changing higher-level semantics.

---

# 6. Prohibited Kernel Content

Kernel documentation shall not define:

* Knowledge Object rules;
* UDM or DPM structures;
* document identity semantics;
* library acquisition policy;
* synchronization conflict policy;
* annotation behavior;
* search ranking;
* rendering strategy;
* AI provider behavior;
* plugin business rules;
* persistence schemas;
* UI behavior;
* user workflows as product features;
* framework-specific dependency injection configuration;
* vendor-specific messaging semantics.

Kernel documents may define generic mechanisms used to implement these behaviors.

They shall not own the behaviors themselves.

---

# 7. Kernel Architecture

`KernelArchitecture.md` is the authoritative overview of the Kernel.

It shall define:

* Kernel purpose;
* Kernel boundaries;
* Kernel components;
* dependency direction;
* lifecycle;
* public abstractions;
* extension mechanisms;
* failure model;
* observability model;
* execution guarantees.

It shall remain consistent with:

* Command Bus;
* Query Bus;
* Event Bus;
* Workflow Engine;
* Job System;
* Scheduler;
* Configuration;
* Dependency Injection;
* Logging;
* Observability;
* Execution architecture;
* relevant ADRs.

A change to a primary Kernel responsibility requires review of `KernelArchitecture.md`.

---

# 8. Kernel Dependency Direction

The Kernel shall preserve the following dependency rules.

```text
Foundation
    ↓
Domain abstractions where explicitly allowed
    ↓
Kernel contracts
    ↓
Platform use of Kernel mechanisms
    ↓
Implementation adapters
```

The Kernel shall not depend on:

```text
Platform
Integration implementations
Application UI
Infrastructure providers
External services
```

Implementation may provide adapters for Kernel interfaces.

The Kernel shall not require those adapters to define its semantics.

---

# 9. Commands

A command expresses an intention to perform an operation.

Commands may change state.

Commands shall be explicit, immutable after dispatch and serializable where required.

A command definition shall include:

* command identity;
* command name;
* payload;
* metadata;
* issuer or origin where relevant;
* correlation identifier;
* causation identifier;
* creation time;
* idempotency key where required;
* version.

Commands shall not contain hidden dependencies.

---

# 10. Command Bus

The Command Bus routes commands to their designated handlers.

It shall define:

* registration;
* dispatch;
* handler resolution;
* execution context;
* validation;
* authorization hooks where applicable;
* error propagation;
* observability;
* timeout behavior;
* retry interaction;
* idempotency interaction.

The Command Bus shall not define command-specific business policy.

---

# 11. Command Ownership

Every command shall have one authoritative owner.

The owner is normally the module or Engine responsible for the operation.

The Command Bus owns dispatch.

It does not own the meaning of individual commands.

Agents shall not create generic commands such as:

```text
ExecuteAction
ProcessData
HandleRequest
RunOperation
```

unless their semantics are precisely defined and justified.

Command names shall express intent.

Examples:

```text
ImportKnowledgeObject
ScheduleBackgroundJob
CancelWorkflow
RebuildSearchIndex
```

The concrete canonical vocabulary shall remain owned by the relevant architectural module.

---

# 12. Command Handler Rules

A command handler shall:

* handle one command type;
* validate required preconditions;
* execute within an explicit context;
* produce explicit success or failure;
* preserve idempotency where required;
* emit events only after the relevant state transition;
* avoid hidden cross-module access;
* remain observable.

A handler shall not:

* perform unrelated operations;
* silently invoke private behavior in another Engine;
* mutate state outside its responsibility;
* hide failure;
* return partial success without explicit semantics.

---

# 13. Command Execution Results

Command execution shall produce an explicit result.

A result may include:

* success;
* rejection;
* validation failure;
* authorization failure;
* conflict;
* retryable failure;
* terminal failure;
* cancellation;
* timeout.

The result model shall not depend on HTTP status codes or UI messages.

Transport-specific mappings belong in Integration or Implementation.

---

# 14. Queries

A query requests information.

Queries shall not introduce hidden state changes.

A query definition shall include:

* query identity;
* query name;
* parameters;
* metadata where required;
* consistency expectation;
* pagination where relevant;
* version.

Queries shall express information needs, not implementation details.

---

# 15. Query Bus

The Query Bus routes queries to query handlers.

It shall define:

* query registration;
* handler resolution;
* execution context;
* result delivery;
* failure behavior;
* timeout behavior;
* consistency expectations;
* caching interaction;
* observability.

The Query Bus shall not determine business-specific read models.

Those are owned by the relevant module.

---

# 16. Query Handler Rules

A query handler shall:

* handle one query type;
* avoid hidden side effects;
* define consistency expectations;
* return explicit result types;
* enforce access rules where applicable;
* remain observable;
* avoid exposing private implementation structures.

A query shall not be used as a disguised command.

If execution changes state, it shall be modeled as a command or explicit workflow operation.

---

# 17. Query Consistency

Queries shall define the required consistency level where relevant.

Possible consistency expectations may include:

* current authoritative state;
* transactionally consistent state;
* eventually consistent projection;
* cached state;
* snapshot state;
* historical state.

The Kernel provides mechanisms for expressing consistency.

The owning module defines which consistency level is required.

---

# 18. Events

An event represents a fact that has already occurred.

Events shall be immutable after publication.

An event definition shall include:

* event identity;
* event type;
* payload;
* occurrence time;
* publication time where relevant;
* source;
* correlation identifier;
* causation identifier;
* version;
* ordering information where required;
* provenance where relevant.

Events shall use past-tense semantics.

Examples:

```text
KnowledgeObjectImported
WorkflowCompleted
BackgroundJobFailed
ConfigurationChanged
```

---

# 19. Event Bus

The Event Bus distributes events to interested subscribers.

It shall define:

* event publication;
* subscription;
* delivery semantics;
* ordering semantics;
* duplicate delivery behavior;
* retry behavior;
* subscriber isolation;
* failure handling;
* observability;
* compatibility;
* replay behavior where supported.

The Event Bus shall not guarantee semantics that the underlying implementation cannot preserve.

Guarantees shall be explicit.

---

# 20. Event Delivery Guarantees

The Event Bus documentation shall define supported delivery guarantees.

Possible guarantees include:

* at-most-once;
* at-least-once;
* effectively-once through idempotency;
* ordered delivery within a defined scope;
* unordered delivery;
* replayable delivery.

The repository shall not claim exactly-once processing without defining the complete mechanism that provides it.

Duplicate delivery shall be assumed where at-least-once delivery is used.

Subscribers shall be idempotent where required.

---

# 21. Event Ordering

Ordering scope shall be explicit.

Potential scopes include:

* global ordering;
* aggregate ordering;
* workflow ordering;
* partition ordering;
* source ordering;
* no ordering guarantee.

Global ordering shall not be assumed by default.

Ordering mechanisms shall define:

* sequence source;
* comparison rules;
* missing sequence behavior;
* duplicate sequence behavior;
* replay interaction;
* synchronization interaction.

---

# 22. Event Subscribers

An event subscriber shall:

* declare supported event types;
* validate event version;
* handle duplicates safely where required;
* remain isolated from other subscribers;
* report failure explicitly;
* preserve ordering assumptions;
* avoid direct access to publisher internals;
* remain observable.

One subscriber failure shall not silently corrupt unrelated subscriber execution.

---

# 23. Event Versioning

Events are contracts.

Event evolution shall preserve compatibility.

Event changes shall be classified as:

* additive;
* compatible;
* deprecated;
* breaking.

Breaking changes require:

* new event version;
* migration strategy;
* subscriber compatibility analysis;
* replay analysis;
* persistence analysis;
* contract tests.

Historical events shall remain interpretable for the required retention period.

---

# 24. Commands, Queries and Events Separation

Commands, queries and events have distinct purposes.

```text
Command
    Intent to change state

Query
    Request for information

Event
    Fact that state changed
```

Agents shall not blur these roles.

A command shall not be presented as an event.

An event shall not request behavior.

A query shall not silently change state.

---

# 25. Workflow Engine

The Workflow Engine coordinates multi-step operations.

A workflow shall be used when an operation requires:

* multiple stages;
* multiple modules;
* durable state;
* retries;
* compensation;
* recovery;
* waiting;
* asynchronous execution;
* explicit progression.

A workflow shall not be introduced for a simple local function call.

---

# 26. Workflow Definition

Every workflow shall define:

* workflow identity;
* workflow type;
* initial state;
* valid states;
* valid transitions;
* commands or triggers;
* emitted events;
* completion state;
* failure states;
* cancellation behavior;
* retry behavior;
* compensation behavior;
* persistence;
* observability;
* version.

Workflow state shall be explicit.

It shall not be inferred solely from log history.

---

# 27. Workflow Ownership

Every workflow shall have one authoritative owner.

The owner defines:

* business progression;
* valid transitions;
* completion criteria;
* compensation rules.

The Kernel owns workflow execution mechanisms.

It does not own product-specific workflow meaning.

A Library workflow remains owned by the Library capability.

An Import workflow remains owned by the Import capability.

The Kernel provides the mechanism that executes them.

---

# 28. Workflow State Machine

Workflow transitions shall be valid only when explicitly defined.

A transition shall specify:

* source state;
* trigger;
* preconditions;
* target state;
* side effects;
* emitted events;
* failure behavior;
* compensation where applicable.

Invalid transitions shall produce explicit errors.

They shall not be silently ignored.

---

# 29. Workflow Persistence

Durable workflows shall define persistence requirements.

These may include:

* current state;
* transition history;
* workflow version;
* execution context;
* pending operations;
* retry count;
* last error;
* deadlines;
* compensation state.

Workflow persistence is an implementation concern.

Workflow persistence semantics are an architectural concern.

---

# 30. Workflow Recovery

Recovery shall define behavior after:

* process restart;
* system crash;
* network loss;
* dependency failure;
* timeout;
* partial completion;
* duplicated trigger;
* corrupted workflow state.

A recoverable workflow shall be able to determine:

* what completed;
* what remains;
* what may be repeated;
* what must be compensated;
* whether human intervention is required.

---

# 31. Workflow Compensation

Compensation is not equivalent to transaction rollback.

A compensation action shall:

* be explicit;
* have its own failure behavior;
* be idempotent where required;
* preserve auditability;
* avoid hiding irreversible effects.

Not every operation is compensatable.

Irreversible effects shall be documented before execution.

---

# 32. Job System

The Job System manages background or deferred units of work.

A job may represent:

* document processing;
* indexing;
* export generation;
* synchronization work;
* cleanup;
* analysis;
* maintenance;
* scheduled processing.

The Job System owns generic job execution.

The owning module defines job-specific meaning.

---

# 33. Job Definition

Every job shall define:

* job identity;
* job type;
* owner;
* payload;
* priority;
* creation time;
* scheduled time where relevant;
* execution constraints;
* retry policy;
* timeout;
* cancellation behavior;
* idempotency behavior;
* resource expectations;
* result;
* failure classification;
* version.

A job shall not rely on hidden global state.

---

# 34. Job Lifecycle

The Job System shall define canonical lifecycle states.

Possible states may include:

```text
Created
Queued
Scheduled
Running
Succeeded
Failed
RetryPending
Cancelled
TimedOut
DeadLettered
```

The precise approved states shall remain defined by `JobSystem.md`.

Transitions shall be explicit and validated.

---

# 35. Job Retry Rules

Retries shall define:

* retryable errors;
* non-retryable errors;
* maximum attempts;
* delay;
* backoff;
* jitter where relevant;
* idempotency requirements;
* dead-letter behavior;
* observability.

Retries shall not be infinite by default.

Retrying shall not create duplicate side effects.

---

# 36. Job Cancellation

Cancellation shall define:

* when cancellation is allowed;
* whether cancellation is cooperative;
* cancellation timeout;
* cleanup behavior;
* partial-result behavior;
* emitted events;
* terminal state.

Cancellation shall not be represented as generic failure.

---

# 37. Job Priority

Priority semantics shall be explicit.

Priority shall not create starvation.

The Job System shall define:

* priority levels;
* scheduling effect;
* fairness;
* aging where applicable;
* resource interaction.

Product modules may request priority.

They shall not directly control the internal scheduler.

---

# 38. Scheduler

The Scheduler determines when eligible work may execute.

It may schedule:

* jobs;
* maintenance operations;
* recurring tasks;
* delayed commands;
* workflow wakeups.

The Scheduler shall remain a generic mechanism.

It shall not own product-specific schedules.

---

# 39. Scheduling Rules

A scheduled operation shall define:

* schedule identity;
* owner;
* target operation;
* trigger time;
* recurrence;
* timezone where relevant;
* missed-run behavior;
* overlap behavior;
* cancellation;
* expiration;
* priority;
* observability.

Time semantics shall be explicit.

Local time and UTC shall not be mixed ambiguously.

---

# 40. Recurring Schedules

Recurring schedules shall define:

* recurrence rule;
* start;
* optional end;
* timezone;
* daylight-saving behavior;
* missed execution behavior;
* concurrent execution behavior;
* schedule version.

Missed executions may be:

* skipped;
* executed once;
* executed for each missed occurrence;
* coalesced.

The chosen behavior shall be explicit.

---

# 41. Scheduling and Idempotency

Scheduled operations may execute more than once because of:

* restart;
* failover;
* duplicate trigger;
* clock adjustment;
* retry;
* distributed coordination.

Scheduled work shall therefore define idempotency where duplicate execution is possible.

---

# 42. Configuration

Configuration defines values that influence system operation without changing Domain meaning.

Configuration may include:

* feature activation;
* execution limits;
* timeout values;
* provider selection;
* resource budgets;
* logging levels;
* operational policies.

Configuration shall not become a hidden substitute for architecture.

---

# 43. Configuration Ownership

Every configuration value shall define:

* owner;
* purpose;
* type;
* default;
* valid range;
* source;
* mutability;
* sensitivity;
* restart requirements;
* validation;
* observability;
* deprecation behavior.

Configuration names shall use canonical repository vocabulary.

---

# 44. Configuration Sources

Configuration sources may include:

* built-in defaults;
* repository configuration;
* environment variables;
* local application settings;
* user settings;
* deployment configuration;
* secure secret stores.

Precedence shall be explicit.

A higher-precedence source shall not silently accept invalid values.

---

# 45. Configuration Validation

Configuration shall be validated before dependent mechanisms begin execution.

Invalid configuration shall produce:

* explicit diagnostic information;
* affected setting;
* expected type or range;
* source;
* severity;
* recoverability.

Critical invalid configuration shall prevent unsafe startup.

---

# 46. Dynamic Configuration

Dynamically mutable configuration shall define:

* allowed changes;
* propagation;
* consistency;
* atomicity;
* rollback;
* observability;
* auditability;
* effect on active work.

Not all configuration shall be dynamically mutable.

---

# 47. Secrets

Secrets are not ordinary configuration.

Secrets shall:

* remain outside version control;
* be retrieved through approved secure mechanisms;
* avoid appearing in logs;
* have explicit ownership;
* support rotation;
* define failure behavior.

Kernel documentation may define secret abstraction requirements.

Secret storage implementation belongs to Infrastructure or Implementation.

---

# 48. Dependency Injection

Dependency Injection provides controlled construction and substitution of dependencies.

It shall support:

* explicit dependencies;
* lifecycle management;
* replaceable implementations;
* testing;
* composition;
* boundary enforcement.

Dependency Injection shall not conceal invalid architecture.

---

# 49. Dependency Registration

Every registered dependency shall define:

* contract;
* implementation;
* lifecycle;
* scope;
* owner;
* initialization requirements;
* disposal requirements;
* failure behavior.

Registrations shall not use ambiguous global names.

---

# 50. Dependency Lifecycles

Supported lifecycle semantics shall be explicit.

Examples may include:

* transient;
* scoped;
* singleton;
* application;
* workflow;
* request;
* job.

A dependency shall not outlive the resources it owns.

A shorter-lived dependency shall not be captured accidentally by a longer-lived dependency.

---

# 51. Dependency Resolution

Resolution shall be explicit and deterministic.

The Kernel shall detect:

* missing dependencies;
* duplicate registrations;
* circular dependencies;
* incompatible lifecycles;
* initialization failure.

Service locator patterns shall not replace explicit dependency declaration.

---

# 52. Dependency Boundaries

Dependency Injection shall reinforce architecture boundaries.

It shall not allow:

* Domain to resolve Infrastructure directly;
* Kernel to resolve Platform implementations as architectural dependencies;
* one Engine to resolve another Engine's private internals;
* global mutable state to masquerade as a service;
* runtime registration to bypass approved contracts.

---

# 53. Logging

Logging records operationally relevant events.

Logging shall support diagnosis without becoming part of business control flow.

Logs shall be:

* structured;
* categorized;
* timestamped;
* correlated;
* severity-classified;
* privacy-aware;
* implementation-neutral at the architectural level.

---

# 54. Log Levels

Log levels shall have consistent meaning.

Typical levels may include:

* Trace;
* Debug;
* Information;
* Warning;
* Error;
* Critical.

The precise approved levels shall remain defined by `Logging.md`.

A normal expected condition shall not be logged as an error.

A serious failure shall not be hidden at debug level.

---

# 55. Structured Logging

Logs should use structured fields rather than unstructured concatenated text.

Relevant fields may include:

* timestamp;
* severity;
* component;
* operation;
* correlation identifier;
* causation identifier;
* workflow identifier;
* job identifier;
* error code;
* duration;
* outcome.

Sensitive content shall not be included.

---

# 56. Logging Prohibitions

Logs shall not contain:

* passwords;
* access tokens;
* secret keys;
* private document content;
* full personal annotations;
* unnecessary user data;
* raw provider payloads containing sensitive information;
* biometric or medical information unless explicitly governed.

Diagnostics shall prefer identifiers and redacted metadata.

---

# 57. Logging and Errors

Logging an error does not handle the error.

An error shall still be:

* returned;
* propagated;
* classified;
* retried;
* compensated;
* converted;
* or explicitly terminated.

The appropriate action depends on the owning mechanism.

---

# 58. Observability

Observability provides enough evidence to understand system behavior.

It includes:

* logs;
* metrics;
* traces;
* health signals;
* diagnostic context;
* correlation.

Observability shall not expose user knowledge unnecessarily.

---

# 59. Metrics

Metrics shall define:

* name;
* purpose;
* type;
* unit;
* dimensions;
* aggregation;
* ownership;
* expected range;
* privacy considerations.

High-cardinality identifiers shall not be used carelessly as metric dimensions.

---

# 60. Tracing

Tracing shall represent execution across:

* commands;
* queries;
* events;
* workflows;
* jobs;
* integrations;
* Engine boundaries.

Traces shall use:

* trace identifiers;
* span identifiers;
* correlation identifiers;
* parent relationships;
* timing;
* outcome;
* error classification.

Tracing shall not require exposing full payloads.

---

# 61. Correlation and Causation

Correlation identifies operations belonging to one broader execution.

Causation identifies which operation triggered another.

Commands, events, jobs and workflows should preserve these identifiers where relevant.

Agents shall not use one identifier ambiguously for both concepts.

---

# 62. Health Signals

Health reporting shall distinguish:

* liveness;
* readiness;
* dependency health;
* degraded operation;
* capacity pressure;
* configuration failure.

A component may be alive but not ready.

A dependency failure shall not always imply total system failure.

---

# 63. Kernel Error Model

Kernel errors shall represent mechanism-level failures.

Examples include:

* handler not registered;
* dependency resolution failed;
* invalid workflow transition;
* job timed out;
* schedule invalid;
* event version unsupported;
* configuration invalid;
* execution cancelled;
* queue unavailable.

Kernel errors shall not redefine Domain errors.

---

# 64. Error Classification

Errors shall be classified where relevant as:

* validation;
* authorization;
* conflict;
* transient;
* retryable;
* permanent;
* timeout;
* cancellation;
* dependency failure;
* invariant violation;
* corruption.

Classification shall drive handling behavior.

String matching shall not be the primary error-classification mechanism.

---

# 65. Timeouts

Every potentially blocking or remote operation shall define timeout behavior where appropriate.

Timeouts shall specify:

* scope;
* default;
* configurability;
* cancellation interaction;
* retry interaction;
* error classification;
* observability.

A timeout does not prove that the underlying operation did not complete.

Idempotency shall account for uncertain outcomes.

---

# 66. Cancellation

Cancellation shall propagate through execution contexts where supported.

Cancellation shall be:

* explicit;
* cooperative;
* observable;
* distinguishable from failure;
* bounded by cleanup rules.

Cancellation shall not leave durable state in an undefined condition.

---

# 67. Execution Context

Kernel operations shall execute within an explicit execution context where required.

An execution context may include:

* operation identity;
* actor;
* permissions;
* correlation;
* causation;
* cancellation;
* deadlines;
* locale;
* timezone;
* configuration snapshot;
* trace context.

The context shall not become an uncontrolled container for arbitrary mutable state.

---

# 68. Context Propagation

Context propagation shall define which values cross:

* command boundaries;
* query boundaries;
* event boundaries;
* workflow boundaries;
* job boundaries;
* process boundaries;
* network boundaries.

Sensitive context shall not propagate automatically.

Only required context shall be carried forward.

---

# 69. Concurrency

Kernel mechanisms shall remain consistent with:

```text
00-Architecture/06-Execution/Concurrency/
```

Kernel documents shall not independently redefine:

* locking;
* transaction semantics;
* ordering;
* retry behavior;
* parallelism;
* resource ownership.

Kernel mechanisms shall expose the abstractions required to implement approved execution rules.

---

# 70. Transactions

The Kernel may define generic transaction coordination abstractions.

It shall not assume one database transaction implementation.

Transaction boundaries shall be owned by the operation that requires atomicity.

Distributed operations shall not be presented as one atomic transaction unless an approved mechanism guarantees it.

---

# 71. Idempotency

Kernel mechanisms shall support idempotency through explicit concepts.

An idempotent operation shall define:

* idempotency key;
* scope;
* owner;
* persistence duration;
* duplicate response;
* conflict behavior;
* side-effect handling.

Idempotency shall not be inferred solely from method names.

---

# 72. Determinism

Kernel execution shall define deterministic behavior where required.

Potential sources of nondeterminism include:

* unordered handlers;
* current time;
* random values;
* concurrency;
* provider responses;
* external state;
* retries;
* duplicated events.

Deterministic workflows shall control or record such inputs.

---

# 73. Resource Management

Kernel-managed execution shall define:

* resource acquisition;
* resource limits;
* ownership;
* cleanup;
* cancellation;
* disposal;
* pressure behavior;
* leak detection.

Jobs and workflows shall not hold resources indefinitely without explicit design.

---

# 74. Backpressure

Asynchronous mechanisms shall define behavior when incoming work exceeds processing capacity.

Possible responses include:

* queueing;
* rejection;
* throttling;
* prioritization;
* coalescing;
* degradation.

Unbounded queues are prohibited unless explicitly justified and bounded by external guarantees.

---

# 75. Kernel Extension

New Kernel mechanisms require strong justification.

A new mechanism shall be introduced only when:

* the responsibility is generic;
* it is needed by multiple modules or is foundational;
* it does not already exist;
* it cannot be placed appropriately in Execution or Platform;
* its contract can remain implementation-neutral;
* lifecycle and failure semantics are defined.

A utility class does not automatically belong in the Kernel.

---

# 76. New Kernel Component Checklist

Before introducing a Kernel component, define:

* purpose;
* scope;
* owner;
* public contract;
* dependency direction;
* lifecycle;
* configuration;
* failure model;
* concurrency behavior;
* idempotency behavior;
* observability;
* security;
* testing;
* implementation adapters;
* compatibility;
* migration;
* related ADR.

---

# 77. Cross-Kernel Consistency

Changes to one Kernel mechanism may affect others.

## Command Bus change

Review:

* handlers;
* execution context;
* transactions;
* events;
* workflows;
* observability;
* implementation contracts.

## Event Bus change

Review:

* ordering;
* retries;
* idempotency;
* workflows;
* job triggers;
* synchronization;
* event ADR;
* compatibility.

## Workflow Engine change

Review:

* Job System;
* Scheduler;
* Event Bus;
* persistence;
* recovery;
* execution lifecycle;
* observability.

## Job System change

Review:

* Scheduler;
* retries;
* resource management;
* background runtime;
* checkpointing;
* metrics;
* recovery.

## Configuration change

Review:

* dependency injection;
* startup lifecycle;
* runtime reload;
* security;
* observability;
* operations.

---

# 78. Cross-Layer Impact

Kernel changes frequently affect:

```text
00-Architecture/04-Platform/
00-Architecture/05-Integration/
00-Architecture/06-Execution/
01-Implementation/
```

Agents shall identify:

* affected Engines;
* affected contracts;
* affected adapters;
* affected workflows;
* affected job handlers;
* affected deployment configuration;
* affected tests;
* affected operational procedures.

---

# 79. ADR Impact

Kernel changes may require ADR review when they alter:

* command architecture;
* query architecture;
* event architecture;
* execution guarantees;
* workflow persistence;
* scheduling semantics;
* dependency injection model;
* configuration precedence;
* observability architecture;
* failure propagation.

ADR-011 Event Architecture shall be reviewed for relevant event changes.

A new ADR shall be created when a durable architectural decision is introduced.

---

# 80. Implementation Mapping

Kernel architecture shall map to implementation contracts without becoming implementation-specific.

Implementation documentation shall define:

* concrete interfaces;
* language-specific types;
* adapters;
* persistence;
* queue technology;
* scheduler technology;
* dependency injection container;
* logging backend;
* tracing backend.

Kernel documentation defines the required behavior those implementations must preserve.

---

# 81. Testing Requirements

Kernel mechanisms require strong automated validation.

Applicable tests may include:

* command dispatch tests;
* query dispatch tests;
* event delivery tests;
* event ordering tests;
* duplicate delivery tests;
* workflow transition tests;
* workflow recovery tests;
* job retry tests;
* cancellation tests;
* scheduler tests;
* configuration validation tests;
* dependency cycle tests;
* lifecycle tests;
* logging tests;
* trace propagation tests;
* concurrency tests;
* performance tests.

Tests shall verify contracts and execution guarantees.

---

# 82. Contract Testing

Public Kernel abstractions shall have contract tests.

Every implementation adapter shall pass the same contract suite where practical.

Examples include:

* Event Bus adapters;
* Job Queue adapters;
* Scheduler adapters;
* configuration providers;
* dependency containers;
* logging providers;
* tracing providers.

An adapter shall not weaken the architectural contract.

---

# 83. Failure Testing

Kernel testing shall include failure scenarios.

Examples:

* handler unavailable;
* dependency missing;
* event duplicated;
* event out of order;
* job interrupted;
* workflow restarted;
* configuration malformed;
* schedule missed;
* cancellation during execution;
* timeout after side effect;
* logging backend unavailable;
* trace exporter unavailable.

Failure behavior is part of the architecture.

---

# 84. Performance Testing

Kernel performance tests shall measure relevant mechanisms without relying solely on synthetic microbenchmarks.

Potential measurements include:

* dispatch latency;
* event throughput;
* queue depth;
* workflow progression time;
* scheduler delay;
* job startup latency;
* memory usage;
* handler concurrency;
* tracing overhead.

Performance expectations shall relate to Quality Attributes.

---

# 85. Security

Kernel mechanisms shall support security boundaries without owning product authorization policy.

Relevant concerns include:

* execution identity;
* permission context;
* command authorization hooks;
* query access control hooks;
* secret-safe configuration;
* log redaction;
* plugin isolation;
* untrusted event payload validation;
* dependency registration protection.

Security-critical context shall not be mutable by untrusted handlers.

---

# 86. Privacy

Kernel observability and execution metadata shall avoid exposing personal knowledge.

Payload logging shall be disabled by default unless explicitly approved.

Command, event and query diagnostics should prefer:

* type;
* identifier;
* size;
* timing;
* outcome;
* redacted metadata.

They should not include full user content.

---

# 87. Documentation Rules

Every Kernel document shall define, where applicable:

```text
Purpose
Scope
Responsibilities
Non-Responsibilities
Contracts
Lifecycle
Execution Semantics
Concurrency
Failure Behavior
Retries
Idempotency
Configuration
Security
Observability
Validation
Related Documents
Related ADRs
```

A document shall not repeat the full Kernel architecture.

It shall focus on one mechanism.

---

# 88. Kernel Vocabulary

Canonical terms shall be used consistently.

Examples include:

* Command;
* Command Handler;
* Command Bus;
* Query;
* Query Handler;
* Query Bus;
* Event;
* Event Subscriber;
* Event Bus;
* Workflow;
* Workflow Instance;
* Job;
* Scheduler;
* Execution Context;
* Correlation Identifier;
* Causation Identifier;
* Retry Policy;
* Idempotency Key.

Agents shall not introduce synonyms casually.

For example:

* do not alternate between `Task`, `Job` and `Work Item` without defined differences;
* do not alternate between `Event Handler`, `Listener` and `Subscriber` without defined semantics;
* do not use `Request` when `Command` or `Query` is intended.

---

# 89. Review Checklist

Before approving a Kernel change, verify:

* the responsibility belongs in Kernel;
* no Domain semantics were introduced;
* no Platform dependency was introduced;
* the mechanism is generic;
* contracts are explicit;
* lifecycle is explicit;
* failure behavior is explicit;
* concurrency behavior is explicit;
* idempotency is addressed;
* retries are addressed;
* cancellation is addressed;
* timeouts are addressed;
* observability is addressed;
* privacy is preserved;
* configuration is validated;
* implementation adapters remain replaceable;
* affected Execution documents were reviewed;
* affected Platform Engines were identified;
* affected ADRs were reviewed;
* tests are defined.

---

# 90. Minimum Change Rule

Agents shall make the smallest complete Kernel change.

They shall not:

* move product logic into Kernel;
* create abstractions for hypothetical future needs;
* add generic wrappers without architectural value;
* weaken explicit contracts;
* hide failure behind default behavior;
* add global mutable state;
* introduce direct Engine dependencies;
* bind Kernel semantics to one framework;
* create duplicate execution mechanisms;
* mix commands, queries and events;
* create workflows for simple operations;
* create unbounded queues without explicit approval.

---

# 91. Kernel Completion Criteria

Kernel work is complete only when:

* the mechanism has a clear generic responsibility;
* boundaries are explicit;
* dependencies follow approved direction;
* lifecycle is documented;
* execution semantics are documented;
* failure behavior is documented;
* retry behavior is documented;
* idempotency is documented where required;
* cancellation is documented;
* timeout behavior is documented;
* configuration is documented;
* observability is documented;
* security and privacy were reviewed;
* relevant Execution documents remain consistent;
* affected Platform modules were identified;
* implementation mappings were identified;
* tests were defined;
* ADR impact was resolved;
* no unresolved contradiction remains.

---

# 92. Agent Reporting

After Kernel work, the agent shall report:

* the Kernel objective;
* the mechanism changed;
* files reviewed;
* files created;
* files modified;
* dependency impact;
* lifecycle impact;
* command impact;
* query impact;
* event impact;
* workflow impact;
* job impact;
* scheduler impact;
* configuration impact;
* observability impact;
* Execution impact;
* Platform impact;
* implementation impact;
* ADR impact;
* validation performed;
* unresolved risks.

---

# 93. Final Rule

The Kernel is the execution foundation of KnowledgeOS.

It shall remain small, generic, explicit and stable.

Before adding a mechanism, verify that it is truly cross-cutting.

Before adding an abstraction, define the contract it protects.

Before dispatching work, define lifecycle and failure.

Before retrying work, define idempotency.

Before publishing events, define ordering and compatibility.

Before introducing global behavior, prove that it belongs in the Kernel.

The Kernel enables the system.

It does not define the product.

---

# End of `00-Architecture/03-Kernel/AGENTS.md`
