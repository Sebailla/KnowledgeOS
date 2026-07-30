
# Checkpointing

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Execution

**Category:** Reliability

**Document:** Checkpointing

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Checkpointing model of KnowledgeOS.

Checkpointing enables long-running, expensive or failure-sensitive operations to preserve sufficient durable execution progress so they may continue after:

* process termination;
* application restart;
* device restart;
* Resource pressure;
* temporary dependency failure;
* cancellation;
* planned suspension;
* network loss;
* NAS unavailability;
* Provider interruption.

KnowledgeOS performs operations that may be:

* computationally expensive;
* long-running;
* multi-stage;
* asynchronous;
* partially parallel;
* dependent on local or remote Resources;
* executed while offline;
* interrupted unpredictably.

Examples include:

* large document Import;
* OCR;
* AI processing;
* indexing;
* Export;
* synchronization;
* graph construction;
* derived-state rebuild;
* long-running Workflows.

Without governed Checkpointing, interrupted operations may:

* restart unnecessarily;
* repeat expensive work;
* duplicate side effects;
* lose validated progress;
* become impossible to recover safely.

Checkpointing therefore defines how resumable execution progress is:

* represented;
* persisted;
* validated;
* versioned;
* restored;
* invalidated;
* retained;
* removed.

---

# 2. Scope

This document governs Checkpointing for:

* Jobs;
* Workflows;
* long-running Commands;
* background execution;
* Import;
* OCR;
* AI;
* Export;
* Search indexing;
* Knowledge Graph processing;
* synchronization;
* derived-state rebuild;
* migration;
* recovery operations;
* parallel execution.

This document also governs:

* Checkpoint Identity;
* Checkpoint Scope;
* resumable state;
* progress state;
* continuation state;
* input identity;
* configuration identity;
* Version compatibility;
* integrity;
* atomic publication;
* retention;
* cleanup;
* privacy;
* encryption;
* restoration;
* invalidation;
* observability;
* testing.

This document does not define:

* backup policy;
* canonical Library storage;
* Domain Event persistence;
* transaction commit semantics;
* exact serialization technology;
* exact storage engine;
* exact Checkpoint intervals;
* specific recovery workflows.

---

# 3. Architectural Position

Checkpointing belongs to Execution Reliability.

```text
Long-Running Operation
        │
        ▼
   Execute Stage
        │
        ▼
 Valid Safe Boundary
        │
        ▼
 Create Checkpoint
        │
        ▼
 Validate + Publish
        │
        ├──────────────► Continue Execution
        │
        └──────────────► Resume After Interruption
```

Checkpointing preserves execution progress.

Recovery determines how that progress is used after failure.

---

# 4. Core Principle

The fundamental principle is:

> A checkpoint is a durable, validated representation of resumable execution progress.

The complementary principle is:

> A checkpoint is not a backup, not a transaction commit, not canonical knowledge and not proof that an external side effect occurred.

---

# 5. Mission

The mission of Checkpointing is to reduce the cost and risk of interrupted execution while preserving:

* correctness;
* determinism where required;
* idempotency;
* architectural boundaries;
* canonical-state integrity;
* privacy;
* recoverability.

---

# 6. Design Philosophy

Checkpointing shall be:

* explicit;
* durable;
* validated;
* bounded;
* versioned;
* resumable;
* idempotency-aware;
* transaction-aware;
* privacy-preserving;
* independent from in-memory process state.

---

# 7. Checkpoint Definition

A Checkpoint is a durable representation of execution state captured at a known safe continuation boundary.

A Checkpoint may contain:

* logical Operation Identity;
* Workflow Identity;
* Job Identity;
* completed stage information;
* continuation state;
* input identity;
* configuration identity;
* Version metadata;
* progress metadata;
* references to durable intermediate artifacts;
* external-effect evidence;
* integrity metadata.

---

# 8. Checkpoint Is Not Canonical State

A Checkpoint does not become authoritative Domain or Library state merely because it is durable.

---

# 9. Checkpoint Is Not a Backup

A backup protects persistent authoritative data.

A Checkpoint protects resumable execution progress.

---

# 10. Checkpoint Is Not a Cache

A cache improves access or computation performance.

A Checkpoint preserves a valid continuation point.

---

# 11. Checkpoint Is Not a Transaction Commit

