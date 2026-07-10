
# Architecture v3 Migration Plan

**Project:** KnowledgeOS
**Document:** Architecture v3 Migration Plan
**Version:** 3.0
**Status:** Approved
**Author:** KnowledgeOS Team
**Last Updated:** 2026-07-10

**Related Documents**

* ArchitectureVocabulary.md
* DocumentationStandards.md
* ArchitectureDecisionMatrix.md
* ArchitectureReview-v3.0.md
* ../01-Foundation/ProductVision.md
* ../01-Foundation/ArchitectureModel.md

---

## 1. Purpose

Define the complete and final migration from the current architecture documentation structure to the **KnowledgeOS Architecture Handbook v3.0**.

This document establishes:

* the definitive folder structure;
* the destination of every existing document;
* which documents are preserved;
* which documents are rewritten;
* which documents are consolidated;
* which documents are deprecated;
* the execution order;
* the freeze rules for version 3.0.

No structural change may be introduced until the migration and consolidation described here are complete.

---

## 2. Scope

This migration covers:

* architecture governance;
* foundation documents;
* domain documentation;
* Kernel documentation;
* Engine documentation;
* integration documentation;
* quality documentation;
* ADR;
* Contracts;
* Public APIs;
* C4 diagrams;
* UML diagrams;
* related architecture specifications currently stored under `01-Specifications`.

It does not include source code or implementation planning.

---

## 3. Migration Rules

1. The v3 folder structure is final.
2. No new top-level architecture folders may be added during the migration.
3. No existing concept may be renamed during the migration.
4. No new architectural decision may be introduced.
5. Every delivered document replaces the previous version completely.
6. Patches and partial fragments are not permitted.
7. Existing files are removed only after their replacement is complete.
8. All references must use relative paths.
9. All documents must comply with `DocumentationStandards.md`.
10. All terminology must comply with `ArchitectureVocabulary.md`.
11. ADR numbering remains unchanged.
12. `.puml` files remain the source of truth for diagrams.
13. Generated SVG and PNG files remain derived artifacts.
14. New ideas are recorded only in `ArchitectureBacklog.md`.
15. Version 3.0 is frozen only after the final integral review.

---

## 4. Definitive Structure

```text
00-Architecture/
├── 00-Governance/
│   ├── README.md
│   ├── ArchitectureV3MigrationPlan.md
│   ├── ArchitectureVocabulary.md
│   ├── DocumentationStandards.md
│   ├── ArchitectureDecisionMatrix.md
│   ├── ArchitectureBacklog.md
│   └── ArchitectureReview-v3.0.md
│
├── 01-Foundation/
│   ├── README.md
│   ├── ProductVision.md
│   ├── ArchitectureModel.md
│   ├── ArchitecturePrinciples.md
│   ├── ArchitectureConstraints.md
│   └── QualityAttributes.md
│
├── 02-Domain/
│   ├── README.md
│   ├── DomainModel.md
│   ├── KnowledgeLifecycle.md
│   ├── EngineResponsibilities.md
│   ├── KnowledgeObject/
│   ├── UDM/
│   ├── KnowledgeGraph/
│   └── Identity/
│
├── 03-Kernel/
│   ├── README.md
│   ├── KernelArchitecture.md
│   ├── WorkflowEngine.md
│   ├── CommandBus.md
│   ├── QueryBus.md
│   ├── EventBus.md
│   ├── JobSystem.md
│   ├── Scheduler.md
│   ├── DependencyInjection.md
│   ├── Configuration.md
│   ├── Logging.md
│   └── Observability.md
│
├── 04-Platform/
│   ├── README.md
│   ├── Library/
│   ├── Import/
│   ├── Render/
│   ├── Search/
│   ├── Annotation/
│   ├── Knowledge/
│   ├── AI/
│   ├── Sync/
│   ├── Export/
│   └── Plugin/
│
├── 05-Integration/
│   ├── README.md
│   ├── PublicAPI/
│   ├── PluginSDK/
│   ├── Providers/
│   ├── Storage/
│   └── Synchronization/
│
├── 06-Quality/
│   ├── README.md
│   ├── TestingStrategy.md
│   ├── PerformanceStrategy.md
│   ├── SecurityStrategy.md
│   ├── PrivacyStrategy.md
│   ├── RecoveryStrategy.md
│   ├── BackupStrategy.md
│   └── ObservabilityStrategy.md
│
└── 07-ArchitectureViews/
    ├── README.md
    ├── ADR/
    ├── C4/
    └── UML/
```

