# Region Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** Regions  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify spatially coherent presentation areas.

## 2. Scope

Applies to DPM layout analysis, reconstruction, rendering and validation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Regions describe areas such as body, header, footer, margin, sidebar, column, footnote zone, figure area and overlay.

## 5. Conceptual Model

A region has identity, geometry, role, containment, reading-flow participation and provenance. Region role is presentation-oriented and may be inferred.

## 6. Normative Requirements

**REGIONS-R001** — Every region MUST belong to a coordinate space.

**REGIONS-R002** — Region geometry MUST be valid in that space.

**REGIONS-R003** — Overlapping regions MUST be explicitly permitted or reported.

**REGIONS-R004** — Inferred roles MUST record confidence.

**REGIONS-R005** — Regions MUST NOT create semantic sections without UDM evidence.

**REGIONS-R006** — A region MAY participate in multiple reading flows.

## 7. Invariants

**REGIONS-I001** — Region identity is stable.

**REGIONS-I002** — Geometry is explicit.

**REGIONS-I003** — Role inference is traceable.

**REGIONS-I004** — Containment remains acyclic.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A two-column article body has one body region containing two column regions.

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
