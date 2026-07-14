
# Execution Profiles

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Performance

**Document:** Execution Profiles

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Execution Profile model of KnowledgeOS.

Execution Profiles provide coherent runtime policies for adapting operation execution according to:

* workload type;
* user intent;
* device capabilities;
* Resource availability;
* foreground or background state;
* network conditions;
* energy conditions;
* operational priority.

An Execution Profile determines how an operation should consume Resources.

It may influence:

* scheduling;
* priority;
* concurrency;
* parallelism;
* batching;
* prefetching;
* caching;
* memory limits;
* network use;
* energy use;
* progressive result behavior;
* cancellation responsiveness.

An Execution Profile shall never redefine:

* Domain meaning;
* canonical identity;
* authorization;
* transaction boundaries;
* idempotency;
* consistency requirements;
* required durability;
* output semantics.

---

# 2. Scope

This document governs Execution Profiles used by:

* Commands;
* Queries;
* Events;
* Jobs;
* Workflows;
* Platform Engines;
* Import pipelines;
* OCR processing;
* AI execution;
* rendering;
* indexing;
* search;
* synchronization;
* Export operations;
* Plugin execution;
* Provider operations;
* maintenance;
* recovery;
* background work.

This document also governs:

* profile identity;
* profile selection;
* profile inheritance;
* profile transition;
* profile override;
* profile compatibility;
* device adaptation;
* Resource budgets;
* priority mapping;
* concurrency limits;
* performance degradation;
* profile observability;
* profile testing.

This document does not define:

* operating-system-specific Quality of Service APIs;
* exact thread counts;
* exact memory values;
* specific Provider quotas;
* implementation-specific scheduler classes;
* static hardware requirements.

---

# 3. Architectural Position

Execution Profiles belong to the Performance area of the Execution architecture.

```text
Operation
    │
    ▼
Execution Context
    │
    ▼
Execution Profile
    │
    ├── Priority
    ├── Resource Budget
    ├── Concurrency
    ├── Scheduling
    ├── Cache Policy
    ├── Network Policy
    └── Energy Policy
    │
    ▼
Runtime Execution
```

The operation defines what must occur.

The Execution Profile defines how the runtime should execute it.

---

# 4. Core Principle

The fundamental principle is:

> An Execution Profile changes execution strategy, not semantic meaning.

Two executions using different compatible profiles may differ in:

* latency;
* throughput;
* Resource consumption;
* progress granularity;
* scheduling order;
* background behavior.

They shall not differ in canonical correctness.

---

# 5. Mission

The mission of Execution Profiles is to enable KnowledgeOS to adapt runtime behavior without scattering performance policy across individual components.

Profiles shall make runtime adaptation:

* explicit;
* consistent;
* observable;
* device-aware;
* workload-aware;
* Resource-aware;
* testable;
* governable.

---

# 6. Design Philosophy

Execution Profiles shall be:

* declarative;
* composable where safe;
* bounded;
* stable;
* semantically neutral;
* device-aware;
* workload-aware;
* explicit in Execution Context;
* centrally governed.

---

# 7. Execution Profile Definition

An Execution Profile is a named set of runtime execution policies.

A profile may define:

* priority class;
* scheduling class;
* concurrency limit;
* parallelism limit;
* memory budget;
* cache preference;
* prefetch policy;
* network behavior;
* energy behavior;
* timeout guidance;
* batching policy;
* progress policy;
* cancellation sensitivity.

---

# 8. Profile Identity

Every standard Execution Profile shall have stable Profile Identity.

Examples include:

* `Interactive`;
* `Balanced`;
* `Throughput`;
* `MemorySensitive`;
* `EnergySensitive`;
* `Offline`;
* `Background`;
* `Maintenance`;
* `Recovery`.

Profile Identity shall remain independent from implementation-specific scheduler names.

---

# 9. Profile Version

Execution Profiles may evolve.

A Profile Version shall be introduced when changes materially alter:

* Resource limits;
* priority mapping;
* degradation behavior;
* compatibility;
* scheduling semantics.

Profile Version does not affect Domain Versioning.

---

# 10. Standard Profiles

KnowledgeOS defines the following standard profiles:

1. Interactive;
2. Balanced;
3. Throughput;
4. MemorySensitive;
5. EnergySensitive;
6. Offline;
7. Background;
8. Maintenance;
9. Recovery.

Specialized derived profiles may be introduced through governance.

---

# 11. Interactive Profile

The `Interactive` profile prioritizes immediate user responsiveness.

It is intended for operations directly affecting:

* typing;
* scrolling;
* Apple Pencil input;
* text selection;
* annotation;
* navigation;
* visible rendering;
* interactive search;
* direct UI feedback.

