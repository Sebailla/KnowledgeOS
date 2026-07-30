# Master Library Common Contract Types

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Common Types

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the reusable public types shared across the Master Library API.

It freezes the transport representation of:

* identifiers;
* source versions;
* catalog revisions;
* checksums;
* byte values;
* timestamps;
* publication dates;
* publication metadata;
* publication states;
* server states;
* capabilities;
* pagination values;
* health values;
* authentication values;
* operation values;
* error support values.

These types are shared by:

* KnowledgeOS Server;
* the macOS client;
* future iPhone and iPad clients;
* administrative tools;
* generated API clients;
* contract fixtures;
* contract tests.

---

# 2. Scope

The types defined here are transport types.

They shall not be interpreted as:

* Domain entities;
* persistence records;
* ORM models;
* filesystem paths;
* SwiftUI presentation models;
* database schema definitions.

The mapping remains:

```text
Transport Type
    ↓
Validation
    ↓
Domain Value or Entity
```

---

# 3. Contract Type Principles

Every common contract type shall be:

* explicit;
* stable;
* bounded;
* serializable;
* language-neutral;
* compatible with TypeScript and Swift;
* independent from persistence;
* independent from framework types;
* safe for OpenAPI generation;
* safe for unknown-value handling.

---

# 4. OpenAPI Ownership

The machine-readable definitions of these types shall exist under reusable OpenAPI components.

Conceptually:

```text
components:
  schemas:
    MasterLibraryId
    PublicationId
    SourceVersion
    CatalogRevision
    Checksum
    PublicationMetadata
    PublicationAvailability
```

Endpoint schemas shall reference these components rather than redefine equivalent structures repeatedly.

---

# 5. Type Naming

Reusable schema names shall use:

```text
PascalCase
```

Examples:

```text
PublicationId
PublicationMetadata
Checksum
CatalogPageInfo
ServerCapability
```

JSON fields inside those schemas shall use:

```text
camelCase
```

---

# 6. Identifier Types

The common identifier types are:

```text
ServerId
MasterLibraryId
PublicationId
DeviceId
AcquisitionOperationId
AcquisitionAttemptId
RequestId
CorrelationId
```

Administrative operation identifiers may be added later when asynchronous administrative contracts are introduced.

---

# 7. Identifier Base Representation

All common identifiers shall use the same transport representation:

```yaml
type: string
format: uuid
pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
```

Canonical example:

```json
"34e27850-d1c4-4075-9dcc-b1d206e5e9a6"
```

---

# 8. Identifier Rules

Identifiers shall be:

* lowercase;
* hyphenated;
* non-empty;
* immutable;
* opaque;
* independent from physical storage;
* independent from database primary keys.

Clients shall not parse semantic meaning from identifiers.

---

# 9. ServerId

## Meaning

Identifies one logical KnowledgeOS Server installation.

## Example

```json
{
  "serverId": "70309fb9-1837-4a31-8518-926f9c9e957a"
}
```

## Rules

`ServerId` remains independent from:

* hostname;
* IP address;
* port;
* TLS certificate expiration;
* process identifier;
* container identifier.

---

# 10. MasterLibraryId

## Meaning

Identifies one logical Master Library.

## Example

```json
{
  "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832"
}
```

A restored Master Library shall preserve the same value.

---

# 11. PublicationId

## Meaning

Identifies one logical publication.

## Example

```json
{
  "publicationId": "4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc"
}
```

It remains stable across:

* metadata changes;
* source replacement;
* availability changes;
* withdrawal;
* restoration.

---

# 12. DeviceId

## Meaning

Identifies one registered client device.

## Example

```json
{
  "deviceId": "f9334911-d938-482a-b8af-a631cd48b1c2"
}
```

It shall not expose a hardware serial number or personal identifier.

---

# 13. AcquisitionOperationId

## Meaning

Identifies one client-owned logical acquisition workflow.

## Example

```json
{
  "acquisitionOperationId": "7976fdfa-fb91-4405-a54f-8ba83f697607"
}
```

The server may receive it for diagnostic correlation.

It does not become server authority.

---

# 14. AcquisitionAttemptId

## Meaning

Identifies one execution Attempt of an acquisition.

Each retry uses a new value.

---

# 15. RequestId

## Meaning

Identifies one server request.

It appears in:

* response headers;
* error envelopes;
* server logs.

---

# 16. CorrelationId

## Meaning

Connects several related requests or operations.

It is optional unless required by a specific endpoint.

---

# 17. SourceVersion

## Schema

```yaml
type: integer
format: int64
minimum: 1
```

