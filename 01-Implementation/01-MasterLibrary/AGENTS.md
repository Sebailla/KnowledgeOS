
# AGENTS.md

**Project:** KnowledgeOS
**Area:** Master Library
**Path:** `01-Implementation/01-MasterLibrary/`
**Document:** Master Library Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Project Owner

---

# 1. Purpose

This document defines the implementation rules for every human or AI agent working inside:

```text
01-Implementation/
└── 01-MasterLibrary/
```

The Master Library is the authoritative implementation of the KnowledgeOS knowledge repository.

Its responsibility is to preserve, organize, protect and expose the user's knowledge while guaranteeing integrity, consistency and recoverability.

Every implementation inside this module shall preserve the architectural decisions defined in:

- Product Vision
- Architecture V3
- Architecture Decision Records
- Architecture Amendments
- Implementation Governance

The Master Library shall never redefine those decisions.

---

# 2. Scope

This guide governs every document, implementation artifact and source code contained inside:

```text
01-Implementation/01-MasterLibrary/
```

including, but not limited to:

- Requirements
- Architecture
- Domain implementation
- Catalog
- Storage
- Metadata
- Assets
- Synchronization
- Search
- Import
- Export
- Background Jobs
- Recovery
- Backup
- Server
- Client
- Operations
- Testing
- Documentation

This document also governs every future subdirectory created under this module unless a more specific AGENTS.md exists.

---

# 3. Inheritance

This document inherits every rule defined in:

```text
Repository
    ↓
00-Architecture/AGENTS.md
    ↓
01-Implementation/AGENTS.md
```

Those documents remain authoritative.

This document only introduces additional rules specific to the Master Library.

Whenever a conflict exists, the highest-level document prevails unless this document defines a stricter specialization for this module.

---

# 4. Module Responsibilities

The Master Library owns the implementation of:

- Knowledge Object persistence
- Persistent identities
- Library catalog
- Metadata
- Provenance
- Assets
- Version history
- Library consistency
- Search indexes
- Synchronization metadata
- Import registration
- Export source generation
- Integrity validation
- Backup
- Restore
- Recovery

The Master Library does **not** own:

- UI
- Desktop workflows
- Window management
- AI providers
- Rendering
- Plugin execution
- Authentication UI
- Platform-specific behavior

Those responsibilities belong to their respective modules.

---

# 5. Module Authority

Within the implementation layer, the Master Library is the only authoritative owner of persistent knowledge.

Every other module consumes knowledge through approved contracts.

No other module may become the owner of:

- Knowledge Objects
- Metadata
- Provenance
- Persistent identity
- Library versions
- Synchronization checkpoints
- Catalog state

The Master Library is the implementation authority for those concepts.

---

# 6. Mandatory Reading Order

Before modifying any file inside this module, an agent shall review:

1. Repository AGENTS
2. Architecture AGENTS
3. Implementation AGENTS
4. This document
5. Product Vision
6. Architecture Principles
7. ADR-004 Library Source of Truth
8. ADR-008 Storage Architecture
9. ADR-009 Synchronization Strategy
10. ADR-010 Document Identity
11. ADR-013 Master Library / Local Library
12. Master Library README
13. The affected implementation documents

Implementation shall never begin from isolated assumptions.

Every change shall be traceable to approved architecture.

---

# 7. Master Library Principles

Every implementation inside this module shall preserve the following principles.

## Source of Truth

The Master Library is the authoritative knowledge repository.

## Persistent Identity

Every Knowledge Object has one stable identity.

## Metadata Integrity

Metadata shall always describe the authoritative object.

## Provenance

Every object shall preserve its origin.

## Recoverability

No operation shall compromise recovery.

## Offline Compatibility

The Master Library shall support Offline First synchronization.

## Determinism

Equivalent operations shall produce equivalent persistent state whenever possible.

## Traceability

Every persistent modification shall remain traceable.

## Extensibility

Future extensions shall not compromise existing identities or stored knowledge.

---

# 8. Source of Truth

The Master Library is the Source of Truth for KnowledgeOS.

It is implemented as the combination of:

- PostgreSQL catalog
- Authoritative files
- Assets
- Metadata
- Persistent identities
- Version history
- Integrity information

Neither PostgreSQL nor the filesystem alone represents the complete library.

Both together constitute the authoritative repository.

---



# 9. Knowledge Object Authority

The Master Library is the authoritative owner of every Knowledge Object stored by KnowledgeOS.

