
# Local API

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Public API

**Document:** Local API

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural conventions governing the KnowledgeOS Local API.

The Local API exposes approved Platform capabilities to clients executing on the same device, host or trusted local runtime environment.

Typical Local API consumers include:

* first-party applications;
* desktop processes;
* local automation;
* command-line tools;
* local extensions;
* local Providers;
* development tools;
* operating-system integrations;
* approved companion applications.

Local execution reduces remote network exposure.

It never removes architectural boundaries.

It never implies unrestricted trust.

---

# 2. Scope

This document governs:

* Local API identity;
* local transport abstractions;
* local client registration;
* local authentication;
* local authorization;
* process identity;
* application identity;
* capability credentials;
* request and response semantics;
* Commands;
* Queries;
* asynchronous Operations;
* Event streams;
* binary transfer;
* connection lifecycle;
* compatibility negotiation;
* versioning;
* cancellation;
* idempotency;
* observability;
* auditability;
* failure isolation.

This document does not govern:

* Platform business logic;
* Kernel internals;
* operating-system implementation details;
* REST semantics;
* GraphQL Schema design;
* external remote authentication;
* Plugin runtime lifecycle;
* direct in-process private calls;
* arbitrary filesystem access;
* private Engine interfaces.

---

# 3. Definition of the Local API

The Local API is a stable, documented and versioned public interface for local inter-process or approved in-process interaction with KnowledgeOS.

A Local API operation defines:

* public capability;
* request contract;
* response contract;
* client identity requirements;
* authorization requirements;
* transport requirements;
* error semantics;
* compatibility expectations;
* lifecycle status.

The Local API is a public architectural boundary.

It is not an internal service locator.

---

# 4. Architectural Position

The Local API belongs to the Integration layer.

```text
Local Client
    │
    ▼
Local Transport
    │
    ▼
Local API Adapter
    │
    ▼
Public API Contract
    │
    ▼
Platform Command / Query / Event
    │
    ▼
Platform Engine
```

The Local API Adapter translates local interactions into approved Platform contracts.

It shall never expose private Engine or Kernel objects.

---

# 5. Mission

The mission of the Local API is to provide efficient and secure local interoperability while preserving:

* architectural isolation;
* offline-first operation;
* explicit identity;
* least privilege;
* version compatibility;
* process isolation;
* deterministic behavior;
* observability;
* user ownership;
* long-term maintainability.

Local clients may evolve independently from the KnowledgeOS runtime.

---

# 6. Design Philosophy

The Local API shall be:

* contract-first;
* transport-independent;
* authenticated;
* authorized;
* versioned;
* capability-oriented;
* efficient;
* observable;
* failure-isolated;
* local-first;
* implementation-independent.

Locality is an execution characteristic.

It is not a security model by itself.

---

# 7. Locality Definition

A Local API interaction may occur within:

* the same process;
* a separate process on the same device;
* an application extension process;
* a sandboxed process;
* a local service process;
* a trusted local network boundary when explicitly configured.

Each locality class has different security and transport characteristics.

They shall not be treated as equivalent.

---

# 8. In-Process Local API

An approved in-process client may interact through public Local API contracts.

In-process execution shall not imply permission to access:

* internal repositories;
* private services;
* mutable Domain internals;
* Kernel containers;
* Engine implementation classes.

Public contracts remain mandatory.

---

# 9. Inter-Process Local API

Separate processes may interact through local inter-process communication.

Possible implementation technologies include:

* Unix domain sockets;
* XPC;
* named pipes;
* loopback sockets;
* local message channels;
* shared operating-system service frameworks.

The architectural Local API remains independent from the selected technology.

---

# 10. Same-Device Trust

Running on the same device does not establish trust.

A local process may be:

* unregistered;
* compromised;
* malicious;
* misconfigured;
* overprivileged;
* operating under another user context.

Every protected interaction shall resolve an authenticated Principal and authorization decision.

---

# 11. Local Client

A Local Client is an application, process, extension or tool that consumes the Local API.

A Local Client shall have:

* Client Identity;
* Client Type;
* registered capabilities;
* authentication method;
* compatibility metadata;
* authorization scope;
* lifecycle status.

A process identifier alone shall not be treated as stable Client Identity.

---

# 12. Client Identity

Every registered Local Client shall have a stable identity.

Client Identity shall remain independent from:

* operating-system process ID;
* executable path;
* installation path;
* temporary socket;
* display name;
* current Session;
* current user.

Process IDs are ephemeral runtime metadata.

They are not architectural identity.

---

# 13. Client Types

Typical Local Client Types include:

* First-Party Application;
* Companion Application;
* Command-Line Tool;
* Extension Process;
* Provider Process;
* Automation Client;
* Development Tool;
* Operating-System Integration.

Client Type supports policy and diagnostics.

It does not grant authority automatically.

---

# 14. First-Party Clients

First-party clients shall use the same public Local API contracts as third-party clients when acting outside private runtime boundaries.

First-party ownership shall not justify undocumented privileged access.

Approved internal-only interfaces remain private and shall not be represented as Public APIs.

---

# 15. Third-Party Clients

Third-party local clients shall:

* register explicitly;
* authenticate;
* declare required Capabilities;
* request permissions;
* comply with compatibility rules;
* remain independently revocable.

