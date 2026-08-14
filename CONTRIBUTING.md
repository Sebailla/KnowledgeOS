# Contributing to KnowledgeOS

## Required workflow

1. Start from the current `develop` branch.
2. Implement one coherent architectural block.
3. Keep Domain and Platform boundaries intact.
4. Run strict TypeScript compilation and relevant tests.
5. Update documentation, `CHANGELOG.md` and `VERSION`.
6. Commit only after validation succeeds.

## Branch flow

- `main` is reserved for production releases only.
- `develop` is the shared development and integration branch.
- Feature and fix branches SHALL start from `develop` and open pull requests to `develop`.
- Do not create temporary Git worktrees for the regular development workflow.

## Commit convention

```text
<type>(<scope>): <description>
```

Recommended types:

- `feat`
- `fix`
- `refactor`
- `docs`
- `test`
- `build`
- `chore`

Example:

```text
feat(sync): persist resumable transfer checkpoints
```

## Non-negotiable rules

- No secrets or environment files.
- No `node_modules`, build outputs or local caches.
- No direct infrastructure dependency from Domain packages.
- No silent modification of frozen architecture decisions.
- No partial ZIP used as a new repository baseline.
