
# UDM Validation Rules

**Project:** KnowledgeOS
**Section:** Domain
**Category:** Universal Document Model
**Document:** Validation Rules
**Version:** 3.0
**Status:** Approved
**Author:** KnowledgeOS Team

---

## 1. Purpose

This document defines the validation rules of the Universal Document Model (UDM).

Validation determines whether a UDM instance conforms to the structural, semantic and identity requirements established by the KnowledgeOS domain.

Its objectives are to:

* protect canonical knowledge;
* detect invalid structures;
* reject unrecoverable states;
* identify recoverable defects;
* support deterministic processing;
* preserve compatibility across versions.

A UDM instance shall not become authoritative until all mandatory validation rules have been evaluated.

---

## 2. Scope

These rules apply to:

* the UDM root;
* all Node categories;
* node identity;
* structural hierarchy;
* Content Nodes;
* Semantic Nodes;
* Annotation Nodes;
* Asset Nodes;
* Anchors;
* UDM Relationships;
* temporal information;
* extension attributes;
* version information.

This document defines validity.

Cross-component consistency is defined separately in `ConsistencyRules.md`.

---

## 3. Validation Principles

UDM validation follows these principles:

* validation is deterministic;
* canonical content is never silently discarded;
* validation does not modify valid knowledge;
* recoverable defects are reported explicitly;
* automatic repair creates traceable transformations;
* every result identifies the violated rule;
* validation rules are versioned;
* extension rules cannot weaken core rules.

---

## 4. Validation Levels

Validation occurs at four levels.

```text
UDM Validation
│
├── Schema Validation
├── Structural Validation
├── Referential Validation
└── Semantic Validation
```

### Schema Validation

Verifies that required fields, types and cardinalities are correct.

### Structural Validation

Verifies that the canonical tree is well formed.

### Referential Validation

Verifies that identifiers and references resolve correctly.

### Semantic Validation

Verifies that declared types, roles and relationships are semantically permitted.

---

## 5. Validation Outcomes

Every validation rule produces one of the following outcomes.

| Outcome           | Meaning                                                       |
| ----------------- | ------------------------------------------------------------- |
| Valid             | The rule is satisfied                                         |
| Warning           | The model remains usable, but review is recommended           |
| Recoverable Error | The defect may be repaired without losing canonical knowledge |
| Fatal Error       | The model cannot become authoritative                         |

A validation run shall report every detected issue rather than stopping after the first non-fatal defect.

---

## 6. Validation Severity

Allowed severity values are:

| Severity      | Effect                            |
| ------------- | --------------------------------- |
| Informational | No effect on validity             |
| Warning       | Does not block acceptance         |
| Error         | Blocks acceptance until corrected |
| Fatal         | Invalidates the complete UDM      |

Severity is defined by the rule and shall not be changed by individual Engines.

---

## 7. Validation Result

Every validation result shall contain:

* ValidationRunID;
* RuleID;
* Severity;
* TargetID;
* Message;
* DetectedAt;
* UDMVersion;
* SuggestedResolution, when available;
* RepairStatus, when applicable.

Validation results are diagnostic artifacts.

They are not canonical UDM content.

---

## 8. Root Validation Rules

### UDM-VAL-ROOT-001 — Single Root

Every UDM shall contain exactly one root Node.

**Severity:** Fatal

---

### UDM-VAL-ROOT-002 — Root Type

The root Node shall use the canonical root structural type defined for the UDM.

**Severity:** Fatal

---

### UDM-VAL-ROOT-003 — Root Parent

The root Node shall not declare a parent.

**Severity:** Fatal

---

### UDM-VAL-ROOT-004 — Aggregate Ownership

The UDM shall reference exactly one `KnowledgeObjectID`.

**Severity:** Fatal

---

### UDM-VAL-ROOT-005 — UDM Version

The UDM shall declare a supported UDM schema version.

**Severity:** Fatal

---

## 9. Node Identity Rules

### UDM-VAL-ID-001 — Required NodeID

Every canonical Node shall contain one `NodeID`.

**Severity:** Fatal

---

### UDM-VAL-ID-002 — NodeID Uniqueness

