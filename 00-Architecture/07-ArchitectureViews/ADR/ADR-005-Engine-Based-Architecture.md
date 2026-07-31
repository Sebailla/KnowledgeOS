# ADR-005 — Engine-Based Architecture

**Project:** KnowledgeOS  
**Section:** Architecture Views / ADR  
**Version:** 4.0  
**Status:** Accepted  
**Author:** KnowledgeOS Team  

---

## 1. Context

Platform capabilities require clear ownership.

## 2. Decision

Organize Platform into Engines: Library, Import, Export, Knowledge, Search, Render, Annotation, Sync, AI and Plugin. Each Engine owns one capability and private state.

## 3. Consequences

Prevents hidden coupling; requires public commands, queries, events and workflows.

## 4. Supersession

None

## 5. Status

**Accepted**
