# Tasks: Complete Master Library Production

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 2,450–3,950 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Contracts | PR1 base=tracker | `pnpm --filter @knowledgeos/contracts test` | server fixture | contracts/routes |
| 2 | Authority | PR2 base=PR1 | `pnpm --filter @knowledgeos/master-storage test` | containerized PostgreSQL + files | migrations/adapters |
| 3 | Processing | PR3 base=PR2 | `pnpm --filter @knowledgeos/master-storage test` | interrupted worker | jobs/worker |
| 4 | Delivery | PR4 base=PR3 | `pnpm --filter @knowledgeos/master-library-direct-streaming-server test` | proxy client | proxy/auth/routes |
| 5 | Operations | PR5 base=PR4 | `scripts/deployment/validate-production.sh` | isolated restore | deployment/scripts/docs |
| 6 | Real container composition | PR6 base=PR5 | `node scripts/deployment/run-production-operations.mjs` | TLS proxy E2E | runtime/adapters/image |

## Phase 1: Contracts and Boundary Guards (PR1)

- [x] 1.1 RED: add catalog DTO/cursor/error and Personal Knowledge rejection cases in `packages/contracts/test/contracts.test.ts`.
- [x] 1.2 GREEN: add v1 catalog, manifest, errors and alias DTOs in `packages/contracts/src/library.ts`.
- [x] 1.3 RED/GREEN/REFACTOR: add route fixtures and catalog/acquisition guards in `apps/master-library-direct-streaming-server/{test,src/server.ts}`.
- [x] 1.4 Verify contract/server tests; document alias migration in `01-Implementation/01-MasterLibrary/`.

## Phase 2: Durable Authority (PR2; DB-1 resolved)

- [x] 2.1 DB-1: use `pg` as the sole PostgreSQL driver. Run repository-owned ordered SQL migrations through a one-shot `master-library-migrate` Compose service from the same immutable application image; use an advisory lock, checksum-validated `schema_migrations`, migration-only and DML-only database roles, one internal PostgreSQL instance, and the KnowledgeOS Deployment Operator as rollback/restore owner.
- [x] 2.2 RED: add interruption, duplicate, orphan, mismatch and unknown-migration cases in `packages/master-storage/test/`.
- [x] 2.3 GREEN: create `packages/master-storage/src/postgres/{migrations,catalog,operations,reconciliation}.ts` for restartable journal recovery.
- [x] 2.4 REFACTOR: compose adapters/test doubles in `packages/master-storage/src/index.ts`; make `test` execute compiled tests.
- [x] 2.5 Verify containerized PostgreSQL promotion/reconcile, restart, advisory-lock/checksum behavior, and initial down-migration rollback; preserve journal/files and the database mount.

## Phase 3: Durable Processing (PR3)

- [x] 3.1 RED: add lease expiry, resume, duplicate retry and invalid-transition cases in `packages/master-storage/test/processing.test.ts`.
- [x] 3.2 GREEN: add operation/correlation IDs, leased jobs and checkpoints in `packages/master-storage/src/postgres/jobs.ts`.
- [x] 3.3 REFACTOR: wire recovery in `apps/master-library-direct-streaming-server/src/server.ts` without duplicate promotion.
- [x] 3.4 Verify worker-container kill/recreate/resume; document lease recovery and rollback in `01-Implementation/01-MasterLibrary/`.

## Phase 4: Protected Delivery (PR4; locally implementable, G0 release/deployment gate)

- [x] 4.1 RED: add configuration-validation, untrusted/direct transport, unauthorized, invalid-range, checksum/ETag and redacted-audit tests; use generated TLS material and fixture credentials only.
- [x] 4.2 GREEN: add public-origin/trusted-proxy/TLS-material/credential-source configuration, authorization port, HEAD/range/cancel and readiness in `apps/master-library-direct-streaming-server/src/server.ts`; missing non-test configuration fails closed.
- [x] 4.3 REFACTOR: configure proxy and secret *references* in `deployment/production/{compose.yaml,env.example}` without concrete NAS hostname, certificate, credential, issuer, or owner; verify a local HTTPS range through the proxy.
- [x] 4.4 Verify local protected-delivery harness: generated TLS, authorized/unauthorized range, integrity headers, trusted-proxy rejection, cancellation, and redacted audit output.
- [ ] 4.5 G0 release/deployment gate: before NAS deployment or release acceptance, record the concrete hostname, certificate authority/renewal owner, credential issuer/revocation/enrollment, secret-rotation owner, and authorization owner. This does not block PR4 implementation/tests; it blocks deployment and a production-ready claim.

