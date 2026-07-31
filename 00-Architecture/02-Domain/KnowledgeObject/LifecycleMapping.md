
# Lifecycle Mapping

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Knowledge Object

**Document:** Lifecycle Mapping

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document maps the lifecycle stages of a Knowledge Object to its internal domain components.

The objective is to define:

* which components exist at each lifecycle stage;
* which components evolve;
* which components remain immutable;
* which Platform Engines participate in each transition.

This document complements KnowledgeLifecycle.md.

---

# 2. Scope

This mapping applies to every Knowledge Object independently of its origin.

It covers:

* Identity;
* Metadata;
* Provenance;
* Universal Document Model;
* Assets;
* Relationships;
* Annotations;
* Version Information.

---

# 3. Lifecycle Overview

```text
Knowledge Source
        │
        ▼
Imported
        │
        ▼
Normalized
        │
        ▼
Managed
        │
        ▼
Enriched
        │
        ▼
Active
        │
        ▼
Archived
```

Each stage progressively enriches the Knowledge Object.

---

# 4. Imported

The object has just been created.

Available components:

| Component     | State           |
| ------------- | --------------- |
| Identity      | Created         |
| Metadata      | Initial         |
| Provenance    | Origin recorded |
| UDM           | Not available   |
| Assets        | Original Assets |
| Relationships | None            |
| Annotations   | None            |
| Version       | Initial         |

Primary Engine:

* Import Engine

---

# 5. Normalized

The imported source has been transformed into the canonical representation.

Available components:

| Component     | State      |
| ------------- | ---------- |
| Identity      | Stable     |
| Metadata      | Normalized |
| Provenance    | Updated    |
| UDM           | Created    |
| Assets        | Referenced |
| Relationships | None       |
| Annotations   | None       |
| Version       | Updated    |

Primary Engines:

* Import Engine
* Library Engine

---

# 6. Managed

The Knowledge Object becomes part of the Knowledge Library.

Available components:

| Component     | State        |
| ------------- | ------------ |
| Identity      | Stable       |
| Metadata      | Stable       |
| Provenance    | Stable       |
| UDM           | Stable       |
| Assets        | Referenced   |
| Relationships | User-defined |
| Annotations   | Empty        |
| Version       | Stable       |

Primary Engine:

* Library Engine

---

# 7. Enriched

Derived knowledge is added.

Available components:

| Component     | State    |
| ------------- | -------- |
| Identity      | Stable   |
| Metadata      | Enriched |
| Provenance    | Updated  |
| UDM           | Stable   |
| Assets        | Stable   |
| Relationships | Expanded |
| Annotations   | Optional |
| Version       | Updated  |

Primary Engines:

* Knowledge Engine
* AI Engine

Derived artifacts may include:

* semantic entities;
* classifications;
* embeddings;
* summaries;
* graph relationships.

None of these modify canonical knowledge.

---

# 8. Active

The Knowledge Object is actively used.

Available components:

| Component     | State    |
| ------------- | -------- |
| Identity      | Stable   |
| Metadata      | Evolving |
| Provenance    | Growing  |
| UDM           | Stable   |
| Assets        | Stable   |
| Relationships | Evolving |
| Annotations   | Evolving |
| Version       | Growing  |

Primary Engines:

* Render Engine
* Search Engine
* Annotation Engine
* Sync Engine

---

# 9. Archived

The Knowledge Object is no longer actively modified.

Available components:

| Component     | State                 |
| ------------- | --------------------- |
| Identity      | Stable                |
| Metadata      | Frozen                |
| Provenance    | Complete              |
| UDM           | Stable                |
| Assets        | Preserved             |
| Relationships | Preserved             |
| Annotations   | Preserved             |
| Version       | Final active revision |

The object remains searchable and recoverable.

---

# 10. Component Evolution

Not every component evolves in the same way.

| Component       | Evolution   |
| --------------- | ----------- |
| Identity        | Immutable   |
| Metadata        | Mutable     |
| Provenance      | Append-only |
| UDM             | Versioned   |
| Assets          | Immutable   |
| Relationships   | Versioned   |
| Annotations     | Versioned   |
| Version History | Append-only |

Each component follows its own evolution strategy.

---

# 11. Engine Participation

