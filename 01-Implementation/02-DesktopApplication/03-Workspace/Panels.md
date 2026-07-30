
# Desktop Application Workspace Panels

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Workspace

**Document:** Panels

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative implementation model for Panels within the KnowledgeOS Desktop Application.

Panels are auxiliary Workspace surfaces that present contextual tools, navigation, metadata, annotations, search, AI assistance, tasks, relationships and plugin functionality around the primary Editor experience.

Panels extend the working environment without becoming owners of authoritative knowledge.

A Panel is a logical stateful Workspace component.

Its native view is only a projection.

---

# 2. Scope

This document governs:

* Panel identity;
* Panel ownership;
* Panel scopes;
* Panel lifecycle;
* Panel State;
* Panel Registry;
* Panel Factories;
* Panel capabilities;
* Panel placement;
* visibility;
* sizing;
* grouping;
* activation;
* focus;
* Window association;
* Editor association;
* Workspace association;
* contextual Panels;
* global Panels;
* temporary Panels;
* floating Panels;
* plugin Panels;
* commands;
* events;
* persistence;
* restoration;
* recovery;
* concurrency;
* security;
* privacy;
* accessibility;
* testing.

It does not define authoritative content storage, Window layout internals, Editor internals or native platform view implementations.

---

# 3. Objectives

The Panel architecture shall:

* support multiple Panel types;
* preserve explicit ownership;
* support Workspace-, Window-, Tab- and Editor-scoped Panels;
* avoid duplicate state ownership;
* remain independent from native view objects;
* support deterministic placement;
* support restoration;
* support contextual visibility;
* isolate plugin failures;
* preserve user layout;
* minimize memory use;
* support accessibility;
* operate offline where possible;
* integrate through Commands, Queries and Events.

---

# 4. Panel Definition

A Panel is a secondary application surface that exposes tools, information or controls related to the current Workspace context.

A Panel may display:

* Library content;
* document outline;
* metadata;
* annotations;
* search;
* graph relationships;
* AI assistance;
* task progress;
* synchronization state;
* properties;
* source information;
* plugin tools.

A Panel is not:

* a Window;
* a Tab;
* an Editor;
* a Platform Engine;
* a database;
* a Domain aggregate;
* authoritative knowledge;
* a native view controller.

---

# 5. Architectural Position

```text
Workspace
    │
    ├── Panel Registry
    │       │
    │       ├── Workspace Panels
    │       ├── Window Panels
    │       ├── Tab Panels
    │       └── Editor Panels
    │
    ├── Panel Manager
    │
    ├── Window Layout
    │
    └── Platform View Adapter
            │
            ▼
       Native Panel View
```

The Workspace owns Panel State.

Panel Manager coordinates Panel behavior.

Window Layout determines placement.

The native UI renders the projection.

---

# 6. Panel Ownership

Every Panel shall have one explicit owner scope.

Supported owner scopes are:

* Workspace;
* Window;
* Tab;
* Editor.

A Panel shall not be simultaneously owned by several scopes.

The ownership hierarchy is:

```text
Workspace
    ↓
Window
    ↓
Tab
    ↓
Editor
```

A narrower scope shall always belong to the same parent Workspace.

---

# 7. Workspace-Scoped Panels

A Workspace-scoped Panel belongs to the Workspace independently from the active Window or Editor.

Examples include:

* Library;
* global Search;
* Tasks;
* Synchronization;
* Workspace AI Assistant;
* Plugins;
* recent items.

A Workspace-scoped Panel may be projected into one or more Windows according to layout policy, but it retains one authoritative Panel State.

---

# 8. Window-Scoped Panels

A Window-scoped Panel belongs to one Window.

Examples include:

* Window navigator;
* Window outline;
* Window inspector;
* Window-specific toolbar Panel;
* presentation controls.

Its lifecycle follows the owning Window.

---

# 9. Tab-Scoped Panels

A Tab-scoped Panel belongs to one Tab.

Examples include:

* search within current Tab;
* document-specific outline;
* Tab-specific history;
* comparison controls;
* local references.

Its state is preserved while the Tab exists.

---

# 10. Editor-Scoped Panels

An Editor-scoped Panel belongs to one Editor.

Examples include:

* PDF thumbnails;
* graph filters;
* media transcript;
* image tools;
* Markdown symbols;
* Editor-specific inspector;
* plugin Editor tools.

Its lifecycle normally follows the owning Editor.

---

# 11. Panel Aggregate

```text
PanelState
│
├── PanelIdentity
├── PanelType
├── OwnerScope
├── OwnerIdentity
├── WorkspaceIdentity
├── LifecycleState
├── PlacementState
├── VisibilityState
├── SizeState
├── GroupIdentity
├── ActiveSection
├── CapabilitySet
├── ContextBinding
├── LocalWorkingState
├── RestorationMetadata
├── PluginOwnership
└── PanelVersion
```

All relationships shall use stable identities.

---

# 12. Panel Identity

Every Panel shall have a stable Panel Identity.

Panel Identity supports:

* ownership;
* command routing;
* event scoping;
* layout association;
* restoration;
* diagnostics;
* plugin isolation;
* lifecycle control.

Panel Identity shall not depend on:

* visible title;
* native view identity;
* current placement;
* current owner title;
* memory address;
* display coordinates.

---

# 13. Panel Type Identity

Panel Type identifies the implementation category.

Examples include:

