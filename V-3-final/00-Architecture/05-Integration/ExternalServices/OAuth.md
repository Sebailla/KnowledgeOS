
# OAuth

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** External Services

**Document:** OAuth

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model governing OAuth-based delegated authorization between KnowledgeOS and external services.

OAuth enables KnowledgeOS to obtain limited authority to interact with external systems on behalf of a user or another authorized Principal.

OAuth is an authorization protocol boundary.

It shall not be confused with:

* KnowledgeOS user identity;
* KnowledgeOS application authentication;
* Domain authorization;
* Plugin permissions;
* Provider capabilities;
* MCP capabilities;
* operating-system credentials;
* Library access control;
* NAS authentication.

OAuth credentials represent delegated external authority.

They shall remain:

* isolated;
* scoped;
* revocable;
* securely stored;
* minimally exposed;
* independently lifecycle-managed.

---

# 2. Scope

This document governs:

* OAuth Client configuration;
* Authorization Code Flow;
* Proof Key for Code Exchange;
* redirect handling;
* authorization requests;
* authorization responses;
* Authorization Codes;
* Access Tokens;
* Refresh Tokens;
* token expiration;
* token refresh;
* scopes;
* consent;
* credential storage;
* credential isolation;
* token revocation;
* account disconnection;
* Provider integration;
* external service identity;
* OAuth state;
* nonce where applicable;
* callback validation;
* token exchange;
* token rotation;
* error handling;
* security;
* privacy;
* observability;
* offline behavior;
* Plugin interaction;
* MCP interaction;
* remote service integration.

This document does not define:

* KnowledgeOS internal authentication architecture;
* Domain authorization rules;
* operating-system login;
* NAS authentication;
* arbitrary secret management;
* concrete Provider-specific OAuth implementation;
* OpenID Connect identity semantics except where required for OAuth interoperability.

---

# 3. Architectural Position

OAuth belongs to the Integration layer.

```text
User
    │
    ▼
External Authorization Server
    │
    ▼
OAuth Integration Boundary
    │
    ▼
Credential Management
    │
    ▼
Provider Adapter
    │
    ▼
External Resource Server
```

OAuth shall not bypass the Integration layer.

---

# 4. Core Principle

OAuth grants delegated external authority.

It does not grant unrestricted authority inside KnowledgeOS.

The required separation is:

```text
External Authorization
        │
        ▼
OAuth Credential
        │
        ▼
Provider Capability
        │
        ▼
Approved Integration Operation
```

not:

```text
OAuth Credential
        │
        ▼
Unrestricted KnowledgeOS Authority
```

---

# 5. Mission

The mission of the OAuth architecture is to enable secure delegated access to external services while preserving:

* user control;
* least privilege;
* credential isolation;
* revocability;
* Provider independence;
* privacy;
* auditability;
* architectural boundaries.

---

# 6. Design Philosophy

OAuth Integration shall be:

* least-privilege;
* explicit;
* Provider-isolated;
* secure by default;
* revocable;
* observable;
* user-controlled;
* resistant to credential leakage;
* independent from Domain identity.

---

# 7. Identity Separation

KnowledgeOS distinguishes between:

* User Identity;
* KnowledgeOS Principal;
* External Account Identity;
* OAuth Client Identity;
* OAuth Authorization Grant;
* Provider Connection Identity.

These concepts shall not be conflated.

---

# 8. User Identity

User Identity identifies the person using KnowledgeOS.

It does not automatically identify an account in an external service.

---

# 9. KnowledgeOS Principal

A KnowledgeOS Principal represents an authenticated actor within the KnowledgeOS authorization model.

A Principal may be:

* a user;
* a local process;
* an approved service;
* another authorized actor.

OAuth does not replace this model.

---

# 10. External Account Identity

An External Account Identity identifies an account controlled by an external service.

Examples may include:

* a cloud storage account;
* an AI Provider account;
* a publishing service account;
* a remote repository account.

External Account Identity shall remain distinct from KnowledgeOS User Identity.

---

# 11. OAuth Client Identity

OAuth Client Identity identifies KnowledgeOS, or an approved KnowledgeOS component, to an Authorization Server.

OAuth Client Identity is not User Identity.

---

# 12. Authorization Grant

An Authorization Grant represents authority granted through an OAuth flow.

It may authorize access to:

* selected Resources;
* selected operations;
* selected scopes;
* a bounded external account.

---

# 13. Provider Connection

A Provider Connection represents KnowledgeOS configuration connecting an approved Provider to an external account or service.

A Provider Connection may reference OAuth credential material.

It shall not expose that material through its public contract.

---

# 14. OAuth Roles

The architecture distinguishes:

* Resource Owner;
* OAuth Client;
* Authorization Server;
* Resource Server.

KnowledgeOS commonly acts as the OAuth Client.

---

# 15. Resource Owner

The Resource Owner authorizes access to protected external Resources.

In many user-facing flows, the Resource Owner is the user.

---

# 16. OAuth Client

