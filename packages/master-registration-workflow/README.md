# @knowledgeos/master-registration-workflow

Coordinates Master Library registration, authoritative file storage, PostgreSQL storage catalog and outbox events.

## Guarantees

- content is staged before registration;
- fingerprint-based deduplication happens before new identity is committed;
- storage catalog uses the active transaction;
- outbox events are appended inside the Unit of Work;
- duplicate content reuses the canonical Master Publication;
- reconciliation can detect catalog entries whose objects are missing or corrupt.
