# ADR-011 — Event Architecture

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-011 — Event Architecture

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

KnowledgeOS requires decoupled reactions to completed facts, but earlier service-oriented designs can blur intent, facts and reads. This creates unclear retries, ordering and ownership.

# 2. Decision

KnowledgeOS shall distinguish Commands, Queries and Events semantically. Commands express intent and have one governed handler. Queries request information without intentional canonical mutation. Events represent facts and may have multiple Consumers. Event processing shall use explicit identity, ordering scope, retry, idempotency and durability semantics where required.

# 3. Decision Drivers

* Clear handling and failure semantics.
* Engines can react without direct coupling.
* Durable processing and observability are possible.

# 4. Considered Alternatives

* Generic message bus with no semantic categories: rejected because contracts become ambiguous.
* Direct synchronous calls for all reactions: rejected due to coupling and failure propagation.

# 5. Positive Consequences

* Clear handling and failure semantics.
* Engines can react without direct coupling.
* Durable processing and observability are possible.

# 6. Negative Consequences and Trade-offs

* Eventual consistency must be designed explicitly.
* Duplicate delivery and consumer ordering require protection.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../06-Execution/Messaging/Commands.md`
* `../../06-Execution/Messaging/Queries.md`
* `../../06-Execution/Messaging/Events.md`
* `../../03-Kernel/EventBus.md`

# 10. Status

**Accepted**

This ADR establishes **Facts, Commands and Queries Remain Distinct** as an active architectural decision for KnowledgeOS V3.
