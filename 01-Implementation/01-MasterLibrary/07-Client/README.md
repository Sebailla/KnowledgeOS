

# Master Library Client

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Client

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation responsibilities, boundaries and operating model of the KnowledgeOS Master Library Client.

The client is the user-facing runtime responsible for providing access to knowledge, supporting offline work and coordinating local interaction with the authoritative Master Library.

The client operates primarily against a Local Library.

It does not require continuous access to the Master Library Server for normal reading, browsing, annotation or supported editing workflows.

The client synchronizes its local state with the Master Library when connectivity is available.

---

# 2. Scope

The Master Library Client is responsible for:

* presenting the KnowledgeOS user interface;
* managing the Local Library;
* storing local working state;
* supporting Offline First operation;
* browsing the local Catalog;
* reading locally available Publications;
* managing local acquisitions;
* creating local changes;
* recording synchronization intent;
* synchronizing with the Master Library Server;
* presenting conflicts;
* managing local indexes;
* managing local caches;
* coordinating local rendering;
* coordinating local AI capabilities;
* managing device-specific integrations;
* exposing progress and operational state to the user.

The client is not responsible for:

* becoming the authoritative Master Library;
* writing directly to authoritative NAS storage;
* writing directly to the server database;
* bypassing server authentication or authorization;
* silently resolving authoritative conflicts;
* redefining Domain rules;
* replacing server-side persistence;
* treating cached or derived data as authoritative.

---

# 3. Architectural Role

The client is the local execution environment through which the user interacts with KnowledgeOS.

Its architectural position is:

```text
User

↓

Client Interface

↓

Client Application Layer

↓

Local Library

↓

Synchronization Layer

↓

Master Library Server

↓

Master Library
```

The client remains useful when the synchronization path is unavailable.

---

# 4. Client Platforms

The client architecture supports the following target platforms:

* macOS;
* iPadOS;
* iOS;
* Web where technically and operationally viable.

The initial primary client is macOS.

The architecture shall preserve shared behavior across platforms while allowing platform-specific implementations.

---

# 5. Platform Priorities

Platform priority is:

1. macOS;
2. iPadOS;
3. iOS;
4. Web.

This priority reflects the expected depth of functionality.

The macOS client provides the most complete knowledge-management environment.

The iPadOS client prioritizes reading, annotation, visual organization and Apple Pencil interaction.

The iOS client prioritizes capture, reading, search and lightweight interaction.

The Web client, when implemented, may operate with more limited offline and filesystem capabilities.

---

# 6. Fundamental Client Principles

The client follows these principles:

* Offline First;
* local responsiveness;
* explicit synchronization;
* authority separation;
* user-visible operational state;
* deterministic local behavior;
* recoverable local workflows;
* privacy by default;
* platform integration;
* derived-data reconstruction;
* no hidden data loss;
* no silent authoritative overwrite.

---

# 7. Offline First

Offline First means that normal supported client operations shall continue when the Master Library Server is unavailable.

Offline-capable operations include:

* browsing locally available Publications;
* reading local content;
* searching local indexes;
* creating annotations;
* editing supported metadata;
* organizing local working structures;
* preparing acquisitions;
* executing local AI operations;
* creating synchronization-ready changes.

Operations that require server authority may be queued or deferred.

Offline First does not mean every server capability is fully reproduced locally.

---

# 8. Authority Model

The Master Library stored on the NAS remains the authoritative library.

The Local Library is:

* a synchronized replica;
* a working copy;
* an offline execution environment;
* a local cache;
* a local change source.

The Local Library is not independently authoritative over the Master Library.

Local changes become authoritative only after server validation and successful synchronization commit.

---

# 9. Client Architecture

The logical client architecture is:

```text
Master Library Client

├── Presentation Layer
│   ├── Navigation
│   ├── Views
│   ├── Interaction
│   └── Platform Integration
│
├── Application Layer
│   ├── Commands
│   ├── Queries
│   ├── Coordinators
│   └── User Workflows
│
├── Local Domain Layer
│   ├── Local Publication State
│   ├── Local Change State
│   ├── Annotation State
│   └── Synchronization State
│
├── Local Library Layer
│   ├── Local Catalog
│   ├── Local Content
│   ├── Local Assets
│   ├── Local Indexes
│   └── Local Operational State
│
├── Capability Layer
│   ├── Catalog Browser
│   ├── Acquisition Manager
│   ├── Reader
│   ├── Annotation
│   ├── Search
│   ├── Render
│   ├── Export
│   └── AI
│
├── Synchronization Layer
│   ├── Session Management
│   ├── Change Tracking
│   ├── Conflict Detection
│   ├── Transfer
│   └── Reconciliation
│
└── Operations Layer
    ├── Configuration
    ├── Logging
    ├── Diagnostics
    ├── Recovery
    └── Resource Management
```

