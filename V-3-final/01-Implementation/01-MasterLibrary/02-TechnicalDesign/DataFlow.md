
# Master Library Data Flow

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Technical Design

**Document:** Data Flow

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Requirements Baseline:** Master Library Requirements v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the principal data flows of the Master Library Module.

It specifies:

* participating components;
* sequence of operations;
* input and output data;
* state transitions;
* transaction boundaries;
* persistence boundaries;
* filesystem boundaries;
* failure points;
* recovery behavior;
* observability requirements.

The purpose is to make every full-stack workflow explicit before implementation begins.

---

# 2. Scope

This document covers:

* server startup;
* Master Library initialization;
* Master Library open;
* publication registration;
* metadata update;
* source replacement;
* catalog listing;
* catalog search;
* publication details;
* publication content delivery;
* server registration;
* authentication;
* catalog browsing;
* publication acquisition;
* cancellation;
* retry;
* optional resume;
* local installation;
* source update;
* local removal;
* offline operation;
* reconnect;
* startup recovery;
* integrity reconciliation.

It does not cover:

* annotations;
* reading progress;
* personal-state synchronization;
* CloudKit;
* UDM;
* DPM;
* AI;
* Plugins.

---

# 3. Governing Principles

All data flows shall preserve:

1. the NAS Master Library as authority for the Master Catalog and source publications;
2. device-local authority for Selective Local Library membership;
3. complete separation between publication acquisition and personal-state synchronization;
4. stable identity independent from physical path;
5. staging before committed availability;
6. bounded memory for large payloads;
7. explicit transaction and recovery boundaries;
8. no personal state sent to the NAS;
9. truthful state reporting;
10. no partial payload exposed as complete.

---

# 4. Data Flow Notation

This document uses the following conventions:

```text
Component
    ↓
Operation
    ↓
Next Component
```

State transitions use:

```text
STATE_A → STATE_B
```

Persistence boundaries are identified as:

```text
[DB COMMIT]
[FILESYSTEM COMMIT]
[SECURE STORAGE COMMIT]
```

Failure boundaries are identified as:

```text
[FAILURE POINT]
```

---

# 5. Primary Components

## 5.1 Server Components

```text
Server Bootstrap
Configuration
Health
Transport
Authentication
Authorization
Master Library Service
Catalog Service
Publication Administration
Publication Delivery
Catalog Repository
Manifest Storage
Publication Storage
Staging Storage
Quarantine Storage
Recovery
Observability
```

## 5.2 Client Components

```text
App Bootstrap
Server Registry
Server Trust Service
Authentication Client
Connectivity Monitor
Catalog Feature
Catalog Cache
Publication Details
Acquisition Manager
Acquisition Repository
Download Transport
Checksum Validator
Local Publication Installer
Local Library Repository
Local Publication Storage
Diagnostics
```

---

# 6. Server Startup Flow

## 6.1 Objective

Start KnowledgeOS Server and expose truthful health state.

## 6.2 Flow

```text
Operating System / Container Runtime
    ↓
Start server process
    ↓
Server Bootstrap
    ↓
Load configuration
    ↓
Validate configuration
    ↓
Initialize structured logging
    ↓
Open database
    ↓
Read database schema version
    ↓
Run required migrations
    ↓
Open configured Master Library
    ↓
Validate manifest
    ↓
Validate required storage areas
    ↓
Run startup recovery
    ↓
Initialize authentication and authorization
    ↓
Start network listener
    ↓
Publish health state
```

## 6.3 Successful Result

```text
ServerState = HEALTHY
MasterLibraryState = AVAILABLE
CatalogState = AVAILABLE
```

## 6.4 Degraded Result

If the server process can run but the Master Library cannot be opened:

```text
ServerState = DEGRADED or UNHEALTHY
MasterLibraryState = UNAVAILABLE
Catalog operations = REJECTED
Acquisition operations = REJECTED
```

## 6.5 Failure Points

* invalid configuration;
* database migration failure;
* manifest missing;
* manifest incompatible;
* storage permission failure;
* catalog database unavailable;
* startup recovery failure;
* network port conflict.

## 6.6 Persistence Effects

No authoritative content mutation shall occur before:

* configuration validation;
* schema compatibility;
* Master Library identity validation.

---

# 7. Server Shutdown Flow

## 7.1 Flow

```text
Termination signal
    ↓
Server Bootstrap
    ↓
Set server state SHUTTING_DOWN
    ↓
Reject new mutable operations
    ↓
Stop accepting new transfers
    ↓
Allow bounded completion or cancellation
    ↓
Persist operation evidence
    ↓
Close database
    ↓
Flush logs and metrics
    ↓
Stop network listener
    ↓
Exit process
```

