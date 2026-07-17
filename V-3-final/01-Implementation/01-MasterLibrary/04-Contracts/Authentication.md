
# Master Library Authentication Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Authentication

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Authentication Decision:** Pairing + Device Credential

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authentication, device registration and trust contracts of the Master Library Module.

It establishes:

* server identity verification;
* server trust establishment;
* administrator-controlled pairing;
* device registration;
* opaque device credentials;
* credential storage;
* credential hashing;
* bearer authentication;
* role assignment;
* credential revocation;
* device revocation;
* authentication failure behavior;
* credential rotation;
* recovery and re-pairing;
* security and privacy constraints.

The selected model is:

```text
Pairing
    ↓
Device registration
    ↓
Opaque device credential
    ↓
Bearer authentication
```

---

# 2. Scope

This document covers communication between:

* KnowledgeOS Server;
* macOS client;
* future iPhone and iPad clients;
* administrative CLI;
* future administrative client interfaces.

It defines authentication for:

* catalog browsing;
* publication details;
* publication acquisition;
* administrative publication management;
* device management;
* Library operations.

---

# 3. Explicit Exclusions

This contract does not define:

* username-and-password accounts;
* public user registration;
* OAuth providers;
* Apple Sign In;
* Google Sign In;
* external identity providers;
* mutual TLS client certificates;
* public internet authentication;
* CloudKit authentication;
* iCloud user identity;
* biometric authentication as server identity;
* annotation synchronization authentication.

Local biometric or device-unlock protection may guard Keychain access, but it is not part of server authentication.

---

# 4. Authentication Model

The approved authentication model is:

```text
Administrator creates Pairing Code
        ↓
Client verifies Server Identity
        ↓
Client submits Pairing Code
        ↓
Server registers Device
        ↓
Server creates Credential
        ↓
Server returns Opaque Credential once
        ↓
Client stores Credential in Keychain
        ↓
Client sends Bearer Credential
        ↓
Server verifies Credential Hash
        ↓
Server authorizes Device Role
```

---

# 5. Core Authentication Principle

> The server authenticates registered devices through revocable opaque credentials issued after explicit pairing.

Complementary principles:

* the endpoint is not the server identity;
* the credential is not the device identity;
* the credential value is never stored in clear text by the server;
* the credential is returned only during issuance or rotation;
* authorization remains server-controlled;
* trust validation precedes credential transmission.

---

# 6. Authentication Authorities

## 6.1 Server Authority

KnowledgeOS Server owns:

* ServerId;
* pairing-code creation;
* pairing-code validity;
* DeviceId registration;
* credential issuance;
* credential hash;
* credential state;
* assigned DeviceRole;
* credential revocation;
* device revocation;
* authentication decisions;
* authorization decisions.

## 6.2 Client Authority

The client owns:

* local server registration;
* trusted server fingerprint;
* local DeviceId reference;
* secure credential storage;
* authentication lifecycle state;
* explicit credential deletion;
* re-pairing initiation.

---

# 7. Trust Before Authentication

The client shall verify server trust before sending:

* PairingCode;
* OpaqueCredential;
* administrative secrets;
* protected requests.

The minimum trust context is:

```text
ServerEndpoint
ServerId
ServerFingerprint
```

The endpoint alone is insufficient.

---

# 8. Server Trust Bootstrap

Before pairing, the client retrieves a public server identity document.

Baseline endpoint:

```text
GET /v1/server
```

The response shall include:

* ServerId;
* server display name;
* server application version;
* supported API versions;
* advertised capabilities;
* server fingerprint descriptor;
* MasterLibraryId when initialized;
* production transport requirement.

---

# 9. Server Fingerprint

The initial server fingerprint shall use:

```text
SHA-256
```

over a stable, documented server trust artifact.

The selected trust artifact shall be either:

1. the server TLS public key;
2. or the complete server TLS certificate.

The implementation shall freeze one option.

The preferred baseline is:

```text
SHA-256 over SubjectPublicKeyInfo
```

This allows certificate renewal while preserving the same key identity where operationally appropriate.

---

# 10. Fingerprint Representation

The transport representation is:

```json
{
  "algorithm": "sha-256",
  "value": "aeb1c50e4f070769f12e9fd42b14e65d8f7e004d986f74ca15c94610127ad5fb"
}
```

Rules:

* lowercase hexadecimal;
* exactly 64 characters;
* no separators;
* no prefix;
* immutable during one trust decision.

The UI may display grouped characters for readability.

---

# 11. Trust Confirmation

The client shall present enough information for explicit trust confirmation:

* server display name;
* endpoint;
* ServerId;
* fingerprint;
* Master Library name where available;
* API compatibility status.

The user shall explicitly confirm trust before pairing.

---

# 12. Trusted Server Record

The client shall persist a local record conceptually equivalent to:

```text
TrustedServer
├── serverId
├── endpoint
├── fingerprint
├── masterLibraryId?
├── displayName
├── trustedAt
└── trustState
```

The credential shall not be stored in this ordinary record.

It shall remain in Keychain.

---

# 13. Identity Mismatch

When a registered endpoint presents a different:

* ServerId;
* server fingerprint;
* or incompatible MasterLibraryId context;

the client shall:

1. enter `IDENTITY_MISMATCH`;
2. block credential transmission;
3. stop automatic authentication;
4. preserve the old trust record;
5. display an explicit security warning;
6. require manual resolution.

