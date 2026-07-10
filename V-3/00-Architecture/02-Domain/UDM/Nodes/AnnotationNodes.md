
# Annotation Nodes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Annotation Nodes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Annotation Nodes of the Universal Document Model (UDM).

Annotation Nodes represent user-created knowledge associated with canonical content.

Annotations never modify canonical knowledge.

They constitute an independent knowledge layer.

---

# 2. Design Goals

Annotation Nodes shall:

* preserve user knowledge;
* remain independent of rendering;
* survive document evolution;
* support synchronization;
* support collaboration;
* preserve provenance.

---

# 3. Design Philosophy

Annotations are first-class domain objects.

They are not visual decorations.

They represent additional knowledge created by users.

Canonical knowledge remains unchanged.

---

# 4. Annotation Layer

The annotation layer is independent of the structural tree.

```text
Knowledge Object
        │
        ▼
Universal Document Model
        │
        ├── Structural Layer
        ├── Content Layer
        ├── Semantic Layer
        └── Annotation Layer
```

Annotations reference canonical knowledge without becoming part of it.

---

# 5. Annotation Categories

```text
Annotation Node
│
├── Highlight
├── Note
├── Sticky Note
├── Bookmark
├── Ink
├── Drawing
├── Comment
├── Tag
└── Custom Annotation
```

Extensions may define additional annotation types.

---

# 6. Highlight

Represents emphasized content.

Properties may include:

* color;
* style;
* author;
* timestamp.

Highlights reference Anchors rather than text offsets.

---

# 7. Note

Represents user-authored textual knowledge.

Notes may contain:

* formatted text;
* links;
* references;
* checklists;
* embedded content.

Notes are independent Knowledge Nodes.

---

# 8. Sticky Note

Represents a floating annotation attached to one or more Anchors.

Presentation is renderer-specific.

Semantic meaning is canonical.

---

# 9. Bookmark

Represents a stable navigation marker.

Bookmarks reference logical positions rather than pages.

Bookmarks survive renderer changes.

---

# 10. Ink

Represents handwritten input.

Examples:

* Apple Pencil;
* stylus;
* freehand drawing.

Ink preserves:

* stroke geometry;
* pressure;
* timing (optional);
* tool information.

Ink references Anchors.

It never references pages.

---

# 11. Drawing

Represents graphical annotations.

Examples:

* arrows;
* circles;
* diagrams;
* freehand illustrations.

Drawings are independent annotation objects.

---

# 12. Comment

Represents contextual discussion.

Comments may include:

* author;
* replies;
* timestamps;
* status.

Comment threads are versioned independently.

---

# 13. Tag

Represents user-defined classification.

Tags may reference:

* Knowledge Objects;
* Nodes;
* Anchors;
* other Annotations.

Tags support personal organization.

---

# 14. Annotation Identity

Every Annotation Node possesses:

* AnnotationID;
* VersionID;
* Provenance;
* Author.

Annotation identity is immutable.

---

# 15. Annotation Anchoring

Annotations are attached through Anchors.

```text
Annotation

↓

Anchor

↓

Node
```

Annotations never depend on:

* page numbers;
* visual coordinates;
* rendered positions.

---

# 16. Annotation Versioning

Annotation revisions evolve independently.

Examples:

* text edited;
* highlight color changed;
* bookmark renamed;
* ink refined.

Canonical content remains unchanged.

---

# 17. Annotation Provenance

Every annotation records:

* creator;
* creation time;
* modification history;
* synchronization history.

Annotations preserve complete provenance.

---

# 18. Annotation Invariants

The following invariants apply.

* Annotations never modify canonical knowledge.
* Annotations always reference Anchors.
* Annotation identity is immutable.
* Annotation history is append-only.
* Annotations remain renderer-independent.
* Annotations survive synchronization.

---

# 19. Relationship to Other Layers

| Layer            | Relationship    |
| ---------------- | --------------- |
| Structural Layer | Anchored        |
| Content Layer    | Anchored        |
| Semantic Layer   | May enrich      |
| Asset Layer      | May reference   |
| Graph Layer      | May participate |

Annotations never become structural nodes.

---

# 20. Relationship to Platform Engines

| Engine            | Responsibility                 |
| ----------------- | ------------------------------ |
| Annotation Engine | Owns Annotation Nodes          |
| Render Engine     | Displays annotations           |
| Sync Engine       | Synchronizes annotations       |
| Search Engine     | Indexes searchable annotations |
| AI Engine         | May analyze annotations        |
| Export Engine     | Optionally exports annotations |

The Annotation Engine is the authoritative owner of annotation behavior.

---

# 21. Related Documents

* Anchors.md
* ContentNodes.md
* StructuralNodes.md
* SemanticNodes.md
* Core/Identity.md
* Core/TemporalModel.md

---

# 22. Status

**Approved**

This document defines the Annotation Nodes of the Universal Document Model.

Annotation Nodes represent independent user knowledge that augments canonical content while preserving rendering independence, synchronization stability and long-term traceability.
