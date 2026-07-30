
# Desktop Application Navigation Architecture

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Architecture

**Document:** Navigation Architecture

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architecture responsible for navigation within the KnowledgeOS Desktop Application.

Navigation represents the controlled movement of the user between knowledge objects, document locations, collections, search results, graph nodes, annotations, Workspace surfaces and application contexts.

The Navigation Architecture preserves continuity, history, context and deterministic behavior without allowing user interface components to become independent navigation authorities.

---

# 2. Scope

This document governs:

* navigation identity;
* navigation targets;
* navigation contexts;
* navigation requests;
* history;
* back and forward navigation;
* deep links;
* breadcrumbs;
* cross-document navigation;
* cross-window navigation;
* cross-Workspace navigation;
* navigation restoration;
* unresolved targets;
* navigation commands;
* navigation events;
* navigation security;
* integration with search, editors, graph and plugins.

It does not define knowledge relationships, search algorithms or editor rendering.

---

# 3. Objectives

Navigation Architecture shall:

* provide predictable movement through knowledge;
* preserve origin and destination context;
* maintain independent navigation histories;
* support multiple windows;
* support deterministic restoration;
* separate navigation intent from presentation;
* prevent hidden global navigation state;
* support deep links;
* support extensibility;
* remain usable offline;
* preserve privacy and authorization boundaries.

---

# 4. Navigation Definition

Navigation is a state transition from one valid application location to another.

A navigation transition consists of:

* source context;
* destination target;
* navigation intent;
* presentation preference;
* history policy;
* resolution outcome.

Navigation does not inherently modify authoritative knowledge.

---

# 5. Architectural Position

Navigation operates within a Workspace and normally within a window-specific context.

```text
User Intent
    │
    ▼
Navigation Command
    │
    ▼
Navigation Manager
    │
    ├── Target Resolver
    ├── History Coordinator
    ├── Authorization Validation
    └── Presentation Routing
            │
            ▼
      Workspace Navigation State
            │
            ▼
        UI Projection
```

The Workspace owns Navigation State.

Navigation Manager coordinates operations over that state.

---

# 6. Navigation Ownership

Navigation State belongs to the Workspace.

Each independent window shall normally own its own Navigation Context within the Workspace.

```text
Workspace
│
├── Window A
│   └── Navigation Context A
│
├── Window B
│   └── Navigation Context B
│
└── Window C
    └── Navigation Context C
```

Navigation Manager shall not maintain an independent hidden history.

---

# 7. High-Level Model

```text
NavigationContext
│
├── NavigationContextIdentity
├── CurrentLocation
├── BackHistory
├── ForwardHistory
├── ParentContext
├── BreadcrumbState
├── SourceContext
├── NavigationPolicy
├── PendingNavigation
├── RestorationMetadata
└── NavigationVersion
```

Every Navigation Context shall belong to exactly one Workspace.

---

# 8. Navigation Context Identity

Each Navigation Context shall have a stable identity within its Workspace.

The identity shall support:

* window association;
* tab association where applicable;
* restoration;
* diagnostics;
* command routing;
* event correlation.

Navigation Context Identity shall not depend on the current target.

---

# 9. Navigation Location

A Navigation Location describes a resolved position within KnowledgeOS.

It may reference:

* Workspace surface;
* collection;
* project;
* Knowledge Object;
* document;
* document node;
* page;
* heading;
* anchor;
* annotation;
* asset;
* graph node;
* search result;
* plugin-contributed location;
* application settings surface.

A location shall use stable identities whenever possible.

---

# 10. Navigation Target

A Navigation Target describes the requested destination before resolution.

It may contain:

* target type;
* target identity;
* anchor;
* version reference;
* preferred editor;
* presentation mode;
* selection hint;
* source information;
* fallback behavior.

A target may be unresolved when the request is created.

---

# 11. Resolved Navigation Target

A Resolved Navigation Target contains sufficient information to present a valid destination.

It may include:

* canonical knowledge identity;
* available version;
* resolved anchor;
* compatible editor;
* authorization result;
* local availability;
* presentation descriptor;
* recovery fallback.

