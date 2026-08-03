# Anchor Mapping

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** AnchorMapping  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify mapping among source selectors, UDM anchors and DPM geometry.

## 2. Scope

Applies to DPM/UDM integration, rendering, annotation and export.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Anchor mapping enables annotations, citations and navigation to survive between semantic and visual representations.

## 5. Conceptual Model

A mapping may resolve a UDM text-range anchor to one or more DPM regions and source selectors. Resolution history records changes.

## 6. Normative Requirements

**ANCHORMAPPING-R001** — Anchor mappings MUST identify source and target versions.

**ANCHORMAPPING-R002** — Partial coverage MUST be explicit.

**ANCHORMAPPING-R003** — Re-anchoring MUST preserve previous resolutions.

**ANCHORMAPPING-R004** — Ambiguous matches MUST expose alternatives.

**ANCHORMAPPING-R005** — Geometry-only evidence MUST NOT fabricate semantic ranges.

**ANCHORMAPPING-R006** — Composite evidence SHOULD be used for resilience.

## 7. Invariants

**ANCHORMAPPING-I001** — Original selectors are immutable.

**ANCHORMAPPING-I002** — Resolution history is append-only.

**ANCHORMAPPING-I003** — Unresolved state is valid.

**ANCHORMAPPING-I004** — Mapping is deterministic for fixed inputs and rules.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A quoted-text anchor resolves to two line boxes on a page because the sentence wraps.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `../../UDM/UDM.md`
- `AnchorMapping.md`
- `AssetMapping.md`
- `../Validation/ConsistencyRules.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
