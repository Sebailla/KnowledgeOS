# AGENTS.md

**Project:** KnowledgeOS
**Area:** Execution
**Path:** `00-Architecture/06-Execution/`
**Document:** Execution Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the execution architecture of KnowledgeOS.

Execution governs **how** the system runs.

It defines the runtime guarantees that every implementation shall preserve regardless of:

* programming language;
* operating system;
* deployment model;
* persistence technology;
* UI framework;
* AI provider;
* synchronization transport.

Execution is independent from business functionality.

Its responsibility is ensuring that the entire platform behaves predictably under normal and abnormal operating conditions.

---

# 2. Scope

These rules apply to every runtime component of KnowledgeOS, including:

```text
Kernel
Platform Engines
Integration
Desktop
Mobile
Web
Background Workers
Plugins
Synchronization
AI execution
Import
Export
Rendering
Search
```

Execution governs:

* concurrency
* scheduling
* runtime
* synchronization execution
* retry
* recovery
* ordering
* reliability
* performance
* memory
* resource usage
* fault tolerance
* observability

---

# 3. Execution Authority

Execution is the architectural authority for runtime behavior.

Execution owns:

* execution semantics
* concurrency rules
* deterministic behavior
* retries
* timeout behavior
* cancellation
* ordering
* scheduling
* recovery
* checkpoints
* runtime state
* resource ownership
* runtime metrics

Execution **does not own**

* document semantics
* Domain models
* Engine responsibilities
* Provider implementations
* storage technology
* UI behavior

---

# 4. Reading Order

Before modifying Execution documentation every agent shall read:

1. Root AGENTS.md
2. 00-Architecture/AGENTS.md
3. Foundation
4. Domain
5. Kernel
6. Platform
7. Integration
8. Execution README
9. affected ADRs
10. implementation mapping

Execution decisions affect nearly every architectural layer.

---

# 5. Execution Principles

Execution shall preserve:

* deterministic behavior
* reproducibility
* idempotency
* fault isolation
* graceful degradation
* recoverability
* bounded resource usage
* explicit ownership
* explicit failures
* predictable ordering

Execution shall never depend on undefined runtime behavior.

---

# 6. Runtime Model

KnowledgeOS executes as a collection of cooperating execution contexts.

Typical execution contexts include:

```text
UI Thread

Background Job

Workflow Instance

Synchronization Session

Import Session

Export Session

Search Task

AI Task

Plugin Task
```

Each execution context owns:

* lifecycle
* resources
* cancellation
* errors
* metrics
* tracing
* scheduling

Execution contexts are isolated.

They communicate only through approved architectural mechanisms.

---

# 7. Runtime Invariants

Every execution context shall satisfy the following invariants.

## Isolation

Contexts shall not modify another context's internal state.

---

## Ownership

Resources always have one owner.

Ownership shall be explicit.

---

## Cancellation

Every long-running operation shall support cancellation whenever technically possible.

---

## Visibility

Execution state shall always be observable.

Hidden background work is prohibited.

---

## Recoverability

Recoverable work shall define recovery procedures.

---

## Repeatability

Where required by architecture the same input shall produce the same result.

---

## Boundedness

Execution shall have bounded:

* memory
* CPU
* queues
* storage
* retries

Unlimited growth is prohibited.

---

# 8. Execution Context

Every execution context shall define:

* identifier
* owner
* parent context
* creation time
* cancellation token
* correlation identifier
* causation identifier
* configuration snapshot
* security context
* trace identifier

Execution contexts shall not contain arbitrary mutable global state.

---

# 9. Context Lifecycle

Every context shall follow an explicit lifecycle.

```text
Created

↓

Initialized

↓

Running

↓

Waiting

↓

Completed

↓

Disposed
```

Additional states may include:

* Failed
* Cancelled
* Recovering
* Suspended

The lifecycle shall be explicit.

Implicit transitions are prohibited.

---

# 10. Context Ownership

One component owns each execution context.

Possible owners include:

* Workflow Engine
* Job System
* Scheduler
* UI
* Synchronization Engine
* Import Engine
* Plugin Engine

Ownership shall never migrate implicitly.

---