KnowledgeOS or an approved Provider integration may act as an OAuth Client.

OAuth Client behavior shall remain behind the Integration boundary.

---

# 17. Authorization Server

The Authorization Server:

* authenticates the external account;
* obtains authorization;
* issues authorization artifacts.

KnowledgeOS shall not assume that the Authorization Server is the same system as the Resource Server.

---

# 18. Resource Server

The Resource Server hosts protected external Resources.

Access is performed through an approved Provider adapter using delegated credentials.

---

# 19. OAuth Flow Selection

KnowledgeOS shall use OAuth flows appropriate to:

* client type;
* deployment model;
* platform;
* Provider support;
* security requirements.

For user-facing native applications, Authorization Code Flow with PKCE is the preferred model where supported.

---

# 20. Authorization Code Flow

The conceptual flow is:

```text
KnowledgeOS
    │
    ▼
Generate Authorization Request
    │
    ▼
Open Authorization Endpoint
    │
    ▼
User Authenticates Externally
    │
    ▼
User Grants Authorization
    │
    ▼
Authorization Code Returned
    │
    ▼
Validate Callback
    │
    ▼
Exchange Code
    │
    ▼
Receive Tokens
    │
    ▼
Secure Credential Storage
```

---

# 21. PKCE

Proof Key for Code Exchange shall be used where applicable.

PKCE protects the Authorization Code from unauthorized interception and reuse.

---

# 22. Code Verifier

The Code Verifier shall be:

* generated securely;
* unpredictable;
* bound to one authorization transaction;
* short-lived;
* protected until token exchange.

---

# 23. Code Challenge

The Code Challenge is derived from the Code Verifier according to the supported PKCE method.

Strong challenge methods shall be preferred.

---

# 24. Authorization Transaction

Every authorization attempt shall have a distinct Authorization Transaction Identity.

The transaction may track:

* Provider;
* requested scopes;
* state;
* PKCE context;
* redirect context;
* creation time;
* expiration.

---

# 25. Transaction Lifetime

Authorization transactions shall be short-lived.

Expired authorization transactions shall not be resumed silently.

---

# 26. State Parameter

The OAuth `state` value shall be:

* unpredictable;
* transaction-bound;
* validated on callback;
* single-use where practical.

State protects authorization-flow integrity.

---

# 27. State Validation

A callback with:

* missing state;
* unknown state;
* expired state;
* mismatched state;

shall fail safely.

---

# 28. Nonce

Where an OAuth-related protocol requires a nonce, it shall be:

* unpredictable;
* transaction-bound;
* validated;
* single-use where appropriate.

Nonce semantics shall not be conflated with OAuth state.

---

# 29. Redirect URI

Redirect URIs shall be explicitly registered and validated.

Dynamic unrestricted redirect destinations are prohibited.

---

# 30. Native Application Redirects

Native KnowledgeOS applications may use approved redirect mechanisms such as:

* claimed HTTPS redirects;
* application-specific URI schemes;
* loopback redirects where appropriate.

The mechanism shall be platform-specific and security-reviewed.

---

# 31. Redirect Validation

KnowledgeOS shall validate that the callback corresponds to an active authorization transaction.

A callback shall not be trusted solely because it reached the application.

---

# 32. Authorization Endpoint

Authorization requests shall be sent only to approved Authorization Server endpoints.

Endpoint configuration shall originate from:

* trusted Provider configuration;
* validated discovery metadata;
* explicit administrator or user configuration where allowed.

---

# 33. Endpoint Substitution

KnowledgeOS shall protect against malicious substitution of:

* Authorization Endpoint;
* Token Endpoint;
* Revocation Endpoint;
* Discovery Endpoint.

---

# 34. Authorization Request

An Authorization Request may include:

* Client Identity;
* redirect URI;
* requested scopes;
* state;
* PKCE challenge;
* Provider-defined approved parameters.

---

# 35. Scope Request

KnowledgeOS shall request the minimum scopes required for the intended capability.

Broad scopes shall not be requested for future convenience.

---

# 36. Incremental Authorization

Where supported, additional scopes should be requested only when additional capabilities are needed.

---

# 37. Scope Identity

Scopes are external Provider concepts.

They shall not become Domain authorization concepts.

---

# 38. Scope Mapping

A Provider adapter may map external scopes to KnowledgeOS Integration capabilities.

Example:

```text
External OAuth Scope
        │
        ▼
Provider Capability
        │
        ▼
Approved Integration Operation
```

The mapping shall be explicit.

---

# 39. Scope Does Not Grant Internal Authority

An external scope such as write access to a remote service does not grant the external service or credential write access to KnowledgeOS canonical state.

---

# 40. Consent

External authorization consent and KnowledgeOS internal consent are distinct.

The external Authorization Server may obtain consent for external Resource access.

KnowledgeOS may separately require consent for:

* data egress;
* external publication;
* destructive operations;
* persistent integration.

---

# 41. Authorization Code

An Authorization Code is:

* short-lived;
* single-use;
* transaction-bound.

It shall never be stored as a long-term credential.

---

# 42. Token Exchange

Authorization Codes shall be exchanged only with the approved Token Endpoint.

The exchange shall validate:

* transaction context;
* redirect URI where required;
* PKCE verifier;
* Provider identity.

---

# 43. Token Response

A token response may contain:

* Access Token;
* token type;
* expiration;
* Refresh Token;
* granted scopes;
* Provider-specific metadata.

All token material shall be treated as sensitive.

---

# 44. Access Token

An Access Token represents delegated authority to access an external Resource Server.

It shall be:

* treated as secret;
* scoped;
* short-lived where supported;
* inaccessible to ordinary application components.

---

# 45. Refresh Token

A Refresh Token may be used to obtain new Access Tokens.

Refresh Tokens are highly sensitive long-lived credentials.

They require stronger protection than ordinary operational metadata.

---

# 46. Token Type

The token type shall be respected according to Provider semantics.

KnowledgeOS shall not assume all Access Tokens are interchangeable bearer tokens.

---

# 47. Token Expiration

Token expiration shall be tracked explicitly.

Expired Access Tokens shall not be sent to external services intentionally.

---

# 48. Expiration Safety Margin

KnowledgeOS may apply a safety margin before token expiration to reduce failures caused by:

* clock differences;
* network latency;
* long-running requests.

---

# 49. Token Refresh

Token refresh shall occur only through the approved Provider OAuth implementation.

The general flow is:

```text
Access Token Near Expiration
        │
        ▼
Credential Manager
        │
        ▼
Refresh Coordination
        │
        ▼
Token Endpoint
        │
        ▼
New Credential Set
        │
        ▼
Atomic Credential Update
```

---

# 50. Refresh Coordination

Concurrent operations shall not cause uncontrolled simultaneous refresh attempts for the same credential set.

Refresh coordination may use:

* synchronization;
* single-flight execution;
* credential Version checks.

---

# 51. Refresh Token Rotation

Where a Provider rotates Refresh Tokens, the new token shall replace the old token atomically.

Failure to persist a rotated token may invalidate future access.

---

# 52. Token Rotation Invariant

When token rotation occurs:

```text
Old Refresh Token
        │
        ▼
Refresh
        │
        ▼
New Refresh Token
        │
        ▼
Secure Atomic Replacement
```

The old token shall not remain the active credential.

---

# 53. Refresh Failure

Refresh failure may indicate:

* temporary network failure;
* expired grant;
* revoked grant;
* invalid credential;
* Provider failure;
* changed authorization requirements.

These outcomes shall be distinguished where possible.

---

# 54. Reauthorization Required

If delegated authorization can no longer be refreshed, the Provider Connection may enter:

* ReauthorizationRequired.

KnowledgeOS shall not repeatedly retry permanent authorization failures.

---

# 55. Credential Set

A Credential Set may contain:

* Access Token;
* Refresh Token;
* token type;
* expiration;
* granted scopes;
* Provider metadata;
* credential Version.

The Credential Set is secure operational state.

It is not canonical knowledge.

---

# 56. Credential Identity

Credential material may have internal secure identity.

Credential Identity shall not reveal the secret value.

---

# 57. Credential Storage

OAuth credentials shall be stored using approved secure credential storage appropriate to the platform.

Possible mechanisms may include:

* operating-system secure credential stores;
* encrypted application credential stores;
* secure hardware-backed storage where available.

---

# 58. Credential Storage Abstraction

Provider implementations shall access credentials through an approved credential abstraction.

They shall not depend directly upon platform-specific secure storage implementation.

---

# 59. Credential Encryption

Credential material persisted outside a trusted secure credential facility shall be encrypted according to the security architecture.

---

# 60. Credential at Rest

OAuth credentials shall not be stored in plaintext in:

* Markdown files;
* Library metadata;
* Knowledge Objects;
* Plugin manifests;
* configuration repositories;
* logs;
* diagnostic exports.

---

# 61. Credential in Memory

Credential material shall remain in memory only as long as operationally necessary.

Long-lived unnecessary copies shall be avoided.

---

# 62. Credential Logging

OAuth tokens shall never be logged.

Logging shall redact:

* Access Tokens;
* Refresh Tokens;
* Authorization Codes;
* client secrets;
* sensitive Provider parameters.

---

# 63. Credential Serialization

General-purpose serialization shall not serialize secret credential material accidentally.

Credential contracts shall be explicitly separated from ordinary public contracts.

---

# 64. Credential Export

OAuth credentials shall not be included in:

* Library export;
* Knowledge export;
* Canonical Exchange packages;
* diagnostic packages by default;
* Plugin data export.

---

# 65. Credential Backup

Credential backup behavior shall be explicit.

The Library backup model shall not automatically imply OAuth credential backup.

---

# 66. NAS Isolation

OAuth credentials shall not be stored in the NAS Library merely because the NAS is the Library Source of Truth.

