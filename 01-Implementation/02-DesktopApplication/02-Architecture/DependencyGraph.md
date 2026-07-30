
# Desktop Application Dependency Graph

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Desktop Application

**Layer:** Architecture

**Document:** Dependency Graph

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the authoritative dependency graph for the KnowledgeOS Desktop Application.

It establishes the permitted dependency directions between architectural layers, Runtime components, Workspace components, application services, Platform Engines, the Kernel, shared contracts, plugins and platform-specific adapters.

The Dependency Graph prevents architectural cycles, hidden coupling, direct infrastructure access and erosion of the ownership boundaries defined throughout the Desktop Application architecture.

---

# 2. Scope

This document governs:

* architectural dependency direction;
* layer boundaries;
* Runtime dependencies;
* Workspace dependencies;
* UI dependencies;
* Command and Event dependencies;
* State Management dependencies;
* Platform Engine integration;
* Kernel integration;
* Shared SDK usage;
* plugin dependencies;
* platform-specific dependencies;
* prohibited dependencies;
* dependency validation;
* cycle prevention;
* architecture testing.

It does not define runtime object lifecycles in detail or implementation-specific package names.

---

# 3. Objectives

The Dependency Graph shall:

* preserve architectural separation;
* make dependency direction explicit;
* prevent circular dependencies;
* enforce Runtime and Workspace ownership;
* isolate platform-specific code;
* isolate plugins;
* prevent direct persistence access;
* preserve Domain independence;
* support testing;
* support modular implementation;
* enable gradual replacement of components;
* maintain deterministic initialization and disposal.

---

# 4. Dependency Definition

A dependency exists when one component requires another component to:

* compile;
* execute;
* construct;
* validate;
* observe;
* serialize;
* restore;
* handle a Command;
* consume an Event;
* call a service;
* resolve a contract.

Dependencies may be:

* compile-time;
* runtime;
* data-contract;
* lifecycle;
* event subscription;
* service resolution;
* plugin capability;
* platform integration.

All dependency forms shall respect the architectural direction defined herein.

---

# 5. Dependency Direction Principle

Dependencies shall point toward more stable abstractions.

Higher-level application components may depend on:

* contracts;
* interfaces;
* immutable descriptors;
* Domain types;
* Kernel abstractions;
* Shared SDK contracts.

They shall not depend directly on unstable infrastructure implementations.

---

# 6. High-Level Dependency Graph

```text
Desktop UI
    │
    ▼
Application and Workspace Layer
    │
    ▼
Desktop Application Services
    │
    ▼
Integration Gateways
    │
    ▼
Platform Engines
    │
    ▼
Kernel
    │
    ▼
Domain
```

External infrastructure is reached only through approved adapters and Platform contracts.

---

# 7. Complete Architectural Graph

```text
Operating System
        │
        ▼
Platform Adapter
        │
        ▼
Desktop UI Projection
        │
        ▼
Application Runtime
        │
        ├── Session Management
        ├── Workspace Registry
        ├── Command Dispatcher
        ├── Event Dispatcher
        ├── State Coordination
        ├── Task Coordination
        └── Engine Gateway
                │
                ▼
        Platform Engine Contracts
                │
                ▼
          Platform Engines
                │
                ▼
              Kernel
                │
                ▼
              Domain
                │
                ▼
       Master Library Contracts
```

The Desktop Application shall never bypass this dependency chain to access authoritative infrastructure directly.

---

# 8. Architectural Layers

The Desktop Application is divided into the following logical layers:

1. Platform Integration Layer;
2. Presentation Layer;
3. Application Runtime Layer;
4. Workspace Layer;
5. Application Service Layer;
6. Integration Gateway Layer;
7. Shared Contract Layer;
8. Platform Engine Layer;
9. Kernel Layer;
10. Domain Layer.

Each layer has an explicit dependency policy.

---

# 9. Platform Integration Layer

The Platform Integration Layer contains operating-system-specific implementations.

It may include:

* macOS application lifecycle adapter;
* native Window adapter;
* menu adapter;
* file-open adapter;
* notification adapter;
* drag-and-drop adapter;
* clipboard adapter;
* accessibility adapter;
* display adapter;
* secure storage adapter;
* system appearance adapter.

This layer depends on Desktop contracts.

Core Desktop architecture shall not depend on native platform implementations.

---

# 10. Presentation Layer

The Presentation Layer contains:

* windows;
* views;
* controls;
* visual components;
* menus;
* toolbars;
* dialogs;
* panels;
* editor views;
* accessibility projections;
* visual state bindings.

The Presentation Layer may depend on:

* immutable state projections;
* Command descriptors;
* Command submission contracts;
* Event observation contracts;
* view models;
* presentation services;
* platform abstraction contracts.

