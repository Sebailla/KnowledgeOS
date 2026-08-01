# Diagnostics

**Project:** KnowledgeOS  
**Section:** Implementation / Import and Acquisition / 11-Operations  
**Document:** Diagnostics  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the diagnostics for the Import and Acquisition module, covering configuration, diagnostics, capacity and release readiness.

## 2. Module Boundary

This module implements the controlled entry of publications into a Local Library through:

- user-authorized local scanning;
- manual import;
- document picker or share sheet intake;
- explicit acquisition from the NAS Master Library;
- integrity verification;
- local registration;
- canonical-processing handoff.

It does not own:

- Personal Knowledge synchronization;
- annotation creation;
- rendering;
- search;
- AI;
- export;
- plugin execution;
- Master Catalog authority.

The Master Library remains authoritative for its catalog and publication sources. Each Local Library remains independently selective.

## 3. Architectural Context

```text
Local Source or Master Catalog
             │
             ▼
Import / Acquisition Request
             │
             ▼
Discovery or Transfer
             │
             ▼
Staging and Integrity Validation
             │
             ▼
Local Source Registration
             │
             ▼
Local Library Membership
             │
             ▼
Canonical Processing Handoff
```

Personal Knowledge synchronization does not participate in this flow.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Local scanning SHALL be restricted to locations explicitly authorized by the user.
- Original source bytes SHALL remain immutable after successful intake.
- File paths and filenames SHALL NOT become Domain identities.
- Format detection SHALL use content evidence and SHALL NOT rely only on extensions.
- Duplicate detection SHALL produce evidence and SHALL NOT silently merge unrelated sources.
- Manual import and Master Library acquisition SHALL produce explicit provenance.
- Master-to-Local transfer SHALL be modeled as acquisition, not synchronization.
- Acquisition SHALL be explicit, resumable, cancellable and idempotent.
- A Local Library SHALL contain only publications registered for that device.
- Personal Knowledge SHALL NOT be transferred through acquisition.
- Successful completion SHALL require integrity validation and local registration.
- Canonical processing SHALL begin only after a consistent local source state exists.
- Failures SHALL preserve source evidence, operation identity and resumable state.

## 6. State Model

The import lifecycle is:

```text
Requested
→ Discovering or Receiving
→ Staged
→ Validating
→ ReadyToRegister
→ Registered
→ ProcessingQueued
```

Failure states include:

- Paused;
- Cancelled;
- Unsupported;
- Rejected;
- Corrupt;
- Failed;
- RecoveryRequired.

The acquisition lifecycle additionally preserves:

- Master publication reference;
- requested version;
- transfer cursor;
- transferred-byte count;
- checksum;
- local source identity;
- idempotency key.

## 7. Persistence and Transactions

The module SHOULD use:

- durable import and acquisition journals;
- isolated staging storage;
- cryptographic checksum records;
- explicit local registration transactions;
- outbox or equivalent event publication;
- versioned migrations;
- cleanup policies for abandoned staging data.

The Local Library SHALL not expose a publication as available until registration and required integrity checks commit successfully.

## 8. Failure and Recovery

The module SHALL handle:

- interrupted scanning;
- revoked file access;
- unsupported formats;
- duplicate evidence;
- insufficient local storage;
- lost NAS connectivity;
- server restart;
- partial payload transfer;
- checksum mismatch;
- local registration conflict;
- unknown commit state;
- processing handoff failure.

Recovery SHALL resume from the latest consistent checkpoint and SHALL not duplicate sources, acquisitions, memberships or events.

A processing handoff failure MAY leave the publication locally registered but marked as processing-incomplete when policy permits. The state SHALL remain explicit.

## 9. Security and Privacy

- Local scans require user authorization.
- Security-scoped bookmarks or equivalent platform mechanisms SHALL be handled safely.
- Server payload delivery requires authentication and authorization.
- Source bytes and private paths SHALL not appear in telemetry.
- Staging data SHALL use appropriate filesystem protection.
- Temporary files SHALL be removed according to retention and recovery policy.
- Imported Personal Knowledge packages, if ever supported by another module, SHALL not be interpreted as publication acquisition.
- Remote OCR or AI SHALL not be invoked by this module without explicit downstream policy.

## 10. Observability and Performance

The module SHALL expose:

- operation identity;
- source or publication reference;
- lifecycle state;
- byte progress;
- throughput;
- checksum status;
- retry count;
- failure category;
- checkpoint;
- processing-handoff state.

Large scans and acquisitions SHOULD use streaming, bounded memory and backpressure.

## 11. Verification and Acceptance

- A user-authorized local scan discovers supported publications.
- Repeating the same scan does not create duplicate source records.
- Manual import preserves original bytes and provenance.
- Unsupported formats fail explicitly.
- Master Catalog browsing does not download payloads implicitly.
- Explicit acquisition resumes after interruption.
- Checksum mismatch prevents registration.
- Successful acquisition creates device-local membership.
- Personal Knowledge is not included in acquisition.
- NAS unavailability does not affect already available local publications.
- Retry does not duplicate side effects.
- Processing handoff preserves source identity and provenance.
- Security and recovery tests pass.
- Architecture traceability is complete.

## 12. Traceability

- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/02-Domain/KnowledgeObject/Sources.md`
- `00-Architecture/02-Domain/KnowledgeLifecycle.md`
- `00-Architecture/04-Platform/Import/README.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/05-Integration/Storage/README.md`
- `00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`
- `01-Implementation/01-MasterLibrary/README.md`
- `01-Implementation/02-DesktopApplication/README.md`
- `01-Implementation/03-MobileApplication/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 13. Compatibility and Migration

Persistent journals, staging metadata, source mappings, acquisition identities and public contracts SHALL be versioned.

Breaking changes require migration guidance and compatibility tests. Staging data MAY be discarded only when committed sources and memberships remain safe.

## 14. Status

This document is part of the KnowledgeOS Import and Acquisition V4 implementation baseline.