A Knowledge Object represents the canonical implementation of an element defined by the Domain Model.

The Master Library is responsible for preserving:

- persistent identity;
- metadata;
- provenance;
- relationships;
- versions;
- assets;
- synchronization state;
- integrity information.

Knowledge Objects shall never be duplicated as independent authoritative entities.

Derived copies may exist inside Local Libraries.

Only the Master Library owns the canonical representation.

---

# 10. Identity Rules

Identity is immutable.

Every Knowledge Object shall possess one globally unique persistent identifier.

That identifier shall survive:

- renames;
- moves;
- storage migration;
- synchronization;
- export;
- import;
- backup;
- restore;
- version upgrades.

Identifiers shall never depend on:

- filesystem paths;
- filenames;
- database row identifiers;
- synchronization sessions;
- storage providers;
- operating systems.

Identity shall be assigned exactly once.

Identity shall never be recycled.

Deleted identities shall remain reserved.

---

# 11. PostgreSQL Catalog

The PostgreSQL catalog stores the structured representation of the Master Library.

Its responsibilities include:

- Knowledge Object registry;
- metadata;
- identities;
- provenance;
- relationships;
- version history;
- synchronization metadata;
- indexes;
- integrity metadata;
- operational metadata.

The PostgreSQL catalog is authoritative only for the information assigned to it.

It does not own binary assets.

It does not own original files.

It does not replace the complete Master Library.

---

# 12. Authoritative Files

The Master Library preserves every authoritative file independently from the catalog.

Authoritative files represent the immutable source material associated with Knowledge Objects.

Examples include:

- PDF documents;
- EPUB books;
- images;
- audio;
- video;
- office documents;
- archives;
- web captures;
- datasets.

The Master Library shall never assume that structured metadata is sufficient to reconstruct the original knowledge source.

Original files remain part of the authoritative repository.

---

# 13. Assets

Assets are binary resources associated with Knowledge Objects.

Examples include:

- thumbnails;
- previews;
- OCR output;
- extracted images;
- generated illustrations;
- attachments;
- auxiliary resources.

Assets may be regenerated when their generation process is deterministic.

Original assets shall be distinguished from derived assets.

Derived assets shall never replace original user data.

Every asset shall preserve:

- ownership;
- identity;
- provenance;
- integrity;
- version compatibility.

---

# 14. Metadata

Metadata describes Knowledge Objects.

Metadata shall never replace the underlying knowledge.

Metadata may include:

- title;
- authors;
- publication information;
- creation date;
- acquisition date;
- language;
- identifiers;
- categories;
- tags;
- reading status;
- ratings;
- custom properties.

Metadata shall be:

- normalized;
- validated;
- versioned when required;
- traceable;
- extensible.

Metadata modifications shall preserve previous provenance whenever possible.

---

# 15. Provenance

Every Knowledge Object shall preserve its origin.

Provenance may include:

- acquisition source;
- original filename;
- original URI;
- acquisition method;
- import pipeline;
- OCR process;
- synchronization source;
- migration history;
- user actions.

Provenance shall remain immutable whenever it describes historical facts.

New provenance information shall extend existing history.

It shall not overwrite previous evidence.

---

# 16. Versioning

Every Knowledge Object shall support version-aware management.

Versioning shall distinguish between:

- object identity;
- object revisions;
- metadata revisions;
- annotation revisions;
- synchronization revisions;
- migration revisions.

Version identifiers shall remain stable.

Historical versions shall remain traceable.

The Master Library shall define explicit retention policies for obsolete revisions.

Version history shall support:

- auditing;
- synchronization;
- recovery;
- migration;
- conflict resolution.

Version identifiers shall never be reused.

---



# 17. Storage Rules

The Master Library storage implementation shall preserve the architectural storage model defined by KnowledgeOS.

Storage is divided into clearly separated responsibilities.

The implementation shall distinguish between:

- structured catalog data;
- authoritative files;
- derived assets;
- search indexes;
- temporary working data;
- caches;
- backup artifacts.

Each category shall have an explicit owner.

No storage area shall assume responsibilities belonging to another.

---

# 18. Storage Layout

The physical storage layout shall remain deterministic.

The implementation shall support predictable organization while remaining independent from user-facing identities.

Storage organization shall facilitate:

- backup;
- restore;
- migration;
- validation;
- integrity verification;
- scalability;
- operational maintenance.

Internal directory organization may evolve.

Persistent identifiers shall not.

---

# 19. Catalog Consistency

