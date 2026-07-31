
# Master Library Contract Versioning

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Versioning

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the versioning model governing the Master Library public contracts.

It establishes:

* API versioning;
* contract versioning;
* server application versioning;
* client application versioning;
* Master Library format versioning;
* database schema versioning;
* source versioning;
* catalog revisioning;
* record versioning;
* cursor format versioning;
* error-registry evolution;
* capability evolution;
* backward compatibility;
* breaking-change classification;
* deprecation;
* migration;
* version negotiation;
* release obligations;
* testing requirements.

KnowledgeOS contains several independent version dimensions.

They shall never be collapsed into one generic `version` value.

---

# 2. Scope

This document applies to:

* public HTTP endpoints;
* OpenAPI schemas;
* request models;
* response models;
* public headers;
* public error codes;
* public enumeration values;
* authentication contracts;
* catalog contracts;
* publication contracts;
* acquisition contracts;
* administrative contracts;
* generated TypeScript models;
* generated Swift models;
* server-client compatibility;
* Master Library persistence compatibility.

---

# 3. Core Versioning Principle

> Every version dimension shall identify one specific type of change and one specific compatibility boundary.

The complementary principle is:

> A change in one version dimension shall not automatically require changes in every other version dimension.

---

# 4. Version Dimensions

KnowledgeOS Master Library defines the following distinct dimensions:

```text
ApiVersion

ContractRevision

ServerVersion

ClientVersion

MasterLibraryFormatVersion

DatabaseSchemaVersion

SourceVersion

CatalogRevision

RecordVersion

CursorFormatVersion

ErrorRegistryRevision

CapabilitySetRevision
```

Not every dimension must be exposed through every endpoint.

---

# 5. Version Dimension Overview

| Dimension                  | Identifies                                  | Scope                     |
| -------------------------- | ------------------------------------------- | ------------------------- |
| ApiVersion                 | Public network contract major version       | HTTP API                  |
| ContractRevision           | Compatible evolution inside one API version | OpenAPI and documentation |
| ServerVersion              | KnowledgeOS Server release                  | Server application        |
| ClientVersion              | KnowledgeOS client release                  | macOS, iPhone, iPad       |
| MasterLibraryFormatVersion | Persistent Master Library format            | NAS Library               |
| DatabaseSchemaVersion      | Database migration level                    | Server persistence        |
| SourceVersion              | Exact publication payload generation        | One Publication           |
| CatalogRevision            | Catalog-visible authoritative state         | One Master Library        |
| RecordVersion              | Optimistic concurrency state                | One mutable record        |
| CursorFormatVersion        | Internal signed-cursor format               | Pagination cursor         |
| ErrorRegistryRevision      | Public error-registry generation            | Error contract            |
| CapabilitySetRevision      | Capability-definition generation            | Server capabilities       |

---

# 6. Prohibited Generic Version Fields

Public contracts shall not expose an ambiguous field such as:

```json
{
  "version": 3
}
```

unless the surrounding schema makes its meaning unambiguous.

Preferred fields include:

```text
apiVersion
serverVersion
clientVersion
formatVersion
schemaVersion
sourceVersion
catalogRevision
recordVersion
cursorVersion
```

---

# 7. API Version

The initial API version is:

```text
v1
```

It appears in the public base path:

```text
/v1
```

Examples:

```text
GET /v1/server
GET /v1/catalog
GET /v1/publications/{publicationId}
```

---

# 8. API Version Meaning

ApiVersion identifies the major public network contract.

It governs:

* endpoint paths;
* HTTP method semantics;
* request schemas;
* response schemas;
* required headers;
* authentication semantics;
* error-envelope structure;
* binary-transfer semantics;
* compatibility expectations.

---

# 9. API Major Version

A new API major version is required when a breaking public network change cannot be safely represented within the current contract.

Example:

```text
/v1
/v2
```

The server may support more than one API major version during a migration period.

---

# 10. Path-Based Versioning

The approved API versioning strategy is:

```text
path-based major versioning
```

Example:

```text
/v1/catalog
```

Header-only version negotiation is not the primary mechanism.

---

# 11. Why Path-Based Versioning Is Selected

Path versioning provides:

* explicit routing;
* clear diagnostics;
* straightforward OpenAPI generation;
* easy client configuration;
* predictable server coexistence;
* simple proxy and logging behavior;
* visible breaking boundaries.

---

# 12. Supported API Versions

The server shall advertise:

```json
{
  "supportedApiVersions": [
    "v1"
  ]
}
```

The current path version shall appear in the advertised set.

---

# 13. API Version Negotiation

The client shall:

1. retrieve the ServerDescriptor;
2. inspect `supportedApiVersions`;
3. select the highest mutually supported API version;
4. construct the corresponding versioned base URL;
5. reject the server when no compatible API version exists.

