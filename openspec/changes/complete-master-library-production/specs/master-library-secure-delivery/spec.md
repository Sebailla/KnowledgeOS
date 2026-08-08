# Master Library Secure Delivery Specification


## Requirements

### Requirement: Protected Delivery Boundary
The system MUST serve client and administrative delivery only through configured trusted HTTPS. Proxy and application delivery processes MUST run in declared containers; the application container SHALL not publish a host port directly, and PostgreSQL SHALL be private to the Compose network. It MUST authenticate callers, enforce least-privilege authorization per operation, validate ranges and integrity metadata, and use rotatable secrets outside source control. Diagnostics SHALL contain correlation and error category but MUST NOT expose credentials, publication content, or Personal Knowledge.

#### Scenario: Deliver an authorized range
- GIVEN a caller has publication-acquisition permission
- WHEN it requests a valid HTTPS byte range
- THEN it receives the authorized range with integrity metadata

#### Scenario: Deny unauthorized or insecure delivery
- GIVEN a caller lacks permission or uses an untrusted transport
- WHEN it requests catalog or content
- THEN the system denies it with a classified error and redacted audit record