Installation does not imply registration.

Registration does not imply authorization.

---

# 16. Client Registration

A Local Client shall be registered before protected API access.

Registration may record:

* Client Identity;
* Client Type;
* Publisher Identity;
* package or executable identity;
* supported API Versions;
* requested Capabilities;
* requested permissions;
* authentication mechanism;
* integrity metadata;
* lifecycle status.

Registration shall not activate permissions automatically.

---

# 17. Client Validation

Client registration may validate:

* package signature;
* executable signature;
* publisher identity;
* Manifest;
* supported API Version;
* required Capabilities;
* requested permissions;
* environment compatibility;
* integrity.

Validation establishes compatibility and identity evidence.

It does not establish trust automatically.

---

# 18. Client Trust

Trust evaluation may consider:

* first-party status;
* verified publisher;
* package signature;
* user approval;
* enterprise policy;
* registry approval;
* historical behavior.

Trust is distinct from:

* compatibility;
* authentication;
* authorization;
* health.

---

# 19. Client Lifecycle

A Local Client may follow:

```text
Discovered
    │
    ▼
Registered
    │
    ▼
Validated
    │
    ▼
Authorized
    │
    ▼
Active
    │
    ├──────────────┐
    ▼              ▼
Suspended       Revoked
    │              │
    └──────┬───────┘
           ▼
        Removed
```

Lifecycle transitions shall be explicit.

---

# 20. Client Removal

Removing a Local Client shall:

* prevent new authenticated Sessions;
* revoke active client credentials where required;
* revoke active local capability tokens;
* close active connections where policy requires;
* preserve audit history;
* preserve canonical knowledge.

Client removal shall never delete user knowledge silently.

---

# 21. Local Authentication

Protected Local API access shall authenticate according to `Authentication.md`.

Possible mechanisms include:

* operating-system process identity;
* signed executable identity;
* client certificate;
* local challenge-response;
* capability token;
* Session token;
* user-mediated approval;
* device-bound credential;
* operating-system service authorization.

Transport locality alone is insufficient.

---

# 22. Process Identity

Operating-system process metadata may participate in authentication.

Relevant metadata may include:

* process identifier;
* user identifier;
* executable identity;
* signing identity;
* sandbox identity;
* parent process;
* entitlement metadata.

Process metadata is runtime evidence.

It shall not become stable Client Identity by itself.

---

# 23. Executable Identity

A local client may be identified through a signed executable or package identity.

Executable identity may support:

* client validation;
* publisher validation;
* tamper detection;
* capability binding;
* revocation.

A changed executable may require revalidation.

---

# 24. User Context

A Local API request may occur within a local operating-system user context.

User context may support authentication.

It does not automatically establish the corresponding KnowledgeOS User Principal without explicit mapping.

---

# 25. Local Capability Token

KnowledgeOS may issue scoped local capability tokens.

A capability token may authorize access to:

* a specific API Capability;
* a specific Resource;
* a specific scope;
* a specific time window;
* a specific operation count;
* a specific client.

Capability tokens shall follow least privilege.

---

# 26. Capability Token Properties

A Local Capability Token should define:

* Token Identity;
* Client Identity;
* Principal Identity where delegated;
* Capability;
* Resource scope;
* issuance time;
* expiration;
* audience;
* revocation state;
* binding metadata.

The token shall not provide unrestricted Platform access.

---

# 27. User Delegation

A Local Client may act on behalf of a User Principal through explicit delegation.

The Authentication Context shall preserve:

* Local Client Identity;
* User Principal Identity;
* granted scope;
* delegation basis;
* expiration;
* Assurance Level.

The client and user identities shall never be conflated.

---

# 28. Headless Clients

Headless local clients may operate without interactive user presence when explicitly authorized.

Examples include:

* scheduled automation;
* local indexing;
* synchronization helper;
* backup process.

Headless authorization shall be:

* scoped;
* revocable;
* auditable;
* time-bounded where appropriate.

---

# 29. Local Authorization

After authentication, every protected operation shall be authorized.

Authorization may evaluate:

* Client Identity;
* User Principal;
* requested Capability;
* Resource;
* scope;
* device;
* execution context;
* user policy;
* enterprise policy;
* Assurance Level.

Local clients shall not receive broader authority merely because they execute locally.

---

# 30. Permission Scopes

Local API permissions may be scoped to:

* Platform;
* Library;
* Workspace;
* Knowledge Object;
* Annotation collection;
* operation type;
* device;
* user;
* execution context.

Broad Platform-wide permissions should remain exceptional.

---

# 31. User Consent

Some Local API permissions may require explicit user approval.

Examples include:

* reading private knowledge;
* exporting a Library;
* external data transmission;
* managing Plugins;
* accessing annotations;
* executing AI remotely;
* accessing local files outside managed storage.

Consent shall describe actual capability and scope.

---

# 32. Permission Persistence

Granted local permissions may be:

* one-time;
* Session-bound;
* time-bound;
* persistent;
* device-bound;
* Resource-bound.

Persistence semantics shall be explicit.

---

# 33. Permission Revocation

Users or administrators may revoke Local Client permissions.

Revocation may:

* block new operations;
* terminate active Sessions;
* cancel active work when required;
* invalidate capability tokens;
* preserve completed results;
* emit audit Events.

