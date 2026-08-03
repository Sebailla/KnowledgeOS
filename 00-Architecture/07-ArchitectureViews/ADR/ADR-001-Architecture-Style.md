# ADR-001 — Architecture Style

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

KnowledgeOS requires long-lived separation between business meaning, execution infrastructure, external technology and client implementation.

## 2. Decision

Adopt a layered, modular, Engine-based architecture: Foundation → Domain → Kernel → Platform → Integration → Execution → Implementation. Dependencies point inward and cross-module collaboration uses explicit contracts.

## 3. Consequences

Improves replaceability, testing and architectural governance; requires more explicit contracts and mapping.

## 4. Supersession

None

## 5. Status

**Accepted**
