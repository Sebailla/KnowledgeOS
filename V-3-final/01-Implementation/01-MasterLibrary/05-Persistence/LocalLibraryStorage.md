# LocalLibraryStorage

## Status

Draft — pending content.

## Purpose

This document describes how a client stores its local copy of a KnowledgeOS V-3 Master Library: the on-disk layout, the partial-subscription model, and the mechanisms that keep the local copy consistent with the source. It is the client-side counterpart to the server-side persistence artifacts.

## Sections

- **Local layout** — the directories and files that make up a local library on disk.
- **Subscriptions** — how a client tracks which catalog entries it has chosen to keep.
- **Sync and reconciliation** — how the local copy is kept consistent with the server.
- **Cleanup and limits** — how the local library sheds unused content and respects local quotas.

## Open Questions

- [ ] Is the local library a single tree or split across multiple roots?
- [ ] What is the supported maximum size of a local library in V-3?
- [ ] How are conflicting local edits to shared metadata resolved?
