
# Master Library Server Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Server Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the public server and Master Library identity contracts used by KnowledgeOS clients.

It establishes:

* server discovery metadata;
* stable server identity;
* server trust metadata;
* server application version;
* supported API versions;
* supported authentication methods;
* server capabilities;
* Master Library identity;
* Master Library format version;
* CatalogRevision exposure;
* current operational availability;
* pairing availability;
* client registration behavior;
* server registration behavior;
* compatibility metadata;
* public bootstrap boundaries.

These contracts provide the information required before a client accesses the Master Catalog.

---

# 2. Scope

This document defines the contracts for:

```text
GET /v1/server
GET /v1/library
```

It also defines the public data models used by:

* server trust establishment;
* client server registration;
* compatibility evaluation;
* authentication preparation;
* catalog-cache isolation;
* Master Library identity verification;
* capability negotiation.

---

# 3. Explicit Exclusions

This document does not define:

* server health internals;
* detailed readiness checks;
* device pairing execution;
* credential issuance;
* catalog pagination;
* publication metadata;
* publication-content transfer;
* administrative initialization;
* NAS physical paths;
* local Library state;
* personal-state synchronization;
* CloudKit contracts.

Health details are defined in `HealthContracts.md`.

Authentication is defined in `Authentication.md`.

---

# 4. Core Identity Principle

> A KnowledgeOS Server is identified by ServerId, not by hostname, IP address, port, certificate serial number or NAS path.

The complementary principle is:

> A Master Library is identified by MasterLibraryId, not by server endpoint, storage root or catalog database path.

---

# 5. Server Identity and Endpoint

The following values are distinct:

```text
ServerId
ServerEndpoint
ServerFingerprint
```

## ServerId

Stable logical server identity.

## ServerEndpoint

Current network location.

## ServerFingerprint

Cryptographic trust evidence.

A change in endpoint does not necessarily mean a new server.

A change in ServerId indicates a different logical server.

A change in fingerprint requires explicit trust evaluation.

---

# 6. Master Library Identity and Server Identity

The following values are also distinct:

```text
ServerId
MasterLibraryId
```

One server instance exposes one active Master Library in Module 1.

A future server may expose more than one Library only through an explicit architecture change.

---

# 7. Public Server Endpoint

The public bootstrap endpoint is:

```text
GET /v1/server
```

This endpoint may be accessed without a Bearer credential.

It shall expose only safe bootstrap information.

---

# 8. Public Server Endpoint Purpose

`GET /v1/server` allows a client to:

1. identify the server;
2. inspect the server fingerprint;
3. inspect supported API versions;
4. inspect supported authentication methods;
5. inspect advertised capabilities;
6. inspect Master Library identity when initialized;
7. evaluate compatibility;
8. decide whether pairing can begin.

---

# 9. Public Server Response

Baseline response:

```json
{
  "server": {
    "serverId": "70309fb9-1837-4a31-8518-926f9c9e957a",
    "displayName": "KnowledgeOS Home Server",
    "serverVersion": "1.0.0",
    "supportedApiVersions": [
      "v1"
    ],
    "authentication": {
      "methods": [
        "DEVICE_OPAQUE_CREDENTIAL"
      ],
      "pairingSupported": true,
      "pairingAvailable": true
    },
    "fingerprint": {
      "algorithm": "sha-256",
      "value": "aeb1c50e4f070769f12e9fd42b14e65d8f7e004d986f74ca15c94610127ad5fb"
    },
    "capabilities": [
      "CATALOG_BROWSE",
      "CATALOG_SEARCH",
      "PUBLICATION_DETAILS",
      "PUBLICATION_DOWNLOAD",
      "SINGLE_RANGE_DOWNLOAD",
      "DEVICE_PAIRING"
    ]
  },
  "library": {
    "initialized": true,
    "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
    "name": "Biblioteca Maestra",
    "formatVersion": "1.0",
    "catalogRevision": 42,
    "state": "AVAILABLE"
  },
  "compatibility": {
    "minimumClientVersion": "1.0.0"
  },
  "serverTime": "2026-07-16T18:30:00Z"
}
```

---

# 10. Top-Level Response Shape

The response shall contain:

```text
server
library
compatibility
serverTime
```

The `library` object may represent an uninitialized Library.

---

# 11. ServerDescriptor

The `server` object is the public ServerDescriptor.

Required fields:

```text
serverId
displayName
serverVersion
supportedApiVersions
authentication
fingerprint
capabilities
```

---

# 12. ServerId Contract

Schema:

```yaml
type: string
format: uuid
pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
```

Rules:

* generated once;
* persisted outside disposable container state;
* stable across restart;
* stable across endpoint changes;
* stable across ordinary upgrades;
* preserved by backup and restore;
* not derived from hardware serial number;
* not derived from IP address.

---

# 13. ServerId Creation

ServerId shall be created during first server initialization.

It shall exist even if the Master Library has not yet been initialized.

This allows:

* trust establishment;
* administrative bootstrap;
* server registration;
* Library initialization against a known server identity.

---

# 14. ServerId Persistence

ServerId shall reside in persistent server configuration or identity storage.

Deleting or recreating the container shall not change it.

Unexpected ServerId change shall be treated by clients as a new server.

---

# 15. Display Name

`displayName` is a user-visible server name.

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 256
```

Examples:

```text
KnowledgeOS Home Server
KnowledgeOS NAS
Biblioteca de Sebastián
```

It is mutable.

It is not identity.

---

# 16. Display Name Mutation

Changing the server display name shall not change:

* ServerId;
* fingerprint;
* credentials;
* MasterLibraryId;
* CatalogRevision.

---

# 17. ServerVersion

`serverVersion` represents the KnowledgeOS Server application version.

Example:

```json
{
  "serverVersion": "1.0.0"
}
```

It shall follow the approved semantic-version-compatible format.

---

# 18. ServerVersion Semantics

ServerVersion supports:

* diagnostics;
* compatibility evaluation;
* administrative visibility;
* upgrade guidance.

Clients shall not infer capabilities only from ServerVersion.

Capabilities remain explicit.

---

# 19. SupportedApiVersions

The server shall expose:

```json
{
  "supportedApiVersions": [
    "v1"
  ]
}
```

Rules:

* values are unique;
* values are ordered from preferred to older supported version where relevant;
* current endpoint version shall appear;
* unsupported versions shall not be advertised.

---

# 20. AuthenticationDescriptor

The public authentication descriptor contains:

```text
methods
pairingSupported
pairingAvailable
```

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

---

# 21. Authentication Methods

Initial supported method:

```text
DEVICE_OPAQUE_CREDENTIAL
```

Potential future values are not implemented in Module 1.

Unknown methods shall be handled through compatibility policy.

---

# 22. pairingSupported

`pairingSupported` indicates whether the server implementation supports device pairing.

It is a capability statement.

---

# 23. pairingAvailable

`pairingAvailable` indicates whether pairing can execute at the current moment.

Pairing may be supported but temporarily unavailable because of:

* maintenance;
* initialization;
* administrative policy;
* rate-limiting state;
* authentication subsystem failure.

---

# 24. Fingerprint Descriptor

The server shall expose:

```json
{
  "fingerprint": {
    "algorithm": "sha-256",
    "value": "aeb1c50e4f070769f12e9fd42b14e65d8f7e004d986f74ca15c94610127ad5fb"
  }
}
```

The fingerprint represents the approved server trust artifact.

---

# 25. Fingerprint Stability

The fingerprint should remain stable across ordinary certificate renewal when the same public key remains in use.

A changed fingerprint requires:

* explicit user review;
* trust-state transition;
* credential transmission block until resolved.

---

# 26. Fingerprint and TLS Validation

The fingerprint contract supplements platform TLS validation.

The client shall:

1. establish TLS;
2. inspect the presented trust artifact;
3. compare the fingerprint with the trusted server record;
4. block credentials on mismatch.

---

# 27. Server Capabilities

The server shall expose an explicit capability list.

Initial values:

```text
CATALOG_BROWSE
CATALOG_SEARCH
PUBLICATION_DETAILS
PUBLICATION_DOWNLOAD
SINGLE_RANGE_DOWNLOAD
DEVICE_PAIRING
DEVICE_REVOCATION
ADMIN_LIBRARY_INITIALIZATION
ADMIN_PUBLICATION_REGISTRATION
ADMIN_METADATA_UPDATE
ADMIN_SOURCE_REPLACEMENT
ADMIN_AVAILABILITY_CHANGE
ADMIN_PUBLICATION_WITHDRAWAL
FULL_INTEGRITY_VALIDATION
```

---

# 28. Capability Meaning

A capability means:

```text
the server implementation understands this behavior
```

It does not guarantee:

* current operational availability;
* current user permission;
* successful execution;
* current Library readiness.

---

# 29. Capability and Authorization

A client may see:

```text
ADMIN_PUBLICATION_REGISTRATION
```

while authenticated as `READER`.

The capability indicates implementation support.

The role still denies execution.

---

# 30. Capability and Health

A server may advertise:

```text
PUBLICATION_DOWNLOAD
```

while source storage is temporarily unavailable.

Capability remains supported.

Health or operation errors describe current availability.

---

# 31. Capability Ordering

Capability arrays shall be treated as sets.

Clients shall not depend on ordering.

---

# 32. Unknown Capabilities

Clients shall ignore unknown optional capabilities.

A missing required capability may produce:

```text
REQUIRED_CAPABILITY_MISSING
```

during compatibility evaluation.

---

# 33. Master Library Descriptor

The public `library` object describes the current Master Library context.

It shall contain:

```text
initialized
masterLibraryId?
name?
formatVersion?
catalogRevision?
state
```

---

# 34. Initialized Library Response

Example:

```json
{
  "library": {
    "initialized": true,
    "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
    "name": "Biblioteca Maestra",
    "formatVersion": "1.0",
    "catalogRevision": 42,
    "state": "AVAILABLE"
  }
}
```

---

# 35. Uninitialized Library Response

Example:

```json
{
  "library": {
    "initialized": false,
    "state": "UNINITIALIZED"
  }
}
```

`UNINITIALIZED` is a public bootstrap state.

It is not part of the normal initialized MasterLibrary Domain lifecycle.

---

# 36. Public Library Bootstrap State

The public bootstrap state set is:

```text
UNINITIALIZED
INITIALIZING
AVAILABLE
DEGRADED
UNAVAILABLE
MAINTENANCE
INVALID
UNSUPPORTED
```

`UNINITIALIZED` exists only at the server contract boundary before a MasterLibrary aggregate exists.

---

# 37. initialized Field

`initialized` is required.

When `initialized = true`, the following are required:

```text
masterLibraryId
name
formatVersion
catalogRevision
state
```

When `initialized = false`, those identity fields shall be absent.

---

# 38. MasterLibraryId Contract

MasterLibraryId identifies one logical Master Library.

It remains stable across:

* server restart;
* storage relocation;
* container replacement;
* backup and restore;
* catalog rebuild preserving identity.

---

# 39. MasterLibraryId Change

A changed MasterLibraryId under the same trusted ServerId means:

* another Master Library was initialized;
* the prior Library was replaced;
* or the server state is inconsistent.

The client shall not merge cached catalogs across these identities.

---

# 40. Library Name

`name` is user-visible.

It may change without changing MasterLibraryId.

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 256
```

