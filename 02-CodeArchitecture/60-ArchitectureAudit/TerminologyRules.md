# Terminology and Consistency Rules

**Project:** KnowledgeOS  
**Version:** 5.6.5  
**Status:** Approved  

## Normative terminology

- Use **Master Library** for the authoritative NAS-hosted library.
- Use **Local Library** for offline client-side state.
- Use **Library Engine** for the logical transactional subsystem.
- Use **Sync Engine** for replica reconciliation and transport.
- Use **Knowledge Graph** for the authoritative semantic graph.
- Use **Personal Knowledge Graph** for owner-specific context.
- Use **Search Engine** for retrieval, ranking and indexing.
- Use **Document Engine** for parsing, normalization, OCR and assets.
- Use **AI Engine** for providers, context, memory, tools and generation.

## Naming rules

- Package names use kebab-case under `@knowledgeos/*`.
- Markdown filenames use PascalCase unless an established module naming convention already exists.
- PlantUML filenames describe the view or scenario.
- Runtime classes end with `Runtime` only when they coordinate lifecycle and multiple collaborators.
- Repository interfaces describe persistence boundaries and do not expose storage-specific details.

## Prohibited ambiguity

- Do not use `library` alone when Master Library, Local Library, or Library Engine is intended.
- Do not call a projection authoritative.
- Do not describe SQLite as the Source of Truth.
- Do not treat AI-generated content as authoritative without provenance and user confirmation.