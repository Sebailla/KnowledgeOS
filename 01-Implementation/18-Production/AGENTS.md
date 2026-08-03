# AGENTS

This file applies to `01-Implementation/18-Production`.

- Production infrastructure SHALL preserve the authority model defined by Architecture V4.
- KnowledgeOS Server and PostgreSQL SHALL run as separate services.
- PostgreSQL data and authoritative publication files SHALL use independent persistent volumes.
- Personal Knowledge SHALL NOT be stored in the NAS Master Library.
- Deployments SHALL be reproducible, versioned, observable and recoverable.
- Every persistent change SHALL include migration and rollback or recovery guidance.
- Backups SHALL be verified through restore tests.
- Critical security, privacy, integrity and data-loss risks SHALL block production release.
