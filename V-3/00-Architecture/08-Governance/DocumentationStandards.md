
# Documentation Standards

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Governance

**Document:** Documentation Standards

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the documentation standards for KnowledgeOS Architecture Version 3.

The architecture of KnowledgeOS is represented through a large body of interrelated documentation covering:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* Architecture Views;
* Governance.

Without common documentation standards, architectural knowledge may become:

* inconsistent;
* ambiguous;
* difficult to navigate;
* difficult to review;
* difficult to maintain;
* contradictory;
* disconnected from implementation.

This document establishes the mandatory rules used to create, structure, identify, version, review and maintain architectural documentation.

---

# 2. Scope

This standard applies to:

* architecture documents;
* README documents;
* Domain specifications;
* Kernel specifications;
* Platform specifications;
* Integration specifications;
* Execution specifications;
* Architecture Decision Records;
* Architecture Views;
* Governance documents;
* PlantUML source;
* architecture-related generated documentation.

This standard governs:

* file naming;
* directory naming;
* document metadata;
* document structure;
* headings;
* terminology;
* normative language;
* identifiers;
* examples;
* code blocks;
* diagrams;
* references;
* Versioning;
* status;
* ownership;
* review;
* deprecation;
* supersession;
* archival.

This document does not define:

* product documentation standards outside Architecture;
* source-code formatting;
* programming-language style;
* Git branching strategy;
* user documentation;
* marketing documentation.

---

# 3. Core Principle

The fundamental principle is:

> Architecture documentation is part of the architecture and shall be maintained with the same discipline as architectural contracts.

The complementary principle is:

> Documentation shall make architectural meaning explicit, stable, traceable and reviewable without requiring readers to reconstruct intent from implementation accidents.

---

# 4. Mission

The mission of this standard is to ensure that KnowledgeOS architecture documentation remains:

* consistent;
* readable;
* navigable;
* precise;
* traceable;
* maintainable;
* reviewable;
* reproducible.

---

# 5. Documentation Philosophy

KnowledgeOS architecture documentation shall be:

* text-first;
* repository-controlled;
* Markdown-based;
* explicit;
* structured;
* self-contained within reasonable scope;
* cross-referenced;
* Version-aware;
* tool-independent where practical.

---

# 6. Markdown Standard

Markdown is the primary format for architecture documents.

Architecture documents shall normally use:

```text
.md
```

Diagram source shall normally use:

```text
.puml
```

---

# 7. Text-First Principle

Critical architectural information shall exist in text form.

Images and diagrams may support architectural understanding.

They shall not be the only representation of critical architectural contracts.

---

# 8. Source Control

All architecture documentation shall be stored in source control.

---

# 9. Repository Authority

The repository version of an approved document is the authoritative maintained artifact.

External copies are informational unless explicitly governed.

---

# 10. Directory Structure

Documentation shall follow the approved Architecture V3 directory structure.

The current top-level architecture structure is:

```text
00-Architecture/
├── 01-Foundation/
├── 02-Domain/
├── 03-Kernel/
├── 04-Platform/
├── 05-Integration/
├── 06-Execution/
├── 07-ArchitectureViews/
└── 08-Governance/
```

---

# 11. Directory Stability

Directory structure shall not be changed casually.

Structural changes require:

* identified need;
* impact analysis;
* reference migration;
* explicit approval.

---

# 12. Directory Naming

Architecture directories shall use:

* descriptive names;
* stable terminology;
* consistent capitalization;
* numeric prefixes only where ordering is architecturally meaningful.

---

# 13. Numeric Prefixes

Numeric prefixes define major documentation order.

Examples:

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

---

# 14. File Naming

Architecture files shall use stable descriptive names.

Examples:

```text
ArchitecturePrinciples.md
DomainModel.md
KernelArchitecture.md
ProviderModel.md
ExecutionModel.md
DocumentationStandards.md
```

---

# 15. File Name Stability

File names should remain stable after approval.

Renaming an approved file requires consideration of:

* incoming references;
* external references;
* history;
* tooling;
* migration.

---

# 16. Descriptive Naming

File names shall describe the architectural concept represented.

Generic names such as:

```text
Notes.md
Stuff.md
Ideas.md
NewDocument.md
Final.md
Final2.md
```

are prohibited for approved architecture.

---

# 17. README Purpose

A `README.md` acts as the rector document for a directory or architectural block.

---

# 18. README Responsibilities

A rector README should define:

* purpose;
* scope;
* architectural position;
* responsibilities;
* boundaries;
* relationships;
* invariants;
* prohibited behaviors;
* related documents.

---

# 19. README Authority

A README governs the conceptual scope of its directory.

Child documents provide specialized detail.

