

# Master Library Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the contract layer of the Master Library Module.

The contract layer establishes the stable communication boundary between:

* KnowledgeOS Server;
* the macOS client;
* future iPhone and iPad clients;
* administrative tools;
* automated tests;
* future compatible clients.

The contracts define:

* transport semantics;
* request and response models;
* public identifiers;
* authentication;
* authorization context;
* pagination;
* catalog operations;
* publication operations;
* acquisition metadata;
* server identity;
* health reporting;
* public errors;
* API versioning;
* compatibility behavior.

The contract layer shall remain independent from internal persistence and Domain implementation details.

---

# 2. Scope

The contract layer covers:

```text
KnowledgeOS Client
        ↓
Versioned API Contract
        ↓
KnowledgeOS Server
        ↓
Master Catalog and Publication Delivery
```

It defines the communication required to:

* identify the server;
* establish trust;
* pair a device;
* authenticate a registered device;
* inspect server capabilities;
* inspect Master Library information;
* browse the Master Catalog;
* search the Master Catalog;
* retrieve publication details;
* retrieve covers;
* acquire publication payloads;
* detect source updates;
* inspect server and Library health;
* perform approved administrative operations;
* report stable errors.

---

# 3. Explicit Exclusions

The Master Library contract layer does not define:

* annotation synchronization;
* reading-progress synchronization;
* personal-tag synchronization;
* favorite synchronization;
* personal-relationship synchronization;
* CloudKit records;
* iCloud replication;
* cross-device personal-state conflict resolution;
* UDM synchronization;
* DPM synchronization;
* AI contracts;
* Plugin contracts.

Publication acquisition and personal-state synchronization are separate architectural concerns.

---

# 4. Contract Authority

The contract layer is constrained by:

1. Architecture V3.0;
2. Architecture Amendment V3.0-001;
3. ADR-013;
4. Master Library Requirements;
5. Master Library Technical Design;
6. Master Library Domain;
7. Master Library Error Model;
8. Technology Decisions.

A public contract shall not expose behavior prohibited by those authorities.

---

# 5. Contract Principles

All Master Library contracts shall follow these principles:

1. Contracts are versioned.
2. Contracts are explicit.
3. Contracts are stable.
4. Contracts are bounded.
5. Contracts are transport-safe.
6. Contracts expose no physical paths.
7. Contracts expose no persistence records.
8. Contracts expose no framework types.
9. Contracts contain no personal state.
10. Contracts distinguish remote and local authority.
11. Contracts support future Apple clients.
12. Unknown compatible values fail safely.
13. Public errors use stable codes.
14. Publication payload transfer remains stream-oriented.
15. OpenAPI is the transport-contract source of truth.

---

# 6. Contract Directory

The approved contract documentation structure is:

```text
04-Contracts/
├── README.md
├── APIConventions.md
├── CommonTypes.md
├── Authentication.md
├── ErrorContracts.md
├── Pagination.md
├── ServerContracts.md
├── HealthContracts.md
├── CatalogContracts.md
├── PublicationContracts.md
├── AcquisitionContracts.md
├── AdministrationContracts.md
├── Versioning.md
└── Compatibility.md
```

---

# 7. Document Responsibilities

## APIConventions.md

Defines:

* API base path;
* HTTP methods;
* media types;
* headers;
* JSON conventions;
* naming;
* identifier representation;
* timestamp representation;
* request correlation;
* idempotency;
* content negotiation;
* response conventions;
* streaming conventions;
* Range conventions.

## CommonTypes.md

Defines reusable public types:

* identifiers;
* versions;
* revisions;
* checksums;
* byte lengths;
* timestamps;
* metadata values;
* availability values;
* capabilities;
* public enums.

## Authentication.md

Defines:

* server trust bootstrap;
* pairing;
* device registration;
* opaque credentials;
* authentication headers;
* role exposure;
* credential revocation;
* authentication failures.

## ErrorContracts.md

Defines:

* public error envelope;
* stable module error codes;
* safe details;
* request correlation;
* retry hints;
* HTTP mappings;
* unknown-error handling.