A transaction commit makes supported state changes durable and authoritative within its transaction boundary.

A Checkpoint records execution progress.

---

# 12. Checkpoint Is Not an Event

A Domain Event records a Domain fact.

A Checkpoint records resumable execution state.

---

# 13. Checkpoint Is Not a Log

Logs explain execution.

Checkpoints enable continuation.

---

# 14. Checkpoint Identity

Every durable Checkpoint shall have a Checkpoint Identity.

Checkpoint Identity shall be:

* unique within its required scope;
* opaque;
* stable for the lifetime of the Checkpoint.

---

# 15. Checkpoint Scope

Every Checkpoint shall belong to a defined scope.

Possible scopes include:

* Job;
* Workflow;
* Operation;
* Stage;
* Partition;
* Recovery operation.

---

# 16. Logical Operation Identity

A Checkpoint shall identify the logical operation whose progress it represents.

---

# 17. Attempt Independence

A Checkpoint may survive the execution Attempt that created it.

A later Attempt may resume from it.

---

# 18. Checkpoint Ownership

Every Checkpoint shall have one architectural owner responsible for:

* creation;
* schema;
* validation;
* restoration;
* invalidation;
* cleanup.

---

# 19. Ownership Rule

A component shall not interpret another component's opaque Checkpoint state without an explicit contract.

---

# 20. Safe Checkpoint Boundary

A Checkpoint shall be created only at a state from which continuation semantics are defined.

---

# 21. Unsafe Boundary

Arbitrary memory snapshots are not automatically valid Checkpoints.

---

# 22. Safe Boundary Examples

Safe boundaries may include:

* completed Import stage;
* completed OCR page batch;
* committed Workflow Step;
* completed synchronization partition;
* completed indexing shard;
* completed Export generation phase.

---

# 23. Checkpoint Boundary Contract

A safe boundary shall define:

* what has completed;
* what has not completed;
* what may be repeated;
* what must not be repeated;
* what durable effects already exist.

---

# 24. Atomic Checkpoint Publication

A Checkpoint shall not become discoverable as valid before its complete state is durably written and validated.

---

# 25. Staged Creation

Checkpoint creation should conceptually follow:

```text
Build
  │
  ▼
Write Temporary State
  │
  ▼
Validate
  │
  ▼
Atomically Publish
```

---

# 26. Partial Checkpoint Write

A partially written Checkpoint shall never be treated as valid.

---

# 27. Checkpoint Integrity

A Checkpoint shall support detection of:

* truncation;
* corruption;
* incomplete publication;
* incompatible schema;
* missing required artifacts.

---

# 28. Integrity Metadata

Integrity may use:

* checksums;
* hashes;
* size validation;
* schema validation;
* manifest validation.

---

# 29. Checkpoint Manifest

Complex Checkpoints should use a manifest describing:

* Checkpoint Identity;
* owner;
* Version;
* operation;
* creation time;
* input identity;
* configuration identity;
* completed Units;
* artifact references;
* integrity metadata.

---

# 30. Checkpoint State

Checkpoint state shall contain only what is required to resume safely.

---

# 31. Minimal State Principle

Checkpointing shall not serialize the entire application state by default.

---

# 32. Reconstructable State

State that can be reconstructed cheaply and deterministically need not be persisted in the Checkpoint.

---

# 33. Durable Intermediate Artifacts

Expensive intermediate results may be persisted and referenced by the Checkpoint.

---

# 34. Artifact Ownership

Checkpoint artifacts shall have explicit lifecycle ownership.

---

# 35. Artifact Publication

Intermediate artifacts shall not become canonical merely because they are durable.

---

# 36. Input Identity

A Checkpoint shall identify the input state against which it was created.

---

# 37. Input Change

If relevant input changes, the Checkpoint may become invalid.

---

# 38. Input Fingerprint

Input identity may use:

* Version Identity;
* immutable source identity;
* content fingerprint;
* canonical revision;
* stable artifact identity.

---

# 39. Sensitive Input

Raw user content shall not be duplicated into Checkpoint metadata unless required by the operation.

---

# 40. Configuration Identity

A Checkpoint shall preserve configuration information required to determine whether continuation remains valid.

---

# 41. Configuration Change

Configuration changes may:

* preserve compatibility;
* require adaptation;
* invalidate the Checkpoint.

---

# 42. Execution Profile

Execution Profile changes shall not automatically invalidate a Checkpoint unless they alter semantic results.

---

# 43. Semantic Configuration

Configuration affecting output semantics shall participate in compatibility validation.

---

# 44. Implementation Configuration

Configuration affecting only performance may not require invalidation.

---

# 45. Versioning

Checkpoint schemas shall be versioned.

---

# 46. Schema Version

Every persisted Checkpoint shall identify its schema Version.

---

# 47. Compatibility

A newer implementation may:

* read the Checkpoint directly;
* migrate it;
* reject it as incompatible.

---

# 48. Silent Misinterpretation

A Checkpoint shall never be interpreted using incompatible semantics silently.

---

# 49. Checkpoint Migration

Checkpoint migration shall be:

* explicit;
* deterministic where required;
* validated;
* observable.

---

# 50. Migration Failure

If migration fails, the original Checkpoint shall remain preserved until policy determines cleanup.

---

# 51. Resumption

Resumption is the act of continuing a logical operation from a valid Checkpoint.

---

# 52. Resume Validation

Before resumption, the system shall validate:

* Checkpoint integrity;
* owner compatibility;
* schema compatibility;
* input compatibility;
* configuration compatibility;
* required artifacts;
* external-effect state where relevant.

---

# 53. Resume Attempt

A resumed execution is a new Attempt of the same logical operation unless the operation contract defines otherwise.

---

# 54. Resume Point

The resume point shall be explicit.

---

# 55. Replay Boundary

The system shall know which work may be replayed safely after the Checkpoint.

---

# 56. Resume Does Not Mean Skip Blindly

Completed work shall be skipped only when the Checkpoint provides sufficient evidence that reuse is valid.

---

# 57. Validation Before Reuse

Intermediate artifacts shall be validated before reuse where corruption or staleness is possible.

---

# 58. Idempotency Integration

Checkpoint resumption shall respect `../Concurrency/Idempotency.md`.

---

# 59. Idempotent Replay

Operations after a Checkpoint may be replayed only when their semantics permit it.

---

# 60. Non-Idempotent Work

Non-idempotent work requires explicit completion evidence before resumption.

---

# 61. External Side Effects

Checkpointing shall never assume an external side effect failed merely because its acknowledgement was not checkpointed.

---

# 62. External Effect Evidence

A Checkpoint may preserve:

* idempotency key;
* external operation identity;
* acknowledgement;
* status reference;
* reconciliation requirement.

---

# 63. Unknown External Outcome

If an external effect may have occurred but cannot be proven, resumption shall enter reconciliation rather than blind replay.

---

# 64. Transaction Integration

Checkpointing shall respect transaction boundaries.

---

# 65. Uncommitted Transaction State

Uncommitted transaction state shall not be represented as safely completed progress.

---

# 66. Post-Commit Checkpoint

A Checkpoint created after canonical commit may record that the commit completed.

---

# 67. Commit Evidence

Commit evidence shall come from authoritative transaction semantics, not from assumption.

---

# 68. Checkpoint and Compensation

A Checkpoint may record compensation state.

It shall not imply compensation succeeded unless validated.

---

# 69. Checkpoint Frequency

Checkpoint frequency is a trade-off between:

* lost work;
* storage overhead;
* write amplification;
* serialization cost;
* recovery speed.

---

# 70. Fixed Interval Checkpointing

Some operations may checkpoint after a fixed number of Units.

---

# 71. Time-Based Checkpointing

Some operations may checkpoint after bounded elapsed intervals.

---

# 72. Stage-Based Checkpointing

Multi-stage operations should prefer semantically meaningful stage boundaries.

---

# 73. Cost-Based Checkpointing

Expensive completed work may justify earlier Checkpoint creation.

---

# 74. Adaptive Checkpointing

Checkpoint frequency may adapt to:

* operation cost;
* Resource pressure;
* failure probability;
* battery state;
* storage pressure;
* execution profile.

---

# 75. Over-Checkpointing

Excessive Checkpointing may reduce performance significantly.

---

# 76. Under-Checkpointing

Insufficient Checkpointing may cause unacceptable recomputation after interruption.

---

# 77. Checkpoint Cost

Checkpoint cost shall be measurable.

