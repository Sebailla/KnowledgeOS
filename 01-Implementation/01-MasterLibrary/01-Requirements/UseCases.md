

# Master Library Use Cases

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Requirements

**Document:** Use Cases

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the approved use cases of the Master Library Module.

The use cases describe how authorized actors interact with:

* KnowledgeOS Server;
* the NAS Master Library;
* the Master Catalog;
* source publications;
* the macOS reference client;
* the Selective Local Library.

Each use case defines:

* actors;
* trigger;
* preconditions;
* main flow;
* alternate flows;
* failure flows;
* postconditions;
* observable outcomes;
* related requirements.

---

# 2. Scope

The use cases cover:

* server operation;
* Master Library initialization;
* publication administration;
* catalog access;
* client registration;
* publication acquisition;
* Selective Local Library management;
* offline use;
* source update detection;
* diagnostics;
* backup and recovery.

The use cases do not cover:

* annotations;
* reading progress;
* personal-state synchronization;
* CloudKit;
* UDM processing;
* DPM processing;
* full document rendering;
* AI;
* Plugins.

---

# 3. Use-Case Identifier Format

Server and administrative use cases use:

```text
UC-SXX
```

Client use cases use:

```text
UC-CXX
```

Operational use cases use:

```text
UC-OXX
```

---

# 4. Actors

The approved actors are:

* Library Administrator;
* KnowledgeOS User;
* KnowledgeOS macOS Client;
* KnowledgeOS Server Operator;
* Backup Operator;
* NAS Filesystem;
* Local Device Filesystem.

---

# 5. General Preconditions

Unless stated otherwise:

* KnowledgeOS Server has valid configuration;
* the NAS is reachable;
* the Master Library exists;
* the Master Library format is supported;
* the actor is authenticated;
* the actor has sufficient authorization;
* persistent storage is available.

---

# 6. General Postconditions

All completed operations shall leave persistent state:

* valid;
* recoverable;
* internally consistent;
* observable through stable contracts.

A failed operation shall not expose partial state as completed state.

---

# 7. UC-S01 — Start KnowledgeOS Server

## Primary Actor

KnowledgeOS Server Operator.

## Trigger

The server process is started.

## Preconditions

* runtime dependencies are available;
* configuration is readable;
* configured network port is available;
* configured Master Library location is accessible or can report explicit unavailability.

## Main Flow

1. The operator starts KnowledgeOS Server.
2. The server loads configuration.
3. The server validates mandatory configuration.
4. The server initializes logging and diagnostics.
5. The server opens the configured Master Library.
6. The server validates the Master Library manifest.
7. The server validates catalog availability.
8. The server starts the local-network API listener.
9. The server publishes healthy status.

## Alternate Flow — Master Library Temporarily Unavailable

1. The server starts.
2. The NAS storage is unavailable.
3. The server enters degraded or unhealthy status.
4. The API health endpoint reports Master Library unavailability.
5. The server does not expose catalog or acquisition operations as successful.

## Failure Flows

* invalid configuration;
* unsupported Master Library version;
* catalog database unavailable;
* insufficient permissions;
* network port unavailable;
* corrupt manifest.

## Postconditions

* the server is healthy and serving requests;
* or the server exposes explicit unhealthy/degraded status.

## Observable Outcome

The health endpoint returns a structured status.

---

# 8. UC-S02 — Stop KnowledgeOS Server

## Primary Actor

KnowledgeOS Server Operator.

## Trigger

The process receives an authorized shutdown request or operating-system termination signal.

## Preconditions

* the server is running.

## Main Flow

1. The server stops accepting new mutable administrative operations.
2. Active operations are allowed to finish, cancel or checkpoint according to policy.
3. Persistent repositories are flushed.
4. Temporary resources are released.
5. The network listener stops.
6. The process exits cleanly.

## Failure Flows

* active acquisition cannot finish before shutdown timeout;
* persistent flush fails;
* shutdown hook fails.

## Postconditions

* committed state remains valid;
* unfinished operations remain recoverable or explicitly failed;
* no partial catalog mutation appears committed.

---

# 9. UC-S03 — Initialize Master Library

## Primary Actor

Library Administrator.

## Trigger

The administrator requests creation of a new Master Library.

