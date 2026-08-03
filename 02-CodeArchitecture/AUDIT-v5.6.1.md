# Code Architecture Audit — v5.6.1

**Date:** 2026-08-02  
**Scope:** complete `02-CodeArchitecture`; first remediation block `00–15`.

## Baseline findings

- Complete tree currently contains **636 Markdown documents** and **128,910 words after this first remediation block**.
- Documents outside `00–15` remain scheduled for later consolidation releases.

- Markdown documents audited in `00–15`: **100**.
- Documents below 100 words before remediation: **99**.
- Total baseline words in `00–15`: **5,206**.
- The dominant issue was descriptive stubs without invariants, contracts, failure behavior or code traceability.

## Remediation performed

- Rewrote every pre-existing Markdown document in modules `00–15` using the approved documentation standard.
- Preserved the previous text in a Consolidated Baseline section for historical traceability.
- Added one `ModuleSpecification.md` per module.
- Added context and request-flow PlantUML diagrams per module.
- Added package mapping based on directories that actually exist in `packages/`.

## Baseline inventory

| Document | Words before | Bytes before |
|---|---:|---:|
| `00-Governance/CodeArchitecturePrinciples.md` | 152 | 1258 |
| `00-Governance/DefinitionOfDone.md` | 64 | 572 |
| `00-Governance/NamingConventions.md` | 94 | 773 |
| `01-Repository/BranchAndVersionStrategy.md` | 59 | 516 |
| `01-Repository/GeneratedArtifacts.md` | 56 | 520 |
| `01-Repository/RepositoryStructure.md` | 57 | 576 |
| `01-Repository/WorkspaceStrategy.md` | 53 | 488 |
| `02-DependencyRules/CrossLanguageContracts.md` | 59 | 519 |
| `02-DependencyRules/DependencyGraph.md` | 70 | 599 |
| `02-DependencyRules/ForbiddenDependencies.md` | 62 | 526 |
| `02-DependencyRules/ModuleVisibility.md` | 58 | 514 |
| `03-Applications/IOSApplication.md` | 67 | 564 |
| `03-Applications/IPadOSApplication.md` | 68 | 575 |
| `03-Applications/MacOSApplication.md` | 66 | 559 |
| `03-Applications/ServerApplication.md` | 80 | 652 |
| `03-Applications/WebApplication.md` | 77 | 614 |
| `04-Packages/AI.md` | 93 | 754 |
| `04-Packages/Annotation.md` | 90 | 765 |
| `04-Packages/ClientSDK.md` | 88 | 759 |
| `04-Packages/Contracts.md` | 96 | 798 |
| `04-Packages/DomainTypes.md` | 99 | 821 |
| `04-Packages/Export.md` | 90 | 755 |
| `04-Packages/ImportAcquisition.md` | 89 | 778 |
| `04-Packages/Kernel.md` | 91 | 770 |
| `04-Packages/KnowledgeGraph.md` | 92 | 774 |
| `04-Packages/Library.md` | 92 | 777 |
| `04-Packages/Observability.md` | 89 | 762 |
| `04-Packages/PluginSDK.md` | 90 | 768 |
| `04-Packages/Processing.md` | 91 | 763 |
| `04-Packages/Search.md` | 93 | 765 |
| `04-Packages/Sync.md` | 89 | 759 |
| `04-Packages/Testing.md` | 90 | 765 |
| `04-Packages/Tooling.md` | 91 | 767 |
| `05-BuildAndTooling/CodeGeneration.md` | 55 | 466 |
| `05-BuildAndTooling/StaticAnalysis.md` | 53 | 480 |
| `05-BuildAndTooling/SwiftBuild.md` | 60 | 497 |
| `05-BuildAndTooling/TypeScriptBuild.md` | 58 | 494 |
| `06-Testing/ArchitectureTests.md` | 54 | 486 |
| `06-Testing/ContractConformance.md` | 47 | 436 |
| `06-Testing/TestArchitecture.md` | 58 | 524 |
| `07-Delivery/BootstrapSequence.md` | 73 | 565 |
| `07-Delivery/InitialVerticalSlice.md` | 58 | 503 |
| `07-Delivery/Traceability.md` | 55 | 471 |
| `08-FoundationalContracts/ContractNamespaces.md` | 41 | 303 |
| `08-FoundationalContracts/ContractsPackage.md` | 70 | 531 |
| `08-FoundationalContracts/DomainTypesPackage.md` | 73 | 563 |
| `08-FoundationalContracts/README.md` | 39 | 376 |
| `08-FoundationalContracts/SwiftGenerationBoundary.md` | 67 | 528 |
| `08-FoundationalContracts/ValidationAndEvolution.md` | 63 | 491 |
| `09-KernelFoundation/CommandBus.md` | 48 | 352 |
| `09-KernelFoundation/EventBus.md` | 33 | 253 |
| `09-KernelFoundation/ExecutionContext.md` | 29 | 216 |
| `09-KernelFoundation/IdempotencyAndRetry.md` | 44 | 317 |
| `09-KernelFoundation/KernelDependencyRules.md` | 37 | 301 |
| `09-KernelFoundation/QueryBus.md` | 45 | 320 |
| `09-KernelFoundation/README.md` | 26 | 217 |
| `10-DomainFoundation/Acquisition.md` | 14 | 133 |
| `10-DomainFoundation/AggregateModel.md` | 14 | 139 |
| `10-DomainFoundation/FirstVerticalSlice.md` | 26 | 175 |
| `10-DomainFoundation/KnowledgeObject.md` | 16 | 129 |
| `10-DomainFoundation/LocalLibrary.md` | 19 | 143 |
| `10-DomainFoundation/PersonalKnowledge.md` | 15 | 106 |
| `10-DomainFoundation/README.md` | 17 | 128 |
| `10-DomainFoundation/RepositoryContracts.md` | 15 | 120 |
| `11-PlatformLibrary/AcquisitionRequest.md` | 25 | 186 |
| `11-PlatformLibrary/AvailabilityQueries.md` | 21 | 169 |
| `11-PlatformLibrary/DependencyRules.md` | 26 | 189 |
| `11-PlatformLibrary/FirstVerticalSlice.md` | 17 | 140 |
| `11-PlatformLibrary/PortsAndAdapters.md` | 21 | 178 |
| `11-PlatformLibrary/README.md` | 15 | 119 |
| `11-PlatformLibrary/RegisterLocalSource.md` | 25 | 209 |
| `11-PlatformLibrary/UseCases.md` | 23 | 163 |
| `12-InfrastructurePostgres/DriverAdapter.md` | 30 | 217 |
| `12-InfrastructurePostgres/MigrationPolicy.md` | 41 | 292 |
| `12-InfrastructurePostgres/PersistenceBoundary.md` | 27 | 225 |
| `12-InfrastructurePostgres/README.md` | 28 | 261 |
| `12-InfrastructurePostgres/Repositories.md` | 31 | 270 |
| `12-InfrastructurePostgres/Schema.md` | 37 | 285 |
| `12-InfrastructurePostgres/TransactionsAndOutbox.md` | 42 | 303 |
| `13-ServerFoundation/CompositionRoot.md` | 38 | 257 |
| `13-ServerFoundation/Configuration.md` | 36 | 297 |
| `13-ServerFoundation/ErrorMapping.md` | 24 | 176 |
| `13-ServerFoundation/HealthChecks.md` | 24 | 200 |
| `13-ServerFoundation/LibraryAPI.md` | 30 | 235 |
| `13-ServerFoundation/NextStep.md` | 40 | 296 |
| `13-ServerFoundation/README.md` | 28 | 231 |
| `13-ServerFoundation/TransportBoundary.md` | 25 | 190 |
| `14-FirstVerticalSlice/AcceptanceCriteria.md` | 56 | 379 |
| `14-FirstVerticalSlice/BoundaryVerification.md` | 42 | 305 |
| `14-FirstVerticalSlice/Flow.md` | 55 | 371 |
| `14-FirstVerticalSlice/HTTPContract.md` | 30 | 339 |
| `14-FirstVerticalSlice/README.md` | 34 | 256 |
| `14-FirstVerticalSlice/TestStrategy.md` | 40 | 307 |
| `15-NodeServerRuntime/HTTPAdapter.md` | 42 | 320 |
| `15-NodeServerRuntime/IntegrationTest.md` | 54 | 338 |
| `15-NodeServerRuntime/Lifecycle.md` | 44 | 302 |
| `15-NodeServerRuntime/NextStep.md` | 37 | 277 |
| `15-NodeServerRuntime/README.md` | 31 | 252 |
| `15-NodeServerRuntime/RuntimeBoundary.md` | 31 | 235 |
| `15-NodeServerRuntime/Security.md` | 39 | 283 |
