
# Desktop Application Window Controllers

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Desktop UI

**Document:** Window Controllers

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative architecture for Window Controllers within the KnowledgeOS Desktop Application.

Window Controllers coordinate the interaction between the logical Workspace and native macOS windows.

They are orchestration components.

They never own Workspace state.

---

# 2. Scope

This document governs:

* Window Controller responsibilities;
* lifecycle;
* ownership;
* window coordination;
* projection synchronization;
* command routing;
* event handling;
* multi-window coordination;
* restoration participation;
* diagnostics;
* testing.

It does not define Workspace logic, rendering or native view implementation.

---

# 3. Objectives

Window Controllers shall:

* coordinate one logical Window;
* synchronize immutable projections;
* forward user interactions;
* isolate platform APIs;
* support multiple simultaneous windows;
* support restoration;
* remain lightweight;
* remain stateless whenever possible.

---

# 4. Architectural Position

```text
Workspace
      │
      ▼
Window Controller
      │
      ▼
Native Window
      │
      ▼
View Hierarchy
```

The Window Controller acts as an orchestration boundary.

---

# 5. Responsibilities

A Window Controller is responsible for:

* creating native windows;
* binding Workspace projections;
* coordinating View Controllers;
* routing Commands;
* observing Events;
* updating window metadata;
* coordinating restoration;
* exposing diagnostics.

Window Controllers never execute business logic.

---

# 6. Ownership

Each Window Controller owns only:

* native window reference;
* controller lifecycle;
* projection subscriptions;
* temporary UI coordination state.

Workspace state remains external.

---

# 7. One Controller per Window

Every logical Window shall have exactly one Window Controller.

A controller shall never manage multiple logical Windows.

---

# 8. Controller Lifecycle

```text
Created
    ↓
Initialized
    ↓
Bound
    ↓
Visible
    ↓
Active
    ↓
Hidden
    ↓
Disposed
```

Disposed controllers shall release every native resource.

---

# 9. Initialization

Initialization includes:

* creating the native window;
* binding projections;
* creating the root View Controller;
* registering Commands;
* subscribing to Events.

Initialization shall not modify Workspace state.

---

# 10. Projection Binding

The controller consumes immutable Window projections.

Projection updates trigger UI refresh.

Controllers shall never mutate projections.

---

# 11. Command Routing

User interaction follows this flow:

```text
User
    ↓
Native Control
    ↓
Window Controller
    ↓
Application Command
    ↓
Workspace
```

Every state mutation originates from a Command.

---

# 12. Event Subscription

Controllers may observe:

* WindowUpdated;
* LayoutChanged;
* SelectionChanged;
* NavigationChanged;
* ThemeChanged;
* AccessibilityChanged.

Events trigger projection refresh only.

---

# 13. View Coordination

The Window Controller coordinates:

* Root View Controller;
* Toolbar;
* Sidebar;
* Inspector;
* Status Bar;
* Dialog Coordinator.

Individual views remain independent.

---

# 14. Window Metadata

Controllers maintain transient metadata such as:

* native window identifier;
* visibility;
* focus state;
* display assignment;
* fullscreen status;
* minimized state.

These values are not authoritative Workspace state.

---

# 15. Multi-Window Coordination

Each Window Controller operates independently.

Shared Workspace state is synchronized through immutable projections.

Controllers never communicate directly with each other.

---

# 16. Focus Management

Controllers coordinate native focus changes.

Logical focus remains owned by the Workspace.

---

# 17. Window Activation

Activation shall:

* update native focus;
* refresh projections;
* synchronize menus;
* synchronize toolbars.

Activation does not modify Workspace ownership.

---

# 18. Window Closure

Closing a window shall:

* notify the Workspace;
* dispose subscriptions;
* release native resources;
* preserve persisted state when applicable.

Forced termination shall invoke Workspace Recovery if required.

---

# 19. Restoration Participation

During Workspace Restoration, Window Controllers shall:

1. receive restored Window descriptors;
2. create native windows;
3. bind projections;
4. initialize View Controllers;
5. become visible only after successful restoration.

Controllers never restore Workspace state themselves.

---

# 20. Error Handling

Controller failures shall:

* remain localized;
* preserve Workspace integrity;
* release native resources safely;
* emit diagnostics.

A failed Window Controller shall not affect unrelated windows.

---

# 21. Threading Model

Window Controllers execute on the UI thread.

Background work shall be delegated to appropriate services.

UI updates shall always return to the main thread.

---

# 22. Plugin Integration

Plugins may contribute:

* window content;
* toolbars;
* side panels;
* contextual actions.

Plugins shall never replace the Window Controller lifecycle.

---

# 23. Accessibility

Controllers shall coordinate:

* accessibility focus;
* accessibility notifications;
* keyboard traversal;
* semantic updates.

Accessibility behavior shall remain synchronized with Workspace projections.

---

# 24. Diagnostics

Diagnostics should include:

* Window Identity;
* Controller Identity;
* Projection Version;
* active subscriptions;
* rendering latency;
* restoration state.

---

# 25. Performance

Controllers shall support:

* incremental projection updates;
* lazy initialization;
* minimal view invalidation;
* bounded subscriptions;
* efficient disposal.

---

# 26. Testing

Tests shall verify:

* controller lifecycle;
* projection synchronization;
* command routing;
* event handling;
* restoration;
* multi-window behavior;
* accessibility coordination;
* resource disposal.

---

# 27. Architectural Invariants

The following invariants are mandatory:

* one Window Controller manages exactly one logical Window;
* Workspace remains authoritative;
* controllers never own business state;
* all state mutations occur through Commands;
* projections are immutable;
* native windows never become authoritative;
* controllers remain lightweight;
* controller disposal releases every native resource.

---

# 28. Related Documents

* `README.md`
* `UIArchitecture.md`
* `ViewHierarchy.md`
* `ViewComposition.md`
* `ViewLifecycle.md`
* `RenderingPipeline.md`
* `LayoutProjection.md`
* `WorkspaceRestoration.md`
* `WorkspaceRecovery.md`

---

# 29. Status

**Approved**

This document establishes the authoritative architecture for Window Controllers within the KnowledgeOS Desktop Application.

Window Controllers coordinate the interaction between immutable Workspace projections and native macOS windows while preserving strict separation between presentation, application logic and platform implementation. They act exclusively as orchestration components and never become the authoritative owner of Workspace state.
