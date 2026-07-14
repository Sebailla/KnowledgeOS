
# Webhooks

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** External Services

**Document:** Webhooks

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model governing inbound and outbound Webhooks within KnowledgeOS.

Webhooks enable asynchronous communication between KnowledgeOS and external systems through event-oriented HTTP or equivalent callback mechanisms.

KnowledgeOS may participate as:

* a Webhook Receiver;
* a Webhook Sender;
* both roles simultaneously.

A Webhook is an Integration message.

It is not:

* a Domain Event;
* a Kernel Event;
* a Command;
* a Query;
* canonical state;
* proof that an external business operation completed;
* permission to mutate KnowledgeOS state directly.

Inbound Webhooks are external, untrusted input.

Outbound Webhooks are explicit external side effects.

Both directions shall cross controlled Integration boundaries.

---

# 2. Scope

This document governs:

* inbound Webhooks;
* outbound Webhooks;
* Webhook endpoints;
* Webhook subscriptions;
* source verification;
* destination verification;
* message authentication;
* signatures;
* secret management;
* payload validation;
* replay protection;
* duplicate delivery;
* ordering;
* acknowledgement;
* retries;
* delivery attempts;
* idempotency;
* event translation;
* Webhook Inbox;
* Webhook Outbox;
* dead-letter handling;
* endpoint lifecycle;
* subscription lifecycle;
* observability;
* privacy;
* security;
* Plugin participation;
* Provider participation;
* OAuth integration;
* Remote Execution integration;
* MCP integration.

This document does not govern:

* the internal Event Bus;
* Domain Event semantics;
* Command Bus behavior;
* Provider-specific Webhook payload schemas;
* general Public API design;
* synchronization protocols;
* arbitrary HTTP callbacks outside approved Integration contracts.

---

# 3. Architectural Position

Webhooks belong to the Integration layer.

```text
External System
      │
      ▼
05-Integration
      │
      ▼
Webhook Boundary
      │
      ▼
Public Integration Contract
      │
      ▼
Platform / Kernel
```

Webhooks shall never bypass this dependency direction.

---

# 4. Core Principle

A Webhook is an external notification.

It is not an internal Event.

The correct inbound model is:

```text
External Webhook
        │
        ▼
Receive
        │
        ▼
Authenticate Source
        │
        ▼
Validate
        │
        ▼
Deduplicate
        │
        ▼
Persist Receipt
        │
        ▼
Acknowledge
        │
        ▼
Process
        │
        ▼
Integration Translation
```

The prohibited model is:

```text
External Webhook
        │
        ▼
Internal Event Bus
        │
        ▼
Domain Mutation
```

---

# 5. Mission

The mission of Webhook Integration is to enable reliable asynchronous communication with external systems while preserving:

* architectural isolation;
* source verification;
* idempotency;
* replay protection;
* failure isolation;
* observability;
* recoverability;
* explicit external side effects.

---

# 6. Design Philosophy

Webhook Integration shall be:

* explicit;
* authenticated where possible;
* idempotent;
* replay-resistant;
* asynchronously processable;
* failure-isolated;
* observable;
* Provider-independent at the architectural level;
* bounded;
* privacy-aware.

---

# 7. Webhook Directions

KnowledgeOS distinguishes:

* Inbound Webhooks;
* Outbound Webhooks.

These directions have different trust and reliability models.

---

# 8. Inbound Webhook

An Inbound Webhook is a message sent by an external system to KnowledgeOS.

Inbound payloads are untrusted external input.

---

# 9. Outbound Webhook

An Outbound Webhook is a message sent by KnowledgeOS to an approved external destination.

Outbound delivery is an external side effect.

---

# 10. Directional Independence

Inbound and outbound Webhook capabilities shall be independently:

* configured;
* authorized;
* secured;
* observed;
* disabled.

---

# 11. Webhook Endpoint

A Webhook Endpoint is an Integration entry point that receives external Webhook requests.

An endpoint shall define:

* Endpoint Identity;
* Provider or source type;
* supported contract;
* authentication mechanism;
* payload limits;
* processing policy;
* lifecycle state.

---

# 12. Endpoint Identity

Every Webhook Endpoint shall have stable logical identity.

Endpoint Identity shall remain distinct from:

* network address;
* Provider Identity;
* Subscription Identity;
* secret identity.

---

# 13. Endpoint Address

The endpoint address is a transport location.

It shall not define architectural identity.

---

# 14. Endpoint Exposure

Webhook endpoints may require external network accessibility.

Exposure shall be explicit.

KnowledgeOS shall not expose local services publicly merely because a Provider supports Webhooks.

---

# 15. Local Application Constraint

KnowledgeOS is primarily a local-first application.

A local application may not always be reachable by external Webhook senders.

Webhook integration may therefore require:

* a user-controlled remote relay;
* a trusted Integration service;
* a Provider-specific polling fallback;
* another explicitly approved connectivity mechanism.

---

# 16. Remote Relay

A remote relay may receive Webhooks on behalf of a local KnowledgeOS instance.

The relay is an external Integration component.