The PostgreSQL catalog shall always remain consistent with the authoritative repository.

Every catalog entry shall reference valid authoritative content.

The implementation shall detect:

- missing files;
- duplicated identities;
- orphaned metadata;
- orphaned assets;
- invalid references;
- broken relationships.

Consistency validation shall be executable without modifying repository contents.

---

# 20. File Consistency

Every authoritative file shall satisfy the following conditions:

- exactly one persistent identity;
- one owning Knowledge Object;
- verified integrity;
- valid metadata association;
- valid provenance.

The implementation shall never silently discard an authoritative file.

Unexpected inconsistencies shall be reported explicitly.

---

# 21. Transaction Boundaries

Every persistent operation shall define its transaction boundary.

A transaction shall clearly identify:

- modified entities;
- modified files;
- modified metadata;
- emitted events;
- rollback behavior;
- completion criteria.

Implementation shall distinguish between:

- database transactions;
- filesystem operations;
- long-running workflows;
- synchronization operations.

No assumption shall be made that these complete atomically.

---

# 22. Consistency Rules

The Master Library shall preserve consistency across every authoritative representation.

Consistency shall exist between:

- catalog and files;
- metadata and assets;
- object identities and references;
- relationships;
- synchronization metadata;
- search indexes.

Whenever temporary inconsistency is unavoidable, the implementation shall define:

- detection;
- recovery;
- timeout;
- reconciliation strategy.

---

# 23. Synchronization Ownership

The Master Library owns the authoritative synchronization state.

Synchronization metadata includes:

- synchronization checkpoints;
- object versions;
- synchronization history;
- pending operations;
- conflict information;
- reconciliation metadata.

The synchronization engine consumes this information.

It does not own it.

---

# 24. Local Libraries

Local Libraries are synchronized working copies of the Master Library.

A Local Library may contain:

- complete objects;
- partial objects;
- cached assets;
- local indexes;
- pending modifications;
- synchronization queues.

A Local Library shall never become the Source of Truth.

Local modifications remain provisional until synchronized with the Master Library.

---

# 25. Conflict Resolution

Conflicts shall never be resolved implicitly.

The implementation shall preserve sufficient information to determine:

- conflicting objects;
- conflicting versions;
- conflicting metadata;
- conflicting annotations;
- conflict origin;
- conflict timestamp.

Conflict resolution policies shall be deterministic.

Whenever user intervention is required, the original conflicting state shall remain recoverable.

---

# 26. Checksums

Every authoritative binary object shall possess an integrity verification mechanism.

Checksums shall support:

- corruption detection;
- duplicate detection;
- migration validation;
- synchronization validation;
- backup verification.

Checksum algorithms may evolve over time.

Historical checksum values shall remain valid for the version in which they were generated.

Checksum regeneration shall not invalidate historical integrity records.

---

# 27. Backup

Backup procedures shall preserve the complete authoritative state of the Master Library.

A valid backup includes:

- PostgreSQL catalog;
- authoritative files;
- assets required for recovery;
- integrity metadata;
- version metadata;
- synchronization metadata.

Partial backups shall be explicitly identified as partial.

They shall never be represented as complete repository backups.

---

# 28. Restore

Restore operations shall reconstruct the Master Library without altering its identity.

Restore shall preserve:

- Knowledge Object identifiers;
- relationships;
- provenance;
- versions;
- metadata;
- synchronization history.

After restoration, integrity validation shall be executed before the repository becomes operational.

---

# 29. Recovery

Recovery procedures shall assume unexpected interruption.

Examples include:

- power loss;
- process termination;
- storage failure;
- interrupted synchronization;
- incomplete transactions;
- migration interruption.

Recovery shall prioritize:

1. preservation of user knowledge;
2. preservation of identity;
3. repository consistency;
4. operational continuity.

No automatic recovery procedure shall discard authoritative information merely to restore operational state.

---

# 30. Recovery Validation

Every recovery operation shall execute validation before declaring success.

Validation shall verify:

- catalog consistency;
- file availability;
- object identities;
- relationship integrity;
- metadata integrity;
- synchronization metadata;
- version history;
- checksum verification.

Recovery is complete only when the Master Library satisfies all consistency rules defined by this module.

---



# 31. Import

The Import subsystem is responsible for incorporating external knowledge into the Master Library.

Import shall never bypass the rules defined by this module.

Every imported resource shall undergo a controlled ingestion pipeline.

The pipeline shall include, when applicable:

