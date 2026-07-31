# UDM–DPM Mapping

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** UDMMapping  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify correspondence between semantic UDM entities and DPM presentation entities.

## 2. Scope

Applies to DPM/UDM integration, rendering, annotation and export.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Mappings connect identities and anchors while preserving the authority boundary between meaning and presentation.

## 5. Conceptual Model

A mapping declares source and target references, correspondence kind, coverage, direction, confidence, evidence and provenance.

## 6. Normative Requirements

**UDMMAPPING-R001** — Every mapping MUST identify valid UDM and DPM scopes.

**UDMMAPPING-R002** — Correspondence kind MUST be exact, partial, aggregate, split, inferred, generated or unresolved.

**UDMMAPPING-R003** — Mappings MUST NOT transfer DPM attributes into UDM automatically.

**UDMMAPPING-R004** — Inferred mappings MUST record confidence.

**UDMMAPPING-R005** — One-to-many and many-to-one mappings MUST be explicit.

**UDMMAPPING-R006** — Mapping updates MUST preserve lineage.

**UDMMAPPING-R007** — Unresolved mappings MUST remain representable.

## 7. Invariants

**UDMMAPPING-I001** — UDM identity remains semantic authority.

**UDMMAPPING-I002** — DPM identity remains presentation authority.

**UDMMAPPING-I003** — Mappings are traceable.

**UDMMAPPING-I004** — Mapping cardinality is explicit.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

One UDM paragraph may map to two text frames when it continues across columns.

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
