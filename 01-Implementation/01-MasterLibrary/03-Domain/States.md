

# Master Library States

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Domain

**Document:** States

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the lifecycle states and valid state transitions of the Master Library Module.

It establishes the state models for:

* Master Library lifecycle;
* publication availability;
* source integrity;
* acquisition operations;
* acquisition attempts;
* local publication availability;
* local publication integrity;
* server trust;
* connectivity;
* authentication;
* recovery.

The purpose is to ensure that state transitions remain:

* explicit;
* deterministic;
* validated;
* observable;
* recoverable;
* consistent across server and client implementations.

---

# 2. Scope

This document defines Domain and client-semantic states.

It does not define:

* database status columns directly;
* HTTP status codes;
* UI colors;
* operating-system process states;
* background-job scheduler internals;
* personal-state synchronization;
* annotation lifecycle;
* reading-progress lifecycle.

Persistence and transport representations shall map to the states defined here.

---

# 3. Core State Principle

> Every state transition shall represent a validated Domain fact, not merely the completion of an infrastructure call.

Examples:

```text
Download task finished
≠
Acquisition completed
```

```text
File exists
≠
Publication is valid locally
```

```text
Server process is running
≠
Master Library is available
```

---

# 4. State Model Rules

Every state model shall define:

* valid states;
* initial state;
* terminal states;
* recoverable states;
* allowed transitions;
* prohibited transitions;
* transition preconditions;
* transition effects;
* error behavior.

A state shall never be changed through uncontrolled property mutation.

---

# 5. Transition Authority

State transitions shall occur only through:

* aggregate behavior;
* Domain policy;
* application workflow;
* validated recovery process.

Infrastructure adapters may report facts.

They shall not decide Domain transitions independently.

---

# 6. Master Library State Model

The Master Library uses:

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

# 7. INITIALIZING

## Meaning

The Master Library is being created.

## Allowed Capabilities

* initialization;
* structural creation;
* schema creation;
* manifest creation;
* validation;
* rollback or cleanup.

## Prohibited Capabilities

* catalog browsing;
* publication acquisition;
* publication registration by ordinary flows;
* healthy readiness.

## Exit Transitions

```text
INITIALIZING → AVAILABLE
INITIALIZING → INVALID
INITIALIZING → UNAVAILABLE
```

---

# 8. AVAILABLE

## Meaning

The Master Library is valid and can serve required operations.

## Required Conditions

```text
manifest valid
catalog available
required storage accessible
format supported
required permissions present
startup recovery complete
```

## Allowed Capabilities

* catalog browsing;
* catalog search;
* publication details;
* publication acquisition;
* authorized publication administration;
* integrity validation;
* backup coordination.

## Exit Transitions

```text
AVAILABLE → DEGRADED
AVAILABLE → UNAVAILABLE
AVAILABLE → MAINTENANCE
AVAILABLE → INVALID
AVAILABLE → UNSUPPORTED
```

The final two transitions require serious compatibility or integrity evidence.

---

# 9. DEGRADED

## Meaning

The Library remains partially usable, but one or more capabilities are impaired.

Examples:

* cover storage unavailable;
* non-critical diagnostics unavailable;
* full integrity scan pending;
* one publication source unavailable;
* non-critical background cleanup failed.

## Rule

Degraded state shall not conceal a failure that makes catalog or acquisition unsafe.

## Allowed Transitions

```text
DEGRADED → AVAILABLE
DEGRADED → UNAVAILABLE
DEGRADED → MAINTENANCE
DEGRADED → INVALID
```

---

# 10. UNAVAILABLE

## Meaning

The Library cannot currently provide required operations safely.

Examples:

* storage disconnected;
* catalog database inaccessible;
* required permissions missing;
* mandatory dependency unavailable.

## Behavior

* health shall report unavailability;
* catalog and acquisition shall not return false success;
* no authoritative data shall be silently deleted;
* retry may be possible.

## Allowed Transitions

```text
UNAVAILABLE → AVAILABLE
UNAVAILABLE → DEGRADED
UNAVAILABLE → MAINTENANCE
UNAVAILABLE → INVALID
```

---

# 11. MAINTENANCE

## Meaning

The Library is intentionally restricted for an operational activity.

Examples:

* schema migration;
* restore;
* full integrity validation;
* backup checkpoint;
* repair.

## Behavior

Allowed Reader operations depend on maintenance policy.

Mutable administrative operations shall be restricted unless part of the maintenance workflow.

## Allowed Transitions

```text
AVAILABLE → MAINTENANCE
DEGRADED → MAINTENANCE
UNAVAILABLE → MAINTENANCE

MAINTENANCE → AVAILABLE
MAINTENANCE → DEGRADED
MAINTENANCE → UNAVAILABLE
MAINTENANCE → INVALID
```

---

# 12. INVALID

## Meaning

The Master Library violates required structural or integrity invariants.

Examples:

* invalid manifest identity;
* inconsistent format;
* unrecoverable catalog-source mismatch;
* malformed persisted authoritative state.

## Behavior

The Library shall not become available without explicit repair and validation.

## Allowed Transitions

```text
INVALID → MAINTENANCE
INVALID → AVAILABLE
INVALID → UNAVAILABLE
```

`INVALID → AVAILABLE` requires successful governed recovery and complete validation.

---

# 13. UNSUPPORTED

## Meaning

The runtime cannot safely interpret the Master Library format or schema.

Examples:

* Library format newer than supported;
* incompatible major format;
* unsupported schema without migration path.

