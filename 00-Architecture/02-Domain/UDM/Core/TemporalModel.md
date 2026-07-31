# UDM Temporal Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** TemporalModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify temporal values, intervals, uncertainty, normalization and separation of semantic and processing time.

## 2. Scope

Covers source, publication, semantic event, validity, acquisition, processing and version time.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Temporal information has kind, value or interval, precision, timezone, calendar, certainty, original expression and normalization provenance.

UDM never conflates when information was processed with when the represented event occurred.

## 5. Conceptual Model

```text
TemporalValue
├── kind
├── start?
├── end?
├── precision
├── timezone?
├── calendar
├── certainty
├── originalExpression?
└── normalizationProvenance?
```

## 6. Normative Requirements

**TEMPORALMODEL-R001** — Original temporal expressions MUST be preserved when normalized.

**TEMPORALMODEL-R002** — Timezone assumptions MUST be explicit.

**TEMPORALMODEL-R003** — Precision MUST NOT exceed available evidence.

**TEMPORALMODEL-R004** — Open and uncertain intervals MAY be represented.

**TEMPORALMODEL-R005** — Processing time MUST NOT overwrite semantic event time.

**TEMPORALMODEL-R006** — Relative expressions MUST record their reference context.

**TEMPORALMODEL-R007** — Invalid reversed intervals MUST fail validation unless explicitly allowed by type.

## 7. Invariants

**TEMPORALMODEL-I001** — Semantic time and processing time are separate.

**TEMPORALMODEL-I002** — Normalization is deterministic for fixed context and rules.

**TEMPORALMODEL-I003** — Uncertainty remains explicit.

**TEMPORALMODEL-I004** — Temporal values preserve their calendar system.

**TEMPORALMODEL-I005** — Version timestamps describe versions, not historical events.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

“Next Tuesday” stores the original phrase, the reference date used for resolution and the normalized date. Reprocessing with another reference context does not silently overwrite the first interpretation.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `NodeAttributes.md`
- `../../KnowledgeObject/Versioning.md`
- `../../KnowledgeObject/Provenance.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
