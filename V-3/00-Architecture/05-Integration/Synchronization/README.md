
# Synchronization Integration

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Synchronization

**Document:** README

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model governing the Integration boundary of synchronization within KnowledgeOS.

Synchronization Integration provides the protocols, external contracts, transport abstractions and peer-adaptation mechanisms required to exchange synchronization information between:

* local KnowledgeOS runtimes;
* devices;
* NAS-backed Libraries;
* remote endpoints;
* synchronization Providers;
* external repositories;
* approved companion applications;
* future synchronization peers.

Synchronization Integration does not define the semantic rules of synchronization.

It does not decide:

* which state is canonical;
* how knowledge conflicts are resolved;
* how Domain Versions are merged;
* whether one change supersedes another;
* how Library authority is assigned;
* whether divergence is acceptable.

These responsibilities belong to the Domain, Library Engine and Sync Engine.

Synchronization Integration defines how synchronization information crosses architectural and system boundaries.

---

# 2. Scope

This document governs:

* Synchronization Peers;
* Synchronization Endpoints;
* Synchronization Sessions;
* protocol negotiation;
* synchronization capabilities;
* Peer Identity;
* Endpoint Identity;
* session identity;
* change exchange;
* snapshot exchange;
* incremental exchange;
* checkpoints;
* cursors;
* acknowledgements;
* synchronization envelopes;
* transport adaptation;
* peer authentication;
* peer authorization;
* synchronization credentials;
* transfer integrity;
* retries;
* resumability;
* replay;
* deduplication;
* ordering metadata;
* network failure;
* partial transfer;
* offline behavior;
* Provider integration;
* external repository integration;
* synchronization observability;
* synchronization security;
* synchronization privacy.

This document does not govern:

* Domain Version semantics;
* canonical Knowledge Object identity;
* semantic conflict resolution;
* merge algorithms;
* Source of Truth selection;
* local cache policy;
* physical storage implementation;
* internal Event Bus behavior;
* Import or Export as complete workflows;
* Provider implementation details.

---

# 3. Architectural Position

Synchronization Integration belongs to the Integration layer.

```text
02-Domain
    │
    ▼
04-Platform/Sync
    │
    ▼
05-Integration/Synchronization
    │
    ▼
Synchronization Provider / Adapter
    │
    ▼
External Peer or Endpoint
```

The dependency direction shall remain inward.

External synchronization protocols shall never define Domain semantics.

---

# 4. Core Principle

Synchronization Integration exchanges synchronization information.

It does not own synchronization meaning.

The correct architecture is:

```text
Canonical Knowledge
        │
        ▼
Sync Engine
        │
        ▼
Synchronization Plan
        │
        ▼
Synchronization Integration
        │
        ▼
Protocol / Transport
        │
        ▼
Peer
```

The following model is prohibited:

```text
Remote Protocol Message
        │
        ▼
Direct Canonical Mutation
```

---

# 5. Mission

The mission of Synchronization Integration is to enable reliable and secure synchronization between heterogeneous endpoints while preserving:

* canonical integrity;
* user ownership;
* Source of Truth policy;
* Provider independence;
* transport independence;
* Offline First operation;
* resumability;
* failure isolation;
* observability;
* privacy;
* explicit conflict boundaries.

---

# 6. Design Philosophy

Synchronization Integration shall be:

* contract-driven;
* peer-aware;
* transport-independent;
* resumable;
* idempotent where required;
* compatible with intermittent connectivity;
* version-aware;
* capability-driven;
* bounded;
* observable;
* secure by default;
* independent from conflict policy.

---

# 7. Responsibility Separation

The synchronization architecture is divided into distinct responsibilities.

```text
Domain
    │
    ├── Identity
    ├── Version semantics
    ├── invariants
    └── conflict meaning

Platform Sync Engine
    │
    ├── synchronization orchestration
    ├── divergence detection
    ├── comparison
    ├── transfer planning
    ├── conflict policy
    └── convergence decisions

Synchronization Integration
    │
    ├── peers
    ├── endpoints
    ├── protocols
    ├── transports
    ├── sessions
    ├── envelopes
    └── external adaptation
```

This separation is mandatory.

---

# 8. Synchronization Peer

A Synchronization Peer is a logical participant capable of exchanging synchronization information.

A Peer may represent:

* another KnowledgeOS device;
* a NAS-backed Library endpoint;
* a remote KnowledgeOS service;
* a synchronization Provider;
* an external repository;
* an approved companion application.

---

# 9. Peer Identity

Every persistent Synchronization Peer shall have stable Peer Identity.

Peer Identity shall remain distinct from:

* network address;
* device name;
* user-visible display name;
* Provider Identity;
* Endpoint Identity;
* current Session Identity.

---

# 10. Peer Trust

A Peer may have a trust classification.

Possible classifications include:

* Local Trusted;
* User-Owned Trusted;
* Private Remote;
* Restricted;
* Untrusted;
* Unknown.

Trust classification may affect:

* authentication;
* authorization;
* data eligibility;
* automatic synchronization policy;
* user confirmation requirements.

Trust does not eliminate validation.

---

# 11. Peer Capabilities

A Peer may expose capabilities such as:

* snapshot exchange;
* incremental exchange;
* bidirectional synchronization;
* one-way publication;
* one-way acquisition;
* resumable transfer;
* compression;
* encryption;
* conflict metadata;
* Version history;
* Asset streaming;
* tombstone exchange.

Capabilities shall be explicit.

---

# 12. Peer Capability Discovery

KnowledgeOS may discover or negotiate Peer capabilities.

Capability discovery does not grant authority.

A technically supported capability may still be prohibited by:

* authorization;
* user policy;
* privacy;
* Source of Truth rules;
* environment constraints.

---

# 13. Synchronization Endpoint

A Synchronization Endpoint is a configured addressable integration surface associated with a Peer.

An Endpoint may use:

* local filesystem access;
* NAS access;
* local IPC;
* HTTP;
* WebSocket;
* Provider API;
* object storage;
* another approved transport.

---

# 14. Endpoint Identity

Every configured Endpoint shall have stable Endpoint Identity.

Endpoint Identity shall remain distinct from:

* Peer Identity;
* Provider Identity;
* current network address;
* current mount path;
* Session Identity.

---

# 15. Endpoint Mobility

An Endpoint may change its physical location while preserving logical identity.

Examples include:

* NAS address change;
* mount path change;
* mobile device network change;
* remote service endpoint rotation.

Physical address shall not define canonical synchronization identity.

---

# 16. Endpoint Direction

An Endpoint may support:

* Pull;
* Push;
* Bidirectional;
* Read-Only;
* Write-Only.

Direction shall be explicit.

---

# 17. Endpoint Lifecycle

An Endpoint may have states such as:

* Configured;
* Available;
* Degraded;
* Unavailable;
* Unauthorized;
* Incompatible;
* Disabled;
* Removed.

Endpoint state is operational Integration state.

---

# 18. Synchronization Provider

A Synchronization Provider implements concrete integration with a synchronization technology or external system.

Examples may include:

* NAS Synchronization Provider;
* Device-to-Device Provider;
* Cloud Sync Provider;
* Repository Provider;
* Local Network Provider.

---

# 19. Provider Boundary

The architecture is:

```text
Sync Engine
    │
    ▼
Synchronization Contract
    │
    ▼
Synchronization Provider
    │
    ▼
External Protocol or System
```

Provider-specific concepts shall remain behind this boundary.

---

# 20. Provider Model

Synchronization Providers shall conform to:

* `../Providers/ProviderModel.md`;
* `../Providers/SyncProviders.md`.

This document defines the integration responsibilities those Providers implement.

---

# 21. Provider Independence

The Sync Engine shall not depend upon:

* vendor SDK objects;
* transport-specific message types;
* remote API response types;
* filesystem watcher formats;
* cloud object metadata structures.

Providers translate them into stable Integration contracts.

---

# 22. Synchronization Session

A Synchronization Session represents one bounded attempt to exchange and reconcile state with a Peer.

A Session may include:

* Session Identity;
* Peer Identity;
* Endpoint Identity;
* protocol Version;
* negotiated capabilities;
* synchronization direction;
* baseline;
* checkpoint;
* transfer state;
* result.

---

# 23. Session Identity

Every Synchronization Session shall have unique Session Identity.

Session Identity is distinct from:

* Peer Identity;
* synchronization operation identity;
* transfer attempt identity;
* checkpoint identity.

---

# 24. Session Lifecycle

A Synchronization Session may follow:

```text
Created
    │
    ▼
Connecting
    │
    ▼
Negotiating
    │
    ▼
Discovering State
    │
    ▼
Planning
    │
    ▼
Transferring
    │
    ▼
Verifying
    │
    ▼
Reconciling
    │
    ├───────────────┐
    ▼               ▼
Completed         Failed
```

Additional states may include:

* Paused;
* WaitingForPeer;
* WaitingForUser;
* Cancelled;
* RecoveryRequired.

---

# 25. Session Establishment

Session establishment may include:

1. Endpoint connection;
2. Peer authentication;
3. authorization;
4. protocol negotiation;
5. capability negotiation;
6. baseline discovery;
7. session activation.

No protected synchronization information shall be exchanged before required establishment steps complete.

---

# 26. Protocol Negotiation

Synchronization peers shall negotiate or validate protocol compatibility.

Negotiation may include:

* protocol Version;
* exchange format Version;
* compression;
* encryption;
* maximum payload size;
* transfer mode;
* resumability;
* checkpoint support.

Negotiation shall be deterministic.

---

# 27. Protocol Version

Synchronization Protocol Version defines wire-level and exchange-level behavior.

It is distinct from:

* Knowledge Object Version;
* Domain Version;
* UDM Version;
* DPM Version;
* Sync Engine Version;
* Provider Version.

---

# 28. Unsupported Protocol Version

An unsupported incompatible protocol Version shall fail explicitly.

KnowledgeOS shall not guess newer or older semantics.

---

# 29. Synchronization Capability

A Synchronization Capability describes a supported synchronization behavior.

Examples include:

* ExchangeManifest;
* ExchangeSnapshot;
* ExchangeChangeSet;
* ResumeTransfer;
* ExchangeTombstones;
* ExchangeAssets;
* VerifyIntegrity;
* NegotiateCompression.

Capability identity shall be stable and versioned where required.

---

# 30. Capability Compatibility

Two Peers may use only the intersection of compatible capabilities permitted by policy.

Unsupported required capabilities shall cause explicit incompatibility.

---

# 31. Synchronization Direction

Direction may be:

* Pull;
* Push;
* Bidirectional.

Direction expresses permitted information flow.

It does not determine conflict resolution automatically.

---

# 32. Pull Synchronization

Pull retrieves approved remote changes for local evaluation.

Remote data shall not become canonical immediately.

It must pass through:

* validation;
* comparison;
* planning;
* Sync Engine policy.

---

# 33. Push Synchronization

Push sends approved local synchronization projections to a Peer.

Push does not grant the Peer broader access to the Library.

---

# 34. Bidirectional Synchronization

Bidirectional synchronization exchanges changes in both directions.

It requires explicit:

* baselines;
* Version comparison;
* conflict handling;
* transfer planning;
* convergence policy.

These semantic responsibilities belong to the Sync Engine.

---

# 35. One-Way Replication

An Endpoint may support one-way replication.

One-way replication is not automatically equivalent to backup or export.

Its semantics shall be explicit.

---

# 36. Synchronization Baseline

A Baseline identifies a shared known synchronization state between Peers.

It may be represented by:

* snapshot identity;
* checkpoint;
* Version vector;
* change-set identity;
* Peer-specific cursor;
* another stable reference.

---

# 37. Baseline Identity

Every persistent Baseline shall have stable identity within its synchronization scope.

Baseline Identity shall not become Knowledge Object Identity.

---

# 38. Baseline Scope

A Baseline shall define its scope.

Possible scopes include:

* complete Library;
* Library subset;
* collection;
* Knowledge Object;
* Asset set;
* Endpoint-specific namespace.

A Baseline from one scope shall not be reused in another.

---

# 39. Baseline Validation

Before incremental synchronization, KnowledgeOS shall validate that the referenced Baseline remains compatible.

An unknown or incompatible Baseline shall trigger:

* resynchronization;
* snapshot exchange;
* explicit failure;
* another governed recovery strategy.

---

# 40. Snapshot Exchange

Snapshot Exchange transfers a bounded representation of state at a defined logical point.

A snapshot may be used for:

* initial synchronization;
* recovery;
* Baseline establishment;
* full comparison.

---

# 41. Snapshot Identity

Every exchanged snapshot shall have explicit identity and consistency metadata.

---

# 42. Snapshot Completeness

A snapshot shall declare whether it is:

* complete;
* partial;
* metadata-only;
* Assets-external;
* scoped;
* filtered.

Consumers shall not infer completeness from absence.

---

# 43. Incremental Exchange

Incremental Exchange transfers changes relative to an established Baseline.

