# Tasks: Complete Master Library Production

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 2,000–3,200 |
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

## Phase 1: Contracts and Boundary Guards (PR1)

- [ ] 1.1 RED: add catalog DTO/cursor/error and Personal Knowledge rejection cases in `packages/contracts/test/contracts.test.ts`.
- [ ] 1.2 GREEN: add v1 catalog, manifest, errors and alias DTOs in `packages/contracts/src/library.ts`.
- [ ] 1.3 RED/GREEN/REFACTOR: add route fixtures and catalog/acquisition guards in `apps/master-library-direct-streaming-server/{test,src/server.ts}`.
- [ ] 1.4 Verify contract/server tests; document alias migration in `01-Implementation/01-MasterLibrary/`.

## Phase 2: Durable Authority (PR2; gate DB-1)

- [ ] 2.1 Gate DB-1: record PostgreSQL driver, migration runner/image, instance and rollback owner before `packages/master-storage/` changes.
- [ ] 2.2 RED: add interruption, duplicate, orphan, mismatch and unknown-migration cases in `packages/master-storage/test/`.
- [ ] 2.3 GREEN: create `packages/master-storage/src/postgres/{migrations,catalog,operations,reconciliation}.ts` for restartable journal recovery.
- [ ] 2.4 REFACTOR: compose adapters/test doubles in `packages/master-storage/src/index.ts`; make `test` execute compiled tests.
- [ ] 2.5 Verify containerized PostgreSQL promotion/reconcile, restart and migration rollback; preserve journal/files and the database mount.

## Phase 3: Durable Processing (PR3)

- [ ] 3.1 RED: add lease expiry, resume, duplicate retry and invalid-transition cases in `packages/master-storage/test/processing.test.ts`.
- [ ] 3.2 GREEN: add operation/correlation IDs, leased jobs and checkpoints in `packages/master-storage/src/postgres/jobs.ts`.
- [ ] 3.3 REFACTOR: wire recovery in `apps/master-library-direct-streaming-server/src/server.ts` without duplicate promotion.
- [ ] 3.4 Verify worker-container kill/recreate/resume; document lease recovery and rollback in `01-Implementation/01-MasterLibrary/`.

## Phase 4: Protected Delivery (PR4; gate G0)

- [ ] 4.1 Gate G0: record NAS hostname, certificate owner, credential issuer/revocation/enrollment, secret rotation and authorization owner.
- [ ] 4.2 RED: add insecure, unauthorized, invalid-range, checksum/ETag and redacted-audit server tests.
- [ ] 4.3 GREEN: add trusted-proxy TLS, scoped authorization, HEAD/range/cancel and readiness in `apps/master-library-direct-streaming-server/src/server.ts`.
- [ ] 4.4 REFACTOR: configure proxy/secrets in `deployment/production/{compose.yaml,env.example}`; verify HTTPS range.

## Phase 5: Container Operations and Release Evidence (PR5; gates G1/G2)

- [ ] 5.1 Gate G1: record off-NAS target, retention, RPO/RTO, alert owner and non-production containerized NAS/PostgreSQL environment.
- [ ] 5.2 Gate G2: record NAS persistence root/capacity, container UID/GID owners, Compose runtime/version, pinned image source/retention, and rollback owner.
- [ ] 5.3 RED: add compose validation plus restart, missing/wrong-owned mount, incomplete-backup, and failed-integrity restore fixtures for `scripts/deployment/{backup-production,restore-production,validate-production}.sh`.
- [ ] 5.4 GREEN: declare pinned images, internal database network, explicit service-owned disk-backed bind mounts, restart/readiness order, encrypted complete backup, isolated restore, reconcile-before-readiness, redacted metrics and owned alerts in Compose/scripts.
- [ ] 5.5 RED/GREEN: prove application/database container recreation, blocked traffic until readiness, upgrade preflight/migration/reconcile, and rollback retaining all persistent mounts.
- [ ] 5.6 REFACTOR: update `deployment/production/README.md` and `01-Implementation/01-MasterLibrary/` runbooks with start, upgrade, rollback, volume ownership and restore procedures.
- [ ] 5.7 Release gate: retain container topology, migration/rollback, restart/recreate, restore, security/range/load and named acceptance evidence; otherwise block release.
