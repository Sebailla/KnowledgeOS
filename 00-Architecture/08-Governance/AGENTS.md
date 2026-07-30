
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Governance
**Path:** `00-Architecture/08-Governance/`
**Document:** Architecture Governance Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the operational rules for every human or AI agent working inside:

```text
00-Architecture/08-Governance/
```

Governance controls how the KnowledgeOS architecture is:

* reviewed;
* approved;
* amended;
* frozen;
* versioned;
* documented;
* migrated;
* audited;
* maintained.

Governance does not define product functionality.

Governance defines the process by which architectural decisions become valid.

Its purpose is to ensure that KnowledgeOS evolves deliberately without losing:

* consistency;
* traceability;
* stability;
* architectural integrity;
* historical continuity.

---

# 2. Scope

This guide applies to:

```text
08-Governance/
├── ArchitectureAmendment-v3.0-001.md
├── ArchitectureBacklog.md
├── ArchitectureDecisionMatrix.md
├── ArchitectureFreeze-v3.0.md
├── ArchitectureReview-v3.0.md
├── ArchitectureV3MigrationPlan.md
├── ArchitectureVocabulary.md
├── DocumentationStandards.md
├── README.md
└── AGENTS.md
```

It governs:

* architecture amendments;
* architecture reviews;
* architecture freezes;
* decision traceability;
* backlog management;
* vocabulary;
* documentation standards;
* migration planning;
* compliance;
* architecture change control.

---

# 3. Governance Authority

Governance is the authority for architectural process.

It owns:

* architecture approval;
* architecture status;
* amendment procedures;
* freeze procedures;
* review procedures;
* documentation rules;
* vocabulary control;
* architecture backlog;
* decision traceability;
* migration governance;
* compliance criteria.

Governance does not own:

* Product Vision;
* Domain semantics;
* Kernel behavior;
* Platform Engine responsibilities;
* Integration contracts;
* Execution semantics;
* implementation details;
* deployment operations.

---

# 4. Governance Principle

Architecture shall not change implicitly.

Every material architectural change shall be:

1. identified;
2. documented;
3. evaluated;
4. approved;
5. traced;
6. propagated;
7. validated.

Undocumented architectural evolution is prohibited.

---

# 5. Mandatory Reading Order

Before modifying any file in this directory, an agent shall read:

1. repository root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. this `AGENTS.md`;
4. `08-Governance/README.md`;
5. `ArchitectureFreeze-v3.0.md`;
6. `ArchitectureReview-v3.0.md`;
7. `ArchitectureDecisionMatrix.md`;
8. `ArchitectureVocabulary.md`;
9. `DocumentationStandards.md`;
10. the affected architectural documents;
11. the affected ADRs;
12. the current implementation impact, when relevant.

No governance document shall be changed without understanding the architecture it governs.

---

# 6. Governance Objectives

Architecture Governance shall preserve:

* architectural coherence;
* stable boundaries;
* stable terminology;
* historical decisions;
* explicit ownership;
* controlled evolution;
* implementation alignment;
* reviewability;
* reproducibility;
* auditability.

Governance shall reduce unnecessary restructuring.

It shall not become a source of continuous redesign.

---

# 7. Governance Invariants

The following invariants shall always hold:

* approved architecture has an explicit version;
* frozen architecture cannot change silently;
* material changes require approval;
* historical decisions remain traceable;
* obsolete decisions remain recorded;
* terminology remains controlled;
* implementation deviations remain visible;
* architecture documents remain mutually consistent;
* architecture status is never ambiguous.

---

# 8. Architectural State

Architecture may exist in one of the following states:

```text
Draft

↓

Under Review

↓

Approved

↓

Frozen

↓

Amended

↓

Superseded
```

Each state has distinct change rules.

Agents shall not treat these states as interchangeable.

---

# 9. Draft Architecture

Draft architecture may evolve freely within its declared scope.

Draft status shall be visible.

Draft content shall not be treated as implementation authority.

Draft documents shall not silently replace approved architecture.

---

# 10. Architecture Under Review

Architecture under review is proposed but not yet authoritative.

During review:

* inconsistencies shall be identified;
* alternatives shall be compared;
* impact shall be evaluated;
* traceability shall be verified;
* unresolved risks shall be documented.

Review shall not be confused with approval.

---

# 11. Approved Architecture

Approved architecture is authoritative.

Implementation shall align with it.

