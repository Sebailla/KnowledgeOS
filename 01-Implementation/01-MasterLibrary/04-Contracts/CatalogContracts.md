

# Master Library Catalog Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Catalog Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Reader-facing Master Catalog contracts.

It establishes:

* catalog access;
* catalog revision retrieval;
* catalog listing;
* catalog search;
* catalog filters;
* deterministic sorting;
* publication-summary representation;
* publication visibility;
* pagination integration;
* remote-authority semantics;
* catalog caching;
* offline catalog snapshots;
* catalog refresh behavior;
* compatibility behavior;
* error responses;
* security boundaries;
* testing obligations.

The Master Catalog represents the authoritative collection of publications available from the NAS-hosted Master Library.

---

# 2. Scope

This document defines:

```text
GET /v1/catalog
GET /v1/catalog/revision
```

It defines the catalog response models consumed by:

* macOS;
* iPhone;
* iPad;
* administrative clients;
* future compatible Reader clients.

It also defines how clients combine remote catalog entries with their own local Library state without changing NAS authority.

---

# 3. Explicit Exclusions

This document does not define:

* complete publication-detail responses;
* publication-content transfer;
* Range requests;
* acquisition state;
* local payload installation;
* local removal;
* administrative publication creation;
* source replacement;
* personal annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* CloudKit records;
* iCloud synchronization.

Those concerns belong to other contracts or modules.

---

# 4. Core Catalog Principle

> The Master Catalog exposes authoritative remote publication metadata and availability.

The complementary principle is:

> The Master Catalog does not describe whether a publication exists locally on a specific device.

---

# 5. Catalog Authority

The server owns:

```text
PublicationId
authoritative metadata
current SourceVersion
remote availability
source format
authoritative ByteLength
cover availability
CatalogRevision
```

The client owns:

```text
local membership
installed SourceVersion
local availability
local integrity
acquisition progress
local removal
personal state
```

---

# 6. Catalog Projection

Catalog responses use a read projection.

Conceptually:

```text
CatalogEntryProjection
```

The projection is optimized for:

* listing;
* search;
* filtering;
* sorting;
* pagination;
* offline snapshot creation.

It is not the complete Publication aggregate.

---

# 7. Catalog Endpoints

The initial Reader catalog endpoints are:

```text
GET /v1/catalog
GET /v1/catalog/revision
```

Both require an authenticated device credential.

Allowed roles:

```text
READER
ADMINISTRATOR
```

---

# 8. GET /v1/catalog

## Purpose

Returns one deterministic page of Master Catalog entries.

The endpoint supports:

* initial browsing;
* search;
* filtering;
* sorting;
* continuation through opaque cursors.

---

# 9. Catalog Request

Baseline:

```text
GET /v1/catalog
```

Supported query parameters:

```text
cursor
pageSize
query
language
publicationType
availability
subject
sort
```

---

# 10. Catalog Request Example

```text
GET /v1/catalog?pageSize=50&sort=TITLE_ASC&language=es&publicationType=BOOK
```

Search example:

```text
GET /v1/catalog?query=marine%20biology&pageSize=50&sort=TITLE_ASC
```

Continuation example:

```text
GET /v1/catalog?cursor=<opaque-cursor>&pageSize=50
```

---

# 11. Authentication

Required header:

```text
Authorization: Bearer <opaque-device-credential>
```

The server shall validate:

* credential;
* Device state;
* role;
* current allowed actions;
* Master Library state.

---

# 12. Required Capability

The server shall advertise:

```text
CATALOG_BROWSE
```

For queries containing `query`, the server shall also support:

```text
CATALOG_SEARCH
```

---

# 13. Allowed Action

The authenticated Library descriptor shall expose:

```text
CATALOG_BROWSE
```

and, where search is available:

```text
CATALOG_SEARCH
```

The server still validates each request independently.

---

# 14. Catalog Availability Preconditions

Catalog browsing requires:

```text
Master Library initialized
Catalog database readable
CatalogRevision valid
Required indexes available
Cursor signing available
Authenticated device active
Library state permits catalog read
```

---

# 15. Library States Allowing Catalog Access

The baseline policy allows catalog access when Library state is:

```text
AVAILABLE
DEGRADED
```

Catalog access may be allowed during:

```text
MAINTENANCE
```

only when maintenance policy explicitly permits read-only browsing.

Catalog access is prohibited when state is:

```text
UNINITIALIZED
INITIALIZING
UNAVAILABLE
INVALID
UNSUPPORTED
```

---

# 16. Catalog Response

Baseline response:

```json
{
  "items": [
    {
      "publicationId": "4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc",
      "metadata": {
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
        "subjects": [
          "Marine biology",
          "Ecology"
        ],
        "publisher": "Example Scientific Press",
        "publicationDate": "2024",
        "publicationType": "BOOK",
        "sourceFormat": "PDF"
      },
      "availability": "AVAILABLE",
      "currentSourceVersion": 2,
      "sourceByteLength": 73400320,
      "cover": {
        "available": true,
        "mediaType": "image/jpeg",
        "etag": "\"cover-opaque-etag\""
      },
      "createdAt": "2026-07-15T18:30:00Z",
      "updatedAt": "2026-07-16T10:00:00Z"
    }
  ],
  "page": {
    "nextCursor": "eyJ2IjoxLCJwIjoiLi4uIn0",
    "hasMore": true
  },
  "catalogRevision": 42
}
```

