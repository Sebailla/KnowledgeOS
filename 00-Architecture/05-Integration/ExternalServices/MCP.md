# MCP

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** External Services

**Document:** MCP

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model governing integration between KnowledgeOS and systems using the Model Context Protocol, hereafter referred to as MCP.

MCP enables KnowledgeOS to participate in interoperable ecosystems where applications, agents and AI systems may discover and invoke approved capabilities or access approved contextual Resources through a standardized protocol boundary.

KnowledgeOS may participate in MCP integrations as:

* an MCP Client;
* an MCP Server;
* both roles simultaneously in different Integration contexts.

MCP is an Integration protocol.

It is not:

* the Domain model;
* the Kernel communication model;
* the internal Plugin architecture;
* the canonical knowledge representation;
* the storage architecture;
* the synchronization architecture;
* the internal AI architecture.

MCP clients and servers interact with KnowledgeOS only through explicit capabilities, public contracts and controlled adapters.

They never receive direct access to:

* Domain internals;
* Kernel internals;
* NAS storage;
* private Engine services;
* unrestricted filesystem access;
* Provider credentials;
* internal Event Bus infrastructure.

---

# 2. Scope

This document governs:

* MCP Client integration;
* MCP Server integration;
* MCP sessions;
* MCP capability negotiation;
* MCP Tools;
* MCP Resources;
* MCP Prompts;
* MCP notifications;
* MCP request handling;
* MCP response handling;
* MCP transport adaptation;
* MCP authentication;
* MCP authorization;
* user consent;
* capability exposure;
* external server trust;
* Resource access;
* Tool invocation;
* execution boundaries;
* cancellation;
* progress;
* error translation;
* Version compatibility;
* observability;
* security;
* privacy;
* offline behavior;
* Plugin participation;
* Provider participation.

This document does not govern:

* the complete MCP protocol specification;
* internal Domain semantics;
* internal Kernel APIs;
* internal Engine implementation;
* Plugin SDK semantics;
* Provider-specific implementation;
* AI model behavior;
* synchronization protocols;
* direct NAS access.

---

# 3. Architectural Position

MCP belongs to the Integration layer.

```text
External MCP Environment
        │
        ▼
05-Integration
        │
        ▼
Public Contracts
        │
        ▼
04-Platform
        │
        ▼
03-Kernel
        │
        ▼
02-Domain
```

MCP shall not bypass this dependency direction.

---

# 4. Core Principle

MCP is a protocol boundary.

It shall never become the internal architecture of KnowledgeOS.

The required separation is:

```text
MCP Protocol
    │
    ▼
MCP Adapter
    │
    ▼
Integration Contract
    │
    ▼
Public Platform Capability
```

The inverse direction is:

```text
KnowledgeOS Capability Request
        │
        ▼
MCP Client Adapter
        │
        ▼
External MCP Contract
        │
        ▼
External MCP Server
```

---

# 5. Mission

The mission of MCP Integration is to allow KnowledgeOS to:

* expose selected capabilities safely;
* consume external capabilities;
* integrate with AI ecosystems;
* access external contextual Resources;
* invoke external Tools;
* expose approved knowledge projections;
* preserve user control;
* maintain architectural isolation;
* support local and remote integrations.

---

# 6. Design Philosophy

MCP Integration shall be:

* capability-driven;
* explicit;
* least-privilege;
* user-controlled;
* contract-based;
* transport-independent where practical;
* observable;
* revocable;
* privacy-aware;
* failure-isolated;
* version-aware.

---

# 7. MCP Roles

KnowledgeOS may operate in two primary MCP roles:

```text
KnowledgeOS
├── MCP Client
└── MCP Server
```

These roles are architecturally distinct.

---

# 8. KnowledgeOS as MCP Client

As an MCP Client, KnowledgeOS may connect to approved external MCP Servers.

External MCP Servers may expose:

* Tools;
* Resources;
* Prompts;
* protocol capabilities.

KnowledgeOS shall treat every external MCP Server as an external dependency.

---

# 9. KnowledgeOS as MCP Server

As an MCP Server, KnowledgeOS may expose approved capabilities to authorized MCP Clients.

Exposure shall occur only through:

* explicit MCP contracts;
* approved public projections;
* Capability policies;
* authorization;
* user consent where required.

---

# 10. Bidirectional Role

KnowledgeOS may simultaneously:

* consume capabilities from external MCP Servers;
* expose capabilities through its own MCP Server.

These directions shall remain independently configured and authorized.

---

# 11. MCP Boundary

Every MCP interaction crosses an explicit Integration Boundary.

```text
MCP Peer
    │
    ▼
Protocol Boundary
    │
    ▼
Validation
    │
    ▼
Authorization
    │
    ▼
Capability Adapter
    │
    ▼
KnowledgeOS Public Contract
```

No MCP message shall bypass this boundary.

---

# 12. MCP Adapter

The MCP Adapter translates between:

* MCP protocol messages;
* KnowledgeOS Integration contracts.

The adapter owns:

* protocol decoding;
* protocol encoding;
* capability negotiation;
* MCP error translation;
* transport interaction;
* session protocol state.

The adapter does not own Domain semantics.

---

# 13. Protocol Isolation

MCP-specific types shall remain inside the Integration boundary.

Types such as:

* MCP Tool descriptors;
* MCP Resource descriptors;
* MCP Prompt descriptors;
* protocol request objects;
* protocol response objects;

shall not become Domain entities.

---

# 14. Capability Model

