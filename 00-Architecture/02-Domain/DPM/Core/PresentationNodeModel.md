
# Presentation Node Model

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Presentation Node Model

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Presentation Node Model of the Document Presentation Model (DPM).

Presentation Nodes describe the visual organization of a Knowledge Object.

They represent presentation intent.

They never represent canonical knowledge.

---

# 2. Scope

Presentation Nodes define:

* visual elements;
* layout elements;
* reading structure;
* presentation hierarchy;
* spatial organization.

Canonical knowledge remains exclusively represented by the UDM.

---

# 3. Design Goals

Presentation Nodes shall:

* preserve visual intent;
* remain renderer-independent;
* remain deterministic;
* support reconstruction;
* support multiple rendering experiences;
* remain versionable.

---

# 4. Design Philosophy

A Presentation Node represents a visual element.

It never represents knowledge.

The UDM defines meaning.

The DPM defines presentation.

---

# 5. Conceptual Architecture

```text
Knowledge Object
        │
        ├── UDM
        │
        └── DPM
               │
               ▼
        Presentation Nodes
```

Presentation Nodes compose the visual model of the document.

---

# 6. Presentation Node Categories

Presentation Nodes belong to one primary category.

Examples include:

* Page
* Region
* Frame
* Column
* Figure Area
* Caption Area
* Sidebar
* Header
* Footer
* Floating Element
* Decoration

Additional categories may be introduced by extensions.

---

# 7. Identity

Every Presentation Node possesses:

* PresentationNodeID
* PresentationType
* VersionID

Identity is immutable.

---

# 8. Hierarchy

Presentation Nodes form a deterministic containment hierarchy.

Typical hierarchy:

```text
Document
    ↓
Page
    ↓
Region
    ↓
Presentation Element
```

Containment represents ownership only.

Spatial relationships are modeled separately.

---

# 9. Layout Graph

Presentation Nodes participate in a Layout Graph.

The Layout Graph represents spatial relationships such as:

* LEFT_OF
* RIGHT_OF
* ABOVE
* BELOW
* INSIDE
* OVERLAPS
* NEXT_IN_FLOW

The Layout Graph complements the containment hierarchy.

---

# 10. Mapping to the UDM

Presentation Nodes reference canonical UDM elements.

Examples:

* Structural Nodes
* Content Nodes
* Asset Nodes
* Anchors

Presentation Nodes never own canonical content.

---

# 11. Renderer Independence

Presentation Nodes do not contain:

* HTML
* CSS
* PDF instructions
* UI widgets
* platform-specific rendering information

Rendering engines interpret Presentation Nodes according to rendering policies.

---

# 12. Versioning

Presentation Nodes evolve independently.

Changes to presentation create new presentation versions without modifying canonical knowledge.

---

# 13. Provenance

Presentation Nodes preserve:

* creation source;
* extraction process;
* reconstruction history;
* modification history.

Presentation provenance is independent from canonical provenance.

---

# 14. Relationship to Assets

Presentation Nodes may reference Asset Nodes.

Presentation determines placement.

Asset ownership remains in the UDM.

---

# 15. Relationship to Anchors

Presentation Nodes may resolve visual positions through Anchors.

Anchors remain defined by the UDM.

Presentation Nodes never redefine Anchors.

---

# 16. Invariants

The following invariants apply:

* Presentation Nodes never contain canonical knowledge.
* Presentation Nodes preserve presentation intent.
* Identity is immutable.
* Presentation is renderer-independent.
* Spatial relationships remain deterministic.
* Every Presentation Node belongs to exactly one DPM.

---

# 17. Related Documents

* DPM.md
* PresentationTypes.md
* PresentationAttributes.md
* PresentationIdentity.md
* ../Layout/LayoutGraph.md
* ../../UDM/UDM.md

---

# 18. Status

**Approved**

This document defines the Presentation Node Model of the Document Presentation Model.

Presentation Nodes describe the visual organization of a Knowledge Object while remaining independent of rendering technologies and preserving presentation intent.
