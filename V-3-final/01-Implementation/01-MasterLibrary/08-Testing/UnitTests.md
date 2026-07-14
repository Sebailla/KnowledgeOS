# UnitTests

## Status

Draft — pending content.

## Purpose

This document specifies how unit tests are written and organized for the KnowledgeOS V-3 Master Library. It defines the scope of a unit test, the conventions used to name and structure tests, and the patterns that make unit tests fast and deterministic.

## Sections

- **Definition and scope** — what counts as a unit test in this codebase.
- **Naming and structure** — the convention for naming files, test functions, and assertions.
- **Patterns and helpers** — the shared helpers, builders, and fixtures used to write tests.
- **Speed and determinism** — the rules that keep unit tests fast and reproducible.

## Open Questions

- [ ] Is the allowed set of dependencies in a unit test strictly limited to the module under test?
- [ ] Are there tests that must run in random order to expose ordering bugs?
- [ ] How are intentional exceptions documented inside the test code?
