# Identity Model

**Project:** KnowledgeOS  
**Section:** Domain / Identity  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This document defines the universal identity model of KnowledgeOS.

Identity is the foundation for persistence, acquisition, provenance, versioning, anchoring, relationships, synchronization, migration, export and recovery.

The model ensures that domain entities retain continuity independently of filenames, paths, storage engines, devices, databases, renderers and external providers.

## 2. Scope

This specification applies to:

- Master Libraries;
- Local Libraries;
- Knowledge Objects;
- works;
- expressions;
- manifestations;
- source items;
- UDM documents;
- UDM nodes;
- DPM presentations;
- DPM nodes;
- assets;
- annotations;
- relationships;
- anchors;
- versions;
- workflows;
- external identifiers;
- plugin-defined entities.

It does not define:

- authentication identity;
- user login protocols;
- OAuth subjects;
- database primary-key implementation;
- filesystem naming;
- device enrollment.

Those concerns MAY reference domain identities but SHALL NOT redefine them.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Identity Principles

### 4.1 Stability

An identity SHALL remain stable while the represented entity retains semantic continuity.

### 4.2 Opacity

Consumers SHALL treat identifiers as opaque.

The character representation SHALL NOT encode business rules that consumers depend upon.

### 4.3 Independence

Domain identity SHALL be independent of:

- filesystem path;
- filename;
- NAS location;
- local device location;
- database row;
- table name;
- object memory address;
- array index;
- URL routing;
- UI state;
- synchronization session;
- provider identifier.

### 4.4 Non-Reuse

An identity SHALL NOT be silently reused after deletion, archival or replacement.

### 4.5 Scoped Authority

Identity assignment SHALL occur under an explicit authority scope.

### 4.6 Traceable Lineage

Split, merge, replacement and migration SHALL preserve predecessor and successor relationships.

## 5. Identity Kinds

KnowledgeOS defines distinct identity kinds.

| Identity | Represents |
|---|---|
| `LibraryId` | Master or Local Library |
| `KnowledgeObjectId` | Persistent knowledge aggregate |
| `WorkId` | Abstract intellectual work |
| `ExpressionId` | Intellectual realization of a work |
| `ManifestationId` | Publication embodiment |
| `SourceItemId` | Acquired or preserved item |
| `UDMDocumentId` | Canonical semantic document |
| `UDMNodeId` | Semantic node |
| `DPMDocumentId` | Canonical presentation |
| `DPMNodeId` | Presentation node |
| `AssetId` | Binary or external asset |
| `AnnotationId` | Personal annotation |
| `RelationshipId` | Typed relationship |
| `AnchorId` | Stable target selector |
| `VersionId` | Entity version |
| `WorkflowId` | Durable workflow instance |
| `TypeId` | Registered type |
| `ExternalIdentity` | Namespaced external identifier |

Identity kinds SHALL NOT be used interchangeably.

## 6. Identity Representation

The logical contract exposes opaque strings.

A canonical URI MAY be used for exchange:

```text
kos://{authority}/{identity-kind}/{identity}
```

Examples:

```text
kos://master/library/01J...
kos://domain/knowledge-object/01J...
kos://udm/document/01J...
kos://udm/document/01J.../node/01J...
kos://personal/annotation/01J...
```

URI form does not imply network location.

Implementations MAY use UUID, ULID, content-derived identifiers or another encoding when all invariants are satisfied.

## 7. Authority Scopes

Identity authority is scoped.

### 7.1 Master Library Authority

The Master Library assigns authoritative identities for:

- Master Catalog records;
- source publications;
- master source items;
- master metadata versions;
- publication availability records.

### 7.2 Local Library Authority

A Local Library assigns identities for:

- locally discovered source items;
- local acquisition records;
- local derived artifacts;
- local operational entities.

An acquired publication SHOULD retain references to Master Library identities when available.

### 7.3 Personal Authority

The user or originating Local Library assigns identities for:

- annotations;
- highlights;
- notes;
- personal relationships;
- personal collections;
- reading progress records;
- personal AI artifacts.

These identities participate in personal synchronization.

### 7.4 Processing Authority

Processors assign identities for:

- UDM nodes;
- DPM nodes;
- derived relationships;
- embeddings;
- validation reports;
- workflow outputs.

Processor-assigned identities require deterministic or persistent assignment rules.

## 8. Deterministic Identity

