
# Regions

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Regions

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Region model of the Document Presentation Model (DPM).

Regions partition a Page into logical presentation areas.

Regions organize presentation elements while remaining independent of rendering technologies.

They never contain canonical knowledge.

---

# 2. Scope

Regions define:

* logical presentation areas;
* visual organization;
* content grouping;
* layout partitioning;
* reading zones;
* region metadata.

Canonical content remains exclusively represented by the UDM.

---

# 3. Design Goals

Regions shall:

* preserve presentation intent;
* support adaptive rendering;
* remain deterministic;
* remain renderer-independent;
* support complex layouts;
* support faithful reconstruction.

---

# 4. Design Philosophy

A Region defines a logical presentation area.

It is not a screen coordinate.

It is not a pixel rectangle.

Its purpose is to organize presentation.

---

# 5. Conceptual Model

```text
Page
    │
    ▼
Region
    │
    ▼
Presentation Elements
```

Regions group presentation elements into coherent visual areas.

---

# 6. Region Identity

Every Region owns:

* PresentationNodeID;
* RegionType;
* VersionID.

Identity remains immutable.

---

# 7. Region Categories

Typical Region Types include:

* Body Region;
* Header Region;
* Footer Region;
* Sidebar Region;
* Margin Region;
* Figure Region;
* Table Region;
* Caption Region;
* Navigation Region;
* Floating Region.

Extensions may define additional Region Types.

---

# 8. Region Composition

Regions may contain:

* Presentation Elements;
* nested Regions;
* Columns;
* Layout Containers.

Regions never contain canonical UDM Nodes directly.

---

# 9. Nested Regions

Regions may be nested.

Example:

```text
Body Region
    │
    ├── Main Column
    ├── Sidebar
    └── Figure Region
```

Nested Regions remain deterministic.

---

# 10. Region Constraints

A Region may declare presentation constraints.

Examples include:

* preferred width;
* preferred height;
* minimum size;
* maximum size;
* flexible expansion;
* alignment policy.

Constraints express presentation intent.

They are not rendering instructions.

---

# 11. Region Ordering

Regions declare a deterministic ordering.

Ordering supports:

* reconstruction;
* navigation;
* reading flow generation.

Ordering is independent of physical position.

---

# 12. Relationship to Pages

Every Region belongs to exactly one Page.

A Page owns one or more Regions.

Regions define the internal organization of a Page.

---

# 13. Relationship to Columns

Regions may contain one or more Columns.

Column definitions belong to the Column model.

Regions remain independent of column implementation.

---

# 14. Relationship to Reading Flow

Reading Flow traverses Regions.

Spatial order and reading order are independent concepts.

Reading order is defined explicitly.

---

# 15. Relationship to Layout Graph

Regions participate in the Layout Graph.

Spatial relationships include:

* LEFT_OF;
* RIGHT_OF;
* ABOVE;
* BELOW;
* INSIDE;
* OVERLAPS;
* ADJACENT_TO.

The Layout Graph remains authoritative.

---

# 16. Relationship to the UDM

Regions reference canonical UDM elements through Presentation Nodes.

Regions never redefine:

* document meaning;
* semantic relationships;
* canonical structure.

---

# 17. Validation

A valid Region shall satisfy:

* valid parent Page;
* unique identity;
* deterministic ordering;
* valid containment;
* valid Layout Graph participation.

---

# 18. Invariants

The following invariants apply:

* every Region belongs to one Page;
* every Region owns presentation elements only;
* Regions never contain canonical knowledge;
* identity is immutable;
* containment is deterministic;
* Regions remain renderer-independent.

---

# 19. Related Documents

* Pages.md
* Columns.md
* ReadingFlow.md
* SpatialRelationships.md
* LayoutGraph.md
* ../Core/PresentationNodeModel.md

---

# 20. Status

**Approved**

This document defines the Region model of the Document Presentation Model.

Regions partition Pages into logical presentation areas while preserving presentation intent independently of rendering technologies.