---

# 78. Checkpoint Size

Checkpoint size shall remain bounded.

---

# 79. Large Checkpoint State

Large intermediate data should normally be stored as durable artifacts referenced by the Checkpoint rather than embedded directly.

---

# 80. Incremental Checkpointing

Operations may use incremental Checkpoints when full state snapshots are expensive.

---

# 81. Incremental Dependency

Incremental Checkpoints shall preserve dependency relationships required for restoration.

---

# 82. Broken Incremental Chain

A broken required Checkpoint chain shall invalidate dependent continuation state.

---

# 83. Full Checkpoint

Periodic full Checkpoints may reduce dependence on long incremental chains.

---

# 84. Checkpoint Generations

An operation may maintain multiple Checkpoint generations.

---

# 85. Latest Checkpoint

The newest Checkpoint is not automatically the best valid Checkpoint.

---

# 86. Valid Checkpoint Selection

Selection shall consider:

* integrity;
* compatibility;
* input identity;
* artifact availability;
* semantic validity.

---

# 87. Fallback Checkpoint

If the newest Checkpoint is invalid, recovery may use an older valid Checkpoint.

---

# 88. Checkpoint Supersession

A newer valid Checkpoint may supersede older progress.

---

# 89. Supersession Does Not Require Immediate Deletion

Older Checkpoints may be retained temporarily for fallback.

---

# 90. Checkpoint Retention

Retention shall be governed by:

* operation status;
* recovery value;
* storage pressure;
* privacy;
* debugging requirements.

---

# 91. Successful Completion

After successful terminal completion, Checkpoints may be:

* removed;
* retained temporarily;
* compacted into diagnostic metadata.

---

# 92. Failed Operation

Failed operations may retain Checkpoints for recovery.

---

# 93. Abandoned Operation

Abandoned Checkpoints shall eventually expire according to policy.

---

# 94. Retention Bound

Checkpoint storage shall not grow without bounds.

---

# 95. Cleanup

Checkpoint cleanup shall be:

* explicit;
* idempotent;
* observable;
* safe under interruption.

---

# 96. Cleanup Failure

Cleanup failure shall not invalidate completed canonical work.

---

# 97. Orphaned Artifacts

The system shall detect and eventually clean orphaned Checkpoint artifacts where practical.

---

# 98. Reference Safety

Artifacts shall not be deleted while referenced by a valid Checkpoint.

---

# 99. Concurrent Checkpoint Creation

Concurrent Attempts shall not overwrite each other's Checkpoints ambiguously.

---

# 100. Checkpoint Generation Identity

Each published generation shall be uniquely identifiable.

---

# 101. Compare-and-Swap Publication

Where concurrent writers are possible, publication may require optimistic concurrency or equivalent coordination.

---

# 102. Stale Attempt

A stale Attempt shall not supersede a newer valid Checkpoint without explicit policy.

---

# 103. Parallel Execution

Parallel operations require explicit Checkpoint semantics.

---

# 104. Partition Checkpoints

Independent partitions may checkpoint independently.

---

# 105. Parallel Progress

A parent Checkpoint may record:

* completed partitions;
* pending partitions;
* failed partitions;
* required Join state.

---

# 106. Partial Branch Completion

Completed branches may be reused only if:

* their inputs remain valid;
* their outputs remain valid;
* their semantics permit reuse.

---

# 107. Join Checkpoint

A Join may checkpoint aggregate progress after validating required branch results.

---

# 108. Straggler Recovery

Interrupted parallel work may resume only incomplete or invalid partitions where safe.

---

# 109. Workflow Checkpointing

Workflow state is a primary Checkpointing use case.

---

# 110. Workflow State

A Workflow Checkpoint may contain:

* current state;
* completed Steps;
* pending Steps;
* compensation state;
* retry state;
* waiting conditions;
* durable references.

---

# 111. Workflow Waiting

A Workflow waiting for an external condition shall persist durable state rather than rely on an open process.

---

# 112. Workflow Resume

Workflow resumption shall validate:

* current Workflow Version;
* Step compatibility;
* pending external effects;
* compensation state.

---

# 113. Job Checkpointing

Long-running Jobs may create periodic Checkpoints.

---

# 114. Job Retry

A Job retry may resume from the latest valid Checkpoint rather than restart from zero.

