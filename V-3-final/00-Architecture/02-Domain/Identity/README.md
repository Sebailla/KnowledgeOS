# Identity

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Identity

**Document:** README

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This section defines the Domain identity model of KnowledgeOS.

Identity allows every significant Domain entity to remain distinguishable across:

* storage locations;
* file renames;
* synchronization;
* serialization;
* version changes;
* representation changes;
* application restarts;
* device boundaries.

Identity is a logical Domain property.

It shall not be derived solely from a mutable path, display name, storage address or presentation position.

---

# 2. Scope

The Identity model governs identity for:

* Knowledge Objects;
* UDM Nodes;
* DPM Presentation Nodes;
* Assets;
* Anchors;
* Relationships;
* Versions;
* Sources where persistent distinction is required.

This section also defines the relationship between:

* identity;
* identifiers;
* references;
* addresses;
* paths;
* Versions.

It does not define:

* authentication identities;
* user-account identity;
* Provider credentials;
* Runtime Operation Identity;
* Job Identity;
* Attempt Identity;
* storage-key implementation details.

Execution identities are governed by `../../06-Execution/Runtime/ExecutionContext.md` and `../../06-Execution/Runtime/ExecutionModel.md`.

---

# 3. Core Principle

The fundamental principle is:

> Domain identity describes what an entity is, independently of where or how it is currently stored, rendered or accessed.

The complementary principle is:

> Mutable location, display and representation data shall never become the sole identity of canonical knowledge.

---

# 4. Identity Model

KnowledgeOS distinguishes four concepts:

```text
Identity
   │
   ├── Identifier
   ├── Reference
   ├── Address
   └── Path
```

These concepts are related but not interchangeable.

---

# 5. Identity

Identity is the stable logical distinction of an entity from all other entities within its defined scope.

Identity remains valid when the entity:

* moves;
* is renamed;
* receives a new Version;
* is synchronized;
* is rendered differently;
* is serialized into another supported representation.

---

# 6. Identifier

An Identifier is a value used to represent Identity.

An Identifier shall be:

* unique within its declared scope;
* stable for the supported lifetime of the entity;
* serializable where persistence requires it;
* independent from mutable presentation data.

The architecture does not require one universal physical identifier format for every entity category.

---

# 7. Reference

A Reference points to an identifiable entity.

A Reference may be:

* direct;
* indirect;
* local;
* external;
* resolved;
* unresolved.

A Reference does not imply ownership.

---

# 8. Address

An Address describes where an entity can currently be reached.

Examples include:

* storage locator;
* Provider endpoint;
* local database key;
* object-storage address.

An Address may change while Identity remains stable.

---

# 9. Path

A Path identifies a location in a hierarchical namespace or file system.

Paths are mutable operational data.

A Path shall not be treated as permanent Knowledge Object Identity.

---

# 10. Knowledge Object Identity

Every Knowledge Object shall have one stable Knowledge Object Identity.

Knowledge Object Identity remains stable across:

* source-file rename;
* source-file movement;
* local-replica relocation;
* synchronization;
* derived representation generation;
* Knowledge Object Version changes.

A new Version of the same Knowledge Object shall not automatically create a new Knowledge Object Identity.

---

# 11. UDM Node Identity

Every persistent UDM Node shall have identity according to the rules defined in `../UDM/Core/Identity.md`.

UDM Node Identity supports:

* Anchors;
* Relationships;
* annotations;
* incremental processing;
* deterministic serialization;
* Version comparison.

Node Identity is scoped to the governing Knowledge Object and UDM identity model unless explicitly defined otherwise.

---

# 12. DPM Presentation Identity

DPM Presentation Nodes use Presentation Identity as defined in `../DPM/Core/PresentationIdentity.md`.

Presentation Identity shall remain distinct from UDM Node Identity.

A DPM Node may reference a UDM Node without becoming that UDM Node.

---

# 13. Asset Identity

Every managed Asset requiring stable reference shall have Asset Identity.

Asset Identity shall not depend solely on:

* filename;
* local path;
* Render location;
* temporary processing address.

Content-derived hashes may support integrity or deduplication but do not automatically replace Domain Identity.

---

# 14. Anchor Identity

Anchors provide stable reference to a meaningful target within knowledge structure.

Anchor Identity shall survive compatible representation changes according to `../UDM/Nodes/Anchors.md`.

An Anchor is not equivalent to:

* byte offset;
* page coordinate;
* temporary selection range.

---

# 15. Relationship Identity

Relationships requiring persistence, Versioning or independent reference shall have stable Relationship Identity.

Relationship Identity remains distinct from the identities of its source and target entities.

---

# 16. Version Identity

A Version identifies one governed state of an entity.

Version Identity shall remain distinct from entity Identity.

```text
Knowledge Object Identity
        │
        ├── Version A
        ├── Version B
        └── Version C
```

The Knowledge Object remains the same logical entity while its Versions differ.

---

# 17. Source Identity

A Source may have stable identity when KnowledgeOS must distinguish it across repeated ingestion or synchronization.