Only resolved and validated targets may become Current Location.

---

# 12. Navigation Request

A Navigation Request expresses intent to move to a target.

It shall include:

* source Navigation Context;
* target;
* navigation mode;
* history behavior;
* presentation preference;
* correlation identity;
* cancellation capability.

Navigation Requests shall be immutable once submitted.

---

# 13. Navigation Modes

Supported navigation modes may include:

* current tab;
* new tab;
* preview tab;
* current window;
* new window;
* existing matching view;
* auxiliary view;
* presentation view;
* background opening;
* cross-Workspace opening.

The requested mode may be adapted when platform or capability constraints require it.

---

# 14. Navigation Intent

Navigation intent explains why the navigation occurs.

Representative intents include:

* open;
* inspect;
* edit;
* compare;
* preview;
* follow relationship;
* reveal source;
* return;
* restore;
* search result activation;
* deep-link activation;
* annotation activation;
* plugin action.

Intent may affect editor selection and presentation behavior.

---

# 15. Navigation Manager

Navigation Manager is the application service responsible for navigation coordination.

Its responsibilities include:

* receiving navigation commands;
* resolving targets;
* validating access;
* selecting destination context;
* updating history;
* coordinating tab and window behavior;
* requesting editor activation;
* publishing navigation events;
* handling unresolved targets;
* restoring navigation state.

Navigation Manager shall not own authoritative Navigation State.

---

# 16. Target Resolver

Target Resolver converts a Navigation Target into a Resolved Navigation Target.

It may consult:

* Knowledge Engine;
* Library Engine;
* Search Engine;
* Annotation Engine;
* Render Engine;
* Plugin Registry;
* local availability state;
* authorization services.

Target Resolver shall use approved Platform contracts only.

---

# 17. Resolution Process

Target resolution shall:

1. validate target structure;
2. normalize identity;
3. determine target type;
4. validate authorization;
5. resolve knowledge reference;
6. validate version availability;
7. resolve anchor;
8. determine compatible presentation;
9. select fallback if necessary;
10. return a structured result.

Resolution shall not produce hidden side effects.

---

# 18. Current Location

Each Navigation Context may have one Current Location.

Current Location determines:

* active knowledge reference;
* active editor location;
* breadcrumb projection;
* navigation command availability;
* contextual panels;
* selection scope;
* title projection.

Current Location shall always be valid or explicitly represented as unavailable.

---

# 19. Navigation Transition

A Navigation Transition shall:

1. capture source location;
2. resolve destination;
3. validate destination;
4. determine presentation context;
5. update history according to policy;
6. update Current Location;
7. coordinate editor or view activation;
8. publish completion event.

The transition shall complete atomically within the Navigation Context.

---

# 20. Navigation History

Each Navigation Context shall maintain independent history.

History consists of:

* back entries;
* current location;
* forward entries.

History entries shall store navigation descriptors rather than live editor or view instances.

---

# 21. History Entry

A History Entry may contain:

* location descriptor;
* title projection;
* timestamp;
* source intent;
* selection descriptor;
* editor restoration hint;
* scroll or reading position;
* source context;
* availability state.

History entries shall remain compact and bounded.

---

# 22. Back Navigation

Back Navigation returns to the previous valid History Entry.

It shall:

* move the current entry to forward history;
* resolve the selected back entry;
* skip invalid entries according to policy;
* restore compatible location state;
* preserve the same Navigation Context.

Back Navigation shall not create a duplicate history entry.

---

# 23. Forward Navigation

Forward Navigation returns to a previously traversed entry after Back Navigation.

It shall:

* move the current entry to back history;
* resolve the selected forward entry;
* restore compatible state;
* preserve history order.

A new standard navigation transition shall normally clear forward history.

---

# 24. History Policies

A navigation operation may use one of the following policies:

* record;
* replace current;
* do not record;
* restore existing;
* merge equivalent;
* transient preview;
* reset history.

History policy shall be explicit.

UI components shall not decide history behavior independently.

---

# 25. Equivalent Locations

