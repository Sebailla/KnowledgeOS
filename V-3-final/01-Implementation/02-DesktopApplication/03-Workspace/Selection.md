
# Desktop Application Workspace Selection

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Workspace

**Document:** Selection

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative implementation model for Selection within the KnowledgeOS Desktop Application.

Selection represents the logical set of knowledge targets, content ranges or interaction elements currently selected by the user inside a Workspace context.

Selection is Workspace-owned logical state.

Editors, Panels and native views project and manipulate Selection through Commands and Events, but they do not become the authoritative owners of it.

---

# 2. Scope

This document governs:

* Selection identity;
* Selection State;
* Selection ownership;
* Selection scope;
* active Selection;
* primary and secondary Selection;
* single and multiple Selection;
* content Selection;
* text Selection;
* structural Selection;
* spatial Selection;
* graph Selection;
* asset Selection;
* annotation Selection;
* metadata Selection;
* collection Selection;
* cross-surface Selection;
* Selection projection;
* Selection synchronization;
* Selection Commands;
* Selection Events;
* restoration;
* recovery;
* concurrency;
* plugin Selection;
* security;
* privacy;
* accessibility;
* testing.

It does not define native selection APIs, Editor-specific rendering algorithms or authoritative knowledge ownership.

---

# 3. Objectives

The Selection architecture shall:

* preserve explicit ownership;
* support different Selection kinds;
* support single and multiple Selection;
* support stable logical identities;
* remain independent from native UI objects;
* support Editors and Panels consistently;
* support deterministic Commands;
* reject stale Selection updates;
* preserve privacy;
* support accessibility;
* allow bounded restoration;
* isolate plugin contributions;
* avoid coupling Selection to content rendering.

---

# 4. Selection Definition

Selection is the logical representation of the user’s current chosen target or targets.

A Selection may identify:

* one Knowledge Object;
* several Knowledge Objects;
* a text range;
* a document node;
* a page region;
* an image region;
* a graph node or edge;
* an annotation;
* a metadata field;
* a collection item;
* a search result;
* a plugin-defined selectable target.

Selection does not own the selected knowledge.

---

# 5. Architectural Position

```text
Workspace
    │
    ├── Selection State
    │
    ├── Active Context
    │
    ├── Windows
    │      └── Tabs
    │             └── Editors
    │
    └── Panels
```

Editors and Panels produce Selection requests.

The Workspace validates and commits Selection State.

All consumers observe immutable Selection projections.

---

# 6. Selection Ownership

Selection State belongs to the Workspace.

The Workspace owns:

* current Selection;
* Selection identity;
* Selection version;
* source context;
* primary target;
* secondary targets;
* Selection kind;
* restoration metadata;
* logical focus association.

Editors may own transient local interaction state before it becomes Workspace Selection.

Native views may own platform-native selection objects only as temporary projections.

---

# 7. Selection Aggregate

```text
SelectionState
│
├── SelectionIdentity
├── WorkspaceIdentity
├── SourceContext
├── SelectionKind
├── PrimaryTarget
├── SecondaryTargets
├── SelectionMode
├── AnchorTarget
├── FocusTarget
├── PresentationHints
├── RestorationMetadata
└── SelectionVersion
```

Every Selection update shall produce a new immutable logical state.

---

# 8. Selection Identity

Each committed Selection State shall have a stable Selection Identity for the duration of that logical Selection.

Selection Identity supports:

* Command correlation;
* Event correlation;
* AI context capture;
* plugin interaction;
* asynchronous validation;
* diagnostics;
* stale-result rejection.

A materially different Selection shall normally produce a new Selection Identity.

---

# 9. Selection Version

Selection Version increments whenever the committed Selection State changes.

Versioning supports:

* optimistic validation;
* stale-result rejection;
* derived projection updates;
* command preconditions;
* AI request correlation;
* plugin context validation.

Selection Identity and Selection Version are distinct.

---

# 10. Selection Source Context

Every Selection shall identify the context from which it originated.

Source Context may include:

* Workspace Identity;
* Window Identity;
* Tab Identity;
* Editor Identity;
* Panel Identity;
* plugin identity;
* Command Identity;
* interaction type.

The source context shall always belong to the same Workspace.

---

# 11. Selection Kinds

Core Selection kinds may include:

* None;
* KnowledgeObject;
* Document;
* ContentNode;
* TextRange;
* StructuralRange;
* Page;
* PageRegion;
* ImageRegion;
* MediaRange;
* Annotation;
* GraphNode;
* GraphEdge;
* MetadataField;
* CollectionItem;
* SearchResult;
* PluginDefined.

Selection kinds shall be explicit.

---

# 12. Empty Selection

An empty Selection represents the absence of a logical selected target.

An empty Selection shall still have:

* Workspace Identity;
* Selection Version;
* source context where meaningful;
* a deterministic state representation.

The absence of Selection shall not be represented by undefined mutable state.

---

# 13. Single Selection

Single Selection contains exactly one Primary Target and no Secondary Targets.

Single Selection is the default mode for:

* one Knowledge Object;
* one annotation;
* one graph node;
* one search result;
* one metadata field;
* one content node.

---

# 14. Multiple Selection

Multiple Selection contains:

* one Primary Target;
* zero or more Secondary Targets;
* deterministic ordering;
* one Selection Kind or a declared mixed-selection contract.

Multiple Selection shall remain bounded.

---

# 15. Primary Target

The Primary Target is the main selected item.

It determines:

* default command context;
* Inspector projection;
* metadata projection;
* AI context priority;
* navigation actions;
* accessibility announcement.

Every non-empty Selection shall have exactly one Primary Target.

---

# 16. Secondary Targets

Secondary Targets extend the Selection beyond the Primary Target.

They may support:

* bulk operations;
* comparison;
* tagging;
* export;
* collection membership;
* deletion requests;
* relationship creation.

Secondary Targets shall have deterministic ordering and unique identities.

---

# 17. Selection Ordering

Multiple Selection ordering shall be explicit.

Ordering may derive from:

* user interaction order;
* document order;
* list order;
* spatial order;
* graph order;
* explicit sorting policy.

Native collection enumeration shall not become authoritative ordering.

---

# 18. Selection Mode

Selection Mode may include:

* replace;
* extend;
* toggle;
* range;
* additive;
* subtractive;
* preserve-primary;
* programmatic.

The requested mode shall be normalized before committing Selection State.

---

# 19. Anchor Target

Range and extended Selection may use an Anchor Target.

The Anchor Target defines the fixed starting point for:

* shift selection;
* structural range;
* list range;
* page range;
* graph path range.

Anchor Target shall use stable logical identity.

---

# 20. Focus Target

Focus Target identifies the currently active item inside the Selection.

Focus Target may differ from Primary Target during:

* keyboard traversal;
* range extension;
* grid navigation;
* graph exploration;
* accessibility interaction.

Focus Target is logical interaction state.

---

# 21. Selection Target

A Selection Target is an immutable descriptor.

It may contain:

* target identity;
* target type;
* content identity;
* content version;
* logical anchor;
* range descriptor;
* source descriptor;
* capability hints;
* plugin namespace.

It shall not contain native view objects.

---

# 22. Target Identity

Every Selection Target shall use stable identity appropriate to its domain.

Examples include:

* Knowledge Object Identity;
* document identity;
* node identity;
* annotation identity;
* graph node identity;
* asset identity;
* collection item identity;
* plugin public identity.

Visible labels and indexes are not identities.

---

# 23. Text Selection

Text Selection identifies a logical text range.

It may include:

* content target identity;
* start anchor;
* end anchor;
* direction;
* selected text hash;
* content version;
* semantic context.

Raw native text-range objects shall not be stored in Selection State.

---

# 24. Text Anchors

Text anchors should use stable logical positions where possible.

Potential anchor models include:

* content node and offset;
* paragraph identity and character offset;
* structural path;
* semantic node identity;
* normalized document position.

Pixel coordinates alone are insufficient.

---

# 25. Text Selection Validation

Text Selection shall validate:

* target existence;
* content version;
* range ordering;
* anchor compatibility;
* access permission;
* maximum size where applicable.

Invalid text ranges shall be normalized or rejected.

---

# 26. Structural Selection

Structural Selection identifies one or more structural nodes.

Examples include:

* headings;
* sections;
* paragraphs;
* table rows;
* outline nodes;
* document blocks.

Structural Selection shall reference stable node identities.

---

# 27. Spatial Selection

Spatial Selection identifies a normalized region.

It may apply to:

* PDF pages;
* images;
* diagrams;
* canvas content;
* rendered layouts.

A spatial descriptor may include:

* target identity;
* page or surface identity;
* normalized rectangle or polygon;
* rotation;
* coordinate-space version.

---

# 28. Page Selection

