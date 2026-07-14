# Errors

## Status

Draft — pending content.

## Purpose

This document defines the domain errors of the KnowledgeOS V-3 Master Library: the typed error conditions that the domain can produce, their meaning, and the situations in which they are raised. The catalogue is the source of truth that the API contracts map onto at the boundary.

## Sections

- **Error catalogue** — the full list of domain errors with a short definition for each.
- **Classification** — the grouping of errors by category (validation, conflict, not-found, etc.).
- **Recovery guidance** — what callers and operators should do when each error occurs.
- **Mapping to contracts** — how domain errors are surfaced through the API contracts.

## Open Questions

- [ ] Are errors represented as exception types, result types, or both?
- [ ] Which errors are considered fatal versus recoverable?
- [ ] Do domain errors carry structured details, and if so what schema?
