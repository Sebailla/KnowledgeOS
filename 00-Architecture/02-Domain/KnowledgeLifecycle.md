# Knowledge Lifecycle

**Project:** KnowledgeOS

**Section:** Domain

**Document:** Knowledge Lifecycle

**Version:** 3.1

**Status:** Approved

---

# 1. Purpose

This document defines the lifecycle of every Knowledge Object, publication and user-generated knowledge managed by KnowledgeOS.

The lifecycle is independent of storage technologies and execution platforms.

---

# 2. Scope

This document applies to:

- Master Library
- Local Libraries
- Knowledge Objects
- UDM
- DPM
- Personal Knowledge
- Workflow Engine
- Import Engine
- Library Engine
- Sync Engine

---

# 3. Lifecycle Model

KnowledgeOS defines three independent lifecycles:

1. Publication Lifecycle
2. Personal Knowledge Lifecycle
3. Canonical Processing Lifecycle

These lifecycles interact but never replace each other.

---

# 4. Publication Lifecycle

States:

1. Discovered
2. Imported
3. Validated
4. Registered
5. Published (Master Library)
6. Acquired (Local Library)
7. Archived
8. Removed

Rules:

- Import does not imply acquisition.
- Acquisition does not modify the Master Library.
- A publication may exist in the Master Library without existing in any Local Library.
- Removal from one Local Library does not remove the publication from the Master Library.

---

# 5. Personal Knowledge Lifecycle

States:

1. Created
2. Modified
3. Stored Locally
4. Pending Synchronization
5. Synchronized
6. Merged
7. Historical

Rules:

- Personal Knowledge belongs to the user.
- Personal Knowledge never becomes part of the Master Library.
- Synchronization distributes only personal state.
- Conflicts are resolved by Sync Engine policies.

Examples:

- annotations
- highlights
- bookmarks
- notes
- collections
- reading progress
- AI conversations

---

# 6. Canonical Processing Lifecycle

Flow:

Source Publication

↓

Extraction

↓

Classification

↓

Canonical UDM

↓

Canonical DPM

↓

Knowledge Graph

↓

Indexes

↓

Derived Artifacts

Rules:

- Source publications remain authoritative.
- UDM and DPM are canonical models.
- Indexes and embeddings are derived artifacts.
- Derived artifacts are rebuildable.

---

# 7. Lifecycle Events

Publication:

- PublicationImported
- PublicationValidated
- PublicationRegistered
- PublicationAcquired
- PublicationArchived
- PublicationRemoved

Personal:

- AnnotationCreated
- AnnotationUpdated
- BookmarkCreated
- ReadingProgressUpdated
- CollectionModified
- PersonalStateSynchronized

Processing:

- CanonicalizationStarted
- CanonicalizationCompleted
- IndexGenerated
- EmbeddingGenerated

---

# 8. Invariants

- Publication identity is immutable.
- Knowledge Object identity is immutable.
- Personal Knowledge never changes publication authority.
- Acquisition is explicit.
- Synchronization never transfers publication ownership.
- Derived artifacts never become canonical.

---

# 9. Failure Recovery

The architecture supports recovery through:

- replayable workflows;
- idempotent operations;
- publication reacquisition;
- personal-state synchronization;
- regeneration of indexes, embeddings and thumbnails.

---

# 10. Relationship with Engines

Import Engine:
imports publications.

Library Engine:
manages Master and Local Libraries.

Workflow Engine:
coordinates transitions.

Sync Engine:
synchronizes personal knowledge.

Search Engine:
rebuilds indexes.

AI Engine:
creates optional derived artifacts.

---

# 11. Status

Approved.

This document supersedes previous lifecycle models based on a single synchronized library and aligns KnowledgeOS with ADR-013 and the Architecture V3 domain model.
