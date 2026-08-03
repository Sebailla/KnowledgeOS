# Layout Graph

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** LayoutGraph  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify graph relationships among presentation entities.

## 2. Scope

Applies to DPM layout analysis, reconstruction, rendering and validation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

The layout graph captures spatial, alignment, containment-adjacent and flow relations independent of node containment.

## 5. Conceptual Model

Edges include above, below, leftOf, rightOf, overlaps, alignedWith, adjacentTo, flowsTo, anchoredTo and occludes.

## 6. Normative Requirements

**LAYOUTGRAPH-R001** — Every edge MUST have valid endpoints.

**LAYOUTGRAPH-R002** — Spatial relations MUST declare coordinate context.

**LAYOUTGRAPH-R003** — Inferred edges MUST record confidence and provenance.

**LAYOUTGRAPH-R004** — Symmetric relations MUST declare symmetry.

**LAYOUTGRAPH-R005** — Contradictory relations MUST be reported.

**LAYOUTGRAPH-R006** — Graph edges MUST NOT replace explicit reading flows.

## 7. Invariants

**LAYOUTGRAPH-I001** — Endpoints resolve.

**LAYOUTGRAPH-I002** — Edge identity is stable.

**LAYOUTGRAPH-I003** — Graph projection is deterministic.

**LAYOUTGRAPH-I004** — Authority and provenance are explicit.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

Two text frames can be alignedLeft and adjacentTo while reading flow still traverses another frame between them.

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
