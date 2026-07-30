# Engine Responsibilities

**Project:** KnowledgeOS

**Section:** Domain

**Document:** Engine Responsibilities

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the ownership boundaries and responsibilities of every Platform Engine.

Its objectives are:

* eliminate overlapping responsibilities;
* establish clear ownership;
* reduce coupling;
* maximize cohesion;
* simplify long-term evolution.

Every business capability shall have exactly one owning Engine.

---

# 2. Scope

This document applies to all Platform Engines.

It defines:

* ownership;
* responsibilities;
* boundaries;
* interactions;
* prohibited responsibilities.

Implementation details are intentionally excluded.

---

# 3. Architectural Principles

Every Engine follows the same principles.

* One primary responsibility.
* One public interface.
* One owning team (currently the project owner).
* No direct access to another Engine's internals.
* Communication through Commands, Queries, Events or Public APIs.

---

# 4. Responsibility Matrix

| Engine            | Primary Responsibility                            |
| ----------------- | ------------------------------------------------- |
| Library Engine    | Manage the Knowledge Library                      |
| Import Engine     | Transform external sources into Knowledge Objects |
| Render Engine     | Present Knowledge Objects to users                |
| Search Engine     | Discover information                              |
| Annotation Engine | Manage user annotations                           |
| Knowledge Engine  | Build semantic knowledge                          |
| AI Engine         | Execute AI-assisted capabilities                  |
| Sync Engine       | Synchronize Working Copies                        |
| Export Engine     | Produce external representations                  |
| Plugin Engine     | Manage platform extensions                        |

Each responsibility is exclusive.

---

# 5. Library Engine

## Owns

* Knowledge Library
* Knowledge Objects
* Collections
* Workspaces
* Library metadata

## Responsibilities

* create Knowledge Objects;
* maintain object identity;
* organize the Library;
* preserve consistency;
* manage ownership.

## Shall Not

* import documents;
* perform OCR;
* execute AI;
* render content;
* synchronize devices.

---

# 6. Import Engine

## Owns

The import pipeline.

## Responsibilities

* detect formats;
* classify sources;
* parse content;
* execute OCR;
* normalize content;
* create the UDM.

## Shall Not

* organize the Library;
* render content;
* execute synchronization;
* build semantic relationships.

---

# 7. Render Engine

## Owns

Visual presentation.

## Responsibilities

* Book View;
* Paper View;
* Editor View;
* Magazine View;
* Web View;
* Print View.

## Shall Not

* modify canonical content;
* perform indexing;
* execute AI;
* change metadata.

Rendering is always derived from the UDM.

---

# 8. Search Engine

## Owns

Knowledge discovery.

## Responsibilities

* full-text search;
* metadata search;
* semantic search;
* index management;
* ranking.

## Shall Not

* import content;
* modify knowledge;
* render views.

---

# 9. Annotation Engine

## Owns

User annotations.

## Responsibilities

* highlights;
* notes;
* ink;
* bookmarks;
* annotation layers.

## Shall Not

* modify canonical content;
* alter provenance;
* change identity.

Annotations remain logically separate from the UDM.

---

# 10. Knowledge Engine

## Owns

Semantic enrichment.

## Responsibilities

* entity extraction;
* relationship discovery;
* ontology application;
* Knowledge Graph generation.

## Shall Not

* modify canonical content;
* execute rendering;
* synchronize devices.

The Knowledge Graph is always derived.

---

# 11. AI Engine

## Owns

Artificial intelligence orchestration.

## Responsibilities

* prompt execution;
* provider selection;
* context construction;
* summarization;
* classification;
* translation;
* embeddings.

## Shall Not

* become the Source of Truth;
* own business entities;
* modify canonical knowledge without explicit approval.

---

# 12. Sync Engine

## Owns

Synchronization.

## Responsibilities

* Working Copies;
* synchronization;
* conflict detection;
* replication;
* recovery.

## Shall Not

* own the Library;
* modify semantic meaning;
* execute rendering.

---

# 13. Export Engine

## Owns

External representations.

## Responsibilities

* PDF export;
* EPUB export;
* Markdown export;
* HTML export;
* future exporters.

## Shall Not

* modify Knowledge Objects;
* alter identity;
* execute imports.

Exports are always generated from the canonical representation.

---

# 14. Plugin Engine

## Owns

Platform extensibility.

## Responsibilities

* plugin lifecycle;
* permissions;
* sandboxing;
* plugin discovery;
* plugin execution.

## Shall Not

* expose private Engine internals;
* bypass security;
* modify Kernel infrastructure.

---

# 15. Engine Collaboration

Engines collaborate through public contracts only.

Supported mechanisms:

* Commands
* Queries
* Events
* Public APIs

Direct implementation dependencies are forbidden.

---

# 16. Ownership Rules

Each business capability has exactly one owner.

Examples:

| Capability              | Owner             |
| ----------------------- | ----------------- |
| Import PDF              | Import Engine     |
| OCR                     | Import Engine     |
| Create Knowledge Object | Library Engine    |
| Search                  | Search Engine     |
| Highlight               | Annotation Engine |
| Semantic Graph          | Knowledge Engine  |
| AI Summary              | AI Engine         |
| Synchronization         | Sync Engine       |
| Export EPUB             | Export Engine     |
| Plugin Installation     | Plugin Engine     |

Shared ownership is prohibited.

---

# 17. Cross-Engine Rules

The following responsibilities are shared conceptually but owned explicitly.

| Concern         | Owner                                                 |
| --------------- | ----------------------------------------------------- |
| Identity        | Library Engine                                        |
| Provenance      | Library Engine                                        |
| Metadata        | Library Engine                                        |
| UDM             | Import Engine (creation) / Library Engine (ownership) |
| Search Index    | Search Engine                                         |
| Knowledge Graph | Knowledge Engine                                      |
| Embeddings      | AI Engine                                             |
| Assets          | Library Engine                                        |

Only one Engine owns each artifact.

Other Engines consume it through public contracts.

---

# 18. Responsibility Boundaries

An Engine may request work from another Engine.

An Engine shall never execute another Engine's primary responsibility internally.

For example:

* the Search Engine may request semantic information from the Knowledge Engine;
* the Render Engine may request annotations from the Annotation Engine;
* the AI Engine may request context from the Search Engine.

Each Engine remains responsible only for its own capability.

---

# 19. Relationship to Other Documents

This document complements:

* DomainModel.md
* ArchitectureModel.md
* ArchitecturePrinciples.md
* ArchitectureDecisionMatrix.md

Implementation details are defined in the corresponding Engine specifications.

---

# 20. Related Documents

* DomainModel.md
* KnowledgeLifecycle.md
* ../01-Foundation/ArchitectureModel.md
* ../00-Governance/ArchitectureDecisionMatrix.md
* ../04-Platform/

---

# 21. Status

**Approved**

This document defines the official ownership model for all Platform Engines.

Every architectural capability shall have exactly one owning Engine. Responsibility boundaries defined here are mandatory and shall remain stable throughout Architecture Handbook v3.0.
