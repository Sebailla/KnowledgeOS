
# Library Engine

**Project:** KnowledgeOS

**Section:** Platform

**Engine:** Library

**Document:** Engine Architecture

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architecture of the Library Engine.

The Library Engine organizes Document Digital Twins into user-defined organizational structures.

The Library Engine never owns canonical knowledge.

It owns only organizational metadata.

---

# 2. Scope

The Library Engine governs:

* collections;
* folders;
* tags;
* workspaces;
* favorites;
* organizational views;
* user organization metadata.

The Library Engine does not govern:

* canonical knowledge;
* rendering;
* search indexing;
* synchronization;
* artificial intelligence;
* document import.

---

# 3. Position within the Platform

The Library Engine provides organizational capabilities built upon canonical knowledge.

```text
          Knowledge Engine
                 │
                 ▼
          Library Engine
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
 Collections  Tags  Workspaces
```

The Knowledge Engine remains the authoritative owner of every Document Digital Twin.

---

# 4. Mission

The mission of the Library Engine is to provide flexible, user-centric organization of knowledge without modifying the underlying canonical models.

Organization is personal.

Knowledge is canonical.

---

# 5. Design Philosophy

The Library Engine organizes references to knowledge.

It never organizes files.

It never owns canonical information.

---

# 6. Architectural Goals

The Library Engine shall:

* support multiple organizational models;
* preserve canonical independence;
* remain technology-independent;
* support scalable organization;
* support user customization;
* remain extensible.

---

# 7. Primary Managed Artifact

The primary managed artifact is the **Library Reference**.

A Library Reference links organizational structures to a Document Digital Twin.

A Library Reference never contains canonical knowledge.

---

# 8. Organizational Structures

The Library Engine supports multiple organizational structures including:

* folders;
* collections;
* smart collections;
* tags;
* favorites;
* workspaces;
* custom organizational groups.

These structures may coexist.

No single structure is authoritative.

---

# 9. Collection Model

Collections contain references to Document Digital Twins.

Collections never duplicate knowledge.

A single Digital Twin may belong to multiple collections simultaneously.

---

# 10. Smart Collections

Smart Collections are dynamic organizational views.

Their content is determined by explicit queries rather than manual membership.

Examples include:

* Recently Imported
* Favorites
* Scientific Papers
* Medical Articles
* Documents Tagged "Research"

Membership changes automatically as the underlying knowledge evolves.

---

# 11. Relationship with the Knowledge Engine

The Library Engine consumes Document Digital Twin identifiers and metadata.

Canonical knowledge remains exclusively managed by the Knowledge Engine.

The Library Engine never modifies canonical models.

---

# 12. Relationship with the Kernel

The Library Engine delegates execution through:

* Commands;
* Queries;
* Events;
* Workflows.

Execution coordination belongs to the Kernel.

---

# 13. Relationship with Other Engines

The Library Engine may request capabilities from other Engines through Kernel contracts.

It never invokes Platform Engines directly.

Direct Engine coupling is prohibited.

---

# 14. Engine Boundaries

The Library Engine owns:

* organizational structures;
* organizational metadata;
* user-defined grouping;
* organizational preferences.

It never owns:

* canonical models;
* search indexes;
* rendering;
* synchronization;
* AI metadata.

---

# 15. Success Criteria

A Library operation is successful when organizational metadata remains internally consistent while canonical knowledge remains unchanged.

Organizational flexibility shall never compromise canonical integrity.

---



# 16. Library Reference Model

The Library Engine organizes knowledge exclusively through Library References.

A Library Reference associates organizational metadata with a Document Digital Twin.

References never contain canonical knowledge.

References remain lightweight and replaceable.

---

# 17. Organizational Metadata

Organizational metadata includes:

* collection membership;
* folder membership;
* tags;
* favorites;
* workspace membership;
* user-defined classifications;
* display preferences.

Organizational metadata never modifies canonical models.

---