---

# 14. No Silent Version Fallback

A client configured for `/v2` shall not silently fall back to `/v1` unless it has an explicit compatible `/v1` implementation.

The fallback decision belongs to the client compatibility layer.

---

# 15. Unsupported API Version

An unsupported API version shall produce:

```text
API_VERSION_UNSUPPORTED
```

HTTP:

```text
412 Precondition Failed
```

or:

```text
404 Not Found
```

when routing infrastructure cannot identify the requested version.

The preferred KnowledgeOS-aware response is:

```text
412 Precondition Failed
```

with the standard error envelope.

---

# 16. ContractRevision

ContractRevision identifies compatible contract evolution within one ApiVersion.

Example:

```text
ApiVersion = v1
ContractRevision = 1.4
```

It may represent:

* new optional fields;
* new optional endpoints;
* new optional capabilities;
* clarified constraints;
* additional error codes;
* expanded compatible enums.

---

# 17. ContractRevision Representation

The recommended representation is:

```text
major.minor
```

Example:

```json
{
  "contractRevision": "1.4"
}
```

The major component aligns conceptually with ApiVersion.

---

# 18. ContractRevision Exposure

The server may expose:

```text
X-KnowledgeOS-Contract-Revision
```

and may include it in ServerDescriptor.

It is primarily diagnostic and compatibility metadata.

---

# 19. ContractRevision Rules

Within `v1`:

* compatible additions increment the minor ContractRevision;
* documentation-only corrections may increment a patch-level repository revision without changing the public value;
* breaking changes require `v2`.

---

# 20. OpenAPI Version

The OpenAPI document shall contain:

```yaml
info:
  version: 1.0.0
```

This value represents the published contract artifact version.

It shall remain aligned with:

* ApiVersion;
* ContractRevision;
* release documentation.

---

# 21. ServerVersion

ServerVersion identifies the deployed KnowledgeOS Server application release.

Example:

```text
1.3.2
```

It shall follow Semantic Versioning-compatible syntax.

---

# 22. ServerVersion Semantics

Recommended interpretation:

```text
MAJOR.MINOR.PATCH
```

## MAJOR

Potentially incompatible server application evolution.

## MINOR

Backward-compatible feature release.

## PATCH

Backward-compatible fixes.

ServerVersion does not replace ApiVersion.

---

# 23. ServerVersion and ApiVersion

The following is valid:

```text
ServerVersion 1.5.0
supports ApiVersion v1
```

The following may also be valid:

```text
ServerVersion 2.0.0
supports ApiVersion v1 and v2
```

Application major versions and API major versions are independent.

---

# 24. ClientVersion

Each client exposes its application version.

Examples:

```text
macOS client 1.2.0
iPhone client 1.1.0
iPad client 1.1.0
```

Clients send:

```text
X-KnowledgeOS-Client-Version
```

---

# 25. Platform-Specific Versions

Different Apple clients may evolve at different release speeds.

The server compatibility policy may define minimum versions per platform.

Conceptually:

```json
{
  "minimumClientVersions": {
    "macOS": "1.0.0",
    "iOS": "1.0.0",
    "iPadOS": "1.0.0"
  }
}
```

The initial simplified contract may expose one minimumClientVersion when all platforms share the same minimum.

---

# 26. ClientVersion Is Not Authorization

ClientVersion supports compatibility evaluation.

It shall not:

* replace credentials;
* grant Administrator access;
* identify a Device;
* prove software authenticity.

---

# 27. MasterLibraryFormatVersion

MasterLibraryFormatVersion identifies the persistent logical and physical structure of the NAS-hosted Master Library.

Example:

```text
1.0
```

It governs:

* manifest format;
* required directories;
* catalog persistence expectations;
* source-storage conventions;
* recovery markers;
* required structural invariants.

---

# 28. MasterLibraryFormatVersion Representation

The approved representation is:

```text
major.minor
```

Example:

```json
{
  "formatVersion": "1.0"
}
```

---

# 29. Format-Version Major Change

A major format change indicates potentially incompatible persistent structure.

Example:

```text
1.0 → 2.0
```

This requires:

* explicit migration;
* compatible server runtime;
* backup;
* rollback or recovery strategy;
* maintenance mode;
* migration tests.

---

# 30. Format-Version Minor Change

A minor format change may introduce backward-compatible optional structures.

Example:

```text
1.0 → 1.1
```

An older server may still reject it unless compatibility has been explicitly guaranteed.

---

# 31. Format Compatibility

The server shall define:

```text
minimumReadableFormatVersion
maximumReadableFormatVersion
maximumWritableFormatVersion
```

Conceptually:

```json
{
  "libraryFormatCompatibility": {
    "minimumReadable": "1.0",
    "maximumReadable": "1.1",
    "maximumWritable": "1.0"
  }
}
```

---

# 32. Read Compatibility

A server may support read-only access to a newer compatible format while refusing mutation.

This shall be explicit.

Possible result:

```text
Library = DEGRADED
Reader operations = allowed
Administrative mutation = blocked
```

---

# 33. Write Compatibility

The server shall write only formats it explicitly supports.

It shall not mutate an unknown or partially understood format.

---

# 34. Unsupported Format

An unsupported Library format produces:

```text
MASTER_LIBRARY_VERSION_UNSUPPORTED
```

The Library state becomes:

```text
UNSUPPORTED
```

Ordinary mutation is prohibited.

---

# 35. DatabaseSchemaVersion

DatabaseSchemaVersion identifies the active server catalog-database migration level.

Example:

```text
17
```

It is an integer.

---

# 36. Schema Version Scope

DatabaseSchemaVersion applies to:

* server catalog tables;
* source metadata tables;
* device and credential tables;
* administrative audit tables;
* indexes;
* migration state.

It does not apply to the client local database.

---

# 37. Client Database Schema Version

Each client may maintain its own independent local persistence schema version.

Conceptually:

```text
ClientDatabaseSchemaVersion
```

It shall not be exposed as the server DatabaseSchemaVersion.

---

# 38. Database Migration

Database migrations shall be:

* ordered;
* deterministic;
* restart-safe where practical;
* tested from every supported prior version;
* executed during maintenance or startup;
* backed by recovery evidence.

---

# 39. Migration Transactionality

When supported, schema migrations shall execute transactionally.

When filesystem and database changes are combined, explicit recovery markers are required.

---

# 40. Forward Schema Compatibility

An older server shall not write to a newer unknown schema.

It shall enter:

```text
UNSUPPORTED
```

or:

```text
INVALID
```

according to the detected condition.

---

# 41. SourceVersion

SourceVersion identifies one immutable source payload within one Publication.

Example:

```text
1
2
3
```

Rules:

* positive integer;
* monotonically increasing;
* never reused;
* never decremented;
* scoped to PublicationId;
* immutable after commit.

---

# 42. SourceVersion Change

SourceVersion advances when the authoritative source payload changes.

Examples:

* corrected PDF;
* higher-quality PDF;
* rescanned document;
* replacement source;
* changed binary representation.

---

# 43. SourceVersion Non-Change

SourceVersion does not advance for:

* title update;
* description update;
* subject update;
* contributor update;
* cover replacement;
* availability change;
* withdrawal;
* restoration.

---

# 44. SourceVersion Gaps

SourceVersion values may contain gaps when a staged or reserved version fails before activation.

Example:

```text
1
2
4
```

The contract shall not require contiguous values.

The invariant is monotonic uniqueness, not contiguity.

---

# 45. SourceVersion Rollback

The current source may be administratively changed to a prior committed source only through an explicit rollback contract.

The SourceVersion identifier itself does not decrease or change.

If rollback is supported, the current source pointer may reference an existing older SourceVersion.

Module 1 does not require source rollback.

---

# 46. CatalogRevision

CatalogRevision identifies one catalog-visible authoritative state.

Rules:

* non-negative integer;
* scoped to MasterLibraryId;
* monotonically increasing during normal operation;
* changed atomically with catalog-visible mutation;
* required in catalog responses.

---

# 47. CatalogRevision Advancement

CatalogRevision advances for:

* publication registration;
* metadata update;
* source activation;
* availability change;
* withdrawal;
* restoration;
* cover update;
* catalog-visible repair.

---

# 48. CatalogRevision Non-Advancement

CatalogRevision does not advance for:

* catalog reads;
* publication download;
* local acquisition;
* device-local deletion;
* annotations;
* progress;
* personal state;
* health polling;
* authentication use;
* background metrics.

---

# 49. CatalogRevision and Restore

A restored backup may expose a lower CatalogRevision than previously observed.

This is not ordinary revision evolution.

The client shall treat it as a restore event and rebuild derived catalog state.

---

# 50. CatalogRevision Overflow

The persistence implementation shall use a sufficiently wide integer.

The public contract uses int64 semantics within the safe interoperable range.

Operational safeguards shall prevent overflow.

---

# 51. RecordVersion

RecordVersion supports optimistic concurrency for mutable administrative resources.

Example:

```json
{
  "recordVersion": 7
}
```

---

# 52. RecordVersion Scope

RecordVersion may apply to:

* Publication metadata;
* Device administrative state;
* Library configuration;
* pairing resources;
* other mutable records.

It is not SourceVersion.