---

# 17. CatalogPageResponse

The response contains:

```text
items
page
catalogRevision
```

Schema direction:

```yaml
type: object
required:
  - items
  - page
  - catalogRevision
properties:
  items:
    type: array
    items:
      $ref: '#/components/schemas/PublicationSummary'
  page:
    $ref: '#/components/schemas/CatalogPageInfo'
  catalogRevision:
    $ref: '#/components/schemas/CatalogRevision'
```

---

# 18. PublicationSummary

Each item is represented by:

```text
PublicationSummary
```

Required fields:

```text
publicationId
metadata
availability
currentSourceVersion
sourceByteLength
cover
createdAt
updatedAt
```

---

# 19. PublicationSummary Purpose

PublicationSummary contains enough information to:

* render catalog lists;
* render catalog grids;
* display title and contributors;
* display remote availability;
* display cover placeholders;
* compare remote SourceVersion with local SourceVersion;
* estimate acquisition size;
* open publication details;
* begin acquisition preparation.

It intentionally omits detailed source-version history.

---

# 20. PublicationSummary Schema

Conceptually:

```yaml
type: object
required:
  - publicationId
  - metadata
  - availability
  - createdAt
  - updatedAt
  - cover
properties:
  publicationId:
    $ref: '#/components/schemas/PublicationId'
  metadata:
    $ref: '#/components/schemas/CatalogPublicationMetadata'
  availability:
    $ref: '#/components/schemas/PublicationAvailability'
  availabilityReason:
    $ref: '#/components/schemas/AvailabilityReason'
  currentSourceVersion:
    $ref: '#/components/schemas/SourceVersion'
  sourceByteLength:
    $ref: '#/components/schemas/ByteLength'
  cover:
    $ref: '#/components/schemas/CoverDescriptor'
  createdAt:
    $ref: '#/components/schemas/Timestamp'
  updatedAt:
    $ref: '#/components/schemas/Timestamp'
```

---

# 21. Conditional Current Source Fields

When `availability = AVAILABLE`, the following are required:

```text
currentSourceVersion
sourceByteLength
```

When the publication has no valid deliverable source, those fields may be absent.

The exact current-source integrity details belong in `PublicationContracts.md`.

---

# 22. CatalogPublicationMetadata

Catalog metadata is a bounded subset of complete PublicationMetadata.

Required baseline fields:

```text
title
contributors
subjects
publicationType
sourceFormat
```

Optional fields:

```text
subtitle
language
publisher
publicationDate
descriptionExcerpt
```

---

# 23. Description in Catalog

The complete publication description shall not be required in every catalog page.

The catalog may expose:

```text
descriptionExcerpt
```

with a bounded length.

Recommended maximum:

```text
512 characters
```

The complete description belongs in publication details.

---

