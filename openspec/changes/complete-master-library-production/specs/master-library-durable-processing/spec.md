# Master Library Durable Processing Specification


## Requirements

### Requirement: Idempotent Resumable Processing
The system MUST assign durable operation and correlation identities to retryable processing. Processing workers MUST run as application containers and persist checkpoints, ownership, outcome, and classified failure to the declared PostgreSQL and application-owned NAS mounts before reporting completion. Restarts or replacement of a worker container MUST release or recover leases according to durable expiry; retries MUST be idempotent and resumable without duplicate authoritative side effects.

#### Scenario: Resume after worker interruption
- GIVEN a worker stops after a durable checkpoint
- WHEN a compatible worker resumes the operation
- THEN it continues from the checkpoint without duplicating publication state

#### Scenario: Reject an invalid processing transition
- GIVEN an operation requests an unsupported state transition
- WHEN validation occurs
- THEN the system records a validation failure and preserves prior evidence

#### Scenario: Recover after worker container replacement
- GIVEN a worker container is stopped after recording a checkpoint
- WHEN a replacement container starts with the same persistent mounts
- THEN it recovers the expired lease and resumes from the checkpoint without duplicate publication state
