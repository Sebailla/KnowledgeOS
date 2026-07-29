
# Desktop Application Workspace Windows

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Workspace

**Document:** Windows

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation model for Workspace Windows within the KnowledgeOS Desktop Application.

A Workspace Window is the logical presentation container through which a Workspace projects tabs, editors, panels, navigation and interaction state into a native desktop window.

The logical Window State belongs to the Workspace.

The native operating-system window is only a platform projection of that state.

---

# 2. Scope

This document governs:

* Window identity;
* Window ownership;
* Window roles;
* Window lifecycle;
* Window State;
* Window Registry;
* native window binding;
* activation;
* focus;
* frame state;
* display state;
* fullscreen behavior;
* tab ownership;
* panel layout;
* navigation association;
* restoration;
* recovery;
* commands;
* events;
* plugin Windows;
* concurrency;
* testing.

It does not redefine Workspace lifecycle, Tab internals, Editor internals or Platform Adapter implementation details.

---

# 3. Objectives

The Window implementation shall:

* preserve Workspace ownership;
* separate logical state from native projection;
* support multiple Windows per Workspace;
* support deterministic activation;
* preserve Window layout and restoration;
* support tab movement;
* support scoped navigation;
* support panels and auxiliary surfaces;
* recover safely from native projection failure;
* remain independent from platform-specific classes;
* support plugin contributions without weakening core boundaries.

---

# 4. Window Definition

A Workspace Window is a logical state aggregate representing one top-level desktop presentation surface.

A Window may present:

* one or more Tabs;
* one active Editor;
* multiple Panels;
* one Navigation Context;
* one layout configuration;
* one focus context;
* one native platform projection.

A Window is not:

* the Workspace itself;
* a native `NSWindow`;
* an Editor;
* a document;
* a Platform Engine;
* a persistence object;
* a plugin-owned application root.

---

# 5. Architectural Position

```text
Workspace
    │
    ├── Window Registry
    │       │
    │       ├── Window State A
    │       ├── Window State B
    │       └── Window State C
    │
    └── Window Manager
            │
            ▼
      Platform Window Adapter
            │
            ▼
      Native Desktop Window
```

The Workspace owns Window State.

Window Manager coordinates operations.

Platform Window Adapter creates and binds the native projection.

---

# 6. Window Ownership

Every Window State shall belong to exactly one Workspace.

The Workspace owns:

* Window identity;
* Window lifecycle;
* Window role;
* tab ordering;
* active Tab identity;
* panel layout;
* navigation association;
* logical frame;
* display hints;
* restoration metadata.

The native platform owns:

* native rendering surface;
* operating-system window handle;
* screen placement realization;
* native focus events;
* title bar behavior;
* system fullscreen implementation.

The Platform Adapter translates between both models.

---

# 7. Window Aggregate

```text
WindowState
│
├── WindowIdentity
├── WorkspaceIdentity
├── WindowRole
├── LifecycleState
├── FrameState
├── DisplayState
├── TabOrder
├── ActiveTabIdentity
├── PanelLayout
├── NavigationContextIdentity
├── FocusState
├── PresentationState
├── RestorationMetadata
├── PluginContributions
└── WindowVersion
```

All references shall use stable identities.

---

# 8. Window Identity

Every Window shall have a stable Window Identity.

Window Identity supports:

* Workspace lookup;
* Command routing;
* Event scoping;
* tab ownership;
* panel ownership;
* navigation association;
* restoration;
* diagnostics;
* native binding lookup.

Window Identity shall not depend on:

* title;
* frame;
* display;
* active document;
* native handle;
* creation order;
* memory address.

---

# 9. Window Descriptor

A Window Descriptor is the serializable representation required to restore a Window.

It may include:

* Window Identity;
* Workspace Identity;
* schema version;
* role;
* lifecycle restoration state;
* frame descriptor;
* display hint;
* tab ordering;
* active Tab identity;
* panel layout;
* Navigation Context identity;
* focus restoration hint;
* fullscreen state;
* restoration metadata;
* plugin contribution descriptors.

It shall not include live native window objects.

---

# 10. Window Roles

Supported Window roles may include:

* primary;
* secondary;
* inspector;
* comparison;
* presentation;
* auxiliary;
* plugin-contributed.

Window role affects behavior and defaults but does not alter Workspace ownership.

---

# 11. Primary Window

A Workspace may identify one primary Window.

The primary Window may serve as:

* default activation target;
* default new-tab destination;
* Workspace Home location;
* system reopen target;
* default restoration anchor;
* fallback after another Window closes.

The primary Window identity is Workspace-owned state.

---

# 12. Secondary Window

A secondary Window provides an additional independent presentation surface inside the same Workspace.

It may contain:

* separate Tabs;
* separate active Editor;
* separate Navigation Context;
* separate panel layout;
* separate frame and display state.

Secondary Windows share the same Workspace but not the same Window-local state.

---

# 13. Inspector Window

An inspector Window presents auxiliary information without becoming a new Workspace.

It may display:

* metadata;
* annotations;
* relationships;
* properties;
* diagnostics;
* AI context;
* plugin tools.

Inspector Windows shall still have explicit ownership and lifecycle.

---

# 14. Comparison Window

A comparison Window is optimized for presenting several related knowledge targets.

It may support:

* split Editors;
* synchronized navigation;
* version comparison;
* annotation comparison;
* source comparison.

Comparison behavior shall be explicit and shall not silently couple unrelated Window State.

---

# 15. Presentation Window

A presentation Window may provide:

* distraction-free reading;
* fullscreen presentation;
* external display output;
* slideshow-style navigation;
* reduced controls.

Presentation mode is a Window role or presentation policy, not a separate application runtime.

---

# 16. Auxiliary Window

An auxiliary Window may host:

* search results;
* task monitoring;
* export progress;
* graph exploration;
* plugin tools;
* temporary dialogs promoted to independent windows.

Auxiliary Windows shall not own authoritative state outside their Workspace.

---

# 17. Window Lifecycle

A Window may occupy the following states:

| State      | Meaning                                     |
| ---------- | ------------------------------------------- |
| Defined    | Logical Window State exists                 |
| Creating   | Native projection is being prepared         |
| Open       | Window is available                         |
| Active     | Window is the active Workspace Window       |
| Inactive   | Window is open but not active               |
| Hidden     | Native projection is hidden                 |
| Suspended  | Expensive projections are released          |
| Closing    | Closure is in progress                      |
| Closed     | Window is removed from Workspace            |
| Recovering | Projection or state recovery is in progress |
| Failed     | Window could not reach a usable state       |

---

# 18. Window Lifecycle Ownership

The Workspace owns logical Window lifecycle.

Window Manager coordinates lifecycle transitions.

The native platform reports projection events but does not become the lifecycle authority.

A native close request shall be translated into a `CloseWindow` Command.

---

# 19. Window Creation

Window creation shall:

1. validate the target Workspace;
2. allocate or validate Window Identity;
3. determine Window role;
4. create logical Window State;
5. initialize Tab and Panel layout;
6. create or associate Navigation Context;
7. register the Window in Workspace Window Registry;
8. create native projection through Platform Adapter;
9. bind state projection;
10. validate invariants;
11. publish `WindowCreated`.

A Window shall not become active before logical registration succeeds.

---

# 20. Window Creation Input

Window creation input may include:

* target Workspace Identity;
* Window role;
* initial Tab descriptor;
* initial navigation target;
* preferred display;
* frame hint;
* layout template;
* plugin contribution owner;
* activation policy;
* restoration descriptor.

All inputs shall be validated before state commit.

---

# 21. Default Window Creation

When a Workspace has no usable Window, the default Window policy may create:

* one primary Window;
* Workspace Home Tab;
* default Panel layout;
* initial Navigation Context;
* default frame;
* default display hint.

Default creation shall produce a valid complete Window aggregate.

---

# 22. Window Registry

The Workspace Window Registry owns all logical Window States for that Workspace.

It shall provide:

* registration;
* lookup;
* identity uniqueness;
* ordering;
* activation tracking;
* role lookup;
* primary Window selection;
* removal;
* restoration.

The registry shall not expose unrestricted mutable collections.

---

# 23. Window Ordering

Window ordering may support:

* restoration order;
* activation history;
* presentation order;
* deterministic fallback;
* Session serialization.

Ordering shall be explicit and shall not rely on native platform enumeration order.

---

# 24. Window Activation

Window activation shall:

1. validate Workspace ownership;
2. validate Window lifecycle;
3. deactivate the previously active Window;
4. update Workspace Active Context;
5. update Window lifecycle to `Active`;
6. activate the active Tab and Editor;
7. refresh command availability;
8. request native focus through Platform Adapter;
9. publish `WindowActivated`.

Logical activation shall remain authoritative even if native focus confirmation is delayed.

