
# Assets

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Knowledge Object

**Document:** Assets

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Asset model used by KnowledgeOS.

Assets represent binary resources associated with a Knowledge Object.

Assets are not part of the canonical knowledge itself.

They provide supporting resources required to preserve, render or enrich knowledge.

---

# 2. Definition

An Asset is an immutable binary resource referenced by one or more Knowledge Objects.

Examples include:

* original PDF;
* images;
* scanned pages;
* illustrations;
* audio;
* video;
* attachments;
* thumbnails;
* supplementary datasets.

Assets are external to the Knowledge Object.

The Knowledge Object stores only references.

---

# 3. Design Goals

The Asset model shall:

* avoid duplication;
* preserve original resources;
* support immutable storage;
* enable efficient synchronization;
* allow independent versioning;
* support future storage technologies.

---

# 4. Conceptual Model

```text
Knowledge Object
        │
        ▼
Asset Reference
        │
        ▼
Asset Repository
        │
        ▼
Binary Asset
```

The Knowledge Object never owns the binary resource directly.

---

# 5. Asset Categories

Assets are classified according to their purpose.

```text
Assets
│
├── Original Assets
├── Embedded Assets
├── Generated Assets
├── Imported Assets
├── External Assets
└── Temporary Assets
```

Each category defines storage and lifecycle policies.

---

# 6. Original Assets

Original Assets preserve the imported source.

Examples:

* original PDF;
* EPUB;
* DOCX;
* scanned image.

Original Assets are immutable.

They represent the historical source.

---

# 7. Embedded Assets

Embedded Assets are resources contained within another source.

Examples:

* images inside EPUB;
* figures in PDF;
* embedded SVG;
* embedded fonts.

Embedded Assets remain independently addressable.

---

# 8. Generated Assets

Generated Assets are produced by the platform.

Examples:

* thumbnails;
* previews;
* OCR images;
* page snapshots;
* cached renderings.

Generated Assets may be regenerated at any time.

---

# 9. Imported Assets

Imported Assets are provided explicitly by the user.

Examples:

* attachments;
* supplementary material;
* datasets;
* supporting images.

These Assets retain their own provenance.

---

# 10. External Assets

External Assets remain outside the Knowledge Library.

Examples:

* remote media;
* linked resources;
* referenced datasets.

The platform records references only.

Availability is not guaranteed.

---

# 11. Temporary Assets

Temporary Assets exist only during processing.

Examples:

* OCR intermediates;
* conversion caches;
* temporary previews;
* processing artifacts.

Temporary Assets are never considered part of the Knowledge Object.

---

# 12. Asset Identity

Every Asset has exactly one immutable AssetID.

Properties:

* globally unique;
* storage-independent;
* synchronization-independent;
* permanent.

Asset identity is independent of the KnowledgeObjectID.

---

# 13. Asset References

A Knowledge Object references Assets using Asset References.

Each reference contains:

* AssetID;
* Asset Role;
* Media Type;
* Relationship to the UDM.

References never embed binary content.

---

# 14. Ownership

Assets are owned by the Asset Repository.

Knowledge Objects own only Asset References.

Multiple Knowledge Objects may reference the same Asset.

---

# 15. Lifecycle

The conceptual Asset lifecycle is:

```text
Acquire
      │
      ▼
Store
      │
      ▼
Reference
      │
      ▼
Use
      │
      ▼
Archive
```

Assets remain immutable throughout their lifetime.

---

# 16. Relationship to the UDM

The UDM may reference Assets.

Examples:

* images;
* equations;
* diagrams;
* multimedia.

The UDM never embeds binary resources.

Rendering Engines resolve Asset References during presentation.

---

# 17. Relationship to Provenance

Original Assets establish the historical origin of a Knowledge Object.

Generated Assets record their creation in Provenance.

Every Asset shall be traceable.

---

# 18. Relationship to Synchronization

Synchronization transfers Asset References independently from binary Assets whenever possible.

Binary Assets may be synchronized:

* lazily;
* on demand;
* proactively.

The synchronization strategy is defined by the Sync Engine.

---

# 19. Domain Invariants

The following invariants apply.

* Assets are immutable.
* Asset identity never changes.
* Binary resources are never embedded in the Knowledge Object.
* Binary resources are never embedded in the UDM.
* Asset References always use AssetID.
* Multiple Knowledge Objects may reference the same Asset.
* Generated Assets never replace Original Assets.

---

# 20. Relationship to Platform Engines

| Engine           | Responsibility                                  |
| ---------------- | ----------------------------------------------- |
| Import Engine    | Create Original Assets                          |
| Library Engine   | Manage Asset References                         |
| Render Engine    | Resolve Assets for presentation                 |
| Search Engine    | Ignore binary content unless indexed separately |
| Knowledge Engine | Analyze Assets when required                    |
| AI Engine        | Produce derived Assets if necessary             |
| Sync Engine      | Synchronize Assets                              |
| Export Engine    | Include Assets when exporting                   |

The Asset Repository is the authoritative owner of all Assets.

---

# 21. Related Documents

* KnowledgeObject.md
* Metadata.md
* Provenance.md
* Sources.md
* Versioning.md
* ../KnowledgeLifecycle.md
* ../../04-Platform/Storage/
* ../../04-Platform/Sync/

---

# 22. Status

**Approved**

This document defines the Asset model for KnowledgeOS.

Assets are immutable binary resources owned by the Asset Repository and referenced by Knowledge Objects through stable Asset References.