No two Nodes within the same UDM may share a `NodeID`.

**Severity:** Fatal

---

### UDM-VAL-ID-003 — Immutable Identity

An existing Node revision shall preserve its original `NodeID`.

**Severity:** Error

---

### UDM-VAL-ID-004 — Valid VersionID

Every versioned Node shall reference a valid `VersionID`.

**Severity:** Error

---

### UDM-VAL-ID-005 — Knowledge Object Scope

Every Node shall belong to the same `KnowledgeObjectID` as the owning UDM.

**Severity:** Fatal

---

### UDM-VAL-ID-006 — Reserved Identifiers

Reserved identifiers shall not be used by ordinary Nodes or extensions.

**Severity:** Error

---

## 10. Classification Rules

### UDM-VAL-TYPE-001 — Required Category

Every Node shall declare exactly one primary Category.

**Severity:** Fatal

---

### UDM-VAL-TYPE-002 — Required Type

Every Node shall declare one registered Type.

**Severity:** Fatal

---

### UDM-VAL-TYPE-003 — Category-Type Compatibility

The declared Type shall belong to the declared Category.

**Severity:** Error

---

### UDM-VAL-TYPE-004 — Variant Compatibility

A Variant shall extend the declared Type without changing its Category.

**Severity:** Error

---

### UDM-VAL-TYPE-005 — Registered Extensions

Extension Types shall declare:

* namespace;
* schema version;
* owning extension;
* compatibility range.

**Severity:** Error

---

## 11. Structural Tree Rules

### UDM-VAL-STRUCT-001 — Single Parent

Every non-root structural or content Node shall have exactly one structural parent.

**Severity:** Fatal

---

### UDM-VAL-STRUCT-002 — No Cycles

The structural hierarchy shall not contain cycles.

**Severity:** Fatal

---

### UDM-VAL-STRUCT-003 — No Orphan Canonical Nodes

Every canonical structural and content Node shall be reachable from the root.

**Severity:** Fatal

---

### UDM-VAL-STRUCT-004 — Deterministic Child Order

Children of an ordered parent shall have a unique deterministic order.

**Severity:** Error

---

### UDM-VAL-STRUCT-005 — Valid Parent Type

A Node's parent shall be allowed by its Type definition.

**Severity:** Error

---

### UDM-VAL-STRUCT-006 — Valid Child Type

Every child shall be permitted by its parent's Type definition.

**Severity:** Error

---

### UDM-VAL-STRUCT-007 — Structural Containment

Structural Nodes may directly contain only:

* Structural Nodes;
* Content Nodes.

They shall not directly contain:

* Semantic Nodes;
* Annotation Nodes;
* graph Relationships.

**Severity:** Error

---

### UDM-VAL-STRUCT-008 — Raw String Prohibition

Structural Nodes shall not contain untyped raw strings.

Textual knowledge shall be represented through Content Nodes.

**Severity:** Error

---

## 12. Content Node Rules

### UDM-VAL-CONTENT-001 — Structural Ownership

Every canonical Content Node shall belong to a valid Structural Node.

**Severity:** Error

---

### UDM-VAL-CONTENT-002 — Inline Placement

Inline Content Nodes shall appear only within parent Types that permit inline content.

**Severity:** Error

---

### UDM-VAL-CONTENT-003 — Block Placement

Block Content Nodes shall appear only within parent Types that permit autonomous content blocks.

**Severity:** Error

---

### UDM-VAL-CONTENT-004 — Canonical Payload

A Content Node shall contain a payload compatible with its declared Type.

**Severity:** Error

---

### UDM-VAL-CONTENT-005 — Encoding Validity

Canonical textual content shall use a supported Unicode representation.

**Severity:** Error

---

### UDM-VAL-CONTENT-006 — Empty Content

Empty Content Nodes are invalid unless their Type explicitly permits an empty state.

**Severity:** Warning or Error, according to Type

---

## 13. Semantic Node Rules

### UDM-VAL-SEM-001 — Semantic Target

Every Semantic Node shall reference at least one valid:

* Node;
* Anchor;
* Semantic Node;
* Knowledge Object reference.

