

# Master Library Acceptance Criteria

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Requirements

**Document:** Acceptance Criteria

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the measurable and testable acceptance criteria for the Master Library Module.

The criteria translate the approved:

* scope;
* functional requirements;
* non-functional requirements;
* security requirements;
* privacy requirements;
* offline requirements;
* operational requirements;
* use cases;

into observable evidence required for implementation validation and module completion.

---

# 2. Scope

The acceptance criteria cover:

* KnowledgeOS Server lifecycle;
* Master Library lifecycle;
* publication administration;
* Master Catalog behavior;
* client registration and authentication;
* catalog browsing;
* publication acquisition;
* Selective Local Library behavior;
* offline operation;
* update detection;
* integrity;
* security;
* privacy;
* performance;
* observability;
* deployment;
* backup and recovery.

---

# 3. Acceptance Authority

The acceptance criteria are constrained by:

1. Architecture V3.0;
2. Architecture Amendment V3.0-001;
3. ADR-013;
4. Implementation Governance;
5. Master Library Scope;
6. Master Library Use Cases.

A criterion cannot authorize behavior prohibited by Architecture.

---

# 4. Acceptance Criterion Identifiers

Acceptance criteria use:

```text
AC-<AREA>-XXX
```

Approved areas include:

```text
SRV   Server
LIB   Master Library
ADM   Administration
CAT   Master Catalog
CON   Connectivity
AUTH  Authentication and Authorization
ACQ   Acquisition
LOC   Selective Local Library
OFF   Offline
UPD   Source Updates
INT   Integrity
SEC   Security
PRV   Privacy
PERF  Performance
OBS   Observability
OPS   Operations
E2E   End-to-End
DOC   Documentation
```

---

# 5. Criterion Structure

Each acceptance criterion defines:

* ID;
* requirement;
* preconditions;
* action;
* expected result;
* evidence;
* priority;
* status.

---

# 6. Acceptance Statuses

Criteria use:

```text
Draft
Approved
Implemented
Passed
Failed
Blocked
Superseded
```

A criterion is complete only when its status is `Passed`.

---

# 7. Priority Model

```text
P0 — Required for module completion
P1 — Required before production completion
P2 — Important but deferrable with approved limitation
P3 — Optional or future
```

No P0 criterion may remain failed, blocked or unimplemented at module closure.

---

# 8. Validation Environment

Acceptance evidence shall identify the environment used.

At minimum:

```text
Server runtime
NAS model or representative environment
Server version
macOS version
Client version
Network type
Database version
Publication dataset
Publication file sizes
```

---

# 9. Server Lifecycle Criteria

## AC-SRV-001 — Valid Server Startup

**Priority:** P0

**Related Use Case:** UC-S01

Given valid server configuration and accessible Master Library storage, when KnowledgeOS Server starts, then:

* the process remains running;
* the configured API listener opens;
* structured startup logs are emitted;
* `/v1/health` becomes reachable;
* health reports the server state truthfully.

**Evidence:**

* automated integration test;
* startup log;
* health response.

---

## AC-SRV-002 — Invalid Configuration Failure

**Priority:** P0

Given missing or invalid mandatory configuration, when the server starts, then:

* startup fails explicitly;
* the process does not report healthy;
* the error identifies the invalid configuration category;
* no persistent Master Library mutation occurs.

---

## AC-SRV-003 — Graceful Shutdown

**Priority:** P1

Given a running server, when a normal termination signal is received, then:

* new mutable administrative operations stop;
* persistent repositories close safely;
* committed catalog state remains valid;
* the process exits within the configured shutdown timeout.

---

## AC-SRV-004 — Port Conflict

**Priority:** P1

Given the configured port is already in use, when the server starts, then:

* startup fails;
* the server does not report healthy;
* the error is observable;
* no secondary unexpected port is selected silently.

---

## AC-SRV-005 — Restart Recovery

**Priority:** P0

Given a valid Master Library with registered publications, when the server is stopped and restarted, then:

* the same MasterLibraryId is loaded;
* catalog entries remain available;
* SourceVersion values remain unchanged;
* acquisition requests continue to resolve correctly.

---

# 10. Health Criteria

## AC-SRV-006 — Healthy Response

**Priority:** P0

When server and Master Library are available, `/v1/health` shall return a structured response containing at least:

```json
{
  "status": "healthy",
  "serverVersion": "...",
  "masterLibrary": {
    "status": "available"
  }
}
```

The response shall not expose:

* raw NAS paths;
* credentials;
* secrets;
* personal state.

---

## AC-SRV-007 — Degraded Storage Response

**Priority:** P0

Given the server process is running but Master Library storage is unavailable, when `/v1/health` is requested, then:

* the response is not `healthy`;
* Master Library unavailability is explicit;
* catalog and acquisition operations do not return false success.

---

