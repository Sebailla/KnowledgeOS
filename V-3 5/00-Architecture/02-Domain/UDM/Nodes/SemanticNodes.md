# Semantic Nodes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Semantic Nodes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Semantic Nodes of the Universal Document Model (UDM).

Semantic Nodes enrich canonical knowledge by representing meaning, interpretation and conceptual relationships.

They never replace or modify canonical content.

---

# 2. Design Goals

Semantic Nodes shall:

* represent meaning;
* remain independent from rendering;
* remain independent from canonical content;
* support graph construction;
* support AI enrichment;
* support semantic search;
* preserve provenance.

---

# 3. Design Philosophy

Semantic Nodes describe knowledge.

They do not contain the knowledge itself.

Canonical knowledge always remains represented by Content Nodes.

Semantic Nodes are additive.

---

# 4. Semantic Layer

The semantic layer exists independently of the structural hierarchy.

```text
Structural Tree
        │
        ▼
Content Nodes
        │
        ▼
Semantic Layer
        │
        ▼
Knowledge Graph
```

Semantic Nodes connect meaning without altering structure.

---

# 5. Semantic Categories

Semantic Nodes are grouped into conceptual categories.

```text
Semantic Node
│
├── Entity
├── Concept
├── Event
├── Topic
├── Definition
├── Observation
├── Claim
├── Hypothesis
├── Classification
└── Custom
```

Each category represents a distinct semantic role.

---

# 6. Entity

Represents identifiable real-world objects.

Examples:

* Person
* Organization
* Location
* Species
* Chemical Compound
* Medical Term
* Product

Entities may be linked across multiple Knowledge Objects.

---

# 7. Concept

Represents abstract ideas.

Examples:

* Evolution
* Entropy
* Democracy
* Recursion
* Gravity

Concepts are independent of language and wording.

---

# 8. Event

Represents something that occurred in time.

Examples:

* discovery;
* publication;
* experiment;
* conference;
* battle;
* observation.

Events may reference the Temporal Model.

---

# 9. Topic

Represents thematic organization.

Examples:

* Biology
* Physics
* Software Engineering
* Aquarism
* Machine Learning

Topics support navigation and semantic search.

---

# 10. Definition

Represents a formal explanation of a concept or entity.

Definitions may reference:

* Concepts;
* Entities;
* Standards;
* External sources.

Multiple definitions may coexist.

---

# 11. Observation

Represents factual observations extracted or entered by users.

Examples:

* experimental result;
* field observation;
* laboratory measurement;
* reading note.

Observations preserve provenance and temporal context.

---

# 12. Claim

Represents an explicit assertion.

Claims may include:

* confidence;
* supporting evidence;
* contradicting evidence;
* source references.

Claims are independent from truth evaluation.

---

# 13. Hypothesis

Represents a proposition that has not yet been confirmed.

Hypotheses may evolve over time.

KnowledgeOS preserves them without assuming validity.

---

# 14. Classification

Represents taxonomic or organizational categorization.

Examples:

* biological taxonomy;
* legal classification;
* scientific discipline;
* document category.

Classifications support semantic organization.

---

# 15. Semantic Identity

Every Semantic Node owns:

* SemanticNodeID;
* NodeID reference;
* VersionID;
* Provenance reference.

Semantic identity is independent of the structural node.

---

# 16. Semantic Relationships

Semantic Nodes may relate to:

* Content Nodes;
* Structural Nodes;
* other Semantic Nodes;
* Knowledge Objects.

Relationships remain external to the structural tree.

---

# 17. Semantic Invariants

The following invariants apply.

* Semantic Nodes never replace canonical content.
* Semantic Nodes are additive.
* Semantic Nodes preserve provenance.
* Semantic Nodes preserve identity.
* Semantic Nodes remain independently versioned.
* Semantic Nodes support graph construction.

---

# 18. Relationship to AI

The AI Engine may:

* propose Semantic Nodes;
* enrich existing Semantic Nodes;
* assign confidence values.

AI-generated semantics require provenance.

The canonical UDM remains unchanged.

---

# 19. Relationship to the Knowledge Graph

The Knowledge Graph is derived from Semantic Nodes and their relationships.

The graph is a projection.

Semantic Nodes remain authoritative.

---

# 20. Related Documents

* ContentNodes.md
* StructuralNodes.md
* Graph/RelationshipModel.md
* Graph/Ontology.md
* Core/TemporalModel.md
* Core/Identity.md

---

# 21. Status

**Approved**

This document defines the Semantic Nodes of the Universal Document Model.

Semantic Nodes represent the meaning of knowledge independently of its structure, presentation and storage, forming the semantic foundation from which the Knowledge Graph is derived.
