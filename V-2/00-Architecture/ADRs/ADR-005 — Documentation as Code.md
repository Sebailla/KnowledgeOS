
# ADR-005

# Documentation as Code

Status: Accepted

---

# Context

KnowledgeOS is expected to evolve over many years.

Architecture documentation must evolve together with the implementation.

---

# Decision

Architecture documentation is treated as source code.

Documentation is versioned.

Documentation is reviewed.

Documentation participates in pull requests.

PlantUML is the canonical source for diagrams.

Markdown documents describe architectural intent.

---

# Consequences

Benefits

- Documentation remains synchronized
- Better onboarding
- Traceable architecture
- Reproducible diagrams

Trade-offs

- Additional maintenance effort
- Documentation becomes part of the development workflow

---

# Alternatives

Wiki-based documentation

Rejected.

Generated documentation only

Rejected.

---

# Related Documents

DocumentationStandard.md
DiagramStandards.md