No other folders belong to the Architecture Handbook v3.0.

---

## 5. Migration Classification

Each current document receives one of the following actions:

| Action      | Meaning                                                          |
| ----------- | ---------------------------------------------------------------- |
| Preserve    | Content remains valid; only format and references are normalized |
| Rewrite     | Document is replaced completely with a v3 version                |
| Move        | File changes location without conceptual changes                 |
| Consolidate | Multiple files are merged into one authoritative document        |
| Split       | One file is divided into multiple authoritative documents        |
| Deprecate   | File is retained temporarily but no longer authoritative         |
| Remove      | File is deleted after its replacement is approved                |

---

## 6. Governance Migration

### Current documents

```text
00-Architecture/
├── ArchitectureVocabulary.md
├── DocumentationStandards.md
├── ArchitectureReview-v2.0.md
└── ArchitecturalBacklog.md
```

### Destination

```text
00-Architecture/00-Governance/
├── ArchitectureVocabulary.md
├── DocumentationStandards.md
├── ArchitectureBacklog.md
└── ArchitectureReview-v3.0.md
```

### Actions

| Current file               | Destination                                  | Action                     |
| -------------------------- | -------------------------------------------- | -------------------------- |
| ArchitectureVocabulary.md  | 00-Governance/ArchitectureVocabulary.md      | Rewrite                    |
| DocumentationStandards.md  | 00-Governance/DocumentationStandards.md      | Rewrite                    |
| ArchitectureReview-v2.0.md | 00-Governance/ArchitectureReview-v3.0.md     | Replace after final review |
| ArchitecturalBacklog.md    | 00-Governance/ArchitectureBacklog.md         | Move and normalize         |
| None                       | 00-Governance/ArchitectureDecisionMatrix.md  | Create                     |
| None                       | 00-Governance/README.md                      | Create                     |
| None                       | 00-Governance/ArchitectureV3MigrationPlan.md | Create                     |

`ArchitectureReview-v2.0.md` remains available until `ArchitectureReview-v3.0.md` is approved.

---

## 7. Foundation Migration

### Current documents

```text
00-Architecture/
├── ProductVision.md
├── ArchitectureModel.md
├── ArchitecturePrinciples.md
├── ArchitectureConstraints.md
└── QualityAttributes.md
```

### Destination

```text
00-Architecture/01-Foundation/
├── ProductVision.md
├── ArchitectureModel.md
├── ArchitecturePrinciples.md
├── ArchitectureConstraints.md
└── QualityAttributes.md
```

### Actions

| Current file               | Action           |
| -------------------------- | ---------------- |
| ProductVision.md           | Rewrite as v3    |
| ArchitectureModel.md       | Rewrite as v3    |
| ArchitecturePrinciples.md  | Rewrite as v3    |
| ArchitectureConstraints.md | Rewrite as v3    |
| QualityAttributes.md       | Rewrite as v3    |
| None                       | Create README.md |

These documents retain their current concepts:

* Knowledge Object;
* `.kdoc`;
* UDM;
* Knowledge Graph;
* Offline First;
* NAS as Source of Truth;
* Engine Based Architecture;
* Workflow Engine;
* Logical Repositories.

No new concepts may be added during rewriting.

---

## 8. Domain Migration