## 7.2 Invariant

Shutdown shall not expose incomplete publication registration or source replacement as completed.

---

# 8. Master Library Initialization Flow

## 8.1 Trigger

Authorized administrator requests initialization.

## 8.2 Flow

```text
Administrator
    ↓
Administrative API or CLI
    ↓
Authenticate
    ↓
Authorize Administrator
    ↓
Validate initialization request
    ↓
Acquire initialization lock
    ↓
Inspect target location
    ↓
Reject existing valid Master Library
    ↓
Reject unknown non-empty directory
    ↓
Generate MasterLibraryId
    ↓
Create temporary initialization root
    ↓
Create manifest draft
    ↓
Initialize catalog database
    ↓
Create publications directory
    ↓
Create covers directory
    ↓
Create staging directory
    ↓
Create quarantine directory
    ↓
Write format and schema versions
    ↓
Validate generated structure
    ↓
Commit initialization root
    ↓
Return Master Library information
```

## 8.3 Commit Boundary

```text
Temporary initialization structure
    ↓
Validation succeeds
    ↓
[FILESYSTEM COMMIT]
    ↓
Master Library becomes valid
```

## 8.4 Failure Before Commit

The temporary structure shall be removed or quarantined.

## 8.5 Failure After Partial Commit

Startup recovery shall detect incomplete initialization and require repair or rollback.

## 8.6 Invariants

* initialization never overwrites an existing valid Library;
* MasterLibraryId is generated once;
* identity does not depend on target path;
* incomplete initialization never reports healthy.

---

# 9. Master Library Open Flow

```text
Server Bootstrap
    ↓
Resolve configured Master Library root
    ↓
Read manifest
    ↓
Parse manifest
    ↓
Validate MasterLibraryId
    ↓
Validate format version
    ↓
Validate catalog schema version
    ↓
Open catalog database
    ↓
Validate required directories
    ↓
Validate source-storage access
    ↓
Run referential checks
    ↓
Set Master Library state
```

Possible results:

```text
AVAILABLE
DEGRADED
INVALID
UNSUPPORTED
UNAVAILABLE
```

---

# 10. Publication Registration Flow

## 10.1 Trigger

Administrator submits source PDF and master metadata.

## 10.2 Initial State

```text
RegistrationOperation = CREATED
```

## 10.3 Main Flow

```text
Administrator
    ↓
Administrative Transport
    ↓
Authenticate and authorize
    ↓
Validate metadata request
    ↓
Create RegistrationOperation
    ↓
Create server staging destination
    ↓
Stream source into staging
    ↓
Persist staging operation state
    ↓
Detect source format
    ↓
Validate PDF baseline
    ↓
Calculate byte length
    ↓
Calculate checksum
    ↓
Resolve duplicate policy
    ↓
Generate PublicationId
    ↓
Create SourceVersion 1
    ↓
Create source metadata
    ↓
Resolve final logical storage reference
    ↓
Commit source payload
    ↓
Create catalog transaction
    ↓
Insert publication
    ↓
Insert source version
    ↓
Set availability AVAILABLE
    ↓
Advance CatalogRevision
    ↓
Commit transaction
    ↓
Mark operation COMPLETED
    ↓
Clean staging
    ↓
Return publication result
```

---

# 11. Publication Registration State Transitions

```text
CREATED
    ↓
STAGING
    ↓
VALIDATING
    ↓
SOURCE_READY
    ↓
SOURCE_COMMITTED
    ↓
CATALOG_COMMITTING
    ↓
COMPLETED
```

Failure states:

```text
FAILED
RECOVERY_REQUIRED
QUARANTINED
```

---

# 12. Publication Registration Commit Boundaries

## 12.1 Filesystem Commit

```text
Validated staging file
    ↓
Move to final source location
    ↓
[FILESYSTEM COMMIT]
```

## 12.2 Database Commit

```text
Publication row
SourceVersion row
Availability
CatalogRevision
    ↓
[DB COMMIT]
```

## 12.3 Required Ordering

The baseline order is:

```text
Source payload commit
    ↓
Catalog transaction commit
```

The catalog shall not reference an uncommitted source.

---

# 13. Registration Failure Matrix

## 13.1 Failure During Staging

Result:

* operation `FAILED`;
* staging cleaned or quarantined;
* no PublicationId exposed;
* no catalog mutation.

## 13.2 Failure During Validation

Result:

* source rejected;
* no committed source;
* no available catalog entry.

## 13.3 Failure During Source Commit

Result:

* no catalog transaction;
* partial final target removed or quarantined;
* operation failed.

## 13.4 Failure During Catalog Commit

Result:

* committed source may exist without catalog entry;
* source remains invisible;
* operation becomes `RECOVERY_REQUIRED`;
* orphan reconciliation handles cleanup or completion.

---

# 14. Metadata Update Flow

```text
Administrator
    ↓
PATCH publication metadata
    ↓
Authenticate and authorize
    ↓
Load current catalog entry
    ↓
Validate allowed fields
    ↓
Reject personal-state fields
    ↓
Apply metadata changes
    ↓
Advance CatalogRevision
    ↓
[DB COMMIT]
    ↓
Return updated catalog entry
```

Invariants:

* PublicationId unchanged;
* SourceVersion unchanged;
* source bytes unchanged.

---

# 15. Source Replacement Flow

## 15.1 Main Flow

```text
Administrator
    ↓
Submit replacement source
    ↓
Authenticate and authorize
    ↓
Load existing publication
    ↓
Create replacement operation
    ↓
Stream source to staging
    ↓
Validate source
    ↓
Calculate byte length
    ↓
Calculate checksum
    ↓
Create next SourceVersion
    ↓
Commit new source payload
    ↓
Begin catalog transaction
    ↓
Insert new source version
    ↓
Set new source as current
    ↓
Advance CatalogRevision
    ↓
[DB COMMIT]
    ↓
Mark operation completed
```

## 15.2 Preservation Rule

The current valid source remains authoritative until the replacement catalog transaction commits.

## 15.3 Failure Rule

If any step fails before the database commit:

* current source remains active;
* new source remains hidden;
* no update is exposed to clients.

---

# 16. Mark Publication Unavailable Flow

```text
Administrator or Integrity Process
    ↓
Load publication
    ↓
Validate transition
    ↓
Set availability reason
    ↓
Set availability UNAVAILABLE or CORRUPTED
    ↓
Advance CatalogRevision
    ↓
[DB COMMIT]
    ↓
Reject future acquisition
```

Existing local device copies remain unchanged.

---

# 17. Withdraw Publication Flow

```text
Administrator
    ↓
Authenticate and authorize
    ↓
Load publication
    ↓
Validate withdrawal
    ↓
Set availability WITHDRAWN
    ↓
Record reason
    ↓
Advance CatalogRevision
    ↓
[DB COMMIT]
```

No remote deletion of device-local content occurs.

---

# 18. Catalog List Flow

```text
Client Catalog Feature
    ↓
Catalog API Client
    ↓
GET /v1/catalog
    ↓
Server Transport
    ↓
Authenticate Reader
    ↓
Validate pagination and sorting
    ↓
ListCatalog use case
    ↓
Catalog Repository
    ↓
Query bounded page
    ↓
Return entries and CatalogRevision
    ↓
Client validates response
    ↓
Persist catalog snapshot page
    ↓
Merge with local Library state
    ↓
Render catalog
```

---

# 19. Catalog Search Flow

```text
User enters search
    ↓
Catalog Feature
    ↓
Validate local search input
    ↓
Debounce or submit
    ↓
GET /v1/catalog?query=...
    ↓
Server validates search bounds
    ↓
Search approved metadata fields
    ↓
Apply deterministic ordering
    ↓
Apply bounded pagination
    ↓
Return results and CatalogRevision
    ↓
Client merges local state
    ↓
Render results
```

Full-text source content is not inspected.

---

# 20. Publication Details Flow

```text
User selects catalog entry
    ↓
Publication Details Feature
    ↓
Load cached catalog projection
    ↓
Display immediate safe snapshot
    ↓
Request current publication details
    ↓
Server authenticates
    ↓
Load MasterCatalogEntry
    ↓
Load current SourceVersion
    ↓
Load availability
    ↓
Return detail response
    ↓
Client loads LocalLibraryItem
    ↓
Compare local and remote SourceVersion
    ↓
Derive available actions
    ↓
Render detail state
```

---

# 21. Server Registration Flow

## 21.1 Main Flow

```text
User
    ↓
Enter server endpoint
    ↓
Client validates endpoint syntax
    ↓
Request server identity
    ↓
Server returns identity and capabilities
    ↓
Client displays trust information
    ↓
User confirms trust
    ↓
Persist RegisteredServer
    ↓
Store trusted identity metadata
    ↓
Begin device registration or authentication
```

## 21.2 Persistence Boundaries

```text
Registered server metadata
    ↓
[CLIENT DB COMMIT]

Credential or token
    ↓
[SECURE STORAGE COMMIT]
```