Page Selection identifies one or more pages.

It may support:

* export;
* annotation;
* comparison;
* rotation;
* extraction;
* printing.

Page numbers alone shall not be used when stable page identities are available.

---

# 29. Media Range Selection

Media Selection may identify:

* one timestamp;
* a time range;
* transcript segment;
* audio region;
* video frame range.

Media ranges shall use normalized temporal descriptors.

---

# 30. Graph Selection

Graph Selection may contain:

* graph nodes;
* graph edges;
* clusters;
* paths;
* inferred relationships.

Graph layout coordinates are presentation hints, not target identity.

---

# 31. Annotation Selection

Annotation Selection identifies one or more annotations.

It may include:

* annotation identity;
* anchor target;
* thread identity;
* version;
* status.

The annotation body remains authoritative outside Selection State.

---

# 32. Metadata Selection

Metadata Selection identifies a metadata field or property.

It may include:

* target identity;
* schema property identity;
* field path;
* value index;
* edit capability.

The current metadata value shall not be duplicated as Selection truth.

---

# 33. Collection Selection

Collection Selection identifies one or more collection members or collection nodes.

It may support:

* reordering;
* membership change;
* bulk actions;
* export;
* tagging;
* navigation.

Collection ordering shall come from authoritative or projected collection data.

---

# 34. Search Result Selection

Search Result Selection identifies a result and its underlying target.

It may include:

* search context identity;
* result identity;
* underlying knowledge target;
* result rank;
* match anchor.

Search rank is contextual metadata, not target identity.

---

# 35. Mixed Selection

Mixed Selection combines different target kinds.

Mixed Selection shall be allowed only when:

* the source surface explicitly supports it;
* command capability resolution supports it;
* serialization is deterministic;
* target count remains bounded.

Unsupported mixed Selection shall be normalized or rejected.

---

# 36. Cross-Surface Selection

A Selection may originate in one surface and be projected into others.

Examples include:

* Editor Selection shown in Inspector;
* graph node Selection shown in Metadata Panel;
* Library item Selection shown in Relationships Panel;
* annotation Selection highlighted in Editor.

Cross-surface projection does not transfer ownership.

---

# 37. Selection Projection

Each consumer may convert Workspace Selection into a surface-specific projection.

Examples include:

* text highlight;
* row highlight;
* selected graph node;
* Inspector context;
* toolbar state;
* context menu state.

Projection shall not mutate authoritative Selection State.

---

# 38. Projection Compatibility

A surface shall determine whether it can project the current Selection.

Projection results may be:

* exact;
* partial;
* related;
* unsupported;
* unavailable;
* stale.

Unsupported surfaces shall not fabricate a local equivalent.

---

# 39. Editor Selection

An Editor may produce Selection Commands based on user interaction.

The Editor shall:

* normalize native selection;
* create logical target descriptors;
* include current content version;
* identify source context;
* submit a Selection Command;
* project the committed result.

The Editor shall not directly overwrite Workspace Selection.

---

# 40. Panel Selection

A Panel may become the Selection source.

Examples include:

* Library item Selection;
* annotation list Selection;
* search result Selection;
* relationship Selection;
* task Selection.

Panel-originated Selection follows the same Workspace validation rules.

---

# 41. Navigation and Selection

Navigation and Selection are related but distinct.

Navigation changes Current Location.

Selection changes the chosen target inside a context.

A navigation operation may:

* clear Selection;
* preserve Selection;
* restore Selection;
* create a default Selection.

The behavior shall be explicit.

---

# 42. Selection After Navigation

After successful navigation, Selection policy may:

* clear the previous Selection;
* select the navigation target;
* restore a location-specific Selection;
* preserve a compatible Selection;
* defer Selection until content loads.

The policy shall depend on target and navigation intent.

---

# 43. Selection-Driven Navigation

A Selection may enable navigation actions such as:

* open;
* reveal;
* follow relationship;
* show source;
* inspect annotation anchor;
* open in new Tab;
* open in new Window.

Selection itself shall not navigate without an explicit Command.

---

# 44. Selection and Focus

Selection and focus are distinct.

A surface may have focus without a Selection.

A Selection may remain active while focus moves to:

* Inspector;
* toolbar;
* command palette;
* AI Panel;
* another control.

Focus changes shall not automatically clear Selection unless policy requires it.

---

# 45. Selection and Active Context

The Active Context determines which Selection is command-relevant.

The active Selection normally belongs to:

```text
Active Workspace
    ↓
Active Window
    ↓
Active Tab
    ↓
Active Editor or Active Panel
    ↓
Workspace Selection
```

Every selected target shall remain valid within the Workspace.

---

# 46. Selection Commands

Representative Selection Commands include:

* SetSelection;
* ClearSelection;
* ReplaceSelection;
* ExtendSelection;
* ToggleSelectionTarget;
* SelectRange;
* SelectAll;
* SelectPrimaryTarget;
* SetSelectionFocus;
* RestoreSelection;
* NormalizeSelection;
* RevalidateSelection.

---

# 47. SetSelection

`SetSelection` replaces the current Selection with a validated new Selection.

It shall include:

* Workspace Identity;
* source context;
* Selection kind;
* Primary Target;
* Secondary Targets;
* Selection mode;
* expected Selection version where required;
* correlation identity.

---

# 48. ClearSelection

`ClearSelection` commits an explicit empty Selection.

It may be caused by:

* user action;
* navigation;
* target deletion;
* owner closure;
* context invalidation;
* restoration fallback.

Clearing shall publish a Selection change Event.

---

# 49. ExtendSelection

`ExtendSelection` adds targets or expands a range.

It shall validate:

* compatible target kind;
* source context;
* anchor target;
* ordering;
* selection-size limits;
* command capability.

---

# 50. ToggleSelectionTarget

`ToggleSelectionTarget` adds or removes one target.

When removing the Primary Target, the system shall select a deterministic replacement Primary Target or clear Selection.

---

# 51. SelectAll

`SelectAll` is context-sensitive.

It may mean:

* all visible list items;
* all document text;
* all graph nodes in scope;
* all collection items;
* all search results currently loaded;
* all selectable elements in an Editor region.

The command scope shall be explicit.

---

# 52. Selection Events

Representative Selection Events include:

* SelectionRequested;
* SelectionChanged;
* SelectionCleared;
* SelectionExtended;
* SelectionReduced;
* SelectionPrimaryChanged;
* SelectionFocusChanged;
* SelectionNormalized;
* SelectionInvalidated;
* SelectionRestored;
* SelectionRestorationFailed.

---

# 53. SelectionChanged Event

`SelectionChanged` shall include:

* Selection Identity;
* Workspace Identity;
* source context;
* previous Selection Identity;
* Selection kind;
* Primary Target identity;
* secondary target count;
* resulting Selection version;
* correlation identity;
* causation identity.

Sensitive selected content shall not be included by default.

---

# 54. Selection Queries

Representative Queries include:

* GetSelection;
* GetPrimarySelectionTarget;
* GetSelectionTargets;
* GetSelectionKind;
* GetSelectionSource;
* GetSelectionCapabilities;
* CanExecuteForSelection;
* GetSelectionProjection;
* ValidateSelectionTarget.

Queries shall return immutable projections.

---

# 55. Selection Capability Resolution

Selection capabilities may include:

* open;
* edit;
* annotate;
* delete;
* export;
* compare;
* tag;
* relate;
* copy;
* reveal source;
* execute AI action;
* add to collection;
* remove from collection.

Capabilities derive from all selected targets and current context.

---

# 56. Multi-Selection Capabilities

For Multiple Selection, capability resolution may use:

* intersection of capabilities;
* explicit bulk capability;
* target-type-specific rules;
* partial-operation contract;
* prohibited mixed operation.

The resolution policy shall be explicit for each Command.

---

# 57. Selection Validation

Every committed Selection shall validate:

* Workspace ownership;
* target existence;
* target identity;
* target visibility;
* access permission;
* source context;
* content version where required;
* Selection kind compatibility;
* size bounds;
* plugin namespace.

---

# 58. Selection Normalization

Normalization may:

* remove duplicate targets;
* reorder targets deterministically;
* replace invalid Primary Target;
* collapse equivalent ranges;
* remove inaccessible targets;
* convert empty Multiple Selection to empty Selection;
* normalize anchor ordering;
* remove stale presentation hints.

Normalization shall preserve user intent where possible.

---

# 59. Selection Invalidation

Selection may become invalid when:

* target is deleted;
* target becomes inaccessible;
* content version removes the selected node;
* Tab closes;
* Editor closes;
* plugin unloads;
* Workspace changes;
* restoration target is unavailable.

Invalidation shall be explicit.

---

# 60. Invalidation Policy

When Selection becomes invalid, the system may:

* clear Selection;
* remove invalid Secondary Targets;
* choose a valid replacement Primary Target;
* remap a text anchor;
* select a parent node;
* preserve a diagnostic placeholder.

The policy shall be deterministic.

---

# 61. Content Version Changes

When selected content changes version:

* stable targets may remain selected;
* text ranges may require remapping;
* removed nodes shall invalidate;
* spatial regions may require transformation;
* stale content hashes shall be rejected.

Version migration shall use approved content mapping contracts.

---

# 62. Selection Remapping

Selection remapping may attempt to preserve intent across content changes.

Remapping may use:

* stable node identity;
* anchor migration;
* semantic correspondence;
* page identity;
* annotation anchor mapping;
* version mapping.

Failed remapping shall never silently select unrelated content.

---

# 63. Selection Restoration

Selection restoration may occur during Workspace, Window, Tab or Editor restoration.

Restorable Selection shall be limited to meaningful stable descriptors.

Transient native state shall not be restored.

---

# 64. Restoration Sequence

Selection restoration shall:

1. restore Workspace;
2. restore owning Window and Tab;
3. restore Navigation Context;
4. restore Editor or Panel context;
5. validate Selection descriptor;
6. resolve target identities;
7. migrate anchors if required;
8. normalize Selection;
9. commit restored Selection;
10. create UI projections.

Logical Selection shall precede native highlighting.

---

# 65. Restorable Selection Types

Suitable restoration candidates may include:

* selected Knowledge Object;
* selected outline node;
* selected annotation;
* selected graph node;
* selected collection item;
* active metadata field;
* bounded text range with stable anchors;
* bounded page region.

Transient drag or hover Selection shall not be restored.

---

# 66. Restoration Failure

If Selection restoration fails:

* Workspace restoration shall continue;
* invalid Selection shall be cleared;
* valid partial Multiple Selection may be preserved;
* diagnostics shall record the reason;
* the active Editor shall choose a safe focus target.

Selection failure shall not block Workspace startup.

---

# 67. Selection Recovery

Selection recovery may be required after:

* invalid descriptor;
* stale content version;
* missing target;
* plugin failure;
* corrupted anchor;
* incompatible Editor replacement.

Recovery shall favor safe empty Selection over fabricated targets.

---

# 68. Recovery Strategies

Recovery strategies may include:

* remove invalid targets;
* select nearest valid structural ancestor;
* remap stable anchor;
* select owning Knowledge Object;
* clear Selection;
* preserve a non-interactive diagnostic target.

Recovery shall be observable.

---

# 69. Selection Persistence

Selection persistence shall be bounded and policy-controlled.

Persisted data may include:

* Selection kind;
* stable target identities;
* primary target;
* bounded secondary targets;
* stable anchors;
* source context;
* restoration metadata.

Selected content text shall not be persisted unless explicitly required and permitted.

---

# 70. Persistence Limits

The system shall define limits for:

* maximum persisted selected targets;
* maximum range descriptors;
* plugin Selection state size;
* restoration age;
* text excerpt retention;
* private Workspace behavior.

Large transient Selection shall not be serialized in full.

---

# 71. Recent Selection

Selection History is distinct from Navigation History.

KnowledgeOS may maintain limited recent Selection context for:

* restoration;
* command undo;
* accessibility;
* contextual return.

A separate persistent Selection History is not required by this document.

---

# 72. Selection and History

History may record Selection changes when required for:

* command undo;
* editor interaction;
* restoration;
* semantic operations.

Routine pointer movement and transient Selection changes shall not create unbounded history.

---

# 73. Selection Coalescing

High-frequency Selection changes may be coalesced.

Examples include:

* text drag selection;
* graph lasso;
* image region resizing;
* range extension;
* keyboard traversal.

The final committed state shall remain deterministic.

---

# 74. Selection Debouncing

Debouncing may apply to derived consumers such as:

* Inspector loading;
* AI context preview;
* relationship lookup;
* metadata loading;
* search contextualization.

The authoritative Selection Command itself should remain responsive.

---

# 75. Selection Concurrency

Selection mutations shall use a Workspace Selection serialization boundary.

Only one Selection state transition may commit at a time.

Independent derived queries may run concurrently.

---

# 76. Stale Selection Commands

A Selection Command may be rejected when:

* expected Selection version is stale;
* source Tab closed;
* source Editor changed;
* target version changed;
* Workspace became inactive or closed;
* newer Selection Command superseded it.