This model is logical and does not require every component to be a separate process.

---

# 10. Presentation Layer

The Presentation Layer provides the user experience.

It is responsible for:

* navigation;
* visual composition;
* command invocation;
* state presentation;
* progress presentation;
* error presentation;
* accessibility;
* platform conventions;
* responsive layouts;
* input-device adaptation.

The Presentation Layer shall not directly access persistence, server protocols or storage paths.

---

# 11. Application Layer

The Client Application Layer coordinates user workflows.

It is responsible for:

* receiving user intent;
* executing local commands;
* executing local queries;
* coordinating Local Library changes;
* invoking client capabilities;
* recording pending synchronization work;
* exposing progress;
* handling recoverable failure;
* maintaining workflow state.

Application workflows shall remain independent from specific UI implementations.

---

# 12. Local Domain Layer

The Local Domain Layer represents client-side state that must preserve business meaning.

It includes:

* locally available Publication identity;
* local revision state;
* pending local mutations;
* annotation drafts;
* acquisition state;
* synchronization state;
* conflict state;
* local availability state.

The client shall reuse shared Domain contracts where appropriate.

It shall not create incompatible parallel definitions of authoritative concepts.

---

# 13. Local Library Layer

The Local Library Layer provides persistent local access to knowledge and operational state.

It contains:

* a Local Catalog;
* locally stored source files;
* locally stored covers;
* locally stored assets;
* local indexes;
* local thumbnails;
* local render artifacts;
* pending change records;
* synchronization metadata;
* local job state.

The Local Library is platform-specific in physical implementation but consistent in logical behavior.

---

# 14. Capability Layer

The Capability Layer contains user-facing client capabilities.

Initial capabilities include:

* Catalog Browser;
* Local Library management;
* Acquisition Manager;
* Reader;
* Annotation;
* Search;
* Synchronization;
* Render;
* Export;
* AI assistance.

Each capability interacts with the Local Library through defined contracts.

---

# 15. Synchronization Layer

The Synchronization Layer exchanges state with the Master Library Server.

It is responsible for:

* connectivity detection;
* authentication;
* device identity;
* synchronization session creation;
* capability negotiation;
* local change enumeration;
* remote change retrieval;
* content transfer;
* checksum verification;
* conflict detection;
* authoritative-result application;
* synchronization history.

Synchronization is explicit and observable.

---

# 16. Operations Layer

The Client Operations Layer provides:

* configuration;
* diagnostics;
* logging;
* local recovery;
* cache maintenance;
* local integrity verification;
* storage monitoring;
* resource limits;
* feature controls.

Operational services shall not redefine Domain behavior.

---

# 17. Local Library

The Local Library is the central persistence boundary of the client.

It enables:

* offline reading;
* offline browsing;
* local search;
* local annotation;
* local editing;
* deferred synchronization;
* device-level performance;
* local AI processing.

A client may maintain one or more Local Libraries only when explicitly supported by the implementation.

---

# 18. Local Library Identity

Each Local Library has a stable identity.

The identity may include:

* LocalLibraryId;
* associated MasterLibraryId;
* DeviceId;
* creation time;
* local format version;
* synchronization protocol version;
* last successful synchronization point;
* operational state.

The identity shall not be derived solely from a filesystem path.

---

# 19. Local Catalog

The Local Catalog stores the local projection of library metadata.

It may contain:

* Publication records;
* collection records;
* relationships;
* source metadata;
* cover metadata;
* asset metadata;
* local availability;
* local revision information;
* synchronization markers;
* derived presentation data.

The Local Catalog is optimized for client queries.

It does not replace server-side authority.

---

# 20. Local Content

The client may store local copies of:

* source documents;
* covers;
* assets;
* annotations;
* thumbnails;
* rendered pages;
* extracted text;
* embeddings;
* search indexes.

Each locally stored object shall have explicit ownership and lifecycle rules.

---

# 21. Local Availability