# 11. Master Library Initialization Criteria

## AC-LIB-001 — Initialize New Master Library

**Priority:** P0

**Related Use Case:** UC-S03

Given an authorized administrator and an empty writable target location, when initialization is requested, then:

* a stable MasterLibraryId is created;
* a versioned manifest is created;
* catalog persistence is initialized;
* source, staging and quarantine storage areas exist;
* the resulting Library passes structural validation;
* the Library can be reopened after restart.

---

## AC-LIB-002 — Prevent Silent Overwrite

**Priority:** P0

Given a valid Master Library already exists at the target location, when initialization is requested, then:

* initialization is rejected;
* the existing manifest is not replaced;
* the existing catalog is not reset;
* existing publication files remain unchanged.

---

## AC-LIB-003 — Reject Unknown Non-Empty Directory

**Priority:** P1

Given a target location contains unknown files but no valid Master Library, when initialization is requested, then:

* initialization does not proceed automatically;
* an explicit conflict error is returned;
* no existing file is deleted.

---

## AC-LIB-004 — Permission Failure

**Priority:** P0

Given the target location is not writable, when initialization is requested, then:

* initialization fails explicitly;
* no valid-looking partial Library is left behind;
* the permission error is translated into a stable module error.

---

## AC-LIB-005 — Stable Library Identity

**Priority:** P0

Given an initialized Master Library, when:

* the NAS hostname changes;
* the mount path changes;
* the server process restarts;

then MasterLibraryId remains unchanged.

---

# 12. Master Library Open and Validation Criteria

## AC-LIB-006 — Open Compatible Library

**Priority:** P0

**Related Use Case:** UC-S04

Given a compatible Master Library, when the server opens it, then:

* the manifest is validated;
* the catalog schema is validated;
* required storage areas are validated;
* the Library becomes available.

---

## AC-LIB-007 — Unsupported Format

**Priority:** P0

Given a Master Library format newer than the server supports, when the Library is opened, then:

* the Library is rejected safely;
* no migration is attempted silently;
* no persistent mutation occurs;
* a compatibility error is returned.

---

## AC-LIB-008 — Corrupt Manifest

**Priority:** P0

Given an unreadable or invalid manifest, when the Library is opened, then:

* the Library does not become available;
* the server reports an integrity error;
* catalog operations remain unavailable.

---

## AC-LIB-009 — Structural Validation

**Priority:** P1

Given a Master Library, when full structural validation executes, then the result reports:

* manifest status;
* catalog status;
* source-storage status;
* missing required directories;
* inaccessible storage;
* detected invalid references.

---

# 13. Publication Registration Criteria

## AC-ADM-001 — Register Valid PDF

**Priority:** P0

**Related Use Case:** UC-S06

Given an authorized administrator and a valid PDF, when registration completes, then:

* a stable PublicationId exists;
* SourceVersion 1 exists;
* byte length is recorded;
* checksum is recorded;
* source payload exists in committed storage;
* catalog entry exists;
* availability is `AVAILABLE`;
* CatalogRevision advances.

---

## AC-ADM-002 — No Availability Before Source Commit

**Priority:** P0

Given source commit fails during registration, then:

* no `AVAILABLE` catalog entry is exposed;
* no client can acquire the publication;
* partial staging data is cleaned or quarantined;
* the failure is observable.

---

## AC-ADM-003 — Invalid PDF Rejection

**Priority:** P0

Given a file does not satisfy the approved minimum PDF validation, when registration is attempted, then:

* registration fails;
* no PublicationId becomes available to clients;
* no committed source payload remains;
* a stable invalid-source error is returned.

---

## AC-ADM-004 — Duplicate Request Behavior

**Priority:** P1

Given the same source and metadata are submitted twice, the system shall not silently create uncontrolled duplicate catalog entries.

The implementation shall:

* detect a likely duplicate;
* or require explicit confirmation;
* or require explicit creation of a distinct PublicationId.

The selected behavior shall be documented and tested.

---

## AC-ADM-005 — Update Metadata

**Priority:** P1

**Related Use Case:** UC-S07

Given an existing publication, when valid master metadata is updated, then:

* PublicationId remains unchanged;
* current SourceVersion remains unchanged;
* CatalogRevision advances;
* updated metadata appears in subsequent catalog responses.

---

## AC-ADM-006 — Personal Metadata Rejection

**Priority:** P0

When an administrative request attempts to submit:

* reading progress;
* annotations;
* personal tags;
* favorites;
* personal relationships;

then the server rejects or ignores those fields according to explicit contract validation.

They shall not be persisted.

---

# 14. Source Replacement Criteria

## AC-ADM-007 — Create New Source Version

**Priority:** P1

**Related Use Case:** UC-S08

Given a publication with SourceVersion 1, when a valid replacement source is committed, then:

* PublicationId remains unchanged;
* a new SourceVersion is created;
* the new source becomes current only after successful commit;
* CatalogRevision advances;
* clients can detect the newer version.

---

## AC-ADM-008 — Preserve Previous Valid Source on Failure

**Priority:** P0

Given a valid current source, when replacement fails, then:

* the current SourceVersion remains active;
* the current source remains acquirable;
* no partial replacement becomes current;
* the failure is observable.

---

# 15. Availability and Withdrawal Criteria

## AC-ADM-009 — Mark Source Unavailable

**Priority:** P1

Given an existing publication, when it is marked `UNAVAILABLE`, then:

* the entry remains visible according to catalog policy;
* new acquisition is rejected;
* existing local copies remain unaffected;
* CatalogRevision advances.

---

## AC-ADM-010 — Withdraw Publication

**Priority:** P1

Given an existing publication, when it is marked `WITHDRAWN`, then:

* new acquisition is rejected;
* historical identity remains;
* existing local copies are not deleted;
* the client can display withdrawn state.

---

# 16. Catalog Listing Criteria

## AC-CAT-001 — List First Page

**Priority:** P0

**Related Use Case:** UC-S11

Given at least 20 catalog entries, when the first page is requested, then:

* no more than the configured page size is returned;
* paging metadata is returned;
* entries contain stable PublicationId;
* CatalogRevision is returned;
* no personal state is included.

---

## AC-CAT-002 — Stable Pagination

**Priority:** P1

Given a stable CatalogRevision, when pages are requested using the same ordering, then:

* entries are not duplicated unexpectedly;
* entries are not skipped unexpectedly;
* ordering remains deterministic.

---

## AC-CAT-003 — Invalid Pagination Rejection

**Priority:** P1

Given invalid page size, cursor or offset values, when listing is requested, then:

* the request is rejected with a structured validation error;
* the server does not execute an unbounded query.

---

## AC-CAT-004 — Empty Catalog

**Priority:** P1

Given an empty Master Catalog, when listing is requested, then:

* a valid empty response is returned;
* paging metadata remains valid;
* the response is not treated as a server failure.

---

# 17. Catalog Search Criteria

## AC-CAT-005 — Search by Title

**Priority:** P0

**Related Use Case:** UC-S12

Given catalog entries with different titles, when a title query is submitted, then only matching entries are returned according to the documented matching policy.

---

## AC-CAT-006 — Search by Author

**Priority:** P0

Given publications by multiple authors, when an author query is submitted, then matching publications are returned.

---

## AC-CAT-007 — Search Filters

**Priority:** P1

The implementation shall support approved filters for at least:

* language;
* publication type;
* source format.

---

## AC-CAT-008 — Search Query Bounds

**Priority:** P1

Given an excessively long or invalid search query, the server shall reject or normalize it according to documented limits.

No unbounded resource use shall occur.

---

## AC-CAT-009 — Full-Text Exclusion

**Priority:** P0

Search results shall be based only on approved catalog metadata.

The module shall not claim publication-content full-text search.

---

# 18. Publication Details Criteria

## AC-CAT-010 — Retrieve Existing Details

**Priority:** P0

**Related Use Case:** UC-S13

Given an existing PublicationId, when details are requested, then the response includes:

* PublicationId;
* title;
* authors;
* source format;
* source version;
* source size;
* availability;
* checksum or approved integrity metadata;
* cover availability.

---

## AC-CAT-011 — Unknown Publication

**Priority:** P0

Given an unknown PublicationId, when details are requested, then:

* a structured not-found error is returned;
* no internal persistence or filesystem information is exposed.

---

# 19. Cover Criteria

## AC-CAT-012 — Retrieve Existing Cover

**Priority:** P1

Given a publication with a valid cover, when the cover is requested, then:

* the correct media type is returned;
* content length is valid;
* the cover is streamed safely.

---

## AC-CAT-013 — Missing Cover

**Priority:** P1

Given a publication without a cover, then the server returns the documented missing-cover result and the client displays a placeholder.

---

# 20. Server Registration Criteria

## AC-CON-001 — Register Reachable Server

**Priority:** P0

**Related Use Case:** UC-C01

Given a valid server endpoint, when the user registers it, then:

* the client retrieves server identity;
* the user confirms trust;
* endpoint and trusted identity are stored;
* the server appears in the client server registry.

---

## AC-CON-002 — Reject Invalid Endpoint

**Priority:** P0

Given a malformed endpoint, when registration is attempted, then:

* the client rejects it before persistent registration;
* a clear validation error is shown.

---

## AC-CON-003 — Offline Registration

**Priority:** P2

If offline registration is supported, then the client shall clearly mark trust and authentication as pending.

The server shall not be treated as trusted until identity verification succeeds.

---

## AC-CON-004 — Server Identity Mismatch

**Priority:** P0