Deterministic identity SHOULD be used when stable source evidence exists and reprocessing continuity is required.

A deterministic identity function SHALL use:

- a stable namespace;
- authoritative parent identity;
- stable source selector or semantic key;
- algorithm version;
- collision-resistant encoding.

It SHALL NOT use:

- transient offsets without context;
- processing order alone;
- database sequence numbers;
- timestamps alone;
- random UI-generated values when stable source evidence exists.

Changing the deterministic algorithm requires explicit migration or versioning.

## 9. Random Identity

Random identity MAY be used when:

- no stable source evidence exists;
- the entity is user-created;
- the entity first appears during interactive work;
- deterministic assignment would expose sensitive information;
- persistence begins before semantic classification.

Once assigned and published, the identity becomes immutable.

## 10. Content-Derived Identity

A checksum MAY identify byte content.

A content-derived identity SHALL NOT automatically identify:

- a Work;
- an Expression;
- a Manifestation;
- a Knowledge Object;
- a semantic node.

Identical bytes may belong to distinct acquisitions.

Different bytes may represent the same work or expression.

Checksums are evidence, not universal semantic identity.

## 11. External Identifiers

Examples include:

- DOI;
- ISBN;
- ISSN;
- ORCID;
- PMID;
- arXiv ID;
- URL;
- file checksum;
- publisher identifier;
- Wikidata ID.

External identifiers SHALL contain:

- namespace;
- value;
- issuer when applicable;
- verification status;
- provenance;
- validity interval when applicable.

An external identifier is an alias or mapping.

It SHALL NOT replace KnowledgeOS identity.

## 12. Identity Resolution

Resolution converts a reference into an entity or resolution result.

Possible results are:

- resolved;
- unresolved;
- ambiguous;
- retired;
- migrated;
- unauthorized;
- unavailable.

Ambiguity SHALL NOT be silently collapsed.

Resolution MAY use:

- direct registry lookup;
- lineage;
- alias mapping;
- provenance;
- checksum;
- source anchor;
- external provider;
- migration records.

## 13. Identity and Acquisition

Publication acquisition from Master to Local SHALL preserve:

- Master `KnowledgeObjectId` or publication identity;
- source `ManifestationId`;
- source `SourceItemId` where applicable;
- acquisition identity;
- local item identity;
- provenance;
- checksum.

The local copy is not a Master Library replica.

A Local Library MAY use its own `SourceItemId` while preserving the Master source reference.

Acquisition SHALL be idempotent for the same acquisition request identity.

## 14. Identity and Personal Synchronization

Personal-state synchronization SHALL preserve Personal Knowledge identities across devices.

A synchronized annotation remains the same annotation.

Conflict versions SHALL NOT receive unrelated identities merely because they exist on different devices.

Tombstones or deletion records SHALL preserve the retired identity long enough to achieve convergence.

The synchronization provider does not own identity.

## 15. Identity and Versioning

Entity identity and version identity are distinct.

```text
Entity
├── entityId
└── versions[]
    ├── versionId
    ├── parentVersionIds[]
    ├── createdAt
    ├── provenance
    └── state
```

A modification normally creates a new `VersionId` while retaining the entity identity.

A material replacement creates a new entity identity and lineage relationship.

## 16. Identity and Reprocessing

Compatible reprocessing SHOULD preserve identities.

Identity continuity exists when:

- source evidence remains equivalent;
- semantic role remains equivalent;
- the entity remains traceably the same;
- processor changes do not alter entity boundaries materially.

When one entity splits:

- successor entities receive new identities;
- each records predecessor lineage.

When entities merge:

- the successor receives a new identity;
- all predecessors remain traceable.

## 17. Identity and Anchors

Anchors have their own identities.

An anchor identity remains stable while its attachment intention remains the same, even when resolution changes.

Anchor resolution history SHALL preserve:

- original target version;
- original selector;
- resolution candidates;
- accepted resolution;
- re-anchoring reason;
- timestamp;
- processor or user provenance.

## 18. Identity and Deletion

Deletion does not erase identity history.

The system SHALL distinguish:

- active;
- archived;
- tombstoned;
- deleted;
- purged.

A tombstone preserves minimum information necessary for synchronization, lineage and non-reuse.

Purging SHALL follow explicit retention and privacy policy.

Purged identities SHALL NOT be reassigned.

