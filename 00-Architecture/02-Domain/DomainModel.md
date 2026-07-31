# Domain Model

**Project:** KnowledgeOS

**Section:** Domain

**Document:** Domain Model

**Version:** 3.1

**Status:** Approved

---

# 1. Purpose

This document defines the conceptual domain model of KnowledgeOS.

It identifies the primary business concepts, their relationships, ownership boundaries and lifecycle rules independently of implementation technologies.

The Domain Model is the semantic foundation of the platform.

---

# 2. Core Principles

The Domain is technology independent.

The Domain shall not depend on:

- databases
- UI frameworks
- operating systems
- AI providers
- storage engines
- synchronization technologies

---

# 3. Top-Level Domain

```
Knowledge Space
│
├── Master Library
│
├── Local Libraries
│
├── Personal Knowledge
│
├── Workspaces
│
└── Knowledge Graph
```

Knowledge Space represents the complete logical knowledge owned by the user.

---

# 4. Master Library

The Master Library is hosted by the KnowledgeOS Server running on the user's NAS.

Responsibilities:

- Master Catalog
- Source publications
- Publication metadata
- Publication versions
- Publication delivery

The Master Library is authoritative only for publication-related information.

It never stores personal knowledge.

---

# 5. Local Library

Every client owns an independent Local Library.

A Local Library:

- contains only acquired publications;
- supports complete offline operation;
- maintains local indexes;
- maintains derived artifacts;
- stores local working state.

Local Libraries are not replicas of the Master Library.

---

# 6. Personal Knowledge

Personal Knowledge represents user-created information.

Examples include:

- annotations
- highlights
- bookmarks
- reading progress
- collections
- notes
- AI conversations
- AI summaries
- Apple Pencil annotations

Personal Knowledge is synchronized independently of publication acquisition.

---

# 7. Knowledge Object

A Knowledge Object is the fundamental business entity.

It has:

- immutable identity
- provenance
- lifecycle
- metadata
- relationships
- assets

Knowledge Objects exist independently of storage technologies.

---

# 8. Canonical Models

KnowledgeOS defines two canonical models.

## UDM

Canonical semantic representation.

## DPM

Canonical presentation representation.

Neither replaces the original publication.

---

# 9. Authority Model

Authority is defined by information scope.

| Scope | Authority |
|-------|-----------|
| Publications | Master Library |
| Local availability | Local Library |
| Personal knowledge | Originating device until synchronized |
| Derived artifacts | None |

---

# 10. Domain Invariants

The following invariants shall always hold.

1. A publication belongs to exactly one Master Library.
2. Local Libraries never become canonical.
3. Acquisition is explicit.
4. Synchronization never transfers publication ownership.
5. Personal Knowledge never enters the Master Library.
6. Derived artifacts are rebuildable.
7. Knowledge Object identity is immutable.
8. Canonical models remain technology independent.

---

# 11. Domain Events

- PublicationAcquired
- PublicationRemoved
- AnnotationCreated
- AnnotationUpdated
- BookmarkCreated
- ReadingProgressUpdated
- CollectionModified
- PersonalStateSynchronized

---

# 12. Relationships

- Master Library manages Publications.
- Local Libraries acquire Publications.
- Publications generate Knowledge Objects.
- Knowledge Objects are represented by UDM and DPM.
- Personal Knowledge references Knowledge Objects.
- Knowledge Graph connects Knowledge Objects.

---

# 13. Status

Approved.

This document supersedes previous Domain models based on a single synchronized Knowledge Library and aligns the domain with ADR-013, scoped authority, explicit acquisition and personal-state synchronization.