---

# 22. Server Identity Mismatch Flow

```text
Client connects to registered endpoint
    ↓
Retrieve presented server identity
    ↓
Compare with trusted identity
    ↓
Mismatch
    ↓
Set trust state IDENTITY_MISMATCH
    ↓
Block credential transmission
    ↓
Display warning
    ↓
Require explicit trust resolution
```

No automatic identity replacement is allowed.

---

# 23. Client Authentication Flow

```text
Trusted server connection
    ↓
Retrieve secure credential
    ↓
Send authentication request
    ↓
Server verifies device identity
    ↓
Server verifies credential
    ↓
Server loads role assignments
    ↓
Return bounded session or token
    ↓
Client stores session state
    ↓
Set authentication AUTHENTICATED
```

Failure results:

```text
EXPIRED
REVOKED
FAILED
```

---

# 24. Catalog Snapshot Refresh Flow

```text
Client connected and authenticated
    ↓
Request server health
    ↓
Request MasterLibraryId
    ↓
Compare with cached MasterLibraryId
    ↓
Request CatalogRevision
    ↓
Compare remote revision with local revision
```

If equal:

```text
Retain current snapshot
```

If different:

```text
Refresh catalog pages
    ↓
Validate response identity
    ↓
Replace snapshot transactionally
    ↓
[CLIENT DB COMMIT]
```

---

# 25. Publication Acquisition Flow

## 25.1 Trigger

User selects Acquire.

## 25.2 Initial Validation

```text
Publication Detail Feature
    ↓
Verify remote availability AVAILABLE
    ↓
Verify trusted server
    ↓
Verify authenticated client
    ↓
Check existing local SourceVersion
    ↓
Check active duplicate operation
    ↓
Estimate local storage
```

## 25.3 Operation Creation

```text
Create AcquisitionOperation
    ↓
Fix PublicationId
    ↓
Fix requested SourceVersion
    ↓
Set state CREATED
    ↓
Persist operation
    ↓
[CLIENT DB COMMIT]
```

## 25.4 Queue

```text
CREATED → QUEUED
    ↓
Persist queue state
```

## 25.5 Download Start

```text
Acquisition Manager
    ↓
Create AcquisitionAttempt
    ↓
Persist Attempt
    ↓
Create staging destination
    ↓
Build authenticated content request
    ↓
Request exact SourceVersion
    ↓
Validate response status
    ↓
Validate server identity context
    ↓
Validate content metadata
    ↓
Set state DOWNLOADING
```

## 25.6 Streaming

```text
Server opens committed source
    ↓
Server streams bounded chunks
    ↓
Client writes bounded chunks to staging file
    ↓
Client updates in-memory progress
    ↓
Client persists progress periodically
```

## 25.7 Transfer Completion

```text
HTTP body completes
    ↓
Close staging stream
    ↓
Persist final received byte count
    ↓
DOWNLOADING → VALIDATING
```

## 25.8 Validation

```text
Compare received byte length
    ↓
Calculate local checksum from staging file
    ↓
Compare authoritative checksum
```

If valid:

```text
VALIDATING → INSTALLING
```

If invalid:

```text
VALIDATING → FAILED
```

## 25.9 Installation

```text
Resolve final local logical storage reference
    ↓
Prepare destination
    ↓
Commit staging payload to final storage
    ↓
[FILESYSTEM COMMIT]
    ↓
Create or update LocalLibraryItem
    ↓
Persist source version and checksum
    ↓
[CLIENT DB COMMIT]
    ↓
Verify final file
    ↓
INSTALLING → COMPLETED
    ↓
Clean staging and temporary markers
```

---

# 26. Acquisition Completion Invariant

The acquisition is successful only when:

```text
OperationState = COMPLETED
AND
LocalLibraryItem exists
AND
Final local payload exists
AND
SourceVersion matches
AND
Byte length matches
AND
Checksum matches
```

---

# 27. Acquisition Failure Flow

## 27.1 Generic Failure

```text
Failure detected
    ↓
Classify error
    ↓
Stop transfer or installation
    ↓
Persist Attempt outcome
    ↓
Persist AcquisitionOperation failure
    ↓
Set state FAILED or RECOVERY_REQUIRED
    ↓
Preserve safe diagnostics
    ↓
Clean or quarantine temporary payload
    ↓
Present user-facing state
```

## 27.2 Invariant

Failure never creates `AVAILABLE_LOCAL`.

---

# 28. Acquisition Cancellation Flow