---

# 41. Format Version

`formatVersion` represents the Master Library physical/logical format.

Example:

```json
{
  "formatVersion": "1.0"
}
```

It is distinct from:

* API version;
* server version;
* database schema version.

---

# 42. CatalogRevision

The descriptor shall expose the current CatalogRevision.

Example:

```json
{
  "catalogRevision": 42
}
```

It allows clients to compare cached catalog metadata with current server authority.

---

# 43. Library State

The initialized Library state uses:

```text
INITIALIZING
AVAILABLE
DEGRADED
UNAVAILABLE
MAINTENANCE
INVALID
UNSUPPORTED
```

The client shall not map unknown state values to `AVAILABLE`.

---

# 44. Server Time

The top-level response shall include:

```text
serverTime
```

Example:

```json
{
  "serverTime": "2026-07-16T18:30:00Z"
}
```

---

# 45. Server Time Purpose

Server time supports:

* pairing-code expiry display;
* clock-skew diagnosis;
* credential timing diagnostics;
* compatibility diagnostics.

It is not a distributed clock synchronization protocol.

---

# 46. Clock Skew

The client may compare local time with serverTime.

Large skew may produce a warning.

The server remains authoritative for:

* PairingCode expiration;
* credential expiration;
* server-issued timestamps.

---

# 47. Compatibility Descriptor

The public response may include:

```text
minimumClientVersion
recommendedClientVersion?
```

Example:

```json
{
  "compatibility": {
    "minimumClientVersion": "1.0.0",
    "recommendedClientVersion": "1.1.0"
  }
}
```

---

# 48. minimumClientVersion

Clients older than this value may be denied protected operations.

The exact behavior is defined in `Compatibility.md`.

---

# 49. recommendedClientVersion

This optional field may inform users about an available upgrade.

It shall not by itself block operation.

---

# 50. GET /v1/server Authentication

The endpoint is unauthenticated.

It shall not expose:

* registered devices;
* credentials;
* roles;
* catalog content;
* publication metadata;
* physical paths;
* detailed storage diagnostics;
* personal state.

---

# 51. GET /v1/server Cache Policy

Recommended response header:

```text
Cache-Control: no-store
```

This prevents stale trust and pairing metadata.

---

# 52. GET /v1/server Rate Limits

The public endpoint may use bounded rate limiting.

It shall remain accessible enough for:

* connection setup;
* trust verification;
* pairing;
* reconnect diagnostics.

---

# 53. GET /v1/server Error Responses