It is not CatalogRevision.

---

# 53. Optimistic Concurrency

Administrative mutation requests may include:

```text
expectedRecordVersion
```

or:

```text
If-Match
```

When the expected version differs from current authority:

```text
PUBLICATION_RECORD_VERSION_CONFLICT
```

or another resource-specific conflict is returned.

---

# 54. RecordVersion Advancement

RecordVersion advances whenever the associated mutable record changes.

It may advance for changes that also advance CatalogRevision.

The two values remain independent.

---

# 55. CursorFormatVersion

CursorFormatVersion identifies the internal signed-cursor payload format.

Example:

```text
1
```

It is embedded inside the opaque cursor.

---

# 56. Cursor Version Is Internal

Clients shall not inspect CursorFormatVersion.

An unsupported cursor format produces:

```text
CATALOG_CURSOR_INVALID
```

The client restarts pagination.

---

# 57. Cursor Compatibility

The server may temporarily accept several cursor formats during deployment.

It is not required to preserve cursors across major server upgrades.

Clients already support restart.

---

# 58. ErrorRegistryRevision

ErrorRegistryRevision identifies the published generation of stable public errors.

Example:

```text
1.3
```

It supports:

* generated TypeScript types;
* generated Swift wrappers;
* OpenAPI documentation;
* fixture generation;
* error-reference documentation.

---

# 59. Adding Error Codes

Adding a new error code within v1 is compatible when clients:

* preserve unknown codes;
* use safe fallback behavior;
* do not crash;
* do not automatically retry unknown failures.

---

# 60. Changing Error Meaning

Changing the meaning of an existing stable code is breaking.

A new code shall be created instead.

---

# 61. Removing Error Codes

An error code may be deprecated but shall not be removed while supported clients rely on it.

Removal normally requires a new ApiVersion or a completed deprecation period with proven compatibility.

---

# 62. CapabilitySetRevision

CapabilitySetRevision identifies the generation of the capability registry.

The server primarily advertises actual capability values.

The registry revision is optional diagnostic metadata.

---

# 63. Adding Capabilities

Adding an optional capability is compatible.

Unknown optional capabilities shall be ignored by older clients.

---

# 64. Removing Capabilities

Removing an optional capability may be operationally compatible but can affect features.

Removing a previously mandatory capability is breaking for dependent clients.

---

# 65. Renaming Capabilities

Capability names are stable public identifiers.

Renaming a capability requires:

* new capability value;
* deprecation of old value;
* transition period;
* compatibility mapping.

Silent renaming is prohibited.

---

# 66. Public Enum Evolution

Public enums shall be treated as extensible response sets where documented.

Examples:

* capabilities;
* error codes;
* health component codes;
* publication types;
* contributor roles.

---

# 67. Request Enum Strictness

Clients shall send only known supported request enum values.

The server rejects unknown request values.

---

# 68. Response Enum Extensibility

Clients shall safely handle unknown response values.

Unknown values shall not become:

```text
AVAILABLE
HEALTHY
AUTHENTICATED
COMPLETED
AUTHORIZED
```

---

# 69. Compatible Changes

The following are normally backward-compatible inside `v1`:

* adding an optional response field;
* adding an optional request field with defined default;
* adding a new endpoint;
* adding a new optional capability;
* adding a new error code;
* adding a new optional health component;
* adding a new optional response enum value with safe client handling;
* increasing server implementation performance;
* clarifying documentation without semantic change;
* adding optional response headers.

---

# 70. Conditionally Compatible Changes

The following require explicit review:

* increasing maximum lengths;
* increasing page-size maximum;
* adding new searchable fields;
* adding new sort values;
* adding new publication formats;
* adding new authentication methods;
* changing caching headers;
* changing default catalog visibility;
* changing retryability classification;
* adding required security headers.

They may be compatible but can change observable behavior.

---

# 71. Breaking Changes

The following are breaking:

* removing an endpoint;
* changing an endpoint path;
* changing an HTTP method;
* removing a required field;
* renaming a field;
* changing field meaning;
* changing identifier representation;
* changing SourceVersion semantics;
* changing CatalogRevision semantics;
* changing checksum representation;
* changing binary-transfer semantics;
* changing default authentication method incompatibly;
* making an optional request field required;
* changing enum meaning;
* changing error-code meaning;
* changing default catalog visibility incompatibly;
* changing cursor behavior so existing clients cannot restart safely;
* changing personal-state boundaries.

---

# 72. Breaking Change Response

A breaking change requires one of:

```text
new ApiVersion
```

or:

```text
explicit compatibility adapter
```

The default is a new ApiVersion.

---

# 73. Additive Field Rules

A newly added response field shall:

* be optional for older clients;
* have a clear default interpretation when absent;
* not alter existing field meaning;
* not require immediate client upgrade.

---

# 74. Required Field Introduction

A field required in server responses may be added compatibly only when older clients ignore unknown fields and do not require its semantic meaning.

For new client requests, the server shall continue accepting older valid request shapes during the supported transition period.

---

# 75. Field Removal

A field shall not be removed directly.

The sequence is:

```text
active
→ deprecated
→ optional transitional absence where safe
→ removed in new ApiVersion
```

---

# 76. Field Renaming

Field renaming is implemented through:

1. add new field;
2. retain old field;
3. define precedence;
4. deprecate old field;
5. remove old field only in a breaking version.

---

# 77. Field Semantic Change

A field shall never retain its name while changing to an incompatible meaning.

A new field or new ApiVersion is required.

---

# 78. Default Value Changes

Changing a default may be breaking even when the schema is unchanged.

Examples:

* default page size;
* default catalog sort;
* default visibility;
* default retry policy;
* default pairing-code lifetime.

Default changes require explicit compatibility review.

---

# 79. Current Frozen Defaults

The v1 contract freezes:

```text
default pageSize = 50
maximum pageSize = 100
default catalog sort = TITLE_ASC
default catalog visibility excludes WITHDRAWN
pairing-code default lifetime = 600 seconds
single-range acquisition only
checksum algorithm = sha-256
```

---

# 80. Deprecation

Deprecation provides a controlled transition away from a public contract element.

Deprecated elements remain functional during their support window unless security requires emergency removal.

---

# 81. Deprecation Metadata

A deprecated element shall define:

```text
deprecatedSince
replacement
minimumSupportedUntil
plannedRemovalVersion
migrationGuidance
```

---

# 82. OpenAPI Deprecation

Deprecated operations and fields shall use:

```yaml
deprecated: true
```

OpenAPI descriptions shall identify the replacement.

---

# 83. Deprecation Header

The server may use standard or KnowledgeOS-specific headers such as:

```text
Deprecation
Sunset
Link
```

where useful.

Raw dates shall follow standard HTTP date formatting.

---

# 84. Deprecation Period

The default minimum deprecation period should cover at least:

* one stable client release cycle;
* one server release cycle;
* the minimum supported client update window.

Exact duration belongs to release policy.

---

# 85. Emergency Removal

A contract may be removed before the normal deprecation period only for a critical security or integrity defect.

The release shall document:

* affected versions;
* reason;
* migration path;
* required client update.

---

# 86. Versioned OpenAPI Artifacts

The repository should retain:

```text
openapi/
├── v1/
│   ├── knowledgeos-master-library-v1.yaml
│   ├── changelog.md
│   └── components/
└── v2/
```

when additional major versions exist.

---

# 87. Contract Changelog

Every contract release shall record:

```text
added
changed
deprecated
removed
fixed
security
```

The changelog shall distinguish:

* compatible changes;
* breaking changes;
* documentation corrections.

---

# 88. Generated Client Versioning

Generated TypeScript and Swift transport packages shall include:

* ApiVersion;
* contract artifact version;
* generation timestamp or source commit;
* compatible server range where defined.

---

# 89. Generated Client Package Version

Generated packages may use Semantic Versioning.

A breaking generated API change requires a package major version even when caused by a new ApiVersion.

---

# 90. Generated Model Stability

Generated transport models may change when optional fields are added.

Application and Domain layers shall remain protected by mapping adapters.

This prevents contract additions from propagating uncontrolled changes through the entire client.

---

# 91. Server Multi-Version Support

A server may support:

```text
/v1
/v2
```

simultaneously.

Each version shall have:

* independent routing;
* independent OpenAPI contract;
* explicit mapping;
* dedicated contract tests;
* isolated deprecation policy.

---

# 92. Shared Internal Application Layer

Several API versions may map into the same Application use cases.

The Transport layer owns version-specific request and response translation.

Domain rules shall not depend on the API version.

---

# 93. Version Adapter

Conceptually:

```text
v1 Transport DTO
    ↓
v1 Mapper
    ↓
Application Request
    ↓
Application Result
    ↓
v1 Response Mapper
```

A future v2 uses its own mappers.

---

# 94. No Version Logic in Domain

The Domain layer shall not contain conditions such as:

```text
if apiVersion == v1
```

Public compatibility belongs to Transport and Application boundaries.

---

# 95. Client Multi-Version Support

A client may implement more than one API version.

It shall select one version per registered server connection.

It shall not mix endpoint versions inside one logical request workflow unless explicitly designed.

---

# 96. Version Selection Persistence

The client may persist the selected ApiVersion in ServerRegistration.

It shall re-evaluate compatibility after server upgrades or descriptor changes.

---

