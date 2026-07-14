# AcquisitionContracts

## Status

Draft — pending content.

## Purpose

This document specifies the acquisition contracts of the KnowledgeOS V-3 Master Library: the operations and data shapes that govern how catalog entries are obtained, queued, downloaded, and verified by a client. The contracts cover both the request lifecycle and the failure modes.

## Sections

- **Acquisition lifecycle** — the named phases an acquisition moves through from request to completion.
- **Request and result shapes** — the inputs and outputs of each acquisition operation.
- **Failure and retry semantics** — how transient and permanent failures are reported and handled.
- **Verification** — how the acquired payload is validated against the catalog declaration.

## Open Questions

- [ ] Are acquisitions synchronous, asynchronous, or background-job based?
- [ ] What is the maximum payload size supported by a single acquisition?
- [ ] How are partial or resumable acquisitions modelled?