**Severity:** Error

---

### UDM-VAL-SEM-002 — Ontology Reference

A Semantic Node declaring an Ontology Concept shall reference a valid `ConceptID`.

**Severity:** Error

---

### UDM-VAL-SEM-003 — Semantic Provenance

Every machine-generated Semantic Node shall include provenance.

**Severity:** Error

---

### UDM-VAL-SEM-004 — Derived Status

Derived semantic knowledge shall be distinguishable from canonical content.

**Severity:** Fatal

---

### UDM-VAL-SEM-005 — Confidence Range

When confidence is provided, its value shall conform to the declared confidence scale.

**Severity:** Error

---

### UDM-VAL-SEM-006 — Canonical Isolation

Semantic Nodes shall not replace, overwrite or directly own canonical Content Nodes.

**Severity:** Fatal

---

## 14. Annotation Node Rules

### UDM-VAL-ANN-001 — Annotation Identity

Every Annotation Node shall contain a valid immutable `AnnotationID`.

**Severity:** Error

---

### UDM-VAL-ANN-002 — Required Anchor

Every Annotation Node shall reference at least one valid Anchor.

**Severity:** Error

---

### UDM-VAL-ANN-003 — Canonical Isolation

Annotations shall not modify canonical Content Nodes.

**Severity:** Fatal

---

### UDM-VAL-ANN-004 — Annotation Provenance

Every Annotation Node shall record its creator and creation time.

**Severity:** Error

---

### UDM-VAL-ANN-005 — Annotation Type Payload

The annotation payload shall conform to the declared annotation Type.

**Severity:** Error

---

### UDM-VAL-ANN-006 — Ink Validity

Ink annotations shall contain valid vector stroke data or a valid external Asset reference.

**Severity:** Error

---

## 15. Asset Node Rules

### UDM-VAL-ASSET-001 — Required Asset Reference

Every Asset Node shall reference exactly one valid `AssetID`.

**Severity:** Error

---

### UDM-VAL-ASSET-002 — No Embedded Binary Data

Asset Nodes shall not embed binary payloads.

**Severity:** Fatal

---

### UDM-VAL-ASSET-003 — Media Type Compatibility

The declared media type shall be compatible with the Asset Node Type.

**Severity:** Error

---

### UDM-VAL-ASSET-004 — Integrity Reference

Canonical or original Assets shall include integrity information.

**Severity:** Error

---

### UDM-VAL-ASSET-005 — Repository Resolution

The referenced Asset shall be resolvable through the Asset Repository or explicitly marked unavailable.

**Severity:** Warning or Error, according to Asset role

---

## 16. Anchor Rules

### UDM-VAL-ANCHOR-001 — Required AnchorID

Every Anchor shall contain one immutable `AnchorID`.

**Severity:** Error

---

### UDM-VAL-ANCHOR-002 — Unique AnchorID

Anchor identifiers shall be unique within the Knowledge Object.

**Severity:** Error

---

### UDM-VAL-ANCHOR-003 — Valid Node Reference

Every Anchor shall reference exactly one existing Node.

**Severity:** Error

---

### UDM-VAL-ANCHOR-004 — Category Compatibility

The Anchor definition shall conform to its declared category:

* Structural;
* Content;
* Semantic.

**Severity:** Error

---

### UDM-VAL-ANCHOR-005 — Logical Bounds

A Content Anchor shall remain within the logical bounds of its target Node.

**Severity:** Error

---

### UDM-VAL-ANCHOR-006 — Renderer Independence

Canonical Anchors shall not use page numbers, screen coordinates or renderer-specific identifiers as their sole definition.

**Severity:** Fatal

---

### UDM-VAL-ANCHOR-007 — Resolution State

An Anchor that cannot currently be resolved shall be explicitly marked unresolved rather than silently redirected.

**Severity:** Warning or Error, according to usage

---

## 17. Relationship Rules

### UDM-VAL-REL-001 — Relationship Identity

Every UDM Relationship shall contain a valid immutable `RelationshipID`.

**Severity:** Error

---

### UDM-VAL-REL-002 — Minimum Endpoints

Every Relationship shall contain at least two valid endpoints.

