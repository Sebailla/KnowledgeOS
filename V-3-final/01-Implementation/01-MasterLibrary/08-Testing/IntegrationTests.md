# IntegrationTests

## Status

Draft — pending content.

## Purpose

This document specifies how integration tests are organized for the KnowledgeOS V-3 Master Library: the boundaries between modules that integration tests exercise, the environments they rely on, and the patterns that keep them stable. Integration tests sit between unit tests and end-to-end tests.

## Sections

- **Integration boundaries** — the pairs of components that integration tests are written against.
- **Test doubles and fakes** — the policy on which dependencies are real and which are faked.
- **Setup and teardown** — the shared environment lifecycle used across integration tests.
- **Performance and stability** — the rules that keep integration suites tractable in CI.

## Open Questions

- [ ] Are integration tests allowed to hit shared infrastructure, or must everything be local?
- [ ] How are schema or contract migrations tested at the integration layer?
- [ ] Who is responsible for triaging integration test failures?
