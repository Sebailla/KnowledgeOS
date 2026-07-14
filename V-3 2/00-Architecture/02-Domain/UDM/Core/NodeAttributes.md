# Node Attributes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Node Attributes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the common attribute model shared by every node in the Universal Document Model (UDM).

Attributes describe the properties of a node.

They do not define:

* structural relationships;
* behavior;
* rendering;
* processing.

Those concerns are specified elsewhere.

---

# 2. Design Goals

The attribute model shall:

* remain deterministic;
* remain extensible;
* remain strongly typed;
* support validation;
* support versioning;
* support backward compatibility.

---

# 3. Attribute Categories

Every attribute belongs to exactly one category.

```text
Node Attributes

├── Identity
├── Classification
├── Structural
├── Semantic
├── Capability
├── Rendering
├── Extension
└── System
```

---

# 4. Identity Attributes

Mandatory.

| Attribute | Description                 |
| --------- | --------------------------- |
| NodeID    | Immutable node identifier   |
| VersionID | Current node version        |
| CreatedAt | Creation timestamp          |
| UpdatedAt | Last modification timestamp |

Identity attributes are immutable except timestamps defined by version evolution.

---

# 5. Classification Attributes

Describe the role of the node.

Mandatory.

| Attribute | Description             |
| --------- | ----------------------- |
| Category  | Primary category        |
| Type      | Official node type      |
| Variant   | Optional specialization |

Classification is immutable.

---

# 6. Structural Attributes

Describe the node position inside the structural tree.

Typical attributes:

* ParentID
* ChildOrder
* ChildCount
* Depth
* Path

Structural attributes support deterministic traversal.

---

# 7. Semantic Attributes

Describe knowledge-related information.

Examples:

* Language
* Confidence
* ReadingDirection
* Domain
* OntologyReference
* SemanticRole

Semantic attributes never alter canonical content.

---

# 8. Capability Attributes

Capabilities indicate what operations are permitted on the node.

Examples:

* Searchable
* Annotatable
* Selectable
* Editable
* Versioned
* Exportable
* Renderable
* Indexable

Capabilities express permissions and supported behaviors.

They do not implement behavior.

---

# 9. Rendering Attributes

Optional rendering hints.

Examples:

* PreferredRenderer
* PreferredLayout
* ReadingPriority
* DisplayRole
* Collapsible

Render Engines may ignore these attributes.

Canonical knowledge remains unaffected.

---

# 10. Extension Attributes

Plugins may introduce additional attributes.

Requirements:

* namespace isolation;
* explicit schema version;
* backward compatibility.

Extensions shall never override official attributes.

---

# 11. System Attributes

Reserved for internal platform use.

Examples:

* IntegrityHash
* ValidationState
* SerializationVersion
* MigrationState

These attributes are managed exclusively by the platform.

---

# 12. Attribute Constraints

Every attribute shall define:

* name;
* category;
* data type;
* cardinality;
* mutability;
* validation rule.

No attribute may exist without an explicit definition.

---

# 13. Attribute Evolution

Attributes evolve through versioning.

Rules:

* existing attributes are never redefined;
* deprecated attributes remain readable;
* new attributes shall preserve compatibility.

Breaking changes require a new UDM version.

---

# 14. Relationship to Other Documents

This document defines common attributes.

Specific node types may introduce additional attributes as defined in:

* StructuralNodes.md
* InlineNodes.md
* SemanticNodes.md
* AnnotationNodes.md
* AssetNodes.md

---

# 15. Related Documents

* NodeModel.md
* TypeSystem.md
* NodeTypes.md
* ValidationRules.md
* Serialization.md

---

# 16. Status

**Approved**

This document defines the universal attribute model shared by every node in the Universal Document Model.

Every node shall expose attributes according to the categories and rules defined in this specification.
