# Decoration Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** Decorations  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify borders, rules, shadows, backgrounds, underlines, markers and visual ornaments.

## 2. Scope

Applies to source-faithful and generated DPM style representation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Decorations are visual effects associated with presentation nodes or regions. They do not automatically imply semantic meaning.

## 5. Conceptual Model

Decoration records define geometry, stroke, fill, corner, pattern, shadow, layering and provenance.

## 6. Normative Requirements

**DECORATIONS-R001** — Decoration geometry MUST use an explicit coordinate space.

**DECORATIONS-R002** — Decorations MUST be distinguishable from content primitives.

**DECORATIONS-R003** — Generated shadows and effects MUST declare purpose or theme origin.

**DECORATIONS-R004** — Decorative elements SHOULD be excluded from accessible reading flow unless meaningful.

**DECORATIONS-R005** — Borders MUST NOT create semantic tables without UDM evidence.

**DECORATIONS-R006** — Unknown effect extensions MUST remain isolated.

## 7. Invariants

**DECORATIONS-I001** — Decorations are presentation-only.

**DECORATIONS-I002** — Layering is explicit.

**DECORATIONS-I003** — Accessibility behavior is declared.

**DECORATIONS-I004** — Effects do not change UDM identity.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A shaded box can decorate a paragraph; only UDM classification can establish that the paragraph is a warning.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `../Core/PresentationAttributes.md`
- `Themes.md`
- `VisualHierarchy.md`
- `../Validation/ValidationRules.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
