# UDM Identity Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** Identity  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify stable identity for UDM documents, nodes, relationships, anchors, assets, types and versions.

## 2. Scope

Covers identity kinds, scope, generation, persistence, aliases, lineage and migration. It excludes user accounts and storage row identifiers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

Identity expresses semantic continuity. It is opaque to consumers and independent of storage location, runtime object identity, array order or database keys.

UDM defines `DocumentId`, `NodeId`, `RelationshipId`, `AnchorId`, `AssetRefId`, `TypeId` and `VersionId`. Globally addressable references combine identity kind and scope.

## 5. Conceptual Model

```text
GlobalNodeRef
├── documentId
└── nodeId

Lineage
├── predecessorIds[]
├── successorIds[]
├── reason
└── provenance
```

Source-derived IDs SHOULD be deterministic when stable selectors exist. Generated IDs MAY be random but become immutable after publication.

## 6. Normative Requirements

**IDENTITY-R001** — Every canonical entity that can be referenced independently MUST have an immutable identity.

**IDENTITY-R002** — A NodeId MUST be unique within its DocumentId scope.

**IDENTITY-R003** — Identity generation MUST NOT use volatile array positions, memory addresses or local row numbers.

**IDENTITY-R004** — Compatible reprocessing SHOULD preserve identity when semantic continuity remains.

**IDENTITY-R005** — Split and merge operations MUST record lineage.

**IDENTITY-R006** — External identifiers such as DOI, ISBN and URI MUST be represented as aliases, not UDM identities.

**IDENTITY-R007** — Deleted or retired identities MUST NOT be silently reused.

## 7. Invariants

**IDENTITY-I001** — Identity is immutable.

**IDENTITY-I002** — Identity is opaque.

**IDENTITY-I003** — Identity survives serialization and synchronization.

**IDENTITY-I004** — Alias equality does not by itself establish semantic identity.

**IDENTITY-I005** — Lineage is acyclic.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

A paragraph moved to another page keeps its NodeId because pagination is presentation. A paragraph whose meaning is replaced receives a new NodeId and records `replaces` lineage to the former node.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `NodeModel.md`
- `../Nodes/Anchors.md`
- `../Graph/RelationshipModel.md`
- `../../KnowledgeObject/Versioning.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
