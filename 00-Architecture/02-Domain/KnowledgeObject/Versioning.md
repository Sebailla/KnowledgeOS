# Knowledge Object Versioning

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** Versioning  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define entity versioning, source versions, metadata versions, canonical representation versions and compatibility.

## 2. Scope

Applies to Knowledge Objects and every persistent subrecord whose history or synchronization requires version identity.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

Identity and version are separate.

The same Knowledge Object may have multiple versions. A version is an immutable snapshot of relevant state at a point in lifecycle history.

KnowledgeOS distinguishes:

- Knowledge Object version;
- source-item version;
- metadata-record version;
- asset version;
- UDM document version;
- DPM presentation version;
- relationship version;
- Personal Knowledge version;
- schema and processor version.

## 5. Conceptual Model

```text
VersionRecord
├── versionId
├── entityRef
├── parentVersionIds[]
├── changeKind
├── createdAt
├── actorRef
├── authorityScope
├── provenance
├── compatibility
├── contentFingerprint?
└── lifecycleState
```

Version lineage MAY branch for conflicts and SHALL remain acyclic.

## 6. Normative Requirements

**VERSIONING-R001** — Every immutable published snapshot MUST have a `VersionId`.

**VERSIONING-R002** — Entity identity MUST remain distinct from version identity.

**VERSIONING-R003** — A new version MUST preserve parent lineage.

**VERSIONING-R004** — Published versions MUST NOT be mutated in place.

**VERSIONING-R005** — Compatible metadata corrections MAY retain entity identity while creating a new version.

**VERSIONING-R006** — Material semantic replacement MUST create a new entity identity and lineage.

**VERSIONING-R007** — UDM and DPM versions MUST identify source and processor versions.

**VERSIONING-R008** — Personal conflicts MAY create branches until synchronization merges them.

**VERSIONING-R009** — Merge versions MUST identify all parents.

**VERSIONING-R010** — Version retention and purge MUST follow explicit policy.

**VERSIONING-R011** — Compatibility MUST be declared rather than inferred from version numbers alone.

## 7. Invariants

**VERSIONING-I001** — Version lineage is acyclic.

**VERSIONING-I002** — Published versions are immutable.

**VERSIONING-I003** — Historical provenance remains traceable.

**VERSIONING-I004** — Personal versions do not rewrite publication history.

**VERSIONING-I005** — Derived versions remain distinguishable from authoritative source versions.

**VERSIONING-I006** — Version identity is stable.

## 8. Lifecycle and State Transitions

Versions move through `Draft`, `Validated`, `Published`, `Superseded`, `Archived` and `Purged`.

Canonical publication requires validation. A `Superseded` version remains available for lineage and recovery. Purging SHALL preserve minimum identity and lineage records when allowed.

Synchronization conflicts create parallel Personal Knowledge versions; merging creates a new version with both branches as parents.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

A corrected publication title creates a new Knowledge Object version with the former version as parent. Reprocessing the same source with a newer parser creates a new UDM version but does not necessarily create a new source-item version.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `LifecycleMapping.md`
- `Provenance.md`
- `Metadata.md`
- `../Identity/README.md`
- `../UDM/Core/Identity.md`
- `../DPM/Core/PresentationIdentity.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