**Severity:** Error

---

### UDM-VAL-REL-003 — Endpoint Resolution

Every internal endpoint shall resolve to an existing UDM element.

**Severity:** Error

---

### UDM-VAL-REL-004 — Relationship Type

Every Relationship shall use a registered relationship Type or a namespaced extension Type.

**Severity:** Error

---

### UDM-VAL-REL-005 — Direction Compatibility

The declared direction shall be compatible with the Relationship Type definition.

**Severity:** Error

---

### UDM-VAL-REL-006 — Relationship Provenance

Imported, inferred, AI-generated and plugin-generated Relationships shall preserve provenance.

**Severity:** Error

---

### UDM-VAL-REL-007 — Evidence References

Evidence references, when present, shall resolve to valid domain elements or external references.

**Severity:** Warning or Error, according to Relationship Type

---

## 18. Temporal Rules

### UDM-VAL-TIME-001 — Valid Temporal Type

Temporal values shall declare whether they represent:

* Event Time;
* Valid Time;
* Transaction Time.

**Severity:** Error

---

### UDM-VAL-TIME-002 — Interval Order

A closed temporal interval shall not end before it begins.

**Severity:** Error

---

### UDM-VAL-TIME-003 — Precision Preservation

Uncertain or partial dates shall not be converted into artificial exact dates.

**Severity:** Error

---

### UDM-VAL-TIME-004 — Confidence Declaration

Inferred temporal values shall declare provenance and confidence.

**Severity:** Error

---

### UDM-VAL-TIME-005 — Version Separation

Temporal semantics shall not be used as a replacement for version history.

**Severity:** Error

---

## 19. Attribute Rules

### UDM-VAL-ATTR-001 — Registered Attributes

Every official Attribute shall exist in the applicable Attribute Schema.

**Severity:** Error

---

### UDM-VAL-ATTR-002 — Required Attributes

Every required Attribute shall be present.

**Severity:** Error

---

### UDM-VAL-ATTR-003 — Data Type

Every Attribute value shall conform to its declared data type.

**Severity:** Error

---

### UDM-VAL-ATTR-004 — Cardinality

Every Attribute shall satisfy its declared cardinality.

**Severity:** Error

---

### UDM-VAL-ATTR-005 — Mutability

Immutable Attributes shall not change after creation.

**Severity:** Error

---

### UDM-VAL-ATTR-006 — Extension Namespace

Extension Attributes shall use a registered namespace.

**Severity:** Error

---

### UDM-VAL-ATTR-007 — Core Override Prohibition

Extension Attributes shall not override or redefine official core Attributes.

**Severity:** Fatal

---

## 20. Version Rules

### UDM-VAL-VER-001 — Version Presence

Every versioned canonical component shall declare a `VersionID`.

**Severity:** Error

---

### UDM-VAL-VER-002 — Parent Version

Every non-initial Version shall reference its parent Version or declared merge parents.

**Severity:** Error

---

### UDM-VAL-VER-003 — Append-Only History

Historical Versions shall not be altered.

**Severity:** Fatal

---

### UDM-VAL-VER-004 — Identity Continuity

Version evolution shall preserve the identity of the versioned component.

**Severity:** Fatal

---

### UDM-VAL-VER-005 — Valid Change Set

Every Version shall declare or reference the Change Set that produced it.

**Severity:** Error

---

### UDM-VAL-VER-006 — Integrity

A Version declaring an integrity hash shall match its canonical serialized state.

**Severity:** Fatal

---

## 21. Extension Rules

Extensions shall comply with all applicable core validation rules.

An extension shall declare:

* ExtensionID;
* namespace;
* schema version;
* supported UDM versions;
* introduced Types;
* introduced Attributes;
* validation rules;
* migration rules, when required.

Extensions shall not:

* redefine core Types;
* weaken identity rules;
* permit embedded binary Assets;
* create renderer-dependent canonical content;
* bypass provenance requirements.

Violation of these restrictions is fatal.

---

## 22. Import Validation

A newly generated UDM shall pass validation before registration as a managed Knowledge Object.

The Import Engine may create an intermediate invalid model during processing.

