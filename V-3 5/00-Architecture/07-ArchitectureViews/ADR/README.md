# Architecture Decision Records

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views

**Document:** Architecture Decision Records

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This directory contains the active Architecture Decision Record baseline for KnowledgeOS Architecture V3.

The source archive supplied for consolidation did not include the earlier ADR files themselves. The V3 set was therefore reconstructed from the approved normative architecture and the historical ADR titles recorded in Governance. These records define the active V3 decisions; they do not claim verbatim preservation of missing earlier documents.

# 2. Decision Authority

ADRs explain significant architectural choices and their consequences. Normative documents define the complete operating contracts. If an ADR and a newer approved normative document conflict, Governance shall determine whether the ADR requires clarification or supersession.

# 3. Active ADR Index

| ID | Decision | Status |
|---|---|---|
| ADR-001 | [Architecture Style](ADR-001-Architecture-Style.md) | Accepted |
| ADR-002 | [Universal Document Model](ADR-002-Universal-Document-Model.md) | Accepted |
| ADR-003 | [Offline First](ADR-003-Offline-First.md) | Accepted |
| ADR-004 | [Library Source of Truth](ADR-004-Library-Source-of-Truth.md) | Accepted |
| ADR-005 | [Engine-Based Architecture](ADR-005-Engine-Based-Architecture.md) | Accepted |
| ADR-006 | [AI Architecture](ADR-006-AI-Architecture.md) | Accepted |
| ADR-007 | [Plugin Architecture](ADR-007-Plugin-Architecture.md) | Accepted |
| ADR-008 | [Storage Architecture](ADR-008-Storage-Architecture.md) | Accepted |
| ADR-009 | [Synchronization Strategy](ADR-009-Synchronization-Strategy.md) | Accepted |
| ADR-010 | [Document Identity](ADR-010-Document-Identity.md) | Accepted |
| ADR-011 | [Event Architecture](ADR-011-Event-Architecture.md) | Accepted |
| ADR-012 | [Public Contracts](ADR-012-Public-Contracts.md) | Accepted |

# 4. Lifecycle

Accepted ADRs shall not be silently rewritten to represent a different historical decision. A changed decision requires a new ADR that explicitly supersedes the previous record. Editorial corrections and reference repairs may be applied without changing the decision.

# 5. Invariants

* Every ADR has a stable identifier.
* Accepted identifiers are not reused.
* Decisions remain traceable to normative documents.
* Missing historical source text is never fabricated as verbatim history.
* Supersession preserves prior records.

# 6. Related Documents

* `../README.md`
* `../../08-Governance/README.md`
* `../../08-Governance/ArchitectureDecisionMatrix.md`
* `../../08-Governance/ArchitectureV3MigrationPlan.md`

# 7. Status

**Approved**

This index defines the active Architecture V3 ADR baseline.