# 11. Context Communication

Execution contexts communicate through:

* Commands
* Queries
* Events
* Workflows

They shall never communicate through:

* shared mutable globals
* hidden callbacks
* undocumented singleton state

---

# 12. Execution State

Execution distinguishes:

* transient state
* durable state
* cached state
* derived state
* checkpoint state

Each state category has different recovery rules.

Execution shall not confuse them.

---

# 13. Execution Metadata

Every execution shall maintain metadata when appropriate.

Examples:

* duration
* retries
* CPU time
* memory usage
* queue delay
* waiting time
* execution priority
* cancellation reason
* completion reason

Execution metadata is operational.

It shall not become Domain data.

---

# 14. Resource Ownership

Every runtime resource has exactly one owner.

Resources include:

* memory
* file handles
* network sockets
* GPU
* AI contexts
* database sessions
* locks
* transactions

Shared ownership is prohibited unless explicitly documented.

---

# 15. Resource Lifetime

Resources shall define:

* acquisition
* ownership
* release
* cleanup
* failure cleanup
* cancellation cleanup

Resources shall never outlive their owner.

---

# 16. Resource Leaks

Execution shall actively prevent:

* memory leaks
* descriptor leaks
* transaction leaks
* orphan workflows
* orphan jobs
* orphan locks
* orphan synchronization sessions

Leak detection shall be observable.

---

# 17. Scheduling Overview

Execution scheduling determines **when** work may execute.

Scheduling shall define:

* eligibility
* priority
* fairness
* starvation prevention
* deadlines
* resource constraints

Scheduling policy belongs to Execution.

Business priority belongs to Platform.

---

# 18. Scheduling Principles

Scheduling shall preserve:

* fairness
* determinism where required
* bounded latency
* cancellation
* priority inversion avoidance
* starvation prevention

Scheduling decisions shall be reproducible whenever practical.

---

# 19. Runtime Priorities

Priority shall influence execution order.

Priority shall never modify:

* ownership
* consistency
* correctness
* authorization

Higher priority shall not violate architectural guarantees.

---

# 20. Final Rule (Part I)

Execution exists to guarantee that KnowledgeOS behaves predictably.

Business logic may evolve.

Providers may change.

Platforms may change.

Runtime guarantees shall remain stable.

Every execution rule shall improve:

* correctness
* recoverability
* observability
* determinism
* reliability

without violating architectural boundaries.

---

# 21. Concurrency

Concurrency defines how multiple execution contexts may progress simultaneously.

KnowledgeOS shall assume that concurrent execution is the normal operating model.

Concurrency may exist between:

* UI interactions
* Background jobs
* Synchronization sessions
* AI requests
* Imports
* Exports
* Plugins
* Search indexing
* Rendering
* Library updates

Every concurrent operation shall define:

* ownership
* isolation
* synchronization points
* visibility
* completion semantics

Concurrency shall never rely on undefined implementation behavior.

---

# 22. Concurrency Invariants

Concurrent execution shall preserve:

* data integrity
* stable identity
* deterministic state transitions
* explicit ownership
* recoverability
* isolation

Concurrent execution shall never introduce silent corruption.

---

# 23. Parallelism

Parallel execution is an optimization.

Correctness shall never depend upon parallel execution.

Every algorithm shall define:

* sequential semantics
* optional parallel execution
* synchronization barriers
* merge behavior

If parallel execution is unavailable, behavior shall remain correct.

---

# 24. Isolation

Execution contexts shall be isolated.

Isolation includes:

* memory
* mutable state
* transactions
* cancellation
* temporary resources
* execution metadata

Isolation prevents hidden coupling.

---

# 25. Shared State

Shared mutable state is strongly discouraged.

If shared state is unavoidable, documentation shall define:

* owner
* synchronization mechanism
* visibility guarantees
* conflict resolution
* lifetime
* cleanup

Hidden shared state is prohibited.

---

# 26. Synchronization Points

Synchronization points shall be explicit.

Examples:

* workflow transition
* checkpoint creation
* transaction commit
* event publication
* synchronization completion

Synchronization shall never occur implicitly through implementation side effects.

---

# 27. Atomic Operations