## Example

```json
{
  "sourceVersion": 3
}
```

## Meaning

Identifies one immutable source payload version within one Publication.

---

# 18. SourceVersion Rules

A SourceVersion:

* is publication-scoped;
* is positive;
* is monotonically increasing;
* identifies exact authoritative source bytes;
* shall not change during one acquisition;
* is not globally comparable across publications.

---

# 19. CatalogRevision

## Schema

```yaml
type: integer
format: int64
minimum: 0
```

## Example

```json
{
  "catalogRevision": 58
}
```

## Meaning

Identifies one catalog-visible authoritative revision within one Master Library.

---

# 20. CatalogRevision Rules

CatalogRevision advances for:

* publication creation;
* metadata change;
* source-version activation;
* availability change;
* withdrawal;
* restoration.

It does not advance for:

* local acquisition;
* local removal;
* annotations;
* progress;
* personal state;
* catalog caching.

---

# 21. RecordVersion

## Purpose

Supports optimistic concurrency in administrative contracts.

## Schema

```yaml
type: integer
format: int64
minimum: 0
```

## Example

```json
{
  "recordVersion": 7
}
```

RecordVersion shall not be confused with SourceVersion or CatalogRevision.

---

# 22. ByteLength

## Schema

```yaml
type: integer
format: int64
minimum: 0
```

For committed source payloads:

```text
byteLength > 0
```

## Example

```json
{
  "byteLength": 73400320
}
```

---

# 23. ByteOffset

## Schema

```yaml
type: integer
format: int64
minimum: 0
```

## Purpose

Represents a zero-based byte offset used in acquisition and Range semantics.

---

# 24. ByteRange

A reusable byte-range model may be represented as:

```json
{
  "start": 1048576,
  "end": 2097151
}
```

Schema:

```yaml
type: object
required:
  - start
properties:
  start:
    $ref: '#/components/schemas/ByteOffset'
  end:
    $ref: '#/components/schemas/ByteOffset'
```

When `end` is absent, the range extends to the end of the payload.

---

# 25. ChecksumAlgorithm

Initial public enum:

```text
sha-256
```

Schema:

```yaml
type: string
enum:
  - sha-256
```

The transport value uses lowercase with hyphen.

---

# 26. ChecksumValue

For SHA-256:

```yaml
type: string
pattern: '^[0-9a-f]{64}$'
```

Example:

```json
"98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8"
```

---

# 27. Checksum

## Schema

```yaml
type: object
required:
  - algorithm
  - value
properties:
  algorithm:
    $ref: '#/components/schemas/ChecksumAlgorithm'
  value:
    $ref: '#/components/schemas/ChecksumValue'
```

## Example

```json
{
  "algorithm": "sha-256",
  "value": "98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8"
}
```

---

# 28. Timestamp

Exact timestamps use:

```yaml
type: string
format: date-time
```

Canonical example:

```json
"2026-07-15T18:30:00Z"
```

The semantic value is UTC.

---

# 29. Timestamp Fields

Common timestamp field names include:

```text
createdAt
updatedAt
capturedAt
validatedAt
registeredAt
completedAt
expiresAt
lastConnectedAt
```

Each field shall define whether it is required or optional.

---

# 30. PublicationDate

PublicationDate preserves precision.

Schema direction:

```yaml
type: string
pattern: '^\d{4}(-\d{2}(-\d{2})?)?$'
```

Valid examples:

```json
"1998"
```

```json
"1998-06"
```

```json
"1998-06-14"
```

Semantic validation shall reject invalid calendar dates.

---

# 31. ApiVersion

Initial value:

```text
v1
```

Schema:

```yaml
type: string
enum:
  - v1
```

Future API major versions may extend compatibility schemas.

---

# 32. ApplicationVersion

Represents a server or client application version.

Schema direction:

```yaml
type: string
pattern: '^\d+\.\d+\.\d+([\-+][0-9A-Za-z.-]+)?$'
```

Example:

```json
"1.0.0"
```

---

# 33. MasterLibraryFormatVersion

Represents the Master Library storage-format version.

Example:

```json
"1.0"
```

Schema:

```yaml
type: string
pattern: '^\d+\.\d+$'
```

It remains independent from API and application versions.

---

# 34. SchemaVersion

Represents a persistence migration level.

Schema:

```yaml
type: integer
format: int64
minimum: 0
```

This value may appear in diagnostics or compatibility responses but shall not normally be required by Reader operations.

---

# 35. PublicationFormat

Initial public enum:

```text
PDF
```

Schema:

```yaml
type: string
enum:
  - PDF
```

Future values require actual module support.

---

# 36. MediaType

Initial source MediaType:

```text
application/pdf
```

Schema:

```yaml
type: string
enum:
  - application/pdf
```

Cover assets use separate image-media-type contracts.

---

# 37. PublicationType

Initial public enum:

```text
BOOK
ARTICLE
PAPER
MAGAZINE
MANUAL
REPORT
THESIS
DOCUMENT
OTHER
```

Schema:

```yaml
type: string
enum:
  - BOOK
  - ARTICLE
  - PAPER
  - MAGAZINE
  - MANUAL
  - REPORT
  - THESIS
  - DOCUMENT
  - OTHER
```

---

# 38. ContributorRole

Initial public enum:

```text
AUTHOR
EDITOR
TRANSLATOR
ILLUSTRATOR
CONTRIBUTOR
```

---

# 39. PublicationAvailability

Public enum:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

It describes server-authoritative remote availability.

It shall not describe device-local presence.

---

# 40. SourceIntegrityState

Public administrative or diagnostic enum:

```text
PENDING
VALID
MISSING
CORRUPTED
UNREADABLE
QUARANTINED
```

Ordinary Reader catalog contracts may expose only the safe subset needed by clients.

---

# 41. MasterLibraryState

Public enum:

```text
INITIALIZING
AVAILABLE
DEGRADED
UNAVAILABLE
MAINTENANCE
INVALID
UNSUPPORTED
```

---

# 42. ServerHealthState

Public enum:

```text
STARTING
HEALTHY
DEGRADED
UNHEALTHY
MAINTENANCE
```

ServerHealthState and MasterLibraryState are related but distinct.

---

# 43. ComponentHealthState

Reusable health state:

```text
AVAILABLE
DEGRADED
UNAVAILABLE
UNKNOWN
```

It may describe:

* catalog;
* source storage;
* database;
* authentication;
* diagnostics.

---

# 44. ServerTrustState

Client semantic enum:

```text
UNREGISTERED
PENDING_TRUST
TRUSTED
IDENTITY_MISMATCH
REVOKED
```

This state is normally client-owned and is not necessarily transported as server authority.

---

# 45. AuthenticationState

Client semantic enum:

```text
UNAUTHENTICATED
AUTHENTICATING
AUTHENTICATED
EXPIRED
REVOKED
FAILED
```

Public authentication responses may expose outcome values but shall not claim ownership of all client lifecycle state.

---

# 46. DeviceRole

Public enum:

```text
READER
ADMINISTRATOR
```

Schema:

```yaml
type: string
enum:
  - READER
  - ADMINISTRATOR
```

---

# 47. DeviceType

Initial public enum:

```text
MAC
IPHONE
IPAD
OTHER
```

The transport field indicates client category.

It is not trusted for authorization.

---

# 48. ClientPlatform

Initial public enum:

```text
macOS
iOS
iPadOS
```

The exact casing is frozen for header and schema use.

Unknown platforms may be represented by:

```text
OTHER
```

where the endpoint permits it.

---

# 49. ServerCapability

Initial public capabilities:

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

# 50. ServerCapability Rules

Capabilities:

* are stable strings;
* describe supported behavior;
* are advertised by the server;
* do not replace authorization;
* do not guarantee current availability;
* allow clients to disable unsupported optional actions.

---

# 51. CapabilitySet

Schema:

```yaml
type: array
items:
  $ref: '#/components/schemas/ServerCapability'
uniqueItems: true
```

Example:

```json
[
  "CATALOG_BROWSE",
  "CATALOG_SEARCH",
  "PUBLICATION_DOWNLOAD",
  "SINGLE_RANGE_DOWNLOAD"
]
```

---

# 52. PublicationTitle

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 512
```

The server shall apply semantic blank-content validation beyond JSON length.

---

# 53. PublicationSubtitle

Schema:

```yaml
type: string
minLength: 1
maxLength: 512
```

Optional.

Whitespace-only values are invalid.

---

# 54. PublicationDescription

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 16384
```

Optional.

The initial contract uses plain text.

---

# 55. ContributorName

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 256
```

---

# 56. Contributor

## Schema

```yaml
type: object
required:
  - name
  - role
  - order
properties:
  name:
    $ref: '#/components/schemas/ContributorName'
  role:
    $ref: '#/components/schemas/ContributorRole'
  order:
    type: integer
    minimum: 0
