# Idempotency and Retry

Idempotency records the stable operation behind retryable effects.

Retry:

- checks cancellation before each attempt;
- uses a declared policy;
- never changes Domain authority;
- reconciles unknown external commit state in higher-level adapters;
- remains separate from business decisions.
