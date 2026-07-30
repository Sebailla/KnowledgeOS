# ADR-012 — Public Contracts

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-012 — Public Contracts

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

KnowledgeOS may expose Local API, REST, GraphQL and Plugin SDK contracts. Publishing internal Domain objects, Kernel messages or provider-specific schemas would couple consumers to implementation details and make evolution unsafe.

# 2. Decision

Public contracts shall be explicit, versioned and separate from internal Domain, Kernel and Provider contracts. Public APIs use governed authentication, error, pagination and compatibility conventions. Internal buses are not public APIs. Breaking changes require a new compatible version or governed migration.

# 3. Decision Drivers

* External consumers receive stable intentional contracts.
* Internal architecture can evolve without leaking implementation details.
* Security and compatibility are reviewed at the boundary.

# 4. Considered Alternatives

* Expose internal objects directly: rejected due to coupling and security risks.
* One unversioned API: rejected because breaking evolution becomes uncontrolled.

# 5. Positive Consequences

* External consumers receive stable intentional contracts.
* Internal architecture can evolve without leaking implementation details.
* Security and compatibility are reviewed at the boundary.

# 6. Negative Consequences and Trade-offs

* Contract mapping and version maintenance add work.
* Premature stabilization can create unnecessary obligations.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../05-Integration/PublicAPI/APIConventions.md`
* `../../05-Integration/PublicAPI/Versioning.md`
* `../../05-Integration/PublicAPI/Authentication.md`
* `../../05-Integration/PluginSDK/Contracts.md`

# 10. Status

**Accepted**

This ADR establishes **Versioned Public Contracts Separate from Internals** as an active architectural decision for KnowledgeOS V3.