---

# 20. README and Child Documents

A child document shall not contradict the governing README.

If contradiction exists, it shall be resolved through Architecture Governance.

---

# 21. Document Metadata

Every approved architecture document shall begin with metadata.

The standard metadata block is:

```markdown
# Document Title

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** <Architectural Layer or Area>

**Document:** <Document Name>

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---
```

---

# 22. Required Metadata

Approved architecture documents shall contain:

* Project;
* Section;
* Document;
* Version;
* Status;
* Author.

`Layer` shall be included where applicable.

---

# 23. Project Metadata

The Project value shall be:

```text
KnowledgeOS
```

---

# 24. Section Metadata

Architecture documentation shall normally use:

```text
Architecture
```

as the Section value.

More specific classification may be added through `Layer`.

---

# 25. Layer Metadata

Layer identifies the architectural area governed by the document.

Examples include:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* Architecture Views;
* Governance.

Sub-area identification may be used where useful.

---

# 26. Document Metadata

The Document field shall use the canonical document name without unnecessary file-system syntax.

---

# 27. Version Metadata

Version identifies the architecture document Version.

For the current baseline:

```text
3.0
```

is the standard Architecture Version unless a document explicitly follows a more specific governed Version.

---

# 28. Status Metadata

Status shall use a governed lifecycle value.

Recommended values are:

* Draft;
* Proposed;
* Approved;
* Deprecated;
* Superseded;
* Archived.

---

# 29. Author Metadata

The standard author for collaboratively governed architecture is:

```text
KnowledgeOS Team
```

Even when one person currently performs several Governance roles, the architectural artifact remains attributed to the project architecture body.

---

# 30. Optional Metadata

Documents may additionally include:

* Owner;
* Review Date;
* Supersedes;
* Superseded By;
* Related ADR;
* Stability;
* Compatibility.

Optional metadata shall be used consistently when introduced.

---

# 31. Metadata Ordering

Metadata should use a stable order.

Recommended order:

1. Project;
2. Section;
3. Layer;
4. Document;
5. Version;
6. Status;
7. Author;
8. optional Governance metadata.

---

# 32. Metadata Separator

The metadata block shall normally end with:

```markdown
---
```

before the document body.

---

# 33. Document Title

Every document shall have one primary H1 title.

Example:

```markdown
# Architecture Principles
```

---

# 34. Single H1 Rule

A document shall normally contain one H1 heading.

Major sections shall use H2 headings.

---

# 35. Heading Hierarchy

Heading levels shall follow logical nesting.

Example:

```markdown
# Document Title

## Major Section

### Subsection

#### Detailed Subsection
```

---

# 36. Heading Skipping

Heading levels should not be skipped without reason.

Example to avoid:

```markdown
## Section

#### Subsection
```

---

# 37. Numbered Sections

Large normative architecture documents should use numbered major sections.

Example:

```markdown
# 1. Purpose

# 2. Scope

# 3. Architectural Position
```

Where the established document style uses H1 numbered sections after the document title, that style shall remain consistent within the Architecture V3 corpus.

---

# 38. Section Number Stability

Section numbers support navigation but are not permanent architectural identifiers unless explicitly declared.

---

# 39. Standard Document Sections

Not every document requires identical structure.

However, substantial normative documents should consider the following sections:

1. Purpose;
2. Scope;
3. Architectural Position;
4. Core Principle;
5. Mission;
6. Definitions;
7. Model;
8. Responsibilities;
9. Boundaries;
10. Lifecycle;
11. Failure semantics;
12. Security or privacy where relevant;
13. Testing Requirements;
14. Governance;
15. Invariants;
16. Prohibited Behaviors;
17. Related Documents;
18. Status.

---

# 40. Purpose Section

The Purpose section shall explain why the document exists.

It should answer:

> What architectural problem or concept does this document govern?

---

# 41. Scope Section

The Scope section shall define:

* what the document governs;
* what it does not govern.

---

# 42. Architectural Position

Where relevant, the document shall explain where its concept sits within the larger architecture.

---

# 43. Core Principle

Major architecture documents should state their central principle explicitly.

---

# 44. Definitions

Terms with specialized architectural meaning shall be defined before relying on them heavily.

---

# 45. Responsibilities

Documents governing components or subsystems shall define what they own.

---

# 46. Boundaries

Documents shall define what a component or subsystem does not own when boundary ambiguity is possible.

---

# 47. Lifecycle

Stateful architectural concepts should define their lifecycle.

---

# 48. Failure Semantics

Fallible architectural concepts should define how failures are represented and handled.

---

# 49. Testing Requirements

Normative contracts should define the categories of tests required to validate them where practical.

---