The NAS is the Source of Truth for Library knowledge.

It is not automatically the credential vault.

---

# 67. Domain Isolation

The Domain shall never receive raw OAuth tokens.

Domain logic may know:

* external connection identity;
* Provider capability availability;
* external Resource identity.

It shall not know credential values.

---

# 68. Kernel Isolation

The Kernel shall not expose OAuth credentials through:

* Command Bus;
* Query Bus;
* Event Bus;
* Job payloads;
* logs.

Jobs requiring external access shall reference a secure Provider Connection, not embed raw tokens.

---

# 69. Platform Isolation

Platform Engines shall request external operations through Provider contracts.

They shall not manage raw OAuth tokens directly unless the specific Integration component owns credential lifecycle.

---

# 70. Provider Boundary

The Provider adapter is the primary consumer of delegated OAuth authority.

```text
Platform Operation
        │
        ▼
Provider Contract
        │
        ▼
Provider Adapter
        │
        ▼
Credential Access
        │
        ▼
External Service
```

---

# 71. Provider Credential Access

A Provider shall receive only credentials required for its configured external service.

One Provider shall not access another Provider's credentials.

---

# 72. Provider Replacement

Replacing a Provider implementation shall not require exposing credentials to Domain or Platform internals.

---

# 73. Plugin Isolation

Plugins shall not receive OAuth tokens by default.

A Plugin requiring external authorization shall use:

* approved Provider integration;
* dedicated credential capability;
* explicit user authorization.

---

# 74. Plugin Credential Capability

A Plugin credential capability shall never mean unrestricted access to the credential vault.

It shall grant only approved external operations or narrowly scoped credential use.

---

# 75. MCP Isolation

MCP clients and servers shall not receive raw OAuth credentials.

MCP Tools requiring external services shall invoke approved Provider capabilities.

---

# 76. AI Isolation

AI models shall never receive:

* Access Tokens;
* Refresh Tokens;
* Authorization Codes;
* client secrets.

AI-generated requests shall pass through approved Provider operations.

---

# 77. Client Secret

Public native applications cannot safely preserve a globally distributed static client secret as a true secret.

Architecture shall not rely upon secrecy that the deployment model cannot provide.

---

# 78. Confidential Clients

Where KnowledgeOS operates through a trusted backend or confidential component, client secrets may be supported.

Such secrets shall remain isolated from public clients.

---

# 79. Client Configuration

OAuth Client configuration may include:

* Client Identity;
* Provider Identity;
* redirect URIs;
* supported flows;
* requested scopes;
* endpoint configuration.

Secret values shall remain separately protected.

---

# 80. Dynamic Client Registration

Dynamic client registration may be supported where required.

Registration shall be:

* explicit;
* validated;
* securely persisted;
* independently revocable.

---

# 81. Provider Discovery

OAuth Provider metadata may be discovered through approved discovery mechanisms.

Discovered metadata shall be validated before use.

---

# 82. Discovery Cache

Provider discovery metadata may be cached.

Cached metadata shall have:

* origin;
* freshness policy;
* invalidation policy.

---

# 83. Discovery Failure

Failure to refresh discovery metadata shall not silently replace trusted endpoints with unverified alternatives.

---

# 84. OpenID Connect

OpenID Connect may be used when external identity information is required.

OpenID Connect identity semantics remain distinct from OAuth delegated authorization.

---

# 85. ID Token

An ID Token, where used, represents identity assertions according to OpenID Connect.

It is not an Access Token.

It shall not be used as an API Access Token unless the external protocol explicitly defines such behavior.

---

# 86. External Identity Linking

External identity information may be linked to an External Account Identity.

It shall not automatically replace KnowledgeOS User Identity.

---

# 87. Account Connection

Connecting an external account is an explicit Integration operation.

The flow may be:

```text
User Requests Connection
        │
        ▼
OAuth Authorization
        │
        ▼
Credential Acquisition
        │
        ▼
External Account Verification
        │
        ▼
Provider Connection Created
```

---

# 88. Connection Identity

Every persistent external account connection shall have stable Connection Identity.

Connection Identity is distinct from:

* User Identity;
* Credential Identity;
* Provider Identity;
* External Account Identity.

---

# 89. Multiple Accounts

KnowledgeOS may support multiple accounts for the same external Provider.

Each account connection shall have independent:

* Connection Identity;
* credential set;
* scope set;
* lifecycle state.

---

# 90. Account Selection

Operations involving multiple external accounts shall select the intended Connection explicitly.

Implicit use of an arbitrary account is prohibited.

---

# 91. Connection State

Possible connection states may include:

* Connecting;
* Active;
* Expiring;
* ReauthorizationRequired;
* Revoked;
* Disabled;
* Failed;
* Disconnected.

---

# 92. Connection Health

Connection health is operational state.

It may reflect:

* credential validity;
* Provider availability;
* authorization status;
* compatibility.

---

# 93. Scope Evolution

An existing Connection may require additional scopes.

