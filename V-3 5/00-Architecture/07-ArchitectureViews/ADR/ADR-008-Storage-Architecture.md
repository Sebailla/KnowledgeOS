# ADR-008 — Storage Architecture

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views / ADR

**Document:** ADR-008 — Storage Architecture

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

KnowledgeOS requires NAS canonical storage, local durable replicas, disposable caches, temporary processing files and derived artifacts. Treating these storage roles as one undifferentiated persistence layer would create competing authority and unsafe cleanup behavior.

# 2. Decision

Storage shall distinguish canonical storage, local replica storage, cache storage, temporary storage and derived artifact storage. Storage access shall use governed Storage Provider contracts. The Library Engine owns Library semantics and Source-of-Truth policy; Storage Providers provide capabilities but do not select canonical authority.

# 3. Decision Drivers

* Storage roles and cleanup rules are explicit.
* Provider technologies remain replaceable.
* A cache cannot silently become canonical.

# 4. Considered Alternatives

* Single database for every storage role: rejected because authority and lifecycle semantics differ.
* Direct filesystem access from Engines: rejected because it bypasses contracts and portability.

# 5. Positive Consequences

* Storage roles and cleanup rules are explicit.
* Provider technologies remain replaceable.
* A cache cannot silently become canonical.

# 6. Negative Consequences and Trade-offs

* More metadata is required to track replicas and pending changes.
* Storage migrations require explicit compatibility and validation.

# 7. Compliance and Validation

Conformance shall be validated through architecture review, contract tests, dependency checks and implementation evidence appropriate to this decision. Any implementation that requires violating the decision shall return to Architecture Governance rather than creating an undocumented exception.

# 8. Migration Impact

Earlier documents, diagrams and implementation assumptions shall be mapped to this decision during V3 consolidation. Incompatible historical artifacts shall be marked superseded or archived rather than retained as competing active authority.

# 9. Related Documents

* `../../05-Integration/Storage/README.md`
* `../../05-Integration/Providers/StorageProviders.md`
* `../../04-Platform/Library/README.md`
* `../../06-Execution/Performance/CacheStrategy.md`

# 10. Status

**Accepted**

This ADR establishes **Provider-Based Storage with Canonical Authority Separation** as an active architectural decision for KnowledgeOS V3.
