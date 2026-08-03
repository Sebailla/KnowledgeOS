# AGENTS

This file applies to `01-Implementation/06-Infrastructure`.

- Infrastructure SHALL implement Architecture V4 without redefining Domain authority.
- KnowledgeOS Server and PostgreSQL SHALL run in separate containers on NAS.
- PostgreSQL data and authoritative publication files SHALL use independent persistent volumes.
- Personal Knowledge SHALL NOT be persisted in Master Library infrastructure.
- Secrets, backup material and telemetry SHALL follow least privilege and privacy policy.
- Migrations, deployment and recovery SHALL be resumable, observable and tested.
