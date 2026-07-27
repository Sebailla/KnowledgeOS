
# Desktop Application Command Architecture

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Architecture

**Document:** Command Architecture

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architecture responsible for representing, validating, routing, executing and observing commands within the KnowledgeOS Desktop Application.

A Command represents an explicit intention to perform an operation that may change application state, Workspace state or authoritative knowledge through approved Platform contracts.

The Command Architecture establishes a deterministic interaction path from user or system intent to validated state transition.

---

# 2. Scope

This document governs:

* Command definition;
* Command identity;
* Command Context;
* Command lifecycle;
* command registration;
* command routing;
* command validation;
* command availability;
* command execution;
* command results;
* cancellation;
* retries;
* undo and redo participation;
* concurrency;
* command composition;
* UI command projection;
* plugin commands;
* command security;
* integration with the Kernel Command Bus.

It does not define Domain rules, persistence algorithms or event delivery internals.

---

# 3. Objectives

The Command Architecture shall:

* make application intent explicit;
* centralize operation validation;
* prevent direct state mutation from UI components;
* preserve architectural boundaries;
* provide deterministic routing;
* support command discoverability;
* support keyboard shortcuts, menus and automation;
* enable cancellation and structured outcomes;
* support testing and observability;
* integrate with Platform and Kernel capabilities;
* isolate failures;
* support future extensibility.

---

# 4. Command Definition

A Command is an immutable message representing a request to perform an action.

A Command describes:

* what operation is requested;
* the target context;
* required parameters;
* initiating source;
* execution metadata;
* cancellation and correlation information.

A Command expresses intent.

It does not represent a completed fact.

---

# 5. Architectural Position

```text
User or System Intent
        │
        ▼
Command Creation
        │
        ▼
Command Dispatcher
        │
        ├── Registration Resolution
        ├── Context Resolution
        ├── Availability Validation
        ├── Authorization Validation
        └── Execution Coordination
                │
                ▼
          Command Handler
                │
                ├── Workspace State
                ├── Application Services
                └── Engine Gateway
                        │
                        ▼
                  Structured Result
                        │
                        ▼
                Resulting Events
```

UI components submit Commands.

They shall not bypass command processing to mutate architectural state directly.

---

# 6. Command Ownership

The Application Runtime owns the Command Dispatcher and command registration infrastructure.

Command state exists only for the duration of the operation unless explicitly retained for history, diagnostics or undo support.

Handlers operate over state owned by:

* Application Runtime;
* Workspace;
* Window;
* Navigation Context;
* Editor;
* Platform Engines;
* Master Library through approved contracts.

The Command Dispatcher shall not become an alternative state authority.

---

# 7. Command Model

A Command may contain:

```text
Command
│
├── CommandIdentity
├── CommandType
├── CommandVersion
├── CommandPayload
├── CommandContext
├── Initiator
├── CorrelationIdentity
├── CausationIdentity
├── ExecutionPolicy
├── CancellationDescriptor
└── Metadata
```

Command implementations shall remain immutable after dispatch.

---

# 8. Command Identity

Every dispatched Command shall receive a unique Command Identity.

Command Identity supports:

* diagnostics;
* tracing;
* deduplication where required;
* result correlation;
* event causation;
* audit records;
* retry coordination.

Command Identity shall not be reused for logically distinct operations.

---

# 9. Command Type

Command Type identifies the semantic operation.

Examples include:

* CreateWorkspace;
* OpenWorkspace;
* CloseWorkspace;
* CreateWindow;
* CloseWindow;
* OpenTab;
* CloseTab;
* NavigateTo;
* UpdateSelection;
* ImportDocument;
* ExportKnowledge;
* ExecuteAIAction;
* InstallPlugin;
* UpdatePreference.

Command Type names shall describe intent clearly.

Generic commands such as `ExecuteAction` are prohibited unless constrained by an explicit capability contract.

---

# 10. Command Payload

The Command Payload contains operation-specific input.

Payloads shall:

* be explicit;
* be serializable where required;
* use stable identities;
* avoid live UI objects;
* avoid native handles;
* contain only necessary data;
* support validation;
* remain versioned when persisted or externally invoked.

Payloads shall not contain unrestricted mutable references.