A Publication may have different local availability levels.

Possible states include:

* MetadataOnly;
* CoverAvailable;
* PartiallyAvailable;
* SourceAvailable;
* FullyAvailable;
* Evicted;
* DownloadPending;
* DownloadFailed.

Availability state is local operational state.

It is not authoritative publication status.

---

# 22. Selective Download

The client may selectively download content based on:

* user action;
* recent access;
* favorites;
* collection membership;
* synchronization policy;
* available storage;
* platform;
* network conditions.

Selective download reduces local storage requirements.

Metadata should remain available even when full source content is not local.

---

# 23. Local Cache

The client uses caches for derived or reconstructable data.

Examples include:

* thumbnails;
* rendered pages;
* previews;
* extracted text;
* temporary search results;
* provider responses;
* layout analysis;
* visual assets.

Caches shall be:

* bounded;
* reconstructable;
* version-aware;
* invalidatable;
* removable without data loss.

---

# 24. Authoritative Local Data

Not every local file is a cache.

The following local data may require stronger protection:

* unsynchronized annotations;
* unsynchronized metadata edits;
* pending acquisitions;
* pending synchronization operations;
* user-created local-only drafts;
* conflict-resolution work;
* authentication or device state.

This data shall not be evicted as ordinary cache.

---

# 25. Local Change Tracking

Every local mutation intended for synchronization is recorded explicitly.

A local change record includes:

* ChangeId;
* operation type;
* target resource;
* base revision;
* local revision;
* actor;
* creation time;
* dependencies;
* synchronization state;
* payload reference;
* retry state.

Local change records shall survive application restart.

---

# 26. Pending Changes

Pending changes may include:

* metadata updates;
* new annotations;
* annotation updates;
* collection changes;
* relationship changes;
* source acquisition results;
* cover changes;
* Asset attachments.

Pending changes remain visible to the user.

The client shall not present them as confirmed Master Library state.

---

# 27. Change States

A local change may have the following states:

```text
Draft

↓

Ready

↓

Queued

↓

Transferring

↓

Submitted

↓

Accepted
```

Alternative states include:

* Rejected;
* Conflict;
* RetryPending;
* Cancelled;
* RecoveryRequired.

State transitions shall be explicit.

---

# 28. Synchronization Model

Synchronization is bidirectional.

It consists of:

* uploading local changes;
* downloading authoritative changes;
* transferring required content;
* validating revisions;
* resolving conflicts;
* updating synchronization markers.

The server determines which submitted changes become authoritative.

The client applies the resulting authoritative state.

---

# 29. Synchronization Phases

A synchronization session follows:

```text
Prepare

↓

Authenticate

↓

Negotiate

↓

Discover Changes

↓

Transfer Metadata

↓

Transfer Content

↓

Validate

↓

Commit

↓

Apply Results

↓

Finalize
```

Each phase shall be observable and resumable where practical.

---

# 30. Synchronization Triggers

Synchronization may be triggered by:

* explicit user action;
* application startup;
* application foreground activation;
* connectivity restoration;
* scheduled policy;
* local change threshold;
* server notification;
* requested content access.

Automatic synchronization shall remain bounded and user-visible.

---

# 31. Connectivity Awareness

The client observes connectivity but shall not equate network availability with server availability.

Connectivity state may include:

* Offline;
* NetworkAvailable;
* ServerUnreachable;
* AuthenticationRequired;
* ServerAvailable;
* Degraded;
* Synchronizing.

The UI shall communicate these states clearly.

---

# 32. Synchronization Safety

Synchronization shall protect against:

* replayed operations;
* duplicate submission;
* partial transfer;
* stale base revisions;
* corrupted content;
* revoked device access;
* unsupported protocol versions;
* interrupted sessions;
* duplicate authoritative effects.

Idempotency and revision validation are mandatory.

---

# 33. Conflict Detection

A conflict occurs when local and authoritative changes cannot be safely combined automatically.

Examples include:

* both sides modify the same metadata field;
* a Publication is archived remotely while edited locally;
* an annotation is removed remotely and edited locally;
* source replacement conflicts with a local source-derived operation;
* collection structure changes incompatibly.

Conflicts are recorded explicitly.

---

# 34. Conflict Resolution

Conflict resolution may use:

* safe automatic merge;
* field-level merge;
* user selection;
* duplicate preservation;
* operation cancellation;
* administrative resolution.

