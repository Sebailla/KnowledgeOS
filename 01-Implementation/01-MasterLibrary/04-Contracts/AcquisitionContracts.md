

# Master Library Acquisition Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Acquisition Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the contracts used by a KnowledgeOS client to acquire one exact Publication source from the Master Library.

It establishes:

* acquisition preparation;
* exact source selection;
* full content transfer;
* single-range resumed transfer;
* authoritative content metadata;
* transfer preconditions;
* client-owned acquisition identity;
* acquisition attempts;
* transfer checkpoints;
* ByteLength validation;
* checksum validation;
* local staging;
* atomic installation;
* retry;
* resume;
* cancellation;
* recovery;
* update acquisition;
* preservation of previous local versions;
* error behavior;
* security boundaries;
* testing obligations.

The acquisition process transfers one exact immutable SourceVersion from the NAS-hosted Master Library into one device-local Selective Library.

---

# 2. Scope

This document defines the contracts for:

```text
HEAD /v1/publications/{publicationId}/content

GET  /v1/publications/{publicationId}/content
```

It also defines the client-owned acquisition workflow surrounding those endpoints.

The contract applies to:

* macOS;
* iPhone;
* iPad;
* future compatible Reader clients;
* publication installation;
* publication update;
* interrupted transfer recovery;
* offline continuation after completed local installation.

---

# 3. Explicit Exclusions

This document does not define:

* server-side acquisition sessions;
* server-owned download progress;
* publication registration;
* source replacement;
* local annotation synchronization;
* reading-progress synchronization;
* personal-tag synchronization;
* CloudKit transfer;
* peer-to-peer device transfer;
* background URLSession implementation details;
* filesystem paths;
* UI design;
* DRM;
* multi-range responses;
* torrent-style transfer;
* differential binary patching;
* delta publication updates.

---

# 4. Core Acquisition Principle

> An acquisition installs one exact immutable SourceVersion into one device-local Library.

The complementary principle is:

> The server delivers source bytes. The client owns transfer state, validation, installation and local completion.

---

# 5. Authority Separation

## Server Authority

The server owns:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
MediaType
ByteLength
Checksum
ETag
remote availability
content-delivery capability
```

## Client Authority

The client owns:

```text
AcquisitionOperationId
AcquisitionAttemptId
transfer state
staging payload
received byte count
resume checkpoint
retry count
validation state
local installation
LocalLibraryItem
local integrity
local completion
```

---

# 6. Acquisition Identity

One logical client acquisition is identified by:

```text
AcquisitionOperationId
```

Each execution or retry is identified by:

```text
AcquisitionAttemptId
```

The operation identity remains stable across retries.

Each retry creates a new Attempt identity.

---

# 7. Exact Source Context

Every acquisition shall freeze:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
ByteLength
Checksum
MediaType
ETag?
```

before payload transfer begins.

This frozen context is the acquisition target.

---

# 8. Source Substitution Prohibition

The server shall never silently substitute another SourceVersion.

Example of prohibited behavior:

```text
requested SourceVersion = 2
delivered SourceVersion = 3
```

The server shall instead return an explicit error.

---

# 9. Acquisition Overview

The complete acquisition flow is:

```text
Select Publication
    ↓
Retrieve PublicationDetails
    ↓
Freeze exact source context
    ↓
Create AcquisitionOperation
    ↓
Create AcquisitionAttempt
    ↓
Inspect content metadata
    ↓
Prepare local staging
    ↓
Download full or resumed range
    ↓
Validate ByteLength
    ↓
Validate Checksum
    ↓
Commit final local payload
    ↓
Commit LocalLibraryItem
    ↓
Mark acquisition completed
```

---

# 10. Baseline Endpoints

The initial transport endpoints are:

```text
HEAD /v1/publications/{publicationId}/content?sourceVersion={sourceVersion}

GET  /v1/publications/{publicationId}/content?sourceVersion={sourceVersion}
```

No separate server-side acquisition resource is required in v1.

---

# 11. Why No Server Acquisition Session Exists

The server does not create an acquisition session because:

* transfers are read-only;
* HTTP Range already supports continuation;
* client state must survive device restart;
* the server does not own local installation;
* server-side session cleanup adds unnecessary complexity;
* one source may be downloaded independently by several devices.

---

# 12. Authentication

Both content endpoints require:

```text
Authorization: Bearer <opaque-device-credential>
```

Allowed roles:

```text
READER
ADMINISTRATOR
```

Required capability:

```text
PUBLICATION_DOWNLOAD
```

---

# 13. Acquisition Preconditions

An acquisition may begin only when:

* server trust is valid;
* authentication is valid;
* MasterLibraryId matches;
* Publication exists;
* Publication is acquirable;
* requested SourceVersion exists;
* source is committed;
* source integrity state is valid;
* ByteLength is known;
* Checksum is known;
* source storage is readable;
* client supports the source format;
* client has sufficient local storage.

---

# 14. Client Compatibility Preconditions

The client shall verify:

```text
API version supported
PUBLICATION_DOWNLOAD capability present
source format supported
media type supported
checksum algorithm supported
ByteLength representable
```

For resumed transfer:

```text
SINGLE_RANGE_DOWNLOAD capability present
rangeSupported = true
```

---

# 15. Acquisition Preparation

The client prepares acquisition from:

```text
PublicationDetails.currentSource
```

and confirms it through:

```text
HEAD /v1/publications/{publicationId}/content
```

The two representations shall agree.

---

# 16. Preparation Request

```text
HEAD /v1/publications/{publicationId}/content?sourceVersion={sourceVersion}
```

Example:

```text
HEAD /v1/publications/4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc/content?sourceVersion=2
```

---

# 17. Preparation Headers

The client should include:

```text
Authorization
X-Request-Id
X-Correlation-Id
X-Acquisition-Operation-Id
X-KnowledgeOS-Client-Version
X-KnowledgeOS-Client-Platform
```

---

# 18. Preparation Result

The HEAD response defines the authoritative transfer context.

Required headers:

```text
Content-Type
Content-Length
ETag
X-KnowledgeOS-Master-Library-Id
X-KnowledgeOS-Publication-Id
X-KnowledgeOS-Source-Version
X-KnowledgeOS-Checksum-Algorithm
X-KnowledgeOS-Checksum
X-Request-Id
```

Range-capable sources also return:

```text
Accept-Ranges: bytes
```

---

# 19. Acquisition Preparation Validation

The client shall verify:

```text
response MasterLibraryId = expected MasterLibraryId
response PublicationId = expected PublicationId
response SourceVersion = expected SourceVersion
response Content-Length = expected ByteLength
response checksum = expected Checksum
response Content-Type = expected MediaType
response ETag = expected ETag when available
```

Any mismatch blocks transfer.

---

# 20. Preparation Mismatch

