
# Master Library API Conventions

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** API Conventions

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the common HTTP and serialization conventions used by every public Master Library API endpoint.

It establishes:

* base URLs;
* API versioning;
* HTTP method semantics;
* resource naming;
* JSON conventions;
* header conventions;
* identifiers;
* timestamps;
* numerical values;
* optional fields;
* enumeration values;
* request correlation;
* idempotency;
* authentication headers;
* content negotiation;
* binary streaming;
* byte-range requests;
* cache validation;
* response semantics;
* error semantics;
* request limits;
* security constraints.

Every Master Library endpoint shall comply with these conventions unless a contract explicitly documents an approved exception.

---

# 2. Scope

These conventions apply to:

```text
/v1/health
/v1/server
/v1/library
/v1/auth
/v1/catalog
/v1/publications
/v1/admin
```

They apply to:

* KnowledgeOS Server;
* macOS client;
* future iPhone and iPad clients;
* administrative tools;
* generated clients;
* automated contract tests;
* integration tests.

---

# 3. Contract Authority

The authoritative transport specification is:

```text
OpenAPI 3.1
```

This document defines the semantic and stylistic rules that govern that specification.

When documentation and OpenAPI disagree:

1. the discrepancy is a contract defect;
2. implementation shall not guess;
3. the documents shall be reconciled;
4. no silent behavior change is allowed.

---

# 4. Production Transport

Production communication shall use:

```text
HTTPS
```

Plain HTTP is permitted only for explicitly configured development or test environments.

Production clients shall not silently downgrade from HTTPS to HTTP.

---

# 5. Base URL

The logical base URL is:

```text
https://<host>:<port>/v1
```

Examples:

```text
https://knowledgeos.local:8443/v1
https://192.168.1.50:8443/v1
```

The endpoint is not the server identity.

---

# 6. API Version Prefix

The initial API version prefix is:

```text
/v1
```

The version prefix shall appear in every public endpoint path except implementation-specific transport bootstrap mechanisms explicitly approved later.

Examples:

```text
/v1/server
/v1/catalog
/v1/publications/{publicationId}
```

---

# 7. Resource Naming

Resource names shall use:

```text
lowercase plural nouns
```

Examples:

```text
/publications
/devices
/versions
```

Approved singular resources represent one global contextual resource:

```text
/server
/library
/health
```

---

# 8. Path Naming

Paths shall use:

```text
lowercase kebab-case
```

Examples:

```text
/catalog
/publications
/source-versions
/integrity-validation
```

CamelCase and snake_case are prohibited in paths.

---

# 9. Path Parameters

Path parameters shall use camelCase names in the OpenAPI definition.

Example:

```text
/publications/{publicationId}
```

All path parameters shall be:

* required;
* validated;
* URL-safe;
* treated as opaque;
* independent from filesystem paths.

---

# 10. Query Parameters

Query parameters shall use:

```text
camelCase
```

Examples:

```text
?cursor=...
?pageSize=50
?query=biology
?language=es
?sort=TITLE_ASC
```

Unknown query parameters may be rejected or ignored according to endpoint-specific compatibility policy.

Security-sensitive endpoints should reject unknown parameters.

---

# 11. JSON Field Naming

JSON fields shall use:

```text
camelCase
```

Examples:

```json
{
  "publicationId": "...",
  "sourceVersion": 2,
  "catalogRevision": 18
}
```

Snake case and PascalCase are prohibited in public JSON.

---

# 12. HTTP Method Semantics

The API shall use HTTP methods according to their standard intent.

## GET

Retrieves state without causing authoritative mutation.

Examples:

```text
GET /v1/catalog
GET /v1/publications/{publicationId}
```

## POST

Creates a resource, starts an operation or invokes a non-idempotent command.

Examples:

```text
POST /v1/auth/pair
POST /v1/admin/publications
```

## PUT

Replaces one complete public resource representation only when full replacement semantics are explicit.

PUT is not required for the initial API.

## PATCH

Performs a partial mutation.

Example:

```text
PATCH /v1/admin/publications/{publicationId}
```

## DELETE

Removes or revokes a server-owned resource when deletion semantics are explicit.

The initial Master Library API shall prefer explicit command endpoints for withdrawal and revocation where historical identity must remain.

---

# 13. Safe Methods

The following methods are considered safe:

```text
GET
HEAD
OPTIONS
```

Safe methods shall not mutate authoritative Domain state.

Operational metrics and access logs may still change.

---

# 14. Idempotent Methods

The following are inherently expected to be idempotent:

```text
GET
PUT
DELETE
```

POST and PATCH are not assumed idempotent unless an idempotency mechanism is explicitly defined.

---

# 15. Request Content Type

JSON request bodies shall use:

```text
Content-Type: application/json
```

Character encoding is UTF-8.

Explicit charset parameters are optional.

---

# 16. JSON Response Content Type

JSON responses shall use:

```text
Content-Type: application/json
```

or:

```text
Content-Type: application/problem+json
```

only if the error contract later formally adopts RFC Problem Details.

The approved initial error contract uses the KnowledgeOS error envelope with `application/json`.

---

# 17. Binary Content Type

Publication payload responses shall use their authoritative media type.

Initial required value:

```text
Content-Type: application/pdf
```

Cover responses shall use their actual supported image media type.

---

# 18. Accept Header

Clients should send an appropriate `Accept` header.

Examples:

```text
Accept: application/json
Accept: application/pdf
Accept: image/*
```

If the endpoint cannot satisfy the requested representation, it shall return:

```text
406 Not Acceptable
```

where applicable.

---

# 19. Character Encoding

All JSON and textual representations shall use:

```text
UTF-8
```

The server shall not emit locale-dependent encodings.

---

# 20. Identifier Representation

Public identifiers shall use canonical lowercase UUID strings.

Example:

```json
{
  "publicationId": "e2858f49-4e2c-4707-b169-65a46f5fa293"
}
```

Identifiers shall be treated as opaque.

Clients shall not infer:

* creation time;
* storage location;
* type;
* ordering;
* server identity.

---

# 21. Identifier Validation

Invalid identifiers shall produce a validation error.

The server shall not:

* normalize arbitrary non-UUID values;
* interpret paths as identifiers;
* accept surrounding path components;
* expose internal numeric database keys.

---

# 22. SourceVersion Representation

`SourceVersion` shall use a positive JSON integer.

Example:

```json
{
  "sourceVersion": 3
}
```

Rules:

```text
sourceVersion >= 1
```

SourceVersion is meaningful only inside one Publication context.

---

# 23. CatalogRevision Representation

`CatalogRevision` shall use a non-negative JSON integer.

Example:

```json
{
  "catalogRevision": 42
}
```

Rules:

```text
catalogRevision >= 0
```

It is scoped to one MasterLibraryId.

---

# 24. Byte-Length Representation

Byte counts shall use exact integer values.

Example:

```json
{
  "byteLength": 73400320
}
```

They shall not use:

* decimal strings with units;
* floating-point values;
* formatted values such as `"70 MB"`.

Display formatting belongs to the client.

---

# 25. Integer Interoperability

All public integers shall remain inside the safe interoperable range supported by:

* JSON;
* JavaScript;
* TypeScript;
* Swift;
* SQLite.

If future payload or revision sizes exceed that range, the contract shall be versioned or changed to canonical decimal strings through an approved decision.

---

# 26. Boolean Representation

Boolean values shall use native JSON booleans.

Correct:

```json
{
  "hasMore": true
}
```

Incorrect:

```json
{
  "hasMore": "true"
}
```

---

# 27. Timestamp Representation

All exact timestamps shall use RFC 3339 UTC strings.

Example:

```json
{
  "createdAt": "2026-07-15T18:30:00Z"
}
```

The server shall normalize persisted timestamps to UTC before transport.

---

# 28. Timestamp Precision

The initial contract shall support at least millisecond precision where required.

Example:

```text
2026-07-15T18:30:00.125Z
```

Clients shall not depend on higher precision unless explicitly documented.