The client shall not silently discard local work.

The client shall not silently overwrite authoritative state.

---

# 35. Conflict Presentation

The client presents conflicts using understandable information.

A conflict view should show:

* affected resource;
* local value;
* authoritative value;
* base value where available;
* modification times;
* actors where available;
* recommended actions;
* impact of each action.

Internal synchronization terminology should be translated into user-meaningful language.

---

# 36. Catalog Browser

The Catalog Browser is the primary navigation capability for the Local Library.

It supports:

* list views;
* grid views;
* filtering;
* sorting;
* grouping;
* collections;
* recent items;
* favorites;
* availability state;
* synchronization state;
* acquisition state;
* search integration.

The Catalog Browser queries the Local Catalog.

---

# 37. Catalog Responsiveness

The Catalog Browser shall remain responsive regardless of server connectivity.

Normal browsing shall not depend on synchronous server queries.

Remote changes are incorporated through synchronization.

---

# 38. Publication Presentation

Each Publication may be presented with:

* title;
* creator;
* cover;
* type;
* source format;
* publication date;
* local availability;
* synchronization status;
* annotation count;
* collection membership;
* processing status.

Displayed data may combine authoritative metadata with local derived state.

The distinction shall remain internally explicit.

---

# 39. Acquisition Manager

The Acquisition Manager coordinates adding new content from the client.

It supports:

* local files;
* folders;
* drag and drop;
* shared content;
* supported URLs;
* provider sources;
* scanned content;
* mobile capture.

Acquisition begins locally and may complete locally or through server coordination.

---

# 40. Acquisition Workflow

A client acquisition may follow:

```text
Select Source

↓

Create Acquisition

↓

Validate Input

↓

Stage Locally

↓

Extract Initial Metadata

↓

Analyze Duplicate Candidates

↓

Prepare Local Result

↓

Submit for Synchronization

↓

Server Validation and Commit

↓

Apply Authoritative Result
```

The user may continue working while long-running acquisition stages execute.

---

# 41. Offline Acquisition

The client may acquire content while offline.

Offline acquisition stores:

* the source content;
* local metadata;
* acquisition state;
* checksums;
* user decisions;
* pending synchronization intent.

The acquired content does not become part of the authoritative Master Library until server commit succeeds.

---

# 42. Duplicate Detection

Duplicate analysis may compare:

* checksums;
* source identifiers;
* normalized titles;
* creators;
* publication dates;
* filenames;
* provider identifiers;
* content similarity.

Checksum equality alone does not decide Domain identity.

Duplicate decisions remain explicit.

---

# 43. Reader Integration

The client provides a reading environment for locally available Publications.

The Reader may support:

* original document view;
* reconstructed document view;
* book view;
* paper view;
* magazine view;
* web-content view;
* responsive layout;
* pagination;
* continuous scrolling;
* zoom;
* navigation;
* bookmarks;
* annotations.

Reader operation should not require continuous server access.

---

# 44. Rendering

Rendering is coordinated through the Render Engine or local rendering adapters.

Rendered output is derived from:

* source content;
* UDM;
* DPM;
* styles;
* themes;
* device characteristics;
* user preferences.

Rendered artifacts are caches unless explicitly exported.

---

# 45. Annotation

The client supports annotation workflows including:

* highlights;
* notes;
* comments;
* drawings;
* Apple Pencil input;
* bookmarks;
* post-it notes;
* anchors;
* spatial annotations.

Annotations are stored locally first.

They synchronize as explicit Domain changes.

---

# 46. Annotation Durability

Unsynchronized annotations are protected as user-created data.

They shall:

* persist across restart;
* survive cache cleanup;
* be included in local recovery;
* expose synchronization state;
* never be silently discarded.

---

# 47. Apple Pencil Support

The iPadOS client may support Apple Pencil for:

* freehand drawing;
* highlighting;
* margin notes;
* shape input;
* handwriting;
* document markup.

Pencil data shall remain anchored to stable document or presentation references.

Pixel coordinates alone are insufficient as long-term identity.

---

# 48. Search

The client provides local search over available local data.

Search may include:

* metadata search;
* full-text search;
* collection search;
* annotation search;
* semantic search;
* relationship search.

Local search shall remain available offline for indexed data.

---

# 49. Search Indexes

Search indexes are derived and reconstructable.

They may be updated from:

* synchronization events;
* local mutations;
* local processing;
* imported content;
* annotation changes.

Index freshness shall be tracked.

Index corruption shall not corrupt authoritative or pending local data.

---

# 50. AI Capabilities

The client may provide local and remote AI-assisted capabilities.

Examples include:

* summarization;
* metadata suggestions;
* semantic search;
* question answering;
* classification;
* relationship suggestions;
* writing assistance;
* local knowledge exploration.

AI remains a tool.

AI output is not automatically authoritative.

---

# 51. Local AI

Local AI may execute on supported client hardware.

Local AI benefits include:

* privacy;
* offline availability;
* reduced external dependency;
* lower recurring cost;
* predictable data locality.

Local AI execution shall respect resource limits and platform capability.

---

# 52. Remote AI

Remote AI is optional and policy-controlled.

The client shall not send content remotely unless:

* the feature is enabled;
* the user or applicable policy allows it;
* the provider is approved;
* the data scope is minimized;
* authentication succeeds;
* privacy requirements are satisfied.

Remote AI status shall be visible.

---

# 53. AI Result Classification

AI results are classified as:

* transient response;
* local derived data;
* suggestion;
* proposed Domain change;
* accepted change.

Only accepted changes enter normal local change tracking and synchronization workflows.

---

# 54. Platform Integration

Each client platform may integrate with native capabilities.

## macOS

Potential integrations include:

* Finder;
* Quick Look;
* drag and drop;
* Spotlight;
* Services;
* Share extensions;
* menu bar;
* keyboard shortcuts;
* local filesystem;
* external displays.

## iPadOS

Potential integrations include:

* Apple Pencil;
* multitasking;
* drag and drop;
* document picker;
* Share Sheet;
* Files;
* keyboard and trackpad.

## iOS

Potential integrations include:

* Share Sheet;
* camera;
* document scanner;
* Files;
* quick capture;
* background transfer where supported.

---

# 55. Web Client

A Web client may provide:

* browsing;
* reading;
* search;
* metadata editing;
* annotation;
* limited acquisition;
* synchronization through server APIs.

Web implementation may have reduced:

* persistent filesystem access;
* background execution;
* local model execution;
* offline capacity;
* large-file handling.

The Web client shall not weaken server security or authority.

---

# 56. Client Configuration

Client configuration includes:

* server connection;
* Local Library location;
* synchronization policy;
* download policy;
* cache limits;
* local AI settings;
* remote provider settings;
* rendering preferences;
* diagnostics;
* platform integration.

Secrets are stored using platform-secure facilities.

---

# 57. User Preferences

User preferences are distinct from architectural configuration.

Preferences may include:

* theme;
* typography;
* reading mode;
* default layout;
* zoom;
* sorting;
* navigation behavior;
* synchronization preferences;
* notification preferences.

Preferences shall not silently alter authority or security behavior.

---

# 58. Authentication

The client authenticates the user and device to the Master Library Server.

The client is responsible for:

* secure credential storage;
* session management;
* token renewal;
* logout;
* device registration;
* revocation response;
* authentication-state presentation.

Credentials shall not be stored in ordinary files or logs.

---

# 59. Device Identity

The client maintains a stable Device Identity.

The Device Identity is used for:

* authentication;
* synchronization attribution;
* local change attribution;
* device revocation;
* diagnostics;
* conflict context.

Reinstalling the client may require explicit device re-registration.

---

# 60. Security

The client treats all external input as untrusted.

Security responsibilities include:

* secure local credential storage;
* encrypted transport;
* server identity validation;
* safe file import;
* path protection;
* provider boundary control;
* plugin capability control;
* data minimization;
* secure diagnostics.

Local platform sandboxing should be used where available.

---

# 61. Local Data Protection

Local data protection may rely on:

* operating-system account security;
* platform sandbox;
* encrypted device storage;
* secure keychain;
* application-level encryption where required;
* restricted file permissions.

The user shall be informed when sensitive content is stored locally.

---

# 62. Resource Management

The client manages:

* local storage;
* memory;
* CPU;
* GPU;
* battery;
* network usage;
* background execution;
* model resources;
* cache size.

Resource behavior shall adapt to platform constraints.

---

# 63. Storage Management

The client tracks:

* Local Library size;
* cache size;
* pending upload size;
* downloaded source size;
* generated artifact size;
* available disk space.

The client may recommend or execute safe cleanup of reconstructable data.

