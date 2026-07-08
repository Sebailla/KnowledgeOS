
# ADR-004

# Domain Model

Status: Accepted

---

# Context

KnowledgeOS manages knowledge.

The business concepts must remain independent from infrastructure, frameworks and user interfaces.

---

# Decision

KnowledgeOS adopts a shared Domain Model.

All Engines operate on the same domain language.

Business rules belong exclusively to the Domain Model.

Infrastructure concerns are excluded.

---

# Consequences

Benefits

- Consistent language
- Reduced duplication
- Easier testing
- Better maintainability

Trade-offs

- Requires careful evolution
- Domain changes affect multiple modules

---

# Alternatives

Independent models per Engine

Rejected.

Anemic domain model

Rejected.

---

# Related Documents

ArchitectureModel.md
DomainModel.md