---

# 29. Date-Only Representation

Publication dates shall preserve their actual precision.

Allowed forms:

```text
YYYY
YYYY-MM
YYYY-MM-DD
```

Examples:

```json
{
  "publicationDate": "1998"
}
```

```json
{
  "publicationDate": "1998-11"
}
```

```json
{
  "publicationDate": "1998-11-23"
}
```

The server and client shall not invent missing date components.

---

# 30. Duration Representation

When a public duration is needed, it shall use either:

* an explicitly named integer unit;
* or ISO 8601 duration syntax.

Preferred bounded field example:

```json
{
  "retryAfterSeconds": 30
}
```

Ambiguous fields such as `timeout: 30` are prohibited.

---

# 31. Enumeration Representation

Enumerations shall use stable uppercase snake-case strings.

Examples:

```text
AVAILABLE
WITHDRAWN
RECOVERY_REQUIRED
CHECKSUM_MISMATCH
```

Numeric enum ordinals are prohibited.

---

# 32. Unknown Enumeration Values

Clients shall not assume the set of string values is permanently closed.

When an unknown value is received, clients shall:

1. preserve decoding safety;
2. avoid mapping it to success;
3. map it to a safe unsupported or unknown state;
4. disable unsafe actions;
5. retain the raw value for diagnostics where practical.

---

# 33. Nullability

A field may be:

* required and non-null;
* required and nullable;
* optional and non-null when present;
* optional and nullable.

Each schema shall choose explicitly.

The API shall avoid optional-plus-nullable unless there is a semantic distinction.

---

# 34. Absent Optional Values

For optional metadata, omission is preferred when the value is absent.

Example:

```json
{
  "title": "Example"
}
```

rather than:

```json
{
  "title": "Example",
  "subtitle": null
}
```

Nullable fields may still be used where generated-client compatibility or explicit clearing semantics require them.

---

# 35. Empty Strings

Empty strings shall not represent missing values unless explicitly documented.

Input normalization shall generally treat whitespace-only optional metadata as absent.

Mandatory strings shall reject empty normalized values.

---

# 36. Arrays

Arrays shall:

* preserve documented ordering;
* contain no null members unless explicitly permitted;
* be bounded where input-controlled;
* use an empty array rather than null for a known empty collection.

Example:

```json
{
  "subjects": []
}
```

---

# 37. Object Extensibility

Clients shall ignore unknown optional response fields unless security or schema rules require strict rejection.

Servers shall validate unknown request fields according to endpoint policy.

Administrative mutation endpoints should reject unknown fields to avoid silent configuration mistakes.

---

# 38. Collection Responses

Collection responses shall use a structured envelope.

Example:

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

Raw top-level arrays are prohibited for paginated resources.

---

# 39. Single-Resource Responses

Successful single-resource requests may return the resource directly.

Example:

```json
{
  "publicationId": "...",
  "title": "The Example Book",
  "availability": "AVAILABLE"
}
```

A generic `data` wrapper is not required.

---

# 40. Command Responses

A successful command may return:

* the resulting resource;
* an operation result;
* no body when appropriate.

The response shall not return an unstructured success string.

Incorrect:

```json
{
  "message": "Success"
}
```

Preferred:

```json
{
  "publicationId": "...",
  "availability": "WITHDRAWN",
  "catalogRevision": 43
}
```

---

# 41. Empty Successful Response

When no response body is required, the endpoint shall use:

```text
204 No Content
```

A 204 response shall not contain a body.

---

# 42. Creation Response

Successful resource creation shall normally use:

```text
201 Created
```

The response should include:

```text
Location
```

when a stable resource URL exists.

---

# 43. Accepted Asynchronous Operation

If a future administrative operation executes asynchronously, it shall use:

```text
202 Accepted
```

and return a stable operation resource.

The initial API shall not use 202 unless an observable operation contract exists.

---

# 44. Standard Successful Status Codes

Approved common success codes:

```text
200 OK
201 Created
204 No Content
206 Partial Content
```