### Current documents

```text
00-Architecture/
├── DomainModel.md
├── KnowledgeLifecycle.md
└── EngineResponsibilities.md

01-Specifications/UDM/
```

### Destination

```text
00-Architecture/02-Domain/
├── DomainModel.md
├── KnowledgeLifecycle.md
├── EngineResponsibilities.md
├── KnowledgeObject/
├── UDM/
├── KnowledgeGraph/
└── Identity/
```

### Actions

| Source                         | Destination                                   | Action                 |
| ------------------------------ | --------------------------------------------- | ---------------------- |
| DomainModel.md                 | 02-Domain/DomainModel.md                      | Rewrite                |
| KnowledgeLifecycle.md          | 02-Domain/KnowledgeLifecycle.md               | Rewrite                |
| EngineResponsibilities.md      | 02-Domain/EngineResponsibilities.md           | Rewrite                |
| UDM/UDM.md                     | 02-Domain/UDM/README.md                       | Consolidate            |
| UDM/TypeSystem.md              | 02-Domain/UDM/TypeSystem.md                   | Preserve and normalize |
| UDM/NodeTypes.md               | 02-Domain/UDM/NodeTypes.md                    | Consolidate            |
| UDM/BlockNodes.md              | 02-Domain/UDM/BlockNodes.md                   | Preserve and normalize |
| UDM/InlineNodes.md             | 02-Domain/UDM/InlineNodes.md                  | Preserve and normalize |
| UDM/AssetNodes.md              | 02-Domain/UDM/AssetNodes.md                   | Preserve and normalize |
| UDM/StructuralNodes.md         | 02-Domain/UDM/StructuralNodes.md              | Preserve and normalize |
| UDM/AnnotationNodes.md         | 02-Domain/UDM/AnnotationNodes.md              | Preserve and normalize |
| UDM/StyleLayer.md              | 02-Domain/UDM/StyleLayer.md                   | Preserve and normalize |
| UDM/KnowledgeLayer.md          | 02-Domain/KnowledgeGraph/KnowledgeLayer.md    | Move and normalize     |
| UDM/GraphModel.md              | 02-Domain/KnowledgeGraph/GraphModel.md        | Rewrite                |
| UDM/EntityModel.md             | 02-Domain/KnowledgeGraph/EntityModel.md       | Preserve and normalize |
| UDM/RelationshipModel.md       | 02-Domain/KnowledgeGraph/RelationshipModel.md | Preserve and normalize |
| UDM/Ontology.md                | 02-Domain/KnowledgeGraph/Ontology.md          | Preserve and normalize |
| UDM/EmbeddingModel.md          | 02-Domain/KnowledgeGraph/EmbeddingModel.md    | Preserve and normalize |
| UDM/Identity.md                | 02-Domain/Identity/KnowledgeObjectIdentity.md | Rewrite                |
| UDM/TemporalModel.md           | 02-Domain/Identity/TemporalModel.md           | Preserve and normalize |
| UDM/LogicalPhysicalDocument.md | 02-Domain/KnowledgeObject/PhysicalSources.md  | Rewrite                |
| UDM/Provenance.md              | 02-Domain/KnowledgeObject/Provenance.md       | Preserve and normalize |
| UDM/Anchors.md                 | 02-Domain/UDM/Anchors.md                      | Preserve and normalize |
| UDM/Relationships.md           | 02-Domain/UDM/Relationships.md                | Consolidate            |
| UDM/ValidationRules.md         | 02-Domain/UDM/ValidationRules.md              | Preserve and normalize |
| UDM/ConsistencyRules.md        | 02-Domain/UDM/ConsistencyRules.md             | Preserve and normalize |
| UDM/Serialization.md           | 05-Integration/Storage/KDocSerialization.md   | Rewrite                |
| UDM/Versioning.md              | 02-Domain/UDM/Versioning.md                   | Preserve and normalize |
| UDM/KnowledgeArchitecture.md   | 02-Domain/KnowledgeGraph/README.md            | Consolidate            |
| UDM/KnowledgeLayers.md         | 02-Domain/KnowledgeGraph/KnowledgeLayers.md   | Consolidate            |
| UDM/DocumentLifecycle.md       | 02-Domain/KnowledgeLifecycle.md               | Consolidate            |
| UDM/ProcessingPipeline.md      | 04-Platform/Import/ImportPipeline.md          | Move and rewrite       |