```

## Example

```json
{
  "name": "Jane Example",
  "role": "AUTHOR",
  "order": 0
}
```

A contributor-entry identifier may be included in administrative responses when needed.

---

# 57. ContributorList

Schema:

```yaml
type: array
items:
  $ref: '#/components/schemas/Contributor'
maxItems: 100
```

Ordering is significant.

---

# 58. SubjectName

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 256
```

---

# 59. SubjectList

Schema:

```yaml
type: array
items:
  $ref: '#/components/schemas/SubjectName'
uniqueItems: true
maxItems: 100
```

Semantic duplicate detection shall use normalized comparison.

---

# 60. PublisherName

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 256
```

Optional.

---

# 61. LanguageCode

Schema direction:

```yaml
type: string
minLength: 2
maxLength: 35
```

Examples:

```json
"es"
```

```json
"es-AR"
```

Semantic validation shall apply BCP 47-compatible rules.

---

# 62. CoverReference

A public cover reference shall not expose a physical path.

It may use an opaque identifier or governed URL.

Recommended public model:

```json
{
  "available": true,
  "mediaType": "image/jpeg",
  "etag": "\"cover-opaque-tag\""
}
```

The actual cover URL is derived from the publication endpoint.

---

# 63. CoverMediaType

Initial supported values may include:

```text
image/jpeg
image/png
image/webp
```

Support shall be restricted to formats accepted by the server and clients.

---

# 64. PublicationMetadata

## Schema Direction

```yaml
type: object
required:
  - title
  - contributors
  - subjects
  - publicationType
  - sourceFormat
properties:
  title:
    $ref: '#/components/schemas/PublicationTitle'
  subtitle:
    $ref: '#/components/schemas/PublicationSubtitle'
  contributors:
    $ref: '#/components/schemas/ContributorList'
  language:
    $ref: '#/components/schemas/LanguageCode'
  description:
    $ref: '#/components/schemas/PublicationDescription'
  subjects:
    $ref: '#/components/schemas/SubjectList'
  publisher:
    $ref: '#/components/schemas/PublisherName'
  publicationDate:
    $ref: '#/components/schemas/PublicationDate'
  publicationType:
    $ref: '#/components/schemas/PublicationType'
  sourceFormat:
    $ref: '#/components/schemas/PublicationFormat'
```

---

# 65. PublicationMetadata Example

```json
{
  "title": "Marine Ecology",
  "subtitle": "Principles and Applications",
  "contributors": [
    {
      "name": "Jane Example",
      "role": "AUTHOR",
      "order": 0
    }
  ],
  "language": "en",
  "description": "A reference work on marine ecosystems.",
  "subjects": [
    "Marine biology",
    "Ecology"
  ],
  "publisher": "Example Scientific Press",
  "publicationDate": "2024",
  "publicationType": "BOOK",
  "sourceFormat": "PDF"
}
```

---

# 66. PublicationMetadata Prohibitions

The schema shall not contain:

* annotation fields;
* reading progress;
* personal tags;
* favorite state;
* personal notes;
* personal relationships;
* local path;
* NAS path;
* iCloud state;
* CloudKit identifiers.

---

# 67. SourceDescriptor

Represents authoritative metadata for one source version.

## Schema

```yaml
type: object
required:
  - sourceVersion
  - format
  - mediaType
  - byteLength
  - checksum
  - createdAt
properties:
  sourceVersion:
    $ref: '#/components/schemas/SourceVersion'
  format:
    $ref: '#/components/schemas/PublicationFormat'
  mediaType:
    $ref: '#/components/schemas/MediaType'
  byteLength:
    $ref: '#/components/schemas/ByteLength'
  checksum:
    $ref: '#/components/schemas/Checksum'
  createdAt:
    $ref: '#/components/schemas/Timestamp'
```

---

# 68. CurrentSourceDescriptor

Extends SourceDescriptor with delivery-related state.

Example:

```json
{
  "sourceVersion": 2,
  "format": "PDF",
  "mediaType": "application/pdf",
  "byteLength": 73400320,
  "checksum": {
    "algorithm": "sha-256",
    "value": "98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8"
  },
  "createdAt": "2026-07-15T18:30:00Z",
  "rangeSupported": true
}
```

---

# 69. RangeSupport

Schema:

```yaml
type: boolean
```

Field:

```text
rangeSupported
```

It indicates support for single byte-range retrieval of the specified source.

---

# 70. AvailabilityReasonCode

Initial safe reason values may include:

```text
ADMINISTRATIVE_PAUSE
ADMINISTRATIVE_WITHDRAWAL
SOURCE_MISSING
SOURCE_CORRUPTED
SOURCE_UNREADABLE
LIBRARY_MAINTENANCE
STORAGE_UNAVAILABLE
UNKNOWN
```

The exact public subset shall be endpoint-specific.

---

# 71. AvailabilityReason

## Schema

```yaml
type: object
required:
  - code
  - occurredAt
