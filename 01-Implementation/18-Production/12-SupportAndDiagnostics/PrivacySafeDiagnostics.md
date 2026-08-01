# Privacy Safe Diagnostics

**Project:** KnowledgeOS  
**Section:** Implementation / Production / 12-SupportAndDiagnostics  
**Document:** PrivacySafeDiagnostics  
**Version:** 4.0  
**Status:** Release Candidate  
**Environment:** Production  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the privacy safe diagnostics for KnowledgeOS production, covering support bundles, diagnostics, crash reports and privacy-safe troubleshooting.

## 2. Scope

This document applies to the production operation of:

- KnowledgeOS Server on NAS;
- PostgreSQL;
- authoritative publication-file storage;
- macOS, iPhone and iPad clients;
- optional Web Application;
- Personal Knowledge synchronization;
- background workflows and jobs;
- providers;
- plugins;
- release and support tooling.

It does not redefine Domain identity, Master/Local authority, acquisition, synchronization, UDM, DPM or Engine ownership.

## 3. Production Baseline

```text
NAS Production Environment
├── KnowledgeOS Server container
├── PostgreSQL container
├── Independent PostgreSQL volume
├── Independent authoritative publication-files volume
├── Reverse proxy and TLS
├── Backup and restore services
├── Monitoring and alerting
└── Operational tooling

Client Production Environments
├── macOS application
├── iPhone application
├── iPad application
└── Optional Web Application
```

The Master Library and Personal Knowledge remain separate authority scopes.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- The NAS-hosted Master Library SHALL remain authoritative for Master Catalog records and source publications.
- KnowledgeOS Server and PostgreSQL SHALL run as separate services.
- PostgreSQL data and authoritative publication files SHALL use independent persistent volumes.
- Personal Knowledge SHALL NOT be stored in the NAS Master Library.
- Production deployments SHALL be reproducible from versioned source, configuration and manifests.
- Every production artifact SHALL be traceable to an exact build and dependency set.
- Configuration SHALL be schema-validated before readiness.
- Secrets SHALL use approved secure references and SHALL NOT appear in logs or manifests.
- Every persistent-model change SHALL include a tested migration and rollback or recovery path.
- Derived indexes, graph projections, caches and AI artifacts SHALL remain rebuildable.
- Backups SHALL be encrypted, integrity-checked and verified through restore tests.
- Health checks SHALL distinguish liveness, readiness and dependency health.
- Critical security, privacy, integrity or data-loss findings SHALL block production release.
- Rollback criteria and procedures SHALL be defined before deployment.
- Operational telemetry SHALL not become Domain authority.
- Support bundles SHALL be user-reviewable before sharing where feasible.
- Diagnostic packages SHALL avoid publication content and Personal Knowledge by default.
- Crash reports SHALL use stable symbols and release identities.
- Troubleshooting SHALL prefer reversible steps before destructive recovery.

## 6. Production Design

Production design SHOULD:

- isolate service responsibilities;
- make dependencies explicit;
- use immutable deployable artifacts;
- separate configuration from secrets;
- support graceful startup and shutdown;
- preserve durable workflow state;
- bound resource usage;
- make health and failure visible;
- maintain offline client functionality for local capabilities;
- avoid hidden manual steps;
- preserve user-owned data during upgrade and rollback;
- document every operational dependency.

## 7. Failure and Recovery

Production controls SHALL address:

- application failure;
- database failure;
- authoritative-file storage failure;
- network outage;
- certificate expiry;
- secret rotation failure;
- backup failure;
- restore failure;
- migration failure;
- provider outage;
- plugin failure;
- capacity exhaustion;
- deployment regression;
- client/server incompatibility.

Recovery SHALL preserve:

- stable identity;
- Master Catalog records;
- authoritative source files;
- Personal Knowledge;
- provenance;
- committed versions;
- pending durable work;
- audit evidence.

## 8. Security and Privacy

- Services SHALL use least privilege.
- Production credentials SHALL use approved secret stores.
- TLS SHALL protect network boundaries.
- Database and storage access SHALL be scoped.
- Logs and telemetry SHALL not expose publication content or Personal Knowledge.
- Support artifacts SHALL be privacy-reviewed.
- Remote providers SHALL receive minimum necessary authorized data.
- Signing keys SHALL be protected and access audited.
- Supply-chain metadata SHALL be retained.
- Security findings SHALL follow severity-based response.

## 9. Observability

Relevant production behavior SHALL expose:

- availability;
- readiness;
- request and workflow latency;
- error categories;
- queue depth;
- retry count;
- database health;
- storage health;
- backup age;
- restore-test status;
- sync lag and conflicts;
- provider health;
- plugin failures;
- capacity consumption.

Operational telemetry SHALL remain diagnostic and non-authoritative.

## 10. Verification

Verification SHOULD include:

- configuration validation;
- package and image verification;
- signature and checksum verification;
- migration rehearsal;
- backup restore;
- disaster-recovery exercise;
- upgrade and rollback;
- security scanning;
- load and stability testing;
- alert testing;
- runbook rehearsal;
- privacy review;
- production-readiness review.

Evidence SHALL identify the exact release candidate.

## 11. Acceptance Criteria

- KnowledgeOS Server and PostgreSQL run separately.
- Persistent volumes are independent and correctly mounted.
- Master Catalog and source-file integrity validate.
- Personal Knowledge is absent from Master Library storage.
- Backups complete and restore successfully.
- Health checks identify dependency failures.
- Alerts have owners and tested responses.
- Release artifacts are reproducible and signed.
- SBOM is generated and reviewed.
- Migrations and rollback are tested.
- Offline client operation remains available for local content.
- Security and privacy gates pass.
- Capacity assumptions are documented.
- Runbooks and support procedures are ready.
- Architecture traceability is complete.

## 12. Traceability

- `00-Architecture/01-Foundation/ArchitectureConstraints.md`
- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/05-Integration/Storage/README.md`
- `00-Architecture/06-Execution/Reliability/Recovery.md`
- `00-Architecture/08-Governance/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`
- `01-Implementation/01-MasterLibrary/README.md`
- `01-Implementation/06-Infrastructure/README.md`
- `01-Implementation/17-SystemIntegrationAndRelease/README.md`

## 13. Compatibility and Evolution

Production topology, packaging, configuration, schemas, observability contracts, update channels, runbooks and release controls SHALL be versioned.

Breaking changes require migration, compatibility analysis, rollback or recovery guidance and production-readiness review.

## 14. Status

This document is part of the KnowledgeOS Production V4 implementation baseline.