# 50. Governance Section

Documents affecting architectural evolution should identify what kinds of changes require review.

---

# 51. Invariants Section

Major normative documents should explicitly list invariants.

---

# 52. Prohibited Behaviors Section

Major normative documents should explicitly identify invalid architectural behavior where useful.

---

# 53. Related Documents Section

Documents shall reference related normative architecture where the relationship materially aids understanding or traceability.

---

# 54. Status Section

Major documents should conclude with a status statement summarizing their normative position.

---

# 55. Normative Language

KnowledgeOS uses controlled normative language.

---

# 56. Shall

`shall` expresses a mandatory architectural requirement.

Example:

> Durable Jobs shall use stable Job Identity.

---

# 57. Shall Not

`shall not` expresses a prohibited architectural behavior.

---

# 58. Should

`should` expresses a strong recommendation that may permit justified exceptions.

---

# 59. Should Not

`should not` expresses behavior normally discouraged but potentially acceptable with justification.

---

# 60. May

`may` expresses permitted optional behavior.

---

# 61. Can

`can` describes capability or possibility.

It shall not be used as a substitute for `may` when defining permission.

---

# 62. Must

`must` may be used for unavoidable logical or external constraints.

For architecture requirements, `shall` is preferred for consistency.

---

# 63. Normative Precision

Normative statements shall identify their subject clearly.

Avoid:

> It should be handled properly.

Prefer:

> The Runtime shall classify the failure before applying Retry Policy.

---

# 64. Ambiguous Language

Approved architecture should avoid vague phrases such as:

* somehow;
* probably;
* usually, without defined context;
* as needed, without criteria;
* appropriate, without ownership or policy;
* etc., where the omitted behavior is architecturally important.

---

# 65. Absolute Language

Words such as:

* always;
* never;
* every;
* exactly;

shall be used only when the architecture genuinely guarantees the statement.

---

# 66. Guarantee Discipline

Documentation shall not claim guarantees stronger than the architecture can provide.

Examples include:

* exactly-once execution;
* zero data loss;
* immediate synchronization;
* deterministic output;
* permanent availability.

Such guarantees require explicit architectural support.

---

# 67. Terminology

Architecture documents shall use canonical terminology defined in:

`ArchitectureVocabulary.md`

---

# 68. Canonical Terms

Canonical terms shall retain stable meaning across documents.

---

# 69. Synonyms

Unnecessary synonyms shall be avoided.

For example, if `Provider` is the canonical term, documents should not alternate arbitrarily between:

* Provider;
* adapter;
* backend;
* service connector;

unless those terms represent distinct concepts.

---

# 70. Acronyms

Acronyms shall be expanded on first meaningful use unless universally understood within the architecture.

Examples:

```text
Universal Document Model (UDM)
Document Presentation Model (DPM)
Architecture Decision Record (ADR)
```

---

# 71. Acronym Stability

Once introduced, the same acronym shall not be reused for another concept.

---

# 72. Capitalization

Named architectural concepts may use semantic capitalization.

Examples:

* Knowledge Object;
* Source of Truth;
* Engine;
* Provider;
* Plugin;
* Job;
* Workflow;
* Command;
* Query;
* Event.

Capitalization shall remain consistent.

---

# 73. Generic Use

When a word is used generically rather than as a named architectural concept, ordinary capitalization may be used.

---

# 74. Product Name

The product name shall be written:

```text
KnowledgeOS
```

---

# 75. Platform Names

Official platform names shall retain their standard spelling.

Examples:

* macOS;
* iPhone;
* iPad;
* Web.

---

# 76. Technical Names

External technical names shall use their official capitalization.

Examples:

* PlantUML;
* Graphviz;
* C4-PlantUML;
* OAuth;
* GraphQL;
* REST;
* MCP.

---

# 77. Identity Terms

Documents shall distinguish:

* identity;
* identifier;
* reference;
* address;
* path;
* key.

These terms shall not be treated as interchangeable without definition.

---

# 78. State Terms

Documents shall distinguish:

* state;
* status;
* lifecycle phase;
* execution result.

---

# 79. Storage Terms

Documents shall distinguish:

* Source of Truth;
* canonical storage;
* local replica;
* cache;
* temporary storage;
* derived Artifact.

---

# 80. Execution Terms

Documents shall distinguish:

* Command;
* Query;
* Event;
* Job;
* Workflow;
* Task;
* Attempt;
* Operation.

---

# 81. Integration Terms

Documents shall distinguish:

* Provider;
* external service;
* Public API;
* protocol;
* adapter;
* transport.

---

# 82. Examples

Examples exist to clarify architecture.

They are not automatically normative.

---

# 83. Example Labeling