Revocation shall be observable.

---

# 34. Connection

A Local API Connection represents an active transport relationship between a Local Client and KnowledgeOS.

A Connection may include:

* Connection Identity;
* Client Identity;
* Session Identity;
* negotiated API Version;
* transport type;
* creation time;
* health;
* lifecycle status;
* correlation context.

A Connection is not an authenticated Principal.

---

# 35. Connection Lifecycle

A Local API Connection may follow:

```text
Created
    │
    ▼
Negotiating
    │
    ▼
Authenticated
    │
    ▼
Active
    │
    ├───────────────┐
    ▼               ▼
Draining        Failed
    │               │
    └───────┬───────┘
            ▼
          Closed
```

Lifecycle transitions shall be explicit.

---

# 36. Connection Establishment

Connection establishment may include:

1. transport creation;
2. client identification;
3. authentication;
4. API Version negotiation;
5. Capability negotiation;
6. authorization context establishment;
7. connection activation.

No protected request shall execute before required establishment steps complete.

---

# 37. Connection Binding

A Connection may be bound to:

* Client Identity;
* operating-system process;
* executable identity;
* Session;
* user delegation;
* transport endpoint;
* device credential.

Binding limits credential replay and cross-process misuse.

---

# 38. Connection Multiplicity

A Local Client may maintain multiple Connections when supported.

Concurrency limits may apply by:

* client;
* user;
* Capability;
* transport;
* execution profile.

Connection count shall not determine authority.

---

# 39. Connection Termination

A Connection may terminate because of:

* client request;
* server shutdown;
* idle timeout;
* credential revocation;
* permission revocation;
* protocol failure;
* incompatibility;
* transport error;
* process termination.

Termination shall not automatically cancel accepted asynchronous Operations unless explicitly defined.

---

# 40. Local Transport

The Local API shall remain transport-independent.

A transport implementation shall provide:

* message framing;
* request correlation;
* response correlation;
* connection lifecycle;
* cancellation propagation;
* integrity;
* backpressure;
* error signaling.

Transport shall not redefine public API semantics.

---

# 41. Unix Domain Socket Transport

A Unix domain socket implementation may provide:

* filesystem-scoped endpoint;
* operating-system permissions;
* local-only communication;
* stream semantics.

Socket path shall not become Client Identity or API identity.

Filesystem permissions supplement authentication.

They do not replace it.

---

# 42. XPC Transport

On Apple platforms, an XPC implementation may provide:

* process isolation;
* code-signing identity;
* sandbox integration;
* structured messaging;
* lifecycle management.

XPC-specific objects shall remain behind the Local API Adapter.

---

# 43. Loopback Transport

A loopback HTTP or socket transport may be used where appropriate.

Loopback binding shall:

* avoid external interface exposure;
* use unpredictable or protected endpoints where required;
* authenticate clients;
* prevent cross-user access;
* use transport security when the threat model requires it.

`localhost` is not an authorization policy.

---

# 44. Named Pipe Transport

Platforms supporting named pipes may use them as a local transport.

Pipe access control shall supplement, not replace:

* client identity;
* authentication;
* authorization;
* version negotiation.

---

# 45. In-Process Transport

An in-process transport may invoke Local API contracts without serialization.

Even then:

* public Contracts remain authoritative;
* authorization remains enforceable;
* private objects shall not cross the boundary;
* observability shall remain consistent.

Optimization shall not alter semantics.

---

# 46. Serialization

Inter-process Local API communication shall use approved serialization.

Serialization shall preserve:

* Contract Identity;
* API Version;
* request identity;
* response identity;
* types;
* errors;
* correlation;
* cancellation metadata.

Implementation-specific object serialization is prohibited.

---

# 47. Serialization Formats

Possible local serialization formats include:

* JSON;
* MessagePack;
* Protocol Buffers;
* CBOR;
* platform-native structured messages;
* shared canonical schemas.

The selected format is an implementation decision.

The public Contract remains authoritative.

---

# 48. Framing

Stream-based transports shall define message framing.

Framing shall support:

* complete message detection;
* size limits;
* malformed-message rejection;
* protocol Version;
* correlation;
* streaming.

Ambiguous framing is prohibited.

---

# 49. Request Identity

Every Local API request shall have a Request Identity.

Request Identity supports:

* response correlation;
* cancellation;
* tracing;
* diagnostics;
* duplicate detection.

Request Identity is distinct from Idempotency Key.

---

# 50. Correlation

Local requests shall support Correlation Identity according to `APIConventions.md`.

Correlation shall persist across:

* transport;
* authentication;
* authorization;
* Local API Adapter;
* Platform Command or Query;
* asynchronous Operation;
* public response.

---

# 51. Commands

State-changing Local API operations shall expose approved public Commands.

Commands shall:

* express intent;
* validate input;
* enforce authorization;
* define idempotency;
* define concurrency;
* return explicit results;
* avoid private implementation parameters.

---

# 52. Queries

Local API Queries shall retrieve information without modifying canonical state.

Queries shall:

* remain side-effect free architecturally;
* enforce scope;
* support bounded pagination;
* define consistency;
* avoid exposing internal query languages.

---

# 53. Asynchronous Operations