Additional authorization shall be explicit.

---

# 94. Scope Reduction

If granted scopes are reduced, KnowledgeOS shall update available Provider capabilities accordingly.

---

# 95. Granted Scope Verification

KnowledgeOS shall use the actual granted scopes where the Provider reports them.

Requested scopes and granted scopes may differ.

---

# 96. Capability Availability

Provider capabilities shall be derived from:

* Provider support;
* current granted scopes;
* Connection state;
* user policy.

---

# 97. Token Introspection

Token introspection may be used where supported and justified.

Introspection is an external operation and shall not be required unnecessarily for every request.

---

# 98. Revocation

OAuth authorization may be revoked through:

* Provider revocation endpoint;
* user action at the external Provider;
* credential expiration;
* administrative policy.

---

# 99. Local Revocation

KnowledgeOS may locally revoke a Connection by:

* disabling credential use;
* deleting local credential material;
* marking the Connection revoked or disconnected.

Local revocation does not necessarily revoke the grant at the external Provider.

---

# 100. Remote Revocation

Where supported, KnowledgeOS may request remote token revocation.

Remote revocation success shall be verified according to Provider semantics where possible.

---

# 101. Disconnect

Disconnecting an external account shall define whether KnowledgeOS:

* removes local credentials;
* requests remote revocation;
* preserves non-secret connection metadata;
* preserves previously imported canonical knowledge.

---

# 102. Disconnect Does Not Delete Knowledge

Disconnecting an external Provider shall not automatically delete canonical knowledge previously imported into KnowledgeOS.

Imported canonical knowledge and external connectivity are distinct.

---

# 103. Reconnect

A disconnected external account may be reconnected through a new authorization transaction.

Old invalid credentials shall not be silently reused.

---

# 104. Token Revocation Event

KnowledgeOS may detect revocation through:

* refresh failure;
* API response;
* Provider event;
* explicit user action.

Detection shall update Connection operational state.

---

# 105. Unauthorized External Response

An unauthorized response from a Resource Server may indicate:

* expired Access Token;
* revoked token;
* insufficient scope;
* invalid audience;
* Provider policy change.

The Provider adapter shall classify the response before deciding whether refresh is appropriate.

---

# 106. Refresh Before Retry

An external request may be retried after successful token refresh when:

* the operation is retry-safe;
* the authorization failure is consistent with token expiration.

State-changing operations require idempotency analysis.

---

# 107. Retry Safety

OAuth refresh does not make an external operation safe to retry automatically.

Retry safety depends upon the external operation semantics.

---

# 108. Token Audience

Where tokens have audience restrictions, KnowledgeOS shall respect them.

A token intended for one Resource Server shall not be sent to another.

---

# 109. Token Binding

Where a Provider supports token-binding mechanisms, the Provider integration may use them.

Binding semantics shall remain Provider-specific.

---

# 110. Sender-Constrained Tokens

Sender-constrained token mechanisms may improve security where supported.

Their use shall be isolated within the OAuth and Provider integration.

---

# 111. Security Model

OAuth Integration shall assume threats including:

* Authorization Code interception;
* CSRF;
* redirect URI manipulation;
* token theft;
* Refresh Token theft;
* malicious authorization endpoints;
* malicious callback injection;
* scope escalation;
* credential logging;
* confused-deputy attacks;
* token replay.

---

# 112. Authorization Code Interception

PKCE shall be used where applicable to reduce Authorization Code interception risk.

---

# 113. CSRF Protection

Authorization transactions shall use validated state or equivalent protocol protections.

---

# 114. Redirect Attack Protection

Redirect destinations shall be:

* registered;
* exact where required;
* validated;
* non-user-controlled.

---

# 115. Token Leakage Through URI

Tokens shall not be placed in URLs unless a specific external protocol requires it and the security implications are explicitly accepted.

---

# 116. Token Leakage Through Referrer

Authorization flows shall avoid architectures that expose sensitive tokens through browser referrer behavior.

---

# 117. Token Leakage Through Logs

HTTP clients, proxies and diagnostics shall redact authorization headers and token-bearing fields.

---

# 118. Credential Theft Response

Suspected credential compromise may require:

* local credential deletion;
* remote revocation;
* Connection disablement;
* user notification;
* audit record.

---

# 119. Scope Escalation Protection

A Provider shall not silently request broader scopes during token refresh.

New authority requires an appropriate authorization flow.

---

# 120. Confused Deputy Protection

KnowledgeOS shall not use its delegated external authority merely because an untrusted component requests an external operation.

The requesting Principal and Capability shall be authorized.

---

# 121. External Request Authorization

Before a Provider uses OAuth credentials, KnowledgeOS shall verify that the initiating operation is authorized internally.

External delegated authority does not replace internal authorization.

---

# 122. Data Egress

OAuth may authorize access to external services.

It does not automatically authorize sending arbitrary KnowledgeOS data to them.

Data egress remains separately governed.

---

# 123. Offline First

