# Typography Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** Typography  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify renderer-neutral typography and text metrics.

## 2. Scope

Applies to source-faithful and generated DPM style representation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Typography describes font family references, fallback groups, size, weight, width, slant, features, language, direction, tracking, leading, baseline and text metrics.

## 5. Conceptual Model

Font files remain external assets. Source font names and normalized families may coexist.

## 6. Normative Requirements

**TYPOGRAPHY-R001** — Typography MUST use explicit units.

**TYPOGRAPHY-R002** — Source font identity SHOULD be preserved when available.

**TYPOGRAPHY-R003** — Fallback policy MUST be declared for generated views.

**TYPOGRAPHY-R004** — Language and writing direction MUST be explicit when relevant.

**TYPOGRAPHY-R005** — Font features MUST use registered identifiers.

**TYPOGRAPHY-R006** — Text metrics MUST identify measurement context.

**TYPOGRAPHY-R007** — Typography MUST NOT define UDM semantics by itself.

## 7. Invariants

**TYPOGRAPHY-I001** — Typography is renderer-neutral.

**TYPOGRAPHY-I002** — Font licensing data is not executable style.

**TYPOGRAPHY-I003** — Missing fonts remain resolvable through declared fallback.

**TYPOGRAPHY-I004** — Semantic emphasis belongs to UDM when source meaning supports it.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A source-faithful DPM records a 10.5-point Minion Pro run and a fallback group for renderers where that font is unavailable.

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
