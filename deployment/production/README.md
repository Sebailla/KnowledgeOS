# KnowledgeOS Production Deployment

This directory defines the container topology and local validation procedure; it is **not** evidence that a NAS deployment exists or is release-ready.

## Local PR5 validation — Docker Desktop

Use Docker Desktop and Compose to prove the production-shaped topology before NAS deployment:

1. Provision a disposable local bind-mount fixture root containing `postgres/`, `publications/`, `operations/`, and `backups/`.
2. Start the declared proxy, PostgreSQL, one-shot migrator, and application/worker containers.
3. Verify migration, reconciliation, readiness-gated traffic, restart/recreate, backup, isolated restore, upgrade, and rollback.
4. Retain only redacted local evidence; remove fixture data when the test completes.

The fixture root is test data. It does not establish NAS paths, capacity, filesystem permissions, container UID/GID, backup space, or a production owner. Docker Desktop validates topology and recovery behavior; it does not validate a NAS release.

## NAS deployment and release gates

Do not deploy to NAS or claim production readiness until the deployment record supplies:

- **G0:** public hostname, certificate authority/renewal owner, credential issuer/revocation/enrollment, secret-rotation owner, and authorization owner.
- **G1:** encrypted off-NAS target, retention, RPO/RTO, alert owner, and assigned operational owner.
- **G2:** NAS persistence root/capacity/backup space, service UID/GID ownership, Compose runtime/version, pinned-image source/retention, and rollback owner.

`compose.yaml` and `env.example` deliberately contain no concrete NAS hostname, certificate, credential, storage path, or ownership values. Generated TLS and fixture credentials are local-test inputs only. Do not publish the `master-library` backend directly: the proxy is the only declared delivery port.

## Local fixture operations

Run `scripts/deployment/validate-production.sh --fixture-root "$(mktemp -d /tmp/knowledgeos-pr5.XXXXXX)" --plan` to create and inspect the disposable fixture layout. `backup-production.sh --fixture-root PATH` writes component archives, checksums and a complete local manifest under `PATH/backups/`; `restore-production.sh --fixture-root PATH --backup PATH/backups/TIMESTAMP` verifies that manifest and checksums before replacing fixture data. A missing manifest, checksum or authoritative component is a partial backup and is rejected.

`compose.local.yaml` is a Docker Desktop overlay only. It binds isolated fixture directories instead of declaring NAS locations, starts the one-shot migrator before the backend, and blocks proxy traffic on backend readiness. Recreate, upgrade and rollback procedures MUST retain the fixture root, stop writes, rerun migration/reconciliation, and validate an isolated restore before opening traffic. G0/G1/G2 remain unrecorded release/deployment gates.