Changes may include:

* created objects;
* updated objects;
* deleted objects;
* Version transitions;
* relationship changes;
* Asset changes;
* annotation changes.

---

# 44. Change Set

A Change Set is a bounded synchronization exchange unit.

A Change Set may contain:

* Change Set Identity;
* Peer Identity;
* Baseline Identity;
* sequence metadata;
* changes;
* tombstones;
* integrity metadata;
* dependencies.

---

# 45. Change Set Identity

Every Change Set shall have stable identity.

Stable identity supports:

* deduplication;
* retry;
* replay;
* acknowledgement;
* audit.

---

# 46. Change Set Is Not a Domain Transaction

A Change Set is an Integration representation.

It does not automatically define one atomic Domain transaction.

The Sync Engine determines how changes are evaluated and committed.

---

# 47. Change Representation

Changes may be represented as:

* complete object replacement;
* semantic delta;
* Version transition;
* operation record;
* canonical exchange object.

The representation shall be explicit and versioned.

---

# 48. Generic Patch Restriction

Untyped generic patches are discouraged for canonical synchronization.

A patch shall not bypass:

* Domain invariants;
* Version semantics;
* validation;
* conflict detection.

---

# 49. Tombstones

Deletion shall be represented explicitly where synchronization requires propagation.

A Tombstone may include:

* object identity;
* deletion Version;
* deletion time;
* source;
* provenance;
* retention metadata.

---

# 50. Absence Is Not Deletion

Absence from a snapshot or Change Set shall not imply deletion unless the protocol explicitly defines a complete authoritative scope.

---

# 51. Asset Synchronization

Assets may be synchronized:

* inline for bounded content;
* through package references;
* through streaming;
* through temporary authorized URLs;
* through content-addressed transfer.

---

# 52. Asset Identity

Asset synchronization shall preserve logical Asset Identity according to Domain rules.

Physical filenames and paths shall not define canonical Asset identity.

---

# 53. Asset Deduplication

Content hashes may assist physical deduplication.

Deduplication shall not alter logical ownership or relationship semantics.

---

# 54. Asset Integrity

Transferred Assets shall be validated through:

* expected length;
* media type where applicable;
* cryptographic hash;
* package integrity.

Integrity failure shall stop trusted acceptance.

---

# 55. Large Asset Transfer

Large Assets shall support bounded transfer.

Possible mechanisms include:

* chunking;
* range transfer;
* streaming;
* resumable upload;
* resumable download.

---

# 56. Chunk Identity

Every transfer chunk shall be associated with:

* Asset or transfer identity;
* sequence;
* offset or range;
* integrity information.

---

# 57. Partial Asset State

Partially transferred Assets shall remain:

* temporary;
* non-canonical;
* distinguishable from completed Assets;
* cleanup-managed.

---

# 58. Transfer

A Transfer represents one movement of synchronization data between Peers.

Transfer Identity is distinct from:

* Session Identity;
* Change Set Identity;
* Asset Identity;
* Attempt Identity.

---

# 59. Transfer Attempt

A Transfer may require multiple Attempts.

Each Attempt shall have separate identity and diagnostics.

---

# 60. Transfer Ordering

Transfer order may be constrained by dependencies.

Examples include:

* identity records before references;
* Assets before dependent activation;
* baseline before incremental changes;
* parent Version before child Version.

The Sync Engine owns semantic dependency planning.

Integration enforces the planned order.

---

# 61. Transport

Synchronization transport may use:

* filesystem;
* NAS;
* local network;
* HTTP;
* WebSocket;
* object storage;
* Provider APIs;
* removable media;
* another approved mechanism.

Transport shall not redefine synchronization semantics.

---

# 62. Transport Adapter

A Transport Adapter owns:

* connection establishment;
* framing;
* message delivery;
* streaming;
* transport errors;
* cancellation propagation;
* backpressure.

It does not own conflict policy.

---

# 63. Filesystem Transport

Filesystem-based synchronization may exchange:

* manifests;
* snapshots;
* Change Sets;
* staging directories;
* completion markers.

Filesystem layout shall not become the Domain model.

---

# 64. NAS Transport

NAS synchronization uses Storage Integration capabilities to exchange synchronization artifacts.

The NAS may simultaneously act as:

* Library Source of Truth;
* physical synchronization Endpoint.

These roles shall remain conceptually distinct.

---

# 65. NAS Source of Truth Semantics

The fact that the NAS is the Source of Truth does not eliminate the need for:

* Version validation;
* local divergence detection;
* external modification detection;
* safe reconciliation.

---

# 66. Remote Transport

Remote synchronization transport shall use approved:

* authentication;
* encryption;
* endpoint validation;
* timeout;
* retry;
* rate limiting.

---

# 67. Removable Media Transport

Synchronization through removable media may use portable synchronization packages.

The media may be disconnected at any time.

Partial transfer and recovery shall be explicit.

---

# 68. Package-Based Synchronization

A synchronization package may contain:

* Manifest;
* Baseline reference;
* Change Sets;
* Assets;
* Tombstones;
* integrity metadata;
* acknowledgements.

Package semantics shall be versioned.

---

# 69. Canonical Exchange Relationship

Synchronization may reuse Canonical Exchange representations.

Canonical Exchange and synchronization remain distinct:

```text
Canonical Exchange
    │
    └── Represents bounded interoperable information.

Synchronization
    │
    └── Coordinates ongoing state convergence.
```

---

# 70. Import Relationship

Received synchronization data shall not be routed through generic Import when it represents governed synchronization state.

The Sync Engine owns synchronization interpretation.

Generic external content still uses Import.

---

# 71. Export Relationship

Sending synchronization data is not ordinary Export.

Synchronization transfer may reuse serialization and exchange infrastructure without becoming an Export workflow.

---

# 72. Acknowledgement

Synchronization acknowledgements shall define what they mean.

An acknowledgement may indicate:

* transport receipt;
* durable receipt;
* validation success;
* application to local state;
* convergence completion.

These meanings shall not be conflated.

---

# 73. Receipt Acknowledgement

Receipt acknowledgement confirms that synchronization data was received at the Integration boundary.

It does not imply canonical application.

---

# 74. Validation Acknowledgement

Validation acknowledgement confirms that the received representation passed required Integration validation.

It does not imply successful conflict resolution or commit.

---

# 75. Application Acknowledgement

Application acknowledgement may indicate that the Sync Engine successfully applied or reconciled the relevant changes.

This acknowledgement belongs to a higher semantic stage.

---

# 76. Checkpoint

A Checkpoint records synchronization progress.