It shall not depend directly on:

* Platform Engine implementations;
* Kernel implementations;
* database clients;
* NAS access;
* synchronization storage;
* Domain repositories.

---

# 11. Application Runtime Layer

The Application Runtime Layer contains the process-level orchestration model.

It owns:

* Runtime State;
* Active Session;
* Workspace Registry;
* Runtime Services;
* Command Dispatcher;
* Event Dispatcher;
* Task Registry;
* Engine Gateway;
* Platform Adapter registration;
* diagnostics coordination;
* recovery coordination.

It may depend on:

* Desktop application contracts;
* Kernel abstractions;
* Platform Engine contracts;
* Shared SDK types;
* Domain identities and descriptors;
* platform abstraction interfaces.

It shall not depend on UI component implementations.

---

# 12. Workspace Layer

The Workspace Layer contains the user’s complete working context.

It owns:

* Workspace State;
* Window States;
* Tab States;
* Editor States;
* Panel States;
* Navigation State;
* Selection State;
* Layout;
* History;
* restoration metadata.

The Workspace Layer may depend on:

* immutable Domain identities;
* application contracts;
* Command contracts;
* Event contracts;
* Engine Gateway contracts;
* serialization contracts;
* Workspace-scoped services.

It shall not depend directly on:

* native windows;
* database implementations;
* NAS clients;
* Platform Engine implementations;
* unrelated Workspace instances.

---

# 13. Application Service Layer

Application Services coordinate use cases across Runtime and Workspace components.

Representative services include:

* Window Manager;
* Navigation Manager;
* Session Manager;
* Editor Manager;
* Panel Manager;
* Selection Coordinator;
* Task Coordinator;
* Recovery Coordinator;
* Command Availability Service.

Application Services may depend on:

* state owners;
* explicit registries;
* application contracts;
* Engine Gateway;
* Command Dispatcher;
* Event Publisher;
* Shared SDK contracts.

They shall not own duplicated architectural state.

---

# 14. Integration Gateway Layer

The Integration Gateway Layer separates Desktop Application logic from Platform Engine implementations.

It includes:

* Engine Gateway;
* Platform capability resolver;
* provider gateway;
* plugin gateway;
* external navigation gateway;
* file import gateway;
* export gateway;
* AI execution gateway;
* synchronization status gateway.

This layer translates Desktop requests into stable Platform contracts.

---

# 15. Shared Contract Layer

The Shared Contract Layer contains stable types used across implementation modules.

It may include:

* identities;
* descriptors;
* serialized messages;
* Command contracts;
* Event contracts;
* query contracts;
* result types;
* error categories;
* capability descriptors;
* plugin contracts;
* version metadata.

Shared contracts shall avoid importing implementation-specific classes.

---

# 16. Platform Engine Layer

Platform Engines implement product capabilities such as:

* Knowledge;
* Library;
* Search;
* Render;
* Annotation;
* Import;
* Export;
* AI;
* Plugin;
* Synchronization.

The Desktop Application depends on their public contracts through Engine Gateway.

It shall not depend on internal Engine modules.

---

# 17. Kernel Layer

The Kernel provides infrastructure abstractions including:

* Command Bus;
* Event Bus;
* Query Bus;
* Dependency Injection;
* Scheduler;
* Job System;
* Workflow Engine;
* Configuration;
* Logging;
* Observability.

Desktop Runtime services may use Kernel contracts.

Desktop UI components shall not access Kernel infrastructure directly.

---

# 18. Domain Layer

The Domain defines stable business concepts and invariants.

The Desktop Application may depend on:

* Domain identities;
* immutable value objects;
* public Domain descriptors;
* validation results;
* semantic contracts.

The Domain shall not depend on the Desktop Application.

---

# 19. Master Library Boundary

The Master Library is the authoritative source for shared knowledge and metadata.

The Desktop Application shall access it only through:

* Platform Engines;
* Public Contracts;
* approved client services;
* synchronization protocols.

The Desktop Application shall not access:

* PostgreSQL directly;
* NAS volumes directly;
* server-internal repositories;
* server-internal database models.

---

# 20. Dependency Rule

The general dependency rule is:

```text
Presentation
    ↓
Application Runtime and Workspace
    ↓
Application Services
    ↓
Integration Gateways
    ↓
Platform Contracts
    ↓
Platform Engines
    ↓
Kernel and Domain
```

Dependencies shall not point upward.

---

# 21. Dependency Inversion

When a lower-level implementation must interact with a higher-level policy, the higher-level layer defines an abstraction.

Example:

```text
Application Runtime
        │
        ├── defines WindowPlatformAdapter contract
        │
        ▼
macOS Window Adapter implements contract
```