---

# 12. Interactive Objectives

The Interactive profile shall optimize:

* low queue latency;
* low input-to-feedback latency;
* fast cancellation;
* viewport priority;
* progressive results;
* minimal blocking;
* controlled Resource use.

---

# 13. Interactive Priority

Interactive work receives high scheduling priority.

It may preempt, pause or reduce lower-priority background work where safe.

---

# 14. Interactive Concurrency

Interactive concurrency shall remain controlled.

High priority does not justify unbounded parallelism.

The runtime should preserve execution capacity for:

* UI input;
* rendering;
* annotation;
* immediate Queries.

---

# 15. Interactive Memory

Interactive operations may receive temporary memory preference for active working state.

They shall not retain large inactive structures unnecessarily.

---

# 16. Interactive Caching

Interactive Queries and rendering may prefer:

* warm caches;
* precomputed projections;
* near-viewport prefetching;
* fast local state.

Cache use shall remain compatible with consistency requirements.

---

# 17. Interactive Network Policy

Interactive operations should avoid remote dependencies where valid local state exists.

If remote work is required, the UI shall remain responsive.

---

# 18. Interactive Progress

Short interactive operations may use immediate state feedback.

Longer user-triggered operations shall expose progress rather than block interaction.

---

# 19. Interactive Cancellation

Superseded Interactive operations shall be cancelled or ignored promptly.

Examples include:

* obsolete typeahead searches;
* abandoned viewport renders;
* outdated preview generation;
* replaced filter Queries.

---

# 20. Interactive Prohibitions

The Interactive profile shall not:

* trigger expensive full-Library scans synchronously;
* load complete large documents into memory;
* wait indefinitely for NAS access;
* run uncontrolled AI inference on the UI path;
* perform broad maintenance work.

---

# 21. Balanced Profile

The `Balanced` profile is the general default for ordinary user-initiated work.

It balances:

* responsiveness;
* throughput;
* memory;
* energy;
* background progress.

---

# 22. Balanced Use Cases

Balanced may apply to:

* ordinary document opening;
* standard Import;
* routine Export;
* moderate search;
* metadata processing;
* document conversion;
* synchronization initiated by the user.

---

# 23. Balanced Priority

Balanced work receives normal priority.

It shall not block critical Interactive operations.

---

# 24. Balanced Concurrency

Balanced uses moderate bounded concurrency adapted to the device.

---

# 25. Balanced Memory

Balanced may retain useful working data while respecting memory pressure.

---

# 26. Balanced Network Policy

Balanced may use network or NAS Resources when required but should avoid unnecessary repeated access.

---

# 27. Balanced Degradation

Under Resource pressure, Balanced work may:

* reduce parallelism;
* reduce prefetching;
* use smaller batches;
* defer optional derived work.

---

# 28. Throughput Profile

The `Throughput` profile maximizes total completed work over time.

It is intended for:

* batch imports;
* bulk OCR;
* full index rebuild;
* embedding generation;
* large export batches;
* Library-wide reprocessing.

---

# 29. Throughput Objectives

Throughput shall optimize:

* sustained worker utilization;
* batching efficiency;
* pipeline overlap;
* parallel execution;
* reduced per-item overhead.

---

# 30. Throughput Priority

Throughput work is generally below Interactive priority.

It may receive elevated Resource use when:

* the user explicitly requests foreground batch processing;
* the device is idle;
* sufficient Resources are available.

---

# 31. Throughput Concurrency

Throughput may use higher concurrency than Balanced.

Concurrency shall remain bounded by:

* CPU;
* GPU;
* memory;
* storage bandwidth;
* Provider limits;
* thermal state;
* energy policy.

---

# 32. Throughput Batching

Throughput may increase batch size to reduce coordination overhead.

Batch size shall remain compatible with:

* memory;
* rollback cost;
* cancellation;
* checkpointing;
* recovery.

---

# 33. Throughput Memory

Throughput may use a larger working set when capacity permits.

It shall reduce Resource use under memory pressure.

---

# 34. Throughput Network Policy

Throughput may use higher network parallelism where:

* the Provider permits it;
* quotas are respected;
* local interactive traffic remains protected.

---

# 35. Throughput and Background Interaction

Throughput work shall yield when Interactive workloads require Resources.

---

# 36. Throughput Prohibitions

The Throughput profile shall not:

* disable correctness checks;
* skip required validation;
* bypass checkpoints;
* use unbounded queues;
* overload Providers;
* monopolize all execution Resources.

---

# 37. Memory-Sensitive Profile

The `MemorySensitive` profile minimizes peak and sustained memory use.