After migration, `01-Specifications/UDM/` is removed.

---

## 9. Kernel Migration

The current repository does not yet contain a consolidated Kernel section.

The following documents are created only when their complete content is delivered:

```text
00-Architecture/03-Kernel/
├── README.md
├── KernelArchitecture.md
├── WorkflowEngine.md
├── CommandBus.md
├── QueryBus.md
├── EventBus.md
├── JobSystem.md
├── Scheduler.md
├── DependencyInjection.md
├── Configuration.md
├── Logging.md
└── Observability.md
```

### Source material

The Kernel documentation consolidates content from:

* ArchitectureModel.md;
* EngineResponsibilities.md;
* ADR-001;
* ADR-005;
* ADR-011;
* ADR-012;
* ADR-014;
* Contracts;
* Workflow-related UML diagrams.

Contracts remain authoritative only until their Engine-specific replacements are approved.

---

## 10. Platform Migration

Each Engine receives its own documentation package.

### Final Engine structure

```text
04-Platform/<Engine>/
├── README.md
├── Architecture.md
├── Responsibilities.md
├── Commands.md
├── Queries.md
├── Events.md
├── DTOs.md
├── Errors.md
├── PublicAPI.md
├── Workflows.md
└── Diagrams.md
```

Not every file must exist if the Engine has no corresponding concept.

Empty files are forbidden.

### Current source mapping

| Current source                       | Final Engine |
| ------------------------------------ | ------------ |
| Contracts/Library-related content    | Library      |
| PublicAPI/LibraryAPI.md              | Library      |
| Contracts/Import-related content     | Import       |
| PublicAPI/ImportAPI.md               | Import       |
| Contracts/Search-related content     | Search       |
| PublicAPI/SearchAPI.md               | Search       |
| Contracts/Render-related content     | Render       |
| PublicAPI/RenderAPI.md               | Render       |
| Contracts/Annotation-related content | Annotation   |
| PublicAPI/AnnotationAPI.md           | Annotation   |
| Contracts/AI-related content         | AI           |
| PublicAPI/AIAPI.md                   | AI           |
| Contracts/Sync-related content       | Sync         |
| PublicAPI/SyncAPI.md                 | Sync         |
| Contracts/Export-related content     | Export       |
| PublicAPI/ExportAPI.md               | Export       |
| Contracts/Plugin-related content     | Plugin       |
| PublicAPI/PluginAPI.md               | Plugin       |
| Knowledge Graph specifications       | Knowledge    |

### Engine order

1. Library
2. Import
3. Render
4. Search
5. Annotation
6. Knowledge
7. AI
8. Sync
9. Export
10. Plugin

This order will not change during v3.

---

## 11. Integration Migration

### Current sources

```text
01-Specifications/
├── Storage/
├── PluginSDK/
├── AI/
├── Sync/
└── Events/
```

### Destination

```text
05-Integration/
├── PublicAPI/
├── PluginSDK/
├── Providers/
├── Storage/
└── Synchronization/
```

### Actions

