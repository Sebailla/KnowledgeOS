
# Master Library Publication Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Publication Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Reader-facing contracts used to retrieve the complete public representation of one Master Library publication.

It establishes:

* publication identity;
* complete authoritative metadata;
* remote publication availability;
* current source description;
* source-version identity;
* publication-detail retrieval;
* cover retrieval;
* content metadata inspection;
* conditional requests;
* cache behavior;
* client-local projection;
* update detection;
* error behavior;
* compatibility rules;
* security boundaries;
* testing obligations.

This contract describes one logical Publication.

It does not return the publication source payload inside JSON.

---

# 2. Scope

This document defines:

```text
GET  /v1/publications/{publicationId}

GET  /v1/publications/{publicationId}/cover

HEAD /v1/publications/{publicationId}/content
```

It defines the contracts consumed by:

* macOS;
* iPhone;
* iPad;
* administrative clients;
* future compatible Reader applications;
* publication-detail caches;
* acquisition preparation;
* local update detection.

---

# 3. Explicit Exclusions

This document does not define:

* publication binary download;
* byte-range transfer;
* acquisition lifecycle;
* local installation;
* local removal;
* retry and resume;
* source registration;
* source replacement;
* metadata mutation;
* publication withdrawal commands;
* source-version history administration;
* annotation synchronization;
* reading-progress synchronization;
* personal tags;
* favorites;
* personal relationships;
* CloudKit records;
* iCloud replication.

Binary publication transfer is defined in `AcquisitionContracts.md`.

Administrative mutations are defined in `AdministrationContracts.md`.

---

# 4. Core Publication Principle

> A Publication is one stable logical knowledge object. A source file is one immutable representation version of that Publication.

Conceptually:

```text
Publication
├── PublicationId
├── Authoritative Metadata
├── Availability
├── Current SourceVersion
└── Source Versions
    ├── SourceVersion 1
    ├── SourceVersion 2
    └── SourceVersion n
```

The Reader works with a Publication.

It acquires one exact SourceVersion.

---

# 5. Publication Authority

The server owns:

```text
PublicationId
authoritative metadata
remote availability
current SourceVersion
current source integrity metadata
cover metadata
CatalogRevision
createdAt
updatedAt
```

The client owns:

```text
local installation
installed SourceVersion
local integrity
acquisition state
reading progress
annotations
personal tags
favorites
personal relationships
local presentation state
```

---

# 6. Publication Identity

The only public logical identity is:

```text
PublicationId
```

Publication identity shall not derive from:

* filename;
* checksum;
* title;
* ISBN;
* DOI;
* NAS path;
* SourceVersion;
* cover identifier.

---

# 7. Identity Stability

PublicationId remains stable across:

* metadata updates;
* title changes;
* contributor changes;
* subject changes;
* source replacement;
* SourceVersion activation;
* cover replacement;
* temporary unavailability;
* corruption;
* withdrawal;
* restoration.

---

# 8. Source Identity

One exact authoritative source payload is identified by:

```text
ServerId
+
MasterLibraryId
+
PublicationId
+
SourceVersion
```

Checksum and ByteLength verify the payload.

They do not replace this identity.

---

# 9. Authentication

All endpoints defined here require:

```text
Authorization: Bearer <opaque-device-credential>
```

Allowed roles:

```text
READER
ADMINISTRATOR
```

---

# 10. Required Capabilities

Publication detail requires:

```text
PUBLICATION_DETAILS
```

Cover retrieval requires:

```text
PUBLICATION_DETAILS
```

or a future explicit cover capability.

Content metadata inspection requires:

```text
PUBLICATION_DOWNLOAD
```

---

# 11. Library Preconditions

Publication Reader operations require:

* Master Library initialized;
* authenticated Device active;
* compatible API;
* compatible Master Library format;
* catalog readable;
* PublicationId resolvable;
* Library state permitting the requested operation.

---

# 12. Library States Allowing Detail Retrieval

The baseline permits publication-detail retrieval when Library state is:

```text
AVAILABLE
DEGRADED
```

Read-only detail retrieval may be permitted during:

```text
MAINTENANCE
```

when maintenance policy explicitly allows it.

It is prohibited when state is:

```text
UNINITIALIZED
INITIALIZING
UNAVAILABLE
INVALID
UNSUPPORTED
```

---

# 13. GET /v1/publications/

## Purpose

Returns the complete Reader-visible authoritative representation of one Publication.

It does not return:

* source bytes;
* physical paths;
* local state;
* personal state;
* complete administrative source history.

---

# 14. Request

```text
GET /v1/publications/{publicationId}
```

Example:

```text
GET /v1/publications/4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc
```

---

# 15. Path Parameter

```text
publicationId
```

Rules:

* required;
* canonical lowercase UUID;
* treated as opaque;
* validated before application execution;
* never interpreted as a path.

---

# 16. Successful Response

HTTP:

```text
200 OK
```

Content type:

```text
application/json
```

---

# 17. Publication Detail Response

Baseline example:

