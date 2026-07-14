# Entities

## Status

Draft — pending content.

## Purpose

This document specifies the entities of the KnowledgeOS V-3 Master Library domain: the objects with identity and lifecycle, their attributes, and the behaviors they own. Each entity entry is precise enough to drive implementation and tests without ambiguity.

## Sections

- **Entity catalogue** — the full list of entities with a short definition for each.
- **Identifiers and identity** — how identity is established and preserved for each entity.
- **Behaviors** — the methods owned by each entity and the rules they enforce.
- **Entity relationships** — how entities reference one another within the domain.

## Open Questions

- [ ] Which entity holds the aggregate root for catalog operations?
- [ ] How is identity generated — derived, sequential, or external?
- [ ] Are there entities whose lifecycle is owned by another bounded context?
