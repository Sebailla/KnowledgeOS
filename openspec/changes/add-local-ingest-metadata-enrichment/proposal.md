# Proposal: Add Local Ingest Metadata Enrichment

## Intent

Reduce incorrect manual catalog metadata by recovering title and authors from a selected PDF or EPUB before registration, entirely locally. The user remains the final authority; suggestions are editable and retain evidence.

## Scope

### In Scope
- Recovery priority: PDF Info/XMP; EPUB OPF; first-page text; normalized filename fallback; then local OCR for scanned PDFs only when prior evidence is insufficient.
- An Import Engine-owned inspection flow with a concrete local OCR provider and bounded, observable, cancellable work.
- Browser prefill with per-value provenance/confidence and explicit review before the existing ingest request.
- Provenance persistence for accepted metadata without changing source bytes or server-assigned identities.
- Unit, integration, browser, and Docker-local evidence for success, missing/conflicting fields, scans, and OCR failure.

### Out of Scope
- External catalog, DOI/ISBN, AI, cloud OCR, or network lookup; a later capability may add opt-in per-document consent.
- Automatic acceptance, silent overwrite of user input, bulk enrichment, and formats beyond PDF/EPUB.

## Capabilities

### New Capabilities
- `local-ingest-metadata-enrichment`: Offline, evidence-ranked title/author suggestions with local OCR fallback.

### Modified Capabilities
None; `openspec/specs/` has no baseline capability specifications.

## Approach

Add versioned inspection contracts and an Import Engine adapter: deterministic parsers first, packaged local OCR only if needed. Bound bytes/pages/time, classify failures, and emit redacted diagnostics. The browser displays provenance/confidence and submits only user-confirmed metadata through existing ingest. The Master Library records accepted provenance; derived OCR output is not authoritative.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `packages/import/`, `packages/ocr/` | Modified | Pipeline, provider, limits, outcomes |
| `packages/contracts/src/library.ts` | Modified | Inspection/provenance contracts |
| `apps/master-library-direct-streaming-server/` | Modified | Authorized local inspection boundary |
| `apps/master-library-local-browser/` | Modified | Prefill, review, failure UX |
| `packages/master-storage/` | Modified | Accepted metadata provenance |
| `01-Implementation/01-MasterLibrary/` | Modified | Import, privacy, operations, testing guidance |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| OCR cost or malformed PDFs | Medium | Strict limits, cancellation, classified fallback |
| Incorrect suggestion | Medium | Evidence ranking, visible provenance, confirmation |
| Content exposure | Low | No external calls; redacted local diagnostics |

## Rollback Plan

Disable inspection and prefill while retaining manual ingest. Keep accepted metadata and immutable provenance; do not delete source bytes or identities.

## Dependencies

- A supported locally packaged OCR provider and runtime/model distribution.

## Success Criteria

- [ ] PDF/EPUB suggestions follow local precedence and remain editable.
- [ ] Scanned PDFs use bounded local OCR only when needed.
- [ ] No content or metadata leaves local deployment for enrichment.
- [ ] Manual ingest remains available if inspection fails.
