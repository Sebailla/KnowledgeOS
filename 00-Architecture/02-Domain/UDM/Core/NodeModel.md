# Node Model

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Node Model

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the conceptual model shared by every node within the Universal Document Model (UDM).

The Node Model establishes the common structure, identity and behavior that every node shall implement regardless of its specialization.

It is the foundation upon which the entire UDM is built.

---

# 2. Definition

A Node is the smallest identifiable structural element within the Universal Document Model.

Every element represented in the UDM is a Node.

Examples include:

* Document
* Chapter
* Paragraph
* Text
* Image
* Formula
* Entity
* Highlight
* Table
* Citation

All nodes share the same conceptual model.

---

# 3. Design Goals

The Node Model shall:

* provide one universal representation;
* remain technology-independent;
* support deterministic traversal;
* support validation;
* support serialization;
* support semantic enrichment;
* support long-term evolution.

---

# 4. Universal Structure

Every node consists of the following conceptual components.

```text
Node

├── Identity
├── Classification
├── Attributes
├── Parent
├── Children
├── Anchors
├── Relationships
├── Version
└── Metadata
```

Every node exposes the same logical structure.

---

# 5. Identity

Every node owns exactly one immutable NodeID.

Properties:

* globally unique within the Knowledge Object;
* permanent;
* stable;
* independent of serialization.

Identity survives every revision.

---

# 6. Classification

Every node declares:

* Category
* Type
* Variant

Examples:

Category

* Structural

Type

* Paragraph

Variant

* Scientific Paragraph

Classification is immutable after node creation.

---

# 7. Attributes

Attributes describe the node.

Attributes are divided into:

* mandatory attributes;
* optional attributes;
* extension attributes.

Attribute definitions are specified separately in NodeAttributes.md.

---

# 8. Parent

Every node except the Root Node has exactly one parent.

Parent relationships define the structural tree.

The parent reference is immutable unless the structure itself changes through a new version.

---

# 9. Children

Nodes may own zero or more children.

Child order is deterministic.

Ordering is part of the canonical representation.

---

# 10. Anchors

Nodes may expose stable Anchors.

Anchors identify logical positions independently of rendering.

Examples include:

* paragraph positions;
* sentence boundaries;
* character ranges;
* table cells.

Anchor definitions are specified separately.

---

# 11. Relationships

Nodes may participate in semantic relationships.

Relationships are references.

They are not structural children.

Relationship semantics are defined separately.

---

# 12. Version

Every node belongs to one node version.

Node versions evolve independently from the Knowledge Object version whenever appropriate.

Version history is append-only.

---

# 13. Metadata

Nodes may contain descriptive metadata.

Examples include:

* language;
* style role;
* semantic hints;
* confidence values.

Node metadata never replaces Knowledge Object metadata.

---

# 14. Canonical Rules

Every node shall satisfy the following rules.

* One immutable NodeID.
* One Category.
* One Type.
* One Variant (optional).
* Zero or one Parent.
* Deterministic Child ordering.
* Stable identity.
* Version awareness.

---

# 15. Tree Participation

Every node belongs to exactly one structural tree.

Cycles are forbidden.

Disconnected subtrees are forbidden.

The Root Node is unique.

---

# 16. Semantic Participation

Nodes may simultaneously participate in semantic graphs.

Tree participation and graph participation are independent.

A node may have:

* one parent;
* many semantic relationships.

---

# 17. Extensibility

Specialized nodes extend the Node Model.

Extensions may introduce:

* additional attributes;
* validation rules;
* rendering hints;
* semantic capabilities.

Extensions shall never violate the universal structure.

---

# 18. Relationship to Other Documents

This document defines the common anatomy of every node.

Specialization is defined by:

* TypeSystem.md
* NodeTypes.md
* NodeAttributes.md

Behavior is defined by:

* ValidationRules.md
* ProcessingPipeline.md
* Serialization.md

---

# 19. Related Documents

* TypeSystem.md
* NodeTypes.md
* NodeAttributes.md
* StructuralNodes.md
* InlineNodes.md
* SemanticNodes.md
* Anchors.md

---

# 20. Status

**Approved**

This document defines the universal conceptual model shared by every node in the Universal Document Model.

Every node shall preserve the structure, identity and invariants established herein.
