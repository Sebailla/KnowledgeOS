# Inline Nodes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Inline Nodes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines Inline Nodes in the Universal Document Model (UDM).

Inline Nodes represent content and semantics that participate within the flow of a containing block-level structure, normally a Paragraph or another inline-capable container.

Inline Nodes preserve canonical meaning independently from typography, layout and renderer behavior.

---

# 2. Scope

This document governs:

* inline containment;
* inline ordering;
* inline text;
* Hyperlinks;
* Citations;
* References;
* Inline Code;
* Inline Formulae;
* Symbols;
* semantic inline spans;
* inline validation;
* inline serialization.

It does not define:

* block-level layout;
* typography;
* visual decorations;
* page coordinates;
* renderer-specific spans;
* CSS or platform text attributes.

---

# 3. Core Principle

The fundamental principle is:

> Inline Nodes represent canonical content or semantics within structural flow; they do not represent visual styling instructions.

---

# 4. Architectural Position

```text
Structural Node
      │
      ▼
Inline-Capable Container
      │
      ├── Text
      ├── Hyperlink
      ├── Citation
      ├── InlineCode
      ├── InlineFormula
      ├── Symbol
      └── SemanticInline
```

Inline Nodes belong to the UDM.

Their visual representation belongs to the DPM and Render architecture.

---

# 5. Inline Node Definition

An Inline Node is a UDM Node that participates in the ordered content flow of an inline-capable parent.

Inline Nodes may represent:

* primary text;
* embedded semantic content;
* references;
* compact expressions;
* language-level symbols;
* source-preserved inline constructs.

---

# 6. Inline Containment

Inline Nodes shall be contained only by Node types that explicitly allow inline children.

Typical inline-capable parents include:

* Paragraph;
* Heading content container;
* List-item text container;
* table-cell content container;
* caption content container;
* annotation body.

The exact allowed parent set is governed by `../Core/NodeTypes.md` and Validation rules.

---

# 7. Inline Ordering

Inline children form an explicit ordered sequence.

The order is canonical and shall be preserved through:

* serialization;
* deserialization;
* Versioning;
* transformation;
* rendering;
* Export.

Incidental storage order shall not replace the declared sequence contract.

---

# 8. Text Node

Text represents canonical written content.

Text Nodes may preserve:

* text value;
* language;
* writing direction;
* whitespace semantics where significant;
* source provenance.

Text Nodes shall not contain renderer-specific typography.

---

# 9. Hyperlink Node

A Hyperlink represents an intentional navigable reference associated with inline content.

A Hyperlink may contain:

* target reference;
* label content;
* title or description;
* relationship semantics;
* provenance.

The target may be:

* internal;
* external;
* resolved;
* unresolved.

Hyperlink visual appearance belongs to presentation and rendering.

---

# 10. Citation Node

A Citation represents an inline citation to a Source, Knowledge Object or bibliographic reference.

Citation semantics shall preserve:

* cited target;
* citation role;
* locator where applicable;
* source text where required;
* provenance.

A Citation is not merely styled text.

---

# 11. Reference Node

A Reference represents an inline reference to an identifiable Domain entity.

References may target:

* Knowledge Objects;
* UDM Nodes;
* Anchors;
* Assets;
* external identifiers.

Reference resolution and display remain separate concerns.

---

# 12. Inline Code Node

Inline Code represents code or machine-oriented text embedded in prose.

Properties may include:

* language hint;
* source role;
* literal-value semantics.

Inline Code shall preserve content exactly where the source contract requires it.

---

# 13. Inline Formula Node

Inline Formula represents mathematical or symbolic notation within content flow.

The canonical formula representation shall remain independent from a specific renderer.

Possible source forms may be preserved through Provenance or source metadata without becoming renderer-specific UDM structure.

---

# 14. Symbol Node

A Symbol represents a meaningful non-word symbol where a dedicated Node provides stronger semantics than plain Text.

Examples may include:

* mathematical symbols;
* logical operators;
* scientific notation;
* domain-specific glyphs.

Ordinary punctuation does not require a separate Symbol Node unless semantic processing benefits from it.

---

# 15. Semantic Inline Node

A Semantic Inline Node represents an inline semantic span such as:

* person mention;
* place mention;
* concept mention;
* defined term;
* date expression;
* measurement;
* domain entity.

Semantic Inline Nodes shall preserve:

* covered content;
* semantic type;
* target identity where resolved;
* provenance;
* confidence when derived.

---

# 16. Inline Annotation Relationship

Annotations may target Inline Nodes or Anchor ranges associated with inline content.

Annotation targeting shall not require mutation of the inline content merely to attach an Annotation.

---

# 17. Text Segmentation

Text may be segmented into multiple Inline Nodes when required for:

* semantic spans;
* references;
* language changes;
* provenance boundaries;
* source-preserving transformation.

Segmentation shall not change the reconstructed canonical text sequence.

---

# 18. Whitespace

Whitespace semantics shall be explicit where they affect canonical content.

Normalization may occur only according to the governing Import, UDM and serialization rules.

Renderer convenience shall not silently remove meaningful whitespace.

---

# 19. Inline Styles

Visual styles such as:

* bold;
* italic;
* underline;
* font family;
* color;
* letter spacing;

