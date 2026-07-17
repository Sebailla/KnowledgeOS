
# Master Library Error Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Error Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the public error contracts of the Master Library API.

It establishes:

* the public error envelope;
* stable public error codes;
* HTTP status mappings;
* retryability;
* safe error details;
* request correlation;
* validation errors;
* authentication and authorization errors;
* catalog and publication errors;
* acquisition errors;
* storage and integrity errors;
* compatibility errors;
* recovery errors;
* unknown-error handling;
* client translation requirements;
* testing obligations.

This document describes errors visible across the server-client boundary.

It does not expose internal Domain, database, filesystem or framework exceptions directly.

---

# 2. Scope

These contracts apply to:

* JSON API responses;
* authentication endpoints;
* catalog endpoints;
* publication endpoints;
* administrative endpoints;
* health endpoints where errors are returned;
* content-delivery requests;
* byte-range requests;
* generated clients;
* contract tests.

Binary content responses may still return a JSON error envelope when no binary response body has begun.

---

# 3. Core Error Principle

> HTTP status communicates protocol outcome. The stable KnowledgeOS error code communicates module meaning.

Clients shall not determine complete behavior from HTTP status alone.

Example:

```text
404 Not Found
+
PUBLICATION_NOT_FOUND
```

is different from:

```text
404 Not Found
+
SOURCE_VERSION_NOT_FOUND
```

---

# 4. Error Ownership

The public error contract is owned by:

```text
packages/error-registry/
```

or an equivalent central implementation location.

Internal layers map into this registry:

```text
Domain Error
    ↓
Application Error
    ↓
Public Module Error
    ↓
HTTP Error Response
```

---

# 5. Error Envelope

All JSON error responses shall use:

```json
{
  "error": {
    "code": "PUBLICATION_NOT_FOUND",
    "message": "The requested publication does not exist.",
    "requestId": "136a3973-154a-4204-b41c-1601fd23df13",
    "retryable": false
  }
}
```

---

# 6. Error Envelope Schema

Conceptually:

```yaml
ErrorEnvelope:
  type: object
  required:
    - error
  properties:
    error:
      $ref: '#/components/schemas/PublicError'
```

```yaml
PublicError:
  type: object
  required:
    - code
    - message
    - requestId
    - retryable
  properties:
    code:
      $ref: '#/components/schemas/ErrorCode'
    message:
      $ref: '#/components/schemas/SafeMessage'
    requestId:
      $ref: '#/components/schemas/RequestId'
    retryable:
      type: boolean
    retryAfterSeconds:
      type: integer
      minimum: 1
    details:
      oneOf:
        - $ref: '#/components/schemas/ValidationErrorDetails'
        - $ref: '#/components/schemas/ResourceErrorDetails'
        - $ref: '#/components/schemas/VersionConflictDetails'
        - $ref: '#/components/schemas/IntegrityErrorDetails'
        - $ref: '#/components/schemas/CompatibilityErrorDetails'
        - $ref: '#/components/schemas/RecoveryErrorDetails'
```

---

# 7. Error Code Format

Public error codes shall match:

```text
^[A-Z][A-Z0-9_]*$
```

Examples:

```text
VALIDATION_ERROR
PUBLICATION_NOT_FOUND
CHECKSUM_MISMATCH
SERVER_IDENTITY_MISMATCH
```

Codes shall:

* remain stable;
* have one meaning;
* avoid technology names;
* avoid endpoint names where unnecessary;
* remain suitable for client branching.

---

# 8. Safe Message

The public `message` shall:

* be concise;
* be safe;
* avoid internal details;
* avoid stack traces;
* avoid SQL;
* avoid paths;
* avoid credentials;
* avoid tokens;
* avoid personal state;
* be usable for diagnostics.

The final localized UI message belongs to the client.

---

# 9. Request Identifier

Every public error shall contain:

```text
requestId
```

The same value shall appear in:

```text
X-Request-Id
```

The client may display or copy RequestId in diagnostic views.

---

# 10. Retryable

The `retryable` field indicates whether retry may be meaningful.

It does not authorize automatic retry by itself.

The client shall additionally verify:

* operation idempotency;
* current trust state;
* current authentication state;
* SourceVersion stability;
* local recovery state;
* retry-attempt limits.

---

# 11. Retry-After

Temporary errors may include:

```text
Retry-After
```

and:

```json
{
  "retryAfterSeconds": 30
}
```

When both exist, they shall agree.

The HTTP header remains authoritative.

---

# 12. Error Details

`details` is optional.

It shall be:

* schema-defined;
* bounded;
* safe;
* relevant to client handling;
* free from raw exception data.

An unrestricted arbitrary object is prohibited.

---

# 13. ValidationErrorDetails

Schema direction:

```yaml
ValidationErrorDetails:
  type: object
  required:
    - fields
  properties:
    fields:
      type: array
      maxItems: 100
      items:
        $ref: '#/components/schemas/ValidationFieldError'
```

Example:

```json
{
  "fields": [
    {
      "field": "metadata.title",
      "code": "REQUIRED",
      "message": "A publication title is required."
    }
  ]
}
```

---