It shall not receive unrestricted architectural authority.

---

# 17. Relay Boundary

The required model is:

```text
External Provider
        │
        ▼
Webhook Relay
        │
        ▼
Authenticated Delivery
        │
        ▼
KnowledgeOS Integration Boundary
```

The relay shall not receive direct access to:

* the Domain;
* Kernel internals;
* the NAS;
* private Engine services.

---

# 18. Relay Trust

A relay shall be treated according to its explicit trust model.

Relay use does not eliminate:

* payload validation;
* source verification;
* replay protection;
* authorization.

---

# 19. Inbound Request

Every inbound Webhook request shall be treated as untrusted until validated.

Validation may include:

* transport validation;
* source authentication;
* signature verification;
* timestamp verification;
* replay detection;
* payload validation;
* size validation.

---

# 20. Transport Security

Externally exposed Webhook endpoints shall use appropriate transport security.

Plaintext transport shall not be used for sensitive Webhook traffic.

---

# 21. Source Authentication

KnowledgeOS shall authenticate Webhook sources where the Provider supports a reliable authentication mechanism.

Possible mechanisms include:

* cryptographic signatures;
* shared secrets;
* asymmetric signatures;
* authenticated relay identity;
* mutually authenticated transport.

---

# 22. Source Authentication Is Provider-Specific

Webhook authentication mechanisms differ between Providers.

Provider-specific verification shall remain behind Provider or Integration adapters.

---

# 23. Signature Verification

Where a Provider signs Webhooks, KnowledgeOS shall verify the signature before trusted processing.

---

# 24. Raw Payload Requirement

Some signature schemes require the exact raw request body.

The architecture shall preserve the raw payload until signature verification completes.

Payload parsing shall not alter the bytes used for verification.

---

# 25. Signature Algorithm

Supported signature algorithms shall be explicitly configured.

KnowledgeOS shall not silently accept unknown or downgraded algorithms.

---

# 26. Secret-Based Signatures

Shared Webhook secrets shall be stored through approved secure credential infrastructure.

They shall not be stored in:

* Library content;
* Knowledge Objects;
* Plugin manifests;
* logs;
* public configuration exports.

---

# 27. Asymmetric Signatures

Where asymmetric signatures are used, KnowledgeOS shall validate:

* signing key identity;
* algorithm;
* signature;
* key validity;
* key rotation policy where applicable.

---

# 28. Key Rotation

Webhook verification shall support Provider key rotation where required.

Rotation shall not create uncontrolled periods of accepting arbitrary keys.

---

# 29. Timestamp Validation

Where a signed timestamp is available, KnowledgeOS may enforce an acceptance window.

This reduces replay risk.

---

# 30. Clock Tolerance

Timestamp validation may allow bounded clock tolerance.

Unlimited acceptance windows are prohibited where timestamps are used for replay protection.

---

# 31. Replay Protection

A previously valid Webhook may be maliciously or accidentally replayed.

KnowledgeOS shall implement replay protection appropriate to the Provider contract.

---

# 32. Delivery Identity

Where available, every inbound Webhook delivery shall have stable external Delivery Identity.

Delivery Identity supports:

* deduplication;
* tracing;
* replay detection;
* audit.

---

# 33. Generated Delivery Identity

If a Provider does not supply stable Delivery Identity, KnowledgeOS may derive a bounded deduplication key from approved message properties.

Derived identity shall not be assumed globally unique without contractual support.

---

# 34. Duplicate Delivery

Duplicate Webhook delivery is expected behavior.

Webhook processing shall be designed accordingly.

---

# 35. At-Least-Once Delivery

Many Webhook systems effectively provide at-least-once delivery.

KnowledgeOS shall not assume exactly-once delivery.

---

# 36. Exactly-Once Illusion

Exactly-once external delivery shall not be assumed.

The architecture shall instead combine:

* stable identity;
* durable receipt;
* idempotent processing;
* reconciliation.

---

# 37. Webhook Inbox

Inbound Webhooks should use a durable Webhook Inbox where reliability requires it.

The conceptual model is:

```text
Webhook Request
        │
        ▼
Authenticate
        │
        ▼
Validate Envelope
        │
        ▼
Deduplicate
        │
        ▼
Persist Inbox Record
        │
        ▼
Acknowledge
        │
        ▼
Asynchronous Processing
```

---

# 38. Inbox Responsibility

The Webhook Inbox may preserve:

* Receipt Identity;
* Delivery Identity;
* Provider Identity;
* Endpoint Identity;
* receipt timestamp;
* processing state;
* bounded payload or secure payload reference;
* attempt history.

---

# 39. Inbox Is Operational State

The Webhook Inbox is Integration operational state.

It is not canonical knowledge.

---

# 40. Inbox Durability

Where acknowledgement occurs before business processing, the Inbox shall be durable enough to recover processing after failure.

---

# 41. Acknowledgement

Webhook acknowledgement tells the sender whether the delivery was accepted at the transport or Integration boundary.

It does not necessarily mean:

* business processing completed;
* canonical state changed;
* downstream workflows succeeded.

---