## Preconditions

* the target location is accessible;
* the administrator is authorized;
* no valid Master Library already occupies the target location;
* sufficient storage and permissions exist.

## Main Flow

1. The administrator submits initialization parameters.
2. The server validates the target location.
3. The server checks for an existing Master Library.
4. The server creates a stable MasterLibraryId.
5. The server creates the Master Library directory structure.
6. The server creates the manifest.
7. The server initializes catalog persistence.
8. The server initializes source, staging and quarantine storage.
9. The server records format and schema versions.
10. The server validates the newly created structure.
11. The server reports successful initialization.

## Alternate Flow — Existing Empty Directory

The server initializes the Master Library inside the existing empty target directory.

## Failure Flows

* valid Master Library already exists;
* target directory contains unknown data;
* insufficient permissions;
* insufficient storage;
* manifest write failure;
* catalog initialization failure.

## Postconditions

A valid, reopenable Master Library exists.

## Invariant

Initialization shall never overwrite an existing valid Master Library silently.

---

# 10. UC-S04 — Open Existing Master Library

## Primary Actor

KnowledgeOS Server.

## Trigger

Server startup or administrative Library switch.

## Preconditions

* the target contains a Master Library manifest.

## Main Flow

1. The server reads the manifest.
2. The server verifies MasterLibraryId.
3. The server validates the format version.
4. The server validates catalog schema compatibility.
5. The server opens catalog persistence.
6. The server validates required storage areas.
7. The server determines Library health.
8. The Library becomes available to catalog operations.

## Failure Flows

* manifest missing;
* manifest corrupted;
* unsupported format;
* catalog corrupted;
* source storage inaccessible;
* permissions insufficient.

## Postconditions

The Master Library is open and classified as healthy, degraded or invalid.

---

# 11. UC-S05 — Validate Master Library

## Primary Actor

Library Administrator or KnowledgeOS Server.

## Trigger

Manual validation, startup validation or scheduled integrity validation.

## Preconditions

* Master Library location is accessible.

## Main Flow

1. The server reads the manifest.
2. The server verifies required directories.
3. The server validates catalog accessibility.
4. The server validates schema version.
5. The server samples or fully validates source references according to validation mode.
6. The server detects missing or corrupt source payloads.
7. The server produces a validation report.
8. Publication availability is updated only through governed rules.

## Alternate Flow — Fast Validation

Only structural and catalog-level checks are performed.

## Alternate Flow — Full Validation

Checksums are recomputed for all source publications.

## Postconditions

A structured Library health result exists.

---

# 12. UC-S06 — Register Publication

## Primary Actor

Library Administrator.

## Trigger

The administrator selects a source PDF and submits master metadata.

## Preconditions

* the administrator is authorized;
* the source file is readable;
* the source format is supported;
* staging storage is available.

## Main Flow

1. The server receives registration metadata and source reference.
2. The server validates the request.
3. The source file is copied into staging.
4. The server detects media type and format.
5. The server calculates byte length.
6. The server calculates checksum.
7. The server validates basic PDF structure.
8. The server creates a PublicationId.
9. The server creates SourceVersion 1.
10. The server writes source metadata.
11. The server commits the source payload to permanent storage.
12. The server commits the Master Catalog entry.
13. The server increments CatalogRevision.
14. The publication becomes `AVAILABLE`.
15. The server returns publication details.

## Alternate Flow — Existing Logical Publication

The administrator explicitly chooses to register a new source version using UC-S08 instead.

## Failure Flows

* unsupported format;
* invalid PDF;
* source disappears during staging;
* checksum calculation fails;
* permanent storage commit fails;
* catalog commit fails;
* duplicate identity conflict;
* insufficient storage.

## Postconditions

A valid publication and source version are available, or no available catalog entry is created.

## Critical Invariant

Catalog availability shall not precede durable source commit.

---

# 13. UC-S07 — Update Master Metadata

## Primary Actor

Library Administrator.

## Trigger

The administrator edits master-source metadata.

## Preconditions

* the PublicationId exists;
* the administrator is authorized.

## Main Flow

1. The administrator submits modified metadata.
2. The server validates fields.
3. The server loads the catalog entry.
4. The server applies permitted changes.
5. The server persists metadata transactionally.
6. CatalogRevision advances.
7. The server returns the updated entry.

