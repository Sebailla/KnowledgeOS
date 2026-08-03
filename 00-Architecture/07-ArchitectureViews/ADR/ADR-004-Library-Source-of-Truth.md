# ADR-004 — Library Source of Truth

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Earlier designs treated the NAS as a shared filesystem and device libraries as replicas.

## 2. Decision

The NAS KnowledgeOS Server is authoritative for the Master Catalog, source publications and master metadata. Local Libraries are authoritative only for device membership and availability.

## 3. Consequences

Clarifies scoped authority and removes bidirectional library replication.

## 4. Supersession

Amended by ADR-013.

## 5. Status

**Accepted**
