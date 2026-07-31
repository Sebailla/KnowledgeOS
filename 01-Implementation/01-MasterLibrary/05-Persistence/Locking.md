# Locking

**Project:** KnowledgeOS  
**Section:** Implementation / Master Library / 05-Persistence  
**Document:** Locking  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the locking for the KnowledgeOS Master Library implementation.

## 2. Scope

This document covers PostgreSQL and authoritative file-storage implementation for the NAS-hosted Master Library and its client-facing integration.

It does not redefine Domain identity, authority, UDM, DPM, Engine ownership or Personal Knowledge synchronization semantics.

## 3. Architectural Baseline

The implementation is governed by the following fixed model:

```text
KnowledgeOS Server on NAS
├── Master Catalog in PostgreSQL
├── Authoritative publication files
├── Publication versions and provenance
├── Versioned client-facing contracts
└── Operational services

Apple Clients
├── Browse Master Catalog
├── Explicitly acquire selected publications
├── Maintain independent Local Libraries
└── Synchronize Personal Knowledge through iCloud/CloudKit
```

The Master Library is independent from Local Libraries.

## 4. Normative Requirements

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

- The NAS Master Library is authoritative for the Master Catalog, source publications, master-source metadata and publication versions.
- The Master Library SHALL run through KnowledgeOS Server and SHALL NOT be treated as a shared folder or a Personal Knowledge synchronization peer.
- PostgreSQL SHALL run in a container separate from the application server.
- PostgreSQL data and authoritative publication files SHALL use independent persistent volumes.
- Personal annotations, highlights, reading progress, personal tags, collections and equivalent user state SHALL NOT be stored in the Master Library.
- Clients browse the Master Catalog and explicitly acquire selected publications into independent Local Libraries.
- Acquisition and Personal Knowledge synchronization are separate workflows.
- Implementation SHALL conform to `00-Architecture` and accepted ADRs.
- Stable Domain identities SHALL be preserved across storage, APIs, migrations and acquisition.
- All long-running or retryable operations SHALL expose durable state, correlation and explicit failure categories.
- The implementation SHALL include automated tests and operational diagnostics appropriate to this document's scope.
- Security and privacy controls SHALL be applied before data crosses process, network or provider boundaries.

## 5. Design Guidance

Implementation SHOULD:

- separate contracts from concrete server and storage classes;
- keep application, persistence and transport responsibilities explicit;
- make external and persistent side effects idempotent;
- use durable workflows for acquisition, import, migration and recovery;
- preserve source evidence and checksums;
- provide deterministic ordering and pagination;
- avoid hidden global state;
- keep configuration schema-validated;
- support graceful startup and shutdown;
- make derived data disposable and rebuildable.

## 6. Failure and Recovery

Failures SHALL be classified as validation, authorization, conflict, compatibility, transient infrastructure, permanent infrastructure, integrity, capacity or policy failures.

Unknown commit status SHALL be reconciled by stable operation identity before retry.

Recovery SHALL preserve:

- publication identity;
- catalog records;
- authoritative source files;
- provenance;
- version history;
- acquisition state;
- migration journals;
- backup evidence.

The implementation SHALL NOT report success before the required commit and integrity boundary is complete.

## 7. Security and Privacy

- Administrative operations require explicit authorization.
- Client access follows least privilege.
- TLS or an equivalent protected local-network transport SHALL be used where applicable.
- Secrets SHALL use approved secure storage.
- Logs SHALL not contain publication content, credentials or Personal Knowledge.
- Remote integrations SHALL receive only the minimum authorized data.
- Backups SHALL be protected against unauthorized access.

## 8. Observability

Relevant operations SHALL expose:

- correlation identity;
- stable error category;
- latency;
- outcome;
- retry count;
- resource usage when material;
- integrity findings;
- workflow or job state.

Operational telemetry is diagnostic and SHALL NOT become Domain authority.

## 9. Verification and Acceptance

- The described behavior is implemented or explicitly marked as future work.
- Authority boundaries match Architecture V4.
- No Personal Knowledge is persisted in the Master Library.
- Acquisition and synchronization remain operationally separate.
- Failure and retry behavior is tested.
- Configuration, logging and operational implications are documented.
- Traceability to architecture and ADRs is present.

## 10. Traceability

- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/02-Domain/KnowledgeObject/KnowledgeObject.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/04-Platform/Import/README.md`
- `00-Architecture/05-Integration/Storage/README.md`
- `00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 11. Compatibility and Migration

Breaking changes to contracts, identity mapping, persistence authority or acquisition behavior require architectural review and migration guidance.

Schema and storage migrations SHALL be versioned, restartable and tested against supported prior versions.

## 12. Status

This document is part of the KnowledgeOS Master Library V4 implementation baseline.
