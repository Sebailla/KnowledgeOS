

# Master Library Catalog Browser

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Client

**Document:** Catalog Browser

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation model of the KnowledgeOS Catalog Browser.

The Catalog Browser is the primary client capability for discovering, navigating, filtering, organizing and opening Publications available through the Local Library.

It provides a responsive Offline First view of the user’s knowledge catalog.

The Catalog Browser reads primarily from the Local Catalog and local projections.

It does not require synchronous access to the Master Library Server for normal browsing.

---

# 2. Scope

This document defines:

* Catalog Browser responsibilities;
* browsing architecture;
* query behavior;
* view composition;
* filtering;
* sorting;
* grouping;
* collections;
* search integration;
* local availability state;
* synchronization state;
* selection and navigation;
* progressive loading;
* pagination;
* performance;
* accessibility;
* error behavior;
* testing;
* invariants.

It does not redefine:

* Local Library persistence;
* synchronization protocol;
* authoritative Catalog semantics;
* Acquisition workflows;
* Reader implementation;
* Search Engine internals;
* server-side query architecture.

---

# 3. Architectural Role

The Catalog Browser is the main navigation surface of the Master Library Client.

Its logical position is:

```text
User

↓

Catalog Browser Presentation

↓

Catalog Browser Application Services

↓

Catalog Query Port

↓

Local Catalog and Local Projections
```

Optional remote state is incorporated through synchronization rather than direct per-view server queries.

---

# 4. Fundamental Principles

The Catalog Browser follows these principles:

* local-first querying;
* immediate responsiveness;
* Offline First availability;
* stable identity;
* deterministic ordering;
* explicit operational state;
* progressive loading;
* bounded resource use;
* accessible navigation;
* no hidden remote dependency;
* no direct persistence access from UI components.

---

# 5. Responsibilities

The Catalog Browser is responsible for:

* listing Publications;
* presenting Publication summaries;
* navigating collections;
* filtering the Catalog;
* sorting results;
* grouping results;
* integrating local search;
* displaying local availability;
* displaying synchronization status;
* displaying pending-change state;
* displaying processing state;
* preserving navigation context;
* opening selected Publications;
* initiating supported actions.

---

# 6. Non-Responsibilities

The Catalog Browser is not responsible for:

* importing source files;
* committing authoritative changes;
* resolving synchronization conflicts internally;
* mutating Local Catalog storage directly;
* reading arbitrary filesystem paths;
* generating authoritative metadata;
* running unrestricted AI operations;
* replacing the Reader;
* implementing full Search Engine behavior.

---

# 7. Internal Architecture

The Catalog Browser is logically composed of:

```text
Catalog Browser

├── Presentation
│   ├── Catalog Views
│   ├── Filters
│   ├── Sorting
│   ├── Grouping
│   ├── Selection
│   └── Navigation
│
├── Application
│   ├── Catalog Queries
│   ├── View State
│   ├── Action Coordination
│   └── Result Mapping
│
├── Projections
│   ├── Publication Summary
│   ├── Collection Summary
│   ├── Availability Projection
│   ├── Synchronization Projection
│   └── Processing Projection
│
└── Ports
    ├── Catalog Query Port
    ├── Search Port
    ├── Content Availability Port
    ├── Synchronization Status Port
    └── Navigation Port
```

---

# 8. Presentation Models

The Catalog Browser uses presentation-specific models.

These models may combine:

* authoritative metadata;
* pending local overlays;
* derived display values;
* local availability;
* synchronization status;
* processing status;
* user preferences.

Presentation models are projections.

They are not authoritative Domain entities.

---

# 9. Publication Summary

A Publication summary may include:

* `PublicationId`;
* title;
* subtitle;
* creators;
* cover reference;
* Publication type;
* source format;
* publication date;
* collection membership;
* tags;
* local availability;
* synchronization state;
* pending-change state;
* annotation count;
* processing state;
* last opened time;
* favorite state;
* pinned state.

Only fields needed for the current view should be loaded.

---

# 10. Collection Summary

A Collection summary may include:

* `CollectionId`;
* name;
* description;
* parent collection;
* item count;
* nested collection count;
* cover or representative image;
* synchronization state;
* pending-change state;
* last modified time.

Collection summaries shall avoid requiring full child materialization.

---

# 11. View Types