Approved architecture may still evolve before freeze, but material changes require explicit review.

---

# 12. Frozen Architecture

Frozen architecture is stable for implementation.

Freeze means:

* no structural redesign without amendment;
* no silent boundary changes;
* no silent responsibility changes;
* no silent terminology changes;
* no silent storage authority changes;
* no silent synchronization changes.

Freeze does not prohibit correction.

It controls change.

---

# 13. Amended Architecture

An amendment changes a frozen architectural baseline.

Amendments shall be:

* limited;
* justified;
* traceable;
* approved;
* versioned;
* propagated.

An amendment shall not become an excuse to redesign unrelated areas.

---

# 14. Superseded Architecture

Superseded architecture remains part of the historical record.

It shall not be deleted merely because a newer version exists.

Supersession shall identify:

* replacement;
* effective version;
* reason;
* migration impact;
* implementation impact.

---

# 15. Architecture Freeze

`ArchitectureFreeze-v3.0.md` defines the frozen architectural baseline for version 3.0.

The freeze shall identify:

* included areas;
* approved documents;
* approved ADRs;
* known limitations;
* allowed corrections;
* prohibited changes;
* amendment process;
* implementation obligations.

The freeze document shall not redefine architecture.

It identifies the authoritative baseline.

---

# 16. Freeze Scope

The architecture freeze applies to:

```text
01-Foundation
02-Domain
03-Kernel
04-Platform
05-Integration
06-Execution
07-ArchitectureViews
08-Governance
```

The freeze may also reference implementation obligations.

Implementation is not automatically frozen merely because architecture is frozen.

---

# 17. Permitted Changes After Freeze

Permitted changes may include:

* spelling corrections;
* broken-link corrections;
* formatting corrections;
* clarified wording that does not change meaning;
* missing traceability references;
* diagram corrections that align with approved architecture;
* explicit documentation of already-approved decisions.

These changes shall not alter architecture semantics.

---

# 18. Material Changes After Freeze

Material changes include:

* new architectural layers;
* new Domain models;
* changed ownership;
* changed Source of Truth;
* changed Engine responsibilities;
* changed integration boundaries;
* changed execution guarantees;
* changed synchronization authority;
* changed storage architecture;
* changed public contracts;
* changed platform scope.

Material changes require an amendment.

---

# 19. Architecture Amendments

An Architecture Amendment records an approved modification to the frozen architecture.

The current amendment series begins with:

```text
ArchitectureAmendment-v3.0-001.md
```

Amendment numbering shall be:

* sequential;
* stable;
* version-specific;
* never reused.

---

# 20. Amendment Content

Every amendment shall define:

* identifier;
* title;
* architecture version;
* status;
* date;
* author or owner;
* context;
* problem;
* affected scope;
* proposed change;
* rationale;
* alternatives;
* consequences;
* risks;
* affected documents;
* affected ADRs;
* affected diagrams;
* implementation impact;
* migration impact;
* validation criteria;
* approval record.

---

# 21. Amendment Scope

An amendment shall change only what is necessary.

It shall not include unrelated cleanup.

When multiple unrelated architectural changes exist, separate amendments shall be created.

---

# 22. Amendment Approval

An amendment becomes authoritative only after approval.

Approval shall verify:

* necessity;
* architectural consistency;
* scope containment;
* compatibility;
* migration feasibility;
* implementation impact;
* documentation completeness;
* traceability;
* risk acceptance.

Proposed amendments shall not be implemented as approved architecture before approval.

---

# 23. Amendment Propagation

After approval, the amendment shall be propagated to all affected artifacts.

Possible affected areas include:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* ADRs;
* C4 diagrams;
* UML diagrams;
* Governance;
* implementation documents;
* tests;
* migration plans.

Partial propagation is prohibited.

---

# 24. Architecture Review

`ArchitectureReview-v3.0.md` records the formal review of Architecture V3.

A review shall evaluate:

* completeness;
* consistency;
* traceability;
* boundaries;
* responsibilities;
* quality attributes;
* deployment assumptions;
* operational viability;
* implementation readiness;
* known risks.

---

# 25. Review Independence

Review shall distinguish between:

* author intent;
* documented architecture;
* implementation assumptions;
* unresolved gaps.

A review shall not approve architecture merely because it is extensive.

Completeness of volume is not completeness of meaning.

---

# 26. Review Categories

