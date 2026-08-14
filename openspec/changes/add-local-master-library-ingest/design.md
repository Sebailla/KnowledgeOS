# Design: Add Local Master Library Ingest

## Technical Approach

Add local-profile-only `publication.ingest` to the protected v1 server. The BFF streams multipart input; the server assigns opaque IDs, stages/validates bytes, journals checkpoints, promotes within the Master volume, then registers PostgreSQL. Only complete registrations are browseable/deliverable.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Multipart | `POST /v1/master-library/publications:ingest`: one `source`, `metadata` JSON, `Idempotency-Key`; bounded streaming parser | Buffer/custom parser | No unbounded memory or boundary ambiguity. |
| Identity | Server creates `operation:`, `publication:`, `version:`, `knowledge-object:`, `source-item:`. SHA-256 is evidence. | Filename/path/checksum identity | ADR-010 opaque immutable identity. |
| Types | Declared PDF/EPUB must match `%PDF-`, or ZIP whose first uncompressed `mimetype` is `application/epub+zip` | Extension/extraction | Evidence, without archive extraction. |
| Recovery | Ingest journal + fingerprint claim before exposure; reconcile before readiness | Filesystem/DB alone | They cannot transact together. |
| Scope | Server/BFF/UI/local auth `catalog.write` require `MASTER_LIBRARY_DELIVERY_PROFILE=local`; any other enabled profile fails startup/no route | Deployment enablement | Local Docker never asserts NAS authorization/readiness. |

## Data Flow

```text
Browser ─multipart/TLS─> BFF ─same stream + bearer─> v1 server
                                           │
 staging/<operation>/source ─validate/checksum─> PostgreSQL journal
                                           │
 publications/<publication>/<version>/content ─transaction─> catalog
```

The BFF uses `fetch` with `Readable.toWeb(request)` and `duplex: "half"`, forwarding only `Content-Type`, bounded `Content-Length`, key, and server-side bearer. It never materializes a file, token, or path.

`metadata` requires title (nonblank UTF-8, ≤512) and 1–50 nonblank authors (≤256 each). Reject NUL, `/`, and `\\` in the provenance filename; it never determines storage. Local config: `MASTER_LIBRARY_INGEST_ENABLED=true`, valid integer `MASTER_LIBRARY_INGEST_MAX_BYTES` (local default 104857600), fixed types; invalid limits fail startup.

A checksum-protected migration adds `master_ingest_operations` (principal, request/key fingerprints, IDs, metadata/provenance, state, redacted failure, relative paths, timestamps) and `master_ingest_fingerprint_claims` (unique checksum → completed IDs). States: `accepted`, `staged`, `validated`, `promoted`, `registered`, `duplicate`, `rejected`, `reconciliation-required`. Same key/request replays; changed semantics return conflict. A claimed checksum returns original IDs with no second catalog row.

Stage, validate/count/hash, claim, and rename inside `MASTER_LIBRARY_FILES_ROOT`; then insert catalog metadata/provenance and mark `registered` in one database transaction. Browse/manifest select registered rows only. Recovery retains staging evidence; registers final checksum-valid bytes; otherwise marks missing/mismatched or catalog-without-byte state `reconciliation-required` and hides it. It deletes neither evidence nor source bytes.

## File Changes

| File | Action | Description |
|---|---|---|
| `packages/contracts/src/library.ts` | Modify | v1 ingest DTOs/status/errors. |
| `packages/master-storage/src/postgres/{migrations,catalog,operations,reconciliation}.ts` | Modify | Journal, claims, registration, recovery. |
| `packages/master-storage/src/ingest.ts` | Create | Stream validation/stage/promotion orchestration. |
| `apps/master-library-direct-streaming-server/src/server.ts` | Modify | `catalog.write`, multipart/status routes, redacted errors. |
| `deployment/runtime/{master-library-protected-server,master-library-migrate}.mjs` | Modify | Runtime dependencies and pre-ready recovery. |
| `apps/master-library-local-browser/src/server.ts` | Modify | Session-protected streamed ingest/status BFF. |
| `apps/master-library-local-browser/public/{index.html,app.js,app.css}` | Modify | PDF/EPUB form and status feedback. |
| `deployment/docker/master-library/Dockerfile`, `deployment/production/compose.local.yaml` | Modify | Parser and local-only config. |
| `scripts/deployment/test-local-master-library-browser.mjs` | Modify | TLS ingest/restart proof. |

## Interfaces / Contracts

```ts
interface IngestPublicationV1 { metadata: { title: string; authors: string[] }; }
interface IngestAcceptedV1 { operationId: string; publicationId: string; versionId: string; knowledgeObjectId: string; outcome: "registered" | "duplicate"; }
// GET /v1/master-library/ingest-operations/{operationId}
```

## Testing Strategy

| Layer | Coverage |
|---|---|
| Unit/contract | IDs, metadata, signatures, limits, duplicate/replay/error mapping. |
| PostgreSQL | Migration, fingerprint race, journal/recovery using disposable PostgreSQL. |
| HTTP/BFF | Auth/origin, streamed multipart, status and token/path redaction. |
| Docker E2E | TLS valid/denied/invalid/oversize/duplicate/restart, browse/download; no Local/Personal mounts or NAS claim. |

## Threat Matrix

| Boundary | Applicability | Design response / RED tests |
|---|---|---|
| Documentation-like paths | N/A — filename is provenance, never executable classification | N/A |
| Git repository selection | N/A — no VCS command | N/A |
| Commit state | N/A — no commit operation | N/A |
| Push state | N/A — no push operation | N/A |
| PR commands | N/A — no PR automation | N/A |

## Migration / Rollout

The one-shot runner applies the migration before readiness; only the local overlay sets ingest configuration. Rollback removes routes/UI but retains journal, claims, bytes, and catalog evidence for reconciliation.

## Open Questions

- [ ] None; local defaults are not NAS capacity policy.