```json
{
  "serverId": "70309fb9-1837-4a31-8518-926f9c9e957a",
  "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
  "catalogRevision": 42,
  "publication": {
    "publicationId": "4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc",
    "metadata": {
      "title": "Marine Ecology",
      "subtitle": "Principles and Applications",
      "description": "A complete reference work on marine ecosystems, ecological relationships and environmental processes.",
      "contributors": [
        {
          "name": "Jane Example",
          "role": "AUTHOR",
          "order": 0
        },
        {
          "name": "Robert Example",
          "role": "EDITOR",
          "order": 1
        }
      ],
      "language": "en",
      "subjects": [
        "Marine biology",
        "Ecology"
      ],
      "keywords": [
        "marine ecosystems",
        "biodiversity",
        "ocean ecology"
      ],
      "publisher": "Example Scientific Press",
      "edition": "Second Edition",
      "identifiers": {
        "isbn10": "0123456789",
        "isbn13": "9780123456786",
        "doi": "10.1000/example"
      },
      "publicationDate": "2024",
      "publicationType": "BOOK",
      "sourceFormat": "PDF"
    },
    "availability": "AVAILABLE",
    "currentSource": {
      "sourceVersion": 2,
      "format": "PDF",
      "mediaType": "application/pdf",
      "byteLength": 73400320,
      "checksum": {
        "algorithm": "sha-256",
        "value": "98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8"
      },
      "etag": "\"publication-source-opaque-etag\"",
      "rangeSupported": true,
      "createdAt": "2026-07-15T18:30:00Z"
    },
    "cover": {
      "available": true,
      "mediaType": "image/jpeg",
      "etag": "\"cover-opaque-etag\"",
      "width": 1200,
      "height": 1800
    },
    "createdAt": "2026-07-15T18:30:00Z",
    "updatedAt": "2026-07-16T10:00:00Z"
  }
}
```

---

# 18. Top-Level Response

The response shall contain:

```text
serverId
masterLibraryId
catalogRevision
publication
```

This allows the client to validate the complete identity context before merging the response with local state.

---

# 19. PublicationDetails

The `publication` object shall contain:

```text
publicationId
metadata
availability
availabilityReason?
currentSource?
cover
createdAt
updatedAt
```

---

# 20. CatalogRevision

The response shall expose the current CatalogRevision used to produce the detail representation.

This allows:

* cache invalidation;
* consistency checks;
* local catalog reconciliation;
* diagnostics.

---

# 21. Detail and Catalog Revision

Publication detail is not required to belong to an active catalog-pagination cursor sequence.

It shall represent the current authoritative detail at the time of the request.

---

# 22. Publication Metadata

The publication-detail endpoint returns the complete Reader-visible authoritative metadata.

The metadata model includes:

```text
title
subtitle?
description?
contributors
language?
subjects
keywords
publisher?
edition?
identifiers
publicationDate?
publicationType
sourceFormat
```

---

# 23. Title

`title` is required.

Rules:

* non-empty;
* bounded;
* Unicode-preserving;
* authoritative display value;
* not a local alias;
* not a personal title override.

---

# 24. Subtitle

`subtitle` is optional.

An empty subtitle shall be omitted.

---

# 25. Description

The complete authoritative description may be returned.

Rules:

* optional;
* plain text in v1;
* bounded by contract limits;
* may contain paragraphs;
* no HTML unless later explicitly supported;
* no personal notes;
* no generated personal summary.

Recommended maximum:

```text
16384 characters
```

---

# 26. Contributors

Contributors shall preserve authoritative order.

Each entry contains:

```text
name
role
order
```

Initial roles:

```text
AUTHOR
EDITOR
TRANSLATOR
ILLUSTRATOR
CONTRIBUTOR
ORGANIZATION
```

`ORGANIZATION` is added for institutional authorship.

---

# 27. Contributor Organization

An organization contributor remains represented through the same Contributor structure.

Example:

```json
{
  "name": "World Health Organization",
  "role": "ORGANIZATION",
  "order": 0
}
```

It does not create a global Organization entity in Module 1.

---

# 28. Contributor Ordering

Ordering shall be deterministic.

The server shall not sort contributors alphabetically unless the authoritative metadata explicitly uses that order.

---

# 29. Language

`language` uses the canonical BCP 47-compatible value defined in `CommonTypes.md`.

Examples:

```text
es
es-AR
en
en-US
```

---

# 30. Subjects

Subjects are authoritative catalog classifications.

They are:

* server-owned;
* bounded;
* ordered deterministically;
* usable for catalog filtering;
* distinct from personal tags.

---

# 31. Keywords

Keywords are authoritative editorial metadata.

They are distinct from:

* subjects;
* personal tags;
* AI-generated concepts;
* embedding terms;
* annotations.

---

# 32. Keyword Schema

A keyword shall be:

* non-empty;
* trimmed;
* bounded;
* Unicode-preserving.

Recommended limits:

```text
maximum keyword length = 256
maximum keywords = 100
```

---

# 33. Keyword Duplicate Policy

Duplicate keywords shall be detected using normalized comparison.

The authoritative display value shall be preserved.

---

# 34. Publisher

`publisher` is optional authoritative metadata.

It does not imply current distribution rights or authorization.

---

# 35. Edition

`edition` is optional.

Examples:

```text
First Edition
Second Edition
Revised Edition
3rd ed.
```

Edition is descriptive metadata.

It is not SourceVersion.

---

# 36. Edition and SourceVersion

The following concepts are distinct:

```text
Editorial edition
≠
SourceVersion
```

A corrected PDF of the same editorial edition may create a new SourceVersion.

A different editorial edition may require a separate Publication according to publication identity policy.

---

# 37. External Identifiers

The detail contract may expose standard bibliographic identifiers.

Initial fields:

```text
isbn10
isbn13
doi
issn?
other?
```

---

# 38. Bibliographic Identifier Object

Example:

```json
{
  "identifiers": {
    "isbn10": "0123456789",
    "isbn13": "9780123456786",
    "doi": "10.1000/example"
  }
}
```

All fields are optional.

The object may be omitted when no external identifiers exist.

---

# 39. ISBN Semantics

ISBN values are bibliographic metadata.

They shall not become PublicationId.

Validation shall support:

* canonical digits;
* ISBN-10 check-digit rules;
* ISBN-13 check-digit rules;
* optional external input normalization.

Transport values should omit decorative hyphens unless a display field is later added.

---

# 40. DOI Semantics

DOI is optional metadata.

Rules:

* normalized canonical textual representation;
* no URL required;
* no automatic external lookup required;
* not publication identity inside KnowledgeOS.

---

# 41. ISSN

ISSN may be supported for magazines and serial publications.

If included, it shall be validated independently from ISBN.

---

# 42. Other Identifiers

The v1 Reader contract should avoid an unrestricted identifier map.

Future identifier types shall be added through explicit compatible fields or a governed typed collection.

---

# 43. Publication Date

Publication date preserves actual precision:

```text
YYYY
YYYY-MM
YYYY-MM-DD
```

The client shall not invent missing month or day.

---

# 44. Publication Type

Supported values:

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

Unknown values shall decode safely.

---

# 45. Source Format

Initial supported value:

```text
PDF
```

The detail response describes the current supported authoritative format.

---

# 46. Remote Availability

Publication availability values:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

This value describes remote authority only.

---

# 47. AVAILABLE Publication

When `availability = AVAILABLE`:

* currentSource is required;
* currentSource is valid;
* acquisition may be permitted;
* source integrity metadata is required.

---

# 48. UNAVAILABLE Publication

When `availability = UNAVAILABLE`:

* metadata remains retrievable when Library state permits;
* currentSource may remain present for diagnostics and update comparison;
* acquisition is prohibited;
* availabilityReason should be included.

---

# 49. WITHDRAWN Publication

When `availability = WITHDRAWN`:

* metadata may remain retrievable by known PublicationId;
* acquisition is prohibited;
* currentSource may be omitted from Reader response;
* existing local copies remain unaffected.

The approved v1 behavior is:

```text
detail remains retrievable to authenticated clients by known PublicationId
```

This supports locally installed historical publications.

---

# 50. CORRUPTED Publication

When `availability = CORRUPTED`:

* metadata remains retrievable;
* acquisition is prohibited;
* currentSource may expose expected metadata;
* availabilityReason identifies safe corruption status;
* existing valid local copies remain unaffected.

---

# 51. Availability Reason

AvailabilityReason may contain:

```text
code
message?
occurredAt
```

Safe reason codes include:

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

---

# 52. Availability Reason Privacy

Availability reasons shall not expose:

* NAS paths;
* filesystem errors;
* stack traces;
* administrative private notes;
* credentials;
* device information.

---

# 53. Current Source

`currentSource` describes the current authoritative source selected by the Publication.

It does not contain the source bytes.

---

# 54. CurrentSourceDescriptor

Required fields when present:

```text
sourceVersion
format
mediaType
byteLength
checksum
etag
rangeSupported
createdAt
```

---

