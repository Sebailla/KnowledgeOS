# UDM Ontology

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** Ontology  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify controlled vocabulary, namespaces and mappings.

## 2. Scope

Applies to semantic graph projection and graph-consuming capabilities.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

The core ontology provides generic documentary concepts and predicates while supporting mappings to external or domain-specific vocabularies.

## 5. Conceptual Model

Mappings distinguish exactMatch, closeMatch, broader, narrower and related. Deprecation preserves identifiers and replacement mappings.

## 6. Normative Requirements

**ONTOLOGY-R001** — Ontology identifiers MUST be stable.

**ONTOLOGY-R002** — Every term MUST have one definition per version.

**ONTOLOGY-R003** — External mappings MUST record provenance.

**ONTOLOGY-R004** — Automated mappings MUST expose confidence.

**ONTOLOGY-R005** — Extensions MUST use unique namespaces.

**ONTOLOGY-R006** — Deprecated terms MUST remain resolvable.

## 7. Invariants

**ONTOLOGY-I001** — Core meaning cannot be overridden.

**ONTOLOGY-I002** — Ontology evolution is versioned.

**ONTOLOGY-I003** — Mapping does not imply identity unless declared exact and accepted.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A medical plugin can map a core `concept` to a SNOMED identifier without redefining the core node type.

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
