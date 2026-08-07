# Core Transport Lifecycle Specification

## Requirements

### Requirement: Deterministic Framed Transport

The transport MUST process newline-delimited JSON frames in order, including fragmented and coalesced input. It MUST reset its receive buffer after malformed or terminal failure so a replacement starts cleanly.

#### Scenario: Fragmented and coalesced frames

- GIVEN a valid frame arrives in fragments or multiple valid frames arrive together
- WHEN the transport receives the bytes
- THEN it SHALL emit each complete frame exactly once and in received order

#### Scenario: Malformed frame recovery

- GIVEN a malformed frame is received
- WHEN parsing fails
- THEN the transport SHALL report a typed failure and reset buffered input

### Requirement: Bounded Transport Failure

The transport MUST apply configured response timeouts. On silence, read termination, cancellation, or write failure it MUST reject work with a typed failure and MUST NOT leave it unresolved.

#### Scenario: Silent peer

- GIVEN a request has been sent and no response arrives before its timeout
- WHEN the timeout expires
- THEN the request SHALL fail with the timeout type

#### Scenario: Terminated peer

- GIVEN an active request and a terminated read stream
- WHEN termination is observed
- THEN the request SHALL fail with the termination type

### Requirement: Restart Cleanup

The bridge MUST release pending transport state when its Core process ends or is replaced. A restarted bridge MUST NOT receive frames, buffers, or pending requests from the prior process.

#### Scenario: Restart after active work

- GIVEN the Core process ends with pending work
- WHEN a replacement process starts
- THEN prior work SHALL be failed and the replacement SHALL start empty
