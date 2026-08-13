# Master Library Acquisition Initiation Specification

## Purpose

Define the v1 client handoff command for explicit acquisition from Master Library to a named Local Library.

## Requirements

### Requirement: Authorized Versioned Acquisition Handoff

The system MUST expose a versioned command that accepts a stable Master publication identity, stable version identity, named Local Library identity, and idempotency key. It MUST authorize `publication.acquire` before acceptance. On acceptance, it MUST return a stable acquisition receipt and manifest identifying the requested version and protected download contract. The command MUST NOT write Local Library data, execute local processing, change Master authority, or transfer Personal Knowledge.

#### Scenario: Accept an authorized handoff

- GIVEN an authorized client selects an available publication version and Local Library
- WHEN it sends a valid v1 initiation command
- THEN it receives an accepted stable acquisition receipt and manifest
- AND no Local Library or Personal Knowledge state is persisted by Master Library

#### Scenario: Reject an unauthorized handoff

- GIVEN a client lacks `publication.acquire`
- WHEN it sends an initiation command
- THEN the command is denied with a classified authorization error
- AND it exposes neither receipt, manifest, content, nor storage detail

### Requirement: Idempotent Receipt Semantics

The command MUST treat a repeated valid request with the same authenticated client, idempotency key, publication version, and Local Library identity as the same handoff. It MUST return the original stable receipt and manifest without duplicate authoritative side effects. Reuse of a key with different command semantics MUST be rejected as a classified conflict.

#### Scenario: Repeat a valid initiation

- GIVEN an accepted initiation request
- WHEN the client repeats the same command with its idempotency key
- THEN it receives the original receipt and manifest
- AND no duplicate handoff state is created

#### Scenario: Reuse a key for another target

- GIVEN an idempotency key already accepts a different version or Local Library
- WHEN the client reuses that key
- THEN the command is rejected with a conflict error
- AND no new receipt is issued

### Requirement: Classified Validation and Profile Safety

The command MUST reject malformed, unavailable, unknown, or incompatible publication/version/Local Library input with classified v1 errors. It MUST remain behind the protected authorization boundary. A deployment profile MUST reject the local development identity or session adapter before the command accepts traffic; the command SHALL not define NAS credential lifecycle or production session policy.

#### Scenario: Reject unavailable or malformed input

- GIVEN a request has invalid identities or an unavailable version
- WHEN the command validates it
- THEN it returns a classified validation, availability, or compatibility error
- AND no receipt is created

#### Scenario: Reject local authentication in deployment

- GIVEN a deployment profile selects local development authentication
- WHEN the command service starts
- THEN startup fails closed before the command accepts traffic
- AND diagnostics contain no credential value
