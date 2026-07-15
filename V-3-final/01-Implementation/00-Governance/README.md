# Implementation Governance

**Project:** KnowledgeOS

**Section:** Implementation

**Layer:** Governance

**Document:** README

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation governance model of KnowledgeOS.

Implementation Governance controls how concrete development work is:

* proposed;
* scoped;
* designed;
* approved;
* implemented;
* tested;
* reviewed;
* completed;
* changed.

KnowledgeOS Architecture V3 establishes the architectural baseline.

Implementation Governance ensures that concrete technical decisions and source-code changes remain aligned with that baseline.

---

# 2. Scope

This document governs:

* active module selection;
* implementation sequencing;
* module status;
* scope control;
* technical-design approval;
* implementation decision records;
* dependency introduction;
* shared infrastructure;
* testing obligations;
* completion evidence;
* module closure;
* transition to the next module;
* implementation exceptions;
* architectural escalation.

This document applies to:

* KnowledgeOS Server;
* macOS client;
* iPhone client;
* iPad client;
* shared packages;
* storage;
* APIs;
* deployment;
* testing;
* operational tooling.

---

# 3. Governance Position

Implementation Governance sits between the Frozen Architecture and executable software.

```text
Architecture V3
      │
      ▼
Implementation Governance
      │
      ├── controls scope
      ├── controls technical decisions
      ├── controls module sequencing
      ├── controls completion
      └── escalates architectural changes
              │
              ▼
Source Code and Deployable Systems
```

Implementation Governance does not redefine architecture.

It controls how architecture is realized.

---

# 4. Core Principle

> One functional module shall be implemented and completed before another functional module begins.

The complementary principle is:

> Implementation progress is measured through completed end-to-end capability, not through the number of files, services or partial layers produced.

---

# 5. Governance Objectives

Implementation Governance exists to:

1. preserve focus;
2. prevent parallel unfinished modules;
3. prevent scope drift;
4. preserve architecture conformance;
5. make technical decisions traceable;
6. ensure full-stack completion;
7. prevent testing and operations from being postponed;
8. provide explicit module closure.

---

# 6. Active Module Rule

Only one functional module may be active.

The current active module is:

```text
01-MasterLibrary
```

The next functional module shall remain uncreated until Master Library reaches:

```text
COMPLETED
```

---

# 7. Module Authority

Each active module is governed by:

* `ImplementationCharter.md`;
* Requirements documents;
* Technical Design documents;
* module-specific Definition of Done;
* approved IDRs;
* Architecture V3.

When these sources conflict, the following authority order applies:

1. Architecture V3;
2. approved architectural amendments and ADRs;
3. Implementation Governance;
4. module Implementation Charter;
5. approved module Technical Design;
6. approved IDRs;
7. source code;
8. temporary implementation notes.

---

# 8. Source Code Is Not Automatic Authority

Existing code does not override approved implementation design merely because it exists.

A mismatch may represent:

* implementation debt;
* incorrect implementation;
* obsolete design;
* an architectural issue requiring escalation.

---

# 9. Module Lifecycle

Every functional module follows this lifecycle:

```text
PLANNED
   │
   ▼
DESIGNING
   │
   ▼
IMPLEMENTING
   │
   ▼
INTEGRATING
   │
   ▼
VALIDATING
   │
   ▼
COMPLETED
```

Alternative states:

```text
BLOCKED
CANCELLED
```

---

# 10. PLANNED

A planned module is identified but not authorized for implementation.

No source-code work shall begin.

No full directory structure shall be created prematurely.

---

# 11. DESIGNING

The module is defining:

* requirements;
* Domain model;
* contracts;
* technical architecture;
* persistence;
* testing;
* operational behavior.

Master Library is currently in this state.

---

# 12. IMPLEMENTING

The module has approved Technical Design and active source-code development.

Implementation proceeds through bounded vertical increments.

---

# 13. INTEGRATING

The real server, client, persistence and contracts are being exercised together.

Primary flows shall no longer depend on mocks.

---

# 14. VALIDATING

The complete module is undergoing:

* end-to-end testing;
* security review;
* failure testing;
* operational validation;
* Definition of Done review.

---

# 15. COMPLETED

The module has:

* working full-stack capability;
* passed required tests;
* completed documentation;
* satisfied its Definition of Done;
* completed formal closure review.

Only this state permits creation of the next module.

---

# 16. BLOCKED

A module is blocked when a material issue prevents correct progress.

Examples:

* unresolved architecture conflict;
* unsupported platform requirement;
* critical dependency failure;
* unavailable target infrastructure;
* unresolved data-integrity risk.

Blocked status shall identify:

* reason;
* impact;
* owner;
* resolution path.

