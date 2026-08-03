# UDM Cross-Entity Consistency Rules

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** ConsistencyRules  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify invariants that require evaluating multiple entities or model dimensions together.

## 2. Scope

Covers containment, identity, relationships, anchors, provenance, temporal values, versions and authority layers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Field schemas cannot detect all contradictions. Consistency validation verifies agreement between parent and child links, relationship endpoints and types, anchors and target versions, provenance and authority, and version lineage.

## 5. Conceptual Model

Consistency groups:

- structural consistency;
- identity consistency;
- relationship consistency;
- anchor consistency;
- provenance consistency;
- temporal consistency;
- version consistency;
- authority consistency.

## 6. Normative Requirements

**CONSISTENCYRULES-R001** — The document MUST have at least one root and no containment cycles.

**CONSISTENCYRULES-R002** — Parent and child declarations MUST agree.

**CONSISTENCYRULES-R003** — Child order MUST contain no duplicates.

**CONSISTENCYRULES-R004** — Relationship endpoint types MUST satisfy the relationship schema.

**CONSISTENCYRULES-R005** — Evidence anchors MUST resolve to compatible target versions.

**CONSISTENCYRULES-R006** — Generated assertions MUST identify producing activity.

**CONSISTENCYRULES-R007** — Personal authority MUST NOT be represented as source authority.

**CONSISTENCYRULES-R008** — Version lineage MUST be acyclic.

**CONSISTENCYRULES-R009** — Temporal intervals MUST be coherent.

**CONSISTENCYRULES-R010** — Tombstoned identities MUST NOT be reused.

## 7. Invariants

**CONSISTENCYRULES-I001** — Cross-entity validation is mandatory before publication.

**CONSISTENCYRULES-I002** — Consistency checks are non-mutating.

**CONSISTENCYRULES-I003** — Accepted exceptions require explicit versioned rules.

**CONSISTENCYRULES-I004** — Derived data cannot satisfy missing source provenance.

**CONSISTENCYRULES-I005** — All internal references use the correct identity kind.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A node listing a child that points to another parent fails structural consistency even if each individual node is schema-valid.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `ValidationRules.md`
- `../Core/Identity.md`
- `../Nodes/Anchors.md`
- `../Graph/RelationshipModel.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