* LibraryPanel;
* OutlinePanel;
* InspectorPanel;
* SearchPanel;
* GraphPanel;
* AnnotationPanel;
* MetadataPanel;
* AIAssistantPanel;
* TasksPanel;
* SyncPanel;
* PluginPanel.

Panel Type and Panel Identity are distinct.

Several Panel instances may share one Panel Type where the contract permits it.

---

# 14. Panel Descriptor

A Panel Descriptor is the serializable representation required for restoration.

It may contain:

* Panel Identity;
* Panel Type;
* owner scope;
* owner identity;
* placement;
* visibility;
* sizing;
* grouping;
* active section;
* context binding;
* restoration metadata;
* plugin ownership;
* schema version.

It shall not contain:

* native view instances;
* Platform Engine instances;
* open subscriptions;
* database clients;
* mutable Domain objects;
* live tasks.

---

# 15. Core Panel Types

KnowledgeOS may provide core Panels such as:

* Library Panel;
* Outline Panel;
* Inspector Panel;
* Search Panel;
* Graph Panel;
* Annotations Panel;
* Metadata Panel;
* AI Assistant Panel;
* Tasks Panel;
* Synchronization Panel;
* Sources Panel;
* Relationships Panel;
* History Panel;
* Recent Items Panel;
* Plugins Panel.

Each Panel type shall define its supported scopes and capabilities.

---

# 16. Library Panel

The Library Panel provides access to the user’s KnowledgeOS Library.

It may support:

* collections;
* folders or logical groupings;
* Knowledge Objects;
* recent content;
* pinned items;
* imports;
* filters;
* search;
* availability indicators;
* synchronization indicators.

The Library Panel references authoritative Library data through Platform contracts.

---

# 17. Outline Panel

The Outline Panel presents structural navigation for the active content target.

It may display:

* headings;
* sections;
* pages;
* structural nodes;
* bookmarks;
* annotation anchors;
* semantic groups.

The outline is a projection of authoritative or derived structure.

---

# 18. Inspector Panel

The Inspector Panel presents contextual information about the current selection or active content.

It may include:

* properties;
* metadata;
* permissions;
* provenance;
* relationships;
* version;
* synchronization status;
* local availability;
* plugin-defined inspectors.

The Inspector Panel shall not duplicate authoritative state.

---

# 19. Search Panel

The Search Panel provides query construction and result exploration.

It may support:

* global search;
* current document search;
* filters;
* facets;
* saved queries;
* recent queries;
* result previews;
* search scopes.

Search execution belongs to the Search Engine.

---

# 20. Graph Panel

The Graph Panel presents relationships associated with the active context.

It may support:

* related nodes;
* local neighborhood;
* incoming relationships;
* outgoing relationships;
* semantic similarity;
* filtering;
* navigation;
* preview.

The Panel shall not own graph truth.

---

# 21. Annotations Panel

The Annotations Panel presents annotations related to the active content or selection.

It may support:

* annotation list;
* filters;
* threads;
* unresolved annotations;
* highlights;
* tags;
* anchors;
* navigation.

Authoritative annotation state remains in the Annotation Engine.

---

# 22. Metadata Panel

The Metadata Panel presents and optionally edits metadata.

It may support:

* title;
* authors;
* dates;
* identifiers;
* tags;
* provenance;
* source;
* custom properties;
* relationships.

Changes shall be submitted through approved Commands.

---

# 23. AI Assistant Panel

The AI Assistant Panel provides contextual AI capabilities without replacing the active Editor.

It may support:

* questions about current content;
* summaries;
* explanations;
* extraction;
* suggestions;
* related knowledge discovery;
* rewriting;
* local or remote model selection.

AI output remains provisional until explicitly accepted.

---

# 24. Tasks Panel

The Tasks Panel presents long-running application operations.

It may include:

* imports;
* exports;
* OCR;
* indexing;
* AI jobs;
* synchronization;
* rendering;
* plugin tasks.

Task truth remains in Runtime or Platform task infrastructure.

---

# 25. Synchronization Panel

The Synchronization Panel presents synchronization status and issues.

It may support:

* pending operations;
* conflicts;
* device state;
* NAS availability;
* retries;
* recent synchronization activity;
* offline state.

It shall not implement synchronization algorithms.

---

# 26. Sources Panel

The Sources Panel presents provenance and source information.

It may show:

* original files;
* import source;
* URLs;
* document versions;
* extracted assets;
* processing history;
* external identifiers.

Source data remains authoritative in Platform and Domain layers.

---

# 27. Relationships Panel

The Relationships Panel presents explicit and inferred relationships.

It may support:

* related Knowledge Objects;
* citations;
* backlinks;
* references;
* semantic similarity;
* collection membership;
* graph navigation.

The Panel is a projection of relationship data.

---

# 28. Panel Lifecycle

A Panel may occupy the following states:

| State      | Meaning                                           |
| ---------- | ------------------------------------------------- |
| Defined    | Logical Panel State exists                        |
| Resolving  | Compatible implementation is being selected       |
| Creating   | Panel implementation is being created             |
| Hidden     | Panel exists but is not visible                   |
| Showing    | Visible projection is being prepared              |
| Visible    | Panel is shown                                    |
| Active     | Panel is the active auxiliary interaction surface |
| Inactive   | Panel is visible but not active                   |
| Suspended  | Heavy resources are released                      |
| Recovering | Recovery is in progress                           |
| Closing    | Disposal is in progress                           |
| Closed     | Panel has been removed                            |
| Failed     | Panel could not reach a usable state              |

