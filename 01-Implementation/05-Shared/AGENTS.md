# AGENTS

This file applies to `01-Implementation/05-Shared`.

- Shared code SHALL contain only cross-platform contracts, value types, serialization, validation, client SDK support and test utilities.
- Shared code SHALL NOT own business policy, storage, UI state or platform-specific services.
- Domain identity and authority SHALL remain aligned with `00-Architecture`.
- Platform-specific frameworks SHALL remain outside shared public contracts.
- Compatibility and round-trip behavior SHALL be tested across supported platforms.