---

# 17. CANCELLED

A module may be cancelled only when its product capability is no longer required or has been replaced by an approved alternative.

Cancellation shall preserve decision history.

---

# 18. Module Transition Authority

A module status transition requires evidence.

Examples:

```text
DESIGNING → IMPLEMENTING
Requires approved Technical Design.

IMPLEMENTING → INTEGRATING
Requires server, client and persistence foundations.

INTEGRATING → VALIDATING
Requires working real end-to-end primary flow.

VALIDATING → COMPLETED
Requires complete Definition of Done.
```

---

# 19. Implementation Scope

Every module shall define:

* in-scope behavior;
* out-of-scope behavior;
* dependencies;
* external assumptions;
* completion boundary.

Scope shall not expand silently.

---

# 20. Scope Change Categories

Implementation scope changes are classified as:

1. Clarification;
2. Compatible Module Extension;
3. Module Scope Expansion;
4. Cross-Module Change;
5. Architectural Change.

---

# 21. Clarification

A Clarification makes existing implementation intent more explicit without expanding capability.

---

# 22. Compatible Module Extension

A Compatible Module Extension adds bounded behavior required to complete the current module.

It shall not introduce a future module prematurely.

---

# 23. Module Scope Expansion

A Module Scope Expansion adds substantial new capability to the active module.

It requires review of:

* timeline;
* testing;
* Definition of Done;
* dependencies.

---

# 24. Cross-Module Change

A Cross-Module Change affects responsibilities belonging to another module.

It shall be deferred unless strictly necessary to finish the active module.

---

# 25. Architectural Change

An Architectural Change modifies:

* authority;
* boundaries;
* invariants;
* responsibilities;
* Source of Truth;
* execution model;
* public architecture contracts.

It shall return to `00-Architecture/08-Governance`.

---

# 26. Technical Design Approval

No production implementation shall begin before the minimum Technical Design is approved.

The minimum Technical Design shall define:

* runtime topology;
* technology stack;
* package structure;
* persistence;
* API;
* security baseline;
* testing approach;
* deployment model.

---

# 27. Technical Design Evolution

Technical Design may evolve during implementation.

Changes shall remain:

* explicit;
* reviewable;
* compatible with Architecture V3;
* reflected in documentation.

---

# 28. Implementation Decision Records

Significant implementation decisions shall use Implementation Decision Records.

Recommended format:

```text
IDR-XXX-Decision-Name.md
```

IDRs belong inside the active module Technical Design area unless they affect implementation governance globally.

---

# 29. IDR Requirement

An IDR is required when a decision:

* introduces a major framework;
* selects a database;
* selects a transport;
* selects a deployment runtime;
* defines a monorepo strategy;
* introduces a difficult-to-reverse dependency;
* affects both server and client;
* rejects significant alternatives.

---

# 30. IDR Structure

An IDR should include:

1. Context;
2. Problem;
3. Decision;
4. Alternatives;
5. Consequences;
6. Risks;
7. Validation;
8. Reversal strategy;
9. Related documents.

---

# 31. IDR Statuses

Recommended IDR statuses are:

* Draft;
* Proposed;
* Accepted;
* Superseded;
* Rejected;
* Archived.

---

# 32. IDR Immutability

Accepted IDRs preserve implementation decision history.

A changed decision shall normally create a new IDR that supersedes the previous one.

---

# 33. Architecture Decision Boundary

An IDR shall never be used to bypass an ADR.

If the decision changes architecture, an ADR or architectural amendment is required.

---

# 34. Dependency Governance

Every significant dependency shall be evaluated before introduction.

Evaluation shall consider:

* purpose;
* maturity;
* maintenance;
* licensing;
* security;
* platform support;
* performance;
* replacement cost;
* long-term viability.

---

# 35. Dependency Categories

Dependencies may be:

* runtime dependencies;
* development dependencies;
* test dependencies;
* build dependencies;
* deployment dependencies.

Runtime dependencies require the strongest review.

---

# 36. Dependency Minimalism

A dependency shall not be introduced when the required capability can be implemented safely with existing platform functionality at reasonable cost.

Dependency minimalism shall not justify rebuilding complex infrastructure without need.

---

# 37. Shared Infrastructure Governance

Shared infrastructure may be created only when required by the active module.

Examples:

* configuration;
* structured logging;
* HTTP contracts;
* authentication primitives;
* shared identifiers;
* validation;
* test support.

---

# 38. Shared Infrastructure Boundary

Shared infrastructure shall remain generic enough to serve the active module without pretending to solve every future module.

Premature generalized frameworks are prohibited.

---

# 39. Shared Package Criteria

A shared package is justified when:

* the server and client require the same stable contract;
* duplication would create compatibility risk;
* the content is runtime-neutral;
* ownership is explicit.

---

# 40. Shared Package Prohibitions

Shared packages shall not contain:

* server framework internals;
* client UI code;
* database implementation;
* NAS filesystem access;
* platform-specific state mixed without boundaries.

---

# 41. Vertical Increment Governance

The active module shall progress through vertical increments.

Each increment shall include as much as practical of:

* Domain;
* application behavior;
* persistence;
* API;
* client;
* testing.

---

# 42. Increment Completion

An increment is complete when:

* its primary flow works;
* relevant tests pass;
* the system remains buildable;
* documentation is updated;
* no critical defect is knowingly hidden.

---

# 43. Master Library Increment Order

The approved initial order is:

```text
1. Server Health
2. Master Library Initialization
3. Publication Registration
4. Catalog Listing and Details
5. macOS Catalog Browser
6. Publication Acquisition
7. Selective Local Library
8. Offline Availability
9. Hardening and Module Closure
```

---

# 44. Increment Reordering

Increment order may change when implementation evidence justifies it.

The primary end-to-end objective shall remain unchanged.

---

# 45. Branching and Source Control

Source-control strategy shall support:

* small coherent changes;
* reviewable commits;
* module traceability;
* safe rollback.

Implementation Governance does not require one specific branching model.

---

# 46. Commit Discipline

Commits should:

* represent one coherent change;
* include relevant tests;
* avoid unrelated formatting;
* reference the active module or decision where useful.

---

# 47. Build Integrity

The active development branch shall remain buildable whenever practical.

Known broken states shall be short-lived and explicit.

---

# 48. Testing Governance

Tests are mandatory implementation artifacts.

Every vertical increment shall add the required tests for its behavior.

---

# 49. Test Pyramid

The module shall use an appropriate combination of:

* Domain unit tests;
* application tests;
* repository integration tests;
* API integration tests;
* client tests;
* end-to-end tests;
* failure tests.

No single test category replaces all others.

---

# 50. Real End-to-End Requirement

Module completion requires at least one end-to-end flow using:

* real server;
* real persistence;
* real API;
* real client;
* real local storage behavior.

---

# 51. Mock Governance

Mocks are permitted for:

* isolated unit tests;
* unavailable external dependencies;
* early UI development;
* failure simulation.

Mocks shall not remain in the primary completed flow.

---

# 52. Failure Testing

Each module shall test failures that materially affect its contracts.

For Master Library, this includes:

* NAS unavailable;
* permission denied;
* corrupted source;
* interrupted acquisition;
* checksum mismatch;
* insufficient device storage;
* server identity mismatch.

---

# 53. Security Governance

Security is evaluated continuously.

Security review shall cover:

* authentication;
* authorization;
* transport;
* secret handling;
* input validation;
* path safety;
* audit requirements;
* dependency risks.

---

# 54. Privacy Governance

Implementation shall preserve the privacy boundaries established by Architecture V3.

For Master Library:

* personal state shall not be sent to the NAS;
* API requests shall minimize personal information;
* logs shall not contain reading or annotation content.

---

# 55. Observability Governance

Each module shall define:

* logs;
* metrics;
* traces;
* health checks;
* diagnostic evidence.

Observability shall be sufficient to diagnose failures without exposing sensitive content.

---

# 56. Performance Governance

Performance work shall focus on measured critical paths.

Every performance requirement shall define:

* operation;
* workload;
* environment;
* target;
* measurement method.

---

# 57. Operations Governance

A module cannot be completed without operational documentation where applicable.

Operational documentation may include:

* deployment;
* configuration;
* upgrades;
* backup;
* recovery;
* health checks;
* logs;
* diagnostics.

---

# 58. Documentation Governance

Implementation documentation is part of module completion.

Documents shall reflect the implemented system.

Documents that remain purely aspirational shall not be marked complete.

---

# 59. Document Status

Recommended implementation-document statuses:

* Draft;
* Proposed;
* Approved;
* Implemented;
* Validated;
* Superseded;
* Archived.

---

# 60. Approved Versus Implemented

`Approved` means the implementation design is authorized.

`Implemented` means the corresponding behavior exists.

`Validated` means implementation evidence confirms the behavior.

These statuses shall not be treated as equivalent.

---

# 61. Completion Evidence

Module completion evidence shall include:

* Definition of Done checklist;
* test results;
* end-to-end evidence;
* security review;
* operational validation;
* known limitations;
* unresolved non-critical debt.

---

# 62. Validation Report

Every completed module shall include:

```text
10-Completion/ValidationReport.md
```

The report records:

* implemented scope;
* tests;
* results;
* performance evidence;
* security findings;
* operational findings;
* accepted limitations;
* final decision.

---

# 63. Completion Decision

The module completion decision shall be one of:

* Completed;
* Completed with Accepted Non-Critical Debt;
* Revision Required;
* Blocked;
* Rejected.

---

# 64. Accepted Non-Critical Debt

A module may close with non-critical debt only when:

* primary behavior is complete;
* integrity and security are preserved;
* debt is explicitly recorded;
* future remediation is bounded.

---

# 65. Completion Blockers

A module shall not close with:

* broken primary flow;
* unresolved data corruption risk;
* unresolved critical security issue;
* missing end-to-end test;
* permanent primary-flow mocks;
* missing deployment path;
* critical undocumented behavior.

---

# 66. Next Module Authorization

Creation of the next module requires:

1. current module state `COMPLETED`;
2. approved Validation Report;
3. completed Definition of Done;
4. no unresolved critical blocker;
5. formal Governance decision.

---

# 67. Premature Next-Module Work

The following are prohibited before module completion:

* implementing future module services;
* creating future module persistence;
* designing future module APIs in detail;
* creating future module directories;
* using the active module as an excuse to implement unrelated capabilities.

---

# 68. Architectural Escalation

An issue shall return to Architecture Governance when it affects:

* NAS Master Library authority;
* Selective Local Library semantics;
* personal synchronization boundaries;
* Engine responsibilities;
* Domain identity;
* public architectural contracts;
* Platform/Integration/Execution boundaries.

---

# 69. Implementation Exception

An Implementation Exception is a temporary governed deviation from implementation rules.

It shall define:

* violated rule;
* reason;
* scope;
* risk;
* expiration;
* remediation.

---

# 70. Exception Limits

An Implementation Exception cannot override:

* Architecture V3;
* security-critical requirements;
* data-integrity requirements;
* personal-state privacy boundaries.

---

# 71. Technical Debt

Technical debt shall be explicit.

Debt records should include:

* description;
* reason;
* impact;
* risk;
* remediation trigger;
* owner.

---

# 72. Hidden Debt Prohibition

Known material debt shall not be hidden in:

* comments;
* temporary names;
* undocumented workarounds;
* permanent feature flags;
* test exclusions.

---

# 73. Review Cadence

Implementation review shall occur:

* after Technical Design;
* after major vertical increments;
* before full-stack integration;
* before module completion.

---

# 74. Single-Developer Governance

KnowledgeOS may be developed primarily by one person.

Governance roles therefore represent separate responsibilities rather than necessarily separate people.

The same person may act as:

* designer;
* implementer;
* reviewer;
* operator.

The responsibilities shall still be performed explicitly.

---

# 75. Implementation Governance Invariants

The following invariants apply:

* Architecture V3 remains authoritative.
* One functional module is active at a time.
* Master Library is the current active module.
* Module scope is explicit.
* Technical Design precedes production implementation.
* Significant implementation decisions are traceable.
* Shared infrastructure exists only when required.
* Tests are created continuously.
* Real full-stack integration is mandatory.
* Personal state is not uploaded to the NAS.
* Device Libraries are not NAS replicas.
* Completion requires evidence.
* The next module requires formal authorization.
* Architectural issues return to Architecture Governance.

---

# 76. Prohibited Behaviors

KnowledgeOS implementation shall never:

* treat partial backend work as module completion;
* start several functional modules in parallel;
* expand scope silently;
* introduce major dependencies without evaluation;
* use IDRs to bypass ADRs;
* create generalized infrastructure without current need;
* leave the primary flow dependent on mocks;
* postpone all testing until module end;
* hide critical technical debt;
* upload personal state to the NAS;
* let clients bypass KnowledgeOS Server;
* create the next module before formal completion;
* mark documentation implemented when only planned;
* mark a module completed without evidence.

---

# 77. Related Documents

## Architecture

* `../../00-Architecture/08-Governance/ArchitectureFreeze-v3.0.md`
* `../../00-Architecture/08-Governance/ArchitectureAmendment-v3.0-001.md`
* `../../00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`

## Implementation

* `../README.md`
* `ImplementationStrategy.md`
* `ModuleDevelopmentLifecycle.md`
* `DefinitionOfDone.md`

## Active Module

* `../01-MasterLibrary/README.md`
* `../01-MasterLibrary/ImplementationCharter.md`

---

# 78. Status

**Approved**

Implementation Governance controls the progression from Frozen Architecture to completed software.

Master Library is the only active functional module.

It shall remain active until its complete server, client, persistence, acquisition, testing, security, operations and documentation scope is validated.

No subsequent functional module may begin before formal completion.
