# iPadOS Release Assurance Specification

## Requirements

### Requirement: Release evidence and safety gates
A release MUST be reproducibly archived, signed, traceable and validated on physical iPad hardware. It SHALL include least-privilege entitlements, privacy metadata, safe diagnostics, migration and rollback evidence, TestFlight evidence and submission material. Release SHALL NOT proceed with unresolved critical security, privacy, integrity or data-loss risks.

#### Scenario: Release-candidate admission
- GIVEN an archive candidate
- WHEN release gates execute
- THEN automated, device, accessibility, privacy and recovery evidence MUST be recorded
- AND failed critical gates SHALL block TestFlight promotion.

#### Scenario: Post-release recovery
- GIVEN rollout telemetry indicates integrity failure
- WHEN release operations stop rollout
- THEN rollback MUST preserve Local Library and Personal Knowledge boundaries
- AND competing versions MUST NOT be deleted.