Silent re-trust is prohibited.

---

# 14. Pairing Roles

The authentication model supports:

```text
READER
ADMINISTRATOR
```

A pairing operation shall assign exactly one initial role.

Role changes may be supported through an administrative contract.

---

# 15. Reader Device

A device with `READER` role may:

* inspect server information;
* inspect Master Library information;
* browse catalog;
* search catalog;
* inspect publication details;
* retrieve covers;
* acquire publication content.

It may not perform administrative mutations.

---

# 16. Administrator Device

A device with `ADMINISTRATOR` role may additionally:

* initialize the Master Library;
* register publications;
* update master metadata;
* replace publication sources;
* change availability;
* withdraw publications;
* validate Library integrity;
* manage device credentials where permitted.

---

# 17. Initial Administrator Bootstrap

The first Administrator credential shall not require an already authenticated Administrator.

The initial bootstrap shall use one of:

1. server-local CLI command;
2. server-local initialization secret;
3. NAS console action.

The approved baseline is:

```text
server-local CLI
```

Conceptual command:

```text
knowledgeos-server admin create-pairing-code
```

The initial bootstrap shall not be exposed as an unauthenticated general network endpoint.

---

# 18. Pairing Code

A PairingCode is a temporary secret authorizing one device registration.

It shall be:

* random;
* short-lived;
* single-use by default;
* role-scoped;
* generated by an Administrator or trusted local CLI;
* stored hashed by the server where practical;
* never written to ordinary logs;
* invalid after expiration;
* invalid after consumption.

---

# 19. Pairing Code Format

The user-facing pairing code should be easy to transcribe.

Recommended format:

```text
XXXX-XXXX-XXXX
```

where characters exclude visually ambiguous values where practical.

The transport value shall remain an opaque string.

The client shall not infer meaning from its characters.

---

# 20. Pairing Code Entropy

The code shall provide sufficient entropy for:

* short validity duration;
* bounded authentication attempts;
* LAN exposure;
* server-side rate limiting.

Human readability shall not reduce security below the approved threat model.

The exact entropy and alphabet shall be frozen during Security implementation.

---

# 21. Pairing Code Lifetime

The default validity period shall be:

```text
10 minutes
```

The value shall be configurable within safe bounds.

The server shall return the exact expiration timestamp when a pairing code is created.

---

# 22. Pairing Code Attempt Limits

The server shall bound failed attempts by:

* pairing code;
* endpoint source;
* global authentication policy.

Repeated failures shall trigger:

* delay;
* temporary blocking;
* security log;
* stable error response.

The server shall not reveal whether a partially guessed code is close to valid.

---

# 23. Pairing Code Creation Contract

Administrative endpoint direction:

```text
POST /v1/admin/devices/pairing-codes
```

Authentication:

```text
ADMINISTRATOR
```

The initial CLI bootstrap may invoke the same Application use case without HTTP.

---

# 24. Create Pairing Code Request

```json
{
  "role": "READER",
  "expiresInSeconds": 600
}
```

Fields:

```text
role                 required
expiresInSeconds     optional
```

The server shall enforce configured minimum and maximum lifetime.

---

# 25. Create Pairing Code Response

```json
{
  "pairingCode": "7KQX-M4PD-9RTA",
  "role": "READER",
  "createdAt": "2026-07-16T18:00:00Z",
  "expiresAt": "2026-07-16T18:10:00Z"
}
```

The PairingCode shall be returned only in this issuance response.

Administrative history shall not expose it later.

---

# 26. Pairing Code Sensitivity

The pairing response shall use:

```text
Cache-Control: no-store
```

The PairingCode shall not appear in:

* server access logs;
* audit message text;
* diagnostic bundles;
* analytics;
* error details;
* URL query parameters.

---

# 27. Device Registration Endpoint

Baseline endpoint:

```text
POST /v1/auth/pair
```

This endpoint does not require an existing Bearer credential.

It requires:

* trusted HTTPS connection;
* valid PairingCode;
* valid device registration request.

---

# 28. Pair Device Request

```json
{
  "pairingCode": "7KQX-M4PD-9RTA",
  "device": {
    "name": "Sebastián’s MacBook Pro",
    "type": "MAC",
    "platform": "macOS",
    "clientVersion": "1.0.0"
  }
}
```

Required fields:

* pairingCode;
* device.name;
* device.type;
* device.platform;
* device.clientVersion.

---

# 29. Device Name

Device name shall:

* be user-visible;
* have a maximum length;
* contain no credential material;
* contain no hardware serial requirement;
* be editable later through an authenticated contract where supported.

The server shall not treat DeviceName as identity.

---

# 30. Device Type

Supported initial values:

```text
MAC
IPHONE
IPAD
OTHER
```

This value supports administration and diagnostics.

It does not grant authorization.

---

# 31. Client Platform

Supported initial values:

```text
macOS
iOS
iPadOS
```

Unknown future platforms shall be handled according to compatibility policy.

---

# 32. Pairing Validation

The server shall validate:

1. HTTPS or approved test transport;
2. PairingCode syntax;
3. PairingCode hash;
4. PairingCode expiration;
5. PairingCode unused state;
6. attempt limits;
7. requested client compatibility;
8. required device metadata;
9. Master Library and server operational state.

---

# 33. Device Creation

