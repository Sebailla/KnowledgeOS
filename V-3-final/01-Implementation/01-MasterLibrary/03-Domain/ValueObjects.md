

# Master Library Value Objects

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Domain

**Document:** Value Objects

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the immutable Domain value objects used by the Master Library Module.

It specifies:

* semantic meaning;
* validation;
* normalization;
* equality;
* ordering;
* serialization;
* construction;
* rehydration;
* error behavior;
* server-client compatibility.

Value objects shall express Domain meaning more precisely than primitive strings, numbers and booleans.

---

# 2. Scope

This document defines value objects for:

* stable identifiers;
* versions;
* revisions;
* integrity;
* storage;
* publication metadata;
* networking context;
* acquisition progress;
* time;
* errors;
* pagination;
* compatibility.

The following are included:

```text
MasterLibraryId
PublicationId
ServerId
DeviceId
AcquisitionOperationId
AcquisitionAttemptId
LocalLibraryItemId
ContributorEntryId

SourceVersion
CatalogRevision
RecordVersion

Checksum
ChecksumAlgorithm
ByteLength
ByteOffset

PublicationTitle
PublicationSubtitle
PublicationDescription
ContributorName
ContributorRole
SubjectName
PublisherName
LanguageCode
PublicationDate
PublicationType
PublicationFormat
MediaType
OriginalFileName

MasterLibraryName
MasterLibraryFormatVersion
ApiVersion
SchemaVersion
ApplicationVersion

StorageReference
LocalStorageReference
CoverReference

ServerEndpoint
ServerFingerprint

CatalogCursor
PageSize
SearchQuery
SortOrder

AcquisitionProgress
AvailabilityReason
FailureReason
CorrelationId
RequestId

Instant
```

---

# 3. Value Object Principles

Every value object shall:

* be immutable;
* validate itself during construction;
* compare by value;
* avoid invalid intermediate state;
* expose canonical representation;
* remain independent from transport and persistence;
* reject malformed persisted values during rehydration;
* avoid framework-specific types.

---

# 4. Primitive Obsession Prohibition

The Domain shall not use unrestricted primitives where stronger meaning is required.

Avoid:

```text
string publicationId
number sourceVersion
string checksum
string path
number bytes
```

Prefer:

```text
PublicationId
SourceVersion
Checksum
StorageReference
ByteLength
```

---

# 5. Construction Policy

Value objects shall use controlled factories conceptually equivalent to:

```text
PublicationId.create(rawValue)
SourceVersion.create(rawValue)
Checksum.create(algorithm, value)
PublicationTitle.create(rawValue)
```

Factories shall:

1. validate;
2. normalize;
3. construct;
4. return the valid value or a typed Domain error.

Unchecked public constructors are prohibited where they could create invalid state.

---

# 6. Rehydration Policy

Persistence rehydration shall use the same validation rules as ordinary creation.

Conceptually:

```text
PublicationId.rehydrate(storedValue)
```

Rehydration shall not bypass invariants merely because the value came from the database.

Invalid persisted values indicate persistence corruption or incompatible data.

---

# 7. Equality

Value objects compare using their canonical complete value.

Examples:

```text
PublicationId equality
→ canonical identifier value

Checksum equality
→ algorithm + canonical digest

ServerEndpoint equality
→ normalized scheme + host + port + base path
```

Reference equality shall not determine Domain equality.

---

# 8. Serialization Boundary

Value objects shall expose explicit primitive representations for:

* persistence;
* API transport;
* logging;
* test fixtures.

Conceptually:

```text
value.toString()
value.toNumber()
value.toJSON()
```

Domain objects shall not depend on how OpenAPI or database libraries serialize those values.

---

# 9. Identifier Family

The Domain identifier family includes:

```text
MasterLibraryId
PublicationId
ServerId
DeviceId
AcquisitionOperationId
AcquisitionAttemptId
LocalLibraryItemId
ContributorEntryId
CorrelationId
RequestId
```

All identifiers shall use opaque semantic types.

---

# 10. Identifier Representation

The initial representation shall use canonical UUID values.

Approved canonical form:

```text
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Rules:

* lowercase;
* hyphenated;
* no surrounding whitespace;
* valid UUID syntax;
* immutable;
* non-empty.

The Domain shall not expose assumptions about UUID version unless a specific version is required.

---

# 11. Identifier Normalization

Identifier creation shall:

1. trim surrounding whitespace only when accepting external input;
2. validate UUID syntax;
3. normalize to lowercase;
4. reject braces and unsupported alternative formats;
5. preserve canonical representation.

Internally constructed identifiers should already be canonical.

---

# 12. MasterLibraryId

## Meaning

Identifies one logical Master Library.

## Rules

`MasterLibraryId` shall:

* be generated exactly once during Library initialization;
* remain stable across relocation, restore and server restart;
* never derive from hostname or path;
* never be reused for another logical Library.

## Equality

By canonical UUID value.

## Serialization

As canonical lowercase UUID string.

---

# 13. PublicationId

## Meaning

Identifies one logical publication independently from physical source representation.

## Rules

`PublicationId` shall not derive from:

* title;
* ISBN;
* checksum;
* source filename;
* NAS path;
* SourceVersion.

It remains stable across:

* metadata changes;
* source replacement;
* availability changes;
* withdrawal;
* restoration.

---

# 14. ServerId

## Meaning

Identifies one KnowledgeOS Server installation or logical server identity.

## Rules

`ServerId` shall:

* remain independent from network endpoint;
* remain stable across process restart;
* remain stable across container replacement;
* be persisted outside disposable runtime storage;
* participate in client trust.

A replaced server identity requires an explicit trust decision.

---

# 15. DeviceId

## Meaning

Identifies one registered KnowledgeOS client device.

## Rules

`DeviceId` shall:

* remain stable across ordinary application restart;
* not derive from IP address;
* not expose Apple hardware serial numbers;
* not contain personal user information;
* be revocable at the server.

---

# 16. AcquisitionOperationId

## Meaning

Identifies one logical acquisition workflow.

## Rules

The identifier:

* survives retries;
* survives client restart;
* belongs to one exact publication context;
* is not reused after operation deletion;
* is distinct from network request identifiers.

---

# 17. AcquisitionAttemptId

## Meaning

Identifies one physical execution attempt within an acquisition.

## Rules

Every retry or resumed execution creates a new value.

The identifier shall never be reused.

---

# 18. LocalLibraryItemId

## Meaning

Identifies one persisted local Library membership record.

Logical uniqueness still depends on:

```text
ServerId
+
MasterLibraryId
+
PublicationId
```

`LocalLibraryItemId` is an implementation-friendly entity identity, not the cross-system publication identity.

---

# 19. ContributorEntryId

## Meaning

Identifies one contributor entry inside publication metadata.

This identifier is local to the Publication aggregate.

It does not create a global identity for a person.

---

# 20. CorrelationId

## Meaning

Connects diagnostic evidence across one logical operation or request chain.

It shall:

* be safe to log;
* contain no personal information;
* remain distinct from Domain entity identity;
* support server-client troubleshooting.

UUID or another opaque high-entropy identifier may be used.

---

# 21. RequestId

## Meaning

Identifies one server request.

It shall:

* be unique enough for diagnostics;
* be returned in error contracts;
* be included in server logs;
* not determine idempotency.

---

# 22. SourceVersion

## Meaning

Identifies one immutable authoritative source payload version within one Publication.

## Representation

Positive integer.

## Rules

```text
value >= 1
```

`SourceVersion` shall:

* be immutable;
* be orderable;
* increase monotonically within a Publication;
* never be reused;
* not be globally comparable across different PublicationId values.

---

# 23. SourceVersion Operations

Approved operations:

```text
isNewerThan(other)
isOlderThan(other)
equals(other)
next()
```

`next()` shall detect overflow according to implementation limits.

---

# 24. SourceVersion Comparison Context

Comparing SourceVersion values is valid only when they refer to the same:

```text
MasterLibraryId
PublicationId
```

The Domain shall not imply that SourceVersion 3 of one publication is newer than SourceVersion 2 of another publication.

---

# 25. CatalogRevision

## Meaning

Identifies one authoritative catalog-visible revision within one Master Library.

## Representation

Non-negative or positive integer according to initialization convention.

The approved convention is:

```text
initial revision = 0
first mutation revision = 1
```

---

# 26. CatalogRevision Rules

`CatalogRevision` shall:

* never decrease;
* never be reused;
* belong to one MasterLibraryId;
* advance only for catalog-visible authoritative changes;
* remain independent from local acquisition and local removal.

Approved operations:

```text
next()
isNewerThan(other)
equals(other)
```

---

# 27. RecordVersion

## Meaning

Supports optimistic concurrency for persisted aggregate records.

## Representation

Non-negative integer.

`RecordVersion` is not:

* SourceVersion;
* CatalogRevision;
* API version.

It changes when the persisted aggregate record changes, including mutations that may not advance CatalogRevision.

---

# 28. ChecksumAlgorithm

## Meaning

Identifies the algorithm used to calculate payload integrity.

Initial supported value:

```text
SHA_256
```

Transport representation:

```text
sha-256
```

The Domain shall reject unsupported algorithms.

---

# 29. Checksum

## Meaning

Represents a canonical integrity digest.

Conceptual structure:

```text
Checksum
├── algorithm
└── value
```

For SHA-256:

* value contains exactly 64 hexadecimal characters;
* lowercase canonical representation;
* no prefixes;
* no whitespace.

---

# 30. Checksum Normalization

External input may be normalized by:

1. trimming whitespace;
2. converting hexadecimal letters to lowercase;
3. validating exact expected length;
4. rejecting non-hexadecimal characters.

The Domain shall not accept:

```text
SHA256:abcd...
0xabcd...
base64 values under a hex contract
```

unless an explicit alternate representation is added.

---

# 31. Checksum Equality

Equality requires:

```text
same algorithm
AND
same canonical digest value
```

A digest from a different algorithm is not equal even if text happens to match.

---

# 32. ByteLength

## Meaning

Represents exact payload length in bytes.

## Representation

Unsigned integer semantics.

## Rules

For committed publication payloads:

```text
value > 0
```

For generic progress or empty internal artifacts:

```text
value >= 0
```

Separate factories should distinguish these cases.

---

# 33. ByteLength Limits

The implementation shall ensure:

* no floating-point representation;
* no negative value;
* no overflow;
* safe serialization between TypeScript and Swift;
* values remain within the interoperable contract range.

OpenAPI shall use a 64-bit integer-compatible representation.

---

# 34. ByteOffset

## Meaning

Represents a zero-based byte position within a payload.

## Rules

```text
value >= 0
```

For a known ByteLength:

```text
offset <= byteLength
```

A Range request starting at exactly ByteLength is invalid for non-empty response data unless explicitly used as a completed checkpoint.

---

# 35. PublicationTitle

## Meaning

Represents the authoritative display title of a publication.

## Rules

A title shall:

* contain visible non-whitespace content;
* be trimmed at boundaries;
* preserve meaningful internal whitespace;
* reject control-only content;
* obey the configured maximum length;
* retain original Unicode characters.

Recommended maximum:

```text
512 Unicode scalar values or implementation-equivalent bounded length
```

The exact persistence and API limit shall remain aligned.

---

# 36. PublicationTitle Normalization

The Domain shall distinguish:

```text
display value
normalized search/sort value
```

The display value preserves intended text.

Search/sort normalization may:

* apply Unicode normalization;
* case-fold;
* remove repeated whitespace;
* produce locale-independent baseline ordering.

Search normalization shall not replace the authoritative display value.

---

# 37. PublicationSubtitle

Same general semantics as PublicationTitle, but optional.

An empty normalized subtitle shall become absence rather than an empty string.

---

# 38. PublicationDescription

## Meaning

Represents authoritative source description text.

## Rules

It shall:

* be optional;
* preserve paragraphs;
* reject uncontrolled excessive size;
* contain no personal notes;
* remain plain text in the initial Domain model.

Recommended maximum shall be defined in Contracts and Persistence.

HTML content is not accepted unless explicitly supported later.

---

# 39. ContributorName

## Meaning

Represents the display name of one publication contributor.

## Rules

It shall:

* contain visible text;
* be trimmed;
* preserve Unicode;
* have bounded length;
* not attempt global identity resolution;
* not be silently reordered.

---

# 40. ContributorRole

Supported initial values:

```text
AUTHOR
EDITOR
TRANSLATOR
ILLUSTRATOR
CONTRIBUTOR
```

Additional roles may be added compatibly when client unknown-value handling is defined.

Transport values shall be stable strings.

---

# 41. ContributorOrder

Represents deterministic display order.

Rules:

```text
value >= 0
```

Within one Publication, contributor ordering values should be unique or resolved deterministically.

---

# 42. SubjectName

## Meaning

Represents one authoritative catalog subject.

Rules:

* non-empty;
* trimmed;
* bounded;
* Unicode-preserving;
* case-insensitive duplicate detection may use a normalized key;
* display text remains preserved.

The module does not define a global controlled ontology yet.

---

# 43. PublisherName

Represents authoritative publisher display text.

Rules are equivalent to bounded contributor-like names.

An empty normalized publisher becomes absence.

---

# 44. LanguageCode

## Meaning

Represents publication language.

The baseline accepts valid BCP 47-compatible language tags.

Examples:

```text
es
es-AR
en
en-US
pt-BR
```

---

# 45. LanguageCode Normalization

Canonicalization should follow platform-standard BCP 47 normalization where deterministic across server and client.

At minimum:

* trim;
* reject spaces;
* validate syntax;
* normalize letter casing consistently.

The transport contract shall preserve one canonical representation.

---

# 46. PublicationDate

## Meaning

Represents a publication date whose precision may be incomplete.

A source may provide:

```text
year
year-month
full date
```

Therefore, the Domain should not force every publication into a full timestamp.

Conceptual structure:

```text
PublicationDate
├── year
├── month?
└── day?
```

---

# 47. PublicationDate Rules

* valid Gregorian year;
* month requires valid year;
* day requires valid year and month;
* day must exist in the selected month;
* precision shall be preserved;
* timezone is not applicable.

Transport may use ISO-compatible forms:

```text
2026
2026-07
2026-07-15
```

---

# 48. PublicationType

Initial supported values may include:

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

PublicationType is independent from source file format.

A paper may be represented by a PDF, for example.

---

# 49. PublicationFormat

Initial supported value:

```text
PDF
```

Future possible values:

```text
EPUB
MARKDOWN
HTML_ARCHIVE
IMAGE_COLLECTION
```

Unsupported values shall be rejected by the Master Library Module until explicitly implemented.

---

# 50. MediaType

Initial supported source media type:

```text
application/pdf
```

Rules:

* lowercase type and subtype;
* no arbitrary parameters in the canonical Domain value unless explicitly supported;
* validated independently from file extension.

MediaType and PublicationFormat shall agree.

---

# 51. OriginalFileName

## Meaning

Preserves original source filename as non-authoritative metadata.

Rules:

* optional;
* basename only;
* no directory traversal;
* no path separators;
* no NUL characters;
* bounded length;
* not used as committed storage identity.

Infrastructure shall sanitize external filenames before creating this value.

---

# 52. MasterLibraryName

Represents user-facing Library name.

Rules:

* non-empty;
* trimmed;
* bounded;
* Unicode-preserving;
* independent from filesystem directory name.

A default name may be supplied by the application during initialization.

---

# 53. MasterLibraryFormatVersion

## Meaning

Identifies the format used to interpret the Master Library manifest and physical structure.

Conceptual structure:

```text
major.minor
```

or another explicitly selected semantic form.

Breaking interpretation changes require major-version change.

The value is independent from:

* server application version;
* API version;
* database schema version.

---

# 54. ApiVersion

Initial value:

```text
v1
```

`ApiVersion` identifies the network contract family.

Rules:

* immutable;
* canonical lowercase representation;
* not derived from server version;
* used in compatibility evaluation.

---

# 55. SchemaVersion

Represents one persistent schema migration level.

Separate values exist for:

* server catalog schema;
* client local schema.

SchemaVersion shall:

* be non-negative;
* increase monotonically;
* remain independent from application version.

---

# 56. ApplicationVersion

Represents server or client software version.

The Domain may treat this as a compatibility value rather than core business value.

The implementation should use semantic-version-compatible representation:

```text
major.minor.patch
```

Optional pre-release/build metadata may be supported.

---

# 57. StorageReference

## Meaning

Identifies one logical server-side storage object without exposing a physical path.

Conceptual components:

```text
scheme
resource identity
version identity
```

Example canonical representation:

```text
publication-source://<publication-id>/<source-version>
```

---

# 58. StorageReference Rules

A StorageReference shall:

* use an approved scheme;
* contain validated identifiers;
* contain no `..`;
* contain no physical root;
* contain no arbitrary user path;
* remain stable when the physical Master Library root moves;
* be resolved only by infrastructure.

---

# 59. LocalStorageReference

## Meaning

Identifies one logical device-local payload.

Example:

```text
local-publication://<server-id>/<master-library-id>/<publication-id>/<source-version>
```

It shall not expose the physical Application Support path.

---

# 60. CoverReference

Identifies an authoritative cover asset.

Possible representation:

```text
cover-asset://<publication-id>/<asset-version>
```

The initial module may use a simpler opaque identifier.

Rules:

* optional;
* never an arbitrary NAS path;
* immutable for one specific cover asset;
* may change without changing SourceVersion when cover is managed independently.

---

# 61. ServerEndpoint

## Meaning

Represents the network location used to contact a server.

Conceptual structure:

```text
ServerEndpoint
├── scheme
├── host
├── port
└── basePath
```

The endpoint is not server identity.

---

# 62. ServerEndpoint Rules

Approved production scheme:

```text
https
```

Development may permit:

```text
http
```

Rules:

* valid host;
* valid port range;
* no embedded credentials;
* normalized base path;
* no query string;
* no fragment;
* no trailing ambiguity;
* canonical representation.

---

# 63. ServerEndpoint Normalization

Normalization shall:

* lowercase scheme;
* normalize host where supported;
* remove default port only if canonical policy requires it;
* normalize base-path slashes;
* reject path traversal;
* preserve IPv6 formatting correctly;
* avoid DNS resolution during value construction.

---

# 64. ServerFingerprint

## Meaning

Represents trusted cryptographic identity evidence for a server certificate or key.

Conceptual structure:

```text
algorithm
digest
```

Initial algorithm may be SHA-256 over the approved certificate or public-key representation.

The exact fingerprint target shall be fixed in Contracts and Security documentation.

---

# 65. ServerFingerprint Rules

* canonical lowercase hexadecimal form;
* exact algorithm-specific length;
* immutable;
* safe to display in grouped format;
* comparison based on canonical bytes;
* no silent replacement.

---

# 66. CatalogCursor

## Meaning

Represents an opaque catalog pagination position.

Rules:

* non-empty;
* bounded length;
* opaque to clients;
* server-generated;
* not manually constructed by Presentation;
* scoped to query/sort context;
* may expire or become invalid.

The Domain may model CatalogCursor at the application-contract boundary rather than core Publication Domain.

---

# 67. PageSize

Represents bounded requested page size.

Rules:

```text
minimum <= value <= maximum
```

Recommended initial defaults:

```text
default = 50
maximum = 100
```

Final values belong in Contracts and Performance configuration.

---

# 68. SearchQuery

## Meaning

Represents normalized catalog metadata search input.

Rules:

* trimmed;
* bounded length;
* may be empty only when interpreted as no search;
* reject control-only input;
* preserve display input separately where needed;
* avoid embedding query-language operators unless explicitly supported.

---

# 69. SortOrder

Conceptual values:

```text
TITLE_ASC
TITLE_DESC
CREATED_AT_ASC
CREATED_AT_DESC
UPDATED_AT_ASC
UPDATED_AT_DESC
```

The initial required order is:

```text
TITLE_ASC
```

Unknown sort values shall be rejected.

---

# 70. AcquisitionProgress

## Meaning

Represents current acquisition byte progress.

Conceptual structure:

```text
AcquisitionProgress
├── bytesReceived
├── totalBytes
└── percentage?
```

---

# 71. AcquisitionProgress Rules

```text
bytesReceived >= 0
totalBytes > 0
bytesReceived <= totalBytes
```

Percentage is derived:

```text
bytesReceived / totalBytes
```

It shall not be persisted as authoritative when it can be recalculated.

Floating-point percentage is for presentation only.

---

# 72. AcquisitionProgress Update

Progress shall be monotonic within one AcquisitionAttempt.

A new Attempt may begin at:

```text
0
```

or a validated resume offset.

Progress from previous Attempts remains historical.

---

# 73. AvailabilityReason

Represents why a Master Library or Publication is unavailable.

Conceptual structure:

```text
code
safe description?
occurredAt
```

The reason shall:

* use stable code;
* avoid raw infrastructure details;
* avoid credentials and paths;
* support operational diagnosis through correlation identifiers.

---

# 74. FailureReason

Represents a stable Domain or application failure reference.

Conceptual structure:

```text
errorCode
retryability
safe context?
correlationId?
```

It shall not embed:

* stack trace;
* raw exception;
* credentials;
* raw physical paths.

---

# 75. Instant

## Meaning

Represents an exact point in time.

Canonical transport representation:

```text
RFC 3339 / ISO 8601 UTC
```

Example:

```text
2026-07-15T21:30:00Z
```

---

# 76. Instant Rules

* timezone-normalized to UTC for persistence and transport;
* immutable;
* sufficient precision for ordered operations;
* no local timezone embedded in authoritative value;
* created through an application-supplied Clock.

Presentation may convert to the user's timezone.

---

# 77. Duration

The Domain may use a Duration value for:

* timeout policy;
* operation duration;
* retry delay;
* staging retention.

Rules:

* non-negative;
* explicit unit;
* no ambiguous raw integer milliseconds at public boundaries.

Duration belongs primarily to configuration and application policy.

---

# 78. RetryCount

Represents bounded retry attempts.

Rules:

```text
value >= 0
value <= configured maximum
```

RetryCount is not AcquisitionAttempt identity.

---

# 79. IdempotencyKey

Administrative or mutation operations may use an IdempotencyKey.

Rules:

* opaque;
* non-empty;
* bounded;
* scoped to authenticated actor and operation;
* retained for bounded time;
* must not contain secrets.

It is not a Domain entity identifier.

---

# 80. CompatibilityRange

May represent supported client-server version compatibility.

Conceptually:

```text
minimumSupported
maximumSupported?
```

This value belongs to contract/application compatibility policy rather than core publication Domain.

---

# 81. NormalizedText

A private reusable value may represent normalized search keys.

It shall never replace authoritative display text.

Uses:

* title sort key;
* contributor search key;
* subject duplicate key;
* publisher search key.

Normalization rules must be deterministic across server operations.

---

# 82. Optional Text Policy

For optional textual values:

```text
null / absence
```

shall represent missing data.

Empty strings shall be normalized to absence after trimming unless an explicit empty value has Domain meaning.

---

# 83. Unicode Policy

The Domain shall preserve Unicode display values.

Validation and normalization shall avoid:

* lossy ASCII conversion;
* arbitrary diacritic removal from authoritative text;
* locale-dependent canonical storage;
* platform-specific incompatible forms.

Search normalization may create separate derived keys.

---

# 84. Collection Value Objects

Collections such as contributors and subjects shall expose immutable ordered values.

They shall:

* prevent uncontrolled mutation;
* define duplicate behavior;
* preserve deterministic order;
* validate every member.

Examples:

```text
ContributorList
SubjectList
```

---

# 85. ContributorList

Rules:

* may be empty only when publication metadata permits unknown contributors;
* deterministic order;
* no duplicated ContributorEntryId;
* contributor role validated;
* immutable collection.

A publication may have several authors.

---

# 86. SubjectList

Rules:

* immutable;
* deterministic order;
* duplicate detection using normalized subject key;
* preserves authoritative display form;
* bounded total count.

Final count limits belong in Contracts.

---

# 87. PublicationMetadata

Although composed of several values, `PublicationMetadata` is itself a value object.

Conceptual structure:

```text
PublicationMetadata
├── title
├── subtitle?
├── contributors
├── language?
├── description?
├── subjects
├── publisher?
├── publicationDate?
├── publicationType
├── sourceFormat
└── coverReference?
```

---

# 88. PublicationMetadata Equality

Equality compares all authoritative metadata values.

Metadata equality does not imply Publication identity equality.

Two different Publications may currently have equal metadata.

---

# 89. PublicationMetadataSnapshot

Represents a device-local offline snapshot.

It may omit fields not required for offline listing.

It shall include snapshot provenance:

```text
catalogRevision
capturedAt
```

The snapshot is derived and non-authoritative.

---

# 90. PublicationMetadataSnapshot Rules

* may become stale;
* may be refreshed without changing LocalLibraryItem payload;
* shall remain associated with ServerId and MasterLibraryId;
* shall contain no personal state;
* shall not be used to mutate server authority.

---

# 91. LocalInstallationEvidence

An application-level value object may represent verified installation facts.

Conceptually:

```text
LocalInstallationEvidence
├── storageReference
├── sourceVersion
├── byteLength
├── checksum
├── committedAt
└── localLibraryItemCommitted
```

It is supplied to AcquisitionOperation completion.

---

# 92. LocalInstallationEvidence Rules

All values shall match the AcquisitionOperation target and expected integrity metadata.

The evidence object shall reject:

* mismatched PublicationId context;
* mismatched SourceVersion;
* mismatched ByteLength;
* mismatched Checksum;
* uncommitted state.

---

# 93. ResumeCheckpoint

Represents persisted safe resume information.

Conceptual structure:

```text
ResumeCheckpoint
├── operationId
├── attemptId
├── offset
├── sourceVersion
├── byteLength
├── checksum
├── stagingReference
└── persistedAt
```

---

# 94. ResumeCheckpoint Rules

A checkpoint is valid only when:

* all target identifiers match;
* offset matches actual staging length;
* SourceVersion remains exact;
* expected ByteLength and Checksum remain exact;
* staging reference belongs to the same operation;
* server supports Range.

Otherwise, it shall be rejected.

---

# 95. Value Object Error Policy

Invalid value construction shall produce stable Domain errors such as:

```text
INVALID_IDENTIFIER
INVALID_SOURCE_VERSION
INVALID_CATALOG_REVISION
INVALID_CHECKSUM
INVALID_BYTE_LENGTH
INVALID_BYTE_OFFSET
INVALID_PUBLICATION_TITLE
INVALID_LANGUAGE_CODE
INVALID_MEDIA_TYPE
INVALID_STORAGE_REFERENCE
INVALID_SERVER_ENDPOINT
INVALID_CATALOG_CURSOR
INVALID_PAGE_SIZE
INVALID_SEARCH_QUERY
INVALID_TIMESTAMP
```

---

# 96. Value Object Persistence Mapping

Persistence mapping shall use canonical primitive forms.

Examples:

| Value Object      | Persistence Form                       |
| ----------------- | -------------------------------------- |
| PublicationId     | TEXT UUID                              |
| SourceVersion     | INTEGER                                |
| CatalogRevision   | INTEGER                                |
| ChecksumAlgorithm | TEXT                                   |
| Checksum value    | TEXT                                   |
| ByteLength        | INTEGER                                |
| PublicationDate   | TEXT with preserved precision          |
| Instant           | UTC TEXT or approved integer timestamp |
| StorageReference  | TEXT logical URI                       |
| PublicationType   | TEXT enum                              |

---

# 97. Integer Interoperability

Server TypeScript and Swift shall use compatible integer ranges.

The API shall not rely on JavaScript floating-point safety for unbounded integers.

For byte lengths and revisions, the contract shall use values within the safe interoperable range or serialize large values as canonical decimal strings if future scale requires it.

The initial implementation shall validate these bounds explicitly.

---

# 98. API Mapping

Transport DTOs may represent value objects as primitives.

Examples:

```json
{
  "publicationId": "8cb48a52-bdaa-4dd0-bf3b-8c0a38552ef3",
  "sourceVersion": 2,
  "byteLength": 73400320,
  "checksum": {
    "algorithm": "sha-256",
    "value": "..."
  }
}
```

The client shall reconstruct validated client Domain values from these primitives.

---

# 99. Unknown Enumeration Values

Transport clients shall safely handle future unknown string enumeration values.

Client strategy:

```text
known value
→ mapped Domain value