| Lifecycle Stage | Primary Engine    |
| --------------- | ----------------- |
| Import          | Import Engine     |
| Normalize       | Import Engine     |
| Register        | Library Engine    |
| Enrich          | Knowledge Engine  |
| AI Enrichment   | AI Engine         |
| Search          | Search Engine     |
| Render          | Render Engine     |
| Annotate        | Annotation Engine |
| Synchronize     | Sync Engine       |
| Export          | Export Engine     |
| Archive         | Library Engine    |

The Domain defines the lifecycle.

The Platform executes it.

---

# 12. Component State Matrix

| Component       | Imported | Normalized | Managed | Enriched | Active | Archived |
| --------------- | :------: | :--------: | :-----: | :------: | :----: | :------: |
| Identity        |    ✓    |     ✓     |   ✓   |    ✓    |   ✓   |    ✓    |
| Metadata        |    ✓    |     ✓     |   ✓   |    ✓    |   ✓   |    ✓    |
| Provenance      |    ✓    |     ✓     |   ✓   |    ✓    |   ✓   |    ✓    |
| UDM             |    —    |     ✓     |   ✓   |    ✓    |   ✓   |    ✓    |
| Assets          |    ✓    |     ✓     |   ✓   |    ✓    |   ✓   |    ✓    |
| Relationships   |    —    |     —     |   ✓   |    ✓    |   ✓   |    ✓    |
| Annotations     |    —    |     —     |   —   | Optional |   ✓   |    ✓    |
| Version History |    ✓    |     ✓     |   ✓   |    ✓    |   ✓   |    ✓    |

---

# 13. Lifecycle Invariants

The following rules apply throughout the lifecycle.

* Identity never changes.
* Provenance is append-only.
* Assets remain immutable.
* The UDM is always canonical.
* Relationships never replace canonical content.
* Annotations never modify the UDM.
* Every state transition creates a new Version.

---

# 14. Relationship to Other Documents

This document complements:

* KnowledgeLifecycle.md
* KnowledgeObject.md
* Metadata.md
* Provenance.md
* Assets.md
* Relationships.md
* Versioning.md

It does not redefine lifecycle stages.

It maps domain components to those stages.

---

# 15. Related Documents

* ../KnowledgeLifecycle.md
* KnowledgeObject.md
* Metadata.md
* Provenance.md
* Versioning.md
* ../../01-Foundation/ArchitectureModel.md

---

# 16. Status

**Approved**

This document defines how the internal components of a Knowledge Object evolve throughout its lifecycle.

Every Platform Engine shall preserve the lifecycle mapping and component invariants defined herein.

---

# Architecture Alignment (V3.1)

## Purpose

This document maps lifecycle transitions defined in `KnowledgeLifecycle.md`
to Knowledge Objects, publications, personal knowledge and derived artifacts.

## Lifecycle Domains

| Domain | Lifecycle |
|---|---|
| Publication | Publication Lifecycle |
| Personal Knowledge | Personal Knowledge Lifecycle |
| Canonical Models | Canonical Processing Lifecycle |
| Derived Artifacts | Canonical Processing Lifecycle |

## Publication Mapping

| State | Responsible Engine |
|---|---|
| Discovered | Import Engine |
| Imported | Import Engine |
| Validated | Workflow Engine |
| Registered | Library Engine |
| Published | Library Engine |
| Acquired | Library Engine |
| Archived | Library Engine |

## Personal Knowledge Mapping

| State | Responsible Engine |
|---|---|
| Created | Annotation Engine |
| Modified | Annotation Engine |
| Stored Locally | Library Engine |
| Pending Synchronization | Sync Engine |
| Synchronized | Sync Engine |
| Merged | Sync Engine |
| Historical | Library Engine |

## Canonical Processing Mapping

Source Publication
→ Extraction
→ Classification
→ UDM
→ DPM
→ Knowledge Graph
→ Indexes
→ Embeddings

Responsible engines:

- Import Engine
- Processing Engine
- Search Engine
- AI Engine

## Mapping Rules

- Publication lifecycle never modifies Personal Knowledge.
- Personal synchronization never changes publication ownership.
- Derived artifacts may be regenerated at any time.
- Failed processing resumes from the last consistent stage.

## Invariants

- Lifecycle transitions are deterministic.
- Processing is idempotent.
- Stable identifiers are preserved.
- Authority boundaries are never crossed.

## Related Documents

- KnowledgeLifecycle.md
- KnowledgeObject.md
- DomainModel.md
- Versioning.md
- Provenance.md
