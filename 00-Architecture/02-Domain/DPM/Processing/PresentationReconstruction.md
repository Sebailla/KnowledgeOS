# Presentation Reconstruction

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** PresentationReconstruction  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify assembly of a coherent DPM from extracted and classified evidence.

## 2. Scope

Applies to DPM-producing workflows implemented by Platform engines.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Reconstruction creates pages, regions, node containment, layout graph, reading flows, styles and UDM mappings.

## 5. Conceptual Model

The process resolves conflicts under a declared profile such as source-faithful, accessible or reflowed.

## 6. Normative Requirements

**PRESENTATIONRECO-R001** — Reconstruction MUST declare its purpose profile.

**PRESENTATIONRECO-R002** — Source-faithful reconstruction MUST preserve measured geometry within declared tolerance.

**PRESENTATIONRECO-R003** — Generated reconstruction MUST distinguish generated values from source evidence.

**PRESENTATIONRECO-R004** — Conflicts MUST produce findings rather than silent guesses.

**PRESENTATIONRECO-R005** — Publication MUST be atomic after validation.

**PRESENTATIONRECO-R006** — Compatible reconstruction SHOULD preserve presentation identities.

**PRESENTATIONRECO-R007** — Runtime renderer state MUST NOT be included.

## 7. Invariants

**PRESENTATIONRECO-I001** — Purpose is explicit.

**PRESENTATIONRECO-I002** — Outputs are immutable.

**PRESENTATIONRECO-I003** — Validation precedes publication.

**PRESENTATIONRECO-I004** — Generated and source values remain distinguishable.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A reflowed DPM may replace fixed columns with one responsive flow while retaining mappings to the same UDM nodes.

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