## Restrictions

This operation shall not accept:

* annotations;
* reading progress;
* personal tags;
* personal favorites;
* personal relationships.

## Postconditions

Master-source metadata is updated without changing PublicationId.

---

# 14. UC-S08 — Replace Publication Source

## Primary Actor

Library Administrator.

## Trigger

A new authoritative source file becomes available for an existing publication.

## Preconditions

* PublicationId exists;
* the administrator is authorized;
* current source remains available or its failure state is known.

## Main Flow

1. The administrator selects the replacement source.
2. The server stages the source.
3. The server validates format.
4. The server calculates size and checksum.
5. The server creates a new SourceVersion.
6. The server commits the new source payload.
7. The server updates the current source reference.
8. The previous source version remains historically identifiable according to retention policy.
9. CatalogRevision advances.
10. Clients can detect `UPDATE_AVAILABLE`.

## Failure Flows

* source invalid;
* staging failure;
* commit failure;
* catalog update failure;
* checksum failure.

## Critical Invariant

The previous valid source remains current until the replacement source is fully committed.

---

# 15. UC-S09 — Mark Publication Unavailable

## Primary Actor

Library Administrator or integrity subsystem.

## Trigger

The source payload cannot currently be delivered safely.

## Preconditions

* publication exists.

## Main Flow

1. The server identifies the publication.
2. The server records the availability reason.
3. Availability becomes `UNAVAILABLE` or `CORRUPTED`.
4. CatalogRevision advances.
5. New acquisitions are rejected.
6. Existing client-local copies remain unaffected.

## Postconditions

The Master Catalog truthfully represents acquisition availability.

---

# 16. UC-S10 — Withdraw Publication

## Primary Actor

Library Administrator.

## Trigger

The publication should no longer be offered for new acquisition.

## Preconditions

* the publication exists;
* the administrator is authorized.

## Main Flow

1. The administrator requests withdrawal.
2. The server records the reason.
3. The publication becomes `WITHDRAWN`.
4. CatalogRevision advances.
5. New acquisition requests are rejected.
6. existing local copies are not remotely deleted.

## Postconditions

The publication remains historically identifiable but unavailable for new acquisition.

---

# 17. UC-S11 — List Master Catalog

## Primary Actor

KnowledgeOS Client.

## Trigger

The client requests a page of catalog entries.

## Preconditions

* the client is authenticated;
* the Master Catalog is available.

## Main Flow

1. The client submits pagination and optional sorting parameters.
2. The server validates parameters.
3. The server queries catalog persistence.
4. The server returns catalog entries.
5. The response includes paging information and CatalogRevision.

## Alternate Flow — Empty Catalog

The server returns an empty result with valid paging metadata.

## Failure Flows

* invalid page parameters;
* authorization denied;
* catalog unavailable;
* server degraded.

---

# 18. UC-S12 — Search Master Catalog

## Primary Actor

KnowledgeOS Client.

## Trigger

The user enters catalog search criteria.

## Preconditions

* client is authenticated;
* catalog is available.

## Main Flow

1. The client submits a metadata query.
2. The server validates query length and filters.
3. The server searches approved catalog fields.
4. The server applies pagination.
5. The server returns matching entries and CatalogRevision.

## Searchable Fields

* title;
* subtitle;
* authors;
* subjects;
* publisher;
* language;
* publication type;
* source format.

## Out of Scope

Full-text search inside source publications.

---

# 19. UC-S13 — Get Publication Details

## Primary Actor

KnowledgeOS Client.

## Trigger

The user opens a catalog entry.

## Preconditions

* PublicationId exists;
* client is authenticated.

## Main Flow

1. The client requests PublicationId.
2. The server loads the current catalog entry.
3. The server loads source availability and version information.
4. The server returns complete approved metadata.

## Failure Flows

* publication not found;
* authorization denied;
* catalog unavailable.

---

# 20. UC-S14 — Retrieve Publication Cover

## Primary Actor

KnowledgeOS Client.

## Trigger

The client needs a publication cover.

## Preconditions

* publication exists.

## Main Flow

