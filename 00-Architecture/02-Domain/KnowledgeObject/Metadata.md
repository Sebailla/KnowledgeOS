# Knowledge Object Metadata

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** Metadata  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define metadata categories, authority, provenance, validation, extensibility and conflict rules for Knowledge Objects.

## 2. Scope

Covers master-source metadata, local acquisition metadata, personal metadata, processing metadata and derived metadata.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

Metadata describes a Knowledge Object but does not replace its source or canonical content.

KnowledgeOS separates metadata by authority:

| Category | Examples | Authority |
|---|---|---|
| Master-source | title, contributors, publisher, edition, identifiers | Master Library |
| Local acquisition | local path reference, acquisition time, device availability | Local Library |
| Personal | rating, personal tags, private title override, reading status | User |
| Processing | parser version, OCR language, validation status | Processing workflow |
| Derived | topics, entities, summaries, confidence scores | Rebuildable processor |

These categories MAY be presented together, but MUST remain distinguishable.

## 5. Conceptual Model

```text
MetadataRecord
├── recordId
├── category
├── property
├── value
├── valueType
├── authorityScope
├── provenance
├── confidence?
├── language?
├── validity?
├── version
└── extensionNamespace?
```

Multiple records MAY exist for one property when they differ by authority, language, provenance, time or confidence. Resolution policies choose views; they do not destroy alternatives.

## 6. Normative Requirements

**METADATA-R001** — Every metadata record MUST declare an authority category.

**METADATA-R002** — Source metadata MUST preserve its source and extraction provenance.

**METADATA-R003** — Personal metadata MUST NOT overwrite Master-source metadata physically.

**METADATA-R004** — A resolved display value MUST retain the alternatives from which it was selected.

**METADATA-R005** — Machine-generated metadata MUST identify processor, model or rule version and confidence when applicable.

**METADATA-R006** — Metadata values MUST conform to declared logical types.

**METADATA-R007** — Language-dependent metadata SHOULD declare a language tag.

**METADATA-R008** — External identifiers MUST declare namespace and verification status.

**METADATA-R009** — Unknown optional metadata extensions SHOULD be preserved.

**METADATA-R010** — Metadata conflicts MUST remain auditable.

**METADATA-R011** — Private metadata MUST obey export and synchronization policy.

## 7. Invariants

**METADATA-I001** — Metadata authority is explicit.

**METADATA-I002** — Personal and master metadata remain separate.

**METADATA-I003** — Derived metadata is rebuildable.

**METADATA-I004** — Source evidence is never discarded by conflict resolution.

**METADATA-I005** — Metadata version history is traceable.

**METADATA-I006** — No metadata value establishes Knowledge Object identity by itself.

## 8. Lifecycle and State Transitions

Metadata is created, corrected, superseded or retired through versioned records.

A source re-import MAY add a new title assertion without deleting the previous assertion. A user title override creates Personal Metadata. A catalog view MAY display the personal override locally while the Master Library retains the authoritative source title.

Derived metadata becomes stale when its input, processor or configuration changes and MAY be regenerated.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

A PDF supplies the title “Clinical Methods”. Crossref supplies a normalized subtitle. The user locally labels the item “Exam Book”. All three values coexist with different authority and provenance. The local UI chooses the personal label without modifying the Master Catalog.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `Provenance.md`
- `Sources.md`
- `Versioning.md`
- `../UDM/Core/NodeAttributes.md`
- `../Identity/README.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
