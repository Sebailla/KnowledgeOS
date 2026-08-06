# Release Governance

## Channels

- `beta`: normal public-beta builds.
- `beta-hotfix`: narrowly scoped urgent corrections from the current beta.
- `rc`: candidates promoted after beta exit gates pass.
- `stable`: production releases approved from an RC.

## Gates

Promotion requires no open P0 or P1 defect, passing regression and E2E convergence, compatible migrations, valid checksums and SBOM, sanitized diagnostics, documented known issues, and an explicit rollback procedure.

Hotfixes must be minimal, traceable, regression-tested, and merged back into all active forward channels.