A preparation mismatch shall produce a client-owned error:

```text
ACQUISITION_SOURCE_CHANGED
```

or:

```text
ACQUISITION_PRECONDITION_MISMATCH
```

The client shall:

1. stop acquisition;
2. discard the unfrozen transfer context;
3. refresh PublicationDetails;
4. require a new AcquisitionOperation or explicit restart.

---

# 21. AcquisitionOperation

Conceptually:

```text
AcquisitionOperation
├── acquisitionOperationId
├── serverId
├── masterLibraryId
├── publicationId
├── sourceVersion
├── expectedByteLength
├── expectedChecksum
├── expectedMediaType
├── expectedETag?
├── state
├── currentAttemptId?
├── createdAt
├── updatedAt
├── completedAt?
└── failure?
```

---

# 22. AcquisitionOperation Ownership

AcquisitionOperation is client-owned.

It shall not be persisted on the NAS.

It may be synchronized between Apple devices only if a future explicit personal-state contract permits it.

The baseline does not synchronize active acquisitions across devices.

---

# 23. Acquisition States

The client acquisition lifecycle uses:

```text
CREATED
PREPARING
READY
DOWNLOADING
PAUSED
VALIDATING
INSTALLING
COMPLETED
FAILED
CANCELLED
RECOVERY_REQUIRED
```

---

# 24. CREATED

The operation exists but has not yet completed remote and local preparation.

---

# 25. PREPARING

The client is validating:

* server identity;
* source metadata;
* storage capacity;
* staging state;
* transfer capability.

---

# 26. READY

The exact source context is frozen and local staging is prepared.

The transfer may begin.

---

# 27. DOWNLOADING

One AcquisitionAttempt is actively receiving bytes.

---

# 28. PAUSED

The transfer is intentionally or operationally suspended with a potentially valid resume checkpoint.

A paused operation is not terminal.

---

# 29. VALIDATING

The transfer body is complete and the client is validating:

* final ByteLength;
* checksum;
* source context;
* staging integrity.

---

# 30. INSTALLING

The client is committing the validated source into its final local Library location and updating LocalLibraryItem persistence.

---

# 31. COMPLETED

The exact SourceVersion is installed and committed locally.

Required evidence:

```text
final payload exists
final ByteLength valid
final Checksum valid
LocalLibraryItem committed
installed SourceVersion exact
```

---

# 32. FAILED

The current logical acquisition ended unsuccessfully.

A failed operation may be retried only according to failure policy.

---

# 33. CANCELLED

The user or client intentionally cancelled the acquisition.

Cancellation is not corruption.

---

# 34. RECOVERY_REQUIRED

The client cannot prove whether local installation completed safely.

Examples:

* app terminated during final move;
* payload committed but LocalLibraryItem write uncertain;
* LocalLibraryItem committed but final-file state uncertain;
* staging and final locations both exist unexpectedly.

---

# 35. AcquisitionAttempt

Conceptually:

```text
AcquisitionAttempt
├── acquisitionAttemptId
├── acquisitionOperationId
├── transferMode
├── initialOffset
├── finalOffset?
├── receivedBytes
├── state
├── startedAt
├── endedAt?
├── responseETag?
├── failure?
└── resumeCheckpoint?
```

---

# 36. Attempt States

```text
CREATED
ACTIVE
SUCCEEDED
FAILED
CANCELLED
INTERRUPTED
```

Only one Attempt may be active per AcquisitionOperation.

---

# 37. Transfer Modes

Initial values:

```text
FULL
RESUMED_RANGE
```

---

# 38. FULL Transfer

A full transfer starts at byte zero.

Request:

```text
GET /v1/publications/{publicationId}/content?sourceVersion={sourceVersion}
```

No Range header is sent.

---

# 39. RESUMED_RANGE Transfer

A resumed transfer starts from the validated local staging length.

Request example:

```text
Range: bytes=1048576-
```

It resumes the same exact SourceVersion.

---

# 40. GET Content Request

Example:

```text
GET /v1/publications/4c52c2f6-3d66-44ea-9ce9-20cb2c6311fc/content?sourceVersion=2
```

Headers:

```text
Authorization: Bearer <credential>
Accept: application/pdf
X-Acquisition-Operation-Id: <operation-id>
X-Correlation-Id: <correlation-id>
```

---

# 41. Full Transfer Response

HTTP:

```text
200 OK
```

Required headers:

```text
Content-Type
Content-Length
ETag
X-KnowledgeOS-Master-Library-Id
X-KnowledgeOS-Publication-Id
X-KnowledgeOS-Source-Version
X-KnowledgeOS-Checksum-Algorithm
X-KnowledgeOS-Checksum
X-Request-Id
```

Recommended:

```text
Accept-Ranges
Last-Modified
Cache-Control
```

---

# 42. Full Transfer Content-Length

For a full response:

```text
Content-Length = authoritative ByteLength
```

The client shall reject an incompatible value before installation.

---

# 43. Partial Transfer Request

Example:

```text
GET /v1/publications/{publicationId}/content?sourceVersion=2
Range: bytes=1048576-
If-Range: "publication-source-opaque-etag"
```

---

# 44. Partial Transfer Response

HTTP:

```text
206 Partial Content
```

Required headers:

```text
Content-Type
Content-Length
Content-Range
ETag
Accept-Ranges
X-KnowledgeOS-Master-Library-Id
X-KnowledgeOS-Publication-Id
X-KnowledgeOS-Source-Version
X-KnowledgeOS-Checksum-Algorithm
X-KnowledgeOS-Checksum
X-Request-Id
```

---

# 45. Content-Range Example

```text
Content-Range: bytes 1048576-73400319/73400320
```

The total shall equal expected ByteLength.

The start shall equal the requested resume offset.

---

# 46. Partial Content-Length

For a partial response:

```text
Content-Length = total bytes in returned range
```

It does not equal the full authoritative ByteLength unless the range begins at zero.

---

# 47. Single-Range Requirement

The v1 server supports one byte range.

The client shall not request multiple ranges.

Unsupported multi-range requests shall return:

```text
416 Range Not Satisfiable
```

or:

```text
RANGE_UNSUPPORTED
```

according to server validation.

---

# 48. Resume Checkpoint

Conceptually:

```text
ResumeCheckpoint
├── acquisitionOperationId
├── lastAttemptId
├── serverId
├── masterLibraryId
├── publicationId
├── sourceVersion
├── expectedByteLength
├── expectedChecksum
├── expectedETag?
├── stagingByteLength
├── stagingReference
├── createdAt
└── updatedAt
```

`stagingReference` is client-internal.

It shall not be transmitted to the server.

---

# 49. Resume Preconditions

