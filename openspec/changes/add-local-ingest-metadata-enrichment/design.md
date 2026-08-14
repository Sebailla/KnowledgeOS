# Design: Add Local Ingest Metadata Enrichment

## Technical Approach

Add an authenticated, local-only `POST /v1/master-library/publications:inspect` command before the existing ingest command. The direct server composes an Import Engine inspection service; it reads a bounded request stream into ephemeral working storage, ranks title/author evidence, then deletes it. The browser sends the selected `File` for inspection, pre-fills only untouched fields, shows source/confidence, and later re-sends the file through current ingest. Accepted values retain immutable per-field provenance; source bytes and server identities remain unchanged.

```
Browser File → BFF /inspect → Direct server → Import inspector
                                      │            │
                                      └─ result ← PDF/EPUB/text/OCR
Browser review → current /ingest → Master storage (metadata + provenance)
```

## Architecture Decisions

| Decision | Choice | Alternatives / rationale |
|---|---|---|
| Ownership | Import inspection lives in `@knowledgeos/import`; HTTP/BFF only adapt its versioned contract. | Browser parsing violates Import Engine ownership; storage must not infer UI metadata. |
| Evidence | Per field: PDF Info/XMP or EPUB OPF → first-page extractable text → normalized filename → OCR (PDF only). Keep conflicts as candidates; highest source pre-fills. | Filename never overrides documentary evidence. |
| OCR | Provider adapter is a Tesseract CLI process with explicit argv, stdin/temporary files, timeout, page/byte limits, cancellation kill, and redacted outcomes. | `@knowledgeos/ocr` currently has only an in-memory provider; host PATH has no `tesseract`/PDF tools, Docker is Node Alpine, and lockfile has no parser/OCR dependencies. OCR is unavailable until the image build pins and proves executable plus language-data availability; then `ocr.unavailable` is a manual-entry fallback, never a remote retry. |
| Parsers | Add pinned local dependencies during implementation: `pdfjs-dist` for PDF Info/XMP/first-page text; ZIP+XML parser pair for EPUB OPF. | No existing dependency supplies PDF/EPUB parsing. Pure ad-hoc binary parsing is unsafe and incomplete. Dependencies are bundled in the image; no runtime fetches. |
| Provenance | Extend ingest metadata with `acceptedProvenance` per title/authors (`user-entered` or local evidence source, confidence). UI edits become `user-entered`; server stores JSONB append-only historical evidence. | Do not persist OCR text, paths, or client identities. |

## Data Flow

Inspection validates media type, size, and multipart shape before reading. It extracts deterministic evidence first; OCR runs only when either required field remains missing . Result returns `suggestions`, `candidates`, correlation ID, and redacted classified outcome. Browser tracks dirty fields; a later file selection cancels/replaces its pending inspection. Inspect failure leaves manual fields usable. The inspect stream is never promoted or catalogued.

## Interfaces / Contracts

```ts
type MetadataEvidence = "pdf-info" | "pdf-xmp" | "epub-opf" |
  "first-page-text" | "filename" | "local-ocr" | "user-entered";
interface MetadataSuggestion { value: string; evidence: MetadataEvidence;
  confidence: "high" | "medium" | "low"; }
interface InspectPublicationV1 { metadata: Pick<IngestSourceMetadataV1,
  "originalFilename" | "declaredMediaType" | "byteLength">; source: AsyncIterable<Uint8Array>; }
interface InspectPublicationResultV1 {
  title?: MetadataSuggestion; authors?: readonly MetadataSuggestion[];
  candidates: readonly MetadataSuggestion[]; correlationId: string;
  outcome: "completed" | "partial" | "ocr-unavailable" | "ocr-limited";
}
```

Inspection errors are stable, redacted codes: `inspection.validation-failed`, `inspection.capacity-exceeded`, `inspection.cancelled`, `ocr.unavailable`, `ocr.limited`, and `ocr.failed`.

## File Changes

| File | Action | Description |
|---|---|---|
| `packages/contracts/src/library.ts` | Modify | V1 inspection/provenance DTOs and error codes. |
| `packages/import/src/metadata/*`, tests | Create | Bounded PDF/EPUB/text/filename ranking service. |
| `packages/ocr/src/tesseract/*`, tests | Create | Local process provider, limits and outcomes. |
| `apps/master-library-direct-streaming-server/src/server.ts`, tests | Modify | Authorized streaming inspect route and composition seam. |
| `apps/master-library-local-browser/src/server.ts`, `public/{app.js,index.html,app.css}`, tests | Modify | BFF proxy, cancellable prefill/review UX. |
| `packages/master-storage/src/{ingest.ts,postgres/*}`, tests | Modify | Persist accepted field provenance and migration. |
| `deployment/docker/master-library/Dockerfile`, compose/config docs | Modify | Bundle parser packages and gated OCR runtime/language data. |
| `01-Implementation/01-MasterLibrary/{04-Contracts,05-Persistence,08-Testing,09-Operations}/*` | Modify | Contract, provenance, limits, privacy and runbook traceability. |

## Testing Strategy

| Layer | Coverage |
|---|---|
| Unit | Precedence/conflicts, malformed inputs, filename normalization, dirty fields, OCR timeout/cancellation/argv safety. |
| Contract/integration | Authenticated inspect→ingest provenance, no inspect persistence, limits/redacted errors, migration/recovery. |
| Browser/Docker E2E | PDF/EPUB prefill, scanned-PDF OCR when image capability is present, unavailable/limited OCR manual fallback, network audit proves no external call. |

## Threat Matrix

All listed documentation-path, Git-selection, commit, push, and PR rows are **N/A**: this change has no executable-file classification or VCS/PR boundary. OCR subprocess safety is covered by unit RED tests for fixed executable/argv, hostile filenames, timeout, cancellation, and non-zero exit; it never invokes a shell.

## Migration / Rollout

Add a reversible provenance column/table migration and retain existing rows unchanged. Ship inspection disabled until image capability health proves pinned runtime and language data; then enable local first. Rollback disables `/inspect` and UI prefill while manual ingest and retained provenance continue.

## Open Questions

- [ ] Approve the exact pinned Tesseract distribution, language set, license/SBOM evidence, and Alpine compatibility after a reproducible image build proves them.
- [ ] Set page, byte, timeout, and memory defaults from measured Docker fixtures.
