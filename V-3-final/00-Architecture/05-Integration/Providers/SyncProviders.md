
# Sync Providers

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Providers

**Document:** Sync Providers

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model for Synchronization Providers in KnowledgeOS.

Sync Providers implement replaceable communication and transfer capabilities used by the Sync Engine to exchange synchronization artifacts between Synchronization Endpoints.

Sync Providers transport synchronization data.

They never own canonical knowledge.

They never define synchronization semantics.

They never resolve conflicts.

---

# 2. Scope

This document governs Providers that implement synchronization transport capabilities including:

* local filesystem synchronization;
* NAS synchronization;
* WebDAV synchronization;
* object-storage synchronization;
* iCloud synchronization;
* cloud-drive synchronization;
* peer-to-peer synchronization;
* local-network synchronization;
* self-hosted synchronization;
* remote service synchronization;
* removable-media synchronization;
* archive-based synchronization;
* future synchronization transports.

This document also governs:

* Sync Provider identity;
* Endpoint communication;
* transport capability declarations;
* authentication;
* transfer semantics;
* batch transfer;
* streaming transfer;
* resumable transfer;
* integrity verification;
* compression;
* encryption;
* remote change notification;
* Provider health;
* Provider availability;
* execution locality;
* observability.

This document does not govern:

* canonical knowledge;
* synchronization planning;
* change detection;
* Change Set construction;
* conflict detection semantics;
* conflict resolution;
* canonical integration;
* synchronization policy;
* Source of Truth selection;
* Library authority;
* backup policy;
* Storage Provider semantics;
* user interface;
* Provider packaging.

---

# 3. Architectural Position

Sync Providers belong to the Integration layer.

They connect the Platform Sync Engine with concrete transport and Endpoint technologies.

```text
Knowledge Engine
        │
        ▼
Canonical Changes
        │
        ▼
Sync Engine
        │
        ▼
Sync Capability Contract
        │
        ▼
Sync Provider
        │
        ▼
Synchronization Endpoint
```

The Sync Engine orchestrates synchronization.

The Sync Provider performs concrete communication and transfer.

---

# 4. Core Principle

The KnowledgeOS Sync Engine shall never depend directly upon a specific cloud service, filesystem protocol, vendor SDK or synchronization technology.

The dependency direction is:

```text
Sync Engine
    │
    ▼
Sync Contract
    │
    ▼
Sync Provider
    │
    ▼
Concrete Transport
```

Never:

```text
Sync Engine
    │
    ▼
Concrete Cloud SDK
```

Technology-specific communication remains behind the Sync Provider boundary.

---

# 5. Sync Provider Definition

A Sync Provider is a replaceable implementation of one or more Synchronization Capability Contracts.

Conceptually:

```text
Sync Provider
│
├── Identity
├── Version
├── Capabilities
├── Endpoint Types
├── Configuration
├── Authentication
├── Connection
├── Transfer
├── Integrity
├── Resumption
├── Health
└── Lifecycle
```

A Sync Provider may support one Endpoint type or multiple closely related Endpoint types.

A transport protocol is not a Sync Provider.

The Provider is the architectural integration boundary.

---

# 6. Provider and Endpoint Separation

KnowledgeOS shall distinguish between:

* Sync Provider;
* Synchronization Endpoint;
* Synchronization Session;
* Change Set;
* Transfer Unit;
* Sync Capability;
* Storage Repository.

Example:

```text
Provider
    WebDAV Sync Provider

Endpoint
    Personal NAS WebDAV Endpoint

Session
    Session 2026-07-11-01

Change Set
    Canonical changes from revision 42 to 47

Transfer Unit
    Encrypted package 003

Repository
    Main Knowledge Library
```

These concepts shall never be treated as equivalent.

---

# 7. Sync Provider Responsibilities

A Sync Provider is responsible for:

* implementing declared Sync Contracts;
* validating Provider-specific configuration;
* connecting to Synchronization Endpoints;
* authenticating with Endpoints;
* uploading Transfer Units;
* downloading Transfer Units;
* listing remote synchronization artifacts where supported;
* reading remote Endpoint metadata;
* writing remote Endpoint metadata when authorized;
* supporting resumable transfer where declared;
* preserving transfer integrity;
* reporting transport failures;
* exposing health and availability;
* exposing transport constraints;
* supporting cancellation where possible;
* translating technology-specific failures into canonical failures.

A Sync Provider is not responsible for:

* detecting canonical changes;
* deciding synchronization direction;
* constructing semantic Change Sets;
* deciding which objects are authoritative;
* resolving conflicts;
* modifying canonical knowledge;
* integrating received changes;
* choosing itself globally;
* determining synchronization schedules;
* managing Library organization;
* redefining Endpoint identity.

