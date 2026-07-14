# ValueObjects

## Status

Draft — pending content.

## Purpose

This document specifies the value objects of the KnowledgeOS V-3 Master Library domain: immutable types defined by their attributes rather than identity. Value objects capture domain primitives and small composites, with explicit validation rules attached.

## Sections

- **Value object catalogue** — the full list of value objects with a short definition for each.
- **Validation rules** — the invariants that every instance must satisfy at construction time.
- **Formatting and parsing** — how instances are rendered to and from external representations.
- **Composition** — how value objects are composed into entities and parameters.

## Open Questions

- [ ] Which value objects are reused across multiple bounded contexts?
- [ ] Are value objects required to be deeply immutable, or is shallow immutability sufficient?
- [ ] How are value objects versioned when their schema evolves?