# 55. Current Source Example

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
  "etag": "\"publication-source-opaque-etag\"",
  "rangeSupported": true,
  "createdAt": "2026-07-15T18:30:00Z"
}
```

---

# 56. SourceVersion Field Name

The contract shall use:

```text
sourceVersion
```

It shall not use a generic field such as:

```text
version
```

because multiple version dimensions exist.

---

# 57. SourceVersion Semantics

SourceVersion:

* is positive;
* is monotonically increasing within one Publication;
* identifies exact authoritative source bytes;
* never decreases;
* never changes during one acquisition;
* does not equal publication edition.

---

# 58. Source Format

`format` uses:

```text
PublicationFormat
```

Initial value:

```text
PDF
```

---

# 59. Media Type

`mediaType` uses:

```text
application/pdf
```

for the initial source format.

Format and media type shall agree.

---

# 60. ByteLength

`byteLength` represents the exact full source payload size in bytes.

It supports:

* storage estimation;
* Range validation;
* transfer validation;
* progress calculation;
* local commit validation.

---

# 61. Checksum

Checksum uses the shared structure:

```json
{
  "algorithm": "sha-256",
  "value": "98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8"
}
```

It describes the complete authoritative source payload.

---

# 62. ETag

`etag` is a strong opaque HTTP validator for the exact source representation.

Clients shall not parse it.

It may derive internally from:

```text
PublicationId
SourceVersion
Checksum
```

but that construction is not public.

---

# 63. rangeSupported

`rangeSupported` indicates whether single byte-range requests are supported for this exact source.

It does not guarantee that a specific local checkpoint is valid.

---

# 64. Source CreatedAt

`createdAt` identifies when the SourceVersion became a committed source record.

It is not the Publication creation date.

---

# 65. Source History

The Reader detail endpoint shall not return complete source-version history.

The Reader needs:

```text
currentSource
```

only.

---

# 66. Why Reader History Is Excluded

Complete source history is excluded because:

* ordinary Readers acquire the current source;
* history adds unnecessary payload;
* historical sources may be unavailable;
* source administration has different authorization;
* rollback and audit are administrative concerns.

---

# 67. Administrative Source History

A future administrative endpoint may expose:

```text
GET /v1/admin/publications/{publicationId}/versions
```

This belongs in `AdministrationContracts.md`.

---

# 68. Cover Descriptor

The detail response includes:

```text
cover
```

The CoverDescriptor contains metadata only.

It does not embed image bytes.

---

# 69. CoverDescriptor

Fields:

```text
available
mediaType?
etag?
width?
height?
updatedAt?
```

---

# 70. Cover Unavailable

Example:

```json
{
  "cover": {
    "available": false
  }
}
```

---

# 71. Cover Available

Example:

```json
{
  "cover": {
    "available": true,
    "mediaType": "image/jpeg",
    "etag": "\"cover-opaque-etag\"",
    "width": 1200,
    "height": 1800,
    "updatedAt": "2026-07-16T09:00:00Z"
  }
}
```

---

# 72. GET /v1/publications//cover

## Purpose

Returns the current authoritative cover image.

## Authentication

Required.

## Roles

```text
READER
ADMINISTRATOR
```

---

# 73. Cover Request

```text
GET /v1/publications/{publicationId}/cover
```

Optional headers:

```text
Accept
If-None-Match
If-Modified-Since
```

---

# 74. Successful Cover Response

HTTP:

```text
200 OK
```

Required headers:

```text
Content-Type
Content-Length
ETag
X-Request-Id
Cache-Control
```

Recommended:

```text
Last-Modified
```

---

# 75. Supported Cover Media Types

Initial values:

```text
image/jpeg
image/png
image/webp
```

Server and Apple-client support shall remain aligned.

---

# 76. Cover Content Negotiation

The server returns the stored authoritative supported cover representation.

The v1 endpoint does not require dynamic image transcoding based on `Accept`.

If the stored media type is unsupported by the request:

```text
406 Not Acceptable
```

may be returned.

---

# 77. Cover Cache Policy

Recommended:

```text
Cache-Control: private, max-age=86400, must-revalidate
```

The exact duration may be adjusted.

ETag remains the primary validation mechanism.

---

# 78. Conditional Cover Request

Example:

```text
If-None-Match: "cover-opaque-etag"
```

When unchanged:

```text
304 Not Modified
```

No response body is returned.

---

# 79. Cover Not Found

When no cover exists:

```text
COVER_NOT_FOUND
```

HTTP:

```text
404 Not Found
```

The publication itself may still exist.

---

# 80. Cover Unavailable

When cover metadata exists but storage is temporarily unavailable:

```text
COVER_UNAVAILABLE
```

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 81. Cover Corrupted

When the cover fails integrity or decoding validation:

```text
COVER_CORRUPTED
```

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

until server repair.

---

# 82. Cover Failure Isolation

A cover error shall not:

* make the Publication nonexistent;
* make the source payload invalid;
* prevent publication-detail retrieval;
* delete a client-cached cover automatically;
* invalidate local publication content.

---

# 83. HEAD /v1/publications//content

## Purpose

Returns authoritative metadata for one exact publication source without transferring the source body.

This endpoint supports:

* acquisition preparation;
* update validation;
* SourceVersion comparison;
* ByteLength validation;
* checksum validation;
* ETag retrieval;
* Range-capability detection.

---

# 84. Content HEAD Request

```text
HEAD /v1/publications/{publicationId}/content?sourceVersion=2
```

`sourceVersion` is required.

---

# 85. Exact SourceVersion Requirement

The client shall request one exact SourceVersion.

The server shall not silently substitute the current SourceVersion.

Incorrect:

```text
requested sourceVersion = 2
server responds with sourceVersion = 3
```

Correct:

```text
SOURCE_VERSION_NOT_FOUND
```

or:

```text
SOURCE_VERSION_CHANGED
```

according to context.

---

# 86. Why SourceVersion Is Required

Requiring SourceVersion ensures:

* deterministic acquisition;
* safe resume;
* no mid-operation source substitution;
* exact integrity metadata;
* correct update semantics;
* reproducible content identity.

---

# 87. Content HEAD Authentication

Required:

```text
Authorization: Bearer <opaque-device-credential>
```

Required role:

```text
READER or ADMINISTRATOR
```

Required capability:

```text
PUBLICATION_DOWNLOAD
```

---

# 88. Content HEAD Preconditions

The requested Publication shall:

* exist;
* be acquirable;
* own the requested SourceVersion;
* expose a committed valid source;
* have readable source storage;
* match current authorization policy.

---

# 89. Successful HEAD Response

HTTP:

```text
200 OK
```

No response body.

---

# 90. Required HEAD Headers

```text
Content-Type
Content-Length
ETag
Accept-Ranges
X-KnowledgeOS-Master-Library-Id
X-KnowledgeOS-Publication-Id
X-KnowledgeOS-Source-Version
X-KnowledgeOS-Checksum-Algorithm
X-KnowledgeOS-Checksum
X-Request-Id
```

Recommended:

```text
Last-Modified
Cache-Control
```

---

# 91. HEAD Example

```text
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 73400320
ETag: "publication-source-opaque-etag"
Accept-Ranges: bytes
X-KnowledgeOS-Master-Library-Id: 2cc17a92-3bc4-443b-9cc3-b5fc23a12832
X-KnowledgeOS-Publication-Id: 4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc
X-KnowledgeOS-Source-Version: 2
X-KnowledgeOS-Checksum-Algorithm: sha-256
X-KnowledgeOS-Checksum: 98f21e6b7d63f7564786841cf732ef672c1cd2d413bc35fa2ffef5bd95cda6f8
X-Request-Id: 136a3973-154a-4204-b41c-1601fd23df13
```

---

# 92. Content-Length Semantics

For HEAD, Content-Length represents the complete source payload length.

It shall equal `currentSource.byteLength` for the same SourceVersion.

---

# 93. Content-Type Semantics

For the initial source format:

```text
application/pdf
```

---

# 94. Accept-Ranges

When single-range transfer is supported:

```text
Accept-Ranges: bytes
```

When not supported, the header may be omitted or use:

```text
Accept-Ranges: none
```

The preferred v1 behavior is omission when unsupported.

---

# 95. HEAD ETag

The ETag shall identify the exact SourceVersion representation.

The same ETag shall be returned by the subsequent matching GET content response.

---

# 96. Last-Modified

Last-Modified should represent the committed source timestamp or equivalent stable source modification time.

It shall not depend on the current physical filesystem modification time after relocation or restore.

---

# 97. Cache-Control for HEAD

Recommended:

```text
Cache-Control: private, max-age=0, must-revalidate
```

Because source availability may change.

---

# 98. Content Metadata Consistency

The following shall agree:

```text
PublicationDetails.currentSource
HEAD content headers
GET content headers
Acquisition preparation metadata
```

Any mismatch is a contract defect.

---

# 99. HEAD and Availability

HEAD shall succeed only when the requested source is deliverable under current policy.

For `WITHDRAWN`, `CORRUPTED` or non-deliverable `UNAVAILABLE` states, it shall fail with the corresponding public error.

---

# 100. Detail Retrieval for Non-Acquirable Publication

The detail endpoint may succeed even when content HEAD fails.

Example:

```text
GET detail
→ 200, availability = WITHDRAWN

