# Shared

**Project:** KnowledgeOS  
**Section:** Implementation  
**Document:** 05-Shared/README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document is the rector index for `01-Implementation/05-Shared`.

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

- [`01-Contracts`](01-Contracts/README.md)
- [`02-DomainTypes`](02-DomainTypes/README.md)
- [`03-Serialization`](03-Serialization/README.md)
- [`04-Validation`](04-Validation/README.md)
- [`05-ClientSDK`](05-ClientSDK/README.md)
- [`06-Observability`](06-Observability/README.md)
- [`07-Testing`](07-Testing/README.md)

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
