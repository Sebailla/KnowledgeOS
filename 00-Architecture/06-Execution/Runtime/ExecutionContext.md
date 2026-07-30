# Execution Context

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Runtime

**Document:** Execution Context

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Execution Context model of KnowledgeOS.

Execution Context provides the governed execution-scoped information required for work to execute consistently across:

* Commands;
* Queries;
* Events;
* Jobs;
* Workflows;
* Platform Engines;
* Providers;
* Plugins;
* local execution;
* Background execution;
* parallel execution;
* remote execution;
* Recovery.

KnowledgeOS operations frequently cross:

* architectural layers;
* asynchronous boundaries;
* process boundaries;
* Provider boundaries;
* Plugin boundaries;
* execution Attempts;
* periods of suspension and resumption.

Without an explicit Execution Context model, runtime metadata may become:

* implicit;
* global;
* mutable;
* inconsistently propagated;
* security-sensitive;
* difficult to observe;
* impossible to reason about.

Execution Context therefore defines how execution-scoped identity, control and diagnostic information is:

* created;
* propagated;
* derived;
* restricted;
* serialized;
* restored;
* terminated.

---

# 2. Scope

This document governs Execution Context for:

* synchronous execution;
* asynchronous execution;
* Background Jobs;
* Workflows;
* scheduled execution;
* Event processing;
* parallel execution;
* Provider invocation;
* Plugin invocation;
* remote execution;
* Checkpoint resumption;
* Recovery;
* cancellation;
* deadlines;
* observability.

This document also governs:

* Operation Identity;
* Attempt Identity;
* Correlation Identity;
* Causation Identity;
* Principal;
* authorization context;
* Execution Profile;
* cancellation context;
* deadline;
* locale;
* observability context;
* capability scope;
* context propagation;
* context derivation;
* context isolation;
* context serialization;
* context restoration;
* privacy.

This document does not define:

* Domain Entities;
* canonical user state;
* global application configuration;
* dependency injection scopes;
* concrete thread-local implementation;
* concrete async-local implementation;
* operating-system execution context;
* authentication protocol;
* authorization policy details.

---

# 3. Architectural Position

Execution Context accompanies governed execution.

```text
Accepted Intent
      │
      ▼
Create Execution Context
      │
      ▼
Dispatch
      │
      ├── Child Execution
      │       └── Derived Context
      │
      ├── Async Boundary
      │       └── Propagated Context
      │
      ├── Provider Boundary
      │       └── Restricted Context
      │
      └── Plugin Boundary
              └── Capability-Scoped Context
```

Execution Context is part of Runtime infrastructure.

It does not own Domain semantics.

---

# 4. Core Principle

The fundamental principle is:

> Execution Context carries execution-scoped metadata and control signals required for governed execution.

The complementary principle is:

> Execution Context is not a global mutable bag, not Domain state, not a substitute for explicit parameters and not an authorization bypass.

---

# 5. Mission

The mission of Execution Context is to preserve coherent execution semantics across boundaries while maintaining:

* identity;
* causality;
* security;
* cancellation;
* temporal constraints;
* Resource policy;
* observability;
* privacy;
* isolation.

---

# 6. Design Philosophy

Execution Context shall be:

* explicit;
* bounded;
* immutable or effectively immutable;
* derivable;
* propagation-aware;
* security-aware;
* privacy-preserving;
* serialization-aware;
* independent from one thread or process.

---

# 7. Execution Context Definition

An Execution Context is an execution-scoped envelope of metadata and control information associated with one Execution Unit.

It may include:

* Operation Identity;
* Attempt Identity;
* Correlation Identity;
* Causation Identity;
* Principal;
* authorization scope;
* Execution Profile;
* cancellation signal;
* deadline;
* locale;
* observability context;
* capability scope;
* execution metadata.

---

# 8. Context Is Not Domain State

Execution Context shall not contain canonical Domain state merely for convenience.

---

# 9. Context Is Not Application State

Execution Context shall not become a hidden global state mechanism.

---

# 10. Context Is Not Configuration

Stable application configuration belongs to Configuration infrastructure.

Execution Context may reference resolved execution-specific configuration when required.