---

# 29. Panel Lifecycle Ownership

The Workspace owns logical Panel lifecycle.

Panel Manager coordinates lifecycle transitions.

Native visibility events shall not become lifecycle authority.

A user action on a native close control shall become an explicit Panel Command.

---

# 30. Panel Creation

Panel creation shall:

1. validate Panel type;
2. validate owner scope;
3. validate owner identity;
4. validate Workspace ownership;
5. resolve Panel Factory;
6. allocate Panel Identity;
7. create logical Panel State;
8. register the Panel;
9. establish placement;
10. initialize context binding;
11. create visual projection when required;
12. publish `PanelCreated`.

---

# 31. Panel Registry

The Workspace Panel Registry owns all Panel State.

It shall support:

* registration;
* lookup;
* uniqueness validation;
* type lookup;
* owner lookup;
* scope lookup;
* visibility lookup;
* plugin ownership lookup;
* removal;
* restoration.

The registry shall not expose unrestricted mutable state.

---

# 32. Panel Factory

Panel implementations shall be created through Panel Factories.

A Panel Factory shall declare:

* Panel Type;
* supported owner scopes;
* supported placements;
* required capabilities;
* context requirements;
* platform support;
* restoration compatibility;
* singleton or multi-instance policy;
* plugin ownership where applicable;
* priority.

---

# 33. Panel Factory Registry

The Panel Factory Registry shall support:

* core Factories;
* plugin Factories;
* deterministic resolution;
* capability filtering;
* version compatibility;
* removal;
* diagnostics.

UI code shall not instantiate Panels directly.

---

# 34. Singleton Panels

Some Panel types may allow only one instance per scope.

Examples may include:

* one Library Panel per Workspace;
* one Outline Panel per Tab;
* one Inspector Panel per Window;
* one Sync Panel per Workspace.

Singleton behavior shall be declared by the Panel Factory.

---

# 35. Multi-Instance Panels

Some Panel types may permit multiple instances.

Examples include:

* several comparison inspectors;
* several plugin tools;
* several scoped search Panels;
* several annotation Panels with different filters.

Each instance shall have a distinct Panel Identity.

---

# 36. Placement Model

A Panel shall have one logical placement.

Supported placements may include:

* leading sidebar;
* trailing sidebar;
* bottom region;
* top utility region;
* editor-attached region;
* floating Window;
* temporary overlay;
* popover;
* detached auxiliary surface.

Placement is logical state, not a native object reference.

---

# 37. Leading Sidebar

The leading sidebar generally hosts navigation-oriented Panels.

Typical Panels include:

* Library;
* Outline;
* Search;
* Recent Items;
* History.

The exact contents remain configurable.

---

# 38. Trailing Sidebar

The trailing sidebar generally hosts contextual and inspection Panels.

Typical Panels include:

* Inspector;
* Metadata;
* Annotations;
* Relationships;
* AI Assistant.

Placement shall not imply ownership.

---

# 39. Bottom Region

The bottom region may host operational or horizontal Panels.

Typical Panels include:

* Tasks;
* Search results;
* Console-like plugin tools;
* synchronization details;
* media transcript.

The bottom region may support height resizing and collapse.

---

# 40. Editor-Attached Panel

An Editor-attached Panel is visually adjacent to or embedded near an Editor.

It may host:

* thumbnails;
* graph filters;
* page navigation;
* media timeline;
* editor-specific tools.

Its owner scope shall normally be Editor or Tab.

---

# 41. Floating Panel

A floating Panel is projected through an auxiliary Window or floating native surface.

The logical Panel remains owned by its original Workspace scope.

Floating presentation shall not create a second authoritative Panel State.

---

# 42. Temporary Overlay

A temporary overlay Panel may appear for short interactions.

Examples include:

* command palette results;
* quick search;
* metadata preview;
* link picker;
* AI quick action;
* annotation composer.

Temporary overlays may use transient lifecycle rules but still require explicit ownership.

---

# 43. Panel Grouping

Several Panels may share one placement region through a Panel Group.

A Panel Group may support:

* tabbed sections;
* accordion sections;
* stacked sections;
* ordered tools;
* one active Panel;
* persistent group size.

Panel Group State belongs to layout and Workspace state.

---

# 44. Panel Group Aggregate

```text
PanelGroupState
│
├── GroupIdentity
├── WorkspaceIdentity
├── WindowIdentity
├── Placement
├── PanelOrder
├── ActivePanelIdentity
├── VisibilityState
├── SizeState
└── GroupVersion
```

A Panel may belong to at most one group at a time.

---

# 45. Visibility State

Panel visibility may include:

* visible;
* hidden;
* collapsed;
* auto-hidden;
* conditionally hidden;
* unavailable;
* suspended.

Visibility is distinct from lifecycle closure.

---

# 46. Showing a Panel

Showing a Panel shall:

1. validate Panel lifecycle;
2. validate owner existence;
3. validate placement;
4. resolve current context;
5. create or resume visual projection;
6. update visibility state;
7. update Panel Group state;
8. optionally activate the Panel;
9. publish `PanelShown`.

---

# 47. Hiding a Panel

Hiding a Panel shall:

* preserve logical Panel State;
* preserve placement;
* preserve size where appropriate;
* release active focus;
* optionally release heavy projection resources;
* update visibility;
* publish `PanelHidden`.

Hiding does not unregister the Panel.

---

# 48. Collapsing a Panel

Collapsing preserves a minimal visible affordance while reducing occupied space.

A collapsed Panel may preserve:

* icon;
* title;
* badge;
* notification count;
* reopen control.

Collapsed and hidden are distinct states.

---

# 49. Auto-Hide

Auto-hide may temporarily reveal a Panel based on:

* pointer interaction;
* keyboard activation;
* context change;
* user command;
* notification.

Auto-hide behavior shall not change Panel ownership or persistent visibility preference unless explicitly committed.

---

# 50. Panel Activation

Panel activation makes the Panel the current auxiliary interaction surface.

Activation shall:

* validate visibility;
* update Workspace Active Context;
* update focus;
* derive command availability;
* preserve active Editor identity where appropriate;
* publish `PanelActivated`.

Panel activation shall not automatically replace the active Editor.

---

# 51. Panel Deactivation

Panel deactivation shall:

* preserve logical state;
* normalize focus;
* capture meaningful local state;
* release active-only resources;
* publish `PanelDeactivated`.

A visible Panel may remain inactive.

---

# 52. Panel Focus

Panel focus identifies the currently focused control or area inside the Panel.

Panel focus is distinct from:

* Panel activation;
* Editor activation;
* Workspace Selection;
* content target.

Focus shall be represented by logical descriptors where restoration is meaningful.

---

# 53. Context Binding

A Panel may bind to one or more context sources.

Supported bindings may include:

* active Workspace;
* active Window;
* active Tab;
* active Editor;
* current Selection;
* fixed Knowledge Object;
* fixed search context;
* explicit plugin context.

The binding model shall be explicit.

---

# 54. Dynamic Context Panels

A dynamic context Panel follows the active context.

Examples include:

* Inspector following current Selection;
* Outline following active Editor;
* Annotations following active document;
* Metadata following selected Knowledge Object.

Dynamic Panels shall react through Events or observable state projections.

---

# 55. Pinned Context Panels

A Panel may pin its context to a specific target.

A pinned Panel shall not change when active selection or Editor changes.

Pinned context may include:

* Knowledge Object;
* document;
* annotation;
* search query;
* graph node;
* content version.

Pinned context shall use stable identities.

---

# 56. Context Change

When a Panel context changes, the Panel shall:

1. validate the new context;
2. cancel obsolete requests;
3. increment context version;
4. update derived capabilities;
5. request new data;
6. reject stale results;
7. update projection;
8. publish `PanelContextChanged`.

---

# 57. Panel Capability Model

Panel capabilities may include:

* inspect;
* navigate;
* search;
* edit metadata;
* create annotation;
* filter;
* execute AI action;
* manage task;
* manage synchronization;
* pin context;
* detach;
* move;
* resize;
* collapse;
* close.

Capabilities shall be explicit and derived.

---

# 58. Effective Capabilities

Effective Panel capabilities derive from:

* Panel Type;
* owner scope;
* current context;
* user permissions;
* Platform availability;
* offline state;
* plugin permissions;
* lifecycle state;
* Workspace privacy policy;
* placement.

UI controls shall not infer capabilities independently.

---

# 59. Panel Local State

Panel Local State may include:

* filter values;
* sort order;
* expanded sections;
* selected subsection;
* query draft;
* panel-specific viewport;
* temporary form input;
* active inspector tab;
* temporary AI conversation state.

Local State shall remain bounded and scope-aware.

---

# 60. Panel State Boundary

Panel State may own:

* placement;
* visibility;
* size;
* active subsection;
* local filters;
* pinned context;
* transient query input;
* presentation preferences;
* restoration metadata.

It shall not own:

* authoritative knowledge;
* authoritative annotations;
* synchronization truth;
* global search index;
* Runtime task truth;
* native views;
* Platform Engine instances.

---

# 61. Panel Data Loading

Panel data shall be loaded through approved Queries and Engine Gateway contracts.

A Panel may request:

* metadata;
* relationships;
* annotations;
* search results;
* tasks;
* synchronization state;
* document structure;
* Library projections;
* AI results.

Direct persistence access is prohibited.

---

# 62. Loading State

Panel loading state may include:

* idle;
* queued;
* loading;
* partially available;
* ready;
* stale;
* unavailable offline;
* unauthorized;
* failed;
* cancelled.

Loading State shall be explicit.

---

# 63. Partial Availability

A Panel may remain partially useful when some data is unavailable.

Examples include:

* cached metadata without remote updates;
* local annotations without synchronization state;
* outline without semantic enrichment;
* tasks without remote provider details;
* Library metadata without asset previews.

Partial availability shall be represented clearly.

---

# 64. Panel Mutations

A Panel shall submit authoritative mutations through explicit Commands.

Examples include:

* update metadata;
* create annotation;
* remove collection membership;
* retry synchronization;
* cancel task;
* save AI output;
* pin item;
* create relationship.

Panels shall not mutate Platform state directly.

---

# 65. Optimistic UI

Panels may use optimistic UI when the corresponding Command contract supports it.

Optimistic changes shall:

* be reversible;
* track operation identity;
* validate expected version;
* reconcile with authoritative results;
* expose failure;
* avoid irreversible local assumptions.

---

# 66. Panel Commands

