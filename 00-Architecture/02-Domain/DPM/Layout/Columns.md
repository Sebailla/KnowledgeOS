
# Columns

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Columns

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Column model of the Document Presentation Model (DPM).

Columns organize reading flow inside presentation Regions.

Columns describe presentation intent only.

They never represent canonical knowledge.

---

# 2. Scope

Columns define:

* multi-column layouts;
* content distribution;
* reading progression;
* column sequencing;
* visual organization within Regions.

Canonical document structure remains defined by the UDM.

---

# 3. Design Goals

Columns shall:

* preserve presentation intent;
* remain renderer-independent;
* support adaptive layouts;
* support faithful reconstruction;
* support deterministic reading order.

---

# 4. Design Philosophy

A Column represents a logical reading container.

It is not a fixed rectangle.

It is not a screen coordinate.

Its purpose is to organize the presentation flow inside a Region.

---

# 5. Conceptual Model

```text
Page
    │
    ▼
Region
    │
    ▼
Columns
    │
    ▼
Presentation Elements
```

Columns organize content within a Region.

---

# 6. Column Identity

Every Column owns:

* PresentationNodeID;
* ColumnType;
* VersionID.

Identity is immutable.

---

# 7. Column Categories

Typical Column Types include:

* Single Column;
* Left Column;
* Right Column;
* Center Column;
* Auxiliary Column;
* Sidebar Column;
* Variable Width Column.

Extensions may define additional column types.

---

# 8. Column Composition

A Column may contain:

* Presentation Elements;
* nested layout containers;
* floating presentation elements.

Columns never contain canonical UDM Nodes directly.

---

# 9. Reading Order

Columns contribute to reading progression.

Typical examples include:

* left-to-right;
* right-to-left;
* top-to-bottom;
* bidirectional layouts.

The definitive reading sequence is defined by the Reading Flow model.

---

# 10. Adaptive Layout

Render Engines may:

* merge columns;
* split columns;
* resize columns;
* reorder visual placement.

These adaptations shall preserve presentation intent.

The canonical DPM remains unchanged.

---

# 11. Column Constraints

Columns may declare presentation constraints.

Examples include:

* preferred width;
* minimum width;
* maximum width;
* proportional width;
* balancing policy;
* continuation policy.

Constraints express presentation intent rather than rendering instructions.

---

# 12. Multi-Column Documents

The DPM supports layouts including:

* books;
* scientific papers;
* magazines;
* newspapers;
* technical manuals.

The same DPM may be rendered using different column strategies without changing canonical presentation.

---

# 13. Relationship to Regions

Every Column belongs to exactly one Region.

Regions determine logical ownership.

Columns determine internal content distribution.

---

# 14. Relationship to Reading Flow

Reading Flow traverses Columns explicitly.

Visual position alone does not determine reading sequence.

---

# 15. Relationship to the Layout Graph

Columns participate in the Layout Graph.

Typical spatial relationships include:

* LEFT_OF;
* RIGHT_OF;
* ADJACENT_TO;
* ALIGNS_WITH;
* CONTINUES_IN.

The Layout Graph remains authoritative for spatial relationships.

---

# 16. Relationship to the UDM

Columns reference Presentation Nodes mapped to canonical UDM elements.

Columns never modify:

* canonical structure;
* semantic meaning;
* annotations;
* provenance.

---

# 17. Validation

A valid Column shall satisfy:

* valid parent Region;
* unique identity;
* deterministic ordering;
* valid participation in Reading Flow;
* valid participation in the Layout Graph.

---

# 18. Invariants

The following invariants apply:

* every Column belongs to one Region;
* Columns organize presentation only;
* Columns never contain canonical knowledge;
* identity is immutable;
* ordering is deterministic;
* Columns remain renderer-independent.

---

# 19. Related Documents

* Pages.md
* Regions.md
* ReadingFlow.md
* SpatialRelationships.md
* LayoutGraph.md
* ../Core/PresentationNodeModel.md

---

# 20. Status

**Approved**

This document defines the Column model of the Document Presentation Model.

Columns organize reading flow inside Regions while preserving presentation intent independently of rendering technologies.
