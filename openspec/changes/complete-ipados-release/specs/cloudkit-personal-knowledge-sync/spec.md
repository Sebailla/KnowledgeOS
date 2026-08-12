# CloudKit Personal Knowledge Sync Specification

## Requirements

### Requirement: Versioned personal knowledge convergence
The application MUST synchronize approved Personal Knowledge through provider-neutral public contracts and a CloudKit adapter. Envelopes SHALL be versioned; competing versions and tombstones MUST remain recoverable. The adapter MUST NOT write to the NAS or expose CloudKit records to UI or Domain contracts.

#### Scenario: Concurrent annotation update
- GIVEN two devices change one annotation offline
- WHEN both synchronize
- THEN no competing version MUST be silently discarded
- AND the user SHALL receive a recoverable resolution state.

#### Scenario: Deleted knowledge recovery
- GIVEN a synced deletion is later retried
- WHEN an older operation arrives
- THEN the tombstone MUST prevent resurrection
- AND recovery evidence SHALL retain stable identities.
