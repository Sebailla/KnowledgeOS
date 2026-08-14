# Apply Progress: Add Local Master Library Ingest

## Completed Work Units

- PR1 — contracts, bounded validation, and durable ingest journal: completed.
- PR2 — authoritative promotion/recovery and protected streaming ingest route: completed.
- PR3 — browser BFF streamed multipart upload and accessible local upload panel: completed.
- PR4 — isolated Docker Desktop TLS ingest proof, recovery evidence, and local-only guidance: completed.

## PR1 Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test | `pnpm --filter @knowledgeos/contracts test` — passed, 4/4 contract tests. |
| Focused test | `pnpm --filter @knowledgeos/master-storage test` — passed, 18/18 tests including PDF/EPUB validation, unsafe provenance, duplicate/replay, journal state, and claim race model. |
| Runtime harness | `pnpm --filter @knowledgeos/master-storage test:postgres` — passed, 4/4 in a disposable PostgreSQL Docker container; concurrent identical fingerprint claims retained one operation. |
| Typecheck | `pnpm --filter @knowledgeos/master-storage typecheck` — passed. |
| Rollback boundary | Ingest DTOs, bounded validator, journal migration/repository, and their tests can be reverted without routes, filesystem promotion, browser UI, or deployment wiring. |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 1.1 | `packages/contracts/test/contracts.test.ts` | Contract | Existing 3/3 passed | Missing DTO/error exports failed compilation | 4/4 passed | Accepted IDs, redacted status, validation/conflict errors | DTOs separated metadata from source bytes |
| 1.2 | `packages/master-storage/test/ingest.test.ts` | Unit | Existing storage suite 13/13 passed | Missing validator exports failed compilation | Storage suite 17/17 then 18/18 passed | PDF/EPUB, invalid/oversize/path, duplicate/replay/conflict | Signature matching uses deterministic byte predicates |
| 1.3 | `packages/master-storage/test/postgres-authority.test.ts`, `test/postgres-container.integration.test.ts` | Unit/Integration | Existing storage suite passed | Missing migration/journal exports failed compilation | Unit suite 18/18 and PostgreSQL harness 4/4 passed | In-memory race model plus concurrent real PostgreSQL claim | Journal uses fingerprint uniqueness before promotion |

## PR2 Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test | `pnpm --filter @knowledgeos/master-storage test` — passed, 20/20. |
| Focused test | `pnpm --filter @knowledgeos/master-library-direct-streaming-server test` — passed, including authorized streamed multipart, malformed rejection, status, and denied route. |
| PostgreSQL runtime | `pnpm --filter @knowledgeos/master-storage test:postgres` — passed, 5/5. |
| Docker restart harness | `KNOWLEDGEOS_INGEST_HARNESS_RESULT=/tmp/knowledgeos-ingest-pr2-result.jsonl node scripts/deployment/test-local-master-library-ingest-pr2.mjs` — passed; a promoted operation became catalog-visible after migrator/recreate and teardown left zero isolated containers while the user panel remained healthy. |
| Rollback boundary | Streaming ingest service/repository, migration 0006, protected routes/runtime, and isolated harness can be reverted without browser UI implementation. |

## PR2 TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 2.1 | `packages/master-storage/test/ingest-promotion.test.ts`, `test/postgres-container.integration.test.ts` | Unit/Integration | Storage 18/18 passed | Missing service/repository exports failed compilation | Storage 20/20; PostgreSQL 5/5 passed | promotion/replay plus promoted/missing recovery | registered-only visibility centralized in repository |
| 2.2 | `apps/master-library-direct-streaming-server/test/ingest.integration.mjs` | HTTP integration | Existing server suite passed | Route did not exist | HTTP suite passed | authorized source, malformed multipart, status redaction, denied request | source is yielded to the ingest port instead of buffered in route memory |
| 2.3 | `scripts/deployment/test-local-master-library-ingest-pr2.mjs` | Docker TLS/restart | Existing user panel verified healthy | interrupted promotion was hidden from catalog | isolated Docker harness passed | pre-restart hidden then post-reconcile visible, teardown, user-panel health | project name, ports, fixture, teardown and result JSON are all isolated |