properties:
  code:
    $ref: '#/components/schemas/AvailabilityReasonCode'
  message:
    type: string
    maxLength: 512
  occurredAt:
    $ref: '#/components/schemas/Timestamp'
```

The message shall be safe and non-sensitive.

---

# 72. PublicationSummary

A reusable summary type for catalog responses.

## Schema Direction

```yaml
type: object
required:
  - publicationId
  - metadata
  - availability
  - currentSourceVersion
  - updatedAt
properties:
  publicationId:
    $ref: '#/components/schemas/PublicationId'
  metadata:
    $ref: '#/components/schemas/PublicationMetadata'
  availability:
    $ref: '#/components/schemas/PublicationAvailability'
  currentSourceVersion:
    $ref: '#/components/schemas/SourceVersion'
  sourceByteLength:
    $ref: '#/components/schemas/ByteLength'
  coverAvailable:
    type: boolean
  updatedAt:
    $ref: '#/components/schemas/Timestamp'
```

---

# 73. PublicationSummary Rules

PublicationSummary exposes remote state only.

It shall not contain:

* local availability;
* download progress;
* local SourceVersion;
* client filesystem information;
* local integrity.

---

# 74. PublicationDetails

PublicationDetails extends the catalog summary with:

* complete metadata;
* current SourceDescriptor;
* source-version history where allowed;
* cover metadata;
* availability reason;
* creation time;
* record version where administrative use requires it.

The final shape belongs in `PublicationContracts.md`.

---

# 75. ServerIdentity

Reusable model:

```yaml
type: object
required:
  - serverId
  - displayName
  - serverVersion
  - supportedApiVersions
  - capabilities
properties:
  serverId:
    $ref: '#/components/schemas/ServerId'
  displayName:
    type: string
    minLength: 1
    maxLength: 256
  serverVersion:
    $ref: '#/components/schemas/ApplicationVersion'
  supportedApiVersions:
    type: array
    items:
      $ref: '#/components/schemas/ApiVersion'
    uniqueItems: true
  capabilities:
    $ref: '#/components/schemas/CapabilitySet'
```

---

# 76. ServerFingerprintDescriptor

Example:

```json
{
  "algorithm": "sha-256",
  "value": "aeb1c50e4f070769f12e9fd42b14e65d8f7e004d986f74ca15c94610127ad5fb"
}
```

This value is used for trust confirmation.

The exact certificate or key material being fingerprinted shall be defined in `Authentication.md`.

---

# 77. MasterLibraryDescriptor

Reusable model:

```yaml
type: object
required:
  - masterLibraryId
  - name
  - formatVersion
  - catalogRevision
  - state
properties:
  masterLibraryId:
    $ref: '#/components/schemas/MasterLibraryId'
  name:
    type: string
    minLength: 1
    maxLength: 256
  formatVersion:
    $ref: '#/components/schemas/MasterLibraryFormatVersion'
  catalogRevision:
    $ref: '#/components/schemas/CatalogRevision'
  state:
    $ref: '#/components/schemas/MasterLibraryState'
```

---

# 78. DeviceDescriptor

Reusable model:

```yaml
type: object
required:
  - deviceId
  - name
  - type
  - role
  - registeredAt
properties:
  deviceId:
    $ref: '#/components/schemas/DeviceId'
  name:
    type: string
    minLength: 1
    maxLength: 256
  type:
    $ref: '#/components/schemas/DeviceType'
  role:
    $ref: '#/components/schemas/DeviceRole'
  registeredAt:
    $ref: '#/components/schemas/Timestamp'
```

---

# 79. PageSize

Initial schema:

```yaml
type: integer
format: int32
minimum: 1
maximum: 100
default: 50
```

This value is frozen unless revised in `Pagination.md`.

---

# 80. CatalogCursor

Schema:

```yaml
type: string
minLength: 1
maxLength: 2048
```

The value is opaque.

Example:

```json
"eyJ2IjoxLCJwb3NpdGlvbiI6Ii4uLiJ9"
```

Clients shall not decode or alter it.

---

# 81. CatalogPageInfo

## Schema

```yaml
type: object
required:
  - hasMore
properties:
  nextCursor:
    $ref: '#/components/schemas/CatalogCursor'
  hasMore:
    type: boolean
