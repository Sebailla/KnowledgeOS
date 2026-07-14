# States

## Status

Draft — pending content.

## Purpose

This document enumerates the states and state transitions that entities in the KnowledgeOS V-3 Master Library domain can occupy. Each entity with a non-trivial lifecycle has its state machine defined here, including the events that drive transitions and the guards that must hold.

## Sections

- **State catalogues** — the named states for each lifecycle-bearing entity.
- **Transition diagrams** — the permitted transitions and the events that trigger them.
- **Guards and preconditions** — the conditions that must hold for a transition to be allowed.
- **Side effects** — the observable effects that accompany each transition.

## Open Questions

- [ ] Which entities actually require state machines in V-3, versus implicit lifecycles?
- [ ] Are state transitions themselves recorded as events, and if so where?
- [ ] How are illegal transitions reported to callers?
