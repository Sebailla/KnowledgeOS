# Content Nodes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Content Nodes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Content Nodes of the Universal Document Model (UDM).

Content Nodes represent the knowledge itself.

Unlike Structural Nodes, which organize information, Content Nodes contain the information being represented.

---

# 2. Design Goals

Content Nodes shall:

* represent canonical knowledge;
* remain independent of rendering;
* support semantic enrichment;
* preserve author intent;
* support deterministic serialization.

---

# 3. Design Philosophy

Structural Nodes organize knowledge.

Content Nodes express knowledge.

The two concepts are intentionally independent.

---

# 4. Content Categories

Content Nodes are divided into two groups.

```text
Content Node
│
├── Inline Content
└── Block Content
```

The distinction depends on structural behavior rather than visual appearance.

---

# 5. Inline Content

Inline Content exists within another structural container.

Typical parent:

* Paragraph

Examples include:

* Text
* InlineCode
* Hyperlink
* Citation
* Reference
* Symbol
* Emoji
* InlineFormula

Inline Content cannot own structural children.

---

# 6. Block Content

Block Content represents autonomous content.

Examples include:

* CodeBlock
* EquationBlock
* Diagram
* EmbeddedDocument
* Example
* Algorithm
* Timeline
* DecisionTable

Block Content behaves as an independent structural unit.

---

# 7. Text

Text represents canonical written language.

Text nodes preserve:

* original wording;
* whitespace significance when applicable;
* language information;
* writing direction.

Text nodes never contain formatting semantics.

---

# 8. Code

Code represents executable or descriptive source code.

Properties may include:

* language;
* filename;
* execution role;
* line numbering.

Rendering remains renderer-specific.

---

# 9. Formula

Formula represents mathematical notation.

It may appear:

* inline;
* block.

Both variants represent the same semantic concept.

Only structural behavior differs.

---

# 10. Citation

Citation references another identifiable source.

Citations preserve:

* reference target;
* citation role;
* optional locator.

Formatting is renderer-specific.

---

# 11. Hyperlink

Represents a navigable reference.

Targets may include:

* external resources;
* internal anchors;
* Knowledge Objects;
* Nodes.

Hyperlinks express navigation rather than semantics.

---

# 12. Embedded Documents

A Content Node may represent embedded structured content.

Examples:

* Mermaid diagram;
* PlantUML diagram;
* SVG;
* LaTeX;
* JSON example;
* XML snippet.

Embedded documents preserve their original semantics.

---

# 13. Content Invariants

The following invariants apply.

* Content Nodes represent knowledge.
* Content Nodes never organize hierarchy.
* Content Nodes never own Semantic Nodes.
* Content Nodes never own Annotation Nodes.
* Content Nodes preserve canonical meaning.
* Rendering is derived.

---

# 14. Relationship to Structural Nodes

Content Nodes always belong to Structural Nodes.

They never exist independently.

The structural tree owns their organization.

---

# 15. Relationship to Semantic Nodes

Semantic Nodes enrich Content Nodes.

They never replace them.

Content remains authoritative.

---

# 16. Relationship to Annotation Nodes

Annotations attach to Content Nodes through Anchors.

Annotations never modify canonical content.

---

# 17. Related Documents

* StructuralNodes.md
* SemanticNodes.md
* AnnotationNodes.md
* AssetNodes.md
* Anchors.md
* Core/NodeModel.md

---

# 18. Status

**Approved**

This document defines the Content Nodes of the Universal Document Model.

Content Nodes represent canonical knowledge independently of structural organization, rendering technologies and storage mechanisms.