---

# 25. Native Focus Confirmation

Native focus confirmation may arrive asynchronously.

The Platform Adapter shall normalize:

* became key;
* resigned key;
* became main;
* resigned main;
* application activation;
* display changes.

Native focus signals shall update logical state only through validated transitions.

---

# 26. Active Window Invariant

At most one Window per Workspace may be logically active at a time.

The Runtime may also identify one active Workspace.

Therefore, the active interaction hierarchy is:

```text
Active Workspace
    ↓
Active Window
    ↓
Active Tab
    ↓
Active Editor
    ↓
Focused Element
```

Each level shall belong to its parent scope.

---

# 27. Window Deactivation

Window deactivation shall:

* preserve all logical state;
* update active status;
* normalize focus state;
* suspend optional projection updates;
* preserve active Tab identity;
* publish `WindowDeactivated`.

Deactivation does not imply hiding or closing.

---

# 28. Window Hiding

A Window may become hidden while remaining logically open.

Hidden state may result from:

* explicit user action;
* application hide;
* role-specific behavior;
* restoration policy;
* system behavior.

Hidden Windows remain registered.

---

# 29. Window Showing

Showing a hidden Window shall:

* validate lifecycle;
* restore native projection if needed;
* bind current logical state;
* apply frame normalization;
* optionally activate;
* publish `WindowShown`.

Showing shall not recreate Window Identity.

---

# 30. Window Suspension

A Window may be suspended under Workspace or memory-pressure policy.

Suspension may release:

* native content view hierarchy;
* inactive Editor projections;
* Panel projections;
* rendering resources;
* visual caches.

Logical Window State shall remain intact.

---

# 31. Window Resumption

Resumption shall recreate required native and visual projections from current logical state.

It shall validate:

* Window still belongs to Workspace;
* referenced Tabs still exist;
* active Tab remains valid;
* Panel layout remains valid;
* display conditions remain compatible.

---

# 32. Window Closure

Window closure shall:

1. validate Window identity and ownership;
2. evaluate active Tab and Editor state;
3. resolve pending child operations;
4. determine tab closure or transfer policy;
5. update active Window fallback;
6. checkpoint recoverable Window state if required;
7. dispose native projection;
8. remove Window from registry;
9. dispose Window-scoped services;
10. publish `WindowClosed`.

Closure shall be idempotent.

---

# 33. Closing the Primary Window

Closing the primary Window may cause:

* designation of another existing Window as primary;
* creation of a replacement primary Window;
* Workspace deactivation;
* Workspace closure;
* Workspace Home creation.

The selected policy shall be deterministic and explicit.

---

# 34. Closing the Final Window

When the final Window closes, the Workspace may:

* remain open without visible Windows;
* create a default Window;
* become inactive;
* close automatically;
* wait for system reopen request.

The policy shall be configured at Workspace or application level.

---

# 35. Window Closure Confirmation

Confirmation may be required when the Window contains:

* unsaved Editor state;
* non-transferable tasks;
* uncommitted generated content;
* plugin state requiring review;
* irreversible active operation;
* final visible access to an unresolved Workspace failure.

Recoverable routine closure should not require confirmation.

---

# 36. Tab Ownership

Every Tab assigned to a Window shall also belong to the same Workspace.

Window State owns:

* Tab order;
* active Tab identity;
* Tab grouping;
* preview position;
* pinned placement.

The Workspace Tab Registry owns the normalized Tab State records.

---

# 37. Tab Ordering

Tab ordering shall be explicit.

It may support:

* pinned section;
* regular section;
* preview position;
* grouped Tabs;
* split region association.

Tab order shall survive restoration.

---

# 38. Active Tab

Every open Window with Tabs shall have at most one active Tab per presentation region.

For a standard single-region Window, one active Tab identity is sufficient.

The active Tab shall resolve to a registered Workspace Tab.

---

# 39. Moving Tabs Between Windows

Moving a Tab within the same Workspace shall be atomic.

The operation shall:

* validate source Window;
* validate target Window;
* validate Tab ownership;
* remove source ordering reference;
* update Tab Window Identity;
* add target ordering reference;
* resolve source fallback;
* resolve target activation;
* preserve Editor State;
* update navigation association where required;
* publish `TabMoved`.

---

# 40. Moving the Final Tab

Moving the final Tab out of a Window may:

* leave an empty Window;
* close the source Window;
* create Workspace Home;
* create a default Tab.

The policy shall be role-aware.