## 19. Identity and Privacy

Identifiers SHOULD avoid embedding personal information.

Public or exported identifiers SHALL NOT expose:

- usernames;
- email addresses;
- device serial numbers;
- filesystem paths;
- private NAS hostnames;
- access tokens;
- provider secrets.

Cross-domain correlation risk SHOULD be considered when exposing stable identifiers externally.

Pseudonymous export identities MAY be generated while preserving a reversible local mapping when policy permits.

## 20. Identity Registry

An implementation MAY maintain one or more registries.

A registry maps identity to:

- kind;
- authority;
- lifecycle status;
- current version;
- aliases;
- lineage;
- location hints;
- resolution policy.

Location hints are not identity.

Registry storage is replaceable.

The logical identity contract is independent from the registry database.

## 21. Collision Handling

An identity collision is a critical integrity error.

The system SHALL:

1. stop publication of the conflicting entity;
2. preserve both inputs;
3. record the collision;
4. determine authority;
5. create corrected identities if required;
6. preserve lineage and audit history.

It SHALL NOT silently overwrite one entity.

## 22. Migration

Migration SHALL preserve identity whenever semantics remain unchanged.

Migration records include:

- source identity;
- target identity if changed;
- source schema version;
- target schema version;
- migration component;
- timestamp;
- reason;
- verification result.

Bulk migration SHALL be restartable and idempotent.

## 23. Serialization

Serialized identity references SHALL include enough type and scope information to prevent kind confusion.

Internal references SHALL use identity, never array position.

Unknown identity kinds in optional extensions SHOULD be preserved.

Malformed or unsupported required identity semantics MUST fail validation.

## 24. Validation

Validation SHALL detect:

- duplicate identity;
- invalid kind;
- invalid scope;
- missing authority;
- incorrect reference kind;
- unresolved required reference;
- cyclic lineage;
- illegal reuse;
- malformed namespace;
- alias conflict;
- invalid tombstone state.

Validation is deterministic and non-mutating.

## 25. Core Invariants

**ID-I001** — Domain identity is immutable.

**ID-I002** — Identity is independent from storage location.

**ID-I003** — Identity is opaque to consumers.

**ID-I004** — Identity kinds are not interchangeable.

**ID-I005** — Retired identities are never silently reused.

**ID-I006** — Identity authority is explicit.

**ID-I007** — Version identity is distinct from entity identity.

**ID-I008** — External identifiers are aliases, not replacements.

**ID-I009** — Lineage is preserved.

**ID-I010** — Lineage is acyclic.

**ID-I011** — Collisions are explicit integrity failures.

**ID-I012** — Personal identities remain user-owned.

**ID-I013** — Synchronization preserves identity.

**ID-I014** — Acquisition preserves source references.

**ID-I015** — Runtime and database identifiers are not domain identities.

## 26. Example

```text
Master Publication:
  KnowledgeObjectId: ko:master:01J-A
  ManifestationId: manifestation:01J-B
  SourceItemId: source:master:01J-C

Local Acquisition:
  AcquisitionId: acquisition:local:01J-D
  KnowledgeObjectRef: ko:master:01J-A
  SourceManifestationRef: manifestation:01J-B
  LocalSourceItemId: source:local:01J-E
  Checksum: sha256:...

Personal Annotation:
  AnnotationId: annotation:personal:01J-F
  TargetAnchorId: anchor:01J-G
  PublicationRef: ko:master:01J-A
```

## 27. Extension Model

Plugins MAY define new identity kinds only through approved namespaced contracts.

An extension identity kind SHALL define:

- namespace;
- entity meaning;
- authority;
- scope;
- lifecycle;
- serialization;
- validation;
- compatibility;
- privacy considerations.

Extensions SHALL NOT override core identity kinds.

## 28. Related Documents

- `../DomainModel.md`
- `../KnowledgeObject/KnowledgeObject.md`
- `../KnowledgeObject/Versioning.md`
- `../KnowledgeObject/Provenance.md`
- `../UDM/Core/Identity.md`
- `../DPM/Core/PresentationIdentity.md`
- `../KnowledgeGraph/README.md`
- `../../04-Platform/Library/README.md`
- `../../04-Platform/Sync/README.md`
- `../../05-Integration/DataExchange/Serialization.md`

## 29. Status

This document is the rector domain specification for KnowledgeOS Identity V4.
