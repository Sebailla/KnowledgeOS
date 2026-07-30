

# Master Library Domain Errors

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Domain

**Document:** Errors

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Domain-owned errors of the Master Library Module.

It establishes:

* Domain error semantics;
* stable Domain error codes;
* ownership boundaries;
* invariant violations;
* invalid state transitions;
* invalid entity construction;
* invalid value-object construction;
* aggregate consistency failures;
* retry semantics where Domain-relevant;
* mapping into Application and module-level errors.

Domain errors represent violations of business meaning.

They shall not expose:

* database implementation;
* filesystem implementation;
* HTTP framework behavior;
* network-library behavior;
* NAS paths;
* stack traces;
* credentials;
* infrastructure exception messages.

---

# 2. Scope

This document defines errors for:

* MasterLibrary aggregate;
* Publication aggregate;
* SourcePublication entity;
* AcquisitionOperation aggregate;
* AcquisitionAttempt entity;
* LocalLibraryItem aggregate;
* Domain value objects;
* Domain policies;
* Domain state transitions;
* Domain rehydration.

It does not directly define:

* HTTP status codes;
* SQLite errors;
* NestJS exceptions;
* URLSession errors;
* GRDB errors;
* filesystem errors;
* Keychain errors;
* TLS errors.

Those failures are translated by Application and Infrastructure layers.

---

# 3. Core Error Principle

> A Domain error shall explain which Domain rule was violated, not which technical mechanism failed.

Example:

```text
Incorrect:
SQLITE_CONSTRAINT_FAILED
```

Correct Domain meaning:

```text
SOURCE_VERSION_ALREADY_EXISTS
```

Example:

```text
Incorrect:
FILE_NOT_FOUND
```

Possible Application or Domain meaning:

```text
CURRENT_SOURCE_NOT_AVAILABLE
```

depending on the operation boundary.

---

# 4. Domain Error Ownership

The Domain owns errors caused by:

* invalid identity values;
* invalid version values;
* invalid metadata values;
* invalid state transitions;
* impossible aggregate state;
* violation of aggregate invariants;
* incompatible entity relationships;
* invalid operation evidence;
* invalid retry or resume semantics;
* invalid local installation facts.

The Domain does not own errors caused solely by:

* database connection failure;
* filesystem permissions;
* network interruption;
* process termination;
* TLS validation;
* secure-storage access.

---

# 5. Domain Error Model

Conceptually:

```text
DomainError
├── code
├── category
├── message
├── aggregateType?
├── aggregateId?
├── details?
└── cause?
```

The Domain error shall expose safe semantic details only.

The internal `cause` may be retained during construction but shall not become part of public transport automatically.

---

# 6. Error Categories

The approved Domain error categories are:

```text
IDENTITY
VALUE
STATE
INVARIANT
CONFLICT
ELIGIBILITY
VERSION
INTEGRITY
COMPATIBILITY
REHYDRATION
```

---

# 7. Error Code Format

Domain error codes use uppercase snake case.

Examples:

```text
INVALID_PUBLICATION_ID
INVALID_SOURCE_VERSION
INVALID_ACQUISITION_TRANSITION
PUBLICATION_NOT_ACQUIRABLE
LOCAL_INSTALLATION_EVIDENCE_INVALID
```

Codes shall:

* remain stable;
* have one meaning;
* not contain technology names;
* not be reused for unrelated failures;
* map deterministically into the module error registry.

---

# 8. Domain Error Base Types

The implementation should define explicit base classes or discriminated types conceptually equivalent to:

```text
DomainError
ValueObjectError
EntityCreationError
InvalidStateTransitionError
InvariantViolationError
DomainConflictError
DomainEligibilityError
DomainRehydrationError
```

Inheritance is optional.

Stable classification is mandatory.

---

# 9. Expected Versus Unexpected Errors

Domain errors are expected failures caused by invalid requested behavior or invalid persisted state.

Unexpected programming defects shall not be hidden as ordinary Domain errors.

Example:

```text
Expected:
INVALID_ACQUISITION_TRANSITION
```

Example:

```text
Unexpected:
undefined aggregate state caused by implementation defect
```

Unexpected defects shall become:

```text
INVARIANT_VIOLATION
```

or propagate to the Application boundary for safe handling.

---

# 10. Identifier Errors

## INVALID_MASTER_LIBRARY_ID

The supplied MasterLibraryId is empty, malformed or non-canonical.

**Category:** IDENTITY

## INVALID_PUBLICATION_ID

The supplied PublicationId is empty, malformed or non-canonical.

**Category:** IDENTITY

## INVALID_SERVER_ID

The supplied ServerId is invalid.

**Category:** IDENTITY

## INVALID_DEVICE_ID

The supplied DeviceId is invalid.

**Category:** IDENTITY

## INVALID_ACQUISITION_OPERATION_ID

The supplied AcquisitionOperationId is invalid.

**Category:** IDENTITY

## INVALID_ACQUISITION_ATTEMPT_ID

The supplied AcquisitionAttemptId is invalid.

**Category:** IDENTITY

## INVALID_LOCAL_LIBRARY_ITEM_ID

The supplied LocalLibraryItemId is invalid.

**Category:** IDENTITY

## INVALID_CONTRIBUTOR_ENTRY_ID

The supplied contributor-entry identity is invalid.

**Category:** IDENTITY

## IDENTIFIER_TYPE_MISMATCH

An identifier of one semantic type was used where another type was required.

**Category:** IDENTITY

Example:

```text
ServerId passed as PublicationId
```

This error should normally be prevented by static typing.

---

# 11. Version and Revision Errors

## INVALID_SOURCE_VERSION

SourceVersion is zero, negative, malformed or outside the supported range.

**Category:** VERSION

## SOURCE_VERSION_ALREADY_EXISTS

The Publication already contains the requested SourceVersion.

**Category:** CONFLICT

## SOURCE_VERSION_NOT_MONOTONIC

The new SourceVersion does not advance beyond existing versions.

**Category:** VERSION

## SOURCE_VERSION_NOT_FOUND

The requested SourceVersion does not belong to the Publication.

**Category:** VERSION

## SOURCE_VERSION_CONTEXT_MISMATCH

A SourceVersion was compared or applied outside its Publication context.

**Category:** VERSION

## INVALID_CATALOG_REVISION

CatalogRevision is negative, malformed or outside the supported range.

**Category:** VERSION

## CATALOG_REVISION_DECREASE

An operation attempted to move CatalogRevision backwards.

**Category:** INVARIANT

## CATALOG_REVISION_REUSE

An existing CatalogRevision was reused for another authoritative mutation.

**Category:** CONFLICT

## CATALOG_REVISION_CONTEXT_MISMATCH

