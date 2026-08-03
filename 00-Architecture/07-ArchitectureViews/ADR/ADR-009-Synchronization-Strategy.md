# ADR-009 — Synchronization Strategy

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Personal state must converge across Apple devices without turning NAS into a personal sync peer.

## 2. Decision

Synchronize Personal Knowledge among Local Libraries through provider-neutral Sync Engine using the iCloud/CloudKit profile. Publication payloads do not use this channel.

## 3. Consequences

Enables offline personal convergence; requires tombstones, versioning and conflict merge.

## 4. Supersession

Amended and clarified by ADR-013.

## 5. Status

**Accepted**