Atomicity shall be explicitly defined.

Possible atomic scopes include:

* single object
* object graph
* transaction
* synchronization batch
* workflow transition

Atomicity guarantees shall never be assumed.

---

# 28. Transactions

Execution distinguishes architectural transactions from storage transactions.

Architectural transactions describe logical consistency.

Storage transactions describe implementation mechanisms.

The two concepts shall remain independent.

---

# 29. Transaction Ownership

Every transaction shall define:

* owner
* scope
* beginning
* completion
* rollback policy
* compensation policy
* timeout

Ownership shall be unique.

---

# 30. Transaction Boundaries

Boundaries shall define:

* included operations
* excluded operations
* side effects
* durable state
* emitted events

A transaction boundary shall never be ambiguous.

---

# 31. Compensation

Compensation is not rollback.

Rollback restores previous state.

Compensation creates new operations that restore consistency.

Compensation shall define:

* triggering conditions
* ordering
* retry
* idempotency
* observability

---

# 32. Consistency

Execution shall explicitly document consistency expectations.

Supported consistency models may include:

* Strong
* Transactional
* Snapshot
* Read-after-write
* Eventual

Every operation shall specify the required consistency level.

---

# 33. Consistency Boundaries

Different components may operate with different consistency guarantees.

Examples:

Master Library

→ Strong consistency

Search Index

→ Eventual consistency

Cache

→ Eventual consistency

UI

→ Snapshot consistency

Consistency expectations shall never be inferred.

---

# 34. Visibility

Visibility defines when modifications become observable.

Visibility shall specify:

* owner
* affected contexts
* propagation
* ordering
* synchronization requirements

Visibility delays shall be documented.

---

# 35. Locking

Execution shall minimize locking.

Locks shall define:

* owner
* scope
* duration
* timeout
* deadlock strategy

Locks shall never become architectural coupling.

---

# 36. Deadlocks

Execution shall define strategies for:

* prevention
* detection
* recovery

Deadlock recovery shall be observable.

Silent deadlocks are prohibited.

---

# 37. Optimistic Concurrency

Optimistic concurrency shall define:

* version comparison
* conflict detection
* retry behavior
* merge strategy

Version conflicts shall never overwrite user knowledge silently.

---

# 38. Pessimistic Concurrency

If pessimistic locking is used, documentation shall define:

* acquisition
* release
* ownership
* timeout
* starvation handling

Its usage shall be justified.

---

# 39. Idempotency

Every retryable operation shall define idempotency.

Idempotency shall specify:

* identifier
* owner
* duration
* persistence
* duplicate behavior
* conflict behavior

Idempotency shall be deterministic.

---

# 40. Idempotency Keys

Keys shall remain stable throughout the operation lifetime.

Keys shall not depend on:

* timestamps
* random ordering
* thread identifiers

Stable identifiers are preferred.

---

# 41. Duplicate Processing

Execution shall assume duplicate delivery may occur.

Duplicates may originate from:

* retries
* synchronization
* workflows
* network failures
* provider retries
* event replay

Duplicate execution shall not corrupt state.

---

# 42. Determinism

Execution shall explicitly identify deterministic operations.

Deterministic operations shall produce equivalent results given equivalent inputs.

Sources of nondeterminism shall be documented.

---

# 43. Sources of Nondeterminism

Examples include:

* current time
* random generators
* network latency
* provider responses
* thread scheduling
* AI inference

These sources shall be controlled or recorded when determinism is required.

---

# 44. Ordering

Ordering guarantees shall always define scope.

Possible scopes:

* global
* workflow
* object
* synchronization
* participant
* none

Ordering assumptions shall never be implicit.

---

# 45. Event Ordering

Events shall define:

* publication order
* delivery order
* replay order
* duplicate behavior

Ordering guarantees shall match Event Bus documentation.

---

# 46. Message Processing

Messages shall define:

* ordering
* retries
* acknowledgement
* expiration
* cancellation
* replay

Processing semantics shall remain explicit.

---

# 47. Checkpoints

Long-running execution shall support checkpoints where appropriate.

Checkpoint metadata includes:

* identifier
* owner
* timestamp
* execution state
* progress
* resources
* recovery information