The Catalog Browser may provide:

* Grid View;
* List View;
* Compact List View;
* Cover View;
* Detail View;
* Collection View;
* Recent View;
* Favorites View;
* Pinned View;
* Downloads View;
* Pending Changes View;
* Conflicts View;
* Processing View.

Not every platform must expose every view initially.

---

# 12. Grid View

Grid View prioritizes:

* covers;
* title recognition;
* visual browsing;
* collection discovery;
* status badges;
* responsive layout.

Grid cells shall remain stable while covers load progressively.

Missing covers use deterministic placeholders.

---

# 13. List View

List View prioritizes:

* metadata density;
* sorting;
* filtering;
* keyboard navigation;
* multi-selection;
* operational state;
* large-library efficiency.

Columns shall be configurable where supported.

---

# 14. Detail View

Detail View may present:

* full metadata;
* source information;
* relationships;
* collections;
* local availability;
* synchronization history;
* annotations;
* processing state;
* pending changes;
* available actions.

Detail View still reads from Local Library projections.

---

# 15. Catalog Query Model

Catalog queries are explicit and immutable.

A Catalog query may include:

* scope;
* filter expression;
* sort specification;
* grouping specification;
* pagination;
* field selection;
* search expression;
* availability constraints;
* synchronization constraints;
* projection version.

---

# 16. Query Scope

Query scope may target:

* entire Local Catalog;
* one Collection;
* nested Collections;
* recent Publications;
* favorites;
* pinned Publications;
* downloaded Publications;
* pending changes;
* conflicts;
* one Publication type;
* one source format.

Scopes shall be stable and composable.

---

# 17. Local-First Querying

Normal Catalog queries execute against:

* Local Catalog tables;
* local projections;
* local indexes;
* cached covers;
* local operational state.

They shall not block waiting for the server.

If newer remote state may exist, the UI may indicate synchronization freshness separately.

---

# 18. Query Execution Flow

A standard Catalog query follows:

```text
View Requests Data

↓

Build Catalog Query

↓

Validate Query

↓

Execute Local Projection Query

↓

Map Results

↓

Attach Operational State

↓

Return Page

↓

Render View
```

Cover and heavy derived resources may load separately.

---

# 19. Filtering

Supported filters may include:

* title;
* creator;
* Publication type;
* source format;
* publication date;
* acquisition date;
* collection;
* tag;
* language;
* local availability;
* pinned state;
* favorite state;
* annotation presence;
* pending-change state;
* synchronization state;
* processing state.

Filters shall be composable.

---

# 20. Filter Semantics

Filter semantics shall be explicit.

A filter defines:

* target field;
* operator;
* value;
* null behavior;
* case sensitivity;
* locale behavior;
* combination rule.

Implicit differences between platforms are prohibited.

---

# 21. Filter Operators

Possible operators include:

* equals;
* not equals;
* contains;
* starts with;
* greater than;
* less than;
* between;
* in set;
* is empty;
* is not empty;
* exists;
* matches category.

Only supported operators shall be exposed for each field.

---

# 22. Saved Filters

The client may support saved filters.

A saved filter contains:

* stable identifier;
* display name;
* query definition;
* owner;
* creation time;
* update time;
* synchronization scope where supported.

Saved filters shall store logical query definitions, not raw SQL.

---

# 23. Sorting

Sorting may use:

* title;
* creator;
* publication date;
* acquisition date;
* last modified;
* last opened;
* annotation count;
* local availability;
* manual order;
* relevance.

Every sort shall define deterministic tie-breakers.

---

# 24. Deterministic Ordering

A sort order shall remain stable across repeated queries.

When primary fields are equal, the query shall use stable secondary ordering such as:

* normalized title;
* creation time;
* `PublicationId`.

Pagination without deterministic ordering is prohibited.

---

# 25. Locale-Aware Sorting

Human-readable values may use locale-aware collation.

The implementation shall distinguish:

* display collation;
* normalized search values;
* protocol identifiers;
* stable technical ordering.

Locale changes shall not alter resource identity.

---

# 26. Grouping

Results may be grouped by:

* creator;
* Publication type;
* source format;
* year;
* collection;
* tag;
* availability;
* synchronization state;
* first letter;
* custom section.

Grouping is a presentation concern unless a persistent collection explicitly exists.

