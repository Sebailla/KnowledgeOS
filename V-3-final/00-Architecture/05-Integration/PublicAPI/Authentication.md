
# Public API Authentication

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Public API

**Document:** Authentication

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authentication architecture governing Public API access in KnowledgeOS.

Authentication establishes the identity of a user, device, application, extension or external system before protected Platform capabilities may be accessed.

Authentication answers:

> Who or what is making this request?

Authentication does not answer:

> What is this principal allowed to do?

Authorization remains a separate architectural responsibility.

---

# 2. Scope

This document governs:

* Principal Identity;
* Credential types;
* authentication methods;
* authentication flows;
* authenticated Sessions;
* Tokens;
* device authentication;
* application authentication;
* extension authentication;
* service authentication;
* local authentication;
* remote authentication;
* multi-factor authentication;
* authentication assurance;
* credential lifecycle;
* Session lifecycle;
* token lifecycle;
* revocation;
* rotation;
* authentication errors;
* observability;
* auditability.

This document does not govern:

* authorization policy;
* permission evaluation;
* role design;
* Platform business logic;
* user-interface implementation;
* external identity-provider internals;
* secret-storage implementation;
* transport-specific authentication syntax;
* OAuth protocol details beyond architectural integration.

---

# 3. Definition of Authentication

Authentication is the process of establishing and validating a Principal Identity through one or more accepted credentials or trust mechanisms.

Authentication may establish the identity of:

* a Human User;
* a Device;
* an Application;
* an Extension;
* a Provider;
* an External Service;
* an Automation;
* a System Process.

Authentication produces an authenticated identity context.

It never grants Platform capabilities by itself.

---

# 4. Architectural Position

Authentication belongs to the Integration security boundary.

```text
External Principal
        │
        ▼
Credential Presentation
        │
        ▼
Authentication
        │
        ▼
Authenticated Principal
        │
        ▼
Authorization
        │
        ▼
Public API Operation
```

Protected Public API operations shall not execute before authentication and authorization requirements are satisfied.

---

# 5. Core Principle

Authentication and authorization are separate.

```text
Authentication
    │
    └── Establishes identity.

Authorization
    │
    └── Evaluates permitted actions.
```

A successfully authenticated Principal may still be unauthorized for every protected operation.

Authentication success shall never be interpreted as unrestricted access.

---

# 6. Mission

The mission of the Authentication Architecture is to establish trustworthy Principal Identity while preserving:

* user ownership;
* offline-first operation;
* privacy;
* least privilege;
* credential isolation;
* revocability;
* auditability;
* interoperability;
* technology independence;
* replaceable identity providers.

---

# 7. Design Philosophy

Authentication shall be:

* explicit;
* verifiable;
* scoped;
* revocable;
* observable;
* replaceable;
* privacy-preserving;
* independent from Platform business logic.

KnowledgeOS shall support local-first authentication without requiring a remote identity service for core local operation.

---

# 8. Principal

A Principal is an entity that may be authenticated.

Typical Principal Types include:

* User Principal;
* Device Principal;
* Application Principal;
* Extension Principal;
* Service Principal;
* Automation Principal;
* System Principal.

Principal Type shall be explicit.

---

# 9. Principal Identity

Every authenticated Principal shall have a stable Principal Identity.

Principal Identity shall remain independent from:

* display name;
* email address;
* username;
* device hostname;
* network address;
* Session;
* Token;
* credential;
* current Provider.

Mutable profile attributes shall never replace stable Principal Identity.

---

# 10. Human User Principal

A Human User Principal represents a person interacting with KnowledgeOS.

A user may authenticate through:

* local device authentication;
* password;
* passkey;
* external identity provider;
* biometric-assisted system authentication;
* recovery credential;
* multi-factor flow.

Authentication method shall not redefine user identity.

---

# 11. Device Principal

A Device Principal represents an authorized device installation.

Device identity may support:

* synchronization;
* trusted-device recognition;
* device-scoped credentials;
* device revocation;
* auditability;
* local API access.

Device identity shall remain distinct from User Identity.

---

# 12. Application Principal

An Application Principal represents an external client application accessing Public APIs.

Application identity may be established through:

* client credentials;
* signed assertions;
* certificates;
* registered application identity;
* delegated user authorization.

Application authentication shall not imply user identity unless explicit delegation exists.

---

