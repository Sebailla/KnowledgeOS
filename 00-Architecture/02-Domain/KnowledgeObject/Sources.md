# Knowledge Object Sources

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** Sources  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define source concepts, source-item identity, acquisition, integrity, custody and linkage to works, expressions and manifestations.

## 2. Scope

Covers files, streams, scans, web captures, physical references, external records and user-created sources.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

A source is evidence from which a Knowledge Object or representation is derived.

KnowledgeOS distinguishes:

- **Work:** abstract intellectual creation.
- **Expression:** translation, revision or realization.
- **Manifestation:** publication embodiment such as a particular edition or format.
- **Source Item:** one acquired or observed instance.
- **External Source Reference:** a resource not held by KnowledgeOS.
- **Generated Source:** user-authored or system-generated material that becomes a source under explicit workflow.

Files are source items, not Knowledge Objects.

## 5. Conceptual Model

```text
SourceDescriptor
├── sourceItemId
├── sourceKind
├── workRef?
├── expressionRef?
├── manifestationRef?
├── origin
├── acquisitionMethod
├── mediaType?
├── integrity
├── custody
├── availability
├── provenance
└── externalIdentifiers[]
```

One Knowledge Object MAY have several sources. One source MAY participate in deduplication or lineage analysis without collapsing distinct acquisitions.

## 6. Normative Requirements

**SOURCES-R001** — Every managed source item MUST have an immutable identity.

**SOURCES-R002** — Original source bytes MUST remain immutable after successful ingestion.

**SOURCES-R003** — Integrity information SHOULD include a cryptographic checksum when bytes are available.

**SOURCES-R004** — Acquisition MUST preserve origin and custody provenance.

**SOURCES-R005** — A checksum MUST NOT be treated as universal Work identity.

**SOURCES-R006** — External sources MUST declare namespace, URI or provider identity.

**SOURCES-R007** — Unavailable external sources MUST remain representable.

**SOURCES-R008** — Generated sources MUST identify the generating actor and workflow.

**SOURCES-R009** — Master-to-Local transfer MUST be modeled as acquisition, not synchronization.

**SOURCES-R010** — Local scanning MUST require user-authorized locations.

**SOURCES-R011** — Source deletion MUST follow retention and recovery policy.

## 7. Invariants

**SOURCES-I001** — Source identity is independent of path.

**SOURCES-I002** — Original evidence remains preserved.

**SOURCES-I003** — Acquisition is explicit.

**SOURCES-I004** — Master and Local source custody remain distinct.

**SOURCES-I005** — A file format does not determine Knowledge Object kind.

**SOURCES-I006** — Unavailable does not mean nonexistent.

## 8. Lifecycle and State Transitions

Source state may be `Discovered`, `Validating`, `Available`, `Unavailable`, `Corrupt`, `Archived`, `Removed` or `Purged`.

A source becomes `Available` only after integrity and registration succeed. Interrupted acquisition remains resumable. Corrupt sources SHALL be isolated while preserving catalog and provenance records. Local eviction changes availability, not Master publication identity.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

A user-authorized scan discovers two identical PDFs in different folders. They have separate local source-item records and custody provenance but may map to the same manifestation after validation. Neither path becomes the domain identity.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `Assets.md`
- `Provenance.md`
- `Metadata.md`
- `../Identity/README.md`
- `../UDM/UDM.md`
- `../../04-Platform/Import/README.md`
- `../../04-Platform/Library/README.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