Navigation locations may be considered equivalent when they reference the same:

* Knowledge Object;
* document anchor;
* presentation context;
* version;
* relevant view mode.

Equivalent-location detection may prevent duplicate consecutive entries.

Equivalence shall remain deterministic.

---

# 26. Navigation History Limits

History shall be bounded by configurable limits.

Limits may consider:

* maximum entry count;
* maximum storage size;
* age;
* privacy mode;
* Workspace policy.

Removing old history shall not affect authoritative knowledge.

---

# 27. Breadcrumb Navigation

Breadcrumbs represent the resolved structural path to the Current Location.

A breadcrumb path may include:

* Workspace;
* collection;
* project;
* Knowledge Object;
* document section;
* content node;
* annotation.

Breadcrumbs are derived projections.

They shall not become an independent navigation state authority.

---

# 28. Parent Navigation

Parent Navigation moves to the logical parent of the Current Location.

The parent may be determined from:

* document structure;
* collection membership;
* project hierarchy;
* graph context;
* source relationship;
* plugin-defined hierarchy.

Where multiple parents exist, the originating context should be preserved.

---

# 29. Source Context

Source Context records where a navigation request originated.

It may include:

* source location;
* search query;
* graph traversal;
* related-content panel;
* annotation;
* plugin contribution;
* external deep link.

Source Context enables commands such as:

* return to search results;
* reveal originating collection;
* return to graph;
* reopen source annotation.

---

# 30. Deep Links

A Deep Link identifies an application destination outside the active Runtime context.

A Deep Link may reference:

* Workspace;
* Knowledge Object;
* document anchor;
* annotation;
* collection;
* search;
* command;
* plugin resource.

Deep Links shall use versioned, validated schemas.

---

# 31. Deep-Link Processing

Deep-link processing shall:

1. parse the link;
2. validate scheme and version;
3. validate target structure;
4. determine required Workspace;
5. validate permissions;
6. resolve the target;
7. select an appropriate presentation context;
8. execute navigation;
9. report structured failures.

Malformed links shall be rejected safely.

---

# 32. External Navigation

External navigation may originate from:

* Finder;
* browser;
* system search;
* notifications;
* Spotlight;
* another application;
* shared links;
* automation;
* command-line integration.

External requests shall enter through the Platform Adapter and be converted into Navigation Commands.

---

# 33. Internal Navigation

Internal navigation may originate from:

* links;
* search results;
* graph relationships;
* outline;
* breadcrumbs;
* recent items;
* history;
* annotations;
* panels;
* plugins;
* commands.

All internal sources shall use the same navigation contracts.

---

# 34. Cross-Document Navigation

Cross-document navigation shall preserve:

* source document;
* source location;
* target document;
* target anchor;
* return path;
* history policy.

The target may open in the current tab, a new tab or another window according to intent and preference.

---

# 35. Intra-Document Navigation

Intra-document navigation may move to:

* page;
* heading;
* block;
* anchor;
* annotation;
* search match;
* media location;
* footnote;
* reference.

The current editor may handle the final visual positioning after the target has been validated.

---

# 36. Anchor Navigation

Anchors shall use stable semantic identities where available.

Fallback strategies may include:

* structural path;
* content fingerprint;
* page and region;
* text quote;
* nearest valid ancestor;
* document start.

Anchor failure shall not invalidate the entire document target.

---

# 37. Search Navigation

Opening a search result shall preserve:

* search identity;
* query context;
* result identity;
* match location;
* result ordering;
* return context.

Users shall be able to return to the same search context where practical.

Search results themselves remain projections from the Search Engine.

---

# 38. Graph Navigation

Graph Navigation may follow:

* semantic relationships;
* explicit links;
* backlinks;
* inferred relationships;
* ontology paths;
* temporal relations.

The originating graph context shall remain available as Source Context.

Graph traversal shall not modify knowledge relationships.

---

# 39. Annotation Navigation

Annotation Navigation shall resolve:

* annotation identity;
* target knowledge identity;
* target version;
* anchor;
* compatible editor;
* visual highlight.