# 13. Extension Principal

An Extension Principal represents a Plugin or Provider executing through approved extension mechanisms.

Extension authentication may use:

* package identity;
* runtime binding identity;
* signed package identity;
* execution-issued credential;
* scoped capability token.

Installation alone does not establish runtime authentication.

---

# 14. Service Principal

A Service Principal represents a non-human service interacting with KnowledgeOS.

Examples include:

* synchronization service;
* remote conversion service;
* enterprise integration;
* automation service;
* backup service.

Service Principals shall use non-human credentials.

Sharing human user credentials with services is prohibited.

---

# 15. System Principal

A System Principal represents trusted internal runtime execution.

System authentication shall remain explicit even when no external credential is presented.

Internal system identity shall not bypass authorization or audit requirements automatically.

---

# 16. Credential

A Credential is evidence used to establish Principal Identity.

Typical Credential Types include:

* Password;
* Passkey;
* Cryptographic Key;
* Certificate;
* Access Token;
* Refresh Token;
* Signed Assertion;
* API Key;
* OAuth Authorization Grant;
* Device Credential;
* Session Credential;
* Recovery Credential.

A credential is not a Principal.

---

# 17. Credential Ownership

Every credential shall be associated with:

* Principal Identity;
* Credential Identity;
* Credential Type;
* issuance context;
* validity period;
* scope where applicable;
* lifecycle status.

Credentials shall not be shared across unrelated Principals.

---

# 18. Credential Identity

Every managed credential shall have a stable Credential Identity.

Credential Identity supports:

* revocation;
* rotation;
* audit;
* compromise response;
* device management.

Secret credential material shall never be used as the public Credential Identity.

---

# 19. Credential Lifecycle

A credential may follow this lifecycle:

```text
Created
    │
    ▼
Active
    │
    ├─────────────┐
    ▼             ▼
Rotated       Suspended
    │             │
    └──────┬──────┘
           ▼
        Revoked
           │
           ▼
        Expired
```

Lifecycle transitions shall be explicit and observable.

---

# 20. Credential Issuance

Credential issuance shall require an authenticated or otherwise approved trust establishment process.

Issuance shall record:

* Credential Identity;
* Principal Identity;
* Credential Type;
* issuer;
* issue time;
* expiration where applicable;
* scope;
* assurance level;
* revocation metadata.

Credentials shall not be issued through undocumented flows.

---

# 21. Credential Rotation

Long-lived credentials shall support rotation where technically possible.

Rotation shall:

* issue replacement credentials;
* preserve Principal Identity;
* invalidate or retire superseded credentials according to policy;
* remain auditable;
* avoid unnecessary service interruption.

Rotation shall never silently broaden authority.

---

# 22. Credential Revocation

Credentials shall be revocable where technically possible.

Revocation may occur because of:

* user request;
* device loss;
* compromise;
* extension removal;
* employment or membership change;
* policy change;
* suspicious activity;
* credential replacement.

Revocation shall take effect according to explicit propagation guarantees.

---

# 23. Credential Expiration

Credentials may have finite validity.

Expiration shall be explicit.

Expired credentials shall never authenticate successfully.

Grace periods, when allowed, shall be policy-driven and auditable.

---

# 24. Secret Credentials

Secret credential values shall never be stored in:

* extension Manifests;
* canonical knowledge;
* logs;
* source code;
* Public API responses;
* unprotected configuration;
* error details.

Secret material shall use approved secure-storage mechanisms.

---

# 25. Password Authentication

Password authentication may be supported where required.

Password systems shall define:

* secure storage;
* rate limiting;
* retry limits;
* password-reset behavior;
* compromise detection;
* multi-factor integration;
* local versus remote validation.

KnowledgeOS shall not store plaintext passwords.

---

# 26. Passkeys

Passkeys may be supported for user authentication.

Passkeys provide phishing-resistant cryptographic authentication.

Passkey integration shall preserve:

* Principal Identity;
* credential revocation;
* device portability where supported;
* recovery semantics;
* provider independence.

---

# 27. Biometric Authentication

Biometric authentication may be used through approved operating-system authentication services.

KnowledgeOS shall not directly store raw biometric data.

Biometric success establishes local user presence according to the assurance provided by the operating system.

---

# 28. Device Authentication

Device authentication may use:

* device-bound key;
* certificate;
* secure enclave-backed credential;
* installation identity;
* pairing flow;
* signed challenge.

Device authentication shall remain independent from current user Session where required.

---

# 29. API Keys

API Keys may be supported for specific machine-to-machine integrations.

API Keys shall:

* have stable Credential Identity;
* be scoped;
* be revocable;
* be rotatable;
* be stored securely;
* never appear in logs;
* avoid unrestricted authority.

API Key use should be limited when stronger mechanisms are available.

---

# 30. Certificates

Certificate-based authentication may be used for:

* enterprise clients;
* device identity;
* service identity;
* mutual TLS;
* self-hosted integrations.

Certificate trust, expiration and revocation shall be explicit.

---

# 31. Signed Assertions

Signed assertions may establish Application or Service identity.

An assertion shall define:

* issuer;
* subject;
* audience;
* issue time;
* expiration;
* nonce where applicable;
* signature;
* assurance context.

Assertions with invalid audience or expired validity shall be rejected.

---

# 32. External Identity Providers

KnowledgeOS may integrate with external identity providers.

Examples include:

* OpenID Connect providers;
* enterprise identity systems;
* operating-system account systems;
* organizational identity providers.

External Provider identity shall be mapped to stable KnowledgeOS Principal Identity.

The external subject identifier shall not replace internal Principal Identity automatically.

---

# 33. Identity Linking

A Principal may link multiple authentication methods or external identities.

Linking shall require proof of control and authenticated confirmation.

Identity linking shall never occur solely because two providers expose the same email address or display name.

---

# 34. Identity Unlinking

Linked authentication methods may be removed according to policy.

Unlinking shall not leave a Principal without a valid recovery or authentication method unless explicitly allowed and confirmed.

---

# 35. Local Authentication

KnowledgeOS shall support local authentication for core offline-first operation where protection is required.

Local authentication may use:

* operating-system user presence;
* device credential;
* local password;
* passkey;
* secure local Session.

Local operation shall not require Internet connectivity merely to authenticate the current authorized user.

---

# 36. Remote Authentication

Remote Public API access shall use authentication appropriate to the exposure level and threat model.

Remote authentication shall require:

* secure transport;
* explicit credential validation;
* replay protection where required;
* audience validation;
* expiration;
* revocation support where practical.

---

# 37. Local API Authentication

Local API access shall not be considered automatically trusted merely because it originates from the same device.

Local clients may require:

* process identity;
* application registration;
* local capability token;
* user confirmation;
* operating-system authorization;
* socket permission;
* signed request.

Local transport is not equivalent to authenticated identity.

---

# 38. Delegated Authentication

An application may act on behalf of a user through explicit delegation.

Delegation shall identify:

* User Principal;
* Application Principal;
* granted scope;
* issue time;
* expiration;
* consent or policy basis.

The resulting authenticated context shall preserve both identities.

---

# 39. Impersonation

Administrative impersonation, if supported, shall be explicit, restricted and auditable.

An impersonated context shall identify:

* acting Principal;
* represented Principal;
* reason;
* scope;
* expiration.

Silent impersonation is prohibited.

---

# 40. Multi-Factor Authentication

Authentication may require multiple independent factors.

Typical factors include:

* knowledge;
* possession;
* inherence;
* trusted device;
* recovery factor.

Multi-factor policy may depend upon:

* operation sensitivity;
* remote access;
* administrative action;
* credential recovery;
* security posture.

---

# 41. Authentication Assurance

An authenticated context may include an Assurance Level.

Assurance may reflect:

* authentication method;
* number of factors;
* credential protection;
* device trust;
* recency;
* identity-provider assurance.

Authorization policy may require a minimum Assurance Level.

---

# 42. Step-Up Authentication

Sensitive operations may require Step-Up Authentication.

Examples include:

* exporting sensitive Libraries;
* granting Plugin permissions;
* viewing secrets;
* changing authentication methods;
* registering a new trusted device;
* administrative changes.

Step-Up Authentication strengthens the current Session for a limited scope or time.

---

# 43. Authentication Recency

Some operations may require recent authentication.

Authentication recency shall be explicit.

A long-lived Session may remain valid while a sensitive operation requires renewed user presence.

---

# 44. Session

A Session represents authenticated continuity across multiple interactions.

A Session may contain:

* Session Identity;
* Principal Identity;
* authentication time;
* Assurance Level;
* credential references;
* creation time;
* expiration;
* activity time;
* device context;
* delegated identity context;
* lifecycle status.

A Session is not a Principal.

---

# 45. Session Identity

Every Session shall have a stable Session Identity.

Session Identity shall be opaque externally.

It shall support:

* revocation;
* auditability;
* concurrent Session management;
* device association;
* anomaly detection.

---

# 46. Session Lifecycle

A Session may follow:

```text
Created
    │
    ▼
Active
    │
    ├───────────────┐
    ▼               ▼
Idle            Suspended
    │               │
    └───────┬───────┘
            ▼
         Revoked
            │
            ▼
         Expired
```

Session state shall be explicit.

---

# 47. Session Creation

A Session shall be created only after successful authentication.

Session creation shall record:

* Principal Identity;
* authentication method;
* Assurance Level;
* device or client context;
* Session expiration;
* security metadata.

Session creation does not grant permissions independently.

---

# 48. Session Expiration

Sessions may expire through:

* absolute lifetime;
* inactivity timeout;
* credential expiration;
* explicit revocation;
* security event;
* device revocation;
* policy change.

Expiration semantics shall be explicit.

---

# 49. Session Revocation

A Session may be revoked independently from the underlying credential.

Revocation may target:

* one Session;
* all Sessions for a device;
* all Sessions for a Principal;
* all Sessions created from a compromised credential.

Revocation shall be observable.

---

# 50. Concurrent Sessions

KnowledgeOS may support multiple concurrent Sessions per Principal.

Concurrent Session policy may consider:

* device count;
* client type;
* security posture;
* enterprise policy;
* user preference.

Each Session remains independently identifiable and revocable.

---

# 51. Session Fixation Protection

Authentication flows shall prevent Session fixation.

Authentication success shall not preserve an attacker-controlled unauthenticated Session identity.

Session identity shall be renewed when authentication state changes materially.

---

# 52. Session Binding

A Session may be bound to:

* device identity;
* application identity;
* client certificate;
* secure channel;
* operating-system context.

Binding reduces credential replay risk.

Binding requirements shall be explicit.

---

# 53. Token

A Token is a serialized credential or reference used to convey authenticated context.

Typical Tokens include:

* Access Token;
* Refresh Token;
* Identity Token;
* Capability Token;
* Session Token;
* Device Token.

Token type and purpose shall be explicit.

---

# 54. Access Token

An Access Token authorizes presentation of an authenticated Principal context to a protected API.

Access Tokens shall define:

* issuer;
* subject;
* audience;
* issue time;
* expiration;
* token identity;
* authentication context;
* optional scope claims.

Token claims shall not replace authoritative authorization evaluation unless explicitly designed.

---

# 55. Refresh Token

A Refresh Token may obtain new Access Tokens.

Refresh Tokens shall:

* have longer-lived protected storage;
* be revocable;
* be rotatable;
* be bound where practical;
* never be sent to resource APIs unnecessarily.

Refresh Tokens shall not be treated as ordinary Access Tokens.

---

# 56. Token Identity

Tokens should expose a stable token or credential identifier where revocation and audit require it.

The identifier shall not expose secret token material.

---

# 57. Token Lifetime

Token lifetime shall reflect:

* credential type;
* client type;
* risk;
* device trust;
* operation sensitivity;
* offline requirements.

Long-lived bearer tokens are discouraged.

---

# 58. Token Audience

Tokens shall be accepted only by their intended audience.

Audience validation prevents reuse across unrelated APIs or services.

Missing or invalid audience shall produce authentication failure.

---

# 59. Token Issuer

Token issuer shall be validated.

KnowledgeOS shall trust only approved issuers according to policy.

Self-declared issuer metadata is insufficient.

---

# 60. Token Subject

Token Subject identifies the authenticated Principal represented by the Token.

Subject mapping to internal Principal Identity shall be stable and explicit.

---

# 61. Token Replay

Bearer Tokens are vulnerable to replay if stolen.

Mitigations may include:

* short lifetime;
* secure transport;
* proof-of-possession;
* device binding;
* nonce;
* token rotation;
* revocation;
* anomaly detection.

The threat model shall guide selection.

---

# 62. Proof-of-Possession Tokens

Proof-of-possession mechanisms may bind token use to a cryptographic key or channel.

This reduces replay risk.