Possible errors include:

```text
INTERNAL_ERROR
SERVER_IDENTITY_UNAVAILABLE
SERVER_CONFIGURATION_INVALID
RATE_LIMIT_EXCEEDED
```

The endpoint should remain available even when the Master Library is unavailable.

---

# 54. SERVER_IDENTITY_UNAVAILABLE

Used when the server cannot load a valid ServerId or trust identity.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

This is a severe server-identity failure.

---

# 55. SERVER_CONFIGURATION_INVALID

Used when required bootstrap configuration is invalid.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Administrative correction is required.

---

# 56. Protected Library Endpoint

The protected Library endpoint is:

```text
GET /v1/library
```

Authentication:

```text
READER or ADMINISTRATOR
```

---

# 57. GET /v1/library Purpose

The endpoint returns the authenticated client’s current Master Library descriptor and access context.

It allows the client to:

* confirm MasterLibraryId;
* confirm current CatalogRevision;
* inspect Library state;
* inspect current available actions;
* confirm role;
* determine whether catalog access is possible.

---

# 58. GET /v1/library Response

Baseline response:

```json
{
  "serverId": "70309fb9-1837-4a31-8518-926f9c9e957a",
  "library": {
    "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
    "name": "Biblioteca Maestra",
    "formatVersion": "1.0",
    "catalogRevision": 42,
    "state": "AVAILABLE"
  },
  "access": {
    "deviceId": "a8492d7a-7700-48bf-a76d-48c5d61da76b",
    "role": "READER",
    "allowedActions": [
      "CATALOG_BROWSE",
      "CATALOG_SEARCH",
      "PUBLICATION_DETAILS",
      "PUBLICATION_DOWNLOAD"
    ]
  },
  "serverTime": "2026-07-16T18:30:00Z"
}
```

---

# 59. Library Access Descriptor

The `access` object contains:

```text
deviceId
role
allowedActions
```

This object is contextual to the authenticated device.

---

# 60. allowedActions

Allowed actions are a server-derived effective set.

They combine:

```text
server capabilities
+
device role
+
current Library state
+
current operational policy
```

---

# 61. allowedActions Semantics

`allowedActions` helps the client render available UI.

It does not replace server-side authorization.

The server shall still validate every operation.

---

# 62. Allowed Action Values

The initial allowed-action values reuse relevant capability names:

```text
CATALOG_BROWSE
CATALOG_SEARCH
PUBLICATION_DETAILS
PUBLICATION_DOWNLOAD
ADMIN_PUBLICATION_REGISTRATION
ADMIN_METADATA_UPDATE
ADMIN_SOURCE_REPLACEMENT
ADMIN_AVAILABILITY_CHANGE
ADMIN_PUBLICATION_WITHDRAWAL
FULL_INTEGRITY_VALIDATION
```

---

# 63. Reader Access Example

A Reader may receive:

```json
{
  "allowedActions": [
    "CATALOG_BROWSE",
    "CATALOG_SEARCH",
    "PUBLICATION_DETAILS",
    "PUBLICATION_DOWNLOAD"
  ]
}
```

---

# 64. Administrator Access Example

An Administrator may receive:

```json
{
  "allowedActions": [
    "CATALOG_BROWSE",
    "CATALOG_SEARCH",
    "PUBLICATION_DETAILS",
    "PUBLICATION_DOWNLOAD",
    "ADMIN_PUBLICATION_REGISTRATION",
    "ADMIN_METADATA_UPDATE",
    "ADMIN_SOURCE_REPLACEMENT",
    "ADMIN_AVAILABILITY_CHANGE",
    "ADMIN_PUBLICATION_WITHDRAWAL",
    "FULL_INTEGRITY_VALIDATION"
  ]
}
```

---

# 65. Library State and Allowed Actions

When Library state is `AVAILABLE`, ordinary Reader actions may be present.

When state is `MAINTENANCE`, some or all actions may be removed.

When state is `INVALID` or `UNSUPPORTED`, ordinary catalog and download actions shall not be allowed.

---

# 66. DEGRADED Library Actions

A degraded Library may still permit safe operations.

Example:

```text
catalog browse allowed
publication download unavailable
```

The server shall derive allowedActions from actual safe capabilities.

---

# 67. Access Descriptor Is Not Authority Cache

The client may cache `allowedActions` for short-term UI use.

It shall not assume they remain valid indefinitely.

Each protected request is re-authorized by the server.

---

# 68. Client Server Registration

A client-created local server registration shall contain:

```text
ServerRegistration
├── serverId
├── endpoint
├── fingerprint
├── displayName
├── masterLibraryId?
├── serverVersion
├── supportedApiVersions
├── capabilities
├── authenticationMethods
├── trustedAt
├── lastConnectedAt?
└── registrationState
```