After successful pairing validation, the server shall create:

```text
Device
├── DeviceId
├── name
├── type
├── platform
├── role
├── state
├── registeredAt
└── lastAuthenticatedAt?
```

Initial device state:

```text
ACTIVE
```

---

# 34. Credential Creation

The server shall create:

```text
DeviceCredential
├── CredentialId
├── DeviceId
├── CredentialHash
├── createdAt
├── lastUsedAt?
├── expiresAt?
├── revokedAt?
└── state
```

The raw OpaqueCredential shall not remain in server persistence.

---

# 35. Opaque Credential Generation

The OpaqueCredential shall be:

* generated with a cryptographically secure random source;
* high entropy;
* unguessable;
* independent for every device credential;
* non-semantic;
* URL/header safe;
* bounded in length.

The preferred raw entropy is at least:

```text
256 bits
```

---

# 36. Credential Wire Format

The credential may use a prefixed opaque format:

```text
kos_dc_<opaque-random-value>
```

The prefix may help:

* operational recognition;
* secret scanning;
* safe format validation.

The prefix shall not reveal DeviceId, role or server identity.

---

# 37. Credential Hashing

The server shall persist only a secure verifier.

The selected baseline is:

```text
SHA-256 or HMAC-SHA-256 over the high-entropy credential
```

Because the credential is randomly generated with high entropy, slow password hashing is not mandatory.

The preferred implementation is:

```text
HMAC-SHA-256 with a server-side credential pepper
```

Stored value:

```text
HMAC(serverPepper, opaqueCredential)
```

---

# 38. Credential Pepper

The server credential pepper shall:

* be generated securely;
* remain outside the database;
* remain outside source control;
* reside in mounted secrets;
* survive container replacement;
* be backed up securely;
* never be returned through APIs;
* never appear in logs.

Loss of the pepper invalidates credential verification and requires re-pairing unless a secure restore exists.

---

# 39. Credential Lookup Strategy

To avoid scanning all credential hashes, the credential wire value may contain:

```text
CredentialId + Secret
```

Conceptually:

```text
kos_dc_<credential-id>_<secret>
```

The server may:

1. extract and validate CredentialId;
2. load the credential record;
3. calculate the verifier from the complete canonical credential;
4. compare in constant time.

The exact format shall be frozen in implementation.

---

# 40. Pairing Response

Successful pairing shall return:

```json
{
  "device": {
    "deviceId": "a8492d7a-7700-48bf-a76d-48c5d61da76b",
    "name": "Sebastián’s MacBook Pro",
    "type": "MAC",
    "role": "READER",
    "registeredAt": "2026-07-16T18:02:00Z"
  },
  "credential": {
    "credentialId": "012b95d7-846a-41ad-8571-d3951bc6e60f",
    "value": "kos_dc_...",
    "createdAt": "2026-07-16T18:02:00Z"
  },
  "server": {
    "serverId": "70309fb9-1837-4a31-8518-926f9c9e957a"
  },
  "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832"
}
```

---

# 41. Credential Response Rules

The credential value shall:

* appear only in the successful issuance response;
* use `Cache-Control: no-store`;
* be omitted from later device-list responses;
* be hidden from logs;
* be stored immediately in client Keychain;
* be treated as unrecoverable from the server.

If the client loses it, a new credential shall be issued through re-pairing or rotation.

---

# 42. Pairing Success Status

Successful device pairing shall return:

```text
201 Created
```

The response may include a Device resource location.

---

# 43. Pairing Code Consumption

The PairingCode shall become consumed atomically with successful Device and Credential creation.

The server shall prevent:

* two devices consuming the same single-use code;
* credential creation without Device creation;
* Device creation without credential issuance evidence.

---

# 44. Pairing Transaction Boundary

The server database transaction shall include:

* PairingCode validation and consumption;
* Device creation;
* Credential record creation;
* role assignment;
* audit record.

The raw credential is generated before response but is not persisted.

---

# 45. Pairing Failure Before Commit

If pairing fails before transaction commit:

* PairingCode remains valid unless security policy consumes it;
* no Device remains;
* no credential record remains;
* no partial registration is exposed.

---

# 46. Pairing Response Failure After Commit

If server commit succeeds but the response is lost:

* the PairingCode is consumed;
* the Device and Credential record may exist;
* the client lacks the credential value;
* the credential shall be revoked or rotated;
* the user must repeat pairing with a new code.

The server cannot recover the original raw credential.

---

# 47. Client Credential Storage

Apple clients shall store the OpaqueCredential in:

```text
Keychain
```

The client database may store:

* ServerId;
* DeviceId;
* CredentialId;
* Keychain reference;
* credential state.

It shall not store the credential value.

---

# 48. Keychain Record Scope

The Keychain item shall be scoped to:

```text
ServerId
+
DeviceId
+
CredentialId
```

It shall remain isolated between different KnowledgeOS Servers.

---

# 49. Keychain Accessibility

The selected Keychain accessibility class shall support:

* ordinary app restart;
* offline local Library usage;
* secure authentication after device unlock;
* future Apple-platform compatibility.

The exact Apple accessibility option shall be frozen in Client Security implementation.

---

# 50. Authentication Header

Protected requests shall use:

```text
Authorization: Bearer <opaque-device-credential>
```

Example:

```text
Authorization: Bearer kos_dc_...
```

No other baseline authentication header is approved.