Where ambiguity is possible, examples shall be identified as examples.

---

# 84. Example Accuracy

Examples shall not contradict normative rules.

---

# 85. Example Stability

Examples should avoid unnecessary implementation details that are likely to become stale.

---

# 86. Pseudocode

Pseudocode may illustrate behavior.

It shall not be mistaken for production implementation.

---

# 87. Code Blocks

Code blocks shall specify a language where useful.

Example:

````markdown
```text
Command
  │
  ▼
Handler
```
````

---

# 88. Text Diagrams

Simple conceptual flows may use fenced `text` blocks.

---

# 89. PlantUML Blocks

PlantUML source files shall use valid PlantUML syntax and comply with Architecture Views standards.

---

# 90. Code Block Purpose

A code block shall support understanding.

Large blocks that merely repeat prose should be avoided.

---

# 91. Diagrams

Architecture diagrams are governed by:

`../07-ArchitectureViews/README.md`

---

# 92. Diagram Standard

PlantUML is the standard diagram source format for Architecture V3.

---

# 93. C4 Diagrams

C4 diagrams shall use repository-controlled local C4-PlantUML dependencies.

---

# 94. External Includes

Approved diagrams shall not depend on mutable external URL includes.

---

# 95. Diagram Metadata

Approved diagrams shall include governed metadata.

---

# 96. Diagram Source

The `.puml` source is the maintainable architecture artifact.

Rendered output is derived.

---

# 97. Diagram References

Documents may reference diagrams through stable relative paths.

---

# 98. Diagram Duplication

The same architectural information should not be recreated in several diagrams without distinct purpose.

---

# 99. Tables

Tables may be used for structured comparison.

---

# 100. Table Suitability

Tables are appropriate for:

* decision comparison;
* compatibility matrices;
* state summaries;
* responsibility mapping;
* requirement mapping.

---

# 101. Large Tables

Large tables shall not replace prose when relationships require explanation.

---

# 102. Lists

Lists should be used for:

* bounded sets;
* requirements;
* examples;
* responsibilities;
* invariants.

---

# 103. List Consistency

List items should use consistent grammatical structure.

---

# 104. Ordered Lists

Ordered lists should be used when sequence or priority matters.

---

# 105. Unordered Lists

Unordered lists should be used when order is not semantically significant.

---

# 106. References

Architecture documents shall use relative repository paths where practical.

---

# 107. Reference Example

Example:

```markdown
* `../06-Execution/Runtime/ExecutionModel.md`
```

---

# 108. Reference Validity

Referenced paths shall exist or be explicitly identified as planned future artifacts.

---

# 109. Planned Reference

A planned but nonexistent document shall not be referenced as if it already exists.

---

# 110. Cross-Reference Purpose

References should support:

* traceability;
* navigation;
* dependency understanding;
* decision history.

---

# 111. Reference Overload

Documents should not include exhaustive references that provide no practical architectural value.

---

# 112. Related Documents Ordering

Related Documents should normally be grouped by architecture block.

Example:

```markdown
## Foundation

* `../01-Foundation/ArchitecturePrinciples.md`

## Execution

* `../06-Execution/Runtime/ExecutionModel.md`
```

---

# 113. Path Accuracy

Relative paths shall be calculated from the location of the document containing the reference.

---

# 114. Broken Link Policy

Broken internal references are documentation defects.

---

# 115. Versioning

Architecture documents shall identify their Version.

---

# 116. Architecture Version

The Architecture Version represents the architectural baseline.

Current baseline:

```text
3.0
```

---

# 117. Document Revision

Minor editorial updates do not necessarily require a new Architecture major Version.

---

# 118. Semantic Revision

Changes to architectural meaning require governed Version consideration.

---

# 119. Version Independence

Document Version, application Version and data schema Version are distinct concepts.

---

# 120. Major Architecture Version

A major Architecture Version represents broad or incompatible architectural evolution.

---

# 121. Minor Architecture Version

A minor Architecture Version may represent compatible architectural extension.

---

# 122. Patch Revision

A patch revision may represent clarification or non-semantic correction.

---

# 123. Version Honesty

Version numbers shall reflect semantic change rather than editing activity alone.

---

# 124. Status Lifecycle

Documents follow a governed status lifecycle.

```text
Draft
  │
  ▼
Proposed
  │
  ▼
Approved
  │
  ├── Deprecated
  ├── Superseded
  └── Archived
```

---

# 125. Draft

Draft documents are incomplete or under active development.

---

# 126. Proposed

Proposed documents are ready for review.

---

# 127. Approved

Approved documents are normative within their defined scope.

---

# 128. Deprecated

Deprecated documents remain temporarily relevant but should not guide new architecture.