---

# 27. Group Counts

Group summaries may include:

* total items;
* locally available items;
* pending items;
* conflict count;
* unread or unreviewed count where supported.

Counts shall be derived from the same effective query criteria as the group.

---

# 28. Collections

Collections provide explicit organizational structures.

The Catalog Browser supports:

* root Collections;
* nested Collections;
* Collection navigation;
* Collection membership;
* Collection counts;
* Collection reordering where supported;
* Collection pending state.

Collection operations that mutate data are dispatched through Application commands.

---

# 29. Collection Navigation

Collection navigation shall preserve:

* navigation history;
* selected Collection;
* query state;
* scroll position where practical;
* selected item;
* active sort;
* active filters.

Returning to a previous Collection should restore context.

---

# 30. Smart Collections

The client may support Smart Collections based on saved query definitions.

A Smart Collection:

* has stable identity;
* stores a logical filter;
* calculates membership dynamically;
* does not duplicate Publication ownership;
* may be local-only or synchronized depending on Domain support.

---

# 31. Search Integration

The Catalog Browser integrates with local Search capabilities.

Search may target:

* metadata;
* extracted text;
* annotations;
* relationships;
* semantic indexes.

The Catalog Browser owns search presentation, not Search Engine internals.

---

# 32. Search Modes

Possible search modes include:

* Catalog metadata;
* full text;
* annotations;
* semantic;
* all supported sources.

Search mode shall be explicit.

The UI shall not mix incomparable result types without labeling them.

---

# 33. Search Query Flow

```text
User Enters Search

↓

Debounce or Explicit Submit

↓

Search Query Validation

↓

Local Search Execution

↓

Result Ranking

↓

Catalog Projection Mapping

↓

Display Results
```

Remote AI or provider search shall not be silently invoked.

---

# 34. Search Result Identity

Every search result shall preserve stable identity.

A result may reference:

* Publication;
* Collection;
* Annotation;
* content fragment;
* relationship;
* Asset.

Opening a result resolves through the corresponding capability.

---

# 35. Search Highlighting

Search results may include:

* matched terms;
* metadata field;
* text snippet;
* annotation snippet;
* relevance score;
* match location.

Highlights are derived presentation data.

They shall not alter stored content.

---

# 36. Search Freshness

Search freshness depends on local index state.

The UI may indicate:

* UpToDate;
* Updating;
* Partial;
* RebuildRequired;
* Unavailable.

A stale index shall not be presented as authoritative completeness.

---

# 37. Local Availability Presentation

The Catalog Browser shows whether Publication content is locally available.

Possible indicators include:

* Metadata Only;
* Cover Available;
* Downloaded;
* Partially Downloaded;
* Pinned;
* Downloading;
* Download Failed;
* Corrupted;
* Evicted.

Availability state shall be understandable without exposing storage internals.

---

# 38. Synchronization State Presentation

Synchronization state may include:

* Synchronized;
* Pending Upload;
* Pending Download;
* Synchronizing;
* Conflict;
* Rejected;
* Offline;
* Server Confirmation Pending.

The Browser shall distinguish local effective state from confirmed authoritative state.

---

# 39. Pending Change Indicators

A Publication with local changes may display:

* pending metadata;
* pending annotation;
* pending source;
* pending cover;
* pending relationship;
* conflict.

Indicators shall not dominate normal browsing but must remain discoverable.

---

# 40. Processing State Presentation

Processing state may include:

* Waiting;
* Extracting;
* Indexing;
* Rendering;
* Analyzing;
* Complete;
* Failed;
* Recovery Required.

Processing state is operational, not Publication identity.

---

# 41. Status Composition

A Publication may have several simultaneous statuses.

Example:

```text
Downloaded
+
Pending Metadata Change
+
Index Updating
+
Offline
```

The UI shall prioritize and compose statuses without collapsing them into one ambiguous state.

---

# 42. Cover Loading

Covers load progressively.

The Browser shall:

* render layout before covers are available;
* use fixed aspect-ratio containers;
* use placeholders;
* request appropriate sizes;
* cache decoded results where practical;
* cancel unnecessary requests;
* avoid layout shifts.

---

# 43. Cover Resolution

Cover resolution may use:

1. local thumbnail;
2. local full cover;
3. generated placeholder;
4. scheduled download;
5. scheduled generation.