All MCP access shall be capability-based.

A Capability represents explicit permission to perform or access a defined operation or Resource category.

Examples include:

* read selected knowledge;
* search approved Library scope;
* retrieve approved Resource content;
* create a draft annotation;
* initiate an approved import;
* invoke an external Tool.

---

# 15. Capability Identity

Every stable MCP-facing Capability shall have:

* Capability Identity;
* Version;
* scope;
* direction;
* authorization requirements;
* input contract;
* output contract.

---

# 16. Capability Direction

Capabilities may be:

* Inbound — exposed by KnowledgeOS;
* Outbound — consumed by KnowledgeOS.

A Capability shall not implicitly grant access in both directions.

---

# 17. Capability Scope

Capability scope may be restricted by:

* Library;
* Workspace;
* Knowledge Object;
* Resource type;
* operation;
* Plugin;
* Provider;
* user session;
* time;
* external client identity.

---

# 18. Least Privilege

MCP integrations shall receive the minimum Capabilities necessary.

Broad unrestricted access is prohibited by default.

---

# 19. Capability Discovery

Capability discovery may expose only Capabilities available to the current:

* Principal;
* session;
* client;
* configuration;
* policy.

Discovery does not imply authorization to invoke every discovered Capability unless the contract explicitly defines it.

---

# 20. Capability Negotiation

MCP peers may negotiate supported protocol capabilities.

Negotiation may include:

* supported features;
* Tool support;
* Resource support;
* Prompt support;
* notifications;
* progress;
* cancellation.

Protocol capability negotiation shall not bypass KnowledgeOS authorization.

---

# 21. Protocol Capability Versus Authorization

The fact that a peer technically supports a feature does not mean it is authorized to use it.

```text
Protocol Support
        ≠
Authorization
```

Both conditions may be required.

---

# 22. Session

An MCP Session represents an active protocol relationship between KnowledgeOS and an MCP peer.

A Session may contain:

* Session Identity;
* peer identity;
* negotiated capabilities;
* authentication context;
* authorization context;
* lifecycle state;
* transport association.

---

# 23. Session Identity

Session Identity shall be unique within its operational scope.

Session Identity shall not become canonical Domain identity.

---

# 24. Session State

Possible Session states may include:

* Initializing;
* Active;
* Degraded;
* Closing;
* Closed;
* Failed.

The exact runtime state model may evolve.

---

# 25. Session Initialization

Session initialization shall establish applicable:

* protocol compatibility;
* peer identity;
* negotiated capabilities;
* security context;
* operational limits.

No privileged operation shall occur before required initialization completes.

---

# 26. Session Termination

Session termination shall:

* stop new operations;
* cancel or finalize active operations according to policy;
* release resources;
* invalidate session-scoped authorization;
* emit operational telemetry.

---

# 27. Session Recovery

Connection recovery shall not automatically restore privileged session state unless the security model explicitly permits it.

A reconnected peer may require:

* reauthentication;
* renegotiation;
* renewed consent.

---

# 28. Transport

MCP may operate over supported transport mechanisms.

Transport concerns shall remain separated from:

* Tool semantics;
* Resource semantics;
* Prompt semantics;
* Domain semantics.

---

# 29. Transport Adapter

A transport adapter owns:

* connection establishment;
* framing;
* message delivery;
* transport errors;
* transport lifecycle.

It shall not own KnowledgeOS capability authorization.

---

# 30. Local Transport

Local MCP transport may be used for trusted local processes.

Local execution does not imply unrestricted trust.

A local MCP process may still require:

* identity;
* Capability restrictions;
* filesystem isolation;
* Resource limits.

---

# 31. Remote Transport

Remote MCP transport shall require appropriate:

* authentication;
* encryption;
* endpoint validation;
* authorization;
* timeout;
* retry;
* rate limiting.

---

# 32. Tools

An MCP Tool represents an invocable capability.

A Tool may:

* execute an operation;
* transform data;
* initiate a workflow;
* query an approved capability;
* interact with an external service.

A Tool is not automatically a Domain Command.

---

# 33. Tool Contract

Every Tool exposed by KnowledgeOS shall define:

* Tool Identity;
* Tool Version;
* description;
* input schema;
* output schema;
* required Capabilities;
* side-effect classification;
* consent requirements;
* execution limits.

---

# 34. Tool Identity

Tool Identity shall be:

* stable;
* namespaced;
* independent from internal class names;
* independent from function names used internally.

---

# 35. Tool Version

Tool contracts shall evolve independently from:

* Domain Version;
* Platform implementation Version;
* MCP protocol Version.

---

# 36. Tool Input

Tool input is untrusted external input.

It shall undergo:

* structural validation;
* schema validation;
* authorization;
* semantic validation where applicable;
* resource-limit validation.

---

# 37. Tool Output

Tool output shall use an approved public contract.

It shall not expose:

* private Domain objects;
* internal exceptions;
* database records;
* filesystem paths;
* credentials;
* Kernel state.

---

# 38. Tool Side Effects

Every Tool shall declare whether it is:

* read-only;
* state-changing;
* externally side-effecting;
* destructive.

Side-effect classification shall influence:

* authorization;
* consent;
* retry;
* replay;
* audit.

---

# 39. Read-Only Tool

A read-only Tool shall not modify canonical state.

Examples may include:

* search knowledge;
* retrieve metadata;
* inspect approved Resources.

---

# 40. State-Changing Tool

A state-changing Tool may propose or initiate modification through approved Platform Commands.