A Checkpoint may include:

* Peer Identity;
* Endpoint Identity;
* Baseline Identity;
* last acknowledged Change Set;
* transfer progress;
* Asset offsets;
* protocol Version.

---

# 77. Checkpoint Identity

Every persistent Checkpoint shall have identity and scope.

A Checkpoint shall not be reused across incompatible:

* Peers;
* Endpoints;
* Protocol Versions;
* synchronization scopes.

---

# 78. Checkpoint Durability

Checkpoints used for recovery shall be persisted durably enough to survive process failure.

---

# 79. Checkpoint Advancement

A Checkpoint shall advance only after the corresponding processing stage reaches the guarantee represented by that Checkpoint.

---

# 80. Cursor

A synchronization cursor may identify a Provider-specific or protocol-specific position.

Cursors shall be:

* opaque;
* scope-bound;
* Endpoint-bound;
* Version-aware.

---

# 81. Cursor Is Not Canonical Version

A Provider cursor shall not become a Domain Version or Knowledge Object Version.

---

# 82. Resumability

Long-running transfers should support resumption where practical.

Resumption shall validate:

* Peer Identity;
* Endpoint Identity;
* Session context;
* Checkpoint;
* remaining data;
* integrity;
* authorization.

---

# 83. Resume Safety

Resumption shall not blindly assume the remote state remains unchanged.

The protocol may require revalidation before continuing.

---

# 84. Retry

Synchronization retry shall be bounded and aware of idempotency.

Retry may occur for:

* connection failure;
* temporary unavailability;
* rate limiting;
* transient Provider failure.

---

# 85. Retry Identity

Retrying the same Change Set or transfer shall preserve its logical identity.

A new Attempt Identity may be created.

---

# 86. Idempotency

Applying or accepting the same synchronization exchange more than once shall not create uncontrolled duplicate effects.

Idempotency may rely upon:

* Change Set Identity;
* object Version;
* Tombstone Version;
* Asset hash;
* Session metadata;
* Peer scope.

---

# 87. Duplicate Change Set

A duplicate Change Set may be:

* acknowledged without reapplication;
* linked to the original result;
* ignored;
* rejected if inconsistent.

---

# 88. Replay

Replay may be used for:

* recovery;
* Endpoint reconstruction;
* audit;
* re-delivery.

Replay shall preserve original synchronization identities.

---

# 89. Replay Safety

Replayed changes shall still undergo:

* compatibility checks;
* validation;
* duplicate detection;
* Sync Engine semantic evaluation.

---

# 90. Ordering

Synchronization shall not assume global ordering across all Peers.

Ordering guarantees may exist:

* per Peer;
* per object;
* per Version lineage;
* per Change Set stream;
* per Asset transfer.

The scope shall be explicit.

---

# 91. Sequence Metadata

Sequence numbers may assist ordered exchange.

Sequence semantics shall define:

* owner;
* scope;
* reset behavior;
* gap behavior;
* wrap or exhaustion behavior where relevant.

---

# 92. Out-of-Order Change Sets

Out-of-order Change Sets may be:

* buffered;
* rejected;
* applied after dependency resolution;
* reconciled through snapshot exchange.

The Sync Engine determines semantic acceptability.

---

# 93. Missing Change Sets

A gap may indicate:

* delayed transfer;
* retention expiration;
* missed synchronization;
* corrupted state;
* incompatible Baseline.

Recovery may require a snapshot.

---

# 94. Conflict Boundary

Synchronization Integration may transport conflict metadata.

It does not resolve conflicts.

The boundary is:

```text
Integration
    │
    └── Delivers divergent Versions and metadata.

Sync Engine
    │
    └── Detects, classifies and resolves according to policy.
```

---

# 95. Conflict Representation

Integration contracts may represent:

* competing Versions;
* expected baseline;
* source Peer;
* timestamps;
* lineage;
* causation metadata;
* conflict identifiers.

---

# 96. No Transport-Level Conflict Resolution

A Transport Adapter or Provider shall never decide:

* latest wins;
* remote wins;
* local wins;
* Source of Truth replacement;
* semantic merge.

---

# 97. Source of Truth Policy

Source of Truth authority belongs to the Library architecture.

Synchronization Integration may carry authority metadata.

It shall not assign authority independently.

---

# 98. NAS Authority

For the primary KnowledgeOS Library, the NAS is the intended Source of Truth.

This does not imply that every physical NAS change is automatically semantically authoritative without validation.

---

# 99. External Modification

External modification of NAS content may enter synchronization discovery through:

* Storage watcher;
* reconciliation scan;
* metadata comparison;
* checksum comparison.

The resulting divergence is evaluated by the Sync Engine.

---

# 100. Synchronization Discovery

Discovery determines what synchronization information appears to differ.

Discovery may use:

* manifests;
* object inventories;
* Version summaries;
* hashes;
* cursors;
* checkpoints;
* timestamps as supporting data.

Discovery does not itself mutate canonical state.

---

# 101. Manifest

A Synchronization Manifest summarizes synchronization-relevant state for a scope.

It may include:

* Peer Identity;
* Endpoint Identity;
* scope;
* object identities;
* Versions;
* Tombstones;
* Asset summaries;
* Baseline metadata;
* protocol Version.

---

# 102. Manifest Size

Large manifests shall support:

* pagination;
* partitioning;
* streaming;
* hierarchical summaries;
* another bounded mechanism.

---

# 103. Manifest Integrity

Manifests used for critical comparison should support integrity validation.

---

# 104. Comparison

Manifest or state comparison may identify candidate divergence.

Semantic divergence classification belongs to the Sync Engine.

---

# 105. Synchronization Plan

The Sync Engine produces a Synchronization Plan.

A Plan may include:

* changes to request;
* changes to send;
* Assets to transfer;
* conflicts requiring resolution;
* expected Baseline;
* dependency ordering;
* verification steps.

Synchronization Integration executes the transfer portion of the Plan.

---

# 106. Plan Identity

Every significant Synchronization Plan shall have identity and reference the state from which it was derived.

---

# 107. Plan Staleness

A Plan may become stale if:

* local state changes;
* remote state changes;
* Endpoint changes;
* authorization changes;
* Baseline changes.

Staleness shall be detected before unsafe execution.

---

# 108. Partial Synchronization

A Session may synchronize only part of the intended scope.

Partial completion shall be explicit.

---

# 109. Partial Result

A Session result may distinguish:

* complete convergence;
* partial transfer;
* transfer completed but conflicts remain;
* remote unavailable;
* local commit failure;
* verification failure;
* cancelled.