Given a previously trusted endpoint now presents a different server identity, then:

* connection is blocked;
* the mismatch is displayed explicitly;
* credentials are not sent automatically to the untrusted identity;
* the user must complete a governed trust decision.

---

# 21. Authentication and Authorization Criteria

## AC-AUTH-001 — Authenticate Registered Device

**Priority:** P0

**Related Use Case:** UC-C02

Given a registered device with valid credentials, when it connects, then an authenticated session or token is established.

---

## AC-AUTH-002 — Reject Invalid Credential

**Priority:** P0

Given invalid, expired or revoked credentials, when authentication is attempted, then:

* access is rejected;
* no catalog data is returned;
* the failure is logged without exposing the credential.

---

## AC-AUTH-003 — Reader Authorization

**Priority:** P0

A Reader shall be able to:

* browse;
* search;
* inspect;
* acquire.

A Reader shall not be able to:

* initialize the Master Library;
* register publications;
* replace source files;
* withdraw publications.

---

## AC-AUTH-004 — Administrator Authorization

**Priority:** P0

An Administrator shall be able to execute approved administrative operations after authentication and authorization.

---

## AC-AUTH-005 — Administrative Separation

**Priority:** P0

Administrative authorization shall not be inferred solely from successful Reader authentication.

---

# 22. Catalog Browser Criteria

## AC-CON-005 — Display Catalog

**Priority:** P0

**Related Use Case:** UC-C03

Given an authenticated connection, when the user opens the Master Catalog, then:

* catalog entries appear;
* loading state is visible;
* remote availability is represented;
* local availability is combined with catalog data;
* pagination or progressive loading works.

---

## AC-CON-006 — Distinguish Local State

**Priority:** P0

For every catalog entry, the client shall distinguish at least:

```text
Remote only
Downloading
Available locally
Update available
Unavailable
Withdrawn
```

---

## AC-CON-007 — Empty State

**Priority:** P1

Given an empty catalog, the client displays an explicit empty state rather than a generic failure.

---

## AC-CON-008 — Server Unavailable State

**Priority:** P0

Given the server becomes unavailable, the client shall:

* show disconnected state;
* stop presenting remote operations as available;
* retain local Library access;
* preserve valid cached catalog data.

---

# 23. Publication Detail Criteria

## AC-CON-009 — Display Publication Details

**Priority:** P0

**Related Use Case:** UC-C05

Given an existing publication, the detail screen shall display:

* master metadata;
* remote availability;
* source version;
* source size;
* local state;
* permitted action.

---

## AC-CON-010 — Truthful Action Availability

**Priority:** P0

The client shall not offer successful acquisition when:

* the server is offline;
* publication is unavailable;
* publication is withdrawn;
* authentication is invalid.

---

# 24. Acquisition Start Criteria

## AC-ACQ-001 — Start Available Publication Acquisition

**Priority:** P0

**Related Use Case:** UC-C06

Given an available publication, valid authentication and sufficient expected storage, when the user selects Acquire, then:

* an AcquisitionOperation is created;
* PublicationId and SourceVersion are fixed for the operation;
* state becomes `QUEUED` or `DOWNLOADING`;
* progress becomes observable.

---

## AC-ACQ-002 — Reject Unavailable Publication

**Priority:** P0

Given a publication is `UNAVAILABLE`, `WITHDRAWN` or `CORRUPTED`, acquisition shall not begin.

---

## AC-ACQ-003 — Duplicate Local Acquisition

**Priority:** P1

Given the exact SourceVersion is already valid locally, selecting Acquire shall not create an uncontrolled duplicate local copy.

The client shall report already available or require explicit reacquisition.

---

# 25. Acquisition Transfer Criteria

## AC-ACQ-004 — Bounded Streaming

**Priority:** P0

During acquisition of a publication larger than available application memory, the client and server shall transfer using bounded memory.

Evidence shall include memory measurement.

---

## AC-ACQ-005 — Progress Reporting

**Priority:** P0

During acquisition, the client shall display:

* current state;
* bytes received;
* total bytes when known;
* progress percentage when calculable;
* cancellation action.

---

## AC-ACQ-006 — Exact Source Version

**Priority:** P0

The source delivered shall match the SourceVersion fixed when the operation began.

If the current server version changes during acquisition, the existing operation shall not silently switch payload versions.

---

## AC-ACQ-007 — Byte-Length Validation

**Priority:** P0

After transfer, the client shall compare received byte length with expected source size.

A mismatch shall prevent installation.

---

## AC-ACQ-008 — Checksum Validation

**Priority:** P0

After transfer, the client shall calculate the approved checksum and compare it with the authoritative checksum.

A mismatch shall:

* prevent installation;
* mark the acquisition failed;
* preserve diagnostic evidence;
* avoid `AVAILABLE_LOCAL`.

---