- source validation;
- integrity verification;
- duplicate detection;
- identity assignment;
- metadata extraction;
- provenance registration;
- asset generation;
- indexing;
- persistence.

Import shall be repeatable.

Import shall never compromise repository consistency.

---

# 32. Import Principles

Import operations shall preserve:

- original files;
- acquisition metadata;
- timestamps when available;
- original identifiers;
- provenance.

Import shall never modify original evidence unless explicitly requested by the user.

Imported information shall remain distinguishable from generated information.

Generated metadata shall always indicate its origin.

---

# 33. Duplicate Detection

Before creating a new Knowledge Object the implementation shall evaluate whether the resource already exists.

Duplicate detection may consider:

- persistent identifiers;
- checksums;
- embedded document identifiers;
- metadata similarity;
- file signatures;
- semantic similarity.

Duplicate detection policies shall remain configurable.

No automatic duplicate removal shall permanently delete authoritative information.

---

# 34. Export

Export produces external representations of Knowledge Objects.

Export never becomes authoritative.

The Master Library remains the Source of Truth after every export operation.

Supported export formats may include:

- Markdown
- PDF
- HTML
- EPUB
- JSON
- XML
- Plain Text
- Package formats

Future formats shall preserve identity whenever technically possible.

---

# 35. Export Integrity

Export shall preserve as much information as supported by the destination format.

Export shall clearly distinguish between:

- original information;
- reconstructed information;
- generated information;
- omitted information.

Export shall never silently discard information.

Whenever loss is unavoidable the implementation shall document the limitations.

---

# 36. Search Indexes

Search indexes are derived data.

They are not authoritative.

Indexes may be rebuilt at any time from the Master Library.

Index corruption shall never compromise repository integrity.

The implementation shall support rebuilding indexes without modifying authoritative knowledge.

---

# 37. AI Metadata

Artificial Intelligence may enrich Knowledge Objects.

AI-generated information is supplementary.

It never replaces authoritative metadata.

Examples include:

- summaries;
- embeddings;
- classifications;
- keywords;
- semantic tags;
- recommendations;
- entity extraction;
- topic detection.

Every AI-generated element shall record:

- generation timestamp;
- model;
- provider;
- version;
- confidence when available.

---

# 38. Background Jobs

Background Jobs execute asynchronous operations on behalf of the Master Library.

Examples include:

- OCR;
- thumbnail generation;
- embedding generation;
- index rebuilding;
- integrity verification;
- migration;
- synchronization preparation;
- backup validation.

Jobs shall be:

- resumable;
- observable;
- cancellable whenever safe;
- idempotent whenever possible.

Background execution shall never compromise repository consistency.

---

# 39. Security

The Master Library protects user knowledge.

Implementation shall minimize attack surfaces.

Sensitive operations shall require explicit authorization.

Examples include:

- deletion;
- migration;
- restore;
- repository reset;
- encryption key changes;
- synchronization configuration.

Security mechanisms shall protect:

- confidentiality;
- integrity;
- availability.

---

# 40. Privacy

Knowledge belongs to the user.

The Master Library shall minimize unnecessary exposure of user information.

Private information shall never be transmitted outside the repository unless explicitly requested.

Telemetry shall exclude user knowledge whenever possible.

AI integrations shall respect the privacy model defined by the Architecture.

---

# 41. Performance

Performance improvements shall never compromise correctness.

Optimization priorities are:

1. correctness;
2. integrity;
3. determinism;
4. recoverability;
5. performance.

Caching may improve responsiveness.

Caches shall never become authoritative.

Performance optimizations shall remain transparent to repository semantics.

---

# 42. Observability

The implementation shall expose sufficient operational information to diagnose problems.

Observability may include:

- structured logging;
- metrics;
- tracing;
- integrity reports;
- synchronization statistics;
- storage utilization;
- background job execution;
- recovery reports.

Observability data shall never replace authoritative repository information.

---

# 43. Testing

Every implementation affecting the Master Library shall include appropriate verification.

Testing shall cover, when applicable:

- persistence;
- integrity;
- migrations;
- synchronization;
- recovery;
- backup;
- restore;
- import;
- export;
- indexing;
- concurrency;
- failure scenarios.

Critical functionality shall include regression tests.

Tests shall prioritize repository correctness over implementation details.

---



# 44. Documentation

Every implementation decision shall be documented whenever it affects:

- repository behavior;
- storage semantics;
- persistence;
- synchronization;
- integrity;
- recovery;
- compatibility;
- public contracts.