```text
User selects Cancel
    ↓
Acquisition Manager receives cancellation
    ↓
Mark cancellation requested
    ↓
Cancel network task
    ↓
Close staging stream
    ↓
Persist Attempt cancelled
    ↓
Set AcquisitionOperation CANCELLED
    ↓
Clean or retain staging according to resume policy
    ↓
Update UI
```

Repeated cancellation shall be idempotent.

---

# 29. Acquisition Retry Flow

```text
User selects Retry
    ↓
Load failed AcquisitionOperation
    ↓
Classify failure as retryable
    ↓
Revalidate server identity
    ↓
Reauthenticate
    ↓
Request current source metadata
    ↓
Verify requested SourceVersion policy
    ↓
Create new AcquisitionAttempt
    ↓
Restart or resume transfer
```

The logical operation remains traceable.

The Attempt identity is new.

---

# 30. Optional Resume Flow

This flow applies only if ranged resume is accepted.

```text
Load paused or failed operation
    ↓
Locate staging file
    ↓
Validate partial file size
    ↓
Validate checkpoint metadata
    ↓
Verify server range support
    ↓
Verify identical SourceVersion
    ↓
Request remaining byte range
    ↓
Append safely
    ↓
Validate complete final length
    ↓
Validate full checksum
    ↓
Install normally
```

If any resume precondition fails:

```text
Discard or quarantine partial payload
    ↓
Restart from byte zero
```

---

# 31. Client Restart During Download

```text
Client process terminates unexpectedly
    ↓
Operation state remains persisted
    ↓
Staging file remains
    ↓
No LocalLibraryItem is marked completed
```

On next startup:

```text
Load incomplete operations
    ↓
Inspect staging files
    ↓
Determine resume, restart or failure
    ↓
Persist recovery result
```

---

# 32. Client Restart During Installation

Possible partial state:

```text
Final payload exists
LocalLibraryItem absent
Operation = INSTALLING
```

Recovery flow:

```text
Inspect operation metadata
    ↓
Inspect final payload
    ↓
Validate byte length and checksum
```

If valid:

```text
Commit LocalLibraryItem
    ↓
Mark COMPLETED
```

If invalid:

```text
Remove or quarantine final payload
    ↓
Mark RECOVERY_REQUIRED or FAILED
```

---

# 33. New Local Installation Flow

```text
Validated staging payload
    ↓
Resolve device-local destination
    ↓
Ensure destination does not conflict
    ↓
Create installation marker
    ↓
Move payload into final location
    ↓
Persist LocalLibraryItem
    ↓
Remove installation marker
```

---

# 34. Source Update Detection Flow

```text
Catalog refresh
    ↓
Load remote SourceVersion
    ↓
Load LocalLibraryItem SourceVersion
    ↓
Compare versions
```

If remote newer:

```text
Catalog projection = UPDATE_AVAILABLE
```

The current local payload remains available.

---

# 35. Source Update Acquisition Flow

```text
User selects Update
    ↓
Create update AcquisitionOperation
    ↓
Acquire new SourceVersion into separate staging
    ↓
Validate new payload
    ↓
Install into separate final version location
    ↓
Persist LocalLibraryItem with new SourceVersion
    ↓
[CLIENT DB COMMIT]
    ↓
Remove previous payload according to retention policy
```

---

# 36. Failed Update Flow

If download, validation or installation fails:

```text
Previous LocalLibraryItem remains unchanged
Previous payload remains available
Update operation becomes FAILED
Remote projection remains UPDATE_AVAILABLE
```

---

# 37. Local Library Listing Flow

```text
User opens Local Library
    ↓
Local Library Feature
    ↓
Query LocalLibraryRepository
    ↓
Load LocalLibraryItems
    ↓
Map integrity and availability state
    ↓
Render local-only collection
```

No server request is required.

---

# 38. Open Local Publication Flow

```text
User selects local publication
    ↓
Load LocalLibraryItem
    ↓
Resolve logical local storage reference
    ↓
Verify file presence
    ↓
Optionally verify integrity
    ↓
Open system preview or local placeholder
```

Failure:

```text
Missing file → MISSING
Checksum mismatch → CORRUPTED
Unreadable file → UNREADABLE
```

---

# 39. Local Removal Flow

```text
User selects Remove from Device
    ↓
Confirm action
    ↓
Set LocalLibraryItem REMOVING
    ↓
[CLIENT DB COMMIT]
    ↓
Remove local payload
    ↓
Remove or transition LocalLibraryItem
    ↓
[CLIENT DB COMMIT]
    ↓
Clean related local artifacts
    ↓
Update catalog projection to remote-only
```

No server mutation occurs.

---

# 40. Local Removal Failure Flow

If file deletion fails:

```text
LocalLibraryItem remains REMOVING or RECOVERY_REQUIRED
    ↓
User receives explicit failure
    ↓
Recovery retries or requests action
```

The item shall not be falsely reported removed.

---

# 41. Offline Transition Flow

```text
Request fails due to network unavailability
    ↓
Connectivity Monitor classifies OFFLINE
    ↓
Client updates global connectivity state
    ↓
Remote catalog refresh disabled
    ↓
Remote acquisition disabled
    ↓
Cached catalog remains accessible
    ↓
Local Library remains accessible
```

---

# 42. Offline Catalog Flow

```text
User opens Master Catalog while offline
    ↓
Load last valid catalog snapshot
    ↓
Display snapshot retrieval time
    ↓
Merge with local availability
    ↓
Disable remote-only actions
```

If no snapshot exists:

```text
Display offline empty/unavailable state
```

---

# 43. Offline Local Library Flow

```text
User opens Local Library
    ↓
Read LocalLibraryRepository
    ↓
Resolve local files
    ↓
Display valid local publications
    ↓
Allow local opening
```

The NAS is not consulted.

---

# 44. Reconnect Flow

```text
Connectivity Monitor detects possible recovery
    ↓
Connect to registered endpoint
    ↓
Retrieve server identity
    ↓
Compare trusted identity
    ↓
Authenticate
    ↓
Request health
    ↓
Verify MasterLibraryId
    ↓
Request CatalogRevision
    ↓
Refresh snapshot if changed
    ↓
Compare SourceVersions
    ↓
Set connectivity ONLINE
```

---

# 45. Master Library Identity Change Flow

If the same endpoint returns a different MasterLibraryId:

```text
Block automatic snapshot merge
    ↓
Set Library context mismatch
    ↓
Keep old local snapshot isolated
    ↓
Display explicit warning
    ↓
Require user decision
```

Local acquired publications remain associated with their original MasterLibraryId.

---

# 46. Catalog Cache Replacement Flow

```text
Receive complete validated replacement snapshot
    ↓
Begin client database transaction
    ↓
Write new snapshot entries
    ↓
Write new CatalogRevision
    ↓
Write retrieval timestamp
    ↓
Activate new snapshot
    ↓
[CLIENT DB COMMIT]
    ↓
Delete obsolete snapshot data
```

The client shall not expose a partially replaced snapshot.

---

# 47. Missing Server Source Flow

```text
Client requests available publication
    ↓
Server resolves catalog entry
    ↓
Source file missing
    ↓
Server rejects delivery
    ↓
Emit integrity diagnostic
    ↓
Mark publication unavailable or corrupted through governed process
    ↓
Return structured source-missing error
```

The server shall not return an empty successful response.

---

# 48. Corrupted Server Source Flow

```text
Integrity validation detects mismatch
    ↓
Mark source CORRUPTED
    ↓
Advance CatalogRevision
    ↓
Reject new acquisitions
    ↓
Generate administrative diagnostic
```

Existing local copies are unaffected.

---

# 49. Insufficient Client Storage Flow

```text
Client estimates required storage
    ↓
Available space insufficient
    ↓
Reject acquisition before transfer where possible
```

If storage becomes insufficient during transfer:

```text
Stop transfer
    ↓
Persist failure
    ↓
Clean or quarantine staging
    ↓
Do not install
```

---

# 50. Authentication Expiration During Transfer

Possible policies:

1. allow an already authorized stream to finish;
2. terminate the stream and require retry.

The chosen behavior shall be explicit in Technology Decisions.

The client shall never silently switch to unauthenticated continuation.

---

# 51. Server Restart During Acquisition

```text
Server process terminates
    ↓
Client transfer fails
    ↓
Client classifies interruption
    ↓
Operation becomes FAILED, PAUSED or RETRYABLE
```

After server restart:

```text
Client reconnects
    ↓
Verifies server identity
    ↓
Reauthenticates
    ↓
Revalidates SourceVersion
    ↓
Retries or resumes
```

---

# 52. Full Server Integrity Validation Flow

```text
Administrator starts FULL_INTEGRITY validation
    ↓
Server enters validation operation
    ↓
Enumerate current source versions
    ↓
Open each committed source
    ↓
Recalculate checksum
    ↓
Compare expected integrity metadata
    ↓
Record result
    ↓
Mark missing or corrupted sources
    ↓
Produce validation report
```

The operation shall use bounded concurrency.

---

# 53. Server Startup Recovery Flow

```text
Server starts
    ↓
Enumerate incomplete server operations
    ↓
Inspect staging
    ↓
Inspect committed source storage
    ↓
Inspect catalog references
```