---

# 11. Context Is Not Dependency Injection

Execution Context does not replace dependency resolution.

---

# 12. Context Is Not an Arbitrary Dictionary

Uncontrolled arbitrary key-value mutation is prohibited for core execution semantics.

---

# 13. Context Identity

Each Execution Context shall be associated with one active Execution Unit or explicitly defined execution scope.

---

# 14. Context Lifetime

Execution Context lifetime shall not exceed the execution scope it represents unless a durable subset is explicitly persisted for continuation.

---

# 15. Root Context

A Root Execution Context is created when a new Logical Operation enters governed execution.

Examples include:

* user Command;
* external API request;
* scheduled Job;
* Event Consumer invocation;
* Recovery operation.

---

# 16. Child Context

Child work may derive a Child Execution Context from its parent.

---

# 17. Derived Context

A Derived Context may:

* preserve selected parent fields;
* replace Attempt Identity;
* narrow authorization;
* shorten deadline;
* add causation;
* change Execution Profile where permitted.

---

# 18. Context Immutability

Core Execution Context fields shall be immutable or effectively immutable after creation.

---

# 19. Context Derivation

Changes shall create a derived Context rather than mutate a shared Context in place.

---

# 20. Shared Mutable Context Prohibition

Concurrent execution shall not share mutable contextual state without explicit synchronization and ownership.

---

# 21. Operation Identity

Operation Identity identifies the Logical Operation.

It remains stable across:

* retries;
* suspension;
* resumption;
* Recovery Attempts;

when those executions belong to the same logical operation.

---

# 22. Attempt Identity

Attempt Identity identifies one concrete execution Attempt.

It changes for:

* retry;
* resumed execution;
* Recovery retry;
* re-execution.

---

# 23. Operation and Attempt Relationship

```text
Operation Identity
       │
       ├── Attempt A
       ├── Attempt B
       └── Attempt C
```

Operation Identity expresses semantic continuity.

Attempt Identity expresses concrete execution.

---

# 24. Correlation Identity

Correlation Identity groups related operations for diagnostic or workflow purposes.

---

# 25. Correlation Scope

Correlation may span:

* Commands;
* Events;
* Jobs;
* Workflow Steps;
* Provider calls;
* Recovery operations.

---

# 26. Correlation Is Not Causation

Two operations may be correlated without one directly causing the other.

---

# 27. Causation Identity

Causation Identity identifies the operation or Event that directly caused the current execution.

---

# 28. Causal Chain

Causation may form:

```text
Command
   │
   ▼
Domain Event
   │
   ▼
Event Consumer
   │
   ▼
Background Job
```

Each Unit may preserve:

* its own identity;
* correlation;
* direct causation.

---

# 29. Causal Accuracy

Causation shall not be fabricated merely to create visually complete traces.

---

# 30. Principal

Principal identifies the actor or system authority under which execution occurs.

---

# 31. Principal Types

Possible Principal categories include:

* authenticated user;
* local user session;
* system process;
* scheduled system operation;
* Plugin;
* external integration;
* Recovery authority.

---

# 32. Principal Propagation

Principal propagation shall follow security policy.

It shall not occur automatically across every boundary.

---

# 33. Principal Narrowing

Child execution may receive narrower authority than its parent.

---

# 34. Authority Escalation

Context derivation shall never increase authority without explicit authorization.

---

# 35. Background Principal

Background execution shall preserve sufficient authority context to determine whether the operation remains permitted.

---

# 36. Expired Authorization

Long-running execution shall not assume indefinitely that prior authorization remains valid.

---

# 37. Reauthorization

Operations requiring current authorization may need revalidation or reauthorization before sensitive effects.

---

# 38. System Principal

System execution shall use explicit system authority.

It shall not impersonate a user silently.

---

# 39. Plugin Principal

Plugin execution shall use restricted Plugin identity and Capability scope.

---

# 40. Provider Principal

Provider calls shall receive only credentials and authority required for that Provider operation.

---

# 41. Authorization Context

Execution Context may carry validated authorization information required for the current execution scope.

---

# 42. Authorization Is Not Trust

Possession of Context metadata does not itself prove authorization.