---

# 51. Credential Transmission

The credential shall only be transmitted when:

* HTTPS is active;
* ServerId matches trusted ServerId;
* fingerprint matches trusted fingerprint;
* MasterLibraryId context is compatible where applicable;
* client trust state is `TRUSTED`.

---

# 52. Bearer Authentication Flow

```text
Receive request
    ↓
Extract Authorization header
    ↓
Validate Bearer scheme
    ↓
Parse credential format
    ↓
Resolve CredentialId
    ↓
Load credential record
    ↓
Verify credential state
    ↓
Calculate credential verifier
    ↓
Constant-time comparison
    ↓
Load Device
    ↓
Verify Device state
    ↓
Load DeviceRole
    ↓
Create authenticated principal
```

---

# 53. Authenticated Principal

The server-side authenticated principal shall contain:

```text
AuthenticatedDevicePrincipal
├── deviceId
├── credentialId
├── role
├── deviceState
├── serverId
└── authenticationTime
```

It shall not expose the raw credential to application services.

---

# 54. Credential State

Credential states are:

```text
ACTIVE
REVOKED
ROTATED
EXPIRED
```

Initial state:

```text
ACTIVE
```

---

# 55. Device State

Device states are:

```text
ACTIVE
REVOKED
DISABLED
```

## ACTIVE

The device may authenticate using an active credential.

## REVOKED

The device registration is no longer trusted.

All associated credentials shall be rejected.

## DISABLED

Authentication is temporarily blocked without necessarily deleting device history.

---

# 56. Role Assignment

Each Device shall have at least one effective role.

Initial implementation uses exactly one role:

```text
READER
ADMINISTRATOR
```

Future multiple-role support requires contract evolution.

---

# 57. Authorization Evaluation

After authentication:

```text
Authenticated principal
    ↓
Required endpoint role
    ↓
Authorization policy
    ↓
Allow or deny
```

The client-visible role is advisory for UI behavior.

The server remains authoritative.

---

# 58. Reader Endpoint Authentication

Reader endpoints shall require an active credential except explicitly public bootstrap endpoints.

Protected Reader endpoints include:

```text
GET /v1/library
GET /v1/catalog
GET /v1/catalog/revision
GET /v1/publications/{publicationId}
GET /v1/publications/{publicationId}/cover
GET /v1/publications/{publicationId}/content
```

---

# 59. Public Bootstrap Endpoints

The following may be unauthenticated:

```text
GET /v1/server
GET /v1/health
POST /v1/auth/pair
```

Restrictions:

* `/v1/server` returns only safe identity and capability data;
* `/v1/health` returns bounded public health data;
* `/v1/auth/pair` requires valid PairingCode and rate limiting.

---

# 60. Administrative Endpoint Authentication

Every `/v1/admin` endpoint shall require:

```text
Authorization: Bearer <credential>
```

and effective role:

```text
ADMINISTRATOR
```

No administrative action shall rely solely on possession of a PairingCode.

---

# 61. Authentication Success Response

Ordinary protected requests do not require a separate authentication response.

Successful credential verification allows the requested resource operation.

A dedicated authentication-validation endpoint may be provided:

```text
POST /v1/auth/authenticate
```

but is not required for every request.

---

# 62. Session Model

The initial model shall not require a separate server session.

The OpaqueCredential itself is used as the Bearer credential.

Advantages:

* simple client behavior;
* immediate server-side revocation;
* no refresh-token pair;
* no JWT validation complexity;
* no server session expiry workflow.

---

# 63. Credential Expiration

The initial device credential may be non-expiring until:

* revoked;
* rotated;
* device removed;
* server security policy changes.

The server shall still track:

* createdAt;
* lastUsedAt;
* revokedAt;
* rotatedAt.

A future expiration policy may be added compatibly through credential metadata and rotation contracts.

---

# 64. Last-Used Tracking

The server may update:

```text
lastUsedAt
```

after successful authentication.

This update shall be:

* bounded;
* not performed synchronously for every high-frequency request if it creates unnecessary writes;
* safe to lose occasionally;
* excluded from CatalogRevision.

---

# 65. Authentication Audit

Authentication-related audit events include:

```text
PAIRING_CODE_CREATED
PAIRING_CODE_CONSUMED
PAIRING_FAILED
DEVICE_REGISTERED
AUTHENTICATION_SUCCEEDED
AUTHENTICATION_FAILED
CREDENTIAL_REVOKED
CREDENTIAL_ROTATED
DEVICE_REVOKED
ROLE_CHANGED
```

Audit records shall not contain secrets.

---

# 66. Failed Authentication Logging

Failed authentication logs may contain:

* timestamp;
* RequestId;
* endpoint;
* safe CredentialId where parsed;
* DeviceId where resolved;
* failure code;
* network source metadata according to privacy policy.

They shall not contain:

* raw credential;
* pairing code;
* credential verifier;
* pepper.

---

# 67. Authentication Error Envelope

Authentication failures use the standard error envelope.

Example:

```json
{
  "error": {
    "code": "INVALID_CREDENTIAL",
    "message": "The supplied credential is invalid.",
    "requestId": "779df775-9036-49be-8760-91845590b929",
    "retryable": false
  }
}
```

---

# 68. Authentication Error Codes

The public authentication codes include:

```text
AUTHENTICATION_REQUIRED
INVALID_AUTHORIZATION_HEADER
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
CREDENTIAL_EXPIRED
DEVICE_NOT_REGISTERED
DEVICE_REVOKED
DEVICE_DISABLED
PAIRING_CODE_INVALID
PAIRING_CODE_EXPIRED
PAIRING_CODE_CONSUMED
PAIRING_RATE_LIMITED
PAIRING_NOT_AVAILABLE
ADMINISTRATOR_REQUIRED
AUTHORIZATION_DENIED
SERVER_IDENTITY_MISMATCH
```

---

# 69. AUTHENTICATION_REQUIRED

Used when no valid authentication was supplied.

HTTP status:

```text
401 Unauthorized
```

Response header:

```text
WWW-Authenticate: Bearer
```

---

# 70. INVALID_AUTHORIZATION_HEADER

Used when the Authorization header:

* uses an unsupported scheme;
* is malformed;
* contains no credential;
* contains invalid credential syntax.

HTTP status:

```text
401 Unauthorized
```

---

# 71. INVALID_CREDENTIAL

Used when the credential cannot be verified.

HTTP status:

```text
401 Unauthorized
```

The server shall not reveal whether:

* CredentialId exists;
* secret portion was incorrect;
* verifier comparison failed.

---

# 72. CREDENTIAL_REVOKED

Used when the credential exists but is revoked.

HTTP status:

```text
401 Unauthorized
```

Retryability:

```text
false
```

Required client action:

```text
re-pair or use another valid credential
```

---

# 73. CREDENTIAL_EXPIRED

Used when credential expiration policy applies and the credential has expired.

HTTP status:

```text
401 Unauthorized
```

Required client action:

```text
rotate or re-pair
```

---

# 74. DEVICE_NOT_REGISTERED

Used when a resolved credential references no valid registered Device.

HTTP status:

```text
401 Unauthorized
```

This condition may also indicate persistence inconsistency.

---

# 75. DEVICE_REVOKED

Used when the Device registration has been revoked.

HTTP status:

```text
401 Unauthorized
```

The client shall delete or disable its local credential after confirmation.

---

# 76. DEVICE_DISABLED

Used when Device authentication is temporarily disabled.

HTTP status:

```text
403 Forbidden
```

or `401` according to final security policy.

The approved baseline is:

```text
403 Forbidden
```

because the credential identity was recognized but access is disabled.

---

# 77. PAIRING_CODE_INVALID

Used when the PairingCode is malformed or does not verify.

HTTP status:

```text
401 Unauthorized
```

or `400` for malformed syntax.

The public response should avoid providing code-existence information.

---

# 78. PAIRING_CODE_EXPIRED

Used when the code is validly formed but expired.

HTTP status:

```text
401 Unauthorized
```

Retryability:

```text
false
```

A new code is required.

---

# 79. PAIRING_CODE_CONSUMED

Used when a single-use code was already consumed.

HTTP status:

```text
409 Conflict
```

A new code is required.

---

# 80. PAIRING_RATE_LIMITED

Used when pairing attempts exceed policy.

HTTP status:

```text
429 Too Many Requests
```

The response should include:

```text
Retry-After
```

---

# 81. PAIRING_NOT_AVAILABLE

Used when pairing cannot currently execute because:

* server maintenance;
* Master Library initialization state;
* pairing subsystem unavailable;
* server security mode.

HTTP status:

```text
503 Service Unavailable
```

---

# 82. ADMINISTRATOR_REQUIRED

Used when an authenticated Reader attempts an Administrator endpoint.

HTTP status:

```text
403 Forbidden
```

---

# 83. AUTHORIZATION_DENIED

Used for a general authenticated authorization failure.

HTTP status:

```text
403 Forbidden
```

---

# 84. Authentication Retry Rules

Automatic retry is allowed for:

* temporary server unavailability;
* transient network failure;
* rate limit after approved delay.

Automatic retry is prohibited for:

* invalid credential;
* revoked credential;
* revoked device;
* server identity mismatch;
* PairingCode invalid;
* PairingCode expired;
* Administrator-required failure.

---

# 85. Constant-Time Comparison

Credential verifier comparison shall use a constant-time comparison function.

The server shall avoid:

* ordinary string equality for secret verifier comparison;
* early-exit comparison;
* different public errors for partial verification stages.

---

# 86. Credential Revocation Endpoint

Baseline administrative endpoint:

```text
POST /v1/admin/devices/{deviceId}/credentials/{credentialId}/revoke
```

Required role:

```text
ADMINISTRATOR
```

---

# 87. Revoke Credential Request

```json
{
  "reason": "DEVICE_REPLACED"
}
```

The reason is optional but recommended.

---

# 88. Revoke Credential Response

```json
{
  "credentialId": "012b95d7-846a-41ad-8571-d3951bc6e60f",
  "deviceId": "a8492d7a-7700-48bf-a76d-48c5d61da76b",
  "state": "REVOKED",
  "revokedAt": "2026-07-16T19:00:00Z"
}
```

The raw credential shall never appear.

---

# 89. Credential Revocation Semantics

Revocation shall:

* become effective immediately for new requests;
* preserve audit history;
* not delete Device identity;
* not delete local device publications;
* not modify CatalogRevision;
* not affect other device credentials.

---

# 90. Device Revocation Endpoint

Baseline administrative endpoint:

```text
POST /v1/admin/devices/{deviceId}/revoke
```

Required role:

```text
ADMINISTRATOR
```

---

# 91. Device Revocation Semantics

Revoking a Device shall:

* set Device state to `REVOKED`;
* revoke all active credentials of that Device;
* reject new authenticated requests;
* preserve device history;
* not remotely delete local publications;
* not affect other devices;
* not delete Master Catalog state.

---

# 92. Client Response to Revocation

When the client receives `CREDENTIAL_REVOKED` or `DEVICE_REVOKED`, it shall:

1. stop automatic credential retry;
2. mark authentication state `REVOKED`;
3. preserve local Library content;
4. disable protected remote operations;
5. offer re-pairing;
6. remove the Keychain credential after explicit policy or confirmed invalidation.

---

# 93. Credential Rotation

Credential rotation creates a new credential for the same Device.

Baseline endpoint direction:

```text
POST /v1/auth/credentials/rotate
```

Authentication:

```text
current active credential
```

Rotation may require Administrator policy for Administrator credentials.

---

# 94. Rotate Credential Request

```json
{
  "reason": "PERIODIC_ROTATION"
}
```

The body may be optional.

---

# 95. Rotate Credential Response

```json
{
  "credential": {
    "credentialId": "742bb050-f029-4b9e-9ba6-f2afff534837",
    "value": "kos_dc_...",
    "createdAt": "2026-07-16T20:00:00Z"
  },
  "previousCredential": {
    "credentialId": "012b95d7-846a-41ad-8571-d3951bc6e60f",
    "state": "ROTATED"
  }
}
```

The new value is returned once.

---

# 96. Rotation Commit Semantics

The server shall:

1. authenticate the current credential;
2. generate the new credential;
3. persist the new verifier;
4. mark the previous credential rotated or pending revocation;
5. commit transaction;
6. return the new raw credential once.

---

# 97. Rotation Grace Period

The baseline shall use:

```text
no grace period
```

after successful rotation commit.

The previous credential becomes invalid immediately.

A future bounded grace period requires explicit security review.

---

# 98. Client Rotation Commit

The client shall:

1. receive the new credential;
2. store it in Keychain;
3. verify successful Keychain persistence;
4. update local CredentialId reference;
5. delete the old Keychain credential;
6. authenticate a subsequent request.

If Keychain storage fails, the client shall report a recovery-required authentication state.

---

# 99. Lost Credential

If the client loses or cannot read its credential:

* the server cannot recover it;
* local publications remain available;
* remote protected operations stop;
* the device must re-pair or use an approved credential-recovery process;
* the old credential should be revoked administratively.

---

# 100. Re-Pairing

Re-pairing creates:

* a new credential;
* optionally a new DeviceId;
* or a new credential under an existing Device identity.

The baseline behavior is:

```text
new Device registration
```

unless an authenticated or administrator-controlled device-recovery contract explicitly binds the new credential to the existing DeviceId.

This avoids unauthorized takeover of an existing Device identity.

---

# 101. Removing Server Registration Locally

When the user removes a server registration from the client:

* the local credential shall be deleted from Keychain;
* trusted server metadata may be deleted;
* cached catalog may be deleted or retained according to user choice;
* local publications shall not be deleted automatically;
* the server credential remains active until revoked remotely.

The UI shall explain this distinction.

---

# 102. Client Unpair Contract

An authenticated client may request credential revocation before removing local registration.

Endpoint direction:

```text
POST /v1/auth/revoke
```

The active credential identifies the credential to revoke.

---

# 103. Client Unpair Response

A successful self-revocation may return:

```text
204 No Content
```

Afterward, the client shall delete the credential from Keychain.

---

# 104. Failed Self-Revocation

If the server is offline during local unpairing:

* local credential deletion may still proceed;
* server credential may remain active;
* the user shall be informed;
* later administrative revocation may be required.

The client shall not claim remote revocation succeeded.

---

# 105. Device Listing Contract

Administrative endpoint:

```text
GET /v1/admin/devices
```

Required role:

```text
ADMINISTRATOR
```

It returns safe device and credential metadata without secrets.

---

# 106. Device List Item

```json
{
  "deviceId": "a8492d7a-7700-48bf-a76d-48c5d61da76b",
  "name": "Sebastián’s MacBook Pro",
  "type": "MAC",
  "platform": "macOS",
  "role": "READER",
  "state": "ACTIVE",
  "registeredAt": "2026-07-16T18:02:00Z",
  "lastAuthenticatedAt": "2026-07-16T18:45:00Z",
  "credentials": [
    {
      "credentialId": "012b95d7-846a-41ad-8571-d3951bc6e60f",
      "state": "ACTIVE",
      "createdAt": "2026-07-16T18:02:00Z",
      "lastUsedAt": "2026-07-16T18:45:00Z"
    }
  ]
}
```

No credential values or hashes are returned.

---

# 107. Role Change Contract

Administrative endpoint direction:

```text
PATCH /v1/admin/devices/{deviceId}
```

Request:

```json
{
  "role": "ADMINISTRATOR"
}
```

Role changes require:

* Administrator authentication;
* explicit validation;
* audit record;
* protection against removing the final Administrator where applicable.

---

# 108. Final Administrator Protection

The server should prevent revoking or demoting the last active Administrator unless:

* a server-local recovery mechanism exists;
* the action is explicitly confirmed through trusted local administration.

