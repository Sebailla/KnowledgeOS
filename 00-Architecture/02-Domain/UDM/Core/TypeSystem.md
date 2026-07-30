
# Type System

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Type System

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Universal Document Model (UDM) Type System.

The Type System provides the conceptual foundation for every node represented within the UDM.

It establishes:

* node categories;
* inheritance rules;
* behavioral capabilities;
* extensibility mechanisms.

Every UDM node shall conform to this Type System.

---

# 2. Design Goals

The Type System shall:

* remain technology-independent;
* support long-term evolution;
* avoid type duplication;
* preserve semantic consistency;
* support extensibility;
* enable deterministic processing.

The Type System is independent of serialization, rendering and storage.

---

# 3. Design Philosophy

The UDM classifies nodes according to **their role within the knowledge model**, not according to file formats or rendering requirements.

A node is defined by what it represents in the domain, not by how it appears on screen.

---

# 4. Root Type

All UDM elements derive from a single conceptual root.

```text
Node
```

Every node shares a common behavioral contract.

---

# 5. Primary Node Categories

The UDM defines six primary node categories.

```text
Node
│
├── Structural Node
├── Content Node
├── Semantic Node
├── Annotation Node
├── Asset Node
└── Virtual Node
```

These categories are exhaustive.

Every node belongs to exactly one primary category.

---

# 6. Structural Nodes

Structural Nodes organize knowledge.

Examples include:

* Document
* Chapter
* Section
* Paragraph
* Table
* List
* Quote
* Figure
* Footnote

Structural Nodes define hierarchy.

---

# 7. Content Nodes

Content Nodes represent the information itself.

Examples include:

* Text
* Code
* Formula
* Equation
* Citation
* Reference
* Symbol
* Inline Math

Content Nodes carry meaning but do not organize hierarchy.

---

# 8. Semantic Nodes

Semantic Nodes enrich the canonical representation.

Examples include:

* Entity
* Concept
* Person
* Organization
* Location
* Taxon
* Topic
* Keyword

Semantic Nodes are additive.

They never replace canonical content.

---

# 9. Annotation Nodes

Annotation Nodes represent user-generated knowledge.

Examples include:

* Highlight
* Note
* Sticky Note
* Ink
* Bookmark
* Comment

Annotation Nodes remain independent from canonical content.

---

# 10. Asset Nodes

Asset Nodes reference external binary resources.

Examples include:

* Image
* Audio
* Video
* PDF
* Dataset
* Attachment

Asset Nodes never embed binary content.

---

# 11. Virtual Nodes

Virtual Nodes are generated views that do not form part of the canonical knowledge.

Examples include:

* Table of Contents
* Search Result
* Preview
* Generated Summary
* Navigation Tree

Virtual Nodes are ephemeral and reproducible.

---

# 12. Type Hierarchy

Each primary category may define specialized node types.

```text
Node
    │
    ├── Primary Category
            │
            ├── Specialized Type
                    │
                    ├── Domain Variant
```

Specialization never changes the primary category.

---

# 13. Behavioral Capabilities

Every node exposes a common set of capabilities.

Mandatory capabilities include:

* Identity
* Parent Reference
* Child Management (when applicable)
* Attributes
* Validation
* Version Awareness

Additional capabilities may be introduced through specialization.

---

# 14. Type Invariants

The following invariants apply.

* Every node belongs to exactly one primary category.
* Every node has one immutable NodeID.
* Every node has one declared type.
* Every node supports validation.
* Every node supports version tracking.
* Every node preserves semantic consistency.

---

# 15. Extensibility

New node types may be introduced without modifying the existing hierarchy.

Extensions shall:

* declare a primary category;
* define behavioral capabilities;
* define validation rules;
* preserve backward compatibility.

Breaking changes require a new UDM version.

---

# 16. Relationship to Other Documents

This document defines the conceptual type hierarchy.

Specialized node definitions are provided in:

* NodeTypes.md
* StructuralNodes.md
* InlineNodes.md
* SemanticNodes.md
* AnnotationNodes.md
* AssetNodes.md

---

# 17. Status

**Approved**

This document defines the official Type System of the Universal Document Model.

Every node within the UDM shall conform to the categories, invariants and extensibility rules established herein.