Review findings may be classified as:

## Critical

The architecture cannot safely proceed.

## Major

The architecture contains a significant inconsistency or missing decision.

## Moderate

The architecture is usable but requires clarification.

## Minor

The issue is editorial or low-risk.

## Observation

No correction is required, but the finding should remain visible.

---

# 27. Review Status

Every finding shall have a status:

* Open;
* Accepted;
* Resolved;
* Deferred;
* Rejected;
* Superseded.

A finding shall not disappear from the review history.

---

# 28. Review Evidence

Architecture review shall be based on evidence.

Evidence may include:

* documents;
* ADRs;
* diagrams;
* traceability;
* validation reports;
* implementation design;
* test strategy;
* deployment constraints;
* quality attributes.

Unsupported approval is prohibited.

---

# 29. Architecture Decision Matrix

`ArchitectureDecisionMatrix.md` provides traceability between architectural decisions and their consequences.

It shall map decisions to:

* architectural areas;
* ADRs;
* quality attributes;
* affected components;
* implementation areas;
* diagrams;
* risks;
* status.

---

# 30. Decision Matrix Purpose

The matrix exists to answer questions such as:

* Where is this decision defined?
* Which ADR approves it?
* Which documents depend on it?
* Which implementation area is affected?
* Which quality attributes does it protect?
* What changes if the decision is amended?

The matrix shall not replace the source documents.

---

# 31. Decision Identity

Every material architectural decision shall have a stable identity.

Identity may be provided by:

* ADR number;
* amendment number;
* governance decision identifier;
* explicit architecture section reference.

Unidentified architectural decisions are prohibited.

---

# 32. Decision Status

Decision status shall remain explicit.

Possible statuses include:

* Proposed;
* Approved;
* Frozen;
* Amended;
* Superseded;
* Rejected;
* Deferred.

The same decision shall not have conflicting statuses across Governance documents.

---

# 33. Decision Traceability

Traceability shall cover both directions.

```text
Decision

↓

Architecture Documents

↓

Views

↓

Implementation

↓

Validation
```

And:

```text
Implementation Change

↓

Architectural Decision

↓

ADR or Amendment

↓

Approved Baseline
```

Implementation without architectural traceability shall be treated as a deviation.

---

# 34. Architecture Backlog

`ArchitectureBacklog.md` records unresolved or deferred architectural work.

The backlog shall not be used to hide incomplete mandatory architecture.

It is for work that is:

* explicitly deferred;
* non-blocking;
* future-facing;
* version-scoped;
* risk-assessed.

---

# 35. Backlog Entry

Every backlog entry shall define:

* identifier;
* title;
* description;
* rationale;
* affected areas;
* priority;
* status;
* target version;
* dependencies;
* risk;
* acceptance criteria.

Vague backlog entries are prohibited.

---

# 36. Backlog Priority

Priority shall reflect architectural impact.

Suggested priorities:

* Critical;
* High;
* Medium;
* Low.

Priority shall not be based only on implementation convenience.

---

# 37. Backlog Status

Backlog status may include:

* Proposed;
* Accepted;
* Planned;
* In Progress;
* Resolved;
* Rejected;
* Deferred;
* Superseded.

Resolved entries shall remain traceable.

---

# 38. Backlog and Freeze

An item may remain in the backlog while Architecture V3 is frozen only when:

* it does not invalidate the frozen baseline;
* it is documented as future work;
* its risk is accepted;
* implementation does not require it immediately.

Blocking gaps shall not be deferred merely to declare completion.

---

# 39. Architecture Vocabulary

`ArchitectureVocabulary.md` is the controlled architectural vocabulary of KnowledgeOS.

It defines:

* approved terms;
* precise meanings;
* prohibited ambiguities;
* preferred naming;
* relationships between concepts.

Vocabulary control is mandatory.

---

# 40. Vocabulary Authority

When architectural documents use conflicting terminology, the controlled vocabulary shall guide correction.

However, vocabulary shall not silently redefine Domain semantics.

Domain concepts remain authoritative within Domain.

Governance controls consistent naming across the repository.

---

# 41. Stable Terms

Stable terms shall not be renamed casually.

Examples include:

* KnowledgeOS;
* Master Library;
* Local Library;
* Personal Workspace;
* Knowledge Object;
* UDM;
* DPM;
* Kernel;
* Platform Engine;
* Provider;
* Public Contract;
* Source of Truth;
* Offline First;
* Synchronization;
* Plugin SDK.

