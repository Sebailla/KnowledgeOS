
# ADR-003

# Plugin Architecture

Status: Accepted

---

# Context

KnowledgeOS must support long-term extensibility without modifying the core platform.

---

# Decision

All extensibility is provided through the Plugin SDK.

Extensions are isolated.

Extensions never depend on internal Platform components.

The SDK is the only supported integration boundary.

---

# Consequences

Benefits

- Stable API
- Independent extension development
- Safe upgrades
- Loose coupling

Trade-offs

- SDK evolution requires versioning
- Public contracts must remain stable

---

# Alternatives

Direct Engine integration

Rejected.

Reflection-based extensions

Rejected.

---

# Related Documents

ArchitectureModel.md
PluginSDK.md