---

# 69. Registration State

Client-local registration states may include:

```text
DISCOVERED
PENDING_TRUST
TRUSTED
AUTHENTICATED
OFFLINE
IDENTITY_MISMATCH
INCOMPATIBLE
REMOVED
```

These are client-owned states.

---

# 70. Manual Server Registration

The baseline requires manual endpoint registration.

Flow:

```text
user enters endpoint
    ↓
client calls GET /v1/server
    ↓
client evaluates compatibility
    ↓
client displays identity and fingerprint
    ↓
user confirms trust
    ↓
client persists TrustedServer
    ↓
pairing begins
```

---

# 71. Endpoint Normalization

The client shall normalize ServerEndpoint according to `APIConventions.md`.

It shall preserve:

* scheme;
* host;
* port;
* base path.

It shall not rewrite HTTPS to HTTP.

---

# 72. Endpoint Change

The user may update the endpoint of an existing trusted ServerId.

The client shall:

1. connect to the new endpoint;
2. retrieve ServerDescriptor;
3. confirm same ServerId;
4. confirm trusted fingerprint;
5. update endpoint;
6. preserve credentials.

---

# 73. Endpoint Change with Identity Mismatch

If the new endpoint exposes another ServerId or fingerprint:

* the old registration remains unchanged;
* credentials are not sent;
* the client treats it as another server or trust mismatch;
* explicit user decision is required.

---

# 74. Server Discovery

Bonjour discovery may later advertise:

* display name;
* endpoint;
* ServerId;
* API version hint.

Discovered metadata is untrusted until confirmed through HTTPS and `GET /v1/server`.

---

# 75. Discovery Does Not Establish Trust

A Bonjour advertisement shall not:

* authorize credentials;
* replace fingerprint verification;
* replace user confirmation;
* create a trusted server automatically.

---

# 76. Multiple Server Registrations

A client may register several KnowledgeOS Servers in the future.

Every local cache and credential shall remain scoped by ServerId.

Module 1 may expose one active server at a time in the UI.

---

# 77. Catalog Cache Scope

Catalog metadata shall be isolated by:

```text
ServerId
+
MasterLibraryId
```

A cache from another context shall not be merged.

---

# 78. Local Publication Scope