KnowledgeOS remains Offline First.

Loss of OAuth connectivity shall not prevent core local knowledge operations.

---

# 124. Offline Access

A Refresh Token may permit continued external authorization across sessions.

The OAuth concept of `offline_access`, where supported, is unrelated to KnowledgeOS Offline First architecture.

---

# 125. Terminology Separation

The following concepts shall remain distinct:

```text
OAuth Offline Access
        ≠
KnowledgeOS Offline First
```

---

# 126. Offline Provider Failure

While offline:

* external token refresh may fail;
* external API calls may fail;
* local canonical operations continue where possible.

---

# 127. Deferred External Operations

External operations may be deferred only when:

* user intent remains valid;
* authorization remains valid at execution time;
* operation is safe to delay;
* expiration is defined.

---

# 128. Credential Expiration During Deferral

A deferred operation shall resolve current valid credentials at execution time.

It shall not persist raw Access Tokens inside queued job payloads.

---

# 129. Job Integration

Background Jobs requiring external access shall reference:

* Provider Connection Identity;
* required Capability;
* operation contract.

They shall not embed OAuth tokens.

---

# 130. Workflow Integration

Long-running Workflows shall tolerate:

* token expiration;
* refresh;
* revocation;
* reauthorization requirements.

OAuth credential lifecycle shall remain external to Workflow business semantics.

---

# 131. Event Integration

OAuth lifecycle changes may produce operational events such as:

* OAuthConnectionEstablished;
* OAuthTokenRefreshed;
* OAuthReauthorizationRequired;
* OAuthConnectionRevoked;
* OAuthConnectionDisconnected.

Sensitive credential values shall never appear in events.

---

# 132. Webhook Integration

External Providers may use OAuth to authorize Webhook management.

Webhook credentials and OAuth credentials remain distinct unless the Provider explicitly defines otherwise.

---

# 133. MCP Integration

MCP integrations may use OAuth for external authorization.

MCP shall use the shared OAuth architecture rather than implement an independent token store.

---

# 134. Remote Execution

Remote execution Providers may use OAuth.

Remote execution requests shall access delegated authority through Provider Connections.

---

# 135. Public API Relationship

KnowledgeOS Public API authentication is distinct from OAuth credentials used to access external services.

An external Provider Access Token shall never authenticate a caller to the KnowledgeOS Public API unless an explicit federation architecture defines that behavior.

---

# 136. Credential Version

Credential Sets may have an internal Version.

Versioning supports:

* atomic replacement;
* refresh coordination;
* concurrency control.

Credential Version is not OAuth protocol Version.

---

# 137. Optimistic Credential Update

Credential updates may use Version checks to prevent an older refresh result from overwriting newer credentials.

---

# 138. Concurrent Refresh Example

The unsafe flow is:

```text
Refresh A ───────► Token Set A
Refresh B ───────► Token Set B

Late Write A overwrites B
```

The architecture shall prevent stale credential overwrite.

---

# 139. Atomic Credential Replacement

Credential replacement shall update logically related token data atomically where required.

---

# 140. Crash Recovery

Credential refresh shall account for crashes between:

* receiving new tokens;
* persisting new tokens;
* invalidating old tokens.

Providers using Refresh Token rotation require particular care.

---

# 141. Transactional Limitations

External token issuance and local credential persistence cannot generally participate in one distributed transaction.

Recovery design shall account for this limitation.

---

# 142. Credential Recovery

Where token rotation creates ambiguous local state, recovery may require:

* retry with known current credential;
* Provider-specific recovery;
* reauthorization.

The system shall not guess secret values.

---

# 143. Rate Limiting

OAuth endpoints may impose rate limits.

KnowledgeOS shall avoid:

* excessive refresh;
* repeated failed authorization requests;
* uncontrolled introspection.

---

# 144. Backoff

Transient OAuth endpoint failures may use bounded retry with backoff and jitter.

Permanent authorization failures shall not be retried indefinitely.

---

# 145. Circuit Breaking

Repeated Provider authorization infrastructure failure may temporarily degrade the Connection.

Circuit breaking shall not delete valid credentials automatically.

---

# 146. Clock Handling

Token expiration calculations shall account for clock uncertainty.

KnowledgeOS shall not depend upon exact synchronization with the Authorization Server.

---

# 147. Time Source

Security-sensitive expiration decisions should use a reliable local time source.

External timestamps remain untrusted unless validated by protocol semantics.

---

# 148. Error Model

OAuth errors shall be translated into stable Integration error categories.

---

# 149. Error Categories

Possible categories include:

* AuthorizationDenied;
* AuthorizationExpired;
* InvalidAuthorizationTransaction;
* InvalidState;
* InvalidRedirect;
* TokenExchangeFailed;
* TokenRefreshFailed;
* ReauthorizationRequired;
* InsufficientScope;
* CredentialUnavailable;
* ProviderUnavailable;
* ProviderRateLimited;
* RevocationFailed;
* ConfigurationInvalid.

---

