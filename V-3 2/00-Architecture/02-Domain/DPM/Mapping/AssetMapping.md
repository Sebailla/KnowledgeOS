
# Asset Mapping

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Asset Mapping

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the canonical mapping model between Asset Nodes in the Universal Document Model (UDM) and their visual projections within the Document Presentation Model (DPM).

Asset Mapping preserves asset identity while allowing multiple presentation representations.

Assets remain canonical resources owned exclusively by the UDM.

---

# 2. Scope

Asset Mapping governs:

* asset projection;
* asset presentation;
* asset reuse;
* projection identity;
* synchronization;
* presentation consistency.

Asset Mapping never owns binary resources.

---

# 3. Design Goals

Asset Mapping shall:

* preserve asset identity;
* support multiple projections;
* remain deterministic;
* remain renderer-independent;
* preserve provenance;
* support version evolution.

---

# 4. Design Philosophy

Assets exist once.

Presentation may reference them many times.

Presentation never duplicates Assets.

Every visual representation is a projection.

---

# 5. Conceptual Architecture

```text
Knowledge Object
        │
        ├──────────────┐
        │              │
        ▼              ▼
     Asset Node     Presentation Node
        ▲              ▲
        └── Asset Mapping ──┘
```

Asset Mapping connects canonical resources with presentation projections.

---

# 6. Mapping Units

Every Asset Mapping connects:

* one Asset Node;
* one or more Presentation Nodes.

Mappings describe projection only.

Ownership remains in the UDM.

---

# 7. Projection Types

Typical projections include:

* Full-size presentation;
* Thumbnail;
* Cover image;
* Inline figure;
* Floating figure;
* Sidebar illustration;
* Search preview;
* Timeline preview;
* Gallery item.

Extensions may introduce additional projection types.

---

# 8. Asset Identity

Every Asset Mapping references:

* AssetID;
* PresentationNodeID;
* MappingID;
* MappingVersionID.

Asset identity is never modified.

---

# 9. Multiple Projections

A single Asset may participate in multiple Presentation Nodes.

Each projection may define:

* presentation role;
* scale policy;
* cropping policy;
* visibility policy;
* interaction policy.

These policies affect presentation only.

---

# 10. Projection Independence

Every projection is independent.

Changing one projection shall never modify:

* the Asset;
* other projections;
* canonical metadata.

---

# 11. Presentation Policies

Presentation policies may describe:

* preferred placement;
* preferred size class;
* visibility conditions;
* interaction capabilities;
* adaptive behavior.

Policies remain declarative.

---

# 12. Adaptive Rendering

Render Engines may adapt projections by:

* resizing;
* simplifying;
* replacing previews;
* changing visual density.

The referenced Asset remains unchanged.

---

# 13. Relationship to Themes

Themes influence how Assets are presented.

Examples include:

* borders;
* shadows;
* framing;
* captions;
* spacing.

Theme changes never modify Asset Mapping.

---

# 14. Relationship to the UDM

Assets remain canonical UDM entities.

Asset Mapping never modifies:

* binary content;
* metadata;
* provenance;
* ownership.

---

# 15. Relationship to the DPM

Presentation Nodes reference Assets through Asset Mapping.

Presentation Nodes never own binary resources.

---

# 16. Version Compatibility

Asset Mapping is version-aware.

Mappings reference:

* Asset Version;
* UDM Version;
* DPM Version.

Only compatible versions may be associated.

---

# 17. Provenance

Every Asset Mapping records:

* creation process;
* synchronization history;
* projection history;
* mapping revisions.

Mapping provenance is immutable.

---

# 18. Validation

A valid Asset Mapping shall satisfy:

* existing Asset reference;
* existing Presentation Node reference;
* compatible versions;
* deterministic projection;
* complete referential integrity.

---

# 19. Invariants

The following invariants apply:

* every Asset belongs to the UDM;
* every projection references an existing Asset;
* Asset Mapping owns no binary resources;
* projections are deterministic;
* multiple projections never duplicate Assets.

---

# 20. Related Documents

* UDMMapping.md
* AnchorMapping.md
* ../../UDM/Nodes/AssetNodes.md
* ../../KnowledgeObject/Assets.md
* ../Layout/LayoutGraph.md

---

# 21. Status

**Approved**

This document defines the canonical mapping model between Asset Nodes and Presentation Nodes.

Asset Mapping preserves asset identity while enabling multiple deterministic visual projections across renderers, themes and presentation experiences.