The Browser shall not synchronously process large source files to render one grid cell.

---

# 44. Progressive Metadata Loading

Large or expensive metadata may load on demand.

Initial summaries should contain enough information for:

* recognition;
* navigation;
* status;
* primary actions.

Detailed relationships, provenance or processing history belong in secondary views.

---

# 45. Pagination

Large Catalogs require pagination or incremental loading.

Supported strategies may include:

* cursor pagination;
* keyset pagination;
* virtualized incremental loading.

Offset pagination should be avoided for large mutable datasets when it causes instability or excessive cost.

---

# 46. Cursor Model

A Catalog cursor may encode:

* query fingerprint;
* sort values;
* stable identifier;
* projection version;
* snapshot marker where supported.

Cursors are opaque to the Presentation Layer.

---

# 47. Pagination Consistency

Pagination shall prevent:

* duplicate items;
* missing items caused by unstable ordering;
* uncontrolled page-size growth;
* incompatible cursor reuse.

Changing filters, sorting or grouping invalidates the previous cursor.

---

# 48. Virtualization

List and grid views should use virtualization for large result sets.

Virtualization shall preserve:

* accessibility;
* keyboard navigation;
* selection;
* stable item identity;
* focus behavior;
* scroll restoration.

---

# 49. Selection Model

The Catalog Browser supports:

* single selection;
* multiple selection where appropriate;
* range selection on supported platforms;
* keyboard selection;
* contextual selection;
* selection persistence during local refreshes.

Selection is based on stable resource identity.

---

# 50. Selection Stability

Selection shall remain stable when:

* covers finish loading;
* statuses update;
* background indexes update;
* synchronization applies unrelated changes;
* list cells are recycled.

Selection may be cleared only when the selected resource is no longer available in the active scope.

---

# 51. Multi-Selection Actions

Possible multi-selection actions include:

* add to Collection;
* remove from Collection;
* pin;
* unpin;
* download;
* evict cache;
* export;
* assign tags;
* request processing.

Actions are dispatched as explicit Application commands.

---

# 52. Navigation

Navigation may move between:

* Catalog root;
* Collection;
* search results;
* Publication detail;
* Reader;
* annotations;
* conflicts;
* downloads;
* jobs.

Navigation state shall be separate from Catalog query state.

---

# 53. Deep Linking

The client may support deep links to:

* Publication;
* Collection;
* search query;
* annotation;
* acquisition;
* conflict.

A deep link resolves through stable identifiers.

It shall not contain unrestricted filesystem paths.

---

# 54. Opening a Publication

Opening a Publication follows:

```text
User Selects Publication

↓

Resolve Publication Identity

↓

Inspect Local Availability

↓

Open Reader if Content Available

or

↓

Request Download or Present Availability Action
```

The Browser does not directly open arbitrary source paths.

---

# 55. Content Download Actions

The Browser may initiate:

* download source;
* download cover;
* download all Assets;
* pin for offline use;
* cancel download;
* retry download.

Execution is delegated to the Content Availability capability.

---

# 56. Contextual Actions

Publication contextual actions may include:

* Open;
* Show Details;
* Download;
* Pin;
* Add to Collection;
* Edit Metadata;
* Export;
* Show Annotations;
* Show Synchronization State;
* Resolve Conflict;
* Remove Local Cache.

Actions shall be filtered by capability and authorization.

---

# 57. Command Availability

An action may be:

* Available;
* Disabled;
* Hidden;
* Pending;
* Requires Network;
* Requires Download;
* Requires Authentication;
* Requires Conflict Resolution.

The reason for unavailability should be explainable.

---

# 58. Optimistic Presentation

The Browser may reflect local commands optimistically after local commit.

Examples:

* favorite toggled;
* Collection membership changed;
* title locally edited;
* pinned state changed.

Optimistic presentation occurs only after durable local success.

It does not imply server acceptance.

---

# 59. Refresh Model

The Catalog Browser updates in response to:

* local commands;
* synchronization results;
* index updates;
* download progress;
* processing events;
* user refresh;
* Local Library recovery.

Refresh should update affected projections rather than reload the entire Catalog unnecessarily.

---

# 60. Event Integration

Relevant local events may include:

* `LocalPublicationChanged`;
* `CollectionChanged`;
* `PendingChangeChanged`;
* `ContentAvailabilityChanged`;
* `SynchronizationStateChanged`;
* `ConflictChanged`;
* `IndexStateChanged`;
* `CoverAvailable`;
* `ProcessingStateChanged`.

Event handlers schedule projection refreshes.

---

# 61. Snapshot Consistency

A Catalog page should represent a coherent local query result.

Background updates may produce a new snapshot.

The UI shall avoid mixing incompatible projection versions within one row or card.

---

# 62. Empty States

The Browser shall provide explicit empty states for:

* empty library;
* empty Collection;
* no filter matches;
* no search results;
* no downloaded content;
* no conflicts;
* no pending changes;
* unavailable index.

Each empty state should suggest only valid next actions.

---

# 63. Loading States

Loading states shall distinguish:

* initial Local Catalog query;
* incremental page loading;
* cover loading;
* index updating;
* synchronization;
* content download;
* projection rebuilding.

Normal local browsing should not display a global blocking loader for background work.

---

# 64. Error States

Catalog Browser errors may include:

* Local Catalog unavailable;
* query validation failure;
* projection failure;
* index unavailable;
* cover decode failure;
* Local Library read-only;
* storage failure;
* compatibility failure.

Errors shall preserve already available content where safe.

---

# 65. Degraded Operation

The Browser may continue in degraded mode when:

* covers are unavailable;
* search index is rebuilding;
* synchronization is offline;
* some derived projections fail;
* remote content is unavailable.

Degraded operation shall identify unavailable features without disabling unrelated local browsing.

---

# 66. Offline Behavior

While offline, the Browser shall support:

* local Catalog queries;
* local collections;
* local filters;
* local sorting;
* local search where indexed;
* local availability actions;
* opening downloaded content;
* creating local commands.

Server-dependent operations are deferred or marked unavailable.

---

# 67. Freshness Presentation

The Browser may display:

* last successful synchronization;
* pending change count;
* server-unreachable state;
* stale index state;
* incomplete download state.

Freshness information shall not imply that local replicated data is invalid.

---

# 68. User Preferences

Catalog preferences may include:

* default view;
* grid size;
* visible columns;
* sort order;
* grouping;
* sidebar state;
* cover size;
* metadata density;
* default search mode.

Preferences are separate from authoritative Catalog data.

---

# 69. View State Persistence

The client may persist:

* last active scope;
* active filters;
* sort order;
* group mode;
* scroll position;
* selected Publication;
* sidebar state.

State restoration shall validate that referenced resources still exist.

---

# 70. Platform Adaptation

The Catalog Browser adapts interaction without changing semantics.

## macOS

May support:

* multiple windows;
* keyboard navigation;
* menu commands;
* context menus;
* drag and drop;
* dense lists;
* multi-selection.

## iPadOS

May support:

* touch;
* pointer;
* keyboard;
* split view;
* drag and drop;
* adaptive grids.

## iOS

May prioritize:

* compact navigation;
* search;
* recent items;
* capture;
* single-item actions.

## Web

May provide:

* responsive layouts;
* browser navigation;
* limited offline caching;
* reduced filesystem interaction.

---

# 71. Drag and Drop

Drag and drop may support:

* adding Publications to Collections;
* reordering where Domain rules permit;
* initiating export;
* importing files through Acquisition;
* opening content in compatible targets.

External drops are validated before becoming acquisitions.

---

# 72. Keyboard Navigation

On supported platforms, the Browser shall support:

* move selection;
* open selection;
* multi-selection;
* search focus;
* filter activation;
* navigation history;
* contextual commands;
* escape or cancellation.

Keyboard behavior shall follow platform conventions.

---

# 73. Accessibility

The Catalog Browser shall support:

* semantic item roles;
* accessible names;
* accessible status descriptions;
* keyboard traversal;
* scalable text;
* sufficient contrast;
* visible focus;
* screen-reader navigation;
* reduced motion;
* non-color-only status indicators.

---

# 74. Status Accessibility

Operational badges shall expose meaningful text.

Examples:

* “Downloaded and available offline”;
* “Two changes pending synchronization”;
* “Conflict requires review”;
* “Search index updating”.

Color alone shall not communicate status.

---

# 75. Localization

Catalog presentation shall localize:

* dates;
* numbers;
* sorting labels;
* filter labels;
* status messages;
* empty states;
* accessibility descriptions.

Stable identifiers and stored query operators remain locale-independent.

---

# 76. Performance Goals

The Catalog Browser shall prioritize:

* rapid initial local rendering;
* bounded query latency;
* smooth scrolling;
* low memory overhead;
* incremental loading;
* asynchronous cover decoding;
* minimal projection recomputation.

Performance targets shall be measured using representative large libraries.

---

# 77. Query Performance

Catalog queries shall:

* use indexed fields;
* request only required columns;
* apply bounded page sizes;
* avoid N+1 access patterns;
* avoid loading full source content;
* avoid per-item network requests;
* avoid per-item heavy processing.

---

# 78. Projection Performance

Frequently used Publication summaries may be maintained as dedicated projections.

Projection updates shall be:

* incremental;
* idempotent;
* versioned;
* rebuildable;
* transactionally related to source changes where required.

---

# 79. Cover Performance

Cover handling shall use:

* size-specific variants;
* asynchronous decode;
* memory-aware image caches;
* cancellation;
* prefetch based on viewport;
* placeholder reuse.

Full-resolution covers shall not be decoded for small grid cells.

---

# 80. Memory Management

The Browser shall bound:

* loaded result pages;
* decoded images;
* search snippets;
* selected item details;
* cached view models.

Memory pressure shall release reconstructable presentation state first.

---

# 81. Resource Cancellation

When the user changes scope or query, the Browser should cancel:

* obsolete queries;
* obsolete cover requests;
* obsolete search operations;
* obsolete projection loads.

Cancellation shall not cancel unrelated durable background jobs.

---

# 82. Query Fingerprints

A query fingerprint identifies the logical result definition.

It may include:

* scope;
* filters;
* sorting;
* grouping;
* search expression;
* projection version.

Fingerprints support cache reuse and stale-result rejection.

---

# 83. Browser-Level Caching

The Browser may cache:

* recent query pages;
* view models;
* cover references;
* filter options;
* Collection summaries.

Browser caches are reconstructable.

They shall not own pending user work.

---

# 84. Filter Option Sources

Filter options may be derived from:

* Local Catalog distinct values;
* controlled vocabularies;
* Domain types;
* configured metadata fields;
* Collection hierarchy;
* tags.

Large option sets require search or incremental loading.

---

# 85. Metadata Editing Entry Point

The Browser may open metadata editing workflows.

It shall:

* resolve the Publication;
* load effective local state;
* invoke an Application command workflow;
* persist changes locally;
* refresh the affected projection;
* display pending synchronization state.

The Browser itself does not write metadata.

---

# 86. Conflict Entry Point

When a Publication has a conflict, the Browser may open the Conflict Resolution capability.

The Browser shall not:

* choose a winning value automatically;
* discard local proposals;
* overwrite authoritative state;
* hide the conflict after failed resolution.

---

# 87. Acquisition Entry Point

The Browser may expose actions to:

* add files;
* import folders;
* capture URLs;
* scan documents;
* receive shared content.

These actions delegate to the Acquisition Manager.

---

# 88. Reader Entry Point

The Browser opens the Reader through a stable Publication reference.

The Reader determines:

* source availability;
* render strategy;
* reading position;
* annotation support;
* required downloads.

---

# 89. Observability

Catalog Browser observability may include:

* query duration;
* result count;
* page size;
* cache hit;
* cover-load failures;
* projection version;
* index freshness;
* cancelled requests;
* rendering latency.

Metrics shall not expose unnecessary knowledge content.

---

# 90. Logging

Logs may contain:

* operation;
* query category;
* result count;
* duration;
* CorrelationId;
* LocalLibraryId where safe;
* failure classification.

Logs shall not record full search queries or metadata values when privacy policy forbids it.

---

# 91. Diagnostics

Diagnostic information may include:

* active view;
* active query fingerprint;
* projection version;
* Local Catalog health;
* index state;
* current page count;
* cover cache status;
* recent failures.

Diagnostic export shall redact user content.

---

# 92. Testing Strategy

Catalog Browser testing includes:

* query unit tests;
* filter tests;
* sorting tests;
* grouping tests;
* pagination tests;
* projection tests;
* offline tests;
* synchronization-update tests;
* selection tests;
* accessibility tests;
* platform interaction tests;
* performance tests.

