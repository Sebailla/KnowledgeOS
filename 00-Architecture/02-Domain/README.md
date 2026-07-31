# Domain Package

**Project:** KnowledgeOS  
**Section:** Domain  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This README is the entry point for the complete KnowledgeOS Domain package.

## 2. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 3. Package Structure

```text
02-Domain/
├── DomainModel.md
├── KnowledgeLifecycle.md
├── EngineResponsibilities.md
├── KnowledgeObject/
├── UDM/
├── DPM/
├── KnowledgeGraph/
├── Identity/
└── README.md
```

## 4. Reading Order

1. `DomainModel.md`
2. `KnowledgeLifecycle.md`
3. `EngineResponsibilities.md`
4. `Identity/README.md`
5. `KnowledgeObject/README.md`
6. `UDM/README.md`
7. `DPM/README.md`
8. `KnowledgeGraph/README.md`

## 5. Dependency Rules

The Domain MAY depend on Foundation.

The Domain SHALL NOT depend on:

- Kernel implementation;
- Platform Engines;
- Integration providers;
- databases;
- UI frameworks;
- deployment topology.

Kernel, Platform, Integration and Implementation depend on Domain contracts.

## 6. Authority Map

- `DomainModel.md` owns top-level concepts and authority.
- `KnowledgeLifecycle.md` owns domain states and transitions.
- `EngineResponsibilities.md` owns capability boundaries.
- `Identity/README.md` owns identity semantics.
- `KnowledgeObject/KnowledgeObject.md` owns the persistent aggregate.
- `UDM/UDM.md` owns semantic canonical representation.
- `DPM/DPM.md` owns presentation canonical representation.
- `KnowledgeGraph/README.md` owns graph integration semantics.

## 7. Package Invariants

**DP-I001** — Domain remains technology-independent.

**DP-I002** — Every concept has one authoritative definition.

**DP-I003** — Master, Local and Personal authority remain separate.

**DP-I004** — Acquisition and synchronization remain separate.

**DP-I005** — UDM and DPM remain separate.

**DP-I006** — Stable identity is mandatory.

**DP-I007** — Derived artifacts remain rebuildable.

**DP-I008** — Platform implementation cannot redefine Domain meaning.

## 8. Change Governance

A change affecting identity, authority, aggregate ownership, acquisition, synchronization, UDM, DPM or graph semantics requires architectural review.

Breaking changes require a major version and applicable ADR.

## 9. Status

This package is the KnowledgeOS Domain V4 release candidate.