# 97. Version Upgrade Workflow

Recommended client workflow:

```text
retrieve ServerDescriptor
    ↓
compare supported ApiVersions
    ↓
select highest mutually supported
    ↓
compare contract capabilities
    ↓
persist selected version
    ↓
execute version-specific transport
```

---

# 98. Server Upgrade Workflow

A server upgrade shall:

1. validate persistent identity;
2. validate Master Library format;
3. validate database schema;
4. run supported migrations;
5. validate capability registry;
6. expose supported API versions;
7. execute contract smoke tests;
8. enter readiness only after success.

---

# 99. Master Library Format Migration

A format migration shall:

* require Administrator authority;
* enter maintenance;
* create or verify backup;
* persist migration marker;
* run deterministic steps;
* validate final structure;
* update formatVersion only after success;
* support recovery after interruption.

---

# 100. Database Schema Migration

Schema migration order shall be:

```text
current schema detected
    ↓
supported migration path resolved
    ↓
backup or recovery evidence
    ↓
maintenance state
    ↓
migrations executed
    ↓
schema validated
    ↓
server readiness restored
```

---

# 101. Migration Failure

Migration failure produces:

```text
MIGRATION_FAILED
```

The Library or Server remains unavailable until recovery.

The version shall not be advanced prematurely.

---

# 102. Migration Idempotency

Migration steps shall be safe to detect and resume or fail deterministically after interruption.

Migration history shall be recorded.

---

# 103. Downgrade

Server downgrade is not assumed safe.

An older server shall refuse:

* newer unsupported Library format;
* newer unsupported database schema;
* unknown required persistent structures.

---

# 104. Downgrade Protection

Downgrade detection shall produce:

```text
MASTER_LIBRARY_VERSION_UNSUPPORTED
```

or:

```text
DATABASE_SCHEMA_VERSION_UNSUPPORTED
```

No write shall occur.

---

# 105. Backup Version Metadata

A server backup shall preserve:

```text
ServerVersion at backup
MasterLibraryFormatVersion
DatabaseSchemaVersion
ServerId
MasterLibraryId
CatalogRevision
migration history
```

---

# 106. Restore Compatibility

Before restore, the server shall determine whether the backup is:

```text
READABLE
MIGRATABLE
UNSUPPORTED
INVALID
```

---

# 107. Restore to Newer Runtime

A newer compatible runtime may restore and migrate an older backup.

The original backup shall remain unchanged.

---

# 108. Restore to Older Runtime

An older runtime shall reject a newer unsupported backup.

It shall not attempt destructive normalization.

---

# 109. Contract Fixture Versioning

Fixtures shall be versioned with the public contract.

Example:

```text
fixtures/
└── v1/
    ├── server/
    ├── catalog/
    ├── publication/
    ├── acquisition/
    └── errors/
```

---

# 110. Fixture Compatibility

A compatible contract addition may add fixtures without invalidating prior valid fixtures.

Breaking schema changes require new-version fixtures.

---

# 111. Contract Test Matrix

Required test dimensions:

```text
current client ↔ current server
current client ↔ minimum supported server
minimum supported client ↔ current server
v1 client ↔ dual-version server
unsupported client ↔ current server
current client ↔ unsupported API server
current server ↔ old Library format
current server ↔ migratable schema
current server ↔ unsupported newer schema
```

---

# 112. Backward Compatibility Tests

Tests shall prove that a new server release still accepts all valid requests from the minimum supported client.

---

# 113. Forward Compatibility Tests

Tests shall prove that an older supported client:

* ignores new optional fields;
* handles new optional capabilities;
* handles unknown error codes;
* handles unknown response enum values safely;
* does not map unknown values to success.

---

# 114. Breaking Change Detection

CI should compare OpenAPI versions using a contract-diff tool.

The pipeline shall detect:

* removed paths;
* changed methods;
* removed fields;
* requiredness changes;
* enum restrictions;
* response-code removals;
* incompatible schema changes.

---

# 115. Contract Diff Classification

Every detected change shall be classified as:

```text
COMPATIBLE
CONDITIONALLY_COMPATIBLE
BREAKING
DOCUMENTATION_ONLY
```

A breaking change shall fail the v1 release pipeline unless explicitly approved as v2.

---

# 116. Version Test Fixtures

Required fixtures include:

```text
server-version-compatible.json
server-version-too-old.json
client-version-too-old.json
api-version-unsupported.json
library-format-compatible.json
library-format-migratable.json
library-format-unsupported.json
schema-version-migration-required.json
schema-version-unsupported.json
unknown-capability.json
unknown-error-code.json
unknown-enum-value.json
deprecated-field.json
```

---

# 117. Release Gates

A contract release shall not be approved until:

```text
OpenAPI validates
contract diff classified
generated clients compile
server contract tests pass
Swift decoding tests pass
compatibility matrix passes
deprecations documented
changelog updated
migration tests pass where required
no personal-state boundary changed
no identity semantic changed unintentionally
```

---

# 118. Version Metadata Logging

Safe version log fields include:

```text
apiVersion
contractRevision
serverVersion
clientVersion
clientPlatform
formatVersion
schemaVersion
cursorVersion
compatibilityResult
```

---

# 119. Version Logging Prohibitions

Logs shall not include:

* credentials;
* pairing codes;
* secrets;
* complete personal state;
* physical paths;
* arbitrary client-provided version strings without validation.

---

# 120. Version Metrics

Recommended metrics:

```text
api_requests_total{api_version}
client_requests_total{client_major_version,platform}
compatibility_failures_total{reason}
library_format_state_total{format_major}
schema_migrations_total{result}
deprecated_contract_usage_total{element}
unsupported_api_requests_total{api_version}
```

Labels shall remain bounded.

---

# 121. Security Versioning

Security-sensitive changes may require:

* minimumClientVersion increase;
* credential rotation;
* authentication method deprecation;
* API endpoint removal;
* emergency patch release;
* server readiness restriction.

---

# 122. Minimum Client Version

The server may expose:

```text
minimumClientVersion
```

Clients below this version may receive:

```text
CLIENT_VERSION_UNSUPPORTED
```

---

# 123. Minimum Version Change

Increasing minimumClientVersion is operationally breaking for older clients.

It shall require:

* explicit release note;
* compatibility justification;
* upgrade path;
* appropriate notice unless caused by urgent security risk.

---

# 124. Recommended Client Version

The server may expose:

```text
recommendedClientVersion
```

This does not block operation.

It supports non-critical upgrade guidance.

---

# 125. Version Comparison Rules

ServerVersion and ClientVersion comparison shall use a semantic-version parser.

Lexical string comparison is prohibited.

Incorrect:

```text
"1.10.0" < "1.2.0"
```

Correct semantic comparison recognizes:

```text
1.10.0 > 1.2.0
```

---

# 126. Pre-Release Versions

Pre-release clients and servers may use:

```text
1.2.0-beta.1
```

Production compatibility policy may reject pre-release builds unless explicitly enabled.

---

# 127. Build Metadata

Build metadata may use:

```text
1.2.0+build.45
```

Build metadata shall not affect semantic compatibility ordering.

---

# 128. Version Validation

All public version fields shall be validated before use.

Invalid values shall not enter compatibility decisions.

---

# 129. Unknown Version Data

If required version metadata is absent or malformed, the client shall enter:

```text
UNKNOWN
```

or:

```text
INCOMPATIBLE
```

according to safety requirements.

It shall not assume compatibility.

---

# 130. Personal-State Boundary Versioning

The Master Library API shall not introduce personal-state fields as a compatible additive change.

Adding server-side personal-state synchronization would alter the architectural boundary and requires:

* explicit architecture amendment;
* separate contracts;
* privacy review;
* compatibility review;
* likely new module or API surface.

---

# 131. Payload Replication Boundary Versioning

Automatically replicating publication payloads through iCloud is not a compatible implementation detail.

It would change storage and synchronization semantics and requires an explicit architectural decision.

---

# 132. Identity Semantic Stability