---

# 93. Mandatory Query Tests

Tests shall verify:

* deterministic sorting;
* stable pagination;
* filter composition;
* null behavior;
* locale behavior;
* query cancellation;
* empty results;
* large-result handling;
* projection version mismatch;
* pending-overlay composition.

---

# 94. Mandatory State Tests

Tests shall verify presentation of:

* synchronized Publication;
* pending Publication;
* conflicted Publication;
* metadata-only Publication;
* partially downloaded Publication;
* corrupted local content;
* offline state;
* index rebuild;
* processing failure;
* rejected change.

---

# 95. Mandatory Offline Tests

Offline tests shall verify:

* Catalog opens without server;
* filters work;
* sorting works;
* local search works;
* downloaded Publication opens;
* pending status remains visible;
* local commands persist;
* server actions are deferred safely;
* no global application failure occurs.

---

# 96. Mandatory Performance Tests

Performance tests shall use representative Catalog sizes and measure:

* initial render;
* page query latency;
* scroll performance;
* cover loading;
* memory use;
* filter changes;
* search updates;
* synchronization-driven refresh.

---

# 97. Prohibited Designs

The following designs are prohibited:

* synchronous server dependency for normal browsing;
* direct UI access to Local Catalog implementation;
* unstable pagination ordering;
* per-item server requests;
* loading complete source content for summaries;
* mixing confirmed and pending values without status;
* using filenames as Publication identity;
* blocking the entire Browser during background synchronization;
* silent conflict suppression;
* destructive actions from view code;
* storing query definitions as raw SQL;
* treating search results as authoritative Domain state;
* using color as the only status indicator;
* evicting pending work through Browser cache cleanup;
* direct filesystem opening from arbitrary stored paths.

---

# 98. Catalog Browser Invariants

The following invariants are mandatory:

* normal browsing uses local data;
* Catalog browsing remains available offline;
* every displayed Publication uses stable identity;
* confirmed and pending state remain distinguishable;
* query ordering is deterministic;
* pagination is stable;
* changing query semantics invalidates old cursors;
* UI components do not access persistence directly;
* heavy resources load progressively;
* covers do not control item identity;
* local availability is explicit;
* synchronization state is explicit;
* conflicts remain visible;
* search freshness is represented honestly;
* selection survives unrelated refreshes;
* caches contain only reconstructable presentation data;
* local commands update the Browser only after durable local commit;
* server confirmation is not implied by optimistic local presentation;
* platform adaptations preserve shared behavior;
* accessibility applies to all primary navigation paths;
* background operations do not block unrelated browsing;
* no Catalog action bypasses Application workflows.

---

# 99. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/QueryBus.md`
* `00-Architecture/04-Platform/Knowledge/README.md`
* `00-Architecture/04-Platform/Library/README.md`
* `00-Architecture/04-Platform/Search/README.md`
* `00-Architecture/04-Platform/Sync/README.md`
* `00-Architecture/06-Execution/Runtime/StateManagement.md`

## Master Library

* `01-Requirements/UseCases.md`
* `01-Requirements/AcceptanceCriteria.md`
* `02-TechnicalDesign/ClientDesign.md`
* `02-TechnicalDesign/OfflineModel.md`
* `03-Domain/DomainModel.md`
* `03-Domain/States.md`
* `04-Contracts/ClientContracts.md`
* `04-Contracts/QueryContracts.md`
* `04-Contracts/SearchContracts.md`
* `05-Persistence/CatalogSchema.md`
* `07-Client/README.md`
* `07-Client/ClientArchitecture.md`
* `07-Client/LocalLibrary.md`
* `07-Client/AcquisitionManager.md`
* `08-Testing/TestStrategy.md`
* `08-Testing/IntegrationTests.md`
* `08-Testing/EndToEndTests.md`

---

# 100. Status

**Approved**

The Catalog Browser is frozen as the primary Offline First navigation and discovery capability of the KnowledgeOS Master Library Client.

It queries the Local Catalog and local projections, presents authoritative replicas together with explicit pending and operational state, and remains responsive without continuous Master Library Server access.

The Catalog Browser preserves stable identity, deterministic queries, accessible navigation, bounded resource use and strict separation between presentation, application workflows and Local Library persistence.
