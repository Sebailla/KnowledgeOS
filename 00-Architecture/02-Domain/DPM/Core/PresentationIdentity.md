# Presentation Identity Model

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** PresentationIdentity  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify stable identities for DPM documents, nodes, pages, regions, flows, styles and mappings.

## 2. Scope

Applies to canonical DPM documents and all conforming processors, serializers and renderers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Identity represents continuity of presentation objects independently of renderer instances, database rows and array positions.

## 5. Conceptual Model

Identity kinds include `PresentationId`, `PresentationNodeId`, `PageId`, `RegionId`, `ReadingFlowId`, `StyleId`, `MappingId` and `CoordinateSpaceId`.

Global references combine presentation scope and local identity. Compatible reconstruction SHOULD preserve identity when visual continuity remains.

## 6. Normative Requirements

**PRESENTATIONIDEN-R001** — Every independently referenceable presentation entity MUST have an immutable identity.

**PRESENTATIONIDEN-R002** — Identity MUST NOT depend on renderer object addresses, array indexes or storage rows.

**PRESENTATIONIDEN-R003** — Page and region identities SHOULD remain stable during compatible reprocessing.

**PRESENTATIONIDEN-R004** — Split, merge and replacement operations MUST record lineage.

**PRESENTATIONIDEN-R005** — External source identifiers MUST be represented as aliases.

**PRESENTATIONIDEN-R006** — Retired identities MUST NOT be silently reused.

## 7. Invariants

**PRESENTATIONIDEN-I001** — Identity is opaque.

**PRESENTATIONIDEN-I002** — Identity survives serialization.

**PRESENTATIONIDEN-I003** — Lineage is acyclic.

**PRESENTATIONIDEN-I004** — Aliases do not establish identity by themselves.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A page whose extracted dimensions are corrected keeps its PageId if it remains the same source page; a newly inserted editorial page receives a new identity.

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