A CatalogRevision was applied to a different MasterLibraryId.

**Category:** VERSION

## INVALID_RECORD_VERSION

RecordVersion is invalid.

**Category:** VERSION

## RECORD_VERSION_CONFLICT

The expected aggregate persistence version differs from the actual version.

**Category:** CONFLICT

This Domain/Application conflict maps to optimistic-concurrency handling.

---

# 12. Integrity Value Errors

## INVALID_CHECKSUM_ALGORITHM

The checksum algorithm is unsupported.

**Category:** VALUE

## INVALID_CHECKSUM

The checksum value is malformed.

**Category:** VALUE

## CHECKSUM_LENGTH_INVALID

The digest length does not match the selected algorithm.

**Category:** VALUE

## CHECKSUM_VALUE_INVALID

The digest contains invalid characters or representation.

**Category:** VALUE

## CHECKSUM_MISMATCH

An actual payload checksum differs from the expected checksum.

**Category:** INTEGRITY

## INVALID_BYTE_LENGTH

ByteLength is negative, zero where positive length is required, malformed or outside supported bounds.

**Category:** VALUE

## BYTE_LENGTH_MISMATCH

Actual payload length differs from expected ByteLength.

**Category:** INTEGRITY

## INVALID_BYTE_OFFSET

ByteOffset is negative or malformed.

**Category:** VALUE

## BYTE_OFFSET_OUT_OF_RANGE

The offset exceeds the expected payload bounds.

**Category:** VALUE

---

# 13. Publication Metadata Errors

## INVALID_PUBLICATION_TITLE

The publication title is absent, blank or violates length constraints.

**Category:** VALUE

## INVALID_PUBLICATION_SUBTITLE

The subtitle violates validation constraints.

**Category:** VALUE

## INVALID_PUBLICATION_DESCRIPTION

The description violates size or content constraints.

**Category:** VALUE

## INVALID_CONTRIBUTOR_NAME

A contributor name is blank or invalid.

**Category:** VALUE

## INVALID_CONTRIBUTOR_ROLE

The contributor role is unsupported.

**Category:** VALUE

## INVALID_CONTRIBUTOR_ORDER

Contributor ordering is negative or inconsistent.

**Category:** VALUE

## DUPLICATE_CONTRIBUTOR_ENTRY

The metadata contains the same contributor-entry identity more than once.

**Category:** CONFLICT

## INVALID_SUBJECT_NAME

A subject is blank or invalid.

**Category:** VALUE

## DUPLICATE_PUBLICATION_SUBJECT

The metadata contains duplicate normalized subject values.

**Category:** CONFLICT

## INVALID_PUBLISHER_NAME

Publisher text violates validation constraints.

**Category:** VALUE

## INVALID_LANGUAGE_CODE

The language tag is malformed or unsupported by validation policy.

**Category:** VALUE

## INVALID_PUBLICATION_DATE

The publication date or its precision is invalid.

**Category:** VALUE

## INVALID_PUBLICATION_TYPE

The publication type is unsupported.

**Category:** VALUE

## INVALID_PUBLICATION_FORMAT

The source format is unsupported.

**Category:** VALUE

## INVALID_MEDIA_TYPE

MediaType is malformed or unsupported.

**Category:** VALUE

## PUBLICATION_FORMAT_MEDIA_TYPE_MISMATCH

PublicationFormat and MediaType do not agree.

Example:

```text
format = PDF
mediaType = image/png
```

**Category:** INVARIANT

## INVALID_ORIGINAL_FILE_NAME

The original filename contains path traversal, separators, invalid characters or violates length limits.

**Category:** VALUE

## PERSONAL_STATE_FIELD_PROHIBITED

A Master Library metadata operation attempted to include personal state.

Examples:

* annotations;
* progress;
* personal tags;
* favorites;
* personal relationships.

**Category:** INVARIANT

---

# 14. Storage Reference Errors

## INVALID_STORAGE_REFERENCE

A server-side logical storage reference is malformed.

**Category:** VALUE

## INVALID_LOCAL_STORAGE_REFERENCE

A device-local logical storage reference is malformed.

**Category:** VALUE

## UNSUPPORTED_STORAGE_REFERENCE_SCHEME

The reference uses an unsupported scheme.

**Category:** VALUE

## PHYSICAL_PATH_NOT_ALLOWED

A physical filesystem path was supplied where a logical storage reference is required.

**Category:** INVARIANT

## STORAGE_REFERENCE_CONTEXT_MISMATCH

The logical reference does not match the expected PublicationId, SourceVersion, ServerId or MasterLibraryId.

**Category:** INVARIANT

## INVALID_COVER_REFERENCE

A cover reference is malformed or references an incompatible publication context.

**Category:** VALUE

---

# 15. Endpoint and Trust Value Errors

## INVALID_SERVER_ENDPOINT

The endpoint is malformed.

**Category:** VALUE

## UNSUPPORTED_SERVER_ENDPOINT_SCHEME

The endpoint uses a prohibited scheme.

**Category:** COMPATIBILITY

## SERVER_ENDPOINT_CONTAINS_CREDENTIALS

Credentials were embedded in the endpoint.

**Category:** INVARIANT

## INVALID_SERVER_FINGERPRINT

The fingerprint is malformed or uses an unsupported algorithm.

**Category:** VALUE

## SERVER_IDENTITY_CONTEXT_MISMATCH

The presented ServerId does not match the expected trusted context.

**Category:** INVARIANT

This error may map to the module-level:

```text
SERVER_IDENTITY_MISMATCH
```

---

# 16. Pagination and Search Errors

## INVALID_CATALOG_CURSOR

The catalog cursor is empty, malformed, expired or incompatible with the current query context.

**Category:** VALUE

## CATALOG_CURSOR_CONTEXT_MISMATCH

The cursor belongs to a different sort, filter or Library context.

**Category:** INVARIANT

## INVALID_PAGE_SIZE

PageSize falls outside approved bounds.

**Category:** VALUE

## INVALID_SEARCH_QUERY

The search query violates normalization, length or content rules.

**Category:** VALUE

## INVALID_SORT_ORDER

The requested sort order is unsupported.

**Category:** VALUE

---

# 17. Temporal Errors

## INVALID_INSTANT

The instant is malformed or outside supported bounds.

**Category:** VALUE

## INVALID_TIMESTAMP_ORDER

A later lifecycle timestamp precedes an earlier required timestamp.

Examples:

```text
completedAt < createdAt
endedAt < startedAt
```

**Category:** INVARIANT

## INVALID_DURATION

A duration is negative or malformed.

**Category:** VALUE

## INVALID_RETRY_COUNT

RetryCount is negative or exceeds the approved limit.

**Category:** VALUE