# 26. Cancellation Criteria

## AC-ACQ-009 — Cancel Active Acquisition

**Priority:** P1

**Related Use Case:** UC-C07

Given an active acquisition, when cancellation is requested, then:

* transfer stops;
* state becomes `CANCELLED`;
* no publication becomes locally available;
* temporary data is cleaned or retained only according to documented resume policy.

---

## AC-ACQ-010 — Cancellation Idempotency

**Priority:** P1

Repeated cancellation requests shall not create invalid state or multiple cleanup operations.

---

# 27. Retry and Resume Criteria

## AC-ACQ-011 — Retry Failed Acquisition

**Priority:** P1

**Related Use Case:** UC-C08

Given a retryable failure, when Retry is selected, then:

* the logical AcquisitionOperation remains traceable;
* a new Attempt identity is created;
* current remote SourceVersion is revalidated;
* state transitions are valid.

---

## AC-ACQ-012 — Safe Resume

**Priority:** P2

If ranged resume is implemented, then:

* partial state is validated;
* the server confirms range support;
* SourceVersion remains identical;
* final full-file validation still occurs.

---

## AC-ACQ-013 — Safe Restart Without Resume

**Priority:** P0 when resume is not implemented

If ranged resume is not implemented, then interrupted acquisition shall:

* fail or pause truthfully;
* discard or safely quarantine partial data;
* restart from byte zero;
* never concatenate unverified payload fragments.

---

# 28. Atomic Installation Criteria

## AC-ACQ-014 — No Partial Visibility

**Priority:** P0

Before successful:

* transfer completion;
* byte-length validation;
* checksum validation;
* local commit;

the publication shall not appear as `AVAILABLE_LOCAL`.

---

## AC-ACQ-015 — Atomic or Recoverable Commit

**Priority:** P0

If installation fails during final commit, then:

* no invalid final item is exposed;
* the previous valid local version remains available when updating;
* recovery or cleanup is possible.

---

## AC-ACQ-016 — Persist Operation State

**Priority:** P0

Acquisition state shall survive client restart sufficiently to:

* report prior operation status;
* recover safely;
* restart or resume according to policy;
* avoid duplicate installation.

---

# 29. Selective Local Library Criteria

## AC-LOC-001 — List Acquired Publications

**Priority:** P0

**Related Use Case:** UC-C10

Given locally acquired publications, when the local Library is opened, then only publications with valid local membership appear as local items.

---

## AC-LOC-002 — Persist Across Restart

**Priority:** P0

Given a publication is locally available, after client restart:

* LocalLibraryItem remains;
* local SourceVersion remains;
* local file reference resolves;
* the publication remains available if the file is valid.

---

## AC-LOC-003 — Device-Specific Membership

**Priority:** P0

Acquiring a publication on one device shall not automatically mark it locally available on another device.

---

## AC-LOC-004 — Not a NAS Replica

**Priority:** P0

The client shall not automatically download all catalog entries or all publication payloads.

Test evidence shall show a catalog larger than the local Library.

---

## AC-LOC-005 — Internal Storage Reference

**Priority:** P1

Raw local storage paths shall not be exposed as ordinary user-facing catalog information or server contract fields.

---

# 30. Local Opening Criteria

## AC-LOC-006 — Open Local Placeholder

**Priority:** P0

**Related Use Case:** UC-C11

Given a valid local PDF, when the user opens it, then a minimal supported preview, system viewer or local placeholder confirms the payload is usable.

---

## AC-LOC-007 — Missing Payload Detection

**Priority:** P1

**Related Use Case:** UC-C17

Given LocalLibraryItem exists but the payload is missing, then:

* the item is not presented as safely available;
* local integrity becomes invalid or missing;
* reacquisition is offered when possible.

---

## AC-LOC-008 — Corrupt Payload Detection

**Priority:** P1

**Related Use Case:** UC-C18

Given a local payload checksum mismatch, then:

* the payload is not trusted;
* local integrity state becomes corrupted;
* the user can remove or reacquire it.

---

# 31. Local Removal Criteria

## AC-LOC-009 — Remove from Current Device

**Priority:** P0

**Related Use Case:** UC-C12

When the user removes a publication locally, then:

* the local payload is removed;
* local availability changes;
* the Master Catalog entry remains;
* the NAS source remains;
* no other device is modified.

---

## AC-LOC-010 — Preserve Personal State Boundary

**Priority:** P0

Local publication removal shall not implicitly delete personal state.

Personal-state deletion requires a separate future operation.

---

# 32. Offline Criteria

## AC-OFF-001 — Local Library Available Offline

**Priority:** P0

**Related Use Case:** UC-C15

Given the NAS is unavailable, when the user opens the local Library, then valid locally acquired publications remain listed.

---

## AC-OFF-002 — Local Publication Open Offline

**Priority:** P0

