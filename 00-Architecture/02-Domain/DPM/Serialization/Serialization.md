# DPM Serialization Contract

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** Serialization  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify logical exchange, deterministic encoding, precision preservation and secure deserialization for DPM.

## 2. Scope

Covers envelope, geometry, graphs, styles, mappings, extensions and compatibility.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

The logical contract is encoding-neutral. JSON UTF-8 is the baseline interoperable representation. Alternative encodings may be used when they preserve identical meaning.

Serialization must retain coordinate-space declarations, transforms, numeric precision, identities, ordering, style references, mappings and provenance.

## 5. Conceptual Model

```text
SerializedDPM
├── format
├── specificationVersion
├── presentation
├── coordinateSpaces
├── nodes
├── pages
├── regions
├── layoutGraph
├── readingFlows
├── styles
├── mappings
├── provenance
├── validation
└── extensions
```

## 6. Normative Requirements

**SERIALIZATION-R001** — Internal references MUST use stable identities.

**SERIALIZATION-R002** — Numeric precision MUST be sufficient to preserve declared fidelity.

**SERIALIZATION-R003** — Coordinate-space metadata MUST be serialized before dependent geometry is interpreted.

**SERIALIZATION-R004** — Round trips MUST preserve presentation equivalence.

**SERIALIZATION-R005** — Unknown optional extension data SHOULD be preserved.

**SERIALIZATION-R006** — Unsupported required semantics MUST produce incompatibility.

**SERIALIZATION-R007** — Deserializers MUST enforce size, nesting, path and reference limits.

**SERIALIZATION-R008** — Serialized data MUST NOT contain executable renderer code.

**SERIALIZATION-R009** — Canonical ordering MUST be deterministic where hashing or signing applies.

## 7. Invariants

**SERIALIZATION-I001** — Runtime renderer objects are excluded.

**SERIALIZATION-I002** — Encoding does not alter meaning.

**SERIALIZATION-I003** — References resolve or remain explicitly external.

**SERIALIZATION-I004** — Geometry retains coordinate context.

**SERIALIZATION-I005** — Authority and provenance survive round trips.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A transform matrix is serialized with declared numeric precision and coordinate-space reference; a renderer may convert it internally but must not change canonical meaning.

## 11. Compatibility and Evolution

Backward-compatible changes MAY add optional attributes, types or mapping strategies. Changes that alter spatial semantics, identity, coordinate interpretation, reading-order meaning or UDM/DPM authority boundaries require a major version.

Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST produce an explicit incompatibility result.

## 12. Related Documents

- `../DPM.md`
- `../Core/PresentationIdentity.md`
- `../Mapping/UDMMapping.md`
- `../Validation/ValidationRules.md`

## 13. Status

This document is part of the KnowledgeOS DPM V4 release-candidate baseline. It becomes frozen after complete Domain review and conformance validation.