# 14. Validation Field Path

Field paths shall use public request names.

Examples:

```text
metadata.title
metadata.contributors[0].name
sourceVersion
pageSize
```

They shall not expose:

* database columns;
* ORM field names;
* internal class names.

---

# 15. ResourceErrorDetails

Schema direction:

```yaml
ResourceErrorDetails:
  type: object
  properties:
    serverId:
      $ref: '#/components/schemas/ServerId'
    masterLibraryId:
      $ref: '#/components/schemas/MasterLibraryId'
    publicationId:
      $ref: '#/components/schemas/PublicationId'
    sourceVersion:
      $ref: '#/components/schemas/SourceVersion'
    deviceId:
      $ref: '#/components/schemas/DeviceId'
```

Only relevant identifiers shall be included.

---

# 16. VersionConflictDetails

Example:

```json
{
  "expectedSourceVersion": 2,
  "actualSourceVersion": 3
}
```

or:

```json
{
  "expectedRecordVersion": 7,
  "actualRecordVersion": 8
}
```

No physical or persistence details shall be exposed.

---

# 17. IntegrityErrorDetails

Example:

```json
{
  "expectedByteLength": 73400320,
  "actualByteLength": 73399110
}
```

Checksum values may be included only when contractually useful and safe.

Example:

```json
{
  "algorithm": "sha-256",
  "expectedChecksum": "...",
  "actualChecksum": "..."
}
```

The default response should avoid exposing both digests unless client recovery requires them.

---

# 18. CompatibilityErrorDetails

Example:

```json
{
  "requestedApiVersion": "v1",
  "supportedApiVersions": [
    "v1"
  ],
  "minimumClientVersion": "1.0.0"
}
```

---

# 19. RecoveryErrorDetails

Example:

```json
{
  "operationId": "4a89217c-7291-45cc-8811-2eb15317392a",
  "recoveryState": "MANUAL_ACTION_REQUIRED"
}
```

The response shall not expose local or server physical recovery paths.

---

# 20. Public Error Categories

The public registry is organized into:

```text
GENERAL
VALIDATION
AUTHENTICATION
AUTHORIZATION
TRUST
COMPATIBILITY
MASTER_LIBRARY
CATALOG
PUBLICATION
SOURCE
ACQUISITION
STORAGE
INTEGRITY
RECOVERY
RATE_LIMIT
```

Category may remain internal to the registry and need not be transported in v1.

---

# 21. General Errors

## INTERNAL_ERROR

An unexpected server failure occurred.

HTTP:

```text
500 Internal Server Error
```

Retryable:

```text
false
```

or `true` only when server policy explicitly classifies the failure as transient.

Public message:

```text
An unexpected server error occurred.
```

Internal diagnostics shall retain the underlying cause.

---

# 22. DEPENDENCY_UNAVAILABLE

A required internal dependency cannot currently serve the request.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

Examples:

* catalog unavailable;
* source-storage service unavailable;
* authentication dependency unavailable.

Specific error codes are preferred when available.

---

# 23. OPERATION_NOT_SUPPORTED

The requested operation is not supported by this server.

HTTP:

```text
501 Not Implemented
```

or:

```text
409 Conflict
```

depending on context.

The approved baseline is:

```text
501 Not Implemented
```

for a valid API route whose optional capability is not implemented.

Capability negotiation should normally prevent this request.

---

# 24. REQUEST_TIMEOUT

The server could not complete a bounded non-transfer operation in time.

HTTP:

```text
504 Gateway Timeout
```

or `503` when the server itself owns the timeout.

The approved baseline is:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 25. Validation Errors

## VALIDATION_ERROR

The request contains one or more invalid values.

HTTP:

```text
400 Bad Request
```

or `422` for Domain-semantic validation.

The endpoint shall select consistently.

`details.fields` should identify invalid fields.

---

# 26. MALFORMED_JSON

The request body is not valid JSON.

HTTP:

```text
400 Bad Request
```

Retryable:

```text
false
```

The raw parser message shall not be exposed.

---

# 27. UNKNOWN_REQUEST_FIELD

The request contains an unsupported field on a strict endpoint.

HTTP:

```text
400 Bad Request
```

Example details:

```json
{
  "fields": [
    {
      "field": "metadata.readingProgress",
      "code": "UNKNOWN_FIELD"
    }
  ]
}
```

---

# 28. INVALID_IDENTIFIER

An identifier is malformed.

HTTP:

```text
400 Bad Request
```

Retryable:

```text
false
```

---

# 29. INVALID_PAGINATION

Cursor, page size or pagination context is invalid.

HTTP:

```text
400 Bad Request
```

Retryable:

```text
false
```

A stale cursor may instead use `CATALOG_CURSOR_INVALID`.

---

# 30. INVALID_SEARCH_QUERY

The search query is malformed or exceeds limits.

HTTP:

```text
400 Bad Request
```

Retryable:

```text
false
```

---

# 31. UNSUPPORTED_MEDIA_TYPE

The request media type is unsupported.

HTTP:

```text
415 Unsupported Media Type
```

Retryable:

```text
false
```

---