Representative Panel Commands include:

* CreatePanel;
* ShowPanel;
* HidePanel;
* ActivatePanel;
* DeactivatePanel;
* CollapsePanel;
* ExpandPanel;
* MovePanel;
* ResizePanel;
* PinPanelContext;
* UnpinPanelContext;
* DetachPanel;
* AttachPanel;
* ResetPanelState;
* ClosePanel;
* RestorePanel;
* RecoverPanel.

---

# 67. Panel Events

Representative Panel Events include:

* PanelDefined;
* PanelCreated;
* PanelCreationFailed;
* PanelShown;
* PanelHidden;
* PanelActivated;
* PanelDeactivated;
* PanelCollapsed;
* PanelExpanded;
* PanelMoved;
* PanelResized;
* PanelContextChanged;
* PanelContextPinned;
* PanelContextUnpinned;
* PanelDetached;
* PanelAttached;
* PanelSuspended;
* PanelResumed;
* PanelRecoveryStarted;
* PanelRecovered;
* PanelClosing;
* PanelClosed;
* PanelFailed.

---

# 68. Panel Queries

Representative Panel Queries include:

* GetPanel;
* GetPanels;
* GetVisiblePanels;
* GetPanelsByOwner;
* GetPanelsByType;
* GetPanelPlacement;
* GetPanelCapabilities;
* GetPanelContext;
* GetPanelLocalState;
* CanShowPanel;
* CanExecutePanelCommand.

Queries shall return immutable projections.

---

# 69. Command Routing

Panel Commands shall identify:

* Workspace Identity;
* Panel Identity;
* owner identity where required;
* expected Panel version;
* Active Context snapshot when relevant;
* correlation identity.

Commands shall not rely only on global active state when routing could become ambiguous.

---

# 70. Event Scope

Panel Events shall include:

* Panel Identity;
* Panel Type;
* Workspace Identity;
* owner scope;
* owner identity;
* resulting version;
* correlation identity;
* causation identity.

Events shall not expose native view references.

---

# 71. Panel Placement Changes

Moving a Panel shall:

1. validate target placement;
2. validate owner scope compatibility;
3. validate Panel Group compatibility;
4. update old group;
5. update new group;
6. preserve Panel Identity;
7. preserve local state;
8. commit layout atomically;
9. publish `PanelMoved`.

---

# 72. Detaching a Panel

Detaching a Panel may move it from an embedded region to a floating auxiliary surface.

Detachment shall:

* preserve Panel Identity;
* preserve owner scope;
* create or assign an auxiliary Window projection;
* update placement;
* preserve context binding;
* publish `PanelDetached`.

Detachment shall not clone the Panel.

---

# 73. Attaching a Panel

Attaching returns a detached Panel to an embedded placement.

It shall:

* validate target Window;
* validate placement support;
* preserve Panel State;
* dispose obsolete floating projection;
* update layout;
* publish `PanelAttached`.

---

# 74. Resizing

Panel resizing shall update logical Size State.

Size State may include:

* preferred size;
* minimum size;
* maximum size;
* collapsed size;
* normalized proportion;
* last expanded size.

High-frequency resize updates may be coalesced.

---

# 75. Size Constraints

Size constraints shall consider:

* Panel Type;
* placement;
* Window dimensions;
* accessibility;
* Editor minimum area;
* plugin declarations;
* platform safe areas.

A Panel shall not reduce the primary Editor below its minimum usable size.

---

# 76. Panel Ordering

Panels within a group shall have explicit deterministic ordering.

Ordering may depend on:

* user customization;
* core defaults;
* Panel priority;
* plugin priority;
* restoration descriptor.

Native view order shall not become architectural authority.

---

# 77. Badges and Indicators

Panels may expose derived indicators such as:

* task count;
* annotation count;
* conflict count;
* unread AI response;
* synchronization warning;
* search result count;
* plugin status.

Indicators are projections and shall remain bounded.

---

# 78. Notifications

A Panel may request user attention through approved notification mechanisms.

Attention states may include:

* informational;
* warning;
* error;
* action required;
* operation completed.

Panels shall not create uncontrolled native notifications directly.

---

# 79. Plugin Panels

Plugins may contribute Panels through the Plugin SDK.

A plugin Panel shall declare:

* plugin identity;
* Panel Type;
* supported owner scopes;
* supported placements;
* singleton policy;
* required capabilities;
* permissions;
* context contract;
* serialization schema;
* lifecycle;
* fallback behavior;
* disposal behavior.

---

# 80. Plugin Panel Isolation

Plugin Panels shall not:

* access internal Workspace State directly;
* access arbitrary other Panel state;
* instantiate Platform Engines;
* access persistence directly;
* bypass Commands;
* retain native resources after disposal;
* register unbounded global observers;
* block core Workspace closure indefinitely.

---

# 81. Plugin Panel State

Plugin Panel State shall be:

* namespaced;
* schema versioned;
* bounded;
* serializable;
* independently migratable;
* independently disposable;
* validated before restoration.

Invalid plugin state shall not block core Panel restoration.

---

# 82. Plugin Failure

A plugin Panel failure may result in:

* Panel suspension;
* Panel closure;
* placeholder projection;
* plugin disablement;
* state quarantine;
* restoration fallback.

The Workspace and other Panels shall remain usable.

---

# 83. Panel Restoration

Panel restoration shall:

1. validate Panel Descriptor;
2. validate owner scope;
3. validate owner existence;
4. validate Workspace ownership;
5. migrate schema;
6. resolve Panel Factory;
7. create logical Panel State;
8. restore placement;
9. restore visibility;
10. restore size and grouping;
11. restore context binding;
12. restore local state;
13. create visual projection when needed;
14. validate invariants;
15. publish `PanelRestored`.

---

# 84. Restoration Order

Panel restoration shall occur after its owners exist.

```text
Workspace
    ↓
Window
    ↓
Tab
    ↓
Editor
    ↓
Panel State
    ↓
Panel Group
    ↓
Placement
    ↓
Visual Projection
```

A Panel shall not restore before its declared owner.

---

# 85. Missing Owner During Restoration

If a Panel owner is unavailable:

* Editor-scoped Panel may be discarded or reassigned only by explicit fallback;
* Tab-scoped Panel may be discarded with the missing Tab;
* Window-scoped Panel may be moved only by approved normalization policy;
* Workspace-scoped Panel may restore independently.

Fallback shall be deterministic.

---

# 86. Missing Plugin During Restoration

If a plugin Panel implementation is unavailable:

* preserve quarantined descriptor if policy permits;
* omit active projection;
* record diagnostic information;
* continue core restoration;
* offer restoration when the plugin becomes available.

The missing plugin shall not block Workspace startup.

---

# 87. Invalid Placement During Restoration

If a placement is unsupported:

* use the Panel Type default;
* use the nearest compatible region;
* move to a fallback Panel Group;
* hide the Panel;
* present it as detached if approved.

The Panel shall not restore into an invalid layout.

---

# 88. Panel Recovery

Panel recovery may be required after:

* projection failure;
* invalid local state;
* plugin crash;
* owner context change;
* unsupported placement;
* loading failure;
* stale subscription;
* restoration failure.

Recovery shall preserve valid state where possible.

---

# 89. Recovery Strategies

Panel recovery may use:

* reload data;
* recreate visual projection;
* reset local filters;
* reset placement;
* remove invalid context;
* switch to dynamic context;
* disable plugin contribution;
* replace with core fallback;
* hide the Panel.

Recovery shall remain observable.

---

# 90. Panel Suspension

Panels may be suspended to reduce memory or processing use.

Suspension may release:

* native views;
* large result sets;
* graph layouts;
* media previews;
* AI conversation projections;
* plugin visual resources;
* non-essential subscriptions.

Logical state shall remain available.

---

# 91. Panel Resumption

Resumption shall:

* validate owner existence;
* validate placement;
* restore projection;
* refresh context;
* reload stale data;
* restore focus only when appropriate;
* publish `PanelResumed`.

---

# 92. Panel Closure

Panel closure shall:

1. validate lifecycle;
2. resolve pending local input;
3. cancel Panel-scoped tasks;
4. remove Panel from its group;
5. dispose visual projection;
6. remove subscriptions;
7. release plugin resources;
8. unregister Panel;
9. publish `PanelClosed`.

Closure shall be idempotent.

---

# 93. Owner Closure

When a Panel owner closes:

* Editor-scoped Panels close with the Editor;
* Tab-scoped Panels close with the Tab;
* Window-scoped Panels close with the Window;
* Workspace-scoped Panels survive until Workspace closure.

Transfer to another owner requires an explicit supported operation.

---

# 94. Pending Local Input

A Panel may contain pending local input such as:

* metadata edits;
* annotation draft;
* search query;
* AI prompt;
* relationship form;
* plugin settings.

Closure policy shall define whether input is:

* committed;
* saved as draft;
* discarded;
* transferred;
* confirmed by the user.

---

# 95. Panel Tasks

Panel-scoped tasks may include:

* search;
* data loading;
* graph expansion;
* AI request;
* annotation creation;
* metadata validation;
* export initiation;
* plugin processing.

Every task shall declare ownership and cancellation policy.

---

# 96. Task Cancellation

When a Panel closes or changes context:

* obsolete tasks shall be cancelled;
* stale results shall be rejected;
* transferable tasks require explicit ownership transfer;
* completion Events shall not reactivate the Panel.

---

# 97. Concurrency

Panel operations requiring ordering shall use a Panel-scoped serialization boundary.

Serialized operations may include:

* creation;
* placement change;
* context replacement;
* restoration;
* recovery;
* closure.

Read-only loading may execute concurrently with version validation.

---

# 98. Context Change and Load Race

When context changes during loading:

* the previous request shall be cancelled where possible;
* context version shall increment;
* late results shall be rejected;
* the new context shall initiate a new request.

---

# 99. Move and Close Race

A closing Panel shall not be moved.

If a move is committed before closure begins, closure shall dispose the Panel from its new placement.

Partial group membership is prohibited.

---

# 100. Owner Change Race

If an owner closes while Panel context is updating:

* owner closure takes precedence;
* pending context updates shall be cancelled;
* the Panel shall close or follow approved reassignment policy;
* stale results shall be rejected.

---

# 101. Visibility and Suspension Race

If a suspended Panel is shown:

* showing shall trigger resumption;
* only one projection shall be created;
* duplicate lifecycle Events shall be avoided;
* current visibility version shall determine the final state.

---

# 102. Offline Behavior

Panels shall remain usable offline when their data and capabilities are locally available.

Offline-capable behavior may include:

* Library browsing from cache;
* document outline;
* metadata inspection;
* local annotations;
* local search;
* local AI;
* task history;
* queued operations.

Unavailable remote data shall be represented explicitly.

---

# 103. Synchronization Awareness

Panels may present synchronization information but shall not own synchronization logic.

Examples include:

* pending metadata updates;
* annotation conflicts;
* Library availability;
* offline status;
* retry state;
* remote changes.

Synchronization actions shall use Platform Commands.

---

# 104. AI Integration

Panels may invoke AI through AI Engine contracts.

AI Panel operations shall:

* capture explicit context;
* respect privacy policy;
* identify provider mode;
* support cancellation;
* associate results with request context;
* preserve provisional output status.

Remote provider SDKs shall not appear in Panel implementations.

---

# 105. AI Context Changes

If the active context changes while an AI request is running:

* the request remains bound to its captured context;
* the result shall not silently apply to the new context;
* the Panel may present the result in its original context;
* user approval remains required for authoritative use.

---

# 106. Security

Panel operations shall enforce:

* Workspace ownership;
* owner-scope validation;
* command authorization;
* content authorization;
* plugin permissions;
* context access limits;
* AI provider policy;
* safe restoration;
* secure external links.

Panel visibility does not imply unrestricted access.

---

# 107. Privacy

Panel State may reveal sensitive information through:

* search terms;
* metadata;
* annotations;
* relationships;
* task history;
* AI prompts;
* synchronization details;
* recent content.

Privacy protections may include:

* redaction;
* hidden system previews;
* restricted diagnostics;
* protected local state;
* disabled remote AI;
* reduced history;
* plugin context restrictions.

---

# 108. Accessibility

Panels shall support:

* keyboard navigation;
* accessible titles;
* logical focus order;
* discoverable show and hide Commands;
* screen-reader descriptions;
* resizable text;
* minimum usable dimensions;
* high contrast;
* reduced motion;
* accessible badges and status indicators.

Detached and floating Panels shall remain accessible as part of the same Workspace.

---

# 109. Performance

Panel implementation shall support:

* lazy creation;
* lazy data loading;
* context-driven refresh;
* incremental rendering;
* result virtualization;
* coalesced resize updates;
* suspension of hidden Panels;
* bounded local state;
* version-based stale result rejection.

---

# 110. Large Result Sets

Panels handling large data sets shall use:

* pagination;
* virtualization;
* incremental loading;
* filtering;
* bounded caches;
* stable item identities;
* background processing.

The full result set shall not be retained unnecessarily in Workspace State.

---

# 111. Memory Management

Hidden, suspended or closed Panels shall release:

* native views;
* large projections;
* temporary search results;
* graph layouts;
* media previews;
* plugin resources;
* obsolete subscriptions;
* completed task references.

Logical descriptors may remain for restoration until Panel disposal.

---

# 112. Memory Pressure

Under memory pressure, the Workspace may:

* suspend hidden Panels;
* discard derived caches;
* clear old result pages;
* release thumbnails;
* unload plugin projections;
* preserve only restoration-critical state.

Panel identity, ownership, placement and local recoverable state shall remain intact while suspended.

---

# 113. Observability

Panel observability may include:

* Panel count;
* visible Panel count;
* creation duration;
* loading duration;
* context-change count;
* move count;
* suspension count;
* recovery count;
* plugin failure count;
* stale result count;
* memory use.

Sensitive context shall not be logged.

---

# 114. Diagnostics

Panel diagnostics should include:

* Workspace Identity;
* Panel Identity;
* Panel Type;
* owner scope;
* owner identity;
* placement;
* lifecycle state;
* visibility;
* context version;
* Panel version;
* plugin identity;
* Command Identity;
* correlation identity;
* failure category.

---

# 115. Testing Strategy

Panel tests shall cover:

* identity;
* owner scopes;
* creation;
* Factory resolution;
* singleton policy;
* multi-instance policy;
* placement;
* grouping;
* visibility;
* activation;
* context binding;
* pinned context;
* dynamic context;
* loading;
* mutations;
* detachment;
* restoration;
* recovery;
* plugin Panels;
* offline behavior;
* concurrency;
* closure;
* memory release.

---

# 116. Contract Tests

Every Panel implementation shall pass contract tests for:

* ownership;
* lifecycle;
* capability reporting;
* context handling;
* Commands;
* cancellation;
* serialization;
* restoration;
* stale result rejection;
* disposal;
* security;
* privacy;
* accessibility baseline.

---

# 117. Architecture Tests

Automated architecture tests should verify:

* every Panel has one explicit owner scope;
* every Panel belongs to one Workspace;
* Panel State contains no native objects;
* Panel Manager does not duplicate state;
* UI components do not construct Panels directly;
* Panels access Platform capabilities through Engine Gateway;
* Panels do not access persistence directly;
* plugin Panels use Plugin SDK contracts;
* closed Panels release resources and subscriptions;
* Panel placement remains in logical layout state.

---

# 118. Determinism

Given the same:

* Panel Descriptor;
* owner hierarchy;
* Panel Factory Registry;
* layout;
* capabilities;
* plugin set;
* current context;
* ordered Platform results;

Panel restoration and context resolution shall produce the same logical outcome.

---

# 119. Idempotency

The following operations shall be idempotent where applicable:

* Panel registration;
* repeated showing;
* repeated hiding;
* repeated activation;
* repeated collapse;
* repeated expansion;
* repeated suspension;
* repeated closure;
* repeated disposal;
* setting unchanged placement;
* restoring from the same validated descriptor.

