
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Implementation Governance
**Path:** `01-Implementation/00-Governance/`
**Document:** Implementation Governance Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Project Owner

---

# 1. Purpose

This document defines the operational rules for every human or AI agent working inside:

```text
01-Implementation/00-Governance/
```

Implementation Governance controls how KnowledgeOS implementation work is:

* planned;
* ordered;
* reviewed;
* validated;
* completed;
* traced;
* accepted.

Its purpose is to ensure that implementation progresses systematically without:

* bypassing architecture;
* skipping required design;
* producing incomplete modules;
* accumulating invisible technical debt;
* declaring work complete without evidence.

Implementation Governance defines the process for building KnowledgeOS.

It does not define the product architecture.

---

# 2. Scope

This guide applies to:

```text
01-Implementation/00-Governance/
├── DefinitionOfDone.md
├── ImplementationStrategy.md
├── ModuleDevelopmentLifecycle.md
├── README.md
└── AGENTS.md
```

It governs:

* implementation strategy;
* module sequencing;
* development lifecycle;
* completion criteria;
* review gates;
* implementation traceability;
* implementation risk control;
* implementation status;
* module acceptance.

---

# 3. Authority

Implementation Governance is subordinate to Architecture Governance.

The authority order is:

```text
Product Vision

↓

Architecture V3

↓

Architecture Governance

↓

Implementation Governance

↓

Module Technical Design

↓

Source Code

↓

Tests and Operational Evidence
```

Implementation Governance may define how implementation proceeds.

It shall not redefine:

* Domain semantics;
* Kernel responsibilities;
* Platform Engine ownership;
* Integration boundaries;
* Execution guarantees;
* Source of Truth;
* synchronization authority;
* storage architecture.

---

# 4. Responsibilities

Implementation Governance owns:

* implementation sequencing;
* development milestones;
* module lifecycle;
* Definition of Done;
* implementation review gates;
* implementation readiness;
* module completion criteria;
* traceability requirements;
* implementation status reporting;
* implementation risk visibility.

Implementation Governance does not own:

* architectural approval;
* ADR approval;
* architecture amendments;
* product scope;
* Domain modeling;
* public product contracts;
* operational production ownership.

---

# 5. Mandatory Reading Order

Before modifying any file in this directory, an agent shall read:

1. repository root `AGENTS.md`;
2. `01-Implementation/AGENTS.md`;
3. this `AGENTS.md`;
4. `README.md`;
5. `ImplementationStrategy.md`;
6. `ModuleDevelopmentLifecycle.md`;
7. `DefinitionOfDone.md`;
8. applicable Architecture Governance documents;
9. affected module documentation;
10. affected implementation plans.

No governance rule shall be changed without understanding its impact on active implementation modules.

---

# 6. Core Principles

Implementation Governance shall preserve:

* architecture compliance;
* incremental progress;
* controlled scope;
* explicit ownership;
* traceability;
* verifiable completion;
* recoverability;
* testability;
* operational readiness;
* documentation integrity;
* risk visibility.

Progress shall be measured by completed, validated capabilities.

Progress shall not be measured only by the number of files created or lines of code written.

---

# 7. Implementation States

Implementation work may exist in the following states:

```text
Proposed

↓

Planned

↓

Ready

↓

In Progress

↓

Under Review

↓

Validated

↓

Completed

↓

Released
```

Additional states may include:

* Blocked;
* Deferred;
* Rejected;
* Superseded;
* Cancelled.

Each state shall have explicit entry and exit criteria.

---

# 8. Proposed State

A proposed implementation unit is not yet approved for execution.

It may include:

* initial scope;
* candidate requirements;
* assumptions;
* dependencies;
* risks.

Proposed work shall not be treated as committed implementation.

---

# 9. Planned State

A planned unit shall have:

* approved scope;
* owner;
* priority;
* dependencies;
* expected outputs;
* target sequence;
* known risks.

Planning does not imply implementation readiness.

---

# 10. Ready State

A module or work unit is Ready only when:

* architecture is available;
* requirements are sufficient;
* dependencies are understood;
* technical design is adequate;
* contracts are identified;
* testing obligations are defined;
* blockers are resolved or accepted.

Coding shall not begin merely because a directory exists.

---

# 11. In Progress State

Work marked In Progress shall have:

* an active owner;
* a defined scope;
* a known branch or work context;
* tracked risks;
* visible status;
* completion criteria.

Unowned work shall not remain In Progress.

---

# 12. Under Review State

A unit enters Under Review when implementation is believed to satisfy its current scope.

Review shall verify:

* architecture compliance;
* requirement satisfaction;
* design compliance;
* contract behavior;
* test coverage;
* operational readiness;
* documentation completeness.

Review is not a formality.

---

# 13. Validated State

Validated means the required evidence has been produced.

Evidence may include:

* passing tests;
* architecture compliance review;
* migration validation;
* performance results;
* security review;
* recovery validation;
* operational review.

Validated does not automatically mean released.

---

# 14. Completed State

Completed means the applicable Definition of Done has been satisfied.

A completed module shall not contain hidden mandatory work.

Remaining limitations shall be explicit and accepted.

---

# 15. Released State

Released means the completed implementation has passed release readiness and has been deployed or distributed according to its release model.

Release status shall include:

* version;
* date;
* included scope;
* known limitations;
* upgrade requirements;
* rollback or recovery path.

---

# 16. Blocked State

Blocked work shall identify:

* blocker;
* owner;
* impact;
* required resolution;
* affected dependencies;
* next review point.

“Blocked” shall not become a permanent unexamined state.

---

# 17. Deferred State

Deferred work shall define:

* reason;
* risk;
* target phase or version;
* dependency impact;
* acceptance of delay.

Mandatory completion work shall not be deferred merely to improve progress reporting.

---

# 18. Implementation Strategy

`ImplementationStrategy.md` defines the approved approach for constructing KnowledgeOS.

It shall establish:

* implementation priorities;
* module order;
* dependency order;
* validation order;
* integration sequence;
* milestone structure;
* risk management;
* architecture checkpoints.

Agents shall follow it unless an approved change updates the strategy.

---

# 19. Strategy Objectives

The implementation strategy shall optimize for:

* architectural stability;
* early validation of high-risk assumptions;
* usable increments;
* controlled complexity;
* minimal rework;
* recoverable progress;
* testable modules;
* operational viability.

It shall not optimize solely for speed of visible UI delivery.

---

# 20. Implementation Order

Implementation order shall follow dependency and risk.

A valid order generally prioritizes:

1. foundational contracts;
2. identity;
3. persistence;
4. authoritative state;
5. core services;
6. client integration;
7. advanced capabilities;
8. operational completion.

The exact sequence shall remain defined in `ImplementationStrategy.md`.

---

# 21. Dependency-Driven Planning

A module shall not begin when a required upstream contract is undefined.

Dependencies may include:

* architecture decisions;
* Domain models;
* persistence schemas;
* public contracts;
* provider interfaces;
* synchronization protocols;
* test infrastructure;
* deployment infrastructure.

Dependencies shall be explicit rather than assumed.

---

# 22. Risk-Driven Planning

High-risk decisions should be validated early.

Examples include:

* catalog and file consistency;
* Master Library synchronization;
* offline conflict handling;
* persistent identity;
* recovery;
* migrations;
* plugin isolation;
* remote AI privacy;
* large-library performance.

Low-risk cosmetic work shall not displace unresolved architectural risk.

---

# 23. Incremental Delivery

Implementation shall proceed through coherent increments.

Each increment should deliver:

* a defined capability;
* complete behavior;
* tests;
* documentation;
* validation;
* operational understanding.

Incomplete vertical slices shall not be presented as finished capabilities.

---

# 24. Vertical Slices

A vertical slice may include:

* requirement;
* Domain behavior;
* contract;
* persistence;
* service logic;
* client behavior;
* tests;
* observability;
* completion evidence.

Vertical slicing shall not bypass architectural boundaries.

---

# 25. Horizontal Foundations

Some work must be delivered horizontally before vertical capabilities.

Examples include:

* identity;
* configuration;
* logging;
* observability;
* transaction infrastructure;
* contract conventions;
* persistence foundations;
* test infrastructure.

Horizontal foundations shall remain bounded.

They shall not become indefinite framework development.

---

# 26. Milestones

Every milestone shall define:

* purpose;
* included modules;
* excluded modules;
* entry criteria;
* exit criteria;
* dependencies;
* risks;
* validation;
* deliverables.

