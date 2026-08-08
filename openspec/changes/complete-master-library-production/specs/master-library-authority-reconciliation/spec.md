# Master Library Authority Reconciliation Specification


## Requirements

### Requirement: Durable Authoritative State
The system MUST preserve stable identity, version history, provenance, and integrity metadata across catalog and authoritative files. PostgreSQL MUST run in its own container and persist its cluster only to a dedicated, disk-backed NAS mount. Master publication and operation/journal files MUST persist only to distinct disk-backed NAS mounts owned by the application container. The application container MUST NOT write PostgreSQL data; PostgreSQL MUST NOT write publication or operation files; neither service MAY use anonymous or ephemeral volumes for authoritative state. The system SHALL use versioned, restartable migrations and MUST detect missing, orphaned, duplicate, or mismatched representations without silently deleting authoritative content.

#### Scenario: Reconcile an interrupted publication write
- GIVEN an interrupted write leaves catalog and file state divergent
- WHEN reconciliation runs
- THEN it identifies the stable operation and preserves recoverable evidence
- AND it restores or reports a consistent state

#### Scenario: Recover an unknown migration outcome
- GIVEN a migration ends with unknown commit status
- WHEN recovery resumes it
- THEN it reconciles by durable identity before retry

#### Scenario: Recreate a database container
- GIVEN the PostgreSQL container is recreated with the same dedicated NAS data mount
- WHEN PostgreSQL becomes ready
- THEN catalog, journal, migration history, identities, and provenance are available unchanged
- AND no application container has written into the PostgreSQL mount