Use of other success codes requires explicit endpoint documentation.

---

# 45. Standard Client Error Status Codes

Approved common client-error codes:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
406 Not Acceptable
409 Conflict
410 Gone
412 Precondition Failed
413 Content Too Large
415 Unsupported Media Type
416 Range Not Satisfiable
422 Unprocessable Content
429 Too Many Requests
```

---

# 46. Standard Server Error Status Codes

Approved common server-error codes:

```text
500 Internal Server Error
503 Service Unavailable
507 Insufficient Storage
```

Status codes shall be paired with a stable KnowledgeOS error code.

---

# 47. Error Envelope

All JSON error responses shall use:

```json
{
  "error": {
    "code": "PUBLICATION_NOT_FOUND",
    "message": "The requested publication does not exist.",
    "requestId": "0f5c26d6-75d8-442c-bb0a-a3526bea1d50",
    "retryable": false
  }
}
```

Optional safe details may be included:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid values.",
    "requestId": "...",
    "retryable": false,
    "details": {
      "fields": [
        {
          "field": "title",
          "code": "REQUIRED"
        }
      ]
    }
  }
}
```

---

# 48. Error Message Semantics

The server error `message` shall:

* be safe;
* avoid internal details;
* avoid stack traces;
* avoid SQL;
* avoid physical paths;
* avoid credentials;
* remain useful for diagnostics.

The client shall map error codes to final localized UI copy.

---

# 49. Retryable Field

The public error envelope may include:

```json
{
  "retryable": true
}
```

This field is advisory.

The client shall still apply:

* operation idempotency;
* security state;
* SourceVersion validation;
* local recovery rules.

---

# 50. Retry-After Header

For rate limits or temporary availability conditions, the server may return:

```text
Retry-After: <seconds>
```

The value shall use whole seconds or a valid HTTP date.

Whole seconds are preferred.

---

# 51. Request Identifier Header

The approved request identifier header is:

```text
X-Request-Id
```

Clients may provide a valid UUID value.

The server shall:

* validate it;
* generate one if absent or invalid according to policy;
* return it in the response;
* include it in logs.

---

# 52. Correlation Header

For a broader client operation correlation, the approved header is:

```text
X-Correlation-Id
```

Examples include:

* acquisition operation correlation;
* administrative workflow correlation;
* end-to-end test correlation.

`X-Correlation-Id` does not replace `X-Request-Id`.

---

# 53. Operation Identifier Header

Acquisition content requests may include:

```text
X-Acquisition-Operation-Id
```

This value is diagnostic and client-owned.

The server shall not treat it as authorization or idempotency authority.

---

# 54. Server Response Request ID

Every response should include:

```text
X-Request-Id
```

Every error response shall include the same identifier in the JSON envelope.

---

# 55. Idempotency Header

The approved idempotency header is:

```text
Idempotency-Key
```

It applies only to endpoints that explicitly support it.

Examples:

* publication registration;
* source replacement;
* selected administrative commands.

---

# 56. Idempotency-Key Rules

An Idempotency-Key shall be:

* opaque;
* non-empty;
* bounded;
* scoped to authenticated actor;
* scoped to endpoint and operation;
* retained for a documented period.

Recommended maximum length:

```text
128 characters
```

The final limit shall be enforced by the contract schema.

---

# 57. Idempotency Behavior

When the same valid key and semantically identical request are repeated, the server shall return the same logical result where possible.

When the same key is reused with a different request, the server shall return:

```text
409 Conflict
```

with an explicit error code.

---

# 58. Authentication Header

Protected endpoints shall use:

```text
Authorization: Bearer <opaque-device-credential>
```

The credential shall not be included in:

* query parameters;
* path parameters;
* request bodies;
* logs;
* error details.

---

# 59. Authentication Failures

Missing or invalid authentication shall return:

```text
401 Unauthorized
```

The server should include:

```text
WWW-Authenticate: Bearer
```

where appropriate.

---

# 60. Authorization Failures

An authenticated principal lacking permission shall receive:

```text
403 Forbidden
```