## Pagination.md

Defines:

* cursor-based pagination;
* page size;
* continuation cursor;
* deterministic sorting;
* cursor invalidation;
* revision-aware paging.

## ServerContracts.md

Defines:

* server identity;
* server capabilities;
* Master Library identity;
* supported API versions;
* supported source formats;
* server trust information.

## HealthContracts.md

Defines:

* liveness;
* readiness;
* server state;
* Master Library state;
* catalog availability;
* storage availability;
* degraded-state reporting.

## CatalogContracts.md

Defines:

* catalog list requests;
* catalog search requests;
* catalog filters;
* catalog entries;
* CatalogRevision;
* catalog snapshots;
* remote availability.

## PublicationContracts.md

Defines:

* publication details;
* source versions;
* cover information;
* source integrity metadata;
* content-delivery metadata;
* publication availability.

## AcquisitionContracts.md

Defines:

* acquisition preparation;
* exact SourceVersion selection;
* content transfer headers;
* Range requests;
* checksum metadata;
* byte-length metadata;
* update detection;
* retry and resume preconditions.

## AdministrationContracts.md

Defines protected administrative contracts for:

* Master Library initialization;
* publication registration;
* metadata updates;
* source replacement;
* availability changes;
* withdrawal;
* integrity validation.

## Versioning.md

Defines:

* API versioning;
* contract versioning;
* backward compatibility;
* breaking changes;
* deprecation;
* schema evolution.

## Compatibility.md

Defines:

* client-server compatibility;
* API compatibility;
* Master Library compatibility;
* capability negotiation;
* unsupported-value behavior;
* minimum supported versions.

---

# 8. Contract Layers

The Master Library communication boundary has four contract levels:

```text
Transport Contract
Application Contract
Domain Mapping Contract
Persistence Mapping Contract
```

Only the first two are public.

---

# 9. Transport Contract

The Transport Contract defines:

* URL paths;
* HTTP methods;
* headers;
* JSON schemas;
* binary response behavior;
* status codes;
* authentication scheme;
* public error envelope.

Its source of truth is OpenAPI.

---

# 10. Application Contract

The Application Contract defines the semantic request and response models consumed by application services.

Examples:

```text
ListCatalogRequest
ListCatalogResult
GetPublicationDetailsRequest
GetPublicationDetailsResult
PreparePublicationDeliveryResult
RegisterPublicationRequest
```

These models may be represented differently in TypeScript and Swift.

Their meaning shall remain equivalent.

---

# 11. Domain Mapping Contract

The Domain Mapping Contract defines how public values become validated Domain values.

Example:

```text
JSON publicationId
        ↓
PublicationId validation
        ↓
Domain PublicationId
```

Transport input shall never be trusted directly.

---

# 12. Persistence Mapping Contract

Persistence records map independently to Domain entities.

The public API shall not expose:

* database row identifiers;
* table names;
* join-table structure;
* Drizzle schema shape;
* GRDB record shape;
* migration metadata;
* physical storage paths.

---

# 13. Contract Source of Truth

The approved transport source of truth is:

```text
OpenAPI 3.1
```

The implementation shall maintain a machine-readable OpenAPI document containing:

* paths;
* methods;
* parameters;
* request bodies;
* response bodies;
* schemas;
* headers;
* authentication;
* error responses;
* binary content responses.

---

# 14. OpenAPI Location

The implementation should place the contract under:

```text
packages/api-contract/
├── openapi/
│   ├── knowledgeos-master-library-v1.yaml
│   └── components/
├── fixtures/
├── generated/
└── tests/
```

The exact physical layout may vary while preserving responsibility separation.

---

# 15. Contract-First Rule

The API shall be implemented contract-first for public behavior.

The preferred workflow is:

```text
Define or update contract
        ↓
Review compatibility
        ↓
Validate OpenAPI
        ↓
Generate or update transport models
        ↓
Implement server behavior
        ↓
Implement client behavior
        ↓
Run contract tests
```