## Phase 5: Container Operations and Local Docker Desktop Evidence (PR5; G1/G2 are NAS release/deployment gates)

- [x] 5.1 RED/GREEN: add disposable local bind-mount fixture coverage for Compose planning, complete backup, and partial-restore rejection in `scripts/deployment/{backup-production,restore-production,validate-production}.sh`.
- [x] 5.2 GREEN: declare the local-testable pinned container topology (proxy, PostgreSQL, one-shot migrator, API/workers), internal database network, explicit fixture-root bind mounts, restart/readiness order, complete backup manifest, isolated restore, reconcile-before-readiness, and redacted diagnostics. Do not add NAS paths, capacity, UID/GID, off-NAS target, retention, RPO/RTO, or owners.
- [x] 5.3 RED/GREEN: prove in Docker Desktop that application/database recreation retains fixture mounts; traffic stays blocked until migration, reconcile, and readiness pass; an upgrade executes preflight/migration/reconcile; and rollback retains all mounts and restores the prior local fixture state when required.
- [x] 5.4 REFACTOR: update `deployment/production/README.md` and `01-Implementation/01-MasterLibrary/` runbooks with Docker Desktop start, fixture ownership, backup/isolated restore, upgrade and rollback procedures; clearly label NAS facts as unrecorded release gates.
- [x] 5.5 Verify the real Docker Desktop harness and retain local evidence for topology, one-shot migration, restart/recreate, backup/restore, upgrade/rollback, and readiness. This proves implementation only, not NAS release readiness.
- [ ] 5.6 G1 NAS release/deployment gate: before NAS deployment or release acceptance, record encrypted off-NAS target, retention, RPO/RTO, alert owner, and assigned operational owner.
- [ ] 5.7 G2 NAS release/deployment gate: before NAS deployment or release acceptance, record NAS persistence root/capacity/backup space, container UID/GID ownership, Compose runtime/version, pinned image source/retention, and rollback owner.
- [ ] 5.8 Release gate: retain G0/G1/G2 records plus container topology, migration/rollback, restart/recreate, restore, security/range/load and named acceptance evidence; otherwise block release.

## Phase 6: Real Protected-Server Container Composition (PR6; remediation for discovered runtime bypass)

- [x] 6.1 RED: add PostgreSQL catalog/manifest keyset pagination, missing-metadata preservation, descriptor-root escape, readiness, and deployment-profile fixture-port rejection cases in `packages/master-storage`, `packages/master-storage-node-stream`, and direct-server tests.
- [x] 6.2 GREEN: add forward catalog-metadata migration and `PostgresMasterCatalogReader`/async descriptor lookup port; do not derive identities, titles, or authors from filesystem paths or legacy descriptor identifiers.
- [x] 6.3 GREEN: implement the compiled Master Library composition root that injects PostgreSQL catalog, filesystem reader, recovery/readiness, and only allowed delivery ports into `MasterDirectStreamingServer`; remove legacy file-serving behavior from the image entrypoint.
- [x] 6.4 GREEN: build the required workspace packages into `deployment/docker/master-library/Dockerfile`; wire a local-only fixture seeder in `compose.local.yaml` after migration and before protected-server E2E. The normal Compose template remains backend-only and deployment profile rejects fixture ports.
- [x] 6.5 Verify in Docker Desktop through nginx TLS: authorized catalog, manifest, HEAD and range acquisition use the real server; unauthorized and legacy direct-file paths are denied; readiness remains blocked until migration/reconciliation/recovery; retain redacted evidence only.
- [x] 6.6 REFACTOR: document the single container entrypoint, catalog metadata registration gap handling, Docker test profile, migration/rollback, and unchanged G0/G1/G2 NAS release gates.
