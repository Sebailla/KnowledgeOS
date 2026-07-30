
# Metadata

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Knowledge Object

**Document:** Metadata

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the metadata model of a Knowledge Object.

Metadata describes a Knowledge Object without becoming part of its canonical content.

Metadata supports:

* discovery;
* organization;
* classification;
* filtering;
* presentation;
* interoperability.

Metadata never defines the identity of a Knowledge Object.

---

# 2. Definition

Metadata is an immutable Value Object attached to a Knowledge Object.

It describes the knowledge represented by the object but does not modify its semantic meaning.

Metadata may evolve over time while preserving backward compatibility.

---

# 3. Design Goals

The metadata model shall:

* remain extensible;
* remain technology-independent;
* support multiple document formats;
* preserve original source information;
* support semantic enrichment;
* support efficient search.

---

# 4. Metadata Categories

Metadata is organized into logical categories.

```text
Metadata
│
├── Identity Metadata
├── Descriptive Metadata
├── Source Metadata
├── Technical Metadata
├── Organizational Metadata
├── Semantic Metadata
├── Preservation Metadata
└── Custom Metadata
```

Each category has a distinct responsibility.

---

# 5. Identity Metadata

Identity metadata identifies the Knowledge Object without defining its business identity.

Examples:

* KnowledgeObjectID
* External identifiers
* Legacy identifiers

Identity metadata shall remain stable.

---

# 6. Descriptive Metadata

Describes the intellectual content.

Examples:

* title;
* subtitle;
* author;
* contributors;
* publisher;
* edition;
* language;
* abstract;
* keywords.

This category is intended for human interpretation.

---

# 7. Source Metadata

Describes the origin of the imported knowledge.

Examples:

* original filename;
* source format;
* import date;
* import method;
* MIME type;
* source URI (when applicable).

Source metadata never replaces Provenance.

---

# 8. Technical Metadata

Describes technical characteristics.

Examples:

* page count;
* word count;
* image count;
* media types;
* OCR status;
* detected encoding;
* detected layout version.

Technical metadata may be regenerated.

---

# 9. Organizational Metadata

Supports personal organization.

Examples:

* Collections;
* favorite status;
* archive status;
* reading status;
* user labels;
* custom categories.

Organizational metadata is user-defined.

---

# 10. Semantic Metadata

Represents machine-generated knowledge.

Examples:

* detected entities;
* detected topics;
* confidence scores;
* semantic categories;
* embeddings reference.

Semantic metadata is always derived.

It never replaces canonical knowledge.

---

# 11. Preservation Metadata

Supports long-term preservation.

Examples:

* creation timestamp;
* modification timestamp;
* checksum;
* format version;
* preservation status.

Preservation metadata shall remain immutable whenever possible.

---

# 12. Custom Metadata

Users and Plugins may define additional metadata.

Requirements:

* namespace isolation;
* version compatibility;
* conflict avoidance.

Custom metadata shall never override official metadata.

---

# 13. Metadata Ownership

The Knowledge Object owns its Metadata.

The following Engines may interact with it:

| Engine            | Access         |
| ----------------- | -------------- |
| Library Engine    | Read / Write   |
| Import Engine     | Initialize     |
| Search Engine     | Read           |
| Render Engine     | Read           |
| Annotation Engine | Read           |
| Knowledge Engine  | Read / Enrich  |
| AI Engine         | Read / Suggest |
| Export Engine     | Read           |
| Sync Engine       | Synchronize    |

No Engine may redefine the metadata schema.

---

# 14. Metadata Lifecycle

Metadata evolves throughout the lifecycle.

```text
Import
    │
    ▼
Extraction
    │
    ▼
Validation
    │
    ▼
Normalization
    │
    ▼
Enrichment
    │
    ▼
Synchronization
    │
    ▼
Preservation
```

Each stage appends information without compromising existing metadata.

---

# 15. Metadata Invariants

The following invariants apply.

* Metadata never defines identity.
* Metadata never replaces provenance.
* Metadata never modifies the UDM.
* Metadata remains versioned.
* Metadata is extensible.
* Metadata is searchable.
* Metadata preserves backward compatibility.

---

# 16. Metadata Versioning

Metadata shall evolve independently from:

* the UDM;
* annotations;
* assets;
* relationships.

Schema evolution shall preserve compatibility whenever feasible.

Breaking changes require a new metadata schema version.

---

# 17. Relationship to Other Components

Metadata collaborates with:

* Knowledge Object;
* Provenance;
* UDM;
* Search Index;
* Knowledge Graph.

Metadata is descriptive.

It is never authoritative over canonical content.

---

# 18. Related Documents

* KnowledgeObject.md
* Provenance.md
* Versioning.md
* Sources.md
* ../KnowledgeLifecycle.md
* ../UDM/UDM.md

---

# 19. Status

**Approved**

This document defines the official metadata model for Knowledge Objects within KnowledgeOS.

Metadata shall remain structured, extensible and independent of both canonical content and implementation technologies.