```

## Example

```json
{
  "nextCursor": "eyJ2IjoxLCJwb3NpdGlvbiI6Ii4uLiJ9",
  "hasMore": true
}
```

When `hasMore` is false, `nextCursor` shall be absent.

---

# 82. CatalogSortOrder

Initial values:

```text
TITLE_ASC
TITLE_DESC
CREATED_AT_ASC
CREATED_AT_DESC
UPDATED_AT_ASC
UPDATED_AT_DESC
```

The required default is:

```text
TITLE_ASC
```

---

# 83. SearchQuery

Schema direction:

```yaml
type: string
minLength: 1
maxLength: 512
```

Whitespace-only values are invalid.

An absent query means no search filter.

---

# 84. CatalogFilter

A reusable filter object may contain:

```json
{
  "language": "es",
  "publicationType": "BOOK",
  "availability": "AVAILABLE",
  "subject": "Biology"
}
```

All filters are server-authoritative metadata filters.

They shall not include device-local state.

---

# 85. ValidationFieldError

Reusable validation detail:

```yaml
type: object
required:
  - field
  - code
properties:
  field:
    type: string
  code:
    type: string
  message:
    type: string
```

Example:

```json
{
  "field": "metadata.title",
  "code": "REQUIRED",
  "message": "A publication title is required."
}
```

---

# 86. Retryability

Public error retryability uses:

```yaml
type: boolean
```

The common error envelope uses:

```text
retryable
```

Detailed retry policies remain client-owned.

---

# 87. RetryAfterSeconds

Schema:

```yaml
type: integer
format: int32
minimum: 1
```

This field may accompany temporary errors.

The HTTP `Retry-After` header remains authoritative when present.

---

# 88. OperationStatus

For future observable administrative operations, the common enum may use:

```text
PENDING
RUNNING
SUCCEEDED
FAILED
CANCELLED
RECOVERY_REQUIRED
```

This type shall not be used until an operation resource is formally defined.

---

# 89. AcquisitionTransferMode

Public or diagnostic enum:

```text
FULL
RESUMED_RANGE
```

It may be used in acquisition-preparation or diagnostic contracts.

---

# 90. AcquisitionCapability

The server may advertise:

```text
FULL_DOWNLOAD
SINGLE_RANGE_RESUME
```

These values may be represented by general ServerCapability instead of a separate enum.

The API shall avoid redundant capability models.

---

# 91. RangeDescriptor

A source-delivery metadata object may use:

```json
{
  "supported": true,
  "unit": "bytes"
}
```

Initial unit:

```text
bytes
```

No other range units are supported.

---

# 92. ContentDescriptor

Reusable acquisition metadata:

```yaml
type: object
required:
  - publicationId
  - sourceVersion
  - mediaType
  - byteLength
  - checksum
  - rangeSupported
properties:
  publicationId:
    $ref: '#/components/schemas/PublicationId'
  sourceVersion:
    $ref: '#/components/schemas/SourceVersion'
  mediaType:
    $ref: '#/components/schemas/MediaType'
  byteLength:
    $ref: '#/components/schemas/ByteLength'
  checksum:
    $ref: '#/components/schemas/Checksum'
  rangeSupported:
    type: boolean
  etag:
    type: string
```

---

# 93. ContentDescriptor Example

```json
{
  "publicationId": "4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc",
  "sourceVersion": 2,
  "mediaType": "application/pdf",
  "byteLength": 73400320,
  "checksum": {
    "algorithm": "sha-256",
    "value": "98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8"
  },
  "rangeSupported": true,
  "etag": "\"publication-source-opaque-etag\""
}
```

---

# 94. HealthComponent

Reusable health entry:

```yaml
type: object
required:
  - name
  - state
properties:
  name:
    type: string
  state:
    $ref: '#/components/schemas/ComponentHealthState'
  message:
    type: string
  checkedAt:
    $ref: '#/components/schemas/Timestamp'
```

---

# 95. CompatibilityStatus

Public enum:

```text
COMPATIBLE
DEGRADED
INCOMPATIBLE
UNKNOWN
```

This value may summarize client-server compatibility.

---

# 96. CompatibilityIssueCode

Initial examples:

```text
API_VERSION_UNSUPPORTED
CLIENT_VERSION_TOO_OLD
SERVER_VERSION_TOO_OLD
MASTER_LIBRARY_FORMAT_UNSUPPORTED
REQUIRED_CAPABILITY_MISSING
UNKNOWN_ENUM_VALUE
```

Detailed compatibility behavior belongs in `Compatibility.md`.

---

# 97. CompatibilityIssue

Schema direction:

```yaml
type: object
required:
  - code
  - message