This avoids accidental administrative lockout.

---

# 109. Pairing Availability Capability

The server shall advertise:

```text
DEVICE_PAIRING
```

when pairing is supported by the current server version.

The server may additionally expose:

```text
pairingAvailable
```

as current operational state.

Capability support and current availability are distinct.

---

# 110. Authentication Compatibility

The server identity contract shall expose supported authentication methods.

Initial value:

```text
DEVICE_OPAQUE_CREDENTIAL
```

Future methods may be added as optional values.

The client shall reject a server that lacks the required method.

---

# 111. Authentication Method Enum

Initial public enum:

```text
DEVICE_OPAQUE_CREDENTIAL
```

Potential future values:

```text
DEVICE_CERTIFICATE
EXTERNAL_IDENTITY
```

They are not implemented in Module 1.

---

# 112. Public Server Authentication Descriptor

Example:

```json
{
  "methods": [
    "DEVICE_OPAQUE_CREDENTIAL"
  ],
  "pairingSupported": true,
  "pairingAvailable": true
}
```

This descriptor contains no secrets.

---

# 113. Credential Scope

The initial credential scope is:

```text
one ServerId
one DeviceId
one assigned DeviceRole
```

It shall not be valid across another ServerId.

It shall not be reused across unrelated KnowledgeOS installations.

---

# 114. Master Library Scope

The credential authenticates to the Server.

If the server exposes a different MasterLibraryId unexpectedly:

* authentication may still technically verify;
* the client shall block ordinary Library context use;
* trust and Library compatibility resolution is required.

Credential validity does not imply Master Library identity compatibility.

---

# 115. Credential and Personal State

Device credentials shall not authorize the server to receive:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes.

Authentication capability does not expand the Master Library privacy boundary.

---

# 116. Credential and Local Deletion

Revoking a credential or Device shall not:

* delete local publication payloads;
* delete client LocalLibraryItems automatically;
* delete personal state;
* modify another device.

Authentication affects remote server access only.

---

# 117. Request Correlation

Authentication and pairing responses shall include:

```text
X-Request-Id
```

Security events may also use:

```text
X-Correlation-Id
```

Raw credentials shall never be included in correlation values.

---

# 118. Response Cache Rules

The following responses shall use:

```text
Cache-Control: no-store
```

* pairing-code creation;
* pairing success;
* credential rotation;
* authentication failure with sensitive context;
* device-management mutations.

---

# 119. Security Headers

Authentication endpoints shall use:

* HTTPS;
* strict content types;
* bounded request bodies;
* no broad CORS;
* no framework-identifying response headers where practical;
* rate limiting;
* structured security logging.

---

# 120. Pairing Request Limits

The pairing request shall enforce limits for:

* PairingCode length;
* DeviceName length;
* platform string;
* client-version string;
* request body size;
* request frequency.

---

# 121. Credential Header Limits

The server shall reject credentials exceeding the approved maximum length before expensive processing.

It shall also reject:

* multiple Authorization headers;
* invalid Bearer syntax;
* unsupported authentication schemes.

---

# 122. Timing Attack Resistance

The server shall minimize externally observable differences between:

* unknown CredentialId;
* invalid secret;
* revoked credential;
* malformed credential.

Stable error codes may still distinguish revoked state after successful credential-record resolution according to the approved security policy.

Response timing shall not intentionally reveal secret-verification details.

---

# 123. Secret Redaction

The logging system shall redact fields and headers named:

```text
authorization
pairingCode
credential
credentialValue
secret
token
pepper
```

Redaction shall apply before log persistence.

---

# 124. Credential Exposure Response

If a credential is suspected exposed:

1. revoke it;
2. generate a new pairing code or rotate credential;
3. audit the event;
4. invalidate old authentication immediately;
5. preserve local publication state.

---

# 125. Server Backup Requirements

A valid server backup shall preserve:

* Device records;
* Credential records and verifiers;
* roles;
* credential states;
* credential pepper;
* server identity;
* TLS identity where required.

If the pepper or server trust identity is not restored, clients may require re-pairing.

---

# 126. Server Restore Trust

After restore:

* ServerId shall remain unchanged;
* trusted fingerprint should remain unchanged when the same key is restored;
* credential verifiers shall remain usable;
* DeviceId values shall remain unchanged;
* role assignments shall remain unchanged.

Changing these unexpectedly triggers client trust or authentication failure.

---

# 127. Authentication Testing Categories

Required tests include:

```text
server trust tests
pairing-code tests
device registration tests
credential-generation tests
credential-hash tests
Bearer parsing tests
authentication tests
authorization tests
revocation tests
rotation tests
Keychain tests
rate-limit tests
logging-redaction tests
restore tests
```

---

# 128. Server Trust Tests

Tests shall verify:

* valid identity retrieval;
* fingerprint consistency;
* endpoint change with same ServerId;
* fingerprint mismatch detection;
* ServerId mismatch detection;
* credentials blocked before trust;
* no silent trust replacement.

---

# 129. Pairing Tests

Tests shall verify:

* valid code succeeds;
* expired code fails;
* consumed code fails;
* invalid code fails;
* concurrent consumption creates one Device only;
* role assignment matches code;
* response contains credential once;
* pairing code is absent from logs;
* failed response after commit requires re-pairing.

---

# 130. Credential Tests

