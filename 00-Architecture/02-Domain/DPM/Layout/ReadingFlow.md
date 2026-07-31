# Reading Flow Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** ReadingFlow  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify ordered traversal of presentation content.

## 2. Scope

Applies to DPM layout analysis, reconstruction, rendering and validation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

A reading flow is an explicit sequence or graph of presentation nodes for a declared purpose, language, audience or accessibility mode.

## 5. Conceptual Model

Primary, alternate and accessible flows may coexist. Flow order is independent of z-order, containment and coordinates.

## 6. Normative Requirements

**READINGFLOW-R001** — Every published DPM SHOULD define a primary reading flow when readable content exists.

**READINGFLOW-R002** — Flow members MUST resolve.

**READINGFLOW-R003** — A node MAY participate in multiple flows.

**READINGFLOW-R004** — Language direction MUST be considered.

**READINGFLOW-R005** — Inferred order MUST record confidence.

**READINGFLOW-R006** — Cycles MUST be explicitly allowed for interactive navigation or rejected.

**READINGFLOW-R007** — Accessible flow MUST preserve mapped UDM semantic sequence where possible.

## 7. Invariants

**READINGFLOW-I001** — Order is explicit.

**READINGFLOW-I002** — Flow identity is stable.

**READINGFLOW-I003** — Z-order does not imply reading order.

**READINGFLOW-I004** — Ambiguity remains representable.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A magazine page may visually interleave pull quotes, but the accessible flow can omit decorative repetition and follow article semantics.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `../Core/PresentationNodeModel.md`
- `LayoutGraph.md`
- `ReadingFlow.md`
- `../Validation/ConsistencyRules.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
