# Postgre Sqlarchitecture

**Project:** KnowledgeOS  
**Section:** Implementation / Infrastructure / 02-PostgreSQL  
**Document:** PostgreSQLArchitecture  
**Version:** 4.0  
**Status:** Release Candidate  
**Environment:** NAS, CI/CD, Client Distribution and Supporting Services  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the postgre sqlarchitecture for KnowledgeOS infrastructure, covering PostgreSQL configuration, ownership, migrations and operational integration.

## 2. Scope

This document applies to production, staging, development and test infrastructure as appropriate. It implements approved architecture but does not redefine Domain authority, Library semantics, acquisition, synchronization, UDM, DPM or Engine ownership.

## 3. Infrastructure Baseline

```text
NAS Host
├── KnowledgeOS Server container
├── PostgreSQL container
├── Application configuration and secret references
├── Independent PostgreSQL persistent volume
├── Independent authoritative publication-file volume
├── Optional reverse proxy and observability services
└── Backup and recovery services

Clients
├── macOS Local Library
├── iPhone/iPad Local Libraries
└── Optional Web Application
```

The NAS Master Library is authoritative for catalog and source publications. Local Libraries remain independent. Personal Knowledge synchronizes through the approved personal synchronization profile and is outside Master Library storage.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- KnowledgeOS Server SHALL run as an application service on the NAS rather than as shared-folder-only access.
- PostgreSQL SHALL run in a container separate from the KnowledgeOS Server application.
- PostgreSQL data and authoritative publication files SHALL use independent persistent volumes.
- Infrastructure SHALL preserve the separation between Master Library, Local Libraries and Personal Knowledge.
- Personal Knowledge SHALL NOT be stored in Master Library persistence, backups or telemetry.
- Domain identity SHALL remain independent of container, host, database row, volume and path identifiers.
- Configuration SHALL be schema-validated and environment-specific.
- Infrastructure changes SHALL be reproducible, reviewable and observable.
- Failure and recovery procedures SHALL preserve source publications, catalog records, identity, provenance and migration journals.
- Secrets SHALL use approved secure storage and SHALL NOT appear in images, source control or logs.
- Database roles SHALL use least privilege.
- Connection pools SHALL be bounded and observable.
- Schema ownership and migration authority SHALL be explicit.
- Database backups SHALL be coordinated with authoritative file backups.

## 6. Design Guidance

Infrastructure SHOULD:

- use declarative, version-controlled definitions;
- pin image and dependency versions;
- separate build-time and runtime secrets;
- expose health, readiness and diagnostic signals;
- support graceful startup and shutdown;
- use least-privilege service accounts;
- prevent derived caches from sharing authority with canonical data;
- make migrations and restore procedures restartable;
- document capacity and performance assumptions;
- provide safe defaults;
- isolate public, internal and management traffic;
- retain sufficient evidence for incident and recovery analysis.

## 7. Failure and Recovery

Infrastructure failures SHALL be classified as configuration, availability, integrity, capacity, security, compatibility, migration or dependency failures.

Recovery SHALL prioritize:

1. protecting authoritative publication files;
2. protecting PostgreSQL catalog and provenance;
3. preserving identity and migration journals;
4. restoring service configuration and secrets;
5. rebuilding derived indexes, previews, caches and telemetry;
6. validating consistency before reopening writes.

Unknown state SHALL be reconciled before retry. Automatic repair SHALL NOT invent Domain authority or silently discard source evidence.

## 8. Security and Privacy

- Containers SHALL run with least privilege.
- Administrative interfaces SHALL not be publicly exposed by default.
- TLS SHALL protect external service traffic.
- Secrets SHALL use approved secret stores or protected runtime injection.
- Backups SHALL be encrypted where exposure risk exists.
- Logs and metrics SHALL exclude publication content and Personal Knowledge.
- Security updates, vulnerability scanning and incident handling SHALL be documented.

## 9. Observability

Relevant components SHALL expose:

- readiness and liveness;
- dependency health;
- database connectivity and pool state;
- volume capacity and integrity;
- backup age and verification status;
- request, workflow and job outcomes;
- security and authorization failures;
- migration state;
- deployment version.

Telemetry SHALL remain diagnostic and non-authoritative.

## 10. Verification and Acceptance

- Definitions are reproducible from a clean environment.
- Required services become ready in dependency order.
- PostgreSQL and application containers are independent.
- PostgreSQL and authoritative files use independent volumes.
- Personal Knowledge is absent from Master Library persistence and backups.
- Failure and restart behavior is tested.
- Backup and restore are verified where applicable.
- Secrets do not appear in artifacts or logs.
- Migrations are tested.
- Alerts and runbooks exist for critical failure modes.
- Architecture traceability is current.

## 11. Traceability

- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/05-Integration/Storage/README.md`
- `00-Architecture/06-Execution/Reliability/Recovery.md`
- `00-Architecture/07-ArchitectureViews/ADR/ADR-008-Storage-Architecture.md`
- `00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`
- `01-Implementation/01-MasterLibrary/09-Operations/README.md`

## 12. Compatibility and Evolution

Breaking changes to persistent volumes, database ownership, network exposure, secret format, backup layout or deployment topology require architecture and migration review.

Infrastructure artifacts SHALL identify their version and source revision.

## 13. Status

This document is part of the KnowledgeOS Infrastructure V4 implementation baseline.