Tests shall verify:

* high-entropy generation;
* server stores no raw credential;
* correct credential authenticates;
* wrong secret fails;
* unknown CredentialId fails;
* comparison is constant-time capable;
* credential scoped to one server;
* credential value absent from device listing;
* credential redacted from logs.

---

# 131. Authorization Tests

Tests shall verify:

* Reader accesses Reader endpoint;
* Reader cannot access Administrator endpoint;
* Administrator accesses Administrator endpoint;
* revoked Device is denied;
* disabled Device is denied;
* role change takes effect;
* final Administrator protection works.

---

# 132. Revocation Tests

Tests shall verify:

* credential revocation is immediate;
* Device revocation revokes all credentials;
* another Device remains unaffected;
* local client publication state remains unaffected;
* revoked credential cannot rotate itself;
* audit record exists.

---

# 133. Rotation Tests

Tests shall verify:

* active credential can rotate;
* new credential authenticates;
* old credential fails;
* new value returned once;
* server stores only verifier;
* Keychain failure produces client recovery state;
* repeated rotation request is idempotency-safe where supported.

---

# 134. Client Keychain Tests

Tests shall verify:

* credential saved securely;
* credential retrieved correctly;
* credential isolated by ServerId;
* credential deleted on local removal;
* credential inaccessible fallback does not use plain text;
* Keychain failure does not leak credential;
* re-pair flow remains possible.

---

# 135. Contract Fixtures

Required fixtures:

```text
server-identity.json
pairing-code-created.json
pair-device-request.json
pair-device-success.json
invalid-pairing-error.json
device-list.json
credential-revoked.json
credential-rotated.json
reader-principal.json
administrator-principal.json
unknown-auth-method.json
```

Credential values in fixtures shall be synthetic and clearly non-production.

---

# 136. Authentication Completion Gate

This document is complete when:

```text
[ ] Authentication model is frozen
[ ] Server trust bootstrap is explicit
[ ] Server fingerprint is explicit
[ ] Pairing code is explicit
[ ] Pairing-code lifetime is explicit
[ ] Device registration is explicit
[ ] Device identity is explicit
[ ] Credential generation is explicit
[ ] Credential wire format direction is explicit
[ ] Credential hashing is explicit
[ ] Credential pepper is explicit
[ ] Client Keychain storage is explicit
[ ] Bearer authentication is explicit
[ ] Authenticated principal is explicit
[ ] Device roles are explicit
[ ] Reader authorization is explicit
[ ] Administrator authorization is explicit
[ ] Initial Administrator bootstrap is explicit
[ ] Credential revocation is explicit
[ ] Device revocation is explicit
[ ] Credential rotation is explicit
[ ] Lost-credential behavior is explicit
[ ] Re-pairing is explicit
[ ] Error codes are explicit
[ ] Rate limits are explicit
[ ] Audit behavior is explicit
[ ] Backup and restore behavior is explicit
[ ] Testing obligations are explicit
[ ] Personal-state boundary is preserved
[ ] Local Library independence is preserved
[ ] No architectural contradiction remains
```

---

# 137. Authentication Invariants

The following invariants apply:

* ServerEndpoint is not ServerId.
* Trust validation precedes credential transmission.
* Pairing requires explicit authorization.
* PairingCode is temporary.
* PairingCode is single-use by default.
* DeviceId is stable.
* Credential is device-specific.
* Credential is server-specific.
* Raw credential is returned only at issuance or rotation.
* Raw credential is never stored by the server.
* Client stores credential only in Keychain.
* Server stores a secure credential verifier.
* Credential comparison is constant-time.
* Revocation is server authoritative.
* Authorization is enforced server-side.
* Reader and Administrator are distinct.
* Credential revocation does not delete local content.
* Device revocation does not delete local content.
* Authentication does not permit personal-state upload.
* Identity mismatch blocks authentication.
* Secrets never enter logs or public errors.

---

# 138. Prohibited Authentication Designs

The module shall not:

* trust devices by IP address;
* trust devices by hostname;
* use permanent pairing codes;
* store PairingCode in logs;
* store raw credentials in the server database;
* store client credentials in plain-text preferences;
* send credentials over production HTTP;
* embed credentials in URLs;
* use DeviceName as identity;
* use DeviceType as authorization;
* allow Reader credentials to perform administration;
* silently replace server trust;
* recover raw credentials from the server;
* use the same credential for several devices;
* expose credential hashes through APIs;
* delete local publications after revocation;
* upload personal state because authentication succeeded;
* implement public username/password accounts in this module;
* require OAuth or an external identity provider.

---

# 139. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `ErrorContracts.md`
* `ServerContracts.md`
* `AdministrationContracts.md`
* `Versioning.md`
* `Compatibility.md`

## Domain

* `../03-Domain/Entities.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`
* `../03-Domain/Errors.md`

## Technical Design

* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 140. Status

**Approved**

The Master Library authentication model is frozen as:

```text
Pairing Code
    ↓
Registered Device
    ↓
Opaque Device Credential
    ↓
Keychain on client
    ↓
Hashed verifier on server
    ↓
Bearer authentication
    ↓
Server-enforced role authorization
```

The next document is:

```text
01-MasterLibrary/04-Contracts/ErrorContracts.md
```

It shall define the complete public error registry, HTTP mappings, safe error-detail schemas, retryability and client error behavior.
