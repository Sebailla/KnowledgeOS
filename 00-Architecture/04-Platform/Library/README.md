# Library Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** LibraryEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define Master Library and selective Local Library management, catalog membership, acquisition coordination, availability and integrity.

## 2. Scope

Covers library semantics on NAS and clients. Excludes parsing, Personal synchronization, rendering and provider implementation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Library Engine owns:

- Master Catalog semantics;
- Master publication registration and availability;
- Local Library membership;
- local availability;
- explicit publication acquisition;
- library integrity;
- repository-facing library contracts;
- library recovery.

It does not own source parsing, OCR, Personal synchronization, UI navigation or storage-provider implementation.

The Master Library and Local Libraries are independent library scopes. A Local Library is not a replica of the Master Library.

## 5. Conceptual Model

```text
LibraryEngine
├── MasterCatalogService
├── MasterPublicationService
├── LocalLibraryService
├── AcquisitionCoordinator
├── AvailabilityService
├── IntegrityService
├── LibraryRepository contracts
└── Library events
```

Authority is scoped:

- Master Catalog and source publications: NAS Master Library.
- Local membership and availability: device Local Library.
- Personal Knowledge: user and Sync Engine convergence.

## 6. Normative Requirements

**LIBRARYENGINE-R001** — The Master Library MUST remain authoritative for Master Catalog and source publications.

**LIBRARYENGINE-R002** — Local Library membership MUST remain device-specific.

**LIBRARYENGINE-R003** — Master-to-Local transfer MUST be modeled as explicit acquisition.

**LIBRARYENGINE-R004** — Acquisition MUST preserve identity, provenance, version and integrity.

**LIBRARYENGINE-R005** — Library Engine MUST NOT write Personal Knowledge to the NAS.

**LIBRARYENGINE-R006** — Library Engine MUST support offline Local Library operation.

**LIBRARYENGINE-R007** — Local scanning results MUST be registered through approved Import contracts.

**LIBRARYENGINE-R008** — A publication MAY be available on one device and absent on another.

**LIBRARYENGINE-R009** — Local eviction MUST NOT remove Master publication identity or Personal Knowledge.

**LIBRARYENGINE-R010** — Repository failures MUST not redefine library authority.

**LIBRARYENGINE-R011** — Acquisition retries MUST be idempotent.

**LIBRARYENGINE-R012** — Library integrity checks MUST be observable and recoverable.

## 7. Invariants

**LIBRARYENGINE-I001** — Master and Local Libraries are not replicas.

**LIBRARYENGINE-I002** — Acquisition is not synchronization.

**LIBRARYENGINE-I003** — Personal Knowledge is outside Master authority.

**LIBRARYENGINE-I004** — Library membership is explicit.

**LIBRARYENGINE-I005** — Identity survives acquisition.

**LIBRARYENGINE-I006** — Local operation remains offline-capable.

## 8. Commands, Queries, Events and Workflows

Commands include `RegisterMasterPublication`, `RequestAcquisition`, `RemoveLocalPublication`, `EvictLocalPayload`, `ArchiveMasterPublication` and `VerifyLibraryIntegrity`.

Queries include `BrowseMasterCatalog`, `GetLocalAvailability`, `ListLocalLibrary`, `ResolvePublication` and `GetAcquisitionStatus`.

Events include `PublicationRegistered`, `AcquisitionRequested`, `PublicationAcquired`, `LocalPayloadEvicted`, `LibraryIntegrityFailed` and `MasterPublicationArchived`.

Acquisition uses a durable workflow involving Library, Import and processing capabilities.

## 9. Failure, Recovery and Degradation

Interrupted acquisition SHALL be resumable. Corrupt payloads SHALL be isolated and reported. Local metadata and Personal Knowledge SHOULD remain recoverable when payloads are evicted or reacquired.

NAS unavailability SHALL not prevent normal use of locally available publications.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

A Mac scans an existing EPUB and registers it locally without consulting NAS. Later the user browses the Master Catalog and acquires a missing PDF. Both become Local Library members through different import sources.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
- `../../02-Domain/KnowledgeLifecycle.md`
- `../Import/README.md`
- `../Sync/README.md`
- `../../03-Kernel/WorkflowEngine.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