1. The client requests the cover.
2. The server resolves the governed cover reference.
3. The server validates the stored asset.
4. The server streams the cover with appropriate media type.

## Alternate Flow — Cover Missing

The server returns a defined not-available result, allowing a client placeholder.

---

# 21. UC-S15 — Deliver Publication Content

## Primary Actor

KnowledgeOS Client.

## Trigger

An authorized acquisition requests publication content.

## Preconditions

* publication is `AVAILABLE`;
* requested SourceVersion exists;
* client is authorized;
* source payload passes availability checks.

## Main Flow

1. The server validates PublicationId and SourceVersion.
2. The server checks source availability.
3. The server reads source size and checksum.
4. The server processes an optional valid range request.
5. The server streams content using bounded memory.
6. The server returns integrity metadata.
7. Transfer completion is logged.

## Failure Flows

* source unavailable;
* source missing;
* source corrupted;
* invalid range;
* authorization denied;
* storage interruption.

## Security Invariant

The server never returns a raw NAS path.

---

# 22. UC-C01 — Register KnowledgeOS Server

## Primary Actor

KnowledgeOS User.

## Trigger

The user adds a server to the macOS client.

## Preconditions

* the server endpoint is known;
* the server is reachable or may be saved for later connection.

## Main Flow

1. The user enters or selects the endpoint.
2. The client connects to the server identity endpoint.
3. The client retrieves server identity and capabilities.
4. The client presents trust information.
5. The user confirms registration.
6. The client stores the endpoint and trusted server identity securely.
7. The server appears in the client server list.

## Alternate Flow — Manual Offline Registration

Endpoint configuration is stored, but trust establishment remains pending.

## Failure Flows

* endpoint invalid;
* server unreachable;
* identity malformed;
* user rejects trust;
* secure storage failure.

---

# 23. UC-C02 — Authenticate Client Device

## Primary Actor

KnowledgeOS Client.

## Trigger

The client connects to a registered server.

## Preconditions

* server registration exists;
* device credential exists or registration flow is available.

## Main Flow

1. The client verifies server identity.
2. The client presents device credentials.
3. The server authenticates the device.
4. The server determines authorization.
5. A bounded authenticated session or token is established.

## Failure Flows

* server identity changed;
* credential expired;
* credential revoked;
* authorization denied;
* secure credential unavailable.

## Postconditions

The client is authenticated or exposes a structured failure.

---

# 24. UC-C03 — Browse Master Catalog

## Primary Actor

KnowledgeOS User.

## Trigger

The user opens the Master Catalog.

## Preconditions

* a registered server exists.

## Main Flow

1. The client displays connection state.
2. The client requests the first catalog page.
3. The server returns entries.
4. The client maps each entry to local availability state.
5. The client displays remote-only, local and update-available states.
6. Additional pages load on demand.

## Alternate Flow — Server Offline

1. The client detects unavailability.
2. The latest catalog snapshot may be shown.
3. The snapshot displays refresh time.
4. Remote-only acquisitions are unavailable.

---

# 25. UC-C04 — Search Catalog

## Primary Actor

KnowledgeOS User.

## Trigger

The user enters a search query or filter.

## Preconditions

* the Master Catalog screen is open.

## Main Flow

1. The client validates the query locally.
2. The client submits the query.
3. The server returns paged results.
4. The client combines remote catalog data with local availability state.
5. Results are displayed.

## Offline Flow

The client may search the cached snapshot and clearly mark results as potentially stale.

---

# 26. UC-C05 — View Publication Details

## Primary Actor

KnowledgeOS User.

## Trigger

The user selects a catalog entry.

## Main Flow

1. The client loads locally cached entry data immediately where available.
2. The client requests current details when connected.
3. The client displays master metadata.
4. The client displays remote availability.
5. The client displays local acquisition state.
6. The client offers allowed actions.

## Possible Actions

* acquire;
* retry;
* update;
* remove local copy;
* open local placeholder.

---

# 27. UC-C06 — Acquire Publication

## Primary Actor

KnowledgeOS User.

## Trigger

The user selects `Acquire`.

## Preconditions

* publication is available remotely;
* publication is not already valid and current locally;
* sufficient local storage is expected;
* client is authenticated.

## Main Flow

