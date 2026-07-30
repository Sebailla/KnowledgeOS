
# Master Library Compatibility Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Compatibility

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the compatibility model between KnowledgeOS clients, KnowledgeOS Server and the NAS-hosted Master Library.

It establishes:

* compatibility dimensions;
* client-server compatibility;
* API-version compatibility;
* client-version compatibility;
* authentication compatibility;
* capability compatibility;
* Master Library format compatibility;
* database schema compatibility;
* publication-format compatibility;
* checksum compatibility;
* transfer compatibility;
* cursor compatibility;
* health-state compatibility;
* unknown-value handling;
* degraded compatibility;
* blocking incompatibility;
* compatibility evaluation order;
* compatibility responses;
* client behavior;
* server behavior;
* migration requirements;
* testing obligations.

Compatibility shall be evaluated explicitly.

It shall never be inferred from one version number alone.

---

# 2. Scope

This document applies to:

* macOS clients;
* iPhone clients;
* iPad clients;
* KnowledgeOS Server;
* Master Library persistence;
* public HTTP contracts;
* generated clients;
* authentication methods;
* capabilities;
* publication source formats;
* checksum algorithms;
* Range support;
* catalog pagination;
* administrative operations;
* migrations;
* upgrades;
* backup and restore.

---

# 3. Explicit Exclusions

This document does not define:

* App Store deployment policy;
* operating-system support windows;
* NAS vendor compatibility matrices;
* hardware benchmarking;
* AI-model compatibility;
* OCR-engine compatibility;
* plugin compatibility;
* CloudKit schema compatibility;
* personal-state synchronization compatibility;
* future Web-client browser support.

Those concerns require their own implementation or platform contracts.

---

# 4. Core Compatibility Principle

> Compatibility is the proven ability of two components to exchange data and execute a specific operation without violating identity, integrity, security or persistence invariants.

The complementary principle is:

> A connection may be technically reachable while remaining operationally incompatible.

---

# 5. Compatibility Is Operation-Specific

Compatibility shall not be represented only as:

```text
compatible
or
incompatible
```

A client may be compatible for:

```text
server discovery
catalog browsing
publication details
```

while incompatible for:

```text
publication acquisition
administration
source replacement
```

---

# 6. Compatibility Dimensions

The complete compatibility model evaluates:

```text
Transport Security
Server Identity
API Version
Contract Revision
Client Version
Authentication Method
Device Role
Capabilities
Master Library Identity
Master Library Format
Database Schema
Publication Format
Media Type
Checksum Algorithm
Transfer Mode
Range Semantics
Error Contract
Cursor Contract
Health State
Operation Preconditions
```

---

# 7. Compatibility Status

The public compatibility status values are:

```text
COMPATIBLE
DEGRADED
INCOMPATIBLE
UNKNOWN
```

---

# 8. COMPATIBLE

## Meaning

All mandatory requirements for the evaluated operation are satisfied.

The operation may still fail because of:

* authorization;
* temporary availability;
* publication state;
* local storage;
* network interruption;
* runtime error.

Compatibility does not guarantee execution success.

---

# 9. DEGRADED

## Meaning

The operation or connection remains safely usable with reduced functionality.

Examples:

* catalog browse supported but search unsupported;
* full download supported but Range resume unsupported;
* Reader operations supported but administration unavailable;
* Library readable but not writable;
* optional cover format unsupported;
* optional capability missing.

---

# 10. INCOMPATIBLE

## Meaning

The operation cannot execute safely.

Examples:

* no common API version;
* unsupported authentication method;
* unsupported Master Library format;
* unsupported source format;
* unsupported checksum algorithm;
* identity mismatch;
* required capability missing;
* client below minimum version;
* unsupported database schema.

---

# 11. UNKNOWN

## Meaning

Compatibility cannot be determined because required evidence is absent, malformed, stale or untrusted.

Unknown shall not be treated as compatible.

---

# 12. Compatibility Result

A compatibility evaluation shall produce:

```text
CompatibilityResult
├── status
├── blocking
├── issues
├── availableOperations
├── unavailableOperations
├── evaluatedAt
└── evidence
```

---

# 13. CompatibilityIssue

Each issue shall contain:

```text
code
message
blocking
scope
recoveryAction?
```

Example:

```json
{
  "code": "RANGE_DOWNLOAD_UNSUPPORTED",
  "message": "The server does not support resumed publication downloads.",
  "blocking": false,
  "scope": "ACQUISITION",
  "recoveryAction": "USE_FULL_DOWNLOAD"
}
```

---

# 14. Compatibility Scope

Initial scopes:

```text
SERVER_REGISTRATION
AUTHENTICATION
CATALOG
PUBLICATION_DETAILS
ACQUISITION
ADMINISTRATION
LIBRARY_READ
LIBRARY_WRITE
PERSISTENCE
```

---

# 15. Compatibility Evidence

Evidence may include safe values such as:

```text
selectedApiVersion
clientVersion
serverVersion
contractRevision
authenticationMethod
requiredCapabilities
availableCapabilities
masterLibraryId
libraryFormatVersion
sourceFormat
checksumAlgorithm
rangeSupported
```

Secrets and physical paths are prohibited.

---

# 16. Client Compatibility Authority

The client owns the final decision to:

* trust the server;
* select an API version;
* enable UI capabilities;
* disable unsupported actions;
* continue in degraded mode;
* require an upgrade;
* isolate incompatible cached data.

---

# 17. Server Compatibility Authority

The server owns the final decision to:

* accept the API request;
* accept the client version;
* accept the authentication method;
* authorize the Device;
* expose effective capabilities;
* permit Library reads;
* permit Library writes;
* reject unsupported persistent formats.

---

# 18. Compatibility Evaluation Phases

The compatibility process is divided into:

```text
Phase 1 — Transport and Trust

Phase 2 — Public Server Contract

Phase 3 — Authentication

Phase 4 — Master Library Context

Phase 5 — Operation Compatibility

Phase 6 — Resource Compatibility

Phase 7 — Local Client Preconditions
```