---

# 110. Convergence

Convergence is a Platform and Domain property.

Synchronization Integration may report that all planned transfers completed.

It shall not independently declare semantic convergence unless the Sync Engine confirms it.

---

# 111. Session Completion

A Session is complete only according to its declared completion criteria.

Possible criteria include:

* transfer completed;
* transfer verified;
* changes evaluated;
* changes applied;
* convergence confirmed.

The selected criterion shall be explicit.

---

# 112. Cancellation

Synchronization Sessions may be cancelled.

Cancellation shall define:

* active transfer interruption;
* partial data retention;
* checkpoint retention;
* remote cancellation request;
* local staging cleanup;
* resumability.

---

# 113. Cancellation Does Not Roll Back Canonical State Automatically

Canonical changes already committed by the Sync Engine are not automatically reversed by cancelling the Integration Session.

---

# 114. Timeout

Synchronization may define:

* connection timeout;
* negotiation timeout;
* transfer timeout;
* idle timeout;
* verification timeout.

---

# 115. Timeout Does Not Prove Remote Failure

A timeout may leave remote outcome unknown.

Reconciliation may be required.

---

# 116. Ambiguous Transfer

A network failure may occur after the Peer receives a Change Set but before acknowledgement reaches KnowledgeOS.

The Change Set shall not be regenerated with a new logical identity merely because acknowledgement was lost.

---

# 117. Recovery

After interruption, recovery may:

* resume transfer;
* query Peer state;
* replay the same Change Set;
* rebuild the Session;
* establish a new Baseline;
* require full snapshot exchange.

---

# 118. Crash Recovery

Persisted synchronization state should enable recovery after process termination.

Recovery shall validate current:

* local state;
* Peer state;
* protocol compatibility;
* authorization;
* Checkpoint.

---

# 119. Session Persistence

Session operational state may persist:

* Session Identity;
* Peer;
* Endpoint;
* protocol Version;
* Plan reference;
* transfer state;
* Checkpoints;
* attempt history.

Credentials shall not be embedded directly.

---

# 120. Authentication

Peers shall be authenticated where the synchronization model requires trusted identity.

Authentication mechanisms may include:

* local device identity;
* mutual certificates;
* OAuth;
* signed credentials;
* Provider authentication;
* shared secure enrollment.

---

# 121. Authorization

Authentication does not grant unrestricted synchronization authority.

Authorization may restrict:

* scope;
* direction;
* Library;
* operation type;
* Assets;
* Version history;
* deletion propagation.

---

# 122. Peer Enrollment

New trusted Peers may require explicit enrollment.

Enrollment may establish:

* Peer Identity;
* cryptographic identity;
* allowed scope;
* trust classification;
* supported capabilities.

---

# 123. Peer Revocation

A Peer may be revoked.

Revocation shall prevent new authorized Sessions.

Active Sessions may be terminated according to policy.

---

# 124. Credential Isolation

Synchronization credentials shall remain behind the Integration and Provider boundaries.

They shall not enter:

* Domain objects;
* Library content;
* Change Set payloads;
* Plugin contracts;
* AI context;
* logs.

---

# 125. OAuth Relationship

OAuth-enabled synchronization Providers shall use `../ExternalServices/OAuth.md`.

Synchronization shall not implement an independent token lifecycle.

---

# 126. Transport Security

Remote synchronization shall protect:

* confidentiality;
* integrity;
* peer authenticity;
* replay resistance where required.

---

# 127. Encryption

Synchronization data may be encrypted:

* at transport level;
* at package level;
* at Asset level;
* through Provider infrastructure.

Encryption does not replace authorization.

---

# 128. Integrity

Transferred synchronization representations shall be integrity-checked where required.

Integrity may use:

* content hashes;
* package digest;
* signatures;
* authenticated transport.

---

# 129. Signature Verification

Signed packages or messages shall define:

* signer identity;
* algorithm;
* signed scope;
* canonicalization.

Valid signature does not imply semantic acceptance.

---

# 130. Replay Attack Protection

Security-sensitive synchronization protocols may use:

* nonces;
* timestamps;
* Session binding;
* identity-bound Change Sets;
* deduplication;
* bounded acceptance windows.

Operational replay and malicious replay shall remain distinguishable.

---

# 131. Data Minimization

Synchronization shall exchange only information required for the configured scope and Plan.

A Peer authorized for one Library subset shall not receive the complete Library.

---

# 132. Privacy

Synchronization may expose sensitive user knowledge.

Privacy policy may restrict:

* eligible Peers;
* eligible Providers;
* data categories;
* external transmission;
* retention;
* logging.

---

# 133. Metadata Privacy

Synchronization metadata may reveal:

* object existence;
* timestamps;
* activity patterns;
* Library structure;
* relationship information.

Metadata shall receive appropriate protection.

---

# 134. Secret Exclusion

Synchronization payloads shall not contain:

* passwords;
* OAuth Refresh Tokens;
* private keys;
* NAS credentials;
* Provider secrets.

---

# 135. Direct NAS Credential Prohibition

A remote Peer shall not receive NAS credentials merely because the NAS is the Source of Truth.

Synchronization data shall be projected through controlled contracts.

---

# 136. Local Device Synchronization

KnowledgeOS may synchronize among:

* macOS;
* iPhone;
* iPad;
* optional Web or service components.

Device platform differences shall remain behind Endpoint and Provider adaptations.

---

# 137. Device Identity

Device Identity may participate in Peer Identity.

Device name alone is insufficient stable identity.

---

# 138. Device Enrollment

A new device may require:

* authenticated user approval;
* cryptographic pairing;
* scope selection;
* trust establishment.

---

# 139. Device Revocation

Revoked devices shall no longer receive new synchronization authority.

Previously downloaded knowledge remains subject to device security and local data policy.

---

# 140. Local Network Synchronization

Local network synchronization may reduce external data egress.

It still requires:

* peer identity;
* authorization;
* protocol compatibility;
* integrity;
* failure handling.

---

# 141. Remote Service Synchronization

Remote services are external dependencies.

Core local access shall not depend upon their continuous availability.

---

# 142. Cloud Synchronization

Cloud synchronization is optional.

It shall not replace the NAS Source of Truth automatically.

---

# 143. Cloud Authority

A cloud Provider shall not become canonical authority merely because it stores synchronized copies.

Changing Source of Truth requires an explicit Library migration or governance decision.

---

# 144. Plugin Participation

Plugins may participate in synchronization only through approved Extension Points and Capabilities.

---

# 145. Plugin Sync Provider

A Plugin may provide:

* Endpoint discovery;
* transport adapter;
* external repository integration;
* serialization adapter.

It shall not own Domain conflict policy.

---

# 146. Plugin Authority

A Plugin cannot expand its authority through synchronization.

Its effective scope remains bounded by granted Plugin capabilities.

---

# 147. Plugin Isolation

Plugins shall not receive:

* unrestricted Library access;
* raw synchronization credentials;
* direct NAS access;
* direct Kernel buses.

---

# 148. MCP Relationship

MCP shall not become the implicit synchronization protocol.

MCP Tools may initiate or inspect approved synchronization operations.

They do not bypass Sync contracts.

---

# 149. Public API Relationship

Public APIs may expose synchronization Commands, Queries and Operation status.

They shall not expose private Provider sessions or raw synchronization credentials.

---

# 150. Event Integration Relationship

Synchronization may emit or consume approved Integration Events.

Event notifications do not replace:

* Change Sets;
* Baselines;
* checkpoints;
* reconciliation;
* convergence.

---

# 151. Webhook Relationship

Webhooks may notify KnowledgeOS of remote synchronization-relevant changes.

A Webhook is a signal.

The Sync Engine still performs authoritative comparison and reconciliation.

---

# 152. Storage Integration Relationship

Synchronization uses Storage Integration to read and write physical state.

Storage Integration does not decide synchronization direction or conflict resolution.

---

# 153. Offline First

Synchronization Integration is fundamental to Offline First operation.

KnowledgeOS devices may operate independently while disconnected.

---

# 154. Offline Local Changes

Local changes may accumulate while the Source of Truth or remote Peers are unavailable.

These changes shall preserve:

* identity;
* Version;
* provenance;
* ordering metadata where required;
* pending synchronization state.

---

# 155. Offline Remote Changes

Remote changes may accumulate independently.

Reconnection may reveal divergence.

Divergence is expected, not exceptional.

---

# 156. Reconnection

When connectivity returns, KnowledgeOS shall:

1. authenticate the Peer;
2. validate Endpoint compatibility;
3. discover current state;
4. validate Baselines;
5. create or refresh the Synchronization Plan;
6. exchange required information;
7. delegate conflict and convergence decisions to the Sync Engine.

---

# 157. No Blind Replay After Reconnection

Pending local operations shall not be replayed blindly against changed remote state.

Expected Versions and current Baselines shall be considered.

---

# 158. Network Flapping

Repeated connection and disconnection shall not create uncontrolled duplicate transfers or Sessions.

---

# 159. Deferred Synchronization

Synchronization may be deferred because of:

* offline state;
* user policy;
* battery policy;
* cost;
* network classification;
* Endpoint unavailability;
* conflict requiring review.

---

# 160. Scheduling

The Kernel Scheduler may determine when synchronization work executes.

Scheduling policy shall not redefine synchronization semantics.

---

# 161. Background Execution

Background synchronization shall respect platform-specific execution limits.

Partial background execution shall preserve recoverable state.

---

# 162. Resource Limits

Synchronization shall enforce limits for:

* Session count;
* concurrent transfers;
* payload size;
* Change Set size;
* Asset size;
* temporary storage;
* bandwidth;
* retry count;
* execution duration.

---

# 163. Bandwidth Policy

Synchronization may adapt to:

* metered networks;
* low bandwidth;
* user preferences;
* background restrictions.

---

# 164. Compression

Synchronization transfers may use compression.

Compression support shall be negotiated or contractually defined.

---

# 165. Backpressure

Synchronization pipelines shall support bounded backpressure.

Unbounded in-memory queues are prohibited.

---

# 166. Concurrency

Multiple Sessions may operate concurrently only when their scopes and invariants permit it.

---

# 167. Session Locking

Operational Session coordination may prevent incompatible simultaneous synchronization for the same scope.

Operational locks are not Domain conflict resolution.

---

# 168. Parallel Transfer

Independent Assets or Change Sets may transfer in parallel.

Parallelism shall preserve:

* dependency ordering;
* integrity;
* deterministic assembly;
* Resource limits.

---

# 169. Transactions

KnowledgeOS shall not assume distributed transactions across synchronization Peers.

---

# 170. Local Commit and Remote Commit

Local and remote state changes generally cannot commit atomically.

The architecture therefore relies upon:

* idempotency;
* checkpoints;
* acknowledgements;
* replay;
* reconciliation;
* compensation where meaningful.

---

# 171. Failure Model

Synchronization failures may occur during:

* connection;
* authentication;
* negotiation;
* discovery;
* planning;
* transfer;
* verification;
* application;
* acknowledgement;
* checkpoint persistence.

---

# 172. Failure Categories

Stable categories may include:

* PeerUnavailable;
* EndpointUnavailable;
* AuthenticationFailed;
* AuthorizationDenied;
* ProtocolIncompatible;
* CapabilityUnavailable;
* BaselineInvalid;
* TransferFailed;
* TransferOutcomeUnknown;
* IntegrityFailed;
* CheckpointInvalid;
* RemoteRejected;
* ConflictPending;
* StorageUnavailable;
* ProviderFailure;
* Timeout;
* Cancelled.

---

# 173. Error Translation

Provider-specific failures shall be translated into stable Synchronization Integration errors.

Raw external exceptions shall not cross into Platform contracts.

---

# 174. Failure Isolation

Failure of one Peer or Session shall not:

* corrupt unrelated Library state;
* terminate unrelated Sessions;
* disable local Library access;
* compromise unrelated Providers;
* crash the Kernel.

---

# 175. Partial Failure

A multi-object Session may partially succeed.

The result shall identify:

* transferred data;
* verified data;
* applied data;
* failed items;
* unresolved conflicts;
* recovery actions.

---

# 176. Circuit Breaking

Repeated Endpoint failure may activate circuit-breaking behavior.

Circuit breaking may pause new attempts while preserving pending synchronization state.

---

# 177. Rate Limiting

Remote Peers or Providers may impose rate limits.

KnowledgeOS shall use bounded backoff and preserve recoverable state.

---

# 178. Retention

Synchronization operational records shall have explicit retention policies.

Records may include:

* Sessions;
* Attempts;
* Checkpoints;
* Change Set receipts;
* acknowledgements;
* failure history.

---

# 179. Change Set Retention

Change Sets may be retained for:

* retry;
* replay;
* audit;
* Endpoint recovery.

Retention shall balance reliability, storage and privacy.

---

# 180. Tombstone Retention

Tombstones shall be retained long enough to prevent deleted content from reappearing through stale Peers.

