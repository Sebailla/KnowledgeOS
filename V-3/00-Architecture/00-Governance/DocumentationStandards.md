
# Documentation Standards

**Project:** KnowledgeOS

**Section:** Governance

**Document:** Documentation Standards

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the official documentation standard for the KnowledgeOS Architecture Handbook.

Its objective is to ensure that every document is:

* consistent;
* maintainable;
* traceable;
* readable;
* versionable;
* implementation-oriented.

Every architecture document shall comply with this standard.

---

# 2. Scope

This standard applies to:

* Governance
* Foundation
* Domain
* Kernel
* Platform
* Integration
* Quality
* Architecture Views

Including:

* ADR
* Specifications
* C4
* UML
* Public APIs
* Engine documentation
* SDK documentation
* Architecture reviews

No exceptions are permitted.

---

# 3. Documentation Principles

All documentation follows these principles.

## Single Source of Truth

Every architectural concept shall have exactly one authoritative definition.

Duplicate definitions are forbidden.

---

## Progressive Refinement

Higher-level documents describe intent.

Lower-level documents describe implementation.

No lower-level document may redefine a higher-level concept.

---

## Consistency

Every document follows the same structure, terminology and formatting rules.

---

## Traceability

Every significant architectural concept shall be traceable from:

Product Vision

↓

Architecture

↓

ADR

↓

Specifications

↓

Implementation

---

## Longevity

Documentation shall remain understandable after many years.

Avoid temporary technologies, trends or implementation details unless essential.

---

# 4. Official Language

The Architecture Handbook uses English.

Exceptions:

* code examples;
* shell commands;
* configuration files.

The ubiquitous language defined in ArchitectureVocabulary.md is mandatory.

---

# 5. File Naming

All files use PascalCase.

Correct:

```text
ArchitectureModel.md

KnowledgeLifecycle.md

WorkflowEngine.md
```

Incorrect:

```text
architecture-model.md

workflow_engine.md

workflow.md
```

---

# 6. Folder Naming

Folders use PascalCase unless a standardized acronym is used.

Examples:

```text
KnowledgeObject

KnowledgeGraph

PluginSDK

PublicAPI

C4

UML
```

---

# 7. Markdown Rules

Each document contains:

Exactly one H1.

H2 for major sections.

H3 when necessary.

Heading levels shall never be skipped.

---

# 8. Mandatory Metadata

Every document begins with:

```text
Project

Section

Document

Version

Status

Author
```

Optional:

* Last Updated
* Related Documents
* Supersedes

---

# 9. Required Sections

Every non-ADR document follows this structure.

```text
1 Purpose

2 Scope

3 Overview

4 Detailed Description

5 Design Decisions

6 References

7 Status
```

Additional sections may be added when justified.

The order shall remain unchanged.

---

# 10. ADR Structure

All ADR use exactly this template.

```text
1 Context

2 Decision Drivers

3 Decision

4 Detailed Design

5 Alternatives

6 Consequences

7 Trade-Offs

8 Risks

9 Compliance

10 Implementation Impact

11 Related Documents

12 Related ADR

13 Status
```

Every ADR shall use this structure.

---

# 11. README Structure

Every section README shall include:

```text
Purpose

Scope

Contents

Responsibilities

Dependencies

Reading Order

Status
```

---

# 12. Terminology Rules

All terminology must match ArchitectureVocabulary.md.

Examples:

Correct:

Knowledge Object

Object Repository

Workflow Engine

Provider

Command

Query

Event

Incorrect:

Document Repository

Record

Storage Folder

Internal Model

---

# 13. Cross References

Every document shall contain a **Related Documents** section.

All references must be relative.

Example:

```text
../01-Foundation/ArchitectureModel.md
```

Absolute paths are forbidden.

---

# 14. Diagrams

PlantUML is the only authoritative diagram source.

Generated PNG and SVG files are derived artifacts.

Mermaid diagrams are not part of the official architecture.

---

# 15. C4 Standards

Official C4 levels:

* Level 1 — System Context
* Level 2 — Container
* Level 3 — Component
* Level 4 — Code (only when necessary)

All diagrams use the local C4-PlantUML library.

---

# 16. UML Standards

Supported diagram types:

* Activity
* Class
* Component
* Deployment
* Sequence
* State

Each diagram belongs to exactly one category.

---

# 17. Code Examples

All code blocks declare their language.

Example:

````text
```swift
```
````

Anonymous code blocks are forbidden.

---

# 18. Tables

Tables are used only when they improve clarity.

Narrative text remains the preferred documentation style.

---

# 19. Diagrams in Markdown

ASCII diagrams are permitted only for conceptual explanations.

They never replace official PlantUML diagrams.

---

# 20. Images

Images generated outside the repository are informative only.

Authoritative diagrams are always produced from PlantUML sources.

---

# 21. Versioning

The handbook follows semantic versioning.

Examples:

```text
3.0

3.1

3.2
```

Major versions represent architectural changes.

Minor versions represent documentation improvements.

---

# 22. Document Status

Allowed values:

```text
Draft

Review

Approved

Deprecated

Archived
```

No other status values are allowed.

---

# 23. Change Management

Editorial corrections:

No ADR required.

Architectural modifications:

Require a new ADR.

Experimental ideas:

Recorded only in ArchitectureBacklog.md.

---

# 24. Quality Checklist

Before approval every document must verify:

* terminology consistency;
* structural compliance;
* valid references;
* updated diagrams;
* correct metadata;
* grammar;
* spelling;
* absence of duplicated concepts.

---

# 25. Architecture Freeze

Once Architecture Handbook v3.0 is approved:

* folder structure is frozen;
* document names are frozen;
* terminology is frozen;
* ADR numbering is frozen.

Only new documents and new ADR may extend the architecture.

Existing concepts shall not be renamed.

---

# 26. Compliance

Every document in the repository must comply with this standard.

Documents that do not comply shall not be considered authoritative.

---

# 27. Related Documents

* README.md
* ArchitectureVocabulary.md
* ArchitectureDecisionMatrix.md
* ArchitectureReview-v3.0.md
* ArchitectureV3MigrationPlan.md

---

# 28. Status

**Approved**

This document defines the official documentation standard for the KnowledgeOS Architecture Handbook v3.0.

All future architectural documentation shall comply with this specification.
