# Tasks: Add Local Master Library Ingest

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 1,300–1,900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 → PR2 → PR3 → PR4 |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Contracts, validation, journal | PR1 base=tracker | `pnpm --filter @knowledgeos/contracts test && pnpm --filter @knowledgeos/master-storage test` | disposable PostgreSQL claims race | DTOs/migration/journal only |
| 2 | Storage recovery and protected routes | PR2 base=PR1 | `pnpm --filter @knowledgeos/master-storage test:postgres && pnpm --filter @knowledgeos/master-library-direct-streaming-server test` | interrupt promotion, restart/reconcile | ingest service/routes/runtime |
| 3 | Streamed BFF and upload panel | PR3 base=PR2 | `pnpm --filter @knowledgeos/master-library-local-browser test` | local session upload/rejection | BFF/assets only |
| 4 | Docker TLS proof and guidance | PR4 base=PR3 | `node scripts/deployment/test-local-master-library-browser.mjs` | disposable TLS Compose upload/restart | overlay/harness/docs |

## Phase 1: Contracts, Validation, and Journal (PR1)

- [x] 1.1 RED: extend `packages/contracts/test/contracts.test.ts` for opaque accepted IDs, status/errors, metadata and idempotency conflict; then add v1 DTOs in `packages/contracts/src/library.ts`.
- [x] 1.2 RED: add `packages/master-storage/test/ingest.test.ts` for PDF/EPUB signatures, limits, unsafe provenance, checksum duplicate and replay; create `src/ingest.ts` bounded staging validator.
- [x] 1.3 RED: extend `test/postgres-authority.test.ts` for migration, journal states and unique fingerprint race; add migration/repositories under `src/postgres/`.

## Phase 2: Registration, Recovery, and Server (PR2)

- [x] 2.1 RED: add PostgreSQL recovery cases for staged/promoted/missing/mismatched bytes; wire registered-only catalog visibility and evidence-preserving reconciliation.
- [x] 2.2 RED: add `apps/master-library-direct-streaming-server/test/ingest.integration.mjs` for auth, malformed multipart, validation, duplicate, status redaction and delivery; add local-profile `catalog.write` ingest/status routes.
- [x] 2.3 Wire `deployment/runtime/master-library-{protected-server,migrate}.mjs` for config validation, migration and reconcile-before-ready; prove interrupted promotion restart.

## Phase 3: Browser BFF and Upload UI (PR3)

- [x] 3.1 RED: extend `apps/master-library-local-browser/test/local-browser.test.mjs` for session/origin-gated streamed multipart, key forwarding and token/path redaction; implement BFF routes.
- [x] 3.2 RED: extend `public/{index.html,app.js,app.css}` tests for PDF/EPUB metadata, accepted/duplicate/rejected/unavailable/recovered feedback; implement the accessible form/status UI.

## Phase 4: Docker Evidence and Documentation (PR4)

- [x] 4.1 RED: extend `scripts/deployment/test-local-master-library-browser.mjs` for TLS valid/unauthorized/invalid/oversize/duplicate/restart, catalog/download and no Local/Personal mounts; update Dockerfile and `compose.local.yaml`.
- [x] 4.2 Update `01-Implementation/01-MasterLibrary/{04-Contracts,05-Persistence,08-Testing,09-Operations}/` with local-only boundary, recovery and rollback; run `pnpm typecheck && pnpm build`.