It is intended for:

* iPhone;
* low-memory devices;
* large document processing;
* concurrent local AI use;
* memory-pressure conditions;
* background execution with strict limits.

---

# 38. Memory-Sensitive Objectives

MemorySensitive shall optimize:

* small working set;
* streaming;
* incremental processing;
* early Resource release;
* conservative caching;
* low batch size;
* limited prefetching.

---

# 39. Memory-Sensitive Concurrency

Concurrency shall be reduced because parallel work often multiplies memory consumption.

---

# 40. Memory-Sensitive Batching

Batch sizes shall be smaller.

Intermediate state shall be persisted or released promptly.

---

# 41. Memory-Sensitive Caching

Memory caches shall use:

* smaller capacity;
* aggressive eviction;
* weak retention;
* recomputable-data preference.

---

# 42. Memory-Sensitive Rendering

Rendering should use:

* strict virtualization;
* visible-region loading;
* reduced prefetching;
* lower-resolution previews where acceptable.

---

# 43. Memory-Sensitive Import

Large documents shall be processed by:

* page;
* section;
* chunk;
* stage.

Full-document in-memory representations shall be avoided where possible.

---

# 44. Memory-Sensitive AI

Large local models may require:

* unloading other caches;
* suspending background processing;
* rejecting incompatible simultaneous workloads;
* choosing a smaller compatible model.

Changing the model shall remain explicit when output semantics may differ.

---

# 45. Memory-Sensitive Degradation

Optional derived data may be:

* released;
* deferred;
* recomputed later;
* generated at lower preview resolution.

Canonical data shall remain protected.

---

# 46. Energy-Sensitive Profile

The `EnergySensitive` profile minimizes battery and thermal impact.

It is intended for:

* battery-powered devices;
* low-power mode;
* thermal pressure;
* extended reading sessions;
* background work on mobile devices.

---

# 47. Energy-Sensitive Objectives

EnergySensitive shall reduce:

* sustained CPU use;
* GPU use;
* network wakeups;
* polling;
* background parallelism;
* unnecessary prefetching.

---

# 48. Energy-Sensitive Scheduling

Non-critical work may be deferred until:

* the device is charging;
* thermal conditions improve;
* the device is idle;
* the application returns to foreground where required.

---

# 49. Energy-Sensitive Batching

Small network or storage operations may be coalesced to reduce wakeups.

Batching shall not create excessive latency for interactive work.

---

# 50. Energy-Sensitive Network Policy

Network activity should be minimized through:

* batching;
* cache use;
* synchronization coalescing;
* reduced polling;
* event-driven refresh.

---

# 51. Energy-Sensitive AI

Expensive local AI may be:

* deferred;
* reduced;
* moved to an approved remote Provider;
* executed only while charging.

Any execution-plan change shall preserve privacy and user policy.

---

# 52. Energy-Sensitive Rendering

Rendering shall avoid unnecessary off-screen or high-frequency recomputation.

---

# 53. Energy-Sensitive Prohibitions

EnergySensitive shall not:

* reduce annotation responsiveness;
* compromise canonical persistence;
* disable required synchronization indefinitely;
* silently send private work to remote Providers.

---

# 54. Offline Profile

The `Offline` profile governs execution when network or remote Source access is unavailable or intentionally disabled.

---

# 55. Offline Objectives

Offline shall prioritize:

* local availability;
* local responsiveness;
* deferred remote work;
* bounded queues;
* explicit stale-state semantics;
* safe later reconciliation.

---

# 56. Offline Local Execution

Operations that can execute locally should continue.

Examples include:

* reading locally available documents;
* editing;
* annotation;
* local search;
* local rendering;
* local metadata changes;
* local AI where available.

---

# 57. Offline Remote Work

Remote-dependent operations shall:

* defer;
* fail explicitly;
* use approved cached state;
* enter waiting state.

They shall not retry continuously.

---

# 58. Offline NAS Behavior

When the NAS is unavailable, KnowledgeOS may use valid local state according to Library and Sync policies.

The application shall not claim Source of Truth freshness that cannot be verified.

---

# 59. Offline Queues

Deferred operations shall be stored in bounded durable queues where required.

They shall preserve:

* operation identity;
* intent;
* authorization requirements;
* deadline;
* preconditions;
* idempotency.

---

# 60. Offline Revalidation

Before deferred work executes after reconnection, KnowledgeOS shall revalidate:

* authorization;
* target state;
* Version assumptions;
* operation expiration;
* Provider compatibility;
* user policy.

---

# 61. Offline Caching

Offline may prefer local caches and projections.

Cache use shall disclose freshness or divergence where relevant.