---

# 11. Command Context

Command Context identifies the environment in which the Command executes.

It may include:

* Runtime Identity;
* Session Identity;
* Workspace Identity;
* Window Identity;
* Tab Identity;
* Editor Identity;
* Navigation Context Identity;
* current selection;
* user identity;
* authorization context;
* capability context;
* correlation metadata.

Context shall be explicit.

Hidden global context is prohibited.

---

# 12. Context Resolution

Context Resolution determines the valid target of a Command.

Resolution may use:

* explicit identifiers in the Command;
* Active Context;
* focused Window;
* active Tab;
* current Editor;
* Workspace selection;
* command-specific defaults.

Explicit context shall take precedence over derived context unless the contract states otherwise.

---

# 13. Active Context Commands

Commands triggered from menus, shortcuts or toolbars may use the current Active Context.

Before execution, the dispatcher shall resolve and freeze that context for the operation.

A later focus change shall not silently retarget a Command already being executed.

---

# 14. Command Initiators

A Command may originate from:

* direct user interaction;
* keyboard shortcut;
* menu item;
* toolbar action;
* context menu;
* command palette;
* drag and drop;
* automation;
* plugin;
* operating system integration;
* scheduled Runtime operation;
* recovery workflow;
* another approved command workflow.

The initiator shall be recorded where relevant.

---

# 15. Command Lifecycle

A Command may occupy the following states:

| State      | Meaning                                         |
| ---------- | ----------------------------------------------- |
| Created    | Command object exists                           |
| Submitted  | Command entered the dispatcher                  |
| Resolving  | Handler and context are being resolved          |
| Validating | Preconditions and permissions are being checked |
| Queued     | Command is waiting for execution                |
| Executing  | Handler is performing the operation             |
| Cancelling | Cancellation has been requested                 |
| Completed  | Operation succeeded                             |
| Rejected   | Validation or authorization failed              |
| Cancelled  | Operation ended through cancellation            |
| Failed     | Execution produced an error                     |
| Superseded | A newer operation replaced it                   |

Invalid lifecycle transitions shall be rejected.

---

# 16. Command Dispatcher

The Command Dispatcher is the Runtime service responsible for command coordination.

Its responsibilities include:

* accepting Commands;
* assigning execution metadata;
* resolving registrations;
* resolving context;
* validating availability;
* validating authorization;
* selecting execution policy;
* invoking handlers;
* propagating cancellation;
* normalizing results;
* publishing command lifecycle signals;
* recording diagnostics.

The dispatcher shall not implement operation-specific business logic.

---

# 17. Command Registration

Every Command Type shall be registered with one primary handler contract.

Registration shall declare:

* Command Type;
* supported version;
* handler;
* execution scope;
* concurrency policy;
* cancellation support;
* authorization requirements;
* undo capability;
* retry policy;
* required dependencies.

Duplicate primary registrations shall be rejected.

---

# 18. Command Handler

A Command Handler performs one specific command operation.

A handler shall:

* accept one declared Command Type;
* validate operation-specific preconditions;
* operate through approved services;
* preserve state invariants;
* return a structured result;
* publish no false completion events;
* support cancellation where applicable;
* release operation-scoped resources.

Handlers shall remain small and focused.

---

# 19. Handler Responsibilities

A handler may:

* coordinate multiple application services;
* mutate Workspace-owned state through approved operations;
* call Platform Engines through Engine Gateway;
* start background tasks;
* create related commands;
* emit completed-operation events;
* construct undo information.

A handler shall not:

* access UI component internals;
* access PostgreSQL directly;
* access NAS directly;
* instantiate Platform Engines;
* bypass authorization;
* retain invalid scoped references.

---

# 20. Command Validation

Validation shall occur before state mutation.

Validation may include:

* payload validation;
* context validation;
* lifecycle validation;
* target existence;
* capability availability;
* authorization;
* local availability;
* command compatibility;
* concurrency rules;
* current state preconditions.

Validation failures shall return structured rejection results.

---

# 21. Validation Layers

Command validation is divided into:

## 21.1 Structural Validation

Verifies:

* required fields;
* payload schema;
* supported version;
* valid identities;
* valid parameter ranges.

## 21.2 Contextual Validation