Server implementation alone shall not silently redefine the contract.

---

# 16. Contract Version

The initial public API version is:

```text
v1
```

The base path is:

```text
/v1
```

The version identifies the public network contract.

It is independent from:

* server application version;
* client application version;
* Master Library format version;
* server database schema version;
* client database schema version.

---

# 17. Base Resource Groups

The initial API resource groups are:

```text
/v1/health
/v1/server
/v1/auth
/v1/library
/v1/catalog
/v1/publications
/v1/admin
```

---

# 18. Baseline Endpoint Overview

The baseline contract direction is:

```text
GET    /v1/health
GET    /v1/server
GET    /v1/library

POST   /v1/auth/pair
POST   /v1/auth/authenticate
POST   /v1/auth/revoke

GET    /v1/catalog
GET    /v1/catalog/revision
GET    /v1/publications/{publicationId}
GET    /v1/publications/{publicationId}/cover
GET    /v1/publications/{publicationId}/content

POST   /v1/admin/library/initialize
POST   /v1/admin/library/validate

POST   /v1/admin/publications
PATCH  /v1/admin/publications/{publicationId}
POST   /v1/admin/publications/{publicationId}/versions
POST   /v1/admin/publications/{publicationId}/availability
POST   /v1/admin/publications/{publicationId}/withdraw
```

The detailed endpoint contracts belong in the corresponding documents.

---

# 19. Public Contract Naming

JSON fields shall use:

```text
camelCase
```

Examples:

```json
{
  "publicationId": "...",
  "sourceVersion": 2,
  "catalogRevision": 42
}
```

Public error codes and state enum values shall use:

```text
UPPER_SNAKE_CASE
```

Examples:

```text
AVAILABLE
SOURCE_VERSION_NOT_FOUND
RECOVERY_REQUIRED
```

---

# 20. Identifier Representation

Public identifiers shall use canonical lowercase UUID strings.

Examples:

```json
{
  "serverId": "2dd75ee9-82dc-437e-9fe1-9d05e16fe34f",
  "masterLibraryId": "dba7ee1f-f2d1-4998-b1d1-a1c739761205",
  "publicationId": "ea42916c-0280-4a39-9557-42f31b8dd08d"
}
```

Clients shall treat identifiers as opaque.

---

# 21. Numeric Values

The contracts shall use integer semantics for:

* SourceVersion;
* CatalogRevision;
* ByteLength;
* byte ranges;
* page sizes.

Values shall remain within the safe interoperable range between TypeScript, JSON and Swift.

No floating-point representation shall be used for byte counts or revisions.

---

# 22. Timestamp Representation

Public timestamps shall use RFC 3339 UTC strings.

Example:

```json
{
  "createdAt": "2026-07-15T18:30:00Z"
}
```

Clients may display timestamps in local time.

The public authoritative value remains UTC.

---

# 23. Optional Values

Absent optional values shall use:

```json
null
```

or field omission according to the specific schema.

The contract shall define one behavior per field.

Empty strings shall not represent absent metadata unless explicitly specified.

---

# 24. Enum Representation

Public enumerations shall use stable strings.

Example:

```json
{
  "availability": "AVAILABLE"
}
```

Clients shall not depend on ordinal positions.

---

# 25. Unknown Enum Handling

Clients shall handle unknown future enum values safely.

An unknown value shall:

* not crash decoding;
* not map to success;
* not map to availability;
* enter an unsupported or unknown state;
* preserve safe raw value for diagnostics where practical.

---

# 26. Checksum Contract

Checksum values shall use:

```json
{
  "algorithm": "sha-256",
  "value": "64-character-lowercase-hexadecimal-digest"
}
```

The contract shall reject:

* unsupported algorithms;
* invalid digest length;
* non-hexadecimal digest values;
* mixed representations.

---

# 27. Byte-Length Contract

Payload byte length shall use:

```json
{
  "byteLength": 73400320
}
```

The value represents exact bytes.

It is not:

* kilobytes;
* megabytes;
* a formatted display string.

---

# 28. Publication-Date Contract

