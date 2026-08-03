# Engine Responsibilities

**Project:** KnowledgeOS  
**Section:** Domain  
**Document:** EngineResponsibilities  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document defines ownership boundaries among KnowledgeOS Platform Engines.

It prevents duplicated responsibility, hidden coupling and architectural drift.

## 2. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 3. Engine Definition

An Engine is a Platform capability that implements one coherent business responsibility through explicit commands, queries, events, workflows and public contracts.

An Engine SHALL:

- own one primary capability;
- protect its invariants;
- expose explicit contracts;
- hide implementation details;
- depend on Domain contracts;
- use Kernel execution mechanisms;
- avoid direct access to another Engine's private state.

## 4. Library Engine

Owns:

- Master Library semantics;
- Local Library semantics;
- catalog membership;
- local availability;
- acquisition coordination;
- repository-facing library contracts;
- library integrity;
- library lifecycle.

Does not own:

- file parsing;
- OCR;
- Personal synchronization transport;
- rendering;
- search ranking;
- AI inference.

## 5. Import Engine

Owns:

- user-authorized device scanning;
- source intake;
- format detection;
- initial validation;
- duplicate evidence;
- metadata extraction;
- source registration preparation;
- import provenance.

Does not own:

- Master Catalog authority;
- local membership decisions;
- Personal synchronization;
- rendering;
- canonical graph storage.

## 6. Export Engine

Owns:

- export workflows;
- format-specific transformation;
- package assembly;
- loss reporting;
- identity and provenance preservation where supported.

Does not own:

- canonical source content;
- Knowledge Object authority;
- rendering runtime;
- Personal synchronization.

## 7. Search Engine

Owns:

- indexing;
- query planning;
- ranking;
- local and remote search contracts;
- index lifecycle;
- search projections.

Search indexes are derived.

The Search Engine SHALL NOT redefine canonical semantics.

## 8. Annotation Engine

Owns:

- annotation creation;
- highlights;
- bookmarks;
- sticky notes;
- drawings;
- anchor attachment;
- annotation conflict behavior;
- Personal Knowledge annotation contracts.

Annotations are Personal Knowledge.

They SHALL NOT be stored in the Master Library.

## 9. Render Engine

Owns:

- renderer-independent rendering orchestration;
- UDM/DPM interpretation;
- viewport projections;
- presentation adaptation;
- accessibility rendering contracts.

It does not own UDM or DPM semantics.

## 10. AI Engine

Owns:

- AI task orchestration;
- provider selection under policy;
- prompts and context preparation;
- derived AI artifacts;
- provenance;
- confidence and validation workflow;
- local/remote execution policy.

AI SHALL NOT become canonical authority automatically.

## 11. Plugin Engine

Owns:

- plugin lifecycle;
- capability grants;
- isolation;
- extension registration;
- compatibility;
- permissions;
- plugin observability.

Plugins SHALL NOT access private Engine internals.

## 12. Sync Engine

Owns:

- Personal Knowledge synchronization;
- change tracking;
- conflict detection;
- convergence;
- tombstones;
- synchronization provider abstraction;
- synchronization observability.

It SHALL NOT:

- synchronize Master Library publications;
- acquire publication payloads;
- write Personal Knowledge to the NAS;
- redefine Local Library membership.

## 13. Knowledge Engine

Owns:

- Knowledge Object coordination;
- semantic operations;
- Knowledge Graph projections;
- relationship commands;
- domain-level knowledge queries.

It does not own search infrastructure or AI inference.

## 14. Platform-Wide Rules

**ER-R001** — Each responsibility SHALL have one owner.

**ER-R002** — Engines SHALL communicate through explicit contracts.

**ER-R003** — Engines SHALL NOT access another Engine's private repository.

**ER-R004** — Kernel contains no business ownership.

**ER-R005** — Integration providers implement contracts but do not own business policy.

**ER-R006** — Derived outputs SHALL remain distinguishable.

**ER-R007** — Long-running operations SHALL use durable workflows.

**ER-R008** — Retryable operations SHALL be idempotent.

**ER-R009** — Authority boundaries SHALL follow the Domain Model.

**ER-R010** — An architectural responsibility change requires review and, when significant, an ADR.

## 15. Collaboration Matrix

| Capability | Primary Owner | Collaborators |
|---|---|---|
| Local scan | Import | Library, Workflow |
| Master acquisition | Library | Import, Workflow |
| Canonical UDM | Processing workflow | Import, Knowledge |
| Canonical DPM | Processing workflow | Render, Import |
| Personal annotation | Annotation | Library, Sync |
| Personal sync | Sync | Annotation, Library |
| Search index | Search | Knowledge, Library |
| AI summary | AI | Knowledge, Library |
| Export | Export | Render, Knowledge |
| Plugin extension | Plugin | Affected Engine |

Collaboration SHALL NOT transfer ownership.

## 16. Invariants

**ER-I001** — No Engine owns two unrelated primary capabilities.

**ER-I002** — No capability has competing owners.

**ER-I003** — Domain authority is not determined by infrastructure.

**ER-I004** — Sync and acquisition remain separate.

**ER-I005** — Personal Knowledge remains user-owned.

**ER-I006** — Providers are replaceable.

**ER-I007** — Engine contracts are versioned.

**ER-I008** — Hidden cross-Engine mutation is prohibited.

## 17. Related Documents

- `DomainModel.md`
- `KnowledgeLifecycle.md`
- `../03-Kernel/KernelArchitecture.md`
- `../04-Platform/README.md`
- `../04-Platform/Library/README.md`
- `../04-Platform/Sync/README.md`
- `../05-Integration/README.md`

## 18. Status

This document is the normative responsibility map for KnowledgeOS Platform Engines V4.