HEAD content
→ 410 PUBLICATION_WITHDRAWN
```

This is intentional.

---

# 101. Detail Response Caching

The detail response may use:

```text
ETag
Last-Modified
Cache-Control
```

Recommended cache policy:

```text
Cache-Control: private, max-age=0, must-revalidate
```

---

# 102. Publication Detail ETag

A detail ETag may derive from:

```text
PublicationId
CatalogRevision
record version
current SourceVersion
cover version
```

The client treats it as opaque.

---

# 103. Conditional Detail Request

The client may send:

```text
If-None-Match
```

When unchanged:

```text
304 Not Modified
```

No body is returned.

---

# 104. Detail Cache Scope

Publication-detail cache shall be scoped to:

```text
ServerId
+
MasterLibraryId
+
PublicationId
```

---

# 105. Detail Cache Metadata

The client may persist:

```text
PublicationDetailSnapshot
├── ServerId
├── MasterLibraryId
├── PublicationId
├── CatalogRevision
├── ETag?
├── metadata
├── availability
├── currentSource?
├── cover
├── capturedAt
└── updatedAt
```

---

# 106. Detail Cache Authority

A cached detail is:

* derived;
* replaceable;
* possibly stale;
* non-authoritative;
* independent from local personal state.

---

# 107. Catalog and Detail Cache Relationship

Catalog summary and publication detail are separate projections.

A detail response may contain newer data than a cached catalog entry.

The client may update its local catalog projection from the detail response when identity and revision context are valid.

---

# 108. Detail Invalidation

A cached detail should be considered stale when:

* CatalogRevision changes;
* its ETag no longer matches;
* publication update notification is received;
* user explicitly refreshes;
* MasterLibraryId changes;
* ServerId changes.

---

# 109. Offline Detail Use

When offline, the client may display the latest cached detail.

The UI shall indicate that remote metadata may be stale.

Local publication access remains independent.

---

# 110. Locally Installed Publication Without Current Detail

A locally installed publication shall remain usable when:

* server is offline;
* detail cache is stale;
* publication was withdrawn remotely;
* remote detail no longer resolves.

The LocalLibraryItem metadata snapshot supports offline display.

---

# 111. Client Publication Projection

The client combines:

```text
PublicationDetails
+
LocalLibraryItem?
+
AcquisitionOperation?
+
AnnotationStore?
+
ReadingProgress?
+
PersonalTags?
+
FavoriteState?
```

This combination exists only on the client.

---

# 112. Personal State Boundary

The server detail response shall not contain:

```text
annotations
readingProgress
personalTags
favorites
personalNotes
personalRelationships
CloudKit identifiers
iCloud sync state
```

---

# 113. Local Availability Boundary

The server detail response shall not contain:

```text
isDownloaded
localAvailability
localIntegrity
localPath
installedSourceVersion
downloadProgress
downloadState
```

---

# 114. Client Update Detection

The client derives update status by comparing:

```text
local installed SourceVersion
```

with:

```text
remote current SourceVersion
```

inside the same identity context.

---

# 115. Update Available

Derived when:

```text
remoteSourceVersion > localSourceVersion
```

and the remote source is deliverable.

---

# 116. Current

Derived when:

```text
remoteSourceVersion = localSourceVersion
```

and local integrity is valid.

---

# 117. Remote Version Unknown

When detail cannot be refreshed:

```text
REMOTE_VERSION_UNKNOWN
```

The client shall not assume that the local copy is current.

---

# 118. Publication Withdrawn with Local Copy

Valid client projection:

```text
remote availability = WITHDRAWN
local availability = AVAILABLE_LOCAL
```

The client may display:

```text
Downloaded locally
No longer available from Master Library
```

---

# 119. Publication Corrupted with Valid Local Copy

Valid client projection:

```text
remote availability = CORRUPTED
local integrity = VALID
```

The local copy remains usable.

---

# 120. Source Replacement While Client Offline

When the client reconnects:

1. retrieve CatalogRevision;
2. refresh summary or detail;
3. detect newer SourceVersion;
4. offer update;
5. preserve old local version until new installation commits.

---

# 121. Detail Response Unknown Fields

Clients shall ignore unknown optional response fields.

Unknown required semantic enum values shall map to safe unsupported states.

---

# 122. Unknown Contributor Role

An unknown role shall:

* decode safely;
* preserve contributor name;
* display a generic contributor label if needed;
* preserve raw role for diagnostics.

---

# 123. Unknown Publication Type

An unknown type shall not prevent metadata display.

It may display as:

```text
Other
```

---

# 124. Unknown Source Format

An unknown source format shall:

* preserve detail display;
* disable acquisition;
* produce compatibility guidance;
* not map to PDF.

---

# 125. Unknown Availability

Unknown availability shall:

* disable acquisition;
* preserve metadata display;
* not map to AVAILABLE;
* remain visible as unsupported.

---

# 126. Publication Detail Errors

Potential errors:

```text
AUTHENTICATION_REQUIRED
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
DEVICE_REVOKED
AUTHORIZATION_DENIED
INVALID_IDENTIFIER
PUBLICATION_NOT_FOUND
MASTER_LIBRARY_UNAVAILABLE
MASTER_LIBRARY_MAINTENANCE
MASTER_LIBRARY_INVALID
MASTER_LIBRARY_VERSION_UNSUPPORTED
CATALOG_UNAVAILABLE
INTERNAL_ERROR
```

---

# 127. PUBLICATION_NOT_FOUND

HTTP:

```text
404 Not Found
```

Retryable:

```text
false
```

---

# 128. Detail for Withdrawn Publication

The approved detail contract returns:

```text
200 OK
```

with:

```text
availability = WITHDRAWN
```

when the PublicationId is known and the authenticated device is permitted to inspect it.

This differs from acquisition behavior.

---

# 129. Detail for Corrupted Publication

The detail endpoint returns:

```text
200 OK
```

with:

```text
availability = CORRUPTED
```

when metadata remains readable.

---

# 130. Detail for Unavailable Publication

The detail endpoint returns:

```text
200 OK
```

with:

```text
availability = UNAVAILABLE
```

when metadata remains readable.

---

# 131. Detail Failure from Catalog Unavailability

If catalog persistence cannot resolve the Publication:

```text
CATALOG_UNAVAILABLE
```

HTTP:

```text
503 Service Unavailable
```

This differs from `PUBLICATION_NOT_FOUND`.

---

# 132. Cover Errors

Public cover errors include:

```text
PUBLICATION_NOT_FOUND
COVER_NOT_FOUND
COVER_UNAVAILABLE
COVER_CORRUPTED
UNSUPPORTED_MEDIA_TYPE
AUTHENTICATION_REQUIRED
AUTHORIZATION_DENIED
```

---

# 133. Content HEAD Errors

Potential errors include:

```text
PUBLICATION_NOT_FOUND
PUBLICATION_UNAVAILABLE
PUBLICATION_WITHDRAWN
PUBLICATION_CORRUPTED
SOURCE_VERSION_NOT_FOUND
SOURCE_VERSION_CHANGED
SOURCE_FILE_MISSING
SOURCE_FILE_UNREADABLE
SOURCE_STORAGE_UNAVAILABLE
CONTENT_DELIVERY_UNAVAILABLE
AUTHENTICATION_REQUIRED
AUTHORIZATION_DENIED
```

---

# 134. PUBLICATION_UNAVAILABLE for HEAD

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

when the reason is transient.

---

# 135. PUBLICATION_WITHDRAWN for HEAD

HTTP:

```text
410 Gone
```

Retryable:

```text
false
```

---

# 136. PUBLICATION_CORRUPTED for HEAD

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
false
```