Publication dates shall preserve precision.

Examples:

```json
{
  "publicationDate": "2026"
}
```

```json
{
  "publicationDate": "2026-07"
}
```

```json
{
  "publicationDate": "2026-07-15"
}
```

The client shall not invent missing month or day values.

---

# 29. Response Envelope Policy

Ordinary successful resource responses may return the resource body directly.

Example:

```json
{
  "publicationId": "...",
  "title": "Example"
}
```

Collection responses shall use explicit envelopes containing:

* items;
* page information;
* CatalogRevision where applicable.

---

# 30. Collection Response Shape

Conceptually:

```json
{
  "items": [],
  "page": {
    "nextCursor": null,
    "hasMore": false
  },
  "catalogRevision": 42
}
```

---

# 31. Error Envelope

All public JSON errors shall use a stable envelope.

Conceptually:

```json
{
  "error": {
    "code": "PUBLICATION_NOT_FOUND",
    "message": "The requested publication does not exist.",
    "requestId": "5e3833c6-a1ee-4d91-bfd6-a8ae5fab4436",
    "retryable": false,
    "details": {
      "publicationId": "..."
    }
  }
}
```

---

# 32. Public Error Message Rule

The server `message` shall be:

* safe;
* concise;
* non-sensitive;
* language-neutral enough for diagnostics.

The final localized UI message belongs to the client.

---

# 33. Request Correlation

Every server request shall have a RequestId.

The server shall:

* accept a valid client-provided correlation header where approved;
* generate a RequestId when absent;
* return the RequestId in errors;
* include it in structured logs.

The final header name shall be defined in `APIConventions.md`.

---

# 34. Authentication Contract

Protected endpoints shall use:

```text
Authorization: Bearer <opaque-device-credential>
```

The credential is:

* opaque;
* revocable;
* device-specific;
* stored hashed on the server;
* stored in Keychain on Apple clients.

The contract shall not expose credential hashes.

---

# 35. Pairing Contract

Pairing shall establish:

* server trust;
* client DeviceId;
* device display information;
* assigned role;
* opaque credential.

A pairing code shall be:

* short-lived;
* single-use or bounded-use;
* generated under administrator authority;
* transported only over the trusted secure connection.

---

# 36. Authorization Contract

The public role model is:

```text
READER
ADMINISTRATOR
```

The server shall enforce roles.

Client UI visibility is not authorization.

---

# 37. Server Identity Contract

The server shall expose a stable identity document containing at least:

```text
ServerId
display name
API versions
server application version
server fingerprint information
capabilities
```

ServerEndpoint shall not be treated as ServerId.

---

# 38. Master Library Identity Contract

The server shall expose:

```text
MasterLibraryId
Master Library name
format version
CatalogRevision
Library state
```

A client shall isolate cached data by:

```text
ServerId
+
MasterLibraryId
```

---

# 39. Capability Contract

The server shall advertise supported capabilities.

Initial examples:

```text
CATALOG_BROWSE
CATALOG_SEARCH
PUBLICATION_DOWNLOAD
SINGLE_RANGE_DOWNLOAD
DEVICE_PAIRING
ADMIN_PUBLICATION_REGISTRATION
ADMIN_SOURCE_REPLACEMENT
FULL_INTEGRITY_VALIDATION
```

Capabilities shall not be inferred only from server version.

---

# 40. Capability Negotiation

The client shall:

1. retrieve server capabilities;
2. compare them with required client behavior;
3. disable unsupported optional features;
4. reject incompatible mandatory capability sets;
5. avoid invoking unsupported endpoints blindly.

---

# 41. Catalog Contract Boundary

Catalog contracts expose remote authority only.

They may expose:

* PublicationId;
* master metadata;
* remote availability;
* current SourceVersion;
* source format;
* source ByteLength;
* cover information.

They shall not expose:

* device-local availability;
* acquisition state;
* local file paths;
* personal state.

The client computes local projections independently.

---

# 42. Publication Detail Contract Boundary

Publication details shall expose:

* stable publication identity;
* authoritative metadata;
* remote availability;
* current source metadata;
* source-version information;
* cover information;
* allowed remote actions where useful.

They shall not claim that the publication exists on the requesting device.

---

# 43. Acquisition Contract Boundary

The server does not own the complete client AcquisitionOperation.

The server contract provides the information needed to execute acquisition:

* exact PublicationId;
* exact SourceVersion;
* media type;
* ByteLength;
* Checksum;
* Range support;
* content endpoint;
* availability.

The client owns:

* operation state;
* Attempt state;
* staging;
* progress persistence;
* validation;
* installation;
* local completion.

---

# 44. Content Delivery Contract

Publication content shall use a binary HTTP response.

It shall not be embedded as:

* JSON Base64;
* database record;
* multipart response without explicit need;
* whole-file memory object.

---

# 45. Content Response Metadata

Content responses shall provide authoritative metadata through approved headers.

Required metadata includes:

* PublicationId context;
* SourceVersion;
* Content-Type;
* Content-Length;
* Checksum algorithm;
* Checksum value;
* Accept-Ranges where supported;
* ETag or equivalent version identity where selected.

---

# 46. Range Contract

The initial server supports one byte range.

Example:

```text
Range: bytes=1048576-
```

The server may return:

```text
206 Partial Content
```

with:

```text
Content-Range
Content-Length
SourceVersion
Checksum metadata
```

Multiple ranges are not required.

---

# 47. Resume Contract

Resume is allowed only when the client confirms:

* same ServerId;
* same MasterLibraryId;
* same PublicationId;
* same SourceVersion;
* same ByteLength;
* same Checksum;
* valid local staging length;
* server Range capability.

A changed source context requires restart from zero.

---

# 48. Catalog Pagination Contract

Catalog pagination shall use opaque cursors.

The client shall not:

* parse cursor internals;
* modify cursors;
* reuse cursors with different filters;
* reuse cursors under another MasterLibraryId.

---

# 49. Catalog Revision Contract

Catalog responses shall expose CatalogRevision.

The client may use it to determine whether its snapshot is current.

CatalogRevision does not change for:

* local acquisition;
* local removal;
* annotations;
* personal state;
* iCloud synchronization.

---

# 50. Administrative Contract Boundary

Administrative contracts shall remain separate from Reader contracts.

Administrative requests shall require:

* authentication;
* Administrator role;
* explicit validation;
* audit evidence;
* bounded payloads;
* stable error responses.

---

# 51. Publication Registration Contract

Registration shall accept:

* publication metadata;
* source PDF;
* optional cover;
* optional idempotency key.

The source may use:

* multipart upload;
* approved staged-upload flow;
* server-local administrative import.

The final transport mechanism shall be defined in `AdministrationContracts.md`.

---

# 52. Personal-State Prohibition

No Master Library public schema shall contain fields for:

```text
annotation
readingProgress
personalTag
favorite
personalRelationship
personalNote
cloudKitRecord
iCloudSyncState
```

Contract tests shall verify this absence.

---

# 53. Physical-Path Prohibition

Public schemas shall not expose:

* NAS root;
* absolute source path;
* container mount path;
* database file path;
* staging path;
* quarantine path;
* client Application Support path.

Logical references may remain server-internal unless explicitly needed.

---

# 54. Framework-Type Prohibition

Contracts shall not expose:

* NestJS DTO classes as contract authority;
* Fastify request types;
* Drizzle records;
* Node.js stream types;
* SwiftUI models;
* GRDB records;
* URLSession task types.

Public schemas remain technology-neutral.

---

# 55. Contract Generation Policy

Generated Swift code may include:

* request models;
* response models;
* transport enums;
* API-client scaffolding.

Generated code shall remain in a dedicated target or directory.

It shall not become the client Domain model automatically.

---

# 56. Generated Model Mapping

The client flow shall remain:

```text
Generated Transport Model
        ↓
Validation and Mapping
        ↓
Client Domain Model
```

This preserves:

* unknown-value handling;
* Domain validation;
* presentation independence;
* testability.