Sensitive boundaries shall validate authority according to policy.

---

# 43. Capability Scope

Capability Scope defines which capabilities are available to an execution boundary.

---

# 44. Capability Narrowing

Derived Contexts may narrow Capability Scope.

They shall not broaden it implicitly.

---

# 45. Execution Profile

Execution Context may carry an Execution Profile.

Execution Profiles are defined in:

`../Performance/ExecutionProfiles.md`

---

# 46. Execution Profile Purpose

Execution Profile communicates execution policy such as:

* Interactive;
* UserInitiated;
* Background;
* Maintenance;
* Recovery;
* MemorySensitive;
* EnergySensitive;
* Offline.

---

# 47. Profile Is Not Priority Alone

Execution Profile may influence:

* scheduling;
* Resource budgets;
* concurrency;
* caching;
* Provider selection;
* telemetry.

---

# 48. Profile Derivation

Child work may inherit or derive an Execution Profile according to policy.

---

# 49. Profile Escalation

Background work shall not silently become Interactive merely to obtain Resources sooner.

---

# 50. Cancellation Context

Execution Context may carry a cancellation signal.

---

# 51. Cancellation Propagation

Cancellation normally propagates from parent to dependent child work.

---

# 52. Independent Child Work

A child operation may detach from parent cancellation only when its independent ownership and lifecycle are explicit.

---

# 53. Cancellation Is Cooperative

Context cancellation communicates a request.

It does not prove execution stopped.

---

# 54. Cancellation Reason

Cancellation may include a structured reason such as:

* UserRequested;
* ParentCancelled;
* DeadlineExceeded;
* Shutdown;
* Superseded;
* ResourcePressure.

---

# 55. Cancellation Privacy

Cancellation reasons shall not contain unnecessary sensitive content.

---

# 56. Deadline

Execution Context may carry an absolute Deadline.

---

# 57. Absolute Deadline

An absolute Deadline is preferred across asynchronous or remote boundaries because relative timeout duration may become ambiguous after queueing or transport delay.

---

# 58. Child Deadline

A dependent child shall normally have a Deadline no later than the parent Deadline.

---

# 59. Independent Deadline

Independent durable work may establish a separate Deadline when explicitly detached from the parent operation.

---

# 60. Deadline Expiration

Deadline expiration may trigger:

* cancellation request;
* timeout result;
* Recovery;
* reconciliation.

---

# 61. Deadline Does Not Prove Effect Absence

An expired Deadline does not prove that:

* external work stopped;
* transaction rolled back;
* remote effect did not occur.

---

# 62. Locale

Execution Context may carry locale information required for:

* presentation;
* formatting;
* localization;
* language-sensitive processing.

---

# 63. Locale and Domain Data

Locale shall not alter canonical Domain meaning unless the Domain contract explicitly defines locale-sensitive semantics.

---

# 64. Time Zone

Time-zone context may be carried where presentation or scheduling requires it.

---

# 65. Time Zone and Canonical Time

Canonical temporal data shall use governed time semantics independent from presentation time zone.

---

# 66. Observability Context

Execution Context may carry observability metadata required for:

* tracing;
* correlation;
* metrics attribution;
* structured logging.

---

# 67. Trace Context

Trace context may include:

* Trace Identity;
* Span Identity;
* parent Span relationship;
* sampling metadata.

---

# 68. Trace Context Is Not Business Identity

Trace Identity shall not replace:

* Operation Identity;
* Domain Identity;
* Job Identity;
* Workflow Identity.

---

# 69. Observability Context Propagation

Observability context should propagate across supported execution boundaries.

---

# 70. Sampling

Sampling decisions shall not alter execution semantics.

---

# 71. Diagnostic Metadata

Execution Context may include bounded diagnostic metadata.

---

# 72. Diagnostic Metadata Restrictions

Diagnostic metadata shall not become:

* arbitrary global storage;
* secret storage;
* document-content storage;
* mutable inter-component communication.

---

# 73. Context Categories

Execution Context fields should conceptually belong to categories:

```text
Identity
Security
Control
Performance
Localization
Observability
Capabilities
```

---

# 74. Identity Context

