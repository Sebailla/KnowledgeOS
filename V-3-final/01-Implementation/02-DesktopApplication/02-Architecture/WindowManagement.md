
# Desktop Application Window Management

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Architecture

**Document:** Window Management

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architecture, responsibilities, lifecycle and invariants of window management within the KnowledgeOS Desktop Application.

A window is a platform-specific projection of Workspace-owned state.

Window Management coordinates native windows without allowing platform objects or visual components to become independent sources of application state.

---

# 2. Scope

This document governs:

* window identity;
* window lifecycle;
* window ownership;
* native window binding;
* window creation and destruction;
* focus and activation;
* window placement;
* layout restoration;
* multi-window behavior;
* tab ownership;
* panel composition;
* full-screen behavior;
* display changes;
* window commands and events;
* failure recovery;
* platform adaptation.

It does not define tab implementation, editor internals or authoritative knowledge persistence.

---

# 3. Objectives

Window Management shall:

* support multiple independent windows;
* preserve Workspace state ownership;
* isolate native platform APIs;
* provide deterministic restoration;
* maintain consistent focus behavior;
* support native macOS conventions;
* allow future platform-specific projections;
* prevent window-related state fragmentation;
* support safe window recovery;
* remain independently testable.

---

# 4. Window Definition

A window is an application surface associated with exactly one Workspace.

A window presents a projection of:

* Workspace state;
* tabs;
* editors;
* panels;
* navigation;
* active context;
* layout.

The native operating system window is an implementation resource.

The Workspace Window State is the architectural source of truth.

---

# 5. Architectural Position

Window Management operates between the Workspace model and the native platform.

```text
Workspace
    │
    ▼
Window State
    │
    ▼
Window Manager
    │
    ▼
Platform Adapter
    │
    ▼
Native Window
```

The native window shall not mutate Workspace state directly.

All meaningful changes shall be translated through approved Window Management operations.

---

# 6. Window Ownership

Each window shall be owned by exactly one Workspace.

The Application Runtime owns the Workspace.

The Workspace owns Window State.

The Window Manager owns the coordination lifecycle of the corresponding native window resource.

```text
Application Runtime
    └── Workspace
        └── Window State
            └── Native Window Binding
```

A native window binding shall never outlive its owning Workspace Window State.

---

# 7. High-Level Model

```text
WindowState
│
├── WindowIdentity
├── WorkspaceIdentity
├── LifecycleState
├── FrameState
├── DisplayState
├── TabRegistry
├── ActiveTab
├── PanelState
├── LayoutState
├── NavigationContext
├── FocusState
├── PresentationState
├── RestorationMetadata
└── WindowVersion
```

Live platform objects are maintained separately by the Window Manager.

---

# 8. Window Identity

Every window shall have a stable identity within its Workspace.

Window identity shall:

* be unique within the Workspace;
* remain stable during restoration;
* support diagnostics;
* support command routing;
* support event correlation;
* support tab association;
* remain independent from native window handles.

A native window identifier shall not replace the architectural Window Identity.

---

# 9. Native Window Binding

The Window Manager shall maintain a temporary binding between:

* Window Identity;
* Workspace Identity;
* native window resource;
* platform scene or surface identifier;
* lifecycle state.

The binding shall remain internal to the platform integration layer.

It shall not be serialized as part of Workspace state.

---

# 10. Window Lifecycle

A window may occupy the following states:

| State      | Meaning                                        |
| ---------- | ---------------------------------------------- |
| Defined    | Window State exists                            |
| Creating   | Native resources are being created             |
| Restoring  | Previous state is being reconstructed          |
| Ready      | Window is valid and available                  |
| Visible    | Window is displayed                            |
| Active     | Window receives primary user interaction       |
| Inactive   | Window remains visible without primary focus   |
| Hidden     | Window remains registered but is not visible   |
| FullScreen | Window occupies a platform full-screen context |
| Closing    | Window is preparing for closure                |
| Closed     | Native resources have been released            |
| Recovering | Window state is being repaired                 |
| Failed     | Window cannot continue safely                  |

Invalid lifecycle transitions shall be rejected.

---

# 11. Window Creation

Window creation shall:

1. validate the owning Workspace;
2. create a Window Identity;
3. create initial Window State;
4. select a layout descriptor;
5. request a native window from the Platform Adapter;
6. bind the native resource;
7. compose the visual hierarchy;
8. register the window in the Workspace;
9. determine its initial active context;
10. publish a completion event.

