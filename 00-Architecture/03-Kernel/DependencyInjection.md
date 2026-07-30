
# Dependency Injection

**Project:** KnowledgeOS

**Section:** Kernel

**Document:** Dependency Injection

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Dependency Injection (DI) architecture of the KnowledgeOS Kernel.

Dependency Injection is responsible for composing the runtime by resolving architectural contracts into executable components.

It manages composition.

It never defines business behavior.

---

# 2. Scope

Dependency Injection governs:

* component registration;
* dependency resolution;
* lifecycle management;
* implementation binding;
* provider composition;
* runtime assembly.

Dependency Injection does not govern:

* business rules;
* document processing;
* storage logic;
* rendering;
* search;
* artificial intelligence.

---

# 3. Design Goals

Dependency Injection shall:

* remain technology-independent;
* support explicit composition;
* avoid hidden dependencies;
* preserve engine isolation;
* support replaceable implementations;
* remain deterministic.

---

# 4. Design Philosophy

Dependency Injection composes the platform.

It does not execute business logic.

It does not coordinate workflows.

It does not implement providers.

Its only responsibility is to build the executable runtime.

---

# 5. Composition Root

KnowledgeOS has exactly one Composition Root.

The Composition Root is responsible for:

* loading configuration;
* registering components;
* binding implementations;
* validating registrations;
* creating the executable runtime.

All runtime composition begins here.

No other component shall compose the system.

---

# 6. Architectural Position

```text
Configuration
       │
       ▼
Composition Root
       │
       ▼
Dependency Injection
       │
       ▼
Kernel Components
       │
       ▼
Platform Engines
```

The Domain remains completely independent of this process.

---

# 7. Contracts First

Dependency Injection resolves architectural contracts.

Examples include:

* Repository Contracts;
* Provider Contracts;
* Command Handlers;
* Query Handlers;
* Event Subscribers;
* Workflow Steps.

Implementations remain replaceable.

---

# 8. Registration Model

Every executable component shall be registered explicitly.

Registration defines:

* contract;
* implementation;
* lifecycle;
* visibility;
* optional metadata.

Implicit registration is discouraged.

---

# 9. Resolution Model

Dependency resolution occurs only through declared contracts.

Resolution shall be:

* deterministic;
* explicit;
* validated;
* reproducible.

Missing registrations prevent runtime startup.

---

# 10. Lifecycle Management

Supported lifecycles are:

* Singleton;
* Execution Scope;
* Workflow Scope;
* Job Scope;
* Transient.

Lifecycle selection shall be explicit.

---

# 11. Provider Resolution

External technologies are accessed through Providers.

Examples include:

* Storage Provider;
* AI Provider;
* OCR Provider;
* Search Provider;
* Export Provider;
* Synchronization Provider.

Dependency Injection resolves providers without exposing implementation details.

---

# 12. Engine Isolation

Platform Engines never resolve one another directly.

Communication occurs exclusively through Kernel contracts.

Direct Engine dependencies are prohibited.

---

# 13. Domain Independence

Domain components never depend upon:

* containers;
* injection frameworks;
* provider implementations;
* runtime composition.

The Domain remains executable independently of Dependency Injection.

---

# 14. Prohibited Patterns

The following patterns are prohibited:

* Service Locator;
* runtime dependency discovery from Domain objects;
* mutable global containers;
* implicit component creation;
* hidden dependency resolution.

---

# 15. Validation

Before startup, Dependency Injection validates:

* duplicate registrations;
* missing implementations;
* invalid lifecycles;
* circular dependencies;
* contract compatibility.

Invalid compositions prevent startup.

---

# 16. Composition Invariants

The following invariants apply:

* one Composition Root;
* explicit registrations;
* explicit lifecycles;
* deterministic resolution;
* replaceable implementations;
* isolated Platform Engines;
* Domain independence.

---

# 17. Related Documents

* KernelArchitecture.md
* Configuration.md
* CommandBus.md
* ../05-Integration/Providers/

---

# 18. Status

**Approved**

Dependency Injection defines the runtime composition model of KnowledgeOS.

It assembles the platform from explicit contracts while preserving deterministic execution, engine isolation and complete independence of the Domain Layer.