Resume is allowed only when all of the following match:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
ByteLength
Checksum
ETag when used
staging payload existence
staging payload length
range capability
```

---

# 50. Resume Offset

The resume offset shall equal:

```text
current staging payload byte length
```

The client shall not trust a persisted numeric offset without validating the actual staging file.

---

# 51. Zero-Length Staging

When staging length is zero, the client shall use a FULL transfer rather than a resumed Range request.

---

# 52. Complete Staging Payload

When staging length equals expected ByteLength:

* no additional transfer is required;
* the client proceeds to validation;
* it shall not mark completed without checksum validation and installation commit.

---

# 53. Oversized Staging Payload

When:

```text
stagingByteLength > expectedByteLength
```

resume is invalid.

The client shall:

* stop;
* quarantine or delete the staging payload;
* create a new Attempt from zero;
* record `ACQUISITION_RESUME_INVALID`.

---

# 54. Resume Metadata Revalidation

Before a Range request, the client shall repeat HEAD or otherwise revalidate authoritative metadata.

The client shall not resume solely from old cached metadata.

---

# 55. If-Range

The client should send:

```text
If-Range: <expected-etag>
```

when an ETag exists.

This helps prevent resuming against changed content.

---

# 56. If-Range Mismatch Policy

The server shall not silently return a newer SourceVersion.

The preferred behavior is:

```text
412 Precondition Failed
```

with:

```text
IF_RANGE_PRECONDITION_FAILED
```

or:

```text
RANGE_SOURCE_VERSION_MISMATCH
```

The client shall restart source evaluation.

---

# 57. Unexpected Full Response During Resume

If the client sends a Range request but receives:

```text
200 OK
```

the client shall not append the body to existing staging data.

It shall either:

1. truncate staging and treat it as a new full transfer;
2. or cancel and restart explicitly.

The approved baseline is:

```text
cancel current Attempt and start a new FULL Attempt
```

This avoids accidental mixed payloads.

---

# 58. Range Start Mismatch

If returned Content-Range start differs from the requested offset:

* the client shall reject the response;
* no bytes shall be appended;
* the Attempt fails;
* the operation may restart from zero.

---

# 59. Range Total Mismatch

If Content-Range total differs from expected ByteLength:

```text
ACQUISITION_RESUME_INVALID
```

The existing checkpoint shall not be used.

---

# 60. ETag Mismatch

If response ETag differs from expected ETag:

```text
ACQUISITION_SOURCE_CHANGED
```

The client shall not combine bytes from different ETag contexts.

---

# 61. Checksum Header Mismatch

If response checksum metadata differs from the frozen expected Checksum:

```text
ACQUISITION_SOURCE_CHANGED
```

No response bytes shall be committed to the existing staging context.

---

# 62. SourceVersion Header Mismatch

If the response SourceVersion header differs from the requested SourceVersion:

* terminate transfer;
* reject all received bytes;
* record a protocol-integrity failure;
* do not retry automatically against the same context.

---

# 63. MasterLibraryId Mismatch

A response from another MasterLibraryId shall produce:

```text
MASTER_LIBRARY_IDENTITY_MISMATCH
```

The client shall:

* stop transfer;
* block automatic retry;
* re-evaluate server registration;
* preserve prior local content.

---

# 64. PublicationId Mismatch

A response PublicationId mismatch is a protocol-integrity failure.

The client shall reject the response.

---

# 65. Local Staging

The client shall download into a staging area.

The final local payload path shall not be used until validation succeeds.

Conceptually:

```text
Application Support/
└── KnowledgeOS/
    ├── staging/
    └── library/
```

These physical paths are implementation examples only and are not public contracts.

---

# 66. Staging Isolation

Staging payloads shall be isolated by:

```text
ServerId
MasterLibraryId
PublicationId
SourceVersion
AcquisitionOperationId
```

or an equivalent collision-safe structure.

---

# 67. Staging Payload Requirements

A staging payload shall:

* be non-authoritative;
* be replaceable;
* not appear as a valid LocalLibraryItem;
* not be opened by ordinary Reader workflows;
* remain isolated from final publication storage;
* be removable after failure or cancellation.

---

# 68. Disk-Space Validation

Before transfer, the client shall validate available local capacity.

Required capacity should include:

```text
expected payload size
+
temporary installation overhead
+
database commit overhead
+
safety margin
```

---

# 69. Insufficient Local Storage

The client-owned error is:

```text
INSUFFICIENT_LOCAL_STORAGE
```

The server does not return this error.

The operation shall remain unstarted or fail safely before installation.

---

# 70. Progress Tracking

Progress is client-owned.

Progress shall use:

```text
receivedBytes
expectedByteLength
```

Derived ratio:

```text
receivedBytes / expectedByteLength
```

---

# 71. Progress Invariants

Within one Attempt:

```text
receivedBytes >= 0
receivedBytes never decreases
receivedBytes <= expectedByteLength
```

For a resumed Attempt, displayed total operation progress may include the validated staging offset.

---

# 72. Server Progress Ownership Prohibition

The server shall not persist device download progress.

The content endpoint remains stateless.

---

# 73. Progress Persistence

The client may persist progress periodically.

It shall not require a database write for every received network chunk.

Persistence should be:

* bounded;
* batched;
* crash-tolerant;
* consistent with actual staging length.

---

# 74. Progress Recovery

After restart, actual staging length is authoritative over the last persisted `receivedBytes`.

The persisted value is advisory.

---

# 75. Transfer Completion

A transfer is complete when:

```text
stagingByteLength = expectedByteLength
```

This is necessary but not sufficient for successful acquisition.

Checksum validation remains mandatory.

---

# 76. ByteLength Validation

After transfer:

```text
actual staging ByteLength
=
expected ByteLength
```

Otherwise:

```text
BYTE_LENGTH_MISMATCH
```

The payload shall not be installed.

---

# 77. Checksum Validation

The client shall calculate the checksum of the complete staging payload.

The initial algorithm is:

```text
SHA-256
```

The result shall equal the expected authoritative Checksum.

---

# 78. Checksum Mismatch

On mismatch:

```text
CHECKSUM_MISMATCH
```

The client shall:

* reject installation;
* mark the Attempt failed;
* quarantine or delete the staging payload;
* preserve any previous local version;
* avoid automatic append resume;
* allow a new full Attempt according to retry policy.

---

# 79. Checksum Calculation Failure

Client-owned error:

```text
CHECKSUM_CALCULATION_FAILED
```

The payload shall not be installed.

---

# 80. Validation State

During ByteLength and checksum validation:

```text
AcquisitionOperation.state = VALIDATING
```

The transfer network task is already complete.

---

# 81. Installation Preconditions

Installation requires:

```text
staging payload exists
actual ByteLength valid
actual Checksum valid
identity context valid
final local storage available
client database writable
```

---

# 82. Atomic Local Installation

The client shall install through an atomic or recoverable sequence.

Preferred flow:

```text
validated staging payload
    ↓
