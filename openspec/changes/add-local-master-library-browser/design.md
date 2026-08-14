# Design: Add Local Master Library Browser

## Technical Approach

Add a Docker Desktop-only browser BFF and static panel behind the TLS proxy. Its `HttpOnly`, `Secure`, `SameSite=Strict` session cookie is translated server-side into a short-lived HMAC bearer credential. The BFF consumes protected v1 catalog, content, and acquisition-initiation endpoints over HTTPS; it never receives PostgreSQL, filesystem paths, storage mounts, or a bypass token. `local` is an explicit delivery profile; deployment rejects every local-auth reference before listening.

## Architecture Decisions

| Decision | Choice | Alternative / rationale |
|---|---|---|
| Panel boundary | Dependency-free Node HTTP BFF plus HTML/CSS/JS | Browser-held bearer tokens expose protected credentials. |
| Local identity | Ephemeral `admin@knowledgeos.local`; startup password hash and HMAC credentials, with an opt-in local Docker secret password source | Static fixture tokens cannot meet expiry or one-time disclosure. |
| Handoff | Protected `POST /v1/master-library/acquisitions` accepts publication/version, named Local Library, and `Idempotency-Key`; returns receipt + manifest | Direct content download is not an explicit acquisition handoff. |
| Receipt state | PostgreSQL Master operational journal stores idempotency fingerprint and receipt only | It creates no Local Library/Personal Knowledge data and survives retry/restart. |
| Profiles | Add `local`; retain `test`/`deployment`; reject `LOCAL_BROWSER_*`, `local://`, or local ports in deployment | Reusing `test` obscures the security boundary. |

## Data Flow

```text
operator -> HTTPS nginx `/` -> browser BFF
  login: password -> cookie
  catalog/download/handoff: cookie -> signed bearer -> HTTPS nginx `/v1`
  -> protected Master Library -> credential + authorization boundary
  -> handoff receipt/manifest (not Local Library work)
```

By default, the launcher generates mode-0600 password/signing-secret files, prints the generated password once to its initiating terminal, starts Compose, and removes the generated password file after browser readiness. An operator MAY instead set `MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE` to an absolute, nonempty, regular mode-0600 file outside the repository. The launcher validates that file before Compose and passes its path only to the Compose Docker-secret declaration; it neither copies, prints, logs, nor removes its content. This opt-in is Docker Desktop-local only and is excluded from NAS and deployment configuration. The BFF hashes/drops the raw password, keeps sessions memory-only, validates `Origin` on state changes, and logs only correlation/outcome. Proxy routes `/v1/` and health to Master Library, all other paths to the browser. Browser has no database/files/operations mounts.

On `POST /v1/master-library/acquisitions`, authorize `publication.acquire`, validate stable identities and availability, read the already-authorized manifest, and atomically insert/find `(subject, idempotencyKey)` with a canonical request fingerprint. Same fingerprint returns the original receipt/manifest; a differing fingerprint returns `operation.conflict`; validation/unavailable failures create no receipt. The server never downloads content, writes a Local Library, starts local processing, or accepts Personal Knowledge.

## File Changes

| File | Action | Description |
|---|---|---|
| `packages/contracts/src/library.ts` | Modify | Export versioned initiation payload, accepted receipt/manifest response, and classified errors. |
| `packages/master-storage/src/postgres/{migrations.ts,operations.ts}` | Modify | Add durable handoff receipt/idempotency repository and checksum migration. |
| `packages/master-library-local-development-auth/{src/index.ts,test/*.mjs,package.json}` | Create | Password/signature verifier, expiry, permissions, profile guard tests. |
| `apps/master-library-local-browser/{src/server.ts,public/*,test/*.mjs,package.json}` | Create | BFF, UI, cookie/session flow, forwarding integration tests. |
| `apps/master-library-direct-streaming-server/{src/server.ts,test/*.mjs}` | Modify | `local` profile and protected acquisition command; v1 contract/RED tests. |
| `deployment/runtime/master-library-protected-server.mjs` | Modify | Wire local adapter and handoff repository only in `local`. |
| `deployment/docker/master-library/Dockerfile` | Modify | Build/copy adapter and browser image stage or dedicated Dockerfile. |
| `deployment/production/{compose.yaml,compose.local.yaml,proxy/default.conf.template}` | Modify | Browser service, secrets, path split, local profile, no authoritative mounts. |
| `scripts/deployment/{start-local-master-library-browser.mjs,test-local-master-library-browser.mjs}` | Create | Default temporary bootstrap plus validated opt-in persistent-secret launch and TLS Docker E2E. |
| `01-Implementation/01-MasterLibrary/09-Operations/README.md` | Modify | Local boundary, receipt semantics, NAS exclusion. |

## Interfaces / Contracts

```ts
interface InitiateAcquisitionV1 {
  publicationId: string; versionId: string; targetLocalLibraryId: string;
}
interface AcquisitionHandoffAcceptedV1 {
  receipt: { acquisitionId: string; idempotencyKey: string; accepted: true };
  manifest: AcquisitionManifest;
}
```

The BFF exposes same-origin `POST /local/auth/login`, `POST /local/auth/logout`, `GET /local/api/catalog?cursor=`, `GET /local/api/publications/:id/versions/:id/content`, and `POST /local/api/acquisitions`; it forwards the original idempotency key. 401/403 clears session; 503 is unavailable with no stale retry.

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Unit | password constant-time compare, token signature/expiry, profile rejection, persistent-source absolute/regular/nonempty/0600/repository rejection | Node RED tests. |
| Storage/contract | insert/replay/conflict, validation, exact manifest/identity preservation | PostgreSQL and v1 route tests. |
| Integration | cookie flags, origin checks, catalog/download/handoff forwarding, UI states | BFF with injected v1 fetcher. |
| Docker E2E | TLS login, download, receipt replay/conflict, expiry/logout, persistent-secret non-disclosure, no mounts/log secrets, deployment refusal | disposable Compose fixture + Node cookie jar. |

## Threat Matrix

N/A — network paths are added, but no shell-command, subprocess, VCS/PR automation, or executable-file classification boundary is introduced. The launcher uses fixed Compose arguments only.

## Migration / Rollout

Add a restartable checksum migration for receipt/idempotency data; it is Master operational metadata, not Local Library state. The browser is only in `compose.local.yaml`; removal clears sessions while preserving catalog/files. G0/G1/G2 remain open and this is not NAS readiness.

## Open Questions

None.