Verifies:

* active Workspace;
* valid target Window;
* existing Tab;
* compatible Editor;
* valid selection;
* lifecycle eligibility.

## 21.3 Authorization Validation

Verifies:

* user permission;
* plugin capability;
* remote-service authorization;
* protected operation constraints.

## 21.4 Domain Validation

Delegated to the responsible Platform Engine or Domain service.

The Desktop Application shall not duplicate Domain rules.

---

# 22. Command Availability

Command Availability determines whether a Command can currently be invoked.

Availability may depend on:

* Active Context;
* current selection;
* Workspace state;
* Window state;
* Editor capability;
* authorization;
* synchronization status;
* local availability;
* running tasks;
* plugin state.

Availability is a derived projection.

It shall not become a separately mutable source of truth.

---

# 23. Availability Evaluation

Availability evaluation shall produce a structured state:

* available;
* unavailable;
* hidden;
* temporarily blocked;
* requires confirmation;
* requires connectivity;
* requires capability;
* requires selection.

An unavailable Command should provide a reason when useful.

---

# 24. UI Command Projection

Menus, toolbars, context menus and command palettes shall project registered Commands.

A UI projection may include:

* title;
* icon;
* shortcut;
* category;
* availability;
* destructive indicator;
* confirmation requirement;
* progress state.

UI components shall not duplicate command execution logic.

---

# 25. Command Descriptor

A Command Descriptor defines how a Command is presented and invoked.

It may include:

```text
CommandDescriptor
│
├── CommandType
├── DisplayName
├── Description
├── Category
├── IconReference
├── DefaultShortcut
├── ContextRequirements
├── VisibilityPolicy
├── AvailabilityProvider
├── ConfirmationPolicy
└── PluginOwnership
```

Descriptors shall remain separate from Command instances.

---

# 26. Command Result

Every executed Command shall return a structured Command Result.

A result may include:

* Command Identity;
* completion status;
* result payload;
* created identities;
* updated references;
* warnings;
* failure details;
* cancellation state;
* recovery information;
* undo descriptor;
* correlation metadata.

Raw unstructured exceptions shall not be exposed as command results.

---

# 27. Result Status

Supported result statuses include:

* succeeded;
* succeeded with warnings;
* rejected;
* cancelled;
* failed;
* partially completed;
* deferred;
* queued;
* superseded.

Partial completion shall be used only when the command contract explicitly permits it.

---

# 28. Error Normalization

Command errors shall be normalized into application-level categories.

Representative categories include:

* invalid input;
* invalid context;
* unavailable target;
* permission denied;
* conflict;
* offline unavailable;
* unsupported capability;
* timeout;
* cancellation;
* dependency failure;
* internal failure.

Implementation-specific exceptions shall remain behind service boundaries.

---

# 29. Command Execution Policies

A Command Registration shall declare an execution policy.

Representative policies include:

* immediate;
* UI-context confined;
* background;
* serialized per Workspace;
* serialized per Window;
* serialized per target;
* concurrent;
* exclusive Runtime operation;
* deferred;
* scheduled.

Execution policy shall be explicit.

---

# 30. UI-Context Commands

Commands that modify UI-facing Runtime state shall commit their state transition on the designated UI execution context.

Examples include:

* activate tab;
* update layout;
* change selection;
* focus window;
* open panel.

Heavy work required by the Command shall occur outside the UI context where practical.

---

# 31. Background Commands

Long-running Commands may execute through the Task Coordinator.

Examples include:

* import;
* export;
* indexing;
* AI processing;
* synchronization request;
* document conversion;
* preview generation.

Background Commands shall expose:

* progress;
* cancellation;
* completion result;
* failure status;
* lifecycle awareness.

---

# 32. Deferred Commands

A Command may return a deferred result when execution continues asynchronously.

The result shall provide:

* Task Identity;
* current status;
* cancellation capability;
* expected result contract;
* correlation identity.

Deferred execution shall not hide failures.

---

# 33. Command Concurrency

Concurrency shall be controlled by declared policy.

The dispatcher may:

* execute concurrently;
* serialize;
* queue;
* reject;
* supersede;
* merge;
* cancel a previous operation.

Concurrency behavior shall not depend on incidental thread timing.

