
# Anchor Mapping

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Anchor Mapping

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the canonical mapping model between Anchors in the Universal Document Model (UDM) and their visual representations within the Document Presentation Model (DPM).

Anchor Mapping enables deterministic navigation between canonical knowledge and presentation while preserving stable logical references.

---

# 2. Scope

Anchor Mapping governs:

* anchor projection;
* presentation localization;
* navigation;
* annotation positioning;
* synchronization;
* version compatibility.

Anchor Mapping never defines physical coordinates.

---

# 3. Design Goals

Anchor Mapping shall:

* preserve logical identity;
* support deterministic navigation;
* remain renderer-independent;
* support adaptive layouts;
* preserve annotation stability;
* remain version-aware.

---

# 4. Design Philosophy

Anchors identify logical locations.

Presentation determines visual locations.

Anchor Mapping connects both domains without coupling them.

---

# 5. Conceptual Architecture

```text
Knowledge Object
        │
        ├──────────────┐
        │              │
        ▼              ▼
      Anchor      Presentation Node
        ▲              ▲
        └─ Anchor Mapping ─┘
```

The Mapping resolves logical positions into presentation positions.

---

# 6. Mapping Units

Every Anchor Mapping connects:

* one Anchor;
* one or more Presentation Nodes.

Mappings express correspondence.

Ownership remains with the UDM.

---

# 7. Logical Position

Anchors identify logical locations such as:

* paragraph boundaries;
* sentence boundaries;
* figure references;
* table entries;
* equations;
* semantic regions;
* document structure.

Logical position is immutable within a given UDM version.

---

# 8. Presentation Resolution

Presentation Nodes determine how an Anchor is visualized.

Resolution may differ across:

* page layouts;
* themes;
* renderers;
* screen sizes;
* accessibility modes.

Logical identity remains unchanged.

---

# 9. Multiple Presentations

A single Anchor may resolve to multiple Presentation Nodes.

Examples include:

* document body;
* table of contents;
* search result preview;
* split-screen comparison;
* outline view.

Each presentation remains traceable to the same Anchor.

---

# 10. Navigation

Anchor Mapping supports deterministic navigation:

* Anchor → Presentation;
* Presentation → Anchor.

Navigation remains stable across layout changes.

---

# 11. Annotation Support

Annotations attach to Anchors rather than physical positions.

Presentation determines where annotations are displayed.

This guarantees annotation persistence across rendering environments.

---

# 12. Adaptive Rendering

Render Engines may reposition visual elements.

Anchor Mapping shall continue resolving the same logical Anchor regardless of presentation changes.

---

# 13. Relationship to the UDM

Anchors remain canonical entities owned by the UDM.

Anchor Mapping never modifies:

* Anchor identity;
* canonical structure;
* provenance;
* semantic relationships.

---

# 14. Relationship to the DPM

Presentation Nodes reference Anchors through Anchor Mapping.

The DPM never owns or redefines Anchors.

---

# 15. Relationship to Reading Flow

Reading Flow determines traversal.

Anchor Mapping determines correspondence.

Both models complement each other.

---

# 16. Version Compatibility

Anchor Mapping explicitly references:

* Anchor Version;
* UDM Version;
* DPM Version.

Mappings are valid only for compatible versions.

---

# 17. Provenance

Every Anchor Mapping records:

* creation process;
* synchronization history;
* mapping revisions;
* validation events.

Mapping provenance is immutable.

---

# 18. Validation

A valid Anchor Mapping shall satisfy:

* existing Anchor reference;
* existing Presentation Node reference;
* compatible versions;
* deterministic resolution;
* referential integrity.

---

# 19. Invariants

The following invariants apply:

* Anchors belong exclusively to the UDM;
* Anchor Mapping owns no presentation elements;
* Anchor Mapping owns no canonical knowledge;
* logical identity is preserved;
* navigation is deterministic;
* annotations remain stable across presentation changes.

---

# 20. Related Documents

* UDMMapping.md
* AssetMapping.md
* ../../UDM/Nodes/Anchors.md
* ../../KnowledgeObject/Relationships.md
* ../Layout/ReadingFlow.md

---

# 21. Status

**Approved**

This document defines the canonical mapping model between UDM Anchors and DPM Presentation Nodes.

Anchor Mapping preserves stable logical references while enabling deterministic navigation, resilient annotations and renderer-independent presentation across all supported experiences.