That model shall be explicitly identified as non-authoritative.

The final import result shall satisfy:

* all fatal rules;
* all error-level rules required for the target UDM profile;
* applicable source-specific validation rules.

Warnings may remain unresolved when preserved in the import report.

---

## 23. Incremental Validation

Validation may operate incrementally.

When a component changes, validation shall reevaluate:

* the changed component;
* its parent;
* its direct children;
* affected Anchors;
* affected Relationships;
* dependent projections.

Incremental validation shall produce the same result as a complete validation for the affected scope.

---

## 24. Validation Profiles

KnowledgeOS may define validation profiles for different processing stages.

### Import Profile

Permits incomplete intermediate state during acquisition and normalization.

### Canonical Profile

Required before the UDM becomes authoritative.

### Synchronization Profile

Validates identity, version and referential integrity.

### Export Profile

Validates all elements required by the target export format.

### Migration Profile

Validates compatibility before and after a UDM schema migration.

Profiles may change rule applicability but shall never weaken core fatal invariants.

---

## 25. Automatic Repair

Automatic repair is allowed only when:

* the correction is deterministic;
* canonical meaning is preserved;
* no information is discarded;
* the repair is recorded in Provenance;
* a new Version is created when canonical state changes.

Permitted examples may include:

* regenerating deterministic child order;
* adding a missing derived count;
* normalizing a registered Attribute representation;
* rebuilding a derived reference index.

Automatic repair shall not:

* invent missing canonical content;
* replace unresolved references with arbitrary targets;
* remove conflicting Nodes silently;
* alter uncertain semantic meaning;
* suppress provenance.

---

## 26. Validation Execution

Validation is executed by a UDM validation capability coordinated by the owning workflow.

Platform Engines may request validation, but they shall not redefine validation behavior.

Typical validation points include:

* after parsing;
* after normalization;
* before Library registration;
* after canonical modification;
* before synchronization;
* after synchronization merge;
* before export;
* after migration;
* during recovery.

---

## 27. Validation and Provenance

Every automatic correction affecting canonical state shall generate a Provenance event.

The event shall identify:

* ValidationRunID;
* RuleID;
* affected elements;
* previous Version;
* resulting Version;
* repair operation;
* responsible component.

Pure validation without modification does not alter canonical Provenance.

---

## 28. Validation and Projections

Graph, Search, Embedding, Timeline and other projections shall not be generated from a UDM that fails fatal canonical validation.

A projection may be generated from a UDM containing warnings if the projection declares the relevant limitations.

Projection validity is separate from UDM validity.

---

## 29. Validation Invariants

The following invariants govern all validation:

* validation is deterministic;
* fatal defects prevent canonical acceptance;
* repair never discards knowledge silently;
* validation results are traceable;
* core rules cannot be weakened by extensions;
* every canonical reference is verifiable;
* every canonical Node is reachable;
* every canonical identity is unique and stable.

---

## 30. Compliance

The following components shall comply with this document:

* Import Engine;
* Library Engine;
* Annotation Engine;
* Knowledge Engine;
* Sync Engine;
* Export Engine;
* Plugin Engine;
* UDM serialization implementations;
* UDM migration implementations.

No Platform Engine may persist an authoritative UDM state that violates fatal or mandatory error-level rules.

---

## 31. Related Documents

* `../UDM.md`
* `../Core/TypeSystem.md`
* `../Core/NodeModel.md`
* `../Core/NodeTypes.md`
* `../Core/NodeAttributes.md`
* `../Core/Identity.md`
* `../Core/TemporalModel.md`
* `../Nodes/StructuralNodes.md`
* `../Nodes/ContentNodes.md`
* `../Nodes/SemanticNodes.md`
* `../Nodes/AnnotationNodes.md`
* `../Nodes/AssetNodes.md`
* `../Nodes/Anchors.md`
* `../Graph/RelationshipModel.md`
* `ConsistencyRules.md`

---

## 32. Status

**Approved**

This document defines the mandatory validation rules of the Universal Document Model.

A UDM instance becomes authoritative only after satisfying all applicable canonical validation requirements defined by this specification.
