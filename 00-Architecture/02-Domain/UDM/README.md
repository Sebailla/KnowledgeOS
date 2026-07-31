# UDM Package Guide

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the package boundaries, reading order, ownership and maintenance rules for the complete UDM specification.

## 2. Scope

Applies to all documents and subdirectories under `02-Domain/UDM`.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

This package owns the canonical semantic representation of documentary knowledge. It depends only on Foundation and Domain contracts. Kernel and Platform components implement or consume these contracts but SHALL NOT redefine them.

The rector document is `UDM.md`. All other files refine one bounded topic. When wording appears to conflict, the most specific normative rule applies unless it contradicts a rector invariant.

## 5. Conceptual Model

```text
UDM/
├── UDM.md
├── Core/
├── Nodes/
├── Graph/
├── Processing/
├── Serialization/
└── Validation/
```

Recommended reading order is `UDM.md`, Core, Nodes, Graph, Processing, Serialization and Validation. Changes follow dependency order and require cross-document validation.

## 6. Normative Requirements

**README-R001** — The package SHALL remain independent of storage engines, UI frameworks, network transports and AI providers.

**README-R002** — Each semantic concept SHALL have one authoritative definition.

**README-R003** — Subordinate specifications SHALL reference rather than duplicate rector definitions.

**README-R004** — Every normative rule SHALL be testable or clearly bounded.

**README-R005** — File and directory names SHALL remain stable within the V4 major version.

**README-R006** — A change affecting another package SHALL identify the impacted contract.

## 7. Invariants

**README-I001** — UDM semantics are presentation-independent.

**README-I002** — Personal Knowledge remains a separate authority layer.

**README-I003** — Source provenance is preserved.

**README-I004** — Derived artifacts remain rebuildable.

**README-I005** — The package has no dependency on Platform implementations.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A renderer may consume UDM and DPM, but its Swift classes are not referenced by this package. A PostgreSQL schema may persist UDM, but table names do not appear in the domain contract.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `UDM.md`
- `../DomainModel.md`
- `../KnowledgeObject/README.md`
- `../DPM/README.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