| Current source                     | Destination                             | Action                            |
| ---------------------------------- | --------------------------------------- | --------------------------------- |
| Storage/*                          | Integration/Storage/*                   | Rewrite and consolidate           |
| PluginSDK/*                        | Integration/PluginSDK/*                 | Rewrite                           |
| AI provider material               | Integration/Providers/AI/*              | Consolidate                       |
| OCR provider material              | Integration/Providers/OCR/*             | Consolidate                       |
| Sync specifications                | Integration/Synchronization/*           | Rewrite                           |
| Public cross-platform API material | Integration/PublicAPI/*                 | Create only if truly cross-Engine |
| Events folder                      | 03-Kernel/EventBus.md and Engine Events | Consolidate                       |

The global `Contracts/` and `PublicAPI/` folders are removed only after every contract and API has been migrated to its owning Engine or Integration section.

---

## 12. Quality Migration

`QualityAttributes.md` remains a Foundation document.

Detailed quality strategies move to:

```text
00-Architecture/06-Quality/
├── TestingStrategy.md
├── PerformanceStrategy.md
├── SecurityStrategy.md
├── PrivacyStrategy.md
├── RecoveryStrategy.md
├── BackupStrategy.md
└── ObservabilityStrategy.md
```

These documents are created only after Foundation, Domain, Kernel, Platform and Integration are complete.

No quality strategy may redefine the architecture.

---

## 13. ADR Migration

### Current location

```text
00-Architecture/ADR/
```

### Final location

```text
00-Architecture/07-ArchitectureViews/ADR/
```

### Final classification

```text
ADR/
├── README.md
├── Foundation/
│   ├── ADR-001-Architectural-Style.md
│   └── ADR-003-Offline-First.md
├── Domain/
│   ├── ADR-002-Universal-Document-Model.md
│   ├── ADR-009-Knowledge-Object-Identity.md
│   ├── ADR-010-Global-Identity-Model.md
│   └── ADR-015-Knowledge-Object-Architecture.md
├── Kernel/
│   ├── ADR-011-Public-Contracts.md
│   ├── ADR-012-Event-Architecture.md
│   └── ADR-013-Workflow-Engine.md
└── Platform/
    ├── ADR-004-Library-Source-of-Truth.md
    ├── ADR-005-Engine-Based-Architecture.md
    ├── ADR-006-AI-Architecture.md
    ├── ADR-007-Plugin-Architecture.md
    ├── ADR-008-Storage-Architecture.md
    └── ADR-014-Synchronization-Strategy.md
```

### Numbering

ADR numbers remain fixed.

No ADR is renumbered.

### Rewritten ADR titles

| Number  | Final title                   |
| ------- | ----------------------------- |
| ADR-001 | Architectural Style           |
| ADR-002 | Universal Document Model      |
| ADR-003 | Offline First                 |
| ADR-004 | Library Source of Truth       |
| ADR-005 | Engine Based Architecture     |
| ADR-006 | AI Architecture               |
| ADR-007 | Plugin Architecture           |
| ADR-008 | Storage Architecture          |
| ADR-009 | Knowledge Object Identity     |
| ADR-010 | Global Identity Model         |
| ADR-011 | Public Contracts              |
| ADR-012 | Event Architecture            |
| ADR-013 | Workflow Engine               |
| ADR-014 | Synchronization Strategy      |
| ADR-015 | Knowledge Object Architecture |

This mapping is final for v3.

---

## 14. C4 Migration

### Current source

```text
00-Architecture/C4/
```

### Destination

```text
00-Architecture/07-ArchitectureViews/C4/
```

### Final structure

```text
C4/
├── README.md
├── CodingStandards.md
├── _includes/
├── diagrams/
│   ├── level1/
│   ├── level2/
│   └── level3/
└── generated/
    ├── svg/
    └── png/
```

### Required updates

All C4 diagrams must reflect:

* Knowledge Object;
* `.kdoc`;
* Knowledge Engine;
* Workflow Engine;
* Object Repository;
* Asset Repository;
* Journal Repository;
* Provider Manager;
* Conflict Resolver.

All diagrams must use one-line C4 macros.

No multiline C4 macro arguments are permitted.

---

## 15. UML Migration

### Current source

```text
00-Architecture/UML/
```

### Destination

```text
00-Architecture/07-ArchitectureViews/UML/
```

### Final structure

```text
UML/
├── README.md
├── Activity/
├── Class/
├── Component/
├── Deployment/
├── Sequence/
└── State/
```

### Required terminology updates

Replace obsolete conceptual uses of:

* Document → Knowledge Object;
* Document ID → KnowledgeObjectID;
* Document Repository → Object Repository;
* Document Lifecycle → Knowledge Object Lifecycle.

The term `Document` remains valid only for a specific Knowledge Object type or a physical source.

---

## 16. Deprecated Paths

The following paths become deprecated during migration:

```text
00-Architecture/ADR/
00-Architecture/C4/
00-Architecture/UML/
00-Architecture/Contracts/
00-Architecture/PublicAPI/
01-Specifications/UDM/
```

They remain temporarily available until their replacements are approved.

After approval, they are removed.

---

## 17. Execution Order

The migration will be executed in this exact order:

### Phase 1 — Governance

1. ArchitectureV3MigrationPlan.md
2. ArchitectureVocabulary.md
3. DocumentationStandards.md
4. ArchitectureDecisionMatrix.md
5. ArchitectureBacklog.md
6. Governance README.md

### Phase 2 — Foundation

1. ProductVision.md
2. ArchitectureModel.md
3. ArchitecturePrinciples.md
4. ArchitectureConstraints.md
5. QualityAttributes.md
6. Foundation README.md

### Phase 3 — Domain

1. DomainModel.md
2. KnowledgeLifecycle.md
3. EngineResponsibilities.md
4. Knowledge Object
5. UDM
6. Knowledge Graph
7. Identity
8. Domain README.md

### Phase 4 — Kernel

1. KernelArchitecture.md
2. CommandBus.md
3. QueryBus.md
4. EventBus.md
5. WorkflowEngine.md
6. JobSystem.md
7. Scheduler.md
8. Remaining Kernel documents
9. Kernel README.md

### Phase 5 — Platform

Complete each Engine in the fixed order defined in Section 10.

### Phase 6 — Integration

1. Storage
2. Synchronization
3. Providers
4. Plugin SDK
5. Public API
6. Integration README.md

### Phase 7 — Quality

Complete all quality strategies.

### Phase 8 — Architecture Views

1. ADR
2. C4
3. UML
4. Architecture Views README.md

### Phase 9 — Final Review

1. Validate terminology.
2. Validate references.
3. Compile all PlantUML diagrams.
4. Check empty directories.
5. Check duplicate documents.
6. Check deprecated paths.
7. Complete ArchitectureDecisionMatrix.md.
8. Approve ArchitectureReview-v3.0.md.
9. Freeze Architecture Handbook v3.0.

This order is immutable during the migration.

---

## 18. Completion Criteria

Architecture Handbook v3.0 is complete only when:

* every planned document exists;
* no planned document is empty;
* no obsolete authoritative document remains;
* all references resolve;
* all C4 diagrams compile;
* all UML diagrams compile;
* all ADR use the final template;
* all terminology matches the vocabulary;
* all deprecated paths are removed;
* ArchitectureReview-v3.0.md is approved.

---

## 19. Freeze Policy

During the migration:

* no architectural redesign is allowed;
* no renaming of core concepts is allowed;
* no restructuring is allowed;
* no ADR renumbering is allowed;
* no additional Engine is allowed;
* no additional top-level folder is allowed.

Potential improvements must be recorded in:

```text
00-Architecture/00-Governance/ArchitectureBacklog.md
```

They may be evaluated only after the v3 freeze.

---

## 20. Final Decision

This migration plan is the single source of truth for the construction of the KnowledgeOS Architecture Handbook v3.0.

All subsequent work must follow this plan without structural deviation.

The next document to complete is:

```text
00-Architecture/00-Governance/ArchitectureVocabulary.md
```