---

# 57. Contract Fixture Policy

The contract package shall contain deterministic fixtures for:

* server identity;
* Master Library identity;
* catalog page;
* publication details;
* publication availability;
* checksum;
* content headers;
* authentication success;
* authentication failure;
* error envelope;
* unknown enum values.

---

# 58. Contract Test Categories

Required contract tests include:

```text
OpenAPI syntax validation
schema validation
server response validation
client decoding
unknown enum handling
error-code validation
pagination validation
binary-header validation
authentication validation
personal-state exclusion
physical-path exclusion
```

---

# 59. Server Contract Tests

The server shall prove that:

* every implemented endpoint exists in OpenAPI;
* response bodies match schemas;
* error bodies match the error envelope;
* authentication requirements match contracts;
* admin endpoints enforce role requirements;
* binary responses expose required headers;
* undocumented public fields are not returned.

---

# 60. Client Contract Tests

The client shall prove that:

* generated or hand-written transport models decode valid fixtures;
* invalid required values are rejected;
* unknown compatible values do not crash;
* errors map to stable client errors;
* ByteLength and SourceVersion remain exact;
* catalog cursors remain opaque;
* server identity mismatch is handled safely.

---

# 61. Compatibility Test Matrix

Contract compatibility shall be tested across:

```text
current client ↔ current server
current client ↔ minimum supported server
minimum supported client ↔ current server
unknown optional capability
unknown enum value
deprecated field
new optional field
unsupported API version
```

---

# 62. Backward-Compatible Changes

Normally compatible changes include:

* adding optional response fields;
* adding optional request fields with defaults;
* adding new endpoints;
* adding optional capabilities;
* adding new error codes with safe unknown handling;
* adding new enum values when clients handle unknown values safely.

---

# 63. Breaking Changes

Breaking changes include:

* removing fields;
* renaming fields;
* changing field meaning;
* changing requiredness incompatibly;
* changing identifier representation;
* changing checksum representation;
* changing enum semantics;
* changing error-code meaning;
* changing binary transfer semantics;
* removing supported authentication behavior.

Breaking changes require:

* a new API version;
* or an explicit compatibility strategy.

---

# 64. Deprecation

Deprecated contract elements shall define:

* deprecation date;
* replacement;
* supported transition period;
* minimum compatible client;
* removal version.

Silent removal is prohibited.

---

# 65. Contract Security Rules

Contracts shall:

* require authentication on protected routes;
* require authorization on administrative routes;
* reject arbitrary paths;
* bound page sizes;
* bound metadata sizes;
* bound registration payloads;
* validate Range values;
* avoid secret exposure;
* avoid stack traces;
* use HTTPS in production.

---

# 66. Contract Privacy Rules

Contracts shall transmit only what the Master Library Module needs.

Permitted examples:

* device identity;
* server identity;
* publication identity;
* source-version identity;
* catalog filters;
* acquisition requests.

Prohibited examples:

* reading behavior;
* annotation content;
* personal graph data;
* private notes;
* personal tags;
* CloudKit identifiers.

---

# 67. Contract Performance Rules

Contracts shall support:

* bounded pagination;
* streaming publication content;
* optional cache validation;
* stable revision checks;
* minimal catalog projections;
* separate publication-detail retrieval;
* bounded error responses.

Large publication bytes shall not be included in catalog responses.

---

# 68. Contract Observability

Contracts shall expose sufficient diagnostic correlation through:

* RequestId;
* stable error code;
* safe operation context;
* server version;
* API version;
* capability information.

They shall not expose internal diagnostics directly.

---

# 69. Contract Ownership

The contract package is jointly owned by:

* server implementation;
* macOS client implementation;
* future Apple clients;
* contract tests.

No single consumer may redefine shared semantics unilaterally.

---

# 70. Change Workflow

Any public contract change shall follow:

```text
Propose change
    ↓
Classify compatibility
    ↓
Update documentation
    ↓
Update OpenAPI
    ↓
Update fixtures
    ↓
Update server tests
    ↓
Update client tests
    ↓
Generate affected models
    ↓
Approve change
```