---

# 18. MasterLibrary Creation Errors

## MASTER_LIBRARY_NAME_INVALID

The Master Library name is blank or invalid.

**Category:** VALUE

## MASTER_LIBRARY_FORMAT_VERSION_INVALID

The format version is malformed.

**Category:** VALUE

## MASTER_LIBRARY_FORMAT_UNSUPPORTED

The aggregate cannot safely represent the format version.

**Category:** COMPATIBILITY

## MASTER_LIBRARY_INITIAL_STATE_INVALID

A newly initialized MasterLibrary was created in an invalid initial state.

**Category:** STATE

## MASTER_LIBRARY_IDENTITY_IMMUTABLE

An operation attempted to replace MasterLibraryId.

**Category:** INVARIANT

## MASTER_LIBRARY_CREATED_AT_IMMUTABLE

An operation attempted to change the creation timestamp.

**Category:** INVARIANT

---

# 19. MasterLibrary State Errors

## INVALID_MASTER_LIBRARY_TRANSITION

A requested MasterLibraryState transition is not allowed.

**Category:** STATE

Safe details may contain:

```text
currentState
requestedState
```

## MASTER_LIBRARY_CANNOT_BECOME_AVAILABLE

The aggregate lacks required validated conditions for `AVAILABLE`.

**Category:** ELIGIBILITY

## MASTER_LIBRARY_FORMAT_INCOMPATIBLE

The Library format cannot be interpreted by the active Domain version.

**Category:** COMPATIBILITY

## MASTER_LIBRARY_ALREADY_IN_MAINTENANCE

An incompatible maintenance transition was requested.

**Category:** CONFLICT

This transition may be treated idempotently if the same maintenance operation owns the state.

## MASTER_LIBRARY_NOT_IN_MAINTENANCE

An operation requiring maintenance state was invoked outside maintenance.

**Category:** STATE

## CATALOG_REVISION_CHANGE_NOT_ALLOWED

An operation attempted to advance CatalogRevision for a non-authoritative or device-local change.

**Category:** INVARIANT

---

# 20. Publication Creation Errors

## PUBLICATION_METADATA_INVALID

The composed PublicationMetadata value is invalid.

**Category:** VALUE

## PUBLICATION_IDENTITY_IMMUTABLE

An operation attempted to change PublicationId.

**Category:** INVARIANT

## PUBLICATION_CREATED_AT_IMMUTABLE

An operation attempted to change the publication creation time.

**Category:** INVARIANT

## PUBLICATION_PERSONAL_STATE_PROHIBITED

The Publication aggregate was given personal-state data.

**Category:** INVARIANT

---

# 21. SourcePublication Errors

## SOURCE_PUBLICATION_INVALID

The SourcePublication cannot be created from the supplied values.

**Category:** VALUE

## SOURCE_PUBLICATION_NOT_COMMITTED

An operation attempted to activate or deliver a source not known to be committed.

**Category:** ELIGIBILITY

## SOURCE_PUBLICATION_IMMUTABLE

An operation attempted to mutate committed source identity or integrity metadata.

**Category:** INVARIANT

Immutable fields include:

* SourceVersion;
* ByteLength;
* Checksum;
* MediaType;
* PublicationFormat;
* StorageReference.

## SOURCE_PUBLICATION_CONTEXT_MISMATCH

The SourcePublication does not belong to the target Publication.

**Category:** INVARIANT

## SOURCE_PUBLICATION_NOT_VALID

The source integrity state is not `VALID`.

**Category:** ELIGIBILITY

## SOURCE_PUBLICATION_NOT_DELIVERABLE

The source cannot be used for acquisition.

**Category:** ELIGIBILITY

## INVALID_SOURCE_INTEGRITY_TRANSITION

The requested SourceIntegrityState transition is prohibited.

**Category:** STATE

## SOURCE_VALIDATION_EVIDENCE_REQUIRED

A transition to `VALID` lacked required verified evidence.

**Category:** ELIGIBILITY

## SOURCE_ALREADY_QUARANTINED

An incompatible operation was attempted on a quarantined source.

**Category:** STATE

---

# 22. Publication Source Version Errors

## CURRENT_SOURCE_NOT_SET

The Publication has no current SourceVersion.

**Category:** ELIGIBILITY

## CURRENT_SOURCE_NOT_FOUND

The current SourceVersion does not resolve to an owned SourcePublication.

**Category:** INVARIANT

## CURRENT_SOURCE_NOT_VALID

The current source is not in valid integrity state.

**Category:** ELIGIBILITY

## SOURCE_VERSION_ACTIVATION_INVALID

The requested source version cannot become current.

**Category:** STATE

## SOURCE_VERSION_ACTIVATION_EVIDENCE_REQUIRED

Activation lacked commit or integrity evidence.

**Category:** ELIGIBILITY

## SOURCE_BYTES_CHANGED_WITHOUT_NEW_VERSION

An operation attempted to change authoritative source bytes without creating a new SourceVersion.

**Category:** INVARIANT

## METADATA_CHANGE_CREATED_SOURCE_VERSION

A metadata-only change incorrectly attempted to create a new SourceVersion.

**Category:** INVARIANT

This may be an internal policy violation rather than an external input error.

---

# 23. Publication Availability Errors

## INVALID_PUBLICATION_AVAILABILITY_TRANSITION

The requested PublicationAvailability transition is prohibited.

**Category:** STATE

## PUBLICATION_NOT_ACQUIRABLE

The Publication does not satisfy acquisition eligibility.

**Category:** ELIGIBILITY

Possible reasons:

* unavailable;
* withdrawn;
* corrupted;
* no current source;
* invalid current source.

## PUBLICATION_ALREADY_WITHDRAWN

An incompatible operation was attempted on a withdrawn publication.

**Category:** STATE

The same repeated withdrawal request may be idempotent when reason and authority match.

## PUBLICATION_NOT_WITHDRAWN

An operation requiring withdrawn state was invoked on a different state.

**Category:** STATE

## PUBLICATION_RESTORATION_EVIDENCE_REQUIRED

A restoration to `AVAILABLE` lacked valid current-source evidence.

**Category:** ELIGIBILITY

## PUBLICATION_CORRUPTION_EVIDENCE_REQUIRED

A transition to `CORRUPTED` lacked a valid integrity reason.

**Category:** ELIGIBILITY

---

# 24. Publication Duplicate Errors

## PROBABLE_DUPLICATE_PUBLICATION

Duplicate policy identified a likely duplicate requiring explicit resolution.

**Category:** CONFLICT

## IDENTICAL_SOURCE_ALREADY_REGISTERED

The same canonical source checksum is already registered under the duplicate policy.

**Category:** CONFLICT

