# Local Master Library Development Auth Specification

## Purpose

Define a development identity/session adapter.

## Requirements

### Requirement: Development-Only Local Operator Identity

In a local profile, the system MUST provision `admin@knowledgeos.local` and issue the initiating operator a temporary password. It MUST be disclosed once locally, never enter durable logs/audit records, and grant only declared catalog-read and acquisition permissions.

#### Scenario: Start the local profile

- GIVEN an explicitly local profile starts
- WHEN the identity adapter initializes
- THEN it issues a temporary password for `admin@knowledgeos.local`
- AND discloses it once locally

#### Scenario: Reject incorrect credentials

- GIVEN local login is shown
- WHEN incorrect credentials are submitted
- THEN no authenticated session is created
- AND diagnostics contain no credential value

### Requirement: Local Session Issuance and Validation

The adapter MUST issue short-lived sessions after valid login, validate protected requests, invalidate logout, and deny expired, malformed, or unknown sessions without fallback.

#### Scenario: Issue and use a valid session

- GIVEN the temporary password is submitted
- WHEN login succeeds
- THEN a short-lived session is issued
- AND catalog is authorized by declared permissions

#### Scenario: Reject invalid sessions

- GIVEN an expired, malformed, or unknown session
- WHEN it reaches a protected request
- THEN the request is denied
- AND no replacement session is issued automatically

### Requirement: Deployment-Profile Rejection

The system MUST fail closed before listening when non-local/deployment enables this identity, credentials, or adapter. It MUST NOT define NAS issuer, enrollment, rotation, revocation, administration, or production session policy.

#### Scenario: Reject local authentication in deployment configuration

- GIVEN deployment references local identity or adapter
- WHEN validation or startup runs
- THEN startup fails closed before traffic
- AND reports a redacted configuration policy failure

#### Scenario: Keep NAS lifecycle outside this capability

- GIVEN local authentication is documented
- WHEN its operational boundary is stated
- THEN NAS credential lifecycle is identified as unresolved deployment work
- AND no NAS or production-readiness claim is made