A milestone shall represent a meaningful implementation state.

---

# 27. Milestone Completion

A milestone is complete only when:

* included scope satisfies its Definition of Done;
* required integration is validated;
* known limitations are documented;
* operational impact is understood;
* architecture compliance is verified;
* remaining work is explicitly planned.

---

# 28. Module Development Lifecycle

`ModuleDevelopmentLifecycle.md` defines the mandatory lifecycle for each implementation module.

The lifecycle shall ensure that modules are not built without:

* sufficient requirements;
* technical design;
* contracts;
* testing;
* operational consideration;
* completion review.

---

# 29. Lifecycle Phases

The standard lifecycle is:

```text
Initiation

↓

Requirements

↓

Technical Design

↓

Domain and Contracts

↓

Persistence and Runtime Design

↓

Implementation

↓

Verification

↓

Operational Readiness

↓

Completion
```

Some modules may omit non-applicable phases.

Any omission shall be justified.

---

# 30. Initiation

Initiation defines:

* module purpose;
* scope;
* owner;
* architectural mapping;
* dependencies;
* initial risks;
* expected outcomes.

A module without clear purpose shall not proceed.

---

# 31. Requirements Phase

The Requirements phase shall produce sufficient clarity regarding:

* functional behavior;
* nonfunctional behavior;
* actors;
* use cases;
* constraints;
* acceptance criteria;
* failure cases;
* exclusions.

Requirements shall remain aligned with Product Vision and architecture.

---

# 32. Technical Design Phase

Technical Design shall define:

* components;
* responsibilities;
* dependencies;
* data flow;
* runtime behavior;
* contracts;
* persistence;
* errors;
* security;
* observability;
* tests;
* operations.

Design detail shall be proportionate to implementation risk.

---

# 33. Domain and Contracts Phase

This phase shall verify:

* Domain concepts;
* stable identities;
* value objects;
* states;
* errors;
* commands;
* queries;
* events;
* APIs;
* compatibility obligations.

Contracts shall be defined before dependent implementations diverge.

---

# 34. Persistence and Runtime Design Phase

This phase shall define:

* schemas;
* files;
* indexes;
* transactions;
* consistency;
* locking;
* migrations;
* retries;
* idempotency;
* background execution;
* recovery;
* resource use.

Persistent changes shall not be implemented without migration consideration.

---

# 35. Implementation Phase

Implementation shall follow approved requirements and design.

During implementation:

* deviations shall be recorded;
* assumptions shall be validated;
* tests shall be developed;
* documentation shall remain current;
* scope shall remain controlled.

Implementation shall not silently reinterpret requirements.

---

# 36. Verification Phase

Verification shall include applicable:

* unit tests;
* integration tests;
* contract tests;
* end-to-end tests;
* migration tests;
* recovery tests;
* performance tests;
* security tests;
* architecture checks.

Verification shall address risk, not merely code coverage.

---

# 37. Operational Readiness Phase

Operational readiness shall verify:

* configuration;
* deployment;
* logging;
* metrics;
* health checks;
* alerting;
* backup;
* recovery;
* maintenance;
* upgrade;
* rollback.

Operational documentation shall be usable by someone other than the original implementer.

---

# 38. Completion Phase

Completion shall verify the complete Definition of Done.

The module shall produce:

* completion evidence;
* traceability;
* accepted limitations;
* release recommendation;
* unresolved risk report.

Completion shall be explicit.

---

# 39. Phase Gates

Each lifecycle phase shall have an exit gate.

A gate shall verify that the work required for the next phase is available.

Gate approval may be lightweight for low-risk modules.

High-risk modules require stronger evidence.

---

# 40. Gate Bypass

A phase gate may be bypassed only when:

* the phase is genuinely not applicable;
* the reason is documented;
* risks are accepted;
* downstream impact is understood.

Urgency alone is not sufficient justification.

---

# 41. Definition of Done

`DefinitionOfDone.md` defines the mandatory completion criteria for implementation work.

It applies to:

* tasks;
* features;
* modules;
* milestones;
* releases;

at the appropriate level.

A lower-level Definition of Done may add requirements.

It shall not weaken the parent standard.

---

# 42. Definition of Done Dimensions

The Definition of Done shall evaluate:

* scope;
* architecture;
* functionality;
* contracts;
* data;
* errors;
* tests;
* security;
* privacy;
* performance;
* observability;
* operations;
* documentation;
* traceability;
* risks.

---

# 43. Functional Completion

Functional completion requires:

* expected behavior works;
* alternate paths are handled;
* failures are defined;
* cancellation works where required;
* edge cases are addressed;
* acceptance criteria pass.

Happy-path completion alone is insufficient.

---

# 44. Architectural Completion

Architectural completion requires:

* approved boundaries are preserved;
* ownership is correct;
* dependency direction is correct;
* Source of Truth is preserved;
* Offline First is preserved;
* contracts are respected;
* no hidden architectural change exists.

---

# 45. Contractual Completion

Contractual completion requires:

* contract definitions are complete;
* implementations conform;
* validation exists;
* errors are stable;
* compatibility is evaluated;
* versions are correct;
* contract tests pass.

---

# 46. Persistence Completion

Persistence completion requires:

* schemas are defined;
* migrations exist;
* integrity is protected;
* transactions are defined;
* recovery is tested;
* backups are considered;
* catalog-file consistency is preserved.

---

# 47. Testing Completion

Testing completion requires:

* applicable test layers exist;
* critical paths are covered;
* failure paths are covered;
* tests are deterministic;
* test data is safe;
* tests pass in the supported environment.

Coverage percentage alone does not establish completion.

---

# 48. Security Completion

Security completion requires:

* trust boundaries are understood;
* authentication is correct;
* authorization is enforced;
* input is validated;
* secrets are protected;
* logs are safe;
* relevant security tests pass.

---

# 49. Privacy Completion

Privacy completion requires:

* personal knowledge exposure is minimized;
* remote processing is explicit;
* telemetry is controlled;
* logs exclude sensitive content;
* provider boundaries are respected;
* retention is justified.

---

# 50. Performance Completion

Performance completion requires:

* relevant targets are defined;
* representative tests are executed;
* resource use is bounded;
* unacceptable regressions are absent;
* results are documented.

Not every module requires full performance testing.

Every performance-sensitive module does.

---

# 51. Observability Completion

Observability completion requires:

* errors are visible;
* operations are traceable;
* metrics are meaningful;
* health can be assessed;
* sensitive data is excluded;
* diagnostic paths exist.

---

# 52. Operational Completion

Operational completion requires:

* deployment is defined;
* configuration is documented;
* backups are addressed;
* recovery is validated;
* upgrade is defined;
* rollback is possible where required;
* runbooks are complete.

---

# 53. Documentation Completion

Documentation completion requires:

* requirements are current;
* technical design matches implementation;
* contracts are current;
* persistence is documented;
* operations are documented;
* limitations are explicit;
* traceability is complete.

---

# 54. Traceability Completion

Traceability shall connect:

```text
Product Requirement

↓

Architecture Decision

↓

Implementation Requirement

↓

Technical Design

↓

Contract or Component

↓

Test

↓

Completion Evidence
```

Missing traceability shall be treated as incomplete governance evidence.

---

# 55. Completion Evidence

Completion evidence may include:

* test reports;
* validation output;
* migration results;
* performance measurements;
* security review;
* compliance review;
* screenshots where appropriate;
* operational validation;
* release checklist.

Evidence shall be reproducible where practical.

---

# 56. Review Levels

Reviews may occur at different levels:

## Task Review

Focused implementation change.

## Feature Review

Complete user or system capability.

## Module Review

Complete implementation module.

## Milestone Review

Integrated set of modules.

## Release Review

Deployable product version.

Review depth shall correspond to risk and scope.

---

# 57. Review Criteria

Every review shall consider:

* correctness;
* completeness;
* architecture compliance;
* scope control;
* maintainability;
* test evidence;
* operational impact;
* risk;
* documentation.

---

# 58. Review Findings

Findings shall be classified as:

* Critical;
* Major;
* Moderate;
* Minor;
* Observation.

Critical and Major findings generally block completion.

Exceptions shall be documented and approved.

---

# 59. Finding Status

Finding status may include:

* Open;
* In Progress;
* Resolved;
* Accepted;
* Deferred;
* Rejected;
* Superseded.

Findings shall not disappear without resolution history.

---

# 60. Self-Review

