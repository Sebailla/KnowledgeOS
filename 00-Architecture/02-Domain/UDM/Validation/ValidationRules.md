# UDM Validation Rules

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** ValidationRules  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify machine-evaluable validity and publication-readiness rules.

## 2. Scope

Covers envelope, schema, identity, typing, structure, relationships, provenance, temporal and extension validation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Validation is layered: envelope, schema, identity, node, containment, relationship, provenance, semantic consistency and publication readiness.

Findings are fatal, invalid, incomplete, warning or advisory. Validators are deterministic and non-mutating.

## 5. Conceptual Model

```text
ValidationFinding
├── ruleId
├── severity
├── entityRef
├── path?
├── message
├── evidence[]
├── validatorVersion
└── remediation?
```

## 6. Normative Requirements

**VALIDATIONRULES-R001** — Canonical publication MUST have zero fatal, invalid and incomplete findings.

**VALIDATIONRULES-R002** — Every finding MUST identify a stable rule ID.

**VALIDATIONRULES-R003** — Validators MUST NOT mutate the model.

**VALIDATIONRULES-R004** — Identical input and validator versions MUST produce equivalent findings.

**VALIDATIONRULES-R005** — Suppressions MUST be explicit and auditable.

**VALIDATIONRULES-R006** — Known extensions MUST be validated against registered schemas.

**VALIDATIONRULES-R007** — Unknown required extensions MUST prevent publication.

**VALIDATIONRULES-R008** — Warnings MAY remain only when explicitly accepted.

## 7. Invariants

**VALIDATIONRULES-I001** — Validation is deterministic.

**VALIDATIONRULES-I002** — Rule IDs are stable.

**VALIDATIONRULES-I003** — Severity semantics are consistent.

**VALIDATIONRULES-I004** — Validation never changes authority.

**VALIDATIONRULES-I005** — Reports are serializable.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A duplicate NodeId is `invalid`; an unsupported major schema is `fatal`; a low-confidence classification may be a `warning`; a missing required processing stage is `incomplete`.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `ConsistencyRules.md`
- `../Core/NodeModel.md`
- `../Serialization/Serialization.md`
- `../Processing/ProcessingPipeline.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