---

# 19. Phase 1 — Transport and Trust

The client shall evaluate:

```text
HTTPS available
TLS validation succeeds
ServerFingerprint available
ServerId available
trusted ServerId matches
trusted fingerprint matches
```

Failure blocks credential transmission.

---

# 20. Transport Compatibility

Production compatibility requires:

```text
HTTPS
```

Plain HTTP is incompatible outside approved development or test configuration.

---

# 21. TLS Compatibility

The client and server shall share:

* a supported TLS protocol;
* a supported cipher suite;
* a valid trust path or approved pinned trust;
* compatible certificate and key algorithms.

TLS negotiation failure means the server is unreachable for KnowledgeOS operations.

---

# 22. Server Identity Compatibility

The presented ServerId shall match the trusted ServerId for an existing registration.

Mismatch produces:

```text
SERVER_IDENTITY_MISMATCH
```

Status:

```text
INCOMPATIBLE
```

Blocking:

```text
true
```

---

# 23. Fingerprint Compatibility

The presented fingerprint shall match the trusted fingerprint.

Mismatch produces:

```text
SERVER_FINGERPRINT_MISMATCH
```

The client shall not send credentials.

---

# 24. New Server Compatibility

A previously unknown ServerId is not automatically incompatible.

Its status is:

```text
UNKNOWN
```

until explicit trust confirmation occurs.

---

# 25. Phase 2 — Public Server Contract

After trust evaluation, the client retrieves:

```text
GET /v1/server
```

and evaluates:

* supported API versions;
* ContractRevision;
* server version;
* minimum client version;
* authentication methods;
* capabilities;
* Master Library bootstrap state.

---

# 26. API Version Compatibility

The client and server shall share at least one API version.

Conceptually:

```text
clientSupportedApiVersions
∩
serverSupportedApiVersions
≠
empty
```

---

# 27. API Version Selection

The selected version shall be the highest mutually supported version that the client fully implements.

Example:

```text
Client supports: v1, v2
Server supports: v1
Selected: v1
```

---

# 28. No Common API Version

Issue:

```text
API_VERSION_UNSUPPORTED
```

Status:

```text
INCOMPATIBLE
```

Blocking:

```text
true
```

---

# 29. ContractRevision Compatibility

The client shall support the semantic requirements of the server's ContractRevision inside the selected ApiVersion.

A newer compatible ContractRevision may remain usable when the client:

* ignores unknown optional fields;
* handles unknown response values safely;
* recognizes required baseline fields;
* supports the selected endpoint.

---

# 30. Contract Revision Too New

A ContractRevision is incompatible only when it introduces a required behavior the client cannot safely support.

Issue:

```text
CONTRACT_REVISION_UNSUPPORTED
```

---

# 31. Server Version Compatibility

ServerVersion is primarily diagnostic.

The client shall not reject a server solely because its application version is unfamiliar when:

* API version is supported;
* required ContractRevision behavior is supported;
* required capabilities exist;
* identity and security are valid.

---

# 32. Client Version Compatibility

The server may require:

```text
clientVersion >= minimumClientVersion
```

Failure produces:

```text
CLIENT_VERSION_UNSUPPORTED
```

---

# 33. Recommended Client Version

A client below `recommendedClientVersion` but above the minimum remains:

```text
COMPATIBLE
```

or:

```text
DEGRADED
```

only when a known optional feature is unavailable.

---

# 34. Platform-Specific Client Compatibility

The server may evaluate minimum versions separately for:

```text
macOS
iOS
iPadOS
```

The client shall send its platform through the approved header.

---

# 35. Invalid Client Version

A malformed ClientVersion shall not be used in semantic comparison.

The server may return:

```text
CLIENT_VERSION_INVALID
```

HTTP:

```text
400 Bad Request
```

---

# 36. Phase 3 — Authentication Compatibility

The client and server shall share at least one supported authentication method.

Initial required method:

```text
DEVICE_OPAQUE_CREDENTIAL
```

---

# 37. Authentication Method Compatibility

Compatible when:

```text
DEVICE_OPAQUE_CREDENTIAL
```

is supported by both client and server.

---

# 38. Authentication Method Missing

Issue:

```text
AUTHENTICATION_METHOD_UNSUPPORTED
```

Status:

```text
INCOMPATIBLE
```

---

# 39. Pairing Compatibility

Pairing requires:

```text
DEVICE_PAIRING capability
pairingSupported = true
pairingAvailable = true
DEVICE_OPAQUE_CREDENTIAL method
compatible client version
trusted server identity
```

---

# 40. Pairing Temporarily Unavailable

When pairing is supported but currently unavailable:

```text
status = DEGRADED
```

for server registration.

It is not a permanent protocol incompatibility.

---

# 41. Credential Format Compatibility

The client shall store and transmit the opaque credential without parsing unsupported internal semantics.

The server owns credential parsing.

A new incompatible credential wire format requires:

* authentication-method evolution;
* or explicit dual-format support.

---

# 42. Authentication State Is Not Compatibility

The following are distinct:

```text
compatible authentication method
```

and:

```text
valid active credential
```

A revoked credential is an authentication failure, not necessarily a protocol incompatibility.

---

# 43. Phase 4 — Master Library Context

After authentication, the client evaluates:

```text
MasterLibraryId
MasterLibraryFormatVersion
Library state
CatalogRevision validity
effective allowed actions
```

---

# 44. MasterLibraryId Compatibility

For an existing local registration or cache:

```text
remote MasterLibraryId
=
expected MasterLibraryId
```

is required for cache merging and local identity comparison.

---

# 45. Master Library Identity Mismatch

Issue:

```text
MASTER_LIBRARY_IDENTITY_MISMATCH
```

Status:

```text
INCOMPATIBLE
```

for the existing Library context.

The same server may be registered as a new Library context only after explicit user resolution.

---

# 46. New Master Library Context

A trusted ServerId exposing a new MasterLibraryId may be treated as:

```text
UNKNOWN
```

until the user confirms replacement or separate registration behavior.

---

# 47. Master Library Format Compatibility

The server runtime owns persistent-format compatibility.

The client generally relies on the server's safe exposure.

However, the client shall inspect:

```text
formatVersion
Library state
```

---

# 48. Supported Library Format

When the server reports:

```text
state = AVAILABLE or DEGRADED
```

and the selected API remains compatible, Reader clients may proceed.

---

# 49. Unsupported Library Format

Issue:

```text
MASTER_LIBRARY_VERSION_UNSUPPORTED
```

Status:

```text
INCOMPATIBLE
```

Ordinary Reader and administrative mutations are blocked.

---

# 50. Read-Only Format Compatibility

A server may expose:

```text
Library readable
Library not writable
```

Result:

```text
DEGRADED
```

Available operations may include:

* catalog browse;
* publication detail;
* publication download.

Unavailable operations may include:

* metadata update;
* source replacement;
* withdrawal;
* Library configuration mutation.

---

# 51. Database Schema Compatibility

DatabaseSchemaVersion is evaluated by the server.

The client shall not attempt to interpret the server database schema directly.

---

# 52. Supported Database Schema

The server may:

* use the schema directly;
* migrate it;
* expose read-only compatibility;
* reject it.

---

# 53. Migration Required

Issue:

```text
MIGRATION_REQUIRED
```

Status:

```text
INCOMPATIBLE
```

for ordinary operation until migration completes.

---

# 54. Unsupported Schema

Issue:

```text
DATABASE_SCHEMA_VERSION_UNSUPPORTED
```

The server shall not write to the database.

---

# 55. Phase 5 — Operation Compatibility

Compatibility shall be evaluated separately for each operation.

Initial operation groups:

```text
SERVER_DISCOVERY
PAIR_DEVICE
AUTHENTICATE
GET_LIBRARY
BROWSE_CATALOG
SEARCH_CATALOG
GET_PUBLICATION_DETAILS
GET_PUBLICATION_COVER
INSPECT_CONTENT
DOWNLOAD_FULL_CONTENT
RESUME_CONTENT_DOWNLOAD
INITIALIZE_LIBRARY
REGISTER_PUBLICATION
UPDATE_METADATA
REPLACE_COVER
REPLACE_SOURCE
CHANGE_AVAILABILITY
WITHDRAW_PUBLICATION
RESTORE_PUBLICATION
VALIDATE_INTEGRITY
MANAGE_DEVICES
```

---

# 56. Operation Compatibility Inputs

Each operation considers:

```text
API route support
required capability
required authentication method
required role
Library state
resource state
format support
transfer support
client implementation support
```

---

# 57. Capability Compatibility

An operation is protocol-compatible only when every required capability is present.

Example:

```text
BROWSE_CATALOG
requires
CATALOG_BROWSE
```

---

# 58. Optional Capability Missing

Missing optional capability produces:

```text
DEGRADED
```

not complete incompatibility.

---

# 59. Required Capability Missing

Issue:

```text
REQUIRED_CAPABILITY_MISSING
```

The affected operation is incompatible.

Other operations may remain compatible.

---

# 60. Capability and Role

Capabilities describe server implementation.

Roles describe permission.

Example:

```text
Server capability:
ADMIN_SOURCE_REPLACEMENT

Device role:
READER

Result:
protocol compatible
authorization denied
```

The UI shall still disable the administrative operation.

---

# 61. Catalog Browse Compatibility

Requires:

```text
selected API version
active credential
CATALOG_BROWSE
compatible cursor contract
supported PublicationSummary schema
Library state AVAILABLE or DEGRADED
```

---

# 62. Catalog Search Compatibility

Additionally requires:

```text
CATALOG_SEARCH
supported query semantics
supported response schema
```

If missing:

```text
catalog browse = compatible
catalog search = incompatible
overall catalog connection = degraded
```

---

# 63. Pagination Compatibility

The client shall support:

```text
opaque cursor
keyset pagination
CatalogRevision binding
cursor invalidation
restart after revision mismatch
pageSize constraints
```

---

# 64. Cursor Format Compatibility

The client does not need to understand CursorFormatVersion.

It only needs to:

* preserve cursor text;
* send it unchanged;
* restart on invalidation.

Therefore, most cursor-format changes remain compatible.

---

# 65. Cursor Semantic Breaking Change

A cursor change becomes incompatible when the client can no longer safely:

* follow `nextCursor`;
* detect final page;
* restart after invalidation;
* preserve revision consistency.

Such a change requires contract evolution.

---

# 66. Publication Detail Compatibility

Requires support for:

```text
PublicationId
PublicationMetadata
PublicationAvailability
CurrentSourceDescriptor
CoverDescriptor
CatalogRevision
unknown-enum handling
```

---

# 67. Publication Format Compatibility

The initial client supports:

```text
PDF
```

An unsupported format does not necessarily block metadata display.

It blocks acquisition and opening.

---

# 68. Unsupported Publication Format

Issue:

```text
PUBLICATION_FORMAT_UNSUPPORTED
```

Result:

```text
publication details = compatible
publication acquisition = incompatible
```

---

# 69. Media-Type Compatibility

The source format and media type shall agree.

Initial supported mapping:

```text
PDF
→
application/pdf
```

Mismatch produces an integrity or compatibility failure.

---

# 70. Cover Format Compatibility

Supported initial cover media types:

```text
image/jpeg
image/png
image/webp
```

An unsupported cover format shall not block publication metadata or source acquisition.

Result:

```text
DEGRADED
```

---

# 71. Checksum Compatibility

Acquisition requires a mutually supported checksum algorithm.

Initial required algorithm:

```text
sha-256
```

---

# 72. Unsupported Checksum Algorithm

Issue:

```text
CHECKSUM_ALGORITHM_UNSUPPORTED
```

Status:

```text
INCOMPATIBLE
```

for acquisition of the affected source.

