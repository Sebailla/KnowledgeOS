# Master Library Production Operations Specification

## Requirements

### Requirement: Locally Verifiable Container Operation
The system MUST run Master Library application services, PostgreSQL, proxy, workers, and the one-shot migrator as declared Compose containers; host-installed production application or database runtimes are prohibited. PR5 MUST be executable and proven in Docker Desktop before a NAS exists. The local harness SHALL use a disposable, repository-controlled bind-mount fixture root and MUST NOT represent that root as NAS persistence.

The Compose topology MUST declare an internal-only PostgreSQL network, pinned image references, restart policies, health checks, and dependency readiness: application/workers MAY start only after PostgreSQL is healthy and migration succeeds; proxy traffic MAY begin only after application readiness is healthy. Local fixture directories for `postgres/`, `publications/`, `operations/`, and `backups/` MUST have declared owners and MUST NOT be anonymous or shared read-write between PostgreSQL and application containers. `backups/` MUST NOT be a PostgreSQL or application data mount.

Complete local backup evidence SHALL include PostgreSQL, publication files, operation/journal files, image/configuration/migration identifiers, identities, provenance, versions, integrity, and synchronization metadata. Restore MUST validate integrity in an isolated local container stack before readiness becomes healthy. Upgrade MUST be preflighted with backup, compatible migration, readiness, and reconciliation. Rollback MUST stop writes, retain every fixture mount, restore/reconcile as needed, and return to the prior pinned images/configuration without deleting data. Diagnostics MUST be redacted. The Docker Desktop evidence MUST exercise catalog, manifest, authorization and content delivery through the image entrypoint and TLS proxy, not a standalone file server or mock.

#### Scenario: Verify operations locally in Docker Desktop
- GIVEN Docker Desktop and a disposable local bind-mount fixture root
- WHEN the PR5 operation harness provisions the declared Compose topology
- THEN it runs the one-shot migration and exposes traffic only after database health, reconciliation, and readiness pass

#### Scenario: Verified isolated local restore
- GIVEN a complete local backup and isolated Docker Desktop recovery stack
- WHEN restore is performed
- THEN identity and integrity validation passes before readiness becomes healthy

#### Scenario: Incomplete local backup
- GIVEN a local backup omits an authoritative component
- WHEN it is recorded or restored
- THEN the system labels it partial and prevents a complete-recovery claim

#### Scenario: Recreate the application container
- GIVEN PostgreSQL and application fixture mounts are healthy
- WHEN the application container is recreated
- THEN it waits for PostgreSQL health and migration success, performs no destructive initialization, reconciles durable state, and becomes ready only after successful verification

#### Scenario: Failed local upgrade rollback
- GIVEN a local release fails after an attempted migration or image upgrade
- WHEN the rollback procedure runs
- THEN writes stop, fixture mounts are retained, the prior pinned stack is restored or a verified local backup is restored in isolation
- AND traffic remains disabled until reconciliation and readiness succeed

#### Scenario: Prove image composition through the protected proxy
- GIVEN the Docker Desktop fixture stack is migrated and seeded through durable adapters
- WHEN the operations harness sends authorized and unauthorized HTTPS catalog, manifest and range requests through the declared proxy
- THEN the real protected server responds with its contract, readiness and audit behavior
- AND a direct legacy file route cannot deliver content

### Requirement: NAS Operations Release Gates
Before NAS deployment or release acceptance, the deployment record MUST distinguish locally proven container behavior from unverified NAS facts. It MUST record G1: encrypted off-NAS backup target, retention, RPO/RTO, alert owner, and assigned operational owner. It MUST record G2: NAS persistence root/capacity/backup space, container UID/GID ownership, Compose runtime/version, pinned image source/retention, and rollback owner. Missing G1 or G2 values MUST block NAS deployment and release acceptance but SHALL NOT block local PR5 implementation or Docker Desktop tests.

#### Scenario: Prevent an unevidenced NAS operations release
- GIVEN PR5 container-operation tests have passed locally in Docker Desktop
- WHEN G1 or G2 information is absent from the release checklist
- THEN the procedure reports a NAS release/deployment gate failure and does not claim NAS readiness or start NAS traffic

### Requirement: Release Delivery Configuration Gate
The deployment procedure MUST distinguish local protected-delivery verification from NAS release readiness. It SHALL permit local PR4 tests with generated test TLS material and fixture credentials, but before NAS deployment or release acceptance it MUST require recorded concrete values for the public hostname, certificate authority and renewal owner, credential issuer/revocation/enrollment process, secret-rotation owner, and authorization owner. Missing values MUST block deployment and release acceptance without changing local implementation status.

#### Scenario: Prevent an unevidenced NAS delivery release
- GIVEN PR4 protected-delivery tests have passed locally
- WHEN the release checklist omits a concrete delivery value or operational owner
- THEN the procedure reports a release/deployment gate failure and does not start NAS delivery traffic