prepare final destination
    ↓
atomic move or replace
    ↓
fsync or equivalent where required
    ↓
commit LocalLibraryItem
    ↓
mark acquisition completed
```

---

# 83. Cross-Resource Atomicity

Filesystem and client database cannot always commit in one native transaction.

Therefore, the installation shall use:

* explicit operation state;
* temporary final names;
* recovery markers;
* idempotent reconciliation;
* deterministic startup recovery.

---

# 84. LocalLibraryItem Commit

The client shall create or update a LocalLibraryItem containing at least:

```text
ServerId
MasterLibraryId
PublicationId
installed SourceVersion
local storage reference
expected ByteLength
expected Checksum
local integrity state
metadata snapshot
installedAt
updatedAt
```

---

# 85. Local Storage Reference

The client database shall store a logical local storage reference.

It should not expose a raw physical path to higher layers.

---

# 86. Local Integrity After Installation

After valid installation:

```text
LocalIntegrityState = VALID
LocalAvailability = AVAILABLE_LOCAL
```

---

# 87. Completion Evidence

AcquisitionOperation may transition to `COMPLETED` only when:

```text
final payload commit confirmed
LocalLibraryItem commit confirmed
installed SourceVersion exact
installed ByteLength exact
installed Checksum exact
local availability valid
```

---

# 88. Completion Timestamp

`completedAt` shall be set only after full local completion evidence exists.

---

# 89. Completion Event

The client may emit:

```text
PublicationAcquiredLocally
```

or:

```text
PublicationSourceInstalled
```

only after completion invariants hold.

---

# 90. Update Acquisition

An update acquisition installs a newer SourceVersion for an existing LocalLibraryItem.

Example:

```text
local SourceVersion = 2
remote SourceVersion = 3
```

---

# 91. Update Preservation Principle

> The previous valid local SourceVersion shall remain usable until the new SourceVersion is fully validated and committed.

---

# 92. Update Staging

The new SourceVersion shall use independent staging.

It shall not overwrite the current valid payload during transfer.

---

# 93. Update Validation

The new payload shall pass:

* exact SourceVersion validation;
* ByteLength validation;
* checksum validation;
* media-type validation;
* local commit validation.

---

# 94. Update Commit

The preferred update commit sequence is:

```text
current valid payload remains active
    ↓
new payload downloads to staging
    ↓
new payload validates
    ↓
new final payload prepared
    ↓
LocalLibraryItem switches to new SourceVersion
    ↓
