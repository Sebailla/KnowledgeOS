# Master Library Secure Delivery Specification


## Requirements

### Requirement: Protected Delivery Boundary
The system MUST serve client and administrative delivery only through configured trusted HTTPS. Proxy and application delivery processes MUST run in declared containers; the application container SHALL not publish a host port directly, and PostgreSQL SHALL be private to the Compose network. It MUST authenticate callers, enforce least-privilege authorization per operation, validate ranges and integrity metadata, and use rotatable secrets outside source control. Diagnostics SHALL contain correlation and error category but MUST NOT expose credentials, publication content, or Personal Knowledge.

The protected-delivery implementation MUST externalize the public HTTPS origin, trusted-proxy policy, TLS material references, credential source, and authorization port. It SHALL provide no production hostname, certificate, credential, issuer, or authorization owner in source control. Missing or invalid deployment configuration MUST fail closed. A local test profile MAY use generated test TLS material, a fixture origin, and fixture credentials solely to verify the boundary; it SHALL NOT be presented as deployable NAS configuration.

#### Scenario: Deliver an authorized range
- GIVEN a caller has publication-acquisition permission
- WHEN it requests a valid HTTPS byte range
- THEN it receives the authorized range with integrity metadata

#### Scenario: Deny unauthorized or insecure delivery
- GIVEN a caller lacks permission or uses an untrusted transport
- WHEN it requests catalog or content
- THEN the system denies it with a classified error and redacted audit record

#### Scenario: Verify the boundary locally without NAS values
- GIVEN the local test profile supplies generated TLS material, a fixture origin, and a fixture credential source
- WHEN the proxy forwards an authorized HTTPS range request
- THEN the system validates the configured boundary, returns the authorized range with integrity metadata, and records only redacted audit data

#### Scenario: Reject incomplete deployment configuration
- GIVEN a non-test deployment profile lacks a required public-origin, TLS-material, trusted-proxy, credential-source, or authorization-port setting
- WHEN startup or deployment validation runs
- THEN it fails closed and does not accept delivery traffic

### Requirement: Protected Server Container Composition
The Master Library image MUST execute the same protected direct-streaming server that implements catalog, manifest, authorization, range, integrity, cancellation, and audit behavior. It MUST NOT expose a parallel file-serving route or entrypoint that bypasses this boundary. The composition root MUST obtain catalog and manifest data from PostgreSQL adapters and obtain bytes only through a descriptor selected by that catalog. A deployment profile MUST reject fixture credential or authorization references; a test profile MAY inject them solely for Docker Desktop evidence.

#### Scenario: Reach the real boundary through the container proxy
- GIVEN Docker Desktop starts the migrated and locally seeded Compose stack
- WHEN an authorized HTTPS caller requests catalog, manifest, HEAD, or a valid content range through the proxy
- THEN the response is produced by the protected direct-streaming server with the declared authorization and integrity behavior
- AND a legacy direct file path is denied

#### Scenario: Reject a fixture delivery port in deployment profile
- GIVEN the runtime uses the deployment profile
- WHEN a fixture credential or authorization reference is configured
- THEN composition fails closed before listening

### Requirement: Release Delivery Ownership Gate
Before NAS deployment or release acceptance, the system MUST record the concrete public hostname, certificate authority and renewal owner, credential issuer, revocation and enrollment process, secret-rotation owner, and authorization owner. This requirement SHALL NOT block local PR4 implementation or local boundary tests, but it MUST block a NAS deployment or release-ready claim when incomplete.

#### Scenario: Block release without operational ownership
- GIVEN protected delivery has passed local implementation tests
- WHEN any required concrete deployment value or owner is absent
- THEN the release/deployment procedure remains blocked and SHALL NOT claim production readiness
