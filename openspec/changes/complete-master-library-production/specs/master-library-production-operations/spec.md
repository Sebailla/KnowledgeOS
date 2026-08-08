# Master Library Production Operations Specification


## Requirements

### Requirement: Recoverable Observable Container Operation
The system MUST run the production Master Library application services, PostgreSQL, proxy, and workers as declared Compose containers; host-installed production application or database runtimes are prohibited. It MUST provide readiness, deployment, backup, restore, monitoring, and alerting evidence for catalog and authoritative files. The Compose topology MUST declare an internal-only PostgreSQL network, pinned image references, restart policies, health checks, and dependency readiness: application/workers MAY start only after PostgreSQL is healthy, and proxy traffic MAY begin only after application readiness is healthy.

Authoritative persistence MUST use provisioned disk-backed NAS bind mounts under one configured host root: `postgres/` is exclusively owned by the PostgreSQL container; `publications/` and `operations/` are exclusively owned by application/worker containers; `backups/` is write-only for the backup job and MUST NOT be a PostgreSQL or application data mount. Compose configuration MUST name every mount and its service owner, reject anonymous authoritative volumes, and use no mount shared read-write by PostgreSQL and application containers. The deployment runbook MUST verify mount existence, capacity, UID/GID ownership, and writability before start.

Complete backups SHALL include PostgreSQL, publication files, operation/journal files, image/configuration/migration identifiers, required identities, provenance, versions, integrity, and synchronization metadata; restore MUST validate integrity in an isolated container stack before traffic resumes. Upgrade MUST be preflighted with a backup, compatible migration, readiness, and reconciliation. Rollback MUST stop writes, retain all persistent mounts, restore/reconcile as needed, and return to the prior pinned images/configuration without deleting data. Operations MUST define owners, retention, RPO/RTO, and redacted health diagnostics.

#### Scenario: Verified restore
- GIVEN a complete encrypted backup and non-production recovery environment
- WHEN restore is performed
- THEN identity and integrity validation passes before readiness becomes healthy

#### Scenario: Incomplete backup
- GIVEN a backup omits an authoritative component
- WHEN it is recorded or restored
- THEN the system labels it partial and prevents a complete-recovery claim

#### Scenario: Restart the application container
- GIVEN PostgreSQL and application authoritative mounts are healthy
- WHEN the application container restarts
- THEN it waits for PostgreSQL health, performs no destructive initialization, reconciles durable state, and becomes ready only after successful verification

#### Scenario: Failed upgrade rollback
- GIVEN a release fails after an attempted migration or image upgrade
- WHEN the rollback procedure runs
- THEN writes stop, persistent mounts are retained, the prior pinned stack is restored or a verified backup is restored in isolation
- AND traffic remains disabled until reconciliation and readiness succeed
