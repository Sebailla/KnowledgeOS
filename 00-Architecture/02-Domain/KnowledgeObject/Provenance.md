# Knowledge Object Provenance

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** Provenance  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define origin, custody, transformation, acquisition and decision history for Knowledge Objects and their associated artifacts.

## 2. Scope

Applies to source publications, metadata, assets, UDM, DPM, personal attachments, generated artifacts and migrations.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

Provenance answers where information came from, who or what produced it, when it was observed, which inputs were used and under which authority.

KnowledgeOS distinguishes:

- source provenance;
- custody provenance;
- acquisition provenance;
- processing provenance;
- decision provenance;
- personal provenance;
- synchronization provenance;
- migration provenance.

Provenance is evidence. It SHALL be append-only except for corrections that themselves create provenance.

## 5. Conceptual Model

```text
ProvenanceRecord
├── id
├── subjectRef
├── activityType
├── actorRef
├── authorityScope
├── inputRefs[]
├── outputRefs[]
├── method
├── componentVersion?
├── modelVersion?
├── configurationFingerprint?
├── startedAt?
├── completedAt
├── evidence[]
└── previousRecordRefs[]
```

Actors MAY be users, engines, plugins, providers, migration tools or external authorities.

## 6. Normative Requirements

**PROVENANCE-R001** — Every source-derived assertion MUST have provenance.

**PROVENANCE-R002** — Every generated artifact MUST identify its producing activity and version.

**PROVENANCE-R003** — Provenance MUST preserve input and output identities.

**PROVENANCE-R004** — Acquisition provenance MUST distinguish Master source from local copy.

**PROVENANCE-R005** — Personal provenance MUST remain user-owned.

**PROVENANCE-R006** — Synchronization provenance MUST NOT make the synchronization provider the owner.

**PROVENANCE-R007** — Corrections MUST append decision provenance rather than erase history.

**PROVENANCE-R008** — Remote processing MUST identify the provider and privacy policy applied.

**PROVENANCE-R009** — Migration provenance MUST preserve pre-migration identity and schema.

**PROVENANCE-R010** — Provenance records MUST be serializable and auditable.

## 7. Invariants

**PROVENANCE-I001** — Provenance is append-only.

**PROVENANCE-I002** — Original source evidence remains traceable.

**PROVENANCE-I003** — Authority and actor are distinct concepts.

**PROVENANCE-I004** — Processing time does not replace semantic time.

**PROVENANCE-I005** — A derived artifact without producing provenance is invalid.

**PROVENANCE-I006** — Personal provenance never becomes Master Library metadata.

## 8. Lifecycle and State Transitions

Provenance records move from `Recorded` to `Verified`, `Disputed`, `Superseded` or `Retained`.

Superseding a record SHALL preserve the original. Verification MAY add evidence but SHALL NOT change the historical actor or activity. Purging provenance requires explicit privacy or retention policy and MUST preserve minimum lineage when legally and technically permissible.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

OCR generated text from page 12 records the source item checksum, page selector, OCR engine, language model, configuration and completion time. A later OCR run creates a separate provenance chain and does not overwrite the first result silently.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `Metadata.md`
- `Sources.md`
- `Assets.md`
- `Versioning.md`
- `../Identity/README.md`
- `../UDM/Processing/ProcessingPipeline.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
