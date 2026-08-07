# Validation — Reproducible Source Archive

- Complete cumulative workspace preserved.
- Release source archive excludes Git metadata, dependencies, build output, caches, E2E runtime data and local KnowledgeOS data.
- ZIP entry ordering is deterministic.
- File timestamps are normalized.
- ZIP metadata is normalized with `zip -X`.
- Archive hygiene validation passes.
- Two independent source-archive generations produce the same SHA-256.
- Verified SHA-256: `3f40e0eb3ca34fd3e4cf1abd8d195621a4e23d987a4850d9efdf967b5cce5d54`.
- No product functionality changed.
- `pnpm-lock.yaml` remains the release reproducibility blocker.