If the exact anchor is unavailable, the nearest valid fallback may be presented with a warning.

---

# 40. Navigation and Tabs

Navigation may:

* replace the Current Location of the active tab;
* activate an existing matching tab;
* create a new tab;
* create a preview tab;
* create a new window.

Tab behavior shall be coordinated with Window Manager and Editor Manager.

Navigation Manager shall not own tab collections.

---

# 41. Existing View Reuse

Navigation may reuse an existing view when:

* the same target is already open;
* the editor is compatible;
* user preference permits reuse;
* the requested mode does not require separation;
* the target belongs to the same Workspace.

Reuse policy shall remain predictable and configurable.

---

# 42. Preview Navigation

Preview Navigation creates a temporary presentation that may be replaced by subsequent preview requests.

A preview shall become persistent when:

* explicitly pinned;
* edited;
* moved;
* duplicated;
* otherwise promoted by user action.

Preview behavior shall not discard unsaved work.

---

# 43. Cross-Window Navigation

A navigation request may target another window.

The operation shall:

* identify the target window;
* validate Workspace ownership;
* update the target Navigation Context;
* activate the target window when requested;
* preserve source history;
* publish navigation and focus events.

Cross-window navigation shall not merge histories.

---

# 44. Cross-Workspace Navigation

Cross-Workspace Navigation shall be explicit.

It may:

* activate an existing Workspace;
* open a target Workspace;
* create a new Workspace context;
* copy a reference into the target Workspace;
* open the same knowledge in another Workspace.

State shall not transfer implicitly between Workspaces.

---

# 45. Navigation Restoration

Navigation restoration shall reconstruct:

* Current Location;
* back history;
* forward history;
* source context;
* breadcrumb state where reproducible;
* editor restoration hints.

Each restored entry shall be validated before use.

---

# 46. Partial Restoration

Partial navigation restoration is permitted when:

* a target no longer exists;
* an anchor moved;
* a plugin is unavailable;
* authorization changed;
* a version is unavailable;
* local content is missing.

Invalid entries may be marked unavailable, skipped or replaced with a safe fallback.

---

# 47. Unavailable Targets

An unavailable target shall produce a structured result.

Possible reasons include:

* not found;
* offline and not cached;
* permission denied;
* unsupported type;
* removed version;
* missing plugin;
* invalid anchor;
* corrupted reference.

The interface shall distinguish these outcomes.

---

# 48. Fallback Navigation

Fallback navigation may resolve to:

* nearest valid anchor;
* document root;
* Knowledge Object overview;
* containing collection;
* unavailable-content placeholder;
* Workspace home;
* recovery surface.

Fallback behavior shall be explicit and observable.

---

# 49. Offline Navigation

When offline, navigation may resolve only locally available targets.

The system shall distinguish:

* locally available;
* cached but stale;
* metadata only;
* unavailable;
* pending synchronization.

Offline navigation shall not fabricate content.

---

# 50. Navigation and Synchronization

Navigation may display synchronization state but shall not implement synchronization.

When a target is pending synchronization, Navigation Manager may:

* open the local version;
* show availability status;
* request synchronization;
* defer navigation;
* present a structured error.

---

# 51. Navigation and Editors

Navigation Manager determines the logical destination.

Editor Manager determines the compatible editor instance.

The editor performs final visual positioning.

```text
Navigation Manager
    │
    ├── Resolves target
    ├── Updates Navigation State
    └── Requests presentation
            │
            ▼
       Editor Manager
            │
            ▼
          Editor
            └── Reveals resolved location
```

---

# 52. Navigation and Selection

A navigation target may include a Selection Hint.

After navigation:

* the editor validates the selection;
* valid selection becomes Workspace Selection State;
* invalid selection is discarded or normalized;
* selection changes publish separate events.

Navigation and Selection remain related but distinct state transitions.

---

# 53. Navigation and Commands

Representative Navigation Commands include:

* NavigateTo;
* NavigateBack;
* NavigateForward;
* NavigateToParent;
* OpenDeepLink;
* OpenInNewTab;
* OpenInNewWindow;
* OpenInPreview;
* RevealSource;
* ReturnToSource;
* RestoreNavigationContext;
* ResetNavigationHistory.

Commands shall declare their target context and history policy.

---

# 54. Navigation Events

Representative Navigation Events include:

* NavigationRequested;
* NavigationResolved;
* NavigationStarted;
* NavigationCompleted;
* NavigationFailed;
* CurrentLocationChanged;
* BackHistoryChanged;
* ForwardHistoryChanged;
* SourceContextChanged;
* DeepLinkOpened;
* NavigationFallbackApplied;
* NavigationTargetUnavailable;
* NavigationContextRestored.

Events describe facts and shall not act as hidden navigation commands.

---

# 55. Navigation Cancellation

Navigation may be cancelled before the Current Location transition completes.

Cancellation shall:

* stop unresolved work;
* preserve the previous valid location;
* release temporary resources;
* produce a structured cancelled result;
* avoid partial history mutation.

Cancellation after completed navigation does not reverse the transition automatically.

---

# 56. Concurrency

Only one location-changing transition shall commit to a Navigation Context at a time.

Concurrent requests may be:

* queued;
* cancelled;
* superseded;
* routed to separate contexts.

Late results from superseded requests shall not overwrite newer navigation state.

---

# 57. Navigation Transactions

A navigation operation affecting tabs, windows and history shall execute as a coordinated application transaction.

Examples include:

* open in new window;
* move current view;
* activate existing tab;
* restore historical location.

The operation shall either complete consistently or leave the previous valid state intact.

---

# 58. Navigation Policies

Policies may govern:

* same-target reuse;
* preview behavior;
* new-tab behavior;
* external link handling;
* unavailable-target fallback;
* history recording;
* cross-Workspace behavior;
* offline behavior.

Policies shall be configurable without changing core navigation invariants.

---

# 59. Plugin Navigation

Plugins may contribute:

* navigation target types;
* target resolvers;
* deep-link handlers;
* views;
* breadcrumb segments;
* context actions;
* history metadata.

Plugin contributions shall:

* use declared contracts;
* respect capability permissions;
* validate external input;
* fail without corrupting Navigation State.

---

# 60. Security

Navigation shall enforce:

* target authorization;
* deep-link validation;
* plugin capability boundaries;
* Workspace isolation;
* version access;
* privacy restrictions;
* external input validation.

A resolved identity does not imply permission to display its content.

---

# 61. Privacy

Navigation history may reveal sensitive user activity.

Privacy controls may include:

* disabled history;
* bounded retention;
* private Workspace mode;
* title redaction;
* excluded targets;
* secure deep-link handling;
* cleared recent navigation.

Sensitive selections and full query text should not be persisted unless required.

---

# 62. Accessibility

Navigation shall support:

* keyboard operation;
* accessible focus transfer;
* clear destination announcements;
* predictable back and forward behavior;
* accessible breadcrumbs;
* visible focus indicators;
* reduced-motion preferences;
* assistive technology integration.

Focus transfer shall not disorient the user.

---

# 63. Performance

Navigation shall remain responsive.

The architecture shall support:

* asynchronous target resolution;
* cached metadata resolution;
* deferred content loading;
* immediate placeholders;
* cancellation;
* existing-view reuse;
* lazy editor materialization;
* bounded history.

Navigation requests shall not block the UI thread while resolving heavy content.

---

# 64. Observability

Navigation observability may include:

* resolution duration;
* transition duration;
* failure reasons;
* fallback usage;
* unavailable targets;
* history size;
* deep-link failures;
* existing-view reuse;
* cancelled requests;
* offline navigation outcomes.

Diagnostics shall avoid recording sensitive content.

---

# 65. Testing Strategy

Navigation Architecture shall support tests for:

* target resolution;
* current-location transitions;
* back and forward history;
* equivalent-location handling;
* deep links;
* external navigation;
* cross-window navigation;
* cross-Workspace navigation;
* offline behavior;
* unavailable targets;
* fallbacks;
* cancellation;
* concurrency;
* restoration;
* plugin target resolution;
* authorization.