---

# 129. Superseded

Superseded documents have been replaced by newer approved architecture.

---

# 130. Archived

Archived documents are retained for historical reference.

---

# 131. Status Transition

Status changes shall be deliberate and traceable.

---

# 132. Approval

Approval means the document has passed the required architectural review.

---

# 133. Approval Is Not Completion by Length

A document is not Approved because it is long.

It is Approved because its architectural scope is sufficiently complete and consistent.

---

# 134. Document Ownership

Every approved document shall have an accountable owner or Governance role.

---

# 135. Ownership Responsibilities

The owner is responsible for:

* accuracy;
* maintenance;
* review;
* references;
* lifecycle.

---

# 136. Review

Documents shall be reviewed before approval.

---

# 137. Review Dimensions

Review shall consider:

* correctness;
* completeness;
* consistency;
* terminology;
* scope;
* references;
* feasibility;
* contradiction risk.

---

# 138. Review Evidence

Major reviews should be recorded in Governance artifacts or source-control history.

---

# 139. Review After Change

Significant semantic changes require renewed review.

---

# 140. Full Replacement During Consolidation

During Architecture V3 consolidation, complete replacement documents are preferred over fragmented patches for substantial changes.

---

# 141. Full Replacement Benefits

Complete replacement reduces:

* missed edits;
* conflicting sections;
* accidental omissions;
* unclear final state.

---

# 142. Patch Suitability

Targeted patches are appropriate when:

* the change is small;
* the target is unambiguous;
* semantic consistency can be preserved.

---

# 143. Document Length

There is no fixed required document length.

---

# 144. Length Principle

A document shall be as long as necessary to define its scope clearly and no longer merely to appear comprehensive.

---

# 145. Duplication

Normative content should have one primary home.

---

# 146. Intentional Repetition

Critical invariants may be repeated across documents when local visibility materially improves safety.

---

# 147. Repetition Consistency

Repeated normative statements shall remain semantically consistent.

---

# 148. Canonical Definition

Where a concept has one primary defining document, other documents should reference it rather than redefine it independently.

---

# 149. Cross-Cutting Concepts

Cross-cutting concepts may appear in multiple documents.

Examples include:

* identity;
* Versioning;
* Offline First;
* determinism;
* idempotency;
* observability;
* privacy.

Their local treatment shall align with the canonical definition.

---

# 150. Contradictions

Known contradictions between approved documents are prohibited.

---

# 151. Contradiction Handling

Detected contradictions shall enter Architecture Governance.

They shall not be ignored or silently normalized.

---

# 152. Historical Statements

Historical information shall be clearly distinguished from current normative architecture.

---

# 153. Future Architecture

Future possibilities shall not be written as current approved architecture.

---

# 154. Future Work Labeling

Future work shall be identified through terms such as:

* Planned;
* Proposed;
* Deferred;
* Backlog.

---

# 155. Speculative Content

Speculative architecture shall not appear inside Approved normative sections without explicit labeling.

---

# 156. TODO Markers

Approved documents should not contain unresolved TODO markers.

---

# 157. Placeholder Content

Placeholders such as:

```text
TBD
TODO
FIXME
Coming later
```

shall be resolved before Architecture Freeze unless explicitly tracked as non-blocking Governance items.

---

# 158. Empty Directories

An empty directory does not prove architecture is complete.

Its intended purpose shall be:

* documented;
* intentionally deferred;
* or removed through approved structural Governance.

---

# 159. Empty Documents

Empty or placeholder documents shall not be marked Approved.

---

# 160. Document Completeness

Completeness is evaluated against the declared Scope.

---

# 161. Out-of-Scope Discipline

A document should not expand indefinitely into adjacent architectural areas.

---

# 162. Boundary References

When another document owns a concept, the current document should:

* state the boundary;
* reference the owning document.

---

# 163. Architecture Layer Boundaries

Documentation shall preserve the distinction between:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* Architecture Views;
* Governance.

---

# 164. Foundation Documentation

Foundation defines:

* Product Vision;
* principles;
* constraints;
* architecture model;
* quality attributes.

---

# 165. Domain Documentation

Domain defines:

* canonical knowledge concepts;
* UDM;
* DPM;
* identity;
* Knowledge Graph;
* lifecycle;
* Knowledge Object semantics.

---

# 166. Kernel Documentation

Kernel defines foundational application infrastructure and coordination primitives.

---

# 167. Platform Documentation

Platform defines Engine-level capabilities and responsibilities.

---

# 168. Integration Documentation

Integration defines boundaries with:

* Providers;
* Public APIs;
* Plugins;
* external services;
* storage;
* synchronization;
* data exchange.

---