Support shall remain explicit and protocol-specific.

---

# 63. Token Rotation

Refresh Tokens or long-lived credentials may use rotation.

Rotation shall detect reuse of superseded tokens where supported.

Reuse may trigger:

* Token-family revocation;
* Session revocation;
* security alert;
* credential review.

---

# 64. Token Revocation

Tokens shall be revocable where policy requires it.

Revocation may use:

* revocation registry;
* short expiration;
* token-family state;
* Session state;
* credential state;
* issuer introspection.

Revocation guarantees shall be explicit.

---

# 65. Token Introspection

Opaque Tokens may require introspection.

Introspection may return:

* active state;
* Principal Identity;
* issuer;
* audience;
* expiration;
* authentication context;
* credential identity.

Introspection responses shall expose only required metadata.

---

# 66. Self-Contained Tokens

Self-contained Tokens may carry signed claims.

Validation shall include:

* signature;
* issuer;
* audience;
* expiration;
* not-before;
* algorithm policy;
* key validity;
* revocation policy where applicable.

Valid signature alone is insufficient.

---

# 67. Token Storage

Client-side token storage shall minimize exposure.

Storage policy depends upon client type.

Tokens shall not be stored in:

* canonical documents;
* unprotected local files;
* logs;
* URLs where avoidable;
* extension Manifests.

---

# 68. Authentication Challenge

Authentication flows may use challenges.

A challenge may include:

* nonce;
* expiration;
* intended Principal or client context;
* requested Assurance Level;
* supported authentication methods.

Challenges shall be single-use where required.

---

# 69. Replay Protection

Authentication requests vulnerable to replay shall use appropriate protections.

Examples include:

* nonce;
* timestamp;
* signed challenge;
* one-time code;
* state parameter;
* proof key;
* request signature.

Replay protection shall be validated before authentication success.

---

# 70. Authentication State

Multi-step authentication flows may maintain temporary authentication state.

Temporary state shall:

* have bounded lifetime;
* be integrity-protected;
* be scoped to the flow;
* avoid secret exposure;
* resist fixation;
* be invalidated after completion.

Temporary flow state is not an authenticated Session.

---

# 71. OAuth Integration

OAuth may be used for delegated authorization and external authentication flows.

KnowledgeOS shall distinguish:

* OAuth authorization;
* OpenID Connect authentication;
* Provider-specific identity;
* internal Principal Identity.

OAuth Access Tokens shall not automatically establish user authentication unless the applicable identity protocol and claims are validated.

---

# 72. OpenID Connect

OpenID Connect may establish external user identity.

Validation shall include:

* issuer;
* audience;
* signature;
* nonce;
* expiration;
* subject;
* authentication context where required.

External subject shall be mapped to an internal Principal.

---

# 73. Authorization Code Flow

Interactive remote clients should prefer secure authorization-code-based flows with proof-key protection where applicable.

Credentials shall not be exposed to unauthorized clients.

Transport and redirect validation shall be explicit.

---

# 74. Client Credentials Flow

Service-to-service clients may use client credentials where appropriate.

This authenticates an Application or Service Principal.

It does not represent a Human User unless separate delegation exists.

---

# 75. Device Authorization Flow

Devices with constrained input may use an approved device authorization flow.

The flow shall preserve:

* user verification;
* device binding;
* expiration;
* polling limits;
* cancellation;
* Principal mapping.

---

# 76. External Provider Failure

Failure of an external identity provider shall not automatically invalidate unrelated local authentication methods.

KnowledgeOS should preserve local access where policy permits.

External authentication dependency shall not compromise offline-first core operation.

---

# 77. Account Recovery

Authentication architecture shall define recovery mechanisms where credentials may be lost.

Recovery may use:

* recovery codes;
* trusted device;
* secondary credential;
* administrator-assisted recovery;
* external identity provider;
* cryptographic recovery key.

Recovery shall not silently weaken identity assurance.

---

# 78. Recovery Credential

Recovery Credentials shall be:

* limited-purpose;
* protected;
* revocable;
* auditable;
* rotated after use where appropriate.

Recovery credentials shall not grant unrestricted long-term access by default.

---

# 79. Credential Reset

Credential reset shall require a validated recovery or administrative process.

Reset shall:

* preserve Principal Identity;
* revoke compromised credentials where appropriate;
* revoke affected Sessions;
* record an audit event;
* trigger security notification where configured.

