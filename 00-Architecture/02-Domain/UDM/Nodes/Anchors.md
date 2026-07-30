# Anchors

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Anchors

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Anchor model of the Universal Document Model (UDM).

Anchors provide stable logical references to positions within canonical knowledge.

They are independent of rendering, pagination, storage format and device.

Anchors are the foundation for annotations, deep links, semantic references and fine-grained synchronization.

---

# 2. Design Goals

The Anchor model shall:

* provide stable logical references;
* survive rendering changes;
* survive serialization;
* survive synchronization;
* support semantic enrichment;
* support precise navigation;
* support long-term preservation.

---

# 3. Design Philosophy

An Anchor identifies a logical position.

It never identifies visual coordinates.

It never identifies page numbers.

It never depends on a renderer.

Anchors belong to canonical knowledge.

---

# 4. Conceptual Model

```text
Knowledge Object
        │
        ▼
Universal Document Model
        │
        ▼
Node
        │
        ▼
Anchor
        │
        ▼
Logical Position
```

The Node identifies *what*.

The Anchor identifies *where inside*.

---

# 5. Anchor Categories

The UDM defines three primary Anchor categories.

```text
Anchor
│
├── Structural Anchor
├── Content Anchor
└── Semantic Anchor
```

Each category serves a different purpose.

---

# 6. Structural Anchors

Structural Anchors identify complete structural elements.

Examples:

* Document;
* Chapter;
* Section;
* Figure;
* Table;
* Paragraph.

They are stable as long as the structural node exists.

---

# 7. Content Anchors

Content Anchors identify logical positions within content.

Examples include:

* sentence;
* phrase;
* word;
* token;
* character range;
* table cell;
* list item.

Content Anchors are independent of pagination.

---

# 8. Semantic Anchors

Semantic Anchors identify conceptual regions of knowledge.

Examples:

* entity span;
* concept occurrence;
* claim boundary;
* observation;
* definition.

Semantic Anchors may evolve independently of textual formatting.

---

# 9. Anchor Identity

Every Anchor possesses:

* AnchorID;
* NodeID;
* AnchorType;
* VersionID.

Anchor identity is immutable.

---

# 10. Logical Position

Logical positions are expressed relative to the canonical node structure.

Examples:

* first sentence;
* third list item;
* second table row;
* equation identifier.

Logical positions are deterministic.

---

# 11. Anchor Evolution

Anchors evolve only when the canonical structure changes.

Renderer changes never affect Anchor identity.

Minor formatting changes shall preserve existing Anchors whenever possible.

---

# 12. Anchor Relationships

Anchors may participate in relationships with:

* Annotation Nodes;
* Semantic Nodes;
* Asset Nodes;
* other Anchors.

These relationships remain external to the structural tree.

---

# 13. Deep Linking

Anchors support persistent deep links.

A deep link may reference:

* a document;
* a structural node;
* a content fragment;
* a semantic region.

Deep links remain stable across renderers.

---

# 14. Synchronization

Anchors are synchronized independently from rendering information.

This enables:

* precise conflict detection;
* annotation preservation;
* incremental synchronization;
* collaborative editing.

---

# 15. Rendering

Render Engines resolve Anchors to visual positions.

The renderer determines coordinates.

The Anchor determines logical identity.

---

# 16. Invariants

The following invariants apply.

* Every Anchor has one immutable AnchorID.
* Every Anchor references exactly one Node.
* Anchors never depend on page numbers.
* Anchors never depend on screen coordinates.
* Anchors survive serialization.
* Anchors survive synchronization.
* Anchors survive renderer changes.

---

# 17. Relationship to Other Layers

| Layer            | Relationship                      |
| ---------------- | --------------------------------- |
| Structural Layer | References structural positions   |
| Content Layer    | References logical content        |
| Semantic Layer   | Defines semantic regions          |
| Annotation Layer | Primary attachment mechanism      |
| Graph Layer      | Supports fine-grained graph links |

Anchors provide the bridge between canonical knowledge and derived functionality.

---

# 18. Relationship to Platform Engines

| Engine            | Responsibility                      |
| ----------------- | ----------------------------------- |
| Render Engine     | Resolve Anchors to visual positions |
| Annotation Engine | Attach annotations                  |
| Search Engine     | Navigate search results             |
| Knowledge Engine  | Create semantic anchors             |
| AI Engine         | Discover semantic regions           |
| Sync Engine       | Synchronize anchor references       |
| Export Engine     | Preserve deep links where possible  |

All engines rely on Anchors as stable logical references.

---

# 19. Related Documents

* ContentNodes.md
* StructuralNodes.md
* AnnotationNodes.md
* SemanticNodes.md
* Graph/RelationshipModel.md
* Core/Identity.md

---

# 20. Status

**Approved**

This document defines the Anchor model of the Universal Document Model.

Anchors provide stable logical references that remain independent of rendering technologies, storage mechanisms and document layouts, enabling robust annotations, semantic navigation and long-term knowledge preservation.