# 169. Execution Documentation

Execution defines cross-cutting runtime semantics including:

* concurrency;
* messaging;
* performance;
* reliability;
* Runtime.

---

# 170. Architecture Views Documentation

Architecture Views represent architecture through:

* ADR;
* C4;
* UML.

---

# 171. Governance Documentation

Governance controls architectural evolution.

---

# 172. Architecture Decision Records

ADRs shall follow a stable structure.

---

# 173. ADR Recommended Structure

An ADR should include:

1. Title;
2. Metadata;
3. Status;
4. Context;
5. Decision;
6. Alternatives;
7. Consequences;
8. Migration impact;
9. Related documents;
10. Supersession information where applicable.

---

# 174. ADR Identity

Every ADR shall have stable identity.

Example:

```text
ADR-003
```

---

# 175. ADR File Naming

Recommended format:

```text
ADR-003-Offline-First.md
```

---

# 176. ADR History

Accepted ADR history shall not be rewritten to hide superseded decisions.

---

# 177. ADR Supersession

A new decision shall supersede the previous ADR explicitly where applicable.

---

# 178. Architecture View Documentation

Architecture Views shall include enough textual context to explain:

* purpose;
* scope;
* abstraction;
* related normative sources.

---

# 179. Diagram-Only Documentation

A directory containing diagrams should have a rector README when the diagram set becomes substantial.

---

# 180. Generated Documentation

Generated documentation shall identify its source where practical.

---

# 181. Generated Artifact Editing

Generated artifacts shall not be manually edited when they can be regenerated from source.

---

# 182. Generated Source of Truth

The maintainable source remains authoritative over generated output.

---

# 183. Documentation Tooling

Documentation tooling may validate:

* Markdown structure;
* metadata;
* links;
* PlantUML syntax;
* duplicate identifiers;
* terminology.

---

# 184. Tooling Is Supportive

Tooling assists Governance.

It does not determine architectural correctness automatically.

---

# 185. Markdown Validation

Markdown should remain parseable by standard Markdown tooling.

---

# 186. Portable Markdown

Architecture documentation should avoid unnecessary renderer-specific extensions.

---

# 187. HTML in Markdown

Embedded HTML should be avoided unless Markdown cannot express the required structure adequately.

---

# 188. Renderer Independence

Critical meaning shall not depend on one proprietary Markdown renderer.

---

# 189. Character Encoding

Architecture text files shall use UTF-8.

---

# 190. Line Endings

Repository line-ending policy shall remain consistent.

---

# 191. Language

Architecture V3 normative documents are currently written primarily in English.

---

# 192. Language Consistency

One normative document should normally use one primary language.

---

# 193. Translation

Translations may be provided for accessibility.

The authoritative language Version shall be identified if multiple normative translations exist.

---

# 194. Translation Drift

Multiple normative translations shall not evolve independently.

---

# 195. Writing Style

Architecture writing shall be:

* direct;
* precise;
* declarative;
* technically neutral;
* free from unnecessary rhetoric.

---

# 196. Sentence Structure

Short sentences are preferred when they improve normative clarity.

---

# 197. Paragraph Structure

Paragraphs should express one coherent architectural idea.

---

# 198. Excessive Prose

Long prose shall not obscure requirements that could be expressed clearly as:

* rules;
* invariants;
* tables;
* structured lists.

---

# 199. Excessive Fragmentation

Documentation shall not be split into many tiny files when one coherent document would be easier to understand and govern.

---

# 200. Document Granularity

A separate document is justified when a concept has:

* independent scope;
* substantial semantics;
* independent lifecycle;
* significant references;
* dedicated ownership.

---

# 201. Architecture Precision

Documentation shall distinguish between:

* current architecture;
* desired future architecture;
* examples;
* implementation options;
* mandatory requirements.

---

# 202. Technology Neutrality

Architecture should remain technology-neutral where implementation technology is not architecturally significant.

---

# 203. Technology Specificity

Technology may be named when it creates:

* constraints;
* compatibility requirements;
* architectural consequences;
* reproducibility requirements.

---

# 204. Implementation Detail

Low-level implementation detail should remain outside architecture unless it affects architectural behavior.

---

# 205. Interface Examples

Interface examples may illustrate contracts.

They shall not accidentally become the only specification of the contract.

---

# 206. Data Examples

Data examples shall avoid unnecessary sensitive or personally identifiable information.

---

# 207. Security Documentation

Security-sensitive architecture shall not expose:

* real credentials;
* secrets;
* tokens;
* private keys;
* production connection strings.

---

# 208. Placeholder Secrets

Examples shall use clearly fictional placeholders.

---

# 209. Privacy Documentation

Examples should minimize private user content.

