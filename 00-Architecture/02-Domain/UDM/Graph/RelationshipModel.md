# UDM Relationship Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** RelationshipModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify typed edges between nodes, entities, Knowledge Objects and external resources.

## 2. Scope

Applies to semantic graph projection and graph-consuming capabilities.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Relationships include structural, referential, citation, semantic, temporal, causal, evidential, equivalence, personal and derived categories.

## 5. Conceptual Model

A relationship carries identity, type, source, target, direction, attributes, evidence anchors, provenance, authority and optional confidence.

## 6. Normative Requirements

**RELATIONSHIPMODEL-R001** — Relationship endpoints MUST resolve or be explicitly external.

**RELATIONSHIPMODEL-R002** — Relationship types MUST declare valid endpoint types.

**RELATIONSHIPMODEL-R003** — Machine-generated relationships MUST include confidence and method provenance.

**RELATIONSHIPMODEL-R004** — Symmetric relationships MUST declare symmetry.

**RELATIONSHIPMODEL-R005** — Inverse semantics MUST be defined by type, not inferred from names.

**RELATIONSHIPMODEL-R006** — Duplicate handling MUST follow type multiplicity rules.

## 7. Invariants

**RELATIONSHIPMODEL-I001** — Identity is immutable.

**RELATIONSHIPMODEL-I002** — Authority is explicit.

**RELATIONSHIPMODEL-I003** — Evidence remains traceable.

**RELATIONSHIPMODEL-I004** — Personal and derived edges cannot rewrite source assertions.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A citation edge connects a citation inline node to a bibliography entry and references the source span as evidence.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `GraphModel.md`
- `RelationshipModel.md`
- `Ontology.md`
- `../Core/Identity.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