Identity Context may include:

* Operation Identity;
* Attempt Identity;
* Correlation Identity;
* Causation Identity.

---

# 75. Security Context

Security Context may include:

* Principal;
* authorization scope;
* Capability Scope.

---

# 76. Control Context

Control Context may include:

* cancellation;
* Deadline;
* execution state hints.

---

# 77. Performance Context

Performance Context may include:

* Execution Profile;
* Resource hints;
* scheduling class.

---

# 78. Localization Context

Localization Context may include:

* locale;
* time zone;
* language preference.

---

# 79. Observability Context Category

Observability Context may include:

* Trace Context;
* diagnostic correlation;
* bounded telemetry metadata.

---

# 80. Context Creation

Context creation shall occur at governed execution entry points.

---

# 81. User-Initiated Context

User-initiated execution may derive Context from:

* authenticated session;
* request;
* active application state;
* selected Execution Profile.

---

# 82. Scheduled Context

Scheduled execution shall create a new execution Context.

It shall not reuse stale in-memory Context from schedule creation.

---

# 83. Event Context

Event-triggered execution shall create a new Attempt Context while preserving valid causation and correlation.

---

# 84. Job Context

Each Job Attempt shall have a new Attempt Identity.

---

# 85. Workflow Context

Each Workflow Step execution shall have its own execution Context while preserving Workflow and causal identity.

---

# 86. Recovery Context

Recovery shall execute under a Recovery-specific Context.

---

# 87. Context Propagation

Propagation shall be explicit at every execution boundary.

---

# 88. Propagation Policy

Each field shall define whether it is:

* inherited;
* transformed;
* narrowed;
* regenerated;
* omitted.

---

# 89. Default Propagation

The default shall not be unrestricted propagation of all Context fields.

---

# 90. Same-Process Propagation

Same-process execution may use Runtime mechanisms for Context propagation.

Architecture shall not depend on one specific mechanism.

---

# 91. Async Propagation

Asynchronous boundaries shall preserve required Context explicitly.

---

# 92. Queue Propagation

Durable queued work shall persist only the Context subset required for later execution.

---

# 93. Process Boundary

Cross-process propagation requires explicit serialization.

---

# 94. Remote Boundary

Remote propagation shall use an allowlisted Context representation.

---

# 95. Provider Boundary

Provider calls shall receive only Provider-relevant Context.

---

# 96. Plugin Boundary

Plugin execution shall receive a restricted Plugin-safe Context.

---

# 97. Public API Boundary

Public API requests shall not be allowed to set trusted internal Context fields arbitrarily.

---

# 98. Untrusted Context Input

External correlation or tracing values may be accepted only according to validation and trust policy.

---

# 99. Context Serialization

Only explicitly serializable Context fields may cross durable or remote boundaries.

---

# 100. Serialization Version

Durable Context representation shall be versioned where long-lived interpretation is required.

---

# 101. Serialization Minimization

Only required Context fields shall be persisted.

---

# 102. Non-Serializable Context

Process-local objects shall not be assumed portable.

Examples include:

* open file handles;
* database connections;
* thread objects;
* in-memory cancellation objects;
* UI references.

---

# 103. Cancellation Serialization

Cancellation state itself is not necessarily portable.

Durable execution shall reconstruct cancellation semantics from durable operation state where required.

---

# 104. Deadline Serialization

Absolute Deadline may be serialized when continuation remains subject to the same temporal constraint.

---

# 105. Expired Durable Deadline

Restored work with an expired Deadline shall follow explicit policy rather than execute blindly.

---

# 106. Context Restoration

Durable execution may reconstruct an Execution Context after restart.

---

# 107. Restored Context

Restoration shall distinguish:

* persisted Context data;
* newly generated Attempt data;
* reacquired security state;
* current Runtime conditions.

---

# 108. Attempt Regeneration

A resumed or retried execution shall create a new Attempt Identity.

---

# 109. Principal Revalidation

Security-sensitive resumed work may require Principal or authorization revalidation.

---

# 110. Execution Profile Revalidation

Current Runtime conditions may influence the effective Execution Profile after restoration.

---

# 111. Context and Checkpointing

