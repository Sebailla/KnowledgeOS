# ADR-010 — Document Identity

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-010 — Document Identity

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

Documents, Knowledge Objects and nodes may move, be renamed, synchronized, reimported and represented differently. File paths, filenames and content hashes alone cannot provide durable identity across these operations.

# 2. Decision

KnowledgeOS shall use stable logical identifiers for Knowledge Objects, Documents and model nodes within explicit scopes. Identity remains distinct from paths, addresses, versions and content fingerprints. Mappings and provenance connect source locations and representations to stable identity.

# 3. Decision Drivers

* Renames and storage moves do not break relationships or annotations.
* Synchronization can reason about entities rather than paths.
* UDM and DPM mappings remain stable across representation changes.

# 4. Considered Alternatives

* File path identity: rejected because paths are mutable.
* Content hash identity: rejected as sole identity because legitimate edits change hashes and identical content may represent distinct objects.

# 5. Positive Consequences

* Renames and storage moves do not break relationships or annotations.
* Synchronization can reason about entities rather than paths.
* UDM and DPM mappings remain stable across representation changes.

# 6. Negative Consequences and Trade-offs

* Identity assignment and duplicate detection need explicit policies.
* Imported copies may require user- or policy-driven reconciliation.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../02-Domain/Identity/README.md`
* `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../02-Domain/UDM/Core/Identity.md`
* `../../02-Domain/DPM/Core/PresentationIdentity.md`

# 10. Status

**Accepted**

This ADR establishes **Stable Logical Identity Independent of Location** as an active architectural decision for KnowledgeOS V3.