---

# 71. Contract Review Questions

Every contract review shall verify:

```text
Does this expose Domain meaning correctly?
Does this expose infrastructure accidentally?
Is the request bounded?
Is authentication explicit?
Is authorization explicit?
Is compatibility preserved?
Can unknown values be handled safely?
Does it contain personal state?
Does it expose a physical path?
Can Swift decode it precisely?
Can TypeScript validate it at runtime?
Is the error behavior explicit?
```

---

# 72. Contract Documentation Status

Current state:

```text
README.md                    Approved
APIConventions.md            Pending
CommonTypes.md               Pending
Authentication.md            Pending
ErrorContracts.md            Pending
Pagination.md                Pending
ServerContracts.md           Pending
HealthContracts.md           Pending
CatalogContracts.md          Pending
PublicationContracts.md      Pending
AcquisitionContracts.md      Pending
AdministrationContracts.md   Pending
Versioning.md                Pending
Compatibility.md             Pending
```

---

# 73. Contract Completion Gate

The Contracts area is complete when:

```text
[ ] README.md is Approved
[ ] APIConventions.md is Approved
[ ] CommonTypes.md is Approved
[ ] Authentication.md is Approved
[ ] ErrorContracts.md is Approved
[ ] Pagination.md is Approved
[ ] ServerContracts.md is Approved
[ ] HealthContracts.md is Approved
[ ] CatalogContracts.md is Approved
[ ] PublicationContracts.md is Approved
[ ] AcquisitionContracts.md is Approved
[ ] AdministrationContracts.md is Approved
[ ] Versioning.md is Approved
[ ] Compatibility.md is Approved
[ ] OpenAPI source exists
[ ] OpenAPI validation passes
[ ] Public identifiers are frozen
[ ] Public enums are frozen
[ ] Public error envelope is frozen
[ ] Authentication contract is frozen
[ ] Catalog pagination is frozen
[ ] Content headers are frozen
[ ] Range behavior is frozen
[ ] Personal-state fields are absent
[ ] Physical paths are absent
[ ] TypeScript and Swift fixtures agree
[ ] No architectural contradiction remains
```

---

# 74. Contract Invariants

The following invariants apply:

* OpenAPI is the public transport source of truth.
* Contracts are independent from persistence.
* Contracts are independent from framework types.
* Public identifiers are opaque.
* SourceVersion identifies exact authoritative bytes.
* CatalogRevision identifies catalog-visible authority.
* Catalog contracts contain remote state only.
* Local availability belongs to the client.
* Acquisition workflow state belongs to the client.
* Publication bytes use streaming.
* Range resume preserves exact source identity.
* Public errors use stable codes.
* Authentication is device-based.
* Authorization is server-enforced.
* Production transport uses HTTPS.
* Personal state is absent.
* Physical paths are absent.
* Unknown values never become success silently.

---

# 75. Prohibited Contract Designs

The module shall not:

* expose database rows directly;
* expose NAS paths;
* expose client local paths;
* expose credentials or hashes;
* embed PDF files in JSON;
* return unbounded catalog collections;
* use numeric enum ordinals;
* mix remote and local availability;
* persist client acquisition state on the NAS;
* include CloudKit contracts;
* include annotation or progress fields;
* infer server identity from endpoint;
* use server application version as API version;
* change stable error meanings silently;
* require clients to parse opaque cursors;
* let generated transport models become Domain entities automatically.

---

# 76. Related Documents

## Contracts

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
* `Compatibility.md`

## Domain

* `../03-Domain/README.md`
* `../03-Domain/DomainModel.md`
* `../03-Domain/Entities.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`
* `../03-Domain/Errors.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 77. Status

**Approved**

The Master Library contract boundary is established.

The next document is:

```text
01-MasterLibrary/04-Contracts/APIConventions.md
```

It shall define the concrete HTTP, JSON, headers, identifiers, timestamps, correlation, idempotency, streaming and Range conventions used by every Master Library endpoint.`