---

# 62. Offline Search

Local lexical or semantic search may continue over locally indexed content.

Remote augmentation shall remain unavailable or deferred.

---

# 63. Offline AI

Offline AI may use local models if:

* installed;
* authorized;
* compatible;
* Resources permit it.

---

# 64. Offline Prohibitions

Offline shall not:

* simulate successful remote completion;
* lose deferred intent silently;
* assume local state is globally current;
* retry remote operations continuously;
* execute expired deferred work after reconnection.

---

# 65. Background Profile

The `Background` profile governs non-interactive work that may progress without immediate user attention.

---

# 66. Background Use Cases

Background applies to:

* indexing;
* thumbnail generation;
* embeddings;
* cache warming;
* synchronization;
* metadata enrichment;
* conversion refinement;
* integrity checks.

---

# 67. Background Priority

Background work receives lower priority than Interactive and ordinary foreground work.

---

# 68. Background Concurrency

Background concurrency shall adapt to:

* device state;
* current foreground workload;
* memory pressure;
* energy state;
* Provider limits.

---

# 69. Background Suspension

Background work may be suspended when:

* the device enters pressure;
* the application loses allowed execution time;
* higher-priority work requires Resources;
* network conditions change.

---

# 70. Background Durability

Important background work shall use durable Job or Workflow state if it must survive process termination.

---

# 71. Background Progress

Background operations shall remain observable even when not displayed continuously.

---

# 72. Background Cancellation

The user or runtime may cancel optional background work.

Cancellation shall preserve canonical correctness.

---

# 73. Background Prohibitions

Background work shall not:

* block document interaction;
* hold broad Locks;
* consume all CPU or memory;
* run indefinitely without observability;
* create unbounded retry loops.

---

# 74. Maintenance Profile

The `Maintenance` profile governs low-priority system upkeep.

---

# 75. Maintenance Use Cases

Maintenance includes:

* cache cleanup;
* temporary file cleanup;
* index compaction;
* stale execution record cleanup;
* integrity scans;
* orphan detection;
* storage reclamation.

---

# 76. Maintenance Priority

Maintenance normally receives the lowest operational priority.

---

# 77. Maintenance Scheduling

Maintenance should run when:

* the device is idle;
* Resources are available;
* no conflicting critical operation is active;
* battery policy permits it.

---

# 78. Maintenance Batching

Maintenance may process bounded batches and checkpoint progress.

---

# 79. Maintenance Safety

Maintenance shall distinguish:

* canonical data;
* derived state;
* temporary state;
* recoverable operational state.

It shall never delete canonical knowledge as cache cleanup.

---

# 80. Recovery Profile

The `Recovery` profile governs execution restoring system consistency or availability after failure.

---

# 81. Recovery Objectives

Recovery prioritizes:

1. integrity;
2. state verification;
3. resumability;
4. observability;
5. completion speed.

---

# 82. Recovery Use Cases

Recovery may include:

* resuming Import;
* restoring Workflow state;
* reconciling unknown external outcomes;
* rebuilding projection;
* recovering synchronization;
* cleaning interrupted migrations;
* replaying Events.

---

# 83. Recovery Priority

Recovery priority depends upon impact.

Recovery required for canonical access may receive high priority.

Optional projection recovery may remain background.

---

# 84. Recovery Concurrency

Recovery concurrency shall be conservative where multiple repairs could interfere.

---

# 85. Recovery Validation

Recovered state shall be validated before becoming authoritative or active.

---

# 86. Recovery Profile Prohibitions

Recovery shall not:

* guess missing canonical state;
* overwrite current state blindly;
* skip integrity verification for speed;
* conceal unresolved ambiguity.

---

# 87. Profile Selection

Execution Profile selection may be based on:

* operation contract;
* caller intent;
* current device;
* application state;
* Resource pressure;
* network state;
* energy state;
* user preference;
* system policy.

---

# 88. Default Profile

Every significant operation type shall define a default Execution Profile.

Examples:

| Operation                       | Default Profile      |
| ------------------------------- | -------------------- |
| Text selection                  | Interactive          |
| Annotation creation             | Interactive          |
| Standard document import        | Balanced             |
| Batch import                    | Throughput           |
| Search index rebuild            | Background           |
| Cache cleanup                   | Maintenance          |
| Projection rebuild              | Recovery             |
| Deferred remote synchronization | Offline / Background |

---

# 89. Profile Request

A caller may request a profile only when the contract permits it.

A caller shall not force a profile that violates runtime policy or Resource safety.

---

# 90. Runtime Profile Resolution

The effective profile may result from:

```text
Operation Default
      +
Caller Request
      +
Device Policy
      +
Resource Pressure
      +
Energy Policy
      =
Effective Execution Profile
```

---

# 91. Profile Resolution Precedence

The runtime should apply constraints in this order:

1. correctness requirements;
2. security and privacy;
3. operation contract;
4. Resource safety;
5. device and energy policy;
6. caller preference;
7. optimization preference.

---

# 92. Profile Override

The runtime may override a requested profile when:

* memory pressure exists;
* thermal pressure exists;
* Provider limits require it;
* background execution is constrained;
* interactive capacity must be preserved.

---

# 93. Override Transparency

Material profile overrides should be observable.

User-facing notification is required only when behavior meaningfully changes.

---

# 94. Profile Inheritance

Child operations may inherit the parent profile.

Inheritance shall be explicit and may be adjusted according to child workload.

---

# 95. Profile Transformation

Examples of valid transformation include:

```text
Interactive Command
      │
      ▼
Background indexing Event
```

The child indexing operation should use `Background`, not automatically retain `Interactive`.

---

# 96. Workflow Profile

A Workflow may define a default profile and per-Step profiles.

Example:

```text
Import Workflow
├── Source Inspection        Balanced
├── OCR                      Throughput
├── Canonical Commit         Balanced
├── Search Indexing          Background
└── Thumbnail Generation     Background
```

---

# 97. Job Profile

Every Job shall carry or resolve an Execution Profile.

---

# 98. Event Handler Profile

Event Consumers shall define default profiles.

A producer's profile does not automatically propagate to every Consumer.

---

# 99. Query Profile

Queries commonly use:

* Interactive;
* Balanced;
* MemorySensitive;
* Offline.

Analytical Queries may use Background or explicit long-running execution.

---

# 100. Command Profile

Commands commonly use:

* Interactive for small user mutations;
* Balanced for normal operations;
* Throughput for explicit batches;
* Background for deferred work;
* Recovery for repair.

---

# 101. Profile Transition

An operation may transition profiles during execution.

Example:

```text
Import started as Interactive
      │
      ▼
Accepted and scheduled
      │
      ▼
Continues as Balanced or Background
```

---

# 102. Transition Safety

Profile transition shall not alter:

* operation identity;
* idempotency;
* transaction semantics;
* canonical result;
* authorization.

---

# 103. Foreground-to-Background Transition

A user-initiated operation may continue in Background after the initiating UI interaction ends.

It shall preserve stable Operation Identity and progress.

---

# 104. Background-to-Interactive Transition

When the user opens the status or result of a background operation, related visible work may receive Interactive priority.

The entire background workload need not be promoted.

---

# 105. Profile Composition

Profiles may be combined only through governed policy.

Examples include:

* Interactive + MemorySensitive;
* Background + EnergySensitive;
* Throughput + Offline;
* Recovery + MemorySensitive.

---

# 106. Primary and Constraint Profiles

One model is:

```text
Primary Profile:
Interactive

Constraints:
MemorySensitive
Offline
```

The primary profile defines workload intent.

Constraints limit execution behavior.

---

# 107. Invalid Composition

A composition is invalid when its policies conflict semantically or operationally.

Example:

```text
Maximum Throughput
+
Strict Minimum Energy
```

The runtime shall resolve or reject incompatible requirements explicitly.

---

# 108. Resource Budget

Each effective profile shall resolve Resource budgets.

Budgets may include:

* maximum active Tasks;
* maximum worker count;
* maximum memory;
* maximum temporary storage;
* maximum network concurrency;
* maximum Provider requests;
* maximum GPU pressure.

---

# 109. Dynamic Budget

Budgets may adapt during execution.

Adaptation shall not cause uncontrolled oscillation.

---

# 110. Concurrency Policy

Profiles shall define relative concurrency behavior rather than hard-coded universal counts.

Example:

| Profile         | Relative Concurrency     |
| --------------- | ------------------------ |
| Interactive     | Low and latency-focused  |
| Balanced        | Moderate                 |
| Throughput      | High but bounded         |
| MemorySensitive | Low                      |
| EnergySensitive | Low                      |
| Offline         | Based on local Resources |
| Background      | Adaptive and subordinate |
| Maintenance     | Low                      |
| Recovery        | Conservative             |

---

# 111. Batch Policy

Profiles may define:

* small batches;
* moderate batches;
* large bounded batches;
* adaptive batches.

---

# 112. Prefetch Policy

Profiles may define prefetching behavior.

Examples:

* Interactive: near-viewport;
* Balanced: moderate;
* Throughput: pipeline-ahead;
* MemorySensitive: minimal;
* EnergySensitive: conservative;
* Offline: local-only.

