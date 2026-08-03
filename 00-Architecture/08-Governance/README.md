# Architecture Governance

**Project:** KnowledgeOS  
**Section:** Governance  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define how KnowledgeOS architecture is proposed, reviewed, changed, versioned, validated and frozen. Governance protects coherence without preventing controlled evolution.

## 2. Scope

Governance applies to Foundation, Domain, Kernel, Platform, Integration, Execution, Architecture Views, ADRs, public contracts, plugins and implementation guidance.

## 3. Principles

- Architecture changes are explicit and traceable.
- One concept has one authoritative definition.
- Breaking changes require major-version review.
- Structural changes are exceptional.
- Documentation, diagrams and ADRs evolve together.
- Implementation SHALL NOT silently redefine architecture.
- User ownership and scoped authority remain protected.

## 4. Change Classes

| Class | Meaning | Required review |
|---|---|---|
| Clarification | Wording only | Document owner |
| Compatible extension | Optional addition | Architecture review |
| Behavioral change | Runtime or contract change | Architecture review and tests |
| Breaking change | Identity, authority, lifecycle or compatibility | ADR and major version |
| Structural change | Folder or document ownership change | Governance approval |
| Emergency correction | Critical contradiction | Expedited review and follow-up |

## 5. Decision Flow

```text
Proposal → Impact Analysis → Decision Matrix → ADR?
→ Cross-Document Update → Validation → Release Candidate → Freeze
```

## 6. Mandatory ADR Triggers

An ADR is required when changing identity, authority, Master/Local Library topology, Personal Knowledge synchronization, acquisition, UDM/DPM invariants, Engine ownership, Kernel guarantees, public compatibility, plugin security or source-of-truth semantics.

## 7. Freeze Criteria

A baseline may be frozen when it has no unresolved critical contradiction, references validate, ADRs align, diagrams represent the current architecture, versions are explicit and migration implications are documented.

## 8. Invariants

- Accepted ADRs remain authoritative until explicitly superseded.
- Deprecated concepts remain traceable.
- Hidden architectural change is prohibited.
- Every frozen baseline is reproducible.
- Cross-references are validated before approval.
- Governance decisions are auditable.

## 9. Status

This document is the rector governance specification for KnowledgeOS V4.
