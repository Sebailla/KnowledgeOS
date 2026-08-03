# Web Application

**Project:** KnowledgeOS  
**Section:** Implementation  
**Document:** 04-WebApplication/README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document is the rector index for `01-Implementation/04-WebApplication`.

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
- [`03-Library`](03-Library/README.md)
- [`04-Reading`](04-Reading/README.md)
- [`05-PersonalKnowledge`](05-PersonalKnowledge/README.md)
- [`06-Testing`](06-Testing/README.md)
- [`07-Operations`](07-Operations/README.md)

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
