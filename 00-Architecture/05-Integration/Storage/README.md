# Storage Integration

**Project:** KnowledgeOS  
**Section:** Integration / Storage  
**Document:** Storage  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define how repository contracts map to physical persistence without transferring business authority.

## 2. Scope

Applies to NAS server, local clients, caches, indexes, backups and migrations.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Storage Integration selects and composes concrete providers for logical repositories.

The NAS profile uses a KnowledgeOS Server application with PostgreSQL in a separate container and independent persistent volumes for PostgreSQL and authoritative publication files.

Client profiles may use local databases and file storage. Physical design SHALL preserve logical repository boundaries.

## 5. Conceptual Model

Logical repositories:

- Object Repository;
- Asset Repository;
- Journal Repository;
- Index Repository;
- Configuration Repository;
- Backup Repository.

One physical technology MAY host several repositories only when ownership, migrations and replacement remain explicit.

## 6. Normative Requirements

**STORAGE-R001** — Authoritative source files and PostgreSQL data MUST use independent persistent volumes on NAS.

**STORAGE-R002** — The NAS MUST expose Master Library through KnowledgeOS Server rather than shared-folder semantics alone.

**STORAGE-R003** — Local storage MUST support offline operation.

**STORAGE-R004** — Repository contracts MUST remain provider-neutral.

**STORAGE-R005** — Backups MUST cover authoritative records and source files consistently.

**STORAGE-R006** — Caches and indexes MUST remain rebuildable.

**STORAGE-R007** — Encryption and credential storage MUST follow platform policy.

**STORAGE-R008** — Migrations MUST be resumable and auditable.

**STORAGE-R009** — Storage failures MUST not silently change authority.

## 7. Invariants

**STORAGE-I001** — Physical storage does not define ownership.

**STORAGE-I002** — Authoritative and derived repositories remain distinguishable.

**STORAGE-I003** — Backups are verifiable.

**STORAGE-I004** — Local operation survives network loss.

**STORAGE-I005** — NAS and local libraries remain independent.

## 8. Failure, Recovery and Degradation

Integrity failure SHALL isolate affected records or assets. Recovery SHALL use journals, backups and provenance without discarding committed Personal Knowledge.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

The NAS runs application and PostgreSQL containers with separate volumes. Clients acquire selected files into local storage; no bidirectional library replication exists.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `../Providers/StorageProviders.md`
- `../../04-Platform/Library/README.md`
- `../../02-Domain/DomainModel.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