# 150. User Denial

User denial of authorization is an expected outcome.

It shall not be treated as a system failure.

---

# 151. Error Disclosure

OAuth errors shall not expose:

* tokens;
* Authorization Codes;
* client secrets;
* sensitive Provider responses.

---

# 152. Observability

OAuth Integration shall be observable without exposing credentials.

Observable metadata may include:

* Provider Identity;
* Connection Identity;
* authorization flow state;
* requested scope categories;
* granted scope categories;
* token expiration category;
* refresh result;
* reauthorization state;
* failure category.

---

# 153. Logging

Logs may include:

* authorization transaction identity;
* Provider;
* operation stage;
* result;
* error category;
* duration.

Logs shall never include secret token values.

---

# 154. Metrics

OAuth metrics may include:

* authorization flows started;
* authorization flows completed;
* authorization flows denied;
* token exchanges failed;
* token refreshes completed;
* token refreshes failed;
* reauthorization requirements;
* active Connections;
* revoked Connections;
* Provider authorization failures.

---

# 155. Tracing

OAuth operations may participate in tracing.

A trace may represent:

```text
Authorization Request
        │
        ▼
Callback
        │
        ▼
Validation
        │
        ▼
Token Exchange
        │
        ▼
Credential Storage
```

Secret values shall never be attached to trace metadata.

---

# 156. Audit

Security-sensitive OAuth operations may produce audit records.

Examples include:

* external account connected;
* scopes expanded;
* credential revoked;
* account disconnected;
* credential compromise response.

---

# 157. OAuth Commands

Possible Integration commands include:

* StartOAuthAuthorization;
* CompleteOAuthAuthorization;
* RefreshOAuthCredential;
* RevokeOAuthConnection;
* DisconnectExternalAccount;
* ReauthorizeExternalAccount;
* DisableProviderConnection;
* EnableProviderConnection.

---

# 158. OAuth Queries

Possible queries include:

* GetOAuthConnection;
* ListOAuthConnections;
* GetOAuthConnectionStatus;
* GetGrantedScopes;
* GetAvailableProviderCapabilities;
* GetReauthorizationRequirement.

Queries shall never return raw credential secrets.

---

# 159. OAuth Events

Operational events may include:

* OAuthAuthorizationStarted;
* OAuthAuthorizationCompleted;
* OAuthAuthorizationDenied;
* OAuthConnectionEstablished;
* OAuthCredentialRefreshed;
* OAuthCredentialRefreshFailed;
* OAuthReauthorizationRequired;
* OAuthConnectionRevoked;
* OAuthConnectionDisconnected.

---

# 160. Event Payload Security

OAuth events shall contain only non-secret metadata.

Tokens and Authorization Codes are prohibited in event payloads.

---

# 161. Testing Requirements

OAuth Integration shall be tested through:

* authorization-flow tests;
* PKCE tests;
* state-validation tests;
* redirect-validation tests;
* token-exchange tests;
* refresh tests;
* token-rotation tests;
* concurrency tests;
* revocation tests;
* scope tests;
* credential-isolation tests;
* failure-recovery tests;
* security tests.

---

# 162. Authorization Flow Testing

Tests shall include:

* successful authorization;
* user denial;
* invalid state;
* expired transaction;
* callback replay;
* invalid redirect context;
* token exchange failure.

---

# 163. PKCE Testing

Tests shall verify:

* valid verifier;
* invalid verifier;
* missing verifier;
* reused transaction;
* expired transaction.

---

# 164. Refresh Testing

Refresh tests shall include:

* successful refresh;
* expired Refresh Token;
* revoked grant;
* transient Provider failure;
* rotated Refresh Token;
* concurrent refresh.

---

# 165. Concurrency Testing

Tests shall verify that concurrent refresh attempts do not:

* overwrite newer credentials;
* lose rotated Refresh Tokens;
* create uncontrolled Provider requests.

---

# 166. Credential Isolation Testing

Tests shall verify that credentials are absent from:

* logs;
* events;
* public APIs;
* Plugin contracts;
* MCP payloads;
* AI context;
* Library exports;
* diagnostic exports.

---

# 167. Revocation Testing

Tests shall distinguish:

* local disablement;
* local credential deletion;
* remote revocation;
* external Provider revocation.

---

# 168. Security Testing

Security tests shall include:

* callback injection;
* state mismatch;
* Authorization Code replay;
* redirect manipulation;
* token leakage;
* scope escalation;
* malicious endpoint configuration;
* credential access from unauthorized components.

---

# 169. Provider Contract Testing

Each OAuth-enabled Provider shall be tested against:

* supported flow;
* scope mapping;
* token refresh behavior;
* error translation;
* revocation behavior;
* account identity resolution.

---

# 170. OAuth Governance

OAuth integration is a security-sensitive architectural capability.

Changes affecting:

* credential storage;
* authorization flows;
* redirect handling;
* scope policy;
* token lifecycle;
* Provider trust;

require architectural and security review.

---

