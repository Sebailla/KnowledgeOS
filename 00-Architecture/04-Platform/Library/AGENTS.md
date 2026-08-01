
# AGENTS.md

**Project:** KnowledgeOS

**Area:** Platform

**Engine:** Library Engine

**Path:** `00-Architecture/04-Platform/Library/`

**Document:** Library Engine Agent Guide

**Version:** 1.0

**Status:** Approved

**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the operational rules for every human or AI agent working on the Library Engine.

The Library Engine is the architectural owner of every concept related to libraries inside KnowledgeOS.

It defines **what a library is**.

It does **not** define how a library is stored.

It does **not** define synchronization transport.

It does **not** define database schemas.

It does **not** define filesystem layouts.

---

# 2. Scope

This document governs every architectural decision involving:

* Master Library
* Local Library
* Personal Library
* Library Catalog
* Library Membership
* Library Availability
* Library Lifecycle
* Library Discovery
* Library Registration
* Library Identity
* Library Metadata

---

# 3. Authority

The Library Engine owns:

* Library semantics
* Library lifecycle
* Library identity
* Library catalog
* Knowledge Object membership
* Library relationships
* Library availability
* Library hierarchy
* Library policies

The Library Engine does **not** own:

* Storage technology
* PostgreSQL
* NAS implementation
* Filesystem
* Synchronization transport
* AI
* Search
* Rendering
* Import
* Export

---

# 4. Architectural Model

KnowledgeOS distinguishes several library concepts.

```text
Master Library

↓

Local Library

↓

Personal Workspace

↓

Temporary Runtime State
```

These concepts shall never be merged.

Each has different authority.

---

# 5. Master Library

The Master Library is the authoritative repository of user knowledge.

Architectural properties:

* single authority
* globally unique
* persistent
* recoverable
* versioned
* synchronized

The Master Library shall remain the Source of Truth.

---

# 6. Master Library Invariants

The Master Library shall preserve:

* Knowledge Object identity
* asset identity
* annotation identity
* provenance
* version history
* relationships
* metadata

No Engine may silently bypass Master Library authority.

---

# 7. Local Library

A Local Library is a synchronized working copy.

Its purpose is:

* offline work
* local performance
* resilience
* portability

A Local Library shall never redefine architectural authority.

---

# 8. Local Library State

A Local Library may contain:

* synchronized objects
* pending objects
* cached objects
* temporary objects
* local metadata

These categories shall remain distinguishable.

---

# 9. Personal Workspace

The Personal Workspace represents the user's active environment.

It may include:

* temporary edits
* open documents
* undo history
* runtime state

Workspace state is not equivalent to Library state.

---

# 10. Library Identity

Every library shall possess:

* stable identifier
* owner
* creation timestamp
* version
* metadata

Identifiers shall never depend upon storage paths.

---

# 11. Knowledge Object Membership

Every Knowledge Object belongs to one authoritative library.

Additional references may exist.

Ownership shall remain unique.

---

# 12. Library Lifecycle

Every library shall define:

* creation
* initialization
* registration
* synchronization
* availability
* suspension
* recovery
* archival
* deletion

Deletion shall never silently destroy authoritative knowledge.

---

# 13. Library Availability

Availability states include:

```text
Available

Degraded

Offline

Recovering

Unavailable
```

Availability shall be observable.

---

# 14. Library Registration

Registration records:

* identity
* owner
* authority
* metadata
* capabilities
* synchronization information

Registration shall precede synchronization.

---

# 15. Library Metadata

Metadata may include:

* title
* description
* creation date
* owner
* tags
* statistics
* capabilities

Metadata shall never redefine library authority.

---

# 16. Library Relationships

Libraries may relate through:

* synchronization
* replication
* backup
* migration
* import

Relationships shall remain explicit.

---

# 17. Library Policies

Policies define:

* writable state
* synchronization permissions
* retention
* sharing
* visibility
* archival

Policies shall never contradict Product Vision.

---

# 18. Interaction with Storage

Storage owns persistence.

Library owns semantics.

Storage implementations shall satisfy Library contracts.

The Library Engine shall never expose storage implementation details.

---

# 19. Interaction with Synchronization

Synchronization moves library state.

Library defines what that state means.

These responsibilities shall remain separated.

---

# 20. Interaction with Search

Search indexes Library content.

Search does not own Library content.

Indexes remain derived state.

---

# 21. Interaction with Import

Import creates Knowledge Objects.

The Library Engine decides where they belong.

---

# 22. Interaction with Export

Export reads Library state.

Export never becomes Library authority.

---

# 23. Interaction with AI

AI may analyze Library content.

AI shall never redefine Library semantics.

AI-generated metadata remains derived.

---

# 24. Interaction with Plugins

Plugins access libraries only through public Library contracts.

Direct storage access is prohibited.

---

# 25. Offline First

The Library Engine shall preserve full offline usability whenever architecture allows.

Network connectivity shall never define library ownership.

---

# 26. Recoverability

Recoverability shall define:

* checkpoints
* backups
* restoration
* integrity validation

Recovery shall preserve identity.

---

# 27. Security

Library security shall define:

* ownership
* authorization
* access control
* auditability

---

# 28. Privacy

The Library Engine shall minimize unnecessary disclosure of user knowledge.

---

# 29. Testing

Testing shall verify:

* identity
* membership
* authority
* lifecycle
* recovery
* synchronization interaction
* storage interaction
* offline behavior

---

# 30. ADR Impact

Changes may affect:

* ADR-003
* ADR-004
* ADR-008
* ADR-009
* ADR-010
* ADR-013

---

# 31. Review Checklist

Before approval verify:

* Master Library authority preserved
* Local Library semantics preserved
* Identity preserved
* Membership preserved
* Storage boundary respected
* Synchronization boundary respected
* Offline-first preserved

---

# 32. Final Rule

The Library Engine defines **what a library means**.

It never defines **how a library is implemented**.

Every Knowledge Object belongs somewhere.

Every library has one authority.

Authority is never inferred from implementation.

The Master Library always remains the architectural Source of Truth.

---

# End of `AGENTS.md`