## AMBIGUOUS_PUBLICATION_IDENTITY

The system cannot determine whether the input represents:

* a new Publication;
* a new edition;
* a replacement SourceVersion;
* a duplicate submission.

**Category:** CONFLICT

This requires administrator choice.

---

# 25. Acquisition Creation Errors

## ACQUISITION_TARGET_INVALID

The acquisition context is incomplete or invalid.

**Category:** VALUE

## ACQUISITION_EXPECTED_BYTE_LENGTH_INVALID

The expected ByteLength is invalid.

**Category:** VALUE

## ACQUISITION_EXPECTED_CHECKSUM_INVALID

The expected Checksum is invalid.

**Category:** VALUE

## ACQUISITION_SOURCE_CONTEXT_MISMATCH

ServerId, MasterLibraryId, PublicationId or SourceVersion do not describe one coherent target.

**Category:** INVARIANT

## ACQUISITION_TARGET_IMMUTABLE

An operation attempted to change the fixed target after creation.

**Category:** INVARIANT

---

# 26. Acquisition Transition Errors

## INVALID_ACQUISITION_TRANSITION

The requested AcquisitionState transition is prohibited.

**Category:** STATE

Safe details may include:

```text
operationId
currentState
requestedState
```

## ACQUISITION_ALREADY_COMPLETED

An operation attempted to mutate a completed acquisition.

**Category:** STATE

## ACQUISITION_ALREADY_CANCELLED

An operation attempted to execute a cancelled acquisition.

**Category:** STATE

## ACQUISITION_NOT_CANCELLABLE

Cancellation was requested from a non-cancellable state.

**Category:** STATE

## ACQUISITION_NOT_RETRYABLE

Retry was requested from a state or failure that is not retryable.

**Category:** ELIGIBILITY

## ACQUISITION_REQUIRES_RECOVERY

Normal execution was requested while the operation is `RECOVERY_REQUIRED`.

**Category:** STATE

## ACQUISITION_NOT_RECOVERABLE

Recovery was requested but available evidence cannot support a valid recovery transition.

**Category:** ELIGIBILITY

---

# 27. Acquisition Attempt Errors

## ACQUISITION_ATTEMPT_ALREADY_ACTIVE

The AcquisitionOperation already owns an active Attempt.

**Category:** CONFLICT

## ACQUISITION_ATTEMPT_NOT_ACTIVE

An operation requiring an active Attempt was invoked without one.

**Category:** STATE

## ACQUISITION_ATTEMPT_ID_ALREADY_USED

The Attempt identifier already exists in the operation history.

**Category:** CONFLICT

## ACQUISITION_ATTEMPT_NOT_FOUND

The referenced Attempt does not belong to the operation.

**Category:** STATE

## ACQUISITION_ATTEMPT_ALREADY_TERMINAL

An operation attempted to mutate a terminal Attempt.

**Category:** STATE

## INVALID_ACQUISITION_ATTEMPT_OUTCOME

The requested terminal outcome is invalid.

**Category:** STATE

## INVALID_ACQUISITION_TRANSFER_MODE

The transfer mode is unsupported.

**Category:** VALUE

## ACQUISITION_ATTEMPT_OFFSET_INVALID

The initial or final byte offset is invalid.

**Category:** VALUE

---

# 28. Acquisition Progress Errors

## ACQUISITION_NOT_DOWNLOADING

Progress was recorded while the operation was not downloading.

**Category:** STATE

## ACQUISITION_PROGRESS_NEGATIVE

Received-byte progress is negative.

**Category:** VALUE

## ACQUISITION_PROGRESS_DECREASED

Progress moved backwards within the same Attempt.

**Category:** INVARIANT

## ACQUISITION_PROGRESS_EXCEEDS_TOTAL

Received bytes exceed expected ByteLength.

**Category:** INVARIANT

## ACQUISITION_PROGRESS_ATTEMPT_MISMATCH

Progress belongs to a non-current Attempt.

**Category:** INVARIANT

---

# 29. Acquisition Transfer Completion Errors

## ACQUISITION_TRANSFER_INCOMPLETE

The transfer ended before the expected ByteLength was reached.

**Category:** INTEGRITY

## ACQUISITION_TRANSFER_LENGTH_MISMATCH

The completed transfer length differs from expected ByteLength.

**Category:** INTEGRITY

## ACQUISITION_TRANSFER_ALREADY_COMPLETED

Transfer completion was reported more than once incompatibly.

**Category:** STATE

## ACQUISITION_VALIDATION_NOT_ALLOWED

Validation was requested before transfer completion or from another invalid state.

**Category:** STATE

---

# 30. Acquisition Checksum Errors

## ACQUISITION_CHECKSUM_MISMATCH

The acquired staging payload checksum differs from expected Checksum.

**Category:** INTEGRITY

## ACQUISITION_CHECKSUM_NOT_VALIDATED

Installation was requested before checksum validation.

**Category:** ELIGIBILITY

## ACQUISITION_VALIDATION_EVIDENCE_INVALID

The supplied validation evidence does not match the operation target.

**Category:** INVARIANT

---

# 31. Acquisition Installation Errors

## ACQUISITION_INSTALLATION_NOT_ALLOWED

Installation was requested from an invalid state.

**Category:** STATE

## LOCAL_INSTALLATION_EVIDENCE_INVALID

Installation evidence is missing or inconsistent.

**Category:** INVARIANT

## INSTALLED_SOURCE_VERSION_MISMATCH

The installed SourceVersion differs from the acquisition target.

**Category:** INTEGRITY

## INSTALLED_BYTE_LENGTH_MISMATCH

The installed payload ByteLength differs from expected.

**Category:** INTEGRITY

## INSTALLED_CHECKSUM_MISMATCH

The installed payload Checksum differs from expected.

**Category:** INTEGRITY

## LOCAL_LIBRARY_ITEM_COMMIT_NOT_CONFIRMED

Acquisition completion was requested without LocalLibraryItem commit evidence.

**Category:** ELIGIBILITY

## FINAL_PAYLOAD_COMMIT_NOT_CONFIRMED

Acquisition completion was requested without final local payload commit evidence.

**Category:** ELIGIBILITY

## ACQUISITION_COMPLETION_EVIDENCE_INVALID

The complete installation evidence does not satisfy all completion invariants.

**Category:** INVARIANT

---

# 32. Acquisition Retry Errors

## ACQUISITION_RETRY_ATTEMPT_ID_REQUIRED

Retry was requested without a new AcquisitionAttemptId.

**Category:** VALUE

## ACQUISITION_RETRY_REUSED_ATTEMPT_ID

Retry attempted to reuse an existing Attempt identity.

**Category:** CONFLICT