Source Identity shall not be confused with Knowledge Object Identity.

Multiple Sources may contribute to one Knowledge Object, and one Source may produce several distinct Knowledge Objects where the Import contract permits it.

---

# 18. Identity Creation

Identity shall be created by the architectural owner of the entity category.

Identity creation shall be:

* deterministic where the contract requires deterministic reconstruction;
* collision-resistant within the required scope;
* independent from presentation;
* observable for diagnostics without exposing unnecessary private data.

---

# 19. Identity Immutability

Once assigned to a persistent Domain entity, Identity shall not change merely because descriptive or operational data changes.

Identity replacement is permitted only through an explicit migration or entity-replacement operation.

---

# 20. Identity Comparison

Identity comparison shall use the canonical identifier semantics of the entity category.

Display labels, normalized names and paths shall not be used as substitutes for identity equality.

---

# 21. Identity Serialization

Persistent identities shall be serialized explicitly.

Deserialization shall validate:

* identifier format;
* identity scope;
* compatibility;
* required references.

A malformed identifier shall not be silently replaced with a newly generated identity when doing so would break referential integrity.

---

# 22. Identity and Synchronization

Synchronization shall preserve canonical Domain identities across replicas.

Synchronization shall not create a new Knowledge Object Identity merely because an entity appears on another device.

Conflicting entities with accidentally duplicated identifiers shall enter reconciliation rather than being merged blindly.

---

# 23. Identity and Import

Import shall distinguish between:

* repeated import of the same Source;
* new Version of an existing Knowledge Object;
* independent new Knowledge Object;
* duplicate content with separate user meaning.

Content equality alone does not always imply identity equality.

---

# 24. Identity and Deletion

Deletion or archival does not permit immediate reuse of a stable Identifier for an unrelated entity.

Identifier reuse is prohibited where historical references, synchronization or audit semantics may still exist.

---

# 25. Identity and Privacy

Identifiers shall avoid embedding unnecessary private user information.

Identifiers exposed through Public APIs or Plugins shall follow the relevant contract and capability boundaries.

---

# 26. Validation Requirements

Identity validation shall verify:

* required presence;
* valid format;
* uniqueness within scope;
* stable reference resolution;
* no prohibited path-derived identity;
* Version Identity separation;
* UDM and DPM identity separation.

---

# 27. Testing Requirements

Identity shall be tested across:

* file rename;
* file movement;
* local-replica relocation;
* application restart;
* serialization round trip;
* synchronization;
* Version creation;
* duplicate import;
* conflicting identifier detection;
* reference restoration.

---

# 28. Identity Invariants

The following invariants apply.

* Identity is distinct from location.
* Identity is distinct from display name.
* Identity is distinct from Version.
* Paths are not permanent Domain Identity.
* Knowledge Object Identity survives compatible Version changes.
* UDM Node Identity and DPM Presentation Identity remain distinct.
* Asset Identity does not depend solely on filename or path.
* Anchors are not raw byte offsets or temporary coordinates.
* Persistent identifiers are not reused for unrelated entities.
* Synchronization preserves Domain identities.
* Malformed identity does not trigger silent identity replacement.
* Content equality does not automatically imply identity equality.

---

# 29. Prohibited Behaviors

KnowledgeOS shall never:

* use a mutable file path as the sole Knowledge Object Identity;
* change Domain Identity because an entity was renamed or moved;
* reuse an existing stable Identifier for an unrelated entity;
* treat Version Identity as entity Identity;
* treat DPM Presentation Identity as UDM Node Identity;
* infer identity equality solely from display name;
* merge conflicting synchronized identities blindly;
* regenerate missing persistent identities silently when references would break;
* embed unnecessary private user data into identifiers;
* let Provider-specific storage keys become canonical Domain Identity accidentally.

---

# 30. Related Documents

## Domain

* `../DomainModel.md`
* `../KnowledgeObject/KnowledgeObject.md`
* `../KnowledgeObject/Versioning.md`
* `../UDM/Core/Identity.md`
* `../UDM/Nodes/Anchors.md`
* `../DPM/Core/PresentationIdentity.md`

## Integration

* `../../05-Integration/DataExchange/Serialization.md`
* `../../05-Integration/Synchronization/README.md`

## Execution

* `../../06-Execution/Runtime/ExecutionContext.md`
* `../../06-Execution/Runtime/ExecutionModel.md`

## Governance

* `../../08-Governance/ArchitectureVocabulary.md`

---

# 31. Status

**Approved**

This document defines the Domain identity model of KnowledgeOS.

Identity remains stable independently from path, location, display name, storage implementation, presentation and Version.

Knowledge Object Identity, UDM Node Identity, DPM Presentation Identity, Asset Identity, Anchor Identity and Version Identity remain explicitly scoped and semantically distinct.

KnowledgeOS therefore preserves referential integrity across import, serialization, synchronization, representation changes and long-term evolution without allowing mutable operational addresses to become canonical identity.
