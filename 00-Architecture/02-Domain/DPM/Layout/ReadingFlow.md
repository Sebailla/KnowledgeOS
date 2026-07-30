
# Reading Flow

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Reading Flow

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Reading Flow model of the Document Presentation Model (DPM).

Reading Flow specifies the logical sequence in which presentation elements are intended to be consumed.

Reading Flow is independent of physical layout.

It preserves the author's intended reading experience.

---

# 2. Scope

Reading Flow governs:

* logical reading order;
* continuation across columns;
* continuation across pages;
* nested reading sequences;
* alternative reading paths.

It does not describe physical position.

Physical relationships are defined by the Layout Graph.

---

# 3. Design Goals

Reading Flow shall:

* preserve intended reading order;
* remain renderer-independent;
* remain deterministic;
* support adaptive layouts;
* support multiple writing systems;
* remain compatible with accessibility technologies.

---

# 4. Design Philosophy

Presentation layout and reading order are different concerns.

Visual adjacency does not imply reading sequence.

Reading Flow explicitly represents how information should be consumed.

---

# 5. Conceptual Model

```text
Presentation Elements
        │
        ▼
Reading Flow Graph
        │
        ▼
Reading Sequence
```

Reading Flow is an ordered traversal model.

---

# 6. Reading Units

Reading Flow connects logical reading units.

Examples include:

* title;
* heading;
* paragraph;
* figure;
* caption;
* table;
* equation;
* sidebar;
* footnote.

Each reading unit references one or more Presentation Nodes.

---

# 7. Reading Relationships

The following relationships are defined:

* START_OF_FLOW
* END_OF_FLOW
* NEXT_IN_FLOW
* PREVIOUS_IN_FLOW
* CONTINUES_IN
* RETURNS_TO
* BRANCHES_TO
* MERGES_FROM

These relationships define reading progression.

---

# 8. Flow Boundaries

Reading Flows may begin or end at:

* document;
* page;
* region;
* column;
* nested presentation group.

Boundaries are logical.

---

# 9. Multi-Column Reading

Reading Flow explicitly defines how columns are traversed.

Examples include:

* left column → right column;
* top column → bottom column;
* right-to-left layouts;
* vertical writing systems.

Column position alone is insufficient.

---

# 10. Multi-Page Reading

Reading Flow preserves continuity across pages.

Examples include:

* continued paragraphs;
* continued figures;
* continued tables;
* continued code listings.

Page breaks do not interrupt logical reading.

---

# 11. Alternative Reading Paths

A document may define alternative reading experiences.

Examples include:

* simplified reading;
* academic reading;
* presentation mode;
* accessibility mode.

Alternative paths reference the same canonical presentation.

---

# 12. Accessibility

Reading Flow shall provide a deterministic traversal suitable for:

* screen readers;
* keyboard navigation;
* voice interfaces;
* assistive technologies.

Accessibility shall never depend solely on visual position.

---

# 13. Relationship to Layout Graph

Reading Flow complements the Layout Graph.

The Layout Graph defines spatial organization.

Reading Flow defines traversal order.

Neither replaces the other.

---

# 14. Relationship to Pages

Pages provide visual organization.

Reading Flow may cross page boundaries without interruption.

---

# 15. Relationship to Regions

Reading Flow traverses Regions according to logical sequence.

Region order is not inferred from geometry.

---

# 16. Relationship to Columns

Columns contribute to Reading Flow.

The Reading Flow model explicitly defines how readers move between columns.

---

# 17. Relationship to the UDM

Reading Flow references Presentation Nodes mapped to canonical UDM elements.

Reading Flow never modifies:

* canonical knowledge;
* semantic relationships;
* provenance;
* annotations.

---

# 18. Validation

A valid Reading Flow shall satisfy:

* one or more valid entry points;
* deterministic ordering;
* no unreachable reading units;
* no invalid cycles;
* valid references to Presentation Nodes.

---

# 19. Invariants

The following invariants apply:

* Reading Flow defines logical traversal only;
* visual position does not determine reading order;
* every referenced Presentation Node exists;
* traversal is deterministic;
* Reading Flow is renderer-independent.

---

# 20. Related Documents

* LayoutGraph.md
* Pages.md
* Regions.md
* Columns.md
* SpatialRelationships.md
* ../Core/PresentationNodeModel.md

---

# 21. Status

**Approved**

This document defines the Reading Flow model of the Document Presentation Model.

Reading Flow preserves the logical reading sequence independently of physical layout, ensuring deterministic traversal, adaptive rendering and accessibility across all supported presentation experiences.