old payload becomes removable
```

---

# 95. Old Version Cleanup

Old payload cleanup occurs only after the new version is fully committed.

Cleanup failure shall not invalidate the newly committed version.

It shall produce a recoverable maintenance condition.

---

# 96. Update Failure

If update acquisition fails:

* old valid SourceVersion remains installed;
* LocalLibraryItem remains associated with old SourceVersion;
* personal state remains unchanged;
* failed staging may be removed;
* operation may be retried.

---

# 97. Personal State Preservation During Update

Updating source payload shall not delete or reset:

```text
annotations
reading progress
personal tags
favorites
personal relationships
personal notes
```

Mapping personal state across source versions belongs to later document-processing and annotation contracts.

---

# 98. Retry

A retry re-executes a failed or interrupted logical AcquisitionOperation.

Each retry creates:

```text
new AcquisitionAttemptId
```

---

# 99. Retryable Failure Categories

Potentially retryable failures include:

```text
network interruption
server temporary unavailable
source storage temporary unavailable
rate limit
transfer timeout
temporary local persistence failure
temporary staging write failure
checksum mismatch after full cleanup
```

Checksum mismatch requires a new full Attempt.

---

# 100. Non-Retryable Failure Categories

Normally non-retryable without changed input or user action:

```text
SERVER_IDENTITY_MISMATCH
MASTER_LIBRARY_IDENTITY_MISMATCH
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
DEVICE_REVOKED
PUBLICATION_WITHDRAWN
PUBLICATION_CORRUPTED
SOURCE_VERSION_NOT_FOUND
unsupported source format
insufficient local storage
recovery ambiguity
```

---

# 101. Retry Attempt Limits

Automatic retry shall be bounded.

Recommended baseline:

```text
maximum automatic Attempts = 3
```

User-initiated retries may create further Attempts.

The exact value belongs to client configuration.

---

# 102. Retry Backoff

Automatic retries shall use exponential or bounded progressive backoff.

The client shall honor:

```text
Retry-After
```

when returned.

---

# 103. Retry Source Revalidation

Every new Attempt shall revalidate remote source metadata.

A retry shall not assume the previous SourceVersion remains available.

---

# 104. Retry with Existing Partial Payload

A retry may resume only when resume preconditions are satisfied.

Otherwise, it shall restart from byte zero.

---

# 105. Resume Failure Fallback

When resume validation fails:

1. mark the resume Attempt failed;
2. quarantine or delete partial staging;
3. create a new FULL Attempt;
4. preserve the same logical AcquisitionOperation only if target source context remains unchanged.

---

# 106. Source Change During Retry

If current remote source changed but the requested old SourceVersion remains valid and deliverable, the operation may continue acquiring the exact old version.

If the requested source is no longer deliverable:

```text
ACQUISITION_SOURCE_CHANGED
```

A new AcquisitionOperation is required for the new SourceVersion.

---

# 107. Pause

A client may pause an active transfer.

Pause behavior depends on network API capabilities.

A valid pause should:

* stop receiving bytes;
* flush staging writes;
* persist actual staging length;
* persist checkpoint;
* transition operation to `PAUSED`;
* leave no active Attempt.

---

# 108. Pause Does Not Guarantee Resume

Pause creates a candidate checkpoint.

Resume still requires remote and local revalidation.

---

# 109. Cancellation

Cancellation may be initiated by:

* user;
* client policy;
* local storage policy;
* application shutdown where continuation is not desired.

---

# 110. Cancellation State

A cancelled operation transitions to:

```text
CANCELLED
```

It shall not transition to `FAILED` solely because the user cancelled it.

---

# 111. Cancellation Cleanup

After cancellation, the client may:

* delete staging immediately;
* retain partial staging temporarily for undo;
* retain checkpoint according to explicit product policy.

The baseline is:

```text
delete staging and checkpoint after confirmed cancellation
```

---

# 112. Cancellation During Validation

If cancellation occurs during validation:

* checksum calculation may be cancelled;
* staging shall not be installed;
* operation becomes CANCELLED;
* previous local version remains intact.

---

# 113. Cancellation During Installation

Cancellation during final installation is unsafe once commit begins.

The baseline behavior is:

```text
installation commit becomes non-cancellable
```

The UI may stop presenting cancellation after the operation enters INSTALLING.

---

# 114. Application Termination During Transfer

After restart:

* inspect persisted operation;
* inspect staging payload;
* inspect active Attempt state;
* mark abandoned Attempt `INTERRUPTED`;
* determine whether resume is possible;
* transition operation to PAUSED or RECOVERY_REQUIRED.

---

# 115. Application Termination During Validation

After restart:

* validate staging existence;
* validate staging ByteLength;
* repeat checksum validation;
* continue from VALIDATING when safe.

---

# 116. Application Termination During Installation

After restart, the client shall reconcile:

```text
staging payload
temporary final payload
final payload
LocalLibraryItem
operation state
recovery marker
```

It shall not guess completion.

---

# 117. Recovery Outcomes

Recovery may conclude:

```text
COMPLETED
FAILED
PAUSED
RECOVERY_REQUIRED
```

---

# 118. Recovery to COMPLETED

Allowed only when the client proves:

* correct final payload exists;
* correct ByteLength;
* correct Checksum;
* LocalLibraryItem matches;
* no incompatible partial state remains.

---

# 119. Recovery to FAILED

Allowed when the client proves:

* no valid installation committed;
* invalid staging safely removed or quarantined;
* prior valid local version preserved.

---

# 120. Recovery to PAUSED

Allowed when:

* valid partial staging exists;
* exact source context remains known;
* no installation commit began;
* resume checkpoint can be reconstructed.

---

# 121. RECOVERY_REQUIRED

Used when evidence remains contradictory or incomplete.

The client shall:

* block opening the uncertain new payload;
* preserve any known previous valid version;
* expose diagnostic recovery action;
* avoid automatic deletion of potentially valid data.

---

# 122. Local Payload Quarantine

Invalid or ambiguous payloads may be moved to a client-internal quarantine area.

Quarantined payloads shall:

* not appear in the local Library;
* not be opened;
* not be synced as valid publications;
* be removable through maintenance.

---

# 123. Server-Side Transfer State

The server shall not store:

```text
AcquisitionOperationId state
download progress
staging offset
client retry count
client local path
client installation state
```

It may log AcquisitionOperationId as a diagnostic correlation value.

---

# 124. X-Acquisition-Operation-Id

The client may send:

```text
X-Acquisition-Operation-Id
```

Rules:

* UUID;
* client-generated;
* non-secret;
* diagnostic only;
* not authorization;
* not server-side state key;
* not idempotency authority.

---

# 125. Content Cache Policy

Publication source responses should use:

```text
Cache-Control: private, no-transform
```

Additional cache directives may be used.

The client installs and manages the payload through its own local Library.

---

# 126. no-transform

`no-transform` prevents intermediaries from changing source bytes in ways that would invalidate authoritative checksum semantics.

---

# 127. Transport Compression

The server should not apply transparent compression to PDF payloads unless checksum semantics and client decoding remain exact.

The preferred baseline is:

```text
no additional Content-Encoding for PDF
```

---

# 128. Content-Disposition

The source response may include:

```text
Content-Disposition: attachment; filename="publication.pdf"
```

The filename is advisory.

The client shall not use it as identity or final storage path.

---

# 129. Original Filename

An original filename may be exposed only if safe and useful.

The client shall sanitize it.

The baseline acquisition contract does not require it.

---

# 130. Full Transfer Error Before Body

Before response streaming begins, the server may return the standard JSON ErrorEnvelope.

---

# 131. Transfer Failure After Body Begins

After binary streaming begins:

* the connection may terminate;
* no JSON error envelope is guaranteed;
* the client marks the Attempt interrupted;
* received bytes remain staging only;
* retry or resume policy applies.

---

# 132. Partial Network Failure

A network failure shall not automatically delete partial staging.

The client may retain it when resume preconditions can later be revalidated.

---

# 133. Authentication Failure During Transfer

If the connection ends because authentication becomes invalid:

* current Attempt fails;
* partial staging may remain;
* automatic authentication retry is prohibited for revoked credentials;
* local publications remain available;
* re-pairing may later allow a new Attempt.

---

# 134. Device Revocation During Transfer

Device revocation affects future or interrupted requests.

The server may terminate an active response according to implementation capability.

The client shall preserve already installed local publications.

---

# 135. Publication Withdrawal During Transfer

If withdrawal occurs after transfer response begins:

* the in-flight immutable source response may complete or terminate;
* the client shall revalidate availability before installation when policy requires;
* the baseline permits installation only if the acquisition began while source was authorized and the exact payload validates.

For conservative v1 behavior, the client shall refresh PublicationDetails before final installation when the server remains reachable.

---

# 136. Final Availability Revalidation

Before installation, the client should perform a bounded final metadata check when:

* transfer was long-running;
* application resumed after interruption;
* source context may have changed;
* publication withdrawal policy requires it.

---

# 137. Withdrawal After Completed Local Installation

Remote withdrawal shall not delete the valid local copy.

---

# 138. Corruption Reported After Download

If the server reports the source corrupted before local installation:

* installation is blocked;
* staging is not trusted solely because local checksum matches the previously expected checksum;
* the operation fails or requires explicit offline policy.

The baseline blocks installation.

---

# 139. Server Availability During Validation

After all bytes are downloaded, local validation may complete offline.

Server connectivity is not required for ByteLength and checksum calculation.

Final installation may proceed only according to the frozen acquisition and availability policy.

---

# 140. Acquisition Offline Completion

If the exact payload was fully received and validated before connectivity loss, the client may complete local installation offline.

The operation remains tied to the frozen ServerId, MasterLibraryId, PublicationId and SourceVersion.

---

# 141. Local Metadata Snapshot

Installation shall persist a bounded Publication metadata snapshot sufficient for offline use.

The snapshot may include:

```text
title
subtitle
contributors
language
subjects
publisher
publicationDate
publicationType
sourceFormat
cover reference or local cover
captured CatalogRevision
capturedAt
```

---

# 142. Metadata Snapshot Authority

The local snapshot is derived.

It shall not overwrite NAS authority.

It may remain available when the remote publication becomes unavailable or withdrawn.

---

# 143. Cover Acquisition

Cover retrieval is independent from source acquisition.

A cover failure shall not fail the PDF acquisition.

The client may:

* retrieve cover before source;
* retrieve cover after installation;
* use catalog-cached cover;
* install publication without cover.

---

# 144. Cover Local Storage

A locally cached cover remains client-owned derived data.

It shall not be treated as the source payload.

---

# 145. Acquisition Error Categories

Acquisition errors include:

```text
PRECONDITION
AUTHENTICATION
AUTHORIZATION
TRUST
COMPATIBILITY
REMOTE_AVAILABILITY
TRANSFER
RANGE
LOCAL_STORAGE
VALIDATION
INSTALLATION
CANCELLATION
RECOVERY
```

---

# 146. Server-Returned Acquisition Errors

Potential server errors:

```text
AUTHENTICATION_REQUIRED
INVALID_CREDENTIAL
CREDENTIAL_REVOKED
DEVICE_REVOKED
AUTHORIZATION_DENIED
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
RANGE_NOT_SATISFIABLE
RANGE_UNSUPPORTED
RANGE_SOURCE_VERSION_MISMATCH
IF_RANGE_PRECONDITION_FAILED
ACQUISITION_RATE_LIMITED
MASTER_LIBRARY_UNAVAILABLE
MASTER_LIBRARY_IDENTITY_MISMATCH
```

---

# 147. Client-Owned Acquisition Errors

```text
ACQUISITION_PRECONDITION_MISMATCH
ACQUISITION_SOURCE_CHANGED
ACQUISITION_INTERRUPTED
ACQUISITION_CANCELLED
ACQUISITION_RESUME_UNSUPPORTED
ACQUISITION_RESUME_INVALID
ACQUISITION_INSTALLATION_FAILED
ACQUISITION_RECOVERY_REQUIRED
INSUFFICIENT_LOCAL_STORAGE
LOCAL_STAGING_UNAVAILABLE
LOCAL_STAGING_WRITE_FAILED
LOCAL_COMMIT_FAILED
CLIENT_DATABASE_UNAVAILABLE
CLIENT_PERSISTENCE_WRITE_FAILED
CHECKSUM_CALCULATION_FAILED
CHECKSUM_MISMATCH
BYTE_LENGTH_MISMATCH
SECURE_STORAGE_UNAVAILABLE
```

---

# 148. PUBLICATION_UNAVAILABLE

HTTP:

```text
503 Service Unavailable
```

Retryability depends on availability reason.

The client may retry after delay when explicitly marked retryable.

---

# 149. PUBLICATION_WITHDRAWN

HTTP:

```text
410 Gone
```

Retryable:

```text
false
```

---

# 150. PUBLICATION_CORRUPTED

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

# 151. SOURCE_VERSION_NOT_FOUND

HTTP:

```text
404 Not Found
```

Retryable:

```text
false
```

The client shall refresh details.

---

# 152. SOURCE_VERSION_CHANGED

HTTP:

```text
409 Conflict
```

Retryable:

```text
false
```

The existing frozen acquisition context is invalid.

---

# 153. SOURCE_STORAGE_UNAVAILABLE

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 154. RANGE_NOT_SATISFIABLE

HTTP:

```text
416 Range Not Satisfiable
```

The client shall validate staging length and checkpoint.

---

# 155. RANGE_UNSUPPORTED

HTTP:

```text
412 Precondition Failed
```

Client action:

```text
restart from byte zero
```

---

# 156. ACQUISITION_RATE_LIMITED

HTTP:

```text
429 Too Many Requests
```

Retryable:

```text
true
```

The client shall honor `Retry-After`.

---

# 157. Transfer Timeout

Network-layer timeout maps to:

```text
ACQUISITION_INTERRUPTED
```

or a more specific client transport error.

Partial staging may remain resumable.

---

# 158. Local Staging Failure

A staging write failure shall:

* stop network transfer;
* close file handles safely;
* preserve prior valid local version;
* mark Attempt failed;
* determine whether partial staging can be retained.

---

# 159. Local Database Failure

If final payload is valid but LocalLibraryItem commit fails:

```text
RECOVERY_REQUIRED
```

may be necessary.

The client shall not claim completion.

---

# 160. Final Payload Move Failure

If the atomic final move fails:

* LocalLibraryItem shall not switch to the new payload;
* previous valid version remains active;
* operation fails or requires recovery;
* validated staging may be retained.

---

# 161. Error Retry Matrix

| Error                      |  Automatic Retry |              Resume Allowed |
| -------------------------- | ---------------: | --------------------------: |
| Network interruption       |              Yes |       Yes, after validation |
| Server unavailable         |              Yes |                         Yes |
| Rate limited               | Yes, after delay |                         Yes |
| Source storage unavailable |              Yes |                         Yes |
| Invalid credential         |               No |   No until reauthentication |
| Credential revoked         |               No |         No until re-pairing |
| Publication withdrawn      |               No |                          No |
| Publication corrupted      |               No |                          No |
| SourceVersion changed      |               No |                          No |
| Range unsupported          |               No |                Restart full |
| Range invalid              |               No |                Restart full |
| Checksum mismatch          |          Limited |                          No |
| ByteLength mismatch        |          Limited |                          No |
| Insufficient local storage |               No |      After user frees space |
| Local staging failure      |          Limited | Depends on staging evidence |
| Recovery ambiguous         |               No |             Manual recovery |

---

# 162. Cancellation Response from Server

No server cancellation endpoint is required.

The client cancels its HTTP request locally.

The server may observe connection termination.

---

# 163. Acquisition Security

The content contract shall enforce:

* HTTPS;
* authenticated Device;
* authorized role;
* exact PublicationId;
* exact SourceVersion;
* bounded Range;
* no path parameters beyond governed identifiers;
* no arbitrary filesystem access;
* stable checksum headers;
* safe error responses.

---

# 164. Arbitrary Range Protection

The server shall validate:

```text
start >= 0
end >= start
start < total ByteLength
end < total ByteLength when present
single range only
```

---

# 165. Path Traversal Protection

PublicationId and SourceVersion shall map through trusted repositories and StorageReference adapters.

They shall never be concatenated directly from raw request text into arbitrary filesystem paths.

---

# 166. Content-Type Protection

The server shall return:

```text
X-Content-Type-Options: nosniff
```

where applicable.

The client shall still verify the expected media type.

---

# 167. Checksum Integrity Scope

The checksum describes the complete unencoded authoritative source bytes.

It does not describe:

* HTTP headers;
* partial ranges;
* Base64;
* compressed transport form;
* filesystem metadata.

---

# 168. Logging

Safe server transfer log fields:

```text
requestId
deviceId
masterLibraryId
publicationId
sourceVersion
rangeRequested
rangeStart?
responseStatus
bytesSent
duration
result
```

---

# 169. Server Log Prohibitions

Logs shall not contain:

* credential;
* physical source path;
* complete checksum when policy prohibits it;
* publication bytes;
* local client path;
* staging reference;
* personal state.

---

# 170. Client Acquisition Logging

Safe client fields:

```text
acquisitionOperationId
acquisitionAttemptId
serverId
masterLibraryId
publicationId
sourceVersion
transferMode
receivedBytes
state transition
error code
duration
```

---

# 171. Client Log Prohibitions

Client logs shall not contain:

* credential;
* Keychain secret;
* unrestricted local path;
* publication bytes;
* annotations;
* reading progress;
* personal notes.

---

# 172. Metrics

Recommended server metrics:

```text
publication_content_requests_total
publication_content_bytes_sent_total
publication_content_request_duration_seconds
publication_range_requests_total
publication_range_failures_total
publication_transfer_interruptions_total
publication_transfer_rate_limited_total
```

Recommended client metrics:

```text
acquisition_operations_total
acquisition_attempts_total
acquisition_completed_total
acquisition_failed_total
acquisition_resumed_total
acquisition_checksum_mismatch_total
acquisition_recovery_required_total
```

---

# 173. Metric Cardinality

Metrics shall not use:

* PublicationId;
* DeviceId;
* OperationId;
* AttemptId;
* RequestId;

as unbounded labels.

---

# 174. Server Application Use Case

The server use case is conceptually:

```text
DeliverPublicationContent
```

Request:

```text
authenticatedDevice
publicationId
sourceVersion
range?
conditional headers
requestContext
```

---

# 175. Server Content Result

Conceptually:

```text
PublicationContentResult
├── masterLibraryId
├── publicationId
├── sourceVersion
├── mediaType
├── totalByteLength
├── checksum
├── etag
├── lastModified?
├── selectedRange?
└── readable content stream
```

---

# 176. Server Repository Boundary

The Application layer may use:

```text
SourceReadRepository
SourceStorageReader
PublicationPolicy
```

It shall not expose a raw physical path to Transport.

---

# 177. Client Application Use Cases

The client use cases include:

```text
PreparePublicationAcquisition
StartPublicationAcquisition
PausePublicationAcquisition
ResumePublicationAcquisition
RetryPublicationAcquisition
CancelPublicationAcquisition
ValidateAcquiredPublication
InstallAcquiredPublication
RecoverAcquisition
UpdateLocalPublication
```

---

# 178. Client Persistence Requirements

The client shall persist enough information to recover:

* operation identity;
* source identity;
* expected integrity metadata;
* current state;
* Attempt history;
* staging logical reference;
* actual progress checkpoint;
* failure code;
* timestamps;
* installation evidence.

---

# 179. Operation Persistence Timing

The client shall persist the AcquisitionOperation before starting network transfer.

This prevents an untracked staging payload after a crash.

---

# 180. Attempt Persistence Timing

The client shall persist a new Attempt before issuing the network request.

---

# 181. State Transition Persistence

Important transitions shall be persisted atomically with their evidence where possible:

```text
READY → DOWNLOADING
DOWNLOADING → VALIDATING
VALIDATING → INSTALLING
INSTALLING → COMPLETED
any active state → FAILED
any cancellable state → CANCELLED
ambiguous state → RECOVERY_REQUIRED
```

---

# 182. Idempotent Recovery

Startup recovery shall be safe to execute repeatedly.

It shall not duplicate LocalLibraryItems or move the same payload twice incompatibly.

---

# 183. Acquisition Event Ordering

Events shall follow committed client state.

Example:

```text
LocalLibraryItem committed
    ↓