Inspector or comparison Windows may require different behavior from primary Windows.

---

# 41. Cross-Workspace Tab Movement

A Tab shall not be directly reassigned to another Workspace.

Cross-Workspace movement requires an explicit workflow that may:

* clone the Tab descriptor;
* create a new Editor;
* transfer permitted temporary state;
* preserve content reference;
* close the source Tab after successful creation.

Mutable internal state shall not be shared across Workspaces.

---

# 42. Panels

A Window may host Window-scoped Panels.

Window State owns:

* panel placement;
* visibility;
* size;
* collapsed state;
* region order;
* active panel section.

Panel view instances remain projections.

---

# 43. Panel Regions

Supported panel regions may include:

* leading sidebar;
* trailing sidebar;
* bottom panel;
* top utility region;
* floating auxiliary area;
* editor-attached region.

Region support may depend on platform and Window role.

---

# 44. Panel Layout

Panel layout shall be represented as logical descriptors.

It shall not contain:

* native split-view objects;
* view controller references;
* pixel-only assumptions without normalization;
* unmanaged plugin objects.

Panel layout shall be versioned and restorable.

---

# 45. Navigation Context

Each Window shall own or reference one explicit Navigation Context.

A Window Navigation Context may define:

* Current Location;
* Back History;
* Forward History;
* source context;
* pending navigation;
* restoration metadata.

Window activation shall activate its Navigation Context.

---

# 46. Window and Navigation Isolation

Each Window shall preserve independent navigation unless explicit linked-navigation policy is enabled.

Navigating in one Window shall not change another Window’s Current Location by default.

Linked navigation shall be modeled as a separate coordination contract.

---

# 47. Window Title

Window title is derived presentation state.

It may depend on:

* Workspace name;
* active Tab;
* active content title;
* Window role;
* synchronization state;
* privacy policy;
* unsaved-state indicator.

Title shall not act as identity.

---

# 48. Window Subtitle

A subtitle may present:

* source location;
* collection;
* document version;
* synchronization state;
* Workspace name;
* plugin context.

Subtitles shall respect privacy and title-redaction policies.

---

# 49. Frame State

Frame State represents the logical Window position and size.

It may include:

* normalized origin;
* normalized dimensions;
* minimum size;
* preferred aspect;
* maximized state;
* fullscreen state;
* safe-area adjustments;
* display association hint.

Frame State shall remain platform-independent.

---

# 50. Display State

Display State may include:

* preferred display identity hint;
* display role;
* scale category;
* orientation;
* external-display preference;
* visible frame normalization;
* last known display configuration.

Display identities are hints because physical display configurations can change.

---

# 51. Frame Normalization

Frame restoration shall account for:

* removed displays;
* changed resolution;
* changed scale;
* changed visible work area;
* system menu bar and dock;
* minimum usable size;
* off-screen coordinates.

A Window shall never restore entirely outside visible display bounds.

---

# 52. Minimum Size

Each Window role may define minimum logical dimensions.

Minimum sizes shall preserve:

* title bar usability;
* navigation controls;
* Editor minimum width;
* essential panel behavior;
* accessibility.

Plugin contributions shall not force unusable minimum sizes.

---

# 53. Resize Interaction

During live resize:

* transient native frame changes may occur rapidly;
* logical state updates may be throttled;
* visual layout may update incrementally;
* stable Frame State shall be committed after interaction;
* checkpointing shall use the final normalized frame.

High-frequency resize Events may be coalesced.

---

# 54. Fullscreen State

Fullscreen State shall be represented logically.

Supported values may include:

* windowed;
* native fullscreen;
* presentation fullscreen;
* external-display fullscreen.

The Platform Adapter implements the native transition.

---

# 55. Fullscreen Transition

A fullscreen transition shall:

1. validate role and capability;
2. record previous frame state;
3. request platform transition;
4. await normalized result;
5. update logical state;
6. preserve layout compatibility;
7. publish completion or failure Event.

A failed native transition shall not corrupt Window State.

---

# 56. Maximized State

Maximized and fullscreen are distinct.

Maximized State may use available screen bounds while preserving desktop context.

The logical descriptor shall preserve enough information to restore the previous windowed frame.

---

# 57. Split Editing

A Window may support several Editor regions.

Split configuration may include:

* horizontal split;
* vertical split;
* nested split;
* comparison layout;
* synchronized scrolling;
* active region.

Each Editor region shall reference registered Tabs or Editor identities explicitly.

---

