# Local Ingest Metadata Enrichment Specification

## Purpose

Recover title and author suggestions for one selected PDF or EPUB before ingest, using only local evidence. The user remains the authority for submitted metadata.

## Requirements

### Requirement: Local Evidence-Ranked Suggestions

The system MUST inspect a selected supported document locally and return independently ranked title and author suggestions with evidence source and confidence. It SHALL use this precedence for each missing value: embedded PDF Info/XMP or EPUB OPF metadata; applicable first-page/text evidence; then a normalized filename fallback. Higher-precedence evidence MUST win over lower-precedence evidence; conflicting evidence MUST remain reviewable and MUST NOT silently replace a higher-precedence suggestion.

#### Scenario: Embedded PDF metadata supplies both fields

- GIVEN a selected PDF with valid title and author metadata
- WHEN local inspection completes
- THEN each returned suggestion identifies embedded PDF metadata as its evidence
- AND no text extraction, filename fallback, or OCR is required

#### Scenario: EPUB has incomplete OPF metadata

- GIVEN a selected EPUB whose OPF supplies a title but no author
- WHEN local inspection completes
- THEN the title uses OPF evidence
- AND the author is recovered from the next applicable local evidence source

#### Scenario: No recoverable document metadata exists

- GIVEN a supported document without usable embedded or text evidence
- WHEN local inspection completes
- THEN the normalized filename MAY be suggested
- AND its provenance and lower confidence are returned for review

### Requirement: Explicit, Non-Destructive Review

The system MUST prefill the ingest form only with inspection suggestions. Title and authors MUST remain editable, and the user MUST explicitly submit the final values. The system MUST NOT automatically ingest, silently overwrite user-entered values, alter source bytes, or assign client identities. If either required final field is absent or invalid, ingest MUST remain blocked and manual entry MUST be available.

#### Scenario: User corrects a suggestion

- GIVEN a completed inspection with suggested title and authors
- WHEN the user edits either field before submission
- THEN the edited value is submitted
- AND the suggestion is not restored without user action

#### Scenario: Inspection fails before metadata is usable

- GIVEN local inspection returns no usable suggestion or a classified failure
- WHEN the user opens the ingest form
- THEN manual title and author entry remains available
- AND a valid manually completed form can use the existing ingest flow

### Requirement: Bounded Local OCR Fallback

The system MUST invoke a locally packaged OCR capability only for a PDF when earlier local evidence cannot supply required fields and the document requires text recognition. OCR work MUST honor configured page, byte, time, and resource limits; be cancellable; and expose a redacted outcome, resource usage when material, correlation identity, and classified failure. OCR output is derived evidence and MUST NOT modify the source document.

#### Scenario: Scanned PDF requires OCR

- GIVEN a PDF has insufficient embedded and extractable text evidence
- WHEN inspection reaches the OCR fallback
- THEN the local OCR result may supply reviewable suggestions
- AND the result records OCR provenance and confidence

#### Scenario: OCR exceeds a limit or fails

- GIVEN OCR is cancelled, unavailable, malformed, or exceeds a configured limit
- WHEN the failure is reported
- THEN no external OCR retry occurs
- AND the user can complete ingest manually

### Requirement: Locality and Accepted Provenance

The enrichment flow MUST NOT make network requests or send document content, metadata, OCR output, or diagnostics to external services. Accepted final metadata MUST retain immutable provenance for its accepted values and local derivation evidence where applicable; logs and client responses MUST NOT expose document content, credentials, or filesystem paths.

#### Scenario: Local privacy boundary

- GIVEN any successful or failed inspection
- WHEN its network activity and diagnostics are observed
- THEN no external enrichment request is made
- AND diagnostics contain only redacted operational information