# 32. REQUEST_BODY_TOO_LARGE

The request body exceeds configured limits.

HTTP:

```text
413 Content Too Large
```

Retryable:

```text
false
```

The request may be retried only after reducing the payload.

---

# 33. INVALID_SOURCE_METADATA

Publication metadata violates required constraints.

HTTP:

```text
422 Unprocessable Content
```

Retryable:

```text
false
```

---

# 34. UNSUPPORTED_SOURCE_FORMAT

The source format is not supported.

HTTP:

```text
422 Unprocessable Content
```

Retryable:

```text
false
```

---

# 35. INVALID_PDF

The submitted source fails baseline PDF validation.

HTTP:

```text
422 Unprocessable Content
```

Retryable:

```text
false
```

A different valid file may be submitted.

---

# 36. Authentication Error Registry

The following codes are defined in `Authentication.md` and included in the public registry:

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
```

Their canonical mappings shall remain synchronized with `Authentication.md`.

---

# 37. AUTHENTICATION_REQUIRED

HTTP:

```text
401 Unauthorized
```

Retryable:

```text
false
```

Response header:

```text
WWW-Authenticate: Bearer
```

---

# 38. INVALID_AUTHORIZATION_HEADER

HTTP:

```text
401 Unauthorized
```

Retryable:

```text
false
```

---

# 39. INVALID_CREDENTIAL

HTTP:

```text
401 Unauthorized
```

Retryable:

```text
false
```

The server shall not reveal which credential component failed.

---

# 40. CREDENTIAL_REVOKED

HTTP:

```text
401 Unauthorized
```

Retryable:

```text
false
```

Client action:

```text
stop automatic retry and re-pair
```

---

# 41. CREDENTIAL_EXPIRED

HTTP:

```text
401 Unauthorized
```

Retryable:

```text
false
```

Client action:

```text
rotate or re-pair
```

---

# 42. DEVICE_REVOKED

HTTP:

```text
401 Unauthorized
```

Retryable:

```text
false
```

Local Library content remains unaffected.

---

# 43. DEVICE_DISABLED

HTTP:

```text
403 Forbidden
```

Retryable:

```text
false
```

The client may allow manual reauthentication later.

---

# 44. Authorization Errors

## AUTHORIZATION_DENIED

The authenticated device lacks permission.

HTTP:

```text
403 Forbidden
```

Retryable:

```text
false
```

---

# 45. ADMINISTRATOR_REQUIRED

An Administrator role is required.

HTTP:

```text
403 Forbidden
```

Retryable:

```text
false
```

---

# 46. ACQUISITION_NOT_AUTHORIZED

The device may authenticate but cannot acquire the requested publication.

HTTP:

```text
403 Forbidden
```

Retryable:

```text
false
```

This code is reserved for actual authorization policy, not publication unavailability.

---

# 47. Trust Errors

## SERVER_IDENTITY_MISMATCH

The server identity does not match the trusted registration.

This error is normally detected by the client before credential transmission.

When represented publicly:

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

Client behavior:

* block credentials;
* stop automatic authentication;
* require explicit trust resolution.

---

# 48. SERVER_IDENTITY_UNVERIFIED

The server identity has not been approved.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

---

# 49. SERVER_TRUST_REVOKED

The local trust relationship was explicitly revoked.

This is primarily a client error state.

When transported:

HTTP:

```text
403 Forbidden
```

Retryable:

```text
false
```

---

# 50. MASTER_LIBRARY_IDENTITY_MISMATCH

The server exposes a MasterLibraryId different from the expected context.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

Client behavior:

* isolate previous cache;
* do not merge catalogs;
* require user decision.

---

# 51. Compatibility Errors

## API_VERSION_UNSUPPORTED

The requested API version is unsupported.

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

---

# 52. CLIENT_VERSION_UNSUPPORTED

The client is older than the minimum supported version.

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

---

# 53. SERVER_VERSION_UNSUPPORTED

The server version is incompatible with the client.

This is usually a client-generated compatibility error.

When returned by the server:

HTTP:

```text
412 Precondition Failed
```

---

# 54. REQUIRED_CAPABILITY_MISSING

A mandatory capability required by the request is unavailable.

HTTP:

```text
412 Precondition Failed
```

or:

```text
501 Not Implemented
```

The approved baseline is:

```text
412 Precondition Failed
```

when compatibility negotiation failed.

---

# 55. MASTER_LIBRARY_VERSION_UNSUPPORTED

The Master Library format is incompatible with the server runtime.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Administrative upgrade or compatible runtime is required.

---

# 56. DATABASE_SCHEMA_VERSION_UNSUPPORTED

The active runtime cannot safely interpret the database schema.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

This code should normally appear through health or administrative operations, not ordinary Reader requests.

---

# 57. MIGRATION_REQUIRED

A supported migration is required before normal operation.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

until maintenance completes.

---

# 58. MIGRATION_FAILED

A required migration failed.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Manual recovery may be required.

---

# 59. Master Library Errors

## MASTER_LIBRARY_NOT_FOUND

No valid Master Library exists.

HTTP:

```text
404 Not Found
```

Retryable:

```text
false
```

---

# 60. MASTER_LIBRARY_ALREADY_EXISTS

Initialization targeted an existing valid Master Library.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

---

# 61. MASTER_LIBRARY_TARGET_NOT_EMPTY

Initialization targeted a non-empty unknown location.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

---

# 62. MASTER_LIBRARY_INVALID

The Master Library violates required integrity or structure.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Manual recovery is required.

---

# 63. MASTER_LIBRARY_UNAVAILABLE

The Master Library cannot currently serve the request.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 64. MASTER_LIBRARY_MAINTENANCE

The Master Library is intentionally restricted for maintenance.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

`Retry-After` should be provided when known.

---

# 65. MASTER_LIBRARY_PERMISSION_DENIED

The server lacks required storage permissions.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Server administration is required.

---

# 66. MASTER_LIBRARY_INITIALIZATION_IN_PROGRESS

Initialization is already executing.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

---

# 67. MASTER_LIBRARY_INITIALIZATION_FAILED

Initialization could not complete safely.

HTTP:

```text
500 Internal Server Error
```

or `507` when caused by storage capacity.

Retryability depends on the public mapped cause.

---

# 68. MASTER_LIBRARY_RECOVERY_REQUIRED

The Library is in an ambiguous or incomplete state.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Manual or controlled recovery is required.

---

# 69. Catalog Errors

## CATALOG_UNAVAILABLE

The catalog cannot currently serve requests.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 70. CATALOG_CORRUPTED

The catalog failed integrity validation.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 71. CATALOG_QUERY_FAILED

A catalog query failed unexpectedly.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

If the failure is a programming defect, it maps to `INTERNAL_ERROR`.

---

# 72. CATALOG_REVISION_CONFLICT

A catalog mutation expected another CatalogRevision.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

after refreshing authoritative state.

---

# 73. CATALOG_CURSOR_INVALID

The cursor is malformed, expired or incompatible with the current query context.

HTTP:

```text
400 Bad Request
```

Retryable:

```text
false
```

The client shall restart pagination.

---

# 74. CATALOG_CURSOR_REVISION_MISMATCH

The cursor belongs to an incompatible CatalogRevision.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

Client action:

```text
restart catalog query from the first page
```

---

# 75. Publication Errors

## PUBLICATION_NOT_FOUND

The PublicationId does not exist.

HTTP:

```text
404 Not Found
```

Retryable:

```text
false
```

---

# 76. PUBLICATION_ALREADY_EXISTS

Registration conflicts with an existing logical publication.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

Administrator decision may be required.

---

# 77. PROBABLE_DUPLICATE_PUBLICATION

Duplicate detection found an ambiguous candidate.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

The response may include safe candidate PublicationId values.

---

# 78. PUBLICATION_UNAVAILABLE

The publication exists but is temporarily unavailable for acquisition.

HTTP:

```text
503 Service Unavailable
```

or `409 Conflict`.

The approved Reader mapping is:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 79. PUBLICATION_WITHDRAWN

The publication was intentionally withdrawn.

HTTP:

```text
410 Gone
```

Retryable:

```text
false
```

Existing local copies remain unaffected.

---

# 80. PUBLICATION_CORRUPTED

The authoritative source failed integrity validation.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 81. PUBLICATION_MUTATION_CONFLICT

A concurrent administrative mutation prevented commit.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

after refreshing the resource.

---

# 82. PUBLICATION_RECORD_VERSION_CONFLICT

The expected RecordVersion differs from the current value.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

Details should contain expected and actual values.

---

# 83. PUBLICATION_METADATA_UPDATE_FAILED

The metadata update could not commit.

HTTP:

```text
500 Internal Server Error
```

or `503` if caused by temporary persistence unavailability.

Specific infrastructure mapping is preferred.

---

# 84. Source Version Errors

## SOURCE_VERSION_NOT_FOUND

The requested SourceVersion does not exist.

HTTP:

```text
404 Not Found
```

Retryable:

```text
false
```

---

# 85. SOURCE_VERSION_CHANGED

The source context no longer matches the requested SourceVersion.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

Client action:

* stop resume;
* refresh publication metadata;
* create a new acquisition if desired.

---

# 86. SOURCE_VERSION_CONFLICT

A concurrent source replacement prevented safe activation.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

for an Administrator after refresh.

---

# 87. SOURCE_VERSION_INVALID

Source-version metadata is inconsistent.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

This normally indicates server integrity failure.

---

# 88. Source Storage Errors

## SOURCE_FILE_MISSING

The catalog references a source payload that does not exist.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 89. SOURCE_FILE_UNREADABLE

The source exists but cannot be read.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

unless permissions require administration.

---

# 90. SOURCE_STORAGE_UNAVAILABLE

The source-storage area is unavailable.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 91. SOURCE_COMMIT_FAILED

A staged source could not be committed.

HTTP:

```text
500 Internal Server Error
```

or `507` for insufficient storage.

Retryability depends on cause.

---

# 92. SOURCE_REPLACEMENT_FAILED

A replacement source could not be committed.

HTTP:

```text
500 Internal Server Error
```

Retryable:

```text
true
```

when the failure is transient.

The previous source remains authoritative.

---

# 93. SOURCE_ORPHANED

A source payload exists without an active catalog reference.

This is primarily an operational or recovery error.

HTTP:

```text
503 Service Unavailable
```

when it blocks the requested operation.

---

# 94. Content Delivery Errors

## CONTENT_DELIVERY_UNAVAILABLE

The server cannot currently stream the requested source.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 95. RANGE_NOT_SATISFIABLE

The requested range is invalid.

HTTP:

```text
416 Range Not Satisfiable
```

Retryable:

```text
false
```

The client shall validate its checkpoint.

---

# 96. RANGE_UNSUPPORTED

The server or source does not support Range delivery.

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

Client action:

```text
restart as full download
```

---

# 97. RANGE_SOURCE_VERSION_MISMATCH

The partial payload context does not match the requested current source.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

Resume shall be abandoned.

---

# 98. IF_RANGE_PRECONDITION_FAILED

The supplied `If-Range` value does not match the requested source identity.

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

---

# 99. Acquisition Errors

The server does not own the complete AcquisitionOperation.

Public acquisition errors describe server-side request semantics and source-delivery compatibility.

Client-local acquisition errors remain client-owned.

---

# 100. ACQUISITION_ALREADY_ACTIVE

An active local operation already exists for the same source context.

This is normally a client-side error.

If a server-side acquisition reservation is added later:

HTTP:

```text
409 Conflict
```

---

# 101. ACQUISITION_SOURCE_CHANGED

The exact requested source version is no longer deliverable.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

---

# 102. ACQUISITION_RESUME_UNSUPPORTED

Safe resumed delivery is unavailable.

HTTP:

```text
412 Precondition Failed
```

Retryable:

```text
false
```

Client action:

```text
restart from byte zero
```

---

# 103. ACQUISITION_RESUME_INVALID

The supplied resume context is inconsistent.

HTTP:

```text
409 Conflict
```

or `416` when specifically caused by invalid byte range.

Retryable:

```text
false
```

---

# 104. ACQUISITION_NOT_AUTHORIZED

Covered under authorization.

HTTP:

```text
403 Forbidden
```

---

# 105. ACQUISITION_RATE_LIMITED

The server reached its transfer concurrency or rate limit.

HTTP:

```text
429 Too Many Requests
```

Retryable:

```text
true
```

`Retry-After` should be included.

---

# 106. Client-Local Acquisition Errors

The following stable errors are client-owned but shall remain aligned with the registry:

```text
ACQUISITION_INTERRUPTED
ACQUISITION_CANCELLED
ACQUISITION_INSTALLATION_FAILED
ACQUISITION_RECOVERY_REQUIRED
INSUFFICIENT_LOCAL_STORAGE
LOCAL_COMMIT_FAILED
LOCAL_PUBLICATION_MISSING
LOCAL_PUBLICATION_CORRUPTED
LOCAL_PUBLICATION_UNREADABLE
CLIENT_DATABASE_UNAVAILABLE
CLIENT_PERSISTENCE_WRITE_FAILED
SECURE_STORAGE_UNAVAILABLE
```

They are not normally returned by the server.

---

# 107. Integrity Errors

## CHECKSUM_MISMATCH

Actual payload checksum differs from the expected checksum.

Server-side administrative HTTP:

```text
422 Unprocessable Content
```

Client-local acquisition result:

```text
no server HTTP response required
```

Retryable:

```text
true
```

only after discarding or quarantining the invalid payload.

---

# 108. BYTE_LENGTH_MISMATCH

Actual payload length differs from expected length.

HTTP when detected during server administration:

```text
422 Unprocessable Content
```

Retryable:

```text
true
```

after restarting with a valid payload.

---

# 109. CHECKSUM_CALCULATION_FAILED

Checksum calculation could not complete.

HTTP:

```text
500 Internal Server Error
```

or `503` when caused by temporary storage unavailability.

---

# 110. INTEGRITY_METADATA_MISSING

Required checksum or ByteLength metadata is absent.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 111. Storage Errors

## INSUFFICIENT_SERVER_STORAGE

The server lacks sufficient storage.

HTTP:

```text
507 Insufficient Storage
```

Retryable:

```text
false
```

until storage is freed.

---

# 112. SERVER_STORAGE_READ_ONLY

The required storage is read-only.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 113. SERVER_STORAGE_IO_FAILURE

An unexpected server storage I/O failure occurred.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

unless diagnostics indicate permanent failure.

---

# 114. STAGING_STORAGE_UNAVAILABLE

Staging cannot currently be accessed.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 115. STAGING_WRITE_FAILED

The incoming source could not be staged.

HTTP:

```text
500 Internal Server Error
```

or `507`.

Retryability depends on cause.

---

# 116. STAGING_PAYLOAD_INVALID

The staged payload does not match operation metadata.

HTTP:

```text
422 Unprocessable Content
```

Retryable:

```text
false
```

The source must be resubmitted.

---

# 117. STAGING_CLEANUP_FAILED

Temporary cleanup failed after an otherwise determined outcome.

HTTP response may still report the primary operation result.

This error shall normally be logged and surfaced through health or diagnostics rather than replacing a successful authoritative commit.

---

# 118. Persistence Errors

## CATALOG_PERSISTENCE_UNAVAILABLE

Catalog persistence cannot currently serve operations.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 119. PERSISTENCE_WRITE_FAILED

An authoritative mutation could not be committed.

HTTP:

```text
500 Internal Server Error
```

Retryable:

```text
true
```

only when the operation is safe to repeat or uses idempotency.

---

# 120. PERSISTENCE_CONFLICT

The expected persisted state differs from the current state.

HTTP:

```text
409 Conflict
```

Retryable:

```text
true
```

after refresh.

---

# 121. Recovery Errors

## RECOVERY_STATE_AMBIGUOUS

The system cannot determine whether a cross-resource commit completed.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 122. RECOVERY_MARKER_INVALID

A recovery marker is malformed or inconsistent.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 123. RECOVERY_OPERATION_FAILED

An automatic recovery action failed.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

Manual intervention may be required.

---

# 124. RECONCILIATION_REQUIRED

Persistent records and filesystem state disagree.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 125. RECONCILIATION_FAILED

The system could not restore a consistent state.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 126. RESTORE_REQUIRED

Normal recovery is insufficient and a backup restore is required.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 127. Rate-Limit Errors

## RATE_LIMIT_EXCEEDED

The client exceeded a general request limit.

HTTP:

```text
429 Too Many Requests
```

Retryable:

```text
true
```

---

# 128. TRANSFER_LIMIT_EXCEEDED

The server reached its concurrent transfer limit.

HTTP:

```text
429 Too Many Requests
```

Retryable:

```text
true
```

---

# 129. PAIRING_RATE_LIMITED

Defined in Authentication.

HTTP:

```text
429 Too Many Requests
```

Retryable:

```text
true
```

after the instructed delay.

---

# 130. Default HTTP Mapping Table

| Error Code                    |    HTTP | Retryable |
| ----------------------------- | ------: | --------: |
| VALIDATION_ERROR              | 400/422 |        No |
| INVALID_IDENTIFIER            |     400 |        No |
| AUTHENTICATION_REQUIRED       |     401 |        No |
| INVALID_CREDENTIAL            |     401 |        No |
| AUTHORIZATION_DENIED          |     403 |        No |
| PUBLICATION_NOT_FOUND         |     404 |        No |
| SOURCE_VERSION_NOT_FOUND      |     404 |        No |
| PUBLICATION_WITHDRAWN         |     410 |        No |
| PUBLICATION_MUTATION_CONFLICT |     409 |       Yes |
| SOURCE_VERSION_CHANGED        |     409 |        No |
| API_VERSION_UNSUPPORTED       |     412 |        No |
| REQUEST_BODY_TOO_LARGE        |     413 |        No |
| UNSUPPORTED_MEDIA_TYPE        |     415 |        No |
| RANGE_NOT_SATISFIABLE         |     416 |        No |
| INVALID_SOURCE_METADATA       |     422 |        No |
| RATE_LIMIT_EXCEEDED           |     429 |       Yes |
| INTERNAL_ERROR                |     500 |        No |
| MASTER_LIBRARY_UNAVAILABLE    |     503 |       Yes |
| CATALOG_UNAVAILABLE           |     503 |       Yes |
| PUBLICATION_UNAVAILABLE       |     503 |       Yes |
| PUBLICATION_CORRUPTED         |     503 |        No |
| INSUFFICIENT_SERVER_STORAGE   |     507 |        No |

---

# 131. Mapping Specificity

The server shall use the most specific available error code.

Incorrect:

```text
INTERNAL_ERROR
```

for a missing publication.

Correct:

```text
PUBLICATION_NOT_FOUND
```

Generic codes are reserved for genuinely unknown failures.

---

# 132. Error Translation Rules

Infrastructure failures shall map through explicit translation.

Example:

```text
ENOENT while resolving current source
    ↓
