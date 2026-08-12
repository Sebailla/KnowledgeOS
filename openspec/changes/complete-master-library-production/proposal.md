# Proposal: Complete Master Library Production

## Intent

Deliver the NAS Master Library as a production-operable authority for browsing and acquisition, without making Local Libraries or Personal Knowledge NAS authority.

## Scope

### In Scope
- Versioned catalog/acquisition API: stable IDs, versions, pagination, resumable ranges, checksums, cancellation, classified failures.
- Durable PostgreSQL/files authority, processing, reconciliation, migration, recovery.
- Authenticated HTTPS delivery, least-privilege authorization, secrets lifecycle, redacted diagnostics, and readiness.
- A fully containerized NAS runtime: application services and PostgreSQL run only as separate containers, backed by NAS disk persistence.
- Tested backup/restore, monitoring, container deployment/upgrade/rollback, release evidence.

### Out of Scope
- Personal Knowledge, annotations, reading state, collections, CloudKit synchronization.
- iPad client work, desktop UI, AI, search, unapproved architecture changes.

## Capabilities

### New Capabilities
- `master-catalog-acquisition-api`: Compatible catalog browsing and explicit publication acquisition.
- `master-library-authority-reconciliation`: Durable catalog/files authority, integrity, migration, reconciliation, recovery.
- `master-library-durable-processing`: Idempotent, observable, resumable processing workflows and checkpoints.
- `master-library-secure-delivery`: TLS, authentication, authorization, range integrity, configuration, and audit-safe diagnostics.
- `master-library-production-operations`: Deployment, backup/restore, observability, alerting, release evidence.

### Modified Capabilities
None; `openspec/specs/` contains no existing capability specifications.

## Approach

Use gated vertical slices on an auto-chain feature-branch-chain: contracts and boundary guards; durable authority and processing; locally verifiable protected delivery; Docker Desktop container operations; PR6 real protected-server composition; and NAS release proof. PR6 corrects the discovered gap where the image starts a lightweight file server rather than the approved protected boundary. Concrete NAS deployment values and operational ownership remain release gates; they are not prerequisites for local implementation and tests.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `packages/contracts/src/library.ts` | Modified | Public catalog/acquisition contracts |
| `packages/master-storage/` | Modified | Durable authority and reconciliation |
| `apps/master-library-direct-streaming-server/` | Modified | Protected catalog/delivery API and container composition root |
| `deployment/production/`, `scripts/deployment/` | Modified | Container topology, TLS, persistence, backup, monitoring, release operations |
| `01-Implementation/01-MasterLibrary/` | Modified | Production documentation |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| NAS prerequisites are unavailable | High | Gate dependent work; do not claim readiness |
| Catalog/files diverge on interruption | Medium | Durable journals, reconciliation, recovery tests |
| Content exposure or scope leakage | Medium | TLS, least privilege, contract tests, hard Personal Knowledge exclusion |
| Container restart or upgrade damages authority | Medium | Exclusive disk-backed volume ownership, readiness gating, migration preflight, verified rollback/restore |
| Container bypasses the protected server | High | PR6 replaces the legacy file-server entrypoint and proves TLS proxy E2E against real adapters |

## Rollback Plan

Ship compatible API paths, immutable pinned container images, and restartable migrations. Stop writes, take a verified backup, restore verified catalog/files, reconcile before reopening traffic, then roll back the Compose image/configuration to the prior signed release. Preserve persistent volumes, identities, provenance, and journals; never delete authoritative content or a volume to roll back.

## Dependencies

- **Release/deployment gate (not PR4 implementation):** reachable NAS, public hostname, trusted certificate authority and renewal owner.
- **G1 NAS release/deployment gate (not PR5 implementation):** encrypted off-NAS backup target, retention, RPO/RTO, alert-routing owner, and an assigned operational owner.
- **G2 NAS release/deployment gate (not PR5 implementation):** persistence root and capacity, filesystem permissions, container UID/GID, Compose runtime/version, pinned-image source/retention, and backup-space facts.
- Docker Desktop with Compose is the local PR5 validation environment. It uses a repository-controlled disposable bind-mount fixture root, generated test TLS/credentials where required, and local backup artifacts; it does not establish NAS paths, capacity, off-NAS encryption, retention, RPO/RTO, or operational ownership.
- Production remains container-only: no host-installed production application or database runtime.

## Success Criteria

- [ ] Clients acquire only authorized, checksummed Master publications through compatible HTTPS contracts.
- [ ] PostgreSQL and authoritative files reconcile after interruption without identity or provenance loss.
- [ ] Processing, recovery, operations, and ownership are evidenced.
- [ ] Every production runtime component runs in a declared container; PostgreSQL and application-owned data survive recreation/restart on disk-backed NAS paths.
- [ ] No Personal Knowledge crosses or persists at the NAS Master Library boundary.