The native window shall not become interactive before minimum state binding is complete.

---

# 12. Window Restoration

Window restoration shall:

1. load the Window Descriptor;
2. validate its schema;
3. validate Workspace ownership;
4. validate display placement;
5. normalize unsupported frame values;
6. reconstruct tabs;
7. reconstruct panel configuration;
8. restore the active tab;
9. restore navigation context;
10. create and bind the native window;
11. publish restoration results.

Invalid platform-specific placement shall be replaced with a safe default.

---

# 13. Window Closing

Closing a window shall:

1. mark the Window State as Closing;
2. stop accepting new window-scoped commands;
3. inspect active editor operations;
4. preserve restorable tab and layout state;
5. request required checkpoints;
6. detach panels;
7. dispose of editor and view resources;
8. release the native window;
9. remove the Window State from the Workspace registry;
10. publish a closure event.

Closing the final window shall not automatically delete or corrupt the Workspace.

Application termination behavior remains a separate policy decision.

---

# 14. Window Manager

Window Manager is the application service responsible for window coordination.

Its responsibilities include:

* creating windows;
* restoring windows;
* binding native windows;
* showing and hiding windows;
* coordinating focus;
* applying frame changes;
* handling display transitions;
* closing windows;
* disposing of resources;
* publishing window events.

Window Manager shall not own persistent Window State.

---

# 15. Platform Adapter Relationship

The Platform Adapter encapsulates native window APIs.

It shall expose application-oriented operations such as:

* create window;
* show window;
* hide window;
* activate window;
* close window;
* apply frame;
* enter full screen;
* exit full screen;
* retrieve display information;
* observe platform lifecycle events.

Native framework objects shall not be exposed to Workspace models.

---

# 16. Window Registry

Each Workspace shall maintain a Window Registry.

The registry shall support:

* identity lookup;
* enumeration;
* active window resolution;
* insertion;
* removal;
* restoration ordering;
* focus history;
* ownership validation.

The registry shall reject duplicate Window Identities.

---

# 17. Active Window

A Workspace may have one active window at a time.

The active window is determined from:

* platform focus;
* Workspace activation;
* modal state;
* restoration state;
* explicit activation commands.

A Workspace may temporarily have no active window.

The active window shall be derived from valid Window State and platform signals.

---

# 18. Focus Model

Focus shall be explicit and hierarchical.

```text
Application Focus
    └── Active Workspace
        └── Active Window
            └── Active Tab
                └── Active Editor
                    └── Focused Element
```

Each focus level shall resolve independently.

Loss of element focus shall not necessarily deactivate the window.

---

# 19. Focus Transitions

Focus transitions shall:

* update Active Context;
* preserve selection where appropriate;
* update command availability;
* update menu and toolbar projections;
* publish focus events;
* avoid hidden state duplication.

Rapid platform focus changes shall be normalized into valid application transitions.

---

# 20. Window Activation

Window activation may result from:

* user selection;
* application launch;
* Workspace activation;
* deep-link navigation;
* restoration;
* command execution;
* operating system behavior.

Activation shall not automatically mutate knowledge or navigation unless explicitly requested.

---

# 21. Window Frame State

Window Frame State may include:

* position;
* width;
* height;
* display identity;
* safe-area adjustments;
* zoomed state;
* minimized state;
* full-screen state;
* restoration priority.

Frame State shall be expressed in a platform-neutral form where practical.

---

# 22. Display State

Display State describes the environment in which a window is projected.

It may include:

* display identity;
* visible bounds;
* scale factor;
* orientation;
* color characteristics;
* safe areas;
* display availability.

Display identities may change between application sessions.

Restoration shall never assume that a previous display still exists.

---

# 23. Placement Validation

Before applying a restored frame, Window Management shall verify that:

* the referenced display exists;
* the frame intersects a visible display;
* minimum size requirements are satisfied;
* title-bar controls remain reachable;
* platform safe areas are respected.

Invalid placement shall be normalized.

---

# 24. Window Size Constraints

Every window may define:

* minimum width;
* minimum height;
* preferred width;
* preferred height;
* maximum constraints where justified;
* compact-mode thresholds.

Constraints shall be derived from the current composition rather than hard-coded arbitrarily across the application.

---

# 25. Window Layout

Window Layout describes the internal composition of the window.