---

# 8. Sync Engine Responsibilities

The Platform Sync Engine remains responsible for:

* synchronization request validation;
* Endpoint selection;
* synchronization planning;
* direction selection;
* Change Detection;
* Change Set construction;
* dependency ordering;
* Provider resolution and selection;
* transfer orchestration;
* retry coordination;
* conflict detection;
* validation coordination;
* synchronization reporting;
* Knowledge Engine integration requests;
* provenance recording.

The Provider transfers.

The Sync Engine orchestrates.

---

# 9. Knowledge Engine Responsibilities

The Knowledge Engine remains responsible for:

* canonical identity;
* canonical version validation;
* canonical integration;
* conflict resolution;
* invariant enforcement;
* provenance preservation;
* accepted state transitions.

The Sync Provider shall never bypass the Knowledge Engine.

---

# 10. Provider Independence

KnowledgeOS shall support multiple Sync Providers simultaneously.

Examples may include:

* local filesystem Providers;
* NAS Providers;
* WebDAV Providers;
* S3-compatible Providers;
* iCloud Providers;
* cloud-drive Providers;
* peer-to-peer Providers;
* custom self-hosted Providers;
* removable-media Providers;
* Plugin-provided Providers.

No Sync Provider shall become an architectural dependency of the Sync Engine.

---

# 11. Sync Capability Model

Sync Providers expose Capabilities rather than concrete vendor names.

Typical Capabilities may include:

```text
Sync.EndpointConnect
Sync.EndpointAuthenticate
Sync.Upload
Sync.Download
Sync.ListRemoteChanges
Sync.ReadRemoteManifest
Sync.WriteRemoteManifest
Sync.ResumableTransfer
Sync.MultipartTransfer
Sync.RangeTransfer
Sync.RemoteWatch
Sync.RemoteDelete
Sync.RemoteMove
Sync.RemoteLock
Sync.IntegrityVerification
Sync.EncryptedTransfer
Sync.CompressedTransfer
```

Canonical Capability identities shall be governed by the Capability Registry.

---

# 12. Capability Granularity

Sync Capabilities shall be granular enough to support meaningful Provider resolution.

A Provider supporting upload shall not automatically be assumed to support:

* resumable upload;
* multipart upload;
* remote locking;
* remote change notification;
* conditional writes;
* server-side copy;
* version history;
* encrypted transfer;
* bidirectional synchronization.

Each supported Feature shall be declared explicitly.

---

# 13. Synchronization Endpoint

A Synchronization Endpoint is a configured external or local participant in synchronization.

An Endpoint may represent:

* device;
* NAS;
* local folder;
* self-hosted server;
* cloud repository;
* removable medium;
* peer device;
* backup exchange location.

Endpoint identity shall remain stable and independent from temporary network address or mount point.

---

# 14. Endpoint Identity

Every Synchronization Endpoint shall have a stable identity.

Endpoint Identity shall remain independent from:

* hostname;
* filesystem path;
* IP address;
* mount point;
* access token;
* user-facing display name;
* current connection.

Endpoint identity represents the synchronization participant.

---

# 15. Endpoint Descriptor

An Endpoint Descriptor may include:

* Endpoint Identity;
* Endpoint Type;
* Provider Identity;
* display name;
* execution locality;
* supported Capabilities;
* authentication requirements;
* transport security;
* consistency characteristics;
* capacity characteristics;
* health;
* availability;
* policy metadata.

Endpoint Descriptors are operational metadata.

They do not contain canonical knowledge.

---

# 16. Endpoint Types

Typical Endpoint Types include:

* Device Local;
* Local Folder;
* NAS;
* Local Network Service;
* Self-Hosted Remote;
* External Remote;
* Peer Device;
* Removable Media;
* Archive Exchange.

Endpoint Type supports policy and Provider resolution.

It does not define canonical authority.

---

# 17. Endpoint Authority

An Endpoint may be designated by Platform policy as:

* authoritative;
* primary;
* replica;
* cache;
* backup;
* exchange-only.

Authority is a Platform policy decision.

The Sync Provider shall never assign authority to an Endpoint.

---

# 18. Source of Truth

A Library Source of Truth may be hosted at an Endpoint.

The Provider exposes communication with that Endpoint.

It does not define Source of Truth semantics.

For KnowledgeOS, a NAS may be selected as the authoritative Library location while device-local copies act as working replicas.

That authority belongs to Library and synchronization policy.

---

# 19. Sync Request Model

The Sync Engine shall communicate with Sync Providers through canonical Sync Requests.

A request may include:

* Request Identity;
* Synchronization Session Identity;
* source Endpoint;
* target Endpoint;
* transfer direction;
* Transfer Unit references;
* expected remote state;
* integrity metadata;
* conditional transfer metadata;
* timeout;
* cancellation context;
* retry context;
* correlation metadata.

Provider-specific request types shall remain internal to the Provider.

---

# 20. Transfer Unit

A Transfer Unit is the Provider-facing package transported between Endpoints.

A Transfer Unit may contain:

* Change Set fragment;
* object payload;
* Asset payload;
* manifest fragment;
* dependency metadata;
* provenance metadata;
* integrity metadata;
* encryption metadata;
* compression metadata.

The Sync Engine defines Transfer Unit semantics.

The Provider transports the unit.

---

# 21. Change Set and Transfer Unit Separation

A Change Set is a semantic synchronization artifact.

A Transfer Unit is a transport artifact.

```text
Change Set
    │
    ▼
Packaging
    │
    ▼
Transfer Units
    │
    ▼
Sync Provider
```

A Change Set may be divided into multiple Transfer Units.

A Transfer Unit shall not redefine Change Set meaning.

---

# 22. Transfer Manifest

A transfer may include a Manifest describing:

* Transfer Unit identities;
* sequence;
* dependencies;
* expected hashes;
* encryption metadata;
* compression metadata;
* completeness;
* source Endpoint;
* target Endpoint;
* session identity.

The Transfer Manifest is operational.

It is not canonical knowledge.

---

# 23. Upload

Upload transfers synchronization artifacts from the local execution context to a target Endpoint.

Upload semantics shall define:

* visibility point;
* commit point;
* partial upload behavior;
* resumability;
* integrity verification;
* overwrite rules;
* conditional-write behavior.

A successful network transfer does not necessarily imply remote commit unless the Provider Contract guarantees it.

---

# 24. Download

Download retrieves synchronization artifacts from an Endpoint.

Download semantics shall define:

* version or object selection;
* partial transfer behavior;
* integrity verification;
* resumability;
* temporary storage;
* completion.

Downloaded artifacts shall be validated before canonical integration.

---

# 25. Bidirectional Transfer

A Provider may support communication in both directions.

Bidirectional transport support does not make the Provider responsible for bidirectional synchronization planning.

The Sync Engine decides direction and sequence.

---

# 26. Listing Remote State

Providers may support listing remote synchronization artifacts.

Listing may include:

* remote manifests;
* Transfer Units;
* version markers;
* timestamps;
* tombstones;
* object identifiers;
* continuation tokens.

Remote listings are transport evidence.

They do not define canonical state.

---

# 27. Remote Manifest

An Endpoint may maintain a remote synchronization Manifest.

A remote Manifest may describe:

* known Change Sets;
* transfer state;
* Endpoint revision;
* object availability;
* tombstones;
* capability metadata.

The Sync Engine interprets remote Manifest semantics.

The Provider reads and writes it.

---

# 28. Remote Revision

An Endpoint may expose an operational revision or cursor.

Remote revision is distinct from:

* Domain version;
* Knowledge Object version;
* Library revision;
* Storage Provider version.

The Provider shall preserve this distinction.

---

# 29. Conditional Transfer

A Provider may support conditional transfer based upon:

* expected remote revision;
* expected hash;
* object absence;
* object presence;
* remote lock;
* ETag;
* version token.

Conditional transfer supports safe concurrency.

It does not resolve semantic conflicts.

---

# 30. Resumable Transfer

A Provider may support resumable upload or download.

Resumable transfer shall define:

* session identity;
* checkpoint;
* transferred ranges;
* completion state;
* expiration;
* integrity behavior;
* cancellation behavior.

Resume state is operational and disposable after completion.

---

# 31. Multipart Transfer

Large artifacts may be divided into multiple parts.

Multipart semantics shall define:

* part identity;
* ordering;
* integrity;
* retry;
* commit;
* incomplete-session cleanup.

An incomplete multipart transfer shall never be treated as complete.

---

# 32. Range Transfer

A Provider may support range reads or writes.

Range transfer may improve:

* resumption;
* large Asset transfer;
* partial verification;
* bandwidth efficiency.

Range semantics shall preserve final object integrity.

---

# 33. Streaming Transfer

A Provider may support streaming transfer.

Streaming shall define:

* ordering;
* buffering;
* backpressure;
* cancellation;
* partial transfer;
* integrity verification;
* completion.

Streaming does not relax validation requirements.

---

# 34. Batch Transfer

A Provider may support transferring multiple units in a batch.

Batch semantics shall define:

* ordering;
* atomicity;
* partial completion;
* error reporting;
* retry;
* cancellation.

Batch support shall not imply transactionality unless explicitly declared.

---

# 35. Transfer Ordering

Transfer ordering may be required when Change Set dependencies exist.

The Sync Engine determines semantic order.

The Provider preserves the requested transfer sequence where the Contract requires it.

---

# 36. Parallel Transfer

Providers may support parallel transfer.

Parallelism may be constrained by:

* Endpoint;
* network;
* rate limits;
* object dependencies;
* bandwidth;
* memory;
* Provider policy.

The Execution layer governs scheduling.

The Provider exposes relevant constraints.

---

# 37. Compression

Sync Providers may support transfer compression.

Compression may be:

* Platform-managed;
* Provider-managed;
* per Transfer Unit;
* per session.

Compression shall not alter semantic content.

Compression metadata shall be explicit.

---

# 38. Encryption in Transit

Remote transfer shall use approved transport security where required.

Transport encryption shall be explicit.

Secure transport and payload encryption are distinct.

---

# 39. Payload Encryption

KnowledgeOS may encrypt Transfer Units before Provider execution.

```text
Transfer Unit
    │
    ▼
Payload Encryption
    │
    ▼
Encrypted Transfer Unit
    │
    ▼
Sync Provider
```

The Provider may treat encrypted content as opaque.

---

# 40. Provider-Managed Encryption

A Provider may implement transport- or Endpoint-specific encryption.

Provider-managed encryption shall expose sufficient metadata for security policy evaluation.

Secret keys shall remain outside Manifests and logs.

---

# 41. Integrity Verification

Sync Providers shall support integrity verification where required.

Integrity may be verified:

* before transfer;
* during transfer;
* after transfer;
* before remote commit;
* after download.

A transfer shall not be considered successful until required integrity checks pass.

---

# 42. Transfer Hashes

Transfer Units may include cryptographic hashes.

Hashes may support:

* corruption detection;
* duplicate detection;
* resume verification;
* conditional transfer;
* final validation.

Hash algorithm and canonical byte representation shall be explicit.

---

# 43. End-to-End Integrity

End-to-end integrity compares the artifact prepared by the Sync Engine with the artifact received after transfer.

Transport-level success alone is insufficient.

The Provider shall report integrity results explicitly.

---

# 44. Duplicate Transfer Detection

Providers or Endpoints may support duplicate detection.

Duplicate detection may use:

* Transfer Unit Identity;
* Idempotency Key;
* content hash;
* session identity;
* remote revision.

Duplicate detection supports idempotency.

It does not redefine semantic change identity.

---

# 45. Idempotency

Sync Provider operations shall define idempotency semantics.

Examples include:

* upload with immutable Transfer Unit Identity;
* create-if-absent;
* overwrite-if-version-matches;
* remote Manifest update with expected revision.

Repeated execution using the same valid Idempotency Key shall follow declared guarantees.

---

# 46. Transfer Commit

A successful transfer shall define its commit semantics.

Possible guarantees include:

* accepted by Provider;
* uploaded to temporary remote state;
* committed to Endpoint;
* visible to readers;
* integrity verified;
* remote Manifest updated.

Success shall not remain ambiguous.

---

# 47. Ambiguous Transfer Outcome

A timeout or connection failure may leave transfer outcome unknown.

The Provider shall report an explicit ambiguous-state failure when it cannot determine whether the remote commit occurred.

Recovery may use:

* Idempotency Key;
* remote lookup;
* Transfer Unit hash;
* session state;
* expected revision.

---

# 48. Partial Transfer

A Sync Provider shall distinguish:

* no transfer;
* partial transfer;
* complete unverified transfer;
* complete verified transfer;
* committed transfer;
* ambiguous outcome.

Partial transfer shall never be treated as successful completion.

---

# 49. Temporary Remote State

Providers may use temporary remote state during transfer.

Temporary state may include:

* upload sessions;
* uncommitted parts;
* temporary files;
* staging prefixes;
* provisional Manifests.

Cleanup semantics shall be explicit.

---

# 50. Remote Deletion

A Provider may support remote deletion.

Remote deletion shall require explicit authorization and Sync Engine orchestration.

The Provider shall not infer deletion from missing local artifacts.

---

# 51. Tombstone Transfer

Synchronization may transfer tombstones representing logical deletion.

The Provider transports tombstones.

It does not interpret or resolve deletion semantics.

---

# 52. Remote Move and Rename

Some Providers may support remote move or rename operations.

Physical move semantics shall remain distinct from canonical identity.

A renamed remote artifact does not imply a renamed Knowledge Object.

---

# 53. Remote Locking