1. The client creates an AcquisitionOperation.
2. The client requests current publication and source metadata.
3. The client verifies requested SourceVersion.
4. The client reserves a staging destination.
5. The client starts the transfer.
6. The client persists acquisition progress.
7. The UI displays progress.
8. The transfer completes.
9. The client validates byte length.
10. The client validates checksum.
11. The client prepares the local destination.
12. The client commits the payload atomically or recoverably.
13. The client creates or updates LocalLibraryItem.
14. State becomes `AVAILABLE_LOCAL`.
15. The user is informed that the publication is available offline.

## Failure Flows

* server unavailable;
* authorization denied;
* source unavailable;
* insufficient local storage;
* transfer interrupted;
* invalid range;
* byte-length mismatch;
* checksum mismatch;
* local commit failure.

## Critical Postcondition

A failed acquisition shall not create an `AVAILABLE_LOCAL` item.

---

# 28. UC-C07 — Cancel Acquisition

## Primary Actor

KnowledgeOS User.

## Trigger

The user cancels a queued or active acquisition.

## Preconditions

* acquisition is cancellable.

## Main Flow

1. The user requests cancellation.
2. The client marks cancellation requested.
3. The active transfer is stopped.
4. Temporary resources are cleaned or retained according to safe-resume policy.
5. Acquisition state becomes `CANCELLED`.
6. No local publication is exposed as available.

---

# 29. UC-C08 — Retry Failed Acquisition

## Primary Actor

KnowledgeOS User.

## Trigger

The user retries an acquisition in `FAILED`.

## Preconditions

* the failure is retryable;
* publication remains remotely available.

## Main Flow

1. The client retains the logical AcquisitionOperation identity.
2. The client creates a new execution Attempt.
3. The client revalidates source metadata.
4. The client restarts or resumes according to transport policy.
5. Normal acquisition validation and installation proceed.

## Invariant

Attempts shall have distinct identities.

---

# 30. UC-C09 — Resume Interrupted Acquisition

## Primary Actor

KnowledgeOS User or Acquisition Manager.

## Trigger

Connectivity returns or the application restarts.

## Preconditions

* resumable transfer is supported;
* persisted checkpoint and temporary payload are valid;
* server exposes the same SourceVersion.

## Main Flow

1. The client loads acquisition state.
2. The client validates partial payload length and checkpoint.
3. The client requests remaining bytes.
4. The transfer continues.
5. Full payload validation occurs before installation.

## Alternate Flow — Resume Invalid

The client discards unsafe partial state and restarts acquisition cleanly.

---

# 31. UC-C10 — List Selective Local Library

## Primary Actor

KnowledgeOS User.

## Trigger

The user opens the local Library.

## Preconditions

None. NAS connectivity is not required.

## Main Flow

1. The client reads LocalLibraryItem persistence.
2. The client verifies expected local payload presence as appropriate.
3. The client displays locally acquired publications.
4. Local integrity state is shown.
5. Remote connection state is shown separately.

## Postconditions

Only locally acquired publications appear as local items.

---

# 32. UC-C11 — Open Local Publication Placeholder

## Primary Actor

KnowledgeOS User.

## Trigger

The user opens a locally available publication.

## Preconditions

* LocalLibraryItem is `AVAILABLE_LOCAL`;
* local payload exists.

## Main Flow

1. The client resolves the internal local storage reference.
2. The client verifies local availability.
3. The client opens a minimal preview, system viewer or metadata placeholder.
4. The user can confirm the publication is present locally.

## Failure Flows

* payload missing;
* payload corrupted;
* permission failure;
* unsupported local-open mechanism.

## Out of Scope

Full KnowledgeOS reading and rendering experience.

---

# 33. UC-C12 — Remove Local Publication

## Primary Actor

KnowledgeOS User.

## Trigger

The user selects removal from this device.

## Preconditions

* a LocalLibraryItem exists.

## Main Flow

1. The client requests confirmation.
2. The client marks the item `REMOVING`.
3. The client removes the local payload.
4. Temporary or derived content is cleaned according to policy.
5. The local item becomes `CATALOG_ONLY` or is removed from local membership.
6. The Master Catalog entry remains visible.
7. The NAS source remains unchanged.

## Privacy Rule

