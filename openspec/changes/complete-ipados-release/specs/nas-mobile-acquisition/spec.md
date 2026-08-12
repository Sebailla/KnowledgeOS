# NAS Mobile Acquisition Specification

## Requirements

### Requirement: Resilient explicit acquisition
The application MUST browse the NAS catalog over authenticated HTTPS and acquire publications only after user selection. Transfers SHALL be resumable and idempotent, preserve identity and provenance, and expose progress, cancellation and recoverable failure. Acquisition MUST NOT synchronize Personal Knowledge to the NAS.

#### Scenario: Resumed acquisition
- GIVEN an interrupted selected-publication transfer
- WHEN connectivity returns and the user resumes it
- THEN it SHALL reconcile by operation and publication identity
- AND it SHALL retain one Local Library payload.

#### Scenario: NAS unavailable offline
- GIVEN the NAS is unavailable
- WHEN a user opens an acquired publication
- THEN offline reading MUST remain available
- AND acquisition state SHALL explain the failure.
