# ADR-004 — Library Source of Truth

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-004 — Library Source of Truth

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

The User requires ownership, portability and a durable mother Library independent from one application installation or cloud vendor. Multiple devices need an authoritative reconciliation target while continuing to work offline.

# 2. Decision

For the primary KnowledgeOS architecture, the configured NAS shall be the Library Source of Truth. Devices maintain governed local replicas and caches. A local replica may contain durable unsynchronized changes but does not silently become a competing Source of Truth. Cloud or alternative canonical modes require a future explicit architectural decision.

# 3. Decision Drivers

* User-controlled canonical storage.
* Device replacement does not transfer ownership to a vendor cloud.
* A clear authority exists for multi-device reconciliation.

# 4. Considered Alternatives

* Application-local database as Source of Truth: rejected because it binds the Library to one device.
* Vendor cloud as mandatory Source of Truth: rejected for ownership and lock-in reasons.

# 5. Positive Consequences

* User-controlled canonical storage.
* Device replacement does not transfer ownership to a vendor cloud.
* A clear authority exists for multi-device reconciliation.

# 6. Negative Consequences and Trade-offs

* NAS availability and failure recovery require explicit operational design.
* Local replicas and synchronization metadata become essential.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../01-Foundation/ProductVision.md`
* `../../04-Platform/Library/README.md`
* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Synchronization/README.md`

# 10. Status

**Accepted**

This ADR establishes **NAS as Primary Library Source of Truth** as an active architectural decision for KnowledgeOS V3.