---

# 48. Checkpoint Frequency

Checkpoint creation shall balance:

* durability
* performance
* storage
* recovery time

Checkpoint frequency shall be configurable.

---

# 49. Recovery

Recoverable execution shall define:

* restart
* resume
* replay
* compensation
* validation
* cleanup

Recovery shall preserve architectural invariants.

---

# 50. Recovery Validation

Recovery shall verify:

* integrity
* ownership
* pending work
* completed work
* checkpoints
* version compatibility

Recovery shall never continue from corrupted state.

---

# 51. Partial Recovery

Partial recovery shall define:

* recoverable work
* unrecoverable work
* discarded work
* compensation
* notification

Partial recovery shall remain explicit.

---

# 52. Failure Domains

Execution shall isolate failures.

Possible domains include:

* Workflow
* Job
* Plugin
* Provider
* Synchronization Session
* Import Session
* Export Session

Failure in one domain shall not unnecessarily terminate unrelated domains.

---

# 53. Failure Escalation

Escalation shall define:

* local handling
* Engine handling
* platform handling
* user notification
* termination

Escalation shall be deterministic.

---

# 54. Final Rule (Part II)

Correctness always precedes performance.

Recoverability always precedes optimization.

Determinism always precedes convenience.

Isolation always precedes coupling.

Every concurrent execution shall remain understandable, observable and recoverable.

---


# 55. Resource Management

Execution is responsible for the lifecycle of every runtime resource.

Resources include:

* CPU
* GPU
* memory
* threads
* tasks
* file handles
* sockets
* database connections
* caches
* AI contexts
* synchronization sessions

Every resource shall define:

* owner
* acquisition
* release
* cleanup
* limits
* observability

Resources shall never become ownerless.

---

# 56. Resource Allocation

Allocation policies shall define:

* maximum capacity;
* reservation strategy;
* fairness;
* exhaustion behavior;
* priority interaction;
* cleanup guarantees.

Resource allocation shall remain bounded.

Execution shall never assume unlimited system resources.

---

# 57. Resource Exhaustion

Every execution subsystem shall define behavior when resources are exhausted.

Examples include:

* queue saturation;
* memory exhaustion;
* disk exhaustion;
* thread pool exhaustion;
* GPU exhaustion;
* provider quota exhaustion.

The response may include:

* graceful degradation;
* throttling;
* admission control;
* cancellation;
* retry;
* user notification.

Catastrophic failure shall be the last resort.

---

# 58. Memory Management

Execution shall define memory ownership rather than implementation-specific allocation.

Every component shall document:

* retained objects;
* temporary allocations;
* cache ownership;
* lifecycle;
* release conditions.

Memory shall never become an implicit persistence mechanism.

---

# 59. Memory Limits

Components shall define practical limits for:

* object size;
* document size;
* cache growth;
* concurrent sessions;
* queued operations;
* imported assets;
* AI contexts.

Unbounded memory growth is prohibited.

---

# 60. CPU Scheduling

CPU-intensive work shall avoid degrading interactive user experience.

Execution should distinguish:

* interactive work;
* background work;
* maintenance work;
* indexing;
* synchronization;
* AI processing.

Long-running CPU tasks shall be interruptible whenever technically feasible.

---

# 61. GPU Scheduling

GPU resources shall be treated as shared execution resources.

Execution shall define:

* ownership;
* scheduling;
* concurrency;
* cancellation;
* memory limits;
* fallback behavior.

GPU unavailability shall not prevent core KnowledgeOS functionality.

---

# 62. Background Execution

Background execution shall define:

* ownership;
* scheduling;
* priorities;
* persistence;
* retries;
* cancellation;
* recovery;
* observability.

Background execution shall not become invisible execution.

---

# 63. Cooperative Execution

Whenever possible, long-running tasks shall execute cooperatively.

They should periodically:

* report progress;
* observe cancellation;
* release temporary resources;
* create checkpoints where applicable.

---

# 64. Progress Reporting

Operations longer than the defined threshold shall report progress.

Progress shall distinguish:

* queued;
* starting;
* running;
* waiting;
* completing;
* completed;
* failed;
* cancelled.