## PR3 Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `pnpm --filter @knowledgeos/master-library-local-browser test` — passed: browser build, same-origin session/origin-gated streamed multipart upload, idempotency-key/content headers forwarding, safe upstream error redaction, status forwarding, static UI feedback coverage, and local Compose boundary checks. |
| Runtime harness | The focused test starts a real ephemeral local BFF HTTP listener and submits an actual multipart request through the authenticated session; unauthorized and wrong-origin submissions are rejected before the upstream fetcher, while the accepted request forwards its stream. Docker Compose/TLS evidence is explicitly deferred to PR4. |
| Typecheck | `pnpm --filter @knowledgeos/master-library-local-browser typecheck` — passed. |
| Runtime syntax | `node --check deployment/runtime/master-library-local-browser-server.mjs` — passed. |
| Rollback boundary | `apps/master-library-local-browser/{src,public,test}` and `deployment/runtime/master-library-local-browser-server.mjs`; reverting them removes only BFF/UI upload behavior, leaving PR1/PR2 authority and protected ingest intact. |

## PR3 TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 3.1 | `apps/master-library-local-browser/test/local-browser.test.mjs` | HTTP integration | Existing browser suite passed | Missing ingest endpoint returned 404 instead of session-gated 401 | Same focused suite passed after BFF multipart/status routes and runtime stream forwarding | Valid multipart stream plus unauthenticated/wrong-origin rejection, idempotency/content header forwarding, and token/path redaction | BFF forwards only content type, bounded length, key, stream, and server-held credential; error bodies expose only classified codes |
| 3.2 | `apps/master-library-local-browser/test/local-browser.test.mjs` | Browser asset integration | Existing browser suite passed | Panel lacked upload form and feedback assertions | Same focused suite passed after accessible PDF/EPUB form, submitted/registered/duplicate/rejected/unavailable/recovery feedback, and catalog refresh | Static asset assertions cover form, endpoint, accepted, validation, unavailable, and recovery feedback | Retained the existing local panel style while adding semantic state and disabled/focus controls |

## PR4 Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test | `pnpm --filter @knowledgeos/master-storage test` — passed, 21/21; capacity is classified separately from validation and duplicate checksum intake retains one catalog object. |
| Docker TLS E2E | `node scripts/deployment/test-local-master-library-browser.mjs` — passed in an isolated random Compose project and fixture root. It now emits explicit JSON pass/fail output and performs idempotent project-scoped teardown from normal completion, startup/runtime failure, and SIGINT/SIGTERM. It proved anonymous rejection, invalid and oversized uploads, PDF and EPUB BFF uploads, idempotency replay, duplicate outcome, protected catalog/download, interrupted promotion, migrator reconciliation, restart, secret-redacted logs, no forbidden browser mounts, zero residual isolated containers, and an unaffected healthy user panel. |
| Signal cleanup proof | A separate SIGTERM run emitted `{"status":"failed","stage":"signal","signal":"SIGTERM"}`, removed only its generated Compose project, and a post-run `docker ps -aq --filter name=knowledgeos-ingest-e2e-` returned `0`; the user's panel remained `true healthy`. |
| Typecheck / build | `pnpm typecheck && pnpm build` — passed (33 typecheck tasks; 50 build tasks). |
| Rollback boundary | The Dockerfile build chain, local launcher, isolated E2E harness, ingest error classification, and local-only documentation can be reverted without deleting retained journal, catalog, or authoritative source evidence. |

## PR4 TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 4.1 | `scripts/deployment/test-local-master-library-browser.mjs`, `packages/master-storage/test/ingest.test.ts` | Docker TLS E2E / unit | Existing harness could not start isolated topology because it launched `sync-server` on the shared port; existing storage suite initially showed oversize as validation | New isolated harness first failed on the shared sync port, then exposed incorrect 400 capacity and `registered` duplicate outcomes | Isolated Docker TLS harness passed after the launcher selected only required services, the image built storage artifacts, capacity became 413, and checksum duplicate became `duplicate` | PDF + EPUB, anonymous + invalid + oversize, replay + duplicate, catalog/download, interrupted promotion/reconcile/restart, redaction/mount/teardown/user-panel checks | Compose project and fixture are unique; image builds required storage artifacts instead of copying stale `dist` output |
| 4.2 | `scripts/deployment/test-local-master-library-browser.mjs` | Documentation-backed E2E | PR4 E2E passed before documentation changes | Existing evidence drove explicit local-only/recovery/rollback wording | Docker harness and full typecheck/build passed after documentation updates | Covers both successful and adverse local-only operational outcomes | Guidance names Docker Desktop boundaries and excludes NAS claims |
