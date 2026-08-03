# Import Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** ImportEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define source discovery, intake, validation, format detection, extraction preparation and import provenance.

## 2. Scope

Covers device scanning, manual import, Master acquisition intake and external source intake. Excludes Local membership authority and canonical rendering.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Import Engine owns:

- user-authorized scanning;
- source discovery;
- source intake;
- format detection;
- integrity validation;
- duplicate evidence;
- metadata extraction;
- OCR request preparation;
- parser selection;
- import manifests;
- import provenance.

Library Engine decides and commits library membership. Import Engine prepares validated source evidence.

## 5. Conceptual Model

```text
ImportEngine
├── Scanner
├── IntakeService
├── FormatDetector
├── IntegrityValidator
├── DuplicateEvidenceService
├── MetadataExtractor
├── ParserRegistry
├── ImportManifestBuilder
└── ImportRepository contracts
```

## 6. Normative Requirements

**IMPORTENGINE-R001** — Device scanning MUST be limited to user-authorized locations.

**IMPORTENGINE-R002** — Original sources MUST remain immutable.

**IMPORTENGINE-R003** — Every intake MUST create or reuse a stable operation identity.

**IMPORTENGINE-R004** — Format detection MUST use evidence rather than filename extension alone.

**IMPORTENGINE-R005** — Integrity SHOULD use cryptographic checksums when bytes are available.

**IMPORTENGINE-R006** — Duplicate detection MUST produce evidence and MUST NOT silently merge unrelated sources.

**IMPORTENGINE-R007** — Import provenance MUST identify origin, method, component versions and timestamps.

**IMPORTENGINE-R008** — Unsupported formats MUST remain explicitly unsupported rather than corrupted into fallback content.

**IMPORTENGINE-R009** — Remote source intake MUST follow network and privacy policy.

**IMPORTENGINE-R010** — Import results MUST not establish Local Library membership by themselves.

**IMPORTENGINE-R011** — Retryable intake steps MUST be idempotent.

## 7. Invariants

**IMPORTENGINE-I001** — Source bytes are preserved.

**IMPORTENGINE-I002** — Import is explicit and traceable.

**IMPORTENGINE-I003** — Paths are not domain identity.

**IMPORTENGINE-I004** — Duplicate evidence is not identity proof.

**IMPORTENGINE-I005** — Library ownership remains external.

**IMPORTENGINE-I006** — Failure does not destroy source evidence.

## 8. Commands, Queries, Events and Workflows

Commands include `ScanAuthorizedLocation`, `ImportSource`, `ValidateSource`, `ExtractMetadata` and `PrepareCanonicalProcessing`.

Queries include `GetSupportedFormats`, `GetImportStatus` and `InspectSource`.

Events include `SourceDiscovered`, `SourceValidated`, `SourceRejected`, `MetadataExtracted` and `ImportPrepared`.

Large imports use Workflow Engine and Job System.

## 9. Failure, Recovery and Degradation

Invalid or unsupported input SHALL be quarantined or rejected with findings. Interrupted scanning SHALL resume from checkpoints without duplicating discovered source records.

Import Engine SHOULD preserve partial extraction evidence for diagnostics while preventing canonical publication.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

The scanner finds two PDFs with identical checksums. Import reports duplicate evidence and separate custody paths. Library policy decides whether they represent one local publication or distinct source items.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../Library/README.md`
- `../../02-Domain/KnowledgeObject/Sources.md`
- `../../02-Domain/UDM/Processing/ProcessingPipeline.md`
- `../../03-Kernel/JobSystem.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