---

# 80. Device Loss

Device-loss response may include:

* Device Credential revocation;
* Session revocation;
* synchronization access revocation;
* remote token revocation;
* local data protection response;
* audit event.

Loss of one device shall not redefine User Identity.

---

# 81. Authentication Failure Model

Typical public authentication failures include:

* AuthenticationRequired;
* InvalidCredential;
* ExpiredCredential;
* RevokedCredential;
* InvalidToken;
* ExpiredToken;
* RevokedToken;
* InvalidIssuer;
* InvalidAudience;
* InvalidSignature;
* ReplayDetected;
* AuthenticationMethodUnsupported;
* AssuranceInsufficient;
* StepUpRequired;
* SessionExpired;
* SessionRevoked;
* DeviceUntrusted;
* ExternalIdentityProviderUnavailable;
* AuthenticationRateLimited;
* RecoveryRequired.

Internal authentication exceptions shall not cross the Public API boundary.

---

# 82. Authentication Failure Privacy

Authentication failures shall not reveal unnecessary identity information.

For example, responses should avoid confirming whether a specific user account exists when that would increase attack risk.

Detailed diagnostics may be available only through protected audit channels.

---

# 83. Rate Limiting

Authentication attempts shall be rate-limited according to risk.

Rate limiting may apply by:

* credential;
* Principal;
* client;
* device;
* network source;
* authentication method;
* risk signal.

Rate limiting shall avoid permanent denial through simple attacker-controlled exhaustion where possible.

---

# 84. Brute-Force Protection

Password and code-based methods shall include brute-force protection.

Protection may include:

* delays;
* temporary lockout;
* challenge escalation;
* risk-based controls;
* user notification;
* administrator review.

Lockout behavior shall be explicit and recoverable.

---

# 85. Risk-Based Authentication

KnowledgeOS may evaluate authentication risk using signals such as:

* new device;
* unusual location;
* impossible travel;
* repeated failure;
* compromised credential signal;
* unusual client;
* changed security posture.

Risk evaluation may require Step-Up Authentication or deny access.

---

# 86. Authentication Context

A successful authentication produces an Authentication Context.

The context may include:

* Principal Identity;
* Principal Type;
* Session Identity;
* authentication method;
* Assurance Level;
* authentication time;
* credential identity;
* device identity;
* application identity;
* delegated identity;
* correlation metadata.

The context shall be immutable for a given authenticated request.

---

# 87. Request Authentication

Every protected Public API request shall resolve an Authentication Context.

Resolution shall validate:

* credential;
* Session or token state;
* issuer;
* audience;
* expiration;
* revocation;
* binding;
* assurance requirements.

Invalid authentication shall stop processing before Platform execution.

---

# 88. Authentication Caching

Authentication validation results may be cached only when revocation, expiration and context boundaries remain correct.

Cache keys shall include relevant credential and policy identity.

Stale authentication state shall not authorize requests.

---

# 89. Authentication and Authorization Handoff

Authentication produces identity context.

Authorization consumes that context.

```text
Credential
    │
    ▼
Authentication
    │
    ▼
Authentication Context
    │
    ▼
Authorization
    │
    ▼
Decision
```

Authentication shall not embed final authorization decisions.

---

# 90. Authentication Observability

Authentication shall be observable.

Observable metadata may include:

* authentication method;
* Principal Type;
* success or failure;
* failure category;
* Assurance Level;
* Session creation;
* Token issuance;
* revocation;
* Step-Up requirement;
* duration;
* correlation identity.

Secret credential values shall never be logged.

---

# 91. Authentication Metrics

Metrics may include:

* authentication attempts;
* successful authentications;
* failed authentications;
* failure categories;
* Token refreshes;
* Session creations;
* Session revocations;
* credential rotations;
* Step-Up requests;
* recovery events;
* external identity-provider failures.

Metrics shall preserve privacy.

---

# 92. Authentication Audit

Security-sensitive authentication events shall be auditable.

Audit events may include:

* credential issued;
* credential revoked;
* credential rotated;
* authentication succeeded;
* authentication failed;
* new device registered;
* Session revoked;
* identity linked;
* identity unlinked;
* recovery completed;
* impersonation started;
* impersonation ended.

Audit records shall be immutable.

---

# 93. Authentication Commands

Typical authentication Commands include:

* AuthenticatePrincipal;
* CreateSession;
* RefreshSession;
* RevokeSession;
* RegisterCredential;
* RotateCredential;
* RevokeCredential;
* RegisterDevice;
* RevokeDevice;
* LinkIdentity;
* UnlinkIdentity;
* StartStepUpAuthentication;
* CompleteRecovery.

Commands modify authentication state only.

They do not grant Platform permissions directly.

---

# 94. Authentication Events

Typical authentication Events include:

* AuthenticationSucceeded;
* AuthenticationFailed;
* SessionCreated;
* SessionRefreshed;
* SessionRevoked;
* CredentialRegistered;
* CredentialRotated;
* CredentialRevoked;
* DeviceRegistered;
* DeviceRevoked;
* StepUpRequired;
* StepUpCompleted;
* IdentityLinked;
* IdentityUnlinked;
* RecoveryCompleted.

Events describe completed authentication facts.

---

# 95. Authentication Queries

Typical authentication Queries include:

* GetCurrentPrincipal;
* GetAuthenticationContext;
* ListActiveSessions;
* GetSession;
* ListCredentials;
* GetCredentialStatus;
* ListTrustedDevices;
* GetAuthenticationMethods;
* GetAssuranceLevel;
* CheckStepUpRequirement.

Queries never modify authentication state.

---

# 96. Authentication Invariants

The following invariants apply.

* Authentication establishes identity.
* Authentication never grants authority.
* Authorization remains a separate decision.
* Every authenticated entity has a stable Principal Identity.
* Principal Identity is distinct from display attributes.
* Credential Identity is distinct from secret credential material.
* Credentials are scoped, revocable and observable.
* Secret values never appear in Manifests, logs or canonical knowledge.
* Session Identity is distinct from Principal Identity.
* Token Identity is distinct from Session Identity.
* Application identity is distinct from User identity.
* Device identity is distinct from User identity.
* Delegation preserves both acting and represented identities.
* Installation does not authenticate an extension automatically.
* Local transport does not imply trusted identity.
* Local core operation does not require remote authentication by default.
* Authentication methods do not redefine Principal Identity.
* Expired or revoked credentials never authenticate successfully.
* Token issuer, audience and expiration are validated.
* Valid signature alone is insufficient for token acceptance.
* Authentication state is established before protected Platform execution.
* Authentication failure does not leak sensitive identity information.
* Step-Up Authentication is explicit.
* Recovery is auditable.
* Authentication execution remains observable.
* Secret credential material is never logged.

---

# 97. Prohibited Behaviors

Authentication mechanisms shall never:

* grant unrestricted Platform authority automatically;
* conflate authentication and authorization;
* use email address as permanent Principal Identity;
* store plaintext passwords;
* store secret credentials in extension Manifests;
* log passwords, Tokens or private keys;
* accept expired credentials;
* accept revoked credentials;
* skip issuer validation;
* skip audience validation;
* trust local clients merely because they run on the same device;
* silently link identities by matching display attributes;
* allow extensions to inherit user credentials directly;
* share human credentials with service clients;
* treat installation as authentication;
* issue unlimited long-lived bearer Tokens by default;
* expose authentication stack traces publicly;
* require Internet connectivity for basic local authentication without architectural necessity;
* allow silent impersonation;
* bypass audit for credential recovery or administrative impersonation.

---

# 98. Related Documents

* `APIConventions.md`
* `REST.md`
* `GraphQL.md`
* `LocalAPI.md`
* `Versioning.md`
* `../ExternalServices/OAuth.md`
* `../PluginSDK/Manifest.md`
* `../PluginSDK/Compatibility.md`
* `../Providers/ProviderModel.md`
* `../../04-Platform/Plugin/README.md`
* `../../03-Kernel/Configuration.md`
* `../../03-Kernel/Logging.md`
* `../../03-Kernel/Observability.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 99. Status

**Approved**

This document defines the authentication architecture governing KnowledgeOS Public APIs.

Authentication establishes the identity of users, devices, applications, extensions, services and system actors through explicit, verifiable and revocable credentials.

It produces an immutable Authentication Context consumed by authorization and Platform execution.

Authentication never grants authority by itself.

KnowledgeOS supports secure local and remote authentication while preserving offline-first operation, credential isolation, replaceable identity providers, privacy, revocation, observability and user control.