A Provider may support remote locks or leases.

Lock support shall declare:

* scope;
* acquisition;
* renewal;
* expiration;
* release;
* failure behavior.

Provider-level locks support concurrency control.

They do not define Domain transactions.

---

# 54. Lock-Free Providers

Some Providers may not support locking.

The Sync Engine shall use version checks, conditional writes or conflict detection as appropriate.

Lock absence shall be explicit.

---

# 55. Remote Change Notifications

Providers may support notifications of remote change.

Examples include:

* filesystem watch;
* push notification;
* webhook;
* polling cursor;
* subscription stream.

Notifications are hints.

The Sync Engine shall validate remote state before integration.

---

# 56. Polling

Providers may support polling remote Endpoint state.

Polling semantics shall define:

* cursor;
* interval constraints;
* pagination;
* rate limits;
* consistency;
* missed-change behavior.

Scheduling belongs to Kernel and Execution.

---

# 57. Event Integration

Remote Provider events may be translated into canonical synchronization signals.

Examples include:

* RemoteChangeAvailable;
* EndpointUnavailable;
* RemoteManifestChanged;
* AuthenticationExpired.

External events shall never directly mutate canonical knowledge.

---

# 58. Endpoint Discovery

Some Providers may support discovering available Endpoints.

Discovery may expose:

* Endpoint identity;
* Endpoint type;
* display name;
* capability metadata;
* health;
* authorization requirement.

Discovery does not establish trust or authority.

---

# 59. Endpoint Registration

Discovered Endpoints shall be registered before synchronization.

Registration records:

* Endpoint Identity;
* Provider Identity;
* configuration;
* authentication reference;
* policy;
* capability metadata.

Registration does not automatically enable synchronization.

---

# 60. Endpoint Compatibility

A Sync Provider and Endpoint are compatible only when required transport semantics can be satisfied.

Compatibility may consider:

* Provider Version;
* Endpoint protocol;
* supported Capabilities;
* authentication;
* transfer limits;
* integrity support;
* conditional-write support;
* remote Manifest version;
* security policy.

---

# 61. Protocol Versioning

Providers using explicit transport protocols shall declare supported protocol versions.

Protocol compatibility shall be negotiated explicitly.

A matching vendor name does not guarantee protocol compatibility.

---

# 62. Synchronization Protocol and Provider Separation

A synchronization protocol defines exchange semantics.

A Sync Provider implements those semantics using concrete technology.

```text
Synchronization Protocol
        │
        ▼
Sync Provider
        │
        ▼
Concrete Transport
```

The protocol remains distinct from the Provider implementation.

---

# 63. Local Folder Provider

A Local Folder Sync Provider may exchange synchronization artifacts through a local directory.

It shall declare:

* filesystem assumptions;
* atomic move support;
* locking support;
* watch support;
* path normalization;
* integrity behavior.

A local folder is an Endpoint, not canonical knowledge.

---

# 64. NAS Sync Provider

A NAS Sync Provider communicates with a NAS Endpoint.

The Provider shall declare:

* protocol;
* connectivity requirements;
* filesystem semantics;
* locking;
* atomicity;
* watch behavior;
* offline behavior;
* consistency characteristics.

NAS authority remains a Platform policy decision.

---

# 65. WebDAV Provider

A WebDAV Sync Provider may implement:

* remote listing;
* upload;
* download;
* conditional requests;
* remote metadata;
* remote deletion;
* locking where supported.

Supported WebDAV Features shall be explicit.

Not all WebDAV servers provide equivalent semantics.

---

# 66. Object-Storage Sync Provider

An object-storage Provider may use:

* object keys;
* multipart transfer;
* conditional writes;
* object metadata;
* versioning;
* event notifications.

Object storage does not provide filesystem semantics by default.

The Provider shall not simulate unsupported guarantees silently.

---

# 67. Cloud-Drive Provider

A cloud-drive Provider may integrate with services exposing file-oriented APIs.

It shall declare:

* file identity behavior;
* rename behavior;
* version behavior;
* conflict-copy behavior;
* change cursor support;
* rate limits;
* local caching behavior.

Vendor conflict semantics shall be translated into canonical signals.

---

# 68. iCloud Provider

An iCloud Provider may integrate with approved Apple storage and synchronization services.

It shall remain behind the Sync Provider Contract.

Platform and Domain components shall never depend directly upon iCloud-specific types or behaviors.

---

# 69. Peer-to-Peer Provider

A peer-to-peer Provider may synchronize directly between devices.

It shall declare:

* discovery;
* pairing;
* authentication;
* encryption;
* connectivity assumptions;
* resumability;
* conflict windows;
* offline coexistence.

