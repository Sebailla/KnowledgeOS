# Presentation Node Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** PresentationNodeModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify the common structure and composition behavior of every DPM presentation node.

## 2. Scope

Applies to canonical DPM documents and all conforming processors, serializers and renderers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

A presentation node is an independently identifiable visual object in a declared coordinate system.

## 5. Conceptual Model

```text
PresentationNode
├── id
├── type
├── coordinateSpaceId
├── bounds
├── transform
├── zIndex
├── opacity
├── clip?
├── styleRefs[]
├── parentId?
├── childIds[]
├── mappingIds[]
├── provenance
└── extensions{}
```

## 6. Normative Requirements

**PRESENTATIONNODE-R001** — Every presentation node MUST declare exactly one primary type.

**PRESENTATIONNODE-R002** — Every geometric property MUST resolve through an explicit coordinate space.

**PRESENTATIONNODE-R003** — Containment MUST be acyclic.

**PRESENTATIONNODE-R004** — Sibling composition order MUST be explicit.

**PRESENTATIONNODE-R005** — Node changes MUST create a new DPM version.

**PRESENTATIONNODE-R006** — Runtime focus, hover and selection state MUST NOT be canonical node state.

**PRESENTATIONNODE-R007** — Unknown optional extensions SHOULD be preserved.

## 7. Invariants

**PRESENTATIONNODE-I001** — Identity is stable.

**PRESENTATIONNODE-I002** — Composition is deterministic.

**PRESENTATIONNODE-I003** — Geometry is explicit.

**PRESENTATIONNODE-I004** — Semantic meaning is not inferred by storage shape.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A text frame may contain line nodes and glyph runs while mapping to one UDM paragraph.

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
