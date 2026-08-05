# USP 1.0 — Frozen Contract

USP protocol major version `1` is frozen for KnowledgeOS 0.42.0-rc.1.

Rules:

- Existing required fields cannot be removed or reinterpreted.
- New optional fields must be ignored safely by older compatible implementations.
- Unknown major versions must be rejected.
- Operation identifiers remain idempotency keys.
- Cursor and checkpoint progression must be monotonic.
- Serialization used for checksums must remain deterministic.
