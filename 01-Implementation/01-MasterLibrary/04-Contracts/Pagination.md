# Master Library Pagination Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Pagination

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the pagination contract used to navigate the Master Catalog.

It establishes:

* cursor-based pagination;
* deterministic ordering;
* catalog snapshot consistency;
* CatalogRevision interaction;
* cursor construction semantics;
* cursor opacity;
* cursor validation;
* cursor invalidation;
* page-size limits;
* filter and sort binding;
* pagination restart behavior;
* offline catalog snapshot behavior;
* client prefetch behavior;
* error handling;
* compatibility rules;
* testing obligations.

The pagination contract allows clients to browse large Master Catalogs without loading the complete catalog in one request.

---

# 2. Scope

This contract applies to:

```text
GET /v1/catalog
```

and to future collection endpoints that explicitly adopt the same pagination model.

The contract supports:

* unfiltered catalog browsing;
* catalog search;
* metadata filtering;
* deterministic sorting;
* page-by-page retrieval;
* safe restart after catalog mutation;
* local caching of page results;
* macOS client prefetch;
* future iPhone and iPad clients.

---

# 3. Explicit Exclusions

This document does not define:

* publication-content byte ranges;
* local Library pagination;
* CloudKit pagination;
* annotation pagination;
* personal-state pagination;
* offset-based pagination;
* infinite server-side cursors stored permanently;
* synchronization of personal data.

Publication binary Range requests are defined separately in `AcquisitionContracts.md`.

---

# 4. Core Pagination Principle

> Catalog pagination shall navigate a deterministic catalog snapshot through opaque cursors bound to one exact query context.

The complementary principle is:

> A cursor shall never be interpreted as a general position independent from its Library, revision, filters and ordering.

---

# 5. Selected Pagination Model

The Master Catalog shall use:

```text
cursor-based keyset pagination
```

It shall not use:

```text
offset + limit
```

as the primary public pagination model.

---

# 6. Cursor-Based Pagination Rationale

Cursor pagination is selected because it provides:

* stable page transitions;
* better performance for large catalogs;
* no increasing offset cost;
* deterministic continuation;
* explicit query-context binding;
* compatibility with catalog mutations;
* safe client-side continuation;
* reduced risk of duplicate or skipped rows.

---

# 7. Rejected Offset Pagination

The public API shall not use:

```text
?page=42&pageSize=50
```

or:

```text
?offset=2050&limit=50
```

as the primary catalog contract.

Offset pagination is rejected because:

* rows may shift during catalog mutation;
* large offsets become inefficient;
* duplicates and omissions are harder to prevent;
* offset has no built-in snapshot identity;
* it encourages clients to treat position as permanent.

---

# 8. Catalog Page Request

The baseline request is:

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

Additional filters may be introduced compatibly.

---

# 9. First Page Request

The first page omits `cursor`.

Example:

```text
GET /v1/catalog?pageSize=50&sort=TITLE_ASC
```

The server shall create a pagination context from:

* MasterLibraryId;
* current CatalogRevision;
* sort;
* filters;
* search query;
* page size policy;
* contract version.

---

# 10. Continuation Request

A subsequent page includes the server-issued cursor.

Example:

```text
GET /v1/catalog?cursor=<opaque-cursor>&pageSize=50
```

The client shall resend only parameters explicitly required by the contract.

The preferred v1 behavior is:

```text
cursor contains and binds query context
```

Therefore, continuation requests should normally include:

```text
cursor
pageSize
```

and may repeat filters for diagnostics.

If repeated filters differ from the cursor context, the server shall reject the request.

---

# 11. Page Response

A catalog page shall use:

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

Required top-level fields:

```text
items
page
catalogRevision
```

---

# 12. Page Object

The `page` object contains:

```text
nextCursor?
hasMore
```

Example with continuation:

```json
{
  "nextCursor": "eyJ2IjoxLCJwIjoiLi4uIn0",
  "hasMore": true
}
```

Example final page:

```json
{
  "hasMore": false
}
```

When `hasMore` is false, `nextCursor` shall be absent.

---

# 13. Empty Catalog Response

A valid empty catalog shall return:

```json
{
  "items": [],
  "page": {
    "hasMore": false
  },
  "catalogRevision": 0
}
```

An empty valid result is not an error.

---

# 14. Empty Filter Result

A valid query returning no matching publications shall use the same structure:

```json
{
  "items": [],
  "page": {
    "hasMore": false
  },
  "catalogRevision": 42
}
```

The client shall distinguish:

```text
empty result
```

from:

```text
catalog request failure
```

---

# 15. CatalogRevision Role

Every page belongs to one authoritative:

```text
CatalogRevision
```

The revision identifies the catalog-visible state used to produce the page.

The same revision shall appear on every page in one consistent pagination sequence.

---

# 16. Snapshot Consistency

The baseline pagination contract shall provide:

```text
revision-consistent keyset navigation
```

The cursor binds the sequence to the CatalogRevision active when the first page was created.

---

# 17. Snapshot Interpretation

A revision-consistent sequence means:

* every cursor carries the original CatalogRevision;
* continuation validates that revision;
* the server does not silently switch to a newer revision;
* the client either completes the sequence under that revision or restarts;
* pages shall not mix revisions.

---

# 18. Catalog Mutation During Pagination

When the catalog changes after the first page:

```text
revision 42
    ↓
new mutation
    ↓
revision 43
```

a cursor created under revision 42 shall not silently continue under revision 43.

The server shall apply one of two governed strategies:

1. continue against a retained revision snapshot;
2. reject and require restart.

The approved v1 strategy is:

```text
reject and require restart
```

---

# 19. Revision Mismatch Error

When a cursor revision differs from the active supported revision:

```text
CATALOG_CURSOR_REVISION_MISMATCH
```

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
restart from the first page
```

---

# 20. Why Revision Retention Is Not Required

The initial server shall not retain historical catalog snapshots solely to support old cursors.

This avoids:

* snapshot-storage growth;
* multi-version read complexity;
* long-lived cursor state;
* cleanup policy;
* additional persistence structures.

A future retained-snapshot model requires explicit architectural approval.

---

# 21. Cursor Opacity

The cursor shall be opaque to clients.

Clients shall not:

* decode it;
* modify it;
* combine it with another query;
* derive the next position;
* persist assumptions about its structure;
* compare cursors lexically.

---

# 22. Cursor Representation

The cursor is represented as a bounded string.

Contract:

```yaml
type: string
minLength: 1
maxLength: 2048
```

The server may use:

* Base64URL-encoded signed payload;
* encrypted token;
* server-side cursor identifier;
* equivalent opaque representation.

The client contract remains unchanged.

---

# 23. Selected Cursor Strategy

The approved v1 strategy is:

```text
stateless signed cursor
```

The cursor shall encode a canonical payload and a signature.

---

# 24. Stateless Cursor Rationale

A stateless cursor avoids:

* server-side cursor tables;
* cursor cleanup jobs;
* cursor-session affinity;
* server-memory dependency;
* permanent cursor state.

It supports simple NAS deployment and server restart.

---

# 25. Cursor Payload

The internal cursor payload should contain:

```text
cursorVersion
masterLibraryId
catalogRevision
sort
normalizedFilters
normalizedQuery?
lastSortKey
lastPublicationId
issuedAt
expiresAt?
```

These fields are internal.

Their names and encoding are not public API.

---

# 26. Cursor Signature

The cursor shall be protected against modification.

The preferred implementation is:

```text
HMAC-SHA-256
```

using a server-side cursor-signing secret.

The signing secret shall:

* remain outside source control;
* remain outside the database where practical;
* survive container replacement;
* be backed up where cursor continuity across restore is required;
* never enter logs or responses.

---

# 27. Cursor Confidentiality

Cursor contents are not necessarily secret.

However, clients shall still treat them as opaque.

Encryption is optional.

Integrity protection is mandatory.

---

# 28. Cursor Version

The cursor shall contain an internal format version.

Example conceptual value:

```text
cursorVersion = 1
```

This allows cursor parsing to evolve independently from the public API version.

An unsupported cursor format shall return:

```text
CATALOG_CURSOR_INVALID
```

---

# 29. Cursor Expiration

The initial cursor may have a bounded lifetime.

Recommended default:

```text
15 minutes
```

The exact operational value shall be configurable.

Cursor expiration limits:

* long-lived stale traversal;
* indefinite signing-key dependency;
* invalid continuation after major catalog changes.

---

# 30. Cursor Expiration Behavior

An expired cursor shall return:

```text
CATALOG_CURSOR_INVALID
```

HTTP:

```text
400 Bad Request
```

Client action:

```text
restart pagination
```

The response may safely state that the cursor expired.

---

# 31. Cursor Scope

A cursor shall be scoped to exactly one:

```text
ServerId
MasterLibraryId
API version
CatalogRevision
query
filter set
sort order
```

A cursor from another context shall be rejected.

---

# 32. Cursor Server Binding

A cursor issued by one server shall not be valid on another server.

The signature usually enforces this implicitly.

If a shared signing key is accidentally reused, the cursor payload shall still bind to ServerId.

---

# 33. Cursor Library Binding

A cursor issued under one MasterLibraryId shall not be accepted under another MasterLibraryId.

Mismatch shall produce:

```text
CATALOG_CURSOR_INVALID
```

or:

```text
MASTER_LIBRARY_IDENTITY_MISMATCH
```

The preferred cursor-specific mapping is:

```text
CATALOG_CURSOR_INVALID
```

while client trust logic separately detects Library identity changes.

---

# 34. Cursor Query Binding

A cursor shall include the normalized search query used for the sequence.

Example:

```text
query = "marine biology"
```

A continuation request with another query shall be rejected.

---

# 35. Cursor Filter Binding

The cursor shall bind all filters.

Examples:

```text
language = es
publicationType = BOOK
availability = AVAILABLE
subject = Biology
```

Missing and empty filters shall normalize consistently.

---

# 36. Cursor Sort Binding

The cursor shall bind the sort order.

A cursor created with:

```text
TITLE_ASC
```

cannot continue with:

```text
UPDATED_AT_DESC
```

Mismatch shall produce `CATALOG_CURSOR_INVALID`.

---

# 37. Cursor Page-Size Binding

The cursor does not need to require an identical page size.

The client may request a smaller or equal supported page size on continuation.

The server shall enforce:

```text
1 <= pageSize <= maximum
```

The preferred v1 policy is:

```text
page size may change between pages
```

because keyset position remains valid.

---

# 38. Page Size

The approved initial page-size contract is:

```text
minimum = 1
default = 50
maximum = 100
```

Schema:

```yaml
type: integer
format: int32
minimum: 1
maximum: 100
default: 50
```

---

# 39. Page-Size Omission

When `pageSize` is omitted:

```text
50
```

shall be used.

The effective page size need not be returned unless useful for diagnostics.

---

# 40. Oversized Page Request

A page size greater than 100 shall return:

```text
INVALID_PAGINATION
```

HTTP:

```text
400 Bad Request
```

The server shall not silently clamp the value.

---

# 41. Zero or Negative Page Size

Values below 1 shall return:

```text
INVALID_PAGINATION
```

The server shall not reinterpret zero as the default.

---

# 42. Deterministic Ordering

Every catalog query shall define a total deterministic order.

A total order requires:

```text
primary sort key
+
PublicationId tie breaker
```

No page sequence may rely on a non-unique key alone.

---

# 43. Default Ordering

The default catalog order is:

```text
TITLE_ASC
```

The total ordering is:

```text
normalizedTitle ASC
PublicationId ASC
```

---

# 44. Title Normalization

The server shall maintain a deterministic normalized title key.

The key may apply:

* Unicode normalization;
* case folding;
* whitespace normalization;
* locale-independent comparison.

The normalized key shall not replace the public display title.

---

# 45. Title Ordering Stability

Title ordering shall be deterministic across:

* server restart;
* pagination requests;
* equivalent queries;
* supported NAS environments.

The ordering implementation shall not depend on an uncontrolled host locale.

---

# 46. TITLE_DESC

The total order is:

```text
normalizedTitle DESC
PublicationId DESC
```

The direction of the tie breaker shall match the primary order direction unless an explicit consistent alternative is frozen.

---

# 47. CREATED_AT_ASC

The total order is:

```text
createdAt ASC
PublicationId ASC
```

---

# 48. CREATED_AT_DESC

The total order is:

```text
createdAt DESC
PublicationId DESC
```

---

# 49. UPDATED_AT_ASC

The total order is:

```text
updatedAt ASC
PublicationId ASC
```

---

# 50. UPDATED_AT_DESC

The total order is:

```text
updatedAt DESC
PublicationId DESC
```

---

# 51. Tie-Breaker Requirement

PublicationId shall always be part of the keyset predicate.

Example for `TITLE_ASC`:

```text
normalizedTitle > lastTitle
OR
(
    normalizedTitle = lastTitle
    AND PublicationId > lastPublicationId
)
```

---

# 52. Descending Keyset Predicate

Example for `UPDATED_AT_DESC`:

```text
updatedAt < lastUpdatedAt
OR
(
    updatedAt = lastUpdatedAt
    AND PublicationId < lastPublicationId
)
```

---

# 53. Cursor Position

The cursor shall represent the final returned item from the previous page.

The next page begins strictly after that item according to the selected total order.

---

# 54. No Duplicate Boundary Item

The boundary item from one page shall not appear again as the first item of the next page.

The keyset comparison shall use strict ordering.

---

# 55. No Skipped Items in Stable Revision

Under the same CatalogRevision and query context, every matching item shall appear exactly once when the client follows all cursors to completion.

---

# 56. Search Ordering

When `query` is present, the baseline ordering remains the explicitly requested catalog sort.

The initial version shall not introduce relevance sorting unless a stable total relevance order is fully defined.

---

# 57. Relevance Sorting Deferred

A future:

```text
RELEVANCE_DESC
```

sort requires:

* deterministic relevance score;
* stable tie breakers;
* cursor score representation;
* compatibility rules;
* explicit tests.

It is not part of v1.

---

# 58. Filter Semantics

Filters are combined using:

```text
logical AND
```

Example:

```text
language = es
AND publicationType = BOOK
AND availability = AVAILABLE
```

Multiple values for one filter are not required in v1 unless explicitly defined.

---

# 59. Language Filter

Example:

```text
?language=es
```

The server shall compare normalized LanguageCode values.

A broader match such as `es` matching `es-AR` is not assumed unless explicitly documented.

The approved baseline is:

```text
exact normalized language-tag match
```

---

# 60. Publication Type Filter

Example:

```text
?publicationType=BOOK
```

Unknown values shall return `VALIDATION_ERROR`.

---

# 61. Availability Filter

Example:

```text
?availability=AVAILABLE
```

This filter refers to remote server-authoritative publication availability.

It does not filter by device-local presence.

---

# 62. Subject Filter

Example:

```text
?subject=Biology
```

The initial subject filter shall use normalized exact subject matching.

Partial subject search remains part of the general search query.

---

# 63. Search Query

Example:

```text
?query=marine%20ecology
```

The search applies to approved metadata fields:

```text
title
subtitle
contributors
subjects
publisher
```

The exact fields remain aligned with `CatalogContracts.md`.

---

# 64. Query Normalization

The server shall normalize search input deterministically.

Potential normalization:

* trim;
* collapse repeated whitespace;
* Unicode normalization;
* case folding.

The original query need not be stored in the cursor if the canonical normalized form is stored.

---

# 65. Empty Query

An absent query means no search.

An empty or whitespace-only query shall either:

* normalize to no query;
* or be rejected.

The approved baseline is:

```text
normalize empty query to absence
```

This behavior shall be consistent across first-page and continuation requests.

---

# 66. Query Length Limit

The approved maximum query length is:

```text
512 characters
```

Longer values return:

```text
INVALID_SEARCH_QUERY
```

---

# 67. Stable Filter Serialization

The server shall serialize normalized filters canonically before signing the cursor.

Canonicalization shall avoid differences caused by:

* parameter order;
* omitted default values;
* equivalent letter casing;
* empty strings;
* duplicate parameters.

---

# 68. Cursor Tampering

A modified cursor shall fail signature verification.

The server shall return:

```text
CATALOG_CURSOR_INVALID
```

HTTP:

```text
400 Bad Request
```

The server shall not reveal which cursor component failed.

---

# 69. Invalid Cursor Encoding

Malformed Base64URL, invalid structure or unsupported cursor version shall return the same public code:

```text
CATALOG_CURSOR_INVALID
```

This reduces unnecessary internal-detail exposure.

---

# 70. Cursor and Authentication

Catalog cursors are not authentication credentials.

They shall not:

* authorize a request;
* contain Bearer credentials;
* contain PairingCodes;
* bypass device authorization;
* be accepted without normal endpoint authentication.

---

# 71. Cursor Sensitivity

Cursors may contain query and position information internally.

They should not be logged in full.

Logs may contain:

* cursor hash;
* cursor version;
* CatalogRevision;
* sort;
* safe normalized filter summary.

---

# 72. Cursor Logging

Production logs shall avoid writing the complete cursor string because it may contain encoded metadata and increases log volume.

---

# 73. Cursor Error Details

Safe error details may include:

```json
{
  "reason": "REVISION_MISMATCH",
  "restartRequired": true
}
```

They shall not include:

* decoded cursor payload;
* signature;
* signing secret;
* internal sort keys.

---

# 74. Catalog Change Between Pages

When revision changes, the client shall:

1. stop current sequence;
2. discard the pending continuation cursor;
3. request a new first page;
4. replace or merge its snapshot according to client cache policy;
5. avoid showing duplicate rows.

---

# 75. Client Restart Strategy

The recommended restart strategy is:

```text
begin new sequence
replace derived catalog snapshot
preserve selected local UI context where possible
```

The client may keep previously displayed data while loading the new first page, but it shall label it as stale until refreshed.

---

# 76. Local Catalog Snapshot

The client may persist catalog pages locally.

The snapshot shall be scoped to:

```text
ServerId
MasterLibraryId
CatalogRevision
query/filter/sort context
```

---

# 77. Full Catalog Snapshot

The macOS client may progressively build a full local catalog metadata snapshot by following all pages.

This does not create a local replica of publication payloads.

The snapshot contains metadata only.

---

# 78. Snapshot Authority

The persisted client snapshot is:

```text
derived
replaceable
possibly stale
non-authoritative
```

The server Master Catalog remains authoritative.

---

# 79. Offline Catalog Browsing

When offline, the client may display the latest valid cached snapshot.

The UI shall distinguish:

```text
online current catalog
offline cached catalog
```

The client shall not claim current CatalogRevision while offline unless it was previously confirmed.

---

# 80. Offline Pagination

A client may paginate its local cached snapshot using local persistence.

Those local cursors are client-internal and shall not be confused with server-issued catalog cursors.

---

# 81. Cursor Persistence

A client may persist an active server cursor for short-term continuation.

However, it shall expect the cursor to expire or become invalid.

The client shall always support restart from the first page.

---

# 82. Long-Lived Cursor Assumption Prohibited

The client shall not treat a cursor as:

* a permanent bookmark;
* a publication identifier;
* a reusable synchronization token;
* a durable catalog revision token.

---

# 83. CatalogRevision as Refresh Token

CatalogRevision may be used to determine whether a cached catalog snapshot is current.

It shall not be used as a cursor by itself.

---

# 84. Revision Check Endpoint

The server may expose:

```text
GET /v1/catalog/revision
```

Response:

```json
{
  "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
  "catalogRevision": 42,
  "updatedAt": "2026-07-16T18:00:00Z"
}
```

The client may compare this value with its cached snapshot before reloading all pages.

---

# 85. Revision Equality

When:

```text
remote CatalogRevision
=
cached CatalogRevision
```

the client may treat the cached catalog metadata as current for the same MasterLibraryId.

---

# 86. Revision Difference

When revisions differ, the v1 client shall refresh the catalog.

Incremental delta synchronization is not required in Module 1.

---

# 87. Delta Catalog Deferred

A future contract may support:

```text
catalog changes since revision
```

This requires:

* mutation history;
* deletion/withdrawal records;
* ordering semantics;
* retention policy;
* compatibility rules.

It is outside v1.

---

# 88. Page Prefetch

The client may prefetch the next page when:

* current page is loaded successfully;
* `hasMore` is true;
* a valid cursor exists;
* network conditions permit;
* no other request for the same cursor is active;
* memory and persistence limits permit.

---

# 89. Prefetch Is Optional

Prefetch is a client optimization.

The server contract shall behave identically whether pages are requested:

* interactively;
* automatically;
* sequentially;
* after a short delay.

---

# 90. Prefetch Cancellation

The client may cancel prefetch when:

* query changes;
* filter changes;
* sort changes;
* server disconnects;
* view closes;
* CatalogRevision changes;
* user initiates a new catalog context.

---

# 91. Duplicate Request Handling

Repeated GET requests with the same cursor shall return the same logical page while:

* the cursor remains valid;
* the CatalogRevision remains active;
* the query context remains unchanged.

The request is idempotent.

---

# 92. Parallel Page Requests

The client should not request several dependent pages in parallel because each next cursor is produced by the previous page.

Independent first-page queries with different contexts may execute concurrently.

---

# 93. Concurrent Identical Cursor Requests

The server may process identical cursor requests concurrently.

They shall not mutate catalog state.

Results shall remain logically identical under the same revision.

---

# 94. Page Item Count

A page may contain fewer items than requested when:

* the result set ends;
* the server applies a documented smaller operational limit;
* filtered records are exhausted.

The server shall not return `hasMore = true` without a valid `nextCursor`.

---

# 95. Exact Page Size Not Guaranteed

The client shall not assume:

```text
items.count = pageSize
```

It shall rely on:

```text
hasMore
nextCursor
```

---

# 96. Final Page

A final page shall satisfy:

```text
hasMore = false
nextCursor absent
```

---

# 97. Invalid Page Contract

The following combination is invalid:

```json
{
  "page": {
    "hasMore": true
  }
}
```

because `nextCursor` is missing.

---

# 98. Invalid Final Page Contract

The following combination is invalid:

```json
{
  "page": {
    "hasMore": false,
    "nextCursor": "..."
  }
}
```

The server contract tests shall reject it.

---

# 99. CatalogRevision Presence

Every successful page response shall contain CatalogRevision, including:

* empty page;
* final page;
* filtered result;
* search result.

---

# 100. Page Metadata Extensibility

Future compatible optional fields may include:

```text
returnedCount
estimatedTotal
queryTimeMs
```

However, the client shall not depend on total count unless explicitly frozen.

---

# 101. Total Count

The v1 pagination contract does not require:

```text
totalCount
```

---

# 102. Why Total Count Is Deferred

Exact total counts may add:

* query overhead;
* duplicate work;
* expensive filtered counts;
* misleading values during revision changes.

The client can browse without it.

---

# 103. Estimated Count

An optional estimated count may be added later.

It shall be clearly marked as approximate.

It shall not control page completion.

---

# 104. Catalog Position Display

The client shall not display:

```text
page 8 of 42
```

unless a true total-page contract exists.

Preferred UI:

* continuous list;
* load more;
* progress through locally cached results;
* search-result count only when explicitly available.

---

# 105. Pagination and Covers

Catalog pages shall not embed full cover binaries.

They may include:

```text
coverAvailable
cover ETag
cover aspect metadata
```

The client retrieves covers independently.

---

# 106. Cover Prefetch

Cover prefetch is independent from page continuation.

Failure to fetch a cover shall not fail the catalog page.

---

# 107. Pagination and Acquisition

Catalog pagination does not create AcquisitionOperations.

Selecting a catalog item and starting download is a separate client action.

The cursor shall not contain acquisition state.

---

# 108. Pagination and Local Availability

Server catalog pages shall not include device-local availability.

The client combines:

```text
remote PublicationSummary
+
local LocalLibraryItem
```

into a presentation projection.

---

# 109. Pagination and Personal State

Catalog cursors, filters and responses shall not contain:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes;
* CloudKit state.

---

# 110. Pagination and Withdrawal

A withdrawn publication may:

* remain visible in catalog results;
* be excluded by default;
* appear when explicitly filtered.

The exact visibility policy belongs in `CatalogContracts.md`.

Whatever policy is chosen shall remain deterministic for the cursor sequence.

---

# 111. Default Availability Scope

The recommended default catalog scope is:

```text
AVAILABLE
+
UNAVAILABLE
+
CORRUPTED
```

with `WITHDRAWN` excluded from ordinary Reader browsing.

The final decision shall be frozen in `CatalogContracts.md`.

---

# 112. Filter Change

Any client change to:

* query;
* language;
* publication type;
* availability;
* subject;
* sort;

shall start a new first-page request.

The prior cursor sequence becomes irrelevant.

---

# 113. Debounced Search

The client may debounce search input.

Each executed normalized search query creates a new pagination context.

Responses from older contexts shall not overwrite newer results.

---

# 114. Client Request Identity

The client should associate each catalog sequence with a local request-generation identifier.

This prevents late responses from an old query from replacing current UI state.

This identifier is client-internal.

---

# 115. Cancellation

Catalog requests may be cancelled by the client.

Cancellation:

* does not invalidate the cursor;
* does not mutate server state;
* does not produce a Domain failure;
* may be retried with the same cursor while it remains valid.

---

# 116. Server Query Timeout

If a catalog query exceeds the bounded server timeout:

```text
CATALOG_QUERY_FAILED
```

or:

```text
REQUEST_TIMEOUT
```

shall be returned according to the actual failure classification.

---

# 117. Catalog Unavailable

If catalog persistence is unavailable:

```text
CATALOG_UNAVAILABLE
```

HTTP:

```text
503 Service Unavailable
```

The client may continue displaying cached metadata.

---

# 118. Invalid Cursor Error

Canonical response:

```json
{
  "error": {
    "code": "CATALOG_CURSOR_INVALID",
    "message": "The catalog cursor is invalid or expired.",
    "requestId": "136a3973-154a-4204-b41c-1601fd23df13",
    "retryable": false,
    "details": {
      "restartRequired": true
    }
  }
}
```

---

# 119. Revision Mismatch Error Response

```json
{
  "error": {
    "code": "CATALOG_CURSOR_REVISION_MISMATCH",
    "message": "The catalog changed while pagination was in progress.",
    "requestId": "136a3973-154a-4204-b41c-1601fd23df13",
    "retryable": true,
    "details": {
      "cursorCatalogRevision": 42,
      "currentCatalogRevision": 43,
      "restartRequired": true
    }
  }
}
```

---

# 120. Revision Detail Safety

Exposing CatalogRevision values is safe and useful.

The response shall not expose:

* internal transaction IDs;
* database row versions;
* cursor sort keys;
* cursor signature.

---

# 121. Page Validation

The server shall validate before query execution:

* pageSize;
* cursor syntax;
* cursor signature;
* cursor version;
* cursor expiration;
* Library binding;
* revision binding;
* filter binding;
* sort binding;
* API-version binding.

---

# 122. Validation Order

The server should validate inexpensive properties before expensive catalog access.

Conceptual order:

```text
request syntax
    ↓
