# State Diagrams

## Document Import State

```mermaid
stateDiagram-v2

[*] --> Selected

Selected --> Parsing

Parsing --> Validating

Validating --> Persisting

Persisting --> Completed

Parsing --> Failed

Validating --> Failed

Persisting --> Failed

Completed --> [*]

Failed --> [*]
```