Checkpoints may preserve the Context subset required for safe resumption.

---

# 112. Checkpoint Context

Checkpoint Context shall not duplicate unnecessary Runtime state.

---

# 113. Context and Recovery

Recovery may derive a new Context linked to the failed operation.

---

# 114. Recovery Correlation

Recovery should preserve correlation to the original failure where available.

---

# 115. Recovery Authority

Recovery Context shall use explicit Recovery authority.

It shall not silently inherit unrestricted user authority.

---

# 116. Context and Retry

Retry preserves Logical Operation Identity and creates a new Attempt Identity.

---

# 117. Retry Context

Retry may also update:

* Deadline;
* Execution Profile;
* diagnostic metadata;
* Provider selection.

Semantic identity remains governed by the operation contract.

---

# 118. Context and Events

Event publication may capture:

* causation;
* correlation;
* Principal attribution;

when appropriate.

---

# 119. Event Persistence

Execution Context shall not be persisted wholesale inside Domain Events.

---

# 120. Event Consumer Context

Each Event Consumer execution receives its own Context.

---

# 121. Multiple Consumers

Multiple Consumers of the same Event shall not share mutable Context.

---

# 122. Context and Commands

Command execution receives Context from the dispatch boundary.

---

# 123. Command Payload Separation

Command payload and Execution Context remain separate concepts.

---

# 124. Context and Queries

Query execution receives Context for:

* authorization;
* cancellation;
* Deadline;
* observability;
* Execution Profile.

---

# 125. Query Payload Separation

Query parameters shall not be hidden inside Execution Context merely for convenience.

---

# 126. Context and Jobs

Durable Jobs shall persist only the Context fields required for later execution.

---

# 127. Job Principal

A Job shall define whether it executes:

* on behalf of a user;
* as a system operation;
* as a Plugin;
* as Recovery.

---

# 128. Job Context Refresh

Long-lived Jobs may need refreshed authorization or Runtime state before execution.

---

# 129. Context and Workflows

Workflow execution may preserve durable workflow-level identity separately from Step Execution Context.

---

# 130. Workflow Step Context

Each Step receives a derived Context.

---

# 131. Workflow Context Evolution

Workflow progression shall not mutate one shared Context object across its entire lifetime.

---

# 132. Context and Parallel Execution

Parallel branches shall receive independent Derived Contexts.

---

# 133. Parallel Attempt Identity

Each independently retryable branch shall have distinct Attempt Identity.

---

# 134. Parallel Cancellation

Parent cancellation may propagate to all dependent branches.

---

# 135. Parallel Correlation

Branches may preserve common correlation while maintaining independent execution identity.

---

# 136. Context and Child Work

Child work shall define whether it is:

* dependent;
* independent;
* durable;
* detached.

---

# 137. Dependent Child

A dependent child normally inherits:

* correlation;
* Principal restrictions;
* cancellation;
* Deadline constraints.

---

# 138. Independent Child

Independent child work shall establish independent lifecycle ownership.

---

# 139. Detached Work

Detached work shall not rely on parent Context lifetime.

---

# 140. Context and Scheduling

Scheduler decisions may inspect permitted Context fields such as:

* Execution Profile;
* priority class;
* Deadline;
* Resource hints.

---

# 141. Scheduler Mutation

Scheduling shall not mutate semantic identity or authorization Context.

---

# 142. Context and Resource Management

Resource Management may use:

* Execution Profile;
* Resource hints;
* priority;
* operation category.

---

# 143. Resource Hints

Resource hints are advisory unless explicitly defined as constraints.

---

# 144. Context and Lifecycle

Application lifecycle may influence Context-derived execution control.

Examples include:

* shutdown cancellation;
* suspension;
* Background transition.

---

# 145. Lifecycle Signal

Lifecycle state shall not be hidden as arbitrary Context metadata.

It belongs to governed Runtime infrastructure.

---

# 146. Context and Transactions

Transaction handles shall not be placed into generic portable Execution Context.

---

# 147. Transaction Scope

Transaction state belongs to explicit transaction execution scope.

---

# 148. Context and Storage

Storage credentials, open handles and mutable Storage sessions shall not be propagated through generic Context.