Estimated completion time shall be presented only when sufficiently reliable.

---

# 65. Backpressure

Execution shall apply backpressure when downstream capacity is insufficient.

Backpressure strategies may include:

* queue limits;
* throttling;
* temporary rejection;
* delayed scheduling;
* batching.

Backpressure shall protect system stability.

---

# 66. Queue Management

Every queue shall define:

* owner;
* maximum size;
* ordering;
* overflow behavior;
* retry interaction;
* cancellation behavior;
* observability.

Infinite queues are prohibited.

---

# 67. Admission Control

Execution shall reject work that cannot be executed safely.

Admission decisions may consider:

* memory;
* CPU;
* queue depth;
* storage;
* provider availability;
* synchronization load.

Rejected work shall fail explicitly.

---

# 68. Reliability

Reliability defines the probability that execution behaves correctly.

Execution shall maximize reliability through:

* validation;
* retries;
* recovery;
* isolation;
* observability;
* bounded execution.

Reliability shall not depend on user intervention.

---

# 69. Availability

Execution shall distinguish:

* available;
* degraded;
* unavailable.

Availability shall be evaluated independently for each capability.

A degraded AI provider shall not imply that the Library is unavailable.

---

# 70. Graceful Degradation

Unavailable capabilities shall degrade gracefully.

Examples:

* remote AI unavailable → local AI;
* remote synchronization unavailable → offline queue;
* OCR unavailable → manual workflow;
* export unavailable → preserve document.

Degradation shall preserve user work whenever possible.

---

# 71. Fault Tolerance

Execution shall tolerate recoverable faults.

Fault tolerance shall define:

* retry;
* fallback;
* checkpoint;
* recovery;
* redundancy where appropriate;
* observability.

Fault tolerance shall never conceal corruption.

---

# 72. Fault Isolation

Failures shall remain contained.

Possible isolation boundaries include:

* plugin;
* workflow;
* synchronization;
* provider;
* Engine;
* background worker.

Failure propagation shall be intentional.

---

# 73. Performance

Performance shall be treated as an architectural quality attribute.

Performance improvements shall never violate:

* correctness;
* determinism;
* recoverability;
* security;
* privacy.

---

# 74. Performance Measurement

Performance evaluation shall define:

* latency;
* throughput;
* startup;
* memory;
* storage;
* synchronization duration;
* indexing duration;
* AI execution time.

Performance claims shall be measurable.

---

# 75. Scalability

Execution shall support growth in:

* documents;
* assets;
* annotations;
* libraries;
* plugins;
* AI tasks;
* synchronization sessions.

Scalability strategies shall preserve architectural invariants.

---

# 76. Throughput

Throughput targets shall distinguish:

* interactive workloads;
* batch workloads;
* synchronization;
* indexing;
* AI processing.

Throughput shall not compromise responsiveness.

---

# 77. Latency

Latency-sensitive operations shall identify acceptable targets.

Examples:

* UI interaction;
* search;
* document opening;
* annotation;
* navigation.

Background operations may tolerate higher latency.

---

# 78. Caching

Execution caches are runtime optimizations.

Caches shall define:

* owner;
* invalidation;
* consistency;
* persistence;
* size;
* recovery.

Caches shall never become authoritative state.

---

# 79. Cache Invalidation

Every cache shall specify:

* invalidation triggers;
* expiration;
* dependency changes;
* synchronization events;
* version changes.

Stale cache behavior shall be observable.

---

# 80. Observability

Execution shall be fully observable.

Observability includes:

* metrics;
* tracing;
* logging;
* health;
* readiness;
* alerts.

Invisible execution is prohibited.

---

# 81. Metrics

Execution metrics may include:

* active contexts;
* queue depth;
* retry count;
* failure count;
* throughput;
* latency;
* memory usage;
* CPU usage;
* synchronization rate;
* cache hit ratio.

Metrics shall avoid exposing user knowledge.

---

# 82. Tracing

Tracing shall preserve execution flow across:

* Engines;
* workflows;
* providers;
* synchronization;
* plugins;
* background tasks.

Correlation identifiers shall propagate consistently.

---