authentication
    ↓
cursor decode
    ↓
cursor signature
    ↓
cursor compatibility
    ↓
Master Library context
    ↓
CatalogRevision
    ↓
catalog query
```

Authentication may precede cursor parsing to reduce information exposure.

---

# 123. Cursor Signing-Key Rotation

Cursor signing-key rotation invalidates outstanding cursors unless multiple keys are temporarily supported.

The v1 baseline may invalidate outstanding cursors.

This is acceptable because clients must support restart.

---

# 124. Cursor Rotation Error

A cursor invalidated by signing-key rotation returns:

```text
CATALOG_CURSOR_INVALID
```

The server shall not reveal signing-key details.

---

# 125. Server Restart

A stateless signed cursor remains valid after server restart when:

* signing secret is preserved;
* CatalogRevision remains unchanged;
* cursor has not expired.

---

# 126. Server Restore

After restoring an older backup:

* CatalogRevision may move backward only if the complete Master Library is restored consistently;
* clients may detect unexpected state;
* existing cursors should be considered invalid;
* trust and restore policy shall govern cache replacement.

Outstanding cursors need not survive restore.

---

# 127. Cursor Secret Backup

The cursor-signing secret may be included in secure server configuration backup.

However, cursor continuity is not a critical restore requirement.

The server may deliberately rotate the secret after restore.

---

# 128. Cursor Size

The server shall keep cursors reasonably small.

Maximum public length:

```text
2048 characters
```

A cursor exceeding this limit shall be rejected.

---

# 129. Query Parameter URL Length

Clients shall avoid excessively long filter values.

The complete catalog URL shall remain within practical HTTP limits.

Future complex filters should use a dedicated search request only if required.

---

# 130. GET Request Choice

Catalog browsing uses GET because:

* requests are safe;
* requests are idempotent;
* URLs remain bounded;
* standard HTTP caching remains possible;
* pagination context is represented by an opaque cursor.

---

# 131. POST Search Deferred

A POST-based complex search contract is deferred until query complexity exceeds safe GET constraints.

---

# 132. HTTP Caching

Catalog page responses may return:

```text
ETag
Cache-Control
```

A cache entry shall be scoped to the complete request context.

---

# 133. Conditional Catalog Request

The client may use:

```text
If-None-Match
```

for a previously retrieved first page or revision endpoint where supported.

Conditional behavior shall not replace cursor validation.

---

# 134. Page ETag

A page ETag may derive from:

```text
MasterLibraryId
CatalogRevision
query context
cursor position
page size
```

Clients shall treat it as opaque.

---

# 135. 304 Response

When conditional requests are supported and the page remains unchanged:

```text
304 Not Modified
```

may be returned without a body.

The client shall retain its cached page and associated CatalogRevision.

---

# 136. Cache-Control Baseline

Recommended catalog metadata response:

```text
Cache-Control: private, max-age=0, must-revalidate
```

The exact policy may be refined during Server implementation.

---

# 137. Private Cache

Catalog responses are authenticated and shall not be placed in shared public caches.

---

# 138. Pagination Security

The pagination contract shall protect against:

* cursor tampering;
* cursor reuse across Libraries;
* uncontrolled page sizes;
* unbounded search values;
* arbitrary query-language injection;
* SQL injection;
* unauthorized catalog enumeration;
* excessive repeated requests.

---

# 139. Query Construction Security

The server shall build catalog queries through parameterized database APIs.

Cursor sort values shall map to an allowlisted internal sort definition.

Clients shall never supply raw SQL sort expressions.

---

# 140. Sort Allowlist

Only values defined by `CatalogSortOrder` are permitted.

Unknown values return:

```text
VALIDATION_ERROR
```

---

# 141. Filter Allowlist

Only documented filters are permitted.

Administrative or internal fields shall not become filterable through arbitrary query parameter names.

---

# 142. Cursor as Untrusted Input

Even though the cursor is server-issued and signed, every decoded field shall still be validated.

Malformed signed payloads shall not enter query construction.

---

# 143. Rate Limiting

Catalog endpoints may apply:

* per-device request limits;
* search-query rate limits;
* concurrency limits.

Rate-limited responses use:

```text
RATE_LIMIT_EXCEEDED
```

or a catalog-specific code if later justified.

---

# 144. Client Backoff

On `429 Too Many Requests`, the client shall honor `Retry-After`.

It shall not create parallel retry storms.

---

# 145. Observability

Catalog request logs should include:

```text
requestId
deviceId
masterLibraryId
catalogRevision
sort
filter summary
query-present flag
pageSize
cursor-present flag
returnedCount
hasMore
duration
result
```

---

# 146. Observability Prohibitions

Logs shall not contain:

* complete cursor;
* credential;
* PairingCode;
* full unbounded search content where privacy policy prohibits it;
* personal state.

Search text logging should be configurable or hashed if privacy requires.

---

# 147. Pagination Metrics

Recommended metrics:

```text
catalog_page_requests_total
catalog_page_duration_seconds
catalog_page_items_returned
catalog_cursor_invalid_total
catalog_cursor_revision_mismatch_total
catalog_search_requests_total
catalog_page_size_requested
```

High-cardinality cursor values shall never become metric labels.

---

# 148. Server Implementation Boundary

The server Application layer shall receive a validated pagination request conceptually equivalent to:

```text
CatalogPageRequest
├── pageSize
├── queryContext
├── sortOrder
├── continuationPosition?
└── catalogRevision
```

It shall not receive raw cursor text as Domain meaning.

---

# 149. Cursor Adapter Boundary

A dedicated cursor adapter shall handle:

* canonical payload serialization;
* signing;
* encoding;
* decoding;
* signature validation;
* expiration validation;
* cursor-version validation.

Catalog repositories shall not parse cursor strings directly.

---

# 150. Repository Boundary

The catalog read repository shall receive:

```text
validated keyset position
validated sort
validated filters
validated revision context
page size + 1
```

The repository may fetch:

```text
pageSize + 1
```

items to determine `hasMore`.

---

# 151. Extra-Item Strategy

The preferred implementation is:

```text
fetch pageSize + 1 rows
```

If an extra row exists:

* return only `pageSize`;
* set `hasMore = true`;
* build next cursor from the last returned item.

---

# 152. Final-Page Determination

When fetched rows are less than or equal to `pageSize`:

```text
hasMore = false
```

No next cursor is generated.

---

# 153. Cursor Generation Failure

If query succeeds but cursor generation fails:

* the response shall not claim `hasMore = true` without cursor;
* the request shall fail safely;
* `INTERNAL_ERROR` or specific cursor error shall be logged;
* no malformed page shall be returned.

---

# 154. Catalog Projection

Pagination shall operate on:

```text
CatalogEntryProjection
```

rather than loading complete Publication aggregates.

This projection contains only fields required by `PublicationSummary`.

---

# 155. Projection Stability

Every field used in sorting or filtering shall have a stable persisted or deterministic derived representation.

---

# 156. Projection Mutation

CatalogRevision shall advance when any field that can change a catalog page result changes.

Examples:

* title;
* contributors if searchable;
* subject;
* publication type;
* availability;
* creation of publication;
* withdrawal visibility;
* current SourceVersion.

---

# 157. Revision Advancement and Search

If a metadata change affects search matching, CatalogRevision shall advance.

Otherwise, an old cursor could produce inconsistent results.

---

# 158. Revision Advancement and Sort

If a metadata change affects the active sort key, CatalogRevision shall advance.

Examples:

* title changes under title sort;
* updatedAt changes under updated sort.

The global revision policy already advances for catalog-visible changes.

---

# 159. CatalogRevision Atomicity

A catalog-visible mutation and its revision advancement shall commit atomically in persistence.

A client shall never observe:

```text
new catalog data
+
old CatalogRevision
```

or:

```text
new CatalogRevision
+
old catalog data
```

---

# 160. Pagination Consistency Transaction

A single page query should read:

* active CatalogRevision;
* matching catalog rows;

from a transactionally consistent database view.

---

# 161. SQLite Read Transaction

The server implementation should use one SQLite read transaction or equivalent consistent query boundary for:

1. revision validation;
2. keyset query;
3. page construction.

---

# 162. Mutation Race

If CatalogRevision changes immediately after the page read transaction:

* the returned page remains valid for the revision it reports;
* the next cursor will later be rejected if the active revision changed;
* the client restarts.

---

# 163. First-Page Race

The first page shall capture the revision used by the row query.

It shall not read revision before or after using unrelated snapshots.

---

# 164. Client UI Behavior

The client should expose catalog pagination as:

* continuous scrolling;
* explicit load-more;
* or incremental background population.

It shall not expose cursor details.

---

# 165. Loading States

Recommended client states:

```text
IDLE
LOADING_INITIAL
LOADING_MORE
REFRESHING
LOADED
EMPTY
OFFLINE_CACHED
FAILED
```

---

# 166. Initial Loading Failure

If initial loading fails and cached data exists:

* cached data may remain visible;
* the client shall mark it stale or offline;
* the error shall not clear valid local publications.

---

# 167. Load-More Failure

If continuation loading fails:

* already loaded items remain visible;
* the cursor may be retained for retry if the error is transient;
* invalid or mismatched cursor requires restart;
* duplicate items shall not be appended.

---

# 168. Client Deduplication

Even with a valid contract, the client should deduplicate appended catalog items by:

```text
PublicationId
```

This is defensive behavior.

It shall not hide systematic server pagination defects in tests.

---

# 169. Result Replacement

A new first-page result for another query context shall replace the prior sequence rather than append to it.

---

# 170. Stale Response Protection

The client shall associate responses with the active query context.

A response for an old query shall be discarded from current UI state.

---

# 171. Selection Preservation

When catalog refresh restarts, the client may preserve the selected PublicationId if it still exists in the refreshed result or detail cache.

This is Presentation behavior.

---

# 172. Scroll Position Preservation

The client may preserve approximate scroll position by PublicationId after refresh.

It shall not persist or reuse an obsolete cursor as a scroll bookmark.

---

# 173. Cursor and Bookmark Separation

A user bookmark shall use PublicationId.

It shall never use CatalogCursor.

---

# 174. Accessibility

Incremental catalog loading shall provide accessible loading and failure states.

Cursor implementation details shall remain invisible to assistive technologies.

---

# 175. Contract Fixtures

Required fixtures:

```text
catalog-first-page.json
catalog-middle-page.json
catalog-final-page.json
catalog-empty-page.json
catalog-filtered-page.json
catalog-search-page.json
catalog-invalid-cursor-error.json
catalog-revision-mismatch-error.json
catalog-unknown-sort-error.json
catalog-page-size-error.json
```

---

# 176. Cursor Test Fixture Policy

Production cursor signing secrets shall not be used in fixtures.

Tests shall use deterministic test keys and synthetic cursors.

---

# 177. Contract Tests

Required contract tests include:

* first page;
* continuation page;
* final page;
* empty result;
* default page size;
* maximum page size;
* invalid page size;
* each supported sort;
* duplicate sort-key values;
* filters;
* search;
* cursor tampering;
* cursor expiration;
* cursor query mismatch;
* cursor filter mismatch;
* cursor sort mismatch;
* cursor Library mismatch;
* revision mismatch;
* server restart;
* unknown cursor version.

---

# 178. Deterministic Ordering Test

The test catalog shall contain several publications with identical normalized titles.

The sequence shall prove:

```text
normalizedTitle
+
PublicationId
```

produces stable ordering.

---

# 179. No-Duplicate Test

A full traversal shall verify:

* no PublicationId appears twice;
* all matching PublicationId values appear;
* page boundaries do not repeat the final prior item.

---

# 180. No-Omission Test

Given a stable CatalogRevision, a complete traversal shall return exactly the expected matching set.

---

# 181. Mutation-During-Pagination Test

Test sequence:

1. request first page under revision 42;
2. mutate catalog;
3. revision advances to 43;
4. use cursor from revision 42;
5. receive `CATALOG_CURSOR_REVISION_MISMATCH`;
6. restart first page;
7. receive revision 43.

---

# 182. Cursor Tampering Test

Test sequence:

1. obtain valid cursor;
2. modify one encoded character;
3. send continuation request;
4. receive `CATALOG_CURSOR_INVALID`;
5. verify no decoded internal data is exposed.

---

# 183. Cursor Expiration Test

Test sequence:

1. create cursor with test clock;
2. advance clock beyond expiration;
3. request continuation;
4. receive invalid-cursor error;
5. verify restartRequired.

---

# 184. Query-Binding Test

Test sequence:

1. request first page with query `biology`;
2. obtain cursor;
3. continue with query `astronomy`;
4. receive `CATALOG_CURSOR_INVALID`.

---

# 185. Filter-Binding Test

The same behavior shall be tested for:

* language;
* publication type;
* availability;
* subject.

---

# 186. Sort-Binding Test

A cursor created for `TITLE_ASC` shall fail when reused with `UPDATED_AT_DESC`.

---

# 187. Library-Binding Test

A cursor from one MasterLibraryId shall fail under another MasterLibraryId.

---

# 188. Page-Size Change Test

A cursor created with page size 50 may continue with page size 25.

The sequence shall remain correct.

Requests above the maximum shall fail.

---

# 189. Server Restart Test

With preserved signing secret and unchanged revision:

* obtain cursor;
* restart server;
* continue successfully.

---

# 190. Signing-Key Rotation Test

After cursor-signing-key rotation:

* existing cursor fails;
* first-page restart succeeds;
* error exposes no key details.

---

# 191. OpenAPI Tests

OpenAPI shall prove:

* `cursor` optional on first request;
* `pageSize` bounded;
* sort enum exact;
* filter enums exact;
* response envelope exact;
* nextCursor optional;
* `hasMore` required;
* CatalogRevision required;
* errors documented.

---

# 192. Swift Client Tests

Swift tests shall verify:

* page decoding;
* absent nextCursor on final page;
* invalid page combination rejected;
* unknown future response fields ignored;
* revision mismatch triggers restart behavior;
* stale responses do not replace active query;
* loaded items remain after transient load-more failure.

---

# 193. Performance Tests

Performance tests shall measure:

* first-page query latency;
* continuation latency;
* maximum page size;
* search query latency;
* title-sort keyset performance;
* updatedAt-sort performance;
* memory per page;
* cursor generation cost.

---

# 194. Index Requirements

The persistence layer shall provide indexes aligned with supported sort and filter patterns.

Expected index direction includes:

```text
normalizedTitle + PublicationId
createdAt + PublicationId
updatedAt + PublicationId
availability
publicationType
language
```

Final index design belongs in `CatalogSchema.md`.

---

# 195. Performance Target Direction

The first page and continuation page should remain responsive for the reference NAS and expected catalog scale.

Exact latency targets shall be frozen in Performance and Acceptance Criteria documents.

---

# 196. Catalog Scale Assumption

The v1 design shall support at least:

```text
100,000 catalog entries
```

without changing the public pagination model.

This is a design target, not a claim until measured.

---

# 197. Cursor Generation Determinism

Given the same:

* cursor payload;
* signing key;
* serialization;
* time values;

test generation shall be deterministic.

Production cursors may differ because of issuance time.

---

# 198. Canonical Cursor Serialization

The server shall serialize cursor payload fields in a canonical order before signing.

This avoids inconsistent signatures across equivalent payloads.

---

# 199. Cursor Clock

Cursor issuance and expiration shall use an injected server Clock.

Tests shall not depend on wall-clock time.

---

# 200. Cursor Error Atomicity

An invalid cursor shall fail before any page result is returned.

The server shall not return partial items with an error.

---

# 201. Pagination Completion Gate

This document is complete when:

```text
[ ] Cursor-based pagination is frozen
[ ] Offset pagination is rejected
[ ] First-page request is defined
[ ] Continuation request is defined
[ ] Page response is defined
[ ] Empty result is defined
[ ] CatalogRevision interaction is defined
[ ] Revision mismatch behavior is defined
[ ] Cursor opacity is defined
[ ] Cursor strategy is defined
[ ] Cursor signature is defined
[ ] Cursor expiration is defined
[ ] Cursor scope is defined
[ ] Query binding is defined
[ ] Filter binding is defined
[ ] Sort binding is defined
[ ] Page-size behavior is defined
[ ] Deterministic ordering is defined
[ ] Tie breakers are defined
[ ] Search behavior is defined
[ ] Filter semantics are defined
[ ] Client restart behavior is defined
[ ] Offline snapshot behavior is defined
[ ] Prefetch behavior is defined
[ ] HTTP caching is defined
[ ] Security behavior is defined
[ ] Observability is defined
[ ] Repository boundary is defined
[ ] SQLite consistency direction is defined
[ ] Contract fixtures are defined
[ ] Testing obligations are defined
[ ] Performance direction is defined
[ ] Personal-state exclusion is preserved
[ ] Local Library independence is preserved
[ ] No architectural contradiction remains
```

---

# 202. Pagination Invariants

The following invariants apply:

* Every sequence belongs to one MasterLibraryId.
* Every sequence belongs to one CatalogRevision.
* Every sequence belongs to one normalized query context.
* Every sequence belongs to one sort order.
* Every cursor is opaque.
* Every cursor is integrity-protected.
* Cursors do not authorize requests.
* Pages use deterministic total ordering.
* PublicationId is always the tie breaker.
* A stable sequence returns every matching item exactly once.
* Page boundaries do not duplicate items.
* Revision changes require restart.
* Invalid cursors never produce partial results.
* Page size is bounded.
* A final page has no next cursor.
* `hasMore = true` requires next cursor.
* Catalog responses contain remote state only.
* Local availability remains client-owned.
* Personal state remains excluded.
* Catalog snapshots are derived and replaceable.
* Cursors are not durable bookmarks.
* PublicationId is the durable catalog identity.

---

# 203. Prohibited Pagination Designs

The Master Catalog shall not:

* expose offset pagination as primary behavior;
* expose cursor internals;
* accept unsigned modifiable cursors;
* continue silently under another CatalogRevision;
* mix pages from different revisions;
* sort by a non-unique key without tie breaker;
* use host-locale-dependent ordering;
* return unbounded pages;
* silently clamp invalid page sizes;
* return `hasMore` without a cursor;
* return a cursor on a final page;
* use cursors as authentication;
* place credentials inside cursors;
* use cursors as publication bookmarks;
* include local availability in server catalog pages;
* include acquisition progress in catalog pages;
* include annotations or reading progress;
* require exact total counts;
* treat cached snapshots as server authority;
* preserve obsolete cursors indefinitely.

---

# 204. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `ErrorContracts.md`
* `CatalogContracts.md`
* `PublicationContracts.md`
* `AcquisitionContracts.md`
* `Versioning.md`
* `Compatibility.md`

## Domain

* `../03-Domain/DomainModel.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`

## Technical Design

* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

## Future Persistence

* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/ClientCatalogCache.md`

---

# 205. Status

**Approved**

The Master Catalog pagination model is frozen as:

```text
cursor-based keyset pagination
+
deterministic total ordering
+
PublicationId tie breaker
+
CatalogRevision-bound sequence
+
stateless signed opaque cursors
+
bounded page sizes
+
restart on catalog mutation
```

The next document is:

```text
01-MasterLibrary/04-Contracts/ServerContracts.md
```

It shall define the server identity, public server descriptor, Master Library descriptor, capabilities, authentication methods and server-registration metadata used before catalog access.