Retention policy belongs to synchronization semantics and shall be coordinated with the Sync Engine.

---

# 181. Baseline Expiration

Baselines may expire when:

* required history is pruned;
* protocol changes;
* scope changes;
* Peer identity changes;
* retention windows close.

Expired Baselines require explicit recovery.

---

# 182. Session Cleanup

Completed or abandoned Session artifacts shall be cleaned according to retention policy.

Temporary transfer data shall not become permanent hidden storage.

---

# 183. Observability

Synchronization Integration shall be observable.

Observable metadata may include:

* Session Identity;
* Peer Identity;
* Endpoint Identity;
* Provider Identity;
* direction;
* protocol Version;
* transferred object count;
* transferred bytes;
* checkpoint state;
* attempt count;
* result;
* failure category.

---

# 184. Logging

Logs shall not contain by default:

* synchronization credentials;
* complete sensitive Change Sets;
* private document content;
* unrestricted NAS paths;
* full Asset contents.

---

# 185. Metrics

Synchronization metrics may include:

* Sessions started;
* Sessions completed;
* Sessions failed;
* Peers available;
* transferred objects;
* transferred Assets;
* transferred bytes;
* retries;
* resumes;
* duplicate Change Sets;
* conflicts detected;
* Baseline resets;
* average Session duration;
* offline queue size.

---

# 186. Latency Metrics

Latency may be measured separately for:

* connection;
* negotiation;
* discovery;
* transfer;
* verification;
* application;
* acknowledgement.

---

# 187. Tracing

A synchronization trace may represent:

```text
Synchronization Request
        │
        ▼
Peer Connection
        │
        ▼
Negotiation
        │
        ▼
State Discovery
        │
        ▼
Plan
        │
        ▼
Transfer
        │
        ▼
Verification
        │
        ▼
Sync Engine Reconciliation
```

---

# 188. Audit

Security-sensitive synchronization operations may produce audit records.

Examples include:

* Peer enrollment;
* Peer revocation;
* Source of Truth migration;
* remote synchronization activation;
* large data transfer;
* deletion propagation;
* synchronization scope expansion.

---

# 189. Synchronization Commands

Possible Integration Commands include:

* RegisterSynchronizationPeer;
* UpdateSynchronizationPeer;
* RemoveSynchronizationPeer;
* EnableSynchronizationEndpoint;
* DisableSynchronizationEndpoint;
* OpenSynchronizationSession;
* PauseSynchronizationSession;
* ResumeSynchronizationSession;
* CancelSynchronizationSession;
* SendSynchronizationChangeSet;
* AcknowledgeSynchronizationChangeSet;
* ResetSynchronizationBaseline;
* ReconcileSynchronizationEndpoint.

These Commands modify Integration operational state or perform bounded exchange.

---

# 190. Synchronization Queries

Possible Integration Queries include:

* GetSynchronizationPeer;
* ListSynchronizationPeers;
* GetSynchronizationEndpoint;
* ListSynchronizationEndpoints;
* GetSynchronizationCapabilities;
* GetSynchronizationSession;
* GetSynchronizationStatus;
* GetSynchronizationCheckpoint;
* GetSynchronizationBaseline;
* GetSynchronizationTransferStatus;
* CheckSynchronizationCompatibility.

Queries do not mutate canonical knowledge.

---

# 191. Synchronization Events

Operational Events may include:

* SynchronizationPeerRegistered;
* SynchronizationPeerRevoked;
* SynchronizationEndpointAvailable;
* SynchronizationEndpointUnavailable;
* SynchronizationSessionOpened;
* SynchronizationNegotiated;
* SynchronizationChangeSetReceived;
* SynchronizationChangeSetSent;
* SynchronizationTransferCompleted;
* SynchronizationCheckpointAdvanced;
* SynchronizationBaselineInvalidated;
* SynchronizationSessionCompleted;
* SynchronizationSessionFailed;
* SynchronizationRecoveryRequired.

These are operational Events unless explicitly projected otherwise.

---

# 192. Event Boundary

Synchronization operational Events shall not automatically become Domain Events.

---

# 193. Testing Requirements

Synchronization Integration shall be tested through:

* protocol compatibility tests;
* Peer authentication tests;
* authorization tests;
* capability negotiation tests;
* snapshot tests;
* Change Set tests;
* Baseline tests;
* Checkpoint tests;
* retry tests;
* resumability tests;
* duplicate delivery tests;
* out-of-order tests;
* integrity tests;
* offline tests;
* NAS disconnection tests;
* failure-isolation tests;
* security tests.

---

# 194. Protocol Testing

Tests shall verify:

* supported Version negotiation;
* incompatible Version rejection;
* optional Capability negotiation;
* required Capability failure;
* message-size limits;
* malformed envelope rejection.

---

# 195. Peer Testing

Tests shall include:

* valid trusted Peer;
* unknown Peer;
* revoked Peer;
* identity mismatch;
* Endpoint migration;
* trust-policy change.

---

# 196. Baseline Testing

Tests shall include:

* valid Baseline;
* missing Baseline;
* stale Baseline;
* incompatible Baseline;
* expired Baseline;
* Baseline reset.

---

# 197. Change Set Testing

Tests shall include:

* valid Change Set;
* duplicate Change Set;
* missing dependency;
* out-of-order Change Set;
* invalid integrity;
* unsupported Version;
* partial transfer.

---

# 198. Checkpoint Testing

Tests shall include:

* successful advancement;
* crash before advancement;
* crash after advancement;
* invalid Checkpoint;
* Endpoint mismatch;
* protocol mismatch.

---

# 199. Retry Testing

Tests shall verify that retry:

* preserves logical identities;
* does not create duplicate canonical effects;
* remains bounded;
* handles lost acknowledgement;
* handles ambiguous transfer.

---

# 200. Offline Testing

Offline tests shall verify:

* local work continues;
* pending changes remain traceable;
* no remote assumption is made;
* reconnect validates Baselines;
* duplicate exchange is controlled;
* conflicts are delegated to the Sync Engine.

---

# 201. NAS Testing

NAS synchronization tests shall include:

* NAS unavailable at startup;
* NAS disconnect during discovery;
* NAS disconnect during transfer;
* NAS reconnect;
* external modification;
* changed mount path;
* read-only NAS;
* capacity exhaustion.

---

# 202. Security Testing

Security tests shall include:

* forged Peer;
* replayed Change Set;
* tampered Asset;
* stolen Session metadata;
* unauthorized scope expansion;
* credential leakage;
* malformed package;
* path traversal through filesystem transport.

---

