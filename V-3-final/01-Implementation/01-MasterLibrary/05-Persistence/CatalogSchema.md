# CatalogSchema

## Status

Draft — pending content.

## Purpose

This document specifies the schema of the KnowledgeOS V-3 Master Library catalog: the logical model of catalog entries, the mandatory and optional fields, and the validation rules attached to each field. The schema is the authoritative definition that the API contracts and on-disk layout both conform to.

## Sections

- **Logical model** — the entities and references that compose a catalog entry.
- **Field catalogue** — the full list of fields with type, cardinality, and constraints.
- **Relationships and references** — how catalog entries reference each other and external resources.
- **Schema versioning** — how the schema evolves and how older versions remain readable.

## Open Questions

- [ ] Is the schema defined primarily by code, by an external schema language, or both?
- [ ] Are there pre-existing fields from V-2 that must remain available for compatibility?
- [ ] How are custom or user-defined fields handled?
