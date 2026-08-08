# Design: Complete Master Library Production

## Technical Approach

Deliver five gated slices. The NAS owns only Master Catalog, source publications, versions, and provenance. HTTPS acquisition is read-only into Local Libraries; every Master boundary rejects Personal Knowledge.

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|---|---|---|---|
| Public boundary | Versioned catalog and acquisition routes; retain content alias temporarily. | File URLs; `/v1/sync`. | Explicit compatibility while sync remains Personal Knowledge only. |
| Authority | PostgreSQL owns catalog/journal; immutable files own payload; journal plus reconciliation. | Filesystem-only, database-only, 2PC. | Rename and DB commit are not atomic. |
| Processing | Lease-backed PostgreSQL jobs with stable operation IDs and checkpoints. | In-memory queue; synchronous work. | Restartable, idempotent effects. |
| Security edge | Proxy terminates TLS; API is backend-only; scoped credentials. | Exposed HTTP; sync token. | Separate security domains. |
| Runtime/persistence | Compose runs proxy, API/workers and PostgreSQL separately; declared disk-backed NAS bind mounts. | Host runtime; anonymous volumes; shared mount. | Reproducible lifecycle and exclusive ownership. |
| Operations | Pinned images/config, preflight migration, encrypted off-NAS backup, restore rehearsal, owned alerts. | Best-effort scripts. | Production needs evidence and recovery. |

## Data Flow

~~~
Client ─TLS─> proxy container ─> API/worker containers
                 │                     ├─ PostgreSQL ─> `/nas/.../postgres`
                 │                     ├─ publications ─> `/nas/.../publications`
                 │                     └─ operations ─> `/nas/.../operations`
                 └─ traffic only after API readiness
~~~

Catalog pagination is stable by publication ID. Acquisition authorizes an immutable version and emits checksum/ETag, HEAD, validated ranges and cancellation. Ingest stages a file, journals it, promotes it atomically, then commits descriptor/provenance/job; reconciliation retains evidence on failure.

PostgreSQL exclusively owns `postgres`; API/workers own `publications` and `operations`; a backup job owns `backups`. No authoritative mount is anonymous, ephemeral, or shared read-write between database and app. PostgreSQL stays on the internal Compose network; only proxy publishes ingress. Recreate/restart preserves mounts. Upgrade is backup → preflight migration → start → reconcile → readiness. Rollback stops writes, retains mounts, reverts pinned images/config, then restores in isolation if required.

## File Changes

| File | Action | Description |
|---|---|---|
| `packages/contracts/src/library.ts` | Modify | Catalog/acquisition DTOs, cursor, manifest, errors. |
| `packages/master-storage/src/postgres/*` | Create | Migrations, catalog, journal/jobs, reconciliation. |
| `packages/master-storage/src/index.ts` | Modify | Production adapters and test doubles. |
| `apps/master-library-direct-streaming-server/{src,test}` | Modify | Protected API, readiness, contract/recovery tests. |
| `deployment/production/{compose.yaml,README.md,env.example}` | Modify | Pinned images, networks, bind mounts, readiness, operations. |
| `scripts/deployment/*` | Modify | Backup, isolated restore, validation and evidence. |
| `01-Implementation/01-MasterLibrary/*` | Modify | Traceability and runbooks. |

## Interfaces / Contracts

```ts
interface MasterCatalogPage { readonly items: readonly PublicationSummary[]; readonly nextCursor?: string; readonly protocolVersion: "v1"; }
interface AcquisitionManifest { readonly publicationId: PublicationId; readonly versionId: VersionId; readonly contentFingerprint: string; readonly byteLength: number; readonly mediaType: string; }
type MasterLibraryErrorCode = "authorization.denied" | "catalog.not-found" | "range.invalid" | "integrity.failed" | "operation.conflict" | "infrastructure.transient";
```

Failures return a stable code and correlation ID without secrets or Personal Knowledge. Catalog/acquisition and administrative roles are separate.

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | cursor, policy, idempotency, journal/reconcile decisions | RED duplicate/retry/interruption cases |
| Integration | PostgreSQL/files, migrations, ranges, auth, lease and restart | ephemeral Compose + filesystem |
| E2E/operations | acquisition, recreate, backup/restore, upgrade/rollback | non-production containerized NAS evidence |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary is introduced.

## Migration / Rollout

PR1 contracts → PR2 authority → PR3 processing → PR4 protected delivery → PR5 operations. Each targets its predecessor and splits at 400 lines. Migrations are append-only and restartable. Deploy backup → preflight → migrate → reconcile → readiness → traffic; stop writes before rollback.

## External Gates

- **G0 before PR4:** hostname, trusted TLS/renewal owner, credential provisioning/rotation, authorization owner.
- **G1 before PR5:** encrypted off-NAS target, retention, RPO/RTO, alert owner, non-production containerized NAS/PostgreSQL.
- **G2 before PR5:** NAS persistence root/capacity/backup space, service UID/GID ownership, Compose runtime, pinned image source/retention.
- **Release:** container topology, migration/rollback, restore, security/range/load evidence and named acceptance.

## Open Questions

- [ ] Select PostgreSQL driver/migration implementation consistent with the deployment image before PR2.
- [ ] Define credential issuer, revocation and enrollment with the security owner.
