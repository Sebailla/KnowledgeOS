# UDM Node Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** NodeModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify the common structure, lifecycle and containment behavior of every UDM node.

## 2. Scope

Applies to structural, content, inline, semantic, asset and annotation-reference node families.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

A node is the smallest independently identifiable semantic unit. Nodes are immutable snapshots inside a canonical document version.

Containment and relationships are distinct. Containment provides one ordered semantic hierarchy. Relationships provide cross-cutting graph semantics.

## 5. Conceptual Model

```text
UDMNode
├── id
├── primaryType
├── traits[]
├── attributes{}
├── provenance
├── temporal?
├── parentId?
├── childIds[]
├── anchorIds[]
├── assetRefIds[]
└── extensions{}
```

## 6. Normative Requirements

**NODEMODEL-R001** — Every node MUST declare exactly one primary type.

**NODEMODEL-R002** — Every non-root contained node MUST declare exactly one parent.

**NODEMODEL-R003** — Containment MUST be acyclic.

**NODEMODEL-R004** — Sibling order MUST be explicit and deterministic.

**NODEMODEL-R005** — Node mutation MUST create a new document version.

**NODEMODEL-R006** — Runtime state MUST NOT be stored in canonical nodes.

**NODEMODEL-R007** — Unknown optional extension data SHOULD be preserved through round trips.

**NODEMODEL-R008** — A node MUST satisfy the schema and child constraints of its primary type.

## 7. Invariants

**NODEMODEL-I001** — Node identity is stable.

**NODEMODEL-I002** — The containment graph is a rooted ordered forest under the document envelope.

**NODEMODEL-I003** — Semantic relationships do not replace containment.

**NODEMODEL-I004** — Presentation geometry is absent.

**NODEMODEL-I005** — Source-derived nodes preserve provenance.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A section contains headings and paragraphs through `childIds`. A citation from a paragraph to a bibliography entry is a relationship, not a second parent-child edge.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `Identity.md`
- `NodeTypes.md`
- `NodeAttributes.md`
- `../Nodes/StructuralNodes.md`
- `../Validation/ConsistencyRules.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