## Behavior

* no silent migration;
* no ordinary mutation;
* no healthy readiness;
* explicit compatibility error.

## Allowed Transitions

```text
UNSUPPORTED → MAINTENANCE
UNSUPPORTED → AVAILABLE
```

The second transition requires a compatible runtime or approved migration.

---

# 14. Master Library Transition Matrix

| From         | To           |     Allowed | Required Evidence                      |
| ------------ | ------------ | ----------: | -------------------------------------- |
| INITIALIZING | AVAILABLE    |         Yes | Complete initialization and validation |
| INITIALIZING | INVALID      |         Yes | Failed structural validation           |
| AVAILABLE    | DEGRADED     |         Yes | Partial capability impairment          |
| AVAILABLE    | UNAVAILABLE  |         Yes | Required capability lost               |
| AVAILABLE    | MAINTENANCE  |         Yes | Authorized maintenance                 |
| DEGRADED     | AVAILABLE    |         Yes | Impairment resolved                    |
| DEGRADED     | UNAVAILABLE  |         Yes | Required capability lost               |
| UNAVAILABLE  | AVAILABLE    |         Yes | Required capabilities restored         |
| MAINTENANCE  | AVAILABLE    |         Yes | Maintenance completed successfully     |
| INVALID      | AVAILABLE    | Conditional | Governed repair and full validation    |
| UNSUPPORTED  | AVAILABLE    | Conditional | Compatible runtime or migration        |
| AVAILABLE    | INITIALIZING |          No | Identity cannot be reinitialized       |
| INVALID      | INITIALIZING |          No | Repair is not initialization           |

---

# 15. Publication Availability State Model

The Publication aggregate uses:

```text
AVAILABLE
UNAVAILABLE
WITHDRAWN
CORRUPTED
```

---

# 16. Publication AVAILABLE

## Meaning

The publication may be acquired.

## Required Conditions

```text
current SourceVersion exists
current source committed
current source integrity VALID
source readable
publication not withdrawn
```

## Allowed Transitions

```text
AVAILABLE → UNAVAILABLE
AVAILABLE → WITHDRAWN
AVAILABLE → CORRUPTED
```

---

# 17. Publication UNAVAILABLE

## Meaning

The publication remains part of the Master Catalog but cannot currently be acquired.

Examples:

* source temporarily inaccessible;
* administrative pause;
* maintenance;
* unresolved non-corruption storage issue.

## Local Impact

Existing local copies remain unchanged.

## Allowed Transitions

```text
UNAVAILABLE → AVAILABLE
UNAVAILABLE → WITHDRAWN
UNAVAILABLE → CORRUPTED
```

---

# 18. Publication WITHDRAWN

## Meaning

The publication is intentionally no longer offered for new acquisition.

## Behavior

* historical identity remains;
* Master Catalog policy determines visibility;
* acquisition is rejected;
* existing local copies remain untouched.

## Allowed Transitions

```text
WITHDRAWN → AVAILABLE
WITHDRAWN → UNAVAILABLE
```

Restoration requires explicit administrator action.

It shall not occur automatically.

---

# 19. Publication CORRUPTED

## Meaning

The authoritative current source failed integrity validation.

## Behavior

* acquisition is rejected;
* administrative remediation is required;
* existing valid local copies remain independent.

## Allowed Transitions

```text
CORRUPTED → AVAILABLE
CORRUPTED → UNAVAILABLE
CORRUPTED → WITHDRAWN
```

`CORRUPTED → AVAILABLE` requires verified source integrity.

---

# 20. Publication Availability Transition Matrix

| From        | To          |     Allowed | Required Evidence                            |
| ----------- | ----------- | ----------: | -------------------------------------------- |
| AVAILABLE   | UNAVAILABLE |         Yes | Temporary unavailability reason              |
| AVAILABLE   | WITHDRAWN   |         Yes | Authorized withdrawal                        |
| AVAILABLE   | CORRUPTED   |         Yes | Integrity failure                            |
| UNAVAILABLE | AVAILABLE   |         Yes | Valid current source confirmed               |
| UNAVAILABLE | WITHDRAWN   |         Yes | Authorized withdrawal                        |
| UNAVAILABLE | CORRUPTED   |         Yes | Integrity failure                            |
| WITHDRAWN   | AVAILABLE   | Conditional | Explicit restoration and valid source        |
| WITHDRAWN   | UNAVAILABLE |         Yes | Restored catalog presence but not acquirable |
| CORRUPTED   | AVAILABLE   | Conditional | Full source validation passed                |
| CORRUPTED   | WITHDRAWN   |         Yes | Authorized withdrawal                        |

---

# 21. Prohibited Publication Transitions

The following are prohibited without validated intermediate behavior:

```text
CORRUPTED → AVAILABLE without integrity validation
WITHDRAWN → AVAILABLE automatically
UNAVAILABLE → AVAILABLE without current valid source
AVAILABLE → AVAILABLE as a substitute for a metadata mutation
```

Idempotent requests may produce no state change.

---

# 22. Source Integrity State Model

A SourcePublication uses:

```text
PENDING
VALID
MISSING
CORRUPTED
UNREADABLE
QUARANTINED
```

---

# 23. Source PENDING

## Meaning

The source has not yet completed validation and commit.

## Behavior

* not Reader-visible;
* not acquirable;
* may reside in staging;
* may be rejected or committed.

## Allowed Transitions

