# Presentation Type Catalogue

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** PresentationTypes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define core presentation-node families and baseline types.

## 2. Scope

Applies to canonical DPM documents and all conforming processors, serializers and renderers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Types classify visual objects, not documentary meaning.

## 5. Conceptual Model

Families include surface, container, text, media, primitive, decoration, control and overlay.

Representative types are page, canvas, region, column, textFrame, lineBox, glyphRun, imagePlacement, tableGrid, rule, shape, background, overlay and clippingGroup.

## 6. Normative Requirements

**PRESENTATIONTYPE-R001** — A presentation node MUST have one registered primary type.

**PRESENTATIONTYPE-R002** — Type selection MUST be based on visual evidence and declared processing rules.

**PRESENTATIONTYPE-R003** — Types MUST NOT redefine UDM semantic node types.

**PRESENTATIONTYPE-R004** — Extension types MUST use unique namespaces.

**PRESENTATIONTYPE-R005** — Unknown visual structures MUST remain representable through fallback types.

**PRESENTATIONTYPE-R006** — Traits MUST NOT contradict the primary family.

## 7. Invariants

**PRESENTATIONTYPE-I001** — Type identity is stable.

**PRESENTATIONTYPE-I002** — Visual and semantic taxonomies remain separate.

**PRESENTATIONTYPE-I003** — Unknown extensions are preservable.

**PRESENTATIONTYPE-I004** — Core type meaning cannot be overridden.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A visually boxed area may be a `region` or `decoration`; it is not automatically a semantic `warning`.

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