---

# 137. SOURCE_VERSION_NOT_FOUND

HTTP:

```text
404 Not Found
```

Retryable:

```text
false
```

---

# 138. SOURCE_VERSION_CHANGED

Used when a previous source context is no longer valid for the requested operation.

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

The client shall refresh PublicationDetails.

---

# 139. Request Correlation

All endpoints shall support:

```text
X-Request-Id
X-Correlation-Id
```

The server shall return:

```text
X-Request-Id
```

---

# 140. Acquisition Correlation

The client may include:

```text
X-Acquisition-Operation-Id
```

on HEAD requests used to prepare acquisition.

This header is diagnostic only.

---

# 141. Publication Detail Request Idempotency

GET and HEAD requests are safe and idempotent.

No Idempotency-Key is required.

---

# 142. Request Cancellation

Client cancellation:

* does not mutate Publication;
* does not advance CatalogRevision;
* does not change SourceVersion;
* does not invalidate ETag;
* may be retried safely.

---

# 143. Security Rules

Publication contracts shall:

* require authentication;
* validate PublicationId;
* validate exact SourceVersion;
* use HTTPS in production;
* expose no paths;
* expose no credentials;
* expose no device information;
* expose no personal state;
* bound metadata;
* use safe errors.

---

# 144. Physical Path Prohibition

No response shall expose:

```text
sourcePath
nasPath
absolutePath
mountPoint
databasePath
stagingPath
coverPath
localPath
```

---

# 145. Source Reference Prohibition

The Reader contract does not need internal StorageReference values.

Content is accessed through governed API endpoints.

---

# 146. Credential Prohibition

Responses shall not contain:

* bearer credential;
* CredentialId;
* credential hash;
* DeviceId of other devices;
* PairingCode;
* server secret.

---

# 147. Publication Privacy

Publication metadata is accessible only to authenticated devices.

It shall use HTTPS.

Search and detail access logging shall remain bounded according to privacy policy.

---

# 148. Detail Logging

Safe fields:

```text
requestId
deviceId
masterLibraryId
publicationId
catalogRevision
availability
sourceVersion?
duration
result
```

---

# 149. Detail Log Prohibitions

Logs shall not contain:

* full description by default;
* credentials;
* physical paths;
* personal state;
* complete cover bytes;
* source payload bytes.

---

# 150. Publication Metrics

Recommended metrics:

```text
publication_detail_requests_total
publication_detail_request_duration_seconds
publication_detail_not_found_total
publication_detail_availability_total
publication_cover_requests_total
publication_cover_cache_hits_total
publication_content_head_requests_total
publication_content_head_failures_total
```