# 171. OAuth Invariants

The following invariants apply.

* OAuth belongs to the Integration layer.
* OAuth provides delegated external authorization.
* OAuth does not replace KnowledgeOS authentication.
* OAuth does not replace Domain authorization.
* User Identity and External Account Identity remain distinct.
* OAuth Client Identity and User Identity remain distinct.
* External scopes never become internal Domain permissions automatically.
* Authorization Code Flow with PKCE is preferred for native user-facing clients where supported.
* Authorization transactions are short-lived.
* State is validated.
* Redirect URIs are controlled.
* Authorization Codes are never long-term credentials.
* Access Tokens are secrets.
* Refresh Tokens are highly sensitive secrets.
* Raw credentials never enter the Domain.
* Raw credentials never enter ordinary Kernel messages.
* Raw credentials never enter Plugin contracts.
* Raw credentials never enter MCP payloads.
* Raw credentials never enter AI model context.
* Credentials are not stored in the Library.
* Credentials are not stored on the NAS merely because the NAS is the Library Source of Truth.
* Background Jobs reference Provider Connections rather than embedding tokens.
* Provider Connections and Credential Sets are distinct.
* Requested scopes and granted scopes may differ.
* Scope expansion requires appropriate authorization.
* Refresh does not grant new authority silently.
* Token refresh is coordinated.
* Rotated Refresh Tokens are replaced atomically where possible.
* OAuth token refresh does not make arbitrary external operations retry-safe.
* Disconnecting a Provider does not automatically delete imported canonical knowledge.
* OAuth Offline Access and KnowledgeOS Offline First are distinct concepts.
* Credential lifecycle is operational Integration state, not canonical knowledge.

---

# 172. Prohibited Behaviors

OAuth Integration shall never:

* treat OAuth as KnowledgeOS internal authentication automatically;
* treat an external account as the KnowledgeOS User Identity automatically;
* expose raw Access Tokens to the Domain;
* expose raw Refresh Tokens to Platform Engines;
* expose OAuth credentials to AI models;
* expose OAuth credentials to MCP peers;
* expose OAuth credentials to Plugins by default;
* store tokens in Markdown;
* store tokens in Knowledge Objects;
* store tokens in Library metadata;
* store tokens in ordinary configuration files;
* store tokens in Plugin manifests;
* store tokens in logs;
* store tokens in Event payloads;
* store tokens in Job payloads;
* export tokens in Canonical Exchange packages;
* rely on a static client secret being secret inside a publicly distributed native application;
* accept unvalidated callback state;
* accept arbitrary redirect destinations;
* send tokens to unapproved endpoints;
* request broad scopes without need;
* silently escalate scopes during refresh;
* use an ID Token as an Access Token without explicit protocol support;
* assume token expiration is the only reason for authorization failure;
* retry non-idempotent external operations blindly after refresh;
* allow concurrent refresh races to overwrite newer credentials;
* treat OAuth Offline Access as the KnowledgeOS Offline First model;
* make core local KnowledgeOS operation depend upon external OAuth availability.

---

# 173. Related Documents

* `EventIntegration.md`
* `MCP.md`
* `RemoteExecution.md`
* `Webhooks.md`
* `../Providers/ProviderModel.md`
* `../Providers/AIProviders.md`
* `../Providers/StorageProviders.md`
* `../Providers/SyncProviders.md`
* `../PublicAPI/Authentication.md`
* `../PublicAPI/APIConventions.md`
* `../PluginSDK/Capabilities.md`
* `../../04-Platform/AI/README.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Plugin/README.md`
* `../../04-Platform/Sync/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`
* `../../06-Execution/Concurrency/Idempotency.md`
* `../../06-Execution/Concurrency/RetryPolicies.md`
* `../../06-Execution/Runtime/ExecutionContext.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../01-Foundation/ArchitectureConstraints.md`

---

# 174. Status

**Approved**

This document defines the architectural model governing OAuth-based delegated authorization between KnowledgeOS and external services.

OAuth belongs to the Integration layer.

It grants limited external authority.

It does not define KnowledgeOS identity.

It does not define internal authentication.

It does not define Domain authorization.

External Account Identity, KnowledgeOS User Identity, OAuth Client Identity, Provider Connection Identity and Credential Identity remain distinct.

Authorization Code Flow with PKCE is the preferred authorization model for native user-facing applications where supported.

OAuth credentials are sensitive operational Integration state.

They remain isolated from the Domain, Kernel message payloads, Plugins, MCP peers, AI models and canonical Library storage.

The NAS remains the Source of Truth for Library knowledge.

It is not the OAuth credential vault.

Provider adapters consume delegated authority through controlled credential access.

Scopes remain minimal.

Credential refresh is coordinated.

Token rotation is handled safely.

Revocation is explicit.

Data egress remains separately authorized.

OAuth enables KnowledgeOS to interact with external services on behalf of the user without allowing external authorization mechanisms or secret credentials to become part of the canonical knowledge model or internal architecture.
