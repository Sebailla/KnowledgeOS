# CatalogContracts

## Status

Draft — pending content.

## Purpose

This document specifies the catalog contracts of the KnowledgeOS V-3 Master Library: the operations and data shapes that govern how catalog entries are listed, queried, retrieved, and described. The contracts here sit on top of the generic Server API and inherit its conventions.

## Sections

- **Catalog domain** — the catalog resources and their relationships to the domain model.
- **Read operations** — the queries used to list and inspect catalog entries.
- **Write operations** — the commands used to create, update, or retire catalog entries.
- **Pagination and filtering** — how large catalogs are navigated consistently.

## Open Questions

- [ ] Are there pre-built views or facets that the catalog must expose?
- [ ] What is the maximum supported cardinality of a single catalog query?
- [ ] Are catalog mutations audited, and if so where is the audit visible?
