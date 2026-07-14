# TestStrategy

## Status

Draft — pending content.

## Purpose

This document defines the overall testing strategy for the KnowledgeOS V-3 Master Library: the testing pyramid, the layers, the targets for each layer, and the responsibilities of contributors for keeping the suite reliable. It is the source of truth for testing decisions and trade-offs.

## Sections

- **Testing pyramid** — the relative weight and purpose of each test layer.
- **Layer targets** — the specific goals, ownership, and exit criteria per layer.
- **Test data and isolation** — how tests are isolated from each other and from production data.
- **Quality of the suite** — the policies that keep the test suite fast, stable, and trustworthy.

## Open Questions

- [ ] What is the agreed coverage target at each layer?
- [ ] Are flaky tests tolerated as known issues, or must they be fixed immediately?
- [ ] Who owns the responsibility for keeping the suite green in CI?