Personal state is preserved unless a separate explicit deletion operation exists in a future module.

---

# 34. UC-C13 — Detect Source Update

## Primary Actor

KnowledgeOS Client.

## Trigger

Catalog refresh or publication-detail refresh.

## Preconditions

* the publication exists locally;
* the server is reachable.

## Main Flow

1. The client compares local SourceVersion with current Master Catalog SourceVersion.
2. If the server version is newer, local state becomes `UPDATE_AVAILABLE`.
3. The existing local payload remains valid and available.
4. The user is offered an update action.

---

# 35. UC-C14 — Update Local Publication

## Primary Actor

KnowledgeOS User.

## Trigger

The user accepts a source update.

## Preconditions

* a newer SourceVersion exists;
* current local payload is valid or its failure state is known.

## Main Flow

1. The client creates an update acquisition.
2. The newer payload downloads into staging.
3. Size and checksum are validated.
4. The new payload is committed atomically.
5. LocalLibraryItem SourceVersion is updated.
6. The previous local payload is cleaned according to policy.

## Failure Flow

The existing valid payload remains available if update acquisition fails.

---

# 36. UC-C15 — Operate While NAS Is Offline

## Primary Actor

KnowledgeOS User.

## Trigger

The NAS or KnowledgeOS Server becomes unavailable.

## Preconditions

* one or more publications were acquired locally.

## Main Flow

1. The client detects server unavailability.
2. The client displays offline state.
3. The user opens the Selective Local Library.
4. Local publications remain visible.
5. The user opens a local publication placeholder.
6. No remote deletion is inferred.
7. The client periodically or manually attempts reconnection.

## Postconditions

Valid local publications remain available.

---

# 37. UC-C16 — Reconnect to Server

## Primary Actor

KnowledgeOS Client or User.

## Trigger

Connectivity returns or the user requests reconnect.

## Main Flow

1. The client resolves the registered endpoint.
2. The client verifies server identity.
3. The client authenticates.
4. The client requests server and catalog revision.
5. The client refreshes catalog data as required.
6. The client compares local SourceVersions.
7. Connection state becomes online.

## Failure Flows

* server identity changed;
* authentication rejected;
* catalog unavailable;
* server unhealthy.

---

# 38. UC-C17 — Detect Missing Local Payload

## Primary Actor

KnowledgeOS Client.

## Trigger

Local Library validation or publication open.

## Preconditions

* LocalLibraryItem claims a local publication.

## Main Flow

1. The client resolves the expected internal local reference.
2. The local payload is missing.
3. The client marks local integrity state invalid.
4. The item is no longer presented as safely available.
5. The client offers reacquisition where the server source remains available.

---

# 39. UC-C18 — Detect Corrupted Local Payload

## Primary Actor

KnowledgeOS Client.

## Trigger

Integrity validation or failed local open.

## Main Flow

1. The client recalculates or verifies checksum.
2. The checksum differs from stored integrity data.
3. The client marks the item corrupted.
4. The payload is not trusted.
5. The client offers cleanup and reacquisition.

---

# 40. UC-O01 — Inspect Server Health

## Primary Actor

KnowledgeOS Server Operator.

## Trigger

Manual inspection or automated health probe.

## Main Flow

1. The operator requests `/v1/health`.
2. The server reports process health.
3. The server reports Master Library availability.
4. The server reports catalog availability.
5. No sensitive paths or credentials are exposed.

---

# 41. UC-O02 — Back Up Master Library

## Primary Actor

Backup Operator.

## Trigger

Scheduled or manual backup.

## Preconditions

* backup destination is available;
* backup policy is configured.

## Main Flow

1. The operator or backup process coordinates a consistent backup point.
2. Manifest is copied.
3. Catalog persistence is copied or backed up consistently.
4. Source publications are backed up.
5. Source metadata and version data are backed up.
6. Backup integrity is recorded.
7. The operation reports success or failure.

## Exclusion

Personal client state is not included.

---

# 42. UC-O03 — Restore Master Library

## Primary Actor

Backup Operator.

## Trigger

Recovery from data loss or infrastructure replacement.

## Preconditions

* a valid backup exists;
* target storage is available.

## Main Flow