KnowledgeOS may be developed primarily by one person.

Self-review is permitted.

A self-review shall still use:

* checklists;
* evidence;
* explicit findings;
* deliberate re-reading;
* architecture comparison;
* test results.

Self-review shall not mean skipping review.

---

# 61. AI-Assisted Review

AI agents may assist with:

* consistency analysis;
* requirement tracing;
* contract review;
* test-gap detection;
* documentation review;
* architecture compliance;
* risk identification.

AI-generated approval is not authoritative.

Final approval remains with the project owner.

---

# 62. Scope Management

Every implementation unit shall define:

* included scope;
* excluded scope;
* deferred scope;
* dependencies;
* completion boundary.

Scope shall not expand silently during implementation.

---

# 63. Scope Change

A scope change shall identify:

* requested change;
* reason;
* impact;
* dependencies;
* schedule effect;
* architecture effect;
* test effect;
* operational effect.

Material scope changes require replanning.

---

# 64. Scope Creep

Scope creep includes:

* adding unrelated features;
* expanding contracts unnecessarily;
* introducing speculative abstractions;
* solving future versions prematurely;
* redesigning adjacent modules;
* adding optional integrations without requirement.

Scope creep shall be rejected or formally incorporated.

---

# 65. Change Classification

Implementation governance changes shall be classified as:

## Editorial

No process meaning changes.

## Clarification

Makes an existing rule explicit.

## Process Correction

Repairs an inconsistency or ineffective process.

## Process Change

Changes implementation sequencing, lifecycle or completion criteria.

## Architectural Impact

Changes implementation governance in a way that affects architecture.

Architectural impact requires Architecture Governance review.

---

# 66. Risk Management

Implementation risks shall be explicit.

Each significant risk shall define:

* identifier;
* description;
* probability;
* impact;
* affected modules;
* mitigation;
* contingency;
* owner;
* status;
* review trigger.

---

# 67. Risk Categories

Relevant categories include:

* architectural;
* technical;
* data integrity;
* synchronization;
* performance;
* security;
* privacy;
* operational;
* dependency;
* schedule;
* maintainability.

---

# 68. Risk Acceptance

Accepted risks shall remain visible.

Acceptance shall define:

* rationale;
* approving authority;
* affected release;
* mitigation;
* review date;
* re-evaluation trigger.

Accepted risk is not resolved risk.

---

# 69. Blocking Risks

A risk shall block implementation or completion when it threatens:

* authoritative data;
* user privacy;
* security;
* recoverability;
* architecture compliance;
* migration safety;
* public contract stability.

Blocking risks require explicit resolution or approval.

---

# 70. Technical Debt

Technical debt shall be governed explicitly.

Each debt item shall define:

* cause;
* scope;
* impact;
* risk;
* workaround;
* remediation;
* priority;
* target milestone;
* owner.

Technical debt shall not be hidden inside comments or unfinished design.

---

# 71. Allowed Technical Debt

Technical debt may be accepted when:

* architecture remains valid;
* user data remains safe;
* security remains acceptable;
* limitations are documented;
* remediation is feasible;
* scope is bounded.

---

# 72. Prohibited Technical Debt

Technical debt shall not be accepted when it:

* risks authoritative data loss;
* bypasses authorization;
* breaks identity;
* violates Source of Truth;
* prevents recovery;
* makes migrations unsafe;
* hides architectural divergence;
* exposes private knowledge.

---

# 73. Implementation Backlog

Implementation backlog items shall define:

* identifier;
* title;
* scope;
* priority;
* dependencies;
* target milestone;
* acceptance criteria;
* risk;
* status.

The backlog shall not replace module completion documentation.

---

# 74. Priority

Implementation priority shall consider:

* architecture dependency;
* user value;
* risk reduction;
* unblock impact;
* operational necessity;
* security;
* data safety.

Priority shall not be based only on visual appeal or coding convenience.

---

# 75. Status Reporting

Implementation status shall communicate:

* completed work;
* active work;
* blocked work;
* deferred work;
* risks;
* validation;
* next dependency.

Status shall describe capability, not only activity.

---

# 76. Progress Measurement

Progress should be measured through:

* validated requirements;
* completed modules;
* passing integration;
* resolved risks;
* operational readiness;
* release readiness.

