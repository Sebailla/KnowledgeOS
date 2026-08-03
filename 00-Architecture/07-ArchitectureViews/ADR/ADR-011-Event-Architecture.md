# ADR-011 — Event Architecture

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Engines require decoupled reactions to committed facts.

## 2. Decision

Use immutable, versioned Domain and integration events through Event Bus. Events follow commit; consumers are idempotent and ordering guarantees are scoped.

## 3. Consequences

Improves decoupling and replay; requires outbox, schema evolution and poison-event handling.

## 4. Supersession

None

## 5. Status

**Accepted**
