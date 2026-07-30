
# Presentation Types

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Presentation Types

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Presentation Type System of the Document Presentation Model (DPM).

Presentation Types classify visual elements according to their presentation role.

They define how visual elements participate in layout, reading flow and visual hierarchy.

They never define canonical knowledge.

---

# 2. Scope

Presentation Types classify:

* pages;
* layout containers;
* reading regions;
* visual elements;
* decorative elements;
* navigation elements;
* floating elements.

Meaning remains defined exclusively by the UDM.

---

# 3. Design Goals

The Presentation Type System shall:

* classify presentation elements;
* remain renderer-independent;
* support layout reconstruction;
* support multiple rendering experiences;
* remain extensible;
* preserve presentation intent.

---

# 4. Design Philosophy

Presentation Types describe visual function.

They never describe semantic meaning.

The same canonical content may appear through different Presentation Types.

---

# 5. Type Hierarchy

Every Presentation Node declares one primary Presentation Type.

```text
Presentation Node
        │
        ▼
Presentation Type
        │
        ▼
Rendering Policy
```

Rendering policies interpret Presentation Types.

---

# 6. Root Types

The DPM defines the following root categories.

```text
Presentation Type
│
├── Document
├── Page
├── Container
├── Flow
├── Content Area
├── Navigation
├── Decoration
└── Overlay
```

Extensions may introduce additional types.

---

# 7. Document Types

Document-level presentation includes:

* Book
* Magazine
* Scientific Paper
* Article
* Manual
* Notebook
* Presentation
* Report
* Poster

Document Types describe the global presentation style.

---

# 8. Page Types

Examples include:

* Cover
* Title Page
* Content Page
* Chapter Opening
* Appendix
* Index
* References
* Blank Page

Pages describe presentation organization only.

---

# 9. Container Types

Container Types organize visual space.

Examples:

* Region
* Frame
* Column
* Grid
* Sidebar
* Floating Area
* Margin Area

Containers define placement, not content.

---

# 10. Flow Types

Flow Types define reading progression.

Examples:

* Main Flow
* Secondary Flow
* Parallel Flow
* Sidebar Flow
* Footnote Flow
* Caption Flow

Flows organize visual reading order.

---

# 11. Content Area Types

Content Areas present canonical knowledge.

Examples include:

* Title Area
* Paragraph Area
* Figure Area
* Table Area
* Equation Area
* List Area
* Quote Area
* Code Area
* Caption Area

Content Areas reference UDM elements.

---

# 12. Navigation Types

Navigation elements include:

* Header
* Footer
* Running Header
* Running Footer
* Page Number
* Table of Contents Entry
* Navigation Marker

Navigation supports orientation without modifying canonical knowledge.

---

# 13. Decoration Types

Decorations provide visual enhancement.

Examples:

* Drop Cap
* Background
* Border
* Separator
* Ornament
* Watermark
* Highlight Band

Decorations never contain canonical content.

---

# 14. Overlay Types

Overlay elements appear above the presentation layer.

Examples:

* Selection
* Cursor
* Search Result
* Annotation Preview
* Collaboration Indicator

Overlays are transient presentation elements.

They are not part of canonical knowledge.

---

# 15. Type Inheritance

Presentation Types may specialize existing types.

Example:

```text
Figure Area
        │
        ├── Floating Figure
        ├── Full Width Figure
        ├── Inline Figure
        └── Thumbnail
```

Specialization preserves the semantics of the parent type.

---

# 16. Type Compatibility

Each Presentation Type defines:

* permitted parent types;
* permitted child types;
* supported layout behaviors;
* supported reading flows;
* applicable rendering policies.

Compatibility rules are deterministic.

---

# 17. Extension Types

Extensions may introduce Presentation Types.

Every extension type shall declare:

* namespace;
* identifier;
* version;
* parent type;
* compatibility rules.

Extensions shall not redefine core Presentation Types.

---

# 18. Relationship to the UDM

Presentation Types never replace UDM Types.

A Presentation Type references one or more canonical UDM elements through Mapping.

The UDM remains the source of truth.

---

# 19. Invariants

The following invariants apply:

* every Presentation Node declares one primary Presentation Type;
* Presentation Types classify presentation only;
* Presentation Types never modify canonical knowledge;
* type compatibility is deterministic;
* core types remain immutable.

---

# 20. Related Documents

* DPM.md
* PresentationNodeModel.md
* PresentationAttributes.md
* PresentationIdentity.md
* ../Layout/LayoutGraph.md
* ../Mapping/UDMMapping.md

---

# 21. Status

**Approved**

This document defines the Presentation Type System of the Document Presentation Model.

Presentation Types classify visual elements according to their presentation function while remaining independent of rendering technologies and preserving the canonical separation between presentation and knowledge.