---

# 115. Job Ownership

Only the current valid execution owner may publish progress according to Job coordination rules.

---

# 116. Import Checkpointing

Import may checkpoint after stages such as:

* source inspection;
* extraction;
* OCR;
* UDM construction;
* DPM construction;
* validation.

---

# 117. Import Pre-Commit Checkpoints

Pre-commit Import Checkpoints represent staged execution state.

They do not represent canonical Library content.

---

# 118. Import Commit Boundary

After canonical commit, subsequent work shall be represented separately from pre-commit Import progress.

---

# 119. Import Source Change

If the source changes materially, incompatible pre-commit Checkpoints shall be invalidated.

---

# 120. OCR Checkpointing

OCR may checkpoint:

* completed pages;
* completed page batches;
* preprocessing state;
* validated OCR artifacts.

---

# 121. OCR Page Reuse

OCR results may be reused only when relevant source Region or page identity remains valid.

---

# 122. AI Checkpointing

AI operations may checkpoint around expensive deterministic or resumable stages.

---

# 123. AI Generation Limitation

Not every model generation is exactly resumable.

Checkpointing shall not claim token-level continuation unless the underlying execution contract guarantees it.

---

# 124. AI Preprocessing Checkpoints

Reusable stages may include:

* chunking;
* embedding preparation;
* local model preparation;
* validated intermediate structured output.

---

# 125. AI Provider Effects

Remote AI calls with uncertain outcomes shall follow external-effect reconciliation rules.

---

# 126. Export Checkpointing

Large Export operations may checkpoint:

* completed sections;
* rendered assets;
* packaging stages;
* publication preparation.

---

# 127. Export Publication

Publication to an external destination requires explicit effect evidence.

---

# 128. Search Index Checkpointing

Large index builds may checkpoint:

* completed partitions;
* generation identity;
* source Version;
* index artifact state.

---

# 129. Index Publication

A partially built index shall not become the active index generation.

---

# 130. Knowledge Graph Checkpointing

Large graph rebuilds may checkpoint:

* completed partitions;
* traversal frontier;
* validated intermediate artifacts.

---

# 131. Graph Source Version

Graph Checkpoints shall identify the source knowledge state they represent.

---

# 132. Synchronization Checkpointing

Synchronization may checkpoint:

* discovery state;
* comparison state;
* transferred Units;
* applied changes;
* reconciliation state.

---

# 133. Sync Checkpoint Safety

A Sync Checkpoint shall distinguish:

* discovered;
* transferred;
* validated;
* committed;
* acknowledged.

---

# 134. Sync Unknown Outcome

Unknown remote or Peer effects shall not be replayed blindly.

---

# 135. Recovery Checkpoints

Recovery itself may checkpoint when:

* repair is long-running;
* repair is multi-stage;
* interruption would be expensive;
* partial repair must be resumed safely.

---

# 136. Recursive Recovery Control

Recovery Checkpointing shall not create uncontrolled recursive recovery chains.

---

# 137. Local-First Operation

Checkpointing shall function without continuous network connectivity.

---

# 138. Local Checkpoint Storage

Local operations may store Checkpoints locally according to durability requirements.

---

# 139. NAS Dependency

Checkpointing shall not require NAS availability unless the operation itself requires NAS-backed durable state.

---

# 140. Source of Truth

Checkpoint storage does not redefine the Library Source of Truth.

---

# 141. Cross-Device Resumption

Cross-device resumption may be supported only when:

* Checkpoint state is available;
* required artifacts are available;
* schema is compatible;
* input state is compatible;
* security policy permits it.

---

# 142. Device-Specific State

Device-specific execution state shall not be assumed portable.

---

# 143. Resource Management

Checkpointing consumes:

* CPU;
* memory;
* storage;
* I/O.

It shall participate in Resource Management.

---

# 144. Memory Pressure

Under memory pressure, the Runtime may request a safe Checkpoint before suspension or termination where possible.

---

# 145. Storage Pressure

Under storage pressure, Checkpoint policy may:

* reduce frequency;
* remove superseded generations;
* compact artifacts;
* reject new resumable work.

It shall not silently corrupt existing Checkpoints.

---

# 146. Energy-Sensitive Execution

On battery-constrained devices, Checkpoint strategy may balance:

* write cost;
* interruption probability;
* recomputation cost.

---

# 147. Privacy

Checkpoints may contain execution state derived from private knowledge.

They shall follow the same privacy principles as the underlying operation.

---

# 148. Data Minimization

Checkpoint state shall contain only information required for safe resumption.

---

# 149. Secret Handling

Credentials, tokens and private keys shall not be persisted in ordinary Checkpoint payloads.

---

# 150. Credential Reacquisition

Resumed operations shall reacquire credentials through approved secure mechanisms.

---

# 151. Encryption

Sensitive Checkpoints shall use appropriate storage protection according to platform and security policy.

---

# 152. Access Control

Checkpoint access shall be limited to authorized components.

---

# 153. Plugin Checkpointing

Plugins shall not gain unrestricted access to core Checkpoint storage.

---

# 154. Plugin-Owned Checkpoints

Plugin-owned resumable state shall use governed Plugin storage and Version contracts.

---

# 155. Plugin Upgrade

Plugin upgrade may invalidate or require migration of Plugin-owned Checkpoints.

---

# 156. Provider Checkpointing

Provider-specific continuation state shall remain behind Provider abstractions.

---

# 157. Provider Tokens

Opaque Provider continuation tokens may be persisted only when:

* required;
* safe;
* protected;
* compatible with Provider policy.

---

# 158. Observability

Checkpoint lifecycle shall be observable.

---

# 159. Checkpoint Metrics

Metrics may include:

* Checkpoints created;
* creation duration;
* Checkpoint size;
* validation failure;
* resume count;
* invalidation count;
* cleanup count.

---

# 160. Checkpoint Tracing

Significant Checkpoint creation and restoration may have dedicated Spans.

---

# 161. Checkpoint Logging

Logs may record:

* lifecycle transition;
* validation failure;
* invalidation reason;
* cleanup failure.

Sensitive Checkpoint payload content shall not be logged.

---

# 162. Diagnostic Identity

Checkpoint Identity may be included in local diagnostic evidence where safe.

---

# 163. Failure During Checkpoint Creation

Failure to create a Checkpoint shall not imply the logical operation failed unless Checkpoint durability is required for continued safe execution.

---

# 164. Required Checkpoint

Some operations may require successful Checkpoint creation before proceeding beyond a boundary.

---

# 165. Optional Checkpoint

Other operations may continue after Checkpoint failure while losing resumability.

This degradation shall be observable.

---

# 166. Failure During Restore

Restore failure shall classify whether the Checkpoint is:

* corrupt;
* incompatible;
* incomplete;
* missing artifacts;
* stale.

---

# 167. Restore Fallback

Recovery may attempt an older valid Checkpoint.

---

# 168. No Valid Checkpoint

If no valid Checkpoint exists, the operation may:

* restart;
* enter recovery;
* require user action;
* fail terminally.

The behavior shall be explicit.

---

# 169. Checkpoint Invalidation

A Checkpoint shall be invalidated when its continuation assumptions no longer hold.

---

# 170. Invalidation Causes

Possible causes include:

* changed input;
* incompatible schema;
* incompatible semantic configuration;
* missing artifact;
* corruption;
* completed operation;
* superseded operation;
* security revocation.

---

# 171. Invalidation Record

Important invalidation decisions should be observable.

---

# 172. Invalid Checkpoint Reuse

An invalid Checkpoint shall never be reused merely to avoid recomputation.

---

# 173. Determinism

Checkpoint resumption shall preserve deterministic semantics where the operation requires determinism.

---

# 174. Random State

If deterministic continuation depends upon random state, the required state shall be preserved explicitly.

---

# 175. Ordering State

If continuation depends upon ordering, the relevant ordering state shall be preserved.

---

# 176. Environment State

Implicit process environment shall not be assumed to remain identical after restart.

---

# 177. Reproducibility

A Checkpoint should preserve sufficient execution metadata to determine whether resumption is reproducible.

---

# 178. Time Semantics

Checkpoint creation time is diagnostic metadata.

It does not determine validity by itself.

---

# 179. Expiration

Some Checkpoints may expire because external assumptions become invalid over time.

---

# 180. Expiration Policy

Expiration shall be explicit.

---

# 181. Clock Dependence

Checkpoint validity shall not depend solely on unreliable wall-clock comparison when stronger evidence exists.

