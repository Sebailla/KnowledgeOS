# MasterLibraryLayout

## Status

Draft — pending content.

## Purpose

This document describes the on-disk layout of a KnowledgeOS V-3 Master Library: the directory structure, the file naming conventions, and the role of each top-level folder. It is the reference that every persistence- or tooling-related decision in this module starts from.

## Sections

- **Top-level folders** — what each directory at the Master Library root contains.
- **Naming conventions** — the rules for naming files and subdirectories consistently.
- **Sidecar and metadata files** — the optional files that accompany primary artifacts.
- **Versioning on disk** — how schema or layout changes are recorded so older data remains readable.

## Open Questions

- [ ] Is the Master Library layout a single tree or a federation of related trees?
- [ ] Are there files that must be excluded from version control or backups?
- [ ] Which files are append-only versus mutable?