The server shall not disguise every authorization failure as not found unless an endpoint-specific security decision requires it.

---

# 61. Client Version Header

Clients shall send:

```text
X-KnowledgeOS-Client-Version
```

Example:

```text
X-KnowledgeOS-Client-Version: 1.0.0
```

This value supports compatibility evaluation.

It is not authorization evidence.

---

# 62. Client Platform Header

Clients may send:

```text
X-KnowledgeOS-Client-Platform
```

Initial values:

```text
macOS
iOS
iPadOS
```

The server shall not trust arbitrary platform claims for security decisions.

---

# 63. API Version Header

The path prefix remains the authoritative API major version.

The server may additionally return:

```text
X-KnowledgeOS-Api-Version: v1
```

for diagnostics and compatibility checks.

---

# 64. Server Version Header

The server may return:

```text
X-KnowledgeOS-Server-Version
```

This value is informational.

Clients shall use compatibility contracts and advertised capabilities rather than comparing version strings alone.

---

# 65. Master Library Context Header

Where useful for binary responses, the server may return:

```text
X-KnowledgeOS-Master-Library-Id
```

This allows the client to validate response context before committing a transfer.

---

# 66. Publication Context Headers

Publication content responses shall include:

```text
X-KnowledgeOS-Publication-Id
X-KnowledgeOS-Source-Version
```

The values shall match the requested exact resource context.

---

# 67. Checksum Headers

Publication content responses shall include:

```text
X-KnowledgeOS-Checksum-Algorithm
X-KnowledgeOS-Checksum
```

Initial values:

```text
X-KnowledgeOS-Checksum-Algorithm: sha-256
X-KnowledgeOS-Checksum: <64-character-lowercase-hex>
```

---

# 68. Content-Length

Full and partial publication responses shall provide a valid:

```text
Content-Length
```

For a full response, it represents the full response body length.

For a partial response, it represents the selected range length.

---

# 69. ETag

Publication content should use a strong ETag derived from immutable source identity.

The exact ETag representation shall not expose storage paths.

Example conceptual input:

```text
PublicationId
+
SourceVersion
+
Checksum
```

Clients shall treat ETag as opaque.

---

# 70. Conditional Requests

Where implemented, clients may use:

```text
If-None-Match
If-Match
If-Range
```

The precise endpoint behavior shall be defined in publication and acquisition contracts.

---

# 71. Cache-Control

Sensitive authentication and administrative responses shall normally use:

```text
Cache-Control: no-store
```

Catalog metadata may use controlled caching.

Publication content caching shall remain private and source-version aware.

---

# 72. Catalog Cache Policy

Catalog responses may return:

```text
ETag
Cache-Control
```

The client shall still use CatalogRevision as the authoritative catalog change indicator.

HTTP caching and CatalogRevision are complementary.

---

# 73. Binary Streaming

Publication payloads shall be streamed.

The server shall not:

* serialize PDF bytes into JSON;
* encode them as Base64;
* buffer complete large files in application memory;
* expose storage paths.

---

# 74. Full Content Request

A full publication request uses:

```text
GET /v1/publications/{publicationId}/content?sourceVersion=2
```

The exact SourceVersion shall be explicit.

Silently switching to another version is prohibited.

---

# 75. Range Request Header

Resumable transfer shall use:

```text
Range: bytes=<start>-<end?>
```

Examples:

```text
Range: bytes=1048576-
Range: bytes=1048576-2097151
```

---

# 76. Single-Range Support

The initial API supports one range per request.

Multiple ranges such as:

```text
Range: bytes=0-99,200-299
```

shall be rejected.

---

# 77. Partial Content Response

A valid range request shall return:

```text
206 Partial Content
```

Required headers include:

```text
Accept-Ranges: bytes
Content-Range
Content-Length
Content-Type
ETag
X-KnowledgeOS-Source-Version
X-KnowledgeOS-Checksum-Algorithm
X-KnowledgeOS-Checksum
```

---

# 78. Content-Range

Example:

```text
Content-Range: bytes 1048576-2097151/73400320
```