---

# 151. Metric Cardinality

PublicationId shall not be used as an unbounded metric label.

---

# 152. Application Use Cases

Initial application use cases:

```text
GetPublicationDetails
GetPublicationCover
GetPublicationContentMetadata
```

---

# 153. GetPublicationDetails Request

Conceptually:

```text
GetPublicationDetailsRequest
├── authenticatedDevice
├── publicationId
└── requestContext
```

---

# 154. GetPublicationDetails Result

Conceptually:

```text
GetPublicationDetailsResult
├── serverId
├── masterLibraryId
├── catalogRevision
└── publicationDetails
```

---

# 155. GetPublicationCover Result

Conceptually:

```text
GetPublicationCoverResult
├── mediaType
├── byteLength
├── etag
├── lastModified?
└── readable content stream
```

The application result shall not expose a physical path to Transport.

---

# 156. GetPublicationContentMetadata Request

Conceptually:

```text
GetPublicationContentMetadataRequest
├── authenticatedDevice
├── publicationId
├── sourceVersion
└── requestContext
```

---

# 157. GetPublicationContentMetadata Result

Conceptually:

```text
ContentDescriptor
├── masterLibraryId
├── publicationId
├── sourceVersion
├── mediaType
├── byteLength
├── checksum
├── etag
├── rangeSupported
└── lastModified?
```

---

# 158. Repository Boundaries

The Application layer may depend on:

```text
PublicationReadRepository
CoverReadRepository
SourceReadRepository
```

Repositories return validated projections or handles.

They do not return HTTP responses.

---

# 159. Runtime Validation

The server shall validate:

* PublicationId;
* SourceVersion query;
* Accept header;
* conditional headers;
* authorization;
* response context;
* metadata bounds.

---

# 160. Response Consistency Validation

Tests shall verify:

```text
response serverId
=
active ServerId

response masterLibraryId
=
active MasterLibraryId

response publicationId
=
requested PublicationId
```

---

# 161. Source Consistency Validation

For the same SourceVersion:

```text
detail currentSource.byteLength
=
HEAD Content-Length
```

```text
detail currentSource.checksum
=
HEAD checksum headers
```

```text
detail currentSource.etag
=
HEAD ETag
```

---

# 162. Performance Rules

Publication detail shall remain bounded.

It shall not include:

* source bytes;
* full cover bytes;
* unlimited contributor lists;
* unlimited keywords;
* historical source list;
* annotations;
* generated AI documents.

---

# 163. Cover Streaming

Cover bytes shall be streamed or efficiently served.

The server shall not encode covers as Base64 inside JSON.

---

# 164. HEAD Performance

HEAD shall not read the complete PDF to calculate checksum on every request.

Checksum and ByteLength shall already exist as authoritative metadata.

The server may perform bounded storage existence checks.

---

# 165. Source Metadata Authority

Checksum and ByteLength returned by HEAD come from committed authoritative metadata.

They shall have been verified during source registration or validation.

---

# 166. Deep Source Revalidation

A full checksum recalculation belongs to integrity-validation workflows.

It is not required for each detail or HEAD request.

---

# 167. OpenAPI Requirements

OpenAPI shall define:

```text
GET /v1/publications/{publicationId}
GET /v1/publications/{publicationId}/cover
HEAD /v1/publications/{publicationId}/content
PublicationDetailsResponse
PublicationDetails
PublicationMetadata
BibliographicIdentifiers
CurrentSourceDescriptor
CoverDescriptor
all headers
all error responses
```

---

# 168. OpenAPI Security

Every endpoint requires:

```text
Bearer device credential
```

---

# 169. Contract Fixtures

Required fixtures:

```text
publication-details-available.json
publication-details-unavailable.json
publication-details-withdrawn.json
publication-details-corrupted.json
publication-details-no-cover.json
publication-details-with-identifiers.json
publication-details-minimal-metadata.json
publication-details-unknown-enum.json
publication-not-found-error.json
cover-not-found-error.json
cover-unavailable-error.json
content-head-available.txt
content-head-withdrawn-error.json
content-head-source-version-not-found-error.json
```

---

# 170. Publication Detail Tests

Tests shall verify:

* valid Reader access;
* valid Administrator access;
* authentication required;
* PublicationId validation;
* complete metadata;
* optional metadata omission;
* contributor order;
* keyword validation;
* bibliographic identifier validation;
* availability behavior;
* currentSource requirements;
* no source history;
* no local state;
* no personal state;
* no physical paths.

---

# 171. Available Publication Test

For `AVAILABLE`:

```text
currentSource required
byteLength positive
checksum valid
etag present
rangeSupported present
```

---

# 172. Withdrawn Publication Test

For `WITHDRAWN`:

* detail returns 200;
* availability is WITHDRAWN;
* availabilityReason is present;
* acquisition metadata may be omitted;
* HEAD returns 410;
* local state is not returned.

---

# 173. Corrupted Publication Test

For `CORRUPTED`:

* detail returns 200 when metadata readable;
* availability is CORRUPTED;
* acquisition disabled;
* HEAD returns corruption error;
* existing client-local copy is unaffected.

---

# 174. Unavailable Publication Test

For `UNAVAILABLE`:

* detail returns 200 when metadata readable;
* reason safe;
* acquisition metadata behavior consistent;
* HEAD returns temporary unavailability when not deliverable.

---

# 175. Cover Tests

Tests shall verify:

* available cover returns correct media type;
* absent cover returns COVER_NOT_FOUND;
* ETag present;
* If-None-Match returns 304;
* body ByteLength exact;
* no path exposed;
* cover failure does not fail detail.

---