---

# 66. Determinism

Given the same:

* Navigation Context;
* target;
* policy;
* available capabilities;
* authorization result;
* ordered external outcomes;

Navigation Manager shall produce the same logical transition result.

---

# 67. Idempotency

The following operations shall be idempotent where applicable:

* Navigation Context registration;
* restoration from the same descriptor;
* repeated navigation to an equivalent current location;
* deep-link normalization;
* repeated cancellation;
* history checkpointing for unchanged state.

Idempotency shall not prevent deliberate duplicate views.

---

# 68. Navigation Prohibitions

Navigation Architecture shall not:

* own authoritative knowledge;
* implement search algorithms;
* implement graph reasoning;
* maintain hidden global history;
* mutate UI components directly as state authorities;
* bypass authorization;
* access PostgreSQL directly;
* access NAS storage directly;
* merge window histories implicitly;
* trust external deep links without validation;
* persist live editor instances;
* allow late asynchronous results to overwrite newer state.

---

# 69. Validation Matrix

| Concern                     | Required Validation       |
| --------------------------- | ------------------------- |
| Navigation Context identity | Uniqueness tests          |
| Target resolution           | Resolver tests            |
| History behavior            | State-transition tests    |
| Deep links                  | Schema and security tests |
| Cross-window navigation     | Integration tests         |
| Cross-Workspace navigation  | Isolation tests           |
| Anchor resolution           | Compatibility tests       |
| Offline behavior            | Availability tests        |
| Cancellation                | Concurrency tests         |
| Restoration                 | Round-trip tests          |
| Plugin navigation           | Capability tests          |
| Accessibility               | Interaction tests         |

---

# 70. Anti-Patterns

The following are prohibited:

* one global navigation stack for the entire application;
* UI views mutating history directly;
* storing only display titles instead of stable identities;
* losing source context after following a relationship;
* creating duplicate consecutive history entries;
* treating every navigation as a new tab;
* silently switching Workspaces;
* ignoring authorization during target resolution;
* failing an entire document because one anchor is missing;
* using events as hidden navigation requests;
* performing heavy target resolution on the UI thread;
* restoring unvalidated history entries.

---

# 71. Architectural Invariants

The following invariants are mandatory:

* every Navigation Context belongs to exactly one Workspace;
* Window Navigation Contexts remain independent;
* the Workspace owns Navigation State;
* Navigation Manager coordinates state but does not own it;
* Current Location is always valid or explicitly unavailable;
* navigation targets use stable identities;
* history entries contain descriptors, not live views;
* back and forward navigation do not create duplicate entries;
* new standard navigation clears forward history unless policy states otherwise;
* external navigation is validated before resolution;
* authorization is checked before presentation;
* cross-Workspace navigation is explicit;
* navigation failures preserve the previous valid location;
* late asynchronous results cannot overwrite newer navigation state;
* UI remains a projection of Navigation State.

---

# 72. Related Documents

* `RuntimeArchitecture.md`
* `ApplicationArchitecture.md`
* `WorkspaceArchitecture.md`
* `WindowManagement.md`
* `SessionManagement.md`
* `CommandArchitecture.md`
* `EventArchitecture.md`
* `StateManagement.md`
* `DependencyGraph.md`
* `../03-Workspace/Navigation.md`
* `../03-Workspace/History.md`
* `../03-Workspace/RecentItems.md`
* `../06-Interaction/SearchExperience.md`
* `../07-Integration/EngineIntegration.md`
* Platform Architecture
* Kernel Architecture
* Architecture Decision Records

---

# 73. Status

**Approved**

This document establishes the authoritative Navigation Architecture for the KnowledgeOS Desktop Application.

Navigation is modeled as a validated transition between stable application locations. Navigation State belongs to the Workspace, while Navigation Manager coordinates target resolution, history, deep links, presentation routing and recovery through explicit commands and events.

All navigation implementations shall comply with the ownership, isolation, determinism, restoration, security and history rules defined herein.
