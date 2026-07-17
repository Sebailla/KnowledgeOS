# AGENTS.md — Review Rules

## Scope

This repository contains architectural documentation (Markdown specs, contracts, design docs) for KnowledgeOS. Most staged changes are `.md` documentation, NOT executable code.

## Review priorities

When `.ts/.js/.py/.go/.swift` files are staged:

- Validate naming and structure follow the documented patterns.
- Flag any business logic embedded in handlers (must live in domain layer).
- Flag any persistence or transport calls outside the contracts layer.

## Out of scope

- `.md` changes (architecture documentation, contracts, specs, design notes) — these are intentional authorial artifacts, not generated docs.
- Empty stubs created during structural bootstrapping.
- Renames or file deletions.

## Authoring guidelines

- All technical artifacts default to English.
- Commit messages follow Conventional Commits.
- No AI attribution (`Co-Authored-By`) in commits.