Given a valid local publication and no NAS connectivity, the publication placeholder or preview shall still open.

---

## AC-OFF-003 — Remote Operations Disabled Truthfully

**Priority:** P0

While offline:

* remote catalog refresh fails explicitly;
* acquisition does not report success;
* unavailable remote actions are disabled or return clear failure;
* local content remains unchanged.

---

## AC-OFF-004 — Cached Catalog Freshness

**Priority:** P1

If cached catalog data is displayed offline, then the client shall display or expose its last refresh time.

---

## AC-OFF-005 — No False Remote Deletion

**Priority:** P0

Temporary server unavailability shall not cause local or cached catalog entries to be deleted automatically.

---

## AC-OFF-006 — Reconnect

**Priority:** P1

**Related Use Case:** UC-C16

When connectivity returns, then:

* server identity is revalidated;
* authentication is re-established;
* CatalogRevision is checked;
* catalog refresh occurs as needed;
* local Library contents remain intact.

---

# 33. Update Detection Criteria

## AC-UPD-001 — Detect Newer Source Version

**Priority:** P1

**Related Use Case:** UC-C13

Given local SourceVersion 1 and remote SourceVersion 2, after refresh the client shall mark the publication `UPDATE_AVAILABLE`.

---

## AC-UPD-002 — Preserve Existing Version During Update

**Priority:** P0

Given a valid local publication, when an update acquisition starts, then the current valid local source remains usable until the new source passes validation and commit.

---

## AC-UPD-003 — Failed Update

**Priority:** P0

If update acquisition fails, then:

* the previous local version remains available;
* LocalLibraryItem does not falsely report the newer version;
* failure is observable.

---

# 34. Integrity Criteria

## AC-INT-001 — Publication Identity Independence

**Priority:** P0

Changing a source file name or NAS storage path shall not change PublicationId.

---

## AC-INT-002 — Source Version Integrity

**Priority:** P0

Changing authoritative source bytes shall require a distinct SourceVersion.

Changing only approved metadata shall not require a new SourceVersion.

---

## AC-INT-003 — Catalog-Source Consistency

**Priority:** P0

Every `AVAILABLE` catalog entry shall resolve to:

* an existing committed source payload;
* matching byte length;
* matching checksum;
* valid SourceVersion.

---

## AC-INT-004 — Local Item Consistency

**Priority:** P0

Every `AVAILABLE_LOCAL` item shall resolve to:

* an existing local payload;
* matching PublicationId;
* matching SourceVersion;
* matching byte length;
* matching checksum.

---

## AC-INT-005 — Staging Isolation

**Priority:** P0

Files in staging shall never be returned by publication content endpoints or displayed as local available publications.

---

# 35. Security Criteria

## AC-SEC-001 — Path Traversal Rejection

**Priority:** P0

Requests containing path traversal sequences or arbitrary filesystem references shall not allow access outside governed publication storage.

---

## AC-SEC-002 — No Raw NAS Paths

**Priority:** P0

No Reader API response shall expose:

* absolute NAS path;
* mount path;
* server filesystem layout;
* storage credentials.

---

## AC-SEC-003 — Input Validation

**Priority:** P0

Invalid identifiers, metadata, page sizes, ranges and content lengths shall be rejected before unsafe processing.

---

## AC-SEC-004 — Range Validation

**Priority:** P1

Invalid, overlapping or unsatisfiable range requests shall return the documented range error without reading arbitrary data.

---

## AC-SEC-005 — Secret Protection

**Priority:** P0

Credentials and secrets shall not appear in:

* source control;
* logs;
* error responses;
* client-visible diagnostics.

---

## AC-SEC-006 — Administrative Audit

**Priority:** P1

Administrative mutations shall produce audit evidence containing:

* operation type;
* timestamp;
* administrator identity;
* affected PublicationId or Library;
* result.

The evidence shall not contain secret values.

---

## AC-SEC-007 — Dependency Review

**Priority:** P1

Before module completion, runtime dependencies shall be reviewed for known critical vulnerabilities and acceptable licensing.

---

# 36. Privacy Criteria

## AC-PRV-001 — No Personal-State API Fields

**Priority:** P0

Server contracts shall contain no fields for:

* annotation content;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes;
* CloudKit synchronization state.

---

## AC-PRV-002 — No Personal State Persistence on NAS

**Priority:** P0

Test inspection of server persistence shall confirm that personal state is not stored in:

* catalog database;
* source metadata;
* audit records;
* server configuration;
* server logs.

---

## AC-PRV-003 — Telemetry Minimization

**Priority:** P1

Logs and metrics shall not record reading content, annotation content or personal knowledge relationships.

---

# 37. Performance Criteria

Concrete final targets shall be fixed in Technical Design.

The following criteria establish mandatory measurement.

## AC-PERF-001 — Server Startup Measurement

