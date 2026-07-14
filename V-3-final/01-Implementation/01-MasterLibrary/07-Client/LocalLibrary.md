# LocalLibrary

## Status

Draft — pending content.

## Purpose

This document describes the local library surface of the KnowledgeOS V-3 Master Library client: how the local on-disk library is presented, maintained, and reconciled with the user's expectations. It is the user-facing counterpart to `LocalLibraryStorage.md`.

## Sections

- **Library presentation** — how the local library is shown to the user.
- **Maintain and update** — how the user triggers sync, repair, or cleanup operations.
- **Storage limits** — how quotas and budgets are surfaced and enforced.
- **Conflict resolution** — how divergent local and remote states are presented to the user.

## Open Questions

- [ ] Does the local library have its own UI distinct from the catalog browser?
- [ ] What is the typical local library footprint that the UI should optimize for?
- [ ] Are read-only local libraries a supported mode in V-3?