The total size shall match authoritative ByteLength.

---

# 79. Unsatisfiable Range

An invalid or unsatisfiable range shall return:

```text
416 Range Not Satisfiable
```

The response should include:

```text
Content-Range: bytes */<total-length>
```

and a KnowledgeOS error envelope when a JSON body is returned.

---

# 80. Range Source Validation

Before accepting resumed bytes, the client shall validate:

* ServerId;
* MasterLibraryId;
* PublicationId;
* SourceVersion;
* ByteLength;
* Checksum;
* ETag where used.

Any mismatch requires a full restart or explicit recovery.

---

# 81. If-Range

The client may use:

```text
If-Range: <etag>
```

If the source identity no longer matches, the server may return the complete representation or a conflict according to the frozen acquisition contract.

The Master Library contract shall prefer explicit conflict over silently changing SourceVersion.

---

# 82. HEAD Requests

The server may support:

```text
HEAD /v1/publications/{publicationId}/content
```

to retrieve content metadata without payload bytes.

If implemented, HEAD headers shall match the corresponding GET response metadata.

HEAD support is optional for the initial vertical unless required by `AcquisitionContracts.md`.

---

# 83. Request Body Limits

Every body-bearing endpoint shall define a maximum size.

Examples:

* JSON metadata;
* pairing requests;
* publication registration;
* cover upload;
* source PDF upload.

The server shall reject oversized bodies before uncontrolled buffering.

---

# 84. Metadata Limits

Contract schemas shall define maximum lengths for:

* title;
* subtitle;
* description;
* contributor names;
* subject names;
* publisher;
* search query;
* idempotency key.

Limits shall align with Domain and persistence validation.

---

# 85. Publication Upload Limits

The server shall define a configurable maximum publication source size.

The contract shall expose failure through:

```text
413 Content Too Large
```

or:

```text
507 Insufficient Storage
```

depending on the cause.

---

# 86. Pagination Limits

Catalog endpoints shall enforce:

```text
minimum page size
default page size
maximum page size
```

The approved initial direction is:

```text
default = 50
maximum = 100
```

Final values shall be frozen in `Pagination.md`.

---

# 87. Timeout Semantics

Timeouts are implementation and operational policy unless their result affects public behavior.

Public timeout-related failures shall use stable error codes.

Examples:

```text
CONNECTION_TIMEOUT
REQUEST_TIMEOUT
TRANSFER_TIMEOUT
```

The server shall not expose internal timeout configuration unless operationally required.

---

# 88. Retry Semantics

Clients may retry only when:

* the error is retryable;
* the operation is safe or idempotent;
* security identity remains trusted;
* authentication remains valid;
* SourceVersion remains unchanged;
* retry count is bounded.

---

# 89. Request Validation

Request validation shall occur before application execution.

Validation includes:

* path parameters;
* query parameters;
* headers;
* JSON body;
* multipart metadata;
* enumeration values;
* ranges;
* content type;
* content length.

---

# 90. Unknown JSON Fields

Reader requests may permit unknown optional fields only where compatibility requires it.

Administrative mutation requests shall default to strict unknown-field rejection.

This prevents misspelled administrative fields from being silently ignored.

---

# 91. Unsupported Media Type

A request with an unsupported `Content-Type` shall return:

```text
415 Unsupported Media Type
```

with a stable error envelope.

---

# 92. Malformed JSON

Malformed JSON shall return:

```text
400 Bad Request
```

with a stable validation error.

Raw parser errors shall not be exposed.

---

# 93. Semantic Validation

A syntactically valid request that violates Domain constraints shall return:

```text
422 Unprocessable Content
```

where appropriate.

Example:

* blank title;
* invalid publication date;
* unsupported source format;
* malformed checksum.

---

# 94. Conflict Semantics

A valid request conflicting with current authoritative state shall return:

```text
409 Conflict
```

Examples:

* duplicate idempotency key with different request;
* concurrent publication mutation;
* stale expected CatalogRevision;
* SourceVersion conflict.

---

