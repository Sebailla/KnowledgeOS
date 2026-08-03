# Presentation Attribute Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** PresentationAttributes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify typed visual and spatial attributes shared by DPM nodes.

## 2. Scope

Applies to canonical DPM documents and all conforming processors, serializers and renderers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Attributes describe renderer-neutral presentation properties such as geometry, visibility, flow, clipping and style references.

## 5. Conceptual Model

Logical value classes include scalar, length, angle, point, size, rectangle, transform, path, color reference, style reference, enum, list and structured record.

Every dimensional value declares unit or inherits it from an explicit coordinate space.

## 6. Normative Requirements

**PRESENTATIONATTR-R001** — Attribute values MUST conform to declared types.

**PRESENTATIONATTR-R002** — Missing, unknown and explicit null MUST remain distinguishable.

**PRESENTATIONATTR-R003** — Lengths MUST identify units or coordinate-space inheritance.

**PRESENTATIONATTR-R004** — Renderer-specific classes MUST NOT appear as canonical values.

**PRESENTATIONATTR-R005** — Core attributes MUST NOT be redefined by extensions.

**PRESENTATIONATTR-R006** — Source and normalized values SHOULD remain distinguishable where conversion occurs.

## 7. Invariants

**PRESENTATIONATTR-I001** — Attributes are deterministic.

**PRESENTATIONATTR-I002** — Geometry cannot be unitless without declared context.

**PRESENTATIONATTR-I003** — Presentation values do not become UDM attributes.

**PRESENTATIONATTR-I004** — Unknown optional attributes remain preservable.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A margin of 24 points is stored as a length in page space, not as a CSS string such as `24px`.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `PresentationNodeModel.md`
- `PresentationTypes.md`
- `../Validation/ValidationRules.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