SOURCE_FILE_MISSING
```

Example:

```text
SQLite busy timeout
    ↓
CATALOG_PERSISTENCE_UNAVAILABLE
```

Example:

```text
unique publication source-version constraint
    ↓
SOURCE_VERSION_CONFLICT
```

Raw error text shall remain internal.

---

# 133. Binary Request Error Timing

Before binary response headers or body begin, the server may return a JSON ErrorEnvelope.

After binary body transmission begins:

* the connection may terminate;
* the client classifies the transfer as interrupted;
* the server logs the stable internal/public error;
* no JSON error envelope can be assumed.

The client shall not expect structured JSON after partial binary content.

---

# 134. Range Error Response

For:

```text
416 Range Not Satisfiable
```

the server should return:

```text
Content-Range: bytes */<total-length>
Content-Type: application/json
X-Request-Id: ...
```

and an ErrorEnvelope when possible.

---

# 135. Authentication Error Privacy

Authentication responses shall not reveal:

* whether an unknown CredentialId exists;
* credential hash values;
* secret comparison details;
* pairing-code partial validity;
* server pepper state.

Public messages shall remain uniform enough to reduce information leakage.

---

# 136. Resource Enumeration Protection

Authorization and not-found behavior may be adjusted to avoid unauthorized resource enumeration.

Where this policy applies, the endpoint contract shall explicitly state whether unauthorized access returns:

```text
403 Forbidden
```

or:

```text
404 Not Found
```

The default is to preserve semantic correctness with `403`.

---

# 137. Unknown Public Error Code

The client shall handle an unknown public error code by:

1. preserving the raw code;
2. mapping it to a generic compatible client error;
3. using the HTTP status as secondary context;
4. not crashing;
5. not automatically retrying unless clearly safe;
6. displaying RequestId for diagnostics.

---

# 138. Client Error Translation

The client shall translate server errors into:

```text
ClientError
├── code
├── category
├── title
├── message
├── recoverySuggestion?
├── retryable
├── requestId?
└── safeDetails?
```

Server messages shall not be used as the only user-facing copy.

---

# 139. Client Safety Message Examples

## MASTER_LIBRARY_UNAVAILABLE

```text
The Master Library is temporarily unavailable.

