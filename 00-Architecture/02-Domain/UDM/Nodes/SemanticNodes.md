# UDM Semantic Nodes

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** SemanticNodes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify nodes representing concepts, entities, claims and evidence.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Semantic nodes may represent person, organization, place, event, concept, topic, claim, evidence, work, date and quantity.

## 5. Conceptual Model

Semantic nodes connect documentary mentions to resolved or unresolved concepts. Mentions, entities and assertions remain distinguishable.

## 6. Normative Requirements

**SEMANTICNODES-R001** — Entity resolution MUST record method, confidence and provenance.

**SEMANTICNODES-R002** — Machine-inferred entities MUST remain derived until accepted.

**SEMANTICNODES-R003** — Conflicting interpretations MAY coexist.

**SEMANTICNODES-R004** — Semantic nodes MUST NOT overwrite source text.

**SEMANTICNODES-R005** — Claims SHOULD reference evidence anchors.

**SEMANTICNODES-R006** — External entity mappings MUST identify namespace and resolution status.

## 7. Invariants

**SEMANTICNODES-I001** — Inference is not fact.

**SEMANTICNODES-I002** — Evidence remains traceable.

**SEMANTICNODES-I003** — Authority layers remain explicit.

**SEMANTICNODES-I004** — Entity identity is stable within its declared scope.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A mention “Apple” may remain unresolved, map to the company with confidence, or coexist with another interpretation when context is ambiguous.

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
