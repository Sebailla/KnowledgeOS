# Dependency Graph

## Topological build order

1. `@knowledgeos/domain-types`
2. `@knowledgeos/contracts`
3. `@knowledgeos/domain`
4. `@knowledgeos/kernel`
5. `@knowledgeos/ai`
6. `@knowledgeos/library`
7. `@knowledgeos/storage`
8. `@knowledgeos/search`
9. `@knowledgeos/knowledge-graph`
10. `@knowledgeos/export`
11. `@knowledgeos/import`
12. `@knowledgeos/ocr`
13. `@knowledgeos/sync`
14. `@knowledgeos/workspace`
15. `@knowledgeos/document`
16. `@knowledgeos/plugin`
17. `@knowledgeos/core`

## Internal dependencies

- `@knowledgeos/ai` → `@knowledgeos/kernel`
- `@knowledgeos/contracts` → `@knowledgeos/domain-types`
- `@knowledgeos/core` → `@knowledgeos/ai`, `@knowledgeos/document`, `@knowledgeos/export`, `@knowledgeos/import`, `@knowledgeos/kernel`, `@knowledgeos/knowledge-graph`, `@knowledgeos/ocr`, `@knowledgeos/plugin`, `@knowledgeos/search`, `@knowledgeos/storage`, `@knowledgeos/sync`, `@knowledgeos/workspace`
- `@knowledgeos/document` → `@knowledgeos/ai`, `@knowledgeos/export`, `@knowledgeos/import`, `@knowledgeos/kernel`, `@knowledgeos/knowledge-graph`, `@knowledgeos/library`, `@knowledgeos/search`, `@knowledgeos/storage`, `@knowledgeos/workspace`
- `@knowledgeos/domain` → `@knowledgeos/contracts`, `@knowledgeos/domain-types`
- `@knowledgeos/domain-types` → none
- `@knowledgeos/export` → `@knowledgeos/kernel`, `@knowledgeos/knowledge-graph`, `@knowledgeos/library`, `@knowledgeos/search`, `@knowledgeos/storage`
- `@knowledgeos/import` → `@knowledgeos/kernel`, `@knowledgeos/knowledge-graph`, `@knowledgeos/library`, `@knowledgeos/search`, `@knowledgeos/storage`
- `@knowledgeos/kernel` → `@knowledgeos/contracts`, `@knowledgeos/domain-types`
- `@knowledgeos/knowledge-graph` → `@knowledgeos/kernel`, `@knowledgeos/search`, `@knowledgeos/storage`
- `@knowledgeos/library` → `@knowledgeos/domain`
- `@knowledgeos/ocr` → `@knowledgeos/import`, `@knowledgeos/kernel`, `@knowledgeos/library`, `@knowledgeos/search`, `@knowledgeos/storage`
- `@knowledgeos/plugin` → `@knowledgeos/ai`, `@knowledgeos/export`, `@knowledgeos/import`, `@knowledgeos/kernel`, `@knowledgeos/search`, `@knowledgeos/workspace`
- `@knowledgeos/search` → `@knowledgeos/kernel`, `@knowledgeos/library`, `@knowledgeos/storage`
- `@knowledgeos/storage` → `@knowledgeos/kernel`
- `@knowledgeos/sync` → `@knowledgeos/kernel`, `@knowledgeos/library`, `@knowledgeos/storage`
- `@knowledgeos/workspace` → `@knowledgeos/ai`, `@knowledgeos/kernel`, `@knowledgeos/knowledge-graph`, `@knowledgeos/library`, `@knowledgeos/search`

## Cycles

None detected.