The Tool itself shall not mutate Domain state directly.

---

# 41. Destructive Tool

A destructive Tool requires elevated controls.

Controls may include:

* explicit user confirmation;
* stronger authorization;
* audit;
* restricted exposure.

---

# 42. Tool-to-Command Translation

A state-changing Tool shall translate into an approved Command or Workflow.

```text
MCP Tool Invocation
        │
        ▼
Validation
        │
        ▼
Authorization
        │
        ▼
Consent
        │
        ▼
Public Capability Adapter
        │
        ▼
Command / Workflow
```

The MCP Client never invokes private Domain methods directly.

---

# 43. Tool-to-Query Translation

Read-only Tools may translate into approved Queries.

```text
MCP Tool Invocation
        │
        ▼
Public Query Contract
        │
        ▼
Query Bus
```

Private Query handlers shall not be exposed directly.

---

# 44. Tool Execution Identity

Every Tool invocation shall have an Operation Identity.

Operation Identity supports:

* tracing;
* cancellation;
* progress;
* audit;
* deduplication where applicable.

---

# 45. Tool Idempotency

Tools with side effects shall define idempotency semantics.

Retries shall not create uncontrolled duplicate effects.

---

# 46. Tool Timeout

Every Tool invocation shall have a bounded execution policy.

Unbounded execution is prohibited.

---

# 47. Tool Cancellation

Long-running Tools should support cancellation where practical.

Cancellation shall propagate through approved execution mechanisms.

---

# 48. Tool Progress

Long-running Tool execution may expose progress.

Progress shall be:

* operational;
* bounded;
* non-authoritative;
* privacy-aware.

---

# 49. Tool Failure

Tool failures shall use stable public error categories.

Internal stack traces shall not be exposed.

---

# 50. Resources

An MCP Resource represents information exposed through the MCP Integration boundary.

A Resource may represent:

* a knowledge projection;
* metadata;
* document content;
* generated context;
* approved Asset metadata;
* Integration information.

An MCP Resource is not the canonical Resource itself.

---

# 51. Resource Projection

KnowledgeOS shall expose Resources through explicit projection.

```text
Canonical Knowledge
        │
        ▼
Authorization
        │
        ▼
Public Projection
        │
        ▼
MCP Resource
```

---

# 52. Resource Identity

MCP Resource Identity shall be stable within its declared scope.

It may reference canonical identity without exposing internal storage location.

---

# 53. Resource URI

Resource URIs shall identify logical Resources.

They shall not expose:

* private absolute filesystem paths;
* NAS mount paths;
* internal database locations;
* credentials.

---

# 54. NAS Isolation

The NAS is the Library Source of Truth.

MCP clients shall never receive direct NAS access through the MCP integration architecture.

The required boundary is:

```text
MCP Client
    │
    ▼
MCP Resource Contract
    │
    ▼
KnowledgeOS Access Policy
    │
    ▼
Library Engine
    │
    ▼
Storage Abstraction
    │
    ▼
NAS
```

---

# 55. Resource Read

A Resource read shall enforce:

* authentication;
* authorization;
* scope;
* Resource existence;
* privacy policy;
* size limits.

---

# 56. Resource Listing

Resource listing shall expose only Resources visible within the authorized scope.

Listing shall not leak hidden Resource existence.

---

# 57. Resource Templates

Dynamic Resource addressing may use approved Resource templates.

Templates shall:

* validate parameters;
* enforce scope;
* avoid path traversal;
* remain independent from physical storage layout.

---

# 58. Resource Content

Resource content may be:

* textual;
* structured;
* binary reference;
* bounded binary content.

Large Assets should normally use controlled references or streaming rather than uncontrolled embedding.

---

# 59. Resource Version

Where Resource consistency matters, MCP Resource representations should identify relevant Version information.

A Resource read shall not imply that the Resource is immutable unless explicitly defined.

---

# 60. Resource Subscription

If supported, clients may subscribe to approved Resource changes.

Subscriptions shall be:

* authorized;
* scoped;
* revocable;
* observable.

---

# 61. Resource Change Notification

A Resource change notification is not the canonical change itself.

It informs a client that an approved Resource representation may have changed.

---

# 62. Prompts

MCP Prompts may expose reusable interaction templates.

Prompts are Integration Resources.

They are not:

* executable code;
* Domain rules;
* authorization rules;
* system-level trust boundaries.

---

# 63. Prompt Contract

A Prompt shall define:

* Prompt Identity;
* Version;
* description;
* arguments;
* output representation;
* scope.

---

# 64. Prompt Input

Prompt arguments shall be validated.

Prompt templates shall not receive unrestricted access to private KnowledgeOS state.

---

# 65. Prompt Output

Prompt output may contain:

* text;
* structured context;
* references;
* approved Resource content.

Prompt output remains untrusted input to any downstream AI model.

---

# 66. Prompt Injection Boundary

Content retrieved through MCP may contain malicious or manipulative instructions.

KnowledgeOS shall distinguish:

* data;
* user instructions;
* system policy;
* Tool authority.

External Resource content shall never acquire higher authority merely because it contains instruction-like text.

---

# 67. External MCP Servers

External MCP Servers are external dependencies.

They shall be treated according to:

* trust level;
* authentication;
* Capability exposure;
* privacy;
* network policy;
* execution policy.

---

# 68. External Server Registration

An external MCP Server configuration may define:

* Server Identity;
* endpoint or local execution configuration;
* transport;
* authentication method;
* trust classification;
* enabled capabilities;
* Resource limits.