A LocalLibraryItem shall also preserve:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
```

This allows identical PublicationId values from unrelated servers to remain isolated.

---

# 79. Server Replacement

If the NAS hardware changes but the server identity and Library are restored:

* ServerId remains;
* MasterLibraryId remains;
* fingerprint remains when key identity is restored;
* client trust remains valid;
* credentials remain valid when verifier state and pepper are restored.

---

# 80. Server Reinstallation Without Restore

A new installation without identity restore creates:

* new ServerId;
* new fingerprint;
* potentially new MasterLibraryId.

Clients shall treat it as a new server.

---

# 81. Library Restore

A valid Master Library restore shall preserve:

* MasterLibraryId;
* CatalogRevision from the restored state;
* PublicationId values;
* SourceVersion values;
* Library name and format version.

---

# 82. Library Replacement

Replacing the active Library with another logical Library requires:

* a different MasterLibraryId;
* explicit administrative action;
* client cache isolation;
* compatibility evaluation.

The server shall not silently reuse the prior MasterLibraryId.

---

# 83. CatalogRevision Rollback

A restored older backup may expose a lower CatalogRevision than previously observed.

The client shall treat this as a significant restore event.

It shall:

* invalidate active catalog cursors;
* invalidate assumptions about later revisions;
* rebuild cached metadata;
* preserve valid local publication payloads;
* not upload local state to the NAS.

---

# 84. Restore Metadata

A future optional server field may expose:

```text
restoreGeneration
```

or equivalent restore evidence.

It is not required in v1.

---

# 85. Server Capability Evolution

New capabilities may be added without changing the API major version when:

* they are optional;
* unknown values are safely ignored;
* existing required behavior remains unchanged.

Removing a previously guaranteed capability may be breaking.

---

# 86. Capability Dependency

Some capabilities depend on others.

Examples:

```text
PUBLICATION_DOWNLOAD
requires
PUBLICATION_DETAILS
```

```text
SINGLE_RANGE_DOWNLOAD
requires
PUBLICATION_DOWNLOAD
```

The server capability set shall remain internally coherent.

---

# 87. Capability Validation

The server shall validate its advertised capability set at startup.

It shall not advertise functionality whose routes or required services are unavailable by implementation.

Temporary operational failures are represented through health and errors, not capability removal in every request.

---

# 88. Server Descriptor Consistency

The public ServerDescriptor shall remain internally consistent.

Examples:

* `pairingSupported = true` requires `DEVICE_PAIRING`;
* `SINGLE_RANGE_DOWNLOAD` requires `PUBLICATION_DOWNLOAD`;
* current API path version must appear in supportedApiVersions;
* initialized Library requires MasterLibraryId.

---

# 89. Server Descriptor Atomicity

The response should be constructed from a consistent snapshot of:

* server identity;
* server configuration;
* Library descriptor;
* compatibility configuration;
* capability configuration.

---

# 90. Server Descriptor Unknown Fields

Clients shall ignore unknown optional response fields.

The server shall not remove required fields within v1.

---

# 91. Server Descriptor Security

The response shall not include:

* NAS manufacturer unless explicitly approved;
* NAS model unless explicitly approved;
* CPU architecture;
* physical storage path;
* database path;
* certificate private-key details;
* registered devices;
* credentials;
* PairingCodes;
* personal state.

---

# 92. Public Information Minimization

Only information required for:

* trust;
* compatibility;
* pairing;
* client registration;
* Library context;

shall be exposed unauthenticated.

---

# 93. Server Information Headers

The response may include:

```text
X-KnowledgeOS-Api-Version
X-KnowledgeOS-Server-Version
X-Request-Id
```

The JSON body remains authoritative for ServerDescriptor fields.

---

# 94. Protected Library Cache Policy

Recommended:

```text
Cache-Control: no-store
```

because access and current allowedActions are device-specific.

The client may persist selected non-sensitive Library descriptor fields locally.

---

# 95. Public Server ETag

The public server descriptor may expose an ETag.

Potential derivation:

```text
ServerId
serverVersion
fingerprint
capabilities
MasterLibraryId
CatalogRevision
Library state
compatibility configuration
```

ETag remains opaque.

---

# 96. Conditional Server Request

A client may use:

```text
If-None-Match
```

for reconnect optimization.

Because trust and pairing state are important, clients shall still revalidate TLS identity on every connection.

---

# 97. 304 Semantics

When returning `304 Not Modified`, the client shall reuse its cached ServerDescriptor only if:

* TLS identity remains trusted;
* endpoint remains the same expected context;
* cached response is valid;
* no security warning exists.

---

# 98. Error Contracts for GET /v1/library

Possible errors include:

```text
AUTHENTICATION_REQUIRED
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
DEVICE_REVOKED
DEVICE_DISABLED
MASTER_LIBRARY_NOT_FOUND
MASTER_LIBRARY_UNAVAILABLE
MASTER_LIBRARY_MAINTENANCE
MASTER_LIBRARY_INVALID
MASTER_LIBRARY_VERSION_UNSUPPORTED
```

---

# 99. Uninitialized Library Access

Before initialization:

```text
GET /v1/server
```

may return `initialized = false`.

```text
GET /v1/library
```

for an authenticated Administrator may return:

```json
{
  "serverId": "...",
  "library": {
    "initialized": false,
    "state": "UNINITIALIZED"
  },
  "access": {
    "deviceId": "...",
    "role": "ADMINISTRATOR",
    "allowedActions": [
      "ADMIN_LIBRARY_INITIALIZATION"
    ]
  },
  "serverTime": "2026-07-16T18:30:00Z"
}
```

---

# 100. Reader Before Initialization

A Reader credential normally cannot exist before initialization unless explicitly provisioned.

If encountered, Reader catalog operations remain unavailable.

---

# 101. Library Initialization Capability

The public server descriptor may advertise:

```text
ADMIN_LIBRARY_INITIALIZATION
```

when the server supports initialization.

The protected Library response grants that action only to an Administrator and only when current state permits it.

---

# 102. Server Identity Event Changes

The client should detect changes in:

```text
ServerId
fingerprint
MasterLibraryId
supportedApiVersions
authentication methods
required capabilities
minimumClientVersion
```

These changes may require trust or compatibility handling.

---

# 103. Non-Critical Descriptor Changes

The following normally do not require re-trust:

```text
displayName
serverVersion patch update
recommendedClientVersion
optional new capability
Library name
CatalogRevision
Library operational state
```

---

# 104. Critical Identity Changes

The following require blocking evaluation:

```text
ServerId changed
fingerprint changed
MasterLibraryId changed unexpectedly
required authentication method removed
supported API version removed
minimum client version exceeds current client
```

---

# 105. Client Compatibility Evaluation Order

Recommended order:

```text
TLS trust
    ↓
ServerId
    ↓
fingerprint
    ↓
API version
    ↓
client version
    ↓
authentication method
    ↓
required capabilities
    ↓