The client shall not skip validation.

---

# 73. Multiple Checksum Algorithms

A future source may advertise several checksums.

The client may select one mutually supported authoritative algorithm only when the contract explicitly permits it.

The v1 baseline requires SHA-256.

---

# 74. Full Transfer Compatibility

Requires:

```text
PUBLICATION_DOWNLOAD
GET content support
binary media support
Content-Length
SourceVersion headers
Checksum headers
local staging
local checksum validation
```

---

# 75. Range Resume Compatibility

Requires:

```text
SINGLE_RANGE_DOWNLOAD
rangeSupported = true
Accept-Ranges: bytes
206 support
Content-Range validation
If-Range support or equivalent safe source validation
```

---

# 76. Range Capability Missing

Result:

```text
full download = compatible
resume = incompatible
acquisition overall = degraded
```

Recovery action:

```text
USE_FULL_DOWNLOAD
```

---

# 77. Multi-Range Compatibility

The v1 client and server do not require multi-range support.

A server supporting multi-range additionally remains compatible as long as single-range requests retain v1 behavior.

---

# 78. Binary Encoding Compatibility

The source shall be transferred as raw binary.

A server returning Base64 JSON instead is incompatible with v1.

---

# 79. Content-Encoding Compatibility

The client shall support the response Content-Encoding actually used.

The v1 preferred source transfer uses no additional content encoding.

Unexpected transformation that changes checksum interpretation is incompatible.

---

# 80. Administrative Compatibility

Administrative operation compatibility requires:

```text
ADMINISTRATOR role
required admin capability
write-compatible Library format
write-compatible database schema
required storage components
supported request schema
supported concurrency contract
```

---

# 81. Library Initialization Compatibility

Requires:

```text
ADMIN_LIBRARY_INITIALIZATION
Library uninitialized
Administrator authority
compatible server runtime
valid storage target
```

---

# 82. Publication Registration Compatibility

Requires:

```text
ADMIN_PUBLICATION_REGISTRATION
supported source format
supported metadata schema
staging storage
source storage write access
catalog database write access
checksum support
```

---

# 83. Metadata Update Compatibility

Requires:

```text
ADMIN_METADATA_UPDATE
supported metadata fields
optimistic concurrency support
write-compatible Library
```

---

# 84. Source Replacement Compatibility

Requires:

```text
ADMIN_SOURCE_REPLACEMENT
supported source format
supported checksum
staging and source storage
SourceVersion semantics
atomic or recoverable commit
```

---

# 85. Integrity Validation Compatibility

Requires:

```text
FULL_INTEGRITY_VALIDATION
supported source formats
supported checksum algorithms
read access to catalog and source storage
```

---

# 86. Phase 6 — Resource Compatibility

Even when the operation is generally supported, one specific resource may be incompatible.

Examples:

* unsupported publication format;
* unknown checksum algorithm;
* unsupported source size;
* malformed metadata;
* unavailable source;
* unknown availability state.

---

# 87. Resource Compatibility Result

A Publication may expose:

```text
detailsCompatible = true
acquisitionCompatible = false
reason = PUBLICATION_FORMAT_UNSUPPORTED
```

This is valid.

---

# 88. Resource Identity Compatibility

The client may merge a remote Publication with local state only when:

```text
ServerId matches
MasterLibraryId matches
PublicationId matches
```

---

# 89. Source Compatibility

A remote source may be compared with a local source only when:

```text
identity context matches
source format compatible
SourceVersion valid
checksum algorithm supported
```

---

# 90. Large Source Compatibility

The client shall validate:

* ByteLength representability;
* local filesystem capacity;
* local database integer support;
* platform transfer limits;
* available local storage.

A source may be protocol-compatible but locally impossible to install.

---

# 91. Local Storage Incompatibility

Issue:

```text
INSUFFICIENT_LOCAL_STORAGE
```

This is a local execution precondition failure rather than server protocol incompatibility.

---

# 92. Source Size Limit

A client may define a maximum supported source size.

If the authoritative ByteLength exceeds it:

```text
SOURCE_SIZE_UNSUPPORTED
```

The publication details remain usable.

---

# 93. Metadata Compatibility

Unknown optional metadata fields shall be ignored.

Unknown required semantic structures shall produce a safe incompatibility result.

---

# 94. External Identifier Compatibility

Unsupported bibliographic identifier types shall not block publication display.

They may be ignored or displayed generically when safely represented.

---

# 95. Unknown Publication Type

Unknown PublicationType:

```text
details = compatible
display classification = degraded
acquisition = unaffected when source format supported
```

---

# 96. Unknown Contributor Role

Unknown ContributorRole shall not block metadata display.

The client preserves the contributor and uses a generic role.

---

# 97. Unknown Availability

Unknown PublicationAvailability shall block acquisition.

Issue:

```text
PUBLICATION_AVAILABILITY_UNSUPPORTED
```

---

# 98. Unknown Health State

Unknown Server or Library health state shall not be treated as healthy.

The client may continue local-only behavior while blocking unsafe remote operations.

---

# 99. Unknown Error Code

Unknown error code shall:

* decode safely;
* preserve raw value;
* use HTTP status as secondary context;
* disable automatic retry by default;
* display RequestId;
* avoid crashing.

---

# 100. Unknown Capability

Unknown optional capability shall be ignored.

Unknown capability shall not grant UI access automatically.

---

# 101. Unknown Authentication Method

Unknown authentication methods may be ignored when at least one supported method remains.

If no mutually supported method exists, authentication is incompatible.

---

# 102. Unknown API Response Field

Unknown optional fields shall be ignored.

This is required for compatible contract evolution.

---

# 103. Missing Required Response Field

A missing required v1 field is a contract incompatibility.

The client shall:

* reject the malformed response;
* preserve local state;
* avoid partial merge;
* record a compatibility or protocol error.

---

# 104. Type Mismatch

Example:

```text
catalogRevision returned as string
instead of integer
```

This is a response-contract incompatibility.

