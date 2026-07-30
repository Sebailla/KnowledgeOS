# ADR-002 — Universal Document Model

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-002 — Universal Document Model

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

KnowledgeOS must ingest heterogeneous documents while preserving semantic structure independently from original file formats and presentation. Treating PDFs, EPUBs, web pages and notes as unrelated internal models would fragment search, annotation, knowledge relationships and export.

# 2. Decision

KnowledgeOS shall use the Universal Document Model (UDM) as the canonical semantic and structural representation of document content. UDM nodes use stable identity, explicit types, attributes, temporal semantics, validation and serialization. Source formats are imported into UDM rather than becoming permanent internal architectures.

# 3. Decision Drivers

* A unified semantic basis for search, annotation and knowledge processing.
* Import and export formats remain adapters around a stable model.
* Document meaning is independent from file path and presentation.

# 4. Considered Alternatives

* Preserve each source format as the internal model: rejected due to fragmentation.
* Use plain Markdown as the universal model: rejected because it cannot preserve all required structure and semantics.

# 5. Positive Consequences

* A unified semantic basis for search, annotation and knowledge processing.
* Import and export formats remain adapters around a stable model.
* Document meaning is independent from file path and presentation.

# 6. Negative Consequences and Trade-offs

* Import fidelity requires sophisticated normalization.
* The model must evolve with explicit compatibility rules.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../02-Domain/UDM/UDM.md`
* `../../02-Domain/UDM/README.md`
* `../../02-Domain/DomainModel.md`
* `../../05-Integration/DataExchange/CanonicalExchange.md`

# 10. Status

**Accepted**

This ADR establishes **Canonical Universal Document Model** as an active architectural decision for KnowledgeOS V3.