---

# 120. Panel Prohibitions

Panel implementations shall not:

* own authoritative knowledge;
* access PostgreSQL directly;
* access NAS storage directly;
* instantiate Platform Engines;
* store native views in logical state;
* mutate Workspace State directly;
* bypass Commands for authoritative mutations;
* infer ownership from visual placement;
* share mutable Panel State across Workspaces;
* use visible titles as identity;
* apply AI output automatically;
* retain obsolete context results;
* restore unvalidated plugin state;
* block Workspace closure indefinitely;
* keep resources after closure.

---

# 121. Validation Matrix

| Concern            | Required Validation            |
| ------------------ | ------------------------------ |
| Panel identity     | Uniqueness tests               |
| Owner scope        | Ownership tests                |
| Factory resolution | Deterministic resolution tests |
| Singleton policy   | Registry tests                 |
| Placement          | Layout tests                   |
| Grouping           | Ordering tests                 |
| Visibility         | Lifecycle tests                |
| Context binding    | Context tests                  |
| Context changes    | Stale-result tests             |
| Mutations          | Command tests                  |
| Plugin Panels      | Isolation tests                |
| Restoration        | Round-trip tests               |
| Recovery           | Failure-injection tests        |
| Offline behavior   | Availability tests             |
| Security           | Authorization tests            |
| Accessibility      | Accessibility tests            |
| Performance        | Panel benchmarks               |
| Disposal           | Resource tests                 |

---

# 122. Anti-Patterns

The following are prohibited:

* treating native sidebar views as Panel State;
* storing the same Panel State in Workspace and Panel Manager;
* deriving ownership from where a Panel is displayed;
* creating plugin Panels directly inside UI code;
* using one mutable Panel instance in several Workspaces;
* allowing hidden Panels to retain unbounded resources;
* loading new context without invalidating previous requests;
* restoring Panels before their owners;
* sharing one Inspector state between unrelated contexts without explicit dynamic binding;
* using Panel local state as authoritative metadata;
* applying AI responses to the current selection after the selection changed;
* closing an owner while leaving orphaned Panels registered.

---

# 123. Architectural Invariants

The following invariants are mandatory:

* every Panel has one stable Panel Identity;
* every Panel belongs to exactly one Workspace;
* every Panel has exactly one explicit owner scope;
* every Panel owner belongs to the same Workspace;
* Panel State is owned by the Workspace;
* Panel Manager coordinates but does not duplicate state;
* Panel placement is logical state;
* native views are replaceable projections;
* Panel State contains no native platform objects;
* every Panel is created through a registered Panel Factory;
* every Panel capability is explicit and derived;
* every Panel mutation uses approved Commands;
* every asynchronous result is validated against current context version;
* dynamic and pinned context behaviors are explicit;
* hidden and closed are distinct states;
* a closed Panel is absent from the Panel Registry;
* owner closure resolves all owned Panels;
* plugin Panels use approved Plugin SDK contracts;
* AI output remains provisional until explicitly accepted;
* restoration occurs only after the Panel owner exists;
* authoritative knowledge remains outside Panel State.

---

# 124. Child Implementation Areas

Panel implementation may later be refined into:

```text
Panels/
├── README.md
├── PanelLifecycle.md
├── PanelRegistry.md
├── PanelFactory.md
├── PanelCapabilities.md
├── PanelPlacement.md
├── PanelGroups.md
├── ContextBinding.md
├── LibraryPanel.md
├── OutlinePanel.md
├── InspectorPanel.md
├── SearchPanel.md
├── GraphPanel.md
├── AnnotationsPanel.md
├── MetadataPanel.md
├── AIAssistantPanel.md
├── TasksPanel.md
├── SynchronizationPanel.md
├── PluginPanels.md
├── PanelRestoration.md
└── PanelRecovery.md
```

These documents shall refine this model without changing its ownership or dependency rules.

---

# 125. Related Documents

* `README.md`
* `WorkspaceLifecycle.md`
* `Windows.md`
* `Tabs.md`
* `Editors.md`
* `Navigation.md`
* `Selection.md`
* `History.md`
* `Layout.md`
* `LayoutPersistence.md`
* `WorkspaceRestoration.md`
* `WorkspaceRecovery.md`
* `../02-Architecture/WorkspaceArchitecture.md`
* `../02-Architecture/WindowManagement.md`
* `../02-Architecture/StateManagement.md`
* `../02-Architecture/CommandArchitecture.md`
* `../02-Architecture/EventArchitecture.md`
* `../02-Architecture/DependencyGraph.md`
* Platform Knowledge Engine
* Platform Annotation Engine
* Platform Search Engine
* Platform AI Engine
* Platform Synchronization Engine
* Plugin SDK Contracts
* Architecture Decision Records

---

# 126. Status

**Approved**

This document establishes the authoritative implementation model for Panels within the KnowledgeOS Desktop Application.

Panels are Workspace-owned auxiliary interaction components with one explicit owner scope. They present contextual tools and projections while remaining independent from authoritative knowledge, Platform Engine implementations and native UI objects.

All Panel Managers, Factories, core Panels, plugin Panels, commands, events, context bindings, restoration processes, recovery services and native projections shall comply with the ownership, lifecycle, placement, context, security and isolation rules defined herein.