---

# 149. Context and AI

AI execution Context may carry:

* operation identity;
* cancellation;
* Deadline;
* Execution Profile;
* privacy policy reference.

It shall not automatically contain raw prompt or document content as metadata.

---

# 150. Context and OCR

OCR Context may carry:

* operation identity;
* page or partition scope;
* cancellation;
* Resource profile.

---

# 151. Context and Search

Interactive Search may use:

* short Deadline;
* cancellation;
* Interactive Execution Profile.

---

# 152. Obsolete Search Context

Superseded interactive Search operations should be cancelled.

---

# 153. Context and Render

Render operations may use:

* Interactive profile;
* cancellation;
* document projection identity.

---

# 154. Context and Sync

Synchronization may use durable operation identity and Offline-aware execution policy.

---

# 155. Sync Principal

Synchronization authority shall be explicit.

---

# 156. Context and Library

Library operations may require:

* user authority;
* Library identity;
* canonical write capability.

Library Identity itself should remain an explicit operation parameter where semantically required.

---

# 157. Context and Plugins

Plugins shall receive a sanitized Context projection.

---

# 158. Plugin Context Projection

A Plugin Context may include:

* Plugin identity;
* invocation identity;
* cancellation;
* Deadline;
* approved capabilities;
* limited observability correlation.

---

# 159. Plugin Context Restrictions

Plugins shall not receive:

* unrestricted internal authorization state;
* arbitrary secrets;
* unrelated user metadata;
* mutable core Context objects.

---

# 160. Context and Providers

Providers shall receive a Provider-specific invocation Context.

---

# 161. Provider Context Projection

Provider Context may include:

* request identity;
* Deadline;
* cancellation;
* idempotency key;
* approved credentials reference.

---

# 162. Provider Isolation

Provider-specific metadata shall not pollute core Execution Context globally.

---

# 163. Context Extensions

Subsystem-specific Context extensions may exist.

---

# 164. Extension Ownership

Every extension shall have explicit ownership.

---

# 165. Extension Namespace

Extensions shall avoid global naming collisions.

---

# 166. Extension Propagation

Extensions shall define propagation rules explicitly.

---

# 167. Extension Serialization

Extensions are not serializable by default.

---

# 168. Extension Security

Untrusted extensions shall not alter core security or identity semantics.

---

# 169. Context Size

Execution Context shall remain bounded.

---

# 170. Large Context Prohibition

Large payloads shall be passed through explicit data contracts or durable references.

---

# 171. Context Copy Cost

Context derivation should avoid unnecessary copying of large state.

---

# 172. Context Lookup Cost

Core Context access should remain efficient.

---

# 173. Context Privacy

Execution Context may contain sensitive metadata.

Access and telemetry shall follow privacy policy.

---

# 174. Data Minimization

Only required execution metadata shall be included.

---

# 175. Sensitive Context Fields

Sensitive fields may include:

* user identity;
* authorization scope;
* local paths;
* Provider identity;
* diagnostic metadata.

---

# 176. Secret Prohibition

Execution Context shall not be used as general secret storage.

---

# 177. Logging Context

Only approved Context fields may be added automatically to logs.

---

# 178. Trace Context Privacy

Trace propagation shall avoid embedding private document content or secrets.

---

# 179. Context Disposal

Process-local Context references shall be released after execution completion.

---

# 180. Context Leak

Retention of completed Execution Context without purpose is a Runtime defect.

---

# 181. Context Loss

Loss of required Context across an execution boundary is a correctness defect.

---

# 182. Missing Context

If required Context is unavailable, the operation shall:

* reject;
* create a valid new Root Context;
* enter Recovery;

according to contract.

It shall not fabricate trusted values.

---

# 183. Invalid Context

Invalid Context shall be rejected or sanitized according to boundary policy.

---

# 184. Context Versioning

Persisted Context representation shall evolve through explicit Versioning.

---

# 185. Backward Compatibility

New Runtime Versions may:

* read prior Context representation;
* migrate it;
* reject incompatible durable work.

---

# 186. Silent Compatibility Assumption

Incompatible Context shall never be interpreted silently.

