# ADR-005 — Engine-Based Architecture

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-005 — Engine-Based Architecture

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

Major capabilities such as Import, Library, Search, Render, Sync, Annotation, AI and Plugins require stable ownership. Generic services or direct module calls would make responsibility diffuse and allow infrastructure or provider code to absorb product semantics.

# 2. Decision

Each major Platform capability shall be owned by a named Engine with explicit responsibilities, contracts, lifecycle, invariants and prohibited behavior. Engines coordinate through approved Kernel and contract mechanisms. Engines do not directly own concrete Providers and do not bypass Integration boundaries.

# 3. Decision Drivers

* Clear capability ownership.
* Provider replacement does not redefine product semantics.
* Engine boundaries support testing and future platform-specific implementations.

# 4. Considered Alternatives

* Generic service layer: rejected because ownership becomes ambiguous.
* One large application core: rejected because capability boundaries and failure isolation weaken.

# 5. Positive Consequences

* Clear capability ownership.
* Provider replacement does not redefine product semantics.
* Engine boundaries support testing and future platform-specific implementations.

# 6. Negative Consequences and Trade-offs

* Engine contracts add design overhead.
* Cross-engine workflows require explicit orchestration.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../02-Domain/EngineResponsibilities.md`
* `../../04-Platform/README.md`
* `../../03-Kernel/KernelArchitecture.md`

# 10. Status

**Accepted**

This ADR establishes **Platform Capabilities Owned by Engines** as an active architectural decision for KnowledgeOS V3.
