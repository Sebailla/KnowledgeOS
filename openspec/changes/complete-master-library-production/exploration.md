## Exploration: complete-master-library-production

### Current State
KnowledgeOS defines the NAS Master Library as authoritative for the Master Catalog, source publications, provenance, and publication versions; Local Libraries hold explicitly acquired offline copies, while Personal Knowledge is prohibited from the NAS boundary. The repository has early building blocks: `MasterPublicationStorage` stages and commits checksummed files, a contract-level catalog/acquisition model, a sync server with optional Bearer authentication, and NAS compose/backup scripts. It is not production-operable: the file server is unauthenticated HTTP with only a liveness route; it has no catalog/acquisition API, authorization policy, TLS termination, real PostgreSQL catalog integration, durable processing workflow, or operational proof for restore and alerting.

### Affected Areas
- `packages/contracts/src/library.ts` — existing browse/acquisition contracts require an implementable, versioned server API.
- `packages/master-storage/src/index.ts` — in-memory catalog and filesystem-only commit path must become durable, reconciled authoritative storage.
- `apps/master-library-direct-streaming-server/src/server.ts` and `deployment/runtime/master-library-server.mjs` — delivery surface must gain catalog, authorization, range integrity semantics, readiness, and protected HTTPS deployment.
- `apps/sync-server/src/server.ts` and `packages/sync/src/http/MasterLibraryTransport.ts` — current optional sync Bearer token is distinct from publication acquisition and must not collapse personal sync into Master Library access.
- `deployment/production/compose.yaml` and `scripts/deployment/*.sh` — deployment, secrets, backup/restore, TLS boundary, monitoring, and release evidence.
- `01-Implementation/01-MasterLibrary/` and `01-Implementation/18-Production/` — requirements, contracts, persistence, operations, traceability, and evidence must be brought from templates/mechanics to verified production guidance.

### Approaches
1. **Gated vertical production slices** — establish contracts and authority guards first, then persistent catalog/storage, protected delivery, processing, and operational release evidence.
   - Pros: Preserves the frozen Master/Local/Personal boundaries; each slice is independently testable and rollbackable; external prerequisites block only dependent slices.
   - Cons: Requires more planning and actual NAS evidence before release closure.
   - Effort: High.

2. **Harden the existing file server in place** — add TLS and a token to the HTTP file route, then iterate on catalog and operations later.
   - Pros: Fastest apparent path to an iPad-accessible endpoint.
   - Cons: Does not provide a versioned catalog/acquisition contract, durable authoritative catalog, authorization lifecycle, processing guarantees, or recovery proof; risks treating files as the Master Library.
   - Effort: Medium, but unacceptable for production completion.

### Recommendation
Use gated vertical production slices. First contract the public catalog/acquisition API and explicit authorization model, including stable IDs, version selection, checksum, range resume, cancellation, failure categories, compatibility, and a hard prohibition on Personal Knowledge writes. Then implement durable PostgreSQL-plus-filesystem authority with reconciliation and processing checkpoints; deploy it behind a verified TLS/auth boundary; finally complete backup/restore rehearsals, monitoring/alerting, upgrade/rollback, and release evidence. Maintain a dependency gate for real NAS hostname/certificates, secret provisioning/rotation, encrypted backup target and retention owner, alert-routing owner, and a reachable NAS environment. No external state is assumed by this exploration.

### Risks
- The current `master-library` service receives a database URL and secret but its runtime is a standalone HTTP file server; declaring it authoritative before durable catalog integration would violate Master Library requirements.
- Existing direct HTTP ports and unauthenticated file delivery expose publication content; TLS and least-privilege authorization must be implemented and evidenced, not merely documented.
- Backup scripts checksum archives but do not prove encrypted off-NAS retention, RPO/RTO, non-destructive restore, post-restore reconciliation, or operational ownership.
- Processing, migration, and recovery need durable journals/checkpoints; retrying filesystem and database effects without reconciliation risks incomplete authority state.
- Any design that writes annotations, reading state, or other Personal Knowledge to NAS must be rejected; acquisition remains read-only from NAS to a Local Library.

### Ready for Proposal
Yes — with production completion expressed as a chained, gated SDD change. The proposal must make external NAS infrastructure and operational-evidence gates explicit blockers, and it must not claim release readiness until each is verified.