File counts and code volume are not reliable progress measures.

---

# 77. Traceability

Implementation Governance shall require bidirectional traceability between:

* architecture;
* implementation plans;
* modules;
* requirements;
* designs;
* contracts;
* tests;
* completion evidence.

Untraceable implementation work shall be treated as suspect.

---

# 78. Architecture Compliance Gates

Architecture compliance shall be reviewed:

* before module implementation;
* before major contract stabilization;
* before persistence migration;
* before module completion;
* before release.

High-risk changes may require additional checkpoints.

---

# 79. Requirement Gates

Requirements shall be reviewed before implementation when:

* behavior is new;
* user impact is material;
* failure behavior is complex;
* persistence is affected;
* public contracts are affected;
* security or privacy is affected.

---

# 80. Design Gates

Technical design shall be reviewed before implementation when:

* multiple modules interact;
* data authority is involved;
* migrations are required;
* concurrency is complex;
* synchronization is involved;
* recovery is critical;
* deployment topology changes.

---

# 81. Contract Gates

Contracts shall be stabilized before multiple dependent implementations proceed.

Contract review shall verify:

* ownership;
* semantics;
* errors;
* compatibility;
* versioning;
* validation;
* testability.

---

# 82. Persistence Gates

Persistence changes shall not proceed without:

* schema review;
* migration review;
* consistency review;
* backup impact review;
* recovery review;
* rollback consideration.

---

# 83. Security Gates

Security review is mandatory before completion for changes affecting:

* authentication;
* authorization;
* plugins;
* public APIs;
* providers;
* remote execution;
* storage;
* synchronization;
* secrets.

---

# 84. Privacy Gates

Privacy review is mandatory for changes affecting:

* personal knowledge transmission;
* AI providers;
* telemetry;
* logging;
* exports;
* synchronization;
* cloud services;
* plugin access.

---

# 85. Release Gates

Release readiness shall verify:

* completed scope;
* passing tests;
* resolved blockers;
* accepted risks;
* deployment readiness;
* backup readiness;
* recovery readiness;
* upgrade readiness;
* documentation;
* supportability.

---

# 86. Versioning

Implementation versions shall remain traceable to:

* architecture version;
* module versions;
* contract versions;
* schema versions;
* release versions.

Version relationships shall be documented.

---

# 87. Compatibility

Compatibility shall be evaluated for:

* persisted data;
* APIs;
* plugin contracts;
* synchronization protocols;
* exchange formats;
* backups;
* configurations.

Compatibility guarantees shall be explicit.

---

# 88. Deprecation

Deprecation shall define:

* deprecated element;
* replacement;
* compatibility period;
* migration;
* removal criteria;
* affected users or modules.

Deprecation shall not be used as an undocumented deletion path.

---

# 89. Migration Governance

Migration work shall follow:

* explicit source and target states;
* backups;
* migration scripts;
* representative tests;
* validation;
* rollback or recovery;
* completion evidence.

Migration shall be treated as implementation work, not an administrative detail.

---

# 90. Documentation Rules

Implementation Governance documents shall:

* be complete;
* use stable terminology;
* define authority;
* define status;
* avoid unresolved placeholders;
* avoid duplicated rules;
* remain traceable;
* preserve historical changes.

---

# 91. No Placeholder Completion

Documents or modules shall not be declared complete when they contain unresolved:

* TODO;
* TBD;
* FIXME;
* pending implementation;
* temporary placeholder;
* unvalidated assumption.

Known limitations shall be explicit and accepted.

---

# 92. Minimum Change Rule

Agents shall make the smallest complete governance change required.

They shall not:

* redefine unrelated implementation phases;
* reopen completed modules without cause;
* add bureaucracy without value;
* weaken Definition of Done;
* bypass gates for convenience;
* hide risks;
* close findings without evidence;
* alter architecture through process rules.

---

# 93. Process Simplicity

Governance shall remain proportionate to a primarily single-person project.

Processes shall be:

* rigorous;
* lightweight;
* repeatable;
* documented;
* useful.

Governance shall not imitate unnecessary organizational bureaucracy.

---

# 94. Automation

Automation may support:

* status validation;
* traceability validation;
* checklist validation;
* test execution;
* report generation;
* version checks;
* contract checks;
* migration checks.