---

# 187. Context Observability

Context lifecycle should be observable where useful.

---

# 188. Context Metrics

Metrics may include:

* Context creation;
* propagation failure;
* cancellation propagation;
* Deadline expiration;
* restoration failure.

---

# 189. Context Logging

Context logging shall record identities and control metadata selectively.

---

# 190. Context Tracing

Trace context shall integrate with the broader Execution Context without replacing operation identity.

---

# 191. Testing Requirements

Execution Context shall be tested for:

* creation;
* derivation;
* propagation;
* isolation;
* cancellation;
* Deadline;
* authorization narrowing;
* serialization;
* restoration;
* retry;
* parallel execution;
* Plugin boundaries;
* Provider boundaries;
* privacy.

---

# 192. Creation Testing

Tests shall verify Root Context creation at governed entry points.

---

# 193. Derivation Testing

Tests shall verify Derived Context:

* preserves required identity;
* creates required new identity;
* narrows authority correctly;
* respects Deadline constraints.

---

# 194. Immutability Testing

Tests shall verify one child cannot mutate parent or sibling Context.

---

# 195. Async Propagation Testing

Tests shall verify required Context survives asynchronous boundaries.

---

# 196. Queue Propagation Testing

Tests shall verify only required durable Context fields are persisted.

---

# 197. Restart Testing

Tests shall verify restored execution creates a new Attempt Identity.

---

# 198. Cancellation Testing

Tests shall verify cancellation propagates to dependent children but not incorrectly to independent work.

---

# 199. Deadline Testing

Tests shall verify child Deadlines do not exceed parent Deadlines without explicit independence.

---

# 200. Authorization Testing

Tests shall verify Context derivation cannot escalate authority.

---

# 201. Plugin Boundary Testing

Tests shall verify Plugins receive only sanitized Context.

---

# 202. Provider Boundary Testing

Tests shall verify Providers receive only Provider-relevant Context.

---

# 203. Parallel Isolation Testing

Tests shall verify parallel branches do not share mutable Context state.

---

# 204. Serialization Testing

Tests shall verify process-local objects cannot enter durable Context representation.

---

# 205. Compatibility Testing

Tests shall verify:

* compatible Context read;
* migration;
* incompatible rejection.

---

# 206. Privacy Testing

Tests shall verify Context does not leak:

* credentials;
* tokens;
* private keys;
* document content;
* AI prompts;
* unrelated user metadata.

---

# 207. Observability Testing

Tests shall verify:

* operation identity;
* Attempt identity;
* correlation;
* causation;
* trace identity;

remain distinct and correctly linked.

---

# 208. Governance

Architectural review is required for changes affecting:

* core Context fields;
* identity semantics;
* Principal propagation;
* authorization Context;
* durable Context serialization;
* cross-process propagation;
* remote Context propagation;
* Plugin Context;
* Provider Context;
* Context extension mechanism.

---

# 209. Execution Context Invariants

The following invariants apply.

* Every significant Execution Unit executes within an explicit Execution Context.
* Execution Context is execution-scoped.
* Execution Context is not Domain state.
* Execution Context is not global application state.
* Execution Context is not an arbitrary mutable dictionary.
* Core Context fields are immutable or effectively immutable.
* Context changes create derived Contexts.
* Logical Operation Identity and Attempt Identity remain distinct.
* Retries and resumed execution create new Attempt Identity.
* Correlation and causation remain distinct.
* Trace Identity does not replace business or execution identity.
* Principal propagation follows explicit security policy.
* Context derivation never escalates authority implicitly.
* Capability Scope may be narrowed but not broadened implicitly.
* Cancellation request does not prove cancellation completion.
* Dependent child Deadlines do not exceed parent Deadline by default.
* Timeout does not prove absence of effect.
* Context propagation is explicit at execution boundaries.
* Durable execution persists only the required Context subset.
* Process-local objects are not treated as portable Context.
* Plugins receive sanitized Context projections.
* Providers receive Provider-specific Context projections.
* Context remains bounded.
* Secrets are not stored in general Execution Context.
* Completed Context references are released.
* Required Context is never fabricated.
* Persisted Context representation is versioned where necessary.
* Incompatible durable Context is never interpreted silently.