---

# 69. Server Identity

Server Identity shall be stable within KnowledgeOS configuration.

Endpoint address alone shall not necessarily define logical Server Identity.

---

# 70. Trust Classification

External MCP Servers may be classified as:

* local trusted;
* local restricted;
* remote trusted;
* remote restricted;
* untrusted.

Trust classification shall influence policy.

---

# 71. Trust Does Not Eliminate Validation

Even trusted MCP Servers shall remain subject to contract validation.

Trust may alter authorization policy.

It shall not eliminate structural safety.

---

# 72. External Tool Discovery

KnowledgeOS may discover Tools exposed by external MCP Servers.

Discovered Tools shall not become automatically enabled.

---

# 73. External Tool Approval

External Tools may require approval before use.

Approval may consider:

* Tool identity;
* Server identity;
* side effects;
* data exposure;
* network access;
* cost;
* security.

---

# 74. External Tool Invocation

Before invoking an external Tool, KnowledgeOS shall determine:

* whether the Tool is enabled;
* what data will be sent;
* whether user consent is required;
* whether the destination is authorized;
* whether the operation is retry-safe.

---

# 75. Data Egress

Sending KnowledgeOS data to an external MCP Server is data egress.

Data egress shall be governed by:

* user policy;
* Capability scope;
* privacy;
* consent;
* destination trust.

---

# 76. Egress Minimization

Only the minimum information required for the external operation shall be transmitted.

Entire Libraries or Documents shall not be sent when a smaller approved projection is sufficient.

---

# 77. External Resource Acquisition

Resources acquired from external MCP Servers shall be treated as external data.

They shall not become canonical knowledge automatically.

---

# 78. External Resource Import

If external MCP Resource content is imported into KnowledgeOS, it shall pass through the approved Import architecture.

```text
External MCP Resource
        │
        ▼
Acquisition
        │
        ▼
Validation
        │
        ▼
Import Pipeline
        │
        ▼
Canonicalization
```

---

# 79. MCP and AI

MCP may support AI workflows by exposing or consuming:

* Tools;
* Resources;
* Prompts.

MCP does not replace the KnowledgeOS AI Engine.

---

# 80. AI Engine Boundary

The AI Engine may request access to MCP capabilities through approved Integration interfaces.

It shall not own MCP transport implementation.

---

# 81. AI Tool Invocation

An AI model shall not gain unrestricted Tool authority.

Tool invocation shall remain subject to:

* Capability policy;
* authorization;
* consent;
* execution limits.

---

# 82. AI-Generated Tool Arguments

Arguments generated by an AI model are untrusted input.

They require the same validation as externally supplied arguments.

---

# 83. AI Autonomy Levels

KnowledgeOS may define different autonomy levels for MCP Tool invocation.

Examples include:

* Suggest Only;
* Confirm Before Execution;
* Auto-Execute Read-Only;
* Auto-Execute Approved Operations.

Autonomy policy shall be user-controlled.

---

# 84. User Consent

MCP operations may require explicit user consent.

Consent may be required when an operation:

* modifies canonical knowledge;
* deletes data;
* sends data externally;
* incurs cost;
* invokes external side effects;
* accesses sensitive content.

---

# 85. Consent Context

Consent shall identify enough information for an informed decision.

It may include:

* operation;
* destination;
* data scope;
* side effects;
* persistence implications.

---

# 86. Consent Scope

Consent may be:

* one-time;
* session-scoped;
* Capability-scoped;
* destination-scoped;
* persistent.

Persistent consent shall be revocable.

---

# 87. Consent Is Not Authentication

User consent and peer authentication solve different problems.

Both may be required.

---

# 88. Authentication

MCP peer authentication may use mechanisms appropriate to the transport and deployment model.

Authentication shall establish a Principal or trusted peer context.

---

# 89. Authorization

Authorization determines which MCP operations the authenticated Principal may perform.

Authorization may consider:

* Principal;
* client;
* Server;
* Capability;
* Resource scope;
* session;
* user policy.

---

# 90. Authorization Before Execution

Authorization shall occur before:

* Tool execution;
* Resource access;
* subscription creation;
* sensitive data egress.

---

# 91. OAuth Integration

MCP integrations requiring OAuth shall use the architecture defined in `OAuth.md`.

MCP shall not implement an independent credential architecture.

---

# 92. Credential Isolation

MCP adapters shall not expose raw Provider credentials to:

* Tools;
* Resources;
* Prompts;
* Plugins;
* AI models;
* external clients.

---

# 93. Credential Storage

Credential storage shall use approved secure credential infrastructure.

Credentials shall not be stored:

* in MCP manifests;
* in Tool arguments by default;
* in Resource URIs;
* in logs.

---

# 94. Secret Redaction

MCP observability shall redact secrets and sensitive authorization metadata.

---

# 95. Public Exposure

Running KnowledgeOS as an MCP Server does not imply public network exposure.

Exposure may be:

* local-only;
* device-local;
* private-network;
* authenticated remote;
* explicitly public.

The deployment mode shall be explicit.

---

# 96. Default Exposure

The default exposure policy should minimize network accessibility.

Remote exposure shall require explicit configuration.

---

# 97. Network Binding

MCP Server network binding shall not default to unrestricted interfaces when local-only operation is intended.

---

# 98. Client Registration

KnowledgeOS may maintain registered MCP Client identities.

Registration may define:

* Client Identity;
* trust level;
* allowed Capabilities;
* authentication method;
* revocation state.

---

# 99. Client Revocation

A client may be revoked.

Revocation shall prevent future privileged access.

Active sessions may be terminated according to policy.

---

# 100. Capability Revocation

Capabilities may be revoked independently from client identity.

Revocation shall affect future operations.

Long-running active operations shall follow explicit policy.

---

# 101. Tool Exposure Policy

KnowledgeOS shall not expose every internal operation as an MCP Tool.

Tool exposure requires deliberate architectural design.

---

# 102. Resource Exposure Policy

KnowledgeOS shall not expose every internal Resource through MCP.

Resource exposure requires:

* public projection;
* authorization;
* privacy evaluation;
* stable contract.

---

# 103. Prompt Exposure Policy

Internal system prompts shall not automatically become MCP Prompts.

Only explicitly designed public Prompt contracts may be exposed.

---

# 104. Internal Service Isolation

Private Engine services shall not be directly addressable through MCP.

The required architecture is:

```text
MCP
 │
 ▼
Public Capability
 │
 ▼
Platform Contract
 │
 ▼
Engine
```

not:

```text
MCP
 │
 ▼
Private Engine Service
```

---

# 105. Kernel Isolation

MCP shall not expose:

* Command Bus internals;
* Query Bus internals;
* Event Bus internals;
* Dependency Injection container;
* Scheduler internals;
* Job System internals.

Approved capabilities may internally use these Kernel services.

---

# 106. Domain Isolation

MCP shall not expose mutable Domain entities.

Domain data shall cross the boundary only through approved public projections.

---

# 107. Storage Isolation

MCP shall not expose raw Storage Provider interfaces.

Storage access shall occur through approved Library and Platform capabilities.

---

# 108. Filesystem Isolation

MCP Tools and Resources shall not receive unrestricted filesystem access by default.

Filesystem operations require explicit Capability and scope.

---

# 109. Path Safety

Any MCP operation accepting a path-like value shall protect against:

* path traversal;
* symbolic-link escape;
* unauthorized mount access;
* absolute path injection.

Logical Resource identifiers are preferred over physical paths.

---

# 110. Local MCP Processes

KnowledgeOS may launch local MCP Server processes where explicitly configured.

Local process execution is a privileged operation.

---

# 111. Process Configuration

A local MCP Server process configuration may define:

* executable identity;
* arguments;
* environment policy;
* working directory;
* allowed Resources;
* timeout;
* restart policy.

---

# 112. Environment Variables

Secrets shall not be injected into local MCP processes unless required and explicitly authorized.

Environment exposure shall be minimized.

---

# 113. Process Isolation

Local MCP processes should be isolated according to platform capabilities.

Isolation may include:

* restricted filesystem access;
* restricted environment;
* restricted network access;
* Resource limits.

---

# 114. Remote MCP Servers

Remote MCP Servers shall be treated as external network services.

They may fail independently.

KnowledgeOS core operation shall remain functional where possible.

---

# 115. Remote Failure

Remote MCP failure shall not corrupt canonical state.

Possible outcomes include:

* operation failure;
* retry;
* degraded integration state;
* queued work where safe.

---

# 116. Retry

MCP requests may be retried only when operation semantics permit.

Read-only operations may often be retryable.

State-changing Tools require explicit idempotency analysis.

---

# 117. Request Identity

Operations requiring retry safety should use stable Operation or Idempotency Identity where supported.

---

# 118. Duplicate Tool Invocation

Duplicate Tool invocation shall be expected where transport uncertainty exists.

State-changing Tools shall define duplicate-handling semantics.

---

# 119. Timeout

Every external MCP request shall have bounded timeout behavior.

Timeout does not prove that the remote operation did not complete.

---

# 120. Ambiguous Completion

When a state-changing remote Tool times out, the result may be unknown.

KnowledgeOS shall not blindly retry unless idempotency guarantees exist.

---

# 121. Cancellation

Cancellation is best effort unless the underlying operation provides stronger guarantees.

A cancellation request does not automatically imply that all external side effects were reversed.

---

# 122. Progress

Progress notifications are operational information.

They shall not be treated as canonical completion evidence.

---

# 123. Completion

An operation is complete only according to the Tool's defined completion semantics.

Transport response receipt alone may not imply external business completion.

---

# 124. Notifications

MCP notifications may be used for protocol-supported asynchronous updates.

Notifications shall remain distinct from the internal Event Bus.

---

# 125. Notification Translation

MCP notifications may be translated into approved Integration Events where useful.

They shall not be injected directly into the internal Event Bus.

---

# 126. Event Integration

MCP event-like behavior shall follow the principles defined in `EventIntegration.md`.

---

# 127. Resource Change Events

Resource change notifications may inform KnowledgeOS of external changes.

They do not automatically update canonical knowledge.

---

# 128. External Change Processing

An external change may trigger:

* Resource refresh;
* Import Workflow;
* user notification;
* reconciliation.

The applicable Platform workflow owns the resulting state change.

---

# 129. Error Model

MCP protocol errors shall be translated into stable KnowledgeOS Integration error categories.

---

# 130. Error Categories

Possible categories include:

* Protocol Error;
* Authentication Error;
* Authorization Error;
* Capability Error;
* Validation Error;
* Resource Not Found;
* Tool Failure;
* Timeout;
* Cancellation;
* Transport Failure;
* Compatibility Error;
* Rate Limit;
* External Service Failure.

---

# 131. Error Isolation