Long-running local work shall use public asynchronous Operation semantics.

Examples include:

* import;
* OCR;
* export;
* synchronization;
* AI processing;
* Plugin validation;
* reindexing.

The initial response returns an Operation Reference.

---

# 54. Operation Monitoring

Local clients may monitor an Operation through:

* status Queries;
* event stream;
* local callback channel;
* subscription;
* polling.

The Operation Resource remains authoritative.

---

# 55. Operation Cancellation

Cancellation shall use an explicit public operation.

Transport disconnection shall not automatically imply cancellation.

Cancellation behavior shall be defined per Operation Contract.

---

# 56. Event Streams

The Local API may expose approved public Event streams.

Event streams shall define:

* Event Identity;
* Event Version;
* authorization;
* ordering;
* delivery semantics;
* duplication;
* backpressure;
* resumption;
* filtering;
* cancellation.

The internal Event Bus shall never be exposed directly.

---

# 57. Event Projection

Local API Events are public projections of approved Platform Events.

Internal payloads shall be translated into public representations.

Private Event types and implementation metadata shall remain internal.

---

# 58. Event Subscription

A client shall explicitly subscribe to approved Event categories.

Subscription may be scoped by:

* Library;
* Workspace;
* Knowledge Object;
* Operation;
* Capability;
* client authorization.

Wildcard subscription to every internal Event is prohibited.

---

# 59. Delivery Semantics

Local Event delivery may be:

* at-most-once;
* at-least-once;
* replayable;
* non-replayable;
* ordered per scope;
* best effort.

Semantics shall be explicit.

---

# 60. Backpressure

Event and streaming transports shall define backpressure behavior.

Possible policies include:

* bounded queue;
* consumer pause;
* coalescing where semantically safe;
* disconnect;
* overflow error;
* resumption.

Unbounded buffering is prohibited.

---

# 61. Streaming Requests

The Local API may support streaming request bodies.

Examples include:

* Asset upload;
* import package submission;
* large document transfer;
* audio input;
* model input.

Streaming shall define:

* size limits;
* ordering;
* cancellation;
* integrity;
* completion;
* temporary storage.

---

# 62. Streaming Responses

The Local API may support streaming responses.

Examples include:

* large Assets;
* exported artifacts;
* AI output;
* progress updates;
* event streams.

Streaming shall preserve:

* ordering;
* completion;
* failure;
* cancellation;
* correlation.

---

# 63. Binary Transfer

Binary data should be transferred through explicit binary contracts.

Binary transfer shall not be encoded inefficiently into generic object fields without justification.

Supported mechanisms may include:

* byte streams;
* file descriptors;
* shared memory references;
* temporary authorized files;
* chunked messages.

---

# 64. File Descriptor Transfer

Some local transports may support transferring file descriptors or operating-system handles.

Such handles shall be:

* scoped;
* validated;
* authorized;
* lifecycle-managed;
* inaccessible after revocation where possible.

Physical file access shall not bypass Platform authorization.

---

# 65. Shared Memory

Shared memory may be used for high-volume local transfer.

Shared memory usage shall define:

* ownership;
* access mode;
* lifecycle;
* size;
* synchronization;
* cleanup;
* sensitivity;
* integrity.

Shared memory shall never expose mutable Domain internals.

---

# 66. Temporary Files

The Local API may use temporary files for large artifacts.

Temporary files shall be:

* access-controlled;
* scoped;
* expiring;
* integrity-protected where required;
* cleaned after use;
* non-authoritative.

Temporary file paths shall not become public Resource identity.

---

# 67. Zero-Copy Optimization

Implementations may use zero-copy transfer where supported.

Optimization shall not alter:

* authorization;
* ownership;
* lifecycle;
* immutability;
* error semantics;
* observability.

---

# 68. Request Validation

Every Local API request shall undergo:

* framing validation;
* protocol validation;
* API Version validation;
* structural validation;
* authentication;
* authorization;
* semantic validation;
* size validation.

Malformed or incompatible requests shall fail before Platform execution.

---

# 69. Local Error Model

The Local API shall use the canonical public error model.

Errors may include:

* Error Code;
* category;
* message;
* retryability;
* correlation;
* field path;
* safe diagnostics;
* required action.

Transport-specific failures shall be translated into public categories where appropriate.

---

# 70. Transport Errors

Typical transport errors may include:

* ConnectionUnavailable;
* ConnectionClosed;
* MessageMalformed;
* MessageTooLarge;
* ProtocolViolation;
* FramingError;
* ClientDisconnected;
* BackpressureExceeded;
* SerializationFailure;
* VersionNegotiationFailed.

Transport errors shall not expose private runtime details.

---

# 71. Authentication Errors

Typical local authentication failures include:

* ClientUnregistered;
* ClientIdentityInvalid;
* CredentialInvalid;
* CredentialExpired;
* CredentialRevoked;
* ExecutableIdentityMismatch;
* ProcessBindingInvalid;
* SessionExpired;
* CapabilityTokenInvalid.

These failures shall stop protected execution.

---

# 72. Authorization Errors

Authorization failures may include:

* CapabilityDenied;
* ResourceScopeDenied;
* UserDelegationMissing;
* AssuranceInsufficient;
* PermissionRevoked;
* ClientSuspended.