# 18. Folder Model

Folders provide hierarchical organization.

Folders contain Library References.

Folders never contain Document Digital Twins directly.

Folder hierarchy is optional.

Alternative organizational models may coexist.

---

# 19. Collection Model

Collections represent logical groups of Library References.

Collections are independent from physical storage.

Collections support:

* manual membership;
* generated membership;
* shared organizational rules.

Collections never duplicate knowledge.

---

# 20. Smart Collections

Smart Collections are persistent queries.

Membership is determined dynamically.

Typical criteria include:

* document type;
* creation date;
* modification date;
* tags;
* author;
* language;
* document status;
* workspace;
* custom metadata.

Smart Collections remain continuously synchronized with canonical knowledge.

---

# 21. Tag Model

Tags provide non-hierarchical classification.

A Library Reference may contain multiple Tags.

Tags support flexible cross-cutting organization.

Tags remain independent from canonical knowledge.

---

# 22. Workspace Model

Workspaces organize Library References according to user goals.

Typical Workspaces include:

* Research;
* Medical Practice;
* Personal Knowledge;
* Education;
* Publications.

A Document Digital Twin may participate in multiple Workspaces simultaneously.

---

# 23. Favorites

Favorites represent personal organizational preferences.

Favorite status belongs to the Library Engine.

Favorite status never modifies canonical knowledge.

---

# 24. Organizational Queries

The Library Engine supports organizational queries including:

* Browse Collection;
* Browse Folder;
* Browse Workspace;
* Browse Tag;
* Browse Favorites;
* Browse Recent Documents.

Organizational queries return Library References.

Canonical retrieval belongs to the Knowledge Engine.

---

# 25. Commands

Typical Commands include:

* CreateCollection;
* DeleteCollection;
* CreateFolder;
* MoveReference;
* AddTag;
* RemoveTag;
* CreateWorkspace;
* AddFavorite;
* RemoveFavorite.

Commands modify organizational metadata only.

---

# 26. Events

Typical Events include:

* CollectionCreated;
* CollectionDeleted;
* FolderCreated;
* ReferenceMoved;
* TagAdded;
* TagRemoved;
* WorkspaceCreated;
* FavoriteAdded;
* FavoriteRemoved.

Events describe completed organizational changes.

---

# 27. Queries

Typical Queries include:

* GetCollection;
* GetWorkspace;
* GetFolder;
* GetFavorites;
* GetRecentDocuments;
* GetTaggedDocuments.

Queries never modify organizational state.

---

# 28. Concurrency

Concurrent organizational operations shall preserve:

* reference consistency;
* organizational integrity;
* workspace integrity;
* collection integrity.

Organizational conflicts never affect canonical knowledge.

---

# 29. Security

Organizational permissions are evaluated through the Execution Context.

The Library Engine never owns authentication or identity management.

Authorization affects organizational metadata only.

---

# 30. Observability

Organizational operations expose telemetry including:

* collection operations;
* workspace operations;
* organizational query performance;
* reference counts;
* tag utilization.

Telemetry remains operational.

It never becomes canonical knowledge.

---

# 31. Engine Invariants

The following invariants apply.

* The Library Engine owns organizational metadata.
* The Library Engine never owns canonical knowledge.
* Collections contain references only.
* Folders contain references only.
* Smart Collections are query-based.
* Organizational metadata remains independent.
* References never duplicate knowledge.
* Canonical integrity is never affected by organization.

---

# 32. Related Documents

* LibraryArchitecture.md
* Collections.md
* Workspaces.md
* SmartCollections.md
* Tags.md
* Commands.md
* Events.md
* Queries.md
* ../Knowledge/README.md
* ../../02-Domain/KnowledgeObject/

---

# 33. Status

**Approved**

This document defines the architectural model of the Library Engine.

The Library Engine provides flexible, user-defined organization of Document Digital Twins through lightweight references while preserving complete separation between organizational metadata and canonical knowledge.
