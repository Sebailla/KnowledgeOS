# UDM Content Nodes

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** ContentNodes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify block-level semantic content nodes.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Content nodes include paragraph, heading, blockquote, list, listItem, codeBlock, formulaBlock, table, row, cell, figure, caption, footnote, endnote, definition, example and warning.

## 5. Conceptual Model

Content nodes preserve meaningful block boundaries and source order. Tables use explicit row and cell structure; figures reference assets; code and formulas preserve original and optional normalized forms.

## 6. Normative Requirements

**CONTENTNODES-R001** — Content classification MUST be evidence-based.

**CONTENTNODES-R002** — A content node MUST obey the child constraints of its type.

**CONTENTNODES-R003** — Tables MUST preserve logical row and cell relationships.

**CONTENTNODES-R004** — Figures MUST reference assets rather than embed storage paths.

**CONTENTNODES-R005** — Generated summaries MUST NOT be inserted as source publication content.

**CONTENTNODES-R006** — Footnotes and citations MUST preserve target relationships and anchors.

## 7. Invariants

**CONTENTNODES-I001** — Block boundaries are semantic.

**CONTENTNODES-I002** — Content order is deterministic.

**CONTENTNODES-I003** — Binary bytes remain external.

**CONTENTNODES-I004** — Generated content has separate authority.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A figure node references an image asset and contains a caption node. Its position and dimensions are represented in DPM.

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