---

# 182. Crash Consistency

Checkpoint storage shall remain interpretable after abrupt process termination.

---

# 183. Write Ordering

Required write ordering between artifacts and manifest publication shall be explicit.

---

# 184. Manifest Last

Where appropriate, the valid manifest should become visible only after required artifacts are durable.

---

# 185. Torn Write

Torn or partial writes shall be detected and rejected.

---

# 186. Duplicate Checkpoint Creation

Repeated creation of an equivalent Checkpoint shall not corrupt progress state.

---

# 187. Idempotent Cleanup

Repeated cleanup shall be safe.

---

# 188. Idempotent Restore Preparation

Repeated validation and preparation for restore shall not mutate canonical state unexpectedly.

---

# 189. Testing Requirements

Checkpointing shall be tested for:

* creation;
* atomic publication;
* validation;
* corruption;
* Version compatibility;
* input change;
* configuration change;
* resumption;
* retry;
* external side effects;
* concurrency;
* cleanup;
* Resource pressure;
* process crash.

---

# 190. Creation Testing

Tests shall verify a valid Checkpoint is not visible before complete publication.

---

# 191. Crash Testing

Tests shall terminate execution during:

* artifact write;
* manifest write;
* publication;
* cleanup;
* restoration.

---

# 192. Corruption Testing

Tests shall inject:

* truncated state;
* invalid checksum;
* missing artifact;
* incompatible manifest;
* broken incremental chain.

---

# 193. Resume Testing

Tests shall verify resumed execution:

* preserves logical Operation Identity;
* creates a new Attempt;
* skips only validated completed work;
* repeats only safe work.

---

# 194. Input Change Testing

Tests shall verify incompatible input changes invalidate prior Checkpoints.

---

# 195. Configuration Testing

Tests shall distinguish:

* semantic configuration changes;
* performance-only configuration changes.

---

# 196. Version Testing

Tests shall verify:

* compatible read;
* migration;
* rejection of incompatible Checkpoints.

---

# 197. Retry Testing

Tests shall verify retry and Checkpoint resumption interact correctly.

---

# 198. Unknown Outcome Testing

Tests shall verify uncertain external effects trigger reconciliation rather than blind replay.

---

# 199. Parallel Testing

Tests shall verify:

* partition progress;
* stale Attempt protection;
* Join state;
* partial branch reuse.

---

# 200. Workflow Testing

Tests shall verify long-lived Workflow state survives process and device restart where supported.

---

# 201. Storage Pressure Testing

Tests shall verify Checkpoint retention remains bounded.

---

# 202. Privacy Testing

Tests shall verify Checkpoints do not persist:

* credentials;
* tokens;
* private keys;
* unnecessary user content.

---

# 203. Cleanup Testing

Tests shall verify:

* superseded Checkpoints;
* completed Checkpoints;
* orphaned artifacts;

are cleaned safely according to policy.

---

# 204. Observability Testing

Tests shall verify Checkpoint creation, validation, restore and failure are observable.

---

# 205. Governance

Architectural review is required for changes affecting:

* global Checkpoint identity;
* Checkpoint storage;
* Checkpoint schema compatibility;
* cross-device resumption;
* external-effect evidence;
* canonical commit relationships;
* Plugin Checkpoint access;
* security;
* retention;
* checkpoint migration.

---

# 206. Checkpointing Invariants

The following invariants apply.

* A Checkpoint represents resumable execution progress.
* A Checkpoint is not canonical Domain state.
* A Checkpoint is not a backup.
* A Checkpoint is not a cache.
* A Checkpoint is not a transaction commit.
* A Checkpoint is not a Domain Event.
* Every Checkpoint has explicit ownership.
* Every Checkpoint belongs to a defined logical operation.
* Checkpoints are created only at defined safe boundaries.
* Partially written Checkpoints are never valid.
* Valid Checkpoints are published atomically.
* Checkpoint integrity is validated before reuse.
* Checkpoint schemas are versioned.
* Input compatibility is validated before resumption.
* Semantic configuration compatibility is validated before resumption.
* Completed work is skipped only with sufficient evidence.
* Uncommitted transaction state is never represented as safely completed.
* External side effects are not assumed absent because acknowledgement is missing.
* Unknown external outcomes require reconciliation.
* Resume creates a new execution Attempt while preserving logical Operation Identity.
* Invalid Checkpoints are never reused merely to avoid recomputation.
* Concurrent stale Attempts cannot silently overwrite newer progress.
* Checkpoint storage remains bounded.
* Checkpoint cleanup is idempotent.
* Credentials and secrets are not persisted in ordinary Checkpoint payloads.
* Checkpointing functions Offline First.
* Checkpoint storage does not redefine the Library Source of Truth.
* Checkpoint lifecycle is observable.
* Checkpoint failure does not corrupt canonical state.
* Recovery determines how valid Checkpoints are used after failure.