The rejection shall be explicit.

---

# 77. Selection and Async Loading Race

When Selection triggers asynchronous loading:

* the request shall capture Selection Identity and Version;
* results shall validate current Selection;
* late results shall not update a different Selection;
* cancellation shall be requested when practical.

---

# 78. Selection and Navigation Race

If navigation begins while Selection is changing:

* Navigation policy shall determine Selection preservation;
* committed navigation may invalidate pending Selection updates;
* stale Selection Commands shall be rejected;
* final state shall reflect current Navigation Location.

---

# 79. Selection and Editor Replacement Race

When an Editor is replaced:

* transferable Selection shall be mapped;
* incompatible Selection shall be cleared;
* stale native callbacks from the old Editor shall be ignored;
* the new Editor shall project only committed logical Selection.

---

# 80. Selection and Target Deletion Race

If a selected target is deleted:

* deletion commit takes precedence;
* Selection shall be revalidated;
* invalid targets shall be removed;
* a deterministic replacement Primary Target may be chosen;
* stale commands against the deleted target shall fail.

---

# 81. Selection and Workspace Closure

When Workspace closure begins:

* new Selection Commands shall be rejected;
* pending derived requests shall be cancelled;
* restorable Selection may be checkpointed;
* sensitive transient Selection shall be discarded;
* Selection observers shall be disposed.

---

# 82. Plugin Selection

Plugins may contribute selectable target types through the Plugin SDK.

A plugin Selection contract shall declare:

* plugin identity;
* Selection kind identity;
* target descriptor schema;
* ownership rules;
* capability mapping;
* serialization support;
* restoration support;
* privacy classification;
* disposal behavior.

---

# 83. Plugin Selection Isolation

Plugin Selection shall not:

* expose private internal object references;
* bypass Workspace validation;
* mutate core Selection State directly;
* persist unbounded payloads;
* resolve targets outside declared permissions;
* block Selection normalization;
* prevent Workspace restoration.

---

# 84. Missing Plugin

If a plugin-defined Selection is restored without its plugin:

* the Selection shall be omitted or quarantined;
* core Selection restoration shall continue;
* a diagnostic may be recorded;
* no arbitrary fallback target shall be fabricated.

---

# 85. AI Context from Selection

Selection may provide context for AI operations.

The AI request shall capture an immutable Selection snapshot containing only required information.

The snapshot may include:

* target identities;
* selected text where permitted;
* target metadata;
* content version;
* user-approved related context.

---

# 86. AI Selection Privacy

Before remote AI use, the system shall validate:

* provider policy;
* selected content privacy;
* Workspace privacy settings;
* user authorization;
* target restrictions;
* redaction requirements.

Selection shall not automatically grant AI access to surrounding content.

---

# 87. AI Output and Selection

AI output may reference the captured Selection.

It shall not automatically:

* replace selected content;
* create annotations;
* modify metadata;
* navigate;
* alter Selection.

Every authoritative action requires an explicit Command.

---

# 88. Clipboard Integration

Selection may be copied through approved Clipboard Commands.

Clipboard output may include:

* plain text;
* Markdown;
* rich text;
* internal Knowledge reference;
* link;
* image;
* serialized public target descriptor.

Sensitive content shall respect privacy policy.

---

# 89. Drag and Drop

Selection may initiate drag-and-drop.

The drag payload shall use normalized descriptors.

Potential operations include:

* move collection membership;
* create relationship;
* attach asset;
* open in another Window;
* export;
* reorder structure.

Native drag objects shall not enter Workspace State.

---

# 90. Context Menus

Context menu commands derive from Selection capabilities.

The menu shall be built from:

* core Commands;
* Editor Commands;
* Panel Commands;
* plugin contributions;
* current authorization;
* target compatibility.

Menu items shall not mutate Selection or knowledge directly.

---

# 91. Command Availability

Command availability based on Selection shall be computed centrally.

It shall consider:

* Selection kind;
* Primary Target;
* all Secondary Targets;
* Workspace policy;
* active context;
* permissions;
* offline availability;
* synchronization state;
* plugin capabilities.

---

# 92. Security

Selection operations shall enforce:

* Workspace ownership;
* target authorization;
* plugin permissions;
* visibility constraints;
* private content rules;
* command permissions;
* secure restoration;
* clipboard policy;
* AI provider policy.

Knowing a target identity does not grant access.

---

# 93. Privacy

Selection State may reveal sensitive information through:

* selected text;
* selected Knowledge Objects;
* annotations;
* metadata fields;
* search results;
* AI context;
* clipboard content;
* restoration metadata.

Privacy policy may require:

* no Selection persistence;
* title or target redaction;
* text omission;
* restricted diagnostics;
* disabled remote AI;
* protected clipboard behavior;
* limited plugin access.

---

# 94. Accessibility

Selection shall support:

* keyboard selection;
* range extension;
* screen-reader announcements;
* clear Primary Target semantics;
* accessible multi-selection counts;
* logical focus movement;
* high-contrast highlighting;
* non-color-only indicators;
* reduced-motion behavior.

Native accessibility Selection shall project the logical Selection where supported.

---

# 95. Visual Representation

Visual Selection representation may vary by surface.

It may include:

* highlight;
* border;
* row state;
* graph node emphasis;
* page overlay;
* region outline;
* active Inspector context.

Visual styling is not authoritative Selection State.

---

# 96. Performance

Selection implementation shall support:

* fast immutable state replacement;
* bounded Multiple Selection;
* coalesced high-frequency updates;
* incremental projection updates;
* lazy capability resolution;
* cancellation of stale derived work;
* stable target identity lookup.

---

# 97. Large Selections

Large Selection shall use bounded descriptors.

The system may:

* cap explicit target lists;
* represent contiguous ranges compactly;
* use query-backed Selection descriptors;
* require confirmation for expensive bulk operations;
* disable persistence of oversized Selection.

Large Selection shall not cause unbounded Workspace State growth.

---

# 98. Query-Backed Selection

For very large result sets, Selection may reference a stable query plus exclusions or inclusions.

A query-backed Selection shall declare:

* query identity;
* result version;
* scope;
* explicit exceptions;
* target type;
* operation limits.

It shall not silently expand to an unbounded in-memory list.

---

# 99. Memory Management

Selection State shall remain lightweight.

Consumers shall release:

* obsolete projections;
* stale target metadata;
* prior AI Selection snapshots;
* native selection bridges;
* completed query results;
* plugin temporary state.

Historical Selection snapshots shall be bounded.

---

# 100. Observability

Selection observability may include:

* Selection change count;
* Selection kind distribution;
* average target count;
* invalidation count;
* remapping success;
* restoration success;
* stale-command rejection;
* oversized Selection count;
* plugin Selection failures.

Sensitive target data shall not be logged.

---

# 101. Diagnostics

Selection diagnostics should include:

* Workspace Identity;
* Selection Identity;
* Selection Version;
* source context;
* Selection kind;
* target count;
* Primary Target type;
* restoration status;
* invalidation reason;
* Command Identity;
* correlation identity;
* plugin identity where applicable.

Selected text and private metadata shall be excluded.

---

# 102. Testing Strategy

Selection tests shall cover:

* empty Selection;
* single Selection;
* Multiple Selection;
* Primary Target;
* Selection ordering;
* range Selection;
* text anchors;
* spatial Selection;
* graph Selection;
* annotation Selection;
* mixed Selection;
* normalization;
* invalidation;
* remapping;
* navigation interaction;
* Editor replacement;
* restoration;
* plugin Selection;
* AI context;
* concurrency;
* privacy;
* accessibility.

---

# 103. Contract Tests

Every selectable core or plugin surface shall pass contract tests for:

* target descriptor creation;
* Workspace ownership;
* Selection kind declaration;
* serialization;
* normalization;
* capability resolution;
* stale-result rejection;
* restoration;
* disposal;
* privacy classification;
* accessibility projection.

---

# 104. Architecture Tests

Automated architecture tests should verify:

* Selection State belongs to the Workspace;
* Editors and Panels do not own duplicate authoritative Selection;
* Selection State contains no native objects;
* Selection mutations occur through Commands;
* selected targets use stable identities;
* plugin Selection uses Plugin SDK contracts;
* AI receives immutable bounded Selection snapshots;
* Selection restoration follows owner restoration;
* closed Workspaces retain no Selection observers.

---

# 105. Determinism

Given the same:

* previous Selection State;
* Selection Command;
* target registry;
* content versions;
* permissions;
* normalization policy;
* plugin contracts;

Selection validation and commit shall produce the same logical result.

---

# 106. Idempotency

The following operations shall be idempotent where applicable:

* setting the current equivalent Selection;
* clearing an empty Selection;
* adding an already selected target;
* removing an absent target;
* selecting the current Primary Target;
* normalizing an already normalized Selection;
* restoring the same validated Selection descriptor.

