# Engine Interactions

**Project:** KnowledgeOS  
**Version:** 5.6.5  
**Status:** Approved  

## Canonical flow

```text
Import / External Source
→ Document Engine
→ Library Engine
→ Local Library / Master Library
→ Knowledge Graph
→ Search Engine
→ AI Engine
→ Reader / Workspace / Plugins
```

## Ownership boundaries

- Document Engine owns parsing and normalization.
- Library Engine owns logical transactions and object lifecycle.
- Master Library owns authoritative server-side state.
- Local Library owns offline client state and cache.
- Sync Engine reconciles replicas without becoming authoritative.
- Knowledge Graph owns semantic entities, relationships, ontology and inference.
- Search Engine owns indexes and retrieval projections.
- AI Engine consumes context and tools but does not own knowledge.