It may include:

* sidebar;
* content area;
* inspector;
* toolbar;
* status area;
* split views;
* tab bar;
* overlay surfaces;
* auxiliary panels.

Layout remains part of Workspace-owned Window State.

---

# 26. Layout Projection

Visual layout shall be derived from:

* Window State;
* panel visibility;
* current tab;
* active editor requirements;
* display size;
* accessibility settings;
* user preferences;
* presentation mode.

UI components shall not maintain an independent persistent layout model.

---

# 27. Tab Ownership

Every tab shall belong to exactly one registered window at a time.

A tab may be moved between windows through an explicit operation.

The operation shall update:

* source window registry;
* target window registry;
* active tab references;
* editor association;
* navigation context;
* restoration metadata.

The move shall be atomic within the Workspace consistency boundary.

---

# 28. Active Tab Relationship

The active tab defines the primary content projection of a window.

Changing the active tab shall update:

* active editor;
* command context;
* title projection;
* panels;
* toolbar capabilities;
* navigation state;
* selection scope;
* AI context eligibility.

A tab activation operation shall not reload authoritative content unnecessarily.

---

# 29. Editor Relationship

Each content tab may be associated with one active editor projection.

Window Management shall coordinate visual placement but shall not own editor state or editor behavior.

Editor creation and disposal remain responsibilities of Editor Manager.

---

# 30. Panel Relationship

Panels may be:

* window-scoped;
* tab-contextual;
* Workspace-scoped projections;
* plugin-contributed;
* temporarily detached.

Window Management coordinates panel placement.

Panel Manager coordinates panel instances and behavior.

Panel State remains inside Workspace-owned Window State.

---

# 31. Detached Panels

Where supported by the platform, a panel may be represented as an auxiliary window.

A detached panel shall:

* retain association with its source Workspace;
* declare whether it is window-scoped or Workspace-scoped;
* preserve restoration metadata;
* follow lifecycle rules;
* not create an independent state authority.

Auxiliary windows shall use distinct window roles.

---

# 32. Window Roles

A window shall declare a role.

Representative roles include:

* primary workspace window;
* auxiliary workspace window;
* detached panel;
* inspector;
* presentation window;
* preview window;
* modal utility window;
* plugin-contributed window.

Window role determines behavior, not ownership.

---

# 33. Primary Window

A Workspace may designate one primary window.

The primary window may be used for:

* default activation;
* menu targeting;
* restoration ordering;
* new-tab routing;
* Workspace-level navigation.

The primary designation shall be changeable.

The first created window does not need to remain primary permanently.

---

# 34. Auxiliary Windows

Auxiliary windows may provide:

* additional document views;
* focused editing;
* comparison;
* secondary navigation;
* detached tools;
* presentation surfaces.

Auxiliary windows remain equal participants in Workspace state unless their role defines narrower capabilities.

---

# 35. Modal Windows

Modal interaction shall be minimized.

When required, modal windows shall:

* declare their scope;
* identify their parent context;
* block only the minimum required surface;
* preserve cancellation;
* avoid hiding destructive consequences;
* remain accessible.

Application-wide modal blocking is prohibited unless necessary for application safety.

---

# 36. Sheets and Dialogs

On macOS, document- or window-scoped dialogs should normally use window-attached sheets where appropriate.

Dialogs shall not own business state.

They shall:

* collect input;
* validate input;
* submit an explicit command;
* present structured outcomes.

Closing a dialog shall not implicitly apply unconfirmed changes.

---

# 37. Full-Screen Behavior

Full-screen state shall be represented in Window State.

Entering or exiting full screen shall:

* preserve layout;
* update presentation state;
* adapt panels where required;
* maintain tab and editor state;
* publish a window event.

Full-screen transitions shall not create a new Workspace.

---

# 38. Presentation Windows

A presentation window may project a document or knowledge view without editing controls.

It shall:

* reference existing Workspace state;
* maintain its own Window Identity;
* declare presentation role;
* remain isolated from authoritative content ownership;
* support safe dismissal.

Presentation windows may use a separate display when available.

---

# 39. Minimized and Hidden Windows

Minimized and hidden states shall be distinguished.

A minimized window:

* remains part of the native window environment;
* preserves its internal composition;
* may still receive non-visual updates.

A hidden window:

* is not currently displayed;
* remains registered when restoration or workflow requires it.

Neither state shall release the Window State automatically.