1. KnowledgeOS Server is stopped or placed into maintenance mode.
2. Backup contents are restored.
3. The manifest is validated.
4. Catalog persistence is opened.
5. Source references are validated.
6. Library integrity validation runs.
7. The server restarts.
8. Health and catalog access are confirmed.

---

# 43. UC-O04 — Upgrade KnowledgeOS Server

## Primary Actor

KnowledgeOS Server Operator.

## Trigger

A new compatible server version is deployed.

## Main Flow

1. The operator creates or confirms a backup.
2. The current server is stopped.
3. The new deployment artifact is installed.
4. Configuration is validated.
5. required schema migrations execute.
6. The Master Library opens.
7. Health checks pass.
8. Catalog and acquisition smoke tests pass.

## Failure Flow

The operator executes rollback.

---

# 44. UC-O05 — Roll Back Server Upgrade

## Primary Actor

KnowledgeOS Server Operator.

## Trigger

Upgrade validation fails.

## Preconditions

* prior deployment artifact exists;
* rollback-compatible persistent state or backup exists.

## Main Flow

1. The failed version is stopped.
2. Persistent state is restored if required.
3. The previous server version is restored.
4. Health checks run.
5. Master Catalog access is confirmed.

---

# 45. Cross-Use-Case Invariants

All use cases shall preserve:

* stable MasterLibraryId;
* stable PublicationId;
* exact SourceVersion identity;
* truthful publication availability;
* separation of staging and committed storage;
* absence of personal state in NAS operations;
* no direct client filesystem access to Master Library storage;
* device-specific Selective Local Libraries;
* bounded transfer memory;
* structured errors;
* observable failure behavior.

---

# 46. Use-Case Priority

The following are P0:

```text
UC-S01
UC-S03
UC-S04
UC-S06
UC-S11
UC-S13
UC-S15
UC-C01
UC-C02
UC-C03
UC-C05
UC-C06
UC-C10
UC-C11
UC-C12
UC-C15
UC-O01
```

The following are P1:

```text
UC-S05
UC-S07
UC-S08
UC-S09
UC-S10
UC-S12
UC-S14
UC-C04
UC-C07
UC-C08
UC-C13
UC-C14
UC-C16
UC-C17
UC-C18
UC-O02
UC-O03
UC-O04
UC-O05
```

`UC-C09` may be P2 when safe full restart is implemented instead of resumable download.

---

# 47. Traceability

Each use case shall be connected to:

* functional requirements;
* non-functional requirements;
* acceptance criteria;
* implementation components;
* tests;
* completion evidence.

The traceability matrix shall be completed in `AcceptanceCriteria.md`.

---

# 48. Use-Case Completion Gate

The use-case specification is ready when:

```text
[ ] Every primary actor has defined interactions
[ ] Every P0 flow has success behavior
[ ] Every P0 flow has failure behavior
[ ] Integrity-sensitive operations define postconditions
[ ] Offline behavior is explicit
[ ] Security-sensitive operations define authorization
[ ] Personal state remains excluded
[ ] Administrative and user operations remain separated
[ ] Acquisition and synchronization remain separate
[ ] Every P0 use case has acceptance criteria
```

---

# 49. Prohibited Use-Case Behavior

No use case shall:

* upload personal state to the NAS;
* mirror the complete NAS Library to every device;
* expose raw NAS paths;
* treat partial downloads as available;
* delete NAS publications through local removal;
* delete another device's publication through local removal;
* make local access depend on NAS availability;
* infer publication identity from file path;
* treat cached catalog data as authoritative;
* mix publication acquisition with iCloud synchronization.

---

# 50. Related Documents

## Requirements

* `README.md`
* `Scope.md`
* `AcceptanceCriteria.md`

## Module

* `../README.md`
* `../ImplementationCharter.md`

## Governance

* `../../00-Governance/ImplementationStrategy.md`
* `../../00-Governance/ModuleDevelopmentLifecycle.md`
* `../../00-Governance/DefinitionOfDone.md`

## Architecture

* `../../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

---

# 51. Status

**Approved**

This document defines the complete approved use-case baseline for the Master Library Module.

The next document is `AcceptanceCriteria.md`, which shall convert these use cases and requirements into explicit, measurable and testable completion conditions.