# 42. Fast Acknowledgement

Where Provider timeout requirements are strict, KnowledgeOS should:

* verify the minimum required security conditions;
* validate the message envelope;
* persist the receipt durably;
* acknowledge;
* process asynchronously.

---

# 43. Acknowledgement Before Verification

KnowledgeOS shall not acknowledge an unauthenticated message as valid merely to reduce latency.

Required source verification shall occur before accepted acknowledgement.

---

# 44. Processing

Webhook business processing shall occur through approved Integration translation.

The Webhook handler itself shall not directly mutate Domain state.

---

# 45. Translation

An inbound Webhook may translate into:

* an Integration Event;
* a Command;
* a Workflow trigger;
* a reconciliation request;
* an operational state update.

The translation shall be explicit.

---

# 46. External Event Versus Internal Event

An external event and an internal Event are different objects.

```text
External Provider Event
        │
        ▼
Webhook Payload
        │
        ▼
Integration Validation
        │
        ▼
Translation
        │
        ▼
Approved Internal Event
```

---

# 47. No Direct Event Bus Injection

External Webhook payloads shall never be published directly into the internal Event Bus.

---

# 48. No Direct Domain Mutation

Webhook handlers shall never directly mutate:

* Domain entities;
* Knowledge Objects;
* Library state;
* annotations;
* synchronization state.

State changes shall occur through approved Commands or Workflows.

---

# 49. Payload Validation

Webhook payloads shall undergo contract validation.

Validation may include:

* schema;
* required fields;
* field types;
* value constraints;
* size limits;
* supported event type.

---

# 50. Authentication Before Semantic Trust

A structurally valid payload from an unauthenticated source remains untrusted.

Structural validation does not replace source authentication.

---

# 51. Unknown Event Type

Unknown external event types shall be:

* rejected;
* ignored;
* quarantined;

according to the Provider contract.

They shall never be guessed into a similar internal operation.

---

# 52. Provider Event Version

Provider Webhook event schemas may evolve.

KnowledgeOS shall track applicable event Version where available.

---

# 53. Version Compatibility

A supported Provider event Version shall be mapped through a version-aware adapter.

Unsupported incompatible versions shall fail safely.

---

# 54. Payload Size

Webhook endpoints shall enforce bounded payload sizes.

Unbounded request bodies are prohibited.

---

# 55. Binary Payloads

Large binary content should not normally be delivered directly through Webhooks.

Webhooks should preferably carry:

* metadata;
* identifiers;
* bounded references.

Referenced content shall be retrieved through an authenticated Provider operation.

---

# 56. Reference Retrieval

A Webhook containing an external Resource reference does not authorize unrestricted retrieval.

KnowledgeOS shall independently authorize and validate retrieval.

---

# 57. Webhook Ordering

Webhook delivery order shall not be assumed unless explicitly guaranteed.

---

# 58. Out-of-Order Delivery

KnowledgeOS shall expect:

```text
Event 1 generated
Event 2 generated

Delivery order:
Event 2
Event 1
```

Processing shall account for this where state ordering matters.

---

# 59. Event Version for Ordering

Where a Provider exposes:

* sequence numbers;
* object versions;
* timestamps;

they may assist ordering.

Their semantics shall be defined by the Provider contract.

---

# 60. Timestamp Is Not Total Ordering

Timestamps alone shall not be assumed to provide globally reliable total ordering.

---

# 61. Stale Webhook

A valid but stale Webhook shall not overwrite newer known state blindly.

---

# 62. Reconciliation

When Webhook ordering or delivery completeness is uncertain, KnowledgeOS should reconcile against the authoritative external Provider state where possible.

---

# 63. Webhook as Signal

For many integrations, a Webhook should be treated as:

> a signal that external state may have changed.

The authoritative state may need to be retrieved separately.

---

# 64. Event-Carried State

Where a Provider contract guarantees complete event-carried state, KnowledgeOS may process that state directly after validation.

The guarantee shall be explicit.

---

# 65. Thin Event Model

A thin Webhook may contain only:

* event type;
* external object identity;
* external Version.

KnowledgeOS then retrieves current state through the Provider.

---

# 66. Race During Retrieval

External state may change again between Webhook receipt and state retrieval.

Reconciliation logic shall account for current Provider state rather than assuming the Webhook snapshot remains current.

---

# 67. Idempotent Processing

Processing the same logical external event more than once shall not produce uncontrolled duplicate effects.

---

# 68. Processing Identity

Webhook processing shall use stable identity derived from:

* Delivery Identity;
* external Event Identity;
* external object Version;
* another Provider-defined idempotency key.

---

# 69. Receipt Deduplication

Receipt deduplication prevents unnecessary duplicate Inbox records where possible.

---

# 70. Processing Deduplication

Processing deduplication prevents repeated side effects.

Receipt deduplication and processing idempotency are related but distinct.

---

# 71. Failed Processing

A valid accepted Webhook may fail during downstream processing.

The failure shall not cause loss of the accepted message.

---

# 72. Processing Retry

Failed processing may be retried according to bounded policy.

Retry shall consider:

* failure category;
* idempotency;
* expiration;
* current external state.

---

# 73. Dead-Letter Handling

Webhook messages that cannot be processed after bounded attempts may enter a dead-letter state.

---

# 74. Dead-Letter Record

A dead-letter record may preserve:

* Receipt Identity;
* Provider Identity;
* event type;
* failure category;
* attempt history;
* diagnostic metadata.

Sensitive payloads shall remain protected.

---

# 75. Dead-Letter Recovery

Dead-letter items may support:

* manual retry;
* automated retry after configuration correction;
* discard;
* reconciliation.

---

# 76. Poison Message

A repeatedly failing message shall not block unrelated Webhook processing indefinitely.

---

# 77. Inbound Rate Limiting

Webhook endpoints shall protect against excessive request rates.

Rate limiting shall consider legitimate Provider burst behavior.

---

# 78. Backpressure

Inbound processing shall use bounded queues and backpressure.

Unbounded accumulation is prohibited.

---

# 79. Overload

During overload, the system shall choose explicit behavior such as:

* reject before acceptance;
* persist and defer;
* apply Provider-specific backpressure.

It shall not acknowledge messages that it cannot durably retain when durability is required.

---

# 80. Outbound Webhooks

KnowledgeOS may send Webhooks to approved external destinations.

Outbound Webhooks are explicit external Integration side effects.

---

# 81. Outbound Subscription

An Outbound Webhook Subscription defines:

* Subscription Identity;
* destination;
* event contract;
* enabled event types;
* authentication mechanism;
* lifecycle state;
* delivery policy.

---

# 82. Subscription Identity

Every persistent outbound subscription shall have stable identity.

---

# 83. Destination

A destination is an external network endpoint.

It shall be:

* explicitly configured;
* validated;
* authorized.

---

# 84. Destination Validation

KnowledgeOS shall protect against dangerous destinations.

Validation shall consider:

* malformed URLs;
* unsupported schemes;
* local network targets where prohibited;
* loopback targets where prohibited;
* metadata services;
* restricted addresses.

---

# 85. SSRF Protection

User-configurable Webhook destinations create Server-Side Request Forgery risk.

Outbound Webhook delivery shall enforce network destination policy.

---

# 86. DNS Rebinding

Destination validation shall consider DNS rebinding where applicable to the deployment model.

Validation only at subscription creation may be insufficient.

---

# 87. Redirect Handling

Outbound Webhook delivery shall not follow arbitrary redirects blindly.

Redirect policy shall be explicit.

---

# 88. Destination Authentication

KnowledgeOS may authenticate to a destination using:

* shared secret signatures;
* bearer credentials;
* OAuth;
* mutual authentication;
* Provider-specific mechanisms.

Credentials shall remain isolated.

---

# 89. Outbound Event Selection

Only explicitly approved events shall be exposed through outbound Webhooks.

Internal Event Bus contents shall not automatically become public Webhook events.

---

# 90. Public Event Projection

An internal event may produce a public Integration event projection.

```text
Internal Event
      │
      ▼
Public Event Projection
      │
      ▼
Outbound Webhook Contract
```

---

# 91. Public Contract

Outbound Webhook payloads shall use stable public contracts.

They shall not expose:

* internal class names;
* private Domain objects;
* stack traces;
* internal storage paths;
* NAS paths;
* credentials.

---

# 92. Data Egress

Outbound Webhook delivery is data egress.

Payload construction shall enforce:

* subscription scope;
* user policy;
* privacy;
* minimum necessary data.

---

# 93. Subscription Scope

A subscription may be restricted by:

* event type;
* Library;
* Workspace;
* Knowledge Object category;
* Plugin;
* external client.

---

# 94. Outbound Webhook Outbox

Reliable outbound delivery should use an Outbox model.

```text
Approved Internal Change
        │
        ▼
Public Event Projection
        │
        ▼
Persist Outbox Record
        │
        ▼
Commit
        │
        ▼
Asynchronous Delivery
```

---

# 95. Outbox Responsibility

The Webhook Outbox may preserve:

* Delivery Identity;
* Subscription Identity;
* event identity;
* payload or secure payload reference;
* attempt count;
* next attempt time;
* delivery state.

---

# 96. Outbox Is Operational State

The Webhook Outbox is Integration operational state.

It is not canonical knowledge.

---

# 97. Atomicity Boundary

KnowledgeOS cannot generally atomically commit:

* local canonical state;
* external Webhook delivery.

The Outbox pattern bridges this boundary.

---

# 98. Delivery Attempt

Every outbound network attempt shall have Attempt Identity.

---

# 99. Delivery State

Possible outbound delivery states include:

* Pending;
* Delivering;
* Delivered;
* RetryScheduled;
* Failed;
* DeadLettered;
* Cancelled.

---

# 100. Delivery Success

Delivery success shall be determined by the configured Webhook contract.

A transport-level successful response does not necessarily prove the receiving system completed downstream business processing.

---

# 101. Delivery Failure

Delivery failure may result from:

* network failure;
* timeout;
* DNS failure;
* TLS failure;
* authentication failure;
* destination rejection;
* rate limiting;
* server error.

