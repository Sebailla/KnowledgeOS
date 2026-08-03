# Knowledge Object Assets

**Project:** KnowledgeOS  
**Section:** Domain / Knowledge Object  
**Document:** Assets  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define binary and external assets, renditions, integrity, storage independence and relationship to sources, UDM and DPM.

## 2. Scope

Covers images, audio, video, fonts, datasets, attachments, previews, thumbnails and other binary resources.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Requirements identified by stable identifiers are testable and apply to every conforming implementation unless explicitly scoped otherwise.


## 4. Context and Responsibility

An asset is a persistent binary or external resource associated with a Knowledge Object.

Assets are not embedded directly into canonical domain structures. UDM references semantic asset identity; DPM references placements and renditions; storage providers manage bytes.

Assets distinguish:

- source asset;
- extracted asset;
- user-created asset;
- generated rendition;
- external asset reference.

## 5. Conceptual Model

```text
Asset
├── assetId
├── role
├── authorityScope
├── mediaType
├── integrity
├── sourceRef?
├── renditionOf?
├── dimensions?
├── duration?
├── accessibilityMetadata?
├── provenance
├── availability
└── extensionData{}
```

A rendition is a separate asset identity linked to its source through derivation provenance.

## 6. Normative Requirements

**ASSETS-R001** — Every managed asset MUST have an immutable `AssetId`.

**ASSETS-R002** — Binary storage location MUST NOT be part of asset identity.

**ASSETS-R003** — Assets with bytes SHOULD have cryptographic integrity records.

**ASSETS-R004** — Generated renditions MUST reference their source asset and processing provenance.

**ASSETS-R005** — UDM and DPM MUST reference assets by identity.

**ASSETS-R006** — Original assets MUST NOT be replaced by derived renditions.

**ASSETS-R007** — Remote asset references MUST be validated and policy-controlled.

**ASSETS-R008** — Accessibility metadata SHOULD accompany media assets when available.

**ASSETS-R009** — Personal assets MUST remain outside Master Library authority unless explicitly published through an authoring workflow.

**ASSETS-R010** — Missing assets MUST remain explicitly unresolved rather than silently removed.

## 7. Invariants

**ASSETS-I001** — Asset identity survives storage migration.

**ASSETS-I002** — Source and rendition are distinct.

**ASSETS-I003** — Binary bytes remain external to UDM/DPM serialization unless an exchange package explicitly embeds them.

**ASSETS-I004** — Derived assets are rebuildable when inputs remain available.

**ASSETS-I005** — Integrity failures do not silently modify bytes.

## 8. Lifecycle and State Transitions

Assets move through `Registered`, `Available`, `Generating`, `Unavailable`, `Corrupt`, `Archived`, `Removed` and `Purged`.

Rendition regeneration creates a new version or rendition identity according to compatibility rules. Local cache eviction changes availability only. Source-asset deletion SHALL account for dependent renditions and canonical references.

## 9. Failure, Recovery and Edge Cases

Implementations SHALL preserve user knowledge, source evidence, identity and provenance before attempting automatic repair. Ambiguity SHALL remain explicit. A component MUST NOT invent missing authority, source facts, relationships or metadata merely to satisfy a schema.

Recoverable failures SHOULD create durable findings and resumable workflow state. Irrecoverable inconsistencies SHALL prevent canonical publication while preserving all available evidence for review and recovery.

## 10. Security and Privacy

All imported metadata, source references, external identifiers, extension payloads and generated assertions SHALL be treated as untrusted until validated. Personal Knowledge SHALL remain outside the NAS Master Library and SHALL synchronize only through approved personal-state synchronization profiles.

Exports, logs and telemetry MUST NOT expose private paths, credentials, personal annotations or source content without explicit authorization.

## 11. Examples

A high-resolution TIFF is the source asset. A JPEG preview and thumbnail are renditions with distinct identities and generation provenance. DPM places the JPEG preview; UDM retains the semantic figure reference to the source asset.

## 12. Compatibility and Evolution

Backward-compatible changes MAY add optional fields, types or relationships. A change that modifies identity, authority, lifecycle ownership, canonical meaning, provenance requirements or version interpretation requires a major specification version.

Unknown optional extension data SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 13. Related Documents

- `KnowledgeObject.md`
- `Sources.md`
- `Provenance.md`
- `Versioning.md`
- `../UDM/Nodes/AssetNodes.md`
- `../DPM/Mapping/AssetMapping.md`

## 14. Status

This document is part of the KnowledgeOS Knowledge Object V4 release-candidate baseline. It becomes frozen after complete Domain review and cross-document validation.
