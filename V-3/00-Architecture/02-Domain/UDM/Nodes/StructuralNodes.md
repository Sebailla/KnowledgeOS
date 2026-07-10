# Structural Nodes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Structural Nodes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Structural Nodes of the Universal Document Model (UDM).

Structural Nodes organize knowledge into a deterministic hierarchy.

They define **where knowledge is located**, but not **what the knowledge is**.

---

# 2. Design Goals

Structural Nodes shall:

* preserve logical organization;
* remain independent of rendering;
* support deterministic traversal;
* support semantic enrichment;
* support multiple renderers;
* remain stable over time.

---

# 3. Design Philosophy

Structural Nodes organize content.

They never represent the content itself.

The actual information is represented by Content Nodes.

---

# 4. Structural Hierarchy

```text
Document
│
├── FrontMatter
├── Chapter
│     ├── Section
│     │      ├── Paragraph
│     │      ├── Table
│     │      ├── Figure
│     │      ├── List
│     │      └── Quote
│     │
│     └── Section
│
└── BackMatter
```

The hierarchy is deterministic.

---

# 5. Root Node

Every UDM contains exactly one Document node.

The Document node:

* owns the structural tree;
* has no parent;
* defines canonical ordering.

There shall never be multiple Document nodes.

---

# 6. Front Matter

Represents introductory material.

Examples include:

* title page;
* copyright;
* abstract;
* preface;
* table of contents.

Front Matter is optional.

---

# 7. Back Matter

Represents concluding material.

Examples include:

* bibliography;
* glossary;
* index;
* appendices;
* acknowledgements.

Back Matter is optional.

---

# 8. Chapter

Represents a major logical division.

A Chapter may contain:

* Sections;
* Paragraphs;
* Figures;
* Tables;
* Lists.

Chapters are optional.

Short documents may omit them.

---

# 9. Section

Represents a logical subdivision.

Sections may contain:

* Paragraphs;
* Lists;
* Figures;
* Tables;
* Quotes;
* Subsections.

Sections organize related knowledge.

---

# 10. Paragraph

The Paragraph is the primary structural container for written knowledge.

A Paragraph contains **Content Nodes**.

It never stores raw strings.

Examples of allowed children:

* Text;
* Citation;
* Hyperlink;
* Formula;
* InlineCode;
* InlineImage;
* Reference.

---

# 11. List

Represents an ordered or unordered collection.

Lists contain ListItem nodes.

ListItems contain Structural or Content Nodes.

---

# 12. Table

Represents tabular knowledge.

Hierarchy:

```text
Table
│
├── TableRow
│      ├── TableCell
│      ├── TableCell
│      └── ...
│
└── ...
```

Cells contain Structural Nodes.

---

# 13. Figure

Represents a logical visual unit.

A Figure may contain:

* Image Asset;
* Caption;
* Formula;
* Diagram;
* Media.

Figures describe conceptual content rather than layout.

---

# 14. Quote

Represents quoted knowledge.

Quotes preserve:

* quotation boundaries;
* attribution;
* citations.

Quotes contain Content Nodes.

---

# 15. Sidebar

Represents secondary information associated with nearby content.

Examples:

* notes;
* warnings;
* historical context;
* implementation advice.

Sidebars remain part of the canonical structure.

---

# 16. Callout

Represents emphasized knowledge.

Examples:

* warning;
* important;
* tip;
* caution;
* recommendation.

Presentation is renderer-specific.

Semantic meaning is canonical.

---

# 17. Structural Invariants

The following invariants apply.

* Exactly one Document node.
* Every structural node has exactly one parent.
* Child order is deterministic.
* Cycles are forbidden.
* Structural nodes organize knowledge.
* Structural nodes never contain raw binary data.
* Structural nodes never contain plain strings.

---

# 18. Structural Composition

Structural Nodes contain either:

* other Structural Nodes;
* Content Nodes.

They never directly contain Semantic Nodes or Annotation Nodes.

Semantic and Annotation Nodes are attached through relationships defined elsewhere.

---

# 19. Relationship to Other Node Categories

| Category         | Relationship                           |
| ---------------- | -------------------------------------- |
| Content Nodes    | Embedded within structural nodes       |
| Semantic Nodes   | Linked to structural/content nodes     |
| Annotation Nodes | Anchored to structural/content nodes   |
| Asset Nodes      | Referenced by structural/content nodes |
| Virtual Nodes    | Generated from structural nodes        |

Each category preserves its own responsibilities.

---

# 20. Relationship to Rendering

Render Engines interpret the structural hierarchy.

The UDM never stores visual layout.

Examples:

* chapters may become pages;
* sections may become collapsible panels;
* paragraphs may flow across columns.

Rendering is always derived.

---

# 21. Related Documents

* Core/NodeModel.md
* Core/NodeTypes.md
* InlineNodes.md
* SemanticNodes.md
* AnnotationNodes.md
* AssetNodes.md
* Anchors.md

---

# 22. Status

**Approved**

This document defines the structural grammar of the Universal Document Model.

Structural Nodes organize knowledge into a deterministic hierarchy while remaining independent of rendering technologies and physical document formats.