The Runtime depends on the contract.

The platform-specific implementation depends on the same contract.

The Runtime does not depend on the concrete adapter.

---

# 22. Runtime Dependency Rules

Application Runtime may depend on:

* Session Manager;
* Workspace Registry;
* Command Dispatcher;
* Event Dispatcher;
* Task Coordinator;
* Engine Gateway;
* Platform Adapter interfaces;
* Configuration;
* Logging;
* Diagnostics;
* Kernel contracts.

Application Runtime shall not depend on:

* specific Window implementations;
* specific editor views;
* specific panels;
* individual plugin implementations;
* database clients.

---

# 23. Workspace Dependency Rules

A Workspace may depend on:

* Workspace-owned state types;
* Window State;
* Tab State;
* Editor State;
* Panel State;
* Navigation State;
* selection and layout contracts;
* application services through interfaces;
* Domain identities;
* Engine Gateway contracts.

A Workspace shall not depend on:

* another Workspace’s internal state;
* Runtime global mutable state;
* native window implementations;
* Platform Engine internals;
* persistence infrastructure.

---

# 24. Window Dependency Rules

Window State may depend on:

* Window Identity;
* Workspace Identity;
* Tab identities;
* layout descriptors;
* panel descriptors;
* navigation context identity;
* restoration metadata.

Window State shall not depend on:

* native window handles;
* editor view implementations;
* Platform Engines;
* database infrastructure;
* Session Manager implementation.

---

# 25. Tab Dependency Rules

Tab State may depend on:

* Tab Identity;
* Window Identity;
* content identities;
* editor descriptors;
* navigation descriptors;
* restoration metadata.

A Tab shall not own:

* Window State;
* Workspace Registry;
* authoritative document content;
* native view instances.

---

# 26. Editor Dependency Rules

Editor logic may depend on:

* editor contracts;
* content descriptors;
* Render Engine contracts;
* Annotation Engine contracts;
* Command submission;
* Event observation;
* selection contracts;
* navigation contracts.

Editors shall not depend directly on:

* Master Library repositories;
* Synchronization Engine internals;
* native window managers;
* unrelated panels;
* database clients.

---

# 27. Panel Dependency Rules

Panels may depend on:

* read-only state projections;
* Command contracts;
* Event contracts;
* query services;
* capability descriptors;
* plugin contracts where applicable.

Panels shall not mutate Workspace State directly.

Panels shall not call Platform Engine implementations directly.

---

# 28. Manager Dependency Rules

Managers may depend on:

* the state owners they coordinate;
* registries;
* Command Dispatcher;
* Event Publisher;
* Engine Gateway;
* application-level policies;
* platform abstraction interfaces.

Managers shall not:

* own competing state;
* depend on UI component implementations;
* access persistence infrastructure;
* create circular manager dependencies.

---

# 29. Manager Coordination

Managers shall coordinate through explicit contracts rather than direct mutual references.

Preferred coordination:

```text
Command Dispatcher
        │
        ▼
Primary Manager
        │
        ▼
State Transition
        │
        ▼
Event Publication
        │
        ▼
Secondary Manager Reaction
```

Direct bidirectional manager references are prohibited.

---

# 30. Command Dependency Rules

Command definitions may depend on:

* stable identities;
* immutable value objects;
* versioned payload types;
* explicit context types;
* execution metadata.

Commands shall not depend on:

* handlers;
* UI components;
* concrete services;
* Platform Engine implementations;
* mutable state containers.

---

# 31. Command Handler Dependency Rules

Command Handlers may depend on:

* explicit state owners;
* application services;
* Engine Gateway;
* Query interfaces;
* Event Publisher;
* authorization services;
* workflow contracts.

Handlers shall not depend on:

* presentation implementations;
* database clients;
* NAS access;
* unrelated handlers;
* native platform objects.

---

# 32. Event Dependency Rules

Event definitions may depend on:

* stable identities;
* immutable result descriptors;
* scope descriptors;
* correlation metadata;
* versioned payload contracts.

Events shall not depend on:

* subscribers;
* UI implementations;
* concrete handlers;
* mutable service objects;
* platform-native classes.

---

# 33. Event Subscriber Dependency Rules

Subscribers may depend on:

* event contracts;
* read-only state access;
* projection services;
* Command Dispatcher through explicit reaction policy;
* diagnostics;
* cache services.

Subscribers shall not create hidden bidirectional dependencies with producers.

---

# 34. State Management Dependency Rules

State containers may depend on:

* immutable state types;
* validation rules;
* transition contracts;
* identity types;
* serialization descriptors;
* version metadata.

State containers shall not depend on:

* UI controls;
* event subscribers;
* Platform Engine implementations;
* native resources.

---

# 35. Navigation Dependency Rules