## ACQUISITION_RETRY_SOURCE_CONTEXT_CHANGED

The source context changed incompatibly before retry.

**Category:** CONFLICT

## ACQUISITION_RETRY_NOT_SAFE

The operation cannot safely restart without recovery or cleanup.

**Category:** ELIGIBILITY

---

# 33. Acquisition Resume Errors

## ACQUISITION_RESUME_NOT_ENABLED

Resume was requested while the capability is disabled.

**Category:** COMPATIBILITY

## ACQUISITION_RESUME_STATE_INVALID

The operation is not in a resumable state.

**Category:** STATE

## ACQUISITION_RESUME_CHECKPOINT_INVALID

The ResumeCheckpoint is malformed or inconsistent.

**Category:** INTEGRITY

## ACQUISITION_RESUME_OPERATION_MISMATCH

The checkpoint belongs to another AcquisitionOperation.

**Category:** INVARIANT

## ACQUISITION_RESUME_ATTEMPT_MISMATCH

The checkpoint belongs to an incompatible Attempt.

**Category:** INVARIANT

## ACQUISITION_RESUME_SERVER_MISMATCH

ServerId differs from the original operation context.

**Category:** INVARIANT

## ACQUISITION_RESUME_LIBRARY_MISMATCH

MasterLibraryId differs from the original context.

**Category:** INVARIANT

## ACQUISITION_RESUME_PUBLICATION_MISMATCH

PublicationId differs from the original target.

**Category:** INVARIANT

## ACQUISITION_RESUME_SOURCE_VERSION_MISMATCH

SourceVersion differs from the original target.

**Category:** INTEGRITY

## ACQUISITION_RESUME_BYTE_LENGTH_MISMATCH

Expected payload length changed.

**Category:** INTEGRITY

## ACQUISITION_RESUME_CHECKSUM_MISMATCH

Expected checksum changed.

**Category:** INTEGRITY

## ACQUISITION_RESUME_OFFSET_MISMATCH

Checkpoint offset does not match actual partial payload state.

**Category:** INTEGRITY

## ACQUISITION_RESUME_RANGE_INVALID

The resume range is invalid.

**Category:** VALUE

## ACQUISITION_RESUME_RESTART_REQUIRED

Resume conditions failed and the next Attempt must begin from zero.

**Category:** ELIGIBILITY

---

# 34. Acquisition Cancellation Errors

## ACQUISITION_CANCELLATION_REASON_INVALID

Cancellation reason is invalid.

**Category:** VALUE

## ACQUISITION_CANCELLATION_NOT_ALLOWED

The current state cannot be cancelled safely.

**Category:** STATE

## ACQUISITION_ALREADY_TERMINAL

A cancellation was requested after a terminal outcome.

**Category:** STATE

Repeated cancellation of an already cancelled operation may be idempotent.

---

# 35. Acquisition Recovery Errors

## ACQUISITION_RECOVERY_EVIDENCE_INVALID

Recovery evidence is incomplete or contradictory.

**Category:** INTEGRITY

## ACQUISITION_RECOVERY_OUTCOME_AMBIGUOUS

The available evidence cannot prove successful completion or safe failure.

**Category:** REHYDRATION

## ACQUISITION_RECOVERY_TRANSITION_INVALID

The requested recovery transition is prohibited.

**Category:** STATE

## ACQUISITION_RECOVERY_COMPLETION_NOT_PROVEN

Recovery attempted to mark the operation completed without complete installation evidence.

**Category:** ELIGIBILITY

## ACQUISITION_RECOVERY_FAILURE_NOT_PROVEN

Recovery attempted to mark the operation failed without proving no valid installation exists.

**Category:** ELIGIBILITY

---

# 36. LocalLibraryItem Creation Errors

## LOCAL_LIBRARY_ITEM_CONTEXT_INVALID

The ServerId, MasterLibraryId and PublicationId context is incomplete or invalid.

**Category:** VALUE

## LOCAL_LIBRARY_ITEM_IDENTITY_IMMUTABLE

An operation attempted to change LocalLibraryItem identity context.

**Category:** INVARIANT

## LOCAL_LIBRARY_ITEM_SOURCE_VERSION_INVALID

The installed SourceVersion is invalid.

**Category:** VALUE

## LOCAL_LIBRARY_ITEM_STORAGE_REFERENCE_INVALID

The logical local storage reference is invalid.

**Category:** VALUE

## LOCAL_LIBRARY_ITEM_METADATA_SNAPSHOT_INVALID

The offline metadata snapshot is malformed or belongs to another Library context.

**Category:** VALUE

## LOCAL_LIBRARY_ITEM_INSTALLATION_EVIDENCE_REQUIRED

Creation was requested without valid installation evidence.

**Category:** ELIGIBILITY

---

# 37. Local Availability Errors

## INVALID_LOCAL_AVAILABILITY_TRANSITION

The requested LocalAvailability transition is prohibited.

**Category:** STATE

## LOCAL_PUBLICATION_NOT_AVAILABLE

The local item is not safely available for opening.

**Category:** ELIGIBILITY

## LOCAL_PUBLICATION_ALREADY_AVAILABLE

An incompatible duplicate installation was requested for the same SourceVersion.

**Category:** CONFLICT

The operation may instead verify the existing payload.

## LOCAL_PUBLICATION_MISSING

The LocalLibraryItem expects a payload that is absent.

**Category:** INTEGRITY

## LOCAL_PUBLICATION_CORRUPTED

The local payload failed integrity validation.

**Category:** INTEGRITY

## LOCAL_PUBLICATION_UNREADABLE

The local payload cannot be read.

**Category:** INTEGRITY

## LOCAL_PUBLICATION_RECOVERY_REQUIRED

The local item is in ambiguous state.

**Category:** STATE

---

# 38. Local Integrity Errors

## INVALID_LOCAL_INTEGRITY_TRANSITION

The requested LocalIntegrityState transition is prohibited.

**Category:** STATE

## LOCAL_AVAILABILITY_INTEGRITY_MISMATCH

LocalAvailability and LocalIntegrityState are incompatible.

Examples:

```text
availability = AVAILABLE_LOCAL
integrity = CHECKSUM_MISMATCH
```

**Category:** INVARIANT

## LOCAL_VALIDATION_EVIDENCE_REQUIRED

A transition to valid local integrity lacked required evidence.

**Category:** ELIGIBILITY

## LOCAL_EXPECTED_CHECKSUM_MISMATCH

Local validation used an unexpected checksum context.

**Category:** INTEGRITY

## LOCAL_EXPECTED_BYTE_LENGTH_MISMATCH

Local validation used an unexpected ByteLength context.

**Category:** INTEGRITY

---

# 39. Local Version Replacement Errors

