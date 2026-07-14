# 05-Persistence README

## Scope

This folder contains the persistence artifacts for the KnowledgeOS V-3 Master Library: the on-disk layout of a Master Library, the catalog schema, the storage strategy for source artifacts, and the storage strategy for local libraries maintained by clients. Together they define how state is durably represented on disk.

## Index

- [MasterLibraryLayout](./MasterLibraryLayout.md)
- [CatalogSchema](./CatalogSchema.md)
- [SourceStorage](./SourceStorage.md)
- [LocalLibraryStorage](./LocalLibraryStorage.md)

## How to use this section

The files inside this section are drafts to be filled in during planning. The Master Library layout and catalog schema describe the authoritative state on the server; Source Storage describes how artifacts are durably stored; Local Library Storage describes what clients keep on their own disk. Update them as the persistence design matures.