Automation shall not replace judgment or approval.

---

# 95. Evidence Integrity

Evidence shall not be fabricated, edited to conceal failure or reused outside its valid context.

Evidence shall identify:

* environment;
* version;
* scope;
* execution date;
* result.

---

# 96. Exceptions

An exception to Implementation Governance shall define:

* rule being bypassed;
* reason;
* scope;
* risk;
* owner;
* duration;
* compensating controls;
* expiration.

Permanent undocumented exceptions are prohibited.

---

# 97. Escalation Rules

An agent shall stop and escalate when:

* implementation strategy conflicts with architecture;
* Definition of Done cannot be satisfied;
* module dependencies are cyclic or undefined;
* requirements contradict approved architecture;
* migration safety cannot be established;
* a blocker threatens authoritative data;
* security or privacy risk is unresolved;
* completion evidence is unavailable;
* a requested shortcut bypasses a mandatory gate.

The agent shall not resolve these situations through assumption.

---

# 98. Prohibited Actions

Agents working in Implementation Governance shall not:

* approve architectural changes;
* weaken architecture requirements;
* declare incomplete work complete;
* hide blockers;
* hide technical debt;
* skip required reviews;
* remove historical findings;
* falsify validation evidence;
* ignore migration impact;
* approve unsafe data handling;
* prioritize visible progress over data integrity;
* introduce process changes outside the approved scope;
* create new directories outside the frozen tree.

---

# 99. Review Checklist

Before approving Implementation Governance work, verify:

* [ ] The objective is explicit.
* [ ] The authority boundary is preserved.
* [ ] Architecture Governance remains authoritative.
* [ ] Implementation Strategy remains coherent.
* [ ] Module lifecycle remains complete.
* [ ] Definition of Done is not weakened.
* [ ] Scope is controlled.
* [ ] Dependencies are explicit.
* [ ] Risks are visible.
* [ ] Technical debt is visible.
* [ ] Phase gates are clear.
* [ ] Review gates are clear.
* [ ] Completion evidence is required.
* [ ] Traceability is preserved.
* [ ] Security gates remain adequate.
* [ ] Privacy gates remain adequate.
* [ ] Migration governance remains adequate.
* [ ] Release readiness remains adequate.
* [ ] Historical integrity is preserved.
* [ ] No architecture was silently changed.
* [ ] The process remains proportionate.

---

# 100. Agent Reporting

After modifying Implementation Governance, the agent shall report:

* objective;
* files modified;
* process affected;
* lifecycle phase affected;
* Definition of Done impact;
* strategy impact;
* module impact;
* milestone impact;
* architecture impact;
* risk impact;
* gate impact;
* traceability impact;
* release impact;
* validation performed;
* unresolved findings;
* remaining risks.

---

# 101. Relationship with Module AGENTS

Module-level `AGENTS.md` files may specialize implementation rules for their scope.

They shall follow:

```text
Repository AGENTS

+

Architecture AGENTS

+

Implementation AGENTS

+

Implementation Governance AGENTS

+

Module AGENTS
```

A module guide shall not weaken the lifecycle or Definition of Done.

---

# 102. Relationship with Master Library

The Master Library module shall follow this governance model for:

* requirements;
* technical design;
* Domain;
* contracts;
* persistence;
* server;
* client;
* testing;
* operations;
* completion.

Its module-specific guide may add stricter data-integrity and recovery rules.

---

# 103. Relationship with Desktop Application

The Desktop Application shall follow this governance model for:

* requirements;
* architecture;
* workspace;
* UI;
* platform integration;
* state;
* testing;
* completion.

Its module-specific guide may add platform and UX-specific gates.

---

# 104. Final Rule

Implementation Governance exists to convert architectural intent into controlled, verifiable execution.

Every module shall begin with a clear purpose.

Every phase shall produce usable evidence.

Every gate shall prevent a meaningful class of failure.

Every completed capability shall be testable.

Every risk shall remain visible.

Every deviation shall be explicit.

Every release shall be operationally defensible.

Governance shall never become an excuse for endless planning.

Implementation shall never become an excuse for abandoning governance.

KnowledgeOS implementation advances only when each increment is architecturally compliant, technically complete, validated and ready for its intended use.

---

# End of `01-Implementation/00-Governance/AGENTS.md`