# 95. Precondition Semantics

Failed explicit preconditions may return:

```text
412 Precondition Failed
```

Examples:

* unsupported client version;
* failed `If-Match`;
* incompatible API precondition.

---

# 96. Not Found Semantics

Unknown governed resources shall return:

```text
404 Not Found
```

Examples:

* PublicationId absent;
* SourceVersion absent;
* operation resource absent.

The response shall not expose database details.

---

# 97. Gone Semantics

A permanently withdrawn resource may return:

```text
410 Gone
```

when the endpoint-specific contract chooses to distinguish withdrawal from temporary unavailability.

---

# 98. Service Unavailable Semantics

Temporary server inability to safely provide a required capability shall return:

```text
503 Service Unavailable
```

Examples:

* Master Library unavailable;
* catalog unavailable;
* storage unavailable;
* maintenance restriction.

---

# 99. Insufficient Storage Semantics

Server-side insufficient storage shall return:

```text
507 Insufficient Storage
```

Client-local insufficient storage is detected and represented by the client rather than returned by the server.

---

# 100. Rate Limiting

Rate or concurrency limiting may return:

```text
429 Too Many Requests
```

The response should include:

```text
Retry-After
```

Rate limiting shall not be used as the only protection for authentication abuse.

---

# 101. Security Headers

The server should return appropriate security headers for HTTPS responses.

Potential headers include:

```text
Strict-Transport-Security
X-Content-Type-Options
Content-Security-Policy
```

Browser-oriented headers may be omitted from native-only endpoints when they provide no value, but HTTPS and content-type safety remain mandatory.

---

# 102. Server Header Minimization

The server should avoid exposing unnecessary runtime information through:

```text
Server
X-Powered-By
```

Framework-identifying headers shall be removed where practical.

---

# 103. CORS

The initial native-client API does not require broad cross-origin browser access.

CORS shall be disabled or restricted by default.

A future web client requires a separate approved CORS policy.

---

# 104. Compression

JSON responses may use HTTP compression.

Publication PDF payloads should not be recompressed automatically when the source format is already compressed and additional CPU cost provides little value.

Compression behavior shall not change checksum semantics.

Checksums describe the authoritative unencoded payload bytes.

---

# 105. Content-Encoding and Integrity

If transport content encoding is used, checksum metadata shall explicitly refer to the authoritative decoded source bytes.

The client shall validate the final stored payload against the authoritative checksum.

---

# 106. Logging Headers

The server may log safe correlation headers.

It shall never log:

```text
Authorization
pairing codes
opaque credentials
private keys
complete sensitive request bodies
```

---

# 107. Physical Path Prohibition

No request or response field shall accept or expose:

* absolute NAS paths;
* container mount paths;
* database paths;
* staging paths;
* client local paths.

Administrative local import tools may use server-local paths only through a separate trusted CLI contract, not the public Reader API.

---

# 108. Personal-State Prohibition

No Master Library request or response shall contain:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes;
* iCloud records;
* CloudKit identifiers.

Unknown administrative fields resembling personal state shall be rejected.

---

# 109. Contract Evolution

Compatible additions shall favor:

* optional response fields;
* optional capabilities;
* new endpoints;
* new error codes with unknown handling;
* new enum values with safe fallback.

Breaking changes require a new API version or explicit compatibility mechanism.

---

# 110. Deprecated Fields

Deprecated fields shall remain documented with:

* replacement;
* deprecation version;
* planned removal version;
* compatibility period.

The server shall not silently stop returning a required field.

---

# 111. Generated Client Requirements

Generated clients shall preserve:

* exact integer semantics;
* nullable distinctions;
* unknown enum handling;
* header metadata;
* binary streaming;
* error-envelope decoding.

Generated models shall not become Domain models directly.

---

# 112. API Test Requirements

Contract tests shall verify:

* path naming;
* JSON naming;
* identifier format;
* timestamp format;
* enum format;
* error envelope;
* request identifiers;
* content types;
* authentication headers;
* idempotency behavior;
* pagination envelope;
* binary metadata headers;
* Range behavior;
* unknown-field handling;
* personal-state exclusion;
* physical-path exclusion.