# 203. Failure Injection

Testing should inject:

* network loss;
* process crash;
* Provider timeout;
* partial write;
* corrupted Checkpoint;
* lost acknowledgement;
* duplicate message;
* out-of-order transfer.

---

# 204. Governance

Synchronization Integration is a foundational architectural boundary.

Changes affecting:

* Peer Identity;
* Endpoint Identity;
* protocol Version;
* Baseline semantics;
* Checkpoint semantics;
* Change Set identity;
* acknowledgement meaning;
* transport security;
* Source of Truth interaction;

require architectural review.

---

# 205. Synchronization Integration Invariants

The following invariants apply.

* Synchronization Integration belongs to the Integration layer.
* Synchronization Integration exchanges synchronization information.
* Synchronization Integration does not own canonical synchronization semantics.
* The Sync Engine owns synchronization orchestration and convergence decisions.
* The Domain owns canonical identity, Version meaning and invariants.
* The Library owns Source of Truth policy.
* Peer Identity is distinct from Endpoint Identity.
* Endpoint Identity is distinct from network address or mount path.
* Session Identity is distinct from Peer and operation identities.
* Provider-specific protocol objects remain behind Integration adapters.
* Protocol Version is distinct from Domain and object Versions.
* Capability support does not imply authorization.
* Pull does not imply automatic canonical acceptance.
* Push does not grant unrestricted Library access.
* Bidirectional synchronization requires explicit Baseline and conflict policy.
* Baselines are scope-bound.
* Change Sets have stable identity.
* Change Sets are not automatically Domain transactions.
* Absence does not imply deletion.
* Tombstones represent deletion explicitly where required.
* Asset transfers remain temporary until verified and accepted.
* Transport ordering does not define semantic ordering automatically.
* Acknowledgement meaning is explicit.
* Receipt acknowledgement does not imply canonical application.
* Checkpoints advance only after their represented guarantee is satisfied.
* Provider cursors never become Domain Versions.
* Retry preserves logical synchronization identity.
* Duplicate Change Sets do not create uncontrolled duplicate effects.
* Integration may carry conflict metadata but never resolves conflicts.
* Transport adapters never choose local-wins, remote-wins or latest-wins policy.
* The NAS remains the intended Library Source of Truth.
* A cloud or remote Peer does not become canonical authority automatically.
* Storage watchers and Webhooks are signals, not synchronization semantics.
* Core local knowledge access remains independent from remote synchronization availability.
* Offline divergence is expected.
* Reconnection triggers discovery and planning rather than blind replay.
* Synchronization credentials remain isolated.
* Synchronization operational state is not canonical knowledge.

---

# 206. Prohibited Behaviors

Synchronization Integration shall never:

* allow external protocol messages to mutate Domain state directly;
* duplicate the semantic responsibilities of the Sync Engine;
* allow a Provider to resolve Domain conflicts independently;
* infer Source of Truth authority from transport location;
* treat a cloud copy as canonical authority automatically;
* use network address as stable Peer Identity;
* use mount path as stable Endpoint Identity;
* treat a Provider cursor as canonical Version;
* interpret absence as deletion without explicit protocol semantics;
* regenerate Change Set identity merely because acknowledgement was lost;
* retry non-idempotent synchronization effects blindly;
* advance Checkpoints before the represented processing guarantee completes;
* assume global event or change ordering;
* assume timeout means transfer failed;
* assume cancellation rolled back canonical state;
* treat transport completion as semantic convergence;
* expose raw synchronization credentials to Domain components;
* embed NAS credentials in synchronization packages;
* expose unrestricted Library or NAS access to Plugins;
* expose raw synchronization Provider interfaces through Public APIs;
* use MCP as an implicit synchronization protocol;
* use Webhooks as the synchronization architecture;
* use filesystem watchers as the synchronization architecture;
* bypass validation for trusted Peers;
* make core local operation depend upon continuous network synchronization.

---

# 207. Related Documents

* `../README.md`
* `../Storage/README.md`
* `../Providers/ProviderModel.md`
* `../Providers/SyncProviders.md`
* `../DataExchange/CanonicalExchange.md`
* `../DataExchange/Serialization.md`
* `../ExternalServices/EventIntegration.md`
* `../ExternalServices/OAuth.md`
* `../ExternalServices/Webhooks.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/ExtensionPoints.md`
* `../PublicAPI/APIConventions.md`
* `../../04-Platform/Sync/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../02-Domain/KnowledgeObject/Identity.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`
* `../../02-Domain/KnowledgeObject/Provenance.md`
* `../../02-Domain/KnowledgeLifecycle.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/WorkflowEngine.md`
* `../../06-Execution/Concurrency/Idempotency.md`
* `../../06-Execution/Concurrency/RetryPolicies.md`
* `../../06-Execution/Concurrency/Transactions.md`
* `../../06-Execution/Messaging/EventOrdering.md`
* `../../06-Execution/Reliability/Checkpointing.md`
* `../../06-Execution/Reliability/Recovery.md`
* `../../06-Execution/Runtime/ExecutionContext.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 208. Status

**Approved**

This document defines the architectural model governing Synchronization Integration within KnowledgeOS.

Synchronization Integration belongs to the Integration layer.

It provides the Peers, Endpoints, Sessions, protocols, transports, Change Sets, Baselines, Checkpoints, envelopes and adapters required to exchange synchronization information across devices and external systems.

It does not define canonical synchronization meaning.

The Domain owns identity, Version semantics and invariants.

The Library owns Source of Truth policy.

The Sync Engine owns divergence analysis, conflict policy, reconciliation and convergence.

Synchronization Providers translate external systems and protocols into stable Integration contracts.

Physical addresses, mount paths, Provider cursors and transport identities never become canonical knowledge identities.

The NAS remains the primary intended Source of Truth for the Library.

Remote or cloud copies do not become canonical authority automatically.

Change Sets have stable identity.

Retries preserve logical identity.

Duplicate delivery is expected and handled idempotently.

Acknowledgements have explicit meaning.

Receipt does not imply canonical application.

Transfer completion does not imply semantic convergence.

Baselines and Checkpoints are scoped and validated.

Offline divergence is expected.

Reconnection performs discovery, planning and governed reconciliation rather than blind replay.

Synchronization credentials remain isolated.

Plugins, Public APIs, MCP integrations, Webhooks and Storage watchers never bypass the Sync Engine or Domain invariants.

Synchronization Integration allows KnowledgeOS to exchange state reliably across devices, NAS infrastructure and external systems without allowing transport protocols or Providers to become the owners of knowledge semantics.
