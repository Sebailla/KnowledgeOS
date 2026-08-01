# @knowledgeos/kernel

Execution mechanisms shared by server and tools.

## Owns

- command dispatch;
- query dispatch;
- event publication;
- execution context;
- cancellation;
- clock and ID generation;
- middleware;
- idempotency;
- retry primitives;
- Unit of Work abstraction.

## Does not own

- business policy;
- repositories;
- Platform Engine behavior;
- provider integration;
- UI state.

The Kernel depends only on `@knowledgeos/domain-types` and `@knowledgeos/contracts`.
