# Code Architecture Principles

**Project:** KnowledgeOS  
**Section:** Code Architecture / Governance  
**Document:** CodeArchitecturePrinciples  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## Principles

1. **Architecture before convenience.** Package boundaries follow V4 ownership.
2. **Polyglot by platform.** Native Apple clients use Swift; server and web use TypeScript.
3. **Contracts are language-neutral.** JSON Schema/OpenAPI/Event schemas are canonical wire definitions; generated Swift and TypeScript types are derived.
4. **Dependency direction is enforced.** Applications compose capabilities; they do not own Domain rules.
5. **No private cross-module imports.** Modules communicate through public contracts.
6. **Stable identities are opaque.** Database keys, file paths and provider IDs do not replace Domain identity.
7. **Generated code is reproducible.** Generated clients and schemas are never edited manually.
8. **Tests prove boundaries.** Architecture tests block forbidden dependencies.
9. **Secrets are external.** No production secret enters source control.
10. **One repository, independent toolchains.** pnpm/Turbo and Xcode/SPM interoperate through schemas and generated artifacts.
