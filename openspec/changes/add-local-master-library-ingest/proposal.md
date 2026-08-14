# Proposal: Add Local Master Library Ingest

## Intent

Let local operators register PDF and EPUB sources into the authoritative Master Library, then browse and download them. Preserve authority, identity, source bytes, provenance, and recovery.

## Scope

### In Scope
- Authorized HTTPS upload and metadata registration for PDF and EPUB.
- Evidence-based type detection, size limits, checksums, duplicate evidence, errors, and status feedback.
- Durable staging, promotion, catalog registration, restart reconciliation, and redacted records.
- Browser upload/status UI and Docker TLS E2E.

### Out of Scope
- Local Library writes, Personal Knowledge, annotations, synchronization, or acquisition execution.
- NAS capacity/retention policy, antivirus/malware scanning, OCR, enrichment, thumbnails, and NAS readiness.
- Broad format support, bulk import, user management, or delivery authorization changes.

## Capabilities

### New Capabilities
- `master-library-authoritative-ingest`: Authorized PDF/EPUB intake and Master registration.
- `local-master-library-ingest-panel`: Local browser upload, metadata, and status.

### Modified Capabilities
None; `openspec/specs/` has no existing capability specifications.

## Approach

Add protected ingest with `publication.ingest`. The BFF forwards multipart input without exposing credentials. The server assigns stable operation/publication/version/Knowledge Object identities; stages bytes; validates signatures, size, and metadata; computes a checksum; journals provenance; then promotes and registers the catalog. PostgreSQL and files are not one transaction, so reconciliation resolves incomplete operations before readiness. Only complete records are browseable.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `packages/contracts/` | Modified | Versioned ingest DTOs, metadata, status, errors |
| `packages/master-storage/` | Modified | Staging journal, registration, migration, reconciliation |
| `apps/master-library-direct-streaming-server/` | Modified | Protected ingest and recovery |
| `apps/master-library-local-browser/` | Modified | Upload BFF and UI |
| `deployment/`, `scripts/deployment/` | Modified | Local Docker E2E |
| `01-Implementation/01-MasterLibrary/` | Modified | Boundary and recovery guidance |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Interrupted file/database promotion | Medium | Journal checkpoints, reconciliation, restart E2E |
| Malformed or oversized input | Medium | Signature/type/size validation before registration |
| Duplicate or path-based identity | Medium | Checksum evidence; server-assigned stable IDs; paths remain storage details |
| Browser scope leak | Low | BFF-only credentials, auth tests, no Local/Personal mounts |

## Rollback Plan

Disable ingest routes/UI and retain journals, files, catalog records, identities, and provenance for reconciliation. Rollback never deletes authoritative source bytes.

## Dependencies

- Protected server, reconciliation, BFF, proxy, Docker composition.

## Success Criteria

- [ ] Authorized operators upload validated PDF/EPUB and browse/download the publication.
- [ ] Denied, invalid, unsupported, oversized, duplicate, and interrupted uploads return classified status without corrupting authority.
- [ ] Restart reconciliation preserves evidence and decides outcomes before protected traffic is ready.
- [ ] Docker Desktop proves HTTPS ingest without NAS claims or Local/Personal data.