---

# 105. Semantic Mismatch

Example:

```text
requested SourceVersion 2
response declares SourceVersion 3
```

This is a protocol-integrity incompatibility.

---

# 106. Phase 7 — Local Client Preconditions

After remote compatibility succeeds, the client evaluates:

```text
Keychain available
local database compatible
local storage available
source format supported
checksum implementation available
staging writable
background-transfer policy
user network policy
```

---

# 107. Local Database Compatibility

The client application shall evaluate its own local database schema before remote workflows.

Failure may block:

* catalog caching;
* acquisition persistence;
* LocalLibraryItem installation;
* personal-state access.

---

# 108. Client Migration Compatibility

A new client may migrate an older supported local schema.

The client shall not silently discard:

* local publications;
* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships.

---

# 109. Unsupported Client Schema

The client shall enter a recovery or migration-required state.

It shall not start new acquisitions when it cannot persist their state safely.

---

# 110. Keychain Compatibility

Authentication requires secure credential storage.

When Keychain is unavailable:

```text
authentication = incompatible
local Library = potentially compatible
```

Existing locally installed publications remain accessible according to local security policy.

---

# 111. Filesystem Compatibility

The client shall verify that its local storage supports:

* required file size;
* safe writes;
* atomic or recoverable moves;
* persistent Application Support storage;
* staging isolation.

---

# 112. Compatibility Evaluation Order

The approved order is:

```text
1. Transport security

2. Server trust

3. ServerId

4. API version

5. ContractRevision

6. Client minimum version

7. Authentication method

8. Required server capabilities

9. Credential validity

10. Device authorization

11. MasterLibraryId

12. Library format and state

13. Operation capability

14. Resource format

15. Checksum algorithm

16. Transfer mode

17. Local persistence

18. Local storage

19. User and device policy
```

---

# 113. Why Evaluation Order Matters

The client shall not:

* inspect sensitive protected resources before trust;
* send credentials before fingerprint validation;
* start transfer before SourceVersion compatibility;
* write local staging before storage checks;
* merge remote state before MasterLibraryId validation.

---

# 114. Public Compatibility Descriptor

`GET /v1/server` may include:

```json
{
  "compatibility": {
    "minimumClientVersion": "1.0.0",
    "recommendedClientVersion": "1.1.0",
    "contractRevision": "1.0",
    "libraryFormat": {
      "minimumReadable": "1.0",
      "maximumReadable": "1.0",
      "maximumWritable": "1.0"
    }
  }
}
```

---

# 115. Protected Compatibility Endpoint

A dedicated compatibility endpoint is optional.

Potential endpoint:

```text
GET /v1/compatibility
```

The v1 baseline does not require it because compatibility evidence already exists in:

* ServerDescriptor;
* LibraryDescriptor;
* capabilities;
* PublicationDetails;
* health contracts.

---

# 116. Client Compatibility Summary

The client should maintain a local projection:

```text
ServerCompatibility
├── status
├── selectedApiVersion
├── authenticationCompatible
├── libraryCompatible
├── catalogCompatible
├── acquisitionCompatible
├── administrationCompatible
├── issues
├── evaluatedAt
└── descriptorETag?
```

---

# 117. Compatibility Is Derived State

Compatibility results are:

* client-derived;
* replaceable;
* time-sensitive;
* scoped to one ServerId;
* scoped to one MasterLibraryId where applicable.

They are not NAS authority.

---

# 118. Compatibility Cache Scope

A cached compatibility result shall be scoped to:

```text
ServerId
endpoint
fingerprint
MasterLibraryId?
selectedApiVersion
clientVersion
server descriptor ETag?
```

---

# 119. Compatibility Cache Invalidation

Re-evaluation is required when:

* ServerId changes;
* fingerprint changes;
* ServerDescriptor ETag changes;
* server version changes materially;
* supported API versions change;
* minimum client version changes;
* capabilities change;
* authentication methods change;
* MasterLibraryId changes;
* Library format changes;
* client application updates.

---

# 120. Compatibility and Offline Mode

When offline, the client may use the last known compatibility result for display only.

It shall not claim current remote compatibility.

Local publications remain usable independently.

---

# 121. Compatibility and Degraded Mode

A degraded compatibility result shall expose exactly which operations remain available.

Example:

```json
{
  "status": "DEGRADED",
  "availableOperations": [
    "BROWSE_CATALOG",
    "GET_PUBLICATION_DETAILS",
    "DOWNLOAD_FULL_CONTENT"
  ],
  "unavailableOperations": [
    "SEARCH_CATALOG",
    "RESUME_CONTENT_DOWNLOAD",
    "ADMINISTRATION"
  ]
}
```

---

# 122. Compatibility and UI

The client UI shall:

* enable compatible actions;
* disable incompatible actions;
* explain degraded capabilities;
* avoid exposing raw protocol details to ordinary users;
* provide technical diagnostics for advanced users.

---

# 123. Compatibility Message Example

User-facing:

```text
This server supports publication downloads, but interrupted downloads must restart from the beginning.
```

Technical issue:

```text
SINGLE_RANGE_DOWNLOAD capability missing.
```

---

# 124. Blocking Compatibility Issue

A blocking issue prevents one or more operations from executing safely.

Examples:

```text
SERVER_IDENTITY_MISMATCH
API_VERSION_UNSUPPORTED
AUTHENTICATION_METHOD_UNSUPPORTED
MASTER_LIBRARY_VERSION_UNSUPPORTED
CHECKSUM_ALGORITHM_UNSUPPORTED
```

---

# 125. Non-Blocking Compatibility Issue

Examples:

```text
RECOMMENDED_CLIENT_UPDATE_AVAILABLE
CATALOG_SEARCH_UNSUPPORTED
RANGE_DOWNLOAD_UNSUPPORTED
COVER_MEDIA_TYPE_UNSUPPORTED
OPTIONAL_PROVIDER_UNAVAILABLE
```

---

# 126. Compatibility Recovery Actions

