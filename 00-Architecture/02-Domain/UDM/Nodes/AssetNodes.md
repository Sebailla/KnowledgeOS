# UDM Asset Reference Nodes

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** AssetNodes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify semantic references to images, audio, video, datasets and attachments.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Asset nodes represent identity, media type, role, checksum, source reference, accessibility metadata and available renditions. Binary content is managed outside UDM.

## 5. Conceptual Model

Renditions are derived artifacts. Semantic description belongs to UDM; crop, coordinates and layout belong to DPM unless semantically meaningful.

## 6. Normative Requirements

**ASSETNODES-R001** — Asset references MUST use stable identity.

**ASSETNODES-R002** — Checksums SHOULD be recorded when bytes are available.

**ASSETNODES-R003** — Binary storage paths MUST NOT be canonical domain values.

**ASSETNODES-R004** — Every rendition MUST record derivation provenance.

**ASSETNODES-R005** — Accessibility descriptions SHOULD be preserved.

**ASSETNODES-R006** — Remote asset URIs MUST be validated under security policy.

## 7. Invariants

**ASSETNODES-I001** — Asset identity is independent of storage location.

**ASSETNODES-I002** — Renditions do not replace source assets.

**ASSETNODES-I003** — Presentation placement is external.

**ASSETNODES-I004** — Missing assets remain explicitly unresolved.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

An original TIFF and a generated JPEG preview share a source/derivation relationship but have distinct rendition identities.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `../Core/NodeModel.md`
- `../Core/NodeTypes.md`
- `../Core/Identity.md`
- `../Validation/ValidationRules.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