---

# 34. Serialization Keys

Commands affecting the same consistency boundary shall use a serialization key.

A key may represent:

* Workspace Identity;
* Window Identity;
* Tab Identity;
* Knowledge Object Identity;
* document version;
* plugin instance;
* Runtime operation category.

Commands sharing an exclusive key shall not commit incompatible transitions concurrently.

---

# 35. Superseding Commands

Some Commands may supersede older pending Commands.

Examples include:

* repeated search query updates;
* rapid navigation previews;
* layout resize updates;
* temporary selection changes;
* preview generation.

Superseded Commands shall not commit late results over newer state.

---

# 36. Command Cancellation

Cancellable Commands shall accept a cancellation signal.

Cancellation shall:

* propagate to dependencies;
* stop unnecessary work;
* preserve state consistency;
* release resources;
* return a structured cancelled result;
* prevent completion events from being published falsely.

Cancellation is cooperative unless the underlying operation supports stronger guarantees.

---

# 37. Non-Cancellable Operations

A Command may be non-cancellable when cancellation would violate consistency.

Examples may include:

* final atomic commit;
* schema migration step;
* integrity checkpoint finalization;
* critical recovery transition.

Non-cancellable phases shall be minimized and documented.

---

# 38. Command Timeout

Commands interacting with external or long-running dependencies may define timeouts.

A timeout shall:

* produce a structured result;
* request cancellation where possible;
* preserve state consistency;
* distinguish timeout from user cancellation;
* avoid silent retries unless policy allows them.

---

# 39. Retry Policy

Retry may be allowed for transient failures.

A retry policy shall define:

* eligible error categories;
* maximum attempts;
* delay strategy;
* idempotency requirements;
* cancellation behavior;
* diagnostic reporting.

Non-idempotent Commands shall not be retried automatically without a safe deduplication contract.

---

# 40. Command Idempotency

Commands shall declare whether they are idempotent.

Idempotent examples may include:

* ActivateWindow;
* SetActiveTab;
* RegisterWorkspace;
* ApplyUnchangedPreference;
* RestoreFromSameCheckpoint.

Non-idempotent examples may include:

* CreateKnowledgeObject;
* DuplicateTab;
* ExportToNewFile;
* AppendAnnotation.

Idempotency shall be enforced by contract, not assumed.

---

# 41. Deduplication

Commands received from external, retryable or distributed sources may require deduplication.

Deduplication may use:

* Command Identity;
* idempotency key;
* operation fingerprint;
* target identity;
* persisted execution record.

Deduplication shall not merge distinct user intentions accidentally.

---

# 42. Composite Commands

A Composite Command coordinates several related operations as one application intent.

Examples include:

* open content in a new window;
* move a tab between windows;
* restore a Workspace;
* import and open a document;
* close a Workspace with multiple windows.

Composite Commands shall define:

* child operation order;
* consistency boundary;
* failure behavior;
* compensation behavior;
* result aggregation.

---

# 43. Command Workflows

Complex multi-step processes should use Workflow Engine or explicit application workflows instead of deeply nested handlers.

A workflow may coordinate:

* commands;
* queries;
* background tasks;
* user confirmations;
* recovery steps;
* Engine operations.

Command handlers shall not become hidden workflow engines.

---

# 44. Nested Commands

A handler may dispatch another Command only when:

* the dependency is explicit;
* recursion is prevented;
* correlation and causation are preserved;
* consistency boundaries remain valid;
* failure behavior is defined.

Direct recursive command dispatch is prohibited.

---

# 45. Command Transactions

Commands that mutate multiple related state objects shall execute within an appropriate consistency transaction.

Possible transaction scopes include:

* Workspace state transaction;
* Window state transaction;
* Runtime state transaction;
* Platform Engine transaction;
* Master Library transaction through server contracts.

The Desktop Application shall not create direct database transactions.

---

# 46. State Mutation Rule

All architectural state mutations initiated by user or system intent shall occur through:

* a registered Command;
* an approved lifecycle transition;
* a controlled event-reaction process where explicitly defined.

UI components shall not mutate Workspace-owned state directly.

---

# 47. Command and Events

Commands and Events have different semantics.

A Command means:

> Perform this operation.

An Event means:

> This operation or state transition occurred.

A Command may cause zero or more Events after successful completion.

An Event shall not be treated as a hidden Command.

---

# 48. Event Publication

A handler shall publish completion Events only after the relevant state transition succeeds.

Events shall include:

* correlation identity;
* causation identity;
* affected scope;
* resulting identities;
* version metadata where required.

Failed Commands shall not publish success Events.

---

# 49. Command and Queries

Commands may use Queries to inspect required state.

Queries shall not mutate state.

A handler shall avoid reading arbitrary UI state directly and instead use approved query interfaces or explicit context.

---

# 50. Undo Architecture

Commands that support Undo shall return an Undo Descriptor.

An Undo Descriptor may contain:

* original Command Identity;
* affected scope;
* inverse operation;
* required state snapshot;
* precondition version;
* expiration policy;
* user-facing description.

Undo shall be explicit.

Not every Command is undoable.

---

# 51. Undoable Commands

Potentially undoable Commands include:

* change layout;
* move tab;
* close recoverable tab;
* update selection grouping;
* rename local Workspace metadata;
* create annotation;
* change presentation preference.

Whether authoritative knowledge mutations are undoable depends on Platform Engine contracts.

---

# 52. Non-Undoable Commands

Commands may be non-undoable when they:

* trigger external irreversible effects;
* delete data beyond recoverable retention;
* publish externally;
* invoke third-party systems;
* perform security changes;
* finalize migrations;
* execute operations without inverse semantics.

Non-undoable destructive Commands shall clearly communicate consequences.

---

# 53. Redo

Redo re-executes a previously undone operation using an approved Redo Descriptor.

Redo shall validate that:

* required context still exists;
* state preconditions remain valid;
* authorization still permits the operation;
* the operation remains compatible.

Redo shall not blindly replay stale implementation objects.

---

# 54. Command History

Command History may record:

* completed user-visible Commands;
* undoable Commands;
* failed operations;
* execution timestamps;
* affected scopes;
* result summaries.

Command History shall remain separate from Navigation History and Domain audit history.

---

# 55. Confirmation Policies

Commands may require confirmation when they are:

* destructive;
* irreversible;
* privacy-sensitive;
* externally visible;
* costly;
* broad in scope;
* operating on unsaved work.

Confirmation shall occur before irreversible execution.

Routine safe actions shall not require unnecessary confirmation.

---

# 56. Destructive Commands

Destructive Commands shall declare:

* affected resources;
* recoverability;
* retention behavior;
* authorization requirement;
* confirmation policy;
* audit requirement.

Destructive styling in the UI shall derive from the Command Descriptor.

---

# 57. Command Palette

The Command Palette shall discover registered Commands from descriptors.

It may support:

* search;
* categories;
* aliases;
* contextual ranking;
* keyboard execution;
* recently used Commands;
* plugin Commands.

The palette shall use the same availability and execution pipeline as menus and shortcuts.

---

# 58. Keyboard Shortcuts

Keyboard shortcuts map input gestures to Command Types.

Shortcut handling shall:

* resolve current context;
* respect platform conventions;
* detect conflicts;
* support user customization;
* route through the Command Dispatcher;
* remain independent from handler implementation.

A shortcut shall never call a handler directly.

---

# 59. Menus and Toolbars

Menus and toolbars are command projections.

They shall derive:

* labels;
* icons;
* availability;
* checked state;
* contextual visibility;
* shortcuts;
* progress.

They shall not replicate validation or execution logic.

---

# 60. Context Menus

Context menus shall freeze a relevant context when created or when the Command is selected, according to policy.

A context menu Command shall target the object that produced the menu, not an unrelated later selection.

---

# 61. Drag-and-Drop Commands

A completed drag-and-drop intent shall be translated into an explicit Command.

Examples include:

* MoveTab;
* AttachAsset;
* ImportFiles;
* ReorderItems;
* CreateRelationship;
* OpenInWorkspace.

Drag state itself remains transient interaction state.

---

# 62. Operating System Commands

Operating system actions may generate Commands, including:

* open file;
* open URL;
* activate notification;
* continue user activity;
* print;
* share;
* reopen window;
* handle external document.

