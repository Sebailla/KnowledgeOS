# KnowledgeOS Code Architecture

**Documentation version:** 5.6.1  
**Status:** Active consolidation

`02-CodeArchitecture` describes how the software is organized and implemented. It is subordinate to product-level architectural decisions but normative for package boundaries, runtime flows, persistence adapters and verification.

## Consolidated modules in v5.6.1

- [00-Governance](00-Governance/ModuleSpecification.md) — Gobernanza de arquitectura de código
- [01-Repository](01-Repository/ModuleSpecification.md) — Estrategia del repositorio
- [02-DependencyRules](02-DependencyRules/ModuleSpecification.md) — Reglas de dependencias
- [03-Applications](03-Applications/ModuleSpecification.md) — Aplicaciones y hosts
- [04-Packages](04-Packages/ModuleSpecification.md) — Catálogo de paquetes
- [05-BuildAndTooling](05-BuildAndTooling/ModuleSpecification.md) — Build y herramientas
- [06-Testing](06-Testing/ModuleSpecification.md) — Arquitectura de pruebas
- [07-Delivery](07-Delivery/ModuleSpecification.md) — Entrega incremental
- [08-FoundationalContracts](08-FoundationalContracts/ModuleSpecification.md) — Contratos fundacionales
- [09-KernelFoundation](09-KernelFoundation/ModuleSpecification.md) — Kernel de ejecución
- [10-DomainFoundation](10-DomainFoundation/ModuleSpecification.md) — Fundación de dominio
- [11-PlatformLibrary](11-PlatformLibrary/ModuleSpecification.md) — Biblioteca de plataforma
- [12-InfrastructurePostgres](12-InfrastructurePostgres/ModuleSpecification.md) — Infraestructura PostgreSQL
- [13-ServerFoundation](13-ServerFoundation/ModuleSpecification.md) — Fundación del servidor
- [14-FirstVerticalSlice](14-FirstVerticalSlice/ModuleSpecification.md) — Primer vertical slice
- [15-NodeServerRuntime](15-NodeServerRuntime/ModuleSpecification.md) — Runtime de servidor Node.js

## Governance documents

- [Documentation standard](DOCUMENTATION_STANDARD.md)
- [Audit report](AUDIT-v5.6.1.md)

## Reading order

Start with Governance, Repository and Dependency Rules. Continue with Applications, Packages, Build and Testing. Then read Foundational Contracts, Kernel, Domain, Platform, Infrastructure and the first executable slice.

## Previous baseline

The former README is retained below for historical traceability.

# KnowledgeOS V5 Code Architecture

**Project:** KnowledgeOS  
**Section:** Code Architecture / Root  
**Document:** README  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

V5 maps the approved V4 architecture to the physical source repository.

## 2. Technology Boundary

- **Swift and SwiftUI:** macOS, iPhone and iPad applications.
- **TypeScript and Node.js:** KnowledgeOS Server, optional Web Application, shared wire contracts, code generation and tooling.
- **PostgreSQL:** Master Catalog persistence.
- **Container runtime:** NAS deployment.
- **CloudKit:** approved Apple Personal Knowledge synchronization profile.

The repository is a polyglot monorepo. `pnpm` and Turborepo coordinate TypeScript workspaces; Xcode and Swift Package Manager coordinate Apple code. Neither toolchain owns the other.

## 3. Physical Structure

```text
KnowledgeOS/
├── apps/
│   ├── server/
│   └── web/
├── apple/
│   ├── KnowledgeOS.xcworkspace/
│   ├── Apps/
│   │   ├── macOS/
│   │   ├── iOS/
│   │   └── iPadOS/
│   └── Packages/
├── packages/
│   ├── contracts/
│   ├── domain-types/
│   ├── client-sdk/
│   ├── plugin-sdk/
│   ├── observability/
│   ├── testing/
│   └── tooling/
├── services/
│   ├── api/
│   ├── workers/
│   ├── scheduler/
│   └── providers/
├── infrastructure/
├── deployment/
├── tools/
├── tests/
├── 00-Architecture/
├── 01-Implementation/
└── 02-CodeArchitecture/
```

## 4. Governing Rule

Code SHALL implement V4. V5 MAY refine physical packaging and language-specific interfaces, but SHALL NOT redefine identity, authority, acquisition, synchronization, UDM, DPM or Engine ownership.



## Consolidation status — v5.6.2

Modules `00–30` have been consolidated under the engineering documentation standard. See `_Consolidation/v5.6.2-Report.md`.

## Consolidation status v5.6.3

Modules `00–45` have been consolidated under the normative Code Architecture standard. Modules `31–45` were reviewed in v5.6.3 and now include module specifications, implementation status, traceability, and structural/runtime PlantUML views.

## Consolidation status — v5.6.4

Modules `46–59` are consolidated under the same normative documentation standard used for earlier blocks. Both directories numbered `54` are preserved because they represent distinct modules.

| Module | Status | Evidence |
|---|---|---|
| `46-SearchEnginePart7` | Consolidated in v5.6.4 | 20 Markdown documents; 33 matching packages |
| `47-SearchEnginePart8` | Consolidated in v5.6.4 | 20 Markdown documents; 33 matching packages |
| `48-SearchEnginePart9` | Consolidated in v5.6.4 | 23 Markdown documents; 33 matching packages |
| `49-SearchEnginePart10` | Consolidated in v5.6.4 | 21 Markdown documents; 33 matching packages |
| `50-KnowledgeGraphPart1` | Consolidated in v5.6.4 | 20 Markdown documents; 12 matching packages |
| `51-KnowledgeGraphPart2` | Consolidated in v5.6.4 | 21 Markdown documents; 12 matching packages |
| `52-KnowledgeGraphPart3` | Consolidated in v5.6.4 | 21 Markdown documents; 12 matching packages |
| `53-KnowledgeGraphPart4` | Consolidated in v5.6.4 | 21 Markdown documents; 12 matching packages |
| `54-KnowledgeGraphPart5` | Consolidated in v5.6.4 | 11 Markdown documents; 12 matching packages |
| `54-PersonalKnowledgeGraph` | Consolidated in v5.6.4 | 20 Markdown documents; 17 matching packages |
| `55-AIEngine` | Consolidated in v5.6.4 | 19 Markdown documents; 7 matching packages |
| `56-SearchEngineConsolidation` | Consolidated in v5.6.4 | 17 Markdown documents; 33 matching packages |
| `57-DocumentEngine` | Consolidated in v5.6.4 | 18 Markdown documents; 7 matching packages |
| `58-LibraryEngine` | Consolidated in v5.6.4 | 22 Markdown documents; 8 matching packages |
| `59-SyncEngine` | Consolidated in v5.6.4 | 20 Markdown documents; 14 matching packages |

See [`_Consolidation/EngineInteractions.md`](./_Consolidation/EngineInteractions.md) for the cross-engine dependency model.

## v5.6.5 architecture audit

The complete Code Architecture is indexed and audited through:

- `60-ArchitectureAudit/MasterIndex.md`
- `60-ArchitectureAudit/TechnicalGlossary.md`
- `60-ArchitectureAudit/TraceabilityMatrix.md`
- `60-ArchitectureAudit/TerminologyRules.md`
- `60-ArchitectureAudit/DocumentationCoverage.md`
- `60-ArchitectureAudit/EngineInteractions.md`
