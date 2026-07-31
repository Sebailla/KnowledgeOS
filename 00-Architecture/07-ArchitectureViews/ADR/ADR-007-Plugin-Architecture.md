# ADR-007 — Plugin Architecture

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Extensibility must not compromise core invariants.

## 2. Decision

Use a capability-secured Plugin Engine and versioned Plugin SDK. Plugins use public contracts, namespaced extensions and least privilege.

## 3. Consequences

Supports extensibility while preserving isolation; increases compatibility and permission-management requirements.

## 4. Supersession

None

## 5. Status

**Accepted**