```text
PENDING → VALID
PENDING → CORRUPTED
PENDING → UNREADABLE
PENDING → QUARANTINED
```

---

# 24. Source VALID

## Meaning

The source is committed and its integrity evidence is valid.

## Behavior

It may support publication `AVAILABLE` state.

## Allowed Transitions

```text
VALID → MISSING
VALID → CORRUPTED
VALID → UNREADABLE
VALID → QUARANTINED
```

---

# 25. Source MISSING

## Meaning

The persisted source record exists but the expected payload is absent.

## Behavior

* not deliverable;
* publication cannot remain safely available;
* recovery or restore required.

## Allowed Transitions

```text
MISSING → VALID
MISSING → QUARANTINED
```

Return to valid requires payload restoration and verification.

---

# 26. Source CORRUPTED

## Meaning

The source payload does not match authoritative integrity metadata or is structurally invalid.

## Behavior

* not deliverable;
* may be moved to quarantine;
* publication shall be non-acquirable.

## Allowed Transitions

```text
CORRUPTED → VALID
CORRUPTED → QUARANTINED
```

---

# 27. Source UNREADABLE

## Meaning

The payload exists but cannot be read because of permissions or I/O failure.

## Behavior

The state may be transient.

## Allowed Transitions

```text
UNREADABLE → VALID
UNREADABLE → MISSING
UNREADABLE → CORRUPTED
UNREADABLE → QUARANTINED
```

---

# 28. Source QUARANTINED

## Meaning

The source has been isolated from normal storage and delivery.

## Behavior

* never acquirable;
* excluded from ordinary Reader flows;
* retained for diagnosis or repair.

## Allowed Transitions

```text
QUARANTINED → VALID
```

Restoration requires explicit validation and commit.

---

# 29. Source Integrity Matrix

| From        | To          |     Allowed | Required Evidence                      |
| ----------- | ----------- | ----------: | -------------------------------------- |
| PENDING     | VALID       |         Yes | Validation and commit                  |
| PENDING     | QUARANTINED |         Yes | Rejected source                        |
| VALID       | MISSING     |         Yes | Payload absent                         |
| VALID       | CORRUPTED   |         Yes | Integrity mismatch                     |
| VALID       | UNREADABLE  |         Yes | Read failure                           |
| MISSING     | VALID       | Conditional | Restore and verification               |
| CORRUPTED   | VALID       | Conditional | Repaired payload and full verification |
| UNREADABLE  | VALID       | Conditional | Access restored and verification       |
| QUARANTINED | VALID       | Conditional | Governed restoration                   |

---

# 30. Acquisition State Model

An AcquisitionOperation uses:

```text
CREATED
QUEUED
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

# 31. Acquisition CREATED

## Meaning

The logical acquisition exists but has not entered the queue.

## Required Data

* operation identity;
* server context;
* MasterLibraryId;
* PublicationId;
* SourceVersion;
* expected ByteLength;
* expected Checksum.

## Allowed Transitions

```text
CREATED → QUEUED
CREATED → CANCELLED
CREATED → FAILED
```

---

# 32. Acquisition QUEUED

## Meaning

The operation awaits an execution slot.

## Behavior

No network transfer is active.

## Allowed Transitions

```text
QUEUED → DOWNLOADING
QUEUED → CANCELLED
QUEUED → FAILED
```

---

# 33. Acquisition DOWNLOADING

## Meaning

One AcquisitionAttempt is actively transferring source bytes.

## Required Conditions

```text
current Attempt exists
only one Attempt active
staging destination exists
target SourceVersion fixed
```

## Allowed Transitions

```text
DOWNLOADING → VALIDATING
DOWNLOADING → PAUSED
DOWNLOADING → FAILED
DOWNLOADING → CANCELLED
DOWNLOADING → RECOVERY_REQUIRED
```

---

# 34. Acquisition PAUSED

## Meaning

The operation is intentionally suspended and may resume safely.

This state exists only when resume support is enabled.

## Required Conditions

* valid partial payload;
* valid checkpoint;
* no active network transfer;
* resume eligibility not yet invalidated.

## Allowed Transitions

```text
PAUSED → DOWNLOADING
PAUSED → CANCELLED
PAUSED → FAILED
PAUSED → RECOVERY_REQUIRED
```

---

# 35. Acquisition VALIDATING

## Meaning

The transfer is complete and local integrity validation is in progress.

## Required Conditions

* staging payload closed;
* actual byte length known;
* no network transfer active.

## Allowed Transitions

```text
VALIDATING → INSTALLING
VALIDATING → FAILED
VALIDATING → CANCELLED
VALIDATING → RECOVERY_REQUIRED
```

Cancellation during validation may be supported if cleanup remains safe.

---

# 36. Acquisition INSTALLING

## Meaning

A validated payload is being committed into the Selective Local Library.

## Required Conditions

```text
byte length verified
checksum verified
SourceVersion verified
final destination determined
```

## Allowed Transitions

```text
INSTALLING → COMPLETED
INSTALLING → FAILED
INSTALLING → RECOVERY_REQUIRED
```

Ordinary cancellation is not recommended after the final commit begins.

---

# 37. Acquisition COMPLETED

## Meaning

The exact requested source version is validly installed locally.

## Required Conditions

```text
final payload committed
LocalLibraryItem committed
installed SourceVersion matches
ByteLength matches
Checksum matches
```

## Behavior

`COMPLETED` is terminal.

No further Attempt may start for the same operation.

---

# 38. Acquisition FAILED

## Meaning

The operation reached a known safe failure state.

## Behavior

* no ambiguous commit remains;
* local availability was not falsely created;
* retry may be allowed;
* failure classification is persisted.

## Allowed Transitions

```text
FAILED → QUEUED
FAILED → DOWNLOADING
FAILED → CANCELLED
FAILED → RECOVERY_REQUIRED
```

The selected retry path depends on implementation.

A new Attempt is mandatory.

---

# 39. Acquisition CANCELLED

## Meaning

The logical operation was intentionally stopped.

## Behavior

* no active Attempt;
* no false local availability;
* temporary data handled by cleanup policy;
* cancellation is distinct from failure.

`CANCELLED` is terminal for the operation.

A later user action creates a new acquisition operation.

---

# 40. Acquisition RECOVERY_REQUIRED

## Meaning

The operation ended in an ambiguous cross-resource state.

Examples:

* final file exists but local database outcome is unknown;
* installation marker exists with inconsistent records;
* staging and persisted checkpoint disagree;
* recovery was interrupted.

## Allowed Transitions

```text
RECOVERY_REQUIRED → COMPLETED
RECOVERY_REQUIRED → FAILED
RECOVERY_REQUIRED → QUEUED
RECOVERY_REQUIRED → CANCELLED
```

Every transition requires a reconciliation decision.

---

# 41. Acquisition Main Transition Diagram

```text
CREATED
   ↓
