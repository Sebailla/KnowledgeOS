# Search And Discovery

**Project:** KnowledgeOS  
**Section:** Implementation  
**Document:** 11-SearchAndDiscovery/README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document is the rector index for `01-Implementation/11-SearchAndDiscovery`.

It defines the entry point to the module documentation and preserves traceability to the KnowledgeOS V4 architecture and implementation governance.

## 2. Authority

This module SHALL conform to:

- `00-Architecture`;
- accepted ADRs;
- `01-Implementation/00-Governance`;
- the module-specific `AGENTS.md`;
- public contracts owned by the corresponding Platform Engines.

The module SHALL NOT redefine Domain identity, authority, UDM, DPM, acquisition, Personal Knowledge synchronization or provider ownership.

## 3. Documentation Sections

- [`01-Requirements`](01-Requirements/README.md)
- [`02-Architecture`](02-Architecture/README.md)
- [`03-Indexing`](03-Indexing/README.md)
- [`04-Query`](04-Query/README.md)
- [`05-Ranking`](05-Ranking/README.md)
- [`06-Contracts`](06-Contracts/README.md)
- [`07-Persistence`](07-Persistence/README.md)
- [`08-Desktop`](08-Desktop/README.md)
- [`09-Mobile`](09-Mobile/README.md)
- [`10-Web`](10-Web/README.md)
- [`11-Testing`](11-Testing/README.md)
- [`12-Operations`](12-Operations/README.md)
- [`13-Completion`](13-Completion/README.md)

## 4. Common Invariants

- Stable KnowledgeOS identity is preserved.
- Master Library, Local Libraries and Personal Knowledge remain distinct.
- Acquisition and synchronization remain separate.
- Private repositories remain inaccessible across module boundaries.
- Persistent changes require migration and recovery guidance.
- Derived artifacts remain rebuildable.
- Security, privacy, observability and testing are part of completion.

## 5. Completion

The module is complete only when its requirements, design, contracts, persistence, execution, tests, operations and traceability satisfy the implementation Definition of Done.