## LOCAL_SOURCE_VERSION_NOT_NEWER

The replacement SourceVersion is not newer and no explicit reacquisition policy permits it.

**Category:** VERSION

## LOCAL_SOURCE_VERSION_CONTEXT_MISMATCH

The replacement belongs to another Publication or Master Library context.

**Category:** INVARIANT

## LOCAL_REPLACEMENT_EVIDENCE_INVALID

Replacement evidence does not prove a valid new payload.

**Category:** INTEGRITY

## LOCAL_REPLACEMENT_PREVIOUS_VERSION_REQUIRED

An update workflow failed to preserve the current valid version until commit.

**Category:** INVARIANT

## LOCAL_REPLACEMENT_ALREADY_IN_PROGRESS

A conflicting local replacement is active.

**Category:** CONFLICT

---

# 40. Local Removal Errors

## LOCAL_REMOVAL_NOT_ALLOWED

Removal was requested from an invalid state.

**Category:** STATE

## LOCAL_REMOVAL_ALREADY_IN_PROGRESS

The item is already in `REMOVING`.

**Category:** CONFLICT

The request may be idempotent when it belongs to the same operation.

## LOCAL_REMOVAL_COMPLETION_NOT_CONFIRMED

Removal completion was requested without evidence that local membership and payload were handled.

**Category:** ELIGIBILITY

## LOCAL_REMOVAL_SERVER_MUTATION_PROHIBITED

A local removal operation attempted to mutate server authority.

**Category:** INVARIANT

## LOCAL_REMOVAL_PERSONAL_STATE_MUTATION_PROHIBITED

A local source-payload removal attempted to delete personal state.

**Category:** INVARIANT

---

# 41. Metadata Snapshot Errors

## METADATA_SNAPSHOT_CONTEXT_MISMATCH

The snapshot belongs to another ServerId, MasterLibraryId or PublicationId.

**Category:** INVARIANT

## METADATA_SNAPSHOT_REVISION_INVALID

The captured CatalogRevision is invalid.

**Category:** VALUE

## METADATA_SNAPSHOT_TIMESTAMP_INVALID

The captured time is invalid.

**Category:** VALUE

## METADATA_SNAPSHOT_PERSONAL_STATE_PROHIBITED

The snapshot contains personal-state fields.

**Category:** INVARIANT

---

# 42. Rehydration Errors

## MASTER_LIBRARY_REHYDRATION_FAILED

Persisted MasterLibrary state violates Domain invariants.

**Category:** REHYDRATION

## PUBLICATION_REHYDRATION_FAILED

Persisted Publication state violates Domain invariants.

**Category:** REHYDRATION

## SOURCE_PUBLICATION_REHYDRATION_FAILED

Persisted SourcePublication state is invalid.

**Category:** REHYDRATION

## ACQUISITION_REHYDRATION_FAILED

Persisted AcquisitionOperation state is invalid.

**Category:** REHYDRATION

## ACQUISITION_ATTEMPT_REHYDRATION_FAILED

Persisted Attempt state is invalid.

**Category:** REHYDRATION

## LOCAL_LIBRARY_ITEM_REHYDRATION_FAILED

Persisted LocalLibraryItem state is invalid.

**Category:** REHYDRATION

## PERSISTED_STATE_COMBINATION_INVALID

Several persisted fields form an impossible Domain combination.

Examples:

```text
AcquisitionState = COMPLETED
completedAt = null
```

```text
LocalAvailability = AVAILABLE_LOCAL
LocalIntegrityState = MISSING
```

**Category:** REHYDRATION

## UNKNOWN_PERSISTED_STATE

Persistence contains an unsupported state representation.

**Category:** COMPATIBILITY

Unknown states shall not map silently to success.

---

# 43. Domain Invariant Errors

## INVARIANT_VIOLATION

A general Domain invariant was violated and no more specific code exists.

**Category:** INVARIANT

This error should be rare.

Specific errors are preferred.

## AGGREGATE_IDENTITY_MISMATCH

An owned entity or operation references another aggregate identity.

**Category:** INVARIANT

## OWNED_ENTITY_NOT_FOUND

An aggregate behavior referenced an owned entity that does not exist.

**Category:** INVARIANT

## OWNED_ENTITY_ALREADY_EXISTS

An aggregate attempted to add an owned entity with duplicate identity.

**Category:** CONFLICT

## TERMINAL_STATE_MUTATION_PROHIBITED

An operation attempted to mutate a terminal aggregate or entity.

**Category:** STATE

## REQUIRED_DOMAIN_EVIDENCE_MISSING

A transition lacked required verified facts.

**Category:** ELIGIBILITY

## DOMAIN_EVENT_STATE_MISMATCH

An event was constructed that does not correspond to the aggregate's completed state.

**Category:** INVARIANT

---

# 44. Domain Policy Errors

## PUBLICATION_VERSION_POLICY_VIOLATION

The requested version behavior violates PublicationVersionPolicy.

**Category:** VERSION

## PUBLICATION_AVAILABILITY_POLICY_VIOLATION

The requested availability behavior violates PublicationAvailabilityPolicy.

**Category:** STATE

## CATALOG_REVISION_POLICY_VIOLATION

A CatalogRevision mutation violates CatalogRevisionPolicy.

**Category:** INVARIANT

## ACQUISITION_TRANSITION_POLICY_VIOLATION

The requested acquisition transition violates AcquisitionTransitionPolicy.

**Category:** STATE

## ACQUISITION_RESUME_POLICY_VIOLATION

The requested resume behavior violates AcquisitionResumePolicy.

**Category:** ELIGIBILITY

## LOCAL_INSTALLATION_POLICY_VIOLATION

The requested local-installation behavior violates LocalInstallationPolicy.

**Category:** INVARIANT

## DUPLICATE_PUBLICATION_POLICY_REQUIRES_DECISION

DuplicatePublicationPolicy cannot resolve the candidate automatically.

**Category:** CONFLICT

---

# 45. Domain Error Details

Domain error details may contain safe values such as:

```text
aggregateId
currentState
requestedState
PublicationId
SourceVersion
expectedChecksum
actualChecksum
expectedByteLength
actualByteLength
```

Details shall not contain:

* raw physical paths;
* credentials;
* tokens;
* stack traces;
* SQL;
* personal-state content.

Checksums may be logged or transported only according to the approved integrity and security policy.

---

# 46. Domain Error Retry Semantics

Retryability is usually decided by the Application layer.

However, Domain errors can establish a baseline.

## Normally Not Retryable Without Input Change

```text
INVALID_PUBLICATION_TITLE
INVALID_SOURCE_VERSION
INVALID_ACQUISITION_TRANSITION
PERSONAL_STATE_FIELD_PROHIBITED
```

