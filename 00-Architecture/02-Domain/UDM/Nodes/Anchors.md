# UDM Anchor Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** Anchors  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify stable locations and ranges connecting sources, UDM, DPM and Personal Knowledge.

## 2. Scope

Applies to canonical UDM instances, processors, validators and serializers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Anchors support node, text-range, source-byte, page-region, media-time and composite selectors.

## 5. Conceptual Model

An anchor contains identity, target version, selector, context fingerprint, provenance, resilience strategy and resolution history.

## 6. Normative Requirements

**ANCHORS-R001** — Every anchor MUST identify its target scope and version.

**ANCHORS-R002** — Selectors MUST be deterministic for a fixed target.

**ANCHORS-R003** — Re-anchoring MUST preserve the original selector.

**ANCHORS-R004** — Ambiguous resolution MUST return alternatives rather than silently choose.

**ANCHORS-R005** — Page-region selectors MUST remain DPM/source references, not semantic coordinates.

**ANCHORS-R006** — Composite anchors SHOULD combine independent evidence for resilience.

## 7. Invariants

**ANCHORS-I001** — Anchor identity is stable.

**ANCHORS-I002** — Resolution history is append-only.

**ANCHORS-I003** — Unresolved anchors remain representable.

**ANCHORS-I004** — Selectors do not mutate source content.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A resilient text anchor can combine node identity, quoted text, prefix/suffix context and source checksum.

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