properties:
  code:
    $ref: '#/components/schemas/CompatibilityIssueCode'
  message:
    type: string
  blocking:
    type: boolean
```

---

# 98. SafeMessage

Reusable safe-message constraints:

```yaml
type: string
minLength: 1
maxLength: 1024
```

SafeMessage shall not contain:

* stack traces;
* SQL;
* physical paths;
* credentials;
* tokens;
* personal state.

---

# 99. ErrorCode

Public error codes are represented as:

```yaml
type: string
pattern: '^[A-Z][A-Z0-9_]*$'
```

The canonical registry belongs in `ErrorContracts.md`.

---

# 100. ErrorDetails

ErrorDetails is endpoint-specific.

It shall be:

* JSON object;
* bounded;
* safe;
* schema-defined for important errors;
* free of arbitrary exception payloads.

A generic unrestricted map should be avoided.

---

# 101. ErrorEnvelope

Common shape:

```yaml
type: object
required:
  - error
properties:
  error:
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
        $ref: '#/components/schemas/RetryAfterSeconds'
      details:
        type: object
```

---

# 102. PairingCode

A pairing code shall use a bounded opaque string.

Schema direction:

```yaml
type: string
minLength: 6
maxLength: 128
```

The actual user-facing format shall be defined in `Authentication.md`.

PairingCode is sensitive and shall not appear in logs.

---

# 103. OpaqueCredential

OpaqueCredential shall not be represented in reusable response fixtures except explicit authentication-success tests.

Schema direction:

```yaml
type: string
minLength: 32
maxLength: 512
```

It shall be marked:

```yaml
writeOnly: true
```

or equivalent where appropriate.

---

# 104. CredentialIdentifier

A safe non-secret credential reference may be exposed administratively.

Example:

```json
{
  "credentialId": "68caec0c-b24f-4c45-a97f-e2de6bfcdf46"
}
```

The secret credential value remains hidden.

---

# 105. PairingStatus

Initial enum:

```text
PENDING
APPROVED
REJECTED
EXPIRED
CONSUMED
```

It shall be used only if pairing is modeled as an observable resource.

---

# 106. OriginalFileName

Administrative contract schema direction:

```yaml
type: string
minLength: 1
maxLength: 255
```

It shall be a basename only.

Path separators and traversal segments are prohibited.

---

# 107. IdempotencyKey

Transport schema direction:

```yaml
type: string
minLength: 1
maxLength: 128
```

It appears in the:

```text
Idempotency-Key
```

header.

The client shall treat it as opaque.

---

# 108. ContentETag

ETag values are opaque strings governed by HTTP semantics.

Clients shall not derive checksum, PublicationId or SourceVersion by parsing the ETag.

---

# 109. Common Type Nullability

The default rule is:

* required values are non-null;
* optional values are omitted when absent;
* collections are empty rather than null;
* nullable values are used only when semantic clearing or unknown state requires them.

---

# 110. Common Type Extensibility

Response objects may receive new optional fields in compatible revisions.

Clients shall ignore unknown optional fields.

Requests, especially administrative requests, shall use strict field validation.

---

# 111. Unknown Enum Wrapper Strategy

Generated Swift clients shall not rely exclusively on closed enums that fail decoding.

The preferred client representation is conceptually:

```swift
enum PublicationAvailabilityValue {
    case available
    case unavailable
    case withdrawn
    case corrupted
    case unknown(String)
}
```

The TypeScript server shall validate known request values strictly.

---

# 112. Common Type Mapping Rules

## Transport to Server Domain

```text
UUID string
→ typed Domain identifier

integer
→ SourceVersion or CatalogRevision

Checksum object
→ Domain Checksum