Platform-originated input shall be validated before command creation.

---

# 63. Automation Commands

Automation integrations may invoke approved Commands through a restricted contract.

Automation shall:

* authenticate the caller;
* validate capability;
* use versioned payloads;
* provide explicit context;
* receive structured results;
* respect user privacy.

Automation shall not expose unrestricted internal handlers.

---

# 64. Plugin Commands

Plugins may register Commands through the Plugin SDK.

Plugin registration shall declare:

* plugin identity;
* Command Type namespace;
* payload schema;
* handler entry point;
* required capabilities;
* allowed contexts;
* UI descriptor;
* execution policy;
* failure behavior.

Plugin Commands shall not override core Command Types unless an explicit extension contract permits decoration.

---

# 65. Plugin Command Isolation

Plugin Command failures shall:

* remain isolated;
* return structured plugin errors;
* not corrupt Workspace state;
* not terminate the Runtime;
* release plugin-scoped resources;
* disable the contribution if repeated critical failures occur.

Plugin Commands shall not bypass Engine Gateway or security policies.

---

# 66. AI Commands

AI-assisted operations shall be represented by explicit Commands.

Examples include:

* SummarizeSelection;
* ExplainDocument;
* SuggestRelationships;
* GenerateDraft;
* ExtractMetadata;
* AskWorkspaceContext.

AI Commands shall define:

* approved context;
* provider policy;
* local or remote execution preference;
* privacy classification;
* cancellation;
* result handling.

The complete Workspace shall not be included implicitly.

---

# 67. Offline Commands

Command availability shall account for offline conditions.

An offline Command may:

* execute locally;
* create a pending operation;
* use cached content;
* be rejected as unavailable;
* be deferred until connectivity returns.

The result shall clearly distinguish these outcomes.

---

# 68. Synchronization-Aware Commands

Commands affecting synchronized knowledge may need to account for:

* local version;
* pending changes;
* conflict state;
* connectivity;
* synchronization permissions.

The Desktop Application shall rely on the Synchronization Engine for synchronization rules.

---

# 69. Command Security

Command execution shall enforce:

* payload validation;
* context validation;
* authorization;
* capability boundaries;
* plugin restrictions;
* external input validation;
* Workspace isolation;
* secret protection.

Possession of a Command Type name does not grant permission to execute it.

---

# 70. Command Privacy

Command metadata and diagnostics may reveal user activity.

Privacy rules shall:

* avoid storing sensitive payloads by default;
* redact document content;
* redact AI prompts where required;
* limit command-history retention;
* protect external invocation data;
* avoid telemetry of private knowledge.

---

# 71. Observability

Command observability may include:

* execution count;
* duration;
* queue time;
* validation failures;
* authorization failures;
* cancellation rate;
* retry rate;
* timeout rate;
* handler failures;
* affected scope;
* result status.

Sensitive payload content shall not be recorded by default.

---

# 72. Diagnostics

Diagnostic records should include:

* Command Identity;
* Command Type;
* correlation identity;
* causation identity;
* scope identities;
* lifecycle timestamps;
* handler identity;
* result category;
* failure category.

Diagnostics shall not become an audit substitute for authoritative Domain operations.

---

# 73. Performance

Command execution shall minimize perceived latency.

The architecture shall support:

* fast availability evaluation;
* lazy payload construction;
* asynchronous heavy work;
* background execution;
* cancellation;
* progress reporting;
* serialized state commits;
* deduplicated rapid operations.

The UI thread shall not perform heavy command work.

---

# 74. Testing Strategy

The Command Architecture shall support tests for:

* registration;
* context resolution;
* payload validation;
* availability;
* authorization;
* routing;
* handler execution;
* result normalization;
* cancellation;
* timeouts;
* retries;
* concurrency;
* superseding;
* composite Commands;
* undo and redo;
* plugin Commands;
* offline behavior;
* event publication.

---

# 75. Architecture Tests

Automated architecture tests should verify:

* UI components do not call handlers directly;
* handlers do not access persistence infrastructure directly;
* Platform Engines are accessed through Engine Gateway;
* Command Types have one primary registration;
* handlers respect declared scopes;
* plugin Commands remain namespaced;
* state mutations use approved Commands.