The meanings of:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
CatalogRevision
```

are frozen within V3.

Changing any of these meanings is an architectural breaking change.

---

# 133. Checksum Semantic Stability

Within v1:

```text
sha-256
```

describes the complete authoritative unencoded source payload.

Changing this meaning is breaking.

Adding another explicitly identified checksum algorithm may be compatible after capability negotiation.

---

# 134. Binary Transfer Stability

The v1 acquisition contract freezes:

```text
full GET
single byte Range
exact SourceVersion
Content-Length
Content-Range
ETag
SHA-256 metadata
```

Changing to server-selected latest source or multi-source transfer is breaking.

---

# 135. Version Completion Gate

This document is complete when:

```text
[ ] All version dimensions are identified
[ ] ApiVersion is defined
[ ] ContractRevision is defined
[ ] ServerVersion is defined
[ ] ClientVersion is defined
[ ] MasterLibraryFormatVersion is defined
[ ] DatabaseSchemaVersion is defined
[ ] SourceVersion is defined
[ ] CatalogRevision is defined
[ ] RecordVersion is defined
[ ] CursorFormatVersion is defined
[ ] ErrorRegistryRevision is defined
[ ] Capability evolution is defined
[ ] Compatible changes are classified
[ ] Breaking changes are classified
[ ] Deprecation is defined
[ ] OpenAPI versioning is defined
[ ] Generated-client versioning is defined
[ ] Multi-version server behavior is defined
[ ] Client negotiation is defined
[ ] Migration behavior is defined
[ ] Downgrade protection is defined
[ ] Backup compatibility is defined
[ ] Contract diff requirements are defined
[ ] Release gates are defined
[ ] Security versioning is defined
[ ] Minimum client version is defined
[ ] Identity semantics are frozen
[ ] Personal-state boundary is preserved
[ ] Acquisition semantics are preserved
[ ] Testing obligations are defined
[ ] No architectural contradiction remains
```

---

# 136. Versioning Invariants

The following invariants apply:

* ApiVersion identifies the public network major contract.
* ServerVersion does not replace ApiVersion.
* ClientVersion does not identify a Device.
* MasterLibraryFormatVersion does not equal DatabaseSchemaVersion.
* SourceVersion is Publication-scoped.
* CatalogRevision is MasterLibrary-scoped.
* RecordVersion is resource-scoped.
* CursorFormatVersion is internal and opaque.
* Version dimensions are never collapsed ambiguously.
* Compatible additions do not change existing meaning.
* Existing stable error codes retain one meaning.
* Existing capability names retain one meaning.
* Breaking changes require a new API version or explicit adapter.
* Unsupported persistent formats are never mutated.
* Migrations advance versions only after successful completion.
* Unknown response enum values never map to success.
* Identity semantics remain stable.
* Personal-state boundaries remain unchanged.
* Publication payload acquisition remains exact and deterministic.

---

# 137. Prohibited Versioning Designs

The module shall not:

* use one generic version for every concern;
* infer API compatibility from ServerVersion alone;
* infer authorization from ClientVersion;
* reuse SourceVersion values;
* decrement SourceVersion;
* change CatalogRevision without catalog-visible mutation;
* mutate unknown Library formats;
* write to unsupported newer schemas;
* silently rename public fields;
* silently change field meanings;
* silently change error meanings;
* silently rename capabilities;
* remove contract elements without deprecation;
* compare semantic versions lexically;
* assume unknown versions are compatible;
* place API-version conditionals in Domain entities;
* introduce NAS personal-state synchronization as an additive field;
* change Publication identity semantics inside v1;
* change checksum semantics inside v1;
* silently substitute source versions during acquisition.

---

# 138. Related Documents

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
* `Compatibility.md`

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

## Future Persistence

* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/Migrations.md`
* `../05-Persistence/SourceStorageLayout.md`
* `../05-Persistence/ClientSchema.md`

---

# 139. Status

**Approved**

The Master Library versioning model is frozen as a set of independent compatibility dimensions:

```text
ApiVersion
+
ContractRevision
+
ServerVersion
+
ClientVersion
+
MasterLibraryFormatVersion
+
DatabaseSchemaVersion
+
SourceVersion
+
CatalogRevision
+
RecordVersion
+
CursorFormatVersion
```

The next and final contract document is:

```text
01-MasterLibrary/04-Contracts/Compatibility.md
```

It shall define the complete compatibility evaluation between:

```text
client
server
API contract
authentication method
capabilities
Master Library format
database state
publication source format
```


---

# Architecture Alignment (V3.1)

## Purpose

This document defines the versioning strategy for publications, Knowledge
Objects, personal knowledge and derived artifacts.

## Version Categories

KnowledgeOS distinguishes four independent version domains:

1. Publication Versions
2. Knowledge Object Versions
3. Personal Knowledge Versions
4. Derived Artifact Versions

These version domains evolve independently.

## Publication Versions

Managed exclusively by the Master Library.

Characteristics:

- immutable release history
- canonical identifiers
- checksum validation
- source provenance

## Knowledge Object Versions

Track structural and semantic evolution.

Each version records:

- identifier
- parent version
- creation timestamp
- originating publication
- compatibility level

## Personal Knowledge Versions

Versioned independently from publications.

Examples:

- annotations
- notes
- highlights
- reading progress
- AI conversations

Synchronization merges personal versions without modifying publication versions.

## Derived Artifact Versions

Applies to:

- UDM
- DPM
- OCR
- embeddings
- indexes
- thumbnails

Derived artifacts include:

- producing engine
- engine version
- processing parameters
- generation timestamp

Artifacts are disposable and rebuildable.

## Compatibility

A newer derived artifact may coexist with older publication versions provided
that canonical identifiers remain stable.

## Invariants

- Publication history is immutable.
- Personal history never rewrites publication history.
- Version identifiers are globally unique.
- Derived versions never become canonical.
- Previous versions remain traceable.

## Related Documents

- KnowledgeObject.md
- Provenance.md
- Metadata.md
- KnowledgeLifecycle.md
- DomainModel.md