---

# 40. Last Window Behavior

When the last visible window closes, the application may:

* remain running without visible windows;
* create a replacement window;
* return to a Workspace selector;
* initiate application shutdown.

The selected behavior shall be controlled by application policy and user preference.

It shall not be embedded as an invariant of the Window Manager.

---

# 41. Multi-Window Navigation

Each window shall maintain its own navigation context unless an explicit shared-navigation mode is introduced.

This allows:

* independent exploration;
* side-by-side comparison;
* parallel editing;
* different document locations;
* distinct back and forward histories.

Navigation histories shall not merge implicitly.

---

# 42. Opening Content

Opening content may:

* reuse the active tab;
* open a new tab;
* open a new window;
* open a preview tab;
* activate an existing tab containing the same reference.

The behavior shall be determined by:

* command intent;
* modifier keys;
* user preference;
* current context;
* editor capability.

Window Manager coordinates placement but does not resolve domain content.

---

# 43. Duplicate Content Views

The same knowledge object may be open in:

* multiple tabs;
* multiple windows;
* multiple editors;
* multiple presentation modes.

Each view shall maintain independent presentation state.

All views shall reference the same authoritative knowledge identity.

---

# 44. Window Titles

Window titles shall be projections derived from context.

They may include:

* active document title;
* Workspace title;
* application name;
* synchronization indicator;
* modification indicator;
* privacy indicator.

Titles shall not become persistence identifiers.

---

# 45. Window Commands

Representative window commands include:

* CreateWindow;
* RestoreWindow;
* ShowWindow;
* HideWindow;
* ActivateWindow;
* CloseWindow;
* MinimizeWindow;
* ZoomWindow;
* EnterFullScreen;
* ExitFullScreen;
* MoveWindow;
* ResizeWindow;
* ChangeWindowRole;
* SetPrimaryWindow;
* MoveTabToWindow;
* OpenContentInNewWindow.

Commands shall validate Workspace ownership and lifecycle state.

---

# 46. Window Events

Representative events include:

* WindowCreated;
* WindowReady;
* WindowShown;
* WindowHidden;
* WindowActivated;
* WindowDeactivated;
* WindowMoved;
* WindowResized;
* WindowMinimized;
* WindowRestored;
* WindowEnteredFullScreen;
* WindowExitedFullScreen;
* WindowRoleChanged;
* PrimaryWindowChanged;
* WindowClosing;
* WindowClosed;
* WindowRecoveryRequired.

Events describe completed state transitions.

---

# 47. Platform-Originated Events

The native platform may produce events such as:

* focus changed;
* frame changed;
* display changed;
* window closing requested;
* full-screen transition;
* minimize;
* restore;
* application activation;
* application deactivation.

The Platform Adapter shall translate these into application-level signals.

Raw native events shall not propagate through architectural layers.

---

# 48. Closing Requests

A platform-originated close request is an intent, not an already completed state transition.

The Window Manager shall:

1. identify the target Window State;
2. validate close eligibility;
3. coordinate editor and task checks;
4. request user confirmation only when necessary;
5. execute the close operation;
6. publish the resulting event.

The native window shall not bypass application close validation.

---

# 49. Window Checkpointing

Window State checkpoints should occur after meaningful changes, including:

* window creation;
* window closure;
* tab changes;
* layout changes;
* panel changes;
* frame stabilization;
* full-screen transitions;
* active tab changes.

High-frequency frame changes shall be debounced or coalesced.

---

# 50. Window Descriptor

A serialized Window Descriptor may include:

```text
WindowDescriptor
│
├── SchemaVersion
├── WindowIdentity
├── WindowRole
├── FrameDescriptor
├── DisplayHint
├── TabDescriptors
├── ActiveTabIdentity
├── PanelDescriptor
├── LayoutDescriptor
├── NavigationDescriptor
├── PresentationDescriptor
└── RestorationMetadata
```

It shall not contain a native window handle or live view hierarchy.

---

# 51. Window Restoration Order

Window restoration order may consider:

* primary window designation;
* previous focus order;
* creation order;
* role;
* display availability;
* restoration priority;
* resource constraints.

The application may restore an initial window first and defer secondary windows.

---

# 52. Deferred Restoration

Deferred restoration is permitted for:

* secondary windows;
* heavy editors;
* detached panels;
* preview windows;
* presentation windows;
* plugin-contributed windows.

