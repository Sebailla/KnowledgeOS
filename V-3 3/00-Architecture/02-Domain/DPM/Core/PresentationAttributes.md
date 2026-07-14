
# Presentation Attributes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Presentation Attributes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Presentation Attribute Model of the Document Presentation Model (DPM).

Presentation Attributes describe the visual characteristics of Presentation Nodes.

They never describe canonical knowledge.

---

# 2. Scope

Presentation Attributes define:

* layout characteristics;
* visual properties;
* presentation behavior;
* rendering hints;
* style metadata.

Canonical knowledge attributes remain exclusively defined by the UDM.

---

# 3. Design Goals

Presentation Attributes shall:

* remain renderer-independent;
* remain deterministic;
* support faithful reconstruction;
* support multiple rendering experiences;
* preserve presentation intent;
* remain extensible.

---

# 4. Design Philosophy

Presentation Attributes describe appearance.

They never describe meaning.

Meaning belongs to the UDM.

Presentation belongs to the DPM.

---

# 5. Attribute Model

Every Presentation Attribute consists of:

* AttributeID;
* AttributeName;
* AttributeType;
* AttributeValue;
* AttributeCategory;
* VersionID.

Attributes belong to exactly one Presentation Node.

---

# 6. Attribute Categories

Presentation Attributes are organized into categories.

```text
Presentation Attributes
│
├── Layout
├── Typography
├── Visual
├── Flow
├── Decoration
├── Interaction
└── Extension
```

Each category defines a distinct presentation concern.

---

# 7. Layout Attributes

Layout Attributes describe spatial organization.

Typical examples include:

* width;
* height;
* margins;
* padding;
* alignment;
* column span;
* row span;
* positioning constraints.

Layout Attributes remain independent of physical pixels.

---

# 8. Typography Attributes

Typography Attributes describe text presentation.

Examples include:

* typography role;
* font family intent;
* font weight;
* font style;
* font size;
* line height;
* paragraph spacing;
* indentation;
* text alignment.

Typography intent is preserved independently of rendering technology.

---

# 9. Visual Attributes

Visual Attributes describe appearance.

Examples include:

* foreground color;
* background color;
* border;
* opacity;
* shadow;
* transparency;
* corner radius.

These attributes express visual intent rather than implementation details.

---

# 10. Flow Attributes

Flow Attributes describe reading behavior.

Examples:

* reading priority;
* flow direction;
* continuation;
* wrapping behavior;
* overflow policy.

Flow Attributes participate in Reading Flow reconstruction.

---

# 11. Decoration Attributes

Decoration Attributes define non-semantic visual enhancements.

Examples include:

* ornamental borders;
* separators;
* decorative backgrounds;
* drop caps;
* page ornaments.

Decorations never modify canonical content.

---

# 12. Interaction Attributes

Interaction Attributes describe presentation behavior.

Examples include:

* collapsible region;
* expandable section;
* hover behavior;
* animation policy;
* transition policy.

Interaction remains presentation-specific.

---

# 13. Extension Attributes

Extensions may define additional Presentation Attributes.

Every extension attribute shall declare:

* namespace;
* identifier;
* data type;
* compatibility rules;
* version.

Extensions shall not redefine core attributes.

---

# 14. Attribute Types

Supported attribute value types include:

* Boolean;
* Integer;
* Decimal;
* String;
* Enumeration;
* Measurement;
* Color;
* Reference;
* Collection.

Additional types may be introduced through extensions.

---

# 15. Default Values

Presentation Types may define default attribute values.

Default values:

* simplify model creation;
* improve consistency;
* reduce serialization size.

Defaults never override explicitly assigned values.

---

# 16. Attribute Inheritance

Presentation Nodes may inherit attributes from ancestor nodes.

Inheritance rules are deterministic.

Locally defined values always override inherited values.

---

# 17. Renderer Independence

Presentation Attributes never contain:

* HTML properties;
* CSS declarations;
* UIKit properties;
* SwiftUI modifiers;
* Flutter widgets.

Platform-specific rendering decisions belong to Render Engines.

---

# 18. Validation

Every Presentation Attribute shall satisfy:

* valid data type;
* permitted value range;
* compatibility with Presentation Type;
* namespace validity;
* cardinality constraints.

Invalid attributes invalidate the owning Presentation Node.

---

# 19. Attribute Invariants

The following invariants apply:

* every Presentation Attribute belongs to one Presentation Node;
* Presentation Attributes describe presentation only;
* attribute identity is immutable;
* explicit values override inherited values;
* extension attributes shall not redefine core attributes.

---

# 20. Related Documents

* DPM.md
* PresentationNodeModel.md
* PresentationTypes.md
* PresentationIdentity.md
* ../Style/Typography.md
* ../Style/ColorModel.md
* ../Layout/LayoutGraph.md

---

# 21. Status

**Approved**

This document defines the Presentation Attribute Model of the Document Presentation Model.

Presentation Attributes describe visual characteristics while preserving renderer independence, presentation intent and deterministic reconstruction.
