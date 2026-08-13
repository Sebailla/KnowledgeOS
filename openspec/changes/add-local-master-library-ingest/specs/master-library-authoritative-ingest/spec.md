# Master Ingest Specification

## Purpose

Intake.

## Requirements

### Requirement: Authorized Source Intake

The system MUST accept a PDF/EPUB multipart upload from an authorized HTTPS operator. It MUST assign opaque identities, preserve metadata and filename as provenance, and never derive identity or storage location from client path or filename.

#### Scenario: Accepted PDF or EPUB

- GIVEN an authorized operator submits valid metadata and source
- WHEN intake completes
- THEN it returns operation and publication/version IDs
- AND records provenance without a storage path

#### Scenario: Unauthorized or unsafe request

- GIVEN an unauthenticated, multipart-invalid, path-unsafe, or metadata-invalid request
- WHEN it is submitted
- THEN it is rejected with classified authorization or validation error
- AND no authoritative file or catalog record is created

### Requirement: Evidence-Based Validation and Duplicate Control

The system MUST validate size, declared type, and matching signature; checksum accepted bytes; and retain duplicate evidence. Equivalent idempotency replay MUST return its result; changed replay MUST conflict; duplicate checksum MUST avoid a second object.

#### Scenario: Invalid or oversized source

- GIVEN an upload whose type, signature, or size violates policy
- WHEN validation runs
- THEN it receives validation or capacity error
- AND no publication becomes browseable

#### Scenario: Replay and duplicate evidence

- GIVEN completed intake idempotency key or checksum
- WHEN an equivalent replay or duplicate upload arrives
- THEN the prior result or duplicate outcome is returned
- AND identity, bytes, and catalog count remain unchanged

### Requirement: Durable Registration and Recovery

The system MUST durably journal staging, validation, promotion, and registration with correlation and stable failures. It MUST expose a publication only after bytes, checksum, provenance, and registration are complete. Before readiness, reconciliation MUST resolve incomplete work without deleting evidence.

#### Scenario: Interrupted promotion

- GIVEN intake is interrupted after staging or during promotion
- WHEN the service restarts
- THEN reconciliation records outcome
- AND the publication is either complete and browseable or absent from the catalog with preserved evidence

#### Scenario: Registered publication delivery

- GIVEN registration completed with bytes
- WHEN an authorized catalog or download request is made
- THEN the publication is discoverable and deliverable through protected contracts

### Requirement: Authority Boundary and Local Verification

The system MUST NOT write Local/Personal Knowledge, execute acquisition, or claim NAS readiness. Local Docker E2E MUST prove TLS success, unauthorized, invalid, duplicate, recovery, and browser outcomes with disposable fixtures.

#### Scenario: Local Docker boundary proof

- GIVEN the local container composition and fixture source
- WHEN the ingest E2E suite runs over TLS
- THEN it proves those outcomes without Local/Personal mounts or NAS claims