---

# 113. Full Content Test

A full publication content test shall verify:

```text
200 OK
Content-Type = application/pdf
Content-Length = authoritative ByteLength
SourceVersion header matches
Checksum headers match
ETag exists where required
body checksum matches
```

---

# 114. Range Content Test

A partial content test shall verify:

```text
206 Partial Content
Accept-Ranges = bytes
Content-Range valid
Content-Length equals selected range
SourceVersion unchanged
Checksum metadata still describes full source
response bytes match selected range
```

---

# 115. Invalid Range Test

An invalid range test shall verify:

```text
416 Range Not Satisfiable
stable error code
RequestId present
no arbitrary file read
```

---

# 116. Idempotency Test

An idempotency test shall verify:

1. first request succeeds;
2. repeated identical request returns the same logical result;
3. repeated key with changed request returns conflict;
4. concurrent duplicate requests do not create duplicate authoritative effects.

---

# 117. Unknown Enum Test

The Swift client shall prove that an unknown response enum:

* decodes safely;
* maps to unsupported;
* disables unsafe actions;
* preserves diagnostic raw value;
* does not map to `AVAILABLE`, `VALID` or `COMPLETED`.

---

# 118. API Convention Completion Gate

This document is complete when:

```text
[ ] Production transport is defined
[ ] Base path is defined
[ ] Resource naming is defined
[ ] HTTP methods are defined
[ ] JSON naming is defined
[ ] Identifier representation is defined
[ ] Version representation is defined
[ ] Byte representation is defined
[ ] Timestamp representation is defined
[ ] Nullability is defined
[ ] Enum representation is defined
[ ] Response envelopes are defined
[ ] Error envelope is defined
[ ] Correlation headers are defined
[ ] Authentication header is defined
[ ] Idempotency header is defined
[ ] Client-version headers are defined
[ ] Binary headers are defined
[ ] Range semantics are defined
[ ] Cache conventions are defined
[ ] Request limits are defined
[ ] Validation semantics are defined
[ ] Security rules are defined
[ ] Privacy exclusions are defined
[ ] Testing obligations are defined
[ ] No architectural contradiction remains
```

---

# 119. API Convention Invariants

The following invariants apply:

* Production transport uses HTTPS.
* Every public endpoint is versioned.
* Public paths use lowercase kebab-case.
* JSON fields use camelCase.
* Public enums use stable strings.
* Identifiers are opaque UUID strings.
* Byte counts and revisions use exact integers.
* Exact timestamps use UTC RFC 3339.
* Errors use one stable envelope.
* Every error has a RequestId.
* Protected routes use bearer authentication.
* Administrative mutation may use idempotency keys.
* Publication payloads use binary streaming.
* Range requests preserve exact SourceVersion.
* Physical paths are never public.
* Personal state is never part of this API.
* Unknown values never become success silently.

---

# 120. Prohibited API Conventions

The API shall not:

* use unversioned public endpoints;
* mix snake_case and camelCase JSON;
* expose numeric database IDs;
* use numeric enum ordinals;
* serialize large PDFs into JSON;
* use query parameters for credentials;
* expose stack traces;
* expose NAS paths;
* accept arbitrary file paths;
* switch SourceVersion during transfer;
* use unbounded catalog responses;
* treat server version as API version;
* return plain-text errors for JSON endpoints;
* silently ignore unknown administrative fields;
* include personal-state fields;
* rely on HTTP status alone for error meaning.

---

# 121. Related Documents

## Contracts

* `README.md`
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

* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`
* `../03-Domain/Errors.md`

## Technical Design

* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 122. Status

**Approved**

The common HTTP, JSON, header, identifier, timestamp, correlation, idempotency, validation, streaming and Range conventions of the Master Library API are defined.

The next document is:

```text
01-MasterLibrary/04-Contracts/CommonTypes.md
```

It shall freeze every reusable public type and enumeration shared by server, macOS client and future Apple clients.
