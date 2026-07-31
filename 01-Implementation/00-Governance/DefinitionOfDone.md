# Definition of Done

**Project:** KnowledgeOS  
**Section:** Implementation / Governance  
**Document:** DefinitionOfDone  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the minimum completion standard for KnowledgeOS implementation work.

## 2. Scope Definition

- The intended behavior is documented.
- Non-goals are explicit.
- Acceptance criteria are testable.
- Dependencies and risks are identified.

## 3. Architecture Compliance

- Relevant architecture documents are referenced.
- Applicable ADRs are implemented.
- Authority boundaries are preserved.
- Stable identity is used.
- Acquisition and synchronization remain separate.
- Personal Knowledge is not written to the Master Library.
- Private repositories are not bypassed.
- Public contracts are used across module boundaries.

## 4. Code Quality

- Code compiles without unresolved warnings defined as blocking.
- Static analysis passes.
- Formatting passes.
- Public APIs are documented.
- Error handling is explicit.
- Cancellation and timeout behavior is defined.
- Idempotency is implemented where required.
- No secrets or sensitive data are hard-coded.

## 5. Tests

Required tests pass:

- unit;
- integration;
- contract;
- architecture;
- migration;
- recovery;
- security;
- performance when applicable;
- end-to-end acceptance.

Tests SHALL verify failure behavior, not only success paths.

## 6. Data and Migration

- Schema changes have migrations.
- Migrations are tested from supported prior versions.
- Migration is resumable or safely restartable.
- Backup requirements are documented.
- Integrity checks exist.
- Destructive operations require explicit policy.

## 7. Security and Privacy

- Authentication and authorization are enforced.
- Least privilege is applied.
- Personal data exposure is minimized.
- Logs and telemetry are redacted.
- Credentials use approved secure storage.
- Remote processing follows privacy policy.
- Threats relevant to the module are reviewed.

## 8. Observability

- Significant operations have correlation.
- Errors use stable categories.
- Required metrics exist.
- Health checks exist where applicable.
- Long-running work exposes status.
- Alerts exist for critical server failures.
- Diagnostic information avoids publication content and Personal Knowledge.

## 9. Documentation

- README is current.
- Contracts are current.
- Operations are documented.
- Known limitations are documented.
- Traceability matrix is updated.
- Implementation decisions that change architecture have an ADR.

## 10. Release Readiness

- Deployment or distribution artifact is reproducible.
- Configuration is validated.
- Rollback or recovery guidance exists.
- Release notes identify changes.
- Compatibility is documented.
- Approval is recorded.

## 11. Completion Rule

A work item SHALL NOT be marked done when a required item above is missing unless an approved exception:

- identifies the missing condition;
- states the risk;
- names the approver;
- defines remediation;
- sets an expiration or target release.
