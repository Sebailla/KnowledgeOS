# Knowledge Object Specification

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** KnowledgeObject  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the persistent domain aggregate through which KnowledgeOS manages documentary sources, canonical models, assets, metadata, provenance, versions and relationships without conflating Master Library authority, Local Library availability or Personal Knowledge.

## 2. Scope

Applies to every Knowledge Object managed by the Master Library or represented in a Local Library. It excludes UI state, synchronization transport, database schemas, renderer objects and provider-specific implementation details.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

A Knowledge Object is the stable library-level representation of one managed unit of knowledge.

It is not a file, page, UDM node, DPM node, database row or annotation. It coordinates those artifacts under one persistent identity and lifecycle.

KnowledgeOS distinguishes:

- **Master Knowledge Object:** authoritative catalog representation managed by KnowledgeOS Server on the NAS.
- **Local Knowledge Object Reference:** local representation created through device discovery, manual import or explicit acquisition.
- **Personal Knowledge:** annotations, notes, highlights, progress and relationships owned by the user and attached through stable identities and anchors.
- **Derived Artifacts:** UDM, DPM, indexes, previews, embeddings and other rebuildable processing outputs.

A Local Library is not a replica of the Master Library. Personal Knowledge never becomes Master Library content.

## 5. Conceptual Model

```text
KnowledgeObject
├── id
├── kind
├── authorityScope
├── lifecycleState
├── metadata
├── sources[]
├── assets[]
├── canonicalRepresentations[]
│   ├── UDM versions
│   └── DPM versions
├── provenance
├── relationships[]
├── versions[]
├── externalIdentifiers[]
├── integrity
└── extensionData{}
```

The aggregate owns consistency among its references and lifecycle records. Binary storage, graph projections, search indexes and user-interface projections remain outside the aggregate.

## 6. Normative Requirements

**KNOWLEDGEOBJEC-R001** — Every Knowledge Object MUST have one immutable `KnowledgeObjectId`.

**KNOWLEDGEOBJEC-R002** — A Knowledge Object MUST declare its authority scope.

**KNOWLEDGEOBJEC-R003** — Master Library authority MUST be limited to catalog records, source publications and master-source metadata.

**KNOWLEDGEOBJEC-R004** — Personal Knowledge MUST NOT be embedded as authoritative Master Library state.

**KNOWLEDGEOBJEC-R005** — A Local Library representation MUST preserve origin and acquisition provenance.

**KNOWLEDGEOBJEC-R006** — Acquisition from Master to Local MUST be explicit and idempotent.

**KNOWLEDGEOBJEC-R007** — A Knowledge Object MUST reference, rather than embed, binary assets.

**KNOWLEDGEOBJEC-R008** — Canonical UDM and DPM representations MUST identify the Knowledge Object version from which they were produced.

**KNOWLEDGEOBJEC-R009** — Derived artifacts MUST remain distinguishable and rebuildable.

**KNOWLEDGEOBJEC-R010** — External identifiers MUST be namespaced aliases, not replacements for KnowledgeOS identity.

**KNOWLEDGEOBJEC-R011** — Lifecycle transitions MUST preserve version and provenance history.

**KNOWLEDGEOBJEC-R012** — The aggregate MUST reject ownership conflicts rather than silently selecting an authority.

## 7. Invariants

**KNOWLEDGEOBJEC-I001** — Identity remains stable across storage migration, synchronization and compatible reprocessing.

**KNOWLEDGEOBJEC-I002** — The original source remains preserved.

**KNOWLEDGEOBJEC-I003** — Authority is scoped and explicit.

**KNOWLEDGEOBJEC-I004** — Publication acquisition and personal synchronization are separate flows.

**KNOWLEDGEOBJEC-I005** — Personal Knowledge never modifies Master Library publication authority.

**KNOWLEDGEOBJEC-I006** — Every canonical representation is traceable to source and processing provenance.

**KNOWLEDGEOBJEC-I007** — Derived artifacts are never the only surviving representation of authoritative knowledge.

**KNOWLEDGEOBJEC-I008** — Version lineage is acyclic.

**KNOWLEDGEOBJEC-I009** — Repository implementation does not define domain identity.

## 8. Lifecycle and State Transitions

The baseline lifecycle is:

```text
Discovered
    ↓
Registered
    ↓
Active
    ├── New Version
    ├── Acquired Locally
    ├── Archived
    └── Removed
```

Master and Local state SHALL remain distinct.

- A Master Knowledge Object may be `Active`, `Unavailable`, `Archived` or `Removed`.
- Local availability may be `Absent`, `Acquiring`, `Available`, `Evicted`, `Corrupt` or `Removed`.
- Personal Knowledge follows its own lifecycle and SHALL NOT change publication state.
- A new publication version creates a new `VersionId` while retaining `KnowledgeObjectId` when semantic continuity remains.
- Material replacement creates a new Knowledge Object and records lineage.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

A book stored on the NAS has one Master `KnowledgeObjectId`. The Mac acquires the EPUB and creates a local acquisition record referencing the same Master object and manifestation. The user highlights a paragraph on the iPad. The highlight has its own Personal Knowledge identity and synchronizes through iCloud; it is never written to the Master Library.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `../DomainModel.md`
- `../KnowledgeLifecycle.md`
- `../Identity/README.md`
- `../UDM/UDM.md`
- `../DPM/DPM.md`
- `../KnowledgeGraph/README.md`
- `Metadata.md`
- `Provenance.md`
- `Sources.md`
- `Assets.md`
- `Relationships.md`
- `Versioning.md`
- `LifecycleMapping.md`
- `../../04-Platform/Library/README.md`
- `../../04-Platform/Sync/README.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