---

# 113. Cache Policy

Profiles may influence:

* cache lookup preference;
* cache warming;
* retention priority;
* stale-cache acceptance;
* eviction aggressiveness.

Profiles do not define cache authority.

---

# 114. Network Policy

Profiles may define:

* local-first;
* remote-allowed;
* remote-deferred;
* bounded parallel fetch;
* network-disabled;
* synchronization-coalesced.

---

# 115. Storage Policy

Profiles may influence:

* batching;
* prefetching;
* temporary file use;
* flush cadence where safe;
* read-ahead.

Required durability shall not be weakened.

---

# 116. Progress Policy

Profiles may define progress granularity.

Examples:

* Interactive: rapid visible feedback;
* Throughput: aggregate progress;
* Background: periodic progress;
* Maintenance: coarse progress;
* Recovery: stage and integrity progress.

---

# 117. Cancellation Policy

Interactive profiles require responsive cancellation.

Throughput and background operations may cancel at chunk or checkpoint boundaries.

---

# 118. Deadline Policy

Profiles may provide default deadline guidance.

Operation-specific deadlines remain authoritative.

---

# 119. Timeout Policy

Profiles may provide timeout defaults.

External Provider timeouts shall also respect Provider contracts.

---

# 120. Retry Policy Relationship

Execution Profiles may select a default Retry Policy Profile.

They shall not make non-idempotent operations retryable automatically.

---

# 121. Scheduling Relationship

The Scheduler uses Execution Profile alongside:

* priority;
* deadline;
* dependencies;
* Resource availability;
* fairness.

Profile is not the only scheduling input.

---

# 122. Priority Relationship

Execution Profile and priority are related but distinct.

Two Interactive operations may have different priorities.

A Background operation may temporarily receive elevated priority for critical recovery.

---

# 123. Profile and Determinism

Profile changes shall not alter deterministic output.

Parallelism and batching differences shall preserve stable assembly where required.

---

# 124. Profile and Idempotency

Profile transition or retry shall preserve Logical Operation Identity and Idempotency Key.

---

# 125. Profile and Transactions

Profile selection shall not broaden or weaken transaction boundaries.

---

# 126. Profile and Locking

High-priority profiles shall not bypass Lock ordering or ownership.

---

# 127. Profile and Memory Model

Detailed memory behavior is defined in `MemoryModel.md`.

Execution Profiles provide memory-pressure strategy and budget guidance.

---

# 128. Profile and Parallel Execution

Detailed parallelism rules are defined in `ParallelExecution.md`.

Profiles provide relative concurrency and scheduling policy.

---

# 129. Profile and Cache Strategy

Detailed cache behavior is defined in `CacheStrategy.md`.

Profiles influence cache preference and retention.

---

# 130. Profile and Runtime Lifecycle

Profile state belongs to Execution Context.

It may be persisted for durable Jobs or Workflows where required.

---

# 131. Device Classes

KnowledgeOS may classify devices into broad capability classes such as:

* MobileConstrained;
* MobileStandard;
* Tablet;
* Desktop;
* DesktopHighCapacity;
* WebConstrained.

These classes guide budgets.

They shall not define semantic behavior.

---

# 132. Device Adaptation

The same profile may resolve differently on different devices.

Example:

```text
Throughput on iPhone
    ≠
Throughput on Mac
```

Both remain bounded Throughput policies.

---

# 133. Application State

Profile behavior may differ when the application is:

* active;
* inactive;
* backgrounded;
* suspended;
* terminating.

---

# 134. Background Platform Limits

Mobile operating systems may restrict background time.

Durable work shall checkpoint or reschedule safely.

---

# 135. Thermal State

Under thermal pressure, the runtime may:

* reduce concurrency;
* suspend non-critical work;
* unload local AI models;
* lower background throughput.

---

# 136. Power State

While charging, the runtime may permit more background or throughput work.

This shall remain subject to user and Resource policy.

---

# 137. User Preference

Users may configure broad performance preferences such as:

* Prefer Battery;
* Balanced;
* Prefer Speed;
* Local Processing Only;
* Background Processing Allowed.

User preferences influence but do not override safety or correctness.

---

# 138. Privacy Preference

A privacy policy may prohibit remote execution.

The runtime shall select a compatible local or deferred profile.

Performance preference shall never override privacy policy.

---

# 139. Cost Preference

A cost policy may limit:

* remote AI;
* paid OCR;
* high-volume Provider use;
* network transfer.

The effective profile shall respect cost constraints.

---

# 140. Plugin Profile

Plugins shall execute under profiles assigned by the Plugin subsystem.