Equivalent operations shall not produce unnecessary state churn.

---

# 107. Selection Prohibitions

Selection implementation shall not:

* use native selection objects as architectural state;
* store authoritative content;
* use visible text as target identity;
* bypass Workspace Commands;
* infer ownership from focus alone;
* persist unbounded selected content;
* expose private selected text to plugins by default;
* send Selection to remote AI without policy validation;
* accept stale asynchronous projections;
* silently remap to unrelated targets;
* share mutable Selection State across Workspaces;
* allow invalid plugin payloads to block restoration;
* treat Selection and focus as the same concept;
* treat Selection and navigation as the same state.

---

# 108. Validation Matrix

| Concern                | Required Validation               |
| ---------------------- | --------------------------------- |
| Selection identity     | Identity tests                    |
| Workspace ownership    | Aggregate tests                   |
| Selection kinds        | Type tests                        |
| Primary Target         | Invariant tests                   |
| Multiple Selection     | Ordering and uniqueness tests     |
| Text Selection         | Anchor tests                      |
| Spatial Selection      | Coordinate tests                  |
| Capability resolution  | Command tests                     |
| Normalization          | Deterministic normalization tests |
| Invalidation           | Lifecycle tests                   |
| Remapping              | Version migration tests           |
| Navigation integration | Scenario tests                    |
| Restoration            | Round-trip tests                  |
| Plugin Selection       | Isolation tests                   |
| AI context             | Privacy tests                     |
| Concurrency            | Race-condition tests              |
| Accessibility          | Accessibility tests               |
| Performance            | Large-selection benchmarks        |

---

# 109. Anti-Patterns

The following are prohibited:

* storing native text ranges in Workspace State;
* maintaining separate authoritative Selection in every Panel;
* deriving Selection solely from current focus;
* using indexes as persistent target identities;
* selecting content that belongs to another Workspace;
* sending the current live Selection object to asynchronous tasks;
* applying AI results to a Selection that has changed;
* restoring transient drag Selection;
* persisting entire selected documents;
* using visual highlight state as Selection truth;
* allowing target deletion without Selection revalidation;
* using one mutable Selection instance across Tabs or Workspaces.

---

# 110. Architectural Invariants

The following invariants are mandatory:

* Selection State belongs to exactly one Workspace;
* every non-empty Selection has exactly one Primary Target;
* every selected target belongs to or is accessible from the same Workspace;
* Selection State is immutable after commit;
* Selection Version increases for every material change;
* Editors and Panels submit Selection Commands but do not own authoritative Selection;
* native selections are temporary projections;
* target identities are stable and explicit;
* Multiple Selection ordering is deterministic;
* duplicate selected targets are prohibited;
* Selection and focus remain distinct;
* Selection and navigation remain distinct;
* stale Selection results cannot mutate current state;
* plugin Selection uses approved Plugin SDK contracts;
* AI receives only bounded, validated Selection snapshots;
* restoration occurs after owning contexts exist;
* invalid Selection never blocks Workspace restoration;
* authoritative knowledge remains outside Selection State.

---

# 111. Related Documents

* `README.md`
* `WorkspaceLifecycle.md`
* `Windows.md`
* `Tabs.md`
* `Editors.md`
* `Panels.md`
* `Navigation.md`
* `History.md`
* `RecentItems.md`
* `Layout.md`
* `WorkspaceRestoration.md`
* `WorkspaceRecovery.md`
* `../02-Architecture/WorkspaceArchitecture.md`
* `../02-Architecture/StateManagement.md`
* `../02-Architecture/CommandArchitecture.md`
* `../02-Architecture/EventArchitecture.md`
* `../02-Architecture/DependencyGraph.md`
* Platform Knowledge Engine
* Platform Annotation Engine
* Platform Search Engine
* Platform AI Engine
* Plugin SDK Contracts
* Architecture Decision Records

---

# 112. Status

**Approved**

This document establishes the authoritative implementation model for Selection within the KnowledgeOS Desktop Application.

Selection is Workspace-owned immutable logical state. Editors, Panels and native views create and project Selection through explicit Commands and stable target descriptors, while authoritative knowledge remains outside the Selection model.

All Workspace services, Editors, Panels, plugins, AI integrations, Commands, Events, restoration processes and native projections shall comply with the ownership, identity, validation, privacy and concurrency rules defined herein.