Renaming a stable term may require an amendment.

---

# 42. Synonyms

Agents shall avoid undocumented synonyms.

For example, they shall not interchange concepts such as:

* Master Library and NAS;
* Local Library and cache;
* Provider and Engine;
* Domain and persistence;
* synchronization and replication;
* asset and document;
* workspace and library.

Similar words do not imply equivalent architecture.

---

# 43. New Terms

A new architectural term shall be introduced only when:

* an existing term is insufficient;
* the concept is architecturally meaningful;
* the definition is precise;
* relationships are documented;
* ambiguity is reduced.

New terms shall be added to the vocabulary when approved.

---

# 44. Documentation Standards

`DocumentationStandards.md` defines how KnowledgeOS architecture documentation shall be written and maintained.

It governs:

* document structure;
* metadata;
* headings;
* terminology;
* file naming;
* status;
* versioning;
* references;
* diagrams;
* completeness;
* quality.

---

# 45. Document Metadata

Architecture documents shall include, where applicable:

* Project;
* Area;
* Document;
* Version;
* Status;
* Owner;
* Date;
* Related ADRs.

Metadata shall remain consistent.

---

# 46. Document Status

Document status shall be explicit.

Typical statuses include:

* Draft;
* Proposed;
* Approved;
* Frozen;
* Deprecated;
* Superseded.

A document shall not appear approved if its governing decision is still under review.

---

# 47. Document Versioning

Version numbers shall reflect semantic evolution.

Editorial corrections do not necessarily require a major version change.

Architectural changes shall update versions according to the established versioning policy.

Version history shall not be erased.

---

# 48. File Naming

File names shall be:

* stable;
* descriptive;
* consistent;
* aligned with repository conventions.

Agents shall not rename files unnecessarily.

Renaming requires updating:

* references;
* links;
* diagrams;
* scripts;
* indexes;
* traceability.

---

# 49. Complete Documents

KnowledgeOS documentation shall be delivered as complete files.

Agents shall not provide undocumented partial patches as final architectural artifacts.

A replacement document shall be internally complete and ready to use.

---

# 50. No Placeholders

Approved documentation shall not contain unresolved placeholders such as:

* TODO;
* TBD;
* FIXME;
* pending;
* complete later;
* example only.

Deferred architecture belongs in the Architecture Backlog.

---

# 51. No Duplication

Documents shall not duplicate entire architectural definitions from other areas.

They may summarize or reference them.

Duplication creates divergent sources of truth.

Each concept shall have a clear primary owner.

---

# 52. Cross-References

Cross-references shall be:

* accurate;
* repository-relative where appropriate;
* stable;
* bidirectionally traceable when material.

Broken references shall be corrected.

---

# 53. Documentation Language

Architecture terminology shall remain consistent across languages.

The repository may contain documents in a selected documentation language, but architectural terms shall not change meaning during translation.

Translation shall preserve:

* responsibility;
* authority;
* invariants;
* modality;
* decision status.

---

# 54. Normative Language

Normative terms shall be used deliberately.

## Shall

Mandatory requirement.

## Shall not

Explicit prohibition.

## Should

Strong recommendation with possible exceptions.

## May

Permitted option.

Agents shall not weaken mandatory requirements through casual wording.

---

# 55. Architecture Migration Plan

`ArchitectureV3MigrationPlan.md` defines how earlier architecture and implementation artifacts transition to Architecture V3.

It shall identify:

* source state;
* target state;
* changed concepts;
* renamed concepts;
* deprecated artifacts;
* migration sequence;
* implementation impact;
* validation;
* rollback or recovery strategy.

---

# 56. Migration Scope

Migration may affect:

* documentation;
* ADRs;
* diagrams;
* directory structure;
* implementation contracts;
* persistence;
* synchronization;
* deployment;
* testing;
* operational procedures.

Migration scope shall remain explicit.

---

# 57. Migration Phases

A migration plan should define phases such as:

```text
Assessment

↓

Preparation

↓

Documentation Alignment

↓

Implementation Alignment

↓

Data Migration

↓

Validation

↓

Completion
```

The exact phases may vary.

Transitions shall be controlled.

---

# 58. Migration Preconditions

Every migration phase shall define preconditions.

Examples include:

* approved target architecture;
* backups;
* compatibility review;
* implementation readiness;
* test readiness;
* rollback capability;
* stakeholder approval.

Migration shall not begin from an undefined baseline.

---

# 59. Migration Validation

Migration validation shall confirm:

* identity preservation;
* data integrity;
* contract compatibility;
* storage integrity;
* synchronization correctness;
* architectural compliance;
* implementation traceability.

Successful execution alone does not prove successful migration.

---

# 60. Migration Completion

Migration is complete only when:

* target architecture is active;
* obsolete paths are retired or documented;
* implementation aligns;
* diagrams align;
* tests pass;
* traceability is complete;
* known limitations are documented;
* rollback obligations are resolved.

---

# 61. Architecture Compliance

Compliance means that implementation and documentation respect the approved architectural baseline.

Compliance shall evaluate:

* boundaries;
* ownership;
* dependency direction;
* contracts;
* data authority;
* execution guarantees;
* security;
* privacy;
* deployment constraints;
* quality attributes.

---

# 62. Compliance Evidence

Evidence may include:

* architecture tests;
* contract tests;
* dependency analysis;
* implementation reviews;
* traceability matrices;
* diagrams;
* runtime validation;
* migration results;
* code inspection.

Compliance shall not rely exclusively on declarations.

---

# 63. Architectural Deviation

A deviation occurs when implementation or documentation contradicts approved architecture.

Examples include:

* bypassing an Engine;
* direct storage access;
* bypassing public contracts;
* changing Source of Truth;
* hidden shared state;
* undocumented remote dependency;
* violating Offline First;
* changing synchronization authority;
* using caches as authoritative storage.

---

# 64. Deviation Handling

A deviation shall be:

1. identified;
2. documented;
3. classified;
4. risk-assessed;
5. corrected or approved;
6. traced;
7. validated.

A deviation shall not remain invisible.

---

# 65. Temporary Exceptions

Temporary exceptions may be approved only when:

* duration is defined;
* scope is limited;
* risk is accepted;
* remediation is planned;
* ownership is explicit;
* expiration is recorded.

Temporary exceptions shall not become permanent through neglect.

---

# 66. Change Classification

Governance changes shall be classified.

## Editorial Change

Does not alter meaning.

## Clarification

Makes existing meaning explicit.

## Corrective Change

Repairs inconsistency with approved architecture.

## Architectural Amendment

Changes the frozen architecture.

## Version Evolution

Defines a new architectural baseline.

Classification shall be recorded when material.

---

# 67. Minimum Change Rule

Agents shall make the smallest complete governance change required.

They shall not:

* reopen unrelated decisions;
* redesign frozen architecture;
* rename stable concepts casually;
* combine unrelated amendments;
* modify historical records unnecessarily;
* rewrite review history;
* hide unresolved findings;
* expand scope without justification.

---

# 68. Historical Integrity

Governance records are historical artifacts.

Agents shall preserve:

* original decisions;
* original statuses;
* review findings;
* supersession relationships;
* amendment history;
* migration history.

History shall not be rewritten to make architecture appear more linear than it was.

---

# 69. Deletion Rules

Governance records shall rarely be deleted.

Documents may be removed only when:

* they are exact accidental duplicates;
* they contain no unique historical value;
* references are updated;
* deletion is approved;
* traceability is preserved.

Deprecated or superseded records should normally remain.

---

# 70. Governance and ADRs

ADRs are stored under:

```text
00-Architecture/07-ArchitectureViews/ADR/
```

Governance controls:

* ADR creation;
* numbering;
* status;
* approval;
* supersession;
* traceability.

Architecture Views stores and represents them.

The responsibilities shall remain distinct.

---

# 71. Governance and Architecture Views

Governance determines whether a view is:

* approved;
* frozen;
* amended;
* superseded.

Architecture Views determines how approved architecture is represented.

A view shall not become authoritative merely because it renders correctly.

---

# 72. Governance and Implementation

Implementation shall follow the approved architecture.

Governance shall not define source code details unless they are architecturally significant.

Implementation discoveries may trigger:

* clarification;
* correction;
* backlog entry;
* amendment;
* new version planning.

They shall not silently alter architecture.

---

# 73. Governance and Quality Attributes

Every material decision shall be evaluated against relevant quality attributes.

These may include:

* reliability;
* performance;
* security;
* privacy;
* recoverability;
* portability;
* maintainability;
* extensibility;
* observability;
* usability;
* Offline First behavior.