PublicationMetadata DTO
→ validated Domain PublicationMetadata
```

## Transport to Client Domain

```text
Generated Swift model
→ client validation mapper
→ client Domain value
```

No transport object becomes Domain state without mapping.

---

# 113. Common Type Fixture Set

Required fixtures include:

```text
valid-identifiers.json
invalid-identifiers.json
source-versions.json
catalog-revisions.json
checksums.json
publication-metadata.json
publication-states.json
server-identity.json
library-descriptor.json
content-descriptor.json
health-components.json
unknown-enums.json
error-envelope.json
```

---

# 114. Cross-Language Integer Fixtures

Fixtures shall include:

* zero CatalogRevision;
* SourceVersion 1;
* large valid ByteLength;
* large valid CatalogRevision;
* invalid negative values;
* invalid fractional values;
* upper safe interoperability boundary.

Both TypeScript and Swift shall interpret them exactly.

---

# 115. Cross-Language Date Fixtures

Fixtures shall include:

```text
2026
2026-07
2026-07-15
2026-07-15T18:30:00Z
2026-07-15T18:30:00.125Z
```

Invalid examples shall include:

```text
2026-13
2026-02-30
15-07-2026
2026-07-15 18:30:00
```

---

# 116. Common Type Test Requirements

Every reusable type shall have tests for:

* valid schema;
* invalid schema;
* normalization;
* exact serialization;
* TypeScript decoding;
* Swift decoding;
* unknown enum handling;
* nullability;
* boundary lengths;
* integer precision;
* OpenAPI reuse.

---

# 117. Identifier Contract Tests

Tests shall verify:

* lowercase canonical UUID accepted;
* uppercase UUID rejected or normalized only before schema mapping;
* braces rejected;
* whitespace rejected at transport schema;
* non-UUID values rejected;
* semantic identifier types remain distinct in generated code where practical.

---

# 118. Metadata Contract Tests

Tests shall verify:

* title required;
* contributors ordered;
* empty subject list accepted;
* invalid language rejected;
* publication-date precision preserved;
* personal-state fields rejected;
* physical-path fields rejected;
* unknown administrative metadata fields rejected.

---

# 119. Checksum Contract Tests

Tests shall verify:

* valid SHA-256 accepted;
* uppercase digest rejected by canonical transport schema;
* invalid length rejected;
* unsupported algorithm rejected;
* non-hex characters rejected.

---

# 120. ContentDescriptor Tests

Tests shall verify:

* required source identity present;
* ByteLength positive;
* Checksum valid;
* Range flag present;
* no storage path exposed;
* ETag treated as opaque;
* SourceVersion exact.

---

# 121. Common Type Completion Gate

This document is complete when:

```text
[ ] All public identifiers are defined
[ ] SourceVersion is defined
[ ] CatalogRevision is defined
[ ] RecordVersion is defined
[ ] Byte types are defined
[ ] Checksum types are defined
[ ] Timestamp types are defined
[ ] PublicationDate is defined
[ ] Version types are defined
[ ] Publication metadata types are defined
[ ] Publication states are defined
[ ] Server and Library states are defined
[ ] Capability types are defined
[ ] Pagination support types are defined
[ ] Server identity types are defined
[ ] Device types are defined
[ ] ContentDescriptor is defined
[ ] Health support types are defined
[ ] Error support types are defined
[ ] Authentication support types are defined
[ ] Nullability rules are explicit
[ ] Unknown enum handling is explicit
[ ] Cross-language fixtures are explicit
[ ] Testing obligations are explicit
[ ] Personal-state fields are absent
[ ] Physical paths are absent
[ ] No architectural contradiction remains
```

---

# 122. Common Type Invariants

The following invariants apply:

* Public identifiers are opaque UUID strings.
* SourceVersion is positive.
* CatalogRevision is non-negative.
* Byte values are exact integers.
* Checksums use canonical SHA-256 representation.
* Timestamps use UTC RFC 3339.
* Publication dates preserve precision.
* Public enums use stable strings.
* Unknown enum values never map to success.
* Publication metadata contains no personal state.
* Catalog types contain remote authority only.
* Local state is never part of server catalog contracts.
* ContentDescriptor exposes no storage path.
* Credentials remain secret.
* Capabilities do not replace authorization.
* Transport objects require Domain mapping.

---

# 123. Prohibited Common Type Designs

Common types shall not:

* expose database numeric identifiers;
* expose physical paths;
* expose credentials or hashes;
* use floating-point byte values;
* use numeric enum ordinals;
* collapse SourceVersion and CatalogRevision;
* embed local availability in PublicationSummary;
* embed acquisition progress in Master Catalog entries;
* include annotations or reading progress;
* force incomplete publication dates into full dates;
* define unrestricted arbitrary error maps;
* use generated transport types directly as Domain entities;
* interpret endpoint as server identity;
* interpret capability as permission.

---

# 124. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
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

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

---

# 125. Status

**Approved**

The reusable transport identifiers, versions, revisions, checksums, byte values, timestamps, metadata, states, capabilities, pagination values, health values, authentication support values and error support values of the Master Library API are frozen.

The next document is:

```text
01-MasterLibrary/04-Contracts/Authentication.md
```

It shall define server trust, pairing, device registration, opaque credentials, authentication headers, role assignment, revocation and security-failure behavior.
