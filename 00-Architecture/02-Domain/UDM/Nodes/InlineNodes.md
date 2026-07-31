# UDM Inline Nodes

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** InlineNodes  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify span-level text and inline semantics.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Inline nodes include text, emphasis, strong, code, link, citation, term, formulaInline, lineBreak, ruby and languageSpan.

## 5. Conceptual Model

Inline nodes preserve text order, nesting, language changes, citation semantics and meaningful whitespace without importing visual styling.

## 6. Normative Requirements

**INLINENODES-R001** — Inline nesting MUST be well formed.

**INLINENODES-R002** — Text MUST be valid Unicode.

**INLINENODES-R003** — Meaningful whitespace MUST be preserved.

**INLINENODES-R004** — Visual style alone MUST NOT create semantic inline types.

**INLINENODES-R005** — Links MUST preserve targets and provenance.

**INLINENODES-R006** — Citations MUST remain distinguishable from generic links.

**INLINENODES-R007** — Source ranges MUST be represented through anchors.

## 7. Invariants

**INLINENODES-I001** — Text order is stable.

**INLINENODES-I002** — Inline nodes belong to one content context.

**INLINENODES-I003** — Presentation styling is excluded.

**INLINENODES-I004** — Unknown inline extensions remain preservable.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A bold span is represented as `strong` only when it conveys semantic importance; decorative bold belongs to DPM.

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
