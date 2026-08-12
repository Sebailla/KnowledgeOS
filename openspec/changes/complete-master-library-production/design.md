# Design: Complete Master Library Production

## Technical Approach

PR6 corrects the Docker composition gap: the image must run the PR1–PR4 `MasterDirectStreamingServer`, not the legacy file server. It composes PostgreSQL catalog/manifest adapters, a filesystem reader bound to those descriptors, recovery/readiness, and injected delivery ports. Docker Desktop proves the protected proxy path with disposable data; it does not satisfy NAS gates.

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|---|---|---|---|
| Runtime | Build the direct-streaming app and its workspace dependencies into the image; replace the legacy runtime entrypoint with a compiled composition root. | Retaining a parallel lightweight file server. | One executable path prevents authorization, range, and audit bypass. |
| Catalog | Add an append-only PostgreSQL migration and a `PostgresMasterCatalogReader` that performs deterministic keyset pagination and manifest lookup from durable records. | In-memory catalog or filesystem listing. | PostgreSQL owns catalog metadata; paths are not public identity. |
| Metadata gap | Store required catalog metadata (`knowledgeObjectId`, title, authors) separately from payload descriptors. Existing descriptor rows remain preserved but are not browsable until registered; reconciliation records the gap. | Deriving identity/title from path or publication ID. | Avoids inventing domain identity or silently changing authority. |
| Reader | Make the node-stream reader depend on an async descriptor lookup port, validate the resolved file stays below the publication root, and stream only the catalog-selected version. | Reader coupled to `InMemoryMasterStorageCatalog`. | The production reader and tests share one contract without trusting request paths. |
| Delivery ports | The composition root injects only a local fixture credential/authorizer for a `test` profile. A deployment profile rejects fixture references and requires a registered non-fixture port. | Hard-coded tokens or pretending a NAS issuer exists. | Local E2E is real but cannot become NAS security evidence. |
| Readiness | Real server exposes unprotected liveness/readiness only after database connectivity, migration/reconciliation markers, and recovery succeed. | Marker-only legacy health server. | The proxy cannot route before the actual protected server is viable. |

## Data Flow

```text
Docker TLS client → nginx → MasterDirectStreamingServer
                             ├─ authorize injected principal
                             ├─ PostgresMasterCatalogReader → PostgreSQL
                             └─ DescriptorReader → publications bind mount
migrator → migration/reconcile markers → composition readiness → proxy traffic
```

The local-only fixture seeder writes a publication and its catalog metadata through the same PostgreSQL adapter, then the E2E invokes catalog, manifest, HEAD/range, unauthorized, and legacy-path rejection through TLS.

## File Changes

| File | Action | Description |
|---|---|---|
| `packages/master-storage/src/postgres/{migrations,catalog}.ts` | Modify | Catalog metadata migration, keyset browse, manifest lookup, descriptor port. |
| `packages/master-storage-node-stream/src/index.ts` | Modify | Async descriptor-port reader and root/path validation. |
| `apps/master-library-direct-streaming-server/src/{server,runtime}.ts` | Modify/Create | Readiness port and production composition root. |
| `deployment/docker/master-library/Dockerfile` | Modify | Build/copy direct server and required workspace packages; start compiled runtime. |
| `deployment/runtime/master-library-{server,fixture-seed}.mjs` | Replace/Create | Thin launcher and local-only data seeder; remove legacy serving behavior. |
| `deployment/production/{compose.yaml,compose.local.yaml}` | Modify | Wire real runtime and local fixture seeder; preserve private backend. |
| `scripts/deployment/run-production-operations.mjs` | Modify | Assert actual protected TLS catalog/manifest/content behavior. |
| `apps/*/test`, `packages/*/test`, `deployment/production/README.md`, `01-Implementation/01-MasterLibrary/` | Modify | RED coverage and composition/runbook traceability. |

## Interfaces / Contracts

```ts
interface MasterPublicationDescriptorPort {
  get(publicationId: string, versionId: string): Promise<StoredDescriptor | undefined>;
}
interface MasterCatalogReader {
  browse(cursor?: string): Promise<MasterCatalogPage>;
  manifest(publicationId: PublicationId, versionId: VersionId): Promise<AcquisitionManifest>;
}
interface RuntimeReadiness { ready(): Promise<boolean>; }
```

Cursor encodes only the last stable publication/version key; malformed or stale cursors return a classified compatibility error. Missing metadata is not synthesized. Missing descriptor/file, invalid catalog association, or escaped relative path returns a classified not-found/integrity failure and redacted audit.

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | keyset cursor, metadata omission, descriptor/root validation, profile guard | RED then adapter tests |
| Integration | PostgreSQL browse/manifest and reader against catalog-selected file | ephemeral PostgreSQL/files |
| E2E | real image → migrate → local seed → HTTPS proxy catalog/manifest/HEAD/range/deny | Docker Desktop Compose fixture |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary is introduced.

## Migration / Rollout

PR6 adds a forward migration; it never infers metadata for old descriptors. Deploy only after backup/preflight; roll back image/configuration while retaining the new catalog table and files. NAS G0/G1/G2 remain release gates.

## Open Questions

- [ ] G0 must choose the non-fixture credential and authorization port before NAS deployment.
