# UDM Type System

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** TypeSystem  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify type identity, schemas, traits, registration, subtyping, compatibility and extension rules.

## 2. Scope

Applies to node, relationship, attribute and extension types.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

The type system is nominal and registry-based. Structural resemblance alone does not establish subtype compatibility.

A type definition declares family, version, attributes, children, traits, relationships, invariants and serialization identity.

## 5. Conceptual Model

```text
TypeDefinition
├── typeId
├── version
├── family
├── parentTypeIds[]
├── traits[]
├── attributeSchema
├── childSchema
├── relationshipSchema
└── invariants[]
```

## 6. Normative Requirements

**TYPESYSTEM-R001** — TypeId values MUST be immutable and globally unambiguous.

**TYPESYSTEM-R002** — Core namespaces MUST NOT be overridden.

**TYPESYSTEM-R003** — Subtyping MUST be explicitly registered.

**TYPESYSTEM-R004** — A backward-compatible change MUST preserve meaning of all previously valid instances.

**TYPESYSTEM-R005** — Adding a required field requires a major compatibility change unless a deterministic default exists.

**TYPESYSTEM-R006** — Unknown optional types SHOULD be preserved.

**TYPESYSTEM-R007** — Type registries MUST be deterministic and versioned.

## 7. Invariants

**TYPESYSTEM-I001** — One primary type per node.

**TYPESYSTEM-I002** — Traits are orthogonal capabilities.

**TYPESYSTEM-I003** — Runtime classes are not domain types.

**TYPESYSTEM-I004** — Compatibility claims are testable.

**TYPESYSTEM-I005** — Extension namespaces are unique.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

`org.example.medical.clinicalFinding` may extend a semantic entity type, but it cannot redefine the meaning of the core `claim` type.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `NodeTypes.md`
- `NodeAttributes.md`
- `../Serialization/Serialization.md`
- `../Validation/ValidationRules.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