Peer-to-peer transport does not remove the need for canonical validation.

---

# 70. Removable-Media Provider

A removable-media Provider may exchange synchronization packages through external drives or removable storage.

It shall declare:

* package structure;
* integrity;
* import and export semantics;
* duplicate detection;
* media removal handling;
* trust assumptions.

Removable media may operate asynchronously and without live Endpoint connectivity.

---

# 71. Archive-Based Provider

An archive-based Provider may create or consume synchronization packages.

Packages may include:

* Transfer Manifest;
* Change Sets;
* Assets;
* tombstones;
* provenance;
* hashes;
* signatures.

Archive exchange is a transport mechanism.

It is not Export Engine output unless explicitly requested as export.

---

# 72. Execution Locality

Every Sync Provider shall declare execution locality.

Typical values include:

* Device Local;
* Local Network;
* Self-Hosted Remote;
* External Remote;
* Peer-to-Peer;
* Removable Offline.

Locality affects:

* privacy;
* availability;
* latency;
* cost;
* data residency;
* Provider selection.

---

# 73. Offline-First Synchronization

KnowledgeOS remains fully operational without synchronization connectivity.

Sync Providers shall support deferred execution.

A disconnected Endpoint shall result in:

* queued synchronization;
* paused session;
* explicit unavailability;
* later retry.

It shall not block local canonical work.

---

# 74. Offline Queue

The Sync Engine may queue work while an Endpoint is unavailable.

The Provider may expose Endpoint availability.

Queue ownership remains with Kernel, Execution and Sync Engine.

The Provider shall not create hidden synchronization queues outside orchestration.

---

# 75. Connectivity Restoration

When connectivity returns, synchronization may resume according to policy.

Resumption shall validate:

* Endpoint identity;
* remote revision;
* local pending changes;
* session validity;
* transfer checkpoint;
* compatibility.

Connectivity restoration shall not imply blind continuation.

---

# 76. Provider Selection

Sync Provider selection belongs to the Sync Engine and Platform policy.

Selection may consider:

* Endpoint Type;
* required Capabilities;
* locality;
* privacy;
* security;
* resumability;
* conditional-write support;
* remote-watch support;
* availability;
* health;
* cost;
* user preference;
* Library policy.

Providers shall not globally select themselves.

---

# 77. Selection by Endpoint

A configured Endpoint normally identifies eligible Providers.

Multiple Providers may support the same Endpoint class.

The Sync Engine resolves the compatible implementation.

---

# 78. Selection by Transfer Requirement

Large or unreliable transfers may require:

* multipart transfer;
* resumability;
* range transfer;
* compression;
* strong integrity verification.

Providers lacking required Features are ineligible.

---

# 79. Local-First Transfer Policy

When multiple compatible Endpoints satisfy the same synchronization purpose, policy may prefer:

* local device;
* local network;
* user-controlled infrastructure;
* external remote infrastructure.

Selection shall remain explicit and user-controllable.

---

# 80. Privacy

Sync Providers may transmit canonical artifacts or encrypted representations.

Privacy policy shall evaluate:

* Endpoint ownership;
* transport locality;
* payload encryption;
* external transmission;
* data residency;
* retention;
* metadata exposure.

Technical compatibility does not imply privacy eligibility.

---

# 81. Metadata Exposure

Even encrypted payload transfer may expose metadata such as:

* object size;
* transfer time;
* Endpoint identity;
* transfer frequency;
* object count.

Metadata exposure shall be considered in privacy policy.

---

# 82. Data Minimization

The Sync Engine shall prepare only required Transfer Units.

The Provider shall transmit only the units included in the request.

A Provider shall never expand transfer scope silently.

---

# 83. Authentication

Sync Providers may require:

* local authorization;
* username and password;
* OAuth;
* API key;
* token;
* client certificate;
* device pairing;
* signed requests.

Secrets shall be managed through approved secret-management Contracts.

---

# 84. Authorization

Authentication establishes identity.

Authorization determines permitted Endpoint operations.

A connected Provider shall not assume permission to:

* read;
* write;
* delete;
* list;
* lock;
* watch.

Capability-specific authorization shall remain explicit.

---

# 85. Provider Configuration

Sync Provider configuration may include:

* Endpoint address;
* protocol;
* authentication reference;
* timeout;
* retry policy;
* concurrency;
* compression;
* encryption;
* remote root;
* watch behavior;
* rate-limit settings;
* temporary-state behavior.

Configuration shall be validated before Endpoint activation.

---

# 86. Endpoint Configuration

Endpoint configuration is distinct from Provider configuration.

Provider configuration defines technology behavior.