It shall never remove unsynchronized user work as cache.

---

# 64. Cache Eviction

Cache eviction may consider:

* last access;
* size;
* reconstruction cost;
* user pinning;
* Publication importance;
* network availability;
* device storage pressure.

Eviction shall preserve metadata and pending local changes.

---

# 65. Content Pinning

Users may pin Publications for offline availability.

Pinned content shall not be automatically evicted under normal cache policy.

If storage becomes critically low, the client shall request user action rather than silently removing pinned content.

---

# 66. Background Execution

The client may execute background work such as:

* downloads;
* uploads;
* synchronization;
* indexing;
* thumbnail generation;
* text extraction;
* local AI processing;
* acquisition preparation.

Background execution shall comply with platform limitations.

---

# 67. Client Jobs

Long-running local operations are represented as jobs.

A client job includes:

* JobId;
* type;
* state;
* progress;
* resource target;
* cancellation support;
* failure;
* retry policy;
* recovery state.

Jobs shall remain observable through the interface.

---

# 68. Job Recovery

After restart, the client inspects incomplete jobs.

It may:

* resume;
* restart;
* cancel;
* mark recovery required;
* clean temporary artifacts;
* preserve staged content.

Recovery decisions shall not silently lose user-created work.

---

# 69. Error Model

Client errors belong to explicit categories:

* validation error;
* authentication error;
* authorization error;
* connectivity error;
* synchronization error;
* conflict error;
* storage error;
* integrity error;
* provider error;
* processing error;
* unsupported capability;
* internal error.

Errors shall be translated into user-meaningful messages.

---

# 70. Error Presentation

Error presentation should communicate:

* what failed;
* what remains safe;
* whether work was saved;
* whether retry is possible;
* whether connectivity is required;
* whether user action is needed;
* where more details can be found.

Raw technical errors should remain available only in diagnostics.

---

# 71. Offline Error Behavior

Loss of connectivity shall not be presented as a general application failure.

The client shall:

* continue local operations;
* preserve pending work;
* update connectivity state;
* defer server-dependent operations;
* retry according to policy;
* inform the user when authority confirmation is pending.

---

# 72. Local Integrity

The client performs integrity checks over:

* Local Catalog;
* local content;
* pending changes;
* synchronization metadata;
* indexes;
* local manifests.

Integrity failures shall distinguish between:

* reconstructable derived data;
* redownloadable authoritative copies;
* unique unsynchronized user data.

---

# 73. Local Recovery

Local recovery may repair:

* interrupted downloads;
* interrupted uploads;
* incomplete cache generation;
* index corruption;
* abandoned temporary files;
* stale synchronization sessions.

Recovery of unique unsynchronized work requires special care and evidence preservation.

---

# 74. Local Backup

The Local Library is not the primary backup of the Master Library.

However, local backup may protect:

* unsynchronized changes;
* user drafts;
* device-specific working state;
* conflict-resolution work.

Local backup policy depends on platform capabilities.

---

# 75. Observability

The client provides observability through:

* structured local logs;
* diagnostic reports;
* synchronization history;
* job status;
* storage status;
* integrity status;
* connectivity status.

Diagnostics shall avoid exposing secrets and unnecessary document content.

---

# 76. Logging

Client logs may include:

* timestamp;
* component;
* operation;
* severity;
* CorrelationId;
* JobId;
* synchronization session;
* result;
* error classification.

Logs shall not contain:

* access tokens;
* passwords;
* private keys;
* complete sensitive documents;
* unrestricted AI prompts;
* provider credentials.

---

# 77. Diagnostics

Diagnostic reports may include:

* client version;
* platform version;
* Local Library version;
* configuration summary;
* storage capacity;
* synchronization status;
* recent failures;
* job states;
* index status.

Sensitive fields shall be redacted.

---

# 78. Updates and Compatibility

The client validates compatibility with:

* Local Library format;
* synchronization protocol;
* server contract version;
* Platform Engine versions;
* plugin versions;
* stored indexes.

Unsupported incompatibility shall be surfaced before unsafe operations occur.

---

# 79. Local Library Migration

Local Library migration is explicit.

Migration shall provide:

* preflight validation;
* backup or recovery point where required;
* progress;
* cancellation rules;
* failure recovery;
* post-migration verification.

Irreversible migration shall not occur silently.

---

# 80. Server Compatibility

