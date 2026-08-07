# Release Provenance

KnowledgeOS release source archives embed `release/1.0.0-rc.1/SourceManifest.json`.

The manifest records every source entry, its type, byte size and SHA-256 digest. The manifest intentionally excludes itself to avoid a self-referential checksum.

Release publication is blocked when:

- a declared file is missing;
- a file differs in size or SHA-256;
- an undeclared file appears in the source archive;
- the archive checksum file is missing or invalid;
- the manifest entry count is inconsistent.

Commands:

```bash
pnpm repro:source
pnpm rc1:provenance
```