# 83. Logging

Logs shall record:

* operation;
* owner;
* duration;
* result;
* failure category;
* correlation identifier.

Logs shall never expose:

* document contents;
* AI prompts;
* AI responses;
* secrets;
* authentication tokens;
* personal knowledge.

---

# 84. Health Checks

Execution shall expose health information for runtime components.

Health shall distinguish:

* healthy;
* degraded;
* failed.

Health shall not expose confidential runtime information.

---

# 85. Security

Execution security shall protect:

* execution contexts;
* resources;
* scheduling;
* background execution;
* plugins;
* synchronization;
* providers.

Execution shall follow least privilege.

---

# 86. Privacy

Runtime execution shall minimize exposure of user knowledge.

Temporary execution state shall be destroyed when no longer required.

Execution telemetry shall avoid sensitive content.

---

# 87. Testing

Execution documentation shall define tests for:

* concurrency;
* determinism;
* retries;
* recovery;
* cancellation;
* timeouts;
* ordering;
* checkpoints;
* fault isolation;
* resource exhaustion;
* performance;
* scalability;
* observability.

Execution guarantees shall be verified continuously.

---

# 88. ADR Impact

Execution changes may require updates to:

```text
ADR-003 Offline First
ADR-004 Library Source of Truth
ADR-005 Engine Based Architecture
ADR-006 AI Architecture
ADR-008 Storage Architecture
ADR-009 Synchronization Strategy
ADR-011 Event Architecture
ADR-013 Master Library / Local Libraries
```

Architectural execution changes shall never remain undocumented.

---

# 89. Documentation Rules

Every execution document shall define, where applicable:

```text
Purpose
Scope
Execution Model
Lifecycle
Ownership
Concurrency
Transactions
Consistency
Retries
Timeouts
Cancellation
Recovery
Checkpointing
Resource Management
Performance
Reliability
Security
Privacy
Observability
Testing
Related ADRs
Related Diagrams
```

Execution documentation shall remain technology independent.

---

# 90. Review Checklist

Before approving an Execution change verify:

* runtime ownership is explicit;
* concurrency is defined;
* determinism is preserved;
* retries are documented;
* timeouts are documented;
* cancellation exists;
* recovery is defined;
* checkpoints are defined;
* consistency is defined;
* resource ownership is explicit;
* bounded execution exists;
* observability is complete;
* security is preserved;
* privacy is preserved;
* performance impact is reviewed;
* ADR impact is reviewed;
* implementation impact is reviewed.

---

# 91. Minimum Change Rule

Agents shall make the smallest complete execution change.

They shall not:

* introduce hidden concurrency;
* introduce unbounded retries;
* introduce infinite queues;
* introduce ownerless resources;
* bypass cancellation;
* bypass observability;
* hide failures;
* make caches authoritative;
* weaken determinism without justification;
* optimize before preserving correctness.

---

# 92. Execution Completion Criteria

Execution documentation is complete only when:

* runtime ownership is explicit;
* lifecycle is defined;
* concurrency is documented;
* consistency is documented;
* retries are documented;
* recovery is documented;
* observability is complete;
* security is addressed;
* privacy is addressed;
* testing strategy exists;
* ADR impact is resolved;
* no runtime ambiguity remains.

---

# 93. Agent Reporting

After Execution work, agents shall report:

* objective;
* runtime components affected;
* ownership changes;
* concurrency impact;
* scheduling impact;
* recovery impact;
* performance impact;
* observability impact;
* security impact;
* privacy impact;
* implementation impact;
* ADR impact;
* diagrams reviewed;
* validation performed;
* remaining risks.

---

# 94. Final Rule

Execution is the architectural contract that transforms static architecture into predictable runtime behavior.

Every operation shall have an owner.

Every resource shall have a lifetime.

Every failure shall have a recovery strategy.

Every retry shall be safe.

Every concurrent execution shall preserve consistency.

Every background task shall remain observable.

Every optimization shall preserve correctness.

When runtime behavior is ambiguous, the architecture is incomplete.

Execution documentation exists to eliminate that ambiguity before implementation begins.

---

# End of `00-Architecture/06-Execution/AGENTS.md`
