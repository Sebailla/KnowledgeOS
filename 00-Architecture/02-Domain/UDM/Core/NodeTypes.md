# UDM Node Type Catalogue

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** NodeTypes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the core node families, baseline types and classification rules.

## 2. Scope

Defines type taxonomy. Family-specific contracts are refined under `Nodes/`.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Core families are Structural, Content, Inline, Semantic, Asset Reference and Annotation Reference.

Classification is evidence-based. Processors choose the most specific justified type and record confidence when classification is inferred.

## 5. Conceptual Model

| Family | Representative types |
|---|---|
| Structural | document, part, chapter, section, appendix |
| Content | paragraph, heading, list, table, figure, codeBlock |
| Inline | text, emphasis, link, citation, term, formulaInline |
| Semantic | person, organization, place, event, concept, claim |
| Asset | imageAsset, audioAsset, videoAsset, datasetAsset |
| Annotation Reference | annotationTarget, annotationReference |

## 6. Normative Requirements

**NODETYPES-R001** — A node MUST belong to exactly one primary family.

**NODETYPES-R002** — A primary type MUST be registered and versioned.

**NODETYPES-R003** — Processors MUST NOT infer semantic specificity solely from visual styling.

**NODETYPES-R004** — Unknown source structures MUST be preserved using defined fallback types.

**NODETYPES-R005** — Extension types MUST use globally unique namespaces.

**NODETYPES-R006** — Traits MUST NOT contradict the primary family.

**NODETYPES-R007** — Deprecated types MUST remain resolvable during their compatibility window.

## 7. Invariants

**NODETYPES-I001** — Type identity is stable.

**NODETYPES-I002** — Core type semantics cannot be overridden.

**NODETYPES-I003** — Unknown types remain preservable.

**NODETYPES-I004** — Classification uncertainty remains explicit.

**NODETYPES-I005** — Presentation and semantic type systems remain separate.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

Bold text is not automatically a heading. A visually large line becomes a heading only when structural evidence supports that classification.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `TypeSystem.md`
- `NodeModel.md`
- `../Nodes/ContentNodes.md`
- `../Nodes/SemanticNodes.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