The client negotiates capabilities with the Master Library Server.

Negotiation may include:

* protocol version;
* contract version;
* synchronization features;
* supported content formats;
* compression;
* maximum transfer size;
* optional capabilities.

Unsupported optional capabilities should degrade gracefully.

---

# 81. Client Update Policy

Client updates shall not:

* invalidate unsynchronized work;
* silently reset the Local Library;
* remove unsupported local data;
* bypass migration validation;
* force immediate destructive changes.

The update process shall preserve recoverability.

---

# 82. Plugin Support

Client-side plugins may extend:

* import;
* export;
* metadata processing;
* visual presentation;
* commands;
* search;
* providers;
* automation.

Plugins operate through explicit capability boundaries.

Client plugins shall not gain unrestricted access to credentials, Local Library storage or network services.

---

# 83. Client Plugin Isolation

Plugin isolation may use:

* process boundaries;
* extension APIs;
* capability brokers;
* platform sandboxing;
* resource quotas;
* network restrictions.

Plugin failure shall not corrupt the Local Library or crash the primary client workflow.

---

# 84. Performance

The client shall prioritize perceived responsiveness.

Operations that should remain immediate include:

* navigation;
* local browsing;
* opening cached metadata;
* local search;
* reading locally available content;
* creating simple local annotations.

Heavy processing shall execute asynchronously.

---

# 85. Progressive Loading

The interface may progressively load:

* covers;
* previews;
* full sources;
* annotations;
* relationships;
* semantic data;
* remote status.

Progressive loading shall not cause unstable identity or duplicated records.

---

# 86. Responsive State

The UI shall distinguish:

* Loading;
* Ready;
* Offline;
* Pending Synchronization;
* Synchronizing;
* Conflict;
* Degraded;
* Failed;
* Recovery Required.

These states shall not be collapsed into a generic spinner or error.

---

# 87. Accessibility

Client interfaces shall support:

* keyboard navigation;
* assistive technologies;
* scalable typography;
* sufficient contrast;
* reduced-motion preferences;
* clear focus states;
* semantic controls;
* platform accessibility conventions.

Accessibility is a core quality requirement.

---

# 88. Localization

The client architecture shall support localization of:

* interface text;
* dates;
* numbers;
* sorting;
* metadata labels;
* error messages;
* accessibility descriptions.

Persisted Domain identifiers and protocol values remain locale-independent.

---

# 89. Typography

KnowledgeOS clients use platform-appropriate typography.

Apple clients should use:

* SF Pro Display;
* SF Pro Text;
* other system fonts where semantically appropriate.

Publication rendering may use document-specific typography through the DPM.

Interface typography and content typography are separate concerns.

---

# 90. Testing

Client testing includes:

* unit tests;
* application workflow tests;
* Local Library integration tests;
* synchronization tests;
* offline tests;
* conflict tests;
* migration tests;
* UI tests;
* accessibility tests;
* performance tests;
* recovery tests.

Offline and interrupted-operation scenarios are mandatory.

---

# 91. Offline Test Scenarios

Mandatory offline scenarios include:

* start client without server access;
* browse existing Local Library;
* read downloaded Publication;
* create annotation;
* edit metadata;
* acquire local file;
* restart application;
* restore connectivity;
* synchronize pending changes;
* handle conflict;
* verify no local work is lost.

---

# 92. Synchronization Test Scenarios

Synchronization tests shall cover:

* first synchronization;
* incremental synchronization;
* interrupted upload;
* interrupted download;
* duplicate submission;
* stale base revision;
* revoked device;
* server upgrade;
* protocol incompatibility;
* content checksum mismatch;
* conflict resolution;
* repeated synchronization after success.

---

# 93. Platform Tests

Platform-specific testing includes:

## macOS

* filesystem integration;
* drag and drop;
* keyboard navigation;
* large-library performance;
* external drive behavior.

## iPadOS

* Apple Pencil;
* multitasking;
* memory pressure;
* background suspension;
* touch interaction.

## iOS

* capture;
* Share Sheet;
* background transfer;
* limited storage;
* network transitions.

---

# 94. Client Invariants

The following invariants are mandatory:

* the client remains usable offline for locally available capabilities;
* the Master Library remains authoritative;
* local changes are explicitly tracked;
* unsynchronized user work is never treated as disposable cache;
* clients never write directly to authoritative server storage;
* clients never write directly to the server database;
* server-dependent operations are distinguishable from local operations;
* synchronization is observable;
* synchronization is idempotent;
* stale revisions are detected;
* conflicts are never silently discarded;
* authoritative results are applied only after server confirmation;
* Local Library identity is stable;
* filesystem paths do not define Domain identity;
* caches are reconstructable;
* pending user work survives restart;
* background jobs are recoverable;
* local indexes never become authoritative;
* AI output is never automatically authoritative;
* remote data transmission is policy-controlled;
* credentials are stored securely;
* derived artifacts can be removed without losing user knowledge;
* platform-specific behavior does not redefine shared Domain semantics;
* client failure does not corrupt the Master Library;
* client updates preserve unsynchronized work.

---

# 95. Prohibited Designs

The following designs are prohibited:

* requiring continuous server access for all client use;
* direct client writes to PostgreSQL;
* direct client writes to authoritative NAS directories;
* treating the Local Library as independently authoritative;
* using cache eviction for unsynchronized user work;
* hidden last-write-wins conflict handling;
* synchronous server requests for ordinary local browsing;
* storing credentials in normal configuration files;
* UI components constructing storage paths;
* network protocols embedded directly in Domain entities;
* background workers bypassing application workflows;
* AI output directly mutating authoritative data;
* plugin access to unrestricted client storage;
* silent destructive Local Library migration;
* clearing local state after synchronization failure;
* using filename or path as Publication identity;
* treating network availability as proof of server readiness.

---

# 96. Client Module Documents

The `07-Client` implementation block contains:

```text
07-Client/
├── README.md
├── ClientArchitecture.md
├── LocalLibrary.md
├── CatalogBrowser.md
└── AcquisitionManager.md
```

Their responsibilities are:

## `README.md`

Defines the complete client operating model and common invariants.

## `ClientArchitecture.md`

Defines internal modules, dependencies, execution flows and platform composition.

## `LocalLibrary.md`

Defines local persistence, local authority boundaries, change tracking, cache policy and recovery.

## `CatalogBrowser.md`

Defines catalog navigation, queries, presentation state, filtering and local responsiveness.

## `AcquisitionManager.md`

Defines client-side acquisition, staging, duplicate analysis and synchronization handoff.

---

# 97. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/ProductVision.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/JobSystem.md`
* `00-Architecture/03-Kernel/WorkflowEngine.md`
* `00-Architecture/04-Platform/Annotation/README.md`
* `00-Architecture/04-Platform/Import/README.md`
* `00-Architecture/04-Platform/Library/README.md`
* `00-Architecture/04-Platform/Render/README.md`
* `00-Architecture/04-Platform/Search/README.md`
* `00-Architecture/04-Platform/Sync/README.md`
* `00-Architecture/05-Integration/PublicAPI/APIConventions.md`
* `00-Architecture/06-Execution/Runtime/ExecutionModel.md`

## Master Library

* `01-Requirements/Scope.md`
* `01-Requirements/UseCases.md`
* `01-Requirements/AcceptanceCriteria.md`
* `02-TechnicalDesign/ClientDesign.md`
* `02-TechnicalDesign/DataFlow.md`
* `02-TechnicalDesign/OfflineModel.md`
* `02-TechnicalDesign/SynchronizationDesign.md`
* `03-Domain/DomainModel.md`
* `03-Domain/States.md`
* `04-Contracts/ClientContracts.md`
* `04-Contracts/SynchronizationContracts.md`
* `04-Contracts/ErrorContracts.md`
* `05-Persistence/README.md`
* `06-Server/README.md`
* `06-Server/ServerArchitecture.md`
* `06-Server/Security.md`
* `07-Client/ClientArchitecture.md`
* `07-Client/LocalLibrary.md`
* `07-Client/CatalogBrowser.md`
* `07-Client/AcquisitionManager.md`
* `08-Testing/TestStrategy.md`
* `09-Operations/Deployment.md`

---

# 98. Status

**Approved**

The Master Library Client is frozen as the Offline First user-facing runtime of KnowledgeOS.

The client operates primarily against a persistent Local Library, remains useful without continuous server connectivity and synchronizes explicitly with the authoritative Master Library Server.

The Master Library remains the only authoritative library, while the client protects local work, supports responsive platform-native interaction and ensures that synchronization, conflicts, local processing and derived data remain observable, recoverable and structurally separated.