unknown value
→ unsupported/unknown compatibility state
```

Unknown values shall not crash decoding or be silently treated as a known state.

---

# 100. Logging Policy

Value objects safe to log in canonical form include:

```text
MasterLibraryId
PublicationId
SourceVersion
CatalogRevision
AcquisitionOperationId
AcquisitionAttemptId
RequestId
CorrelationId
```

Potentially sensitive or verbose values shall be omitted or redacted.

Never log:

* credentials;
* token values;
* private keys;
* full server secrets.

---

# 101. Value Object Testing

Every value object shall have tests for:

* valid construction;
* invalid construction;
* normalization;
* equality;
* inequality;
* canonical serialization;
* rehydration;
* boundary values;
* unsupported values;
* cross-language fixtures where transported.

---

# 102. Identifier Tests

Required cases:

```text
valid lowercase UUID
valid uppercase UUID normalized
surrounding whitespace handling
invalid UUID
empty value
braced UUID rejection
identity equality
different semantic types not interchangeable
```

---

# 103. Version Tests

Required cases:

```text
SourceVersion 1 valid
SourceVersion 0 invalid
negative invalid
ordering
next version
overflow rejection
cross-publication comparison policy
```

---

# 104. Checksum Tests

Required cases:

```text
valid SHA-256
uppercase normalized
wrong length
invalid character
unsupported algorithm
algorithm-sensitive equality
```

---

# 105. Byte Tests

Required cases:

```text
positive ByteLength
zero committed length rejection
negative rejection
large valid value
overflow rejection
valid ByteOffset
offset greater than length rejection
```

---

# 106. Text Tests

Required cases:

```text
trim boundaries
preserve internal Unicode
reject blank-only title
normalize empty optional text to absence
enforce length limit
preserve display value
produce normalized search key
```

---

# 107. Endpoint Tests

Required cases:

```text
valid HTTPS hostname
valid HTTPS IPv4
valid HTTPS IPv6
valid development HTTP
invalid scheme
embedded credentials rejection
query rejection
fragment rejection
path normalization
default port policy
```

---

# 108. Storage Reference Tests

Required cases:

```text
valid logical reference
physical path rejection
path traversal rejection
invalid scheme
missing identity
source-version mismatch
canonical serialization
```

---

# 109. Cross-Language Fixtures

Shared fixtures shall cover:

* identifiers;
* SourceVersion;
* CatalogRevision;
* Checksum;
* ByteLength;
* PublicationDate precision;
* enums;
* timestamps;
* endpoints;
* error codes.

TypeScript and Swift tests shall consume equivalent fixtures.

---

# 110. Value Object Completion Gate

The value-object design is complete when:

```text
[ ] Identifier values are defined
[ ] Version values are defined
[ ] Revision values are defined
[ ] Integrity values are defined
[ ] Byte values are defined
[ ] Publication metadata values are defined
[ ] Storage references are defined
[ ] Server endpoint and trust values are defined
[ ] Pagination values are defined
[ ] Acquisition progress values are defined
[ ] Time values are defined
[ ] Validation and normalization are explicit
[ ] Equality and ordering are explicit
[ ] Persistence mapping is explicit
[ ] API mapping is explicit
[ ] Cross-language behavior is explicit
[ ] Error behavior is explicit
[ ] Testing obligations are explicit
[ ] Personal-state exclusion is preserved
[ ] No architectural contradiction remains
```

---

# 111. Value Object Invariants

The following invariants apply:

* Value objects are immutable.
* Identifiers are opaque and type-safe.
* Publication identity is independent from physical storage.
* SourceVersion is positive and publication-scoped.
* CatalogRevision is Master Library-scoped.
* Checksums use canonical algorithm-aware representation.
* Byte values use exact integer semantics.
* Display text and normalized search text remain distinct.
* Storage references are logical, never physical paths.
* Server endpoint is not server identity.
* Catalog cursors remain opaque.
* Acquisition progress cannot exceed expected total.
* Timestamps remain canonical UTC instants.
* Optional empty text becomes absence.
* Transport primitives are revalidated into Domain values.
* Personal state is absent.

---

# 112. Prohibited Value Object Designs

The Domain shall not:

* represent every identifier as an interchangeable string;
* represent byte lengths with floating point;
* accept arbitrary checksum text;
* derive PublicationId from checksum or filename;
* expose physical paths through StorageReference;
* treat ServerEndpoint as ServerId;
* compare SourceVersion across unrelated Publications;
* persist local-time timestamps as authoritative instants;
* overwrite display text with normalized search text;
* accept blank mandatory text;
* silently accept unknown enum values as known values;
* bypass validation during persistence rehydration;
* store personal annotations or progress in PublicationMetadata.

---

# 113. Related Documents

## Domain

* `README.md`
* `DomainModel.md`
* `Entities.md`
* `States.md`
* `Errors.md`

## Technical Design

* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

## Future Contracts and Persistence

* `../04-Contracts/README.md`
* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/LocalLibraryStorage.md`

---

# 114. Status

**Approved**

The immutable identifiers, versions, revisions, integrity values, metadata values, storage references, endpoint values, pagination values, acquisition values and temporal values of the Master Library Domain are defined.

The next document is:

```text
01-MasterLibrary/03-Domain/States.md
```

It shall define every lifecycle state, allowed transition, terminal state, recovery state and cross-state invariant.