---

# 102. Outbound Retry

Outbound retry shall use bounded policy.

Policy may define:

* maximum attempts;
* backoff;
* jitter;
* retryable status categories;
* expiration.

---

# 103. Duplicate Outbound Delivery

The destination may receive the same logical Webhook more than once.

Outbound payloads should include stable Delivery or Event Identity where appropriate.

---

# 104. Destination Idempotency

KnowledgeOS cannot guarantee that external destinations process Webhooks idempotently.

It shall provide sufficient identity information where the contract supports it.

---

# 105. Outbound Ordering

KnowledgeOS shall not promise strict delivery ordering unless explicitly implemented and documented.

Retries may reorder delivery.

---

# 106. Ordered Subscription

If strict per-subscription ordering is required, it shall be an explicit delivery mode with defined trade-offs.

---

# 107. Slow Destination

A slow external destination shall not block:

* internal Event processing;
* unrelated subscriptions;
* core KnowledgeOS operation.

---

# 108. Failing Destination

Repeated failure of one destination shall be isolated from other destinations.

---

# 109. Circuit Breaking

A persistently failing destination may enter temporary circuit-open state.

Pending deliveries remain governed by retention and retry policy.

---

# 110. Subscription Disablement

A subscription may be disabled:

* manually;
* after security failure;
* after persistent delivery failure;
* after credential revocation.

---

# 111. Subscription Revocation

Revocation shall prevent future event delivery.

Pending deliveries shall follow explicit cancellation or retention policy.

---

# 112. Secret Rotation

Webhook signing or authentication secrets shall support rotation where required.

---

# 113. Dual-Key Transition

A bounded transition period may support old and new verification keys where necessary.

The transition shall expire.

---

# 114. Secret Identity

Secret metadata may be referenced by Secret Identity.

The secret value shall remain in secure credential storage.

---

# 115. Secret Exposure

Webhook secrets shall never be exposed through:

* Public API responses;
* Plugin contracts;
* MCP Resources;
* AI context;
* logs;
* canonical knowledge.

---

# 116. OAuth Integration

Webhook subscription creation or management may require OAuth.

OAuth credentials shall use the shared architecture defined in `OAuth.md`.

---

# 117. Remote Execution Integration

Remote execution Providers may report status through Webhooks.

A remote execution Webhook shall:

* authenticate the Provider;
* validate the execution reference;
* update Integration operational state;
* trigger approved result handling.

It shall not directly mutate canonical knowledge.

---

# 118. MCP Integration

MCP-related external systems may use Webhooks only through explicit Integration contracts.

MCP capabilities and Webhook subscriptions remain distinct authorization surfaces.

---

# 119. Provider Integration

Provider-specific Webhook behavior belongs behind Provider adapters.

A Provider adapter may define:

* event schema;
* signature verification;
* event type mapping;
* acknowledgement requirements;
* retry expectations.

---

# 120. Plugin Participation

Plugins may register Webhook-related capabilities only through approved Plugin Extension Points.

---

# 121. Plugin Inbound Webhook

A Plugin may process an inbound Webhook only when:

* the endpoint is explicitly registered;
* required Capability is granted;
* authentication policy is defined;
* payload contract is validated.

---

# 122. Plugin Isolation

A Plugin Webhook handler shall not gain unrestricted:

* Domain access;
* Kernel access;
* filesystem access;
* NAS access.

---

# 123. Plugin Failure

Plugin Webhook processing failure shall not compromise:

* the Webhook receiver;
* unrelated endpoints;
* unrelated Plugins.

---

# 124. Plugin Outbound Webhook

A Plugin may request outbound Webhook delivery only through approved Integration capabilities.

Direct unrestricted network callbacks are prohibited unless explicitly granted.

---

# 125. Domain Isolation

Inbound Webhooks shall never expose external payloads directly as mutable Domain entities.

---

# 126. Kernel Isolation

External Webhook senders shall never access:

* Event Bus;
* Command Bus;
* Query Bus;
* Scheduler;
* Job System;
* Dependency Injection container.

---

# 127. Library Isolation

Webhook payloads shall never receive direct Library authority.

A Webhook may identify an external event that causes KnowledgeOS to initiate an approved Library operation.

---

# 128. NAS Isolation

Webhooks shall never expose:

* NAS credentials;
* NAS mount paths;
* direct NAS access.

---

# 129. AI Isolation

Webhook payloads sent to AI processing remain untrusted external content.

They shall not become trusted instructions.

---

# 130. Prompt Injection

External Webhook content may contain instruction-like text.

Such content remains data.

It shall not override:

* system policy;
* authorization;
* Tool permissions;
* user intent.

---

# 131. Webhook Registration

Endpoint or subscription registration is a privileged Integration operation.

---

# 132. Registration Validation

Registration shall validate:

* identity;
* contract;
* authentication configuration;
* destination or source;
* permissions;
* scope.

---

# 133. Provider Verification Challenge

Some Providers require endpoint verification challenges.

Challenge handling shall be Provider-specific and bounded.