External error details shall not leak private KnowledgeOS implementation details.

Likewise, external server errors shall not be treated as trusted structured Domain data.

---

# 132. Internal Exceptions

Internal exceptions shall be mapped to safe public errors.

Stack traces shall remain internal.

---

# 133. External Error Preservation

Relevant external error metadata may be preserved for diagnostics.

Sensitive values shall be redacted.

---

# 134. Compatibility

MCP protocol compatibility and KnowledgeOS Capability compatibility are distinct.

A peer may support the protocol while lacking compatibility with a particular Tool or Resource contract.

---

# 135. Protocol Version

Protocol Version determines MCP-level compatibility.

It does not determine:

* Tool Version;
* Resource Version;
* Prompt Version;
* KnowledgeOS API Version.

---

# 136. Capability Version

Stable KnowledgeOS MCP Capabilities shall evolve through explicit Versioning where incompatible changes occur.

---

# 137. Backward Compatibility

Compatible evolution may include:

* adding optional fields;
* adding new independent Tools;
* adding new Resources;
* adding optional capabilities.

Compatibility shall be evaluated contractually.

---

# 138. Breaking Changes

Breaking changes may include:

* changing Tool input meaning;
* changing Resource identity semantics;
* removing required outputs;
* changing side-effect semantics.

Breaking changes require explicit Version evolution.

---

# 139. Unknown Capabilities

Unknown capabilities shall be ignored or rejected according to protocol rules.

They shall never grant implicit authority.

---

# 140. Unsupported Tool

An unsupported Tool invocation shall fail explicitly.

KnowledgeOS shall not guess a similar internal operation.

---

# 141. Unsupported Resource

An unsupported Resource request shall fail safely without exposing hidden Resource information.

---

# 142. Plugin Participation

Plugins may contribute MCP-facing capabilities only through approved Plugin Extension Points.

---

# 143. Plugin MCP Tool

A Plugin may expose an MCP Tool when:

* the Plugin declares the capability;
* the Tool contract is valid;
* required permissions are granted;
* the Tool is explicitly enabled.

---

# 144. Plugin Isolation

A Plugin MCP Tool shall not gain more authority than the Plugin itself possesses.

MCP exposure cannot elevate Plugin privileges.

---

# 145. Plugin Resource

A Plugin may expose approved Resources through namespaced contracts.

Plugin Resources shall not redefine core KnowledgeOS Resource identities.

---

# 146. Plugin Failure

Plugin failure shall not compromise the MCP Server or unrelated capabilities.

---

# 147. Provider Participation

Providers may implement external MCP connectivity.

Provider-specific implementation shall remain behind the Provider boundary.

---

# 148. MCP Provider

An MCP Provider may encapsulate:

* transport;
* connection lifecycle;
* external server configuration;
* protocol implementation.

It shall not own canonical Domain semantics.

---

# 149. Provider Replacement

Replacing an MCP Provider shall not require redesigning the Domain or Platform architecture.

---

# 150. Public API Relationship

MCP and the Public API are separate Integration surfaces.

They may expose overlapping capabilities through different protocols.

Neither shall directly wrap private internal services.

---

# 151. Canonical Contract Reuse

Where appropriate, MCP and Public API surfaces may reuse shared public logical contracts.

Protocol-specific envelopes remain separate.

---

# 152. Data Exchange Relationship

Complex MCP payloads may use approved Canonical Exchange representations where appropriate.

MCP shall not redefine canonical exchange semantics.

---

# 153. Import Relationship

MCP-acquired content entering the Library shall use the Import architecture.

MCP itself does not create canonical Knowledge Objects directly.

---

# 154. Export Relationship

KnowledgeOS content sent through MCP may use approved export or public projection mechanisms.

Direct storage extraction is prohibited.

---

# 155. Synchronization Relationship

MCP shall not become the implicit synchronization protocol of KnowledgeOS.

Synchronization remains governed by the dedicated Sync architecture.

---

# 156. Offline First

KnowledgeOS remains Offline First.

MCP integration shall not make core local operation depend upon external MCP availability.

---

# 157. Offline External Servers

External MCP Servers may be unavailable while offline.

KnowledgeOS shall expose clear degraded state.

---

# 158. Local MCP Operation

Local MCP integrations may remain available offline when their dependencies are local.

---

# 159. Deferred Operations

Some MCP-dependent operations may be deferred until connectivity returns.

Deferral shall only occur when operation semantics permit safe delayed execution.

---

# 160. Queued Tool Invocation

State-changing external Tool invocations shall not be queued blindly.

Queueing requires explicit guarantees concerning:

* user intent persistence;
* expiration;
* idempotency;
* destination identity;
* authorization validity.

---

# 161. Security Model

MCP Integration shall assume threats including:

* malicious MCP Clients;
* malicious MCP Servers;
* compromised local MCP processes;
* prompt injection;
* Tool misuse;
* data exfiltration;
* credential theft;
* path traversal;
* arbitrary process execution;
* excessive Resource consumption;
* confused-deputy attacks.

---

# 162. Confused Deputy Protection

KnowledgeOS shall not use its own authority to perform an operation merely because an MCP peer requested it.

Every operation shall be authorized against the requesting context.

---

# 163. Prompt Injection Protection

External content may attempt to instruct an AI system to:

* invoke Tools;
* reveal secrets;
* export private data;
* bypass policy.

External content shall remain data.

It does not grant authority.

---

# 164. Tool Description Trust

Tool descriptions supplied by external servers are untrusted metadata.

