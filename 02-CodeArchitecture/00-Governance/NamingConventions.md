# Naming Conventions

**Project:** KnowledgeOS  
**Section:** Code Architecture / Governance  
**Document:** NamingConventions  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## Repository Naming

- Directories: `kebab-case` for TypeScript workspaces; Xcode target names use `PascalCase`.
- TypeScript packages: `@knowledgeos/<name>`.
- Swift modules: `KnowledgeOS<Name>`.
- Commands: imperative verb plus noun, e.g. `AcquirePublication`.
- Queries: `Get`, `List`, `Search` or `Resolve` plus noun.
- Events: past tense, e.g. `PublicationAcquired`.
- DTOs end with `DTO` only at transport boundaries.
- Repository interfaces end with `Repository`; adapters name the technology.
- Domain identifiers end with `Id` and remain opaque.
