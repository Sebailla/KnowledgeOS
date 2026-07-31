# UDM Structural Nodes

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** StructuralNodes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify nodes that organize semantic hierarchy and reading structure.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Structural nodes include document, part, chapter, section, subsection, frontMatter, body, backMatter, appendix, bibliography, index and tableOfContents.

## 5. Conceptual Model

Structural nodes form the canonical containment skeleton. They may carry titles, labels, language and source anchors but never page geometry.

## 6. Normative Requirements

**STRUCTURALNODES-R001** — Structural depth MUST reflect semantic organization rather than typography alone.

**STRUCTURALNODES-R002** — Structural nodes MUST obey allowed-child schemas.

**STRUCTURALNODES-R003** — Empty structural nodes MAY exist only to preserve source evidence or incremental processing.

**STRUCTURALNODES-R004** — Page boundaries MUST NOT define semantic section boundaries by themselves.

**STRUCTURALNODES-R005** — A document MUST expose at least one root structural node.

**STRUCTURALNODES-R006** — Structural labels and ordinals MUST remain distinct.

## 7. Invariants

**STRUCTURALNODES-I001** — Containment remains acyclic.

**STRUCTURALNODES-I002** — Each structural node has stable identity.

**STRUCTURALNODES-I003** — Semantic order is explicit.

**STRUCTURALNODES-I004** — DPM owns visual pagination.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A chapter containing three sections is represented through ordered children. A page break inside the second section does not create a new semantic section.

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
