
# Relationship Model

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Relationship Model

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the relationship model used within the Universal Document Model (UDM).

Relationships connect nodes, anchors and semantic concepts without modifying the structural hierarchy.

They are first-class domain objects.

---

# 2. Scope

The UDM Relationship Model applies exclusively to relationships inside a single Knowledge Object.

Relationships between Knowledge Objects are defined separately in the Domain Relationship Model.

---

# 3. Design Goals

The Relationship Model shall:

* preserve semantic meaning;
* remain independent of rendering;
* support graph construction;
* preserve provenance;
* support temporal reasoning;
* support AI enrichment;
* support future extensibility.

---

# 4. Conceptual Model

```text
Relationship
│
├── RelationshipID
├── Source
├── Target
├── Type
├── Direction
├── Strength
├── Confidence
├── Evidence
├── Temporal Validity
├── Provenance
└── Metadata
```

Relationships are independent domain objects.

---

# 5. Relationship Endpoints

A relationship may connect:

* Node ↔ Node
* Node ↔ Anchor
* Anchor ↔ Anchor
* Node ↔ Semantic Node
* Semantic Node ↔ Semantic Node
* Node ↔ Asset Node
* Semantic Node ↔ Asset Node

Endpoints are identified through immutable IDs.

---

# 6. Relationship Types

Relationship types express semantic intent.

Examples:

* references;
* cites;
* supports;
* contradicts;
* extends;
* derives from;
* depends on;
* illustrates;
* defines;
* explains;
* compares;
* translates.

Relationship types belong to the ontology.

---

# 7. Direction

Relationships declare one direction.

Supported modes:

* directed;
* bidirectional;
* symmetric.

Direction is explicit.

It is never inferred.

---

# 8. Strength

Relationships may include a semantic strength.

Typical values:

* weak;
* medium;
* strong;
* exact.

Strength expresses relevance rather than truth.

---

# 9. Confidence

Confidence represents the certainty associated with the relationship.

Typical origins include:

* user-created;
* imported;
* inferred;
* AI-generated.

Confidence never determines validity.

---

# 10. Evidence

Relationships may reference supporting evidence.

Evidence may include:

* source citations;
* observations;
* experiments;
* publications;
* annotations;
* external references.

Evidence strengthens interpretation without modifying canonical content.

---

# 11. Temporal Validity

Relationships may define:

* valid from;
* valid until;
* event time;
* transaction time.

Temporal semantics follow the Temporal Model.

---

# 12. Provenance

Every relationship records:

* creator;
* creation process;
* creation time;
* modification history;
* synchronization history.

Provenance is append-only.

---

# 13. Metadata

Optional metadata may include:

* notes;
* labels;
* namespaces;
* extension properties.

Metadata never changes semantic intent.

---

# 14. Identity

Every relationship owns:

* RelationshipID;
* VersionID.

Identity remains immutable.

Version history evolves independently.

---

# 15. Relationship Invariants

The following invariants apply.

* Every relationship has at least two endpoints.
* Endpoints are immutable identifiers.
* Relationships never modify canonical content.
* Provenance is preserved.
* Identity is immutable.
* Version history is append-only.

---

# 16. Relationship Lifecycle

```text
Created
     │
     ▼
Validated
     │
     ▼
Active
     │
     ▼
Archived
```

Historical relationships remain queryable.

---

# 17. Relationship Resolution

Relationships are resolved using stable identifiers.

No relationship depends on:

* page numbers;
* coordinates;
* renderer state;
* serialization format.

Resolution is deterministic.

---

# 18. Relationship to the Knowledge Graph

The Knowledge Graph is generated from:

* Semantic Nodes;
* Relationships;
* Anchors;
* Ontology.

The graph is a derived projection.

The Relationship Model remains authoritative.

---

# 19. Relationship to Platform Engines

| Engine           | Responsibility                     |
| ---------------- | ---------------------------------- |
| Knowledge Engine | Creates and enriches relationships |
| AI Engine        | Suggests inferred relationships    |
| Search Engine    | Traverses relationships            |
| Render Engine    | Visualizes relationships           |
| Sync Engine      | Synchronizes relationship history  |
| Export Engine    | Exports relationship data          |

Relationships are shared across multiple engines.

---

# 20. Related Documents

* GraphModel.md
* Ontology.md
* EmbeddingModel.md
* ../Nodes/SemanticNodes.md
* ../Nodes/Anchors.md
* ../Core/TemporalModel.md

---

# 21. Status

**Approved**

This document defines the Relationship Model of the Universal Document Model.

Relationships are first-class semantic objects that connect canonical knowledge through stable identifiers while preserving provenance, temporal validity and extensibility.
