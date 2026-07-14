
# Node Identity

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Identity

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the identity model of every node within the Universal Document Model (UDM).

Identity allows nodes to be referenced consistently throughout their entire lifecycle.

Identity is independent of:

* rendering;
* serialization;
* storage;
* synchronization;
* parent hierarchy;
* physical position.

---

# 2. Design Goals

The identity model shall:

* remain immutable;
* survive every transformation;
* remain globally unique within a Knowledge Object;
* support synchronization;
* support semantic references;
* support annotations;
* support graph construction.

---

# 3. Identity Principles

Node identity answers one question only:

> Which node is this?

Identity never answers:

* where the node is;
* how it is rendered;
* how it is serialized;
* which parent currently owns it.

Those concerns belong to other models.

---

# 4. Identity Components

Every node possesses a conceptual identity.

```text
Node Identity

├── NodeID
├── VersionID
└── KnowledgeObjectID
```

These identifiers uniquely identify a node and its evolution.

---

# 5. NodeID

Every node has exactly one immutable NodeID.

Properties:

* unique within the Knowledge Object;
* permanent;
* immutable;
* renderer-independent;
* storage-independent.

The NodeID never changes after creation.

---

# 6. VersionID

Every node revision receives its own VersionID.

The VersionID identifies a specific historical state of the node.

The NodeID remains constant across all revisions.

---

# 7. KnowledgeObjectID

Every node belongs to exactly one Knowledge Object.

The KnowledgeObjectID establishes aggregate ownership.

Nodes never migrate between Knowledge Objects.

If knowledge is reused elsewhere, a new Knowledge Object is created with its own node identities.

---

# 8. Identity Lifecycle

Identity is created exactly once.

```text
Create
   │
   ▼
Persist
   │
   ▼
Reference
   │
   ▼
Version
   │
   ▼
Archive
```

Identity is never regenerated.

---

# 9. Stable References

Every internal reference shall use NodeID.

Examples include:

* annotations;
* semantic links;
* citations;
* graph edges;
* bookmarks.

References shall never depend on visual position.

---

# 10. Identity and Anchors

Identity and Anchors are different concepts.

| Identity          | Anchor                        |
| ----------------- | ----------------------------- |
| Identifies a node | Identifies a logical position |
| Permanent         | May evolve with the document  |
| Immutable         | May be recalculated           |
| Domain concept    | Structural concept            |

Anchors are defined separately.

---

# 11. Identity Invariants

The following invariants apply.

* Every node has exactly one NodeID.
* NodeIDs never change.
* NodeIDs are never reused.
* Identity survives every version.
* Identity survives serialization.
* Identity survives synchronization.
* Identity survives rendering.

---

# 12. Relationship to Versioning

Versioning records the evolution of a node.

Identity records the continuity of that node.

Identity remains constant.

Versions evolve.

---

# 13. Relationship to Serialization

Serialization preserves identity.

Deserialization restores the same identity.

Identity is independent of serialization formats.

---

# 14. Relationship to Synchronization

Synchronization compares NodeIDs rather than visual positions.

Node identity enables deterministic merges across devices.

---

# 15. Relationship to Graphs

Semantic graphs reference NodeIDs.

Graph edges never depend on rendering positions.

This guarantees graph stability even when the document structure evolves.

---

# 16. Relationship to Other Documents

Identity collaborates with:

* NodeModel.md
* Versioning.md
* Anchors.md
* RelationshipModel.md
* Serialization.md

Identity remains independent from every implementation technology.

---

# 17. Related Documents

* NodeModel.md
* NodeAttributes.md
* Anchors.md
* Versioning.md
* RelationshipModel.md

---

# 18. Status

**Approved**

This document defines the identity model shared by every node in the Universal Document Model.

Every node shall preserve immutable identity throughout its entire lifecycle.
