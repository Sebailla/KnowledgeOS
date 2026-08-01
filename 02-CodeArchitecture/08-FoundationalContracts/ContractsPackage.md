# Contracts Package

## Purpose

`@knowledgeos/contracts` defines the versioned public message surface for Commands, Queries, Events and DTOs.

## Rules

- Contracts are immutable.
- Contracts are serializable.
- Contracts never expose repositories, database rows, file handles or provider SDK types.
- Every request carries operation and correlation context.
- Retryable mutations support idempotency.
- Events follow committed state.
- Personal Knowledge synchronization excludes publication payloads and Master Catalog records.
