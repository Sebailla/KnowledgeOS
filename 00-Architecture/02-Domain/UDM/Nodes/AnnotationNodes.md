# UDM Annotation Reference Nodes

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** AnnotationNodes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify attachment references between canonical UDM and Personal Knowledge.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Personal annotations are not canonical publication content. UDM exposes stable targets and may serialize references for exchange while ownership remains with Personal Knowledge.

## 5. Conceptual Model

Annotation references identify annotation identity, target anchor, relationship role and authority scope. They do not import personal text into the publication layer by default.

## 6. Normative Requirements

**ANNOTATIONNODES-R001** — Annotations MUST NOT mutate source-backed nodes.

**ANNOTATIONNODES-R002** — Annotation identity MUST remain user-owned.

**ANNOTATIONNODES-R003** — Deleting an annotation MUST NOT create a new canonical publication version.

**ANNOTATIONNODES-R004** — Exports that combine layers MUST preserve authority metadata.

**ANNOTATIONNODES-R005** — Annotation targets MUST use stable anchors.

**ANNOTATIONNODES-R006** — Orphaned annotations MUST remain recoverable and explicitly unresolved.

## 7. Invariants

**ANNOTATIONNODES-I001** — Personal authority remains separate.

**ANNOTATIONNODES-I002** — Attachment is reversible.

**ANNOTATIONNODES-I003** — Canonical publication identity is unchanged.

**ANNOTATIONNODES-I004** — Anchor resolution history is preserved.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A highlight points to a text-range anchor. If reprocessing changes offsets, re-anchoring updates resolution history without rewriting the original selector.

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