Your locally downloaded publications remain available.
```

## CHECKSUM_MISMATCH

```text
The downloaded publication could not be verified.

It was not added to your local Library.
```

## PUBLICATION_WITHDRAWN

```text
This publication is no longer available for download.

Any valid local copy already on this device remains unchanged.
```

---

# 140. Error and Local Content Safety

Error behavior shall preserve:

```text
Server offline
→ local content unchanged

Credential revoked
→ local content unchanged

Publication withdrawn
→ existing local copy unchanged

Update failed
→ previous local version preserved

Checksum mismatch
→ invalid payload not installed
```

---

# 141. Automatic Retry Rules

Automatic retry may be considered for:

```text
MASTER_LIBRARY_UNAVAILABLE
CATALOG_UNAVAILABLE
SOURCE_STORAGE_UNAVAILABLE
RATE_LIMIT_EXCEEDED
TRANSFER_LIMIT_EXCEEDED
CONTENT_DELIVERY_UNAVAILABLE
```

Only when:

* delay is bounded;
* operation is safe;
* trust is valid;
* authentication is valid;
* source identity remains exact.

---

# 142. Automatic Retry Prohibitions

Automatic retry is prohibited for:

```text
SERVER_IDENTITY_MISMATCH
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
DEVICE_REVOKED
AUTHORIZATION_DENIED
API_VERSION_UNSUPPORTED
PUBLICATION_WITHDRAWN
SOURCE_VERSION_CHANGED
RANGE_SOURCE_VERSION_MISMATCH
CHECKSUM_MISMATCH without cleanup
RECOVERY_STATE_AMBIGUOUS
```

---

# 143. Idempotent Mutation Error Handling

Administrative mutations using an Idempotency-Key shall preserve the same logical error or success result for repeated identical requests when possible.

A reused key with different request content shall return:

```text
IDEMPOTENCY_KEY_CONFLICT
```

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

---

# 144. IDEMPOTENCY_KEY_INVALID

The supplied Idempotency-Key violates format or size limits.

HTTP:

```text
400 Bad Request
```

Retryable:

```text
false
```

---

# 145. IDEMPOTENCY_KEY_CONFLICT

The same key was reused for different request content.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

---

# 146. Error Logging

Every server error log shall include:

```text
timestamp
severity
requestId
correlationId?
errorCode
endpoint
method
result
duration
safe resource identifiers
```

---

# 147. Error Log Prohibitions

Logs shall not contain:

* Authorization header;
* PairingCode;
* credential value;
* credential verifier;
* credential pepper;
* full publication binary;
* annotation content;
* reading progress;
* raw physical paths where avoidable;
* stack traces in user-visible logs.

Internal restricted diagnostic logs may contain stack traces but never secrets.

---

# 148. Error Metrics

Recommended metrics:

```text
errors_total{code}
authentication_failures_total{code}
authorization_failures_total{code}
catalog_failures_total{code}
publication_failures_total{code}
content_delivery_failures_total{code}
integrity_failures_total{code}
storage_failures_total{code}
recovery_required_total{code}
```

Metrics shall avoid high-cardinality identifiers.

---

# 149. Error Registry Structure

The machine-readable registry should contain:

```text
code
category
defaultHttpStatus
retryable
defaultSafeMessage
allowedDetailSchema
clientDefaultAction
```

Example conceptual record:

```json
{
  "code": "PUBLICATION_WITHDRAWN",
  "category": "PUBLICATION",
  "defaultHttpStatus": 410,
  "retryable": false,
  "defaultSafeMessage": "The publication has been withdrawn.",
  "allowedDetailSchema": "ResourceErrorDetails",
  "clientDefaultAction": "PRESERVE_LOCAL_COPY"
}
```

---

# 150. Error Registry Generation

The registry may generate:

* OpenAPI enum documentation;
* TypeScript public error types;
* Swift error-code wrappers;
* contract-test fixtures;
* API documentation.

Generated output shall preserve unknown-code handling on clients.

---

# 151. Error Versioning

Adding a new error code is compatible only when clients:

* support unknown codes;
* preserve safe fallback behavior;
* do not crash;
* do not map unknown codes to success.

Changing an existing code's meaning is breaking.

---

# 152. Deprecated Error Codes

Deprecated codes shall define:

* replacement code;
* deprecation version;
* removal version;
* mapping behavior during transition.

A code shall not be silently repurposed.

---

# 153. Contract Test Requirements

Every public error code shall have tests for:

* trigger;
* HTTP status;
* envelope shape;
* RequestId;
* retryable value;
* safe message;
* safe details;
* absence of sensitive data;
* client decoding;
* client translation.

---

# 154. Validation Error Tests

Required cases:

```text
malformed JSON
unknown administrative field
invalid PublicationId
blank title
invalid publication date
unsupported media type
oversized request
invalid page size
invalid cursor
```

---

# 155. Authentication Error Tests

Required cases:

```text
missing credential
malformed Authorization header
invalid credential
revoked credential
expired credential
revoked device
disabled device
invalid PairingCode
expired PairingCode
consumed PairingCode
pairing rate limit
```

---

# 156. Publication Error Tests

Required cases:

```text
publication not found
publication unavailable
publication withdrawn
publication corrupted
SourceVersion not found
SourceVersion changed
mutation conflict
probable duplicate
```

---

# 157. Content Error Tests

Required cases:

```text
source missing
source unreadable
storage unavailable
invalid range
unsupported range
If-Range failure
transfer limit
binary transfer interruption
```

---

# 158. Recovery Error Tests

Required cases:

```text
ambiguous commit
invalid recovery marker
reconciliation required
reconciliation failed
restore required
```

---

# 159. Security Tests

Error responses shall be tested to ensure they do not expose:

```text
stack traces
SQL
database names
NAS paths
container paths
credentials
PairingCodes
credential hashes
pepper
personal state
```

---

# 160. Unknown Error Test

The Swift client shall decode an unknown error code fixture and prove:

* no crash;
* raw code preserved;
* generic safe category used;
* automatic retry disabled by default;
* RequestId retained;
* user receives a safe message.

---

# 161. Error Contract Completion Gate

This document is complete when:

```text
[ ] Error envelope is frozen
[ ] ErrorCode format is frozen
[ ] RequestId behavior is frozen
[ ] Retryable behavior is frozen
[ ] Retry-After behavior is frozen
[ ] Validation details are frozen
[ ] Resource details are frozen
[ ] Version-conflict details are frozen
[ ] Integrity details are frozen
[ ] Authentication errors are defined
[ ] Authorization errors are defined
[ ] Trust errors are defined
[ ] Compatibility errors are defined
[ ] Master Library errors are defined
[ ] Catalog errors are defined
[ ] Publication errors are defined
[ ] Source errors are defined
[ ] Content-delivery errors are defined
[ ] Acquisition errors are defined
[ ] Storage errors are defined
[ ] Integrity errors are defined
[ ] Recovery errors are defined
[ ] Rate-limit errors are defined
[ ] HTTP mappings are explicit
[ ] Client translation is explicit
[ ] Unknown-code handling is explicit
[ ] Logging and metrics are explicit
[ ] Versioning rules are explicit
[ ] Testing obligations are explicit
[ ] Sensitive data is excluded
[ ] Personal state is excluded
[ ] No architectural contradiction remains
```

---

# 162. Error Contract Invariants

The following invariants apply:

* Every JSON error uses one envelope.
* Every error contains RequestId.
* Stable codes have one meaning.
* HTTP status does not replace error code.
* Raw infrastructure errors remain internal.
* Sensitive values never enter errors.
* Physical paths never enter public errors.
* Personal state never enters public errors.
* Retryability is explicit.
* Unknown codes never become success.
* Server failure never deletes valid local content.
* Publication withdrawal never deletes valid local content.
* Checksum mismatch prevents installation.
* SourceVersion mismatch prevents resume.
* Recovery-required remains distinct from ordinary failure.
* Authentication errors preserve local Library access.
* Client translation remains independent from server wording.

---

# 163. Prohibited Error Contract Designs

The API shall not:

* return plain-text errors from JSON endpoints;
* expose raw exception strings;
* expose stack traces;
* use HTTP 500 for known failures;
* use different envelopes by endpoint;
* infer retryability only from status;
* expose credentials or pairing codes;
* expose physical storage paths;
* return unrestricted arbitrary error details;
* change code meanings silently;
* map unknown codes to successful states;
* treat cancellation as corruption;
* treat offline state as local deletion;
* treat publication withdrawal as remote local deletion;
* include annotations or reading progress in diagnostics;
* retry trust or authentication failures automatically.

---

# 164. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `Authentication.md`
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

* `../03-Domain/Errors.md`
* `../03-Domain/States.md`
* `../03-Domain/ValueObjects.md`

## Technical Design

* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`

---

# 165. Status

**Approved**

The complete public Master Library error contract is frozen.

The next document is:

```text
01-MasterLibrary/04-Contracts/Pagination.md
```

It shall define cursor construction, deterministic ordering, CatalogRevision interaction, invalidation, page limits and client pagination behavior.
