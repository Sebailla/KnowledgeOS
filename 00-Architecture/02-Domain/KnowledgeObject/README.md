# Knowledge Object Domain Package

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define package responsibility, navigation, dependency rules and the authority of each Knowledge Object specification.

## 2. Scope

Applies to all documents under `02-Domain/KnowledgeObject`.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

This package defines the persistent aggregate and supporting domain concepts through which KnowledgeOS manages knowledge.

`KnowledgeObject.md` is the rector specification. The remaining documents refine one concern each:

- metadata;
- provenance;
- sources;
- assets;
- relationships;
- versioning;
- lifecycle mapping.

The package depends on Foundation and Domain identity. UDM and DPM are canonical representations associated with Knowledge Object versions. Platform engines consume these contracts but SHALL NOT redefine them.

## 5. Conceptual Model

```text
KnowledgeObject/
├── KnowledgeObject.md
├── Metadata.md
├── Provenance.md
├── Sources.md
├── Assets.md
├── Relationships.md
├── Versioning.md
├── LifecycleMapping.md
└── README.md
```

Recommended reading order:

1. `KnowledgeObject.md`
2. `Metadata.md`
3. `Sources.md`
4. `Assets.md`
5. `Provenance.md`
6. `Relationships.md`
7. `Versioning.md`
8. `LifecycleMapping.md`

## 6. Normative Requirements

**README-R001** — Each concept MUST have one authoritative definition.

**README-R002** — Subordinate specifications MUST NOT contradict `KnowledgeObject.md`.

**README-R003** — Master Library, Local Library and Personal Knowledge authority MUST remain separate.

**README-R004** — The package MUST remain independent of database, filesystem and UI implementation.

**README-R005** — Every persistent concept MUST use stable domain identity.

**README-R006** — References to UDM and DPM MUST preserve their independent responsibilities.

**README-R007** — Package evolution MUST update references and validation together.

## 7. Invariants

**README-I001** — Knowledge Object is the persistent aggregate.

**README-I002** — Files are sources, not Knowledge Objects.

**README-I003** — Annotations are Personal Knowledge, not Master metadata.

**README-I004** — UDM owns semantic canonical representation.

**README-I005** — DPM owns presentation canonical representation.

**README-I006** — Derived artifacts remain rebuildable.

**README-I007** — Authority and provenance are explicit.

## 8. Lifecycle and State Transitions

Package documents move from Draft to Release Candidate to Approved. A frozen package MAY receive backward-compatible clarifications and extensions. Changes to identity, authority or aggregate ownership require an ADR and major version review.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

An implementation may store Knowledge Objects in PostgreSQL and source files in object storage, but neither table names nor paths appear in this package. Those are implementation choices behind repository contracts.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `../DomainModel.md`
- `../Identity/README.md`
- `../UDM/README.md`
- `../DPM/README.md`
- `../KnowledgeGraph/README.md`
- `../../04-Platform/Library/README.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