---

# 207. Prohibited Behaviors

KnowledgeOS shall never:

* treat an arbitrary memory dump as a valid Checkpoint;
* treat a Checkpoint as canonical knowledge;
* treat a Checkpoint as a backup;
* treat Checkpoint persistence as transaction commit;
* expose partially written Checkpoints as valid;
* resume without validating Checkpoint integrity;
* resume against incompatible input silently;
* resume against incompatible semantic configuration silently;
* skip work without evidence that it completed safely;
* record uncommitted transaction state as committed progress;
* replay uncertain external effects blindly;
* assume timeout means an external side effect did not occur;
* let stale concurrent Attempts overwrite newer progress silently;
* allow Checkpoint storage to grow without bounds;
* delete artifacts still referenced by valid Checkpoints;
* persist credentials or private keys in ordinary Checkpoint payloads;
* assume device-specific state is portable;
* require NAS connectivity for all Checkpointing;
* redefine the Library Source of Truth through Checkpoint storage;
* claim exact AI generation continuation without an execution contract that guarantees it;
* silently reuse corrupt or incompatible Checkpoints;
* hide Checkpoint invalidation;
* use Checkpoint creation as proof of successful canonical completion.

---

# 208. Related Documents

## Reliability

* `ErrorHandling.md`
* `Metrics.md`
* `Observability.md`
* `Recovery.md`
* `Tracing.md`

## Performance

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

## Runtime

* `../Runtime/BackgroundJobs.md`
* `../Runtime/ExecutionContext.md`
* `../Runtime/ExecutionModel.md`
* `../Runtime/Lifecycle.md`
* `../Runtime/ResourceManagement.md`
* `../Runtime/Scheduling.md`

## Kernel

* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Logging.md`
* `../../03-Kernel/Observability.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`

## Platform

* `../../04-Platform/AI/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Search/README.md`
* `../../04-Platform/Sync/README.md`

## Integration

* `../../05-Integration/ExternalServices/RemoteExecution.md`
* `../../05-Integration/Providers/ProviderModel.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

## Foundation

* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 209. Status

**Approved**

This document defines the Checkpointing model of KnowledgeOS.

A Checkpoint is a durable, validated representation of resumable execution progress.

It is not canonical knowledge, a backup, a cache, a transaction commit, a Domain Event or a log.

Every Checkpoint belongs to a defined logical operation and has explicit architectural ownership.

Checkpoints are created only at safe continuation boundaries whose semantics define what completed, what remains pending, what may be repeated and what must not be repeated.

Partially written Checkpoints never become valid.

Checkpoint state is validated, versioned and atomically published.

Resumption validates integrity, input identity, semantic configuration, schema compatibility, required artifacts and external-effect state.

A resumed execution preserves logical Operation Identity while creating a new execution Attempt.

Completed work is skipped only when sufficient durable evidence proves that reuse is valid.

Uncommitted transaction state is never represented as completed progress.

External side effects are never assumed absent merely because acknowledgement was lost.

Unknown outcomes require reconciliation rather than blind replay.

Concurrent and parallel execution preserve explicit generation, partition and stale-Attempt semantics.

Checkpoint storage remains bounded.

Superseded, completed and abandoned Checkpoints are cleaned according to governed retention policy.

Checkpointing operates Offline First and does not redefine the NAS-backed Library Source of Truth.

Credentials, tokens and private keys are excluded from ordinary Checkpoint payloads.

Checkpoint creation, validation, restoration, invalidation and cleanup remain observable and testable.

KnowledgeOS therefore uses Checkpointing to preserve safe execution progress across interruption without confusing resumability with canonical persistence, transactional correctness or recovery itself.
