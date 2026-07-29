
# Desktop Application Workspace Recent Items

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Workspace

**Document:** Recent Items

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative implementation model for the Recent Items subsystem within the KnowledgeOS Desktop Application.

Recent Items provide fast access to knowledge objects, documents, searches, collections, workspaces, and other user-relevant entities that have been recently accessed or modified.

Recent Items are a derived Workspace projection.

They are not the authoritative source of user activity, navigation history, or knowledge ownership.

---

# 2. Scope

This document governs:

* Recent Item identity;
* ownership;
* Recent Item registry;
* categorization;
* ranking;
* recency model;
* pinning;
* favorites interaction;
* filtering;
* grouping;
* persistence;
* restoration;
* privacy;
* plugin contributions;
* synchronization awareness;
* Commands;
* Events;
* Queries;
* testing.

It does not define Navigation History, Activity History, Favorites or Library indexing.

---

# 3. Objectives

The Recent Items subsystem shall:

* provide quick access to recently used entities;
* remain deterministic;
* avoid duplicate entries;
* support multiple item categories;
* support pinning;
* preserve privacy;
* remain lightweight;
* support restoration;
* support plugin extensions;
* avoid becoming an activity log.

---

# 4. Definition

A Recent Item is a lightweight reference to a recently relevant entity.

A Recent Item may reference:

* Knowledge Object;
* document;
* asset;
* collection;
* Workspace;
* search;
* annotation;
* graph;
* AI conversation;
* plugin-defined resource.

The Recent Items list never owns those entities.

---

# 5. Ownership

Recent Items belong to the Workspace.

The Workspace owns:

* Recent Item registry;
* ordering;
* ranking metadata;
* persistence;
* retention policy.

Editors, Panels and Plugins may propose updates but never mutate the registry directly.

---

# 6. Recent Items Aggregate

```text
RecentItemsState
│
├── WorkspaceIdentity
├── RecentItemRegistry
├── OrderingPolicy
├── RetentionPolicy
├── PinRegistry
├── Filters
├── PersistenceMetadata
└── Version
```

---

# 7. Recent Item Descriptor

Every Recent Item shall contain:

* Recent Item Identity;
* Target Identity;
* Target Type;
* Display Label Key;
* Last Access Timestamp;
* Access Sequence Number;
* Source Context;
* Pin State;
* Privacy Classification;
* Plugin Namespace (optional);
* Schema Version.

The descriptor shall remain lightweight.

---

# 8. Categories

Core categories include:

* Documents;
* Knowledge Objects;
* Collections;
* Assets;
* Searches;
* Annotations;
* Graph Views;
* AI Conversations;
* Workspaces;
* Plugin Resources.

---

# 9. Ranking

Ranking may consider:

* recency;
* access frequency;
* pin state;
* user preference;
* Workspace policy.

The algorithm shall be deterministic.

---

# 10. Pinning

Pinned items:

* remain visible independently of recency;
* preserve explicit ordering;
* are not removed by retention;
* do not alter authoritative ownership.

---

# 11. Duplicate Prevention

Only one Recent Item entry shall exist for the same logical target within the same Workspace.

Repeated access updates the existing descriptor.

---

# 12. Retention

Retention policy may define:

* maximum entries;
* maximum age;
* maximum storage size;
* category limits.

Eviction shall be deterministic.

---

# 13. Updates

Recent Items may be updated after:

* opening a document;
* navigating to a Knowledge Object;
* opening a collection;
* successful search execution;
* opening an AI conversation;
* plugin-defined operations.

Background indexing shall not create Recent Items.

---

# 14. Commands

Representative Commands include:

* RegisterRecentItem;
* RemoveRecentItem;
* PinRecentItem;
* UnpinRecentItem;
* ClearRecentItems;
* ApplyRetentionPolicy.

---

# 15. Events

Representative Events include:

* RecentItemRegistered;
* RecentItemUpdated;
* RecentItemPinned;
* RecentItemUnpinned;
* RecentItemRemoved;
* RecentItemsCleared;
* RetentionApplied.

---

# 16. Queries

Representative Queries include:

* GetRecentItems;
* GetRecentItemsByCategory;
* GetPinnedItems;
* GetRecentItem;
* CanPinRecentItem.

Queries return immutable projections.

---

# 17. Persistence

Recent Items may be persisted as Workspace preferences.

Persistence shall include only:

* stable identities;
* ordering;
* timestamps;
* pin state;
* lightweight metadata.

Full entity data shall never be duplicated.

---

# 18. Restoration

During Workspace restoration:

1. restore registry;
2. validate identities;
3. remove invalid entries;
4. apply retention;
5. restore pinned ordering;
6. publish restoration diagnostics.

Invalid Recent Items shall not block restoration.

---

# 19. Privacy

Privacy policy may:

* disable persistence;
* redact titles;
* exclude AI conversations;
* exclude private Workspaces;
* clear entries on Workspace closure.

Recent Items shall respect Workspace privacy classification.

---

# 20. Plugins

Plugins may contribute Recent Items through Plugin SDK contracts.

Plugin descriptors shall declare:

* target identity;
* category;
* display metadata;
* serialization schema;
* privacy classification.

Missing plugins shall not prevent Workspace startup.

---

# 21. Performance

Implementation shall support:

* O(1) lookup by identity;
* incremental updates;
* bounded storage;
* lazy loading;
* efficient filtering.

---

# 22. Testing

Tests shall verify:

* duplicate prevention;
* ranking;
* pinning;
* retention;
* persistence;
* restoration;
* plugin items;
* privacy policies.

---

# 23. Architectural Invariants

The following invariants are mandatory:

* every Recent Item references one stable target;
* Recent Items never own authoritative knowledge;
* duplicates are prohibited;
* ranking is deterministic;
* pinning does not modify recency;
* persistence remains bounded;
* plugin entries use approved SDK contracts;
* invalid entries never block restoration.

---

# 24. Related Documents

* `History.md`
* `Navigation.md`
* `Selection.md`
* `WorkspaceRestoration.md`
* `WorkspaceRecovery.md`
* `Layout.md`
* `Plugin SDK Contracts`

---

# 25. Status

**Approved**

This document establishes the authoritative implementation model for the Recent Items subsystem within the KnowledgeOS Desktop Application.

Recent Items provide a lightweight, deterministic and privacy-aware projection of recently accessed entities. They are Workspace-owned derived state, independent from Navigation History, Activity History and authoritative knowledge storage.
