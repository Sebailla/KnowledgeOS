# Event Bus

The event bus publishes committed Domain or Integration events.

The in-memory implementation is suitable for tests and single-process composition. Durable delivery requires an Infrastructure adapter implementing the same logical contract.
