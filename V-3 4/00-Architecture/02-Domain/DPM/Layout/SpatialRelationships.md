
# Spatial Relationships

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Spatial Relationships

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Spatial Relationship Model of the Document Presentation Model (DPM).

Spatial Relationships describe how Presentation Nodes are positioned relative to one another.

They represent presentation intent without depending on absolute coordinates or rendering technologies.

---

# 2. Scope

Spatial Relationships define:

* relative positioning;
* containment;
* alignment;
* adjacency;
* overlap;
* layout continuity.

They do not define rendering coordinates.

---

# 3. Design Goals

Spatial Relationships shall:

* preserve presentation intent;
* remain renderer-independent;
* remain deterministic;
* support adaptive layouts;
* support faithful reconstruction;
* remain compatible with multiple rendering strategies.

---

# 4. Design Philosophy

Presentation is expressed through relationships.

It is not expressed through pixels.

The DPM describes how elements relate spatially.

Render Engines decide how those relationships are materialized.

---

# 5. Conceptual Model

```text
Presentation Node
        │
        ▼
Spatial Relationship
        │
        ▼
Presentation Node
```

Every relationship connects two or more Presentation Nodes.

---

# 6. Relationship Categories

Spatial Relationships are organized into the following categories:

* Position;
* Containment;
* Alignment;
* Adjacency;
* Overlap;
* Distribution;
* Continuation.

Each category defines a different aspect of presentation.

---

# 7. Position Relationships

Position Relationships describe relative location.

Examples include:

* LEFT_OF;
* RIGHT_OF;
* ABOVE;
* BELOW;
* BEFORE;
* AFTER.

These relationships never imply reading order.

---

# 8. Containment Relationships

Containment Relationships define ownership within presentation.

Examples include:

* INSIDE;
* CONTAINS;
* PART_OF.

Containment complements the hierarchical structure of the DPM.

---

# 9. Alignment Relationships

Alignment Relationships define visual alignment.

Examples include:

* ALIGNS_LEFT;
* ALIGNS_RIGHT;
* ALIGNS_TOP;
* ALIGNS_BOTTOM;
* CENTERED_WITHIN;
* BASELINE_ALIGNED.

Alignment expresses presentation intent only.

---

# 10. Adjacency Relationships

Adjacency Relationships define neighborhood without overlap.

Examples include:

* ADJACENT_TO;
* TOUCHES;
* IMMEDIATELY_AFTER.

Adjacency does not imply dependency.

---

# 11. Overlap Relationships

Overlap Relationships describe shared visual space.

Examples include:

* OVERLAPS;
* UNDERLAYS;
* OVERLAYS.

Overlap never modifies canonical content.

---

# 12. Distribution Relationships

Distribution Relationships describe repeated visual organization.

Examples include:

* EVENLY_DISTRIBUTED;
* JUSTIFIED_WITH;
* EQUALLY_SPACED.

These relationships support reconstruction of complex layouts.

---

# 13. Continuation Relationships

Continuation Relationships describe visual continuity.

Examples include:

* CONTINUES_IN;
* SPLITS_INTO;
* MERGES_FROM;
* RESUMES_AFTER.

Continuation is independent from Reading Flow.

---

# 14. Relationship Properties

Every Spatial Relationship may define:

* RelationshipID;
* RelationshipType;
* SourceNode;
* TargetNode;
* Direction;
* Priority;
* Confidence;
* Provenance.

These properties remain immutable once published.

---

# 15. Relationship Direction

Relationships may be:

* directed;
* bidirectional;
* symmetric.

Direction is defined by the relationship type.

---

# 16. Relationship Constraints

Every Spatial Relationship shall satisfy:

* valid Presentation Node references;
* compatible relationship type;
* deterministic interpretation;
* absence of contradictory definitions.

---

# 17. Relationship Evolution

Spatial Relationships evolve through versioning.

New presentation versions may:

* add relationships;
* remove relationships;
* replace relationships.

Historical relationships remain preserved.

---

# 18. Relationship to Reading Flow

Spatial Relationships describe position.

Reading Flow describes traversal.

Neither model replaces the other.

---

# 19. Relationship to Layout Graph

Spatial Relationships constitute the edges of the Layout Graph.

The Layout Graph is the network formed by Presentation Nodes and their Spatial Relationships.

---

# 20. Relationship to the UDM

Spatial Relationships never:

* define meaning;
* modify semantics;
* alter canonical structure;
* replace UDM relationships.

They exist exclusively within the DPM.

---

# 21. Validation

A valid Spatial Relationship shall satisfy:

* valid source node;
* valid target node;
* compatible relationship type;
* deterministic direction;
* no contradictory constraints.

---

# 22. Invariants

The following invariants apply:

* Spatial Relationships describe presentation only;
* no absolute coordinates are required;
* relationships are deterministic;
* every relationship connects valid Presentation Nodes;
* canonical knowledge remains unchanged.

---

# 23. Related Documents

* LayoutGraph.md
* ReadingFlow.md
* Pages.md
* Regions.md
* Columns.md
* ../Core/PresentationNodeModel.md

---

# 24. Status

**Approved**

This document defines the Spatial Relationship Model of the Document Presentation Model.

Spatial Relationships provide a renderer-independent representation of visual positioning by expressing presentation intent through declarative relationships rather than absolute coordinates.