---

# 210. External References

External references may support architecture.

---

# 211. External Reference Stability

Critical architecture shall not depend exclusively on mutable external documentation.

---

# 212. External Source Recording

When an external specification materially constrains architecture, the relevant:

* standard;
* Version;
* requirement;

should be identified.

---

# 213. Link Rot

Critical external information should be summarized sufficiently to preserve architectural meaning if the external link becomes unavailable.

---

# 214. Date Usage

Dates shall use an unambiguous format.

Recommended:

```text
YYYY-MM-DD
```

---

# 215. Time-Sensitive Statements

Time-sensitive assumptions shall include:

* date;
* Version;
* review condition;

where relevant.

---

# 216. Stable Identifiers

Stable architectural elements should use stable identifiers where identity matters.

Examples include:

* ADR IDs;
* Diagram IDs;
* Job Type IDs;
* Event Type IDs;
* contract Versions.

---

# 217. Identifier Immutability

A stable identifier shall not be reused for a different concept.

---

# 218. Identifier Renaming

Display names may evolve.

Stable identifiers remain unchanged unless governed migration exists.

---

# 219. Validation

Architecture documentation shall be validated before approval.

---

# 220. Validation Categories

Validation includes:

* structural validation;
* metadata validation;
* reference validation;
* terminology validation;
* syntax validation;
* architectural review.

---

# 221. Structural Validation

Structural validation confirms the document exists in the correct approved location.

---

# 222. Metadata Validation

Metadata validation confirms required fields are present and valid.

---

# 223. Reference Validation

Reference validation confirms internal references resolve correctly.

---

# 224. Terminology Validation

Terminology validation confirms canonical concepts are used consistently.

---

# 225. Syntax Validation

Syntax validation applies to:

* Markdown;
* PlantUML;
* structured examples.

---

# 226. Architectural Review

Architectural review confirms semantic correctness.

It cannot be replaced by syntax validation.

---

# 227. Definition of Done

An architecture document is complete when:

* its Purpose is clear;
* its Scope is bounded;
* terminology is canonical;
* responsibilities are explicit where applicable;
* boundaries are explicit where applicable;
* invariants are defined where required;
* prohibited behaviors are defined where useful;
* references are valid;
* metadata is complete;
* contradictions are resolved;
* review is complete;
* status is correct.

---

# 228. Architecture Freeze Requirements

Before Architecture V3 Freeze:

* required documents shall exist;
* Approved documents shall not contain unresolved placeholders;
* internal references shall be valid;
* critical terminology conflicts shall be resolved;
* blocking contradictions shall be resolved;
* required ADRs shall be aligned;
* Architecture Views shall represent current architecture;
* Governance review shall be complete.

---

# 229. Post-Freeze Documentation Changes

After Freeze, documentation changes shall be classified as:

* Editorial;
* Clarification;
* Compatible Extension;
* Architectural Modification;
* Breaking Change.

---

# 230. Editorial Post-Freeze Change

Editorial corrections may be applied without reopening the architecture decision.

---

# 231. Semantic Post-Freeze Change

Semantic changes require Governance according to their impact.

---

# 232. Documentation Debt

Known documentation defects shall be tracked rather than silently ignored.

---

# 233. Documentation Debt Examples

Documentation debt includes:

* broken references;
* stale diagrams;
* inconsistent terminology;
* missing migration notes;
* duplicated definitions;
* obsolete examples.

---

# 234. Documentation Debt Priority

Documentation debt affecting architectural correctness has higher priority than cosmetic documentation debt.

---

# 235. Documentation Review Cadence

Architecture documents should be reviewed:

* after significant architectural changes;
* before Architecture Freeze;
* during major implementation conformance reviews;
* before major architecture Version transitions.

---

# 236. Documentation Preservation

Historical architecture shall be preserved where required for:

* ADR traceability;
* migration;
* audit;
* understanding superseded decisions.

---

# 237. Active Versus Historical Documentation

Active normative documentation shall be distinguishable from historical documentation.

---

# 238. Archive Separation

Archived documentation shall not appear indistinguishably beside active normative documents.

---

# 239. Governance

Architectural review is required for changes affecting:

* documentation authority;
* required metadata;
* normative language;
* architecture directory structure;
* document lifecycle;
* ADR standards;
* diagram standards;
* Versioning rules;
* canonical terminology governance.

---

# 240. Documentation Standards Invariants

The following invariants apply.