A deferred window shall retain a valid descriptor until materialized.

---

# 53. Partial Restoration

A window may be partially restored when:

* one tab is unavailable;
* an editor type is missing;
* a plugin panel is unsupported;
* the original display is absent;
* a layout is incompatible;
* a referenced knowledge object is unavailable.

The remaining valid window state shall still be restored.

---

# 54. Recovery

Window recovery shall attempt to preserve:

* window identity;
* tab references;
* active document;
* navigation state;
* panel configuration;
* layout intent.

If the visual hierarchy cannot be reconstructed, the application shall create a safe default window using valid retained references.

---

# 55. Failure Isolation

A failure in one window shall not invalidate unrelated windows.

Examples include:

* editor rendering failure;
* panel failure;
* native window creation failure;
* invalid layout;
* unsupported plugin contribution.

Window-specific failures shall be contained and surfaced through structured recovery.

---

# 56. Concurrency

Window State mutations shall occur through the designated UI execution context.

Background tasks may produce results for a window but shall not mutate it directly.

They shall return through:

* commands;
* events;
* observable projections;
* task result handlers.

Window closure shall cancel or detach obsolete window-scoped work.

---

# 57. Window-Scoped Dependencies

Window-scoped services may include:

* view composition context;
* native window binding;
* focus coordinator;
* tab presentation coordinator;
* accessibility bridge;
* toolbar projection;
* menu validation context.

Window-scoped dependencies shall be disposed when the window closes.

---

# 58. Resource Management

Window closure shall release:

* native observers;
* view controllers;
* rendering resources;
* drag-and-drop registrations;
* window-scoped event subscriptions;
* toolbar resources;
* temporary previews;
* editor view bindings.

Persistent descriptors may remain in session storage when required.

---

# 59. Memory Pressure

Under memory pressure, the application may:

* release hidden editor views;
* suspend previews;
* unload inactive panels;
* discard reconstructable caches;
* defer secondary window materialization;
* reduce visual resources.

The logical Window State shall remain valid.

---

# 60. Accessibility

Each window shall provide:

* coherent focus order;
* accessible titles;
* accessible window roles;
* keyboard navigation;
* assistive technology integration;
* predictable modal behavior;
* visible focus indicators;
* support for system appearance and text settings.

Detached and auxiliary windows shall remain discoverable to accessibility services.

---

# 61. macOS Integration

On macOS, Window Management shall respect:

* native application lifecycle;
* standard window controls;
* menu commands;
* keyboard shortcuts;
* full-screen spaces;
* Mission Control;
* tabbing conventions where adopted;
* window restoration;
* drag and drop;
* accessibility APIs.

Native behavior shall be used where it does not violate KnowledgeOS architecture.

---

# 62. iPadOS Projection

A future iPadOS implementation may represent a window through a scene.

The logical model may map to:

* scene sessions;
* split views;
* floating overlays;
* adaptive navigation;
* multiple app windows;
* stage management.

Platform-specific scene objects shall remain behind the adapter boundary.

---

# 63. Web Projection

A future Web implementation may represent logical windows as:

* browser tabs;
* browser windows;
* internal workspace surfaces;
* split panels;
* routed views.

The logical Window Identity shall not depend on a browser-generated identifier.

---

# 64. Security

Window Management shall:

* prevent unauthorized content projection;
* respect authorization changes;
* avoid exposing sensitive titles when privacy mode applies;
* validate plugin window contributions;
* protect restoration descriptors;
* avoid leaking context through operating system previews where configured.

---

# 65. Privacy

Privacy-aware window behavior may include:

* title redaction;
* recent-item suppression;
* secure presentation mode;
* hidden sensitive thumbnails;
* controlled screen-sharing projections;
* protected restoration metadata.

Privacy behavior shall be explicit and configurable.

---

# 66. Observability

Window Management observability may include:

* window creation duration;
* restoration duration;
* active window count;
* native binding failures;
* layout recovery events;
* frame normalization;
* tab movement failures;
* window closure duration;
* resource disposal failures.

Diagnostics shall not record sensitive document content.

---

# 67. Performance

Window operations shall remain responsive.

The architecture shall support:

* incremental composition;
* lazy editor materialization;
* lazy panel creation;
* deferred secondary windows;
* coalesced frame updates;
* asynchronous heavy content loading;
* immediate placeholder projection.

Creating a new window shall not require loading the entire Workspace.

