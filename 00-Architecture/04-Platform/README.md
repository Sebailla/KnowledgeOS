# Platform Architecture

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the Engine-based Platform layer that implements KnowledgeOS business capabilities over Domain contracts and Kernel execution services.

## 2. Scope

Applies to all Engines and public Platform contracts under `04-Platform`.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Platform is the business-capability layer.

An Engine owns one coherent capability, protects its invariants and exposes explicit commands, queries, events, workflows and service contracts.

Platform depends on:

- Foundation rules;
- Domain meaning;
- Kernel execution contracts.

Platform SHALL NOT be defined by databases, UI frameworks, external providers or deployment topology.

The official Engines are:

- Library;
- Import;
- Export;
- Knowledge;
- Search;
- Render;
- Annotation;
- Sync;
- AI;
- Plugin.

## 5. Conceptual Model

```text
Clients / Public API / Plugins
             │
             ▼
Platform Engines
├── Library
├── Import
├── Export
├── Knowledge
├── Search
├── Render
├── Annotation
├── Sync
├── AI
└── Plugin
             │
             ▼
Kernel Services
             │
             ▼
Integration Providers and Repositories
```

Engines collaborate through public contracts and Kernel coordination. They MUST NOT access one another's private repositories.

## 6. Normative Requirements

**README-R001** — Every capability MUST have exactly one primary owning Engine.

**README-R002** — Every Engine MUST expose explicit public contracts.

**README-R003** — An Engine MUST protect its own invariants and repository boundaries.

**README-R004** — Engines MUST communicate through commands, queries, events, workflows or service contracts.

**README-R005** — Direct access to another Engine's private implementation or repository is prohibited.

**README-R006** — Long-running cross-Engine operations MUST use Workflow Engine.

**README-R007** — Retryable operations MUST be idempotent.

**README-R008** — Derived artifacts MUST remain distinguishable from canonical and personal knowledge.

**README-R009** — Integration providers MUST implement Platform contracts without owning business policy.

**README-R010** — Engines MUST remain independent of client UI frameworks.

**README-R011** — A new Engine requires a distinct business capability and architectural review.

## 7. Invariants

**README-I001** — One owner per capability.

**README-I002** — No hidden cross-Engine mutation.

**README-I003** — Domain authority is preserved.

**README-I004** — Kernel owns execution, not business policy.

**README-I005** — Providers remain replaceable.

**README-I006** — Personal Knowledge remains user-owned.

**README-I007** — Acquisition and synchronization remain separate.

## 8. Commands, Queries, Events and Workflows

Common patterns:

- Commands change Engine-owned state.
- Queries read Engine-owned state or projections.
- Events announce committed facts.
- Workflows coordinate durable multi-step operations.
- Public service contracts support synchronous collaboration when transactional or request-response behavior is required.

Events SHALL follow committed state. Workflows SHALL preserve ownership of each business step.

## 9. Failure, Recovery and Degradation

An Engine failure SHALL remain isolated when possible.

Degraded operation MUST be explicit. An Engine SHALL NOT report success when required state has not committed. Recovery SHALL preserve source evidence, Personal Knowledge, identity, provenance and workflow checkpoints.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

Library Engine coordinates acquisition with Import Engine through a workflow. Import validates the payload; Library commits local membership. Neither accesses the other's private repository.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../02-Domain/EngineResponsibilities.md`
- `../03-Kernel/README.md`
- `Library/README.md`
- `Import/README.md`
- `Sync/README.md`
- `../05-Integration/README.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