QUEUED
   ↓
DOWNLOADING
   ↓
VALIDATING
   ↓
INSTALLING
   ↓
COMPLETED
```

Alternate paths:

```text
DOWNLOADING → PAUSED → DOWNLOADING

CREATED
QUEUED
DOWNLOADING
VALIDATING
INSTALLING
        └──→ FAILED

CREATED
QUEUED
DOWNLOADING
PAUSED
VALIDATING
        └──→ CANCELLED

DOWNLOADING
VALIDATING
INSTALLING
        └──→ RECOVERY_REQUIRED
```

---

# 42. Acquisition Transition Matrix

| From              | To                |     Allowed | Required Evidence                       |
| ----------------- | ----------------- | ----------: | --------------------------------------- |
| CREATED           | QUEUED            |         Yes | Valid persisted operation               |
| CREATED           | CANCELLED         |         Yes | User cancellation                       |
| QUEUED            | DOWNLOADING       |         Yes | New active Attempt                      |
| QUEUED            | CANCELLED         |         Yes | Cancellation                            |
| DOWNLOADING       | VALIDATING        |         Yes | Transfer completed and length available |
| DOWNLOADING       | PAUSED            | Conditional | Valid checkpoint and resume support     |
| DOWNLOADING       | FAILED            |         Yes | Known safe failure                      |
| DOWNLOADING       | CANCELLED         |         Yes | Transfer cancelled                      |
| DOWNLOADING       | RECOVERY_REQUIRED |         Yes | Ambiguous persisted state               |
| PAUSED            | DOWNLOADING       |         Yes | New Attempt and valid resume context    |
| PAUSED            | FAILED            |         Yes | Resume invalid or permanent failure     |
| VALIDATING        | INSTALLING        |         Yes | Length and checksum valid               |
| VALIDATING        | FAILED            |         Yes | Validation failed                       |
| INSTALLING        | COMPLETED         |         Yes | Installation evidence complete          |
| INSTALLING        | FAILED            |         Yes | Known safe installation failure         |
| INSTALLING        | RECOVERY_REQUIRED |         Yes | Ambiguous commit                        |
| FAILED            | QUEUED            |         Yes | Retry authorized                        |
| FAILED            | DOWNLOADING       | Conditional | New Attempt started directly            |
| RECOVERY_REQUIRED | COMPLETED         | Conditional | Recovery proves commit succeeded        |
| RECOVERY_REQUIRED | FAILED            | Conditional | Recovery proves safe failure            |

---

# 43. Prohibited Acquisition Transitions

```text
CREATED → COMPLETED
QUEUED → VALIDATING
DOWNLOADING → COMPLETED
VALIDATING → COMPLETED
FAILED → COMPLETED without a new execution or recovery
CANCELLED → DOWNLOADING
COMPLETED → any other state
INSTALLING → DOWNLOADING
```

---

# 44. Acquisition Attempt State Model

An AcquisitionAttempt uses:

```text
ACTIVE
SUCCEEDED
FAILED
CANCELLED
INTERRUPTED
```

---

# 45. Attempt ACTIVE

## Meaning

The Attempt is executing.

## Required Conditions

* start time exists;
* operation is in a compatible state;
* no terminal outcome exists.

## Allowed Transitions

```text
ACTIVE → SUCCEEDED
ACTIVE → FAILED
ACTIVE → CANCELLED
ACTIVE → INTERRUPTED
```

---

# 46. Attempt SUCCEEDED

## Meaning

The Attempt completed its intended execution phase successfully.

For transfer Attempts, this means transfer completion.

It does not mean the entire AcquisitionOperation completed.

This state is terminal.

---

# 47. Attempt FAILED

## Meaning

The Attempt ended with a known failure.

It may allow another Attempt.

This state is terminal.

---

# 48. Attempt CANCELLED

## Meaning

The Attempt stopped because cancellation was requested.

This state is terminal.

---

# 49. Attempt INTERRUPTED

## Meaning

The Attempt ended unexpectedly but may support retry or resume.

Examples:

* network loss;
* process termination;
* server restart.

This state is terminal.

---

# 50. Attempt Invariants

* An Attempt begins as `ACTIVE`.
* Only one terminal outcome may exist.
* A terminal Attempt never returns to `ACTIVE`.
* A new execution requires a new AcquisitionAttemptId.
* Attempt state does not replace AcquisitionOperation state.

---

# 51. Local Availability State Model

A LocalLibraryItem uses:

```text
AVAILABLE_LOCAL
MISSING
CORRUPTED
REMOVING
RECOVERY_REQUIRED
```

The absence of a LocalLibraryItem represents not installed.

---

# 52. Local AVAILABLE_LOCAL

## Meaning

The publication is validly installed and available on the device.

## Required Conditions

```text
final payload exists
local integrity VALID
installed SourceVersion valid
ByteLength matches
Checksum matches
```

## Allowed Transitions

```text
AVAILABLE_LOCAL → MISSING
AVAILABLE_LOCAL → CORRUPTED
AVAILABLE_LOCAL → REMOVING
AVAILABLE_LOCAL → RECOVERY_REQUIRED
```

A successful source-version replacement may remain `AVAILABLE_LOCAL` while updating its installed values atomically.

---

# 53. Local MISSING

## Meaning

The LocalLibraryItem exists, but the expected payload is absent.

## Behavior

* not safely openable;
* reacquisition may be offered;
* server authority remains unaffected.

## Allowed Transitions

```text
MISSING → AVAILABLE_LOCAL
MISSING → REMOVING
MISSING → RECOVERY_REQUIRED
```

Return to available requires restoration or reacquisition plus validation.

---

# 54. Local CORRUPTED

## Meaning

The local payload exists but cannot be trusted.

Examples:

* checksum mismatch;
* unreadable payload;
* invalid local format.

## Allowed Transitions

```text
CORRUPTED → AVAILABLE_LOCAL
CORRUPTED → REMOVING
CORRUPTED → RECOVERY_REQUIRED
```

---

# 55. Local REMOVING

## Meaning

Device-local removal is in progress.

## Behavior

The item remains persisted until removal outcome is known.

## Allowed Outcomes

```text
REMOVING → removed aggregate
REMOVING → RECOVERY_REQUIRED
REMOVING → AVAILABLE_LOCAL
REMOVING → MISSING
REMOVING → CORRUPTED
```

Rollback state depends on physical payload condition.

---

# 56. Local RECOVERY_REQUIRED

## Meaning

Filesystem and persistence state disagree or an installation/removal outcome is ambiguous.

## Allowed Transitions

```text
RECOVERY_REQUIRED → AVAILABLE_LOCAL
RECOVERY_REQUIRED → MISSING
RECOVERY_REQUIRED → CORRUPTED
RECOVERY_REQUIRED → REMOVING
RECOVERY_REQUIRED → removed aggregate
```

---

# 57. Local Availability Matrix

| From              | To                |     Allowed | Required Evidence                         |
| ----------------- | ----------------- | ----------: | ----------------------------------------- |
| AVAILABLE_LOCAL   | MISSING           |         Yes | Payload absent                            |
| AVAILABLE_LOCAL   | CORRUPTED         |         Yes | Integrity failure                         |
| AVAILABLE_LOCAL   | REMOVING          |         Yes | User-confirmed removal                    |
| AVAILABLE_LOCAL   | RECOVERY_REQUIRED |         Yes | Ambiguous local state                     |
| MISSING           | AVAILABLE_LOCAL   | Conditional | Valid restored payload                    |
| MISSING           | REMOVING          |         Yes | Cleanup                                   |
| CORRUPTED         | AVAILABLE_LOCAL   | Conditional | Reacquisition or repair                   |
| CORRUPTED         | REMOVING          |         Yes | Cleanup                                   |
| REMOVING          | removed           |         Yes | Physical and persistence cleanup complete |
| REMOVING          | RECOVERY_REQUIRED |         Yes | Ambiguous removal                         |
| RECOVERY_REQUIRED | AVAILABLE_LOCAL   | Conditional | Recovery validates payload                |
| RECOVERY_REQUIRED | removed           | Conditional | Recovery proves removal complete          |

---

# 58. Local Integrity State Model

A LocalLibraryItem also uses:

```text
UNKNOWN
VALID
MISSING
CHECKSUM_MISMATCH
UNREADABLE
RECOVERY_REQUIRED
```

---

# 59. Local Integrity UNKNOWN

## Meaning

Integrity has not yet been validated or the previous validation is not currently trusted.

## Behavior

An item with `UNKNOWN` integrity shall not automatically be treated as fully safe if the workflow requires validation.

Ordinary post-install state shall not remain unknown.

---

# 60. Local Integrity VALID

## Meaning

The local payload matches expected integrity evidence.

Required checks:

* payload exists;
* byte length matches;
* checksum matches;
* file is readable.

Only this state supports `AVAILABLE_LOCAL`.

---

# 61. Local Integrity MISSING

The expected local payload does not exist.

It maps to local availability `MISSING`.

---

# 62. Local Integrity CHECKSUM_MISMATCH

The payload checksum differs from the expected checksum.

It maps to local availability `CORRUPTED`.

---

# 63. Local Integrity UNREADABLE

The payload exists but cannot be read or opened.

It maps to local availability `CORRUPTED` unless a more specific availability state is added later.

---

# 64. Local Integrity RECOVERY_REQUIRED

The integrity state cannot be determined because local persistence and filesystem evidence disagree.

It maps to local availability `RECOVERY_REQUIRED`.

---

# 65. Local Availability and Integrity Compatibility

| Local Availability | Allowed Integrity                             |
| ------------------ | --------------------------------------------- |
| AVAILABLE_LOCAL    | VALID                                         |
| MISSING            | MISSING                                       |
| CORRUPTED          | CHECKSUM_MISMATCH, UNREADABLE                 |
| REMOVING           | VALID, MISSING, CHECKSUM_MISMATCH, UNREADABLE |
| RECOVERY_REQUIRED  | RECOVERY_REQUIRED, UNKNOWN                    |

Invalid combinations shall be rejected during creation and rehydration.

---

# 66. Server Trust State Model

The client uses:

```text
UNREGISTERED
PENDING_TRUST
TRUSTED
IDENTITY_MISMATCH
REVOKED
```

---

# 67. Trust UNREGISTERED

No server registration exists.

Allowed transition:

```text
UNREGISTERED → PENDING_TRUST
```

---

# 68. Trust PENDING_TRUST

The endpoint is known, but the user has not approved the presented identity.

Allowed transitions:

```text
PENDING_TRUST → TRUSTED
PENDING_TRUST → UNREGISTERED
PENDING_TRUST → IDENTITY_MISMATCH
```

Credentials shall not be sent before trust is established.

---

# 69. Trust TRUSTED

The presented identity matches the stored trusted identity.

Allowed transitions:

```text
TRUSTED → IDENTITY_MISMATCH
TRUSTED → REVOKED
TRUSTED → UNREGISTERED
```

---

# 70. Trust IDENTITY_MISMATCH

The endpoint presents a different ServerId, certificate fingerprint or governed trust identity.

Behavior:

* block credential transmission;
* block automatic authentication;
* show explicit warning;
* require manual trust resolution.

Allowed transitions:

```text
IDENTITY_MISMATCH → TRUSTED
IDENTITY_MISMATCH → REVOKED
IDENTITY_MISMATCH → UNREGISTERED
```

`IDENTITY_MISMATCH → TRUSTED` requires explicit re-trust.

---

# 71. Trust REVOKED

The registration or trust has been explicitly disabled.

Allowed transitions:

```text
REVOKED → PENDING_TRUST
REVOKED → UNREGISTERED
```

---

# 72. Connectivity State Model

The client uses:

```text
UNKNOWN
CONNECTING
ONLINE
OFFLINE
DEGRADED
IDENTITY_MISMATCH
```

---

# 73. Connectivity UNKNOWN

Connectivity has not yet been evaluated.

Allowed transitions:

```text
UNKNOWN → CONNECTING
UNKNOWN → OFFLINE
```

---

# 74. Connectivity CONNECTING

The client is attempting trust validation, authentication and health checks.

Allowed transitions:

```text
CONNECTING → ONLINE
CONNECTING → OFFLINE
CONNECTING → DEGRADED
CONNECTING → IDENTITY_MISMATCH
```

---

# 75. Connectivity ONLINE

## Meaning

* endpoint reachable;
* identity trusted;
* authentication valid;
* required server capabilities available.

Allowed transitions:

```text
ONLINE → OFFLINE
ONLINE → DEGRADED
ONLINE → CONNECTING
ONLINE → IDENTITY_MISMATCH
```

---

# 76. Connectivity OFFLINE

The server cannot currently be reached.

Behavior:

* local Library remains available;
* cached catalog may remain visible;
* remote acquisition disabled;
* no local deletion inferred.

Allowed transitions:

```text
OFFLINE → CONNECTING
OFFLINE → ONLINE
```

Ordinarily reconnect passes through `CONNECTING`.

---

# 77. Connectivity DEGRADED

The server is reachable but one or more required capabilities are unavailable.

Examples:

* Master Library unavailable;
* catalog unavailable;
* authentication service impaired;
* server maintenance mode.

Allowed transitions:

```text
DEGRADED → ONLINE
DEGRADED → OFFLINE
DEGRADED → CONNECTING
DEGRADED → IDENTITY_MISMATCH
```

---

# 78. Connectivity IDENTITY_MISMATCH

Connectivity is blocked by server trust failure.

This mirrors the trust state but exists in the connection model for UI and workflow control.

Allowed transition requires trust resolution.

---

# 79. Authentication State Model

The client uses:

```text
UNAUTHENTICATED
AUTHENTICATING
AUTHENTICATED
EXPIRED
REVOKED
FAILED
```

---

# 80. Authentication UNAUTHENTICATED

No valid authenticated session exists.

Allowed transitions:

```text
UNAUTHENTICATED → AUTHENTICATING
UNAUTHENTICATED → REVOKED
```

---

# 81. Authentication AUTHENTICATING

Authentication is in progress.

Allowed transitions:

```text
AUTHENTICATING → AUTHENTICATED
AUTHENTICATING → FAILED
AUTHENTICATING → EXPIRED
AUTHENTICATING → REVOKED
```

---

# 82. Authentication AUTHENTICATED

The client has valid server-authorized credentials.

Allowed transitions:

```text
AUTHENTICATED → EXPIRED
AUTHENTICATED → REVOKED
AUTHENTICATED → FAILED
AUTHENTICATED → UNAUTHENTICATED
```

---

# 83. Authentication EXPIRED

The credential or session must be refreshed or re-established.

Allowed transitions:

```text
EXPIRED → AUTHENTICATING
EXPIRED → REVOKED
EXPIRED → UNAUTHENTICATED
```

---

# 84. Authentication REVOKED

The credential is no longer accepted.

Behavior:

* automatic infinite retry prohibited;
* user or administrator action required;
* remote protected operations blocked.

Allowed transitions:

```text
REVOKED → AUTHENTICATING
REVOKED → UNAUTHENTICATED
```

only after a new pairing or credential process.

---

# 85. Authentication FAILED

The last authentication attempt failed.

Allowed transitions:

```text
FAILED → AUTHENTICATING
FAILED → UNAUTHENTICATED
FAILED → REVOKED
```

---

# 86. Catalog Loading State Model

The client presentation/application layer may use:

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

This is a client feature state, not Master Catalog authority.

---

# 87. Catalog State Rules

* `LOADED` requires a valid current response or snapshot.
* `EMPTY` means a valid empty catalog result.
* `OFFLINE_CACHED` requires a valid persisted snapshot and offline state.
* `FAILED` shall preserve any previously valid snapshot where appropriate.
* Catalog feature failure shall not invalidate LocalLibraryItems.

---

# 88. Publication Detail Loading State

The client may use:

```text
IDLE
LOADING
LOADED
OFFLINE_CACHED
NOT_FOUND
UNAVAILABLE
FAILED
```

These states are Presentation/Application projections.

They shall not be persisted as Publication Domain authority.

---

# 89. Update Availability State

Update availability is derived, not authoritative.

Possible values:

```text
CURRENT
UPDATE_AVAILABLE
REMOTE_VERSION_UNKNOWN
LOCAL_VERSION_UNKNOWN
INCOMPATIBLE_CONTEXT
```

---

# 90. CURRENT

The installed local SourceVersion equals the current known remote SourceVersion.

---

# 91. UPDATE_AVAILABLE

The remote current SourceVersion is newer than the installed local SourceVersion within the same server, Master Library and Publication context.

---

# 92. REMOTE_VERSION_UNKNOWN

The client cannot currently determine the remote version.

This commonly occurs offline.

It shall not be treated as `CURRENT`.

---

# 93. LOCAL_VERSION_UNKNOWN

The local record exists but its installed version cannot be trusted.

This may indicate recovery or persistence corruption.

---

# 94. INCOMPATIBLE_CONTEXT

The remote and local identities do not belong to the same:

* ServerId;
* MasterLibraryId;
* PublicationId.

Version comparison is invalid.

---

# 95. Recovery Classification State

Long-running workflows may use:

```text
NOT_REQUIRED
PENDING
RUNNING
SUCCEEDED
FAILED
MANUAL_ACTION_REQUIRED
```

This state classifies recovery execution.

It does not replace aggregate state.

---

# 96. State Persistence Rules

Persisted states shall use stable string representations.

Examples:

```text
AVAILABLE_LOCAL
RECOVERY_REQUIRED
CHECKSUM_MISMATCH
```

Persistence shall not use implicit numeric enum ordering.

---

# 97. State Transport Rules

Transported states shall use stable strings.

Clients shall:

* decode known values;
* preserve unknown safe raw values where useful;
* map unknown values to an unsupported or unknown state;
* not crash;
* not silently map unknown states to success.

---

# 98. State Rehydration Rules

Rehydration shall validate:

* state value exists;
* state combination is legal;
* required fields exist for that state;
* terminal-state timestamps are consistent;
* active Attempt relationships are consistent;
* availability and integrity combinations are valid.

Invalid persisted state shall produce an integrity or recovery error.

---

# 99. State Timestamp Rules

State changes shall record:

* occurrence time;
* actor or operation where required;
* reason where required.

Terminal states should record:

```text
completedAt
cancelledAt
failedAt
```

according to their meaning.

A single ambiguous terminal timestamp shall not replace these semantics when distinction matters.

---

# 100. State Reason Rules

State transitions requiring explanation shall use a stable reason value.

Examples:

```text
SOURCE_MISSING
CHECKSUM_MISMATCH
ADMINISTRATIVE_WITHDRAWAL
NETWORK_INTERRUPTION
INSUFFICIENT_STORAGE
SERVER_IDENTITY_CHANGED
```

Reasons shall not contain raw infrastructure details.

---

# 101. State Event Rules

Successful transitions may emit immutable Domain events.

Examples:

```text
PublicationAvailabilityChanged
AcquisitionStateChanged
LocalPublicationIntegrityChanged
MasterLibraryStateChanged
```

Events shall include:

* aggregate identity;
* previous state;
* new state;
* reason where applicable;
* occurredAt.

---

# 102. Idempotent State Requests

A request to apply the already current state may:

* return unchanged;
* return an idempotent success;
* reject when duplicate mutation would hide a logic defect.

The policy shall be explicit per transition.

Examples:

* repeated cancellation may be idempotent;
* repeated mark-unavailable with same reason may be idempotent;
* repeated source activation requires verification.

---

# 103. State and Concurrency

State transitions shall use optimistic or serialized concurrency.

A transition shall validate the expected current state.

Example:

```text
expected = DOWNLOADING
actual = CANCELLED
requested = VALIDATING
```

The transition shall be rejected as a conflict.

---

# 104. State and Recovery

Recovery may transition an aggregate only after inspecting durable evidence.

Examples:

```text
RECOVERY_REQUIRED → COMPLETED
```

requires proof that:

* final payload exists;
* integrity matches;
* LocalLibraryItem exists or can be committed safely.

```text
RECOVERY_REQUIRED → FAILED
```

requires proof that:

* no valid installation exists;
* temporary state is safely handled;
* retry can begin without duplicate effects.

---

# 105. Cross-State Invariants

The system shall preserve:

```text
Publication AVAILABLE
→ current source integrity VALID