Possible outcomes:

```text
Complete recoverable operation
Remove stale staging
Quarantine invalid payload
Mark catalog source unavailable
Register orphan for cleanup
Require administrator action
```

---

# 54. Client Startup Recovery Flow

```text
Client starts
    ↓
Open local database
    ↓
Load incomplete acquisitions
    ↓
Inspect staging
    ↓
Inspect final payloads
    ↓
Inspect LocalLibraryItems
```

Possible outcomes:

```text
Resume
Restart
Complete installation
Rollback
Quarantine
Mark failed
Mark recovery required
```

---

# 55. Local Library Reconciliation Flow

```text
Enumerate LocalLibraryItems
    ↓
Resolve expected final payload
    ↓
Check file presence
    ↓
Optionally verify checksum
```

If valid:

```text
IntegrityState = VALID
```

If missing:

```text
IntegrityState = MISSING
```

If checksum mismatch:

```text
IntegrityState = CHECKSUM_MISMATCH
```

---

# 56. Server Catalog-to-Storage Reconciliation

```text
Enumerate AVAILABLE catalog entries
    ↓
Resolve current source storage reference
    ↓
Verify file presence
    ↓
Verify byte length
    ↓
Optionally verify checksum
```

Invalid entries become unavailable or corrupted through a governed mutation.

---

# 57. Server Storage-to-Catalog Reconciliation

```text
Enumerate committed source directories
    ↓
Resolve PublicationId and SourceVersion
    ↓
Check catalog reference
```

If no catalog reference:

```text
Mark as orphan
    ↓
Retain for bounded recovery window
    ↓
Remove or reconcile after review
```

Unknown source files shall not become catalog entries automatically.

---

# 58. Observability Flow

Every request:

```text
Assign RequestId
    ↓
Log request start
    ↓
Execute operation
    ↓
Record duration and result
    ↓
Emit metrics
    ↓
Return response
```

Every acquisition:

```text
AcquisitionOperationId
    +
AcquisitionAttemptId
    +
PublicationId
    +
SourceVersion
```

shall provide traceable correlation.

---

# 59. Error Translation Flow

## 59.1 Server

```text
Database / Filesystem / Framework Error
    ↓
Infrastructure Error
    ↓
Application Error
    ↓
Stable Module Error
    ↓
HTTP Error Contract
```

## 59.2 Client

```text
URLSession / Database / Filesystem / Keychain Error
    ↓
Adapter Error
    ↓
Stable Client Error
    ↓
Feature State
    ↓
User-Facing Message
```

---

# 60. Retry Classification Flow

```text
Failure
    ↓
Classify
```

Possible classifications:

```text
RETRYABLE
USER_ACTION_REQUIRED
PERMANENT
SECURITY_BLOCKED
RECOVERY_REQUIRED
```

Examples:

| Error                          | Classification          |
| ------------------------------ | ----------------------- |
| temporary network loss         | RETRYABLE               |
| server temporarily unavailable | RETRYABLE               |
| invalid credentials            | USER_ACTION_REQUIRED    |
| identity mismatch              | SECURITY_BLOCKED        |
| checksum mismatch              | RETRYABLE after cleanup |
| invalid PublicationId          | PERMANENT               |
| insufficient storage           | USER_ACTION_REQUIRED    |
| interrupted final commit       | RECOVERY_REQUIRED       |

---

# 61. Transaction Boundary Summary

## 61.1 Server Database Transactions

Used for:

* publication creation;
* metadata updates;
* source-version activation;
* availability changes;
* CatalogRevision;
* authorization changes.

## 61.2 Client Database Transactions

Used for:

* acquisition state transitions;
* catalog snapshot replacement;
* LocalLibraryItem creation;
* LocalLibraryItem version update;
* local removal.

## 61.3 Filesystem Commits

Used for:

* server source publication commit;
* client local publication commit;
* source replacement;
* local update replacement.

---

# 62. Cross-Resource Consistency

Database and filesystem commits are coordinated by workflow state, not by distributed transaction.

Consistency mechanisms:

```text
staging
operation records
commit ordering
idempotency
recovery markers
reconciliation
checksums
```

---

# 63. Data Flow Security Rules

Every data flow shall ensure:

* authenticated access where required;
* server-side authorization;
* no arbitrary filesystem paths;
* no secret leakage;
* bounded payloads;
* no personal state sent to NAS;
* server identity verification;
* safe error responses.

---

# 64. Data Flow Privacy Rules

The server may receive:

* DeviceId;
* authentication evidence;
* PublicationId;
* SourceVersion;
* catalog filters;
* operational request metadata.