# 24. Catalog Metadata Example

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
  "subjects": [
    "Marine biology",
    "Ecology"
  ],
  "publisher": "Example Scientific Press",
  "publicationDate": "2024",
  "publicationType": "BOOK",
  "sourceFormat": "PDF",
  "descriptionExcerpt": "A reference work on marine ecosystems."
}
```

---

# 25. Contributor Representation

Contributors preserve deterministic ordering.

The catalog may include all contributors when the list is within contract limits.

The server shall not silently reorder contributors alphabetically.

---

# 26. Contributor Truncation

The initial v1 contract shall not truncate the contributor list.

The maximum contributor count remains bounded by `CommonTypes.md`.

If future compact projections introduce truncation, the response shall expose an explicit truncation indicator.

---

# 27. Subject Representation

Subjects are authoritative Master Catalog metadata.

They are not personal tags.

Subjects shall:

* preserve public display values;
* remain bounded;
* contain no personal state;
* support filtering and search.

---

# 28. Publication Availability

Catalog entries use:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

This represents remote availability only.

---

# 29. AVAILABLE

The publication may be acquired.

Required baseline:

```text
valid current SourceVersion
valid authoritative ByteLength
valid source metadata
```

---

# 30. UNAVAILABLE

The publication exists but cannot currently be acquired.

It may remain visible in the catalog.

Possible reasons:

```text
ADMINISTRATIVE_PAUSE
SOURCE_UNREADABLE
LIBRARY_MAINTENANCE
STORAGE_UNAVAILABLE
UNKNOWN
```

---

# 31. WITHDRAWN

The publication is intentionally no longer offered for new acquisition.

Existing valid local copies remain unaffected.

---

# 32. CORRUPTED

The authoritative current source failed integrity validation.

New acquisition is prohibited.

Existing valid local copies remain unaffected.

---

# 33. Default Catalog Visibility

The default Reader catalog shall include:

```text
AVAILABLE
UNAVAILABLE
CORRUPTED
```

It shall exclude:

```text
WITHDRAWN
```

unless explicitly requested through the availability filter.

This policy preserves historical records while keeping ordinary browsing focused on active catalog entries.

---

# 34. Administrator Visibility

Administrators may request:

```text
availability=WITHDRAWN
```

Reader clients may also be allowed to retrieve withdrawn records by known PublicationId through publication details, according to `PublicationContracts.md`.

---

# 35. Availability Filter

Supported values:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

Example:

```text
GET /v1/catalog?availability=AVAILABLE
```

When omitted, the default visibility policy applies.

---

# 36. Default Availability Policy and Cursor Binding

The normalized default availability policy shall be included in the cursor context.

Therefore:

```text
no explicit availability filter
```

is not interpreted as an unbounded all-state query.

It means:

```text
AVAILABLE + UNAVAILABLE + CORRUPTED
```

---

# 37. Catalog Sort Orders

Supported values:

```text
TITLE_ASC
TITLE_DESC
CREATED_AT_ASC
CREATED_AT_DESC
UPDATED_AT_ASC
UPDATED_AT_DESC
```

Default:

```text
TITLE_ASC
```

Pagination and tie-breaker behavior are defined in `Pagination.md`.

---

# 38. Catalog Search

Search uses:

```text
query
```

Example:

```text
GET /v1/catalog?query=marine
```

The query searches approved authoritative metadata fields.

---

# 39. Searchable Fields

The initial searchable fields are:

```text
title
subtitle
contributors.name
subjects
publisher
descriptionExcerpt or indexed description
```

PublicationId search is not part of ordinary free-text search.

Direct PublicationId retrieval uses the publication-detail endpoint.

---

# 40. Search Semantics

The v1 search contract provides:

```text
case-insensitive normalized metadata matching
```

It does not promise:

* semantic search;
* vector search;
* AI search;
* fuzzy ranking;
* stemming;
* relevance sorting;
* typo correction.

Those capabilities may be added later through explicit contracts.

---

# 41. Search Normalization

The server shall apply deterministic normalization:

* trim;
* collapse repeated whitespace;
* Unicode normalization;
* case folding.

Search implementation shall preserve authoritative display text.

---

# 42. Search Query Absence

When `query` is absent, ordinary catalog browsing applies.

When `query` is empty or whitespace-only, it normalizes to absence.

---

# 43. Search Query Limits

Maximum length:

```text
512 characters
```

Requests exceeding the limit return:

```text
INVALID_SEARCH_QUERY
```

---

# 44. Search and Sort

Search results use the requested catalog sort order.

Default:

```text
TITLE_ASC
```

Relevance sorting is not supported in v1.

---

# 45. Language Filter

Example:

```text
GET /v1/catalog?language=es
```

The v1 contract uses exact normalized BCP 47-compatible matching.

Thus:

```text
es
```

does not automatically match:

```text
es-AR
```

unless the stored language is exactly `es`.

---

# 46. Future Language Hierarchy

A future language-family filter may be introduced separately.

It shall not silently change the meaning of the existing `language` parameter.

---

# 47. Publication Type Filter

Example:

```text
GET /v1/catalog?publicationType=BOOK
```

Supported values are defined in `CommonTypes.md`.

---

# 48. Subject Filter

Example:

```text
GET /v1/catalog?subject=Marine%20biology
```

The initial contract uses normalized exact subject matching.

---

# 49. Filter Combination

Filters combine through logical AND.

Example:

```text
language = en
AND
publicationType = BOOK
AND
subject = Ecology
AND
availability = AVAILABLE
```

---

# 50. Duplicate Query Parameters

The initial contract does not support multiple values for the same filter.

Example:

```text
?publicationType=BOOK&publicationType=PAPER
```

shall return:

```text
VALIDATION_ERROR
```

A future multi-value contract requires explicit array semantics.

---

# 51. Unknown Query Parameters

Unknown parameters shall be rejected.

This prevents:

* silent misspellings;
* accidental contract divergence;
* unsupported internal filtering;
* query ambiguity.

---

# 52. Catalog Pagination

Catalog pagination follows `Pagination.md`.

Key rules:

* cursor-based keyset pagination;
* page size from 1 to 100;
* default page size 50;
* CatalogRevision-bound sequence;
* deterministic ordering;
* signed opaque cursors;
* restart on revision mismatch.

---

# 53. CatalogRevision in Every Page

Every successful catalog page shall return:

```text
catalogRevision
```

including:

* first page;
* continuation page;
* final page;
* empty catalog;
* empty search result.

---

# 54. GET /v1/catalog/revision

## Purpose

Returns the current Master Catalog revision without retrieving catalog entries.

This allows clients to determine whether their cached metadata snapshot may still be current.

---

# 55. Revision Endpoint Authentication

Required roles:

```text
READER
ADMINISTRATOR
```

Required capability:

```text
CATALOG_BROWSE
```

---

# 56. Revision Response

```json
{
  "serverId": "70309fb9-1837-4a31-8518-926f9c9e957a",
  "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
  "catalogRevision": 42,
  "updatedAt": "2026-07-16T18:00:00Z"
}
```

---

# 57. CatalogRevisionResponse

Required fields:

```text
serverId
masterLibraryId
catalogRevision
updatedAt
```

---

# 58. updatedAt Semantics

`updatedAt` represents the time of the latest catalog-visible authoritative mutation associated with the current revision.

For revision zero, it may represent Library initialization time.

---

# 59. Revision Endpoint Preconditions

The endpoint requires:

* initialized Master Library;
* valid MasterLibraryId;
* readable CatalogRevision;
* authenticated device;
* valid Library context.

It does not require source-storage availability when the catalog database remains readable.

---

# 60. Revision Equality

When:

```text
cached MasterLibraryId = remote MasterLibraryId
AND
cached CatalogRevision = remote CatalogRevision
```

the client may consider its complete cached catalog metadata snapshot current.

---

# 61. Revision Difference

When revisions differ, the client shall refresh catalog metadata.

The v1 contract does not define catalog deltas.

---

# 62. Revision Rollback

When the remote CatalogRevision is lower than the last observed revision under the same MasterLibraryId:

* invalidate server cursors;
* invalidate assumptions about later metadata;
* rebuild catalog snapshot;
* preserve local publications;
* surface a restore-related diagnostic if appropriate.

---

# 63. Revision Endpoint Cache Policy

Recommended:

```text
Cache-Control: private, max-age=0, must-revalidate
```

The endpoint may return ETag.

---

# 64. Revision ETag

A revision response ETag may derive from:

```text
ServerId
MasterLibraryId
CatalogRevision
```

Clients treat it as opaque.

---

# 65. Conditional Revision Request

The client may send:

```text
If-None-Match
```

When unchanged, the server may return:

```text
304 Not Modified
```

---

# 66. Catalog Page Cache Policy

Recommended catalog-page response:

```text
Cache-Control: private, max-age=0, must-revalidate
```

Catalog responses are authenticated and shall not be publicly cached.

---

# 67. Catalog Page ETag

A page ETag may derive from:

```text
MasterLibraryId
CatalogRevision
normalized query context
cursor position
page size
```

It remains opaque.

---

# 68. Catalog Snapshot on Client

The client may persist:

```text
CatalogSnapshot
├── ServerId
├── MasterLibraryId
├── CatalogRevision
├── queryContext
├── sort
├── entries
├── capturedAt
└── completeness
```

---

# 69. Snapshot Completeness

Client snapshot completeness may be:

```text
PARTIAL
COMPLETE
```

## PARTIAL

Only some pages are cached.

## COMPLETE

All pages for the specific query context were retrieved under one CatalogRevision.

This state is client-owned.

---

# 70. Canonical Full Catalog Snapshot

The client may maintain one canonical complete snapshot for:

```text
default visibility
no search query
default or selected canonical sort
```

Additional filtered and search results may be stored as derived query caches.

---

# 71. Snapshot Authority

A cached snapshot is:

* derived;
* replaceable;
* possibly stale;
* scoped to one server and Library;
* not authoritative.

---

# 72. Offline Catalog Use

When the server is offline, the client may display its latest valid cached catalog snapshot.

The UI shall distinguish:

```text
OFFLINE_CACHED
```

from current online catalog data.

---

# 73. Offline Search

The client may search cached metadata locally.

Local offline search behavior may differ from server search implementation.

The UI shall avoid claiming that offline results represent unseen or uncached Master Catalog entries.

---

# 74. Partial Offline Snapshot

When only part of the catalog is cached, offline browsing may display that partial result.

The client should indicate that the catalog may be incomplete.

---

# 75. Catalog and Local Library Projection

The client constructs a presentation projection:

```text
CatalogPublicationView
=
PublicationSummary
+
LocalLibraryItem?
+
AcquisitionOperation?
```

This projection is client-owned.

---

# 76. Local Projection Example

Remote response:

```json
{
  "publicationId": "...",
  "currentSourceVersion": 3,
  "availability": "AVAILABLE"
}
```

Local state:

```text
installedSourceVersion = 2
localAvailability = AVAILABLE_LOCAL
```

Client presentation:

```text
Downloaded
Update available
```

The server does not send those labels.

---

# 77. Local Availability Values

Client-local availability may include:

```text
NOT_INSTALLED
AVAILABLE_LOCAL
MISSING
CORRUPTED
REMOVING
RECOVERY_REQUIRED
```

These values shall not appear in catalog server responses.

---

# 78. Update Detection

The client may derive:

```text
CURRENT
UPDATE_AVAILABLE
REMOTE_VERSION_UNKNOWN
LOCAL_VERSION_UNKNOWN
INCOMPATIBLE_CONTEXT
```

Comparison is valid only when:

```text
ServerId matches
MasterLibraryId matches
PublicationId matches
```

---

# 79. CURRENT

Derived when:

```text
installedSourceVersion = currentSourceVersion
```

and local integrity remains valid.

---

# 80. UPDATE_AVAILABLE

Derived when:

```text
remote currentSourceVersion > installedSourceVersion
```

within the same identity context.

---

# 81. Remote Version Absence

When a publication is unavailable, withdrawn or corrupted and currentSourceVersion is absent or non-deliverable, the client shall not infer an update.

---

# 82. CoverDescriptor

Catalog entries expose a bounded CoverDescriptor.

Schema direction:

```yaml
type: object
required:
  - available
