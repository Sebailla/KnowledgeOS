# Readme

**Project:** KnowledgeOS  
**Section:** Implementation / Master Library / 09-Operations  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Provide the rector guide for deployment, monitoring, backup and operational readiness in the Master Library implementation.

## 2. Scope

This document covers deployment, monitoring, backup and operational readiness for the NAS-hosted Master Library and its client-facing integration.

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

## 5.1 Migration and Rollback Accountability

The KnowledgeOS Deployment Operator is the operational owner for database migration and rollback. Before a release, this role SHALL verify the backup, invoke the one-shot migration container, retain all persistent mounts, and stop traffic/writes before rollback or restore. The runbook SHALL identify the assigned individual and escalation contact in deployment configuration; source code SHALL not embed personal operational ownership.

## 5.2 Processing Worker Recovery

API startup SHALL invoke the configured durable-processing recovery before accepting traffic. Recovery implementations SHALL obtain a new database lease before resuming an expired job; they SHALL never replay a promotion solely because a process or worker container restarted.

For an interrupted-worker incident: stop the failed worker, retain PostgreSQL and operation mounts, recreate the worker, and let it claim only expired work. Inspect the retained operation ID, correlation ID and checkpoint before manual intervention. Rollback of this slice removes the jobs/worker wiring only; it SHALL NOT delete operation records, checkpoints, publication files or catalog evidence.

## 5.3 Protected Delivery: Local Verification and Release Gate

Protected delivery SHALL be implemented and tested locally before a NAS exists. Its configuration SHALL externalize the public HTTPS origin, trusted-proxy policy, TLS-material references, credential source and authorization port. Local verification MAY use generated test TLS material, a fixture origin and fixture credentials; these artifacts SHALL NOT be reused as NAS deployment values or described as production evidence.

NAS deployment and release acceptance remain blocked until the deployment record names the concrete public hostname, certificate authority and renewal owner, credential issuer/revocation/enrollment process, secret-rotation owner and authorization owner. The absence of those facts does not block PR4 code or tests; it blocks only deployment and any production-ready claim.

The application validates every non-test protected-delivery input before it listens: public HTTPS origin, trusted proxy addresses, TLS-material reference, credential-source reference and authorization port reference. The backend does not publish a host port in the production Compose template; the TLS proxy forwards the original host, HTTPS protocol and correlation ID. Audit records are limited to correlation ID, category and outcome. Cancellation closes the source stream and is recorded as `delivery.cancelled` without logging the publication or credentials.

## 5.4 Container Operations: Local Proof and NAS Release Gates

PR5 SHALL first prove the declared proxy, PostgreSQL, one-shot migrator, API/workers, internal network, and readiness order in Docker Desktop. The harness SHALL create a disposable local bind-mount fixture root with independent `postgres/`, `publications/`, `operations/`, and `backups/` directories. It SHALL prove migration, reconciliation-before-readiness, application/database recreate, complete backup, isolated restore, upgrade preflight, and rollback retaining all fixture mounts. Local evidence MUST be redacted and SHALL NOT be described as NAS readiness.

Before NAS deployment or release acceptance, the deployment record MUST separately satisfy G1 (encrypted off-NAS target, retention, RPO/RTO, alert owner, assigned operational owner) and G2 (NAS persistence root/capacity/backup space, container UID/GID ownership, Compose runtime/version, pinned-image source/retention, rollback owner). These unrecorded NAS facts do not block PR5 implementation or Docker Desktop tests; they block NAS traffic and a production-ready claim.

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
- A runbook exists for the relevant operational scenario.
- Health, alerting, backup and recovery paths are verifiable.

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
## Protected container composition

The Master Library image starts `master-library-protected-server.mjs`, which composes the protected direct-streaming server with PostgreSQL catalog/manifest adapters and descriptor-authorized filesystem reads. The legacy `/files/` serving route is not part of this entrypoint.

Docker Desktop's `compose.local.yaml` is test-only: it seeds one explicitly registered public catalog record after migration. Descriptor rows without registered title, authors, and Knowledge Object identity remain non-browseable; metadata is never inferred from paths. G0/G1/G2 remain NAS release gates.

## Local Master Library Browser (Docker Desktop only)

`compose.local.yaml` adds an explicitly local, HTTPS browser panel for Docker Desktop. Start it with `node scripts/deployment/start-local-master-library-browser.mjs`; the launcher prints the one-time temporary `admin@knowledgeos.local` password in its initiating terminal, waits for the browser route, then removes the host password file. The BFF uses secure, strict, HTTP-only cookies and keeps bearer credentials out of browser JavaScript.

The panel renders the protected Master Catalog, downloads only through the protected v1 delivery route, and creates an idempotent acquisition **receipt** for a named Local Library. A receipt and its manifest are an authorized handoff record only: they do not download content into a Local Library, execute client processing, or store Personal Knowledge.

The browser service receives only its local development secrets and has no PostgreSQL, Master publication, or operations mount. Its local credential verifier is not a NAS identity system. Rolling back this local capability means stopping the local Compose overlay and removing its disposable fixture root; retained Master catalog/files are governed by the normal backup and restore procedures.

This proof is deliberately local. G0 (hostname/TLS/authorization ownership), G1 (off-NAS backup policy), and G2 (NAS storage/runtime ownership) remain unresolved release gates. Docker Desktop evidence SHALL NOT be described as NAS deployment or production-readiness evidence.

### Local Browser Ingest Runbook

Start the local panel with `node scripts/deployment/start-local-master-library-browser.mjs`. The launcher starts only the browser route and its declared Master Library dependencies; it does not start `sync-server`, so an isolated Docker Desktop run cannot bind the user's shared sync port. It prints a temporary credential once, removes the host password file after readiness, and keeps the BFF credentials in Docker secrets.

For rollback of local ingest proof, stop the isolated Compose project and remove only its disposable fixture root. Retain normal Master Library journal, PostgreSQL, and source evidence whenever investigating a real interrupted promotion. The automated harness uses a unique Compose project and performs this teardown itself; it never targets the user's `knowledgeos` project.