Initial recovery-action values:

```text
UPDATE_CLIENT
UPDATE_SERVER
REPAIR_SERVER_TRUST
REPAIR_MASTER_LIBRARY
MIGRATE_MASTER_LIBRARY
USE_FULL_DOWNLOAD
DISABLE_UNSUPPORTED_FEATURE
REPAIR_LOCAL_STORAGE
FREE_LOCAL_STORAGE
REPAIR_LOCAL_DATABASE
REPAIR_KEYCHAIN
REPAIR_AUTHENTICATION
REPAIR_SERVER_CONFIGURATION
CONTACT_ADMINISTRATOR
NONE
```

---

# 127. Recovery Action Is Advisory

The compatibility recovery action is a safe recommendation.

It does not execute repair automatically.

---

# 128. Compatibility Error Codes

The public compatibility registry includes:

```text
API_VERSION_UNSUPPORTED
CONTRACT_REVISION_UNSUPPORTED
CLIENT_VERSION_UNSUPPORTED
CLIENT_VERSION_INVALID
SERVER_VERSION_UNSUPPORTED
AUTHENTICATION_METHOD_UNSUPPORTED
REQUIRED_CAPABILITY_MISSING
MASTER_LIBRARY_IDENTITY_MISMATCH
MASTER_LIBRARY_VERSION_UNSUPPORTED
DATABASE_SCHEMA_VERSION_UNSUPPORTED
MIGRATION_REQUIRED
PUBLICATION_FORMAT_UNSUPPORTED
PUBLICATION_AVAILABILITY_UNSUPPORTED
COVER_MEDIA_TYPE_UNSUPPORTED
CHECKSUM_ALGORITHM_UNSUPPORTED
SOURCE_SIZE_UNSUPPORTED
RANGE_DOWNLOAD_UNSUPPORTED
BINARY_TRANSFER_UNSUPPORTED
RESPONSE_CONTRACT_INVALID
```

---

# 129. API_VERSION_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

---

# 130. CONTRACT_REVISION_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

Client or server update is required.

---

# 131. CLIENT_VERSION_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

Recovery action:

```text
UPDATE_CLIENT
```

---

# 132. AUTHENTICATION_METHOD_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

---

# 133. REQUIRED_CAPABILITY_MISSING

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

unless server configuration may enable the capability.

---

# 134. MASTER_LIBRARY_VERSION_UNSUPPORTED

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

until upgrade or migration.

---

# 135. PUBLICATION_FORMAT_UNSUPPORTED

This is normally a client-derived resource compatibility issue.

When returned by the server for an unsupported request:

```text
422 Unprocessable Content
```

---

# 136. CHECKSUM_ALGORITHM_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

The client shall not proceed without integrity validation.

---

# 137. RANGE_DOWNLOAD_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

The operation may fall back to full transfer.

---

# 138. RESPONSE_CONTRACT_INVALID

Client-owned error used when a server response violates required contract structure or semantics.

The client shall:

* reject the response;
* avoid partial persistence;
* preserve local state;
* record RequestId;
* disable automatic unsafe retry.

---

# 139. Compatibility and HTTP Status

HTTP status remains secondary to the stable compatibility code.

A `412` may mean:

* API version unsupported;
* client version unsupported;
* capability missing;
* checksum unsupported;
* Range unsupported.

The client shall branch by error code.

---

# 140. Compatibility Logging

Safe fields:

```text
serverId
masterLibraryId?
clientVersion
clientPlatform
serverVersion
selectedApiVersion
contractRevision
compatibilityStatus
issueCodes
availableOperationCount
unavailableOperationCount
evaluatedAt
```

---

# 141. Compatibility Log Prohibitions

Logs shall not contain:

* credentials;
* PairingCodes;
* trust private material;
* physical paths;
* source payloads;
* annotations;
* reading progress;
* personal tags;
* complete personal state.

---

# 142. Compatibility Metrics

Recommended metrics:

```text
compatibility_evaluations_total{status}
compatibility_issues_total{code}
api_version_selection_total{api_version}
client_version_rejections_total{platform}
required_capability_missing_total{capability}
library_format_incompatible_total{format_major}
publication_format_unsupported_total{format}
checksum_algorithm_unsupported_total{algorithm}
range_download_fallback_total
```

Labels shall remain bounded.

---

# 143. Compatibility Audit

Administrative compatibility failures related to:

* migration;
* Library format;
* schema version;
* server upgrade;
* write compatibility;

should generate administrative audit evidence.

---

# 144. Compatibility and Health

Compatibility and health are distinct.

Example:

```text
Server compatible
Library temporarily unavailable
```

Compatibility:

```text
COMPATIBLE
```

Health:

```text
UNAVAILABLE
```

---

# 145. Compatibility and Authorization

Compatibility and authorization are distinct.

Example:

```text
Client supports source replacement
Server supports source replacement
Device role = READER
```

Compatibility:

```text
COMPATIBLE
```

Authorization:

```text
DENIED
```

---

# 146. Compatibility and Availability

A Publication may be compatible in format but unavailable remotely.

Example:

```text
format = PDF
checksum = sha-256
availability = WITHDRAWN
```

Compatibility:

```text
source format compatible
```

Availability:

```text
not acquirable
```

---

# 147. Compatibility and Integrity

A source may be structurally compatible but fail integrity.

Example:

```text
format supported
checksum algorithm supported
actual checksum mismatch
```

This is an integrity failure, not format incompatibility.

---

# 148. Compatibility and Local State

Remote incompatibility shall not automatically invalidate:

* local PDF payloads;
* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* cached metadata.

---

# 149. Server Upgrade Compatibility

After server upgrade, the client shall re-evaluate:

```text
fingerprint
ServerId
API versions
ContractRevision
minimum client version
authentication methods
capabilities
MasterLibraryId
Library format
```

---

# 150. Client Upgrade Compatibility

After client upgrade, the client shall:

* migrate local persistence;
* preserve local content;
* preserve personal state;
* re-evaluate registered servers;
* select the best mutually supported API version;
* retain trusted identities unless security evidence changed.

---

# 151. Master Library Migration Compatibility

During migration:

```text
Library state = MAINTENANCE
ordinary operations = unavailable
administrative migration = permitted
```

After migration, compatibility is re-evaluated before readiness.

---

# 152. Rollback Compatibility

A restored older Master Library may remain compatible while exposing a lower CatalogRevision.

The client shall rebuild its derived catalog snapshot.

Identity shall remain stable when the restore belongs to the same logical Library.

---

# 153. Backup Compatibility

A backup shall be classified as:

```text
DIRECTLY_COMPATIBLE
MIGRATABLE
READ_ONLY_COMPATIBLE
UNSUPPORTED
INVALID
```

---

# 154. DIRECTLY_COMPATIBLE

The current runtime can restore and use the backup without persistent migration.

---

# 155. MIGRATABLE

The runtime can restore and migrate the backup through a supported path.

---

# 156. READ_ONLY_COMPATIBLE

The runtime can inspect or export the backup safely but cannot mutate it.

---

# 157. UNSUPPORTED

No approved safe interpretation exists.

---

# 158. INVALID Backup

The backup fails structural, identity or integrity validation.

---

# 159. Compatibility Fixtures

Required fixtures:

```text
compatibility-fully-compatible.json
compatibility-degraded-no-search.json
compatibility-degraded-no-range.json
compatibility-api-unsupported.json
compatibility-client-too-old.json
compatibility-auth-method-unsupported.json
compatibility-required-capability-missing.json
compatibility-library-id-mismatch.json
compatibility-library-format-unsupported.json
compatibility-library-read-only.json
compatibility-publication-format-unsupported.json
compatibility-checksum-unsupported.json
compatibility-cover-format-unsupported.json
compatibility-unknown-enum.json
compatibility-invalid-response.json
compatibility-backup-migratable.json
```

---

# 160. Compatibility Test Matrix

Required combinations:

```text
minimum client ↔ current server
current client ↔ minimum server
current client ↔ current server
future-compatible server response ↔ current client
old client ↔ newer compatible ContractRevision
client with v1 only ↔ server with v1 and v2
client with v2 only ↔ server with v1 only
supported Library format ↔ current server
newer unsupported Library ↔ older server
PDF source ↔ PDF client
unknown source format ↔ PDF-only client
Range server ↔ Range client
non-Range server ↔ Range-capable client
```

---

# 161. Trust Compatibility Tests

Tests shall verify:

* trusted ServerId and fingerprint accepted;
* endpoint change with same identity accepted;
* ServerId mismatch blocked;
* fingerprint mismatch blocked;
* credentials not sent before trust;
* unknown server requires confirmation.

---

# 162. API Compatibility Tests

Tests shall verify:

* common API selected;
* highest mutually supported version selected;
* no common version rejected;
* no silent fallback without implementation;
* selected version persisted;
* version re-evaluated after server update.

---

# 163. ContractRevision Tests

Tests shall verify:

* newer optional field accepted;
* unknown optional capability ignored;
* unknown error code handled;
* unknown response enum handled safely;
* missing required field rejected;
* incompatible semantic change rejected.

---

# 164. Client Version Tests

Tests shall verify:

* minimum version accepted;
* version below minimum rejected;
* recommended version does not block;
* malformed semantic version rejected;
* platform-specific minimum applied.

---

# 165. Authentication Compatibility Tests

Tests shall verify:

* DEVICE_OPAQUE_CREDENTIAL accepted;
* unknown additional method ignored;
* no common method rejected;
* pairing supported but unavailable produces degraded status;
* revoked credential remains authentication failure, not protocol incompatibility.

---

# 166. Capability Tests

Tests shall verify:

* required capability present;
* required capability missing blocks operation;
* optional capability missing degrades operation set;
* unknown capability does not grant access;
* role remains independent.

---

# 167. Library Compatibility Tests

Tests shall verify:

* matching MasterLibraryId merges cache;
* changed MasterLibraryId isolates cache;
* supported format accepted;
* read-only compatibility disables writes;
* unsupported format blocks operations;
* migration-required state blocks ordinary traffic.

---

# 168. Publication Compatibility Tests

Tests shall verify:

* PDF supported;
* unknown publication type still displays;
* unknown contributor role still displays;
* unknown source format disables acquisition;
* unknown availability disables acquisition;
* unsupported cover type does not block PDF acquisition.

---

# 169. Acquisition Compatibility Tests

Tests shall verify:

* SHA-256 accepted;
* unsupported checksum blocks installation;
* full transfer compatible;
* Range resume compatible when capability present;
* missing Range capability falls back to full;
* SourceVersion mismatch rejected;
* response semantic mismatch rejected.

---

# 170. Local Compatibility Tests

Tests shall verify:

* insufficient storage blocks acquisition only;
* Keychain unavailable blocks authentication but not local reading;
* local schema migration preserves personal state;
* local database incompatibility prevents new acquisition commit;
* existing valid payload remains accessible.

---

# 171. Unknown-Value Safety Tests

The client shall prove unknown values do not map to:

```text
COMPATIBLE
AVAILABLE
HEALTHY
AUTHORIZED
AUTHENTICATED
COMPLETED
VALID
```

without explicit recognition.

---

# 172. Response Contract Tests

Tests shall inject:

* missing required field;
* wrong type;
* invalid UUID;
* invalid SourceVersion;
* invalid checksum;
* inconsistent media type;
* mismatched PublicationId;
* mismatched MasterLibraryId;
* mismatched SourceVersion.

Every invalid response shall be rejected safely.

---

# 173. Degraded Compatibility Tests

Tests shall prove the client enables only the safe subset.

Examples:

```text
no catalog search
→ browse remains enabled

no Range support
→ full download remains enabled

cover format unsupported
→ placeholder used

Library read-only
→ Reader enabled, admin writes disabled
```

---

# 174. Upgrade Tests

