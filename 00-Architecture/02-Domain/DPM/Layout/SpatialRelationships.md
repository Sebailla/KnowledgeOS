# Spatial Relationship Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** SpatialRelationships  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify geometric predicates and tolerances.

## 2. Scope

Applies to DPM layout analysis, reconstruction, rendering and validation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Spatial relationships compare entities in a shared or transformable coordinate context.

## 5. Conceptual Model

Predicates include intersects, overlaps, contains, inside, touches, separatedBy, aligned, centered, near and occludes. Every predicate defines tolerance and boundary behavior.

## 6. Normative Requirements

**SPATIALRELATIONS-R001** — Spatial comparisons MUST use compatible coordinate spaces.

**SPATIALRELATIONS-R002** — Tolerance MUST be explicit or profile-defined.

**SPATIALRELATIONS-R003** — Approximate relations MUST record confidence.

**SPATIALRELATIONS-R004** — Transforms MUST be applied before comparison.

**SPATIALRELATIONS-R005** — Occlusion MUST consider z-order and clipping.

**SPATIALRELATIONS-R006** — Spatial relations MUST NOT be interpreted as semantic relationships automatically.

## 7. Invariants

**SPATIALRELATIONS-I001** — Predicates are deterministic for fixed geometry and tolerance.

**SPATIALRELATIONS-I002** — Units are compatible.

**SPATIALRELATIONS-I003** — Boundary semantics are defined.

**SPATIALRELATIONS-I004** — Unknown geometry yields unresolved results.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

Two boxes whose edges differ by 0.2 points may be considered aligned under a 0.5-point tolerance.

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