properties:
  available:
    type: boolean
  mediaType:
    $ref: '#/components/schemas/CoverMediaType'
  etag:
    type: string
  width:
    type: integer
    minimum: 1
  height:
    type: integer
    minimum: 1
```

---

# 83. Cover Absent

Example:

```json
{
  "cover": {
    "available": false
  }
}
```

When `available = false`, media type and dimensions shall be absent.

---

# 84. Cover Available

Example:

```json
{
  "cover": {
    "available": true,
    "mediaType": "image/jpeg",
    "etag": "\"cover-opaque-etag\"",
    "width": 1200,
    "height": 1800
  }
}
```

---

# 85. Cover Retrieval

Cover bytes are retrieved through:

```text
GET /v1/publications/{publicationId}/cover
```

The endpoint is defined in `PublicationContracts.md`.

---

# 86. Cover Failure Isolation

A cover retrieval failure shall not invalidate the catalog entry.

The client shall display a placeholder.

---

# 87. Source Byte Length

`sourceByteLength` represents the exact current authoritative source payload size.

It may be used by the client to:

* display download size;
* estimate local storage requirement;
* validate acquisition context.

It shall not be formatted by the server.

---

# 88. Source Format

The catalog exposes:

```text
sourceFormat
```

Initial value:

```text
PDF
```

The media type itself may remain in publication details or acquisition metadata.

---

# 89. Publication CreatedAt

`createdAt` represents the time the logical Publication was registered in the Master Catalog.

It is not necessarily the original publication date.

---

# 90. Publication UpdatedAt

`updatedAt` changes for catalog-visible Publication mutations.

Examples:

* metadata update;
* source activation;
* availability change;
* withdrawal;
* restoration.

---

# 91. CatalogRevision Advancement

CatalogRevision shall advance for any mutation that may change:

* catalog membership;
* catalog order;
* catalog search matching;
* catalog filter matching;
* PublicationSummary content;
* remote availability;
* current SourceVersion;
* cover descriptor.

---

# 92. CatalogRevision Non-Advancement

CatalogRevision shall not advance for:

* catalog reads;
* page retrieval;
* local acquisition;
* local removal;
* local integrity changes;
* annotation changes;
* reading progress;
* personal tags;
* iCloud synchronization;
* client cache updates.

---

# 93. Metadata-Only Mutation

A metadata-only mutation advances CatalogRevision but does not create SourceVersion.

---

# 94. Source Replacement

Activating a new source version advances CatalogRevision.

The same PublicationId remains.

---

# 95. Publication Withdrawal

Withdrawal advances CatalogRevision.

The publication disappears from default Reader visibility.

It remains accessible through administrative filters and historical identity.

---

# 96. Publication Restoration

Restoration advances CatalogRevision.

The publication may return to default Reader visibility when valid.

---

# 97. Catalog Response Ordering

The server shall return items in the exact total order defined by the selected sort.

The client shall not reorder server pages before appending when preserving server traversal.

Presentation may offer independent local sorting only as a separate client behavior.

---

# 98. Search Result Determinism

Search result ordering remains deterministic.

Identical request context and CatalogRevision shall produce the same logical ordered result set.

---

# 99. Unknown Enum Values

Clients shall safely decode unknown values for:

* availability;
* publication type;
* source format;
* contributor role;
* cover media type.

Unknown values shall not map to known success states.

---

# 100. Unknown Availability

Unknown remote availability shall disable acquisition actions.

The client may still display safe metadata.

---

# 101. Unknown Publication Type

Unknown publication type may display as:

```text
Other
```

while preserving the raw value for diagnostics.

It shall not prevent metadata display.

---

# 102. Unknown Source Format

Unknown source format shall disable acquisition unless the client explicitly supports it through compatibility negotiation.

---

# 103. Empty Catalog

A valid empty catalog returns:

```json
{
  "items": [],
  "page": {
    "hasMore": false
  },
  "catalogRevision": 0
}
```

HTTP:

```text
200 OK
```

---

# 104. Empty Search Result

A search with no matches returns:

```text
200 OK
```

with an empty item list.

It shall not return `404`.

---

# 105. Catalog Errors

Potential errors include:

```text
AUTHENTICATION_REQUIRED
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
DEVICE_REVOKED
AUTHORIZATION_DENIED
MASTER_LIBRARY_NOT_FOUND
MASTER_LIBRARY_UNAVAILABLE
MASTER_LIBRARY_MAINTENANCE
MASTER_LIBRARY_INVALID
MASTER_LIBRARY_VERSION_UNSUPPORTED
CATALOG_UNAVAILABLE
CATALOG_CORRUPTED
CATALOG_QUERY_FAILED
CATALOG_CURSOR_INVALID
CATALOG_CURSOR_REVISION_MISMATCH
INVALID_PAGINATION
INVALID_SEARCH_QUERY
VALIDATION_ERROR
RATE_LIMIT_EXCEEDED
INTERNAL_ERROR
```

---

# 106. Catalog Unavailable Response

Example:

```json
{
  "error": {
    "code": "CATALOG_UNAVAILABLE",
    "message": "The Master Catalog is temporarily unavailable.",
    "requestId": "136a3973-154a-4204-b41c-1601fd23df13",
    "retryable": true
  }
}
```

HTTP:

```text
503 Service Unavailable
```

---

# 107. Invalid Filter Response

Unknown or invalid filter values return:

```text
VALIDATION_ERROR
```

HTTP:

```text
400 Bad Request
```

Safe details shall identify public field names.

---

# 108. Cursor Revision Mismatch

When the catalog changes during traversal:

```text
CATALOG_CURSOR_REVISION_MISMATCH
```

HTTP:

```text
409 Conflict
```

The client restarts from the first page.

---

# 109. Catalog Corruption

When catalog integrity is invalid:

```text
CATALOG_CORRUPTED
```

HTTP:

```text
503 Service Unavailable
```

Automatic repeated retry is not appropriate.

---

# 110. Rate Limiting

Catalog requests may return:

```text
RATE_LIMIT_EXCEEDED
```

HTTP:

```text
429 Too Many Requests
```

The server should include:

```text
Retry-After
```

---

# 111. Catalog Request Idempotency

Catalog GET requests are safe and idempotent.

No Idempotency-Key is required.

---

# 112. Request Correlation

The client may send:

```text
X-Request-Id
X-Correlation-Id
```

The server shall return:

```text
X-Request-Id
```

---

# 113. Catalog Request Cancellation

Client cancellation:

* does not mutate server state;
* does not invalidate a cursor;
* does not advance CatalogRevision;
* may be retried while cursor remains valid.

---

# 114. Stale Client Response

The client shall discard responses that belong to an obsolete:

* query;
* filter set;
* sort order;
* server registration;
* MasterLibraryId;
* UI generation.

---

# 115. Catalog Refresh Workflow

Recommended workflow:

```text
Load cached snapshot
    ↓