Plugins shall not grant themselves Throughput or high-priority execution.

---

# 141. Plugin Resource Budget

Plugin profiles may define strict:

* timeout;
* memory;
* concurrency;
* Job count;
* network access.

---

# 142. Provider Profile

Provider operations may use specialized constraints based on:

* rate limits;
* quota;
* cost;
* concurrency support;
* latency.

---

# 143. AI Profile

AI execution may combine:

* Balanced or Throughput;
* MemorySensitive;
* EnergySensitive;
* Offline;
* privacy constraints.

---

# 144. OCR Profile

OCR may use:

* Balanced for one document;
* Throughput for batches;
* MemorySensitive on constrained devices;
* Background for deferred enrichment.

---

# 145. Render Profile

Visible rendering uses Interactive.

Preview generation may use Background.

Bulk thumbnail generation may use Throughput with Background priority.

---

# 146. Search Profile

Interactive search uses Interactive.

Full analytical search may use Balanced or Background.

Index rebuild uses Background or Throughput.

---

# 147. Synchronization Profile

Foreground manual Sync may use Balanced.

Automatic Sync generally uses Background.

Offline state introduces Offline constraints.

Recovery after divergence may use Recovery.

---

# 148. Import Profile

Single user import normally begins Balanced.

Initial UI feedback may use Interactive.

Heavy processing may transition to Balanced, Throughput or Background.

---

# 149. Export Profile

Small local export may use Balanced.

Bulk export may use Throughput.

Remote publication may use Background or Balanced with external constraints.

---

# 150. Observability

The effective Execution Profile shall be observable.

Observable metadata may include:

* requested profile;
* effective profile;
* profile Version;
* applied constraints;
* override reason;
* Resource budget;
* profile transitions;
* device class.

---

# 151. Logging

Profile logs should record only significant events such as:

* override;
* transition;
* incompatibility;
* Resource-pressure adaptation;
* policy rejection.

---

# 152. Metrics

Profile metrics may include:

* operations by profile;
* profile transition count;
* override count;
* average Resource use by profile;
* latency by profile;
* cancellation by profile;
* queue delay by profile;
* degradation events.

---

# 153. Tracing

Execution traces should include the effective profile for significant operations.

Child spans may record profile changes.

---

# 154. Profile Health

Persistent inability to satisfy a profile may produce degraded health.

Example:

* Interactive latency degraded due to background saturation;
* Throughput limited by memory pressure;
* Offline queue near capacity;
* Recovery blocked by unavailable Source.

---

# 155. Failure Categories

Stable profile-related failures may include:

* UnsupportedExecutionProfile;
* IncompatibleProfileCombination;
* ResourceBudgetUnavailable;
* ProfileOverrideRequired;
* BackgroundExecutionUnavailable;
* OfflineRequirementUnsatisfied;
* EnergyPolicyRestricted;
* DeviceCapabilityInsufficient.

---

# 156. Testing Requirements

Execution Profiles shall be tested through:

* profile selection;
* profile override;
* profile transition;
* device adaptation;
* memory pressure;
* thermal pressure;
* offline state;
* background state;
* user preference;
* privacy constraints;
* Plugin limits;
* concurrency behavior.

---

# 157. Semantic Equivalence Testing

Equivalent operations executed under different compatible profiles shall produce equivalent semantic results.

---

# 158. Interactive Testing

Interactive tests shall verify:

* low queue delay;
* cancellation of superseded work;
* protection from background saturation;
* responsive annotation and rendering.

---

# 159. Throughput Testing

Throughput tests shall verify:

* sustained work completion;
* bounded concurrency;
* no interactive starvation;
* controlled memory growth;
* correct checkpointing.

---

# 160. Memory-Sensitive Testing

Tests shall verify:

* reduced peak memory;
* incremental processing;
* aggressive cache release;
* no canonical data loss;
* completion under constrained memory.

---

# 161. Energy-Sensitive Testing

Tests shall verify:

* reduced parallelism;
* reduced background wakeups;
* deferred optional work;
* preserved interactive correctness.

---

# 162. Offline Testing

Tests shall verify:

* local capability continuity;
* bounded deferred queues;
* explicit freshness;
* no remote retry loops;
* correct reconnection revalidation.

---

# 163. Background Testing

Tests shall verify:

* suspension;
* resumption;
* process termination recovery;
* Resource yielding;
* progress persistence.

---

# 164. Recovery Testing

Tests shall verify Recovery favors integrity and does not overwrite current valid state.

---

# 165. Profile Composition Testing

Tests shall verify valid and invalid profile combinations.

---

# 166. Profile Transition Testing

Tests shall verify profile transition preserves:

