# DPM Package Guide

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define package boundaries, reading order, dependencies and maintenance rules for the Document Presentation Model.

## 2. Scope

Applies to all files under `02-Domain/DPM`.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

DPM owns canonical presentation semantics: geometry, pages, regions, visual composition, reading order, style and mappings to UDM. It depends only on Foundation and Domain contracts.

Platform rendering, import, export and annotation engines consume DPM but SHALL NOT redefine it. `DPM.md` is the rector specification.

## 5. Conceptual Model

```text
DPM/
├── DPM.md
├── Core/
├── Layout/
├── Mapping/
├── Processing/
├── Serialization/
├── Style/
└── Validation/
```

Recommended reading order is rector, Core, Layout, Style, Mapping, Processing, Serialization and Validation.

## 6. Normative Requirements

**README-R001** — The package SHALL remain independent of renderer frameworks and storage engines.

**README-R002** — Every presentation concept SHALL have one authoritative definition.

**README-R003** — Subordinate specifications SHALL reference rector concepts rather than redefine them.

**README-R004** — UDM and DPM ownership boundaries SHALL remain explicit.

**README-R005** — Changes SHALL be validated across mapping and validation documents.

**README-R006** — File names and package structure SHALL remain stable within V4.

## 7. Invariants

**README-I001** — DPM remains presentation-focused.

**README-I002** — UDM remains semantic authority.

**README-I003** — Coordinate spaces are explicit.

**README-I004** — Runtime UI state is excluded.

**README-I005** — Derived processing remains traceable.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

An AppKit renderer can map a DPM text frame to `NSTextView`, but `NSTextView` never appears in the domain specification.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `DPM.md`
- `../UDM/README.md`
- `../DomainModel.md`
- `../KnowledgeObject/README.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