Retrieve server descriptor
    ↓
Validate identity and compatibility
    ↓
Authenticate
    ↓
GET /v1/catalog/revision
    ↓
Compare revisions
    ↓
If equal: retain snapshot
If different: retrieve new catalog pages
```

---

# 116. Complete Refresh Workflow

When revisions differ:

```text
request first page
    ↓
persist temporary new snapshot
    ↓
follow cursors
    ↓
complete sequence under one CatalogRevision
    ↓
atomically replace old complete snapshot
```

---

# 117. Partial Refresh Failure

If refresh fails before completion:

* retain previous complete snapshot;
* retain partial new snapshot only as temporary state;
* do not claim new snapshot completeness;
* allow retry or restart;
* preserve local publications.

---

# 118. Atomic Snapshot Replacement

The client should replace the canonical complete catalog snapshot atomically after all pages complete successfully.

This prevents a half-refreshed catalog from replacing a known complete snapshot.

---

# 119. Memory Strategy

The client need not keep the entire refreshed catalog in memory.

It may stream pages into a temporary local database generation.

---

# 120. Snapshot Generation

A client implementation may use:

```text
catalogSnapshotGeneration
```

to separate:

* current complete snapshot;
* incoming refresh snapshot.

This is client-internal and not transported.

---

# 121. Snapshot Commit

After successful full traversal:

1. mark incoming generation complete;
2. activate it;
3. remove obsolete derived entries;
4. retain local Library relationships;
5. preserve local publication payloads.

---

# 122. PublicationId as Merge Key

Catalog snapshots merge and replace entries by:

```text
ServerId
+
MasterLibraryId
+
PublicationId
```

Title, checksum and filename are not identity keys.

---

# 123. Withdrawn Entry Removal from Default Snapshot

When a publication is withdrawn, a refreshed default snapshot will no longer include it.

The client may:

* remove it from the default catalog projection;
* retain historical metadata if a LocalLibraryItem exists;
* preserve the local payload;
* preserve personal state.

---

# 124. Locally Installed Withdrawn Publication

A locally installed publication may remain visible in the Selective Local Library even when absent from the default Master Catalog response.

Its local metadata snapshot remains available.

---

# 125. Locally Installed Deleted Catalog Entry

The Master Catalog architecture prefers withdrawal over destructive deletion.

If a catalog entry disappears because of repair or exceptional deletion:

* the local copy remains;
* remote metadata may become unavailable;
* the client shall not delete local content automatically.

---

# 126. Catalog and Personal State Separation

Catalog refresh shall never overwrite:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes.

These values are not fields in the catalog schema.

---

# 127. Catalog Privacy

Catalog requests may reveal which metadata the device searches.

The server shall:

* authenticate catalog access;
* use HTTPS;
* avoid unnecessary search logging;
* bound diagnostic retention;
* exclude personal state.

---

# 128. Search Logging

Search text logging shall be configurable.

Preferred production behavior:

* record query-present flag;
* record normalized query length;
* omit full query text by default;
* allow restricted diagnostic logging when explicitly enabled.

---

# 129. Catalog Logging

Safe request log fields:

```text
requestId
deviceId
masterLibraryId
catalogRevision
cursorPresent
pageSize
sort
filter summary
queryPresent
returnedCount
hasMore
duration
result
```

---

# 130. Catalog Log Prohibitions

Logs shall not contain:

* credential;
* full cursor;
* personal state;
* physical storage paths;
* complete publication descriptions by default;
* private search content without explicit policy.

---

# 131. Catalog Metrics

Recommended metrics:

```text
catalog_requests_total
catalog_request_duration_seconds
catalog_items_returned
catalog_empty_results_total
catalog_search_requests_total
catalog_filter_requests_total
catalog_revision_checks_total
catalog_revision_changes_observed_total
catalog_cursor_failures_total
catalog_snapshot_refresh_total
```

---

# 132. Metric Cardinality

Metrics shall not use:

* PublicationId;
* DeviceId;
* RequestId;
* cursor;
* search text;

as unbounded labels.

---

# 133. Repository Read Model

The server catalog repository should expose:

```text
findCatalogPage(request)
getCatalogRevision()
```

It shall return immutable projections.

It shall not return persistence records directly to Transport.

---

# 134. Application Use Cases

The initial use cases are:

```text
ListCatalog
GetCatalogRevision
```

---

# 135. ListCatalog Request Model

Conceptually:

```text
ListCatalogRequest
├── authenticatedDevice
├── pageSize
├── continuation?
├── query?
├── filters
├── sort
└── requestContext
```

---

# 136. ListCatalog Result Model

Conceptually:

```text
ListCatalogResult
├── items
├── nextCursor?
├── hasMore
└── catalogRevision
```

---

# 137. GetCatalogRevision Result

Conceptually:

```text
CatalogRevisionResult
├── serverId
├── masterLibraryId
├── catalogRevision
└── updatedAt
```

---

# 138. Transport Mapping

The flow remains:

```text
HTTP query parameters
    ↓