---

# 68. Testing Strategy

Window Management shall support tests for:

* creation;
* restoration;
* activation;
* focus transitions;
* close validation;
* frame normalization;
* display changes;
* tab movement;
* full-screen behavior;
* multi-window isolation;
* detached panels;
* partial restoration;
* native binding failure;
* resource disposal;
* accessibility;
* application last-window policies.

---

# 69. Determinism

Given the same:

* Window Descriptor;
* Workspace state;
* supported capabilities;
* display configuration;
* user preferences;

Window Management shall reconstruct the same logical window composition.

Exact native placement may be normalized according to current platform constraints.

---

# 70. Idempotency

The following operations shall be idempotent where applicable:

* window registration;
* restoration from the same descriptor;
* repeated activation requests;
* repeated close requests;
* frame checkpointing for unchanged state;
* native resource disposal;
* role assignment;
* primary window assignment.

Repeated execution shall not create duplicate native windows.

---

# 71. Window Management Prohibitions

Window Management shall not:

* own authoritative knowledge;
* store Workspace state outside the Workspace;
* expose native window handles to Domain or Platform layers;
* permit UI components to persist state independently;
* close windows without lifecycle validation;
* merge navigation histories implicitly;
* use window titles as identities;
* serialize native view hierarchies;
* allow plugin windows to bypass capability checks;
* block the UI thread with content loading;
* delete knowledge when closing a window.

---

# 72. Validation Matrix

| Concern                | Required Validation        |
| ---------------------- | -------------------------- |
| Window identity        | Uniqueness tests           |
| Workspace ownership    | Architecture tests         |
| Lifecycle              | State-transition tests     |
| Native binding         | Integration tests          |
| Focus                  | Interaction tests          |
| Frame placement        | Display tests              |
| Tab movement           | Consistency tests          |
| Restoration            | Round-trip tests           |
| Partial restoration    | Recovery tests             |
| Multi-window isolation | Integration tests          |
| Accessibility          | Accessibility tests        |
| Resource disposal      | Lifecycle tests            |
| Performance            | Window creation benchmarks |

---

# 73. Anti-Patterns

The following are prohibited:

* native windows owning application state;
* static global references to the active window;
* storing tabs independently from their Workspace;
* direct mutation from native event callbacks;
* restoring windows without validating display availability;
* using one global navigation history for all windows;
* retaining closed window resources;
* assuming the first window is always the primary window;
* hiding modal scope;
* forcing every content opening into the active window;
* eagerly materializing all restored windows;
* treating window closure as document deletion.

---

# 74. Architectural Invariants

The following invariants are mandatory:

* every window belongs to exactly one Workspace;
* every Window State is owned by its Workspace;
* the Window Manager coordinates but does not own persistent Window State;
* native window resources remain behind the Platform Adapter;
* native identifiers never replace architectural Window Identity;
* every tab belongs to exactly one registered window;
* each window has at most one active tab;
* each Workspace has at most one active window;
* active context derives from valid focus hierarchy;
* window closure never deletes authoritative knowledge;
* Window Descriptors contain no live native objects;
* window-specific failures remain isolated;
* multiple windows maintain independent navigation contexts;
* all window-scoped resources are disposed deterministically;
* UI composition remains a projection of Workspace-owned state.

---

# 75. Related Documents

* `RuntimeArchitecture.md`
* `ApplicationArchitecture.md`
* `WorkspaceArchitecture.md`
* `SessionManagement.md`
* `NavigationArchitecture.md`
* `CommandArchitecture.md`
* `EventArchitecture.md`
* `StateManagement.md`
* `DependencyGraph.md`
* `../03-Workspace/Tabs.md`
* `../03-Workspace/MultiWindow.md`
* `../03-Workspace/LayoutPersistence.md`
* `../04-UserInterface/Accessibility.md`
* `../07-Integration/SystemServices.md`
* Platform Architecture
* Kernel Architecture
* Architecture Decision Records

---

# 76. Status

**Approved**

This document establishes the authoritative Window Management Architecture for the KnowledgeOS Desktop Application.

Windows are platform-specific projections of Workspace-owned state. The Window Manager coordinates their lifecycle, native bindings, focus, layout, restoration and resource management while preserving strict separation between application state and operating system implementation.

All window implementations shall comply with the ownership, lifecycle, restoration, isolation and platform-boundary rules defined herein.