---

# 210. Prohibited Behaviors

KnowledgeOS shall never:

* use Execution Context as arbitrary global mutable state;
* store canonical Domain state in Context for convenience;
* hide required operation parameters inside Context unnecessarily;
* mutate one shared Context across concurrent branches;
* reuse Attempt Identity across retries;
* confuse Correlation Identity with Causation Identity;
* use Trace Identity as Domain or Operation Identity;
* propagate unrestricted authority automatically;
* increase authorization through Context derivation implicitly;
* let Background execution inherit stale authority indefinitely;
* trust externally supplied internal Context fields blindly;
* serialize process-local objects as portable Context;
* persist entire Context objects without field-level policy;
* place open transaction handles into generic portable Context;
* use Context as general credential storage;
* expose unrestricted internal Context to Plugins;
* expose unrelated Context metadata to Providers;
* allow subsystem extensions to alter core security semantics;
* allow Context size to grow without bounds;
* log all Context fields automatically;
* embed private document content or AI prompts in trace metadata;
* fabricate missing Principal, identity or authorization information;
* interpret incompatible persisted Context silently;
* allow completed Context references to leak indefinitely.

---

# 211. Related Documents

## Runtime

* `BackgroundJobs.md`
* `ExecutionModel.md`
* `Lifecycle.md`
* `ResourceManagement.md`
* `Scheduling.md`

## Concurrency

* `../Concurrency/ConcurrencyModel.md`
* `../Concurrency/Determinism.md`
* `../Concurrency/Idempotency.md`
* `../Concurrency/RetryPolicies.md`
* `../Concurrency/Transactions.md`

## Messaging

* `../Messaging/Commands.md`
* `../Messaging/EventOrdering.md`
* `../Messaging/EventProcessing.md`
* `../Messaging/Events.md`
* `../Messaging/Queries.md`

## Performance

* `../Performance/ExecutionProfiles.md`
* `../Performance/MemoryModel.md`
* `../Performance/ParallelExecution.md`
* `../Performance/PerformanceModel.md`

## Reliability

* `../Reliability/Checkpointing.md`
* `../Reliability/ErrorHandling.md`
* `../Reliability/Observability.md`
* `../Reliability/Recovery.md`
* `../Reliability/Tracing.md`

## Kernel

* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/README.md`
* `../../04-Platform/AI/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/PluginSDK/SDKArchitecture.md`
* `../../05-Integration/Providers/ProviderModel.md`
* `../../05-Integration/PublicAPI/APIConventions.md`

## Foundation

* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 212. Status

**Approved**

This document defines the Execution Context model of KnowledgeOS.

Execution Context is the execution-scoped envelope of identity, security, control, performance, localization and observability information required for governed execution.

It is not Domain state, global application state, dependency injection, configuration or an arbitrary mutable dictionary.

Every significant Execution Unit executes within an explicit Context.

Core Context fields are immutable or effectively immutable.

Changes produce Derived Contexts rather than mutation of shared state.

Logical Operation Identity remains stable across retries and resumption, while every concrete execution Attempt receives a new Attempt Identity.

Correlation, causation and tracing remain separate concepts.

Principal and authorization propagation follow explicit security policy.

Context derivation may narrow authority but never broaden it implicitly.

Cancellation and Deadline semantics propagate according to dependency relationships.

Cancellation request does not prove termination.

Deadline expiration does not prove absence of effect.

Execution Profile communicates governed execution policy without becoming an authorization mechanism.

Context propagation is explicit across asynchronous, durable, process, remote, Provider and Plugin boundaries.

Only required Context fields are persisted or serialized.

Process-local objects are never assumed portable.

Durable execution reconstructs Context from persisted data, new Attempt identity, current Runtime conditions and revalidated security state.

Plugins receive sanitized Capability-scoped Context.

Providers receive Provider-specific invocation Context.

Context remains bounded, privacy-aware and free from general credential or document-content storage.

KnowledgeOS therefore uses Execution Context to preserve identity, causality, control, security and observability across complex execution without introducing hidden global state or violating architectural boundaries.