Transport validation
    ↓
Catalog request mapper
    ↓
Application request
    ↓
Read repository
    ↓
Application result
    ↓
Transport response mapper
```

---

# 139. Runtime Validation

TypeScript compile-time types are insufficient.

The server shall validate requests at runtime using the approved schema mechanism.

Validation shall include:

* enum values;
* page size;
* query length;
* cursor length;
* duplicate parameters;
* language syntax;
* identifier context.

---

# 140. Response Validation

Contract tests shall validate server responses against OpenAPI.

Development and test builds may use runtime response validation where practical.

---

# 141. Performance Requirements

Catalog responses shall remain bounded.

A page shall not include:

* publication bytes;
* complete source history;
* annotations;
* AI analysis;
* unbounded descriptions;
* full-size covers.

---

# 142. Reference Scale

The catalog contract shall support at least:

```text
100,000 publications
```

without changing its public paging model.

This remains a target until measured.

---

# 143. Catalog Index Requirements

Persistence shall support indexes for:

```text
normalizedTitle + PublicationId
createdAt + PublicationId
updatedAt + PublicationId
availability
publicationType
language
normalized subjects
searchable metadata
```

The exact schema belongs in `CatalogSchema.md`.

---

# 144. Catalog Search Implementation Boundary

The public contract does not dictate the search engine.

The server may use:

* SQLite FTS;
* normalized indexed columns;
* another approved local search implementation.

The public semantics shall remain stable.

---

# 145. Search Engine Change

Changing search implementation is compatible only when public matching semantics remain acceptably equivalent.

Introducing relevance ranking changes public ordering and requires explicit contract evolution.

---

# 146. Contract Fixtures

Required fixtures:

```text
catalog-page.json
catalog-final-page.json
catalog-empty.json
catalog-search-result.json
catalog-filtered-result.json
catalog-unavailable-entry.json
catalog-corrupted-entry.json
catalog-withdrawn-result.json
catalog-cover-present.json
catalog-cover-absent.json
catalog-revision.json
catalog-invalid-filter-error.json
catalog-cursor-invalid-error.json
catalog-revision-mismatch-error.json
catalog-unavailable-error.json
catalog-unknown-enum.json
```

---

# 147. Catalog Contract Tests

Tests shall verify:

* Reader authentication;
* Administrator authentication;
* invalid credential rejection;
* default visibility;
* withdrawn exclusion;
* explicit withdrawn filter;
* each supported filter;
* filter combination;
* each supported sort;
* deterministic order;
* cursor continuation;
* empty result;
* CatalogRevision presence;
* cover descriptor;
* unknown enum handling;
* personal-state exclusion;
* physical-path exclusion.

---

# 148. Default Visibility Test

Test data:

```text
A = AVAILABLE
B = UNAVAILABLE
C = CORRUPTED
D = WITHDRAWN
```

Default result shall contain:

```text
A
B
C
```

and exclude:

```text
D
```

---

# 149. Withdrawn Filter Test

Request:

```text
GET /v1/catalog?availability=WITHDRAWN
```

Result shall contain withdrawn entries according to authorization and visibility policy.

---

# 150. Remote-Only State Test

Catalog response shall be rejected by contract tests if it contains fields such as:

```text
isDownloaded
localAvailability
installedSourceVersion
downloadProgress
localPath
annotationCount
readingProgress
favorite
```

---

# 151. Search Tests

Tests shall verify matching against:

* title;
* subtitle;
* contributor;
* subject;
* publisher;
* description index.

Tests shall also verify:

* case normalization;
* whitespace normalization;
* bounded query length;
* empty query behavior.

---

# 152. Language Filter Tests

Tests shall prove exact normalized language matching.

Example:

```text
filter es
```

shall not silently match:

```text
es-AR
```

under the v1 policy.

---

# 153. Revision Endpoint Tests

Tests shall verify:

* exact ServerId;
* exact MasterLibraryId;
* exact CatalogRevision;
* updatedAt valid;
* authentication required;
* source-storage failure does not necessarily block revision retrieval;
* catalog database failure does block it.

---

# 154. Catalog Refresh Client Tests

Client tests shall verify:

* equal revision avoids unnecessary complete refresh;
* different revision starts refresh;
* partial failure preserves old complete snapshot;
* successful refresh replaces snapshot atomically;
* withdrawn remote publication does not delete local copy;
* local annotations remain unchanged;
* MasterLibraryId mismatch isolates cache.

---

# 155. Unknown Availability Test

An unknown availability value shall:

* decode safely;
* preserve metadata;
* disable acquisition;
* avoid mapping to `AVAILABLE`;
* retain raw value for diagnostics.

---

# 156. OpenAPI Requirements

OpenAPI shall define:

```text
GET /v1/catalog
GET /v1/catalog/revision
CatalogPageResponse
PublicationSummary
CatalogPublicationMetadata
CoverDescriptor
CatalogRevisionResponse
all query parameters
all error responses
```

---

# 157. OpenAPI Security

Both endpoints require:

```text
Bearer device credential
```

No anonymous catalog browsing is approved.

---

# 158. Catalog Completion Gate

This document is complete when:

```text
[ ] GET /v1/catalog is defined
[ ] GET /v1/catalog/revision is defined
[ ] Authentication is defined
[ ] Required capabilities are defined
[ ] Library-state preconditions are defined
[ ] Catalog response is defined
[ ] PublicationSummary is defined
[ ] Catalog metadata projection is defined
[ ] Availability is defined
[ ] Default visibility is defined
[ ] Withdrawn visibility is defined
[ ] Search fields are defined
[ ] Search semantics are defined
[ ] Filters are defined
[ ] Filter combination is defined
[ ] Sorting is defined
[ ] Pagination integration is defined
[ ] CatalogRevision behavior is defined
[ ] CoverDescriptor is defined
[ ] Source ByteLength exposure is defined
[ ] Client catalog snapshot is defined
[ ] Offline behavior is defined
[ ] Remote/local projection is defined
[ ] Update detection is defined
[ ] Refresh workflow is defined
[ ] Partial refresh failure is defined
[ ] Cache isolation is defined
[ ] Privacy behavior is defined
[ ] Logging and metrics are defined
[ ] Repository boundary is defined
[ ] Runtime validation is defined
[ ] Performance direction is defined
[ ] Fixtures are defined
[ ] Testing obligations are defined
[ ] Personal-state exclusion is explicit
[ ] Physical-path exclusion is explicit
[ ] No architectural contradiction remains
```

---

# 159. Catalog Contract Invariants

The following invariants apply:

* The Master Catalog contains remote authority only.
* PublicationId is the catalog identity.
* CatalogRevision is required in every page.
* Default Reader visibility excludes withdrawn publications.
* Search uses authoritative metadata.
* Filters are deterministic.
* Sorting is deterministic.
* Pagination follows one revision.
* Catalog pages contain no publication payloads.
* Catalog pages contain no local availability.
* Catalog pages contain no acquisition progress.
* Catalog pages contain no personal state.
* Catalog snapshots are derived.
* Local Library membership remains client-owned.
* Local publication payloads survive remote withdrawal.
* Equal revisions identify an unchanged catalog snapshot.
* Revision difference requires refresh.
* MasterLibraryId mismatch prevents cache merging.
* Unknown availability never maps to available.
* Physical paths remain private.

---

# 160. Prohibited Catalog Designs

The module shall not:

* expose catalog data anonymously;
* include device-local availability;
* include local filesystem paths;
* include NAS physical paths;
* include acquisition progress;
* include annotations;
* include reading progress;
* include favorites;
* include personal tags;
* use title as publication identity;
* use checksum as publication identity;
* return unbounded catalog lists;
* use offset pagination as primary behavior;
* omit CatalogRevision;
* silently include withdrawn publications in default Reader results;
* silently change search ordering to relevance;
* merge caches across MasterLibraryId values;
* delete local publications after catalog refresh;
* overwrite personal state from catalog metadata;
* return complete PDF payloads or covers inside catalog JSON.

---

# 161. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `Authentication.md`
* `ErrorContracts.md`
* `Pagination.md`
* `ServerContracts.md`
* `HealthContracts.md`
* `PublicationContracts.md`
* `AcquisitionContracts.md`
* `AdministrationContracts.md`
* `Versioning.md`
* `Compatibility.md`

## Domain

* `../03-Domain/DomainModel.md`
* `../03-Domain/Entities.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/DataFlow.md`

## Future Persistence

* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/ClientCatalogCache.md`

---

# 162. Status

**Approved**

The first complete Reader-facing Master Library API is frozen:

```text
GET /v1/catalog
GET /v1/catalog/revision
```

The next document is:

```text
01-MasterLibrary/04-Contracts/PublicationContracts.md
```

It shall define:

```text
GET /v1/publications/{publicationId}
GET /v1/publications/{publicationId}/cover
HEAD /v1/publications/{publicationId}/content
```

including complete publication metadata, remote availability, current and historical source descriptors, cover delivery, exact content metadata and publication-detail caching.
