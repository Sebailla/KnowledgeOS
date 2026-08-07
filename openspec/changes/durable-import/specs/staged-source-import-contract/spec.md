# Staged Source Import Contract Specification

## Requirements

### Requirement: Versioned Staged-Source Handoff

The import boundary MUST accept only v2 staged-source requests. A v2 request MUST identify an opaque staged-file capability and MUST NOT include source bytes or an absolute path in JSON. v1 requests MUST be rejected with a stable version error and MUST NOT enter import processing.

#### Scenario: Valid v2 handoff

- GIVEN a valid v2 request with an opaque staged-file capability
- WHEN the Core Host validates it
- THEN it SHALL accept the request without receiving source bytes or an absolute path

#### Scenario: Legacy v1 request

- GIVEN a v1 text-content request
- WHEN the Core Host receives it
- THEN it SHALL return the stable version error and queue no processing

### Requirement: Root-Confined Capability Validation

macOS MUST stage sources in an app-controlled root and issue opaque capabilities only for files inside that root. The Core Host MUST revalidate capability integrity, root containment, and symlink safety before reading a staged file.

#### Scenario: Capability escapes the root

- GIVEN a capability resolves outside the staging root or through a symlink escape
- WHEN the Core Host revalidates it
- THEN it SHALL reject the request without reading the source

### Requirement: Transient Staging Retention

The system MUST clean successful staged payloads and MUST perform restart cleanup. Recoverable failed payloads MAY be retained only under configured, bounded retention; expiry MUST remove the payload and safe metadata MUST NOT expose source content.

#### Scenario: Retention expiry

- GIVEN a recoverable failed payload reaches its configured retention bound
- WHEN cleanup runs
- THEN the payload SHALL be removed and cannot be retried

### Requirement: Import Lifecycle Boundary

After validated handoff, the import lifecycle MUST end at `ProcessingQueued`. It MUST represent validation, failure, and recoverable failure states as applicable, and MUST NOT claim durable source persistence, Library registration, Reader/Search creation, `Ready`, PDF/EPUB parsing, or streaming IPC.

#### Scenario: Queue completion boundary

- GIVEN a valid staged source is accepted
- WHEN processing is queued
- THEN the observable lifecycle SHALL be `ProcessingQueued` and no later state is claimed
