# SourceStorage

## Status

Draft — pending content.

## Purpose

This document describes how the KnowledgeOS V-3 Master Library stores source artifacts: the files that catalog entries reference and that clients ultimately acquire. It covers content addressing, deduplication, integrity verification, and storage layout.

## Sections

- **Storage model** — how source artifacts are addressed and addressed-storage boundaries.
- **Integrity and verification** — the checksums, signatures, or checks used to detect corruption.
- **Deduplication and compaction** — how identical or overlapping content is stored once.
- **Lifecycle** — how artifacts are added, retained, and eventually retired.

## Open Questions

- [ ] Is content addressed (hash-keyed) or path-keyed?
- [ ] What is the largest single source artifact that must be supported?
- [ ] Are source artifacts immutable once stored, or can they be replaced?