belong to DPM presentation semantics unless the style carries explicit canonical meaning represented through a semantic Node or attribute.

---

# 20. Semantic Emphasis

When emphasis has semantic meaning, the UDM may represent that meaning explicitly.

The UDM shall not assume that every visual bold or italic span is semantically meaningful.

Import processing shall distinguish:

* source presentation;
* inferred semantics;
* canonical semantic structure.

---

# 21. Inline Node Identity

Persistent Inline Nodes shall follow UDM identity rules defined in `../Core/Identity.md`.

Identity shall support:

* Anchors;
* annotations;
* Version comparison;
* transformation traceability.

Trivial segmentation created only for one Render pass shall not create unnecessary persistent identity.

---

# 22. Inline Node Attributes

Inline Nodes may use attributes defined by `../Core/NodeAttributes.md`.

Attributes shall remain:

* typed;
* validated;
* namespace-safe;
* independent from arbitrary renderer state.

---

# 23. Serialization

Inline serialization shall preserve:

* Node type;
* identity where required;
* ordered position;
* content;
* target references;
* semantic attributes;
* provenance where required.

Serialization shall be deterministic where the UDM contract requires deterministic output.

---

# 24. Validation

Validation shall verify:

* valid parent type;
* valid inline child type;
* declared sequence order;
* valid references;
* valid target identity;
* valid text encoding;
* no prohibited structural children;
* compatible semantic attributes.

---

# 25. Transformation

Inline transformations shall preserve canonical meaning.

Transformations may:

* merge adjacent compatible Text Nodes;
* split Text Nodes at semantic boundaries;
* resolve References;
* normalize source-specific constructs.

Transformations shall preserve:

* text sequence;
* reference targets;
* provenance requirements;
* Anchor compatibility where required.

---

# 26. Rendering

Renderers interpret Inline Nodes into platform-specific text and visual output.

A renderer may apply:

* typography;
* line breaking;
* highlighting;
* interaction affordances;
* accessibility representation.

Renderer output shall not mutate canonical Inline Nodes merely because layout changes.

---

# 27. Export

Exporters shall map Inline Nodes to target-format constructs while preserving semantic content as completely as the target format permits.

Lossy mappings shall be explicit where fidelity matters.

---

# 28. Failure Semantics

Invalid inline structures may produce:

* validation failure;
* Import warning;
* preserved unknown extension Node;
* controlled degradation.

Invalid inline content shall not be silently discarded when preservation is possible.

---

# 29. Testing Requirements

Inline Nodes shall be tested for:

* sequence preservation;
* Unicode content;
* multilingual content;
* bidirectional text;
* whitespace preservation;
* Hyperlink resolution;
* Citation round trip;
* semantic-span segmentation;
* Annotation targeting;
* deterministic serialization;
* renderer independence.

---

# 30. Inline Node Invariants

The following invariants apply.

* Inline Nodes belong to canonical UDM content flow.
* Inline order is explicit and preserved.
* Inline Nodes do not own block-level structural children unless explicitly defined by a specialized contract.
* Visual typography is not canonical inline content.
* Hyperlink, Citation and Reference semantics remain explicit.
* DPM styling does not redefine Inline Node meaning.
* Text segmentation does not change reconstructed canonical text.
* Persistent Inline Node identity follows UDM identity rules.
* Renderer-specific spans do not become UDM types automatically.
* Invalid inline content is not discarded silently when preservation is possible.

---

# 31. Prohibited Behaviors

KnowledgeOS shall never:

* encode CSS, SwiftUI or renderer-specific styling directly as canonical Inline Node types;
* infer canonical identity from text position alone;
* reorder Inline Nodes for storage convenience;
* treat every bold or italic source span as confirmed semantic meaning;
* discard unresolved Citations or References silently;
* let Render line breaks mutate canonical text;
* create block structure inside an Inline Node without an explicit Node contract;
* collapse meaningful whitespace silently;
* use temporary Render segmentation as permanent canonical structure unnecessarily.

---

# 32. Related Documents

## UDM Core

* `../Core/Identity.md`
* `../Core/NodeAttributes.md`
* `../Core/NodeModel.md`
* `../Core/NodeTypes.md`
* `../Core/TypeSystem.md`

## UDM Nodes

* `ContentNodes.md`
* `StructuralNodes.md`
* `SemanticNodes.md`
* `Anchors.md`
* `AnnotationNodes.md`

## UDM Serialization and Validation

* `../Serialization/Serialization.md`
* `../Validation/ConsistencyRules.md`
* `../Validation/ValidationRules.md`

## DPM and Platform

* `../../DPM/README.md`
* `../../../04-Platform/Render/README.md`
* `../../../04-Platform/Import/README.md`
* `../../../04-Platform/Export/README.md`

---

# 33. Status

**Approved**

This document defines Inline Nodes in the Universal Document Model.

Inline Nodes preserve ordered canonical content and semantic references within structural flow while remaining independent from typography, layout and renderer-specific spans.

Text, Hyperlinks, Citations, References, Inline Code, Inline Formulae, Symbols and semantic inline spans remain typed, validated, serializable and traceable.

KnowledgeOS therefore preserves inline meaning across Import, Versioning, Annotation, Rendering and Export without allowing presentation technology to redefine canonical content.
