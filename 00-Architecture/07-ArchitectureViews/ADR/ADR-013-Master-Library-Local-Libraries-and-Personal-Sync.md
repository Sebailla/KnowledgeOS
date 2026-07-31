# ADR-013 — Master Library, Selective Local Libraries and Personal Sync

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

KnowledgeOS distinguishes publication custody from personal reading and knowledge state. The NAS contains the complete private master catalog while Apple devices contain selected or locally discovered publications.

## 2. Decision

Adopt three independent scopes: NAS Master Library; selective device-local Libraries; Personal Knowledge synchronized among Apple devices via iCloud/CloudKit. Local Libraries are not replicas. Acquisition copies selected Master publications to Local. Personal state never returns to Master. Initial local setup may scan user-authorized device storage.

## 3. Consequences

Separates authority, storage and privacy. A publication may exist on one device and not another. NAS availability is unnecessary for Personal Knowledge synchronization. Acquisition and synchronization are distinct workflows.

## 4. Supersession

Supersedes interpretations of ADR-004, ADR-008 and ADR-009 that treated Local Libraries as NAS replicas or NAS as a Personal Knowledge synchronization peer.

## 5. Status

**Accepted**