**Priority:** P1

Server startup time shall be measured from process start to truthful health readiness.

---

## AC-PERF-002 — Catalog Page Latency

**Priority:** P1

Catalog listing latency shall be measured using the approved acceptance dataset.

---

## AC-PERF-003 — Publication Detail Latency

**Priority:** P1

Publication detail latency shall be measured for cached and uncached query conditions where applicable.

---

## AC-PERF-004 — Time to First Byte

**Priority:** P1

Acquisition time to first byte shall be measured over the reference local network.

---

## AC-PERF-005 — Transfer Throughput

**Priority:** P1

Sustained transfer throughput shall be measured for:

* small publication;
* medium publication;
* large publication.

---

## AC-PERF-006 — Bounded Client Memory

**Priority:** P0

Client memory usage during large-file acquisition shall remain bounded and shall not scale linearly with complete payload size.

---

## AC-PERF-007 — Bounded Server Memory

**Priority:** P0

Server memory usage during large-file delivery shall remain bounded and shall not require whole-file buffering.

---

# 38. Observability Criteria

## AC-OBS-001 — Correlation Identity

**Priority:** P1

Acquisition logs shall include an AcquisitionOperationId or equivalent correlation identity.

---

## AC-OBS-002 — Registration Diagnostics

**Priority:** P1

Publication registration failures shall be diagnosable from structured server logs without exposing raw secrets.

---

## AC-OBS-003 — Integrity Failure Diagnostics

**Priority:** P0

Checksum and missing-file failures shall emit structured diagnostic evidence.

---

## AC-OBS-004 — Authorization Failure Evidence

**Priority:** P1

Authorization failures shall be logged with actor and operation category, excluding credentials.

---

## AC-OBS-005 — Client Failure Evidence

**Priority:** P1

The client shall retain or expose sufficient diagnostics for:

* connection failure;
* acquisition failure;
* installation failure;
* local integrity failure.

---

# 39. Operations Criteria

## AC-OPS-001 — Repeatable NAS Deployment

**Priority:** P0

**Related Use Case:** UC-O04

KnowledgeOS Server shall be deployable repeatedly on the reference NAS using documented steps.

---

## AC-OPS-002 — Persistent Storage Mapping

**Priority:** P0

Restarting or replacing the server deployment artifact shall not delete Master Library persistent data.

---

## AC-OPS-003 — Configuration Validation

**Priority:** P0

Invalid environment or configuration values shall fail explicitly before serving catalog operations.

---

## AC-OPS-004 — Backup Execution

**Priority:** P1

**Related Use Case:** UC-O02

A complete backup shall include:

* manifest;
* catalog persistence;
* source publications;
* source metadata;
* source versions.

Backup completion shall produce integrity evidence.

---

## AC-OPS-005 — Restore Execution

**Priority:** P1

**Related Use Case:** UC-O03

A restored Master Library shall:

* open successfully;
* preserve MasterLibraryId;
* preserve PublicationId values;
* preserve SourceVersion values;
* pass catalog-source validation;
* serve acquisition successfully.

---

## AC-OPS-006 — Upgrade

**Priority:** P1

A documented compatible server upgrade shall preserve persistent Library behavior and execute required migrations safely.

---

## AC-OPS-007 — Rollback

**Priority:** P1

A failed upgrade shall have a documented rollback path restoring a previously healthy state.

---

# 40. End-to-End Acceptance Criteria

## AC-E2E-001 — Complete Primary Vertical

**Priority:** P0

Using production-equivalent components:

1. initialize a Master Library;
2. register a valid PDF;
3. start KnowledgeOS Server;
4. register and authenticate the macOS client;
5. browse the Master Catalog;
6. open publication details;
7. acquire the publication;
8. validate checksum;
9. install into the Selective Local Library;
10. open the local publication placeholder;
11. disconnect the NAS;
12. reopen the local Library;
13. confirm the publication remains available.

Every step shall pass.

---

## AC-E2E-002 — Interrupted Transfer

**Priority:** P0

During acquisition, interrupt the network.

The result shall be:

* no false local availability;
* truthful acquisition state;
* safe retry or resume;
* no corrupt committed local payload.

---

## AC-E2E-003 — Corrupted Download

**Priority:** P0

Given transferred bytes do not match authoritative checksum, then:

* installation fails;
* local availability remains false;
* diagnostics are generated;
* cleanup or quarantine follows policy.

---

## AC-E2E-004 — Source Update

**Priority:** P1

Given an acquired SourceVersion 1 and a registered SourceVersion 2:

* client detects update;
* current local version remains usable;
* update acquisition succeeds;
* LocalLibraryItem becomes SourceVersion 2;
* checksum matches the new authoritative source.

---

## AC-E2E-005 — Local Removal Isolation

**Priority:** P0

After local removal:

* the publication disappears from the device local Library;
* it remains visible in Master Catalog;
* it remains acquirable from NAS;
* no other device or NAS source is deleted.

---

# 41. Acceptance Dataset

The minimum acceptance catalog shall contain:

```text
At least 20 publications
At least 5 distinct authors
At least 4 subjects
At least 2 languages
At least 1 unavailable publication
At least 1 withdrawn publication
At least 1 source update
At least 1 publication without cover
```

---

# 42. Acceptance File Sizes

Technical Design shall define exact thresholds.

The validation dataset shall contain:

```text
Small PDF
Medium PDF
Large PDF
```

The large PDF shall be sufficiently larger than the permitted in-memory transfer buffer to prove streaming behavior.

---

# 43. Client Platform Acceptance

The minimum module-completion client is:

```text
macOS
```

The module shall not claim iPhone or iPad completion unless equivalent criteria are executed on those clients.

Shared contracts shall remain compatible with future Apple clients.

---

# 44. Documentation Criteria

## AC-DOC-001 — Requirements Traceability

**Priority:** P0

Every P0 acceptance criterion shall reference:

* requirement area;
* related use case;
* test or validation evidence.

---

## AC-DOC-002 — Actual API Documentation

**Priority:** P0

API documentation shall match implemented:

* paths;
* methods;
* requests;
* responses;
* errors;
* authentication;
* streaming behavior.

---

## AC-DOC-003 — Actual Persistence Documentation

**Priority:** P0

Persistence documentation shall match implemented schemas, migrations and storage layout.

---

## AC-DOC-004 — Actual Deployment Documentation

**Priority:** P0

Deployment instructions shall be executable on the reference NAS without relying on undocumented local knowledge.

---

## AC-DOC-005 — Known Limitations

**Priority:** P1

All accepted limitations and non-critical debt shall be recorded before module closure.

---

# 45. Completion Gate

The Requirements area is complete when:

```text
[ ] Scope.md is Approved
[ ] UseCases.md is Approved
[ ] AcceptanceCriteria.md is Approved
[ ] Every P0 use case has acceptance criteria
[ ] Every P0 integrity behavior is testable
[ ] Every P0 security behavior is testable
[ ] Every P0 privacy behavior is testable
[ ] Offline behavior is testable
[ ] NAS deployment is testable
[ ] Primary E2E flow is explicit
[ ] No architectural contradiction remains
```

---

# 46. Module Completion Gate

The Master Library Module cannot be completed until:

```text
[ ] Every P0 criterion has Passed
[ ] Every P1 criterion has Passed or has an approved non-critical limitation
[ ] AC-E2E-001 has Passed
[ ] AC-E2E-002 has Passed
[ ] AC-E2E-003 has Passed
[ ] AC-E2E-005 has Passed
[ ] AC-PRV-001 has Passed
[ ] AC-PRV-002 has Passed
[ ] AC-LOC-004 has Passed
[ ] AC-OFF-001 has Passed
[ ] AC-OFF-002 has Passed
[ ] AC-OPS-001 has Passed
[ ] Validation evidence is recorded
```

---

# 47. Acceptance Invariants

The following invariants apply:

* Acceptance is evidence-based.
* Successful download is not successful acquisition until validation and installation complete.
* Partial files are never locally available publications.
* Publication identity remains independent from path.
* Device Libraries remain selective.
* Device Libraries are not NAS replicas.
* Personal state never enters NAS contracts or persistence.
* Local publication availability survives NAS disconnection.
* Local removal does not mutate NAS content.
* The primary end-to-end flow uses real components.
* No P0 criterion is deferrable.

---

# 48. Prohibited Acceptance Claims

The module shall never claim acceptance because:

* the endpoint exists;
* a mock client works;
* a download reaches 100%;
* a file exists in a temporary directory;
* unit tests pass without integration tests;
* the flow works only while NAS remains connected;
* one developer executed the flow once without evidence;
* security and privacy were not tested;
* deployment works only on the development Mac;
* documentation describes behavior not implemented.

---

# 49. Related Documents

## Requirements

* `README.md`
* `Scope.md`
* `UseCases.md`

## Module

* `../README.md`
* `../ImplementationCharter.md`

## Testing

* `../08-Testing/TestStrategy.md`
* `../08-Testing/EndToEndTests.md`

## Completion

* `../10-Completion/DefinitionOfDone.md`
* `../10-Completion/ValidationReport.md`

## Governance

* `../../00-Governance/DefinitionOfDone.md`
* `../../00-Governance/ModuleDevelopmentLifecycle.md`

---

# 50. Status

**Approved**

The Master Library requirements baseline is now complete.

Every mandatory behavior is expressed as a measurable acceptance condition.

The next implementation phase is Technical Design, beginning with:

```text
01-MasterLibrary/02-TechnicalDesign/README.md
```