They may inform user interfaces or AI planning but shall not override KnowledgeOS policy.

---

# 165. Resource Content Trust

External Resource content is untrusted.

It shall not be treated as trusted system instruction.

---

# 166. Data Exfiltration Protection

Before sending data to an external MCP Server, KnowledgeOS shall verify:

* destination;
* Capability;
* authorization;
* consent where required;
* data scope.

---

# 167. Tool Chaining

One Tool result may influence another Tool invocation.

Tool chaining shall not bypass authorization at each step.

---

# 168. Transitive Authority

Authority shall not propagate transitively through Tool chains.

If Tool A can call Tool B conceptually, Tool A does not automatically inherit Tool B's permissions.

---

# 169. Resource Limits

MCP operations shall enforce limits for:

* message size;
* Resource size;
* Tool input size;
* Tool output size;
* execution time;
* concurrent operations;
* process memory where controllable.

---

# 170. Rate Limiting

MCP access may be rate-limited by:

* client;
* server;
* session;
* Tool;
* Resource;
* Principal.

---

# 171. Concurrency

Concurrent MCP operations shall follow the KnowledgeOS Execution architecture.

Concurrency shall not bypass:

* locking;
* Version checks;
* idempotency;
* Resource limits.

---

# 172. Backpressure

MCP adapters shall support bounded backpressure.

Unbounded request accumulation is prohibited.

---

# 173. Observability

MCP Integration shall be observable.

Observable metadata may include:

* Session Identity;
* peer identity;
* operation type;
* Tool Identity;
* Resource category;
* duration;
* result;
* error category;
* data-size category;
* authorization result.

---

# 174. Logging

Logs shall not contain by default:

* Tool payloads containing sensitive data;
* full Resource content;
* credentials;
* authorization tokens;
* private prompts;
* secrets.

---

# 175. Metrics

MCP metrics may include:

* active sessions;
* session failures;
* Tool invocations;
* Tool failures;
* Resource reads;
* authorization denials;
* consent requests;
* external server failures;
* timeouts;
* cancellations;
* protocol errors;
* average latency.

---

# 176. Tracing

MCP operations may participate in tracing.

A trace may represent:

```text
MCP Request
    │
    ▼
Validation
    │
    ▼
Authorization
    │
    ▼
Capability Adapter
    │
    ▼
Platform Operation
```

or:

```text
KnowledgeOS Operation
        │
        ▼
MCP Client Adapter
        │
        ▼
External MCP Server
```

---

# 177. Audit

Security-sensitive MCP operations may produce audit records.

Examples include:

* destructive Tool invocation;
* sensitive Resource access;
* data egress;
* persistent consent change;
* client registration;
* Capability grant;
* Capability revocation.

---

# 178. MCP Commands

Possible Integration commands include:

* RegisterMCPServer;
* RemoveMCPServer;
* EnableMCPServer;
* DisableMCPServer;
* RegisterMCPClient;
* RevokeMCPClient;
* GrantMCPCapability;
* RevokeMCPCapability;
* OpenMCPSession;
* CloseMCPSession;
* InvokeMCPTool;
* CancelMCPOperation.

These commands modify Integration operational state or initiate controlled operations.

---

# 179. MCP Queries

Possible queries include:

* GetMCPServer;
* ListMCPServers;
* GetMCPClient;
* ListMCPClients;
* GetMCPSession;
* ListAvailableMCPTools;
* ListAvailableMCPResources;
* GetMCPCapabilities;
* GetMCPOperationStatus.

Queries do not modify canonical knowledge.

---

# 180. MCP Events

Operational events may include:

* MCPServerRegistered;
* MCPServerRemoved;
* MCPSessionOpened;
* MCPSessionClosed;
* MCPSessionFailed;
* MCPToolInvocationStarted;
* MCPToolInvocationCompleted;
* MCPToolInvocationFailed;
* MCPResourceAccessed;
* MCPCapabilityGranted;
* MCPCapabilityRevoked;
* MCPClientRevoked.

These are operational events unless explicitly projected otherwise.

---

# 181. Failure Categories

MCP failures may include:

* Protocol Failure;
* Transport Failure;
* Authentication Failure;
* Authorization Failure;
* Capability Failure;
* Validation Failure;
* Tool Failure;
* Resource Failure;
* Timeout;
* Cancellation;
* Compatibility Failure;
* External Server Failure;
* Local Process Failure.

---

# 182. Failure Isolation

Failure of one MCP integration shall not:

* corrupt canonical knowledge;
* terminate unrelated MCP sessions;
* compromise unrelated Providers;
* disable core KnowledgeOS operation.

---

# 183. Circuit Breaking

Repeated remote MCP Server failure may activate circuit-breaking behavior.

The system may temporarily stop new requests while preserving configuration and diagnostic state.

---

# 184. Health

MCP integration health may include:

* Available;
* Degraded;
* Unavailable;
* Unauthorized;
* Incompatible;
* Disabled.

Health is operational state.

---

# 185. Testing Requirements

MCP Integration shall be tested through:

* protocol compatibility tests;
* Tool contract tests;
* Resource access tests;
* authorization tests;
* consent tests;
* malformed-input tests;
* prompt-injection tests;
* data-egress tests;
* timeout tests;
* cancellation tests;
* retry tests;
* failure-isolation tests;
* offline tests.

---

# 186. Tool Contract Testing

Each exposed Tool shall be tested for:

* valid input;
* invalid input;
* unauthorized invocation;
* side-effect behavior;
* idempotency where required;
* output contract;
* timeout;
* cancellation.

---

# 187. Resource Testing

Each exposed Resource shall be tested for:

* authorized access;
* unauthorized access;
* hidden Resource protection;
* Version behavior;
* size limits;
* path safety.

---

# 188. Security Testing

Security tests shall include:

* malicious client input;
* malicious external server output;
* prompt injection;
* Tool chaining abuse;
* path traversal;
* data exfiltration attempts;
* credential exposure;
* excessive Resource consumption.

---

# 189. Local Process Testing

Local MCP Server processes shall be tested for:

* startup failure;
* crash;
* timeout;
* excessive output;
* invalid protocol messages;
* environment isolation;
* cleanup.

---

# 190. Compatibility Testing

Compatibility testing shall distinguish:

* MCP protocol compatibility;
* Tool contract compatibility;
* Resource contract compatibility;
* Prompt contract compatibility.

---

# 191. Governance

Stable MCP-facing KnowledgeOS capabilities are public Integration contracts.

They shall be:

* documented;
* versioned;
* reviewed;
* tested;
* security-evaluated.

Internal implementation convenience shall not define the public MCP surface.

---

# 192. MCP Invariants

The following invariants apply.

* MCP belongs to the Integration layer.
* MCP is not the internal architecture of KnowledgeOS.
* KnowledgeOS may operate as MCP Client, MCP Server or both.
* MCP protocol types never become Domain types.
* MCP never receives direct access to Domain internals.
* MCP never receives direct access to Kernel internals.
* MCP never receives direct access to private Engine services.
* MCP never receives direct access to the NAS.
* MCP never receives unrestricted filesystem access by default.
* Every exposed capability is explicit.
* Capability discovery does not bypass authorization.
* Protocol capability support does not imply permission.
* Tool input is untrusted.
* Tool output uses public contracts.
* State-changing Tools use approved Commands or Workflows.
* Read-only Tools use approved public Queries.
* External MCP Servers are external dependencies.
* Discovered external Tools are not automatically enabled.
* Data sent to external MCP Servers is controlled data egress.
* External Resource content does not become canonical knowledge automatically.
* MCP-acquired content uses the Import architecture.
* AI-generated Tool arguments remain untrusted input.
* AI systems do not receive unrestricted Tool authority.
* User consent and authentication are distinct.
* Credentials remain isolated from MCP payloads.
* External content does not gain system-level authority.
* Tool chaining does not propagate authority transitively.
* MCP notifications do not expose the internal Event Bus.
* MCP does not replace synchronization.
* Core local KnowledgeOS operation does not depend upon external MCP availability.
* MCP operational state is not canonical knowledge.

---

# 193. Prohibited Behaviors

MCP Integration shall never:

* expose the Domain model directly;
* expose mutable Domain entities;
* expose the internal Event Bus;
* expose the Command Bus directly;
* expose the Query Bus directly;
* expose the Dependency Injection container;
* expose private Engine services;
* expose raw Storage Provider interfaces;
* expose NAS mount paths;
* expose unrestricted filesystem access by default;
* use internal runtime class names as public Tool identities;
* allow MCP clients to invoke private Domain methods;
* allow external Tool descriptions to override authorization policy;
* treat external Resource content as trusted system instruction;
* automatically enable every discovered external Tool;
* automatically import every external Resource;
* send entire Libraries externally without explicit authorization;
* expose Provider credentials;
* store credentials in Tool arguments or Resource URIs;
* log secrets;
* retry non-idempotent state-changing Tools blindly;
* assume timeout means an external operation did not complete;
* allow MCP exposure to elevate Plugin privileges;
* allow MCP to become an implicit synchronization protocol;
* make core offline operation depend unnecessarily upon remote MCP services.

---

# 194. Related Documents

* `EventIntegration.md`
* `OAuth.md`
* `RemoteExecution.md`
* `Webhooks.md`
* `../DataExchange/CanonicalExchange.md`
* `../DataExchange/Serialization.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/ExtensionPoints.md`
* `../Providers/ProviderModel.md`
* `../PublicAPI/APIConventions.md`
* `../PublicAPI/Authentication.md`
* `../../04-Platform/AI/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Sync/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`
* `../../06-Execution/Concurrency/Idempotency.md`
* `../../06-Execution/Concurrency/RetryPolicies.md`
* `../../06-Execution/Runtime/ExecutionContext.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`

---

# 195. Status

**Approved**

This document defines the architectural model governing Model Context Protocol integration within KnowledgeOS.

MCP is an Integration protocol.

It is not the Domain model, Kernel architecture, Plugin architecture, AI architecture, storage architecture or synchronization architecture.

KnowledgeOS may act as an MCP Client, an MCP Server or both.

Every MCP interaction crosses an explicit Integration Boundary.

Capabilities are explicit.

Authorization is mandatory.

Consent is required where operations expose sensitive data or create significant side effects.

Tools never invoke private Domain operations directly.

Resources are public projections rather than direct access to canonical storage.

Prompts do not define system authority.

External MCP Servers remain external dependencies.

External Resources remain untrusted data.

AI-generated Tool arguments remain untrusted input.

The NAS remains isolated behind the Library and Storage architecture.

Private Engine services remain inaccessible.

Kernel internals remain private.

MCP enables KnowledgeOS to participate in interoperable AI and agent ecosystems without allowing those ecosystems to become the internal architecture or authority model of KnowledgeOS.
