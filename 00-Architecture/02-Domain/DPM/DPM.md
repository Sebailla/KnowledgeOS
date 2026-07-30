# Document Presentation Model (DPM)

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** DPM

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

The Document Presentation Model (DPM) defines the canonical visual representation of a Knowledge Object.

While the Universal Document Model (UDM) represents the logical structure and meaning of knowledge, the DPM represents how that knowledge is visually organized and presented.

The DPM preserves presentation intent independently of rendering technologies.

---

# 2. Scope

The DPM models:

* page organization;
* layout structure;
* reading flow;
* typography;
* visual hierarchy;
* decorations;
* spatial relationships;
* presentation metadata.

It does not contain canonical knowledge.

Canonical knowledge belongs exclusively to the UDM.

---

# 3. Design Goals

The DPM shall:

* preserve presentation intent;
* remain renderer-independent;
* remain device-independent;
* support faithful reconstruction;
* support multiple rendering experiences;
* preserve layout semantics;
* support long-term evolution.

---

# 4. Design Philosophy

The UDM describes what the document means.

The DPM describes how the document is visually organized.

Both models describe the same Knowledge Object.

Neither replaces the other.

---

# 5. Conceptual Architecture

```text
Knowledge Object
        │
        ├── Universal Document Model
        │        │
        │        └── Canonical Knowledge
        │
        └── Document Presentation Model
                 │
                 └── Presentation Intent
```

The UDM and DPM are complementary canonical models.

---

# 6. Presentation Intent

Presentation intent represents the author's visual organization of information.

Examples include:

* page composition;
* column arrangement;
* figure placement;
* typography hierarchy;
* captions;
* side notes;
* decorative elements;
* reading sequence.

Presentation intent is preserved independently of rendering technology.

---

# 7. Canonical Independence

The DPM shall never redefine:

* document meaning;
* semantic relationships;
* canonical structure;
* annotations;
* version history.

These responsibilities belong to the UDM.

---

# 8. Renderer Independence

The DPM shall not depend on:

* HTML;
* CSS;
* PDF;
* EPUB;
* SwiftUI;
* UIKit;
* Flutter;
* WebView.

Renderers interpret the DPM.

The DPM never references renderer-specific constructs.

---

# 9. Relationship to the UDM

Each DPM references exactly one authoritative UDM.

The relationship is one-to-one.

Both models share:

* KnowledgeObjectID;
* VersionID;
* Provenance.

Each evolves independently while remaining synchronized.

---

# 10. Relationship to Assets

The DPM references Asset Nodes defined in the UDM.

It never owns binary resources.

Presentation determines where Assets appear.

Ownership remains within the UDM.

---

# 11. Relationship to Anchors

The DPM may resolve visual positions using Anchors.

Anchors remain defined exclusively by the UDM.

The DPM never creates canonical Anchors.

---

# 12. Relationship to Rendering

Render Engines consume:

* UDM;
* DPM;
* Rendering Policies.

The DPM does not render itself.

It defines presentation semantics.

---

# 13. Relationship to Import

During document acquisition:

* the UDM is constructed from logical content;
* the DPM is constructed from presentation analysis.

Both models are produced during the same import process.

---

# 14. Relationship to Export

Export processes may reconstruct:

* original layout;
* adapted layouts;
* alternative reading experiences.

The DPM provides the information required for presentation reconstruction.

---

# 15. Core Components

The DPM is composed of:

* Presentation Nodes;
* Layout Graph;
* Reading Flow;
* Typography;
* Visual Hierarchy;
* Decorations;
* Themes;
* Spatial Relationships.

Each component is documented independently.

---

# 16. Invariants

The following invariants apply:

* the DPM never changes canonical knowledge;
* presentation intent remains independent from rendering;
* the DPM references but never owns Assets;
* the DPM references but never owns Anchors;
* the DPM remains deterministic;
* the DPM remains serializable;
* the DPM remains versionable.

---

# 17. Related Documents

* ../UDM/UDM.md
* Core/PresentationNodeModel.md
* Layout/LayoutGraph.md
* Style/Typography.md
* Mapping/UDMMapping.md

---

# 18. Status

**Approved**

This document defines the Document Presentation Model (DPM), the canonical representation of presentation intent within KnowledgeOS.

The DPM complements the Universal Document Model by preserving the visual organization of knowledge while remaining independent of rendering technologies and user interfaces.
