# Local Ingest Panel Specification

## Purpose

Local authenticated PDF/EPUB intake panel.

## Requirements

### Requirement: Protected Browser Submission and Feedback

The panel MUST require its authenticated session, collect PDF/EPUB and metadata, and forward multipart input through its BFF without credentials. It MUST present submitted, accepted, duplicate, validation, authorization, conflict, unavailable, and recovered status with operation ID and redacted error.

#### Scenario: Successful browser upload

- GIVEN a signed-in operator selects a valid source and metadata
- WHEN the operator submits the form
- THEN it shows the operation and catalog-visible publication
- AND it reveals neither tokens nor filesystem paths

#### Scenario: Failed browser upload

- GIVEN the server returns classified rejection or unavailable state
- WHEN the panel receives it
- THEN it presents safe actionable feedback
- AND it does not claim registration or alter catalog results

### Requirement: Local-Only Browser Evidence

The panel MUST be local-HTTPS-Docker-testable for valid upload, rejected file, duplicate/replay, and post-restart status. It MUST NOT provide Local Library, Personal Knowledge, acquisition execution, or NAS deployment controls.

#### Scenario: Browser Docker E2E

- GIVEN the local browser and protected server containers are running
- WHEN the E2E flow uploads a fixture and exercises an error path
- THEN browser feedback and catalog visibility match authoritative ingest status