Acquisition COMPLETED
→ LocalLibraryItem AVAILABLE_LOCAL

LocalLibraryItem AVAILABLE_LOCAL
→ local integrity VALID

Connectivity OFFLINE
→ valid local content remains unchanged

Trust IDENTITY_MISMATCH
→ authentication credential transmission blocked

Publication WITHDRAWN
→ existing valid LocalLibraryItem may remain AVAILABLE_LOCAL
```

---

# 106. Independent State Dimensions

Some states shall remain independent.

## Publication Availability and Local Availability

Example:

```text
Publication = WITHDRAWN
LocalLibraryItem = AVAILABLE_LOCAL
```

is valid.

## Connectivity and Local Availability

Example:

```text
Connectivity = OFFLINE
LocalLibraryItem = AVAILABLE_LOCAL
```

is valid.

## Acquisition and Publication Availability

An active acquisition may fail if remote availability changes.

The operation shall not silently change target source version.

---

# 107. State Testing Requirements

Every state model shall have tests for:

* valid initial state;
* every allowed transition;
* every prohibited transition;
* idempotent transition behavior;
* state-specific required fields;
* state-specific event generation;
* reason handling;
* timestamp handling;
* persistence rehydration;
* unknown transport state handling.

---

# 108. Master Library State Tests

Required cases:

```text
initialization success
initialization failure
available to degraded
degraded to available
available to unavailable
maintenance entry and exit
invalid recovery
unsupported format rejection
```

---

# 109. Publication State Tests

Required cases:

```text
available with valid source
reject available without current source
mark unavailable
withdraw
mark corrupted
restore after validation
preserve local independence
```

---

# 110. Acquisition State Tests

Required cases:

```text
complete happy path
cancel queued
cancel downloading
pause and resume
fail transfer
fail validation
fail installation
recovery required
recover to completed
recover to failed
reject direct completed transition
reject Attempt reuse
```

---

# 111. Local State Tests

Required cases:

```text
install as available and valid
mark missing
mark corrupted
begin removal
complete removal
failed removal recovery
reject available with invalid integrity
preserve local state while offline
```

---

# 112. Trust and Authentication Tests

Required cases:

```text
pending trust to trusted
trusted to identity mismatch
mismatch blocks credential use
revocation
authentication success
credential expiry
credential revocation
failed authentication retry policy
```

---

# 113. State Completion Gate

The state design is complete when:

```text
[ ] Master Library states are defined
[ ] Publication availability states are defined
[ ] Source integrity states are defined
[ ] Acquisition states are defined
[ ] Attempt states are defined
[ ] Local availability states are defined
[ ] Local integrity states are defined
[ ] Trust states are defined
[ ] Connectivity states are defined
[ ] Authentication states are defined
[ ] Derived update states are defined
[ ] Initial states are explicit
[ ] Terminal states are explicit
[ ] Recovery states are explicit
[ ] Allowed transitions are explicit
[ ] Prohibited transitions are explicit
[ ] Required evidence is explicit
[ ] Persistence mapping is explicit
[ ] Transport mapping is explicit
[ ] Testing obligations are explicit
[ ] No architectural contradiction remains
```

---

# 114. State Invariants

The following invariants apply:

* State transitions are explicit.
* State transitions require expected prior state.
* Available publication requires a valid current source.
* Completed acquisition requires validated local installation.
* Available local publication requires valid local integrity.
* Failed and recovery-required are distinct.
* Cancellation and failure are distinct.
* Attempt terminal states are immutable.
* Retry creates a new Attempt.
* Server identity mismatch blocks credentials.
* Offline state does not invalidate local content.
* Remote withdrawal does not delete local content.
* Unknown transported state never becomes success silently.
* Persistence rehydration validates state combinations.
* Personal state remains outside these state models.

---

# 115. Prohibited State Designs

The module shall not:

* use one generic `status` enum for unrelated aggregates;
* infer Domain state solely from file existence;
* mark acquisition complete after network transfer only;
* mark a publication available without valid source evidence;
* combine remote and local availability into one state;
* treat offline as local deletion;
* treat withdrawal as local removal;
* reuse a terminal AcquisitionAttempt;
* allow completed acquisition to restart;
* treat failed and recovery-required as the same state;
* silently trust unknown enum values;
* persist states as unstable numeric enum positions;
* bypass transition validation during recovery;
* include annotation or progress states in this module.

---

# 116. Related Documents

## Domain

* `README.md`
* `DomainModel.md`
* `Entities.md`
* `ValueObjects.md`
* `Errors.md`

## Technical Design

* `../02-TechnicalDesign/DataFlow.md`
* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/ClientDesign.md`

## Future Persistence and Contracts

* `../04-Contracts/README.md`
* `../05-Persistence/CatalogSchema.md`
* `../05-Persistence/LocalLibraryStorage.md`

---

# 117. Status

**Approved**

The Master Library, Publication, SourcePublication, AcquisitionOperation, AcquisitionAttempt, LocalLibraryItem, trust, connectivity and authentication state models are defined.

The next document is:

```text
01-MasterLibrary/03-Domain/Errors.md
```

It shall define the Domain-owned error types, transition errors, invariant violations and their mapping into the stable module error registry.
