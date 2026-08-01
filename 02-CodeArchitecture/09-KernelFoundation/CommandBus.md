# Command Bus

The command bus routes one command type to exactly one handler.

Requirements:

- duplicate registration fails;
- missing handlers fail explicitly;
- cancellation is checked before execution;
- middleware wraps execution deterministically;
- command handlers return receipts;
- transaction policy is composed outside business contracts.
