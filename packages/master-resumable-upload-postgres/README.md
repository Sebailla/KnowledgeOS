# @knowledgeos/master-resumable-upload-postgres

PostgreSQL persistence and distributed coordination for resumable uploads.

## Includes

- durable session metadata;
- durable chunk index;
- filesystem-backed chunk blob abstraction;
- completion leases;
- lease expiry and takeover;
- idempotent completion records;
- distributed completion coordinator.

This package enables multiple server instances to safely handle the same upload session.