# 58. Split Ownership

Split layout belongs to Window layout state.

Editor content and Editor State remain owned by their Tabs.

The layout shall not duplicate Editor State.

---

# 59. Window Focus State

Window Focus State may include:

* logical active state;
* requested focus target;
* confirmed native focus target;
* active Editor region;
* active Panel;
* last meaningful focus descriptor.

Focus descriptors shall remain logical and restorable only where meaningful.

---

# 60. Focus Restoration

When a Window becomes active, focus restoration shall:

* validate the previous target;
* verify projection availability;
* prefer the active Editor;
* fall back to a safe navigation target;
* avoid focusing hidden or disabled controls;
* respect accessibility policy.

Focus restoration is best effort.

---

# 61. Menu Projection

Application menus may derive state from the active Window.

Menu projection may depend on:

* active Tab;
* active Editor capabilities;
* selection;
* Window role;
* panel visibility;
* fullscreen state;
* Workspace capabilities.

Menus submit Commands.

They do not mutate Window State directly.

---

# 62. Toolbar Projection

Toolbar content may depend on:

* Window role;
* active Editor;
* navigation state;
* selection;
* plugin contributions;
* available Commands.

Toolbar visibility and customization may be part of Window presentation state.

---

# 63. Drag and Drop

Window drag-and-drop shall be translated into explicit Commands.

Supported actions may include:

* import file;
* open knowledge target;
* move Tab;
* create annotation;
* attach asset;
* open external reference;
* invoke plugin contribution.

Native drag payloads shall be normalized before reaching application logic.

---

# 64. External File Open

When the operating system requests opening a file, the Runtime shall determine:

* target Workspace;
* target Window;
* import or direct-open policy;
* supported format;
* activation behavior.

The Platform Adapter shall not insert content directly into Window State.

---

# 65. Window Reopen

A system reopen request may:

* activate the current primary Window;
* show a hidden Window;
* resume a suspended Window;
* create a default primary Window;
* restore the most recent Workspace.

The policy shall remain deterministic.

---

# 66. Plugin Window Contributions

Plugins may contribute Window roles or auxiliary Windows only through approved Plugin SDK contracts.

A plugin Window contribution shall declare:

* plugin identity;
* role;
* capability requirements;
* state namespace;
* restoration policy;
* minimum size;
* panel or Editor contributions;
* disposal policy.

---

# 67. Plugin Window Isolation

Plugin-contributed Windows shall not:

* own a Workspace;
* access other Windows’ private state;
* bypass Command Dispatcher;
* call Platform Engines directly;
* store native objects in Workspace State;
* persist unregistered descriptors;
* block core Window closure indefinitely.

---

# 68. Native Window Binding

The Window Manager shall maintain a controlled binding between:

* Window Identity;
* logical Window State;
* native platform projection.

The binding may contain runtime-only references but shall not be serialized.

---

# 69. Binding Lifecycle

Native binding lifecycle shall follow:

```text
Logical Window Registered
        ↓
Native Projection Created
        ↓
State Bound
        ↓
Projection Active
        ↓
Projection Hidden or Suspended
        ↓
Projection Disposed
        ↓
Logical Window Removed
```

Logical registration shall precede native creation.

---

# 70. Native Projection Failure

If native Window creation fails:

* logical Window State shall remain valid or be rolled back;
* partial native resources shall be disposed;
* the failure shall be classified;
* fallback creation may be attempted;
* the Workspace shall retain a usable Window where possible;
* false `WindowCreated` completion Events shall not be published.

---

# 71. Projection Reconciliation

The Window Manager shall reconcile native projection with logical Window State.

Reconciliation may correct:

* missing native Window;
* incorrect title;
* stale frame;
* invalid Tab selection;
* missing Panel projection;
* wrong fullscreen mode;
* focus divergence.

Logical state remains authoritative.

---

# 72. Window Restoration

Window restoration shall reconstruct logical Window State before creating native projection.

Restoration shall:

1. validate Window Descriptor;
2. validate Workspace ownership;
3. migrate schema if required;
4. restore role;
5. normalize frame and display state;
6. restore tab ordering;
7. resolve active Tab;
8. restore Panel layout;
9. restore Navigation Context association;
10. validate invariants;
11. create native projection;
12. bind current state;
13. publish `WindowRestored`.

---

# 73. Restoration Order

The required order is:

```text
Workspace
    ↓
Window State
    ↓
Tab References
    ↓
Editor References
    ↓
Panel Layout
    ↓
Navigation Context
    ↓
Active Tab
    ↓
Frame Normalization
    ↓
Native Window Projection
    ↓
Focus Restoration
```

The native Window shall not be created from incomplete logical state unless a controlled placeholder strategy is used.

---

# 74. Missing Tabs During Restoration

If restored Tab references are invalid:

* invalid references shall be removed;
* valid Tabs shall preserve order;
* active Tab fallback shall be selected;
* Workspace Home may be created;
* the Window may remain empty if policy permits.

The Window Descriptor shall not be rejected solely because one optional Tab is unavailable.

---

# 75. Missing Display During Restoration

If the preferred display is unavailable:

* select the current primary display;
* normalize frame;
* preserve role;
* avoid overlapping critical system regions;
* record a restoration warning.

Display hints shall not prevent restoration.

---

# 76. Invalid Frame During Restoration

An invalid frame shall be replaced by:

* a normalized prior frame;
* role-specific default;
* centered frame;
* cascaded frame;
* primary Window default.

The replacement shall preserve minimum usable dimensions.

---

# 77. Window Recovery

Window recovery may be required after:

* native projection failure;
* invalid layout;
* missing active Tab;
* plugin Window corruption;
* frame corruption;
* Editor projection failure;
* fullscreen transition failure.

Recovery shall preserve valid child state where possible.

---

# 78. Recovery Strategies

Window recovery may use:

* projection recreation;
* frame normalization;
* layout reset;
* plugin contribution removal;
* active Tab fallback;
* default Panel layout;
* default Navigation Context;
* default Window replacement.

Recovery order shall be deterministic.

---

# 79. Window Replacement

A failed Window may be replaced by a new logical Window only when recovery of the existing identity is impossible or unsafe.

Replacement shall:

* preserve transferable Tabs;
* preserve Editors;
* preserve content references;
* preserve navigation where compatible;
* establish a new Window Identity;
* record the replacement relationship;
* remove the failed Window safely.

---

# 80. Window Checkpointing

Window state participates in Workspace checkpointing.

Checkpoint data may include:

* role;
* order;
* frame;
* display hint;
* Tabs;
* active Tab;
* Panel layout;
* Navigation Context association;
* fullscreen state;
* presentation preferences.

Checkpointing shall use immutable snapshots.

---

# 81. Commands

Representative Window Commands include:

* CreateWindow;
* ActivateWindow;
* DeactivateWindow;
* ShowWindow;
* HideWindow;
* SuspendWindow;
* ResumeWindow;
* CloseWindow;
* ForceCloseWindow;
* MoveWindowToDisplay;
* SetWindowFrame;
* EnterFullscreen;
* ExitFullscreen;
* SetPrimaryWindow;
* ResetWindowLayout;
* RestoreWindow;
* RecoverWindow.

Commands shall identify Workspace and Window context explicitly.

---

# 82. Events

Representative Window Events include:

* WindowDefined;
* WindowCreationStarted;
* WindowCreated;
* WindowCreationFailed;
* WindowActivated;
* WindowDeactivated;
* WindowShown;
* WindowHidden;
* WindowSuspended;
* WindowResumed;
* WindowFrameChanged;
* WindowDisplayChanged;
* WindowEnteredFullscreen;
* WindowExitedFullscreen;
* WindowPrimaryStatusChanged;
* WindowClosing;
* WindowClosed;
* WindowRestorationStarted;
* WindowRestored;
* WindowRecoveryStarted;
* WindowRecoveryCompleted;
* WindowRecoveryFailed.

---

# 83. Event Scope

Window Events shall include:

* Window Identity;
* Workspace Identity;
* Window role;
* correlation identity;
* causation identity;
* resulting version;
* relevant changed state.

Events shall not expose native Window references.

---

# 84. Queries

Representative Window Queries include:

* GetWindow;
* GetWindows;
* GetActiveWindow;
* GetPrimaryWindow;
* GetWindowFrame;
* GetWindowTabs;
* GetWindowPanels;
* GetWindowNavigationContext;
* GetWindowCapabilities;
* GetWindowLifecycleState.

Queries shall return immutable projections.

---

# 85. Concurrency

Window mutations shall use a Window-scoped serialization key where ordering is required.

Serialized operations may include:

* creation;
* closure;
* Tab transfer;
* layout replacement;
* fullscreen transitions;
* restoration;
* recovery.

Independent read-only queries may run concurrently.

---

# 86. Close and Activate Race

