
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Desktop Application
**Path:** `01-Implementation/02-DesktopApplication/`
**Document:** Desktop Application Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Project Owner

---

# 1. Purpose

This document defines the implementation rules for every human or AI agent working inside:

```text
01-Implementation/
└── 02-DesktopApplication/
```

The Desktop Application is the primary user interface of KnowledgeOS.

Its responsibility is to provide a fast, intuitive and native user experience while preserving every architectural constraint defined by the platform.

The Desktop Application shall never become the owner of user knowledge.

Knowledge ownership belongs exclusively to the Master Library.

---

# 2. Scope

This document governs every implementation contained inside the Desktop Application module.

Including:

- User Interface
- Navigation
- Workspace
- Windows
- Editors
- Viewers
- Commands
- Menus
- Panels
- Search UI
- Annotation UI
- Settings
- Preferences
- Local Cache
- View Models
- Application State
- User Interaction
- Accessibility
- Native Integrations

Future submodules inherit this document unless a more specific AGENTS.md exists.

---

# 3. Inheritance

This document inherits every rule defined by:

Repository AGENTS

↓

Architecture AGENTS

↓

Implementation AGENTS

↓

Master Library Contracts

This document only defines Desktop-specific implementation rules.

Whenever a conflict exists, higher-level documentation prevails.

---

# 4. Module Responsibilities

The Desktop Application owns:

- application lifecycle;
- window management;
- navigation;
- workspace management;
- visual rendering;
- user interaction;
- document presentation;
- editing workflows;
- application commands;
- user preferences;
- local session state;
- platform integration;
- notifications;
- accessibility.

The Desktop Application does not own:

- persistent storage;
- synchronization;
- repository integrity;
- metadata authority;
- object identities;
- AI providers;
- plugin persistence.

---

# 5. Architectural Role

The Desktop Application is a consumer of platform services.

It orchestrates user workflows.

It does not implement repository rules.

It does not implement synchronization rules.

It does not implement storage semantics.

Its responsibility is coordination rather than ownership.

---

# 6. Mandatory Reading Order

Before modifying this module every agent shall review:

1. Repository AGENTS
2. Architecture AGENTS
3. Implementation AGENTS
4. Desktop Application AGENTS
5. Product Vision
6. Architecture Principles
7. UI Architecture
8. Workspace documentation
9. Public Contracts
10. Affected implementation documents

Implementation shall always follow approved architecture.

---

# 7. Desktop Principles

Every implementation shall preserve:

- Native User Experience
- Offline First
- Immediate Feedback
- Predictable Behavior
- Accessibility
- Performance
- Stability
- Recoverability
- Consistency
- User Control

The Desktop Application exists to expose knowledge, never to own it.

---

# 8. Native Experience

KnowledgeOS shall behave as a first-class macOS application.

Implementation shall respect native platform conventions whenever practical.

The application shall feel consistent with the operating system rather than imitating web interfaces.

Native controls shall be preferred over custom implementations unless there is a measurable architectural or usability benefit.

---

# 9. Offline First

Every workflow shall assume that remote services may be unavailable.

The Desktop Application shall remain operational while disconnected.

Operations requiring synchronization shall be queued without interrupting the user's work.

Network availability shall enhance the experience but shall never define the application's basic usability.

---

# 10. User Interaction

User interaction shall be:

- responsive;
- deterministic;
- undoable whenever applicable;
- discoverable;
- keyboard friendly;
- accessible.

The interface shall minimize unnecessary interruptions.

Long-running operations shall expose progress and cancellation whenever technically possible.

---

# 11. Application State

The Desktop Application owns transient application state only.

Examples include:

- open windows;
- selected objects;
- current workspace;
- temporary filters;
- expanded panels;
- navigation history;
- active tools.

Persistent knowledge shall remain in the Master Library.

---

# 12. Workspace

The Workspace represents the user's current working context.

It may include:

- opened documents;
- collections;
- search sessions;
- notes;
- temporary layouts;
- comparison views.

Workspace state shall be recoverable after unexpected application termination.

Workspace recovery shall never modify repository contents.
