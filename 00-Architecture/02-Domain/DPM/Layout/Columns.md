# Column Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** Columns  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify column detection, ordering, spanning and responsive behavior.

## 2. Scope

Applies to DPM layout analysis, reconstruction, rendering and validation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Columns organize parallel vertical or horizontal flows within regions. They may be source-detected or generated.

## 5. Conceptual Model

A column set declares axis, gaps, widths, ordering, spans and balancing policy.

## 6. Normative Requirements

**COLUMNS-R001** — Column ordering MUST be explicit.

**COLUMNS-R002** — Gaps and widths MUST use declared units.

**COLUMNS-R003** — Spanning nodes MUST identify the columns they cross.

**COLUMNS-R004** — Irregular columns MUST preserve measured geometry.

**COLUMNS-R005** — Column inference MUST record confidence and evidence.

**COLUMNS-R006** — Responsive generated columns MUST declare constraints rather than source fidelity.

## 7. Invariants

**COLUMNS-I001** — Column flow is deterministic.

**COLUMNS-I002** — Column identity is stable when continuity remains.

**COLUMNS-I003** — Visual columns do not imply semantic sections.

**COLUMNS-I004** — Spans cannot reference absent columns.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A headline spans two columns while body text flows first down the left column and then the right.

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
