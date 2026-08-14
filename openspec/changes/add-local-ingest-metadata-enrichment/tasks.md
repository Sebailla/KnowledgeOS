# Tasks: Add Local Ingest Metadata Enrichment

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 700–1,050 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 deterministic inspection → PR 2 review/provenance → PR 3 gated OCR |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Contracts, deterministic inspector, `/inspect` | PR 1 | `pnpm --filter @knowledgeos/import test` | authenticated PDF/EPUB inspect curl | contracts/import/server route |
| 2 | Review UI and accepted provenance | PR 2 | `pnpm --filter @knowledgeos/master-library-local-browser test` | select → review → ingest Docker flow | browser/storage provenance migration |
| 3 | Packaged local OCR | PR 3 (gated) | `pnpm --filter @knowledgeos/ocr test` | Alpine image scanned-PDF fixture | OCR provider/image layer |

## Phase 1: Deterministic Inspection Foundation

- [x] 1.1 RED: add `packages/contracts/src/library.test.ts` cases for V1 inspection/provenance DTOs and redacted stable error codes; extend `packages/contracts/src/library.ts`.
- [x] 1.2 GREEN: add `packages/import/src/metadata/*` and tests for Info/XMP, OPF, first-page, filename precedence/conflicts, malformed input, and no OCR when both fields exist.
- [x] 1.3 RED then GREEN: add authorized bounded multipart `/v1/master-library/publications:inspect` tests and implementation in `apps/master-library-direct-streaming-server/src/server.ts`; assert cancellation, capacity error, no persistence, and redacted responses.

## Phase 2: Review and Provenance

- [x] 2.1 RED then GREEN: add `packages/master-storage/src/{ingest.ts,postgres/*}` tests and reversible migration for immutable accepted field provenance; preserve existing rows and omit OCR text/paths.
- [x] 2.2 RED then GREEN: add BFF inspect proxy tests in `apps/master-library-local-browser/src/server.ts` and cancellable dirty-field prefill/review tests in `public/{app.js,index.html,app.css}`.
- [x] 2.3 Add browser/Docker tests: PDF/EPUB suggestions, user correction, inspection failure manual ingest, and network audit with zero external enrichment calls.
- [x] 2.4 Update `01-Implementation/01-MasterLibrary/{04-Contracts,05-Persistence,08-Testing,09-Operations}/*` with limits, provenance, privacy, rollout, and manual rollback.

## Phase 3: Gated Local OCR Provider and Runtime

- [x] 3.1 BLOCKER—do not implement until approval: select/pin a Tesseract distribution and languages; produce license, SBOM, and reproducible Node-Alpine executable/language-data evidence.
- [x] 3.2 RED: add `packages/ocr/src/tesseract/*` tests for fixed executable/argv, hostile filenames, timeout, cancellation kill, non-zero exit, byte/page limits, and no shell/network retry.
- [x] 3.3 GREEN: add the provider and `deployment/docker/master-library/Dockerfile` runtime only after 3.1; prove scanned-PDF OCR, unavailable/limited manual fallback, health gate, and redacted observability.

## Phase 4: Verification

- [x] 4.1 Run focused unit/contract suites, then `pnpm typecheck`, `pnpm test`, and `pnpm build`; record OCR phase as deferred if 3.1 remains unapproved.
