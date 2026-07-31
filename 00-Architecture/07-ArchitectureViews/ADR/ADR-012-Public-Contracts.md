# ADR-012 — Public Contracts

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Clients, plugins and integrations need stable access without private implementation coupling.

## 2. Decision

Expose versioned public commands, queries, events, DTOs and provider contracts. Private repositories and runtime types remain hidden.

## 3. Consequences

Supports evolution and testing; requires compatibility policy and mapping layers.

## 4. Supersession

None

## 5. Status

**Accepted**