Authentication success does not suppress authorization failure.

---

# 73. Compatibility Errors

Compatibility failures may include:

* APIVersionUnsupported;
* ContractVersionUnsupported;
* CapabilityUnavailable;
* FeatureUnsupported;
* ClientUpdateRequired;
* ProtocolVersionUnsupported.

Incompatible clients shall not be silently mapped to incompatible behavior.

---

# 74. Retryability

Local API failures shall identify retryability where possible.

Retry may be:

* safe;
* conditionally safe;
* unsafe;
* unknown.

Transport reconnection does not make a non-idempotent Command safe to repeat automatically.

---

# 75. Idempotency

State-changing Local API operations shall define idempotency.

Supported operations may accept an Idempotency Key.

The key scope may include:

* Client Identity;
* Principal Identity;
* operation;
* API Version;
* semantic input fingerprint.

---

# 76. Duplicate Request Detection

The Local API may detect duplicate requests using:

* Idempotency Key;
* Request Identity;
* Operation Identity;
* semantic fingerprint.

Request Identity alone shall not be assumed to provide durable idempotency.

---

# 77. Concurrency

Concurrent local requests shall preserve Platform concurrency rules.

The Local API may expose:

* expected Resource Version;
* expected Revision;
* lock token;
* lease;
* conditional update.

Transport ordering shall not replace explicit concurrency control.

---

# 78. Request Ordering

A Connection may preserve message order.

Message arrival order does not automatically define Platform execution order.

Execution ordering depends upon:

* Command semantics;
* Scheduler;
* Workflow;
* Resource concurrency;
* explicit sequencing.

---

# 79. Parallel Requests

Local Clients may issue parallel requests when supported.

Parallel execution shall remain bounded by:

* client limits;
* Capability limits;
* resource locks;
* execution profile;
* Provider constraints;
* Platform policy.

---

# 80. Transactions

The Local API shall not expose internal database or Kernel transactions directly.

Public atomicity shall be defined by the applicable operation contract.

A sequence of Local API requests is not automatically transactional.

---

# 81. Batch Operations

The Local API may expose batch operations.

Batch contracts shall define:

* maximum size;
* atomicity;
* ordering;
* per-item results;
* partial failure;
* idempotency;
* cancellation.

Local efficiency shall not justify ambiguous batch semantics.

---

# 82. Pagination

Local API collection Queries shall support bounded pagination.

Cursor semantics shall remain:

* opaque;
* context-bound;
* Version-aware;
* authorization-aware.

Local clients shall not receive unbounded internal collections by default.

---

# 83. Filtering

Filtering shall use approved public filter contracts.

Raw repository or database predicates are prohibited.

Filters shall remain typed and bounded.

---

# 84. Local Search

Knowledge Search shall be invoked through the Search Engine public contract.

The Local API shall not expose direct Search indexes or index implementation APIs.

---

# 85. Local AI Access

Local clients may invoke AI capabilities through the AI Engine public contract.

They shall not access local model runtimes directly through the KnowledgeOS Local API boundary.

Provider selection and privacy policy remain owned by Platform.

---

# 86. Local Storage Access

The Local API shall not expose unrestricted Storage Provider access.

Clients may access approved:

* Asset operations;
* import operations;
* export artifacts;
* Library operations;
* file-selection workflows.

Direct repository access is prohibited unless an explicit public storage capability exists.

---

# 87. File System Access

A Local Client requiring filesystem access shall use approved scoped capabilities.

The Local API shall not provide arbitrary filesystem traversal merely because the client is local.

Access may be limited to:

* user-selected files;
* approved directories;
* temporary artifacts;
* managed Library locations;
* security-scoped resources.

---

# 88. Local Plugin Interaction

Plugins and extension processes shall interact through:

* Plugin SDK Contracts;
* Local API Contracts;
* approved Extension Points;
* scoped capability tokens.

Plugins shall not receive private runtime objects through local transport.

---

# 89. Provider Process Interaction

Out-of-process Providers may use the Local API or a specialized Provider transport.

They shall still conform to:

* Provider Contracts;
* authentication;
* authorization;
* compatibility;
* health;
* lifecycle;
* observability.

Out-of-process execution shall not redefine Provider semantics.

---

# 90. Automation Clients

Automation clients may invoke approved Commands and Queries.

Automation authority shall remain:

* explicit;
* scoped;
* revocable;
* auditable;
* compatible with user policy.

Automation shall not become an unrestricted background administrator.

---

# 91. Development Clients

Development tools may receive enhanced diagnostics in approved development environments.

Development privileges shall not exist in production automatically.

Debug access shall remain:

* explicit;
* environment-scoped;
* authenticated;
* auditable;
* revocable.

---

# 92. Local API Version

Every stable Local API surface shall have an explicit Version.

Version governs:

* request contracts;
* response contracts;
* errors;
* event projections;
* streaming semantics;
* connection negotiation;
* Capability discovery.

Local installation coupling does not remove Versioning requirements.

---

# 93. Protocol Version

The local transport protocol may have a Version distinct from the semantic Local API Version.

```text
Transport Protocol Version
    │
    └── Framing and communication.

Local API Version
    │
    └── Public operation semantics.
```

These shall not be conflated.

---

# 94. Version Negotiation