If a Window is entering `Closing`, activation shall be rejected.

The Workspace shall choose another valid active Window.

A native focus event for a closing Window shall not reactivate it.

---

# 87. Resize and Restore Race

If a restore or layout reset begins during resize:

* transient resize updates may be discarded;
* the new authoritative frame shall win;
* stale native callbacks shall be ignored;
* final projection shall reconcile to current Window version.

---

# 88. Fullscreen and Closure Race

If closure begins during fullscreen transition:

* the transition shall be cancelled if safe;
* native completion callbacks shall be ignored after closure version changes;
* Window disposal shall remain deterministic.

---

# 89. Tab Move and Closure Race

Moving a Tab into a closing Window shall be rejected.

Moving a Tab out of a Window that begins closing shall either:

* commit before closure boundary;
* be cancelled;
* be coordinated as part of closure transfer policy.

Partial ownership changes are prohibited.

---

# 90. Cancellation

Window operations may support cancellation when safe.

Potentially cancellable operations include:

* native creation;
* showing;
* resumption;
* restoration;
* recovery;
* fullscreen transition;
* closure before irreversible disposal.

Cancellation shall restore a valid lifecycle state.

---

# 91. Security

Window operations shall enforce:

* Workspace ownership;
* Command authorization;
* plugin capability;
* safe external file handling;
* secure restoration input;
* privacy policy;
* restricted force-close behavior.

Possession of a Window Identity alone does not authorize mutation.

---

# 92. Privacy

Window State may expose sensitive context through:

* titles;
* subtitles;
* recent Tabs;
* active content;
* restoration metadata;
* display previews;
* system window lists.

Privacy policy may require:

* title redaction;
* hidden thumbnails;
* minimized restoration metadata;
* private-mode behavior;
* plugin restrictions;
* secure checkpoint storage.

---

# 93. Accessibility

Window implementation shall support:

* meaningful accessible titles;
* keyboard window switching;
* deterministic focus restoration;
* accessible fullscreen transitions;
* panel discoverability;
* readable minimum sizes;
* reduced-motion preferences;
* screen-reader announcements for major state changes.

---

# 94. Performance

Window implementation shall support:

* lazy native projection creation;
* lazy Editor view creation;
* incremental layout updates;
* coalesced frame Events;
* bounded restoration work;
* version-based projection reconciliation;
* release of hidden heavy resources;
* fast active Window lookup.

---

# 95. Memory Management

Closing or suspending a Window shall release:

* native view hierarchy where appropriate;
* inactive Editor projections;
* Panel projections;
* visual caches;
* Window-scoped subscriptions;
* plugin Window resources;
* native binding references.

Logical state shall survive suspension but not closure.

---

# 96. Observability

Window observability may include:

* Window count;
* creation duration;
* activation duration;
* close duration;
* restoration duration;
* projection failures;
* frame normalization count;
* display fallback count;
* fullscreen failures;
* focus reconciliation count;
* memory usage.

---

# 97. Diagnostics

Diagnostic records should include:

* Workspace Identity;
* Window Identity;
* Window role;
* lifecycle state;
* Window version;
* active Tab;
* Navigation Context;
* frame category;
* display hint;
* Command Identity;
* correlation identity;
* failure category.

Native object addresses shall not be used as primary identifiers.

---

# 98. Testing Strategy

Window implementation shall support tests for:

* Window creation;
* identity uniqueness;
* ownership;
* role behavior;
* activation;
* deactivation;
* hiding;
* showing;
* suspension;
* resumption;
* closure;
* primary Window replacement;
* final Window policy;
* Tab movement;
* Panel layout;
* frame normalization;
* display fallback;
* fullscreen;
* restoration;
* recovery;
* native projection failure;
* plugin isolation;
* concurrency;
* disposal.

---

# 99. Architecture Tests

Automated architecture tests should verify:

* Window State belongs to one Workspace;
* Window State contains no native objects;
* Window Manager does not own duplicate state;
* native close requests become Commands;
* Platform Adapter implements Desktop contracts;
* Tabs cannot belong to another Workspace;
* plugins cannot bypass Window contracts;
* Window descriptors remain serializable;
* closed Windows release bindings and subscriptions.

---

# 100. Determinism

Given the same:

* Window Descriptor;
* Workspace State;
* current display configuration;
* role policy;
* plugin contributions;
* ordered native results;

Window restoration and logical state transitions shall produce the same semantic result.

