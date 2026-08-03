# Asset Mapping

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** AssetMapping  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify correspondence between semantic asset references, source assets and visual placements.

## 2. Scope

Applies to DPM/UDM integration, rendering, annotation and export.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

UDM owns asset semantic identity and role. DPM owns placement, crop, transform, clipping and visual rendition selection.

## 5. Conceptual Model

Mappings connect asset reference, source or rendition identity and one or more presentation nodes.

## 6. Normative Requirements

**ASSETMAPPING-R001** — Every placement MUST reference a valid asset or explicit unresolved source.

**ASSETMAPPING-R002** — Crop and transform MUST be DPM properties.

**ASSETMAPPING-R003** — Derived renditions MUST preserve generation provenance.

**ASSETMAPPING-R004** — One asset MAY have multiple placements.

**ASSETMAPPING-R005** — A visual placement MUST NOT redefine semantic asset role.

**ASSETMAPPING-R006** — Missing renditions MUST permit fallback when policy allows.

## 7. Invariants

**ASSETMAPPING-I001** — Asset identity is storage-independent.

**ASSETMAPPING-I002** — Placement identity is presentation-specific.

**ASSETMAPPING-I003** — Renditions remain derived.

**ASSETMAPPING-I004** — Mappings preserve source lineage.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

One figure image appears in the article body and again as a thumbnail; both placements map to the same UDM asset reference.

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