* identity;
* idempotency;
* progress;
* transaction correctness;
* observability.

---

# 167. Plugin Testing

Tests shall verify Plugins cannot escalate their Execution Profile or Resource budget.

---

# 168. Governance

Changes affecting standard profiles require architectural review when they alter:

* priority;
* Resource budgets;
* concurrency policy;
* background behavior;
* offline behavior;
* privacy;
* degradation;
* semantic compatibility.

---

# 169. Execution Profile Invariants

The following invariants apply.

* Execution Profiles change runtime strategy, not semantic meaning.
* Every significant operation has a default profile.
* The effective profile is explicit in Execution Context.
* Profile selection respects correctness before performance preference.
* Security and privacy constraints override optimization preference.
* Resource budgets are bounded.
* Profile changes do not alter canonical identity.
* Profile changes do not alter authorization.
* Profile changes do not weaken transaction boundaries.
* Profile changes do not bypass idempotency.
* Interactive work is protected from non-critical background saturation.
* Lower-priority work does not starve indefinitely.
* Throughput remains bounded.
* MemorySensitive reduces working set and parallelism.
* EnergySensitive reduces optional Resource use without compromising integrity.
* Offline preserves local capability and defers remote work safely.
* Background work is suspendable and recoverable where required.
* Maintenance never deletes canonical knowledge as cache cleanup.
* Recovery prioritizes integrity over speed.
* Device adaptation changes budgets, not semantics.
* Plugins cannot elevate their own profile.
* Material profile overrides remain observable.
* Profile transitions preserve operation identity and progress.
* Execution Profiles are testable and governable.

---

# 170. Prohibited Behaviors

KnowledgeOS shall never:

* use Execution Profiles to change Domain semantics;
* weaken authorization for performance;
* weaken durability silently;
* bypass idempotency under Throughput;
* disable validation for speed;
* grant unbounded concurrency to any profile;
* allow Background work to make interaction unusable;
* allow Plugins to select unrestricted high-priority execution;
* treat Offline as successful remote completion;
* execute expired deferred work after reconnection;
* send private work remotely because local execution is slower;
* delete canonical data under MemorySensitive or Maintenance policy;
* hide material profile overrides;
* propagate Interactive priority to unrelated background consumers automatically;
* allow Recovery to overwrite current state for speed;
* hard-code one universal Resource budget for all devices.

---

# 171. Related Documents

## Performance

* `PerformanceModel.md`
* `CacheStrategy.md`
* `MemoryModel.md`
* `ParallelExecution.md`

## Concurrency

* `../Concurrency/ConcurrencyModel.md`
* `../Concurrency/Determinism.md`
* `../Concurrency/Idempotency.md`
* `../Concurrency/Locking.md`
* `../Concurrency/RetryPolicies.md`
* `../Concurrency/Transactions.md`

## Messaging

* `../Messaging/Commands.md`
* `../Messaging/EventProcessing.md`
* `../Messaging/Queries.md`

## Runtime

* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`
* `../Runtime/Lifecycle.md`
* `../Runtime/ResourceManagement.md`
* `../Runtime/Scheduling.md`

## Reliability

* `../Reliability/Checkpointing.md`
* `../Reliability/Metrics.md`
* `../Reliability/Observability.md`
* `../Reliability/Recovery.md`
* `../Reliability/Tracing.md`

## Kernel

* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/AI/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Render/README.md`
* `../../04-Platform/Search/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/Providers/ProviderModel.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 172. Status

**Approved**

This document defines the Execution Profile model of KnowledgeOS.

Execution Profiles provide coherent runtime policies for adapting execution according to workload, device, Resource availability, network, energy state and user intent.

Profiles affect scheduling, concurrency, batching, caching, prefetching, memory, network and progress behavior.

They do not alter Domain meaning, canonical identity, authorization, consistency, transaction boundaries, idempotency or required durability.

The Interactive profile protects immediate user responsiveness.

Balanced provides the general execution default.

Throughput maximizes bounded sustained work.

MemorySensitive reduces working set and concurrency.

EnergySensitive reduces battery and thermal impact.

Offline preserves local capability and safely defers remote operations.

Background executes non-interactive work without dominating the application.

Maintenance performs controlled upkeep.

Recovery restores consistency with integrity before speed.

Profiles may transition during long-running operations while preserving identity, progress and execution guarantees.

The effective profile is resolved from operation defaults, caller intent, device policy, Resource pressure, privacy and runtime conditions.

Plugins cannot elevate their own priority or Resource budget.

KnowledgeOS therefore adapts how work executes without allowing performance policy to redefine what the work means or weaken architectural correctness.
