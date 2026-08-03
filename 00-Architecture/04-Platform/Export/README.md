# Export Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** ExportEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define export transformations, packaging, fidelity, loss reporting and identity/provenance preservation.

## 2. Scope

Covers Markdown, HTML, PDF, EPUB and future export formats.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Export Engine owns:

- export request validation;
- target-format transformation;
- package assembly;
- asset inclusion;
- identity mapping;
- provenance inclusion;
- loss analysis;
- export reports;
- export provider contracts.

Export does not modify canonical sources.

A target format may be lossy. Loss SHALL be explicit.

## 5. Conceptual Model

```text
ExportEngine
├── ExportPlanner
├── TransformerRegistry
├── AssetPackager
├── FidelityAnalyzer
├── IdentityMapper
├── ExportProvider contracts
└── ExportReportRepository
```

## 6. Normative Requirements

**EXPORTENGINE-R001** — Every export MUST identify source versions and export profile.

**EXPORTENGINE-R002** — Export MUST NOT mutate UDM, DPM or Knowledge Objects.

**EXPORTENGINE-R003** — Lossy transformations MUST produce a loss report.

**EXPORTENGINE-R004** — Identity and provenance SHOULD be preserved when target format permits.

**EXPORTENGINE-R005** — Assets MUST preserve integrity and relationships.

**EXPORTENGINE-R006** — Personal Knowledge inclusion MUST be explicit.

**EXPORTENGINE-R007** — Private annotations MUST not be exported by default.

**EXPORTENGINE-R008** — Output paths and filenames MUST be sanitized.

**EXPORTENGINE-R009** — Export retries MUST be idempotent or produce distinct explicit outputs.

**EXPORTENGINE-R010** — Unsupported target capabilities MUST fail or degrade according to profile.

**EXPORTENGINE-R011** — Export providers MUST remain replaceable.

## 7. Invariants

**EXPORTENGINE-I001** — Source state is immutable.

**EXPORTENGINE-I002** — Loss is explicit.

**EXPORTENGINE-I003** — Personal data inclusion is opt-in.

**EXPORTENGINE-I004** — Output identity is traceable.

**EXPORTENGINE-I005** — Export format does not become canonical.

**EXPORTENGINE-I006** — Assets and references remain coherent.

## 8. Commands, Queries, Events and Workflows

Commands include `ExportKnowledgeObject`, `ExportCollection`, `ExportWithAnnotations` and `CancelExport`.

Queries include `GetExportCapabilities`, `EstimateExportLoss`, `GetExportStatus` and `GetExportReport`.

Events include `ExportStarted`, `ExportCompleted`, `ExportFailed` and `ExportLossDetected`.

Large exports use durable workflows and jobs.

## 9. Failure, Recovery and Degradation

Partial output SHALL not be reported as complete. Failed temporary packages SHOULD be cleaned safely while preserving diagnostic reports. Interrupted exports MAY resume when provider and target support it.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

Exporting an annotated EPUB requires explicit inclusion of Personal Knowledge. The report identifies unsupported drawing overlays and may package them as supplemental assets.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../../02-Domain/UDM/UDM.md`
- `../../02-Domain/DPM/DPM.md`
- `../Render/README.md`
- `../../05-Integration/DataExchange/ExportProtocols.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
