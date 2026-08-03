# KnowledgeOS Master Repository Policy

## Single source of development truth

This repository is the only development tree for KnowledgeOS V5.

Every future implementation modifies this same repository. A new deliverable must never be built from an older ZIP or from a partial package collection.

## Cumulative snapshots

Release and development snapshots are cumulative.

A snapshot contains the complete repository state at its version and replaces every earlier snapshot for continued work.

Naming convention:

```text
KnowledgeOS-v<version>-snapshot.zip
```

## Versioning

- `VERSION` contains the current repository version.
- `CHANGELOG.md` records each accepted block.
- Development versions use `5.0.0-dev.N`.
- Release candidates use `5.0.0-rc.N`.
- The first stable V5 release is `5.0.0`.

## Git workflow

- `main` is the integration branch.
- Each implementation block uses a focused branch when published remotely.
- Commits must represent coherent architectural increments.
- Generated dependencies and local secrets are never committed.
- Every accepted increment must compile and include its validation report.

## Preservation rule

Existing approved architecture and completed implementation blocks are preserved unless an explicit migration or replacement decision is documented.