# 176. HEAD Tests

Tests shall verify:

* exact SourceVersion required;
* no body returned;
* Content-Length exact;
* Content-Type exact;
* ETag exact;
* source headers exact;
* checksum headers exact;
* Range header metadata exact;
* withdrawn rejected;
* corrupted rejected;
* missing source rejected.

---

# 177. Conditional Detail Tests

Tests shall verify:

* valid ETag returned;
* matching If-None-Match returns 304;
* changed CatalogRevision produces new detail ETag where appropriate;
* no body in 304.

---

# 178. Identity Context Tests

Tests shall verify:

* exact ServerId;
* exact MasterLibraryId;
* exact PublicationId;
* cache isolation;
* identity mismatch never merges detail with another Library.

---

# 179. Unknown Value Tests

Swift client tests shall verify:

* unknown PublicationType decodes safely;
* unknown ContributorRole decodes safely;
* unknown Availability disables acquisition;
* unknown SourceFormat disables acquisition;
* raw values preserved where practical.

---

# 180. Client Merge Tests

Tests shall verify:

* local installed state merged by identity;
* annotations preserved during detail refresh;
* progress preserved;
* personal tags preserved;
* remote withdrawal does not delete local copy;
* remote source update produces update-available projection;
* offline cached detail remains displayable.

---

# 181. Source Consistency Contract Test

A shared fixture shall prove that:

```text
PublicationDetails.currentSource
HEAD content metadata
Acquisition preparation response
GET content headers
```

all describe the same exact payload.

---

# 182. Publication Contract Completion Gate

This document is complete when:

```text
[ ] Publication identity is frozen
[ ] GET publication detail is defined
[ ] Complete metadata is defined
[ ] Contributor model is defined
[ ] Keywords are defined
[ ] Bibliographic identifiers are defined
[ ] Edition is defined
[ ] PublicationDate is defined
[ ] Availability is defined
[ ] AvailabilityReason is defined
[ ] CurrentSource is defined
[ ] SourceVersion semantics are defined
[ ] Source history exclusion is defined
[ ] CoverDescriptor is defined
[ ] GET cover is defined
[ ] Cover caching is defined
[ ] HEAD content is defined
[ ] Exact SourceVersion is required
[ ] Content headers are defined
[ ] Detail caching is defined
[ ] Offline detail behavior is defined
[ ] Local projection is defined
[ ] Update detection is defined
[ ] Withdrawn local-copy behavior is defined
[ ] Unknown-value handling is defined
[ ] Error behavior is defined
[ ] Security boundaries are defined
[ ] Logging and metrics are defined
[ ] Application use cases are defined
[ ] Repository boundaries are defined
[ ] Performance rules are defined
[ ] OpenAPI obligations are defined
[ ] Fixtures are defined
[ ] Testing obligations are defined
[ ] Personal-state exclusion is explicit
[ ] Physical-path exclusion is explicit
[ ] No architectural contradiction remains
```

---

# 183. Publication Contract Invariants

The following invariants apply:

* PublicationId is the logical identity.
* SourceVersion identifies exact source bytes.
* Publication edition is not SourceVersion.
* The detail response contains authoritative remote metadata only.
* AVAILABLE requires a valid currentSource.
* Reader source history is not exposed.
* Source bytes are never embedded in JSON.
* Cover bytes are a separate resource.
* HEAD returns exact content metadata without a body.
* The requested SourceVersion is never silently substituted.
* Detail, HEAD and acquisition metadata remain consistent.
* Withdrawn detail may remain retrievable.
* Withdrawn content is not acquirable.
* Corrupted content is not acquirable.
* Existing valid local copies remain independent.
* Local state is client-owned.
* Personal state is client-owned.
* Unknown availability never maps to AVAILABLE.
* Physical paths remain private.
* Credentials remain private.

---

# 184. Prohibited Publication Contract Designs

The module shall not:

* use filename as Publication identity;
* use checksum as Publication identity;
* expose source paths;
* expose cover paths;
* expose database keys;
* return source bytes in detail JSON;
* return cover bytes in detail JSON;
* expose complete source history to ordinary Readers;
* silently replace requested SourceVersion;
* confuse edition with SourceVersion;
* include local availability;
* include installed SourceVersion;
* include download progress;
* include annotations;
* include reading progress;
* include favorites;
* include personal tags;
* include CloudKit state;
* delete local content after remote withdrawal;
* recalculate full source checksum on every HEAD request;
* expose raw storage or filesystem errors.

---

# 185. Related Documents

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
* `AcquisitionContracts.md`
* `AdministrationContracts.md`
* `Versioning.md`
* `Compatibility.md`

## Domain

* `../03-Domain/DomainModel.md`
* `../03-Domain/Entities.md`
* `../03-Domain/ValueObjects.md`
* `../03-Domain/States.md`
* `../03-Domain/Errors.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ErrorModel.md`

## Future Persistence

* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/SourceStorageLayout.md`
* `../05-Persistence/ClientCatalogCache.md`
* `../05-Persistence/LocalLibraryStorage.md`

---

# 186. Status

**Approved**

The complete Reader-facing representation of one Master Library Publication is frozen through:

```text
GET  /v1/publications/{publicationId}

GET  /v1/publications/{publicationId}/cover

HEAD /v1/publications/{publicationId}/content
```

The next document is:

```text
01-MasterLibrary/04-Contracts/AcquisitionContracts.md
```

It shall define the complete device-side acquisition contract:

```text
prepare exact source context
download full or partial content
persist transfer checkpoints
validate ByteLength
validate Checksum
install atomically
resume safely
retry safely
cancel safely
preserve previous local version
```