A decision shall not be approved without understanding its quality impact.

---

# 74. Governance and Product Vision

Governance shall protect the Product Vision.

Architectural changes shall not silently contradict:

* user ownership;
* Offline First;
* NAS as Master Library authority;
* local and remote AI;
* privacy;
* portability;
* extensibility;
* supported platforms.

A Product Vision conflict requires explicit product-level review.

---

# 75. Decision Evaluation

Material decisions shall be evaluated using criteria such as:

* alignment with Product Vision;
* architectural consistency;
* necessity;
* reversibility;
* migration cost;
* implementation cost;
* operational complexity;
* security impact;
* privacy impact;
* quality impact;
* long-term maintainability.

---

# 76. Reversibility

Governance shall distinguish:

* reversible decisions;
* costly-to-reverse decisions;
* effectively irreversible decisions.

The less reversible a decision is, the stronger its evidence and review requirements shall be.

---

# 77. Architectural Risk

Risks shall be documented explicitly.

Each significant risk should define:

* description;
* probability;
* impact;
* affected areas;
* mitigation;
* contingency;
* owner;
* status.

Risk shall not be hidden inside narrative text.

---

# 78. Accepted Risk

An accepted risk shall remain visible.

Acceptance shall identify:

* decision;
* rationale;
* accepting authority;
* review date;
* re-evaluation trigger.

Accepted does not mean resolved.

---

# 79. Governance Reviews

Governance itself shall be reviewed periodically.

Review shall verify:

* documents remain current;
* statuses remain correct;
* traceability remains complete;
* backlog remains relevant;
* vocabulary remains consistent;
* amendments are propagated;
* frozen baseline remains coherent;
* implementation deviations are visible.

---

# 80. Review Triggers

A governance review may be triggered by:

* architecture amendment;
* major implementation milestone;
* new deployment model;
* new platform;
* storage migration;
* synchronization redesign;
* security incident;
* major provider change;
* release readiness review;
* discovery of architectural inconsistency.

---

# 81. Approval Records

Approvals shall be recorded where relevant.

Approval records should identify:

* artifact;
* version;
* date;
* status;
* approver or authority;
* conditions;
* unresolved risks.

Approval shall be auditable.

---

# 82. Single-Person Project Governance

KnowledgeOS may be developed by a single primary owner.

Governance shall remain rigorous without becoming bureaucratic.

For a single-person project:

* decisions shall still be documented;
* reviews may be self-reviews;
* approval authority may be the project owner;
* traceability remains mandatory;
* scope control remains mandatory;
* historical integrity remains mandatory.

Governance exists to protect future continuity, not to simulate a large organization.

---

# 83. AI Agent Governance

AI agents may assist with:

* document drafting;
* consistency checking;
* traceability;
* diagram review;
* backlog organization;
* migration analysis;
* compliance review.

AI agents shall not independently approve material architectural changes.

Approval authority remains with the project owner.

---

# 84. AI Agent Constraints

AI agents shall not:

* invent missing decisions;
* reinterpret frozen architecture;
* silently reconcile contradictions;
* declare approval;
* modify decision status without instruction;
* fabricate review evidence;
* remove historical context;
* introduce new structure outside the approved tree.

When uncertainty exists, it shall be reported explicitly.

---

# 85. Governance Automation

Automation may support:

* link validation;
* metadata validation;
* status consistency;
* ADR numbering;
* diagram validation;
* traceability checks;
* terminology checks;
* orphan-document detection.

Automation shall assist governance.

It shall not replace architectural judgment.

---

# 86. Security

Governance documents shall not contain:

* credentials;
* API keys;
* access tokens;
* private secrets;
* sensitive infrastructure details;
* personal data not required for governance.

Security-related decisions may be documented without exposing operational secrets.

---

# 87. Privacy

Governance shall preserve user privacy as an architectural concern.

Changes involving:

* AI providers;
* synchronization;
* telemetry;
* logging;
* plugins;
* public APIs;
* remote execution;

shall include explicit privacy evaluation.

---

# 88. Documentation Validation

Governance documents shall be validated for:

* completeness;
* metadata;
* status consistency;
* terminology;
* references;
* version alignment;
* traceability;
* historical integrity.

A syntactically valid document may still be governance-invalid.

---

# 89. Governance Completion Criteria

Governance work is complete only when:

* the objective is explicit;
* scope is controlled;
* affected architecture is identified;
* status is correct;
* decisions are traceable;
* vocabulary is consistent;
* review requirements are satisfied;
* affected documents are updated;
* affected ADRs are updated;
* affected views are updated;
* migration impact is resolved;
* implementation impact is documented;
* no silent architectural change remains.

---

# 90. Review Checklist

Before approving Governance work, verify:

* [ ] The change has a clear purpose.
* [ ] The change classification is correct.
* [ ] The frozen baseline was reviewed.
* [ ] The affected architectural areas were identified.
* [ ] Product Vision remains protected.
* [ ] Domain ownership remains unchanged unless approved.
* [ ] Kernel boundaries remain consistent.
* [ ] Platform Engine responsibilities remain consistent.
* [ ] Integration boundaries remain consistent.
* [ ] Execution guarantees remain consistent.
* [ ] Related ADRs were reviewed.
* [ ] Related diagrams were reviewed.
* [ ] Decision traceability is complete.
* [ ] Vocabulary remains consistent.
* [ ] Documentation standards are satisfied.
* [ ] Migration impact is documented.
* [ ] Implementation impact is documented.
* [ ] Security impact was evaluated.
* [ ] Privacy impact was evaluated.
* [ ] Quality attributes were evaluated.
* [ ] Historical integrity is preserved.
* [ ] No unrelated redesign was introduced.
* [ ] Approval status is explicit.
* [ ] Remaining risks are visible.

---

# 91. Agent Reporting

After modifying Governance, the agent shall report:

* objective;
* files modified;
* change classification;
* architecture version affected;
* freeze impact;
* amendments affected;
* decisions affected;
* ADRs affected;
* views affected;
* vocabulary impact;
* documentation-standard impact;
* migration impact;
* implementation impact;
* security impact;
* privacy impact;
* quality-attribute impact;
* validation performed;
* unresolved findings;
* remaining risks.

---

# 92. Escalation Rules

An agent shall stop and escalate when:

* the requested change contradicts Product Vision;
* two approved documents conflict;
* an approved ADR contradicts the frozen baseline;
* change classification is ambiguous;
* a correction would materially alter architecture;
* ownership cannot be established;
* migration consequences are unknown;
* implementation has already diverged materially;
* historical records would need to be rewritten;
* approval authority is unclear.

The agent shall not resolve these situations through assumption.

---

# 93. Prohibited Actions

Agents working in Governance shall not:

* redesign frozen architecture without amendment;
* declare architecture approved without authority;
* modify status casually;
* delete historical decisions;
* renumber ADRs;
* hide unresolved findings;
* close backlog items without evidence;
* redefine vocabulary silently;
* weaken mandatory requirements;
* introduce placeholders into approved documents;
* create undocumented exceptions;
* treat implementation convenience as architectural authority;
* modify unrelated areas during focused governance work;
* invent missing approval records.

---

# 94. Relationship with Architecture Version 3

Architecture V3 is the current governed baseline.

Governance shall preserve:

* its scope;
* its frozen decisions;
* its amendments;
* its review history;
* its migration history;
* its decision traceability.

Architecture V3 shall remain stable until:

* an approved amendment modifies it; or
* a formally governed future architecture version supersedes it.

---

# 95. Future Architecture Versions

A future architecture version shall not overwrite V3.

It shall define:

* new version identity;
* scope;
* rationale;
* changed decisions;
* retained decisions;
* deprecated decisions;
* migration path;
* compatibility;
* implementation transition;
* approval;
* freeze criteria.

Version evolution shall preserve historical continuity.

---

# 96. Final Rule

Governance protects KnowledgeOS from uncontrolled architectural drift.

Architecture shall not change because:

* implementation is temporarily difficult;
* a provider behaves differently;
* a tool suggests another structure;
* a new technology appears;
* documentation has become extensive;
* an agent assumes a better design.

Architecture changes only through explicit, reviewed and traceable decisions.

Every frozen decision shall remain stable.

Every amendment shall remain limited.

Every historical record shall remain intact.

Every implementation deviation shall remain visible.

Every architectural version shall have a clear authority.

Governance exists to ensure that KnowledgeOS can evolve without repeatedly losing its foundation.

When a change cannot be traced, reviewed and approved, it is not an architectural decision.

---

# End of `00-Architecture/08-Governance/AGENTS.md`
