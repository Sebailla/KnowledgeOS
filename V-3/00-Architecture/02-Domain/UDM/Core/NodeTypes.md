
# Node Types

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Node Types

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the official catalog of node types supported by the Universal Document Model (UDM).

It specifies:

* available node types;
* category classification;
* structural role;
* parent-child constraints;
* extensibility rules.

Behavior is defined in dedicated specifications.

---

# 2. Design Goals

The node catalog shall:

* remain deterministic;
* remain extensible;
* avoid duplicate semantics;
* separate structure from behavior;
* preserve backward compatibility.

---

# 3. Node Classification Model

Every node is classified using three dimensions.

```text
Category

↓

Type

↓

Variant
```

Example:

```text
Category
    Structural

Type
    Paragraph

Variant
    Scientific Paragraph
```

Variants extend behavior without redefining the base type.

---

# 4. Structural Node Types

These nodes organize the logical structure.

| Type        | Purpose                         |
| ----------- | ------------------------------- |
| Document    | Root of the document tree       |
| FrontMatter | Preliminary information         |
| BackMatter  | Closing information             |
| Chapter     | Major division                  |
| Section     | Logical subdivision             |
| Subsection  | Nested subdivision              |
| Paragraph   | Primary text container          |
| List        | Ordered or unordered collection |
| ListItem    | Item within a list              |
| Table       | Tabular structure               |
| TableRow    | Row within a table              |
| TableCell   | Cell within a table             |
| Figure      | Visual container                |
| Caption     | Description of another node     |
| Quote       | Quoted content                  |
| Footnote    | Supplementary note              |
| Sidebar     | Secondary content               |
| Callout     | Highlighted information         |
| Separator   | Logical division                |

---

# 5. Content Node Types

These nodes represent information.

| Type       | Purpose                   |
| ---------- | ------------------------- |
| Text       | Plain text                |
| Code       | Source code               |
| InlineCode | Inline code fragment      |
| Formula    | Mathematical formula      |
| Equation   | Display equation          |
| Citation   | Reference citation        |
| Reference  | Cross-reference           |
| Hyperlink  | External or internal link |
| Symbol     | Individual symbol         |
| Emoji      | Emoji representation      |

---

# 6. Semantic Node Types

These nodes enrich meaning.

| Type             | Purpose                   |
| ---------------- | ------------------------- |
| Entity           | Generic entity            |
| Person           | Human entity              |
| Organization     | Organization              |
| Location         | Geographic entity         |
| Concept          | Abstract concept          |
| Topic            | Subject classification    |
| Taxon            | Biological classification |
| ChemicalCompound | Chemistry                 |
| MedicalTerm      | Medicine                  |
| Keyword          | Search keyword            |
| Definition       | Formal definition         |

Semantic nodes never modify canonical content.

---

# 7. Annotation Node Types

These nodes represent user-generated information.

| Type       | Purpose             |
| ---------- | ------------------- |
| Highlight  | Highlighted content |
| Note       | User note           |
| StickyNote | Floating annotation |
| Bookmark   | Navigation marker   |
| Ink        | Handwriting         |
| Drawing    | Freehand drawing    |
| Comment    | Comment             |
| Review     | Review annotation   |

---

# 8. Asset Node Types

Asset nodes reference external binary resources.

| Type       | Purpose             |
| ---------- | ------------------- |
| Image      | Image reference     |
| Audio      | Audio reference     |
| Video      | Video reference     |
| PDF        | Original PDF        |
| Attachment | Generic attachment  |
| Dataset    | External dataset    |
| Archive    | Compressed resource |
| Font       | Font resource       |

Asset nodes never embed binary content.

---

# 9. Virtual Node Types

Virtual nodes are generated dynamically.

| Type            | Purpose                |
| --------------- | ---------------------- |
| TableOfContents | Generated TOC          |
| SearchResult    | Search hit             |
| NavigationTree  | Navigation hierarchy   |
| Preview         | Preview representation |
| Summary         | Generated summary      |
| Outline         | Generated outline      |
| ReadingProgress | Reading state          |

Virtual nodes are never serialized as canonical content.

---

# 10. Parent Constraints

Each node declares its valid parent types.

Example:

| Node      | Valid Parents     |
| --------- | ----------------- |
| Paragraph | Section, Chapter  |
| Section   | Chapter, Document |
| TableRow  | Table             |
| TableCell | TableRow          |
| Caption   | Figure            |
| Highlight | Paragraph, Text   |
| Image     | Figure, Paragraph |

Validation rules are defined separately.

---

# 11. Child Constraints

Each node declares its permitted children.

Example:

| Node      | Allowed Children                          |
| --------- | ----------------------------------------- |
| Document  | Chapter, Section, FrontMatter, BackMatter |
| Chapter   | Section, Paragraph                        |
| Section   | Paragraph, Table, Figure, List            |
| Paragraph | Text, InlineCode, Hyperlink, Citation     |
| Table     | TableRow                                  |
| TableRow  | TableCell                                 |

---

# 12. Required Attributes

Every node shall declare:

* NodeID;
* Category;
* Type;
* Version;
* Attributes.

Optional attributes depend on specialization.

---

# 13. Extensibility

New node types may be introduced through extensions.

Extensions shall:

* declare Category;
* declare Type;
* define parent constraints;
* define child constraints;
* define validation rules.

Existing node types shall never be modified.

---

# 14. Reserved Types

The following identifiers are reserved.

* Root
* Null
* Unknown
* Invalid

Reserved identifiers shall not be reused.

---

# 15. Relationship to Other Documents

Behavior is specified in:

* ValidationRules.md
* ProcessingPipeline.md
* Serialization.md

Semantic meaning is specified in:

* Ontology.md
* RelationshipModel.md

Type inheritance is defined in:

* TypeSystem.md

---

# 16. Related Documents

* TypeSystem.md
* NodeAttributes.md
* StructuralNodes.md
* InlineNodes.md
* SemanticNodes.md
* AnnotationNodes.md
* AssetNodes.md

---

# 17. Status

**Approved**

This document defines the official catalog of node types supported by the Universal Document Model.

Every canonical UDM representation shall use only node types defined or formally extended according to this specification.
