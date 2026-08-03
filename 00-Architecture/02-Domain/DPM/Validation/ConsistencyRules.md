# DPM Cross-Entity Consistency Rules

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** ConsistencyRules  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify invariants requiring evaluation across multiple presentation entities.

## 2. Scope

Applies to every canonical or exchange DPM.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Consistency checks compare parent/child declarations, coordinate transforms, pages and regions, reading flows, graph edges, style references, UDM mappings and version lineage.

## 5. Conceptual Model

Groups include structural, geometric, graph, flow, style, mapping, provenance and version consistency.

## 6. Normative Requirements

**CONSISTENCYRULES-R001** — Containment MUST be acyclic and reciprocal.

**CONSISTENCYRULES-R002** — Transforms between referenced spaces MUST be resolvable.

**CONSISTENCYRULES-R003** — Page and region extents MUST be geometrically coherent.

**CONSISTENCYRULES-R004** — Reading-flow members MUST resolve and obey cycle policy.

**CONSISTENCYRULES-R005** — Layout-graph endpoint types MUST satisfy edge schemas.

**CONSISTENCYRULES-R006** — Style references MUST resolve.

**CONSISTENCYRULES-R007** — UDM mappings MUST target compatible document versions.

**CONSISTENCYRULES-R008** — Version lineage MUST be acyclic.

**CONSISTENCYRULES-R009** — Personal or editorial authority MUST NOT be represented as source-extracted authority.

## 7. Invariants

**CONSISTENCYRULES-I001** — Cross-entity checks are mandatory.

**CONSISTENCYRULES-I002** — Exceptions require explicit versioned rules.

**CONSISTENCYRULES-I003** — Derived data cannot repair missing source evidence silently.

**CONSISTENCYRULES-I004** — Internal reference kinds remain correct.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A text frame mapped to a UDM paragraph from another document version fails mapping consistency unless the mapping explicitly declares a migration.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `ValidationRules.md`
- `../Core/PresentationNodeModel.md`
- `../Mapping/UDMMapping.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
