# UDM Node Attribute Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** NodeAttributes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify typed attributes, namespaces, missing-value semantics and inheritance.

## 2. Scope

Applies to all node attributes and extension attributes.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Attributes describe semantic properties. They do not store rendering state or persistence metadata.

Supported logical value classes include string, boolean, integer, decimal, identifier, URI, date/time, duration, language tag, measurement, list, set and structured record.

## 5. Conceptual Model

```text
AttributeDefinition
├── name
├── namespace
├── valueType
├── cardinality
├── required
├── inherited
├── defaultPolicy
└── validationRules[]
```

## 6. Normative Requirements

**NODEATTRIBUTES-R001** — Attribute names MUST be unique within a node and namespace.

**NODEATTRIBUTES-R002** — Values MUST conform to the declared logical type.

**NODEATTRIBUTES-R003** — Missing, unknown and explicit null MUST remain distinguishable.

**NODEATTRIBUTES-R004** — Measurements MUST declare a unit.

**NODEATTRIBUTES-R005** — Machine-generated values MUST include method provenance when required by the attribute definition.

**NODEATTRIBUTES-R006** — Core attributes MUST NOT be redefined by extensions.

**NODEATTRIBUTES-R007** — Presentation-only properties MUST be represented in DPM, not UDM.

## 7. Invariants

**NODEATTRIBUTES-I001** — Attribute interpretation is deterministic.

**NODEATTRIBUTES-I002** — No implicit inheritance occurs unless declared.

**NODEATTRIBUTES-I003** — Uncertainty is never replaced by fabricated precision.

**NODEATTRIBUTES-I004** — Unknown optional attributes are preserved when possible.

**NODEATTRIBUTES-I005** — Attribute values do not contain executable code.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A date may preserve `originalExpression: "Spring 1998"`, normalized range and precision. It must not be silently converted to an invented exact day.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `NodeModel.md`
- `TypeSystem.md`
- `TemporalModel.md`
- `../Validation/ValidationRules.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
