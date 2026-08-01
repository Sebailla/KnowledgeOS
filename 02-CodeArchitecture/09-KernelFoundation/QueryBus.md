# Query Bus

The query bus routes side-effect-free query contracts to one handler.

Requirements:

- queries do not mutate Domain state;
- query handlers return typed results;
- pagination and ordering remain contract responsibilities;
- cancellation propagates;
- middleware may add authorization, tracing and metrics.