Connection establishment shall negotiate supported Versions where required.

Negotiation may include:

* transport protocol Version;
* Local API Version;
* serialization format;
* compression;
* streaming Features;
* Event protocol;
* maximum message size.

Negotiation shall be deterministic.

---

# 95. Negotiation Result

The Connection shall record:

* selected protocol Version;
* selected Local API Version;
* selected serialization;
* enabled Features;
* limitations;
* deprecation status.

The result shall remain observable.

---

# 96. Incompatible Clients

An incompatible Local Client shall receive an explicit compatibility failure.

The response may include:

* supported Versions;
* required minimum client Version;
* migration guidance;
* deprecated alternatives;
* missing Features.

Silent fallback to incompatible behavior is prohibited.

---

# 97. Capability Discovery

Local clients may discover approved public Capabilities.

Discovery may expose:

* Capability Identity;
* Capability Version;
* runtime availability;
* required permissions;
* supported Features;
* deprecation status.

Discovery shall not expose private Engine implementation.

---

# 98. Dynamic Availability

A Capability may exist in the Local API while being temporarily unavailable because of:

* Provider health;
* model absence;
* Endpoint absence;
* configuration;
* permission;
* device constraints;
* offline state.

Compatibility and availability shall remain distinct.

---

# 99. Deprecation

Deprecated Local API operations shall expose:

* deprecation status;
* reason;
* replacement;
* migration guidance;
* Sunset or retirement condition.

Local clients installed with the same application shall not be exempt from deprecation policy.

---

# 100. Client Update Coordination

First-party clients may coordinate updates with the KnowledgeOS runtime.

Even coordinated updates shall preserve compatibility when:

* old and new processes overlap;
* background services remain active;
* extensions use older contracts;
* rollback occurs;
* staged deployment is used.

---

# 101. Offline-First Behavior

The Local API shall remain available for core local capabilities without Internet connectivity.

Local capabilities may include:

* Library access;
* Knowledge access;
* annotation;
* local Search;
* local Render;
* local export;
* local AI where available;
* queued synchronization.

Remote dependency failure shall not disable unrelated local operations.

---

# 102. Deferred Remote Work

A Local API Command requiring unavailable remote services may:

* fail explicitly;
* create a queued Operation;
* enter Waiting state;
* use a compatible local fallback;
* require user action.

The behavior shall be explicit.

---

# 103. Local Fallback

Local fallback may occur when:

* a compatible local Capability exists;
* privacy remains equal or stronger;
* required semantics are preserved;
* policy allows it.

Fallback shall remain observable.

---

# 104. Remote Fallback

Local-to-remote fallback shall require explicit policy when it changes:

* privacy;
* cost;
* data residency;
* external transmission;
* authentication.

Remote fallback shall never be hidden.

---

# 105. Resource Limits

The Local API shall enforce resource limits.

Limits may include:

* request size;
* message size;
* stream count;
* connection count;
* concurrent Operations;
* event subscriptions;
* memory use;
* CPU-intensive Capability use;
* temporary storage.

Local clients shall not be able to exhaust the Platform without control.

---

# 106. Rate Limits

Local API rate limits may differ from remote API limits.

They may apply by:

* Client Identity;
* Principal;
* Capability;
* operation;
* connection;
* execution profile.

Locality does not justify unlimited request rates.

---

# 107. Quotas

Local clients may be subject to quotas for:

* AI operations;
* background jobs;
* subscriptions;
* temporary storage;
* exported artifacts;
* Plugin actions;
* synchronization tasks.

Quota failure shall use canonical errors.

---

# 108. Timeouts

Local API requests shall have explicit timeout semantics.

Timeouts may apply to:

* connection establishment;
* authentication;
* synchronous request;
* stream inactivity;
* Operation acceptance;
* event heartbeat.

Long-running execution shall use asynchronous Operations.

---

# 109. Heartbeats

Long-lived connections or subscriptions may use heartbeat messages.

Heartbeat semantics shall define:

* interval;
* timeout;
* failure detection;
* reconnection;
* resumption.

Heartbeat failure indicates connection uncertainty.

It does not define Platform Operation failure automatically.

---

# 110. Reconnection

Clients may reconnect after transport loss.

Reconnection shall revalidate:

* Client Identity;
* credentials;
* permissions;
* API Version;
* active Subscription state;
* resumable Operations;
* revoked access.

Old connection state shall not be trusted automatically.

---

# 111. Subscription Resumption

Event subscriptions may support resumption through:

* Event cursor;
* checkpoint;
* last-seen Event identity;
* Operation identity.

Resumption support and retention window shall be explicit.

---

# 112. Operation Continuity

Accepted asynchronous Operations may continue after Local Client disconnection.

Operation ownership and access remain governed by authorization.

A reconnecting client may retrieve the Operation if still authorized.

---

# 113. Failure Isolation

A failing Local Client shall not:

* terminate the KnowledgeOS runtime;
* corrupt canonical knowledge;
* invalidate unrelated clients;
* exhaust unbounded resources;
* access another client's Sessions;
* alter another client's permissions.

Isolation is mandatory.

---

# 114. Process Failure

If an out-of-process Provider or extension terminates unexpectedly:

* active requests fail explicitly;
* partial results remain marked;
* restart policy is applied by runtime governance;
* canonical state remains valid;
* health is updated;
* affected Operations remain diagnosable.

---

# 115. Malformed Client Behavior

Repeated malformed or protocol-violating requests may trigger:

* connection termination;
* client suspension;
* rate limiting;
* audit event;
* revalidation;
* administrative review.

Protocol errors shall not compromise the runtime.

---

# 116. Local API Security

The Local API security model shall consider:

* same-device adversaries;
* cross-user access;
* compromised processes;
* malicious extensions;
* credential replay;
* socket hijacking;
* unauthorized file access;
* confused-deputy attacks;
* capability-token leakage;
* privilege escalation.

Locality reduces some threats.

It does not remove them.

---

# 117. Confused Deputy Prevention

KnowledgeOS shall avoid acting with broader authority than the requesting Local Client possesses.

Every operation shall preserve:

* Client Identity;
* User delegation;
* requested Capability;
* Resource scope;
* authorization decision.

A privileged KnowledgeOS process shall not become an unrestricted deputy.

---

# 118. Cross-User Isolation

On multi-user systems, Local API endpoints shall prevent unauthorized cross-user access.

Isolation may use:

* operating-system user permissions;
* per-user endpoints;
* client authentication;
* Session binding;
* sandboxing.

Cross-user access requires explicit authorization.

---

# 119. Secret Protection

Local API messages shall never expose unnecessary:

* passwords;
* refresh tokens;
* private keys;
* Provider secrets;
* encryption keys;
* raw secret references.

Secret management shall use approved contracts.

---

# 120. Sensitive Payload Protection

Sensitive local payloads may require:

* secure transport;
* process-bound channels;
* memory protection;
* minimized copies;
* bounded lifetime;
* no logging;
* explicit cleanup.

Same-device communication does not make sensitive data non-sensitive.

---

# 121. Transport Integrity

Local transport shall detect malformed or tampered messages where the threat model requires it.

Integrity may be supported through:

* operating-system channel guarantees;
* authenticated messages;
* cryptographic framing;
* signed requests;
* process-bound credentials.

---

# 122. Transport Confidentiality

Some local transports provide operating-system-enforced confidentiality.

Where this is insufficient, application-layer encryption may be required.

The selected policy depends upon:

* multi-user risk;
* sandbox boundaries;
* transport type;
* payload sensitivity;
* enterprise requirements.

---

# 123. Local API Observability

Every significant Local API interaction shall be observable.

Observable metadata may include:

* Client Identity;
* Client Type;
* Principal Type;
* operation identity;
* API Version;
* transport type;
* connection identity;
* duration;
* result;
* canonical Error Code;
* request size;
* response size;
* stream size;
* correlation identity;
* permission decision.

Sensitive payloads shall not be logged by default.

---

# 124. Connection Metrics

Connection metrics may include:

* active connections;
* connection duration;
* authentication failures;
* negotiation failures;
* reconnect count;
* protocol errors;
* idle timeout;
* bytes transferred;
* stream count.

---

# 125. Operation Metrics

Local API metrics may include:

* Commands;
* Queries;
* asynchronous Operations;
* event subscriptions;
* success rate;
* failure rate;
* latency;
* cancellation;
* rate-limit events;
* quota failures;
* deprecated operation usage;
* compatibility failures.

---

# 126. Tracing

Local API requests may participate in local or distributed tracing.

A trace may represent:

```text
Local Client Request
        │
        ▼
Transport
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Local API Adapter
        │
        ▼
Platform Contract
        │
        ▼
Platform Execution
        │
        ▼
Local Response
```

Trace capture shall preserve privacy.

---

# 127. Audit

Security-sensitive or state-changing local interactions may require audit records.

Audit metadata may include:

* Client Identity;
* User Principal;
* operation;
* Resource reference;
* permission;
* result;
* API Version;
* timestamp;
* correlation;
* delegation context.

Audit records shall be immutable.

---

# 128. Client Diagnostics

Authorized clients may access diagnostics relevant to their own interactions.

Diagnostics may include:

* compatibility failure;
* permission denial;
* connection state;
* Operation failure;
* Capability unavailability;
* deprecated usage;
* resource limit.

Clients shall not receive another client's private diagnostics.

---

# 129. Administrative Diagnostics

Administrative diagnostics may expose broader operational information.

They shall require elevated authorization and remain auditable.

Administrative diagnostics shall still avoid:

* secret values;
* raw private content;
* unnecessary implementation details.

---

# 130. Local API Testing

Stable Local API operations shall have contract tests.

Tests may verify:

* client registration;
* authentication;
* authorization;
* Version negotiation;
* request validation;
* response mapping;
* errors;
* cancellation;
* streaming;
* binary transfer;
* event delivery;
* idempotency;
* concurrency;
* compatibility.

---

# 131. Transport Conformance Testing

Every Local API transport implementation shall pass conformance tests for:

* framing;
* request correlation;
* error signaling;
* cancellation;
* connection lifecycle;
* backpressure;
* size limits;
* malformed input;
* Version negotiation.

Transport conformance does not replace semantic contract testing.

---

# 132. Security Testing

Local API security testing shall include:

* unauthorized client access;
* cross-user access;
* credential replay;
* token theft;
* process identity spoofing;
* socket hijacking;
* malformed messages;
* resource exhaustion;
* confused-deputy scenarios;
* permission revocation;
* client removal.

---

# 133. Compatibility Testing

Compatibility testing shall verify:

* older supported clients;
* current clients;
* newer unsupported clients;
* protocol negotiation;
* API Version negotiation;
* deprecated operations;
* compatibility adapters;
* staged updates;
* rollback scenarios.

---

# 134. Local API Commands

Typical Local API management Commands include:

* RegisterLocalClient;
* ValidateLocalClient;
* AuthorizeLocalClient;
* SuspendLocalClient;
* RevokeLocalClient;
* IssueCapabilityToken;
* RevokeCapabilityToken;
* OpenLocalConnection;
* CloseLocalConnection;
* NegotiateLocalAPIVersion.

These Commands manage Local API integration state.

They do not redefine Platform capabilities.

---

# 135. Local API Events

Typical Local API Events include:

* LocalClientRegistered;
* LocalClientValidated;
* LocalClientAuthorized;
* LocalClientSuspended;
* LocalClientRevoked;
* LocalConnectionOpened;
* LocalConnectionClosed;
* LocalAuthenticationFailed;
* LocalAPIVersionNegotiated;
* CapabilityTokenIssued;
* CapabilityTokenRevoked;
* ProtocolViolationDetected.

Events describe completed Local API facts.

---

# 136. Local API Queries

Typical Local API Queries include:

* GetLocalClient;
* ListLocalClients;
* GetLocalClientPermissions;
* GetLocalConnection;
* ListLocalConnections;
* GetSupportedLocalAPIVersions;
* GetSupportedLocalTransports;
* GetLocalCapabilityAvailability;
* GetCapabilityTokenStatus;
* CheckLocalClientCompatibility.

Queries never modify Local API state.

---

# 137. Local API Invariants

The following invariants apply.

* The Local API belongs to the Integration layer.
* The Local API exposes approved Platform capabilities.
* Locality never implies unrestricted trust.
* Same-device execution never bypasses authentication automatically.
* Authentication and authorization remain separate.
* Client Identity is distinct from process identity.
* Client Identity is distinct from User Principal Identity.
* A Local Client may act for a user only through explicit delegation.
* First-party clients do not receive undocumented privileged access.
* Public contracts remain mandatory across process boundaries.
* Local transport never exposes private Engine or Kernel objects.
* Transport implementation is independent from API semantics.
* Transport Protocol Version is distinct from Local API Version.
* Version negotiation is explicit and deterministic.
* Protected execution begins only after authentication and authorization.
* Capability tokens are scoped, expiring and revocable.
* File paths never become canonical Resource identity.
* Binary transfer never bypasses authorization.
* Queries never modify canonical state.
* Long-running work uses explicit asynchronous Operations.
* Event streams expose public projections, never the internal Event Bus.
* Transport disconnection does not automatically cancel accepted Operations.
* Connection ordering does not automatically define Platform execution order.
* Transaction semantics are explicit and never inferred from one Connection.
* Idempotency semantics are explicit.
* Pagination is bounded.
* Resource limits are enforced.
* Failure of one Local Client remains isolated.
* Local-to-remote fallback is never hidden when privacy or cost changes.
* Sensitive payloads are not logged by default.
* Local API interactions remain observable and auditable where required.

---

# 138. Prohibited Behaviors

The Local API shall never:

* treat every local process as trusted;
* use process ID as permanent Client Identity;
* expose internal dependency-injection containers;
* expose private Engine services;
* expose mutable Domain objects;
* expose internal repositories;
* expose arbitrary filesystem access;
* grant Platform-wide authority by default;
* conflate Client Identity and User Identity;
* allow silent user impersonation;
* permit extensions to inherit user credentials directly;
* bypass public Contracts for first-party clients;
* rely solely on socket permissions for authorization;
* use local transport as justification for skipping Versioning;
* silently reinterpret incompatible client requests;
* return private runtime objects through serialization;
* log secret credentials or sensitive payloads;
* permit unbounded buffering;
* permit unbounded collection Queries;
* infer canonical transactionality from request ordering;
* cancel accepted asynchronous Operations merely because a Connection closed;
* allow one client to access another client's Sessions or diagnostics;
* silently switch from local to remote execution;
* bypass Platform, Kernel or security boundaries.

---

# 139. Related Documents

* `APIConventions.md`
* `Authentication.md`
* `Versioning.md`
* `REST.md`
* `GraphQL.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Compatibility.md`
* `../PluginSDK/ExtensionPoints.md`
* `../Providers/ProviderModel.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Observability.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 140. Status

**Approved**

This document defines the architectural conventions governing the KnowledgeOS Local API.

The Local API exposes approved Platform Commands, Queries, Operations and public Event streams to applications, processes, extensions, Providers, tools and automations operating within an approved local environment.

Local execution supports performance, process integration and offline-first operation.

It does not remove authentication, authorization, compatibility, Versioning, isolation or observability requirements.

Every Local Client has an explicit identity.

Every protected interaction has an authenticated and authorized context.

Every transport remains replaceable.

Every public semantic remains governed by stable contracts.

Locality is an optimization and deployment characteristic.

It is never unrestricted trust.