## Retryable After State Refresh

```text
RECORD_VERSION_CONFLICT
ACQUISITION_ATTEMPT_ALREADY_ACTIVE
LOCAL_REPLACEMENT_ALREADY_IN_PROGRESS
```

## Retryable After New Verified Evidence

```text
PUBLICATION_RESTORATION_EVIDENCE_REQUIRED
LOCAL_VALIDATION_EVIDENCE_REQUIRED
ACQUISITION_COMPLETION_EVIDENCE_INVALID
```

## Requires Explicit Decision

```text
AMBIGUOUS_PUBLICATION_IDENTITY
DUPLICATE_PUBLICATION_POLICY_REQUIRES_DECISION
```

## Requires Recovery

```text
ACQUISITION_RECOVERY_OUTCOME_AMBIGUOUS
LOCAL_PUBLICATION_RECOVERY_REQUIRED
PERSISTED_STATE_COMBINATION_INVALID
```

---

# 47. Mapping to Module Error Registry

Domain errors shall map to stable module-level errors.

Examples:

| Domain Error                          | Module Error                                                            |
| ------------------------------------- | ----------------------------------------------------------------------- |
| INVALID_PUBLICATION_ID                | INVALID_IDENTIFIER                                                      |
| INVALID_PUBLICATION_TITLE             | INVALID_SOURCE_METADATA                                                 |
| PUBLICATION_NOT_ACQUIRABLE            | PUBLICATION_UNAVAILABLE, PUBLICATION_WITHDRAWN or PUBLICATION_CORRUPTED |
| SOURCE_VERSION_NOT_FOUND              | SOURCE_VERSION_NOT_FOUND                                                |
| CHECKSUM_MISMATCH                     | CHECKSUM_MISMATCH                                                       |
| BYTE_LENGTH_MISMATCH                  | BYTE_LENGTH_MISMATCH                                                    |
| INVALID_ACQUISITION_TRANSITION        | ACQUISITION_STATE_INVALID                                               |
| ACQUISITION_ATTEMPT_ALREADY_ACTIVE    | ACQUISITION_ALREADY_ACTIVE                                              |
| ACQUISITION_RESUME_CHECKPOINT_INVALID | ACQUISITION_RESUME_INVALID                                              |
| LOCAL_PUBLICATION_MISSING             | LOCAL_PUBLICATION_MISSING                                               |
| LOCAL_PUBLICATION_CORRUPTED           | LOCAL_PUBLICATION_CORRUPTED                                             |
| MASTER_LIBRARY_FORMAT_UNSUPPORTED     | MASTER_LIBRARY_VERSION_UNSUPPORTED                                      |
| RECORD_VERSION_CONFLICT               | PUBLICATION_MUTATION_CONFLICT or equivalent                             |
| PERSONAL_STATE_FIELD_PROHIBITED       | VALIDATION_ERROR                                                        |

Mapping may depend on operation context.

---

# 48. Mapping Ownership

The Application layer owns mapping from:

```text
DomainError
→
ApplicationError
→
ModuleError
```

The Domain shall not know:

* HTTP status;
* public user message;
* NestJS exception;
* Swift error presentation.

---

# 49. HTTP Mapping Exclusion

This document does not assign HTTP status directly.

Examples:

```text
PUBLICATION_NOT_ACQUIRABLE
```

may map to:

* `409 Conflict`;
* `410 Gone`;
* `503 Service Unavailable`;

depending on the actual publication state.

That decision belongs to Application and Transport mapping.

---

# 50. Client Domain Errors

The Swift client shall implement semantically equivalent Domain errors for:

* invalid identifiers;
* invalid transport-to-Domain mapping;
* invalid acquisition transition;
* invalid Attempt transition;
* invalid local integrity combination;
* invalid local installation evidence;
* invalid recovery evidence.

Swift error type names may differ.

Stable semantic codes shall remain aligned.

---

# 51. Cross-Language Error Compatibility

The shared error registry shall distinguish:

```text
Domain-internal codes
Module transport codes
Client feature codes
```

Not every internal Domain error must become a unique public transport error.

However:

* public error mappings shall be deterministic;
* tests shall cover the mapping;
* unknown public codes shall be handled safely;
* Domain codes shall remain traceable.

---

# 52. Domain Error Event Behavior

A rejected Domain operation shall not emit a success Domain event.

Examples:

```text
activate source rejected
→ no SourceVersionActivated event
```

```text
complete acquisition rejected
→ no AcquisitionCompleted event
```

The application may emit diagnostic failure evidence separately.

---

# 53. Atomic Mutation on Error

If a Domain method fails:

* aggregate state shall remain unchanged;
* no partial collection mutation shall remain;
* no timestamp shall advance;
* no success event shall be appended.

Mutation methods should validate preconditions before modifying state.

---

# 54. Error Construction

Domain errors should be created through centralized factories or static constructors.

Conceptually:

```text
DomainErrors.invalidTransition(...)
DomainErrors.invalidChecksum(...)
DomainErrors.publicationNotAcquirable(...)
```

This reduces:

* inconsistent messages;
* duplicated codes;
* missing context;
* unstable semantics.

---

# 55. Error Messages

Internal Domain messages shall be:

* concise;
* deterministic;
* safe;
* suitable for logs;
* independent from final localization.

Example:

```text
Cannot transition AcquisitionOperation from DOWNLOADING to COMPLETED.
```

The final user-facing message belongs to the client error translation layer.

---

# 56. Domain Error Persistence

Long-lived aggregate failures may persist stable error codes.

Examples:

* acquisition failure;
* recovery-required reason;
* local-integrity reason;
* publication-availability reason.

Persistence shall store:

```text
errorCode
occurredAt
safe context
```

It shall not store full exception objects.

---

# 57. Availability Reason Versus Error

A current Domain state reason is not always an active error.

Example:

```text
PublicationAvailability = WITHDRAWN
reason = ADMINISTRATIVE_WITHDRAWAL
```

This is a Domain fact.

A failed attempt to acquire it produces:

```text
PUBLICATION_NOT_ACQUIRABLE
```

The two concepts shall remain separate.

---

# 58. Cancellation Versus Error

Acquisition cancellation is a terminal outcome, not inherently an error.

The Domain may use a cancellation reason but shall not classify ordinary user cancellation as an invariant failure.

Cleanup failure after cancellation is a separate Application or Infrastructure error.

---

# 59. Recovery-Required Versus Error

`RECOVERY_REQUIRED` is a Domain state.

The transition into it may carry an error such as:

```text
ACQUISITION_RECOVERY_OUTCOME_AMBIGUOUS
```

Recovery-required shall not be collapsed into ordinary `FAILED`.

---