The server shall not receive:

* annotation content;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal notes;
* CloudKit state.

---

# 65. Data Flow Performance Rules

* catalog requests are paginated;
* large files are streamed;
* progress persistence is throttled;
* checksum calculation is streamed;
* transfer concurrency is bounded;
* integrity validation concurrency is bounded;
* UI work does not block on file processing.

---

# 66. Data Flow Recovery Rules

* all critical workflows persist enough state for recovery;
* process memory is never the only source of workflow state;
* recovery never marks unvalidated content complete;
* stale staging is bounded by retention policy;
* ambiguous outcomes become `RECOVERY_REQUIRED`;
* silent data loss is prohibited.

---

# 67. Data Flow Test Matrix

Each principal flow requires:

```text
Happy-path test
Validation-failure test
Infrastructure-failure test
Restart test
Authorization test
Observability evidence
```

---

# 68. Required End-to-End Data Flow

The mandatory full-stack flow is:

```text
Initialize Master Library
    ↓
Register PDF
    ↓
Start Server
    ↓
Register macOS Client
    ↓
Authenticate
    ↓
Browse Catalog
    ↓
Open Publication Details
    ↓
Acquire Exact SourceVersion
    ↓
Stream to Local Staging
    ↓
Validate Size
    ↓
Validate Checksum
    ↓
Install Locally
    ↓
Persist LocalLibraryItem
    ↓
Disconnect NAS
    ↓
Restart Client
    ↓
Open Local Publication
```

---

# 69. Data Flow Completion Gate

This design is complete when:

```text
[ ] Server startup flow is explicit
[ ] Master Library initialization flow is explicit
[ ] Publication registration flow is explicit
[ ] Metadata update flow is explicit
[ ] Source replacement flow is explicit
[ ] Catalog list flow is explicit
[ ] Catalog search flow is explicit
[ ] Publication details flow is explicit
[ ] Server registration flow is explicit
[ ] Authentication flow is explicit
[ ] Acquisition flow is explicit
[ ] Cancellation flow is explicit
[ ] Retry flow is explicit
[ ] Resume policy boundary is explicit
[ ] Installation flow is explicit
[ ] Update flow is explicit
[ ] Local removal flow is explicit
[ ] Offline flow is explicit
[ ] Reconnect flow is explicit
[ ] Server recovery is explicit
[ ] Client recovery is explicit
[ ] Transaction boundaries are explicit
[ ] Reconciliation is explicit
[ ] Error translation is explicit
[ ] Security and privacy boundaries are explicit
```

---

# 70. Data Flow Invariants

The following invariants apply:

* Only committed source publications are Reader-visible.
* Only validated local payloads are locally available.
* PublicationId remains stable.
* SourceVersion is fixed for one acquisition.
* Retry creates a new Attempt.
* Download completion is not installation completion.
* Current valid local versions survive failed updates.
* Local removal does not mutate the NAS.
* Cached catalog data is not authoritative.
* Process restart does not erase workflow truth.
* Personal state never enters NAS flows.
* Large payloads use bounded memory.
* Errors remain structured and traceable.

---

# 71. Prohibited Data Flows

The module shall not implement flows that:

* let clients read arbitrary NAS paths;
* publish staging files;
* create catalog entries before source commit;
* mark local availability before checksum validation;
* switch SourceVersion during active acquisition;
* retry security failures automatically;
* delete local content because the server is offline;
* upload personal state during acquisition;
* mirror the complete Master Library automatically;
* use memory-only acquisition state;
* merge catalog snapshots across different Master Libraries;
* silently recover ambiguous outcomes as success.

---

# 72. Related Documents

## Technical Design

* `README.md`
* `SystemDesign.md`
* `ServerDesign.md`
* `ClientDesign.md`
* `ErrorModel.md`
* `TechnologyDecisions.md`

## Requirements

* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

## Future Detailed Areas

* `../04-Contracts/AcquisitionContracts.md`
* `../05-Persistence/MasterLibraryLayout.md`
* `../05-Persistence/LocalLibraryStorage.md`
* `../06-Server/ServerArchitecture.md`
* `../07-Client/AcquisitionManager.md`
* `../08-Testing/EndToEndTests.md`

---

# 73. Status

**Approved**

The principal server, client, persistence, storage, acquisition, offline, recovery and reconciliation flows of the Master Library Module are now explicit.

The next document is:

```text
01-MasterLibrary/02-TechnicalDesign/ErrorModel.md
```

It shall define the complete stable error taxonomy, retryability, transport mapping, client translation and user-facing behavior.