* Architecture documentation is part of the architecture.
* Markdown is the primary architecture documentation format.
* PlantUML is the primary architecture diagram source format.
* Critical architectural meaning exists in text form.
* All architecture documentation is source-controlled.
* The approved V3 directory structure remains governed.
* Approved documents contain required metadata.
* Approved documents have explicit Version and status.
* One document normally contains one H1 title.
* Heading hierarchy remains logical.
* Normative language is used deliberately.
* `shall` represents mandatory architectural requirements.
* Canonical terminology remains consistent.
* Acronyms are defined and remain stable.
* Examples do not override normative rules.
* Internal references use valid repository paths.
* Planned nonexistent documents are not represented as existing artifacts.
* Architecture Versions reflect semantic change.
* Draft documents are not treated as normative.
* Approved documents are reviewed.
* Significant semantic changes receive renewed review.
* Accepted ADR history is preserved.
* Generated artifacts remain traceable to maintainable source.
* Architecture diagrams remain subordinate to normative documentation.
* Critical architecture does not depend exclusively on mutable external references.
* Stable identifiers are not reused for different concepts.
* Syntax validation does not replace architectural review.
* Blocking documentation defects are resolved before Architecture Freeze.

---

# 241. Prohibited Behaviors

KnowledgeOS shall never:

* place critical architectural truth only inside an image;
* treat external document copies as more authoritative than the governed repository;
* create approved files with meaningless names;
* change the V3 directory structure casually;
* mark incomplete placeholder documents Approved;
* use Draft documents as normative architecture;
* use `can`, `may`, `should` and `shall` interchangeably;
* claim guarantees the architecture cannot provide;
* redefine canonical terms silently;
* use one acronym for multiple architectural concepts;
* use examples that contradict normative rules;
* reference nonexistent planned files as though they already exist;
* knowingly preserve broken internal references in a frozen baseline;
* change accepted ADR history to hide previous decisions;
* manually edit generated artifacts when maintainable source exists;
* expose credentials or secrets in architecture documentation;
* let multiple normative translations evolve independently;
* treat document length as evidence of completeness;
* duplicate normative definitions unnecessarily;
* allow implementation detail to obscure architectural contracts;
* treat successful Markdown or PlantUML parsing as proof of architectural correctness;
* freeze Architecture V3 with unresolved blocking documentation defects.

---

# 242. Related Documents

## Foundation

* `../01-Foundation/ArchitectureConstraints.md`
* `../01-Foundation/ArchitectureModel.md`
* `../01-Foundation/ArchitecturePrinciples.md`
* `../01-Foundation/ProductVision.md`
* `../01-Foundation/QualityAttributes.md`

## Domain

* `../02-Domain/README.md`
* `../02-Domain/DomainModel.md`
* `../02-Domain/EngineResponsibilities.md`

## Kernel

* `../03-Kernel/KernelArchitecture.md`

## Platform

* `../04-Platform/README.md`

## Integration

* `../05-Integration/README.md`

## Execution

* `../06-Execution/README.md`

## Architecture Views

* `../07-ArchitectureViews/README.md`

## Governance

* `README.md`
* `ArchitectureBacklog.md`
* `ArchitectureDecisionMatrix.md`
* `ArchitectureReview-v3.0.md`
* `ArchitectureV3MigrationPlan.md`
* `ArchitectureVocabulary.md`

---

# 243. Status

**Approved**

This document defines the documentation standards for KnowledgeOS Architecture Version 3.

Architecture documentation is treated as part of the architecture rather than as secondary commentary.

Markdown is the primary format for normative architectural documentation.

PlantUML is the primary source format for architecture diagrams.

Critical architectural meaning remains available in text form.

All architecture documentation is source-controlled.

The approved V3 directory structure remains stable and governed.

Approved documents contain explicit metadata, Version and status.

README documents act as rector documents for their architectural scope.

Child documents provide specialized detail without contradicting their governing README.

Normative language is controlled.

`shall` expresses mandatory requirements.

`should` expresses strong recommendations.

`may` expresses permitted optional behavior.

Architectural guarantees are documented only when the architecture can actually provide them.

Canonical terminology is governed through Architecture Vocabulary.

Stable identifiers are not reused for different concepts.

Examples clarify architecture but do not override normative rules.

Internal references use valid repository-relative paths.

Planned artifacts are not represented as existing files.

Accepted ADR history is preserved.

Architecture diagrams remain subordinate to normative architecture.

Generated outputs remain traceable to maintainable source.

Syntax validation supports but does not replace architectural review.

Documents are considered complete according to their declared scope rather than their length.

Significant semantic changes require renewed Governance and review.

Blocking contradictions, broken references, unresolved placeholders and critical terminology conflicts are resolved before Architecture V3 Freeze.

KnowledgeOS therefore uses a common documentation standard to preserve architectural meaning, reduce ambiguity, prevent documentation drift and provide a stable, reviewable foundation for implementation.