# 60. Rehydration Failure Handling

When persistence rehydration returns a Domain error:

* the invalid aggregate shall not enter normal operation;
* the repository shall propagate a persistence-integrity failure;
* recovery or quarantine policy shall decide the next action;
* the application shall not silently fill missing values;
* the system shall not mark invalid data successful.

---

# 61. Unknown State Handling

Unknown persisted or transported Domain state shall produce:

```text
UNKNOWN_PERSISTED_STATE
```

or a compatibility-specific equivalent.

It shall not default to:

* `AVAILABLE`;
* `COMPLETED`;
* `VALID`;
* `AUTHENTICATED`.

The safe fallback is non-operational.

---

# 62. Domain Error Testing Requirements

Every Domain error shall have tests for:

* triggering condition;
* stable code;
* category;
* safe details;
* aggregate state preservation;
* absence of success events;
* application mapping where public;
* cross-language compatibility where relevant.

---

# 63. Value Object Error Tests

Required tests include:

```text
invalid identifiers
invalid SourceVersion
invalid CatalogRevision
invalid checksum
invalid ByteLength
invalid endpoint
invalid StorageReference
invalid title
invalid language
invalid publication date
invalid media type
```

---

# 64. MasterLibrary Error Tests

Required tests include:

```text
unsupported format
invalid state transition
available without validated structure
CatalogRevision decrease
CatalogRevision misuse
identity mutation
invalid rehydration
```

---

# 65. Publication Error Tests

Required tests include:

```text
duplicate SourceVersion
activate missing source
activate invalid source
available without valid source
invalid availability transition
restore without evidence
withdrawal behavior
personal-state rejection
source-byte change without version
```

---

# 66. Acquisition Error Tests

Required tests include:

```text
invalid state transition
duplicate active Attempt
Attempt ID reuse
progress decrease
progress overflow
transfer length mismatch
checksum mismatch
installation without evidence
completion without LocalLibraryItem
retry from non-retryable state
resume context mismatch
cancellation from invalid state
recovery ambiguity
```

---

# 67. LocalLibraryItem Error Tests

Required tests include:

```text
creation without installation evidence
available with invalid integrity
missing-payload transition
checksum mismatch
invalid version replacement
context mismatch
removal from invalid state
server mutation prohibition
personal-state deletion prohibition
invalid rehydration
```

---

# 68. Mapping Tests

Application mapping tests shall verify:

```text
Domain code
→ module error code
→ retryability
→ transport mapping
→ client translation
```

Examples:

```text
INVALID_ACQUISITION_TRANSITION
→ ACQUISITION_STATE_INVALID
```

```text
ACQUISITION_RESUME_CHECKPOINT_INVALID
→ ACQUISITION_RESUME_INVALID
```

```text
PUBLICATION_RESTORATION_EVIDENCE_REQUIRED
→ PUBLICATION_UNAVAILABLE or integrity error
```

---

# 69. Domain Error Registry

The implementation shall maintain a centralized Domain error registry or typed definition containing:

```text
code
category
default internal message
safe-detail schema
module mapping
```

Scattered literal error strings are prohibited.

---

# 70. Error Registry Separation

The repository should distinguish:

```text
packages/server-domain/
    Domain error definitions

packages/error-registry/
    public module error definitions and mappings
```

or an equivalent clear structure.

The Domain package shall not depend on Transport.

---

# 71. Error Evolution

A Domain error code may be added when:

* a distinct invariant exists;
* callers require different handling;
* tests require clearer classification;
* the previous generic code is insufficient.

Existing code meaning shall not change silently.

Deprecated codes shall remain traceable through migration or compatibility policy.

---

# 72. Error Completion Gate

The Domain error design is complete when:

```text
[ ] Error ownership is explicit
[ ] Categories are explicit
[ ] Identifier errors are defined
[ ] Version and revision errors are defined
[ ] Integrity errors are defined
[ ] Metadata errors are defined
[ ] MasterLibrary errors are defined
[ ] Publication errors are defined
[ ] SourcePublication errors are defined
[ ] Acquisition errors are defined
[ ] Attempt errors are defined
[ ] Resume errors are defined
[ ] Recovery errors are defined
[ ] LocalLibraryItem errors are defined
[ ] Rehydration errors are defined
[ ] Policy errors are defined
[ ] Mapping boundaries are explicit
[ ] Retry semantics are explicit
[ ] Mutation atomicity is explicit
[ ] Testing obligations are explicit
[ ] Personal-state protection is explicit
[ ] No architectural contradiction remains
```

---

# 73. Domain Error Invariants

The following invariants apply:

* Domain errors express Domain meaning.
* Raw infrastructure errors do not become Domain codes directly.
* Stable codes have one meaning.
* Rejected mutations leave aggregate state unchanged.
* Rejected mutations emit no success events.
* Invalid rehydration never enters normal operation.
* Unknown states never map to success.
* Cancellation remains distinct from failure.
* Recovery-required remains distinct from failure.
* Publication availability errors remain independent from local availability.
* Local errors never mutate NAS authority.
* Personal-state fields are rejected.
* Domain errors do not contain physical paths, secrets or stack traces.
* Public transport mapping belongs outside the Domain.

---

# 74. Prohibited Domain Error Designs

The Domain shall not:

* throw raw database errors;
* throw raw filesystem errors;
* expose HTTP status codes;
* use one generic error for every invariant;
* use unstable human-readable messages as identifiers;
* mutate aggregate state before completing validation;
* emit success events after a failed mutation;
* map unknown state to a successful state;
* treat checksum mismatch as a warning;
* treat recovery-required as ordinary failure;
* treat cancellation as corruption;
* include raw NAS paths in error details;
* include credentials or tokens;
* define personal-state error behavior inside this module beyond rejecting prohibited fields.

---

# 75. Related Documents

## Domain

* `README.md`
* `DomainModel.md`
* `Entities.md`
* `ValueObjects.md`
* `States.md`

## Technical Design

* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`

## Future Contracts and Testing

* `../04-Contracts/ErrorContracts.md`
* `../08-Testing/DomainTests.md`
* `../08-Testing/ContractTests.md`

---

# 76. Status

**Approved**

The Domain-owned error model of the Master Library Module is defined.

The complete Domain documentation area is now:

```text
03-Domain/
├── README.md          ✅
├── DomainModel.md     ✅
├── Entities.md        ✅
├── ValueObjects.md    ✅
├── States.md          ✅
└── Errors.md          ✅
```

The Master Library Domain area is complete.

The next implementation block is:

```text
01-MasterLibrary/04-Contracts/README.md
```

It shall establish the versioned server-client contract area, including API conventions, DTO ownership, error envelopes, authentication contracts, pagination and publication acquisition.
