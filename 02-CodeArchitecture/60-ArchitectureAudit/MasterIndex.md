# Code Architecture Master Index

**Project:** KnowledgeOS  
**Section:** 02-CodeArchitecture  
**Version:** 5.6.5  
**Status:** Approved  

## Purpose

This index is the primary navigation entry point for the complete implementation architecture of KnowledgeOS.

## Modules

| Module | Markdown | PlantUML | Approx. words |
|---|---:|---:|---:|
| `00-Governance` | 4 | 2 | 3,587 |
| `01-Repository` | 5 | 2 | 4,436 |
| `02-DependencyRules` | 5 | 2 | 4,475 |
| `03-Applications` | 6 | 2 | 5,544 |
| `04-Packages` | 18 | 2 | 19,023 |
| `05-BuildAndTooling` | 5 | 2 | 4,397 |
| `06-Testing` | 4 | 2 | 3,390 |
| `07-Delivery` | 4 | 2 | 3,423 |
| `08-FoundationalContracts` | 7 | 2 | 6,487 |
| `09-KernelFoundation` | 8 | 2 | 7,333 |
| `10-DomainFoundation` | 9 | 2 | 8,244 |
| `11-PlatformLibrary` | 9 | 2 | 8,355 |
| `12-InfrastructurePostgres` | 8 | 2 | 7,439 |
| `13-ServerFoundation` | 9 | 2 | 8,361 |
| `14-FirstVerticalSlice` | 7 | 2 | 6,503 |
| `15-NodeServerRuntime` | 8 | 2 | 7,532 |
| `16-PostgresServerRuntime` | 9 | 2 | 9,552 |
| `17-MasterLibrary` | 30 | 2 | 36,101 |
| `18-MasterLibraryPostgres` | 9 | 2 | 9,343 |
| `19-MasterStorage` | 10 | 2 | 10,405 |
| `20-MasterRegistrationWorkflow` | 11 | 2 | 11,553 |
| `21-MasterLibraryAPI` | 9 | 2 | 9,309 |
| `22-MasterLibraryStreamingRuntime` | 10 | 2 | 10,521 |
| `23-MasterDirectFileStreaming` | 10 | 2 | 10,468 |
| `24-ResumableUploads` | 11 | 2 | 11,499 |
| `25-ResumableUploadsPostgres` | 11 | 2 | 11,499 |
| `26-ResumableUploadsProductionRuntime` | 2 | 2 | 1,528 |
| `27-SynchronizationEngine` | 12 | 2 | 12,968 |
| `27-SynchronizationWorker` | 11 | 2 | 11,494 |
| `28-LocalLibraryPart1` | 12 | 2 | 12,612 |
| `28-SynchronizationPostgresRuntime` | 11 | 2 | 11,564 |
| `29-LocalLibraryPart2` | 12 | 2 | 12,788 |
| `30-LocalLibraryPart3` | 12 | 2 | 12,699 |
| `31-LocalLibraryPart4` | 14 | 2 | 24,038 |
| `32-LocalLibraryPart5` | 13 | 2 | 21,942 |
| `33-LocalLibraryPart6` | 13 | 2 | 22,044 |
| `34-PersonalKnowledgePart1` | 13 | 2 | 22,997 |
| `35-PersonalKnowledgePart2` | 12 | 2 | 20,914 |
| `36-PersonalKnowledgePart3` | 13 | 2 | 22,965 |
| `37-PersonalKnowledgePart4` | 13 | 2 | 23,104 |
| `38-PersonalKnowledgePart5` | 14 | 2 | 24,907 |
| `39-PersonalKnowledgePart6` | 13 | 2 | 22,922 |
| `40-SearchEnginePart1` | 14 | 2 | 25,360 |
| `41-SearchEnginePart2` | 14 | 2 | 25,273 |
| `42-SearchEnginePart3` | 14 | 2 | 25,382 |
| `43-SearchEnginePart4` | 14 | 2 | 25,351 |
| `44-SearchEnginePart5` | 14 | 2 | 25,409 |
| `45-SearchEnginePart6` | 14 | 2 | 25,358 |
| `46-SearchEnginePart7` | 20 | 2 | 16,741 |
| `47-SearchEnginePart8` | 20 | 2 | 16,760 |
| `48-SearchEnginePart9` | 23 | 2 | 19,274 |
| `49-SearchEnginePart10` | 21 | 2 | 17,680 |
| `50-KnowledgeGraphPart1` | 20 | 2 | 16,487 |
| `51-KnowledgeGraphPart2` | 21 | 2 | 17,405 |
| `52-KnowledgeGraphPart3` | 21 | 2 | 17,384 |
| `53-KnowledgeGraphPart4` | 21 | 2 | 17,397 |
| `54-KnowledgeGraphPart5` | 11 | 2 | 8,716 |
| `54-PersonalKnowledgeGraph` | 20 | 2 | 16,495 |
| `55-AIEngine` | 19 | 2 | 14,428 |
| `56-SearchEngineConsolidation` | 17 | 2 | 14,155 |
| `57-DocumentEngine` | 18 | 2 | 13,663 |
| `58-LibraryEngine` | 22 | 2 | 16,943 |
| `59-SyncEngine` | 20 | 2 | 16,066 |
| `60-ArchitectureAudit` | 0 | 0 | 0 |

## Reading order

1. Begin with governance, repository rules, dependencies, applications, packages, build and testing.
2. Continue through foundations, kernel, domain and platform infrastructure.
3. Read Master Library, Local Library and synchronization before derived engines.
4. Read Personal Knowledge, Search, Knowledge Graph, AI, Document, Library and Sync engine specifications.
5. Use the traceability matrix and glossary when following a concept across modules.