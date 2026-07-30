# UDM Mapping

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** UDM Mapping

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the canonical mapping model between the Universal Document Model (UDM) and the Document Presentation Model (DPM).

The mapping establishes how canonical knowledge is projected into presentation without introducing dependencies between the two models.

The mapping is deterministic, versionable and reversible.

---

# 2. Scope

The UDM Mapping governs:

* projection of canonical knowledge into presentation;
* references between UDM and DPM;
* synchronization of both models;
* version compatibility;
* mapping integrity.

The mapping never duplicates canonical knowledge.

---

# 3. Design Goals

The UDM Mapping shall:

* preserve complete separation between UDM and DPM;
* remain deterministic;
* support multiple presentation projections;
* support version evolution;
* remain renderer-independent;
* remain extensible.

---

# 4. Design Philosophy

The UDM owns knowledge.

The DPM owns presentation.

The Mapping connects both models.

Neither model depends directly on the other.

---

# 5. Conceptual Architecture

```text
Knowledge Object
        │
        ├──────────────┐
        │              │
        ▼              ▼
      UDM            DPM
        ▲              ▲
        └── UDM Mapping ┘
```

The Mapping acts as the canonical bridge between both models.

---

# 6. Mapping Units

A Mapping connects:

* one or more UDM Nodes;
* one or more Presentation Nodes.

Mappings express projection, not ownership.

---

# 7. Projection Model

Presentation is a projection of canonical knowledge.

Examples include:

* one UDM Node → one Presentation Node;
* one UDM Node → many Presentation Nodes;
* many UDM Nodes → one Presentation Node;
* filtered projections;
* summarized projections.

The UDM remains authoritative.

---

# 8. Mapping Identity

Every Mapping owns:

* MappingID;
* KnowledgeObjectID;
* UDMVersionID;
* DPMVersionID;
* MappingVersionID.

Identity is immutable.

---

# 9. Mapping Relationships

Mappings reference:

* UDM Node IDs;
* Presentation Node IDs;
* Anchor IDs (when applicable);
* Asset IDs (when applicable).

References are logical.

No ownership is transferred.

---

# 10. Synchronization

Mappings synchronize compatible versions of:

* the UDM;
* the DPM.

Synchronization never modifies either model.

It updates only the Mapping layer.

---

# 11. Multiple Projections

The same UDM Node may participate in multiple Presentation Nodes.

Examples include:

* table of contents;
* chapter summary;
* preview cards;
* search snippets;
* comparison views.

Each projection remains traceable to its canonical origin.

---

# 12. Partial Presentation

Not every UDM Node must appear in every DPM.

Presentation may intentionally omit elements for a given experience.

Canonical knowledge remains preserved in the UDM.

---

# 13. Bidirectional Resolution

The Mapping supports deterministic navigation:

* UDM → DPM;
* DPM → UDM.

Navigation never implies ownership.

It resolves references only.

---

# 14. Version Compatibility

Mappings are version-aware.

Every Mapping explicitly references:

* compatible UDM Version;
* compatible DPM Version.

Version mismatches invalidate the Mapping.

---

# 15. Provenance

Every Mapping records provenance including:

* creation process;
* synchronization history;
* mapping revisions;
* validation events.

Mapping provenance is independent of UDM and DPM provenance.

---

# 16. Relationship to Assets

Mappings may reference Asset Nodes.

Assets remain owned by the UDM.

Presentation determines their placement through the DPM.

---

# 17. Relationship to Anchors

Mappings may associate Presentation Nodes with UDM Anchors.

Anchor identity remains owned by the UDM.

The Mapping resolves correspondence without redefining anchors.

---

# 18. Validation

A valid Mapping shall satisfy:

* existing UDM references;
* existing DPM references;
* compatible versions;
* deterministic projections;
* complete referential integrity.

---

# 19. Invariants

The following invariants apply:

* the UDM remains the authoritative knowledge model;
* the DPM remains the authoritative presentation model;
* the Mapping owns no canonical knowledge;
* the Mapping owns no presentation elements;
* references are deterministic;
* navigation is reversible.

---

# 20. Related Documents

* ../../UDM/UDM.md
* ../DPM.md
* AssetMapping.md
* AnchorMapping.md
* ../../KnowledgeObject/KnowledgeObject.md

---

# 21. Status

**Approved**

This document defines the canonical mapping model between the Universal Document Model and the Document Presentation Model.

The UDM Mapping provides deterministic, version-aware and renderer-independent projections while preserving the complete architectural separation between knowledge and presentation.
