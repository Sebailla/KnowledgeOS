# ADR-010 — Document Identity

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Paths, filenames and checksums cannot provide stable semantic identity.

## 2. Decision

Use opaque, immutable, typed domain identities independent of storage. External identifiers are aliases; entity and version identities are distinct.

## 3. Consequences

Supports migration, acquisition, anchoring and sync; requires identity registry and lineage.

## 4. Supersession

None

## 5. Status

**Accepted**