AcquisitionOperation completed
    ↓
PublicationAcquiredLocally emitted
```

No completion event precedes commit.

---

# 184. Background Execution

Apple clients may use platform background transfer facilities.

The platform implementation shall still preserve:

* exact SourceVersion;
* stable OperationId;
* Attempt identity;
* staging isolation;
* checksum validation;
* atomic installation.

---

# 185. Background Task Reattachment

After app relaunch, the client shall reconcile platform transfer-task identity with persisted AcquisitionAttempt state.

Unmatched background tasks shall not install payloads automatically.

---

# 186. Cellular Policy

Cellular transfer policy is client-owned.

The acquisition contract supports the same exact source semantics across network types.

---

# 187. User Consent

The client may require user confirmation based on:

* ByteLength;
* cellular connection;
* limited storage;
* update size;
* battery policy.

These are presentation and device policies.

---

# 188. Acquisition and iCloud

Publication source payloads are not automatically synchronized through iCloud under this contract.

Each device may acquire its own local copy from the Master Library.

Any future payload replication between devices requires a separate explicit decision.

---

# 189. Acquisition and Personal-State Sync

Personal state may synchronize separately between Apple devices.

That synchronization shall not:

* move PDF payloads implicitly;
* mark a publication downloaded on another device;
* change NAS authority;
* alter SourceVersion.

---

# 190. Device-Specific Local Membership

The same Publication may be:

```text
installed on macOS
not installed on iPhone
installed with older version on iPad
```

This is valid.

---

# 191. Contract Fixtures

Required fixtures:

```text
acquisition-head-success.txt
acquisition-full-response-headers.txt
acquisition-range-response-headers.txt
acquisition-range-invalid-error.json
acquisition-source-changed-error.json
acquisition-publication-withdrawn-error.json
acquisition-publication-corrupted-error.json
acquisition-rate-limited-error.json
acquisition-operation-created.json
acquisition-operation-paused.json
acquisition-operation-completed.json
acquisition-operation-recovery-required.json
resume-checkpoint-valid.json
resume-checkpoint-invalid.json
local-installation-evidence.json
```

---

# 192. Full Transfer Tests

Tests shall verify:

* authenticated Reader accepted;
* exact SourceVersion required;
* 200 returned;
* Content-Length exact;
* Content-Type exact;
* ETag exact;
* identity headers exact;
* checksum headers exact;
* response bytes match source;
* response checksum matches metadata;
* no path exposed.

---

# 193. Range Transfer Tests

Tests shall verify:

* valid start offset;
* 206 returned;
* Content-Range exact;
* partial Content-Length exact;
* complete payload checksum metadata retained;
* correct selected bytes returned;
* single-range support;
* If-Range behavior;
* exact SourceVersion retained.

---

# 194. Invalid Range Tests

Tests shall include:

```text
negative range
start beyond end
start equal to total length
end beyond total length
multiple ranges
malformed range
resume offset mismatch
```

---

# 195. Source Consistency Tests

For one exact SourceVersion, tests shall prove consistency between:

```text
PublicationDetails.currentSource
HEAD response
full GET response
partial GET response
client AcquisitionOperation target
installed LocalLibraryItem
```

---

# 196. Interruption Tests

Tests shall simulate:

* connection loss;
* app termination;
* server restart;
* device sleep;
* background task suspension;
* write interruption.

The client shall preserve recoverable staging safely.

---

# 197. Resume Tests

Tests shall verify:

* valid checkpoint resumes;
* changed ServerId fails;
* changed MasterLibraryId fails;
* changed PublicationId fails;
* changed SourceVersion fails;
* changed ByteLength fails;
* changed Checksum fails;
* changed ETag fails;
* incorrect staging length fails;
* full response to Range does not append;
* invalid checkpoint restarts full.

---

# 198. Validation Tests

Tests shall verify:

* exact ByteLength accepted;
* short payload rejected;
* oversized payload rejected;
* valid checksum accepted;
* checksum mismatch rejected;
* invalid payload never installed;
* validation may complete offline.

---

# 199. Installation Tests

Tests shall verify:

* staging is not visible as installed;
* valid source installs;
* LocalLibraryItem commits;
* completion occurs after both commits;
* final logical storage reference valid;
* no physical path exposed upward;
* previous version preserved during update;
* old payload cleanup happens after new commit.

---

# 200. Failure Injection Tests

Failure injection shall cover:

```text
failure before staging creation
failure during download
failure after download before validation
failure during checksum calculation
failure after validation before final move
failure after final move before database commit
failure after database commit before completion state
failure during old-version cleanup
```

---

# 201. Recovery Tests

Recovery tests shall prove:

* valid final payload plus LocalLibraryItem becomes completed;
* valid staging without install becomes paused or validating;
* contradictory state becomes recovery required;
* old valid version remains accessible;
* recovery is idempotent;
* no duplicate LocalLibraryItem is created.

---

# 202. Cancellation Tests

Tests shall verify:

* cancellation during download;
* staging cleanup;
* no completion event;
* previous local version preserved;
* cancellation distinct from failure;
* installation commit not cancellable after commit boundary.

---

# 203. Update Tests

Tests shall verify:

* newer SourceVersion detected;
* old version remains active during transfer;
* new version validates;
* LocalLibraryItem switches atomically;
* failed update preserves old version;
* annotations and progress preserved;
* old payload cleanup failure does not roll back valid new installation.

---

# 204. Authentication Failure Tests

Tests shall verify:

* missing credential;
* invalid credential;
* revoked credential;
* revoked device;
* Reader allowed;
* unauthorized device denied;
* local content preserved after revocation.

---

# 205. Trust Tests

Tests shall verify:

* ServerId mismatch stops transfer;
* fingerprint mismatch blocks credential transmission;
* MasterLibraryId mismatch stops transfer;
* no automatic trust replacement.

---

# 206. Rate-Limit Tests

Tests shall verify:

* 429 returned;
* Retry-After present;
* client waits;
* no retry storm;
* partial staging remains safe.

---

# 207. OpenAPI Requirements

OpenAPI shall define:

```text
GET /v1/publications/{publicationId}/content
HEAD /v1/publications/{publicationId}/content
sourceVersion query parameter
Range header
If-Range header
full-response headers
partial-response headers
binary media type
all public error responses
```

---

# 208. OpenAPI Binary Schema

The GET success response shall use:

```text
application/pdf
```

with a binary schema.

It shall not use JSON Base64.

---

# 209. Acquisition Contract Completion Gate

This document is complete when:

```text
[ ] Acquisition authority separation is explicit
[ ] Exact source context is frozen
[ ] AcquisitionOperation is defined
[ ] AcquisitionAttempt is defined
[ ] Acquisition states are defined
[ ] Attempt states are defined
[ ] HEAD preparation is defined
[ ] Full transfer is defined
[ ] Range transfer is defined
[ ] Required headers are defined
[ ] Source substitution is prohibited
[ ] ResumeCheckpoint is defined
[ ] Resume preconditions are defined
[ ] If-Range behavior is defined
[ ] Unexpected full response behavior is defined
[ ] Staging behavior is defined
[ ] Local storage validation is defined
[ ] Progress behavior is defined
[ ] ByteLength validation is defined
[ ] Checksum validation is defined
[ ] Atomic installation is defined
[ ] LocalLibraryItem commit is defined
[ ] Completion evidence is defined
[ ] Update acquisition is defined
[ ] Previous-version preservation is defined
[ ] Retry is defined
[ ] Pause is defined
[ ] Cancellation is defined
[ ] Recovery is defined
[ ] Offline completion is defined
[ ] Personal-state preservation is defined
[ ] Server statelessness is defined
[ ] Security rules are defined
[ ] Logging and metrics are defined
[ ] Server use case is defined
[ ] Client use cases are defined
[ ] Persistence obligations are defined
[ ] Background execution is defined
[ ] iCloud exclusions are defined
[ ] Fixtures are defined
[ ] Testing obligations are defined
[ ] No architectural contradiction remains
```

---

# 210. Acquisition Contract Invariants

The following invariants apply:

* One acquisition targets one exact SourceVersion.
* ServerId remains fixed.
* MasterLibraryId remains fixed.
* PublicationId remains fixed.
* ByteLength remains fixed.
* Checksum remains fixed.
* Source substitution is prohibited.
* The server owns source bytes.
* The client owns acquisition state.
* The NAS stores no device progress.
* Every retry creates a new Attempt.
* Only one Attempt is active per operation.
* Staging is never treated as installed content.
* ByteLength validation is mandatory.
* Checksum validation is mandatory.
* Invalid payloads are never installed.
* Completion requires final payload and LocalLibraryItem commit.
* Update failure preserves the previous version.
* Cancellation is distinct from failure.
* Recovery-required is distinct from failure.
* Resume requires exact context equality.
* Physical paths remain private.
* Credentials remain private.
* Local publication payloads remain device-specific.
* Personal state remains unchanged during acquisition and update.

---

# 211. Prohibited Acquisition Designs

The module shall not:

* silently download the latest SourceVersion instead of the requested version;
* append a full response to partial staging;
* resume across a changed checksum;
* resume across a changed ByteLength;
* resume across another MasterLibraryId;
* store acquisition progress on the NAS;
* mark completion after transfer alone;
* skip checksum validation;
* install directly into final storage before validation;
* delete the previous valid version before new commit;
* treat cancellation as corruption;
* treat staging as a LocalLibraryItem;
* expose source paths;
* expose local paths through the API;
* encode PDFs as Base64 JSON;
* use multi-range transfer in v1;
* synchronize publication payloads through iCloud implicitly;
* overwrite annotations or reading progress during update;
* delete local publications after credential revocation;
* trust persisted progress over actual staging length;
* claim recovery success without complete evidence.

---

# 212. Related Documents

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
* `../02-TechnicalDesign/TechnologyDecisions.md`

## Future Persistence

* `../05-Persistence/SourceStorageLayout.md`
* `../05-Persistence/LocalLibraryStorage.md`
* `../05-Persistence/ClientAcquisitionSchema.md`
* `../05-Persistence/RecoveryMarkers.md`

---

# 213. Status

**Approved**

The complete publication acquisition contract is frozen as:

```text
exact PublicationId
+
exact SourceVersion
+
authoritative ByteLength
+
authoritative Checksum
+
full or single-range transfer
+
client-owned staging
+
client-owned validation
+
atomic local installation
+
safe retry, resume, cancellation and recovery
```

The next document is:

```text
01-MasterLibrary/04-Contracts/AdministrationContracts.md
```

It shall define the complete Administrator API for:

```text
Master Library initialization
Pairing-code creation
Device management
Publication registration
Metadata update
Source replacement
Availability change
Publication withdrawal
Publication restoration
Integrity validation
```
