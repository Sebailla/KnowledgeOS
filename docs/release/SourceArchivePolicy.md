# Source Archive Policy

The complete cumulative ZIP is a working-state transfer and may contain local Git metadata or runtime evidence. It is not the distributable source artifact.

Release source archives must be generated with:

```bash
scripts/reproducibility/create-source-archive.sh
```

The generated archive excludes Git metadata, dependencies, build products, caches, local KnowledgeOS data, E2E runtime output and prior artifacts. File ordering, timestamps and ZIP metadata are normalized so two archives generated from the same source state have the same SHA-256 checksum.

Validation:

```bash
scripts/reproducibility/verify-source-archive-reproducibility.sh
```
