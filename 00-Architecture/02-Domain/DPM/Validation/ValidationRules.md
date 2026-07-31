# DPM Validation Rules

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** ValidationRules  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify machine-evaluable validity and publication-readiness rules.

## 2. Scope

Applies to every canonical or exchange DPM.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 4. Context and Responsibility

Validation covers envelope, identities, coordinate spaces, geometry, containment, graph references, reading flows, styles, mappings, provenance and purpose profiles.

## 5. Conceptual Model

Findings are fatal, invalid, incomplete, warning or advisory. Validators are deterministic and non-mutating.

## 6. Normative Requirements

**VALIDATIONRULES-R001** — Canonical publication MUST have no fatal, invalid or incomplete findings.

**VALIDATIONRULES-R002** — Every finding MUST use a stable rule ID.

**VALIDATIONRULES-R003** — Validators MUST NOT mutate the DPM.

**VALIDATIONRULES-R004** — All geometry MUST reference valid coordinate spaces.

**VALIDATIONRULES-R005** — Every internal identity reference MUST resolve.

**VALIDATIONRULES-R006** — Purpose-specific profiles MUST declare required fidelity.

**VALIDATIONRULES-R007** — Unknown required extensions MUST prevent publication.

**VALIDATIONRULES-R008** — Warnings MAY remain only when explicitly accepted.

## 7. Invariants

**VALIDATIONRULES-I001** — Validation is deterministic.

**VALIDATIONRULES-I002** — Severity meaning is stable.

**VALIDATIONRULES-I003** — Reports are serializable.

**VALIDATIONRULES-I004** — Validation cannot create semantic authority.

## 8. Processing and Lifecycle Considerations

Presentation data is an immutable snapshot within a DPM version. Changes create a new version or a new derived view. Runtime caches, UI selection, window state and renderer-specific objects are never canonical DPM state.

Processors SHALL record inputs, configuration, implementation version, confidence where applicable and complete provenance. Reprocessing MAY replace derived presentation artifacts but SHALL preserve stable identities when presentation continuity remains.

## 9. Failure and Edge Cases

A conforming implementation SHALL represent ambiguity explicitly. It MUST NOT invent coordinates, reading order, style semantics or UDM mappings without evidence. Partial reconstruction MAY be published only when validation marks unresolved regions and the consuming capability supports incomplete DPM.

Security-sensitive inputs such as external style references, fonts, URLs and extension payloads SHALL be validated before use.

## 10. Examples

A missing coordinate space is invalid; a source-faithful page whose measured bounds exceed tolerance may be incomplete or invalid according to profile.

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
