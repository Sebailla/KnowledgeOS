# AGENTS

This file applies to `01-Implementation/09-KnowledgeProcessingPipeline`.

- The module processes locally registered publications into canonical UDM and DPM.
- Original source bytes SHALL remain immutable.
- Canonical processing SHALL be deterministic for fixed inputs and versions.
- Retryable stages SHALL be idempotent.
- Derived artifacts SHALL remain rebuildable.
- AI or statistical results SHALL not become canonical automatically.
- Every stage SHALL preserve provenance, identity and version information.
- Partial failures SHALL not publish inconsistent canonical state.
