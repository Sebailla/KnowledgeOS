# AGENTS

This file applies to `00-Architecture/03-Kernel`.

- Kernel owns execution mechanisms, not business policy.
- Commands, queries, events, workflows, jobs, scheduling and observability SHALL preserve Domain authority.
- Retryable execution SHALL be idempotent.
- Long-running work SHALL be durable and recoverable.
- Kernel changes that alter delivery, ordering, transaction or recovery guarantees require architecture review.
