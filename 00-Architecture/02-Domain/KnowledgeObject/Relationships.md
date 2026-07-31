# Knowledge Object Relationships

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** Relationships  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define relationships among Knowledge Objects, versions, sources, personal knowledge and external resources.

## 2. Scope

Covers structural, bibliographic, semantic, provenance, lineage, personal and derived relationship categories.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

Relationships connect independently identified entities.

KnowledgeOS separates:

- source-backed canonical relationships;
- library-management relationships;
- personal relationships;
- derived relationships;
- external mappings.

Relationship persistence does not determine authority. Knowledge Graph projections MAY materialize these relationships, but the originating domain record remains authoritative.

## 5. Conceptual Model

```text
KnowledgeRelationship
├── relationshipId
├── type
├── sourceRef
├── targetRef
├── direction
├── authorityScope
├── evidence[]
├── provenance
├── confidence?
├── validity?
├── lifecycleState
└── extensionData{}
```

Relationship types declare endpoint kinds, multiplicity, direction, symmetry, inverse semantics and authority constraints.

## 6. Normative Requirements

**RELATIONSHIPS-R001** — Every relationship MUST have an immutable identity.

**RELATIONSHIPS-R002** — Every endpoint MUST resolve or be explicitly external.

**RELATIONSHIPS-R003** — Relationship type MUST be registered and compatible with endpoint kinds.

**RELATIONSHIPS-R004** — Source-backed relationships MUST preserve evidence.

**RELATIONSHIPS-R005** — Personal relationships MUST remain user-owned.

**RELATIONSHIPS-R006** — Derived relationships MUST identify the producing process and confidence.

**RELATIONSHIPS-R007** — Symmetry and inverse semantics MUST be defined by the relationship type.

**RELATIONSHIPS-R008** — Relationship conflicts MUST preserve alternatives rather than silently overwrite.

**RELATIONSHIPS-R009** — Deletion MUST preserve tombstone or version history when synchronization or lineage requires it.

**RELATIONSHIPS-R010** — Graph projection MUST preserve relationship identity and authority.

## 7. Invariants

**RELATIONSHIPS-I001** — Relationship authority is explicit.

**RELATIONSHIPS-I002** — Inference is not fact.

**RELATIONSHIPS-I003** — Personal relationships never modify Master Library metadata.

**RELATIONSHIPS-I004** — Relationship identity is independent of graph database storage.

**RELATIONSHIPS-I005** — Version lineage is acyclic.

**RELATIONSHIPS-I006** — Evidence remains traceable.

## 8. Lifecycle and State Transitions

Relationships may be `Proposed`, `Active`, `Disputed`, `Superseded`, `Retired` or `Deleted`.

Machine-generated relationships normally begin as `Proposed`. User confirmation may create or activate a Personal relationship. Source-backed relationships become `Active` after validation. Superseding a relationship preserves prior versions and evidence.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

A source bibliography establishes `cites`. An embedding model proposes `semanticallyRelatedTo` with confidence 0.83. The user creates `personallyRelatedTo`. These three edges may connect the same objects but remain distinct in type, authority and provenance.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `Provenance.md`
- `Versioning.md`
- `../KnowledgeGraph/README.md`
- `../UDM/Graph/RelationshipModel.md`
- `../Identity/README.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