Documentation shall remain synchronized with the implementation.

Obsolete documentation shall be updated or removed.

Documentation shall describe the current implementation rather than historical intent.

Examples and diagrams shall be maintained together with the implementation.

---

# 45. Module Completion

A task affecting the Master Library shall not be considered complete until all applicable conditions have been satisfied.

Completion requires:

- implementation completed;
- architecture respected;
- documentation updated;
- tests passing;
- integrity validation completed;
- code review completed when applicable;
- no unresolved critical defects;
- no architectural violations.

Temporary workarounds shall be explicitly identified.

---

# 46. Module Review Checklist

Before completing any change, every agent shall verify:

## Architecture

- Architecture principles respected.
- Applicable ADRs followed.
- Module boundaries preserved.
- No ownership violations introduced.

## Persistence

- Persistent identities preserved.
- Metadata consistent.
- Provenance maintained.
- Version history preserved.
- No unintended data loss.

## Storage

- Files remain authoritative.
- Catalog consistency verified.
- Assets correctly registered.
- Integrity validated.

## Synchronization

- Synchronization metadata updated.
- Conflict scenarios evaluated.
- Offline behavior preserved.
- Recovery paths validated.

## Quality

- Tests updated.
- Documentation updated.
- Performance impact evaluated.
- Security impact evaluated.
- Privacy impact evaluated.

Only after all applicable checks have been completed may the task be considered finished.

---

# 47. Agent Reporting

Agents modifying this module shall produce implementation reports proportional to the scope of their changes.

Reports should identify:

- objective;
- modified components;
- affected Knowledge Objects;
- schema changes;
- storage changes;
- migration requirements;
- compatibility considerations;
- validation performed;
- remaining risks.

Reports shall be factual.

They shall avoid speculative conclusions.

---

# 48. Escalation Rules

Agents shall stop implementation and request architectural review whenever they identify situations including, but not limited to:

- changes to persistent identity;
- modifications to the storage model;
- synchronization model changes;
- catalog redesign;
- changes affecting the Source of Truth;
- incompatible migration requirements;
- repository-wide data transformations;
- security model modifications;
- privacy model modifications.

Architectural decisions shall never be inferred without explicit approval.

---

# 49. Prohibited Actions

Agents shall not:

- redefine the Source of Truth;
- duplicate repository ownership;
- replace persistent identifiers;
- silently discard user knowledge;
- overwrite provenance;
- delete version history without an approved retention policy;
- bypass integrity validation;
- bypass synchronization rules;
- couple implementation to platform-specific assumptions;
- expose private user information without authorization;
- create hidden persistence mechanisms outside the approved architecture;
- introduce undocumented repository formats;
- modify architectural boundaries defined by the Architecture documentation.

Violations of these rules shall be treated as architectural defects.

---

# 50. Relationship with Other Modules

The Master Library collaborates with, but remains independent from, other implementation modules.

### Desktop Application

Consumes repository services.

Does not own repository data.

### AI

Consumes Knowledge Objects.

May generate derived metadata.

Does not modify authoritative knowledge without explicit repository operations.

### Synchronization

Uses repository state.

Does not redefine persistent storage.

### Search

Consumes repository information.

Indexes remain derived artifacts.

### Plugin System

Interacts through approved public contracts.

Plugins shall never access repository internals directly.

Every interaction with the Master Library shall occur through stable service interfaces.

---

# 51. Future Evolution

The Master Library is expected to evolve throughout the lifetime of KnowledgeOS.

Future evolution shall preserve:

- persistent identities;
- repository compatibility;
- architectural boundaries;
- data integrity;
- migration capability;
- recoverability.

Architectural evolution shall prioritize backward compatibility whenever reasonably possible.

Breaking changes require:

- explicit architectural approval;
- migration strategy;
- compatibility assessment;
- implementation plan;
- validation procedures.

---

# 52. Final Rule

The Master Library is the most critical implementation module of KnowledgeOS.

Every design and implementation decision shall prioritize:

1. preservation of user knowledge;
2. repository integrity;
3. deterministic behavior;
4. recoverability;
5. architectural consistency.

When uncertainty exists, implementation shall always favor preserving information rather than simplifying execution.

No optimization, feature, refactoring, migration or architectural improvement shall compromise the integrity of the user's knowledge.

The Master Library exists to ensure that user knowledge remains durable, trustworthy, portable and recoverable for the entire lifetime of the platform.