A verification challenge shall not grant general access to the endpoint.

---

# 134. Endpoint Lifecycle

Possible endpoint states may include:

* Configuring;
* Active;
* Disabled;
* Invalid;
* Revoked.

---

# 135. Subscription Lifecycle

Possible subscription states may include:

* Pending;
* Active;
* Suspended;
* Disabled;
* Revoked;
* Failed.

---

# 136. External Subscription Identity

An external Provider may assign its own Subscription Identity.

KnowledgeOS shall preserve mapping between:

* internal Subscription Identity;
* external Subscription Identity.

---

# 137. Subscription Reconciliation

KnowledgeOS may reconcile local subscription state with the external Provider.

This is necessary when:

* creation outcome is ambiguous;
* external revocation occurs;
* configuration changes externally.

---

# 138. Registration Ambiguity

A timeout during remote subscription creation may leave the outcome unknown.

KnowledgeOS shall reconcile rather than blindly create duplicate subscriptions.

---

# 139. Offline First

KnowledgeOS remains Offline First.

Webhook availability shall not be required for core local knowledge access.

---

# 140. Offline Inbound Delivery

A local KnowledgeOS instance may be unavailable when an external Provider sends a Webhook.

Reliable integration may require:

* Provider retry;
* remote relay;
* later reconciliation.

---

# 141. Missed Webhooks

KnowledgeOS shall assume that Webhooks may be missed.

Critical external state shall support reconciliation where possible.

---

# 142. Webhooks Are Not Synchronization

Webhooks may signal changes.

They do not replace the dedicated synchronization architecture.

---

# 143. Offline Outbound Delivery

Outbound Webhooks may remain pending while offline.

Delivery shall resume according to:

* expiration;
* authorization;
* subscription state;
* retry policy.

---

# 144. Deferred Delivery

Deferred outbound delivery shall revalidate:

* subscription status;
* destination configuration;
* credentials where required.

---

# 145. Expiration

Webhook messages may have bounded useful lifetime.

Expired messages may be discarded or dead-lettered according to contract.

---

# 146. Retention

Webhook Inbox and Outbox records shall have explicit retention policies.

Retention shall consider:

* recovery;
* audit;
* privacy;
* storage limits.

---

# 147. Payload Retention

Full payload retention should be minimized.

Where possible, the system may retain:

* hashes;
* identifiers;
* bounded metadata;

instead of sensitive full payloads after processing.

---

# 148. Personal Data

Webhook payloads may contain personal or sensitive information.

Retention and logging shall follow privacy policy.

---

# 149. Deletion

Deleting operational Webhook records shall not imply deletion of canonical knowledge created through an approved downstream process.

---

# 150. Security Model

Webhook Integration shall assume threats including:

* forged Webhooks;
* replay attacks;
* signature bypass;
* secret theft;
* payload tampering;
* oversized payloads;
* denial of service;
* SSRF;
* malicious redirects;
* duplicate delivery;
* event-order manipulation;
* malicious Plugin handlers;
* prompt injection.

---

# 151. Verification Order

The preferred inbound security sequence is:

```text
Receive
  │
  ▼
Apply Transport Limits
  │
  ▼
Preserve Required Raw Payload
  │
  ▼
Authenticate Source
  │
  ▼
Check Replay Constraints
  │
  ▼
Validate Payload
  │
  ▼
Persist Receipt
```

Provider-specific requirements may adjust exact ordering.

---

# 152. Constant-Time Comparison

Secret-based signature comparisons should use timing-safe comparison where applicable.

---

# 153. Failure Response

Authentication failures shall fail safely.

Error responses shall not reveal:

* expected signatures;
* secrets;
* internal verification details.

---

# 154. Endpoint Enumeration

Endpoint behavior should avoid unnecessary disclosure of:

* configured Providers;
* valid subscription identities;
* internal architecture.

---

# 155. Denial of Service Protection

Webhook endpoints shall enforce:

* request size limits;
* timeouts;
* rate limits;
* bounded parsing;
* bounded concurrency.

---

# 156. Parsing Safety

Untrusted payload parsing shall use safe parsers and bounded resource consumption.

---

# 157. XML and Complex Formats

If Provider payloads use complex formats, parser configuration shall disable unsafe features where applicable.

---

# 158. Observability

Webhook Integration shall be observable.

Observable metadata may include:

* Endpoint Identity;
* Subscription Identity;
* Provider Identity;
* Delivery Identity;
* event type;
* receipt time;
* verification result;
* processing result;
* delivery result;
* attempt count;
* latency;
* failure category.

---

# 159. Logging

Logs shall not contain by default:

* signing secrets;
* authentication tokens;
* full sensitive payloads;
* unrestricted personal data.

---

# 160. Metrics

Webhook metrics may include:

* inbound requests;
* verified requests;
* rejected requests;
* duplicate deliveries;
* replay rejections;
* processing failures;
* dead-lettered messages;
* outbound deliveries;
* outbound failures;
* retry counts;
* delivery latency.

---

# 161. Tracing

Inbound tracing may represent:

```text
Webhook Receive
      │
      ▼
Verification
      │
      ▼
Inbox
      │
      ▼
Processing
      │
      ▼
Integration Translation
      │
      ▼
Workflow
```

Outbound tracing may represent:

```text
Internal Change
      │
      ▼
Public Projection
      │
      ▼
Outbox
      │
      ▼
Delivery Attempt
      │
      ▼
External Destination
```

---

# 162. Audit

Security-sensitive operations may produce audit records.

Examples include:

* endpoint registration;
* endpoint revocation;
* subscription creation;
* subscription revocation;
* signing secret rotation;
* repeated authentication failure;
* sensitive outbound data delivery.

---

# 163. Webhook Commands

Possible Integration commands include:

* RegisterWebhookEndpoint;
* EnableWebhookEndpoint;
* DisableWebhookEndpoint;
* RevokeWebhookEndpoint;
* RegisterWebhookSubscription;
* DisableWebhookSubscription;
* RevokeWebhookSubscription;
* RetryWebhookProcessing;
* RetryWebhookDelivery;
* DeadLetterWebhook;
* ReconcileWebhookSubscription;
* RotateWebhookSecret.

---

# 164. Webhook Queries

Possible queries include:

* GetWebhookEndpoint;
* ListWebhookEndpoints;
* GetWebhookSubscription;
* ListWebhookSubscriptions;
* GetWebhookReceipt;
* GetWebhookDelivery;
* GetWebhookProcessingStatus;
* GetWebhookDeliveryStatus;
* ListDeadLetterWebhooks.

Queries shall never return secret values.

---

# 165. Webhook Events

Operational events may include:

* WebhookReceived;
* WebhookVerified;
* WebhookRejected;
* WebhookDuplicateDetected;
* WebhookProcessingStarted;
* WebhookProcessingCompleted;
* WebhookProcessingFailed;
* WebhookDeadLettered;
* WebhookDeliveryScheduled;
* WebhookDeliverySucceeded;
* WebhookDeliveryFailed;
* WebhookSubscriptionActivated;
* WebhookSubscriptionRevoked.

---

# 166. Event Payload Security

Webhook operational events shall not contain:

* signing secrets;
* authentication tokens;
* unrestricted sensitive payloads.

---

# 167. Failure Categories

Webhook failures may include:

* InvalidTransport;
* PayloadTooLarge;
* AuthenticationFailed;
* SignatureInvalid;
* ReplayDetected;
* PayloadInvalid;
* UnsupportedEvent;
* DuplicateDelivery;
* ProcessingFailed;
* DeliveryFailed;
* DestinationUnavailable;
* DestinationRejected;
* RateLimited;
* SubscriptionInvalid;
* ConfigurationInvalid.

---

# 168. Failure Isolation

Failure of one Webhook:

* shall not crash the Kernel;
* shall not block unrelated endpoints;
* shall not block unrelated subscriptions;
* shall not corrupt canonical knowledge;
* shall not disable core Library access.

---

# 169. Testing Requirements

Webhook Integration shall be tested through:

* signature-verification tests;
* replay tests;
* duplicate-delivery tests;
* payload-validation tests;
* ordering tests;
* Inbox recovery tests;
* Outbox delivery tests;
* retry tests;
* dead-letter tests;
* SSRF tests;
* secret-rotation tests;
* offline tests;
* failure-isolation tests.

---

# 170. Signature Testing

Tests shall include:

* valid signature;
* invalid signature;
* missing signature;
* modified payload;
* expired timestamp;
* unknown key;
* rotated key.

---

# 171. Replay Testing

Tests shall verify:

* first valid delivery is accepted;
* prohibited replay is detected;
* replay window behavior is bounded;
* duplicate legitimate Provider delivery remains idempotent.

---

# 172. Inbox Testing

Tests shall include:

* crash after durable receipt;
* crash before acknowledgement;
* crash after acknowledgement;
* processing retry;
* poison message.

---

# 173. Outbox Testing

Tests shall include:

* local commit followed by crash;
* delivery retry;
* destination timeout;
* duplicate delivery;
* permanent destination failure;
* dead-letter transition.

---

# 174. Ordering Testing

Tests shall include:

* in-order delivery;
* out-of-order delivery;
* stale event;
* duplicate old event;
* reconciliation with current Provider state.

---

# 175. SSRF Testing

Outbound Webhook tests shall include attempts to target:

* loopback addresses;
* private network addresses where prohibited;
* metadata services;
* redirect chains;
* DNS rebinding scenarios where applicable.

---

# 176. Security Testing

Security tests shall include:

* forged payload;
* signature bypass;
* oversized request;
* malicious parser input;
* secret leakage;
* endpoint enumeration;
* malicious Plugin handler;
* prompt injection content.

---

# 177. Offline Testing

Offline tests shall verify:

* core local operation continues;
* outbound delivery can defer safely;
* missed inbound Webhooks can be reconciled where supported;
* reconnect does not create uncontrolled duplicate effects.

---

# 178. Governance

Webhook Integration is a security-sensitive external boundary.

Changes affecting:

* endpoint exposure;
* signature verification;
* replay protection;
* secret management;
* outbound destination policy;
* public event contracts;
* payload retention;

require architectural and security review.

---

# 179. Webhook Invariants

The following invariants apply.

* Webhooks belong to the Integration layer.
* An external Webhook is not an internal Event.
* Inbound Webhooks are untrusted external input.
* Outbound Webhooks are explicit external side effects.
* Inbound and outbound capabilities are independently controlled.
* Required source verification occurs before accepted processing.
* Structurally valid payload does not imply authenticated source.
* Signature verification may require preservation of the exact raw payload.
* Duplicate delivery is expected.
* Exactly-once external delivery is not assumed.
* Inbound processing is idempotent.
* Webhook receipt and business processing are distinct.
* Acknowledgement does not imply canonical state change.
* External payloads never enter the internal Event Bus directly.
* Webhook handlers never mutate Domain state directly.
* Provider events are translated through the Integration boundary.
* Webhook ordering is not assumed unless explicitly guaranteed.
* Timestamps alone do not provide reliable total ordering.
* Stale events do not overwrite newer state blindly.
* Critical external state supports reconciliation where possible.
* Webhooks may signal change but do not replace synchronization.
* Reliable inbound processing may use a durable Inbox.
* Reliable outbound delivery may use a durable Outbox.
* Inbox and Outbox records are operational state.
* Outbound Webhook contracts are explicit public projections.
* Internal Events do not automatically become public Webhook events.
* Outbound delivery is controlled data egress.
* Webhook secrets remain in secure credential storage.
* Webhook secrets never enter canonical knowledge.
* Plugins do not gain unrestricted network or Domain authority through Webhooks.
* Remote Execution Webhooks do not directly mutate canonical state.
* Core local KnowledgeOS operation does not depend upon Webhook availability.

---

# 180. Prohibited Behaviors

Webhook Integration shall never:

* treat an inbound Webhook as an internal Event directly;
* publish raw external payloads directly to the Event Bus;
* mutate Domain state directly from a Webhook transport handler;
* trust payload structure as proof of sender identity;
* accept invalid signatures;
* ignore required replay protection;
* assume duplicate delivery will not occur;
* assume exactly-once delivery;
* assume Webhook ordering without contractual guarantee;
* allow stale events to overwrite newer state blindly;
* acknowledge messages as durably accepted when they cannot be retained;
* store Webhook secrets in Library content;
* store Webhook secrets in Knowledge Objects;
* expose signing secrets through Public APIs;
* expose signing secrets to AI models;
* expose signing secrets to MCP peers;
* expose signing secrets to Plugins by default;
* automatically expose all internal Events as outbound Webhooks;
* send unrestricted canonical objects in outbound payloads;
* follow arbitrary outbound redirects blindly;
* permit unrestricted outbound destinations;
* allow Webhook destinations to bypass SSRF protections;
* allow Plugin Webhook handlers to bypass Capability controls;
* use Webhooks as the synchronization architecture;
* make core Library access depend upon external Webhook delivery.

---

# 181. Related Documents

* `EventIntegration.md`
* `MCP.md`
* `OAuth.md`
* `RemoteExecution.md`
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
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Sync/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`
* `../../06-Execution/Concurrency/Idempotency.md`
* `../../06-Execution/Concurrency/RetryPolicies.md`
* `../../06-Execution/Messaging/EventOrdering.md`
* `../../06-Execution/Messaging/EventProcessing.md`
* `../../06-Execution/Reliability/Recovery.md`
* `../../06-Execution/Runtime/ExecutionContext.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`
* `../../01-Foundation/QualityAttributes.md`

---

# 182. Status

**Approved**

This document defines the architectural model governing inbound and outbound Webhooks within KnowledgeOS.

Webhooks belong to the Integration layer.

An inbound Webhook is an untrusted external notification.

It is not an internal Event.

It does not grant the sender direct authority over the Domain, Kernel, Library, NAS or private Engine services.

Inbound Webhooks cross explicit boundaries for transport control, source verification, replay protection, payload validation, durable receipt and Integration translation.

Duplicate delivery is expected.

Exactly-once external delivery is not assumed.

Processing is idempotent.

Ordering is not assumed unless explicitly guaranteed.

Critical external state is reconciled where possible.

A Webhook may signal that external state changed without itself being the authoritative state.

Reliable inbound processing may use a durable Inbox.

Reliable outbound delivery may use a durable Outbox.

Webhook acknowledgement and business completion remain distinct.

Outbound Webhooks are explicit external side effects and controlled data egress.

Internal Events do not automatically become public Webhook events.

Only approved public projections cross the Integration boundary.

Webhook secrets remain isolated in secure credential storage.

Plugins, MCP integrations, Remote Execution Providers and external services remain subject to their existing authorization boundaries.

Webhooks support asynchronous interoperability without allowing external messages to become direct internal authority.

KnowledgeOS remains Offline First.

Core local knowledge access does not depend upon Webhook availability.

Webhooks complement external integration and reconciliation.

They do not replace the Domain model, internal Event architecture or synchronization system.
