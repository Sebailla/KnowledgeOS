# Tasks: Add Local Master Library Browser

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 1,200–1,800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 contracts/receipts → PR2 auth/BFF → PR3 Docker/docs |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Handoff contract and receipt | PR1 base=tracker | `pnpm --filter @knowledgeos/master-storage test` | PostgreSQL replay/conflict | contracts/migration/route |
| 2 | Local auth and browser BFF | PR2 base=PR1 | `pnpm --filter @knowledgeos/master-library-local-browser test` | cookie login/catalog/download | auth/browser services |
| 3 | Local Compose evidence | PR3 base=PR2 | `node scripts/deployment/test-local-master-library-browser.mjs` | TLS Docker flow/refusal | Compose/launch/docs |

## Phase 1: Acquisition Contract and Durable Receipt (PR1)

- [x] 1.1 RED: add `packages/contracts/test/contracts.test.ts` cases for v1 payload, receipt, manifest preservation, classified validation/conflict/authorization errors.
- [x] 1.2 GREEN: export initiation and accepted-receipt DTOs in `packages/contracts/src/library.ts` without Local Library or Personal Knowledge descriptors.
- [x] 1.3 RED: add replay, changed-fingerprint, malformed/unavailable, and no-receipt-on-failure tests in `packages/master-storage/test/` and direct-server route tests.
- [x] 1.4 GREEN: add checksum migration and atomic `(subject,idempotencyKey)` receipt repository in `packages/master-storage/src/postgres/{migrations,operations}.ts`.
- [x] 1.5 GREEN: implement protected `POST /v1/master-library/acquisitions` in `apps/master-library-direct-streaming-server/src/server.ts`; authorize before manifest/receipt and never execute client work.
- [x] 1.6 REFACTOR: compose the repository only through `packages/master-storage/src/index.ts`; verify PostgreSQL migration, stable replay, and conflict.

## Phase 2: Local Authentication and Browser (PR2)

- [x] 2.1 RED: create `packages/master-library-local-development-auth/test/*.mjs` for wrong password, constant-time verification, signed expiry, permissions, logout, and deployment-profile redaction.
- [x] 2.2 GREEN: create `packages/master-library-local-development-auth/src/index.ts` for ephemeral admin password hash, short-lived HMAC credentials, and fail-closed profile validation.
- [x] 2.3 RED: create `apps/master-library-local-browser/test/*.mjs` for Secure/HttpOnly/Strict cookies, origin denial, 401/403 clearing, no 503 retry, and catalog/download/handoff forwarding.
- [x] 2.4 GREEN: create `apps/master-library-local-browser/src/server.ts` BFF endpoints for login/catalog/download/acquisition; browser `public/*` UI is explicitly deferred by the assigned PR2 scope.
- [x] 2.5 REFACTOR: wire `local`-only auth and receipt dependencies in `deployment/runtime/master-library-protected-server.mjs`; deployment rejects `LOCAL_BROWSER_*`, `local://`, and local ports before listening.

## Phase 3: Docker Desktop and Documentation (PR3)

- [x] 3.1 RED: add launcher/E2E assertions for one-time password output, mode-0600 secrets, no browser mounts, no secret logs, expiry/logout, replay/conflict, and deployment refusal.
- [x] 3.2 GREEN: add browser build/runtime to `deployment/docker/master-library/Dockerfile` and `deployment/production/{compose.local.yaml,proxy/default.conf.template}`; route `/v1`/health to API and `/` to BFF.
- [x] 3.3 GREEN: create `scripts/deployment/{start-local-master-library-browser,test-local-master-library-browser}.mjs` with fixed Compose arguments and disposable TLS fixture.
- [x] 3.4 Verify Docker HTTPS login, catalog, protected download, acquisition replay/conflict, expiry/logout, no Local Library/Personal Knowledge persistence, and deployment-profile refusal.
- [x] 3.5 Update `01-Implementation/01-MasterLibrary/09-Operations/README.md` with local-only boundary, receipt semantics, rollback, unresolved G0/G1/G2, and no NAS-readiness claim.

## Phase 4: Opt-In Persistent Docker Desktop Credential

- [x] 4.1 RED: add launcher tests for an absolute nonempty regular mode-0600 password source and reject relative, empty, non-regular, insecure, and repository paths.
- [x] 4.2 GREEN: add `MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE` selection to the launcher and Compose local Docker secret while preserving temporary mode as the default.
- [x] 4.3 Verify the persistent source is never printed or removed, browser authentication succeeds through the Docker secret, and short-lived sessions remain unchanged.
- [x] 4.4 Update proposal, design, specification, tasks, and Master Library operations runbook with the Docker Desktop-only boundary and runtime procedure.
