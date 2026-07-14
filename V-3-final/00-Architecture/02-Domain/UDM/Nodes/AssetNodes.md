# Asset Nodes

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Asset Nodes

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Asset Nodes of the Universal Document Model (UDM).

Asset Nodes provide the canonical representation of binary resources within structured knowledge.

They reference Assets owned by the Asset Repository.

They never contain binary data.

---

# 2. Design Goals

Asset Nodes shall:

* represent binary resources logically;
* remain independent of storage technologies;
* preserve canonical structure;
* support deterministic rendering;
* support synchronization;
* support long-term preservation.

---

# 3. Design Philosophy

Asset Nodes represent references.

Assets represent resources.

The two concepts are intentionally independent.

The UDM models logical knowledge.

The Asset Repository stores binary resources.

---

# 4. Conceptual Architecture

```text
Knowledge Object
        │
        ▼
Asset Repository
        │
        ▼
Asset
        │
        ▼
Asset Reference
        │
        ▼
Asset Node
        │
        ▼
Structural Tree
```

Asset Nodes never own Assets.

---

# 5. Asset Categories

The UDM supports multiple Asset Node categories.

```text
Asset Node

├── Image
├── Audio
├── Video
├── PDF
├── Attachment
├── Dataset
├── Font
├── Embedded Resource
└── Custom Asset
```

Extensions may introduce additional Asset Node types.

---

# 6. Image

Represents a logical image.

Typical examples:

* photographs;
* diagrams;
* illustrations;
* scanned pages;
* screenshots.

Rendering is renderer-dependent.

Identity is renderer-independent.

---

# 7. Audio

Represents referenced audio.

Examples:

* interviews;
* lectures;
* voice notes;
* podcasts.

Playback behavior belongs to the Render Engine.

---

# 8. Video

Represents referenced video.

Examples:

* educational videos;
* demonstrations;
* scientific recordings.

Temporal navigation is handled by the Render Engine.

---

# 9. PDF

Represents the original imported PDF.

The canonical knowledge remains in the UDM.

The PDF is preserved as an Asset for fidelity, auditing and export.

---

# 10. Dataset

Represents structured external data.

Examples:

* CSV;
* JSON;
* XML;
* scientific datasets;
* tabular observations.

Datasets remain immutable Assets.

---

# 11. Attachment

Represents supplementary resources.

Examples:

* appendices;
* source files;
* supplementary material;
* laboratory reports.

Attachments preserve provenance.

---

# 12. Embedded Resources

Represents embedded binary content extracted during import.

Examples:

* embedded SVG;
* embedded fonts;
* embedded icons;
* embedded multimedia.

Embedded resources remain independent Assets.

---

# 13. Asset Reference

Every Asset Node references exactly one Asset Reference.

The reference contains:

* AssetID;
* AssetRole;
* MediaType;
* IntegrityHash;
* RepositoryIdentifier.

The Asset Reference uniquely identifies the binary resource.

---

# 14. Canonical Rules

Asset Nodes never contain:

* binary data;
* file streams;
* encoded media.

The canonical representation contains references only.

---

# 15. Rendering

Render Engines resolve Asset References.

Typical workflow:

```text
Asset Node
      │
      ▼
Asset Reference
      │
      ▼
Asset Repository
      │
      ▼
Binary Resource
```

Rendering never changes the UDM.

---

# 16. Synchronization

Synchronization operates independently on:

* Asset Nodes;
* Asset References;
* Binary Assets.

This enables:

* lazy synchronization;
* incremental synchronization;
* bandwidth optimization.

---

# 17. Versioning

Asset Nodes maintain independent version history.

Typical revisions include:

* alternative role;
* presentation hints;
* additional metadata.

The referenced Asset remains immutable.

---

# 18. Provenance

Every Asset Node preserves:

* Asset origin;
* import process;
* extraction history;
* repository reference.

The Asset itself maintains its own preservation metadata.

---

# 19. Invariants

The following invariants apply.

* Asset Nodes never embed binary resources.
* Every Asset Node references exactly one Asset.
* Asset identity is immutable.
* Asset Nodes remain renderer-independent.
* Asset Nodes remain storage-independent.
* Binary resources remain external.

---

# 20. Relationship to Other Layers

| Layer            | Relationship                              |
| ---------------- | ----------------------------------------- |
| Structural Layer | Hosted by structural nodes                |
| Content Layer    | May appear inline or as block content     |
| Semantic Layer   | May be semantically enriched              |
| Annotation Layer | May receive annotations                   |
| Graph Layer      | May participate in semantic relationships |

Asset Nodes participate in the UDM without owning binary content.

---

# 21. Related Documents

* ../../KnowledgeObject/Assets.md
* ContentNodes.md
* StructuralNodes.md
* Anchors.md
* Core/Identity.md
* Graph/RelationshipModel.md

---

# 22. Status

**Approved**

This document defines the Asset Nodes of the Universal Document Model.

Asset Nodes provide the canonical representation of binary resources through stable references to immutable Assets stored in the Asset Repository.
