# Presentation Classification

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** Classification  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify classification of visual primitives and presentation roles.

## 2. Scope

Applies to DPM-producing workflows implemented by Platform engines.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Classification assigns DPM types and roles such as textFrame, imagePlacement, header region or decoration based on visual evidence.

## 5. Conceptual Model

Rules may be deterministic, statistical or AI-assisted. Method, confidence and provenance are mandatory for inferred classifications.

## 6. Normative Requirements

**CLASSIFICATION-R001** — Classification MUST select the most specific justified presentation type.

**CLASSIFICATION-R002** — Low confidence MUST remain explicit.

**CLASSIFICATION-R003** — Visual classification MUST NOT assert UDM semantics automatically.

**CLASSIFICATION-R004** — Human corrections MUST record decision provenance.

**CLASSIFICATION-R005** — Classifier changes MUST invalidate affected derived outputs.

**CLASSIFICATION-R006** — Fallback types MUST preserve unclassified evidence.

## 7. Invariants

**CLASSIFICATION-I001** — Inference is traceable.

**CLASSIFICATION-I002** — Uncertainty is explicit.

**CLASSIFICATION-I003** — Presentation and semantic classifiers remain separate.

**CLASSIFICATION-I004** — Reclassification preserves lineage.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A boxed area may classify as a region with decorative border while its semantic role remains unknown.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `LayoutAnalysis.md`
- `Classification.md`
- `../Validation/ValidationRules.md`
- `../../UDM/Processing/ProcessingPipeline.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