Navigation Manager may depend on:

* Workspace Navigation State;
* Window and Tab registries;
* Target Resolver;
* Engine Gateway;
* Editor Manager contract;
* Command and Event contracts;
* authorization services.

Target Resolver may depend on Platform Engine contracts.

Navigation State shall not depend on Navigation Manager.

---

# 36. Session Dependency Rules

Session Manager may depend on:

* Runtime lifecycle;
* Workspace descriptors;
* Window descriptors;
* serialization services;
* migration services;
* checkpoint storage abstraction;
* diagnostics.

Session descriptors shall not depend on live Runtime services.

---

# 37. Task Dependency Rules

Task Coordinator may depend on:

* Scheduler;
* Job System;
* cancellation contracts;
* Command correlation;
* Event Publisher;
* task state registry;
* diagnostics.

Individual tasks shall not retain unrestricted Runtime references.

---

# 38. Platform Adapter Dependency Rules

Platform Adapters may depend on:

* native operating system frameworks;
* Desktop-defined adapter contracts;
* Shared SDK types;
* normalized Event contracts;
* Command submission interfaces.

Platform Adapters shall not:

* own Workspace State;
* implement Domain rules;
* access Master Library storage directly;
* call Platform Engine internals;
* mutate UI-independent state without a Command.

---

# 39. Shared SDK Dependency Rules

The Shared SDK may depend on:

* stable Domain contracts;
* serialization primitives;
* versioning primitives;
* public error contracts;
* capability contracts.

The Shared SDK shall not depend on:

* Desktop Application implementations;
* Mobile Application implementations;
* Web Application implementations;
* native operating system frameworks;
* server infrastructure implementations.

---

# 40. Plugin Dependency Rules

Plugins may depend on:

* Plugin SDK;
* declared capability contracts;
* public Command contracts;
* public Event contracts;
* public view contribution contracts;
* approved Engine capabilities.

Plugins shall not depend on:

* internal Desktop classes;
* internal state containers;
* concrete Managers;
* concrete Engine implementations;
* Kernel internals;
* database infrastructure;
* private application services.

---

# 41. Plugin Host Dependency Rules

Plugin Host may depend on:

* Plugin SDK;
* capability registry;
* Command Dispatcher;
* Event Dispatcher;
* contribution registries;
* plugin state registry;
* isolation services;
* diagnostics.

Core Runtime shall depend only on Plugin Host contracts, not individual plugins.

---

# 42. Platform Engine Dependency Rules

Desktop integration may depend on Platform Engine public contracts.

It shall not depend on:

* internal processing pipelines;
* internal repositories;
* internal caches;
* internal worker implementations;
* undocumented classes.

Engine implementation changes shall not require Desktop UI rewrites when public contracts remain stable.

---

# 43. Query Dependency Rules

Query definitions may depend on:

* stable identities;
* filter descriptors;
* pagination descriptors;
* result contracts.

Query handlers may depend on:

* state owners;
* Engine Gateway;
* read-only services;
* cache abstractions.

Queries shall not mutate state.

---

# 44. Serialization Dependency Rules

Serialization services may depend on:

* descriptor schemas;
* versioning;
* migration contracts;
* validation;
* checksums;
* stable identities.

Serialization shall not depend on:

* native UI objects;
* live services;
* running tasks;
* database connections;
* memory addresses.

---

# 45. Diagnostics Dependency Rules

Application components may depend on logging and diagnostics abstractions.

Diagnostics implementations shall not become required semantic dependencies.

The success of a state transition shall not depend on optional telemetry delivery.

---

# 46. Security Dependency Rules

Security-sensitive operations shall depend on:

* authorization contracts;
* capability validation;
* secure storage abstractions;
* privacy classification;
* input validation.

Components shall not perform local ad hoc authorization that contradicts authoritative Platform policies.

---

# 47. Dependency Direction Matrix

| Source Layer         | Permitted Dependencies                                             |
| -------------------- | ------------------------------------------------------------------ |
| Platform Adapter     | Desktop contracts, native OS APIs                                  |
| Presentation         | Projections, Commands, Events, view models                         |
| Application Runtime  | Application services, Kernel contracts, Engine Gateway             |
| Workspace            | Workspace state contracts, application services, Domain identities |
| Application Services | State owners, Commands, Events, Engine Gateway                     |
| Integration Gateway  | Platform contracts, Shared SDK                                     |
| Shared Contracts     | Stable Domain and serialization primitives                         |
| Platform Engines     | Kernel, Domain, approved infrastructure                            |
| Kernel               | foundational abstractions                                          |
| Domain               | no Desktop dependency                                              |

---

# 48. Prohibited Reverse Dependencies

The following reverse dependencies are prohibited:

* Domain → Desktop Application;
* Kernel → Desktop UI;
* Platform Engine → Desktop Window;
* Shared SDK → Desktop implementation;
* Workspace State → Manager implementation;
* Command → Handler;
* Event → Subscriber;
* Runtime → native concrete adapter;
* UI component → database;
* Plugin SDK → plugin implementation.

---

# 49. Circular Dependencies

Circular dependencies are prohibited between:

* Managers;
* Runtime services;
* Workspace aggregates;
* Command handlers;
* Event subscribers;
* Engine integrations;
* plugin contributions.

Cycles shall be resolved through:

* contracts;
* events;
* commands;
* coordinators;
* dependency inversion;
* extracted shared abstractions.

---

# 50. Bidirectional Dependencies

Bidirectional direct references are prohibited except within explicitly modeled aggregate ownership.

Valid ownership example:

```text
Workspace Registry
    owns references to Workspaces
```

Invalid dependency:

```text
Workspace directly retains Runtime implementation
Runtime directly retains Workspace internals
```

A Workspace may expose lifecycle callbacks or contracts without depending on Runtime implementation details.

---

# 51. Stable Dependency Boundaries

Stable boundaries include:

* Domain identities;
* Platform Engine public contracts;
* Shared SDK contracts;
* Command contracts;
* Event contracts;
* serialized descriptors;
* plugin capability contracts;
* platform adapter interfaces.

Internal implementation classes shall not cross stable boundaries.

---

# 52. Internal Dependency Boundaries

Each module shall distinguish:

* public contracts;
* internal implementation;
* test support;
* platform-specific implementation;
* generated code;
* plugin surface.

Internal types shall not be imported across module boundaries without explicit architectural approval.

---

# 53. Dependency Injection

Dependencies shall be provided through the Kernel Dependency Injection system or an approved module composition root.

Constructor injection is preferred for required dependencies.

Optional dependencies shall be explicit.

Service locator usage inside application logic is prohibited.

---

# 54. Composition Root

The Desktop Application Composition Root is responsible for:

* creating the Runtime;
* registering Kernel services;
* registering Platform adapters;
* registering Engine Gateway implementations;
* registering Managers;
* registering Command handlers;
* registering Event subscribers;
* registering plugin infrastructure;
* validating dependency graph;
* starting lifecycle coordination.

Object construction shall remain centralized.

---

# 55. Runtime Service Registration

Runtime services shall declare:

* service contract;
* implementation;
* lifecycle;
* scope;
* required dependencies;
* disposal order;
* startup order.

Ambiguous duplicate service registrations shall be rejected.

---

# 56. Dependency Scopes

Supported dependency scopes may include:

* application singleton;
* Runtime;
* Session;
* Workspace;
* Window;
* Tab;
* Editor;
* Task;
* plugin instance;
* transient operation.

A longer-lived dependency shall not retain a shorter-lived service directly unless through a safe provider or identity-based lookup.

---

# 57. Lifetime Compatibility

A dependency is lifetime-compatible when the dependent does not outlive the dependency.

Invalid example:

```text
Runtime singleton
    └── directly retains Window-scoped service
```

Valid alternatives include:

* Window service registry;
* scoped factory;
* identity-based lookup;
* weak observation;
* lifecycle callback.

---

# 58. Disposal Order

Disposal shall occur in reverse dependency order.

Representative order:

1. transient interactions;
2. Editors;
3. Tabs;
4. Panels;
5. Windows;
6. Workspaces;
7. Session services;
8. plugins;
9. Runtime services;
10. Platform adapters;
11. Kernel infrastructure.

Dependents shall be disposed before their dependencies.

---

# 59. Startup Order

Startup shall follow dependency order.

Representative order:

1. configuration;
2. logging and diagnostics;
3. Kernel;
4. shared contracts and serializers;
5. platform adapters;
6. Engine Gateway;
7. Platform Engine clients;
8. Runtime services;
9. Command and Event registrations;
10. plugin host;
11. Session restoration;
12. Workspace restoration;
13. UI projection;
14. Runtime readiness.

---

# 60. Lazy Dependencies

Heavy or optional components may be lazy.

Examples include:

* AI providers;
* uncommon editors;
* export implementations;
* plugin views;
* graph visualization;
* OCR services.

Lazy initialization shall preserve dependency validation and lifecycle ownership.

---

# 61. Optional Dependencies

Optional dependencies shall be represented explicitly.

They may use:

* capability queries;
* optional service contracts;
* feature registries;
* plugin contribution lookup;
* provider availability.

Code shall not rely on exceptions to discover absent dependencies.

---

# 62. Capability-Based Dependencies

Components should depend on capabilities rather than concrete implementations.

Examples include:

* `DocumentRenderingCapability`;
* `AICompletionCapability`;
* `AnnotationEditingCapability`;
* `ExternalExportCapability`;
* `PluginViewCapability`.

Capability resolution shall respect authorization and availability.

---

# 63. Feature Modules

Feature modules may group:

* Commands;
* handlers;
* Events;
* subscribers;
* view models;
* projections;
* integration contracts;
* tests.

Feature modules shall still respect the overall dependency direction.

They shall not become isolated vertical silos that duplicate core infrastructure.

---

# 64. Cross-Feature Dependencies

Cross-feature communication should use:

* stable contracts;
* Commands;
* Events;
* Queries;
* shared state projections;
* Workflow coordination.

Direct imports of another feature’s internal classes are prohibited.

---

# 65. UI Dependency Isolation

UI frameworks shall remain confined to:

* Presentation Layer;
* platform adapters;
* platform-specific composition modules.

Application Runtime, Workspace State, Commands, Events and Domain contracts shall remain independent from UI framework types.

---

# 66. Platform Independence

Core Desktop architecture shall avoid direct dependencies on:

* AppKit;
* UIKit;
* SwiftUI;
* Web browser DOM;
* native window classes;
* native file-picker classes.

These dependencies belong behind adapter contracts.

---

# 67. macOS Dependency Projection

For the macOS application:

```text
AppKit or SwiftUI
        │
        ▼
macOS Adapters
        │
        ▼
Desktop Platform Contracts
        │
        ▼
Application Runtime
```

The Runtime shall remain testable without launching a native macOS interface.

---

# 68. Future iPad Projection

Shared application contracts may support an iPad implementation.

The iPad application shall reuse:

* Shared SDK;
* Domain contracts;
* Platform Engine contracts;
* Command and Event contracts where appropriate;
* serialization descriptors.

It shall not reuse macOS-specific UI implementations.

---

# 69. Future Web Projection

A future Web application may reuse stable contracts.

It shall not require Desktop Runtime components to import browser-specific APIs.

Platform differences shall be handled through independent adapters and presentation modules.

---

# 70. Infrastructure Isolation

Infrastructure implementations include:

* network clients;
* local databases;
* file systems;
* secure storage;
* telemetry providers;
* server clients;
* model runtimes.

They shall remain behind contracts owned by the relevant application or Platform layer.

---

# 71. Persistence Isolation

Desktop Application components shall not depend directly on persistence mechanisms.

Permitted dependency:

```text
Desktop Application
    → Platform Engine Contract
        → Platform Engine
            → Persistence Adapter
```

Prohibited dependency:

```text
Window Manager
    → PostgreSQL Client
```

---

# 72. NAS Isolation

NAS interaction belongs to Master Library and Platform infrastructure.

The Desktop Application shall never mount, read or write authoritative NAS paths as part of normal application logic.

Local import of user-selected files is distinct from direct Master Library storage access.

---

# 73. Network Isolation

Network calls shall be performed through:

* Platform Engine clients;
* provider gateways;
* authentication services;
* integration adapters;
* synchronization services.

UI components and state containers shall not create network requests directly.

---

# 74. AI Dependency Isolation

AI features shall depend on AI Engine contracts.

They shall not depend on:

* specific remote provider SDKs;
* local model runtime implementations;
* provider authentication internals;
* model file locations.

Provider-specific dependencies remain inside AI infrastructure adapters.

---

# 75. Search Dependency Isolation

Search UI and navigation may depend on Search Engine contracts.

They shall not depend on:

* search index implementation;
* vector database implementation;
* embedding provider implementation;
* internal ranking classes.

---

# 76. Render Dependency Isolation

Editors may depend on Render Engine contracts and presentation models.

They shall not depend on:

* document parser internals;
* OCR implementation;
* layout-classification internals;
* source extraction pipelines.

---

# 77. Synchronization Dependency Isolation

Desktop synchronization projections may depend on Synchronization Engine contracts.

They shall not depend on:

* replication algorithms;
* conflict storage tables;
* server queue implementations;
* transport protocol internals.

---

# 78. Import and Export Isolation

Import and Export UI workflows depend on Platform Engine contracts.

They shall not instantiate:

* parsers;
* format writers;
* OCR engines;
* conversion pipelines;
* archive writers.

---

# 79. Testing Dependencies

Production code shall not depend on test support modules.

Tests may depend on:

* public contracts;
* test doubles;
* fixtures;
* deterministic schedulers;
* in-memory adapters;
* architecture validation tools.

Test-only utilities shall remain isolated.

---

# 80. Mocking Boundaries

Test doubles should replace contracts at stable boundaries.

Recommended boundaries include:

* Engine Gateway;
* Platform Adapter;
* Clock;
* Scheduler;
* Event Dispatcher;
* Command Dispatcher;
* checkpoint storage;
* authorization service.

Mocking internal state methods excessively should be avoided.

---

# 81. Architecture Validation

The Dependency Graph shall be validated through automated architecture tests.

Tests should verify:

* permitted module imports;
* forbidden references;
* absence of cycles;
* layer direction;
* plugin isolation;
* platform isolation;
* persistence isolation;
* state ownership boundaries;
* lifetime compatibility.

---

# 82. Dependency Graph Validation Process

Validation shall include:

1. enumerate modules;
2. classify each module by layer;
3. extract compile-time dependencies;
4. extract service registrations;
5. detect cycles;
6. detect prohibited imports;
7. validate lifetime scopes;
8. validate plugin boundaries;
9. report violations;
10. fail the build for mandatory rules.

---

# 83. Build-Time Enforcement

Mandatory dependency rules shall be enforced during continuous integration.

A build shall fail when:

* Domain imports Desktop code;
* Desktop UI imports persistence clients;
* core Runtime imports native implementation classes;
* plugins import internal application modules;
* cycles exist between architectural modules;
* stable contracts depend on implementations.

---

# 84. Runtime Validation

Runtime composition shall validate:

* missing required dependencies;
* duplicate registrations;
* invalid scopes;
* cyclic service construction;
* unsupported plugin capabilities;
* incompatible versions;
* invalid adapter selection.

Runtime shall fail safely before exposing an inconsistent application state.

---

# 85. Dependency Diagnostics

Diagnostics may include:

* resolved implementation;
* service scope;
* construction duration;
* missing dependency;
* cycle path;
* version incompatibility;
* plugin contribution owner;
* disposal failure.

Sensitive configuration and credentials shall not be exposed.

---

# 86. Dependency Documentation

Every major module shall document:

* its public contracts;
* its internal implementation boundary;
* permitted dependencies;
* provided capabilities;
* lifecycle;
* scope;
* disposal behavior;
* extension points.

Undocumented cross-module dependencies are prohibited.

---

# 87. Change Impact

Changes to stable dependencies require compatibility review.

Examples include changes to:

* Command contracts;
* Event contracts;
* serialized descriptors;
* Engine Gateway contracts;
* Plugin SDK;
* Shared SDK;
* platform adapter contracts.

Internal implementation changes should remain localized.

---

# 88. Versioning

Stable dependency contracts shall be versioned when they cross:

* module boundaries;
* process boundaries;
* plugin boundaries;
* persistence boundaries;
* application boundaries.

Version compatibility shall be explicit.

---

# 89. Deprecation

Deprecated contracts shall include:

* deprecation reason;
* replacement contract;
* compatibility period;
* migration guidance;
* planned removal version.

Immediate breaking replacement is prohibited for public plugin or integration contracts without an approved migration policy.

---

# 90. Dependency Migration

Dependency migrations shall proceed through:

1. introduce new contract;
2. provide adapter if necessary;
3. migrate dependents;
4. validate compatibility;
5. deprecate old contract;
6. remove old implementation after the approved period.

Large dependency direction changes require an ADR.

---

# 91. Failure Isolation

Dependency failure shall be contained within the narrowest valid boundary.

Examples include:

* plugin failure isolated to plugin instance;
* editor failure isolated to editor or tab;
* Engine capability failure isolated to feature;
* Window adapter failure isolated to window where possible;
* optional diagnostics failure ignored after reporting.

Failure isolation shall not hide authoritative consistency failures.

---

# 92. Degraded Mode

The Runtime may enter degraded mode when optional dependencies are unavailable.

Examples include:

* AI provider unavailable;
* plugin disabled;
* graph visualization unavailable;
* remote synchronization offline;
* export format unavailable.

Core Workspace state shall remain usable where possible.

---

# 93. Dependency Security

Dependencies shall be reviewed for:

* capability exposure;
* privilege boundaries;
* secret access;
* plugin access;
* external input;
* update provenance;
* version compatibility;
* supply-chain risk.

A dependency shall receive only the permissions required for its role.

---

# 94. Dependency Privacy

Components shall not gain access to private knowledge merely because they are registered in the Runtime.

Access shall remain controlled by:

* Workspace scope;
* user authorization;
* plugin capability;
* operation context;
* privacy classification;
* Engine contract.

---

# 95. Performance Considerations

The Dependency Graph shall avoid:

* excessive service indirection;
* repeated dynamic resolution in hot paths;
* unnecessary global dispatch;
* broad invalidation;
* startup of unused heavy components;
* duplicated caches across layers.

Stable boundaries shall not justify avoidable runtime overhead.

---

# 96. Determinism

Given the same:

* module set;
* service registrations;
* platform selection;
* feature configuration;
* plugin set;
* contract versions;

the Composition Root shall construct the same logical dependency graph.

Registration order shall not change semantics unless order is explicitly defined.

---

# 97. Idempotency

The following dependency operations shall be idempotent where applicable:

* module registration;
* contract validation;
* plugin capability registration;
* repeated disposal;
* adapter lookup;
* architecture validation;
* service graph inspection.

Duplicate registration of unique services shall be rejected rather than merged ambiguously.

---

# 98. Dependency Graph Prohibitions

The architecture shall not permit:

* circular module dependencies;
* direct UI-to-database access;
* direct Desktop-to-NAS access;
* direct Desktop-to-Platform-implementation coupling;
* Domain dependency on Desktop;
* Shared SDK dependency on application implementations;
* concrete native adapter imports inside Runtime core;
* direct manager-to-manager cycles;
* Command definitions depending on handlers;
* Event definitions depending on subscribers;
* state containers depending on UI components;
* plugins depending on internal Desktop modules;
* service locator usage in business logic;
* longer-lived services retaining shorter-lived dependencies unsafely;
* undocumented cross-module imports.

---

# 99. Validation Matrix

| Concern                  | Required Validation         |
| ------------------------ | --------------------------- |
| Layer direction          | Architecture tests          |
| Circular dependencies    | Graph analysis              |
| Platform isolation       | Import validation           |
| Persistence isolation    | Static analysis             |
| Plugin isolation         | Capability and import tests |
| Lifetime compatibility   | Composition tests           |
| Service registration     | Runtime validation          |
| Contract stability       | Compatibility tests         |
| Serialization boundaries | Schema tests                |
| Disposal order           | Lifecycle tests             |
| Startup order            | Integration tests           |
| Security boundaries      | Security review             |

---

# 100. Anti-Patterns

The following are prohibited:

* one module importing every other module;
* global service locator calls throughout the application;
* Managers directly invoking each other in cycles;
* UI components creating Platform Engine instances;
* Commands containing concrete service references;
* Events containing subscriber callbacks;
* Workspace State importing native window types;
* plugins importing internal application source files;
* shared contract packages containing implementation logic;
* database models leaking into the UI;
* Runtime singletons retaining closed Workspace services;
* using dependency injection to hide invalid architecture.

---

# 101. Architectural Invariants

The following invariants are mandatory:

* dependencies point toward stable abstractions;
* Domain never depends on Desktop Application code;
* Kernel never depends on Desktop UI;
* Platform Engines expose only public contracts to Desktop;
* Desktop Application accesses Platform capabilities through Engine Gateway;
* Desktop Application never accesses PostgreSQL directly;
* Desktop Application never accesses authoritative NAS storage directly;
* Presentation depends on projections and interaction contracts, not infrastructure;
* UI components never instantiate application services or Engines directly;
* Workspace State does not depend on Manager implementations;
* Commands do not depend on handlers;
* Events do not depend on subscribers;
* state containers do not depend on UI components;
* core Runtime does not depend on concrete native platform adapters;
* plugins depend only on Plugin SDK and declared public contracts;
* cross-feature communication uses explicit contracts;
* circular architectural dependencies are prohibited;
* longer-lived services do not retain shorter-lived dependencies unsafely;
* object construction is centralized in the Composition Root;
* disposal occurs in reverse dependency order;
* architecture tests enforce mandatory dependency rules.

---

# 102. Related Documents

* `RuntimeArchitecture.md`
* `ApplicationArchitecture.md`
* `WorkspaceArchitecture.md`
* `WindowManagement.md`
* `SessionManagement.md`
* `NavigationArchitecture.md`
* `CommandArchitecture.md`
* `EventArchitecture.md`
* `StateManagement.md`
* `../README.md`
* `../../../03-Kernel/DependencyInjection.md`
* `../../../03-Kernel/CommandBus.md`
* `../../../03-Kernel/EventBus.md`
* `../../../04-Platform/README.md`
* `../../../05-Integration/PluginSDK/Contracts.md`
* `../../../05-Integration/PublicContracts/`
* `../../05-SharedSDK/README.md`
* Architecture Decision Records

---

# 103. Status

**Approved**

This document establishes the authoritative Dependency Graph for the KnowledgeOS Desktop Application.

Dependencies flow from presentation and application orchestration toward stable contracts, Platform capabilities, Kernel abstractions and Domain concepts. Reverse dependencies, circular dependencies, direct persistence access and internal implementation coupling are prohibited.

The Application Runtime, Workspaces, Managers, Commands, Events, state containers, plugins, Platform adapters and Engine integrations shall comply with the dependency direction, lifecycle, isolation and validation rules defined herein.