Physical pixel placement may vary while preserving normalized layout intent.

---

# 101. Idempotency

The following operations shall be idempotent where applicable:

* Window registration;
* repeated activation;
* repeated showing;
* repeated hiding;
* repeated suspension;
* repeated closure;
* repeated disposal;
* restoration from the same validated descriptor;
* setting an unchanged frame;
* selecting the current primary Window.

---

# 102. Window Prohibitions

Window implementation shall not:

* use native Window objects as architectural state;
* store Workspace State inside native controllers;
* own authoritative document content;
* access PostgreSQL directly;
* access NAS storage directly;
* instantiate Platform Engines;
* mutate Tab ownership outside explicit transitions;
* share mutable Window State across Workspaces;
* use Window titles as identities;
* restore off-screen unusable frames;
* allow plugins unrestricted Window access;
* let native callbacks bypass Commands and validation;
* retain closed native bindings;
* publish completion Events before state commit.

---

# 103. Validation Matrix

| Concern             | Required Validation        |
| ------------------- | -------------------------- |
| Window identity     | Uniqueness tests           |
| Workspace ownership | Aggregate tests            |
| Lifecycle           | Transition tests           |
| Activation          | Active-context tests       |
| Native binding      | Adapter tests              |
| Tab movement        | Atomicity tests            |
| Panel layout        | Layout tests               |
| Frame normalization | Display tests              |
| Fullscreen          | Platform integration tests |
| Restoration         | Round-trip tests           |
| Recovery            | Failure-injection tests    |
| Plugin Windows      | Isolation tests            |
| Concurrency         | Race-condition tests       |
| Disposal            | Resource tests             |
| Privacy             | Security review            |

---

# 104. Anti-Patterns

The following are prohibited:

* treating `NSWindow` as the authoritative Window model;
* maintaining Window State in both Workspace and Window Manager;
* creating native Windows before logical registration;
* deriving identity from title or display;
* moving Tabs by copying live view objects;
* allowing a closing Window to become active again;
* restoring frame coordinates without normalization;
* binding plugin views directly to internal state;
* storing full document content in Window descriptors;
* using one Navigation Context for every Window;
* relying on native focus order as application truth;
* closing the final Window without an explicit Workspace policy.

---

# 105. Architectural Invariants

The following invariants are mandatory:

* every Window has one stable Window Identity;
* every Window belongs to exactly one Workspace;
* Window State is owned by the Workspace;
* Window Manager coordinates but does not duplicate state;
* native windows are projections of logical Window State;
* logical registration occurs before native projection creation;
* Window State contains no native platform objects;
* at most one Window per Workspace is logically active;
* every Tab in a Window belongs to the same Workspace;
* every active Tab resolves to a registered Tab;
* every Window has an explicit role;
* every Window has an explicit Navigation Context association;
* frame state is normalized and restorable;
* native callbacks cannot bypass Commands and transition validation;
* closing is idempotent;
* closed Windows are removed from the Workspace Registry;
* closed Windows retain no native bindings or active subscriptions;
* restoration reconstructs logical state before native projection;
* plugins access Window capabilities only through approved contracts;
* authoritative knowledge is referenced, never owned by Window State.

---

# 106. Related Documents

* `README.md`
* `WorkspaceLifecycle.md`
* `Tabs.md`
* `Editors.md`
* `Panels.md`
* `Navigation.md`
* `Layout.md`
* `LayoutPersistence.md`
* `WorkspaceRestoration.md`
* `WorkspaceRecovery.md`
* `../02-Architecture/WindowManagement.md`
* `../02-Architecture/WorkspaceArchitecture.md`
* `../02-Architecture/StateManagement.md`
* `../02-Architecture/CommandArchitecture.md`
* `../02-Architecture/EventArchitecture.md`
* `../02-Architecture/DependencyGraph.md`
* Platform Adapter Contracts
* Plugin SDK Contracts
* Architecture Decision Records

---

# 107. Status

**Approved**

This document establishes the authoritative implementation model for Workspace Windows within the KnowledgeOS Desktop Application.

Every Window is a Workspace-owned logical state aggregate. Native desktop windows are replaceable platform projections bound through approved adapters. Window identity, lifecycle, Tab ownership, Panel layout, Navigation Context, frame state and restoration metadata remain independent from native UI objects.

All Window Managers, Workspace services, commands, events, Platform adapters, plugins, restoration processes and native projections shall comply with the ownership, lifecycle, state, isolation and recovery rules defined herein.