Endpoint configuration defines a specific synchronization participant.

---

# 87. Provider Health

Sync Providers shall expose health where practical.

Health may consider:

* runtime availability;
* authentication validity;
* Endpoint reachability;
* read capability;
* write capability;
* remote capacity;
* transfer subsystem;
* notification subsystem;
* configuration validity.

Health is distinct from compatibility.

---

# 88. Endpoint Health

Provider health and Endpoint health may differ.

Example:

```text
Provider:
    Healthy

NAS Endpoint:
    Unavailable

Cloud Endpoint:
    Healthy
```

Synchronization decisions shall consider the specific Endpoint.

---

# 89. Partial Health

An Endpoint may be partially healthy.

Example:

```text
Read:
    Healthy

Write:
    Degraded

Delete:
    Unavailable

Watch:
    Unsupported
```

Capability-specific health should be exposed where possible.

---

# 90. Availability

Sync Provider or Endpoint availability may change because of:

* network loss;
* unmounted volume;
* authentication expiration;
* quota exhaustion;
* service outage;
* rate limiting;
* Endpoint maintenance;
* device sleep;
* peer departure;
* removable-media removal.

Dynamic unavailability does not redefine compatibility.

---

# 91. Capacity and Quota

Providers may expose:

* available storage;
* quota;
* maximum object size;
* maximum request size;
* maximum batch size;
* rate limits;
* retention limits.

Capacity metadata supports synchronization planning.

---

# 92. Rate Limits

Remote Providers may enforce rate limits.

Rate-limit metadata may include:

* request limit;
* transfer limit;
* reset time;
* retry-after;
* concurrency limit.

Rate limits shall be translated into canonical operational signals.

---

# 93. Sync Provider Failure Model

Typical canonical failures include:

* ProviderUnavailable;
* EndpointUnavailable;
* EndpointNotFound;
* AuthenticationFailed;
* AuthorizationFailed;
* PermissionDenied;
* ProtocolUnsupported;
* ProtocolVersionUnsupported;
* CapabilityUnsupported;
* RemoteRevisionConflict;
* ConditionalWriteFailed;
* RemoteLockFailed;
* TransferFailed;
* PartialTransfer;
* IntegrityFailure;
* QuotaExceeded;
* CapacityExceeded;
* RateLimited;
* Timeout;
* Cancelled;
* NetworkFailure;
* EncryptionFailure;
* DecryptionFailure;
* RemoteManifestInvalid;
* ResumeStateInvalid;
* AmbiguousCommitOutcome;
* ExternalServiceFailure.

Provider-specific failures shall be translated into canonical categories.

---

# 94. Conflict Signals

A Provider may report operational conflicts such as:

* remote revision mismatch;
* conditional-write failure;
* remote lock failure;
* duplicate Transfer Unit;
* remote object already exists.

These are synchronization signals.

Semantic conflict detection and resolution remain owned by Sync and Knowledge Engines.

---

# 95. Retry

Retries shall be governed by execution policy.

Retry eligibility depends upon:

* failure category;
* idempotency;
* remote commit state;
* partial transfer state;
* cost;
* rate limits;
* Endpoint health;
* session validity.

Providers shall not perform uncontrolled hidden retries.

---

# 96. Backoff

Retry policies may use:

* fixed delay;
* linear backoff;
* exponential backoff;
* server-directed retry;
* connectivity-triggered retry.

Backoff policy belongs to Execution and Sync orchestration.

---

# 97. Cancellation

Sync Providers shall support cancellation where technically possible.

Cancellation semantics shall define:

* active transfer interruption;
* temporary state cleanup;
* multipart-session handling;
* partial Transfer Unit handling;
* remote commit behavior;
* ambiguous outcome reporting.

Cancellation shall not be reported as successful completion.

---

# 98. Timeout

Sync operations may use explicit timeouts.

Timeouts shall distinguish:

* connection timeout;
* read timeout;
* write timeout;
* session timeout;
* lock timeout;
* remote acknowledgement timeout.

Timeout failure shall preserve commit ambiguity when applicable.

---

# 99. Sync Observability

Sync Provider operations shall be observable.

Observable metadata may include:

* Provider Identity;
* Endpoint Identity;
* Synchronization Session Identity;
* operation type;
* Transfer Unit count;
* transferred bytes;
* direction;
* duration;
* integrity result;
* retry count;
* partial-transfer state;
* failure category;
* locality;
* correlation metadata.

Canonical content shall not be logged.

---

# 100. Metrics

Sync Provider metrics may include:

* sessions;
* uploads;
* downloads;
* bytes transferred;
* average throughput;
* latency;
* failure rate;
* retry count;
* resume count;
* integrity failure count;
* Endpoint availability;
* rate-limit events;
* local versus remote transfers;
* compression ratio;
* duplicate transfer count.

Metrics shall preserve privacy.

---

# 101. Tracing

Sync Provider operations may participate in local or distributed tracing.

A trace may represent:

```text
Synchronization Request
        │
        ▼
Planning
        │
        ▼
Endpoint Resolution
        │
        ▼
Provider Selection
        │
        ▼
Transfer
        │
        ▼
Integrity Validation
        │
        ▼
Knowledge Integration
```

Tracing shall preserve correlation without capturing canonical payload content.

---

# 102. Sync Provider Invariants

The following invariants apply.

* Sync Providers belong to the Integration layer.
* Sync Providers implement public Synchronization Capability Contracts.
* The Sync Engine never depends directly upon concrete transport technologies.
* Sync Providers transport synchronization artifacts.
* Sync Providers never own canonical knowledge.
* Sync Providers never detect semantic canonical changes.
* Sync Providers never construct semantic Change Sets.
* Sync Providers never resolve conflicts.
* Sync Providers never integrate canonical knowledge directly.
* Provider identity is distinct from Endpoint identity.
* Endpoint identity is independent from network address and path.
* Endpoint authority is defined by Platform policy.
* NAS authority is never inferred by the Provider.
* Change Sets are distinct from Transfer Units.
* Remote revisions are distinct from Domain versions.
* Provider-specific types never cross the Provider boundary.
* Transfer commit semantics are explicit.
* Partial transfers are never treated as complete.
* Ambiguous transfer outcomes are explicit.
* Required integrity verification precedes successful completion.
* Transfer scope is explicit and minimal.
* Remote execution and external transmission are explicit.
* Local-to-remote changes in privacy behavior are never hidden.
* Idempotency semantics are explicit.
* Provider selection belongs to Platform policy.
* Offline work never depends upon Provider availability.
* Provider health is distinct from Endpoint health.
* Compatibility is distinct from availability.
* Operational conflict signals never replace semantic conflict resolution.
* Sync execution remains observable and reproducible.

---

# 103. Prohibited Behaviors

Sync Providers shall never:

* mutate canonical knowledge directly;
* define canonical identity;
* define canonical version semantics;
* resolve synchronization conflicts;
* select an authoritative Endpoint;
* infer Source of Truth from Provider technology;
* treat physical path as canonical identity;
* expose vendor SDK objects to Platform consumers;
* hide remote transmission;
* expand transfer scope silently;
* transmit unrelated Library data;
* silently weaken integrity guarantees;
* silently treat partial transfer as complete;
* silently retry non-idempotent operations;
* silently switch Endpoints;
* silently change from local to remote transport;
* interpret missing remote artifacts as canonical deletion;
* perform uncontrolled hidden synchronization;
* bypass the Sync Engine;
* bypass Knowledge Engine integration;
* treat backup storage as an active synchronized replica automatically.

---

# 104. Related Documents

* `ProviderModel.md`
* `AIProviders.md`
* `ExportProviders.md`
* `OCRProviders.md`
* `StorageProviders.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Compatibility.md`
* `../DataExchange/CanonicalExchange.md`
* `../DataExchange/Serialization.md`
* `../../04-Platform/Sync/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Scheduler.md`
* `../../03-Kernel/Observability.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`
* `../../02-Domain/KnowledgeObject/Provenance.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 105. Status

**Approved**

This document defines the architectural model for Synchronization Providers in KnowledgeOS.

Sync Providers integrate replaceable local, NAS, WebDAV, object-storage, cloud, peer-to-peer, removable-media and future transport technologies through stable Synchronization Capability Contracts.

They connect to Endpoints and transport Transfer Units while preserving declared integrity, security, resumability and observability guarantees.

The Sync Engine remains responsible for synchronization planning, Change Detection, Change Set construction, Provider selection, transfer orchestration and conflict detection.

The Knowledge Engine remains responsible for canonical integration and conflict resolution.

Sync Providers transport changes.

They never become the authority of those changes.

---

# 999. Approved Primary Sync Provider Profile

The approved primary Sync Provider profile is iCloud/CloudKit for personal-state synchronization among Apple devices.

NAS synchronization is not part of the primary personal-state profile.

A NAS-facing Provider may support Master Catalog discovery and publication acquisition, but those operations belong to Master Library access and content delivery rather than personal-state synchronization.

Device Libraries shall not be described as working replicas of the NAS Master Library.

Generic Provider capabilities documented above are extensibility capabilities and do not imply that every transport is enabled in the primary product profile.