---

# 76. Determinism

Given the same:

* Command;
* resolved context;
* current valid state;
* execution policy;
* authorization result;
* ordered dependency outcomes;

the Command Dispatcher shall produce the same logical result.

Timing differences shall not change semantic behavior.

---

# 77. Idempotency

The following infrastructure operations shall be idempotent where applicable:

* Command registration validation;
* cancellation requests;
* handler disposal;
* availability evaluation;
* repeated result observation;
* retry deduplication.

Each Command contract shall independently declare its operation-level idempotency.

---

# 78. Command Architecture Prohibitions

The Command Architecture shall not:

* permit direct UI mutation of architectural state;
* expose handlers as public UI callbacks;
* use Events as hidden Commands;
* rely on implicit global context;
* bypass authorization;
* access PostgreSQL directly;
* access NAS directly;
* instantiate Platform Engines directly;
* retry non-idempotent operations unsafely;
* publish success Events before state commit;
* allow plugin Commands unrestricted access;
* block the UI thread with long-running work;
* store sensitive payloads in diagnostics by default.

---

# 79. Validation Matrix

| Concern              | Required Validation        |
| -------------------- | -------------------------- |
| Command registration | Architecture tests         |
| Payload schema       | Unit tests                 |
| Context resolution   | Context tests              |
| Availability         | State-projection tests     |
| Authorization        | Security tests             |
| Routing              | Dispatcher tests           |
| Handler behavior     | Unit and integration tests |
| Cancellation         | Concurrency tests          |
| Retry policy         | Failure-injection tests    |
| Idempotency          | Repetition tests           |
| Composite Commands   | Transaction tests          |
| Undo and redo        | State restoration tests    |
| Plugin Commands      | Isolation tests            |
| UI projection        | Interaction tests          |

---

# 80. Anti-Patterns

The following are prohibited:

* button actions containing business logic;
* menu items calling services directly;
* generic untyped action dictionaries;
* handlers reading global mutable state;
* command payloads containing native UI objects;
* duplicate validation scattered across UI surfaces;
* silent automatic retries of unsafe operations;
* nested command recursion;
* handlers acting as hidden workflow engines;
* success Events published before completion;
* one global lock for all Commands;
* storing full sensitive payloads in command history.

---

# 81. Architectural Invariants

The following invariants are mandatory:

* every state-changing user or system intent is represented by an explicit Command or approved lifecycle transition;
* every Command is immutable after dispatch;
* every dispatched Command has a unique identity;
* every Command Type has one primary handler registration;
* Command Context is explicit and validated;
* UI components never invoke handlers directly;
* handlers operate through approved application services and Engine Gateway;
* Command Availability is derived from current state;
* failed or cancelled Commands do not publish false completion Events;
* late superseded results cannot overwrite newer state;
* long-running Commands never block the UI thread;
* retries require an explicit safe policy;
* plugin Commands remain isolated and capability-controlled;
* authoritative knowledge mutations occur only through approved Platform contracts;
* structured Command Results are returned for every execution outcome.

---

# 82. Related Documents

* `RuntimeArchitecture.md`
* `ApplicationArchitecture.md`
* `WorkspaceArchitecture.md`
* `WindowManagement.md`
* `SessionManagement.md`
* `NavigationArchitecture.md`
* `EventArchitecture.md`
* `StateManagement.md`
* `DependencyGraph.md`
* `../06-Interaction/KeyboardShortcuts.md`
* `../06-Interaction/DragDrop.md`
* `../06-Interaction/ContextMenus.md`
* `../06-Interaction/QuickActions.md`
* `../07-Integration/EngineIntegration.md`
* Kernel Command Bus
* Kernel Workflow Engine
* Platform Architecture
* Plugin SDK Contracts
* Architecture Decision Records

---

# 83. Status

**Approved**

This document establishes the authoritative Command Architecture for the KnowledgeOS Desktop Application.

Commands represent explicit and immutable user or system intentions. The Application Runtime resolves their context, validates their availability and authorization, routes them to registered handlers and returns structured outcomes.

All Desktop Application interactions that change Runtime, Workspace or authoritative knowledge state shall comply with the command ownership, validation, execution, isolation and integration rules defined herein.
