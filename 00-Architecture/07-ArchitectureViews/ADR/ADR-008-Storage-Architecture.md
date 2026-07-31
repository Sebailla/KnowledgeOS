# ADR-008 — Storage Architecture

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

NAS and clients require different persistence profiles.

## 2. Decision

NAS runs KnowledgeOS Server and PostgreSQL in separate containers with independent persistent volumes for database and authoritative files. Clients use local repositories for offline operation.

## 3. Consequences

Improves recovery and replaceability; requires repository contracts and coordinated backups.

## 4. Supersession

None

## 5. Status

**Accepted**
