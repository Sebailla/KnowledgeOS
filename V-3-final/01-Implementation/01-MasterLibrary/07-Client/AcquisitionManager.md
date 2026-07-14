# AcquisitionManager

## Status

Draft — pending content.

## Purpose

This document describes the acquisition manager of the KnowledgeOS V-3 Master Library client: how acquisition requests are queued, executed, monitored, retried, and surfaced to the user. It is the operational surface between the contract and the local library.

## Sections

- **Request lifecycle** — how an acquisition enters the queue and reaches completion.
- **Concurrency and prioritization** — how multiple concurrent acquisitions are scheduled.
- **Progress and reporting** — how progress, throughput, and remaining work are communicated to the user.
- **Failure recovery** — how transient and permanent failures are detected, retried, or escalated.

## Open Questions

- [ ] What is the maximum concurrent acquisition count the client supports?
- [ ] Are acquisitions resumable across client restarts in V-3?
- [ ] How are user-initiated cancellations distinguished from system retries?