Tests shall verify:

* server patch upgrade remains compatible;
* optional capability addition remains compatible;
* minimum client increase rejects older clients;
* API major addition does not break v1;
* v1 removal follows deprecation policy;
* client upgrade reuses trusted server identity.

---

# 175. Migration Tests

Tests shall verify:

* directly compatible Library opens;
* migratable Library enters maintenance and migrates;
* migration failure blocks readiness;
* unsupported Library remains untouched;
* migrated identity remains stable;
* CatalogRevision semantics remain valid.

---

# 176. OpenAPI Requirements

OpenAPI and generated documentation shall describe:

* supported API version;
* minimum client-version behavior;
* authentication methods;
* capabilities;
* compatibility-related errors;
* extensible response enums;
* required response fields;
* fallback-safe optional fields.

---

# 177. Generated Client Requirements

Generated Swift models shall support:

* unknown enums;
* unknown error codes;
* unknown capabilities;
* optional additive fields;
* safe response validation;
* raw-value preservation.

---

# 178. Compatibility Completion Gate

This document is complete when:

```text
[ ] Compatibility status values are frozen
[ ] CompatibilityResult is defined
[ ] CompatibilityIssue is defined
[ ] Compatibility scopes are defined
[ ] Evaluation phases are defined
[ ] Transport compatibility is defined
[ ] Trust compatibility is defined
[ ] API compatibility is defined
[ ] ContractRevision compatibility is defined
[ ] ClientVersion compatibility is defined
[ ] Authentication compatibility is defined
[ ] Pairing compatibility is defined
[ ] MasterLibraryId compatibility is defined
[ ] Library-format compatibility is defined
[ ] Database-schema compatibility is defined
[ ] Operation compatibility is defined
[ ] Capability compatibility is defined
[ ] Catalog compatibility is defined
[ ] Pagination compatibility is defined
[ ] Publication-detail compatibility is defined
[ ] Publication-format compatibility is defined
[ ] Cover compatibility is defined
[ ] Checksum compatibility is defined
[ ] Full-transfer compatibility is defined
[ ] Range compatibility is defined
[ ] Administration compatibility is defined
[ ] Resource compatibility is defined
[ ] Local client compatibility is defined
[ ] Evaluation order is defined
[ ] Degraded operation is defined
[ ] Blocking issues are defined
[ ] Recovery actions are defined
[ ] Error codes are defined
[ ] Cache invalidation is defined
[ ] Offline behavior is defined
[ ] Upgrade behavior is defined
[ ] Migration behavior is defined
[ ] Backup compatibility is defined
[ ] Logging and metrics are defined
[ ] Fixtures are defined
[ ] Testing obligations are defined
[ ] Personal-state independence is preserved
[ ] Local payload independence is preserved
[ ] No architectural contradiction remains
```

---

# 179. Compatibility Invariants

The following invariants apply:

* Compatibility is multidimensional.
* Compatibility is operation-specific.
* Reachability does not imply compatibility.
* Trust is evaluated before credentials are transmitted.
* ServerId mismatch blocks the existing registration.
* MasterLibraryId mismatch prevents cache merging.
* API compatibility is not inferred from ServerVersion.
* Authentication compatibility is distinct from credential validity.
* Capability support is distinct from authorization.
* Health is distinct from compatibility.
* Availability is distinct from compatibility.
* Integrity is distinct from format compatibility.
* Unknown values never map to successful states.
* Unsupported source formats may still allow metadata display.
* Missing Range support does not block full transfer.
* Unsupported checksum blocks acquisition validation.
* Read-only Library compatibility may preserve Reader operations.
* Remote incompatibility does not invalidate valid local content.
* Client upgrades preserve local personal state.
* Server upgrades preserve stable identities.
* Unsupported persistent formats are never mutated.
* Compatibility results are derived and replaceable.

---

# 180. Prohibited Compatibility Designs

The module shall not:

* infer compatibility from one version number;
* infer trust from endpoint reachability;
* send credentials before identity verification;
* treat unknown values as supported;
* treat capabilities as authorization;
* treat a revoked credential as API incompatibility;
* treat temporary unavailability as permanent incompatibility;
* treat an unsupported cover format as publication incompatibility;
* skip checksum validation because the source format is supported;
* resume downloads without Range compatibility;
* merge caches across MasterLibraryId values;
* mutate unsupported Library formats;
* write to unsupported database schemas;
* silently downgrade API versions;
* silently change authentication methods;
* delete valid local publications after remote incompatibility;
* discard annotations or reading progress during client migration;
* expose secrets or physical paths in compatibility evidence;
* claim full compatibility when mandatory evidence is unknown.

---

# 181. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `Authentication.md`
* `ErrorContracts.md`
* `Pagination.md`
* `ServerContracts.md`
* `HealthContracts.md`
* `CatalogContracts.md`
* `PublicationContracts.md`
* `AcquisitionContracts.md`
* `AdministrationContracts.md`
* `Versioning.md`

## Domain

* `../03-Domain/DomainModel.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`
* `../03-Domain/Errors.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`
* `../02-TechnicalDesign/ErrorModel.md`

## Future Persistence

* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/Migrations.md`
* `../05-Persistence/ClientSchema.md`
* `../05-Persistence/SourceStorageLayout.md`

---

# 182. Status

**Approved**

The complete Master Library compatibility model is frozen as:

```text
trust compatibility
+
API compatibility
+
contract compatibility
+
client compatibility
+
authentication compatibility
+
capability compatibility
+
Master Library compatibility
+
resource compatibility
+
transfer compatibility
+
local client compatibility
```

The `04-Contracts` block is complete.

The next implementation block is:

```text
01-MasterLibrary/05-Persistence/
```

It shall define the complete persistence model for:

```text
server catalog database
server identity storage
Master Library manifest
source storage layout
cover storage
staging storage
device and credential persistence
audit persistence
migration persistence
client catalog cache
client Local Library
client acquisition persistence
recovery markers
```