MasterLibraryId
    ↓
Library format version
    ↓
Library operational state
```

---

# 106. ServerDescriptor and Authentication

The client shall not send its Bearer credential merely because:

```text
GET /v1/server
```

succeeds.

It shall first validate:

* ServerId;
* fingerprint;
* compatibility;
* trusted registration.

---

# 107. ServerDescriptor and Pairing

Pairing may begin only when:

```text
pairingSupported = true
pairingAvailable = true
DEVICE_PAIRING capability present
API compatible
trust confirmed
```

---

# 108. Library Descriptor and Catalog Access

Catalog access may begin only when:

```text
authenticated
MasterLibraryId matches
Library state permits
CATALOG_BROWSE allowed
```

---

# 109. Library Descriptor and Download

Publication download may begin only when:

```text
PUBLICATION_DOWNLOAD capability present
PUBLICATION_DOWNLOAD allowed
Library state permits
Publication state permits
```

---

# 110. Server Registration Persistence

The client may persist:

```text
ServerId
endpoint
fingerprint
displayName
MasterLibraryId
serverVersion
API versions
capabilities
authentication methods
minimum client version
last successful connection
```

The data is derived and refreshable.

---

# 111. Credential Separation

The persisted ServerRegistration shall not contain the raw Bearer credential.

It shall contain only a Keychain reference or CredentialId.

---

# 112. Server Removal

Removing a server registration locally shall not:

* revoke the server-side credential automatically unless requested;
* delete local publications automatically;
* delete personal state automatically;
* affect the NAS Master Library.

---

# 113. Server Removal Contractual Warning

The client should inform the user:

```text
Removing this server from the device does not delete downloaded publications and may not revoke the server credential unless the server is currently reachable.
```

---

# 114. Server Re-Registration

If the same ServerId and fingerprint are registered again:

* the client may restore the existing trusted context;
* a missing credential still requires re-pairing;
* local catalog and publication records may be reassociated safely by identity.

---

# 115. ServerDescriptor Logging

Safe log fields include:

```text
ServerId
serverVersion
API versions
MasterLibraryId
CatalogRevision
Library state
capability count
compatibility result
```

---

# 116. ServerDescriptor Logging Prohibitions

Logs shall not contain:

* fingerprint private material;
* credentials;
* PairingCodes;
* complete client trust decisions;
* physical paths;
* personal state.

The public fingerprint itself may be logged if security policy permits.

---

# 117. Server Contract Metrics

Recommended metrics:

```text
server_descriptor_requests_total
server_descriptor_failures_total
library_descriptor_requests_total
library_descriptor_failures_total
server_identity_mismatch_total
master_library_identity_mismatch_total
compatibility_failures_total
```

---

# 118. Contract Fixtures

Required fixtures:

```text
server-initialized.json
server-uninitialized.json
server-pairing-unavailable.json
server-optional-capability.json
server-unknown-capability.json
server-identity-changed.json
library-reader-access.json
library-administrator-access.json
library-maintenance.json
library-invalid.json
library-unsupported.json
library-identity-mismatch.json
```

---

# 119. Public Server Contract Tests

Tests shall verify:

* endpoint works without authentication;
* ServerId present;
* fingerprint present;
* API version present;
* authentication method present;
* capabilities coherent;
* Library initialized shape valid;
* Library uninitialized shape valid;
* no sensitive fields exposed;
* no physical paths exposed;
* no personal state exposed.

---

# 120. Protected Library Contract Tests

Tests shall verify:

* Reader can access;
* Administrator can access;
* missing credential denied;
* revoked credential denied;
* role included;
* allowedActions derived correctly;
* unavailable actions omitted;
* MasterLibraryId exact;
* CatalogRevision exact;
* serverTime valid.

---

# 121. Identity Stability Tests

Tests shall verify:

* server restart preserves ServerId;
* container replacement preserves ServerId;
* endpoint change preserves ServerId;
* Library relocation preserves MasterLibraryId;
* backup restore preserves both identities;
* fresh install creates new ServerId.

---

# 122. Fingerprint Tests

Tests shall verify:

* fingerprint valid SHA-256;
* fingerprint stable under approved certificate renewal;
* changed key changes fingerprint;
* mismatch blocks credentials;
* no silent trust update.

---

# 123. Capability Tests

Tests shall verify:

* unknown optional capability decodes safely;
* missing mandatory capability blocks operation;
* capability does not grant role;
* capability set coherence;
* temporary health failure does not rewrite implementation support incorrectly.

---

# 124. MasterLibraryId Change Test

Test sequence:

1. register trusted ServerId and MasterLibraryId A;
2. server later exposes MasterLibraryId B;
3. client detects mismatch;
4. credentials are not used for catalog merge;
5. old catalog cache remains isolated;
6. explicit user decision is required.

---

# 125. CatalogRevision Rollback Test

Test sequence:

1. client observes revision 50;
2. restored server exposes revision 40 with same MasterLibraryId;
3. client invalidates active cursors;
4. client rebuilds metadata snapshot;
5. local publication payloads remain untouched.

---

# 126. Compatibility Tests

Tests shall verify:

* supported client accepted;
* old client rejected;
* unknown optional capability ignored;
* unsupported API version rejected;
* unsupported authentication method rejected;
* unsupported Library format rejected.

---

# 127. OpenAPI Requirements

OpenAPI shall define:

```text
GET /v1/server
GET /v1/library
ServerDescriptor
AuthenticationDescriptor
ServerFingerprintDescriptor
MasterLibraryBootstrapDescriptor
MasterLibraryDescriptor
LibraryAccessDescriptor
CompatibilityDescriptor
```

---

# 128. OpenAPI Security Requirements

`GET /v1/server`:

```text
security: []
```

`GET /v1/library`:

```text
Bearer device credential required
```

---

# 129. Server Contract Completion Gate

This document is complete when:

```text
[ ] ServerId semantics are frozen
[ ] ServerEndpoint distinction is frozen
[ ] fingerprint contract is frozen
[ ] GET /v1/server is defined
[ ] public ServerDescriptor is defined
[ ] server version is defined
[ ] supported API versions are defined
[ ] authentication descriptor is defined
[ ] pairing availability is defined
[ ] capabilities are defined
[ ] Master Library bootstrap descriptor is defined
[ ] uninitialized Library state is defined
[ ] MasterLibraryId semantics are frozen
[ ] Library name is defined
[ ] format version is defined
[ ] CatalogRevision exposure is defined
[ ] Library state is defined
[ ] serverTime is defined
[ ] compatibility descriptor is defined
[ ] GET /v1/library is defined
[ ] access descriptor is defined
[ ] allowedActions are defined
[ ] manual registration flow is defined
[ ] endpoint change behavior is defined
[ ] discovery trust boundary is defined
[ ] cache isolation is defined
[ ] restore behavior is defined
[ ] identity mismatch behavior is defined
[ ] security minimization is defined
[ ] logging and metrics are defined
[ ] fixtures are defined
[ ] testing obligations are defined
[ ] personal-state exclusion is preserved
[ ] physical-path exclusion is preserved
[ ] no architectural contradiction remains
```

---

# 130. Server Contract Invariants

The following invariants apply:

* ServerId is the server identity.
* ServerEndpoint is not identity.
* ServerFingerprint is trust evidence.
* MasterLibraryId is the Library identity.
* ServerId and MasterLibraryId are distinct.
* ServerId survives restart and container replacement.
* MasterLibraryId survives relocation and restore.
* A changed ServerId means another server.
* A changed fingerprint requires explicit trust resolution.
* A changed MasterLibraryId prevents cache merging.
* Capabilities describe implementation support.
* allowedActions describe effective current access.
* Capabilities never replace authorization.
* The public endpoint exposes no credentials.
* The public endpoint exposes no physical paths.
* CatalogRevision remains Library-scoped.
* Local publications remain independent from server registration.
* Personal state remains absent.

---

# 131. Prohibited Server Contract Designs

The module shall not:

* derive ServerId from hostname;
* derive ServerId from IP address;
* derive MasterLibraryId from storage path;
* treat endpoint as trust;
* send credentials before identity verification;
* expose registered devices publicly;
* expose credential metadata publicly;
* expose NAS paths;
* expose database paths;
* expose private-key material;
* infer authorization from capabilities;
* merge catalog caches across MasterLibraryId values;
* treat displayName as identity;
* silently accept changed fingerprint;
* silently replace MasterLibraryId;
* delete local publications after server removal;
* include annotation, progress or CloudKit state;
* use server application version as API identity.

---

# 132. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `Authentication.md`
* `ErrorContracts.md`
* `Pagination.md`
* `HealthContracts.md`
* `CatalogContracts.md`
* `PublicationContracts.md`
* `AcquisitionContracts.md`
* `AdministrationContracts.md`
* `Versioning.md`
* `Compatibility.md`

## Domain

* `../03-Domain/DomainModel.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 133. Status

**Approved**

The public KnowledgeOS Server and Master Library identity contracts are frozen.

The next document is:

```text
01-MasterLibrary/04-Contracts/HealthContracts.md
```

It shall define liveness, readiness, degraded operation, component health, public and authenticated health responses, and the relationship between server process health and Master Library availability.
